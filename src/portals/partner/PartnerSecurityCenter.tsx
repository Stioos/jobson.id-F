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
  { id: "s1", device: "Office PC", browser: "Chrome 130", location: "Chennai, IN", ip: "203.0.113.10", lastActive: "Active now", current: true },
  { id: "s2", device: "Counsellor laptop", browser: "Chrome 129", location: "Chennai, IN", ip: "203.0.113.11", lastActive: "1 hour ago" },
  { id: "s3", device: "iPhone", browser: "Safari Mobile", location: "Chennai, IN", ip: "203.0.113.10", lastActive: "Yesterday" },
  { id: "s4", device: "Reception iMac", browser: "Safari 17", location: "Chennai, IN", ip: "203.0.113.12", lastActive: "4 days ago" },
];

const LOGIN_HISTORY: LoginHistoryRow[] = [
  { id: "h1", timestamp: "21 Oct 2024, 10:18", ip: "203.0.113.10", location: "Chennai, IN", device: "Chrome · Windows", status: "success" },
  { id: "h2", timestamp: "20 Oct 2024, 18:32", ip: "203.0.113.11", location: "Chennai, IN", device: "Chrome · macOS", status: "success" },
  { id: "h3", timestamp: "20 Oct 2024, 07:14", ip: "198.51.100.20", location: "Unknown, NG", device: "Chrome · Linux", status: "failed" },
  { id: "h4", timestamp: "19 Oct 2024, 13:45", ip: "203.0.113.10", location: "Chennai, IN", device: "Safari · iPhone", status: "success" },
  { id: "h5", timestamp: "18 Oct 2024, 09:20", ip: "203.0.113.10", location: "Chennai, IN", device: "Chrome · Windows", status: "success" },
  { id: "h6", timestamp: "17 Oct 2024, 16:50", ip: "203.0.113.10", location: "Chennai, IN", device: "App · iOS", status: "success" },
  { id: "h7", timestamp: "16 Oct 2024, 23:08", ip: "198.51.100.30", location: "Russia", device: "Firefox · Linux", status: "failed" },
  { id: "h8", timestamp: "15 Oct 2024, 11:30", ip: "203.0.113.12", location: "Chennai, IN", device: "Safari · macOS", status: "success" },
  { id: "h9", timestamp: "14 Oct 2024, 14:22", ip: "203.0.113.10", location: "Chennai, IN", device: "Chrome · Windows", status: "success" },
  { id: "h10", timestamp: "13 Oct 2024, 17:14", ip: "203.0.113.10", location: "Chennai, IN", device: "Chrome · Windows", status: "success" },
];

const ALERTS: SecurityAlert[] = [
  { id: "a1", severity: "high", title: "Brute-force attempts blocked", description: "8 failed login attempts from IP 198.51.100.30 (Russia) auto-blocked.", timestamp: "5 hours ago" },
  { id: "a2", severity: "medium", title: "New device sign-in", description: "Sign-in from a new iMac at reception on 17 Oct.", timestamp: "4 days ago" },
  { id: "a3", severity: "low", title: "Settlement wallet PIN changed", description: "Your settlement wallet PIN was updated.", timestamp: "1 week ago" },
  { id: "a4", severity: "low", title: "API key generated", description: "New API key 'Razorpay sync' generated.", timestamp: "1 week ago" },
];

export function PartnerSecurityCenter() {
  const { navigate } = useNav();
  const [mfa, setMfa] = React.useState(true);
  const [sessions, setSessions] = React.useState(SESSIONS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security center"
        description="Protect your partner account, student data, settlements, and revenue."
        icon={<Icon name="ShieldCheck" className="h-6 w-6" />}
        actions={[
          { label: "Back to settings", variant: "outline", onClick: () => navigate("partner", "settings-hub") },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SecurityScoreSection score={mfa ? 93 : 68} />
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
