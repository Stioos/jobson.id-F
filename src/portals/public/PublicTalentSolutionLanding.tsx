"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  GraduationCap,
  UserCheck,
  Award,
  ClipboardCheck,
  Layers,
  Globe,
  Users,
  TrendingUp,
  Sparkles,
  Target,
  FileText,
  Clock,
  BarChart3,
  Calendar,
  BookOpen,
  Wallet,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Quote,
  Zap,
  Building2,
  FileCheck2,
  PhoneCall,
  BrainCircuit,
  Sliders,
  Send,
  Timer,
  Check,
  BadgeCheck,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  TALENT_SOLUTIONS_CONFIG,
  ALL_TALENT_SOLUTIONS_SIDEBAR,
  getTalentSolution,
} from "@/data/talentSolutionsConfig";
import { getFullTalentSolution } from "@/data/talentSolutionsFullData";

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  GraduationCap,
  UserCheck,
  Award,
  ClipboardCheck,
  Layers,
  Globe,
  Users,
  TrendingUp,
  Sparkles,
  Target,
  FileText,
  Clock,
  BarChart3,
  Calendar,
  BookOpen,
  Wallet,
  Briefcase,
  ShieldCheck,
  Zap,
  Building2,
  FileCheck2,
};

// ============================================================
// POPULAR TECH STACKS & ROLES FOR SCOPING WIZARDS
// ============================================================
const POPULAR_STACKS = [
  "React & Next.js",
  "Node.js & Express",
  "Python & FastAPI",
  "AWS Cloud & Terraform",
  "Docker & Kubernetes",
  "PostgreSQL & Prisma",
  "TypeScript & GraphQL",
  "Java & Spring Boot",
  "Golang & Microservices",
  "AI / Machine Learning & PyTorch",
];

const ROLES_LIST = [
  "Full-Stack Software Engineer",
  "Frontend (React / Next.js) Engineer",
  "Backend (Node / Python / Go) Engineer",
  "Cloud & DevOps Engineer",
  "Data Engineer & Analytics",
  "AI / Machine Learning Engineer",
  "QA & Test Automation Specialist",
  "Cybersecurity Analyst",
];

