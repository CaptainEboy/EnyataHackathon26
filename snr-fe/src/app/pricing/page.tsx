
"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Mail, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    href: "/signup",
    priceMonthly: "$0",
    description: "Perfect for hobbyists and developers testing integrations.",
    features: [
      "1,000 emails per day",
      "Shared sending IP",
      "Standard email support",
      "Basic analytics dashboard",
      "Core API access",
    ],
    mostPopular: false,
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceMonthly: "$29",
    description: "Advanced features for growing businesses and startups.",
    features: [
      "50,000 emails per month",
      "AI Subject Line Optimizer",
      "Dedicated sending IP (optional)",
      "Priority email support",
      "Advanced geographic analytics",
      "Domain health monitoring",
    ],
    mostPopular: true,
    buttonText: "Upgrade to Pro",
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "$199",
    description: "Mission-critical infrastructure for high-volume senders.",
    features: [
      "Unlimited email volume",
      "Dedicated account manager",
      "99.99% uptime SLA",
      "Custom sending domains",
      "White-glove migration service",
      "24/7 phone & chat support",
    ],
    mostPopular: false,
    buttonText: "Contact Sales",
  },
];

export default function PricingPage() {
  const { toast } = useToast();
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handlePayment = async (tierId: string) => {
    if (tierId === 'tier-free') return;
    
    setLoadingTier(tierId);
    
    try {
      const response = await fetch('/api/payments/interswitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId, isAnnual }),
      });
      
      const data = await response.json();
      
      if (data.url && data.hash) {
        toast({
          title: "Redirecting to Interswitch",
          description: "Connecting to secure payment gateway...",
        });

        // Interswitch Webpay requires a POST redirect with hidden fields
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;

        const fields = {
          product_id: data.productId,
          amount: data.amount,
          currency: '566', // NGN
          site_redirect_url: data.callbackUrl,
          txn_ref: data.transactionRef,
          hash: data.hash,
          pay_item_id: data.payItemId,
          merchant_code: data.merchantCode
        };

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error("Invalid gateway response");
      }
    } catch (error) {
      toast({
        title: "Payment Initialization Failed",
        description: "Could not connect to the payment infrastructure.",
        variant: "destructive",
      });
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 sm:px-6 h-20 flex items-center justify-between border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <span className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-primary">sendnrest</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-medium hover:text-primary">Features</Link>
          <Link href="/pricing" className="text-sm font-medium text-primary">Pricing</Link>
          <Link href="/transactional" className="text-sm font-medium hover:text-primary">API</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-muted/30 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 text-center space-y-4">
          <h1 className="font-headline text-4xl sm:text-6xl font-bold tracking-tight">
            Transparent pricing for <span className="text-primary">every scale.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're sending 100 emails or 100 million, our reliable infrastructure scales with you.
          </p>

          <div className="flex items-center justify-center gap-4 pt-8">
            <Label htmlFor="billing-toggle" className={!isAnnual ? "font-bold" : "text-muted-foreground"}>Monthly</Label>
            <Switch 
              id="billing-toggle" 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual} 
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? "font-bold" : "text-muted-foreground"}>
              Annual <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Save 20%</Badge>
            </Label>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-8 mt-16">
          {tiers.map((tier) => (
            <Card key={tier.id} className={`flex flex-col relative overflow-hidden ${tier.mostPopular ? 'border-primary shadow-xl scale-105 z-10' : ''}`}>
              {tier.mostPopular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {isAnnual && tier.id !== 'tier-free' 
                      ? `$${Math.round(parseInt(tier.priceMonthly.slice(1)) * 0.8)}` 
                      : tier.priceMonthly}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">/month</span>
                </div>
                
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier.id === 'tier-free' ? (
                  <Button className="w-full h-11" variant="outline" asChild>
                    <Link href="/signup">{tier.buttonText}</Link>
                  </Button>
                ) : (
                  <Button 
                    className="w-full h-11" 
                    variant={tier.mostPopular ? "default" : "outline"}
                    onClick={() => handlePayment(tier.id)}
                    disabled={loadingTier === tier.id}
                  >
                    {loadingTier === tier.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {tier.buttonText}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-24">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold font-headline">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our billing and infrastructure.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { q: "Can I change plans at any time?", a: "Yes, you can upgrade or downgrade your plan instantly from your dashboard settings." },
              { q: "What happens if I exceed my limit?", a: "On Pro plans, we'll notify you when you hit 80% and 100%. Overages are billed at a flat rate per 1k emails." },
              { q: "Do you offer non-profit discounts?", a: "Absolutely. Verified non-profits get 50% off any Pro plan for life." },
              { q: "How secure are payments?", a: "We use Interswitch for all transactions, ensuring PCI-DSS compliant payment processing via Webpay." },
            ].map((faq, i) => (
              <div key={i} className="space-y-2">
                <h4 className="font-bold">{faq.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">sendnrest</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </div>
          <p>© 2024 sendnrest Inc.</p>
        </div>
      </footer>
    </div>
  );
}
