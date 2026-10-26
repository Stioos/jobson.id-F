"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Portal, UserRole } from "./types";
import { routeToPath, pathToRoute } from "./routeRegistry";

export interface NavState {
  portal: Portal;
  route: string; // e.g. "jobs", "jobs/j_001", "profile"
  // role switching for demo
  role: UserRole;
  // search query for global command palette
  commandOpen: boolean;
  // notifications panel
  notifOpen: boolean;
  // mobile sidebar
  sidebarOpen: boolean;
  // theme is handled by next-themes
  navigate: (portal: Portal, route?: string) => void;
  setRole: (role: UserRole) => void;
  setCommandOpen: (open: boolean) => void;
  setNotifOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useNav = create<NavState>()(
  persist(
    (set) => ({
      portal: "public",
      route: "home",
      role: "candidate",
      commandOpen: false,
      notifOpen: false,
      sidebarOpen: false,
      navigate: (portal, route = "home") => {
        set({ portal, route, sidebarOpen: false });
        if (typeof window !== "undefined") {
          // Sync browser URL for SEO/deep-linking
          if (portal === "public") {
            const path = routeToPath(route);
            window.history.pushState({ portal, route }, "", path);
          }
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        }
      },
      setRole: (role) => set({ role }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      setNotifOpen: (notifOpen) => set({ notifOpen }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: "jobsonn-nav",
      partialize: (s) => ({ portal: s.portal, route: s.route, role: s.role }),
      skipHydration: true,
    }
  )
);

// ============================================================
// URL SYNC — read route from browser URL on initial load
// Called from page.tsx on mount to support deep linking & SEO
// ============================================================

export function getRouteFromUrl(): { portal: Portal; route: string } {
  if (typeof window === "undefined") return { portal: "public", route: "home" };

  const path = window.location.pathname;

  // Check if it's a known public route
  const route = pathToRoute(path);
  if (route !== "home" || path === "/") {
    return { portal: "public", route };
  }

  // Default to home
  return { portal: "public", route: "home" };
}

// Listen for browser back/forward (popstate)
if (typeof window !== "undefined") {
  window.addEventListener("popstate", (e) => {
    const state = e.state as { portal?: Portal; route?: string } | null;
    if (state?.portal && state?.route) {
      useNav.setState({ portal: state.portal, route: state.route });
    } else {
      // Fallback: read from URL
      const { portal, route } = getRouteFromUrl();
      useNav.setState({ portal, route });
    }
  });
}

// Demo "auth" store — simulated. NOT production.
export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  orgName?: string;
  orgLogo?: string;
}

interface AuthState {
  user: DemoUser | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const roleUsers: Record<UserRole, DemoUser> = {
  candidate: { id: "u_002", name: "Priya Nair", email: "priya.nair@gmail.com", role: "candidate", avatar: "PN" },
  employer: { id: "u_003", name: "Rohan Mehta", email: "rohan.mehta@techcorp.com", role: "employer", avatar: "RM", orgName: "TechCorp India", orgLogo: "TC" },
  recruiter: { id: "u_004", name: "Sneha Reddy", email: "sneha@talentbridge.in", role: "recruiter", avatar: "SR", orgName: "TalentBridge Consulting", orgLogo: "TB" },
  agency: { id: "u_004", name: "Sneha Reddy", email: "sneha@talentbridge.in", role: "agency", avatar: "SR", orgName: "TalentBridge Consulting", orgLogo: "TB" },
  enterprise_admin: { id: "u_003", name: "Rohan Mehta", email: "rohan@techcorp.com", role: "enterprise_admin", avatar: "RM", orgName: "TechCorp India", orgLogo: "TC" },
  hiring_manager: { id: "pu_10", name: "Anika Verma", email: "anika@techcorp.com", role: "hiring_manager", avatar: "AV", orgName: "TechCorp India", orgLogo: "TC" },
  interviewer: { id: "pu_10", name: "Anika Verma", email: "anika@techcorp.com", role: "interviewer", avatar: "AV", orgName: "TechCorp India", orgLogo: "TC" },
  billing_manager: { id: "u_003", name: "Rohan Mehta", email: "rohan@techcorp.com", role: "billing_manager", avatar: "RM", orgName: "TechCorp India", orgLogo: "TC" },
  org_admin: { id: "u_003", name: "Rohan Mehta", email: "rohan@techcorp.com", role: "org_admin", avatar: "RM", orgName: "TechCorp India", orgLogo: "TC" },
  platform_admin: { id: "u_001", name: "Aarav Sharma", email: "aarav@jobsonn.com", role: "platform_admin", avatar: "AS" },
  support: { id: "u_001", name: "Aarav Sharma", email: "support@jobsonn.com", role: "support", avatar: "AS" },
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: roleUsers.candidate,
      login: (role) => set({ user: roleUsers[role] }),
      logout: () => set({ user: null }),
    }),
    { name: "jobsonn-auth", skipHydration: true }
  )
);
