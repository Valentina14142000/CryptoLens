
"use client";

import * as React from "react";
import { Gauge, MessageSquare, Twitter, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function SentimentPulse() {
  const fearGreedValue = 68; // Greed
  
  return (
    <Card className="border-border bg-card shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2">
          <Gauge className="w-5 h-5 text-accent" />
          Market Pulse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="relative inline-flex flex-col items-center">
             <div className="text-4xl font-headline font-bold text-accent mb-1">{fearGreedValue}</div>
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Greed Index</div>
          </div>
          <div className="mt-4 px-2">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase mb-1">
              <span>Extreme Fear</span>
              <span>Neutral</span>
              <span>Extreme Greed</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-destructive via-yellow-500 to-accent" style={{ width: '100%' }} />
               <div className="absolute top-0 h-full w-1 bg-white shadow-[0_0_8px_white] z-10 transition-all duration-1000" style={{ left: `${fearGreedValue}%` }} />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
              <span>X (Twitter) Sentiment</span>
            </div>
            <span className="font-bold text-accent">Bulish (72%)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
              <span>Reddit Activity</span>
            </div>
            <span className="font-bold text-primary">High (8.4k/hr)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Radio className="w-3.5 h-3.5 text-accent" />
              <span>News Momentum</span>
            </div>
            <span className="font-bold text-accent">Positive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
