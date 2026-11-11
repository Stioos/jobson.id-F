"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/lib/store";
import type { UserRole } from "@/lib/types";

export interface StoredAccountProfile {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  accountType?: "employee" | "employer";
  professionalRole?: string;
  businessIntent?: "sell" | "buy" | "partnerships" | "brands";
}

export interface AuthUserView {
  mounted: boolean;
  fullName: string;
  firstName: string;
  email: string;
  phone: string;
  companyName: string;
  accountType: "employee" | "employer" | "";
  professionalRole: string;
  businessIntent: "sell" | "buy" | "partnerships" | "brands" | "";
  initials: string;
}

const PROFILE_STORAGE_KEY = "jobsonn_account_profile_store_v1";
const ROLE_STORAGE_KEY = "webuos-agent-role";

export function getInitials(name?: string | null): string {
  const clean = (name || "").trim();
  if (!clean) return "JN";
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function mapRoleToAccountDefaults(role?: UserRole): {
  accountType: "employee" | "employer" | "";
  professionalRole: string;
  businessIntent: "sell" | "buy" | "partnerships" | "brands" | "";
} {
  if (!role) return { accountType: "", professionalRole: "", businessIntent: "" };
  if (role === "candidate") {
    return { accountType: "employee", professionalRole: "employee", businessIntent: "" };
  }
  return { accountType: "employer", professionalRole: "", businessIntent: "partnerships" };
}

function readLocalProfile(): StoredAccountProfile {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAccountProfile) : {};
  } catch {
    return {};
  }
}

export function getStoredUser(): StoredAccountProfile | null {
  const stored = readLocalProfile();
  const authState = useAuth.getState();
  const authUser = authState.user;

  if (!authUser && Object.keys(stored).length === 0) {
    return null;
  }

  const matchedRegistered = authUser
    ? authState.registeredAccounts.find(
        (acc) => acc.email.toLowerCase() === authUser.email.toLowerCase()
      )
    : undefined;

  const fullName = stored.fullName || authUser?.name || "";
  const firstName = stored.firstName || (fullName ? fullName.split(/\s+/)[0] : "");
  const defaults = mapRoleToAccountDefaults(authUser?.role);

  return {
    fullName,
    firstName,
    lastName: stored.lastName,
    email: stored.email || authUser?.email || "",
    phone: stored.phone || matchedRegistered?.phone || "+91 98765 43210",
    companyName: stored.companyName || authUser?.orgName || "",
    accountType: stored.accountType || (defaults.accountType || undefined),
    professionalRole: stored.professionalRole || (defaults.professionalRole || undefined),
    businessIntent: stored.businessIntent || (defaults.businessIntent || undefined),
  };
}

export function getActiveUser(): AuthUserView {
  const stored = readLocalProfile();
  const authState = useAuth.getState();
  const authUser = authState.user;
  const matchedRegistered = authUser
    ? authState.registeredAccounts.find(
        (acc) => acc.email.toLowerCase() === authUser.email.toLowerCase()
      )
    : undefined;

  const defaults = mapRoleToAccountDefaults(authUser?.role);
  const fullName = stored.fullName || authUser?.name || "JOBSONN Member";
  const firstName = stored.firstName || fullName.split(/\s+/)[0] || "Member";
  const email = stored.email || authUser?.email || "jobson.id@gmail.com";
  const phone = stored.phone || matchedRegistered?.phone || "+91 98765 43210";
  const companyName = stored.companyName || authUser?.orgName || "";
  const accountType = stored.accountType || defaults.accountType || "employee";
  const professionalRole = stored.professionalRole || defaults.professionalRole || "";
  const businessIntent = stored.businessIntent || defaults.businessIntent || "";

  return {
    mounted: true,
    fullName,
    firstName,
    email,
    phone,
    companyName,
    accountType,
    professionalRole,
    businessIntent,
    initials: getInitials(fullName || companyName),
  };
}

export function saveUserData(patch: StoredAccountProfile): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readLocalProfile();
    const next: StoredAccountProfile = { ...existing, ...patch };
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));

    if (patch.accountType === "employee" && patch.professionalRole) {
      window.localStorage.setItem(ROLE_STORAGE_KEY, patch.professionalRole);
    } else if (patch.accountType === "employer") {
      window.localStorage.setItem(ROLE_STORAGE_KEY, "organization");
    }

    // Keep global Zustand auth user in sync for navbar & portals
    const currentUser = useAuth.getState().user;
    if (currentUser && (patch.fullName || patch.email || patch.companyName !== undefined)) {
      const updatedName = patch.fullName || currentUser.name;
      useAuth.getState().setUser({
        ...currentUser,
        name: updatedName,
        email: patch.email || currentUser.email,
        orgName: patch.companyName !== undefined ? patch.companyName : currentUser.orgName,
        avatar: getInitials(updatedName),
      });
    }

    window.dispatchEvent(new Event("webuos-auth-change"));
    window.dispatchEvent(new Event("jobsonn-auth-change"));
  } catch {
    // ignore storage failures
  }
}

const emptySubscribe = () => () => {};

export function useAuthUser(): AuthUserView {
  const { user, registeredAccounts } = useAuth();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener("webuos-auth-change", refresh);
    window.addEventListener("jobsonn-auth-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("webuos-auth-change", refresh);
      window.removeEventListener("jobsonn-auth-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted) {
    return {
      mounted: false,
      fullName: "",
      firstName: "",
      email: "",
      phone: "",
      companyName: "",
      accountType: "",
      professionalRole: "",
      businessIntent: "",
      initials: "JN",
    };
  }

  void tick;
  const stored = readLocalProfile();
  const matchedRegistered = user
    ? registeredAccounts.find((acc) => acc.email.toLowerCase() === user.email.toLowerCase())
    : undefined;
  const defaults = mapRoleToAccountDefaults(user?.role);

  const fullName = stored.fullName || user?.name || "JOBSONN Member";
  const firstName = stored.firstName || fullName.split(/\s+/)[0] || "Member";
  const email = stored.email || user?.email || "";
  const phone = stored.phone || matchedRegistered?.phone || "+91 98765 43210";
  const companyName = stored.companyName || user?.orgName || "";
  const accountType = stored.accountType || defaults.accountType || "employee";
  const professionalRole = stored.professionalRole || defaults.professionalRole || "";
  const businessIntent = stored.businessIntent || defaults.businessIntent || "";

  return {
    mounted: true,
    fullName,
    firstName,
    email,
    phone,
    companyName,
    accountType,
    professionalRole,
    businessIntent,
    initials: getInitials(fullName || companyName),
  };
}
