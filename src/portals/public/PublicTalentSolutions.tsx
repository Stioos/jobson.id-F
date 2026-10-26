"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Sparkles, ArrowRight, Users, Building2, Target, Award, GraduationCap,
  UserCheck, ClipboardCheck, Briefcase, BrainCircuit,
  HeartHandshake, Gauge, Layers, Factory, Stethoscope, Banknote,
  ShoppingBag, GraduationCap as EduIcon, Home, Cpu, Truck, TrendingUp,
  Quote, Clock, ShieldCheck, Headset, Wallet, FileText, Globe,
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

interface MainSolution {
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  badge: string;
  route: string;
}

const MAIN_SOLUTIONS: MainSolution[] = [
  { title: "Train to Hire", desc: "Upskill fresh talent through industry-aligned training programs before they join your team.", icon: GraduationCap, color: "#0EA5E9", badge: "Training + Placement", route: "talent/talent-train-to-hire" },
  { title: "Hire to Train", desc: "Hire promising candidates first, then we train them to meet your exact technical requirements.", icon: UserCheck, color: "#8B5CF6", badge: "Hire + Upskill", route: "talent/talent-hire-to-train" },
  { title: "Staffing Solutions", desc: "Flexible staffing — contract, permanent, or project-based — to scale your team on demand.", icon: Users, color: "#10B981", badge: "Flexible Staffing", route: "talent/talent-staffing" },
  { title: "Corporate Training", desc: "Custom corporate training programs designed to upskill your existing workforce at scale.", icon: Award, color: "#F97316", badge: "Enterprise Training", route: "talent/talent-corporate-training" },
  { title: "Talent Assessment", desc: "AI-powered assessments to evaluate technical skills, aptitude, and cultural fit scientifically.", icon: ClipboardCheck, color: "#EF4444", badge: "AI Assessment", route: "talent/talent-assessment" },
  { title: "Placements", desc: "Connect with top employers across industries and unlock career-defining placement opportunities.", icon: TrendingUp, color: "#D4A017", badge: "Career Placement", route: "placements" },
];

