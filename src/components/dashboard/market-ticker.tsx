
"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const tickers = [
  { symbol: "BTC", price: "64,241.20", change: "+1.2%", positive: true },
  { symbol: "ETH", price: "3,412.15", change: "-0.4%", positive: false },
  { symbol: "SOL", price: "142.80", change: "+5.1%", positive: true },
  { symbol: "BNB", price: "582.40", change: "+0.8%", positive: true },
  { symbol: "ARB", price: "1.12", change: "-2.3%", positive: false },
  { symbol: "TIA", price: "9.45", change: "+4.2%", positive: true },
];

export function MarketTicker() {
  return (
    <div className="w-full overflow-hidden bg-muted/30 border-y border-border py-2 mb-6">
      <div className="flex gap-8 animate-marquee whitespace-nowrap px-4">
        {[...tickers, ...tickers].map((ticker, idx) => (
          <div key={`${ticker.symbol}-${idx}`} className="flex items-center gap-2">
            <span className="font-code font-bold text-sm text-foreground">{ticker.symbol}</span>
            <span className="text-sm font-medium text-muted-foreground">${ticker.price}</span>
            <span className={cn(
              "text-xs font-bold flex items-center gap-0.5",
              ticker.positive ? "text-accent" : "text-destructive"
            )}>
              {ticker.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {ticker.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
