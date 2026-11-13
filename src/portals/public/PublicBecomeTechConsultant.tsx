"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Cpu, ArrowRight, Sparkles, Trophy, Star, Award, Brain, Code2,
  Database, Cloud, ShieldCheck, Layers, Server, Briefcase, Wallet,
  Users, Target, Rocket, Handshake, CheckCircle2, Quote, Phone, Mail,
  TrendingUp, GraduationCap, Building2,
} from "lucide-react";
import { toast } from "sonner";

const TIERS = [
  {
    id: "associate",
    name: "Associate",
    rate: "₹1,500 – ₹2,500 / hr",
    color: "#94A3B8",
    icon: Award,
    desc: "For early-career consultants and individual contributors shipping scoped work.",
    benefits: ["Hourly billing", "Project scoping support", "Access to jobson.id partner network", "Quarterly skill reviews"],
  },
  {
    id: "senior",
    name: "Senior",
    rate: "₹3,000 – ₹5,000 / hr",
    color: "#F59E0B",
    icon: Trophy,
    desc: "For experienced consultants leading workstreams and architecting solutions.",
    benefits: ["Hourly or sprint billing", "Co-sell support", "Lead distribution in your expertise", "Quarterly performance bonus up to ₹1L", "Co-branded case studies"],
    featured: true,
  },
  {
    id: "principal",
    name: "Principal",
    rate: "₹6,000 – ₹10,000 / hr",
    color: "#10B981",
    icon: Star,
    desc: "For industry-recognized experts leading enterprise engagements and strategic advisory.",
    benefits: ["Strategic retainer + hourly", "24/7 partnership manager", "Priority enterprise leads", "Annual bonus up to ₹3L", "Co-marketing budget", "Speaking opportunity at jobson.id events"],
  },
];

const EXPERTISE = [
  { icon: Code2, title: "Fullstack Engineering", desc: "React, Node.js, TypeScript, microservices, platform engineering." },
  { icon: Brain, title: "AI & ML Engineering", desc: "LLMs, RAG, fine-tuning, MLOps, model evaluation." },
  { icon: Database, title: "Data Engineering", desc: "Streaming pipelines, data mesh, lakehouse, ETL/ELT." },
  { icon: Cloud, title: "Cloud & DevOps", desc: "AWS, Azure, GCP, Kubernetes, Terraform, observability." },
  { icon: ShieldCheck, title: "Security & Compliance", desc: "DPDP, SOC 2, IAM, threat modeling, secure architecture." },
  { icon: Layers, title: "Solution Architecture", desc: "System design, technical due diligence, ADRs." },
  { icon: Server, title: "Backend Systems", desc: "Java, Go, Python — high-throughput, low-latency systems." },
  { icon: Briefcase, title: "Product & Strategy", desc: "Product management, roadmap, GTM, technical advisory." },
];

const ENGAGEMENT_MODELS = [
  {
    id: "hourly",
    title: "Hourly engagement",
    icon: Briefcase,
    desc: "Bill by the hour for scoped work — ad-hoc reviews, sprint contributions, advisory calls.",
    ideal: "Short, well-defined engagements",
  },
  {
    id: "sprint",
    title: "Sprint retainer",
    icon: Rocket,
    desc: "2-week sprints with a fixed deliverable — ship features, lead migrations, train teams.",
    ideal: "Project-based work with clear scope",
  },
  {
    id: "advisory",
    title: "Strategic advisory",
    icon: Handshake,
    desc: "Ongoing retainer for senior consultants — architecture review, technical due diligence, mentorship.",
    ideal: "Long-term strategic relationships",
  },
];

const EARNINGS_STATS = [
  { label: "Active consultants", value: "180+", icon: Users, tone: "brand" as const },
  { label: "Avg hourly rate", value: "₹3,200", icon: Wallet, tone: "brand" as const },
  { label: "Hours billed / month", value: "8,400+", icon: Briefcase, tone: "brand" as const },
  { label: "Top monthly payout", value: "₹4.2L", icon: TrendingUp, tone: "brand" as const },
];

const STEPS = [
  { step: "01", title: "Apply with your portfolio", desc: "Submit your CV, GitHub/LinkedIn, and 2 client references. Show us what you've shipped." },
  { step: "02", title: "Technical interview", desc: "1-hour call with our principal consultants. We assess depth, not buzzwords." },
  { step: "03", title: "Onboarding & certification", desc: "Sign the consultant agreement, complete the jobson.id methodology certification (4 hours)." },
  { step: "04", title: "Receive engagements", desc: "Get matched to client engagements based on your expertise, rate, and availability." },
  { step: "05", title: "Deliver & get paid", desc: "Track hours in the consultant portal. Get paid within 7 days of submitting your invoice." },
];

const TESTIMONIALS = [
  {
    name: "Arjun Khanna",
    role: "Principal Consultant, AI/ML",
    salary: "₹4.2L / month avg",
    initials: "AK",
    quote: "I left a Google L5 role to consult independently. jobson.id brought me enterprise engagements I couldn't have reached alone — and they pay on time, every time.",
  },
  {
    name: "Sara Mohammed",
    role: "Senior Consultant, Data Engineering",
    salary: "₹2.4L / month avg",
    initials: "SM",
    quote: "The sprint-based model fits perfectly — I know what I'm building, when I'm done, and what I'll earn. No more time-tracking politics.",
  },
  {
    name: "Vikrant Singh",
    role: "Associate Consultant, Fullstack",
    salary: "₹1.1L / month avg",
    initials: "VS",
    quote: "As an early-career engineer, the Associate tier paid me to learn production engineering on real client projects. The mentorship was the real upside.",
  },
];

