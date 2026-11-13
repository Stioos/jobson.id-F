"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight, GraduationCap, CheckCircle2, Download,
  Briefcase, Wallet, Quote, TrendingUp, Award,
  ArrowLeft, Layers, Sparkles, Rocket,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPublicProgram, getRolesForProgram,
  getProgramTrackByRoleView, roleRouteKey,
} from "./_programData";
import { type ProgramPhase } from "@/data/programTracksData";

// Career outcomes (LPA ranges) per program — realistic Indian market bands.
const CAREER_OUTCOMES: Record<string, { role: string; min: number; max: number }[]> = {
  "fde-forward-deployment": [
    { role: "Forward Deployed Full-Stack Engineer", min: 8, max: 18 },
    { role: "AI/ML Engineer", min: 10, max: 22 },
    { role: "Data Engineer", min: 9, max: 20 },
    { role: "Cloud Engineer", min: 9, max: 19 },
    { role: "ML Engineer", min: 12, max: 24 },
    { role: "Security Engineer", min: 10, max: 21 },
  ],
  "fde-program": [
    { role: "Full Stack Software Engineer", min: 6, max: 15 },
    { role: "AI Engineer", min: 7, max: 17 },
    { role: "Product Engineer", min: 7, max: 16 },
    { role: "SaaS Engineer", min: 7, max: 16 },
    { role: "Cloud Engineer", min: 7, max: 17 },
    { role: "Enterprise Engineer", min: 8, max: 18 },
  ],
  "dsai-program": [
    { role: "Digital Sales & AI Marketing Specialist", min: 5, max: 13 },
    { role: "AI Marketing Automation & Growth Specialist", min: 6, max: 14 },
    { role: "Marketing Solutions & Automation Engineer", min: 7, max: 15 },
    { role: "AI Sales, Marketing & Agents Engineer", min: 8, max: 16 },
    { role: "AI Revenue & Growth Engineer", min: 8, max: 17 },
    { role: "AI Customer Solutions & Automation Engineer", min: 7, max: 15 },
  ],
  "cdm-program": [
    { role: "Cloud Infrastructure Engineer", min: 8, max: 20 },
    { role: "DevOps Engineer", min: 7, max: 18 },
    { role: "MLOps Engineer", min: 10, max: 22 },
    { role: "Site Reliability Engineer (SRE)", min: 9, max: 21 },
    { role: "Kubernetes & Container Engineer", min: 9, max: 20 },
    { role: "Platform & CI/CD Engineer", min: 10, max: 22 },
  ],
  "gaa-program": [
    { role: "LLM Application Engineer", min: 8, max: 22 },
    { role: "AI Agents Engineer", min: 10, max: 25 },
    { role: "Generative AI Engineer", min: 8, max: 20 },
    { role: "AI Automation Engineer", min: 7, max: 18 },
    { role: "Conversational AI Engineer", min: 8, max: 19 },
    { role: "AI Product Engineer", min: 10, max: 24 },
  ],
};

