
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Send, 
  Users, 
  MousePointer2, 
  Eye, 
  MailCheck,
  Loader2,
  RefreshCw
} from "lucide-react";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [engagementTrends, setEngagementTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const data = await apiRequest('/api/stats/summary');
      
      setStats([
        { title: "Active Contacts", value: (data.activeContacts || 0).toLocaleString(), change: "+12.5%", icon: Users, color: "text-blue-600" },
        { title: "Campaigns Sent", value: data.campaignsSent || 0, change: "+3.2%", icon: Send, color: "text-accent" },
        { title: "Avg. Open Rate", value: data.avgOpenRate || '0.0%', change: "+5.1%", icon: Eye, color: "text-emerald-600" },
        { title: "Avg. Click Rate", value: data.avgClickRate || '0.0%', change: "-0.4%", icon: MousePointer2, color: "text-amber-600" },
      ]);

      setRecentActivity(data.recentActivity || []);
      setEngagementTrends(data.engagementTrends || []);
    } catch (error) {
      console.error("Failed to load dashboard stats");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Simulate real-time tracking by polling every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's how your workspace is performing.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchStats} 
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs flex items-center gap-1 mt-1">
                <span className={stat.change.startsWith("+") ? "text-emerald-500" : "text-destructive"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last period</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Engagement Trends</CardTitle>
            <CardDescription>Daily volume of sent emails vs unique opens.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer config={{
              sent: { label: "Sent", color: "hsl(var(--primary))" },
              opens: { label: "Opens", color: "hsl(var(--accent))" }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementTrends}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sent" fill="var(--color-sent)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="opens" fill="var(--color-opens)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <MailCheck className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest campaign dispatches.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                      <Send className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.status} • {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-auto text-[10px]">
                      {activity.recipientsCount} recp.
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No recent activity found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
