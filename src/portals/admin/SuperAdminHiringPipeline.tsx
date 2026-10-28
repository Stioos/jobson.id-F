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
  conv: number;
}

const FUNNEL: Stage[] = [
  { key: "jobs", label: "All Jobs", count: 18_492, conv: 100 },
  { key: "apps", label: "Applications", count: 142_380, conv: 0 },
  { key: "screened", label: "Screened", count: 56_240, conv: 0 },
  { key: "interviewed", label: "Interviewed", count: 18_460, conv: 0 },
  { key: "offered", label: "Offered", count: 4_280, conv: 0 },
  { key: "hired", label: "Hired", count: 1_247, conv: 0 },
];

const BY_PORTAL = [
  { portal: "Employer", apps: 78_400, interviewed: 9_800, hired: 712, tth: 24 },
  { portal: "Recruiter", apps: 42_600, interviewed: 6_100, hired: 386, tth: 28 },
  { portal: "Partner", apps: 14_800, interviewed: 2_180, hired: 118, tth: 31 },
  { portal: "Training", apps: 6_580, interviewed: 380, hired: 31, tth: 19 },
];

const BOTTLENECKS = [
  { stage: "Application → Screening", dropOff: "60.5%", impact: "High", note: "Many unqualified applications reach this stage" },
  { stage: "Interview → Offer", dropOff: "76.8%", impact: "Critical", note: "Significant candidate drop-off after interview" },
  { stage: "Offer → Hire", dropOff: "70.8%", impact: "High", note: "Offer rejection rate above industry benchmark" },
];

export function SuperAdminHiringPipeline() {
  const max = FUNNEL[1].count;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hiring Pipeline"
        description="Platform-wide hiring pipeline — funnel conversion, portal breakdown, bottleneck detection, and time-to-hire metrics."
        icon={<Icon name="KanbanSquare" className="h-6 w-6" />}
        actions={[{ label: "Export Report", variant: "outline", onClick: () => toast.success("Pipeline report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Applications" value="142,380" delta={{ value: "+8.2% MoM", positive: true }} icon={<Icon name="Inbox" className="h-5 w-5" />} tone="brand" />
        <StatCard label="In Interview" value="18,460" icon={<Icon name="Video" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Offers Extended" value="4,280" delta={{ value: "+4.1% MoM", positive: true }} icon={<Icon name="Gift" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Time-to-Hire" value="26 days" delta={{ value: "-3 days YoY", positive: true }} icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Platform Hiring Funnel" description="Conversion across all 6 stages">
        <div className="space-y-3">
          {FUNNEL.map((s, i) => {
            const prevCount = i === 0 ? s.count : FUNNEL[i - 1].count;
            const stageConv = i === 0 ? 100 : (s.count / prevCount) * 100;
            return (
              <div key={s.key}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.label}</span>
                    {i > 0 && <Badge variant="outline" className="text-[10px]">{stageConv.toFixed(1)}%</Badge>}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{s.count.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1 h-8 rounded-md bg-muted/40 overflow-hidden">
                  <div className="h-full bg-brand/70 flex items-center justify-end pr-2" style={{ width: `${(s.count / max) * 100}%` }}>
                    <span className="text-[10px] font-medium text-white">{((s.count / FUNNEL[0].count) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Overall conversion (Application → Hire): <span className="font-medium text-emerald-700">{((1247 / 142380) * 100).toFixed(2)}%</span></p>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Pipeline by Portal" description="Conversion by source portal">
          <div className="space-y-3">
            {BY_PORTAL.map(p => {
              const conv = (p.hired / p.apps) * 100;
              return (
                <div key={p.portal} className="rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2"><Badge variant="outline">{p.portal}</Badge><span className="text-muted-foreground">{p.apps.toLocaleString("en-IN")} apps</span></div>
                    <span className="font-medium text-emerald-700">{conv.toFixed(2)}% conv</span>
                  </div>
                  <Progress className="mt-2 h-1.5" value={conv * 20} />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.interviewed.toLocaleString("en-IN")} interviewed · {p.hired.toLocaleString("en-IN")} hired</span>
                    <span className="flex items-center gap-1"><Icon name="Clock" className="h-3 w-3" /> {p.tth}d TTH</span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Bottleneck Detection" description="Stages with highest drop-off">
          {BOTTLENECKS.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No bottlenecks detected" />
          ) : (
            <ul className="space-y-3">
              {BOTTLENECKS.map(b => (
                <li key={b.stage} className="rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{b.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-rose-600">{b.dropOff}</span>
                      <Badge variant="outline" className={b.impact === "Critical" ? "bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]" : "bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]"}>{b.impact}</Badge>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{b.note}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Time-to-Hire Trends" description="Weekly average days from job posting to hire">
        <div className="flex h-40 items-end gap-2">
          {[34, 32, 30, 28, 27, 26, 25, 26].map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end"><div className="w-full rounded-t bg-emerald-600/70" style={{ height: `${(v / 34) * 100}%` }} /></div>
              <div className="text-[10px] text-muted-foreground">W{i + 1}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Trend: improving. Target: 22 days. <span className="font-medium text-emerald-700">On track.</span></p>
      </SectionCard>
    </div>
  );
}
