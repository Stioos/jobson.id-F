"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CHART_COLORS, ChartCard } from "./_shared";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  TrendingUp,
  TrendingDown,
  Banknote,
  Coins,
  Rocket,
  ArrowUpRight,
  Target,
} from "lucide-react";

// ----- Types -----
interface RevenueSource {
  source: string;
  label: string;
  amount: number;
  color: string;
  icon: string;
}

interface TopGenerator {
  id: string;
  name: string;
  type: "employer" | "partner" | "candidate";
  amount: number;
  growth: number;
}

// ----- Mock data -----
const REVENUE_BY_SOURCE: RevenueSource[] = [
  { source: "subscriptions", label: "Subscriptions", amount: 18400000, color: CHART_COLORS[0], icon: "Crown" },
  { source: "job_posts", label: "Job Posts", amount: 6420000, color: CHART_COLORS[1], icon: "Briefcase" },
  { source: "featured", label: "Featured Listings", amount: 3180000, color: CHART_COLORS[2], icon: "Star" },
  { source: "resume_access", label: "Resume Access", amount: 2240000, color: CHART_COLORS[3], icon: "Database" },
  { source: "partner_fees", label: "Partner Fees", amount: 4920000, color: CHART_COLORS[4], icon: "Handshake" },
  { source: "training", label: "Training Programs", amount: 3860000, color: CHART_COLORS[5], icon: "GraduationCap" },
  { source: "placement_commissions", label: "Placement Commissions", amount: 2780000, color: CHART_COLORS[6], icon: "Coins" },
];

const REVENUE_BY_PORTAL = [
  { portal: "Employer", amount: 23400000, color: CHART_COLORS[0] },
  { portal: "Partner", amount: 8420000, color: CHART_COLORS[1] },
  { portal: "Training", amount: 5860000, color: CHART_COLORS[2] },
  { portal: "Candidate", amount: 1840000, color: CHART_COLORS[3] },
  { portal: "Recruiter", amount: 1620000, color: CHART_COLORS[4] },
];

// Monthly revenue trend (last 12 months)
const REVENUE_TREND = [
  { month: "Nov", revenue: 2840000, mrr: 1420000 },
  { month: "Dec", revenue: 3120000, mrr: 1480000 },
  { month: "Jan", revenue: 3480000, mrr: 1540000 },
  { month: "Feb", revenue: 3260000, mrr: 1580000 },
  { month: "Mar", revenue: 3920000, mrr: 1620000 },
  { month: "Apr", revenue: 4180000, mrr: 1680000 },
  { month: "May", revenue: 3840000, mrr: 1740000 },
  { month: "Jun", revenue: 4420000, mrr: 1820000 },
  { month: "Jul", revenue: 4680000, mrr: 1880000 },
  { month: "Aug", revenue: 5120000, mrr: 1940000 },
  { month: "Sep", revenue: 5380000, mrr: 2010000 },
  { month: "Oct", revenue: 5840000, mrr: 2080000 },
];

const TOP_GENERATORS: TopGenerator[] = [
  { id: "tg_1", name: "TechCorp India", type: "employer", amount: 5310000, growth: 12 },
  { id: "tg_2", name: "FinEdge Solutions", type: "employer", amount: 471988, growth: 8 },
  { id: "tg_3", name: "Meridian IT Services", type: "partner", amount: 1536000, growth: 24 },
  { id: "tg_4", name: "Chennai Tech Academy", type: "partner", amount: 1032000, growth: 18 },
  { id: "tg_5", name: "MediCore Health", type: "employer", amount: 17698, growth: -4 },
  { id: "tg_6", name: "Kanchana Institute of Technology", type: "partner", amount: 1120000, growth: 16 },
];

