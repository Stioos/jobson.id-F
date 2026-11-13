"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, ShieldCheck, Users, Building2, Heart, Target, Globe,
  ArrowRight, Briefcase, Lock, Zap, Quote,
} from "lucide-react";

const leadership = [
  { name: "Aarav Sharma", role: "Founder & CEO", bio: "Ex-Google, IIT Bombay. Built hiring systems for 3 scale-ups.", initials: "AS" },
  { name: "Anika Verma", role: "Co-founder & CTO", bio: "Ex-Stripe, BITS Pilani. Distributed systems & ML platform veteran.", initials: "AV" },
  { name: "Sneha Reddy", role: "VP, Talent Operations", bio: "Ex-Naukri, ISB. 15 years building recruiting teams across India.", initials: "SR" },
  { name: "Vikram Joshi", role: "VP, Product", bio: "Ex-Razorpay, IIM-A. Product leader in fintech and SaaS.", initials: "VJ" },
  { name: "Dr. Lakshmi Iyer", role: "Head of Trust & Safety", bio: "PhD (Cambridge). Expert in fairness in AI hiring systems.", initials: "LI" },
  { name: "Rohan Mehta", role: "Head of Enterprise Sales", bio: "Ex-Workday, IIM-B. Built enterprise GTM at two unicorns.", initials: "RM" },
];

const values = [
  { icon: ShieldCheck, title: "Trust first", desc: "Verified employers, transparent pipelines, and consent-first data. We earn trust by being honest, even when it's hard." },
  { icon: Sparkles, title: "Augment, don't replace", desc: "AI should assist humans, not replace their judgment. Our AI features are clearly labelled, always opt-in." },
  { icon: Heart, title: "Candidate dignity", desc: "Job hunting is stressful. We design every flow to respect candidates' time, data, and self-worth." },
  { icon: Lock, title: "Privacy by design", desc: "DPDP-ready, granular consent, and clear data deletion. Your profile belongs to you — not us." },
];

const stats = [
  { label: "Founded", value: "2023", icon: Target },
  { label: "Active employers", value: "12K+", icon: Building2 },
  { label: "Candidates", value: "2M+", icon: Users },
  { label: "Cities", value: "120+", icon: Globe },
];

const milestones = [
  { year: "2023 Q1", title: "jobson.id founded in Bengaluru", desc: "Three co-founders, one mission: make hiring in India more transparent." },
  { year: "2023 Q3", title: "Launched public beta", desc: "First 1,000 employers and 50,000 candidates onboarded." },
  { year: "2024 Q1", title: "AI match scoring introduced", desc: "Transparent, explainable fit scoring — clearly labelled as simulated while we collect data." },
  { year: "2024 Q2", title: "Enterprise & agency tiers", desc: "Launched multi-tenant enterprise workspaces and agency commission tracking." },
  { year: "2024 Q3", title: "Series A funding", desc: "$15M led by Stellar Ventures to scale trust & safety, ML, and tier-2/3 reach." },
];

