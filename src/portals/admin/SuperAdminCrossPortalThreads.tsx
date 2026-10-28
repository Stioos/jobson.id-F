"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type ThreadType =
  | "Candidate → Employer"
  | "Recruiter → Candidate"
  | "Recruiter → Employer"
  | "Partner → Employer"
  | "Training → Candidate"
  | "Training → Employer"
  | "Partner → Training";

type Health = "green" | "amber" | "red";

interface CrossThread {
  id: string;
  type: ThreadType;
  initiatedBy: string;
  initiatedDate: string;
  firstResponseTime: string;
  totalMessages: number;
  lastActivity: string;
  status: "Active" | "Stale" | "Closed";
  responseRate: number;
  qualityScore: number;
  health: Health;
  gap: string | null;
}

const THREADS: CrossThread[] = [
  { id: "CPT-201", type: "Candidate → Employer", initiatedBy: "Arjun Mehta", initiatedDate: "Jan 12", firstResponseTime: "3h 12m", totalMessages: 8, lastActivity: "12m ago", status: "Active", responseRate: 92, qualityScore: 88, health: "green", gap: null },
  { id: "CPT-202", type: "Recruiter → Candidate", initiatedBy: "Priya Nair", initiatedDate: "Jan 08", firstResponseTime: "1h 02m", totalMessages: 12, lastActivity: "1h ago", status: "Active", responseRate: 95, qualityScore: 92, health: "green", gap: null },
  { id: "CPT-203", type: "Recruiter → Employer", initiatedBy: "TeamLease HR", initiatedDate: "Jan 10", firstResponseTime: "5h 48m", totalMessages: 6, lastActivity: "3h ago", status: "Active", responseRate: 80, qualityScore: 76, health: "amber", gap: "Employer last replied 2 days ago" },
  { id: "CPT-204", type: "Partner → Employer", initiatedBy: "VIT Chennai", initiatedDate: "Jan 06", firstResponseTime: "8h 30m", totalMessages: 4, lastActivity: "5h ago", status: "Active", responseRate: 75, qualityScore: 70, health: "amber", gap: "Employer response time above 24h" },
  { id: "CPT-205", type: "Training → Candidate", initiatedBy: "Naukri CodeNation", initiatedDate: "Jan 04", firstResponseTime: "2h 18m", totalMessages: 7, lastActivity: "8h ago", status: "Active", responseRate: 88, qualityScore: 84, health: "green", gap: null },
  { id: "CPT-206", type: "Training → Employer", initiatedBy: "Coding Ninjas", initiatedDate: "Jan 09", firstResponseTime: "11h 04m", totalMessages: 5, lastActivity: "1d ago", status: "Active", responseRate: 60, qualityScore: 58, health: "amber", gap: "Wipro slow to confirm batch size" },
  { id: "CPT-207", type: "Partner → Training", initiatedBy: "IIIT Hyderabad", initiatedDate: "Jan 03", firstResponseTime: "4h 12m", totalMessages: 9, lastActivity: "1d ago", status: "Active", responseRate: 90, qualityScore: 86, health: "green", gap: null },
  { id: "CPT-208", type: "Candidate → Employer", initiatedBy: "Anjali Verma", initiatedDate: "Jan 05", firstResponseTime: "20h 14m", totalMessages: 4, lastActivity: "2d ago", status: "Stale", responseRate: 50, qualityScore: 42, health: "red", gap: "Candidate messaged employer 2 days ago, no response" },
  { id: "CPT-209", type: "Recruiter → Candidate", initiatedBy: "Randstad", initiatedDate: "Jan 11", firstResponseTime: "1h 45m", totalMessages: 3, lastActivity: "2d ago", status: "Active", responseRate: 100, qualityScore: 80, health: "green", gap: null },
  { id: "CPT-210", type: "Partner → Employer", initiatedBy: "Anna University", initiatedDate: "Jan 02", firstResponseTime: "—", totalMessages: 3, lastActivity: "5d ago", status: "Stale", responseRate: 33, qualityScore: 30, health: "red", gap: "Partner messaged employer 5 days ago, no response" },
  { id: "CPT-211", type: "Candidate → Employer", initiatedBy: "Devansh Gupta", initiatedDate: "Jan 13", firstResponseTime: "6h 20m", totalMessages: 2, lastActivity: "3d ago", status: "Active", responseRate: 100, qualityScore: 78, health: "green", gap: null },
  { id: "CPT-212", type: "Training → Candidate", initiatedBy: "Coursera", initiatedDate: "Dec 28", firstResponseTime: "30m", totalMessages: 5, lastActivity: "4d ago", status: "Closed", responseRate: 96, qualityScore: 90, health: "green", gap: null },
  { id: "CPT-213", type: "Recruiter → Candidate", initiatedBy: "Quess Corp", initiatedDate: "Dec 30", firstResponseTime: "14h 02m", totalMessages: 4, lastActivity: "6d ago", status: "Stale", responseRate: 40, qualityScore: 36, health: "red", gap: "Recruiter awaiting candidate response for 6 days" },
  { id: "CPT-214", type: "Partner → Training", initiatedBy: "BITS Pilani", initiatedDate: "Jan 07", firstResponseTime: "3h 40m", totalMessages: 6, lastActivity: "1d ago", status: "Active", responseRate: 85, qualityScore: 82, health: "green", gap: null },
  { id: "CPT-215", type: "Employer → Training", initiatedBy: "HCL Tech", initiatedDate: "Jan 09", firstResponseTime: "6h 50m", totalMessages: 5, lastActivity: "12h ago", status: "Active", responseRate: 78, qualityScore: 74, health: "amber", gap: "Training provider slow to share curriculum" },
];

