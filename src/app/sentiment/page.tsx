"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SentimentPulse } from "@/components/dashboard/sentiment-pulse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, PieChart, Globe, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLive } from "@/hooks/use-live";
import { ago } from "@/lib/format";
import type { MarketData, NewsItem } from "@/lib/types";

export default function SentimentPage() {
  const { data } = useLive<MarketData>("/api/market", 120_000);
  const news = useLive<{ items: NewsItem[]; error?: string }>("/api/news", 300_000);
  const g = data?.global;
  const btc = g?.btcDominance ?? null;
  const eth = g?.ethDominance ?? null;
  const others = btc !== null && eth !== null ? Math.max(0, 100 - btc - eth) : null;
  const history = (data?.fng?.history ?? []).map((h) => ({ day: new Date(h.date * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }), value: h.value }));

  const bars = [
    { label: "BTC dominance", v: btc, cls: "bg-primary" },
    { label: "ETH dominance", v: eth, cls: "bg-accent" },
    { label: "Everything else", v: others, cls: "bg-muted-foreground/40" },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <Gauge className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold">Market Pulse</h1>
            <p className="text-muted-foreground">Fear &amp; Greed history, dominance, trending coins and headlines.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4"><SentimentPulse /></div>

          <div className="lg:col-span-8 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader><CardTitle className="font-headline text-lg">Fear &amp; Greed, last 30 days</CardTitle></CardHeader>
              <CardContent className="h-56">
                {history.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="value" name="Index" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground">History unavailable right now.</p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="font-headline text-lg flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500" /> Trending on CoinGecko</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {(data?.trending ?? []).slice(0, 6).map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                      <span className="font-code font-bold text-sm text-primary">{c.symbol}</span>
                      <span className="text-xs text-muted-foreground">{c.name}{c.rank ? ` · #${c.rank}` : ""}</span>
                    </div>
                  ))}
                  {!data?.trending?.length && <p className="text-sm text-muted-foreground">Unavailable right now.</p>}
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="font-headline text-lg flex items-center gap-2"><PieChart className="w-5 h-5 text-primary" /> Asset dominance</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {bars.map((b) => (
                    <div key={b.label} className="space-y-1">
                      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{b.label}</span><span className="font-bold">{b.v != null ? `${b.v.toFixed(1)}%` : "—"}</span></div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className={`h-full ${b.cls}`} style={{ width: `${b.v ?? 0}%` }} /></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-accent" /> Latest headlines</CardTitle>
                <Badge variant="outline" className="border-accent/20 text-accent">CRYPTOCOMPARE</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {(news.data?.items ?? []).map((n) => (
                  <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" className="block p-3 hover:bg-muted/30 rounded-xl transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{n.source}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time ? ago(n.time) : ""}</span>
                    </div>
                    <h4 className="text-sm font-medium leading-tight">{n.title}</h4>
                  </a>
                ))}
                {!news.data?.items?.length && <p className="text-sm text-muted-foreground">{news.loading ? "Loading..." : "Headlines unavailable right now."}</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
