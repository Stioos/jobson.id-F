"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ScrollText, Download, Filter, Search, ShieldAlert, Activity, CheckCircle2, XCircle, Clock, AlertTriangle, Radio,
} from "lucide-react";
import { adminUsers } from "@/lib/talent-solutions-data";
import { formatDateTime, timeAgo } from "@/lib/format";

// Generate audit log entries derived from adminUsers' activities
interface AuditEntry {
  id: string;
  actor: string;
  actorId: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  status: "success" | "warning" | "failed";
  details: string;
}

const MODULES = ["Auth", "Users", "Roles", "Billing", "Transactions", "Content", "Partners", "Reports", "Settings", "Support"];

const AUDIT_LOGS: AuditEntry[] = [
  { id: "aud_001", actor: "Aarav Sharma", actorId: "adm_001", action: "user.create", module: "Users", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), ip: "10.0.1.24", status: "success", details: "Created user 'Priya Menon' (adm_009) with role: support" },
  { id: "aud_002", actor: "Aarav Sharma", actorId: "adm_001", action: "role.update", module: "Roles", timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), ip: "10.0.1.24", status: "success", details: "Updated role 'manager' — added permission: team.manage" },
  { id: "aud_003", actor: "Divya Sharma", actorId: "adm_002", action: "user.suspend", module: "Users", timestamp: new Date(Date.now() - 26 * 3600000).toISOString(), ip: "10.0.2.18", status: "warning", details: "Suspended user 'Sanjay Pillai' (adm_010) — policy violation" },
  { id: "aud_004", actor: "Rahul Gupta", actorId: "adm_004", action: "transaction.refund", module: "Transactions", timestamp: new Date(Date.now() - 50 * 3600000).toISOString(), ip: "10.0.3.42", status: "success", details: "Refund ₹1,50,000 processed for TTX-2024-5012 (LogiMove)" },
  { id: "aud_005", actor: "System", actorId: "system", action: "auth.login_failed", module: "Auth", timestamp: new Date(Date.now() - 70 * 3600000).toISOString(), ip: "203.0.113.55", status: "failed", details: "Failed login attempt for admin@jobsonn.com — invalid password (3rd attempt)" },
  { id: "aud_006", actor: "Karthik Nair", actorId: "adm_003", action: "partner.approve", module: "Partners", timestamp: new Date(Date.now() - 90 * 3600000).toISOString(), ip: "10.0.4.12", status: "success", details: "Approved partner application PA-2024-08 (Chennai Tech Academy)" },
  { id: "aud_007", actor: "Sneha Patel", actorId: "adm_005", action: "content.publish", module: "Content", timestamp: new Date(Date.now() - 120 * 3600000).toISOString(), ip: "10.0.5.31", status: "success", details: "Published course 'React 19 Fundamentals' (crs_014)" },
  { id: "aud_008", actor: "Aarav Sharma", actorId: "adm_001", action: "settings.update", module: "Settings", timestamp: new Date(Date.now() - 150 * 3600000).toISOString(), ip: "10.0.1.24", status: "warning", details: "Disabled global MFA enforcement — please review" },
  { id: "aud_009", actor: "Vikram Reddy", actorId: "adm_006", action: "report.export", module: "Reports", timestamp: new Date(Date.now() - 180 * 3600000).toISOString(), ip: "10.0.6.55", status: "success", details: "Exported 'Partner Performance Q3 2024' report (PDF, 4.2MB)" },
  { id: "aud_010", actor: "System", actorId: "system", action: "auth.session_expired", module: "Auth", timestamp: new Date(Date.now() - 200 * 3600000).toISOString(), ip: "10.0.7.22", status: "warning", details: "Session expired for user adm_010 (Sanjay Pillai) — 8h idle" },
  { id: "aud_011", actor: "Rahul Gupta", actorId: "adm_004", action: "invoice.generate", module: "Billing", timestamp: new Date(Date.now() - 220 * 3600000).toISOString(), ip: "10.0.3.42", status: "success", details: "Generated invoice INV-2024-5004 for FinEdge (₹6,00,000)" },
  { id: "aud_012", actor: "Divya Sharma", actorId: "adm_002", action: "user.role_change", module: "Users", timestamp: new Date(Date.now() - 250 * 3600000).toISOString(), ip: "10.0.2.18", status: "warning", details: "Changed Meera Iyer role from analyst → manager" },
  { id: "aud_013", actor: "Arjun Kumar", actorId: "adm_008", action: "ticket.resolve", module: "Support", timestamp: new Date(Date.now() - 280 * 3600000).toISOString(), ip: "10.0.8.14", status: "success", details: "Resolved support ticket #TKT-2024-1042 — candidate login issue" },
  { id: "aud_014", actor: "System", actorId: "system", action: "system.backup", module: "Settings", timestamp: new Date(Date.now() - 300 * 3600000).toISOString(), ip: "127.0.0.1", status: "success", details: "Automated daily backup completed (2.4GB)" },
  { id: "aud_015", actor: "Aarav Sharma", actorId: "adm_001", action: "user.delete", module: "Users", timestamp: new Date(Date.now() - 350 * 3600000).toISOString(), ip: "10.0.1.24", status: "failed", details: "Failed to delete user adm_011 — foreign key constraint on transactions" },
];

