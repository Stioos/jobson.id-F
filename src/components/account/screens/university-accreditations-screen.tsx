"use client";

import { useState } from "react";
import {
  Award, ShieldCheck, CheckCircle2, Clock, Calendar, Download,
  ExternalLink, Plus, AlertCircle, Check, FileText
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityAccreditationsScreenProps {
  onNavigate?: (sectionId: string) => void;
}

interface AccreditationRecord {
  id: string;
  agency: string;
  badge: string;
  status: "VERIFIED" | "APPROVED" | "UNDER_REVIEW";
  gradeOrRank: string;
  scoreOrId: string;
  validFrom: string;
  validTill: string;
  certificateRef: string;
  scope: string;
}

const ACCREDITATIONS: AccreditationRecord[] = [
  {
    id: "acc_naac",
    agency: "National Assessment and Accreditation Council (NAAC)",
    badge: "NAAC A++",
    status: "VERIFIED",
    gradeOrRank: "Grade A++ (Highest Accreditation Band)",
    scoreOrId: "Cumulative Grade Point Average (CGPA): 3.65 / 4.0 (Cycle 2)",
    validFrom: "Nov 2023",
    validTill: "Nov 2028",
    certificateRef: "NAAC/A++/DEC-2023/CERT-9821.pdf",
    scope: "Institution-wide Quality, Faculty Credentials, Curricular Aspects & Research Impact",
  },
  {
    id: "acc_nba",
    agency: "National Board of Accreditation (NBA)",
    badge: "NBA Accredited",
    status: "VERIFIED",
    gradeOrRank: "Tier-1 Washington Accord Aligned",
    scoreOrId: "Accredited Branches: B.Tech CSE, ECE, Mechanical & IT",
    validFrom: "July 2022",
    validTill: "June 2026",
    certificateRef: "NBA/TIER1/ENGR/2022-814.pdf",
    scope: "Outcome Based Education (OBE), Course Outcomes & Student Placement Ratios",
  },
  {
    id: "acc_ugc",
    agency: "University Grants Commission (UGC)",
    badge: "UGC 2(f) & 12(B)",
    status: "APPROVED",
    gradeOrRank: "Recognized Higher Educational Institution",
    scoreOrId: "Conferred Autonomous Status under UGC Regulations",
    validFrom: "June 2018",
    validTill: "June 2028",
    certificateRef: "UGC/AUTONOMY/TS-0891/2018.pdf",
    scope: "Academic autonomy, curriculum design authority & central funding eligibility",
  },
  {
    id: "acc_aicte",
    agency: "All India Council for Technical Education (AICTE)",
    badge: "AICTE Approved",
    status: "APPROVED",
    gradeOrRank: "Extension of Approval (EOA) Current Academic Year",
    scoreOrId: "Permanent Institute Application ID: 1-3829104",
    validFrom: "Academic Year 2024-25",
    validTill: "Academic Year 2025-26",
    certificateRef: "AICTE/EOA/2024-25/1-3829104.pdf",
    scope: "Intake sanction: 840 UG seats, 150 PG seats & Faculty-Student Ratio (FSR) 1:15",
  },
  {
    id: "acc_nirf",
    agency: "National Institutional Ranking Framework (NIRF)",
    badge: "NIRF Top 150",
    status: "VERIFIED",
    gradeOrRank: "Rank Band: 101–150 (Engineering Category)",
    scoreOrId: "Ministry of Education, Government of India",
    validFrom: "2024",
    validTill: "2025",
    certificateRef: "NIRF-2024-ENG-RANK-REPORT.pdf",
    scope: "Teaching Learning Resources (TLR), Graduation Outcomes (GO) & Outreach (OI)",
  },
  {
    id: "acc_iso",
    agency: "International Organization for Standardization",
    badge: "ISO 9001:2015",
    status: "VERIFIED",
    gradeOrRank: "Quality Management System (QMS)",
    scoreOrId: "Certificate ID: ISO-QMS-EDU-45190",
    validFrom: "Jan 2023",
    validTill: "Jan 2026",
    certificateRef: "ISO9001-2015-QMS-DEC.pdf",
    scope: "Design & Delivery of Professional Engineering Education & Campus Services",
  },
];

export function UniversityAccreditationsScreen({ onNavigate }: UniversityAccreditationsScreenProps) {
  const [records] = useState<AccreditationRecord[]>(ACCREDITATIONS);

  const handleDownloadCert = (ref: string) => {
    toast.success("Downloading Certificate", {
      description: `Accessing secure verification file: ${ref}`,
    });
  };

  const handleAddDocument = () => {
    toast.info("Upload New Accreditation Document", {
      description: "Redirecting to statutory document verification desk.",
    });
    onNavigate?.("documents");
  };

  return (
    <div className="space-y-6">
      {/* ─── Header Section ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Institutional Accreditations & Regulatory Approvals
                </h2>
                <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                  6 ACTIVE APPROVALS
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Statutory accreditations verified by the jobson.id Institutional Compliance Desk.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddDocument}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Submit Revision
          </button>
        </div>

        {/* Quick summary grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-5 dark:border-white/10">
          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">NAAC Grade</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">A++ (3.65)</p>
            <p className="text-[10px] text-muted-foreground">Valid till Nov 2028</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">NBA Standing</p>
            <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">Tier-1 Accr.</p>
            <p className="text-[10px] text-muted-foreground">4 core branches</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">UGC Autonomy</p>
            <p className="mt-1 text-lg font-bold text-violet-600 dark:text-violet-400">2(f) & 12(B)</p>
            <p className="text-[10px] text-muted-foreground">Valid till 2028</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3 dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-[11px] font-semibold text-muted-foreground">AICTE Standing</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">EOA 2024-25</p>
            <p className="text-[10px] text-muted-foreground">Permanent ID: 1-3829104</p>
          </div>
        </div>
      </section>

      {/* ─── Accreditation Cards ─── */}
      <section className="space-y-4">
        {records.map((acc) => (
          <div
            key={acc.id}
            className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground dark:text-white">
                    {acc.agency}
                  </h3>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    {acc.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> {acc.status}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-foreground dark:text-slate-200">
                  {acc.gradeOrRank}
                </p>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  {acc.scoreOrId}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadCert(acc.certificateRef)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted dark:border-white/10 dark:bg-slate-950/60 dark:text-white cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Certificate PDF
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl border border-border/60 bg-muted/20 p-3 text-xs sm:grid-cols-3 dark:border-white/5 dark:bg-slate-950/40">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground">Validity Period:</span>
                <p className="font-medium text-foreground dark:text-slate-300">
                  {acc.validFrom} — {acc.validTill}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] font-semibold text-muted-foreground">Audited Scope:</span>
                <p className="font-medium text-foreground dark:text-slate-300">{acc.scope}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("company-info")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← MoU & Agreement
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("legal-tax")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Legal & Tax Info →
        </button>
      </div>
    </div>
  );
}
