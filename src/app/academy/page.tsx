"use client";

import * as React from "react";
import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, BookOpen, Clock, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LESSONS, type Lesson } from "@/data/lessons";

const KEY = "cryptolens:academy";

export default function AcademyPage() {
  const [done, setDone] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState<Lesson | null>(null);
  const loaded = React.useRef(false);

  React.useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(v)) setDone(v.filter((x): x is string => typeof x === "string"));
    } catch { /* ignore */ }
    loaded.current = true;
  }, []);
  React.useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify(done)); } catch { /* ignore */ }
  }, [done]);

  const xp = LESSONS.filter((l) => done.includes(l.id)).reduce((s, l) => s + l.points, 0);
  const totalXp = LESSONS.reduce((s, l) => s + l.points, 0);
  const next = LESSONS.find((l) => !done.includes(l.id));

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-primary/5 p-5 sm:p-8 rounded-3xl border border-primary/20 relative overflow-hidden">
          <div className="z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full text-xs font-bold text-primary tracking-wider uppercase">
              <Star className="w-3 h-3" /> Learning progress
            </div>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold">CryptoLens Academy</h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl">Short, practical lessons on blockchain, DeFi, security and charting. Progress is saved in this browser.</p>
            <Button size="lg" className="rounded-xl bg-primary shadow-xl shadow-primary/30" onClick={() => setOpen(next ?? LESSONS[0])}>
              {next ? (done.length ? "Continue learning" : "Start learning") : "Review a lesson"}
            </Button>
          </div>
          <div className="relative z-10 hidden lg:block"><GraduationCap className="w-48 h-48 text-primary opacity-20" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"><BookOpen className="w-5 h-5 text-accent" /></div>
            <div><div className="text-lg font-bold">{done.length} / {LESSONS.length}</div><div className="text-xs text-muted-foreground uppercase font-medium">Lessons completed</div></div>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center"><Star className="w-5 h-5 text-yellow-500" /></div>
            <div><div className="text-lg font-bold">{xp} XP</div><div className="text-xs text-muted-foreground uppercase font-medium">of {totalXp} available</div></div>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-2xl flex flex-col justify-center gap-2">
            <div className="text-xs text-muted-foreground uppercase font-medium">Overall progress</div>
            <Progress value={(done.length / LESSONS.length) * 100} />
          </div>
        </div>

        <h2 className="text-2xl font-headline font-bold">Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LESSONS.map((lesson) => {
            const img = PlaceHolderImages.find((p) => p.id === lesson.id);
            const isDone = done.includes(lesson.id);
            return (
              <Card key={lesson.id} className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  {img && <Image src={img.imageUrl} alt={lesson.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" data-ai-hint={img.imageHint} />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md">{lesson.category}</Badge>
                  {isDone && <Badge className="absolute top-4 right-4 bg-accent/90 text-black gap-1"><CheckCircle2 className="w-3 h-3" /> Done</Badge>}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="font-headline text-xl">{lesson.title}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium"><Clock className="w-3 h-3" /> {lesson.duration}</div>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed">{lesson.description}</p>
                </CardHeader>
                <CardFooter className="flex justify-between items-center border-t border-border pt-4">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">{lesson.level}</Badge>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">+{lesson.points} XP</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors" onClick={() => setOpen(lesson)}>
                    {isDone ? "Review" : "Start lesson"} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Educational content only. Nothing here is financial advice.</p>
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{open.title}</DialogTitle>
                <DialogDescription>{open.level} · {open.duration} · +{open.points} XP</DialogDescription>
              </DialogHeader>
              <div className="space-y-5">
                {open.sections.map((s) => (
                  <div key={s.heading}>
                    <h3 className="font-headline font-semibold text-primary mb-1">{s.heading}</h3>
                    <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                {done.includes(open.id) ? (
                  <Button variant="outline" onClick={() => setDone((d) => d.filter((x) => x !== open.id))}>Mark as not completed</Button>
                ) : (
                  <Button onClick={() => { setDone((d) => [...d, open.id]); setOpen(null); }}>Mark as completed (+{open.points} XP)</Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
