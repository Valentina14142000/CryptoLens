
"use client";

import * as React from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, BrainCircuit, Waves, Gauge, GraduationCap, Search, Bell, Settings, LogOut, Wallet } from "lucide-react";
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
                    pathname === item.href 
                      ? "bg-primary/10 text-primary hover:bg-primary/20" 
                      : "hover:bg-sidebar-accent"
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
        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-11 hover:bg-sidebar-accent">
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen bg-background">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Live Network Status: Normal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
              <span className="hidden sm:inline font-medium text-sm">Analyst_01</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
