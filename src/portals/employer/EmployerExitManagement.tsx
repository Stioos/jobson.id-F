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

type ExitStatus = "Initiated" | "In Progress" | "Completed";
type ExitReason = "Resignation" | "Termination" | "Contract End";

interface ExitItem {
  id: string;
  label: string;
  done: boolean;
}

interface ExitRecord {
  id: string;
  employee: string;
  role: string;
  resignationDate: string;
  lastWorkingDay: string;
  reason: ExitReason;
  status: ExitStatus;
  checklist: ExitItem[];
}

const DAY = 86400000;
const now = Date.now();

const DEFAULT_CHECKLIST: ExitItem[] = [
  { id: "c1", label: "Exit interview scheduled", done: false },
  { id: "c2", label: "Clearance form submitted", done: false },
  { id: "c3", label: "Asset recovery — laptop", done: false },
  { id: "c4", label: "Asset recovery — ID card", done: false },
  { id: "c5", label: "Asset recovery — access cards", done: false },
  { id: "c6", label: "Knowledge transfer completed", done: false },
  { id: "c7", label: "Handover document signed", done: false },
  { id: "c8", label: "Final settlement (F&F) processed", done: false },
  { id: "c9", label: "Experience letter issued", done: false },
  { id: "c10", label: "Relieving letter issued", done: false },
];

const EXITS: ExitRecord[] = [
  {
    id: "x1", employee: "Vikram Singh", role: "Data Analyst", resignationDate: new Date(now - 20 * DAY).toISOString(), lastWorkingDay: new Date(now + 10 * DAY).toISOString(), reason: "Resignation", status: "In Progress",
    checklist: DEFAULT_CHECKLIST.map((c, i) => i < 4 ? { ...c, done: true } : c),
  },
  {
    id: "x2", employee: "Meera Krishnan", role: "Product Manager", resignationDate: new Date(now - 35 * DAY).toISOString(), lastWorkingDay: new Date(now - 5 * DAY).toISOString(), reason: "Resignation", status: "Completed",
    checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c, done: true })),
  },
  {
    id: "x3", employee: "Arjun Mehta", role: "Frontend Engineer", resignationDate: new Date(now - 5 * DAY).toISOString(), lastWorkingDay: new Date(now + 25 * DAY).toISOString(), reason: "Resignation", status: "Initiated",
    checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c, done: false })),
  },
  {
    id: "x4", employee: "Rohit Sharma", role: "DevOps Engineer", resignationDate: new Date(now - 2 * DAY).toISOString(), lastWorkingDay: new Date(now - 1 * DAY).toISOString(), reason: "Termination", status: "In Progress",
    checklist: DEFAULT_CHECKLIST.map((c, i) => i < 2 ? { ...c, done: true } : c),
  },
  {
    id: "x5", employee: "Karthik Rao", role: "Backend Engineer", resignationDate: new Date(now - 60 * DAY).toISOString(), lastWorkingDay: new Date(now - 30 * DAY).toISOString(), reason: "Contract End", status: "Completed",
    checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c, done: true })),
  },
  {
    id: "x6", employee: "Sneha Reddy", role: "Product Designer", resignationDate: new Date(now - 10 * DAY).toISOString(), lastWorkingDay: new Date(now + 20 * DAY).toISOString(), reason: "Resignation", status: "In Progress",
    checklist: DEFAULT_CHECKLIST.map((c, i) => i < 3 ? { ...c, done: true } : c),
  },
];

const STATUS_CLS: Record<ExitStatus, string> = {
  Initiated: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  "In Progress": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400",
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
};

const REASON_CLS: Record<ExitReason, string> = {
  Resignation: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-300",
  Termination: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  "Contract End": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400",
};