const TESTIMONIALS: Record<string, { name: string; role: string; company: string; initials: string; quote: string; ctc: string }[]> = {
  "fde-forward-deployment": [
    {
      name: "Aarav Kulkarni", role: "Forward Deployed Engineer", company: "Razorpay",
      initials: "AK", ctc: "₹16 LPA",
      quote: "I went from a Tier-3 college with no internships to shipping code that 50M Indians use. The live client projects from week 4 made all the difference — by the time I interviewed, I had real production war stories.",
    },
    {
      name: "Sneha Pillai", role: "AI Engineer", company: "Postman",
      initials: "SP", ctc: "₹18 LPA",
      quote: "The FDE-FWD program is brutal in the best way. By phase 3 you're deploying LLM-powered features to production. I had three offers before I graduated.",
    },
    {
      name: "Rohit Banerjee", role: "Platform Engineer", company: "Zerodha",
      initials: "RB", ctc: "₹17 LPA",
      quote: "What sets jobson.id apart is the deployment mindset. I wasn't just writing code — I was running it, monitoring it, fixing it at 2 AM. That's what hiring managers want.",
    },
  ],
  "fde-program": [
    {
      name: "Pooja Reddy", role: "Full Stack Engineer", company: "Swiggy",
      initials: "PR", ctc: "₹12 LPA",
      quote: "I came from a non-CS background. Twelve weeks in, I was building production SaaS features with React + Node + Postgres. The mentorship was the secret sauce.",
    },
    {
      name: "Vikram Singh", role: "AI Engineer", company: "Freshworks",
      initials: "VS", ctc: "₹14 LPA",
      quote: "The AI specialization track was incredible — I built and shipped a RAG-powered support bot for a real startup. That project became my interview showpiece.",
    },
    {
      name: "Anjali Sharma", role: "Product Engineer", company: "PhonePe",
      initials: "AS", ctc: "₹13 LPA",
      quote: "The product-thinking modules changed how I approach engineering. I'm not just a coder anymore — I own features end-to-end and talk to users.",
    },
  ],
  "dsai-program": [
    {
      name: "Karthik Iyer", role: "AI Marketing Engineer", company: "Zoho",
      initials: "KI", ctc: "₹11 LPA",
      quote: "I was a sales guy who couldn't code. Twenty weeks later I'm building AI agents that book meetings autonomously. My salary tripled.",
    },
    {
      name: "Divya Nair", role: "Growth Specialist", company: "CRED",
      initials: "DN", ctc: "₹12 LPA",
      quote: "The DSAI program taught me to think in funnels, cohorts, and experiments. I run growth at a fintech now and the AI tooling I learned here saves me 15 hours a week.",
    },
    {
      name: "Imran Khan", role: "AI Revenue Engineer", company: "Groww",
      initials: "IK", ctc: "₹13 LPA",
      quote: "The revenue engineering track is genuinely unique. I'm building ML models that predict churn and recommend interventions. CFO-level impact, SWE-level pay.",
    },
  ],
  "cdm-program": [
    {
      name: "Arjun Reddy", role: "DevOps Engineer", company: "Razorpay",
      initials: "AR", ctc: "₹16 LPA",
      quote: "I was stuck in a support role for 3 years. The CDM program gave me the exact skills — Terraform, Kubernetes, CI/CD — that every product company was hiring for. I had 4 offers before graduation.",
    },
    {
      name: "Priya Nair", role: "MLOps Engineer", company: "Postman",
      initials: "PN", ctc: "₹20 LPA",
      quote: "The MLOps track is gold. I went from notebooks to deploying models on Kubernetes with full monitoring and drift detection. My capstone project became my interview showpiece.",
    },
    {
      name: "Siddharth Verma", role: "Site Reliability Engineer", company: "Zerodha",
      initials: "SV", ctc: "₹18 LPA",
      quote: "The SRE specialization taught me to think in SLOs, error budgets and postmortems. I now run on-call for a system that processes millions of trades. The chaos engineering labs were terrifying — and exactly what I needed.",
    },
  ],
  "gaa-program": [
    {
      name: "Ananya Gupta", role: "AI Agents Engineer", company: "Razorpay",
      initials: "AG", ctc: "₹22 LPA",
      quote: "The GAA program is the future. I went from zero AI knowledge to building multi-agent systems with CrewAI that automate real business workflows. My agent capstone is now in production at Razorpay.",
    },
    {
      name: "Rohan Khanna", role: "LLM Application Engineer", company: "Postman",
      initials: "RK", ctc: "₹20 LPA",
      quote: "The RAG and LangChain modules were incredible. I built a production document-Q&A system that handles 10,000+ queries a day. The fine-tuning track gave me skills that very few engineers in India have.",
    },
    {
      name: "Sneha Reddy", role: "AI Product Engineer", company: "CRED",
      initials: "SR", ctc: "₹24 LPA",
      quote: "The AI Product track taught me to think end-to-end — from AI strategy to full-stack implementation. I shipped an AI-first product as my capstone that CRED is now piloting. The highest-paying role in my cohort.",
    },
  ],
};

