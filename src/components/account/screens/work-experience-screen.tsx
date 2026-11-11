"use client";

import { useState, useMemo } from "react";
import {
  Briefcase, Building2, Plus, ChevronRight, TrendingUp, Banknote, Clock,
  X, AlertTriangle, ShieldCheck, Check, Crown, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  EmploymentForm, EmploymentCard, emptyEmployment,
  type EmploymentRecord,
} from "./work-experience/employment-components";
import {
  totalExperience, formatDuration, computeDuration, detectOverlaps,
  formatSalary, type DateRange,
} from "./work-experience/date-utils";

interface WorkExperienceScreenProps {
  onNavigate?: (sectionId: string) => void;
}

// Seed data — preserves the existing two records but with all new fields
function seedRecords(): EmploymentRecord[] {
  return [
    {
      id: "exp-1",
      company: "Tech Solutions Pvt Ltd",
      industry: "IT Services & Software",
      companyWebsite: "",
      companyType: "Private Limited Company",
      companySize: "201-500 employees",
      country: "India",
      state: "Karnataka",
      city: "Bengaluru",
      officeAddress: "",
      designation: "Senior Software Engineer",
      department: "Software Development",
      functionalArea: "Full Stack Development",
      jobLevel: "Senior",
      employmentType: "Full-time",
      workMode: "Hybrid",
      reportingManager: "Engineering Manager",
      teamSize: "6",
      jobCategory: "Software & IT",
      joiningDate: "2021-01-04",
      isCurrent: true,
      leavingDate: "",
      reasonForLeaving: "",
      noticePeriod: "30 Days",
      gapExplanation: "",
      annualCtc: "2200000",
      fixedSalary: "1800000",
      variableSalary: "400000",
      currency: "INR",
      salaryFrequency: "Annually",
      lastDrawnSalary: "",
      benefits: ["Health Insurance", "Provident Fund (PF)", "Performance Bonus", "Annual Bonus"],
      roleSummary: "Lead a team of 6 engineers building scalable web applications.",
      responsibilities: "Lead a team of 6 engineers building scalable web applications. Architect microservices and CI/CD pipelines. Mentor junior engineers and drive technical decisions.",
      achievements: "Reduced deployment time by 60%. Mentored 4 junior engineers to mid-level. Led migration to Kubernetes reducing infra costs by 35%.",
      skillsUsed: ["React", "Node.js", "PostgreSQL", "AWS", "Kubernetes"],
      technicalSkills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      toolsTechnologies: ["AWS", "Docker", "Kubernetes", "Jenkins", "Git"],
      projects: [
        { id: "p-1", name: "Payments Platform", description: "Re-architected the payments platform handling 10M+ transactions/month.", role: "Tech Lead", technologies: "React, Node.js, PostgreSQL, AWS", duration: "8 months", url: "", contributions: "Reduced p99 latency by 45% and improved uptime to 99.99%." },
        { id: "p-2", name: "Customer Portal 2.0", description: "Rebuilt the customer-facing portal with a modern stack.", role: "Senior Engineer", technologies: "Next.js, GraphQL, Tailwind CSS", duration: "6 months", url: "", contributions: "Improved page load performance by 40%." },
      ],
      majorContributions: "Established engineering best practices and CI/CD standards adopted org-wide.",
      awardsRecognition: "Engineering Excellence Award 2023",
      performanceHighlights: "Consistently Exceeds Expectations rating; promoted from SSE to Senior in 18 months.",
      documents: [],
      verificationStatus: "Pending Verification",
      isHighest: true,
    },
    {
      id: "exp-2",
      company: "Digital Innovations Inc",
      industry: "Software Product Development",
      companyWebsite: "",
      companyType: "Private Limited Company",
      companySize: "51-200 employees",
      country: "India",
      state: "Maharashtra",
      city: "Pune",
      officeAddress: "",
      designation: "Software Engineer",
      department: "Software Development",
      functionalArea: "Frontend Development",
      jobLevel: "Mid-Level",
      employmentType: "Full-time",
      workMode: "On-site",
      reportingManager: "Tech Lead",
      teamSize: "",
      jobCategory: "Software & IT",
      joiningDate: "2019-06-10",
      isCurrent: false,
      leavingDate: "2020-12-18",
      reasonForLeaving: "Career Growth",
      noticePeriod: "",
      gapExplanation: "",
      annualCtc: "1200000",
      fixedSalary: "1000000",
      variableSalary: "200000",
      currency: "INR",
      salaryFrequency: "Annually",
      lastDrawnSalary: "",
      benefits: ["Health Insurance", "Paid Leave (PL)"],
      roleSummary: "Developed React frontend and Node.js backend for SaaS products.",
      responsibilities: "Developed and maintained React frontend and Node.js backend for SaaS products. Collaborated with product and design teams to ship features.",
      achievements: "Shipped 12+ features. Improved page load performance by 40%.",
      skillsUsed: ["React", "Node.js", "JavaScript", "MongoDB"],
      technicalSkills: ["JavaScript", "React", "Node.js"],
      toolsTechnologies: ["Git", "Jira", "MongoDB"],
      projects: [
        { id: "p-3", name: "Analytics Dashboard", description: "Built a real-time analytics dashboard for SaaS customers.", role: "Frontend Engineer", technologies: "React, Redux, Chart.js", duration: "5 months", url: "", contributions: "Implemented virtualized tables handling 100k rows smoothly." },
        { id: "p-4", name: "Reporting Module", description: "PDF reporting module with scheduled exports.", role: "Full Stack Engineer", technologies: "Node.js, Puppeteer, MongoDB", duration: "3 months", url: "", contributions: "Reduced report generation time by 60%." },
      ],
      majorContributions: "",
      awardsRecognition: "",
      performanceHighlights: "Met Expectations rating consistently.",
      documents: [],
      verificationStatus: "Verified",
      isHighest: false,
    },
  ];
}

