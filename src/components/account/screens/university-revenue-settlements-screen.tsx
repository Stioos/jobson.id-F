"use client";

import { useState } from "react";
import {
  IndianRupee, Wallet, Clock, CheckCircle2, Download,
  Receipt, ArrowUpRight, TrendingUp, AlertCircle, FileText
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityRevenueSettlementsProps {
  onNavigate?: (tab: string) => void;
}

export function UniversityRevenueSettlementsScreen({ onNavigate }: UniversityRevenueSettlementsProps) {
  // Matching ₹3.47L Lifetime Partner Share and ₹1.84L Pending Payments from screenshot
  const SETTLEMENTS = [
    {
      id: "SET-2026-089",
      invoiceRef: "INV-2026-DIST-01",
      batch: "Batch A — Full-Stack Web & AI",
      period: "October 2026",
      grossAmount: "₹2,10,000",
      deductions: "₹63,000 (30% jobson.id)",
      netPartnerShare: "₹1,47,000",
      status: "SETTLED",
      disbursedAt: "05 Nov 2026",
      utr: "HDFCN2630981249",
    },
    {
      id: "SET-2026-074",
      invoiceRef: "INV-2026-DIST-02",
      batch: "Batch B — Data Science & GenAI",
      period: "October 2026",
      grossAmount: "₹1,90,000",
      deductions: "₹57,000 (30% jobson.id)",
      netPartnerShare: "₹1,33,000",
      status: "PENDING",
      disbursedAt: "Due in 12 days",
      utr: "Processing Approval",
    },
    {
      id: "SET-2026-061",
      invoiceRef: "INV-2026-DIST-03",
      batch: "Batch C — Cloud Architecture",
      period: "October 2026",
      grossAmount: "₹95,000",
      deductions: "₹28,500 (30% jobson.id)",
      netPartnerShare: "₹67,000",
      status: "PENDING",
      disbursedAt: "Commercial Revision Required",
      utr: "Pending MoU Signoff",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  University Revenue & Commercial Settlements Ledger
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  MODEL A (70% PARTNER SHARE)
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Official partnership disbursements, student fee splits, and pending invoice remittances.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.success("Settlement Statement Exported", { description: "Download complete tax and TDS settlement breakdown." })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted dark:border-white/10 dark:bg-slate-950 dark:text-white cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Download Tax Statement
          </button>
        </div>

        {/* Financial KPI Summary matching screenshot 1:1 */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-5 dark:border-white/10">
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Lifetime Partner Revenue</p>
            <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">₹3.47L</p>
            <p className="text-[10px] text-muted-foreground">70% revenue share on cohorts</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Pending Invoices</p>
            <p className="mt-1 text-xl font-bold text-rose-600 dark:text-rose-400">₹1.84L</p>
            <p className="text-[10px] text-muted-foreground">5 pending invoices under processing</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Disbursed to Date</p>
            <p className="mt-1 text-xl font-bold text-foreground dark:text-white">₹1.63L</p>
            <p className="text-[10px] text-muted-foreground">Direct NEFT/RTGS to Deccan Society</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">Applicable GST / TDS</p>
            <p className="mt-1 text-xl font-bold text-teal-600 dark:text-teal-400">18% GST / 10% TDS</p>
            <p className="text-[10px] text-muted-foreground">Withholding tax certificates filed</p>
          </div>
        </div>
      </section>

      {/* ─── Settlement Records ─── */}
      <section className="space-y-4">
        {SETTLEMENTS.map((s) => (
          <div
            key={s.id}
            className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {s.id}
                  </span>
                  <h3 className="text-sm font-bold text-foreground dark:text-white">
                    {s.invoiceRef} — <span className="text-muted-foreground font-normal">{s.batch}</span>
                  </h3>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    s.status === "SETTLED"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                  )}>
                    {s.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                  Billing Cycle: {s.period} • Bank Ref / UTR: <span className="font-mono text-foreground dark:text-slate-200">{s.utr}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-muted-foreground">Net Partner Share</span>
                <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">{s.netPartnerShare}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border pt-3 text-xs dark:border-white/5">
              <span className="text-muted-foreground">
                Gross Collected: <strong className="text-foreground dark:text-white">{s.grossAmount}</strong> • Platform Fee: <strong className="text-muted-foreground">{s.deductions}</strong>
              </span>
              <button
                type="button"
                onClick={() => toast.info(`Invoice ${s.invoiceRef}`, { description: "Download commercial invoice & remittance breakdown." })}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 cursor-pointer"
              >
                <Download className="h-3 w-3" /> Download Invoice PDF
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("internships")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Internships & Projects
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("performance")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Performance & Reports →
        </button>
      </div>
    </div>
  );
}
