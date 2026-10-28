"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Cand {
  id: string; name: string; email: string; location: string; experience: string; applications: number; status: string;
}

const CANDIDATES: Cand[] = [
  { id: "c_001", name: "Priya Nair", email: "priya.nair@gmail.com", location: "Bengaluru, IN", experience: "5.5 yrs", applications: 18, status: "active" },
  { id: "c_002", name: "Rahul Khanna", email: "rahul.k@gmail.com", location: "Mumbai, IN", experience: "8 yrs", applications: 24, status: "active" },
  { id: "c_003", name: "Ananya Gupta", email: "ananya.g@gmail.com", location: "Pune, IN", experience: "2 yrs", applications: 9, status: "active" },
  { id: "c_004", name: "Vikas Reddy", email: "vikas.reddy@gmail.com", location: "Hyderabad, IN", experience: "11 yrs", applications: 31, status: "active" },
  { id: "c_005", name: "Sneha Iyer", email: "sneha.iyer@gmail.com", location: "Chennai, IN", experience: "4 yrs", applications: 12, status: "hired" },
  { id: "c_006", name: "Karthik Menon", email: "karthik.m@gmail.com", location: "Kochi, IN", experience: "6.5 yrs", applications: 22, status: "active" },
  { id: "c_007", name: "Deepa Sharma", email: "deepa.sharma@gmail.com", location: "Delhi, IN", experience: "1.5 yrs", applications: 7, status: "inactive" },
  { id: "c_008", name: "Arjun Nair", email: "arjun.nair@gmail.com", location: "Bengaluru, IN", experience: "9 yrs", applications: 28, status: "active" },
  { id: "c_009", name: "Pooja Desai", email: "pooja.d@gmail.com", location: "Ahmedabad, IN", experience: "3 yrs", applications: 14, status: "active" },
  { id: "c_010", name: "Rohan Das", email: "rohan.das@gmail.com", location: "Kolkata, IN", experience: "7 yrs", applications: 19, status: "hired" },
];

export function SuperAdminUsersCandidates() {
  const [search, setSearch] = React.useState("");
  const filtered = CANDIDATES.filter(c => {
    const s = search.toLowerCase();
    return !s || c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.location.toLowerCase().includes(s);
  });

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "hired" ? "bg-teal-500/15 text-teal-700 border-teal-500/30"
      : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        description="All candidate profiles across the platform with application activity and status."
        icon={<Icon name="User" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Candidates" value={CANDIDATES.length} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={CANDIDATES.filter(c => c.status === "active").length} icon={<Icon name="Activity" className="h-5 w-5" />} tone="success" />
        <StatCard label="Hired" value={CANDIDATES.filter(c => c.status === "hired").length} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} />
        <StatCard label="Avg Applications" value={(CANDIDATES.reduce((s, c) => s + c.applications, 0) / CANDIDATES.length).toFixed(1)} icon={<Icon name="FileText" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Candidate Directory" description={`${filtered.length} of ${CANDIDATES.length}`}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates…" className="mb-3 h-9 max-w-xs" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </TableCell>
                  <TableCell className="text-xs">{c.location}</TableCell>
                  <TableCell>{c.experience}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{c.applications}</Badge>
                  </TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing ${c.name}`)}>View</Button>
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
