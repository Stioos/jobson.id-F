"use client";

import * as React from "react";
import { PageHeader } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useNav } from "@/lib/store";
import {
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
  { id: "s1", device: "MacBook Pro", browser: "Chrome 130", location: "Bengaluru, IN", ip: "203.0.113.42", lastActive: "Active now", current: true },
  { id: "s2", device: "iPhone 15", browser: "Safari Mobile", location: "Bengaluru, IN", ip: "203.0.113.42", lastActive: "2 hours ago" },
  { id: "s3", device: "Windows PC", browser: "Edge 130", location: "Mumbai, IN", ip: "203.0.113.51", lastActive: "3 days ago" },
  { id: "s4", device: "iPad", browser: "Safari Mobile", location: "Chennai, IN", ip: "203.0.113.77", lastActive: "5 days ago" },
];

const LOGIN_HISTORY: LoginHistoryRow[] = [
  { id: "h1", timestamp: "21 Oct 2024, 08:30", ip: "203.0.113.42", location: "Bengaluru, IN", device: "Chrome · macOS", status: "success" },
  { id: "h2", timestamp: "20 Oct 2024, 19:12", ip: "203.0.113.42", location: "Bengaluru, IN", device: "Safari · iPhone", status: "success" },
  { id: "h3", timestamp: "20 Oct 2024, 09:55", ip: "198.51.100.10", location: "Unknown, US", device: "Chrome · Linux", status: "failed" },
  { id: "h4", timestamp: "19 Oct 2024, 14:20", ip: "203.0.113.51", location: "Mumbai, IN", device: "Firefox · Linux", status: "success" },
  { id: "h5", timestamp: "18 Oct 2024, 22:08", ip: "203.0.113.42", location: "Bengaluru, IN", device: "Chrome · macOS", status: "success" },
  { id: "h6", timestamp: "17 Oct 2024, 11:42", ip: "203.0.113.42", location: "Bengaluru, IN", device: "App · iOS", status: "success" },
  { id: "h7", timestamp: "16 Oct 2024, 06:30", ip: "198.51.100.25", location: "Singapore", device: "Chrome · Android", status: "failed" },
  { id: "h8", timestamp: "15 Oct 2024, 16:55", ip: "203.0.113.42", location: "Bengaluru, IN", device: "Chrome · macOS", status: "success" },
  { id: "h9", timestamp: "14 Oct 2024, 08:01", ip: "203.0.113.42", location: "Bengaluru, IN", device: "Safari · iPhone", status: "success" },
  { id: "h10", timestamp: "13 Oct 2024, 21:14", ip: "203.0.113.51", location: "Mumbai, IN", device: "Edge · Windows", status: "success" },
];

const ALERTS: SecurityAlert[] = [
  { id: "a1", severity: "high", title: "New device sign-in", description: "Sign-in from Chrome · Linux in Mumbai, IN on 19 Oct.", timestamp: "2 days ago" },
  { id: "a2", severity: "medium", title: "Failed login attempts", description: "3 failed login attempts from IP 198.51.100.25 (Singapore).", timestamp: "4 days ago" },
  { id: "a3", severity: "low", title: "Password changed", description: "Your password was updated successfully.", timestamp: "1 week ago" },
  { id: "a4", severity: "low", title: "Recovery codes generated", description: "New MFA recovery codes were generated.", timestamp: "1 week ago" },
];

export function CandidateSecurityCenter() {
  const { navigate } = useNav();
  const [mfa, setMfa] = React.useState(false);
  const [sessions, setSessions] = React.useState(SESSIONS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security center"
        description="Protect your candidate account with strong passwords, MFA, and active session control."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[
          { label: "Back to settings", variant: "outline", onClick: () => navigate("candidate", "settings-hub") },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SecurityScoreSection score={mfa ? 92 : 64} />
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

      <LoginHistorySection rows={LOGIN_HISTORY} />

      <SecurityAlertsSection alerts={ALERTS} />
    </div>
  );
}
