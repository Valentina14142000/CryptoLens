import { NextResponse } from 'next/server';
import { getNews } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getNews();
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' } });
  } catch (e) {
    return NextResponse.json({ items: [], error: e instanceof Error ? e.message : 'News unavailable' }, { status: 502 });
  }
}
