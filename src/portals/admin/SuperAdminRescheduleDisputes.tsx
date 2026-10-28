"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

interface Dispute {
  id: string;
  candidate: string;
  employer: string;
  role: string;
  originalDate: string;
  requestedDate: string;
  reason: string;
  requestedBy: "Candidate" | "Employer" | "Interviewer";
  status: "Open" | "In Review" | "Resolved" | "Escalated";
  openedAt: string;
  slaHours: number;
  elapsedHours: number;
}

const DISPUTES: Dispute[] = [
  { id: "rd_001", candidate: "Priya Nair", employer: "TechCorp India", role: "Sr React Dev", originalDate: "2024-09-21T10:00:00Z", requestedDate: "2024-09-23T10:00:00Z", reason: "Personal emergency", requestedBy: "Candidate", status: "Open", openedAt: "2024-09-20T08:00:00Z", slaHours: 24, elapsedHours: 6 },
  { id: "rd_002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", role: "Lead DevOps", originalDate: "2024-09-22T14:00:00Z", requestedDate: "2024-09-25T14:00:00Z", reason: "Interviewer unavailable", requestedBy: "Employer", status: "In Review", openedAt: "2024-09-19T11:00:00Z", slaHours: 24, elapsedHours: 18 },
  { id: "rd_003", candidate: "Meera Joshi", employer: "DataInsight Labs", role: "ML Engineer", originalDate: "2024-09-20T11:00:00Z", requestedDate: "2024-09-22T11:00:00Z", reason: "Conflicting offer interview", requestedBy: "Candidate", status: "Escalated", openedAt: "2024-09-18T09:00:00Z", slaHours: 24, elapsedHours: 36 },
  { id: "rd_004", candidate: "Vikram Shah", employer: "EduFirst", role: "HR Manager", originalDate: "2024-09-19T12:00:00Z", requestedDate: "2024-09-21T12:00:00Z", reason: "Travel delay", requestedBy: "Candidate", status: "Resolved", openedAt: "2024-09-17T10:00:00Z", slaHours: 24, elapsedHours: 12 },
  { id: "rd_005", candidate: "Deepa Menon", employer: "TechCorp India", role: "Cloud Architect", originalDate: "2024-09-18T15:00:00Z", requestedDate: "2024-09-20T15:00:00Z", reason: "Internet outage", requestedBy: "Candidate", status: "Resolved", openedAt: "2024-09-16T12:00:00Z", slaHours: 24, elapsedHours: 8 },
];

const STATUS_TONE: Record<string, string> = {
  Open: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "In Review": "bg-blue-500/15 text-blue-700 border-blue-500/30",
  Resolved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Escalated: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export function SuperAdminRescheduleDisputes() {
  const open = DISPUTES.filter(d => d.status === "Open" || d.status === "In Review").length;
  const escalated = DISPUTES.filter(d => d.status === "Escalated").length;
  const breaches = DISPUTES.filter(d => d.elapsedHours > d.slaHours && d.status !== "Resolved").length;
  const resolved = DISPUTES.filter(d => d.status === "Resolved").length;

  const resolve = (id: string) => {
    toast.success(`Dispute ${id} resolved — both parties notified`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reschedule Disputes"
        description="Interview reschedule dispute resolution — SLA tracking, escalation queue, and resolution workflow."
        icon={<Icon name="CalendarClock" className="h-6 w-6" />}
        actions={[{ label: "Export Queue", variant: "outline", onClick: () => toast.success("Dispute queue exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Open Disputes" value={open} icon={<Icon name="CalendarClock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Escalated" value={escalated} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="SLA Breaches" value={breaches} icon={<Icon name="Clock" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Resolved (30d)" value={resolved} delta={{ value: "+18%", positive: true }} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Escalation Queue" description="Disputes requiring immediate attention" className="border-rose-500/30">
        {DISPUTES.filter(d => d.status === "Escalated" || d.elapsedHours > d.slaHours).length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No escalations — all within SLA" />
        ) : (
          <ul className="space-y-2">
            {DISPUTES.filter(d => d.status === "Escalated" || d.elapsedHours > d.slaHours).map(d => (
              <li key={d.id} className="flex flex-col gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name="AlertTriangle" className="h-4 w-4 text-rose-600" />
                    <span className="font-medium">{d.candidate}</span>
                    <span className="text-xs text-muted-foreground">vs {d.employer}</span>
                    <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px]">{d.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">SLA breached: {d.elapsedHours}h elapsed vs {d.slaHours}h SLA · {timeAgo(d.openedAt)}</p>
                </div>
                <Button size="sm" variant="outline" className="border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 h-8" onClick={() => resolve(d.id)}><Icon name="Check" className="mr-1 h-3.5 w-3.5" /> Resolve Now</Button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="All Disputes" description="Reschedule dispute queue" contentClassName="p-0">
        {DISPUTES.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="CalendarClock" className="h-5 w-5" />} title="No disputes in queue" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Employer / Role</TableHead>
                <TableHead>Original</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>By</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DISPUTES.map(d => {
                const slaBreach = d.elapsedHours > d.slaHours && d.status !== "Resolved";
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.candidate}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{d.employer}</div>
                      <div className="text-[10px] text-muted-foreground">{d.role}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(d.originalDate)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(d.requestedDate)}</TableCell>
                    <TableCell className="text-xs max-w-32 truncate" title={d.reason}>{d.reason}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{d.requestedBy}</Badge></TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${slaBreach ? "text-rose-700" : "text-emerald-700"}`}>
                        {d.elapsedHours}h / {d.slaHours}h
                      </span>
                    </TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[d.status]}`}>{d.status}</span></TableCell>
                    <TableCell>
                      {d.status !== "Resolved" && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => resolve(d.id)}>Resolve</Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
