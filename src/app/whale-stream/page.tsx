
import { AppShell } from "@/components/layout/app-shell";
import { WhaleStream } from "@/components/dashboard/whale-stream";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, Filter, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statistics = [
  { label: "High Vol Moves (24h)", value: "1,241", change: "+12%", positive: true },
  { label: "Exchange Inflow", value: "$4.2B", change: "+5.2%", positive: false },
  { label: "Exchange Outflow", value: "$3.8B", change: "-2.1%", positive: true },
  { label: "Dormant Wallets Active", value: "42", change: "+8", positive: false },
];

export default function WhaleStreamPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Waves className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-bold">Whale Analytics Terminal</h1>
              <p className="text-muted-foreground">Monitoring significant institutional and high-net-worth wallet movements.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-border bg-card">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            <Button className="rounded-xl bg-primary shadow-lg shadow-primary/20">
              Setup Alert
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat) => (
            <Card key={stat.label} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-headline font-bold">{stat.value}</div>
                  <div className={`flex items-center text-xs font-bold ${stat.positive ? 'text-accent' : 'text-destructive'}`}>
                    {stat.positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WhaleStream />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Whale Accumulation Heatmap
                </CardTitle>
                <Badge variant="secondary" className="bg-muted text-muted-foreground uppercase text-[10px]">Updated Every 60s</Badge>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[400px]">
                 <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
                    <p className="text-muted-foreground font-medium">Aggregating Global Exchange Liquidity...</p>
                    <div className="flex gap-2 justify-center">
                       <div className="w-16 h-2 rounded-full bg-muted" />
                       <div className="w-16 h-2 rounded-full bg-muted" />
                       <div className="w-16 h-2 rounded-full bg-muted" />
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
