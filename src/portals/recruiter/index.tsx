"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

const RecruiterOverview = dynamic(() => import("./RecruiterOverview").then((m) => m.RecruiterOverview));
const RecruiterClients = dynamic(() => import("./RecruiterClients").then((m) => m.RecruiterClients));
const RecruiterRequisitions = dynamic(() => import("./RecruiterRequisitions").then((m) => m.RecruiterRequisitions));
const RecruiterCandidates = dynamic(() => import("./RecruiterCandidates").then((m) => m.RecruiterCandidates));
const RecruiterTalentPool = dynamic(() => import("./RecruiterTalentPool").then((m) => m.RecruiterTalentPool));
const RecruiterSubmissions = dynamic(() => import("./RecruiterSubmissions").then((m) => m.RecruiterSubmissions));
const RecruiterPlacements = dynamic(() => import("./RecruiterPlacements").then((m) => m.RecruiterPlacements));
const RecruiterCommissions = dynamic(() => import("./RecruiterCommissions").then((m) => m.RecruiterCommissions));
const RecruiterInvoices = dynamic(() => import("./RecruiterInvoices").then((m) => m.RecruiterInvoices));
const RecruiterAnalytics = dynamic(() => import("./RecruiterAnalytics").then((m) => m.RecruiterAnalytics));
const RecruiterMessages = dynamic(() => import("./RecruiterMessages").then((m) => m.RecruiterMessages));
const RecruiterSettings = dynamic(() => import("./RecruiterSettings").then((m) => m.RecruiterSettings));
const RecruiterSupport = dynamic(() => import("./RecruiterSupport").then((m) => m.RecruiterSupport));

// Settings & Support hub pages (SETTINGS-SUPPORT)
const RecruiterSettingsHub = dynamic(() => import("./RecruiterSettingsHub").then((m) => m.RecruiterSettingsHub));
const RecruiterSecurityCenter = dynamic(() => import("./RecruiterSecurityCenter").then((m) => m.RecruiterSecurityCenter));
const RecruiterNotificationPrefs = dynamic(() => import("./RecruiterNotificationPrefs").then((m) => m.RecruiterNotificationPrefs));
const RecruiterSupportHub = dynamic(() => import("./RecruiterSupportHub").then((m) => m.RecruiterSupportHub));

// Recruitment enhancement pages (R-ENHANCE) — sourced from partner-data
const RecruiterJobOrders = dynamic(() => import("./RecruiterJobOrders").then((m) => m.RecruiterJobOrders));
const RecruiterHotlists = dynamic(() => import("./RecruiterHotlists").then((m) => m.RecruiterHotlists));
const RecruiterOnboarding = dynamic(() => import("./RecruiterOnboarding").then((m) => m.RecruiterOnboarding));
const RecruiterTimesheets = dynamic(() => import("./RecruiterTimesheets").then((m) => m.RecruiterTimesheets));
const RecruiterEmailTemplates = dynamic(() => import("./RecruiterEmailTemplates").then((m) => m.RecruiterEmailTemplates));
const RecruiterCandidateCompliance = dynamic(() => import("./RecruiterCandidateCompliance").then((m) => m.RecruiterCandidateCompliance));

// Pipeline / hiring / sourcing pages (R-PIPELINE)
const RecruiterOpenings = dynamic(() => import("./RecruiterOpenings").then((m) => m.RecruiterOpenings));
const RecruiterPipeline = dynamic(() => import("./RecruiterPipeline").then((m) => m.RecruiterPipeline));
const RecruiterInterviewPipeline = dynamic(() => import("./RecruiterInterviewPipeline").then((m) => m.RecruiterInterviewPipeline));
const RecruiterScheduling = dynamic(() => import("./RecruiterScheduling").then((m) => m.RecruiterScheduling));
const RecruiterOffers = dynamic(() => import("./RecruiterOffers").then((m) => m.RecruiterOffers));
const RecruiterAssessments = dynamic(() => import("./RecruiterAssessments").then((m) => m.RecruiterAssessments));
const RecruiterFeedback = dynamic(() => import("./RecruiterFeedback").then((m) => m.RecruiterFeedback));
const RecruiterTasks = dynamic(() => import("./RecruiterTasks").then((m) => m.RecruiterTasks));
const RecruiterReferrals = dynamic(() => import("./RecruiterReferrals").then((m) => m.RecruiterReferrals));
const RecruiterSourcingCampaigns = dynamic(() => import("./RecruiterSourcingCampaigns").then((m) => m.RecruiterSourcingCampaigns));
const RecruiterNetworkSourcing = dynamic(() => import("./RecruiterNetworkSourcing").then((m) => m.RecruiterNetworkSourcing));
const RecruiterInbox = dynamic(() => import("./RecruiterInbox").then((m) => m.RecruiterInbox));

