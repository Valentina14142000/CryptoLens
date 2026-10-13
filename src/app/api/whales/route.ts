import { NextResponse } from 'next/server';
import { getWhales } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getWhales();
  return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' } });
}
