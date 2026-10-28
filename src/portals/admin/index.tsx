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

// Hiring Oversight
const SuperAdminJobsAll = dynamic(() => import("./SuperAdminJobsAll").then((m) => m.SuperAdminJobsAll));
const SuperAdminHiringPipeline = dynamic(() => import("./SuperAdminHiringPipeline").then((m) => m.SuperAdminHiringPipeline));
const SuperAdminInterviewsOversight = dynamic(() => import("./SuperAdminInterviewsOversight").then((m) => m.SuperAdminInterviewsOversight));
const SuperAdminOffersRegistry = dynamic(() => import("./SuperAdminOffersRegistry").then((m) => m.SuperAdminOffersRegistry));
const SuperAdminPlacementsRegistry = dynamic(() => import("./SuperAdminPlacementsRegistry").then((m) => m.SuperAdminPlacementsRegistry));
const SuperAdminBgvOversight = dynamic(() => import("./SuperAdminBgvOversight").then((m) => m.SuperAdminBgvOversight));
const SuperAdminReferenceChecks = dynamic(() => import("./SuperAdminReferenceChecks").then((m) => m.SuperAdminReferenceChecks));
const SuperAdminOfferEsignOversight = dynamic(() => import("./SuperAdminOfferEsignOversight").then((m) => m.SuperAdminOfferEsignOversight));
const SuperAdminRescheduleDisputes = dynamic(() => import("./SuperAdminRescheduleDisputes").then((m) => m.SuperAdminRescheduleDisputes));
const SuperAdminOfferNegotiationOversight = dynamic(() => import("./SuperAdminOfferNegotiationOversight").then((m) => m.SuperAdminOfferNegotiationOversight));
const SuperAdminGuaranteeTracking = dynamic(() => import("./SuperAdminGuaranteeTracking").then((m) => m.SuperAdminGuaranteeTracking));
const SuperAdminRejectionAudit = dynamic(() => import("./SuperAdminRejectionAudit").then((m) => m.SuperAdminRejectionAudit));
const SuperAdminHiringFunnel = dynamic(() => import("./SuperAdminHiringFunnel").then((m) => m.SuperAdminHiringFunnel));

// Talent Oversight
const SuperAdminTalentDirectory = dynamic(() => import("./SuperAdminTalentDirectory").then((m) => m.SuperAdminTalentDirectory));
const SuperAdminTalentDedup = dynamic(() => import("./SuperAdminTalentDedup").then((m) => m.SuperAdminTalentDedup));
const SuperAdminAiMatchAudit = dynamic(() => import("./SuperAdminAiMatchAudit").then((m) => m.SuperAdminAiMatchAudit));
const SuperAdminResumeParserOversight = dynamic(() => import("./SuperAdminResumeParserOversight").then((m) => m.SuperAdminResumeParserOversight));
const SuperAdminSearchAudit = dynamic(() => import("./SuperAdminSearchAudit").then((m) => m.SuperAdminSearchAudit));
const SuperAdminBooleanSearchOversight = dynamic(() => import("./SuperAdminBooleanSearchOversight").then((m) => m.SuperAdminBooleanSearchOversight));
const SuperAdminTalentPoolOversight = dynamic(() => import("./SuperAdminTalentPoolOversight").then((m) => m.SuperAdminTalentPoolOversight));
const SuperAdminSourcingCampaigns = dynamic(() => import("./SuperAdminSourcingCampaigns").then((m) => m.SuperAdminSourcingCampaigns));
const SuperAdminHotlistsOversight = dynamic(() => import("./SuperAdminHotlistsOversight").then((m) => m.SuperAdminHotlistsOversight));
const SuperAdminCandidateLifecycle = dynamic(() => import("./SuperAdminCandidateLifecycle").then((m) => m.SuperAdminCandidateLifecycle));
const SuperAdminTalentAnalytics = dynamic(() => import("./SuperAdminTalentAnalytics").then((m) => m.SuperAdminTalentAnalytics));