// ----- Component -----
export function AdminPlatformRevenue() {
  const [range, setRange] = React.useState<"ytd" | "qtd" | "mtd">("ytd");

  const totalRevenueYTD = REVENUE_BY_SOURCE.reduce((s, r) => s + r.amount, 0);
  const thisMonth = REVENUE_TREND[REVENUE_TREND.length - 1].revenue;
  const lastMonth = REVENUE_TREND[REVENUE_TREND.length - 2].revenue;
  const monthGrowthPct = ((thisMonth - lastMonth) / lastMonth) * 100;
  const mrr = REVENUE_TREND[REVENUE_TREND.length - 1].mrr;
  const arr = mrr * 12;

  // Forecast (next 3 months — simple linear projection)
  const forecast = React.useMemo(() => {
    const last3 = REVENUE_TREND.slice(-3);
    const avgGrowth = (last3[2].revenue - last3[0].revenue) / 3;
    const out = [
      { month: "Nov", revenue: Math.round(thisMonth + avgGrowth), type: "Forecast" },
      { month: "Dec", revenue: Math.round(thisMonth + avgGrowth * 2), type: "Forecast" },
      { month: "Jan", revenue: Math.round(thisMonth + avgGrowth * 3), type: "Forecast" },
    ];
    return out;
  }, [thisMonth]);

  const trendWithForecast = [
    ...REVENUE_TREND.slice(-6).map((t) => ({ ...t, type: "Actual" })),
    ...forecast,
  ];

  function exportReport() {
    toast.success("Revenue report exported", { description: "platform-revenue-ytd-2024.pdf · 32 pages" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Revenue"
        description="Total platform revenue across all portals — subscriptions, job posts, featured listings, resume access, partner fees, training, and placement commissions."
        icon={<Banknote className="h-6 w-6" />}
        actions={[
          {
            label: "Export",
            variant: "outline",
            onClick: exportReport,
          },
        ]}
      />

      {/* Range selector + KPIs */}
      <div className="flex items-center justify-end">
        <Select value={range} onValueChange={(v) => setRange(v as "ytd" | "qtd" | "mtd")}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ytd">Year to date</SelectItem>
            <SelectItem value="qtd">Quarter to date</SelectItem>
            <SelectItem value="mtd">Month to date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Total Revenue YTD"
          value={formatCurrency(totalRevenueYTD)}
          icon={<Banknote className="h-5 w-5" />}
          tone="brand"
          delta={{ value: "23% YoY", positive: true }}
        />
        <StatCard
          label="This Month"
          value={formatCurrency(thisMonth)}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="success"
          delta={{ value: `${monthGrowthPct.toFixed(1)}% MoM`, positive: monthGrowthPct >= 0 }}
        />
        <StatCard
          label="MRR"
          value={formatCurrency(mrr)}
          icon={<Coins className="h-5 w-5" />}
          tone="default"
          hint="Monthly recurring revenue"
        />
        <StatCard
          label="ARR"
          value={formatCurrency(arr)}
          icon={<Target className="h-5 w-5" />}
          tone="brand"
          hint="Annualized run rate"
        />
      </div>

      {/* Revenue trend chart (with forecast) */}
      <ChartCard
        title="Revenue Trend (6-month actual + 3-month forecast)"
        description="Total platform revenue by month — last 6 actuals with linear forecast for next 3 months."
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendWithForecast} margin={{ left: -8, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[2]} stopOpacity={0.25} />
                <stop offset="100%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [formatCurrency(value), name === "revenue" ? "Revenue" : name]}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload as { type?: string } | undefined;
                return `${label} ${item?.type ? `(${item.type})` : ""}`;
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gRevenue)" name="revenue" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Revenue by source (pie) + by portal (bar) */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Revenue by Source"
          description="YTD distribution across all revenue streams."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={REVENUE_BY_SOURCE}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                paddingAngle={2}
              >
                {REVENUE_BY_SOURCE.map((entry) => (
                  <Cell key={entry.source} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue by Portal"
          description="YTD gross revenue per portal."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_BY_PORTAL} margin={{ left: -8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="portal" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}Cr`}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="amount" name="Revenue" radius={[4, 4, 0, 0]}>
                {REVENUE_BY_PORTAL.map((entry) => (
                  <Cell key={entry.portal} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Revenue by source — detailed list */}
      <SectionCard
        title="Revenue by Source (Detailed)"
        description="All revenue streams with contribution to total YTD."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {REVENUE_BY_SOURCE.map((s) => {
            const pct = (s.amount / totalRevenueYTD) * 100;
            return (
              <div key={s.source} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${s.color}20`, color: s.color }}
                    >
                      <Icon name={s.icon} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{pct.toFixed(1)}% of total</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(s.amount)}</p>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Top revenue generators */}
      <SectionCard
        title="Top Revenue Generators"
        description="Highest paying customers and revenue-generating partners."
        action={
          <Button variant="outline" size="sm" onClick={() => toast.info("Showing all generators")}>
            View all
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Revenue YTD</TableHead>
                <TableHead className="text-right">Growth</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_GENERATORS.map((g, i) => {
                const share = (g.amount / totalRevenueYTD) * 100;
                return (
                  <TableRow key={g.id}>
                    <TableCell className="text-xs text-muted-foreground">#{i + 1}</TableCell>
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {g.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(g.amount)}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          g.growth >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {g.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(g.growth)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{share.toFixed(2)}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* MRR / ARR + Forecast */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="MRR / ARR" description="Recurring revenue metrics.">
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">MRR (Monthly Recurring)</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-brand">{formatCurrency(mrr)}</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+3.5% MoM · +14.2% YoY</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">ARR (Annualized Run Rate)</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{formatCurrency(arr)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(new Date().toISOString())} snapshot</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Net Revenue Retention</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">108.4%</p>
              <p className="mt-1 text-xs text-muted-foreground">Includes expansions, minus churn</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Revenue Forecast (3-month)"
          description="Linear projection based on last 3 months trend."
          className="lg:col-span-2"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {forecast.map((f) => (
              <Card key={f.month} className="border-brand/30 bg-brand/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{f.month}</p>
                    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      Forecast
                    </Badge>
                  </div>
                  <p className="mt-2 text-xl font-bold tracking-tight text-brand">{formatCurrency(f.revenue)}</p>
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    Projected growth
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            <Rocket className="mr-1 inline h-3.5 w-3.5 text-amber-500" />
            <span className="font-medium text-amber-700 dark:text-amber-400">Forecast disclaimer:</span> Linear projection based on last 3 months actuals. Actual results may vary based on seasonality, market conditions, and pipeline. Not a financial commitment.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
