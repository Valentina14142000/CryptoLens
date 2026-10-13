// Server-side data access: CoinGecko, alternative.me, blockchain.info, mempool.space, CryptoCompare.
// All sources are free and keyless. Results are cached in memory and fall back to the last good value.
import type { Coin, FearGreed, GlobalStats, MarketData, NewsItem, TokenFacts, TrendingCoin, WhaleData, WhaleTx } from './types';

const CG = 'https://api.coingecko.com/api/v3';

const store = new Map<string, { t: number; v: unknown }>();
export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.t < ttlMs) return hit.v as T;
  try {
    const v = await fn();
    store.set(key, { t: Date.now(), v });
    return v;
  } catch (e) {
    if (hit) return hit.v as T; // serve stale data rather than failing
    throw e;
  }
}

async function getJson(url: string): Promise<unknown> {
  const headers: Record<string, string> = { accept: 'application/json', 'user-agent': 'CryptoLens/1.0' };
  if (url.startsWith(CG) && process.env.COINGECKO_API_KEY) headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  const res = await fetch(url, { headers, cache: 'no-store', signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${new URL(url).hostname} returned ${res.status}`);
  return res.json();
}

// ---------- helpers ----------
const num = (v: unknown): number | null => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
};
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const msg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

// ---------- parsers (pure, unit-tested) ----------
export function parseCoins(raw: unknown): Coin[] {
  return arr(raw).flatMap((c) => {
    const r = obj(c);
    const price = num(r.current_price);
    if (typeof r.id !== 'string' || price === null) return [];
    return [
      {
        id: r.id,
        symbol: str(r.symbol).toUpperCase(),
        name: str(r.name) || r.id,
        image: str(r.image),
        price,
        change24h: num(r.price_change_percentage_24h),
        marketCap: num(r.market_cap),
        volume24h: num(r.total_volume),
      },
    ];
  });
}

export function parseGlobal(raw: unknown): GlobalStats | null {
  const d = obj(obj(raw).data);
  if (!Object.keys(d).length) return null;
  return {
    totalMarketCap: num(obj(d.total_market_cap).usd),
    totalVolume: num(obj(d.total_volume).usd),
    btcDominance: num(obj(d.market_cap_percentage).btc),
    ethDominance: num(obj(d.market_cap_percentage).eth),
    mcapChange24h: num(d.market_cap_change_percentage_24h_usd),
  };
}

export function parseFng(raw: unknown): FearGreed | null {
  const rows = arr(obj(raw).data)
    .map((r) => ({ value: num(obj(r).value), date: num(obj(r).timestamp), label: str(obj(r).value_classification) }))
    .filter((r): r is { value: number; date: number; label: string } => r.value !== null && r.date !== null);
  if (!rows.length) return null;
  const newest = rows.reduce((a, b) => (b.date > a.date ? b : a));
  return {
    value: newest.value,
    label: newest.label,
    history: rows.map(({ value, date }) => ({ value, date })).sort((a, b) => a.date - b.date),
  };
}

export function parseTrending(raw: unknown): TrendingCoin[] {
  return arr(obj(raw).coins).flatMap((c) => {
    const i = obj(obj(c).item);
    if (typeof i.id !== 'string') return [];
    return [{ id: i.id, name: str(i.name), symbol: str(i.symbol).toUpperCase(), rank: num(i.market_cap_rank), thumb: str(i.thumb) }];
  });
}

export function parseUnconfirmed(raw: unknown, btcPrice: number | null): WhaleTx[] {
  return arr(obj(raw).txs).flatMap((t) => {
    const r = obj(t);
    const sats = arr(r.out).reduce<number>((s, o) => s + (num(obj(o).value) ?? 0), 0);
    const btc = sats / 1e8;
    if (typeof r.hash !== 'string' || btc <= 0) return [];
    return [{ hash: r.hash, btc, usd: btcPrice === null ? null : btc * btcPrice, time: num(r.time) ?? Math.floor(Date.now() / 1000) }];
  });
}

export function parseNews(raw: unknown): NewsItem[] {
  return arr(obj(raw).Data)
    .flatMap((n) => {
      const r = obj(n);
      const url = str(r.url);
      if (!str(r.title) || !/^https?:\/\//.test(url)) return [];
      return [
        {
          id: str(r.id) || url,
          title: str(r.title),
          url,
          source: str(obj(r.source_info).name) || str(r.source),
          time: num(r.published_on) ?? 0,
          categories: str(r.categories).split('|').filter(Boolean).slice(0, 3),
        },
      ];
    })
    .slice(0, 12);
}

export function parseFacts(raw: unknown): TokenFacts | null {
  const r = obj(raw);
  const m = obj(r.market_data);
  if (typeof r.id !== 'string') return null;
  const usd = (k: string) => num(obj(m[k]).usd);
  return {
    id: r.id,
    name: str(r.name),
    symbol: str(r.symbol).toUpperCase(),
    rank: num(r.market_cap_rank),
    price: usd('current_price'),
    marketCap: usd('market_cap'),
    change24h: num(m.price_change_percentage_24h),
    change7d: num(m.price_change_percentage_7d),
    change30d: num(m.price_change_percentage_30d),
    ath: usd('ath'),
    athChangePct: usd('ath_change_percentage'),
    circulating: num(m.circulating_supply),
    totalSupply: num(m.total_supply),
    maxSupply: num(m.max_supply),
    categories: arr(r.categories).filter((c): c is string => typeof c === 'string').slice(0, 6),
    description: str(obj(r.description).en).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 1500),
    homepage: str(arr(obj(r.links).homepage)[0]) || null,
  };
}

// ---------- fetchers ----------
export async function getMarket(): Promise<MarketData> {
  const [coins, glob, fng, trend] = await Promise.allSettled([
    cached('cg:markets', 60_000, () => getJson(`${CG}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&price_change_percentage=24h`)),
    cached('cg:global', 120_000, () => getJson(`${CG}/global`)),
    cached('fng', 300_000, () => getJson('https://api.alternative.me/fng/?limit=30')),
    cached('cg:trending', 300_000, () => getJson(`${CG}/search/trending`)),
  ]);
  const errors: string[] = [];
  const ok = <T,>(r: PromiseSettledResult<unknown>, parse: (v: unknown) => T, empty: T): T => {
    if (r.status === 'fulfilled') return parse(r.value);
    errors.push(msg(r.reason));
    return empty;
  };
  return {
    coins: ok(coins, parseCoins, []),
    global: ok(glob, parseGlobal, null),
    fng: ok(fng, parseFng, null),
    trending: ok(trend, parseTrending, []),
    updatedAt: Date.now(),
    errors,
  };
}

export async function getWhales(): Promise<WhaleData> {
  const errors: string[] = [];
  const market = await getMarket();
  const btcPrice = market.coins.find((c) => c.id === 'bitcoin')?.price ?? null;

  const [tx, pool, fee] = await Promise.allSettled([
    cached('bc:unconfirmed', 20_000, () => getJson('https://blockchain.info/unconfirmed-transactions?format=json')),
    cached('mp:mempool', 20_000, () => getJson('https://mempool.space/api/mempool')),
    cached('mp:fees', 30_000, () => getJson('https://mempool.space/api/v1/fees/recommended')),
  ]);

  let all: WhaleTx[] = [];
  if (tx.status === 'fulfilled') all = parseUnconfirmed(tx.value, btcPrice);
  else errors.push(msg(tx.reason));
  all.sort((a, b) => b.btc - a.btc);

  let mempool: WhaleData['mempool'] = null;
  if (pool.status === 'fulfilled') {
    const p = obj(pool.value);
    const count = num(p.count);
    const vsize = num(p.vsize);
    if (count !== null && vsize !== null) mempool = { count, vsizeMB: vsize / 1e6 };
  } else errors.push(msg(pool.reason));

  let fees: WhaleData['fees'] = null;
  if (fee.status === 'fulfilled') {
    const f = obj(fee.value);
    const fastest = num(f.fastestFee), halfHour = num(f.halfHourFee), hour = num(f.hourFee), economy = num(f.economyFee);
    if (fastest !== null && halfHour !== null && hour !== null && economy !== null) fees = { fastest, halfHour, hour, economy };
  } else errors.push(msg(fee.reason));

  return {
    btcPrice,
    sampleSize: all.length,
    txs: all.slice(0, 25),
    over100: all.filter((t) => t.btc >= 100).length,
    over1000: all.filter((t) => t.btc >= 1000).length,
    largestBtc: all[0]?.btc ?? 0,
    mempool,
    fees,
    updatedAt: Date.now(),
    errors,
  };
}

export async function getNews(): Promise<NewsItem[]> {
  return cached('news', 300_000, async () => parseNews(await getJson('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')));
}

export async function getTokenFacts(query: string): Promise<TokenFacts | null> {
  const q = query.trim().toLowerCase();
  const search = obj(await cached(`cg:search:${q}`, 600_000, () => getJson(`${CG}/search?query=${encodeURIComponent(query.trim())}`)));
  const coins = arr(search.coins).map(obj);
  if (!coins.length) return null;
  const exact = coins.filter((c) => str(c.symbol).toLowerCase() === q || str(c.name).toLowerCase() === q || str(c.id).toLowerCase() === q);
  const pool = exact.length ? exact : coins;
  const best = [...pool].sort((a, b) => (num(a.market_cap_rank) ?? 1e9) - (num(b.market_cap_rank) ?? 1e9))[0];
  const id = str(best.id);
  if (!id) return null;
  const raw = await cached(`cg:coin:${id}`, 300_000, () =>
    getJson(`${CG}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`),
  );
  return parseFacts(raw);
}
