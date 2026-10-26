"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader, SectionCard, Card, CardContent, StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";

type SponsorType = "Full" | "Partial" | "Seat-Specific";
type SponsorStatus = "Active" | "Completed" | "Pending Renewal" | "Lapsed";

interface Sponsor {
  id: string;
  company: string;
  type: SponsorType;
  amount: number;
  students: number;
  program: string;
  startDate: string;
  endDate: string;
  status: SponsorStatus;
  renewalDate?: string;
}

const SEED_SPONSORS: Sponsor[] = [
  { id: "s1", company: "Infosys Foundation", type: "Full", amount: 5000000, students: 50, program: "Full-Stack Developer Bootcamp", startDate: "2024-07-01", endDate: "2025-06-30", status: "Active", renewalDate: "2025-04-30" },
  { id: "s2", company: "TCS CSR Trust", type: "Partial", amount: 1800000, students: 24, program: "Data Engineering Cohort", startDate: "2024-08-15", endDate: "2025-02-14", status: "Active" },
  { id: "s3", company: "Wipro Cares", type: "Seat-Specific", amount: 960000, students: 12, program: "Cloud DevOps Engineer", startDate: "2024-09-01", endDate: "2024-12-31", status: "Completed" },
  { id: "s4", company: "Tech Mahindra Foundation", type: "Full", amount: 3200000, students: 40, program: "AI/ML Specialist Track", startDate: "2024-06-01", endDate: "2025-05-31", status: "Active", renewalDate: "2025-03-15" },
  { id: "s5", company: "Accenture CSR", type: "Partial", amount: 1200000, students: 15, program: "Cybersecurity Analyst", startDate: "2023-09-01", endDate: "2024-08-31", status: "Pending Renewal", renewalDate: "2024-11-30" },
];

interface SponsoredStudent {
  id: string;
  name: string;
  sponsor: string;
  amountUtilized: number;
  program: string;
  status: "Enrolled" | "Completed" | "Placed" | "Dropped";
  placedAt?: string;
  salary?: number;
}

const SEED_STUDENTS: SponsoredStudent[] = [
  { id: "st1", name: "Ankit Yadav", sponsor: "Infosys Foundation", amountUtilized: 100000, program: "Full-Stack Developer Bootcamp", status: "Placed", placedAt: "Cognizant", salary: 720000 },
  { id: "st2", name: "Bhavna Solanki", sponsor: "Infosys Foundation", amountUtilized: 100000, program: "Full-Stack Developer Bootcamp", status: "Placed", placedAt: "Capgemini", salary: 680000 },
  { id: "st3", name: "Chetan Pawar", sponsor: "TCS CSR Trust", amountUtilized: 75000, program: "Data Engineering Cohort", status: "Enrolled" },
  { id: "st4", name: "Deepika Raj", sponsor: "Wipro Cares", amountUtilized: 80000, program: "Cloud DevOps Engineer", status: "Completed" },
  { id: "st5", name: "Eshaan Khan", sponsor: "Tech Mahindra Foundation", amountUtilized: 80000, program: "AI/ML Specialist Track", status: "Placed", placedAt: "Persistent", salary: 850000 },
  { id: "st6", name: "Farida Sheikh", sponsor: "Infosys Foundation", amountUtilized: 100000, program: "Full-Stack Developer Bootcamp", status: "Placed", placedAt: "Infosys", salary: 750000 },
  { id: "st7", name: "Gaurav Das", sponsor: "TCS CSR Trust", amountUtilized: 75000, program: "Data Engineering Cohort", status: "Enrolled" },
  { id: "st8", name: "Heena Bano", sponsor: "Accenture CSR", amountUtilized: 80000, program: "Cybersecurity Analyst", status: "Dropped" },
  { id: "st9", name: "Imran Qureshi", sponsor: "Tech Mahindra Foundation", amountUtilized: 80000, program: "AI/ML Specialist Track", status: "Placed", placedAt: "TCS Digital", salary: 720000 },
  { id: "st10", name: "Jaya Menon", sponsor: "Wipro Cares", amountUtilized: 80000, program: "Cloud DevOps Engineer", status: "Completed" },
];

