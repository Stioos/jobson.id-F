"use client";

import * as React from "react";
import {
  PageHeader, SectionCard, Card, CardContent, StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";

interface CategoryCost {
  name: string;
  amount: number;
  pct: number;
  icon: string;
}

const CATEGORIES: CategoryCost[] = [
  { name: "Agency Fees", amount: 1850000, pct: 38, icon: "Briefcase" },
  { name: "Job Ads", amount: 620000, pct: 13, icon: "Megaphone" },
  { name: "Referral Bonus", amount: 480000, pct: 10, icon: "Gift" },
  { name: "Assessment Tools", amount: 360000, pct: 7, icon: "ClipboardCheck" },
  { name: "Background Checks", amount: 240000, pct: 5, icon: "ShieldCheck" },
  { name: "Internal Recruiter Time", amount: 1320000, pct: 27, icon: "Users" },
];

const DEPARTMENTS = [
  { name: "Engineering", hires: 24, cost: 1640000, avg: 68333 },
  { name: "Sales", hires: 18, cost: 720000, avg: 40000 },
  { name: "Product", hires: 8, cost: 560000, avg: 70000 },
  { name: "Marketing", hires: 6, cost: 240000, avg: 40000 },
  { name: "Operations", hires: 12, cost: 360000, avg: 30000 },
  { name: "HR", hires: 4, cost: 200000, avg: 50000 },
  { name: "Finance", hires: 5, cost: 250000, avg: 50000 },
  { name: "Customer Success", hires: 14, cost: 560000, avg: 40000 },
];

const MONTHLY_TREND = [
  { m: "May", cost: 380000, hires: 8 },
  { m: "Jun", cost: 420000, hires: 9 },
  { m: "Jul", cost: 510000, hires: 11 },
  { m: "Aug", cost: 460000, hires: 10 },
  { m: "Sep", cost: 540000, hires: 12 },
  { m: "Oct", cost: 590000, hires: 13 },
];

const CHANNELS = [
  { channel: "Job Boards", cost: 620000, hires: 22, costPerHire: 28182 },
  { channel: "Agency", cost: 1850000, hires: 14, costPerHire: 132143 },
  { channel: "Referrals", cost: 480000, hires: 18, costPerHire: 26667 },
  { channel: "Social / LinkedIn", cost: 320000, hires: 9, costPerHire: 35556 },
  { channel: "Careers Page", cost: 90000, hires: 6, costPerHire: 15000 },
  { channel: "Internal Recruiter", cost: 1320000, hires: 11, costPerHire: 120000 },
];

export function EmployerCostPerHire() {
  const totalHires = DEPARTMENTS.reduce((s, d) => s + d.hires, 0);
  const totalSpend = DEPARTMENTS.reduce((s, d) => s + d.cost, 0);
  const avgCPH = Math.round(totalSpend / totalHires);
  const lowest = DEPARTMENTS.reduce((min, d) => (d.avg < min.avg ? d : min), DEPARTMENTS[0]);
  const highest = DEPARTMENTS.reduce((max, d) => (d.avg > max.avg ? d : max), DEPARTMENTS[0]);

  const firstYearRevenue = 9800000;
  const roi = ((firstYearRevenue - totalSpend) / totalSpend) * 100;

  const maxDeptAvg = Math.max(...DEPARTMENTS.map((d) => d.avg));
  const maxTrendCost = Math.max(...MONTHLY_TREND.map((m) => m.cost));
  const maxChannelCPH = Math.max(...CHANNELS.map((c) => c.costPerHire));

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Cost per Hire Analytics"
        description="Analyze hiring spend by category, department, channel and time. Calculate ROI vs first-year revenue."
        icon={<Icon name="TrendingDown" className="h-6 w-6" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg Cost / Hire" value={formatCurrency(avgCPH)} delta={{ value: "4.2% vs Q2", positive: false }} icon={<Icon name="TrendingDown" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Hiring Spend" value={formatCurrency(totalSpend)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="default" />
        <StatCard label="Lowest Cost Dept" value={lowest.name} hint={`${formatCurrency(lowest.avg)} per hire`} icon={<Icon name="TrendingDown" className="h-5 w-5" />} tone="success" />
        <StatCard label="Highest Cost Dept" value={highest.name} hint={`${formatCurrency(highest.avg)} per hire`} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Cost Breakdown by Category" description="Where every rupee of hiring spend goes.">
        <div className="grid gap-3 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <Card key={c.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
                    <Icon name={c.icon} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(c.amount)} · {c.pct}%</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(c.amount)}</span>
              </div>
              <Progress value={c.pct} className="mt-3 h-2" />
            </Card>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Cost per Hire by Department" description="Average cost per hire across departments (bar chart).">
        <div className="space-y-3">
          {DEPARTMENTS.map((d) => (
            <div key={d.name} className="grid grid-cols-12 items-center gap-3 text-sm">
              <div className="col-span-3 font-medium">{d.name}</div>
              <div className="col-span-6">
                <div className="h-7 w-full rounded-md bg-muted/40">
                  <div className="h-full rounded-md bg-brand/80" style={{ width: `${(d.avg / maxDeptAvg) * 100}%` }} />
                </div>
              </div>
              <div className="col-span-3 text-right">
                <span className="font-semibold">{formatCurrency(d.avg)}</span>
                <span className="ml-2 text-xs text-muted-foreground">{d.hires} hires</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Monthly Cost Trend" description="Total hiring spend per month.">
          <div className="flex h-56 items-end gap-3">
            {MONTHLY_TREND.map((m) => (
              <div key={m.m} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-md bg-brand/70 transition-all hover:bg-brand" style={{ height: `${(m.cost / maxTrendCost) * 100}%` }} title={`${formatCurrency(m.cost)}`} />
                </div>
                <span className="text-xs text-muted-foreground">{m.m}</span>
                <span className="text-xs font-medium">{formatCurrency(m.cost)}</span>
                <span className="text-[10px] text-muted-foreground">{m.hires} hires</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="ROI Calculation" description="Hiring spend vs first-year revenue generated by new hires.">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Card className="p-3"><p className="text-xs uppercase text-muted-foreground">Hiring Cost</p><p className="mt-1 text-lg font-semibold text-rose-600">{formatCurrency(totalSpend)}</p></Card>
              <Card className="p-3"><p className="text-xs uppercase text-muted-foreground">Y1 Revenue (new hires)</p><p className="mt-1 text-lg font-semibold text-emerald-600">{formatCurrency(firstYearRevenue)}</p></Card>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Net ROI</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">+{roi.toFixed(1)}%</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">For every ₹1 spent on hiring, the org gains ₹{((firstYearRevenue) / totalSpend).toFixed(2)} in first-year revenue.</p>
            </div>
            <div className="text-xs text-muted-foreground">Net gain: <span className="font-semibold text-foreground">{formatCurrency(firstYearRevenue - totalSpend)}</span></div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Channel-wise Cost Comparison" description="Cost per hire by sourcing channel.">
        <div className="space-y-3">
          {CHANNELS.map((c) => (
            <div key={c.channel} className="grid grid-cols-12 items-center gap-3 text-sm">
              <div className="col-span-3 font-medium">{c.channel}</div>
              <div className="col-span-5">
                <div className="h-6 w-full rounded-md bg-muted/40">
                  <div className="flex h-full items-center justify-end rounded-md px-2 text-[10px] font-medium text-white" style={{ width: `${(c.costPerHire / maxChannelCPH) * 100}%`, background: c.costPerHire > 100000 ? "rgb(244 63 94 / 0.7)" : c.costPerHire > 30000 ? "rgb(245 158 11 / 0.7)" : "rgb(16 185 129 / 0.7)" }}>
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-right text-xs text-muted-foreground">{c.hires} hires · {formatCurrency(c.cost)}</div>
              <div className="col-span-2 text-right font-semibold">{formatCurrency(c.costPerHire)}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-3 rounded bg-emerald-500/70" /> Low (under ₹30K)</span>
          <span className="flex items-center gap-1"><span className="h-2 w-3 rounded bg-amber-500/70" /> Medium (₹30K–100K)</span>
          <span className="flex items-center gap-1"><span className="h-2 w-3 rounded bg-rose-500/70" /> High (above ₹100K)</span>
        </div>
      </SectionCard>
    </div>
  );
}
