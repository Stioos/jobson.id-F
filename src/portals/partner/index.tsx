"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

// Every page is lazy-loaded via next/dynamic to keep dev-server memory bounded
// (sandbox has a 4GB memory limit — compiling all page modules at once would OOM).
// --- Existing 24 pages ---
const PartnerOverview = dynamic(() => import("./PartnerOverview").then((m) => m.PartnerOverview));
const PartnerAnalytics = dynamic(() => import("./PartnerAnalytics").then((m) => m.PartnerAnalytics));
const PartnerLeads = dynamic(() => import("./PartnerLeads").then((m) => m.PartnerLeads));
const PartnerStudents = dynamic(() => import("./PartnerStudents").then((m) => m.PartnerStudents));
const PartnerMarketing = dynamic(() => import("./PartnerMarketing").then((m) => m.PartnerMarketing));
const PartnerApplications = dynamic(() => import("./PartnerApplications").then((m) => m.PartnerApplications));
const PartnerCentres = dynamic(() => import("./PartnerCentres").then((m) => m.PartnerCentres));
const PartnerBatches = dynamic(() => import("./PartnerBatches").then((m) => m.PartnerBatches));
const PartnerColleges = dynamic(() => import("./PartnerColleges").then((m) => m.PartnerColleges));
const PartnerEngagements = dynamic(() => import("./PartnerEngagements").then((m) => m.PartnerEngagements));
const PartnerServiceCatalog = dynamic(() => import("./PartnerServiceCatalog").then((m) => m.PartnerServiceCatalog));
const PartnerJobOrders = dynamic(() => import("./PartnerJobOrders").then((m) => m.PartnerJobOrders));
const PartnerWallet = dynamic(() => import("./PartnerWallet").then((m) => m.PartnerWallet));
const PartnerSettlements = dynamic(() => import("./PartnerSettlements").then((m) => m.PartnerSettlements));
const PartnerRevenueSplits = dynamic(() => import("./PartnerRevenueSplits").then((m) => m.PartnerRevenueSplits));
const PartnerCalculator = dynamic(() => import("./PartnerCalculator").then((m) => m.PartnerCalculator));
const PartnerFees = dynamic(() => import("./PartnerFees").then((m) => m.PartnerFees));
const PartnerInvoices = dynamic(() => import("./PartnerInvoices").then((m) => m.PartnerInvoices));
const PartnerProfile = dynamic(() => import("./PartnerProfile").then((m) => m.PartnerProfile));
const PartnerModels = dynamic(() => import("./PartnerModels").then((m) => m.PartnerModels));
const PartnerPrograms = dynamic(() => import("./PartnerPrograms").then((m) => m.PartnerPrograms));
const PartnerCompliance = dynamic(() => import("./PartnerCompliance").then((m) => m.PartnerCompliance));
const PartnerSettings = dynamic(() => import("./PartnerSettings").then((m) => m.PartnerSettings));
const PartnerSupport = dynamic(() => import("./PartnerSupport").then((m) => m.PartnerSupport));

// Settings & Support hub pages (SETTINGS-SUPPORT)
const PartnerSettingsHub = dynamic(() => import("./PartnerSettingsHub").then((m) => m.PartnerSettingsHub));
const PartnerSecurityCenter = dynamic(() => import("./PartnerSecurityCenter").then((m) => m.PartnerSecurityCenter));
const PartnerNotificationPrefs = dynamic(() => import("./PartnerNotificationPrefs").then((m) => m.PartnerNotificationPrefs));
const PartnerSupportHub = dynamic(() => import("./PartnerSupportHub").then((m) => m.PartnerSupportHub));

