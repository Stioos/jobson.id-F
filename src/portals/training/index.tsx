"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

// Every page is lazy-loaded via next/dynamic to keep the dev-server memory bounded
// (sandbox has a 4GB memory limit — compiling all page modules at once would OOM).
const TrainingOverview = dynamic(() => import("./TrainingOverview").then((m) => m.TrainingOverview));
const TrainingCompany = dynamic(() => import("./TrainingCompany").then((m) => m.TrainingCompany));
const TrainingClients = dynamic(() => import("./TrainingClients").then((m) => m.TrainingClients));
const TrainingPrograms = dynamic(() => import("./TrainingPrograms").then((m) => m.TrainingPrograms));
const TrainingContracts = dynamic(() => import("./TrainingContracts").then((m) => m.TrainingContracts));
const TrainingCourses = dynamic(() => import("./TrainingCourses").then((m) => m.TrainingCourses));
const TrainingCourseBuilder = dynamic(() => import("./TrainingCourseBuilder").then((m) => m.TrainingCourseBuilder));
const TrainingPaths = dynamic(() => import("./TrainingPaths").then((m) => m.TrainingPaths));
const TrainingContentLibrary = dynamic(() => import("./TrainingContentLibrary").then((m) => m.TrainingContentLibrary));
const TrainingMarketplace = dynamic(() => import("./TrainingMarketplace").then((m) => m.TrainingMarketplace));
const TrainingCohorts = dynamic(() => import("./TrainingCohorts").then((m) => m.TrainingCohorts));
const TrainingLiveTraining = dynamic(() => import("./TrainingLiveTraining").then((m) => m.TrainingLiveTraining));
const TrainingCalendar = dynamic(() => import("./TrainingCalendar").then((m) => m.TrainingCalendar));
const TrainingTrainers = dynamic(() => import("./TrainingTrainers").then((m) => m.TrainingTrainers));
const TrainingAssessments = dynamic(() => import("./TrainingAssessments").then((m) => m.TrainingAssessments));
const TrainingQuestionBank = dynamic(() => import("./TrainingQuestionBank").then((m) => m.TrainingQuestionBank));
const TrainingCertifications = dynamic(() => import("./TrainingCertifications").then((m) => m.TrainingCertifications));
const TrainingCertTemplates = dynamic(() => import("./TrainingCertTemplates").then((m) => m.TrainingCertTemplates));
const TrainingSkills = dynamic(() => import("./TrainingSkills").then((m) => m.TrainingSkills));
const TrainingSkillGaps = dynamic(() => import("./TrainingSkillGaps").then((m) => m.TrainingSkillGaps));
const TrainingCompliance = dynamic(() => import("./TrainingCompliance").then((m) => m.TrainingCompliance));
const TrainingEnrollments = dynamic(() => import("./TrainingEnrollments").then((m) => m.TrainingEnrollments));
const TrainingSurveys = dynamic(() => import("./TrainingSurveys").then((m) => m.TrainingSurveys));
// BUILD-TRAINING-FEATURES: 6 new high-impact training pages
const TrainingAttendance = dynamic(() => import("./TrainingAttendance").then((m) => m.TrainingAttendance));
const TrainingGradebook = dynamic(() => import("./TrainingGradebook").then((m) => m.TrainingGradebook));
const TrainingFeeCollection = dynamic(() => import("./TrainingFeeCollection").then((m) => m.TrainingFeeCollection));
const TrainingRefunds = dynamic(() => import("./TrainingRefunds").then((m) => m.TrainingRefunds));
const TrainingScholarships = dynamic(() => import("./TrainingScholarships").then((m) => m.TrainingScholarships));
const TrainingStudentMessaging = dynamic(() => import("./TrainingStudentMessaging").then((m) => m.TrainingStudentMessaging));

// Profile & 360° pages (WAVE1-RECRUITER-TRAINING-PROFILE)
const TrainingProviderProfile = dynamic(() => import("./TrainingProviderProfile").then((m) => m.TrainingProviderProfile));
const TrainingStudentProfile360 = dynamic(() => import("./TrainingStudentProfile360").then((m) => m.TrainingStudentProfile360));

