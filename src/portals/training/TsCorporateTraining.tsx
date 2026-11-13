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
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend,
} from "recharts";
import { CHART_COLORS } from "./_shared";
import {
  talentSolutionPrograms, talentTransactions, communicationLogs, SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionProgram } from "@/lib/talent-solutions-types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import {
  Plus, Building2, Users, Layers, Banknote, Filter, Award, Calendar,
} from "lucide-react";

const CORP = talentSolutionPrograms.filter((p) => p.type === "CORPORATE_TRAINING");

// Department-wise breakdown
const DEPT_BREAKDOWN = (() => {
  const map = new Map<string, number>();
  for (const p of CORP) {
    for (const d of p.departments ?? []) {
      map.set(d, (map.get(d) ?? 0) + (p.employeeCount ?? 0));
    }
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
})();

const DEPT_PIE = DEPT_BREAKDOWN.map((d, i) => ({ name: d.name, value: d.value, color: CHART_COLORS[i % CHART_COLORS.length] }));

export function TsCorporateTraining() {
  const { navigate } = useNav();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<TalentSolutionProgram | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const active = CORP.filter((p) => p.status === "active" || p.status === "in_progress").length;
  const employeesTrained = CORP.reduce((s, p) => s + p.trained, 0);
  const departments = new Set<string>();
  CORP.forEach((p) => p.departments?.forEach((d) => departments.add(d)));
  const revenue = talentTransactions
    .filter((t) => t.solutionType === "CORPORATE_TRAINING" && (t.type === "program_payment" || t.type === "certification_fee") && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  const filtered = CORP.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.clientName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corporate Training Programs"
        description="Custom enterprise training across technology, leadership, and compliance — designed for your workforce, delivered at scale."
        icon={<Building2 className="h-6 w-6" />}
        breadcrumbs={[{ label: "Talent Solutions", onClick: () => navigate("training", "ts-hub") }, { label: "Corporate Training" }]}
        actions={[
          { label: "Export", variant: "outline", onClick: () => toast.success("Corporate training exported", { description: "CSV file saved with all corporate training programs." }) },
          { label: "Create Corp Training", variant: "default", onClick: () => setCreateOpen(true) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Programs" value={active} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Employees Trained" value={formatNumber(employeesTrained)} icon={<Users className="h-5 w-5" />} tone="default" />
        <StatCard label="Departments" value={departments.size} icon={<Layers className="h-5 w-5" />} tone="warning" />
        <StatCard label="Revenue (Corp)" value={formatCurrency(revenue)} delta={{ value: "8.4% QoQ", positive: true }} icon={<Banknote className="h-5 w-5" />} tone="brand" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Employees by Department" description="Across all corporate training programs">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_BREAKDOWN} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" width={120} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => [formatNumber(v), "Employees"]} />
                <Bar dataKey="value" name="Employees" radius={[0, 6, 6, 0]}>
                  {DEPT_BREAKDOWN.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Department Distribution" description="Share of training by department">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DEPT_PIE} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {DEPT_PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => formatNumber(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
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
                  <SelectItem value="draft">Draft</SelectItem>
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
                <TableHead>Departments</TableHead>
                <TableHead className="text-center">Employees</TableHead>
                <TableHead className="text-center">Enrolled / Trained</TableHead>
                <TableHead>Budget / Spent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-10"><EmptyState icon={<Building2 className="h-5 w-5" />} title="No corporate training programs match filters" /></TableCell></TableRow>
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
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {(p.departments ?? []).slice(0, 2).map((d, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{d}</Badge>
                      ))}
                      {(p.departments?.length ?? 0) > 2 && <Badge variant="outline" className="text-[10px]">+{(p.departments?.length ?? 0) - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">{p.employeeCount ?? 0}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{p.enrolled}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="font-medium text-brand">{p.trained}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatCurrency(p.budget, p.currency)}</div>
                    <div className="text-xs text-muted-foreground">spent {formatCurrency(p.spent, p.currency)}</div>
                    <Progress value={(p.spent / p.budget) * 100} className="mt-1 h-1.5" />
                  </TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && <CorpDetail program={selected} />}
        </SheetContent>
      </Sheet>

      <CreateCorpDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

function CorpDetail({ program }: { program: TalentSolutionProgram }) {
  const cfg = SOLUTION_TYPE_CONFIG[program.type];
  const txns = talentTransactions.filter((t) => t.programId === program.id);
  const comms = communicationLogs.filter((c) => c.programId === program.id);
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Employees" value={String(program.employeeCount ?? 0)} icon={<Users className="h-4 w-4" />} />
        <MiniStat label="Enrolled" value={String(program.enrolled)} icon={<Users className="h-4 w-4" />} />
        <MiniStat label="Trained" value={String(program.trained)} icon={<Award className="h-4 w-4" />} />
        <MiniStat label="Departments" value={String(program.departments?.length ?? 0)} icon={<Layers className="h-4 w-4" />} />
      </div>

      <SectionCard title="Departments Covered">
        <div className="flex flex-wrap gap-2">
          {(program.departments ?? []).map((d, i) => (
            <Badge key={i} variant="secondary">{d}</Badge>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Curriculum & Certifications">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Modules</p>
            <ul className="space-y-2">
              {program.programCurriculum.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> {c}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Certifications</p>
            {program.certifications.length > 0 ? (
              <ul className="space-y-2">
                {program.certifications.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm"><Award className="h-4 w-4 text-amber-500" /> {c}</li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No certifications</p>}
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> Start</div>
          <p className="mt-1 text-sm font-medium">{formatDate(program.startDate)}</p>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> End</div>
          <p className="mt-1 text-sm font-medium">{formatDate(program.endDate)}</p>
        </div>
      </div>

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

function MiniStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">{icon} {label}</div>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function CreateCorpDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = React.useState({
    client: "", departments: "", employeeCount: "25", curriculum: "", certifications: "",
    trainer: "", budget: "1000000",
  });
  const update = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));
  const submit = () => {
    if (!form.client) { toast.error("Client name is required"); return; }
    toast.success("Corporate Training created", { description: `${form.employeeCount} employees at ${form.client} across departments.` });
    onOpenChange(false);
    setForm({ client: "", departments: "", employeeCount: "25", curriculum: "", certifications: "", trainer: "", budget: "1000000" });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Corporate Training Program</DialogTitle>
          <DialogDescription>Set up a custom enterprise training program for a corporate client.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
          <Field label="Client Name *"><Input value={form.client} onChange={(e) => update("client", e.target.value)} placeholder="TechCorp India" /></Field>
          <Field label="Trainer"><Input value={form.trainer} onChange={(e) => update("trainer", e.target.value)} placeholder="Meera Krishnan" /></Field>
          <Field label="Employee Count"><Input type="number" value={form.employeeCount} onChange={(e) => update("employeeCount", e.target.value)} /></Field>
          <Field label="Budget (₹)"><Input type="number" value={form.budget} onChange={(e) => update("budget", e.target.value)} /></Field>
          <div className="sm:col-span-2">
            <Field label="Departments (comma-separated)"><Input value={form.departments} onChange={(e) => update("departments", e.target.value)} placeholder="Engineering, Product, Operations" /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Curriculum (comma-separated)"><Textarea value={form.curriculum} onChange={(e) => update("curriculum", e.target.value)} placeholder="Leadership Bootcamp, Strategic Leadership, Change Management" /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Certifications (comma-separated)"><Input value={form.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="jobson.id Leadership Certificate" /></Field>
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
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
