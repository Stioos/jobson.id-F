"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDateTime } from "@/lib/format";

type Decision = "strong_hire" | "hire" | "no_hire" | "strong_no_hire";

interface InterviewerScore {
  name: string;
  role: string;
  scores: { competency: string; score: number }[];
  decision: Decision;
  notes: string;
}

interface Debrief {
  id: string;
  candidate: string;
  role: string;
  interviewDate: string;
  interviewers: string[];
  debriefAt: string;
  status: "scheduled" | "completed" | "cancelled";
  decision?: Decision;
  summary?: string;
  scores?: InterviewerScore[];
}

const DECISION_META: Record<Decision, { label: string; cls: string; icon: string }> = {
  strong_hire: { label: "Strong Hire", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", icon: "TrendingUp" },
  hire: { label: "Hire", cls: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20", icon: "CheckCircle" },
  no_hire: { label: "No Hire", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", icon: "CircleAlert" },
  strong_no_hire: { label: "Strong No Hire", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", icon: "TrendingDown" },
};

const COMPETENCIES = ["Technical", "Communication", "Culture Fit", "Problem Solving", "Leadership"];

const DEBRIEFS: Debrief[] = [
  {
    id: "d1", candidate: "Priya Nair", role: "Senior Frontend Engineer", interviewDate: "2024-10-12T10:00:00Z",
    interviewers: ["Arjun M. (Hiring Mgr)", "Sara K. (Engineer)", "Rohit P. (Engineer)"], debriefAt: "2024-10-13T15:00:00Z", status: "completed",
    decision: "hire",
    summary: "Priya showed strong frontend fundamentals, particularly in performance optimization and design systems. Communication was clear. Some gaps in advanced React 18 patterns but quick learner. Team felt she'd be a culture add.",
    scores: [
      { name: "Arjun M.", role: "Hiring Manager", scores: [{ competency: "Technical", score: 4 }, { competency: "Communication", score: 4 }, { competency: "Culture Fit", score: 5 }, { competency: "Problem Solving", score: 4 }, { competency: "Leadership", score: 3 }], decision: "hire", notes: "Solid all-round. Would want her to lead the design system work." },
      { name: "Sara K.", role: "Engineer", scores: [{ competency: "Technical", score: 3 }, { competency: "Communication", score: 4 }, { competency: "Culture Fit", score: 4 }, { competency: "Problem Solving", score: 4 }, { competency: "Leadership", score: 3 }], decision: "hire", notes: "Pair coding went well. Asked good clarifying questions." },
      { name: "Rohit P.", role: "Engineer", scores: [{ competency: "Technical", score: 4 }, { competency: "Communication", score: 4 }, { competency: "Culture Fit", score: 4 }, { competency: "Problem Solving", score: 5 }, { competency: "Leadership", score: 3 }], decision: "strong_hire", notes: "System design round was excellent. Dug into trade-offs." },
    ],
  },
  {
    id: "d2", candidate: "Rahul Sharma", role: "Backend Engineer (Go)", interviewDate: "2024-10-15T14:00:00Z",
    interviewers: ["Karthik V. (Hiring Mgr)", "Anu R. (Engineer)", "Meera D. (Engineer)"], debriefAt: "2024-10-16T11:00:00Z", status: "completed",
    decision: "no_hire",
    summary: "Rahul's coding was solid but system design responses lacked depth on scaling. Struggled with follow-up questions on consistency models. Team voted 2 no-hires and 1 hire.",
    scores: [
      { name: "Karthik V.", role: "Hiring Manager", scores: [{ competency: "Technical", score: 3 }, { competency: "Communication", score: 4 }, { competency: "Culture Fit", score: 3 }, { competency: "Problem Solving", score: 3 }, { competency: "Leadership", score: 3 }], decision: "no_hire", notes: "Need someone stronger on distributed systems for this role." },
      { name: "Anu R.", role: "Engineer", scores: [{ competency: "Technical", score: 2 }, { competency: "Communication", score: 4 }, { competency: "Culture Fit", score: 4 }, { competency: "Problem Solving", score: 2 }, { competency: "Leadership", score: 3 }], decision: "no_hire", notes: "Could not articulate CAP trade-offs. Code was clean though." },
      { name: "Meera D.", role: "Engineer", scores: [{ competency: "Technical", score: 4 }, { competency: "Communication", score: 3 }, { competency: "Culture Fit", score: 4 }, { competency: "Problem Solving", score: 3 }, { competency: "Leadership", score: 3 }], decision: "hire", notes: "Coding round was strong. Would be a fit for a more junior role." },
    ],
  },
  {
    id: "d3", candidate: "Sneha Reddy", role: "Data Scientist", interviewDate: "2024-10-18T11:00:00Z",
    interviewers: ["Rohit S. (Hiring Mgr)", "Vikram T. (Sr DS)"], debriefAt: "2024-10-19T16:00:00Z", status: "completed",
    decision: "strong_hire",
    summary: "Sneha's ML system design was exceptional — discussed feature stores, monitoring, drift detection. Strong publication record. Excellent culture fit. Unanimous strong hire.",
    scores: [
      { name: "Rohit S.", role: "Hiring Manager", scores: [{ competency: "Technical", score: 5 }, { competency: "Communication", score: 5 }, { competency: "Culture Fit", score: 5 }, { competency: "Problem Solving", score: 5 }, { competency: "Leadership", score: 4 }], decision: "strong_hire", notes: "Top 5% of candidates I've interviewed this year." },
      { name: "Vikram T.", role: "Sr DS", scores: [{ competency: "Technical", score: 5 }, { competency: "Communication", score: 4 }, { competency: "Culture Fit", score: 5 }, { competency: "Problem Solving", score: 5 }, { competency: "Leadership", score: 4 }], decision: "strong_hire", notes: "Asked the best questions I've seen from a candidate." },
    ],
  },
  {
    id: "d4", candidate: "Vikram Patel", role: "DevOps Engineer (SRE)", interviewDate: "2024-10-22T13:00:00Z",
    interviewers: ["Karthik V. (Hiring Mgr)", "Anu R. (Engineer)"], debriefAt: "2024-10-23T10:00:00Z", status: "scheduled",
  },
  {
    id: "d5", candidate: "Meera Iyer", role: "UX Designer — Mobile", interviewDate: "2024-10-25T15:00:00Z",
    interviewers: ["Sara K. (Design Lead)", "Rohit P. (PM)"], debriefAt: "2024-10-26T14:00:00Z", status: "scheduled",
  },
  {
    id: "d6", candidate: "Karthik Nair", role: "Product Manager — Growth", interviewDate: "2024-10-28T11:00:00Z",
    interviewers: ["Vikram S. (VP Product)", "Meera D. (PM)", "Rohit S. (Eng Mgr)"], debriefAt: "2024-10-29T16:00:00Z", status: "scheduled",
  },
];

const CANDIDATES = ["Anita Verma", "Bharat Gupta", "Charu Singh", "Dinesh Kumar"];
const INTERVIEWERS_POOL = ["Arjun M. (Hiring Mgr)", "Sara K. (Engineer)", "Rohit P. (Engineer)", "Karthik V. (Hiring Mgr)", "Anu R. (Engineer)", "Meera D. (Engineer)", "Vikram S. (VP Product)"];

export function EmployerDebriefs() {
  const [tab, setTab] = React.useState<"upcoming" | "past">("upcoming");
  const [viewTarget, setViewTarget] = React.useState<Debrief | null>(null);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [form, setForm] = React.useState({ candidate: "", interviewers: [] as string[], date: "", time: "15:00" });

  const upcoming = DEBRIEFS.filter((d) => d.status === "scheduled");
  const past = DEBRIEFS.filter((d) => d.status === "completed");

  const totalDecided = past.length;
  const hires = past.filter((d) => d.decision === "hire" || d.decision === "strong_hire").length;
  const noHires = past.filter((d) => d.decision === "no_hire" || d.decision === "strong_no_hire").length;
  const hireRate = totalDecided > 0 ? Math.round((hires / totalDecided) * 100) : 0;

  const toggleInterviewer = (name: string) => {
    setForm((prev) => ({
      ...prev,
      interviewers: prev.interviewers.includes(name) ? prev.interviewers.filter((x) => x !== name) : [...prev.interviewers, name],
    }));
  };

  const schedule = () => {
    if (!form.candidate || form.interviewers.length === 0 || !form.date) { toast.error("Fill all required fields"); return; }
    toast.success("Debrief scheduled", { description: `${form.candidate} debrief on ${form.date} at ${form.time}.` });
    setScheduleOpen(false);
    setForm({ candidate: "", interviewers: [], date: "", time: "15:00" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Debrief Scheduler"
        description="Schedule interview debriefs, consolidate feedback across interviewers and visualize hiring decisions."
        icon={<Icon name="Users2" className="h-6 w-6" />}
        actions={[{ label: "Schedule debrief", onClick: () => setScheduleOpen(true) }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming debriefs" value={upcoming.length} hint="Awaiting interview date" icon={<Icon name="Calendar" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Completed" value={past.length} hint="This quarter" icon={<Icon name="CheckCircle2" className="h-4 w-4" />} tone="success" />
        <StatCard label="Hires" value={`${hires}/${totalDecided}`} hint={`${hireRate}% hire rate`} icon={<Icon name="TrendingUp" className="h-4 w-4" />} tone="success" />
        <StatCard label="No-hires" value={noHires} hint="This quarter" icon={<Icon name="CircleAlert" className="h-4 w-4" />} tone="danger" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {tab === "upcoming" && (
            upcoming.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No upcoming debriefs.</CardContent></Card>
            ) : (
              upcoming.map((d) => (
                <Card key={d.id} className="hover:border-brand/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <AvatarLogo text={d.candidate} size="md" />
                        <div>
                          <p className="text-sm font-semibold">{d.candidate}</p>
                          <p className="text-xs text-muted-foreground">{d.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-right">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                          <Icon name="Clock" className="mr-1 h-3 w-3" /> Scheduled
                        </Badge>
                        <p className="text-xs text-muted-foreground">Debrief: {formatDateTime(d.debriefAt)}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Interview date</p>
                        <p>{formatDateTime(d.interviewDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Interviewers ({d.interviewers.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {d.interviewers.map((i) => <Badge key={i} variant="outline" className="text-[10px]">{i}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )}

          {tab === "past" && (
            past.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No past debriefs.</CardContent></Card>
            ) : (
              past.map((d) => {
                const meta = d.decision ? DECISION_META[d.decision] : null;
                const avgByComp = COMPETENCIES.map((c) => {
                  const scores = (d.scores ?? []).map((s) => s.scores.find((x) => x.competency === c)?.score ?? 0).filter((x) => x > 0);
                  const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                  return { competency: c, avg: Math.round(avg * 10) / 10 };
                });
                return (
                  <Card key={d.id} className="hover:border-brand/30 transition-colors cursor-pointer" onClick={() => setViewTarget(d)}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <AvatarLogo text={d.candidate} size="md" />
                          <div>
                            <p className="text-sm font-semibold">{d.candidate}</p>
                            <p className="text-xs text-muted-foreground">{d.role} · {formatDateTime(d.interviewDate)}</p>
                          </div>
                        </div>
                        {meta && (
                          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${meta.cls}`}>
                            <Icon name={meta.icon} className="h-3 w-3" /> {meta.label}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{d.summary}</p>
                      {/* Decision matrix */}
                      {d.scores && d.scores.length > 0 && (
                        <div className="mt-3 grid gap-2 sm:grid-cols-5">
                          {avgByComp.map((c) => (
                            <div key={c.competency} className="rounded-md border p-2 text-center">
                              <p className="text-[10px] text-muted-foreground">{c.competency}</p>
                              <p className={`text-sm font-bold ${c.avg >= 4 ? "text-emerald-600 dark:text-emerald-400" : c.avg >= 3 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>{c.avg.toFixed(1)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon name="Users2" className="h-3 w-3" />
                        {d.interviewers.length} interviewers · Click to view detail
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )
          )}
        </TabsContent>
      </Tabs>

      {/* Detail dialog */}
      <Dialog open={!!viewTarget} onOpenChange={(o) => !o && setViewTarget(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto scroll-thin">
          {viewTarget && (
            <>
              <DialogHeader>
                <DialogTitle>{viewTarget.candidate} — Debrief</DialogTitle>
                <DialogDescription>{viewTarget.role} · Interviewed {formatDateTime(viewTarget.interviewDate)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {viewTarget.summary && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Consolidated summary</h4>
                    <p className="text-sm text-muted-foreground rounded-lg bg-muted/40 p-3">{viewTarget.summary}</p>
                  </div>
                )}
                {/* Decision matrix */}
                {viewTarget.scores && viewTarget.scores.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Interviewer votes & scores</h4>
                    <div className="space-y-2">
                      {viewTarget.scores.map((s) => {
                        const meta = DECISION_META[s.decision];
                        const avg = s.scores.reduce((a, b) => a + b.score, 0) / s.scores.length;
                        return (
                          <div key={s.name} className="rounded-lg border p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AvatarLogo text={s.name} size="sm" />
                                <div>
                                  <p className="text-sm font-medium">{s.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{s.role}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-brand">{avg.toFixed(1)}/5</span>
                                <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${meta.cls}`}>
                                  <Icon name={meta.icon} className="h-3 w-3" /> {meta.label}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-5 gap-1">
                              {s.scores.map((sc) => (
                                <div key={sc.competency} className="text-center">
                                  <p className="text-[10px] text-muted-foreground">{sc.competency.split(" ")[0]}</p>
                                  <p className={`text-xs font-bold ${sc.score >= 4 ? "text-emerald-600 dark:text-emerald-400" : sc.score >= 3 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>{sc.score}</p>
                                  <Progress value={sc.score * 20} className="h-1 mt-0.5" />
                                </div>
                              ))}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">{s.notes}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewTarget(null)}>Close</Button>
                <Button onClick={() => toast.success("Exported", { description: "Debrief report PDF downloaded." })}>
                  <Icon name="Download" className="mr-2 h-4 w-4" /> Export report
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule debrief</DialogTitle>
            <DialogDescription>Pick a candidate and interviewers for the debrief meeting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Candidate *</Label>
              <Select value={form.candidate} onValueChange={(v) => setForm({ ...form, candidate: v })}>
                <SelectTrigger><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>{CANDIDATES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Interviewers * ({form.interviewers.length} selected)</Label>
              <div className="flex flex-wrap gap-1.5 rounded-lg border p-2 max-h-32 overflow-y-auto scroll-thin">
                {INTERVIEWERS_POOL.map((i) => (
                  <button key={i} type="button" onClick={() => toggleInterviewer(i)}
                    className={`rounded-md px-2 py-0.5 text-xs font-medium border transition-colors ${
                      form.interviewers.includes(i) ? "bg-brand text-white border-brand" : "bg-background text-muted-foreground border-border hover:border-brand/40"
                    }`}>{i}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Debrief date *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Time</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Agenda notes (optional)</Label>
              <Textarea rows={2} placeholder="Discussion points…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={schedule}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
