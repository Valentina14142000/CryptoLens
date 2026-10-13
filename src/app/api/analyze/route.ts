import { NextRequest, NextResponse } from 'next/server';
import { getTokenFacts } from '@/lib/data';
import { geminiJson } from '@/lib/gemini';
import type { AnalyzeResponse, TokenAnalysis, TokenFacts } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Best-effort per-IP limit (in-memory; resets on cold start).
const hits = new Map<string, number[]>();
function limited(ip: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > limit;
}

const s = (v: unknown) => (typeof v === 'string' ? v.slice(0, 2000) : '');

function buildPrompt(query: string, facts: TokenFacts | null): string {
  const today = new Date().toISOString().slice(0, 10);
  return `You are a careful crypto research analyst writing an EDUCATIONAL report. Today's date: ${today}.
Token requested by the user: "${query}".
Verified live market data from CoinGecko (treat as ground truth): ${facts ? JSON.stringify(facts) : 'NOT FOUND - no listing matched this query'}.

Return ONLY a JSON object with string keys: overview, fundamentals, marketContext, riskFactors, conclusion.
Rules:
- Each field is 2-5 plain sentences, no markdown.
- marketContext must use only the numbers supplied above (price, market cap, rank, 24h/7d/30d change, distance from all-time high, supply). Never invent numbers.
- Your background knowledge may be out of date: say so where it matters (team, roadmap, recent events).
- No price predictions, no buy/sell/hold advice, no "guaranteed" language.
- If the token was NOT FOUND or is unknown to you, say that plainly and keep every field short.
- conclusion: a neutral summary of the main trade-offs, ending with "This is not financial advice."`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (limited(ip)) return NextResponse.json<AnalyzeResponse>({ ok: false, error: 'Too many requests. Please wait a minute.' }, { status: 429 });

  let query = '';
  try {
    query = String(((await req.json()) as { token?: unknown }).token ?? '').trim();
  } catch {
    /* handled below */
  }
  if (!/^[\p{L}\p{N} .\-_]{1,40}$/u.test(query)) {
    return NextResponse.json<AnalyzeResponse>({ ok: false, error: 'Enter a token name or ticker (letters and numbers, up to 40 characters).' }, { status: 400 });
  }

  let facts: TokenFacts | null = null;
  try {
    facts = await getTokenFacts(query);
  } catch {
    facts = null; // market data unavailable: the report says so
  }

  try {
    const { data, model } = await geminiJson(buildPrompt(query, facts));
    const r = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
    const analysis: TokenAnalysis = {
      overview: s(r.overview),
      fundamentals: s(r.fundamentals),
      marketContext: s(r.marketContext),
      riskFactors: s(r.riskFactors),
      conclusion: s(r.conclusion),
    };
    return NextResponse.json<AnalyzeResponse>({ ok: true, facts, analysis, model });
  } catch (e) {
    return NextResponse.json<AnalyzeResponse>({ ok: false, error: e instanceof Error ? e.message : 'Analysis failed.' }, { status: 502 });
  }
}
