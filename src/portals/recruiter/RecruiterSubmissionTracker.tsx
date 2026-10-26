"use client";

import * as React from "react";
import {
  Send, Eye, ListFilter, CalendarClock, Trophy, CheckCircle2, ChevronDown, ChevronRight,
  TrendingUp,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, daysUntil } from "@/lib/format";

type Stage = "Sent" | "Viewed" | "Shortlisted" | "Interviewing" | "Offered" | "Rejected" | "Placed";

interface TimelineEvt { stage: Stage; date: string; note?: string }
interface Submission {
  id: string;
  candidate: string;
  client: string;
  jobTitle: string;
  submittedDate: string;
  responseDate?: string;
  stage: Stage;
  daysInStage: number;
  timeline: TimelineEvt[];
}

const MOCK: Submission[] = [
  { id: "s1", candidate: "Arjun Iyer", client: "TechCorp India", jobTitle: "Senior Frontend Engineer", submittedDate: "2024-10-01", responseDate: "2024-10-03", stage: "Interviewing", daysInStage: 4, timeline: [{ stage: "Sent", date: "2024-10-01" }, { stage: "Viewed", date: "2024-10-03" }, { stage: "Shortlisted", date: "2024-10-06" }, { stage: "Interviewing", date: "2024-10-10" }] },
  { id: "s2", candidate: "Kavya Reddy", client: "DataMinds AI", jobTitle: "Full Stack Developer", submittedDate: "2024-10-04", responseDate: "2024-10-05", stage: "Shortlisted", daysInStage: 2, timeline: [{ stage: "Sent", date: "2024-10-04" }, { stage: "Viewed", date: "2024-10-05" }, { stage: "Shortlisted", date: "2024-10-08" }] },
  { id: "s3", candidate: "Rohan Mehta", client: "FinEdge Solutions", jobTitle: "DevOps Engineer", submittedDate: "2024-09-20", responseDate: "2024-09-22", stage: "Offered", daysInStage: 9, timeline: [{ stage: "Sent", date: "2024-09-20" }, { stage: "Viewed", date: "2024-09-22" }, { stage: "Shortlisted", date: "2024-09-26" }, { stage: "Interviewing", date: "2024-09-30" }, { stage: "Offered", date: "2024-10-02" }] },
  { id: "s4", candidate: "Sneha Kapoor", client: "StartupX", jobTitle: "Backend Engineer", submittedDate: "2024-09-12", stage: "Rejected", daysInStage: 1, timeline: [{ stage: "Sent", date: "2024-09-12" }, { stage: "Viewed", date: "2024-09-14" }, { stage: "Rejected", date: "2024-09-15", note: "Role paused" }] },
  { id: "s5", candidate: "Vikram Nair", client: "DataMinds AI", jobTitle: "ML Engineer", submittedDate: "2024-10-08", stage: "Viewed", daysInStage: 6, timeline: [{ stage: "Sent", date: "2024-10-08" }, { stage: "Viewed", date: "2024-10-09" }] },
  { id: "s6", candidate: "Priya Nair", client: "TechCorp India", jobTitle: "Frontend Engineer", submittedDate: "2024-10-11", stage: "Sent", daysInStage: 1, timeline: [{ stage: "Sent", date: "2024-10-11" }] },
  { id: "s7", candidate: "Aditya Sharma", client: "SecureBank", jobTitle: "Cloud Architect", submittedDate: "2024-09-28", responseDate: "2024-09-30", stage: "Placed", daysInStage: 12, timeline: [{ stage: "Sent", date: "2024-09-28" }, { stage: "Viewed", date: "2024-09-30" }, { stage: "Shortlisted", date: "2024-10-03" }, { stage: "Interviewing", date: "2024-10-07" }, { stage: "Offered", date: "2024-10-10" }, { stage: "Placed", date: "2024-10-12" }] },
  { id: "s8", candidate: "Neha Patel", client: "TechCorp India", jobTitle: "Data Engineer", submittedDate: "2024-09-18", responseDate: "2024-09-19", stage: "Interviewing", daysInStage: 8, timeline: [{ stage: "Sent", date: "2024-09-18" }, { stage: "Viewed", date: "2024-09-19" }, { stage: "Shortlisted", date: "2024-09-22" }, { stage: "Interviewing", date: "2024-09-29" }] },
  { id: "s9", candidate: "Karthik Subramanian", client: "FinEdge Solutions", jobTitle: "QA Lead", submittedDate: "2024-10-06", stage: "Viewed", daysInStage: 10, timeline: [{ stage: "Sent", date: "2024-10-06" }, { stage: "Viewed", date: "2024-10-07" }] },
  { id: "s10", candidate: "Ananya Bose", client: "StartupX", jobTitle: "Product Designer", submittedDate: "2024-10-09", responseDate: "2024-10-10", stage: "Shortlisted", daysInStage: 3, timeline: [{ stage: "Sent", date: "2024-10-09" }, { stage: "Viewed", date: "2024-10-10" }, { stage: "Shortlisted", date: "2024-10-12" }] },
];

