"use client";

import { useState, useMemo, useCallback } from "react";
import {
  GraduationCap, BookOpen, Award, Plus, Pencil, Check, ChevronRight,
  Calendar, Trophy, X, Trash2, Crown, Loader2, Save, Layers,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SearchableCombobox } from "./education/searchable-combobox";
import {
  EDUCATION_LEVELS,
  DEGREE_GROUPS, ALL_DEGREES, SPECIALIZATIONS_BY_DEGREE, GENERAL_SPECIALIZATIONS,
  INSTITUTIONS, INSTITUTION_TYPES,
  COUNTRIES, getStatesForCountry, getCitiesForState,
  YEARS, COURSE_DURATIONS, COMPLETION_STATUSES, EDUCATION_MODES, COURSE_TYPES,
  GRADING_SYSTEMS, GRADES, ACADEMIC_HONOURS,
  MEDIUMS_OF_INSTRUCTION, ACCREDITATIONS,
} from "@/data/education-data";

interface EducationQualificationsScreenProps {
  onNavigate?: (sectionId: string) => void;
}

// ─── Full education record shape (all 4 sections) ───
interface Education {
  id: string;
  // 1. Academic Information
  educationLevel: string;
  degree: string;
  specialization: string;
  institution: string;
  institutionType: string;
  country: string;
  state: string;
  city: string;
  registrationNumber: string;
  // 2. Course Details
  startYear: string;
  expectedGraduationYear: string;
  actualGraduationYear: string;
  courseDuration: string;
  completionStatus: string;
  educationMode: string;
  courseType: string;
  // 3. Academic Performance
  gradingSystem: string;
  marksObtained: string;
  maxMarks: string;
  obtainedMarks: string;
  grade: string;
  hasBacklogs: "Yes" | "No" | "";
  activeBacklogs: string;
  totalBacklogs: string;
  academicHonours: string;
  // 4. Additional
  mediumOfInstruction: string;
  studyCountry: string;
  accreditation: string;
  scholarshipReceived: "Yes" | "No" | "";
  researchTitle: string;
  academicAchievements: string;
  additionalRemarks: string;
  // Meta
  isHighest: boolean;
  status: "Verified" | "Pending";
}

// Build the empty form
function createEmptyEducation(): Education {
  return {
    id: "",
    educationLevel: "",
    degree: "",
    specialization: "",
    institution: "",
    institutionType: "",
    country: "",
    state: "",
    city: "",
    registrationNumber: "",
    startYear: "",
    expectedGraduationYear: "",
    actualGraduationYear: "",
    courseDuration: "",
    completionStatus: "",
    educationMode: "",
    courseType: "",
    gradingSystem: "",
    marksObtained: "",
    maxMarks: "",
    obtainedMarks: "",
    grade: "",
    hasBacklogs: "",
    activeBacklogs: "",
    totalBacklogs: "",
    academicHonours: "",
    mediumOfInstruction: "",
    studyCountry: "",
    accreditation: "",
    scholarshipReceived: "",
    researchTitle: "",
    academicAchievements: "",
    additionalRemarks: "",
    isHighest: false,
    status: "Pending",
  };
}

// Seed data (kept minimal to match existing UI style)
const INITIAL_EDUCATIONS: Education[] = [
  {
    id: "edu-1",
    educationLevel: "Master's",
    degree: "Master of Computer Applications (MCA)",
    specialization: "Computer Applications",
    institution: "Indian Institute of Technology, Delhi",
    institutionType: "Government",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    registrationNumber: "IITD/2017/MCA/0451",
    startYear: "2017",
    expectedGraduationYear: "2019",
    actualGraduationYear: "2019",
    courseDuration: "3 Years",
    completionStatus: "Completed",
    educationMode: "Full-time",
    courseType: "Full-time Degree",
    gradingSystem: "CGPA",
    marksObtained: "8.7",
    maxMarks: "10",
    obtainedMarks: "",
    grade: "",
    hasBacklogs: "No",
    activeBacklogs: "",
    totalBacklogs: "",
    academicHonours: "Gold Medal",
    mediumOfInstruction: "English",
    studyCountry: "India",
    accreditation: "UGC",
    scholarshipReceived: "Yes",
    researchTitle: "Distributed Systems Optimization",
    academicAchievements: "Gold Medalist — MCA, First rank across all streams",
    additionalRemarks: "",
    isHighest: true,
    status: "Verified",
  },
  {
    id: "edu-2",
    educationLevel: "Bachelor's",
    degree: "Bachelor of Computer Science (B.Sc.)",
    specialization: "Computer Science",
    institution: "University of Mumbai",
    institutionType: "Government",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    registrationNumber: "MU/2014/BSC/77621",
    startYear: "2014",
    expectedGraduationYear: "2017",
    actualGraduationYear: "2017",
    courseDuration: "3 Years",
    completionStatus: "Completed",
    educationMode: "Full-time",
    courseType: "Full-time Degree",
    gradingSystem: "Percentage",
    marksObtained: "78",
    maxMarks: "100",
    obtainedMarks: "",
    grade: "First Class",
    hasBacklogs: "No",
    activeBacklogs: "",
    totalBacklogs: "",
    academicHonours: "First Class",
    mediumOfInstruction: "English",
    studyCountry: "India",
    accreditation: "UGC",
    scholarshipReceived: "No",
    researchTitle: "",
    academicAchievements: "",
    additionalRemarks: "",
    isHighest: false,
    status: "Verified",
  },
];

