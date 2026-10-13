<div align="center">

# 🔍 CryptoLens

**Live crypto market terminal with AI-assisted token research**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

> **Research tool only. Not financial advice.** Crypto assets are volatile and you can lose everything you invest. AI-written text can be wrong or out of date.

## What is real

Everything on screen comes from a live source or from your own input. Nothing is mocked.

| Feature | Data source |
|---|---|
| Price ticker, global market cap, dominance, trending coins | [CoinGecko](https://www.coingecko.com/en/api) public API |
| Fear & Greed gauge and 30-day history | [alternative.me](https://alternative.me/crypto/fear-and-greed-index/) |
| Large Bitcoin transactions (unconfirmed) | [blockchain.info](https://www.blockchain.com/explorer/api) |
| Mempool size and recommended fees | [mempool.space](https://mempool.space/docs/api) |
| Headlines | [CryptoCompare](https://min-api.cryptocompare.com/) news API |
| Charts | TradingView embedded widget (BTC, ETH, SOL, BNB, XRP, plus its own symbol search) |
| AI token report | Gemini, grounded on the live CoinGecko facts for the token you search |
| Portfolio and Academy progress | Saved only in your browser (`localStorage`) |

**Limits worth knowing:** the whale feed shows the sum of a transaction's outputs, which can include change returning to the sender, and wallet owners are not identified. Free public APIs are rate limited, so each endpoint caches results and serves the last good data if a source is down. The AI report is instructed not to give price predictions or buy/sell advice.

## Run locally

```bash
git clone https://github.com/Valentina14142000/CryptoLens.git
cd CryptoLens
npm install
cp .env.example .env.local      # then set GEMINI_API_KEY (free: https://aistudio.google.com/apikey)
npm run dev                     # http://localhost:3000
```

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | For AI Analysis | Server-side only, never sent to the browser |
| `COINGECKO_API_KEY` | No | Free demo key for higher CoinGecko rate limits |
| `GEMINI_MODEL` | No | Override the default model (falls back automatically if one is retired) |

Scripts: `npm run dev`, `npm run build`, `npm run typecheck`.

## Deploy on Vercel (free)

1. Import this repository at [vercel.com/new](https://vercel.com/new). The Next.js preset is detected automatically.
2. Add the environment variable `GEMINI_API_KEY` (mark it Sensitive).
3. Deploy. If the link asks visitors to sign in, turn off **Settings → Deployment Protection → Vercel Authentication**.

## Architecture

```
src/app/api/market    prices, global stats, Fear & Greed, trending
src/app/api/whales    large unconfirmed BTC transactions, mempool, fees
src/app/api/news      headlines
src/app/api/analyze   token lookup + Gemini report (key stays on the server)
src/lib/data.ts       fetchers, parsers, in-memory cache with stale-on-error
src/lib/gemini.ts     Gemini REST client with retry and model fallback
src/components        dashboard widgets, layout, shadcn/ui primitives
```

## License

MIT
