"use client";

import * as React from "react";
import {
  Plus, Calendar, Video, Phone, MapPin, Code, Users, Clock, ChevronLeft, ChevronRight,
  RefreshCw, Ban, MessageSquare, Star, CheckCircle2, XCircle,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatDateTime, formatDate, timeAgo } from "@/lib/format";
import { interviewEvents } from "@/lib/partner-data";
import type { InterviewEvent } from "@/lib/partner-data";

const TYPE_ICON: Record<string, React.ReactNode> = {
  phone: <Phone className="h-3 w-3" />,
  video: <Video className="h-3 w-3" />,
  onsite: <MapPin className="h-3 w-3" />,
  technical: <Code className="h-3 w-3" />,
  hr: <Users className="h-3 w-3" />,
  panel: <Users className="h-3 w-3" />,
};

const FEEDBACK_SAMPLE: Record<string, { strengths: string[]; concerns: string[]; summary: string; rating: number }> = {
  iv_003: {
    strengths: ["Exceptional product sense", "Deep ML expertise", "Leadership potential"],
    concerns: [],
    summary: "Best candidate this year. Immediate offer recommended.",
    rating: 5,
  },
  iv_005: {
    strengths: ["Basic security knowledge"],
    concerns: ["Lacks hands-on SIEM experience", "Weak on incident response"],
    summary: "Does not meet the technical bar for this role. Recommend reject.",
    rating: 2,
  },
  iv_007: {
    strengths: ["Good cultural fit", "Strong communication"],
    concerns: ["Salary expectation at upper range"],
    summary: "Good candidate, recommend moving to offer.",
    rating: 4,
  },
};

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function RecruiterInterviewPipeline() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [rangeFilter, setRangeFilter] = React.useState("all");
  const [view, setView] = React.useState<"table" | "calendar">("table");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<InterviewEvent | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const [cancelTarget, setCancelTarget] = React.useState<InterviewEvent | null>(null);
  const [weekStart, setWeekStart] = React.useState<Date>(startOfWeek(new Date()));

  const filtered = interviewEvents.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (rangeFilter !== "all") {
      const d = new Date(e.scheduledAt);
      const now = new Date();
      const diff = (d.getTime() - now.getTime()) / 86400000;
      if (rangeFilter === "past" && diff > 0) return false;
      if (rangeFilter === "today" && Math.abs(diff) > 1) return false;
      if (rangeFilter === "week" && (diff < 0 || diff > 7)) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!e.candidateName.toLowerCase().includes(q) && !e.clientName.toLowerCase().includes(q) && !e.jobTitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const scheduled = interviewEvents.filter((e) => e.status === "scheduled").length;
  const completed = interviewEvents.filter((e) => e.status === "completed").length;
  const pendingFeedback = interviewEvents.filter((e) => e.status === "completed" && !e.feedbackSubmitted).length;
  const cleared = interviewEvents.filter((e) => e.outcome === "cleared").length;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview pipeline"
        description="Track every interview across clients, rounds, and outcomes. Schedule, reschedule, and capture feedback in one place."
        actions={[{ label: "Schedule interview", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Scheduled" value={scheduled} icon={<Calendar className="h-5 w-5" />} tone="brand" hint="Upcoming" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending feedback" value={pendingFeedback} icon={<MessageSquare className="h-5 w-5" />} tone="warning" />
        <StatCard label="Cleared" value={cleared} icon={<Star className="h-5 w-5" />} tone="default" hint="Move to next stage" />
      </div>

      <SectionCard
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search candidate, client, role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
                <SelectItem value="no_show">No show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="panel">Panel</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rangeFilter} onValueChange={setRangeFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="When" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any time</SelectItem>
                <SelectItem value="past">Past</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex items-center rounded-md border p-0.5">
              <Button size="sm" variant={view === "table" ? "default" : "ghost"} className="h-7" onClick={() => setView("table")}>List</Button>
              <Button size="sm" variant={view === "calendar" ? "default" : "ghost"} className="h-7" onClick={() => setView("calendar")}>Week</Button>
            </div>
          </div>
        }
      >
        {view === "table" ? (
          filtered.length === 0 ? (
            <EmptyState icon={<Calendar className="h-5 w-5" />} title="No interviews match" description="Adjust filters or schedule a new interview." />
          ) : (
            <div className="max-h-[600px] overflow-y-auto scroll-thin">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead className="hidden md:table-cell">Client / Role</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead className="hidden lg:table-cell">Interviewer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => (
                    <TableRow key={e.id} className="cursor-pointer" onClick={() => setDetail(e)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={e.candidateName} size="xs" />
                          <div>
                            <p className="text-sm font-medium">{e.candidateName}</p>
                            <p className="text-[10px] text-muted-foreground md:hidden">{e.clientName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm">{e.clientName}</p>
                        <p className="text-xs text-muted-foreground">{e.jobTitle}</p>
                      </TableCell>
                      <TableCell className="text-xs">{e.round}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs gap-1">
                          {TYPE_ICON[e.type]} {e.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <p>{formatDateTime(e.scheduledAt)}</p>
                        <p className="text-muted-foreground">{e.durationMinutes} min</p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{e.interviewer}</TableCell>
                      <TableCell><StatusBadge status={e.status} /></TableCell>
                      <TableCell className="hidden md:table-cell">
                        {e.status === "completed" ? (
                          e.feedbackSubmitted ? (
                            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400">Submitted</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 dark:text-amber-400">Pending</Badge>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setWeekStart(new Date(weekStart.getTime() - 7 * 86400000))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {formatDate(weekDays[0].toISOString())} – {formatDate(weekDays[6].toISOString())}
                </span>
                <Button variant="outline" size="sm" onClick={() => setWeekStart(new Date(weekStart.getTime() + 7 * 86400000))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>This week</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
              {weekDays.map((d) => {
                const dayEvents = interviewEvents.filter((e) => {
                  const ed = new Date(e.scheduledAt);
                  return ed.getDate() === d.getDate() && ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
                });
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <div key={d.toISOString()} className={`rounded-lg border min-h-[160px] p-2 ${isToday ? "border-brand bg-brand/5" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium capitalize">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
                      <span className={`text-xs ${isToday ? "bg-brand text-white rounded-full h-5 w-5 flex items-center justify-center" : "text-muted-foreground"}`}>
                        {d.getDate()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => setDetail(e)}
                          className="w-full text-left rounded border bg-card p-1.5 hover:border-brand hover:shadow-sm transition-all"
                        >
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(e.scheduledAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <p className="text-[11px] font-medium truncate">{e.candidateName}</p>
                          <p className="text-[9px] text-muted-foreground truncate">{e.round}</p>
                        </button>
                      ))}
                      {dayEvents.length === 0 && <p className="text-[10px] text-muted-foreground/50 text-center pt-2">—</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SectionCard>

      <ScheduleInterviewDialog open={addOpen} onOpenChange={setAddOpen} />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && (
            <InterviewDetail
              interview={detail}
              onClose={() => setDetail(null)}
              onReschedule={() => { setRescheduleOpen(true); }}
              onCancel={() => setCancelTarget(detail)}
            />
          )}
        </SheetContent>
      </Sheet>

      <RescheduleDialog open={rescheduleOpen} onOpenChange={setRescheduleOpen} interview={detail} />

      <AlertDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this interview?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelTarget && (
                <>
                  This will cancel the <strong>{cancelTarget.round}</strong> interview for{" "}
                  <strong>{cancelTarget.candidateName}</strong> with {cancelTarget.clientName}. The candidate will be notified.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep interview</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => {
                toast.success(`Interview cancelled — ${cancelTarget?.candidateName}`);
                setCancelTarget(null);
                setDetail(null);
              }}
            >
              <Ban className="h-4 w-4 mr-1" /> Cancel interview
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ScheduleInterviewDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [candidate, setCandidate] = React.useState("");
  const [client, setClient] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [round, setRound] = React.useState("");
  const [type, setType] = React.useState("video");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("10:00");
  const [duration, setDuration] = React.useState("60");
  const [interviewer, setInterviewer] = React.useState("");

  const submit = () => {
    if (!candidate || !client || !date) {
      toast.error("Candidate, client, and date are required");
      return;
    }
    toast.success(`Interview scheduled — ${candidate} on ${date} at ${time}`);
    onOpenChange(false);
    setCandidate(""); setClient(""); setJobTitle(""); setRound(""); setDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule interview</DialogTitle>
          <DialogDescription>Set up a new interview round. Conflict detection runs automatically.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Candidate</Label>
            <Input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="e.g. Priya Nair" />
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. TechCorp India" />
          </div>
          <div className="space-y-2">
            <Label>Job title</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior Full-Stack Engineer" />
          </div>
          <div className="space-y-2">
            <Label>Round</Label>
            <Input value={round} onChange={(e) => setRound(e.target.value)} placeholder="Technical Round 1" />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="panel">Panel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Interviewer</Label>
            <Input value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder="e.g. Rohan Mehta" />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
                <SelectItem value="90">90 min</SelectItem>
                <SelectItem value="120">120 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Schedule interview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RescheduleDialog({
  open, onOpenChange, interview,
}: { open: boolean; onOpenChange: (v: boolean) => void; interview: InterviewEvent | null }) {
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("10:00");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule interview</DialogTitle>
          <DialogDescription>
            {interview && <>Current: {formatDateTime(interview.scheduledAt)}</>}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>New date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>New time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            toast.success(`Interview rescheduled to ${date} ${time}`);
            onOpenChange(false);
          }}>Confirm reschedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InterviewDetail({
  interview, onClose, onReschedule, onCancel,
}: {
  interview: InterviewEvent;
  onClose: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}) {
  const feedback = interview.feedbackSubmitted ? FEEDBACK_SAMPLE[interview.id] : null;
  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={interview.candidateName} size="md" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg">{interview.candidateName}</SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2 text-xs">
              <span>{interview.clientName}</span>
              <span>•</span>
              <span>{interview.jobTitle}</span>
            </SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <StatusBadge status={interview.status} />
          <Badge variant="outline" className="text-xs gap-1">{TYPE_ICON[interview.type]} {interview.type}</Badge>
          {interview.outcome && <StatusBadge status={interview.outcome === "cleared" ? "active" : "rejected"} />}
        </div>
      </SheetHeader>

      <div className="space-y-4 mt-5">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Scheduled</p>
            <p className="font-medium text-xs">{formatDateTime(interview.scheduledAt)}</p>
            <p className="text-[10px] text-muted-foreground">{interview.durationMinutes} minutes</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Round</p>
            <p className="font-medium">{interview.round}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Interviewer</p>
            <p className="font-medium">{interview.interviewer}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Booked</p>
            <p className="font-medium text-xs">{timeAgo(interview.scheduledAt)}</p>
          </div>
        </div>

        {interview.status === "completed" && feedback ? (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Feedback summary</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Rating:</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < feedback.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <div className="rounded-lg border p-3 space-y-2">
              <div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Strengths</p>
                <ul className="text-xs space-y-0.5 mt-1">
                  {feedback.strengths.map((s, i) => <li key={i} className="flex items-start gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" /> {s}</li>)}
                </ul>
              </div>
              {feedback.concerns.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-rose-600 dark:text-rose-400">Concerns</p>
                  <ul className="text-xs space-y-0.5 mt-1">
                    {feedback.concerns.map((s, i) => <li key={i} className="flex items-start gap-1"><XCircle className="h-3 w-3 text-rose-500 mt-0.5 shrink-0" /> {s}</li>)}
                  </ul>
                </div>
              )}
              <p className="text-xs italic border-t pt-2">"{feedback.summary}"</p>
            </div>
          </div>
        ) : interview.status === "completed" && !interview.feedbackSubmitted ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
            <p className="font-medium text-amber-700 dark:text-amber-400">Feedback pending</p>
            <p className="text-muted-foreground mt-1">Reminder sent to {interview.interviewer} to submit feedback.</p>
            <Button size="sm" variant="outline" className="mt-2 h-7" onClick={() => toast.success("Reminder sent")}>Send reminder</Button>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {interview.status === "scheduled" && (
            <>
              <Button size="sm" variant="outline" onClick={onReschedule}><RefreshCw className="h-3.5 w-3.5" /> Reschedule</Button>
              <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700" onClick={onCancel}><Ban className="h-3.5 w-3.5" /> Cancel</Button>
            </>
          )}
          {interview.status === "completed" && !interview.feedbackSubmitted && (
            <Button size="sm" onClick={() => toast.success("Feedback form opened")}><MessageSquare className="h-3.5 w-3.5" /> Add feedback</Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
}
