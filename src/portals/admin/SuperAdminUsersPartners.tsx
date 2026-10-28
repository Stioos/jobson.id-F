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

interface Partner {
  id: string; name: string; type: string; region: string; students: number; revenue: number; status: string;
}

const PARTNERS: Partner[] = [
  { id: "p_001", name: "SouthZone Franchise", type: "Franchise", region: "South", students: 1280, revenue: 84_50_000, status: "active" },
  { id: "p_002", name: "EduFirst Colleges", type: "College Partner", region: "West", students: 940, revenue: 62_30_000, status: "active" },
  { id: "p_003", name: "NorthStar Affiliates", type: "Affiliate", region: "North", students: 312, revenue: 18_40_000, status: "active" },
  { id: "p_004", name: "EastBridge MOU", type: "MOU Partner", region: "East", students: 524, revenue: 28_90_000, status: "trialing" },
  { id: "p_005", name: "MumbaiSkills Hub", type: "Franchise", region: "West", students: 768, revenue: 51_20_000, status: "active" },
  { id: "p_006", name: "DelhiTech Partner", type: "College Partner", region: "North", students: 1102, revenue: 73_40_000, status: "active" },
  { id: "p_007", name: "BangaloreLaunchpad", type: "Affiliate", region: "South", students: 248, revenue: 14_60_000, status: "past_due" },
];

export function SuperAdminUsersPartners() {
  const [search, setSearch] = React.useState("");
  const filtered = PARTNERS.filter(p => {
    const s = search.toLowerCase();
    return !s || p.name.toLowerCase().includes(s) || p.region.toLowerCase().includes(s) || p.type.toLowerCase().includes(s);
  });

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "trialing" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s.replace("_", " ")}</Badge>;
  };

  const totalRevenue = PARTNERS.reduce((s, p) => s + p.revenue, 0);
  const totalStudents = PARTNERS.reduce((s, p) => s + p.students, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partners"
        description="All partner organizations (franchise, college, MOU, affiliate) with student base and revenue contribution."
        icon={<Icon name="Handshake" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Partners" value={PARTNERS.length} icon={<Icon name="Handshake" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={PARTNERS.filter(p => p.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Students" value={totalStudents} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Partner Directory" description={`${filtered.length} of ${PARTNERS.length}`}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, type or region…" className="mb-3 h-9 max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                  <TableCell className="text-xs">{p.region}</TableCell>
                  <TableCell>{p.students}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(p.revenue)}</TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing ${p.name}`)}>View</Button>
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
