"use client";

import * as React from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, type DragEndEvent, type DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus, CheckSquare, Clock, AlertTriangle, CheckCircle2, GripVertical,
  Calendar, User, Building2, ListChecks, LayoutGrid,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDateTime, daysUntil, timeAgo } from "@/lib/format";
import { taskItems, clientAccounts } from "@/lib/partner-data";
import type { TaskItem } from "@/lib/partner-data";

type Stage = "pending" | "in_progress" | "completed" | "overdue";
const STAGES: Stage[] = ["pending", "in_progress", "completed", "overdue"];

const STAGE_META: Record<Stage, { label: string; tone: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", tone: "border-t-slate-400", icon: <Clock className="h-3 w-3" /> },
  in_progress: { label: "In Progress", tone: "border-t-amber-400", icon: <Clock className="h-3 w-3" /> },
  completed: { label: "Completed", tone: "border-t-emerald-500", icon: <CheckCircle2 className="h-3 w-3" /> },
  overdue: { label: "Overdue", tone: "border-t-rose-400", icon: <AlertTriangle className="h-3 w-3" /> },
};

const TYPE_LABEL: Record<string, string> = {
  follow_up: "Follow up",
  submit_candidate: "Submit candidate",
  schedule_interview: "Schedule interview",
  collect_feedback: "Collect feedback",
  prepare_offer: "Prepare offer",
  client_meeting: "Client meeting",
  documentation: "Documentation",
};

