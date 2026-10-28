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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface SubAdmin {
  id: string; name: string; email: string; parentAdmin: string; role: string;
  scope: { portals: string[]; sections: string[] }; delegated: string[];
  status: "active" | "expired" | "suspended"; expires: string;
}

const SUB_ADMINS: SubAdmin[] = [
  { id: "sa_001", name: "Riya Menon", email: "riya@jobsonn.com", parentAdmin: "Neha Kapoor", role: "Sub-Admin (Ops)", scope: { portals: ["admin"], sections: ["users", "tickets"] }, delegated: ["users.create_users", "users.edit_users", "tickets.resolve"], status: "active", expires: "2025-12-31" },
  { id: "sa_002", name: "Aditya Shah", email: "aditya@jobsonn.com", parentAdmin: "Neha Kapoor", role: "Sub-Admin (Content)", scope: { portals: ["admin"], sections: ["jobs", "courses"] }, delegated: ["content.moderate_jobs", "content.approve_courses"], status: "active", expires: "2025-10-15" },
  { id: "sa_003", name: "Diya Rao", email: "diya@jobsonn.com", parentAdmin: "Raj Malhotra", role: "Sub-Admin (Billing)", scope: { portals: ["admin", "employer"], sections: ["invoices"] }, delegated: ["finance.view_transactions"], status: "active", expires: "2025-09-30" },
  { id: "sa_004", name: "Aryan Gupta", email: "aryan@jobsonn.com", parentAdmin: "Pooja Desai", role: "Sub-Admin (Partners)", scope: { portals: ["partner"], sections: ["applications"] }, delegated: ["partners.approve_partners"], status: "expired", expires: "2024-08-15" },
  { id: "sa_005", name: "Isha Khanna", email: "isha@jobsonn.com", parentAdmin: "Neha Kapoor", role: "Sub-Admin (Analytics)", scope: { portals: ["admin"], sections: ["reports"] }, delegated: ["analytics.view_all_reports", "analytics.export_data"], status: "suspended", expires: "2025-11-20" },
  { id: "sa_006", name: "Kabir Sinha", email: "kabir@jobsonn.com", parentAdmin: "Raj Malhotra", role: "Sub-Admin (Billing)", scope: { portals: ["admin"], sections: ["refunds"] }, delegated: ["finance.process_refunds"], status: "active", expires: "2026-01-10" },
];

const PORTALS = ["admin", "employer", "recruiter", "training", "partner"];
const SECTIONS = ["users", "tickets", "jobs", "courses", "invoices", "refunds", "reports", "applications"];
const PARENT_ADMINS = ["Neha Kapoor", "Raj Malhotra", "Pooja Desai", "Aarav Sharma"];

export function SuperAdminSubAdmins() {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filtered = SUB_ADMINS.filter(s => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.parentAdmin.toLowerCase().includes(q);
  });

  const byDept = new Set(SUB_ADMINS.map(s => s.role.split("(")[1]?.replace(")", "").trim() || "Other")).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sub-Admin Management"
        description="Delegate scoped permissions from parent admins. Sub-admins only receive a subset of their parent's permissions."
        icon={<Icon name="UserCheck" className="h-6 w-6" />}
        actions={[{ label: "New Sub-Admin", onClick: () => setOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 sm:gap-4">
        <StatCard label="Total Sub-Admins" value={SUB_ADMINS.length} icon={<Icon name="UserCheck" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={SUB_ADMINS.filter(s => s.status === "active").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="By Department" value={byDept} icon={<Icon name="Building2" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Sub-Admin Directory" description={`${filtered.length} of ${SUB_ADMINS.length} sub-admins`}>
        <div className="mb-3">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or parent admin…" className="h-9 max-w-md" />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="UserCheck" className="h-5 w-5" />} title="No sub-admins found" description="Try a different search." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent Admin</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Delegated</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </TableCell>
                    <TableCell className="text-xs">{s.parentAdmin}</TableCell>
                    <TableCell className="text-xs">{s.role}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {s.scope.portals.map(p => <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>)}
                        {s.scope.sections.map(sec => <Badge key={sec} variant="outline" className="text-[10px] bg-emerald-500/5 text-emerald-700 border-emerald-500/20">{sec}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">{s.delegated.length}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{s.expires}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        s.status === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                        : s.status === "expired" ? "bg-slate-500/15 text-slate-500 border-slate-500/30"
                        : "bg-rose-500/15 text-rose-700 border-rose-500/30"
                      }>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Edit ${s.name}`)}><Icon name="Pencil" className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`Renewed ${s.name}`)}><Icon name="RefreshCw" className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.error(`Revoked ${s.name}`)}><Icon name="Trash2" className="h-4 w-4 text-rose-500" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Delegation Chain" description="Visual chain: Admin → Sub-Admin → Sub-Sub-Admin">
        <div className="space-y-3">
          {PARENT_ADMINS.map(parent => {
            const subs = SUB_ADMINS.filter(s => s.parentAdmin === parent);
            if (subs.length === 0) return null;
            return (
              <div key={parent} className="rounded-md border bg-card p-3">
                <div className="flex items-center gap-2">
                  <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold">{parent}</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">Admin</Badge>
                </div>
                <div className="ml-6 mt-2 space-y-2 border-l-2 border-emerald-500/30 pl-4">
                  {subs.map(s => (
                    <div key={s.id} className="flex items-center gap-2">
                      <Icon name="ArrowRight" className="h-3 w-3 text-emerald-500" />
                      <Icon name="UserCheck" className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">{s.name}</span>
                      <Badge variant="outline" className="bg-muted text-[10px]">{s.role}</Badge>
                      <span className="ml-auto text-xs text-muted-foreground">{s.delegated.length} perms · expires {s.expires}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Sub-Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input placeholder="e.g. Riya Menon" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input placeholder="riya@jobsonn.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Parent Admin</Label>
                <Select defaultValue={PARENT_ADMINS[0]}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PARENT_ADMINS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select defaultValue="ops">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ops">Sub-Admin (Ops)</SelectItem>
                    <SelectItem value="content">Sub-Admin (Content)</SelectItem>
                    <SelectItem value="billing">Sub-Admin (Billing)</SelectItem>
                    <SelectItem value="partners">Sub-Admin (Partners)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Portal Scope</Label>
              <div className="grid grid-cols-3 gap-2">
                {PORTALS.map(p => (
                  <label key={p} className="flex items-center gap-2 rounded-md border p-2 text-xs"><Checkbox /> {p}</label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Section Scope</Label>
              <div className="grid grid-cols-4 gap-2">
                {SECTIONS.map(s => (
                  <label key={s} className="flex items-center gap-1.5 rounded-md border p-1.5 text-[11px]"><Checkbox /> {s}</label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Delegated Permissions</Label>
              <p className="text-xs text-muted-foreground">Only a subset of the parent admin's permissions can be selected.</p>
              <Input placeholder="Type permission code…" />
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOpen(false); toast.success("Sub-admin created"); }}>Create Sub-Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
