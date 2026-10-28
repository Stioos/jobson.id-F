"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface HNode {
  id: string; name: string; role: string; department: string; reports: string[];
  permissions: number; portal: string;
}

const NODES: Record<string, HNode> = {
  n_001: { id: "n_001", name: "Aarav Sharma", role: "CEO / Founder", department: "Leadership", reports: ["n_002", "n_003"], permissions: 48, portal: "admin" },
  n_002: { id: "n_002", name: "Neha Kapoor", role: "Super Admin", department: "Leadership", reports: ["n_004", "n_005", "n_006"], permissions: 42, portal: "admin" },
  n_003: { id: "n_003", name: "Raj Malhotra", role: "CFO", department: "Finance", reports: ["n_007"], permissions: 30, portal: "admin" },
  n_004: { id: "n_004", name: "Sneha Iyer", role: "Content Admin", department: "Content", reports: ["n_008"], permissions: 22, portal: "admin" },
  n_005: { id: "n_005", name: "Vikram Reddy", role: "Support Manager", department: "Support", reports: ["n_009", "n_010"], permissions: 18, portal: "admin" },
  n_006: { id: "n_006", name: "Pooja Desai", role: "Partner Admin", department: "Partnerships", reports: [], permissions: 20, portal: "admin" },
  n_007: { id: "n_007", name: "Kabir Sinha", role: "Billing Specialist", department: "Finance", reports: [], permissions: 12, portal: "admin" },
  n_008: { id: "n_008", name: "Riya Menon", role: "Content Moderator", department: "Content", reports: [], permissions: 8, portal: "admin" },
  n_009: { id: "n_009", name: "Aditya Shah", role: "Support Agent", department: "Support", reports: [], permissions: 6, portal: "admin" },
  n_010: { id: "n_010", name: "Isha Khanna", role: "Analyst", department: "Analytics", reports: [], permissions: 10, portal: "admin" },
};

const LOGS = [
  { date: "2024-09-20", actor: "Neha Kapoor", action: "Moved Aditya Shah from Content → Support" },
  { date: "2024-09-15", actor: "Aarav Sharma", action: "Promoted Sneha Iyer to Content Admin" },
  { date: "2024-09-10", actor: "Neha Kapoor", action: "Added Isha Khanna under Vikram Reddy" },
  { date: "2024-09-02", actor: "Aarav Sharma", action: "Reassigned Pooja Desai to Partnerships" },
];

