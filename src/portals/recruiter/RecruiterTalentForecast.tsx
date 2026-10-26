"use client";

import * as React from "react";
import {
  TrendingUp, AlertTriangle, Users, Briefcase, Clock, Target, Zap,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";
import { PageHeader, SectionCard, StatCard, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartCard, ChartTooltip } from "../training/_shared";
import { toast } from "sonner";

interface ForecastRow {
  role: string;
  openPositions: number;
  inPipeline: number;
  expectedHires: number;
  avgTimeToFill: number;
  funnel: { sourced: number; screened: number; submitted: number; interviewed: number; offered: number; hired: number };
}

interface SkillDemand { skill: string; demand: number; supply: number; }
interface MonthForecast { month: string; hires: number; target: number; }

const ROLES: ForecastRow[] = [
  { role: "Senior Frontend Engineer", openPositions: 6, inPipeline: 24, expectedHires: 5, avgTimeToFill: 38, funnel: { sourced: 80, screened: 48, submitted: 24, interviewed: 14, offered: 7, hired: 5 } },
  { role: "DevOps Engineer", openPositions: 4, inPipeline: 12, expectedHires: 3, avgTimeToFill: 52, funnel: { sourced: 40, screened: 22, submitted: 12, interviewed: 6, offered: 4, hired: 3 } },
  { role: "ML Engineer", openPositions: 3, inPipeline: 9, expectedHires: 2, avgTimeToFill: 65, funnel: { sourced: 30, screened: 14, submitted: 9, interviewed: 5, offered: 3, hired: 2 } },
  { role: "Backend Engineer", openPositions: 8, inPipeline: 32, expectedHires: 6, avgTimeToFill: 32, funnel: { sourced: 110, screened: 64, submitted: 32, interviewed: 18, offered: 9, hired: 6 } },
  { role: "Data Analyst", openPositions: 5, inPipeline: 18, expectedHires: 4, avgTimeToFill: 28, funnel: { sourced: 70, screened: 38, submitted: 18, interviewed: 10, offered: 6, hired: 4 } },
  { role: "Product Manager", openPositions: 2, inPipeline: 7, expectedHires: 2, avgTimeToFill: 48, funnel: { sourced: 22, screened: 12, submitted: 7, interviewed: 4, offered: 3, hired: 2 } },
];

const SKILL_DEMAND: SkillDemand[] = [
  { skill: "React", demand: 92, supply: 78 },
  { skill: "Python", demand: 88, supply: 65 },
  { skill: "Kubernetes", demand: 84, supply: 42 },
  { skill: "AWS", demand: 80, supply: 60 },
  { skill: "TensorFlow", demand: 70, supply: 30 },
  { skill: "GraphQL", demand: 62, supply: 48 },
  { skill: "TypeScript", demand: 86, supply: 72 },
];

const MONTHLY: MonthForecast[] = [
  { month: "May", hires: 4, target: 5 },
  { month: "Jun", hires: 6, target: 5 },
  { month: "Jul", hires: 5, target: 6 },
  { month: "Aug", hires: 7, target: 6 },
  { month: "Sep", hires: 8, target: 7 },
  { month: "Oct", hires: 9, target: 8 },
  { month: "Nov", hires: 6, target: 9 },
  { month: "Dec", hires: 5, target: 8 },
];

const FUNNEL_STAGES = [
  { key: "sourced", label: "Sourced", color: "bg-brand/20" },
  { key: "screened", label: "Screened", color: "bg-brand/40" },
  { key: "submitted", label: "Submitted", color: "bg-brand/60" },
  { key: "interviewed", label: "Interviewed", color: "bg-brand/75" },
  { key: "offered", label: "Offered", color: "bg-brand" },
  { key: "hired", label: "Hired", color: "bg-emerald-600" },
] as const;

function conversionRate(a: number, b: number) { return b === 0 ? 0 : Math.round((a / b) * 100); }
function bottleneckStage(f: ForecastRow["funnel"]) {
  const stages = [
    { label: "Sourced→Screened", rate: conversionRate(f.screened, f.sourced) },
    { label: "Screened→Submitted", rate: conversionRate(f.submitted, f.screened) },
    { label: "Submitted→Interviewed", rate: conversionRate(f.interviewed, f.submitted) },
    { label: "Interviewed→Offered", rate: conversionRate(f.offered, f.interviewed) },
    { label: "Offered→Hired", rate: conversionRate(f.hired, f.offered) },
  ];
  return stages.reduce((min, s) => s.rate < min.rate ? s : min, stages[0]);
}

export function RecruiterTalentForecast() {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const totalOpen = ROLES.reduce((s, r) => s + r.openPositions, 0);
  const totalPipeline = ROLES.reduce((s, r) => s + r.inPipeline, 0);
  const totalExpected = ROLES.reduce((s, r) => s + r.expectedHires, 0);
  const avgTime = Math.round(ROLES.reduce((s, r) => s + r.avgTimeToFill, 0) / ROLES.length);
  const overallGap = totalOpen - totalExpected;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Pipeline Forecast"
        description="Pipeline forecasting by role: expected hires vs open positions, funnel conversion, bottleneck detection, and demand vs supply by skill."
        icon={<Icon name="TrendingUp" className="h-6 w-6" />}
        actions={[
          { label: "Export forecast", icon: "Download", variant: "outline", onClick: () => toast.success("Export started", { description: "talent-forecast.xlsx" }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Open positions" value={totalOpen} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Candidates in pipeline" value={totalPipeline} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Expected hires (90d)" value={totalExpected} icon={<Target className="h-5 w-5" />} tone={overallGap > 0 ? "warning" : "success"} />
        <StatCard label="Avg time-to-fill" value={`${avgTime}d`} icon={<Clock className="h-5 w-5" />} />
      </div>

      {overallGap > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Hiring gap detected: {overallGap} positions unfilled</p>
            <p className="text-xs text-muted-foreground mt-0.5">At current pace, you'll fill {totalExpected} of {totalOpen} open positions in the next 90 days. Recommend sourcing {overallGap} more candidates or opening new talent channels.</p>
          </div>
        </div>
      )}

      <SectionCard title="Forecast by job role" description="Click a role to drill into funnel and bottleneck analysis">
        <div className="space-y-3">
          {ROLES.map((r) => {
            const gap = r.openPositions - r.expectedHires;
            const isOpen = selectedRole === r.role;
            const bn = bottleneckStage(r.funnel);
            return (
              <Card key={r.role} className={isOpen ? "border-brand" : ""}>
                <CardContent className="p-4">
                  <button className="w-full text-left" onClick={() => setSelectedRole(isOpen ? null : r.role)}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{r.role}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{r.inPipeline} in pipeline · avg {r.avgTimeToFill}d to fill</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="text-center"><p className="font-semibold">{r.openPositions}</p><p className="text-muted-foreground">Open</p></div>
                        <div className="text-center"><p className="font-semibold">{r.expectedHires}</p><p className="text-muted-foreground">Expected</p></div>
                        <Badge variant="outline" className={gap > 0 ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"}>
                          {gap > 0 ? `Gap: ${gap}` : "On track"}
                        </Badge>
                      </div>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="mt-4 grid gap-4 lg:grid-cols-2 border-t pt-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Pipeline funnel</p>
                        <div className="space-y-2">
                          {FUNNEL_STAGES.map((s, i) => {
                            const val = r.funnel[s.key];
                            const prev = i === 0 ? val : r.funnel[FUNNEL_STAGES[i - 1].key];
                            const conv = i === 0 ? 100 : conversionRate(val, prev);
                            return (
                              <div key={s.key}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="font-medium">{s.label}</span>
                                  <span className="text-muted-foreground">{val} {i > 0 && <span className="ml-1 text-emerald-600">({conv}%)</span>}</span>
                                </div>
                                <div className="h-6 rounded-md bg-muted overflow-hidden">
                                  <div className={`h-full ${s.color} flex items-center pl-2`}>
                                    <span className="text-[10px] font-bold text-white drop-shadow">{val}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Bottleneck & prediction</p>
                        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-rose-600" />
                            <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Bottleneck: {bn.label}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Conversion rate of {bn.rate}% is the lowest in this pipeline. Focus recruiter effort here to improve throughput.</p>
                        </div>
                        <div className="mt-3 rounded-lg border p-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Expected vs open</span>
                            <span className="font-medium">{r.expectedHires}/{r.openPositions}</span>
                          </div>
                          <Progress value={(r.expectedHires / r.openPositions) * 100} className="h-1.5 [&>div]:bg-brand" />
                          <p className="text-xs text-muted-foreground mt-2">Predicted fill: {Math.round((r.expectedHires / r.openPositions) * 100)}% by {new Date(Date.now() + 90 * 86400000).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly hires vs target" description="Last 8 months — track actual vs target hires">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MONTHLY} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="hires" name="Actual hires" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Demand vs supply by skill" description="Skills with high demand / low supply are sourcing priorities">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SKILL_DEMAND} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="skill" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="demand" name="Demand" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="supply" name="Supply" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionCard title="Sourcing priority recommendations" description="AI-ranked actions to close the hiring gap">
        <div className="space-y-2">
          {SKILL_DEMAND.filter((s) => s.demand - s.supply > 15).map((s) => (
            <div key={s.skill} className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-600"><TrendingUp className="h-4 w-4" /></div>
                <div>
                  <p className="text-sm font-medium">{s.skill}</p>
                  <p className="text-xs text-muted-foreground">Demand {s.demand} / Supply {s.supply} · gap of {s.demand - s.supply}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20">High priority</Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
