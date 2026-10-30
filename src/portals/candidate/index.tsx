"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

// Candidate pages
const CandidateOverview = dynamic(() => import("./CandidateOverview").then((m) => m.CandidateOverview));
const CandidateProfile = dynamic(() => import("./CandidateProfile").then((m) => m.CandidateProfile));
const CandidateResume = dynamic(() => import("./CandidateResume").then((m) => m.CandidateResume));
const CandidateFindJobs = dynamic(() => import("./CandidateFindJobs").then((m) => m.CandidateFindJobs));
const CandidateRecommended = dynamic(() => import("./CandidateRecommended").then((m) => m.CandidateRecommended));
const CandidateSavedJobs = dynamic(() => import("./CandidateSavedJobs").then((m) => m.CandidateSavedJobs));
const CandidateApplications = dynamic(() => import("./CandidateApplications").then((m) => m.CandidateApplications));
const CandidateInterviews = dynamic(() => import("./CandidateInterviews").then((m) => m.CandidateInterviews));
const CandidateOffers = dynamic(() => import("./CandidateOffers").then((m) => m.CandidateOffers));
const CandidateSkills = dynamic(() => import("./CandidateSkills").then((m) => m.CandidateSkills));
const CandidateCareerDevelopment = dynamic(() => import("./CandidateCareerDevelopment").then((m) => m.CandidateCareerDevelopment));
const CandidateTraining = dynamic(() => import("./CandidateTraining").then((m) => m.CandidateTraining));
const CandidatePortfolio = dynamic(() => import("./CandidatePortfolio").then((m) => m.CandidatePortfolio));
const CandidateMessages = dynamic(() => import("./CandidateMessages").then((m) => m.CandidateMessages));
const CandidateAlerts = dynamic(() => import("./CandidateAlerts").then((m) => m.CandidateAlerts));
const CandidateDocuments = dynamic(() => import("./CandidateDocuments").then((m) => m.CandidateDocuments));
const CandidatePayments = dynamic(() => import("./CandidatePayments").then((m) => m.CandidatePayments));
const CandidateReferrals = dynamic(() => import("./CandidateReferrals").then((m) => m.CandidateReferrals));
const CandidateSettings = dynamic(() => import("./CandidateSettings").then((m) => m.CandidateSettings));
const CandidateSupport = dynamic(() => import("./CandidateSupport").then((m) => m.CandidateSupport));

// Settings & Support hub pages (SETTINGS-SUPPORT)
const CandidateSettingsHub = dynamic(() => import("./CandidateSettingsHub").then((m) => m.CandidateSettingsHub));
const CandidateSecurityCenter = dynamic(() => import("./CandidateSecurityCenter").then((m) => m.CandidateSecurityCenter));
const CandidateNotificationPrefs = dynamic(() => import("./CandidateNotificationPrefs").then((m) => m.CandidateNotificationPrefs));
const CandidateSupportHub = dynamic(() => import("./CandidateSupportHub").then((m) => m.CandidateSupportHub));

// Transaction pages (CROSS-TXN)
const CandidateWallet = dynamic(() => import("./CandidateWallet").then((m) => m.CandidateWallet));
const CandidateTransactions = dynamic(() => import("./CandidateTransactions").then((m) => m.CandidateTransactions));
const CandidateSubscription = dynamic(() => import("./CandidateSubscription").then((m) => m.CandidateSubscription));

// Cross-portal partner integration pages (CROSS-INTEGRATE)
const CandidatePartnerCourses = dynamic(() => import("./CandidatePartnerCourses").then((m) => m.CandidatePartnerCourses));

// Talent Solutions pages (TS-CROSS)
const CandidateTalentSolutions = dynamic(() => import("./CandidateTalentSolutions").then((m) => m.CandidateTalentSolutions));
const CandidateMyPrograms = dynamic(() => import("./CandidateMyPrograms").then((m) => m.CandidateMyPrograms));
const CandidateTsTransactions = dynamic(() => import("./CandidateTsTransactions").then((m) => m.CandidateTsTransactions));

// BUILD-CANDIDATE-FEATURES pages
const CandidateJobCompare = dynamic(() => import("./CandidateJobCompare").then((m) => m.CandidateJobCompare));
const CandidateOfferCompare = dynamic(() => import("./CandidateOfferCompare").then((m) => m.CandidateOfferCompare));
const CandidatePipeline = dynamic(() => import("./CandidatePipeline").then((m) => m.CandidatePipeline));
const CandidateNotificationCenter = dynamic(() => import("./CandidateNotificationCenter").then((m) => m.CandidateNotificationCenter));
const CandidateInvoices = dynamic(() => import("./CandidateInvoices").then((m) => m.CandidateInvoices));
const CandidateWithdraw = dynamic(() => import("./CandidateWithdraw").then((m) => m.CandidateWithdraw));
const CandidateResumeBuilder = dynamic(() => import("./CandidateResumeBuilder").then((m) => m.CandidateResumeBuilder));

