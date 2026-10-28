"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface Leave {
  id: string; employee: string; employer: string; type: "annual" | "sick" | "casual" | "unpaid" | "maternity"; days: number; startDate: string; status: "pending" | "approved" | "rejected"; flagged: boolean;
}

const LEAVES: Leave[] = [
  { id: "LV-2024-5001", employee: "Priya Nair", employer: "TechCorp India", type: "annual", days: 5, startDate: "2024-10-10", status: "approved", flagged: false },
  { id: "LV-2024-5002", employee: "Rohan Mehta", employer: "Wipro Ltd", type: "sick", days: 2, startDate: "2024-09-22", status: "approved", flagged: false },
  { id: "LV-2024-5003", employee: "Sneha Reddy", employer: "TCS", type: "casual", days: 1, startDate: "2024-09-25", status: "pending", flagged: false },
  { id: "LV-2024-5004", employee: "Aarav Sharma", employer: "Infosys BPM", type: "annual", days: 10, startDate: "2024-11-01", status: "pending", flagged: true },
  { id: "LV-2024-5005", employee: "Anika Verma", employer: "HCL Technologies", type: "maternity", days: 84, startDate: "2024-10-15", status: "approved", flagged: false },
  { id: "LV-2024-5006", employee: "Karthik Iyer", employer: "Tech Mahindra", type: "unpaid", days: 30, startDate: "2024-09-01", status: "approved", flagged: true },
  { id: "LV-2024-5007", employee: "Meera Joshi", employer: "Accenture", type: "sick", days: 14, startDate: "2024-08-15", status: "approved", flagged: true },
  { id: "LV-2024-5008", employee: "Vikram Singh", employer: "Cognizant", type: "casual", days: 3, startDate: "2024-09-28", status: "pending", flagged: false },
];

const LEAVE_TYPES = [
  { type: "Annual", pct: 42, count: 4_820 },
  { type: "Sick", pct: 28, count: 3_210 },
  { type: "Casual", pct: 18, count: 2_064 },
  { type: "Unpaid", pct: 8, count: 918 },
  { type: "Maternity", pct: 4, count: 459 },
];

const ABSENTEEISM = [
  { employer: "Cognizant", rate: 6.8 },
  { employer: "Tech Mahindra", rate: 5.4 },
  { employer: "Wipro Ltd", rate: 4.2 },
  { employer: "Infosys BPM", rate: 3.8 },
  { employer: "TCS", rate: 2.9 },
  { employer: "Accenture", rate: 2.1 },
];

const ABUSE = [
  { employee: "Karthik Iyer", employer: "Tech Mahindra", pattern: "Frequent Monday/Friday sick leaves (8 of 10)", severity: "high" },
  { employee: "Aarav Sharma", employer: "Infosys BPM", pattern: "Annual leave exceeding accrual by 5 days", severity: "medium" },
  { employee: "Meera Joshi", employer: "Accenture", pattern: "14-day sick leave w/o medical certificate", severity: "medium" },
];

export function SuperAdminLeaveOversight() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("all");

  const filtered = LEAVES.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.employee.toLowerCase().includes(q) || l.employer.toLowerCase().includes(q);
    const matchType = type === "all" || l.type === type;
    return matchSearch && matchType;
  });

  const pending = LEAVES.filter(l => l.status === "pending").length;
  const approved = LEAVES.filter(l => l.status === "approved").length;
  const flagged = LEAVES.filter(l => l.flagged).length;

  const statusBadge = (s: Leave["status"]) => {
    const cls = s === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : s === "rejected" ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Oversight"
        description="Platform-wide leave management — approval rates, type distribution, absenteeism by employer, policy compliance, and abuse detection (pattern-based)."
        icon={<Icon name="CalendarOff" className="h-6 w-6" />}
        actions={[{ label: "Policy Audit", variant: "outline", onClick: () => toast.success("Policy audit queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Leave Requests (90d)" value={LEAVES.length} icon={<Icon name="CalendarOff" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Approval" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved" value={approved} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Abuse Flags" value={flagged} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Leave Type Distribution" description="Across all employers" className="lg:col-span-2">
          <div className="space-y-3">
            {LEAVE_TYPES.map(t => (
              <div key={t.type}>
                <div className="flex justify-between text-xs">
                  <span>{t.type} Leave</span>
                  <span className="font-medium">{t.count.toLocaleString()} · {t.pct}%</span>
                </div>
                <Progress className="mt-1 h-2" value={t.pct} />
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Absenteeism by Employer" description="Avg monthly %">
          <div className="space-y-2">
            {ABSENTEEISM.sort((a, b) => b.rate - a.rate).map(a => (
              <div key={a.employer} className="flex items-center gap-3">
                <span className="flex-1 truncate text-xs">{a.employer}</span>
                <Progress className="h-1.5 w-16" value={a.rate * 10} />
                <span className="w-10 text-right text-xs font-medium">{a.rate}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Leave Applications" description={`${filtered.length} of ${LEAVES.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee or employer…" className="h-9 max-w-sm" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="maternity">Maternity</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flag</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(l => (
                <TableRow key={l.id} className={l.flagged ? "bg-amber-500/5" : ""}>
                  <TableCell className="font-mono text-xs">{l.id}</TableCell>
                  <TableCell className="font-medium text-sm">{l.employee}</TableCell>
                  <TableCell className="text-xs">{l.employer}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs capitalize">{l.type}</Badge></TableCell>
                  <TableCell className="text-xs">{l.days}d</TableCell>
                  <TableCell className="text-xs">{formatDate(l.startDate)}</TableCell>
                  <TableCell>{statusBadge(l.status)}</TableCell>
                  <TableCell>
                    {l.flagged ? <Icon name="AlertTriangle" className="h-4 w-4 text-amber-500" /> : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    {l.status === "pending" ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`Leave ${l.id} approved`)}>Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Leave ${l.id} rejected`)}>Reject</Button>
                      </div>
                    ) : <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Viewing ${l.id}`)}>View</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Leave Abuse Detection" description="Pattern-based anomaly flags">
        {ABUSE.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No abuse signals" />
        ) : (
          <div className="space-y-2">
            {ABUSE.map(a => (
              <div key={a.employee} className={`flex items-center gap-3 rounded-lg border p-3 ${a.severity === "high" ? "border-rose-500/30 bg-rose-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                <Icon name={a.severity === "high" ? "AlertTriangle" : "AlertCircle"} className={`h-5 w-5 ${a.severity === "high" ? "text-rose-500" : "text-amber-500"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.employee} · {a.employer}</p>
                  <p className="text-xs text-muted-foreground">{a.pattern}</p>
                </div>
                <Badge variant="outline" className={`text-xs capitalize ${a.severity === "high" ? "border-rose-500/30 bg-rose-500/15 text-rose-700" : "border-amber-500/30 bg-amber-500/15 text-amber-700"}`}>{a.severity}</Badge>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`HR review opened for ${a.employee}`)}>HR Review</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
