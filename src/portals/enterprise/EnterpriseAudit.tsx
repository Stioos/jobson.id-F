"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ScrollText, Download, Lock, FileBarChart } from "lucide-react";
import { toast } from "sonner";
import { TenantDisclaimer } from "./_shared";
import { auditLogs as SEED_LOGS } from "@/lib/mock-data";
import type { AuditLog } from "@/lib/types";
import { formatDateTime, formatDate, timeAgo } from "@/lib/format";

interface EnterpriseAuditLog extends AuditLog {
  entity?: string;
  complianceFlag?: boolean;
}

// Augment with cross-entity events for the tenant
const EXTRA_LOGS: EnterpriseAuditLog[] = [
  { id: "al_x1", actor: "Rohan Mehta", action: "entity.created", resource: "Entity", resourceId: "e_005", timestamp: "2024-02-20T09:00:00Z", ip: "203.0.113.42", details: "Onboarded entity 'EduVerse Learning' (acquisition)", severity: "info", entity: "EduVerse Learning" },
  { id: "al_x2", actor: "Wei Lin", action: "budget.adjusted", resource: "Budget", resourceId: "b_006", timestamp: "2024-10-15T08:30:00Z", ip: "203.0.113.88", details: "Adjusted APAC recruitment budget +₹2L", severity: "info", entity: "TechCorp APAC" },
  { id: "al_x3", actor: "System", action: "policy.breach", resource: "Policy", resourceId: "p_001", timestamp: "2024-10-12T11:00:00Z", ip: "0.0.0.0", details: "Cross-entity data access attempted without scope", severity: "warning", entity: "TechCorp India", complianceFlag: true },
  { id: "al_x4", actor: "Hans Mueller", action: "role.changed", resource: "User", resourceId: "m_5", timestamp: "2024-10-10T15:00:00Z", ip: "203.0.113.51", details: "Promoted Lukas Weber to Entity Admin (EU)", severity: "info", entity: "TechCorp EU" },
  { id: "al_x5", actor: "Rohan Mehta", action: "sso.config_changed", resource: "Integration", resourceId: "int_005", timestamp: "2024-10-08T09:00:00Z", ip: "203.0.113.42", details: "Updated Okta SSO attribute mapping", severity: "info", entity: "Tenant-wide" },
  { id: "al_x6", actor: "Priya Nair", action: "talent_pool.shared", resource: "TalentPool", resourceId: "tp_001", timestamp: "2024-10-05T11:30:00Z", ip: "203.0.113.51", details: "Shared 'Senior Frontend (React)' pool with TechCorp APAC", severity: "info", entity: "TechCorp India" },
];

const COMBINED_LOGS: EnterpriseAuditLog[] = [...EXTRA_LOGS, ...SEED_LOGS].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

const DATA_TYPES = [
  { type: "Applications", defaultDays: 730, autoDelete: true, scope: "Per entity" },
  { type: "Candidate profiles (sourced)", defaultDays: 365, autoDelete: false, scope: "Per entity" },
  { type: "Audit logs", defaultDays: 2555, autoDelete: true, scope: "Tenant" },
  { type: "Interview scorecards", defaultDays: 1095, autoDelete: true, scope: "Per entity" },
  { type: "Billing & invoices", defaultDays: 2555, autoDelete: false, scope: "Tenant" },
  { type: "Messages", defaultDays: 365, autoDelete: true, scope: "Per entity" },
];

const COMPLIANCE_REPORTS = [
  { id: "cr1", name: "DPDP — Cross-border data transfer", lastRun: "2024-10-15", status: "pass", findings: 0 },
  { id: "cr2", name: "GDPR — Right to erasure log", lastRun: "2024-10-10", status: "pass", findings: 0 },
  { id: "cr3", name: "Equal opportunity hiring audit", lastRun: "2024-09-28", status: "warning", findings: 2 },
  { id: "cr4", name: "Access review (quarterly)", lastRun: "2024-09-30", status: "pass", findings: 0 },
];