export function PublicAbout() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><Sparkles className="h-3 w-3" /> Our story</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Hiring should be <span className="text-brand">transparent</span>, fair, and human.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            jobson.id is an intelligent hiring platform built for India — unifying candidates,
            employers, and recruiters on one trust-first, consent-driven system.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("candidate", "overview")} className="gap-1.5">
              <Users className="h-4 w-4" /> Join as candidate
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("employer", "overview")} className="gap-1.5">
              <Building2 className="h-4 w-4" /> Hire talent
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              icon={<s.icon className="h-5 w-5" />}
              tone="brand"
            />
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">Illustrative figures — demo data is simulated.</p>
      </section>

      {/* Mission */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our mission</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                To empower every organization with technology that scales human potential — and to give every
                candidate a fair, transparent, and dignified path to opportunity.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                We started jobson.id because we believed India&apos;s hiring market deserved better than
                resume black holes, fake job posts, and opaque ATS systems. We&apos;re building the platform we
                wished existed when we were candidates — and the one we wished we had when we became hiring managers.
              </p>
              <div className="mt-6 rounded-xl border border-brand/30 bg-brand/5 p-4">
                <Quote className="h-5 w-5 text-brand" />
                <p className="mt-2 text-base italic">
                  &ldquo;Build the platform you wish existed when you were on either side of the hiring table.&rdquo;
                </p>
                <p className="mt-2 text-sm text-muted-foreground">— Aarav Sharma, Founder &amp; CEO</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Zap, title: "Fast", desc: "Apply in minutes, not hours.", tone: "bg-brand/10 text-brand" },
                { icon: ShieldCheck, title: "Trusted", desc: "Verified employers only.", tone: "bg-emerald-500/10 text-emerald-600" },
                { icon: Sparkles, title: "Intelligent", desc: "AI-assisted matching.", tone: "bg-amber-500/10 text-amber-600" },
                { icon: Heart, title: "Dignified", desc: "Respect for every candidate.", tone: "bg-rose-500/10 text-rose-600" },
              ].map((c) => (
                <Card key={c.title} className="p-5">
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${c.tone}`}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What we believe</h2>
          <p className="mt-2 text-sm text-muted-foreground">Four principles that shape every product decision.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title} className="h-full p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">Our journey so far</h2>
          <div className="relative space-y-8 before:absolute before:left-3 before:h-full before:w-px before:bg-border sm:before:left-1/2">
            {milestones.map((m, i) => (
              <div key={m.year} className={`relative pl-10 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:ml-0 sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"}`}>
                <div className={`absolute top-1 left-0 h-6 w-6 rounded-full border-2 border-brand bg-background sm:left-auto ${i % 2 === 0 ? "sm:-right-3" : "sm:-left-3"}`}>
                  <div className="absolute inset-1 rounded-full bg-brand" />
                </div>
                <Card className="p-4">
                  <Badge variant="secondary" className="mb-2">{m.year}</Badge>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Leadership</h2>
          <p className="mt-2 text-sm text-muted-foreground">Operators who&apos;ve built and scaled hiring systems before.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {leadership.map((l) => (
            <Card key={l.name} className="p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
              <AvatarLogo text={l.initials} size="xl" className="mx-auto" />
              <h3 className="mt-3 text-sm font-semibold">{l.name}</h3>
              <p className="mt-0.5 text-xs text-brand">{l.role}</p>
              <p className="mt-2 text-xs text-muted-foreground">{l.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Investors & Press */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Backed by</h2>
              <p className="mt-2 text-sm text-muted-foreground">Investors who&apos;ve backed India&apos;s most ambitious tech companies.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["Stellar Ventures", "Peak15", "Lightspeed India", "Beenext", "3one4 Capital", "Angel Squad"].map((v) => (
                  <Card key={v} className="flex h-16 items-center justify-center p-3 text-center text-xs font-medium text-muted-foreground">
                    {v}
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">In the press</h2>
              <p className="mt-2 text-sm text-muted-foreground">Coverage from leading publications.</p>
              <div className="mt-5 space-y-3">
                {[
                  { outlet: "YourStory", title: "jobson.id raises $15M Series A to make Indian hiring more transparent", date: "Aug 2024" },
                  { outlet: "Inc42", title: "How jobson.id is using AI to fix India's resume black hole problem", date: "Jul 2024" },
                  { outlet: "Economic Times", title: "Bengaluru HR-tech startup jobson.id launches enterprise tier", date: "Jun 2024" },
                ].map((p) => (
                  <Card key={p.title} className="flex items-start gap-3 p-4 transition-colors hover:border-brand">
                    <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-muted-foreground">{p.outlet} · {p.date}</div>
                      <h3 className="mt-0.5 text-sm font-medium leading-tight">{p.title}</h3>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Join us in building hiring that works for everyone</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Whether you&apos;re a candidate, an employer, or an agency — there&apos;s a place for you on jobson.id.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("candidate", "overview")} className="gap-1.5">
                Get started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
                Contact sales
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
