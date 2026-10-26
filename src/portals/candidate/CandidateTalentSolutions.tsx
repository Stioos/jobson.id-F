"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap,
  UserCheck,
  Building2,
  Search,
  ArrowRight,
  Award,
  Users,
  TrendingUp,
  Wallet,
  Clock,
  MapPin,
  CheckCircle2,
  Briefcase,
  Sparkles,
} from "lucide-react";
import {
  talentSolutionPrograms,
  SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionType, TalentSolutionProgram } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useNav } from "@/lib/store";

const TYPE_ICON: Record<TalentSolutionType, React.ReactNode> = {
  TRAIN_TO_HIRE: <GraduationCap className="h-4 w-4" />,
  HIRE_TO_TRAIN: <UserCheck className="h-4 w-4" />,
  CORPORATE_TRAINING: <Building2 className="h-4 w-4" />,
};

export function CandidateTalentSolutions() {
  const { navigate } = useNav();
  const [tab, setTab] = React.useState<"TRAIN_TO_HIRE" | "HIRE_TO_TRAIN" | "CORPORATE_TRAINING">("TRAIN_TO_HIRE");
  const [search, setSearch] = React.useState("");
  const [cityFilter, setCityFilter] = React.useState<string>("all");
  const [applyProgram, setApplyProgram] = React.useState<TalentSolutionProgram | null>(null);
  const [coverNote, setCoverNote] = React.useState("");

  // T2H programs accepting applications (active or in_progress + not completed)
  const t2hPrograms = talentSolutionPrograms.filter(
    (p) => p.type === "TRAIN_TO_HIRE" && (p.status === "active" || p.status === "in_progress")
  );
  // H2T opportunities — companies hiring + training (active/in_progress)
  const h2tPrograms = talentSolutionPrograms.filter(
    (p) => p.type === "HIRE_TO_TRAIN" && (p.status === "active" || p.status === "in_progress")
  );
  // Corporate training programs available for individual enrollment (active/in_progress)
  const corpPrograms = talentSolutionPrograms.filter(
    (p) => p.type === "CORPORATE_TRAINING" && (p.status === "active" || p.status === "in_progress")
  );

  // KPIs
  const programsAvailable = t2hPrograms.length + h2tPrograms.length + corpPrograms.length;
  const placementRollup = talentSolutionPrograms
    .filter((p) => p.type === "TRAIN_TO_HIRE" && p.status === "completed")
    .map((p) => (p.trained > 0 ? (p.placed / p.trained) * 100 : 0));
  const avgPlacementRate = placementRollup.length > 0
    ? Math.round(placementRollup.reduce((s, x) => s + x, 0) / placementRollup.length)
    : 0;
  const avgSalary = 8.4; // LPA — derived from T2H role benchmarks

  // Filter
  const cityOptions = Array.from(
    new Set(
      talentSolutionPrograms
        .map((p) => p.clientName.split(" ")[0])
        .filter(Boolean)
    )
  );

  const filterBySearch = (list: TalentSolutionProgram[]) =>
    list.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.clientName.toLowerCase().includes(q) &&
          !p.programCurriculum.some((c) => c.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });

  const visibleT2H = filterBySearch(t2hPrograms);
  const visibleH2T = filterBySearch(h2tPrograms);
  const visibleCorp = filterBySearch(corpPrograms);

  const handleApply = () => {
    if (!applyProgram) return;
    toast.success("Application submitted", {
      description: `Your application for "${applyProgram.name}" has been received. The program team will review and respond within 5 business days.`,
    });
    setApplyProgram(null);
    setCoverNote("");
  };

  const handleEnrollCorp = (p: TalentSolutionProgram) => {
    toast.success("Enrollment request submitted", {
      description: `Individual enrollment for "${p.name}" requested. Our admissions team will reach out to confirm your seat.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Solutions"
        description="Industry-aligned training programs that lead to guaranteed placement — Train-to-Hire, Hire-to-Train, and Corporate Training tracks built for your career goals."
        breadcrumbs={[
          { label: "Candidate", onClick: () => navigate("candidate", "overview") },
          { label: "Talent Solutions" },
        ]}
        actions={[
          {
            label: "My Programs",
            variant: "outline",
            onClick: () => navigate("candidate", "ts-my-programs"),
          },
        ]}
        icon={<Sparkles className="h-6 w-6" />}
      />

      {/* Hero / KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Programs Available"
          value={programsAvailable}
          icon={<Briefcase className="h-5 w-5" />}
          tone="brand"
          hint="Accepting applications now"
        />
        <StatCard
          label="Avg Placement Rate"
          value={`${avgPlacementRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="success"
          hint="Across completed T2H batches"
        />
        <StatCard
          label="Avg Starting Salary"
          value={`₹${avgSalary.toFixed(1)} LPA`}
          icon={<Wallet className="h-5 w-5" />}
          tone="brand"
          hint="For placed T2H candidates"
        />
        <StatCard
          label="Hiring Partners"
          value={new Set(talentSolutionPrograms.map((p) => p.clientName)).size}
          icon={<Building2 className="h-5 w-5" />}
          tone="brand"
          hint="Enterprises hiring trained talent"
        />
      </div>

      {/* Search + Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by program, company, or skill (e.g. React, DevOps, leadership)…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
              {cityOptions.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Solution Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="TRAIN_TO_HIRE" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Train to Hire</span>
            <span className="sm:hidden">T2H</span>
          </TabsTrigger>
          <TabsTrigger value="HIRE_TO_TRAIN" className="gap-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Hire to Train</span>
            <span className="sm:hidden">H2T</span>
          </TabsTrigger>
          <TabsTrigger value="CORPORATE_TRAINING" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Corporate Training</span>
            <span className="sm:hidden">Corp</span>
          </TabsTrigger>
        </TabsList>

        {/* T2H */}
        <TabsContent value="TRAIN_TO_HIRE" className="mt-4 space-y-4">
          <SolutionIntro type="TRAIN_TO_HIRE" />
          {visibleT2H.length === 0 ? (
            <EmptyState
              icon={<GraduationCap className="h-5 w-5" />}
              title="No matching programs"
              description="Try adjusting your search to find more Train-to-Hire opportunities."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleT2H.map((p) => (
                <ProgramCard key={p.id} program={p} ctaLabel="Apply now" onCta={() => setApplyProgram(p)} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* H2T */}
        <TabsContent value="HIRE_TO_TRAIN" className="mt-4 space-y-4">
          <SolutionIntro type="HIRE_TO_TRAIN" />
          {visibleH2T.length === 0 ? (
            <EmptyState
              icon={<UserCheck className="h-5 w-5" />}
              title="No matching opportunities"
              description="Try adjusting your search to find more Hire-to-Train opportunities."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleH2T.map((p) => (
                <ProgramCard
                  key={p.id}
                  program={p}
                  ctaLabel="Express interest"
                  onCta={() => {
                    toast.success("Interest registered", {
                      description: `We'll notify you when ${p.clientName} opens interviews for this role.`,
                    });
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Corporate Training */}
        <TabsContent value="CORPORATE_TRAINING" className="mt-4 space-y-4">
          <SolutionIntro type="CORPORATE_TRAINING" />
          {visibleCorp.length === 0 ? (
            <EmptyState
              icon={<Building2 className="h-5 w-5" />}
              title="No corporate training available"
              description="Try adjusting your search to find more corporate training programs."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleCorp.map((p) => (
                <ProgramCard
                  key={p.id}
                  program={p}
                  ctaLabel="Enroll individually"
                  onCta={() => handleEnrollCorp(p)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* How it works */}
      <SectionCard
        title="How Talent Solutions works"
        description="A structured path from application to a guaranteed role."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "1", title: "Apply & Screen", desc: "Submit your application. Our counsellors screen for aptitude, motivation, and baseline skills.", icon: <Search className="h-5 w-5" /> },
            { step: "2", title: "Train & Certify", desc: "Complete an industry-aligned curriculum delivered by expert trainers. Earn a recognized certification.", icon: <GraduationCap className="h-5 w-5" /> },
            { step: "3", title: "Placement", desc: "Get placed with the hiring partner. Most T2H programs include a placement guarantee in writing.", icon: <CheckCircle2 className="h-5 w-5" /> },
          ].map((s) => (
            <Card key={s.step} className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">{s.icon}</div>
                <div className="text-sm font-semibold text-muted-foreground">Step {s.step}</div>
              </div>
              <CardTitle className="mt-3 text-base">{s.title}</CardTitle>
              <CardDescription className="mt-1">{s.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Apply Dialog */}
      <Dialog open={!!applyProgram} onOpenChange={(o) => !o && setApplyProgram(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply to talent solution program</DialogTitle>
            <DialogDescription>
              Submit your application. Our program team will reach out within 5 business days.
            </DialogDescription>
          </DialogHeader>
          {applyProgram && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                  <AvatarLogo text={applyProgram.clientLogo} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{applyProgram.name}</p>
                    <p className="text-xs text-muted-foreground">{applyProgram.clientName}</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cover-note">Cover note (optional)</Label>
                <Textarea
                  id="cover-note"
                  placeholder="Why are you interested in this program? What relevant background do you bring?"
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
              </div>
              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Program timeline
                </div>
                <div className="mt-1">
                  {formatDate(applyProgram.startDate)} → {formatDate(applyProgram.endDate)} ·{" "}
                  {applyProgram.targetCandidates} seats
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyProgram(null)}>Cancel</Button>
            <Button onClick={handleApply}>
              Submit application
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// Solution intro banner
// ============================================================
function SolutionIntro({ type }: { type: TalentSolutionType }) {
  const cfg = SOLUTION_TYPE_CONFIG[type];
  return (
    <Card className="overflow-hidden">
      <div
        className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: `linear-gradient(135deg, ${cfg.color}22 0%, transparent 60%)` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-lg"
            style={{ background: `${cfg.color}22`, color: cfg.color }}
          >
            {TYPE_ICON[type]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">{cfg.label}</h3>
              <Badge variant="outline" className="text-xs">{cfg.badge}</Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{cfg.description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// Program card
// ============================================================
function ProgramCard({
  program,
  ctaLabel,
  onCta,
}: {
  program: TalentSolutionProgram;
  ctaLabel: string;
  onCta: () => void;
}) {
  const cfg = SOLUTION_TYPE_CONFIG[program.type];
  const progress =
    program.targetCandidates > 0
      ? Math.round((program.trained / program.targetCandidates) * 100)
      : 0;
  const seatsLeft = Math.max(0, program.targetCandidates - program.enrolled);

  return (
    <Card className="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <AvatarLogo text={program.clientLogo} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{program.clientName}</p>
            <p className="text-xs text-muted-foreground">{cfg.shortLabel} · {cfg.badge}</p>
          </div>
        </div>
        <StatusBadge status={program.status} />
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold">{program.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{program.description}</p>

      {/* Curriculum */}
      <div className="mt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Curriculum</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {program.programCurriculum.slice(0, 4).map((c) => (
            <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
          ))}
          {program.programCurriculum.length > 4 && (
            <Badge variant="outline" className="text-xs">+{program.programCurriculum.length - 4}</Badge>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Award className="h-3.5 w-3.5 text-brand" />
        <span className="truncate">{program.certifications[0]}</span>
      </div>

      {/* Schedule & seats */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border p-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            Duration
          </div>
          <p className="mt-0.5 font-medium">
            {formatDate(program.startDate, { month: "short", day: "numeric" })} – {formatDate(program.endDate, { month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="rounded-md border p-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            Seats left
          </div>
          <p className="mt-0.5 font-medium">{seatsLeft} of {program.targetCandidates}</p>
        </div>
      </div>

      {/* Progress (if in_progress) */}
      {program.status === "in_progress" && program.trained > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Trained so far</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-1 h-1.5" />
        </div>
      )}

      {/* CTA */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {program.hiringRoles?.[0] ?? "Open to all"}
        </span>
        <Button size="sm" onClick={onCta}>
          {ctaLabel}
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
