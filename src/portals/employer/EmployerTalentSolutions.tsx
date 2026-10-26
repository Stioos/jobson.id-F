"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  StatCard,
  StatusBadge,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  UserCheck,
  Building2,
  ArrowRight,
  Users,
  Briefcase,
  Wallet,
  CheckCircle2,
  Target,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import {
  talentSolutionPrograms,
  talentTransactions,
  SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionType } from "@/lib/talent-solutions-types";
import { formatCurrency } from "@/lib/format";
import { useNav } from "@/lib/store";

const EMPLOYER_NAME = "TechCorp India";

const SOLUTION_CARDS: Array<{
  type: TalentSolutionType;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
}> = [
  {
    type: "TRAIN_TO_HIRE",
    title: "Train to Hire",
    subtitle: "Train fresh talent, then hire them.",
    bullets: [
      "We design a curriculum aligned to your stack",
      "Train candidates in cohorts of 10–30",
      "Guaranteed placements — pay only for trained hires",
      "Avg ramp-up time: 90 days to productivity",
    ],
    cta: "Build a T2H program",
  },
  {
    type: "HIRE_TO_TRAIN",
    title: "Hire to Train",
    subtitle: "Upskill your existing hires.",
    bullets: [
      "You hire — we train for your project stack",
      "Bridges the gap between hiring and project readiness",
      "Customized tracks per team/department",
      "Reduces onboarding time by 60%",
    ],
    cta: "Plan an H2T track",
  },
  {
    type: "CORPORATE_TRAINING",
    title: "Corporate Training",
    subtitle: "Upskill your entire workforce.",
    bullets: [
      "Custom training programs for any department",
      "Technology, leadership, compliance tracks",
      "Cohort or self-paced delivery models",
      "Track ROI with our analytics dashboard",
    ],
    cta: "Design a training program",
  },
];

