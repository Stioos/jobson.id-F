"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { formatCurrency, formatDate } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  Award, Plus, CheckCircle2, Clock, Users, Coins,
} from "lucide-react";

interface ScholarshipProgram {
  id: string;
  name: string;
  eligibility: string;
  maxAmount: number;
  utilized: number;
  beneficiaries: number;
  deadline: string;
  status: "active" | "closed" | "draft";
}

interface ScholarshipApplication {
  id: string;
  student: string;
  programId: string;
  programName: string;
  requestedAmount: number;
  appliedDate: string;
  status: "pending" | "under_review" | "approved" | "rejected" | "awarded";
  score?: number;
  income?: number;
  note?: string;
}

const PROGRAMS: ScholarshipProgram[] = [
  { id: "p1", name: "Merit Excellence Scholarship", eligibility: "Top 10% academic performers; min 85% aggregate", maxAmount: 50000, utilized: 38000, beneficiaries: 12, deadline: "2024-09-30", status: "active" },
  { id: "p2", name: "Need-Based Aid", eligibility: "Family income < ₹4L per annum; valid income certificate", maxAmount: 35000, utilized: 28000, beneficiaries: 18, deadline: "2024-08-31", status: "active" },
  { id: "p3", name: "Women in Tech", eligibility: "Female students pursuing CS/IT/DS courses", maxAmount: 40000, utilized: 24000, beneficiaries: 9, deadline: "2024-10-15", status: "active" },
  { id: "p4", name: "Veteran Scholarship", eligibility: "Ex-servicemen or their dependents", maxAmount: 60000, utilized: 12000, beneficiaries: 3, deadline: "2024-12-31", status: "active" },
  { id: "p5", name: "COVID Relief Aid (2023)", eligibility: "Students who lost a parent during pandemic", maxAmount: 45000, utilized: 45000, beneficiaries: 15, deadline: "2023-12-31", status: "closed" },
];

const APPLICATIONS: ScholarshipApplication[] = [
  { id: "a1", student: "Aarav Sharma", programId: "p1", programName: "Merit Excellence Scholarship", requestedAmount: 50000, appliedDate: "2024-08-10", status: "pending", score: 92, income: 600000 },
  { id: "a2", student: "Diya Patel", programId: "p3", programName: "Women in Tech", requestedAmount: 40000, appliedDate: "2024-08-08", status: "under_review", score: 88, income: 550000 },
  { id: "a3", student: "Vivaan Reddy", programId: "p2", programName: "Need-Based Aid", requestedAmount: 35000, appliedDate: "2024-08-05", status: "approved", score: 76, income: 320000 },
  { id: "a4", student: "Ananya Iyer", programId: "p3", programName: "Women in Tech", requestedAmount: 30000, appliedDate: "2024-08-01", status: "awarded", score: 91, income: 480000, note: "Awarded full amount" },
  { id: "a5", student: "Reyansh Gupta", programId: "p1", programName: "Merit Excellence Scholarship", requestedAmount: 45000, appliedDate: "2024-07-28", status: "rejected", score: 71, income: 800000, note: "Below 85% threshold" },
  { id: "a6", student: "Ishaan Mehta", programId: "p4", programName: "Veteran Scholarship", requestedAmount: 60000, appliedDate: "2024-07-25", status: "under_review", score: 84, income: 450000 },
  { id: "a7", student: "Saanvi Nair", programId: "p2", programName: "Need-Based Aid", requestedAmount: 35000, appliedDate: "2024-07-20", status: "pending", score: 79, income: 290000 },
  { id: "a8", student: "Arjun Kumar", programId: "p1", programName: "Merit Excellence Scholarship", requestedAmount: 50000, appliedDate: "2024-07-18", status: "pending", score: 89, income: 720000 },
];

