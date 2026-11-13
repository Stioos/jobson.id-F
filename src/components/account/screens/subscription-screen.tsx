"use client";

import { useState } from "react";
import { Sparkles, Check, Download, ShieldCheck, CreditCard, ArrowRight, Zap, Building } from "lucide-react";
import { toast } from "sonner";

export function SubscriptionScreen() {
  const invoices = [
    { id: "INV-2025-001", date: "01-Jan-2025", desc: "Annual Enterprise Verified Membership", amount: "₹49,999", status: "Paid" },
    { id: "INV-2024-089", date: "01-Jan-2024", desc: "Annual Enterprise Verified Membership", amount: "₹49,999", status: "Paid" },
    { id: "INV-2023-042", date: "15-Aug-2023", desc: "B2B Global Trade Catalog Extension", amount: "₹14,999", status: "Paid" },
  ];

  return (
    <div className="space-y-8">
      {/* Screen title & description now render in the dashboard header */}

      {/* Active Plan Card */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-blue-500/10 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-blue-950/40 dark:shadow-none">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Active Tier
              </span>
              <span className="text-xs text-muted-foreground dark:text-slate-400">Next renewal: Nov 15, 2026</span>
            </div>
            <h3 className="text-2xl font-extrabold text-foreground sm:text-3xl dark:text-white">Enterprise Verified Vendor</h3>
            <p className="text-xs text-muted-foreground max-w-lg dark:text-slate-300">
              Unlimited product & service catalog indexing, automated AI procurement matching, and top priority in jobson.id global discovery algorithms.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-5 text-right sm:min-w-[200px] dark:border-white/10 dark:bg-slate-950/60">
            <p className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Annual Subscription</p>
            <p className="mt-1 text-2xl font-bold text-foreground dark:text-white">₹49,999 <span className="text-xs font-normal text-muted-foreground dark:text-slate-400">/ yr</span></p>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Auto-renew Active
            </span>
          </div>
        </div>

        {/* Plan Features Pill Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-border/80 pt-6 dark:border-white/10">
          {[
            "Unlimited Catalog Listings",
            "Level 3 Verified Badge",
            "Direct Global RFQ Access",
            "AI Agent Search Priority",
            "Dedicated Account Manager",
            "24/7 Priority Support",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-2 text-xs text-foreground/80 dark:text-slate-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Invoice History */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <h3 className="text-base font-bold text-foreground dark:text-white">Billing & Invoices</h3>
        <p className="text-xs text-muted-foreground dark:text-slate-400">Download official tax invoices and payment receipts for your accounting records.</p>

        <div className="mt-6 space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/60"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground dark:text-white">{inv.desc}</p>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {inv.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">Invoice: {inv.id} · Date: {inv.date}</p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="text-sm font-bold text-foreground dark:text-white">{inv.amount}</span>
                <button
                  type="button"
                  onClick={() => toast.success(`Downloading tax invoice ${inv.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" /> Receipt PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
