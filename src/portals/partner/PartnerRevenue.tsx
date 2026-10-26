"use client";

import * as React from "react";
import { partners, programs, revenueSplits, settlements } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer, ChartCard, ChartTooltip, CHART_COLORS } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency, formatNumber } from "@/lib/format";
import { toast } from "sonner";
import { TrendingUp, IndianRupee, Calendar, Download, Award } from "lucide-react";

export function PartnerRevenue() {
  const partner = CURRENT_PARTNER;
  const [range, setRange] = React.useState("6m");
  const [programFilter, setProgramFilter] = React.useState("all");

  // Aggregate revenue splits for this partner
  const partnerSplits = revenueSplits.filter((r) => r.partnerId === partner.id);
  const partnerSettlements = settlements.filter((s) => s.partnerId === partner.id);

  const totalRevenue = partner.revenueYTD + partner.settlementsYTD;
  const thisMonth = Math.round(partner.revenueYTD / 6 * 1.2);
  const lastMonth = Math.round(partner.revenueYTD / 6 * 1.0);
  const growthPct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

  // Revenue trend (6 months synthetic)
  const monthlyAvg = partner.revenueYTD / 6;
  const revenueTrend = [
    { month: "May", revenue: Math.round(monthlyAvg * 0.7), settlements: Math.round(monthlyAvg * 0.5) },
    { month: "Jun", revenue: Math.round(monthlyAvg * 0.85), settlements: Math.round(monthlyAvg * 0.6) },
    { month: "Jul", revenue: Math.round(monthlyAvg * 0.9), settlements: Math.round(monthlyAvg * 0.65) },
    { month: "Aug", revenue: Math.round(monthlyAvg * 1.0), settlements: Math.round(monthlyAvg * 0.75) },
    { month: "Sep", revenue: Math.round(monthlyAvg * 1.1), settlements: Math.round(monthlyAvg * 0.8) },
    { month: "Oct", revenue: thisMonth, settlements: Math.round(monthlyAvg * 0.9) },
  ].slice(range === "3m" ? -3 : range === "12m" ? -12 : -6);

  // Revenue by program
  const revenueByProgramMap: Record<string, number> = {};
  partnerSplits.forEach((s) => {
    revenueByProgramMap[s.programName] = (revenueByProgramMap[s.programName] ?? 0) + s.grossRevenue;
  });
  // Add partner base revenue split across programs
  programs.filter((p) => p.active).slice(0, 5).forEach((p, i) => {
    if (!revenueByProgramMap[p.name]) revenueByProgramMap[p.name] = Math.round(monthlyAvg * (1 + i * 0.2));
  });
  const revenueByProgram = Object.entries(revenueByProgramMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Revenue by source
  const revenueBySource = [
    { name: "Training Programs", value: Math.round(partner.revenueYTD * 0.55) },
    { name: "Services", value: Math.round(partner.revenueYTD * 0.25) },
    { name: "Placements", value: Math.round(partner.revenueYTD * 0.12) },
    { name: "Certifications", value: Math.round(partner.revenueYTD * 0.08) },
  ];

  // Funnel: enrollment → revenue
  const funnel = [
    { stage: "Leads", value: 420 },
    { stage: "Qualified", value: 280 },
    { stage: "Enrolled", value: 180 },
    { stage: "Completed", value: 124 },
    { stage: "Placed", value: 92 },
  ];

  // Top programs
  const topPrograms = revenueByProgram.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Analytics"
        description={`${partner.name} — comprehensive revenue analytics across programs, sources, and time periods.`}
        icon={<Icon name="TrendingUp" className="h-6 w-6" />}
        actions={[
          { label: "Export Report", icon: "Download", variant: "outline", onClick: () => toast.success("Report exporting", { description: "PDF report will be ready shortly." }) },
        ]}
      />
      <PartnerDisclaimer />

      {/* Filters */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Period:</div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-3"><Award className="h-3.5 w-3.5" /> Program:</div>
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="h-8 w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs.filter((p) => p.active).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue (YTD)" value={formatCurrency(totalRevenue)} icon={<IndianRupee className="h-5 w-5" />} tone="brand" delta={{ value: "18% YoY", positive: true }} />
        <StatCard label="This Month" value={formatCurrency(thisMonth)} icon={<IndianRupee className="h-5 w-5" />} tone="success" delta={{ value: `${growthPct}% MoM`, positive: growthPct >= 0 }} />
        <StatCard label="Avg Monthly" value={formatCurrency(Math.round(monthlyAvg))} icon={<Calendar className="h-5 w-5" />} hint="Last 6 months" />
        <StatCard label="Settlements YTD" value={formatCurrency(partner.settlementsYTD)} icon={<TrendingUp className="h-5 w-5" />} hint="Net partner share" />
      </div>

      {/* Revenue trend chart */}
      <ChartCard title="Revenue Trend" description="Gross revenue vs settlements over time">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueTrend}>
            <defs>
              <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-set" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fill="url(#grad-rev)" strokeWidth={2} />
            <Area type="monotone" dataKey="settlements" name="Settlements" stroke="#14b8a6" fill="url(#grad-set)" strokeWidth={2} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by program */}
        <ChartCard title="Revenue by Program" description="Top contributing programs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByProgram} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={120} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]}>
                {revenueByProgram.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue by source */}
        <ChartCard title="Revenue by Source" description="Distribution across business lines">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={revenueBySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                {revenueBySource.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Funnel */}
      <ChartCard title="Enrollment → Revenue Funnel" description="Student journey from lead to placement">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={funnel} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="value" name="Students" radius={[0, 4, 4, 0]}>
              {funnel.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Top programs table */}
      <SectionCard title="Top Programs by Revenue" description="Best performing programs">
        <div className="space-y-2">
          {topPrograms.map((p, i) => (
            <div key={p.name} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatCurrency(p.value)} revenue</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-brand">{((p.value / topPrograms.reduce((s, x) => s + x.value, 0)) * 100).toFixed(1)}%</p>
                <p className="text-[10px] text-muted-foreground">share</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
