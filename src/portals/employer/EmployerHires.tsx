"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { Download, Users2, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

interface Hire {
  id: string;
  name: string;
  jobTitle: string;
  hireDate: string;
  onboardingStatus: "pending" | "in_progress" | "completed";
  manager: string;
  location: string;
}

const HIRES: Hire[] = [
  { id: "h1", name: "Kavya Reddy", jobTitle: "Senior Product Manager — Payments", hireDate: "2024-09-15", onboardingStatus: "completed", manager: "Vikram Joshi", location: "Mumbai" },
  { id: "h2", name: "Suresh Kumar", jobTitle: "Backend Engineer — Distributed Systems (Go)", hireDate: "2024-08-22", onboardingStatus: "completed", manager: "Anika Verma", location: "Bengaluru" },
  { id: "h3", name: "Neha Kapoor", jobTitle: "Senior Frontend Engineer", hireDate: "2024-10-01", onboardingStatus: "in_progress", manager: "Rohan Mehta", location: "Bengaluru" },
  { id: "h4", name: "Arjun Patel", jobTitle: "DevOps Engineer", hireDate: "2024-10-10", onboardingStatus: "in_progress", manager: "Anika Verma", location: "Hyderabad" },
  { id: "h5", name: "Priya Sharma", jobTitle: "Product Designer", hireDate: "2024-10-18", onboardingStatus: "pending", manager: "Rohan Mehta", location: "Bengaluru" },
  { id: "h6", name: "Vikram Rao", jobTitle: "Engineering Manager — Platform", hireDate: "2024-07-30", onboardingStatus: "completed", manager: "Rohan Mehta", location: "Bengaluru" },
  { id: "h7", name: "Ananya Das", jobTitle: "Data Scientist", hireDate: "2024-10-22", onboardingStatus: "pending", manager: "Anika Verma", location: "Bengaluru" },
];

export function EmployerHires() {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const filtered = statusFilter === "all" ? HIRES : HIRES.filter((h) => h.onboardingStatus === statusFilter);

  const exportCsv = () => {
    const rows = [["Name", "Job", "Hire date", "Status", "Manager", "Location"], ...HIRES.map((h) => [h.name, h.jobTitle, h.hireDate, h.onboardingStatus, h.manager, h.location])];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    toast.success("CSV exported", { description: `${csv.length} bytes generated (demo)` });
  };

  const conversionRate = Math.round((HIRES.length / (HIRES.length + 8)) * 100); // mock
  const avgTimeToHire = 34;
  const retention90 = 96;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees & Hires"
        description="Track recent hires, onboarding status, and conversion metrics"
        actions={[{ label: "Export CSV", icon: "Download", variant: "outline", onClick: exportCsv }]}
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total hires (YTD)" value={HIRES.length} icon={<Users2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Offer-to-hire conversion" value={`${conversionRate}%`} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg time-to-hire" value={`${avgTimeToHire} days`} icon={<Clock className="h-5 w-5" />} />
        <StatCard label="90-day retention" value={`${retention90}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
      </div>

      <div className="flex items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary">{filtered.length} hires</Badge>
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Hire date</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((h) => (
                <TableRow key={h.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={h.name} size="xs" />
                      <span className="text-sm font-medium">{h.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{h.jobTitle}</TableCell>
                  <TableCell className="text-sm">{formatDate(h.hireDate)}</TableCell>
                  <TableCell><StatusBadge status={h.onboardingStatus} /></TableCell>
                  <TableCell className="text-sm">{h.manager}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{h.location}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewing onboarding for ${h.name}`)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Onboarding pipeline" description="Where new hires are in their journey">
        <div className="grid gap-3 sm:grid-cols-3">
          {(["pending", "in_progress", "completed"] as const).map((s) => {
            const count = HIRES.filter((h) => h.onboardingStatus === s).length;
            return (
              <Card key={s}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground capitalize">{s.replace("_", " ")}</p>
                  <p className="text-2xl font-semibold mt-1">{count}</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${s === "completed" ? "bg-emerald-500" : s === "in_progress" ? "bg-amber-500" : "bg-slate-400"}`} style={{ width: `${(count / HIRES.length) * 100}%` }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
