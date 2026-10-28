"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Incident {
  id: string; title: string; service: string; severity: "P1" | "P2" | "P3" | "P4"; status: "investigating" | "identified" | "monitoring" | "resolved"; startedAt: string; affected: string; postmortem: boolean;
}

const INCIDENTS: Incident[] = [
  { id: "INC-2024-091", title: "AI inference latency spike", service: "AI Inference Cluster", severity: "P2", status: "investigating", startedAt: "2024-09-21T07:14:00Z", affected: "Recruiter portal — match scoring", postmortem: false },
  { id: "INC-2024-090", title: "GPU node OOM crash", service: "AI Inference Cluster", severity: "P1", status: "resolved", startedAt: "2024-09-20T22:01:00Z", affected: "All portals — AI features down 42 min", postmortem: true },
  { id: "INC-2024-089", title: "Job queue stuck after deploy", service: "Job Queue (Redis)", severity: "P3", status: "resolved", startedAt: "2024-09-21T05:48:00Z", affected: "Candidate — application submission delayed", postmortem: false },
  { id: "INC-2024-088", title: "Payment gateway timeout", service: "Payment Gateway", severity: "P2", status: "resolved", startedAt: "2024-09-19T14:30:00Z", affected: "All portals — payments failing 18 min", postmortem: true },
  { id: "INC-2024-087", title: "Email service delayed", service: "Email/SMS Service", severity: "P4", status: "resolved", startedAt: "2024-09-18T09:00:00Z", affected: "All portals — email delays up to 30 min", postmortem: false },
];

const POSTMORTEMS = [
  { id: "PM-2024-012", incident: "INC-2024-090", title: "GPU node OOM crash", rca: "Insufficient GPU memory headroom during peak load. Auto-scaling threshold too high.", action: "Lower scaling threshold, add memory buffer", owner: "Platform Ops", due: "2024-09-25" },
  { id: "PM-2024-011", incident: "INC-2024-088", title: "Payment gateway timeout", rca: "Payment provider rate-limited our outbound IP. Failed over too slowly.", action: "Multi-IP failover, alert on rate-limit headers", owner: "Payments", due: "2024-09-22" },
];

export function SuperAdminIncidents() {
  const [rca, setRca] = React.useState("");

  const sevBadge = (s: string) => {
    const cls = s === "P1" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "P2" ? "bg-orange-500/15 text-orange-700 border-orange-500/30"
      : s === "P3" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-slate-500/15 text-slate-700 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const statusBadge = (s: string) => {
    const cls = s === "resolved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "monitoring" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : s === "identified" ? "bg-teal-500/15 text-teal-700 border-teal-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const active = INCIDENTS.filter(i => i.status !== "resolved");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Management"
        description="Active incidents with severity, RCA, postmortems, and resolution tracking."
        icon={<Icon name="AlertCircle" className="h-6 w-6" />}
        actions={[{ label: "Declare Incident", variant: "destructive", onClick: () => toast.warning("Incident declaration wizard opened") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active" value={active.length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="P1 (30d)" value={INCIDENTS.filter(i => i.severity === "P1").length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="MTTR (avg)" value="38 min" icon={<Icon name="Clock" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Postmortems Open" value={POSTMORTEMS.length} icon={<Icon name="FileText" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Active Incidents" description={`${active.length} ongoing`}>
        <div className="space-y-3">
          {active.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No active incidents — all systems operational</div>
          ) : active.map(i => (
            <div key={i.id} className="rounded-lg border border-amber-500/30 bg-amber-50/40 dark:bg-amber-900/10 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{i.title}</span>
                    {sevBadge(i.severity)}
                    {statusBadge(i.status)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{i.service} • started {timeAgo(i.startedAt)}</div>
                  <div className="mt-1 text-sm">Affected: <span className="font-medium">{i.affected}</span></div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success("Status updated")}>Update Status</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("Resolved & marked for postmortem")}>Resolve</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Postmortems & RCA" description="Root-cause analysis for resolved incidents">
        <div className="space-y-3">
          {POSTMORTEMS.map(p => (
            <div key={p.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{p.title}</span>
                    <Badge variant="outline" className="text-[10px]">{p.incident}</Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <p><span className="text-muted-foreground">RCA:</span> {p.rca}</p>
                    <p className="mt-1"><span className="text-muted-foreground">Action:</span> {p.action}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p>Owner: <span className="font-medium">{p.owner}</span></p>
                  <p className="text-muted-foreground">Due: {p.due}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-dashed bg-muted/30 p-4">
            <Label className="text-xs">Add new RCA</Label>
            <Textarea value={rca} onChange={(e) => setRca(e.target.value)} rows={3} placeholder="Root cause analysis for incident…" className="mt-1" />
            <Button size="sm" className="mt-2" onClick={() => { if (rca) { toast.success("RCA saved"); setRca(""); } else toast.error("RCA required"); }}>Save RCA</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Recent Resolved Incidents" description="Last 30 days">
        <ul className="space-y-2">
          {INCIDENTS.filter(i => i.status === "resolved").map(i => (
            <li key={i.id} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
              <div>
                <span className="font-medium">{i.title}</span>
                <span className="ml-2 text-xs text-muted-foreground">{i.id}</span>
              </div>
              <div className="flex items-center gap-2">
                {sevBadge(i.severity)}
                {i.postmortem && <Badge variant="outline" className="bg-teal-500/15 text-teal-700 border-teal-500/30">PM done</Badge>}
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
