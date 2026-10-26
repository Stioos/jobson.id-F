"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { BadgeCheck, Search, Trophy, Users, TrendingUp, Briefcase, Building2, IndianRupee, Download } from "lucide-react";

type PlacementStatus = "placed" | "interviewed" | "offered" | "not_placed";

interface Placement {
  id: string;
  student: string;
  program: string;
  company: string;
  role: string;
  package: number; // annual CTC in INR
  offerDate: string;
  joiningDate: string;
  status: PlacementStatus;
}

const PLACEMENTS: Placement[] = [
  { id: "pl_001", student: "Aarav Sharma", program: "Full Stack Developer", company: "Infosys", role: "Systems Engineer", package: 720000, offerDate: "2024-08-12", joiningDate: "2024-09-15", status: "placed" },
  { id: "pl_002", student: "Diya Patel", program: "Data Analytics", company: "TCS", role: "Data Analyst", package: 850000, offerDate: "2024-08-18", joiningDate: "2024-10-01", status: "placed" },
  { id: "pl_003", student: "Vivaan Gupta", program: "Cloud Engineering", company: "Wipro", role: "Cloud Associate", package: 680000, offerDate: "2024-08-22", joiningDate: "2024-09-25", status: "placed" },
  { id: "pl_004", student: "Ananya Iyer", program: "UI/UX Design", company: "Zoho", role: "Product Designer", package: 920000, offerDate: "2024-09-02", joiningDate: "2024-10-10", status: "placed" },
  { id: "pl_005", student: "Reyansh Reddy", program: "Full Stack Developer", company: "Tech Mahindra", role: "Software Trainee", package: 600000, offerDate: "2024-09-10", joiningDate: "", status: "offered" },
  { id: "pl_006", student: "Ishaan Verma", program: "Cyber Security", company: "HCL", role: "Security Analyst", package: 750000, offerDate: "2024-09-14", joiningDate: "", status: "offered" },
  { id: "pl_007", student: "Saanvi Nair", program: "Data Analytics", company: "Cognizant", role: "Associate Analyst", package: 0, offerDate: "", joiningDate: "", status: "interviewed" },
  { id: "pl_008", student: "Arjun Mehta", program: "Cloud Engineering", company: "Accenture", role: "Cloud Engineer", package: 0, offerDate: "", joiningDate: "", status: "interviewed" },
  { id: "pl_009", student: "Myra Khanna", program: "Digital Marketing", company: "—", role: "—", package: 0, offerDate: "", joiningDate: "", status: "not_placed" },
  { id: "pl_010", student: "Kabir Singh", program: "Full Stack Developer", company: "—", role: "—", package: 0, offerDate: "", joiningDate: "", status: "not_placed" },
];

const SALARY_BANDS = [
  { band: "0 – 4 L", min: 0, max: 400000, count: 0 },
  { band: "4 – 6 L", min: 400000, max: 600000, count: 0 },
  { band: "6 – 8 L", min: 600000, max: 800000, count: 0 },
  { band: "8 – 10 L", min: 800000, max: 1000000, count: 0 },
  { band: "10 L+", min: 1000000, max: Infinity, count: 0 },
];

const STATUS_LABEL: Record<PlacementStatus, string> = {
  placed: "Placed",
  interviewed: "Interviewed",
  offered: "Offered",
  not_placed: "Not Placed",
};

