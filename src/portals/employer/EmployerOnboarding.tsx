"use client";

import * as React from "react";
import { PageHeader, SectionCard, Card, CardContent, CardHeader, CardTitle, EmptyState, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, UserPlus, Briefcase, Calendar, CheckCircle2, Circle, Flag } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

type OnboardingStatus = "Pending" | "In Progress" | "Complete";

interface OnboardingTask {
  label: string;
  done: boolean;
}

interface Milestone {
  day: "Day 1" | "Day 30" | "Day 60" | "Day 90";
  label: string;
  done: boolean;
}

interface NewHire {
  id: string;
  name: string;
  role: string;
  startDate: string;
  status: OnboardingStatus;
  tasks: OnboardingTask[];
  milestones: Milestone[];
}

const DAY = 86400000;
const now = Date.now();

const HIRES: NewHire[] = [
  {
    id: "h1", name: "Priya Nair", role: "Senior Frontend Engineer", startDate: new Date(now + 7 * DAY).toISOString(), status: "In Progress",
    tasks: [
      { label: "IT setup (laptop, accounts)", done: true },
      { label: "HR document submission", done: true },
      { label: "Manager introduction", done: true },
      { label: "Training courses assigned", done: false },
      { label: "Payroll & benefits enrollment", done: false },
    ],
    milestones: [
      { day: "Day 1", label: "Welcome & orientation", done: true },
      { day: "Day 30", label: "First code contribution review", done: false },
      { day: "Day 60", label: "Stakeholder introductions", done: false },
      { day: "Day 90", label: "Probation review", done: false },
    ],
  },
  {
    id: "h2", name: "Arjun Mehta", role: "Frontend Engineer", startDate: new Date(now - 30 * DAY).toISOString(), status: "In Progress",
    tasks: [
      { label: "IT setup (laptop, accounts)", done: true },
      { label: "HR document submission", done: true },
      { label: "Manager introduction", done: true },
      { label: "Training courses assigned", done: true },
      { label: "Payroll & benefits enrollment", done: true },
    ],
    milestones: [
      { day: "Day 1", label: "Welcome & orientation", done: true },
      { day: "Day 30", label: "First code contribution review", done: true },
      { day: "Day 60", label: "Stakeholder introductions", done: false },
      { day: "Day 90", label: "Probation review", done: false },
    ],
  },
  {
    id: "h3", name: "Sneha Reddy", role: "Senior Frontend Engineer", startDate: new Date(now + 14 * DAY).toISOString(), status: "Pending",
    tasks: [
      { label: "IT setup (laptop, accounts)", done: false },
      { label: "HR document submission", done: false },
      { label: "Manager introduction", done: false },
      { label: "Training courses assigned", done: false },
      { label: "Payroll & benefits enrollment", done: false },
    ],
    milestones: [
      { day: "Day 1", label: "Welcome & orientation", done: false },
      { day: "Day 30", label: "First code contribution review", done: false },
      { day: "Day 60", label: "Stakeholder introductions", done: false },
      { day: "Day 90", label: "Probation review", done: false },
    ],
  },
  {
    id: "h4", name: "Karthik Rao", role: "Frontend Engineer", startDate: new Date(now - 95 * DAY).toISOString(), status: "Complete",
    tasks: [
      { label: "IT setup (laptop, accounts)", done: true },
      { label: "HR document submission", done: true },
      { label: "Manager introduction", done: true },
      { label: "Training courses assigned", done: true },
      { label: "Payroll & benefits enrollment", done: true },
    ],
    milestones: [
      { day: "Day 1", label: "Welcome & orientation", done: true },
      { day: "Day 30", label: "First code contribution review", done: true },
      { day: "Day 60", label: "Stakeholder introductions", done: true },
      { day: "Day 90", label: "Probation review", done: true },
    ],
  },
  {
    id: "h5", name: "Rohit Sharma", role: "Frontend Engineer", startDate: new Date(now - 60 * DAY).toISOString(), status: "In Progress",
    tasks: [
      { label: "IT setup (laptop, accounts)", done: true },
      { label: "HR document submission", done: true },
      { label: "Manager introduction", done: true },
      { label: "Training courses assigned", done: true },
      { label: "Payroll & benefits enrollment", done: false },
    ],
    milestones: [
      { day: "Day 1", label: "Welcome & orientation", done: true },
      { day: "Day 30", label: "First code contribution review", done: true },
      { day: "Day 60", label: "Stakeholder introductions", done: true },
      { day: "Day 90", label: "Probation review", done: false },
    ],
  },
];

