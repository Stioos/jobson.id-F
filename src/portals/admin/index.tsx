"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

// Legacy admin pages (kept for backward compatibility)

// Super Admin pages (sa-* routes)
const SuperAdminOverview = dynamic(() => import("./SuperAdminOverview").then((m) => m.SuperAdminOverview));
const SuperAdminTenants = dynamic(() => import("./SuperAdminTenants").then((m) => m.SuperAdminTenants));
const SuperAdminPortalSettings = dynamic(() => import("./SuperAdminPortalSettings").then((m) => m.SuperAdminPortalSettings));
const SuperAdminFeatureFlags = dynamic(() => import("./SuperAdminFeatureFlags").then((m) => m.SuperAdminFeatureFlags));
const SuperAdminMaintenance = dynamic(() => import("./SuperAdminMaintenance").then((m) => m.SuperAdminMaintenance));
const SuperAdminHealth = dynamic(() => import("./SuperAdminHealth").then((m) => m.SuperAdminHealth));
const SuperAdminUsersAll = dynamic(() => import("./SuperAdminUsersAll").then((m) => m.SuperAdminUsersAll));
const SuperAdminUsersCandidates = dynamic(() => import("./SuperAdminUsersCandidates").then((m) => m.SuperAdminUsersCandidates));
const SuperAdminUsersEmployers = dynamic(() => import("./SuperAdminUsersEmployers").then((m) => m.SuperAdminUsersEmployers));
const SuperAdminUsersRecruiters = dynamic(() => import("./SuperAdminUsersRecruiters").then((m) => m.SuperAdminUsersRecruiters));
const SuperAdminUsersTraining = dynamic(() => import("./SuperAdminUsersTraining").then((m) => m.SuperAdminUsersTraining));
const SuperAdminUsersPartners = dynamic(() => import("./SuperAdminUsersPartners").then((m) => m.SuperAdminUsersPartners));
const SuperAdminRolesHierarchy = dynamic(() => import("./SuperAdminRolesHierarchy").then((m) => m.SuperAdminRolesHierarchy));
const SuperAdminImpersonation = dynamic(() => import("./SuperAdminImpersonation").then((m) => m.SuperAdminImpersonation));
const SuperAdminAnalytics = dynamic(() => import("./SuperAdminAnalytics").then((m) => m.SuperAdminAnalytics));
const SuperAdminGrowth = dynamic(() => import("./SuperAdminGrowth").then((m) => m.SuperAdminGrowth));
const SuperAdminFunnels = dynamic(() => import("./SuperAdminFunnels").then((m) => m.SuperAdminFunnels));
const SuperAdminRevenueAnalytics = dynamic(() => import("./SuperAdminRevenueAnalytics").then((m) => m.SuperAdminRevenueAnalytics));
const SuperAdminCohorts = dynamic(() => import("./SuperAdminCohorts").then((m) => m.SuperAdminCohorts));
const SuperAdminTxnAll = dynamic(() => import("./SuperAdminTxnAll").then((m) => m.SuperAdminTxnAll));
const SuperAdminRevenue = dynamic(() => import("./SuperAdminRevenue").then((m) => m.SuperAdminRevenue));
const SuperAdminInvoices = dynamic(() => import("./SuperAdminInvoices").then((m) => m.SuperAdminInvoices));
const SuperAdminPayouts = dynamic(() => import("./SuperAdminPayouts").then((m) => m.SuperAdminPayouts));
const SuperAdminRefunds = dynamic(() => import("./SuperAdminRefunds").then((m) => m.SuperAdminRefunds));
const SuperAdminTax = dynamic(() => import("./SuperAdminTax").then((m) => m.SuperAdminTax));
const SuperAdminPlansPricing = dynamic(() => import("./SuperAdminPlansPricing").then((m) => m.SuperAdminPlansPricing));
const SuperAdminJobTaxonomy = dynamic(() => import("./SuperAdminJobTaxonomy").then((m) => m.SuperAdminJobTaxonomy));
const SuperAdminSkillTaxonomy = dynamic(() => import("./SuperAdminSkillTaxonomy").then((m) => m.SuperAdminSkillTaxonomy));
const SuperAdminCourses = dynamic(() => import("./SuperAdminCourses").then((m) => m.SuperAdminCourses));
const SuperAdminCms = dynamic(() => import("./SuperAdminCms").then((m) => m.SuperAdminCms));
const SuperAdminTemplates = dynamic(() => import("./SuperAdminTemplates").then((m) => m.SuperAdminTemplates));
const SuperAdminJobModeration = dynamic(() => import("./SuperAdminJobModeration").then((m) => m.SuperAdminJobModeration));
const SuperAdminAudit = dynamic(() => import("./SuperAdminAudit").then((m) => m.SuperAdminAudit));
const SuperAdminAccessControl = dynamic(() => import("./SuperAdminAccessControl").then((m) => m.SuperAdminAccessControl));
const SuperAdminPrivacy = dynamic(() => import("./SuperAdminPrivacy").then((m) => m.SuperAdminPrivacy));
const SuperAdminSecurityAlerts = dynamic(() => import("./SuperAdminSecurityAlerts").then((m) => m.SuperAdminSecurityAlerts));
const SuperAdminApiKeys = dynamic(() => import("./SuperAdminApiKeys").then((m) => m.SuperAdminApiKeys));
const SuperAdminSessions = dynamic(() => import("./SuperAdminSessions").then((m) => m.SuperAdminSessions));
const SuperAdminPartnerApplications = dynamic(() => import("./SuperAdminPartnerApplications").then((m) => m.SuperAdminPartnerApplications));
const SuperAdminPartnerDirectory = dynamic(() => import("./SuperAdminPartnerDirectory").then((m) => m.SuperAdminPartnerDirectory));
const SuperAdminPartnerPerformance = dynamic(() => import("./SuperAdminPartnerPerformance").then((m) => m.SuperAdminPartnerPerformance));
const SuperAdminRevenueSplits = dynamic(() => import("./SuperAdminRevenueSplits").then((m) => m.SuperAdminRevenueSplits));
const SuperAdminMou = dynamic(() => import("./SuperAdminMou").then((m) => m.SuperAdminMou));
const SuperAdminAnnouncements = dynamic(() => import("./SuperAdminAnnouncements").then((m) => m.SuperAdminAnnouncements));
const SuperAdminEmailCampaigns = dynamic(() => import("./SuperAdminEmailCampaigns").then((m) => m.SuperAdminEmailCampaigns));
const SuperAdminPush = dynamic(() => import("./SuperAdminPush").then((m) => m.SuperAdminPush));
const SuperAdminSms = dynamic(() => import("./SuperAdminSms").then((m) => m.SuperAdminSms));
const SuperAdminWhatsapp = dynamic(() => import("./SuperAdminWhatsapp").then((m) => m.SuperAdminWhatsapp));
const SuperAdminTickets = dynamic(() => import("./SuperAdminTickets").then((m) => m.SuperAdminTickets));
const SuperAdminSla = dynamic(() => import("./SuperAdminSla").then((m) => m.SuperAdminSla));
const SuperAdminIncidents = dynamic(() => import("./SuperAdminIncidents").then((m) => m.SuperAdminIncidents));
const SuperAdminKb = dynamic(() => import("./SuperAdminKb").then((m) => m.SuperAdminKb));
const SuperAdminStatusPage = dynamic(() => import("./SuperAdminStatusPage").then((m) => m.SuperAdminStatusPage));
const SuperAdminIntegrations = dynamic(() => import("./SuperAdminIntegrations").then((m) => m.SuperAdminIntegrations));
const SuperAdminApi = dynamic(() => import("./SuperAdminApi").then((m) => m.SuperAdminApi));
const SuperAdminWebhooks = dynamic(() => import("./SuperAdminWebhooks").then((m) => m.SuperAdminWebhooks));
const SuperAdminAiConfig = dynamic(() => import("./SuperAdminAiConfig").then((m) => m.SuperAdminAiConfig));
const SuperAdminBackups = dynamic(() => import("./SuperAdminBackups").then((m) => m.SuperAdminBackups));
const SuperAdminSystemConfig = dynamic(() => import("./SuperAdminSystemConfig").then((m) => m.SuperAdminSystemConfig));
const SuperAdminSettingsHub = dynamic(() => import("./SuperAdminSettingsHub").then((m) => m.SuperAdminSettingsHub));
const SuperAdminSecurityCenter = dynamic(() => import("./SuperAdminSecurityCenter").then((m) => m.SuperAdminSecurityCenter));
const SuperAdminNotificationPrefs = dynamic(() => import("./SuperAdminNotificationPrefs").then((m) => m.SuperAdminNotificationPrefs));

