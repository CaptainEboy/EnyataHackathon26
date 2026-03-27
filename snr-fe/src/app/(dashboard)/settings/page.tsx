
"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  CreditCard, 
  Globe, 
  Mail, 
  Lock, 
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  XCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'verified' | 'unverified' | 'idle'>('idle');

  const handleVerifyDomain = async () => {
    setIsVerifying(true);
    const token = localStorage.getItem("sn_auth_token");
    
    try {
      const response = await fetch(`${API_URL}/api/domains/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ domain: 'marketing.acme.com' })
      });
      const data = await response.json();
      
      if (data.verified) {
        setDomainStatus('verified');
        toast({ title: "Verification Successful", description: "Your DNS records are valid." });
      } else {
        setDomainStatus('unverified');
        toast({ 
          title: "Verification Failed", 
          description: "Could not find valid records. Please check your DNS settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ title: "System Error", description: "Failed to connect to the infrastructure API.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your workspace preferences have been updated.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, workspace, and infrastructure records.</p>
      </div>

      <Tabs defaultValue="workspace" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="workspace" className="gap-2">
            <Globe className="h-4 w-4" /> Workspace
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" /> Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Profile</CardTitle>
              <CardDescription>Update your personal information as it appears in the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-muted">
                  <AvatarImage src="https://picsum.photos/seed/user-1/200/200" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-[10px] text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" defaultValue="Alex Rivera" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue="alex@example.com" disabled />
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Lock className="h-2 w-2" /> Contact support to change your account email
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="workspace">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Infrastructure Verification</CardTitle>
                  <CardDescription>Records required to authenticate sendnrest as your provider.</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2" 
                  onClick={handleVerifyDomain}
                  disabled={isVerifying}
                >
                  <RefreshCw className={cn("h-4 w-4", isVerifying && "animate-spin")} />
                  Verify Records
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded flex items-center justify-center",
                        domainStatus === 'verified' ? "bg-emerald-100 text-emerald-600" : 
                        domainStatus === 'unverified' ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                      )}>
                        {domainStatus === 'verified' ? <CheckCircle2 className="h-5 w-5" /> : 
                         domainStatus === 'unverified' ? <XCircle className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">marketing.acme.com</p>
                        <p className="text-xs text-muted-foreground">Domain for transactional dispatch</p>
                      </div>
                    </div>
                    <Badge variant={domainStatus === 'verified' ? "default" : domainStatus === 'unverified' ? "destructive" : "secondary"}>
                      {domainStatus === 'verified' ? 'Verified' : domainStatus === 'unverified' ? 'Action Required' : 'Checking...'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-muted-foreground font-medium uppercase">SPF (TXT)</p>
                      <p className="font-mono bg-card p-2 rounded border truncate">v=spf1 include:spf.sendnrest.com ~all</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground font-medium uppercase">DKIM (CNAME)</p>
                      <p className="font-mono bg-card p-2 rounded border truncate">sn1.dkim.sendnrest.com</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground font-medium uppercase">DMARC (TXT)</p>
                      <p className="font-mono bg-card p-2 rounded border truncate">v=DMARC1; p=quarantine;</p>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-blue-50/50 border-blue-200">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Domain Reputation</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    It can take up to 24 hours for DNS changes to propagate across our global edge nodes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible workspace operations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-semibold text-sm">Transfer Ownership</p>
                    <p className="text-xs text-muted-foreground">Assign this workspace to another account admin.</p>
                  </div>
                  <Button variant="outline" size="sm">Transfer</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Delete Workspace</p>
                    <p className="text-xs text-muted-foreground">Permanently destroy all campaign data and logs.</p>
                  </div>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>System & Campaign Alerts</CardTitle>
              <CardDescription>Control how you receive infrastructure performance updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Infrastructure Status</Label>
                    <p className="text-xs text-muted-foreground">Alert me if delivery latency exceeds 500ms.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bounce Rate Spike</Label>
                    <p className="text-xs text-muted-foreground">Notify if bounce rate goes above 5% on any campaign.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 justify-end">
              <Button onClick={handleSave}>Update Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>You are scaling with the Pro Annual Plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-headline text-primary">Pro Plan</span>
                    <Badge className="bg-primary text-primary-foreground">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Next billing: Jan 12, 2025 • $240/year</p>
                </div>
                <Button>Scale to Enterprise</Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Invoice History</h3>
                <div className="border rounded-lg divide-y bg-card">
                  {[
                    { date: "May 12, 2024", amount: "$240.00", status: "Paid" },
                    { date: "May 12, 2023", amount: "$240.00", status: "Paid" },
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between p-4 text-sm">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{inv.amount}</span>
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-transparent p-0">Receipt</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
