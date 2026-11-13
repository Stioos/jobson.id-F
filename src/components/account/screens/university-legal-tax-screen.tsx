"use client";

import { useState } from "react";
import {
  FileText, ShieldCheck, CheckCircle2, Building2, CreditCard,
  Lock, Save, Edit3, Check, ExternalLink, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityLegalTaxScreenProps {
  onNavigate?: (sectionId: string) => void;
}

export function UniversityLegalTaxScreen({ onNavigate }: UniversityLegalTaxScreenProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    // Sponsoring Body
    trustName: "Deccan Educational Foundation & Charitable Trust",
    trustRegNo: "SOC/HYD/1995/4321",
    trustType: "Registered Educational & Public Charitable Trust",
    dateOfRegistration: "1995-04-12",
    regAuthority: "Registrar of Societies & Public Trusts, Govt of Telangana",

    // Tax Exemption Details
    panNumber: "AAATD1234F",
    panHolderName: "DECCAN EDUCATIONAL FOUNDATION",
    section12A: "AABTD9876E12A1",
    section12AValid: "Perpetual (Order No. ITBA/EXM/12A/2021-22/10398)",
    section80G: "AABTD9876E80G2",
    section80GValid: "Valid (Order No. ITBA/EXM/80G/2021-22/10401)",

    // GSTIN
    gstin: "36AAATD1234F1Z5",
    gstStatus: "Active",
    gstState: "Telangana (Code 36)",
    gstType: "Regular Taxpayer (Educational Commercial Services)",

    // Disbursement Bank Details
    bankName: "State Bank of India",
    branchName: "Deccan Campus Branch, Madhapur, Hyderabad",
    accountNumber: "39820194812",
    ifscCode: "SBIN0012345",
    accountType: "Current Account (Institutional Disbursement)",
    beneficiaryName: "DECCAN EDUCATIONAL FOUNDATION - jobson.id SETTLEMENT",

    // Signatory
    signatoryName: "Dr. Anitha Raghavan",
    signatoryDesignation: "Principal & Member Secretary",
    signatoryKycStatus: "VERIFIED",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Legal & Tax Details Saved", {
      description: "Institutional tax and bank records updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Institutional Legal, Trust & Tax Information
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> VERIFIED INSTITUTION
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Sponsoring trust registration, Section 12A/80G tax exemptions, and partner settlement accounts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition cursor-pointer",
              isEditing
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "border border-border bg-background hover:bg-muted dark:border-white/10 dark:bg-slate-950 dark:hover:bg-white/5"
            )}
          >
            {isEditing ? (
              <>
                <Save className="h-3.5 w-3.5" /> Save Records
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5" /> Edit Records
              </>
            )}
          </button>
        </div>
      </section>

      {/* ─── Section 1: Sponsoring Trust / Society ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground dark:text-white">
              Sponsoring Trust / Society Charter Details
            </h3>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              The governing entity that owns and operates the institution.
            </p>
          </div>
          <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300">
            GOVERNING BODY
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Trust / Society Legal Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.trustName}
              onChange={(e) => setFormData({ ...formData, trustName: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Registration Number
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.trustRegNo}
              onChange={(e) => setFormData({ ...formData, trustRegNo: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs font-mono text-foreground focus:border-emerald-500 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Registration Authority
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.regAuthority}
              onChange={(e) => setFormData({ ...formData, regAuthority: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* ─── Section 2: Income Tax & Section 12A/80G ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground dark:text-white">
            Statutory Tax Identifiers & Exemptions (Income Tax Act)
          </h3>
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            Educational exemptions recognized under Section 12A and Section 80G.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Permanent Account Number (PAN)
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                disabled
                value={formData.panNumber}
                className="h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs font-mono font-bold text-foreground dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                VERIFIED
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Goods & Services Tax Identifier (GSTIN)
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                disabled
                value={formData.gstin}
                className="h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs font-mono font-bold text-foreground dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                ACTIVE
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Section 12A Registration Number
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.section12A}
              onChange={(e) => setFormData({ ...formData, section12A: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs font-mono text-foreground focus:border-emerald-500 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">{formData.section12AValid}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Section 80G Registration Number
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.section80G}
              onChange={(e) => setFormData({ ...formData, section80G: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs font-mono text-foreground focus:border-emerald-500 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">{formData.section80GValid}</p>
          </div>
        </div>
      </section>

      {/* ─── Section 3: Revenue Disbursement Bank Account ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground dark:text-white">
              Institutional Disbursement & Revenue Settlement Bank Account
            </h3>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              Destination account for monthly partner revenue share settlements (₹3.47L lifetime paid).
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
            <Lock className="h-3 w-3" /> DIRECT SETTLEMENT
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Bank Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Branch Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.branchName}
              onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              Account Number
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs font-mono font-bold text-foreground focus:border-emerald-500 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
              IFSC Code
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs font-mono font-bold text-foreground focus:border-emerald-500 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("registrations-licences")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Accreditation & Approvals
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("address-master")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Campus Address Master →
        </button>
      </div>
    </div>
  );
}
