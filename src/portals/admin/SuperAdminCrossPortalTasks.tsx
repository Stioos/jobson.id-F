"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

type TaskType = "Review" | "Approve" | "Contact" | "Submit" | "Verify";
type Priority = "low" | "medium" | "high" | "urgent";
type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
type Portal = "Candidate" | "Employer" | "Recruiter" | "Training" | "Partner" | "Admin";
type RelatedRecordType = "Placement" | "Application" | "Invoice";

interface TaskChainStep {
  portal: Portal;
  role: string;
  status: "Done" | "Current" | "Upcoming";
  at?: string;
}

interface CrossPortalTask {
  id: string;
  title: string;
  assignedBy: { name: string; portal: Portal };
  assignedTo: { name: string; portal: Portal };
  type: TaskType;
  relatedRecord: { id: string; type: RelatedRecordType };
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  chain: TaskChainStep[];
}

const PORTAL_TONES: Record<Portal, string> = {
  Candidate: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Employer: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Recruiter: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Training: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  Partner: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Admin: "bg-slate-500/15 text-slate-700 border-slate-500/30",
};

const TYPE_TONES: Record<TaskType, string> = {
  Review: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Approve: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Contact: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  Submit: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Verify: "bg-violet-500/15 text-violet-700 border-violet-500/30",
};

