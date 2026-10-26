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

type Cycle = "Quarterly" | "Half-yearly" | "Annual";
type SelfStatus = "Pending" | "Submitted" | "Not Started";
type MgrStatus = "Pending" | "In Review" | "Completed";

interface ReviewEmp {
  id: string;
  name: string;
  role: string;
  manager: string;
  selfStatus: SelfStatus;
  mgrStatus: MgrStatus;
  rating: number; // 1-5
  goalsPct: number;
  promotionRec: "Yes" | "No" | "Maybe";
}

const EMPLOYEES: ReviewEmp[] = [
  { id: "p1", name: "Priya Nair", role: "Senior Frontend Engineer", manager: "Rohan Mehta", selfStatus: "Submitted", mgrStatus: "Completed", rating: 5, goalsPct: 95, promotionRec: "Yes" },
  { id: "p2", name: "Arjun Mehta", role: "Frontend Engineer", manager: "Rohan Mehta", selfStatus: "Submitted", mgrStatus: "In Review", rating: 4, goalsPct: 85, promotionRec: "Maybe" },
  { id: "p3", name: "Sneha Reddy", role: "Product Designer", manager: "Anika Verma", selfStatus: "Submitted", mgrStatus: "Completed", rating: 4, goalsPct: 88, promotionRec: "No" },
  { id: "p4", name: "Karthik Rao", role: "Backend Engineer", manager: "Rohan Mehta", selfStatus: "Pending", mgrStatus: "Pending", rating: 3, goalsPct: 70, promotionRec: "No" },
  { id: "p5", name: "Rohit Sharma", role: "DevOps Engineer", manager: "Anika Verma", selfStatus: "Submitted", mgrStatus: "In Review", rating: 5, goalsPct: 92, promotionRec: "Yes" },
  { id: "p6", name: "Anjali Gupta", role: "QA Engineer", manager: "Rohan Mehta", selfStatus: "Submitted", mgrStatus: "Completed", rating: 4, goalsPct: 80, promotionRec: "No" },
  { id: "p7", name: "Vikram Singh", role: "Data Analyst", manager: "Anika Verma", selfStatus: "Not Started", mgrStatus: "Pending", rating: 0, goalsPct: 0, promotionRec: "No" },
  { id: "p8", name: "Meera Krishnan", role: "Product Manager", manager: "Anika Verma", selfStatus: "Submitted", mgrStatus: "Completed", rating: 5, goalsPct: 100, promotionRec: "Yes" },
];

const RATING_CLS: Record<number, string> = {
  1: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  2: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  3: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  4: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  5: "bg-brand/10 text-brand border-brand/20",
};

const SELF_CLS: Record<SelfStatus, string> = {
  "Not Started": "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-300",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Submitted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
};

const MGR_CLS: Record<MgrStatus, string> = {
  Pending: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-300",
  "In Review": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
};

const PROMO_CLS = {
  Yes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  No: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-300",
  Maybe: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
};

