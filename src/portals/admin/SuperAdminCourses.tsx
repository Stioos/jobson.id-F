"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface Course {
  id: string; title: string; provider: string; students: number; rating: number; price: number; status: string;
}

const COURSES: Course[] = [
  { id: "co_001", title: "Full Stack React + Node Bootcamp", provider: "CodeCraft Bootcamp", students: 412, rating: 4.7, price: 12_400, status: "published" },
  { id: "co_002", title: "Data Science with Python", provider: "DataInsight Labs", students: 284, rating: 4.8, price: 18_000, status: "published" },
  { id: "co_003", title: "AWS Cloud Practitioner", provider: "CloudMaster Academy", students: 96, rating: 4.5, price: 6_400, status: "published" },
  { id: "co_004", title: "Sales Mastery Pro", provider: "SalesPro Trainers", students: 78, rating: 4.4, price: 4_400, status: "pending" },
  { id: "co_005", title: "Soft Skills for Leaders", provider: "SoftSkill Studio", students: 142, rating: 4.6, price: 3_200, status: "pending" },
  { id: "co_006", title: "Kubernetes for Beginners", provider: "CloudMaster Academy", students: 64, rating: 4.3, price: 7_800, status: "featured" },
  { id: "co_007", title: "Excel for Finance Pros", provider: "Apex Skill Academy", students: 218, rating: 4.5, price: 2_400, status: "published" },
  { id: "co_008", title: "Digital Marketing Mastery", provider: "SalesPro Trainers", students: 124, rating: 4.2, price: 5_400, status: "archived" },
];

export function SuperAdminCourses() {
  const [search, setSearch] = React.useState("");
  const filtered = COURSES.filter(c => {
    const q = search.toLowerCase();
    return !q || c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q);
  });

  const statusBadge = (s: string) => {
    const cls = s === "published" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "featured" ? "bg-teal-500/15 text-teal-700 border-teal-500/30"
      : s === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const action = (id: string, action: string) => toast.success(`Course ${id} ${action}`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Catalog"
        description="Manage all courses across training providers — approve, feature, or archive."
        icon={<Icon name="GraduationCap" className="h-6 w-6" />}
        actions={[{ label: "Bulk Approve", variant: "outline", onClick: () => toast.success("Bulk approve queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Courses" value={COURSES.length} icon={<Icon name="GraduationCap" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Published" value={COURSES.filter(c => c.status === "published").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Review" value={COURSES.filter(c => c.status === "pending").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Featured" value={COURSES.filter(c => c.status === "featured").length} icon={<Icon name="Star" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Course Catalog" description={`${filtered.length} of ${COURSES.length}`}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search course or provider…" className="mb-3 h-9 max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell className="text-xs">{c.provider}</TableCell>
                  <TableCell>{c.students}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" className="h-3 w-3 text-amber-500" />
                      <span className="text-xs">{c.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(c.price)}</TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.status === "pending" && <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => action(c.id, "approved")}>Approve</Button>}
                      {c.status === "published" && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => action(c.id, "featured")}>Feature</Button>}
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => action(c.id, "archived")}>Archive</Button>
                    </div>
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