export function EmployerExitManagement() {
  const [exits, setExits] = React.useState<ExitRecord[]>(EXITS);
  const [feedbackEmp, setFeedbackEmp] = React.useState<ExitRecord | null>(null);
  const [feedback, setFeedback] = React.useState("");
  const [rating, setRating] = React.useState("3");

  const initiated = exits.filter((e) => e.status === "Initiated").length;
  const inProgress = exits.filter((e) => e.status === "In Progress").length;
  const completed = exits.filter((e) => e.status === "Completed").length;

  const toggleItem = (exitId: string, itemId: string) => {
    setExits((prev) => prev.map((e) => e.id === exitId ? {
      ...e,
      checklist: e.checklist.map((c) => c.id === itemId ? { ...c, done: !c.done } : c),
    } : e));
  };

  const submitFeedback = () => {
    if (!feedbackEmp) return;
    toast.success("Feedback recorded", { description: `Exit interview feedback for ${feedbackEmp.employee} saved.` });
    setFeedbackEmp(null); setFeedback(""); setRating("3");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exit Management"
        description="Manage employee resignations, terminations and contract ends. Track exit interviews, asset recovery, knowledge transfer and final settlement."
        icon={<Icon name="DoorOpen" className="h-6 w-6" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total exits" value={exits.length} icon={<Icon name="DoorOpen" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Initiated" value={initiated} icon={<Icon name="AlertTriangle" className="h-4 w-4" />} tone="warning" />
        <StatCard label="In progress" value={inProgress} icon={<Icon name="Clock" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Completed" value={completed} icon={<Icon name="CheckCircle2" className="h-4 w-4" />} tone="success" />
      </div>

      <SectionCard
        title="Exit requests"
        description="All ongoing and historical exits"
        action={<Badge className="bg-brand/10 text-brand">{exits.length} records</Badge>}
      >
        {exits.length === 0 ? (
          <EmptyState icon={<Icon name="DoorOpen" className="h-5 w-5" />} title="No exits" description="Employee exits will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Resignation</th>
                  <th className="px-3 py-2 font-medium">Last working day</th>
                  <th className="px-3 py-2 font-medium">Reason</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {exits.map((x) => (
                  <tr key={x.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-3 py-2 font-medium">{x.employee}</td>
                    <td className="px-3 py-2 text-muted-foreground">{x.role}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{formatDate(x.resignationDate)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{formatDate(x.lastWorkingDay)}</td>
                    <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${REASON_CLS[x.reason]}`}>{x.reason}</span></td>
                    <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[x.status]}`}>{x.status}</span></td>
                    <td className="px-3 py-2">
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setFeedbackEmp(x)}>
                        <Icon name="MessageSquare" className="mr-1 h-3 w-3" /> Interview
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {exits.filter((e) => e.status !== "Completed").map((x) => {
          const done = x.checklist.filter((c) => c.done).length;
          const pct = Math.round((done / x.checklist.length) * 100);
          return (
            <Card key={x.id}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <AvatarLogo text={x.employee} size="md" />
                  <div>
                    <CardTitle className="text-base">{x.employee}</CardTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground">{x.role} · LWD: {formatDate(x.lastWorkingDay)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[x.status]}`}>{x.status}</span>
                  <p className="mt-1 text-xs font-semibold text-brand">{pct}% complete</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 max-h-60 overflow-y-auto scroll-thin pr-1">
                  {x.checklist.map((c) => (
                    <button key={c.id} onClick={() => toggleItem(x.id, c.id)} className="flex w-full items-center gap-2 rounded-md p-1.5 text-left text-sm hover:bg-muted/50">
                      <Icon name={c.done ? "CheckCircle2" : "Circle"} className={`h-4 w-4 shrink-0 ${c.done ? "text-emerald-600" : "text-muted-foreground"}`} />
                      <span className={c.done ? "line-through text-muted-foreground" : ""}>{c.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!feedbackEmp} onOpenChange={(o) => !o && setFeedbackEmp(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Exit interview — {feedbackEmp?.employee}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Overall experience rating (1-5)</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} — {["Poor", "Below Avg", "OK", "Good", "Excellent"][n - 1]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Feedback notes</Label>
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Reason for leaving, what went well, what could be improved…" rows={5} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFeedbackEmp(null)}>Cancel</Button>
              <Button onClick={submitFeedback}>Save feedback</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