interface Benefit {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const BENEFITS: Benefit[] = [
  { icon: Gauge, title: "Faster hiring", desc: "Reduce time-to-hire by up to 60% with pre-vetted, role-ready talent pools and AI matching." },
  { icon: BrainCircuit, title: "AI-powered matching", desc: "Transparent fit scoring across skills, experience, and culture — clearly labelled and explainable." },
  { icon: ShieldCheck, title: "Verified candidates", desc: "Every candidate is identity-verified, skill-tested, and reference-checked before presentation." },
  { icon: Layers, title: "Flexible models", desc: "Train-to-hire, hire-to-train, contract, permanent, project — pick the engagement that fits." },
  { icon: Factory, title: "Industry expertise", desc: "Specialized talent pools for healthcare, finance, retail, manufacturing, EdTech, IT and more." },
  { icon: Headset, title: "Dedicated support", desc: "Every account gets a dedicated talent partner and 24×7 escalation channel for hiring teams." },
];

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

const PROCESS_STEPS: ProcessStep[] = [
  { step: "01", title: "Discovery & scoping", desc: "We meet your team to understand role specs, must-have skills, budget bands, and cultural markers.", icon: Target },
  { step: "02", title: "Talent pool mapping", desc: "Our team taps into 2M+ verified candidates and your past-applicant pipeline to map fit.", icon: Users },
  { step: "03", title: "AI-assisted shortlisting", desc: "Transparent fit scoring surfaces the top 5–10 candidates per role, with reasons explained.", icon: BrainCircuit },
  { step: "04", title: "Skill assessment", desc: "Candidates complete role-aligned assessments — technical, aptitude, and behavioral.", icon: ClipboardCheck },
  { step: "05", title: "Interview orchestration", desc: "We schedule, coordinate, and host structured interviews with shared scorecards.", icon: Briefcase },
  { step: "06", title: "Offer & negotiation", desc: "Our partners handle offer extension, salary negotiation, and candidate acceptance.", icon: Wallet },
  { step: "07", title: "Onboarding & training", desc: "Selected hires complete onboarding programs and any role-specific upskilling required.", icon: GraduationCap },
  { step: "08", title: "Retention tracking", desc: "We track 30/60/90-day and 1-year retention, replacing free of charge if needed.", icon: HeartHandshake },
];

interface IndustryCard {
  icon: LucideIcon;
  name: string;
  hires: string;
  color: string;
}

const INDUSTRIES: IndustryCard[] = [
  { icon: Stethoscope, name: "Healthcare", hires: "1,200+ hires", color: "#EF4444" },
  { icon: Banknote, name: "Finance", hires: "980+ hires", color: "#10B981" },
  { icon: ShoppingBag, name: "Retail", hires: "1,450+ hires", color: "#F97316" },
  { icon: Factory, name: "Manufacturing", hires: "760+ hires", color: "#0EA5E9" },
  { icon: EduIcon, name: "EdTech", hires: "540+ hires", color: "#8B5CF6" },
  { icon: Home, name: "Real Estate", hires: "430+ hires", color: "#D4A017" },
  { icon: Cpu, name: "IT & SaaS", hires: "2,800+ hires", color: "#06B6D4" },
  { icon: Truck, name: "Logistics", hires: "690+ hires", color: "#F59E0B" },
];

interface CaseStudy {
  name: string;
  industry: string;
  color: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    name: "FinEdge",
    industry: "Fintech",
    color: "#10B981",
    challenge: "Needed 80+ backend engineers in 6 months for a payments platform launch.",
    solution: "Train-to-Hire cohort of 120 fresh graduates upskilled in Java, Kafka, and payments domain.",
    metrics: [
      { label: "Time-to-hire", value: "−58%" },
      { label: "Hires delivered", value: "84" },
      { label: "1-year retention", value: "96%" },
    ],
  },
  {
    name: "MediCare",
    industry: "Healthcare",
    color: "#EF4444",
    challenge: "Scaling clinical operations across 14 new hospitals in tier-2 cities.",
    solution: "End-to-End Workforce program covering sourcing, screening, credentialing, and onboarding.",
    metrics: [
      { label: "Roles filled", value: "320+" },
      { label: "Cost per hire", value: "−42%" },
      { label: "Credentialing time", value: "−35%" },
    ],
  },
  {
    name: "RetailMax",
    industry: "Retail",
    color: "#F97316",
    challenge: "Seasonal demand spike requiring 1,500+ frontline staff across 200 stores.",
    solution: "Flexible Deployment + Staffing — on-demand talent pool activated in 7 days.",
    metrics: [
      { label: "Time to deploy", value: "7 days" },
      { label: "Stores covered", value: "200" },
      { label: "Attrition vs market", value: "−28%" },
    ],
  },
];

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "JOBSONN's train-to-hire cohort delivered 84 production-ready engineers in 5 months — exactly the domain depth we needed for our payments platform launch.",
    name: "Rajesh Kumar",
    role: "VP Engineering",
    company: "FinEdge",
    initials: "RK",
  },
  {
    quote: "The AI-powered assessments saved our hiring managers 12+ hours per role. Shortlists came pre-scored with clear reasoning, not just ranked resumes.",
    name: "Priya Nair",
    role: "Head of Talent Acquisition",
    company: "MediCare Group",
    initials: "PN",
  },
  {
    quote: "Their flexible staffing model scaled our seasonal workforce from 200 to 1,700 in 7 days without a single compliance gap. A genuine operating partner.",
    name: "Amitabh Sengupta",
    role: "Chief People Officer",
    company: "RetailMax",
    initials: "AS",
  },
];

