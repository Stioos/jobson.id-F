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
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles, ArrowRight, Wallet, TrendingUp, Users, Trophy,
  Handshake, ShieldCheck, Megaphone, Rocket, Headset, Target,
  Award, Calculator, CheckCircle2, Quote, Star, Phone, Mail, User,
  IndianRupee, PiggyBank,
} from "lucide-react";
import { toast } from "sonner";

const TIERS = [
  {
    id: "silver",
    name: "Silver",
    commission: "8%",
    color: "#94A3B8",
    minSales: "₹0 – ₹3L / month",
    benefits: [
      "8% commission on every closed deal",
      "Marketing kit + brand assets",
      "Weekly office hours with partnership team",
      "Co-branded landing page",
    ],
    icon: Award,
  },
  {
    id: "gold",
    name: "Gold",
    commission: "12%",
    color: "#F59E0B",
    minSales: "₹3L – ₹10L / month",
    benefits: [
      "12% commission on every closed deal",
      "Dedicated partnership manager",
      "Priority lead distribution",
      "Quarterly performance bonus (up to ₹50K)",
      "Co-branded landing page + email campaigns",
    ],
    icon: Trophy,
    featured: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    commission: "16%",
    color: "#10B981",
    minSales: "₹10L+ / month",
    benefits: [
      "16% commission on every closed deal",
      "Dedicated 24/7 partnership manager",
      "Priority lead distribution + warm handoff",
      "Quarterly performance bonus (up to ₹1.5L)",
      "Annual retreat invitation + co-marketing budget",
      "White-label portal access",
    ],
    icon: Star,
  },
];

const STEPS = [
  { step: "01", title: "Apply online", desc: "Submit your application with basic details, city, and prior sales experience.", icon: User },
  { step: "02", title: "Onboarding & KYC", desc: "Complete KYC, sign the partnership agreement, and get your agent dashboard access.", icon: ShieldCheck },
  { step: "03", title: "Training & certification", desc: "Complete the 2-day sales certification on jobson.id products, pricing, and demo flow.", icon: Trophy },
  { step: "04", title: "Start selling", desc: "Receive leads from your territory, demo to clients, and submit deals through the dashboard.", icon: Megaphone },
  { step: "05", title: "Earn commissions", desc: "Get paid within 7 days of deal closure — directly to your bank account, with full visibility.", icon: Wallet },
];

const BENEFITS = [
  { icon: Wallet, title: "Weekly payouts", desc: "Commissions hit your bank within 7 days of deal closure. No chasing, no delays." },
  { icon: Headset, title: "Dedicated PM", desc: "A partnership manager is on call for demo support, pricing approvals, and escalations." },
  { icon: Megaphone, title: "Marketing kit", desc: "Co-branded landing pages, social assets, email templates, and brochures — all ready to go." },
  { icon: Target, title: "Lead distribution", desc: "Receive territory-exclusive leads based on your city and vertical expertise." },
  { icon: Trophy, title: "Performance bonuses", desc: "Quarterly bonuses from ₹50K to ₹1.5L for Gold and Platinum agents who hit targets." },
  { icon: ShieldCheck, title: "Co-sell support", desc: "Pre-sales engineers and product experts join your demos when the deal is enterprise-tier." },
];

const TESTIMONIALS = [
  {
    name: "Karthik Iyer",
    role: "Sales Agent, Chennai",
    salary: "₹2.4L / month avg",
    initials: "KI",
    quote: "I run a small staffing consultancy in Chennai. After joining jobson.id's Gold tier, my monthly income doubled — the leads are warm, the product sells itself.",
  },
  {
    name: "Deepa Nair",
    role: "Sales Agent, Kochi",
    salary: "₹1.8L / month avg",
    initials: "DN",
    quote: "The dedicated PM is the difference. I close 3 out of every 5 demos because she joins the enterprise calls. No other platform offers this level of support.",
  },
  {
    name: "Imran Sheikh",
    role: "Platinum Agent, Pune",
    salary: "₹4.6L / month avg",
    initials: "IS",
    quote: "I was a one-person agency. Platinum tier + white-label portal helped me hire a team of 4. We're now jobson.id's top-performing partner in West India.",
  },
];

const FAQS = [
  {
    q: "What's the difference between tiers?",
    a: "Commission % and support level. Silver is 8% with kit + office hours. Gold is 12% with a dedicated PM and bonus up to ₹50K. Platinum is 16% with 24/7 PM, white-label portal, and bonus up to ₹1.5L.",
  },
  {
    q: "How and when do I get paid?",
    a: "Commissions are paid directly to your bank account within 7 days of deal closure. You see every deal's commission status in real time on your agent dashboard — no manual reconciliation.",
  },
  {
    q: "Do I need prior sales experience?",
    a: "Not necessarily. We accept both experienced sales professionals and high-energy career switchers. The 2-day certification covers everything you need to demo jobson.id products.",
  },
  {
    q: "Is there an upfront fee to join?",
    a: "No. Joining the jobson.id Sales Agent program is free. We make money when you make money — that alignment is core to how we operate.",
  },
  {
    q: "Can I work part-time?",
    a: "Yes. Many agents work part-time alongside another job. There are no minimum hour requirements — your earnings are a function of how many deals you close.",
  },
];