// Learning Oversight pages
const SuperAdminCertificationsRegistry = dynamic(() => import("./SuperAdminCertificationsRegistry").then((m) => m.SuperAdminCertificationsRegistry));
const SuperAdminCredentialsVerification = dynamic(() => import("./SuperAdminCredentialsVerification").then((m) => m.SuperAdminCredentialsVerification));
const SuperAdminCurriculumOversight = dynamic(() => import("./SuperAdminCurriculumOversight").then((m) => m.SuperAdminCurriculumOversight));
const SuperAdminCohortsDirectory = dynamic(() => import("./SuperAdminCohortsDirectory").then((m) => m.SuperAdminCohortsDirectory));
const SuperAdminTrainersDirectory = dynamic(() => import("./SuperAdminTrainersDirectory").then((m) => m.SuperAdminTrainersDirectory));
const SuperAdminAssessmentsOversight = dynamic(() => import("./SuperAdminAssessmentsOversight").then((m) => m.SuperAdminAssessmentsOversight));
const SuperAdminGradebookAudit = dynamic(() => import("./SuperAdminGradebookAudit").then((m) => m.SuperAdminGradebookAudit));
const SuperAdminAttendanceOversight = dynamic(() => import("./SuperAdminAttendanceOversight").then((m) => m.SuperAdminAttendanceOversight));
const SuperAdminLearningAnalytics = dynamic(() => import("./SuperAdminLearningAnalytics").then((m) => m.SuperAdminLearningAnalytics));

// Process Oversight pages
const SuperAdminApprovalEngine = dynamic(() => import("./SuperAdminApprovalEngine").then((m) => m.SuperAdminApprovalEngine));
const SuperAdminEsignOversight = dynamic(() => import("./SuperAdminEsignOversight").then((m) => m.SuperAdminEsignOversight));
const SuperAdminProbationOversight = dynamic(() => import("./SuperAdminProbationOversight").then((m) => m.SuperAdminProbationOversight));
const SuperAdminExitOversight = dynamic(() => import("./SuperAdminExitOversight").then((m) => m.SuperAdminExitOversight));
const SuperAdminPerformanceOversight = dynamic(() => import("./SuperAdminPerformanceOversight").then((m) => m.SuperAdminPerformanceOversight));
const SuperAdminLeaveOversight = dynamic(() => import("./SuperAdminLeaveOversight").then((m) => m.SuperAdminLeaveOversight));
const SuperAdminOnboardingOversight = dynamic(() => import("./SuperAdminOnboardingOversight").then((m) => m.SuperAdminOnboardingOversight));
const SuperAdminEnrollmentOversight = dynamic(() => import("./SuperAdminEnrollmentOversight").then((m) => m.SuperAdminEnrollmentOversight));
const SuperAdminTrainerAllocationOversight = dynamic(() => import("./SuperAdminTrainerAllocationOversight").then((m) => m.SuperAdminTrainerAllocationOversight));

// Wave 6 — Comms gap pages
const SuperAdminMessageAudit = dynamic(() => import("./SuperAdminMessageAudit").then((m) => m.SuperAdminMessageAudit));
const SuperAdminEmailDeliverability = dynamic(() => import("./SuperAdminEmailDeliverability").then((m) => m.SuperAdminEmailDeliverability));
const SuperAdminSmsDltCompliance = dynamic(() => import("./SuperAdminSmsDltCompliance").then((m) => m.SuperAdminSmsDltCompliance));
const SuperAdminWhatsappOversight = dynamic(() => import("./SuperAdminWhatsappOversight").then((m) => m.SuperAdminWhatsappOversight));
const SuperAdminCommsAnalytics = dynamic(() => import("./SuperAdminCommsAnalytics").then((m) => m.SuperAdminCommsAnalytics));
const SuperAdminTemplateApproval = dynamic(() => import("./SuperAdminTemplateApproval").then((m) => m.SuperAdminTemplateApproval));

