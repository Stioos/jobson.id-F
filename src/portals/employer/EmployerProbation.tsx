"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  StatCard,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";

type ReviewStatus = "Pending" | "In Review" | "Confirmed" | "Extended" | "Failed";
type Recommendation = "Confirm" | "Extend" | "Terminate";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  startDate: string;
  probationEnd: string;
  reviewStatus: ReviewStatus;
  day30Done: boolean;
  day60Done: boolean;
  day90Done: boolean;
}

const DAY = 86400000;
const now = Date.now();

const EMPLOYEES: Employee[] = [
  { id: "e1", name: "Priya Nair", role: "Senior Frontend Engineer", department: "Engineering", startDate: new Date(now - 80 * DAY).toISOString(), probationEnd: new Date(now + 10 * DAY).toISOString(), reviewStatus: "In Review", day30Done: true, day60Done: true, day90Done: false },
  { id: "e2", name: "Arjun Mehta", role: "Frontend Engineer", department: "Engineering", startDate: new Date(now - 60 * DAY).toISOString(), probationEnd: new Date(now + 30 * DAY).toISOString(), reviewStatus: "Pending", day30Done: true, day60Done: false, day90Done: false },
  { id: "e3", name: "Sneha Reddy", role: "Product Designer", department: "Design", startDate: new Date(now - 95 * DAY).toISOString(), probationEnd: new Date(now - 5 * DAY).toISOString(), reviewStatus: "Confirmed", day30Done: true, day60Done: true, day90Done: true },
  { id: "e4", name: "Karthik Rao", role: "Backend Engineer", department: "Engineering", startDate: new Date(now - 100 * DAY).toISOString(), probationEnd: new Date(now - 10 * DAY).toISOString(), reviewStatus: "Extended", day30Done: true, day60Done: true, day90Done: true },
  { id: "e5", name: "Rohit Sharma", role: "DevOps Engineer", department: "Infra", startDate: new Date(now - 30 * DAY).toISOString(), probationEnd: new Date(now + 60 * DAY).toISOString(), reviewStatus: "Pending", day30Done: false, day60Done: false, day90Done: false },
  { id: "e6", name: "Anjali Gupta", role: "QA Engineer", department: "Engineering", startDate: new Date(now - 85 * DAY).toISOString(), probationEnd: new Date(now + 5 * DAY).toISOString(), reviewStatus: "In Review", day30Done: true, day60Done: true, day90Done: false },
  { id: "e7", name: "Vikram Singh", role: "Data Analyst", department: "Data", startDate: new Date(now - 120 * DAY).toISOString(), probationEnd: new Date(now - 30 * DAY).toISOString(), reviewStatus: "Failed", day30Done: true, day60Done: true, day90Done: true },
  { id: "e8", name: "Meera Krishnan", role: "Product Manager", department: "Product", startDate: new Date(now - 45 * DAY).toISOString(), probationEnd: new Date(now + 45 * DAY).toISOString(), reviewStatus: "Pending", day30Done: true, day60Done: false, day90Done: false },
];

