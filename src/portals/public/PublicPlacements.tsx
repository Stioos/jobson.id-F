"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, ArrowRight, TrendingUp, Users, Building2, Clock, Wallet,
  Briefcase, CheckCircle2, Star, Calendar,
  Mic, Brain, Code2, FileText, HandCoins, Rocket,
  Quote, ArrowUpRight, HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";
import { FEATURED_BLOGS } from "@/lib/blogs";

const HERO_STATS = [
  { label: "Placements", value: "5,000+", icon: Users },
  { label: "Companies", value: "200+", icon: Building2 },
  { label: "Avg CTC", value: "₹12 LPA", icon: Wallet },
  { label: "Avg time-to-hire", value: "45 days", icon: Clock },
];

const PROCESS_STEPS = [
  { step: "01", title: "Register & complete profile", desc: "Sign up, complete your candidate profile with skills, experience, and preferences. Takes 8 minutes.", icon: Users },
  { step: "02", title: "Skill assessment", desc: "Complete role-aligned assessments — coding, aptitude, behavioral — to surface in employer searches.", icon: Brain },
  { step: "03", title: "Profile verification", desc: "Our team verifies identity, education, and employment history. Verified profiles rank higher.", icon: CheckCircle2 },
  { step: "04", title: "AI-powered matching", desc: "Our AI matches you to open roles and notifies you of high-fit opportunities as they're posted.", icon: Sparkles },
  { step: "05", title: "Interview preparation", desc: "Access mock interviews, technical prep, behavioral coaching, and resume reviews — all free.", icon: Mic },
  { step: "06", title: "Interview scheduling", desc: "We coordinate interviews with hiring managers, including pre-interview briefings and prep calls.", icon: Calendar },
  { step: "07", title: "Offer & negotiation", desc: "Get help evaluating offers, negotiating salary, and choosing between multiple offers.", icon: HandCoins },
  { step: "08", title: "Onboarding & 90-day check-in", desc: "We follow up at 30/60/90 days to ensure smooth onboarding and address any concerns.", icon: HeartHandshake },
];

const TOP_RECRUITERS = [
  "Google", "Amazon", "Microsoft", "TCS", "Infosys", "Wipro", "Accenture",
  "Deloitte", "Cognizant", "HCL", "Tech Mahindra", "Flipkart", "Swiggy", "Zomato",
];

const SUCCESS_STORIES = [
  {
    name: "Ananya Sharma",
    role: "Software Engineer II",
    company: "Google",
    salary: "₹28 LPA",
    initials: "AS",
    story: "Coming from a tier-3 college, I never imagined working at Google. jobson.id's interview prep and mock sessions made the difference — I cleared 5 rounds on the first try.",
    color: "#10B981",
  },
  {
    name: "Rahul Verma",
    role: "Data Scientist",
    company: "Swiggy",
    salary: "₹18 LPA",
    initials: "RV",
    story: "The skill assessments got me shortlisted at 4 companies. I chose Swiggy because of the team and growth — the AI matching knew what I wanted before I did.",
    color: "#F97316",
  },
  {
    name: "Priya Reddy",
    role: "Frontend Engineer",
    company: "Flipkart",
    salary: "₹22 LPA",
    initials: "PR",
    story: "After 2 years at a service company, I wanted product engineering. jobson.id's resume review and behavioral coaching helped me tell my story right. 3 offers in 6 weeks.",
    color: "#0EA5E9",
  },
];

const COMPANY_DISTRIBUTION = [
  { company: "TCS", count: 820, color: "#0EA5E9" },
  { company: "Infosys", count: 740, color: "#0EA5E9" },
  { company: "Wipro", count: 580, color: "#10B981" },
  { company: "Accenture", count: 520, color: "#8B5CF6" },
  { company: "Amazon", count: 410, color: "#F97316" },
  { company: "Flipkart", count: 360, color: "#F59E0B" },
  { company: "Swiggy", count: 280, color: "#EF4444" },
  { company: "Google", count: 190, color: "#10B981" },
];