// Wave 6 — System gap pages
const SuperAdminCronMonitor = dynamic(() => import("./SuperAdminCronMonitor").then((m) => m.SuperAdminCronMonitor));
const SuperAdminQueueMonitor = dynamic(() => import("./SuperAdminQueueMonitor").then((m) => m.SuperAdminQueueMonitor));
const SuperAdminLogAggregation = dynamic(() => import("./SuperAdminLogAggregation").then((m) => m.SuperAdminLogAggregation));
const SuperAdminDnsManagement = dynamic(() => import("./SuperAdminDnsManagement").then((m) => m.SuperAdminDnsManagement));
const SuperAdminSslCertificates = dynamic(() => import("./SuperAdminSslCertificates").then((m) => m.SuperAdminSslCertificates));
const SuperAdminCacheManagement = dynamic(() => import("./SuperAdminCacheManagement").then((m) => m.SuperAdminCacheManagement));
const SuperAdminCdnConfig = dynamic(() => import("./SuperAdminCdnConfig").then((m) => m.SuperAdminCdnConfig));
const SuperAdminDatabaseAdmin = dynamic(() => import("./SuperAdminDatabaseAdmin").then((m) => m.SuperAdminDatabaseAdmin));

// Wave 6 — Partner gap pages
const SuperAdminCollegeDirectory = dynamic(() => import("./SuperAdminCollegeDirectory").then((m) => m.SuperAdminCollegeDirectory));
const SuperAdminStudentRegistry = dynamic(() => import("./SuperAdminStudentRegistry").then((m) => m.SuperAdminStudentRegistry));
const SuperAdminPartnerCompliance = dynamic(() => import("./SuperAdminPartnerCompliance").then((m) => m.SuperAdminPartnerCompliance));
const SuperAdminRenewalForecastPlatform = dynamic(() => import("./SuperAdminRenewalForecastPlatform").then((m) => m.SuperAdminRenewalForecastPlatform));

// Finance gap pages
const SuperAdminFraudDetection = dynamic(() => import("./SuperAdminFraudDetection").then((m) => m.SuperAdminFraudDetection));
const SuperAdminWalletFreeze = dynamic(() => import("./SuperAdminWalletFreeze").then((m) => m.SuperAdminWalletFreeze));
const SuperAdminTxnReversal = dynamic(() => import("./SuperAdminTxnReversal").then((m) => m.SuperAdminTxnReversal));
const SuperAdminReconciliation = dynamic(() => import("./SuperAdminReconciliation").then((m) => m.SuperAdminReconciliation));
const SuperAdminCommissionDisputes = dynamic(() => import("./SuperAdminCommissionDisputes").then((m) => m.SuperAdminCommissionDisputes));
const SuperAdminGstCompliance = dynamic(() => import("./SuperAdminGstCompliance").then((m) => m.SuperAdminGstCompliance));
const SuperAdminMultiCurrencyOversight = dynamic(() => import("./SuperAdminMultiCurrencyOversight").then((m) => m.SuperAdminMultiCurrencyOversight));
const SuperAdminPaymentGatewayHealth = dynamic(() => import("./SuperAdminPaymentGatewayHealth").then((m) => m.SuperAdminPaymentGatewayHealth));
const SuperAdminWalletLedger = dynamic(() => import("./SuperAdminWalletLedger").then((m) => m.SuperAdminWalletLedger));
const SuperAdminFinancialAudit = dynamic(() => import("./SuperAdminFinancialAudit").then((m) => m.SuperAdminFinancialAudit));

