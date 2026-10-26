"use client";

import * as React from "react";
import { complianceTracks, corporateClients, trainingCourses } from "@/lib/lms-data";
import type { ComplianceTrack } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatDate, daysUntil, formatNumber } from "@/lib/format";
import { TenantDisclaimer, ChartTooltip } from "./_shared";
import { toast } from "sonner";
import { Plus, ShieldCheck, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const STATUS_TONES: Record<string, string> = {
  on_track: "text-emerald-600 dark:text-emerald-400",
  at_risk: "text-amber-600 dark:text-amber-400",
  overdue: "text-rose-600 dark:text-rose-400",
  completed: "text-brand",
};

export function TrainingCompliance() {
  const [rows, setRows] = React.useState<ComplianceTrack[]>(complianceTracks);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [clientFilter, setClientFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);

  // form
  const [name, setName] = React.useState("");
  const [regulation, setRegulation] = React.useState("");
  const [clientId, setClientId] = React.useState(corporateClients[0]?.id ?? "");
  const [courseId, setCourseId] = React.useState(trainingCourses[0]?.id ?? "");
  const [totalEmployees, setTotalEmployees] = React.useState(500);
  const [dueDate, setDueDate] = React.useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));

  const filtered = rows.filter((c) => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchClient = clientFilter === "all" || c.clientId === clientId;
    return matchStatus && matchClient;
  });

  const totalEmployeesTracked = rows.reduce((s, c) => s + c.totalEmployees, 0);
  const totalCompliant = rows.reduce((s, c) => s + c.compliant, 0);
  const totalOverdue = rows.reduce((s, c) => s + c.overdue, 0);
  const complianceRate = totalEmployeesTracked > 0 ? Math.round((totalCompliant / totalEmployeesTracked) * 100) : 0;

  // compliance rate by client
  const byClient = React.useMemo(() => {
    const map: Record<string, { client: string; compliant: number; total: number; rate: number }> = {};
    rows.forEach((r) => {
      const key = r.clientName ?? "Unknown";
      if (!map[key]) map[key] = { client: key, compliant: 0, total: 0, rate: 0 };
      map[key].compliant += r.compliant;
      map[key].total += r.totalEmployees;
    });
    return Object.values(map).map((v) => ({ ...v, rate: v.total > 0 ? Math.round((v.compliant / v.total) * 100) : 0 }));
  }, [rows]);

  function create() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    const client = corporateClients.find((c) => c.id === clientId);
    const course = trainingCourses.find((c) => c.id === courseId);
    const newTrack: ComplianceTrack = {
      id: `ct_new_${Date.now()}`,
      name, regulation, clientId, clientName: client?.name,
      mandatoryCourseId: courseId, mandatoryCourseName: course?.name ?? "",
      totalEmployees, compliant: 0, atRisk: totalEmployees, overdue: 0,
      dueDate, status: "at_risk",
    };
    setRows((r) => [...r, newTrack]);
    setAddOpen(false);
    setName(""); setRegulation("");
    toast.success(`Compliance track created — ${name}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Compliance Tracking"
        description="Monitor regulatory training compliance across corporate clients."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[{ label: "Create track", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Compliance Rate" value={`${complianceRate}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone={complianceRate >= 90 ? "success" : "warning"} hint={`${formatNumber(totalCompliant)}/${formatNumber(totalEmployeesTracked)}`} />
        <StatCard label="Tracks" value={rows.length} icon={<ShieldCheck className="h-5 w-5" />} tone="brand" />
        <StatCard label="Overdue" value={totalOverdue} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
        <StatCard label="At Risk" value={rows.reduce((s, c) => s + c.atRisk, 0)} icon={<Clock className="h-5 w-5" />} tone="warning" />
      </div>

      {/* Alerts */}
      {rows.filter((r) => r.status === "overdue").length > 0 && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-rose-700 dark:text-rose-400">{rows.filter((r) => r.status === "overdue").length} compliance track(s) overdue</p>
            <p className="text-muted-foreground">Immediate action required to avoid regulatory exposure.</p>
          </div>
        </div>
      )}

      <SectionCard title="Compliance Rate by Client" description="Aggregate compliant employees / total">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byClient}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="client" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" unit="%" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="rate" name="Compliance %" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="on_track">On track</SelectItem>
            <SelectItem value="at_risk">At risk</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={clientFilter} onValueChange={(v) => { setClientFilter(v); setClientId(v === "all" ? corporateClients[0]?.id ?? "" : v); }}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="Client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="No compliance tracks" />
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => {
              const rate = t.totalEmployees > 0 ? Math.round((t.compliant / t.totalEmployees) * 100) : 0;
              const days = daysUntil(t.dueDate);
              return (
                <div key={t.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{t.name}</h3>
                        <StatusBadge status={t.status === "on_track" ? "active" : t.status === "at_risk" ? "pending" : t.status === "overdue" ? "overdue" : "completed"} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t.regulation} · {t.clientName} · Mandatory: {t.mandatoryCourseName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-bold ${STATUS_TONES[t.status]}`}>{rate}%</p>
                      <p className="text-xs text-muted-foreground">
                        {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <div className="rounded border p-2">
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold">{formatNumber(t.totalEmployees)}</p>
                    </div>
                    <div className="rounded border p-2 border-emerald-500/20 bg-emerald-500/5">
                      <p className="text-muted-foreground">Compliant</p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">{formatNumber(t.compliant)}</p>
                    </div>
                    <div className="rounded border p-2 border-amber-500/20 bg-amber-500/5">
                      <p className="text-muted-foreground">At Risk</p>
                      <p className="font-semibold text-amber-600 dark:text-amber-400">{formatNumber(t.atRisk)}</p>
                    </div>
                    <div className="rounded border p-2 border-rose-500/20 bg-rose-500/5">
                      <p className="text-muted-foreground">Overdue</p>
                      <p className="font-semibold text-rose-600 dark:text-rose-400">{formatNumber(t.overdue)}</p>
                    </div>
                  </div>

                  <Progress value={rate} className="mt-3 h-1.5" />
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Due {formatDate(t.dueDate)}</span>
                    <Button variant="outline" size="sm" onClick={() => toast.info(`Sending reminders for ${t.name}`)}>Send reminders</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Compliance Track</DialogTitle>
            <DialogDescription>Define a regulatory compliance requirement.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ct-name">Track name *</Label>
              <Input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="ct-reg">Regulation</Label>
              <Input id="ct-reg" value={regulation} onChange={(e) => setRegulation(e.target.value)} className="mt-1" placeholder="e.g. DPDP Act 2023" />
            </div>
            <div>
              <Label>Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mandatory course</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{trainingCourses.filter((c) => c.isCompliance).concat(trainingCourses).slice(0, 8).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ct-emp">Total employees</Label>
                <Input id="ct-emp" type="number" value={totalEmployees} onChange={(e) => setTotalEmployees(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ct-due">Due date</Label>
                <Input id="ct-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={create}>Create track</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