const STATUS_TONE: Record<SponsorStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Completed: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  "Pending Renewal": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Lapsed: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const STUDENT_STATUS_TONE: Record<SponsoredStudent["status"], string> = {
  Enrolled: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  Completed: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  Placed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Dropped: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export function TrainingCorporateSponsorship() {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>(SEED_SPONSORS);
  const [students] = React.useState<SponsoredStudent[]>(SEED_STUDENTS);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<{ company: string; type: SponsorType; amount: number; students: number; program: string; endDate: string }>({
    company: "", type: "Full", amount: 0, students: 0, program: "", endDate: "",
  });

  const addSponsor = () => {
    if (!form.company || !form.amount || !form.program) {
      toast.error("Company, amount and program are required");
      return;
    }
    const newSponsor: Sponsor = {
      id: `s${Date.now()}`,
      company: form.company,
      type: form.type,
      amount: form.amount,
      students: form.students,
      program: form.program,
      startDate: new Date().toISOString(),
      endDate: form.endDate,
      status: "Active",
    };
    setSponsors([newSponsor, ...sponsors]);
    setForm({ company: "", type: "Full", amount: 0, students: 0, program: "", endDate: "" });
    setOpen(false);
    toast.success(`Sponsor "${newSponsor.company}" added`);
  };

  const totalSponsored = sponsors.reduce((s, sp) => s + sp.amount, 0);
  const totalStudents = sponsors.reduce((s, sp) => s + sp.students, 0);
  const placedStudents = students.filter((s) => s.status === "Placed").length;
  const placementRate = Math.round((placedStudents / students.length) * 100);
  const avgSalary = students.filter((s) => s.salary).reduce((sum, s) => sum + (s.salary ?? 0), 0) / (students.filter((s) => s.salary).length || 1);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Corporate Sponsorship"
        description="Track corporate sponsorships, sponsored students, ROI outcomes and renewal cycles."
        icon={<Icon name="Handshake" className="h-6 w-6" />}
        actions={[{ label: "Add Sponsor", onClick: () => setOpen(true) }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Sponsored" value={formatCurrency(totalSponsored)} icon={<Icon name="Wallet" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active Sponsors" value={sponsors.filter((s) => s.status === "Active").length} icon={<Icon name="Handshake" className="h-5 w-5" />} tone="success" />
        <StatCard label="Students Sponsored" value={totalStudents} icon={<Icon name="Users" className="h-5 w-5" />} tone="default" />
        <StatCard label="Placement Rate" value={`${placementRate}%`} hint={`Avg salary: ${formatCurrency(avgSalary)}`} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Sponsors" description="Corporate sponsors with type, amount, students and renewal status.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Renewal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sponsors.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.company}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs bg-brand/5">{s.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(s.amount)}</TableCell>
                  <TableCell className="text-center">{s.students}</TableCell>
                  <TableCell className="text-sm">{s.program}</TableCell>
                  <TableCell className="text-xs">{formatDate(s.startDate)} → {formatDate(s.endDate)}</TableCell>
                  <TableCell><Badge className={STATUS_TONE[s.status]}>{s.status}</Badge></TableCell>
                  <TableCell className="text-xs">
                    {s.renewalDate ? (
                      <span className={new Date(s.renewalDate).getTime() - Date.now() < 30 * 86400000 ? "text-amber-600 font-medium" : ""}>
                        {formatDate(s.renewalDate)}
                      </span>
                    ) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Sponsored Students" description="Individual students mapped to sponsors with utilization and outcome.">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Sponsor</TableHead>
                <TableHead>Program</TableHead>
                <TableHead className="text-right">Utilized</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed At</TableHead>
                <TableHead className="text-right">Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-sm">{s.name}</TableCell>
                  <TableCell className="text-xs">{s.sponsor}</TableCell>
                  <TableCell className="text-xs">{s.program}</TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(s.amountUtilized)}</TableCell>
                  <TableCell><Badge className={STUDENT_STATUS_TONE[s.status]}>{s.status}</Badge></TableCell>
                  <TableCell className="text-xs">{s.placedAt ?? "—"}</TableCell>
                  <TableCell className="text-right text-sm font-medium">{s.salary ? formatCurrency(s.salary) : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Sponsor ROI Report" description="Placement outcomes from sponsored batches.">
          <div className="space-y-3">
            {sponsors.map((sp) => {
              const sponsorStudents = students.filter((s) => s.sponsor === sp.company);
              const placed = sponsorStudents.filter((s) => s.status === "Placed").length;
              const totalSalary = sponsorStudents.filter((s) => s.salary).reduce((sum, s) => sum + (s.salary ?? 0), 0);
              const roi = sp.amount > 0 ? ((totalSalary - sp.amount) / sp.amount) * 100 : 0;
              return (
                <Card key={sp.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{sp.company}</p>
                      <p className="text-xs text-muted-foreground">{sp.program}</p>
                    </div>
                    <Badge className={roi > 0 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}>
                      ROI {roi > 0 ? "+" : ""}{roi.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div><p className="text-muted-foreground">Sponsored</p><p className="font-medium">{sponsorStudents.length}</p></div>
                    <div><p className="text-muted-foreground">Placed</p><p className="font-medium text-emerald-600">{placed}</p></div>
                    <div><p className="text-muted-foreground">Y1 Salary</p><p className="font-medium">{formatCurrency(totalSalary)}</p></div>
                  </div>
                </Card>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Renewal Tracking" description="Upcoming sponsor renewals.">
          <div className="space-y-3">
            {sponsors.filter((s) => s.renewalDate).sort((a, b) => new Date(a.renewalDate!).getTime() - new Date(b.renewalDate!).getTime()).map((s) => {
              const days = Math.ceil((new Date(s.renewalDate!).getTime() - Date.now()) / 86400000);
              return (
                <Card key={s.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{s.company}</p>
                      <p className="text-xs text-muted-foreground">Renewal: {formatDate(s.renewalDate!)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={days < 30 ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : days < 60 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"}>
                        {days > 0 ? `${days} days left` : "Overdue"}
                      </Badge>
                      <Button size="sm" variant="outline" className="mt-1 w-full" onClick={() => toast.success(`Renewal reminder sent to ${s.company}`)}>
                        Send Reminder
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
            {sponsors.filter((s) => s.renewalDate).length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming renewals.</p>
            )}
          </div>
        </SectionCard>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Sponsor</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Infosys Foundation" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Sponsorship Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as SponsorType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full">Full</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Seat-Specific">Seat-Specific</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Amount (₹)</Label>
                <Input type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Students Sponsored</Label>
                <Input type="number" value={form.students || ""} onChange={(e) => setForm({ ...form, students: +e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Program</Label>
              <Input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder="e.g. Full-Stack Developer Bootcamp" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addSponsor}>Add Sponsor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