const INITIAL_ACHIEVEMENTS = [
  { title: "Gold Medalist — MCA", year: "2019", desc: "First rank across all streams" },
  { title: "National Hackathon Winner", year: "2018", desc: "Smart India Hackathon, Top 3 nationally" },
];

// ─── Helper: build degree options as grouped combobox options ───
function useDegreeOptions() {
  return useMemo(
    () =>
      DEGREE_GROUPS.map((g) =>
        g.degrees.map((d) => ({ value: d, label: d, group: g.field }))
      ).flat(),
    []
  );
}

// ─── Helper: specializations depend on selected degree ───
function useSpecializationOptions(degree: string) {
  return useMemo(() => {
    if (!degree) return GENERAL_SPECIALIZATIONS;
    // Exact match
    if (SPECIALIZATIONS_BY_DEGREE[degree]) return SPECIALIZATIONS_BY_DEGREE[degree];
    // Heuristic: match by degree keywords (e.g. "B.Tech" anywhere in the degree string)
    const lower = degree.toLowerCase();
    if (lower.includes("m.tech") || lower.includes("b.tech") || lower.includes("b.e.") || lower.includes("m.e.") || lower.includes("engineering")) {
      return SPECIALIZATIONS_BY_DEGREE["Bachelor of Technology (B.Tech)"];
    }
    if (lower.includes("computer application")) return SPECIALIZATIONS_BY_DEGREE["Bachelor of Computer Applications (BCA)"];
    if (lower.includes("mba") || lower.includes("business administration")) return SPECIALIZATIONS_BY_DEGREE["Master of Business Administration (MBA)"];
    if (lower.includes("b.a.") || lower.includes("arts")) return SPECIALIZATIONS_BY_DEGREE["Bachelor of Arts (B.A.)"];
    if (lower.includes("b.sc.") || lower.includes("science")) return SPECIALIZATIONS_BY_DEGREE["Bachelor of Science (B.Sc.)"];
    if (lower.includes("mbbs") || lower.includes("medicine")) return SPECIALIZATIONS_BY_DEGREE["Bachelor of Medicine, Bachelor of Surgery (MBBS)"];
    return GENERAL_SPECIALIZATIONS;
  }, [degree]);
}

// ─── Validation ───
function validateEducation(edu: Education): string | null {
  if (!edu.educationLevel) return "Please select an Education Level.";
  if (!edu.degree) return "Please select a Degree / Qualification.";
  if (!edu.institution.trim()) return "Please enter the University / Institution.";
  if (!edu.country) return "Please select the Country of Institution.";
  if (!edu.completionStatus) return "Please select the Course Completion Status.";
  if (!edu.educationMode) return "Please select the Education Mode.";
  if (!edu.courseType) return "Please select the Course Type.";
  // Marks / CGPA validation (only if provided)
  if (edu.marksObtained && edu.maxMarks) {
    const obt = parseFloat(edu.marksObtained);
    const mx = parseFloat(edu.maxMarks);
    if (!isNaN(obt) && !isNaN(mx) && obt > mx) {
      return "Marks obtained cannot exceed maximum marks.";
    }
  }
  // Backlog validation
  if (edu.hasBacklogs === "Yes") {
    if (!edu.totalBacklogs) return "Please enter the total number of backlogs.";
    const tb = parseInt(edu.totalBacklogs, 10);
    if (isNaN(tb) || tb < 0) return "Total backlogs must be a valid non-negative number.";
    if (edu.activeBacklogs) {
      const ab = parseInt(edu.activeBacklogs, 10);
      if (!isNaN(ab) && ab > tb) return "Active backlogs cannot exceed total backlogs.";
    }
  }
  // Year validation
  if (edu.startYear && edu.actualGraduationYear) {
    if (parseInt(edu.actualGraduationYear, 10) < parseInt(edu.startYear, 10)) {
      return "Actual graduation year cannot be before the course start year.";
    }
  }
  return null;
}

