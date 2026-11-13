"use client";

import { useState } from "react";
import {
  GraduationCap, Building2, MapPin, Globe, Mail, Phone, Users, Award,
  CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, Briefcase,
  Sparkles, Save, Edit3, ChevronRight, ExternalLink, Calendar, Check
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityInstitutionProfileScreenProps {
  onNavigate?: (sectionId: string) => void;
}

export function UniversityInstitutionProfileScreen({ onNavigate }: UniversityInstitutionProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"demographics" | "infrastructure" | "leadership" | "focus">("demographics");

  // Form State initialized with Deccan Institute data (matching reference)
  const [formData, setFormData] = useState({
    institutionName: "Deccan Institute of Science & Technology",
    institutionCode: "JOB-COL-0001",
    institutionType: "Autonomous Engineering College",
    affiliatingUniversity: "Osmania University, Hyderabad",
    autonomyStatus: "UGC Autonomous (Conferred 2018, Valid till 2028)",
    fundingType: "Private Aided / Trust",
    establishedYear: "1998",
    campusesCount: 2,
    website: "https://deccancampus.edu.in",
    officialEmail: "registrar@deccancampus.edu.in",
    placementEmail: "tnp@deccancampus.edu.in",
    phone: "+91 40 2311 8900",
    headquarters: "Main Campus, Survey 42, Hitech City Main Rd, Madhapur, Hyderabad, Telangana 500081",
    
    // Infrastructure
    smartClassrooms: 48,
    computerLabs: 8,
    totalWorkstations: 480,
    internetBandwidth: "1 Gbps Dedicated Leased Line (Redundant)",
    hasPlacementCell: true,
    hasTrainingCell: true,
    hasIncubationCentre: true,
    
    // Leadership & Contacts
    principalName: "Dr. Anitha Raghavan",
    principalDesignation: "Principal & Member Secretary (Governing Body)",
    principalEmail: "principal@deccancampus.edu.in",
    principalPhone: "+91 98490 12345",
    
    tnpHeadName: "Prof. K. Ramamurthy",
    tnpHeadDesignation: "Head — Training & Placement Cell",
    tnpHeadEmail: "ramamurthy.k@deccancampus.edu.in",
    tnpHeadPhone: "+91 94401 67890",
    
    coordinatorName: "Dr. S. Meenakshi",
    coordinatorDesignation: "Academic Dean & jobson.id Partnership Coordinator",
    
    // Focus Areas
    priorities: [
      "AI & Data Science Centers of Excellence",
      "Full-Stack Software Engineering Capstones",
      "Campus Placement & 100% Industry Readiness",
      "Paid Student Internships (Pre-final year)",
      "Faculty Upskilling & Master Trainer Certifications",
      "Annual Corporate Hackathons & Drive Hosting",
    ],
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Institution Profile updated successfully", {
      description: "Changes saved to the jobson.id University Partner registry.",
    });
  };

  return (
    <div className="space-y-6">
      {/* ─── Top MoU Expiry Banners (as featured in Image 3) ─── */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Clock className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-semibold text-foreground dark:text-white">
                MoU expiry — 90-day window
              </p>
              <p className="text-[11px] text-muted-foreground dark:text-amber-300/80">
                Active MoU expires in 55 days — start renewal planning and department allocations.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("company-info")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-background/80 px-3 py-1.5 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-500/10 dark:bg-slate-900/80 dark:text-amber-300 cursor-pointer"
          >
            Review MoU <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-xs text-orange-700 dark:text-orange-300">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-semibold text-foreground dark:text-white">
                MoU expiry — 60-day window
              </p>
              <p className="text-[11px] text-muted-foreground dark:text-orange-300/80">
                MoU expires in 55 days — commercial revision and seat quota renewal due.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("company-info")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/40 bg-background/80 px-3 py-1.5 text-[11px] font-semibold text-orange-700 transition hover:bg-orange-500/10 dark:bg-slate-900/80 dark:text-orange-300 cursor-pointer"
          >
            Commercial Terms <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* ─── Hero Institution Identity Header ─── */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card/90 to-violet-500/5 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-500 p-0.5 shadow-lg shadow-violet-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-card dark:bg-slate-950">
                <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-card dark:ring-slate-950">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-foreground dark:text-white sm:text-2xl">
                  {formData.institutionName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  <GraduationCap className="h-3 w-3" /> College / University Partner
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  ACTIVE
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  PREMIUM
                </span>
              </div>

              <p className="text-xs text-muted-foreground dark:text-slate-400">
                <span className="font-mono font-medium text-foreground dark:text-slate-300">{formData.institutionCode}</span>
                {" • "}
                <span>{formData.affiliatingUniversity}</span>
                {" • "}
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Hyderabad, Telangana
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition cursor-pointer",
                isEditing
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "border border-border bg-background hover:bg-muted dark:border-white/10 dark:bg-slate-950 dark:hover:bg-white/5"
              )}
            >
              {isEditing ? (
                <>
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </>
              ) : (
                <>
                  <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("documents")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-500/20 dark:text-emerald-300 cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Compliance (82%)
            </button>
          </div>
        </div>

        {/* ─── 10 KPI Metric Cards (Exact match to Image 3 reference) ─── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Total Students</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Users className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">10</p>
            <p className="text-[10px] text-muted-foreground dark:text-slate-500">enrolled via jobson.id</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Active Students</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">7</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">avg attendance 61%</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Students Trained</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">3</p>
            <p className="text-[10px] text-muted-foreground dark:text-slate-500">training completed</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Certifications</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Award className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">3</p>
            <p className="text-[10px] text-muted-foreground dark:text-slate-500">credentials issued</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Internships</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <Briefcase className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">6</p>
            <p className="text-[10px] text-purple-600 dark:text-purple-400">3 active industry stints</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Projects</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Building2 className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">5</p>
            <p className="text-[10px] text-muted-foreground dark:text-slate-500">capstone solutions</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Placement Rate</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">78%</p>
            <p className="text-[10px] text-muted-foreground dark:text-slate-500">1 placed</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Partner Revenue</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 font-bold">
                ₹
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">₹3.47L</p>
            <p className="text-[10px] text-muted-foreground dark:text-slate-500">lifetime partner share</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Pending Payments</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                <Clock className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">₹1.84L</p>
            <p className="text-[10px] text-red-600 dark:text-red-400">5 pending invoices</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground dark:text-slate-400">Health Score</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground dark:text-white">82/100</p>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Healthy</p>
          </div>
        </div>
      </section>

      {/* ─── Profile Navigation Tabs ─── */}
      <div className="flex border-b border-border dark:border-white/10">
        {[
          { key: "demographics", label: "Institution & Governance" },
          { key: "infrastructure", label: "Campus & Labs" },
          { key: "leadership", label: "Key Officials & Contacts" },
          { key: "focus", label: "Partnership Focus & Objectives" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-xs font-semibold transition cursor-pointer",
              activeTab === tab.key
                ? "border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-white"
                : "border-transparent text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab Content 1: Institution & Governance ─── */}
      {activeTab === "demographics" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                Official Institution Legal Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                Institution Type & Classification
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.institutionType}
                onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                Affiliating State / Central University
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.affiliatingUniversity}
                onChange={(e) => setFormData({ ...formData, affiliatingUniversity: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                Autonomy Status & Conferred Period
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.autonomyStatus}
                onChange={(e) => setFormData({ ...formData, autonomyStatus: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                Funding Structure
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fundingType}
                onChange={(e) => setFormData({ ...formData, fundingType: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                  Established Year
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.establishedYear}
                  onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                  Total Campuses
                </label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={formData.campusesCount}
                  onChange={(e) => setFormData({ ...formData, campusesCount: Number(e.target.value) })}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                Primary Campus Location & Full Postal Address
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.headquarters}
                onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                Official Web Portal
              </label>
              <div className="relative mt-1">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">
                Registrar / Administrative Desk Email
              </label>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.officialEmail}
                  onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                  className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-80 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Tab Content 2: Campus & Labs ─── */}
      {activeTab === "infrastructure" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground dark:text-white">
              Campus Facilities, Technical Labs & Training Infrastructure
            </h3>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              Verified computer labs and facilities evaluated for jobson.id batch training and assessment delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-muted/20 p-4 dark:border-white/5 dark:bg-slate-950/40">
              <p className="text-xs font-semibold text-muted-foreground">Smart Classrooms</p>
              <p className="mt-1 text-2xl font-bold text-foreground dark:text-white">{formData.smartClassrooms}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Audio-visual & interactive displays</p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4 dark:border-white/5 dark:bg-slate-950/40">
              <p className="text-xs font-semibold text-muted-foreground">Dedicated Computer Labs</p>
              <p className="mt-1 text-2xl font-bold text-foreground dark:text-white">{formData.computerLabs}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Dual-boot Linux & Windows</p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4 dark:border-white/5 dark:bg-slate-950/40">
              <p className="text-xs font-semibold text-muted-foreground">High-Spec Workstations</p>
              <p className="mt-1 text-2xl font-bold text-foreground dark:text-white">{formData.totalWorkstations}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">16GB RAM + Core i7 / GPU nodes</p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4 dark:border-white/5 dark:bg-slate-950/40">
              <p className="text-xs font-semibold text-muted-foreground">Internet Backbone</p>
              <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400">1 Gbps Leased Line</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Redundant fiber optic ISP</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Institutional Cells & Operating Centers
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground dark:text-white">Training & Placement Cell</p>
                  <p className="text-[11px] text-muted-foreground">Active corporate drive rooms</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground dark:text-white">Skilling & LMS Delivery Cell</p>
                  <p className="text-[11px] text-muted-foreground">Faculty mentors allocated</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground dark:text-white">Incubation & Startup Center</p>
                  <p className="text-[11px] text-muted-foreground">Student venture support</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Tab Content 3: Key Officials & Contacts ─── */}
      {activeTab === "leadership" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground dark:text-white">
              Institutional Leadership & Authorized Signatories
            </h3>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              Responsible authorities for academic operations, placement drives, and statutory MoU execution.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-muted/20 p-4 dark:border-white/5 dark:bg-slate-950/40">
              <span className="inline-block rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-violet-700 dark:text-violet-300">
                Principal & Signatory
              </span>
              <p className="mt-2 text-sm font-bold text-foreground dark:text-white">{formData.principalName}</p>
              <p className="text-xs text-muted-foreground">{formData.principalDesignation}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground dark:text-slate-400">
                <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-emerald-600" /> {formData.principalEmail}</p>
                <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-emerald-600" /> {formData.principalPhone}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4 dark:border-white/5 dark:bg-slate-950/40">
              <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300">
                Training & Placement Head
              </span>
              <p className="mt-2 text-sm font-bold text-foreground dark:text-white">{formData.tnpHeadName}</p>
              <p className="text-xs text-muted-foreground">{formData.tnpHeadDesignation}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground dark:text-slate-400">
                <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-emerald-600" /> {formData.tnpHeadEmail}</p>
                <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-emerald-600" /> {formData.tnpHeadPhone}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4 dark:border-white/5 dark:bg-slate-950/40">
              <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                jobson.id Coordinator
              </span>
              <p className="mt-2 text-sm font-bold text-foreground dark:text-white">{formData.coordinatorName}</p>
              <p className="text-xs text-muted-foreground">{formData.coordinatorDesignation}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground dark:text-slate-400">
                <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-emerald-600" /> dean.acad@deccancampus.edu.in</p>
                <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-emerald-600" /> +91 40 2311 8904</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Tab Content 4: Partnership Objectives ─── */}
      {activeTab === "focus" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground dark:text-white">
              Institutional Partnership Goals & Focus Areas
            </h3>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              Strategic priorities agreed between {formData.institutionName} and jobson.id for the current MoU cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {formData.priorities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-xs dark:border-white/5 dark:bg-slate-950/40"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span className="font-medium text-foreground dark:text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Bottom Navigation Actions ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("account-type")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Switch Account Portal
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("company-info")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to MoU & Agreement →
        </button>
      </div>
    </div>
  );
}
