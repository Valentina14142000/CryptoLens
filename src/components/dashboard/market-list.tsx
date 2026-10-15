"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLive } from "@/hooks/use-live";
import { compact, pct, usd } from "@/lib/format";
import type { Coin, MarketData } from "@/lib/types";

export function MarketList({ selected, onSelect }: { selected: string; onSelect: (c: Coin) => void }) {
  const { data, loading, error } = useLive<MarketData>("/api/market", 60_000);
  const [all, setAll] = React.useState(false);
  const coins = (data?.coins ?? []).slice(0, all ? 20 : 10);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-headline text-base flex items-center gap-2"><List className="w-4 h-4 text-primary" /> Markets</CardTitle>
        <span className="text-[11px] text-muted-foreground">Tap a coin to chart it</span>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        {coins.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">{loading ? "Loading..." : `Prices unavailable${error ? ` (${error})` : ""}.`}</p>
        ) : (
          <ul>
            <li className="hidden sm:grid grid-cols-[2rem_1fr_7rem_5rem_7rem_7rem] gap-3 px-4 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>#</span><span>Coin</span><span className="text-right">Price</span><span className="text-right">24h</span><span className="text-right">Market cap</span><span className="text-right">Volume</span>
            </li>
            {coins.map((c, i) => {
              const up = (c.change24h ?? 0) >= 0;
              const active = c.symbol === selected;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(c)}
                    aria-pressed={active}
                    className={cn(
                      "w-full text-left px-4 py-3 border-t border-border/50 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:bg-muted/50",
                      "grid items-center gap-3 grid-cols-[1fr_auto] sm:grid-cols-[2rem_1fr_7rem_5rem_7rem_7rem]",
                      active && "bg-primary/10"
                    )}
                  >
                    <span className="hidden sm:block text-xs text-muted-foreground">{i + 1}</span>
                    <span className="flex items-center gap-3 min-w-0">
                      {c.image ? <img src={c.image} alt="" width={28} height={28} loading="lazy" className="w-7 h-7 rounded-full shrink-0" /> : <span className="w-7 h-7 rounded-full bg-muted shrink-0" />}
                      <span className="min-w-0">
                        <span className="block font-bold text-sm font-code">{c.symbol}</span>
                        <span className="block text-xs text-muted-foreground truncate">{c.name}</span>
                      </span>
                    </span>
                    <span className="text-right sm:order-none">
                      <span className="block text-sm font-medium">{usd(c.price)}</span>
                      <span className={cn("block text-xs font-bold sm:hidden", up ? "text-accent" : "text-destructive")}>{pct(c.change24h)}</span>
                    </span>
                    <span className={cn("hidden sm:block text-right text-sm font-bold", up ? "text-accent" : "text-destructive")}>{pct(c.change24h)}</span>
                    <span className="hidden sm:block text-right text-sm text-muted-foreground">{compact(c.marketCap)}</span>
                    <span className="hidden sm:block text-right text-sm text-muted-foreground">{compact(c.volume24h)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {(data?.coins?.length ?? 0) > 10 && (
          <div className="px-4 pt-2">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setAll((v) => !v)}>
              {all ? "Show top 10" : "Show top 20"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
