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
  { id: "s1", device: "MacBook Pro", browser: "Chrome 130", location: "Bengaluru, IN", ip: "203.0.113.42", lastActive: "Active now", current: true },
  { id: "s2", device: "Windows PC", browser: "Edge 130", location: "Mumbai, IN", ip: "203.0.113.51", lastActive: "1 hour ago" },
  { id: "s3", device: "Recruiter laptop", browser: "Chrome 129", location: "Pune, IN", ip: "203.0.113.88", lastActive: "Yesterday" },
  { id: "s4", device: "iPhone 14", browser: "Safari Mobile", location: "Bengaluru, IN", ip: "203.0.113.42", lastActive: "3 days ago" },
];

const LOGIN_HISTORY: LoginHistoryRow[] = [
  { id: "h1", timestamp: "21 Oct 2024, 09:14", ip: "203.0.113.42", location: "Bengaluru, IN", device: "Chrome · macOS", status: "success" },
  { id: "h2", timestamp: "20 Oct 2024, 18:30", ip: "203.0.113.51", location: "Mumbai, IN", device: "Edge · Windows", status: "success" },
  { id: "h3", timestamp: "20 Oct 2024, 11:02", ip: "198.51.100.30", location: "Unknown, US", device: "Chrome · Linux", status: "failed" },
  { id: "h4", timestamp: "19 Oct 2024, 16:45", ip: "203.0.113.88", location: "Pune, IN", device: "Chrome · Linux", status: "success" },
  { id: "h5", timestamp: "18 Oct 2024, 08:55", ip: "203.0.113.42", location: "Bengaluru, IN", device: "Chrome · macOS", status: "success" },
  { id: "h6", timestamp: "17 Oct 2024, 14:18", ip: "203.0.113.42", location: "Bengaluru, IN", device: "Safari · iPhone", status: "success" },
  { id: "h7", timestamp: "16 Oct 2024, 22:09", ip: "198.51.100.40", location: "Russia", device: "Firefox · Linux", status: "failed" },
  { id: "h8", timestamp: "15 Oct 2024, 10:30", ip: "203.0.113.42", location: "Bengaluru, IN", device: "Chrome · macOS", status: "success" },
];

const ALERTS: SecurityAlert[] = [
  { id: "a1", severity: "high", title: "Brute-force attempts blocked", description: "12 failed login attempts from IP 198.51.100.40 (Russia) auto-blocked.", timestamp: "5 hours ago" },
  { id: "a2", severity: "medium", title: "New admin sign-in", description: "Anika Verma signed in from a new device (Chrome · Linux, Pune).", timestamp: "1 day ago" },
  { id: "a3", severity: "low", title: "API key generated", description: "New production API key created by rohan.mehta@techcorp.com.", timestamp: "2 days ago" },
  { id: "a4", severity: "low", title: "SSO configuration updated", description: "SAML SSO endpoint updated by an admin.", timestamp: "1 week ago" },
];

export function EmployerSecurityCenter() {
  const { navigate } = useNav();
  const [mfa, setMfa] = React.useState(true);
  const [sessions, setSessions] = React.useState(SESSIONS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security center"
        description="Enterprise-grade protection for your employer account, hiring data, and team access."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[
          { label: "Back to settings", variant: "outline", onClick: () => navigate("employer", "settings-hub") },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SecurityScoreSection score={mfa ? 96 : 72} />
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
