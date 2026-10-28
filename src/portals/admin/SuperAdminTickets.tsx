"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Ticket {
  id: string; subject: string; requester: string; portal: string; priority: "low" | "medium" | "high" | "urgent"; status: "open" | "in_progress" | "waiting" | "resolved"; agent: string; createdAt: string; sla: string;
}

const TICKETS: Ticket[] = [
  { id: "TKT-2024-8821", subject: "Payout not received", requester: "Sneha Reddy", portal: "recruiter", priority: "urgent", status: "open", agent: "Unassigned", createdAt: "2024-09-21T09:30:00Z", sla: "1h" },
  { id: "TKT-2024-8820", subject: "Cannot post job — billing error", requester: "Rohan Mehta", portal: "employer", priority: "high", status: "in_progress", agent: "Support L2", createdAt: "2024-09-21T08:42:00Z", sla: "4h" },
  { id: "TKT-2024-8819", subject: "Course certificate missing", requester: "Anika Verma", portal: "training", priority: "medium", status: "open", agent: "Unassigned", createdAt: "2024-09-21T07:15:00Z", sla: "12h" },
  { id: "TKT-2024-8818", subject: "Partner onboarding stuck", requester: "Meera Joshi", portal: "partner", priority: "high", status: "waiting", agent: "Onboarding Team", createdAt: "2024-09-20T17:00:00Z", sla: "8h" },
  { id: "TKT-2024-8817", subject: "Resume builder crash", requester: "Priya Nair", portal: "candidate", priority: "low", status: "resolved", agent: "Support L1", createdAt: "2024-09-20T11:30:00Z", sla: "24h" },
  { id: "TKT-2024-8816", subject: "GST invoice incorrect", requester: "Vikram Singh", portal: "employer", priority: "medium", status: "in_progress", agent: "Billing Team", createdAt: "2024-09-20T09:00:00Z", sla: "12h" },
  { id: "TKT-2024-8815", subject: "WhatsApp integration broken", requester: "Karthik Iyer", portal: "training", priority: "urgent", status: "open", agent: "Unassigned", createdAt: "2024-09-20T07:42:00Z", sla: "1h" },
];

export function SuperAdminTickets() {
  const [search, setSearch] = React.useState("");
  const [priority, setPriority] = React.useState("all");
  const [status, setStatus] = React.useState("all");

  const filtered = TICKETS.filter(t => {
    const s = search.toLowerCase();
    const m1 = !s || t.id.toLowerCase().includes(s) || t.subject.toLowerCase().includes(s) || t.requester.toLowerCase().includes(s);
    const m2 = priority === "all" || t.priority === priority;
    const m3 = status === "all" || t.status === status;
    return m1 && m2 && m3;
  });

  const priBadge = (p: string) => {
    const cls = p === "urgent" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : p === "high" ? "bg-orange-500/15 text-orange-700 border-orange-500/30"
      : p === "medium" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-slate-500/15 text-slate-700 border-slate-500/30";
    return <Badge variant="outline" className={cls}>{p}</Badge>;
  };

  const statusBadge = (s: string) => {
    const cls = s === "resolved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "in_progress" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : s === "waiting" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s.replace("_", " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        description="Cross-portal support ticket queue with SLA, priority, and agent assignment."
        icon={<Icon name="Ticket" className="h-6 w-6" />}
        actions={[{ label: "Export Queue", variant: "outline", onClick: () => toast.success("Queue exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Open" value={TICKETS.filter(t => t.status === "open").length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="In Progress" value={TICKETS.filter(t => t.status === "in_progress").length} icon={<Icon name="Activity" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Urgent" value={TICKETS.filter(t => t.priority === "urgent").length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Resolved (30d)" value="412" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Ticket Queue" description={`${filtered.length} of ${TICKETS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ticket, subject, requester…" className="h-9 max-w-xs" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.subject}</TableCell>
                  <TableCell className="text-xs">{t.requester}</TableCell>
                  <TableCell><Badge variant="outline">{t.portal}</Badge></TableCell>
                  <TableCell>{priBadge(t.priority)}</TableCell>
                  <TableCell className="text-xs">{t.agent}</TableCell>
                  <TableCell className="text-xs">{t.sla}</TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Opening ${t.id}`)}>Open</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
