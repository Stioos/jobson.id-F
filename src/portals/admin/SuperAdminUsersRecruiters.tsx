"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface Rec {
  id: string; name: string; agency: string; placements: number; commission: number; status: string;
}

const RECRUITERS: Rec[] = [
  { id: "r_001", name: "Sneha Reddy", agency: "TalentBridge Consulting", placements: 42, commission: 18_50_000, status: "active" },
  { id: "r_002", name: "Manish Agarwal", agency: "HireRight India", placements: 28, commission: 12_40_000, status: "active" },
  { id: "r_003", name: "Kavita Nair", agency: "TalentBridge Consulting", placements: 35, commission: 15_20_000, status: "active" },
  { id: "r_004", name: "Rajeev Menon", agency: "PeopleFirst Staffing", placements: 19, commission: 8_60_000, status: "trialing" },
  { id: "r_005", name: "Deepak Joshi", agency: "HireRight India", placements: 24, commission: 10_80_000, status: "active" },
  { id: "r_006", name: "Aishwarya R", agency: "PeopleFirst Staffing", placements: 12, commission: 5_40_000, status: "past_due" },
  { id: "r_007", name: "Sumeet Patil", agency: "ApexRecruit", placements: 31, commission: 14_20_000, status: "active" },
  { id: "r_008", name: "Faisal Ahmed", agency: "ApexRecruit", placements: 16, commission: 7_10_000, status: "active" },
];

export function SuperAdminUsersRecruiters() {
  const [search, setSearch] = React.useState("");
  const filtered = RECRUITERS.filter(r => {
    const s = search.toLowerCase();
    return !s || r.name.toLowerCase().includes(s) || r.agency.toLowerCase().includes(s);
  });

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "trialing" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s.replace("_", " ")}</Badge>;
  };

  const totalCommission = RECRUITERS.reduce((s, r) => s + r.commission, 0);
  const totalPlacements = RECRUITERS.reduce((s, r) => s + r.placements, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruiters"
        description="All recruiters with agency affiliation, placements made, and commission earned."
        icon={<Icon name="Briefcase" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Recruiters" value={RECRUITERS.length} icon={<Icon name="Briefcase" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Agencies" value={new Set(RECRUITERS.map(r => r.agency)).size} icon={<Icon name="Building2" className="h-5 w-5" />} />
        <StatCard label="Placements" value={totalPlacements} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Commission Paid" value={formatCurrency(totalCommission)} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Recruiter Directory" description={`${filtered.length} of ${RECRUITERS.length}`}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or agency…" className="mb-3 h-9 max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recruiter</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Placements</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-xs">{r.agency}</TableCell>
                  <TableCell><Badge variant="secondary">{r.placements}</Badge></TableCell>
                  <TableCell className="font-medium">{formatCurrency(r.commission)}</TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing ${r.name}`)}>View</Button>
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
