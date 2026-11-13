"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AdminRow {
  id: string; name: string; email: string; role: string; group: string; department: string;
  portals: string[]; lastLogin: string; status: "active" | "suspended" | "pending";
  activity: { actions: number; lastAction: string; tasks: number };
}

const ADMINS: AdminRow[] = [
  { id: "a_001", name: "Aarav Sharma", email: "aarav@jobson.id", role: "Super Admin", group: "Executive", department: "Leadership", portals: ["admin", "employer", "recruiter"], lastLogin: "2024-09-21T09:55:00Z", status: "active", activity: { actions: 248, lastAction: "Updated feature flags", tasks: 6 } },
  { id: "a_002", name: "Neha Kapoor", email: "neha@jobson.id", role: "Admin", group: "Management", department: "Operations", portals: ["admin", "employer"], lastLogin: "2024-09-21T08:30:00Z", status: "active", activity: { actions: 152, lastAction: "Approved employer KYC", tasks: 12 } },
  { id: "a_003", name: "Raj Malhotra", email: "raj@jobson.id", role: "Billing Admin", group: "Finance", department: "Finance", portals: ["admin", "employer"], lastLogin: "2024-09-21T07:15:00Z", status: "active", activity: { actions: 89, lastAction: "Processed payout ₹4.2L", tasks: 4 } },
  { id: "a_004", name: "Sneha Iyer", email: "sneha@jobson.id", role: "Content Admin", group: "Content", department: "Content", portals: ["admin"], lastLogin: "2024-09-20T18:20:00Z", status: "active", activity: { actions: 64, lastAction: "Approved 6 jobs", tasks: 8 } },
  { id: "a_005", name: "Vikram Reddy", email: "vikram@jobson.id", role: "Manager", group: "Operations", department: "Support", portals: ["admin"], lastLogin: "2024-09-19T14:10:00Z", status: "suspended", activity: { actions: 0, lastAction: "—", tasks: 0 } },
  { id: "a_006", name: "Pooja Desai", email: "pooja@jobson.id", role: "Partner Admin", group: "Partner Network", department: "Partnerships", portals: ["admin", "partner"], lastLogin: "2024-09-21T09:00:00Z", status: "active", activity: { actions: 41, lastAction: "Signed partner MoU", tasks: 3 } },
  { id: "a_007", name: "Karan Mehta", email: "karan@jobson.id", role: "Analyst", group: "Operations", department: "Analytics", portals: ["admin"], lastLogin: "2024-09-21T05:45:00Z", status: "active", activity: { actions: 28, lastAction: "Exported cohort report", tasks: 2 } },
  { id: "a_008", name: "Ananya Bose", email: "ananya@jobson.id", role: "Admin", group: "Tech", department: "Engineering", portals: ["admin"], lastLogin: "2024-09-18T22:00:00Z", status: "pending", activity: { actions: 0, lastAction: "Awaiting approval", tasks: 0 } },
];

const PORTAL_OPTS = ["admin", "employer", "recruiter", "training", "partner"];

export function SuperAdminAdminAccounts() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<AdminRow | null>(null);
  const [open, setOpen] = React.useState(false);

  const filtered = ADMINS.filter(a => {
    const s = search.toLowerCase();
    const matchS = !s || a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s);
    const matchF = statusFilter === "all" || a.status === statusFilter;
    return matchS && matchF;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Account Management"
        description="Provision, suspend and audit administrative accounts across all portals."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[{ label: "New Admin", onClick: () => setOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Admins" value={ADMINS.length} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={ADMINS.filter(a => a.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Suspended" value={ADMINS.filter(a => a.status === "suspended").length} icon={<Icon name="Lock" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Pending" value={ADMINS.filter(a => a.status === "pending").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard title="Admin Accounts" description={`${filtered.length} of ${ADMINS.length} admins`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…" className="h-9 max-w-xs" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="ShieldCheck" className="h-5 w-5" />} title="No admins found" description="Adjust filters or create a new admin account." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role / Group</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Portals</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">{a.role}</div>
                      <div className="text-xs text-muted-foreground">{a.group}</div>
                    </TableCell>
                    <TableCell className="text-xs">{a.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {a.portals.map(p => <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.lastLogin.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        a.status === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                        : a.status === "suspended" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
                        : "bg-amber-500/15 text-amber-700 border-amber-500/30"
                      }>{a.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setSelected(a)}><Icon name="Eye" className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Edit ${a.name}`)}><Icon name="Pencil" className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => a.status === "active" ? toast.error(`Suspended ${a.name}`) : toast.success(`Activated ${a.name}`)}><Icon name="Lock" className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`Reset email sent to ${a.email}`)}><Icon name="Key" className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>{selected.email} · {selected.role}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md border p-2">
                    <div className="text-lg font-semibold text-emerald-700">{selected.activity.actions}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Actions</div>
                  </div>
                  <div className="rounded-md border p-2">
                    <div className="text-lg font-semibold text-emerald-700">{selected.activity.tasks}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Tasks</div>
                  </div>
                  <div className="rounded-md border p-2">
                    <div className="text-lg font-semibold text-emerald-700">{selected.portals.length}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Portals</div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Recent Action</div>
                  <div className="rounded-md border bg-muted/30 p-2 text-sm">{selected.activity.lastAction}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Access Summary</div>
                  <div className="flex flex-wrap gap-1">
                    {selected.portals.map(p => <Badge key={p} variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{p}</Badge>)}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info(`Full access log for ${selected.name}`)}>View Full Access Log</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Admin Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input placeholder="e.g. Priya Nair" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input placeholder="priya@jobson.id" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="billing">Billing Admin</SelectItem>
                    <SelectItem value="content">Content Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Group</Label>
                <Select defaultValue="ops">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exec">Executive</SelectItem>
                    <SelectItem value="mgmt">Management</SelectItem>
                    <SelectItem value="ops">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Input placeholder="e.g. Operations" />
            </div>
            <div className="space-y-1.5">
              <Label>Portal Access</Label>
              <div className="grid grid-cols-3 gap-2">
                {PORTAL_OPTS.map(p => (
                  <label key={p} className="flex items-center gap-2 rounded-md border p-2 text-xs">
                    <Checkbox /> {p}
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Permissions inherited from role. Custom overrides available after creation.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOpen(false); toast.success("Admin account created"); }}>Create Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
