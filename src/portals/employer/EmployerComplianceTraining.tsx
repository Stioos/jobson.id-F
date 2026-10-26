"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { PageHeader, SectionCard, StatCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, daysUntil } from "@/lib/format";
import { complianceTracks, learnerEnrollments, trainingCompany } from "@/lib/lms-data";
import type { ComplianceTrack } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  ShieldCheck, AlertTriangle, Send, CheckCircle2, Clock, Bell,
  Users, AlertCircle, FileWarning, Mail, ChevronRight, ScrollText,
} from "lucide-react";

const CLIENT_ID = "cc_001";
const tracks = complianceTracks.filter((t) => t.clientId === CLIENT_ID);

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "on_track", label: "On track" },
  { value: "at_risk", label: "At risk" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

const BAR_COLORS: Record<string, string> = {
  Compliant: "#10b981",
  "At-risk": "#f59e0b",
  Overdue: "#f43f5e",
};

export function EmployerComplianceTraining() {
  const { navigate } = useNav();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<ComplianceTrack | null>(null);

  const filtered = tracks.filter((t) => statusFilter === "all" || t.status === statusFilter);

  const totalEmployees = tracks.reduce((s, t) => s + t.totalEmployees, 0);
  const totalCompliant = tracks.reduce((s, t) => s + t.compliant, 0);
  const totalAtRisk = tracks.reduce((s, t) => s + t.atRisk, 0);
  const totalOverdue = tracks.reduce((s, t) => s + t.overdue, 0);
  const overallRate = totalEmployees > 0 ? Math.round((totalCompliant / totalEmployees) * 100) : 0;

  const overdueAlerts = tracks.filter((t) => t.status === "overdue" || t.status === "at_risk");

  const chartData = tracks.map((t) => ({
    name: t.regulation.length > 18 ? t.regulation.slice(0, 16) + "..." : t.regulation,
    Compliant: t.compliant,
    "At-risk": t.atRisk,
    Overdue: t.overdue,
  }));

  function sendReminders(t: ComplianceTrack) {
    toast.success("Reminders queued", {
      description: `${t.atRisk + t.overdue} reminder(s) sent to at-risk & overdue employees for "${t.name}".`,
    });
  }

  function sendBulkReminders() {
    const totalRecipients = overdueAlerts.reduce((s, t) => s + t.atRisk + t.overdue, 0);
    toast.success("Bulk reminders sent", {
      description: `${totalRecipients} reminder(s) sent across ${overdueAlerts.length} compliance track(s).`,
    });
  }

  // Mock employee-level breakdown for selected compliance
  const employeeBreakdown = selected
    ? learnerEnrollments
        .filter((e) => e.clientId === CLIENT_ID && e.courseId === selected.mandatoryCourseId)
        .map((e) => ({
          ...e,
          isCompliant: e.status === "completed" || e.status === "certified",
          isOverdue: e.status === "overdue" || (e.dueDate ? daysUntil(e.dueDate) < 0 : false),
        }))
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance Training"
        description={`Track mandatory regulatory training across ${tracks.length} compliance tracks at TechCorp India`}
        actions={[
          { label: "Send reminders", icon: "Bell", variant: "outline", onClick: sendBulkReminders },
          { label: "Assign learning", icon: "Send", onClick: () => navigate("employer", "assign-learning") },
        ]}
      />

      {/* Regulatory note */}
      <div className="rounded-lg border border-brand/30 bg-brand/5 p-4">
        <div className="flex items-start gap-3">
          <ScrollText className="h-5 w-5 text-brand mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">Regulatory requirements</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Compliance training is mandatory under applicable regulations (DPDP Act 2023, ISO 27001, RBI guidelines).
              Failure to meet deadlines may result in regulatory penalties, audit findings, or certification loss.
              TechCorp India is responsible for ensuring 100% employee coverage.
            </p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall compliance rate"
          value={`${overallRate}%`}
          icon={<ShieldCheck className="h-5 w-5" />}
          tone={overallRate >= 90 ? "success" : "warning"}
          hint={`${totalCompliant}/${totalEmployees} employees`}
        />
        <StatCard label="Compliant" value={totalCompliant} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="At-risk" value={totalAtRisk} icon={<AlertCircle className="h-5 w-5" />} tone="warning" hint="Need reminders" />
        <StatCard label="Overdue" value={totalOverdue} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" hint="Immediate action" />
      </div>

      {/* Overdue alerts panel */}
      {overdueAlerts.length > 0 && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 p-4">
          <div className="flex items-start gap-3">
            <FileWarning className="h-5 w-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                {overdueAlerts.length} compliance track(s) need attention
              </p>
              <div className="mt-2 space-y-2">
                {overdueAlerts.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-2 rounded-md border border-rose-500/20 bg-background p-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.overdue} overdue · {t.atRisk} at-risk · Due {formatDate(t.dueDate)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => sendReminders(t)}>
                      <Bell className="mr-1 h-3 w-3" /> Remind
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center justify-between gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary">{filtered.length} tracks</Badge>
      </div>

      {/* Tracks table */}
      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="No compliance tracks" description="No tracks match this filter." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Regulation</TableHead>
                  <TableHead>Mandatory course</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead className="text-right">Compliant</TableHead>
                  <TableHead className="text-right">At-risk</TableHead>
                  <TableHead className="text-right">Overdue</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px]">Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => {
                  const due = daysUntil(t.dueDate);
                  const completionPct = t.totalEmployees > 0 ? Math.round((t.compliant / t.totalEmployees) * 100) : 0;
                  return (
                    <TableRow
                      key={t.id}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => setSelected(t)}
                    >
                      <TableCell>
                        <span className="text-sm font-medium">{t.name}</span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.regulation}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{t.mandatoryCourseName}</TableCell>
                      <TableCell className="text-sm text-right tabular-nums">{t.totalEmployees}</TableCell>
                      <TableCell className="text-sm text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">{t.compliant}</TableCell>
                      <TableCell className="text-sm text-right tabular-nums text-amber-600 dark:text-amber-400">{t.atRisk}</TableCell>
                      <TableCell className="text-sm text-right tabular-nums text-rose-600 dark:text-rose-400 font-medium">{t.overdue}</TableCell>
                      <TableCell className="text-sm">
                        <span className={due < 0 ? "text-rose-600 dark:text-rose-400 font-medium" : due < 14 ? "text-amber-600 dark:text-amber-400" : ""}>
                          {formatDate(t.dueDate)}
                        </span>
                      </TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={completionPct} className="h-1.5 w-20" />
                          <span className="text-xs tabular-nums">{completionPct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            sendReminders(t);
                          }}
                        >
                          <Bell className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Compliance rate chart */}
      <SectionCard title="Compliance rate by regulation" description="Breakdown of compliant, at-risk, and overdue per regulation">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" angle={-15} textAnchor="end" height={50} interval={0} />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Bar dataKey="Compliant" stackId="a" fill={BAR_COLORS.Compliant} radius={[0, 0, 0, 0]} />
              <Bar dataKey="At-risk" stackId="a" fill={BAR_COLORS["At-risk"]} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Overdue" stackId="a" fill={BAR_COLORS.Overdue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto scroll-thin">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">{selected.name}</SheetTitle>
                <SheetDescription className="text-left">
                  {selected.regulation} · Due {formatDate(selected.dueDate)}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 pb-6 space-y-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={selected.status} />
                  <Badge variant="outline" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    {daysUntil(selected.dueDate) >= 0
                      ? `${daysUntil(selected.dueDate)} days remaining`
                      : `${Math.abs(daysUntil(selected.dueDate))} days overdue`}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Total employees</p>
                    <p className="mt-1 text-xl font-semibold">{selected.totalEmployees}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Compliant</p>
                    <p className="mt-1 text-xl font-semibold text-emerald-600 dark:text-emerald-400">{selected.compliant}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">At-risk</p>
                    <p className="mt-1 text-xl font-semibold text-amber-600 dark:text-amber-400">{selected.atRisk}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Overdue</p>
                    <p className="mt-1 text-xl font-semibold text-rose-600 dark:text-rose-400">{selected.overdue}</p>
                  </Card>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Completion rate</p>
                  <Progress value={Math.round((selected.compliant / selected.totalEmployees) * 100)} className="h-2" />
                </div>

                <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Mandatory course</p>
                  <p className="text-sm font-medium">{selected.mandatoryCourseName}</p>
                  <p className="text-xs text-muted-foreground">Delivered by {trainingCompany.name}</p>
                </div>

                {/* Employee-level breakdown */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" /> Employee-level breakdown
                  </h4>
                  {employeeBreakdown.length === 0 ? (
                    <p className="text-xs text-muted-foreground rounded-lg border border-dashed p-3">
                      No enrollments on record for this compliance course. Use "Assign learning" to push the mandatory course to at-risk employees.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
                      {employeeBreakdown.map((e) => (
                        <div key={e.id} className="rounded-lg border p-2.5 flex items-center gap-2">
                          <AvatarLogo text={e.learnerName} size="xs" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{e.learnerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {e.completedDate ? `Completed ${formatDate(e.completedDate)}` : e.dueDate ? `Due ${formatDate(e.dueDate)}` : "No due date"}
                            </p>
                          </div>
                          {e.isOverdue ? (
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px]">
                              Overdue
                            </Badge>
                          ) : e.isCompliant ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                              Compliant
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
                              {e.progress}% done
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => sendReminders(selected)}
                  >
                    <Bell className="mr-1.5 h-3.5 w-3.5" /> Send reminders
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setSelected(null);
                      navigate("employer", "assign-learning");
                    }}
                  >
                    <Mail className="mr-1.5 h-3.5 w-3.5" /> Assign course
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
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
