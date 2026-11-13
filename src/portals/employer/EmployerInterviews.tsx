"use client";

import * as React from "react";
import { interviews, jobs, employerJobsExtra, allApplications } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatusBadge, Card, CardContent, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { formatDateTime, formatDate } from "@/lib/format";
import { Plus, Calendar, Clock, Video, MapPin, MoreHorizontal, Users, Star, CheckCircle2 } from "lucide-react";
import type { Interview } from "@/lib/types";

const EMPLOYER_JOBS = [...jobs, ...employerJobsExtra].filter((j) => j.employerId === "e_001");
const EMPLOYER_APPS = allApplications.filter((a) => EMPLOYER_JOBS.some((j) => j.id === a.jobId));

const INTERVIEWERS = ["Rohan Mehta", "Anika Verma", "Sneha Reddy", "Vikram Joshi"];

export function EmployerInterviews() {
  const [list, setList] = React.useState<Interview[]>(interviews);
  const [tab, setTab] = React.useState<"upcoming" | "completed" | "all">("upcoming");
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [feedbackTarget, setFeedbackTarget] = React.useState<Interview | null>(null);

  const [form, setForm] = React.useState({
    candidate: "",
    jobId: "",
    round: "Technical Round 1",
    type: "video",
    date: "",
    time: "14:00",
    duration: "60",
    timezone: "Asia/Kolkata",
    interviewers: [] as string[],
  });
  const [scorecard, setScorecard] = React.useState({
    criteria: [
      { name: "Technical depth", rating: 4, note: "" },
      { name: "Problem solving", rating: 4, note: "" },
      { name: "Communication", rating: 4, note: "" },
      { name: "Culture fit", rating: 4, note: "" },
    ],
    overallRating: 4,
    recommendation: "hire" as "strong_hire" | "hire" | "no_hire" | "strong_no_hire",
    summary: "",
  });

  const filtered = React.useMemo(() => {
    if (tab === "upcoming") return list.filter((i) => i.status === "scheduled" && new Date(i.scheduledAt).getTime() >= Date.now() - 3600000);
    if (tab === "completed") return list.filter((i) => i.status === "completed");
    return list;
  }, [list, tab]);

  const schedule = () => {
    if (!form.candidate || !form.jobId || !form.date) { toast.error("Fill all required fields"); return; }
    const job = EMPLOYER_JOBS.find((j) => j.id === form.jobId);
    const iv: Interview = {
      id: `iv_${Date.now()}`,
      applicationId: "a_new",
      jobId: form.jobId,
      jobTitle: job?.title ?? "",
      candidateName: form.candidate,
      employerName: "TechCorp India",
      round: form.round,
      type: form.type as Interview["type"],
      scheduledAt: new Date(`${form.date}T${form.time}:00`).toISOString(),
      durationMinutes: Number(form.duration),
      timezone: form.timezone,
      interviewerIds: [],
      interviewers: form.interviewers,
      meetingLink: `https://meet.jobson.id/iv-${Date.now()}`,
      status: "scheduled",
      feedbackSubmitted: false,
    };
    setList([iv, ...list]);
    setScheduleOpen(false);
    setForm({ candidate: "", jobId: "", round: "Technical Round 1", type: "video", date: "", time: "14:00", duration: "60", timezone: "Asia/Kolkata", interviewers: [] });
    toast.success("Interview scheduled", { description: `${iv.candidateName} on ${formatDate(iv.scheduledAt)}` });
  };

  const toggleInterviewer = (name: string) => {
    setForm((f) => ({
      ...f,
      interviewers: f.interviewers.includes(name) ? f.interviewers.filter((x) => x !== name) : [...f.interviewers, name],
    }));
  };

  const submitFeedback = () => {
    if (!feedbackTarget) return;
    setList((prev) => prev.map((i) => i.id === feedbackTarget.id ? { ...i, feedbackSubmitted: true, scorecard } : i));
    toast.success("Scorecard submitted");
    setFeedbackTarget(null);
  };

  const cancelInterview = (id: string) => {
    setList((prev) => prev.map((i) => i.id === id ? { ...i, status: "cancelled" } : i));
    toast.warning("Interview cancelled");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interviews"
        description="Schedule, conduct, and capture feedback for candidate interviews"
        actions={[{ label: "Schedule interview", icon: "Plus", onClick: () => setScheduleOpen(true) }]}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "upcoming" | "completed" | "all")}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({list.filter((i) => i.status === "scheduled" && new Date(i.scheduledAt).getTime() >= Date.now() - 3600000).length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({list.filter((i) => i.status === "completed").length})</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState icon={<Calendar className="h-5 w-5" />} title="No interviews" description="Schedule your first interview to get started." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((iv) => (
                <Card key={iv.id} className="flex flex-col">
                  <CardContent className="p-4 space-y-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={iv.candidateName} size="sm" />
                        <div>
                          <p className="text-sm font-medium">{iv.candidateName}</p>
                          <p className="text-xs text-muted-foreground">{iv.round}</p>
                        </div>
                      </div>
                      <StatusBadge status={iv.status} />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{iv.jobTitle}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDateTime(iv.scheduledAt)}</p>
                      <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {iv.durationMinutes} min · {iv.type}</p>
                      <p className="flex items-center gap-1"><Users className="h-3 w-3" /> {iv.interviewers.join(", ") || "—"}</p>
                      {iv.meetingLink && <p className="flex items-center gap-1"><Video className="h-3 w-3" /> <a href={iv.meetingLink} target="_blank" rel="noreferrer" className="text-brand hover:underline truncate">Join meeting</a></p>}
                      {iv.location && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {iv.location}</p>}
                    </div>
                    {iv.status === "completed" && iv.feedbackSubmitted && (
                      <div className="rounded-md bg-emerald-500/10 p-2 text-xs">
                        <p className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Feedback submitted
                        </p>
                        <p className="text-muted-foreground mt-0.5">Recommendation: <span className="capitalize">{iv.scorecard?.recommendation.replace("_", " ")}</span></p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-auto pt-1">
                      {iv.status === "completed" && !iv.feedbackSubmitted && (
                        <Button size="sm" className="flex-1" onClick={() => setFeedbackTarget(iv)}>
                          <Star className="mr-1 h-3 w-3" /> Add feedback
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info("Reschedule flow initiated")}>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => cancelInterview(iv.id)} className="text-rose-600">Cancel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Schedule dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule interview</DialogTitle>
            <DialogDescription>Set up an interview round with a candidate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto scroll-thin pr-1">
            <div className="space-y-1.5">
              <Label>Candidate *</Label>
              <Select value={form.candidate} onValueChange={(v) => setForm({ ...form, candidate: v })}>
                <SelectTrigger><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  {EMPLOYER_APPS.map((a) => <SelectItem key={a.id} value={a.candidateName}>{a.candidateName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Job *</Label>
              <Select value={form.jobId} onValueChange={(v) => setForm({ ...form, jobId: v })}>
                <SelectTrigger><SelectValue placeholder="Select job" /></SelectTrigger>
                <SelectContent>
                  {EMPLOYER_JOBS.map((j) => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Round</Label>
                <Input value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["phone", "video", "onsite", "technical", "hr", "panel"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Time</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Duration (min)</Label>
                <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Interviewers</Label>
              <div className="flex flex-wrap gap-1.5">
                {INTERVIEWERS.map((n) => (
                  <button
                    key={n}
                    onClick={() => toggleInterviewer(n)}
                    className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${form.interviewers.includes(n) ? "border-brand bg-brand/10 text-brand" : "border-border text-muted-foreground hover:bg-muted"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={schedule}><Calendar className="mr-2 h-4 w-4" /> Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback / scorecard dialog */}
      <Dialog open={!!feedbackTarget} onOpenChange={(o) => !o && setFeedbackTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Interview scorecard</DialogTitle>
            <DialogDescription>{feedbackTarget?.candidateName} · {feedbackTarget?.round}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto scroll-thin pr-1">
            {scorecard.criteria.map((c, i) => (
              <div key={i} className="rounded-md border p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{c.name}</Label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setScorecard((sc) => ({ ...sc, criteria: sc.criteria.map((x, idx) => idx === i ? { ...x, rating: s } : x) }))}>
                        <Star className={`h-4 w-4 ${s <= c.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Input placeholder="Note (optional)" value={c.note} onChange={(e) => setScorecard((sc) => ({ ...sc, criteria: sc.criteria.map((x, idx) => idx === i ? { ...x, note: e.target.value } : x) }))} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Overall rating</Label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setScorecard((sc) => ({ ...sc, overallRating: s }))}>
                    <Star className={`h-6 w-6 ${s <= scorecard.overallRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Recommendation</Label>
              <Select value={scorecard.recommendation} onValueChange={(v) => setScorecard((sc) => ({ ...sc, recommendation: v as typeof scorecard.recommendation }))}>
                <SelectTrigger className="capitalize"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["strong_hire", "hire", "no_hire", "strong_no_hire"].map((r) => <SelectItem key={r} value={r} className="capitalize">{r.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Summary</Label>
              <Textarea rows={3} placeholder="Overall impression…" value={scorecard.summary} onChange={(e) => setScorecard((sc) => ({ ...sc, summary: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackTarget(null)}>Cancel</Button>
            <Button onClick={submitFeedback}><CheckCircle2 className="mr-2 h-4 w-4" /> Submit scorecard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
