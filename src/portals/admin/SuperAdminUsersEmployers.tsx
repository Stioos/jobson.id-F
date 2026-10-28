"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Emp {
  id: string; company: string; admin: string; plan: string; jobs: number; hires: number; status: string;
}

const EMPLOYERS: Emp[] = [
  { id: "e_001", company: "TechCorp India", admin: "Rohan Mehta", plan: "Enterprise", jobs: 142, hires: 38, status: "active" },
  { id: "e_002", company: "NaukriX Pvt Ltd", admin: "Vikram Singh", plan: "Enterprise", jobs: 88, hires: 21, status: "active" },
  { id: "e_003", company: "FinEdge Solutions", admin: "Aditya Bansal", plan: "Business", jobs: 56, hires: 12, status: "active" },
  { id: "e_004", company: "CloudPeak Systems", admin: "Neha Agarwal", plan: "Business", jobs: 34, hires: 9, status: "trialing" },
  { id: "e_005", company: "HealthFirst Tech", admin: "Sanjay Kumar", plan: "Professional", jobs: 21, hires: 4, status: "active" },
  { id: "e_006", company: "EduSoft India", admin: "Meena Krishnan", plan: "Professional", jobs: 17, hires: 6, status: "past_due" },
  { id: "e_007", company: "Retail Boost Pvt Ltd", admin: "Imran Khan", plan: "Starter", jobs: 8, hires: 2, status: "active" },
  { id: "e_008", company: "AgroTech Coop", admin: "Latha Raman", plan: "Starter", jobs: 5, hires: 1, status: "active" },
];

export function SuperAdminUsersEmployers() {
  const [search, setSearch] = React.useState("");
  const filtered = EMPLOYERS.filter(e => {
    const s = search.toLowerCase();
    return !s || e.company.toLowerCase().includes(s) || e.admin.toLowerCase().includes(s);
  });

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "trialing" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : s === "past_due" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s.replace("_", " ")}</Badge>;
  };

  const totalJobs = EMPLOYERS.reduce((s, e) => s + e.jobs, 0);
  const totalHires = EMPLOYERS.reduce((s, e) => s + e.hires, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employers"
        description="All employer organizations with admin owners, plan tier, jobs posted, and hires made."
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Employers" value={EMPLOYERS.length} icon={<Icon name="Building2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={EMPLOYERS.filter(e => e.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Jobs Posted" value={totalJobs} icon={<Icon name="Briefcase" className="h-5 w-5" />} />
        <StatCard label="Total Hires" value={totalHires} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Employer Organizations" description={`${filtered.length} of ${EMPLOYERS.length}`}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company or admin…" className="mb-3 h-9 max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Jobs</TableHead>
                <TableHead>Hires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.company}</TableCell>
                  <TableCell className="text-xs">{e.admin}</TableCell>
                  <TableCell><Badge variant="secondary">{e.plan}</Badge></TableCell>
                  <TableCell>{e.jobs}</TableCell>
                  <TableCell>{e.hires}</TableCell>
                  <TableCell>{statusBadge(e.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing ${e.company}`)}>View</Button>
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
