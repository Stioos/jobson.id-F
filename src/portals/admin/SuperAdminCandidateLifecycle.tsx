"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Stage {
  key: string;
  label: string;
  count: number;
  avgDays: number;
  icon: string;
}

const STAGES: Stage[] = [
  { key: "lead", label: "Lead", count: 842_400, avgDays: 4, icon: "UserPlus" },
  { key: "registered", label: "Registered", count: 284_200, avgDays: 1, icon: "UserCheck" },
  { key: "profile_complete", label: "Profile Complete", count: 142_800, avgDays: 6, icon: "CircleCheck" },
  { key: "applied", label: "Applied", count: 78_400, avgDays: 8, icon: "Inbox" },
  { key: "interviewed", label: "Interviewed", count: 18_460, avgDays: 14, icon: "Video" },
  { key: "offered", label: "Offered", count: 4_280, avgDays: 6, icon: "Gift" },
  { key: "placed", label: "Placed", count: 1_247, avgDays: 22, icon: "BadgeCheck" },
  { key: "alumni", label: "Alumni", count: 8_240, avgDays: 0, icon: "Award" },
];

const BY_PORTAL = [
  { portal: "Candidate", lead: 542_000, placed: 712, dropoff: 0.13 },
  { portal: "Recruiter", lead: 184_200, placed: 386, dropoff: 0.21 },
  { portal: "Training", lead: 78_400, placed: 31, dropoff: 0.04 },
  { portal: "Partner", lead: 37_800, placed: 118, dropoff: 0.31 },
];

const DROPOFFS = [
  { stage: "Lead → Registered", rate: "66.3%", impact: "Critical", note: "Most leads don't complete registration" },
  { stage: "Registered → Profile Complete", rate: "49.7%", impact: "High", note: "Onboarding friction in profile builder" },
  { stage: "Applied → Interviewed", rate: "76.4%", impact: "High", note: "Application-to-interview gap" },
  { stage: "Offered → Placed", rate: "29.2%", impact: "Medium", note: "Offer rejection rate" },
];

export function SuperAdminCandidateLifecycle() {
  const max = STAGES[0].count;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Lifecycle"
        description="Tracker for every candidate's journey from lead to alumni — stage distribution, time-in-stage, drop-off points, and breakdowns."
        icon={<Icon name="Route" className="h-6 w-6" />}
        actions={[{ label: "Lifecycle Report", variant: "outline", onClick: () => toast.success("Lifecycle report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total in Lifecycle" value="1.28M" delta={{ value: "+8.4%", positive: true }} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Currently Active" value="284K" icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Time-to-Placement" value="61 days" delta={{ value: "-4d", positive: true }} icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Alumni" value="8.2K" icon={<Icon name="Award" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Stage Distribution" description="Candidate count and avg time-in-stage across all 8 stages">
        <div className="space-y-2.5">
          {STAGES.map((s, i) => {
            const prev = i === 0 ? s.count : STAGES[i - 1].count;
            const conv = i === 0 ? 100 : (s.count / prev) * 100;
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className="flex w-36 items-center gap-2 text-xs">
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
                <div className="w-20 text-right text-xs">
                  {i > 0 && <span className="text-emerald-700">{conv.toFixed(1)}%</span>}
                </div>
                <div className="w-20 text-right text-xs text-muted-foreground">{s.avgDays > 0 ? `${s.avgDays}d avg` : "—"}</div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Lifecycle by Portal" description="Lead-to-placement funnel by source portal">
          <div className="space-y-3">
            {BY_PORTAL.map(p => (
              <div key={p.portal} className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{p.portal}</Badge>
                  <span className="text-muted-foreground">{p.lead.toLocaleString("en-IN")} leads → <span className="font-medium text-emerald-700">{p.placed} placed</span></span>
                </div>
                <Progress className="mt-2 h-1.5" value={Math.min(100, (p.placed / p.lead) * 1000)} />
                <p className="mt-1 text-xs text-muted-foreground">Conversion: {((p.placed / p.lead) * 100).toFixed(3)}% · Drop-off: {p.dropoff}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Drop-off Points" description="Where candidates leave the lifecycle" className="border-rose-500/30">
          {DROPOFFS.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No major drop-offs" />
          ) : (
            <ul className="space-y-2">
              {DROPOFFS.map(d => (
                <li key={d.stage} className="rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{d.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-rose-600">{d.rate}</span>
                      <Badge variant="outline" className={d.impact === "Critical" ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : d.impact === "High" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-slate-500/15 text-slate-600 border-slate-500/30"}>{d.impact}</Badge>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{d.note}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
