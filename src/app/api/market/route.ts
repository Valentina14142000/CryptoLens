import { NextResponse } from 'next/server';
import { getMarket } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getMarket();
  return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } });
}
