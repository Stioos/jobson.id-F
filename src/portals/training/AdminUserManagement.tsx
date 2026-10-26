"use client";

import * as React from "react";
import { toast } from "sonner";
import { useNav } from "@/lib/store";
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MoreHorizontal, Plus, Users, Shield, ShieldCheck, UserCog, Ban, Trash2, Edit, Search, Filter, Crown, Mail, Phone, Clock, KeyRound, Activity,
} from "lucide-react";
import {
  adminUsers, adminRoles,
} from "@/lib/talent-solutions-data";
import type { AdminUser } from "@/lib/talent-solutions-types";
import { formatDate, timeAgo } from "@/lib/format";

const PORTALS = ["training", "partner", "employer", "recruiter", "candidate"];
const ALL_PERMISSIONS = [
  "users.read", "users.write", "billing.read", "billing.write",
  "content.read", "content.write", "courses.manage", "certifications.manage",
  "transactions.manage", "invoices.manage", "settlements.manage",
  "partners.manage", "partner-applications.review", "partner-performance.view",
  "reports.view", "analytics.view", "team.manage", "tickets.manage",
  "content.moderate",
];

export function AdminUserManagement() {
  const { navigate } = useNav();
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<AdminUser | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [rowStates, setRowStates] = React.useState<Record<string, { status: AdminUser["status"] }>>({});
  const [confirmAction, setConfirmAction] = React.useState<{ user: AdminUser; action: "suspend" | "activate" | "delete" } | null>(null);

  const users = adminUsers.map((u) => ({
    ...u,
    status: rowStates[u.id]?.status ?? u.status,
  }));

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;
  const invitedCount = users.filter((u) => u.status === "invited").length;
  const mfaCount = users.filter((u) => u.mfaEnabled).length;

  const applyAction = () => {
    if (!confirmAction) return;
    const { user, action } = confirmAction;
    if (action === "delete") {
      toast.success("User deleted", { description: `${user.name} has been permanently removed.` });
    } else if (action === "suspend") {
      setRowStates((s) => ({ ...s, [user.id]: { status: "suspended" } }));
      toast.warning("User suspended", { description: `${user.name} can no longer sign in.` });
    } else if (action === "activate") {
      setRowStates((s) => ({ ...s, [user.id]: { status: "active" } }));
      toast.success("User activated", { description: `${user.name} can now sign in.` });
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage all platform admin users, roles, permissions, and access. Super admins can create, suspend, and delete users across all portals."
        icon={<Users className="h-6 w-6" />}
        breadcrumbs={[{ label: "Platform Admin" }, { label: "User Management" }]}
        actions={[
          { label: "Roles & Hierarchy", variant: "outline", onClick: () => navigate("training", "adm-roles-hierarchy") },
          { label: "Create User", variant: "default", onClick: () => setCreateOpen(true) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={users.length} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} hint={`${invitedCount} invited`} icon={<ShieldCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Suspended" value={suspendedCount} icon={<Ban className="h-5 w-5" />} tone="danger" />
        <StatCard label="MFA Enabled" value={`${mfaCount}/${users.length}`} icon={<KeyRound className="h-5 w-5" />} tone="warning" />
      </section>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px] space-y-1">
              <Label className="text-xs">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="Name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {adminRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); }}><Filter className="mr-1 h-4 w-4" /> Reset</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Portals</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-10"><EmptyState icon={<Users className="h-5 w-5" />} title="No users match filters" /></TableCell></TableRow>
              )}
              {filtered.map((u) => (
                <TableRow key={u.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(u)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <AvatarLogo text={u.name} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium">{u.name}</p>
                          {u.role === "super_admin" && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {u.role === "super_admin" ? (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                        <Crown className="mr-1 h-3 w-3" /> {u.roleLabel}
                      </Badge>
                    ) : (
                      <StatusBadge status={u.role} />
                    )}
                  </TableCell>
                  <TableCell><StatusBadge status={u.status} /></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {u.assignedPortals.slice(0, 2).map((p) => (
                        <Badge key={p} variant="secondary" className="text-[10px] capitalize">{p}</Badge>
                      ))}
                      {u.assignedPortals.length > 2 && <Badge variant="outline" className="text-[10px]">+{u.assignedPortals.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.lastActive ? timeAgo(u.lastActive) : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.createdBy}</TableCell>
                  <TableCell>
                    {u.mfaEnabled ? <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]"><ShieldCheck className="mr-1 h-3 w-3" />On</Badge>
                      : <Badge variant="outline" className="text-[10px] text-muted-foreground">Off</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelected(u)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Reset link sent", { description: `Password reset email sent to ${u.email}.` })}><KeyRound className="mr-2 h-4 w-4" /> Reset password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {u.status === "active" ? (
                          <DropdownMenuItem className="text-amber-600" onClick={() => setConfirmAction({ user: u, action: "suspend" })}><Ban className="mr-2 h-4 w-4" /> Suspend</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-emerald-600" onClick={() => setConfirmAction({ user: u, action: "activate" })}><ShieldCheck className="mr-2 h-4 w-4" /> Activate</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-rose-600" onClick={() => setConfirmAction({ user: u, action: "delete" })}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && <UserDetail user={selected} />}
        </SheetContent>
      </Sheet>

      {/* Create User Dialog */}
      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* Confirm Action AlertDialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(o) => !o && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.action === "delete" && "Delete user?"}
              {confirmAction?.action === "suspend" && "Suspend user?"}
              {confirmAction?.action === "activate" && "Activate user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.action === "delete" && `This will permanently delete ${confirmAction?.user.name}. This action cannot be undone.`}
              {confirmAction?.action === "suspend" && `${confirmAction?.user.name} will no longer be able to sign in. You can reactivate them at any time.`}
              {confirmAction?.action === "activate" && `${confirmAction?.user.name} will be reactivated and can sign in immediately.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={applyAction}
              className={confirmAction?.action === "delete" ? "bg-rose-600 hover:bg-rose-700" : confirmAction?.action === "suspend" ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}
            >
              {confirmAction?.action === "delete" && "Delete"}
              {confirmAction?.action === "suspend" && "Suspend"}
              {confirmAction?.action === "activate" && "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UserDetail({ user }: { user: AdminUser }) {
  const role = adminRoles.find((r) => r.id === user.role);
  const reportsTo = adminUsers.find((u) => u.id === user.reportsTo);
  const reports = adminUsers.filter((u) => u.reportsTo === user.id);

  return (
    <div className="space-y-6">
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={user.name} size="xl" />
          <div className="flex-1">
            <SheetTitle className="text-lg leading-tight flex items-center gap-2">
              {user.name}
              {user.role === "super_admin" && <Crown className="h-4 w-4 text-amber-500" />}
            </SheetTitle>
            <SheetDescription className="mt-1">{user.email}</SheetDescription>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.role === "super_admin" ? (
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"><Crown className="mr-1 h-3 w-3" /> {user.roleLabel}</Badge>
              ) : (
                <StatusBadge status={user.role} />
              )}
              <StatusBadge status={user.status} />
              {user.mfaEnabled && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"><ShieldCheck className="mr-1 h-3 w-3" /> MFA</Badge>}
            </div>
          </div>
        </div>
      </SheetHeader>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
            <InfoCard icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone ?? "—"} />
            <InfoCard icon={<Clock className="h-4 w-4" />} label="Last Active" value={user.lastActive ? timeAgo(user.lastActive) : "Never"} />
            <InfoCard icon={<UserCog className="h-4 w-4" />} label="Created By" value={user.createdBy} />
            <InfoCard icon={<Shield className="h-4 w-4" />} label="Created" value={formatDate(user.createdAt)} />
            <InfoCard icon={<KeyRound className="h-4 w-4" />} label="IP Restriction" value={user.ipRestriction ?? "None"} />
          </div>

          <SectionCard title="Assigned Portals">
            <div className="flex flex-wrap gap-2">
              {user.assignedPortals.map((p) => (
                <Badge key={p} variant="secondary" className="capitalize">{p}</Badge>
              ))}
            </div>
          </SectionCard>

          {role && (
            <SectionCard title="Role Description">
              <p className="text-sm text-muted-foreground">{role.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <CapabilityPill label="Create Users" enabled={role.canCreateUsers} />
                <CapabilityPill label="Manage Roles" enabled={role.canManageRoles} />
                <CapabilityPill label="Access Billing" enabled={role.canAccessBilling} />
                <CapabilityPill label="Moderate Content" enabled={role.canModerateContent} />
                <CapabilityPill label="Manage Partners" enabled={role.canManagePartners} />
              </div>
            </SectionCard>
          )}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <SectionCard title="Permissions" description={`${user.permissions.length} permission(s) granted`}>
            {user.permissions[0] === "*" ? (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                <Shield className="inline h-4 w-4 mr-2 text-amber-600" />
                <strong>Super Admin:</strong> All permissions granted (<code className="text-xs">*</code> wildcard).
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {user.permissions.map((p) => (
                  <div key={p} className="flex items-center gap-2 rounded-lg border p-2 text-xs">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    <code className="text-[11px]">{p}</code>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-4">
          {reportsTo && (
            <SectionCard title="Reports To">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <AvatarLogo text={reportsTo.name} size="sm" />
                <div>
                  <p className="text-sm font-medium">{reportsTo.name}</p>
                  <p className="text-xs text-muted-foreground">{reportsTo.roleLabel}</p>
                </div>
              </div>
            </SectionCard>
          )}
          <SectionCard title="Direct Reports" description={`${reports.length} user(s) report to ${user.name.split(" ")[0]}`}>
            {reports.length > 0 ? (
              <div className="space-y-2">
                {reports.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <AvatarLogo text={r.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.role} />
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No direct reports.</p>}
          </SectionCard>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <SectionCard title="Recent Activity" description="Last 5 actions performed">
            <div className="space-y-2">
              {[
                { action: "Signed in", time: user.lastActive, icon: <KeyRound className="h-4 w-4" /> },
                { action: "Updated profile settings", time: user.lastActive, icon: <UserCog className="h-4 w-4" /> },
                { action: "Viewed dashboard", time: user.lastActive, icon: <Activity className="h-4 w-4" /> },
                { action: "Account created", time: user.createdAt, icon: <Shield className="h-4 w-4" /> },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">{a.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.time ? timeAgo(a.time) : "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">{icon} {label}</div>
      <p className="mt-1 text-sm font-medium truncate">{value}</p>
    </div>
  );
}

function CapabilityPill({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border p-2 ${enabled ? "border-emerald-500/30 bg-emerald-500/5" : "border-muted bg-muted/30"}`}>
      <span className="text-xs">{label}</span>
      {enabled ? <ShieldCheck className="h-3 w-3 text-emerald-500" /> : <Ban className="h-3 w-3 text-muted-foreground" />}
    </div>
  );
}

function CreateUserDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = React.useState({
    name: "", email: "", role: "analyst" as string,
    portals: ["training"] as string[],
    permissions: [] as string[],
    mfaEnabled: true,
  });

  const togglePortal = (p: string) => {
    setForm((s) => ({
      ...s,
      portals: s.portals.includes(p) ? s.portals.filter((x) => x !== p) : [...s.portals, p],
    }));
  };

  const togglePermission = (p: string) => {
    setForm((s) => ({
      ...s,
      permissions: s.permissions.includes(p) ? s.permissions.filter((x) => x !== p) : [...s.permissions, p],
    }));
  };

  const submit = () => {
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    toast.success("User created", { description: `${form.name} invited as ${form.role} with ${form.portals.length} portal(s) access.` });
    onOpenChange(false);
    setForm({ name: "", email: "", role: "analyst", portals: ["training"], permissions: [], mfaEnabled: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new admin user with role-based access and portal assignments.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name *"><Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Priya Menon" /></Field>
            <Field label="Email *"><Input type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="priya@jobsonn.com" /></Field>
            <Field label="Role">
              <Select value={form.role} onValueChange={(v) => setForm((s) => ({ ...s, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {adminRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-end">
              <div className="flex items-center gap-2 rounded-lg border p-3 w-full">
                <Switch checked={form.mfaEnabled} onCheckedChange={(c) => setForm((s) => ({ ...s, mfaEnabled: c }))} />
                <Label className="text-sm">Require MFA on first sign-in</Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs">Assigned Portals</Label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {PORTALS.map((p) => (
                <label key={p} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm ${form.portals.includes(p) ? "border-brand bg-brand/5" : ""}`}>
                  <Checkbox checked={form.portals.includes(p)} onCheckedChange={() => togglePortal(p)} />
                  <span className="capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Permissions</Label>
            <div className="mt-2 max-h-40 overflow-y-auto scroll-thin grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ALL_PERMISSIONS.map((p) => (
                <label key={p} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 ${form.permissions.includes(p) ? "border-brand bg-brand/5" : ""}`}>
                  <Checkbox checked={form.permissions.includes(p)} onCheckedChange={() => togglePermission(p)} />
                  <code className="text-[11px]">{p}</code>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Plus className="mr-1 h-4 w-4" /> Create & Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