// Curriculum & content authoring pages (WAVE2-RECRUITER-TRAINING-SOURCING)
const TrainingCurriculumDesigner = dynamic(() => import("./TrainingCurriculumDesigner").then((m) => m.TrainingCurriculumDesigner));
const TrainingGamification = dynamic(() => import("./TrainingGamification").then((m) => m.TrainingGamification));
const TrainingAutomation = dynamic(() => import("./TrainingAutomation").then((m) => m.TrainingAutomation));
const TrainingAiAssistant = dynamic(() => import("./TrainingAiAssistant").then((m) => m.TrainingAiAssistant));
const TrainingAnalytics = dynamic(() => import("./TrainingAnalytics").then((m) => m.TrainingAnalytics));
const TrainingBudgets = dynamic(() => import("./TrainingBudgets").then((m) => m.TrainingBudgets));
const TrainingInvoices = dynamic(() => import("./TrainingInvoices").then((m) => m.TrainingInvoices));
const TrainingIntegrations = dynamic(() => import("./TrainingIntegrations").then((m) => m.TrainingIntegrations));
const TrainingSettings = dynamic(() => import("./TrainingSettings").then((m) => m.TrainingSettings));
const TrainingSupport = dynamic(() => import("./TrainingSupport").then((m) => m.TrainingSupport));

// Process & lifecycle pages (WAVE3-RECRUITER-TRAINING-PARTNER-PROCESS)
const TrainingEnrollmentApproval = dynamic(() => import("./TrainingEnrollmentApproval").then((m) => m.TrainingEnrollmentApproval));
const TrainingTrainerAllocation = dynamic(() => import("./TrainingTrainerAllocation").then((m) => m.TrainingTrainerAllocation));
const TrainingCompletionTracker = dynamic(() => import("./TrainingCompletionTracker").then((m) => m.TrainingCompletionTracker));

// Transaction & finance pages (WAVE4-TRANSACTIONS-ALL-PORTALS)
const TrainingInvoiceRules = dynamic(() => import("./TrainingInvoiceRules").then((m) => m.TrainingInvoiceRules));
const TrainingCorporateSponsorship = dynamic(() => import("./TrainingCorporateSponsorship").then((m) => m.TrainingCorporateSponsorship));

// Communication pages (WAVE5-COMMUNICATION-ALL-PORTALS)
const TrainingParentPortal = dynamic(() => import("./TrainingParentPortal").then((m) => m.TrainingParentPortal));
const TrainingDiscussionForums = dynamic(() => import("./TrainingDiscussionForums").then((m) => m.TrainingDiscussionForums));
const TrainingAnnouncements = dynamic(() => import("./TrainingAnnouncements").then((m) => m.TrainingAnnouncements));

// Settings & Support hub pages (SETTINGS-SUPPORT)
const TrainingSettingsHub = dynamic(() => import("./TrainingSettingsHub").then((m) => m.TrainingSettingsHub));
const TrainingSecurityCenter = dynamic(() => import("./TrainingSecurityCenter").then((m) => m.TrainingSecurityCenter));
const TrainingNotificationPrefs = dynamic(() => import("./TrainingNotificationPrefs").then((m) => m.TrainingNotificationPrefs));
const TrainingSupportHub = dynamic(() => import("./TrainingSupportHub").then((m) => m.TrainingSupportHub));

// Interactive experiences & drill-down detail pages (T-INTERACTIVE)
const TrainingCoursePlayer = dynamic(() => import("./TrainingCoursePlayer").then((m) => m.TrainingCoursePlayer));
const TrainingExamPlayer = dynamic(() => import("./TrainingExamPlayer").then((m) => m.TrainingExamPlayer));
const TrainingCertificateVerify = dynamic(() => import("./TrainingCertificateVerify").then((m) => m.TrainingCertificateVerify));
const TrainingCohortDetail = dynamic(() => import("./TrainingCohortDetail").then((m) => m.TrainingCohortDetail));
const TrainingLiveSessionDetail = dynamic(() => import("./TrainingLiveSessionDetail").then((m) => m.TrainingLiveSessionDetail));
const TrainingApprovals = dynamic(() => import("./TrainingApprovals").then((m) => m.TrainingApprovals));
const TrainingAcademies = dynamic(() => import("./TrainingAcademies").then((m) => m.TrainingAcademies));
const TrainingProviders = dynamic(() => import("./TrainingProviders").then((m) => m.TrainingProviders));
const TrainingCampaigns = dynamic(() => import("./TrainingCampaigns").then((m) => m.TrainingCampaigns));
const TrainingReportsCenter = dynamic(() => import("./TrainingReportsCenter").then((m) => m.TrainingReportsCenter));
const TrainingDataExport = dynamic(() => import("./TrainingDataExport").then((m) => m.TrainingDataExport));
const TrainingAuditLogs = dynamic(() => import("./TrainingAuditLogs").then((m) => m.TrainingAuditLogs));

