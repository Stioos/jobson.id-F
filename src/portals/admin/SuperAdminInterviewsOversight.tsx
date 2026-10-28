"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

type Outcome = "Pending" | "Strong Hire" | "Hire" | "No Hire" | "Strong No Hire" | "No-Show" | "Rescheduled";

interface InterviewRow {
  id: string;
  candidate: string;
  employer: string;
  role: string;
  date: string;
  portal: string;
  interviewer: string;
  outcome: Outcome;
}

const INTERVIEWS: InterviewRow[] = [
  { id: "iv_001", candidate: "Priya Nair", employer: "TechCorp India", role: "Senior React Developer", date: "2024-09-21T10:00:00Z", portal: "Employer", interviewer: "Anika Verma", outcome: "Strong Hire" },
  { id: "iv_002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", role: "Lead DevOps Engineer", date: "2024-09-21T14:30:00Z", portal: "Recruiter", interviewer: "Vivek Rao", outcome: "Hire" },
  { id: "iv_003", candidate: "Meera Joshi", employer: "DataInsight Labs", role: "ML Engineer", date: "2024-09-20T11:00:00Z", portal: "Employer", interviewer: "Rajesh Iyer", outcome: "No Hire" },
  { id: "iv_004", candidate: "Karan Patel", employer: "Retail Boost", role: "Sales Executive", date: "2024-09-20T09:00:00Z", portal: "Employer", interviewer: "Sunita Reddy", outcome: "No-Show" },
  { id: "iv_005", candidate: "Anita Singh", employer: "NaukriX", role: "Python Backend", date: "2024-09-19T16:00:00Z", portal: "Recruiter", interviewer: "Imran Khan", outcome: "Pending" },
  { id: "iv_006", candidate: "Vikram Shah", employer: "EduFirst", role: "HR Manager", date: "2024-09-19T12:00:00Z", portal: "Partner", interviewer: "Latha Raman", outcome: "Strong Hire" },
  { id: "iv_007", candidate: "Deepa Menon", employer: "TechCorp India", role: "Cloud Architect", date: "2024-09-18T15:00:00Z", portal: "Employer", interviewer: "Anika Verma", outcome: "Rescheduled" },
  { id: "iv_008", candidate: "Rahul Gupta", employer: "DataInsight Labs", role: "Data Analyst", date: "2024-09-18T11:00:00Z", portal: "Recruiter", interviewer: "Rajesh Iyer", outcome: "Strong No Hire" },
];

const OUTCOME_TONE: Record<Outcome, string> = {
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "Strong Hire": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Hire: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  "No Hire": "bg-slate-500/15 text-slate-600 border-slate-500/30",
  "Strong No Hire": "bg-rose-500/15 text-rose-700 border-rose-500/30",
  "No-Show": "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Rescheduled: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

export function SuperAdminInterviewsOversight() {
  const [portal, setPortal] = React.useState("All");
  const [outcome, setOutcome] = React.useState("All");
  const [range, setRange] = React.useState("7d");

  const filtered = INTERVIEWS.filter(i => {
    if (portal !== "All" && i.portal !== portal) return false;
    if (outcome !== "All" && i.outcome !== outcome) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interviews Oversight"
        description="All interviews conducted across the platform — outcomes, no-show tracking, and volume trends."
        icon={<Icon name="Video" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Interview log exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Interviews (7d)" value="1,842" delta={{ value: "+6.4%", positive: true }} icon={<Icon name="Video" className="h-5 w-5" />} tone="brand" />
        <StatCard label="No-Show Rate" value="4.8%" delta={{ value: "-1.2%", positive: true }} icon={<Icon name="CircleAlert" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Hire Rate" value="42.6%" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Rescheduled" value="212" icon={<Icon name="CalendarClock" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Interview Volume (14d)" description="Daily interview count across all portals">
        <div className="flex h-32 items-end gap-1.5">
          {[120, 132, 145, 138, 158, 162, 155, 148, 170, 178, 182, 175, 188, 192].map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end"><div className="w-full rounded-t bg-brand/60" style={{ height: `${(v / 192) * 100}%` }} /></div>
              <div className="text-[9px] text-muted-foreground">{i + 1}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Peak day: Day 14 (192 interviews). Avg: 160/day.</p>
      </SectionCard>

      <SectionCard
        title="All Interviews"
        description={`${filtered.length} interviews`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <select value={range} onChange={(e) => setRange(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
              <option value="24h">Last 24h</option><option value="7d">Last 7d</option><option value="30d">Last 30d</option>
            </select>
            <select value={portal} onChange={(e) => setPortal(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
              <option>All</option><option>Employer</option><option>Recruiter</option><option>Partner</option>
            </select>
            <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
              <option>All</option><option>Pending</option><option>Strong Hire</option><option>Hire</option><option>No Hire</option><option>Strong No Hire</option><option>No-Show</option><option>Rescheduled</option>
            </select>
          </div>
        }
        contentClassName="p-0"
      >
        {filtered.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Video" className="h-5 w-5" />} title="No interviews match your filters" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Interviewer</TableHead>
                <TableHead>Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(i => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.candidate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{i.employer}</TableCell>
                  <TableCell className="text-sm">{i.role}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(i.date)}</TableCell>
                  <TableCell><Badge variant="outline">{i.portal}</Badge></TableCell>
                  <TableCell className="text-sm">{i.interviewer}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${OUTCOME_TONE[i.outcome]}`}>{i.outcome}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
