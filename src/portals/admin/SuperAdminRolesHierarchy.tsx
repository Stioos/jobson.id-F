"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface RoleNode {
  id: string; title: string; level: number; reportsTo?: string; users: number;
}

const ROLES: RoleNode[] = [
  { id: "r_001", title: "Super Admin", level: 0, users: 2 },
  { id: "r_002", title: "Platform Operations Lead", level: 1, reportsTo: "r_001", users: 3 },
  { id: "r_003", title: "Finance Admin", level: 1, reportsTo: "r_001", users: 2 },
  { id: "r_004", title: "Security Admin", level: 1, reportsTo: "r_001", users: 2 },
  { id: "r_005", title: "Support Lead", level: 2, reportsTo: "r_002", users: 5 },
  { id: "r_006", title: "Moderator", level: 2, reportsTo: "r_002", users: 4 },
  { id: "r_007", title: "Billing Specialist", level: 2, reportsTo: "r_003", users: 4 },
  { id: "r_008", title: "Compliance Officer", level: 2, reportsTo: "r_004", users: 2 },
];

const PERMISSIONS = ["users.view", "users.edit", "billing.view", "billing.refund", "content.moderate", "audit.view", "settings.edit", "impersonate"];
const MATRIX: Record<string, boolean[]> = {
  "Super Admin": [true, true, true, true, true, true, true, true],
  "Platform Ops Lead": [true, true, true, false, true, true, false, false],
  "Finance Admin": [false, false, true, true, false, true, false, false],
  "Security Admin": [true, false, false, false, true, true, false, true],
  "Support Lead": [true, false, false, false, true, false, false, false],
  "Moderator": [false, false, false, false, true, false, false, false],
  "Billing Specialist": [false, false, true, false, false, false, false, false],
  "Compliance Officer": [true, false, true, false, true, true, false, false],
};

export function SuperAdminRolesHierarchy() {
  const renderNode = (node: RoleNode) => {
    const children = ROLES.filter(r => r.reportsTo === node.id);
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className="rounded-lg border bg-card p-3 text-center shadow-sm min-w-[160px]">
          <div className="flex items-center justify-center gap-1.5">
            <Icon name="ShieldCheck" className="h-3.5 w-3.5 text-brand" />
            <span className="text-sm font-medium">{node.title}</span>
          </div>
          <Badge variant="secondary" className="mt-1 text-[10px]">{node.users} users</Badge>
        </div>
        {children.length > 0 && (
          <>
            <div className="h-4 w-px bg-border" />
            <div className="flex flex-wrap justify-center gap-4">
              {children.map(renderNode)}
            </div>
          </>
        )}
      </div>
    );
  };

  const root = ROLES.find(r => r.level === 0)!;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Hierarchy"
        description="Admin role org chart and capabilities matrix — who can do what across the platform."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[{ label: "Edit Matrix", variant: "outline", onClick: () => toast.info("Opening matrix editor") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Roles" value={ROLES.length} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Admin Users" value={ROLES.reduce((s, r) => s + r.users, 0)} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Hierarchy Levels" value={3} icon={<Icon name="Network" className="h-5 w-5" />} />
        <StatCard label="Permissions" value={PERMISSIONS.length} icon={<Icon name="Key" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Role Hierarchy" description="Org chart of admin roles">
        <div className="overflow-x-auto p-4">
          {renderNode(root)}
        </div>
      </SectionCard>

      <SectionCard title="Capabilities Matrix" description="Role × Permission grid" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              {PERMISSIONS.map(p => <TableHead key={p} className="text-center text-[10px]">{p}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(MATRIX).map(([role, perms]) => (
              <TableRow key={role}>
                <TableCell className="font-medium">{role}</TableCell>
                {perms.map((p, i) => (
                  <TableCell key={i} className="text-center">
                    {p ? <Icon name="Check" className="mx-auto h-4 w-4 text-emerald-500" />
                       : <Icon name="X" className="mx-auto h-4 w-4 text-muted-foreground/40" />}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
