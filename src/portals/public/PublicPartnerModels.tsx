"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Handshake, Building2, GraduationCap, Wrench, Cpu, Brain, Users2,
  ArrowRight, CheckCircle2, Sparkles, MapPin, Star, TrendingUp,
  Briefcase, Layers,
} from "lucide-react";
import { partners, MODEL_LABELS } from "@/lib/partner-data";
import type { PartnerModel } from "@/lib/partner-types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { toast } from "sonner";

interface ModelInfo {
  key: PartnerModel;
  name: string;
  tagline: string;
  description: string;
  icon: typeof Handshake;
  idealFor: string[];
  capabilities: string[];
  color: string;
  bg: string;
  accent: string;
}

const MODELS: ModelInfo[] = [
  {
    key: "CENTRE",
    name: "Centre Partner",
    tagline: "Run a jobson.id-branded training centre",
    description: "Operate a physical training facility delivering jobson.id's certified programs with full marketing, admissions and placement support.",
    icon: Building2,
    idealFor: ["Training companies", "Ed-tech operators", "Entrepreneurs with infrastructure", "Vocational institutes"],
    capabilities: ["Centre setup & inspection", "Curriculum & LMS access", "Local admissions", "Lead generation", "Batch management", "Certification"],
    color: "text-brand",
    bg: "bg-brand/10",
    accent: "from-brand/15 to-background",
  },
  {
    key: "COLLEGE",
    name: "College Partner",
    tagline: "Embed jobson.id inside your campus",
    description: "Co-brand a training facility, integrate our curriculum as electives, or run placement-only partnerships across 5 flexible MoU models (A–E).",
    icon: GraduationCap,
    idealFor: ["Engineering & degree colleges", "Deemed universities", "Autonomous institutes", "Polytechnics"],
    capabilities: ["Curriculum integration", "Co-branded centre", "Faculty development", "Placement drives", "Pre-placement training", "MoU support"],
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    accent: "from-emerald-500/15 to-background",
  },
  {
    key: "SERVICE",
    name: "Service Partner",
    tagline: "Deliver IT services on the jobson.id stack",
    description: "Run cloud, DevOps, data engineering, and maintenance engagements for jobson.id clients with project, retainer, and AMC delivery models.",
    icon: Wrench,
    idealFor: ["IT services companies", "Cloud consultants", "System integrators", "Maintenance providers"],
    capabilities: ["Service catalog access", "Project & AMC delivery", "SLA tracking", "Engagement management", "Co-delivery", "Wallet & settlements"],
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    accent: "from-amber-500/15 to-background",
  },
  {
    key: "TECHNOLOGY",
    name: "Technology Partner",
    tagline: "Build & deploy jobson.id-powered tech",
    description: "Deploy, integrate, and OEM the jobson.id platform across ERP, CRM, cloud infrastructure, and enterprise implementations.",
    icon: Cpu,
    idealFor: ["ERP / CRM integrators", "Cloud infrastructure firms", "OEM partners", "Enterprise consultancies"],
    capabilities: ["Platform deployment", "ERP / CRM integration", "OEM licensing", "Co-branded delivery", "Enterprise SLAs", "Revenue share"],
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    accent: "from-violet-500/15 to-background",
  },
  {
    key: "AI",
    name: "AI Partner",
    tagline: "Ship AI products on jobson.id compute",
    description: "Build and deploy AI/ML solutions — document AI, NLP, computer vision — with jobson.id-provided GPU credits and co-sell support.",
    icon: Brain,
    idealFor: ["AI startups", "ML consultancies", "Research labs", "Generative AI product teams"],
    capabilities: ["GPU compute credits", "Co-sell motion", "AI service delivery", "Model hosting", "Data pipelines", "Certification"],
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    accent: "from-rose-500/15 to-background",
  },
  {
    key: "RECRUITMENT",
    name: "Recruitment Partner",
    tagline: "Place candidates, earn on every hire",
    description: "Source, screen and place candidates against jobson.id job orders. Earn on every placement with transparent split rules and hotlist tooling.",
    icon: Users2,
    idealFor: ["Staffing agencies", "RPO providers", "Independent recruiters", "Executive search firms"],
    capabilities: ["Job order access", "Candidate sourcing", "Hotlists", "Submissions & tracking", "Onboarding", "Placement fees"],
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    accent: "from-cyan-500/15 to-background",
  },
];

