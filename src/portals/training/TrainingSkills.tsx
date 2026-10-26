"use client";

import * as React from "react";
import { skillFrameworks } from "@/lib/lms-data";
import type { SkillFramework } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/format";
import { TenantDisclaimer, ChartTooltip } from "./_shared";
import { toast } from "sonner";
import { Plus, Brain, TrendingUp, Users } from "lucide-react";

const DEMAND_COLORS: Record<string, string> = {
  critical: "#ef4444", high: "#f59e0b", medium: "#0ea5e9", low: "#94a3b8",
};

export function TrainingSkills() {
  const [rows, setRows] = React.useState<SkillFramework[]>(skillFrameworks);
  const [detail, setDetail] = React.useState<SkillFramework | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Frontend");
  const [newDesc, setNewDesc] = React.useState("");
  const [newDemand, setNewDemand] = React.useState<SkillFramework["demand"]>("high");

  const totalEmployees = rows.reduce((s, x) => s + x.employeesWithSkill, 0);
  const criticalCount = rows.filter((x) => x.demand === "critical").length;
  const highDemandCount = rows.filter((x) => x.demand === "high" || x.demand === "critical").length;

  function create() {
    if (!newName.trim()) { toast.error("Name is required"); return; }
    const newSkill: SkillFramework = {
      id: `sf_new_${Date.now()}`,
      name: newName,
      category: newCategory,
      description: newDesc || `${newName} skill framework`,
      levels: [
        { level: 1, label: "Beginner", description: "Basic understanding" },
        { level: 2, label: "Intermediate", description: "Practical application" },
        { level: 3, label: "Advanced", description: "Deep expertise" },
        { level: 4, label: "Expert", description: "Architecture & leadership" },
        { level: 5, label: "Master", description: "Teaching and contribution" },
      ],
      employeesWithSkill: 0,
      demand: newDemand,
      trend: 10,
    };
    setRows((r) => [...r, newSkill]);
    setAddOpen(false);
    setNewName(""); setNewDesc("");
    toast.success(`Skill framework created — ${newName}`);
  }

  // Demand heatmap data
  const heatmap = rows.map((s) => ({
    name: s.name,
    demand: s.demand,
    color: DEMAND_COLORS[s.demand],
    value: s.employeesWithSkill,
    trend: s.trend,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Skill Frameworks"
        description="Define skill taxonomies with proficiency levels and demand signals."
        icon={<Icon name="Brain" className="h-6 w-6" />}
        actions={[{ label: "Create skill", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Skills" value={rows.length} icon={<Brain className="h-5 w-5" />} tone="brand" />
        <StatCard label="Critical Demand" value={criticalCount} icon={<TrendingUp className="h-5 w-5" />} tone="danger" />
        <StatCard label="High+ Demand" value={highDemandCount} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
        <StatCard label="Total Employees" value={formatNumber(totalEmployees)} icon={<Users className="h-5 w-5" />} />
      </div>

      <SectionCard>
        {rows.length === 0 ? (
          <EmptyState icon={<Brain className="h-5 w-5" />} title="No skills defined" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Levels</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead>Demand</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(s)}>
                    <TableCell className="font-medium text-sm">{s.name}</TableCell>
                    <TableCell className="text-sm">{s.category}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[260px] truncate">{s.description}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{s.levels.length} levels</Badge></TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatNumber(s.employeesWithSkill)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="h-2 w-2 rounded-full" style={{ background: DEMAND_COLORS[s.demand] }} />
                        <span className="capitalize">{s.demand}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <span className={s.trend > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                        {s.trend > 0 ? "↑" : "↓"} {Math.abs(s.trend)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Demand heatmap */}
      <SectionCard title="Demand Heatmap" description="Skill demand across portfolio">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {heatmap.map((h) => (
            <div key={h.name} className="rounded-lg border p-3" style={{ borderLeftColor: h.color, borderLeftWidth: 3 }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{h.name}</p>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: h.color }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{formatNumber(h.value)} employees · trend {h.trend > 0 ? "+" : ""}{h.trend}%</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{detail.name}</SheetTitle>
                <SheetDescription>{detail.category} · <span className="capitalize">{detail.demand}</span> demand</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">{detail.description}</p>

                <SectionCard title="Demand Trend" description="Last 6 months (synthetic)">
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Array.from({ length: 6 }).map((_, i) => ({ month: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"][i], demand: Math.max(0, detail.trend - 8 + i * 3) }))}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                        <YAxis tickLine={false} axisLine={false} className="text-xs" />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                        <Bar dataKey="demand" name="Demand %" fill={DEMAND_COLORS[detail.demand]} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </SectionCard>

                <SectionCard title="Proficiency Levels">
                  <ol className="space-y-2">
                    {detail.levels.map((l) => (
                      <li key={l.level} className="flex items-start gap-3 rounded-lg border p-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{l.level}</span>
                        <div>
                          <p className="text-sm font-medium">{l.label}</p>
                          <p className="text-xs text-muted-foreground">{l.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </SectionCard>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Employees with skill</p>
                    <p className="font-semibold">{formatNumber(detail.employeesWithSkill)}</p>
                  </div>
                </div>

                <Button className="w-full" onClick={() => toast.info(`Opening skill analytics: ${detail.name}`)}>View analytics</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Skill Framework</DialogTitle>
            <DialogDescription>Define a new skill taxonomy.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="s-name">Skill name *</Label>
              <Input id="s-name" value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="s-cat">Category</Label>
              <Input id="s-cat" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="s-desc">Description</Label>
              <Textarea id="s-desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="mt-1 min-h-[60px]" />
            </div>
            <div>
              <Label>Demand level</Label>
              <Select value={newDemand} onValueChange={(v) => setNewDemand(v as SkillFramework["demand"])}>
                <SelectTrigger className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                <SelectContent>{["low", "medium", "high", "critical"].map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={create}>Create skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
