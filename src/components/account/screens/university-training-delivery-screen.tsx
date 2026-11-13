"use client";

import { useState } from "react";
import {
  Presentation, Laptop, Clock, CheckCircle2, CalendarDays,
  Sparkles, Award, MapPin, Users, Download
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityTrainingDeliveryProps {
  onNavigate?: (tab: string) => void;
}

export function UniversityTrainingDeliveryScreen({ onNavigate }: UniversityTrainingDeliveryProps) {
  const LAB_FACILITIES = [
    {
      id: "LAB-1",
      name: "Advanced Software Engineering & Full-Stack Lab",
      building: "Dr. APJ Abdul Kalam Block — Lab 301",
      workstations: "80 HP Enterprise Core i7, 32GB RAM Workstations",
      os: "Ubuntu 24.04 LTS & macOS Studio Sandbox",
      network: "1 Gbps Dedicated Leased Line, Local Docker Swarm",
      timing: "08:30 AM – 05:30 PM (Mon–Fri)",
      activeBatch: "Batch A (Full-Stack Web & AI)",
    },
    {
      id: "LAB-2",
      name: "High-Performance AI & Data Science GPU Centre",
      building: "Sir CV Raman Innovation Hub — Lab 102",
      workstations: "30 Specialized Workstations with NVIDIA RTX A5000 GPUs",
      os: "Ubuntu Linux with CUDA & PyTorch Pre-configured",
      network: "Local High-Speed InfiniBand Switch, Cloud VPC Connect",
      timing: "09:00 AM – 06:00 PM (Mon–Sat)",
      activeBatch: "Batch B (Data Science & Applied AI)",
    },
    {
      id: "LAB-3",
      name: "Cloud Architecture & Network Simulation Lab",
      building: "Aryabhata Computer Centre — Lab 204",
      workstations: "60 Dell OptiPlex Workstations with Dual Monitors",
      os: "Dual-boot Windows 11 Pro / Red Hat Enterprise Linux",
      network: "AWS & Google Cloud Isolated Virtual Sandboxes",
      timing: "08:30 AM – 05:00 PM (Mon–Fri)",
      activeBatch: "Batch C (Cloud Architecture & DevOps)",
    },
  ];

  const MILESTONES = [
    {
      batch: "Batch A — Full-Stack Web & AI",
      milestone: "Capstone Sprint 4 Submission",
      dueDate: "25 Nov 2026",
      status: "COMPLETED",
      pct: 100,
    },
    {
      batch: "Batch B — Data Science & GenAI",
      milestone: "Mid-Term Evaluation: Transformers & RAG",
      dueDate: "02 Dec 2026",
      status: "SCHEDULED",
      pct: 76,
    },
    {
      batch: "Batch C — Cloud & DevOps",
      milestone: "Kubernetes Production Cluster Demo",
      dueDate: "08 Dec 2026",
      status: "IN_PROGRESS",
      pct: 80,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Presentation className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Campus Lab Infrastructure & Cohort Delivery
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  3 ACTIVE LABS • 170 SEATS
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Official computer labs registered on campus for jobson.id hands-on skilling, project sprints, and online examinations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.success("Lab Inspection Schedule", { description: "Download lab readiness checklist & audit report." })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted dark:border-white/10 dark:bg-slate-950 dark:text-white cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Lab Inspection PDF
          </button>
        </div>
      </section>

      {/* ─── Lab Infrastructure Cards ─── */}
      <section className="space-y-4">
        {LAB_FACILITIES.map((lab) => (
          <div
            key={lab.id}
            className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {lab.id}
                  </span>
                  <h3 className="text-sm font-bold text-foreground dark:text-white">
                    {lab.name}
                  </h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                  <MapPin className="inline h-3.5 w-3.5 text-emerald-600 mr-1" />
                  {lab.building}
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                Active: {lab.activeBatch}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl border border-border/60 bg-muted/20 p-3.5 text-xs sm:grid-cols-3 dark:border-white/5 dark:bg-slate-950/40">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground">Workstations:</span>
                <p className="font-medium text-foreground dark:text-slate-300">{lab.workstations}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground">Software & OS:</span>
                <p className="font-medium text-foreground dark:text-slate-300">{lab.os}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground">Network & Cloud:</span>
                <p className="font-medium text-foreground dark:text-slate-300">{lab.network}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Cohort Milestones ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft dark:border-white/10 dark:bg-slate-900/60">
        <h3 className="text-sm font-bold text-foreground dark:text-white mb-4">
          Training Delivery Milestones & Evaluation Calendar
        </h3>
        <div className="space-y-3">
          {MILESTONES.map((m, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
              <div>
                <span className="text-xs font-bold text-foreground dark:text-white">{m.batch}</span>
                <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                  Milestone: {m.milestone} • Scheduled: <strong className="text-foreground dark:text-slate-200">{m.dueDate}</strong>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  m.status === "COMPLETED"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                )}>
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("programs")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Skilling Programs
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("placements")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Placement Drives →
        </button>
      </div>
    </div>
  );
}
