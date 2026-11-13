"use client";

import { useState } from "react";
import {
  FolderCheck, ShieldCheck, CheckCircle2, Clock, Download, Upload,
  FileText, Plus, Check, ExternalLink, AlertTriangle, Eye
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityDocumentsVerifyScreenProps {
  onNavigate?: (sectionId: string) => void;
}

// 7 Document Types mapped directly from DOCUMENT_TYPES in college-contracts.ts
interface UniversityDoc {
  key: string;
  category: string;
  name: string;
  fileRef: string;
  fileSize: string;
  uploadedAt: string;
  status: "VERIFIED" | "APPROVED" | "UNDER_REVIEW";
  reviewedBy: string;
  validity: string;
}

const INSTITUTIONAL_DOCS: UniversityDoc[] = [
  {
    key: "REGISTRATION_CERT",
    category: "Registration Certificate / Charter",
    name: "Telangana State University Act Charter & Trust Deed.pdf",
    fileRef: "DOC-REG-TS-ACT-1995-4321.pdf",
    fileSize: "4.8 MB",
    uploadedAt: "2024-01-10",
    status: "VERIFIED",
    reviewedBy: "jobson.id Compliance Desk",
    validity: "Permanent Charter",
  },
  {
    key: "ACCREDITATION",
    category: "Accreditation Documents",
    name: "NAAC Grade A++ Cycle-2 Accreditation Certificate.pdf",
    fileRef: "NAAC-A++-DEC-2023-CERT.pdf",
    fileSize: "2.4 MB",
    uploadedAt: "2024-01-12",
    status: "VERIFIED",
    reviewedBy: "jobson.id Compliance Desk",
    validity: "Valid till Nov 2028",
  },
  {
    key: "AUTHORIZATION_LETTER",
    category: "Signatory Authorization Letter",
    name: "Governing Body Resolution Authorizing Principal Signatory.pdf",
    fileRef: "GB-RES-2024-SIGN-AR.pdf",
    fileSize: "1.2 MB",
    uploadedAt: "2024-01-14",
    status: "APPROVED",
    reviewedBy: "jobson.id Legal Team",
    validity: "Term 2024–2027",
  },
  {
    key: "INSTITUTION_PROOF",
    category: "Campus & Land Infrastructure Proof",
    name: "Campus Land Title Deed & Built-up Area Audit (32 Acres).pdf",
    fileRef: "CAMPUS-INFRA-AUDIT-2024.pdf",
    fileSize: "8.6 MB",
    uploadedAt: "2024-01-15",
    status: "VERIFIED",
    reviewedBy: "jobson.id Audit Cell",
    validity: "Inspected Jan 2024",
  },
  {
    key: "TAX_INFO",
    category: "Tax Exemption & Statutory Identifiers",
    name: "Section 12A & 80G Tax Exemption Certificates & PAN Card.pdf",
    fileRef: "ITBA-EXM-12A-80G-AAATD1234F.pdf",
    fileSize: "3.1 MB",
    uploadedAt: "2024-01-11",
    status: "VERIFIED",
    reviewedBy: "jobson.id Finance Desk",
    validity: "Perpetual 12A Order",
  },
  {
    key: "EXISTING_AGREEMENT",
    category: "Active Executed MoU Agreement",
    name: "jobson.id Institutional Partnership Executed MoU MOU-2024-COL-0001.pdf",
    fileRef: "MOU-2024-COL-0001-EXECUTED.pdf",
    fileSize: "3.8 MB",
    uploadedAt: "2024-01-18",
    status: "APPROVED",
    reviewedBy: "jobson.id Partnership Desk",
    validity: "Valid till Jan 2027",
  },
  {
    key: "OTHER",
    category: "Infrastructure & Computer Labs Inspection",
    name: "Technical Lab Audit & High-Performance Workstations Report.pdf",
    fileRef: "LAB-AUDIT-480-NODES-DEC.pdf",
    fileSize: "5.4 MB",
    uploadedAt: "2024-02-01",
    status: "VERIFIED",
    reviewedBy: "jobson.id Technical Operations",
    validity: "Annual Audit Complete",
  },
];

export function UniversityDocumentsVerifyScreen({ onNavigate }: UniversityDocumentsVerifyScreenProps) {
  const [docs] = useState<UniversityDoc[]>(INSTITUTIONAL_DOCS);

  const handleDownload = (doc: UniversityDoc) => {
    toast.success("Downloading Document", {
      description: `${doc.name} (${doc.fileSize})`,
    });
  };

  const handleUpload = () => {
    toast.success("Upload Document Initiated", {
      description: "Select file to upload to the secure university documents repository.",
    });
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <FolderCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Institutional Verification & Statutory Documents
                </h2>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  7 / 7 VERIFIED
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Official repository of regulatory charters, accreditations, signatory resolutions, and lab audit reports.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpload}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" /> Upload Document
          </button>
        </div>

        {/* Compliance Meter & Health Score (82/100 matching Image 3) */}
        <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-2 dark:border-white/5 dark:bg-slate-950/40">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-muted-foreground">Document Compliance Status</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-white/10">
              <div className="h-full rounded-full bg-emerald-500 w-full" />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              All 7 required statutory verification documents submitted and verified by jobson.id.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-muted-foreground">Partnership Health Score</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">82 / 100 (Healthy)</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-white/10">
              <div className="h-full rounded-full bg-emerald-500 w-[82%]" />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Official institutional health score maintained by the jobson.id Compliance & Operations Desk.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 7 Document Items ─── */}
      <section className="space-y-3">
        {docs.map((doc, idx) => (
          <div
            key={doc.key}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card/80 p-4 shadow-soft transition hover:border-emerald-500/30 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground dark:bg-white/5 dark:text-slate-400">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    #{idx + 1} {doc.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> {doc.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground dark:text-white">
                  {doc.name}
                </h4>
                <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                  <span className="font-mono">{doc.fileRef}</span> • {doc.fileSize} • Uploaded {doc.uploadedAt} • {doc.validity}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleDownload(doc)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted dark:border-white/10 dark:bg-slate-950 dark:text-white cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("industry")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Academic Hierarchy
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("business")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Return to Institution Profile →
        </button>
      </div>
    </div>
  );
}
