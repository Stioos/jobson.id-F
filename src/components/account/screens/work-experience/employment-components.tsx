"use client";

import { useState, useMemo } from "react";
import {
  Building2, Briefcase, Calendar, Banknote, Award, FileText, Plus, Trash2,
  Pencil, Check, X, Loader2, Save, ChevronDown, ChevronUp, MapPin, Globe,
  Clock, AlertTriangle, ShieldCheck, Upload, Crown,
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
  INDUSTRIES, COMPANY_TYPES, COMPANY_SIZES, DEPARTMENTS, FUNCTIONAL_AREAS,
  JOB_LEVELS, EMPLOYMENT_TYPES, WORK_MODES, JOB_CATEGORIES,
  CURRENCIES, SALARY_FREQUENCIES, NOTICE_PERIODS, REASONS_FOR_LEAVING,
  BENEFITS, SKILLS_TECH, KNOWN_COMPANIES, DOCUMENT_TYPES, VERIFICATION_STATUSES,
  VERIFICATION_COLOR,
} from "@/data/work-experience-data";
import { COUNTRIES, getStatesForCountry, getCitiesForState } from "@/data/education-data";
import {
  computeDuration, formatDuration, formatDateShort, formatSalary,
  type DateRange,
} from "./date-utils";

// ============================================================
// Types
// ============================================================
export interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  role: string;
  technologies: string;     // comma-separated
  duration: string;          // free text e.g. "6 months"
  url: string;
  contributions: string;
}

export interface EmploymentDocument {
  id: string;
  type: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;        // ISO
}

export interface EmploymentRecord {
  id: string;
  // Section 1: Company Information
  company: string;
  industry: string;
  companyWebsite: string;
  companyType: string;
  companySize: string;
  country: string;
  state: string;
  city: string;
  officeAddress: string;
  // Section 2: Job & Employment Details
  designation: string;
  department: string;
  functionalArea: string;
  jobLevel: string;
  employmentType: string;
  workMode: string;
  reportingManager: string;
  teamSize: string;
  jobCategory: string;
  // Section 3: Employment Duration
  joiningDate: string;
  isCurrent: boolean;
  leavingDate: string;
  reasonForLeaving: string;
  noticePeriod: string;
  gapExplanation: string;
  // Section 4: Compensation & Benefits
  annualCtc: string;
  fixedSalary: string;
  variableSalary: string;
  currency: string;
  salaryFrequency: string;
  lastDrawnSalary: string;
  benefits: string[];
  // Section 5: Responsibilities, Skills & Achievements
  roleSummary: string;
  responsibilities: string;
  achievements: string;
  skillsUsed: string[];
  technicalSkills: string[];
  toolsTechnologies: string[];
  projects: ProjectRecord[];
  majorContributions: string;
  awardsRecognition: string;
  performanceHighlights: string;
  // Section 6: Documents & Verification
  documents: EmploymentDocument[];
  verificationStatus: string;
  // Meta
  isHighest: boolean;        // marks current/primary employment
}

export function emptyEmployment(): EmploymentRecord {
  return {
    id: "",
    company: "", industry: "", companyWebsite: "", companyType: "", companySize: "",
    country: "", state: "", city: "", officeAddress: "",
    designation: "", department: "", functionalArea: "", jobLevel: "",
    employmentType: "Full-time", workMode: "On-site", reportingManager: "",
    teamSize: "", jobCategory: "",
    joiningDate: "", isCurrent: false, leavingDate: "", reasonForLeaving: "",
    noticePeriod: "", gapExplanation: "",
    annualCtc: "", fixedSalary: "", variableSalary: "", currency: "INR",
    salaryFrequency: "Annually", lastDrawnSalary: "", benefits: [],
    roleSummary: "", responsibilities: "", achievements: "", skillsUsed: [],
    technicalSkills: [], toolsTechnologies: [], projects: [], majorContributions: "",
    awardsRecognition: "", performanceHighlights: "",
    documents: [], verificationStatus: "Not Submitted",
    isHighest: false,
  };
}

