"use client";

import * as React from "react";
import {
  ScrollText, Shield, Download, Search, User, Building2,
  AlertTriangle, Activity, ChevronRight, Lock, Cpu,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";
import { recruitmentAuditLogs } from "@/lib/partner-data";
import type { RecruitmentAuditLog } from "@/lib/partner-data";

const MODULES = Array.from(new Set(recruitmentAuditLogs.map((l) => l.module))).sort();

const STATUS_ICON: Record<RecruitmentAuditLog["status"], React.ReactNode> = {
  success: <div className="h-2 w-2 rounded-full bg-emerald-500" />,
  failed: <div className="h-2 w-2 rounded-full bg-rose-500" />,
  warning: <div className="h-2 w-2 rounded-full bg-amber-500" />,
};

export function RecruiterAuditLogs() {
  const [search, setSearch] = React.useState("");
  const [moduleFilter, setModuleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rangeFilter, setRangeFilter] = React.useState("30d");
  const [detail, setDetail] = React.useState<RecruitmentAuditLog | null>(null);

  const filtered = recruitmentAuditLogs.filter((l) => {
    if (moduleFilter !== "all" && l.module !== moduleFilter) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (rangeFilter !== "all") {
      const days = rangeFilter === "24h" ? 1 : rangeFilter === "7d" ? 7 : 30;
      const cutoff = Date.now() - days * 86400000;
      if (new Date(l.timestamp).getTime() < cutoff) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!l.actor.toLowerCase().includes(q) && !l.action.toLowerCase().includes(q) && !l.details.toLowerCase().includes(q) && !(l.candidateName || "").toLowerCase().includes(q) && !(l.clientName || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Summary stats
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const eventsToday = recruitmentAuditLogs.filter((l) => new Date(l.timestamp).getTime() >= todayStart.getTime()).length;
  const failedOrWarnings = recruitmentAuditLogs.filter((l) => l.status === "failed" || l.status === "warning").length;
  const actorCount: Record<string, number> = {};
  recruitmentAuditLogs.forEach((l) => { actorCount[l.actor] = (actorCount[l.actor] || 0) + 1; });
  const topActor = Object.entries(actorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit logs"
        description="Immutable record of every action taken in your recruitment workspace. Compliance-ready."
        actions={[
          { label: "Export", onClick: () => toast.success("Audit log exported", { description: `${filtered.length} entries • CSV` }) },
        ]}
      />

      {/* Immutable notice */}
      <div className="rounded-xl border border-brand/30 bg-brand/5 p-3 flex items-start gap-2">
        <Lock className="h-4 w-4 text-brand mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-brand">Immutable audit trail:</span>{" "}
          All entries are write-once and tamper-evident. Once recorded, an audit entry cannot be edited or deleted — even by owners. Required for SOC 2 and DPDP compliance.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Events today" value={eventsToday} icon={<Activity className="h-5 w-5" />} tone="brand" />
        <StatCard label="Failed / warnings" value={failedOrWarnings} icon={<AlertTriangle className="h-5 w-5" />} tone={failedOrWarnings > 0 ? "warning" : "default"} hint="Needs review" />
        <StatCard label="Total events" value={recruitmentAuditLogs.length} icon={<ScrollText className="h-5 w-5" />} tone="success" hint="All time" />
        <StatCard label="Top actor" value={topActor} icon={<User className="h-5 w-5" />} tone="default" hint={`${actorCount[topActor] || 0} events`} />
      </div>

      <SectionCard
        title="Audit entries"
        description="Filter by module, status, date range or search by actor / action / details."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search actor, action, details…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-44 pl-8 sm:w-56"
              />
            </div>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Module" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modules</SelectItem>
                {MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rangeFilter} onValueChange={setRangeFilter}>
              <SelectTrigger className="h-8 w-28"><SelectValue placeholder="Range" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<ScrollText className="h-5 w-5" />} title="No audit entries match" description="Adjust filters or search." />
        ) : (
          <div className="max-h-[40rem] overflow-y-auto scroll-thin -mx-4 sm:-mx-5">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30 sticky top-0">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actor</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                  <th className="px-3 py-2 font-medium hidden sm:table-cell">Module</th>
                  <th className="px-3 py-2 font-medium hidden lg:table-cell">Details</th>
                  <th className="px-3 py-2 font-medium hidden md:table-cell">IP</th>
                  <th className="px-3 py-2 font-medium">Timestamp</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setDetail(l)}>
                    <td className="px-4 py-3">{STATUS_ICON[l.status]}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {l.actor === "System" ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Cpu className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <AvatarLogo text={l.actor} size="xs" />
                        )}
                        <span className="text-xs font-medium truncate max-w-[120px]">{l.actor}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <code className="text-xs font-mono">{l.action}</code>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-muted/50">{l.module}</span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground text-xs max-w-[280px] truncate">{l.details}</td>
                    <td className="px-3 py-3 hidden md:table-cell text-xs text-muted-foreground font-mono">{l.ip}</td>
                    <td className="px-3 py-3">
                      <div className="text-xs">{formatDateTime(l.timestamp)}</div>
                      <div className="text-xs text-muted-foreground">{timeAgo(l.timestamp)}</div>
                    </td>
                    <td className="px-3 py-3"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-brand" />
                  Audit entry
                </DialogTitle>
                <DialogDescription>Immutable record — cannot be edited or deleted.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {STATUS_ICON[detail.status]}
                    <StatusBadge status={detail.status} />
                  </div>
                  <code className="text-xs font-mono text-muted-foreground">{detail.id}</code>
                </div>

                <div className="rounded-lg border p-3 space-y-2.5 text-sm">
                  <Field label="Action" value={<code className="font-mono">{detail.action}</code>} />
                  <Separator />
                  <Field label="Module" value={<span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-muted/50">{detail.module}</span>} />
                  <Separator />
                  <Field label="Actor" value={
                    <div className="flex items-center gap-2">
                      {detail.actor === "System" ? <Cpu className="h-4 w-4 text-muted-foreground" /> : <AvatarLogo text={detail.actor} size="xs" />}
                      <span>{detail.actor}</span>
                    </div>
                  } />
                  <Separator />
                  <Field label="IP address" value={<code className="font-mono text-xs">{detail.ip}</code>} />
                  <Separator />
                  <Field label="Timestamp" value={formatDateTime(detail.timestamp)} />
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">Details</div>
                  <div className="text-sm">{detail.details}</div>
                </div>

                {(detail.candidateName || detail.clientName) && (
                  <div className="rounded-lg border p-3 space-y-1.5">
                    <div className="text-xs text-muted-foreground mb-1">Related entities</div>
                    {detail.candidateName && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground" /> {detail.candidateName}
                      </div>
                    )}
                    {detail.clientName && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> {detail.clientName}
                      </div>
                    )}
                  </div>
                )}

                <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
                  <Shield className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" />
                  <span>This entry is part of the immutable audit trail. Hash-chained for tamper detection. Retained per data-retention policy.</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => toast.success("Audit entry copied", { description: detail.id })}>
                  Copy entry ID
                </Button>
                <Button variant="outline" onClick={() => setDetail(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
