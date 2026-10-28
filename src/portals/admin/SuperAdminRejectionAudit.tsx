"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Rejection {
  id: string;
  candidate: string;
  employer: string;
  role: string;
  channel: "Email" | "SMS" | "WhatsApp";
  template: string;
  sentAt: string;
  opened: boolean;
  responded: boolean;
  stage: string;
}

const REJECTIONS: Rejection[] = [
  { id: "rj_001", candidate: "Priya Nair", employer: "TechCorp India", role: "Sr React Dev", channel: "Email", template: "Standard Rejection v2", sentAt: "2024-09-21T10:00:00Z", opened: true, responded: false, stage: "Resume Screen" },
  { id: "rj_002", candidate: "Arjun Kumar", employer: "CloudPeak Systems", role: "Lead DevOps", channel: "Email", template: "Post-Interview Rejection", sentAt: "2024-09-20T14:30:00Z", opened: true, responded: true, stage: "Interview" },
  { id: "rj_003", candidate: "Meera Joshi", employer: "DataInsight Labs", role: "ML Engineer", channel: "SMS", template: "SMS Quick Reject", sentAt: "2024-09-19T11:00:00Z", opened: false, responded: false, stage: "Resume Screen" },
  { id: "rj_004", candidate: "Karan Patel", employer: "Retail Boost", role: "Sales Executive", channel: "WhatsApp", template: "WA Polite Reject", sentAt: "2024-09-18T09:00:00Z", opened: true, responded: false, stage: "Phone Screen" },
  { id: "rj_005", candidate: "Anita Singh", employer: "NaukriX", role: "Python Backend", channel: "Email", template: "Standard Rejection v2", sentAt: "2024-09-17T16:00:00Z", opened: true, responded: false, stage: "Offer" },
  { id: "rj_006", candidate: "Vikram Shah", employer: "EduFirst", role: "HR Manager", channel: "Email", template: "Post-Interview Rejection", sentAt: "2024-09-15T12:00:00Z", opened: true, responded: true, stage: "Interview" },
];

const DEI_FLAGS = [
  { type: "Gender Skew", detail: "78% of post-interview rejections are female candidates (industry avg: 52%)", severity: "Critical", action: "Review interviewer panel bias" },
  { type: "Age Pattern", detail: "Rejection rate for 45+ candidates is 2.4x higher than 25-35 cohort", severity: "High", action: "Review screening rubrics" },
  { type: "Location Bias", detail: "Tier-2/3 city candidates rejected 1.6x more often than metro", severity: "Medium", action: "Audit remote-role eligibility" },
];

const SEVERITY_TONE: Record<string, string> = {
  Critical: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  High: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  Medium: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

export function SuperAdminRejectionAudit() {
  const total = REJECTIONS.length;
  const opened = REJECTIONS.filter(r => r.opened).length;
  const responded = REJECTIONS.filter(r => r.responded).length;
  const openRate = (opened / total) * 100;
  const responseRate = (responded / total) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rejection Audit"
        description="Every rejection communication sent across the platform — open rates, response rates, and DEI bias detection."
        icon={<Icon name="MailX" className="h-6 w-6" />}
        actions={[{ label: "DEI Report", variant: "outline", onClick: () => toast.success("DEI compliance report exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Rejections (30d)" value="18,420" delta={{ value: "+5.2%", positive: false }} icon={<Icon name="MailX" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Open Rate" value={`${openRate.toFixed(1)}%`} icon={<Icon name="MailOpen" className="h-5 w-5" />} tone="success" />
        <StatCard label="Response Rate" value={`${responseRate.toFixed(1)}%`} icon={<Icon name="MessageSquare" className="h-5 w-5" />} />
        <StatCard label="DEI Flags" value={DEI_FLAGS.length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="DEI Compliance Flagging" description="Demographic patterns detected in rejection communications" className="border-rose-500/30">
        {DEI_FLAGS.length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No DEI concerns detected" description="Rejection patterns align with platform-wide demographics." />
        ) : (
          <ul className="space-y-2">
            {DEI_FLAGS.map(f => (
              <li key={f.type} className="flex flex-col gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name="AlertTriangle" className="h-4 w-4 text-rose-600" />
                    <span className="font-medium">{f.type}</span>
                    <Badge variant="outline" className={SEVERITY_TONE[f.severity]}>{f.severity}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
                  <p className="mt-1 text-xs text-emerald-700">Recommended: {f.action}</p>
                </div>
                <Button size="sm" variant="outline" className="h-8" onClick={() => toast.success("Investigation queue opened")}>Investigate</Button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Channel & Template Performance" description="Open and response rates by rejection channel">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {(["Email", "SMS", "WhatsApp"] as const).map(ch => {
            const items = REJECTIONS.filter(r => r.channel === ch);
            const open = items.filter(r => r.opened).length;
            const resp = items.filter(r => r.responded).length;
            return (
              <div key={ch} className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{ch}</Badge>
                  <span className="text-xs text-muted-foreground">{items.length} sent</span>
                </div>
                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Open rate</span><span className="font-medium text-emerald-700">{items.length ? ((open / items.length) * 100).toFixed(0) : 0}%</span></div>
                  <Progress className="h-1.5" value={items.length ? (open / items.length) * 100 : 0} />
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Response rate</span><span className="font-medium text-amber-700">{items.length ? ((resp / items.length) * 100).toFixed(0) : 0}%</span></div>
                  <Progress className="h-1.5" value={items.length ? (resp / items.length) * 100 : 0} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Rejection Log" description="All rejections sent across platform" contentClassName="p-0">
        {REJECTIONS.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="MailX" className="h-5 w-5" />} title="No rejections logged" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Employer / Role</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Responded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REJECTIONS.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.candidate}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{r.employer}</div>
                    <div className="text-[10px] text-muted-foreground">{r.role}</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{r.stage}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{r.channel}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.template}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(r.sentAt)}</TableCell>
                  <TableCell>{r.opened ? <Icon name="Check" className="h-4 w-4 text-emerald-600" /> : <Icon name="X" className="h-4 w-4 text-slate-400" />}</TableCell>
                  <TableCell>{r.responded ? <Icon name="Check" className="h-4 w-4 text-emerald-600" /> : <Icon name="X" className="h-4 w-4 text-slate-400" />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
