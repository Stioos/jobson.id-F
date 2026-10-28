"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface FunnelStage {
  key: string;
  label: string;
  count: number;
  icon: string;
}

const FUNNEL: FunnelStage[] = [
  { key: "visit", label: "Visit", count: 1_842_400, icon: "Eye" },
  { key: "search", label: "Search", count: 682_300, icon: "Search" },
  { key: "apply", label: "Apply", count: 142_380, icon: "Inbox" },
  { key: "screen", label: "Screen", count: 56_240, icon: "Filter" },
  { key: "interview", label: "Interview", count: 18_460, icon: "Video" },
  { key: "offer", label: "Offer", count: 4_280, icon: "Gift" },
  { key: "hire", label: "Hire", count: 1_247, icon: "BadgeCheck" },
  { key: "onboard", label: "Onboard", count: 1_184, icon: "UserCheck" },
];

const BY_PORTAL = [
  { portal: "Employer", visit: 842_000, apply: 78_400, hire: 712, onboard: 684 },
  { portal: "Recruiter", visit: 542_000, apply: 42_600, hire: 386, onboard: 362 },
  { portal: "Partner", visit: 280_000, apply: 14_800, hire: 118, onboard: 110 },
  { portal: "Training", visit: 178_400, apply: 6_580, hire: 31, onboard: 28 },
];

const BY_INDUSTRY = [
  { industry: "IT/Software", apply: 62_400, hire: 612, conv: 0.98 },
  { industry: "BFSI", apply: 28_200, hire: 198, conv: 0.70 },
  { industry: "Healthcare", apply: 18_400, hire: 142, conv: 0.77 },
  { industry: "Retail", apply: 14_800, hire: 88, conv: 0.59 },
  { industry: "Manufacturing", apply: 12_600, hire: 124, conv: 0.98 },
  { industry: "EdTech", apply: 5_980, hire: 83, conv: 1.39 },
];

export function SuperAdminHiringFunnel() {
  const max = FUNNEL[0].count;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hiring Funnel"
        description="Cross-portal hiring funnel analytics — visit to onboard, with conversion rates, drop-off analysis, and breakdowns."
        icon={<Icon name="Filter" className="h-6 w-6" />}
        actions={[{ label: "Funnel Report", variant: "outline", onClick: () => toast.success("Funnel analytics exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Visits (30d)" value="1.84M" delta={{ value: "+12.4%", positive: true }} icon={<Icon name="Eye" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Apply Rate" value="7.7%" icon={<Icon name="Inbox" className="h-5 w-5" />} tone="success" />
        <StatCard label="Visit→Hire" value="0.068%" icon={<Icon name="BadgeCheck" className="h-5 w-5" />} />
        <StatCard label="Onboard Rate" value="94.9%" delta={{ value: "+2.1%", positive: true }} icon={<Icon name="UserCheck" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="End-to-End Funnel" description="Visit → Search → Apply → Screen → Interview → Offer → Hire → Onboard">
        <div className="space-y-2">
          {FUNNEL.map((s, i) => {
            const prev = i === 0 ? s.count : FUNNEL[i - 1].count;
            const conv = i === 0 ? 100 : (s.count / prev) * 100;
            const dropoff = i === 0 ? 0 : (1 - s.count / prev) * 100;
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className="flex w-24 items-center gap-2 text-xs">
                  <Icon name={s.icon} className="h-3.5 w-3.5 text-brand" />
                  <span className="font-medium">{s.label}</span>
                </div>
                <div className="flex-1">
                  <div className="h-7 rounded-md bg-muted/40 overflow-hidden">
                    <div className="h-full bg-brand/70 flex items-center justify-end pr-2" style={{ width: `${(s.count / max) * 100}%` }}>
                      <span className="text-[10px] font-medium text-white">{s.count.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
                <div className="w-24 text-right text-xs">
                  {i > 0 ? (
                    <div>
                      <span className="font-medium text-emerald-700">{conv.toFixed(1)}%</span>
                      <span className="ml-1 text-rose-500">↓{dropoff.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">100%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Funnel by Portal" description="Visit-to-onboard conversion by source portal">
          <div className="space-y-3">
            {BY_PORTAL.map(p => {
              const conv = (p.hire / p.visit) * 100;
              return (
                <div key={p.portal} className="rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{p.portal}</Badge>
                    <span className="text-muted-foreground">{p.apply.toLocaleString("en-IN")} apps · {p.hire} hires</span>
                  </div>
                  <Progress className="mt-2 h-1.5" value={Math.min(100, conv * 1000)} />
                  <p className="mt-1 text-xs text-muted-foreground">Conversion: <span className="font-medium text-emerald-700">{conv.toFixed(3)}%</span> · Onboard: {p.onboard}/{p.hire}</p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Funnel by Industry" description="Apply-to-hire conversion by industry">
          <div className="space-y-2.5">
            {BY_INDUSTRY.map(i => (
              <div key={i.industry}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{i.industry}</span>
                  <span className="text-muted-foreground">{i.apply.toLocaleString("en-IN")} apps · <span className="font-medium text-emerald-700">{i.hire} hires</span></span>
                </div>
                <div className="mt-1 h-2 rounded-md bg-muted/40 overflow-hidden">
                  <div className="h-full bg-emerald-600/70" style={{ width: `${(i.hire / 612) * 100}%` }} />
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Conversion: {i.conv.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Drop-off Analysis" description="Stages with the highest candidate loss">
        <ul className="space-y-2">
          <li className="flex items-center justify-between rounded-md border bg-card p-2.5 text-sm">
            <span><b>Search → Apply</b> — 79.1% drop-off</span>
            <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30">Critical</Badge>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-2.5 text-sm">
            <span><b>Apply → Screen</b> — 60.5% drop-off</span>
            <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30">High</Badge>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-2.5 text-sm">
            <span><b>Interview → Offer</b> — 76.8% drop-off</span>
            <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30">Critical</Badge>
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
