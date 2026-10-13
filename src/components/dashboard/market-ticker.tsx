"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLive } from "@/hooks/use-live";
import { usd, pct } from "@/lib/format";
import type { MarketData } from "@/lib/types";

export function MarketTicker() {
  const { data, error, loading } = useLive<MarketData>("/api/market", 60_000);
  const coins = (data?.coins ?? []).slice(0, 10);

  if (!coins.length) {
    return (
      <div className="w-full bg-muted/30 border-y border-border py-2 mb-6 px-4 text-xs text-muted-foreground">
        {loading ? "Loading live prices..." : `Live prices unavailable${error ? ` (${error})` : ""}. Retrying automatically.`}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-muted/30 border-y border-border py-2 mb-6">
      <div className="flex gap-8 animate-marquee whitespace-nowrap px-4">
        {[...coins, ...coins].map((c, idx) => {
          const up = (c.change24h ?? 0) >= 0;
          return (
            <div key={`${c.id}-${idx}`} className="flex items-center gap-2">
              <span className="font-code font-bold text-sm text-foreground">{c.symbol}</span>
              <span className="text-sm font-medium text-muted-foreground">{usd(c.price)}</span>
              <span className={cn("text-xs font-bold flex items-center gap-0.5", up ? "text-accent" : "text-destructive")}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {pct(c.change24h)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
