"use client";

import { useMemo, useState } from "react";
import {
  GraduationCap, Users, Award, Target, IndianRupee, Wallet,
  FileSignature, HeartPulse, Clock, AlertTriangle, ArrowRight,
  TrendingUp, CheckCircle2, Building2, CalendarRange, BookOpen,
  Briefcase, KanbanSquare, Sparkles, Download, ExternalLink, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityOverviewCockpitProps {
  onNavigate?: (tab: string) => void;
}

export function UniversityOverviewCockpitScreen({ onNavigate }: UniversityOverviewCockpitProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Cockpit Synchronized", {
        description: "Deccan Institute metrics updated in real-time from jobson.id University Desk.",
      });
    }, 600);
  };

  // 10 Stat cards matching exactly the user's reference screenshot
  const STAT_CARDS = [
    {
      id: "students",
      title: "Total Students",
      value: "10",
      sub: "enrolled via jobson.id",
      icon: GraduationCap,
      color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
      target: "students",
    },
    {
      id: "active",
      title: "Active Students",
      value: "7",
      sub: "avg attendance 61%",
      icon: TrendingUp,
      color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      target: "students",
    },
    {
      id: "trained",
      title: "Students Trained",
      value: "3",
      sub: "training completed",
      icon: CheckCircle2,
      color: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/20",
      target: "training",
    },
    {
      id: "certs",
      title: "Certifications",
      value: "3",
      sub: "issued to date",
      icon: Award,
      color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
      target: "programs",
    },
    {
      id: "internships",
      title: "Internships",
      value: "6",
      sub: "3 active",
      icon: Briefcase,
      color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
      target: "internships",
    },
    {
      id: "projects",
      title: "Projects",
      value: "5",
      sub: "capstones in progress",
      icon: KanbanSquare,
      color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      target: "internships",
    },
    {
      id: "placement",
      title: "Placement Rate",
      value: "78%",
      sub: "1 placed",
      icon: Target,
      color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      target: "placements",
    },
    {
      id: "revenue",
      title: "Partner Revenue",
      value: "₹3.47L",
      sub: "lifetime partner share",
      icon: IndianRupee,
      color: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/20",
      target: "revenue",
    },
    {
      id: "pending",
      title: "Pending Payments",
      value: "₹1.84L",
      sub: "5 pending invoices",
      icon: Clock,
      color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
      target: "revenue",
    },
    {
      id: "health",
      title: "Health Score",
      value: "82/100",
      sub: "Healthy",
      icon: HeartPulse,
      color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      target: "documents",
    },
  ];

  const ACTIVE_BATCHES = [
    {
      batch: "Batch A — Full-Stack Engineering (CSE)",
      program: "Full-Stack Web & AI Engineering",
      enrolled: 42,
      seats: 60,
      mode: "Hybrid",
      trainer: "Rahul Verma (Master Trainer)",
      progress: 70,
    },
    {
      batch: "Batch B — Data Science & Applied AI (AI/DS)",
      program: "Data Science & GenAI Systems",
      enrolled: 38,
      seats: 50,
      mode: "On-Campus Lab",
      trainer: "Dr. Radhika Sharma",
      progress: 76,
    },
    {
      batch: "Batch C — Cloud & DevOps Engineering (ECE)",
      program: "Cloud Architecture & Kubernetes",
      enrolled: 40,
      seats: 50,
      mode: "Hybrid",
      trainer: "Arun Swaminathan",
      progress: 80,
    },
  ];

  const UPCOMING_DRIVES = [
    {
      id: "drv_1",
      company: "TechCorp India",
      role: "Software Development Engineer",
      ctc: "₹12.0 LPA",
      date: "28 Nov 2026",
      seats: 15,
      mode: "Campus Drive",
      status: "OPEN",
    },
    {
      id: "drv_2",
      company: "DataMinds AI",
      role: "Junior AI/ML Engineer",
      ctc: "₹16.5 LPA",
      date: "04 Dec 2026",
      seats: 8,
      mode: "Pool Campus",
      status: "SCHEDULED",
    },
    {
      id: "drv_3",
      company: "FinEdge Global",
      role: "DevOps & Cloud Specialist",
      ctc: "₹9.0 LPA",
      date: "12 Dec 2026",
      seats: 10,
      mode: "Virtual Drive",
      status: "SHORTLISTING",
    },
  ];

  const HEALTH_DIMENSIONS = [
    { name: "Academic & Curriculum Delivery", score: 88, color: "bg-emerald-500" },
    { name: "Placement & Industry Conversion", score: 78, color: "bg-teal-500" },
    { name: "Student Attendance & Completion", score: 84, color: "bg-emerald-500" },
    { name: "Faculty Coordination & FDP", score: 90, color: "bg-green-500" },
    { name: "Statutory & NAAC Compliance", score: 100, color: "bg-emerald-600" },
    { name: "Timely Settlement & Governance", score: 82, color: "bg-teal-500" },
  ];

  const LIFECYCLE_STAGES = [
    { key: "LEAD", label: "Lead", done: true },
    { key: "APP", label: "App", done: true },
    { key: "VERIFY", label: "KYC", done: true },
    { key: "MODEL", label: "Model A", done: true },
    { key: "MOU", label: "MoU", done: true },
    { key: "ACTIVE", label: "Activated", done: true },
    { key: "PROGRAMS", label: "Programs", done: true },
    { key: "ENROLL", label: "Enroll", done: true },
    { key: "TRAIN", label: "Training", done: true },
    { key: "PROJECTS", label: "Projects", done: true },
    { key: "PLACEMENT", label: "Placement", done: false, active: true },
    { key: "REVENUE", label: "Settlement", done: false },
    { key: "RENEWAL", label: "Renewal", done: false },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Executive Welcome Banner (Matches screenshot) ─── */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-card/90 p-6 shadow-soft backdrop-blur-md dark:border-emerald-500/20 dark:bg-slate-900/70">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                College / University Partner
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                ACTIVE
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                Premium
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl dark:text-white">
              Welcome back, Dr. Anitha Raghavan
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm dark:text-slate-400">
              Deccan Institute of Science & Technology · <span className="font-mono font-medium text-foreground dark:text-slate-300">JOB-COL-0001</span> · Hyderabad, Telangana
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted dark:border-white/10 dark:bg-slate-950 dark:text-white cursor-pointer"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin text-emerald-600")} />
              Sync Real-time
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("placements")}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
            >
              <Target className="h-3.5 w-3.5" /> View Placement Drives
            </button>
          </div>
        </div>
      </section>

      {/* ─── Dual MoU Expiry Alert Banners (Directly from user's screenshot) ─── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-900 transition hover:bg-amber-500/15 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-bold">MoU expiry — 90-day window</span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                MoU expires in 55 days — start renewal planning with the jobson.id higher education desk.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("company-info")}
            className="rounded-lg bg-amber-600/15 px-2.5 py-1 text-[11px] font-semibold text-amber-800 transition hover:bg-amber-600/25 dark:text-amber-200 cursor-pointer"
          >
            Review MoU →
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-xs text-orange-900 transition hover:bg-orange-500/15 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
            <div>
              <span className="font-bold">MoU expiry — 60-day window</span>
              <p className="text-[11px] text-orange-800 dark:text-orange-300">
                MoU expires in 55 days — commercial revision and batch quota renewal due.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("company-info")}
            className="rounded-lg bg-orange-600/15 px-2.5 py-1 text-[11px] font-semibold text-orange-800 transition hover:bg-orange-600/25 dark:text-orange-200 cursor-pointer"
          >
            Extend MoU →
          </button>
        </div>
      </div>

      {/* ─── 10 Stat KPI Cards Grid (Matches screenshot 1:1) ─── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onClick={() => onNavigate?.(stat.target)}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/80 p-4 shadow-soft transition-all hover:border-emerald-500/40 hover:bg-card hover:shadow-md cursor-pointer dark:border-white/10 dark:bg-slate-900/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground dark:text-slate-400">
                    {stat.title}
                  </span>
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl border", stat.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-foreground dark:text-white">
                  {stat.value}
                </div>
              </div>
              <p className="mt-2 text-[11px] font-medium text-muted-foreground dark:text-slate-400">
                {stat.sub}
              </p>
            </div>
          );
        })}
      </section>

      {/* ─── Operational Split: Active Batches & Upcoming Campus Drives ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Batches */}
        <section className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground dark:text-white">Active Skilling Batches</h2>
              <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                3 cohorts currently training on campus labs
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("programs")}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 cursor-pointer"
            >
              View all programs →
            </button>
          </div>

          <div className="space-y-3.5">
            {ACTIVE_BATCHES.map((b, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground dark:text-white">{b.batch}</span>
                  <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {b.enrolled} / {b.seats} Seats
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground dark:text-slate-400">
                  {b.program} • {b.mode} • Trainer: {b.trainer}
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted dark:bg-white/10">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${b.progress}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{b.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Placement Drives */}
        <section className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground dark:text-white">Upcoming Campus Placement Drives</h2>
              <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                Scheduled recruiter drives for registered students
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("placements")}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 cursor-pointer"
            >
              All drives →
            </button>
          </div>

          <div className="space-y-3.5">
            {UPCOMING_DRIVES.map((d) => (
              <div key={d.id} className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/20 p-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground dark:text-white">
                      {d.company} — <span className="text-muted-foreground font-normal">{d.role}</span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                      {d.date} • {d.seats} Sanctioned Seats • {d.mode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {d.ctc}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── Health Breakdown & Lifecycle Tracker ─── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Health Breakdown */}
        <div className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground dark:text-white">Partnership Health Score</h2>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              82 / 100
            </span>
          </div>

          <div className="space-y-3">
            {HEALTH_DIMENSIONS.map((h, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground dark:text-slate-300">{h.name}</span>
                  <span className="font-mono font-semibold text-foreground dark:text-white">{h.score}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/10">
                  <div className={cn("h-full rounded-full", h.color)} style={{ width: `${h.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 17-Stage Lifecycle Tracker */}
        <div className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground dark:text-white">Higher-Ed Partnership Lifecycle</h2>
              <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                Current stage: <strong className="text-emerald-600 dark:text-emerald-400">Stage 11 — Placement Drives & Offers</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("company-info")}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 cursor-pointer"
            >
              MoU Lifecycle →
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {LIFECYCLE_STAGES.map((s, idx) => (
              <div
                key={s.key}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs transition",
                  s.active
                    ? "border-emerald-500 bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30"
                    : s.done
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-muted/30 text-muted-foreground opacity-50 dark:border-white/5"
                )}
              >
                {s.done ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                ) : s.active ? (
                  <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-600 text-[8px] font-bold text-white">
                    {idx + 1}
                  </span>
                ) : (
                  <span className="text-[10px]">{idx + 1}</span>
                )}
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-muted-foreground dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong className="text-foreground dark:text-white">Active Operational Phase:</strong> Deccan Institute is currently co-delivering 3 programs with jobson.id. Pre-placement training is 100% complete for Batch A, and live interview scheduling is underway with 4 hiring partners.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
