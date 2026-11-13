"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Portal, UserRole } from "./types";
import { routeToPath, pathToRoute } from "./routeRegistry";
import { toast } from "sonner";

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
  // login slide-over sheet from right side
  loginDrawerOpen: boolean;
  setLoginDrawerOpen: (open: boolean) => void;
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
      loginDrawerOpen: false,
      setLoginDrawerOpen: (loginDrawerOpen) => set({ loginDrawerOpen }),
      navigate: (portal, route = "home") => {
        const isAuthed = Boolean(useAuth.getState().isAuthenticated && useAuth.getState().user);

        // Gate non-public portals behind authentication
        if (portal !== "public" && !isAuthed) {
          if (typeof window !== "undefined") {
            try {
              sessionStorage.setItem("jobson_id_redirect_portal", portal);
            } catch {}
          }
          toast.error(`Please sign in to access the ${portal.charAt(0).toUpperCase() + portal.slice(1)} Portal.`);
          set({ portal: "public", route: "auth", sidebarOpen: false });
          if (typeof window !== "undefined") {
            const path = routeToPath("auth");
            window.history.pushState({ portal: "public", route: "auth" }, "", path);
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
          }
          return;
        }

        set({ portal, route, sidebarOpen: false });
        if (typeof window !== "undefined") {
          // Sync browser URL for SEO/deep-linking
          if (portal === "public") {
            const path = routeToPath(route);
            const suffix = window.location.pathname === path ? window.location.search : "";
            window.history.pushState({ portal, route }, "", `${path}${suffix}`);
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
      name: "jobson.id-nav-v3",
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

export interface RegisteredAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  portal: Portal;
  avatar: string;
}

interface AuthState {
  user: DemoUser | null;
  isAuthenticated: boolean;
  registeredAccounts: RegisteredAccount[];
  login: (role: UserRole) => void;
  setUser: (user: DemoUser) => void;
  registerAccount: (account: Omit<RegisteredAccount, "id">) => RegisteredAccount;
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
  platform_admin: { id: "u_001", name: "Aarav Sharma", email: "aarav@jobson.id", role: "platform_admin", avatar: "AS" },
  support: { id: "u_001", name: "Aarav Sharma", email: "support@jobson.id", role: "support", avatar: "AS" },
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      registeredAccounts: [],
      login: (role) => set({ user: roleUsers[role], isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      registerAccount: (account) => {
        const newAccount: RegisteredAccount = { ...account, id: `u_${Date.now()}` };
        set((state) => ({
          registeredAccounts: [
            ...state.registeredAccounts.filter(
              (a) => a.email.toLowerCase() !== account.email.toLowerCase()
            ),
            newAccount,
          ],
        }));
        return newAccount;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "jobson.id-auth-v3", skipHydration: true }
  )
);

const BUILTIN_ALLOWED_EMAILS = ["jobson.id@gmail.com", "jobson.id"];
const BUILTIN_ALLOWED_PASSWORD = "businessos2026";

export type CredentialAuthResult =
  | { ok: true; user: DemoUser; portal: Portal }
  | { ok: false; error: string; toastTitle: string; toastDescription: string };

/**
 * Validates email (or username) + password against newly registered accounts
 * first, falling back to the built-in authorized account.
 */
export function authenticateUserCredentials(
  emailInput: string,
  passwordInput: string,
  redirectPortal?: string | null
): CredentialAuthResult {
  const normalized = emailInput.trim().toLowerCase();
  const normalizedUsername = normalized.replace(/^@/, "");
  const accounts = useAuth.getState().registeredAccounts ?? [];

  const matchedAccount = accounts.find(
    (acc) =>
      acc.email.toLowerCase() === normalized ||
      acc.username.toLowerCase() === normalizedUsername
  );

  if (matchedAccount) {
    if (matchedAccount.password !== passwordInput) {
      return {
        ok: false,
        error: `Invalid password for ${matchedAccount.email}. Please try again.`,
        toastTitle: "Invalid credentials",
        toastDescription: "The password entered does not match your registered password.",
      };
    }

    return {
      ok: true,
      user: {
        id: matchedAccount.id,
        name: matchedAccount.name,
        email: matchedAccount.email,
        role: matchedAccount.role,
        avatar: matchedAccount.avatar,
      },
      portal: "public",
    };
  }

  if (!BUILTIN_ALLOWED_EMAILS.includes(normalized)) {
    return {
      ok: false,
      error: "Invalid email address. Please sign in with your registered account.",
      toastTitle: "Invalid credentials",
      toastDescription: "No account found for that email address.",
    };
  }

  if (passwordInput !== BUILTIN_ALLOWED_PASSWORD) {
    return {
      ok: false,
      error: "Invalid password for jobson.id@gmail.com. Please try again.",
      toastTitle: "Invalid credentials",
      toastDescription: "The password entered is incorrect.",
    };
  }

  const roleForPortal: UserRole =
    redirectPortal === "partner" || redirectPortal === "employer"
      ? "employer"
      : redirectPortal === "recruiter"
      ? "recruiter"
      : redirectPortal === "admin" || redirectPortal === "training"
      ? "platform_admin"
      : "candidate";

  return {
    ok: true,
    user: {
      id: `u_${Date.now()}`,
      name: "jobson.id",
      email: "jobson.id@gmail.com",
      role: roleForPortal,
      avatar: "JO",
    },
    portal:
      redirectPortal && redirectPortal !== "public"
        ? (redirectPortal as Portal)
        : "public",
  };
}
