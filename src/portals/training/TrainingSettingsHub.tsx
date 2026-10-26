"use client";

import * as React from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common";
import { Icon } from "@/components/common/Icon";
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
  { key: "public_academy", label: "Public academy profile", description: "Showcase SkillForge Academy on JOBSONN's training marketplace.", enabled: true },
  { key: "client_data_sharing", label: "Share data with corporate clients", description: "Share learner progress with sponsoring employers.", enabled: true },
  { key: "trainer_indexing", label: "Trainer indexing", description: "Allow trainers to be discoverable for guest sessions.", enabled: false },
  { key: "analytics", label: "Usage analytics", description: "Help improve JOBSONN with anonymous usage data.", enabled: true },
];

const INTEGRATIONS = [
  { name: "Moodle LMS", icon: "GraduationCap", connected: true, description: "Sync courses, enrollments, and grades." },
  { name: "Google Calendar", icon: "Calendar", connected: true, description: "Sync live sessions and trainer availability." },
  { name: "Zoom", icon: "Video", connected: true, description: "Host live virtual training sessions." },
  { name: "Microsoft Teams", icon: "MessagesSquare", connected: false, description: "Alternative to Zoom for enterprise clients." },
  { name: "Razorpay", icon: "CreditCard", connected: true, description: "Collect payments from corporate clients." },
  { name: "Zoho Books", icon: "Receipt", connected: false, description: "Sync invoices and tax records." },
];

export function TrainingSettingsHub() {
  const { user } = useAuth();
  const { navigate } = useNav();
  const [quickEnrollments, setQuickEnrollments] = React.useState(true);
  const [quickCompliance, setQuickCompliance] = React.useState(true);
  const [quickMfa, setQuickMfa] = React.useState(true);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your training company, LMS integrations, security, and billing."
        icon={<Icon name="Settings" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLinkCard
          icon="ShieldCheck"
          title="Security center"
          description="MFA, sessions, IP allowlist, and audit logs."
          ctaLabel="Open"
          onClick={() => navigate("training", "security-center")}
        />
        <QuickLinkCard
          icon="Bell"
          title="Notification preferences"
          description="Tune alerts for enrollments, compliance, and renewals."
          ctaLabel="Open"
          onClick={() => navigate("training", "notification-preferences")}
        />
        <QuickLinkCard
          icon="Receipt"
          title="Invoices & billing"
          description="Manage corporate client billing and GST."
          ctaLabel="Open"
          onClick={() => navigate("training", "invoices")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ToggleRow icon="Users2" title="New enrollment alerts" description="Get notified on every new enrollment." checked={quickEnrollments} onToggle={setQuickEnrollments} />
        <ToggleRow icon="ShieldCheck" title="Compliance deadlines" description="Alerts for compliance course renewals." checked={quickCompliance} onToggle={setQuickCompliance} />
        <ToggleRow icon="KeyRound" title="Two-factor auth" description="Require MFA for all trainers and admins." checked={quickMfa} onToggle={(v) => { setQuickMfa(v); if (v) toast.info("Continue setup in Security Center"); }} />
      </div>

      <AccountSection
        defaults={{
          name: user?.name ?? "Divya Sharma",
          email: user?.email ?? "divya@skillforge.academy",
          phone: "+91 99887 76655",
          bio: "Account Manager at SkillForge Academy. Oversee 14 corporate training contracts across India and APAC, with a focus on tech upskilling and leadership programs.",
        }}
      />

      <AppearanceSection />

      <PrivacySection initial={PRIVACY_INITIAL} />

      <BillingSection
        plan={{ name: "Training Enterprise", price: "₹24,999 / month", renewOn: "22 Nov 2024", status: "active" }}
      />

      <IntegrationsSection integrations={INTEGRATIONS} />

      <ApiSection />

      <IpAllowlistSection />

      <DangerZoneSection portalLabel="Training" />
    </div>
  );
}
