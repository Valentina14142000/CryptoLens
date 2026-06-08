
import { AppShell } from "@/components/layout/app-shell";
import { MarketTicker } from "@/components/dashboard/market-ticker";
import TradingViewWidget from "@/components/charts/trading-view";
import { WhaleStream } from "@/components/dashboard/whale-stream";
import { SentimentPulse } from "@/components/dashboard/sentiment-pulse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, TrendingUp, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">Market Terminal</h1>
            <p className="text-muted-foreground mt-1">Real-time institutional-grade market data and charts.</p>
          </div>
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">24h</Badge>
            <Badge variant="ghost" className="text-muted-foreground">7d</Badge>
            <Badge variant="ghost" className="text-muted-foreground">1m</Badge>
            <Badge variant="ghost" className="text-muted-foreground">All</Badge>
          </div>
        </div>

        <MarketTicker />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-border bg-card shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/20 px-6 py-4 flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Advanced Charting System
                </CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground">Symbol: <span className="text-foreground font-code">BTCUSDT</span></span>
                  <div className="w-px h-4 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground">Timeframe: <span className="text-foreground font-code">1D</span></span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <TradingViewWidget />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-headline text-base">Institutional Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ETF Net Inflow (24h)</span>
                      <span className="text-sm font-bold text-accent">+$142.5M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Spot Delta</span>
                      <span className="text-sm font-bold text-destructive">-$12.2M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Open Interest</span>
                      <span className="text-sm font-bold text-primary">$32.1B</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-headline text-base">Portfolio Snapshot</CardTitle>
                  <Badge className="bg-accent/10 text-accent border-accent/20">PRO FEATURE</Badge>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Info className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-[200px]">Connect your wallet to track assets and gains in real-time.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <SentimentPulse />
             <WhaleStream />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
