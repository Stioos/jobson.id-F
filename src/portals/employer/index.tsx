"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

const EmployerOverview = dynamic(() => import("./EmployerOverview").then((m) => m.EmployerOverview));
const EmployerCompanyProfile = dynamic(() => import("./EmployerCompanyProfile").then((m) => m.EmployerCompanyProfile));
const EmployerBranding = dynamic(() => import("./EmployerBranding").then((m) => m.EmployerBranding));
const EmployerJobs = dynamic(() => import("./EmployerJobs").then((m) => m.EmployerJobs));
const EmployerCreateJob = dynamic(() => import("./EmployerCreateJob").then((m) => m.EmployerCreateJob));
const EmployerTemplates = dynamic(() => import("./EmployerTemplates").then((m) => m.EmployerTemplates));
const EmployerApplicants = dynamic(() => import("./EmployerApplicants").then((m) => m.EmployerApplicants));
const EmployerPipeline = dynamic(() => import("./EmployerPipeline").then((m) => m.EmployerPipeline));
const EmployerTalentSearch = dynamic(() => import("./EmployerTalentSearch").then((m) => m.EmployerTalentSearch));
const EmployerTalentPool = dynamic(() => import("./EmployerTalentPool").then((m) => m.EmployerTalentPool));
const EmployerShortlists = dynamic(() => import("./EmployerShortlists").then((m) => m.EmployerShortlists));
const EmployerAssessments = dynamic(() => import("./EmployerAssessments").then((m) => m.EmployerAssessments));
const EmployerInterviews = dynamic(() => import("./EmployerInterviews").then((m) => m.EmployerInterviews));
const EmployerOffers = dynamic(() => import("./EmployerOffers").then((m) => m.EmployerOffers));
const EmployerHires = dynamic(() => import("./EmployerHires").then((m) => m.EmployerHires));
const EmployerTeam = dynamic(() => import("./EmployerTeam").then((m) => m.EmployerTeam));
const EmployerAnalytics = dynamic(() => import("./EmployerAnalytics").then((m) => m.EmployerAnalytics));
const EmployerSubscription = dynamic(() => import("./EmployerSubscription").then((m) => m.EmployerSubscription));
const EmployerIntegrations = dynamic(() => import("./EmployerIntegrations").then((m) => m.EmployerIntegrations));
const EmployerMessages = dynamic(() => import("./EmployerMessages").then((m) => m.EmployerMessages));
const EmployerSettings = dynamic(() => import("./EmployerSettings").then((m) => m.EmployerSettings));
const EmployerSupport = dynamic(() => import("./EmployerSupport").then((m) => m.EmployerSupport));

// Settings & Support hub pages (SETTINGS-SUPPORT)
const EmployerSettingsHub = dynamic(() => import("./EmployerSettingsHub").then((m) => m.EmployerSettingsHub));
const EmployerSecurityCenter = dynamic(() => import("./EmployerSecurityCenter").then((m) => m.EmployerSecurityCenter));
const EmployerNotificationPrefs = dynamic(() => import("./EmployerNotificationPrefs").then((m) => m.EmployerNotificationPrefs));
const EmployerSupportHub = dynamic(() => import("./EmployerSupportHub").then((m) => m.EmployerSupportHub));
const EmployerLdDashboard = dynamic(() => import("./EmployerLdDashboard").then((m) => m.EmployerLdDashboard));
const EmployerAssignLearning = dynamic(() => import("./EmployerAssignLearning").then((m) => m.EmployerAssignLearning));
const EmployerEmployeeLearning = dynamic(() => import("./EmployerEmployeeLearning").then((m) => m.EmployerEmployeeLearning));
const EmployerComplianceTraining = dynamic(() => import("./EmployerComplianceTraining").then((m) => m.EmployerComplianceTraining));
const EmployerSkillGaps = dynamic(() => import("./EmployerSkillGaps").then((m) => m.EmployerSkillGaps));
const EmployerTrainingRoi = dynamic(() => import("./EmployerTrainingRoi").then((m) => m.EmployerTrainingRoi));

// Transaction pages (CROSS-TXN)
const EmployerWallet = dynamic(() => import("./EmployerWallet").then((m) => m.EmployerWallet));
const EmployerTransactions = dynamic(() => import("./EmployerTransactions").then((m) => m.EmployerTransactions));
const EmployerSettlements = dynamic(() => import("./EmployerSettlements").then((m) => m.EmployerSettlements));

// Cross-portal partner integration pages (CROSS-INTEGRATE)
const EmployerPartnerTalent = dynamic(() => import("./EmployerPartnerTalent").then((m) => m.EmployerPartnerTalent));
const EmployerPartnerServices = dynamic(() => import("./EmployerPartnerServices").then((m) => m.EmployerPartnerServices));

// Talent Solutions pages (TS-CROSS)
const EmployerTalentSolutions = dynamic(() => import("./EmployerTalentSolutions").then((m) => m.EmployerTalentSolutions));
const EmployerTsPrograms = dynamic(() => import("./EmployerTsPrograms").then((m) => m.EmployerTsPrograms));
const EmployerTsTransactions = dynamic(() => import("./EmployerTsTransactions").then((m) => m.EmployerTsTransactions));