// WAVE1-CANDIDATE-PROFILE pages
const CandidateProfilePreview = dynamic(() => import("./CandidateProfilePreview").then((m) => m.CandidateProfilePreview));
const CandidateProfileAnalytics = dynamic(() => import("./CandidateProfileAnalytics").then((m) => m.CandidateProfileAnalytics));
const CandidateCoverLetter = dynamic(() => import("./CandidateCoverLetter").then((m) => m.CandidateCoverLetter));
const CandidateProfileOptimizer = dynamic(() => import("./CandidateProfileOptimizer").then((m) => m.CandidateProfileOptimizer));

// WAVE2-CANDIDATE-EMPLOYER-SOURCING pages
const CandidateSalaryCalculator = dynamic(() => import("./CandidateSalaryCalculator").then((m) => m.CandidateSalaryCalculator));
const CandidateInterviewPrep = dynamic(() => import("./CandidateInterviewPrep").then((m) => m.CandidateInterviewPrep));
const CandidateCompanyResearch = dynamic(() => import("./CandidateCompanyResearch").then((m) => m.CandidateCompanyResearch));
const CandidateCareerExplorer = dynamic(() => import("./CandidateCareerExplorer").then((m) => m.CandidateCareerExplorer));

// WAVE3-CANDIDATE-EMPLOYER-PROCESS pages
const CandidateInterviewReschedule = dynamic(() => import("./CandidateInterviewReschedule").then((m) => m.CandidateInterviewReschedule));
const CandidateOfferNegotiation = dynamic(() => import("./CandidateOfferNegotiation").then((m) => m.CandidateOfferNegotiation));
const CandidateOnboardingChecklist = dynamic(() => import("./CandidateOnboardingChecklist").then((m) => m.CandidateOnboardingChecklist));
const CandidateReferenceRequests = dynamic(() => import("./CandidateReferenceRequests").then((m) => m.CandidateReferenceRequests));

// WAVE4-TRANSACTIONS-ALL-PORTALS pages
const CandidatePaymentMethods = dynamic(() => import("./CandidatePaymentMethods").then((m) => m.CandidatePaymentMethods));
const CandidatePromoCodes = dynamic(() => import("./CandidatePromoCodes").then((m) => m.CandidatePromoCodes));
const CandidateDisputes = dynamic(() => import("./CandidateDisputes").then((m) => m.CandidateDisputes));

// WAVE5-COMMUNICATION-ALL-PORTALS pages
const CandidateGroupChat = dynamic(() => import("./CandidateGroupChat").then((m) => m.CandidateGroupChat));
const CandidateVideoCall = dynamic(() => import("./CandidateVideoCall").then((m) => m.CandidateVideoCall));
const CandidateRecruiterReviews = dynamic(() => import("./CandidateRecruiterReviews").then((m) => m.CandidateRecruiterReviews));
const CandidateEventsCalendar = dynamic(() => import("./CandidateEventsCalendar").then((m) => m.CandidateEventsCalendar));

// Cross-portal shared pages (SETTINGS-SUPPORT-SHARED)
const TasksWorkspace = dynamic(() => import("@/portals/_settings-support-shared/TasksWorkspace").then((m) => m.TasksWorkspace));

// Learner pages (merged from the former Learner Portal — SkillForge Academy)
const LearnerCatalog = dynamic(() => import("@/portals/learner/LearnerCatalog").then((m) => m.LearnerCatalog));
const LearnerCourseDetail = dynamic(() => import("@/portals/learner/LearnerCourseDetail").then((m) => m.LearnerCourseDetail));
const LearnerMyLearning = dynamic(() => import("@/portals/learner/LearnerMyLearning").then((m) => m.LearnerMyLearning));
const LearnerCoursePlayer = dynamic(() => import("@/portals/learner/LearnerCoursePlayer").then((m) => m.LearnerCoursePlayer));
const LearnerRecommended = dynamic(() => import("@/portals/learner/LearnerRecommended").then((m) => m.LearnerRecommended));
const LearnerWishlist = dynamic(() => import("@/portals/learner/LearnerWishlist").then((m) => m.LearnerWishlist));
const LearnerCalendar = dynamic(() => import("@/portals/learner/LearnerCalendar").then((m) => m.LearnerCalendar));
const LearnerCareerPaths = dynamic(() => import("@/portals/learner/LearnerCareerPaths").then((m) => m.LearnerCareerPaths));
const LearnerMySkills = dynamic(() => import("@/portals/learner/LearnerMySkills").then((m) => m.LearnerMySkills));
const LearnerGoals = dynamic(() => import("@/portals/learner/LearnerGoals").then((m) => m.LearnerGoals));
const LearnerCertificates = dynamic(() => import("@/portals/learner/LearnerCertificates").then((m) => m.LearnerCertificates));
const LearnerAchievements = dynamic(() => import("@/portals/learner/LearnerAchievements").then((m) => m.LearnerAchievements));
const LearnerJobBoard = dynamic(() => import("@/portals/learner/LearnerJobBoard").then((m) => m.LearnerJobBoard));
const LearnerCommunity = dynamic(() => import("@/portals/learner/LearnerCommunity").then((m) => m.LearnerCommunity));

export function PortalRouter() {
  const { route } = useNav();
  return <>{render(route)}</>;
}