// Analytics deep-dive pages (T-ANALYTICS)
const TrainingCoursePerformance = dynamic(() => import("./TrainingCoursePerformance").then((m) => m.TrainingCoursePerformance));
const TrainingTrainerPerformance = dynamic(() => import("./TrainingTrainerPerformance").then((m) => m.TrainingTrainerPerformance));
const TrainingEngagementAnalytics = dynamic(() => import("./TrainingEngagementAnalytics").then((m) => m.TrainingEngagementAnalytics));
const TrainingDropoffAnalytics = dynamic(() => import("./TrainingDropoffAnalytics").then((m) => m.TrainingDropoffAnalytics));

// Talent Sourcing & Placements (T-TALENT)
const TrainingTalentSearch = dynamic(() => import("./TrainingTalentSearch").then((m) => m.TrainingTalentSearch));
const TrainingTalentPools = dynamic(() => import("./TrainingTalentPools").then((m) => m.TrainingTalentPools));
const TrainingSourcingRequests = dynamic(() => import("./TrainingSourcingRequests").then((m) => m.TrainingSourcingRequests));
const TrainingPlacements = dynamic(() => import("./TrainingPlacements").then((m) => m.TrainingPlacements));
const TrainingPartnerClients = dynamic(() => import("./TrainingPartnerClients").then((m) => m.TrainingPartnerClients));
const TrainingVerifyCredentials = dynamic(() => import("./TrainingVerifyCredentials").then((m) => m.TrainingVerifyCredentials));

// Platform Administration pages (merged from the former Admin Portal)
const AdminOverview = dynamic(() => import("@/portals/admin/AdminOverview").then((m) => m.AdminOverview));
const AdminUsers = dynamic(() => import("@/portals/admin/AdminUsers").then((m) => m.AdminUsers));
const AdminOrganizations = dynamic(() => import("@/portals/admin/AdminOrganizations").then((m) => m.AdminOrganizations));
const AdminVerification = dynamic(() => import("@/portals/admin/AdminVerification").then((m) => m.AdminVerification));
const AdminJobModeration = dynamic(() => import("@/portals/admin/AdminJobModeration").then((m) => m.AdminJobModeration));
const AdminRecruitmentMonitoring = dynamic(() => import("@/portals/admin/AdminRecruitmentMonitoring").then((m) => m.AdminRecruitmentMonitoring));
const AdminRoles = dynamic(() => import("@/portals/admin/AdminRoles").then((m) => m.AdminRoles));
const AdminAiConfig = dynamic(() => import("@/portals/admin/AdminAiConfig").then((m) => m.AdminAiConfig));
const AdminAssessments = dynamic(() => import("@/portals/admin/AdminAssessments").then((m) => m.AdminAssessments));
const AdminTraining = dynamic(() => import("@/portals/admin/AdminTraining").then((m) => m.AdminTraining));
const AdminPlans = dynamic(() => import("@/portals/admin/AdminPlans").then((m) => m.AdminPlans));
const AdminPricing = dynamic(() => import("@/portals/admin/AdminPricing").then((m) => m.AdminPricing));
const AdminPayments = dynamic(() => import("@/portals/admin/AdminPayments").then((m) => m.AdminPayments));
const AdminInvoices = dynamic(() => import("@/portals/admin/AdminInvoices").then((m) => m.AdminInvoices));
const AdminPromotions = dynamic(() => import("@/portals/admin/AdminPromotions").then((m) => m.AdminPromotions));
const AdminReferrals = dynamic(() => import("@/portals/admin/AdminReferrals").then((m) => m.AdminReferrals));
const AdminNotifications = dynamic(() => import("@/portals/admin/AdminNotifications").then((m) => m.AdminNotifications));
const AdminCms = dynamic(() => import("@/portals/admin/AdminCms").then((m) => m.AdminCms));
const AdminReports = dynamic(() => import("@/portals/admin/AdminReports").then((m) => m.AdminReports));
const AdminIntegrations = dynamic(() => import("@/portals/admin/AdminIntegrations").then((m) => m.AdminIntegrations));
const AdminApi = dynamic(() => import("@/portals/admin/AdminApi").then((m) => m.AdminApi));
const AdminAudit = dynamic(() => import("@/portals/admin/AdminAudit").then((m) => m.AdminAudit));
const AdminPrivacy = dynamic(() => import("@/portals/admin/AdminPrivacy").then((m) => m.AdminPrivacy));
const AdminSupport = dynamic(() => import("@/portals/admin/AdminSupport").then((m) => m.AdminSupport));
const AdminSettings = dynamic(() => import("@/portals/admin/AdminSettings").then((m) => m.AdminSettings));

