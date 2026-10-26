"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GraduationCap,
  UserCheck,
  Building2,
  Search,
  Plus,
  Users,
  Trophy,
  Wallet,
  ArrowRight,
  Calendar,
  User,
  Briefcase,
  CheckCircle2,
  Percent,
  TrendingUp,
} from "lucide-react";
import {
  talentSolutionPrograms,
  talentTransactions,
  SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionProgram, TalentSolutionType } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useNav } from "@/lib/store";

// ============================================================
// Partner programs — Chennai Tech Academy is the delivery partner.
// Derive partner relationship from talentTransactions: settlements where payee = "Chennai Tech Academy".
// Augment with synthesized partner-share %.
// ============================================================
const PARTNER_NAME = "Chennai Tech Academy";

interface PartnerProgram extends TalentSolutionProgram {
  partnerSharePct: number;
  partnerRevenue: number;
  partnerRole: "delivery" | "co-delivery" | "sourcing";
}

const PARTNER_PROGRAM_IDS = ["tsp_001", "tsp_002", "tsp_003", "tsp_008", "tsp_011"];

const PARTNER_PROGRAMS: PartnerProgram[] = PARTNER_PROGRAM_IDS
  .map((id) => {
    const program = talentSolutionPrograms.find((p) => p.id === id);
    if (!program) return null;
    const shareMap: Record<string, number> = {
      tsp_001: 70,
      tsp_002: 65,
      tsp_003: 70,
      tsp_008: 60,
      tsp_011: 70,
    };
    const roleMap: Record<string, PartnerProgram["partnerRole"]> = {
      tsp_001: "delivery",
      tsp_002: "delivery",
      tsp_003: "delivery",
      tsp_008: "co-delivery",
      tsp_011: "sourcing",
    };
    const sharePct = shareMap[id] ?? 65;
    return {
      ...program,
      partnerSharePct: sharePct,
      partnerRevenue: Math.round(program.spent * sharePct / 100),
      partnerRole: roleMap[id] ?? "delivery",
    } as PartnerProgram;
  })
  .filter((x): x is PartnerProgram => x !== null);

const ROLE_LABELS: Record<PartnerProgram["partnerRole"], string> = {
  delivery: "Delivery",
  "co-delivery": "Co-Delivery",
  sourcing: "Sourcing",
};

const TYPE_ICON: Record<TalentSolutionType, React.ReactNode> = {
  TRAIN_TO_HIRE: <GraduationCap className="h-4 w-4" />,
  HIRE_TO_TRAIN: <UserCheck className="h-4 w-4" />,
  CORPORATE_TRAINING: <Building2 className="h-4 w-4" />,
};

