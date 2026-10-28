"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";

const USERS = [
  { id: "u_002", name: "Rohan Mehta", role: "employer", portal: "employer", email: "rohan@techcorp.com" },
  { id: "u_003", name: "Sneha Reddy", role: "agency", portal: "recruiter", email: "sneha@talentbridge.in" },
  { id: "u_005", name: "Anika Verma", role: "hiring_manager", portal: "employer", email: "anika@techcorp.com" },
  { id: "u_007", name: "Meera Joshi", role: "partner", portal: "partner", email: "meera@southzone.in" },
  { id: "u_001", name: "Priya Nair", role: "candidate", portal: "candidate", email: "priya.nair@gmail.com" },
];

const ACTIVE = [
  { id: "imp_001", admin: "Aarav Sharma", target: "Rohan Mehta", started: "2024-09-21T09:42:00Z", expires: "2024-09-21T10:12:00Z", reason: "Debug billing issue" },
];

const HISTORY = [
  { id: "imp_h_01", admin: "Aarav Sharma", target: "Sneha Reddy", date: "2024-09-20T15:20:00Z", duration: "28m", reason: "Payout dispute resolution" },
  { id: "imp_h_02", admin: "Aarav Sharma", target: "Anika Verma", date: "2024-09-19T11:00:00Z", duration: "12m", reason: "Verify HM access" },
  { id: "imp_h_03", admin: "Platform Ops", target: "Meera Joshi", date: "2024-09-18T14:30:00Z", duration: "45m", reason: "Onboarding walkthrough" },
  { id: "imp_h_04", admin: "Aarav Sharma", target: "Priya Nair", date: "2024-09-17T10:15:00Z", duration: "8m", reason: "Profile bug repro" },
];

export function SuperAdminImpersonation() {
  const [targetId, setTargetId] = React.useState("");
  const [duration, setDuration] = React.useState("30");
  const [reason, setReason] = React.useState("");

  const startImpersonation = () => {
    if (!targetId || !reason) { toast.error("Select a user and provide a reason"); return; }
    const u = USERS.find(u => u.id === targetId);
    toast.success(`Now impersonating ${u?.name} for ${duration} minutes`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Impersonation"
        description="Time-boxed, audited impersonation of any platform user for support, debugging, and verification."
        icon={<Icon name="UserCog" className="h-6 w-6" />}
        actions={[{ label: "Audit Trail", variant: "outline", onClick: () => toast.info("Opening audit logs") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Sessions" value={ACTIVE.length} icon={<Icon name="UserCog" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Today" value={3} icon={<Icon name="Activity" className="h-5 w-5" />} />
        <StatCard label="This Week" value={12} icon={<Icon name="Calendar" className="h-5 w-5" />} />
        <StatCard label="Avg Duration" value="22m" icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Start Impersonation" description="Time-boxed user impersonation" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Target user</Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="Select user…" /></SelectTrigger>
                <SelectContent>
                  {USERS.map(u => <SelectItem key={u.id} value={u.id}>{u.name} ({u.portal})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Duration (minutes, max 60)</Label>
              <Input type="number" min={5} max={60} value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Reason (audited)</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Debugging billing issue" className="mt-1" />
            </div>
            <Button className="w-full" onClick={startImpersonation}>
              <Icon name="UserCog" className="mr-1 h-4 w-4" /> Start Impersonation
            </Button>
            <p className="text-[10px] text-muted-foreground">All impersonations are logged with admin identity, target, duration, and reason.</p>
          </div>
        </SectionCard>

        <SectionCard title="Active Impersonations" description="Currently in progress" className="lg:col-span-2" contentClassName="p-0">
          {ACTIVE.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No active impersonations</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ACTIVE.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.admin}</TableCell>
                    <TableCell><Badge variant="outline">{a.target}</Badge></TableCell>
                    <TableCell className="text-xs">{timeAgo(a.started)}</TableCell>
                    <TableCell className="text-xs">{formatDateTime(a.expires)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.reason}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => toast.success("Impersonation ended")}>End</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Impersonation History" description="Audited trail" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {HISTORY.map(h => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">{h.admin}</TableCell>
                <TableCell><Badge variant="outline">{h.target}</Badge></TableCell>
                <TableCell className="text-xs">{formatDateTime(h.date)}</TableCell>
                <TableCell>{h.duration}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{h.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
