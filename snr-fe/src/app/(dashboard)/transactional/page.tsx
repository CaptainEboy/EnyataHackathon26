"use client";

import { useState } from "react";
import { 
  Copy, 
  Key, 
  Zap, 
  Code2, 
  BookOpen, 
  CheckCircle,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function TransactionalPage() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("sn_live_49f8a2e1b0c9d7e3f4a5b6c7");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste this value into your environment configuration.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippet = `
const sendnrest = require('sendnrest-sdk');

const client = sendnrest.init('YOUR_API_KEY');

client.sendTransactional({
  to: 'user@example.com',
  templateId: 'welcome-email',
  params: {
    firstName: 'John',
    actionUrl: 'https://myapp.com/verify'
  }
}).then(res => {
  console.log('Email sent!', res.id);
});
  `.trim();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Transactional API</h1>
          <p className="text-muted-foreground mt-1">High-reliability delivery for your critical application emails.</p>
        </div>
        <Button className="gap-2">
          <BookOpen className="h-4 w-4" /> API Docs
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              API Authentication
            </CardTitle>
            <CardDescription>Keep your API keys secure. Never share them in public repositories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Production API Key</label>
              <div className="flex gap-2">
                <Input 
                  value={apiKey} 
                  readOnly 
                  type="password"
                  className="font-mono bg-muted/30"
                />
                <Button variant="outline" size="icon" onClick={() => handleCopy(apiKey)}>
                  {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">Generated on sendnrest</p>
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">SMTP Credentials</h3>
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Standard</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Host</p>
                  <p className="text-sm font-mono">smtp.sendnrest.com</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Port</p>
                  <p className="text-sm font-mono">587 (TLS) or 465 (SSL)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Daily Usage</CardTitle>
            <CardDescription>Current billing cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Free Tier Limit</span>
                <span className="font-semibold">342 / 1,000</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '34.2%' }} />
              </div>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
              <div className="flex items-center gap-2 mb-2 text-accent">
                <Zap className="h-4 w-4" />
                <span className="font-semibold text-sm">Pro Delivery</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upgrade to a Pro plan for dedicated IP addresses and higher daily limits.
              </p>
              <Button variant="link" className="p-0 h-auto text-accent text-xs mt-2">Learn more about Pro →</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Quick Integration
            </CardTitle>
            <CardDescription>Sample Node.js implementation.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Node.js</Button>
            <Button variant="ghost" size="sm">Python</Button>
            <Button variant="ghost" size="sm">PHP</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative group">
            <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed">
              <code>{codeSnippet}</code>
            </pre>
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleCopy(codeSnippet)}
            >
              <Copy className="h-3 w-3 mr-2" /> Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-xl bg-card flex gap-4">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Domain Authentication</h3>
            <p className="text-sm text-muted-foreground mb-3">Improve deliverability by setting up SPF, DKIM, and DMARC records.</p>
            <Button variant="outline" size="sm">View DNS Records</Button>
          </div>
        </div>
        <div className="p-6 border rounded-xl bg-card flex gap-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <ExternalLink className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Webhooks</h3>
            <p className="text-sm text-muted-foreground mb-3">Receive real-time notifications for delivery, opens, and clicks.</p>
            <Button variant="outline" size="sm">Manage Webhooks</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
