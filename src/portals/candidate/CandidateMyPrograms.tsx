"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GraduationCap,
  Award,
  Calendar,
  User,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Briefcase,
  Trophy,
} from "lucide-react";
import {
  talentSolutionPrograms,
  SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionProgram } from "@/lib/talent-solutions-types";
import { formatDate, formatDateTime } from "@/lib/format";
import { useNav } from "@/lib/store";

// ============================================================
// Synthesized enrollment for the logged-in candidate
// (Priya Nair — derived from real TSP programs)
// ============================================================
interface CandidateEnrollment {
  program: TalentSolutionProgram;
  enrolledAt: string;
  progress: number; // 0-100
  placementStatus: "not_started" | "in_progress" | "offered" | "placed" | "n_a";
  schedule: string;
  nextMilestone: string;
}

const ENROLLED_PROGRAM_IDS = ["tsp_001", "tsp_005", "tsp_008", "tsp_003"];

const ENROLLMENTS: CandidateEnrollment[] = ENROLLED_PROGRAM_IDS
  .map((id, idx) => {
    const program = talentSolutionPrograms.find((p) => p.id === id);
    if (!program) return null;
    const progressMap: Record<string, number> = {
      tsp_001: 42,
      tsp_005: 68,
      tsp_008: 85,
      tsp_003: 100,
    };
    const placementMap: Record<string, CandidateEnrollment["placementStatus"]> = {
      tsp_001: "in_progress",
      tsp_005: "n_a", // H2T — placement not applicable (already hired)
      tsp_008: "n_a", // Corporate training
      tsp_003: "placed",
    };
    const scheduleMap: Record<string, string> = {
      tsp_001: "Mon–Fri · 9:00 AM – 1:00 PM · Online + Chennai Lab",
      tsp_005: "Sat–Sun · 10:00 AM – 5:00 PM · TechCorp Bengaluru",
      tsp_008: "Tue & Thu · 6:00 PM – 8:00 PM · Online",
      tsp_003: "Mon–Fri · 9:00 AM – 6:00 PM · Completed",
    };
    const milestoneMap: Record<string, string> = {
      tsp_001: "Capstone project demo · Dec 15",
      tsp_005: "Go microservice deployment · Nov 28",
      tsp_008: "Leadership 360 review · Nov 30",
      tsp_003: "Placement drive completed · Aug 22",
    };
    const enrolledAtMap: Record<string, string> = {
      tsp_001: new Date(Date.now() - 30 * 86400000).toISOString(),
      tsp_005: new Date(Date.now() - 75 * 86400000).toISOString(),
      tsp_008: new Date(Date.now() - 90 * 86400000).toISOString(),
      tsp_003: new Date(Date.now() - 180 * 86400000).toISOString(),
    };
    return {
      program,
      enrolledAt: enrolledAtMap[id],
      progress: progressMap[id] ?? (idx * 25),
      placementStatus: placementMap[id],
      schedule: scheduleMap[id],
      nextMilestone: milestoneMap[id],
    } as CandidateEnrollment;
  })
  .filter((x): x is CandidateEnrollment => x !== null);

const PLACEMENT_LABEL: Record<CandidateEnrollment["placementStatus"], string> = {
  not_started: "Not started",
  in_progress: "In progress",
  offered: "Offer received",
  placed: "Placed",
  n_a: "Not applicable",
};