export function emptyProject(): ProjectRecord {
  return { id: "", name: "", description: "", role: "", technologies: "", duration: "", url: "", contributions: "" };
}

// ============================================================
// Field wrapper (matches existing UI)
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
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{icon}</span>
      <div>
        <h4 className="text-sm font-bold text-foreground dark:text-white">{title}</h4>
        {subtitle && <p className="text-[11px] text-muted-foreground dark:text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

// ============================================================
// Validation
// ============================================================
export function validateEmployment(e: EmploymentRecord): string | null {
  if (!e.company.trim()) return "Please enter the Company Name.";
  if (!e.industry) return "Please select the Industry.";
  if (!e.designation.trim()) return "Please enter the Job Title / Designation.";
  if (!e.employmentType) return "Please select the Employment Type.";
  if (!e.workMode) return "Please select the Work Mode.";
  if (!e.joiningDate) return "Please select the Joining Date.";
  if (!e.isCurrent && !e.leavingDate) return "Please select the Leaving Date or enable 'Currently Working Here'.";
  if (!e.isCurrent && e.leavingDate && e.joiningDate) {
    if (e.leavingDate < e.joiningDate) return "Leaving Date cannot be earlier than the Joining Date.";
  }
  if (e.joiningDate) {
    const today = new Date().toISOString().slice(0, 10);
    if (e.joiningDate > today) return "Joining Date cannot be in the future.";
  }
  return null;
}

// ============================================================
// Multi-select chip input (used for skills / tools / benefits)
// ============================================================
function MultiSelectChips({ options, selected, onChange, placeholder, allowManual = true }: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  allowManual?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((o) => !selected.includes(o) && (!q || o.toLowerCase().includes(q)));
  }, [options, selected, query]);

  const add = (val: string) => {
    const v = val.trim();
    if (!v) return;
    if (selected.some((s) => s.toLowerCase() === v.toLowerCase())) return;
    onChange([...selected, v]);
    setQuery("");
    setShowList(false);
  };
  const remove = (val: string) => onChange(selected.filter((s) => s !== val));

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-background/80 p-2 min-h-9 dark:border-white/10 dark:bg-slate-950/60">
        {selected.map((s) => (
          <span key={s} className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            {s}
            <button type="button" onClick={() => remove(s)} className="text-emerald-600 hover:text-rose-500 cursor-pointer" aria-label={`Remove ${s}`}><X className="h-2.5 w-2.5" /></button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowList(true); }}
          onFocus={() => setShowList(true)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(query); } }}
          placeholder={selected.length === 0 ? placeholder : "Add more…"}
          className="flex-1 min-w-[120px] bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60 dark:text-white"
        />
      </div>
      {showList && filtered.length > 0 && (
        <div className="relative">
          <div className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md dark:border-white/10 dark:bg-slate-900 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
            {filtered.slice(0, 30).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => add(o)}
                className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-[11px] text-foreground hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-300 cursor-pointer"
              >
                <Plus className="h-2.5 w-2.5" /> {o}
              </button>
            ))}
            {allowManual && query.trim() && !options.some((o) => o.toLowerCase() === query.trim().toLowerCase()) && (
              <button type="button" onClick={() => add(query)} className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-[11px] text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 cursor-pointer">
                <Plus className="h-2.5 w-2.5" /> Add "{query.trim()}" manually
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Project sub-form
// ============================================================
function ProjectSubForm({ project, onChange, onRemove, canRemove }: {
  project: ProjectRecord;
  onChange: (p: ProjectRecord) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const set = <K extends keyof ProjectRecord>(k: K, v: ProjectRecord[K]) => onChange({ ...project, [k]: v });
  return (
    <div className="rounded-xl border border-border/70 bg-background/60 p-3 dark:border-white/5 dark:bg-slate-950/40">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-400">Project</p>
        {canRemove && (
          <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-rose-500 cursor-pointer" aria-label="Remove project"><Trash2 className="h-3 w-3" /></button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Project Name" className="sm:col-span-2 lg:col-span-1">
          <Input value={project.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Payments Platform" className="h-9 rounded-lg" />
        </Field>
        <Field label="Role in Project">
          <Input value={project.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Tech Lead" className="h-9 rounded-lg" />
        </Field>
        <Field label="Project Duration">
          <Input value={project.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 6 months" className="h-9 rounded-lg" />
        </Field>
        <Field label="Technologies Used" className="sm:col-span-2 lg:col-span-3">
          <Input value={project.technologies} onChange={(e) => set("technologies", e.target.value)} placeholder="e.g. React, Node.js, PostgreSQL" className="h-9 rounded-lg" />
        </Field>
        <Field label="Project Description" className="sm:col-span-2 lg:col-span-3">
          <Textarea rows={2} value={project.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief description of the project…" className="resize-y rounded-lg text-xs" />
        </Field>
        <Field label="Key Contributions" className="sm:col-span-2 lg:col-span-2">
          <Textarea rows={2} value={project.contributions} onChange={(e) => set("contributions", e.target.value)} placeholder="Your key contributions to the project…" className="resize-y rounded-lg text-xs" />
        </Field>
        <Field label="Project URL" hint="Optional">
          <Input value={project.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" className="h-9 rounded-lg" />
        </Field>
      </div>
    </div>
  );
}

// ============================================================
// Employment Form (6 sections)
// ============================================================
interface EmploymentFormProps {
  initial: EmploymentRecord;
  onSave: (emp: EmploymentRecord) => void;
  onCancel: () => void;
  isEditing: boolean;
  overlapWarning: string | null;
}

export function EmploymentForm({ initial, onSave, onCancel, isEditing, overlapWarning }: EmploymentFormProps) {
  const [form, setForm] = useState<EmploymentRecord>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const set = <K extends keyof EmploymentRecord>(k: K, v: EmploymentRecord[K]) => setForm((p) => ({ ...p, [k]: v }));

  const stateOptions = useMemo(() => getStatesForCountry(form.country), [form.country]);
  const cityOptions = useMemo(() => getCitiesForState(form.state), [form.state]);

  const handleCountryChange = (country: string) => setForm((p) => ({ ...p, country, state: "", city: "" }));
  const handleStateChange = (state: string) => setForm((p) => ({ ...p, state, city: "" }));

  const handleIsCurrentChange = (isCurrent: boolean) => {
    setForm((p) => ({ ...p, isCurrent, leavingDate: isCurrent ? "" : p.leavingDate }));
  };

  const addProject = () => set("projects", [...form.projects, { ...emptyProject(), id: `p-${Date.now()}` }]);
  const updateProject = (id: string, p: ProjectRecord) => set("projects", form.projects.map((x) => (x.id === id ? p : x)));
  const removeProject = (id: string) => set("projects", form.projects.filter((x) => x.id !== id));

  // Document upload (simulated — stores filename/size only; no real upload per project rules)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    const newDocs: EmploymentDocument[] = [];
    for (const f of Array.from(files)) {
      if (!allowed.includes(f.type)) { toast.error(`${f.name}: Only PDF, JPG, PNG allowed.`); continue; }
      if (f.size > maxSize) { toast.error(`${f.name}: File exceeds 5MB limit.`); continue; }
      newDocs.push({
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: DOCUMENT_TYPES[0],
        fileName: f.name,
        fileSize: (f.size / 1024).toFixed(0) + " KB",
        uploadedAt: new Date().toISOString(),
      });
    }
    if (newDocs.length > 0) {
      set("documents", [...form.documents, ...newDocs]);
      set("verificationStatus", "Pending Verification");
      toast.success(`${newDocs.length} document(s) uploaded.`);
    }
    e.target.value = "";
  };
  const removeDoc = (id: string) => set("documents", form.documents.filter((d) => d.id !== id));
  const updateDocType = (id: string, type: string) => set("documents", form.documents.map((d) => (d.id === id ? { ...d, type } : d)));

  const handleSubmit = () => {
    const err = validateEmployment(form);
    if (err) { toast.error(err); return; }
    setIsSaving(true);
    setTimeout(() => { onSave({ ...form, company: form.company.trim(), designation: form.designation.trim() }); setIsSaving(false); }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      <h3 className="pb-4 text-sm font-bold text-foreground dark:text-white">
        {isEditing ? "Edit Employment Record" : "Add Employment Record"}
      </h3>

      {/* ─── SECTION 01 – COMPANY INFORMATION ─── */}
      <SectionTitle icon={<Building2 className="h-4 w-4" />} title="01 — Company Information" subtitle="Where you worked" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Company Name" required className="sm:col-span-2 lg:col-span-2">
          <SearchableCombobox
            options={KNOWN_COMPANIES}
            value={form.company}
            onChange={(v) => set("company", v)}
            placeholder="Select or search company"
            searchPlaceholder="Search company…"
            emptyText="Company not found — add manually."
            allowManualEntry
            manualEntryPlaceholder="Enter company name manually…"
          />
        </Field>
        <Field label="Industry" required>
          <Select value={form.industry} onValueChange={(v) => set("industry", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select industry" /></SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Company Website" hint="Optional">
          <Input value={form.companyWebsite} onChange={(e) => set("companyWebsite", e.target.value)} placeholder="https://company.com" className="h-9 rounded-lg" />
        </Field>
        <Field label="Company Type">
          <Select value={form.companyType} onValueChange={(v) => set("companyType", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {COMPANY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Company Size">
          <Select value={form.companySize} onValueChange={(v) => set("companySize", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select size" /></SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Country">
          <Select value={form.country} onValueChange={handleCountryChange}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="State / Province">
          <Select value={form.state} onValueChange={handleStateChange} disabled={!form.country}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent>
              {stateOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="City">
          <SearchableCombobox
            options={cityOptions}
            value={form.city}
            onChange={(v) => set("city", v)}
            placeholder="Select or search city"
            searchPlaceholder="Search city…"
            emptyText="City not found."
            allowManualEntry
            manualEntryPlaceholder="Enter city manually…"
            disabled={!form.state}
          />
        </Field>
        <Field label="Office Location / Address" className="sm:col-span-2 lg:col-span-3" hint="Optional">
          <Input value={form.officeAddress} onChange={(e) => set("officeAddress", e.target.value)} placeholder="Building, street, area…" className="h-9 rounded-lg" />
        </Field>
      </div>

      {/* ─── SECTION 02 – JOB & EMPLOYMENT DETAILS ─── */}
      <div className="mt-6">
        <SectionTitle icon={<Briefcase className="h-4 w-4" />} title="02 — Job & Employment Details" subtitle="What you did" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Job Title / Designation" required>
            <Input value={form.designation} onChange={(e) => set("designation", e.target.value)} placeholder="e.g. Senior Software Engineer" className="h-9 rounded-lg" />
          </Field>
          <Field label="Department">
            <Select value={form.department} onValueChange={(v) => set("department", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Functional Area">
            <Select value={form.functionalArea} onValueChange={(v) => set("functionalArea", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select functional area" /></SelectTrigger>
              <SelectContent>
                {FUNCTIONAL_AREAS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Job Level">
            <Select value={form.jobLevel} onValueChange={(v) => set("jobLevel", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>
                {JOB_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Employment Type" required>
            <Select value={form.employmentType} onValueChange={(v) => set("employmentType", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Work Mode" required>
            <Select value={form.workMode} onValueChange={(v) => set("workMode", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select mode" /></SelectTrigger>
              <SelectContent>
                {WORK_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Reporting Manager Designation" hint="Optional">
            <Input value={form.reportingManager} onChange={(e) => set("reportingManager", e.target.value)} placeholder="e.g. Engineering Manager" className="h-9 rounded-lg" />
          </Field>
          <Field label="Team Size Managed" hint="Optional">
            <Input type="number" min={0} value={form.teamSize} onChange={(e) => set("teamSize", e.target.value)} placeholder="e.g. 6" className="h-9 rounded-lg" />
          </Field>
          <Field label="Job Category">
            <Select value={form.jobCategory} onValueChange={(v) => set("jobCategory", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {JOB_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {/* ─── SECTION 03 – EMPLOYMENT DURATION ─── */}
      <div className="mt-6">
        <SectionTitle icon={<Calendar className="h-4 w-4" />} title="03 — Employment Duration" subtitle="When you worked" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Joining Date" required>
            <Input type="date" value={form.joiningDate} onChange={(e) => set("joiningDate", e.target.value)} className="h-9 rounded-lg" />
          </Field>
          <Field label="Currently Working Here">
            <label className="flex h-9 cursor-pointer items-center gap-2 text-xs font-semibold text-foreground dark:text-slate-200">
              <input type="checkbox" checked={form.isCurrent} onChange={(e) => handleIsCurrentChange(e.target.checked)} className="h-4 w-4 rounded border-border accent-emerald-500 dark:border-white/20" />
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Currently working here
            </label>
          </Field>
          {!form.isCurrent && (
            <Field label="Leaving Date" required>
              <Input type="date" value={form.leavingDate} onChange={(e) => set("leavingDate", e.target.value)} className="h-9 rounded-lg" />
            </Field>
          )}
          {!form.isCurrent && (
            <Field label="Reason for Leaving">
              <Select value={form.reasonForLeaving} onValueChange={(v) => set("reasonForLeaving", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  {REASONS_FOR_LEAVING.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          )}
          <Field label="Notice Period">
            <Select value={form.noticePeriod} onValueChange={(v) => set("noticePeriod", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select notice period" /></SelectTrigger>
              <SelectContent>
                {NOTICE_PERIODS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Employment Gap Explanation" hint="Optional" className="sm:col-span-2">
            <Input value={form.gapExplanation} onChange={(e) => set("gapExplanation", e.target.value)} placeholder="e.g. Took a 3-month sabbatical for upskilling" className="h-9 rounded-lg" />
          </Field>
        </div>
        {overlapWarning && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <p className="text-[11px] text-amber-700 dark:text-amber-300">{overlapWarning}</p>
          </div>
        )}
      </div>

      {/* ─── SECTION 04 – COMPENSATION & BENEFITS ─── */}
      <div className="mt-6">
        <SectionTitle icon={<Banknote className="h-4 w-4" />} title="04 — Compensation & Benefits" subtitle="Private — visible only to authorized users" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Currency">
            <Select value={form.currency} onValueChange={(v) => set("currency", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select currency" /></SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Salary Frequency">
            <Select value={form.salaryFrequency} onValueChange={(v) => set("salaryFrequency", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select frequency" /></SelectTrigger>
              <SelectContent>
                {SALARY_FREQUENCIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Annual CTC" hint="Optional">
            <Input type="number" min={0} value={form.annualCtc} onChange={(e) => set("annualCtc", e.target.value)} placeholder="e.g. 2200000" className="h-9 rounded-lg" />
          </Field>
          <Field label="Fixed Salary" hint="Optional">
            <Input type="number" min={0} value={form.fixedSalary} onChange={(e) => set("fixedSalary", e.target.value)} placeholder="e.g. 1800000" className="h-9 rounded-lg" />
          </Field>
          <Field label="Variable Salary" hint="Optional">
            <Input type="number" min={0} value={form.variableSalary} onChange={(e) => set("variableSalary", e.target.value)} placeholder="e.g. 400000" className="h-9 rounded-lg" />
          </Field>
          <Field label="Last Drawn Salary" hint="Optional">
            <Input value={form.lastDrawnSalary} onChange={(e) => set("lastDrawnSalary", e.target.value)} placeholder="e.g. 22,00,000" className="h-9 rounded-lg" />
          </Field>
          <Field label="Benefits & Perks" className="sm:col-span-2 lg:col-span-3">
            <MultiSelectChips
              options={BENEFITS as unknown as string[]}
              selected={form.benefits}
              onChange={(v) => set("benefits", v)}
              placeholder="Add benefits & perks…"
            />
          </Field>
        </div>
      </div>

      {/* ─── SECTION 05 – RESPONSIBILITIES, SKILLS & ACHIEVEMENTS ─── */}
      <div className="mt-6">
        <SectionTitle icon={<Award className="h-4 w-4" />} title="05 — Responsibilities, Skills & Achievements" subtitle="What you delivered" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Role Summary" className="sm:col-span-2 lg:col-span-3">
            <Textarea rows={2} value={form.roleSummary} onChange={(e) => set("roleSummary", e.target.value)} placeholder="One-line summary of your role…" className="resize-y rounded-lg text-xs" />
          </Field>
          <Field label="Key Responsibilities" className="sm:col-span-2 lg:col-span-3">
            <Textarea rows={3} value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} placeholder="Describe your key responsibilities…" className="resize-y rounded-lg text-xs" />
          </Field>
          <Field label="Key Achievements" className="sm:col-span-2 lg:col-span-3">
            <Textarea rows={2} value={form.achievements} onChange={(e) => set("achievements", e.target.value)} placeholder="Notable achievements and measurable impact…" className="resize-y rounded-lg text-xs" />
          </Field>
          <Field label="Skills Used" className="sm:col-span-2 lg:col-span-3">
            <MultiSelectChips options={SKILLS_TECH} selected={form.skillsUsed} onChange={(v) => set("skillsUsed", v)} placeholder="Add skills used…" />
          </Field>
          <Field label="Technical Skills" className="sm:col-span-2 lg:col-span-3">
            <MultiSelectChips options={SKILLS_TECH} selected={form.technicalSkills} onChange={(v) => set("technicalSkills", v)} placeholder="Add technical skills…" />
          </Field>
          <Field label="Tools & Technologies" className="sm:col-span-2 lg:col-span-3">
            <MultiSelectChips options={SKILLS_TECH} selected={form.toolsTechnologies} onChange={(v) => set("toolsTechnologies", v)} placeholder="Add tools & technologies…" />
          </Field>
          <Field label="Major Contributions" className="sm:col-span-2 lg:col-span-3">
            <Textarea rows={2} value={form.majorContributions} onChange={(e) => set("majorContributions", e.target.value)} placeholder="Major contributions to the company/team…" className="resize-y rounded-lg text-xs" />
          </Field>
          <Field label="Awards & Recognition" className="sm:col-span-2 lg:col-span-3">
            <Textarea rows={2} value={form.awardsRecognition} onChange={(e) => set("awardsRecognition", e.target.value)} placeholder="Awards, recognitions, appreciations…" className="resize-y rounded-lg text-xs" />
          </Field>
          <Field label="Performance Highlights" className="sm:col-span-2 lg:col-span-3">
            <Textarea rows={2} value={form.performanceHighlights} onChange={(e) => set("performanceHighlights", e.target.value)} placeholder="Performance ratings, promotions, milestones…" className="resize-y rounded-lg text-xs" />
          </Field>

          {/* Projects */}
          <div className="sm:col-span-2 lg:col-span-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-400">Projects Worked On</p>
              <button type="button" onClick={addProject} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"><Plus className="h-3 w-3" /> Add Project</button>
            </div>
            <div className="space-y-3">
              {form.projects.length === 0 && <p className="text-[11px] text-muted-foreground dark:text-slate-500">No projects added yet.</p>}
              {form.projects.map((p) => (
                <ProjectSubForm key={p.id} project={p} onChange={(np) => updateProject(p.id, np)} onRemove={() => removeProject(p.id)} canRemove />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 06 – DOCUMENTS & EMPLOYMENT VERIFICATION ─── */}
      <div className="mt-6">
        <SectionTitle icon={<FileText className="h-4 w-4" />} title="06 — Documents & Employment Verification" subtitle="Optional document upload" />
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/5 px-4 text-xs font-bold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
              <Upload className="h-3.5 w-3.5" /> Upload Document
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-[10px] text-muted-foreground dark:text-slate-500">PDF, JPG, PNG · max 5MB each</span>
          </div>
          {form.documents.length > 0 && (
            <div className="space-y-2">
              {form.documents.map((d) => (
                <div key={d.id} className="flex flex-col gap-2 rounded-lg border border-border/70 bg-background/60 p-2.5 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileText className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground dark:text-white">{d.fileName}</p>
                      <p className="text-[10px] text-muted-foreground dark:text-slate-500">{d.fileSize} · uploaded {formatDateShort(d.uploadedAt.slice(0, 10))}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Select value={d.type} onValueChange={(v) => updateDocType(d.id, v)}>
                      <SelectTrigger className="h-8 w-44 rounded-lg text-[11px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <button type="button" onClick={() => removeDoc(d.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 cursor-pointer" aria-label="Remove document"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/60 p-2.5 dark:border-white/5 dark:bg-slate-950/40">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-semibold text-muted-foreground dark:text-slate-400">Verification Status:</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", VERIFICATION_COLOR[form.verificationStatus] || "bg-muted text-muted-foreground")}>{form.verificationStatus}</span>
            <span className="ml-auto text-[10px] text-muted-foreground dark:text-slate-500">System-managed</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground dark:text-slate-200">
          <input type="checkbox" checked={form.isHighest} onChange={(e) => set("isHighest", e.target.checked)} className="h-4 w-4 rounded border-border accent-emerald-500 dark:border-white/20" />
          <Crown className="h-3.5 w-3.5 text-amber-500" /> Mark as primary employment
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} className="h-9 rounded-lg text-xs">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="h-9 rounded-lg bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
            {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> {isEditing ? "Update" : "Save"} Employment</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Employment Card (expandable display)
// ============================================================
interface EmploymentCardProps {
  emp: EmploymentRecord;
  onEdit: () => void;
  onDelete: () => void;
  overlapWarning: string | null;
  defaultExpanded?: boolean;
}

export function EmploymentCard({ emp, onEdit, onDelete, overlapWarning, defaultExpanded }: EmploymentCardProps) {
  const [expanded, setExpanded] = useState(!!defaultExpanded);
  const range: DateRange = { joiningDate: emp.joiningDate, leavingDate: emp.leavingDate, isCurrent: emp.isCurrent, employmentType: emp.employmentType };
  const duration = computeDuration(range);
  const salaryLabel = emp.annualCtc ? formatSalary(emp.annualCtc, emp.currency, emp.salaryFrequency) : "";

  return (
    <div className={cn(
      "rounded-2xl border bg-background/80 transition-all dark:bg-slate-950/40",
      emp.isCurrent ? "border-emerald-500/40 ring-1 ring-emerald-500/15 dark:border-emerald-500/30" : "border-border/70 dark:border-white/5"
    )}>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", emp.isCurrent ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400")}>
            <Briefcase className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-bold text-foreground dark:text-white">{emp.designation}</p>
              {emp.isCurrent && <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400"><Check className="h-2.5 w-2.5" /> Current</span>}
              {emp.isHighest && <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400"><Crown className="h-2.5 w-2.5" /> Primary</span>}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{emp.company}{emp.industry && ` · ${emp.industry}`}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground dark:text-slate-400">
              <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Calendar className="h-2.5 w-2.5" /> {formatDateShort(emp.joiningDate)} — {formatDateShort(emp.leavingDate, emp.isCurrent)}</span>
              <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Clock className="h-2.5 w-2.5" /> {formatDuration(duration)}</span>
              <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{emp.employmentType}</span>
              {emp.workMode && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{emp.workMode}</span>}
              {salaryLabel && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Banknote className="h-2.5 w-2.5" /> {salaryLabel}</span>}
              <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold", VERIFICATION_COLOR[emp.verificationStatus] || "bg-muted text-muted-foreground")}>
                <ShieldCheck className="h-2.5 w-2.5" /> {emp.verificationStatus}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-400 cursor-pointer" aria-label="Toggle details" title="View Details">
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <button type="button" onClick={onEdit} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-400 cursor-pointer" aria-label="Edit" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onDelete} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 cursor-pointer" aria-label="Delete" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      {overlapWarning && (
        <div className="mx-4 mb-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
          <p className="text-[11px] text-amber-700 dark:text-amber-300">{overlapWarning}</p>
        </div>
      )}

      {expanded && (
        <div className="space-y-3 border-t border-border/50 p-4 dark:border-white/5">
          {(emp.department || emp.functionalArea || emp.jobLevel || emp.jobCategory) && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Job Details</p>
              <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground dark:text-slate-400">
                {emp.department && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{emp.department}</span>}
                {emp.functionalArea && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{emp.functionalArea}</span>}
                {emp.jobLevel && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{emp.jobLevel}</span>}
                {emp.jobCategory && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{emp.jobCategory}</span>}
                {emp.teamSize && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">Team: {emp.teamSize}</span>}
              </div>
            </div>
          )}
          {(emp.country || emp.city) && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Location</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground dark:text-slate-300"><MapPin className="h-3 w-3" /> {[emp.city, emp.state, emp.country].filter(Boolean).join(", ")}</p>
            </div>
          )}
          {emp.roleSummary && (
            <div><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Role Summary</p><p className="mt-0.5 text-[11px] text-muted-foreground dark:text-slate-300">{emp.roleSummary}</p></div>
          )}
          {emp.responsibilities && (
            <div><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Key Responsibilities</p><p className="mt-0.5 whitespace-pre-line text-[11px] text-muted-foreground dark:text-slate-300">{emp.responsibilities}</p></div>
          )}
          {emp.achievements && (
            <div><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Key Achievements</p><p className="mt-0.5 whitespace-pre-line text-[11px] text-muted-foreground dark:text-slate-300">{emp.achievements}</p></div>
          )}
          {(emp.skillsUsed.length > 0 || emp.technicalSkills.length > 0 || emp.toolsTechnologies.length > 0) && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Skills & Technologies</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {[...emp.skillsUsed, ...emp.technicalSkills, ...emp.toolsTechnologies].map((s) => (
                  <span key={s} className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{s}</span>
                ))}
              </div>
            </div>
          )}
          {emp.majorContributions && (
            <div><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Major Contributions</p><p className="mt-0.5 whitespace-pre-line text-[11px] text-muted-foreground dark:text-slate-300">{emp.majorContributions}</p></div>
          )}
          {emp.awardsRecognition && (
            <div><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Awards & Recognition</p><p className="mt-0.5 whitespace-pre-line text-[11px] text-muted-foreground dark:text-slate-300">{emp.awardsRecognition}</p></div>
          )}
          {emp.performanceHighlights && (
            <div><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Performance Highlights</p><p className="mt-0.5 whitespace-pre-line text-[11px] text-muted-foreground dark:text-slate-300">{emp.performanceHighlights}</p></div>
          )}
          {emp.projects.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Projects ({emp.projects.length})</p>
              <div className="mt-1 space-y-2">
                {emp.projects.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border/60 bg-background/60 p-2.5 dark:border-white/5 dark:bg-slate-950/40">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-foreground dark:text-white">{p.name}</p>
                      {p.duration && <span className="text-[10px] text-muted-foreground dark:text-slate-500">{p.duration}</span>}
                    </div>
                    {p.description && <p className="mt-0.5 text-[11px] text-muted-foreground dark:text-slate-300">{p.description}</p>}
                    <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-muted-foreground dark:text-slate-400">
                      {p.role && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">Role: {p.role}</span>}
                      {p.technologies && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">Tech: {p.technologies}</span>}
                      {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 hover:underline dark:text-emerald-400"><Globe className="h-2.5 w-2.5" /> Link</a>}
                    </div>
                    {p.contributions && <p className="mt-1 text-[11px] text-muted-foreground dark:text-slate-300">{p.contributions}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {emp.documents.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground dark:text-slate-500">Documents ({emp.documents.length})</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {emp.documents.map((d) => (
                  <span key={d.id} className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground dark:bg-white/5 dark:text-slate-300">
                    <FileText className="h-2.5 w-2.5" /> {d.fileName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
