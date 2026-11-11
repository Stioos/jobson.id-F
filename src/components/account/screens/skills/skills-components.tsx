"use client";

import { useState, useMemo } from "react";
import {
  Star, Pencil, Trash2, Crown, Check, X, Loader2, Save, Plus,
  Award, ShieldCheck, Calendar, Globe, Hash, Building2, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SearchableCombobox } from "../education/searchable-combobox";
import {
  SKILL_CATEGORIES, SKILLS_BY_CATEGORY,
  PROFICIENCY_LEVELS, PROFICIENCY_COLOR, EXPERIENCE_TYPES,
  CERTIFICATION_CATEGORIES, CERT_ISSUING_ORGS, CERT_STATUSES,
  LICENSE_CATEGORIES, LICENSE_AUTHORITIES, LICENSE_STATUSES,
  COUNTRIES, YEARS_OPTIONS, MONTHS_OPTIONS,
} from "@/data/skills-data";

// ============================================================
// Shared types
// ============================================================
export interface SkillRecord {
  id: string;
  name: string;
  categoryId: string;
  proficiency: string;
  years: string;
  months: string;
  experienceType: string;
  lastUsed: string;
  isPrimary: boolean;
  description: string;
  isCustom: boolean;
}

export interface CertificationRecord {
  id: string;
  name: string;
  category: string;
  issuingOrg: string;
  credentialId: string;
  issueDate: string;
  expiryDate: string;
  neverExpires: boolean;
  verificationUrl: string;
  status: string;
}

export interface LicenseRecord {
  id: string;
  name: string;
  category: string;
  issuingAuthority: string;
  licenseNumber: string;
  jurisdiction: string;
  issueDate: string;
  expiryDate: string;
  neverExpires: boolean;
  status: string;
}