// Transaction & Revenue pages (CROSS-TXN) — platform-wide revenue, payouts, monitoring
const AdminPlatformRevenue = dynamic(() => import("./AdminPlatformRevenue").then((m) => m.AdminPlatformRevenue));
const AdminPartnerPayouts = dynamic(() => import("./AdminPartnerPayouts").then((m) => m.AdminPartnerPayouts));
const AdminTransactionMonitoring = dynamic(() => import("./AdminTransactionMonitoring").then((m) => m.AdminTransactionMonitoring));

// Cross-portal partner integration pages (CROSS-INTEGRATE)
const AdminPartnerManagement = dynamic(() => import("./AdminPartnerManagement").then((m) => m.AdminPartnerManagement));
const AdminPartnerApplications = dynamic(() => import("./AdminPartnerApplications").then((m) => m.AdminPartnerApplications));
const AdminPartnerPerformance = dynamic(() => import("./AdminPartnerPerformance").then((m) => m.AdminPartnerPerformance));

// Talent Solutions pages (TS-ADMIN) — Train-to-Hire, Hire-to-Train, Corporate Training hub
const TsHub = dynamic(() => import("./TsHub").then((m) => m.TsHub));
const TsTrainToHire = dynamic(() => import("./TsTrainToHire").then((m) => m.TsTrainToHire));
const TsHireToTrain = dynamic(() => import("./TsHireToTrain").then((m) => m.TsHireToTrain));
const TsCorporateTraining = dynamic(() => import("./TsCorporateTraining").then((m) => m.TsCorporateTraining));

// Super Admin pages (TS-ADMIN) — User management, roles, hierarchy, audit, settings
const TsAdminUserManagement = dynamic(() => import("./AdminUserManagement").then((m) => m.AdminUserManagement));
const TsAdminRoles = dynamic(() => import("./AdminRoles").then((m) => m.AdminRoles));
const TsAdminUserHierarchy = dynamic(() => import("./AdminUserHierarchy").then((m) => m.AdminUserHierarchy));
const TsAdminAuditLogs = dynamic(() => import("./AdminAuditLogs").then((m) => m.AdminAuditLogs));
const TsAdminSystemSettings = dynamic(() => import("./AdminSystemSettings").then((m) => m.AdminSystemSettings));

// Transaction & Communication pages (TS-ADMIN)
const TransactionHub = dynamic(() => import("./TransactionHub").then((m) => m.TransactionHub));
const TransactionList = dynamic(() => import("./TransactionList").then((m) => m.TransactionList));
const TransactionDetail = dynamic(() => import("./TransactionDetail").then((m) => m.TransactionDetail));
const BillingCenter = dynamic(() => import("./BillingCenter").then((m) => m.BillingCenter));
const PaymentGateway = dynamic(() => import("./PaymentGateway").then((m) => m.PaymentGateway));
const SettlementEngine = dynamic(() => import("./SettlementEngine").then((m) => m.SettlementEngine));
const TransactionCommunications = dynamic(() => import("./TransactionCommunications").then((m) => m.TransactionCommunications));

// Cross-portal shared pages (SETTINGS-SUPPORT-SHARED)
const TasksWorkspace = dynamic(() => import("@/portals/_settings-support-shared/TasksWorkspace").then((m) => m.TasksWorkspace));

export function PortalRouter() {
  const { route } = useNav();
  return <>{render(route)}</>;
}

