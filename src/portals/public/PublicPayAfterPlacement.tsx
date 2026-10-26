"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Rocket,
  TrendingUp, Clock, Users, Quote, Target, HandCoins, FileSignature,
  Briefcase, Award, PhoneCall,
} from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  {
    n: 1,
    title: "Apply & enroll",
    icon: FileSignature,
    desc: "Apply to any of our 3 flagship programs and clear the admissions diagnostic. Pay a small, refundable registration fee to lock your seat.",
    duration: "Week 0",
  },
  {
    n: 2,
    title: "Learn & build",
    icon: Rocket,
    desc: "Complete the full 20–24 week program. Build 12+ real-world projects, attend live classes, get 1:1 mentorship, and join a paid internship (FDE-FWD only).",
    duration: "Weeks 1–24",
  },
  {
    n: 3,
    title: "Get placed, then pay",
    icon: HandCoins,
    desc: "After graduation, work with our placement cell for up to 6 months. Once you accept an offer above the agreed CTC threshold, pay the program fee via EMI or income-share.",
    duration: "Within 6 months of graduation",
  },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "Zero upfront tuition", desc: "Pay only a small refundable registration fee. The bulk of your fee is due only after placement." },
  { icon: HandCoins, title: "Income-share option", desc: "Pay a fixed percentage of your salary for 12–24 months instead of a lump sum. Aligns our incentives with your success." },
  { icon: Clock, title: "6-month placement window", desc: "Take up to 6 months after graduation to find the right role. We support you the entire time with intros, coaching, and mock interviews." },
  { icon: Users, title: "220+ hiring partners", desc: "Direct relationships with India's top tech employers. Skip the resume black hole — get warm intros." },
  { icon: Target, title: "Pre-agreed CTC threshold", desc: "You only pay when you accept an offer above an agreed CTC. No placement, no payment — that's the deal." },
  { icon: TrendingUp, title: "Top 10% earn 30–60% more", desc: "Our PAP alumni network includes graduates earning up to ₹24 LPA. The model works because we only win when you win." },
];

const COMPARISON_ROWS = [
  { feature: "Upfront cost", pap: "₹5,000 refundable deposit", traditional: "₹80,000 – ₹4,50,000" },
  { feature: "Payment timing", pap: "After placement, in EMIs", traditional: "Before program starts" },
  { feature: "If you don't get placed", pap: "₹0 tuition", traditional: "Full fee due regardless" },
  { feature: "Risk", pap: "Borne by JOBSONN", traditional: "Borne by learner" },
  { feature: "Skin in the game", pap: "We win only when you win", traditional: "Institution paid regardless" },
  { feature: "Income-share option", pap: "Yes — 12–24 months", traditional: "Rare" },
];

const METRICS = [
  { label: "Avg. starting CTC", value: "₹11.2 LPA", hint: "Across 2023–24 PAP graduates", icon: TrendingUp, tone: "brand" as const },
  { label: "Placement rate", value: "94%", hint: "Within 6 months of graduation", icon: Briefcase, tone: "success" as const },
  { label: "Time to first offer", value: "47 days", hint: "Median, post-graduation", icon: Clock, tone: "brand" as const },
  { label: "Total PAP alumni", value: "1,400+", hint: "Placed across 220+ companies", icon: Users, tone: "brand" as const },
];

const TESTIMONIALS = [
  {
    name: "Pooja Reddy", role: "Full Stack Engineer @ Swiggy", initials: "PR", ctc: "₹12 LPA",
    quote: "Coming from a middle-class family, paying ₹2L upfront was impossible. PAP let me focus on learning instead of worrying about debt. I paid my fee only after my first paycheck.",
  },
  {
    name: "Karthik Iyer", role: "AI Marketing Engineer @ Zoho", initials: "KI", ctc: "₹11 LPA",
    quote: "The income-share option was perfect — I paid 12% of my salary for 18 months. It felt fair. JOBSONN had skin in the game, and they acted like it.",
  },
  {
    name: "Aarav Kulkarni", role: "Forward Deployed Engineer @ Razorpay", initials: "AK", ctc: "₹16 LPA",
    quote: "I had three offers before I graduated. Paying the PAP fee felt like paying for success, not paying for a course. That's the way education should work.",
  },
];