const TYPE_TONE: Record<ThreadType, string> = {
  "Candidate → Employer": "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  "Recruiter → Candidate": "bg-amber-500/10 text-amber-700 border-amber-500/30",
  "Recruiter → Employer": "bg-teal-500/10 text-teal-700 border-teal-500/30",
  "Partner → Employer": "bg-rose-500/10 text-rose-700 border-rose-500/30",
  "Training → Candidate": "bg-violet-500/10 text-violet-700 border-violet-500/30",
  "Training → Employer": "bg-cyan-500/10 text-cyan-700 border-cyan-500/30",
  "Partner → Training": "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/30",
};

const HEALTH: Record<Health, { label: string; tone: string; dot: string }> = {
  green: { label: "Healthy 2-way", tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30", dot: "bg-emerald-500" },
  amber: { label: "One-sided", tone: "bg-amber-500/10 text-amber-700 border-amber-500/30", dot: "bg-amber-500" },
  red: { label: "No response", tone: "bg-rose-500/10 text-rose-700 border-rose-500/30", dot: "bg-rose-500" },
};

function parseAvg(s: string[]): number {
  // rough avg of "Xh Ym" → hours
  const hours = s.map(t => {
    const h = /(\d+)h/.exec(t);
    const m = /(\d+)m/.exec(t);
    const hh = h ? parseInt(h[1]) : 0;
    const mm = m ? parseInt(m[1]) : 0;
    return hh + mm / 60;
  }).filter(x => !isNaN(x) && x > 0);
  if (!hours.length) return 0;
  return hours.reduce((a, b) => a + b, 0) / hours.length;
}

export function SuperAdminCrossPortalThreads() {
  const total = THREADS.length;
  const types = new Set(THREADS.map(t => t.type)).size;
  const validTimes = THREADS.filter(t => t.firstResponseTime !== "—").map(t => t.firstResponseTime);
  const avgHours = parseAvg(validTimes);
  const avgResponseRate = Math.round(THREADS.reduce((s, t) => s + t.responseRate, 0) / THREADS.length);

  const byType = Array.from(new Set(THREADS.map(t => t.type))).map(type => {
    const list = THREADS.filter(t => t.type === type);
    const rr = Math.round(list.reduce((s, t) => s + t.responseRate, 0) / list.length);
    return { type, count: list.length, avgResponse: rr };
  }).sort((a, b) => b.count - a.count);

  const gaps = THREADS.filter(t => t.gap);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Portal Threads"
        description="Monitor every cross-portal message thread — track response times, response rates, quality scores, and detect communication gaps between portals."
        icon={<Icon name="MessagesSquare" className="h-6 w-6" />}
        actions={[
          { label: "Export threads", variant: "outline", onClick: () => toast.success("Cross-portal thread report exported") },
          { label: "Auto-nudge stale", variant: "default", onClick: () => toast.success(`${gaps.length} stale threads nudged`) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Cross-Portal Threads" value={total} icon={<Icon name="MessagesSquare" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Thread Types" value={types} icon={<Icon name="Split" className="h-5 w-5" />} />
        <StatCard label="Avg Response Time" value={avgHours > 0 ? `${avgHours.toFixed(1)}h` : "—"} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Response Rate" value={`${avgResponseRate}%`} icon={<Icon name="Repeat" className="h-5 w-5" />} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Thread Volume by Portal Pair" description="Most active communication channels" className="lg:col-span-2">
          <div className="space-y-2">
            {byType.map(b => (
              <div key={b.type} className="flex items-center gap-3">
                <div className="w-44 shrink-0">
                  <Badge variant="outline" className={`text-[10px] ${TYPE_TONE[b.type]}`}>{b.type}</Badge>
                </div>
                <div className="flex-1">
                  <div className="h-5 overflow-hidden rounded-md bg-muted">
                    <div className="flex h-full items-center justify-end bg-brand px-2 text-[10px] font-medium text-white" style={{ width: `${Math.min(100, b.count * 18)}%` }}>
                      {b.count} threads
                    </div>
                  </div>
                </div>
                <div className="w-16 text-right text-xs text-muted-foreground">resp {b.avgResponse}%</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Communication Gaps" description="Threads needing intervention">
          {gaps.length === 0 ? (
            <EmptyState icon={<Icon name="CheckCircle2" className="h-5 w-5" />} title="No gaps detected" />
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {gaps.map(g => (
                <div key={g.id} className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">{g.id}</span>
                    <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-700 border-rose-500/30">{g.type}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-rose-700">{g.gap}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="All Cross-Portal Threads" description="Health indicators — green = active 2-way, amber = one-sided, red = no response" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thread</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Initiated By</TableHead>
              <TableHead className="hidden md:table-cell">Initiated</TableHead>
              <TableHead className="hidden lg:table-cell">First Resp</TableHead>
              <TableHead className="text-center">Msgs</TableHead>
              <TableHead className="hidden md:table-cell">Last Activity</TableHead>
              <TableHead>Health</TableHead>
              <TableHead className="text-center">Quality</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {THREADS.map(t => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${HEALTH[t.health].dot}`} />
                    <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${TYPE_TONE[t.type]}`}>{t.type}</Badge>
                </TableCell>
                <TableCell className="text-xs font-medium">{t.initiatedBy}</TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{t.initiatedDate}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs">{t.firstResponseTime}</TableCell>
                <TableCell className="text-center text-xs font-medium">{t.totalMessages}</TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{t.lastActivity}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${HEALTH[t.health].tone}`}>{HEALTH[t.health].label}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`text-xs font-semibold ${t.qualityScore >= 75 ? "text-emerald-600" : t.qualityScore >= 50 ? "text-amber-600" : "text-rose-600"}`}>{t.qualityScore}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