const ROLE_SALARY = [
  { role: "Software Engineer", avg: "₹14 LPA", range: "₹8 – 28 LPA", count: "1,400+" },
  { role: "Data Scientist", avg: "₹16 LPA", range: "₹10 – 32 LPA", count: "680+" },
  { role: "Frontend Engineer", avg: "₹12 LPA", range: "₹7 – 24 LPA", count: "920+" },
  { role: "Backend Engineer", avg: "₹15 LPA", range: "₹9 – 30 LPA", count: "1,100+" },
  { role: "DevOps Engineer", avg: "₹14 LPA", range: "₹8 – 26 LPA", count: "420+" },
  { role: "Fullstack Engineer", avg: "₹13 LPA", range: "₹7 – 25 LPA", count: "780+" },
  { role: "QA Engineer", avg: "₹9 LPA", range: "₹5 – 18 LPA", count: "540+" },
  { role: "Product Manager", avg: "₹22 LPA", range: "₹14 – 40 LPA", count: "180+" },
];

const HIRING_CALENDAR = [
  { month: "Jan", level: "medium", count: "320 hires" },
  { month: "Feb", level: "high", count: "510 hires" },
  { month: "Mar", level: "peak", count: "680 hires" },
  { month: "Apr", level: "high", count: "470 hires" },
  { month: "May", level: "medium", count: "310 hires" },
  { month: "Jun", level: "low", count: "190 hires" },
  { month: "Jul", level: "medium", count: "290 hires" },
  { month: "Aug", level: "high", count: "540 hires" },
  { month: "Sep", level: "peak", count: "720 hires" },
  { month: "Oct", level: "peak", count: "650 hires" },
  { month: "Nov", level: "high", count: "430 hires" },
  { month: "Dec", level: "low", count: "160 hires" },
];

const INTERVIEW_RESOURCES = [
  { icon: Mic, title: "Mock Interviews", desc: "Practice with real interviewers from Google, Amazon, and top startups. 1:1 feedback.", color: "#10B981" },
  { icon: Brain, title: "Aptitude Prep", desc: "Quantitative, logical, and verbal reasoning practice with timed mock tests.", color: "#0EA5E9" },
  { icon: Code2, title: "Technical Prep", desc: "DSA, system design, and coding interview patterns with 200+ problems.", color: "#8B5CF6" },
  { icon: Users, title: "Behavioral Prep", desc: "STAR-format coaching for Amazon Leadership Principles and Google GRADING.", color: "#F97316" },
  { icon: FileText, title: "Resume Review", desc: "Senior recruiter reviews your resume line-by-line and rewrites weak bullets.", color: "#EF4444" },
  { icon: HandCoins, title: "Salary Negotiation", desc: "Real-time offer coaching and salary benchmarking across 200+ companies.", color: "#D4A017" },
];

const PEAK_STYLE: Record<string, string> = {
  peak: "bg-brand text-brand-foreground",
  high: "bg-brand/70 text-brand-foreground",
  medium: "bg-brand/40 text-foreground",
  low: "bg-brand/15 text-muted-foreground",
};