export function EmployerTalentSolutions() {
  const { navigate } = useNav();
  const [getStarted, setGetStarted] = React.useState<TalentSolutionType | null>(null);
  const [programName, setProgramName] = React.useState("");
  const [targetCandidates, setTargetCandidates] = React.useState("20");
  const [budget, setBudget] = React.useState("");
  const [timeline, setTimeline] = React.useState("12 weeks");

  // Employer-specific KPIs — TechCorp India
  const employerPrograms = talentSolutionPrograms.filter((p) => p.clientName === EMPLOYER_NAME);
  const activeCount = employerPrograms.filter((p) => p.status === "active" || p.status === "in_progress").length;
  const candidatesInPipeline = employerPrograms.reduce((s, p) => s + p.enrolled, 0);
  const totalInvestment = employerPrograms.reduce((s, p) => s + p.spent, 0);
  const placedCount = employerPrograms.reduce((s, p) => s + p.placed, 0);

  // Recent transactions
  const recentTxns = talentTransactions
    .filter((t) => t.payer === EMPLOYER_NAME)
    .slice(0, 5);

  const handleGetStarted = () => {
    if (!getStarted) return;
    if (!programName.trim()) {
      toast.error("Please name your program");
      return;
    }
    toast.success("Program brief created", {
      description: `"${programName}" — our solutions team will reach out within 1 business day to finalize details.`,
    });
    setGetStarted(null);
    setProgramName("");
    setBudget("");
    navigate("employer", "ts-programs");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Solutions"
        description="Hire trained talent, upskill your existing hires, and train your entire workforce — three solution types designed to close your skills gap."
        breadcrumbs={[
          { label: "Employer", onClick: () => navigate("employer", "overview") },
          { label: "Talent Solutions" },
        ]}
        actions={[
          {
            label: "View Programs",
            variant: "outline",
            onClick: () => navigate("employer", "ts-programs"),
          },
        ]}
        icon={<Sparkles className="h-6 w-6" />}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Programs" value={activeCount} icon={<Briefcase className="h-5 w-5" />} tone="brand" hint="Across T2H, H2T & Corp" />
        <StatCard label="Candidates in Pipeline" value={candidatesInPipeline} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Candidates Placed" value={placedCount} icon={<Trophy className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Investment" value={formatCurrency(totalInvestment)} icon={<Wallet className="h-5 w-5" />} tone="brand" />
      </div>

      {/* Solution cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {SOLUTION_CARDS.map((s) => {
          const cfg = SOLUTION_TYPE_CONFIG[s.type];
          const count = employerPrograms.filter((p) => p.type === s.type).length;
          return (
            <Card key={s.type} className="flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
              <div className="flex items-center justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ background: `${cfg.color}22`, color: cfg.color }}
                >
                  {s.type === "TRAIN_TO_HIRE" ? <GraduationCap className="h-6 w-6" /> : s.type === "HIRE_TO_TRAIN" ? <UserCheck className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                </div>
                <Badge variant="outline" className="text-xs">
                  {count > 0 ? `${count} active` : "New"}
                </Badge>
              </div>
              <CardTitle className="mt-4 text-lg">{s.title}</CardTitle>
              <CardDescription className="mt-1">{s.subtitle}</CardDescription>

              <ul className="mt-4 flex-1 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setGetStarted(s.type)}
                >
                  {s.cta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Why talent solutions */}
      <SectionCard
        title="Why Talent Solutions"
        description="The numbers that matter to your talent strategy."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Target className="h-5 w-5" />, label: "Placement guarantee", value: "100%", desc: "For T2H seats backed by SLA" },
            { icon: <TrendingUp className="h-5 w-5" />, label: "Ramp-up speed", value: "60% faster", desc: "Vs. traditional hiring" },
            { icon: <Users className="h-5 w-5" />, label: "Avg cohort size", value: "20–30", desc: "Optimal for trainer attention" },
            { icon: <Wallet className="h-5 w-5" />, label: "Cost per hire", value: "↓ 35%", desc: "Vs. agency recruitment fees" },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">{s.icon}</div>
              <CardTitle className="mt-3 text-2xl">{s.value}</CardTitle>
              <CardDescription className="mt-1">{s.label}</CardDescription>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Recent transactions snapshot */}
      <SectionCard
        title="Recent transactions"
        description="Latest payments from your organization"
        action={<Button variant="ghost" size="sm" onClick={() => navigate("employer", "ts-transactions")}>View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>}
      >
        {recentTxns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent transactions.</p>
        ) : (
          <div className="space-y-2">
            {recentTxns.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <AvatarLogo text={t.programId?.slice(0, 2).toUpperCase() ?? "TX"} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{t.transactionNumber} · {t.programName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(t.amount)}</p>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Get started dialog */}
      <Dialog open={!!getStarted} onOpenChange={(o) => !o && setGetStarted(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {getStarted && (
                <div className="flex items-center gap-2">
                  <Icon name={SOLUTION_TYPE_CONFIG[getStarted].icon} className="h-5 w-5" />
                  {SOLUTION_TYPE_CONFIG[getStarted].label}
                </div>
              )}
            </DialogTitle>
            <DialogDescription>
              Tell us about your program — our solutions team will reach out to finalize the curriculum, schedule, and commercial terms.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="pg-name">Program name</Label>
              <Input id="pg-name" placeholder="e.g. Q1 Backend Engineers T2H Batch" value={programName} onChange={(e) => setProgramName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="pg-target">Target candidates</Label>
                <Input id="pg-target" type="number" value={targetCandidates} onChange={(e) => setTargetCandidates(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pg-budget">Budget (₹)</Label>
                <Input id="pg-budget" type="number" placeholder="1500000" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pg-timeline">Timeline</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger id="pg-timeline"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="6 weeks">6 weeks (express)</SelectItem>
                  <SelectItem value="12 weeks">12 weeks (standard)</SelectItem>
                  <SelectItem value="16 weeks">16 weeks (deep)</SelectItem>
                  <SelectItem value="24 weeks">24 weeks (immersive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pg-notes">Notes (optional)</Label>
              <Textarea id="pg-notes" rows={3} placeholder="Stack, hiring roles, locations, constraints…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGetStarted(null)}>Cancel</Button>
            <Button onClick={handleGetStarted}>
              Submit brief
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
