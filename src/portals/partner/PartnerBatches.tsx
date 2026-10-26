"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { batches, trainingCentres, programs } from "@/lib/partner-data";
import type { Batch } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { CalendarCheck2, Plus, Users, Eye, ArrowRight, Clock } from "lucide-react";

const STATUSES: Batch["status"][] = ["upcoming", "active", "completed", "cancelled"];

export function PartnerBatches() {
  const partner = CURRENT_PARTNER;
  const partnerCentres = trainingCentres.filter((c) => c.partnerId === partner.id);
  const [batchList, setBatchList] = React.useState<Batch[]>(batches.filter((b) => partnerCentres.some((c) => c.id === b.centreId)));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [centreFilter, setCentreFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<Batch | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = batchList.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (centreFilter !== "all" && b.centreId !== centreFilter) return false;
    return true;
  });

  const totalCapacity = batchList.reduce((s, b) => s + b.capacity, 0);
  const totalEnrolled = batchList.reduce((s, b) => s + b.enrolled, 0);
  const activeCount = batchList.filter((b) => b.status === "active").length;
  const avgAttendance = batchList.length > 0 ? Math.round(batchList.reduce((s, b) => s + b.attendanceRate, 0) / batchList.length) : 0;

  function openBatch(b: Batch) {
    setSelected(b);
    setSheetOpen(true);
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const centre = partnerCentres.find((c) => c.id === fd.get("centreId"));
    const newB: Batch = {
      id: `bt_${Date.now()}`,
      centreId: fd.get("centreId") as string,
      centreName: centre?.name ?? "—",
      programName: fd.get("programName") as string,
      code: (fd.get("code") as string).toUpperCase(),
      trainer: fd.get("trainer") as string,
      startDate: fd.get("startDate") as string,
      endDate: fd.get("endDate") as string,
      schedule: fd.get("schedule") as string,
      enrolled: 0,
      capacity: Number(fd.get("capacity")) || 0,
      attendanceRate: 0,
      progress: 0,
      status: "upcoming",
      modality: fd.get("modality") as Batch["modality"],
    };
    setBatchList((prev) => [newB, ...prev]);
    setAddOpen(false);
    toast.success("Batch created", { description: `${newB.code} · ${newB.programName}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batches"
        description={`${partner.name} — manage training cohorts, schedules, and attendance.`}
        icon={<Icon name="CalendarCheck2" className="h-6 w-6" />}
        actions={[
          { label: "Create Batch", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Batches" value={batchList.length} icon={<CalendarCheck2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<Clock className="h-5 w-5" />} tone="success" />
        <StatCard label="Enrolled" value={totalEnrolled} icon={<Users className="h-5 w-5" />} hint={`of ${totalCapacity} capacity`} />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} icon={<CalendarCheck2 className="h-5 w-5" />} tone="warning" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Centre</Label>
            <Select value={centreFilter} onValueChange={setCentreFilter}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All centres</SelectItem>
                {partnerCentres.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Centre</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Modality</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={11} className="py-10 text-center text-sm text-muted-foreground">No batches match the filters.</TableCell></TableRow>
                ) : filtered.map((b) => (
                  <TableRow key={b.id} className="cursor-pointer hover:bg-brand/5" onClick={() => openBatch(b)}>
                    <TableCell className="font-mono text-xs">{b.code}</TableCell>
                    <TableCell className="text-sm font-medium">{b.programName}</TableCell>
                    <TableCell className="text-sm">{b.centreName}</TableCell>
                    <TableCell className="text-sm">{b.trainer}</TableCell>
                    <TableCell className="text-xs">{b.schedule}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={(b.enrolled / b.capacity) * 100} className="h-1.5 w-12" />
                        <span className="text-xs">{b.enrolled}/{b.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={b.attendanceRate} className="h-1.5 w-12" />
                        <span className="text-xs">{b.attendanceRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Progress value={b.progress} className="h-1.5 w-16" />
                    </TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell><span className="text-xs capitalize">{b.modality}</span></TableCell>
                    <TableCell><ArrowRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm">{selected.code}</span>
                  <StatusBadge status={selected.status} />
                </SheetTitle>
                <SheetDescription>{selected.programName}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Centre</p>
                    <p className="text-sm font-medium">{selected.centreName}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Trainer</p>
                    <p className="text-sm font-medium">{selected.trainer}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">{formatDate(selected.startDate)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">End Date</p>
                    <p className="text-sm font-medium">{formatDate(selected.endDate)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Schedule</p>
                    <p className="text-sm font-medium">{selected.schedule}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Modality</p>
                    <p className="text-sm font-medium capitalize">{selected.modality}</p>
                  </div>
                </div>

                <SectionCard title="Enrollment & Capacity">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{selected.enrolled} enrolled</span>
                    <span className="text-muted-foreground">{selected.capacity} capacity</span>
                  </div>
                  <Progress value={(selected.enrolled / selected.capacity) * 100} className="h-2" />
                </SectionCard>

                <SectionCard title="Attendance & Progress">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Attendance Rate</span>
                        <span>{selected.attendanceRate}%</span>
                      </div>
                      <Progress value={selected.attendanceRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Course Progress</span>
                        <span>{selected.progress}%</span>
                      </div>
                      <Progress value={selected.progress} className="h-2" />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Progress Timeline" description="Milestones reached">
                  <ol className="space-y-2 text-sm">
                    <li className="flex gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> <span>Batch started — {formatDate(selected.startDate)}</span></li>
                    <li className="flex gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> <span>Module 1 completed</span></li>
                    {selected.progress >= 50 && <li className="flex gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> <span>Midpoint assessment</span></li>}
                    {selected.progress >= 100 && <li className="flex gap-2"><Clock className="h-4 w-4 text-brand" /> <span>Batch completed — {formatDate(selected.endDate)}</span></li>}
                  </ol>
                </SectionCard>

                <SectionCard title="Students" description={`${selected.enrolled} enrolled in this batch`}>
                  <div className="space-y-2 max-h-60 overflow-y-auto scroll-thin">
                    {Array.from({ length: Math.min(selected.enrolled, 8) }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-2">
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={`Student ${i + 1}`} size="sm" />
                          <div>
                            <p className="text-sm font-medium">Student {i + 1}</p>
                            <p className="text-xs text-muted-foreground">{selected.code} · {selected.modality}</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">Active</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Attendance sheet opened")}>Attendance</Button>
                  <Button className="flex-1" onClick={() => toast.success("Edit batch form opened")}>Edit Batch</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create batch dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Batch</DialogTitle>
            <DialogDescription>Schedule a new training batch at one of your centres.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="code">Batch Code</Label>
                <Input id="code" name="code" required placeholder="B-24-14" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" min={1} defaultValue={25} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="programName">Program</Label>
              <Select name="programName" defaultValue={programs[0]?.name}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {programs.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="centreId">Centre</Label>
              <Select name="centreId" defaultValue={partnerCentres[0]?.id}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {partnerCentres.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="trainer">Trainer</Label>
              <Input id="trainer" name="trainer" required defaultValue="Rajesh Kumar" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="schedule">Schedule</Label>
                <Input id="schedule" name="schedule" required placeholder="Mon-Fri 9 AM - 1 PM" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="modality">Modality</Label>
                <Select name="modality" defaultValue="offline">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create Batch</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