export function AdminAuditLogs() {
  const [moduleFilter, setModuleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [actorFilter, setActorFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<AuditEntry | null>(null);
  const [realtime, setRealtime] = React.useState(false);

  // Realtime feed simulation: prepend a synthetic entry every 8s
  const [extraEntries, setExtraEntries] = React.useState<AuditEntry[]>([]);
  React.useEffect(() => {
    if (!realtime) return;
    const id = setInterval(() => {
      const actors = adminUsers.filter((u) => u.status === "active");
      const a = actors[Math.floor(Math.random() * actors.length)];
      const mods = MODULES;
      const m = mods[Math.floor(Math.random() * mods.length)];
      const actions = ["user.login", "report.view", "settings.update", "content.read", "transactions.view"];
      const act = actions[Math.floor(Math.random() * actions.length)];
      setExtraEntries((prev) => [
        {
          id: `live_${Date.now()}`,
          actor: a.name,
          actorId: a.id,
          action: act,
          module: m,
          timestamp: new Date().toISOString(),
          ip: `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 60)}`,
          status: "success" as const,
          details: `[LIVE] ${act} on ${m} module`,
        },
        ...prev,
      ].slice(0, 5));
    }, 8000);
    return () => clearInterval(id);
  }, [realtime]);

  const allEntries = [...extraEntries, ...AUDIT_LOGS];

  const filtered = allEntries.filter((e) => {
    if (moduleFilter !== "all" && e.module !== moduleFilter) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (actorFilter !== "all" && e.actor !== actorFilter) return false;
    if (dateFilter !== "all") {
      const hours = parseInt(dateFilter);
      const cutoff = Date.now() - hours * 3600000;
      if (new Date(e.timestamp).getTime() < cutoff) return false;
    }
    if (search && !e.action.toLowerCase().includes(search.toLowerCase()) && !e.details.toLowerCase().includes(search.toLowerCase()) && !e.actor.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const successCount = AUDIT_LOGS.filter((e) => e.status === "success").length;
  const warningCount = AUDIT_LOGS.filter((e) => e.status === "warning").length;
  const failedCount = AUDIT_LOGS.filter((e) => e.status === "failed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Immutable record of all admin actions across the platform. Used for compliance, security investigations, and change tracking."
        icon={<ScrollText className="h-6 w-6" />}
        breadcrumbs={[{ label: "Platform Admin" }, { label: "Audit Logs" }]}
        actions={[
          { label: "Export", variant: "outline", onClick: () => toast.success("Audit logs exported", { description: "CSV file with 15 entries saved to your downloads." }) },
        ]}
      />

      <Alert className="border-amber-500/30 bg-amber-500/5">
        <ShieldAlert className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-700 dark:text-amber-400">Immutable Notice</AlertTitle>
        <AlertDescription className="text-amber-700/80 dark:text-amber-400/80">
          Audit log entries are write-once and cannot be edited, deleted, or tampered with. All access is logged.
        </AlertDescription>
      </Alert>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Entries" value={AUDIT_LOGS.length} icon={<ScrollText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Success" value={successCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Warnings" value={warningCount} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Failed" value={failedCount} icon={<XCircle className="h-5 w-5" />} tone="danger" />
      </section>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px] space-y-1">
              <Label className="text-xs">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="Action, actor, or details..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Module</Label>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Actor</Label>
              <Select value={actorFilter} onValueChange={setActorFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actors</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  {adminUsers.filter((u) => u.status === "active").map((u) => (
                    <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="24">Last 24h</SelectItem>
                  <SelectItem value="168">Last 7 days</SelectItem>
                  <SelectItem value="720">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setModuleFilter("all"); setStatusFilter("all"); setActorFilter("all"); setDateFilter("all"); }}><Filter className="mr-1 h-4 w-4" /> Reset</Button>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              <Switch checked={realtime} onCheckedChange={setRealtime} />
              <Label className="text-sm flex items-center gap-1">
                {realtime ? <Radio className="h-3 w-3 text-emerald-500 animate-pulse" /> : <Activity className="h-3 w-3 text-muted-foreground" />}
                Real-time feed {realtime && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">LIVE</Badge>}
              </Label>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success("Logs exported", { description: "Filtered audit logs saved as CSV." })}>
              <Download className="mr-1 h-4 w-4" /> Export Filtered
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
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
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-10"><EmptyState icon={<ScrollText className="h-5 w-5" />} title="No audit entries match filters" /></TableCell></TableRow>
                )}
                {filtered.map((e) => (
                  <TableRow key={e.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(e)}>
                    <TableCell className="text-xs font-mono whitespace-nowrap">{formatDateTime(e.timestamp)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {e.actor === "System" ? <span className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-[10px]">SYS</span> : <AvatarLogo text={e.actor} size="xs" />}
                        <span className="text-sm">{e.actor}</span>
                      </div>
                    </TableCell>
                    <TableCell><code className="text-[11px] bg-muted px-1.5 py-0.5 rounded">{e.action}</code></TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{e.module}</Badge></TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{e.ip}</TableCell>
                    <TableCell>
                      {e.status === "success" && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]"><CheckCircle2 className="mr-1 h-3 w-3" /> Success</Badge>}
                      {e.status === "warning" && <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]"><AlertTriangle className="mr-1 h-3 w-3" /> Warning</Badge>}
                      {e.status === "failed" && <Badge variant="outline" className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px]"><XCircle className="mr-1 h-3 w-3" /> Failed</Badge>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs line-clamp-2">{e.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit Entry Detail</DialogTitle>
            <DialogDescription>{selected?.id}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 py-2">
              <DetailRow label="Timestamp" value={formatDateTime(selected.timestamp)} mono />
              <DetailRow label="Relative" value={timeAgo(selected.timestamp)} />
              <DetailRow label="Actor" value={selected.actor} />
              <DetailRow label="Actor ID" value={selected.actorId} mono />
              <DetailRow label="Action" value={selected.action} mono />
              <DetailRow label="Module" value={selected.module} />
              <DetailRow label="IP Address" value={selected.ip} mono />
              <DetailRow label="Status" value={selected.status} />
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground mb-1">Details</p>
                <p className="text-sm">{selected.details}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b pb-2">
      <span className="text-xs uppercase text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
