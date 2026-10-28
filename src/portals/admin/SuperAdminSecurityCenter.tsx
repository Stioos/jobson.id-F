"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";

const LOGIN_HISTORY = [
  { id: "lh_001", at: "2024-09-21T09:55:42Z", ip: "203.0.113.42", location: "Bengaluru, IN", device: "MacBook Air (Chrome)", method: "MFA Authenticator", status: "success" },
  { id: "lh_002", at: "2024-09-20T18:42:18Z", ip: "203.0.113.42", location: "Bengaluru, IN", device: "MacBook Air (Chrome)", method: "MFA Authenticator", status: "success" },
  { id: "lh_003", at: "2024-09-19T08:30:04Z", ip: "203.0.113.42", location: "Bengaluru, IN", device: "iPhone 14 (Safari)", method: "MFA Authenticator", status: "success" },
  { id: "lh_004", at: "2024-09-18T11:15:00Z", ip: "198.51.100.7", location: "Unknown (VPN)", device: "Unknown", method: "Password only (failed)", status: "failure" },
  { id: "lh_005", at: "2024-09-17T22:00:00Z", ip: "203.0.113.42", location: "Bengaluru, IN", device: "MacBook Air (Chrome)", method: "MFA Authenticator", status: "success" },
];

const ACTIVE_SESSIONS = [
  { id: "ses_001", device: "MacBook Air (Chrome)", ip: "203.0.113.42", location: "Bengaluru, IN", lastActive: "2024-09-21T09:55:00Z", trusted: true },
  { id: "ses_002", device: "iPhone 14 (Safari)", ip: "203.0.113.42", location: "Bengaluru, IN", lastActive: "2024-09-21T07:42:00Z", trusted: true },
];

export function SuperAdminSecurityCenter() {
  const [mfaEnabled, setMfaEnabled] = React.useState(true);
  const [newPwd, setNewPwd] = React.useState("");
  const [confirmPwd, setConfirmPwd] = React.useState("");
  const [sessions, setSessions] = React.useState(ACTIVE_SESSIONS);

  const changePwd = () => {
    if (!newPwd || !confirmPwd) { toast.error("Both fields required"); return; }
    if (newPwd !== confirmPwd) { toast.error("Passwords do not match"); return; }
    if (newPwd.length < 12) { toast.error("Password must be 12+ characters"); return; }
    toast.success("Password changed successfully");
    setNewPwd(""); setConfirmPwd("");
  };

  const revoke = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success("Session revoked");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Center"
        description="Password, MFA, active sessions, and login history for your Super Admin account."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Security Score" value="A+" icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="MFA Status" value={mfaEnabled ? "Enabled" : "Off"} icon={<Icon name="Lock" className="h-5 w-5" />} tone={mfaEnabled ? "success" : "danger"} />
        <StatCard label="Active Sessions" value={sessions.length} icon={<Icon name="Monitor" className="h-5 w-5" />} />
        <StatCard label="Failed Logins (7d)" value={1} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Change Password" description="Min 12 chars, mixed case, number, symbol">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">New password</Label>
              <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Confirm password</Label>
              <Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="mt-1" />
            </div>
            <Button className="w-full" onClick={changePwd}><Icon name="Lock" className="mr-1 h-4 w-4" /> Update Password</Button>
          </div>
        </SectionCard>

        <SectionCard title="Multi-Factor Authentication" description="Add an extra layer of security">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Authenticator app</p>
                <p className="text-xs text-muted-foreground">Google Authenticator / 1Password</p>
              </div>
              <Switch checked={mfaEnabled} onCheckedChange={(v) => { setMfaEnabled(v); toast.success(`MFA ${v ? "enabled" : "disabled"}`); }} />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Hardware key (YubiKey)</p>
                <p className="text-xs text-muted-foreground">Not configured</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("Setup wizard opened")}>Setup</Button>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Backup codes</p>
                <p className="text-xs text-muted-foreground">8 codes remaining</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("New backup codes generated")}>Regenerate</Button>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Active Sessions" description="Devices currently signed in" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Trusted</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map(s => (
              <TableRow key={s.id}>
                <TableCell className="text-xs">{s.device}</TableCell>
                <TableCell className="font-mono text-xs">{s.ip}</TableCell>
                <TableCell className="text-xs">{s.location}</TableCell>
                <TableCell className="text-xs">{timeAgo(s.lastActive)}</TableCell>
                <TableCell>
                  {s.trusted ? <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-500" /> : <Icon name="AlertTriangle" className="h-4 w-4 text-amber-500" />}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => revoke(s.id)}>Revoke</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Login History" description="Recent sign-in attempts" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LOGIN_HISTORY.map(l => (
              <TableRow key={l.id}>
                <TableCell className="text-xs">{formatDateTime(l.at)}</TableCell>
                <TableCell className="font-mono text-xs">{l.ip}</TableCell>
                <TableCell className="text-xs">{l.location}</TableCell>
                <TableCell className="text-xs">{l.device}</TableCell>
                <TableCell className="text-xs">{l.method}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={l.status === "success" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-rose-500/15 text-rose-700 border-rose-500/30"}>
                    {l.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
