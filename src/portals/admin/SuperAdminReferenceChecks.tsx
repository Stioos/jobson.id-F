"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface RefCheck {
  id: string;
  candidate: string;
  employer: string;
  refereeName: string;
  refereeEmail: string;
  relationship: string;
  requestedAt: string;
  respondedAt?: string;
  status: "Completed" | "Pending" | "Flagged" | "Declined";
  rating?: number;
  flag?: string;
}

const CHECKS: RefCheck[] = [
  { id: "ref_001", candidate: "Priya Nair", employer: "TechCorp India", refereeName: "Rohit Sharma", refereeEmail: "rohit@techcorp.com", relationship: "Manager", requestedAt: "2024-09-19", respondedAt: "2024-09-21", status: "Completed", rating: 4.5 },
  { id: "ref_002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", refereeName: "Meera Iyer", refereeEmail: "meera@cloudpeak.com", relationship: "Colleague", requestedAt: "2024-09-18", status: "Pending" },
  { id: "ref_003", candidate: "Meera Joshi", employer: "DataInsight Labs", refereeName: "Rohit Sharma", refereeEmail: "rohit@techcorp.com", relationship: "Manager", requestedAt: "2024-09-15", respondedAt: "2024-09-17", status: "Flagged", rating: 2.0, flag: "Same referee used for multiple candidates (fraud risk)" },
  { id: "ref_004", candidate: "Vikram Shah", employer: "EduFirst", refereeName: "Latha Raman", refereeEmail: "latha@edufirst.com", relationship: "Reporting Manager", requestedAt: "2024-09-10", respondedAt: "2024-09-12", status: "Completed", rating: 4.0 },
  { id: "ref_005", candidate: "Deepa Menon", employer: "TechCorp India", refereeName: "Anand K", refereeEmail: "anand@techcorp.com", relationship: "Peer", requestedAt: "2024-09-08", respondedAt: "2024-09-09", status: "Declined" },
  { id: "ref_006", candidate: "Rahul Gupta", employer: "DesignPro", refereeName: "Sneha P", refereeEmail: "sneha@designpro.com", relationship: "Manager", requestedAt: "2024-09-05", respondedAt: "2024-09-07", status: "Completed", rating: 4.8 },
  { id: "ref_007", candidate: "Anita Singh", employer: "NaukriX", refereeName: "Rohit Sharma", refereeEmail: "rohit@techcorp.com", relationship: "Manager", requestedAt: "2024-09-03", respondedAt: "2024-09-04", status: "Flagged", flag: "Same referee used for multiple candidates (fraud risk)" },
];

const STATUS_TONE: Record<string, string> = {
  Completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Flagged: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Declined: "bg-slate-500/15 text-slate-500 border-slate-500/30",
};

const FRAUD_REFEREES = [
  { name: "Rohit Sharma", email: "rohit@techcorp.com", usedFor: 3, candidates: ["Priya Nair", "Meera Joshi", "Anita Singh"] },
  { name: "Anjali Verma", email: "anjali@xyz.com", usedFor: 2, candidates: ["Karan Patel", "Ravi S"] },
];

export function SuperAdminReferenceChecks() {
  const completed = CHECKS.filter(c => c.status === "Completed").length;
  const completionRate = (completed / CHECKS.length) * 100;
  const avgResponseHrs = CHECKS.filter(c => c.respondedAt).reduce((s, c) => s + 36, 0) / CHECKS.filter(c => c.respondedAt).length;
  const flaggedCount = CHECKS.filter(c => c.status === "Flagged").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reference Checks"
        description="All reference checks across the platform — completion rates, response times, and fraud detection."
        icon={<Icon name="UserCheck" className="h-6 w-6" />}
        actions={[{ label: "Fraud Report", variant: "outline", onClick: () => toast.success("Fraud detection report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Checks (30d)" value="2,184" delta={{ value: "+7.1%", positive: true }} icon={<Icon name="UserCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Completion Rate" value={`${completionRate.toFixed(1)}%`} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Response" value={`${avgResponseHrs.toFixed(0)} hrs`} icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Flagged" value={flaggedCount} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Reference Fraud Detection" description="Referees used across multiple candidates (suspicious pattern)" className="border-rose-500/30">
        {FRAUD_REFEREES.length === 0 ? (
          <EmptyState icon={<Icon name="ShieldCheck" className="h-5 w-5" />} title="No fraud patterns detected" />
        ) : (
          <ul className="space-y-2">
            {FRAUD_REFEREES.map(r => (
              <li key={r.email} className="flex flex-col gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name="AlertTriangle" className="h-4 w-4 text-rose-600" />
                    <span className="font-medium">{r.name}</span>
                    <span className="text-xs text-muted-foreground">{r.email}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <span className="text-xs">Used for {r.usedFor} candidates:</span>
                    {r.candidates.map(c => <Badge key={c} variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-500/30 text-[10px]">{c}</Badge>)}
                  </div>
                </div>
                <Badge variant="outline" className="bg-rose-500/15 text-rose-700 border-rose-500/30">Investigate</Badge>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Reference Check Requests" description="All checks across platform" contentClassName="p-0">
        {CHECKS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="UserCheck" className="h-5 w-5" />} title="No reference checks yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Referee</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Responded</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CHECKS.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.candidate}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{c.refereeName}</div>
                    <div className="text-[10px] text-muted-foreground">{c.refereeEmail}</div>
                  </TableCell>
                  <TableCell className="text-xs">{c.relationship}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(c.requestedAt)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.respondedAt ? formatDate(c.respondedAt) : "—"}</TableCell>
                  <TableCell>{c.rating ? <span className="font-medium text-amber-600">{c.rating.toFixed(1)} ★</span> : "—"}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONE[c.status]}`}>{c.status}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
