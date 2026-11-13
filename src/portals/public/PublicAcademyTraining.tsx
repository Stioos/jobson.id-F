"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap, BookOpen, Users, Award, Rocket, ArrowRight, Sparkles,
  Clock, Layers, Brain, Code2, Briefcase, Target, Lightbulb,
  CheckCircle2, Quote, Calendar, Globe, ShieldCheck, Trophy, Building2,
} from "lucide-react";
import { toast } from "sonner";

const PROGRAMS = [
  {
    id: "fde",
    title: "Forward Deployment Engineer",
    short: "FDE",
    duration: "16 weeks",
    mode: "Online + Bootcamp",
    level: "Intermediate",
    color: "#0EA5E9",
    icon: Rocket,
    desc: "Build end-to-end data infrastructure and ship production AI features for enterprise customers.",
    outcomes: "₹14 – 28 LPA",
  },
  {
    id: "dsai",
    title: "Data Science & AI Engineer",
    short: "DSAI",
    duration: "20 weeks",
    mode: "Online + Capstone",
    level: "Intermediate",
    color: "#8B5CF6",
    icon: Brain,
    desc: "Master data engineering, ML modeling, and AI systems — from foundation models to MLOps.",
    outcomes: "₹16 – 32 LPA",
  },
  {
    id: "fwd",
    title: "Forward Deployed Data Engineer",
    short: "FDE-FWD",
    duration: "14 weeks",
    mode: "Online",
    level: "Advanced",
    color: "#10B981",
    icon: Layers,
    desc: "Specialize in streaming pipelines, real-time analytics, and data mesh architecture.",
    outcomes: "₹15 – 30 LPA",
  },
  {
    id: "corp-leadership",
    title: "Corporate Leadership Track",
    short: "CLT",
    duration: "10 weeks",
    mode: "In-person + Online",
    level: "Senior",
    color: "#F97316",
    icon: Briefcase,
    desc: "For mid-to-senior engineers transitioning into leadership, product, or architect roles.",
    outcomes: "₹25 – 50 LPA",
  },
  {
    id: "corp-upskilling",
    title: "Corporate Upskilling Bootcamp",
    short: "CUB",
    duration: "6 weeks",
    mode: "Custom / Onsite",
    level: "Beginner to Advanced",
    color: "#EF4444",
    icon: Building2,
    desc: "Custom training programs delivered to enterprise teams — cloud, AI, fullstack, DevOps.",
    outcomes: "Team-dependent",
  },
  {
    id: "foundations",
    title: "Engineering Foundations",
    short: "EF",
    duration: "8 weeks",
    mode: "Online",
    level: "Beginner",
    color: "#F59E0B",
    icon: BookOpen,
    desc: "Pre-graduate and early-career track covering CS fundamentals, DSA, and modern web dev.",
    outcomes: "₹6 – 12 LPA",
  },
];

const CURRICULUM_PHASES = [
  {
    phase: "Phase 1",
    title: "Foundations",
    weeks: "Weeks 1 – 4",
    desc: "Build strong fundamentals in CS, data structures, version control, and development workflows.",
    topics: ["DSA patterns", "Git & collaboration", "Testing & debugging", "Web fundamentals", "Python or JS deep-dive"],
  },
  {
    phase: "Phase 2",
    title: "Core specialization",
    weeks: "Weeks 5 – 10",
    desc: "Domain-specific deep work — fullstack, data engineering, ML, or AI systems depending on track.",
    topics: ["Specialization modules", "Hands-on labs", "Code reviews", "Pair programming", "Industry projects"],
  },
  {
    phase: "Phase 3",
    title: "Capstone & production",
    weeks: "Weeks 11 – 14",
    desc: "Ship a production-grade project to your portfolio, with mentor reviews and demo days.",
    topics: ["Capstone project", "Architecture review", "Production deployment", "Portfolio polish", "Demo day"],
  },
  {
    phase: "Phase 4",
    title: "Placement & career",
    weeks: "Weeks 15 – 16",
    desc: "Mock interviews, resume reviews, salary negotiation, and direct introductions to hiring partners.",
    topics: ["Mock interviews", "Resume review", "Salary negotiation", "Partner intros", "Offer evaluation"],
  },
];

