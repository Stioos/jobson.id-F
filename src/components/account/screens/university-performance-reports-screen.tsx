"use client";

import { useState } from "react";
import {
  BarChart3, FileText, Download, Award, Target, TrendingUp,
  CheckCircle2, Building2, Sparkles, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityPerformanceReportsProps {
  onNavigate?: (tab: string) => void;
}

export function UniversityPerformanceReportsScreen({ onNavigate }: UniversityPerformanceReportsProps) {
  const AUDIT_REPORTS = [
    {
      id: "RPT-NAAC-01",
      name: "NAAC Criteria 5 (Student Support & Progression) Compliance Pack",
      desc: "Documented student placement records, jobson.id certifications, employer offer letters, and salary certificates formatted to NAAC SSR quantitative metrics.",
      format: "PDF & XLSX",
      pages: "48 Pages",
      status: "READY",
      cycle: "2024–2026 Accreditation Cycle",
    },
    {
      id: "RPT-NIRF-02",
      name: "NIRF India Rankings — Parameter 3: Graduation Outcomes (GO)",
      desc: "Official median salary, higher education progression, and corporate campus placement data mapped to NIRF Engineering / University ranking templates.",
      format: "PDF & XLSX",
      pages: "24 Pages",
      status: "READY",
      cycle: "NIRF 2026 Submission",
    },
    {
      id: "RPT-AICTE-03",
      name: "AICTE Mandatory Industry-Academia Collaboration Disclosure",
      desc: "MoU operational metrics, Faculty Development Program (FDP) certificates, lab equipment utilization logs, and joint curriculum syllabus compliance.",
      format: "PDF",
      pages: "32 Pages",
      status: "READY",
      cycle: "AICTE EOA 2025–26",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  University Performance Analytics & Statutory Audit Reports
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  NAAC / NIRF / AICTE READY
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Generate and download official compliance reports for statutory accreditation visits and university ranking boards.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Snapshot */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-5 dark:border-white/10">
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Placement Velocity</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">78% Rate</p>
            <p className="text-[10px] text-muted-foreground">Campus drives underway</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Batch Pass Rate</p>
            <p className="mt-1 text-lg font-bold text-foreground dark:text-white">94.2%</p>
            <p className="text-[10px] text-muted-foreground">Across 3 active cohorts</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Corporate Internships</p>
            <p className="mt-1 text-lg font-bold text-teal-600 dark:text-teal-400">6 Interns</p>
            <p className="text-[10px] text-muted-foreground">Avg stipend ₹21,000/mo</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Health Compliance</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">82 / 100</p>
            <p className="text-[10px] text-muted-foreground">Healthy Tier-1 Partnership</p>
          </div>
        </div>
      </section>

      {/* ─── Statutory Audit Reports ─── */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-foreground dark:text-white">
          Accreditation Audit Export Packs
        </h3>
        {AUDIT_REPORTS.map((rpt) => (
          <div
            key={rpt.id}
            className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {rpt.id}
                  </span>
                  <h4 className="text-sm font-bold text-foreground dark:text-white">
                    {rpt.name}
                  </h4>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    {rpt.status}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground dark:text-slate-300 leading-relaxed">
                  {rpt.desc}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground dark:text-slate-400">
                  Target Scope: <span className="font-semibold text-foreground dark:text-slate-200">{rpt.cycle}</span> • Format: {rpt.format} ({rpt.pages})
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toast.success(`Exporting ${rpt.id}`, { description: "Report file generated with certified watermark." })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Download Pack
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("revenue")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Revenue & Settlements
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("home")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Return to Executive Cockpit →
        </button>
      </div>
    </div>
  );
}
