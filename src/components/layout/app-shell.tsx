"use client";

import * as React from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, BrainCircuit, Waves, Gauge, GraduationCap, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Market Dashboard", href: "/", icon: LayoutDashboard },
  { name: "AI Analysis", href: "/analyze", icon: BrainCircuit },
  { name: "Whale Watch", href: "/whale-stream", icon: Waves },
  { name: "Market Pulse", href: "/sentiment", icon: Gauge },
  { name: "Academy", href: "/academy", icon: GraduationCap },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
        <SidebarHeader className="h-16 flex items-center px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
              Crypto<span className="text-primary">Lens</span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-3 py-4">
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.name}
                  className={cn(
                    "h-11 transition-colors duration-200",
                    pathname === item.href ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-sidebar-accent"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary" : "text-sidebar-foreground")} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Research tool only. Not financial advice. Data: CoinGecko, alternative.me, blockchain.info, mempool.space, CryptoCompare.
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen bg-background">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center px-6 gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Live market data</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
