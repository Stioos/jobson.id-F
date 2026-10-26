"use client";

import * as React from "react";
import { trainingBudgets, corporateClients } from "@/lib/lms-data";
import type { TrainingBudget } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import { TenantDisclaimer, ChartTooltip } from "./_shared";
import { toast } from "sonner";
import { Plus, Wallet, AlertTriangle, TrendingUp } from "lucide-react";

export function TrainingBudgets() {
  const [rows, setRows] = React.useState<TrainingBudget[]>(trainingBudgets);
  const [clientFilter, setClientFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);

  // form
  const [clientId, setClientId] = React.useState(corporateClients[0]?.id ?? "");
  const [department, setDepartment] = React.useState("Engineering");
  const [allocated, setAllocated] = React.useState(1000000);
  const [used, setUsed] = React.useState(0);
  const [fy, setFy] = React.useState("FY24-25");

  const filtered = rows.filter((b) => clientFilter === "all" || b.clientId === clientId);

  const totalAlloc = filtered.reduce((s, b) => s + b.allocated, 0);
  const totalUsed = filtered.reduce((s, b) => s + b.used, 0);
  const totalRemaining = totalAlloc - totalUsed;
  const utilPct = totalAlloc > 0 ? Math.round((totalUsed / totalAlloc) * 100) : 0;
  const overruns = filtered.filter((b) => b.utilization > 90);

  // Budget by client (stacked)
  const byClient = React.useMemo(() => {
    const map: Record<string, { name: string; allocated: number; used: number }> = {};
    rows.forEach((b) => {
      if (clientFilter !== "all" && b.clientId !== clientFilter) return;
      const key = b.clientName;
      if (!map[key]) map[key] = { name: key.split(" ")[0], allocated: 0, used: 0 };
      map[key].allocated += b.allocated;
      map[key].used += b.used;
    });
    return Object.values(map).map((v) => ({
      ...v,
      allocated: Math.round(v.allocated / 100000),
      used: Math.round(v.used / 100000),
    }));
  }, [rows, clientFilter]);

  function create() {
    const client = corporateClients.find((c) => c.id === clientId);
    const util = allocated > 0 ? Math.round((used / allocated) * 100) : 0;
    const newBudget: TrainingBudget = {
      id: `tb_new_${Date.now()}`,
      clientId, clientName: client?.name ?? "—",
      department, allocated, used,
      remaining: allocated - used,
      utilization: util,
      costPerLearner: 0,
      fy, currency: "INR",
    };
    setRows((r) => [...r, newBudget]);
    setAddOpen(false);
    setAllocated(1000000); setUsed(0);
    toast.success(`Budget added — ${client?.name} · ${department}`);
  }

  function adjust(row: TrainingBudget, delta: number) {
    setRows((r) => r.map((x) => x.id === row.id ? {
      ...x,
      allocated: Math.max(0, x.allocated + delta),
      remaining: Math.max(0, x.allocated + delta) - x.used,
      utilization: (x.allocated + delta) > 0 ? Math.round((x.used / (x.allocated + delta)) * 100) : 0,
    } : x));
    toast.success(`Budget adjusted by ${delta > 0 ? "+" : ""}${formatCurrency(delta)}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Client Budgets"
        description="Allocate and monitor L&D training budgets per client and department."
        icon={<Icon name="Wallet" className="h-6 w-6" />}
        actions={[{ label: "Add budget", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Allocated" value={formatCurrency(totalAlloc)} icon={<Wallet className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Used" value={formatCurrency(totalUsed)} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Remaining" value={formatCurrency(totalRemaining)} icon={<Wallet className="h-5 w-5" />} tone="success" />
        <StatCard label="Utilization" value={`${utilPct}%`} icon={<TrendingUp className="h-5 w-5" />} tone={utilPct > 90 ? "danger" : utilPct > 75 ? "warning" : "default"} hint={`${overruns.length} budgets >90%`} />
      </div>

      {overruns.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-amber-700 dark:text-amber-400">{overruns.length} budget(s) at &gt;90% utilization</p>
            <p className="text-muted-foreground">Review and consider reallocating funds or increasing allocation.</p>
          </div>
        </div>
      )}

      <SectionCard title="Budget Utilization by Client" description="Allocated vs Used (₹ L)">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byClient}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" unit="L" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="allocated" name="Allocated (₹ L)" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="used" name="Used (₹ L)" stackId="b" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="flex items-center gap-2">
        <Select value={clientFilter} onValueChange={(v) => { setClientFilter(v); if (v !== "all") setClientId(v); }}>
          <SelectTrigger className="h-9 w-[220px]"><SelectValue placeholder="Client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Wallet className="h-5 w-5" />} title="No budgets found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Allocated</TableHead>
                  <TableHead className="text-right">Used</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead className="min-w-[140px]">Utilization</TableHead>
                  <TableHead className="text-right">Cost/Learner</TableHead>
                  <TableHead>FY</TableHead>
                  <TableHead className="text-right">Adjust</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="text-sm font-medium">{b.clientName}</TableCell>
                    <TableCell className="text-sm">{b.department}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatCurrency(b.allocated)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(b.used)}</TableCell>
                    <TableCell className={`text-right text-sm font-medium ${b.remaining < 0 ? "text-rose-600 dark:text-rose-400" : ""}`}>{formatCurrency(b.remaining)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={b.utilization} className={`h-1.5 w-16 ${b.utilization > 90 ? "[&>div]:bg-rose-500" : b.utilization > 75 ? "[&>div]:bg-amber-500" : ""}`} />
                        <span className={`text-xs ${b.utilization > 90 ? "text-rose-600 dark:text-rose-400" : b.utilization > 75 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>{b.utilization}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{b.costPerLearner > 0 ? formatCurrency(b.costPerLearner) : "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{b.fy}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => adjust(b, -100000)}>-1L</Button>
                        <Button variant="ghost" size="sm" onClick={() => adjust(b, 100000)}>+1L</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add / Adjust Budget</DialogTitle>
            <DialogDescription>Allocate or update a client's training budget.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="b-dept">Department</Label>
              <Input id="b-dept" value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="b-alloc">Allocated (₹)</Label>
                <Input id="b-alloc" type="number" value={allocated} onChange={(e) => setAllocated(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="b-used">Used (₹)</Label>
                <Input id="b-used" type="number" value={used} onChange={(e) => setUsed(Number(e.target.value))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="b-fy">Financial Year</Label>
              <Input id="b-fy" value={fy} onChange={(e) => setFy(e.target.value)} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={create}>Add budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
