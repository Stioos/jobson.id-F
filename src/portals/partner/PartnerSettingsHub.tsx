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
  { key: "public_partner", label: "Public partner profile", description: "Showcase your training centre on jobson.id's partner directory.", enabled: true },
  { key: "student_data_sharing", label: "Share student data with jobson.id", description: "Allow jobson.id to verify placements and certifications.", enabled: true },
  { key: "revenue_transparency", label: "Revenue-share transparency", description: "Show split breakdowns to your sub-partners.", enabled: false },
  { key: "analytics", label: "Usage analytics", description: "Help improve jobson.id with anonymous usage data.", enabled: true },
];

const INTEGRATIONS = [
  { name: "GST Portal", icon: "Landmark", connected: true, description: "Auto-fetch GST rates and file returns." },
  { name: "ICICI Bank (Settlements)", icon: "Wallet", connected: true, description: "Receive partner settlements via NEFT." },
  { name: "Razorpay (Admissions)", icon: "CreditCard", connected: true, description: "Collect student admission fees." },
  { name: "Google Workspace", icon: "Mail", connected: true, description: "Email and calendar for your centre." },
  { name: "Tally", icon: "Receipt", connected: false, description: "Sync invoices and accounting entries." },
  { name: "WhatsApp Business", icon: "MessagesSquare", connected: false, description: "Send batch updates to students." },
];

export function PartnerSettingsHub() {
  const { user } = useAuth();
  const { navigate } = useNav();
  const [quickAdmissions, setQuickAdmissions] = React.useState(true);
  const [quickSettlements, setQuickSettlements] = React.useState(true);
  const [quickMfa, setQuickMfa] = React.useState(true);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your partner profile, revenue splits, banking, security, and integrations."
        icon={<Icon name="Settings" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLinkCard
          icon="ShieldCheck"
          title="Security center"
          description="MFA, sessions, IP allowlist, and audit logs."
          ctaLabel="Open"
          onClick={() => navigate("partner", "security-center")}
        />
        <QuickLinkCard
          icon="Bell"
          title="Notification preferences"
          description="Tune alerts for admissions, settlements, and renewals."
          ctaLabel="Open"
          onClick={() => navigate("partner", "notification-preferences")}
        />
        <QuickLinkCard
          icon="Percent"
          title="Revenue splits"
          description="View and configure your commission structure."
          ctaLabel="Open"
          onClick={() => navigate("partner", "revenue-splits")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ToggleRow icon="GraduationCap" title="New admission alerts" description="Get notified when a student enrolls." checked={quickAdmissions} onToggle={setQuickAdmissions} />
        <ToggleRow icon="Coins" title="Settlement alerts" description="Get notified when settlements hit your wallet." checked={quickSettlements} onToggle={setQuickSettlements} />
        <ToggleRow icon="KeyRound" title="Two-factor auth" description="Require MFA for all centre admins." checked={quickMfa} onToggle={(v) => { setQuickMfa(v); if (v) toast.info("Continue setup in Security Center"); }} />
      </div>

      <AccountSection
        defaults={{
          name: user?.name ?? "Rajesh Kumar",
          email: user?.email ?? "rajesh@chennaittechacademy.in",
          phone: "+91 98400 12345",
          bio: "Director at Chennai Tech Academy (Premium Centre Partner). 6+ years delivering technology training across Chennai East. 1,240+ students enrolled, 980+ graduated.",
        }}
      />

      <AppearanceSection />

      <PrivacySection initial={PRIVACY_INITIAL} />

      <BillingSection
        plan={{ name: "Partner Premium", price: "₹0 / month (revenue-share)", renewOn: "Auto-renews", status: "active" }}
      />

      <IntegrationsSection integrations={INTEGRATIONS} />

      <ApiSection />

      <IpAllowlistSection />

      <DangerZoneSection portalLabel="Partner" />
    </div>
  );
}
