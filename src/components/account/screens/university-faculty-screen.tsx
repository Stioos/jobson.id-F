"use client";

import { useState } from "react";
import {
  Users, Award, CheckCircle2, Clock, Mail, Phone, Plus,
  ShieldCheck, Sparkles, BookOpen, GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityFacultyProps {
  onNavigate?: (tab: string) => void;
}

export function UniversityFacultyScreen({ onNavigate }: UniversityFacultyProps) {
  const FACULTY = [
    {
      id: "FAC-001",
      name: "Dr. K. Srinivas Rao",
      designation: "Professor & Head of Department",
      dept: "Computer Science & Engineering",
      qualification: "Ph.D. in Computer Science (IIT Madras)",
      experienceYears: 18,
      trainingStatus: "COMPLETED",
      trainingProgram: "jobson.id Master Trainer (Full-Stack & Cloud)",
      certified: true,
      coordinator: true,
      fdpSessions: 6,
      email: "srinivas.rao@dist.edu.in",
      phone: "+91 94400 12001",
      activeBatches: 2,
    },
    {
      id: "FAC-002",
      name: "Dr. Radhika Sharma",
      designation: "Professor & Academic Dean",
      dept: "Artificial Intelligence & Data Science",
      qualification: "Ph.D. in Machine Learning (IISc Bangalore)",
      experienceYears: 14,
      trainingStatus: "COMPLETED",
      trainingProgram: "jobson.id AI Systems & LLM Architecture",
      certified: true,
      coordinator: true,
      fdpSessions: 8,
      email: "radhika.sharma@dist.edu.in",
      phone: "+91 94400 12002",
      activeBatches: 1,
    },
    {
      id: "FAC-003",
      name: "Prof. P. Venkatesh",
      designation: "Associate Professor",
      dept: "Electronics & Communication Engineering",
      qualification: "M.Tech in VLSI & Embedded Systems",
      experienceYears: 11,
      trainingStatus: "ONGOING",
      trainingProgram: "jobson.id Cloud Architecture & Kubernetes",
      certified: false,
      coordinator: false,
      fdpSessions: 4,
      email: "p.venkatesh@dist.edu.in",
      phone: "+91 94400 12003",
      activeBatches: 1,
    },
    {
      id: "FAC-004",
      name: "Dr. Sunita Menon",
      designation: "Professor & Training Cell In-Charge",
      dept: "Information Technology",
      qualification: "Ph.D. in Information Security",
      experienceYears: 16,
      trainingStatus: "COMPLETED",
      trainingProgram: "jobson.id Placement & Industry Readiness",
      certified: true,
      coordinator: true,
      fdpSessions: 7,
      email: "sunita.menon@dist.edu.in",
      phone: "+91 94400 12004",
      activeBatches: 2,
    },
    {
      id: "FAC-005",
      name: "Prof. M. Rajesh",
      designation: "Assistant Professor",
      dept: "Computer Applications (MCA)",
      qualification: "M.C.A., M.Tech (Software Engineering)",
      experienceYears: 8,
      trainingStatus: "COMPLETED",
      trainingProgram: "Full-Stack Web Mentorship Track",
      certified: true,
      coordinator: false,
      fdpSessions: 5,
      email: "m.rajesh@dist.edu.in",
      phone: "+91 94400 12005",
      activeBatches: 1,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Department Faculty Coordinators & FDP Mentors
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  {FACULTY.length} CERTIFIED MENTORS
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Institutional professors co-delivering jobson.id skilling cohorts, certified under Faculty Development Programs (FDP).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Add Faculty Mentor", { description: "Submit faculty nomination for FDP certification." })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Nominate Faculty for FDP
          </button>
        </div>

        {/* FDP Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-5 dark:border-white/10">
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Master Trainers</p>
            <p className="mt-1 text-lg font-bold text-foreground dark:text-white">4 Certified</p>
            <p className="text-[10px] text-muted-foreground">Tier-1 Master Credentials</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">FDP Completed</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">30 Sessions</p>
            <p className="text-[10px] text-muted-foreground">Co-delivered with industry leads</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Student-Faculty Ratio</p>
            <p className="mt-1 text-lg font-bold text-teal-600 dark:text-teal-400">1:15 Tier-1</p>
            <p className="text-[10px] text-muted-foreground">Compliant with AICTE norms</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Batch Coverage</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">100% Batches</p>
            <p className="text-[10px] text-muted-foreground">Named faculty liaison assigned</p>
          </div>
        </div>
      </section>

      {/* ─── Faculty Cards ─── */}
      <section className="space-y-4">
        {FACULTY.map((f) => (
          <div
            key={f.id}
            className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground dark:text-white">
                    {f.name}
                  </h3>
                  {f.coordinator && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      LEAD COORDINATOR
                    </span>
                  )}
                  {f.certified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> FDP Certified
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                  {f.designation} • {f.dept} • {f.experienceYears} Years Exp
                </p>
                <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                  {f.qualification}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">FDP Sessions</span>
                  <p className="font-bold text-foreground dark:text-white">{f.fdpSessions} Delivered</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Active Cohorts</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{f.activeBatches} Batches</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-3 text-xs sm:flex sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-foreground dark:text-white">
                  Certified Specialization:
                </span>
                <span className="text-muted-foreground dark:text-slate-300">
                  {f.trainingProgram}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-muted-foreground sm:mt-0 dark:text-slate-400 text-[11px]">
                <span>{f.email}</span>
                <span>•</span>
                <span>{f.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("students")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Student Directory
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
