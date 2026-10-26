"use client";

import * as React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  SectionCard,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Phone, Mail, Video, ArrowUpRight, Plus, Search, CheckCircle2,
  Circle, Clock, AlertCircle, Calendar, User, ChevronLeft,
  ChevronRight, Pencil, Flag, Bell, ShieldCheck, PhoneCall,
  type LucideIcon,
} from "lucide-react";
import type { Portal } from "@/lib/types";

// ============================================================
// TYPES
// ============================================================
type TaskType = "call" | "email" | "meeting" | "follow-up";
type TaskPriority = "high" | "medium" | "low";
type TaskStatus = "pending" | "completed";

interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

interface Task {
  id: number;
  title: string;
  type: TaskType;
  dueDate: string;
  dueLabel: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  category: string;
  subCategory: string;
  description: string;
  subtasks: SubTask[];
  contactName?: string;
  contactPhone?: string;
  dealName?: string;
  dealType?: string;
  talkingPoints?: string[];
}

// ============================================================
// TASK DATA — shared mock data for all portals
// ============================================================
const TASKS: Task[] = [
  {
    id: 51,
    title: "Follow up with Sarah on pricing",
    type: "call",
    dueDate: "today",
    dueLabel: "Today",
    priority: "high",
    status: "pending",
    assignedTo: "You",
    category: "Call",
    subCategory: "CRM Core",
    description: "Standard touchpoint — confirm Q2 budget allocation and address compliance feedback.",
    subtasks: [
      { id: "s1", title: "Review current ANS spend and contract dates", done: true },
      { id: "s2", title: "Prepare benchmark comparison sheet against CloudComp", done: true },
      { id: "s3", title: "Confirm multi-year commitment discount tier approval", done: false },
      { id: "s4", title: "Send revised quotation PDF and calendar invite for call", done: false },
    ],
    contactPhone: "+1 (555) 014-2900",
    talkingPoints: [
      "Confirm Q2 budget allocation and decision timeline",
      "Address SOC2 compliance questionnaire feedback submitted yesterday",
      "Propose scheduling 45-min technical deep-dive with sales engineering",
    ],
  },
  {
    id: 52,
    title: "Send proposal to Marcus",
    type: "email",
    dueDate: "tomorrow",
    dueLabel: "Tomorrow",
    priority: "high",
    status: "pending",
    assignedTo: "You",
    category: "Email",
    subCategory: "Outreach",
    description: "Send the revised proposal document with pricing tiers and onboarding timeline.",
    subtasks: [
      { id: "s1", title: "Finalize pricing tier options", done: false },
      { id: "s2", title: "Attach onboarding timeline PDF", done: false },
      { id: "s3", title: "CC the account executive for visibility", done: false },
    ],
  },
  {
    id: 53,
    title: "Schedule demo with NovaTech",
    type: "meeting",
    dueDate: "jan-18",
    dueLabel: "Jan 18",
    priority: "medium",
    status: "pending",
    assignedTo: "Alex",
    category: "Meeting",
    subCategory: "Demo",
    description: "Product demo for NovaTech leadership team — showcase analytics module.",
    subtasks: [
      { id: "s1", title: "Prepare demo environment with NovaTech branding", done: false },
      { id: "s2", title: "Send calendar invite to 4 stakeholders", done: false },
    ],
  },
  {
    id: 54,
    title: "Update CRM notes for Apex",
    type: "follow-up",
    dueDate: "jan-19",
    dueLabel: "Jan 19",
    priority: "low",
    status: "completed",
    assignedTo: "You",
    category: "Follow-up",
    subCategory: "Documentation",
    description: "Log all conversation points and next steps from the Apex discovery call.",
    subtasks: [
      { id: "s1", title: "Update account record with meeting notes", done: true },
      { id: "s2", title: "Set reminder for 2-week follow-up", done: true },
    ],
  },
  {
    id: 55,
    title: "Review contract terms",
    type: "follow-up",
    dueDate: "jan-20",
    dueLabel: "Jan 20",
    priority: "medium",
    status: "pending",
    assignedTo: "You",
    category: "Follow-up",
    subCategory: "Legal",
    description: "Review redlined contract from legal team and flag any concerns.",
    subtasks: [
      { id: "s1", title: "Compare redlines against original MSA", done: false },
      { id: "s2", title: "Schedule call with legal counsel if needed", done: false },
    ],
  },
  {
    id: 56,
    title: "Quarterly business review prep",
    type: "meeting",
    dueDate: "jan-22",
    dueLabel: "Jan 22",
    priority: "high",
    status: "pending",
    assignedTo: "You",
    category: "Meeting",
    subCategory: "QBR",
    description: "Prepare QBR deck with Q1 metrics, wins, and roadmap alignment.",
    subtasks: [
      { id: "s1", title: "Pull Q1 usage analytics from dashboard", done: false },
      { id: "s2", title: "Draft 3-slide wins summary", done: false },
      { id: "s3", title: "Align roadmap section with product team", done: false },
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================
const TYPE_ICON: Record<TaskType, LucideIcon> = {
  call: Phone,
  email: Mail,
  meeting: Video,
  "follow-up": ArrowUpRight,
};

const TYPE_COLOR: Record<TaskType, string> = {
  call: "#F59E0B",
  email: "#3B82F6",
  meeting: "#8B5CF6",
  "follow-up": "#10B981",
};

const PRIORITY_STYLE: Record<TaskPriority, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-rose-500/10", text: "text-rose-600", label: "High" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-600", label: "Medium" },
  low: { bg: "bg-slate-500/10", text: "text-slate-600", label: "Low" },
};

// ============================================================
// PORTAL CONTEXT — customizes the page per portal
// ============================================================
const PORTAL_CONTEXT: Record<Portal, { title: string; subtitle: string; newLabel: string }> = {
  public: { title: "My Tasks", subtitle: "Your personal tasks, reminders & follow-ups", newLabel: "New Task" },
  candidate: { title: "My Tasks", subtitle: "Job search tasks, interview prep & follow-ups", newLabel: "New Task" },
  employer: { title: "Hiring Tasks", subtitle: "Recruitment activities, interviews & follow-ups", newLabel: "New Task" },
  recruiter: { title: "CRM Tasks", subtitle: "Client calls, candidate follow-ups & placement activities", newLabel: "New Task" },
  training: { title: "Training Tasks", subtitle: "Cohort sessions, student follow-ups & admin tasks", newLabel: "New Task" },
  partner: { title: "Partner Tasks", subtitle: "Deals, student follow-ups & partnership activities", newLabel: "New Task" },
  agency: { title: "Agency Tasks", subtitle: "Client tasks & project activities", newLabel: "New Task" },
  enterprise: { title: "Enterprise Tasks", subtitle: "Organizational tasks & approvals", newLabel: "New Task" },
  admin: { title: "Admin Tasks", subtitle: "Platform admin tasks & approvals", newLabel: "New Task" },
  learner: { title: "My Tasks", subtitle: "Learning tasks & course activities", newLabel: "New Task" },
};

// ============================================================
// MAIN COMPONENT — TasksPage
// ============================================================
export function TasksPage({ portal, route = "tasks" }: { portal: Portal; route?: string }) {
  const ctx = PORTAL_CONTEXT[portal] ?? PORTAL_CONTEXT.candidate;
  const [tasks, setTasks] = React.useState<Task[]>(TASKS);
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = React.useState<TaskPriority | "all">("all");
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<number | null>(TASKS[0].id);

  // Derive the task type filter from the route (e.g., "tasks/calls" → "call")
  const typeFilter = React.useMemo<TaskType | "all">(() => {
    const sub = route.split("/")[1];
    if (sub === "calls") return "call";
    if (sub === "emails") return "email";
    if (sub === "meetings") return "meeting";
    if (sub === "follow-ups") return "follow-up";
    return "all";
  }, [route]);

  // Sub-title based on the type filter
  const typeLabel = React.useMemo(() => {
    switch (typeFilter) {
      case "call": return "All call tasks";
      case "email": return "All email tasks";
      case "meeting": return "All meeting tasks";
      case "follow-up": return "All follow-up tasks";
      default: return ctx.subtitle;
    }
  }, [typeFilter, ctx.subtitle]);

  const filtered = React.useMemo(() => {
    return tasks.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (search.trim() && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, typeFilter, statusFilter, priorityFilter, search]);

  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  const stats = React.useMemo(() => {
    const total = tasks.length;
    const dueToday = tasks.filter((t) => t.dueDate === "today" && t.status === "pending").length;
    const highPriority = tasks.filter((t) => t.priority === "high" && t.status === "pending").length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    return { total, dueToday, highPriority, completed };
  }, [tasks]);

  const handleToggleComplete = (id: number) => {
    setTasks((prev) => prev.map((t) =>
      t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
    ));
    const task = tasks.find((t) => t.id === id);
    if (task) {
      toast.success(task.status === "completed" ? "Task reopened" : "Task marked complete", {
        description: task.title,
      });
    }
  };

  const handleToggleSubtask = (taskId: number, subtaskId: string) => {
    setTasks((prev) => prev.map((t) =>
      t.id === taskId
        ? { ...t, subtasks: t.subtasks.map((s) => s.id === subtaskId ? { ...s, done: !s.done } : s) }
        : t
    ));
  };

  const handleAddSubtask = (taskId: number, title: string) => {
    if (!title.trim()) return;
    setTasks((prev) => prev.map((t) =>
      t.id === taskId
        ? { ...t, subtasks: [...t.subtasks, { id: `s${Date.now()}`, title, done: false }] }
        : t
    ));
    toast.success("Subtask added");
  };

  const selectedIndex = filtered.findIndex((t) => t.id === selectedId);
  const goPrev = () => {
    if (selectedIndex > 0) setSelectedId(filtered[selectedIndex - 1].id);
  };
  const goNext = () => {
    if (selectedIndex < filtered.length - 1) setSelectedId(filtered[selectedIndex + 1].id);
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{ctx.title}</h1>
            <Badge className="bg-brand/10 text-brand">{tasks.length}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{typeLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-9 w-40 pl-9 sm:w-56"
            />
          </div>
          <Button
            size="sm"
            onClick={() => toast.success("New task", { description: "Task editor will open here." })}
            className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Plus className="h-4 w-4" /> {ctx.newLabel}
          </Button>
        </div>
      </div>

      {/* ===================== STATS CARDS ===================== */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Total Tasks" value={stats.total} sublabel="In schedule" color="#3B82F6" />
        <StatCard icon={Clock} label="Due Today" value={stats.dueToday} sublabel="Immediate priority" color="#F59E0B" />
        <StatCard icon={AlertCircle} label="High Priority" value={stats.highPriority} sublabel="Urgent items" color="#EF4444" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} sublabel="Resolved items" color="#10B981" />
      </div>

      {/* ===================== FILTER BAR ===================== */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        <div className="flex items-center gap-1">
          <FilterPill active={statusFilter === "all"} onClick={() => setStatusFilter("all")} label="All" />
          <FilterPill active={statusFilter === "pending"} onClick={() => setStatusFilter("pending")} label="Pending" />
          <FilterPill active={statusFilter === "completed"} onClick={() => setStatusFilter("completed")} label="Completed" />
        </div>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-1">
          <FilterPill active={priorityFilter === "all"} onClick={() => setPriorityFilter("all")} label="All Priorities" />
          <FilterPill active={priorityFilter === "high"} onClick={() => setPriorityFilter("high")} label="High" color="rose" />
          <FilterPill active={priorityFilter === "medium"} onClick={() => setPriorityFilter("medium")} label="Medium" color="amber" />
          <FilterPill active={priorityFilter === "low"} onClick={() => setPriorityFilter("low")} label="Low" color="slate" />
        </div>
      </div>

      {/* ===================== MAIN GRID: list + detail ===================== */}
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* ===== LEFT: Task list ===== */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Task Queue
            </span>
            <Badge variant="outline" className="gap-1 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Active
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <EmptyState
                icon={<Circle className="h-5 w-5" />}
                title="No tasks match"
                description="Try adjusting your filters."
              />
            ) : (
              filtered.map((task) => {
                const TypeIcon = TYPE_ICON[task.type];
                const prio = PRIORITY_STYLE[task.priority];
                const isSelected = task.id === selectedId;
                const isDone = task.status === "completed";
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedId(task.id)}
                    className={cn(
                      "group relative flex items-start gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-brand bg-brand/5 shadow-sm"
                        : "border-border bg-card hover:border-brand/40 hover:shadow-sm"
                    )}
                  >
                    {/* Left color accent bar (type color) */}
                    <span
                      className="absolute left-0 top-0 h-full w-1"
                      style={{ background: TYPE_COLOR[task.type] }}
                    />
                    {/* Checkbox */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id); }}
                      className="mt-0.5 flex-shrink-0"
                      title={isDone ? "Mark as pending" : "Mark complete"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-brand" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-brand" />
                      )}
                    </button>
                    {/* Type icon tile */}
                    <div
                      className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${TYPE_COLOR[task.type]}15`, color: TYPE_COLOR[task.type] }}
                    >
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm font-bold leading-tight",
                        isDone ? "text-muted-foreground line-through" : "text-foreground"
                      )}>
                        {task.title}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span
                          className="inline-flex items-center gap-1 font-medium"
                          style={{ color: TYPE_COLOR[task.type] }}
                        >
                          {task.category}
                        </span>
                        <span className="text-border">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {task.dueLabel}
                        </span>
                      </div>
                    </div>
                    {/* Priority badge — top right */}
                    <span className={cn("flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold", prio.bg, prio.text)}>
                      {prio.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ===== RIGHT: Task detail ===== */}
        {selected ? (
          <TaskDetail
            task={selected}
            onToggleComplete={() => handleToggleComplete(selected.id)}
            onToggleSubtask={(sid) => handleToggleSubtask(selected.id, sid)}
            onAddSubtask={(title) => handleAddSubtask(selected.id, title)}
            onPrev={goPrev}
            onNext={goNext}
            prevDisabled={selectedIndex <= 0}
            nextDisabled={selectedIndex >= filtered.length - 1}
            index={selectedIndex + 1}
            total={filtered.length}
          />
        ) : (
          <EmptyState
            icon={<CheckCircle2 className="h-6 w-6" />}
            title="No task selected"
            description="Select a task from the list to view details."
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================
function StatCard({
  icon: Icon, label, value, sublabel, color,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  sublabel: string;
  color: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{sublabel}</p>
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: `${color}15`, color }}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// FILTER PILL
// ============================================================
function FilterPill({
  active, onClick, label, color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: "rose" | "amber" | "slate";
}) {
  const colorMap = {
    rose: active ? "bg-rose-500 text-white" : "",
    amber: active ? "bg-amber-500 text-white" : "",
    slate: active ? "bg-slate-500 text-white" : "",
  };
  const baseActive = !color && active ? "bg-brand text-brand-foreground" : "";
  const colorClass = color ? colorMap[color] : baseActive;

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active ? colorClass : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

// ============================================================
// TASK DETAIL VIEW
// ============================================================
function TaskDetail({
  task, onToggleComplete, onToggleSubtask, onAddSubtask,
  onPrev, onNext, prevDisabled, nextDisabled, index, total,
}: {
  task: Task;
  onToggleComplete: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onAddSubtask: (title: string) => void;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
  index: number;
  total: number;
}) {
  const [newSubtask, setNewSubtask] = React.useState("");
  const TypeIcon = TYPE_ICON[task.type];
  const prio = PRIORITY_STYLE[task.priority];
  const isDone = task.status === "completed";
  const completedSubtasks = task.subtasks.filter((s) => s.done).length;
  const progress = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0;

  return (
    <Card className="flex flex-col">
      {/* ===== Header ===== */}
      <CardHeader className="border-b pb-4">
        {/* Breadcrumb + pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Tasks Directory</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">{task.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onPrev} disabled={prevDisabled}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">{index} of {total}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNext} disabled={nextDisabled}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Title + badges */}
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${TYPE_COLOR[task.type]}15`, color: TYPE_COLOR[task.type] }}
            >
              <TypeIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className={cn("text-lg font-bold leading-tight", isDone && "text-muted-foreground line-through")}>
                {task.title}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600">
                  <Clock className="h-3 w-3" /> {isDone ? "Completed" : "Pending Actions"}
                </Badge>
                <Badge variant="outline" className={cn("gap-1", prio.bg, prio.text, "border-transparent")}>
                  <Flag className="h-3 w-3" /> {prio.label} Priority
                </Badge>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Due: {task.dueLabel}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User className="h-3 w-3" /> Assigned to: {task.assignedTo}
                </span>
                <span className="inline-flex items-center gap-1">
                  <TypeIcon className="h-3 w-3" /> Type: {task.category}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onToggleComplete}
              className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isDone ? "Reopen" : "Mark as Completed"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("Edit task", { description: "Task editor will open here." })}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        {/* ===== Info cards row ===== */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <InfoCard label="Task Category" value={task.category} sublabel={task.subCategory} desc="Standard touchpoint" />
          <InfoCard label="Execution SLA" value={task.dueLabel} sublabel={task.priority === "high" ? "Urgent action required" : "On track"} valueColor={task.priority === "high" ? "text-rose-600" : "text-foreground"} />
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Checklist Progress</p>
            <p className="mt-1 text-sm font-bold text-foreground">{Math.round(progress)}% <span className="text-xs font-normal text-muted-foreground">({completedSubtasks} of {task.subtasks.length})</span></p>
            <Progress value={progress} className="mt-2 h-1.5" />
          </div>
          <InfoCard label="Related Opportunity" value={task.dealName ?? "Direct Account"} sublabel={task.dealType ?? "General Outreach"} valueColor="text-brand" />
        </div>

        {/* ===== Action execution suite (only for calls) ===== */}
        {task.type === "call" && task.contactPhone && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-bold text-foreground">Action Execution Suite (Call)</h3>
              </div>
              <Badge className="bg-amber-500/15 text-amber-600">Active Module</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Call Prospect</p>
                <p className="text-sm font-bold text-foreground">{task.contactPhone}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Direct VoIP integration with auto-rated transcription</p>
              </div>
              <Button
                size="sm"
                onClick={() => toast.success("Dialing...", { description: task.contactPhone })}
                className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
              >
                <PhoneCall className="h-4 w-4" /> Start Dialing
              </Button>
            </div>
            {task.talkingPoints && (
              <div className="mt-3 border-t border-amber-500/20 pt-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Recommended Talking Points</p>
                <ul className="space-y-1">
                  {task.talkingPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                      <ArrowUpRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-600" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ===== Two-column: checklist + right panels ===== */}
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* Subtask checklist */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Subtask Checklist & Execution Steps</h3>
              <Badge variant="outline" className="text-[10px]">{completedSubtasks} completed</Badge>
            </div>
            <div className="space-y-1.5">
              {task.subtasks.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onToggleSubtask(sub.id)}
                  className="flex w-full items-start gap-2.5 rounded-md p-2 text-left transition-colors hover:bg-accent"
                >
                  {sub.done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground hover:text-brand" />
                  )}
                  <span className={cn("text-sm", sub.done ? "text-muted-foreground line-through" : "text-foreground")}>
                    {sub.title}
                  </span>
                </button>
              ))}
            </div>
            {/* Add subtask */}
            <div className="mt-3 flex items-center gap-2 border-t pt-3">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onAddSubtask(newSubtask);
                    setNewSubtask("");
                  }
                }}
                placeholder="Add a new subtask or milestone..."
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onAddSubtask(newSubtask);
                  setNewSubtask("");
                }}
                className="h-8 gap-1"
              >
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>
          </div>

          {/* Right sidebar panels */}
          <div className="flex flex-col gap-3">
            {/* Linked contact */}
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Linked Contact</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                {task.contactName ? task.contactName : "No specific contact attached directly to this action item."}
              </p>
            </div>
            {/* Linked deal */}
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="mb-1.5 flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Linked Deal</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                {task.dealName ? task.dealName : "General client relation activity. No single deal primed."}
              </p>
            </div>
            {/* Audit telemetry */}
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Audit & SLA Telemetry</h4>
              </div>
              <dl className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Task ID</dt>
                  <dd className="font-mono font-semibold text-foreground">{task.id}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Urgency</dt>
                  <dd className={cn("font-semibold", prio.text)}>{prio.label} Priority SLA</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Notifications</dt>
                  <dd className="flex items-center gap-1 font-semibold text-brand">
                    <Bell className="h-3 w-3" /> Push & Email
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Assigned Rep</dt>
                  <dd className="font-semibold text-foreground">{task.assignedTo}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// INFO CARD (small stat card for detail view)
// ============================================================
function InfoCard({
  label, value, sublabel, desc, valueColor,
}: {
  label: string;
  value: string;
  sublabel: string;
  desc?: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-sm font-bold", valueColor ?? "text-foreground")}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{sublabel}</p>
      {desc && <p className="mt-1 text-[10px] italic text-muted-foreground">{desc}</p>}
    </div>
  );
}
