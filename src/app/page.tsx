"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MarketTicker } from "@/components/dashboard/market-ticker";
import TradingViewWidget from "@/components/charts/trading-view";
import { WhaleStream } from "@/components/dashboard/whale-stream";
import { SentimentPulse } from "@/components/dashboard/sentiment-pulse";
import { Portfolio } from "@/components/dashboard/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Globe } from "lucide-react";
import { useLive } from "@/hooks/use-live";
import { compact, pct } from "@/lib/format";
import type { MarketData } from "@/lib/types";

const SYMBOLS = [
  { label: "BTC", tv: "BINANCE:BTCUSDT" },
  { label: "ETH", tv: "BINANCE:ETHUSDT" },
  { label: "SOL", tv: "BINANCE:SOLUSDT" },
  { label: "BNB", tv: "BINANCE:BNBUSDT" },
  { label: "XRP", tv: "BINANCE:XRPUSDT" },
];

export default function Dashboard() {
  const [symbol, setSymbol] = React.useState(SYMBOLS[0]);
  const { data } = useLive<MarketData>("/api/market", 60_000);
  const g = data?.global;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-foreground">Market Terminal</h1>
          <p className="text-muted-foreground mt-1">Live prices, charts, large Bitcoin transactions and market sentiment.</p>
        </div>

        <MarketTicker />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-border bg-card shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/20 px-4 py-3 sm:px-6 sm:py-4 flex flex-row items-center justify-between flex-wrap gap-2">
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Advanced Charting
                </CardTitle>
                <div className="flex gap-1">
                  {SYMBOLS.map((s) => (
                    <Button key={s.label} size="sm" variant={s.label === symbol.label ? "default" : "outline"} onClick={() => setSymbol(s)}>
                      {s.label}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <TradingViewWidget symbol={symbol.tv} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-headline text-base flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Global Market</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Total market cap</span><span className="text-sm font-bold">{compact(g?.totalMarketCap)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">24h change</span><span className={`text-sm font-bold ${(g?.mcapChange24h ?? 0) >= 0 ? "text-accent" : "text-destructive"}`}>{pct(g?.mcapChange24h)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">24h volume</span><span className="text-sm font-bold">{compact(g?.totalVolume)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">BTC dominance</span><span className="text-sm font-bold text-primary">{g?.btcDominance != null ? `${g.btcDominance.toFixed(1)}%` : "—"}</span></div>
                </CardContent>
              </Card>
              <Portfolio />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <SentimentPulse />
            <WhaleStream />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
