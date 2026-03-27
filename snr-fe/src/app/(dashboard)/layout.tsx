"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/dashboard-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/toaster";
import { Loader2, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      await apiRequest('/api/auth/me');
      setIsAuthenticated(true);
      setError(null);
    } catch (error: any) {
      if (error.status === 401) {
        setIsAuthenticated(false);
        router.push("/login?reason=expired");
      } else {
        setError("Failed to connect to the management console. Check your network.");
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, [router]);

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-center p-6">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold font-headline uppercase tracking-tighter">Connection Interrupted</h2>
        <p className="text-muted-foreground mt-2 max-w-xs">{error}</p>
        <Button onClick={checkAuth} className="mt-6" variant="outline">
          Retry Connection
        </Button>
      </div>
    );
  }

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-center p-6">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-bold font-headline uppercase tracking-tighter">Initializing Infrastructure</h2>
        <p className="text-muted-foreground mt-2 max-w-xs">Connecting to sendnrest global management console...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <DashboardNav />
        <SidebarInset>
          <header className="flex h-16 items-center justify-between px-4 sm:px-6 border-b bg-card shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarTrigger />
              <div className="h-8 w-[1px] bg-border hidden sm:block" />
              <div className="flex flex-col">
                <h2 className="font-headline font-semibold text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                  sendnrest Control Plane
                </h2>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Live Node</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">Infrastructure Admin</p>
                <p className="text-[10px] text-muted-foreground">Premium Cluster</p>
              </div>
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary/20">
                <AvatarImage src="https://picsum.photos/seed/user-1/150/150" alt="User" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
