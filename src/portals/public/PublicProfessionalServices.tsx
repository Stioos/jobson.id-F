"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Brain, Megaphone, Bot, Box, Code2, Database, Cloud, Cpu, Compass,
  TrendingUp, ArrowRight, Sparkles, ChevronRight, CheckCircle2,
  Layers, ShieldCheck, Zap, Server, FileCode, Settings, Workflow,
  Network, Headphones, Mic, FileSearch, BookOpen, Plug, Monitor,
  Smartphone, GitBranch, Container, HardDrive, Rocket, Send, Filter,
  Activity, AppWindow, ArrowRightLeft, ArrowUpRight, Award, BarChart3,
  Briefcase, Clock, DollarSign, Eye, Factory, FileText, FolderOpen,
  Globe, GraduationCap, Handshake, Layout, LayoutDashboard, Lightbulb,
  Lock, MessageSquare, RefreshCw, Share2, Shield, Sliders, Star, Target,
  UserCheck, Users, Quote, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  professionalServices, type ProfessionalService,
} from "@/data/professionalServicesData";

const ICON_MAP: Record<string, LucideIcon> = {
  Brain, Megaphone, Bot, Box, Code2, Database, Cloud, Cpu, Compass, TrendingUp,
  Layers, ShieldCheck, Zap, Server, FileCode, Settings, Workflow, Network,
  Headphones, Mic, FileSearch, BookOpen, Plug, Monitor, Smartphone, GitBranch,
  Container, HardDrive, Rocket, Send, Filter, Activity, AppWindow, ArrowRightLeft,
  ArrowUpRight, Award, BarChart3, Briefcase, Clock, DollarSign, Eye, Factory,
  FileText, FolderOpen, Globe, GraduationCap, Handshake, Layout, LayoutDashboard,
  Lightbulb, Lock, MessageSquare, RefreshCw, Share2, Shield, Sliders, Star,
  Target, UserCheck, Users,
};


const WHY_CHOOSE = [
  { icon: Award, title: "Senior career experts", desc: "Work with certified coaches and recruiters with 10+ years of placement experience." },
  { icon: Brain, title: "AI-augmented guidance", desc: "Decisions backed by labour-market data, ATS signals, and 4,000+ role profiles." },
  { icon: Users, title: "Personalized 1:1", desc: "Every engagement starts with a discovery call and a custom action plan." },
  { icon: Clock, title: "Faster outcomes", desc: "Most clients see their first interview within 14 days of activation." },
  { icon: Target, title: "Measurable results", desc: "Clear metrics — placement rate, salary lift, time-to-offer — at every stage." },
  { icon: ShieldCheck, title: "Confidential & private", desc: "Your data is yours. Discreet, consent-first handling at every step." },
];

const PROCESS_TIMELINE = [
  { step: 1, title: "Discovery call", desc: "30-min consultation to understand your goals, current role, and target outcomes." },
  { step: 2, title: "Profile deep-dive", desc: "We audit your resume, skills, and career history — and benchmark against market." },
  { step: 3, title: "Personalized plan", desc: "You receive a custom action plan with timelines, deliverables, and milestones." },
  { step: 4, title: "Coaching & placement", desc: "1:1 coaching sessions, mock interviews, and warm intros until you land the role." },
];

const TESTIMONIALS = [
  {
    name: "Aarti Krishnan",
    role: "Senior PM at Swiggy",
    text: "JOBSONN's career services team gave me clarity on my next move. The mock interviews alone helped me negotiate a 32% hike. Worth every rupee.",
    initials: "AK",
  },
  {
    name: "Rohit Deshpande",
    role: "Data Engineer at Razorpay",
    text: "The resume branding service was a game-changer. I went from 0 callbacks in 2 months to 5 interviews in 10 days. The before/after was night and day.",
    initials: "RD",
  },
  {
    name: "Sneha Bhat",
    role: "Tech Lead at PhonePe",
    text: "Talent matching connected me with a role I didn't even know existed. The team understood my niche expertise and approached the right companies.",
    initials: "SB",
  },
];

const FAQS = [
  {
    q: "How do I know which professional service is right for me?",
    a: "Book a free 30-min discovery call. Our team will diagnose your current stage — career clarity, resume quality, interview readiness, or job search strategy — and recommend the right combination of services. There's no obligation to purchase.",
  },
  {
    q: "Are these services online or in-person?",
    a: "All services are delivered online — video calls, async reviews, and a client portal. Some clients prefer in-person sessions in Bengaluru for mock interviews, which we arrange at our partner studios on request.",
  },
  {
    q: "How long does each engagement take?",
    a: "Career assessment: 5–7 days. Resume branding: 3–5 days. Mock interview packs: scheduled across 2–4 weeks. Talent matching: ongoing, typically 30–90 days to placement. We adapt to your timeline.",
  },
  {
    q: "Do you guarantee placement?",
    a: "We don't guarantee placement — but our talent matching service has a 76% placement rate within 90 days, and 91% 12-month retention. Outcomes depend on your active participation and market conditions.",
  },
  {
    q: "What's the pricing model?",
    a: "Most services are fixed-fee (career assessment, resume branding, mock interviews, job search strategy). Talent matching is success-based — a percentage of your first-year CTC, payable only after you accept an offer. Pay-after-placement options are available.",
  },
];

