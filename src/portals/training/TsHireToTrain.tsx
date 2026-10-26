"use client";

import * as React from "react";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { CHART_COLORS } from "./_shared";
import {
  talentSolutionPrograms, talentTransactions, communicationLogs, SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionProgram } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import {
  Plus, UserCheck, Users, GraduationCap, Banknote, Filter, Calendar, Award, Clock,
} from "lucide-react";

const H2T = talentSolutionPrograms.filter((p) => p.type === "HIRE_TO_TRAIN");

const PROGRESS_DATA = (() => {
  const hired = H2T.reduce((s, p) => s + (p.hiredCandidates ?? 0), 0);
  const inTraining = H2T.reduce((s, p) => s + (p.enrolled - p.trained), 0);
  const completed = H2T.reduce((s, p) => s + p.trained, 0);
  return [
    { name: "Hired", value: hired, fill: CHART_COLORS[0] },
    { name: "In Training", value: inTraining, fill: CHART_COLORS[1] },
    { name: "Completed", value: completed, fill: CHART_COLORS[2] },
  ];
})();

export function TsHireToTrain() {
  const { navigate } = useNav();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<TalentSolutionProgram | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const active = H2T.filter((p) => p.status === "active" || p.status === "in_progress").length;
  const hired = H2T.reduce((s, p) => s + (p.hiredCandidates ?? 0), 0);
  const inTraining = H2T.reduce((s, p) => s + (p.enrolled - p.trained), 0);
  const completed = H2T.reduce((s, p) => s + p.trained, 0);

  const filtered = H2T.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.clientName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hire to Train Programs"
        description="Hire promising candidates and we train them in your specific technology stack. Ideal when you need targeted upskilling for already-hired employees transitioning to new roles."
        icon={<UserCheck className="h-6 w-6" />}
        breadcrumbs={[{ label: "Talent Solutions", onClick: () => navigate("training", "ts-hub") }, { label: "Hire to Train" }]}
        actions={[
          { label: "Export", variant: "outline", onClick: () => toast.success("H2T programs exported", { description: "CSV file saved with all hire-to-train programs." }) },
          { label: "Create H2T Program", variant: "default", onClick: () => setCreateOpen(true) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Programs" value={active} icon={<UserCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="Hired Candidates" value={formatNumber(hired)} icon={<Users className="h-5 w-5" />} tone="default" />
        <StatCard label="In Training" value={formatNumber(inTraining)} icon={<GraduationCap className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed" value={formatNumber(completed)} hint="100% completion rate" icon={<Award className="h-5 w-5" />} tone="success" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="H2T Progress" description="Hired → In Training → Completed" className="lg:col-span-1">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROGRESS_DATA} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" width={80} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => [formatNumber(v), "Candidates"]} />
                <Bar dataKey="value" name="Candidates" radius={[0, 6, 6, 0]}>
                  {PROGRESS_DATA.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Duration & Budget" description="Per-program training duration vs spent" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={H2T.map((p) => ({ name: p.name.length > 24 ? p.name.slice(0, 24) + "…" : p.name, weeks: p.trainingDurationWeeks ?? 0, spent: p.spent / 100000 }))}
                margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" angle={-12} textAnchor="end" height={70} interval={0} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" tickFormatter={(v) => `₹${v}L`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="weeks" name="Duration (weeks)" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="spent" name="Spent (₹L)" fill={CHART_COLORS[4]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px] space-y-1">
              <Label className="text-xs">Search</Label>
              <Input placeholder="Program name or client..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setStatusFilter("all"); }}><Filter className="mr-1 h-4 w-4" /> Reset</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-center">Hired / Trained</TableHead>
                <TableHead className="text-center">Duration (wks)</TableHead>
                <TableHead>Budget / Spent</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-10"><EmptyState icon={<UserCheck className="h-5 w-5" />} title="No H2T programs match filters" /></TableCell></TableRow>
              )}
              {filtered.map((p) => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(p)}>
                  <TableCell>
                    <div className="font-medium text-sm line-clamp-1">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={p.clientName} size="xs" />
                      <span className="text-sm">{p.clientName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-brand">{p.hiredCandidates ?? 0}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{p.trained}</span>
                  </TableCell>
                  <TableCell className="text-center text-sm">{p.trainingDurationWeeks ?? 0}</TableCell>
                  <TableCell>
                    <div className="text-sm">{formatCurrency(p.budget, p.currency)}</div>
                    <div className="text-xs text-muted-foreground">spent {formatCurrency(p.spent, p.currency)}</div>
                    <Progress value={(p.spent / p.budget) * 100} className="mt-1 h-1.5" />
                  </TableCell>
                  <TableCell className="text-sm">{p.trainer}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && <H2TDetail program={selected} />}
        </SheetContent>
      </Sheet>

      <CreateH2TDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

function H2TDetail({ program }: { program: TalentSolutionProgram }) {
  const cfg = SOLUTION_TYPE_CONFIG[program.type];
  const txns = talentTransactions.filter((t) => t.programId === program.id);
  const comms = communicationLogs.filter((c) => c.programId === program.id);
  const phases = [
    { label: "Hired", count: program.hiredCandidates ?? 0, total: program.hiredCandidates ?? 0 },
    { label: "In Training", count: program.enrolled - program.trained, total: program.hiredCandidates ?? 0 },
    { label: "Training Complete", count: program.trained, total: program.hiredCandidates ?? 0 },
    { label: "On the Job", count: program.placed, total: program.hiredCandidates ?? 0 },
  ];
  return (
    <div className="space-y-6">
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={program.clientName} size="lg" />
          <div className="flex-1">
            <SheetTitle className="text-lg leading-tight">{program.name}</SheetTitle>
            <SheetDescription className="mt-1">{program.clientName} • {program.id}</SheetDescription>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" style={{ color: cfg.color, borderColor: `${cfg.color}40` }}>{cfg.shortLabel}</Badge>
              <StatusBadge status={program.status} />
              <StatusBadge status={program.priority} />
            </div>
          </div>
        </div>
      </SheetHeader>

      <p className="text-sm text-muted-foreground">{program.description}</p>

      <SectionCard title="Training Progress" description={`${program.trainingDurationWeeks ?? 0} weeks • ${program.trainer}`}>
        <div className="space-y-3">
          {phases.map((ph) => {
            const pct = ph.total > 0 ? Math.round((ph.count / ph.total) * 100) : 0;
            return (
              <div key={ph.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{ph.label}</span>
                  <span className="text-muted-foreground">{ph.count}/{ph.total} ({pct}%)</span>
                </div>
                <Progress value={pct} className="mt-1 h-2" />
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> Start</div>
          <p className="mt-1 text-sm font-medium">{formatDate(program.startDate)}</p>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> End</div>
          <p className="mt-1 text-sm font-medium">{formatDate(program.endDate)}</p>
        </div>
      </div>

      <SectionCard title="Curriculum">
        <ul className="space-y-2">
          {program.programCurriculum.map((c, i) => (
            <li key={i} className="flex items-center gap-2 text-sm"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> {c}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Transactions" description={`${txns.length} transaction(s)`}>
        {txns.length > 0 ? (
          <div className="max-h-48 overflow-y-auto scroll-thin space-y-2">
            {txns.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border p-2.5">
                <div>
                  <p className="text-sm font-medium">{t.description}</p>
                  <p className="text-xs text-muted-foreground">{t.transactionNumber} • {formatDate(t.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(t.amount, t.currency)}</p>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-muted-foreground">No transactions yet.</p>}
      </SectionCard>

      <SectionCard title="Communications" description={`${comms.length} communication(s)`}>
        {comms.length > 0 ? (
          <div className="max-h-48 overflow-y-auto scroll-thin space-y-2">
            {comms.map((c) => (
              <div key={c.id} className="rounded-lg border p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium line-clamp-1">{c.subject}</p>
                  <Badge variant="outline" className="text-[10px] capitalize">{c.type}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.message}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-muted-foreground">No communications.</p>}
      </SectionCard>
    </div>
  );
}

function CreateH2TDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = React.useState({
    client: "", hiredCandidates: "10", curriculum: "", durationWeeks: "8", trainer: "",
  });
  const update = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));
  const submit = () => {
    if (!form.client) { toast.error("Client name is required"); return; }
    toast.success("H2T Program created", { description: `${form.hiredCandidates} candidates hired at ${form.client}. Training starts in 7 days.` });
    onOpenChange(false);
    setForm({ client: "", hiredCandidates: "10", curriculum: "", durationWeeks: "8", trainer: "" });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Hire-to-Train Program</DialogTitle>
          <DialogDescription>Define the candidate count, curriculum, and trainer for your H2T cohort.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Field label="Client Name *"><Input value={form.client} onChange={(e) => update("client", e.target.value)} placeholder="TechCorp India" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hired Candidates"><Input type="number" value={form.hiredCandidates} onChange={(e) => update("hiredCandidates", e.target.value)} /></Field>
            <Field label="Duration (weeks)"><Input type="number" value={form.durationWeeks} onChange={(e) => update("durationWeeks", e.target.value)} /></Field>
          </div>
          <Field label="Trainer"><Input value={form.trainer} onChange={(e) => update("trainer", e.target.value)} placeholder="Rajesh Kumar" /></Field>
          <Field label="Training Curriculum (comma-separated)"><Textarea value={form.curriculum} onChange={(e) => update("curriculum", e.target.value)} placeholder="Go Fundamentals, gRPC, Microservices" /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Plus className="mr-1 h-4 w-4" /> Create Program</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