const FAQS = [
  {
    q: "What's the minimum CTC threshold that triggers payment?",
    a: "It varies by program. FDE-FWD: ₹8 LPA. FDE: ₹6 LPA. DSAI: ₹5 LPA. You only pay the bulk of your fee when you accept an offer at or above this threshold. If you accept a lower offer, you can choose to opt out of PAP and pay a reduced fee.",
  },
  {
    q: "What if I get placed but leave the job in 3 months?",
    a: "Once you accept an offer above the threshold, your fee obligation is triggered. Whether you stay in the role is up to you — but your fee is still due per the agreed schedule (EMI or income-share).",
  },
  {
    q: "Can I pay upfront instead and skip PAP?",
    a: "Yes. We offer an upfront-fee track at a 15% discount to the PAP fee. Some learners prefer this for tax benefits (Section 80E for education loans) or employer reimbursement. Talk to a counselor about which option works best for you.",
  },
  {
    q: "Is PAP available for international students?",
    a: "PAP is currently available only for Indian residents placed in India. International students can enroll in our upfront-fee track. We're exploring PAP for international placements — reach out if you'd like to be notified when it launches.",
  },
  {
    q: "What happens if I drop out midway through the program?",
    a: "If you drop out in the first 2 weeks, your registration fee is refunded in full. After that, a pro-rated fee becomes due based on the weeks completed. We work with learners on a case-by-case basis for medical or family emergencies.",
  },
];

export function PublicPayAfterPlacement() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1 border border-brand/30 bg-brand/10 text-brand">
            <Wallet className="h-3 w-3" /> Pay After Placement
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Learn now. <span className="text-brand">Pay only when you earn.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Pay a small refundable registration fee to start. The bulk of your program fee is due
            only after you land a job with a CTC above an agreed threshold. No placement, no payment —
            that&apos;s the deal.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("public", "programs")} className="gap-1.5">
              Explore Programs <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => toast("A counselor will reach out within 24 hours.", {
              description: "Mon–Sat, 9 AM – 8 PM IST. You can also call +91-80-4567-8900.",
            })} className="gap-1.5">
              <PhoneCall className="h-4 w-4" /> Talk to a Counselor
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand" /> ₹0 upfront tuition</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand" /> 6-month placement window</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-brand" /> Income-share & EMI options</span>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground">Three steps from application to your first paycheck.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.n} className="relative p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-primary-foreground">
                  {s.n}
                </div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <Badge variant="secondary" className="mt-4 border">{s.duration}</Badge>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ===================== BENEFITS ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why Pay After Placement works</h2>
            <p className="mt-2 text-sm text-muted-foreground">Six reasons it&apos;s the fairest way to pay for a tech education.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <Card key={i} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FEE COMPARISON ===================== */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">PAP vs traditional fee models</h2>
          <p className="mt-2 text-sm text-muted-foreground">How Pay After Placement stacks up against the typical Indian bootcamp.</p>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-3 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <div className="p-3">Feature</div>
            <div className="p-3 text-brand">JOBSONN PAP</div>
            <div className="p-3">Traditional fee</div>
          </div>
          <div className="divide-y">
            {COMPARISON_ROWS.map((row) => (
              <div key={row.feature} className="grid grid-cols-3 text-sm">
                <div className="p-3 font-medium">{row.feature}</div>
                <div className="p-3 text-brand">{row.pap}</div>
                <div className="p-3 text-muted-foreground">{row.traditional}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ===================== METRICS ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">PAP outcomes</h2>
            <p className="mt-2 text-sm text-muted-foreground">Real numbers from the last 3 cohorts.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {METRICS.map((m) => (
              <StatCard
                key={m.label}
                label={m.label}
                value={m.value}
                hint={m.hint}
                tone={m.tone}
                icon={<m.icon className="h-5 w-5" />}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Based on 1,400+ PAP graduates across FDE-FWD, FDE, and DSAI programs (2023–24). Illustrative figures.
          </p>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">PAP alumni stories</h2>
          <p className="mt-2 text-sm text-muted-foreground">Real learners, real outcomes, real fairness.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="flex h-full flex-col p-6">
              <Quote className="h-6 w-6 text-brand/40" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3 border-t pt-4">
                <AvatarLogo text={t.initials} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                </div>
                <Badge variant="secondary" className="ml-auto border border-brand/40 text-brand">{t.ctc}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">PAP FAQ</h2>
            <p className="mt-2 text-sm text-muted-foreground">Everything you need to know before signing.</p>
          </div>
          <Card className="p-2">
            <div className="divide-y">
              {FAQS.map((f, i) => (
                <details key={i} className="group p-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium hover:no-underline list-none">
                    {f.q}
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <Badge variant="secondary" className="mb-3 gap-1 border border-brand/40 text-brand">
                <Sparkles className="h-3 w-3" /> Risk-free start
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Start your career without financial risk</h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Apply to any of our 3 flagship programs. Pay only when you land a job above the agreed CTC threshold.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "programs")} className="gap-1.5">
                <Rocket className="h-4 w-4" /> Explore Programs
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "scholarship")} className="gap-1.5">
                <Award className="h-4 w-4" /> Scholarships
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
