"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Enrollment {
  id: string; learner: string; course: string; provider: string; seatsTotal: number; seatsFilled: number; waitlist: number; status: "pending" | "approved" | "rejected" | "waitlisted"; submittedAt: string;
}

const ENROLLMENTS: Enrollment[] = [
  { id: "EN-2024-9001", learner: "Priya Nair", course: "Full Stack React Bootcamp", provider: "CodeCraft Bootcamp", seatsTotal: 50, seatsFilled: 42, waitlist: 8, status: "approved", submittedAt: "2024-09-21T09:42:00Z" },
  { id: "EN-2024-9002", learner: "Rohan Mehta", course: "AWS Cloud Practitioner", provider: "CloudMaster Academy", seatsTotal: 30, seatsFilled: 30, waitlist: 14, status: "waitlisted", submittedAt: "2024-09-21T08:30:00Z" },
  { id: "EN-2024-9003", learner: "Sneha Reddy", course: "Data Science with Python", provider: "DataInsight Labs", seatsTotal: 40, seatsFilled: 38, waitlist: 6, status: "pending", submittedAt: "2024-09-21T07:18:00Z" },
  { id: "EN-2024-9004", learner: "Aarav Sharma", course: "Kubernetes for Beginners", provider: "CloudMaster Academy", seatsTotal: 25, seatsFilled: 22, waitlist: 4, status: "pending", submittedAt: "2024-09-20T17:42:00Z" },
  { id: "EN-2024-9005", learner: "Anika Verma", course: "Sales Mastery Pro", provider: "SalesPro Trainers", seatsTotal: 25, seatsFilled: 18, waitlist: 2, status: "approved", submittedAt: "2024-09-20T15:22:00Z" },
  { id: "EN-2024-9006", learner: "Karthik Iyer", course: "Excel for Finance Pros", provider: "Apex Skill Academy", seatsTotal: 35, seatsFilled: 35, waitlist: 11, status: "rejected", submittedAt: "2024-09-20T11:08:00Z" },
  { id: "EN-2024-9007", learner: "Meera Joshi", course: "Soft Skills for Leaders", provider: "SoftSkill Studio", seatsTotal: 20, seatsFilled: 12, waitlist: 0, status: "approved", submittedAt: "2024-09-20T09:30:00Z" },
  { id: "EN-2024-9008", learner: "Vikram Singh", course: "Digital Marketing Mastery", provider: "SalesPro Trainers", seatsTotal: 30, seatsFilled: 8, waitlist: 0, status: "pending", submittedAt: "2024-09-19T19:42:00Z" },
];

const CONVERSION = [
  { provider: "CodeCraft Bootcamp", requests: 1240, approved: 1080, conversion: 87 },
  { provider: "DataInsight Labs", requests: 980, approved: 894, conversion: 91 },
  { provider: "CloudMaster Academy", requests: 760, approved: 542, conversion: 71 },
  { provider: "Apex Skill Academy", requests: 580, approved: 521, conversion: 90 },
  { provider: "SalesPro Trainers", requests: 420, approved: 318, conversion: 76 },
];

export function SuperAdminEnrollmentOversight() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const filtered = ENROLLMENTS.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.learner.toLowerCase().includes(q) || e.course.toLowerCase().includes(q) || e.provider.toLowerCase().includes(q);
    const matchStatus = status === "all" || e.status === status;
    return matchSearch && matchStatus;
  });

  const pending = ENROLLMENTS.filter(e => e.status === "pending").length;
  const approved = ENROLLMENTS.filter(e => e.status === "approved").length;
  const totalWaitlist = ENROLLMENTS.reduce((a, e) => a + e.waitlist, 0);
  const avgConversion = Math.round(CONVERSION.reduce((a, c) => a + c.conversion, 0) / CONVERSION.length);

  const statusBadge = (s: Enrollment["status"]) => {
    const cls = s === "approved" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : s === "rejected" ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : s === "waitlisted" ? "bg-amber-500/15 text-amber-700 border-amber-500/30" : "bg-cyan-500/15 text-cyan-700 border-cyan-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollment Approvals"
        description="Oversight of all enrollment requests across training providers — approval workflows, seat availability, waitlists, and conversion rates."
        icon={<Icon name="ClipboardCheck" className="h-6 w-6" />}
        actions={[{ label: "Bulk Approve", variant: "default", onClick: () => toast.success("Bulk approval queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Enrollments (90d)" value={ENROLLMENTS.length} icon={<Icon name="ClipboardCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Approval" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved" value={approved} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Waitlist" value={totalWaitlist} icon={<Icon name="Users2" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Enrollment Conversion Rate" description={`Avg across providers: ${avgConversion}%`}>
        <div className="space-y-2">
          {CONVERSION.sort((a, b) => b.conversion - a.conversion).map(c => (
            <div key={c.provider} className="flex items-center gap-3">
              <div className="w-44">
                <p className="truncate text-xs font-medium">{c.provider}</p>
                <p className="text-xs text-muted-foreground">{c.approved}/{c.requests} approved</p>
              </div>
              <Progress className="h-2 flex-1" value={c.conversion} />
              <span className="w-12 text-right text-xs font-medium">{c.conversion}%</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Enrollment Requests" description={`${filtered.length} of ${ENROLLMENTS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search learner, course, provider…" className="h-9 max-w-sm" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="waitlisted">Waitlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enrollment ID</TableHead>
                <TableHead>Learner</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Waitlist</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.id}</TableCell>
                  <TableCell className="font-medium text-sm">{e.learner}</TableCell>
                  <TableCell className="text-xs">{e.course}</TableCell>
                  <TableCell className="text-xs">{e.provider}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-14" value={(e.seatsFilled / e.seatsTotal) * 100} />
                      <span className="text-xs">{e.seatsFilled}/{e.seatsTotal}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {e.waitlist > 0 ? <Badge variant="outline" className="border-amber-500/30 bg-amber-500/15 text-amber-700 text-xs">{e.waitlist}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-xs">{timeAgo(e.submittedAt)}</TableCell>
                  <TableCell>{statusBadge(e.status)}</TableCell>
                  <TableCell>
                    {e.status === "pending" ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${e.id} approved`)}>Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`${e.id} waitlisted`)}>Waitlist</Button>
                      </div>
                    ) : <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Viewing ${e.id}`)}>View</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Waitlist Alerts" description="Courses with > 5 waitlisted learners">
        {ENROLLMENTS.filter(e => e.waitlist > 5).length === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No waitlist pressure" description="All courses have manageable waitlists." />
        ) : (
          <div className="space-y-2">
            {ENROLLMENTS.filter(e => e.waitlist > 5).map(e => (
              <div key={e.id} className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <Icon name="AlertTriangle" className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.course}</p>
                  <p className="text-xs text-muted-foreground">{e.provider} · {e.waitlist} waitlisted · {e.seatsFilled}/{e.seatsTotal} seats filled</p>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Suggesting additional cohort for ${e.course}…`)}>Add Cohort</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
