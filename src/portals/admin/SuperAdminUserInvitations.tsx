"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Invitation {
  id: string; email: string; invitedBy: string; role: string; group: string; portal: string;
  sent: string; expiry: string; status: "pending" | "accepted" | "expired" | "revoked";
}

const INVITES: Invitation[] = [
  { id: "i_001", email: "new.admin@jobson.id", invitedBy: "Aarav Sharma", role: "Admin", group: "Operations", portal: "admin", sent: "2024-09-20", expiry: "2024-10-04", status: "pending" },
  { id: "i_002", email: "hr@acme.com", invitedBy: "Neha Kapoor", role: "HR Manager", group: "Employer", portal: "employer", sent: "2024-09-18", expiry: "2024-09-25", status: "accepted" },
  { id: "i_003", email: "recruit@hirepro.in", invitedBy: "Sneha Reddy", role: "Recruiter", group: "Recruiter", portal: "recruiter", sent: "2024-09-10", expiry: "2024-09-24", status: "pending" },
  { id: "i_004", email: "ops@edutech.in", invitedBy: "Neha Kapoor", role: "Training Provider", group: "Training", portal: "training", sent: "2024-08-25", expiry: "2024-09-08", status: "expired" },
  { id: "i_005", email: "temp@temp.com", invitedBy: "Aarav Sharma", role: "Analyst", group: "Operations", portal: "admin", sent: "2024-09-05", expiry: "2024-09-19", status: "revoked" },
  { id: "i_006", email: "partner@southzone.in", invitedBy: "Pooja Desai", role: "Partner", group: "Partner Network", portal: "partner", sent: "2024-09-19", expiry: "2024-10-03", status: "pending" },
  { id: "i_007", email: "karan.m@jobson.id", invitedBy: "Neha Kapoor", role: "Manager", group: "Operations", portal: "admin", sent: "2024-09-15", expiry: "2024-09-29", status: "accepted" },
];

export function SuperAdminUserInvitations() {
  const [tab, setTab] = React.useState<"single" | "bulk">("single");
  const [open, setOpen] = React.useState(false);
  const [emails, setEmails] = React.useState("");
  const [role, setRole] = React.useState("admin");
  const [group, setGroup] = React.useState("operations");
  const [portal, setPortal] = React.useState("admin");
  const [expiry, setExpiry] = React.useState("14");
  const [search, setSearch] = React.useState("");

  const filtered = INVITES.filter(i => !search || i.email.toLowerCase().includes(search.toLowerCase()) || i.invitedBy.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    pending: INVITES.filter(i => i.status === "pending").length,
    accepted: INVITES.filter(i => i.status === "accepted").length,
    expired: INVITES.filter(i => i.status === "expired").length,
    revoked: INVITES.filter(i => i.status === "revoked").length,
  };
  const acceptanceRate = ((stats.accepted / INVITES.length) * 100).toFixed(0);

  const sendInvite = () => {
    if (tab === "bulk") {
      const list = emails.split(/[\n,]/).map(e => e.trim()).filter(Boolean);
      toast.success(`${list.length} invitations queued`);
    } else {
      toast.success(`Invitation sent to ${emails || "recipient"}`);
    }
    setOpen(false);
    setEmails("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invitation Management"
        description="Send, track and revoke user invitations across all portals."
        icon={<Icon name="Mail" className="h-6 w-6" />}
        actions={[{ label: "Send Invitation", onClick: () => setOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Pending" value={stats.pending} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Accepted" value={stats.accepted} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Expired" value={stats.expired} icon={<Icon name="MailX" className="h-5 w-5" />} />
        <StatCard label="Revoked" value={stats.revoked} icon={<Icon name="RotateCcw" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Invitation Analytics" description="Acceptance metrics">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="rounded-md border bg-card p-3">
            <div className="text-xs text-muted-foreground">Acceptance Rate</div>
            <div className="text-2xl font-semibold text-emerald-700">{acceptanceRate}%</div>
          </div>
          <div className="rounded-md border bg-card p-3">
            <div className="text-xs text-muted-foreground">Avg Time-to-Accept</div>
            <div className="text-2xl font-semibold">2.3 days</div>
          </div>
          <div className="rounded-md border bg-card p-3">
            <div className="text-xs text-muted-foreground">Total Sent</div>
            <div className="text-2xl font-semibold">{INVITES.length}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Invitations" description={`${filtered.length} of ${INVITES.length} invitations`}>
        <div className="mb-3">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email or inviter…" className="h-9 max-w-xs" />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<Icon name="Mail" className="h-5 w-5" />} title="No invitations found" description="Try a different search." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Role / Group</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.email}</TableCell>
                    <TableCell className="text-xs">{i.invitedBy}</TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">{i.role}</div>
                      <div className="text-xs text-muted-foreground">{i.group}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{i.portal}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{i.sent}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{i.expiry}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        i.status === "accepted" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                        : i.status === "pending" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                        : i.status === "expired" ? "bg-slate-500/15 text-slate-500 border-slate-500/30"
                        : "bg-rose-500/15 text-rose-700 border-rose-500/30"
                      }>{i.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {i.status === "pending" && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => toast.success(`Resent to ${i.email}`)}><Icon name="RefreshCw" className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => toast.error(`Revoked invite to ${i.email}`)}><Icon name="X" className="h-4 w-4 text-rose-500" /></Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Invitation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button size="sm" variant={tab === "single" ? "default" : "outline"} onClick={() => setTab("single")}>Single</Button>
              <Button size="sm" variant={tab === "bulk" ? "default" : "outline"} onClick={() => setTab("bulk")}>Bulk (paste emails)</Button>
            </div>
            <div className="space-y-1.5">
              <Label>{tab === "single" ? "Email Address" : "Emails (comma or newline separated)"}</Label>
              {tab === "single" ? (
                <Input type="email" value={emails} onChange={e => setEmails(e.target.value)} placeholder="user@example.com" />
              ) : (
                <Textarea rows={4} value={emails} onChange={e => setEmails(e.target.value)} placeholder={"alice@example.com\nbob@example.com"} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="billing">Billing Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Group</Label>
                <Select value={group} onValueChange={setGroup}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Portal</Label>
                <Select value={portal} onValueChange={setPortal}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Expiry</Label>
                <Select value={expiry} onValueChange={setExpiry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Custom Message</Label>
              <Textarea rows={2} placeholder="Optional welcome note…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={sendInvite}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
