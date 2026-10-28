"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface RoleRow {
  id: string; name: string; description: string; level: number; parent: string | null;
  users: number; permissions: number; status: "active" | "disabled"; system: boolean; created: string;
  summary: string[];
}

const ROLES: RoleRow[] = [
  { id: "r_001", name: "Super Admin", description: "Unrestricted platform control", level: 5, parent: null, users: 2, permissions: 48, status: "active", system: true, created: "2023-01-12", summary: ["All permissions", "Cross-portal access", "Cannot be deleted"] },
  { id: "r_002", name: "Admin", description: "Operational administrator with limited system access", level: 4, parent: "Super Admin", users: 6, permissions: 36, status: "active", system: true, created: "2023-02-04", summary: ["Manage users", "View audit logs", "Configure portals"] },
  { id: "r_003", name: "Manager", description: "Team manager with departmental oversight", level: 3, parent: "Admin", users: 14, permissions: 24, status: "active", system: true, created: "2023-03-18", summary: ["Approve workflows", "View reports", "Manage team"] },
  { id: "r_004", name: "Analyst", description: "Read-only analytics access", level: 2, parent: "Manager", users: 9, permissions: 14, status: "active", system: true, created: "2023-04-22", summary: ["View dashboards", "Export reports"] },
  { id: "r_005", name: "Support", description: "Customer support agent", level: 2, parent: "Manager", users: 11, permissions: 12, status: "active", system: true, created: "2023-05-15", summary: ["Resolve tickets", "Impersonate users"] },
  { id: "r_006", name: "Billing Admin", description: "Manage invoices, payouts, refunds", level: 3, parent: "Admin", users: 4, permissions: 18, status: "active", system: true, created: "2023-06-08", summary: ["Process refunds", "Approve payouts", "View transactions"] },
  { id: "r_007", name: "Content Admin", description: "Moderate jobs, courses and CMS", level: 3, parent: "Admin", users: 5, permissions: 16, status: "active", system: true, created: "2023-07-19", summary: ["Moderate jobs", "Approve courses", "Manage CMS"] },
  { id: "r_008", name: "Partner Admin", description: "Partner network administrator", level: 3, parent: "Admin", users: 3, permissions: 15, status: "active", system: true, created: "2023-08-30", summary: ["Approve partners", "Manage MoU", "Set revenue splits"] },
  { id: "r_009", name: "Regional Ops Lead", description: "Custom role for regional operations", level: 3, parent: "Manager", users: 7, permissions: 20, status: "active", system: false, created: "2024-01-22", summary: ["Regional dashboard", "Assign recruiters", "Bulk candidate actions"] },
  { id: "r_010", name: "Read-Only Auditor", description: "External auditor with view-only access", level: 1, parent: "Analyst", users: 2, permissions: 8, status: "disabled", system: false, created: "2024-03-11", summary: ["View audit logs", "Export data"] },
];

export function SuperAdminRoles() {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "system" | "custom">("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  const filtered = ROLES.filter(r => {
    const s = search.toLowerCase();
    const matchS = !s || r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s);
    const matchF = filter === "all" || (filter === "system" ? r.system : !r.system);
    return matchS && matchF;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Management"
        description="Define roles, levels and inherited permissions across the platform."
        icon={<Icon name="Shield" className="h-6 w-6" />}
        actions={[{ label: "New Role", onClick: () => setOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Roles" value={ROLES.length} icon={<Icon name="Shield" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={ROLES.filter(r => r.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="System Roles" value={ROLES.filter(r => r.system).length} icon={<Icon name="Lock" className="h-5 w-5" />} />
        <StatCard label="Custom Roles" value={ROLES.filter(r => !r.system).length} icon={<Icon name="Pencil" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Roles" description={`${filtered.length} of ${ROLES.length} roles`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles…" className="h-9 max-w-xs" />
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="system">System Only</SelectItem>
              <SelectItem value="custom">Custom Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Shield" className="h-5 w-5" />} title="No roles found" description="Adjust your filters or create a new role." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <React.Fragment key={r.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 font-medium">
                              {r.name}
                              {r.system && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30">
                                  <Icon name="Lock" className="h-3 w-3" /> System
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{r.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">L{r.level}</Badge></TableCell>
                      <TableCell>{r.users}</TableCell>
                      <TableCell>{r.permissions}</TableCell>
                      <TableCell>
                        {r.status === "active"
                          ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">Active</Badge>
                          : <Badge variant="outline" className="bg-slate-500/15 text-slate-500 border-slate-500/30">Disabled</Badge>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.created}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="ghost" onClick={() => toast.info(`Edit ${r.name}`)}><Icon name="Pencil" className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => toast.success(`Duplicated ${r.name}`)}><Icon name="Copy" className="h-4 w-4" /></Button>
                          {!r.system && (
                            <Button size="sm" variant="ghost" onClick={() => toast.error(`Deleted ${r.name}`)}><Icon name="Trash2" className="h-4 w-4 text-rose-500" /></Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expanded === r.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={7} className="p-4">
                          <div className="space-y-2">
                            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Permission Summary</div>
                            <div className="flex flex-wrap gap-1.5">
                              {r.summary.map(s => (
                                <Badge key={s} variant="outline" className="bg-emerald-500/5 text-emerald-700 border-emerald-500/20">{s}</Badge>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">Parent role: {r.parent ?? "— (root)"} · Level {r.level} of 5</div>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span className="hidden" />
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Role Name</Label>
              <Input placeholder="e.g. Regional Ops Lead" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Describe the role's responsibilities…" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Level (1-5)</Label>
                <Select defaultValue="2">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(l => <SelectItem key={l} value={String(l)}>Level {l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Parent Role</Label>
                <Select defaultValue="manager">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Active</div>
                <div className="text-xs text-muted-foreground">Disable to suspend all users in this role.</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOpen(false); toast.success("Role created"); }}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
