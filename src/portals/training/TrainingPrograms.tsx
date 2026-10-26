"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trainingPrograms, corporateClients } from "@/lib/lms-data";
import type { TrainingProgram } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, Target, Users, CheckCircle2, Banknote, TrendingUp } from "lucide-react";

const programSchema = z.object({
  name: z.string().min(2, "Required"),
  description: z.string().min(5, "Provide a brief description"),
  clientId: z.string().min(1, "Required"),
  type: z.enum(["onboarding", "compliance", "upskilling", "leadership", "certification"]),
  targetLearners: z.coerce.number().min(1, "At least 1"),
  budget: z.coerce.number().min(0),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
});
type FormValues = z.infer<typeof programSchema>;

const TYPE_LABELS: Record<string, string> = {
  onboarding: "Onboarding", compliance: "Compliance", upskilling: "Upskilling",
  leadership: "Leadership", certification: "Certification",
};

export function TrainingPrograms() {
  const [rows, setRows] = React.useState<TrainingProgram[]>(trainingPrograms);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<TrainingProgram | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(programSchema) as Resolver<FormValues>,
    defaultValues: { name: "", description: "", clientId: corporateClients[0]?.id ?? "", type: "upskilling", targetLearners: 50, budget: 500000, startDate: new Date().toISOString().slice(0, 10), endDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10) },
  });

  const filtered = rows.filter((p) => {
    const matchType = typeFilter === "all" || p.type === typeFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchType && matchStatus;
  });

  const totalTarget = filtered.reduce((s, p) => s + p.targetLearners, 0);
  const totalEnrolled = filtered.reduce((s, p) => s + p.enrolled, 0);
  const totalCompleted = filtered.reduce((s, p) => s + p.completed, 0);
  const totalBudget = filtered.reduce((s, p) => s + (p.budget ?? 0), 0);

  function onSubmit(values: FormValues) {
    const client = corporateClients.find((c) => c.id === values.clientId);
    const newProg: TrainingProgram = {
      id: `tp_new_${Date.now()}`,
      name: values.name,
      description: values.description,
      clientId: values.clientId,
      clientName: client?.name ?? "—",
      type: values.type,
      targetLearners: values.targetLearners,
      enrolled: 0,
      completed: 0,
      startDate: values.startDate,
      endDate: values.endDate,
      status: "scheduled",
      budget: values.budget,
      currency: "INR",
    };
    setRows((r) => [newProg, ...r]);
    setAddOpen(false);
    form.reset();
    toast.success(`Program created — ${values.name}`, { description: `Scheduled for ${client?.name}.` });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Training Programs"
        description="Multi-course training initiatives scoped to corporate clients."
        icon={<Icon name="Target" className="h-6 w-6" />}
        actions={[{ label: "Create program", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Programs" value={filtered.filter((p) => p.status === "active").length} icon={<Target className="h-5 w-5" />} tone="brand" />
        <StatCard label="Target Learners" value={formatNumber(totalTarget)} icon={<Users className="h-5 w-5" />} hint={`${formatNumber(totalEnrolled)} enrolled`} />
        <StatCard label="Completed" value={formatNumber(totalCompleted)} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Budget" value={formatCurrency(totalBudget)} icon={<Banknote className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Target className="h-5 w-5" />} title="No programs found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Target</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="min-w-[140px]">Progress</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const pct = p.targetLearners > 0 ? Math.round((p.enrolled / p.targetLearners) * 100) : 0;
                  return (
                    <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(p)}>
                      <TableCell>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                      </TableCell>
                      <TableCell className="text-sm">{p.clientName}</TableCell>
                      <TableCell><StatusBadge status={p.type === "compliance" ? "completed" : p.type === "leadership" ? "offer" : p.type === "onboarding" ? "hired" : "active"} className="capitalize" /></TableCell>
                      <TableCell className="text-right text-sm">{p.targetLearners}</TableCell>
                      <TableCell className="text-right text-sm">{p.enrolled}</TableCell>
                      <TableCell className="text-right text-sm">{p.completed}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1.5 w-16" />
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(p.startDate)} → {formatDate(p.endDate)}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                      <TableCell className="text-right text-sm font-medium">{p.budget ? formatCurrency(p.budget) : "—"}</TableCell>
                    </TableRow>
                  );
                })}
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
                <SheetTitle>{detail.name}</SheetTitle>
                <SheetDescription>{detail.clientName} · {TYPE_LABELS[detail.type]}</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">{detail.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Target / Enrolled</p>
                    <p className="text-lg font-semibold">{detail.enrolled}/{detail.targetLearners}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-lg font-semibold">{detail.completed}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-lg font-semibold">{detail.budget ? formatCurrency(detail.budget) : "—"}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Cost / Learner</p>
                    <p className="text-lg font-semibold">{detail.budget && detail.enrolled > 0 ? formatCurrency(Math.round(detail.budget / detail.enrolled)) : "—"}</p>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-2">Enrollment Progress</p>
                  <Progress value={detail.targetLearners > 0 ? (detail.enrolled / detail.targetLearners) * 100 : 0} className="h-2" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-brand" />
                  <span className="text-muted-foreground">Timeline:</span>
                  <span>{formatDate(detail.startDate)} → {formatDate(detail.endDate)}</span>
                </div>
                <Button className="w-full" onClick={() => toast.info("Opening program workspace…")}>Open program workspace</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Training Program</DialogTitle>
            <DialogDescription>Define scope, target learners, and budget for a client program.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="p-name">Program name *</Label>
              <Input id="p-name" {...form.register("name")} className="mt-1" />
              {form.formState.errors.name && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="p-desc">Description *</Label>
              <Textarea id="p-desc" {...form.register("description")} className="mt-1 min-h-[80px]" />
              {form.formState.errors.description && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.description.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-client">Client *</Label>
                <Select defaultValue={form.getValues("clientId")} onValueChange={(v) => form.setValue("clientId", v)}>
                  <SelectTrigger id="p-client" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-type">Type</Label>
                <Select defaultValue="upskilling" onValueChange={(v) => form.setValue("type", v as FormValues["type"])}>
                  <SelectTrigger id="p-type" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-target">Target learners *</Label>
                <Input id="p-target" type="number" {...form.register("targetLearners")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="p-budget">Budget (₹)</Label>
                <Input id="p-budget" type="number" {...form.register("budget")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="p-start">Start date *</Label>
                <Input id="p-start" type="date" {...form.register("startDate")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="p-end">End date *</Label>
                <Input id="p-end" type="date" {...form.register("endDate")} className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Create program</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