// Recruitment business / intelligence / finance pages (R-BUSINESS)
const RecruiterClientAccounts = dynamic(() => import("./RecruiterClientAccounts").then((m) => m.RecruiterClientAccounts));
const RecruiterClientDev = dynamic(() => import("./RecruiterClientDev").then((m) => m.RecruiterClientDev));
const RecruiterMarketing = dynamic(() => import("./RecruiterMarketing").then((m) => m.RecruiterMarketing));
const RecruiterActivity = dynamic(() => import("./RecruiterActivity").then((m) => m.RecruiterActivity));
const RecruiterAI = dynamic(() => import("./RecruiterAI").then((m) => m.RecruiterAI));
const RecruiterReportBuilder = dynamic(() => import("./RecruiterReportBuilder").then((m) => m.RecruiterReportBuilder));
const RecruiterWallet = dynamic(() => import("./RecruiterWallet").then((m) => m.RecruiterWallet));
const RecruiterSettlements = dynamic(() => import("./RecruiterSettlements").then((m) => m.RecruiterSettlements));
const RecruiterTeam = dynamic(() => import("./RecruiterTeam").then((m) => m.RecruiterTeam));
const RecruiterAuditLogs = dynamic(() => import("./RecruiterAuditLogs").then((m) => m.RecruiterAuditLogs));

// Cross-portal partner integration pages (CROSS-INTEGRATE)
const RecruiterPartnerCandidates = dynamic(() => import("./RecruiterPartnerCandidates").then((m) => m.RecruiterPartnerCandidates));
const RecruiterPartnerNetwork = dynamic(() => import("./RecruiterPartnerNetwork").then((m) => m.RecruiterPartnerNetwork));

// Talent Solutions pages (TS-CROSS)
const RecruiterTalentSolutions = dynamic(() => import("./RecruiterTalentSolutions").then((m) => m.RecruiterTalentSolutions));
const RecruiterTsTransactions = dynamic(() => import("./RecruiterTsTransactions").then((m) => m.RecruiterTsTransactions));

// Agency Management pages (merged from the former Agency Portal)
const AgencyOverview = dynamic(() => import("@/portals/agency/AgencyOverview").then((m) => m.AgencyOverview));
const AgencyProfile = dynamic(() => import("@/portals/agency/AgencyProfile").then((m) => m.AgencyProfile));
const AgencyRecruiters = dynamic(() => import("@/portals/agency/AgencyRecruiters").then((m) => m.AgencyRecruiters));
const AgencyClients = dynamic(() => import("@/portals/agency/AgencyClients").then((m) => m.AgencyClients));
const AgencyRequisitions = dynamic(() => import("@/portals/agency/AgencyRequisitions").then((m) => m.AgencyRequisitions));
const AgencySubmissions = dynamic(() => import("@/portals/agency/AgencySubmissions").then((m) => m.AgencySubmissions));
const AgencyPlacements = dynamic(() => import("@/portals/agency/AgencyPlacements").then((m) => m.AgencyPlacements));
const AgencyCommissions = dynamic(() => import("@/portals/agency/AgencyCommissions").then((m) => m.AgencyCommissions));
const AgencyInvoices = dynamic(() => import("@/portals/agency/AgencyInvoices").then((m) => m.AgencyInvoices));
const AgencyAnalytics = dynamic(() => import("@/portals/agency/AgencyAnalytics").then((m) => m.AgencyAnalytics));
const AgencySettings = dynamic(() => import("@/portals/agency/AgencySettings").then((m) => m.AgencySettings));