const COMPARISON_ROWS: { label: string; cells: Record<PartnerModel, string | boolean> }[] = [
  { label: "Physical infrastructure required", cells: { CENTRE: true, COLLEGE: true, SERVICE: false, TECHNOLOGY: false, AI: false, RECRUITMENT: false } },
  { label: "Lead generation", cells: { CENTRE: "Partner + jobson.id", COLLEGE: "Campus + jobson.id", SERVICE: "Partner-led", TECHNOLOGY: "Partner-led", AI: "Co-sell", RECRUITMENT: "jobson.id job orders" } },
  { label: "Program delivery", cells: { CENTRE: "Physical + hybrid", COLLEGE: "On-campus", SERVICE: "Remote / on-site", TECHNOLOGY: "Project-based", AI: "Project-based", RECRUITMENT: "N/A" } },
  { label: "LMS access", cells: { CENTRE: true, COLLEGE: true, SERVICE: false, TECHNOLOGY: false, AI: false, RECRUITMENT: false } },
  { label: "Certification rights", cells: { CENTRE: true, COLLEGE: true, SERVICE: "Optional", TECHNOLOGY: true, AI: true, RECRUITMENT: "Optional" } },
  { label: "Wallet & settlements", cells: { CENTRE: true, COLLEGE: true, SERVICE: true, TECHNOLOGY: true, AI: true, RECRUITMENT: true } },
  { label: "Marketing kit", cells: { CENTRE: true, COLLEGE: true, SERVICE: true, TECHNOLOGY: true, AI: true, RECRUITMENT: true } },
  { label: "Co-branding", cells: { CENTRE: true, COLLEGE: true, SERVICE: "Optional", TECHNOLOGY: true, AI: true, RECRUITMENT: false } },
  { label: "Settlement cycle", cells: { CENTRE: "Monthly", COLLEGE: "Monthly", SERVICE: "Per milestone", TECHNOLOGY: "Monthly", AI: "Monthly", RECRUITMENT: "Per placement" } },
  { label: "Centre inspection", cells: { CENTRE: true, COLLEGE: true, SERVICE: false, TECHNOLOGY: false, AI: false, RECRUITMENT: false } },
  { label: "GPU / compute credits", cells: { CENTRE: false, COLLEGE: false, SERVICE: false, TECHNOLOGY: false, AI: true, RECRUITMENT: false } },
  { label: "Job order access", cells: { CENTRE: "Placement drives", COLLEGE: "Placement drives", SERVICE: false, TECHNOLOGY: false, AI: false, RECRUITMENT: true } },
  { label: "Agreement term", cells: { CENTRE: "1–3 years", COLLEGE: "1–5 years", SERVICE: "Project / AMC", TECHNOLOGY: "1–3 years", AI: "1–2 years", RECRUITMENT: "1 year" } },
  { label: "Typical revenue share", cells: { CENTRE: "60–70%", COLLEGE: "55–65%", SERVICE: "60–75%", TECHNOLOGY: "70–72%", AI: "70%", RECRUITMENT: "40–68%" } },
];

const PERSONAS = [
  { id: "centre-operator", label: "I run a training centre", model: "CENTRE" as PartnerModel },
  { id: "college-admin", label: "I'm from a college / university", model: "COLLEGE" as PartnerModel },
  { id: "services-firm", label: "We deliver IT services", model: "SERVICE" as PartnerModel },
  { id: "tech-integrator", label: "We integrate enterprise tech", model: "TECHNOLOGY" as PartnerModel },
  { id: "ai-builder", label: "We build AI products", model: "AI" as PartnerModel },
  { id: "recruiter", label: "We place candidates", model: "RECRUITMENT" as PartnerModel },
];

