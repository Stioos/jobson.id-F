"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

interface Session {
  id: string; user: string; portal: string; device: string; browser: string; ip: string; location: string; lastActive: string; trusted: boolean;
}

const SESSIONS: Session[] = [
  { id: "ses_001", user: "Priya Nair", portal: "candidate", device: "iPhone 14", browser: "Safari", ip: "203.0.113.42", location: "Bengaluru, IN", lastActive: "2024-09-21T09:30:00Z", trusted: true },
  { id: "ses_002", user: "Rohan Mehta", portal: "employer", device: "MacBook Pro", browser: "Chrome", ip: "203.0.113.50", location: "Mumbai, IN", lastActive: "2024-09-21T09:42:00Z", trusted: true },
  { id: "ses_003", user: "Sneha Reddy", portal: "recruiter", device: "Windows PC", browser: "Firefox", ip: "203.0.113.88", location: "Hyderabad, IN", lastActive: "2024-09-20T17:15:00Z", trusted: false },
  { id: "ses_004", user: "Aarav Sharma", portal: "admin", device: "MacBook Air", browser: "Chrome", ip: "203.0.113.42", location: "Bengaluru, IN", lastActive: "2024-09-21T09:55:00Z", trusted: true },
  { id: "ses_005", user: "Anika Verma", portal: "employer", device: "Pixel 7", browser: "Chrome", ip: "203.0.113.60", location: "Pune, IN", lastActive: "2024-09-21T07:20:00Z", trusted: true },
  { id: "ses_006", user: "Meera Joshi", portal: "partner", device: "Unknown Device", browser: "Edge", ip: "198.51.100.180", location: "Unknown (VPN)", lastActive: "2024-09-21T03:48:00Z", trusted: false },
  { id: "ses_007", user: "Vikram Singh", portal: "employer", device: "iPad", browser: "Safari", ip: "203.0.113.110", location: "Delhi, IN", lastActive: "2024-09-17T22:00:00Z", trusted: false },
  { id: "ses_008", user: "Karthik Iyer", portal: "training", device: "Linux PC", browser: "Chrome", ip: "203.0.113.220", location: "Chennai, IN", lastActive: "2024-09-19T11:30:00Z", trusted: true },
];

export function SuperAdminSessions() {
  const [sessions, setSessions] = React.useState(SESSIONS);

  const forceLogout = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success(`Session ${id} force-logged-out`);
  };

  const revokeAll = () => {
    setSessions([]);
    toast.warning("All sessions revoked platform-wide");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessions"
        description="Active user sessions across all portals — device, IP, location, with force logout."
        icon={<Icon name="Monitor" className="h-6 w-6" />}
        actions={[{ label: "Revoke All", variant: "destructive", onClick: revokeAll }]
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Sessions" value={sessions.length} icon={<Icon name="Monitor" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Trusted Devices" value={sessions.filter(s => s.trusted).length} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Untrusted" value={sessions.filter(s => !s.trusted).length} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="warning" />
        <StatCard label="VPN/Suspicious" value={sessions.filter(s => s.location.includes("VPN") || s.location === "Unknown (VPN)").length} icon={<Icon name="AlertCircle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Active Sessions" description={`${sessions.length} live sessions`} contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>IP / Location</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Trusted</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map(s => (
              <TableRow key={s.id} className={s.location.includes("VPN") ? "bg-amber-50/40 dark:bg-amber-900/10" : ""}>
                <TableCell className="font-medium">{s.user}</TableCell>
                <TableCell><Badge variant="outline">{s.portal}</Badge></TableCell>
                <TableCell className="text-xs">{s.device}</TableCell>
                <TableCell className="text-xs">{s.browser}</TableCell>
                <TableCell>
                  <div className="font-mono text-[10px]">{s.ip}</div>
                  <div className="text-xs text-muted-foreground">{s.location}</div>
                </TableCell>
                <TableCell className="text-xs">{timeAgo(s.lastActive)}</TableCell>
                <TableCell>
                  {s.trusted ? <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-500" /> : <Icon name="AlertTriangle" className="h-4 w-4 text-amber-500" />}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => forceLogout(s.id)}>Logout</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
