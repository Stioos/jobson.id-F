"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import {
  trainingBudgets, trainingPrograms, trainingInvoices, trainingCompany, corporateClients, learnerEnrollments,
} from "@/lib/lms-data";
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Wallet, Users, TrendingUp, Percent, Download, Star, Calendar,
  Info, Sparkles, ArrowUpRight, GraduationCap, CheckCircle2, AlertTriangle,
  Trophy, Clock,
} from "lucide-react";

const CLIENT_ID = "cc_001";
const client = corporateClients.find((c) => c.id === CLIENT_ID)!;
const budgets = trainingBudgets.filter((b) => b.clientId === CLIENT_ID);
const programs = trainingPrograms.filter((p) => p.clientId === CLIENT_ID);
const invoices = trainingInvoices.filter((i) => i.clientId === CLIENT_ID);
const enrollments = learnerEnrollments.filter((e) => e.clientId === CLIENT_ID);

const PIE_COLORS = ["#10b981", "#14b8a6", "#f59e0b", "#8b5cf6", "#0ea5e9", "#22c55e"];

const DATE_RANGES = [
  { value: "qtd", label: "Quarter to date" },
  { value: "ytd", label: "Year to date (FY24-25)" },
  { value: "12m", label: "Last 12 months" },
  { value: "all", label: "All time" },
];

const completionTrend = [
  { month: "Apr", completions: 18, hours: 320 },
  { month: "May", completions: 24, hours: 410 },
  { month: "Jun", completions: 32, hours: 520 },
  { month: "Jul", completions: 28, hours: 480 },
  { month: "Aug", completions: 42, hours: 620 },
  { month: "Sep", completions: 38, hours: 580 },
  { month: "Oct", completions: 56, hours: 780 },
  { month: "Nov", completions: 64, hours: 920 },
];

const learningHoursTrend = [
  { month: "Apr", hours: 320, target: 400 },
  { month: "May", hours: 410, target: 400 },
  { month: "Jun", hours: 520, target: 450 },
  { month: "Jul", hours: 480, target: 450 },
  { month: "Aug", hours: 620, target: 500 },
  { month: "Sep", hours: 580, target: 500 },
  { month: "Oct", hours: 780, target: 550 },
  { month: "Nov", hours: 920, target: 550 },
];

