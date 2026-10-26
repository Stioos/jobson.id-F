"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { liveSessions, trainingCourses, cohorts, trainers } from "@/lib/lms-data";
import type { LiveSession } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { formatDateTime, formatDate } from "@/lib/format";
import { TenantDisclaimer, durationLabel } from "./_shared";
import { toast } from "sonner";
import { Plus, Video, Users, CheckCircle2, Play, ExternalLink, MapPin } from "lucide-react";

const sessionSchema = z.object({
  title: z.string().min(2, "Required"),
  courseId: z.string().optional(),
  cohortId: z.string().optional(),
  trainerId: z.string().min(1, "Required"),
  date: z.string().min(1, "Required"),
  startTime: z.string().min(1, "Required"),
  durationMinutes: z.coerce.number().min(15),
  platform: z.enum(["zoom", "teams", "meet", "webex", "offline"]),
  capacity: z.coerce.number().min(1),
});
type FormValues = z.infer<typeof sessionSchema>;

const PLATFORM_LABELS: Record<string, string> = {
  zoom: "Zoom", teams: "Microsoft Teams", meet: "Google Meet", webex: "Webex", offline: "In-person",
};

export function TrainingLiveTraining() {
  const [rows, setRows] = React.useState<LiveSession[]>(liveSessions);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(sessionSchema) as Resolver<FormValues>,
    defaultValues: {
      title: "", courseId: trainingCourses[0]?.id ?? "", cohortId: cohorts[0]?.id ?? "",
      trainerId: trainers[0]?.id ?? "", date: new Date().toISOString().slice(0, 10),
      startTime: "19:00", durationMinutes: 90, platform: "zoom", capacity: 50,
    },
  });

  const now = Date.now();
  const filtered = rows.filter((s) => {
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    let matchDate = true;
    const sessionDate = new Date(s.date).getTime();
    if (dateFilter === "upcoming") matchDate = sessionDate >= now;
    if (dateFilter === "past") matchDate = sessionDate < now;
    return matchStatus && matchDate;
  });

  const scheduled = rows.filter((s) => s.status === "scheduled").length;
  const completed = rows.filter((s) => s.status === "completed").length;
  const totalRegistered = rows.reduce((s, x) => s + x.registered, 0);

  function onSubmit(values: FormValues) {
    const trainer = trainers.find((t) => t.id === values.trainerId);
    const course = trainingCourses.find((c) => c.id === values.courseId);
    const cohort = cohorts.find((c) => c.id === values.cohortId);
    const newSession: LiveSession = {
      id: `ls_new_${Date.now()}`,
      title: values.title,
      courseId: values.courseId,
      cohortId: values.cohortId,
      trainerId: values.trainerId,
      trainerName: trainer?.name ?? "",
      date: values.date,
      startTime: values.startTime,
      durationMinutes: values.durationMinutes,
      platform: values.platform,
      capacity: values.capacity,
      registered: 0,
      status: "scheduled",
      modality: values.platform === "offline" ? "offline" : "online",
    };
    setRows((r) => [newSession, ...r]);
    setAddOpen(false);
    form.reset();
    toast.success(`Session scheduled — ${values.title}`, { description: `${course?.name ?? "Standalone"} · ${trainer?.name}` });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Live Sessions"
        description="Schedule and manage live virtual & in-person training sessions."
        icon={<Icon name="Video" className="h-6 w-6" />}
        actions={[{ label: "Schedule session", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Scheduled" value={scheduled} icon={<Video className="h-5 w-5" />} tone="brand" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Registered" value={totalRegistered} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Avg Capacity" value={rows.length > 0 ? Math.round(rows.reduce((s, x) => s + x.capacity, 0) / rows.length) : 0} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Date" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All dates</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Video className="h-5 w-5" />} title="No sessions found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const fillPct = s.capacity > 0 ? Math.round((s.registered / s.capacity) * 100) : 0;
            return (
              <div key={s.id} className="rounded-xl border bg-card p-4 hover:border-brand/40 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight line-clamp-2">{s.title}</h3>
                  <StatusBadge status={s.status} />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">{PLATFORM_LABELS[s.platform]}</Badge>
                  <Badge variant="outline" className="text-[10px] capitalize">{s.modality}</Badge>
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="font-mono text-xs">{formatDate(s.date, { day: "numeric", month: "short" })} · {s.startTime}</span>
                    <span className="text-xs text-muted-foreground">({durationLabel(s.durationMinutes)})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{s.trainerName}</p>
                  {s.location && <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{s.location}</p>}
                </div>
                <div className="mt-3 border-t pt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Registered</span>
                    <span className="font-medium">{s.registered}/{s.capacity}</span>
                  </div>
                  <Progress value={fillPct} className="h-1.5" />
                </div>
                <div className="mt-3 flex gap-2">
                  {s.status === "scheduled" && (
                    <>
                      {s.meetingLink && <Button size="sm" className="flex-1" onClick={() => toast.info(`Joining: ${s.title}`)}><ExternalLink className="mr-1 h-3 w-3" />Join</Button>}
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info(`Starting session: ${s.title}`)}><Play className="mr-1 h-3 w-3" />Start</Button>
                    </>
                  )}
                  {s.status === "completed" && s.recordingUrl && (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info(`Opening recording: ${s.title}`)}><Play className="mr-1 h-3 w-3" />Recording</Button>
                  )}
                  {s.status === "completed" && s.attended !== undefined && (
                    <span className="text-xs text-muted-foreground self-center">Attended: {s.attended}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Live Session</DialogTitle>
            <DialogDescription>Create a new live training session.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="ls-title">Session title *</Label>
              <Input id="ls-title" {...form.register("title")} className="mt-1" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="ls-course">Course (optional)</Label>
                <Select defaultValue={form.getValues("courseId")} onValueChange={(v) => form.setValue("courseId", v)}>
                  <SelectTrigger id="ls-course" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{trainingCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ls-cohort">Cohort (optional)</Label>
                <Select defaultValue={form.getValues("cohortId")} onValueChange={(v) => form.setValue("cohortId", v)}>
                  <SelectTrigger id="ls-cohort" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{cohorts.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ls-trainer">Trainer *</Label>
                <Select defaultValue={form.getValues("trainerId")} onValueChange={(v) => form.setValue("trainerId", v)}>
                  <SelectTrigger id="ls-trainer" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{trainers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ls-platform">Platform</Label>
                <Select defaultValue={form.getValues("platform")} onValueChange={(v) => form.setValue("platform", v as FormValues["platform"])}>
                  <SelectTrigger id="ls-platform" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(PLATFORM_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ls-date">Date *</Label>
                <Input id="ls-date" type="date" {...form.register("date")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ls-time">Start time *</Label>
                <Input id="ls-time" type="time" {...form.register("startTime")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ls-dur">Duration (min) *</Label>
                <Input id="ls-dur" type="number" {...form.register("durationMinutes")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="ls-cap">Capacity *</Label>
                <Input id="ls-cap" type="number" {...form.register("capacity")} className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Schedule session</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
