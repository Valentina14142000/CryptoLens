
"use client";

import * as React from "react";
import { ArrowRight, ExternalLink, ShieldCheck, Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const whaleMoves = [
  { id: 1, type: "Transfer", asset: "BTC", amount: "420.00", value: "27.1M", from: "Unknown Wallet", to: "Binance", time: "2m ago", importance: "high" },
  { id: 2, type: "Withdrawal", asset: "ETH", amount: "5,000", value: "17.0M", from: "Coinbase", to: "Private Wallet", time: "12m ago", importance: "medium" },
  { id: 3, type: "Mint", asset: "USDT", amount: "100M", value: "100M", from: "Tether Treasury", to: "Bitfinex", time: "25m ago", importance: "critical" },
  { id: 4, type: "Transfer", asset: "SOL", amount: "150,000", value: "21.4M", from: "Unknown Wallet", to: "Unknown Wallet", time: "44m ago", importance: "high" },
];

export function WhaleStream() {
  return (
    <Card className="border-border bg-card shadow-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-headline flex items-center gap-2 text-lg">
          <Waves className="w-5 h-5 text-primary" />
          Whale Watcher
        </CardTitle>
        <Badge variant="outline" className="text-[10px] text-accent border-accent/20 bg-accent/5">LIVE FEED</Badge>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-1">
          {whaleMoves.map((move) => (
            <div key={move.id} className="px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 group cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    move.importance === 'critical' ? 'bg-destructive animate-pulse' : 
                    move.importance === 'high' ? 'bg-primary' : 'bg-muted-foreground'
                  )} />
                  <span className="text-xs font-code font-bold text-primary uppercase">{move.type}</span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">{move.time}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-foreground">{move.amount} {move.asset}</span>
                <span className="text-xs text-muted-foreground">(${move.value})</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-code text-muted-foreground">
                <span className="truncate max-w-[80px] hover:text-primary transition-colors">{move.from}</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[80px] hover:text-primary transition-colors">{move.to}</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
