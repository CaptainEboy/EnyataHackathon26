
"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  Mail, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe,
  Download,
  Loader2,
  Activity
} from "lucide-react";
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/api";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("90d");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const json = await apiRequest('/api/analytics/detailed');
        setData(json);
      } catch (error) {
        console.error("Failed to load detailed analytics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  if (isLoading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Infrastructure Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time performance of your global email delivery network.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" title="Export Raw Events">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Global Dispatch</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">104,231</div>
            <div className="flex items-center text-xs text-emerald-500 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+18.2% throughput</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Opens</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.4%</div>
            <div className="flex items-center text-xs text-emerald-500 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+4.3% interaction</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Link Clicks</CardTitle>
            <MousePointer2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.1%</div>
            <div className="flex items-center text-xs text-destructive mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>-0.8% CTR</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <div className="flex items-center text-xs text-emerald-500 mt-1">
              <span>Excellent inbox placement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Real-Time Delivery Pulse</CardTitle>
            <CardDescription>Event distribution intercepted by our tracking servers.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pl-0">
            <ChartContainer config={{
              sent: { label: "Sent", color: "hsl(var(--primary))" },
              opens: { label: "Opens", color: "hsl(var(--accent))" },
              clicks: { label: "Clicks", color: "hsl(var(--chart-3))" }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.performance}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-sent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-sent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="sent" stroke="var(--color-sent)" fillOpacity={1} fill="url(#colorSent)" />
                  <Area type="monotone" dataKey="opens" stroke="var(--color-opens)" fill="none" />
                  <Area type="monotone" dataKey="clicks" stroke="var(--color-clicks)" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Client Environment</CardTitle>
            <CardDescription>Detected user agents during event interception.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.devices.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : index === 1 ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-3 mt-4">
              {data.devices.map((item: any, index: number) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: index === 0 ? "hsl(var(--primary))" : index === 1 ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))" }} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Globe className="h-5 w-5 text-primary" />
              Global Interception Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.regions.map((loc: any) => (
                <div key={loc.region} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{loc.region}</span>
                    <span className="text-muted-foreground">{loc.opens.toLocaleString()} detected events</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${loc.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Top Redirect Targets</CardTitle>
            <CardDescription>Most intercepted links by our click engine.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { url: "/products/new-collection", clicks: 1245, trend: "+12%" },
                { url: "/blog/marketing-tips-2024", clicks: 890, trend: "+5%" },
                { url: "/pricing/pro-plan", clicks: 542, trend: "+18%" },
                { url: "/help/getting-started", clicks: 210, trend: "-2%" },
              ].map((link, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium font-mono text-primary truncate max-w-[200px]">{link.url}</p>
                    <p className="text-xs text-muted-foreground">{link.clicks} valid interceptions</p>
                  </div>
                  <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {link.trend}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