export function render(route: string): React.ReactNode {
  const head = (route ?? "overview").split("/")[0];
  switch (head) {
    case "overview": return <CandidateOverview />;
    case "tasks": return <TasksWorkspace portal="candidate" route={route} />;
    case "profile": return <CandidateProfile />;
    case "resume": return <CandidateResume />;
    case "find-jobs": return <CandidateFindJobs />;
    case "recommended": return <CandidateRecommended />;
    case "saved-jobs": return <CandidateSavedJobs />;
    case "applications": return <CandidateApplications />;
    case "interviews": return <CandidateInterviews />;
    case "offers": return <CandidateOffers />;
    case "skills": return <CandidateSkills />;
    case "career-development": return <CandidateCareerDevelopment />;
    case "training": return <CandidateTraining />;
    case "portfolio": return <CandidatePortfolio />;
    // Learning Academy (merged from Learner Portal)
    case "catalog": {
      const parts = (route || "catalog").split("/");
      return parts[1] ? <LearnerCourseDetail courseId={parts[1]} /> : <LearnerCatalog />;
    }
    case "my-learning": {
      const parts = (route || "my-learning").split("/");
      return parts[1] ? <LearnerCoursePlayer courseId={parts[1]} /> : <LearnerMyLearning />;
    }
    case "recommendations": return <LearnerRecommended />;
    case "wishlist": return <LearnerWishlist />;
    case "calendar": return <LearnerCalendar />;
    // Certification & Career (merged from Learner Portal)
    case "career-paths": return <LearnerCareerPaths />;
    case "my-skills": return <LearnerMySkills />;
    case "goals": return <LearnerGoals />;
    case "certificates": return <LearnerCertificates />;
    case "achievements": return <LearnerAchievements />;
    case "job-board": return <LearnerJobBoard />;
    case "community": return <LearnerCommunity />;
    // Account
    case "messages": return <CandidateMessages />;
    case "alerts": return <CandidateAlerts />;
    case "documents": return <CandidateDocuments />;
    case "payments": return <CandidatePayments />;
    case "referrals": return <CandidateReferrals />;
    case "settings": return <CandidateSettings />;
    case "support": return <CandidateSupport />;
    // Settings & Support hub pages (SETTINGS-SUPPORT)
    case "settings-hub": return <CandidateSettingsHub />;
    case "security-center": return <CandidateSecurityCenter />;
    case "notification-preferences": return <CandidateNotificationPrefs />;
    case "support-hub": return <CandidateSupportHub />;
    // Transaction pages (CROSS-TXN)
    case "my-wallet": return <CandidateWallet />;
    case "my-transactions": return <CandidateTransactions />;
    case "my-subscription": return <CandidateSubscription />;
    // Cross-portal partner integration (CROSS-INTEGRATE)
    case "partner-courses": return <CandidatePartnerCourses />;
    // Talent Solutions (TS-CROSS)
    case "ts-hub": return <CandidateTalentSolutions />;
    case "ts-my-programs": return <CandidateMyPrograms />;
    case "ts-transactions": return <CandidateTsTransactions />;
    // BUILD-CANDIDATE-FEATURES routes
    case "compare-jobs": return <CandidateJobCompare />;
    case "compare-offers": return <CandidateOfferCompare />;
    case "application-pipeline": return <CandidatePipeline />;
    case "notification-center": return <CandidateNotificationCenter />;
    case "invoices": return <CandidateInvoices />;
    case "withdraw": return <CandidateWithdraw />;
    case "resume-builder": return <CandidateResumeBuilder />;
    // WAVE1-CANDIDATE-PROFILE routes
    case "profile-preview": return <CandidateProfilePreview />;
    case "profile-analytics": return <CandidateProfileAnalytics />;
    case "cover-letter": return <CandidateCoverLetter />;
    case "profile-optimizer": return <CandidateProfileOptimizer />;
    // WAVE2-CANDIDATE-EMPLOYER-SOURCING routes
    case "salary-calculator": return <CandidateSalaryCalculator />;
    case "interview-prep": return <CandidateInterviewPrep />;
    case "company-research": return <CandidateCompanyResearch />;
    case "career-explorer": return <CandidateCareerExplorer />;
    // WAVE3-CANDIDATE-EMPLOYER-PROCESS routes
    case "interview-reschedule": return <CandidateInterviewReschedule />;
    case "offer-negotiation": return <CandidateOfferNegotiation />;
    case "onboarding-checklist": return <CandidateOnboardingChecklist />;
    case "reference-requests": return <CandidateReferenceRequests />;
    // WAVE4-TRANSACTIONS-ALL-PORTALS routes
    case "payment-methods": return <CandidatePaymentMethods />;
    case "promo-codes": return <CandidatePromoCodes />;
    case "transaction-disputes": return <CandidateDisputes />;
    // WAVE5-COMMUNICATION-ALL-PORTALS routes
    case "group-chat": return <CandidateGroupChat />;
    case "video-call": return <CandidateVideoCall />;
    case "recruiter-reviews": return <CandidateRecruiterReviews />;
    case "events-calendar": return <CandidateEventsCalendar />;
    default: return <CandidateOverview />;
  }
}
