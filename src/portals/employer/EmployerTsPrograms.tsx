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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GraduationCap,
  Plus,
  Search,
  Briefcase,
  Users,
  Trophy,
  Wallet,
  ArrowRight,
  Calendar,
  User,
  Award,
  Receipt,
  TrendingUp,
} from "lucide-react";
import {
  talentSolutionPrograms,
  talentTransactions,
  SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionType, TalentSolutionProgram } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useNav } from "@/lib/store";

const EMPLOYER_NAME = "TechCorp India";

export function EmployerTsPrograms() {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<TalentSolutionProgram | null>(null);

  // Create form
  const [cType, setCType] = React.useState<TalentSolutionType>("TRAIN_TO_HIRE");
  const [cName, setCName] = React.useState("");
  const [cTarget, setCTarget] = React.useState("20");
  const [cCurriculum, setCCurriculum] = React.useState("");
  const [cBudget, setCBudget] = React.useState("");
  const [cStart, setCStart] = React.useState("");
  const [cEnd, setCEnd] = React.useState("");

  const employerPrograms = talentSolutionPrograms.filter((p) => p.clientName === EMPLOYER_NAME);

  const filtered = React.useMemo(() => {
    return employerPrograms.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, typeFilter, statusFilter, employerPrograms]);

  // KPIs
  const activeCount = employerPrograms.filter((p) => p.status === "active" || p.status === "in_progress").length;
  const candidatesTrained = employerPrograms.reduce((s, p) => s + p.trained, 0);
  const placedCount = employerPrograms.reduce((s, p) => s + p.placed, 0);
  const totalInvestment = employerPrograms.reduce((s, p) => s + p.spent, 0);

  const handleCreate = () => {
    if (!cName.trim()) {
      toast.error("Please name your program");
      return;
    }
    if (!cBudget) {
      toast.error("Please enter a budget");
      return;
    }
    toast.success("Program created", {
      description: `"${cName}" — saved as draft. Our solutions team will reach out to finalize the curriculum.`,
    });
    setCreateOpen(false);
    setCName("");
    setCCurriculum("");
    setCBudget("");
    setCStart("");
    setCEnd("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Solution Programs"
        description="All Talent Solution programs run for your organization — Train-to-Hire, Hire-to-Train, and Corporate Training tracks in one view."
        breadcrumbs={[
          { label: "Employer", onClick: () => navigate("employer", "overview") },
          { label: "Talent Solutions", onClick: () => navigate("employer", "ts-hub") },
          { label: "Programs" },
        ]}
        actions={[
          {
            label: "Create program",
            variant: "default",
            onClick: () => setCreateOpen(true),
          },
        ]}
        icon={<Briefcase className="h-6 w-6" />}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Programs" value={activeCount} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Candidates Trained" value={candidatesTrained} icon={<GraduationCap className="h-5 w-5" />} tone="brand" />
        <StatCard label="Placed" value={placedCount} icon={<Trophy className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Investment" value={formatCurrency(totalInvestment)} icon={<Wallet className="h-5 w-5" />} tone="brand" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search programs…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="TRAIN_TO_HIRE">Train to Hire</SelectItem>
              <SelectItem value="HIRE_TO_TRAIN">Hire to Train</SelectItem>
              <SelectItem value="CORPORATE_TRAINING">Corporate Training</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On hold</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Programs table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-5 w-5" />}
          title="No programs found"
          description="Try adjusting filters or create a new program."
          action={<Button onClick={() => setCreateOpen(true)}><Plus className="mr-1 h-4 w-4" /> Create program</Button>}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Target</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Enrolled</TableHead>
                <TableHead className="text-center hidden md:table-cell">Trained</TableHead>
                <TableHead className="text-center hidden md:table-cell">Placed</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Budget / Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const cfg = SOLUTION_TYPE_CONFIG[p.type];
                const budgetPct = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
                return (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(p)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={p.clientLogo} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.clientName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{cfg.shortLabel}</Badge></TableCell>
                    <TableCell className="text-center text-sm">{p.targetCandidates}</TableCell>
                    <TableCell className="text-center text-sm hidden sm:table-cell">{p.enrolled}</TableCell>
                    <TableCell className="text-center text-sm hidden md:table-cell">{p.trained}</TableCell>
                    <TableCell className="text-center text-sm hidden md:table-cell">{p.placed}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell">
                      <div className="text-xs font-medium">{formatCurrency(p.budget)}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{formatCurrency(p.spent)} spent</span>
                        <Progress value={budgetPct} className="h-1 w-12" />
                      </div>
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

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Talent Solution program</DialogTitle>
            <DialogDescription>
              Define the basics — our solutions team will refine the curriculum and commercials with you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="c-type">Solution type</Label>
                <Select value={cType} onValueChange={(v) => setCType(v as TalentSolutionType)}>
                  <SelectTrigger id="c-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRAIN_TO_HIRE">Train to Hire</SelectItem>
                    <SelectItem value="HIRE_TO_TRAIN">Hire to Train</SelectItem>
                    <SelectItem value="CORPORATE_TRAINING">Corporate Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-target">Target candidates</Label>
                <Input id="c-target" type="number" value={cTarget} onChange={(e) => setCTarget(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-name">Program name</Label>
              <Input id="c-name" placeholder="e.g. Full-Stack Engineers T2H — Batch 4" value={cName} onChange={(e) => setCName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-curriculum">Curriculum outline</Label>
              <Textarea id="c-curriculum" rows={3} placeholder="React 19, Node.js, PostgreSQL, System Design…" value={cCurriculum} onChange={(e) => setCCurriculum(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="c-budget">Budget (₹)</Label>
                <Input id="c-budget" type="number" placeholder="1500000" value={cBudget} onChange={(e) => setCBudget(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-start">Start date</Label>
                <Input id="c-start" type="date" value={cStart} onChange={(e) => setCStart(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-end">End date</Label>
              <Input id="c-end" type="date" value={cEnd} onChange={(e) => setCEnd(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>
              Create program
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && <ProgramDetail program={selected} onClose={() => setSelected(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ============================================================
// Program detail sheet content
// ============================================================
function ProgramDetail({ program, onClose }: { program: TalentSolutionProgram; onClose: () => void }) {
  const { navigate } = useNav();
  const cfg = SOLUTION_TYPE_CONFIG[program.type];
  const budgetPct = program.budget > 0 ? Math.round((program.spent / program.budget) * 100) : 0;
  const trainedPct = program.targetCandidates > 0 ? Math.round((program.trained / program.targetCandidates) * 100) : 0;
  const placedPct = program.trained > 0 ? Math.round((program.placed / program.trained) * 100) : 0;
  const programTxns = talentTransactions.filter((t) => t.programId === program.id);

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <AvatarLogo text={program.clientLogo} size="md" />
          <div>
            <SheetTitle className="text-left">{program.name}</SheetTitle>
            <SheetDescription className="text-left">
              {program.clientName} · {cfg.label}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-4 space-y-4">
        {/* Progress summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Trained</p>
            <p className="mt-1 text-xl font-bold">{program.trained}<span className="text-xs text-muted-foreground">/{program.targetCandidates}</span></p>
            <Progress value={trainedPct} className="mt-1 h-1.5" />
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Placed</p>
            <p className="mt-1 text-xl font-bold">{program.placed}<span className="text-xs text-muted-foreground">/{program.trained || "—"}</span></p>
            <Progress value={placedPct} className="mt-1 h-1.5" />
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="mt-1 text-xl font-bold">{budgetPct}%</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatCurrency(program.spent)} / {formatCurrency(program.budget)}</p>
          </Card>
        </div>

        {/* Description */}
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
          {program.hiringRoles && (
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Briefcase className="h-3.5 w-3.5" /> Hiring roles</div>
              <p className="mt-1 text-xs font-medium">{program.hiringRoles.join(", ")}</p>
            </div>
          )}
          {program.guaranteedPlacements !== undefined && (
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Trophy className="h-3.5 w-3.5" /> Guaranteed placements</div>
              <p className="mt-1 text-sm font-medium">{program.guaranteedPlacements} seats</p>
            </div>
          )}
        </div>

        {/* Curriculum */}
        <SectionCard title="Curriculum">
          <div className="flex flex-wrap gap-1.5">
            {program.programCurriculum.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
            ))}
          </div>
        </SectionCard>

        {/* Certifications */}
        <SectionCard title="Certifications">
          <div className="space-y-2">
            {program.certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-2 rounded-md border p-2">
                <Award className="h-4 w-4 text-brand" />
                <span className="text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Transactions */}
        <SectionCard
          title="Program transactions"
          action={<Button size="sm" variant="ghost" onClick={() => { onClose(); navigate("employer", "ts-transactions"); }}>View all <ArrowRight className="ml-1 h-3 w-3" /></Button>}
        >
          {programTxns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet for this program.</p>
          ) : (
            <div className="space-y-2">
              {programTxns.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/10 text-brand"><Receipt className="h-3.5 w-3.5" /></div>
                    <div>
                      <p className="text-xs font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.transactionNumber} · {formatDate(t.createdAt)}</p>
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

        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => toast.success("Opening program workspace…", { description: program.name })}>
            Open workspace
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => toast.success("Report downloaded", { description: `${program.name} — performance report` })}>
            <TrendingUp className="mr-1 h-4 w-4" />
            Report
          </Button>
        </div>
      </div>
    </>
  );
}
