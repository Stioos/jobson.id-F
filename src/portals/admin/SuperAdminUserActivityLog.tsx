"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface LogRow {
  id: string; user: string; portal: string; action: string; resource: string;
  timestamp: string; ip: string; device: string; location: string;
  status: "success" | "failed" | "blocked"; flagged?: boolean;
}

const LOGS: LogRow[] = [
  { id: "log_001", user: "aarav@jobson.id", portal: "admin", action: "Login", resource: "auth", timestamp: "2024-09-21T09:55:00Z", ip: "103.21.58.42", device: "Chrome / macOS", location: "Bengaluru, IN", status: "success" },
  { id: "log_002", user: "neha@jobson.id", portal: "admin", action: "Edit", resource: "employer/emp_002", timestamp: "2024-09-21T09:42:00Z", ip: "103.21.58.50", device: "Firefox / Windows", location: "Mumbai, IN", status: "success" },
  { id: "log_003", user: "unknown@temp.com", portal: "admin", action: "Login", resource: "auth", timestamp: "2024-09-21T09:35:00Z", ip: "45.83.21.10", device: "Unknown", location: "Unknown", status: "blocked", flagged: true },
  { id: "log_004", user: "raj@jobson.id", portal: "admin", action: "Export", resource: "transactions.csv", timestamp: "2024-09-21T09:20:00Z", ip: "103.21.58.55", device: "Edge / Windows", location: "Delhi, IN", status: "success" },
  { id: "log_005", user: "sneha@jobson.id", portal: "admin", action: "Delete", resource: "job/job_884", timestamp: "2024-09-21T09:10:00Z", ip: "103.21.58.62", device: "Chrome / macOS", location: "Hyderabad, IN", status: "success" },
  { id: "log_006", user: "vikram@jobson.id", portal: "admin", action: "Impersonate", resource: "user/u_005", timestamp: "2024-09-21T08:55:00Z", ip: "203.0.113.5", device: "Chrome / Linux", location: "Pune, IN", status: "success", flagged: true },
  { id: "log_007", user: "pooja@jobson.id", portal: "partner", action: "Create", resource: "partner/par_021", timestamp: "2024-09-21T08:30:00Z", ip: "103.21.58.70", device: "Safari / iOS", location: "Chennai, IN", status: "success" },
  { id: "log_008", user: "karan@jobson.id", portal: "admin", action: "View", resource: "audit_log", timestamp: "2024-09-21T08:15:00Z", ip: "192.168.1.10", device: "Chrome / Android", location: "Bengaluru, IN", status: "failed" },
  { id: "log_009", user: "rohan@techcorp.com", portal: "employer", action: "Logout", resource: "auth", timestamp: "2024-09-21T08:00:00Z", ip: "103.21.58.80", device: "Chrome / Windows", location: "Bengaluru, IN", status: "success" },
  { id: "log_010", user: "support@temp.in", portal: "admin", action: "Login", resource: "auth", timestamp: "2024-09-21T07:45:00Z", ip: "198.51.100.22", device: "Unknown", location: "Foreign", status: "blocked", flagged: true },
];

const ACTION_TYPES = ["All", "Login", "Logout", "Create", "Edit", "Delete", "View", "Export", "Impersonate"];
const PORTAL_OPTS = ["All", "admin", "employer", "recruiter", "training", "partner"];