export function CandidateMyPrograms() {
  const { navigate } = useNav();
  const [tab, setTab] = React.useState<"active" | "completed" | "all">("active");
  const [selected, setSelected] = React.useState<CandidateEnrollment | null>(null);

  const filtered = React.useMemo(() => {
    if (tab === "active") return ENROLLMENTS.filter((e) => e.program.status !== "completed" && e.progress < 100);
    if (tab === "completed") return ENROLLMENTS.filter((e) => e.progress === 100 || e.program.status === "completed");
    return ENROLLMENTS;
  }, [tab]);

  // KPIs
  const activeCount = ENROLLMENTS.filter((e) => e.progress < 100).length;
  const completedCount = ENROLLMENTS.filter((e) => e.progress === 100).length;
  const certsEarned = ENROLLMENTS.filter((e) => e.progress === 100).reduce(
    (s, e) => s + e.program.certifications.length,
    0
  );
  const avgProgress = ENROLLMENTS.length > 0
    ? Math.round(ENROLLMENTS.reduce((s, e) => s + e.progress, 0) / ENROLLMENTS.length)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Talent Solution Programs"
        description="Track your progress, certifications, and placement status across all Talent Solution programs you're enrolled in."
        breadcrumbs={[
          { label: "Candidate", onClick: () => navigate("candidate", "overview") },
          { label: "Talent Solutions", onClick: () => navigate("candidate", "ts-hub") },
          { label: "My Programs" },
        ]}
        actions={[
          {
            label: "Browse more",
            variant: "outline",
            onClick: () => navigate("candidate", "ts-hub"),
          },
        ]}
        icon={<GraduationCap className="h-6 w-6" />}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Programs" value={activeCount} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Completed" value={completedCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Certificates Earned" value={certsEarned} icon={<Award className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg Progress" value={`${avgProgress}%`} icon={<TrendingUp className="h-5 w-5" />} tone="brand" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
          <TabsTrigger value="all">All ({ENROLLMENTS.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="h-5 w-5" />}
              title="No programs here yet"
              description="Browse the Talent Solutions hub to find and enroll in programs."
              action={<Button onClick={() => navigate("candidate", "ts-hub")}>Browse programs</Button>}
            />
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="w-44">Progress</TableHead>
                    <TableHead className="hidden lg:table-cell">Trainer</TableHead>
                    <TableHead className="hidden xl:table-cell">Schedule</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => {
                    const cfg = SOLUTION_TYPE_CONFIG[e.program.type];
                    return (
                      <TableRow
                        key={e.program.id}
                        className="cursor-pointer hover:bg-muted/40"
                        onClick={() => setSelected(e)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AvatarLogo text={e.program.clientLogo} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{e.program.name}</p>
                              <p className="text-xs text-muted-foreground">Enrolled {formatDate(e.enrolledAt)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{cfg.shortLabel}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{e.program.clientName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <StatusBadge status={e.program.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={e.progress} className="h-1.5 w-20" />
                            <span className="text-xs font-medium">{e.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{e.program.trainer}</TableCell>
                        <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{e.schedule}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={(ev) => { ev.stopPropagation(); setSelected(e); }}>
                            View
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <AvatarLogo text={selected.program.clientLogo} size="md" />
                  <div>
                    <SheetTitle className="text-left">{selected.program.name}</SheetTitle>
                    <SheetDescription className="text-left">
                      {selected.program.clientName} · {SOLUTION_TYPE_CONFIG[selected.program.type].label}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                {/* Progress */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Your progress</p>
                    <span className="text-2xl font-bold text-brand">{selected.progress}%</span>
                  </div>
                  <Progress value={selected.progress} className="mt-2 h-2" />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Enrolled {formatDate(selected.enrolledAt)}</span>
                    <span>Next: {selected.nextMilestone}</span>
                  </div>
                </Card>

                {/* Quick facts */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" /> Trainer
                    </div>
                    <p className="mt-1 text-sm font-medium">{selected.program.trainer}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> Schedule
                    </div>
                    <p className="mt-1 text-xs font-medium">{selected.schedule}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Duration
                    </div>
                    <p className="mt-1 text-xs font-medium">
                      {formatDate(selected.program.startDate)} → {formatDate(selected.program.endDate)}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Trophy className="h-3.5 w-3.5" /> Placement
                    </div>
                    <p className="mt-1 text-xs font-medium">{PLACEMENT_LABEL[selected.placementStatus]}</p>
                  </div>
                </div>

                {/* Curriculum */}
                <SectionCard title="Curriculum modules">
                  <ol className="space-y-2">
                    {selected.program.programCurriculum.map((c, i) => {
                      const moduleProgress =
                        selected.progress === 100 ? 100 :
                        i / selected.program.programCurriculum.length * 100 < selected.progress ? 100 :
                        (i + 1) / selected.program.programCurriculum.length * 100 <= selected.progress ? 100 : 0;
                      return (
                        <li key={c} className="flex items-center gap-2 rounded-md border p-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${moduleProgress === 100 ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                            {moduleProgress === 100 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                          </div>
                          <span className="text-sm">{c}</span>
                        </li>
                      );
                    })}
                  </ol>
                </SectionCard>

                {/* Certifications */}
                <SectionCard title="Certifications">
                  <div className="space-y-2">
                    {selected.program.certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-2 rounded-md border p-2">
                        <Award className="h-4 w-4 text-brand" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{cert}</p>
                          <p className="text-xs text-muted-foreground">
                            {selected.progress === 100 ? "Issued" : "Issued on completion"}
                          </p>
                        </div>
                        {selected.progress === 100 && (
                          <Button size="sm" variant="outline" onClick={() => toast.success("Certificate downloaded", { description: cert })}>
                            Download
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>

                {/* Placement */}
                {selected.program.type === "TRAIN_TO_HIRE" && (
                  <SectionCard title="Placement status">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="text-sm font-medium">Placement status</p>
                          <p className="text-xs text-muted-foreground">{PLACEMENT_LABEL[selected.placementStatus]}</p>
                        </div>
                        <StatusBadge status={selected.placementStatus === "placed" ? "completed" : selected.placementStatus === "in_progress" ? "in_progress" : "pending"} />
                      </div>
                      {selected.program.hiringRoles && (
                        <div className="rounded-md border p-3">
                          <p className="text-xs text-muted-foreground">Hiring role</p>
                          <p className="text-sm font-medium">{selected.program.hiringRoles[0]}</p>
                          {selected.program.guaranteedPlacements && (
                            <p className="mt-1 text-xs text-emerald-600">✓ Placement guarantee: {selected.program.guaranteedPlacements} seats</p>
                          )}
                        </div>
                      )}
                    </div>
                  </SectionCard>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => toast.success("Opening learning portal…", { description: selected.program.name })}>
                    Continue learning
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => navigate("candidate", "ts-transactions")}>
                    View transactions
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