const FUNNEL: { stage: Stage; icon: React.ReactNode }[] = [
  { stage: "Sent", icon: <Send className="h-3.5 w-3.5" /> },
  { stage: "Viewed", icon: <Eye className="h-3.5 w-3.5" /> },
  { stage: "Shortlisted", icon: <ListFilter className="h-3.5 w-3.5" /> },
  { stage: "Interviewing", icon: <CalendarClock className="h-3.5 w-3.5" /> },
  { stage: "Offered", icon: <Trophy className="h-3.5 w-3.5" /> },
  { stage: "Placed", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
];

const STAGE_TONE: Record<Stage, string> = {
  Sent: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  Viewed: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20",
  Shortlisted: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
  Interviewing: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  Offered: "bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/20",
  Placed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  Rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

export function RecruiterSubmissionTracker() {
  const [items, setItems] = React.useState<Submission[]>(MOCK);
  const [clientFilter, setClientFilter] = React.useState("all");
  const [stageFilter, setStageFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = items.filter((s) => {
    if (clientFilter !== "all" && s.client !== clientFilter) return false;
    if (stageFilter !== "all" && s.stage !== stageFilter) return false;
    if (dateFilter !== "all") {
      const days = daysUntil(s.submittedDate);
      // daysUntil returns future-positive; invert for "days ago"
      const ago = -days;
      if (dateFilter === "7d" && ago > 7) return false;
      if (dateFilter === "30d" && ago > 30) return false;
    }
    return true;
  });

  // Conversion funnel
  const funnelCounts = FUNNEL.map((f) => ({
    ...f,
    count: items.filter((s) => s.timeline.some((t) => t.stage === f.stage)).length,
  }));

  function advance(id: string) {
    const order: Stage[] = ["Sent", "Viewed", "Shortlisted", "Interviewing", "Offered", "Placed"];
    setItems((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      const idx = order.indexOf(s.stage);
      if (idx < 0 || idx >= order.length - 1) return s;
      const next = order[idx + 1];
      return { ...s, stage: next, daysInStage: 0, timeline: [...s.timeline, { stage: next, date: new Date().toISOString().slice(0, 10) }] };
    }));
    const s = items.find((x) => x.id === id);
    toast.success("Submission advanced", { description: `${s?.candidate} → next stage` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submission Status Tracker"
        description="Real-time view of every candidate submitted to clients. Track stage movement, response times, and conversion funnel."
        icon={<Send className="h-6 w-6" />}
        actions={[
          { label: "Export CSV", variant: "outline", onClick: () => toast.success("Export started", { description: "submissions.csv" }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Active submissions" value={items.filter((s) => s.stage !== "Rejected" && s.stage !== "Placed").length} icon={<Send className="h-5 w-5" />} tone="brand" />
        <StatCard label="Placed" value={items.filter((s) => s.stage === "Placed").length} icon={<Trophy className="h-5 w-5" />} tone="success" />
        <StatCard label="Stuck > 7d" value={items.filter((s) => s.daysInStage > 7 && s.stage !== "Placed" && s.stage !== "Rejected").length} icon={<CalendarClock className="h-5 w-5" />} tone="danger" />
        <StatCard label="Overall placement rate" value={`${Math.round((items.filter((s) => s.stage === "Placed").length / items.length) * 100)}%`} icon={<TrendingUp className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard
        title="Conversion funnel"
        description="Drop-off between stages across all submissions."
      >
        <div className="flex flex-wrap items-stretch gap-2 overflow-x-auto">
          {funnelCounts.map((f, i) => {
            const prev = i > 0 ? funnelCounts[i - 1].count : f.count;
            const rate = prev > 0 ? Math.round((f.count / prev) * 100) : 0;
            return (
              <div key={f.stage} className="flex flex-1 min-w-[140px] flex-col rounded-xl border bg-card p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand">{f.icon}</span>
                  {f.stage}
                </div>
                <p className="mt-2 text-2xl font-semibold">{f.count}</p>
                {i > 0 && (
                  <p className="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">▲ {rate}% from prev</p>
                )}
                {i === 0 && <p className="mt-1 text-[11px] text-muted-foreground">Top of funnel</p>}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Submissions"
        description="Click a row to view the full stage timeline."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Client" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {[...new Set(items.map((s) => s.client))].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {FUNNEL.map((f) => <SelectItem key={f.stage} value={f.stage}>{f.stage}</SelectItem>)}
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Date" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Send className="h-5 w-5" />} title="No submissions match" description="Adjust filters to see submissions." />
        ) : (
          <div className="max-h-[34rem] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Candidate</TableHead>
                  <TableHead>Client / role</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead className="hidden lg:table-cell">Client response</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-center">Days in stage</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => {
                  const isOpen = expanded === s.id;
                  const daysTone = s.daysInStage < 3 ? "text-emerald-600 dark:text-emerald-400" : s.daysInStage <= 7 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";
                  return (
                    <React.Fragment key={s.id}>
                      <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => setExpanded(isOpen ? null : s.id)}>
                        <TableCell className="text-muted-foreground">
                          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AvatarLogo text={s.candidate} size="sm" />
                            <p className="text-sm font-medium">{s.candidate}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{s.client}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{s.jobTitle}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(s.submittedDate)}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{s.responseDate ? formatDate(s.responseDate) : "—"}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STAGE_TONE[s.stage]}`}>{s.stage}</span>
                        </TableCell>
                        <TableCell className={`text-center text-sm font-semibold ${daysTone}`}>
                          {s.stage === "Placed" || s.stage === "Rejected" ? "—" : `${s.daysInStage}d`}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          {s.stage !== "Placed" && s.stage !== "Rejected" && (
                            <Button size="sm" variant="outline" onClick={() => advance(s.id)}>Advance</Button>
                          )}
                        </TableCell>
                      </TableRow>
                      {isOpen && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={8} className="py-3">
                            <div className="px-4">
                              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Stage timeline</p>
                              <div className="flex flex-wrap items-center gap-2">
                                {s.timeline.map((t, i) => (
                                  <React.Fragment key={i}>
                                    <div className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5">
                                      <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${STAGE_TONE[t.stage]}`}>{t.stage}</span>
                                      <span className="text-[11px] text-muted-foreground">{formatDate(t.date)}</span>
                                      {t.note && <span className="text-[11px] text-muted-foreground italic">— {t.note}</span>}
                                    </div>
                                    {i < s.timeline.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