export function render(route: string): React.ReactNode {
  const root = (route || "overview").split("/")[0];
  switch (root) {
    case "overview":
    case "home":
    case "":
      return <TrainingOverview />;
    case "tasks": return <TasksWorkspace portal="training" route={route} />;
    case "company": return <TrainingCompany />;
    case "clients": return <TrainingClients />;
    case "programs": return <TrainingPrograms />;
    case "contracts": return <TrainingContracts />;
    case "courses": {
      const parts = (route || "courses").split("/");
      if (parts[2] === "learn" && parts[1]) return <TrainingCoursePlayer courseId={parts[1]} />;
      return <TrainingCourses />;
    }
    case "course-builder": return <TrainingCourseBuilder />;
    case "paths": return <TrainingPaths />;
    case "content-library": return <TrainingContentLibrary />;
    case "marketplace": return <TrainingMarketplace />;
    case "cohorts": {
      const parts = (route || "cohorts").split("/");
      if (parts[1]) return <TrainingCohortDetail id={parts[1]} />;
      return <TrainingCohorts />;
    }
    case "live-training": {
      const parts = (route || "live-training").split("/");
      if (parts[1]) return <TrainingLiveSessionDetail id={parts[1]} />;
      return <TrainingLiveTraining />;
    }
    case "calendar": return <TrainingCalendar />;
    case "trainers": return <TrainingTrainers />;
    case "assessments": {
      const parts = (route || "assessments").split("/");
      if (parts[2] === "take" && parts[1]) return <TrainingExamPlayer assessmentId={parts[1]} />;
      return <TrainingAssessments />;
    }
    case "question-bank": return <TrainingQuestionBank />;
    // Curriculum & content authoring (WAVE2-RECRUITER-TRAINING-SOURCING)
    case "curriculum-designer": return <TrainingCurriculumDesigner />;
    case "certifications": return <TrainingCertifications />;
    case "cert-templates": return <TrainingCertTemplates />;
    case "skills": return <TrainingSkills />;
    case "skill-gaps": return <TrainingSkillGaps />;
    case "compliance": return <TrainingCompliance />;
    case "enrollments": return <TrainingEnrollments />;
    case "surveys": return <TrainingSurveys />;
    // Process & lifecycle (WAVE3-RECRUITER-TRAINING-PARTNER-PROCESS)
    case "enrollment-approval": return <TrainingEnrollmentApproval />;
    case "trainer-allocation": return <TrainingTrainerAllocation />;
    case "completion-tracker": return <TrainingCompletionTracker />;
    // Transaction & finance (WAVE4-TRANSACTIONS-ALL-PORTALS)
    case "invoice-rules": return <TrainingInvoiceRules />;
    case "corporate-sponsorship": return <TrainingCorporateSponsorship />;
    // Communication (WAVE5-COMMUNICATION-ALL-PORTALS)
    case "parent-portal": return <TrainingParentPortal />;
    case "discussion-forums": return <TrainingDiscussionForums />;
    case "announcements": return <TrainingAnnouncements />;
    // BUILD-TRAINING-FEATURES routes
    case "attendance": return <TrainingAttendance />;
    case "gradebook": return <TrainingGradebook />;
    case "fee-collection": return <TrainingFeeCollection />;
    case "refunds": return <TrainingRefunds />;
    case "scholarships": return <TrainingScholarships />;
    case "student-messaging": return <TrainingStudentMessaging />;
    // Profile & 360° pages (WAVE1-RECRUITER-TRAINING-PROFILE)
    case "training-profile": return <TrainingProviderProfile />;
    case "student-profile-360": return <TrainingStudentProfile360 />;
    case "gamification": return <TrainingGamification />;
    case "automation": return <TrainingAutomation />;
    case "ai-assistant": return <TrainingAiAssistant />;
    case "analytics": return <TrainingAnalytics />;
    case "budgets": return <TrainingBudgets />;
    case "invoices": return <TrainingInvoices />;
    case "integrations": return <TrainingIntegrations />;
    case "settings": return <TrainingSettings />;
    case "support": return <TrainingSupport />;
    // Settings & Support hub pages (SETTINGS-SUPPORT)
    case "settings-hub": return <TrainingSettingsHub />;
    case "security-center": return <TrainingSecurityCenter />;
    case "notification-preferences": return <TrainingNotificationPrefs />;
    case "support-hub": return <TrainingSupportHub />;
    // New standalone routes (T-INTERACTIVE)
    case "verify-cert": return <TrainingCertificateVerify />;
    case "approvals": return <TrainingApprovals />;
    case "academy": return <TrainingAcademies />;
    case "providers": return <TrainingProviders />;
    case "campaigns": return <TrainingCampaigns />;
    case "reports": return <TrainingReportsCenter />;
    case "data-export": return <TrainingDataExport />;
    case "audit-logs": return <TrainingAuditLogs />;
    // Analytics deep-dives (T-ANALYTICS)
    case "course-performance": return <TrainingCoursePerformance />;
    case "trainer-performance": return <TrainingTrainerPerformance />;
    case "engagement-analytics": return <TrainingEngagementAnalytics />;
    case "dropoff-analytics": return <TrainingDropoffAnalytics />;
    // Talent Sourcing & Placements (T-TALENT)
    case "talent-search": return <TrainingTalentSearch />;
    case "talent-pools": return <TrainingTalentPools />;
    case "sourcing-requests": return <TrainingSourcingRequests />;
    case "placements": return <TrainingPlacements />;
    case "partner-clients": return <TrainingPartnerClients />;
    case "verify-credentials": return <TrainingVerifyCredentials />;
    // Platform Administration (merged from the former Admin Portal)
    case "adm-overview": return <AdminOverview />;
    case "adm-users": return <AdminUsers />;
    case "adm-organizations": return <AdminOrganizations />;
    case "adm-verification": return <AdminVerification />;
    case "adm-job-moderation": return <AdminJobModeration />;
    case "adm-recruitment-monitoring": return <AdminRecruitmentMonitoring />;
    case "adm-roles": return <AdminRoles />;
    case "adm-ai-config": return <AdminAiConfig />;
    case "adm-assessments": return <AdminAssessments />;
    case "adm-training": return <AdminTraining />;
    case "adm-plans": return <AdminPlans />;
    case "adm-pricing": return <AdminPricing />;
    case "adm-payments": return <AdminPayments />;
    case "adm-invoices": return <AdminInvoices />;
    case "adm-promotions": return <AdminPromotions />;
    case "adm-referrals": return <AdminReferrals />;
    case "adm-notifications": return <AdminNotifications />;
    case "adm-cms": return <AdminCms />;
    case "adm-reports": return <AdminReports />;
    case "adm-integrations": return <AdminIntegrations />;
    case "adm-api": return <AdminApi />;
    case "adm-audit": return <AdminAudit />;
    case "adm-privacy": return <AdminPrivacy />;
    case "adm-support": return <AdminSupport />;
    case "adm-settings": return <AdminSettings />;
    // Transaction & Revenue pages (CROSS-TXN)
    case "adm-platform-revenue": return <AdminPlatformRevenue />;
    case "adm-partner-payouts": return <AdminPartnerPayouts />;
    case "adm-transaction-monitoring": return <AdminTransactionMonitoring />;
    // Cross-portal partner integration (CROSS-INTEGRATE)
    case "adm-partner-mgmt": return <AdminPartnerManagement />;
    case "adm-partner-applications": return <AdminPartnerApplications />;
    case "adm-partner-performance": return <AdminPartnerPerformance />;
    // Talent Solutions (TS-ADMIN)
    case "ts-hub": return <TsHub />;
    case "ts-train-to-hire": return <TsTrainToHire />;
    case "ts-hire-to-train": return <TsHireToTrain />;
    case "ts-corporate-training": return <TsCorporateTraining />;
    // Super Admin (TS-ADMIN)
    case "adm-user-mgmt": return <TsAdminUserManagement />;
    case "adm-roles-hierarchy": return <TsAdminRoles />;
    case "adm-user-hierarchy": return <TsAdminUserHierarchy />;
    case "adm-audit-logs": return <TsAdminAuditLogs />;
    case "adm-system-config": return <TsAdminSystemSettings />;
    // Transaction & Communication (TS-ADMIN)
    case "transaction-hub": return <TransactionHub />;
    case "transactions": {
      const parts = (route || "transactions").split("/");
      if (parts[1]) return <TransactionDetail id={parts[1]} />;
      return <TransactionList />;
    }
    case "billing-center": return <BillingCenter />;
    case "payment-gateway": return <PaymentGateway />;
    case "settlement-engine": return <SettlementEngine />;
    case "transaction-comms": return <TransactionCommunications />;
    default: return <TrainingOverview />;
  }
}