export function PublicProfessionalServices() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1">
            <BookOpen className="h-3 w-3" /> Professional Services
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            8 Professional Services to <span className="text-brand">Accelerate Your Career</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            From career assessment to talent matching — personalized 1:1 guidance from
            senior coaches and recruiters, augmented by AI and grounded in real labour-market data.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() =>
                toast.success("Discovery call requested", {
                  description: "We'll reach out within 24 hours to schedule.",
                })
              }
              className="gap-1.5"
            >
              <Sparkles className="h-4 w-4" /> Book Free Discovery Call
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("public", "contact")}
              className="gap-1.5"
            >
              Talk to a Counselor <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== STAT CARDS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Professional Services" value="8" hint="Career, branding, matching" tone="brand" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard label="Careers Transformed" value="10K+" hint="Across 7 years" tone="brand" icon={<Users className="h-5 w-5" />} />
          <StatCard label="Client Satisfaction" value="95%" hint="Avg rating 4.8/5" tone="brand" icon={<Star className="h-5 w-5" />} />
          <StatCard label="Industries Covered" value="50+" hint="IT, fin, health, retail" tone="brand" icon={<Briefcase className="h-5 w-5" />} />
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Illustrative figures — demo data is simulated.
        </p>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why choose us</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We blend human expertise with AI augmentation — so you get personalised guidance,
              not generic advice.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE.map((c, i) => (
              <Card key={i} className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 8 SERVICE HIGHLIGHTS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our 8 professional services</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each service is personalized, coach-led, and outcome-driven. Click through for
            deliverables, process, pricing, and success metrics.
          </p>
        </div>
        <div className="space-y-6">
          {professionalServices.map((svc) => (
            <ProfessionalServiceBlock
              key={svc.slug}
              svc={svc}
              onLearnMore={() => navigate("public", `professional-services/${svc.slug}`)}
            />
          ))}
        </div>
      </section>

      {/* ===================== PROCESS TIMELINE ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A simple, proven 4-step process — from discovery to placement.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_TIMELINE.map((p, i) => (
              <Card key={i} className="relative h-full p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                  {p.step}
                </div>
                <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                {i < PROCESS_TIMELINE.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-9 hidden h-5 w-5 text-brand/40 lg:block" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What clients say</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real outcomes from professionals who accelerated their careers with us.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="flex h-full flex-col p-6">
              <Quote className="h-6 w-6 text-brand" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Common questions about our professional services.
            </p>
          </div>
          <Card className="p-2">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="px-4">
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to accelerate your career?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Book a free 30-minute discovery call. We&apos;ll diagnose where you are, where you
                want to be, and which of our 8 services will get you there fastest.
              </p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {["Free discovery call", "Senior coach, not a junior", "Custom action plan", "Pay-after-placement options"].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-brand" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button
                size="lg"
                onClick={() =>
                  toast.success("Discovery call requested", {
                    description: "We'll reach out within 24 hours to schedule.",
                  })
                }
                className="gap-1.5"
              >
                <Sparkles className="h-4 w-4" /> Book Free Discovery Call
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("public", "contact")}
                className="gap-1.5"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function ProfessionalServiceBlock({
  svc, onLearnMore,
}: { svc: ProfessionalService; onLearnMore: () => void }) {
  const SvcIcon = (ICON_MAP[svc.icon] ?? Sparkles);
  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md"
      style={{ borderTopColor: svc.color, borderTopWidth: 4 }}
    >
      <CardContent className="p-0">
        <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
          {/* Left: number + icon + name */}
          <div
            className="flex flex-col gap-3 p-6"
            style={{ backgroundColor: `${svc.color}08` }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-3xl font-black tracking-tight"
                style={{ color: svc.color }}
              >
                {svc.num}
              </span>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${svc.color}1A`, color: svc.color }}
              >
                <SvcIcon className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-lg font-bold leading-tight">{svc.name}</h3>
            <p className="text-xs font-medium" style={{ color: svc.color }}>
              {svc.subtitle}
            </p>
          </div>
          {/* Right: description + features + CTA */}
          <div className="p-6">
            <p className="text-sm text-muted-foreground">{svc.desc}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {svc.features.slice(0, 4).map((f, i) => {
                const FIcon = (ICON_MAP[f.icon] ?? Sparkles);
                return (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <FIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: svc.color }} />
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{f.title}.</span>{" "}
                      {f.desc.length > 80 ? f.desc.slice(0, 78) + "…" : f.desc}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <div className="flex flex-wrap gap-1.5">
                {svc.industries.slice(0, 3).map((ind) => (
                  <Badge key={ind} variant="outline" className="text-[10px] font-normal">
                    {ind}
                  </Badge>
                ))}
                {svc.industries.length > 3 && (
                  <Badge variant="outline" className="text-[10px] font-normal">
                    +{svc.industries.length - 3}
                  </Badge>
                )}
              </div>
              <Button size="sm" onClick={onLearnMore} className="gap-1.5">
                Learn More <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