export function WorkExperienceScreen({ onNavigate }: WorkExperienceScreenProps) {
  const [records, setRecords] = useState<EmploymentRecord[]>(seedRecords);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EmploymentRecord>(emptyEmployment());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ─── Derived: overlap info ───
  const overlapInfos = useMemo(() => {
    const ranges: DateRange[] = records.map((r) => ({
      joiningDate: r.joiningDate,
      leavingDate: r.leavingDate,
      isCurrent: r.isCurrent,
      employmentType: r.employmentType,
    }));
    return detectOverlaps(ranges);
  }, [records]);

  const getOverlapWarning = (id: string): string | null => {
    const idx = records.findIndex((r) => r.id === id);
    if (idx < 0) return null;
    return overlapInfos[idx]?.warning || null;
  };

  // ─── Derived: total experience (non-overlapping) ───
  const totalExp = useMemo(() => {
    const ranges: DateRange[] = records.map((r) => ({
      joiningDate: r.joiningDate,
      leavingDate: r.leavingDate,
      isCurrent: r.isCurrent,
      employmentType: r.employmentType,
    }));
    return totalExperience(ranges);
  }, [records]);

  // ─── Derived: current employment ───
  const currentEmp = useMemo(() => records.find((r) => r.isCurrent), [records]);
  const currentSalaryLabel = currentEmp?.annualCtc
    ? formatSalary(currentEmp.annualCtc, currentEmp.currency, currentEmp.salaryFrequency)
    : "—";
  const noticePeriodLabel = currentEmp?.noticePeriod || "—";

  // ─── Derived: secondary stats ───
  const companiesCount = useMemo(() => new Set(records.map((r) => r.company.toLowerCase().trim())).size, [records]);
  const totalProjects = useMemo(() => records.reduce((n, r) => n + r.projects.length, 0), [records]);
  const verifiedCount = useMemo(() => records.filter((r) => r.verificationStatus === "Verified").length, [records]);
  const verificationProgress = records.length > 0 ? Math.round((verifiedCount / records.length) * 100) : 0;

  // ─── Sorted records: current first, then by leaving/joining date desc ───
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      const aEnd = a.leavingDate || a.joiningDate;
      const bEnd = b.leavingDate || b.joiningDate;
      return bEnd.localeCompare(aEnd);
    });
  }, [records]);

  // ─── Handlers ───
  const openAdd = () => { setDraft(emptyEmployment()); setEditingId(null); setShowForm(true); };
  const openEdit = (r: EmploymentRecord) => { setDraft({ ...r }); setEditingId(r.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingId(null); setDraft(emptyEmployment()); };

  const handleSave = (emp: EmploymentRecord) => {
    setRecords((prev) => {
      if (editingId) {
        // Update existing
        const updated = prev.map((r) => (r.id === editingId ? { ...emp, id: editingId } : r));
        // If marked primary (highest), demote others
        if (emp.isHighest) return updated.map((r) => ({ ...r, isHighest: r.id === editingId }));
        return updated;
      }
      // Add new
      const newId = `exp-${Date.now()}`;
      const updated = [...prev, { ...emp, id: newId }];
      if (emp.isHighest) return updated.map((r) => ({ ...r, isHighest: r.id === newId }));
      return updated;
    });
    toast.success(editingId ? "Employment record updated successfully!" : "Employment record added successfully!");
    closeForm();
  };

  const handleDeleteClick = (id: string) => setDeleteConfirmId(id);
  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    setRecords((prev) => prev.filter((r) => r.id !== deleteConfirmId));
    toast.success("Employment record deleted.");
    setDeleteConfirmId(null);
  };
  const cancelDelete = () => setDeleteConfirmId(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-7 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Briefcase className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-bold text-foreground dark:text-white">Work Experience</h3>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{records.length} record{records.length === 1 ? "" : "s"} · {companiesCount} compan{companiesCount === 1 ? "y" : "ies"} · {totalProjects} project{totalProjects === 1 ? "" : "s"}</p>
            </div>
          </div>
          <Button type="button" onClick={showForm ? closeForm : openAdd} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
            {showForm ? <><X className="h-3.5 w-3.5" /> Cancel</> : <><Plus className="h-3.5 w-3.5" /> Add Experience</>}
          </Button>
        </div>
      </section>

      {/* Summary Stats — auto-calculated */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400"><TrendingUp className="h-4 w-4" /><span className="text-xs font-semibold">Total Experience</span></div>
          <p className="mt-1.5 text-lg font-extrabold text-foreground dark:text-white">{formatDuration(totalExp)}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground dark:text-slate-400">{totalExp.totalMonths} months · non-overlapping</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><Banknote className="h-4 w-4" /><span className="text-xs font-semibold">Current Salary / CTC</span></div>
          <p className="mt-1.5 text-lg font-extrabold text-foreground dark:text-white">{currentSalaryLabel}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground dark:text-slate-400">{currentEmp ? "From current employment" : "No current employment"}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400"><Clock className="h-4 w-4" /><span className="text-xs font-semibold">Notice Period</span></div>
          <p className="mt-1.5 text-lg font-extrabold text-foreground dark:text-white">{noticePeriodLabel}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground dark:text-slate-400">{currentEmp ? "From current employment" : "No current employment"}</p>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card/60 p-3 dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-slate-400">Companies Worked</p>
          <p className="mt-1 text-sm font-bold text-foreground dark:text-white">{companiesCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-3 dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-slate-400">Current Status</p>
          <p className="mt-1 text-sm font-bold text-foreground dark:text-white">{currentEmp ? "Employed" : "Not Employed"}</p>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-3 dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-slate-400">Total Projects</p>
          <p className="mt-1 text-sm font-bold text-foreground dark:text-white">{totalProjects}</p>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-3 dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-slate-400">Verification</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm font-bold text-foreground dark:text-white">{verificationProgress}%</p>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted dark:bg-white/10">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${verificationProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <EmploymentForm
          initial={draft}
          onSave={handleSave}
          onCancel={closeForm}
          isEditing={!!editingId}
          overlapWarning={editingId ? getOverlapWarning(editingId) : null}
        />
      )}

      {/* Employment History */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">Employment History</h3>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground dark:bg-white/5 dark:text-slate-300">{records.length} Record{records.length === 1 ? "" : "s"}</span>
        </div>
        <div className="space-y-3">
          {sortedRecords.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
              <Briefcase className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground dark:text-slate-400">No employment records yet.</p>
              <p className="text-xs text-muted-foreground dark:text-slate-500">Click "Add Experience" to begin.</p>
            </div>
          )}
          {sortedRecords.map((emp) => (
            <EmploymentCard
              key={emp.id}
              emp={emp}
              onEdit={() => openEdit(emp)}
              onDelete={() => handleDeleteClick(emp.id)}
              overlapWarning={getOverlapWarning(emp.id)}
              defaultExpanded={emp.isCurrent}
            />
          ))}
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400"><AlertTriangle className="h-5 w-5" /></span>
              <h3 className="text-sm font-bold text-foreground dark:text-white">Delete Employment Record?</h3>
            </div>
            <p className="text-xs text-muted-foreground dark:text-slate-400">This action cannot be undone. The employment record and all its details (responsibilities, projects, documents) will be permanently removed.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={cancelDelete} className="h-9 rounded-lg text-xs">Cancel</Button>
              <Button onClick={confirmDelete} className="h-9 rounded-lg bg-rose-500 text-xs font-bold text-white hover:bg-rose-600">Delete Record</Button>
            </div>
          </div>
        </div>
      )}

      {/* Next Step CTA */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card p-5 dark:via-slate-900/80 dark:to-slate-900">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-foreground dark:text-white">Define your career preferences next</p>
          <button type="button" onClick={() => onNavigate?.("career-preferences")} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-amber-400 cursor-pointer">
            Continue <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
