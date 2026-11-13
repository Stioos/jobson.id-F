"use client";

import { useState } from "react";
import {
  BookOpen, Plus, CheckCircle2, Clock, Users, Award, Download,
  ExternalLink, Search, Sparkles, Filter, Laptop
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UniversityProgramsProps {
  onNavigate?: (tab: string) => void;
}

export function UniversityProgramsScreen({ onNavigate }: UniversityProgramsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const PROGRAMS = [
    {
      id: "PRG-FDE",
      name: "Full-Stack Web & AI Engineering",
      dept: "Computer Science & Engineering",
      duration: "12 Weeks (360 Hours)",
      semester: "Sem VI / VII Integrated",
      deliveryMode: "Hybrid (Campus Labs + LMS)",
      seats: 60,
      enrolled: 42,
      certified: 3,
      status: "ACTIVE",
      trainer: "Rahul Verma (Master Trainer)",
      techStack: ["React 19", "Node.js", "PostgreSQL", "Next.js", "Docker", "REST & GraphQL"],
      syllabus: [
        "Phase 1: Modern JavaScript, TypeScript & Component Architecture",
        "Phase 2: Full-Stack Backend, ORMs, Authentication & PostgreSQL",
        "Phase 3: Production DevOps, Docker, Microservices & CI/CD Pipelines",
        "Phase 4: Capstone Industry Project & Live Client Deployment",
      ],
      partnerShare: "70% College / 30% jobson.id",
    },
    {
      id: "PRG-DSAI",
      name: "Data Science, Machine Learning & Applied GenAI",
      dept: "Artificial Intelligence & Data Science",
      duration: "16 Weeks (480 Hours)",
      semester: "Sem V / VI Integrated",
      deliveryMode: "On-Campus GPU Lab",
      seats: 50,
      enrolled: 38,
      certified: 0,
      status: "ACTIVE",
      trainer: "Dr. Radhika Sharma (jobson.id Lead)",
      techStack: ["Python", "PyTorch", "Pandas", "Scikit-Learn", "LangChain", "RAG & Vector DBs"],
      syllabus: [
        "Phase 1: Exploratory Data Analysis, Statistics & Scientific Python",
        "Phase 2: Supervised & Unsupervised Machine Learning Models",
        "Phase 3: Deep Learning, CNNs, Transformers & Hugging Face",
        "Phase 4: Generative AI, RAG Pipelines & Enterprise Multi-Agent Systems",
      ],
      partnerShare: "70% College / 30% jobson.id",
    },
    {
      id: "PRG-CLD",
      name: "Cloud Architecture, DevOps & Site Reliability",
      dept: "Electronics & Communication Engineering",
      duration: "10 Weeks (300 Hours)",
      semester: "Sem VII Integrated",
      deliveryMode: "Hybrid",
      seats: 50,
      enrolled: 40,
      certified: 0,
      status: "ACTIVE",
      trainer: "Arun Swaminathan (AWS Certified Lead)",
      techStack: ["AWS", "Terraform", "Kubernetes", "Linux", "Prometheus", "GitHub Actions"],
      syllabus: [
        "Phase 1: Linux System Administration & Cloud Fundamentals",
        "Phase 2: Containerization with Docker & Kubernetes Orchestration",
        "Phase 3: Infrastructure as Code with Terraform & AWS Core Services",
        "Phase 4: Automated CI/CD, Observability & Cloud Security Audits",
      ],
      partnerShare: "70% College / 30% jobson.id",
    },
    {
      id: "PRG-CYB",
      name: "Cybersecurity, Network Defense & SOC Operations",
      dept: "Computer Science & Engineering",
      duration: "12 Weeks (360 Hours)",
      semester: "Sem VIII Capstone",
      deliveryMode: "Virtual Sandboxes",
      seats: 40,
      enrolled: 0,
      certified: 0,
      status: "UPCOMING",
      trainer: "Vikram Malhotra",
      techStack: ["Wireshark", "Burp Suite", "Splunk", "Metasploit", "Kali Linux", "OWASP Top 10"],
      syllabus: [
        "Phase 1: Network Protocols, Vulnerability Assessment & Pen-testing",
        "Phase 2: Web Application Security & OWASP Top 10 Remediation",
        "Phase 3: Security Operations Center (SOC) Log Analysis & SIEM",
        "Phase 4: Cloud Security, Incident Response & Digital Forensics",
      ],
      partnerShare: "70% College / 30% jobson.id",
    },
  ];

  const filteredPrograms = PROGRAMS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || p.dept.includes(selectedDept);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-foreground dark:text-white">
                  University Skilling Programs & Curricula
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  4 CURRICULA MAPPED
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                Industry-aligned technical syllabi co-delivered on Deccan Institute campuses, mapped to department semesters.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Map New Program", { description: "Submit academic department mapping request." })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Map Department Program
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-border sm:flex-row sm:items-center dark:border-white/10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search programs, technologies, or departments…"
              className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-9 rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">CSE</option>
              <option value="Artificial Intelligence">AI & Data Science</option>
              <option value="Electronics">ECE</option>
            </select>
          </div>
        </div>
      </section>

      {/* ─── Program Cards ─── */}
      <section className="space-y-4">
        {filteredPrograms.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft transition hover:border-emerald-500/30 dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-mono font-bold text-muted-foreground dark:bg-white/10 dark:text-slate-300">
                    {p.id}
                  </span>
                  <h3 className="text-sm font-bold text-foreground dark:text-white">
                    {p.name}
                  </h3>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    p.status === "ACTIVE"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                  )}>
                    {p.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                  {p.dept} • {p.duration} • <span className="font-semibold text-foreground dark:text-slate-300">{p.semester}</span> • Mode: {p.deliveryMode}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Enrolled</span>
                  <p className="font-bold text-foreground dark:text-white">{p.enrolled} / {p.seats}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Certified</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{p.certified}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground">Lead Trainer</span>
                  <p className="font-bold text-foreground dark:text-white">{p.trainer.split(" ")[0]}</p>
                </div>
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground mr-1">Stack:</span>
              {p.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground dark:border-white/5 dark:bg-slate-950/60 dark:text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Syllabus Accordion / Preview */}
            <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-3.5 dark:border-white/5 dark:bg-slate-950/40">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Four-Phase Syllabus Structure:
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {p.syllabus.map((syl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground dark:text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{syl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border pt-3 text-xs dark:border-white/5">
              <span className="text-muted-foreground">
                Commercial Split: <strong className="text-foreground dark:text-white">{p.partnerShare}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.success("Syllabus Downloaded", { description: `${p.name} syllabus PDF saved.` })}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted dark:border-white/10 dark:text-slate-300 cursor-pointer"
                >
                  <Download className="h-3 w-3" /> Download Syllabus
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.("students")}
                  className="rounded-lg bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-600/20 dark:text-emerald-400 cursor-pointer"
                >
                  View Enrolled Students →
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onNavigate?.("home")}
          className="text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
        >
          ← Executive Cockpit
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("students")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
        >
          Proceed to Student Directory →
        </button>
      </div>
    </div>
  );
}
