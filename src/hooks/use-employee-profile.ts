"use client";

import { useSyncExternalStore, useCallback } from "react";

export interface EmployeeResumeItem {
  id: string;
  label: string;
  fileName: string;
  updatedAt: string;
  isPrimary: boolean;
}

export interface EmployeeReferenceItem {
  id: string;
  name: string;
  designation: string;
  contact: string;
  status: "Verified" | "Pending";
}

export interface EmployeeProfileState {
  currentStatus: string;
  desiredJobTitle: string;
  preferredIndustries: string[];
  jobCategory: string;
  expectedSalary: string;
  preferredLocation: string;
  workMode: string;
  employmentType: string;
  relocation: string;
  availability: string;
  careerObjectives: string;
  resumes: EmployeeResumeItem[];
  references: EmployeeReferenceItem[];
}

const STORAGE_KEY = "jobsonn_employee_profile_v1";

const DEFAULT_EMPLOYEE_PROFILE: EmployeeProfileState = {
  currentStatus: "Actively looking",
  desiredJobTitle: "Senior Full-Stack Engineer & AI Architect",
  preferredIndustries: ["Information Technology & Software", "AI & SaaS", "FinTech"],
  jobCategory: "Software Engineering",
  expectedSalary: "₹24 – ₹32 LPA",
  preferredLocation: "Bengaluru / Remote",
  workMode: "Hybrid",
  employmentType: "Full-time",
  relocation: "Open to discuss",
  availability: "30 Days",
  careerObjectives:
    "Seeking a high-ownership engineering or technical leadership role building scalable cloud-native web applications, developer tools, and enterprise AI workflows.",
  resumes: [
    {
      id: "r1",
      label: "Primary Tech Resume (2026)",
      fileName: "FullStack_AI_Resume_2026.pdf",
      updatedAt: "2 days ago",
      isPrimary: true,
    },
  ],
  references: [
    {
      id: "ref1",
      name: "Ananya Sharma",
      designation: "Engineering Manager, CloudStack India",
      contact: "ananya.sharma@cloudstack.in",
      status: "Verified",
    },
  ],
};

let cachedRaw: string | null = null;
let cachedSnapshot: EmployeeProfileState = DEFAULT_EMPLOYEE_PROFILE;
const listeners = new Set<() => void>();

function getClientSnapshot(): EmployeeProfileState {
  if (typeof window === "undefined") return DEFAULT_EMPLOYEE_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = DEFAULT_EMPLOYEE_PROFILE;
    } else {
      const parsed = JSON.parse(raw) as Partial<EmployeeProfileState>;
      cachedSnapshot = { ...DEFAULT_EMPLOYEE_PROFILE, ...parsed };
    }
  } catch {
    cachedSnapshot = DEFAULT_EMPLOYEE_PROFILE;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): EmployeeProfileState {
  return DEFAULT_EMPLOYEE_PROFILE;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => {
    listeners.delete(listener);
  };
}

export function useEmployeeProfile() {
  const profile = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const updateProfile = useCallback((patch: Partial<EmployeeProfileState>) => {
    const next = { ...getClientSnapshot(), ...patch };
    const serialized = JSON.stringify(next);
    cachedRaw = serialized;
    cachedSnapshot = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // ignore storage quota errors
    }
    listeners.forEach((l) => l());
  }, []);

  return { profile, updateProfile };
}
