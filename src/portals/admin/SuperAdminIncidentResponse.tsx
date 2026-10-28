"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";

interface Incident {
  id: string; title: string; severity: "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4"; status: "investigating" | "contained" | "resolved" | "post_incident"; assignee: string; openedAt: string; affected: string;
}

const INCIDENTS: Incident[] = [
  { id: "INC-2401", title: "Suspected data exfiltration from candidate DB", severity: "SEV-1", status: "investigating", assignee: "Rohit S. + IR Team", openedAt: "2024-09-22T07:00:00Z", affected: "candidate-portal, db-primary" },
  { id: "INC-2400", title: "DDoS attack on api-gateway", severity: "SEV-2", status: "contained", assignee: "Infra On-call", openedAt: "2024-09-22T03:00:00Z", affected: "api-gateway" },
  { id: "INC-2399", title: "Phishing campaign impersonating Jobsonn", severity: "SEV-3", status: "post_incident", assignee: "Security Comms", openedAt: "2024-09-21T14:00:00Z", affected: "External" },
  { id: "INC-2398", title: "Unauthorized admin login attempt from new geo", severity: "SEV-2", status: "resolved", assignee: "Anita R.", openedAt: "2024-09-21T09:00:00Z", affected: "admin-portal" },
  { id: "INC-2397", title: "Misconfigured S3 bucket public access", severity: "SEV-1", status: "resolved", assignee: "Rohit S.", openedAt: "2024-09-20T22:00:00Z", affected: "s3-backups" },
];

const TIMELINE = [
  { at: "2024-09-22T07:00:00Z", event: "Incident declared (SEV-1)", actor: "Detection Engine" },
  { at: "2024-09-22T07:05:00Z", event: "IR Team paged", actor: "PagerDuty" },
  { at: "2024-09-22T07:15:00Z", event: "Affected wallet frozen (WLT-9008)", actor: "Rohit S." },
  { at: "2024-09-22T07:30:00Z", event: "Forensic snapshot taken", actor: "IR Team" },
  { at: "2024-09-22T08:00:00Z", event: "Containment actions deployed", actor: "Infra On-call" },
  { at: "2024-09-22T08:30:00Z", event: "Stakeholder comms sent", actor: "Security Comms" },
];

const PLAYBOOKS = [
  { id: "PB-01", name: "Data Exfiltration Response", steps: 12, lastUpdated: "2024-08-01", linked: true },
  { id: "PB-02", name: "DDoS Mitigation", steps: 8, lastUpdated: "2024-08-15", linked: true },
  { id: "PB-03", name: "Account Takeover Response", steps: 10, lastUpdated: "2024-07-20", linked: true },
  { id: "PB-04", name: "Ransomware Response", steps: 14, lastUpdated: "2024-06-10", linked: false },
];

const RCA = [
  { id: "RCA-2397", incident: "INC-2397", rootCause: "IAM policy drift — bucket policy changed by automation without review", corrective: "Add SCP guardrail + nightly config audit", status: "implemented" },
  { id: "RCA-2398", incident: "INC-2398", rootCause: "MFA bypass on legacy admin endpoint", corrective: "Enforce MFA globally + remove legacy endpoint", status: "implemented" },
  { id: "RCA-2399", incident: "INC-2399", rootCause: "Lookalike domain registered by attacker", corrective: "Domain monitoring + DMARC enforcement", status: "in_progress" },
];