const TECH_STACK = [
  "Python", "Java", "JavaScript", "TypeScript", "React", "Node.js", "SQL",
  "Kafka", "AWS", "Kubernetes", "Tableau", "Power BI", "Salesforce",
  "SAP", "DevOps", "Generative AI", "Power Platform", "PyTorch",
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How quickly can JOBSONN start delivering candidates?",
    a: "Most engagements begin delivering shortlists within 5–7 business days of contract signing. For Train-to-Hire cohorts, the first batch is typically deployment-ready in 12–16 weeks depending on the technical depth required.",
  },
  {
    q: "What is the difference between Train to Hire and Hire to Train?",
    a: "Train to Hire means we recruit fresh candidates, upskill them through an industry-aligned program, and then deploy them to your team. Hire to Train means you hire candidates directly (or we source them), and we then train them to your specific stack and standards after they join.",
  },
  {
    q: "Do you offer replacement guarantees?",
    a: "Yes. Every engagement includes a 90-day replacement guarantee on permanent hires. For contract and flexible deployment roles, replacements are typically delivered within 5 business days at no additional sourcing fee.",
  },
  {
    q: "Can you handle bulk hiring for high-volume roles?",
    a: "Absolutely. We have executed single-mandate campaigns of 1,500+ frontline roles in 7 days and 320+ clinical roles across 14 cities. Our talent pool of 2M+ verified candidates and partner network of 80+ regional recruiters allows us to scale elastically.",
  },
  {
    q: "How does AI matching work, and is it transparent?",
    a: "Our AI scoring evaluates skills match, experience relevance, geographic fit, salary alignment, and cultural signals from candidate consent data. Every score includes a plain-English explanation of why a candidate ranked where they did — no black boxes, no opaque filtering.",
  },
  {
    q: "What pricing models do you support?",
    a: "We support contingent (success-fee), retained search, hourly/monthly contract billing, milestone-based training fees, and Pay After Placement for select talent programs. Mix-and-match across roles is supported within a single master agreement.",
  },
];

