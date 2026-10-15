"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MarketTicker } from "@/components/dashboard/market-ticker";
import { MarketList } from "@/components/dashboard/market-list";
import TradingViewWidget from "@/components/charts/trading-view";
import { WhaleStream } from "@/components/dashboard/whale-stream";
import { SentimentPulse } from "@/components/dashboard/sentiment-pulse";
import { Portfolio } from "@/components/dashboard/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Globe } from "lucide-react";
import { useLive } from "@/hooks/use-live";
import { compact, pct } from "@/lib/format";
import type { Coin, MarketData } from "@/lib/types";

const QUICK = ["BTC", "ETH", "SOL", "BNB", "XRP"];
const tv = (symbol: string) => `BINANCE:${symbol}USDT`;

export default function Dashboard() {
  const [symbol, setSymbol] = React.useState("BTC");
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { data } = useLive<MarketData>("/api/market", 60_000);
  const g = data?.global;

  function select(sym: string) {
    setSymbol(sym);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      chartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-foreground">Market Terminal</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Live prices, charts, large Bitcoin transactions and market sentiment.</p>
        </div>

        <MarketTicker />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3 min-w-0 space-y-4 sm:space-y-6">
            <Card ref={chartRef} className="border-border bg-card shadow-2xl overflow-hidden scroll-mt-20">
              <CardHeader className="border-b border-border bg-muted/20 px-4 py-3 sm:px-6 sm:py-4 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="font-headline text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  {symbol}/USDT chart
                </CardTitle>
                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
                  {QUICK.map((s) => (
                    <Button key={s} size="sm" variant={s === symbol ? "default" : "outline"} className="shrink-0" onClick={() => setSymbol(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <TradingViewWidget symbol={tv(symbol)} />
              </CardContent>
            </Card>

            <MarketList selected={symbol} onSelect={(c: Coin) => select(c.symbol)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-border bg-card min-w-0">
                <CardHeader>
                  <CardTitle className="font-headline text-base flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Global Market</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Total market cap</span><span className="text-sm font-bold">{compact(g?.totalMarketCap)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">24h change</span><span className={`text-sm font-bold ${(g?.mcapChange24h ?? 0) >= 0 ? "text-accent" : "text-destructive"}`}>{pct(g?.mcapChange24h)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">24h volume</span><span className="text-sm font-bold">{compact(g?.totalVolume)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">BTC dominance</span><span className="text-sm font-bold text-primary">{g?.btcDominance != null ? `${g.btcDominance.toFixed(1)}%` : "—"}</span></div>
                </CardContent>
              </Card>
              <Portfolio />
            </div>
          </div>

          <div className="lg:col-span-1 min-w-0 space-y-4 sm:space-y-6">
            <SentimentPulse />
            <WhaleStream />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