const PEAK_LABEL: Record<string, string> = {
  peak: "Peak",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function PublicPlacements() {
  const { navigate } = useNav();
  const featuredBlogs = FEATURED_BLOGS.slice(0, 3);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1">
            <TrendingUp className="h-3 w-3" /> Placements
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Your Gateway to <span className="text-brand">Top Tech Careers</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            5,000+ placements across 200+ companies — from FAANG to fast-growing
            startups. AI matching, interview prep, and salary coaching — all free for candidates.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("candidate", "overview")} className="gap-1.5">
              <Rocket className="h-4 w-4" /> Get Matched
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("public", "jobs")} className="gap-1.5">
              <Briefcase className="h-4 w-4" /> Browse Open Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Hero stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {HERO_STATS.map((s) => (
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

      {/* Placement process */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Your placement journey</h2>
            <p className="mt-2 text-sm text-muted-foreground">8 steps from sign-up to 90-day check-in — we're with you the whole way.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((p) => (
              <Card key={p.step} className="relative h-full p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <p.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{p.step}</span>
                </div>
                <h3 className="text-sm font-semibold">{p.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top recruiters */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our candidates work at</h2>
          <p className="mt-2 text-sm text-muted-foreground">14 of India's most sought-after employers hire from our candidate pool.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {TOP_RECRUITERS.map((c) => (
            <Card key={c} className="flex h-16 items-center justify-center p-3 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
              {c}
            </Card>
          ))}
        </div>
      </section>

      {/* Success stories */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Success stories</h2>
            <p className="mt-2 text-sm text-muted-foreground">Real candidates, real offers, real careers transformed.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {SUCCESS_STORIES.map((s) => (
              <Card key={s.name} className="flex h-full flex-col p-6" style={{ borderTopColor: s.color, borderTopWidth: 4 }}>
                <Quote className="h-7 w-7" style={{ color: s.color }} />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">&ldquo;{s.story}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t pt-4">
                  <AvatarLogo text={s.initials} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.role}, {s.company}</div>
                  </div>
                  <Badge className="gap-1 bg-brand text-brand-foreground">
                    <Wallet className="h-3 w-3" /> {s.salary}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company distribution */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Where candidates land</h2>
          <p className="mt-2 text-sm text-muted-foreground">Top 8 employers by placements in the last 12 months.</p>
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {COMPANY_DISTRIBUTION.map((c) => {
              const max = Math.max(...COMPANY_DISTRIBUTION.map((d) => d.count));
              const pct = (c.count / max) * 100;
              return (
                <div key={c.company} className="grid grid-cols-[120px_1fr_80px] items-center gap-3 sm:grid-cols-[160px_1fr_100px]">
                  <div className="text-sm font-medium">{c.company}</div>
                  <div className="h-7 overflow-hidden rounded-md bg-muted">
                    <div
                      className="flex h-full items-center justify-end rounded-md px-2 text-xs font-semibold text-white transition-all"
                      style={{ width: `${pct}%`, backgroundColor: c.color }}
                    >
                      {pct > 15 && `${c.count}`}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">{c.count} hires</div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Role & salary breakdown */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Role &amp; salary breakdown</h2>
            <p className="mt-2 text-sm text-muted-foreground">Average and range CTCs (in INR Lakhs per annum) for top placed roles.</p>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Avg CTC</th>
                    <th className="px-4 py-3 text-left font-medium">Range</th>
                    <th className="px-4 py-3 text-right font-medium">Placements</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ROLE_SALARY.map((r) => (
                    <tr key={r.role} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-brand" />
                          <span className="font-medium">{r.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand">{r.avg}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.range}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Placement timeline / hiring calendar */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">12-month hiring calendar</h2>
          <p className="mt-2 text-sm text-muted-foreground">When employers hire — plan your applications around peak months.</p>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {HIRING_CALENDAR.map((m) => (
              <div
                key={m.month}
                className={`rounded-lg p-4 text-center transition-all ${PEAK_STYLE[m.level]}`}
              >
                <div className="text-xs font-medium uppercase tracking-wide opacity-80">{m.month}</div>
                <div className="mt-1 text-lg font-bold">{PEAK_LABEL[m.level]}</div>
                <div className="mt-1 text-[10px] opacity-80">{m.count}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t pt-4 text-xs">
            {Object.entries(PEAK_LABEL).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-sm ${PEAK_STYLE[k]}`} />
                <span className="text-muted-foreground">{v} hiring</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Interview resources */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Free interview resources</h2>
            <p className="mt-2 text-sm text-muted-foreground">Everything you need to ace your next interview — free for jobson.id candidates.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INTERVIEW_RESOURCES.map((r) => (
              <Card key={r.title} className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${r.color}1A`, color: r.color }}
                >
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold group-hover:text-brand">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 -ml-2 gap-1 px-2 text-brand"
                  onClick={() => toast(`Access ${r.title}`, { description: "Open the candidate dashboard to start prepping." })}
                >
                  Start now <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured blogs */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">From our blog</h2>
            <p className="mt-2 text-sm text-muted-foreground">Career advice, interview tips, and industry insights from our editorial team.</p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3" /> Featured
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBlogs.map((b) => (
            <Card key={b.slug} className="group flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
              <Badge variant="outline" className="mb-3 w-fit">{b.category}</Badge>
              <h3 className="font-semibold leading-tight group-hover:text-brand">{b.title}</h3>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{b.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {b.readTime}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-brand">
                  Read more <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to land your dream job?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Join 50,000+ candidates using jobson.id. Free profile, AI matching, interview prep, and 5,000+ active openings.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("candidate", "overview")} className="gap-1.5">
                <Rocket className="h-4 w-4" /> Get Started Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "jobs")} className="gap-1.5">
                <Briefcase className="h-4 w-4" /> Browse Jobs
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