// Cross-portal shared pages
const TasksPage = dynamic(() => import("@/portals/_settings-support-shared/TasksPage").then((m) => m.TasksPage));

export function PortalRouter() {
  const { route } = useNav();
  return <>{render(route)}</>;
}

export function render(route: string): React.ReactNode {
  const root = (route || "sa-overview").split("/")[0];
  switch (root) {
    // Tasks (shared)
    case "tasks": return <TasksPage portal="admin" route={route} />;

    // Governance
    case "sa-overview": return <SuperAdminOverview />;
    case "sa-tenants": return <SuperAdminTenants />;
    case "sa-portal-settings": return <SuperAdminPortalSettings />;
    case "sa-feature-flags": return <SuperAdminFeatureFlags />;
    case "sa-maintenance": return <SuperAdminMaintenance />;
    case "sa-health": return <SuperAdminHealth />;

    // Users & Orgs
    case "sa-users-all": return <SuperAdminUsersAll />;
    case "sa-users-candidates": return <SuperAdminUsersCandidates />;
    case "sa-users-employers": return <SuperAdminUsersEmployers />;
    case "sa-users-recruiters": return <SuperAdminUsersRecruiters />;
    case "sa-users-training": return <SuperAdminUsersTraining />;
    case "sa-users-partners": return <SuperAdminUsersPartners />;
    case "sa-roles-hierarchy": return <SuperAdminRolesHierarchy />;
    case "sa-impersonation": return <SuperAdminImpersonation />;

    // Analytics
    case "sa-analytics": return <SuperAdminAnalytics />;
    case "sa-growth": return <SuperAdminGrowth />;
    case "sa-funnels": return <SuperAdminFunnels />;
    case "sa-revenue-analytics": return <SuperAdminRevenueAnalytics />;
    case "sa-cohorts": return <SuperAdminCohorts />;

    // Finance
    case "sa-txn-all": return <SuperAdminTxnAll />;
    case "sa-revenue": return <SuperAdminRevenue />;
    case "sa-invoices": return <SuperAdminInvoices />;
    case "sa-payouts": return <SuperAdminPayouts />;
    case "sa-refunds": return <SuperAdminRefunds />;
    case "sa-tax": return <SuperAdminTax />;
    case "sa-plans-pricing": return <SuperAdminPlansPricing />;

    // Content
    case "sa-job-taxonomy": return <SuperAdminJobTaxonomy />;
    case "sa-skill-taxonomy": return <SuperAdminSkillTaxonomy />;
    case "sa-courses": return <SuperAdminCourses />;
    case "sa-cms": return <SuperAdminCms />;
    case "sa-templates": return <SuperAdminTemplates />;
    case "sa-job-moderation": return <SuperAdminJobModeration />;

    // Security
    case "sa-audit": return <SuperAdminAudit />;
    case "sa-access-control": return <SuperAdminAccessControl />;
    case "sa-privacy": return <SuperAdminPrivacy />;
    case "sa-security-alerts": return <SuperAdminSecurityAlerts />;
    case "sa-api-keys": return <SuperAdminApiKeys />;
    case "sa-sessions": return <SuperAdminSessions />;

    // Partners
    case "sa-partner-applications": return <SuperAdminPartnerApplications />;
    case "sa-partner-directory": return <SuperAdminPartnerDirectory />;
    case "sa-partner-performance": return <SuperAdminPartnerPerformance />;
    case "sa-revenue-splits": return <SuperAdminRevenueSplits />;
    case "sa-mou": return <SuperAdminMou />;

    // Comms
    case "sa-announcements": return <SuperAdminAnnouncements />;
    case "sa-email-campaigns": return <SuperAdminEmailCampaigns />;
    case "sa-push": return <SuperAdminPush />;
    case "sa-sms": return <SuperAdminSms />;
    case "sa-whatsapp": return <SuperAdminWhatsapp />;

    // Ops
    case "sa-tickets": return <SuperAdminTickets />;
    case "sa-sla": return <SuperAdminSla />;
    case "sa-incidents": return <SuperAdminIncidents />;
    case "sa-kb": return <SuperAdminKb />;
    case "sa-status-page": return <SuperAdminStatusPage />;

    // System
    case "sa-integrations": return <SuperAdminIntegrations />;
    case "sa-api": return <SuperAdminApi />;
    case "sa-webhooks": return <SuperAdminWebhooks />;
    case "sa-ai-config": return <SuperAdminAiConfig />;
    case "sa-backups": return <SuperAdminBackups />;
    case "sa-system-config": return <SuperAdminSystemConfig />;

    // Settings
    case "sa-settings-hub": return <SuperAdminSettingsHub />;
    case "sa-security-center": return <SuperAdminSecurityCenter />;
    case "sa-notification-preferences": return <SuperAdminNotificationPrefs />;

    // Legacy fallback (old routes that may still be linked)
    case "overview":
    case "home":
    case "":
      return <SuperAdminOverview />;

    default: return <SuperAdminOverview />;
  }
}
