"use client";

import * as React from "react";
import { programs, batches, trainingCentres } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatNumber } from "@/lib/format";
import { toast } from "sonner";
import { Presentation, Plus, Calendar, Users, TrendingUp, Star } from "lucide-react";

interface ProgramDelivery {
  id: string;
  programName: string;
  batchesActive: number;
  studentsEnrolled: number;
  attendanceRate: number;
  completionRate: number;
  avgScore: number;
  trainer: string;
  modality: string;
}

export function PartnerTrainingDelivery() {
  const partner = CURRENT_PARTNER;
  const [scheduleOpen, setScheduleOpen] = React.useState(false);

  const deliveryData: ProgramDelivery[] = programs.filter((p) => p.active).slice(0, 6).map((p, i) => ({
    id: p.id,
    programName: p.name,
    batchesActive: 1 + (i % 3),
    studentsEnrolled: 20 + (i * 15) + (i % 2) * 12,
    attendanceRate: 85 + ((i * 3) % 12),
    completionRate: 78 + ((i * 4) % 18),
    avgScore: 72 + ((i * 5) % 18),
    trainer: ["Dr. Senthil Kumar", "Lakshmi Nair", "Rajesh Kumar", "Priya S", "Dr. Anand Verma", "Meera Krishnan"][i % 6],
    modality: p.deliveryModes[0],
  }));

  const totalActiveBatches = deliveryData.reduce((s, d) => s + d.batchesActive, 0);
  const totalStudents = deliveryData.reduce((s, d) => s + d.studentsEnrolled, 0);
  const avgAttendance = Math.round(deliveryData.reduce((s, d) => s + d.attendanceRate, 0) / deliveryData.length);
  const avgCompletion = Math.round(deliveryData.reduce((s, d) => s + d.completionRate, 0) / deliveryData.length);

  // Week schedule (Mon-Sun)
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const schedule: Record<string, { time: string; batch: string; program: string }[]> = {
    Mon: [{ time: "9 AM - 1 PM", batch: "B-24-10", program: "Full-Stack" }, { time: "2 PM - 5 PM", batch: "B-24-11", program: "Data Science" }],
    Tue: [{ time: "9 AM - 1 PM", batch: "B-24-10", program: "Full-Stack" }],
    Wed: [{ time: "2 PM - 5 PM", batch: "B-24-11", program: "Data Science" }, { time: "6 PM - 9 PM", batch: "B-24-14", program: "Cloud DevOps" }],
    Thu: [{ time: "9 AM - 1 PM", batch: "B-24-10", program: "Full-Stack" }],
    Fri: [{ time: "2 PM - 5 PM", batch: "B-24-11", program: "Data Science" }],
    Sat: [{ time: "10 AM - 4 PM", batch: "B-24-12", program: "Digital Marketing" }],
    Sun: [],
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training & Delivery"
        description={`${partner.name} — overview of training delivery across all active programs, batches, and trainers.`}
        icon={<Icon name="Presentation" className="h-6 w-6" />}
        actions={[{ label: "Schedule Training", icon: "Plus", onClick: () => setScheduleOpen(true) }]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Batches" value={totalActiveBatches} icon={<Presentation className="h-5 w-5" />} tone="brand" />
        <StatCard label="Students Enrolled" value={totalStudents} icon={<Users className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Completion" value={`${avgCompletion}%`} icon={<Star className="h-5 w-5" />} tone="brand" />
      </div>

      {/* Per-program delivery cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {deliveryData.map((d) => (
          <Card key={d.id} className="p-4 hover:border-brand hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">{d.programName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Trainer: {d.trainer} · {d.modality}</p>
              </div>
              <Badge variant="outline" className="text-[10px]">{d.batchesActive} batch{d.batchesActive > 1 ? "es" : ""}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">{d.attendanceRate}%</span>
                </div>
                <Progress value={d.attendanceRate} className="h-1.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{d.completionRate}%</span>
                </div>
                <Progress value={d.completionRate} className="h-1.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Avg Score</span>
                  <span className="font-medium">{d.avgScore}%</span>
                </div>
                <Progress value={d.avgScore} className="h-1.5" />
              </div>
              <div className="rounded-lg bg-muted/40 p-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Students</p>
                <p className="text-sm font-semibold">{d.studentsEnrolled}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly schedule */}
      <SectionCard title="Weekly Delivery Calendar" description="Batch schedule — current week overview">
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="rounded-lg border p-2 min-h-[120px]">
              <p className="text-xs font-semibold text-center mb-2">{day}</p>
              <div className="space-y-1">
                {schedule[day].length === 0 ? (
                  <p className="text-[10px] text-muted-foreground text-center py-2">No sessions</p>
                ) : schedule[day].map((s, i) => (
                  <div key={i} className="rounded bg-brand/10 border border-brand/20 p-1.5">
                    <p className="text-[10px] font-medium text-brand">{s.time}</p>
                    <p className="text-[10px] text-foreground">{s.program}</p>
                    <p className="text-[9px] text-muted-foreground font-mono">{s.batch}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Quality metrics */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Quality Metrics</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Avg Student Satisfaction</span><span className="font-medium">4.6 / 5</span></div>
            <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Trainer Rating</span><span className="font-medium">4.7 / 5</span></div>
            <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Curriculum Adherence</span><span className="font-medium">94%</span></div>
            <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">On-time Batch Completion</span><span className="font-medium">88%</span></div>
            <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Certification Rate</span><span className="font-medium">82%</span></div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Active Centres</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto scroll-thin">
            {trainingCentres.filter((c) => c.partnerId === partner.id).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded border p-2">
                <div>
                  <p className="text-xs font-medium">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.city} · {c.batchesActive} batches</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{c.studentsEnrolled} students</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Recent Batches</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto scroll-thin">
            {batches.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded border p-2">
                <div>
                  <p className="text-xs font-medium font-mono">{b.code}</p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{b.programName}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Schedule Training Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Training</DialogTitle>
            <DialogDescription>Schedule a new training batch.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Training scheduled", { description: "Batch added to delivery calendar." }); setScheduleOpen(false); }} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Program</Label>
              <Select defaultValue={programs[0].id}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {programs.filter((p) => p.active).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Centre</Label>
                <Select defaultValue={trainingCentres[0].id}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {trainingCentres.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Modality</Label>
                <Select defaultValue="offline">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label>Capacity</Label><Input type="number" placeholder="30" /></div>
            </div>
            <div className="space-y-1.5"><Label>Schedule</Label><Input placeholder="e.g. Mon-Fri 9 AM - 1 PM" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
              <Button type="submit">Schedule Batch</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
