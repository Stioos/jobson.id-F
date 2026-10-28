"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Trainer {
  id: string; org: string; admin: string; courses: number; students: number; certifications: number; status: string;
}

const TRAINERS: Trainer[] = [
  { id: "t_001", org: "Apex Skill Academy", admin: "Karthik Iyer", courses: 24, students: 412, certifications: 318, status: "active" },
  { id: "t_002", org: "EduFirst Institute", admin: "Latha Raman", courses: 18, students: 286, certifications: 210, status: "active" },
  { id: "t_003", org: "CodeCraft Bootcamp", admin: "Anand Patel", courses: 12, students: 184, certifications: 142, status: "active" },
  { id: "t_004", org: "CloudMaster Academy", admin: "Reshma Pillai", courses: 9, students: 96, certifications: 72, status: "trialing" },
  { id: "t_005", org: "DataInsight Labs", admin: "Vignesh S", courses: 15, students: 224, certifications: 198, status: "active" },
  { id: "t_006", org: "SalesPro Trainers", admin: "Nilesh Joshi", courses: 7, students: 78, certifications: 54, status: "active" },
  { id: "t_007", org: "SoftSkill Studio", admin: "Pooja Bhatt", courses: 11, students: 142, certifications: 110, status: "past_due" },
];

export function SuperAdminUsersTraining() {
  const [search, setSearch] = React.useState("");
  const filtered = TRAINERS.filter(t => {
    const s = search.toLowerCase();
    return !s || t.org.toLowerCase().includes(s) || t.admin.toLowerCase().includes(s);
  });

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "trialing" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s.replace("_", " ")}</Badge>;
  };

  const totalCourses = TRAINERS.reduce((s, t) => s + t.courses, 0);
  const totalStudents = TRAINERS.reduce((s, t) => s + t.students, 0);
  const totalCerts = TRAINERS.reduce((s, t) => s + t.certifications, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Providers"
        description="All training provider organizations with course catalog size, enrolled students, and certifications issued."
        icon={<Icon name="GraduationCap" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Providers" value={TRAINERS.length} icon={<Icon name="GraduationCap" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Courses" value={totalCourses} icon={<Icon name="BookOpen" className="h-5 w-5" />} />
        <StatCard label="Students Enrolled" value={totalStudents} icon={<Icon name="Users" className="h-5 w-5" />} tone="success" />
        <StatCard label="Certifications" value={totalCerts} icon={<Icon name="Award" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Training Provider Directory" description={`${filtered.length} of ${TRAINERS.length}`}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search provider or admin…" className="mb-3 h-9 max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Certifications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.org}</TableCell>
                  <TableCell className="text-xs">{t.admin}</TableCell>
                  <TableCell>{t.courses}</TableCell>
                  <TableCell>{t.students}</TableCell>
                  <TableCell><Badge variant="secondary">{t.certifications}</Badge></TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing ${t.org}`)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
