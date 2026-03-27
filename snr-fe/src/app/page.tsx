
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  CircleCheck, 
  Mail, 
  Zap, 
  Sparkles, 
  ChartColumn as ChartBar, 
  ShieldCheck, 
  Users,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "/pricing" },
    { name: "Developers", href: "/transactional" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 sm:px-6 h-20 flex items-center justify-between border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-primary">sendnrest</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>

          {/* Mobile Navigation Drawer */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    sendnrest
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      className="text-lg font-semibold hover:text-primary transition-colors border-b pb-2"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-3 pt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/signup">Start Free Trial</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-12 lg:py-32 px-4 sm:px-6 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs sm:text-sm font-medium mx-auto lg:mx-0">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>AI-Powered Email Marketing</span>
              </div>
              <h1 className="font-headline text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                Deliver messages that <span className="text-primary">actually convert.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                The modern email platform for marketing broadcasts and high-reliability transactional delivery. Powered by GenAI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="h-12 sm:h-14 px-8 text-lg gap-2" asChild>
                  <Link href="/signup">
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 sm:h-14 px-8 text-lg" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm text-muted-foreground font-medium justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-4 w-4 text-emerald-500" /> No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-4 w-4 text-emerald-500" /> 1,000 free emails/day
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 sm:border-8 border-background">
              {heroImage && (
                <Image 
                  src={heroImage.imageUrl} 
                  alt={heroImage.description} 
                  fill 
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold mb-4">Everything you need to grow</h2>
              <p className="text-base sm:text-lg text-muted-foreground">From high-volume broadcasts to mission-critical notifications, we've got you covered.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Zap,
                  title: "Transactional Mastery",
                  desc: "API-first delivery for password resets, receipts, and alerts. 99.9% uptime guaranteed.",
                  color: "bg-blue-500"
                },
                {
                  icon: Sparkles,
                  title: "AI Subject Optimizer",
                  desc: "Our GenAI analyzed millions of emails to suggest the subject lines that maximize your open rates.",
                  color: "bg-accent"
                },
                {
                  icon: ChartBar,
                  title: "Deep Analytics",
                  desc: "Track every open, click, and bounce with pixel-perfect accuracy and geographic reporting.",
                  color: "bg-emerald-500"
                },
                {
                  icon: ShieldCheck,
                  title: "Domain Health",
                  desc: "Built-in SPF, DKIM, and DMARC verification to keep your messages out of the spam folder.",
                  color: "bg-amber-500"
                },
                {
                  icon: Users,
                  title: "Smart Segmentation",
                  desc: "Target your audience based on behavior, tags, and lifecycle stage effortlessly.",
                  color: "bg-indigo-500"
                },
                {
                  icon: Mail,
                  title: "Dynamic Templates",
                  desc: "Visual drag-and-drop editor or code your own with MJML and Liquid support.",
                  color: "bg-primary"
                }
              ].map((feature, i) => (
                <div key={i} className="p-6 sm:p-8 border rounded-2xl bg-card hover:shadow-xl transition-all group">
                  <div className={`${feature.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 sm:py-20 bg-muted/30 border-y px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8 sm:mb-12">Trusted by 2,000+ scaling companies</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-12 opacity-50 grayscale text-center">
              <div className="font-headline text-xl sm:text-2xl font-bold italic tracking-tighter">Velocity.io</div>
              <div className="font-headline text-xl sm:text-2xl font-bold italic tracking-tighter">Stackr</div>
              <div className="font-headline text-xl sm:text-2xl font-bold italic tracking-tighter">Nexus</div>
              <div className="font-headline text-xl sm:text-2xl font-bold italic tracking-tighter">Orbit.co</div>
              <div className="font-headline text-xl sm:text-2xl font-bold italic tracking-tighter">FlowState</div>
              <div className="font-headline text-xl sm:text-2xl font-bold italic tracking-tighter">AcmeCorp</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold tracking-tight text-primary">sendnrest</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The professional choice for reliable email delivery and marketing automation.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
              <li><Link href="/campaigns" className="hover:text-primary">Campaigns</Link></li>
              <li><Link href="/transactional" className="hover:text-primary">Transactional API</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/analytics" className="hover:text-primary">Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
              <li><Link href="#" className="hover:text-primary">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary">API Reference</Link></li>
              <li><Link href="#" className="hover:text-primary">Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary">Anti-Spam Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <p>© 2024 sendnrest Inc. Built for performance.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary">Twitter</Link>
            <Link href="#" className="hover:text-primary">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
