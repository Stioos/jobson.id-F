"use client";

import * as React from "react";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
import {
  PageHeader,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  talentSolutionPrograms,
  talentTransactions,
  SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionType } from "@/lib/talent-solutions-types";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  ArrowRight,
  GraduationCap,
  Building2,
  UserCheck,
  Search,
  Handshake,
  ShieldCheck,
  Brain,
  Layers,
  Users,
  Target,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ServiceCardDef {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  column: "talent" | "workforce" | "assessment";
  route?: string;
  comingSoon?: boolean;
}

const SERVICES: ServiceCardDef[] = [
  {
    id: "t2h",
    title: "Train to Hire",
    badge: "Training + Placement",
    description: "Upskill fresh talent through industry-aligned training before placing them into guaranteed roles with hiring partners.",
    icon: <GraduationCap className="h-5 w-5" />,
    iconBg: "from-emerald-500 to-teal-600",
    column: "talent",
    route: "ts-train-to-hire",
  },
  {
    id: "h2t",
    title: "Hire to Train",
    badge: "Hire + Upskill",
    description: "Hire promising candidates and we train them to meet your specific technology stack and project requirements.",
    icon: <UserCheck className="h-5 w-5" />,
    iconBg: "from-violet-500 to-fuchsia-600",
    column: "talent",
    route: "ts-hire-to-train",
  },
  {
    id: "corp",
    title: "Corporate Training",
    badge: "Enterprise Training",
    description: "Custom corporate training programs designed to upskill your existing employees across technology, leadership, and compliance.",
    icon: <Building2 className="h-5 w-5" />,
    iconBg: "from-amber-500 to-orange-600",
    column: "talent",
    route: "ts-corporate-training",
  },
  {
    id: "sourcing",
    title: "Sourcing Talent Recruitment",
    badge: "Talent Sourcing",
    description: "Active & passive candidate sourcing through our 2M+ verified talent pool with simulated AI-driven shortlisting.",
    icon: <Search className="h-5 w-5" />,
    iconBg: "from-cyan-500 to-blue-600",
    column: "workforce",
    route: "talent-search",
  },
  {
    id: "flexible",
    title: "Flexible Talent Deployment",
    badge: "On-Demand Talent",
    description: "Deploy pre-vetted contract & gig talent on-demand for projects ranging from 2 weeks to 24 months.",
    icon: <Layers className="h-5 w-5" />,
    iconBg: "from-teal-500 to-emerald-600",
    column: "workforce",
    comingSoon: true,
  },
  {
    id: "e2e",
    title: "End-to-End Workforce Solutions",
    badge: "Full Lifecycle",
    description: "Full workforce lifecycle — sourcing, training, deployment, performance management & retention in one managed service.",
    icon: <Target className="h-5 w-5" />,
    iconBg: "from-rose-500 to-pink-600",
    column: "workforce",
    comingSoon: true,
  },
  {
    id: "assessment",
    title: "Talent Assessment",
    badge: "AI Assessment",
    description: "Simulated-AI proctored assessments covering aptitude, technical skills, communication & culture-fit — with benchmarked reports.",
    icon: <Brain className="h-5 w-5" />,
    iconBg: "from-indigo-500 to-violet-600",
    column: "assessment",
    comingSoon: true,
  },
  {
    id: "staffing",
    title: "Staffing Solutions",
    badge: "Flexible Staffing",
    description: "Permanent, contract, temp & RPO staffing with SLA-backed fulfillment timelines across 18 industries.",
    icon: <Handshake className="h-5 w-5" />,
    iconBg: "from-orange-500 to-red-600",
    column: "assessment",
    comingSoon: true,
  },
  {
    id: "placements",
    title: "Placements",
    badge: "Career Placement",
    description: "Drive placements for trained cohorts through hiring drives, referral networks & dedicated placement managers.",
    icon: <CheckCircle2 className="h-5 w-5" />,
    iconBg: "from-emerald-500 to-green-600",
    column: "assessment",
    route: "placements",
  },
];