export function PublicTalentSolutions() {
  const { navigate } = useNav();

  return (
    <div className="bg-background">
      {/* ===================== HERO — split-screen with value-prop panel ===================== */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-brand/5 to-background">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            {/* LEFT: headline + CTAs */}
            <div>
              {/* Badge pills */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge className="gap-1 bg-brand/10 text-brand hover:bg-brand/15">
                  <GraduationCap className="h-3 w-3" /> Hire Talent
                </Badge>
                <Badge variant="outline" className="gap-1 text-muted-foreground">
                  <Target className="h-3 w-3" /> Talent Sourcing
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                The right candidate already exists —{" "}
                <span className="text-brand">our AI finds them in 48 hours</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                AI-powered sourcing across a 2M+ verified candidate pool surfaces your next
                hire in days, not months — direct-hire recruitment with shortlists in 48 hours
                and pay-after-join pricing.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => toast.success("Role brief received", { description: "Our talent team will send shortlists within 48 hours." })}
                  className="gap-1.5"
                >
                  Send a role brief <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById("solutions");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="gap-1.5"
                >
                  Explore staffing options
                </Button>
              </div>
            </div>

            {/* RIGHT: "Why this wins" value-prop panel */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Why this wins
              </span>
              <div className="space-y-5">
                {/* Value prop 1 */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Semantics, not keywords</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Our engine reads demonstrated skills and trajectory — so a great engineer
                      at a no-name startup outranks a mediocre one at a logo.
                    </p>
                  </div>
                </div>
                {/* Value prop 2 */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Passive talent, actually reached</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      The best candidates aren&apos;t applying. Our outreach sequence reaches
                      them — with a 91% reply rate.
                    </p>
                  </div>
                </div>
                {/* Value prop 3 */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Verified before you meet</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Employment, skills and credentials are checked up front. No surprises
                      after the offer.
                    </p>
                  </div>
                </div>
              </div>
              {/* Trust line */}
              <div className="mt-5 flex items-start gap-2 border-t pt-4 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                <span>
                  Backed by written SLAs, replacement guarantees and weekly performance
                  reporting — scoped to your goals on a free discovery call.
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM STATS BAR */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand sm:text-4xl">48h</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">
                To first shortlist
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand sm:text-4xl">2M+</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">
                Verified candidates
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand sm:text-4xl">31 days</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">
                Median time-to-offer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main solution cards */}
      <section id="solutions" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Six solutions, one platform</h2>
          <p className="mt-2 text-sm text-muted-foreground">Choose the engagement model that fits your hiring plan — or combine them.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MAIN_SOLUTIONS.map((s) => (
            <Card
              key={s.title}
              className="group relative h-full cursor-pointer overflow-hidden p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderTopColor: s.color, borderTopWidth: 4 }}
              onClick={() => navigate("public", s.route)}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${s.color}1A`, color: s.color }}
                >
                  <s.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" style={{ color: s.color, borderColor: `${s.color}40` }}>
                  {s.badge}
                </Badge>
              </div>
              <h3 className="mt-4 text-lg font-semibold group-hover:text-brand">{s.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium" style={{ color: s.color }}>
                Learn More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits grid */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why teams choose JOBSONN</h2>
            <p className="mt-2 text-sm text-muted-foreground">Six concrete advantages over traditional staffing vendors.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <Card key={b.title} className="h-full p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our 8-step engagement process</h2>
          <p className="mt-2 text-sm text-muted-foreground">From discovery to retention tracking — every step is transparent and measurable.</p>
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
      </section>

      {/* Industries served */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Industries we serve</h2>
            <p className="mt-2 text-sm text-muted-foreground">Specialized talent pools and domain-trained recruiters across 8 verticals.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {INDUSTRIES.map((ind) => (
              <Card key={ind.name} className="p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div
                  className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${ind.color}1A`, color: ind.color }}
                >
                  <ind.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold">{ind.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{ind.hires}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success metrics */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Proven at scale</h2>
          <p className="mt-2 text-sm text-muted-foreground">Numbers from the last 12 months across all talent engagements.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Hires delivered" value="9,400+" icon={<Users className="h-5 w-5" />} tone="brand" />
          <StatCard label="Avg time-to-hire" value="18 days" icon={<Clock className="h-5 w-5" />} tone="brand" />
          <StatCard label="Cost-per-hire reduction" value="46%" icon={<Wallet className="h-5 w-5" />} tone="brand" />
          <StatCard label="90-day retention" value="98%" icon={<ShieldCheck className="h-5 w-5" />} tone="brand" />
        </div>
      </section>

      {/* Case studies */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Case studies</h2>
            <p className="mt-2 text-sm text-muted-foreground">Real engagements, real outcomes — across industries and engagement models.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {CASE_STUDIES.map((c) => (
              <Card key={c.name} className="flex h-full flex-col p-6" style={{ borderTopColor: c.color, borderTopWidth: 4 }}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <Badge variant="outline" style={{ color: c.color, borderColor: `${c.color}40` }}>
                    {c.industry}
                  </Badge>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Challenge</div>
                    <p className="mt-1 text-foreground">{c.challenge}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Solution</div>
                    <p className="mt-1 text-foreground">{c.solution}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 border-t pt-4">
                  {c.metrics.map((m) => (
                    <div key={m.label} className="text-center">
                      <div className="text-base font-bold text-brand">{m.value}</div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack chips */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tech stack we hire for</h2>
          <p className="mt-2 text-sm text-muted-foreground">Specialized talent pools across modern engineering, data, and enterprise platforms.</p>
        </div>
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
          {TECH_STACK.map((tech) => (
            <Badge key={tech} variant="outline" className="bg-card px-3 py-1 text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What our clients say</h2>
            <p className="mt-2 text-sm text-muted-foreground">Hiring leaders across India on partnering with JOBSONN.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="flex h-full flex-col p-6">
                <Quote className="h-7 w-7 text-brand/40" />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t pt-4">
                  <AvatarLogo text={t.initials} size="md" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}, {t.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">Common questions about working with JOBSONN&apos;s talent team.</p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-lg border bg-card px-4">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to scale your team?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Tell us your hiring plan and we&apos;ll propose the right mix of train-to-hire, staffing, and assessment — typically within 1 business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => toast.success("Requirements captured", { description: "Our talent team will reach out within 1 business day." })} className="gap-1.5">
                <Briefcase className="h-4 w-4" /> Post Requirements
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
                <Headset className="h-4 w-4" /> Talk to Sales
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
