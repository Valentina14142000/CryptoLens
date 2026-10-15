"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BrainCircuit, Waves, Gauge, GraduationCap, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Market Dashboard", short: "Market", href: "/", icon: LayoutDashboard },
  { name: "AI Analysis", short: "AI", href: "/analyze", icon: BrainCircuit },
  { name: "Whale Watch", short: "Whales", href: "/whale-stream", icon: Waves },
  { name: "Market Pulse", short: "Pulse", href: "/sentiment", icon: Gauge },
  { name: "Academy", short: "Learn", href: "/academy", icon: GraduationCap },
];

function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="CryptoLens home">
      <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
        <Search className="w-5 h-5 text-primary-foreground" />
      </span>
      {withText && (
        <span className="font-headline font-bold text-xl tracking-tight text-foreground">
          Crypto<span className="text-primary">Lens</span>
        </span>
      )}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [q, setQ] = React.useState("");
  const current = navigation.find((n) => n.href === pathname) ?? navigation[0];

  function goAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const token = q.trim();
    if (!token) return;
    window.location.assign(`/analyze?q=${encodeURIComponent(token)}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-60 flex-col border-r border-border bg-sidebar">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 h-11 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <p className="px-5 py-4 text-[10px] leading-relaxed text-muted-foreground border-t border-border">
          Research tool only. Not financial advice.
        </p>
      </aside>

      <div className="md:pl-60 min-w-0">
        <header className="sticky top-0 z-40 h-14 sm:h-16 border-b border-border bg-background/85 backdrop-blur-md flex items-center gap-3 px-4 sm:px-6">
          <div className="md:hidden">
            <Logo withText={false} />
          </div>
          <h2 className="hidden md:block font-headline font-semibold text-base whitespace-nowrap">{current.name}</h2>
          <div className="hidden lg:flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Live market data</span>
          </div>
          <form onSubmit={goAnalyze} className="ml-auto flex-1 sm:flex-none sm:w-72 relative" role="search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              maxLength={40}
              placeholder="Analyze a token, e.g. SOL"
              aria-label="Analyze a token"
              enterKeyHint="search"
              className="w-full h-9 rounded-full border border-border bg-muted/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
        </header>

        <main id="main" className="px-4 py-4 sm:p-6 pb-24 md:pb-8 min-w-0">
          {children}
          <footer className="mt-10 text-[11px] leading-relaxed text-muted-foreground">
            Research tool only. Not financial advice. Data: CoinGecko, alternative.me, blockchain.info, mempool.space, CryptoCompare.
          </footer>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Main"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md grid grid-cols-5"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navigation.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 min-h-14 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", active && "drop-shadow-[0_0_6px_hsl(var(--primary))]")} />
              {item.short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
