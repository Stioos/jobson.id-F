"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

const AdminOverview = dynamic(() => import("./AdminOverview").then((m) => m.AdminOverview));
const AdminUsers = dynamic(() => import("./AdminUsers").then((m) => m.AdminUsers));
const AdminOrganizations = dynamic(() => import("./AdminOrganizations").then((m) => m.AdminOrganizations));
const AdminVerification = dynamic(() => import("./AdminVerification").then((m) => m.AdminVerification));
const AdminJobModeration = dynamic(() => import("./AdminJobModeration").then((m) => m.AdminJobModeration));
const AdminRecruitmentMonitoring = dynamic(() => import("./AdminRecruitmentMonitoring").then((m) => m.AdminRecruitmentMonitoring));
const AdminRoles = dynamic(() => import("./AdminRoles").then((m) => m.AdminRoles));
const AdminAiConfig = dynamic(() => import("./AdminAiConfig").then((m) => m.AdminAiConfig));
const AdminAssessments = dynamic(() => import("./AdminAssessments").then((m) => m.AdminAssessments));
const AdminTraining = dynamic(() => import("./AdminTraining").then((m) => m.AdminTraining));
const AdminPlans = dynamic(() => import("./AdminPlans").then((m) => m.AdminPlans));
const AdminPricing = dynamic(() => import("./AdminPricing").then((m) => m.AdminPricing));
const AdminPayments = dynamic(() => import("./AdminPayments").then((m) => m.AdminPayments));
const AdminInvoices = dynamic(() => import("./AdminInvoices").then((m) => m.AdminInvoices));
const AdminPromotions = dynamic(() => import("./AdminPromotions").then((m) => m.AdminPromotions));
const AdminReferrals = dynamic(() => import("./AdminReferrals").then((m) => m.AdminReferrals));
const AdminNotifications = dynamic(() => import("./AdminNotifications").then((m) => m.AdminNotifications));
const AdminCms = dynamic(() => import("./AdminCms").then((m) => m.AdminCms));
const AdminReports = dynamic(() => import("./AdminReports").then((m) => m.AdminReports));
const AdminIntegrations = dynamic(() => import("./AdminIntegrations").then((m) => m.AdminIntegrations));
const AdminApi = dynamic(() => import("./AdminApi").then((m) => m.AdminApi));
const AdminAudit = dynamic(() => import("./AdminAudit").then((m) => m.AdminAudit));
const AdminPrivacy = dynamic(() => import("./AdminPrivacy").then((m) => m.AdminPrivacy));
const AdminSupport = dynamic(() => import("./AdminSupport").then((m) => m.AdminSupport));
const AdminSettings = dynamic(() => import("./AdminSettings").then((m) => m.AdminSettings));

// Cross-portal shared pages (SETTINGS-SUPPORT-SHARED)
const TasksPage = dynamic(() => import("@/portals/_settings-support-shared/TasksPage").then((m) => m.TasksPage));

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
      return <AdminOverview />;
    case "tasks": return <TasksPage portal="admin" />;
    case "users": return <AdminUsers />;
    case "organizations": return <AdminOrganizations />;
    case "verification": return <AdminVerification />;
    case "job-moderation": return <AdminJobModeration />;
    case "recruitment-monitoring": return <AdminRecruitmentMonitoring />;
    case "roles": return <AdminRoles />;
    case "ai-config": return <AdminAiConfig />;
    case "assessments": return <AdminAssessments />;
    case "training": return <AdminTraining />;
    case "plans": return <AdminPlans />;
    case "pricing": return <AdminPricing />;
    case "payments": return <AdminPayments />;
    case "invoices": return <AdminInvoices />;
    case "promotions": return <AdminPromotions />;
    case "referrals": return <AdminReferrals />;
    case "notifications": return <AdminNotifications />;
    case "cms": return <AdminCms />;
    case "reports": return <AdminReports />;
    case "integrations": return <AdminIntegrations />;
    case "api": return <AdminApi />;
    case "audit": return <AdminAudit />;
    case "privacy": return <AdminPrivacy />;
    case "support": return <AdminSupport />;
    case "settings": return <AdminSettings />;
    default: return <AdminOverview />;
  }
}
