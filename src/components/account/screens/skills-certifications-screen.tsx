"use client";

import { useState, useMemo } from "react";
import {
  Sparkles, Code2, Wrench, Award, Heart, Briefcase, ChevronRight, Plus, Search, Filter, Crown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  SKILL_CATEGORIES, PROFICIENCY_LEVELS,
} from "@/data/skills-data";
import {
  SkillForm, SkillCard, CertificationForm, CertificationCard,
  LicenseForm, LicenseCard,
  emptySkill, emptyCert, emptyLicense,
  type SkillRecord, type CertificationRecord, type LicenseRecord,
} from "./skills/skills-components";

interface SkillsCertificationsScreenProps {
  onNavigate?: (sectionId: string) => void;
}

// Icon resolver for skill categories
const CATEGORY_ICONS: Record<string, typeof Code2> = {
  "technical": Code2,
  "functional": Briefcase,
  "tools-technologies": Wrench,
  "professional": Award,
  "industry-domain": Sparkles,
  "personal-other": Heart,
};

export function SkillsCertificationsScreen({ onNavigate }: SkillsCertificationsScreenProps) {
  // ─── Skills state ───
  const [skills, setSkills] = useState<SkillRecord[]>([
    { id: "sk-1", name: "React.js", categoryId: "technical", proficiency: "Expert", years: "4", months: "0", experienceType: "Professional", lastUsed: "2024-11", isPrimary: true, description: "Built 20+ production React apps.", isCustom: false },
    { id: "sk-2", name: "TypeScript", categoryId: "technical", proficiency: "Advanced", years: "3", months: "0", experienceType: "Professional", lastUsed: "2024-11", isPrimary: false, description: "", isCustom: false },
    { id: "sk-3", name: "Project Management", categoryId: "professional", proficiency: "Advanced", years: "5", months: "0", experienceType: "Professional", lastUsed: "2024-10", isPrimary: false, description: "", isCustom: false },
    { id: "sk-4", name: "AWS", categoryId: "tools-technologies", proficiency: "Advanced", years: "3", months: "0", experienceType: "Professional", lastUsed: "2024-09", isPrimary: false, description: "", isCustom: false },
  ]);

  // ─── Certifications & Licenses state ───
  const [certs, setCerts] = useState<CertificationRecord[]>([
    { id: "c-1", name: "AWS Certified Solutions Architect", category: "Cloud Computing", issuingOrg: "Amazon Web Services (AWS)", credentialId: "AWS-PSA-1234567", issueDate: "2023-06-15", expiryDate: "2026-06-15", neverExpires: false, verificationUrl: "https://aws.amazon.com/verification", status: "Active" },
    { id: "c-2", name: "Professional Scrum Master I", category: "Agile & Scrum", issuingOrg: "Scrum.org", credentialId: "PSM-I-987654", issueDate: "2022-03-10", expiryDate: "", neverExpires: true, verificationUrl: "", status: "Active" },
  ]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([
    { id: "l-1", name: "Driving License (LMV)", category: "Driving License", issuingAuthority: "Regional Transport Office (RTO)", licenseNumber: "KA-2023-LMV-1234567", jurisdiction: "India", issueDate: "2020-01-20", expiryDate: "2040-01-19", neverExpires: false, status: "Active" },
  ]);

  // ─── Form state ───
  const [activeTab, setActiveTab] = useState<"skills" | "certifications" | "licenses">("skills");
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillDraft, setSkillDraft] = useState<SkillRecord>(emptySkill("technical"));

  const [certFormOpen, setCertFormOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certDraft, setCertDraft] = useState<CertificationRecord>(emptyCert());

  const [licenseFormOpen, setLicenseFormOpen] = useState(false);
  const [editingLicenseId, setEditingLicenseId] = useState<string | null>(null);
  const [licenseDraft, setLicenseDraft] = useState<LicenseRecord>(emptyLicense());

  // ─── Filters (skills) ───
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterProficiency, setFilterProficiency] = useState("all");

  // ─── Derived data ───
  const filteredSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return skills.filter((s) => {
      if (filterCategory !== "all" && s.categoryId !== filterCategory) return false;
      if (filterProficiency !== "all" && s.proficiency !== filterProficiency) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [skills, searchQuery, filterCategory, filterProficiency]);

  const skillsByCategory = useMemo(() => {
    const map: Record<string, SkillRecord[]> = {};
    for (const cat of SKILL_CATEGORIES) {
      map[cat.id] = filteredSkills.filter((s) => s.categoryId === cat.id);
    }
    return map;
  }, [filteredSkills]);

  const primarySkillsCount = useMemo(() => skills.filter((s) => s.isPrimary).length, [skills]);

  // ─── Skill handlers ───
  const openAddSkill = () => {
    setSkillDraft(emptySkill("technical"));
    setEditingSkillId(null);
    setSkillFormOpen(true);
  };
  const openEditSkill = (s: SkillRecord) => {
    setSkillDraft({ ...s });
    setEditingSkillId(s.id);
    setSkillFormOpen(true);
  };
  const closeSkillForm = () => { setSkillFormOpen(false); setEditingSkillId(null); };
  const handleSaveSkill = (skill: SkillRecord) => {
    setSkills((prev) => {
      if (editingSkillId) {
        // Edit
        const updated = prev.map((s) => (s.id === editingSkillId ? { ...skill, id: editingSkillId } : s));
        // If marked primary, demote others
        if (skill.isPrimary) return updated.map((s) => ({ ...s, isPrimary: s.id === editingSkillId }));
        return updated;
      }
      // Add
      const newId = `sk-${Date.now()}`;
      const updated = [...prev, { ...skill, id: newId }];
      if (skill.isPrimary) return updated.map((s) => ({ ...s, isPrimary: s.id === newId }));
      return updated;
    });
    toast.success(editingSkillId ? "Skill updated successfully!" : "Skill added successfully!");
    closeSkillForm();
  };
  const handleDeleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    toast.success("Skill removed.");
  };
  const handleTogglePrimary = (id: string) => {
    setSkills((prev) => {
      const target = prev.find((s) => s.id === id);
      if (!target) return prev;
      if (target.isPrimary) {
        return prev.map((s) => (s.id === id ? { ...s, isPrimary: false } : s));
      }
      // marking primary — demote others
      return prev.map((s) => ({ ...s, isPrimary: s.id === id }));
    });
    toast.success("Primary skill updated.");
  };

  // ─── Certification handlers ───
  const openAddCert = () => { setCertDraft(emptyCert()); setEditingCertId(null); setCertFormOpen(true); };
  const openEditCert = (c: CertificationRecord) => { setCertDraft({ ...c }); setEditingCertId(c.id); setCertFormOpen(true); };
  const closeCertForm = () => { setCertFormOpen(false); setEditingCertId(null); };
  const handleSaveCert = (cert: CertificationRecord) => {
    setCerts((prev) => {
      if (editingCertId) return prev.map((c) => (c.id === editingCertId ? { ...cert, id: editingCertId } : c));
      return [...prev, { ...cert, id: `c-${Date.now()}` }];
    });
    toast.success(editingCertId ? "Certification updated successfully!" : "Certification added successfully!");
    closeCertForm();
  };
  const handleDeleteCert = (id: string) => { setCerts((prev) => prev.filter((c) => c.id !== id)); toast.success("Certification removed."); };

  // ─── License handlers ───
  const openAddLicense = () => { setLicenseDraft(emptyLicense()); setEditingLicenseId(null); setLicenseFormOpen(true); };
  const openEditLicense = (l: LicenseRecord) => { setLicenseDraft({ ...l }); setEditingLicenseId(l.id); setLicenseFormOpen(true); };
  const closeLicenseForm = () => { setLicenseFormOpen(false); setEditingLicenseId(null); };
  const handleSaveLicense = (license: LicenseRecord) => {
    setLicenses((prev) => {
      if (editingLicenseId) return prev.map((l) => (l.id === editingLicenseId ? { ...license, id: editingLicenseId } : l));
      return [...prev, { ...license, id: `l-${Date.now()}` }];
    });
    toast.success(editingLicenseId ? "License updated successfully!" : "License added successfully!");
    closeLicenseForm();
  };
  const handleDeleteLicense = (id: string) => { setLicenses((prev) => prev.filter((l) => l.id !== id)); toast.success("License removed."); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-7 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-bold text-foreground dark:text-white">Skills & Certifications</h3>
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                {skills.length} skills · {certs.length} certifications · {licenses.length} licenses · {primarySkillsCount} primary
              </p>
            </div>
          </div>
          {/* Tab switcher */}
          <div className="inline-flex rounded-xl border border-border bg-background/80 p-1 dark:border-white/10 dark:bg-slate-950/60">
            {([
              { id: "skills", label: "Skills", icon: Code2 },
              { id: "certifications", label: "Certifications", icon: Award },
              { id: "licenses", label: "Licenses", icon: Briefcase },
            ] as const).map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setActiveTab(t.id); }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    activeTab === t.id
                      ? "bg-emerald-500 text-slate-950"
                      : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── SKILLS TAB ───── */}
      {activeTab === "skills" && (
        <div className="space-y-4">
          {/* Filters + Add */}
          <section className="rounded-2xl border border-border bg-card/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills…"
                  className="h-9 rounded-lg pl-9"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-9 rounded-lg sm:w-48"><SelectValue placeholder="All categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {SKILL_CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterProficiency} onValueChange={setFilterProficiency}>
                <SelectTrigger className="h-9 rounded-lg sm:w-40"><SelectValue placeholder="All proficiency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Proficiency</SelectItem>
                  {PROFICIENCY_LEVELS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={openAddSkill}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                <Plus className="h-3.5 w-3.5" /> Add Skill
              </Button>
            </div>
          </section>

          {/* Skill form (Add / Edit) */}
          {skillFormOpen && (
            <SkillForm
              initial={skillDraft}
              onSave={handleSaveSkill}
              onCancel={closeSkillForm}
              existingNames={editingSkillId ? skills.filter((s) => s.id !== editingSkillId).map((s) => s.name) : skills.map((s) => s.name)}
              isEditing={!!editingSkillId}
            />
          )}

          {/* Skills grouped by category */}
          {filteredSkills.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
              <Filter className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground dark:text-slate-400">No skills match your filters.</p>
              <p className="text-xs text-muted-foreground dark:text-slate-500">Try adjusting your search or filters.</p>
            </section>
          ) : (
            SKILL_CATEGORIES.map((cat) => {
              const catSkills = skillsByCategory[cat.id] || [];
              if (catSkills.length === 0) return null;
              const Icon = CATEGORY_ICONS[cat.id] || Code2;
              return (
                <section key={cat.id} className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
                  <div className="mb-4 flex items-center justify-between pb-3 border-b border-border/60 dark:border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", cat.bg)}>
                        <Icon className={cn("h-4 w-4", cat.accent)} />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-foreground dark:text-white">{cat.name}</h3>
                        <p className="text-[10px] text-muted-foreground dark:text-slate-400">{catSkills.length} skill{catSkills.length === 1 ? "" : "s"} · {cat.description}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => { setSkillDraft(emptySkill(cat.id)); setEditingSkillId(null); setSkillFormOpen(true); }} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 cursor-pointer">
                      <Plus className="h-3 w-3" /> Add to {cat.name}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {catSkills.map((s) => (
                      <SkillCard
                        key={s.id}
                        skill={s}
                        onEdit={() => openEditSkill(s)}
                        onDelete={() => handleDeleteSkill(s.id)}
                        onTogglePrimary={() => handleTogglePrimary(s.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      )}

      {/* ───── CERTIFICATIONS TAB ───── */}
      {activeTab === "certifications" && (
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-foreground dark:text-white">Certifications</h3>
                  <p className="text-[11px] text-muted-foreground dark:text-slate-400">{certs.length} certification{certs.length === 1 ? "" : "s"} added</p>
                </div>
              </div>
              <Button type="button" onClick={openAddCert} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-xs font-bold text-slate-950 hover:bg-emerald-400">
                <Plus className="h-3.5 w-3.5" /> Add Certification
              </Button>
            </div>
          </section>

          {certFormOpen && (
            <CertificationForm
              initial={certDraft}
              onSave={handleSaveCert}
              onCancel={closeCertForm}
              isEditing={!!editingCertId}
            />
          )}

          {certs.length === 0 && !certFormOpen ? (
            <section className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
              <Award className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground dark:text-slate-400">No certifications added yet.</p>
            </section>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {certs.map((c) => (
                <CertificationCard key={c.id} cert={c} onEdit={() => openEditCert(c)} onDelete={() => handleDeleteCert(c.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───── LICENSES TAB ───── */}
      {activeTab === "licenses" && (
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-foreground dark:text-white">Professional Licenses</h3>
                  <p className="text-[11px] text-muted-foreground dark:text-slate-400">{licenses.length} license{licenses.length === 1 ? "" : "s"} added</p>
                </div>
              </div>
              <Button type="button" onClick={openAddLicense} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-xs font-bold text-slate-950 hover:bg-emerald-400">
                <Plus className="h-3.5 w-3.5" /> Add License
              </Button>
            </div>
          </section>

          {licenseFormOpen && (
            <LicenseForm
              initial={licenseDraft}
              onSave={handleSaveLicense}
              onCancel={closeLicenseForm}
              isEditing={!!editingLicenseId}
            />
          )}

          {licenses.length === 0 && !licenseFormOpen ? (
            <section className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
              <Briefcase className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground dark:text-slate-400">No licenses added yet.</p>
            </section>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {licenses.map((l) => (
                <LicenseCard key={l.id} license={l} onEdit={() => openEditLicense(l)} onDelete={() => handleDeleteLicense(l.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Next Step CTA */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card p-5 dark:via-slate-900/80 dark:to-slate-900">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-foreground dark:text-white">Add your work experience next</p>
          <button type="button" onClick={() => onNavigate?.("work-experience")} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-amber-400 cursor-pointer">
            Continue <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
