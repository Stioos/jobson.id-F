"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  StatCard,
  StatusBadge,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CHART_COLORS, ChartCard, ChartTooltip } from "./_shared";
import { partners, MODEL_LABELS } from "@/lib/partner-data";
import type { PartnerModel } from "@/lib/partner-types";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import {
  BarChart3,
  TrendingUp,
  Users,
  Trophy,
  Star,
  Award,
} from "lucide-react";

const MODEL_COLORS: Record<PartnerModel, string> = {
  CENTRE: CHART_COLORS[0],
  COLLEGE: CHART_COLORS[1],
  SERVICE: CHART_COLORS[2],
  TECHNOLOGY: CHART_COLORS[3],
  AI: CHART_COLORS[4],
  RECRUITMENT: CHART_COLORS[5],
};

// 6-month partner growth trend (synthesized from existing data)
const GROWTH_TREND = [
  { month: "May", partners: 5, revenue: 18200000 },
  { month: "Jun", partners: 5, revenue: 19800000 },
  { month: "Jul", partners: 6, revenue: 21500000 },
  { month: "Aug", partners: 7, revenue: 24200000 },
  { month: "Sep", partners: 7, revenue: 26400000 },
  { month: "Oct", partners: 8, revenue: 27620000 },
];

// Pre-computed module-level aggregates (partners is a stable module-level import)
const REVENUE_BY_MODEL = (() => {
  const map = new Map<PartnerModel, number>();
  for (const p of partners) {
    map.set(p.model, (map.get(p.model) ?? 0) + p.revenueYTD);
  }
  return Array.from(map.entries())
    .map(([model, revenue]) => ({ model, label: MODEL_LABELS[model], revenue }))
    .sort((a, b) => b.revenue - a.revenue);
})();

const TOP_PARTNERS = [...partners]
  .filter((p) => p.revenueYTD > 0)
  .sort((a, b) => b.revenueYTD - a.revenueYTD)
  .slice(0, 10)
  .map((p) => ({ name: p.name, short: p.name.length > 22 ? p.name.slice(0, 22) + "…" : p.name, revenue: p.revenueYTD, model: p.model }));

const MODEL_DISTRIBUTION = (() => {
  const map = new Map<PartnerModel, number>();
  for (const p of partners) {
    map.set(p.model, (map.get(p.model) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([model, count]) => ({
    name: MODEL_LABELS[model],
    value: count,
    color: MODEL_COLORS[model],
  }));
})();

const LEADERBOARD = [...partners]
  .filter((p) => p.rating > 0)
  .sort((a, b) => {
    const scoreA = a.rating * (1 + a.revenueYTD / 10000000);
    const scoreB = b.rating * (1 + b.revenueYTD / 10000000);
    return scoreB - scoreA;
  })
  .slice(0, 8);

export function AdminPartnerPerformance() {
  // KPIs (computed inline — module-level data is stable)
  const totalRevenue = partners.reduce((s, p) => s + p.revenueYTD, 0);
  const partnersWithRatings = partners.filter((p) => p.rating > 0);
  const avgRating = partnersWithRatings.length > 0
    ? partnersWithRatings.reduce((s, p) => s + p.rating, 0) / partnersWithRatings.length
    : 0;
  const totalStudents = partners.reduce((s, p) => s + p.studentsEnrolled, 0);
  const totalGraduated = partners.reduce((s, p) => s + p.studentsGraduated, 0);
  const placementRate = totalStudents > 0 ? Math.round((totalGraduated / totalStudents) * 100) : 0;

  const revenueByModel = REVENUE_BY_MODEL;
  const topPartners = TOP_PARTNERS;
  const modelDistribution = MODEL_DISTRIBUTION;
  const leaderboard = LEADERBOARD;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Performance Analytics"
        description="Network-wide analytics on partner revenue, growth, ratings, and student outcomes."
        icon={<BarChart3 className="h-6 w-6" />}
        breadcrumbs={[{ label: "Platform Admin" }, { label: "Partner Performance" }]}
        actions={[
          { label: "Export Report", variant: "outline", onClick: () => toast.success("Performance report exported", { description: "PDF report generated with all charts and leaderboard." }) },
        ]}
      />

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Partner Revenue"
          value={formatCurrency(totalRevenue)}
          delta={{ value: "4.6% MoM", positive: true }}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="brand"
        />
        <StatCard
          label="Avg Partner Rating"
          value={avgRating.toFixed(2)}
          hint={`From ${partnersWithRatings.length} rated partners`}
          icon={<Star className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Students Trained"
          value={formatNumber(totalStudents)}
          hint={`${formatNumber(totalGraduated)} graduated`}
          icon={<Users className="h-5 w-5" />}
          tone="default"
        />
        <StatCard
          label="Placement Rate"
          value={`${placementRate}%`}
          delta={{ value: "2.1pp YoY", positive: true }}
          icon={<Trophy className="h-5 w-5" />}
          tone="success"
        />
      </section>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Revenue by Partner Model"
          description="YTD revenue contribution per franchise model"
          action={<Button size="sm" variant="ghost" onClick={() => toast.info("Revenue breakdown shown", { description: "Service & Technology partners lead on revenue." })}>Insight</Button>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByModel} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v))} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]}>
                {revenueByModel.map((entry) => (
                  <Cell key={entry.model} fill={MODEL_COLORS[entry.model]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Partner Growth Trend"
          description="Active partners and revenue, last 6 months"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH_TREND} margin={{ left: 8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v))} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
              <Tooltip content={<ChartTooltip />} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke={CHART_COLORS[0]} fill="url(#gRev)" strokeWidth={2} />
              <Area yAxisId="right" type="monotone" dataKey="partners" name="Partners" stroke={CHART_COLORS[1]} fill="url(#gPart)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Top Partners by Revenue"
          description="Highest-grossing partners YTD"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topPartners} margin={{ left: 24, right: 24, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" tickFormatter={(v) => formatCurrency(Number(v))} />
              <YAxis type="category" dataKey="short" tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" width={130} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="revenue" name="Revenue" radius={[0, 6, 6, 0]}>
                {topPartners.map((entry, i) => (
                  <Cell key={i} fill={MODEL_COLORS[entry.model]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Partner Model Distribution"
          description="Active partners by model"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modelDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
              >
                {modelDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
            {modelDistribution.map((m) => (
              <div key={m.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                <span className="text-muted-foreground">{m.name}</span>
                <span className="ml-auto font-medium">{m.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Leaderboard */}
      <SectionCard
        title="Partner Leaderboard"
        description="Top performers ranked by composite rating × revenue score"
        action={<Badge variant="outline" className="gap-1"><Award className="h-3 w-3" />Live ranking</Badge>}
      >
        <div className="max-h-96 overflow-y-auto scroll-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Revenue YTD</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((p, i) => (
                <TableRow key={p.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      i === 0 ? "bg-amber-400/20 text-amber-600 dark:text-amber-400" :
                      i === 1 ? "bg-slate-400/20 text-slate-600 dark:text-slate-300" :
                      i === 2 ? "bg-orange-500/20 text-orange-600 dark:text-orange-400" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={p.name} size="sm" />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.city}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={p.model.toLowerCase()} /></TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(p.revenueYTD)}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.studentsEnrolled > 0 ? formatNumber(p.studentsEnrolled) : "—"}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center gap-1 text-sm tabular-nums">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {p.rating.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(p.joinedAt, { month: "short", year: "numeric" })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
