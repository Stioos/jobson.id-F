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
  IpAllowlistSection,
  PrivacySection,
  QuickLinkCard,
  ToggleRow,
} from "@/portals/_settings-support-shared";

const PRIVACY_INITIAL = [
  { key: "agency_public", label: "Public agency profile", description: "Showcase your agency to potential clients on JOBSONN.", enabled: true },
  { key: "candidate_visibility", label: "Candidate visibility", description: "Allow clients to view candidate profiles you submit.", enabled: true },
  { key: "commission_transparency", label: "Commission transparency", description: "Share commission splits with sub-vendors and partners.", enabled: false },
  { key: "analytics", label: "Usage analytics", description: "Help improve JOBSONN with anonymous usage data.", enabled: true },
];

const INTEGRATIONS = [
  { name: "Naukri Resdex", icon: "Database", connected: true, description: "Source candidates from Naukri's resume database." },
  { name: "LinkedIn Recruiter", icon: "Users", connected: true, description: "InMail credits and profile sync." },
  { name: "Bullhorn (ATS)", icon: "Database", connected: true, description: "Sync candidates, submissions, and placements." },
  { name: "Indeed", icon: "Search", connected: false, description: "Cross-post jobs and source from Indeed." },
  { name: "Shine", icon: "Search", connected: false, description: "Source candidates from Shine's database." },
  { name: "Calendly", icon: "Calendar", connected: false, description: "Schedule interviews with candidates." },
];

export function RecruiterSettingsHub() {
  const { user } = useAuth();
  const { navigate } = useNav();
  const [quickSubmissions, setQuickSubmissions] = React.useState(true);
  const [quickPlacements, setQuickPlacements] = React.useState(true);
  const [quickMfa, setQuickMfa] = React.useState(true);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your agency profile, commission setup, security, and integrations."
        icon={<Icon name="Settings" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLinkCard
          icon="ShieldCheck"
          title="Security center"
          description="MFA, sessions, IP allowlist, and login history."
          ctaLabel="Open"
          onClick={() => navigate("recruiter", "security-center")}
        />
        <QuickLinkCard
          icon="Bell"
          title="Notification preferences"
          description="Tune alerts for submissions, placements, and commissions."
          ctaLabel="Open"
          onClick={() => navigate("recruiter", "notification-preferences")}
        />
        <QuickLinkCard
          icon="Users"
          title="Recruiter team"
          description="Manage recruiters and split desks."
          ctaLabel="Open"
          onClick={() => navigate("recruiter", "recruiters")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ToggleRow icon="Send" title="Submission alerts" description="Notify when candidates are submitted to clients." checked={quickSubmissions} onToggle={setQuickSubmissions} />
        <ToggleRow icon="Handshake" title="Placement alerts" description="Celebrate every placement with a notification." checked={quickPlacements} onToggle={setQuickPlacements} />
        <ToggleRow icon="KeyRound" title="Two-factor auth" description="Require MFA for all recruiters on your desk." checked={quickMfa} onToggle={(v) => { setQuickMfa(v); if (v) toast.info("Continue setup in Security Center"); }} />
      </div>

      <AccountSection
        defaults={{
          name: user?.name ?? "Sneha Reddy",
          email: user?.email ?? "sneha@talentbridge.in",
          phone: "+91 99660 11223",
          bio: "Senior Recruiter at TalentBridge Consulting. Specialising in IT placements across Bengaluru and Hyderabad — 6+ years of contingency and retained search.",
        }}
      />

      <AppearanceSection />

      <PrivacySection initial={PRIVACY_INITIAL} />

      <BillingSection
        plan={{ name: "Recruiter Pro", price: "₹4,999 / month", renewOn: "5 Dec 2024", status: "active" }}
      />

      <IntegrationsSection integrations={INTEGRATIONS} />

      <ApiSection />

      <IpAllowlistSection />

      <DangerZoneSection portalLabel="Recruiter" />
    </div>
  );
}
