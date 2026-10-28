"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  college: string;
  course: string;
  partner: string;
  enrollment: "active" | "completed" | "dropped" | "paused";
  completion: number;
  placement: "placed" | "in-process" | "not-started" | "opted-out";
}

const STUDENTS: Student[] = [
  { id: "stu_1", name: "Aarav Sharma", college: "IIT Delhi — Extension", course: "B.Tech Computer Science", partner: "Partner North Pvt Ltd", enrollment: "completed", completion: 100, placement: "placed" },
  { id: "stu_2", name: "Diya Patel", college: "BITS Pilani Off-Campus", course: "B.Tech Electronics", partner: "Partner North Pvt Ltd", enrollment: "active", completion: 68, placement: "in-process" },
  { id: "stu_3", name: "Vihaan Reddy", college: "VIT Vellore (Partner Wing)", course: "BCA", partner: "South Talent Solutions", enrollment: "active", completion: 42, placement: "not-started" },
  { id: "stu_4", name: "Ananya Iyer", college: "Christ University Block", course: "MBA", partner: "South Talent Solutions", enrollment: "completed", completion: 100, placement: "placed" },
  { id: "stu_5", name: "Arjun Nair", college: "VIT Vellore (Partner Wing)", course: "B.Tech Mechanical", partner: "South Talent Solutions", enrollment: "dropped", completion: 28, placement: "opted-out" },
  { id: "stu_6", name: "Saanvi Gupta", college: "St. Xavier's Mumbai", course: "B.Com", partner: "West Skill Hub", enrollment: "active", completion: 84, placement: "in-process" },
  { id: "stu_7", name: "Aditya Kumar", college: "COEP Polytechnic", course: "Diploma Mech", partner: "West Skill Hub", enrollment: "paused", completion: 52, placement: "not-started" },
  { id: "stu_8", name: "Ishita Bose", college: "Jadavpur University Wing", course: "B.Tech IT", partner: "East Career Network", enrollment: "completed", completion: 100, placement: "placed" },
  { id: "stu_9", name: "Kabir Singh", college: "IIT Delhi — Extension", course: "B.Tech Civil", partner: "Partner North Pvt Ltd", enrollment: "active", completion: 76, placement: "in-process" },
  { id: "stu_10", name: "Myra Menon", college: "Anna University Ext.", course: "B.E. ECE", partner: "South Talent Solutions", enrollment: "completed", completion: 100, placement: "placed" },
];

const BY_PARTNER = [
  { partner: "Partner North Pvt Ltd", total: 1842, active: 920, placed: 612, dropped: 48 },
  { partner: "South Talent Solutions", total: 2480, active: 1420, placed: 720, dropped: 84 },
  { partner: "West Skill Hub", total: 1240, active: 612, placed: 312, dropped: 32 },
  { partner: "East Career Network", total: 920, active: 480, placed: 240, dropped: 18 },
];

const BY_COURSE = [
  { course: "B.Tech Computer Science", count: 1840, placed: 1240, placementRate: 67 },
  { course: "MBA", count: 920, placed: 620, placementRate: 67 },
  { course: "B.Tech Electronics", count: 820, placed: 480, placementRate: 59 },
  { course: "BCA", count: 620, placed: 320, placementRate: 52 },
  { course: "B.Com", count: 540, placed: 280, placementRate: 52 },
];

export function SuperAdminStudentRegistry() {
  const [partner, setPartner] = React.useState("all");
  const [enrollment, setEnrollment] = React.useState("all");
  const [placement, setPlacement] = React.useState("all");
  const [q, setQ] = React.useState("");

  const filtered = STUDENTS.filter(s =>
    (partner === "all" || s.partner === partner) &&
    (enrollment === "all" || s.enrollment === enrollment) &&
    (placement === "all" || s.placement === placement) &&
    (q === "" || (s.name + s.college + s.course).toLowerCase().includes(q.toLowerCase()))
  );

  const placedCount = STUDENTS.filter(s => s.placement === "placed").length;
  const activeCount = STUDENTS.filter(s => s.enrollment === "active").length;
  const partners = Array.from(new Set(STUDENTS.map(s => s.partner)));

  const enrollBadge = (s: Student["enrollment"]) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "completed" ? "bg-teal-500/15 text-teal-700 border-teal-500/30"
      : s === "paused" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const placeBadge = (s: Student["placement"]) => {
    const cls = s === "placed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "in-process" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : s === "not-started" ? "bg-slate-500/15 text-slate-600 border-slate-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Registry"
        description="All students across all partners — name, college, course, partner, enrollment status, completion %, and placement status. Cross-partner student tracking and aggregates by partner/college/course."
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[{ label: "Export Registry", variant: "outline", onClick: () => toast.success("Student registry exported (CSV)") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Students" value={STUDENTS.length} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Placed" value={placedCount} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} />
        <StatCard label="Partners" value={partners.length} icon={<Icon name="Handshake" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Filters" description="Cross-partner student filter">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Partner</label>
            <Select value={partner} onValueChange={setPartner}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partners</SelectItem>
                {partners.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Enrollment</label>
            <Select value={enrollment} onValueChange={setEnrollment}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["all", "active", "completed", "paused", "dropped"].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Placement</label>
            <Select value={placement} onValueChange={setPlacement}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["all", "placed", "in-process", "not-started", "opted-out"].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Search</label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="name / college / course" className="mt-1" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title={`Students (${filtered.length})`} description="Cross-partner student directory" contentClassName="p-0">
        {filtered.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Users" className="h-5 w-5" />} title="No students match filters" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Placement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-xs">{s.college}</TableCell>
                  <TableCell className="text-xs">{s.course}</TableCell>
                  <TableCell className="text-xs">{s.partner}</TableCell>
                  <TableCell>{enrollBadge(s.enrollment)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${s.completion === 100 ? "bg-emerald-500" : s.completion >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${s.completion}%` }} />
                      </div>
                      <span className="text-xs">{s.completion}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{placeBadge(s.placement)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="By Partner" description="Student count per partner" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Dropped</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BY_PARTNER.map(p => (
                <TableRow key={p.partner}>
                  <TableCell className="font-medium text-xs">{p.partner}</TableCell>
                  <TableCell className="text-xs font-medium">{p.total.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs">{p.active.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs text-emerald-600 font-medium">{p.placed.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs text-rose-600">{p.dropped.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title="By Course" description="Top courses by enrollment" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Placement Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BY_COURSE.map(c => (
                <TableRow key={c.course}>
                  <TableCell className="font-medium text-xs">{c.course}</TableCell>
                  <TableCell className="text-xs">{c.count.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs text-emerald-600 font-medium">{c.placed.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${c.placementRate >= 65 ? "bg-emerald-500" : c.placementRate >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${c.placementRate}%` }} />
                      </div>
                      <span className="text-xs">{c.placementRate}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
}