export function PublicTalentSolutionLanding({
  solutionKey,
}: {
  solutionKey: string;
}) {
  const { navigate, setLoginDrawerOpen } = useNav();
  const solution = getTalentSolution(solutionKey);
  const fullData = getFullTalentSolution(solutionKey);

  // Interactive Modal Dialog States
  const [scopeCohortOpen, setScopeCohortOpen] = React.useState(false);
  const [talkToExpertOpen, setTalkToExpertOpen] = React.useState(false);
  const [takeAssessmentOpen, setTakeAssessmentOpen] = React.useState(false);
  const [submitRequirementOpen, setSubmitRequirementOpen] = React.useState(false);
  const [applyCohortOpen, setApplyCohortOpen] = React.useState(false);
  const [requestShortlistOpen, setRequestShortlistOpen] = React.useState(false);

  // Scope Cohort Form State
  const [cohortRole, setCohortRole] = React.useState(ROLES_LIST[0]);
  const [cohortSize, setCohortSize] = React.useState("10");
  const [cohortDuration, setCohortDuration] = React.useState("12 Weeks");
  const [selectedStacks, setSelectedStacks] = React.useState<string[]>([
    "React & Next.js",
    "Node.js & Express",
    "PostgreSQL & Prisma",
  ]);
  const [cohortCompany, setCohortCompany] = React.useState("");
  const [cohortEmail, setCohortEmail] = React.useState("");
  const [cohortPhone, setCohortPhone] = React.useState("");

  // Talk to Expert Form State
  const [expertDate, setExpertDate] = React.useState("2026-11-10");
  const [expertTime, setExpertTime] = React.useState("10:00 AM");
  const [expertTopic, setExpertTopic] = React.useState("Curriculum & Tech Scoping");
  const [expertName, setExpertName] = React.useState("");
  const [expertEmail, setExpertEmail] = React.useState("");
  const [expertCompany, setExpertCompany] = React.useState("");

  // Submit Requirement Form State
  const [reqJobTitle, setReqJobTitle] = React.useState("");
  const [reqSeniority, setReqSeniority] = React.useState("Mid-Level (3-5 yrs)");
  const [reqModel, setReqModel] = React.useState("Contract Staffing");
  const [reqCount, setReqCount] = React.useState("2");
  const [reqTimeline, setReqTimeline] = React.useState("Immediate (< 48 hrs)");
  const [reqEmail, setReqEmail] = React.useState("");
  const [reqCompany, setReqCompany] = React.useState("");

  // Apply Cohort Form State
  const [candidateName, setCandidateName] = React.useState("");
  const [candidateEmail, setCandidateEmail] = React.useState("");
  const [candidatePhone, setCandidatePhone] = React.useState("");
  const [candidateCollege, setCandidateCollege] = React.useState("");
  const [candidateGradYear, setCandidateGradYear] = React.useState("2026");
  const [candidateGithub, setCandidateGithub] = React.useState("");

  // Assessment Simulator State
  const [assessmentStep, setAssessmentStep] = React.useState<"intro" | "test" | "result">("intro");
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [assessmentScore, setAssessmentScore] = React.useState(94);

  // Shortlist Form State
  const [shortlistRole, setShortlistRole] = React.useState("");
  const [shortlistCtc, setShortlistCtc] = React.useState("₹15-25 LPA");
  const [shortlistModel, setShortlistModel] = React.useState("Hybrid");
  const [shortlistEmail, setShortlistEmail] = React.useState("");

  if (!solution) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Solution not found</h1>
        <Button
          className="mt-4"
          onClick={() => navigate("public", "talent-solutions")}
        >
          Back to Hire Talent
        </Button>
      </div>
    );
  }

  const SolutionIcon = ICON_MAP[solution.icon] || Target;
  const color = solution.color || "#0EA5E9";

  const headline = fullData?.heroHeadline || `${solution.label} — built for your enterprise`;
  const subheadline = fullData?.heroSubheadline || solution.desc;
  const stats = fullData?.heroStats || [
    { label: "Sub-pages", value: "8", desc: "Capability tracks" },
    { label: "Time to deploy", value: "2-4 wks", desc: "Fast ramp velocity" },
    { label: "Replacement SLA", value: "90 days", desc: "Written guarantee" },
    { label: "Retention rate", value: "96%", desc: "12-month average" },
  ];
  const whyItWins = fullData?.whyItWins || [];
  const bothSides = fullData?.bothSides;
  const processSteps = fullData?.processSteps || [];
  const benefits = fullData?.benefits || [];
  const useCases = fullData?.useCases || [];
  const testimonials = fullData?.testimonials || [];
  const deliverables = fullData?.deliverables || [];
  const faqs = fullData?.faqs || [];

  // Determine primary and secondary CTA actions depending on solution
  const isTrainToHire = solution.solutionKey.includes("train-to-hire");
  const isHireToTrain = solution.solutionKey.includes("hire-to-train");
  const isCorpTraining = solution.solutionKey.includes("corporate-training");
  const isAssessment = solution.solutionKey.includes("assessment");
  const isStaffing = solution.solutionKey.includes("staffing");
  const isSourcing = solution.solutionKey.includes("sourcing") || solution.solutionKey.includes("recruitment");
  const isDeployment = solution.solutionKey.includes("deployment");
  const isWorkforce = solution.solutionKey.includes("workforce");
  const isPlacements = solution.solutionKey === "placements";

  const handlePrimaryAction = () => {
    if (isTrainToHire || isHireToTrain || isCorpTraining) {
      setScopeCohortOpen(true);
    } else if (isAssessment) {
      setTakeAssessmentOpen(true);
    } else if (isStaffing || isDeployment || isSourcing) {
      setSubmitRequirementOpen(true);
    } else if (isPlacements) {
      setRequestShortlistOpen(true);
    } else if (isWorkforce) {
      setTalkToExpertOpen(true);
    } else {
      setScopeCohortOpen(true);
    }
  };

  const primaryLabel = isTrainToHire
    ? "Scope Your Cohort"
    : isHireToTrain
    ? "Build Custom Training"
    : isCorpTraining
    ? "Plan Corporate Program"
    : isAssessment
    ? "Take AI Assessment"
    : isStaffing || isDeployment || isSourcing
    ? "Submit Staffing Requirement"
    : isPlacements
    ? "Request Placement Shortlist"
    : "Explore Solution";

  const toggleStack = (tech: string) => {
    setSelectedStacks((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleScopeCohortSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cohortEmail) {
      toast.error("Please enter your work email");
      return;
    }
    toast.success("Cohort Plan Submitted Successfully!", {
      description: `Cohort of ${cohortSize} for ${cohortRole} received. Ref: COH-2026-${Math.floor(1000 + Math.random() * 9000)}. Our program lead will contact you within 24 hours.`,
    });
    setScopeCohortOpen(false);
  };

  const handleExpertBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertEmail) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Advisory Session Booked!", {
      description: `Confirmed for ${expertDate} at ${expertTime}. A calendar invite has been dispatched to ${expertEmail}.`,
    });
    setTalkToExpertOpen(false);
  };

  const handleRequirementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqEmail) {
      toast.error("Please enter your work email");
      return;
    }
    toast.success("Staffing Requirement Registered!", {
      description: `48-hour shortlist SLA activated for ${reqCount}x ${reqJobTitle || "Engineers"}. Ref: REQ-${Math.floor(1000 + Math.random() * 9000)}.`,
    });
    setSubmitRequirementOpen(false);
  };

  const handleCandidateApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateEmail) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Candidate Application Received!", {
      description: `Welcome ${candidateName || "Candidate"}! Assessment invitation sent to ${candidateEmail}. Ref: APP-${Math.floor(10000 + Math.random() * 90000)}.`,
    });
    setApplyCohortOpen(false);
  };

  const handleShortlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortlistEmail) {
      toast.error("Please enter your work email");
      return;
    }
    toast.success("Placement Shortlist Requested!", {
      description: `We are matching verified profiles for ${shortlistRole || "Technical Roles"} within 48h.`,
    });
    setRequestShortlistOpen(false);
  };

  const assessmentQuestions = [
    {
      q: "In React 19, what is the primary benefit of using the new `useActionState` hook for server actions?",
      code: "const [state, formAction, isPending] = useActionState(updateName, null);",
      options: [
        "It replaces useState and useEffect for client-side local UI state.",
        "It manages pending state and updates optimistic UI during server form submissions.",
        "It caches asynchronous HTTP calls in localStorage automatically.",
        "It forces client-side re-rendering on every DOM mutation.",
      ],
      correct: 1,
    },
    {
      q: "Which database index strategy optimizes high-frequency range queries on `created_at` timestamp with `tenant_id` filtering?",
      code: "SELECT * FROM events WHERE tenant_id = 't_101' AND created_at >= '2026-01-01';",
      options: [
        "Single-column B-tree index on created_at only.",
        "Composite index on (tenant_id, created_at).",
        "Hash index on created_at.",
        "Full-text search index on tenant_id.",
      ],
      correct: 1,
    },
    {
      q: "When configuring Kubernetes Horizontal Pod Autoscaling (HPA) for an API service, what is the safest metric to prevent cascading pod termination?",
      code: "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler",
      options: [
        "Pod memory usage without a terminationGracePeriodSeconds setting.",
        "Custom metrics like HTTP request rate or concurrency with stabilization windows.",
        "Node disk I/O utilization.",
        "Random round-robin scaling.",
      ],
      correct: 1,
    },
    {
      q: "What design pattern guarantees exactly-once processing semantics in distributed event streaming with Apache Kafka / RabbitMQ?",
      code: "await consumer.processWithTransaction(message, dbTransaction);",
      options: [
        "Fire-and-forget message publication.",
        "Transactional Outbox pattern combined with idempotent message consumer keys.",
        "Exponential backoff retry with unlimited attempts.",
        "Client-side polling without server acknowledgment.",
      ],
      correct: 1,
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* ===================== 1. HERO SECTION ===================== */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-brand/5 via-background to-background">
        <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
        <div
          className="pointer-events-none absolute -top-24 right-1/4 h-80 w-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: color }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12 items-center">
            {/* LEFT: headline & CTAs */}
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge
                  className="gap-1.5 px-3 py-1 font-semibold text-xs"
                  style={{
                    backgroundColor: `${color}18`,
                    color: color,
                    borderColor: `${color}35`,
                  }}
                >
                  <SolutionIcon className="h-3.5 w-3.5" /> {solution.label}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {solution.badge}
                </Badge>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                {headline}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {subheadline}
              </p>

              {/* SLA Guarantee pill */}
              <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-border/70 bg-card/60 p-3 text-xs text-muted-foreground shadow-2xs backdrop-blur-xs">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  {fullData?.slaNotice ||
                    "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals."}
                </span>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={handlePrimaryAction}
                  className="gap-2 shadow-md bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                >
                  {primaryLabel} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setTalkToExpertOpen(true)}
                  className="gap-2"
                >
                  <PhoneCall className="h-4 w-4" /> Talk to a Talent Expert
                </Button>
                {isAssessment && (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setSubmitRequirementOpen(true)}
                    className="gap-2"
                  >
                    <Sliders className="h-4 w-4" /> Design Assessment
                  </Button>
                )}
              </div>
            </div>

            {/* RIGHT: Real metric stat cards */}
            <div className="grid grid-cols-2 gap-3.5">
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className="text-2xl font-black sm:text-3xl tracking-tight"
                    style={{ color: color }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-foreground">
                    {s.label}
                  </div>
                  {s.desc && (
                    <div className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                      {s.desc}
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: `${color}40` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 2. SIZING & QUICK OVERVIEW ===================== */}
      <section className="border-b border-border/60 bg-muted/20 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3.5 shadow-2xs">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">
                  Architecture
                </div>
                <div className="text-sm font-bold text-foreground">
                  8 Deep Sub-Pages
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3.5 shadow-2xs">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">
                  Time-to-Deploy
                </div>
                <div className="text-sm font-bold text-foreground">
                  2–4 Weeks SLA
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3.5 shadow-2xs">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">
                  Replacement Cover
                </div>
                <div className="text-sm font-bold text-foreground">
                  90 Days Guaranteed
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3.5 shadow-2xs">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">
                  Client Retention
                </div>
                <div className="text-sm font-bold text-foreground">
                  96% Long-Term
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 3. WHY THIS MODEL WINS ===================== */}
      {whyItWins.length > 0 && (
        <section className="border-b border-border/80 py-12 sm:py-16 bg-card/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-brand">
                Competitive Advantage
              </Badge>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Why the {solution.label} model wins
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Built specifically to solve the inefficiencies, delays, and misalignments of traditional agency recruitment.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {whyItWins.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-brand/40 hover:shadow-md"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm"
                    style={{ backgroundColor: `${color}15`, color: color }}
                  >
                    0{idx + 1}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== 4. DUAL TRACK: FOR EMPLOYERS & CANDIDATES ===================== */}
      {bothSides && (
        <section className="border-b border-border/80 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-brand">
                Both Sides Aligned
              </Badge>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Engineered for hiring partners & talent alike
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                When employer expectations and candidate preparation mirror each other, placement velocity quadruples.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Employers Card */}
              <div className="rounded-2xl border-2 border-brand/20 bg-gradient-to-br from-brand/5 via-card to-card p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <Badge className="bg-brand/10 text-brand border-brand/30 text-xs font-bold uppercase tracking-wider mb-3">
                    {bothSides.employers.tag}
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground">
                    {bothSides.employers.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {bothSides.employers.desc}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {bothSides.employers.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60">
                  <Button
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                    onClick={handlePrimaryAction}
                  >
                    {bothSides.employers.ctaText || "Scope Requirements"} <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>

              {/* Candidates Card */}
              <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    {bothSides.candidates.tag}
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground">
                    {bothSides.candidates.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {bothSides.candidates.desc}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {bothSides.candidates.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    className="w-full hover:border-brand hover:text-brand"
                    onClick={() => {
                      if (isAssessment) setTakeAssessmentOpen(true);
                      else setApplyCohortOpen(true);
                    }}
                  >
                    {bothSides.candidates.ctaText || "Join Talent Pool"} <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================== 5. CORE CAPABILITIES (8 SUB-PAGES) ===================== */}
      <section className="border-b border-border/80 py-12 sm:py-16 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-brand">
                Complete Architecture
              </Badge>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Core capabilities & delivery tracks
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each solution includes 8 deep-dive capability sub-pages with modular implementation specs.
              </p>
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              8 sub-pages · click to explore
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solution.subPages.map((sp, idx) => {
              const SubIcon = ICON_MAP[sp.icon] || Target;
              return (
                <div
                  key={sp.subPageKey}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate("public", `talent/${solution.solutionKey}/${sp.subPageKey}`)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate("public", `talent/${solution.solutionKey}/${sp.subPageKey}`)
                  }
                  className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 text-left shadow-2xs transition-all hover:-translate-y-1 hover:border-brand/60 hover:shadow-md cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${color}15`, color: color }}
                      >
                        <SubIcon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground/70">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-foreground group-hover:text-brand transition-colors">
                      {sp.label}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {sp.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-medium text-brand">
                    <span>Explore Track</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== 6. STEP-BY-STEP PROCESS ROADMAP ===================== */}
      {processSteps.length > 0 && (
        <section className="border-b border-border/80 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-brand">
                Operational Lifecycle
              </Badge>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Execution roadmap & delivery timeline
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Predictable, phase-gated execution engineered for transparent weekly checkpoints and on-time ramp.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl border border-border/80 bg-card p-6 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: `${color}20`, color: color }}
                    >
                      Step {step.step || `0${idx + 1}`}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Checkpoint {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== 7. DELIVERABLES CHECKLIST ===================== */}
      {deliverables.length > 0 && (
        <section className="border-b border-border/80 py-12 sm:py-16 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] items-start">
              <div>
                <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Contractual Output
                </Badge>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Guaranteed deliverables & artifacts
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Every engagement is backed by concrete, written deliverables, weekly telemetry reports, and legal IP assignment.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => setTalkToExpertOpen(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <FileCheck2 className="h-4 w-4 text-brand" /> Request Sample Dossier
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-border/80 bg-card p-3.5 shadow-2xs"
                  >
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 mt-0.5"
                      style={{ color }}
                    />
                    <span className="text-xs font-medium text-foreground leading-normal">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================== 8. ENTERPRISE SCENARIOS & USE CASES ===================== */}
      {useCases.length > 0 && (
        <section className="border-b border-border/80 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-brand">
                Production Case Studies
              </Badge>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Real scenarios, verified results
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                How technology leaders solved critical talent bottlenecks using JOBSONN.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {useCases.map((uc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-xs"
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Scenario 0{idx + 1}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {uc.scenario}
                    </div>
                    <div className="mt-3 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Solution: </strong>
                      {uc.solution}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60 grid grid-cols-3 gap-2">
                    {uc.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="text-center">
                        <div
                          className="text-base font-extrabold"
                          style={{ color }}
                        >
                          {m.value}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== 9. TESTIMONIALS ===================== */}
      {testimonials.length > 0 && (
        <section className="border-b border-border/80 py-12 sm:py-16 bg-muted/15">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-brand">
                Customer Validation
              </Badge>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Trusted by 500+ enterprises & scale-ups
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs relative"
                >
                  <Quote className="h-8 w-8 text-muted-foreground/20 absolute top-6 right-6" />
                  <p className="text-sm sm:text-base italic leading-relaxed text-foreground/90 relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-xs"
                      style={{ backgroundColor: `${color}25`, color: color }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {t.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {t.role} · {t.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== 10. FAQS ACCORDION ===================== */}
      {faqs.length > 0 && (
        <section className="border-b border-border/80 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-brand">
                Got Questions?
              </Badge>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Frequently asked questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="rounded-xl border border-border/80 bg-card px-5 shadow-2xs"
                >
                  <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ===================== 11. BROWSE ALL 9 SOLUTIONS ===================== */}
      <section className="border-b border-border/60 bg-muted/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Explore All 9 Talent Solutions:
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_TALENT_SOLUTIONS_SIDEBAR.filter(
              (item) => item.key !== solution.solutionKey
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => navigate("public", item.route)}
                className="rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-brand hover:bg-brand/5 hover:text-brand"
              >
                {item.label} →
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 12. BOTTOM CTA BANNER ===================== */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-background via-brand/5 to-brand/10">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="bg-brand/15 text-brand border-brand/30 text-xs font-bold uppercase tracking-wider mb-4">
            Get Started Today
          </Badge>
          <h2 className="text-2xl font-black tracking-tight sm:text-4xl text-foreground">
            Ready to scale your engineering team with {solution.label}?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground">
            Let our senior talent directors build a customized implementation blueprint, candidate pipeline, and commercial proposal.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={handlePrimaryAction}
              className="gap-2 shadow-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setTalkToExpertOpen(true)}
              className="gap-2"
            >
              <PhoneCall className="h-4 w-4" /> Book Strategy Call
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================
          INTERACTIVE MODAL 1: SCOPE YOUR COHORT WIZARD
      ============================================================ */}
      <Dialog open={scopeCohortOpen} onOpenChange={setScopeCohortOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sliders className="h-5 w-5 text-brand" /> Scope Your Talent Cohort
            </DialogTitle>
            <DialogDescription>
              Configure role specifications, team size, tech stack, and duration to receive a customized curriculum and SLA proposal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScopeCohortSubmit} className="space-y-5 pt-2">
            <div>
              <Label className="text-xs font-semibold">Select Target Role</Label>
              <select
                value={cohortRole}
                onChange={(e) => setCohortRole(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                {ROLES_LIST.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold">Cohort Size (Trainees)</Label>
                <div className="mt-1.5 flex gap-2">
                  {["5", "10", "20", "50+"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setCohortSize(sz)}
                      className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-all ${
                        cohortSize === sz
                          ? "border-brand bg-brand text-white font-bold"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold">Training Duration</Label>
                <div className="mt-1.5 flex gap-2">
                  {["8 Weeks", "12 Weeks", "16 Weeks"].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setCohortDuration(dur)}
                      className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-all ${
                        cohortDuration === dur
                          ? "border-brand bg-brand text-white font-bold"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">
                Tech Stack Components (Select all that apply)
              </Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {POPULAR_STACKS.map((tech) => {
                  const active = selectedStacks.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleStack(tech)}
                      className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all ${
                        active
                          ? "border-brand bg-brand/10 text-brand font-bold"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {active ? "✓ " : "+ "}
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Estimation Snapshot */}
            <div className="rounded-lg border border-brand/20 bg-brand/5 p-4 text-xs space-y-1.5">
              <div className="font-semibold text-brand flex items-center justify-between">
                <span>Cohort Configuration Summary</span>
                <span className="font-mono text-[10px]">90-Day Replacement Guarantee</span>
              </div>
              <div className="text-muted-foreground">
                {cohortSize}x {cohortRole} · {cohortDuration} syllabus · {selectedStacks.length} core stacks
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                ✓ Guaranteed day-1 contribution · Curated from 2M+ candidate database
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Company Name</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. Acme Tech"
                  value={cohortCompany}
                  onChange={(e) => setCohortCompany(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Work Email</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="you@company.com"
                  type="email"
                  value={cohortEmail}
                  onChange={(e) => setCohortEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Contact Phone</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="+91 98765 43210"
                  value={cohortPhone}
                  onChange={(e) => setCohortPhone(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setScopeCohortOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5 bg-brand hover:bg-brand/90">
                <Send className="h-4 w-4" /> Generate Scoping Proposal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================
          INTERACTIVE MODAL 2: TALK TO A TALENT EXPERT
      ============================================================ */}
      <Dialog open={talkToExpertOpen} onOpenChange={setTalkToExpertOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-brand" /> Talk to a Talent Expert
            </DialogTitle>
            <DialogDescription>
              Book a 20-minute strategic consultation with our Senior Talent Solutions Director.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleExpertBooking} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Consultation Topic</Label>
              <select
                value={expertTopic}
                onChange={(e) => setExpertTopic(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="Curriculum & Tech Scoping">Curriculum & Tech Scoping</option>
                <option value="Workforce Diagnostic & Sizing">Workforce Diagnostic & Sizing</option>
                <option value="Staffing SLAs & Replacement Terms">Staffing SLAs & Replacement Terms</option>
                <option value="Commercial Pricing & ROI Model">Commercial Pricing & ROI Model</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Select Date</Label>
                <Input
                  type="date"
                  className="mt-1.5 h-9 text-xs"
                  value={expertDate}
                  onChange={(e) => setExpertDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Available Time Slot</Label>
                <select
                  value={expertTime}
                  onChange={(e) => setExpertTime(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="10:00 AM">10:00 AM IST</option>
                  <option value="11:30 AM">11:30 AM IST</option>
                  <option value="02:00 PM">02:00 PM IST</option>
                  <option value="04:00 PM">04:00 PM IST</option>
                  <option value="05:30 PM">05:30 PM IST</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <Label className="text-xs">Your Name</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="Priya Sharma"
                  value={expertName}
                  onChange={(e) => setExpertName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Business Email</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="priya@company.com"
                  type="email"
                  value={expertEmail}
                  onChange={(e) => setExpertEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Organization / Company</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="Enterprise Tech Ltd."
                  value={expertCompany}
                  onChange={(e) => setExpertCompany(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTalkToExpertOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5 bg-brand hover:bg-brand/90">
                <Calendar className="h-4 w-4" /> Confirm Appointment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================
          INTERACTIVE MODAL 3: TAKE AI ASSESSMENT SIMULATOR
      ============================================================ */}
      <Dialog open={takeAssessmentOpen} onOpenChange={setTakeAssessmentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-emerald-600" /> AI Technical Assessment Simulator
            </DialogTitle>
            <DialogDescription>
              Experience the 400+ proctored evaluation environment used by JOBSONN to verify top 5% talent.
            </DialogDescription>
          </DialogHeader>

          {assessmentStep === "intro" && (
            <div className="space-y-4 pt-2">
              <div className="rounded-lg border border-border/80 bg-muted/20 p-4 text-xs space-y-2">
                <div className="font-semibold text-foreground flex items-center justify-between">
                  <span>Proctored Assessment Specifications</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500">
                    4 Questions · 15 Mins
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  This interactive diagnostic evaluates React 19 architecture, SQL query indexing, Kubernetes autoscaling, and event streaming patterns.
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Anti-cheat proctoring simulation active</li>
                  <li>• Real-time syntax and architectural evaluation</li>
                  <li>• Instant verifiable certificate upon completion</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setTakeAssessmentOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setAssessmentStep("test");
                    setCurrentQuestion(0);
                    setSelectedAnswers({});
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
                >
                  Start Assessment Now <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {assessmentStep === "test" && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b pb-2 text-xs">
                <span className="font-semibold text-foreground">
                  Question {currentQuestion + 1} of {assessmentQuestions.length}
                </span>
                <span className="font-mono text-emerald-600 flex items-center gap-1 font-bold">
                  <Timer className="h-3.5 w-3.5" /> 14:38
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {assessmentQuestions[currentQuestion].q}
                </h4>

                {assessmentQuestions[currentQuestion].code && (
                  <pre className="mt-2.5 rounded-md bg-muted p-3 text-[11px] font-mono text-foreground/90 overflow-x-auto border border-border/60">
                    <code>{assessmentQuestions[currentQuestion].code}</code>
                  </pre>
                )}

                <div className="mt-4 space-y-2">
                  {assessmentQuestions[currentQuestion].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQuestion] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [currentQuestion]: oIdx,
                          }))
                        }
                        className={`w-full rounded-lg border p-3 text-left text-xs transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-semibold"
                            : "border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="h-4 w-4 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                >
                  Previous
                </Button>

                {currentQuestion < assessmentQuestions.length - 1 ? (
                  <Button
                    size="sm"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white"
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  >
                    Next Question →
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
                    onClick={() => {
                      setAssessmentScore(96);
                      setAssessmentStep("result");
                    }}
                  >
                    Submit & Generate Scorecard <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {assessmentStep === "result" && (
            <div className="space-y-4 pt-2 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <BadgeCheck className="h-8 w-8" />
              </div>

              <div>
                <Badge className="bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider">
                  Assessment Cleared · Top 4.8%
                </Badge>
                <h3 className="mt-2 text-xl font-bold text-foreground">
                  Score: {assessmentScore}% — Production Ready
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Candidate ID: JOBSONN-EVAL-{Math.floor(10000 + Math.random() * 90000)} · Verified on {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-left rounded-lg border p-3 bg-muted/20 text-xs">
                <div>
                  <div className="text-[10px] text-muted-foreground font-semibold">System Architecture</div>
                  <div className="text-sm font-bold text-emerald-600">98% (Exceeds)</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-semibold">State & Performance</div>
                  <div className="text-sm font-bold text-emerald-600">94% (High)</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-semibold">Code Reliability</div>
                  <div className="text-sm font-bold text-emerald-600">96% (Verified)</div>
                </div>
              </div>

              <div className="flex justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAssessmentStep("intro");
                    setTakeAssessmentOpen(false);
                  }}
                >
                  Done
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Scorecard Dossier Downloaded!", {
                      description: "Official verified evaluation report generated with QR code certification.",
                    });
                    setTakeAssessmentOpen(false);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  Download Verified Scorecard
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================================
          INTERACTIVE MODAL 4: SUBMIT REQUIREMENT
      ============================================================ */}
      <Dialog open={submitRequirementOpen} onOpenChange={setSubmitRequirementOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-brand" /> Submit Staffing Requirement
            </DialogTitle>
            <DialogDescription>
              Register your role specifications to activate our guaranteed 48-hour shortlist SLA.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequirementSubmit} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Role Title</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="e.g. Senior Full-Stack Engineer / Lead DevOps"
                value={reqJobTitle}
                onChange={(e) => setReqJobTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Seniority Level</Label>
                <select
                  value={reqSeniority}
                  onChange={(e) => setReqSeniority(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="Junior (1-3 yrs)">Junior (1-3 yrs)</option>
                  <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                  <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                  <option value="Staff / Lead (8+ yrs)">Staff / Lead (8+ yrs)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Engagement Model</Label>
                <select
                  value={reqModel}
                  onChange={(e) => setReqModel(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="Contract Staffing">Contract Staffing</option>
                  <option value="Contract-to-Hire">Contract-to-Hire</option>
                  <option value="Permanent Direct Hire">Permanent Direct Hire</option>
                  <option value="Project-Based Pod">Project-Based Pod</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Open Positions</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="2"
                  value={reqCount}
                  onChange={(e) => setReqCount(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Target Onboarding</Label>
                <select
                  value={reqTimeline}
                  onChange={(e) => setReqTimeline(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="Immediate (< 48 hrs)">Immediate (&lt; 48 hrs)</option>
                  <option value="Within 15 Days">Within 15 Days</option>
                  <option value="Within 30 Days">Within 30 Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Company Name</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="Acme Inc."
                  value={reqCompany}
                  onChange={(e) => setReqCompany(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-xs">Work Email</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="recruiter@acme.com"
                  type="email"
                  value={reqEmail}
                  onChange={(e) => setReqEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-800 dark:text-emerald-300">
              ⚡ <strong>48-Hour Shortlist Guarantee:</strong> You will receive 3 to 5 pre-screened, assessment-verified candidate dossiers within 2 business days.
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubmitRequirementOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5 bg-brand hover:bg-brand/90">
                <Send className="h-4 w-4" /> Submit Role Brief
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================
          INTERACTIVE MODAL 5: APPLY TO TALENT COHORT
      ============================================================ */}
      <Dialog open={applyCohortOpen} onOpenChange={setApplyCohortOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-brand" /> Apply for Talent Program
            </DialogTitle>
            <DialogDescription>
              Join employer-sponsored cohorts with paid stipends and guaranteed placement pathways.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCandidateApply} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs">Full Name</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="Rahul Nair"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Email Address</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="rahul@gmail.com"
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Mobile Number</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="+91 98765 43210"
                  value={candidatePhone}
                  onChange={(e) => setCandidatePhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">College / University</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="IIT / NIT / BITS / Anna Univ"
                  value={candidateCollege}
                  onChange={(e) => setCandidateCollege(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Graduation Year</Label>
                <select
                  value={candidateGradYear}
                  onChange={(e) => setCandidateGradYear(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="2026">2026 (Final Year)</option>
                  <option value="2025">2025 (Recent Grad)</option>
                  <option value="2024">2024</option>
                  <option value="Experienced">Experienced Professional</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs">GitHub / Portfolio URL</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="https://github.com/yourhandle"
                value={candidateGithub}
                onChange={(e) => setCandidateGithub(e.target.value)}
              />
            </div>

            <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
              ✓ 100% Free for candidates · No upfront fee or deduction · Paid stipends during client project phase.
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setApplyCohortOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5 bg-brand hover:bg-brand/90">
                <Send className="h-4 w-4" /> Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================================
          INTERACTIVE MODAL 6: REQUEST SHORTLIST (PLACEMENTS)
      ============================================================ */}
      <Dialog open={requestShortlistOpen} onOpenChange={setRequestShortlistOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" /> Request Placement Shortlist
            </DialogTitle>
            <DialogDescription>
              Receive verified candidate profiles from our active placement bench within 48 hours.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleShortlistSubmit} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs">Target Role</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="e.g. Frontend Engineer (React/TypeScript)"
                value={shortlistRole}
                onChange={(e) => setShortlistRole(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Compensation Budget</Label>
                <select
                  value={shortlistCtc}
                  onChange={(e) => setShortlistCtc(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="₹8-12 LPA">₹8-12 LPA (Junior)</option>
                  <option value="₹12-20 LPA">₹12-20 LPA (Mid)</option>
                  <option value="₹20-35 LPA">₹20-35 LPA (Senior)</option>
                  <option value="₹35+ LPA">₹35+ LPA (Lead/Principal)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Work Model</Label>
                <select
                  value={shortlistModel}
                  onChange={(e) => setShortlistModel(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="Remote">100% Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite (Bangalore/Hyderabad/Pune/NCR)</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Hiring Manager / Recruiter Work Email</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="hiring@company.com"
                type="email"
                value={shortlistEmail}
                onChange={(e) => setShortlistEmail(e.target.value)}
                required
              />
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200">
              ✓ Includes verified code submissions, GitHub audit, and proctored assessment scorecards.
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRequestShortlistOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white">
                <Send className="h-4 w-4" /> Request Shortlist (48h SLA)
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
