// Gemini REST client: retries, model fallback, automatic model discovery, and readable errors.
// The API key stays on the server.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

type Attempt =
  | { ok: true; data: unknown }
  | { ok: false; detail: string; status: number; fatal?: boolean; skip?: boolean };

async function tryModel(model: string, key: string, body: string, deadline: number): Promise<Attempt> {
  let detail = '';
  let status = 502;
  for (let attempt = 0; attempt < 2; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining < 3000) return { ok: false, detail: detail || `${model}: out of time`, status: 504 };
    let res: Response;
    try {
      res = await fetch(`${BASE}/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body,
        signal: AbortSignal.timeout(Math.min(25_000, remaining)),
      });
    } catch (e) {
      detail = `${model}: ${(e as Error).name === 'TimeoutError' ? 'timed out' : 'network error'}`;
      status = 504;
      await sleep(500);
      continue;
    }
    status = res.status;
    if (res.ok) {
      const j = (await res.json().catch(() => null)) as { candidates?: { content?: { parts?: { text?: string }[] } }[] } | null;
      const text = j?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
      try {
        return { ok: true, data: JSON.parse(text.replace(/^```json\s*|```$/g, '').trim()) };
      } catch {
        detail = `${model}: reply was not valid JSON`;
        continue;
      }
    }
    const txt = (await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
    detail = `${model}: HTTP ${res.status} ${txt}`;
    if (res.status === 404) return { ok: false, detail, status, skip: true };
    if (res.status === 401 || res.status === 403 || (res.status === 400 && /api key/i.test(txt))) return { ok: false, detail, status, fatal: true };
    if (res.status === 400) return { ok: false, detail, status, skip: true };
    await sleep(800 * (attempt + 1));
  }
  return { ok: false, detail, status };
}

async function discoverModels(key: string): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/models?pageSize=200`, { headers: { 'x-goog-api-key': key }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const j = (await res.json()) as { models?: { name?: string; supportedGenerationMethods?: string[] }[] };
    return (j.models ?? [])
      .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m) => (m.name ?? '').replace(/^models\//, ''))
      .filter((n) => /flash/i.test(n) && !/image|tts|live|audio|embed|robotics|computer/i.test(n))
      .sort()
      .reverse()
      .slice(0, 4);
  } catch {
    return [];
  }
}

export async function geminiJson(prompt: string): Promise<{ data: unknown; model: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('Server is missing GEMINI_API_KEY.');
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
  });
  const deadline = Date.now() + 50_000;
  const tried = new Set<string>();
  let detail = '';
  let status = 502;

  async function run(models: string[]) {
    for (const m of models) {
      if (!m || tried.has(m)) continue;
      tried.add(m);
      const r = await tryModel(m, key as string, body, deadline);
      if (r.ok) return { data: r.data, model: m };
      detail = r.detail;
      status = r.status;
      if (r.fatal) throw new Error(`The AI provider rejected the request. Check GEMINI_API_KEY (${detail}).`);
    }
    return null;
  }

  let out = await run([process.env.GEMINI_MODEL ?? '', 'gemini-3.8-flash', 'gemini-flash-latest']);
  if (!out) out = await run(await discoverModels(key));
  if (out) return out;
  throw new Error(
    status === 429
      ? 'The AI service is busy (rate limit). Try again in a minute.'
      : `The AI service is unavailable (${detail || 'no response'}).`,
  );
}
