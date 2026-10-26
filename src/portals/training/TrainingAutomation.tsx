"use client";

import * as React from "react";
import { workflowAutomations } from "@/lib/lms-data";
import type { WorkflowAutomation } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { formatDateTime, timeAgo, formatNumber } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, Sparkles, Zap, Clock, Play, Pause, X, ArrowRight } from "lucide-react";

const TRIGGER_OPTIONS = [
  "New employee added",
  "Course completion 100%",
  "Assessment passed",
  "Assessment failed",
  "14 days before due date",
  "7 days before due date",
  "No activity for 14 days",
  "2 days post-completion",
  "Cohort started",
  "Certificate issued",
  "Certificate expiring in 30 days",
  "Compliance deadline missed",
];

export function TrainingAutomation() {
  const [rows, setRows] = React.useState<WorkflowAutomation[]>(workflowAutomations);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<WorkflowAutomation | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  // form
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [trigger, setTrigger] = React.useState(TRIGGER_OPTIONS[0]);
  const [actions, setActions] = React.useState<string[]>([]);
  const [actionInput, setActionInput] = React.useState("");

  const filtered = rows.filter((w) => statusFilter === "all" || w.status === statusFilter);
  const activeCount = rows.filter((w) => w.status === "active").length;
  const totalRuns = rows.reduce((s, w) => s + w.runs, 0);
  const totalActions = rows.reduce((s, w) => s + w.actions.length, 0);

  function toggle(w: WorkflowAutomation) {
    setRows((r) => r.map((x) => x.id === w.id ? { ...x, status: x.status === "active" ? "paused" : "active" } : x));
    toast.success(`${w.name} ${w.status === "active" ? "paused" : "activated"}`);
  }

  function addAction() {
    if (!actionInput.trim()) return;
    setActions((a) => [...a, actionInput.trim()]);
    setActionInput("");
  }

  function create() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (actions.length === 0) { toast.error("Add at least one action"); return; }
    const newWf: WorkflowAutomation = {
      id: `wf_new_${Date.now()}`,
      name, description: description || "Custom workflow",
      trigger, actions, status: "active", runs: 0,
    };
    setRows((r) => [newWf, ...r]);
    setAddOpen(false);
    setName(""); setDescription(""); setActions([]);
    toast.success(`Workflow created — ${name}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Automation & Workflows"
        description="Automate repetitive training operations with trigger-based workflows."
        icon={<Icon name="Sparkles" className="h-6 w-6" />}
        actions={[{ label: "Create workflow", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Workflows" value={rows.length} icon={<Sparkles className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<Zap className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Runs" value={formatNumber(totalRuns)} icon={<Play className="h-5 w-5" />} />
        <StatCard label="Actions Configured" value={totalActions} icon={<ArrowRight className="h-5 w-5" />} />
      </div>

      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Sparkles className="h-5 w-5" />} title="No workflows found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead className="text-right">Runs</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Toggle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((w) => (
                  <TableRow key={w.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(w)}>
                    <TableCell>
                      <p className="font-medium text-sm">{w.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{w.description}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[180px]">{w.trigger}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {w.actions.slice(0, 2).map((a, i) => <Badge key={i} variant="secondary" className="text-[10px]">{a}</Badge>)}
                        {w.actions.length > 2 && <Badge variant="outline" className="text-[10px]">+{w.actions.length - 2}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatNumber(w.runs)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{w.lastRun ? timeAgo(w.lastRun) : "—"}</TableCell>
                    <TableCell><StatusBadge status={w.status === "active" ? "active" : w.status === "paused" ? "paused" : "draft"} /></TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end">
                        <Switch checked={w.status === "active"} onCheckedChange={() => toggle(w)} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{detail.name}</SheetTitle>
                <SheetDescription>{detail.description}</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Total runs</p>
                    <p className="text-lg font-semibold">{formatNumber(detail.runs)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Last run</p>
                    <p className="text-sm font-semibold">{detail.lastRun ? formatDateTime(detail.lastRun) : "—"}</p>
                  </div>
                </div>

                <SectionCard title="Trigger Configuration">
                  <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 flex items-center gap-3">
                    <Zap className="h-5 w-5 text-brand" />
                    <div>
                      <p className="text-xs font-medium text-brand uppercase">When</p>
                      <p className="text-sm font-medium">{detail.trigger}</p>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title={`Actions (${detail.actions.length})`}>
                  <ol className="space-y-2">
                    {detail.actions.map((a, i) => (
                      <li key={i} className="flex items-center gap-3 rounded-lg border p-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                        <span className="text-sm">{a}</span>
                        {i < detail.actions.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto rotate-90" />}
                      </li>
                    ))}
                  </ol>
                </SectionCard>

                <SectionCard title="Recent Run History" description="Synthetic execution log">
                  <ul className="space-y-1.5 max-h-40 overflow-y-auto scroll-thin">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <li key={i} className="flex items-center justify-between text-sm border-b pb-1.5 last:border-b-0">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>Run #{detail.runs - i + 1}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">{i}h ago</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => toggle(detail)}>
                    {detail.status === "active" ? <><Pause className="mr-1 h-4 w-4" />Pause</> : <><Play className="mr-1 h-4 w-4" />Activate</>}
                  </Button>
                  <Button className="flex-1" onClick={() => toast.info(`Manual run: ${detail.name}`)}>Run now</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Workflow</DialogTitle>
            <DialogDescription>Configure trigger and actions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="w-name">Workflow name *</Label>
              <Input id="w-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="w-desc">Description</Label>
              <Textarea id="w-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-[60px]" />
            </div>
            <div>
              <Label>Trigger</Label>
              <Select value={trigger} onValueChange={setTrigger}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{TRIGGER_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Actions ({actions.length})</Label>
              <div className="mt-2 space-y-2">
                {actions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                    <Input value={a} onChange={(e) => setActions((arr) => arr.map((x, j) => j === i ? e.target.value : x))} />
                    <Button variant="ghost" size="sm" onClick={() => setActions((arr) => arr.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input value={actionInput} onChange={(e) => setActionInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAction(); } }} placeholder="Add action (e.g. Email learner)" />
                  <Button variant="outline" onClick={addAction}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={create}>Create workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
