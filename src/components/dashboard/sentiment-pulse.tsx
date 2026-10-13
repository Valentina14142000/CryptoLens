"use client";

import * as React from "react";
import { Gauge, Flame, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLive } from "@/hooks/use-live";
import { compact, pct } from "@/lib/format";
import type { MarketData } from "@/lib/types";

export function SentimentPulse() {
  const { data, loading } = useLive<MarketData>("/api/market", 120_000);
  const fng = data?.fng;
  const g = data?.global;

  return (
    <Card className="border-border bg-card shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <Gauge className="w-5 h-5 text-accent" />
          Market Pulse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {fng ? (
          <div className="text-center">
            <div className="text-4xl font-headline font-bold text-accent mb-1">{fng.value}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{fng.label}</div>
            <div className="mt-4 px-2">
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase mb-1">
                <span>Extreme Fear</span>
                <span>Neutral</span>
                <span>Extreme Greed</span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-destructive via-yellow-500 to-accent" />
                <div className="absolute top-0 h-full w-1 bg-white shadow-[0_0_8px_white] z-10 transition-all duration-1000" style={{ left: `${Math.min(99, fng.value)}%` }} />
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">Crypto Fear &amp; Greed Index · alternative.me</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">{loading ? "Loading index..." : "Fear & Greed index unavailable right now."}</p>
        )}

        <div className="space-y-3 pt-4 border-t border-border text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><PieChart className="w-3.5 h-3.5 text-primary" /> BTC dominance</span>
            <span className="font-bold">{g?.btcDominance != null ? `${g.btcDominance.toFixed(1)}%` : "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><Flame className="w-3.5 h-3.5 text-orange-500" /> Total market cap</span>
            <span className="font-bold">{compact(g?.totalMarketCap)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground pl-5">24h change</span>
            <span className={`font-bold ${(g?.mcapChange24h ?? 0) >= 0 ? "text-accent" : "text-destructive"}`}>{pct(g?.mcapChange24h)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