const COLUMN_META: { id: ServiceCardDef["column"]; title: string; subtitle: string; icon: React.ReactNode }[] = [
  {
    id: "talent",
    title: "Talent Development",
    subtitle: "Build the talent you need — train fresh hires or upskill your existing workforce.",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: "workforce",
    title: "Workforce Solutions",
    subtitle: "Sourcing, deployment and end-to-end managed talent services at scale.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "assessment",
    title: "Assessment & Placements",
    subtitle: "Evaluate talent objectively and drive placement outcomes through structured hiring drives.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

export function TsHub() {
  const { navigate } = useNav();

  // KPIs derived from real data
  const activePrograms = talentSolutionPrograms.filter(
    (p) => p.status === "active" || p.status === "in_progress",
  ).length;
  const candidatesTrained = talentSolutionPrograms.reduce((s, p) => s + p.trained, 0);
  const placed = talentSolutionPrograms.reduce((s, p) => s + p.placed, 0);
  const revenue = talentTransactions
    .filter((t) => t.status === "completed" && t.type !== "refund" && t.type !== "trainer_fee" && t.type !== "settlement" && t.type !== "commission" && t.type !== "bonus" && t.type !== "penalty")
    .reduce((s, t) => s + t.amount, 0);

  const handleLearnMore = (svc: ServiceCardDef) => {
    if (svc.comingSoon) {
      toast.info(`${svc.title} is coming soon`, {
        description: "We're putting the finishing touches on this solution. Reach out to your account manager for early access.",
      });
      return;
    }
    if (svc.route) {
      navigate("training", svc.route);
    } else {
      toast.info(`Opening ${svc.title}`);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Talent Solutions Hub"
        description="One platform, three integrated talent services — train fresh hires, upskill your workforce, and run enterprise training programs at scale."
        icon={<Target className="h-6 w-6" />}
        breadcrumbs={[{ label: "Talent Solutions" }, { label: "Hub" }]}
        actions={[
          {
            label: "Book a Consultation",
            variant: "default",
            onClick: () => toast.success("Consultation request sent", { description: "Our solutions team will reach out within 1 business day." }),
          },
          {
            label: "Download Brochure",
            variant: "outline",
            onClick: () => toast.success("Brochure downloaded", { description: "Talent-Solutions-Brochure-2024.pdf saved to your downloads." }),
          },
        ]}
      />

      {/* HERO — gradient */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        <CardContent className="relative p-6 sm:p-10">
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/20">
                <Sparkles className="mr-1 h-3 w-3" /> Integrated Talent Operating System
              </Badge>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Build the workforce you need.<br />Train, hire & deploy at scale.
              </h2>
              <p className="text-emerald-50 text-base sm:text-lg max-w-xl">
                From fresh-graduate train-to-hire programs to enterprise-wide compliance training,
                jobson.id Talent Solutions delivers measurable outcomes backed by 14+ placement partners
                and a 92% placement rate.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="bg-white text-emerald-700 hover:bg-emerald-50"
                  onClick={() => navigate("training", "ts-train-to-hire")}
                >
                  Explore Train-to-Hire <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10"
                  onClick={() => navigate("training", "ts-corporate-training")}
                >
                  Corporate Training
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 self-center">
              <HeroStat label="Active Programs" value={String(activePrograms)} sub="across 4 clients" />
              <HeroStat label="Candidates Trained" value={formatNumber(candidatesTrained)} sub="+12% MoM" />
              <HeroStat label="Candidates Placed" value={formatNumber(placed)} sub="92% placement rate" />
              <HeroStat label="Revenue (FY24)" value={formatCurrency(revenue)} sub="across all solutions" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SOLUTION TYPES — quick links */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(Object.keys(SOLUTION_TYPE_CONFIG) as TalentSolutionType[]).map((st) => {
          const cfg = SOLUTION_TYPE_CONFIG[st];
          const count = talentSolutionPrograms.filter((p) => p.type === st).length;
          const routeMap: Record<TalentSolutionType, string> = {
            TRAIN_TO_HIRE: "ts-train-to-hire",
            HIRE_TO_TRAIN: "ts-hire-to-train",
            CORPORATE_TRAINING: "ts-corporate-training",
          };
          return (
            <Card
              key={st}
              className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
              onClick={() => navigate("training", routeMap[st])}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                  style={{ background: cfg.color }}
                >
                  <Icon name={cfg.icon} className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="border-brand/30 bg-brand/5 text-brand">
                  {cfg.shortLabel}
                </Badge>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{cfg.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{cfg.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{count} active programs</span>
                <span className="inline-flex items-center gap-1 font-medium text-brand group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* 3-COLUMN SERVICES GRID */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Our Services</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Nine integrated services across talent development, workforce solutions, and assessment & placements.
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">{SERVICES.length} services</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {COLUMN_META.map((col) => (
            <div key={col.id} className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-brand/20 bg-brand/5 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-primary-foreground">
                  {col.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{col.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{col.subtitle}</p>
                </div>
              </div>
              <div className="space-y-4">
                {SERVICES.filter((s) => s.column === col.id).map((svc) => (
                  <Card
                    key={svc.id}
                    className="group p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${svc.iconBg} text-white shadow-sm`}>
                        {svc.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold">{svc.title}</h4>
                          <Badge variant="secondary" className="text-[10px]">{svc.badge}</Badge>
                          {svc.comingSoon && (
                            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]">Soon</Badge>
                          )}
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">{svc.description}</p>
                        <button
                          onClick={() => handleLearnMore(svc)}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand hover:gap-2 transition-all"
                        >
                          Learn more <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUTCOMES & KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active Programs"
          value={activePrograms}
          hint="across T2H, H2T, Corp"
          icon={<Target className="h-5 w-5" />}
          tone="brand"
        />
        <StatCard
          label="Candidates Trained"
          value={formatNumber(candidatesTrained)}
          delta={{ value: "12% MoM", positive: true }}
          icon={<GraduationCap className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Candidates Placed"
          value={formatNumber(placed)}
          hint="92% placement rate"
          icon={<UserCheck className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Solution Revenue"
          value={formatCurrency(revenue)}
          delta={{ value: "8.4% QoQ", positive: true }}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="brand"
        />
      </section>

      {/* RECENT PROGRAMS PREVIEW */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recent Programs</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("training", "ts-train-to-hire")}>
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {talentSolutionPrograms.slice(0, 6).map((p) => {
            const cfg = SOLUTION_TYPE_CONFIG[p.type];
            const routeMap: Record<TalentSolutionType, string> = {
              TRAIN_TO_HIRE: "ts-train-to-hire",
              HIRE_TO_TRAIN: "ts-hire-to-train",
              CORPORATE_TRAINING: "ts-corporate-training",
            };
            return (
              <Card
                key={p.id}
                className="cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                onClick={() => navigate("training", routeMap[p.type])}
              >
                <div className="flex items-start justify-between">
                  <AvatarLogo text={p.clientName} size="sm" />
                  <Badge variant="outline" className="text-[10px]" style={{ color: cfg.color, borderColor: `${cfg.color}40` }}>
                    {cfg.shortLabel}
                  </Badge>
                </div>
                <h4 className="mt-3 text-sm font-semibold leading-tight line-clamp-2">{p.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{p.clientName}</p>
                <div className="mt-3 flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{p.trained}/{p.enrolled} trained</span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-wide text-emerald-50/80">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs text-emerald-50/70">{sub}</p>
    </div>
  );
}
