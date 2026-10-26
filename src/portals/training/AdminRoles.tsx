"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  StatCard,
  StatusBadge,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Shield, ShieldCheck, Crown, Users, KeyRound, Edit, Layers,
} from "lucide-react";
import {
  adminUsers, adminRoles,
} from "@/lib/talent-solutions-data";
import type { AdminRoleConfig } from "@/lib/talent-solutions-types";
import { formatDate } from "@/lib/format";

const PERMISSION_GROUPS = [
  {
    name: "Users & Roles",
    permissions: ["users.read", "users.write", "team.manage"],
  },
  {
    name: "Billing & Transactions",
    permissions: ["billing.read", "billing.write", "transactions.manage", "invoices.manage", "settlements.manage"],
  },
  {
    name: "Content & Courses",
    permissions: ["content.read", "content.write", "courses.manage", "certifications.manage", "content.moderate"],
  },
  {
    name: "Partners",
    permissions: ["partners.manage", "partner-applications.review", "partner-performance.view"],
  },
  {
    name: "Analytics & Reports",
    permissions: ["reports.view", "analytics.view"],
  },
  {
    name: "Support",
    permissions: ["tickets.manage"],
  },
];

export function AdminRoles() {
  const [selected, setSelected] = React.useState<AdminRoleConfig | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [matrixOpen, setMatrixOpen] = React.useState(false);

  const totalPerms = adminRoles.reduce((s, r) => s + (r.permissions[0] === "*" ? 999 : r.permissions.length), 0);
  const userCreatingRoles = adminRoles.filter((r) => r.canCreateUsers).length;
  const billingRoles = adminRoles.filter((r) => r.canAccessBilling).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Define admin roles, permission sets, and access hierarchy. Manage who can create users, manage roles, access billing, and moderate content."
        icon={<Shield className="h-6 w-6" />}
        breadcrumbs={[{ label: "Platform Admin" }, { label: "Roles & Hierarchy" }]}
        actions={[
          { label: "Permission Matrix", variant: "outline", onClick: () => setMatrixOpen(true) },
          { label: "Create Role", variant: "default", onClick: () => setCreateOpen(true) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Roles" value={adminRoles.length} icon={<Shield className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Permissions" value={totalPerms > 100 ? "100+" : totalPerms} icon={<KeyRound className="h-5 w-5" />} tone="default" />
        <StatCard label="User-Creating Roles" value={userCreatingRoles} icon={<Users className="h-5 w-5" />} tone="success" />
        <StatCard label="Billing-Access Roles" value={billingRoles} icon={<ShieldCheck className="h-5 w-5" />} tone="warning" />
      </section>

      {/* Role Hierarchy Visualization */}
      <SectionCard title="Role Hierarchy" description="Visualized by access level (1 = highest, 5 = lowest)">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((level) => {
            const roles = adminRoles.filter((r) => r.level === level);
            if (roles.length === 0) return null;
            return (
              <div key={level} className="flex items-center gap-3">
                <div className="w-20 shrink-0 text-right">
                  <Badge variant="outline" className="text-[10px]">Level {level}</Badge>
                </div>
                <div className="flex flex-1 flex-wrap gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-sm ${r.id === "super_admin" ? "border-amber-500/30 bg-amber-500/5" : ""}`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${r.id === "super_admin" ? "bg-amber-500/15 text-amber-600" : "bg-brand/10 text-brand"}`}>
                        {r.id === "super_admin" ? <Crown className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {r.permissions[0] === "*" ? "All permissions" : `${r.permissions.length} permissions`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Roles Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Level</TableHead>
                <TableHead className="text-center">Permissions</TableHead>
                <TableHead className="text-center">Create Users</TableHead>
                <TableHead className="text-center">Manage Roles</TableHead>
                <TableHead className="text-center">Billing</TableHead>
                <TableHead>Portals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminRoles.map((r) => {
                const userCount = adminUsers.filter((u) => u.role === r.id).length;
                return (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(r)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {r.id === "super_admin" ? <Crown className="h-4 w-4 text-amber-500" /> : <Shield className="h-4 w-4 text-brand" />}
                        <div>
                          <p className="text-sm font-medium">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{userCount} user(s)</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs line-clamp-2">{r.description}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline">L{r.level}</Badge></TableCell>
                    <TableCell className="text-center text-sm font-medium">
                      {r.permissions[0] === "*" ? "All" : r.permissions.length}
                    </TableCell>
                    <TableCell className="text-center">
                      {r.canCreateUsers ? <ShieldCheck className="h-4 w-4 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {r.canManageRoles ? <ShieldCheck className="h-4 w-4 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {r.canAccessBilling ? <ShieldCheck className="h-4 w-4 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {r.defaultAssignedPortals.slice(0, 2).map((p) => (
                          <Badge key={p} variant="secondary" className="text-[10px] capitalize">{p}</Badge>
                        ))}
                        {r.defaultAssignedPortals.length > 2 && <Badge variant="outline" className="text-[10px]">+{r.defaultAssignedPortals.length - 2}</Badge>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && <RoleDetail role={selected} />}
        </SheetContent>
      </Sheet>

      {/* Create Role Dialog */}
      <CreateRoleDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* Permission Matrix Dialog */}
      <Dialog open={matrixOpen} onOpenChange={setMatrixOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Permission Matrix</DialogTitle>
            <DialogDescription>Role × permission mapping. Checkboxes are read-only display.</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background">Permission</TableHead>
                  {adminRoles.map((r) => (
                    <TableHead key={r.id} className="text-center text-xs">{r.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {PERMISSION_GROUPS.flatMap((g) => g.permissions).map((p) => (
                  <TableRow key={p}>
                    <TableCell className="sticky left-0 bg-background"><code className="text-[11px]">{p}</code></TableCell>
                    {adminRoles.map((r) => {
                      const has = r.permissions[0] === "*" || r.permissions.includes(p);
                      return (
                        <TableCell key={r.id} className="text-center">
                          <Checkbox checked={has} disabled />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMatrixOpen(false)}>Close</Button>
            <Button onClick={() => toast.success("Matrix exported", { description: "Permission matrix saved as CSV." })}>Export Matrix</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RoleDetail({ role }: { role: AdminRoleConfig }) {
  const users = adminUsers.filter((u) => u.role === role.id);

  return (
    <div className="space-y-6">
      <SheetHeader>
        <div className="flex items-start gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${role.id === "super_admin" ? "bg-amber-500/15 text-amber-600" : "bg-brand/10 text-brand"}`}>
            {role.id === "super_admin" ? <Crown className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
          </div>
          <div className="flex-1">
            <SheetTitle className="text-lg">{role.name}</SheetTitle>
            <SheetDescription className="mt-1">{role.description}</SheetDescription>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">Level {role.level}</Badge>
              <Badge variant="secondary">{users.length} user(s)</Badge>
              <Badge variant="outline" className="capitalize">{role.defaultAssignedPortals.join(", ")}</Badge>
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <CapabilityPill label="Create Users" enabled={role.canCreateUsers} />
        <CapabilityPill label="Manage Roles" enabled={role.canManageRoles} />
        <CapabilityPill label="Access Billing" enabled={role.canAccessBilling} />
        <CapabilityPill label="Moderate Content" enabled={role.canModerateContent} />
        <CapabilityPill label="Manage Partners" enabled={role.canManagePartners} />
      </div>

      <SectionCard title="Permissions" description={`${role.permissions[0] === "*" ? "All" : role.permissions.length} permission(s)`}>
        {role.permissions[0] === "*" ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
            <Shield className="inline h-4 w-4 mr-2 text-amber-600" />
            <strong>Wildcard:</strong> All permissions granted (*)
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {role.permissions.map((p) => (
              <div key={p} className="flex items-center gap-2 rounded-lg border p-2 text-xs">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <code className="text-[11px]">{p}</code>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Users with this role" description={`${users.length} user(s)`}>
        {users.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto scroll-thin">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <AvatarLogo text={u.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <StatusBadge status={u.status} />
              </div>
            ))}
          </div>
        ) : <EmptyState icon={<Users className="h-5 w-5" />} title="No users with this role" />}
      </SectionCard>
    </div>
  );
}

function CapabilityPill({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border p-2 ${enabled ? "border-emerald-500/30 bg-emerald-500/5" : "border-muted bg-muted/30"}`}>
      <span className="text-xs">{label}</span>
      {enabled ? <ShieldCheck className="h-3 w-3 text-emerald-500" /> : <span className="text-muted-foreground text-xs">—</span>}
    </div>
  );
}

function CreateRoleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = React.useState({
    name: "", description: "", level: "4",
    canCreateUsers: false, canManageRoles: false, canAccessBilling: false, canModerateContent: false, canManagePartners: false,
    permissions: [] as string[],
    portals: ["training"] as string[],
  });

  const togglePerm = (p: string) => {
    setForm((s) => ({
      ...s,
      permissions: s.permissions.includes(p) ? s.permissions.filter((x) => x !== p) : [...s.permissions, p],
    }));
  };

  const togglePortal = (p: string) => {
    setForm((s) => ({
      ...s,
      portals: s.portals.includes(p) ? s.portals.filter((x) => x !== p) : [...s.portals, p],
    }));
  };

  const submit = () => {
    if (!form.name) { toast.error("Role name is required"); return; }
    toast.success("Role created", { description: `${form.name} (Level ${form.level}) with ${form.permissions.length} permission(s).` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>Define a new admin role with capabilities and permissions.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Role Name *"><Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Content Reviewer" /></Field>
            <Field label="Level (1=highest, 5=lowest)">
              <Input type="number" min="1" max="5" value={form.level} onChange={(e) => setForm((s) => ({ ...s, level: e.target.value }))} />
            </Field>
          </div>
          <Field label="Description"><Input value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Reviews and approves platform content" /></Field>

          <div>
            <Label className="text-xs">Capabilities</Label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {([
                ["canCreateUsers", "Can create users"],
                ["canManageRoles", "Can manage roles"],
                ["canAccessBilling", "Can access billing"],
                ["canModerateContent", "Can moderate content"],
                ["canManagePartners", "Can manage partners"],
              ] as const).map(([k, l]) => (
                <div key={k} className="flex items-center gap-2 rounded-lg border p-2">
                  <Switch checked={form[k]} onCheckedChange={(c) => setForm((s) => ({ ...s, [k]: c }))} />
                  <Label className="text-sm">{l}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Assigned Portals</Label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {["training", "partner", "employer", "recruiter", "candidate"].map((p) => (
                <label key={p} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm capitalize ${form.portals.includes(p) ? "border-brand bg-brand/5" : ""}`}>
                  <Checkbox checked={form.portals.includes(p)} onCheckedChange={() => togglePortal(p)} />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Permissions</Label>
            <div className="mt-2 space-y-3">
              {PERMISSION_GROUPS.map((g) => (
                <div key={g.name} className="rounded-lg border p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{g.name}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {g.permissions.map((p) => (
                      <label key={p} className={`flex cursor-pointer items-center gap-2 rounded border p-1.5 ${form.permissions.includes(p) ? "border-brand bg-brand/5" : ""}`}>
                        <Checkbox checked={form.permissions.includes(p)} onCheckedChange={() => togglePerm(p)} />
                        <code className="text-[10px]">{p}</code>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Plus className="mr-1 h-4 w-4" /> Create Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