export function SuperAdminIncidentResponse() {
  const active = INCIDENTS.filter(i => i.status === "investigating" || i.status === "contained");
  const sev1 = INCIDENTS.filter(i => i.severity === "SEV-1" && i.status !== "resolved" && i.status !== "post_incident");

  const sevBadge = (s: string) => {
    const cls = s === "SEV-1" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : s === "SEV-2" ? "bg-orange-500/15 text-orange-700 border-orange-500/30"
      : s === "SEV-3" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-slate-500/15 text-slate-700 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const statusBadge = (s: string) => {
    const cls = s === "resolved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "contained" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : s === "investigating" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-violet-500/15 text-violet-700 border-violet-500/30";
    return <Badge variant="outline" className={cls}>{s.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Response Center"
        description="Active security incidents, severity, timeline, containment actions, playbooks, post-incident review, and RCA tracking."
        icon={<Icon name="Siren" className="h-6 w-6" />}
        actions={[
          { label: "Declare Incident", variant: "destructive", onClick: () => toast.error("Opening incident declaration form") },
          { label: "Page On-call", variant: "outline", onClick: () => toast.success("PagerDuty triggered — on-call paged") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Incidents" value={active.length} icon={<Icon name="Siren" className="h-5 w-5" />} tone="danger" />
        <StatCard label="SEV-1 Open" value={sev1.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Resolved (30d)" value={INCIDENTS.filter(i => i.status === "resolved").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg MTTR" value="4.2h" icon={<Icon name="Clock" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Active Incidents" description="All security incidents with assignee & status" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Affected</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INCIDENTS.map(i => (
              <TableRow key={i.id}>
                <TableCell className="font-mono text-xs">{i.id}</TableCell>
                <TableCell className="font-medium text-sm">{i.title}</TableCell>
                <TableCell>{sevBadge(i.severity)}</TableCell>
                <TableCell>{statusBadge(i.status)}</TableCell>
                <TableCell className="text-xs">{i.assignee}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{i.affected}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{timeAgo(i.openedAt)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Opening ${i.id} incident room`)}>Open</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Incident Timeline" description="INC-2401 — live timeline">
          <ul className="space-y-2">
            {TIMELINE.map((t, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon name="Activity" className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-xs">{t.event}</p>
                  <p className="text-[10px] text-muted-foreground">{t.actor} · {formatDateTime(t.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="IR Playbooks" description="Linked playbooks for active incidents">
          {PLAYBOOKS.length === 0 ? (
            <EmptyState icon={<Icon name="ClipboardCheck" className="h-5 w-5" />} title="No playbooks" />
          ) : (
            <ul className="space-y-2">
              {PLAYBOOKS.map(p => (
                <li key={p.id} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.id} · {p.steps} steps · updated {p.lastUpdated}</p>
                  </div>
                  {p.linked
                    ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">linked</Badge>
                    : <Badge variant="outline" className="bg-muted text-muted-foreground text-[10px]">unlinked</Badge>}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Root Cause Analysis (RCA)" description="Post-incident RCAs with corrective actions">
        <ul className="space-y-2">
          {RCA.map(r => {
            const pct = r.status === "implemented" ? 100 : r.status === "in_progress" ? 60 : 20;
            return (
              <li key={r.id} className="rounded-md border bg-card p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{r.id}</span>
                    <span className="font-medium">{r.incident}</span>
                  </div>
                  <Badge variant="outline" className={r.status === "implemented" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]" : "bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]"}>{r.status.replace(/_/g, " ")}</Badge>
                </div>
                <p className="mt-2 text-xs"><span className="font-medium">Root cause:</span> {r.rootCause}</p>
                <p className="mt-1 text-xs"><span className="font-medium">Corrective:</span> {r.corrective}</p>
                <Progress className="mt-2 h-1" value={pct} />
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <SectionCard title="Communication Log" description="Stakeholder notifications sent">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <div className="flex items-center gap-2">
              <Icon name="Mail" className="h-4 w-4 text-brand" />
              <div>
                <p className="font-medium text-xs">Internal stakeholders — SEV-1 declared</p>
                <p className="text-[10px] text-muted-foreground">To: security@jobsonn.in, leadership</p>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">{timeAgo("2024-09-22T07:10:00Z")}</span>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <div className="flex items-center gap-2">
              <Icon name="MessageCircle" className="h-4 w-4 text-brand" />
              <div>
                <p className="font-medium text-xs">Slack #incident-2401 — war room opened</p>
                <p className="text-[10px] text-muted-foreground">Channel: #inc-2401</p>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">{timeAgo("2024-09-22T07:05:00Z")}</span>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card p-3">
            <div className="flex items-center gap-2">
              <Icon name="Megaphone" className="h-4 w-4 text-brand" />
              <div>
                <p className="font-medium text-xs">Customer notice — published on status page</p>
                <p className="text-[10px] text-muted-foreground">status.jobsonn.in</p>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">{timeAgo("2024-09-22T08:30:00Z")}</span>
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
