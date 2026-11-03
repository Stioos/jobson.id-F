"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
  CheckCircle2,
  Zap,
};

export function PublicTalentSolutionLanding({
  solutionKey,
}: {
  solutionKey: string;
}) {
  const { navigate, setLoginDrawerOpen } = useNav();
  const solution = getTalentSolution(solutionKey);
  const fullData = getFullTalentSolution(solutionKey);

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
  const subheadline =
    fullData?.heroSubheadline || solution.desc;
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
                  onClick={() =>
                    toast.success("Consultation Request Received", {
                      description: `Our ${solution.label} lead will reach out within 24 hours.`,
                    })
                  }
                  className="gap-2 shadow-md bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                >
                  Explore Solution <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("public", "contact")}
                  className="gap-2"
                >
                  <PhoneCall className="h-4 w-4" /> Talk to an Expert
                </Button>
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

      {/* ===================== 2. WHY THIS PROGRAM WINS (from jobsonn.com) ===================== */}
      {whyItWins.length > 0 && (
        <section className="border-b border-border/60 bg-muted/20 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-wider font-semibold">
                Core Differentiators
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Why this program wins
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                Engineered from thousands of placements and enterprise engagements — not generic coursework.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {whyItWins.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl mb-4"
                    style={{ backgroundColor: `${color}18`, color: color }}
                  >
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== 3. BUILT FOR BOTH SIDES (Dual Audience from jobsonn.com) ===================== */}
      {bothSides && (
        <section className="border-b border-border/60 py-12 sm:py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Strategic Alignment
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Built for both sides
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                One program, two winning outcomes — whether you are building your enterprise team or advancing your technical career.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Employers Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:border-brand/50 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-brand bg-brand/10">
                      {bothSides.employers.tag}
                    </span>
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">
                    {bothSides.employers.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {bothSides.employers.desc}
                  </p>

                  <div className="mt-6 border-t border-border/60 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                      Key Advantages
                    </h4>
                    <ul className="space-y-2.5">
                      {bothSides.employers.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60">
                  <Button
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                    onClick={() =>
                      toast.success("Inquiry Sent", {
                        description: `We will prepare a custom plan for ${solution.label}.`,
                      })
                    }
                  >
                    {bothSides.employers.ctaText} →
                  </Button>
                </div>
              </div>

              {/* Candidates / Learners Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:border-brand/50 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-blue-600 dark:text-blue-400 bg-blue-500/10">
                      {bothSides.candidates.tag}
                    </span>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">
                    {bothSides.candidates.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {bothSides.candidates.desc}
                  </p>

                  <div className="mt-6 border-t border-border/60 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                      Key Advantages
                    </h4>
                    <ul className="space-y-2.5">
                      {bothSides.candidates.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    className="w-full hover:border-brand hover:text-brand"
                    onClick={() => {
                      navigate("public", "home");
                      setLoginDrawerOpen(true);
                    }}
                  >
                    {bothSides.candidates.ctaText} →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================== 4. CORE CAPABILITIES (Sub-pages grid) ===================== */}
      <section className="border-b border-border/60 py-12 sm:py-16 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Deep Dive Tracks
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Core Capabilities & Modules
              </h2>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {solution.subPages.length} specialized sub-pages · click to explore
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solution.subPages.map((sp, idx) => {
              const SubIcon = ICON_MAP[sp.icon] || Target;
              return (
                <Card
                  key={sp.subPageKey}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate("public", `talent/${solutionKey}/${sp.subPageKey}`)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate("public", `talent/${solutionKey}/${sp.subPageKey}`)
                  }
                  className="group cursor-pointer p-4 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-md"
                  style={{ borderTopColor: color, borderTopWidth: 3 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${color}18`,
                        color: color,
                      }}
                    >
                      <SubIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-brand transition-colors">
                        {sp.label}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {sp.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-2.5">
                    <span className="text-[10px] text-muted-foreground">
                      Track {idx + 1} of {solution.subPages.length}
                    </span>
                    <span className="text-[11px] font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-0.5">
                      Explore <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== 5. HOW IT WORKS (6-Step Workflow) ===================== */}
      {processSteps.length > 0 && (
        <section className="border-b border-border/60 py-12 sm:py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Execution Model
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                How the program works
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                A structured, repeatable 6-stage lifecycle ensuring quality, visibility, and measurable delivery.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {processSteps.map((s, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl border border-border/80 bg-card p-5 shadow-2xs transition-all hover:border-brand/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-extrabold text-brand/80 font-mono">
                      {s.step}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-brand/50" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== 6. ENTERPRISE USE CASES ===================== */}
      {useCases.length > 0 && (
        <section className="border-b border-border/60 py-12 sm:py-16 bg-muted/15">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-wider font-semibold">
                Proven Track Record
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Real results from leading companies
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                See how high-growth startups and established enterprises scale technical capacity.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {useCases.map((uc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm"
                >
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Challenge
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {uc.scenario}
                    </p>

                    <h4 className="mt-4 text-sm font-bold text-brand">
                      JOBSONN Solution
                    </h4>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {uc.solution}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-4 grid grid-cols-3 gap-2">
                    {uc.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="text-center">
                        <div className="text-sm font-bold text-foreground">
                          {m.value}
                        </div>
                        <div className="text-[10px] text-muted-foreground line-clamp-1">
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

      {/* ===================== 7. KEY BENEFITS ===================== */}
      {benefits.length > 0 && (
        <section className="border-b border-border/60 py-12 sm:py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Value Proposition
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Key Advantages & Benefits
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-2xs hover:border-brand/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <h3 className="text-sm font-bold text-foreground">
                      {b.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground pl-6">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== 8. TESTIMONIALS & CLIENT REVIEWS ===================== */}
      {testimonials.length > 0 && (
        <section className="border-b border-border/60 py-12 sm:py-16 bg-muted/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Client Endorsements
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                What engineering leaders say
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm relative flex flex-col justify-between"
                >
                  <Quote className="h-8 w-8 text-brand/20 mb-3" />
                  <p className="text-sm sm:text-base italic leading-relaxed text-foreground/90 mb-6">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 font-bold text-brand text-xs">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-foreground">
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

      {/* ===================== 9. AUDIT-READY DELIVERABLES ===================== */}
      {deliverables.length > 0 && (
        <section className="border-b border-border/60 py-12 sm:py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-muted/20 p-6 sm:p-8 shadow-sm">
              <div className="max-w-2xl mb-6">
                <Badge variant="outline" className="text-[10px] uppercase font-semibold mb-2">
                  Transparent Accountability
                </Badge>
                <h3 className="text-xl font-bold text-foreground">
                  Audit-Ready Deliverables Included
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Every engagement is backed by tangible artifacts, telemetry logs, and sign-offs.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {deliverables.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-background/80 p-3 text-xs text-foreground shadow-2xs"
                  >
                    <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================== 10. FREQUENTLY ASKED QUESTIONS ===================== */}
      {faqs.length > 0 && (
        <section className="border-b border-border/60 py-12 sm:py-16 bg-muted/15">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Common Questions
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="rounded-xl border border-border/80 bg-card px-4 shadow-2xs"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ===================== 11. SIBLING SOLUTIONS NAVIGATION ===================== */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
            Explore Other Talent Solutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {ALL_TALENT_SOLUTIONS_SIDEBAR.filter(
              (item) => item.key !== solutionKey
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
    </div>
  );
}
