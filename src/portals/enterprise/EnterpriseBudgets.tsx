"use client";

import * as React from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { AlertTriangle, Banknote, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  ENTERPRISE_ENTITIES, BUDGETS, DEPARTMENTS, entityById, formatCompactCurrency,
  ChartCard, ChartTooltip, CHART_COLORS as COLORS, TenantDisclaimer, type BudgetRow,
} from "./_shared";

const budgetSchema = z.object({
  entityId: z.string().min(1, "Required"),
  department: z.string().min(1, "Required"),
  category: z.enum(["job_posts", "agency_fees", "branding", "tools", "referral_bonus"]),
  allocated: z.coerce.number().min(0),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const CATEGORY_LABELS: Record<string, string> = {
  job_posts: "Job Posts",
  agency_fees: "Agency Fees",
  branding: "Branding",
  tools: "Tools & Subscriptions",
  referral_bonus: "Referral Bonus",
};

export function EnterpriseBudgets() {
  const [rows, setRows] = React.useState<BudgetRow[]>(BUDGETS);
  const [entityFilter, setEntityFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema) as Resolver<BudgetFormValues>,
    defaultValues: { entityId: "e_001", department: "Engineering", category: "job_posts", allocated: 0 },
  });
  const entityWatch = useWatch({ control: form.control, name: "entityId" });
  const departmentWatch = useWatch({ control: form.control, name: "department" });
  const categoryWatch = useWatch({ control: form.control, name: "category" });

  const filtered = rows.filter((r) => entityFilter === "all" || r.entityId === entityFilter);

  const totalAllocated = filtered.reduce((s, r) => s + r.allocated, 0);
  const totalSpent = filtered.reduce((s, r) => s + r.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const totalUtilPct = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
  const overruns = filtered.filter((r) => r.allocated > 0 && r.spent > r.allocated);

  const byCategory = React.useMemo(() => {
    const map: Record<string, { allocated: number; spent: number }> = {};
    for (const r of filtered) {
      if (!map[r.category]) map[r.category] = { allocated: 0, spent: 0 };
      map[r.category].allocated += r.allocated;
      map[r.category].spent += r.spent;
    }
    return Object.entries(map).map(([k, v]) => ({
      name: CATEGORY_LABELS[k] ?? k,
      value: v.spent,
      allocated: v.allocated,
    }));
  }, [filtered]);

  function onSubmit(values: BudgetFormValues) {
    const newRow: BudgetRow = {
      id: `b_new_${Date.now()}`,
      entityId: values.entityId,
      department: values.department,
      allocated: values.allocated,
      spent: 0,
      category: values.category,
      currency: "INR",
    };
    setRows((r) => [...r, newRow]);
    setAddOpen(false);
    form.reset();
    toast.success(`Budget added — ${entityById(values.entityId)?.name} · ${values.department} · ${formatCompactCurrency(values.allocated)}`);
  }

  function adjust(row: BudgetRow, delta: number) {
    setRows((r) => r.map((x) => x.id === row.id ? { ...x, allocated: Math.max(0, x.allocated + delta) } : x));
    toast.success(`Budget adjusted by ${delta > 0 ? "+" : ""}${formatCompactCurrency(delta)}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Recruitment Budgets"
        description="Allocate and monitor recruitment spend across entities and categories."
        icon={<Icon name="Banknote" className="h-6 w-6" />}
        actions={[{ label: "Add budget", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />

      <TenantDisclaimer />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Entity:</span>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="h-9 w-[240px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities</SelectItem>
            {ENTERPRISE_ENTITIES.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Allocated" value={formatCompactCurrency(totalAllocated)} icon={<Banknote className="h-5 w-5" />} tone="brand" />
        <StatCard label="Spent" value={formatCompactCurrency(totalSpent)} icon={<Banknote className="h-5 w-5" />} tone={totalUtilPct > 80 ? "warning" : "default"} />
        <StatCard label="Remaining" value={formatCompactCurrency(totalRemaining)} icon={<Banknote className="h-5 w-5" />} tone={totalRemaining > 0 ? "success" : "danger"} />
        <StatCard label="Utilization" value={`${totalUtilPct}%`} icon={<Banknote className="h-5 w-5" />} tone={totalUtilPct > 80 ? "warning" : "default"} />
      </div>

      {overruns.length > 0 && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                {overruns.length} budget overrun{overruns.length > 1 ? "s" : ""} detected
              </p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                {overruns.map((o) => {
                  const ent = entityById(o.entityId);
                  return (
                    <li key={o.id}>
                      {ent?.name} · {o.department} · {CATEGORY_LABELS[o.category]} — spent {formatCompactCurrency(o.spent)} of {formatCompactCurrency(o.allocated)} ({Math.round((o.spent / o.allocated) * 100)}%)
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title={`Budget rows (${filtered.length})`} description="Allocated, spent, remaining, and utilization per entity/department." className="lg:col-span-2"
          action={<Button size="sm" variant="ghost" onClick={() => toast.success("Budget export (CSV) generated")}>Export</Button>}
        >
          {filtered.length === 0 ? (
            <EmptyState icon={<Banknote className="h-5 w-5" />} title="No budgets" />
          ) : (
            <div className="max-h-[30rem] overflow-y-auto scroll-thin rounded-lg border">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Entity / Dept</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead className="text-right">Adjust</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const ent = entityById(r.entityId);
                    const util = r.allocated > 0 ? Math.round((r.spent / r.allocated) * 100) : 0;
                    const over = r.spent > r.allocated;
                    return (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {ent && <AvatarLogo text={ent.logo} size="xs" />}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{ent?.name}</p>
                              <p className="text-xs text-muted-foreground">{r.department}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{CATEGORY_LABELS[r.category]}</TableCell>
                        <TableCell className="text-right text-sm">{formatCompactCurrency(r.allocated, r.currency)}</TableCell>
                        <TableCell className="text-right text-sm">{formatCompactCurrency(r.spent, r.currency)}</TableCell>
                        <TableCell className="text-right text-sm">
                          <span className={over ? "text-rose-600 dark:text-rose-400 font-medium" : ""}>
                            {formatCompactCurrency(r.allocated - r.spent, r.currency)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(100, util)} className="h-2 w-16" />
                            <span className={`text-xs font-medium ${over ? "text-rose-600 dark:text-rose-400" : util > 80 ? "text-amber-600 dark:text-amber-400" : ""}`}>{util}%</span>
                            {over && <StatusBadge status="overdue" className="ml-1" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => adjust(r, -100000)}>−</Button>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => adjust(r, 100000)}>+</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>

        <ChartCard title="Spend by category" description="Recruitment spend broken down by category">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add budget allocation</DialogTitle>
            <DialogDescription>Allocate a new recruitment budget line for an entity/department.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Entity" error={form.formState.errors.entityId?.message}>
                <Select value={entityWatch} onValueChange={(v) => form.setValue("entityId", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ENTERPRISE_ENTITIES.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Department" error={form.formState.errors.department?.message}>
                <Select value={departmentWatch} onValueChange={(v) => form.setValue("department", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <Select value={categoryWatch} onValueChange={(v) => form.setValue("category", v as BudgetFormValues["category"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Allocated (₹)" error={form.formState.errors.allocated?.message}>
                <Input type="number" {...form.register("allocated")} placeholder="0" />
              </Field>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add budget</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
