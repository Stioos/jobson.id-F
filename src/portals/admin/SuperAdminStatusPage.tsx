"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const SERVICES = [
  { name: "API Gateway", status: "operational", uptime: 99.98, color: "bg-emerald-500" },
  { name: "Web App", status: "operational", uptime: 99.99, color: "bg-emerald-500" },
  { name: "Database (Primary)", status: "operational", uptime: 100, color: "bg-emerald-500" },
  { name: "Job Queue", status: "degraded", uptime: 99.42, color: "bg-amber-500" },
  { name: "AI Inference", status: "degraded", uptime: 99.41, color: "bg-amber-500" },
  { name: "Payment Gateway", status: "operational", uptime: 99.96, color: "bg-emerald-500" },
  { name: "Email/SMS", status: "operational", uptime: 99.92, color: "bg-emerald-500" },
  { name: "Object Storage", status: "operational", uptime: 100, color: "bg-emerald-500" },
];

const UPTIME_DAYS = [
  { d: "Sep 15", ops: true }, { d: "Sep 16", ops: true }, { d: "Sep 17", ops: true },
  { d: "Sep 18", ops: true }, { d: "Sep 19", ops: false }, { d: "Sep 20", ops: false }, { d: "Sep 21", ops: false },
];

const SCHEDULED = [
  { id: "m_001", title: "Quarterly DB vacuum", when: "Oct 1, 2024 18:00 UTC", window: "2 hours", impact: "Read-only mode" },
  { id: "m_002", title: "Recruiter portal deploy", when: "Sep 25, 2024 02:00 UTC", window: "2 hours", impact: "Payouts paused" },
];

const INCIDENTS = [
  { id: "INC-091", title: "AI inference latency spike", severity: "P2", date: "Sep 21, 2024", resolved: false },
  { id: "INC-090", title: "GPU node OOM crash", severity: "P1", date: "Sep 20, 2024", resolved: true },
  { id: "INC-089", title: "Job queue stuck after deploy", severity: "P3", date: "Sep 21, 2024", resolved: true },
  { id: "INC-088", title: "Payment gateway timeout", severity: "P2", date: "Sep 19, 2024", resolved: true },
];

export function SuperAdminStatusPage() {
  const operational = SERVICES.filter(s => s.status === "operational").length;
  const allOps = operational === SERVICES.length;

  const sevBadge = (s: string) => {
    const cls = s === "P1" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "P2" ? "bg-orange-500/15 text-orange-700 border-orange-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Status"
        description="Public-facing status page: service uptime, scheduled maintenance, and incident history."
        icon={<Icon name="Activity" className="h-6 w-6" />}
        actions={[{ label: "View Public Page", variant: "outline", onClick: () => toast.info("Opening status.jobsonn.com") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Operational" value={operational} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Degraded" value={SERVICES.length - operational} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Uptime (30d)" value="99.84%" icon={<Icon name="Activity" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Open Incidents" value={INCIDENTS.filter(i => !i.resolved).length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Overall Status" description={allOps ? "All systems operational" : "Some systems degraded"}>
        <div className={`rounded-lg border p-6 text-center ${allOps ? "border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-900/10" : "border-amber-500/30 bg-amber-50/40 dark:bg-amber-900/10"}`}>
          <Icon name={allOps ? "CheckCircle2" : "AlertCircle"} className={`mx-auto h-12 w-12 ${allOps ? "text-emerald-500" : "text-amber-500"}`} />
          <p className={`mt-2 text-xl font-semibold ${allOps ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
            {allOps ? "All Systems Operational" : "Partial System Degradation"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Last updated {new Date().toLocaleTimeString("en-IN")}</p>
        </div>
      </SectionCard>

      <SectionCard title="Service Status" description="Real-time per-service health">
        <div className="space-y-2">
          {SERVICES.map(s => (
            <div key={s.name} className="flex items-center justify-between rounded-md border bg-card p-3">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                <span className="font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 sm:flex">
                  <Progress className="h-1.5 w-20" value={s.uptime} />
                  <span className="text-xs">{s.uptime}%</span>
                </div>
                <Badge variant="outline" className={s.status === "operational" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30"}>
                  {s.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Scheduled Maintenance" description="Upcoming windows">
          <ul className="space-y-3">
            {SCHEDULED.map(s => (
              <li key={s.id} className="rounded-md border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.when} • {s.window}</div>
                    <div className="mt-1 text-xs">Impact: <span className="font-medium text-amber-700 dark:text-amber-400">{s.impact}</span></div>
                  </div>
                  <Badge variant="outline" className="bg-cyan-500/15 text-cyan-700 border-cyan-500/30">scheduled</Badge>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Incident History" description="Last 7 days">
          <ul className="space-y-2">
            {INCIDENTS.map(i => (
              <li key={i.id} className="flex items-center justify-between rounded-md border bg-card p-2.5 text-sm">
                <div>
                  <span className="font-medium">{i.title}</span>
                  <div className="text-xs text-muted-foreground">{i.id} • {i.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  {sevBadge(i.severity)}
                  <Badge variant="outline" className={i.resolved ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30"}>
                    {i.resolved ? "resolved" : "active"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="90-Day Uptime Bar" description="Daily operational status">
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 90 }).map((_, i) => {
            const degraded = i === 84 || i === 85 || i === 86; // mock: 3 degraded days
            return (
              <div
                key={i}
                title={`Day ${i + 1}: ${degraded ? "Degraded" : "Operational"}`}
                className={`h-6 w-1.5 rounded-sm ${degraded ? "bg-amber-500" : "bg-emerald-500"}`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500" /> Operational</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500" /> Degraded</span>
          <span className="ml-auto">90 days ago → Today</span>
        </div>
      </SectionCard>
    </div>
  );
}
