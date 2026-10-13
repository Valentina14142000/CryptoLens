// Types shared by API routes (server) and components (client). No server imports here.

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number | null;
  marketCap: number | null;
  volume24h: number | null;
}

export interface GlobalStats {
  totalMarketCap: number | null;
  totalVolume: number | null;
  btcDominance: number | null;
  ethDominance: number | null;
  mcapChange24h: number | null;
}

export interface FearGreed {
  value: number;
  label: string;
  history: { value: number; date: number }[]; // oldest first, date = unix seconds
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  rank: number | null;
  thumb: string;
}

export interface MarketData {
  coins: Coin[];
  global: GlobalStats | null;
  fng: FearGreed | null;
  trending: TrendingCoin[];
  updatedAt: number;
  errors: string[];
}

export interface WhaleTx {
  hash: string;
  btc: number;
  usd: number | null;
  time: number; // unix seconds
}

export interface WhaleData {
  btcPrice: number | null;
  sampleSize: number;
  txs: WhaleTx[]; // largest first
  over100: number;
  over1000: number;
  largestBtc: number;
  mempool: { count: number; vsizeMB: number } | null;
  fees: { fastest: number; halfHour: number; hour: number; economy: number } | null;
  updatedAt: number;
  errors: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  time: number; // unix seconds
  categories: string[];
}

export interface TokenFacts {
  id: string;
  name: string;
  symbol: string;
  rank: number | null;
  price: number | null;
  marketCap: number | null;
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
  ath: number | null;
  athChangePct: number | null;
  circulating: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  categories: string[];
  description: string;
  homepage: string | null;
}

export interface TokenAnalysis {
  overview: string;
  fundamentals: string;
  marketContext: string;
  riskFactors: string;
  conclusion: string;
}

export interface AnalyzeResponse {
  ok: boolean;
  error?: string;
  facts?: TokenFacts | null;
  analysis?: TokenAnalysis;
  model?: string;
}
