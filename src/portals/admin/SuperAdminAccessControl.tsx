"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const ROLES = ["Super Admin", "Platform Ops Lead", "Finance Admin", "Security Admin", "Support Lead", "Moderator", "Billing Specialist", "Compliance Officer"];

const PERMISSIONS = [
  "users.view", "users.edit", "users.delete", "orgs.view", "billing.view", "billing.refund",
  "content.moderate", "content.delete", "audit.view", "settings.edit", "impersonate", "api_keys.manage",
];

const INITIAL_MATRIX: Record<string, boolean[]> = {
  "Super Admin": [true, true, true, true, true, true, true, true, true, true, true, true],
  "Platform Ops Lead": [true, true, false, true, true, false, true, false, true, false, false, false],
  "Finance Admin": [false, false, false, false, true, true, false, false, true, false, false, false],
  "Security Admin": [true, false, false, true, false, false, true, false, true, false, true, true],
  "Support Lead": [true, false, false, false, false, false, true, false, false, false, false, false],
  "Moderator": [false, false, false, false, false, false, true, true, false, false, false, false],
  "Billing Specialist": [false, false, false, false, true, false, false, false, false, false, false, false],
  "Compliance Officer": [true, false, false, true, true, false, true, false, true, false, false, false],
};

export function SuperAdminAccessControl() {
  const [matrix, setMatrix] = React.useState(INITIAL_MATRIX);

  const toggle = (role: string, idx: number) => {
    setMatrix({ ...matrix, [role]: matrix[role].map((v, i) => i === idx ? !v : v) });
    toast.success(`Permission updated for ${role}`);
  };

  const totalGrants = Object.values(matrix).reduce((s, perms) => s + perms.filter(Boolean).length, 0);
  const maxGrants = ROLES.length * PERMISSIONS.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access Control"
        description="Role-based access control matrix — grant or revoke permissions granularly."
        icon={<Icon name="Key" className="h-6 w-6" />}
        actions={[{ label: "Save Matrix", onClick: () => toast.success("Matrix saved") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Roles" value={ROLES.length} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Permissions" value={PERMISSIONS.length} icon={<Icon name="Key" className="h-5 w-5" />} />
        <StatCard label="Total Grants" value={totalGrants} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Coverage" value={`${((totalGrants / maxGrants) * 100).toFixed(1)}%`} icon={<Icon name="Activity" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Capabilities Matrix" description="Toggle grants per role × permission" contentClassName="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-card">Role</TableHead>
                {PERMISSIONS.map(p => (
                  <TableHead key={p} className="text-center text-[10px]">{p}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROLES.map(role => (
                <TableRow key={role}>
                  <TableCell className="sticky left-0 bg-card font-medium">{role}</TableCell>
                  {PERMISSIONS.map((_, i) => (
                    <TableCell key={i} className="text-center">
                      <Switch checked={matrix[role][i]} onCheckedChange={() => toggle(role, i)} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Effective Permissions Summary" description="Per-role grant counts">
        <div className="grid gap-2 md:grid-cols-2">
          {ROLES.map(role => {
            const grants = matrix[role].filter(Boolean).length;
            return (
              <div key={role} className="flex items-center justify-between rounded-md border bg-card p-3">
                <span className="text-sm font-medium">{role}</span>
                <Badge variant="outline" className={grants === PERMISSIONS.length ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : ""}>
                  {grants} / {PERMISSIONS.length}
                </Badge>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
