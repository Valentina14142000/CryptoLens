
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GraduationCap, PlayCircle, BookOpen, Clock, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const modules = [
  { 
    id: "academy-intro", 
    title: "Blockchain Foundations", 
    description: "Master the basics of distributed ledger technology and consensus mechanisms.",
    level: "Beginner",
    duration: "45m",
    points: 100,
    category: "Basics"
  },
  { 
    id: "academy-defi", 
    title: "DeFi Ecosystems", 
    description: "Learn about AMMs, liquidity pools, and yield farming strategies.",
    level: "Intermediate",
    duration: "1h 20m",
    points: 250,
    category: "DeFi"
  },
  { 
    id: "academy-security", 
    title: "On-Chain Security", 
    description: "Best practices for cold storage, multisig wallets, and avoiding exploits.",
    level: "Advanced",
    duration: "55m",
    points: 200,
    category: "Security"
  },
  { 
    id: "academy-trading", 
    title: "Technical Analysis Pro", 
    description: "Candlestick patterns, RSI, and MACD indicators for precision trading.",
    level: "Expert",
    duration: "2h",
    points: 500,
    category: "Trading"
  },
];

export default function AcademyPage() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-primary/5 p-8 rounded-3xl border border-primary/20 relative overflow-hidden">
          <div className="z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full text-xs font-bold text-primary tracking-wider uppercase">
              <Star className="w-3 h-3" /> Academy Passport
            </div>
            <h1 className="text-4xl font-headline font-bold">CryptoLens Academy</h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Elevate your blockchain knowledge with our curated micro-learning units and expert research papers.
            </p>
            <Button size="lg" className="rounded-xl bg-primary shadow-xl shadow-primary/30">
              Start Learning Journey
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10 hidden lg:block">
             <GraduationCap className="w-48 h-48 text-primary opacity-20" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-lg font-bold">12</div>
              <div className="text-xs text-muted-foreground uppercase font-medium">Courses</div>
            </div>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-bold">48</div>
              <div className="text-xs text-muted-foreground uppercase font-medium">Video Lessons</div>
            </div>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-lg font-bold">2,400</div>
              <div className="text-xs text-muted-foreground uppercase font-medium">Earned XP</div>
            </div>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-lg font-bold">3</div>
              <div className="text-xs text-muted-foreground uppercase font-medium">Certificates</div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-headline font-bold">Available Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((module) => {
            const placeholder = PlaceHolderImages.find(p => p.id === module.id);
            return (
              <Card key={module.id} className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  {placeholder && (
                    <Image 
                      src={placeholder.imageUrl} 
                      alt={module.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      data-ai-hint={placeholder.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md">{module.category}</Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="font-headline text-xl">{module.title}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Clock className="w-3 h-3" /> {module.duration}
                    </div>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                    {module.description}
                  </p>
                </CardHeader>
                <CardFooter className="flex justify-between items-center border-t border-border pt-4">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">{module.level}</Badge>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">+{module.points} XP</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors">
                    Enroll Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