const PROGRAM_FAQS: Record<string, { q: string; a: string }[]> = {
  "fde-forward-deployment": [
    { q: "What makes FDE-FWD different from a regular bootcamp?", a: "FDE-FWD is built around forward deployment — you ship to real customers from week 4, not toy assignments. You'll work on live client projects across web, mobile, cloud, AI and MLOps simultaneously, graduating with the deployment instincts that hiring managers at top product companies screen for." },
    { q: "Do I need a CS degree to apply?", a: "No. About 40% of our cohort is non-CS or self-taught. We require basic programming comfort (any language) and strong problem-solving. The admissions diagnostic will tell you if you're ready, and we offer a free 2-week prep sprint if you need to brush up." },
    { q: "What does the paid internship look like?", a: "From week 12 onwards, you'll spend 15–20 hours/week on a paid engagement with one of our hiring partners. Stipends range from ₹15,000 to ₹35,000 per month. Many learners convert these into full-time offers before graduation." },
    { q: "What happens if I don't get placed?", a: "Under Pay After Placement, you don't pay the bulk of your fee until you accept an offer above the agreed CTC threshold. You also get 6 months of post-graduation placement support, including 1:1 coaching, mock interviews, and direct intros to 220+ hiring partners." },
  ],
  "fde-program": [
    { q: "Is this program beginner-friendly?", a: "Yes. The first 4 weeks cover JavaScript fundamentals, HTML/CSS, and dev environment setup. We assume zero prior experience — but you should be ready for an intensive 24-week commitment of 30–40 hours/week." },
    { q: "Which specialization should I pick?", a: "Most learners pick their specialization at the end of Phase 1 (week 6). Your mentor will help you choose based on your aptitude, interests, and market demand. Software Engineer and AI Engineer tracks are most popular; SaaS and Enterprise tracks have the highest placement rates." },
    { q: "What's the difference between FDE and FDE-FWD?", a: "FDE is a focused fullstack program (web only, 24 weeks). FDE-FWD adds forward deployment (cloud, mobile, AI, MLOps, client projects) and a paid internship. FDE-FWD is harder to get into and commands a higher starting salary; FDE is the right choice if you want a faster, more focused path into fullstack engineering." },
    { q: "What tools and languages will I learn?", a: "JavaScript/TypeScript, React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Redis, Docker, AWS, Git, plus specialization-specific tools (Stripe for SaaS, LangChain for AI, Terraform for Cloud, Kafka for Enterprise)." },
  ],
  "dsai-program": [
    { q: "Do I need a marketing or sales background?", a: "No. About half our cohort comes from engineering backgrounds wanting to pivot into growth/revenue roles, and half comes from sales/marketing wanting to add AI and technical depth. The first 3 weeks bring everyone to a common baseline in Python, SQL, and modern marketing fundamentals." },
    { q: "Will I actually build AI agents?", a: "Yes — that's the centerpiece of the program. From Phase 2 onwards you'll build production AI agents using LangChain, OpenAI APIs, vector databases, and orchestration frameworks. By the capstone, you'll deploy a multi-agent system that automates a real sales or marketing workflow end-to-end." },
    { q: "What roles can I get after DSAI?", a: "Six specialization tracks lead to roles like Digital Sales Specialist, AI Marketing Automation Engineer, AI Revenue & Growth Engineer, and AI Customer Solutions Engineer. Starting salaries range from ₹5–14 LPA, with 2-year growth to ₹18–25 LPA at top product companies." },
    { q: "Is this program good for non-technical founders?", a: "Absolutely. About 15% of our cohort are early-stage founders or solopreneurs. The AI tooling and growth frameworks you learn here can 10x your output as a one-person team. Several alumni have used the program to launch AI-first startups." },
  ],
  "cdm-program": [
    { q: "Do I need prior cloud experience?", a: "No. Phase 1 (weeks 1–5) starts from Linux, networking and cloud fundamentals. You should be comfortable with basic programming (any language) and have a willingness to learn command-line tools. About 30% of our cohort comes from non-DevOps backgrounds — sysadmins, QA engineers, even backend devs who want to own deployment too." },
    { q: "Which cloud should I focus on — AWS, Azure or GCP?", a: "The program covers all three in Phase 1, then you specialize based on your career goals and market demand. AWS has the largest market share in India; Azure dominates enterprise; GCP leads in ML/data. Your mentor will help you pick. Most learners achieve at least one cloud certification by graduation." },
    { q: "Is MLOps a separate track from DevOps?", a: "Yes — MLOps is a distinct specialization that builds on DevOps foundations. You'll learn model versioning (MLflow), deployment (BentoML, Seldon), pipelines (Kubeflow, Airflow) and drift detection (Evidently). It's the highest-paying track in the program because it bridges data science and engineering — a rare combination." },
    { q: "What certifications will I be ready for?", a: "By graduation you'll be ready for: AWS Solutions Architect Associate, Certified Kubernetes Administrator (CKA), Terraform Associate, and (for MLOps track) Kubeflow/MLflow practitioner certs. Certification prep is built into the curriculum — we don't just teach the tools, we teach to the exam blueprint." },
  ],
  "gaa-program": [
    { q: "Do I need prior AI or ML experience?", a: "No. Phase 1 (weeks 1–4) starts from Python and AI fundamentals. You should be comfortable with basic programming (any language) and have a willingness to learn. About 40% of our cohort comes from non-AI backgrounds — web devs, data analysts, even product managers who want to build AI products." },
    { q: "Which specialization should I pick?", a: "Most learners pick their specialization at the end of Phase 1 (week 4). LLM Application Engineer and AI Agents Engineer are the most popular and highest-paying tracks. AI Product Engineer is ideal if you want to build full-stack AI products. Your mentor will help you choose based on your background and goals." },
    { q: "Will I use the latest models (GPT-4, Claude, etc.)?", a: "Yes. You'll work with OpenAI GPT-4, Claude, open-source LLMs (Llama, Mistral), DALL-E, Stable Diffusion, and the latest agentic frameworks (CrewAI, AutoGen, LangGraph). We update our curriculum every cohort to keep pace with the rapidly evolving AI landscape." },
    { q: "What makes this program different from other AI courses?", a: "Three things: (1) We focus on PRODUCTION AI — not notebooks or demos. You'll deploy real AI systems with monitoring, guardrails and evaluation. (2) The agentic automation track is unique — you'll build autonomous AI agents that do real work. (3) Pay After Placement means you only pay the bulk of your fee after you get hired." },
  ],
};