const PRIORITY_TONE: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  urgent: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export function RecruiterTasks() {
  const [tasks, setTasks] = React.useState<TaskItem[]>(taskItems);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [view, setView] = React.useState<"kanban" | "table">("kanban");
  const [addOpen, setAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<TaskItem | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q) && !(t.clientName ?? "").toLowerCase().includes(q) && !(t.candidateName ?? "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const overdue = tasks.filter((t) => t.status === "overdue").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const tasksByStage = (stage: Stage) => filtered.filter((t) => t.status === stage);
  const activeTask = filtered.find((t) => t.id === activeId) ?? null;

  function findStage(id: string): Stage | undefined {
    return tasks.find((t) => t.id === id)?.status;
  }

  function onDragStart(e: DragStartEvent) { setActiveId(String(e.active.id)); }
  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const overId = String(over.id);
    const overIsStage = STAGES.includes(overId as Stage);
    const target: Stage | undefined = overIsStage ? (overId as Stage) : findStage(overId);
    const activeStage = findStage(String(active.id));
    if (!activeStage || !target) return;
    if (activeStage === target) {
      setTasks((prev) => {
        const col = prev.filter((t) => t.status === activeStage);
        const oldIdx = col.findIndex((t) => t.id === active.id);
        const newIdx = col.findIndex((t) => t.id === over.id);
        if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev;
        const reordered = arrayMove(col, oldIdx, newIdx);
        const others = prev.filter((t) => t.status !== activeStage);
        return [...others, ...reordered];
      });
      return;
    }
    setTasks((prev) => prev.map((t) => t.id === active.id ? { ...t, status: target } : t));
    const task = tasks.find((t) => t.id === active.id);
    if (task) toast.success(`"${task.title}" moved to ${STAGE_META[target].label}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks & follow-ups"
        description="Stay on top of every follow-up, submission, and meeting. Drag tasks between statuses, or click to edit."
        actions={[{ label: "Create task", onClick: () => setAddOpen(true) }]}
      />

      {overdue > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{overdue} task{overdue > 1 ? "s" : ""} overdue</p>
            <p className="text-xs text-muted-foreground">Review and either complete them or extend the due date to keep candidates and clients moving.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Pending" value={pending} icon={<Clock className="h-5 w-5" />} tone="default" />
        <StatCard label="In progress" value={inProgress} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={overdue} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-28"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-8 w-28"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="hidden sm:flex items-center rounded-md border p-0.5">
              <Button size="sm" variant={view === "kanban" ? "default" : "ghost"} className="h-7" onClick={() => setView("kanban")}><LayoutGrid className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant={view === "table" ? "default" : "ghost"} className="h-7" onClick={() => setView("table")}><ListChecks className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        }
      >
        {view === "kanban" ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STAGES.map((stage) => (
                <Column key={stage} stage={stage} tasks={tasksByStage(stage)} onEdit={setEditTarget} onComplete={(t) => {
                  setTasks((prev) => prev.map((x) => x.id === t.id ? { ...x, status: "completed" } : x));
                  toast.success(`"${t.title}" marked complete`);
                }} />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} dragging onEdit={() => {}} onComplete={() => {}} /> : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Related</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="hidden sm:table-cell">Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No tasks match.</TableCell>
                  </TableRow>
                ) : filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">{t.description}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{TYPE_LABEL[t.type]}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {t.clientName && <p>{t.clientName}</p>}
                      {t.candidateName && <p>{t.candidateName}</p>}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_TONE[t.priority]}`}>{t.priority}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs">
                      <span className={daysUntil(t.dueDate) < 0 && t.status !== "completed" ? "text-rose-600 dark:text-rose-400 font-medium" : "text-muted-foreground"}>
                        {formatDateTime(t.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-right">
                      {t.status !== "completed" ? (
                        <Button size="sm" variant="outline" className="h-7" onClick={() => {
                          setTasks((prev) => prev.map((x) => x.id === t.id ? { ...x, status: "completed" } : x));
                          toast.success(`"${t.title}" marked complete`);
                        }}>
                          <CheckSquare className="h-3 w-3" /> Complete
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => setEditTarget(t)}>Edit</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <CreateEditTaskDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        task={null}
        onSave={(t) => {
          setTasks((prev) => [{ ...t, id: "tsk_" + Date.now() }, ...prev]);
          toast.success("Task created");
        }}
      />

      <CreateEditTaskDialog
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        task={editTarget}
        onSave={(t) => {
          if (editTarget) {
            setTasks((prev) => prev.map((x) => x.id === editTarget.id ? { ...x, ...t } : x));
            toast.success("Task updated");
          }
          setEditTarget(null);
        }}
      />
    </div>
  );
}

function Column({
  stage, tasks, onEdit, onComplete,
}: {
  stage: Stage;
  tasks: TaskItem[];
  onEdit: (t: TaskItem) => void;
  onComplete: (t: TaskItem) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg border-t-4 ${STAGE_META[stage].tone} border-x border-b bg-muted/30 min-h-[200px] transition-colors ${isOver ? "ring-2 ring-brand/40 bg-brand/5" : ""}`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
          {STAGE_META[stage].icon} {STAGE_META[stage].label}
        </h4>
        <Badge variant="outline" className="text-[10px] h-5">{tasks.length}</Badge>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 p-2 flex-1 overflow-y-auto scroll-thin max-h-[560px]">
          {tasks.length === 0 ? (
            <div className="text-[10px] text-muted-foreground text-center py-6 border border-dashed rounded">Drop here</div>
          ) : (
            tasks.map((t) => <SortableTaskCard key={t.id} task={t} onEdit={onEdit} onComplete={onComplete} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableTaskCard({
  task, onEdit, onComplete,
}: {
  task: TaskItem;
  onEdit: (t: TaskItem) => void;
  onComplete: (t: TaskItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <TaskCard task={task} onEdit={onEdit} onComplete={onComplete} />
    </div>
  );
}

function TaskCard({
  task, dragging, onEdit, onComplete,
}: {
  task: TaskItem;
  dragging?: boolean;
  onEdit: (t: TaskItem) => void;
  onComplete: (t: TaskItem) => void;
}) {
  const due = daysUntil(task.dueDate);
  return (
    <div
      onClick={(e) => {
        // Click (not drag) opens edit
        if ((e.target as HTMLElement).closest("[data-stop]")) return;
        onEdit(task);
      }}
      className={`group rounded-md border bg-card p-2.5 shadow-sm hover:border-brand hover:shadow-md transition-all ${dragging ? "ring-2 ring-brand shadow-lg rotate-1" : ""} ${task.status === "overdue" ? "border-rose-500/40" : ""}`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium leading-tight">{task.title}</p>
          <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{task.description}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <span className={`inline-flex items-center rounded-full border px-1.5 py-0 text-[9px] font-medium capitalize ${PRIORITY_TONE[task.priority]}`}>{task.priority}</span>
        <Badge variant="outline" className="text-[9px] h-4 px-1">{TYPE_LABEL[task.type]}</Badge>
        {task.clientName && <span className="text-[9px] text-muted-foreground truncate">{task.clientName}</span>}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-[9px] flex items-center gap-0.5 ${due < 0 && task.status !== "completed" ? "text-rose-600 dark:text-rose-400 font-medium" : "text-muted-foreground"}`}>
          <Calendar className="h-2.5 w-2.5" />
          {task.status === "completed" ? "Done" : due < 0 ? `${Math.abs(due)}d overdue` : due === 0 ? "Today" : `${due}d left`}
        </span>
        {task.status !== "completed" && (
          <Button
            size="sm"
            variant="ghost"
            className="h-5 px-1 text-[9px] hover:bg-brand/10 hover:text-brand"
            data-stop
            onClick={(e) => { e.stopPropagation(); onComplete(task); }}
          >
            <CheckSquare className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

function CreateEditTaskDialog({
  open, onOpenChange, task, onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: TaskItem | null;
  onSave: (t: Omit<TaskItem, "id">) => void;
}) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<TaskItem["type"]>("follow_up");
  const [priority, setPriority] = React.useState<TaskItem["priority"]>("medium");
  const [status, setStatus] = React.useState<TaskItem["status"]>("pending");
  const [dueDate, setDueDate] = React.useState("");
  const [client, setClient] = React.useState("");
  const [candidate, setCandidate] = React.useState("");
  const [assignedTo, setAssignedTo] = React.useState("Karthik Subramanian");

  React.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setType(task.type);
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate.slice(0, 10));
      setClient(task.clientName ?? "");
      setCandidate(task.candidateName ?? "");
      setAssignedTo(task.assignedTo);
    } else if (open) {
      setTitle(""); setDescription(""); setType("follow_up"); setPriority("medium"); setStatus("pending");
      setDueDate(""); setClient(""); setCandidate(""); setAssignedTo("Karthik Subramanian");
    }
  }, [task, open]);

  const submit = () => {
    if (!title) { toast.error("Title is required"); return; }
    onSave({
      title, description, type, priority, status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 86400000).toISOString(),
      relatedTo: task?.relatedTo ?? "manual",
      clientName: client || undefined,
      candidateName: candidate || undefined,
      assignedTo,
      createdAt: task?.createdAt ?? new Date().toISOString(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "Create task"}</DialogTitle>
          <DialogDescription>{task ? "Update task details and status." : "Add a new follow-up, submission, or action item."}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Follow up with TechCorp on Priya's offer" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as TaskItem["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TaskItem["priority"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskItem["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Due date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {clientAccounts.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Candidate</Label>
            <Input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="Optional" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>{task ? "Save changes" : "Create task"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
