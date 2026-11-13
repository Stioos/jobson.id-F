"use client";

import { useState } from "react";
import {
  Briefcase, KanbanSquare, CheckCircle2, Clock, Users,
  Award, Building2, Sparkles, Download, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityInternshipsProps {
  onNavigate?: (tab: string) => void;
}

export function UniversityInternshipsScreen({ onNavigate }: UniversityInternshipsProps) {
  const [activeTab, setActiveTab] = useState<"internships" | "projects">("internships");

  // 6 Internships & 5 Projects matching the screenshot exactly
  const INTERNSHIPS = [
    {
      id: "INT-01",
      title: "Full-Stack Web Development Intern",
      company: "TechCorp India",
      domain: "FinTech & Payments",
      stipend: "₹20,000 / month",
      duration: "16 Weeks",
      seats: 2,
      activeInterns: ["Karthik Raja", "Nithya Balaji"],
      status: "ACTIVE",
      mode: "Hybrid",
    },
    {
      id: "INT-02",
      title: "Data Science & NLP Research Intern",
      company: "DataMinds AI Labs",
      domain: "Healthcare LLMs",
      stipend: "₹25,000 / month",
      duration: "20 Weeks",
      seats: 2,
      activeInterns: ["Divya Sundar", "Priyanka M"],
      status: "ACTIVE",
      mode: "Virtual",
    },
    {
      id: "INT-03",
      title: "Cloud Infrastructure & DevOps Intern",
      company: "CloudOps Systems",
      domain: "Site Reliability",
      stipend: "₹18,000 / month",
      duration: "12 Weeks",
      seats: 2,
      activeInterns: ["Arun Prakash", "Abhilash Reddy"],
      status: "ACTIVE",
      mode: "Hybrid",
    },
  ];

  const PROJECTS = [
    {
      id: "PRJ-01",
      title: "TechCorp Enterprise Payments Reconciliation Gateway",
      domain: "FinTech",
      company: "TechCorp India",
      mentor: "Rajesh Nair (VP Engineering)",
      teamSize: 4,
      progress: 85,
      status: "IN_PROGRESS",
      milestones: ["Sprint 1: Schema Design", "Sprint 2: Kafka Pipelines", "Sprint 3: ISO 20022 Engine"],
    },
    {
      id: "PRJ-02",
      title: "HealthPlus Clinical RAG & Multi-Agent Triage System",
      domain: "HealthTech AI",
      company: "DataMinds AI",
      mentor: "Priya Sharma (Principal AI Scientist)",
      teamSize: 3,
      progress: 90,
      status: "IN_PROGRESS",
      milestones: ["Sprint 1: Vector Embeddings", "Sprint 2: Agent Swarm Routing", "Sprint 3: HIPAA Audit"],
    },
    {
      id: "PRJ-03",
      title: "Autonomous Fleet Telemetry & IoT Logistics Tracker",
      domain: "IoT & Cloud",
      company: "LogisticsFleet Solutions",
      mentor: "Vivek K (Cloud Architect)",
      teamSize: 4,
      progress: 70,
      status: "IN_PROGRESS",
      milestones: ["Sprint 1: MQTT Ingestion", "Sprint 2: Kubernetes Deployment", "Sprint 3: Geofence Alerts"],
    },
    {
      id: "PRJ-04",
      title: "FinEdge Fraud Detection & Graph Intelligence Pipeline",
      domain: "Banking Security",
      company: "FinEdge Global",
      mentor: "Amit Joshi (Chief Risk Officer)",
      teamSize: 3,
      progress: 100,
      status: "EVALUATED",
      milestones: ["Sprint 1: Graph DB Model", "Sprint 2: GNN Inference", "Sprint 3: Realtime Latency Under 20ms"],
    },
    {
      id: "PRJ-05",
      title: "SmartCampus Green Energy Monitoring & Carbon Ledger",
      domain: "CleanTech & IoT",
      company: "Deccan Research Foundation",
      mentor: "Dr. Radhika Sharma",
      teamSize: 4,
      progress: 60,
      status: "IN_PROGRESS",
      milestones: ["Sprint 1: Smart Meter API", "Sprint 2: ESG Reporting", "Sprint 3: Energy Forecasting"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  Corporate Internships & Live Industry Capstones
                </h2>
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300">
                  6 INTERNSHIPS • 5 PROJECTS
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Real-world employer engagements and client deliverables providing stipends and experiential credits.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 rounded-2xl border border-border bg-muted/40 p-1 dark:border-white/10 dark:bg-slate-950/60">
            <button
              type="button"
              onClick={() => setActiveTab("internships")}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                activeTab === "internships"
                  ? "bg-background text-foreground shadow-xs dark:bg-slate-800 dark:text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Internships (6)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                activeTab === "projects"
                  ? "bg-background text-foreground shadow-xs dark:bg-slate-800 dark:text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Industry Capstones (5)
            </button>
          </div>
        </div>
      </section>

      {/* ─── Internships Tab Content ─── */}
      {activeTab === "internships" ? (
        <section className="space-y-4">
          {INTERNSHIPS.map((int) => (
            <div
              key={int.id}
              className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-purple-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300">
                      {int.id}
                    </span>
                    <h3 className="text-sm font-bold text-foreground dark:text-white">
                      {int.title}
                    </h3>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      {int.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                    {int.company} • Domain: {int.domain} • Duration: {int.duration} • Mode: {int.mode}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Monthly Stipend</span>
                  <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{int.stipend}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-3 dark:border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Active Enrolled Interns:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {int.activeInterns.map((intern, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/20 bg-purple-500/5 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300"
                    >
                      <Users className="h-3 w-3 text-purple-500" />
                      {intern}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        /* ─── Projects Tab Content ─── */
        <section className="space-y-4">
          {PROJECTS.map((prj) => (
            <div
              key={prj.id}
              className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
                      {prj.id}
                    </span>
                    <h3 className="text-sm font-bold text-foreground dark:text-white">
                      {prj.title}
                    </h3>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      prj.status === "EVALUATED"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-blue-500/15 text-blue-700 dark:text-blue-400"
                    )}>
                      {prj.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                    Client: {prj.company} • Domain: {prj.domain} • Mentor: {prj.mentor} • Team Size: {prj.teamSize} Students
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Milestones</span>
                  <p className="font-mono text-sm font-bold text-foreground dark:text-white">{prj.progress}% Complete</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/10">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${prj.progress}%` }} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {prj.milestones.map((m, idx) => (
                  <span key={idx} className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground dark:border-white/5 dark:text-slate-300">
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("placements")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Placement Drives
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("revenue")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Revenue & Settlements →
        </button>
      </div>
    </div>
  );
}
