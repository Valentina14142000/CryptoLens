"use client";

import * as React from "react";
import { ExternalLink, Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLive } from "@/hooks/use-live";
import { ago, compact } from "@/lib/format";
import type { WhaleData } from "@/lib/types";

export function WhaleStream({ minBtc = 0, limit = 8 }: { minBtc?: number; limit?: number }) {
  const { data, error, loading } = useLive<WhaleData>("/api/whales", 30_000);
  const rows = (data?.txs ?? []).filter((t) => t.btc >= minBtc).slice(0, limit);

  return (
    <Card className="border-border bg-card shadow-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-headline flex items-center gap-2 text-lg">
          <Waves className="w-5 h-5 text-primary" />
          Large BTC Transactions
        </CardTitle>
        <Badge variant="outline" className="text-[10px] text-accent border-accent/20 bg-accent/5">LIVE MEMPOOL</Badge>
      </CardHeader>
      <CardContent className="px-0">
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            {loading ? "Loading..." : error ? `Feed unavailable (${error}).` : `No unconfirmed transactions of at least ${minBtc} BTC right now.`}
          </p>
        ) : (
          <div className="space-y-1">
            {rows.map((t) => (
              <a
                key={t.hash}
                href={`https://mempool.space/tx/${t.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 group"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", t.btc >= 1000 ? "bg-destructive animate-pulse" : t.btc >= 100 ? "bg-primary" : "bg-muted-foreground")} />
                    <span className="text-xs font-code font-bold text-primary uppercase">{t.btc >= 1000 ? "Mega" : t.btc >= 100 ? "Whale" : "Large"}</span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{ago(t.time)}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-foreground">{t.btc.toLocaleString("en-US", { maximumFractionDigits: 2 })} BTC</span>
                  <span className="text-xs text-muted-foreground">({compact(t.usd)})</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-code text-muted-foreground">
                  <span className="truncate max-w-[140px]">{t.hash.slice(0, 10)}…{t.hash.slice(-6)}</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}
        <p className="px-4 pt-3 text-[10px] text-muted-foreground">Unconfirmed on-chain transactions · blockchain.info · totals are sum of outputs</p>
      </CardContent>
    </Card>
  );
}
