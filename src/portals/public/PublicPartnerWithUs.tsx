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
import {
  Handshake, ArrowRight, TrendingUp, Wallet, Cpu, GraduationCap,
  Megaphone, UserCog, Calculator, CheckCircle2, Quote, IndianRupee,
  Layers, Users, Sparkles, Briefcase, Target,
} from "lucide-react";
import { toast } from "sonner";

const WHY_PARTNER = [
  { icon: Wallet, title: "Revenue sharing", desc: "Transparent, escalating revenue share — up to 30% on every closed deal through your channel.", tone: "bg-brand/10 text-brand" },
  { icon: Briefcase, title: "Brand association", desc: "Co-brand with India's fastest-growing hiring & talent platform. Built-in credibility from day one.", tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
  { icon: Cpu, title: "Tech access", desc: "Full access to our API, partner portal, and AI matching engine. Build on top of our infrastructure.", tone: "bg-violet-500/10 text-violet-600 dark:text-violet-300" },
  { icon: GraduationCap, title: "Training support", desc: "Sales certification, technical onboarding, and ongoing enablement for your team — free.", tone: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
  { icon: Megaphone, title: "Marketing support", desc: "Co-branded collateral, joint campaigns, event sponsorship, and PR support for marquee wins.", tone: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  { icon: UserCog, title: "Dedicated PM", desc: "A partnership manager who knows your business, joins your sales calls, and unblocks deals.", tone: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300" },
];

const MODELS = [
  {
    id: "tech",
    name: "Technology Partner",
    color: "#0EA5E9",
    icon: Cpu,
    desc: "Build complementary products on the JOBSONN platform — integrations, vertical SaaS, white-label deployments.",
    benefits: [
      "Full API & webhooks access",
      "30% revenue share on co-sold deals",
      "Co-engineering support",
      "Marketplace listing",
      "Joint go-to-market motion",
    ],
    ideal: "SaaS founders, system integrators, product studios",
  },
  {
    id: "channel",
    name: "Channel Partner",
    color: "#10B981",
    icon: Layers,
    desc: "Resell JOBSONN products into your existing customer base — staffing firms, HR consultancies, BPOs.",
    benefits: [
      "20-25% reseller margin",
      "Co-branded sales collateral",
      "Dedicated PM support",
      "Lead distribution in your territory",
      "Quarterly performance bonuses",
    ],
    ideal: "Staffing firms, HR consultancies, recruiting agencies",
    featured: true,
  },
  {
    id: "strategic",
    name: "Strategic Partner",
    color: "#8B5CF6",
    icon: Handshake,
    desc: "Deep, multi-year alliances — joint product development, market expansion, equity-aligned incentives.",
    benefits: [
      "Custom revenue share structure",
      "Joint product roadmap",
      "Exclusive territory rights",
      "Co-marketing budget allocation",
      "Executive sponsor + quarterly reviews",
    ],
    ideal: "Large enterprises, platform companies, PE/VC portfolios",
  },
];

const STEPS = [
  { step: "01", title: "Discovery call", desc: "30-min call to understand your business, customer base, and the partnership model that fits best." },
  { step: "02", title: "Mutual fit & term sheet", desc: "We share a partnership term sheet with revenue share, territory rights, and mutual commitments." },
  { step: "03", title: "Onboarding & training", desc: "Technical onboarding, sales certification, and co-branded collateral setup — typically 2 weeks." },
  { step: "04", title: "Go-to-market", desc: "Joint GTM motion kicks off — leads, demos, deals. Your PM is on call from day one." },
];

const TESTIMONIALS = [
  {
    name: "Pooja Bhatia",
    role: "CEO, TalentBridge Consulting",
    company: "Channel Partner",
    initials: "PB",
    quote: "We've been a JOBSONN Channel Partner for 14 months. The dedicated PM is the key — she joins our top deals and unblocks pricing in real time. Revenue share is honest and on-time.",
  },
  {
    name: "Sahil Kapoor",
    role: "Founder, HRTech Solutions",
    company: "Technology Partner",
    initials: "SK",
    quote: "The API access let us build a vertical SaaS on top of JOBSONN's matching engine in 4 months. We launched to our first 50 customers and never looked back.",
  },
  {
    name: "Meera Krishnan",
    role: "VP Partnerships, PeopleFirst",
    company: "Strategic Partner",
    initials: "MK",
    quote: "Our 3-year strategic alliance with JOBSONN unlocked an enterprise segment we couldn't reach alone. Joint product roadmap, co-marketing, and clean revenue accounting. Rare in this industry.",
  },
];

function RevenueCalculator() {
  const [dealsPerMonth, setDealsPerMonth] = React.useState<number>(8);
  const [avgDealSize, setAvgDealSize] = React.useState<number>(150000);
  const [share, setShare] = React.useState<number>(25);

  const monthlyRevenue = dealsPerMonth * avgDealSize * (share / 100);
  const annualRevenue = monthlyRevenue * 12;
  const fmt = (n: number) => `₹${(n / 100000).toFixed(2)}L`;

  return (
    <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-brand" />
        <h3 className="text-lg font-semibold tracking-tight">Partnership revenue calculator</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Estimate your share of revenue from a JOBSONN partnership.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <Label htmlFor="deals" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Deals closed per month
          </Label>
          <Input
            id="deals"
            type="number"
            min={0}
            value={dealsPerMonth}
            onChange={(e) => setDealsPerMonth(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2"
          />
          <input
            type="range"
            min={0}
            max={50}
            value={Math.min(dealsPerMonth, 50)}
            onChange={(e) => setDealsPerMonth(Number(e.target.value))}
            className="mt-2 w-full accent-brand"
            aria-label="Deals per month"
          />
        </div>
        <div>
          <Label htmlFor="deal-size" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Average deal size (₹)
          </Label>
          <div className="mt-2 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <Input
              id="deal-size"
              type="number"
              min={0}
              value={avgDealSize}
              onChange={(e) => setAvgDealSize(Math.max(0, Number(e.target.value) || 0))}
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Revenue share (%)
          </Label>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {[10, 15, 20, 25, 30].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setShare(p)}
                className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                  share === p
                    ? "border-brand bg-brand text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-brand hover:text-brand"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t pt-5">
          <div className="rounded-lg bg-background p-4">
            <p className="text-xs text-muted-foreground">Monthly revenue</p>
            <p className="mt-1 text-2xl font-bold text-brand">{fmt(monthlyRevenue)}</p>
          </div>
          <div className="rounded-lg bg-background p-4">
            <p className="text-xs text-muted-foreground">Annual revenue</p>
            <p className="mt-1 text-2xl font-bold text-brand">{fmt(annualRevenue)}</p>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          * Illustrative only. Actual revenue depends on deal closure, ticket size, and partnership model.
        </p>
      </div>
    </Card>
  );
}

export function PublicPartnerWithUs() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><Handshake className="h-3 w-3" /> Strategic Partnerships</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Partner with JOBSONN to <span className="text-brand">grow together</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Beyond franchise — a strategic partnership program for technology, channel, and ecosystem
            partners who want to build, resell, or co-create with India&apos;s hiring platform of choice.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("public", "contact")} className="gap-1.5">
              <Sparkles className="h-4 w-4" /> Start the conversation
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("public", "tech-ai-services")} className="gap-1.5">
              Explore services
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Active partners" value="120+" icon={<Users className="h-5 w-5" />} tone="brand" />
          <StatCard label="Partner revenue" value="₹42 Cr+" icon={<Wallet className="h-5 w-5" />} tone="brand" />
          <StatCard label="Co-sold deals" value="3,800+" icon={<Briefcase className="h-5 w-5" />} tone="brand" />
          <StatCard label="Partner NPS" value="68" icon={<TrendingUp className="h-5 w-5" />} tone="brand" />
        </div>
      </section>

      {/* Why partner */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Badge className="mb-3 gap-1"><Target className="h-3 w-3" /> Why partner with us</Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Six reasons to align with JOBSONN</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_PARTNER.map((w) => (
            <Card key={w.title} className="h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${w.tone}`}>
                <w.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Partnership models */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-3 gap-1"><Layers className="h-3 w-3" /> Partnership models</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Three ways to partner with us</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick the model that fits your business — or talk to us about a custom alliance.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {MODELS.map((m) => (
              <Card
                key={m.id}
                className={`relative flex h-full flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  m.featured ? "border-brand shadow-md" : ""
                }`}
                style={m.featured ? undefined : { borderTopColor: m.color, borderTopWidth: 4 }}
              >
                {m.featured && (
                  <>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gap-1"><Sparkles className="h-3 w-3" /> Most popular</Badge>
                    </div>
                    <div
                      className="absolute inset-x-0 top-0 h-1 rounded-t-xl"
                      style={{ backgroundColor: m.color }}
                    />
                  </>
                )}
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${m.color}1A`, color: m.color }}
                  >
                    <m.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-bold">{m.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
                <ul className="mt-4 space-y-1.5 border-t pt-4">
                  {m.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs text-muted-foreground">Ideal for:</p>
                  <p className="mt-0.5 text-xs font-medium">{m.ideal}</p>
                </div>
                <Button
                  className="mt-5 w-full gap-1.5"
                  variant={m.featured ? "default" : "outline"}
                  onClick={() => navigate("public", "contact")}
                >
                  Explore {m.name} <ArrowRight className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <RevenueCalculator />
      </section>

      {/* Process */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Partnership process</h2>
            <p className="mt-2 text-sm text-muted-foreground">From first call to go-to-market — typically 4 weeks.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">From our partners</h2>
          <p className="mt-2 text-sm text-muted-foreground">Three businesses, three models, one outcome: growth.</p>
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
                  <Badge variant="secondary" className="mt-1 font-normal">{t.company}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <Handshake className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Let&apos;s build something together
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Tell us about your business and the partnership model you&apos;re considering. Our
                partnerships team responds within one business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "contact")} className="gap-1.5">
                Contact partnerships <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => toast.info("Partnership deck will be sent to your inbox.")} className="gap-1.5">
                Download partnership deck
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
