"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { WhaleStream } from "@/components/dashboard/whale-stream";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLive } from "@/hooks/use-live";
import { ago, compact } from "@/lib/format";
import type { WhaleData } from "@/lib/types";

const THRESHOLDS = [0, 10, 100, 1000];

export default function WhaleStreamPage() {
  const [minBtc, setMinBtc] = React.useState(10);
  const { data } = useLive<WhaleData>("/api/whales", 30_000);

  const stats = [
    { label: "Unconfirmed transactions", value: data?.mempool ? data.mempool.count.toLocaleString("en-US") : "—" },
    { label: "Largest in sample", value: data ? `${data.largestBtc.toLocaleString("en-US", { maximumFractionDigits: 1 })} BTC` : "—" },
    { label: "Moves ≥ 100 BTC (sample)", value: data ? String(data.over100) : "—" },
    { label: "Fast fee", value: data?.fees ? `${data.fees.fastest} sat/vB` : "—" },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Waves className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-bold">Whale Watch</h1>
              <p className="text-muted-foreground">Large unconfirmed Bitcoin transactions, straight from the network.</p>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-muted-foreground mr-2">Min size</span>
            {THRESHOLDS.map((t) => (
              <Button key={t} size="sm" variant={t === minBtc ? "default" : "outline"} onClick={() => setMinBtc(t)}>
                {t === 0 ? "All" : `${t} BTC`}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <Card key={s.label} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-1">{s.label}</div>
                <div className="text-2xl font-headline font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WhaleStream minBtc={minBtc} limit={15} />
          </div>
          <div className="lg:col-span-2">
            <Card className="border-border bg-card h-full">
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Network snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {data ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div><div className="text-muted-foreground">Mempool size</div><div className="font-bold">{data.mempool ? `${data.mempool.vsizeMB.toFixed(1)} vMB` : "—"}</div></div>
                      <div><div className="text-muted-foreground">Transactions sampled</div><div className="font-bold">{data.sampleSize.toLocaleString("en-US")}</div></div>
                      <div><div className="text-muted-foreground">Moves ≥ 1,000 BTC</div><div className="font-bold">{data.over1000}</div></div>
                      <div><div className="text-muted-foreground">BTC price</div><div className="font-bold">{compact(data.btcPrice)}</div></div>
                    </div>
                    {data.fees && (
                      <div>
                        <div className="text-muted-foreground mb-2">Recommended fees (sat/vB)</div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {[["Fastest", data.fees.fastest], ["~30 min", data.fees.halfHour], ["~1 hour", data.fees.hour], ["Economy", data.fees.economy]].map(([k, v]) => (
                            <div key={String(k)} className="rounded-xl bg-muted/30 border border-border p-3"><div className="text-lg font-bold">{v}</div><div className="text-[10px] uppercase text-muted-foreground">{k}</div></div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Updated {ago(data.updatedAt / 1000)}. Amounts are the sum of a transaction&apos;s outputs and can include change returning to the sender, so a large number is not always a large transfer. Wallet owners are not identified.
                      {data.errors.length > 0 && ` Some sources were unreachable: ${data.errors.join("; ")}.`}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Loading...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
