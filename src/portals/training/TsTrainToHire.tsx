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
import { Icon } from "@/components/common/Icon";
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
  ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { CHART_COLORS } from "./_shared";
import {
  talentSolutionPrograms, talentTransactions, communicationLogs, SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionProgram } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import {
  Plus, Target, GraduationCap, UserCheck, Banknote, Filter, Download, ArrowRight,
  Calendar, Users, Award, Briefcase, TrendingUp,
} from "lucide-react";

const T2H = talentSolutionPrograms.filter((p) => p.type === "TRAIN_TO_HIRE");

const FUNNEL_DATA = (() => {
  const enrolled = T2H.reduce((s, p) => s + p.enrolled, 0);
  const trained = T2H.reduce((s, p) => s + p.trained, 0);
  const placed = T2H.reduce((s, p) => s + p.placed, 0);
  return [
    { name: "Enrolled", value: enrolled, fill: "#10b981" },
    { name: "Trained", value: trained, fill: "#14b8a6" },
    { name: "Placed", value: placed, fill: "#0ea5e9" },
  ];
})();

export function TsTrainToHire() {
  const { navigate } = useNav();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<TalentSolutionProgram | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const active = T2H.filter((p) => p.status === "active" || p.status === "in_progress").length;
  const inTraining = T2H.reduce((s, p) => s + (p.enrolled - p.trained), 0);
  const placed = T2H.reduce((s, p) => s + p.placed, 0);
  const revenue = talentTransactions
    .filter((t) => t.solutionType === "TRAIN_TO_HIRE" && t.type === "program_payment" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  const filtered = T2H.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (priorityFilter !== "all" && p.priority !== priorityFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.clientName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Train to Hire Programs"
        description="Train fresh talent in industry-aligned skills, then place them into guaranteed roles with hiring partners. Outcome-based pricing with placement guarantees."
        icon={<GraduationCap className="h-6 w-6" />}
        breadcrumbs={[{ label: "Talent Solutions", onClick: () => navigate("training", "ts-hub") }, { label: "Train to Hire" }]}
        actions={[
          { label: "Export", variant: "outline", onClick: () => toast.success("T2H programs exported", { description: "CSV file saved with 4 programs and full candidate details." }) },
          { label: "Create T2H Program", variant: "default", onClick: () => setCreateOpen(true) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Programs" value={active} icon={<Target className="h-5 w-5" />} tone="brand" />
        <StatCard label="Candidates in Training" value={formatNumber(inTraining)} icon={<Users className="h-5 w-5" />} tone="default" />
        <StatCard label="Placed" value={formatNumber(placed)} hint="92% placement rate" icon={<UserCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Revenue (T2H)" value={formatCurrency(revenue)} delta={{ value: "12% QoQ", positive: true }} icon={<Banknote className="h-5 w-5" />} tone="brand" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Funnel chart */}
        <SectionCard
          title="T2H Funnel"
          description="Enrolled → Trained → Placed"
          className="lg:col-span-1"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                  formatter={(v: number) => [formatNumber(v), "Candidates"]}
                />
                <Funnel dataKey="value" data={FUNNEL_DATA} isAnimationActive>
                  <LabelList position="right" fill="currentColor" stroke="none" dataKey="name" className="text-xs fill-foreground" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {FUNNEL_DATA.map((f) => (
              <div key={f.name} className="rounded-lg border bg-muted/30 p-2">
                <p className="text-lg font-bold" style={{ color: f.fill }}>{formatNumber(f.value)}</p>
                <p className="text-[10px] text-muted-foreground">{f.name}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Program status breakdown */}
        <SectionCard
          title="Program Status Breakdown"
          description="Count of T2H programs by status"
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Active", count: T2H.filter((p) => p.status === "active").length },
                  { name: "In Progress", count: T2H.filter((p) => p.status === "in_progress").length },
                  { name: "Completed", count: T2H.filter((p) => p.status === "completed").length },
                  { name: "On Hold", count: T2H.filter((p) => p.status === "on_hold").length },
                  { name: "Draft", count: T2H.filter((p) => p.status === "draft").length },
                ]}
                margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar dataKey="count" name="Programs" radius={[6, 6, 0, 0]}>
                  {CHART_COLORS.slice(0, 5).map((c, i) => <Cell key={i} fill={c} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Filters */}
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
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setStatusFilter("all"); setPriorityFilter("all"); }}>
              <Filter className="mr-1 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Programs table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-center">Target / Enrolled / Trained / Placed</TableHead>
                <TableHead>Budget / Spent</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10">
                    <EmptyState icon={<Target className="h-5 w-5" />} title="No T2H programs match filters" description="Try adjusting your filters or create a new program." />
                  </TableCell>
                </TableRow>
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
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground">{p.targetCandidates}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="font-medium">{p.enrolled}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="font-medium text-brand">{p.trained}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.placed}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatCurrency(p.budget, p.currency)}</div>
                    <div className="text-xs text-muted-foreground">spent {formatCurrency(p.spent, p.currency)}</div>
                    <Progress value={(p.spent / p.budget) * 100} className="mt-1 h-1.5" />
                  </TableCell>
                  <TableCell className="text-sm">{p.trainer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs"><Calendar className="h-3 w-3 text-muted-foreground" />{formatDate(p.startDate)}</div>
                    <div className="text-xs text-muted-foreground">→ {formatDate(p.endDate)}</div>
                  </TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell><StatusBadge status={p.priority} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Program detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && <ProgramDetail program={selected} />}
        </SheetContent>
      </Sheet>

      {/* Create T2H Program Dialog */}
      <CreateT2HDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

function ProgramDetail({ program }: { program: TalentSolutionProgram }) {
  const cfg = SOLUTION_TYPE_CONFIG[program.type];
  const txns = talentTransactions.filter((t) => t.programId === program.id);
  const comms = communicationLogs.filter((c) => c.programId === program.id);
  const timeline = [
    { label: "Created", date: program.createdAt, done: true },
    { label: "Started", date: program.startDate, done: new Date(program.startDate) <= new Date() },
    { label: "Training Complete", date: null, done: program.trained === program.enrolled && program.enrolled > 0 },
    { label: "Placement Drive", date: null, done: program.placed > 0 },
    { label: "Program Closed", date: program.endDate, done: program.status === "completed" },
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

      {/* Description */}
      <div>
        <h4 className="text-sm font-semibold mb-1">Program Overview</h4>
        <p className="text-sm text-muted-foreground">{program.description}</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Target" value={String(program.targetCandidates)} icon={<Target className="h-4 w-4" />} />
        <MiniStat label="Enrolled" value={String(program.enrolled)} icon={<Users className="h-4 w-4" />} />
        <MiniStat label="Trained" value={String(program.trained)} icon={<GraduationCap className="h-4 w-4" />} />
        <MiniStat label="Placed" value={String(program.placed)} icon={<UserCheck className="h-4 w-4" />} />
      </div>

      {/* Timeline */}
      <SectionCard title="Program Timeline" description="Lifecycle progress">
        <ol className="relative ml-3 border-l border-border">
          {timeline.map((t, i) => (
            <li key={i} className="mb-4 ml-4 last:mb-0">
              <div className={`absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-background ${t.done ? "bg-brand" : "bg-muted"}`} />
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{t.label}</p>
                {t.done && <Badge variant="outline" className="bg-brand/5 text-brand border-brand/30 text-[10px]">Done</Badge>}
              </div>
              {t.date && <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>}
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Curriculum & Certifications */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title="Curriculum">
          <ul className="space-y-2">
            {program.programCurriculum.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {c}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Certifications">
          {program.certifications.length > 0 ? (
            <ul className="space-y-2">
              {program.certifications.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-amber-500" /> {c}
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No certifications</p>}
        </SectionCard>
      </div>

      {/* Hiring roles + guarantee */}
      <SectionCard title="Hiring Roles & Guarantee">
        <div className="flex flex-wrap gap-2">
          {program.hiringRoles?.map((r, i) => (
            <Badge key={i} variant="secondary" className="gap-1"><Briefcase className="h-3 w-3" /> {r}</Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-brand" />
          <span>Guaranteed placements: <strong>{program.guaranteedPlacements ?? 0}</strong> candidates</span>
        </div>
      </SectionCard>

      {/* Transactions */}
      <SectionCard title="Transactions" description={`${txns.length} transaction(s) on this program`}>
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

      {/* Communications */}
      <SectionCard title="Recent Communications" description={`${comms.length} communication(s)`}>
        {comms.length > 0 ? (
          <div className="max-h-48 overflow-y-auto scroll-thin space-y-2">
            {comms.map((c) => (
              <div key={c.id} className="rounded-lg border p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium line-clamp-1">{c.subject}</p>
                  <Badge variant="outline" className="text-[10px] capitalize">{c.type}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.message}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{c.from} → {c.to} • {formatDate(c.timestamp)}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-muted-foreground">No communications.</p>}
      </SectionCard>

      {/* Trainer & AM */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Trainer</p>
          <p className="text-sm font-medium">{program.trainer}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Account Manager</p>
          <p className="text-sm font-medium">{program.accountManager}</p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">{icon} {label}</div>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function CreateT2HDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = React.useState({
    client: "", name: "", targetCandidates: "30", curriculum: "", certifications: "",
    trainer: "", budget: "1500000", guaranteedPlacements: "20", hiringRoles: "",
    startDate: "", endDate: "",
  });

  const update = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const submit = () => {
    if (!form.client || !form.name) {
      toast.error("Client and Program Name are required");
      return;
    }
    toast.success("T2H Program created", {
      description: `${form.name} for ${form.client} — target ${form.targetCandidates} candidates, ${form.guaranteedPlacements} guaranteed placements.`,
    });
    onOpenChange(false);
    setForm({ client: "", name: "", targetCandidates: "30", curriculum: "", certifications: "", trainer: "", budget: "1500000", guaranteedPlacements: "20", hiringRoles: "", startDate: "", endDate: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Train-to-Hire Program</DialogTitle>
          <DialogDescription>Set up a new T2H program with curriculum, hiring roles, and placement guarantees.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
          <Field label="Client Name *"><Input value={form.client} onChange={(e) => update("client", e.target.value)} placeholder="TechCorp India" /></Field>
          <Field label="Program Name *"><Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full-Stack T2H Batch 4" /></Field>
          <Field label="Target Candidates"><Input type="number" value={form.targetCandidates} onChange={(e) => update("targetCandidates", e.target.value)} /></Field>
          <Field label="Guaranteed Placements"><Input type="number" value={form.guaranteedPlacements} onChange={(e) => update("guaranteedPlacements", e.target.value)} /></Field>
          <Field label="Budget (₹)"><Input type="number" value={form.budget} onChange={(e) => update("budget", e.target.value)} /></Field>
          <Field label="Trainer"><Input value={form.trainer} onChange={(e) => update("trainer", e.target.value)} placeholder="Dr. Senthil Kumar" /></Field>
          <Field label="Start Date"><Input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} /></Field>
          <Field label="End Date"><Input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} /></Field>
          <div className="sm:col-span-2">
            <Field label="Curriculum (comma-separated)"><Textarea value={form.curriculum} onChange={(e) => update("curriculum", e.target.value)} placeholder="React 19, Node.js, PostgreSQL, System Design" /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Certifications (comma-separated)"><Input value={form.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="JOBSONN Full-Stack Certificate" /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Hiring Roles (comma-separated)"><Input value={form.hiringRoles} onChange={(e) => update("hiringRoles", e.target.value)} placeholder="Junior Full-Stack Engineer, Backend Engineer" /></Field>
          </div>
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
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