export function PartnerPlacements() {
  const partner = CURRENT_PARTNER;
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filtered = PLACEMENTS.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !`${p.student} ${p.program} ${p.company} ${p.role}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Funnel KPIs (based on full cohort, not just filtered)
  const totalEligible = PLACEMENTS.length;
  const interviewed = PLACEMENTS.filter((p) => p.status !== "not_placed").length;
  const offered = PLACEMENTS.filter((p) => p.status === "placed" || p.status === "offered").length;
  const joined = PLACEMENTS.filter((p) => p.status === "placed").length;
  const placementRate = totalEligible > 0 ? Math.round((joined / totalEligible) * 100) : 0;

  // Salary band distribution
  const bands = SALARY_BANDS.map((b) => ({
    ...b,
    count: PLACEMENTS.filter((p) => p.package > b.min && p.package <= b.max).length,
  }));
  const maxBand = Math.max(1, ...bands.map((b) => b.count));

  // Company-wise matrix
  const companyMap = new Map<string, { total: number; placed: number; avgPkg: number }>();
  PLACEMENTS.forEach((p) => {
    if (p.company === "—") return;
    const existing = companyMap.get(p.company) ?? { total: 0, placed: 0, avgPkg: 0 };
    existing.total += 1;
    if (p.status === "placed") {
      existing.placed += 1;
      existing.avgPkg += p.package;
    }
    companyMap.set(p.company, existing);
  });
  const companies = Array.from(companyMap.entries())
    .map(([name, v]) => ({ name, ...v, avgPkg: v.placed > 0 ? Math.round(v.avgPkg / v.placed) : 0 }))
    .sort((a, b) => b.total - a.total);

  function exportReport() {
    toast.success("Placement report exported", { description: "placements-2024.xlsx is being prepared for download." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placement Tracking"
        description={`${partner.name} — placement funnel, salary distribution and company-wise hiring matrix for the current placement cycle.`}
        icon={<Icon name="BadgeCheck" className="h-6 w-6" />}
        actions={[
          { label: "Export Report", icon: "Download", variant: "outline", onClick: exportReport },
        ]}
      />
      <PartnerDisclaimer />

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Eligible" value={totalEligible} icon={<Users className="h-5 w-5" />} tone="brand" hint="Students in placement cycle" />
        <StatCard label="Interviewed" value={interviewed} icon={<Briefcase className="h-5 w-5" />} tone="default" hint={`${Math.round((interviewed / totalEligible) * 100)}% of cohort`} />
        <StatCard label="Offered" value={offered} icon={<Trophy className="h-5 w-5" />} tone="warning" hint={`${Math.round((offered / totalEligible) * 100)}% conversion`} />
        <StatCard label="Joined" value={joined} icon={<Building2 className="h-5 w-5" />} tone="success" hint="Active placements" />
        <StatCard label="Placement Rate" value={`${placementRate}%`} icon={<TrendingUp className="h-5 w-5" />} tone="success" delta={{ value: "+8% vs last cycle", positive: true }} />
      </div>

      {/* Funnel + Salary band */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Placement Funnel" description="Cohort progression through the placement cycle">
          <div className="space-y-3">
            {[
              { label: "Eligible", value: totalEligible, pct: 100, tone: "bg-brand" },
              { label: "Interviewed", value: interviewed, pct: (interviewed / totalEligible) * 100, tone: "bg-emerald-500" },
              { label: "Offered", value: offered, pct: (offered / totalEligible) * 100, tone: "bg-amber-500" },
              { label: "Joined", value: joined, pct: (joined / totalEligible) * 100, tone: "bg-teal-500" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{row.label}</span>
                  <span className="text-muted-foreground">{row.value} students · {Math.round(row.pct)}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${row.tone} transition-all`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Salary Band Distribution" description="CTC distribution across placed students">
          <div className="space-y-3 pt-2">
            {bands.map((b) => (
              <div key={b.band} className="flex items-center gap-3">
                <span className="w-16 text-xs font-medium text-muted-foreground shrink-0">{b.band}</span>
                <div className="flex-1 h-6 rounded-md bg-muted overflow-hidden relative">
                  <div
                    className="h-full bg-brand/80 transition-all flex items-center justify-end pr-2"
                    style={{ width: `${(b.count / maxBand) * 100}%`, minWidth: b.count > 0 ? "2rem" : "0" }}
                  >
                    {b.count > 0 && <span className="text-[10px] font-bold text-white">{b.count}</span>}
                  </div>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground pt-1">
              Average package: <span className="font-semibold text-brand">{formatCurrency(PLACEMENTS.filter(p => p.status === "placed").reduce((s, p) => s + p.package, 0) / Math.max(1, joined))}</span>
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students, companies, roles..."
                className="h-9 w-full pl-8 sm:w-72"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="not_placed">Not Placed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} of {PLACEMENTS.length} records</span>
        </div>
      </Card>

      {/* Placement Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Placement Records</CardTitle>
          <CardDescription>Detailed placement data per student</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course / Program</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Offer Date</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No records match your filters.</TableCell></TableRow>
              ) : filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.student}</TableCell>
                  <TableCell className="text-xs">{p.program}</TableCell>
                  <TableCell>{p.company === "—" ? <span className="text-muted-foreground">—</span> : p.company}</TableCell>
                  <TableCell className="text-xs">{p.role === "—" ? <span className="text-muted-foreground">—</span> : p.role}</TableCell>
                  <TableCell className="font-semibold text-brand">{p.package > 0 ? formatCurrency(p.package) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-xs">{p.offerDate ? formatDate(p.offerDate) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-xs">{p.joiningDate ? formatDate(p.joiningDate) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Company-wise matrix */}
      <SectionCard title="Company-wise Placement Matrix" description="Hiring performance by recruiting partner">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Hired From Us</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Conversion</TableHead>
              <TableHead>Avg Package</TableHead>
              <TableHead>Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No company-wise data.</TableCell></TableRow>
            ) : companies.map((c) => (
              <TableRow key={c.name}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.total}</TableCell>
                <TableCell>{c.placed}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={(c.placed / c.total) * 100} className="h-1.5 w-12" />
                    <span className="text-xs text-muted-foreground">{Math.round((c.placed / c.total) * 100)}%</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-brand">{c.avgPkg > 0 ? formatCurrency(c.avgPkg) : <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{Math.round((c.total / interviewed) * 100)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
