"use client";

import * as React from "react";
import { Trash2, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLive } from "@/hooks/use-live";
import { usd } from "@/lib/format";
import type { MarketData } from "@/lib/types";

interface Holding { id: string; amount: number }
const KEY = "cryptolens:portfolio";

export function Portfolio() {
  const { data } = useLive<MarketData>("/api/market", 60_000);
  const [holdings, setHoldings] = React.useState<Holding[]>([]);
  const [coinId, setCoinId] = React.useState("bitcoin");
  const [amount, setAmount] = React.useState("");
  const loaded = React.useRef(false);

  React.useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(v)) setHoldings(v as Holding[]);
    } catch { /* ignore */ }
    loaded.current = true;
  }, []);
  React.useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify(holdings)); } catch { /* ignore */ }
  }, [holdings]);

  const coins = data?.coins ?? [];
  const byId = new Map(coins.map((c) => [c.id, c]));
  const total = holdings.reduce((s, h) => s + h.amount * (byId.get(h.id)?.price ?? 0), 0);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return;
    setHoldings((h) => {
      const i = h.findIndex((x) => x.id === coinId);
      if (i === -1) return [...h, { id: coinId, amount: n }];
      const copy = [...h];
      copy[i] = { id: coinId, amount: copy[i].amount + n };
      return copy;
    });
    setAmount("");
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-base flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /> My Portfolio</CardTitle>
        <span className="text-sm font-bold">{usd(total)}</span>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={add} className="flex gap-2">
          <select
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
            className="h-10 rounded-md border border-border bg-muted/50 px-2 text-sm"
            aria-label="Coin"
          >
            {(coins.length ? coins : [{ id: "bitcoin", symbol: "BTC" }]).map((c) => (
              <option key={c.id} value={c.id}>{c.symbol}</option>
            ))}
          </select>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" inputMode="decimal" className="h-10" aria-label="Amount" />
          <Button type="submit" size="sm" className="h-10">Add</Button>
        </form>
        {holdings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add what you hold to see its live value. Stored only in this browser.</p>
        ) : (
          <ul className="space-y-2">
            {holdings.map((h) => {
              const c = byId.get(h.id);
              return (
                <li key={h.id} className="flex items-center justify-between text-sm">
                  <span><span className="font-code font-bold">{c?.symbol ?? h.id}</span> <span className="text-muted-foreground">{h.amount}</span></span>
                  <span className="flex items-center gap-3">
                    <span>{c ? usd(h.amount * c.price) : "—"}</span>
                    <button onClick={() => setHoldings((x) => x.filter((y) => y.id !== h.id))} aria-label={`Remove ${c?.symbol ?? h.id}`} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
