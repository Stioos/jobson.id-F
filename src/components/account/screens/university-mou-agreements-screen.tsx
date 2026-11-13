"use client";

import { useState } from "react";
import {
  FileSignature, Handshake, CheckCircle2, Clock, AlertTriangle, Download,
  Layers, ChevronRight, Check, ArrowRight, ShieldCheck, Sparkles, Building2,
  Calendar, RotateCcw, FileText
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityMouAgreementsScreenProps {
  onNavigate?: (sectionId: string) => void;
}

// 17-stage lifecycle definition directly from college.ts
const LIFECYCLE_STAGES = [
  { key: "COLLEGE_LEAD", label: "College Lead" },
  { key: "APPLICATION", label: "Partnership Application" },
  { key: "INSTITUTION_VERIFICATION", label: "Institution Verification" },
  { key: "COMPLIANCE_KYC", label: "Compliance / KYC" },
  { key: "MODEL_SELECTION", label: "Model Selection" },
  { key: "COMMERCIAL_APPROVAL", label: "Commercial Approval" },
  { key: "MOU_AGREEMENT", label: "MoU / Agreement" },
  { key: "APPROVAL", label: "Approval" },
  { key: "COLLEGE_ACTIVATION", label: "College Activation" },
  { key: "PROGRAMS_ACTIVATION", label: "Programs Activation" }, // Current active stage (index 9)
  { key: "STUDENT_ENROLLMENT", label: "Student Enrollment" },
  { key: "TRAINING_CERTIFICATION", label: "Training & Certification" },
  { key: "PROJECTS_INTERNSHIP", label: "Projects & Internship" },
  { key: "PLACEMENT", label: "Placement" },
  { key: "REVENUE_SETTLEMENT", label: "Revenue & Settlement" },
  { key: "PERFORMANCE_REVIEW", label: "Performance Review" },
  { key: "RENEWAL", label: "Renewal" },
];

const PARTNERSHIP_MODELS = [
  {
    code: "Model A",
    id: "COLLEGE_A",
    name: "College Training Partner",
    tagline: "College provides labs & mobilizes students — jobson.id powers curriculum, platform & certification.",
    partnerShare: "65%",
    bestFor: "Colleges with labs, classrooms & active T&P Cell",
    isCurrent: true,
    highlights: [
      "Campus labs & classrooms provided by college",
      "College faculty co-delivers with jobson.id master trainers",
      "Students mobilized from enrolled engineering departments",
      "Revenue settlement on program fees as per MoU schedule",
    ],
  },
  {
    code: "Model B",
    id: "COLLEGE_B",
    name: "Centre Co-Location Partner",
    tagline: "Dedicated on-campus jobson.id training centre serving both college students & external learners.",
    partnerShare: "70%",
    bestFor: "Institutions with surplus lab capacity in urban education hubs",
    isCurrent: false,
    highlights: [
      "Dedicated branded campus wing for jobson.id academy",
      "Weekend & evening batches for external working professionals",
      "Shared facility rental & tuition split model",
    ],
  },
  {
    code: "Model C",
    id: "COLLEGE_C",
    name: "Curriculum Integration Partner",
    tagline: "jobson.id modules embedded directly into credit-bearing university semester electives.",
    partnerShare: "60%",
    bestFor: "Autonomous colleges & private universities with flexible syllabus",
    isCurrent: false,
    highlights: [
      "Direct Board of Studies (BoS) syllabus integration",
      "Semester credits awarded for certified capstones",
      "Faculty train-the-trainer annual enablement program",
    ],
  },
  {
    code: "Model D",
    id: "COLLEGE_D",
    name: "Talent & Recruitment Pipeline",
    tagline: "Fast-track corporate placement drives & hiring mandates for final-year graduating cohorts.",
    partnerShare: "50%",
    bestFor: "Colleges aiming to scale campus placements & Tier-1 IT offers",
    isCurrent: false,
    highlights: [
      "Exclusive access to jobson.id 200+ employer partner drives",
      "Pre-placement bootcamps & mock technical interviews",
      "Success-fee and placement bounty sharing model",
    ],
  },
  {
    code: "Model E",
    id: "COLLEGE_E",
    name: "Full AI Campus Ecosystem",
    tagline: "All-in-one institutional transformation: AI labs, research capstones, placements & incubator.",
    partnerShare: "75%",
    bestFor: "Top-tier universities seeking premier institutional branding",
    isCurrent: false,
    highlights: [
      "Comprehensive cloud AI infrastructure & GPU credits",
      "Industry-sponsored hackathons & student patent support",
      "White-labeled student career portal & alumni network",
    ],
  },
];

export function UniversityMouAgreementsScreen({ onNavigate }: UniversityMouAgreementsScreenProps) {
  const currentStageIndex = 9; // Programs Activation
  const [selectedModel, setSelectedModel] = useState<string>("COLLEGE_A");

  const handleDownloadMou = () => {
    toast.success("Downloading Executed MoU", {
      description: "MOU-2024-COL-0001_Signed_Executed.pdf is being downloaded.",
    });
  };

  const handleInitiateRenewal = () => {
    toast.success("Renewal Workflow Initiated", {
      description: "Notification dispatched to jobson.id Institutional Partnership Manager.",
    });
  };

  return (
    <div className="space-y-6">
      {/* ─── Renewal Alert Banner ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs dark:border-amber-500/20 dark:bg-amber-500/10">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Clock className="h-4 w-4" />
          </span>
          <div>
            <p className="font-bold text-foreground dark:text-white">
              Active MoU Renewal Notice — 55 Days Remaining
            </p>
            <p className="text-muted-foreground dark:text-slate-300">
              Your 3-Year Institutional Partnership Agreement reaches term on January 7, 2027. Commercial revision & seat quota allocation can now be locked.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadMou}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted dark:border-white/10 dark:bg-slate-900 dark:text-white cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Download Copy
          </button>
          <button
            type="button"
            onClick={handleInitiateRenewal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-500 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Start Renewal
          </button>
        </div>
      </div>

      {/* ─── Active Agreement Card ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <FileSignature className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Institutional Skilling & Campus Placement Agreement
                </h2>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  SIGNED & ACTIVE
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground dark:text-slate-400">
                MoU Reference: MOU-2024-COL-0001 • Deccan Institute of Science & Technology & jobson.id
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4 dark:border-white/10">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Effective Start Date</p>
            <p className="mt-1 text-xs font-bold text-foreground dark:text-white">January 8, 2024</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Term Expiry Date</p>
            <p className="mt-1 text-xs font-bold text-foreground dark:text-white">January 7, 2027</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Partner Revenue Share</p>
            <p className="mt-1 text-xs font-bold text-teal-600 dark:text-teal-400">65% Gross Tuition</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">Authorized Signatory</p>
            <p className="mt-1 text-xs font-bold text-foreground dark:text-white">Dr. Anitha Raghavan (Principal)</p>
          </div>
        </div>
      </section>

      {/* ─── 17-Stage Lifecycle Stepper ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground dark:text-white">
              Institutional Partnership Lifecycle Standing
            </h3>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              Stage {currentStageIndex + 1} of {LIFECYCLE_STAGES.length} — {LIFECYCLE_STAGES[currentStageIndex].label}
            </p>
          </div>
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300">
            {Math.round(((currentStageIndex + 1) / LIFECYCLE_STAGES.length) * 100)}% Lifecycle Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-white/10 mb-6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 transition-all duration-500"
            style={{ width: `${((currentStageIndex + 1) / LIFECYCLE_STAGES.length) * 100}%` }}
          />
        </div>

        {/* Stepper items (horizontal scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {LIFECYCLE_STAGES.map((s, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={s.key}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition",
                  isCurrent
                    ? "border-violet-500 bg-violet-500/10 font-bold text-violet-700 dark:text-violet-300"
                    : isDone
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-muted/30 text-muted-foreground opacity-60 dark:border-white/5"
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : isCurrent ? (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-600 text-[9px] font-bold text-white">
                    {idx + 1}
                  </span>
                ) : (
                  <span className="text-[10px]">{idx + 1}</span>
                )}
                <span className="whitespace-nowrap">{s.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Partnership Models Matrix (Model A–E) ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground dark:text-white">
            Available Partnership Models & Engagement Tiers
          </h3>
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            {formDataInstitutionName(formDataInstitutionName)} is currently enrolled under <strong className="text-foreground dark:text-white">Model A (College Training Partner)</strong>. You may upgrade or expand model coverage during renewal.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {PARTNERSHIP_MODELS.map((model) => {
            const isSelected = selectedModel === model.id;
            return (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl border p-5 transition cursor-pointer",
                  isSelected
                    ? "border-emerald-500/60 bg-emerald-50/50 ring-1 ring-emerald-500/30 dark:border-emerald-500/40 dark:bg-emerald-500/5"
                    : "border-border bg-card/50 hover:border-emerald-500/30 dark:border-white/10 dark:bg-slate-950/40"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-foreground dark:bg-white/10 dark:text-slate-300">
                      {model.code}
                    </span>
                    {model.isCurrent && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        ACTIVE MODEL
                      </span>
                    )}
                  </div>

                  <h4 className="mt-3 text-sm font-bold text-foreground dark:text-white">
                    {model.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                    {model.tagline}
                  </p>

                  <div className="mt-4 border-t border-border pt-3 dark:border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Key Highlights:
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground dark:text-slate-300">
                      {model.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-3 dark:border-white/5">
                  <span className="text-[11px] text-muted-foreground">Partner Share:</span>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                    {model.partnerShare}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("business")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Institution Profile
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("registrations-licences")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Accreditation & Approvals →
        </button>
      </div>
    </div>
  );
}

function formDataInstitutionName(_: any) {
  return "Deccan Institute of Science & Technology";
}
