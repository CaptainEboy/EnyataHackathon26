
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Loader2, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    workspaceName: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await apiRequest('/api/auth/signup', {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.setItem("sn_user", JSON.stringify(data.user));

      toast({
        title: "Workspace Created",
        description: "Welcome to sendnrest! Your workspace is ready.",
      });
      
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <Mail className="h-8 w-8 text-primary-foreground" />
            <span className="font-headline text-3xl font-bold tracking-tight">sendnrest</span>
          </div>
          
          <div className="space-y-12">
            <h2 className="text-5xl font-headline font-bold leading-tight text-white">Join the next generation of communicators.</h2>
            
            <div className="space-y-6">
              {[
                { icon: Sparkles, title: "Modern Experience", desc: "Built for developers who value speed." },
                { icon: ShieldCheck, title: "Enterprise Reliability", desc: "High-throughput infrastructure for critical alerts." },
                { icon: Zap, title: "Instant Integration", desc: "REST APIs and SDKs for every modern language." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-white/10 rounded-lg p-2 h-fit">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{item.title}</h3>
                    <p className="text-white/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative z-10 pt-12 border-t border-white/10">
          <p className="text-sm italic text-white/80">"sendnrest transformed our transactional email performance. Deliverability went from 85% to 99.8% in just one week."</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 border-2 border-white/40" />
            <div>
              <p className="text-sm font-bold text-white">Marcus Thorne</p>
              <p className="text-xs text-white/60">CTO, Velocity Systems</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      <div className="flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          
          <div className="space-y-2 mb-10">
            <h1 className="text-4xl font-headline font-bold">Create your workspace</h1>
            <p className="text-muted-foreground">Start your professional email journey today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input 
                  id="full-name" 
                  placeholder="Alex Rivera" 
                  required 
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace Name</Label>
                <Input 
                  id="workspace" 
                  placeholder="Acme Inc." 
                  required 
                  value={formData.workspaceName}
                  onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="alex@company.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Min. 8 characters" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button className="w-full h-12 text-lg mt-6" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              {isLoading ? "Creating workspace..." : "Create Account"}
            </Button>
          </form>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full h-12 text-lg" asChild>
            <Link href="/login">Log in instead</Link>
          </Button>

          <p className="mt-8 text-center text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-bold">
            Secure 256-bit SSL encrypted connection
          </p>
        </div>
      </div>
    </div>
  );
}