export function EmployerTrainingRoi() {
  const [range, setRange] = React.useState("ytd");

  // Aggregate KPIs
  const totalSpend = budgets.reduce((s, b) => s + b.used, 0);
  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalLearners = client.employeesEnrolled;
  const costPerLearner = totalLearners > 0 ? Math.round(totalSpend / totalLearners) : 0;

  const completedEnrollments = enrollments.filter((e) => e.status === "completed" || e.status === "certified").length;
  const completionRate = enrollments.length > 0 ? Math.round((completedEnrollments / enrollments.length) * 100) : 0;
  // Mock org-wide completion rate
  const orgCompletionRate = 78;

  // Productivity gain estimate (mock — based on avg score × completion rate)
  const avgScore = 84;
  const productivityGain = Math.round((orgCompletionRate * 0.4 + avgScore * 0.2) * 10) / 10;

  // ROI % = (productivity gain $ - training cost) / training cost × 100
  // Mock: assume each completion delivers ~₹40,000 productivity value (engineer-hour savings + output)
  const productivityValuePerCompletion = 40000;
  const orgCompletions = 248; // mock org-wide completions for the period
  const totalBenefit = orgCompletions * productivityValuePerCompletion;
  const roi = totalSpend > 0 ? Math.round(((totalBenefit - totalSpend) / totalSpend) * 100) : 0;

  // Spend by category (department)
  const spendByCategory = budgets.map((b) => ({
    name: b.department ?? "General",
    value: b.used,
    allocated: b.allocated,
  }));

  // ROI by program
  const roiByProgram = programs.map((p) => {
    const completionPct = p.targetLearners > 0 ? Math.round((p.completed / p.targetLearners) * 100) : 0;
    // Mock benefit = completed × per-learner value
    const perLearnerValue = 25000;
    const benefit = p.completed * perLearnerValue;
    const cost = p.budget ?? 0;
    const programRoi = cost > 0 ? Math.round(((benefit - cost) / cost) * 100) : 0;
    return {
      id: p.id,
      name: p.name,
      type: p.type,
      budget: cost,
      enrolled: p.enrolled,
      completed: p.completed,
      completionPct,
      benefit,
      roi: programRoi,
      status: p.status,
    };
  });

  function exportReport() {
    const lines = [
      `TechCorp India — Training ROI Report`,
      `Period: ${DATE_RANGES.find((r) => r.value === range)?.label ?? range}`,
      `Generated: ${new Date().toISOString()}`,
      ``,
      `Total training spend: ${formatCurrency(totalSpend)}`,
      `Total allocated: ${formatCurrency(totalAllocated)}`,
      `Cost per learner: ${formatCurrency(costPerLearner)}`,
      `Avg completion rate: ${orgCompletionRate}%`,
      `Productivity gain estimate: ${productivityGain}%`,
      `ROI: ${roi}%`,
      ``,
      `Programs:`,
      ...roiByProgram.map((p) => `  - ${p.name} | budget ${formatCurrency(p.budget)} | ${p.completed}/${p.enrolled} completed | ROI ${p.roi}%`),
    ];
    const txt = lines.join("\n");
    toast.success("Report exported", { description: `${txt.length} bytes · ${range.toUpperCase()} (demo)` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training ROI & Analytics"
        description={`Investment, outcomes & ROI for TechCorp India's L&D programs`}
        actions={[
          { label: "Export report", icon: "Download", variant: "outline", onClick: exportReport },
        ]}
      />

      {/* Date range + disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DATE_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
          <Info className="mr-0.5 h-2.5 w-2.5" /> Estimates · See methodology below
        </Badge>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total training spend"
          value={formatCurrency(totalSpend)}
          icon={<Wallet className="h-5 w-5" />}
          tone="brand"
          hint={`of ${formatCurrency(totalAllocated)} allocated`}
        />
        <StatCard
          label="Cost per learner"
          value={formatCurrency(costPerLearner)}
          icon={<Users className="h-5 w-5" />}
          hint={`${formatNumber(totalLearners)} learners`}
        />
        <StatCard
          label="Avg completion rate"
          value={`${orgCompletionRate}%`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="success"
          delta={{ value: "4% vs last qtr", positive: true }}
        />
        <StatCard
          label="Productivity gain (est.)"
          value={`${productivityGain}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="brand"
          hint="Modeled uplift"
        />
        <StatCard
          label="ROI"
          value={`${roi}%`}
          icon={<Percent className="h-5 w-5" />}
          tone={roi >= 100 ? "success" : "warning"}
          hint={`Benefit: ${formatCurrency(totalBenefit)}`}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Spend by category" description="Used vs allocated budget per department">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendByCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                  style={{ fontSize: 10 }}
                >
                  {spendByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                  formatter={(value: number, name: string) => name === "value" ? [formatCurrency(value), "Spend"] : [name, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            {spendByCategory.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {s.name}
                </span>
                <span className="text-muted-foreground">
                  {formatCurrency(s.value)} / {formatCurrency(s.allocated)}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Completion trend" description="Course completions per month" className="lg:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="completions"
                  name="Completions"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="ROI by program" description="Return on investment per training program">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiByProgram} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" unit="%" />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  width={140}
                  tickFormatter={(v: string) => v.length > 22 ? v.slice(0, 20) + "..." : v}
                />
                <RTooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                  formatter={(value: number) => [`${value}%`, "ROI"]}
                />
                <Bar dataKey="roi" name="ROI" radius={[0, 4, 4, 0]}>
                  {roiByProgram.map((p, i) => (
                    <Cell key={i} fill={p.roi >= 100 ? "#10b981" : p.roi >= 50 ? "#f59e0b" : "#f43f5e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Learning hours trend" description="Total hours learned vs target" className="lg:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={learningHoursTrend}>
                <defs>
                  <linearGradient id="hoursRoiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <RTooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Legend verticalAlign="top" height={24} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="hours" name="Hours learned" stroke="#10b981" strokeWidth={2} fill="url(#hoursRoiGrad)" />
                <Line type="monotone" dataKey="target" name="Target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Program-wise ROI breakdown */}
      <SectionCard
        title="Program-wise ROI breakdown"
        description="Detailed ROI per training program for TechCorp India"
      >
        {roiByProgram.length === 0 ? (
          <EmptyState icon={<GraduationCap className="h-5 w-5" />} title="No active programs" description="No training programs for this client yet." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="w-[140px]">Completion</TableHead>
                  <TableHead className="text-right">Est. benefit</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roiByProgram.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/40">
                    <TableCell className="text-sm font-medium max-w-[240px]">
                      <p className="truncate">{p.name}</p>
                    </TableCell>
                    <TableCell className="text-xs capitalize text-muted-foreground">{p.type}</TableCell>
                    <TableCell className="text-sm text-right tabular-nums">{formatCurrency(p.budget)}</TableCell>
                    <TableCell className="text-sm text-right tabular-nums">{p.enrolled}</TableCell>
                    <TableCell className="text-sm text-right tabular-nums">{p.completed}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={p.completionPct} className="h-1.5 w-16" />
                        <span className="text-xs tabular-nums">{p.completionPct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-right tabular-nums text-brand">{formatCurrency(p.benefit)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm font-semibold ${p.roi >= 100 ? "text-emerald-600 dark:text-emerald-400" : p.roi >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {p.roi}%
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Training partner performance */}
      <Card className="border-brand/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-brand" /> Training partner performance
            </CardTitle>
            <Badge variant="outline" className="bg-brand/5 text-brand border-brand/20">Active partner</Badge>
          </div>
          <CardDescription>{trainingCompany.name} delivery performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <AvatarLogo text={trainingCompany.name} size="lg" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{trainingCompany.name}</p>
                <div className="mt-0.5 flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{trainingCompany.rating}</span>
                  <span className="text-xs text-muted-foreground">({formatNumber(trainingCompany.reviewCount)})</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{trainingCompany.corporateClients}+ clients</p>
              </div>
            </div>
            <MetricBlock label="Learners trained" value={formatNumber(trainingCompany.learnersTrained)} icon={<Users className="h-4 w-4" />} />
            <MetricBlock label="Avg completion rate" value="82%" icon={<CheckCircle2 className="h-4 w-4" />} tone="success" />
            <MetricBlock label="On-time delivery" value="94%" icon={<Clock className="h-4 w-4" />} tone="success" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Invoices (this period)</p>
              <p className="mt-1 text-sm font-semibold">{invoices.length} · {formatCurrency(invoices.reduce((s, i) => s + i.total, 0))}</p>
              <div className="mt-1 flex items-center gap-1">
                {invoices.map((i) => (
                  <StatusBadge key={i.id} status={i.status} />
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Active programs</p>
              <p className="mt-1 text-sm font-semibold">{programs.filter((p) => p.status === "active").length} of {programs.length}</p>
              <p className="text-xs text-muted-foreground">For TechCorp India</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Account manager</p>
              <p className="mt-1 text-sm font-semibold">{client.assignedAccountManager}</p>
              <p className="text-xs text-muted-foreground">SkillForge Academy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Methodology */}
      <SectionCard
        title="Methodology & formula captions"
        description="How each metric is calculated — all values are estimates"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormulaCard
            label="Total training spend"
            formula="Σ (budget.used) across all TechCorp India budgets (FY24-25)"
            note="Includes course delivery, content licensing, trainer fees."
          />
          <FormulaCard
            label="Cost per learner"
            formula="totalSpend / employeesEnrolled"
            note="Uses the corporate client's enrolled employee count."
          />
          <FormulaCard
            label="Avg completion rate"
            formula="(completions / enrollments) × 100"
            note="Roll-up across all TechCorp enrollments in the period."
          />
          <FormulaCard
            label="Productivity gain estimate"
            formula="(completionRate × 0.4 + avgScore × 0.2) — modeled uplift"
            note="Heuristic. Real gain requires manager feedback & performance review."
          />
          <FormulaCard
            label="Est. benefit"
            formula="completions × ₹40,000 (per-completion modeled value)"
            note="Conservative estimate based on industry benchmarks for tech upskilling."
          />
          <FormulaCard
            label="ROI %"
            formula="((benefit − trainingCost) / trainingCost) × 100"
            note="Estimate only. Hard ROI requires pre/post performance data."
          />
        </div>
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-amber-700 dark:text-amber-300">Important:</span> ROI figures are illustrative estimates derived from simulated productivity models.
              They do not represent audited financial outcomes. Always corroborate with HR performance reviews, manager feedback, and project outcome data before reporting externally.
            </p>
          </div>
        </div>
      </SectionCard>

      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="h-3 w-3" />
        Powered by {trainingCompany.name} · Data for {client.name} · {DATE_RANGES.find((r) => r.value === range)?.label}
      </p>
    </div>
  );
}

function MetricBlock({
  label, value, icon, tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: "default" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function FormulaCard({ label, formula, note }: { label: string; formula: string; note: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1.5">
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-xs font-medium">{label}</p>
      </div>
      <code className="mt-2 block rounded-md bg-muted/60 px-2 py-1.5 text-[11px] font-mono text-foreground">
        {formula}
      </code>
      <p className="mt-1.5 text-[11px] text-muted-foreground">{note}</p>
    </div>
  );
}