const MENTORS = [
  {
    name: "Anika Verma",
    role: "Lead Mentor — AI/ML",
    expertise: "Ex-Stripe. Distributed systems, MLOps, foundation models.",
    initials: "AV",
    areas: ["LLMs", "MLOps", "Distributed Systems"],
  },
  {
    name: "Vikram Joshi",
    role: "Lead Mentor — Product & Strategy",
    expertise: "Ex-Razorpay. Product management, growth, GTM.",
    initials: "VJ",
    areas: ["Product", "Growth", "GTM"],
  },
  {
    name: "Dr. Lakshmi Iyer",
    role: "Lead Mentor — Trust & AI Ethics",
    expertise: "PhD (Cambridge). Fairness in AI, governance, evaluation.",
    initials: "LI",
    areas: ["AI Ethics", "Evaluation", "Governance"],
  },
  {
    name: "Sneha Reddy",
    role: "Lead Mentor — Career & Placements",
    expertise: "Ex-Naukri. 15 years building recruiting teams across India.",
    initials: "SR",
    areas: ["Career", "Recruiting", "Interview Prep"],
  },
];

const COHORTS = [
  { id: "c1", program: "FDE — Forward Deployment Engineer", start: "Feb 3, 2025", mode: "Online + Bengaluru Bootcamp", seats: 24, status: "Open" },
  { id: "c2", program: "DSAI — Data Science & AI Engineer", start: "Feb 17, 2025", mode: "Online + Capstone", seats: 30, status: "Open" },
  { id: "c3", program: "FDE-FWD — Forward Deployed Data Engineer", start: "Mar 10, 2025", mode: "Online", seats: 18, status: "Open" },
  { id: "c4", program: "EF — Engineering Foundations", start: "Mar 24, 2025", mode: "Online", seats: 40, status: "Open" },
];

const WHY_US = [
  { icon: Trophy, title: "Pay after placement", desc: "Pay only after you land a job. Our incentives are aligned with your outcome." },
  { icon: Users, title: "Mentor-led cohort", desc: "4 lead mentors + 12 industry practitioners guide every cohort, 1:6 ratio." },
  { icon: Briefcase, title: "200+ hiring partners", desc: "Direct pipelines into 200+ companies — from Google to high-growth startups." },
  { icon: Code2, title: "Production-grade projects", desc: "Ship real code to your portfolio. No toy apps. No fake datasets." },
  { icon: Target, title: "Role-aligned tracks", desc: "18 role-specific tracks across FDE, DSAI, and corporate upskilling." },
  { icon: ShieldCheck, title: "Lifetime career support", desc: "Mock interviews, salary negotiation, and 90-day check-ins — even after placement." },
];

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "Software Engineer II",
    company: "Google",
    salary: "₹28 LPA",
    initials: "AS",
    quote: "The FDE program rewired how I think about production systems. The mentor reviews were brutal but invaluable — I cleared Google on my first try.",
  },
  {
    name: "Rahul Verma",
    role: "Data Scientist",
    company: "Swiggy",
    salary: "₹18 LPA",
    initials: "RV",
    quote: "Pay-after-placement wasn't a marketing line. The team cared about my placement more than I did — and it showed in the offer I accepted.",
  },
  {
    name: "Priya Reddy",
    role: "Frontend Engineer",
    company: "Flipkart",
    salary: "₹22 LPA",
    initials: "PR",
    quote: "Coming from a service company, the capstone project was a game-changer. It became the talking point in every interview I had.",
  },
];

