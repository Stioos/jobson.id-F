"use client";

import { useState } from "react";
import {
  Network, BookOpen, GraduationCap, Users, Plus, CheckCircle2,
  ChevronRight, Sparkles, Building2, Layers, Check
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityAcademicHierarchyScreenProps {
  onNavigate?: (sectionId: string) => void;
}

interface Department {
  id: string;
  name: string;
  school: string;
  degrees: string[];
  intake: number;
  totalStudents: number;
  hod: string;
  facultyCount: number;
  mappedPrograms: string[];
  status: "ACTIVE" | "ENGAGED";
}

const DEPARTMENTS: Department[] = [
  {
    id: "dept_cse",
    name: "Department of Computer Science & Engineering",
    school: "School of Computing & Information Technology",
    degrees: ["B.Tech (CSE)", "M.Tech (Software Engg)", "Ph.D"],
    intake: 240,
    totalStudents: 920,
    hod: "Dr. K. Srinivas Rao",
    facultyCount: 38,
    mappedPrograms: ["Full-Stack Web & Cloud Architect (Batch 2024-A)", "Enterprise Placement Bootcamp"],
    status: "ENGAGED",
  },
  {
    id: "dept_aids",
    name: "Department of Artificial Intelligence & Data Science",
    school: "School of Computing & Information Technology",
    degrees: ["B.Tech (AI & DS)"],
    intake: 120,
    totalStudents: 440,
    hod: "Dr. P. V. Lakshmi",
    facultyCount: 22,
    mappedPrograms: ["Applied Generative AI & Data Systems (Batch 2024-B)"],
    status: "ENGAGED",
  },
  {
    id: "dept_ece",
    name: "Department of Electronics & Communication Engineering",
    school: "School of Electrical & Electronics Sciences",
    degrees: ["B.Tech (ECE)", "M.Tech (VLSI & Embedded)"],
    intake: 180,
    totalStudents: 680,
    hod: "Dr. M. Venkat Reddy",
    facultyCount: 28,
    mappedPrograms: ["Embedded Systems & Industrial IoT (Batch 2024-C)"],
    status: "ENGAGED",
  },
  {
    id: "dept_it",
    name: "Department of Information Technology",
    school: "School of Computing & Information Technology",
    degrees: ["B.Tech (IT)"],
    intake: 120,
    totalStudents: 460,
    hod: "Dr. Ch. Anjaneyulu",
    facultyCount: 19,
    mappedPrograms: ["Full-Stack Web & Cloud Architect (Batch 2024-A)"],
    status: "ENGAGED",
  },
  {
    id: "dept_mba",
    name: "School of Management Studies (SMS)",
    school: "Faculty of Business Administration",
    degrees: ["MBA (Finance, Marketing, HR, Tech Management)"],
    intake: 120,
    totalStudents: 230,
    hod: "Prof. S. R. K. Prasad",
    facultyCount: 16,
    mappedPrograms: ["Enterprise Tech Sales & Product Management (Batch 2024-D)"],
    status: "ENGAGED",
  },
  {
    id: "dept_mech",
    name: "Department of Mechanical & Automation Engineering",
    school: "School of Mechanical & Aerospace Sciences",
    degrees: ["B.Tech (Mechanical)", "M.Tech (CAD/CAM)"],
    intake: 60,
    totalStudents: 220,
    hod: "Dr. G. Ravinder",
    facultyCount: 14,
    mappedPrograms: ["Industrial Robotics & Additive Manufacturing"],
    status: "ACTIVE",
  },
];

export function UniversityAcademicHierarchyScreen({ onNavigate }: UniversityAcademicHierarchyScreenProps) {
  const [departments] = useState<Department[]>(DEPARTMENTS);

  const totalSanctionedIntake = departments.reduce((acc, d) => acc + d.intake, 0);
  const totalEnrolled = departments.reduce((acc, d) => acc + d.totalStudents, 0);
  const totalFaculty = departments.reduce((acc, d) => acc + d.facultyCount, 0);

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Network className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Academic & Department Hierarchy
                </h2>
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                  {departments.length} ACADEMIC DEPARTMENTS
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Faculties, degree programs, student intake capacities, and mapped jobson.id industry cohorts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Add Department", { description: "Submit department intake approval sheet." })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Map Department
          </button>
        </div>

        {/* Quick stats banner */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-5 dark:border-white/10">
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Sanctioned Annual Intake</p>
            <p className="mt-1 text-lg font-bold text-foreground dark:text-white">{totalSanctionedIntake} Seats</p>
            <p className="text-[10px] text-muted-foreground">Approved by AICTE & UGC</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Enrolled Student Body</p>
            <p className="mt-1 text-lg font-bold text-violet-600 dark:text-violet-400">{totalEnrolled.toLocaleString()} Students</p>
            <p className="text-[10px] text-muted-foreground">UG, PG & Research scholars</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Full-Time Faculty</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">{totalFaculty} Professors</p>
            <p className="text-[10px] text-muted-foreground">FSR 1:15 Tier-1 compliant</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">jobson.id Skilling Cohorts</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">4 Active Batches</p>
            <p className="text-[10px] text-muted-foreground">Integrated into curriculum</p>
          </div>
        </div>
      </section>

      {/* ─── Department Cards ─── */}
      <section className="space-y-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground dark:text-white">
                    {dept.name}
                  </h3>
                  <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300">
                    {dept.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">
                  {dept.school} • HOD: <span className="font-semibold text-foreground dark:text-slate-200">{dept.hod}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Annual Intake</span>
                  <p className="font-bold text-foreground dark:text-white">{dept.intake} seats</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Students</span>
                  <p className="font-bold text-foreground dark:text-white">{dept.totalStudents}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Faculty</span>
                  <p className="font-bold text-foreground dark:text-white">{dept.facultyCount}</p>
                </div>
              </div>
            </div>

            {/* Degrees Offered */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground mr-1">Degrees:</span>
              {dept.degrees.map((deg, i) => (
                <span
                  key={i}
                  className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground dark:border-white/5 dark:bg-slate-950/60 dark:text-slate-300"
                >
                  {deg}
                </span>
              ))}
            </div>

            {/* Mapped jobson.id Programs */}
            <div className="mt-4 border-t border-border pt-3 dark:border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Mapped Industry Programs:
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {dept.mappedPrograms.map((prog, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                  >
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    {prog}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("address-master")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Campus Address Master
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("documents")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Legal Docs & Verify →
        </button>
      </div>
    </div>
  );
}
