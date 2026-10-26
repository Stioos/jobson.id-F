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
import { Label } from "@/components/ui/label";
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
  Network, Crown, Users, GitBranch, ArrowRight, Mail, Phone, Clock, UserCog,
} from "lucide-react";
import {
  adminUsers, adminRoles,
} from "@/lib/talent-solutions-data";
import type { AdminUser } from "@/lib/talent-solutions-types";
import { formatDate, timeAgo } from "@/lib/format";

export function AdminUserHierarchy() {
  const { navigate } = useNav();
  const [selected, setSelected] = React.useState<AdminUser | null>(null);
  const [reassignOpen, setReassignOpen] = React.useState(false);
  const [reassignUser, setReassignUser] = React.useState<AdminUser | null>(null);
  const [newReportsTo, setNewReportsTo] = React.useState("");

  // Build tree: root = users with no reportsTo (i.e., super_admin)
  const roots = adminUsers.filter((u) => !u.reportsTo);
  const byReportsTo = (id: string) => adminUsers.filter((u) => u.reportsTo === id);

  const totalUsers = adminUsers.length;
  const totalLevels = Math.max(...adminRoles.map((r) => r.level));
  const avgReportsPerManager = (() => {
    const managers = adminUsers.filter((u) => u.reports.length > 0);
    if (managers.length === 0) return 0;
    return (managers.reduce((s, u) => s + u.reports.length, 0) / managers.length).toFixed(1);
  })();

  const handleReassign = () => {
    if (!reassignUser || !newReportsTo) return;
    const newManager = adminUsers.find((u) => u.id === newReportsTo);
    toast.success("Reporting line updated", {
      description: `${reassignUser.name} now reports to ${newManager?.name ?? "—"}.`,
    });
    setReassignOpen(false);
    setReassignUser(null);
    setNewReportsTo("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin User Hierarchy"
        description="Visualize the platform admin reporting structure. Reassign reporting lines as your team evolves."
        icon={<Network className="h-6 w-6" />}
        breadcrumbs={[{ label: "Platform Admin", onClick: () => navigate("training", "adm-roles-hierarchy") }, { label: "Hierarchy" }]}
        actions={[
          { label: "Back to Roles", variant: "outline", onClick: () => navigate("training", "adm-roles-hierarchy") },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Hierarchy Levels" value={totalLevels} icon={<GitBranch className="h-5 w-5" />} tone="default" />
        <StatCard label="Root Admins" value={roots.length} icon={<Crown className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Reports / Manager" value={avgReportsPerManager} icon={<Network className="h-5 w-5" />} tone="success" />
      </section>

      {/* Org Chart */}
      <SectionCard
        title="Organization Chart"
        description="Click any node to view user details. Use 'Reassign' to change reporting lines."
      >
        <div className="overflow-x-auto">
          <div className="min-w-[800px] space-y-6 p-2">
            {roots.map((root) => (
              <OrgNode
                key={root.id}
                user={root}
                reports={byReportsTo(root.id)}
                byReportsTo={byReportsTo}
                onSelect={setSelected}
                onReassign={(u) => { setReassignUser(u); setReassignOpen(true); }}
                depth={0}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Role Legend</p>
          <div className="flex flex-wrap gap-2">
            {adminRoles.map((r) => (
              <Badge
                key={r.id}
                variant="outline"
                className={r.id === "super_admin" ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400" : ""}
              >
                {r.id === "super_admin" && <Crown className="mr-1 h-3 w-3" />}
                {r.name} (L{r.level})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && <UserMiniDetail user={selected} onReassign={() => { setReassignUser(selected); setReassignOpen(true); }} />}
        </SheetContent>
      </Sheet>

      {/* Reassign Dialog */}
      <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reassign Reporting Line</DialogTitle>
            <DialogDescription>
              Change who {reassignUser?.name} reports to. This affects permission inheritance and audit visibility.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Current User</Label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border p-2">
                <AvatarLogo text={reassignUser?.name ?? ""} size="sm" />
                <div>
                  <p className="text-sm font-medium">{reassignUser?.name}</p>
                  <p className="text-xs text-muted-foreground">{reassignUser?.roleLabel}</p>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs">New Manager</Label>
              <Select value={newReportsTo} onValueChange={setNewReportsTo}>
                <SelectTrigger><SelectValue placeholder="Select new manager" /></SelectTrigger>
                <SelectContent>
                  {adminUsers
                    .filter((u) => u.id !== reassignUser?.id && u.status === "active")
                    .map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} — {u.roleLabel}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignOpen(false)}>Cancel</Button>
            <Button onClick={handleReassign}>Update Reporting Line</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrgNode({
  user, reports, byReportsTo, onSelect, onReassign, depth,
}: {
  user: AdminUser;
  reports: AdminUser[];
  byReportsTo: (id: string) => AdminUser[];
  onSelect: (u: AdminUser) => void;
  onReassign: (u: AdminUser) => void;
  depth: number;
}) {
  const isSuper = user.role === "super_admin";
  const directReports = reports;
  const allDescendants = (id: string): number => {
    const children = byReportsTo(id);
    return children.reduce((s, c) => s + 1 + allDescendants(c.id), 0);
  };
  const totalReports = allDescendants(user.id);

  return (
    <div className="flex flex-col items-center">
      {/* Node card */}
      <div
        className={`relative w-64 cursor-pointer rounded-xl border-2 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
          isSuper ? "border-amber-500/40 bg-amber-500/5" : "border-brand/30 bg-card"
        }`}
        onClick={() => onSelect(user)}
      >
        <div className="flex items-start gap-3">
          <div className="relative">
            <AvatarLogo text={user.name} size="md" />
            {isSuper && (
              <Crown className="absolute -right-1 -top-1 h-4 w-4 fill-amber-400 text-amber-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.roleLabel}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <StatusBadge status={user.status} />
              <Badge variant="outline" className="text-[10px]">{totalReports} report(s)</Badge>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onReassign(user); }}
          className="absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
          style={{ opacity: 1 }}
        >
          Reassign
        </button>
      </div>

      {/* Connector + children */}
      {directReports.length > 0 && (
        <>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-wrap items-start justify-center gap-6">
            {directReports.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="h-4 w-px bg-border" />
                <OrgNode
                  user={child}
                  reports={byReportsTo(child.id)}
                  byReportsTo={byReportsTo}
                  onSelect={onSelect}
                  onReassign={onReassign}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function UserMiniDetail({ user, onReassign }: { user: AdminUser; onReassign: () => void }) {
  const role = adminRoles.find((r) => r.id === user.role);
  const reportsTo = adminUsers.find((u) => u.id === user.reportsTo);
  const reports = adminUsers.filter((u) => u.reportsTo === user.id);

  return (
    <div className="space-y-6">
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={user.name} size="lg" />
          <div className="flex-1">
            <SheetTitle className="flex items-center gap-2 text-base">
              {user.name}
              {user.role === "super_admin" && <Crown className="h-4 w-4 text-amber-500" />}
            </SheetTitle>
            <SheetDescription>{user.roleLabel}</SheetDescription>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status={user.status} />
              <Badge variant="outline">L{role?.level}</Badge>
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-2">
        <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
        <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone ?? "—"} />
        <InfoRow icon={<Clock className="h-4 w-4" />} label="Last Active" value={user.lastActive ? timeAgo(user.lastActive) : "Never"} />
        <InfoRow icon={<UserCog className="h-4 w-4" />} label="Created By" value={user.createdBy} />
      </div>

      {reportsTo && (
        <SectionCard title="Reports To">
          <button
            onClick={() => { /* could navigate */ }}
            className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:border-brand hover:bg-brand/5"
          >
            <AvatarLogo text={reportsTo.name} size="sm" />
            <div className="flex-1">
              <p className="text-sm font-medium">{reportsTo.name}</p>
              <p className="text-xs text-muted-foreground">{reportsTo.roleLabel}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </SectionCard>
      )}

      <SectionCard title="Direct Reports" description={`${reports.length} user(s)`}>
        {reports.length > 0 ? (
          <div className="space-y-2">
            {reports.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                <AvatarLogo text={r.name} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.roleLabel}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        ) : <EmptyState icon={<Users className="h-4 w-4" />} title="No direct reports" />}
      </SectionCard>

      <Button variant="outline" className="w-full" onClick={onReassign}>
        <GitBranch className="mr-2 h-4 w-4" /> Reassign Reporting Line
      </Button>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