export function PublicAcademyTraining() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><GraduationCap className="h-3 w-3" /> jobson.id Academy</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Train for high-growth tech careers — <span className="text-brand">pay only after placement</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Industry-led bootcamps, corporate tracks, and mentor-driven cohorts across FDE, DSAI, and
            engineering leadership. Built and delivered by practitioners from Google, Stripe, and Razorpay.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("public", "programs")} className="gap-1.5">
              <Sparkles className="h-4 w-4" /> Explore programs
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("public", "pay-after-placement")} className="gap-1.5">
              How PAP works
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Programs" value="6+" icon={<BookOpen className="h-5 w-5" />} tone="brand" />
          <StatCard label="Placement rate" value="94%" icon={<Trophy className="h-5 w-5" />} tone="brand" />
          <StatCard label="Hiring partners" value="200+" icon={<Briefcase className="h-5 w-5" />} tone="brand" />
          <StatCard label="Avg CTC" value="₹12 LPA" icon={<Award className="h-5 w-5" />} tone="brand" />
        </div>
      </section>

      {/* Programs catalog */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Training programs catalog</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Six tracks across FDE, DSAI, corporate, and foundations. All cohorts are mentor-led.
            </p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <Card
              key={p.id}
              className="flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand"
              onClick={() => navigate("public", "programs")}
              style={{ borderTopColor: p.color, borderTopWidth: 4 }}
            >
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${p.color}1A`, color: p.color }}
                  >
                    <p.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{p.short}</Badge>
                </div>
                <h3 className="mt-4 font-semibold leading-tight">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="mt-0.5 font-medium">{p.duration}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Level</p>
                    <p className="mt-0.5 font-medium">{p.level}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Outcomes</p>
                    <p className="mt-0.5 font-medium text-brand">{p.outcomes}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-brand">
                  <span>View program</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-3 gap-1"><Layers className="h-3 w-3" /> Curriculum</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Four phases, sixteen weeks</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A structured journey from foundations to placement — across every program track.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CURRICULUM_PHASES.map((ph, i) => (
              <Card key={ph.phase} className="flex h-full flex-col p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                    {i + 1}
                  </span>
                  <Badge variant="secondary" className="font-normal">{ph.phase}</Badge>
                </div>
                <h3 className="mt-3 font-semibold">{ph.title}</h3>
                <p className="text-xs text-brand">{ph.weeks}</p>
                <p className="mt-2 text-sm text-muted-foreground">{ph.desc}</p>
                <div className="mt-3 max-h-44 flex-1 space-y-1.5 overflow-y-auto pr-1">
                  {ph.topics.map((t) => (
                    <div key={t} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge className="mb-3 gap-1"><Users className="h-3 w-3" /> Mentors</Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Learn from practitioners, not professors</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every cohort is led by 4 lead mentors and 12+ industry practitioners — 1:6 ratio.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MENTORS.map((m) => (
            <Card key={m.name} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <AvatarLogo text={m.initials} size="lg" />
              <h3 className="mt-3 font-semibold">{m.name}</h3>
              <p className="text-xs text-brand">{m.role}</p>
              <p className="mt-2 text-xs text-muted-foreground">{m.expertise}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.areas.map((a) => (
                  <Badge key={a} variant="secondary" className="font-normal">{a}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Cohorts schedule */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Upcoming cohorts</h2>
              <p className="mt-2 text-sm text-muted-foreground">Reserve a seat — cohorts fill up 3–4 weeks in advance.</p>
            </div>
            <Button variant="outline" onClick={() => navigate("public", "contact")} className="hidden gap-1.5 sm:inline-flex">
              Talk to counselor <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Program</th>
                    <th className="px-4 py-3 font-medium">Start date</th>
                    <th className="px-4 py-3 font-medium">Mode</th>
                    <th className="px-4 py-3 font-medium">Seats</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {COHORTS.map((c) => (
                    <tr key={c.id} className="border-t transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{c.program}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {c.start}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.mode}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.seats}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast.success(`Reserved a seat for ${c.program} — we'll be in touch.`)}
                        >
                          Reserve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge className="mb-3 gap-1"><Lightbulb className="h-3 w-3" /> Why jobson.id Academy</Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Six reasons candidates choose us</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((w) => (
            <Card key={w.title} className="h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <w.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">From our alumni</h2>
            <p className="mt-2 text-sm text-muted-foreground">Real outcomes, real salaries, real stories.</p>
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
                    <p className="truncate text-xs text-muted-foreground">{t.role} · {t.company}</p>
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

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {[
            {
              q: "Do I really only pay after I get a job?",
              a: "Yes. Our Pay-After-Placement model means no upfront tuition. You pay a percentage of your CTC (capped) only after you accept an offer above the agreed threshold. Full terms are on the PAP page.",
            },
            {
              q: "What's the time commitment for a cohort?",
              a: "Plan for 30–40 hours per week — a mix of live sessions, async coursework, and project work. Most learners keep a part-time job alongside, but we don't recommend full-time work during the capstone phase.",
            },
            {
              q: "Do you offer scholarships?",
              a: "Yes. We have four scholarship categories — Merit, Need-Based, Women in Tech, and Defense. Awards range from ₹1L to ₹2.5L. See the scholarship page for details and deadlines.",
            },
            {
              q: "Is the program online or in-person?",
              a: "Most programs are online with optional in-person bootcamps in Bengaluru. The Corporate Leadership Track and Corporate Upskilling Bootcamp can be delivered on-site at your office.",
            },
            {
              q: "What happens if I don't get placed?",
              a: "You don't pay. We also continue career support for up to 12 months after cohort end — mock interviews, partner intros, and resume reviews — until you land a role.",
            },
          ].map((item, i) => (
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
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <GraduationCap className="h-6 w-6 text-brand" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to enroll?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Talk to a counselor, reserve a seat, or apply for a scholarship — your next career step
                starts here.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "programs")} className="gap-1.5">
                Explore programs <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "scholarship")} className="gap-1.5">
                <Globe className="h-4 w-4" /> Scholarships
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