export function EnterpriseAudit() {
  const [search, setSearch] = React.useState("");
  const [actorFilter, setActorFilter] = React.useState("all");
  const [actionFilter, setActionFilter] = React.useState("all");
  const [severityFilter, setSeverityFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("90");
  const [retentionDraft, setRetentionDraft] = React.useState(DATA_TYPES);

  const allActors = Array.from(new Set(COMBINED_LOGS.map((l) => l.actor)));
  const allActions = Array.from(new Set(COMBINED_LOGS.map((l) => l.action)));

  const filtered = COMBINED_LOGS.filter((l) => {
    if (search && !`${l.actor} ${l.action} ${l.resource} ${l.details} ${l.entity ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (actorFilter !== "all" && l.actor !== actorFilter) return false;
    if (actionFilter !== "all" && l.action !== actionFilter) return false;
    if (severityFilter !== "all" && l.severity !== severityFilter) return false;
    if (dateRange !== "all") {
      const cutoff = Date.now() - parseInt(dateRange) * 86400000;
      if (new Date(l.timestamp).getTime() < cutoff) return false;
    }
    return true;
  });

  function updateRetention(idx: number, days: number) {
    setRetentionDraft((prev) => prev.map((r, i) => i === idx ? { ...r, defaultDays: days } : r));
  }
  function toggleAutoDelete(idx: number) {
    setRetentionDraft((prev) => prev.map((r, i) => i === idx ? { ...r, autoDelete: !r.autoDelete } : r));
  }
  function saveRetention() {
    toast.success("Retention policy updated", { description: `${retentionDraft.length} data-type rules saved.` });
  }
  function exportLogs() {
    toast.success(`Audit log exported (${filtered.length} events, CSV)`);
  }
  function runComplianceReport(name: string) {
    toast.success(`Compliance report “${name}” queued`, { description: "You'll be notified when results are ready." });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit & Compliance"
        description="Immutable audit trail across the tenant, retention policies, and compliance reporting."
        icon={<Icon name="ScrollText" className="h-6 w-6" />}
        actions={[{ label: "Export", icon: "Download", variant: "outline", onClick: exportLogs }]}
      />

      <TenantDisclaimer />

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
        <Lock className="mr-1 inline h-3.5 w-3.5 text-amber-600" />
        Audit logs are <strong>immutable</strong> and tamper-evident. Append-only with cryptographic chain. Retention: 7 years per compliance policy.
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Events (90d)" value={filtered.length} icon={<ScrollText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Critical" value={COMBINED_LOGS.filter((l) => l.severity === "critical").length} icon={<ScrollText className="h-5 w-5" />} tone="danger" />
        <StatCard label="Warnings" value={COMBINED_LOGS.filter((l) => l.severity === "warning").length} icon={<ScrollText className="h-5 w-5" />} tone="warning" />
        <StatCard label="Compliance flags" value={COMBINED_LOGS.filter((l) => l.complianceFlag).length} icon={<ScrollText className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Audit log" description="Full cross-entity event stream with filters.">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative max-w-xs flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actor, action, details..."
              className="h-9"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-9 w-[120px]"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actorFilter} onValueChange={setActorFilter}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Actor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actors</SelectItem>
              {allActors.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="Action" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {allActions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-9 w-[120px]"><SelectValue placeholder="Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="max-h-[30rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={l.actor} size="xs" />
                      <span className="text-sm">{l.actor}</span>
                    </div>
                  </TableCell>
                  <TableCell><code className="font-mono text-xs">{l.action}</code></TableCell>
                  <TableCell className="text-xs">{l.entity ?? "—"}</TableCell>
                  <TableCell className="text-xs">{l.resource} <span className="text-muted-foreground">{l.resourceId}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[18rem] truncate">{l.details}</TableCell>
                  <TableCell className="font-mono text-xs">{l.ip}</TableCell>
                  <TableCell>
                    <StatusBadge status={l.severity === "info" ? "open" : l.severity === "warning" ? "pending" : "rejected"} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground" title={formatDateTime(l.timestamp)}>{timeAgo(l.timestamp)}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No matching events.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Compliance reports */}
        <SectionCard title="Compliance reports" description="Scheduled and on-demand compliance audits.">
          <ul className="space-y-2">
            {COMPLIANCE_REPORTS.map((r) => (
              <li key={r.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <FileBarChart className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">Last run: {formatDate(r.lastRun)} · Findings: {r.findings}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={r.status === "pass" ? "active" : r.status === "warning" ? "pending" : "rejected"} />
                    <Button size="sm" variant="outline" onClick={() => runComplianceReport(r.name)}>Run</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Retention policy */}
        <SectionCard
          title="Retention policy"
          description="Per data-type retention with optional auto-delete."
          action={<Button size="sm" onClick={saveRetention}>Save policy</Button>}
        >
          <ul className="space-y-2 max-h-[22rem] overflow-y-auto scroll-thin">
            {retentionDraft.map((r, i) => (
              <li key={r.type} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{r.type}</p>
                    <p className="text-xs text-muted-foreground">Scope: {r.scope}</p>
                  </div>
                  <Switch checked={r.autoDelete} onCheckedChange={() => toggleAutoDelete(i)} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Retain</Label>
                  <Input
                    type="number"
                    value={r.defaultDays}
                    onChange={(e) => updateRetention(i, parseInt(e.target.value) || 0)}
                    className="h-7 w-24 text-xs"
                  />
                  <span className="text-xs text-muted-foreground">days</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    ≈ {Math.round(r.defaultDays / 30)} months
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