export function TrainingScholarships() {
  const [tab, setTab] = React.useState<"programs" | "applications">("programs");
  const [programs, setPrograms] = React.useState<ScholarshipProgram[]>(PROGRAMS);
  const [applications, setApplications] = React.useState<ScholarshipApplication[]>(APPLICATIONS);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [reviewApp, setReviewApp] = React.useState<ScholarshipApplication | null>(null);

  // Create form
  const [form, setForm] = React.useState({
    name: "", eligibility: "", maxAmount: "25000", deadline: "2024-12-31",
  });

  const totalBudget = programs.reduce((a, p) => a + p.maxAmount * 20, 0); // assume 20 slots each
  const totalUtilized = programs.reduce((a, p) => a + p.utilized, 0);
  const activePrograms = programs.filter((p) => p.status === "active").length;
  const pendingApps = applications.filter((a) => a.status === "pending" || a.status === "under_review").length;

  function createProgram() {
    if (!form.name.trim() || !form.eligibility.trim()) {
      toast.error("Program name and eligibility are required");
      return;
    }
    const p: ScholarshipProgram = {
      id: `p_${Date.now()}`,
      name: form.name.trim(),
      eligibility: form.eligibility.trim(),
      maxAmount: Number(form.maxAmount) || 0,
      utilized: 0,
      beneficiaries: 0,
      deadline: form.deadline,
      status: "active",
    };
    setPrograms((prev) => [p, ...prev]);
    setCreateOpen(false);
    setForm({ name: "", eligibility: "", maxAmount: "25000", deadline: "2024-12-31" });
    toast.success("Scholarship program created", { description: p.name });
  }

  function decide(app: ScholarshipApplication, decision: "approved" | "rejected") {
    setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: decision, note: decision === "approved" ? "Approved by committee" : "Did not meet criteria" } : a));
    setPrograms((prev) => prev.map((p) => p.id === app.programId && decision === "approved" ? { ...p, utilized: p.utilized + app.requestedAmount, beneficiaries: p.beneficiaries + 1 } : p));
    setReviewApp(null);
    toast.success(`Application ${decision}`, { description: `${app.student} — ${formatCurrency(app.requestedAmount)}` });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Scholarship Management"
        description="Create scholarship programs, review applications, and track fund utilization."
        icon={<Icon name="Award" className="h-6 w-6" />}
        actions={[
          { label: "New Program", icon: "Plus", onClick: () => setCreateOpen(true) },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Programs" value={activePrograms} icon={<Award className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Utilized" value={formatCurrency(totalUtilized)} icon={<Coins className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending Applications" value={pendingApps} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Total Beneficiaries" value={programs.reduce((a, p) => a + p.beneficiaries, 0)} icon={<Users className="h-5 w-5" />} />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "programs" | "applications")}>
        <TabsList>
          <TabsTrigger value="programs">Programs ({programs.length})</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="mt-4 space-y-4">
          {programs.length === 0 ? (
            <EmptyState icon={<Award className="h-5 w-5" />} title="No scholarship programs" action={<Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> Create program</Button>} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {programs.map((p) => {
                const pct = p.maxAmount > 0 ? Math.min(100, Math.round((p.utilized / p.maxAmount) * 100)) : 0;
                const remaining = Math.max(0, p.maxAmount - p.utilized);
                return (
                  <SectionCard
                    key={p.id}
                    title={p.name}
                    description={p.eligibility}
                    action={<StatusBadge status={p.status} />}
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-lg border p-2">
                          <p className="text-muted-foreground">Max Amount</p>
                          <p className="text-sm font-semibold">{formatCurrency(p.maxAmount)}</p>
                        </div>
                        <div className="rounded-lg border p-2">
                          <p className="text-muted-foreground">Utilized</p>
                          <p className="text-sm font-semibold text-amber-700">{formatCurrency(p.utilized)}</p>
                        </div>
                        <div className="rounded-lg border p-2">
                          <p className="text-muted-foreground">Remaining</p>
                          <p className="text-sm font-semibold text-emerald-700">{formatCurrency(remaining)}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Fund utilization</span>
                          <span className="font-medium">{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground"><Users className="inline h-3 w-3 mr-1" />{p.beneficiaries} beneficiaries</span>
                        <span className="text-muted-foreground">Deadline: <span className="text-foreground font-medium">{formatDate(p.deadline)}</span></span>
                      </div>
                    </div>
                  </SectionCard>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          <SectionCard title="Scholarship Applications">
            {applications.length === 0 ? (
              <EmptyState icon={<Users className="h-5 w-5" />} title="No applications" />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead className="text-right">Requested</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((a) => (
                      <TableRow key={a.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setReviewApp(a)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AvatarLogo text={a.student} size="xs" />
                            <span className="text-sm font-medium">{a.student}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{a.programName}</TableCell>
                        <TableCell className="text-right text-sm font-semibold">{formatCurrency(a.requestedAmount)}</TableCell>
                        <TableCell className="text-right text-sm">{a.score ?? "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDate(a.appliedDate)}</TableCell>
                        <TableCell><StatusBadge status={a.status} /></TableCell>
                        <TableCell className="text-right">
                          {(a.status === "pending" || a.status === "under_review") && (
                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setReviewApp(a); }}>Review</Button>
                          )}
                          {a.note && <span className="text-xs text-muted-foreground">{a.note}</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Scholarship Program</DialogTitle>
            <DialogDescription>Define a new scholarship with eligibility criteria and budget.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sch-name">Program name</Label>
              <Input id="sch-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1" placeholder="e.g. Annual Merit Scholarship" />
            </div>
            <div>
              <Label htmlFor="sch-elig">Eligibility criteria</Label>
              <Input id="sch-elig" value={form.eligibility} onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))} className="mt-1" placeholder="e.g. Min 80% aggregate, family income < ₹6L" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="sch-amt">Max amount per student (₹)</Label>
                <Input id="sch-amt" type="number" value={form.maxAmount} onChange={(e) => setForm((f) => ({ ...f, maxAmount: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="sch-dl">Application deadline</Label>
                <Input id="sch-dl" type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={createProgram}><CheckCircle2 className="h-4 w-4 mr-1" /> Create program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={!!reviewApp} onOpenChange={(o) => !o && setReviewApp(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {reviewApp && (
            <>
              <SheetHeader>
                <SheetTitle>{reviewApp.student}</SheetTitle>
                <SheetDescription>{reviewApp.programName}</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Requested</p>
                    <p className="text-lg font-semibold">{formatCurrency(reviewApp.requestedAmount)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="text-lg font-semibold">{reviewApp.score ?? "—"}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Family Income</p>
                    <p className="text-lg font-semibold">{reviewApp.income ? formatCurrency(reviewApp.income) : "—"}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Applied</p>
                    <p className="text-sm font-semibold">{formatDate(reviewApp.appliedDate)}</p>
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/40 p-3 text-xs">
                  <p className="text-muted-foreground">Documents submitted:</p>
                  <ul className="mt-1 space-y-0.5 text-foreground">
                    <li>• Income certificate</li>
                    <li>• Academic transcripts</li>
                    <li>• Statement of purpose</li>
                  </ul>
                </div>
                {(reviewApp.status === "pending" || reviewApp.status === "under_review") ? (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => decide(reviewApp, "rejected")}>Reject</Button>
                    <Button className="flex-1" onClick={() => decide(reviewApp, "approved")}>Approve &amp; Award</Button>
                  </div>
                ) : (
                  <div className="rounded-lg border p-3 text-xs">
                    <p className="text-muted-foreground">Decision:</p>
                    <p className="mt-1 text-foreground">{reviewApp.note ?? "Reviewed"}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
