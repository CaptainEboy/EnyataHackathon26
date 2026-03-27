
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Send, 
  Clock, 
  BarChart2, 
  Loader2, 
  Inbox, 
  RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api";

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCampaigns = async () => {
    setIsRefreshing(true);
    try {
      const data = await apiRequest('/api/campaigns');
      setCampaigns(data);
    } catch (error) {
      console.error("Infrastructure fetch failed:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // Refresh open rates every 30 seconds automatically for real-time tracking demonstration
    const interval = setInterval(fetchCampaigns, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (c.subject || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || (c.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const calculateOpenRate = (opens: number, recipients: number) => {
    if (!recipients || recipients === 0) return "0.0%";
    const rate = (opens / recipients) * 100;
    return `${rate.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Marketing Campaigns</h1>
          <p className="text-muted-foreground mt-1">Design, schedule, and track your email broadcasts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchCampaigns} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button asChild className="gap-2">
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4" /> Create Campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search campaigns..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:border-primary/50 transition-colors group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-start md:items-center p-6 gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
                    campaign.status === "Sent" ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
                  )}>
                    <Send className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">{campaign.title}</h3>
                      <Badge variant={campaign.status === "Sent" ? "default" : "secondary"}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Inbox className="h-3 w-3" /> {campaign.recipientsCount} recipients</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:px-8 border-t md:border-t-0 md:border-l pt-4 md:pt-0 w-full md:w-auto">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Open Rate</p>
                      <p className="text-xl font-bold">
                        {calculateOpenRate(campaign.opens, campaign.recipientsCount)}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <Button variant="outline" size="icon">
                        <BarChart2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="h-48 flex flex-col items-center justify-center border rounded-xl bg-card border-dashed">
            <Inbox className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="font-semibold">No campaigns found</p>
            <p className="text-sm text-muted-foreground">Start by creating your first broadcast.</p>
          </div>
        )}
      </div>
    </div>
  );
}