function CalculatorCard() {
  const [monthlySales, setMonthlySales] = React.useState<number>(500000);
  const [tier, setTier] = React.useState<"silver" | "gold" | "platinum">("gold");

  const rates = { silver: 0.08, gold: 0.12, platinum: 0.16 };
  const monthlyCommission = Math.round(monthlySales * rates[tier]);
  const annualCommission = monthlyCommission * 12;
  const fmt = (n: number) => `₹${(n / 100000).toFixed(2)}L`;

  const presets = [200000, 500000, 1000000, 2000000];

  return (
    <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-brand" />
        <h3 className="text-lg font-semibold tracking-tight">Earnings calculator</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Estimate your monthly and annual commission based on tier and sales volume.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <Label htmlFor="sales" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Monthly sales volume
          </Label>
          <div className="mt-2 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <Input
              id="sales"
              type="number"
              min={0}
              value={monthlySales}
              onChange={(e) => setMonthlySales(Math.max(0, Number(e.target.value) || 0))}
              className="flex-1"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setMonthlySales(p)}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  monthlySales === p
                    ? "border-brand bg-brand text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-brand hover:text-brand"
                }`}
              >
                {fmt(p)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your tier
          </Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["silver", "gold", "platinum"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  tier === t
                    ? "border-brand bg-brand text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-brand hover:text-brand"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t pt-5">
          <div className="rounded-lg bg-background p-4">
            <p className="text-xs text-muted-foreground">Monthly commission</p>
            <p className="mt-1 text-2xl font-bold text-brand">{fmt(monthlyCommission)}</p>
          </div>
          <div className="rounded-lg bg-background p-4">
            <p className="text-xs text-muted-foreground">Annual commission</p>
            <p className="mt-1 text-2xl font-bold text-brand">{fmt(annualCommission)}</p>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          * Illustrative only. Actual earnings depend on deal closure rate, ticket size, and tier qualification.
        </p>
      </div>
    </Card>
  );
}

export function PublicBecomeSalesAgent() {
  const { navigate } = useNav();
  const [form, setForm] = React.useState({
    name: "", email: "", phone: "", city: "", experience: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Application submitted! Our partnership team will reach out within 2 business days.");
    setForm({ name: "", email: "", phone: "", city: "", experience: "" });
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><Handshake className="h-3 w-3" /> Sales Agent Program</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Earn up to <span className="text-brand">16% commission</span> selling jobson.id
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Join India&apos;s most rewarding tech sales agent program. Get territory-exclusive leads,
            co-sell support, and weekly payouts — all with zero upfront fees.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("public", "become-sales-agent#apply")} className="gap-1.5">
              <Rocket className="h-4 w-4" /> Apply now
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
          <StatCard label="Active agents" value="450+" icon={<Users className="h-5 w-5" />} tone="brand" />
          <StatCard label="Top commission" value="16%" icon={<TrendingUp className="h-5 w-5" />} tone="brand" />
          <StatCard label="Avg monthly payout" value="₹1.4L" icon={<Wallet className="h-5 w-5" />} tone="brand" />
          <StatCard label="Payout timeline" value="7 days" icon={<PiggyBank className="h-5 w-5" />} tone="brand" />
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Badge className="mb-3 gap-1"><Trophy className="h-3 w-3" /> Commission tiers</Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Three tiers, escalating rewards</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start at Silver. Get promoted based on quarterly performance — your commission % grows with you.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {TIERS.map((t) => (
            <Card
              key={t.id}
              className={`relative flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${
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
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${t.color}1A`, color: t.color }}
                >
                  <t.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="font-normal">{t.minSales}</Badge>
              </div>
              <h3 className="mt-4 text-xl font-bold">{t.name}</h3>
              <p className="mt-1 text-3xl font-bold text-brand">{t.commission}</p>
              <p className="text-xs text-muted-foreground">commission per deal</p>
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

      {/* How it works */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">From application to first commission — in 5 simple steps.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s) => (
              <Card key={s.step} className="flex h-full flex-col p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-primary-foreground">
                    {s.step}
                  </span>
                  <s.icon className="h-4 w-4 text-brand" />
                </div>
                <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge className="mb-3 gap-1"><ShieldCheck className="h-3 w-3" /> Benefits</Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why agents choose jobson.id</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <Card key={b.title} className="h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <CalculatorCard />
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">From our agents</h2>
          <p className="mt-2 text-sm text-muted-foreground">Real agents, real earnings, real stories.</p>
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
      </section>

      {/* FAQ */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border bg-card px-4">
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8">
          <div className="text-center">
            <Rocket className="mx-auto h-8 w-8 text-brand" />
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Apply to become a Sales Agent</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Takes 3 minutes. Our team responds within 2 business days.
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
                <Label htmlFor="city" className="text-xs font-medium">City *</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="e.g. Bengaluru"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="exp" className="text-xs font-medium">Sales experience</Label>
              <Textarea
                id="exp"
                value={form.experience}
                onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                placeholder="Briefly describe your sales experience, industries you've sold into, and current role..."
                className="mt-1.5 min-h-[100px]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> +91 80 4567 8900</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> partners@jobson.id</span>
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
              <Handshake className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Build a long-term partnership with jobson.id
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Whether you&apos;re an experienced sales professional or building an agency from scratch,
                our program is designed to grow with you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => {
                const el = document.getElementById("apply");
                el?.scrollIntoView({ behavior: "smooth" });
              }} className="gap-1.5">
                Apply now <ArrowRight className="h-4 w-4" />
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
