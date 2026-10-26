"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, ChevronRight, Sparkles, Briefcase, Search, Clock, ShieldCheck,
  GraduationCap, UserCheck, Award, ClipboardCheck, Layers, Globe, Users,
  TrendingUp, BrainCircuit, Database, Gauge, Wallet, Target, FileCheck2,
  Workflow, BarChart3, CheckCircle2, Zap, Headset, Rocket, ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Talent solutions sidebar (10 distinct solutions — Talent Sourcing is active)
// ─────────────────────────────────────────────────────────────────────────────
interface SidebarSolution {
  key: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  route: string;
  active?: boolean;
}

const SIDEBAR_SOLUTIONS: SidebarSolution[] = [
  { key: "train-to-hire", label: "Train to Hire", subtitle: "Upskill fresh talent, then deploy", icon: GraduationCap, route: "talent/talent-train-to-hire" },
  { key: "hire-to-train", label: "Hire to Train", subtitle: "Hire first, then we upskill", icon: UserCheck, route: "talent/talent-hire-to-train" },
  { key: "corporate-training", label: "Corporate Training", subtitle: "Upskill your existing workforce", icon: Award, route: "talent/talent-corporate-training" },
  { key: "talent-sourcing", label: "Talent Sourcing", subtitle: "AI-powered sourcing & shortlist", icon: Search, route: "talent/talent-sourcing-recruitment", active: true },
  { key: "talent-deployment", label: "Talent Deployment", subtitle: "On-demand contract & project talent", icon: Layers, route: "talent/talent-flexible-deployment" },
  { key: "workforce-solutions", label: "Workforce Solutions", subtitle: "End-to-end workforce management", icon: Globe, route: "talent/talent-end-to-end-workforce" },
  { key: "talent-assessment", label: "Talent Assessment", subtitle: "Scientific AI-powered evaluation", icon: ClipboardCheck, route: "talent/talent-assessment" },
  { key: "staffing-solutions", label: "Staffing Solutions", subtitle: "Flexible staffing at any scale", icon: Users, route: "talent/talent-staffing" },
  { key: "placements", label: "Placements", subtitle: "Gateway to top tech careers", icon: TrendingUp, route: "placements" },
  { key: "professional-services", label: "Professional Services", subtitle: "Consulting & implementation", icon: Briefcase, route: "professional-services" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 8 Talent Sourcing sub-pages (top tab bar + 6 feature cards)
// ─────────────────────────────────────────────────────────────────────────────
interface SubPage {
  key: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  description: string;
  features: string[];
}

const SUB_PAGES: SubPage[] = [
  {
    key: "ai-sourcing-engine",
    label: "AI Sourcing Engine",
    shortLabel: "AI Sourcing Engine",
    icon: BrainCircuit,
    description: "Semantic talent search with skill-graph ranking and predictive analytics — find the right fit in seconds, not weeks.",
    features: ["Semantic skill-graph search", "Predictive role-fit scoring", "Auto-expanded boolean queries"],
  },
  {
    key: "talent-pool-benchmarks",
    label: "Talent Pool & Benchmarks",
    shortLabel: "Talent Pool & Benchmarks",
    icon: Database,
    description: "Curated talent pools by role, salary band data, and availability heatmaps to plan sourcing with confidence.",
    features: ["2M+ verified candidate pool", "Real-time salary band data", "Geographic availability heatmaps"],
  },
  {
    key: "48-hour-shortlist",
    label: "48-Hour Shortlist SLA",
    shortLabel: "48-Hour Shortlist",
    icon: Clock,
    description: "One-call intake, structured screening gates, and a guaranteed 48-hour shortlist delivery — or your money back.",
    features: ["One-call role intake", "5-stage screening gates", "Guaranteed 48h delivery"],
  },
  {
    key: "screening-assessment",
    label: "Screening & Assessment",
    shortLabel: "Screening & Assessment",
    icon: ClipboardCheck,
    description: "AI technical screens, proctored assessments, and culture-fit evaluations — pre-vetted candidates, every time.",
    features: ["AI technical screens (40+ stacks)", "Proctored assessments", "Culture-fit evaluation"],
  },
  {
    key: "sourcing-plans-pricing",
    label: "Sourcing Plans & Pricing",
    shortLabel: "Sourcing Plans & Pricing",
    icon: Wallet,
    description: "Transparent per-role pricing with three tiers — Basic, Pro, Enterprise — and custom quotes for high-volume needs.",
    features: ["Per-role transparent pricing", "3 ready-to-buy tiers", "Custom enterprise quotes"],
  },
  {
    key: "hiring-workflow",
    label: "Hiring Workflow",
    shortLabel: "Hiring Workflow",
    icon: Workflow,
    description: "Role intake brief, automated scheduling, and end-to-end offer management — your hiring pipeline, orchestrated.",
    features: ["Role intake brief template", "Automated interview scheduling", "End-to-end offer management"],
  },
  {
    key: "candidate-engagement",
    label: "Candidate Engagement",
    shortLabel: "Candidate Engagement",
    icon: Sparkles,
    description: "Personalized outreach, structured feedback loops, and nurture sequences that keep candidates warm till offer day.",
    features: ["Personalized multi-channel outreach", "Structured feedback loops", "Long-term nurture sequences"],
  },
  {
    key: "analytics-reporting",
    label: "Analytics & Reporting",
    shortLabel: "Analytics & Reporting",
    icon: BarChart3,
    description: "Real-time dashboards, sourcing funnel analytics, and diversity metrics — hiring intelligence, on tap.",
    features: ["Real-time hiring dashboards", "Sourcing funnel analytics", "Diversity & inclusion metrics"],
  },
];

const LANDING_STATS = [
  { label: "Candidate pool", value: "2M+", icon: <Database className="h-5 w-5" /> },
  { label: "Shortlist SLA", value: "48 hrs", icon: <Clock className="h-5 w-5" /> },
  { label: "Submittal-to-interview", value: "68%", icon: <Gauge className="h-5 w-5" /> },
  { label: "90-day retention", value: "97%", icon: <ShieldCheck className="h-5 w-5" /> },
];

export function PublicTalentSourcingLanding() {
  const { navigate } = useNav();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const goToSubPage = (key: string) => navigate("public", `talent/talent-sourcing-recruitment/${key}`);

  return (
    <div className="bg-background">
      {/* Top breadcrumb / back link */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("public", "talent-solutions")}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Talent Solutions
          </button>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <Layers className="h-4 w-4" /> Solutions
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          {/* ───────────── MAIN CONTENT (sidebar removed — now in secondary header dropdown) ───────────── */}
          <div className="min-w-0 space-y-6">
            {/* Hero */}
            <Card className="relative overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-8">
              <div
                className="absolute inset-0 opacity-50"
                style={{ background: "radial-gradient(circle at 80% 0%, rgba(16,185,129,0.18), transparent 55%)" }}
                aria-hidden
              />
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                      <Search className="h-6 w-6" />
                    </span>
                    <Badge variant="outline" className="gap-1 text-brand">
                      <Sparkles className="h-3 w-3" /> WORKFORCE SOLUTIONS
                    </Badge>
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Sourcing Talent Recruitment
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    AI-powered talent sourcing from a 2M+ verified candidate pool. Find the right fit
                    in 48 hours — with transparent fit scoring, structured shortlists, and end-to-end
                    hiring workflow automation.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={() => goToSubPage("ai-sourcing-engine")}
                      className="gap-1.5"
                    >
                      Explore solution <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("public", "contact")}
                      className="gap-1.5"
                    >
                      <Headset className="h-4 w-4" /> Talk to Sales
                    </Button>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-3 lg:w-[280px] lg:grid-cols-1">
                  {LANDING_STATS.map((s) => (
                    <div key={s.label} className="rounded-lg border bg-card/70 p-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand/10 text-brand">
                          {s.icon}
                        </span>
                        <div>
                          <div className="text-lg font-bold leading-none text-brand">{s.value}</div>
                          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Top tab bar — 8 sub-pages */}
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Talent Sourcing
                  </div>
                  <div className="text-sm font-semibold">Explore all 8 sub-pages</div>
                </div>
                <Badge variant="outline" className="text-brand">8 sub-pages</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUB_PAGES.map((sp) => {
                  const Icon = sp.icon;
                  return (
                    <button
                      key={sp.key}
                      onClick={() => goToSubPage(sp.key)}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-all hover:border-brand hover:bg-brand/5 hover:text-brand"
                    >
                      <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand" />
                      {sp.shortLabel}
                      <ChevronRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* 6 feature cards grid (2x3) */}
            <div>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Core capabilities</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Six pillars of our Talent Sourcing engine — click any card to dive deep.
                  </p>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex text-brand">6 cards</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SUB_PAGES.slice(0, 6).map((sp) => {
                  const Icon = sp.icon;
                  return (
                    <Card
                      key={sp.key}
                      onClick={() => goToSubPage(sp.key)}
                      className="group h-full cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold group-hover:text-brand">{sp.label}</h3>
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-brand" />
                          </div>
                          <p className="mt-1.5 text-xs text-muted-foreground">{sp.description}</p>
                          <ul className="mt-3 space-y-1.5">
                            {sp.features.map((f) => (
                              <li key={f} className="flex items-start gap-1.5 text-xs text-foreground">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goToSubPage(sp.key);
                            }}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand"
                          >
                            +2 more capabilities <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Why Talent Sourcing strip — 4 stat cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Hires delivered / yr" value="9,400+" icon={<Users className="h-5 w-5" />} tone="brand" />
              <StatCard label="Avg shortlist time" value="48 hrs" icon={<Clock className="h-5 w-5" />} tone="brand" />
              <StatCard label="Submittal-to-offer" value="32%" icon={<Target className="h-5 w-5" />} tone="brand" />
              <StatCard label="Replacement guarantee" value="90 days" icon={<ShieldCheck className="h-5 w-5" />} tone="brand" />
            </div>

            {/* Bottom CTA banner */}
            <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-8">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Rocket className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold sm:text-xl">Need something bespoke?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Our architects scope custom sourcing solutions within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => toast.success("Consultation requested", { description: "Our sourcing architects will reach out within 24 hours to scope a custom solution." })} className="gap-1.5">
                    <Headset className="h-4 w-4" /> Request a Consultation
                  </Button>
                  <Button variant="outline" onClick={() => goToSubPage("sourcing-plans-pricing")} className="gap-1.5">
                    <Wallet className="h-4 w-4" /> View Pricing
                  </Button>
                </div>
              </div>
            </Card>

            {/* Footer mini-links to remaining 2 sub-pages */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">More capabilities:</span>
              {SUB_PAGES.slice(6).map((sp) => (
                <button
                  key={sp.key}
                  onClick={() => goToSubPage(sp.key)}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium transition-colors hover:border-brand hover:text-brand"
                >
                  <sp.icon className="h-3 w-3" />
                  {sp.label}
                  <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reserved for downstream consumers (icon map).
export const _TALENT_SOURCING_LANDING_ICONS: Record<string, LucideIcon> = {
  ArrowRight, ChevronRight, Sparkles, Briefcase, Search, Clock, ShieldCheck,
  GraduationCap, UserCheck, Award, ClipboardCheck, Layers, Globe, Users,
  TrendingUp, BrainCircuit, Database, Gauge, Wallet, Target, FileCheck2,
  Workflow, BarChart3, CheckCircle2, Zap, Headset, Rocket, ArrowLeft,
};
