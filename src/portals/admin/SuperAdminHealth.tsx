"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const SERVICES = [
  { name: "API Gateway", icon: "Code", uptime: 99.98, responseMs: 142, incidents: 0, status: "operational" },
  { name: "Primary Database", icon: "Database", uptime: 99.99, responseMs: 8, incidents: 0, status: "operational" },
  { name: "Job Queue (Redis)", icon: "Activity", uptime: 99.94, responseMs: 3, incidents: 1, status: "degraded" },
  { name: "AI Inference Cluster", icon: "Sparkles", uptime: 99.41, responseMs: 1840, incidents: 3, status: "degraded" },
  { name: "Payment Gateway", icon: "CreditCard", uptime: 99.96, responseMs: 312, incidents: 1, status: "operational" },
  { name: "Email/SMS Service", icon: "Send", uptime: 99.92, responseMs: 98, incidents: 2, status: "operational" },
  { name: "Object Storage (S3)", icon: "Box", uptime: 100, responseMs: 42, incidents: 0, status: "operational" },
  { name: "WebSocket Gateway", icon: "Network", uptime: 99.88, responseMs: 24, incidents: 1, status: "operational" },
];

const INCIDENTS = [
  { id: "inc_001", service: "AI Inference", severity: "high", started: "2024-09-21T07:14:00Z", resolved: false, summary: "p95 latency spike on gpt-4o endpoint" },
  { id: "inc_002", service: "Job Queue", severity: "medium", started: "2024-09-21T05:48:00Z", resolved: true, summary: "Stuck jobs after deploy — auto-recovered" },
  { id: "inc_003", service: "AI Inference", severity: "critical", started: "2024-09-20T22:01:00Z", resolved: true, summary: "GPU node OOM, failed over to standby" },
];

const HISTORICAL_UPTIME = [
  { day: "Sep 15", uptime: 99.99 },
  { day: "Sep 16", uptime: 99.97 },
  { day: "Sep 17", uptime: 99.99 },
  { day: "Sep 18", uptime: 99.95 },
  { day: "Sep 19", uptime: 99.41 },
  { day: "Sep 20", uptime: 99.62 },
  { day: "Sep 21", uptime: 99.84 },
];

export function SuperAdminHealth() {
  const statusBadge = (s: string) => {
    const cls = s === "operational" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "degraded" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const avgUptime = (SERVICES.reduce((s, x) => s + x.uptime, 0) / SERVICES.length).toFixed(2);
  const degradedCount = SERVICES.filter(s => s.status !== "operational").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Health"
        description="Real-time monitor of all platform services, uptime, response times, and incidents."
        icon={<Icon name="Activity" className="h-6 w-6" />}
        actions={[{ label: "Subscribe", variant: "outline", onClick: () => toast.success("Subscribed to health alerts") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Avg Uptime (30d)" value={`${avgUptime}%`} icon={<Icon name="Activity" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Operational" value={SERVICES.length - degradedCount} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Degraded" value={degradedCount} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Active Incidents" value={INCIDENTS.filter(i => !i.resolved).length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Service Status" description="Live health of all critical services">
        <div className="grid gap-3 md:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.name} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon name={s.icon} className="h-4 w-4 text-brand" />
                  <span className="text-sm font-medium">{s.name}</span>
                </div>
                {statusBadge(s.status)}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Uptime</p>
                  <p className="font-medium">{s.uptime}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Response</p>
                  <p className="font-medium">{s.responseMs} ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Incidents</p>
                  <p className="font-medium">{s.incidents}</p>
                </div>
              </div>
              <Progress className="mt-3 h-1.5" value={s.uptime} />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Uptime Trend (7d)" description="Daily average uptime">
          <div className="flex h-40 items-end gap-2">
            {HISTORICAL_UPTIME.map((d) => {
              const h = Math.max(8, ((d.uptime - 99) * 100));
              const tone = d.uptime >= 99.9 ? "bg-emerald-500" : d.uptime >= 99.5 ? "bg-amber-500" : "bg-rose-500";
              return (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-1 items-end">
                    <div className={`w-full rounded-t ${tone}`} style={{ height: `${h}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Recent Incidents" description="Last 24 hours">
          <ul className="space-y-3">
            {INCIDENTS.map((i) => (
              <li key={i.id} className="rounded-md border bg-card p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{i.service}</span>
                  <Badge variant="outline" className={i.severity === "critical" ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : i.severity === "high" ? "bg-orange-500/15 text-orange-700 border-orange-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30"}>
                    {i.severity}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{i.summary}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <Badge variant={i.resolved ? "default" : "secondary"} className={i.resolved ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : ""}>
                    {i.resolved ? "resolved" : "active"}
                  </Badge>
                  <span className="text-muted-foreground">started {new Date(i.started).toLocaleString("en-IN")}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