export function PartnerTalentSolutions() {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<PartnerProgram | null>(null);

  const filtered = React.useMemo(() => {
    return PARTNER_PROGRAMS.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.clientName.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, typeFilter]);

  // KPIs
  const activeCount = PARTNER_PROGRAMS.filter((p) => p.status === "active" || p.status === "in_progress").length;
  const candidatesTrained = PARTNER_PROGRAMS.reduce((s, p) => s + p.trained, 0);
  const placements = PARTNER_PROGRAMS.reduce((s, p) => s + p.placed, 0);
  const totalRevenue = PARTNER_PROGRAMS.reduce((s, p) => s + p.partnerRevenue, 0);

  // Group by solution type for the role-in-each-type summary
  const byType = React.useMemo(() => {
    const groups: Record<string, PartnerProgram[]> = { TRAIN_TO_HIRE: [], HIRE_TO_TRAIN: [], CORPORATE_TRAINING: [] };
    PARTNER_PROGRAMS.forEach((p) => groups[p.type].push(p));
    return groups;
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Solutions"
        description="All Talent Solution programs you deliver as a partner — Train-to-Hire, Hire-to-Train, and Corporate Training engagements with enterprise clients."
        breadcrumbs={[
          { label: "Partner", onClick: () => navigate("partner", "overview") },
          { label: "Talent Solutions" },
        ]}
        actions={[
          {
            label: "Transactions",
            variant: "outline",
            onClick: () => navigate("partner", "ts-transactions"),
          },
          {
            label: "Create program",
            variant: "default",
            onClick: () => toast.success("Opening program builder…", { description: "Define curriculum, schedule, and pricing for a new cohort." }),
          },
        ]}
        icon={<GraduationCap className="h-6 w-6" />}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Programs" value={activeCount} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Candidates Trained" value={candidatesTrained} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Placements" value={placements} icon={<Trophy className="h-5 w-5" />} tone="success" />
        <StatCard label="Partner Revenue" value={formatCurrency(totalRevenue)} icon={<Wallet className="h-5 w-5" />} tone="brand" hint="From all programs" />
      </div>

      {/* Partner's role in each solution type */}
      <SectionCard title="Your role in each solution type" description="How Chennai Tech Academy participates in each kind of Talent Solution.">
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(SOLUTION_TYPE_CONFIG) as TalentSolutionType[]).map((type) => {
            const cfg = SOLUTION_TYPE_CONFIG[type];
            const programsOfType = byType[type] ?? [];
            const trained = programsOfType.reduce((s, p) => s + p.trained, 0);
            const revenue = programsOfType.reduce((s, p) => s + p.partnerRevenue, 0);
            const role = type === "CORPORATE_TRAINING" ? "Co-Delivery" : "Delivery Partner";
            return (
              <Card key={type} className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-lg"
                    style={{ background: `${cfg.color}22`, color: cfg.color }}
                  >
                    {TYPE_ICON[type]}
                  </div>
                  <Badge variant="outline" className="text-xs">{role}</Badge>
                </div>
                <h3 className="mt-3 text-base font-semibold">{cfg.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{cfg.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border p-2">
                    <p className="text-muted-foreground">Programs</p>
                    <p className="mt-0.5 text-base font-semibold">{programsOfType.length}</p>
                  </div>
                  <div className="rounded-md border p-2">
                    <p className="text-muted-foreground">Trained</p>
                    <p className="mt-0.5 text-base font-semibold">{trained}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Revenue: <span className="font-semibold text-foreground">{formatCurrency(revenue)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search programs…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="TRAIN_TO_HIRE">Train to Hire</SelectItem>
              <SelectItem value="HIRE_TO_TRAIN">Hire to Train</SelectItem>
              <SelectItem value="CORPORATE_TRAINING">Corporate Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Programs table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-5 w-5" />}
          title="No programs found"
          description="Try adjusting filters to find your delivery programs."
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Client</TableHead>
                <TableHead className="text-center">Target</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Trained</TableHead>
                <TableHead className="text-center hidden md:table-cell">Placed</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Budget</TableHead>
                <TableHead className="text-right">Partner Share</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const cfg = SOLUTION_TYPE_CONFIG[p.type];
                return (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(p)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={p.clientLogo} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{ROLE_LABELS[p.partnerRole]}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{cfg.shortLabel}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{p.clientName}</TableCell>
                    <TableCell className="text-center text-sm">{p.targetCandidates}</TableCell>
                    <TableCell className="text-center text-sm hidden sm:table-cell">{p.trained}</TableCell>
                    <TableCell className="text-center text-sm hidden md:table-cell">{p.placed}</TableCell>
                    <TableCell className="text-right text-sm hidden lg:table-cell">{formatCurrency(p.budget)}</TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm font-semibold text-brand">{p.partnerSharePct}%</div>
                      <div className="text-xs text-muted-foreground">{formatCurrency(p.partnerRevenue)}</div>
                    </TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelected(p); }}>
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

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && <PartnerProgramDetail program={selected} onClose={() => setSelected(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ============================================================
// Program detail
// ============================================================
function PartnerProgramDetail({ program, onClose }: { program: PartnerProgram; onClose: () => void }) {
  const { navigate } = useNav();
  const cfg = SOLUTION_TYPE_CONFIG[program.type];
  const trainedPct = program.targetCandidates > 0 ? Math.round((program.trained / program.targetCandidates) * 100) : 0;
  const programTxns = talentTransactions.filter((t) => t.programId === program.id);

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <AvatarLogo text={program.clientLogo} size="md" />
          <div>
            <SheetTitle className="text-left">{program.name}</SheetTitle>
            <SheetDescription className="text-left">
              {program.clientName} · {cfg.label} · {ROLE_LABELS[program.partnerRole]}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-4 space-y-4">
        {/* Progress + share */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Trained</p>
            <p className="mt-1 text-xl font-bold">{program.trained}<span className="text-xs text-muted-foreground">/{program.targetCandidates}</span></p>
            <Progress value={trainedPct} className="mt-1 h-1.5" />
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Placed</p>
            <p className="mt-1 text-xl font-bold">{program.placed}</p>
            <p className="mt-1 text-xs text-muted-foreground">of {program.trained || "—"} trained</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Your share</p>
            <p className="mt-1 text-xl font-bold text-brand">{program.partnerSharePct}%</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatCurrency(program.partnerRevenue)}</p>
          </Card>
        </div>

        <SectionCard title="Overview">
          <p className="text-sm text-muted-foreground">{program.description}</p>
        </SectionCard>

        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><User className="h-3.5 w-3.5" /> Trainer</div>
            <p className="mt-1 text-sm font-medium">{program.trainer}</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Timeline</div>
            <p className="mt-1 text-xs font-medium">{formatDate(program.startDate)} → {formatDate(program.endDate)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Wallet className="h-3.5 w-3.5" /> Budget</div>
            <p className="mt-1 text-sm font-medium">{formatCurrency(program.budget)}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(program.spent)} spent</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Percent className="h-3.5 w-3.5" /> Your role</div>
            <p className="mt-1 text-sm font-medium">{ROLE_LABELS[program.partnerRole]}</p>
            <p className="text-xs text-muted-foreground">Share: {program.partnerSharePct}%</p>
          </div>
        </div>

        {/* Curriculum */}
        <SectionCard title="Curriculum modules">
          <div className="flex flex-wrap gap-1.5">
            {program.programCurriculum.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
            ))}
          </div>
        </SectionCard>

        {/* Transactions */}
        <SectionCard
          title="Program transactions"
          action={<Button size="sm" variant="ghost" onClick={() => { onClose(); navigate("partner", "ts-transactions"); }}>View all <ArrowRight className="ml-1 h-3 w-3" /></Button>}
        >
          {programTxns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet for this program.</p>
          ) : (
            <div className="space-y-2">
              {programTxns.slice(0, 4).map((t) => {
                const toMe = t.payee === PARTNER_NAME;
                return (
                  <div key={t.id} className="flex items-center justify-between rounded-md border p-2">
                    <div>
                      <p className="text-xs font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.transactionNumber} · {formatDate(t.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${toMe ? "text-emerald-600" : "text-foreground"}`}>
                        {toMe ? "+" : ""}{formatCurrency(t.amount)}
                      </p>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => toast.success("Opening delivery workspace…", { description: program.name })}>
            Open workspace
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => toast.success("Performance report downloaded", { description: program.name })}>
            <TrendingUp className="mr-1 h-4 w-4" />
            Report
          </Button>
        </div>
      </div>
    </>
  );
}
