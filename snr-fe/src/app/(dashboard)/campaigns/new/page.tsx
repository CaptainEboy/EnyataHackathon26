"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Send, 
  Calendar, 
  Layout, 
  Eye, 
  CheckCircle2,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NewCampaignPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const [campaignData, setCampaignData] = useState({
    name: "",
    content: "",
    subject: "",
    tone: "professional",
  });

  const handleGenerateSubject = async () => {
    toast({
      title: "AI Disabled",
      description: "AI subject generation is currently disabled. Please enter a subject manually.",
    });
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem("sn_auth_token") : null;

    try {
      const response = await fetch(`${API_URL}/api/campaigns`, {
        method: 'POST',       
        credentials: 'include', // ✅ REQUIRED
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: campaignData.name,
          subject: campaignData.subject,
          content: campaignData.content
        })
      });

      if (!response.ok) throw new Error("Failed to send campaign");

      toast({
        title: "Success",
        description: "Your campaign has been sent successfully!",
      });
      router.push("/campaigns");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not deliver your campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { step: 1, label: "Details", icon: Layout },
    { step: 2, label: "Content", icon: Sparkles },
    { step: 3, label: "Subject", icon: Eye },
    { step: 4, label: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold">New Campaign</h1>
          <p className="text-sm text-muted-foreground">Draft your message and reach your audience.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8">
        {steps.map((s) => (
          <div 
            key={s.step} 
            className={cn(
              "flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 border-b-2 sm:border-b-4 transition-all duration-300",
              step >= s.step ? "border-primary text-primary" : "border-border text-muted-foreground"
            )}
          >
            <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      <Tabs value={`step-${step}`} className="w-full">
        <TabsContent value="step-1">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Essentials</CardTitle>
              <CardDescription>Give your campaign a name and select your audience segment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Internal Campaign Name</Label>
                <Input 
                  id="campaign-name" 
                  placeholder="e.g., Summer Product Launch 2024" 
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Recipient Segment</Label>
                <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:border-primary/30 transition-colors">
                    <RadioGroupItem value="all" id="r1" />
                    <Label htmlFor="r1" className="flex-1 cursor-pointer">
                      <span className="font-medium">All Contacts</span>
                      <p className="text-xs text-muted-foreground">Reach your entire audience (12,845 members)</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="w-full sm:w-auto" onClick={() => setStep(2)} disabled={!campaignData.name}>Continue</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="step-2">
          <Card>
            <CardHeader>
              <CardTitle>Email Body Content</CardTitle>
              <CardDescription>Compose the main body of your email here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-content">Content</Label>
                <Textarea 
                  id="email-content" 
                  placeholder="Write your email body here..." 
                  className="min-h-[300px]"
                  value={campaignData.content}
                  onChange={(e) => setCampaignData({...campaignData, content: e.target.value})}
                />
              </div>
              <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-3 border border-primary/10">
                <Sparkles className="h-5 w-5 text-primary mt-1 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Craft a compelling message that resonates with your audience.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button variant="outline" className="w-full sm:w-auto order-2 sm:order-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="w-full sm:w-auto order-1 sm:order-2" onClick={() => setStep(3)} disabled={!campaignData.content}>Continue</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="step-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Subject Line
              </CardTitle>
              <CardDescription>Set the subject line for your email campaign.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Enter your email subject..." 
                    value={campaignData.subject}
                    onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                  />
                </div>
                
                <div className="p-4 border border-dashed rounded-lg bg-muted/20 text-muted-foreground text-center">
                  <p className="text-xs italic">Manual subject input is currently required.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button variant="outline" className="w-full sm:w-auto order-2 sm:order-1" onClick={() => setStep(2)}>Back</Button>
              <Button className="w-full sm:w-auto order-1 sm:order-2" onClick={() => setStep(4)} disabled={!campaignData.subject}>Final Review</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="step-4">
          <Card>
            <CardHeader>
              <CardTitle>Final Review</CardTitle>
              <CardDescription>Confirm your settings before dispatching.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Subject Line</p>
                      <p className="font-bold text-lg">{campaignData.subject}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Audience</p>
                      <p className="font-bold text-lg">12,845 Subscribers</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 flex-1">
                      <Eye className="h-4 w-4" /> Preview
                    </Button>
                    <Button variant="outline" className="gap-2 flex-1">
                      <Calendar className="h-4 w-4" /> Schedule
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-950 text-slate-200 rounded-lg p-6 border shadow-inner h-[300px] overflow-auto">
                  <p className="text-slate-500 italic text-xs mb-4">Content Preview:</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{campaignData.content}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t pt-6">
              <Button variant="outline" className="w-full sm:w-auto order-2 sm:order-1" onClick={() => setStep(3)}>Back</Button>
              <Button size="lg" className="w-full sm:w-auto order-1 sm:order-2 gap-2" onClick={handleFinish} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Campaign
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