// --- 21 new pages (P-ENHANCE) ---
const PartnerDeals = dynamic(() => import("./PartnerDeals").then((m) => m.PartnerDeals));
const PartnerAccounts = dynamic(() => import("./PartnerAccounts").then((m) => m.PartnerAccounts));
const PartnerTaxRates = dynamic(() => import("./PartnerTaxRates").then((m) => m.PartnerTaxRates));
const PartnerTransactions = dynamic(() => import("./PartnerTransactions").then((m) => m.PartnerTransactions));
const PartnerForms = dynamic(() => import("./PartnerForms").then((m) => m.PartnerForms));
const PartnerCertificates = dynamic(() => import("./PartnerCertificates").then((m) => m.PartnerCertificates));
const PartnerGuidelines = dynamic(() => import("./PartnerGuidelines").then((m) => m.PartnerGuidelines));
const PartnerOnlineTools = dynamic(() => import("./PartnerOnlineTools").then((m) => m.PartnerOnlineTools));
const PartnerMyClients = dynamic(() => import("./PartnerMyClients").then((m) => m.PartnerMyClients));
const PartnerAnnouncements = dynamic(() => import("./PartnerAnnouncements").then((m) => m.PartnerAnnouncements));
const PartnerAuditLogs = dynamic(() => import("./PartnerAuditLogs").then((m) => m.PartnerAuditLogs));
const PartnerConfigureSettings = dynamic(() => import("./PartnerConfigureSettings").then((m) => m.PartnerConfigureSettings));
const PartnerCollegeApplications = dynamic(() => import("./PartnerCollegeApplications").then((m) => m.PartnerCollegeApplications));
const PartnerMouAgreements = dynamic(() => import("./PartnerMouAgreements").then((m) => m.PartnerMouAgreements));
const PartnerRenewals = dynamic(() => import("./PartnerRenewals").then((m) => m.PartnerRenewals));
const PartnerFaculty = dynamic(() => import("./PartnerFaculty").then((m) => m.PartnerFaculty));
const PartnerTrainingDelivery = dynamic(() => import("./PartnerTrainingDelivery").then((m) => m.PartnerTrainingDelivery));
const PartnerInternships = dynamic(() => import("./PartnerInternships").then((m) => m.PartnerInternships));
const PartnerProjects = dynamic(() => import("./PartnerProjects").then((m) => m.PartnerProjects));
const PartnerEvents = dynamic(() => import("./PartnerEvents").then((m) => m.PartnerEvents));
const PartnerRevenue = dynamic(() => import("./PartnerRevenue").then((m) => m.PartnerRevenue));

// Talent Solutions pages (TS-CROSS)
const PartnerTalentSolutions = dynamic(() => import("./PartnerTalentSolutions").then((m) => m.PartnerTalentSolutions));
const PartnerTsTransactions = dynamic(() => import("./PartnerTsTransactions").then((m) => m.PartnerTsTransactions));

// --- 5 high-impact features (BUILD-PARTNER-FEATURES) ---
const PartnerPlacements = dynamic(() => import("./PartnerPlacements").then((m) => m.PartnerPlacements));
const PartnerReports = dynamic(() => import("./PartnerReports").then((m) => m.PartnerReports));
const PartnerCommissions = dynamic(() => import("./PartnerCommissions").then((m) => m.PartnerCommissions));
const PartnerTaxDocuments = dynamic(() => import("./PartnerTaxDocuments").then((m) => m.PartnerTaxDocuments));
const PartnerClientMessaging = dynamic(() => import("./PartnerClientMessaging").then((m) => m.PartnerClientMessaging));

// Cross-portal shared pages (SETTINGS-SUPPORT-SHARED)
const TasksWorkspace = dynamic(() => import("@/portals/_settings-support-shared/TasksWorkspace").then((m) => m.TasksWorkspace));

// --- 3 profile features (WAVE1-PARTNER-PROFILE) ---
const PartnerProfileEnhanced = dynamic(() => import("./PartnerProfileEnhanced").then((m) => m.PartnerProfileEnhanced));
const PartnerCollegeProfiles = dynamic(() => import("./PartnerCollegeProfiles").then((m) => m.PartnerCollegeProfiles));
const PartnerScorecard = dynamic(() => import("./PartnerScorecard").then((m) => m.PartnerScorecard));

// Process & lifecycle pages (WAVE3-RECRUITER-TRAINING-PARTNER-PROCESS)
const PartnerOnboardingWizard = dynamic(() => import("./PartnerOnboardingWizard").then((m) => m.PartnerOnboardingWizard));
const PartnerRenewalForecast = dynamic(() => import("./PartnerRenewalForecast").then((m) => m.PartnerRenewalForecast));

// Transaction & finance pages (WAVE4-TRANSACTIONS-ALL-PORTALS)
const PartnerSplitSimulator = dynamic(() => import("./PartnerSplitSimulator").then((m) => m.PartnerSplitSimulator));
const PartnerSettlementDisputes = dynamic(() => import("./PartnerSettlementDisputes").then((m) => m.PartnerSettlementDisputes));

// Communication pages (WAVE5-COMMUNICATION-ALL-PORTALS)
const PartnerCollegeWorkspace = dynamic(() => import("./PartnerCollegeWorkspace").then((m) => m.PartnerCollegeWorkspace));
const PartnerMarketingMaterials = dynamic(() => import("./PartnerMarketingMaterials").then((m) => m.PartnerMarketingMaterials));

