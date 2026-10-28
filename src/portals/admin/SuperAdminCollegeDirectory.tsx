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

interface College {
  id: string;
  name: string;
  location: string;
  region: "North" | "South" | "East" | "West" | "Central";
  type: "Engineering" | "Management" | "Arts & Science" | "Polytechnic" | "University";
  mouStatus: "active" | "expiring" | "expired" | "pending";
  partner: string;
  students: number;
  placementRate: number;
  revenue: number;
}

const COLLEGES: College[] = [
  { id: "col_1", name: "IIT Delhi — Extension", location: "New Delhi", region: "North", type: "Engineering", mouStatus: "active", partner: "Partner North Pvt Ltd", students: 1840, placementRate: 92, revenue: 4_820_000 },
  { id: "col_2", name: "BITS Pilani Off-Campus", location: "Pilani", region: "North", type: "Engineering", mouStatus: "active", partner: "Partner North Pvt Ltd", students: 1240, placementRate: 88, revenue: 3_240_000 },
  { id: "col_3", name: "VIT Vellore (Partner Wing)", location: "Vellore", region: "South", type: "University", mouStatus: "active", partner: "South Talent Solutions", students: 2840, placementRate: 84, revenue: 6_120_000 },
  { id: "col_4", name: "Christ University Block", location: "Bengaluru", region: "South", type: "Management", mouStatus: "expiring", partner: "South Talent Solutions", students: 920, placementRate: 78, revenue: 2_140_000 },
  { id: "col_5", name: "St. Xavier's Mumbai", location: "Mumbai", region: "West", type: "Arts & Science", mouStatus: "active", partner: "West Skill Hub", students: 612, placementRate: 72, revenue: 1_420_000 },
  { id: "col_6", name: "COEP Polytechnic", location: "Pune", region: "West", type: "Polytechnic", mouStatus: "expired", partner: "West Skill Hub", students: 420, placementRate: 64, revenue: 820_000 },
  { id: "col_7", name: "Jadavpur University Wing", location: "Kolkata", region: "East", type: "University", mouStatus: "active", partner: "East Career Network", students: 1820, placementRate: 82, revenue: 3_820_000 },
  { id: "col_8", name: "IIM Bangalore (Exec)", location: "Bengaluru", region: "South", type: "Management", mouStatus: "pending", partner: "South Talent Solutions", students: 240, placementRate: 96, revenue: 1_240_000 },
  { id: "col_9", name: "Delhi University Campus", location: "New Delhi", region: "North", type: "University", mouStatus: "active", partner: "Partner North Pvt Ltd", students: 3240, placementRate: 76, revenue: 5_820_000 },
  { id: "col_10", name: "Anna University Ext.", location: "Chennai", region: "South", type: "Engineering", mouStatus: "active", partner: "South Talent Solutions", students: 2120, placementRate: 80, revenue: 4_420_000 },
];

export function SuperAdminCollegeDirectory() {
  const [region, setRegion] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [q, setQ] = React.useState("");

  const filtered = COLLEGES.filter(c =>
    (region === "all" || c.region === region) &&
    (type === "all" || c.type === type) &&
    (status === "all" || c.mouStatus === status) &&
    (q === "" || (c.name + c.location + c.partner).toLowerCase().includes(q.toLowerCase()))
  );

  const totalStudents = COLLEGES.reduce((s, c) => s + c.students, 0);
  const totalRevenue = COLLEGES.reduce((s, c) => s + c.revenue, 0);
  const avgPlacement = Math.round(COLLEGES.reduce((s, c) => s + c.placementRate, 0) / COLLEGES.length);

  const mouBadge = (s: College["mouStatus"]) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "expiring" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : s === "pending" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="College Directory"
        description="All colleges across the platform — name, location, type, MoU status, partner, students enrolled, placement rate, and revenue. Filter by region/type/status and compare colleges."
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[{ label: "Add College", variant: "outline", onClick: () => toast.info("Opening new college form") }, { label: "Export", variant: "outline", onClick: () => toast.success("College directory exported (CSV)") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Colleges" value={COLLEGES.length} icon={<Icon name="Building2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Students Enrolled" value={totalStudents.toLocaleString("en-IN")} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Avg Placement" value={`${avgPlacement}%`} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="success" />
        <StatCard label="Revenue (FY)" value={`₹${(totalRevenue / 100000).toFixed(2)} L`} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Filters" description="Filter by region, type, MoU status, or search">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Region</label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["all", "North", "South", "East", "West", "Central"].map(r => <SelectItem key={r} value={r}>{r === "all" ? "All Regions" : r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["all", "Engineering", "Management", "Arts & Science", "Polytechnic", "University"].map(t => <SelectItem key={t} value={t}>{t === "all" ? "All Types" : t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">MoU Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["all", "active", "expiring", "expired", "pending"].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Search</label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="college / location / partner" className="mt-1" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title={`College Directory (${filtered.length})`} description="All colleges across platform" contentClassName="p-0">
        {filtered.length === 0 ? (
          <EmptyState className="m-4" icon={<Icon name="Building2" className="h-5 w-5" />} title="No colleges match filters" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>MoU</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-xs">{c.location} <span className="text-muted-foreground">({c.region})</span></TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{c.type}</Badge></TableCell>
                  <TableCell>{mouBadge(c.mouStatus)}</TableCell>
                  <TableCell className="text-xs">{c.partner}</TableCell>
                  <TableCell className="text-xs">{c.students.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${c.placementRate >= 85 ? "bg-emerald-500" : c.placementRate >= 75 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${c.placementRate}%` }} />
                      </div>
                      <span className="text-xs">{c.placementRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">₹{(c.revenue / 100000).toFixed(1)} L</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      <SectionCard title="Top Performers by Region" description="Best placement rate per region">
        <div className="grid gap-3 md:grid-cols-5">
          {(["North", "South", "East", "West", "Central"] as const).map(r => {
            const regionColleges = COLLEGES.filter(c => c.region === r);
            if (regionColleges.length === 0) return (
              <div key={r} className="rounded-lg border bg-card p-3">
                <p className="text-xs font-medium">{r}</p>
                <p className="mt-1 text-xs text-muted-foreground">No colleges</p>
              </div>
            );
            const top = regionColleges.sort((a, b) => b.placementRate - a.placementRate)[0];
            return (
              <div key={r} className="rounded-lg border bg-card p-3">
                <p className="text-xs font-medium">{r}</p>
                <p className="mt-1 truncate text-xs font-semibold">{top.name}</p>
                <p className="mt-1 text-xs text-emerald-600">{top.placementRate}% placement</p>
                <p className="text-[10px] text-muted-foreground">{top.students.toLocaleString("en-IN")} students</p>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