export function EmployerPerformanceReview() {
  const [cycle, setCycle] = React.useState<Cycle>("Quarterly");
  const [employees] = React.useState<ReviewEmp[]>(EMPLOYEES);
  const [reviewEmp, setReviewEmp] = React.useState<ReviewEmp | null>(null);
  const [goalsReview, setGoalsReview] = React.useState("");
  const [strengths, setStrengths] = React.useState("");
  const [improvements, setImprovements] = React.useState("");
  const [devPlan, setDevPlan] = React.useState("");
  const [rating, setRating] = React.useState("3");
  const [promo, setPromo] = React.useState<"Yes" | "No" | "Maybe">("No");
  const [raise, setRaise] = React.useState("");

  const reviewed = employees.filter((e) => e.mgrStatus === "Completed").length;
  const avgRating = employees.filter((e) => e.rating > 0).reduce((a, e) => a + e.rating, 0) / Math.max(1, employees.filter((e) => e.rating > 0).length);
  const promoCount = employees.filter((e) => e.promotionRec === "Yes").length;
  const completionPct = Math.round((reviewed / employees.length) * 100);

  const submitReview = () => {
    if (!reviewEmp) return;
    toast.success("Review submitted", { description: `${reviewEmp.name}'s ${cycle.toLowerCase()} review has been saved.` });
    setReviewEmp(null); setGoalsReview(""); setStrengths(""); setImprovements(""); setDevPlan(""); setRating("3"); setPromo("No"); setRaise("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Review"
        description="Manage performance review cycles, manager assessments, ratings, competency evaluations and promotion recommendations."
        icon={<Icon name="Star" className="h-6 w-6" />}
        actions={[
          { label: "Export cycle", variant: "outline", onClick: () => toast.success("Export queued", { description: `${cycle} cycle report will be downloaded shortly.` }) },
        ]}
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Review cycle:</span>
        <Tabs value={cycle} onValueChange={(v) => setCycle(v as Cycle)}>
          <TabsList>
            <TabsTrigger value="Quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="Half-yearly">Half-yearly</TabsTrigger>
            <TabsTrigger value="Annual">Annual</TabsTrigger>
          </TabsList>
        </Tabs>
        <Badge variant="outline" className="ml-auto">Q3 FY25</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Completion rate" value={`${completionPct}%`} hint={`${reviewed}/${employees.length} reviews done`} icon={<Icon name="CheckCircle2" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Average rating" value={avgRating.toFixed(1)} hint="Out of 5.0" icon={<Icon name="Star" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Promotions recommended" value={promoCount} icon={<Icon name="TrendingUp" className="h-4 w-4" />} tone="success" />
        <StatCard label="In progress" value={employees.filter((e) => e.mgrStatus === "In Review").length} icon={<Icon name="Clock" className="h-4 w-4" />} tone="warning" />
      </div>

      <SectionCard title="Employee reviews" description={`${cycle} cycle · Q3 FY25`} action={<Badge className="bg-brand/10 text-brand">{employees.length} employees</Badge>}>
        {employees.length === 0 ? (
          <EmptyState icon={<Icon name="Star" className="h-5 w-5" />} title="No employees" description="Add employees to this cycle to begin reviews." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Manager</th>
                  <th className="px-3 py-2 font-medium">Self-assessment</th>
                  <th className="px-3 py-2 font-medium">Manager review</th>
                  <th className="px-3 py-2 font-medium">Rating</th>
                  <th className="px-3 py-2 font-medium">Goals</th>
                  <th className="px-3 py-2 font-medium">Promotion</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={e.name} size="sm" />
                        <div>
                          <p className="font-medium">{e.name}</p>
                          <p className="text-xs text-muted-foreground">{e.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{e.manager}</td>
                    <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${SELF_CLS[e.selfStatus]}`}>{e.selfStatus}</span></td>
                    <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${MGR_CLS[e.mgrStatus]}`}>{e.mgrStatus}</span></td>
                    <td className="px-3 py-2">{e.rating > 0 ? <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${RATING_CLS[e.rating]}`}><Icon name="Star" className="mr-1 h-3 w-3" /> {e.rating}/5</span> : <span className="text-xs text-muted-foreground">—</span>}</td>
                    <td className="px-3 py-2">
                      {e.goalsPct > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-brand" style={{ width: `${e.goalsPct}%` }} />
                          </div>
                          <span className="text-xs font-medium">{e.goalsPct}%</span>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${PROMO_CLS[e.promotionRec]}`}>{e.promotionRec}</span></td>
                    <td className="px-3 py-2">
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setReviewEmp(e)}>
                        <Icon name="ClipboardCheck" className="mr-1 h-3 w-3" /> Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <Dialog open={!!reviewEmp} onOpenChange={(o) => !o && setReviewEmp(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Performance review — {reviewEmp?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Overall rating</Label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} — {["Poor", "Below", "Meets", "Exceeds", "Outstanding"][n - 1]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Promotion</Label>
                <Select value={promo} onValueChange={(v) => setPromo(v as typeof promo)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Maybe">Maybe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Raise (%)</Label>
                <Select value={raise} onValueChange={setRaise}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                    <SelectItem value="20">20%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Goals review</Label>
              <Textarea value={goalsReview} onChange={(e) => setGoalsReview(e.target.value)} placeholder="Summarize progress against goals set for this cycle." rows={3} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Strengths</Label>
                <Textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="Top strengths demonstrated…" rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>Areas for improvement</Label>
                <Textarea value={improvements} onChange={(e) => setImprovements(e.target.value)} placeholder="Constructive feedback…" rows={3} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Development plan</Label>
              <Textarea value={devPlan} onChange={(e) => setDevPlan(e.target.value)} placeholder="Training, stretch assignments, mentorship for next cycle." rows={3} />
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
