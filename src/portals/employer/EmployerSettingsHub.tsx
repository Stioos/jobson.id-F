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
  { key: "public_profile", label: "Public employer profile", description: "Show your company on JOBSONN's public employer directory.", enabled: true },
  { key: "candidate_indexing", label: "Candidate indexing", description: "Allow your jobs to appear in candidate search and recommendations.", enabled: true },
  { key: "data_sharing", label: "Share data with partners", description: "Share hiring analytics with training & staffing partners for talent pipelines.", enabled: false },
  { key: "analytics", label: "Usage analytics", description: "Help improve JOBSONN with anonymous usage data.", enabled: true },
];

const INTEGRATIONS = [
  { name: "Greenhouse (ATS)", icon: "Database", connected: true, description: "Sync applications, candidates, and statuses." },
  { name: "Workday (HRIS)", icon: "Users", connected: true, description: "Sync new hires and employee records." },
  { name: "Slack", icon: "MessagesSquare", connected: true, description: "Notifications in your team channels." },
  { name: "LinkedIn Recruiter", icon: "Users", connected: false, description: "Source candidates from LinkedIn." },
  { name: "Calendly", icon: "Calendar", connected: false, description: "Schedule interviews without back-and-forth." },
  { name: "DocuSign", icon: "FileText", connected: false, description: "Sign offer letters and contracts." },
];

export function EmployerSettingsHub() {
  const { user } = useAuth();
  const { navigate } = useNav();
  const [quickNewApps, setQuickNewApps] = React.useState(true);
  const [quickInterviewRem, setQuickInterviewRem] = React.useState(true);
  const [quickMfa, setQuickMfa] = React.useState(true);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your employer organization, hiring workflows, security, and integrations."
        icon={<Icon name="Settings" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLinkCard
          icon="ShieldCheck"
          title="Security center"
          description="SSO, MFA, active sessions, IP allowlist, and audit logs."
          ctaLabel="Open"
          onClick={() => navigate("employer", "security-center")}
        />
        <QuickLinkCard
          icon="Bell"
          title="Notification preferences"
          description="Tune alerts for new applicants, interviews, and billing."
          ctaLabel="Open"
          onClick={() => navigate("employer", "notification-preferences")}
        />
        <QuickLinkCard
          icon="Users"
          title="Recruitment team"
          description="Invite members, manage roles, and audit access."
          ctaLabel="Open"
          onClick={() => navigate("employer", "team")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ToggleRow icon="Inbox" title="New applicant alerts" description="Get notified when candidates apply." checked={quickNewApps} onToggle={setQuickNewApps} />
        <ToggleRow icon="Calendar" title="Interview reminders" description="Reminders 24h before scheduled interviews." checked={quickInterviewRem} onToggle={setQuickInterviewRem} />
        <ToggleRow icon="KeyRound" title="Two-factor auth" description="Require MFA for all team members." checked={quickMfa} onToggle={(v) => { setQuickMfa(v); if (v) toast.info("Continue setup in Security Center"); }} />
      </div>

      <AccountSection
        defaults={{
          name: user?.name ?? "Rohan Mehta",
          email: user?.email ?? "rohan.mehta@techcorp.com",
          phone: "+91 98200 12345",
          bio: "Head of Talent Acquisition at TechCorp India. Hiring across engineering, product, and design in Bengaluru and Mumbai.",
        }}
      />

      <AppearanceSection />

      <PrivacySection initial={PRIVACY_INITIAL} />

      <BillingSection
        plan={{ name: "Enterprise", price: "₹49,999 / month", renewOn: "30 Nov 2024", status: "active" }}
      />

      <IntegrationsSection integrations={INTEGRATIONS} />

      <ApiSection />

      <IpAllowlistSection />

      <DangerZoneSection portalLabel="Employer" />
    </div>
  );
}
