"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";

interface Partner {
  id: string; name: string; type: string; region: string; mouStatus: string; mouExpiry: string; students: number; revenue: number;
}

const PARTNERS: Partner[] = [
  { id: "p_001", name: "SouthZone Franchise", type: "Franchise", region: "South", mouStatus: "active", mouExpiry: "2025-08-31", students: 1280, revenue: 84_50_000 },
  { id: "p_002", name: "EduFirst Colleges", type: "College Partner", region: "West", mouStatus: "active", mouExpiry: "2025-12-31", students: 940, revenue: 62_30_000 },
  { id: "p_003", name: "NorthStar Affiliates", type: "Affiliate", region: "North", mouStatus: "active", mouExpiry: "2025-06-30", students: 312, revenue: 18_40_000 },
  { id: "p_004", name: "EastBridge MOU", type: "MOU Partner", region: "East", mouStatus: "trialing", mouExpiry: "2024-12-31", students: 524, revenue: 28_90_000 },
  { id: "p_005", name: "MumbaiSkills Hub", type: "Franchise", region: "West", mouStatus: "active", mouExpiry: "2026-03-31", students: 768, revenue: 51_20_000 },
  { id: "p_006", name: "DelhiTech Partner", type: "College Partner", region: "North", mouStatus: "active", mouExpiry: "2025-09-30", students: 1102, revenue: 73_40_000 },
  { id: "p_007", name: "BangaloreLaunchpad", type: "Affiliate", region: "South", mouStatus: "expiring", mouExpiry: "2024-10-15", students: 248, revenue: 14_60_000 },
  { id: "p_008", name: "ChennaiSkills Coop", type: "MOU Partner", region: "South", mouStatus: "active", mouExpiry: "2025-11-30", students: 412, revenue: 22_40_000 },
];

export function SuperAdminPartnerDirectory() {
  const [search, setSearch] = React.useState("");
  const filtered = PARTNERS.filter(p => {
    const s = search.toLowerCase();
    return !s || p.name.toLowerCase().includes(s) || p.region.toLowerCase().includes(s) || p.type.toLowerCase().includes(s);
  });

  const mouBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "trialing" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Directory"
        description="All partner organizations with MoU status, expiry tracking, and revenue contribution."
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[{ label: "Export Directory", variant: "outline", onClick: () => toast.success("Directory exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Partners" value={PARTNERS.length} icon={<Icon name="Handshake" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active MoU" value={PARTNERS.filter(p => p.mouStatus === "active").length} icon={<Icon name="FileSignature" className="h-5 w-5" />} tone="success" />
        <StatCard label="Expiring Soon" value={PARTNERS.filter(p => p.mouStatus === "expiring").length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Total Revenue" value={formatCurrency(PARTNERS.reduce((s, p) => s + p.revenue, 0))} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard title="Partner Directory" description={`${filtered.length} of ${PARTNERS.length}`}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, type, or region…" className="mb-3 h-9 max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>MoU Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                  <TableCell className="text-xs">{p.region}</TableCell>
                  <TableCell>{mouBadge(p.mouStatus)}</TableCell>
                  <TableCell className="text-xs">{formatDate(p.mouExpiry)}</TableCell>
                  <TableCell>{p.students}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(p.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
