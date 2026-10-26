"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

const AgencyOverview = dynamic(() => import("./AgencyOverview").then((m) => m.AgencyOverview));
const AgencyProfile = dynamic(() => import("./AgencyProfile").then((m) => m.AgencyProfile));
const AgencyRecruiters = dynamic(() => import("./AgencyRecruiters").then((m) => m.AgencyRecruiters));
const AgencyClients = dynamic(() => import("./AgencyClients").then((m) => m.AgencyClients));
const AgencyRequisitions = dynamic(() => import("./AgencyRequisitions").then((m) => m.AgencyRequisitions));
const AgencySubmissions = dynamic(() => import("./AgencySubmissions").then((m) => m.AgencySubmissions));
const AgencyPlacements = dynamic(() => import("./AgencyPlacements").then((m) => m.AgencyPlacements));
const AgencyCommissions = dynamic(() => import("./AgencyCommissions").then((m) => m.AgencyCommissions));
const AgencyInvoices = dynamic(() => import("./AgencyInvoices").then((m) => m.AgencyInvoices));
const AgencyAnalytics = dynamic(() => import("./AgencyAnalytics").then((m) => m.AgencyAnalytics));
const AgencySettings = dynamic(() => import("./AgencySettings").then((m) => m.AgencySettings));

// Cross-portal shared pages (SETTINGS-SUPPORT-SHARED)
const TasksPage = dynamic(() => import("@/portals/_settings-support-shared/TasksPage").then((m) => m.TasksPage));

export function PortalRouter() {
  const { route } = useNav();
  return <>{render(route)}</>;
}

export function render(route: string): React.ReactNode {
  const top = route.split("/")[0] || "overview";
  switch (top) {
    case "overview": return <AgencyOverview />;
    case "tasks": return <TasksPage portal="agency" route={route} />;
    case "profile": return <AgencyProfile />;
    case "recruiters": return <AgencyRecruiters />;
    case "clients": return <AgencyClients />;
    case "requisitions": return <AgencyRequisitions />;
    case "submissions": return <AgencySubmissions />;
    case "placements": return <AgencyPlacements />;
    case "commissions": return <AgencyCommissions />;
    case "invoices": return <AgencyInvoices />;
    case "analytics": return <AgencyAnalytics />;
    case "settings": return <AgencySettings />;
    default: return <AgencyOverview />;
  }
}
