"use client";

import * as React from "react";
import { PageHeader } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useNav } from "@/lib/store";
import {
  IpAllowlistSection,
  LoginHistorySection,
  MfaSection,
  PasswordSection,
  SecurityAlertsSection,
  SecurityScoreSection,
  SessionsSection,
  type LoginHistoryRow,
  type SecurityAlert,
  type SessionRow,
} from "@/portals/_settings-support-shared";

const SESSIONS: SessionRow[] = [
  { id: "s1", device: "MacBook Air", browser: "Chrome 130", location: "Hyderabad, IN", ip: "203.0.113.42", lastActive: "Active now", current: true },
  { id: "s2", device: "iPhone 13", browser: "Safari Mobile", location: "Hyderabad, IN", ip: "203.0.113.42", lastActive: "4 hours ago" },
  { id: "s3", device: "Recruiter PC", browser: "Chrome 129", location: "Bengaluru, IN", ip: "203.0.113.51", lastActive: "Yesterday" },
  { id: "s4", device: "iPad", browser: "Safari Mobile", location: "Vizag, IN", ip: "203.0.113.77", lastActive: "4 days ago" },
];

const LOGIN_HISTORY: LoginHistoryRow[] = [
  { id: "h1", timestamp: "21 Oct 2024, 10:18", ip: "203.0.113.42", location: "Hyderabad, IN", device: "Chrome · macOS", status: "success" },
  { id: "h2", timestamp: "20 Oct 2024, 21:45", ip: "203.0.113.42", location: "Hyderabad, IN", device: "Safari · iPhone", status: "success" },
  { id: "h3", timestamp: "20 Oct 2024, 08:30", ip: "198.51.100.50", location: "Unknown, NG", device: "Chrome · Android", status: "failed" },
  { id: "h4", timestamp: "19 Oct 2024, 13:22", ip: "203.0.113.51", location: "Bengaluru, IN", device: "Chrome · Windows", status: "success" },
  { id: "h5", timestamp: "18 Oct 2024, 16:08", ip: "203.0.113.42", location: "Hyderabad, IN", device: "Chrome · macOS", status: "success" },
  { id: "h6", timestamp: "17 Oct 2024, 09:50", ip: "203.0.113.42", location: "Hyderabad, IN", device: "App · iOS", status: "success" },
  { id: "h7", timestamp: "16 Oct 2024, 23:14", ip: "198.51.100.61", location: "Russia", device: "Firefox · Linux", status: "failed" },
  { id: "h8", timestamp: "15 Oct 2024, 11:30", ip: "203.0.113.42", location: "Hyderabad, IN", device: "Chrome · macOS", status: "success" },
];

const ALERTS: SecurityAlert[] = [
  { id: "a1", severity: "high", title: "New device sign-in", description: "Sign-in from a new iPad in Vizag, IN on 17 Oct.", timestamp: "4 days ago" },
  { id: "a2", severity: "medium", title: "Failed login attempts", description: "5 failed login attempts blocked from IP 198.51.100.50.", timestamp: "1 day ago" },
  { id: "a3", severity: "low", title: "Password updated", description: "Your password was changed successfully.", timestamp: "5 days ago" },
  { id: "a4", severity: "low", title: "API key created", description: "New API key 'Bullhorn sync' generated.", timestamp: "1 week ago" },
];

export function RecruiterSecurityCenter() {
  const { navigate } = useNav();
  const [mfa, setMfa] = React.useState(true);
  const [sessions, setSessions] = React.useState(SESSIONS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security center"
        description="Protect your recruiter account, candidate data, and commission records."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[
          { label: "Back to settings", variant: "outline", onClick: () => navigate("recruiter", "settings-hub") },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SecurityScoreSection score={mfa ? 94 : 70} />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <PasswordSection />
          <MfaSection enabled={mfa} onToggle={setMfa} />
        </div>
      </div>

      <SessionsSection
        sessions={sessions}
        onRevoke={(id) => setSessions((p) => p.filter((s) => s.id !== id))}
      />

      <IpAllowlistSection />

      <LoginHistorySection rows={LOGIN_HISTORY} />

      <SecurityAlertsSection alerts={ALERTS} />
    </div>
  );
}