// Comparison: jobson.id program vs traditional degree
const COMPARISON_ROWS = [
  { feature: "Duration", jobsonId: "20–24 weeks", traditional: "3–4 years" },
  { feature: "Cost", jobsonId: "Pay after placement", traditional: "₹4–15 L upfront" },
  { feature: "Curriculum freshness", jobsonId: "Updated every cohort", traditional: "Updated every 3–5 years" },
  { feature: "Live projects", jobsonId: "12+ real client projects", traditional: "1 capstone (often toy)" },
  { feature: "Mentorship", jobsonId: "1:1 industry mentors", traditional: "Professor office hours" },
  { feature: "Placement support", jobsonId: "220+ partners, 6-mo PAP", traditional: "Campus placement cell" },
  { feature: "Starting salary", jobsonId: "₹5–18 LPA", traditional: "₹3–8 LPA" },
];

// Pick the curriculum from the first role track of the program (each track has 4 phases).
function getCurriculumForProgram(programId: string): ProgramPhase[] {
  const prog = getPublicProgram(programId);
  if (!prog) return [];
  const firstRole = getRolesForProgram(programId)[0];
  if (!firstRole) return [];
  const track = getProgramTrackByRoleView(firstRole.roleView);
  return track?.curriculum ?? [];
}

// Aggregate tech stack across all 6 specialization tracks of the program.
function getTechStackForProgram(programId: string): string[] {
  const roles = getRolesForProgram(programId);
  const stack = new Set<string>();
  for (const r of roles) {
    const track = getProgramTrackByRoleView(r.roleView);
    if (track) {
      for (const t of track.techStack) stack.add(t);
    }
  }
  return Array.from(stack).sort();
}

