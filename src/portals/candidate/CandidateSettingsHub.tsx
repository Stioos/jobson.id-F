"use client";

import * as React from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { useAuth, useNav } from "@/lib/store";
import {
  AccountSection,
  AppearanceSection,
  ApiSection,
  BillingSection,
  DangerZoneSection,
  IntegrationsSection,
  PrivacySection,
  QuickLinkCard,
  ToggleRow,
} from "@/portals/_settings-support-shared";

const PRIVACY_INITIAL = [
  { key: "profile_public", label: "Public profile", description: "Allow employers to find your profile in talent search.", enabled: true },
  { key: "search_indexing", label: "Search engine indexing", description: "Allow Google and others to index your public profile.", enabled: false },
  { key: "data_sharing", label: "Data sharing with partners", description: "Share anonymized data with trusted hiring partners.", enabled: true },
  { key: "analytics", label: "Usage analytics", description: "Help improve jobson.id with anonymous usage data.", enabled: true },
];

const INTEGRATIONS = [
  { name: "LinkedIn", icon: "Users", connected: true, description: "Import profile and sync endorsements." },
  { name: "GitHub", icon: "FolderGit2", connected: true, description: "Showcase repositories and contributions." },
  { name: "Stack Overflow", icon: "MessageSquare", connected: false, description: "Display your developer reputation." },
  { name: "Behance", icon: "Presentation", connected: false, description: "Sync your design portfolio." },
];

export function CandidateSettingsHub() {
  const { user } = useAuth();
  const { navigate } = useNav();
  const [quickJobAlerts, setQuickJobAlerts] = React.useState(true);
  const [quickAppUpdates, setQuickAppUpdates] = React.useState(true);
  const [quickMfa, setQuickMfa] = React.useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your candidate account, privacy, security, and integrations."
        icon={<Icon name="Settings" className="h-6 w-6" />}
      />

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLinkCard
          icon="ShieldCheck"
          title="Security center"
          description="Password, MFA, active sessions, and login history."
          ctaLabel="Open"
          onClick={() => navigate("candidate", "security-center")}
        />
        <QuickLinkCard
          icon="Bell"
          title="Notification preferences"
          description="Granular control over email, SMS, push, and in-app alerts."
          ctaLabel="Open"
          onClick={() => navigate("candidate", "notification-preferences")}
        />
        <QuickLinkCard
          icon="Wallet"
          title="Billing & wallet"
          description="Plan, payment methods, invoices, and transactions."
          ctaLabel="Open"
          onClick={() => navigate("candidate", "my-wallet")}
        />
      </div>

      {/* Quick toggles */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ToggleRow
          icon="Bell"
          title="Job alerts"
          description="Daily matches based on your saved searches."
          checked={quickJobAlerts}
          onToggle={setQuickJobAlerts}
        />
        <ToggleRow
          icon="Inbox"
          title="Application updates"
          description="Status changes on your active applications."
          checked={quickAppUpdates}
          onToggle={setQuickAppUpdates}
        />
        <ToggleRow
          icon="KeyRound"
          title="Two-factor auth"
          description="Add a second layer of protection to your account."
          checked={quickMfa}
          onToggle={(v) => {
            setQuickMfa(v);
            if (v) toast.info("Continue setup in Security Center", { description: "We'll guide you through the steps." });
          }}
        />
      </div>

      <AccountSection
        defaults={{
          name: user?.name ?? "Priya Nair",
          email: user?.email ?? "priya.nair@gmail.com",
          phone: "+91 99887 76655",
          bio: "Full-stack developer with 4+ years of experience in React, Node.js, and AWS. Looking for senior engineering roles in Bengaluru.",
        }}
      />

      <AppearanceSection />

      <PrivacySection initial={PRIVACY_INITIAL} />

      <BillingSection
        plan={{ name: "Candidate Pro", price: "₹499 / month", renewOn: "15 Nov 2024", status: "active" }}
      />

      <IntegrationsSection integrations={INTEGRATIONS} />

      <DangerZoneSection portalLabel="Candidate" />
    </div>
  );
}