export function PortalRouter() {
  const { route } = useNav();
  return <>{render(route)}</>;
}

export function render(route: string): React.ReactNode {
  const root = (route || "overview").split("/")[0];
  switch (root) {
    // Overview
    case "overview":
    case "home":
    case "":
      return <PartnerOverview />;
    case "tasks": return <TasksWorkspace portal="partner" route={route} />;
    case "analytics": return <PartnerAnalytics />;
    case "partner-scorecard": return <PartnerScorecard />;
    case "reports": return <PartnerReports />;
    case "revenue": return <PartnerRevenue />;
    case "announcements": return <PartnerAnnouncements />;
    case "audit-logs": return <PartnerAuditLogs />;
    // Deals & CRM
    case "deals": return <PartnerDeals />;
    case "leads": return <PartnerLeads />;
    case "my-clients": return <PartnerMyClients />;
    case "students": return <PartnerStudents />;
    case "marketing": return <PartnerMarketing />;
    case "applications": return <PartnerApplications />;
    // Partnership
    case "profile": return <PartnerProfile />;
    case "partner-profile-enhanced": return <PartnerProfileEnhanced />;
    case "college-profiles": return <PartnerCollegeProfiles />;
    case "college-applications": return <PartnerCollegeApplications />;
    case "colleges": return <PartnerColleges />;
    case "models": return <PartnerModels />;
    case "mou-agreements": return <PartnerMouAgreements />;
    case "renewals": return <PartnerRenewals />;
    // Process & lifecycle (WAVE3-RECRUITER-TRAINING-PARTNER-PROCESS)
    case "partner-onboarding": return <PartnerOnboardingWizard />;
    case "renewal-forecast": return <PartnerRenewalForecast />;
    // Transaction & finance (WAVE4-TRANSACTIONS-ALL-PORTALS)
    case "split-simulator": return <PartnerSplitSimulator />;
    case "settlement-disputes": return <PartnerSettlementDisputes />;
    // Communication (WAVE5-COMMUNICATION-ALL-PORTALS)
    case "college-workspace": return <PartnerCollegeWorkspace />;
    case "marketing-materials": return <PartnerMarketingMaterials />;
    // Academics
    case "programs": return <PartnerPrograms />;
    case "centres": return <PartnerCentres />;
    case "batches": return <PartnerBatches />;
    case "faculty": return <PartnerFaculty />;
    case "training-delivery": return <PartnerTrainingDelivery />;
    case "events-drives": return <PartnerEvents />;
    // Careers & Outcomes
    case "internships": return <PartnerInternships />;
    case "projects": return <PartnerProjects />;
    case "job-orders": return <PartnerJobOrders />;
    case "placements": return <PartnerPlacements />;
    case "compliance": return <PartnerCompliance />;
    case "certificates": return <PartnerCertificates />;
    // Finance
    case "wallet": return <PartnerWallet />;
    case "settlements": return <PartnerSettlements />;
    case "transactions": return <PartnerTransactions />;
    case "accounts": return <PartnerAccounts />;
    case "tax-rates": return <PartnerTaxRates />;
    case "fees": return <PartnerFees />;
    case "commissions": return <PartnerCommissions />;
    case "tax-documents": return <PartnerTaxDocuments />;
    // Tools & Support
    case "online-tools": return <PartnerOnlineTools />;
    case "forms-assistance": return <PartnerForms />;
    case "guidelines": return <PartnerGuidelines />;
    case "service-catalog": return <PartnerServiceCatalog />;
    case "engagements": return <PartnerEngagements />;
    case "client-messaging": return <PartnerClientMessaging />;
    case "support": return <PartnerSupport />;
    // Settings
    case "settings": return <PartnerSettings />;
    case "configure-settings": return <PartnerConfigureSettings />;
    case "calculator": return <PartnerCalculator />;
    case "revenue-splits": return <PartnerRevenueSplits />;
    case "invoices": return <PartnerInvoices />;
    // Settings & Support hub pages (SETTINGS-SUPPORT)
    case "settings-hub": return <PartnerSettingsHub />;
    case "security-center": return <PartnerSecurityCenter />;
    case "notification-preferences": return <PartnerNotificationPrefs />;
    case "support-hub": return <PartnerSupportHub />;
    // Talent Solutions (TS-CROSS)
    case "ts-hub": return <PartnerTalentSolutions />;
    case "ts-transactions": return <PartnerTsTransactions />;
    default: return <PartnerOverview />;
  }
}
