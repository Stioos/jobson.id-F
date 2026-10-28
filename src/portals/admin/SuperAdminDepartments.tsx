"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Dept {
  id: string; name: string; head: string; staff: number; budget: string;
  portals: string[]; status: "active" | "inactive"; parent: string | null;
}

const DEPTS: Dept[] = [
  { id: "d_001", name: "Leadership", head: "Aarav Sharma", staff: 5, budget: "—", portals: ["admin"], status: "active", parent: null },
  { id: "d_002", name: "Operations", head: "Neha Kapoor", staff: 24, budget: "₹85L", portals: ["admin", "employer"], status: "active", parent: "Leadership" },
  { id: "d_003", name: "Finance", head: "Raj Malhotra", staff: 8, budget: "₹42L", portals: ["admin", "employer"], status: "active", parent: "Leadership" },
  { id: "d_004", name: "Engineering", head: "Ananya Bose", staff: 15, budget: "₹1.2Cr", portals: ["admin"], status: "active", parent: "Leadership" },
  { id: "d_005", name: "Content & Moderation", head: "Sneha Iyer", staff: 9, budget: "₹38L", portals: ["admin"], status: "active", parent: "Operations" },
  { id: "d_006", name: "Customer Support", head: "Vikram Reddy", staff: 18, budget: "₹52L", portals: ["admin"], status: "active", parent: "Operations" },
  { id: "d_007", name: "Partnerships", head: "Pooja Desai", staff: 6, budget: "₹45L", portals: ["admin", "partner"], status: "active", parent: "Operations" },
  { id: "d_008", name: "Analytics", head: "Karan Mehta", staff: 4, budget: "₹28L", portals: ["admin"], status: "inactive", parent: "Operations" },
];

const PORTAL_OPTS = ["admin", "employer", "recruiter", "training", "partner"];

export function SuperAdminDepartments() {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filtered = DEPTS.filter(d => {
    const q = search.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.head.toLowerCase().includes(q);
  });

  const totalStaff = DEPTS.reduce((s, d) => s + d.staff, 0);
  const avg = Math.round(totalStaff / DEPTS.length);

  const renderTree = (parentId: string | null, depth = 0) => {
    return DEPTS.filter(d => d.parent === parentId).map(d => (
      <div key={d.id} style={{ marginLeft: depth * 24 }}>
        <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
          <Icon name="Building2" className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium">{d.name}</span>
          <span className="text-xs text-muted-foreground">· {d.head}</span>
          <Badge variant="outline" className="ml-auto bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{d.staff}</Badge>
        </div>
        {renderTree(d.id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Management"
        description="Organize staff into departments with budgets, portal access and reporting structure."
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[{ label: "New Department", onClick: () => setOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 sm:gap-4">
        <StatCard label="Total Departments" value={DEPTS.length} icon={<Icon name="Building2" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Staff" value={totalStaff} icon={<Icon name="Users" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Staff/Dept" value={avg} icon={<Icon name="UserCheck" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Departments" description={`${filtered.length} of ${DEPTS.length} departments`}>
        <div className="mb-3">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or head…" className="h-9 max-w-xs" />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Building2" className="h-5 w-5" />} title="No departments found" description="Adjust filters or create a new department." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Portals</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-xs">{d.head}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{d.staff}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{d.budget}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {d.portals.map(p => <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={d.status === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-slate-500/15 text-slate-500 border-slate-500/30"}>{d.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Edit ${d.name}`)}><Icon name="Pencil" className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.error(`Deleted ${d.name}`)}><Icon name="Trash2" className="h-4 w-4 text-rose-500" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Department Hierarchy" description="Tree view of parent → child departments">
          <div className="space-y-2">{renderTree(null)}</div>
        </SectionCard>

        <SectionCard title="Budget Tracker" description="Annual budget utilization per department">
          <div className="space-y-2">
            {DEPTS.filter(d => d.budget !== "—").map(d => {
              const val = parseInt(d.budget.replace(/[^0-9]/g, "")) || 40;
              const pct = Math.min(100, Math.round((val / 120) * 100));
              return (
                <div key={d.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-muted-foreground">{d.budget}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Performance Metrics" description="Mock quarterly performance scores">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {DEPTS.map(d => {
            const score = 60 + (d.id.charCodeAt(2) % 35);
            return (
              <div key={d.id} className="rounded-md border p-3 text-center">
                <div className="text-xs text-muted-foreground">{d.name}</div>
                <div className={`text-2xl font-semibold ${score >= 80 ? "text-emerald-700" : score >= 70 ? "text-amber-600" : "text-rose-600"}`}>{score}</div>
                <div className="text-[10px] text-muted-foreground">performance</div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Department Name</Label>
              <Input placeholder="e.g. Customer Success" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Department Head</Label>
                <Select defaultValue="aarav">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEPTS.map(d => <SelectItem key={d.id} value={d.head.toLowerCase().split(" ")[0]}>{d.head}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Parent Department</Label>
                <Select defaultValue="operations">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— No parent (root)</SelectItem>
                    {DEPTS.map(d => <SelectItem key={d.id} value={d.name.toLowerCase().split(" ")[0]}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Annual Budget</Label>
              <Input placeholder="e.g. ₹50L" />
            </div>
            <div className="space-y-1.5">
              <Label>Portal Access</Label>
              <div className="grid grid-cols-3 gap-2">
                {PORTAL_OPTS.map(p => (
                  <label key={p} className="flex items-center gap-2 rounded-md border p-2 text-xs"><Checkbox /> {p}</label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOpen(false); toast.success("Department created"); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
