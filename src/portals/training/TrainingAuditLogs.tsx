"use client";

import * as React from "react";
import { trainingAuditLogs, type TrainingAuditLog } from "@/lib/lms-data";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, CardDescription, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { TenantDisclaimer } from "./_shared";
import { formatDateTime, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import {
  Search, Download, ShieldCheck, AlertTriangle, Activity, User,
  Lock, Filter, ScrollText,
} from "lucide-react";

export function TrainingAuditLogs() {
  const [search, setSearch] = React.useState("");
  const [actorFilter, setActorFilter] = React.useState("all");
  const [moduleFilter, setModuleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<TrainingAuditLog | null>(null);

  const actors = Array.from(new Set(trainingAuditLogs.map((l) => l.actor)));
  const modules = Array.from(new Set(trainingAuditLogs.map((l) => l.module)));

  const filtered = trainingAuditLogs.filter((l) => {
    const ms = search === "" ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase());
    const ma = actorFilter === "all" || l.actor === actorFilter;
    const mm = moduleFilter === "all" || l.module === moduleFilter;
    const mst = statusFilter === "all" || l.status === statusFilter;
    return ms && ma && mm && mst;
  });

  const todayEvents = trainingAuditLogs.filter((l) => {
    const d = new Date(l.timestamp);
    return d.toDateString() === new Date().toDateString();
  }).length;
  // For demo we count events in the last 7 days as "today" since timestamps are spread
  const recentEvents = trainingAuditLogs.filter((l) => new Date(l.timestamp).getTime() > Date.now() - 7 * 86400000).length;
  const failedCount = trainingAuditLogs.filter((l) => l.status === "failed").length;
  const warningCount = trainingAuditLogs.filter((l) => l.status === "warning").length;
  const topActor = actors[0] ?? "System";

  function exportLogs() {
    toast.success(`Exporting ${filtered.length} audit log entries as CSV…`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit logs"
        description="Immutable training-specific audit trail — every action across courses, enrollments, compliance, contracts, and finance."
        icon={<ScrollText className="h-6 w-6" />}
        actions={[{ label: "Export", icon: "Download", variant: "outline", onClick: exportLogs }]}
      />
      <TenantDisclaimer />

      {/* Immutable notice */}
      <div className="flex items-start gap-3 rounded-xl border border-brand/30 bg-brand/5 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
        <div>
          <p className="text-sm font-semibold">Immutable audit trail</p>
          <p className="text-xs text-muted-foreground">
            Audit logs are write-once and tamper-evident. They are retained for 7 years per compliance requirements and cannot be modified or deleted by any user, including admins.
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Events today" value={recentEvents} icon={<Activity className="h-5 w-5" />} tone="brand" hint={`${todayEvents} in last 24h`} />
        <StatCard label="Failed events" value={failedCount} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
        <StatCard label="Warnings" value={warningCount} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Top actor" value={topActor} icon={<User className="h-5 w-5" />} />
      </div>

      {/* Filters */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by actor, action, or details…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={actorFilter} onValueChange={setActorFilter}>
            <SelectTrigger className="w-[160px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Actor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actors</SelectItem>
              {actors.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {modules.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={() => { setSearch(""); setActorFilter("all"); setModuleFilter("all"); setStatusFilter("all"); }}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Audit entries ({filtered.length})</CardTitle>
            <CardDescription>Showing {filtered.length} of {trainingAuditLogs.length} events</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={exportLogs}>
            <Download className="mr-1 h-3.5 w-3.5" /> Export
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title="No matching audit entries"
              description="Try adjusting your filters or search query."
            />
          ) : (
            <div className="max-h-[560px] overflow-y-auto scroll-thin">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Client</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow key={l.id} className="cursor-pointer" onClick={() => setDetail(l)}>
                      <TableCell className="text-sm font-medium">{l.actor}</TableCell>
                      <TableCell className="text-sm">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono">{l.action}</code>
                      </TableCell>
                      <TableCell className="text-sm">{l.module}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div>{formatDateTime(l.timestamp)}</div>
                        <div className="text-[10px]">{timeAgo(l.timestamp)}</div>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{l.ip}</TableCell>
                      <TableCell><StatusBadge status={l.status} /></TableCell>
                      <TableCell className="text-sm">{l.clientName ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance framing */}
      <Card className="p-4">
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-brand" /> Compliance & retention
        </CardTitle>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Retention period</p>
            <p className="mt-1 text-sm font-semibold">7 years</p>
            <p className="text-xs text-muted-foreground">Per DPDP & ISO 27001</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Hash chain</p>
            <p className="mt-1 text-sm font-semibold">SHA-256 chained</p>
            <p className="text-xs text-muted-foreground">Tamper-evident</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">External SIEM</p>
            <p className="mt-1 text-sm font-semibold">Splunk / Sentinel</p>
            <p className="text-xs text-muted-foreground">Real-time forward</p>
          </div>
        </div>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => { if (!o) setDetail(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-brand" /> Audit entry
            </DialogTitle>
            <DialogDescription>Full details of the selected audit event.</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-3">
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono">{detail.action}</code>
                  <StatusBadge status={detail.status} />
                </div>
                <p className="mt-2 text-sm">{detail.details}</p>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <DetailRow label="Event ID" value={detail.id} mono />
                <DetailRow label="Timestamp" value={formatDateTime(detail.timestamp)} />
                <DetailRow label="Actor" value={detail.actor} />
                <DetailRow label="Module" value={detail.module} />
                <DetailRow label="IP address" value={detail.ip} mono />
                <DetailRow label="Client" value={detail.clientName ?? "—"} />
              </dl>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                <Lock className="mr-1 inline h-3.5 w-3.5" />
                This entry is immutable and cannot be edited or deleted.
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button variant="outline" onClick={() => toast.success("Audit entry copied to clipboard")}>
              Copy entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border p-2">
      <p className="text-muted-foreground">{label}</p>
      <p className={"mt-0.5 font-medium " + (mono ? "font-mono text-[11px]" : "")}>{value}</p>
    </div>
  );
}