// Security gap pages
const SuperAdminConsentManagement = dynamic(() => import("./SuperAdminConsentManagement").then((m) => m.SuperAdminConsentManagement));
const SuperAdminDsar = dynamic(() => import("./SuperAdminDsar").then((m) => m.SuperAdminDsar));
const SuperAdminRtbf = dynamic(() => import("./SuperAdminRtbf").then((m) => m.SuperAdminRtbf));
const SuperAdminDataResidency = dynamic(() => import("./SuperAdminDataResidency").then((m) => m.SuperAdminDataResidency));
const SuperAdminKmsVault = dynamic(() => import("./SuperAdminKmsVault").then((m) => m.SuperAdminKmsVault));
const SuperAdminVulnerabilityScanner = dynamic(() => import("./SuperAdminVulnerabilityScanner").then((m) => m.SuperAdminVulnerabilityScanner));
const SuperAdminPenetrationTest = dynamic(() => import("./SuperAdminPenetrationTest").then((m) => m.SuperAdminPenetrationTest));
const SuperAdminCookieCompliance = dynamic(() => import("./SuperAdminCookieCompliance").then((m) => m.SuperAdminCookieCompliance));
const SuperAdminDataExportAudit = dynamic(() => import("./SuperAdminDataExportAudit").then((m) => m.SuperAdminDataExportAudit));
const SuperAdminIncidentResponse = dynamic(() => import("./SuperAdminIncidentResponse").then((m) => m.SuperAdminIncidentResponse));

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
    case "sa-fraud-detection": return <SuperAdminFraudDetection />;
    case "sa-wallet-freeze": return <SuperAdminWalletFreeze />;
    case "sa-txn-reversal": return <SuperAdminTxnReversal />;
    case "sa-reconciliation": return <SuperAdminReconciliation />;
    case "sa-commission-disputes": return <SuperAdminCommissionDisputes />;
    case "sa-gst-compliance": return <SuperAdminGstCompliance />;
    case "sa-multi-currency-oversight": return <SuperAdminMultiCurrencyOversight />;
    case "sa-payment-gateway-health": return <SuperAdminPaymentGatewayHealth />;
    case "sa-wallet-ledger": return <SuperAdminWalletLedger />;
    case "sa-financial-audit": return <SuperAdminFinancialAudit />;

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
    case "sa-consent-management": return <SuperAdminConsentManagement />;
    case "sa-dsar": return <SuperAdminDsar />;
    case "sa-rtbf": return <SuperAdminRtbf />;
    case "sa-data-residency": return <SuperAdminDataResidency />;
    case "sa-kms-vault": return <SuperAdminKmsVault />;
    case "sa-vulnerability-scanner": return <SuperAdminVulnerabilityScanner />;
    case "sa-penetration-test": return <SuperAdminPenetrationTest />;
    case "sa-cookie-compliance": return <SuperAdminCookieCompliance />;
    case "sa-data-export-audit": return <SuperAdminDataExportAudit />;
    case "sa-incident-response": return <SuperAdminIncidentResponse />;

    // Partners
    case "sa-partner-applications": return <SuperAdminPartnerApplications />;
    case "sa-partner-directory": return <SuperAdminPartnerDirectory />;
    case "sa-partner-performance": return <SuperAdminPartnerPerformance />;
    case "sa-revenue-splits": return <SuperAdminRevenueSplits />;
    case "sa-mou": return <SuperAdminMou />;
    case "sa-college-directory": return <SuperAdminCollegeDirectory />;
    case "sa-student-registry": return <SuperAdminStudentRegistry />;
    case "sa-partner-compliance": return <SuperAdminPartnerCompliance />;
    case "sa-renewal-forecast-platform": return <SuperAdminRenewalForecastPlatform />;

    // Comms
    case "sa-announcements": return <SuperAdminAnnouncements />;
    case "sa-email-campaigns": return <SuperAdminEmailCampaigns />;
    case "sa-push": return <SuperAdminPush />;
    case "sa-sms": return <SuperAdminSms />;
    case "sa-whatsapp": return <SuperAdminWhatsapp />;
    case "sa-message-audit": return <SuperAdminMessageAudit />;
    case "sa-email-deliverability": return <SuperAdminEmailDeliverability />;
    case "sa-sms-dlt-compliance": return <SuperAdminSmsDltCompliance />;
    case "sa-whatsapp-oversight": return <SuperAdminWhatsappOversight />;
    case "sa-comms-analytics": return <SuperAdminCommsAnalytics />;
    case "sa-template-approval": return <SuperAdminTemplateApproval />;

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
    case "sa-cron-monitor": return <SuperAdminCronMonitor />;
    case "sa-queue-monitor": return <SuperAdminQueueMonitor />;
    case "sa-log-aggregation": return <SuperAdminLogAggregation />;
    case "sa-dns-management": return <SuperAdminDnsManagement />;
    case "sa-ssl-certificates": return <SuperAdminSslCertificates />;
    case "sa-cache-management": return <SuperAdminCacheManagement />;
    case "sa-cdn-config": return <SuperAdminCdnConfig />;
    case "sa-database-admin": return <SuperAdminDatabaseAdmin />;

    // Settings
    case "sa-settings-hub": return <SuperAdminSettingsHub />;
    case "sa-security-center": return <SuperAdminSecurityCenter />;
    case "sa-notification-preferences": return <SuperAdminNotificationPrefs />;

    // Learning Oversight
    case "sa-certifications-registry": return <SuperAdminCertificationsRegistry />;
    case "sa-credentials-verification": return <SuperAdminCredentialsVerification />;
    case "sa-curriculum-oversight": return <SuperAdminCurriculumOversight />;
    case "sa-cohorts-directory": return <SuperAdminCohortsDirectory />;
    case "sa-trainers-directory": return <SuperAdminTrainersDirectory />;
    case "sa-assessments-oversight": return <SuperAdminAssessmentsOversight />;
    case "sa-gradebook-audit": return <SuperAdminGradebookAudit />;
    case "sa-attendance-oversight": return <SuperAdminAttendanceOversight />;
    case "sa-learning-analytics": return <SuperAdminLearningAnalytics />;

    // Process Oversight
    case "sa-approval-engine": return <SuperAdminApprovalEngine />;
    case "sa-esign-oversight": return <SuperAdminEsignOversight />;
    case "sa-probation-oversight": return <SuperAdminProbationOversight />;
    case "sa-exit-oversight": return <SuperAdminExitOversight />;
    case "sa-performance-oversight": return <SuperAdminPerformanceOversight />;
    case "sa-leave-oversight": return <SuperAdminLeaveOversight />;
    case "sa-onboarding-oversight": return <SuperAdminOnboardingOversight />;
    case "sa-enrollment-oversight": return <SuperAdminEnrollmentOversight />;
    case "sa-trainer-allocation-oversight": return <SuperAdminTrainerAllocationOversight />;

    // Hiring Oversight
    case "sa-jobs-all": return <SuperAdminJobsAll />;
    case "sa-hiring-pipeline": return <SuperAdminHiringPipeline />;
    case "sa-interviews-oversight": return <SuperAdminInterviewsOversight />;
    case "sa-offers-registry": return <SuperAdminOffersRegistry />;
    case "sa-placements-registry": return <SuperAdminPlacementsRegistry />;
    case "sa-bgv-oversight": return <SuperAdminBgvOversight />;
    case "sa-reference-checks": return <SuperAdminReferenceChecks />;
    case "sa-offer-esign-oversight": return <SuperAdminOfferEsignOversight />;
    case "sa-reschedule-disputes": return <SuperAdminRescheduleDisputes />;
    case "sa-offer-negotiation-oversight": return <SuperAdminOfferNegotiationOversight />;
    case "sa-guarantee-tracking": return <SuperAdminGuaranteeTracking />;
    case "sa-rejection-audit": return <SuperAdminRejectionAudit />;
    case "sa-hiring-funnel": return <SuperAdminHiringFunnel />;

    // Talent Oversight
    case "sa-talent-directory": return <SuperAdminTalentDirectory />;
    case "sa-talent-dedup": return <SuperAdminTalentDedup />;
    case "sa-ai-match-audit": return <SuperAdminAiMatchAudit />;
    case "sa-resume-parser-oversight": return <SuperAdminResumeParserOversight />;
    case "sa-search-audit": return <SuperAdminSearchAudit />;
    case "sa-boolean-search-oversight": return <SuperAdminBooleanSearchOversight />;
    case "sa-talent-pool-oversight": return <SuperAdminTalentPoolOversight />;
    case "sa-sourcing-campaigns": return <SuperAdminSourcingCampaigns />;
    case "sa-hotlists-oversight": return <SuperAdminHotlistsOversight />;
    case "sa-candidate-lifecycle": return <SuperAdminCandidateLifecycle />;
    case "sa-talent-analytics": return <SuperAdminTalentAnalytics />;

    // Legacy fallback (old routes that may still be linked)
    case "overview":
    case "home":
    case "":
      return <SuperAdminOverview />;

    default: return <SuperAdminOverview />;
  }
}
