"use client";

import { useState, useRef } from "react";
import {
  FileText, Upload, Check, X, Clock, ShieldCheck, FileBadge,
  Award, Briefcase, IdCard, Users, ChevronRight, AlertTriangle, FileCheck2, FileStack, Plus, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployeeProfile } from "@/hooks/use-employee-profile";

type VerificationStatus = "Verified" | "Pending" | "Rejected" | "Not Submitted";

interface ResumeDocumentsScreenProps {
  onNavigate?: (sectionId: string) => void;
}

export function ResumeDocumentsScreen({ onNavigate }: ResumeDocumentsScreenProps) {
  const { profile, updateProfile } = useEmployeeProfile();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [docUploadTarget, setDocUploadTarget] = useState<string | null>(null);
  const [showRefForm, setShowRefForm] = useState(false);
  const [newRef, setNewRef] = useState({ name: "", designation: "", contact: "" });

  const resumes = profile.resumes;
  const references = profile.references;

  const documents = [
    { id: "edu-certs", label: "Education Certificates", desc: "Degree certificates and mark sheets", icon: FileBadge, status: "Verified" as VerificationStatus, fileName: "MCA_Certificate.pdf" },
    { id: "exp-letters", label: "Experience Letters", desc: "Relieving letters and service certificates", icon: Briefcase, status: "Pending" as VerificationStatus, fileName: "Experience_Letter.pdf" },
    { id: "certs", label: "Professional Certifications", desc: "Industry certifications and course completions", icon: Award, status: "Not Submitted" as VerificationStatus, fileName: "" },
    { id: "identity", label: "Identity Verification", desc: "Aadhaar, PAN, or Passport (where required)", icon: IdCard, status: "Verified" as VerificationStatus, fileName: "Aadhaar.pdf" },
  ];

  const statusStyles: Record<VerificationStatus, string> = {
    "Verified": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    "Pending": "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    "Rejected": "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    "Not Submitted": "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  };
  const statusIcons: Record<VerificationStatus, typeof Check> = {
    "Verified": Check, "Pending": Clock, "Rejected": X, "Not Submitted": Clock,
  };
  const verifiedCount = documents.filter((d) => d.status === "Verified").length;
  const pendingCount = documents.filter((d) => d.status === "Pending").length;

  // ─── Upload handlers ───
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }
    const newResume = {
      id: `r${Date.now()}`,
      label: `Resume — ${file.name.replace(/\.[^.]+$/, "")}`,
      fileName: file.name,
      updatedAt: "just now",
      isPrimary: false,
    };
    updateProfile({ resumes: [...resumes, newResume] });
    toast.success(`Resume "${file.name}" uploaded successfully!`);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !docUploadTarget) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }
    toast.success(`"${file.name}" uploaded for ${docUploadTarget}. Verification pending.`);
    setDocUploadTarget(null);
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const triggerDocUpload = (docId: string) => {
    setDocUploadTarget(docId);
    setTimeout(() => docInputRef.current?.click(), 50);
  };

  const handleDeleteResume = (id: string) => {
    updateProfile({ resumes: resumes.filter((r) => r.id !== id) });
    toast.success("Resume removed.");
  };

  const handleAddReference = () => {
    if (!newRef.name.trim() || !newRef.contact.trim()) {
      toast.error("Please fill in the reference name and contact.");
      return;
    }
    updateProfile({
      references: [...references, { id: `ref${Date.now()}`, name: newRef.name.trim(), designation: newRef.designation.trim(), contact: newRef.contact.trim(), status: "Pending" as const }],
    });
    setNewRef({ name: "", designation: "", contact: "" });
    setShowRefForm(false);
    toast.success("Reference added successfully!");
  };

  const handleDeleteReference = (id: string) => {
    updateProfile({ references: references.filter((r) => r.id !== id) });
    toast.success("Reference removed.");
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
      <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleDocUpload} className="hidden" />

      {/* Header */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-7 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <FileCheck2 className="h-6 w-6" />
          </span>
        </div>
      </section>

      {/* Verification Summary */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center gap-2.5 pb-4">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-foreground dark:text-white">Verification Status</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{verifiedCount}</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground dark:text-slate-400">Verified</p>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground dark:text-slate-400">Pending</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/80 p-4 text-center dark:border-white/5 dark:bg-slate-950/40">
            <p className="text-2xl font-extrabold text-foreground dark:text-white">{documents.length}</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground dark:text-slate-400">Total</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{Math.round((verifiedCount / documents.length) * 100)}%</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground dark:text-slate-400">Complete</p>
          </div>
        </div>
      </section>

      {pendingCount > 0 && (
        <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card p-5 dark:via-slate-900/80 dark:to-slate-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">Approval Pending</p>
              <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-300">
                {pendingCount} document(s) under review. You will be notified once verification is complete.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Resume Versions */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <FileStack className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">Resume Versions</h3>
          </div>
          <button type="button" onClick={() => resumeInputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 cursor-pointer">
            <Upload className="h-3.5 w-3.5" /> Upload Resume
          </button>
        </div>
        <div className="space-y-3">
          {resumes.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><FileText className="h-5 w-5" /></span>
                <div>
                  <p className="text-sm font-bold text-foreground dark:text-white">{r.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{r.fileName} · Updated {r.updatedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {r.isPrimary && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><Check className="h-3 w-3" /> Primary</span>}
                <button type="button" onClick={() => resumeInputRef.current?.click()} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white cursor-pointer" aria-label="Replace resume"><Upload className="h-3.5 w-3.5" /></button>
                {!r.isPrimary && (
                  <button type="button" onClick={() => handleDeleteResume(r.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 cursor-pointer" aria-label="Delete resume"><Trash2 className="h-3.5 w-3.5" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Document Upload & Management */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center gap-2.5 pb-4">
          <Upload className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-foreground dark:text-white">Document Upload & Management</h3>
        </div>
        <div className="space-y-3">
          {documents.map((doc) => {
            const Icon = doc.icon;
            const StatusIcon = statusIcons[doc.status];
            return (
              <div key={doc.id} className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
                <div className="flex items-start gap-3">
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", doc.status === "Verified" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400")}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground dark:text-white">{doc.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{doc.desc}</p>
                    {doc.fileName && (
                      <p className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground dark:bg-white/5 dark:text-slate-300"><FileText className="h-3 w-3" /> {doc.fileName}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyles[doc.status])}>
                    <StatusIcon className="h-3 w-3" /> {doc.status}
                  </span>
                  {doc.status !== "Verified" && (
                    <button type="button" onClick={() => triggerDocUpload(doc.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 cursor-pointer">
                      <Upload className="h-3.5 w-3.5" /> {doc.status === "Not Submitted" ? "Upload" : "Re-upload"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* References */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <Users className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">References</h3>
          </div>
          <button type="button" onClick={() => setShowRefForm((v) => !v)} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer">
            {showRefForm ? "Cancel" : "+ Add Reference"}
          </button>
        </div>

        {/* Add Reference Form */}
        {showRefForm && (
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Name *</Label>
              <Input value={newRef.name} onChange={(e) => setNewRef({ ...newRef, name: e.target.value })} placeholder="e.g. Rajesh Sharma" className="h-9 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Designation</Label>
              <Input value={newRef.designation} onChange={(e) => setNewRef({ ...newRef, designation: e.target.value })} placeholder="e.g. Engineering Manager" className="h-9 rounded-lg" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground">Email / Phone *</Label>
              <Input value={newRef.contact} onChange={(e) => setNewRef({ ...newRef, contact: e.target.value })} placeholder="e.g. rajesh@example.com" className="h-9 rounded-lg" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="button" onClick={handleAddReference} className="h-9 rounded-lg bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Reference
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {references.map((ref) => (
            <div key={ref.id} className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400"><Users className="h-5 w-5" /></span>
                <div>
                  <p className="text-sm font-bold text-foreground dark:text-white">{ref.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{ref.designation}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-500">{ref.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", ref.status === "Verified" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400")}>
                  {ref.status === "Verified" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />} {ref.status}
                </span>
                <button type="button" onClick={() => handleDeleteReference(ref.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 cursor-pointer" aria-label="Delete reference"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complete CTA */}
      <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-card p-5 dark:via-slate-900/80 dark:to-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">Profile Verification</p>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Complete all document uploads to submit for verification</p>
            </div>
          </div>
          <button type="button" onClick={() => onNavigate?.("home")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-400 cursor-pointer">
            Back to Overview <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
