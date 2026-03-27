
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  Zap, 
  Settings, 
  BarChart3,
  Mail,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Campaigns", href: "/campaigns", icon: Send },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Transactional", href: "/transactional", icon: Zap },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-primary">sendnrest</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Main Menu</SidebarGroupLabel>
          <SidebarMenu className="px-3">
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  className={cn(
                    "w-full px-4 py-2 transition-all duration-200",
                    pathname === item.href ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/pricing'}>
              <Link href="/pricing" className="flex items-center gap-3 px-4">
                <CreditCard className={cn("h-5 w-5", pathname === '/pricing' ? "text-primary" : "text-muted-foreground")} />
                <span>Plans & Billing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/settings'}>
              <Link href="/settings" className="flex items-center gap-3 px-4">
                <Settings className={cn("h-5 w-5", pathname === '/settings' ? "text-primary" : "text-muted-foreground")} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
