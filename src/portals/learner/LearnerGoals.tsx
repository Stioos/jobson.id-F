"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { trainingCourses } from "@/lib/lms-data";
import { PageHeader, SectionCard, EmptyState, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  LearnerDisclaimer, ChartTooltip, LEARNER_ID,
} from "./_shared";
import { formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import {
  Target, Plus, Clock, Award, Flame, Calendar as CalendarIcon, CheckCircle2,
  TrendingUp, Sparkles, PartyPopper,
} from "lucide-react";

type GoalType = "course" | "hours" | "streak" | "certification";

interface Goal {
  id: string;
  title: string;
  type: GoalType;
  target: number;
  current: number;
  unit: string;
  dueDate: string;
  status: "on_track" | "at_risk" | "completed" | "overdue";
  createdAt: string;
}

const INITIAL_GOALS: Goal[] = [
  {
    id: "g1",
    title: "Complete Advanced React 19 & Next.js",
    type: "course",
    target: 100,
    current: 78,
    unit: "% complete",
    dueDate: new Date(Date.now() + 28 * 86400000).toISOString(),
    status: "on_track",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "g2",
    title: "Earn CKA certification",
    type: "certification",
    target: 1,
    current: 1,
    unit: "cert earned",
    dueDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: "completed",
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: "g3",
    title: "50 learning hours this month",
    type: "hours",
    target: 50,
    current: 32,
    unit: "hours",
    dueDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    status: "on_track",
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  {
    id: "g4",
    title: "Maintain 21-day learning streak",
    type: "streak",
    target: 21,
    current: 14,
    unit: "days",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: "on_track",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

function statusFor(goal: Goal): Goal["status"] {
  if (goal.current >= goal.target) return "completed";
  const d = daysUntil(goal.dueDate);
  if (d < 0) return "overdue";
  const pct = goal.current / goal.target;
  if (pct < 0.5 && d < 7) return "at_risk";
  return "on_track";
}

const TYPE_META: Record<GoalType, { label: string; icon: typeof Target; color: string }> = {
  course: { label: "Course completion", icon: Target, color: "oklch(0.55 0.13 165)" },
  hours: { label: "Learning hours", icon: Clock, color: "oklch(0.6 0.14 200)" },
  streak: { label: "Streak", icon: Flame, color: "oklch(0.65 0.18 50)" },
  certification: { label: "Certification", icon: Award, color: "oklch(0.55 0.13 200)" },
};

export function LearnerGoals() {
  const { navigate } = useNav();
  const [goals, setGoals] = React.useState<Goal[]>(INITIAL_GOALS);
  const [open, setOpen] = React.useState(false);
  const [celebrating, setCelebrating] = React.useState<string | null>(null);

  // form
  const [fType, setFType] = React.useState<GoalType>("course");
  const [fTitle, setFTitle] = React.useState("");
  const [fTarget, setFTarget] = React.useState("");
  const [fUnit, setFUnit] = React.useState("% complete");
  const [fDue, setFDue] = React.useState("");

  const completed = goals.filter((g) => g.status === "completed").length;
  const onTrack = goals.filter((g) => g.status === "on_track").length;
  const atRisk = goals.filter((g) => g.status === "at_risk").length;

  // weekly progress chart — last 7 weeks (mock)
  const weeklyData = [
    { week: "W1", hours: 4.2, target: 7 },
    { week: "W2", hours: 6.8, target: 7 },
    { week: "W3", hours: 5.1, target: 7 },
    { week: "W4", hours: 8.4, target: 7 },
    { week: "W5", hours: 7.0, target: 7 },
    { week: "W6", hours: 9.2, target: 7 },
    { week: "W7", hours: 5.6, target: 7 },
  ];

  function createGoal() {
    if (!fTitle.trim() || !fTarget || !fDue) {
      toast.error("Please fill in all fields");
      return;
    }
    const g: Goal = {
      id: `g_${Date.now()}`,
      title: fTitle.trim(),
      type: fType,
      target: parseFloat(fTarget),
      current: 0,
      unit: fUnit,
      dueDate: new Date(fDue).toISOString(),
      status: "on_track",
      createdAt: new Date().toISOString(),
    };
    setGoals((arr) => [...arr, g]);
    toast.success("Goal created!", { description: `"${g.title}" added to your goals` });
    setOpen(false);
    setFTitle("");
    setFTarget("");
    setFDue("");
    setFType("course");
    setFUnit("% complete");
  }

  function updateProgress(id: string, delta: number) {
    setGoals((arr) =>
      arr.map((g) => {
        if (g.id !== id) return g;
        const next = Math.max(0, Math.min(g.target, g.current + delta));
        const updated = { ...g, current: next };
        const wasNotComplete = g.status !== "completed";
        updated.status = statusFor(updated);
        if (wasNotComplete && updated.status === "completed") {
          setCelebrating(g.id);
          toast.success(`Goal achieved! 🎉`, { description: `"${g.title}" completed · +500 pts` });
        }
        return updated;
      }),
    );
  }
  function deleteGoal(id: string) {
    setGoals((arr) => arr.filter((g) => g.id !== id));
    toast.info("Goal removed");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Goals"
        description="Set goals, track progress, and celebrate wins."
        icon={<Target className="h-5 w-5" />}
        actions={[
          { label: "Create goal", icon: "Plus", onClick: () => setOpen(true) },
        ]}
      />

      <LearnerDisclaimer />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SectionCard title="Total goals" className="p-4">
          <p className="text-2xl font-bold">{goals.length}</p>
        </SectionCard>
        <SectionCard title="Completed" className="p-4">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completed}</p>
        </SectionCard>
        <SectionCard title="On track" className="p-4">
          <p className="text-2xl font-bold text-brand">{onTrack}</p>
        </SectionCard>
        <SectionCard title="At risk" className="p-4">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{atRisk}</p>
        </SectionCard>
      </div>

      {/* Weekly progress chart */}
      <SectionCard
        title="Weekly learning hours"
        description="Your learning consistency over the last 7 weeks"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="hours" name="Hours" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Goals list */}
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target className="h-5 w-5" />}
          title="No goals yet"
          description="Set your first learning goal to start tracking progress."
          action={<Button onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" /> Create goal</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((g) => {
            const meta = TYPE_META[g.type];
            const Icon = meta.icon;
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            const days = daysUntil(g.dueDate);
            return (
              <div
                key={g.id}
                className={
                  "rounded-xl border p-4 transition " +
                  (g.status === "completed"
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : g.status === "at_risk"
                    ? "border-amber-500/40 bg-amber-500/5"
                    : g.status === "overdue"
                    ? "border-rose-500/40 bg-rose-500/5"
                    : "")
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                      style={{ background: meta.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{g.title}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px]">{meta.label}</Badge>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {g.status === "completed"
                            ? `Completed ${formatDate(g.dueDate)}`
                            : days < 0
                            ? `Overdue by ${Math.abs(days)}d`
                            : `Due in ${days}d · ${formatDate(g.dueDate)}`}
                        </span>
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={g.status} />
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {g.current} / {g.target} {g.unit}
                    </span>
                    <span className="font-semibold text-brand">{pct}%</span>
                  </div>
                  <Progress value={pct} className="mt-1 h-1.5" />
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.status !== "completed" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => updateProgress(g.id, stepFor(g))}
                      >
                        <Plus className="mr-1 h-3 w-3" /> Log progress
                      </Button>
                      {g.type === "course" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7"
                          onClick={() => navigate("candidate", "my-learning")}
                        >
                          Go to course
                        </Button>
                      )}
                    </>
                  )}
                  {g.status === "completed" && (
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Goal achieved · +500 pts
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto h-7 text-rose-600 hover:text-rose-700"
                    onClick={() => deleteGoal(g.id)}
                  >
                    Remove
                  </Button>
                </div>

                {/* Celebration overlay */}
                {celebrating === g.id && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <PartyPopper className="h-4 w-4" />
                    <span>You achieved this goal! Great work.</span>
                    <button
                      className="ml-auto font-medium underline"
                      onClick={() => setCelebrating(null)}
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create goal dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a learning goal</DialogTitle>
            <DialogDescription>
              Goals keep you accountable and earn you bonus points when achieved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Goal type</Label>
              <Select value={fType} onValueChange={(v) => setFType(v as GoalType)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">Course completion</SelectItem>
                  <SelectItem value="hours">Learning hours</SelectItem>
                  <SelectItem value="streak">Streak</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="g-title">Goal title</Label>
              <Input
                id="g-title"
                value={fTitle}
                onChange={(e) => setFTitle(e.target.value)}
                placeholder="e.g. Complete React course by December"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="g-target">Target value</Label>
                <Input
                  id="g-target"
                  type="number"
                  value={fTarget}
                  onChange={(e) => setFTarget(e.target.value)}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="g-unit">Unit</Label>
                <Input
                  id="g-unit"
                  value={fUnit}
                  onChange={(e) => setFUnit(e.target.value)}
                  placeholder="% complete"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="g-due">Due date</Label>
              <Input
                id="g-due"
                type="date"
                value={fDue}
                onChange={(e) => setFDue(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={createGoal}>
              <Plus className="mr-1 h-4 w-4" /> Create goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function stepFor(g: Goal): number {
  switch (g.type) {
    case "course":
      return 5; // +5% per log
    case "hours":
      return 2; // +2h per log
    case "streak":
      return 1; // +1 day
    case "certification":
      return 1;
    default:
      return 1;
  }
}
