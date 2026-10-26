"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cohorts, trainingCourses, trainers, corporateClients } from "@/lib/lms-data";
import type { Cohort } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { formatDate, daysUntil, formatNumber } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, Users2, GraduationCap, CheckCircle2, Clock } from "lucide-react";

const cohortSchema = z.object({
  name: z.string().min(2, "Required"),
  courseId: z.string().min(1, "Required"),
  trainerId: z.string().min(1, "Required"),
  clientId: z.string().min(1, "Required"),
  schedule: z.string().min(2, "Required"),
  modality: z.enum(["online", "offline", "hybrid"]),
  capacity: z.coerce.number().min(1),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
});
type FormValues = z.infer<typeof cohortSchema>;

export function TrainingCohorts() {
  const [rows, setRows] = React.useState<Cohort[]>(cohorts);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [clientFilter, setClientFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<Cohort | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(cohortSchema) as Resolver<FormValues>,
    defaultValues: {
      name: "", courseId: trainingCourses[0]?.id ?? "", trainerId: trainers[0]?.id ?? "",
      clientId: corporateClients[0]?.id ?? "", schedule: "Tue/Thu 7-9 PM IST",
      modality: "online", capacity: 30,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    },
  });

  const filtered = rows.filter((c) => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchClient = clientFilter === "all" || c.clientId === clientFilter;
    return matchStatus && matchClient;
  });

  const activeCount = rows.filter((c) => c.status === "active").length;
  const totalLearners = rows.reduce((s, c) => s + c.learnerCount, 0);
  const avgAttendance = rows.length > 0 ? Math.round(rows.reduce((s, c) => s + c.attendanceRate, 0) / rows.length) : 0;

  function onSubmit(values: FormValues) {
    const course = trainingCourses.find((c) => c.id === values.courseId);
    const trainer = trainers.find((t) => t.id === values.trainerId);
    const client = corporateClients.find((c) => c.id === values.clientId);
    const newCohort: Cohort = {
      id: `co_new_${Date.now()}`,
      name: values.name,
      courseId: values.courseId,
      courseName: course?.name,
      trainerId: values.trainerId,
      trainerName: trainer?.name ?? "",
      clientId: values.clientId,
      clientName: client?.name,
      learnerCount: 0,
      startDate: values.startDate,
      endDate: values.endDate,
      progress: 0,
      status: "upcoming",
      attendanceRate: 0,
      schedule: values.schedule,
      modality: values.modality,
    };
    setRows((r) => [newCohort, ...r]);
    setAddOpen(false);
    form.reset();
    toast.success(`Cohort created — ${values.name}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Cohorts"
        description="Manage training batches — schedules, trainers, and learner progress."
        icon={<Icon name="Users2" className="h-6 w-6" />}
        actions={[{ label: "Create cohort", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Cohorts" value={activeCount} icon={<Users2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Learners" value={formatNumber(totalLearners)} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Cohorts" value={rows.length} icon={<Clock className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="Client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Users2 className="h-5 w-5" />} title="No cohorts found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Learners</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Modality</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead className="min-w-[120px]">Progress</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(c)}>
                    <TableCell className="font-medium text-sm">{c.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">{c.courseName}</TableCell>
                    <TableCell className="text-sm">{c.trainerName}</TableCell>
                    <TableCell className="text-sm">{c.clientName}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{c.learnerCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.schedule}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize text-[10px]">{c.modality}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(c.startDate)} → {formatDate(c.endDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={c.progress} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">{c.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.attendanceRate > 0 ? `${c.attendanceRate}%` : "—"}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>{detail.name}</SheetTitle>
                <SheetDescription>{detail.courseName} · {detail.clientName}</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Learners</p>
                    <p className="text-lg font-semibold">{detail.learnerCount}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-lg font-semibold">{detail.progress}%</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Attendance</p>
                    <p className="text-lg font-semibold">{detail.attendanceRate}%</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Modality</p>
                    <p className="text-lg font-semibold capitalize">{detail.modality}</p>
                  </div>
                </div>
                <SectionCard title="Schedule">
                  <p className="text-sm">{detail.schedule}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(detail.startDate)} → {formatDate(detail.endDate)} ({daysUntil(detail.endDate)}d remaining)</p>
                </SectionCard>
                <SectionCard title="Trainer">
                  <div className="flex items-center gap-3">
                    <AvatarLogo text={detail.trainerName} size="md" />
                    <div>
                      <p className="text-sm font-medium">{detail.trainerName}</p>
                      <p className="text-xs text-muted-foreground">{detail.clientName}</p>
                    </div>
                  </div>
                </SectionCard>
                <SectionCard title={`Learners (${detail.learnerCount})`}>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto scroll-thin">
                    {Array.from({ length: Math.min(detail.learnerCount, 6) }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <AvatarLogo text={`Learner ${i + 1}`} size="xs" />
                        <span>Learner {i + 1}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{Math.round(detail.progress * (0.8 + Math.random() * 0.4))}%</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <Button className="w-full" onClick={() => toast.info(`Opening cohort workspace: ${detail.name}`)}>Open cohort workspace</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Cohort</DialogTitle>
            <DialogDescription>Schedule a new training batch.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="co-name">Cohort name *</Label>
              <Input id="co-name" {...form.register("name")} className="mt-1" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="co-course">Course</Label>
                <Select defaultValue={form.getValues("courseId")} onValueChange={(v) => form.setValue("courseId", v)}>
                  <SelectTrigger id="co-course" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{trainingCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="co-trainer">Trainer</Label>
                <Select defaultValue={form.getValues("trainerId")} onValueChange={(v) => form.setValue("trainerId", v)}>
                  <SelectTrigger id="co-trainer" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{trainers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="co-client">Client</Label>
                <Select defaultValue={form.getValues("clientId")} onValueChange={(v) => form.setValue("clientId", v)}>
                  <SelectTrigger id="co-client" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="co-modality">Modality</Label>
                <Select defaultValue={form.getValues("modality")} onValueChange={(v) => form.setValue("modality", v as FormValues["modality"])}>
                  <SelectTrigger id="co-modality" className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                  <SelectContent>{["online", "offline", "hybrid"].map((m) => <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="co-schedule">Schedule</Label>
                <Input id="co-schedule" {...form.register("schedule")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="co-capacity">Capacity</Label>
                <Input id="co-capacity" type="number" {...form.register("capacity")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="co-start">Start date</Label>
                <Input id="co-start" type="date" {...form.register("startDate")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="co-end">End date</Label>
                <Input id="co-end" type="date" {...form.register("endDate")} className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Create cohort</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