const PRIORITY_TONES: Record<Priority, string> = {
  low: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  medium: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  high: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  urgent: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const STATUS_TONES: Record<TaskStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "In Progress": "bg-cyan-500/15 text-cyan-700 border-cyan-500/30",
  Completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Overdue: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

const TASKS: CrossPortalTask[] = [
  { id: "XT-9001", title: "Review candidate Aarav Sharma for Senior Frontend role", assignedBy: { name: "TechCorp HM", portal: "Employer" }, assignedTo: { name: "TalentBridge Recruiter", portal: "Recruiter" }, type: "Review", relatedRecord: { id: "AP-7001", type: "Application" }, dueDate: "2024-09-22T18:00:00Z", priority: "high", status: "In Progress", chain: [
    { portal: "Employer", role: "Hiring Manager", status: "Done", at: "2024-09-20T10:00:00Z" },
    { portal: "Recruiter", role: "Recruiter", status: "Current" },
    { portal: "Employer", role: "Hiring Manager", status: "Upcoming" },
  ]},
  { id: "XT-9002", title: "Approve refund for CloudOps Solutions", assignedBy: { name: "Support Lead", portal: "Admin" }, assignedTo: { name: "Finance Manager", portal: "Admin" }, type: "Approve", relatedRecord: { id: "INV-2024-001", type: "Invoice" }, dueDate: "2024-09-23T12:00:00Z", priority: "urgent", status: "Pending", chain: [
    { portal: "Admin", role: "Support Lead", status: "Done", at: "2024-09-21T10:00:00Z" },
    { portal: "Admin", role: "Finance Manager", status: "Current" },
  ]},
  { id: "XT-9003", title: "Contact candidate Diya Patel about rescheduling interview", assignedBy: { name: "CloudOps HM", portal: "Employer" }, assignedTo: { name: "Apex Recruiter", portal: "Recruiter" }, type: "Contact", relatedRecord: { id: "AP-7002", type: "Application" }, dueDate: "2024-09-22T15:00:00Z", priority: "high", status: "Pending", chain: [
    { portal: "Employer", role: "Hiring Manager", status: "Done", at: "2024-09-21T09:00:00Z" },
    { portal: "Recruiter", role: "Recruiter", status: "Current" },
    { portal: "Candidate", role: "Candidate", status: "Upcoming" },
  ]},
  { id: "XT-9004", title: "Submit BGV report for Rohan Mehta", assignedBy: { name: "BrightApps HM", portal: "Employer" }, assignedTo: { name: "BGV Vendor", portal: "Partner" }, type: "Submit", relatedRecord: { id: "PL-9003", type: "Placement" }, dueDate: "2024-09-25T18:00:00Z", priority: "medium", status: "Pending", chain: [
    { portal: "Employer", role: "Hiring Manager", status: "Done", at: "2024-09-20T14:00:00Z" },
    { portal: "Partner", role: "BGV Vendor", status: "Current" },
    { portal: "Employer", role: "Hiring Manager", status: "Upcoming" },
  ]},
  { id: "XT-9005", title: "Verify certification for Ananya Iyer", assignedBy: { name: "Nimbus Labs HM", portal: "Employer" }, assignedTo: { name: "SkillForge Trainer", portal: "Training" }, type: "Verify", relatedRecord: { id: "PL-9007", type: "Placement" }, dueDate: "2024-09-21T18:00:00Z", priority: "high", status: "Completed", chain: [
    { portal: "Employer", role: "Hiring Manager", status: "Done", at: "2024-09-18T10:00:00Z" },
    { portal: "Training", role: "Trainer", status: "Done", at: "2024-09-18T15:00:00Z" },
    { portal: "Employer", role: "Hiring Manager", status: "Done", at: "2024-09-18T15:30:00Z" },
  ]},
  { id: "XT-9006", title: "Approve T2H enrollment for Karthik Rao", assignedBy: { name: "EduBridge Admin", portal: "Partner" }, assignedTo: { name: "Curriculum Lead", portal: "Admin" }, type: "Approve", relatedRecord: { id: "EN-4002", type: "Application" }, dueDate: "2024-09-20T18:00:00Z", priority: "medium", status: "Overdue", chain: [
    { portal: "Partner", role: "Partner Admin", status: "Done", at: "2024-09-18T11:00:00Z" },
    { portal: "Admin", role: "Curriculum Lead", status: "Current" },
  ]},
  { id: "XT-9007", title: "Review offer terms for Vivek Nair", assignedBy: { name: "BrightApps HM", portal: "Employer" }, assignedTo: { name: "Finance Controller", portal: "Admin" }, type: "Review", relatedRecord: { id: "OF-3001", type: "Application" }, dueDate: "2024-09-22T12:00:00Z", priority: "high", status: "In Progress", chain: [
    { portal: "Employer", role: "Hiring Manager", status: "Done", at: "2024-09-20T10:00:00Z" },
    { portal: "Admin", role: "Finance Controller", status: "Current" },
    { portal: "Employer", role: "Hiring Manager", status: "Upcoming" },
  ]},
  { id: "XT-9008", title: "Submit timesheet for Sahil Verma", assignedBy: { name: "BrightApps HR", portal: "Employer" }, assignedTo: { name: "Apex Recruiter", portal: "Recruiter" }, type: "Submit", relatedRecord: { id: "PL-9020", type: "Placement" }, dueDate: "2024-09-19T18:00:00Z", priority: "medium", status: "Completed", chain: [
    { portal: "Employer", role: "HR", status: "Done", at: "2024-09-17T10:00:00Z" },
    { portal: "Recruiter", role: "Recruiter", status: "Done", at: "2024-09-17T15:00:00Z" },
    { portal: "Admin", role: "Finance", status: "Done", at: "2024-09-18T10:00:00Z" },
  ]},
  { id: "XT-9009", title: "Contact partner about placement guarantee claim", assignedBy: { name: "CloudOps HR", portal: "Employer" }, assignedTo: { name: "EduBridge Foundation", portal: "Partner" }, type: "Contact", relatedRecord: { id: "GC-6004", type: "Placement" }, dueDate: "2024-09-24T12:00:00Z", priority: "urgent", status: "Pending", chain: [
    { portal: "Employer", role: "HR", status: "Done", at: "2024-09-21T14:00:00Z" },
    { portal: "Partner", role: "Partner Admin", status: "Current" },
  ]},
  { id: "XT-9010", title: "Verify candidate credentials for Meera Joshi", assignedBy: { name: "CloudOps HM", portal: "Employer" }, assignedTo: { name: "SkillForge Trainer", portal: "Training" }, type: "Verify", relatedRecord: { id: "PL-9010", type: "Placement" }, dueDate: "2024-09-26T18:00:00Z", priority: "low", status: "Pending", chain: [
    { portal: "Employer", role: "Hiring Manager", status: "Done", at: "2024-09-21T10:00:00Z" },
    { portal: "Training", role: "Trainer", status: "Current" },
    { portal: "Employer", role: "Hiring Manager", status: "Upcoming" },
  ]},
  { id: "XT-9011", title: "Approve commission payout for Apex Staffing", assignedBy: { name: "System", portal: "Admin" }, assignedTo: { name: "Finance Lead", portal: "Admin" }, type: "Approve", relatedRecord: { id: "INV-2024-005", type: "Invoice" }, dueDate: "2024-09-22T15:00:00Z", priority: "high", status: "In Progress", chain: [
    { portal: "Admin", role: "System", status: "Done", at: "2024-09-20T08:00:00Z" },
    { portal: "Admin", role: "Finance Lead", status: "Current" },
  ]},
  { id: "XT-9012", title: "Review MoU from Campus Connect", assignedBy: { name: "Campus Connect Admin", portal: "Partner" }, assignedTo: { name: "Partnership Head", portal: "Admin" }, type: "Review", relatedRecord: { id: "MOU-3001", type: "Application" }, dueDate: "2024-09-21T18:00:00Z", priority: "high", status: "Overdue", chain: [
    { portal: "Partner", role: "Partner Admin", status: "Done", at: "2024-09-17T11:00:00Z" },
    { portal: "Admin", role: "Partnership Head", status: "Current" },
  ]},
];

export function SuperAdminCrossPortalTasks() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [newTask, setNewTask] = React.useState({ title: "", targetPortal: "Recruiter", taskType: "Review", dueDate: "" });

  const filtered = TASKS.filter(t => {
    const q = search.toLowerCase();
    const m = !q || t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.assignedTo.name.toLowerCase().includes(q);
    const s = status === "all" || t.status === status;
    const ty = type === "all" || t.type === type;
    return m && s && ty;
  });

  const pending = TASKS.filter(t => t.status === "Pending").length;
  const completed = TASKS.filter(t => t.status === "Completed").length;
  const overdue = TASKS.filter(t => t.status === "Overdue").length;
  const portalPairs = new Set(TASKS.map(t => `${t.assignedBy.portal}→${t.assignedTo.portal}`)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Portal Tasks"
        description="Cross-portal task assignment tracker — review, approve, contact, submit, and verify tasks routed between portals, with full chain visibility and overdue SLA tracking."
        icon={<Icon name="CheckSquare" className="h-6 w-6" />}
        actions={[
          { label: "New Task", variant: "default", onClick: () => setShowForm(s => !s) },
          { label: "Export", variant: "outline", onClick: () => toast.success("Exporting cross-portal tasks…") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Cross-Portal Tasks" value={TASKS.length} icon={<Icon name="CheckSquare" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending" value={pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed" value={completed} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Overdue" value={overdue} hint={`${portalPairs} portal pairs`} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      {showForm && (
        <SectionCard title="Create Cross-Portal Task" description="Assign a task to a user in another portal">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Input placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
            <Select value={newTask.targetPortal} onValueChange={(v) => setNewTask({ ...newTask, targetPortal: v })}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Target Portal" /></SelectTrigger>
              <SelectContent>
                {(["Candidate", "Employer", "Recruiter", "Training", "Partner", "Admin"] as Portal[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={newTask.taskType} onValueChange={(v) => setNewTask({ ...newTask, taskType: v })}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Task Type" /></SelectTrigger>
              <SelectContent>
                {(["Review", "Approve", "Contact", "Submit", "Verify"] as TaskType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="default" onClick={() => {
              if (!newTask.title || !newTask.dueDate) {
                toast.error("Please fill in title and due date");
                return;
              }
              toast.success(`Task assigned to ${newTask.targetPortal} portal`);
              setShowForm(false);
              setNewTask({ title: "", targetPortal: "Recruiter", taskType: "Review", dueDate: "" });
            }}>Assign Task</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Task Queue" description={`${filtered.length} of ${TASKS.length} cross-portal tasks`}>
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search task ID, title, assignee…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(["Review", "Approve", "Contact", "Submit", "Verify"] as TaskType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="CheckSquare" className="h-6 w-6" />} title="No tasks match filters" />
        ) : (
          <div className="max-h-[36rem] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Task ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Related Record</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(t => (
                  <React.Fragment key={t.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                    >
                      <TableCell className="p-2"><Icon name={expanded === t.id ? "ChevronDown" : "ChevronRight"} className="h-4 w-4 text-muted-foreground" /></TableCell>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="text-xs font-medium max-w-[18rem] truncate">{t.title}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span>{t.assignedBy.name}</span>
                          <Badge variant="outline" className={`w-fit text-[10px] ${PORTAL_TONES[t.assignedBy.portal]}`}>{t.assignedBy.portal}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span>{t.assignedTo.name}</span>
                          <Badge variant="outline" className={`w-fit text-[10px] ${PORTAL_TONES[t.assignedTo.portal]}`}>{t.assignedTo.portal}</Badge>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${TYPE_TONES[t.type]}`}>{t.type}</Badge></TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground">{t.relatedRecord.id}</TableCell>
                      <TableCell className={`text-[10px] ${t.status === "Overdue" ? "text-rose-600 font-semibold" : ""}`}>{new Date(t.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${PRIORITY_TONES[t.priority]}`}>{t.priority}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${STATUS_TONES[t.status]}`}>{t.status}</Badge></TableCell>
                    </TableRow>
                    {expanded === t.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={10} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon name="Workflow" className="h-4 w-4 text-brand" />
                                <p className="text-sm font-semibold">Task Chain · {t.id}</p>
                              </div>
                              {t.status !== "Completed" && (
                                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => toast.success(`${t.id} marked complete — notifying ${t.assignedBy.portal} portal`)}>
                                  <Icon name="CheckCircle2" className="mr-1 h-3 w-3" /> Mark Complete
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Related: <span className="font-mono">{t.relatedRecord.id}</span> ({t.relatedRecord.type})
                            </p>
                            <div className="flex flex-wrap items-stretch gap-2">
                              {t.chain.map((c, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`rounded-lg border p-3 ${c.status === "Done" ? "border-emerald-500/30 bg-emerald-500/5" : c.status === "Current" ? "border-amber-500/30 bg-amber-500/5" : "border-muted bg-muted/30"}`}>
                                    <div className="flex items-center gap-2">
                                      <Icon name={c.status === "Done" ? "CheckCircle2" : c.status === "Current" ? "Clock" : "CircleDot"} className={`h-4 w-4 ${c.status === "Done" ? "text-emerald-600" : c.status === "Current" ? "text-amber-600" : "text-muted-foreground"}`} />
                                      <Badge variant="outline" className={`text-[10px] ${PORTAL_TONES[c.portal]}`}>{c.portal}</Badge>
                                    </div>
                                    <p className="mt-1 text-xs font-medium">{c.role}</p>
                                    {c.at && <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(c.at)}</p>}
                                  </div>
                                  {i < t.chain.length - 1 && <Icon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
