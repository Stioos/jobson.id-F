"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface DltEntity {
  id: string;
  entity: string;
  type: "PEID" | "Header ID" | "Template ID";
  status: "approved" | "pending" | "rejected" | "expired";
  registeredOn: string;
  expiresOn: string;
  provider: string;
}

const DLT_ENTITIES: DltEntity[] = [
  { id: "dlt_001", entity: "JOBSONN Technologies Pvt Ltd", type: "PEID", status: "approved", registeredOn: "2022-03-12", expiresOn: "2025-03-11", provider: "Jio" },
  { id: "dlt_002", entity: "JOBSONN", type: "Header ID", status: "approved", registeredOn: "2022-03-15", expiresOn: "2025-03-14", provider: "Jio" },
  { id: "dlt_003", entity: "JOBSNN", type: "Header ID", status: "approved", registeredOn: "2022-04-02", expiresOn: "2025-04-01", provider: "Airtel" },
  { id: "dlt_004", entity: "OTP Verification", type: "Template ID", status: "approved", registeredOn: "2022-04-10", expiresOn: "2027-04-09", provider: "Jio" },
  { id: "dlt_005", entity: "Interview Reminder", type: "Template ID", status: "approved", registeredOn: "2022-05-22", expiresOn: "2027-05-21", provider: "Jio" },
  { id: "dlt_006", entity: "Diwali Offer 20%", type: "Template ID", status: "pending", registeredOn: "2024-09-18", expiresOn: "", provider: "Airtel" },
  { id: "dlt_007", entity: "Old Promo Header", type: "Header ID", status: "expired", registeredOn: "2020-01-10", expiresOn: "2024-01-09", provider: "Vodafone" },
];

const ALERTS = [
  { id: "al_1", severity: "urgent", msg: "Header ID 'JOBSNN' expires in 14 days on Airtel — submit renewal to avoid SMS delivery halt.", at: "2024-09-21T08:00:00Z" },
  { id: "al_2", severity: "warning", msg: "Template 'Diwali Offer 20%' pending DLT approval for 3 days. Average approval time: 24h.", at: "2024-09-21T05:00:00Z" },
  { id: "al_3", severity: "info", msg: "TRAI compliance check passed for 100% of transactional SMS in last 24h.", at: "2024-09-20T18:00:00Z" },
];

const SCORECARD = [
  { metric: "PEID Registration", score: 100, status: "compliant" },
  { metric: "Header IDs Registered", score: 100, status: "compliant" },
  { metric: "Templates Approved", score: 86, status: "compliant" },
  { metric: "DND Scrubbing", score: 100, status: "compliant" },
  { metric: "Opt-out Handling", score: 100, status: "compliant" },
  { metric: "Consent Registration", score: 72, status: "at_risk" },
  { metric: "Content Template Match", score: 94, status: "compliant" },
];

export function SuperAdminSmsDltCompliance() {
  const approved = DLT_ENTITIES.filter(d => d.status === "approved").length;
  const pending = DLT_ENTITIES.filter(d => d.status === "pending").length;
  const overallScore = Math.round(SCORECARD.reduce((s, m) => s + m.score, 0) / SCORECARD.length);

  const statusBadge = (s: DltEntity["status"]) => {
    const cls = s === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "rejected" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-slate-500/15 text-slate-500 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SMS / DLT Compliance"
        description="India DLT (Distributed Ledger Technology) compliance — PEID registration, sender ID registry, template approval, DND scrubbing, opt-out management, and TRAI regulatory alerts."
        icon={<Icon name="Smartphone" className="h-6 w-6" />}
        actions={[{ label: "Sync with DLT", variant: "outline", onClick: () => toast.success("Syncing with Jio/Airtel/Vodafone DLT platforms") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Compliance Score" value={`${overallScore}%`} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone={overallScore >= 90 ? "success" : "warning"} />
        <StatCard label="Approved Entities" value={approved} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Approvals" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="DND Scrubbed (24h)" value="3,241" icon={<Icon name="Shield" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Regulatory Alerts" description="TRAI / DLT regulatory alerts" contentClassName="p-0">
        {ALERTS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No alerts" />
        ) : (
          <div className="divide-y">
            {ALERTS.map(a => (
              <div key={a.id} className="flex items-start gap-3 p-4">
                <Icon name={a.severity === "urgent" ? "AlertTriangle" : a.severity === "warning" ? "AlertCircle" : "CheckCircle2"} className={`mt-0.5 h-5 w-5 ${a.severity === "urgent" ? "text-rose-500" : a.severity === "warning" ? "text-amber-500" : "text-emerald-500"}`} />
                <div className="flex-1">
                  <p className="text-sm">{a.msg}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{new Date(a.at).toLocaleString("en-IN")}</p>
                </div>
                {a.severity !== "info" && <Button size="sm" variant="outline" onClick={() => toast.success("Action initiated")}>Resolve</Button>}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Compliance Scorecard" description="DLT compliance dimensions" className="lg:col-span-1">
          <div className="space-y-3">
            {SCORECARD.map(s => (
              <div key={s.metric}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{s.metric}</span>
                  <span className={s.score >= 90 ? "text-emerald-600" : s.score >= 75 ? "text-amber-600" : "text-rose-600"}>{s.score}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full ${s.score >= 90 ? "bg-emerald-500" : s.score >= 75 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="DLT Registry" description="PEIDs, Header IDs, Template IDs" className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DLT_ENTITIES.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.entity}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{d.type}</Badge></TableCell>
                  <TableCell className="text-xs">{d.provider}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.expiresOn || "—"}</TableCell>
                  <TableCell>{statusBadge(d.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <SectionCard title="Opt-out Management" description="DND preference and unsubscribe handling">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">DND-registered users</p>
            <p className="mt-1 text-xl font-semibold">42,180</p>
            <p className="text-[10px] text-emerald-600">Auto-scrubbed from promo sends</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Opt-outs (30d)</p>
            <p className="mt-1 text-xl font-semibold">1,242</p>
            <p className="text-[10px] text-amber-600">0.8% opt-out rate</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Consent registered</p>
            <p className="mt-1 text-xl font-semibold">128,400</p>
            <p className="text-[10px] text-muted-foreground">72% coverage</p>
          </div>
        </div>
        <Button variant="outline" className="mt-3" onClick={() => toast.success("Opt-out list exported")}>Export Opt-out List</Button>
      </SectionCard>
    </div>
  );
}
