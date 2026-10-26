"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { employers, agencies, jobs, subscriptions } from "@/lib/mock-data";
import type { EmployerOrganization, Agency } from "@/lib/types";
import { formatDate, formatCurrency, formatNumber } from "@/lib/format";
import { toast } from "sonner";
import { Toolbar } from "./_shared";

type OrgRow = {
  id: string;
  name: string;
  type: "employer" | "agency";
  industry: string;
  plan: string;
  verified: boolean;
  members: number;
  status: string;
  created: string;
  logo: string;
  raw: EmployerOrganization | Agency;
};

export function AdminOrganizations() {
  const [rows, setRows] = React.useState<OrgRow[]>(buildRows());
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [planFilter, setPlanFilter] = React.useState("all");
  const [verifiedFilter, setVerifiedFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<OrgRow | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<OrgRow | null>(null);
  const [suspendTarget, setSuspendTarget] = React.useState<OrgRow | null>(null);

  const filtered = rows.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (planFilter !== "all" && r.plan !== planFilter) return false;
    if (verifiedFilter === "verified" && !r.verified) return false;
    if (verifiedFilter === "unverified" && r.verified) return false;
    return true;
  });

  const verify = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, verified: true } : r)));
    toast.success("Organization verified", { description: "Verification badge applied." });
  };
  const suspend = () => {
    if (!suspendTarget) return;
    setRows((prev) => prev.map((r) => (r.id === suspendTarget.id ? { ...r, status: "suspended" } : r)));
    toast.warning("Organization suspended", { description: `${suspendTarget.name} can no longer post jobs.` });
    setSuspendTarget(null);
  };
  const remove = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast.error("Organization deleted", { description: `${deleteTarget.name} permanently removed.` });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Organizations"
        description="Manage employer and agency organizations across the platform."
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[{ label: "Create organization", onClick: () => setCreateOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Employers" value={rows.filter((r) => r.type === "employer").length} icon="Building2" />
        <MiniStat label="Agencies" value={rows.filter((r) => r.type === "agency").length} icon="Network" />
        <MiniStat label="Verified" value={rows.filter((r) => r.verified).length} icon="BadgeCheck" />
        <MiniStat label="Suspended" value={rows.filter((r) => r.status === "suspended").length} icon="AlertTriangle" />
      </div>

      <SectionCard title={`Organizations (${filtered.length})`} description="Filter, verify, suspend, or remove organizations.">
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search organization name..."
          filters={
            <>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All plans</SelectItem>
                  {["free", "starter", "professional", "business", "enterprise"].map((p) => (<SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Verified" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        />
        <div className="mt-3 max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <button onClick={() => setDetail(r)} className="flex items-center gap-2 text-left">
                      <AvatarLogo text={r.name} size="sm" />
                      <span className="text-sm font-medium hover:underline">{r.name}</span>
                    </button>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{r.type}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.industry}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{r.plan}</Badge></TableCell>
                  <TableCell>{r.verified ? <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20">Yes</Badge> : <Badge variant="outline" className="text-amber-600">No</Badge>}</TableCell>
                  <TableCell className="text-sm">{formatNumber(r.members)}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(r.created)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">Actions</Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDetail(r)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Edit organization (demo)")}>Edit</DropdownMenuItem>
                        {!r.verified && <DropdownMenuItem onClick={() => verify(r.id)}>Verify</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSuspendTarget(r)} className="text-amber-600">Suspend…</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteTarget(r)} className="text-rose-600">Delete…</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">No organizations match your filters.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <AvatarLogo text={detail.name} size="md" />
                  <div>
                    <div>{detail.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">{detail.industry}</div>
                  </div>
                </SheetTitle>
                <SheetDescription>Organization profile, members, jobs, and billing.</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Type" value={<Badge variant="outline" className="capitalize">{detail.type}</Badge>} />
                  <Field label="Plan" value={<Badge variant="secondary" className="capitalize">{detail.plan}</Badge>} />
                  <Field label="Members" value={formatNumber(detail.members)} />
                  <Field label="Verified" value={detail.verified ? "Yes" : "No"} />
                  <Field label="Status" value={<StatusBadge status={detail.status} />} />
                  <Field label="Created" value={formatDate(detail.created)} />
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Team members</h4>
                  <ul className="mt-2 space-y-1.5">
                    {["Anika Verma", "Rohan Mehta", "Suresh Kumar"].map((m) => (
                      <li key={m} className="flex items-center gap-2 rounded-md border px-2.5 py-1.5">
                        <AvatarLogo text={m} size="xs" />
                        <span className="text-sm">{m}</span>
                        <Badge variant="outline" className="ml-auto text-xs">Admin</Badge>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Jobs</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {jobs.filter((j) => j.employerName === detail.name).slice(0, 3).map((j) => (
                      <li key={j.id} className="flex items-center justify-between rounded-md border px-2.5 py-1.5">
                        <span className="truncate">{j.title}</span>
                        <StatusBadge status={j.status} />
                      </li>
                    ))}
                    {jobs.filter((j) => j.employerName === detail.name).length === 0 && (
                      <li className="text-xs text-muted-foreground">No jobs posted.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Subscription & billing</h4>
                  {(() => {
                    const sub = subscriptions.find((s) => s.organizationName === detail.name);
                    return sub ? (
                      <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border p-3 text-sm">
                        <Field label="Plan" value={sub.planName} />
                        <Field label="Status" value={<StatusBadge status={sub.status} />} />
                        <Field label="Amount" value={formatCurrency(sub.amount, sub.currency)} />
                        <Field label="Renewal" value={formatDate(sub.renewalDate)} />
                      </div>
                    ) : <p className="mt-2 text-xs text-muted-foreground">No active subscription.</p>;
                  })()}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CreateOrgDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={(name, type, industry) => {
        const newRow: OrgRow = {
          id: `o_${Date.now()}`,
          name, type, industry,
          plan: "free",
          verified: false,
          members: 1,
          status: "active",
          created: new Date().toISOString(),
          logo: name.slice(0, 2).toUpperCase(),
          raw: {} as EmployerOrganization,
        };
        setRows((prev) => [newRow, ...prev]);
        toast.success("Organization created", { description: `${name} added as ${type}.` });
        setCreateOpen(false);
      }} />

      <AlertDialog open={!!suspendTarget} onOpenChange={(o) => !o && setSuspendTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend {suspendTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Suspended organizations cannot post jobs or contact candidates. Reversible at any time.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={suspend} className="bg-amber-600 hover:bg-amber-700">Suspend</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the organization and revokes all access. Existing jobs and applications are retained for audit.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function buildRows(): OrgRow[] {
  const employerRows: OrgRow[] = employers.map((e) => ({
    id: e.id,
    name: e.name,
    type: "employer",
    industry: e.industry,
    plan: e.plan,
    verified: e.verified,
    members: e.size ? parseInt(e.size) / 100 : 50,
    status: e.verified ? "active" : "pending",
    created: e.createdAt,
    logo: e.logo,
    raw: e,
  }));
  const agencyRows: OrgRow[] = agencies.map((a) => ({
    id: a.id,
    name: a.name,
    type: "agency",
    industry: a.specialties.join(", "),
    plan: "professional",
    verified: a.verified,
    members: a.recruiterCount,
    status: a.verified ? "active" : "pending",
    created: a.createdAt,
    logo: a.logo,
    raw: a,
  }));
  return [...employerRows, ...agencyRows];
}

function MiniStat({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <Icon name={icon} className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold">{formatNumber(value)}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  );
}

function CreateOrgDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (name: string, type: "employer" | "agency", industry: string) => void }) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<"employer" | "agency">("employer");
  const [industry, setIndustry] = React.useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>Add a new employer or agency to the platform.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="org-name">Organization name</Label>
            <Input id="org-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Corp" />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "employer" | "agency")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org-industry">Industry</Label>
            <Input id="org-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Information Technology" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!name.trim()) { toast.error("Name is required"); return; }
            onCreate(name.trim(), type, industry.trim() || "General");
            setName(""); setIndustry("");
          }}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