export function PublicProgramDetail({ programId }: { programId: string }) {
  const { navigate } = useNav();

  const program = getPublicProgram(programId);

  if (!program) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" />}
          title="Program not found"
          description="The program you're looking for doesn't exist or has moved."
          action={
            <Button onClick={() => navigate("public", "programs")} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> All programs
            </Button>
          }
        />
      </div>
    );
  }

  const Icon = program.icon;
  const roles = getRolesForProgram(program.id);
  const curriculum = getCurriculumForProgram(program.id);
  const techStack = getTechStackForProgram(program.id);
  const outcomes = CAREER_OUTCOMES[program.id] ?? [];
  const testimonials = TESTIMONIALS[program.id] ?? [];
  const faqs = PROGRAM_FAQS[program.id] ?? [];
  const accent = program.color;

  return (
    <div className="bg-background">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <button
            onClick={() => navigate("public", "programs")}
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All programs
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="secondary"
                  className="border text-xs font-semibold"
                  style={{ color: accent, borderColor: accent, backgroundColor: `${accent}14` }}
                >
                  {program.tag}
                </Badge>
                <Badge variant="outline" className="gap-1 border-brand text-brand">
                  <Wallet className="h-3 w-3" /> Pay After Placement
                </Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {program.label}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                {program.desc}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => toast.success("Application started!", {
                  description: "A counselor will reach out within 24 hours to complete your application.",
                })} className="gap-1.5">
                  <Rocket className="h-4 w-4" /> Apply Now
                </Button>
                <Button size="lg" variant="outline" onClick={() => toast("Curriculum PDF is being prepared.", {
                  description: "We'll email it to you within 5 minutes.",
                })} className="gap-1.5">
                  <Download className="h-4 w-4" /> Download Curriculum
                </Button>
              </div>
            </div>

            {/* Hero side card */}
            <Card className="p-6" style={{ borderColor: accent + "55" }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Program code</p>
                  <p className="text-sm font-semibold">{program.tag}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold">{program.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="text-sm font-semibold">{program.mode}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-sm font-semibold">{program.level}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Format</p>
                  <p className="text-sm font-semibold">{program.format}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Starting salary</p>
                  <p className="text-base font-bold text-brand">{program.startingSalary}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hiring partners</p>
                  <p className="text-base font-bold text-brand">{program.hiringPartners}+</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ===================== HIGHLIGHTS GRID ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why this program</h2>
          <p className="mt-2 text-sm text-muted-foreground">Six reasons {program.tag} graduates land jobs faster and at higher CTIs.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {program.highlights.map((h, i) => (
            <Card key={i} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight">Highlight {i + 1}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{h}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== CURRICULUM PHASES ===================== */}
      {curriculum.length > 0 && (
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Curriculum</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {curriculum.length} phases across {program.duration}. Based on the {getRolesForProgram(program.id)[0]?.label} specialization track — other tracks follow a similar structure.
                </p>
              </div>
              <Badge variant="outline" className="gap-1">
                <Layers className="h-3 w-3" /> {curriculum.length} phases
              </Badge>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {curriculum.map((phase, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                        style={{ backgroundColor: `${accent}1A`, color: accent }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{phase.title}</h3>
                        <p className="text-xs text-muted-foreground">{phase.weeks}</p>
                      </div>
                    </div>
                  </div>
                  <ul className="mt-4 max-h-44 space-y-1.5 overflow-y-auto pr-2 scroll-thin">
                    {phase.topics.map((t, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              <Sparkles className="mr-1 inline h-3 w-3" />
              Curriculum is refreshed every cohort. The above is illustrative — your cohort may differ.
            </p>
          </div>
        </section>
      )}

      {/* ===================== SPECIALIZATION ROLES ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{roles.length} specializations</h2>
          <p className="mt-2 text-sm text-muted-foreground">Pick your specialization at the end of Phase 1. Each leads to a distinct career path.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => {
            const track = getProgramTrackByRoleView(r.roleView);
            return (
              <Card
                key={r.roleView}
                className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                onClick={() => navigate("public", roleRouteKey(r.roleView))}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${r.color}1A`, color: r.color }}
                  >
                    <Award className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border text-[10px]"
                    style={{ color: r.color, borderColor: r.color + "66" }}
                  >
                    {r.badge}
                  </Badge>
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-tight">{r.label}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{r.motive}</p>
                {track && (
                  <p className="mt-3 text-[10px] text-muted-foreground">
                    {track.weeks} weeks · {track.mode}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  View curriculum <ArrowRight className="h-3 w-3" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ===================== TECH STACK ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tech stack you&apos;ll master</h2>
            <p className="mt-2 text-sm text-muted-foreground">Aggregated across all {roles.length} specializations. Tools hiring partners actually use.</p>
          </div>
          <Card className="p-5">
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <Badge key={t} variant="secondary" className="border">
                  {t}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ===================== CAREER OUTCOMES ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Career outcomes</h2>
          <p className="mt-2 text-sm text-muted-foreground">Realistic salary bands for graduates of this program, based on the last 3 cohorts.</p>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {outcomes.map((o, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${accent}1A`, color: accent }}
                  >
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{o.role}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand">₹{o.min}–{o.max} LPA</p>
                  <p className="text-[10px] text-muted-foreground">starting CTC</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-3 text-xs text-muted-foreground">
          <TrendingUp className="mr-1 inline h-3 w-3" />
          Top 10% of graduates earn 30–60% above the upper band. Based on 1,200+ offers across 2023–24 cohorts.
        </p>
      </section>

      {/* ===================== COMPARISON TABLE ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{program.tag} vs traditional degrees</h2>
            <p className="mt-2 text-sm text-muted-foreground">How we stack up against a 3–4 year CS or MBA program.</p>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="grid grid-cols-3 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <div className="p-3">Feature</div>
              <div className="p-3 text-brand">jobson.id {program.tag}</div>
              <div className="p-3">Traditional degree</div>
            </div>
            <div className="divide-y">
              {COMPARISON_ROWS.map((row) => (
                <div key={row.feature} className="grid grid-cols-3 text-sm">
                  <div className="p-3 font-medium">{row.feature}</div>
                  <div className="p-3 text-brand">{row.jobsonId}</div>
                  <div className="p-3 text-muted-foreground">{row.traditional}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Graduate stories</h2>
          <p className="mt-2 text-sm text-muted-foreground">From applications to offers — in their words.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex h-full flex-col p-6">
              <Quote className="h-6 w-6 text-brand/40" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3 border-t pt-4">
                <AvatarLogo text={t.initials} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.role} · {t.company}</p>
                </div>
                <Badge variant="secondary" className="ml-auto border border-brand/40 text-brand">{t.ctc}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          </div>
          <Card className="p-2">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
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
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Apply to {program.label}</h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Next cohort starts in 6 weeks. Seats are limited to 30 learners. Talk to a counselor or start your application today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => toast.success("Application started!", {
                description: "A counselor will reach out within 24 hours.",
              })} className="gap-1.5">
                <Rocket className="h-4 w-4" /> Apply Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "pay-after-placement")} className="gap-1.5">
                <Wallet className="h-4 w-4" /> Pay After Placement
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
