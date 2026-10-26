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
import { Checkbox } from "@/components/ui/checkbox";
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
import { platformUsers } from "@/lib/mock-data";
import type { User, UserRole } from "@/lib/types";
import { formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Toolbar } from "./_shared";

const ROLE_OPTIONS: UserRole[] = ["candidate", "employer", "recruiter", "agency", "hiring_manager", "interviewer", "billing_manager", "org_admin", "enterprise_admin", "platform_admin", "support"];

export function AdminUsers() {
  const [users, setUsers] = React.useState<User[]>(platformUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [detailUser, setDetailUser] = React.useState<User | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [suspendTarget, setSuspendTarget] = React.useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<User | null>(null);

  const filtered = users.filter((u) => {
    if (search && !`${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (verifiedFilter === "verified" && !u.verified) return false;
    if (verifiedFilter === "unverified" && u.verified) return false;
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every((u) => selected.has(u.id));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) filtered.forEach((u) => next.delete(u.id));
    else filtered.forEach((u) => next.add(u.id));
    setSelected(next);
  };
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const markVerified = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, verified: true } : u)));
    toast.success("User verified", { description: "Verification email sent to user." });
  };
  const suspend = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, verified: false } : u)));
    setSuspendTarget(null);
    toast.warning("User suspended", { description: "User has been signed out of all sessions." });
  };
  const restore = (id: string) => {
    toast.success("User restored", { description: "Access reinstated." });
    void id;
  };
  const deactivate = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.warning("User deactivated", { description: "Account marked inactive. Data retained 90 days." });
    void id;
  };
  const removeUser = () => {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.error("User deleted", { description: "Account permanently removed (audit logged)." });
  };
  const bulkVerify = () => {
    setUsers((prev) => prev.map((u) => (selected.has(u.id) ? { ...u, verified: true } : u)));
    toast.success(`${selected.size} users verified`);
    setSelected(new Set());
  };
  const bulkSuspend = () => {
    setUsers((prev) => prev.map((u) => (selected.has(u.id) ? { ...u, verified: false } : u)));
    toast.warning(`${selected.size} users suspended`);
    setSelected(new Set());
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="User Management"
        description="Manage platform users, roles, verification, and access."
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[{ label: "Create user", onClick: () => setCreateOpen(true) }]}
      />

      <SectionCard
        title={`All users (${filtered.length})`}
        description="Search, filter, and take bulk or per-row actions."
        action={
          selected.size > 0 ? (
            <div className="flex items-center gap-2">
              <Badge>{selected.size} selected</Badge>
              <Button size="sm" variant="outline" onClick={bulkVerify}>Verify</Button>
              <Button size="sm" variant="outline" onClick={bulkSuspend}>Suspend</Button>
            </div>
          ) : undefined
        }
      >
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search name or email..."
          filters={
            <>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {ROLE_OPTIONS.map((r) => (<SelectItem key={r} value={r}>{r.replace(/_/g, " ")}</SelectItem>))}
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
                <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" /></TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell><Checkbox checked={selected.has(u.id)} onCheckedChange={() => toggle(u.id)} aria-label={`Select ${u.name}`} /></TableCell>
                  <TableCell>
                    <button onClick={() => setDetailUser(u)} className="flex items-center gap-2 text-left">
                      <AvatarLogo text={u.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium hover:underline">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </button>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{u.role.replace(/_/g, " ")}</Badge></TableCell>
                  <TableCell>{u.verified ? <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20">Verified</Badge> : <Badge variant="outline" className="text-amber-600 dark:text-amber-300">Pending</Badge>}</TableCell>
                  <TableCell>{u.mfaEnabled ? <Icon name="Lock" className="h-4 w-4 text-emerald-500" /> : <span className="text-xs text-muted-foreground">Off</span>}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(u.lastActive)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">Actions</Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDetailUser(u)}>View profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Edit form opened (demo)")}>Edit</DropdownMenuItem>
                        {!u.verified && <DropdownMenuItem onClick={() => markVerified(u.id)}>Verify</DropdownMenuItem>}
                        {u.verified && <DropdownMenuItem onClick={() => suspend(u.id)} className="text-amber-600">Suspend</DropdownMenuItem>}
                        {u.verified && <DropdownMenuItem onClick={() => restore(u.id)}>Restore access</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSuspendTarget(u)} className="text-amber-600">Suspend…</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteTarget(u)} className="text-rose-600">Deactivate…</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No users match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Detail Sheet */}
      <Sheet open={!!detailUser} onOpenChange={(o) => !o && setDetailUser(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detailUser && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <AvatarLogo text={detailUser.name} size="md" />
                  <div>
                    <div>{detailUser.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">{detailUser.email}</div>
                  </div>
                </SheetTitle>
                <SheetDescription>User account details and history.</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Role" value={<Badge variant="outline" className="capitalize">{detailUser.role.replace(/_/g, " ")}</Badge>} />
                  <Field label="Status" value={detailUser.verified ? <StatusBadge status="active" /> : <StatusBadge status="pending" />} />
                  <Field label="MFA enabled" value={detailUser.mfaEnabled ? "Yes" : "No"} />
                  <Field label="User ID" value={<code className="text-xs">{detailUser.id}</code>} />
                  <Field label="Created" value={formatDate(detailUser.createdAt)} />
                  <Field label="Last active" value={timeAgo(detailUser.lastActive)} />
                  {detailUser.phone && <Field label="Phone" value={detailUser.phone} />}
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Consent records</h4>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {[
                      { type: "marketing", granted: false, when: "2023-09-12" },
                      { type: "data_sharing", granted: true, when: "2023-09-12" },
                      { type: "analytics", granted: true, when: "2023-09-12" },
                      { type: "profile_indexing", granted: true, when: "2023-09-12" },
                    ].map((c) => (
                      <li key={c.type} className="flex items-center justify-between rounded-md border px-2.5 py-1.5">
                        <span className="capitalize">{c.type.replace(/_/g, " ")}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{c.when}</span>
                          <Badge variant={c.granted ? "default" : "outline"} className={c.granted ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}>{c.granted ? "Granted" : "Denied"}</Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Login history</h4>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    {[
                      { ip: "203.0.113.42", when: detailUser.lastActive, ok: true },
                      { ip: "203.0.113.51", when: "2024-10-18T07:00:00Z", ok: true },
                      { ip: "198.51.100.7", when: "2024-10-15T22:00:00Z", ok: false },
                    ].map((l, i) => (
                      <li key={i} className="flex items-center justify-between rounded-md border px-2.5 py-1.5">
                        <span>{l.ip}</span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                          {timeAgo(l.when)}
                          <Badge variant="outline" className={l.ok ? "text-emerald-600" : "text-rose-600"}>{l.ok ? "Success" : "Failed"}</Badge>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Memberships</h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["TechCorp India", "Recruitment Council"].map((m) => (
                      <Badge key={m} variant="secondary">{m}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create user dialog */}
      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={(u) => {
        setUsers((prev) => [u, ...prev]);
        toast.success("User created", { description: `Invite sent to ${u.email}` });
        setCreateOpen(false);
      }} />

      {/* Suspend confirm */}
      <AlertDialog open={!!suspendTarget} onOpenChange={(o) => !o && setSuspendTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend {suspendTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              The user will be immediately signed out and unable to log in. This action is reversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => suspendTarget && suspend(suspendTarget.id)} className="bg-amber-600 hover:bg-amber-700">Suspend</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the account after a 90-day grace period. Data is retained for audit. This action is logged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeUser} className="bg-rose-600 hover:bg-rose-700">Deactivate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

function CreateUserDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (u: User) => void }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("candidate");

  const submit = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    const u: User = {
      id: `pu_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      avatar: "",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      verified: false,
      mfaEnabled: false,
    };
    onCreate(u);
    setName(""); setEmail(""); setRole("candidate");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new user</DialogTitle>
          <DialogDescription>An invitation email will be sent to the user with onboarding instructions.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cu-name">Full name</Label>
            <Input id="cu-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Nair" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cu-email">Email</Label>
            <Input id="cu-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="priya@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (<SelectItem key={r} value={r}>{r.replace(/_/g, " ")}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