export function PublicPartnerModels() {
  const { navigate } = useNav();
  const [activePersona, setActivePersona] = React.useState<string | null>(null);

  // Aggregate partner counts per model
  const countsByModel = React.useMemo(() => {
    const map: Record<PartnerModel, number> = { CENTRE: 0, COLLEGE: 0, SERVICE: 0, TECHNOLOGY: 0, AI: 0, RECRUITMENT: 0 };
    for (const p of partners) {
      if (p.status === "active" || p.status === "under_review") map[p.model]++;
    }
    return map;
  }, []);

  const totalActivePartners = partners.filter((p) => p.status === "active").length;
  const totalStudents = partners.reduce((s, p) => s + p.studentsEnrolled, 0);
  const totalRevenue = partners.reduce((s, p) => s + p.settlementsYTD, 0);

  const handleApply = (model: PartnerModel) => {
    toast.success(`Starting application for ${MODEL_LABELS[model]}`, {
      description: "Your model selection will be pre-filled in the wizard.",
    });
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jobson_id_partner_apply_model", model);
    }
    navigate("public", "partner-apply");
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge className="mb-4 gap-1"><Handshake className="h-3 w-3" /> Franchise & Partner Program</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            <span className="text-brand">6 ways</span> to partner with jobson.id
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Whether you run a training centre, lead a college, deliver IT services, integrate enterprise tech,
            build AI products, or place candidates — there&apos;s a partnership model built for you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate("public", "partner-apply")} className="gap-1.5">
              <Sparkles className="h-4 w-4" /> Apply now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("public", "partner-calculator")} className="gap-1.5">
              <TrendingUp className="h-4 w-4" /> See revenue calculator
            </Button>
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Active partners" value={`${totalActivePartners}+`} icon={<Handshake className="h-5 w-5" />} tone="brand" hint="Across 6 models" />
          <StatCard label="Students trained" value={formatNumber(totalStudents)} icon={<GraduationCap className="h-5 w-5" />} tone="brand" hint="Via partner network" />
          <StatCard label="Settled to partners (YTD)" value={formatCurrency(totalRevenue)} icon={<TrendingUp className="h-5 w-5" />} tone="brand" hint="Illustrative" />
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">Figures based on demo data — real numbers updated quarterly.</p>
      </section>

      {/* Model grid */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODELS.map((m) => {
            const Icon = m.icon;
            const count = countsByModel[m.key];
            return (
              <Card key={m.key} className={`group relative overflow-hidden p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg`}>
                <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${m.accent} opacity-60`} aria-hidden />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${m.bg} ${m.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Layers className="h-3 w-3" /> {count} active
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">{m.name}</h3>
                  <p className="mt-0.5 text-sm font-medium text-brand">{m.tagline}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{m.description}</p>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Key capabilities</p>
                    <ul className="mt-2 grid grid-cols-1 gap-1.5">
                      {m.capabilities.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Ideal for</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.idealFor.map((i) => (
                        <Badge key={i} variant="outline" className="text-[10px] font-normal">{i}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <Button size="sm" className="flex-1 gap-1.5" onClick={() => handleApply(m.key)}>
                      Apply <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate("public", "partner-how-it-works")}>
                      How it works
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Persona helper */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Which model is right for you?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Pick the option that sounds most like you — we&apos;ll point you to the right program.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PERSONAS.map((p) => {
              const info = MODELS.find((m) => m.key === p.model)!;
              const Icon = info.icon;
              const active = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePersona(p.id);
                    toast.success(`Best fit: ${info.name}`, { description: info.tagline });
                  }}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    active ? "border-brand bg-brand/5 ring-1 ring-brand/30" : "border-border bg-card hover:border-brand/40"
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${info.bg} ${info.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{p.label}</p>
                    {active && (
                      <p className="mt-1 text-xs text-brand">→ {info.name} model</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {activePersona && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <Button onClick={() => navigate("public", "partner-apply")} className="gap-1.5">
                Start my application <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Comparison table */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Compare all 6 models</h2>
          <p className="mt-2 text-sm text-muted-foreground">14-point comparison across infrastructure, delivery, certification and commercial terms.</p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-10 bg-card min-w-[200px]">Capability</TableHead>
                  {MODELS.map((m) => (
                    <TableHead key={m.key} className="text-center min-w-[140px]">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.bg} ${m.color}`}>
                          <m.icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs">{m.name}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON_ROWS.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="sticky left-0 z-10 bg-card font-medium">{row.label}</TableCell>
                    {MODELS.map((m) => {
                      const v = row.cells[m.key];
                      return (
                        <TableCell key={m.key} className="text-center text-xs">
                          {v === true ? (
                            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                          ) : v === false ? (
                            <span className="text-muted-foreground/40">—</span>
                          ) : (
                            <span className="text-muted-foreground">{v}</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          All commercial terms as per the signed partner agreement — this table is illustrative.
        </p>
      </section>

      {/* Featured partners strip */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Meet a few of our partners</h2>
            <p className="mt-2 text-sm text-muted-foreground">Operators across India building on jobson.id.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partners.filter((p) => p.status === "active").slice(0, 4).map((p) => (
              <Card key={p.id} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <AvatarLogo text={p.logo} size="md" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{MODEL_LABELS[p.model]}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {p.city}, {p.state}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
                  <div>
                    <p className="text-sm font-bold">{formatNumber(p.studentsEnrolled)}</p>
                    <p className="text-[10px] uppercase text-muted-foreground">Students</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{p.rating > 0 ? p.rating.toFixed(1) : "—"}</p>
                    <p className="text-[10px] uppercase text-muted-foreground">Rating</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{formatCurrency(p.revenueYTD)}</p>
                    <p className="text-[10px] uppercase text-muted-foreground">YTD rev</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate("public", "partner-stories")} className="gap-1.5">
              <Star className="h-4 w-4" /> Read partner success stories
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to become a jobson.id partner?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Apply in 8 guided steps. Most applications are reviewed within 7 business days, with a dedicated
                partnership manager assigned to walk you through agreement, onboarding, and launch.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate("public", "partner-apply")} className="gap-1.5">
                <Briefcase className="h-4 w-4" /> Apply now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "partner-faqs")} className="gap-1.5">
                Read FAQs
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
