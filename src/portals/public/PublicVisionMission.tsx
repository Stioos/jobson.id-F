"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Target, Eye, Compass, Heart, Shield, Zap, Users,
  Lightbulb, Award, Handshake, Layers, Rocket, ArrowRight,
  CheckCircle2, Flag, Globe, Quote,
} from "lucide-react";

const VALUES = [
  { icon: Lightbulb, title: "Innovation", desc: "We push the boundaries of what hiring technology can do — building for tomorrow, not yesterday.", color: "bg-brand/10 text-brand" },
  { icon: Award, title: "Excellence", desc: "We hold ourselves to a high bar — in craft, in service, in outcomes. Good enough isn't.", color: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
  { icon: Shield, title: "Integrity", desc: "We do the right thing even when no one is watching. Trust is the only currency we accept.", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
  { icon: Rocket, title: "Impact", desc: "We measure ourselves by the careers built and the companies strengthened — not vanity metrics.", color: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  { icon: Handshake, title: "Inclusion", desc: "Talent has no postcode, gender, or caste. We build for every Indian who wants to work.", color: "bg-violet-500/10 text-violet-600 dark:text-violet-300" },
  { icon: Layers, title: "Agility", desc: "We move fast, learn faster, and ship every week. The market won't wait — neither will we.", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300" },
];

const MILESTONES = [
  { year: "2023 Q1", title: "jobson.id founded in Bengaluru", desc: "Three co-founders left their jobs at Google, Stripe, and Naukri to build a hiring platform for India.", icon: Flag },
  { year: "2023 Q3", title: "Public beta launched", desc: "Onboarded first 1,000 employers and 50,000 candidates across 6 Indian cities.", icon: Rocket },
  { year: "2024 Q1", title: "AI match scoring introduced", desc: "Launched explainable, transparent AI matching — clearly labelled as simulated while we collected calibration data.", icon: Sparkles },
  { year: "2024 Q3", title: "Series A funding", desc: "Raised $15M led by Stellar Ventures to scale trust & safety, ML, and tier-2/3 city reach.", icon: CheckCircle2 },
  { year: "2025 Q1", title: "Academy & placement guarantee", desc: "Launched jobson.id Academy with Pay-After-Placement across 4 specializations and 18 role tracks.", icon: Award },
];

const LEADERSHIP = [
  { name: "Aarav Sharma", role: "Founder & CEO", bio: "Ex-Google, IIT Bombay. Built hiring systems for 3 scale-ups.", initials: "AS" },
  { name: "Anika Verma", role: "Co-founder & CTO", bio: "Ex-Stripe, BITS Pilani. Distributed systems & ML platform veteran.", initials: "AV" },
  { name: "Sneha Reddy", role: "VP, Talent Operations", bio: "Ex-Naukri, ISB. 15 years building recruiting teams across India.", initials: "SR" },
  { name: "Vikram Joshi", role: "VP, Product", bio: "Ex-Razorpay, IIM-A. Product leader in fintech and SaaS.", initials: "VJ" },
  { name: "Dr. Lakshmi Iyer", role: "Head of Trust & Safety", bio: "PhD (Cambridge). Expert in fairness in AI hiring systems.", initials: "LI" },
  { name: "Rohan Mehta", role: "Head of Enterprise Sales", bio: "Ex-Workday, IIM-B. Built enterprise GTM at two unicorns.", initials: "RM" },
];

export function PublicVisionMission() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><Compass className="h-3 w-3" /> Our direction</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Our <span className="text-brand">Vision &amp; Mission</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            We&apos;re building the trust layer of Indian hiring — where every candidate has a fair shot
            and every employer finds the right hire, faster.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("public", "about")} className="gap-1.5">
              About jobson.id <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
              Contact us
            </Button>
          </div>
        </div>
      </section>

      {/* Vision & Mission cards */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">Vision</p>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Where we&apos;re going</h2>
              </div>
            </div>
            <p className="mt-5 text-lg leading-relaxed text-foreground sm:text-xl">
              To be India&apos;s most trusted hiring platform — the default place where talent meets
              opportunity, and where every job application is treated with respect.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              We envision a future where a candidate in a tier-3 town has the same access to opportunities
              as someone in Bengaluru, and where an SME in Indore can hire as effectively as a unicorn in
              Gurugram.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="secondary">Trust-first</Badge>
              <Badge variant="secondary">India-focused</Badge>
              <Badge variant="secondary">Candidate dignity</Badge>
            </div>
          </Card>

          <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-emerald-500/10 via-background to-background p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">Mission</p>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">What we do every day</h2>
              </div>
            </div>
            <p className="mt-5 text-lg leading-relaxed text-foreground sm:text-xl">
              To empower every organization with technology that scales human potential — and to give
              every candidate a fair, transparent, and dignified path to opportunity.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              We do this by combining AI-assisted matching with verified employer pipelines, consent-driven
              candidate profiles, and a Pay-After-Placement academy that aligns our success with the
              success of the people we serve.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="secondary">AI-assisted</Badge>
              <Badge variant="secondary">Verified</Badge>
              <Badge variant="secondary">Pay-after-placement</Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* Core values */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-3 gap-1"><Heart className="h-3 w-3" /> Core values</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Six principles that shape every decision</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              These aren&apos;t posters on a wall. They&apos;re the lens we use when the road forks.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <Card key={v.title} className="h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${v.color}`}>
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our journey so far</h2>
          <p className="mt-2 text-sm text-muted-foreground">Five milestones on the road to a more transparent hiring market.</p>
        </div>
        <div className="relative space-y-8 before:absolute before:left-3 before:h-full before:w-px before:bg-border sm:before:left-1/2">
          {MILESTONES.map((m, i) => (
            <div
              key={m.year}
              className={`relative pl-10 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:ml-0 sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"}`}
            >
              <div
                className={`absolute top-1 left-0 h-6 w-6 rounded-full border-2 border-brand bg-background sm:left-auto ${i % 2 === 0 ? "sm:-right-3" : "sm:-left-3"}`}
              >
                <div className="absolute inset-1 rounded-full bg-brand" />
              </div>
              <Card className="p-4 sm:p-5">
                <div className={`flex items-center gap-2 ${i % 2 === 0 ? "sm:justify-end" : ""}`}>
                  <m.icon className="h-4 w-4 text-brand" />
                  <Badge variant="secondary">{m.year}</Badge>
                </div>
                <h3 className="mt-2 font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Numbers that define us</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Candidates" value="2M+" icon={<Users className="h-5 w-5" />} tone="brand" />
            <StatCard label="Employers" value="12K+" icon={<Shield className="h-5 w-5" />} tone="brand" />
            <StatCard label="Cities" value="120+" icon={<Globe className="h-5 w-5" />} tone="brand" />
            <StatCard label="Placements" value="5,000+" icon={<Rocket className="h-5 w-5" />} tone="brand" />
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">Illustrative figures — demo data is simulated.</p>
        </div>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Leadership team</h2>
          <p className="mt-2 text-sm text-muted-foreground">Operators who&apos;ve built and scaled hiring systems before.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {LEADERSHIP.map((l) => (
            <Card key={l.name} className="p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
              <AvatarLogo text={l.initials} size="xl" className="mx-auto" />
              <h3 className="mt-3 text-sm font-semibold">{l.name}</h3>
              <p className="mt-0.5 text-xs text-brand">{l.role}</p>
              <p className="mt-2 text-xs text-muted-foreground">{l.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <Quote className="mx-auto h-8 w-8 text-brand" />
            <p className="mt-4 text-lg italic leading-relaxed sm:text-xl">
              &ldquo;Build the platform you wish existed when you were on either side of the hiring
              table — and never compromise on the candidate&apos;s dignity.&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold">Aarav Sharma</p>
            <p className="text-xs text-muted-foreground">Founder &amp; CEO, jobson.id</p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <Zap className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Build the future of hiring with us
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Whether you&apos;re a candidate looking for your next role, an employer building a team,
                or a partner who shares our vision — there&apos;s a place for you at jobson.id.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "jobs")} className="gap-1.5">
                Browse jobs <ArrowRight className="h-4 w-4" />
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
