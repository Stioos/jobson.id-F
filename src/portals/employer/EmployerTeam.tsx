"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";
import { Plus, Shield } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  seats: number;
  lastActive: string;
  status: "active" | "invited" | "suspended";
}

const MEMBERS: Member[] = [
  { id: "m1", name: "Rohan Mehta", email: "rohan@techcorp.com", role: "Org Admin", seats: 1, lastActive: "2024-10-20T07:45:00Z", status: "active" },
  { id: "m2", name: "Anika Verma", email: "anika@techcorp.com", role: "Hiring Manager", seats: 1, lastActive: "2024-10-20T06:00:00Z", status: "active" },
  { id: "m3", name: "Sneha Reddy", email: "sneha@talentbridge.in", role: "Recruiter", seats: 1, lastActive: "2024-10-18T11:00:00Z", status: "active" },
  { id: "m4", name: "Vikram Rao", email: "vikram.r@techcorp.com", role: "Hiring Manager", seats: 1, lastActive: "2024-10-19T14:00:00Z", status: "active" },
  { id: "m5", name: "Neha Kapoor", email: "neha@techcorp.com", role: "Recruiter", seats: 1, lastActive: "2024-10-19T13:15:00Z", status: "active" },
  { id: "m6", name: "Arjun Patel", email: "arjun@techcorp.com", role: "Interviewer", seats: 1, lastActive: "2024-10-15T10:00:00Z", status: "invited" },
];

const ROLES = ["Org Admin", "Hiring Manager", "Recruiter", "Interviewer", "Billing Manager", "Viewer"];

const PERMISSION_MATRIX = [
  { feature: "Create/edit jobs", admin: true, hiring: true, recruiter: true, interviewer: false, viewer: false },
  { feature: "View applicants", admin: true, hiring: true, recruiter: true, interviewer: true, viewer: true },
  { feature: "Move candidates in pipeline", admin: true, hiring: true, recruiter: true, interviewer: false, viewer: false },
  { feature: "Schedule interviews", admin: true, hiring: true, recruiter: true, interviewer: false, viewer: false },
  { feature: "Submit scorecards", admin: true, hiring: false, recruiter: false, interviewer: true, viewer: false },
  { feature: "Create offers", admin: true, hiring: true, recruiter: false, interviewer: false, viewer: false },
  { feature: "Manage billing", admin: true, hiring: false, recruiter: false, interviewer: false, viewer: false },
  { feature: "Manage team", admin: true, hiring: false, recruiter: false, interviewer: false, viewer: false },
];

export function EmployerTeam() {
  const [members, setMembers] = React.useState<Member[]>(MEMBERS);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [invite, setInvite] = React.useState({ name: "", email: "", role: "Recruiter" });

  const inviteMember = () => {
    if (!invite.name || !invite.email) { toast.error("Name and email are required"); return; }
    const m: Member = {
      id: `m_${Date.now()}`,
      name: invite.name,
      email: invite.email,
      role: invite.role,
      seats: 1,
      lastActive: new Date().toISOString(),
      status: "invited",
    };
    setMembers([...members, m]);
    setInvite({ name: "", email: "", role: "Recruiter" });
    setInviteOpen(false);
    toast.success(`Invitation sent to ${m.email}`);
  };

  const changeRole = (id: string, role: string) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, role } : m));
    toast.success("Role updated");
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.info("Member removed");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment Team"
        description="Manage seats, roles, and permissions for your hiring team"
        actions={[{ label: "Invite member", icon: "Plus", onClick: () => setInviteOpen(true) }]}
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatBlock label="Total seats" value={members.length} sub="200 plan seats" />
        <StatBlock label="Active" value={members.filter((m) => m.status === "active").length} tone="success" />
        <StatBlock label="Invited" value={members.filter((m) => m.status === "invited").length} tone="warning" />
        <StatBlock label="Available seats" value={200 - members.length} tone="brand" />
      </div>

      <SectionCard title="Team members">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id} className="hover:bg-muted/40">
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
                    <Select value={m.role} onValueChange={(v) => changeRole(m.id, v)}>
                      <SelectTrigger className="h-7 w-40 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(m.lastActive)}</TableCell>
                  <TableCell><StatusBadge status={m.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => removeMember(m.id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Permissions matrix" description="What each role can do" action={<Badge variant="outline"><Shield className="mr-1 h-3 w-3" /> Role-based access</Badge>}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Capability</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Hiring Mgr</TableHead>
                <TableHead className="text-center">Recruiter</TableHead>
                <TableHead className="text-center">Interviewer</TableHead>
                <TableHead className="text-center">Viewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSION_MATRIX.map((p) => (
                <TableRow key={p.feature}>
                  <TableCell className="text-sm">{p.feature}</TableCell>
                  <PermCell on={p.admin} />
                  <PermCell on={p.hiring} />
                  <PermCell on={p.recruiter} />
                  <PermCell on={p.interviewer} />
                  <PermCell on={p.viewer} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
            <DialogDescription>They'll receive an email invitation to join your organization.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Full name *</Label>
              <Input value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={invite.role} onValueChange={(v) => setInvite({ ...invite, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Label className="flex items-center gap-2 cursor-pointer">
              <Switch defaultChecked /> Send welcome email with onboarding guide
            </Label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={inviteMember}><Plus className="mr-2 h-4 w-4" /> Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

function StatBlock({ label, value, sub, tone = "default" }: { label: string; value: number | string; sub?: string; tone?: "default" | "success" | "warning" | "brand" }) {
  const tones = {
    default: "text-muted-foreground",
    success: "text-emerald-600",
    warning: "text-amber-600",
    brand: "text-brand",
  };
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-semibold mt-1 ${tones[tone]}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function PermCell({ on }: { on: boolean }) {
  return (
    <TableCell className="text-center">
      {on ? <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">✓</span> : <span className="text-muted-foreground/40">—</span>}
    </TableCell>
  );
}
