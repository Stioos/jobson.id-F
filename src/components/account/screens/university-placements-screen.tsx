"use client";

import { useState } from "react";
import {
  Target, Building2, CalendarRange, CheckCircle2, Clock,
  ArrowRight, Download, Users, Award, ExternalLink, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityPlacementsProps {
  onNavigate?: (tab: string) => void;
}

export function UniversityPlacementsScreen({ onNavigate }: UniversityPlacementsProps) {
  const DRIVES = [
    {
      id: "DRV-2026-01",
      company: "TechCorp India Pvt Ltd",
      role: "Software Development Engineer (Full-Stack)",
      ctc: "₹12.0 LPA",
      driveDate: "28 Nov 2026",
      seats: 15,
      mode: "Campus Drive (Main Auditorium)",
      eligibility: "B.Tech (CSE/IT), Minimum 70% attendance in jobson.id Skilling",
      status: "OPEN",
      stats: { eligible: 42, applied: 38, shortlisted: 22, interviewed: 14, offers: 12 },
    },
    {
      id: "DRV-2026-02",
      company: "DataMinds AI Labs",
      role: "Junior AI & Machine Learning Engineer",
      ctc: "₹16.5 LPA",
      driveDate: "04 Dec 2026",
      seats: 8,
      mode: "Pool Campus Drive",
      eligibility: "B.Tech (AI/DS, CSE), Python & PyTorch Capstone Passed",
      status: "SCHEDULED",
      stats: { eligible: 38, applied: 32, shortlisted: 18, interviewed: 10, offers: 8 },
    },
    {
      id: "DRV-2026-03",
      company: "FinEdge Global Technologies",
      role: "DevOps & Cloud Systems Specialist",
      ctc: "₹9.0 LPA",
      driveDate: "12 Dec 2026",
      seats: 10,
      mode: "Virtual Assessment + On-Campus GD/PI",
      eligibility: "B.Tech (ECE/CSE), Docker & Kubernetes Certified",
      status: "SHORTLISTING",
      stats: { eligible: 40, applied: 34, shortlisted: 20, interviewed: 0, offers: 0 },
    },
    {
      id: "DRV-2026-04",
      company: "CloudOps Systems",
      role: "Cloud Infrastructure Analyst",
      ctc: "₹8.4 LPA",
      driveDate: "19 Dec 2026",
      seats: 12,
      mode: "Campus Drive",
      eligibility: "All Circuital Branches, Min 60% B.Tech Aggregate",
      status: "SCHEDULED",
      stats: { eligible: 60, applied: 48, shortlisted: 0, interviewed: 0, offers: 0 },
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Campus Placement Drives & Hiring Mandates
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  78% PLACEMENT RATE
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Direct recruiter drives powered by jobson.id corporate network for certified Deccan Institute students.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.success("Placement Drive Report", { description: "Download 2026 placement summary for NAAC/NIRF audit." })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted dark:border-white/10 dark:bg-slate-950 dark:text-white cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> NAAC Placement Report
          </button>
        </div>

        {/* Quick Placement Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-5 dark:border-white/10">
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Highest Package</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">₹18.4 LPA</p>
            <p className="text-[10px] text-muted-foreground">DataMinds AI (AI Research)</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Average CTC</p>
            <p className="mt-1 text-lg font-bold text-foreground dark:text-white">₹6.4 LPA</p>
            <p className="text-[10px] text-muted-foreground">Tier-1 campus median</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Placement Velocity</p>
            <p className="mt-1 text-lg font-bold text-teal-600 dark:text-teal-400">78%</p>
            <p className="text-[10px] text-muted-foreground">1 enrolled student placed early</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Active Hiring Partners</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">4 Companies</p>
            <p className="text-[10px] text-muted-foreground">45 total open seats</p>
          </div>
        </div>
      </section>

      {/* ─── Drive Cards ─── */}
      <section className="space-y-4">
        {DRIVES.map((d) => (
          <div
            key={d.id}
            className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {d.id}
                  </span>
                  <h3 className="text-sm font-bold text-foreground dark:text-white">
                    {d.company}
                  </h3>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    d.status === "OPEN"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : "bg-blue-500/15 text-blue-700 dark:text-blue-400"
                  )}>
                    {d.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-foreground dark:text-slate-200">
                  <strong>Role:</strong> {d.role}
                </p>
                <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                  {d.mode} • Scheduled Date: <strong className="text-foreground dark:text-slate-300">{d.driveDate}</strong> • {d.seats} Sanctioned Vacancies
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Package</span>
                  <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{d.ctc}</p>
                </div>
              </div>
            </div>

            {/* Funnel Progress */}
            <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Candidate Selection Pipeline:
              </p>
              <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-5">
                <div className="rounded-xl border border-border bg-background p-2 dark:border-white/5 dark:bg-slate-950/50">
                  <span className="text-[10px] text-muted-foreground">Eligible</span>
                  <p className="font-bold text-foreground dark:text-white">{d.stats.eligible}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-2 dark:border-white/5 dark:bg-slate-950/50">
                  <span className="text-[10px] text-muted-foreground">Applied</span>
                  <p className="font-bold text-foreground dark:text-white">{d.stats.applied}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-2 dark:border-white/5 dark:bg-slate-950/50">
                  <span className="text-[10px] text-muted-foreground">Shortlisted</span>
                  <p className="font-bold text-blue-600 dark:text-blue-400">{d.stats.shortlisted}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-2 dark:border-white/5 dark:bg-slate-950/50">
                  <span className="text-[10px] text-muted-foreground">Interviewed</span>
                  <p className="font-bold text-purple-600 dark:text-purple-400">{d.stats.interviewed}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-2 dark:border-white/5 dark:bg-slate-950/50">
                  <span className="text-[10px] text-muted-foreground">Offers Issued</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{d.stats.offers}</p>
                </div>
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
          ← Student Cohorts
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("internships")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Internships & Projects →
        </button>
      </div>
    </div>
  );
}
