"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BrainCircuit, Search, Loader2, Sparkles, FileText, BarChart3, ShieldAlert, CheckCircle2, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { compact, pct, usd } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/types";

export default function AnalyzePage() {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState<AnalyzeResponse | null>(null);

  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q")?.trim();
    if (q) {
      setQuery(q);
      void runAnalysis(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAnalysis(e: React.FormEvent) {
    e.preventDefault();
    void runAnalysis(query.trim());
  }

  async function runAnalysis(token: string) {
    if (!token) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => null)) as AnalyzeResponse | null;
      if (!res.ok || !data?.ok || !data.analysis) throw new Error(data?.error ?? `Request failed (${res.status}).`);
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!result?.analysis) return;
    const f = result.facts;
    const a = result.analysis;
    const md = `# ${f?.name ?? query} (${f?.symbol ?? "n/a"}) research report\n\nGenerated ${new Date().toISOString()} by CryptoLens. AI-generated, educational only, not financial advice.\n\n${
      f ? `## Live data (CoinGecko)\n- Price: ${usd(f.price)}\n- Market cap: ${compact(f.marketCap)} (rank ${f.rank ?? "n/a"})\n- Change 24h / 7d / 30d: ${pct(f.change24h)} / ${pct(f.change7d)} / ${pct(f.change30d)}\n\n` : ""
    }## Overview\n${a.overview}\n\n## Fundamentals\n${a.fundamentals}\n\n## Market context\n${a.marketContext}\n\n## Risk factors\n${a.riskFactors}\n\n## Conclusion\n${a.conclusion}\n`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    link.download = `${(f?.symbol ?? query).toLowerCase()}-report.md`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  const f = result?.facts;
  const a = result?.analysis;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <BrainCircuit className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold">Intelligent Token Research</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Live CoinGecko data plus an AI-written briefing on fundamentals, market context and risks. Educational only, not financial advice.
          </p>
        </div>

        <form onSubmit={handleAnalysis} className="w-full max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={40}
              placeholder="Enter token ticker or name (e.g. BTC, Solana...)"
              className="pl-10 h-12 bg-muted/50 border-border focus:ring-primary rounded-xl font-headline text-base sm:text-lg"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading || !query.trim()} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            Analyze
          </Button>
        </form>

        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {loading && (
          <Card className="border-primary/20 bg-primary/5 animate-pulse">
            <CardContent className="py-12 flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <h3 className="text-xl font-headline font-medium">Fetching market data and writing the report...</h3>
              <p className="text-muted-foreground">This usually takes 5 to 15 seconds.</p>
            </CardContent>
          </Card>
        )}

        {a && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-xl">
                  {(f?.symbol ?? query)[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-headline font-bold">{f ? `${f.name} (${f.symbol})` : query}</h2>
                  <Badge variant="outline" className="text-accent border-accent/20">AI GENERATED · EDUCATIONAL</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg gap-2" onClick={download}>
                <FileText className="w-4 h-4" /> Download report
              </Button>
            </div>

            {f ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { k: "Price", v: usd(f.price) },
                  { k: "Market cap", v: `${compact(f.marketCap)}${f.rank ? ` · #${f.rank}` : ""}` },
                  { k: "24h", v: pct(f.change24h), c: (f.change24h ?? 0) >= 0 },
                  { k: "30d", v: pct(f.change30d), c: (f.change30d ?? 0) >= 0 },
                ].map((s) => (
                  <Card key={s.k} className="border-border">
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.k}</div>
                      <div className={`text-lg font-bold ${s.c === undefined ? "" : s.c ? "text-accent" : "text-destructive"}`}>{s.v}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="py-3 text-sm text-yellow-200/90">No CoinGecko listing matched this query, so the report has no live market data.</CardContent>
              </Card>
            )}

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-muted/50 p-1 rounded-xl mb-4 flex-wrap h-auto">
                <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="fundamentals" className="rounded-lg">Fundamentals</TabsTrigger>
                <TabsTrigger value="market" className="rounded-lg">Market context</TabsTrigger>
                <TabsTrigger value="risks" className="rounded-lg">Risks</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card className="border-border"><CardHeader><CardTitle className="font-headline text-xl">Project overview</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground leading-relaxed text-base sm:text-lg">{a.overview}</p></CardContent></Card>
              </TabsContent>
              <TabsContent value="fundamentals">
                <Card className="border-border"><CardHeader><CardTitle className="font-headline text-xl flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />Utility and technology</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground leading-relaxed">{a.fundamentals}</p></CardContent></Card>
              </TabsContent>
              <TabsContent value="market">
                <Card className="border-border"><CardHeader><CardTitle className="font-headline text-xl flex items-center gap-2"><LineChart className="w-5 h-5 text-primary" />Market context</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground leading-relaxed">{a.marketContext}</p></CardContent></Card>
              </TabsContent>
              <TabsContent value="risks">
                <Card className="border-destructive/20 bg-destructive/5"><CardHeader><CardTitle className="font-headline text-xl text-destructive flex items-center gap-2"><ShieldAlert className="w-5 h-5" />Risk factors</CardTitle></CardHeader>
                  <CardContent><p className="text-destructive/90 leading-relaxed font-medium">{a.riskFactors}</p></CardContent></Card>
              </TabsContent>
            </Tabs>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-headline font-bold text-accent mb-1">Summary</h4>
                    <p className="text-muted-foreground leading-relaxed">{a.conclusion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