export function PublicBecomeTechConsultant() {
  const { navigate } = useNav();
  const [form, setForm] = React.useState({
    name: "", email: "", phone: "", expertise: "", experience: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.expertise) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Application received! Our consultant team will reach out within 5 business days.");
    setForm({ name: "", email: "", phone: "", expertise: "", experience: "" });
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><Cpu className="h-3 w-3" /> Tech Consultant Program</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Become a <span className="text-brand">jobson.id Tech Consultant</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            For senior engineers, architects, and AI specialists who want to consult independently —
            with warm enterprise leads, co-sell support, and reliable payouts.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => {
              const el = document.getElementById("apply");
              el?.scrollIntoView({ behavior: "smooth" });
            }} className="gap-1.5">
              <Rocket className="h-4 w-4" /> Apply to consult
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
              Talk to us
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {EARNINGS_STATS.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} icon={<s.icon className="h-5 w-5" />} tone={s.tone} />
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Badge className="mb-3 gap-1"><Trophy className="h-3 w-3" /> Consultant tiers</Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Three tiers, escalating rates & support</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start where you are. Move up as you build a track record with jobson.id clients.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {TIERS.map((t) => (
            <Card
              key={t.id}
              className={`relative flex h-full flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                t.featured ? "border-brand shadow-md" : ""
              }`}
              style={t.featured ? undefined : { borderTopColor: t.color, borderTopWidth: 4 }}
            >
              {t.featured && (
                <>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1"><Sparkles className="h-3 w-3" /> Most popular</Badge>
                  </div>
                  <div
                    className="absolute inset-x-0 top-0 h-1 rounded-t-xl"
                    style={{ backgroundColor: t.color }}
                  />
                </>
              )}
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${t.color}1A`, color: t.color }}
                >
                  <t.icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold">{t.name}</h3>
              <p className="mt-1 text-lg font-bold text-brand">{t.rate}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-5 space-y-2 border-t pt-5">
                {t.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full gap-1.5"
                variant={t.featured ? "default" : "outline"}
                onClick={() => {
                  const el = document.getElementById("apply");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Apply as {t.name} <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Expertise areas */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-3 gap-1"><Brain className="h-3 w-3" /> Expertise areas</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Where we need consultants</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Eight domains where we currently have demand for senior consultants.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERTISE.map((e) => (
              <Card key={e.title} className="h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <e.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge className="mb-3 gap-1"><Layers className="h-3 w-3" /> Engagement models</Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Three ways to engage with clients</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ENGAGEMENT_MODELS.map((m) => (
            <Card key={m.id} className="h-full p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
              <div className="mt-3 border-t pt-3 text-xs">
                <span className="text-muted-foreground">Ideal for:</span>{" "}
                <span className="font-medium">{m.ideal}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Earnings potential */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-3 gap-1"><Wallet className="h-3 w-3" /> Earnings potential</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What consultants earn on jobson.id</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Associate tier avg" value="₹1.1L / mo" icon={<Award className="h-5 w-5" />} tone="brand" />
            <StatCard label="Senior tier avg" value="₹2.4L / mo" icon={<Trophy className="h-5 w-5" />} tone="brand" />
            <StatCard label="Principal tier avg" value="₹4.2L / mo" icon={<Star className="h-5 w-5" />} tone="brand" />
            <StatCard label="Top monthly payout" value="₹7.8L" icon={<TrendingUp className="h-5 w-5" />} tone="brand" />
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">Illustrative figures based on 2024 consultant data — individual results vary.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground">From application to first engagement — typically 2 weeks.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s) => (
            <Card key={s.step} className="flex h-full flex-col p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-primary-foreground">
                {s.step}
              </span>
              <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">From our consultants</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="flex h-full flex-col p-5">
                <Quote className="h-6 w-6 text-brand" />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3 border-t pt-4">
                  <AvatarLogo text={t.initials} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <Badge variant="secondary" className="border-brand/20 bg-brand/10 text-brand">
                    {t.salary}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8">
          <div className="text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-brand" />
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Apply to become a Tech Consultant</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Takes 5 minutes. We review applications weekly and respond within 5 business days.
            </p>
          </div>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-xs font-medium">Full name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs font-medium">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@email.com"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs font-medium">Phone *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98XXXXXXXX"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="expertise" className="text-xs font-medium">Primary expertise *</Label>
                <Input
                  id="expertise"
                  value={form.expertise}
                  onChange={(e) => setForm((f) => ({ ...f, expertise: e.target.value }))}
                  placeholder="e.g. AI/ML, Fullstack, Cloud"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="exp" className="text-xs font-medium">Experience & portfolio</Label>
              <Textarea
                id="exp"
                value={form.experience}
                onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                placeholder="Years of experience, notable projects/companies, links to GitHub/LinkedIn/portfolio..."
                className="mt-1.5 min-h-[120px]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> +91 80 4567 8900</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> consultants@jobson.id</span>
              <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Bengaluru · Hybrid</span>
            </div>
            <Button type="submit" size="lg" className="w-full gap-1.5">
              Submit application <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <Target className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to consult at the next level?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Join 180+ senior engineers and AI specialists who&apos;ve made jobson.id their consulting
                platform of choice.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => {
                const el = document.getElementById("apply");
                el?.scrollIntoView({ behavior: "smooth" });
              }} className="gap-1.5">
                Apply to consult <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
                Contact us
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
