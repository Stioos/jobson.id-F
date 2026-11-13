"use client";

import { useState } from "react";
import {
  GraduationCap, Search, Filter, Download, CheckCircle2, Clock,
  Award, Target, UserCheck, ChevronRight, Sparkles, Mail, Phone
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityStudentsProps {
  onNavigate?: (tab: string) => void;
}

export function UniversityStudentsScreen({ onNavigate }: UniversityStudentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 10 Students matching the exact total students in the reference screenshot
  const STUDENTS = [
    {
      id: "STU-001",
      name: "Karthik Raja",
      rollNo: "21DIST0401",
      dept: "Computer Science & Engineering",
      program: "Full-Stack Web & AI",
      batch: "Batch A",
      attendance: 92,
      trainingStatus: "COMPLETED",
      certified: true,
      placementStatus: "PLACED",
      company: "TechCorp India",
      ctc: "₹12.0 LPA",
      phone: "+91 90030 11001",
      email: "karthik.r@dist.edu.in",
    },
    {
      id: "STU-002",
      name: "Divya Sundar",
      rollNo: "21DIST0414",
      dept: "AI & Data Science",
      program: "Data Science & Applied AI",
      batch: "Batch B",
      attendance: 88,
      trainingStatus: "IN_TRAINING",
      certified: false,
      placementStatus: "INTERVIEWING",
      company: "DataMinds AI",
      ctc: "Target ₹16 LPA",
      phone: "+91 90030 11002",
      email: "divya.s@dist.edu.in",
    },
    {
      id: "STU-003",
      name: "Arun Prakash",
      rollNo: "21DIST0428",
      dept: "Computer Science & Engineering",
      program: "Cloud Architecture & DevOps",
      batch: "Batch C",
      attendance: 84,
      trainingStatus: "IN_TRAINING",
      certified: false,
      placementStatus: "SHORTLISTED",
      company: "FinEdge Global",
      ctc: "Target ₹9 LPA",
      phone: "+91 90030 11003",
      email: "arun.p@dist.edu.in",
    },
    {
      id: "STU-004",
      name: "Nithya Balaji",
      rollNo: "21DIST0510",
      dept: "Electronics & Communication",
      program: "Full-Stack Web & AI",
      batch: "Batch A",
      attendance: 76,
      trainingStatus: "COMPLETED",
      certified: true,
      placementStatus: "INTERVIEWING",
      company: "TechCorp India",
      ctc: "Target ₹12 LPA",
      phone: "+91 90030 11004",
      email: "nithya.b@dist.edu.in",
    },
    {
      id: "STU-005",
      name: "Sanjay Kumar",
      rollNo: "21DIST0442",
      dept: "Computer Science & Engineering",
      program: "Full-Stack Web & AI",
      batch: "Batch A",
      attendance: 68,
      trainingStatus: "IN_TRAINING",
      certified: false,
      placementStatus: "TRAINING",
      company: "—",
      ctc: "—",
      phone: "+91 90030 11005",
      email: "sanjay.k@dist.edu.in",
    },
    {
      id: "STU-006",
      name: "Priyanka M",
      rollNo: "21DIST0612",
      dept: "Information Technology",
      program: "Data Science & Applied AI",
      batch: "Batch B",
      attendance: 90,
      trainingStatus: "IN_TRAINING",
      certified: false,
      placementStatus: "SHORTLISTED",
      company: "DataMinds AI",
      ctc: "Target ₹16 LPA",
      phone: "+91 90030 11006",
      email: "priyanka.m@dist.edu.in",
    },
    {
      id: "STU-007",
      name: "Ganesh Sai",
      rollNo: "21DIST0455",
      dept: "Computer Science & Engineering",
      program: "Full-Stack Web & AI",
      batch: "Batch A",
      attendance: 94,
      trainingStatus: "COMPLETED",
      certified: true,
      placementStatus: "PLACED",
      company: "DataMinds AI",
      ctc: "₹16.5 LPA",
      phone: "+91 90032 55001",
      email: "ganesh.s@dist.edu.in",
    },
    {
      id: "STU-008",
      name: "Vaishnavi Teja",
      rollNo: "21DIST0468",
      dept: "AI & Data Science",
      program: "Data Science & Applied AI",
      batch: "Batch B",
      attendance: 82,
      trainingStatus: "IN_TRAINING",
      certified: false,
      placementStatus: "INTERVIEWING",
      company: "FinEdge Global",
      ctc: "Target ₹9 LPA",
      phone: "+91 90032 55002",
      email: "vaishnavi.t@dist.edu.in",
    },
    {
      id: "STU-009",
      name: "Abhilash Reddy",
      rollNo: "21DIST0530",
      dept: "Electronics & Communication",
      program: "Cloud Architecture & DevOps",
      batch: "Batch C",
      attendance: 79,
      trainingStatus: "IN_TRAINING",
      certified: false,
      placementStatus: "TRAINING",
      company: "—",
      ctc: "—",
      phone: "+91 90032 55003",
      email: "abhilash.r@dist.edu.in",
    },
    {
      id: "STU-010",
      name: "Meghana K",
      rollNo: "21DIST0625",
      dept: "Information Technology",
      program: "Full-Stack Web & AI",
      batch: "Batch A",
      attendance: 85,
      trainingStatus: "IN_TRAINING",
      certified: false,
      placementStatus: "SHORTLISTED",
      company: "TechCorp India",
      ctc: "Target ₹12 LPA",
      phone: "+91 90032 55004",
      email: "meghana.k@dist.edu.in",
    },
  ];

  const filteredStudents = STUDENTS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.placementStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  University Student Cohorts & Directory
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  {STUDENTS.length} ENROLLED CANDIDATES
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Track student training progress, attendance, certifications, and campus placement offers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.success("Student Roster Exported", { description: "CSV saved with 10 candidate profiles." })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted dark:border-white/10 dark:bg-slate-950 dark:text-white cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export Roster (CSV)
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-border sm:flex-row sm:items-center dark:border-white/10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, roll number, or department…"
              className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            >
              <option value="all">All Placement States</option>
              <option value="PLACED">Placed</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="TRAINING">In Training</option>
            </select>
          </div>
        </div>
      </section>

      {/* ─── Student Table ─── */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:border-white/5 dark:bg-slate-950/40">
              <tr>
                <th className="px-5 py-3.5">Student / Roll No</th>
                <th className="px-4 py-3.5">Department & Program</th>
                <th className="px-4 py-3.5 text-center">Attendance</th>
                <th className="px-4 py-3.5">Training Status</th>
                <th className="px-4 py-3.5">Placement Outcome</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="transition hover:bg-muted/30 dark:hover:bg-slate-950/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-bold text-foreground dark:text-white">{s.name}</div>
                        <div className="font-mono text-[11px] text-muted-foreground dark:text-slate-400">{s.rollNo}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-medium text-foreground dark:text-slate-200">{s.dept}</div>
                    <div className="text-[11px] text-muted-foreground dark:text-slate-400">{s.program} • {s.batch}</div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] font-bold",
                      s.attendance >= 85
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : s.attendance >= 75
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                        : "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                    )}>
                      {s.attendance}%
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      {s.certified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Certified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" /> In Training
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {s.placementStatus === "PLACED" ? (
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          <Target className="h-3 w-3" /> Placed: {s.company}
                        </span>
                        <div className="mt-0.5 font-mono font-bold text-foreground dark:text-white">{s.ctc}</div>
                      </div>
                    ) : s.placementStatus === "INTERVIEWING" ? (
                      <div>
                        <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">
                          Interviewing: {s.company}
                        </span>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">{s.ctc}</div>
                      </div>
                    ) : s.placementStatus === "SHORTLISTED" ? (
                      <div>
                        <span className="inline-flex items-center rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-400">
                          Shortlisted: {s.company}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">In Training</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toast.info(`Candidate Profile: ${s.name}`, { description: `Contact: ${s.email} | ${s.phone}` })}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-muted dark:border-white/10 dark:bg-slate-950 dark:text-white cursor-pointer"
                    >
                      Dossier <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("programs")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Skilling Programs
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("placements")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Placement Drives →
        </button>
      </div>
    </div>
  );
}