export function SuperAdminReportingHierarchy() {
  const [dept, setDept] = React.useState("all");
  const [portal, setPortal] = React.useState("all");
  const [selected, setSelected] = React.useState<HNode | null>(null);

  const depts = Array.from(new Set(Object.values(NODES).map(n => n.department)));

  const visible = Object.values(NODES).filter(n => {
    const matchD = dept === "all" || n.department === dept;
    const matchP = portal === "all" || n.portal === portal;
    return matchD && matchP;
  });
  const visibleIds = new Set(visible.map(n => n.id));

  const findRoots = () => visible.filter(n => !Object.values(NODES).some(other => other.reports.includes(n.id)));

  const renderNode = (id: string, depth = 0): React.ReactNode => {
    const n = NODES[id];
    if (!n || !visibleIds.has(id)) return null;
    const childVisible = n.reports.filter(r => visibleIds.has(r));
    return (
      <div key={id} className="relative" style={{ marginLeft: depth * 28 }}>
        <div className="flex items-center gap-2">
          {depth > 0 && <div className="absolute -left-4 top-1/2 h-px w-4 bg-emerald-500/40" />}
          <button
            onClick={() => setSelected(n)}
            className="flex flex-1 items-center gap-2 rounded-md border border-emerald-500/30 bg-card px-3 py-2 text-left hover:border-emerald-500/60 hover:bg-emerald-500/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-700">
              {n.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{n.name}</div>
              <div className="text-xs text-muted-foreground">{n.role} · {n.department}</div>
            </div>
            <Badge variant="outline" className="ml-auto bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{n.reports.length} reports</Badge>
          </button>
        </div>
        {childVisible.length > 0 && (
          <div className="mt-2 space-y-2 border-l-2 border-emerald-500/30 pl-4">
            {childVisible.map(c => renderNode(c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Build matrix view (department × role)
  const roles = Array.from(new Set(Object.values(NODES).map(n => n.role)));
  const matrix: Record<string, Record<string, string[]>> = {};
  Object.values(NODES).forEach(n => {
    matrix[n.department] = matrix[n.department] || {};
    matrix[n.department][n.role] = matrix[n.department][n.role] || [];
    matrix[n.department][n.role].push(n.name);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reporting Hierarchy"
        description="Org chart of admin staff with drill-down details, drag-to-reassign and reporting line changes."
        icon={<Icon name="Network" className="h-6 w-6" />}
        actions={[{ label: "Export Chart", variant: "outline", onClick: () => toast.success("Chart exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total People" value={Object.keys(NODES).length} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Departments" value={depts.length} icon={<Icon name="Building2" className="h-5 w-5" />} />
        <StatCard label="Reporting Lines" value={Object.values(NODES).reduce((s, n) => s + n.reports.length, 0)} icon={<Icon name="Network" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Reports/Mgr" value={(Object.values(NODES).reduce((s, n) => s + n.reports.length, 0) / Object.values(NODES).filter(n => n.reports.length > 0).length).toFixed(1)} icon={<Icon name="UserCheck" className="h-5 w-5" />} />
      </div>

      <SectionCard
        title="Org Chart"
        description="Click a node to view details · drag-to-reassign (mock)"
        action={
          <div className="flex gap-2">
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {depts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={portal} onValueChange={setPortal}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Portals</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {findRoots().length === 0 ? (
          <EmptyState icon={<Icon name="Network" className="h-5 w-5" />} title="No nodes match filters" />
        ) : (
          <div className="space-y-2 overflow-x-auto">
            {findRoots().map(n => renderNode(n.id))}
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">Tip: drag a child node onto another manager to reassign (demo only).</p>
      </SectionCard>

      <SectionCard title="Matrix View" description="Department × Role cross-tabulation">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                {roles.map(r => <TableHead key={r} className="text-xs">{r}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(matrix).map(d => (
                <TableRow key={d}>
                  <TableCell className="font-medium">{d}</TableCell>
                  {roles.map(r => (
                    <TableCell key={r} className="text-xs">
                      {(matrix[d][r] || []).map(name => (
                        <Badge key={name} variant="outline" className="mr-1 mb-1 bg-emerald-500/5 text-emerald-700 border-emerald-500/20">{name}</Badge>
                      ))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Reporting Line Changes" description="Audit log of recent reassignments">
        <div className="space-y-2">
          {LOGS.map((l, i) => (
            <div key={i} className="flex items-start gap-2 rounded-md border bg-card p-2 text-sm">
              <Icon name="GitBranch" className="mt-0.5 h-4 w-4 text-emerald-600" />
              <div>
                <div>{l.action}</div>
                <div className="text-xs text-muted-foreground">{l.date} · by {l.actor}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>{selected.role} · {selected.department}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-md border p-2">
                    <div className="text-lg font-semibold text-emerald-700">{selected.reports.length}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Direct Reports</div>
                  </div>
                  <div className="rounded-md border p-2">
                    <div className="text-lg font-semibold text-emerald-700">{selected.permissions}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Permissions</div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Direct Reports</div>
                  {selected.reports.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No direct reports.</p>
                  ) : (
                    <div className="space-y-1">
                      {selected.reports.map(r => (
                        <button key={r} onClick={() => setSelected(NODES[r])} className="flex w-full items-center gap-2 rounded-md border bg-card p-2 text-left text-sm hover:bg-emerald-500/5">
                          <Icon name="User" className="h-4 w-4 text-emerald-600" />
                          {NODES[r].name} <span className="text-xs text-muted-foreground">· {NODES[r].role}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Access Summary</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{selected.portal}</Badge>
                    <Badge variant="outline" className="bg-emerald-500/5 text-emerald-700 border-emerald-500/20">{selected.permissions} perms</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info(`Reassigning ${selected.name}`)}>Reassign (mock drag)</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
