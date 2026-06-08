
import { AppShell } from "@/components/layout/app-shell";
import { SentimentPulse } from "@/components/dashboard/sentiment-pulse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, TrendingUp, Search, MessageSquare, Twitter, Globe, PieChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SentimentPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Gauge className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-bold">Market Sentiment Dashboard</h1>
              <p className="text-muted-foreground">Aggregate social signals and psychological indicators.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <SentimentPulse />
          </div>
          
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="border-border bg-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                     <CardTitle className="font-headline text-lg flex items-center gap-2">
                        <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                        Trending Narratives
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {[
                       { label: "#Layer2", intensity: "Very High", trend: "+420%" },
                       { label: "#AI_Agents", intensity: "High", trend: "+125%" },
                       { label: "#BitcoinHalving", intensity: "Rising", trend: "+84%" },
                       { label: "#DeFiSummer2.0", intensity: "Moderate", trend: "+12%" },
                     ].map(item => (
                       <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                          <span className="font-code font-bold text-sm text-primary">{item.label}</span>
                          <div className="text-right">
                             <div className="text-xs font-bold text-accent">{item.trend}</div>
                             <div className="text-[10px] text-muted-foreground uppercase">{item.intensity}</div>
                          </div>
                       </div>
                     ))}
                  </CardContent>
               </Card>

               <Card className="border-border bg-card">
                  <CardHeader>
                     <CardTitle className="font-headline text-lg flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-primary" />
                        Asset Dominance
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">BTC Dominance</span>
                              <span className="font-bold">52.4%</span>
                           </div>
                           <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: '52.4%' }} />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">ETH Dominance</span>
                              <span className="font-bold">17.2%</span>
                           </div>
                           <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-accent" style={{ width: '17.2%' }} />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Others</span>
                              <span className="font-bold">30.4%</span>
                           </div>
                           <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-muted-foreground/30" style={{ width: '30.4%' }} />
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <Card className="border-border bg-card">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-headline text-lg flex items-center gap-2">
                     <Globe className="w-5 h-5 text-accent" />
                     Global News Flow
                  </CardTitle>
                  <Badge variant="outline" className="border-accent/20 text-accent">LIVE UPDATES</Badge>
               </CardHeader>
               <CardContent className="space-y-4">
                  {[
                    { source: "Coindesk", title: "US SEC Approves First Spot Ethereum ETF", time: "14m ago", sentiment: "Positive" },
                    { source: "Bloomberg", title: "Institutional Bitcoin Holdings Reach All-Time High", time: "32m ago", sentiment: "Bullish" },
                    { source: "The Block", title: "Major DeFi Protocol Exploited for $12M", time: "1h ago", sentiment: "Negative" },
                  ].map((news, i) => (
                    <div key={i} className="flex gap-4 items-start p-3 hover:bg-muted/30 rounded-xl transition-colors">
                       <div className={`mt-1 shrink-0 w-2 h-2 rounded-full ${news.sentiment === 'Positive' || news.sentiment === 'Bullish' ? 'bg-accent' : 'bg-destructive'}`} />
                       <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{news.source}</span>
                             <span className="text-[10px] text-muted-foreground">{news.time}</span>
                          </div>
                          <h4 className="text-sm font-medium leading-tight">{news.title}</h4>
                       </div>
                    </div>
                  ))}
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
