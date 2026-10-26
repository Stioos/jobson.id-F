"use client";

import * as React from "react";
import { PageHeader, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auditLogs } from "@/lib/mock-data";
import type { AuditLog } from "@/lib/types";
import { formatDateTime, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { SeverityBadge, Toolbar } from "./_shared";

const SECURITY_ALERTS = [
  { id: "sa1", title: "Multiple failed logins", detail: "8 failed attempts for u_002 (priya.nair@gmail.com) from 203.0.113.42", severity: "warning" as const, at: "2024-10-20T07:20:00Z" },
  { id: "sa2", title: "Login from new location", detail: "u_003 (rohan.mehta) logged in from new IP 198.51.100.7", severity: "info" as const, at: "2024-10-19T22:00:00Z" },
  { id: "sa3", title: "Privilege escalation attempt", detail: "User attempted to access admin endpoint without role", severity: "critical" as const, at: "2024-10-18T11:00:00Z" },
  { id: "sa4", title: "API key used from unusual ASN", detail: "Key k1 used from datacenter IP range", severity: "warning" as const, at: "2024-10-17T09:00:00Z" },
];

export function AdminAudit() {
  const [search, setSearch] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState("all");
  const [actorFilter, setActorFilter] = React.useState("all");
  const [actionFilter, setActionFilter] = React.useState("all");

  const allActions = Array.from(new Set(auditLogs.map((l) => l.action)));
  const allActors = Array.from(new Set(auditLogs.map((l) => l.actor)));

  const filtered = auditLogs.filter((l) => {
    if (search && !`${l.actor} ${l.action} ${l.resource} ${l.resourceId} ${l.details}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (severityFilter !== "all" && l.severity !== severityFilter) return false;
    if (actorFilter !== "all" && l.actor !== actorFilter) return false;
    if (actionFilter !== "all" && l.action !== actionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Security & Audit Logs"
        description="Immutable audit trail of platform actions and security events."
        icon={<Icon name="ScrollText" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Audit log exported (demo)") }]}
      />

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
        <Icon name="Lock" className="mr-1 inline h-3.5 w-3.5 text-amber-600" />
        Audit logs are <strong>immutable</strong> and tamper-evident. Append-only with cryptographic chain. Retention: 7 years per compliance policy.
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Events (30d)" value="14,820" icon="ScrollText" />
        <MiniStat label="Critical" value={auditLogs.filter((l) => l.severity === "critical").length + 3} icon="AlertTriangle" tone="danger" />
        <MiniStat label="Warnings" value={auditLogs.filter((l) => l.severity === "warning").length + 12} icon="AlertTriangle" tone="warning" />
        <MiniStat label="Failed logins" value="38" icon="Lock" tone="warning" />
      </div>

      <SectionCard title="Security alerts" description="Recent security events requiring review.">
        <ul className="space-y-2">
          {SECURITY_ALERTS.map((a) => (
            <li key={a.id} className="rounded-md border p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={a.severity} />
                  <p className="text-sm font-medium">{a.title}</p>
                </div>
                <span className="text-xs text-muted-foreground">{timeAgo(a.at)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{a.detail}</p>
              <div className="mt-2 flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => toast.info("Marked as reviewed")}>Review</Button>
                <Button size="sm" variant="ghost" onClick={() => toast.info("Investigate (demo)")}>Investigate</Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title={`Audit log (${filtered.length})`}>
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search actor, action, resource..."
          filters={
            <>
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
                <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Actor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actors</SelectItem>
                  {allActors.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Action" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {allActions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </>
          }
        />
        <div className="mt-3 max-h-[30rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l: AuditLog) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={l.actor} size="xs" />
                      <span className="text-sm">{l.actor}</span>
                    </div>
                  </TableCell>
                  <TableCell><code className="font-mono text-xs">{l.action}</code></TableCell>
                  <TableCell className="text-xs">{l.resource} <span className="text-muted-foreground">{l.resourceId}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[18rem] truncate">{l.details}</TableCell>
                  <TableCell className="font-mono text-xs">{l.ip}</TableCell>
                  <TableCell><SeverityBadge severity={l.severity} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(l.timestamp)}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No matching events.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone?: "danger" | "warning" }) {
  const toneCls = tone === "danger" ? "text-rose-600 bg-rose-500/10 dark:text-rose-300" : tone === "warning" ? "text-amber-600 bg-amber-500/10 dark:text-amber-300" : "text-muted-foreground bg-muted";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneCls}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