// ============================================================
// Reusable field wrapper (matches existing UI style)
// ============================================================
function Field({ label, required, hint, children, className }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground/70 dark:text-slate-500">{hint}</p>}
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-center gap-2.5 border-b border-border/60 pb-3 dark:border-white/10">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">{icon}</span>
      <div>
        <h4 className="text-sm font-bold text-foreground dark:text-white">{title}</h4>
        {subtitle && <p className="text-[11px] text-muted-foreground dark:text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

// ============================================================
// Empty record factories
// ============================================================
export function emptySkill(categoryId: string): SkillRecord {
  return {
    id: "",
    name: "",
    categoryId,
    proficiency: "Intermediate",
    years: "0",
    months: "0",
    experienceType: "Professional",
    lastUsed: "",
    isPrimary: false,
    description: "",
    isCustom: false,
  };
}

export function emptyCert(): CertificationRecord {
  return {
    id: "",
    name: "",
    category: "",
    issuingOrg: "",
    credentialId: "",
    issueDate: "",
    expiryDate: "",
    neverExpires: false,
    verificationUrl: "",
    status: "Active",
  };
}

export function emptyLicense(): LicenseRecord {
  return {
    id: "",
    name: "",
    category: "",
    issuingAuthority: "",
    licenseNumber: "",
    jurisdiction: "",
    issueDate: "",
    expiryDate: "",
    neverExpires: false,
    status: "Active",
  };
}

// ============================================================
// Validation
// ============================================================
export function validateSkill(s: SkillRecord): string | null {
  if (!s.name.trim()) return "Please enter or select a Skill Name.";
  if (!s.categoryId) return "Please select a Skill Category.";
  if (!s.proficiency) return "Please select a Proficiency Level.";
  if (!s.experienceType) return "Please select an Experience Type.";
  return null;
}

export function validateCert(c: CertificationRecord): string | null {
  if (!c.name.trim()) return "Please enter the Certification Name.";
  if (!c.issuingOrg.trim()) return "Please enter the Issuing Organization.";
  if (!c.issueDate) return "Please select the Issue Date.";
  if (!c.neverExpires && !c.expiryDate) return "Please select an Expiry Date or enable Never Expires.";
  if (!c.status) return "Please select a Certification Status.";
  return null;
}

export function validateLicense(l: LicenseRecord): string | null {
  if (!l.name.trim()) return "Please enter the License Name.";
  if (!l.issuingAuthority.trim()) return "Please enter the Issuing Authority.";
  if (!l.licenseNumber.trim()) return "Please enter the License Number.";
  if (!l.issueDate) return "Please select the Issue Date.";
  if (!l.neverExpires && !l.expiryDate) return "Please select an Expiry Date or enable Never Expires.";
  if (!l.status) return "Please select a License Status.";
  return null;
}

// ============================================================
// Skill Form
// ============================================================
interface SkillFormProps {
  initial: SkillRecord;
  onSave: (skill: SkillRecord) => void;
  onCancel: () => void;
  existingNames: string[];
  isEditing: boolean;
}

export function SkillForm({ initial, onSave, onCancel, existingNames, isEditing }: SkillFormProps) {
  const [form, setForm] = useState<SkillRecord>(initial);
  const [isSaving, setIsSaving] = useState(false);

  const set = <K extends keyof SkillRecord>(k: K, v: SkillRecord[K]) => setForm((p) => ({ ...p, [k]: v }));

  // Skill options depend on category; always allow manual entry
  const skillOptions = useMemo(() => SKILLS_BY_CATEGORY[form.categoryId] || [], [form.categoryId]);

  // When category changes, reset name (since skill options change)
  const handleCategoryChange = (categoryId: string) => {
    setForm((p) => ({ ...p, categoryId, name: "" }));
  };

  // When skill selected from dropdown, check if it's in the predefined list (isCustom=false),
  // otherwise (manual entry) mark isCustom=true
  const handleSkillNameChange = (name: string) => {
    const isPredefined = skillOptions.some((s) => s.toLowerCase() === name.toLowerCase());
    setForm((p) => ({ ...p, name, isCustom: !isPredefined }));
  };

  const handleSubmit = () => {
    const err = validateSkill(form);
    if (err) { toast.error(err); return; }
    // duplicate check (case-insensitive, exclude the one being edited)
    const lower = form.name.trim().toLowerCase();
    if (existingNames.some((n) => n.toLowerCase() === lower)) {
      toast.error("This skill is already added. Duplicates are not allowed.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      onSave({ ...form, name: form.name.trim() });
      setIsSaving(false);
    }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      <SectionTitle
        icon={<Star className="h-4 w-4" />}
        title={isEditing ? "Edit Skill" : "Add Skill"}
        subtitle="Enter skill details, proficiency and experience"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Skill Category */}
        <Field label="Skill Category" required>
          <Select value={form.categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {SKILL_CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>

        {/* Skill Name — searchable, manual entry */}
        <Field label="Skill Name" required className="sm:col-span-2">
          <SearchableCombobox
            options={skillOptions}
            value={form.name}
            onChange={handleSkillNameChange}
            placeholder="Select or search skill"
            searchPlaceholder="Search skill…"
            emptyText="Skill not found — add manually."
            allowManualEntry
            manualEntryPlaceholder="Enter skill name manually…"
            disabled={!form.categoryId}
          />
        </Field>

        {/* Proficiency */}
        <Field label="Proficiency Level" required>
          <Select value={form.proficiency} onValueChange={(v) => set("proficiency", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select proficiency" /></SelectTrigger>
            <SelectContent>
              {PROFICIENCY_LEVELS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>

        {/* Experience — Years + Months */}
        <Field label="Experience (Years)">
          <Select value={form.years} onValueChange={(v) => set("years", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Years" /></SelectTrigger>
            <SelectContent>
              {YEARS_OPTIONS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Experience (Months)">
          <Select value={form.months} onValueChange={(v) => set("months", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Months" /></SelectTrigger>
            <SelectContent>
              {MONTHS_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>

        {/* Experience Type */}
        <Field label="Experience Type" required>
          <Select value={form.experienceType} onValueChange={(v) => set("experienceType", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {EXPERIENCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>

        {/* Last Used */}
        <Field label="Last Used" hint="YYYY-MM or pick a year">
          <Input
            type="month"
            value={form.lastUsed}
            onChange={(e) => set("lastUsed", e.target.value)}
            className="h-9 rounded-lg"
          />
        </Field>

        {/* Primary Skill */}
        <Field label="Primary Skill">
          <Select value={form.isPrimary ? "Yes" : "No"} onValueChange={(v) => set("isPrimary", v === "Yes")}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Skill Description */}
        <Field label="Skill Description" className="sm:col-span-2 lg:col-span-3" hint="Optional">
          <Textarea
            rows={2}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Brief description of how you've applied this skill…"
            className="resize-y rounded-lg text-xs"
          />
        </Field>
      </div>

      {/* Actions */}
      <div className="mt-5 flex justify-end gap-2 border-t border-border/60 pt-4 dark:border-white/10">
        <Button variant="outline" onClick={onCancel} className="h-9 rounded-lg text-xs">Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="h-9 rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> {isEditing ? "Update" : "Save"} Skill</>}
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// Skill Card (display)
// ============================================================
interface SkillCardProps {
  skill: SkillRecord;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePrimary: () => void;
}

export function SkillCard({ skill, onEdit, onDelete, onTogglePrimary }: SkillCardProps) {
  const category = SKILL_CATEGORIES.find((c) => c.id === skill.categoryId);
  const expLabel = [
    skill.years === "0" ? null : skill.years === "30+" ? "30+ yrs" : `${skill.years} yr${skill.years === "1" ? "" : "s"}`,
    skill.months === "0" ? null : `${skill.months} mo${skill.months === "1" ? "" : "s"}`,
  ].filter(Boolean).join(" ") || "0";

  return (
    <div className={cn(
      "relative rounded-2xl border bg-background/80 p-3.5 transition-all dark:bg-slate-950/40",
      skill.isPrimary
        ? "border-amber-500/50 ring-1 ring-amber-500/20 dark:border-amber-500/40"
        : "border-border/70 dark:border-white/5"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-bold text-foreground dark:text-white">{skill.name}</p>
            {skill.isPrimary && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                <Crown className="h-2.5 w-2.5" /> Primary
              </span>
            )}
            {skill.isCustom && (
              <span className="rounded-full bg-purple-500/15 px-1.5 py-0.5 text-[9px] font-bold text-purple-600 dark:text-purple-400">Custom</span>
            )}
          </div>
          {category && (
            <p className="mt-0.5 text-[10px] text-muted-foreground dark:text-slate-400">{category.name}</p>
          )}
          <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground dark:text-slate-400">
            <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold", PROFICIENCY_COLOR[skill.proficiency] || "bg-muted text-muted-foreground")}>{skill.proficiency}</span>
            <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{expLabel}</span>
            <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{skill.experienceType}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={onTogglePrimary}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer",
              skill.isPrimary
                ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/15 dark:hover:text-amber-400"
            )}
            aria-label="Toggle primary"
            title={skill.isPrimary ? "Unmark primary" : "Mark as primary"}
          >
            <Crown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-400 cursor-pointer"
            aria-label="Edit skill"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 cursor-pointer"
            aria-label="Delete skill"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {skill.description && (
        <p className="mt-2 text-[11px] text-muted-foreground dark:text-slate-400 line-clamp-2">{skill.description}</p>
      )}
    </div>
  );
}

// ============================================================
// Certification Form
// ============================================================
interface CertificationFormProps {
  initial: CertificationRecord;
  onSave: (cert: CertificationRecord) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function CertificationForm({ initial, onSave, onCancel, isEditing }: CertificationFormProps) {
  const [form, setForm] = useState<CertificationRecord>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const set = <K extends keyof CertificationRecord>(k: K, v: CertificationRecord[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const err = validateCert(form);
    if (err) { toast.error(err); return; }
    setIsSaving(true);
    setTimeout(() => { onSave({ ...form, name: form.name.trim() }); setIsSaving(false); }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      <SectionTitle
        icon={<Award className="h-4 w-4" />}
        title={isEditing ? "Edit Certification" : "Add Certification"}
        subtitle="Professional certifications and credentials"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Certification Name" required className="sm:col-span-2 lg:col-span-2">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" className="h-9 rounded-lg" />
        </Field>
        <Field label="Certification Category" required>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CERTIFICATION_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Issuing Organization" required className="sm:col-span-2 lg:col-span-2">
          <SearchableCombobox
            options={CERT_ISSUING_ORGS}
            value={form.issuingOrg}
            onChange={(v) => set("issuingOrg", v)}
            placeholder="Select or search organization"
            searchPlaceholder="Search organization…"
            emptyText="Organization not found."
            allowManualEntry
            manualEntryPlaceholder="Enter organization manually…"
          />
        </Field>
        <Field label="Credential ID">
          <Input value={form.credentialId} onChange={(e) => set("credentialId", e.target.value)} placeholder="e.g. AWS-PSA-1234567" className="h-9 rounded-lg" />
        </Field>

        <Field label="Issue Date" required>
          <Input type="date" value={form.issueDate} onChange={(e) => set("issueDate", e.target.value)} className="h-9 rounded-lg" />
        </Field>
        <Field label="Expiry Date" required={!form.neverExpires}>
          <Input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} disabled={form.neverExpires} className="h-9 rounded-lg" />
        </Field>
        <Field label="Never Expires">
          <label className="flex h-9 cursor-pointer items-center gap-2 text-xs font-semibold text-foreground dark:text-slate-200">
            <input type="checkbox" checked={form.neverExpires} onChange={(e) => set("neverExpires", e.target.checked)} className="h-4 w-4 rounded border-border accent-cyan-500 dark:border-white/20" />
            <Check className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" /> Never expires
          </label>
        </Field>

        <Field label="Verification URL" className="sm:col-span-2 lg:col-span-2" hint="Link to verify this credential">
          <Input value={form.verificationUrl} onChange={(e) => set("verificationUrl", e.target.value)} placeholder="https://…" className="h-9 rounded-lg" />
        </Field>
        <Field label="Certification Status" required>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {CERT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="mt-5 flex justify-end gap-2 border-t border-border/60 pt-4 dark:border-white/10">
        <Button variant="outline" onClick={onCancel} className="h-9 rounded-lg text-xs">Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving} className="h-9 rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">
          {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> {isEditing ? "Update" : "Save"} Certification</>}
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// Certification Card
// ============================================================
export function CertificationCard({ cert, onEdit, onDelete }: { cert: CertificationRecord; onEdit: () => void; onDelete: () => void }) {
  const statusColor = cert.status === "Active" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
    : cert.status === "Expired" || cert.status === "Revoked" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
    : "bg-amber-500/15 text-amber-600 dark:text-amber-400";

  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4 dark:border-white/5 dark:bg-slate-950/40">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400"><Award className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground dark:text-white">{cert.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{cert.issuingOrg}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground dark:text-slate-400">
              {cert.category && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{cert.category}</span>}
              {cert.credentialId && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Hash className="h-2.5 w-2.5" /> {cert.credentialId}</span>}
              {cert.issueDate && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Calendar className="h-2.5 w-2.5" /> {cert.issueDate}</span>}
              {cert.neverExpires ? (
                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 dark:text-emerald-400"><Check className="h-2.5 w-2.5" /> Never expires</span>
              ) : cert.expiryDate && (
                <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Calendar className="h-2.5 w-2.5" /> Exp {cert.expiryDate}</span>
              )}
              {cert.verificationUrl && (
                <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 rounded bg-cyan-500/10 px-1.5 py-0.5 text-cyan-600 hover:underline dark:text-cyan-400"><ExternalLink className="h-2.5 w-2.5" /> Verify</a>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", statusColor)}>
            {cert.status === "Active" ? <Check className="h-2.5 w-2.5" /> : <Award className="h-2.5 w-2.5" />} {cert.status}
          </span>
          <button type="button" onClick={onEdit} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-400 cursor-pointer" aria-label="Edit certification"><Pencil className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onDelete} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 cursor-pointer" aria-label="Delete certification"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// License Form
// ============================================================
interface LicenseFormProps {
  initial: LicenseRecord;
  onSave: (license: LicenseRecord) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function LicenseForm({ initial, onSave, onCancel, isEditing }: LicenseFormProps) {
  const [form, setForm] = useState<LicenseRecord>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const set = <K extends keyof LicenseRecord>(k: K, v: LicenseRecord[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const err = validateLicense(form);
    if (err) { toast.error(err); return; }
    setIsSaving(true);
    setTimeout(() => { onSave({ ...form, name: form.name.trim() }); setIsSaving(false); }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      <SectionTitle
        icon={<ShieldCheck className="h-4 w-4" />}
        title={isEditing ? "Edit Professional License" : "Add Professional License"}
        subtitle="Licenses required to practise a profession"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="License Name" required className="sm:col-span-2 lg:col-span-2">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Medical Practitioner License" className="h-9 rounded-lg" />
        </Field>
        <Field label="License Category" required>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {LICENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Issuing Authority" required className="sm:col-span-2 lg:col-span-2">
          <SearchableCombobox
            options={LICENSE_AUTHORITIES}
            value={form.issuingAuthority}
            onChange={(v) => set("issuingAuthority", v)}
            placeholder="Select or search authority"
            searchPlaceholder="Search authority…"
            emptyText="Authority not found."
            allowManualEntry
            manualEntryPlaceholder="Enter authority manually…"
          />
        </Field>
        <Field label="License Number" required>
          <Input value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} placeholder="e.g. KA-2023-LMV-1234567" className="h-9 rounded-lg" />
        </Field>

        <Field label="Country / Jurisdiction">
          <Select value={form.jurisdiction} onValueChange={(v) => set("jurisdiction", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Issue Date" required>
          <Input type="date" value={form.issueDate} onChange={(e) => set("issueDate", e.target.value)} className="h-9 rounded-lg" />
        </Field>
        <Field label="Expiry Date" required={!form.neverExpires}>
          <Input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} disabled={form.neverExpires} className="h-9 rounded-lg" />
        </Field>

        <Field label="Never Expires">
          <label className="flex h-9 cursor-pointer items-center gap-2 text-xs font-semibold text-foreground dark:text-slate-200">
            <input type="checkbox" checked={form.neverExpires} onChange={(e) => set("neverExpires", e.target.checked)} className="h-4 w-4 rounded border-border accent-cyan-500 dark:border-white/20" />
            <Check className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" /> Never expires
          </label>
        </Field>

        <Field label="License Status" required>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {LICENSE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="mt-5 flex justify-end gap-2 border-t border-border/60 pt-4 dark:border-white/10">
        <Button variant="outline" onClick={onCancel} className="h-9 rounded-lg text-xs">Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving} className="h-9 rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">
          {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> {isEditing ? "Update" : "Save"} License</>}
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// License Card
// ============================================================
export function LicenseCard({ license, onEdit, onDelete }: { license: LicenseRecord; onEdit: () => void; onDelete: () => void }) {
  const statusColor = license.status === "Active" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
    : license.status === "Expired" || license.status === "Revoked" || license.status === "Suspended" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
    : "bg-amber-500/15 text-amber-600 dark:text-amber-400";

  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4 dark:border-white/5 dark:bg-slate-950/40">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400"><ShieldCheck className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground dark:text-white">{license.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{license.issuingAuthority}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground dark:text-slate-400">
              {license.category && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{license.category}</span>}
              {license.licenseNumber && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Hash className="h-2.5 w-2.5" /> {license.licenseNumber}</span>}
              {license.jurisdiction && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Globe className="h-2.5 w-2.5" /> {license.jurisdiction}</span>}
              {license.issueDate && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Calendar className="h-2.5 w-2.5" /> {license.issueDate}</span>}
              {license.neverExpires ? (
                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 dark:text-emerald-400"><Check className="h-2.5 w-2.5" /> Never expires</span>
              ) : license.expiryDate && (
                <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Calendar className="h-2.5 w-2.5" /> Exp {license.expiryDate}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", statusColor)}>
            {license.status === "Active" ? <Check className="h-2.5 w-2.5" /> : <ShieldCheck className="h-2.5 w-2.5" />} {license.status}
          </span>
          <button type="button" onClick={onEdit} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-400 cursor-pointer" aria-label="Edit license"><Pencil className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onDelete} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 cursor-pointer" aria-label="Delete license"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
