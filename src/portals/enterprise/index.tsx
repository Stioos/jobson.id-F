"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

const EnterpriseOverview = dynamic(() => import("./EnterpriseOverview").then((m) => m.EnterpriseOverview));
const EnterpriseEntities = dynamic(() => import("./EnterpriseEntities").then((m) => m.EnterpriseEntities));
const EnterpriseTeams = dynamic(() => import("./EnterpriseTeams").then((m) => m.EnterpriseTeams));
const EnterpriseHeadcount = dynamic(() => import("./EnterpriseHeadcount").then((m) => m.EnterpriseHeadcount));
const EnterpriseBudgets = dynamic(() => import("./EnterpriseBudgets").then((m) => m.EnterpriseBudgets));
const EnterpriseTalentPool = dynamic(() => import("./EnterpriseTalentPool").then((m) => m.EnterpriseTalentPool));
const EnterpriseApprovals = dynamic(() => import("./EnterpriseApprovals").then((m) => m.EnterpriseApprovals));
const EnterpriseAnalytics = dynamic(() => import("./EnterpriseAnalytics").then((m) => m.EnterpriseAnalytics));
const EnterpriseAccess = dynamic(() => import("./EnterpriseAccess").then((m) => m.EnterpriseAccess));
const EnterpriseAudit = dynamic(() => import("./EnterpriseAudit").then((m) => m.EnterpriseAudit));
const EnterpriseSSO = dynamic(() => import("./EnterpriseSSO").then((m) => m.EnterpriseSSO));
const EnterpriseBilling = dynamic(() => import("./EnterpriseBilling").then((m) => m.EnterpriseBilling));
const EnterpriseSettings = dynamic(() => import("./EnterpriseSettings").then((m) => m.EnterpriseSettings));

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
      return <EnterpriseOverview />;
    case "entities": return <EnterpriseEntities />;
    case "teams": return <EnterpriseTeams />;
    case "headcount": return <EnterpriseHeadcount />;
    case "budgets": return <EnterpriseBudgets />;
    case "talent-pool": return <EnterpriseTalentPool />;
    case "approvals": return <EnterpriseApprovals />;
    case "analytics": return <EnterpriseAnalytics />;
    case "access": return <EnterpriseAccess />;
    case "audit": return <EnterpriseAudit />;
    case "sso": return <EnterpriseSSO />;
    case "billing": return <EnterpriseBilling />;
    case "settings": return <EnterpriseSettings />;
    default: return <EnterpriseOverview />;
  }
}
