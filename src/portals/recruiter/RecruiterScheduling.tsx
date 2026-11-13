"use client";

import * as React from "react";
import {
  Plus, ChevronLeft, ChevronRight, Clock, Calendar, RefreshCw, Ban, Video,
  Phone, MapPin, Globe, AlertCircle, CheckCircle2, Link2,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { formatDateTime, formatDate, timeAgo } from "@/lib/format";
import { interviewEvents, openings, clientAccounts } from "@/lib/partner-data";

const TIMEZONES = ["Asia/Kolkata (IST)", "Asia/Dubai (GST)", "Asia/Singapore (SGT)", "Europe/London (GMT)", "US/Eastern (EST)", "US/Pacific (PST)"];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const TYPE_META: Record<string, { icon: React.ReactNode; tone: string }> = {
  phone: { icon: <Phone className="h-3 w-3" />, tone: "border-l-blue-400" },
  video: { icon: <Video className="h-3 w-3" />, tone: "border-l-emerald-400" },
  onsite: { icon: <MapPin className="h-3 w-3" />, tone: "border-l-amber-400" },
  technical: { icon: <Clock className="h-3 w-3" />, tone: "border-l-violet-400" },
  hr: { icon: <Calendar className="h-3 w-3" />, tone: "border-l-teal-400" },
  panel: { icon: <Calendar className="h-3 w-3" />, tone: "border-l-rose-400" },
};

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

interface ScheduleItem {
  id: string;
  candidateName: string;
  clientName: string;
  jobTitle: string;
  round: string;
  type: "phone" | "video" | "onsite" | "technical" | "hr" | "panel";
  dateISO: string;
  durationMinutes: number;
  interviewer: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled" | "no_show";
  meetingLink?: string;
}

// Build scheduled items from interviewEvents (only scheduled ones)
const initialItems: ScheduleItem[] = interviewEvents
  .filter((e) => e.status === "scheduled")
  .map((e) => ({
    id: e.id,
    candidateName: e.candidateName,
    clientName: e.clientName,
    jobTitle: e.jobTitle,
    round: e.round,
    type: e.type,
    dateISO: e.scheduledAt,
    durationMinutes: e.durationMinutes,
    interviewer: e.interviewer,
    status: e.status,
    meetingLink: e.type === "video" ? "https://meet.jobson.id/r/" + e.id : undefined,
  }));

export function RecruiterScheduling() {
  const [items, setItems] = React.useState<ScheduleItem[]>(initialItems);
  const [weekStart, setWeekStart] = React.useState<Date>(startOfWeek(new Date()));
  const [timezone, setTimezone] = React.useState(TIMEZONES[0]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [rescheduleTarget, setRescheduleTarget] = React.useState<ScheduleItem | null>(null);
  const [cancelTarget, setCancelTarget] = React.useState<ScheduleItem | null>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const todayStr = new Date().toDateString();
  const todayItems = items
    .filter((i) => new Date(i.dateISO).toDateString() === todayStr && i.status === "scheduled")
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());

  const upcomingThisWeek = items.filter((i) => {
    const d = new Date(i.dateISO);
    return i.status === "scheduled" && d >= weekStart && d < new Date(weekStart.getTime() + 7 * 86400000);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview scheduling"
        description="Calendar-first scheduling with conflict detection, timezone awareness, and quick reschedule / cancel actions."
        actions={[{ label: "Schedule new", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Today" value={todayItems.length} icon={<Calendar className="h-5 w-5" />} tone="brand" hint="Interviews today" />
        <StatCard label="This week" value={upcomingThisWeek.length} icon={<Clock className="h-5 w-5" />} tone="default" hint="Across all clients" />
        <StatCard label="Avg duration" value="60m" icon={<Clock className="h-5 w-5" />} tone="success" />
        <StatCard label="Timezone" value="IST" icon={<Globe className="h-5 w-5" />} tone="warning" hint="Asia/Kolkata" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <SectionCard
          title="Week view"
          description="Drag to reschedule coming soon. Click any block to see details."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-8 w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setWeekStart(new Date(weekStart.getTime() - 7 * 86400000))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium whitespace-nowrap">
                {formatDate(weekDays[0].toISOString())} – {formatDate(weekDays[6].toISOString())}
              </span>
              <Button variant="outline" size="sm" onClick={() => setWeekStart(new Date(weekStart.getTime() + 7 * 86400000))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</Button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header row */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b">
                <div className="p-2 text-[10px] text-muted-foreground uppercase">Time</div>
                {weekDays.map((d) => {
                  const isToday = d.toDateString() === todayStr;
                  return (
                    <div key={d.toISOString()} className={`p-2 text-center border-l ${isToday ? "bg-brand/5" : ""}`}>
                      <p className="text-[10px] text-muted-foreground uppercase">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
                      <p className={`text-sm font-medium ${isToday ? "bg-brand text-white rounded-full h-6 w-6 flex items-center justify-center mx-auto" : ""}`}>
                        {d.getDate()}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* Hour rows */}
              {HOURS.map((h) => (
                <div key={h} className="grid grid-cols-[60px_repeat(7,1fr)] border-b min-h-[64px]">
                  <div className="p-2 text-[10px] text-muted-foreground border-r">
                    {h > 12 ? h - 12 : h}{h >= 12 ? "PM" : "AM"}
                  </div>
                  {weekDays.map((d) => {
                    const dayItems = items.filter((it) => {
                      const id = new Date(it.dateISO);
                      return id.toDateString() === d.toDateString() && id.getHours() === h && it.status === "scheduled";
                    });
                    return (
                      <div key={d.toISOString() + h} className="border-l p-1 space-y-1 relative">
                        {dayItems.map((it) => (
                          <button
                            key={it.id}
                            onClick={() => setRescheduleTarget(it)}
                            className={`block w-full text-left rounded border-l-2 ${TYPE_META[it.type].tone} bg-card hover:shadow-sm transition-all p-1.5`}
                          >
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-medium truncate">{new Date(it.dateISO).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                              <span className="text-muted-foreground">{TYPE_META[it.type].icon}</span>
                            </div>
                            <p className="text-[11px] font-medium truncate">{it.candidateName}</p>
                            <p className="text-[9px] text-muted-foreground truncate">{it.clientName}</p>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Today's schedule"
          description={`${todayItems.length} interviews today`}
        >
          {todayItems.length === 0 ? (
            <EmptyState icon={<Calendar className="h-5 w-5" />} title="Nothing today" description="Enjoy the breather." />
          ) : (
            <ScrollArea className="max-h-[600px]">
              <div className="space-y-2">
                {todayItems.map((it) => (
                  <div key={it.id} className={`rounded-lg border-l-2 ${TYPE_META[it.type].tone} border-y border-r p-3`}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">{new Date(it.dateISO).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                      <Badge variant="outline" className="text-[10px] gap-1">{TYPE_META[it.type].icon} {it.type}</Badge>
                    </div>
                    <p className="text-sm font-medium mt-1">{it.candidateName}</p>
                    <p className="text-[11px] text-muted-foreground">{it.clientName} • {it.jobTitle}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{it.round} • {it.interviewer}</p>
                    {it.meetingLink && (
                      <Button size="sm" variant="outline" className="h-7 mt-2 w-full text-xs" onClick={() => toast.success("Meeting link copied to clipboard")}>
                        <Link2 className="h-3 w-3" /> Join meeting
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </SectionCard>
      </div>

      <ScheduleDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onScheduled={(item) => {
          setItems((prev) => [...prev, item]);
        }}
        existingItems={items}
      />

      <RescheduleDialog
        item={rescheduleTarget}
        onOpenChange={(v) => !v && setRescheduleTarget(null)}
        onConfirm={(date, time) => {
          if (rescheduleTarget) {
            setItems((prev) => prev.map((i) =>
              i.id === rescheduleTarget.id
                ? { ...i, dateISO: new Date(`${date}T${time}`).toISOString(), status: "rescheduled" }
                : i
            ));
            toast.success(`Rescheduled — ${rescheduleTarget.candidateName} → ${date} ${time}`);
          }
          setRescheduleTarget(null);
        }}
      />

      <AlertDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel interview?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelTarget && (
                <>This will cancel the <strong>{cancelTarget.round}</strong> for <strong>{cancelTarget.candidateName}</strong> on {formatDateTime(cancelTarget.dateISO)}. The candidate and interviewer will be notified.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep interview</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => {
                if (cancelTarget) {
                  setItems((prev) => prev.map((i) => i.id === cancelTarget.id ? { ...i, status: "cancelled" } : i));
                  toast.success(`Interview cancelled — ${cancelTarget.candidateName}`);
                }
                setCancelTarget(null);
              }}
            >
              <Ban className="h-4 w-4 mr-1" /> Cancel interview
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {rescheduleTarget && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs">
          <div className="rounded-lg border bg-card shadow-lg p-3 space-y-2">
            <p className="text-xs font-medium">{rescheduleTarget.candidateName}</p>
            <p className="text-[10px] text-muted-foreground">{rescheduleTarget.clientName} • {rescheduleTarget.round}</p>
            <p className="text-[10px] text-muted-foreground">{formatDateTime(rescheduleTarget.dateISO)}</p>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => { setCancelTarget(rescheduleTarget); setRescheduleTarget(null); }}>
                <Ban className="h-3 w-3" /> Cancel
              </Button>
              <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => { toast.success("Meeting link copied"); }}>
                <Link2 className="h-3 w-3" /> Link
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setRescheduleTarget(null)}>×</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleDialog({
  open, onOpenChange, onScheduled, existingItems,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onScheduled: (item: ScheduleItem) => void;
  existingItems: ScheduleItem[];
}) {
  const [candidate, setCandidate] = React.useState("");
  const [client, setClient] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [round, setRound] = React.useState("Technical Round 1");
  const [type, setType] = React.useState<ScheduleItem["type"]>("video");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("10:00");
  const [duration, setDuration] = React.useState("60");
  const [interviewer, setInterviewer] = React.useState("");
  const [meetingLink, setMeetingLink] = React.useState("");
  const [conflict, setConflict] = React.useState(false);

  React.useEffect(() => {
    if (!date || !time) { setConflict(false); return; }
    const iso = new Date(`${date}T${time}`).toISOString();
    const startMs = new Date(iso).getTime();
    const endMs = startMs + Number(duration) * 60000;
    setConflict(existingItems.some((it) => {
      const s = new Date(it.dateISO).getTime();
      const e = s + it.durationMinutes * 60000;
      return it.status === "scheduled" && (it.interviewer === interviewer || it.candidateName === candidate) && startMs < e && endMs > s;
    }));
  }, [date, time, duration, interviewer, candidate, existingItems]);

  const submit = () => {
    if (!candidate || !client || !date || !interviewer) {
      toast.error("Candidate, client, interviewer, and date are required");
      return;
    }
    if (conflict) {
      toast.error("Conflict detected — double-booked interviewer or candidate");
      return;
    }
    onScheduled({
      id: "sch_" + Date.now(),
      candidateName: candidate,
      clientName: client,
      jobTitle,
      round,
      type,
      dateISO: new Date(`${date}T${time}`).toISOString(),
      durationMinutes: Number(duration),
      interviewer,
      status: "scheduled",
      meetingLink: type === "video" ? (meetingLink || `https://meet.jobson.id/r/${Date.now()}`) : undefined,
    });
    toast.success(`Interview scheduled — ${candidate} on ${date} at ${time}`);
    onOpenChange(false);
    setCandidate(""); setClient(""); setJobTitle(""); setInterviewer(""); setMeetingLink(""); setDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule new interview</DialogTitle>
          <DialogDescription>Conflict detection runs automatically as you fill the form.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Candidate</Label>
            <Input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="Start typing a name…" />
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={client} onValueChange={(v) => { setClient(v); const o = openings.find((x) => x.clientName === v); if (o) setJobTitle(o.title); }}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clientAccounts.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Job title</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Full-Stack Engineer" />
          </div>
          <div className="space-y-2">
            <Label>Round</Label>
            <Input value={round} onChange={(e) => setRound(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ScheduleItem["type"])}>
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
            <Label>Duration</Label>
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
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue={TIMEZONES[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {type === "video" && (
            <div className="sm:col-span-2 space-y-2">
              <Label>Meeting link</Label>
              <Input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://meet.jobson.id/r/…" />
            </div>
          )}
        </div>
        {conflict && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-xs">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-rose-700 dark:text-rose-400">Scheduling conflict detected</p>
              <p className="text-muted-foreground">The interviewer or candidate has another interview at this time. Pick a different slot.</p>
            </div>
          </div>
        )}
        {!conflict && date && time && (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-700 dark:text-emerald-400">No conflicts</p>
              <p className="text-muted-foreground">{interviewer || "Interviewer"} and {candidate || "candidate"} are free at this time.</p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Schedule interview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RescheduleDialog({
  item, onOpenChange, onConfirm,
}: {
  item: ScheduleItem | null;
  onOpenChange: (v: boolean) => void;
  onConfirm: (date: string, time: string) => void;
}) {
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("10:00");
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule interview</DialogTitle>
          <DialogDescription>
            {item && <>{item.candidateName} • {item.round}<br />Currently: {formatDateTime(item.dateISO)}</>}
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
          <Button onClick={() => onConfirm(date, time)}><RefreshCw className="h-4 w-4 mr-1" /> Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