const STATUS_CLS: Record<OnboardingStatus, string> = {
  "Pending": "bg-slate-500/10 text-slate-600 border-slate-500/20",
  "In Progress": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Complete": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export function EmployerOnboarding() {
  const [list, setList] = React.useState<NewHire[]>(HIRES);
  const [tab, setTab] = React.useState<"all" | OnboardingStatus>("all");

  const filtered = tab === "all" ? list : list.filter((h) => h.status === tab);

  const stats = {
    pending: list.filter((h) => h.status === "Pending").length,
    inProgress: list.filter((h) => h.status === "In Progress").length,
    complete: list.filter((h) => h.status === "Complete").length,
  };

  const progress = (h: NewHire) => {
    const total = h.tasks.length + h.milestones.length;
    const done = h.tasks.filter((t) => t.done).length + h.milestones.filter((m) => m.done).length;
    return Math.round((done / total) * 100);
  };

  const toggleTask = (hireId: string, idx: number) => {
    setList((prev) => prev.map((h) => {
      if (h.id !== hireId) return h;
      const tasks = h.tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t);
      const updated = { ...h, tasks };
      const p = Math.round(((tasks.filter((t) => t.done).length + h.milestones.filter((m) => m.done).length) / (tasks.length + h.milestones.length)) * 100);
      const status: OnboardingStatus = p === 100 ? "Complete" : p === 0 ? "Pending" : "In Progress";
      return { ...updated, status };
    }));
    toast.success("Task updated");
  };

  const toggleMilestone = (hireId: string, idx: number) => {
    setList((prev) => prev.map((h) => {
      if (h.id !== hireId) return h;
      const milestones = h.milestones.map((m, i) => i === idx ? { ...m, done: !m.done } : m);
      const updated = { ...h, milestones };
      const p = Math.round(((h.tasks.filter((t) => t.done).length + milestones.filter((m) => m.done).length) / (h.tasks.length + milestones.length)) * 100);
      const status: OnboardingStatus = p === 100 ? "Complete" : p === 0 ? "Pending" : "In Progress";
      return { ...updated, status };
    }));
    toast.success("Milestone updated");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding Tracker"
        description="Track new hire onboarding progress: IT setup, HR docs, training, and Day 1/30/60/90 milestones."
        actions={[{ label: "Add new hire", icon: "UserPlus", variant: "outline", onClick: () => toast.info("Open the hire creation form to add a new joiner") }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Pending start" value={stats.pending} icon={<UserPlus className="h-5 w-5" />} tone="brand" />
        <StatCard label="In progress" value={stats.inProgress} icon={<Briefcase className="h-5 w-5" />} tone="warning" />
        <StatCard label="Complete" value={stats.complete} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All ({list.length})</TabsTrigger>
          <TabsTrigger value="Pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="In Progress">In Progress ({stats.inProgress})</TabsTrigger>
          <TabsTrigger value="Complete">Complete ({stats.complete})</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={<UserPlus className="h-5 w-5" />} title="No new hires" description="New hires matching the filter will appear here." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((h) => {
            const p = progress(h);
            return (
              <Card key={h.id}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <AvatarLogo text={h.name} size="md" />
                    <div>
                      <CardTitle className="text-base">{h.name}</CardTitle>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{h.role}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Starts {formatDate(h.startDate)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLS[h.status]}`}>{h.status}</span>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold">{p}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-brand transition-all" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Task checklist</div>
                    <div className="space-y-1.5">
                      {h.tasks.map((t, i) => (
                        <button key={i} onClick={() => toggleTask(h.id, i)} className="flex w-full items-center gap-2 rounded-md p-1.5 text-left text-sm hover:bg-muted/50">
                          {t.done ? <CheckCircle2 className="h-4 w-4 text-brand shrink-0" /> : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                          <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1"><Flag className="h-3 w-3" /> Milestones</div>
                    <div className="grid grid-cols-2 gap-2">
                      {h.milestones.map((m, i) => (
                        <button key={i} onClick={() => toggleMilestone(h.id, i)} className={`rounded-md border p-2 text-left transition ${m.done ? "border-brand/40 bg-brand/5" : "border-border hover:border-brand/40"}`}>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px]">{m.day}</Badge>
                            {m.done ? <Check className="h-3 w-3 text-brand" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
                          </div>
                          <div className="mt-1 text-xs">{m.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
