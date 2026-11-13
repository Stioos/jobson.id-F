"use client";

import { useState, useMemo } from "react";
import {
  FolderGit2, Plus, Trash2, Pencil, Check, X, Loader2, Save,
  ExternalLink, Github, Gitlab, Box, Video, FileText, Presentation, Link2,
  Star, Globe, Upload, ShieldCheck, Crown, AlertTriangle, ChevronDown, ChevronUp,
  Award, BookOpen, Calendar, MapPin, Users, Crown as CrownIcon,
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
import {
  PROJECT_CATEGORIES, PROJECT_TYPES, PROJECT_STATUSES, STATUS_COLOR,
  VISIBILITY_OPTIONS, VISIBILITY_COLOR, TEAM_OPTIONS,
  LINK_TYPES, LINK_ICONS, ATTACHMENT_TYPES,
  TECH_GROUPS, ALL_TECH,
  WORK_CATEGORIES, AWARD_CATEGORIES, RECOGNITION_LEVELS,
  PUBLICATION_TYPES, PATENT_STATUSES, ACHIEVEMENT_TYPES,
} from "@/data/projects-data";
import { COUNTRIES, getStatesForCountry, getCitiesForState } from "@/data/education-data";

// ============================================================
// Shared types
// ============================================================
export interface ProjectLink {
  id: string;
  type: string;
  url: string;
  isPrimary: boolean;
}

export interface ProjectAttachment {
  id: string;
  type: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  isFeatured: boolean;
}

export interface AchievementEntry {
  id: string;
  type: string;
  title: string;
  description: string;
  metric: string;          // e.g. "35%", "1M+ users"
}

export interface ProjectRecord {
  id: string;
  // Section A — Project Information
  title: string;
  category: string;
  type: string;
  role: string;
  description: string;
  status: string;
  startDate: string;
  visibility: string;
  // Section B — Duration & Ownership
  endDate: string;
  isOngoing: boolean;
  organization: string;
  clientName: string;
  teamSize: string;
  teamType: string;
  teamPosition: string;
  location: string;
  country: string;
  state: string;
  city: string;
  // Section C — Technologies
  technologies: string[];
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  cloudPlatforms: string[];
  devTools: string[];
  apis: string[];
  technicalSkills: string[];
  architecture: string[];
  versionControl: string[];
  // Section D — Role & Contribution
  roleSummary: string;
  keyResponsibilities: string;
  individualContribution: string;
  teamResponsibilities: string;
  majorChallenges: string;
  solutionsImplemented: string;
  technicalDecisions: string;
  leadershipResponsibilities: string;
  // Section E — Outcomes & Achievements
  outcomes: string;
  businessImpact: string;
  achievements: AchievementEntry[];
  // Section F — Links
  links: ProjectLink[];
  // Section G — Attachments
  attachments: ProjectAttachment[];
  // Meta
  isFeatured: boolean;
}

export interface PortfolioRecord {
  id: string;
  title: string;
  category: string;
  description: string;
  role: string;
  skills: string[];
  workSampleUrl: string;
  previewUrl: string;
  completionDate: string;
  visibility: string;
  isFeatured: boolean;
}

export interface AwardRecord {
  id: string;
  title: string;
  category: string;
  issuingOrg: string;
  description: string;
  awardDate: string;
  recognitionLevel: string;
  certificateNumber: string;
  verificationUrl: string;
  attachmentName: string;
  visibility: string;
  isFeatured: boolean;
}

export interface PublicationRecord {
  id: string;
  title: string;
  type: string;
  researchArea: string;
  abstract: string;
  authorName: string;
  coAuthors: string;
  publisher: string;
  publicationDate: string;
  doi: string;
  isbn: string;
  url: string;
  attachmentName: string;
  patentNumber: string;
  patentStatus: string;
  visibility: string;
  isFeatured: boolean;
}

// ============================================================
// Empty factories
// ============================================================
export function emptyProject(): ProjectRecord {
  return {
    id: "", title: "", category: "", type: "", role: "", description: "",
    status: "Completed", startDate: "", visibility: "Public",
    endDate: "", isOngoing: false, organization: "", clientName: "",
    teamSize: "", teamType: "Individual Project", teamPosition: "", location: "",
    country: "", state: "", city: "",
    technologies: [], programmingLanguages: [], frameworks: [], databases: [],
    cloudPlatforms: [], devTools: [], apis: [], technicalSkills: [],
    architecture: [], versionControl: [],
    roleSummary: "", keyResponsibilities: "", individualContribution: "",
    teamResponsibilities: "", majorChallenges: "", solutionsImplemented: "",
    technicalDecisions: "", leadershipResponsibilities: "",
    outcomes: "", businessImpact: "", achievements: [],
    links: [], attachments: [],
    isFeatured: false,
  };
}

export function emptyPortfolio(): PortfolioRecord {
  return {
    id: "", title: "", category: "", description: "", role: "",
    skills: [], workSampleUrl: "", previewUrl: "", completionDate: "",
    visibility: "Public", isFeatured: false,
  };
}

export function emptyAward(): AwardRecord {
  return {
    id: "", title: "", category: "", issuingOrg: "", description: "",
    awardDate: "", recognitionLevel: "", certificateNumber: "",
    verificationUrl: "", attachmentName: "", visibility: "Public", isFeatured: false,
  };
}

export function emptyPublication(): PublicationRecord {
  return {
    id: "", title: "", type: "", researchArea: "", abstract: "",
    authorName: "", coAuthors: "", publisher: "", publicationDate: "",
    doi: "", isbn: "", url: "", attachmentName: "",
    patentNumber: "", patentStatus: "Not Applicable", visibility: "Public", isFeatured: false,
  };
}

// ============================================================
// Shared UI helpers
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
// Multi-select chips (reusable; with manual entry + duplicate prevention)
// ============================================================
export function MultiSelectChips({ options, selected, onChange, placeholder, allowManual = true }: {
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
    if (selected.some((s) => s.toLowerCase() === v.toLowerCase())) {
      toast.error(`${v} is already added.`);
      return;
    }
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
          onBlur={() => setTimeout(() => setShowList(false), 200)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(query); } }}
          placeholder={selected.length === 0 ? placeholder : "Add more…"}
          className="flex-1 min-w-[120px] bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60 dark:text-white"
        />
      </div>
      {showList && filtered.length > 0 && (
        <div className="relative z-20">
          <div className="absolute mt-1 max-h-44 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md dark:border-white/10 dark:bg-slate-900 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
            {filtered.slice(0, 30).map((o) => (
              <button key={o} type="button" onMouseDown={(e) => { e.preventDefault(); add(o); }} className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-[11px] text-foreground hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-300 cursor-pointer">
                <Plus className="h-2.5 w-2.5" /> {o}
              </button>
            ))}
            {allowManual && query.trim() && !options.some((o) => o.toLowerCase() === query.trim().toLowerCase()) && (
              <button type="button" onMouseDown={(e) => { e.preventDefault(); add(query); }} className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-[11px] text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 cursor-pointer">
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
// Validation
// ============================================================
export function validateProject(p: ProjectRecord): string | null {
  if (!p.title.trim()) return "Please enter the Project Title.";
  if (!p.category) return "Please select the Project Category.";
  if (!p.type) return "Please select the Project Type.";
  if (!p.status) return "Please select the Project Status.";
  if (!p.startDate) return "Please select the Start Date.";
  if (!p.isOngoing && !p.endDate) return "Please select the End Date or enable 'Currently Working'.";
  if (!p.isOngoing && p.endDate && p.startDate && p.endDate < p.startDate) return "End Date cannot be before the Start Date.";
  return null;
}

export function validatePortfolio(p: PortfolioRecord): string | null {
  if (!p.title.trim()) return "Please enter the Portfolio Title.";
  if (!p.category) return "Please select the Work Category.";
  return null;
}

export function validateAward(a: AwardRecord): string | null {
  if (!a.title.trim()) return "Please enter the Award Title.";
  if (!a.category) return "Please select the Award Category.";
  if (!a.issuingOrg.trim()) return "Please enter the Issuing Organization.";
  if (!a.awardDate) return "Please select the Award Date.";
  return null;
}

export function validatePublication(p: PublicationRecord): string | null {
  if (!p.title.trim()) return "Please enter the Publication Title.";
  if (!p.type) return "Please select the Publication Type.";
  if (!p.authorName.trim()) return "Please enter the Author Name.";
  return null;
}

// ============================================================
// Shared sub-components: Links editor, Attachments editor, Achievements editor
// ============================================================
function LinksEditor({ links, onChange }: { links: ProjectLink[]; onChange: (l: ProjectLink[]) => void }) {
  const addLink = () => onChange([...links, { id: `l-${Date.now()}`, type: LINK_TYPES[0], url: "", isPrimary: links.length === 0 }]);
  const updateLink = (id: string, patch: Partial<ProjectLink>) => onChange(links.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const removeLink = (id: string) => {
    const next = links.filter((l) => l.id !== id);
    // if removed the primary, promote first to primary
    if (!next.some((l) => l.isPrimary) && next.length > 0) next[0].isPrimary = true;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {links.length === 0 && <p className="text-[11px] text-muted-foreground dark:text-slate-500">No links added yet.</p>}
      {links.map((l) => (
        <div key={l.id} className="flex flex-col gap-2 rounded-lg border border-border/70 bg-background/60 p-2.5 sm:flex-row sm:items-center dark:border-white/5 dark:bg-slate-950/40">
          <Select value={l.type} onValueChange={(v) => updateLink(l.id, { type: v })}>
            <SelectTrigger className="h-8 w-full rounded-lg text-[11px] sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {LINK_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input value={l.url} onChange={(e) => updateLink(l.id, { url: e.target.value })} placeholder="https://…" className="h-8 flex-1 rounded-lg text-[11px]" />
          <label className="flex shrink-0 cursor-pointer items-center gap-1 text-[10px] font-semibold text-muted-foreground dark:text-slate-400">
            <input type="checkbox" checked={l.isPrimary} onChange={(e) => {
              const v = e.target.checked;
              if (v) onChange(links.map((x) => ({ ...x, isPrimary: x.id === l.id })));
              else updateLink(l.id, { isPrimary: false });
            }} className="h-3.5 w-3.5 rounded border-border accent-amber-500 dark:border-white/20" />
            <Star className="h-3 w-3 text-amber-500" /> Primary
          </label>
          <button type="button" onClick={() => removeLink(l.id)} className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 cursor-pointer" aria-label="Remove link"><Trash2 className="h-3 w-3" /></button>
        </div>
      ))}
      <button type="button" onClick={addLink} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"><Plus className="h-3 w-3" /> Add Link</button>
    </div>
  );
}

function AttachmentsEditor({ attachments, onChange }: { attachments: ProjectAttachment[]; onChange: (a: ProjectAttachment[]) => void }) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const maxSize = 5 * 1024 * 1024;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "video/mp4", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    const newAtts: ProjectAttachment[] = [];
    for (const f of Array.from(files)) {
      if (!allowed.includes(f.type)) { toast.error(`${f.name}: Unsupported file type.`); continue; }
      if (f.size > maxSize) { toast.error(`${f.name}: File exceeds 5MB limit.`); continue; }
      newAtts.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: ATTACHMENT_TYPES[0],
        fileName: f.name,
        fileSize: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.floor(f.size / 1024)} KB`,
        uploadedAt: new Date().toISOString(),
        isFeatured: attachments.length === 0 && newAtts.length === 0,
      });
    }
    if (newAtts.length > 0) {
      onChange([...attachments, ...newAtts]);
      toast.success(`${newAtts.length} attachment(s) uploaded.`);
    }
    e.target.value = "";
  };
  const removeAtt = (id: string) => onChange(attachments.filter((a) => a.id !== id));
  const updateAttType = (id: string, type: string) => onChange(attachments.map((a) => (a.id === id ? { ...a, type } : a)));
  const toggleFeatured = (id: string) => onChange(attachments.map((a) => ({ ...a, isFeatured: a.id === id })));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/5 px-4 text-xs font-bold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
          <Upload className="h-3.5 w-3.5" /> Upload Attachment
          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.mp4,.ppt,.pptx,application/pdf,image/jpeg,image/png,video/mp4,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={handleUpload} className="hidden" />
        </label>
        <span className="text-[10px] text-muted-foreground dark:text-slate-500">PDF/JPG/PNG/MP4/PPT · max 5MB each</span>
      </div>
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((a) => (
            <div key={a.id} className="flex flex-col gap-2 rounded-lg border border-border/70 bg-background/60 p-2.5 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground dark:text-white">{a.fileName}</p>
                  <p className="text-[10px] text-muted-foreground dark:text-slate-500">{a.fileSize}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Select value={a.type} onValueChange={(v) => updateAttType(a.id, v)}>
                  <SelectTrigger className="h-8 w-40 rounded-lg text-[11px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ATTACHMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <button type="button" onClick={() => toggleFeatured(a.id)} className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer", a.isFeatured ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/15")} aria-label="Feature" title="Featured image"><Star className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => removeAtt(a.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 cursor-pointer" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AchievementsEditor({ achievements, onChange }: { achievements: AchievementEntry[]; onChange: (a: AchievementEntry[]) => void }) {
  const add = () => onChange([...achievements, { id: `ach-${Date.now()}`, type: ACHIEVEMENT_TYPES[0], title: "", description: "", metric: "" }]);
  const update = (id: string, patch: Partial<AchievementEntry>) => onChange(achievements.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const remove = (id: string) => onChange(achievements.filter((a) => a.id !== id));

  return (
    <div className="space-y-2">
      {achievements.length === 0 && <p className="text-[11px] text-muted-foreground dark:text-slate-500">No achievements added yet.</p>}
      {achievements.map((a) => (
        <div key={a.id} className="rounded-lg border border-border/70 bg-background/60 p-2.5 dark:border-white/5 dark:bg-slate-950/40">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Select value={a.type} onValueChange={(v) => update(a.id, { type: v })}>
              <SelectTrigger className="h-8 rounded-lg text-[11px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                {ACHIEVEMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={a.title} onChange={(e) => update(a.id, { title: e.target.value })} placeholder="Achievement title e.g. Improved app performance" className="h-8 rounded-lg text-[11px] sm:col-span-2" />
            <Input value={a.metric} onChange={(e) => update(a.id, { metric: e.target.value })} placeholder="Metric e.g. 35%" className="h-8 rounded-lg text-[11px]" />
            <Input value={a.description} onChange={(e) => update(a.id, { description: e.target.value })} placeholder="Description / impact" className="h-8 rounded-lg text-[11px] sm:col-span-2" />
          </div>
          <div className="mt-1 flex justify-end">
            <button type="button" onClick={() => remove(a.id)} className="text-[10px] font-semibold text-muted-foreground hover:text-rose-500 cursor-pointer"><Trash2 className="inline h-3 w-3" /> Remove</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"><Plus className="h-3 w-3" /> Add Achievement</button>
    </div>
  );
}

// ============================================================
// Project Form (8 sections)
// ============================================================
interface ProjectFormProps {
  initial: ProjectRecord;
  onSave: (p: ProjectRecord) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function ProjectForm({ initial, onSave, onCancel, isEditing }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectRecord>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const set = <K extends keyof ProjectRecord>(k: K, v: ProjectRecord[K]) => setForm((p) => ({ ...p, [k]: v }));

  const stateOptions = useMemo(() => getStatesForCountry(form.country), [form.country]);
  const cityOptions = useMemo(() => getCitiesForState(form.state), [form.state]);

  const handleCountryChange = (country: string) => setForm((p) => ({ ...p, country, state: "", city: "" }));
  const handleStateChange = (state: string) => setForm((p) => ({ ...p, state, city: "" }));
  const handleIsOngoingChange = (ongoing: boolean) => setForm((p) => ({ ...p, isOngoing: ongoing, endDate: ongoing ? "" : p.endDate }));

  const handleSubmit = () => {
    const err = validateProject(form);
    if (err) { toast.error(err); return; }
    setIsSaving(true);
    setTimeout(() => { onSave({ ...form, title: form.title.trim() }); setIsSaving(false); }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      <h3 className="pb-4 text-sm font-bold text-foreground dark:text-white">{isEditing ? "Edit Project" : "Add Project"}</h3>

      {/* SECTION A — Project Information */}
      <SectionTitle icon={<FolderGit2 className="h-4 w-4" />} title="A — Project Information" subtitle="Basic project details" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Project Title" required className="sm:col-span-2 lg:col-span-2">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. E-Commerce Analytics Platform" className="h-9 rounded-lg" />
        </Field>
        <Field label="Project Category" required>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {PROJECT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Project Type" required>
          <Select value={form.type} onValueChange={(v) => set("type", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Your Role">
          <Input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Lead Frontend Engineer" className="h-9 rounded-lg" />
        </Field>
        <Field label="Project Status" required>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Project Description" className="sm:col-span-2 lg:col-span-3">
          <Textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the project, your impact and outcomes…" className="resize-y rounded-lg text-xs" />
        </Field>
        <Field label="Start Date" required>
          <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="h-9 rounded-lg" />
        </Field>
        <Field label="Project Visibility" required>
          <Select value={form.visibility} onValueChange={(v) => set("visibility", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select visibility" /></SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* SECTION B — Duration & Ownership */}
      <div className="mt-6">
        <SectionTitle icon={<Calendar className="h-4 w-4" />} title="B — Project Duration & Ownership" subtitle="Timeline, team and location" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Start Date" hint="Same as above (auto-synced)">
            <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="h-9 rounded-lg" />
          </Field>
          <Field label="Currently Working on This Project">
            <label className="flex h-9 cursor-pointer items-center gap-2 text-xs font-semibold text-foreground dark:text-slate-200">
              <input type="checkbox" checked={form.isOngoing} onChange={(e) => handleIsOngoingChange(e.target.checked)} className="h-4 w-4 rounded border-border accent-emerald-500 dark:border-white/20" />
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Ongoing project
            </label>
          </Field>
          {!form.isOngoing && (
            <Field label="End Date" required>
              <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className="h-9 rounded-lg" />
            </Field>
          )}
          <Field label="Organization / Company Name" hint="Optional for personal projects">
            <Input value={form.organization} onChange={(e) => set("organization", e.target.value)} placeholder="e.g. Tech Solutions Pvt Ltd" className="h-9 rounded-lg" />
          </Field>
          <Field label="Client Name" hint="Optional — kept confidential">
            <Input value={form.clientName} onChange={(e) => set("clientName", e.target.value)} placeholder="Confidential client name" className="h-9 rounded-lg" />
          </Field>
          <Field label="Project Team Size">
            <Input type="number" min={1} value={form.teamSize} onChange={(e) => set("teamSize", e.target.value)} placeholder="e.g. 6" className="h-9 rounded-lg" />
          </Field>
          <Field label="Individual / Team Project">
            <Select value={form.teamType} onValueChange={(v) => set("teamType", v)}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {TEAM_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Team Position" hint="Optional">
            <Input value={form.teamPosition} onChange={(e) => set("teamPosition", e.target.value)} placeholder="e.g. Tech Lead" className="h-9 rounded-lg" />
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
            <Select value={form.city} onValueChange={(v) => set("city", v)} disabled={!form.state}>
              <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select city" /></SelectTrigger>
              <SelectContent>
                {cityOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {/* SECTION C — Technologies & Technical Details */}
      <div className="mt-6">
        <SectionTitle icon={<FileText className="h-4 w-4" />} title="C — Technologies & Technical Details" subtitle="Structured tech stack" />
        <div className="grid grid-cols-1 gap-4">
          <Field label="Technologies Used">
            <MultiSelectChips options={ALL_TECH} selected={form.technologies} onChange={(v) => set("technologies", v)} placeholder="Add technologies used…" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Programming Languages">
              <MultiSelectChips options={TECH_GROUPS[0].items} selected={form.programmingLanguages} onChange={(v) => set("programmingLanguages", v)} placeholder="Add languages…" />
            </Field>
            <Field label="Frameworks & Libraries">
              <MultiSelectChips options={TECH_GROUPS[1].items} selected={form.frameworks} onChange={(v) => set("frameworks", v)} placeholder="Add frameworks…" />
            </Field>
            <Field label="Databases">
              <MultiSelectChips options={TECH_GROUPS[3].items} selected={form.databases} onChange={(v) => set("databases", v)} placeholder="Add databases…" />
            </Field>
            <Field label="Cloud Platforms">
              <MultiSelectChips options={TECH_GROUPS[4].items} selected={form.cloudPlatforms} onChange={(v) => set("cloudPlatforms", v)} placeholder="Add cloud platforms…" />
            </Field>
            <Field label="Development Tools">
              <MultiSelectChips options={TECH_GROUPS[6].items} selected={form.devTools} onChange={(v) => set("devTools", v)} placeholder="Add dev tools…" />
            </Field>
            <Field label="APIs & Integrations">
              <MultiSelectChips options={TECH_GROUPS[7].items} selected={form.apis} onChange={(v) => set("apis", v)} placeholder="Add APIs…" />
            </Field>
            <Field label="Architecture / Methodology">
              <MultiSelectChips options={TECH_GROUPS[10].items} selected={form.architecture} onChange={(v) => set("architecture", v)} placeholder="Add architecture…" />
            </Field>
            <Field label="Version Control Tools">
              <MultiSelectChips options={TECH_GROUPS[9].items} selected={form.versionControl} onChange={(v) => set("versionControl", v)} placeholder="Add version control…" />
            </Field>
          </div>
          <Field label="Technical Skills">
            <MultiSelectChips options={ALL_TECH} selected={form.technicalSkills} onChange={(v) => set("technicalSkills", v)} placeholder="Add technical skills…" />
          </Field>
        </div>
      </div>

      {/* SECTION D — Role & Contribution */}
      <div className="mt-6">
        <SectionTitle icon={<Users className="h-4 w-4" />} title="D — Your Role & Contribution" subtitle="What you personally contributed" />
        <div className="grid grid-cols-1 gap-4">
          <Field label="Role Summary">
            <Textarea rows={2} value={form.roleSummary} onChange={(e) => set("roleSummary", e.target.value)} placeholder="One-line summary of your role…" className="resize-y rounded-lg text-xs" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Key Responsibilities">
              <Textarea rows={3} value={form.keyResponsibilities} onChange={(e) => set("keyResponsibilities", e.target.value)} placeholder="Your key responsibilities…" className="resize-y rounded-lg text-xs" />
            </Field>
            <Field label="Individual Contribution">
              <Textarea rows={3} value={form.individualContribution} onChange={(e) => set("individualContribution", e.target.value)} placeholder="What you personally built or delivered…" className="resize-y rounded-lg text-xs" />
            </Field>
            <Field label="Team Responsibilities">
              <Textarea rows={2} value={form.teamResponsibilities} onChange={(e) => set("teamResponsibilities", e.target.value)} placeholder="Team responsibilities…" className="resize-y rounded-lg text-xs" />
            </Field>
            <Field label="Leadership Responsibilities">
              <Textarea rows={2} value={form.leadershipResponsibilities} onChange={(e) => set("leadershipResponsibilities", e.target.value)} placeholder="Leadership activities…" className="resize-y rounded-lg text-xs" />
            </Field>
            <Field label="Major Challenges">
              <Textarea rows={2} value={form.majorChallenges} onChange={(e) => set("majorChallenges", e.target.value)} placeholder="Major challenges faced…" className="resize-y rounded-lg text-xs" />
            </Field>
            <Field label="Solutions Implemented">
              <Textarea rows={2} value={form.solutionsImplemented} onChange={(e) => set("solutionsImplemented", e.target.value)} placeholder="Solutions you implemented…" className="resize-y rounded-lg text-xs" />
            </Field>
          </div>
          <Field label="Technical Decisions">
            <Textarea rows={2} value={form.technicalDecisions} onChange={(e) => set("technicalDecisions", e.target.value)} placeholder="Key technical decisions you made…" className="resize-y rounded-lg text-xs" />
          </Field>
        </div>
      </div>

      {/* SECTION E — Outcomes & Achievements */}
      <div className="mt-6">
        <SectionTitle icon={<Award className="h-4 w-4" />} title="E — Project Outcomes & Achievements" subtitle="Measurable results" />
        <div className="grid grid-cols-1 gap-4">
          <Field label="Key Achievements">
            <Textarea rows={2} value={form.outcomes} onChange={(e) => set("outcomes", e.target.value)} placeholder="Overall project achievements…" className="resize-y rounded-lg text-xs" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Project Outcomes">
              <Textarea rows={2} value={form.outcomes} onChange={(e) => set("outcomes", e.target.value)} placeholder="Project outcomes…" className="resize-y rounded-lg text-xs" />
            </Field>
            <Field label="Business Impact">
              <Textarea rows={2} value={form.businessImpact} onChange={(e) => set("businessImpact", e.target.value)} placeholder="Business impact…" className="resize-y rounded-lg text-xs" />
            </Field>
          </div>
          <Field label="Measurable Achievements" hint="Add measurable results (percentages, numbers)">
            <AchievementsEditor achievements={form.achievements} onChange={(v) => set("achievements", v)} />
          </Field>
        </div>
      </div>

      {/* SECTION F — Links & Repositories */}
      <div className="mt-6">
        <SectionTitle icon={<Link2 className="h-4 w-4" />} title="F — Project Links & Repositories" subtitle="External links" />
        <LinksEditor links={form.links} onChange={(v) => set("links", v)} />
      </div>

      {/* SECTION G — Media & Documents */}
      <div className="mt-6">
        <SectionTitle icon={<Upload className="h-4 w-4" />} title="G — Project Media & Documents" subtitle="Attachments and media" />
        <AttachmentsEditor attachments={form.attachments} onChange={(v) => set("attachments", v)} />
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground dark:text-slate-200">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="h-4 w-4 rounded border-border accent-amber-500 dark:border-white/20" />
          <Crown className="h-3.5 w-3.5 text-amber-500" /> Mark as featured project
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} className="h-9 rounded-lg text-xs">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="h-9 rounded-lg bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
            {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> {isEditing ? "Update" : "Save"} Project</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Portfolio Form
// ============================================================
export function PortfolioForm({ initial, onSave, onCancel, isEditing }: {
  initial: PortfolioRecord; onSave: (p: PortfolioRecord) => void; onCancel: () => void; isEditing: boolean;
}) {
  const [form, setForm] = useState<PortfolioRecord>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const set = <K extends keyof PortfolioRecord>(k: K, v: PortfolioRecord[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const err = validatePortfolio(form);
    if (err) { toast.error(err); return; }
    setIsSaving(true);
    setTimeout(() => { onSave({ ...form, title: form.title.trim() }); setIsSaving(false); }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      <h3 className="pb-4 text-sm font-bold text-foreground dark:text-white">{isEditing ? "Edit Portfolio Item" : "Add Portfolio / Work Sample"}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Portfolio Title" required className="sm:col-span-2 lg:col-span-2">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. UI Design System" className="h-9 rounded-lg" />
        </Field>
        <Field label="Work Category" required>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {WORK_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Description" className="sm:col-span-2 lg:col-span-3">
          <Textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe your work sample…" className="resize-y rounded-lg text-xs" />
        </Field>
        <Field label="Your Role">
          <Input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. UI/UX Designer" className="h-9 rounded-lg" />
        </Field>
        <Field label="Completion Date">
          <Input type="date" value={form.completionDate} onChange={(e) => set("completionDate", e.target.value)} className="h-9 rounded-lg" />
        </Field>
        <Field label="Visibility">
          <Select value={form.visibility} onValueChange={(v) => set("visibility", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select visibility" /></SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Skills Demonstrated" className="sm:col-span-2 lg:col-span-3">
          <MultiSelectChips options={ALL_TECH} selected={form.skills} onChange={(v) => set("skills", v)} placeholder="Add skills demonstrated…" />
        </Field>
        <Field label="Work Sample URL">
          <Input value={form.workSampleUrl} onChange={(e) => set("workSampleUrl", e.target.value)} placeholder="https://…" className="h-9 rounded-lg" />
        </Field>
        <Field label="Preview URL">
          <Input value={form.previewUrl} onChange={(e) => set("previewUrl", e.target.value)} placeholder="https://…" className="h-9 rounded-lg" />
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-border/60 pt-4 dark:border-white/10">
        <Button variant="outline" onClick={onCancel} className="h-9 rounded-lg text-xs">Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving} className="h-9 rounded-lg bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
          {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> {isEditing ? "Update" : "Save"} Portfolio</>}
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// Award Form
// ============================================================
export function AwardForm({ initial, onSave, onCancel, isEditing }: {
  initial: AwardRecord; onSave: (a: AwardRecord) => void; onCancel: () => void; isEditing: boolean;
}) {
  const [form, setForm] = useState<AwardRecord>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const set = <K extends keyof AwardRecord>(k: K, v: AwardRecord[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const err = validateAward(form);
    if (err) { toast.error(err); return; }
    setIsSaving(true);
    setTimeout(() => { onSave({ ...form, title: form.title.trim() }); setIsSaving(false); }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      <h3 className="pb-4 text-sm font-bold text-foreground dark:text-white">{isEditing ? "Edit Award" : "Add Award / Achievement"}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Award / Achievement Title" required className="sm:col-span-2 lg:col-span-2">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Smart India Hackathon Winner" className="h-9 rounded-lg" />
        </Field>
        <Field label="Award Category" required>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {AWARD_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Issuing Organization" required className="sm:col-span-2 lg:col-span-2">
          <Input value={form.issuingOrg} onChange={(e) => set("issuingOrg", e.target.value)} placeholder="e.g. Govt. of India" className="h-9 rounded-lg" />
        </Field>
        <Field label="Award Date" required>
          <Input type="date" value={form.awardDate} onChange={(e) => set("awardDate", e.target.value)} className="h-9 rounded-lg" />
        </Field>
        <Field label="Recognition Level">
          <Select value={form.recognitionLevel} onValueChange={(v) => set("recognitionLevel", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>
              {RECOGNITION_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Certificate Number" hint="Optional">
          <Input value={form.certificateNumber} onChange={(e) => set("certificateNumber", e.target.value)} placeholder="e.g. SIH-2018-001234" className="h-9 rounded-lg" />
        </Field>
        <Field label="Visibility">
          <Select value={form.visibility} onValueChange={(v) => set("visibility", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select visibility" /></SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Achievement Description" className="sm:col-span-2 lg:col-span-3">
          <Textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the achievement…" className="resize-y rounded-lg text-xs" />
        </Field>
        <Field label="Verification URL" className="sm:col-span-2 lg:col-span-2">
          <Input value={form.verificationUrl} onChange={(e) => set("verificationUrl", e.target.value)} placeholder="https://…" className="h-9 rounded-lg" />
        </Field>
        <Field label="Certificate / Evidence Upload">
          <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/5 px-4 text-xs font-bold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
            <Upload className="h-3.5 w-3.5" /> {form.attachmentName || "Upload"}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const f = e.target.files?.[0]; if (f) { set("attachmentName", f.name); toast.success(`${f.name} selected.`); } e.target.value = ""; }} className="hidden" />
          </label>
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-border/60 pt-4 dark:border-white/10">
        <Button variant="outline" onClick={onCancel} className="h-9 rounded-lg text-xs">Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving} className="h-9 rounded-lg bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
          {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> {isEditing ? "Update" : "Save"} Award</>}
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// Publication Form
// ============================================================
export function PublicationForm({ initial, onSave, onCancel, isEditing }: {
  initial: PublicationRecord; onSave: (p: PublicationRecord) => void; onCancel: () => void; isEditing: boolean;
}) {
  const [form, setForm] = useState<PublicationRecord>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const set = <K extends keyof PublicationRecord>(k: K, v: PublicationRecord[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const err = validatePublication(form);
    if (err) { toast.error(err); return; }
    setIsSaving(true);
    setTimeout(() => { onSave({ ...form, title: form.title.trim() }); setIsSaving(false); }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      <h3 className="pb-4 text-sm font-bold text-foreground dark:text-white">{isEditing ? "Edit Publication" : "Add Publication / Research"}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Publication Title" required className="sm:col-span-2 lg:col-span-2">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Scaling React Apps to Millions of Users" className="h-9 rounded-lg" />
        </Field>
        <Field label="Publication Type" required>
          <Select value={form.type} onValueChange={(v) => set("type", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {PUBLICATION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Research Area">
          <Input value={form.researchArea} onChange={(e) => set("researchArea", e.target.value)} placeholder="e.g. Distributed Systems" className="h-9 rounded-lg" />
        </Field>
        <Field label="Author Name" required>
          <Input value={form.authorName} onChange={(e) => set("authorName", e.target.value)} placeholder="e.g. John Doe" className="h-9 rounded-lg" />
        </Field>
        <Field label="Co-authors">
          <Input value={form.coAuthors} onChange={(e) => set("coAuthors", e.target.value)} placeholder="Comma-separated names" className="h-9 rounded-lg" />
        </Field>
        <Field label="Publisher / Journal" className="sm:col-span-2 lg:col-span-2">
          <Input value={form.publisher} onChange={(e) => set("publisher", e.target.value)} placeholder="e.g. IEEE / Medium" className="h-9 rounded-lg" />
        </Field>
        <Field label="Publication Date">
          <Input type="date" value={form.publicationDate} onChange={(e) => set("publicationDate", e.target.value)} className="h-9 rounded-lg" />
        </Field>
        <Field label="DOI" hint="Optional">
          <Input value={form.doi} onChange={(e) => set("doi", e.target.value)} placeholder="e.g. 10.1234/abc" className="h-9 rounded-lg" />
        </Field>
        <Field label="ISBN / ISSN" hint="Optional">
          <Input value={form.isbn} onChange={(e) => set("isbn", e.target.value)} placeholder="ISBN / ISSN" className="h-9 rounded-lg" />
        </Field>
        <Field label="Abstract / Description" className="sm:col-span-2 lg:col-span-3">
          <Textarea rows={3} value={form.abstract} onChange={(e) => set("abstract", e.target.value)} placeholder="Abstract or summary…" className="resize-y rounded-lg text-xs" />
        </Field>
        <Field label="Publication URL" className="sm:col-span-2 lg:col-span-2">
          <Input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" className="h-9 rounded-lg" />
        </Field>
        <Field label="Visibility">
          <Select value={form.visibility} onValueChange={(v) => set("visibility", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select visibility" /></SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Patent Number" hint="Optional — if applicable">
          <Input value={form.patentNumber} onChange={(e) => set("patentNumber", e.target.value)} placeholder="Patent number" className="h-9 rounded-lg" />
        </Field>
        <Field label="Patent Status">
          <Select value={form.patentStatus} onValueChange={(v) => set("patentStatus", v)}>
            <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {PATENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Research Paper Upload">
          <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/5 px-4 text-xs font-bold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
            <Upload className="h-3.5 w-3.5" /> {form.attachmentName || "Upload"}
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => { const f = e.target.files?.[0]; if (f) { set("attachmentName", f.name); toast.success(`${f.name} selected.`); } e.target.value = ""; }} className="hidden" />
          </label>
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-border/60 pt-4 dark:border-white/10">
        <Button variant="outline" onClick={onCancel} className="h-9 rounded-lg text-xs">Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving} className="h-9 rounded-lg bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
          {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> {isEditing ? "Update" : "Save"} Publication</>}
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// Display cards
// ============================================================
const ICON_MAP: Record<string, typeof Github> = {
  ExternalLink, Github, Gitlab, Box, Video, FileText, Presentation, Link2,
};

function formatDateShort(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ProjectCard({ project, view, onEdit, onDelete, onDuplicate, onToggleFeatured, onToggleExpand }: {
  project: ProjectRecord; view: "grid" | "list";
  onEdit: () => void; onDelete: () => void; onDuplicate: () => void;
  onToggleFeatured: () => void; onToggleExpand: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const primaryLink = project.links.find((l) => l.isPrimary) || project.links[0];
  const githubLink = project.links.find((l) => l.type === "GitHub Repository" || l.type === "GitLab Repository" || l.type === "Bitbucket Repository");
  const allTech = [...project.technologies, ...project.programmingLanguages, ...project.frameworks].filter((v, i, a) => a.indexOf(v) === i);
  const featuredAtt = project.attachments.find((a) => a.isFeatured) || project.attachments[0];

  return (
    <div className={cn(
      "rounded-2xl border bg-background/80 transition-all dark:bg-slate-950/40",
      project.isFeatured ? "border-amber-500/40 ring-1 ring-amber-500/15 dark:border-amber-500/30" : "border-border/70 dark:border-white/5",
      view === "grid" ? "flex flex-col" : ""
    )}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", project.isFeatured ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400")}>
              {featuredAtt ? <FileText className="h-5 w-5" /> : <FolderGit2 className="h-5 w-5" />}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-sm font-bold text-foreground dark:text-white">{project.title}</p>
                {project.isFeatured && <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400"><Crown className="h-2.5 w-2.5" /> Featured</span>}
              </div>
              {project.role && <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{project.role}</p>}
              <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground dark:text-slate-400">
                {project.category && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{project.category}</span>}
                <span className={cn("rounded px-1.5 py-0.5 font-bold", STATUS_COLOR[project.status] || "bg-muted text-muted-foreground")}>{project.status}</span>
                <span className={cn("rounded px-1.5 py-0.5 font-bold", VISIBILITY_COLOR[project.visibility] || "bg-muted text-muted-foreground")}>{project.visibility}</span>
              </div>
            </div>
          </div>
        </div>
        {project.description && <p className="mt-2 text-xs text-muted-foreground dark:text-slate-300 line-clamp-2">{project.description}</p>}
        {allTech.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {allTech.slice(0, 6).map((t) => (
              <span key={t} className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{t}</span>
            ))}
            {allTech.length > 6 && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground dark:bg-white/5">+{allTech.length - 6}</span>}
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground dark:text-slate-400">
          <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Calendar className="h-2.5 w-2.5" /> {formatDateShort(project.startDate)} — {project.isOngoing ? "Present" : formatDateShort(project.endDate)}</span>
          {project.organization && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{project.organization}</span>}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {primaryLink?.url && <a href={primaryLink.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"><ExternalLink className="h-3 w-3" /> Live</a>}
          {githubLink?.url && <a href={githubLink.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-slate-500/10 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:underline dark:text-slate-300 cursor-pointer"><Github className="h-3 w-3" /> Code</a>}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 border-t border-border/50 px-3 py-2 dark:border-white/5">
        <button type="button" onClick={onToggleFeatured} className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer", project.isFeatured ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/15")} aria-label="Feature" title="Feature/Unfeature"><Star className="h-3.5 w-3.5" /></button>
        <button type="button" onClick={onEdit} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-400 cursor-pointer" aria-label="Edit" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
        <button type="button" onClick={onDuplicate} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-blue-500/10 hover:text-blue-600 dark:hover:bg-blue-500/15 dark:hover:text-blue-400 cursor-pointer" aria-label="Duplicate" title="Duplicate"><FileText className="h-3.5 w-3.5" /></button>
        <button type="button" onClick={onDelete} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 cursor-pointer" aria-label="Delete" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
        <button type="button" onClick={() => { setExpanded((v) => !v); onToggleExpand(); }} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-400 cursor-pointer" aria-label="Toggle details" title="View Details">{expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</button>
      </div>
      {expanded && (
        <div className="space-y-2 border-t border-border/50 p-4 text-[11px] dark:border-white/5">
          {project.roleSummary && <div><p className="font-bold uppercase text-muted-foreground dark:text-slate-500">Role Summary</p><p className="text-muted-foreground dark:text-slate-300">{project.roleSummary}</p></div>}
          {project.keyResponsibilities && <div><p className="font-bold uppercase text-muted-foreground dark:text-slate-500">Key Responsibilities</p><p className="whitespace-pre-line text-muted-foreground dark:text-slate-300">{project.keyResponsibilities}</p></div>}
          {project.individualContribution && <div><p className="font-bold uppercase text-muted-foreground dark:text-slate-500">Individual Contribution</p><p className="whitespace-pre-line text-muted-foreground dark:text-slate-300">{project.individualContribution}</p></div>}
          {project.achievements.length > 0 && (
            <div>
              <p className="font-bold uppercase text-muted-foreground dark:text-slate-500">Achievements</p>
              <ul className="mt-1 space-y-1">
                {project.achievements.map((a) => (
                  <li key={a.id} className="text-muted-foreground dark:text-slate-300">• {a.title}{a.metric && ` — ${a.metric}`}{a.description && `: ${a.description}`}</li>
                ))}
              </ul>
            </div>
          )}
          {project.links.length > 0 && (
            <div>
              <p className="font-bold uppercase text-muted-foreground dark:text-slate-500">Links ({project.links.length})</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {project.links.map((l) => (
                  <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer">
                    {(() => { const I = ICON_MAP[LINK_ICONS[l.type] || "Link2"] || Link2; return <I className="h-2.5 w-2.5" />; })()} {l.type}
                  </a>
                ))}
              </div>
            </div>
          )}
          {project.attachments.length > 0 && (
            <div>
              <p className="font-bold uppercase text-muted-foreground dark:text-slate-500">Attachments ({project.attachments.length})</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {project.attachments.map((a) => (
                  <span key={a.id} className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground dark:bg-white/5 dark:text-slate-300"><FileText className="h-2.5 w-2.5" /> {a.fileName}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PortfolioCard({ item, onEdit, onDelete, onToggleFeatured }: {
  item: PortfolioRecord; onEdit: () => void; onDelete: () => void; onToggleFeatured: () => void;
}) {
  return (
    <div className={cn("rounded-2xl border bg-background/80 p-4 dark:bg-slate-950/40", item.isFeatured ? "border-amber-500/40 ring-1 ring-amber-500/15 dark:border-amber-500/30" : "border-border/70 dark:border-white/5")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-bold text-foreground dark:text-white">{item.title}</p>
            {item.isFeatured && <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400"><Crown className="h-2.5 w-2.5" /> Featured</span>}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{item.category}</p>
          {item.description && <p className="mt-1 text-xs text-muted-foreground dark:text-slate-300 line-clamp-2">{item.description}</p>}
          {item.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.skills.slice(0, 5).map((s) => <span key={s} className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{s}</span>)}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.workSampleUrl && <a href={item.workSampleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"><ExternalLink className="h-3 w-3" /> View</a>}
            <span className={cn("rounded px-1.5 py-0.5 font-bold text-[10px]", VISIBILITY_COLOR[item.visibility] || "bg-muted text-muted-foreground")}>{item.visibility}</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button type="button" onClick={onToggleFeatured} className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer", item.isFeatured ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/15")} aria-label="Feature"><Star className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onEdit} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-400 cursor-pointer" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onDelete} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 cursor-pointer" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}

export function AwardCard({ award, onEdit, onDelete, onToggleFeatured }: {
  award: AwardRecord; onEdit: () => void; onDelete: () => void; onToggleFeatured: () => void;
}) {
  return (
    <div className={cn("rounded-2xl border bg-background/80 p-4 dark:bg-slate-950/40", award.isFeatured ? "border-amber-500/40 ring-1 ring-amber-500/15 dark:border-amber-500/30" : "border-border/70 dark:border-white/5")}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400"><Award className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-bold text-foreground dark:text-white">{award.title}</p>
            {award.isFeatured && <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400"><Crown className="h-2.5 w-2.5" /> Featured</span>}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{award.issuingOrg}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground dark:text-slate-400">
            {award.category && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{award.category}</span>}
            {award.recognitionLevel && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{award.recognitionLevel}</span>}
            {award.awardDate && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Calendar className="h-2.5 w-2.5" /> {formatDateShort(award.awardDate)}</span>}
            <span className={cn("rounded px-1.5 py-0.5 font-bold", VISIBILITY_COLOR[award.visibility] || "bg-muted text-muted-foreground")}>{award.visibility}</span>
          </div>
          {award.description && <p className="mt-1 text-xs text-muted-foreground dark:text-slate-300 line-clamp-2">{award.description}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {award.verificationUrl && <a href={award.verificationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"><ExternalLink className="h-3 w-3" /> Verify</a>}
            {award.attachmentName && <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground dark:bg-white/5 dark:text-slate-300"><FileText className="h-3 w-3" /> {award.attachmentName}</span>}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button type="button" onClick={onToggleFeatured} className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer", award.isFeatured ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/15")} aria-label="Feature"><Star className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onEdit} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-400 cursor-pointer" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onDelete} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 cursor-pointer" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}

export function PublicationCard({ pub, onEdit, onDelete, onToggleFeatured }: {
  pub: PublicationRecord; onEdit: () => void; onDelete: () => void; onToggleFeatured: () => void;
}) {
  return (
    <div className={cn("rounded-2xl border bg-background/80 p-4 dark:bg-slate-950/40", pub.isFeatured ? "border-amber-500/40 ring-1 ring-amber-500/15 dark:border-amber-500/30" : "border-border/70 dark:border-white/5")}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400"><BookOpen className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-bold text-foreground dark:text-white">{pub.title}</p>
            {pub.isFeatured && <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400"><Crown className="h-2.5 w-2.5" /> Featured</span>}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{pub.authorName}{pub.coAuthors && `, ${pub.coAuthors}`}{pub.publisher && ` · ${pub.publisher}`}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground dark:text-slate-400">
            {pub.type && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{pub.type}</span>}
            {pub.researchArea && <span className="rounded bg-muted px-1.5 py-0.5 dark:bg-white/5">{pub.researchArea}</span>}
            {pub.publicationDate && <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 dark:bg-white/5"><Calendar className="h-2.5 w-2.5" /> {formatDateShort(pub.publicationDate)}</span>}
            {pub.patentStatus !== "Not Applicable" && <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-600 dark:text-amber-400">Patent: {pub.patentStatus}</span>}
            <span className={cn("rounded px-1.5 py-0.5 font-bold", VISIBILITY_COLOR[pub.visibility] || "bg-muted text-muted-foreground")}>{pub.visibility}</span>
          </div>
          {pub.abstract && <p className="mt-1 text-xs text-muted-foreground dark:text-slate-300 line-clamp-2">{pub.abstract}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pub.url && <a href={pub.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer"><ExternalLink className="h-3 w-3" /> View</a>}
            {pub.doi && <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground dark:bg-white/5 dark:text-slate-300">DOI: {pub.doi}</span>}
            {pub.attachmentName && <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground dark:bg-white/5 dark:text-slate-300"><FileText className="h-3 w-3" /> {pub.attachmentName}</span>}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button type="button" onClick={onToggleFeatured} className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer", pub.isFeatured ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/15")} aria-label="Feature"><Star className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onEdit} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-400 cursor-pointer" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onDelete} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 cursor-pointer" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
