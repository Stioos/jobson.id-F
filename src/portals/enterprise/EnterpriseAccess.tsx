"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader, SectionCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { ShieldCheck, Lock, Plus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import {
  ENTERPRISE_ENTITIES, ENTERPRISE_ROLES, PERMISSION_KEYS, PERMISSION_LABELS,
  DEFAULT_PERMISSIONS, DEPARTMENTS, ENTERPRISE_TEAMS,
  TenantDisclaimer, type EnterpriseRole,
} from "./_shared";

const roleSchema = z.object({
  name: z.string().min(2, "Required").max(60),
  description: z.string().min(2, "Required").max(200),
  scope: z.enum(["tenant", "entity", "department", "team"]),
  baseRole: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

const MEMBERS = [
  { id: "m_1", name: "Rohan Mehta", email: "rohan.mehta@techcorp.com", role: "Enterprise Admin", entityId: "e_001", teamId: null, lastActive: "2024-10-20T07:45:00Z" },
  { id: "m_2", name: "Anika Verma", email: "anika@techcorp.com", role: "Hiring Manager", entityId: "e_001", teamId: "t_001", lastActive: "2024-10-20T06:00:00Z" },
  { id: "m_3", name: "Priya Nair", email: "priya.nair@techcorp.com", role: "HRBP", entityId: "e_001", teamId: null, lastActive: "2024-10-19T15:00:00Z" },
  { id: "m_4", name: "Wei Lin", email: "wei.lin@techcorp.com", role: "Entity Admin", entityId: "e_apac", teamId: null, lastActive: "2024-10-20T05:30:00Z" },
  { id: "m_5", name: "Hans Mueller", email: "hans.mueller@techcorp.com", role: "Entity Admin", entityId: "e_eu", teamId: null, lastActive: "2024-10-19T18:00:00Z" },
  { id: "m_6", name: "Arjun Patel", email: "arjun@greenleaf.energy", role: "Entity Admin", entityId: "e_004", teamId: null, lastActive: "2024-10-17T09:30:00Z" },
  { id: "m_7", name: "Neha Kapoor", email: "neha@eduverse.in", role: "Entity Admin", entityId: "e_005", teamId: null, lastActive: "2024-10-19T13:15:00Z" },
  { id: "m_8", name: "Karthik Menon", email: "karthik.m@techcorp.com", role: "Interviewer", entityId: "e_001", teamId: "t_003", lastActive: "2024-10-18T14:00:00Z" },
  { id: "m_9", name: "Mei Tan", email: "mei.tan@techcorp.com", role: "APAC Talent Sourcer", entityId: "e_apac", teamId: "t_006", lastActive: "2024-10-19T03:00:00Z" },
  { id: "m_10", name: "Sunita Rao", email: "sunita@greenleaf.energy", role: "Hiring Manager", entityId: "e_004", teamId: "t_011", lastActive: "2024-10-16T11:00:00Z" },
];

export function EnterpriseAccess() {
  const [roles, setRoles] = React.useState<EnterpriseRole[]>(ENTERPRISE_ROLES);
  const [members, setMembers] = React.useState(MEMBERS);
  const [permissions, setPermissions] = React.useState<Record<string, Set<string>>>(
    Object.fromEntries(Object.entries(DEFAULT_PERMISSIONS).map(([k, v]) => [k, new Set(v)]))
  );
  const [addOpen, setAddOpen] = React.useState(false);
  const [policyDraft, setPolicyDraft] = React.useState<{ entity: string; department: string; team: string; role: string }>({ entity: "e_001", department: "All", team: "all", role: "Hiring Manager" });

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", description: "", scope: "entity", baseRole: "" },
  });
  const scopeWatch = useWatch({ control: form.control, name: "scope" });
  const baseRoleWatch = useWatch({ control: form.control, name: "baseRole" });

  function togglePermission(roleName: string, perm: string) {
    setPermissions((prev) => {
      const cur = new Set(prev[roleName]);
      if (cur.has(perm)) cur.delete(perm);
      else cur.add(perm);
      return { ...prev, [roleName]: cur };
    });
  }

  function changeMemberRole(memberId: string, role: string) {
    setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, role } : m));
    toast.success(`Role updated to “${role}”`);
  }

  function onSubmit(values: RoleFormValues) {
    const newRole: EnterpriseRole = {
      id: `r_new_${Date.now()}`,
      name: values.name,
      description: values.description,
      isCustom: true,
      memberCount: 0,
      scope: values.scope,
    };
    setRoles((r) => [...r, newRole]);
    const basePerms = values.baseRole ? new Set(permissions[values.baseRole] ?? []) : new Set<string>();
    setPermissions((p) => ({ ...p, [values.name]: basePerms }));
    setAddOpen(false);
    form.reset();
    toast.success(`Custom role “${newRole.name}” created`);
  }

  function savePolicy() {
    toast.success("Multi-level access policy saved", {
      description: `Role: ${policyDraft.role} → Entity: ${ENTERPRISE_ENTITIES.find((e) => e.id === policyDraft.entity)?.name} → Dept: ${policyDraft.department} → Team: ${policyDraft.team === "all" ? "All" : policyDraft.team}`,
    });
  }

  const teamOptions = ENTERPRISE_TEAMS.filter((t) => t.entityId === policyDraft.entity);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Access Policies"
        description="Role-based access control with custom enterprise roles, member assignments, and multi-level scoping."
        icon={<Icon name="Lock" className="h-6 w-6" />}
        actions={[{ label: "Create role", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />

      <TenantDisclaimer />

      <div className="grid gap-3 sm:grid-cols-4">
        <MiniStat label="Roles" value={roles.length} />
        <MiniStat label="Custom roles" value={roles.filter((r) => r.isCustom).length} />
        <MiniStat label="Members" value={members.length} />
        <MiniStat label="Least-privilege coverage" value={`${Math.round((members.filter((m) => !["Enterprise Admin", "Entity Admin"].includes(m.role)).length / members.length) * 100)}%`} />
      </div>

      {/* Permission matrix */}
      <SectionCard
        title="Permission matrix"
        description="Roles × permissions. Custom roles are editable; system roles are read-only."
        action={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="mr-1 h-3 w-3" /> Least-privilege
            </Badge>
          </div>
        }
      >
        <div className="max-h-[34rem] overflow-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="sticky left-0 bg-card">Role</TableHead>
                {PERMISSION_KEYS.map((p) => (
                  <TableHead key={p} className="text-center text-xs whitespace-nowrap" title={PERMISSION_LABELS[p]}>
                    {PERMISSION_LABELS[p].split(" ").slice(-1)[0].slice(0, 12)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((r) => {
                const perms = permissions[r.name] ?? new Set<string>();
                return (
                  <TableRow key={r.id}>
                    <TableCell className="sticky left-0 bg-card">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-sm font-medium">{r.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.scope} · {r.memberCount} members {r.isCustom && <Badge variant="secondary" className="ml-1 text-[10px]">custom</Badge>}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {PERMISSION_KEYS.map((p) => {
                      const checked = perms.has(p);
                      const disabled = !r.isCustom && r.name === "Enterprise Admin";
                      return (
                        <TableCell key={p} className="text-center">
                          <Checkbox
                            checked={checked}
                            disabled={disabled}
                            onCheckedChange={() => r.isCustom && togglePermission(r.name, p)}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Member-to-role assignment */}
      <SectionCard title="Member-to-role assignments" description="Assign and re-scope roles per member.">
        <div className="max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Entity scope</TableHead>
                <TableHead>Team scope</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Reassign</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => {
                const ent = ENTERPRISE_ENTITIES.find((e) => e.id === m.entityId);
                const team = m.teamId ? ENTERPRISE_TEAMS.find((t) => t.id === m.teamId) : null;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={m.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{m.role}</Badge>
                      {["Enterprise Admin", "Entity Admin"].includes(m.role) ? (
                        <span className="ml-2 text-[10px] text-amber-600 dark:text-amber-400 inline-flex items-center">
                          <ShieldAlert className="h-3 w-3 mr-0.5" /> privileged
                        </span>
                      ) : (
                        <span className="ml-2 text-[10px] text-emerald-600 dark:text-emerald-400 inline-flex items-center">
                          <ShieldCheck className="h-3 w-3 mr-0.5" /> least-privilege
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{ent?.name ?? "—"}</TableCell>
                    <TableCell className="text-sm">{team?.name ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(m.lastActive).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>
                      <Select value={m.role} onValueChange={(v) => changeMemberRole(m.id, v)}>
                        <SelectTrigger className="h-8 w-[180px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Multi-level access policy editor */}
      <SectionCard title="Multi-level access policy editor" description="Scope a role's reach from tenant down to team level.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Role">
            <Select value={policyDraft.role} onValueChange={(v) => setPolicyDraft((d) => ({ ...d, role: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Entity scope">
            <Select value={policyDraft.entity} onValueChange={(v) => setPolicyDraft((d) => ({ ...d, entity: v, team: "all" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ENTERPRISE_ENTITIES.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Department">
            <Select value={policyDraft.department} onValueChange={(v) => setPolicyDraft((d) => ({ ...d, department: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Team">
            <Select value={policyDraft.team} onValueChange={(v) => setPolicyDraft((d) => ({ ...d, team: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All teams</SelectItem>
                {teamOptions.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="mt-3 flex items-center justify-end">
          <Button onClick={savePolicy}>Save policy</Button>
        </div>
      </SectionCard>

      {/* Add custom role dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create custom role</DialogTitle>
            <DialogDescription>Custom roles start with permissions from a base role (or empty) and are fully editable.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Field label="Role name" error={form.formState.errors.name?.message}>
              <Input {...form.register("name")} placeholder="EU Compliance Reviewer" />
            </Field>
            <Field label="Description" error={form.formState.errors.description?.message}>
              <Textarea {...form.register("description")} rows={2} placeholder="Scoped read-only access for EU compliance audits." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Scope">
                <Select value={scopeWatch} onValueChange={(v) => form.setValue("scope", v as RoleFormValues["scope"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="entity">Entity</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Base role (copy permissions)">
                <Select value={baseRoleWatch} onValueChange={(v) => form.setValue("baseRole", v)}>
                  <SelectTrigger><SelectValue placeholder="None (start empty)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (start empty)</SelectItem>
                    {roles.filter((r) => !r.isCustom).map((r) => (
                      <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create role</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
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