export function PortalRouter() {
  const { route } = useNav();
  return <>{render(route)}</>;
}

export function render(route: string): React.ReactNode {
  const top = route.split("/")[0] || "overview";
  switch (top) {
    case "overview": return <RecruiterOverview />;
    case "clients": return <RecruiterClients />;
    case "requisitions": return <RecruiterRequisitions />;
    case "candidates": return <RecruiterCandidates />;
    case "talent-pool": return <RecruiterTalentPool />;
    case "submissions": return <RecruiterSubmissions />;
    case "placements": return <RecruiterPlacements />;
    case "commissions": return <RecruiterCommissions />;
    case "invoices": return <RecruiterInvoices />;
    case "analytics": return <RecruiterAnalytics />;
    case "messages": return <RecruiterMessages />;
    case "settings": return <RecruiterSettings />;
    case "support": return <RecruiterSupport />;
    // Settings & Support hub pages (SETTINGS-SUPPORT)
    case "settings-hub": return <RecruiterSettingsHub />;
    case "security-center": return <RecruiterSecurityCenter />;
    case "notification-preferences": return <RecruiterNotificationPrefs />;
    case "support-hub": return <RecruiterSupportHub />;
    // Recruitment enhancement pages (R-ENHANCE)
    case "job-orders": return <RecruiterJobOrders />;
    case "hotlists": return <RecruiterHotlists />;
    case "onboarding": return <RecruiterOnboarding />;
    case "timesheets": return <RecruiterTimesheets />;
    case "email-templates": return <RecruiterEmailTemplates />;
    case "candidate-compliance": return <RecruiterCandidateCompliance />;
    // Pipeline / hiring / sourcing pages (R-PIPELINE)
    case "openings": return <RecruiterOpenings />;
    case "pipeline": return <RecruiterPipeline />;
    case "interview-pipeline": return <RecruiterInterviewPipeline />;
    case "scheduling": return <RecruiterScheduling />;
    case "offers": return <RecruiterOffers />;
    case "assessments": return <RecruiterAssessments />;
    case "feedback": return <RecruiterFeedback />;
    case "tasks": return <RecruiterTasks />;
    case "referrals": return <RecruiterReferrals />;
    case "sourcing-campaigns": return <RecruiterSourcingCampaigns />;
    case "network-sourcing": return <RecruiterNetworkSourcing />;
    case "inbox": return <RecruiterInbox />;
    // Recruitment business / intelligence / finance pages (R-BUSINESS)
    case "client-accounts": return <RecruiterClientAccounts />;
    case "client-dev": return <RecruiterClientDev />;
    case "marketing": return <RecruiterMarketing />;
    case "activity": return <RecruiterActivity />;
    case "recruiting-ai": return <RecruiterAI />;
    case "report-builder": return <RecruiterReportBuilder />;
    case "wallet": return <RecruiterWallet />;
    case "settlements": return <RecruiterSettlements />;
    case "recruiters": return <RecruiterTeam />;
    case "audit-logs": return <RecruiterAuditLogs />;
    // Cross-portal partner integration (CROSS-INTEGRATE)
    case "partner-candidates": return <RecruiterPartnerCandidates />;
    case "partner-network": return <RecruiterPartnerNetwork />;
    // Talent Solutions (TS-CROSS)
    case "ts-hub": return <RecruiterTalentSolutions />;
    case "ts-transactions": return <RecruiterTsTransactions />;
    // Agency Management (merged from the former Agency Portal)
    case "ag-overview": return <AgencyOverview />;
    case "ag-profile": return <AgencyProfile />;
    case "ag-recruiters": return <AgencyRecruiters />;
    case "ag-clients": return <AgencyClients />;
    case "ag-requisitions": return <AgencyRequisitions />;
    case "ag-submissions": return <AgencySubmissions />;
    case "ag-placements": return <AgencyPlacements />;
    case "ag-commissions": return <AgencyCommissions />;
    case "ag-invoices": return <AgencyInvoices />;
    case "ag-analytics": return <AgencyAnalytics />;
    case "ag-settings": return <AgencySettings />;
    default: return <RecruiterOverview />;
  }
}