const STATUS_CLS: Record<ReviewStatus, string> = {
  Pending: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-300",
  "In Review": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Extended: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400",
  Failed: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

function daysRemaining(end: string) {
  const diff = Math.ceil((new Date(end).getTime() - now) / DAY);
  return diff;
}

export function EmployerProbation() {
  const [employees] = React.useState<Employee[]>(EMPLOYEES);
  const [tab, setTab] = React.useState<"all" | ReviewStatus>("all");
  const [reviewEmp, setReviewEmp] = React.useState<Employee | null>(null);
  const [rating, setRating] = React.useState("3");
  const [goalsAchieved, setGoalsAchieved] = React.useState("");
  const [concerns, setConcerns] = React.useState("");
  const [rec, setRec] = React.useState<Recommendation>("Confirm");

  const filtered = tab === "all" ? employees : employees.filter((e) => e.reviewStatus === tab);

  const inProbation = employees.filter((e) => e.reviewStatus !== "Confirmed" && e.reviewStatus !== "Failed").length;
  const dueThisMonth = employees.filter((e) => {
    const d = daysRemaining(e.probationEnd);
    return d >= 0 && d <= 30 && e.reviewStatus !== "Confirmed" && e.reviewStatus !== "Failed";
  }).length;
  const confirmedQ = employees.filter((e) => e.reviewStatus === "Confirmed").length;

  const submitReview = () => {
    if (!reviewEmp) return;
    toast.success("Review submitted", {
      description: `${reviewEmp.name}'s probation review saved with recommendation: ${rec}.`,
    });
    setReviewEmp(null); setRating("3"); setGoalsAchieved(""); setConcerns(""); setRec("Confirm");
  };

  const progress = (e: Employee) => {
    const total = (e.probationEnd ? 90 : 0);
    const elapsed = Math.min(90, Math.max(0, Math.round((now - new Date(e.startDate).getTime()) / DAY)));
    return Math.round((elapsed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Probation Tracking"
        description="Track employee probation periods, schedule 30/60/90-day reviews and make confirmation decisions — all in one place."
        icon={<Icon name="Clock" className="h-6 w-6" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="In probation" value={inProbation} icon={<Icon name="Clock" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Due for review this month" value={dueThisMonth} icon={<Icon name="Calendar" className="h-4 w-4" />} tone="warning" />
        <StatCard label="Confirmed this quarter" value={confirmedQ} icon={<Icon name="BadgeCheck" className="h-4 w-4" />} tone="success" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All ({employees.length})</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="In Review">In Review</TabsTrigger>
          <TabsTrigger value="Confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="Extended">Extended</TabsTrigger>
          <TabsTrigger value="Failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={<Icon name="Clock" className="h-5 w-5" />} title="No employees" description="No employees match this filter." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((e) => {
            const daysLeft = daysRemaining(e.probationEnd);
            const pct = progress(e);
            return (
              <Card key={e.id}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <AvatarLogo text={e.name} size="md" />
                    <div>
                      <CardTitle className="text-base">{e.name}</CardTitle>
                      <p className="mt-0.5 text-xs text-muted-foreground">{e.role} · {e.department}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Icon name="Calendar" className="h-3 w-3" /> Joined {formatDate(e.startDate)}</span>
                        <span className="flex items-center gap-1"><Icon name="CalendarClock" className="h-3 w-3" /> Ends {formatDate(e.probationEnd)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[e.reviewStatus]}`}>{e.reviewStatus}</span>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Probation progress</span>
                      <span className={`font-semibold ${daysLeft < 0 ? "text-rose-600" : daysLeft <= 14 ? "text-amber-600" : "text-brand"}`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full transition-all ${pct >= 100 ? "bg-amber-500" : "bg-brand"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Review schedule</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { day: "30d", done: e.day30Done },
                        { day: "60d", done: e.day60Done },
                        { day: "90d", done: e.day90Done },
                      ].map((r) => (
                        <div key={r.day} className={`rounded-md border p-2 text-center ${r.done ? "border-emerald-500/30 bg-emerald-500/5" : "border-border"}`}>
                          <p className="text-xs font-medium">{r.day} review</p>
                          {r.done ? (
                            <Badge className="mt-1 bg-emerald-500/10 text-emerald-600 text-[10px]"><Icon name="Check" className="mr-1 h-3 w-3" /> Done</Badge>
                          ) : (
                            <Badge variant="outline" className="mt-1 text-[10px]">Pending</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => setReviewEmp(e)} disabled={e.reviewStatus === "Confirmed" || e.reviewStatus === "Failed"}>
                    <Icon name="ClipboardCheck" className="mr-1.5 h-3.5 w-3.5" /> Conduct review
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review form dialog */}
      <Dialog open={!!reviewEmp} onOpenChange={(o) => !o && setReviewEmp(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Probation review — {reviewEmp?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Performance rating (1-5)</Label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} — {["Poor", "Below Avg", "Meets", "Exceeds", "Outstanding"][n - 1]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Recommendation</Label>
                <Select value={rec} onValueChange={(v) => setRec(v as Recommendation)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirm">Confirm</SelectItem>
                    <SelectItem value="Extend">Extend probation</SelectItem>
                    <SelectItem value="Terminate">Terminate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Goals achieved</Label>
              <Textarea value={goalsAchieved} onChange={(e) => setGoalsAchieved(e.target.value)} placeholder="Summarize which probation goals were met, with examples." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Areas of concern</Label>
              <Textarea value={concerns} onChange={(e) => setConcerns(e.target.value)} placeholder="Note any performance, behavior or skill concerns." rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReviewEmp(null)}>Cancel</Button>
              <Button onClick={submitReview}>Submit review</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