// Enterprise Governance pages (merged from the former Enterprise Portal)
const EnterpriseOverview = dynamic(() => import("@/portals/enterprise/EnterpriseOverview").then((m) => m.EnterpriseOverview));
const EnterpriseEntities = dynamic(() => import("@/portals/enterprise/EnterpriseEntities").then((m) => m.EnterpriseEntities));
const EnterpriseTeams = dynamic(() => import("@/portals/enterprise/EnterpriseTeams").then((m) => m.EnterpriseTeams));
const EnterpriseHeadcount = dynamic(() => import("@/portals/enterprise/EnterpriseHeadcount").then((m) => m.EnterpriseHeadcount));
const EnterpriseBudgets = dynamic(() => import("@/portals/enterprise/EnterpriseBudgets").then((m) => m.EnterpriseBudgets));
const EnterpriseTalentPool = dynamic(() => import("@/portals/enterprise/EnterpriseTalentPool").then((m) => m.EnterpriseTalentPool));
const EnterpriseApprovals = dynamic(() => import("@/portals/enterprise/EnterpriseApprovals").then((m) => m.EnterpriseApprovals));
const EnterpriseAnalytics = dynamic(() => import("@/portals/enterprise/EnterpriseAnalytics").then((m) => m.EnterpriseAnalytics));
const EnterpriseAccess = dynamic(() => import("@/portals/enterprise/EnterpriseAccess").then((m) => m.EnterpriseAccess));
const EnterpriseAudit = dynamic(() => import("@/portals/enterprise/EnterpriseAudit").then((m) => m.EnterpriseAudit));
const EnterpriseSSO = dynamic(() => import("@/portals/enterprise/EnterpriseSSO").then((m) => m.EnterpriseSSO));
const EnterpriseBilling = dynamic(() => import("@/portals/enterprise/EnterpriseBilling").then((m) => m.EnterpriseBilling));
const EnterpriseSettings = dynamic(() => import("@/portals/enterprise/EnterpriseSettings").then((m) => m.EnterpriseSettings));

// Cross-portal shared pages (SETTINGS-SUPPORT-SHARED)
const TasksPage = dynamic(() => import("@/portals/_settings-support-shared/TasksPage").then((m) => m.TasksPage));

export function PortalRouter() {
  const { route } = useNav();
  return <>{render(route)}</>;
}

export function render(route: string): React.ReactNode {
  const root = route.split("/")[0] ?? "overview";
  switch (root) {
    case "overview": return <EmployerOverview />;
    case "tasks": return <TasksPage portal="employer" />;
    case "company-profile": return <EmployerCompanyProfile />;
    case "branding": return <EmployerBranding />;
    case "jobs": return <EmployerJobs />;
    case "create-job": return <EmployerCreateJob />;
    case "templates": return <EmployerTemplates />;
    case "applicants": return <EmployerApplicants />;
    case "pipeline": return <EmployerPipeline />;
    case "talent-search": return <EmployerTalentSearch />;
    case "talent-pool": return <EmployerTalentPool />;
    case "shortlists": return <EmployerShortlists />;
    case "assessments": return <EmployerAssessments />;
    case "interviews": return <EmployerInterviews />;
    case "offers": return <EmployerOffers />;
    case "hires": return <EmployerHires />;
    case "team": return <EmployerTeam />;
    case "analytics": return <EmployerAnalytics />;
    case "subscription": return <EmployerSubscription />;
    case "integrations": return <EmployerIntegrations />;
    case "messages": return <EmployerMessages />;
    case "settings": return <EmployerSettings />;
    case "support": return <EmployerSupport />;
    // Settings & Support hub pages (SETTINGS-SUPPORT)
    case "settings-hub": return <EmployerSettingsHub />;
    case "security-center": return <EmployerSecurityCenter />;
    case "notification-preferences": return <EmployerNotificationPrefs />;
    case "support-hub": return <EmployerSupportHub />;
    case "ld-dashboard": return <EmployerLdDashboard />;
    case "assign-learning": return <EmployerAssignLearning />;
    case "employee-learning": return <EmployerEmployeeLearning />;
    case "compliance-training": return <EmployerComplianceTraining />;
    case "skill-gaps": return <EmployerSkillGaps />;
    case "training-roi": return <EmployerTrainingRoi />;
    // Transaction pages (CROSS-TXN)
    case "emp-wallet": return <EmployerWallet />;
    case "emp-transactions": return <EmployerTransactions />;
    case "emp-settlements": return <EmployerSettlements />;
    // Cross-portal partner integration (CROSS-INTEGRATE)
    case "partner-talent": return <EmployerPartnerTalent />;
    case "partner-services": return <EmployerPartnerServices />;
    // Talent Solutions (TS-CROSS)
    case "ts-hub": return <EmployerTalentSolutions />;
    case "ts-programs": return <EmployerTsPrograms />;
    case "ts-transactions": return <EmployerTsTransactions />;
    // Enterprise Governance (merged from the former Enterprise Portal)
    case "ent-overview": return <EnterpriseOverview />;
    case "ent-entities": return <EnterpriseEntities />;
    case "ent-teams": return <EnterpriseTeams />;
    case "ent-headcount": return <EnterpriseHeadcount />;
    case "ent-budgets": return <EnterpriseBudgets />;
    case "ent-talent-pool": return <EnterpriseTalentPool />;
    case "ent-approvals": return <EnterpriseApprovals />;
    case "ent-analytics": return <EnterpriseAnalytics />;
    case "ent-access": return <EnterpriseAccess />;
    case "ent-audit": return <EnterpriseAudit />;
    case "ent-sso": return <EnterpriseSSO />;
    case "ent-billing": return <EnterpriseBilling />;
    case "ent-settings": return <EnterpriseSettings />;
    default: return <EmployerOverview />;
  }
}
