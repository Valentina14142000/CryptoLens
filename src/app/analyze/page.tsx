
"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BrainCircuit, Search, Loader2, Sparkles, FileText, BarChart3, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { aiTokenAnalysis, type AITokenAnalysisOutput } from "@/ai/flows/ai-token-analysis";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyzePage() {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AITokenAnalysisOutput | null>(null);

  async function handleAnalysis(e: React.FormEvent) {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const data = await aiTokenAnalysis({ tokenSymbol: query });
      setResult(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <BrainCircuit className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-headline font-bold">Intelligent Token Research</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our AI engine evaluates token fundamentals, project whitepapers, and market sentiment to give you a deep institutional-grade report.
          </p>
        </div>

        <form onSubmit={handleAnalysis} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter token ticker or name (e.g. BTC, Solana...)" 
              className="pl-10 h-12 bg-muted/50 border-border focus:ring-primary rounded-xl font-headline text-lg"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            Analyze
          </Button>
        </form>

        {loading && (
          <Card className="border-primary/20 bg-primary/5 animate-pulse">
            <CardContent className="py-12 flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <h3 className="text-xl font-headline font-medium">Crunching on-chain data...</h3>
              <p className="text-muted-foreground">Scanning whitepapers and aggregating market signals.</p>
            </CardContent>
          </Card>
        )}

        {result && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-xl">
                  {result.tokenSymbol[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-headline font-bold">{result.tokenSymbol}</h2>
                  <Badge variant="outline" className="text-accent border-accent/20">AI GENERATED REPORT</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg gap-2">
                <FileText className="w-4 h-4" /> Export PDF
              </Button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-muted/50 p-1 rounded-xl mb-4">
                <TabsTrigger value="overview" className="rounded-lg">Executive Overview</TabsTrigger>
                <TabsTrigger value="fundamentals" className="rounded-lg">Fundamentals</TabsTrigger>
                <TabsTrigger value="sentiment" className="rounded-lg">Market Sentiment</TabsTrigger>
                <TabsTrigger value="risks" className="rounded-lg">Risk Assessment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Project Vision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed text-lg">{result.overview}</p>
                    <div className="p-4 bg-muted/30 rounded-xl border border-border italic">
                      <span className="font-bold text-primary block mb-2 underline underline-offset-4">Whitepaper Summary:</span>
                      {result.whitepaperSummary}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fundamentals">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Core Utility & Technology
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{result.fundamentals}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sentiment">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Market Perception</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{result.sentiment}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risks">
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-destructive flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-destructive/90 leading-relaxed font-medium">{result.riskFactors}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-headline font-bold text-accent mb-1">Analyst Conclusion</h4>
                    <p className="text-muted-foreground leading-relaxed">{result.conclusion}</p>
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
