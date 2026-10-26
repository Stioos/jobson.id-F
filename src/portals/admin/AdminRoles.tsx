"use client";

import * as React from "react";
import { PageHeader, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Role = {
  key: string;
  label: string;
  description: string;
  users: number;
  isSystem: boolean;
};

const PERMISSIONS = [
  "jobs.create", "jobs.edit", "jobs.publish", "jobs.delete",
  "applications.view", "applications.advance", "applications.reject",
  "candidates.view", "candidates.contact", "candidates.export",
  "interviews.schedule", "interviews.feedback",
  "offers.create", "offers.approve",
  "team.invite", "team.manage", "billing.view", "billing.manage",
  "reports.view", "reports.export", "settings.manage", "audit.view",
];

const INITIAL_ROLES: Role[] = [
  { key: "candidate", label: "Candidate", description: "Default applicant role", users: 1240, isSystem: true },
  { key: "employer", label: "Employer", description: "Posts jobs, reviews applications", users: 86, isSystem: true },
  { key: "recruiter", label: "Recruiter", description: "Agency recruiter working on mandates", users: 24, isSystem: true },
  { key: "agency", label: "Agency Admin", description: "Manages agency team & clients", users: 8, isSystem: true },
  { key: "hiring_manager", label: "Hiring Manager", description: "Reviews & approves shortlists", users: 42, isSystem: true },
  { key: "interviewer", label: "Interviewer", description: "Submits scorecards", users: 78, isSystem: true },
  { key: "billing_manager", label: "Billing Manager", description: "Manages invoices & payments", users: 14, isSystem: true },
  { key: "org_admin", label: "Org Admin", description: "Manages org-level settings", users: 36, isSystem: true },
  { key: "enterprise_admin", label: "Enterprise Admin", description: "Multi-entity governance", users: 4, isSystem: true },
  { key: "platform_admin", label: "Platform Admin", description: "Full platform access", users: 3, isSystem: true },
  { key: "support", label: "Support Agent", description: "Handles tickets, limited admin", users: 6, isSystem: true },
];

const DEFAULT_MATRIX: Record<string, Set<string>> = {
  candidate: new Set(["applications.view"]),
  employer: new Set(["jobs.create", "jobs.edit", "jobs.publish", "applications.view", "applications.advance", "applications.reject", "candidates.view", "candidates.contact", "interviews.schedule", "interviews.feedback", "offers.create", "team.invite", "team.manage", "billing.view", "reports.view"]),
  recruiter: new Set(["jobs.create", "applications.view", "applications.advance", "candidates.view", "candidates.contact", "interviews.schedule", "reports.view"]),
  agency: new Set(["jobs.create", "applications.view", "candidates.view", "candidates.contact", "team.manage", "billing.view", "reports.view"]),
  hiring_manager: new Set(["applications.view", "applications.advance", "applications.reject", "interviews.feedback", "offers.approve", "reports.view"]),
  interviewer: new Set(["applications.view", "interviews.feedback"]),
  billing_manager: new Set(["billing.view", "billing.manage", "reports.view"]),
  org_admin: new Set(["jobs.create", "jobs.publish", "team.invite", "team.manage", "billing.view", "reports.view", "settings.manage"]),
  enterprise_admin: new Set(["jobs.create", "jobs.publish", "team.manage", "billing.view", "billing.manage", "reports.view", "settings.manage", "audit.view"]),
  platform_admin: new Set(PERMISSIONS),
  support: new Set(["applications.view", "candidates.view", "reports.view", "audit.view"]),
};

export function AdminRoles() {
  const [roles] = React.useState<Role[]>(INITIAL_ROLES);
  const [matrix, setMatrix] = React.useState<Record<string, Set<string>>>(() => {
    const copy: Record<string, Set<string>> = {};
    for (const k of Object.keys(DEFAULT_MATRIX)) copy[k] = new Set(DEFAULT_MATRIX[k]);
    return copy;
  });
  const [activeRole, setActiveRole] = React.useState<string>("platform_admin");
  const [createOpen, setCreateOpen] = React.useState(false);

  const togglePerm = (perm: string) => {
    setMatrix((prev) => {
      const next = { ...prev };
      const set = new Set(next[activeRole]);
      if (set.has(perm)) set.delete(perm);
      else set.add(perm);
      next[activeRole] = set;
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Roles & Permissions"
        description="Define roles, manage the permission matrix, and create custom roles."
        icon={<Icon name="Shield" className="h-6 w-6" />}
        actions={[{ label: "Create role", onClick: () => setCreateOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Total roles" value={roles.length} icon="Shield" />
        <MiniStat label="Custom roles" value={2} icon="Users2" />
        <MiniStat label="Permission keys" value={PERMISSIONS.length} icon="KeyRound" />
        <MiniStat label="Users with admin" value={roles.reduce((s, r) => s + (r.key.includes("admin") ? r.users : 0), 0)} icon="Users" />
      </div>

      <SectionCard title="Roles" description="Select a role to edit its permissions.">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <li key={r.key}>
              <button
                onClick={() => setActiveRole(r.key)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${activeRole === r.key ? "border-brand bg-brand/5" : "hover:bg-muted/50"}`}
              >
                <AvatarLogo text={r.label} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{r.label}</span>
                    {r.isSystem && <Badge variant="outline" className="text-[10px]">System</Badge>}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{r.description}</p>
                </div>
                <Badge variant="secondary">{r.users}</Badge>
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Permission matrix"
        description={`Editing permissions for: ${roles.find((r) => r.key === activeRole)?.label}`}
        action={<Button size="sm" variant="outline" onClick={() => toast.success("Permissions saved", { description: `Matrix updated for ${roles.find((r) => r.key === activeRole)?.label}.` })}>Save changes</Button>}
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PERMISSIONS.map((p) => {
            const enabled = matrix[activeRole]?.has(p) ?? false;
            return (
              <label key={p} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/50 cursor-pointer">
                <Checkbox checked={enabled} onCheckedChange={() => togglePerm(p)} />
                <span className="font-mono text-xs">{p}</span>
              </label>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Groups" description="Logical groupings for bulk assignment.">
          <ul className="space-y-2 text-sm">
            {[
              { name: "All Engineering Hiring", count: 18 },
              { name: "Finance & Billing Team", count: 6 },
              { name: "External Recruiters", count: 24 },
              { name: "Enterprise Admins", count: 4 },
            ].map((g) => (
              <li key={g.name} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="flex items-center gap-2"><Icon name="Users2" className="h-4 w-4 text-muted-foreground" />{g.name}</span>
                <Badge variant="secondary">{g.count} members</Badge>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Assignment stats" description="Users per role.">
          <ul className="space-y-2 text-sm">
            {roles.slice(0, 6).map((r) => {
              const max = Math.max(...roles.map((x) => x.users));
              return (
                <li key={r.key}>
                  <div className="flex items-center justify-between">
                    <span>{r.label}</span>
                    <span className="text-muted-foreground">{r.users}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-brand" style={{ width: `${(r.users / max) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      <CreateRoleDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={(name, desc) => {
        toast.success("Custom role created", { description: `${name} created with no permissions. Assign below.` });
        setCreateOpen(false);
        void desc;
      }} />
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <Icon name={icon} className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function CreateRoleDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (name: string, desc: string) => void }) {
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create custom role</DialogTitle>
          <DialogDescription>Define a new role with granular permissions. You can edit permissions after creation.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Role name</Label>
            <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Talent Sourcer" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-desc">Description</Label>
            <Input id="role-desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="External sourcer with limited access" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!name.trim()) { toast.error("Role name is required"); return; }
            onCreate(name.trim(), desc.trim());
            setName(""); setDesc("");
          }}>Create role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
