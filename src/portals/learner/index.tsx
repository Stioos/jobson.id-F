"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";

// Every page is lazy-loaded via next/dynamic to keep the dev-server memory bounded
// (sandbox has a 4GB memory limit — compiling all page modules at once would OOM).
const LearnerOverview = dynamic(() => import("./LearnerOverview").then((m) => m.LearnerOverview));
const LearnerCatalog = dynamic(() => import("./LearnerCatalog").then((m) => m.LearnerCatalog));
const LearnerCourseDetail = dynamic(() => import("./LearnerCourseDetail").then((m) => m.LearnerCourseDetail));
const LearnerMyLearning = dynamic(() => import("./LearnerMyLearning").then((m) => m.LearnerMyLearning));
const LearnerCoursePlayer = dynamic(() => import("./LearnerCoursePlayer").then((m) => m.LearnerCoursePlayer));
const LearnerRecommended = dynamic(() => import("./LearnerRecommended").then((m) => m.LearnerRecommended));
const LearnerWishlist = dynamic(() => import("./LearnerWishlist").then((m) => m.LearnerWishlist));
const LearnerCalendar = dynamic(() => import("./LearnerCalendar").then((m) => m.LearnerCalendar));
const LearnerCareerPaths = dynamic(() => import("./LearnerCareerPaths").then((m) => m.LearnerCareerPaths));
const LearnerMySkills = dynamic(() => import("./LearnerMySkills").then((m) => m.LearnerMySkills));
const LearnerGoals = dynamic(() => import("./LearnerGoals").then((m) => m.LearnerGoals));
const LearnerCertificates = dynamic(() => import("./LearnerCertificates").then((m) => m.LearnerCertificates));
const LearnerAchievements = dynamic(() => import("./LearnerAchievements").then((m) => m.LearnerAchievements));
const LearnerJobBoard = dynamic(() => import("./LearnerJobBoard").then((m) => m.LearnerJobBoard));
const LearnerProfile = dynamic(() => import("./LearnerProfile").then((m) => m.LearnerProfile));
const LearnerCommunity = dynamic(() => import("./LearnerCommunity").then((m) => m.LearnerCommunity));
const LearnerSettings = dynamic(() => import("./LearnerSettings").then((m) => m.LearnerSettings));
const LearnerSupport = dynamic(() => import("./LearnerSupport").then((m) => m.LearnerSupport));

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
      return <LearnerOverview />;
    case "catalog": {
      const parts = (route || "catalog").split("/");
      if (parts[1]) return <LearnerCourseDetail courseId={parts[1]} />;
      return <LearnerCatalog />;
    }
    case "my-learning": {
      const parts = (route || "my-learning").split("/");
      if (parts[1]) return <LearnerCoursePlayer courseId={parts[1]} />;
      return <LearnerMyLearning />;
    }
    case "recommendations":
      return <LearnerRecommended />;
    case "wishlist":
      return <LearnerWishlist />;
    case "calendar":
      return <LearnerCalendar />;
    case "career-paths":
      return <LearnerCareerPaths />;
    case "my-skills":
      return <LearnerMySkills />;
    case "goals":
      return <LearnerGoals />;
    case "certificates":
      return <LearnerCertificates />;
    case "achievements":
      return <LearnerAchievements />;
    case "job-board":
      return <LearnerJobBoard />;
    case "profile":
      return <LearnerProfile />;
    case "community":
      return <LearnerCommunity />;
    case "settings":
      return <LearnerSettings />;
    case "support":
      return <LearnerSupport />;
    default:
      return <LearnerOverview />;
  }
}
