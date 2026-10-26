"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader, SectionCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
  LineChart, Line,
} from "recharts";
import { Briefcase, Users, TrendingUp, Clock, Banknote, Download } from "lucide-react";
import { toast } from "sonner";
import {
  ENTERPRISE_ENTITIES, CHART_COLORS as COLORS,
  ChartCard, ChartTooltip, TenantDisclaimer, SimulatedBadge, formatCompactCurrency,
} from "./_shared";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const reportSchema = z.object({
  name: z.string().min(2, "Required"),
  entity: z.string().min(1, "Required"),
  metrics: z.array(z.string()),
  groupBy: z.string().min(1, "Required"),
  notes: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const ALL_METRICS = ["Open reqs", "Applications", "Hires", "Time-to-hire", "Cost-per-hire", "Offer acceptance"];

export function EnterpriseAnalytics() {
  const [entityId, setEntityId] = React.useState("e_001");
  const [compareLeft, setCompareLeft] = React.useState("e_001");
  const [compareRight, setCompareRight] = React.useState("e_apac");
  const [reportOpen, setReportOpen] = React.useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { name: "", entity: "e_001", metrics: ["Open reqs", "Applications"], groupBy: "department", notes: "" },
  });
  const entityWatch = useWatch({ control: form.control, name: "entity" });
  const groupByWatch = useWatch({ control: form.control, name: "groupBy" });
  const metricsWatch = useWatch({ control: form.control, name: "metrics" });

  const entity = ENTERPRISE_ENTITIES.find((e) => e.id === entityId)!;

  const kpis = React.useMemo(() => {
    // deterministic per-entity numbers
    const seed = entityId.charCodeAt(entityId.length - 1);
    const rnd = (n: number) => ((seed * 7 + n * 13) % 100) / 100;
    return [
      { key: "open_reqs", label: "Open reqs", value: entity.openReqs, formula: "Σ active published jobs", icon: Briefcase, hint: `${entity.name}` },
      { key: "applications", label: "Applications", value: 240 + Math.round(rnd(1) * 180), formula: "Σ all applications in period", icon: Users, hint: "Last 30 days" },
      { key: "hires", label: "Hires", value: 6 + Math.round(rnd(2) * 12), formula: "Σ status=hired in period", icon: TrendingUp, hint: "Last 30 days" },
      { key: "tth", label: "Avg time-to-hire", value: `${28 + Math.round(rnd(3) * 16)}d`, formula: "Median(appliedAt → hiredAt)", icon: Clock, hint: "Last 90 days" },
      { key: "cph", label: "Cost per hire", value: formatCompactCurrency(180000 + Math.round(rnd(4) * 120000)), formula: "Total spend / # hires", icon: Banknote, hint: "All-in cost" },
      { key: "offer_accept", label: "Offer acceptance", value: `${78 + Math.round(rnd(5) * 18)}%`, formula: "Σ accepted / Σ sent offers", icon: TrendingUp, hint: "Last 90 days" },
    ];
  }, [entity, entityId]);

  const byDept = [
    { department: "Engineering", open: 14, apps: 120, hires: 5, tth: 32, cph: 220000 },
    { department: "Product", open: 6, apps: 48, hires: 2, tth: 41, cph: 180000 },
    { department: "Go-to-Market", open: 8, apps: 64, hires: 4, tth: 28, cph: 140000 },
    { department: "Operations", open: 4, apps: 28, hires: 1, tth: 36, cph: 120000 },
    { department: "People", open: 2, apps: 18, hires: 1, tth: 30, cph: 100000 },
  ];

  const radarData = [
    { metric: "Speed", entity: entity.name.replace("TechCorp ", ""), ideal: 90 },
    { metric: "Cost", entity: 72, ideal: 90 },
    { metric: "Quality", entity: 84, ideal: 90 },
    { metric: "Diversity", entity: 78, ideal: 90 },
    { metric: "Reach", entity: 65, ideal: 90 },
    { metric: "Retention", entity: 88, ideal: 90 },
  ];

  const trend = [
    { month: "May", apps: 86, hires: 4 },
    { month: "Jun", apps: 102, hires: 5 },
    { month: "Jul", apps: 118, hires: 7 },
    { month: "Aug", apps: 95, hires: 6 },
    { month: "Sep", apps: 132, hires: 8 },
    { month: "Oct", apps: 144, hires: 9 },
  ];

  const left = ENTERPRISE_ENTITIES.find((e) => e.id === compareLeft)!;
  const right = ENTERPRISE_ENTITIES.find((e) => e.id === compareRight)!;
  const compareData = [
    { metric: "Open reqs", [left.name]: left.openReqs, [right.name]: right.openReqs },
    { metric: "Headcount", [left.name]: Math.round(left.headcount / 10), [right.name]: Math.round(right.headcount / 10) },
    { metric: "Apps/mo", [left.name]: 120 + (left.id.charCodeAt(left.id.length - 1) % 5) * 20, [right.name]: 60 + (right.id.charCodeAt(right.id.length - 1) % 5) * 18 },
    { metric: "Hires/mo", [left.name]: 8 + (left.id.charCodeAt(left.id.length - 1) % 4), [right.name]: 3 + (right.id.charCodeAt(right.id.length - 1) % 3) },
  ];

  function onSubmit(values: ReportFormValues) {
    setReportOpen(false);
    form.reset();
    toast.success(`Report “${values.name}” queued`, {
      description: `Entity: ${ENTERPRISE_ENTITIES.find((e) => e.id === values.entity)?.name} · ${values.metrics.length} metrics · group by ${values.groupBy}`,
    });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Analytics"
        description="Cross-entity department-wise recruitment analytics with comparison & custom report builder."
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[
          { label: "Export", icon: "Download", variant: "outline", onClick: () => toast.success("Analytics exported (CSV, demo)") },
          { label: "Custom report", icon: "FileBarChart", onClick: () => setReportOpen(true) },
        ]}
      />

      <TenantDisclaimer />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Entity:</span>
        <Select value={entityId} onValueChange={setEntityId}>
          <SelectTrigger className="h-9 w-[240px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ENTERPRISE_ENTITIES.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SimulatedBadge className="ml-2" />
      </div>

      {/* KPIs with formula tooltips */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.key} className="rounded-xl border bg-card p-4 sm:p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.label}</p>
              <UITooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help text-xs text-muted-foreground">ⓘ</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs font-medium">{k.formula}</p>
                </TooltipContent>
              </UITooltip>
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="By department" description="Open reqs vs applications vs hires" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byDept}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="department" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="open" name="Open reqs" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="apps" name="Applications" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="hires" name="Hires" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Health radar" description="Hiring health dimensions vs ideal">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius={75}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" className="text-xs" />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar name={entity.name} dataKey="entity" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Radar name="Ideal" dataKey="ideal" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeDasharray="4 4" />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Tooltip content={<ChartTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Applications vs hires trend" description="6-month rolling" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="apps" name="Applications" stroke={COLORS[1]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="hires" name="Hires" stroke={COLORS[0]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Cost per hire by department" description="All-in cost (₹)">
          <ul className="space-y-2">
            {byDept.sort((a, b) => b.cph - a.cph).map((d) => (
              <li key={d.department} className="flex items-center justify-between text-sm">
                <span>{d.department}</span>
                <span className="font-medium">{formatCompactCurrency(d.cph)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Compare entities */}
      <SectionCard title="Compare entities" description="Side-by-side comparison of two entities across key metrics.">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Select value={compareLeft} onValueChange={setCompareLeft}>
            <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ENTERPRISE_ENTITIES.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">vs</span>
          <Select value={compareRight} onValueChange={setCompareRight}>
            <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ENTERPRISE_ENTITIES.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <AvatarLogo text={left.logo} size="sm" />
              <div>
                <p className="text-sm font-medium">{left.name}</p>
                <p className="text-xs text-muted-foreground">{left.city}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <AvatarLogo text={right.logo} size="sm" />
              <div>
                <p className="text-sm font-medium">{right.name}</p>
                <p className="text-xs text-muted-foreground">{right.city}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-brand/5 p-4">
            <p className="text-xs uppercase text-brand">Verdict</p>
            <p className="mt-1 text-sm font-medium">
              {left.openReqs > right.openReqs ? left.name : right.name} leads in open requisitions.
            </p>
          </div>
        </div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="metric" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey={left.name} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey={right.name} fill={COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Metric formulas reference */}
      <SectionCard title="Metric definitions" description="Formulas for every KPI in this report.">
        <ul className="grid gap-2 sm:grid-cols-2">
          {kpis.map((k) => (
            <li key={k.key} className="rounded-md border p-2.5">
              <p className="text-sm font-medium">{k.label}</p>
              <p className="text-xs text-muted-foreground"><code className="rounded bg-muted px-1.5 py-0.5">{k.formula}</code></p>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Custom report dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Custom report builder</DialogTitle>
            <DialogDescription>Configure and queue a custom analytics report for download.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Field label="Report name" error={form.formState.errors.name?.message}>
              <Input {...form.register("name")} placeholder="Q3 Engineering hiring snapshot" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Entity">
                <Select value={entityWatch} onValueChange={(v) => form.setValue("entity", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ENTERPRISE_ENTITIES.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Group by">
                <Select value={groupByWatch} onValueChange={(v) => form.setValue("groupBy", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="entity">Entity</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Metrics">
              <div className="grid grid-cols-2 gap-2">
                {ALL_METRICS.map((m) => {
                  const checked = metricsWatch.includes(m);
                  return (
                    <label key={m} className="flex items-center gap-2 rounded-md border p-2 cursor-pointer hover:bg-muted/50">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => {
                          const cur = form.getValues("metrics");
                          form.setValue("metrics", checked ? cur.filter((x) => x !== m) : [...cur, m]);
                        }}
                      />
                      <span className="text-xs">{m}</span>
                    </label>
                  );
                })}
              </div>
            </Field>
            <Field label="Notes (optional)">
              <Textarea {...form.register("notes")} rows={2} placeholder="Report scope, filters, recipients..." />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <Download className="mr-1 h-4 w-4" /> Queue report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
