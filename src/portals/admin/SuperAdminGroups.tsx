"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface GroupRow {
  id: string; name: string; description: string; members: number; roles: string[];
  portals: string[]; status: "active" | "disabled"; parent: string | null;
}

const GROUPS: GroupRow[] = [
  { id: "g_001", name: "Executive", description: "C-suite and founders", members: 5, roles: ["Super Admin", "Admin"], portals: ["admin", "employer"], status: "active", parent: null },
  { id: "g_002", name: "Management", description: "Department heads and senior managers", members: 12, roles: ["Manager"], portals: ["admin", "employer", "recruiter"], status: "active", parent: "Executive" },
  { id: "g_003", name: "Operations", description: "Day-to-day operations team", members: 24, roles: ["Manager", "Analyst"], portals: ["admin", "employer"], status: "active", parent: "Management" },
  { id: "g_004", name: "Finance", description: "Billing and accounting", members: 8, roles: ["Billing Admin"], portals: ["admin", "employer"], status: "active", parent: "Management" },
  { id: "g_005", name: "Support", description: "Customer support agents", members: 18, roles: ["Support"], portals: ["admin"], status: "active", parent: "Operations" },
  { id: "g_006", name: "Content", description: "Content moderation team", members: 9, roles: ["Content Admin"], portals: ["admin"], status: "active", parent: "Operations" },
  { id: "g_007", name: "Tech", description: "Engineering and DevOps", members: 15, roles: ["Admin"], portals: ["admin"], status: "active", parent: "Management" },
  { id: "g_008", name: "Partner Network", description: "Partner relationship managers", members: 6, roles: ["Partner Admin"], portals: ["admin", "partner"], status: "disabled", parent: "Management" },
];

const PORTAL_OPTS = ["admin", "employer", "recruiter", "candidate", "training", "partner"];
const ROLE_OPTS = ["Super Admin", "Admin", "Manager", "Analyst", "Support", "Billing Admin", "Content Admin", "Partner Admin"];

export function SuperAdminGroups() {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filtered = GROUPS.filter(g => {
    const s = search.toLowerCase();
    return !s || g.name.toLowerCase().includes(s) || g.description.toLowerCase().includes(s);
  });

  const totalMembers = GROUPS.reduce((sum, g) => sum + g.members, 0);

  const renderTree = (parentId: string | null, depth = 0) => {
    return GROUPS.filter(g => g.parent === parentId).map(g => (
      <div key={g.id} style={{ marginLeft: depth * 24 }}>
        <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
          <Icon name="Users" className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium">{g.name}</span>
          <Badge variant="outline" className="ml-auto bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{g.members} members</Badge>
        </div>
        {renderTree(g.id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Group Management"
        description="Organize users into groups with shared roles and portal access."
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[{ label: "New Group", onClick: () => setOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 sm:gap-4">
        <StatCard label="Total Groups" value={GROUPS.length} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active Groups" value={GROUPS.filter(g => g.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Total Members" value={totalMembers} icon={<Icon name="UserCheck" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Group Directory" description={`${filtered.length} of ${GROUPS.length} groups`}>
        <div className="mb-3">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search groups…" className="h-9 max-w-xs" />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Users" className="h-5 w-5" />} title="No groups found" description="Try a different search or create a new group." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Portal Access</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(g => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <div className="font-medium">{g.name}</div>
                      <div className="text-xs text-muted-foreground">{g.description}</div>
                    </TableCell>
                    <TableCell>{g.members}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {g.roles.map(r => <Badge key={r} variant="outline" className="bg-emerald-500/5 text-emerald-700 border-emerald-500/20">{r}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {g.portals.map(p => <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {g.status === "active"
                        ? <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">Active</Badge>
                        : <Badge variant="outline" className="bg-slate-500/15 text-slate-500 border-slate-500/30">Disabled</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Edit ${g.name}`)}><Icon name="Pencil" className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`Duplicated ${g.name}`)}><Icon name="Copy" className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.error(`Deleted ${g.name}`)}><Icon name="Trash2" className="h-4 w-4 text-rose-500" /></Button>
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
        <SectionCard title="Group Hierarchy" description="Tree view of parent → child groups">
          <div className="space-y-2">{renderTree(null)}</div>
        </SectionCard>
        <SectionCard title="Group ↔ Role Mapping" description="Roles assigned per group">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {GROUPS.map(g => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {g.roles.map(r => <Badge key={r} variant="outline" className="bg-emerald-500/5 text-emerald-700 border-emerald-500/20">{r}</Badge>)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Group Name</Label>
              <Input placeholder="e.g. Regional Ops" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={2} placeholder="Describe the group…" />
            </div>
            <div className="space-y-1.5">
              <Label>Parent Group</Label>
              <Select defaultValue="management">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— No parent (root)</SelectItem>
                  {GROUPS.map(g => <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Portal Access</Label>
              <div className="grid grid-cols-2 gap-2">
                {PORTAL_OPTS.map(p => (
                  <label key={p} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                    <Checkbox /> {p}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Member Selection</Label>
              <Input placeholder="Search users to add…" />
              <p className="text-xs text-muted-foreground">Multi-select dropdown — start typing to find users across portals.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOpen(false); toast.success("Group created"); }}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
