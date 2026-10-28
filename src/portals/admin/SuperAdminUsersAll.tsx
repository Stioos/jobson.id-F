"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface UserRow {
  id: string; name: string; email: string; portal: string; role: string; status: string; lastActive: string; mfa: boolean;
}

const USERS: UserRow[] = [
  { id: "u_001", name: "Priya Nair", email: "priya.nair@gmail.com", portal: "candidate", role: "candidate", status: "active", lastActive: "2024-09-21T09:30:00Z", mfa: true },
  { id: "u_002", name: "Rohan Mehta", email: "rohan@techcorp.com", portal: "employer", role: "enterprise_admin", status: "active", lastActive: "2024-09-21T08:42:00Z", mfa: true },
  { id: "u_003", name: "Sneha Reddy", email: "sneha@talentbridge.in", portal: "recruiter", role: "agency", status: "active", lastActive: "2024-09-20T17:15:00Z", mfa: false },
  { id: "u_004", name: "Aarav Sharma", email: "aarav@jobsonn.com", portal: "admin", role: "platform_admin", status: "active", lastActive: "2024-09-21T09:55:00Z", mfa: true },
  { id: "u_005", name: "Anika Verma", email: "anika@techcorp.com", portal: "employer", role: "hiring_manager", status: "active", lastActive: "2024-09-21T07:20:00Z", mfa: true },
  { id: "u_006", name: "Karthik Iyer", email: "karthik@apexskills.in", portal: "training", role: "training_provider", status: "active", lastActive: "2024-09-19T11:30:00Z", mfa: false },
  { id: "u_007", name: "Meera Joshi", email: "meera@southzone.in", portal: "partner", role: "partner", status: "trialing", lastActive: "2024-09-18T15:08:00Z", mfa: false },
  { id: "u_008", name: "Vikram Singh", email: "vikram@naukrix.com", portal: "employer", role: "billing_manager", status: "past_due", lastActive: "2024-09-17T22:00:00Z", mfa: true },
  { id: "u_009", name: "Nisha Patel", email: "nisha.p@gmail.com", portal: "candidate", role: "candidate", status: "active", lastActive: "2024-09-21T09:12:00Z", mfa: true },
  { id: "u_010", name: "Arjun Rao", email: "arjun@edufirst.in", portal: "partner", role: "partner", status: "active", lastActive: "2024-09-21T06:48:00Z", mfa: false },
];

export function SuperAdminUsersAll() {
  const [search, setSearch] = React.useState("");
  const [portal, setPortal] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [mfaOnly, setMfaOnly] = React.useState(false);

  const filtered = USERS.filter(u => {
    const s = search.toLowerCase();
    const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    const matchPortal = portal === "all" || u.portal === portal;
    const matchStatus = status === "all" || u.status === status;
    const matchMfa = !mfaOnly || u.mfa;
    return matchSearch && matchPortal && matchStatus && matchMfa;
  });

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "trialing" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : s === "past_due" ? "bg-rose-500/15 text-rose-700 border-rose-500/30"
      : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s.replace("_", " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Users"
        description="Cross-portal user directory with role, status, MFA, and last-active signals."
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[{ label: "Export CSV", variant: "outline", onClick: () => toast.success("Export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Users" value={USERS.length} icon={<Icon name="Users" className="h-5 w-5" />} tone="brand" />
        <StatCard label="With MFA" value={USERS.filter(u => u.mfa).length} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Without MFA" value={USERS.filter(u => !u.mfa).length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Past Due" value={USERS.filter(u => u.status === "past_due").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="User Directory" description={`${filtered.length} of ${USERS.length} users`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email…" className="h-9 max-w-xs" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={portal} onValueChange={setPortal}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Portal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Portals</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trialing">Trialing</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
              </SelectContent>
            </Select>
            <label className="flex items-center gap-1.5 text-xs">
              <Switch checked={mfaOnly} onCheckedChange={setMfaOnly} /> MFA only
            </label>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>MFA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{u.portal}</Badge></TableCell>
                  <TableCell className="text-xs">{u.role.replace(/_/g, " ")}</TableCell>
                  <TableCell>{statusBadge(u.status)}</TableCell>
                  <TableCell className="text-xs">{timeAgo(u.lastActive)}</TableCell>
                  <TableCell>
                    {u.mfa ? <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-500" /> : <Icon name="AlertTriangle" className="h-4 w-4 text-amber-500" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info("Bulk action menu")}>
          Bulk Actions
        </Button>
      </SectionCard>
    </div>
  );
}
