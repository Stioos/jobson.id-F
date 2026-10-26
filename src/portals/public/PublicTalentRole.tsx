"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card } from "@/components/common";
import { StatCard } from "@/components/common";
import { EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  ArrowRight, ArrowLeft, ChevronRight, Sparkles, Briefcase, Target,
  GraduationCap, UserCheck, Award, ClipboardCheck, Search, Layers, Globe,
  Users, ShieldCheck, BrainCircuit, Clock, Wallet, TrendingUp,
  CheckCircle2, FileSignature, Rocket, Headset, HeartHandshake, Factory,
  Stethoscope, Banknote, ShoppingBag, Cpu, Truck, Home,
  Building2, LineChart, Cog, Server, Code2, Database, Cloud, BarChart3,
  UserPlus, FileCheck2, ClipboardList, MapPin, Calendar, Gauge, Zap,
  Lightbulb, Microscope, Network, RefreshCw, Quote, BookOpen, GitBranch,
  Handshake, Wrench, Boxes, PenTool, Megaphone, Workflow,
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

interface KeyFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}
interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}
interface Benefit {
  icon: LucideIcon;
  title: string;
  desc: string;
}
interface UseCase {
  scenario: string;
  solution: string;
  metrics: { label: string; value: string }[];
}
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}
interface SiblingRole {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}
interface RoleConfig {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: LucideIcon;
  heroStats: { label: string; value: string }[];
  keyFeatures: KeyFeature[];
  processSteps: ProcessStep[];
  benefits: Benefit[];
  useCases: UseCase[];
  industries: string[];
  stats: { label: string; value: string; icon: LucideIcon }[];
  testimonials: Testimonial[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
  siblingRoles: SiblingRole[];
}

const ICON_COMMON: Record<string, LucideIcon> = {
  GraduationCap, UserCheck, Award, ClipboardCheck, Search, Layers, Globe,
  Users, ShieldCheck, BrainCircuit, Clock, Wallet, TrendingUp, Target,
  Rocket, FileSignature, Headset, HeartHandshake, Factory, Stethoscope,
  Banknote, ShoppingBag, Cpu, Truck, Home, Building2, LineChart, Cog,
  Server, Code2, Database, Cloud, BarChart3, UserPlus, FileCheck2,
  ClipboardList, MapPin, Calendar, Gauge, Zap, Lightbulb, Microscope,
  Network, RefreshCw, BookOpen, GitBranch, Handshake, Wrench, Boxes,
  PenTool, Megaphone, Workflow, Briefcase, ArrowRight, ArrowLeft,
  ChevronRight, Sparkles, CheckCircle2, Quote,
};

const TALENT_ROLES: Record<string, RoleConfig> = {
  "talent-train-to-hire": {
    title: "Train to Hire",
    subtitle: "Train fresh talent, then deploy",
    description: "We recruit high-potential fresh graduates, run them through an industry-aligned training program tailored to your stack, and deploy production-ready engineers to your team in 12–16 weeks.",
    color: "#0EA5E9",
    icon: GraduationCap,
    heroStats: [
      { label: "Avg batch size", value: "30–60" },
      { label: "Time-to-deploy", value: "12–16 wk" },
      { label: "1-year retention", value: "96%" },
    ],
    keyFeatures: [
      { icon: Target, title: "Custom curriculum", desc: "Training aligned to your tech stack, domain, and engineering standards — not generic courses." },
      { icon: Code2, title: "Project-based learning", desc: "Candidates ship 4–6 production-grade projects mirroring your team's actual work." },
      { icon: ShieldCheck, title: "Pre-vetted cohort", desc: "Aptitude, logical reasoning, and communication screening before enrollment." },
      { icon: UserCheck, title: "Dedicated mentors", desc: "Senior engineers (8+ yrs) mentor each cohort with weekly 1:1 reviews." },
      { icon: FileCheck2, title: "Role-readiness certification", desc: "Final assessment gated by your hiring managers — no automatic pass." },
      { icon: HeartHandshake, title: "90-day replacement", desc: "Free replacement within 90 days of deployment if performance is below bar." },
    ],
    processSteps: [
      { step: "01", title: "Requirement workshop", desc: "We sit with your hiring managers to map role specs, must-have skills, and project archetypes." },
      { step: "02", title: "Cohort sourcing", desc: "We recruit fresh graduates from 200+ partner colleges and our 2M+ candidate pool." },
      { step: "03", title: "Screening & selection", desc: "Aptitude, coding fundamentals, and behavioral screens — top 15% selected." },
      { step: "04", title: "Custom training program", desc: "12–16 week intensive curriculum with weekly milestones and project demos." },
      { step: "05", title: "Final assessment", desc: "Your team evaluates capstone projects and conducts fit interviews." },
      { step: "06", title: "Deployment & onboarding", desc: "Selected candidates join your team with structured 30/60/90-day onboarding." },
    ],
    benefits: [
      { icon: Wallet, title: "Lower cost-per-hire", desc: "Up to 45% reduction vs lateral hiring, with no recruiter commissions or premium salaries." },
      { icon: ShieldCheck, title: "Culture-fit candidates", desc: "Cohort trained on your values and engineering norms from day one of training." },
      { icon: Clock, title: "Predictable pipeline", desc: "Quarterly batch calendar — plan hiring 3–6 months ahead with confidence." },
      { icon: BrainCircuit, title: "Stack-aligned skills", desc: "No re-skilling gap — candidates ship code in your exact stack from week one." },
      { icon: HeartHandshake, title: "Higher retention", desc: "Trained-from-scratch engineers stay 2.3× longer than lateral hires at 18 months." },
      { icon: Gauge, title: "Scalable model", desc: "From 10 to 200+ engineers per year without ballooning recruiting team headcount." },
    ],
    useCases: [
      {
        scenario: "Payments fintech launching a new platform needed 80 backend engineers in 6 months.",
        solution: "Train-to-Hire cohort of 120 graduates trained in Java, Kafka, payments domain, and observability.",
        metrics: [
          { label: "Hires delivered", value: "84" },
          { label: "Time-to-hire", value: "−58%" },
          { label: "1-yr retention", value: "96%" },
        ],
      },
      {
        scenario: "Enterprise SaaS scaling engineering from 200 to 500 in 18 months without inflating recruiter costs.",
        solution: "Two Train-to-Hire cohorts per year — 60 frontend + 60 fullstack engineers — trained in React/Node.",
        metrics: [
          { label: "Cost-per-hire", value: "−42%" },
          { label: "Recruiter headcount", value: "+0" },
          { label: "Ramp time", value: "−30%" },
        ],
      },
      {
        scenario: "BFSI captive needed mainframe and core-banking skills that fresh graduates typically lack.",
        solution: "Custom 16-week program covering Cobol, DB2, and core-banking domain with bank SMEs as guest faculty.",
        metrics: [
          { label: "Cohort size", value: "40" },
          { label: "Deployment rate", value: "88%" },
          { label: "Productivity parity", value: "5 mo" },
        ],
      },
    ],
    industries: ["IT & SaaS", "Fintech", "BFSI", "Healthcare Tech", "EdTech", "E-commerce"],
    stats: [
      { label: "Cohorts delivered", value: "120+", icon: Rocket },
      { label: "Engineers deployed", value: "3,400+", icon: Users },
      { label: "Avg time-to-deploy", value: "14 wk", icon: Clock },
      { label: "1-year retention", value: "96%", icon: HeartHandshake },
    ],
    testimonials: [
      {
        quote: "JOBSONN's train-to-hire cohort delivered 84 production-ready engineers in 5 months — exactly the domain depth we needed for our payments launch.",
        name: "Rajesh Kumar",
        role: "VP Engineering",
        company: "FinEdge",
        initials: "RK",
      },
      {
        quote: "We scaled engineering from 200 to 480 in 18 months without adding a single recruiter — Train-to-Hire became our primary pipeline.",
        name: "Sneha Iyer",
        role: "Head of Talent",
        company: "CloudPeak SaaS",
        initials: "SI",
      },
      {
        quote: "The cohort came in knowing our exact stack — React, TypeScript, Kafka — and shipped to production in week two. No re-skilling gap at all.",
        name: "Arjun Mehta",
        role: "Engineering Manager",
        company: "Zerodha",
        initials: "AM",
      },
    ],
    deliverables: [
      "Custom 12–16 week training curriculum aligned to your tech stack",
      "Cohort of 30–60 pre-screened, role-ready engineers",
      "Weekly progress reports with capstone project demos",
      "Final assessment scorecard signed off by your hiring managers",
      "Structured 30/60/90-day onboarding plan and 90-day replacement guarantee",
    ],
    faqs: [
      { q: "What is the minimum cohort size?", a: "Minimum 10 candidates per cohort. Typical cohorts are 30–60; we've run single batches up to 120 for high-volume engagements." },
      { q: "Who owns the training curriculum?", a: "We co-design it with your engineering and talent teams. You approve the syllabus, project list, and assessment bar before the cohort starts." },
      { q: "What if a candidate doesn't pass final assessment?", a: "They are not deployed to your team. We redeploy successful candidates within the cohort and offer a free replacement batch slot for gaps." },
      { q: "Can we host training at our office?", a: "Yes — trainings can be hosted at your office, at our partner campuses, or online. Hybrid is the most common choice for enterprise clients." },
    ],
    siblingRoles: [
      { key: "talent-hire-to-train", label: "Hire to Train", icon: UserCheck, color: "#8B5CF6", desc: "Hire candidates first, then we upskill them to your stack." },
      { key: "talent-corporate-training", label: "Corporate Training", icon: Award, color: "#F97316", desc: "Upskill your existing workforce at scale." },
      { key: "talent-assessment", label: "Talent Assessment", icon: ClipboardCheck, color: "#EF4444", desc: "AI-powered skill and aptitude assessments." },
      { key: "talent-end-to-end-workforce", label: "End-to-End Workforce", icon: Globe, color: "#8B5CF6", desc: "Full lifecycle workforce management." },
    ],
  },

  "talent-hire-to-train": {
    title: "Hire to Train",
    subtitle: "Hire first, then we upskill",
    description: "You hire promising candidates directly (or we source them), then we run a focused 4–8 week training program to bridge gaps and align them to your specific tech stack and engineering standards.",
    color: "#8B5CF6",
    icon: UserCheck,
    heroStats: [
      { label: "Training duration", value: "4–8 wk" },
      { label: "Avg skill uplift", value: "+38%" },
      { label: "Ramp-time reduction", value: "−45%" },
    ],
    keyFeatures: [
      { icon: Target, title: "Gap-focused curriculum", desc: "Training designed around the actual skill gaps identified during your interview process — not generic." },
      { icon: Code2, title: "Live project work", desc: "Trainees contribute to a sandboxed version of your codebase during training." },
      { icon: UserCheck, title: "Senior mentors", desc: "8+ year engineers mentor each batch with daily code reviews and 1:1s." },
      { icon: ShieldCheck, title: "Engineering standards", desc: "Code quality, testing, code review, and CI/CD practices baked into training." },
      { icon: FileCheck2, title: "Readiness assessment", desc: "Final evaluation by your hiring managers before trainees ramp up on production work." },
      { icon: Rocket, title: "Fast-track ramp", desc: "Trainees ship to production in week 1 of joining your team — no slow onboarding." },
    ],
    processSteps: [
      { step: "01", title: "Gap analysis", desc: "We review your hiring rubric and interview feedback to identify common skill gaps in new hires." },
      { step: "02", title: "Curriculum design", desc: "4–8 week program covering technical, domain, and engineering practice gaps." },
      { step: "03", title: "Candidate sourcing", desc: "Optionally, we source candidates through our pool — or you bring your own hires to train." },
      { step: "04", title: "Intensive training", desc: "Daily sessions, code reviews, and project work simulating your team's actual environment." },
      { step: "05", title: "Readiness assessment", desc: "Your hiring managers evaluate capstone work and sign off on production readiness." },
      { step: "06", title: "Team integration", desc: "Trainees join your team with a structured 30-day ramp plan and shared scorecard." },
    ],
    benefits: [
      { icon: Clock, title: "Faster ramp time", desc: "New hires ship to production in week 1, not month 3 — 45% faster ramp." },
      { icon: Wallet, title: "Lower salary bar", desc: "Hire for potential, not premium skills — train to your exact stack at a fraction of the cost." },
      { icon: BrainCircuit, title: "Standardized practices", desc: "Every new hire learns your code review, testing, and CI/CD practices the same way." },
      { icon: HeartHandshake, title: "Higher early retention", desc: "Structured training reduces 90-day attrition by up to 60% compared to sink-or-swim onboarding." },
      { icon: ShieldCheck, title: "Risk-free ramp", desc: "Candidates don't touch production until they pass your manager's readiness gate." },
      { icon: Gauge, title: "Scales with hiring", desc: "Run per-quarter batches aligned to your hiring plan — no fixed batch size constraints." },
    ],
    useCases: [
      {
        scenario: "Product company hiring 50 lateral engineers per quarter but seeing 3-month ramp times and inconsistent code quality.",
        solution: "4-week Hire-to-Train program covering internal frameworks, code review, testing, and CI/CD standards.",
        metrics: [
          { label: "Ramp time", value: "−45%" },
          { label: "Code quality", value: "+32%" },
          { label: "90-day attrition", value: "−60%" },
        ],
      },
      {
        scenario: "BFSI captive hiring fresh MBAs for technology roles needed domain and systems training.",
        solution: "8-week program covering core-banking systems, regulatory landscape, and internal tooling.",
        metrics: [
          { label: "Productivity parity", value: "8 wk" },
          { label: "Manager NPS", value: "+24 pts" },
          { label: "Cost vs lateral", value: "−38%" },
        ],
      },
      {
        scenario: "E-commerce company scaling its data team needed consistent SQL and warehouse practices across hires.",
        solution: "4-week data engineering bootcamp covering internal warehouse, dbt, and analytics engineering.",
        metrics: [
          { label: "Onboarding time", value: "−50%" },
          { label: "Pipeline errors", value: "−28%" },
          { label: "Hire satisfaction", value: "9.1/10" },
        ],
      },
    ],
    industries: ["IT & SaaS", "BFSI", "E-commerce", "Healthcare Tech", "Fintech", "EdTech"],
    stats: [
      { label: "Batches delivered", value: "240+", icon: Rocket },
      { label: "Trainees upskilled", value: "5,800+", icon: Users },
      { label: "Avg ramp-time reduction", value: "45%", icon: Clock },
      { label: "90-day attrition drop", value: "60%", icon: HeartHandshake },
    ],
    testimonials: [
      {
        quote: "Hire-to-Train cut our new-hire ramp time from 12 weeks to 6 — and code quality scores jumped 30% within the first month.",
        name: "Vikram Patel",
        role: "VP Engineering",
        company: "ShopKart",
        initials: "VP",
      },
      {
        quote: "We were hiring 50 engineers a quarter with terrible consistency. Hire-to-Train standardized the baseline. Now every new hire ships in week one.",
        name: "Anjali Reddy",
        role: "Head of Talent",
        company: "CloudPeak SaaS",
        initials: "AR",
      },
      {
        quote: "The training was tailored to our internal frameworks — not a generic bootcamp. New hires knew our codebase on day one of joining the team.",
        name: "Rohan Desai",
        role: "Engineering Director",
        company: "MediCare Tech",
        initials: "RD",
      },
    ],
    deliverables: [
      "Custom 4–8 week training curriculum aligned to your tech stack and gaps",
      "Daily training sessions with senior engineer mentors",
      "Capstone project simulating your team's actual work",
      "Readiness assessment scorecard signed off by your hiring managers",
      "30-day ramp plan with shared scorecard for tracking early performance",
    ],
    faqs: [
      { q: "Can we use our own hires for training?", a: "Absolutely. Many clients source candidates themselves and use our Hire-to-Train program as a structured onboarding ramp. We can also source candidates for you if needed." },
      { q: "How is this different from Train to Hire?", a: "In Train to Hire, we recruit the candidates AND train them before deployment. In Hire to Train, candidates are already hired (by you or us) — we focus only on the upskilling ramp." },
      { q: "Is training hosted at our office?", a: "Yes, training can be at your office, our partner campus, online, or hybrid. We recommend at least partial in-person for the first 2 weeks for engineering culture immersion." },
      { q: "What if a trainee fails the readiness assessment?", a: "We provide extended coaching (1–2 weeks) for borderline cases. If a trainee still doesn't meet the bar, we provide a remediation plan or recommend reassignment — at your discretion." },
    ],
    siblingRoles: [
      { key: "talent-train-to-hire", label: "Train to Hire", icon: GraduationCap, color: "#0EA5E9", desc: "We recruit and train fresh talent before deployment." },
      { key: "talent-corporate-training", label: "Corporate Training", icon: Award, color: "#F97316", desc: "Upskill your existing workforce at scale." },
      { key: "talent-flexible-deployment", label: "Flexible Deployment", icon: Layers, color: "#10B981", desc: "On-demand contract and project talent." },
      { key: "talent-end-to-end-workforce", label: "End-to-End Workforce", icon: Globe, color: "#8B5CF6", desc: "Full lifecycle workforce management." },
    ],
  },

  "talent-staffing": {
    title: "Staffing Solutions",
    subtitle: "Flexible staffing at any scale",
    description: "Contract, permanent, temp-to-perm, or project-based staffing — pick the engagement model that fits your hiring plan. Scale up or down in days, not months.",
    color: "#10B981",
    icon: Users,
    heroStats: [
      { label: "Talent pool", value: "2M+" },
      { label: "Avg time-to-deploy", value: "7 days" },
      { label: "Compliance coverage", value: "100%" },
    ],
    keyFeatures: [
      { icon: Layers, title: "Multiple engagement types", desc: "Contract, permanent, temp-to-perm, project-based, and on-demand — all under one master agreement." },
      { icon: ShieldCheck, title: "Statutory compliance", desc: "PF, ESI, gratuity, labor law compliance handled end-to-end across all Indian states." },
      { icon: BrainCircuit, title: "AI-powered shortlisting", desc: "Transparent fit scoring across skills, experience, and salary alignment — no black boxes." },
      { icon: MapPin, title: "Pan-India coverage", desc: "Talent pools in 120+ cities with on-ground partner recruiters in tier-2 and tier-3 markets." },
      { icon: RefreshCw, title: "Fast replacements", desc: "5-business-day replacement SLA for contract roles, no additional sourcing fee." },
      { icon: Headset, title: "Dedicated account manager", desc: "Single point of contact for all roles, billing, compliance, and escalations." },
    ],
    processSteps: [
      { step: "01", title: "Mandate kickoff", desc: "We sign a master agreement covering all engagement types and compliance scope." },
      { step: "02", title: "Role intake", desc: "Per-role intake call to align on JD, budget, timeline, and must-have skills." },
      { step: "03", title: "Candidate sourcing", desc: "We tap our 2M+ candidate pool and partner network for fit-aligned shortlists." },
      { step: "04", title: "Screening & shortlist", desc: "Phone screen, skill test, and reference check before presenting candidates." },
      { step: "05", title: "Interview & offer", desc: "We coordinate interviews, handle offer extension, and manage acceptance." },
      { step: "06", title: "Onboarding & payroll", desc: "For contract roles, we handle onboarding, payroll, and statutory compliance end-to-end." },
    ],
    benefits: [
      { icon: Wallet, title: "Variable cost model", desc: "Pay only for roles filled — no fixed recruiting team overhead during slow quarters." },
      { icon: Clock, title: "Fast deployment", desc: "7-day average time-to-deploy for contract roles, 18 days for permanent." },
      { icon: ShieldCheck, title: "Compliance peace of mind", desc: "All statutory compliance — PF, ESI, gratuity, state labor laws — handled by our team." },
      { icon: Gauge, title: "Scales elastically", desc: "From 1 role to 1,500 — same master agreement, same account manager, same SLAs." },
      { icon: HeartHandshake, title: "Replacement guarantees", desc: "90-day replacement on permanent hires, 5-day SLA on contract roles — at no extra fee." },
      { icon: Network, title: "Pan-India network", desc: "120+ cities covered with on-ground recruiters in tier-2/3 markets for frontline volume." },
    ],
    useCases: [
      {
        scenario: "Retail chain needed 1,500+ frontline staff across 200 stores for seasonal demand spike.",
        solution: "Flexible staffing model with on-demand talent pool activated in 7 days, covering 200 stores in 12 states.",
        metrics: [
          { label: "Time to deploy", value: "7 days" },
          { label: "Stores covered", value: "200" },
          { label: "Attrition vs market", value: "−28%" },
        ],
      },
      {
        scenario: "Manufacturing company setting up a new plant needed 300+ skilled operators and technicians.",
        solution: "Permanent staffing mandate with 60-day deadline, including skill testing and reference checks.",
        metrics: [
          { label: "Roles filled", value: "312" },
          { label: "Time-to-hire", value: "52 days" },
          { label: "Cost-per-hire", value: "−32%" },
        ],
      },
      {
        scenario: "IT services company needed to scale project teams for a 9-month client engagement.",
        solution: "Contract staffing for 80 developers and QA engineers with flexible ramp-up and ramp-down.",
        metrics: [
          { label: "Avg deploy time", value: "9 days" },
          { label: "Project ramp-up", value: "3 wk" },
          { label: "Compliance gaps", value: "0" },
        ],
      },
    ],
    industries: ["Retail", "Manufacturing", "IT & SaaS", "Logistics", "Healthcare", "BFSI"],
    stats: [
      { label: "Roles filled / year", value: "9,400+", icon: Users },
      { label: "Avg time-to-deploy", value: "7 days", icon: Clock },
      { label: "Cities covered", value: "120+", icon: MapPin },
      { label: "Compliance SLA", value: "100%", icon: ShieldCheck },
    ],
    testimonials: [
      {
        quote: "Their flexible staffing model scaled our seasonal workforce from 200 to 1,700 in 7 days without a single compliance gap.",
        name: "Amitabh Sengupta",
        role: "Chief People Officer",
        company: "RetailMax",
        initials: "AS",
      },
      {
        quote: "We filled 312 plant roles in 52 days for a greenfield factory — JOBSONN's pan-India recruiter network made it possible.",
        name: "Lakshmi Venkat",
        role: "Plant HR Head",
        company: "Bharat Forge",
        initials: "LV",
      },
      {
        quote: "Single master agreement, multiple engagement types — contract, permanent, project. The admin simplicity is a huge win.",
        name: "Karan Malhotra",
        role: "Talent Operations Lead",
        company: "TechMahindra",
        initials: "KM",
      },
    ],
    deliverables: [
      "Master agreement covering contract, permanent, temp-to-perm, and project engagements",
      "Pre-vetted candidate shortlists within 5–7 business days of role intake",
      "Full statutory compliance — PF, ESI, gratuity, state labor laws — for contract roles",
      "Centralized billing and consolidated monthly invoices across all engagement types",
      "Dedicated account manager with 24×7 escalation channel and 5-day replacement SLA",
    ],
    faqs: [
      { q: "What engagement types do you support?", a: "Contract (full-time on our payroll), permanent (on your payroll), temp-to-perm (contract first, convert after 3–6 months), project-based (fixed scope), and on-demand (hourly/weekly)." },
      { q: "How is compliance handled for contract roles?", a: "We are the employer of record. We handle PF, ESI, gratuity, bonus, leave, and all state-specific labor law compliance. You receive a single monthly invoice per worker." },
      { q: "What is your replacement SLA?", a: "For contract roles: 5 business days, no additional sourcing fee. For permanent hires: 90-day replacement guarantee, free of charge. For project roles: 3 business days." },
      { q: "Can you handle bulk volume hiring?", a: "Yes — we've executed 1,500+ role mandates in 7 days for retail, 320+ clinical roles across 14 cities for healthcare, and 600+ tech contract roles for IT services clients." },
    ],
    siblingRoles: [
      { key: "talent-flexible-deployment", label: "Flexible Deployment", icon: Layers, color: "#10B981", desc: "On-demand contract and project talent pools." },
      { key: "talent-sourcing-recruitment", label: "Sourcing & Recruitment", icon: Search, color: "#0EA5E9", desc: "AI-powered talent sourcing from 2M+ candidates." },
      { key: "talent-assessment", label: "Talent Assessment", icon: ClipboardCheck, color: "#EF4444", desc: "AI-powered skill and aptitude assessments." },
      { key: "talent-end-to-end-workforce", label: "End-to-End Workforce", icon: Globe, color: "#8B5CF6", desc: "Full lifecycle workforce management." },
    ],
  },

  "talent-corporate-training": {
    title: "Corporate Training",
    subtitle: "Upskill your existing workforce",
    description: "Custom corporate training programs designed to upskill your existing workforce at scale — from technology bootcamps to leadership development, delivered onsite, online, or hybrid.",
    color: "#F97316",
    icon: Award,
    heroStats: [
      { label: "Employees trained / yr", value: "18,000+" },
      { label: "Avg trainer experience", value: "12+ yrs" },
      { label: "Learner satisfaction", value: "4.8/5" },
    ],
    keyFeatures: [
      { icon: Target, title: "Needs analysis", desc: "We assess your team's current skills, business goals, and gaps before designing a single session." },
      { icon: BookOpen, title: "Custom curriculum", desc: "Fully bespoke training content — no off-the-shelf slides. Your tools, your stack, your domain." },
      { icon: UserCheck, title: "Senior trainers", desc: "Trainers with 12+ years of industry experience — practitioners, not professional presenters." },
      { icon: Layers, title: "Multi-modal delivery", desc: "Onsite, online, hybrid, or self-paced LMS — pick the format that fits your team's calendar." },
      { icon: BarChart3, title: "Outcome tracking", desc: "Pre/post assessments, project work, and 30/60/90-day retention surveys for every cohort." },
      { icon: Cog, title: "LMS integration", desc: "Integrates with your LMS (Moodle, Cornerstone, Degreed) for single sign-on and credit tracking." },
    ],
    processSteps: [
      { step: "01", title: "Needs assessment", desc: "Workshop with L&D and business heads to map skill gaps, business outcomes, and learner personas." },
      { step: "02", title: "Curriculum design", desc: "Bespoke syllabus, project list, and assessment rubric co-designed with your SMEs." },
      { step: "03", title: "Pilot cohort", desc: "Run a small pilot (15–25 learners) to validate content, pacing, and trainer fit." },
      { step: "04", title: "Full rollout", desc: "Scale to all cohorts with weekly progress reports and bi-weekly business reviews." },
      { step: "05", title: "Outcome measurement", desc: "Post-training assessments, 30/60/90-day application surveys, and ROI scorecard." },
      { step: "06", title: "Continuous improvement", desc: "Quarterly curriculum refresh based on feedback, tech evolution, and business changes." },
    ],
    benefits: [
      { icon: Gauge, title: "Measurable ROI", desc: "Every program has pre/post assessments and business-outcome KPIs tied to your goals." },
      { icon: BrainCircuit, title: "Tech-current content", desc: "Curriculum refreshed quarterly — covers GenAI, modern data stack, cloud-native, and more." },
      { icon: Wallet, title: "Lower than external hiring", desc: "Upskilling existing employees costs 40–60% less than hiring lateral replacements." },
      { icon: HeartHandshake, title: "Higher retention", desc: "Employees who receive structured training are 3.2× more likely to stay 2+ years." },
      { icon: ShieldCheck, title: "Standardized skills", desc: "Bring the whole team to a consistent baseline — no more hero dependencies on key engineers." },
      { icon: Rocket, title: "Internal mobility", desc: "Build your leadership pipeline from within — proven promotable candidates, not external hires." },
    ],
    useCases: [
      {
        scenario: "IT services company needed to reskill 800 engineers from legacy stack to modern cloud-native in 9 months.",
        solution: "Multi-track corporate training program with role-based cohorts (developer, QA, DevOps) and capstone projects.",
        metrics: [
          { label: "Engineers reskilled", value: "812" },
          { label: "Billable rate uplift", value: "+22%" },
          { label: "Internal mobility", value: "+34%" },
        ],
      },
      {
        scenario: "Bank wanted to upskill 2,400 branch managers on digital banking and customer experience.",
        solution: "Hybrid program — 2-day onsite kickoff + 8-week online cohort with manager assessments.",
        metrics: [
          { label: "Managers trained", value: "2,400" },
          { label: "CSAT uplift", value: "+18 pts" },
          { label: "Digital adoption", value: "+47%" },
        ],
      },
      {
        scenario: "Manufacturing company needed to upskill plant supervisors on Industry 4.0 and IoT.",
        solution: "Onsite 5-day bootcamp per plant, covering IoT, predictive maintenance, and data-driven decision making.",
        metrics: [
          { label: "Supervisors trained", value: "320" },
          { label: "Downtime reduction", value: "−14%" },
          { label: "Defect rate", value: "−21%" },
        ],
      },
    ],
    industries: ["IT & SaaS", "BFSI", "Manufacturing", "Healthcare", "Retail", "E-commerce"],
    stats: [
      { label: "Employees trained", value: "18,000+", icon: Users },
      { label: "Programs delivered", value: "320+", icon: Rocket },
      { label: "Avg learner NPS", value: "72", icon: HeartHandshake },
      { label: "Trainer experience", value: "12+ yrs", icon: Award },
    ],
    testimonials: [
      {
        quote: "JOBSONN reskilled 812 engineers from legacy to cloud-native in 9 months — our billable rate uplift was 22% and we promoted 34% more internally.",
        name: "Suresh Krishnan",
        role: "Head of L&D",
        company: "Infosys",
        initials: "SK",
      },
      {
        quote: "The hybrid model worked perfectly for 2,400 branch managers. CSAT scores jumped 18 points and digital adoption rates soared.",
        name: "Deepa Subramanian",
        role: "VP, Retail Banking",
        company: "HDFC Bank",
        initials: "DS",
      },
      {
        quote: "Industry 4.0 bootcamp across 14 plants — downtime dropped 14%, defects fell 21%. Real ROI, not vanity training metrics.",
        name: "Ramesh Iyer",
        role: "Plant Director",
        company: "Bharat Forge",
        initials: "RI",
      },
    ],
    deliverables: [
      "Custom curriculum aligned to your business outcomes and learner personas",
      "Senior trainer-led delivery (12+ years industry experience) with co-trainer for large cohorts",
      "Pre/post assessments with individual and cohort-level scorecards",
      "LMS integration with SSO and credit tracking (Moodle, Cornerstone, Degreed supported)",
      "30/60/90-day application survey and ROI scorecard tied to business KPIs",
    ],
    faqs: [
      { q: "What's the minimum cohort size?", a: "Pilot cohorts start at 15 learners. Full rollouts typically run 25–50 per cohort for hands-on tech training, up to 200 for awareness programs." },
      { q: "Can you train at our office?", a: "Yes — onsite at your office or any location you choose, online, or hybrid. We bring our own equipment for hands-on labs." },
      { q: "Do you provide LMS content?", a: "Yes — we provide SCORM-compliant content packages for self-paced learning, integrated with your LMS for SSO and credit tracking." },
      { q: "How do you measure ROI?", a: "Pre/post assessments, 30/60/90-day application surveys, and business KPIs agreed upfront (e.g., billable rate, CSAT, defect rate). Every program ends with an ROI scorecard." },
    ],
    siblingRoles: [
      { key: "talent-train-to-hire", label: "Train to Hire", icon: GraduationCap, color: "#0EA5E9", desc: "Train fresh talent, then deploy to your team." },
      { key: "talent-hire-to-train", label: "Hire to Train", icon: UserCheck, color: "#8B5CF6", desc: "Hire candidates first, then we upskill them." },
      { key: "talent-assessment", label: "Talent Assessment", icon: ClipboardCheck, color: "#EF4444", desc: "AI-powered skill and aptitude assessments." },
      { key: "talent-flexible-deployment", label: "Flexible Deployment", icon: Layers, color: "#10B981", desc: "On-demand contract and project talent." },
    ],
  },

  "talent-assessment": {
    title: "Talent Assessment",
    subtitle: "Scientific, AI-powered evaluation",
    description: "AI-powered assessments to evaluate technical skills, aptitude, behavioral fit, and culture alignment — with transparent scoring and explainable recommendations, no black boxes.",
    color: "#EF4444",
    icon: ClipboardCheck,
    heroStats: [
      { label: "Assessments / year", value: "240K+" },
      { label: "Question bank", value: "12,000+" },
      { label: "Predictive validity", value: "0.78" },
    ],
    keyFeatures: [
      { icon: Code2, title: "Technical assessments", desc: "1,200+ coding problems, project-based tasks, and code-review simulations across 40+ stacks." },
      { icon: BrainCircuit, title: "Aptitude & reasoning", desc: "Quantitative, logical, verbal, and abstract reasoning with adaptive difficulty." },
      { icon: ClipboardList, title: "Behavioral assessment", desc: "Situational judgment tests and structured behavioral interviews with rubric scoring." },
      { icon: Microscope, title: "Anti-cheating proctoring", desc: "Browser lockdown, webcam monitoring, tab-switch detection, and plagiarism checks." },
      { icon: ShieldCheck, title: "Explainable AI scoring", desc: "Every score comes with a plain-English explanation — no opaque ranking algorithms." },
      { icon: BarChart3, title: "Benchmarking", desc: "Compare candidates against your existing team, industry benchmarks, or role-specific bars." },
    ],
    processSteps: [
      { step: "01", title: "Role spec mapping", desc: "We map the role's must-have skills, aptitude profile, and behavioral markers to assessment dimensions." },
      { step: "02", title: "Assessment design", desc: "Pick from our question bank or co-create custom problems with your hiring managers." },
      { step: "03", title: "Candidate invite", desc: "Send branded assessment invites via email or integrate with your ATS for one-click launch." },
      { step: "04", title: "Proctored assessment", desc: "Candidates complete the assessment with anti-cheating proctoring and adaptive difficulty." },
      { step: "05", title: "AI scoring & report", desc: "Explainable AI scores across technical, aptitude, and behavioral dimensions — with benchmarking." },
      { step: "06", title: "Shortlist & interview", desc: "Top candidates proceed to structured interviews with shared scorecards and AI-generated question prompts." },
    ],
    benefits: [
      { icon: Clock, title: "Saves 12+ hours/role", desc: "Hiring managers skip first-round screens — assessments pre-filter to top 10% of applicants." },
      { icon: ShieldCheck, title: "Removes bias", desc: "Structured scoring on defined rubrics — less resume-based bias, more skill-based selection." },
      { icon: BrainCircuit, title: "Predictive validity", desc: "0.78 correlation between assessment scores and 1-year performance ratings — published validation studies." },
      { icon: FileCheck2, title: "Audit-ready reports", desc: "Every assessment has a candidate report, scorecard, and decision rationale for compliance." },
      { icon: Gauge, title: "Faster cycle time", desc: "Reduce assessment-to-offer from 14 days to 5 days with automated scoring and shortlisting." },
      { icon: Network, title: "ATS integration", desc: "Native integrations with Greenhouse, Lever, Workday, Naukrm, and our own platform." },
    ],
    useCases: [
      {
        scenario: "High-volume campus hiring — 8,000 applicants for 120 entry-level engineering roles.",
        solution: "Adaptive aptitude + coding assessment with AI shortlisting to top 800 candidates for interviews.",
        metrics: [
          { label: "Hiring mgr time saved", value: "240 hrs" },
          { label: "Cycle time", value: "−62%" },
          { label: "1-yr performance", value: "+18%" },
        ],
      },
      {
        scenario: "Mid-size SaaS company scaling engineering needed consistent senior eng assessment bar.",
        solution: "Custom senior eng assessment — system design, code review, and behavioral — with company-specific rubrics.",
        metrics: [
          { label: "False-positive rate", value: "−44%" },
          { label: "Interview-to-offer", value: "+22%" },
          { label: "Manager NPS", value: "+28 pts" },
        ],
      },
      {
        scenario: "BFSI captive wanted scientific assessment for branch manager promotions.",
        solution: "Behavioral and situational judgment test mapped to bank's leadership competency framework.",
        metrics: [
          { label: "Promotion accuracy", value: "+34%" },
          { label: "12-mo performance", value: "+21%" },
          { label: "Attrition (promoted)", value: "−18%" },
        ],
      },
    ],
    industries: ["IT & SaaS", "BFSI", "Consulting", "Healthcare", "Manufacturing", "Retail"],
    stats: [
      { label: "Assessments / year", value: "240K+", icon: ClipboardCheck },
      { label: "Question bank", value: "12,000+", icon: BookOpen },
      { label: "Predictive validity", value: "0.78", icon: BrainCircuit },
      { label: "ATS integrations", value: "8+", icon: Network },
    ],
    testimonials: [
      {
        quote: "AI assessments saved our hiring managers 240 hours on a single campus drive. Top 10% shortlist was spot-on — 1-year performance up 18%.",
        name: "Naveen Thomas",
        role: "Talent Acquisition Head",
        company: "TCS",
        initials: "NT",
      },
      {
        quote: "Explainable scoring is the killer feature. Every shortlist comes with reasons, not just ranks. Hiring managers trust the AI now.",
        name: "Pooja Bhat",
        role: "VP People Ops",
        company: "Swiggy",
        initials: "PB",
      },
      {
        quote: "Custom senior eng assessment cut our false-positive rate by 44%. Manager NPS jumped 28 points in one quarter.",
        name: "Karthik Raman",
        role: "Engineering Director",
        company: "Freshworks",
        initials: "KR",
      },
    ],
    deliverables: [
      "Custom assessment design mapped to role competencies and your hiring rubric",
      "Branded candidate experience with proctoring, anti-cheating, and plagiarism detection",
      "Explainable AI scorecards with benchmarking against your team or industry",
      "ATS integration (Greenhouse, Lever, Workday, Naukri, or our platform)",
      "Audit-ready candidate reports with decision rationale for compliance",
    ],
    faqs: [
      { q: "How does the AI scoring work?", a: "Our AI evaluates code correctness, efficiency, and style for technical tasks; compares responses to rubric for behavioral; and benchmarks against your team or industry for aptitude. Every score includes a plain-English explanation of why the candidate ranked where they did." },
      { q: "Can we use our own questions?", a: "Yes — we support custom questions in coding, MCQ, and behavioral formats. Our team can also co-create problems with your SMEs aligned to your domain and stack." },
      { q: "How do you prevent cheating?", a: "Browser lockdown, webcam monitoring with face detection, tab-switch alerts, copy-paste blocking, code similarity checks, and review of suspicious sessions by humans before scores are finalized." },
      { q: "Which ATS systems do you integrate with?", a: "Native integrations with Greenhouse, Lever, Workday, SmartRecruiters, Naukri, and our own platform. Custom integrations available for enterprise clients." },
    ],
    siblingRoles: [
      { key: "talent-sourcing-recruitment", label: "Sourcing & Recruitment", icon: Search, color: "#0EA5E9", desc: "AI-powered talent sourcing from 2M+ candidates." },
      { key: "talent-train-to-hire", label: "Train to Hire", icon: GraduationCap, color: "#0EA5E9", desc: "Train fresh talent, then deploy to your team." },
      { key: "talent-staffing", label: "Staffing Solutions", icon: Users, color: "#10B981", desc: "Flexible staffing at any scale." },
      { key: "talent-end-to-end-workforce", label: "End-to-End Workforce", icon: Globe, color: "#8B5CF6", desc: "Full lifecycle workforce management." },
    ],
  },

  "talent-sourcing-recruitment": {
    title: "Sourcing & Recruitment",
    subtitle: "AI-powered talent sourcing",
    description: "AI-powered talent sourcing from our 2M+ candidate pool and the broader Indian market. Find the right fit fast — with transparent fit scoring and explainable shortlists.",
    color: "#0EA5E9",
    icon: Search,
    heroStats: [
      { label: "Candidate pool", value: "2M+" },
      { label: "Avg shortlist time", value: "5 days" },
      { label: "Submittal-to-interview", value: "68%" },
    ],
    keyFeatures: [
      { icon: BrainCircuit, title: "AI fit scoring", desc: "Transparent scoring across skills, experience, salary alignment, and culture fit — explainable." },
      { icon: Database, title: "2M+ verified pool", desc: "Identity-verified, skill-tested candidates with consent-driven data and active job-seeking signals." },
      { icon: Network, title: "Multi-channel sourcing", desc: "Internal pool + job boards + LinkedIn + GitHub + partner colleges + 80+ regional recruiters." },
      { icon: ShieldCheck, title: "Pre-vetted candidates", desc: "Phone screen, skill test, and reference check completed before presenting to your team." },
      { icon: FileCheck2, title: "Structured shortlists", desc: "Every shortlist includes a fit scorecard, candidate summary, and recommended interview focus areas." },
      { icon: Headset, title: "Dedicated recruiter", desc: "Single point of contact who knows your team, your stack, and your cultural markers." },
    ],
    processSteps: [
      { step: "01", title: "Role intake", desc: "Deep-dive call with your hiring manager to align on JD, must-have skills, salary band, and cultural markers." },
      { step: "02", title: "Sourcing strategy", desc: "We pick the right mix of pool, job boards, social, and partner network based on role scarcity." },
      { step: "03", title: "AI shortlisting", desc: "Our AI scans the pool and ranks candidates with explainable fit scores — top 5–10 selected." },
      { step: "04", title: "Candidate screening", desc: "Phone screen, skill test, and reference check before presenting shortlist to your team." },
      { step: "05", title: "Shortlist delivery", desc: "5–10 pre-vetted candidates with fit scorecards delivered within 5 business days of intake." },
      { step: "06", title: "Interview coordination", desc: "We schedule, coordinate, and host interviews with shared scorecards and post-interview debriefs." },
    ],
    benefits: [
      { icon: Clock, title: "5-day shortlist SLA", desc: "First batch of 5–10 pre-vetted candidates delivered within 5 business days of role intake." },
      { icon: BrainCircuit, title: "Explainable AI", desc: "No black boxes — every fit score comes with a plain-English explanation of why this candidate." },
      { icon: ShieldCheck, title: "Pre-vetted quality", desc: "Phone screen, skill test, and reference check done — your team meets only serious, qualified candidates." },
      { icon: Wallet, title: "Contingent or retained", desc: "Pick success-fee (contingent) or upfront (retained) — same quality, different commercial terms." },
      { icon: Gauge, title: "Higher submittal-to-interview", desc: "68% of our submittals convert to interviews — vs 25% industry average for cold sourcing." },
      { icon: Network, title: "80+ regional recruiters", desc: "On-ground recruiters in tier-2/3 cities for frontline, retail, manufacturing, and healthcare volume." },
    ],
    useCases: [
      {
        scenario: "Series B fintech needed 25 senior engineers in 4 months for product expansion.",
        solution: "Retained search with AI shortlisting from our 2M+ pool and active poaching from competitor firms.",
        metrics: [
          { label: "Shortlist time", value: "5 days" },
          { label: "Hires delivered", value: "27" },
          { label: "Submittal-to-offer", value: "32%" },
        ],
      },
      {
        scenario: "Healthcare chain needed 80+ specialized clinical roles across 12 cities.",
        solution: "Multi-city sourcing with regional recruiters + AI fit scoring on credentials and city fit.",
        metrics: [
          { label: "Roles filled", value: "84" },
          { label: "Time-to-hire", value: "−38%" },
          { label: "90-day retention", value: "97%" },
        ],
      },
      {
        scenario: "Manufacturing company needed 40 plant managers across 6 new factories.",
        solution: "Targeted sourcing from industry competitors + structured behavioral assessments.",
        metrics: [
          { label: "Shortlists/role", value: "8" },
          { label: "Offer-accept rate", value: "82%" },
          { label: "Time-to-fill", value: "45 days" },
        ],
      },
    ],
    industries: ["IT & SaaS", "Fintech", "Healthcare", "Manufacturing", "BFSI", "E-commerce"],
    stats: [
      { label: "Candidate pool", value: "2M+", icon: Database },
      { label: "Shortlist SLA", value: "5 days", icon: Clock },
      { label: "Submittal-to-interview", value: "68%", icon: Gauge },
      { label: "Regional recruiters", value: "80+", icon: Network },
    ],
    testimonials: [
      {
        quote: "JOBSONN delivered 27 senior engineers in 4 months for our Series B scale-up. Their AI shortlists were spot-on — submittal-to-offer rate of 32%.",
        name: "Karan Bhatia",
        role: "VP Engineering",
        company: "FinEdge",
        initials: "KB",
      },
      {
        quote: "The fit scorecards are gold. Every shortlist explains why this candidate, why this fit score — hiring managers actually trust the AI now.",
        name: "Nisha Sharma",
        role: "Talent Acquisition Lead",
        company: "MediCare Group",
        initials: "NS",
      },
      {
        quote: "80+ regional recruiters meant we could source 84 specialized clinical roles across 12 cities without inflating our internal TA team.",
        name: "Sridhar Rao",
        role: "CHRO",
        company: "MediCare Group",
        initials: "SR",
      },
    ],
    deliverables: [
      "Dedicated recruiter who knows your team, stack, and culture markers",
      "5–10 pre-vetted candidates per role within 5 business days of intake",
      "AI fit scorecard for every candidate with explainable ranking",
      "Phone screen, skill test, and reference check completed before shortlist delivery",
      "Interview coordination with shared scorecards and post-interview debriefs",
    ],
    faqs: [
      { q: "Contingent or retained — which should I pick?", a: "Contingent (success-fee) is best for high-volume or lower-seniority roles where multiple vendors compete. Retained (upfront fee) is best for senior, specialist, or confidential searches where you want exclusive dedication from our team." },
      { q: "How does your AI scoring work?", a: "Our AI evaluates skills match, experience relevance, salary alignment, geographic fit, and cultural signals from consent-driven candidate data. Every score includes a plain-English explanation — no black boxes." },
      { q: "Do you handle salary negotiation?", a: "Yes — our recruiters manage offer extension, salary negotiation, and candidate acceptance. We provide market benchmarking data to support your offer decisions." },
      { q: "What's your replacement guarantee?", a: "90-day replacement guarantee on permanent hires, free of charge. If a placed candidate leaves or is terminated within 90 days, we source a replacement at no additional fee." },
    ],
    siblingRoles: [
      { key: "talent-assessment", label: "Talent Assessment", icon: ClipboardCheck, color: "#EF4444", desc: "AI-powered skill and aptitude assessments." },
      { key: "talent-staffing", label: "Staffing Solutions", icon: Users, color: "#10B981", desc: "Flexible staffing at any scale." },
      { key: "talent-train-to-hire", label: "Train to Hire", icon: GraduationCap, color: "#0EA5E9", desc: "Train fresh talent, then deploy." },
      { key: "talent-flexible-deployment", label: "Flexible Deployment", icon: Layers, color: "#10B981", desc: "On-demand contract and project talent." },
    ],
  },

  "talent-flexible-deployment": {
    title: "Flexible Deployment",
    subtitle: "On-demand talent, when you need it",
    description: "Deploy talent flexibly — contract, project-based, or on-demand staffing. Scale your team up or down in days, with no long-term commitments and full statutory compliance.",
    color: "#10B981",
    icon: Layers,
    heroStats: [
      { label: "Talent pool", value: "150K+" },
      { label: "Deployment SLA", value: "5 days" },
      { label: "Engagement flexibility", value: "100%" },
    ],
    keyFeatures: [
      { icon: Zap, title: "On-demand activation", desc: "Activate a pre-vetted talent pool within 5 business days — no recruitment cycle, no waiting." },
      { icon: Layers, title: "Multiple engagement models", desc: "Contract, project-based, hourly, weekly, monthly — pick what fits each role." },
      { icon: RefreshCw, title: "Elastic scale", desc: "Ramp up from 10 to 1,000+ in weeks, ramp down in days — no long-term commitments." },
      { icon: ShieldCheck, title: "Full compliance", desc: "PF, ESI, gratuity, labor law compliance across all Indian states — handled end-to-end." },
      { icon: Wallet, title: "Variable cost", desc: "Pay only for hours/days worked — no fixed salaries, no idle bench costs, no severance." },
      { icon: Headset, title: "Dedicated operations", desc: "Single point of contact for deployments, billing, replacements, and escalations." },
    ],
    processSteps: [
      { step: "01", title: "Demand forecast", desc: "We work with your team to forecast demand patterns — seasonal, project, or growth-driven." },
      { step: "02", title: "Talent pool pre-build", desc: "We pre-vet a pool of 50–500 candidates aligned to your roles, ready for activation." },
      { step: "03", title: "On-demand activation", desc: "When demand hits, we deploy from the pre-vetted pool within 5 business days." },
      { step: "04", title: "Daily operations", desc: "Attendance, performance, and replacement management — all handled by our ops team." },
      { step: "05", title: "Elastic ramp", desc: "Scale up or down weekly based on actual demand — no minimum commitments." },
      { step: "06", title: "Compliance & billing", desc: "Single monthly invoice per worker covering wages, PF, ESI, and statutory benefits." },
    ],
    benefits: [
      { icon: Wallet, title: "Variable cost structure", desc: "Pay per hour/day/week — no fixed salaries, no bench costs, no severance. Pure operating expense." },
      { icon: Zap, title: "5-day deployment SLA", desc: "From request to worker on the floor in 5 business days, with pre-vetted candidates." },
      { icon: RefreshCw, title: "Elastic scale", desc: "Ramp up 100× in weeks, ramp down in days — match workforce to actual demand, not forecasts." },
      { icon: ShieldCheck, title: "Zero compliance risk", desc: "We are the employer of record — all statutory compliance, payroll, and labor law handled by us." },
      { icon: Gauge, title: "Reduced admin overhead", desc: "One monthly invoice per worker — no payroll, no PF/ESI filings, no HR admin work for your team." },
      { icon: Network, title: "Pan-India coverage", desc: "120+ cities with on-ground ops teams for frontline, retail, manufacturing, and healthcare volume." },
    ],
    useCases: [
      {
        scenario: "E-commerce company needed 1,500 warehouse and delivery staff for festive season spike.",
        solution: "Flexible deployment with pre-vetted pool of 2,000 workers, ramped to 1,500 in 7 days across 14 cities.",
        metrics: [
          { label: "Workers deployed", value: "1,500" },
          { label: "Ramp time", value: "7 days" },
          { label: "Compliance gaps", value: "0" },
        ],
      },
      {
        scenario: "IT services company needed 80 contract developers for a 9-month client engagement.",
        solution: "Project-based deployment with ramp-up over 4 weeks and ramp-down at month 9 — no severance cost.",
        metrics: [
          { label: "Developers deployed", value: "82" },
          { label: "Ramp-up time", value: "4 wk" },
          { label: "Bench cost", value: "₹0" },
        ],
      },
      {
        scenario: "Healthcare chain needed flexible nursing staff across 14 hospitals for variable patient load.",
        solution: "On-demand nursing pool with weekly activation based on hospital-level patient census.",
        metrics: [
          { label: "Nurses in pool", value: "400" },
          { label: "Avg deploy time", value: "3 days" },
          { label: "Cost vs permanent", value: "−28%" },
        ],
      },
    ],
    industries: ["E-commerce", "Retail", "Manufacturing", "Healthcare", "Logistics", "IT & SaaS"],
    stats: [
      { label: "Talent pool", value: "150K+", icon: Users },
      { label: "Deployment SLA", value: "5 days", icon: Zap },
      { label: "Cities covered", value: "120+", icon: MapPin },
      { label: "Annual deployments", value: "12,000+", icon: Rocket },
    ],
    testimonials: [
      {
        quote: "1,500 warehouse and delivery staff in 7 days for festive season. Zero compliance gaps, zero bench cost afterward. GAMESS changer.",
        name: "Amitabh Sengupta",
        role: "Chief People Officer",
        company: "RetailMax",
        initials: "AS",
      },
      {
        quote: "82 contract developers for a 9-month engagement — ramp-up over 4 weeks, ramp-down at month 9, no severance. Perfect fit for project work.",
        name: "Pooja Reddy",
        role: "Resource Mgmt Head",
        company: "TechMahindra",
        initials: "PR",
      },
      {
        quote: "On-demand nursing pool across 14 hospitals means we match workforce to patient census weekly. Cost down 28% vs permanent model.",
        name: "Dr. Lakshmi Iyer",
        role: "COO",
        company: "MediCare Group",
        initials: "LI",
      },
    ],
    deliverables: [
      "Pre-vetted talent pool of 50–500 candidates aligned to your roles, ready for activation",
      "5-business-day deployment SLA with weekly elasticity (ramp up or down)",
      "Full statutory compliance — PF, ESI, gratuity, labor law — handled end-to-end",
      "Single monthly invoice per worker covering wages, benefits, and statutory contributions",
      "Dedicated operations manager with attendance, performance, and replacement management",
    ],
    faqs: [
      { q: "What's the minimum commitment?", a: "No minimum. You can deploy a single worker for a single day, or 1,000 workers for 12 months. The model is fully elastic — scale up or down weekly." },
      { q: "Who is the employer of record?", a: "JOBSONN is the employer of record for all contract and on-demand workers. We handle payroll, PF, ESI, gratuity, leave, and all statutory compliance — you receive a single monthly invoice per worker." },
      { q: "How fast can you deploy?", a: "From request to worker on the floor in 5 business days, assuming we have pre-vetted candidates in your geography. For new geographies or specialized roles, allow 7–10 days for first deployment." },
      { q: "What if a worker is underperforming?", a: "We replace underperforming workers within 3 business days at no additional cost. Our ops team manages attendance, performance, and replacements — your team focuses on the work, not the HR admin." },
    ],
    siblingRoles: [
      { key: "talent-staffing", label: "Staffing Solutions", icon: Users, color: "#10B981", desc: "Flexible staffing — contract, permanent, project." },
      { key: "talent-sourcing-recruitment", label: "Sourcing & Recruitment", icon: Search, color: "#0EA5E9", desc: "AI-powered talent sourcing from 2M+ candidates." },
      { key: "talent-end-to-end-workforce", label: "End-to-End Workforce", icon: Globe, color: "#8B5CF6", desc: "Full lifecycle workforce management." },
      { key: "talent-assessment", label: "Talent Assessment", icon: ClipboardCheck, color: "#EF4444", desc: "AI-powered skill and aptitude assessments." },
    ],
  },

  "talent-end-to-end-workforce": {
    title: "End-to-End Workforce",
    subtitle: "Full lifecycle workforce management",
    description: "Complete workforce management from hiring to retention — one partner, one contract, one SLA. Sourcing, training, deployment, payroll, compliance, and retention tracking under a single master agreement.",
    color: "#8B5CF6",
    icon: Globe,
    heroStats: [
      { label: "Avg client tenure", value: "5+ yrs" },
      { label: "Workforce managed", value: "85,000+" },
      { label: "Cost reduction", value: "32%" },
    ],
    keyFeatures: [
      { icon: Workflow, title: "Single master agreement", desc: "One contract covering sourcing, training, staffing, deployment, payroll, compliance, and retention." },
      { icon: Network, title: "Dedicated workforce partner", desc: "A senior partner who owns your end-to-end workforce strategy, not just transactional req fulfillment." },
      { icon: BarChart3, title: "Workforce analytics", desc: "Real-time dashboards on cost-per-hire, time-to-fill, retention, productivity, and compliance posture." },
      { icon: RefreshCw, title: "Continuous optimization", desc: "Quarterly business reviews with optimization recommendations on cost, mix, and engagement models." },
      { icon: ShieldCheck, title: "Compliance umbrella", desc: "All statutory compliance — PF, ESI, gratuity, labor law — handled across all engagement types and geographies." },
      { icon: HeartHandshake, title: "Retention programs", desc: "Structured engagement, recognition, and growth programs for deployed workforce — 98% retention." },
    ],
    processSteps: [
      { step: "01", title: "Workforce audit", desc: "We audit your current workforce — cost, mix, engagement models, compliance, and retention metrics." },
      { step: "02", title: "Strategy design", desc: "Co-design a workforce strategy — role mix, engagement models, training pipeline, and cost targets." },
      { step: "03", title: "Transition & onboarding", desc: "Phased transition of existing workforce and recruitment processes to our managed model." },
      { step: "04", title: "Operations & delivery", desc: "Day-to-day sourcing, deployment, payroll, compliance, and retention — handled by our ops team." },
      { step: "05", title: "Analytics & reporting", desc: "Real-time dashboards + monthly business reviews + quarterly optimization recommendations." },
      { step: "06", title: "Continuous improvement", desc: "Annual strategy refresh based on business changes, market shifts, and engagement performance." },
    ],
    benefits: [
      { icon: Wallet, title: "32% cost reduction", desc: "Average cost reduction across workforce spend — through mix optimization, vendor consolidation, and process efficiency." },
      { icon: ShieldCheck, title: "Single-point accountability", desc: "One partner, one SLA, one invoice — no finger-pointing between vendors, payroll providers, and compliance consultants." },
      { icon: Gauge, title: "Workforce visibility", desc: "Real-time analytics on cost, mix, retention, productivity, and compliance across all roles and geographies." },
      { icon: Network, title: "Senior partner", desc: "A workforce strategist with 15+ years experience owns your account — not a transactional account manager." },
      { icon: RefreshCw, title: "Vendor consolidation", desc: "Replace 5–15 vendors with one partner — reduces admin overhead, billing complexity, and compliance risk." },
      { icon: HeartHandshake, title: "98% retention", desc: "Structured engagement, recognition, and growth programs deliver industry-leading retention rates." },
    ],
    useCases: [
      {
        scenario: "Healthcare chain scaling to 14 new hospitals needed end-to-end workforce management across clinical and admin roles.",
        solution: "End-to-End Workforce partnership covering sourcing, screening, credentialing, onboarding, payroll, and retention.",
        metrics: [
          { label: "Roles filled", value: "320+" },
          { label: "Cost per hire", value: "−42%" },
          { label: "Credentialing time", value: "−35%" },
        ],
      },
      {
        scenario: "Manufacturing conglomerate with 5,000+ contract workers across 12 plants wanted to consolidate 18 vendors.",
        solution: "End-to-End managed workforce — single partner, single SLA, real-time analytics across all plants.",
        metrics: [
          { label: "Vendors consolidated", value: "18→1" },
          { label: "Cost reduction", value: "28%" },
          { label: "Compliance incidents", value: "−92%" },
        ],
      },
      {
        scenario: "Retail chain with 12,000 frontline staff across 200 stores wanted workforce strategy partner for growth.",
        solution: "Strategic workforce partnership covering seasonal flex, permanent staffing, training, and retention.",
        metrics: [
          { label: "Workforce managed", value: "12,000" },
          { label: "Annual cost saving", value: "₹14 Cr" },
          { label: "Retention", value: "94%" },
        ],
      },
    ],
    industries: ["Healthcare", "Manufacturing", "Retail", "BFSI", "IT & SaaS", "Logistics"],
    stats: [
      { label: "Workforce managed", value: "85,000+", icon: Users },
      { label: "Avg cost reduction", value: "32%", icon: Wallet },
      { label: "Avg client tenure", value: "5+ yrs", icon: HeartHandshake },
      { label: "Vendor consolidation", value: "18→1", icon: Network },
    ],
    testimonials: [
      {
        quote: "End-to-End Workforce partnership scaled MediCare across 14 new hospitals — 320+ roles filled, cost-per-hire down 42%, credentialing time down 35%.",
        name: "Dr. Sridhar Rao",
        role: "CHRO",
        company: "MediCare Group",
        initials: "SR",
      },
      {
        quote: "We consolidated 18 vendors into 1 partner across 12 plants. Cost down 28%, compliance incidents down 92%, admin overhead reduced dramatically.",
        name: "Ramesh Iyer",
        role: "Plant Director",
        company: "Bharat Forge",
        initials: "RI",
      },
      {
        quote: "Strategic workforce partner for our 12,000-person retail operation. ₹14 Cr annual savings, 94% retention, and a true partner — not just another vendor.",
        name: "Amitabh Sengupta",
        role: "Chief People Officer",
        company: "RetailMax",
        initials: "AS",
      },
    ],
    deliverables: [
      "Single master agreement covering sourcing, training, deployment, payroll, compliance, and retention",
      "Dedicated senior workforce partner (15+ years experience) as your single point of accountability",
      "Real-time workforce analytics dashboard — cost, mix, retention, productivity, compliance",
      "Quarterly business reviews with optimization recommendations on cost, mix, and engagement models",
      "Annual strategy refresh aligned to your business plan and market conditions",
    ],
    faqs: [
      { q: "What's the minimum engagement size?", a: "End-to-End Workforce partnerships typically start at 500+ workers or ₹5 Cr+ annual workforce spend. For smaller engagements, our Staffing or Flexible Deployment solutions are a better fit." },
      { q: "How long is the typical contract?", a: "Initial 3-year master agreement with annual renewals. Average client tenure is 5+ years — we become a long-term workforce operating partner, not a transactional vendor." },
      { q: "Do you take over our existing workforce?", a: "Yes — we handle TUPE-style transfers of existing contract staff to our payroll with full continuity of service, benefits, and seniority. Permanent employees typically stay on your payroll." },
      { q: "How do you measure success?", a: "Quarterly business reviews track cost-per-hire, time-to-fill, retention, productivity, compliance posture, and overall workforce spend vs target. Every QBR ends with concrete optimization recommendations." },
    ],
    siblingRoles: [
      { key: "talent-staffing", label: "Staffing Solutions", icon: Users, color: "#10B981", desc: "Flexible staffing at any scale." },
      { key: "talent-flexible-deployment", label: "Flexible Deployment", icon: Layers, color: "#10B981", desc: "On-demand contract and project talent." },
      { key: "talent-sourcing-recruitment", label: "Sourcing & Recruitment", icon: Search, color: "#0EA5E9", desc: "AI-powered talent sourcing from 2M+ candidates." },
      { key: "talent-corporate-training", label: "Corporate Training", icon: Award, color: "#F97316", desc: "Upskill your existing workforce at scale." },
    ],
  },
};

function getRoleConfig(roleKey: string): RoleConfig | undefined {
  return TALENT_ROLES[roleKey];
}

export function PublicTalentRole({ roleKey }: { roleKey: string }) {
  const { navigate } = useNav();
  const config = getRoleConfig(roleKey);
  const learnMoreRef = React.useRef<HTMLDivElement>(null);

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="Talent solution not found"
          description={`We couldn't find a talent solution matching "${roleKey}". Browse all solutions to find the right one.`}
          action={
            <Button onClick={() => navigate("public", "talent-solutions")} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> View all solutions
            </Button>
          }
        />
      </div>
    );
  }

  const scrollToDetails = () => {
    learnMoreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(circle at 30% 0%, ${config.color}15, transparent 60%)`,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <button
            onClick={() => navigate("public", "talent-solutions")}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Talent Solutions
          </button>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="gap-1"
                  style={{ color: config.color, borderColor: `${config.color}40` }}
                >
                  <config.icon className="h-3 w-3" /> {config.subtitle}
                </Badge>
                <Badge variant="outline" className="gap-1 text-brand">
                  <Sparkles className="h-3 w-3" /> Talent Solution
                </Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {config.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                {config.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => toast.success("Get Started", { description: `Our ${config.title} team will reach out within 1 business day.` })} className="gap-1.5">
                  <Rocket className="h-4 w-4" /> Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={scrollToDetails} className="gap-1.5">
                  <ChevronRight className="h-4 w-4" /> Learn More
                </Button>
              </div>
            </div>
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-muted-foreground">At a glance</h3>
              <dl className="mt-4 space-y-3">
                {config.heroStats.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-3">
                    <dt className="text-sm text-muted-foreground">{s.label}</dt>
                    <dd className="text-lg font-bold" style={{ color: config.color }}>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Talk to a {config.title} specialist today.
                </p>
                <Button size="sm" className="mt-2 w-full gap-1.5" onClick={() => navigate("public", "contact")}>
                  <Headset className="h-3.5 w-3.5" /> Talk to Sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section ref={learnMoreRef} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Key features</h2>
          <p className="mt-2 text-sm text-muted-foreground">What makes our {config.title.toLowerCase()} program different.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.keyFeatures.map((f) => (
            <Card key={f.title} className="h-full p-5">
              <div
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${config.color}1A`, color: config.color }}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Process steps */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">{config.processSteps.length} steps from kickoff to delivery.</p>
          </div>
          <div className="relative space-y-6 before:absolute before:left-3 before:h-full before:w-px before:bg-border sm:before:left-1/2">
            {config.processSteps.map((p, i) => (
              <div
                key={p.step}
                className={`relative pl-10 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:ml-0 sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"}`}
              >
                <div
                  className={`absolute top-1 left-0 h-6 w-6 rounded-full border-2 bg-background sm:left-auto ${i % 2 === 0 ? "sm:-right-3" : "sm:-left-3"}`}
                  style={{ borderColor: config.color }}
                >
                  <div
                    className="absolute inset-1 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: config.color }}>{p.step}</span>
                  </div>
                  <h3 className="mt-1 text-sm font-semibold">{p.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Benefits</h2>
          <p className="mt-2 text-sm text-muted-foreground">Why teams choose our {config.title.toLowerCase()} program.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.benefits.map((b) => (
            <Card key={b.title} className="h-full p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Use cases</h2>
            <p className="mt-2 text-sm text-muted-foreground">Real engagements and the outcomes they delivered.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {config.useCases.map((u, i) => (
              <Card key={i} className="flex h-full flex-col p-6" style={{ borderTopColor: config.color, borderTopWidth: 4 }}>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Scenario</div>
                    <p className="mt-1 text-foreground">{u.scenario}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Solution</div>
                    <p className="mt-1 text-foreground">{u.solution}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 border-t pt-4">
                  {u.metrics.map((m) => (
                    <div key={m.label} className="text-center">
                      <div className="text-base font-bold text-brand">{m.value}</div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries served */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Industries we serve</h2>
          <p className="mt-2 text-sm text-muted-foreground">Specialized talent pools and domain-trained recruiters.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {config.industries.map((ind) => (
            <Badge
              key={ind}
              variant="outline"
              className="bg-card px-3 py-1.5 text-xs"
              style={{ color: config.color, borderColor: `${config.color}40` }}
            >
              {ind}
            </Badge>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">By the numbers</h2>
            <p className="mt-2 text-sm text-muted-foreground">Program metrics from the last 12 months.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {config.stats.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                icon={<s.icon className="h-5 w-5" />}
                tone="brand"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What you get</h2>
          <p className="mt-2 text-sm text-muted-foreground">Every engagement includes these deliverables.</p>
        </div>
        <Card className="mx-auto max-w-2xl p-6">
          <ul className="space-y-3">
            {config.deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span className="text-sm leading-relaxed text-foreground">{d}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Testimonials */}
      {config.testimonials.length > 0 && (
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What clients say</h2>
              <p className="mt-2 text-sm text-muted-foreground">Hiring leaders on their {config.title.toLowerCase()} engagement.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {config.testimonials.map((t) => (
                <Card key={t.name} className="flex h-full flex-col p-6">
                  <Quote className="h-7 w-7 text-brand/40" />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3 border-t pt-4">
                    <AvatarLogo text={t.initials} size="md" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}, {t.company}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">Common questions about our {config.title.toLowerCase()} program.</p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {config.faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-lg border bg-card px-4">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Sibling roles */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore other talent solutions</h2>
            <p className="mt-2 text-sm text-muted-foreground">Combine models or switch as your hiring plan evolves.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {config.siblingRoles.map((r) => {
              const SiblingIcon = r.icon;
              return (
                <Card
                  key={r.key}
                  className="group h-full cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => navigate("public", `talent/${r.key}`)}
                >
                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${r.color}1A`, color: r.color }}
                  >
                    <SiblingIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold group-hover:text-brand">{r.label}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.desc}</p>
                  <div
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium"
                    style={{ color: r.color }}
                  >
                    Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to start with {config.title}?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Tell us your hiring plan and our {config.title.toLowerCase()} team will propose a tailored engagement — typically within 1 business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => toast.success("Get Started", { description: `Our ${config.title} team will reach out within 1 business day.` })} className="gap-1.5">
                <Rocket className="h-4 w-4" /> Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
                <Headset className="h-4 w-4" /> Talk to Sales
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

// Reserved for downstream consumers that may import the icon map.
export const _TALENT_ROLE_ICONS = ICON_COMMON;