// ─── Main screen ───
export function EducationQualificationsScreen({ onNavigate }: EducationQualificationsScreenProps) {
  const [educations, setEducations] = useState<Education[]>(INITIAL_EDUCATIONS);
  const [achievements] = useState(INITIAL_ACHIEVEMENTS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Education>(createEmptyEducation());
  const [isSaving, setIsSaving] = useState(false);

  const degreeOptions = useDegreeOptions();
  const specializationOptions = useSpecializationOptions(form.degree);
  const stateOptions = useMemo(() => getStatesForCountry(form.country), [form.country]);
  const cityOptions = useMemo(() => getCitiesForState(form.state), [form.state]);

  // Update a single field
  const setField = useCallback(<K extends keyof Education>(key: K, val: Education[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  }, []);

  // When country changes, reset state & city
  const handleCountryChange = (country: string) => {
    setForm((prev) => ({
      ...prev,
      country,
      state: "",
      city: "",
    }));
  };
  // When state changes, reset city
  const handleStateChange = (state: string) => {
    setForm((prev) => ({ ...prev, state, city: "" }));
  };

  // Reset dependent fields when degree changes
  const handleDegreeChange = (degree: string) => {
    setForm((prev) => ({ ...prev, degree, specialization: "" }));
  };

  const openAddForm = () => {
    setForm(createEmptyEducation());
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (edu: Education) => {
    setForm({ ...edu });
    setEditingId(edu.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(createEmptyEducation());
  };

  const handleSave = () => {
    const error = validateEducation(form);
    if (error) {
      toast.error(error);
      return;
    }
    setIsSaving(true);
    // Simulate async save (preserves existing UX pattern)
    setTimeout(() => {
      const savedId = editingId || `edu-${Date.now()}`;
      setEducations((prev) => {
        const updated = editingId
          ? prev.map((e) => (e.id === editingId ? { ...form, id: editingId } : e))
          : [...prev, { ...form, id: savedId, status: "Pending" as const }];
        // If this record is marked highest, demote all others (only one highest allowed)
        if (form.isHighest) {
          return updated.map((e) => ({ ...e, isHighest: e.id === savedId }));
        }
        return updated;
      });
      toast.success(editingId ? "Qualification updated successfully!" : "Qualification added successfully!");
      setIsSaving(false);
      closeForm();
    }, 400);
  };

  // Mark a record as highest (only one can be highest)
  const handleMarkHighest = (id: string) => {
    setEducations((prev) => {
      const target = prev.find((e) => e.id === id);
      if (!target) return prev;
      if (target.isHighest) {
        // Unmark
        return prev.map((e) => (e.id === id ? { ...e, isHighest: false } : e));
      }
      return prev.map((e) => ({ ...e, isHighest: e.id === id }));
    });
    toast.success("Highest qualification updated.");
  };

  const handleDelete = (id: string) => {
    setEducations((prev) => prev.filter((e) => e.id !== id));
    toast.success("Qualification removed.");
  };

  // Derived display helpers
  const highestEdu = useMemo(() => educations.find((e) => e.isHighest), [educations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-7 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-6 w-6" />
            </span>
            {highestEdu && (
              <div className="hidden sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-slate-400">Highest Qualification</p>
                <p className="text-sm font-bold text-foreground dark:text-white">{highestEdu.degree}</p>
                <p className="text-xs text-muted-foreground dark:text-slate-400">{highestEdu.institution}</p>
              </div>
            )}
          </div>
          <Button
            type="button"
            onClick={showForm ? closeForm : openAddForm}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cancel" : "Add Qualification"}
          </Button>
        </div>
      </section>

      {/* Add / Edit Form */}
      {showForm && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
          <h3 className="pb-4 text-sm font-bold text-foreground dark:text-white">
            {editingId ? "Edit Educational Qualification" : "Add Educational Qualification"}
          </h3>

          {/* ─── Academic Information ─── */}
          <div className="mb-3 mt-5 flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"><GraduationCap className="h-4 w-4" /></span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground dark:text-white">Academic Information</h4>
              <p className="text-[10px] text-muted-foreground dark:text-slate-400">Core details about your qualification and institution</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Education Level */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Education Level <span className="text-rose-500">*</span></Label>
              <Select value={form.educationLevel} onValueChange={(v) => setField("educationLevel", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Degree */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Degree / Qualification <span className="text-rose-500">*</span></Label>
              <SearchableCombobox
                options={degreeOptions}
                value={form.degree}
                onChange={handleDegreeChange}
                placeholder="Select or search degree"
                searchPlaceholder="Search degree…"
                emptyText="Degree not found."
                allowManualEntry
                manualEntryPlaceholder="Enter degree manually…"
              />
            </div>

            {/* Specialization */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Specialization / Major</Label>
              <SearchableCombobox
                options={specializationOptions}
                value={form.specialization}
                onChange={(v) => setField("specialization", v)}
                placeholder="Select or search specialization"
                searchPlaceholder="Search specialization…"
                emptyText="Specialization not found."
                allowManualEntry
                manualEntryPlaceholder="Enter specialization manually…"
              />
            </div>

            {/* Institution */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">University / Institution <span className="text-rose-500">*</span></Label>
              <SearchableCombobox
                options={INSTITUTIONS}
                value={form.institution}
                onChange={(v) => setField("institution", v)}
                placeholder="Select or search institution"
                searchPlaceholder="Search institution…"
                emptyText="Institution not found."
                allowManualEntry
                manualEntryPlaceholder="Enter institution manually…"
              />
            </div>

            {/* Institution Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Institution Type</Label>
              <Select value={form.institutionType} onValueChange={(v) => setField("institutionType", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {INSTITUTION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Registration Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Board / University Registration Number</Label>
              <Input
                value={form.registrationNumber}
                onChange={(e) => setField("registrationNumber", e.target.value)}
                placeholder="e.g. IITD/2017/MCA/0451"
                className="h-9 rounded-lg"
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Country of Institution <span className="text-rose-500">*</span></Label>
              <Select value={form.country} onValueChange={handleCountryChange}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">State / Province</Label>
              <Select value={form.state} onValueChange={handleStateChange} disabled={!form.country}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {stateOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">City</Label>
              <SearchableCombobox
                options={cityOptions}
                value={form.city}
                onChange={(v) => setField("city", v)}
                placeholder="Select or search city"
                searchPlaceholder="Search city…"
                emptyText="City not found."
                allowManualEntry
                manualEntryPlaceholder="Enter city manually…"
                disabled={!form.state}
              />
            </div>
          </div>

          {/* ─── Course Details ─── */}
          <div className="mb-3 mt-5 flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground dark:text-white">Course Details</h4>
              <p className="text-[10px] text-muted-foreground dark:text-slate-400">Duration, status and mode of study</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Start Year */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Course Start Year</Label>
              <Select value={form.startYear} onValueChange={(v) => setField("startYear", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Expected Graduation Year */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Expected Graduation Year</Label>
              <Select value={form.expectedGraduationYear} onValueChange={(v) => setField("expectedGraduationYear", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Actual Graduation Year */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Actual Graduation Year</Label>
              <Select value={form.actualGraduationYear} onValueChange={(v) => setField("actualGraduationYear", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Course Duration */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Course Duration</Label>
              <Select value={form.courseDuration} onValueChange={(v) => setField("courseDuration", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select duration" /></SelectTrigger>
                <SelectContent>
                  {COURSE_DURATIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Completion Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Course Completion Status <span className="text-rose-500">*</span></Label>
              <Select value={form.completionStatus} onValueChange={(v) => setField("completionStatus", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  {COMPLETION_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Education Mode */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Education Mode <span className="text-rose-500">*</span></Label>
              <Select value={form.educationMode} onValueChange={(v) => setField("educationMode", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select mode" /></SelectTrigger>
                <SelectContent>
                  {EDUCATION_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Course Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Course Type <span className="text-rose-500">*</span></Label>
              <Select value={form.courseType} onValueChange={(v) => setField("courseType", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {COURSE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* ─── Academic Performance ─── */}
          <div className="mb-3 mt-5 flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Award className="h-4 w-4" /></span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground dark:text-white">Academic Performance</h4>
              <p className="text-[10px] text-muted-foreground dark:text-slate-400">Grades, marks and academic standing</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Grading System */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Grading System</Label>
              <Select value={form.gradingSystem} onValueChange={(v) => setField("gradingSystem", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select system" /></SelectTrigger>
                <SelectContent>
                  {GRADING_SYSTEMS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Marks / CGPA */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Marks / CGPA</Label>
              <Input
                type="number"
                step="0.01"
                value={form.marksObtained}
                onChange={(e) => setField("marksObtained", e.target.value)}
                placeholder="e.g. 8.7 or 78"
                className="h-9 rounded-lg"
              />
            </div>

            {/* Maximum Marks / CGPA */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Maximum Marks / CGPA</Label>
              <Input
                type="number"
                step="0.01"
                value={form.maxMarks}
                onChange={(e) => setField("maxMarks", e.target.value)}
                placeholder="e.g. 10 or 100"
                className="h-9 rounded-lg"
              />
            </div>

            {/* Obtained Marks */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Obtained Marks</Label>
              <Input
                type="number"
                step="0.01"
                value={form.obtainedMarks}
                onChange={(e) => setField("obtainedMarks", e.target.value)}
                placeholder="e.g. 780"
                className="h-9 rounded-lg"
              />
            </div>

            {/* Grade */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Grade</Label>
              <Select value={form.grade} onValueChange={(v) => setField("grade", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select grade" /></SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Backlogs */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Backlogs / Arrears</Label>
              <Select value={form.hasBacklogs} onValueChange={(v) => setField("hasBacklogs", v as "Yes" | "No" | "")}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Backlogs (conditional) */}
            {form.hasBacklogs === "Yes" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Active Backlogs</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.activeBacklogs}
                  onChange={(e) => setField("activeBacklogs", e.target.value)}
                  placeholder="e.g. 0"
                  className="h-9 rounded-lg"
                />
              </div>
            )}

            {/* Total Backlogs (conditional) */}
            {form.hasBacklogs === "Yes" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Total Backlogs <span className="text-rose-500">*</span></Label>
                <Input
                  type="number"
                  min={0}
                  value={form.totalBacklogs}
                  onChange={(e) => setField("totalBacklogs", e.target.value)}
                  placeholder="e.g. 2"
                  className="h-9 rounded-lg"
                />
              </div>
            )}

            {/* Academic Honours */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Academic Honours</Label>
              <Select value={form.academicHonours} onValueChange={(v) => setField("academicHonours", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select honour" /></SelectTrigger>
                <SelectContent>
                  {ACADEMIC_HONOURS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* ─── Additional Academic Information ─── */}
          <div className="mb-3 mt-5 flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"><Trophy className="h-4 w-4" /></span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground dark:text-white">Additional Academic Information</h4>
              <p className="text-[10px] text-muted-foreground dark:text-slate-400">Optional context, accreditation and remarks</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Medium of Instruction */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Medium of Instruction</Label>
              <Select value={form.mediumOfInstruction} onValueChange={(v) => setField("mediumOfInstruction", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select medium" /></SelectTrigger>
                <SelectContent>
                  {MEDIUMS_OF_INSTRUCTION.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Study Country */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Study Country</Label>
              <Select value={form.studyCountry} onValueChange={(v) => setField("studyCountry", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Accreditation */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Accreditation / Recognition</Label>
              <Select value={form.accreditation} onValueChange={(v) => setField("accreditation", v)}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select accreditation" /></SelectTrigger>
                <SelectContent>
                  {ACCREDITATIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Scholarship Received */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Scholarship Received</Label>
              <Select value={form.scholarshipReceived} onValueChange={(v) => setField("scholarshipReceived", v as "Yes" | "No" | "")}>
                <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Research / Thesis Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Research / Thesis Title</Label>
              <Input
                value={form.researchTitle}
                onChange={(e) => setField("researchTitle", e.target.value)}
                placeholder="e.g. Distributed Systems Optimization"
                className="h-9 rounded-lg"
              />
            </div>

            {/* Academic Achievements */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Academic Achievements</Label>
              <Textarea
                rows={2}
                value={form.academicAchievements}
                onChange={(e) => setField("academicAchievements", e.target.value)}
                placeholder="e.g. Gold medalist, rank holder, hackathon winner…"
                className="resize-y rounded-lg text-xs"
              />
            </div>

            {/* Additional Remarks */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Additional Remarks</Label>
              <Textarea
                rows={2}
                value={form.additionalRemarks}
                onChange={(e) => setField("additionalRemarks", e.target.value)}
                placeholder="Any other relevant information…"
                className="resize-y rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Mark as highest toggle + actions */}
          <div className="mt-5 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground dark:text-slate-200">
              <input
                type="checkbox"
                checked={form.isHighest}
                onChange={(e) => setField("isHighest", e.target.checked)}
                className="h-4 w-4 rounded border-border accent-cyan-500 dark:border-white/20"
              />
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              Mark as highest qualification
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeForm} className="h-9 rounded-lg text-xs">Cancel</Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="h-9 rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
              >
                {isSaving ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
                ) : (
                  <><Save className="h-3.5 w-3.5" /> {editingId ? "Update" : "Save"} Qualification</>
                )}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Educational Qualifications List */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">Academic Qualifications</h3>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {educations.length} Added
          </span>
        </div>
        <div className="space-y-3">
          {educations.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground dark:border-white/10 dark:text-slate-400">
              No qualifications added yet. Click "Add Qualification" to begin.
            </div>
          )}
          {educations.map((edu) => (
            <div
              key={edu.id}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between transition-all dark:bg-slate-950/40",
                edu.isHighest
                  ? "border-amber-500/50 ring-1 ring-amber-500/20 dark:border-amber-500/40"
                  : "border-border/70 dark:border-white/5"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <GraduationCap className="h-5 w-5" />
                  {edu.isHighest && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-slate-950" title="Highest qualification">
                      <Crown className="h-2.5 w-2.5" />
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-foreground dark:text-white">{edu.degree || edu.educationLevel}</p>
                    {edu.isHighest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        <Crown className="h-2.5 w-2.5" /> Highest
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{edu.institution}</p>
                  <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-muted-foreground dark:text-slate-400">
                    {edu.specialization && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 dark:bg-white/5"><BookOpen className="h-3 w-3" /> {edu.specialization}</span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 dark:bg-white/5"><Layers className="h-3 w-3" /> {edu.educationLevel}</span>
                    {edu.actualGraduationYear && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 dark:bg-white/5"><Calendar className="h-3 w-3" /> {edu.actualGraduationYear}</span>
                    )}
                    {edu.marksObtained && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 dark:bg-white/5">
                        {edu.marksObtained}{edu.maxMarks ? `/${edu.maxMarks}` : ""} {edu.gradingSystem}
                      </span>
                    )}
                    {edu.completionStatus && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 dark:bg-white/5"><Check className="h-3 w-3" /> {edu.completionStatus}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", edu.status === "Verified" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400")}>
                  {edu.status === "Verified" ? <Check className="h-3 w-3" /> : <Calendar className="h-3 w-3" />} {edu.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleMarkHighest(edu.id)}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer",
                    edu.isHighest
                      ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                      : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/15 dark:hover:text-amber-400"
                  )}
                  aria-label="Mark as highest qualification"
                  title={edu.isHighest ? "Unmark highest" : "Mark as highest"}
                >
                  <Crown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => openEditForm(edu)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-400 cursor-pointer"
                  aria-label="Edit qualification"
                  title="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(edu.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 cursor-pointer"
                  aria-label="Delete qualification"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Achievements (kept from original UI) */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">Academic Achievements</h3>
          </div>
          <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:underline dark:text-cyan-400 cursor-pointer">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {achievements.map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 dark:border-white/5 dark:bg-slate-950/40">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Award className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground dark:text-white">{a.title}</p>
                  <span className="text-[11px] text-muted-foreground dark:text-slate-500">{a.year}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next Step CTA */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card p-5 dark:via-slate-900/80 dark:to-slate-900">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-foreground dark:text-white">Add your skills and certifications next</p>
          <button type="button" onClick={() => onNavigate?.("skills-certifications")} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-amber-400 cursor-pointer">
            Continue <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