export function SuperAdminUserActivityLog() {
  const [search, setSearch] = React.useState("");
  const [action, setAction] = React.useState("All");
  const [portal, setPortal] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [realtime, setRealtime] = React.useState(false);
  const [flaggedOnly, setFlaggedOnly] = React.useState(false);

  const filtered = LOGS.filter(l => {
    const s = search.toLowerCase();
    const matchS = !s || l.user.toLowerCase().includes(s) || l.resource.toLowerCase().includes(s) || l.ip.includes(s);
    const matchA = action === "All" || l.action === action;
    const matchP = portal === "All" || l.portal === portal;
    const matchSt = statusFilter === "All" || l.status === statusFilter.toLowerCase();
    const matchF = !flaggedOnly || l.flagged;
    return matchS && matchA && matchP && matchSt && matchF;
  });

  const today = LOGS.length;
  const flagged = LOGS.filter(l => l.flagged).length;
  const failed = LOGS.filter(l => l.status !== "success").length;

  const statusBadge = (s: string) =>
    s === "success" ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">Success</Badge>
    : s === "failed" ? <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30">Failed</Badge>
    : <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30">Blocked</Badge>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Activity Log"
        description="Comprehensive audit trail of every user action across portals. Detect anomalies in real-time."
        icon={<Icon name="History" className="h-6 w-6" />}
        actions={[{ label: "Export Log", variant: "outline", onClick: () => toast.success("Export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Today's Actions" value={today} icon={<Icon name="Activity" className="h-5 w-5" />} tone="brand" />
        <StatCard label="This Week" value={today * 6} icon={<Icon name="CalendarCheck2" className="h-5 w-5" />} />
        <StatCard label="This Month" value={today * 22} icon={<Icon name="Calendar" className="h-5 w-5" />} tone="success" />
        <StatCard label="Flagged" value={flagged} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard
        title="Activity Feed"
        description={`${filtered.length} of ${LOGS.length} entries`}
        action={
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs">
              <Switch checked={flaggedOnly} onCheckedChange={setFlaggedOnly} /> Flagged only
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <Switch checked={realtime} onCheckedChange={(v) => {
                setRealtime(v);
                if (v) toast.success("Real-time feed enabled");
                else toast.info("Real-time feed paused");
              }} /> Live
            </label>
          </div>
        }
      >
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user, resource or IP…" className="h-9 lg:max-w-xs" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACTION_TYPES.map(a => <SelectItem key={a} value={a}>{a === "All" ? "All Actions" : a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={portal} onValueChange={setPortal}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PORTAL_OPTS.map(p => <SelectItem key={p} value={p}>{p === "All" ? "All Portals" : p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="History" className="h-5 w-5" />} title="No activity matches filters" description="Adjust filters to see results." />
        ) : (
          <div className="max-h-[28rem] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Device / Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(l => (
                  <TableRow key={l.id} className={l.flagged ? "bg-rose-500/5" : ""}>
                    <TableCell className="text-xs font-medium">
                      {l.user}
                      {l.flagged && <Icon name="AlertTriangle" className="ml-1 inline h-3 w-3 text-rose-500" />}
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{l.portal}</Badge></TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-500/5 text-emerald-700 border-emerald-500/20 text-[10px]">{l.action}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-[11px]">{l.resource}</TableCell>
                    <TableCell className="text-[11px] text-muted-foreground">{l.timestamp.replace("T", " ").slice(0, 16)}</TableCell>
                    <TableCell className="font-mono text-[11px]">{l.ip}</TableCell>
                    <TableCell className="text-[11px]">
                      <div>{l.device}</div>
                      <div className="text-muted-foreground">{l.location}</div>
                    </TableCell>
                    <TableCell>{statusBadge(l.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Anomaly Detection" description="Unusual patterns automatically flagged">
          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 p-3">
              <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 text-rose-600" />
              <div>
                <div className="text-sm font-medium">Foreign IP blocked</div>
                <div className="text-xs text-muted-foreground">unknown@temp.com attempted login from 45.83.21.10 (Unknown location)</div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <Icon name="AlertCircle" className="mt-0.5 h-4 w-4 text-amber-600" />
              <div>
                <div className="text-sm font-medium">Impersonation outside business hours</div>
                <div className="text-xs text-muted-foreground">vikram@jobson.id impersonated user/u_005 at 08:55 IST</div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <Icon name="AlertCircle" className="mt-0.5 h-4 w-4 text-amber-600" />
              <div>
                <div className="text-sm font-medium">Bulk export by billing admin</div>
                <div className="text-xs text-muted-foreground">raj@jobson.id exported transactions.csv — {failed} failed attempts in window</div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Retention Status" description="Audit log retention policy">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Hot retention</div>
                <div className="text-xs text-muted-foreground">Searchable, full detail</div>
              </div>
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">90 days</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Warm retention</div>
                <div className="text-xs text-muted-foreground">Indexed summaries</div>
              </div>
              <Badge variant="outline" className="bg-amber-500/15 text-amber-700 border-amber-500/30">1 year</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Cold archive</div>
                <div className="text-xs text-muted-foreground">Encrypted, on-demand retrieval</div>
              </div>
              <Badge variant="outline" className="bg-slate-500/15 text-slate-500 border-slate-500/30">7 years</Badge>
            </div>
            <Button size="sm" variant="outline" className="w-full" onClick={() => toast.info("Configure retention policy")}>Configure Retention</Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
