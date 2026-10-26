"use client";

import * as React from "react";
import { recruitmentAuditLogs } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { toast } from "sonner";
import { ScrollText, Search, Download, ShieldCheck, AlertTriangle, Lock, Activity } from "lucide-react";

const MODULES = Array.from(new Set(recruitmentAuditLogs.map((l) => l.module)));

export function PartnerAuditLogs() {
  const partner = CURRENT_PARTNER;
  const [moduleFilter, setModuleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = recruitmentAuditLogs.filter((l) => {
    if (moduleFilter !== "all" && l.module !== moduleFilter) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (search && !`${l.actor} ${l.action} ${l.details} ${l.ip}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateRange !== "all") {
      const d = new Date(l.timestamp).getTime();
      const now = Date.now();
      const days = parseInt(dateRange, 10);
      if (now - d > days * 86400000) return false;
    }
    return true;
  });

  const successCount = recruitmentAuditLogs.filter((l) => l.status === "success").length;
  const warningCount = recruitmentAuditLogs.filter((l) => l.status === "warning").length;
  const failedCount = recruitmentAuditLogs.filter((l) => l.status === "failed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description={`${partner.name} — immutable record of all critical actions taken by your team on the partner portal.`}
        icon={<Icon name="ScrollText" className="h-6 w-6" />}
        actions={[{ label: "Export", icon: "Download", variant: "outline", onClick: () => toast.success("Audit log export started", { description: "CSV file will be ready shortly." }) }]}
      />
      <PartnerDisclaimer />

      {/* Immutable notice */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-3">
        <Lock className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-amber-700">Immutable audit trail</p>
          <p className="mt-0.5 text-xs text-amber-700/80">Audit logs are append-only and tamper-evident. Entries cannot be modified or deleted. Retained for 7 years per compliance requirements.</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Events" value={recruitmentAuditLogs.length} icon={<Activity className="h-5 w-5" />} tone="brand" />
        <StatCard label="Success" value={successCount} icon={<ShieldCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Warnings" value={warningCount} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Failed" value={failedCount} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search actor, action, IP..." className="h-9 w-full pl-8 sm:w-64" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Module" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Date" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="max-h-[560px] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No audit entries match your filters.</TableCell></TableRow>
              ) : filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs whitespace-nowrap font-mono">{formatDateTime(l.timestamp)}</TableCell>
                  <TableCell className="text-sm font-medium">{l.actor}</TableCell>
                  <TableCell><span className="font-mono text-xs">{l.action}</span></TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{l.module}</Badge></TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{l.ip}</TableCell>
                  <TableCell><StatusBadge status={l.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs">{l.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
