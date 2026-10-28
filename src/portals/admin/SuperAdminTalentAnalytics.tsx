"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatNumber } from "@/lib/format";

const TOP_SKILLS = [
  { skill: "React", supply: 84200, demand: 124800, gap: -40600 },
  { skill: "Python", supply: 142800, demand: 168400, gap: -25600 },
  { skill: "AWS", supply: 62400, demand: 88200, gap: -25800 },
  { skill: "TypeScript", supply: 48200, demand: 72400, gap: -24200 },
  { skill: "Node.js", supply: 58400, demand: 74200, gap: -15800 },
  { skill: "Kubernetes", supply: 28400, demand: 48200, gap: -19800 },
  { skill: "Machine Learning", supply: 32400, demand: 58400, gap: -26000 },
  { skill: "DevOps", supply: 38400, demand: 56800, gap: -18400 },
  { skill: "Salesforce", supply: 24800, demand: 18400, gap: 6400 },
  { skill: "Java", supply: 124800, demand: 108400, gap: 16400 },
  { skill: "UI/UX Design", supply: 38200, demand: 42800, gap: -4600 },
  { skill: "Data Engineering", supply: 28400, demand: 44200, gap: -15800 },
];

const LOCATIONS = [
  { city: "Bengaluru", pct: 28, count: 358_400 },
  { city: "Hyderabad", pct: 18, count: 230_400 },
  { city: "Pune", pct: 14, count: 179_200 },
  { city: "Mumbai", pct: 12, count: 153_600 },
  { city: "Delhi NCR", pct: 11, count: 140_800 },
  { city: "Chennai", pct: 9, count: 115_200 },
  { city: "Remote", pct: 5, count: 64_000 },
  { city: "Others", pct: 3, count: 38_400 },
];

const EXPERIENCE = [
  { range: "0-2 years", pct: 22, count: 281_600 },
  { range: "3-5 years", pct: 32, count: 409_600 },
  { range: "6-8 years", pct: 24, count: 307_200 },
  { range: "9-12 years", pct: 14, count: 179_200 },
  { range: "13+ years", pct: 8, count: 102_400 },
];

export function SuperAdminTalentAnalytics() {
  const total = 1_280_000;
  const active = 284_820;
  const passive = total - active;
  const activePct = (active / total) * 100;
  const shortSupply = TOP_SKILLS.filter(s => s.gap < 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Analytics"
        description="Talent marketplace analytics hub — total candidates, growth, skill distribution, supply-demand gaps, and marketplace health."
        icon={<Icon name="BarChart3" className="h-6 w-6" />}
        actions={[{ label: "Analytics Report", variant: "outline", onClick: () => toast.success("Talent analytics report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Talent" value={formatNumber(total)} delta={{ value: "+8.4% MoM", positive: true }} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active (30d)" value={formatNumber(active)} delta={{ value: "+5.2%", positive: true }} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Passive" value={formatNumber(passive)} icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Short-Supply Skills" value={shortSupply.toString()} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Top 12 Skills — Supply vs Demand" description="Identifies talent shortages and surpluses">
        <div className="space-y-2.5">
          {TOP_SKILLS.map(s => {
            const max = Math.max(s.supply, s.demand);
            return (
              <div key={s.skill}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.skill}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">Supply: {s.supply.toLocaleString("en-IN")}</span>
                    <span className="text-amber-700">Demand: {s.demand.toLocaleString("en-IN")}</span>
                    <span className={`font-semibold ${s.gap < 0 ? "text-rose-700" : "text-emerald-700"}`}>{s.gap > 0 ? "+" : ""}{s.gap.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="mt-1 flex h-2 gap-0.5">
                  <div className="bg-emerald-500/70 rounded-l" style={{ width: `${(s.supply / max) * 50}%` }} />
                  <div className="bg-amber-500/70 rounded-r" style={{ width: `${(s.demand / max) * 50}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500/70" /> Supply</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500/70" /> Demand</span>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Location Distribution" description="Talent by city">
          <div className="space-y-2.5">
            {LOCATIONS.map(l => (
              <div key={l.city}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{l.city}</span>
                  <span className="text-muted-foreground">{l.count.toLocaleString("en-IN")} <span className="text-xs">({l.pct}%)</span></span>
                </div>
                <Progress className="mt-1 h-2" value={l.pct * 3} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Experience Distribution" description="Talent by years of experience">
          <div className="space-y-2.5">
            {EXPERIENCE.map(e => (
              <div key={e.range}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{e.range}</span>
                  <span className="text-muted-foreground">{e.count.toLocaleString("en-IN")} <span className="text-xs">({e.pct}%)</span></span>
                </div>
                <Progress className="mt-1 h-2" value={e.pct * 3} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Active vs Passive Ratio" description="Engagement health of the talent pool">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex h-8 overflow-hidden rounded-md">
              <div className="bg-emerald-600/80 flex items-center justify-center text-xs font-medium text-white" style={{ width: `${activePct}%` }}>{activePct.toFixed(1)}% Active</div>
              <div className="bg-slate-400/60 flex items-center justify-center text-xs font-medium text-white" style={{ width: `${100 - activePct}%` }}>{(100 - activePct).toFixed(1)}% Passive</div>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Active</p><p className="mt-1 text-sm font-semibold text-emerald-700">{formatNumber(active)}</p></div>
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Passive</p><p className="mt-1 text-sm font-semibold">{formatNumber(passive)}</p></div>
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Marketplace Health</p><p className="mt-1 text-sm font-semibold text-emerald-700">82.4%</p></div>
          <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">Liquidity Score</p><p className="mt-1 text-sm font-semibold text-amber-700">7.4/10</p></div>
        </div>
      </SectionCard>
    </div>
  );
}
