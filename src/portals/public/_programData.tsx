"use client";

import * as React from "react";
import {
  Rocket, GraduationCap, Megaphone, Cloud, Bot, type LucideIcon,
} from "lucide-react";
import {
  PROGRAM_TRACKS, type ProgramTrackInfo,
} from "@/data/programTracksData";

// ============================================================
// 5 flagship program definitions (used by PublicPrograms,
// PublicProgramDetail, PublicProgramRole). Source of truth.
// ============================================================

export interface PublicProgramDef {
  id: "fde-forward-deployment" | "fde-program" | "dsai-program" | "cdm-program" | "gaa-program";
  label: string;
  view: string;
  tag: "FDE-FWD" | "FDE" | "DSAI" | "CDM" | "GAA";
  color: string;
  desc: string;
  icon: LucideIcon;
  highlights: string[];
  // main program id in programTracksData
  mainProgramId: "fde-fwd" | "fde" | "dsai" | "cdm" | "gaa";
  duration: string;
  mode: string;
  level: string;
  format: string;
  startingSalary: string;
  hiringPartners: number;
}

export const PUBLIC_PROGRAMS: PublicProgramDef[] = [
  {
    id: "fde-forward-deployment",
    label: "Forward Deployed Engineer",
    view: "programs/fde-forward-deployment",
    tag: "FDE-FWD",
    color: "#F59E0B",
    desc:
      "24-week flagship program. Build, deploy & operate production systems across web, mobile, cloud, AI & MLOps. Get hired as a forward-deployed engineer who ships from day one.",
    icon: Rocket,
    highlights: [
      "Ship real products to production, not just assignments",
      "Work on live client projects from week 4 onwards",
      "Master AI, cloud, DevOps & full-stack in one program",
      "Get placed with top tech companies across India",
      "Earn while you learn with paid internships built-in",
      "6 specialization tracks to match your career goals",
    ],
    mainProgramId: "fde-fwd",
    duration: "24 Weeks",
    mode: "Hybrid / Online Interactive",
    level: "Beginner to Advanced",
    format: "Full-time + Live Projects",
    startingSalary: "₹8–18 LPA",
    hiringPartners: 220,
  },
  {
    id: "fde-program",
    label: "Fullstack Development Engineering",
    view: "programs/fde-program",
    tag: "FDE",
    color: "#0EA5E9",
    desc:
      "24-week intensive. Master React, Next.js, Node.js, PostgreSQL & production apps. Graduate as a battle-tested fullstack developer ready for any team.",
    icon: GraduationCap,
    highlights: [
      "Go from zero to a production-ready full-stack developer",
      "Build 12+ real-world projects for your portfolio",
      "Master React, Next.js, Node.js, PostgreSQL & more",
      "Get direct placement support with 200+ hiring partners",
      "Learn product thinking, not just coding skills",
      "6 specialized paths: AI, SaaS, Cloud, Enterprise & more",
    ],
    mainProgramId: "fde",
    duration: "24 Weeks",
    mode: "Online Interactive",
    level: "Beginner to Advanced",
    format: "Full-time / Part-time",
    startingSalary: "₹6–15 LPA",
    hiringPartners: 210,
  },
  {
    id: "dsai-program",
    label: "Digital Sales & AI Marketing / AI Engineering",
    view: "programs/dsai-program",
    tag: "DSAI",
    color: "#8B5CF6",
    desc:
      "20-week program. Master AI-powered marketing, automation & AI engineering. Build AI agents that sell, market and grow revenue autonomously.",
    icon: Megaphone,
    highlights: [
      "Master AI-powered sales, marketing & automation",
      "Build AI agents that sell and market autonomously",
      "Drive real revenue growth with data-driven strategies",
      "Get certified in the fastest-growing tech domain",
      "Hands-on with 10+ marketing automation tools & platforms",
      "6 career paths from sales to AI engineering",
    ],
    mainProgramId: "dsai",
    duration: "20 Weeks",
    mode: "Online Interactive",
    level: "Beginner to Advanced",
    format: "Full-time / Part-time",
    startingSalary: "₹5–14 LPA",
    hiringPartners: 180,
  },
  {
    id: "cdm-program",
    label: "Cloud, DevOps & MLOps",
    view: "programs/cdm-program",
    tag: "CDM",
    color: "#10B981",
    desc:
      "22-week program. Master cloud infrastructure, DevOps automation, Kubernetes & MLOps. Ship and scale production systems that never go down.",
    icon: Cloud,
    highlights: [
      "Master AWS, Azure & GCP cloud architectures end-to-end",
      "Build CI/CD pipelines that ship code with confidence",
      "Automate infrastructure with Terraform, Ansible & IaC",
      "Deploy & operate ML models in production with MLOps",
      "Run Kubernetes at scale — from clusters to service mesh",
      "6 career paths from cloud engineer to MLOps architect",
    ],
    mainProgramId: "cdm",
    duration: "22 Weeks",
    mode: "Online Interactive",
    level: "Beginner to Advanced",
    format: "Full-time / Part-time",
    startingSalary: "₹7–20 LPA",
    hiringPartners: 200,
  },
  {
    id: "gaa-program",
    label: "Gen AI & Agentic Automation Engineer",
    view: "programs/gaa-program",
    tag: "GAA",
    color: "#8B5CF6",
    desc:
      "20-week program. Master LLMs, AI agents, generative AI & agentic automation. Build autonomous systems that ship to production — not just demos.",
    icon: Bot,
    highlights: [
      "Master LLMs, RAG, prompt engineering & LangChain end-to-end",
      "Build autonomous AI agents with CrewAI, AutoGen & multi-agent systems",
      "Create generative AI apps — text, image, video & code generation",
      "Automate business workflows with AI-powered agentic pipelines",
      "Ship production AI products with monitoring, guardrails & evaluation",
      "6 career paths from LLM engineer to AI automation architect",
    ],
    mainProgramId: "gaa",
    duration: "20 Weeks",
    mode: "Online Interactive",
    level: "Beginner to Advanced",
    format: "Full-time / Part-time",
    startingSalary: "₹8–25 LPA",
    hiringPartners: 180,
  },
];

export function getPublicProgram(
  programId: string,
): PublicProgramDef | undefined {
  return PUBLIC_PROGRAMS.find((p) => p.id === programId);
}

// ============================================================
// 18 specialization role routes & trackKey mapping.
// ============================================================

export interface RoleRouteDef {
  /** Route key after "programs/" */
  roleView: string;
  /** Matching trackKey in PROGRAM_TRACKS */
  trackKey: string;
  /** Owning program id (one of PUBLIC_PROGRAMS) */
  programId: PublicProgramDef["id"];
  /** Role display label */
  label: string;
  /** Accent color (per-role secondary accent) */
  color: string;
  /** Short badge / specialization tag */
  badge: string;
  /** Short motivation copy */
  motive: string;
}

export const ROLE_ROUTES: RoleRouteDef[] = [
  // FDE-FWD roles — note route uses "fde-" prefix but trackKey uses "fde-fwd-"
  {
    roleView: "fde-fullstack-engineer", trackKey: "fde-fwd-fullstack-engineer",
    programId: "fde-forward-deployment", label: "Forward Deployed Full-Stack Engineer",
    color: "#0EA5E9", badge: "Full-Stack + Deploy",
    motive: "Build & ship full-stack apps with React, Node.js & GraphQL to production.",
  },
  {
    roleView: "fde-ai-engineer", trackKey: "fde-fwd-ai-engineer",
    programId: "fde-forward-deployment", label: "Forward Deployed AI Engineer",
    color: "#8B5CF6", badge: "AI + MLOps",
    motive: "Design intelligent systems that power real products.",
  },
  {
    roleView: "fde-data-engineer", trackKey: "fde-fwd-data-engineer",
    programId: "fde-forward-deployment", label: "Forward Deployed Data Engineer",
    color: "#10B981", badge: "Data + Analytics",
    motive: "Architect data pipelines that drive business decisions.",
  },
  {
    roleView: "fde-cloud-engineer", trackKey: "fde-fwd-cloud-engineer",
    programId: "fde-forward-deployment", label: "Forward Deployed Cloud Engineer",
    color: "#F97316", badge: "Cloud + Infra",
    motive: "Architect cloud-native systems on AWS, GCP & Azure that scale to millions.",
  },
  {
    roleView: "fde-ml-engineer", trackKey: "fde-fwd-ml-engineer",
    programId: "fde-forward-deployment", label: "Forward Deployed ML Engineer",
    color: "#EF4444", badge: "ML + Ops",
    motive: "Deploy, monitor & scale ML models in production for real clients.",
  },
  {
    roleView: "fde-security-engineer", trackKey: "fde-fwd-security-engineer",
    programId: "fde-forward-deployment", label: "Forward Deployed Security Engineer",
    color: "#D4A017", badge: "Security + DevSecOps",
    motive: "Protect critical systems from real-world threats.",
  },
  // FDE roles — route === trackKey (fse-*)
  {
    roleView: "fse-software-engineer", trackKey: "fse-software-engineer",
    programId: "fde-program", label: "Full Stack Software Engineer",
    color: "#0EA5E9", badge: "Frontend + Backend",
    motive: "Craft beautiful, scalable applications from scratch.",
  },
  {
    roleView: "fse-ai-engineer", trackKey: "fse-ai-engineer",
    programId: "fde-program", label: "Full Stack AI Engineer",
    color: "#8B5CF6", badge: "AI Integration",
    motive: "Integrate AI into real-world applications.",
  },
  {
    roleView: "fse-product-engineer", trackKey: "fse-product-engineer",
    programId: "fde-program", label: "Full Stack Product Engineer",
    color: "#10B981", badge: "Product Thinking",
    motive: "Think like a PM, build like an engineer.",
  },
  {
    roleView: "fse-saas-engineer", trackKey: "fse-saas-engineer",
    programId: "fde-program", label: "Full Stack SaaS Engineer",
    color: "#F97316", badge: "SaaS + Multi-tenant",
    motive: "Master multi-tenant architecture & SaaS products.",
  },
  {
    roleView: "fse-cloud-engineer", trackKey: "fse-cloud-engineer",
    programId: "fde-program", label: "Full Stack Cloud Engineer",
    color: "#EF4444", badge: "Cloud + DevOps",
    motive: "Deploy & manage apps across AWS, GCP & Azure.",
  },
  {
    roleView: "fse-enterprise-engineer", trackKey: "fse-enterprise-engineer",
    programId: "fde-program", label: "Full Stack Enterprise Engineer",
    color: "#D4A017", badge: "Enterprise Scale",
    motive: "Tackle large-scale systems serving millions of users.",
  },
  // DSAI roles — route === trackKey
  {
    roleView: "dsai-digital-sales-specialist", trackKey: "dsai-digital-sales-specialist",
    programId: "dsai-program", label: "Digital Sales & AI Marketing Specialist",
    color: "#0EA5E9", badge: "Sales + AI Marketing",
    motive: "Close deals faster with AI-powered sales strategies.",
  },
  {
    roleView: "dsai-ai-ma-growth-specialist", trackKey: "dsai-ai-ma-growth-specialist",
    programId: "dsai-program", label: "AI Marketing Automation & Growth Specialist",
    color: "#8B5CF6", badge: "Automation + Growth",
    motive: "Automate growth with intelligent marketing systems.",
  },
  {
    roleView: "dsai-marketing-automation-engineer", trackKey: "dsai-marketing-automation-engineer",
    programId: "dsai-program", label: "AI Marketing Solutions & Automation Engineer",
    color: "#10B981", badge: "Marketing + Engineering",
    motive: "Build the tools that power modern marketing.",
  },
  {
    roleView: "dsai-sales-marketing-agents", trackKey: "dsai-sales-marketing-agents",
    programId: "dsai-program", label: "AI Sales, Marketing & Agents Engineer",
    color: "#F97316", badge: "Sales + AI Agents",
    motive: "Create AI agents that sell & market autonomously.",
  },
  {
    roleView: "dsai-revenue-growth-engineer", trackKey: "dsai-revenue-growth-engineer",
    programId: "dsai-program", label: "AI Revenue & Growth Engineer",
    color: "#EF4444", badge: "Revenue + Growth",
    motive: "Engineer AI systems that maximize revenue.",
  },
  {
    roleView: "dsai-customer-solutions-engineer", trackKey: "dsai-customer-solutions-engineer",
    programId: "dsai-program", label: "AI Customer Solutions & Automation Engineer",
    color: "#D4A017", badge: "Customer + AI + Auto",
    motive: "Delight customers with AI-powered support systems.",
  },
  // CDM roles — route === trackKey (cdm-*)
  {
    roleView: "cdm-cloud-infrastructure-engineer", trackKey: "cdm-cloud-infrastructure-engineer",
    programId: "cdm-program", label: "Cloud Infrastructure Engineer",
    color: "#0EA5E9", badge: "Cloud + Arch",
    motive: "Architect cloud-native systems on AWS, Azure & GCP.",
  },
  {
    roleView: "cdm-devops-engineer", trackKey: "cdm-devops-engineer",
    programId: "cdm-program", label: "DevOps Engineer",
    color: "#8B5CF6", badge: "CI/CD + Auto",
    motive: "Automate the entire build-test-deploy lifecycle.",
  },
  {
    roleView: "cdm-mlops-engineer", trackKey: "cdm-mlops-engineer",
    programId: "cdm-program", label: "MLOps Engineer",
    color: "#10B981", badge: "ML + Ops",
    motive: "Deploy, monitor & scale ML models in production.",
  },
  {
    roleView: "cdm-sre-engineer", trackKey: "cdm-sre-engineer",
    programId: "cdm-program", label: "Site Reliability Engineer",
    color: "#F97316", badge: "Reliability + SRE",
    motive: "Keep critical systems running at 99.99% uptime.",
  },
  {
    roleView: "cdm-kubernetes-engineer", trackKey: "cdm-kubernetes-engineer",
    programId: "cdm-program", label: "Kubernetes & Container Engineer",
    color: "#EF4444", badge: "K8s + Containers",
    motive: "Orchestrate containers at enterprise scale.",
  },
  {
    roleView: "cdm-platform-cicd-engineer", trackKey: "cdm-platform-cicd-engineer",
    programId: "cdm-program", label: "Platform & CI/CD Engineer",
    color: "#D4A017", badge: "Platform + Pipelines",
    motive: "Build internal developer platforms that teams love.",
  },
  // GAA roles — route === trackKey (gaa-*)
  {
    roleView: "gaa-llm-application-engineer", trackKey: "gaa-llm-application-engineer",
    programId: "gaa-program", label: "LLM Application Engineer",
    color: "#0EA5E9", badge: "LLM + RAG",
    motive: "Build production apps with LLMs, RAG & LangChain.",
  },
  {
    roleView: "gaa-ai-agents-engineer", trackKey: "gaa-ai-agents-engineer",
    programId: "gaa-program", label: "AI Agents Engineer",
    color: "#8B5CF6", badge: "Multi-Agent + Autonomy",
    motive: "Build autonomous AI agents with CrewAI & AutoGen.",
  },
  {
    roleView: "gaa-generative-ai-engineer", trackKey: "gaa-generative-ai-engineer",
    programId: "gaa-program", label: "Generative AI Engineer",
    color: "#10B981", badge: "GenAI + Multimodal",
    motive: "Create with GPT, DALL-E, Stable Diffusion & video models.",
  },
  {
    roleView: "gaa-ai-automation-engineer", trackKey: "gaa-ai-automation-engineer",
    programId: "gaa-program", label: "AI Automation Engineer",
    color: "#F97316", badge: "Automation + Workflows",
    motive: "Automate business workflows with AI-powered agentic pipelines.",
  },
  {
    roleView: "gaa-conversational-ai-engineer", trackKey: "gaa-conversational-ai-engineer",
    programId: "gaa-program", label: "Conversational AI Engineer",
    color: "#EF4444", badge: "Chat + Voice",
    motive: "Build chatbots, voice assistants & dialog systems.",
  },
  {
    roleView: "gaa-ai-product-engineer", trackKey: "gaa-ai-product-engineer",
    programId: "gaa-program", label: "AI Product Engineer",
    color: "#D4A017", badge: "Product + Integration",
    motive: "Build AI-first products from idea to production.",
  },
];

export function getRoleRoute(roleView: string): RoleRouteDef | undefined {
  return ROLE_ROUTES.find((r) => r.roleView === roleView);
}

export function getProgramTrackByRoleView(
  roleView: string,
): ProgramTrackInfo | null {
  const route = getRoleRoute(roleView);
  if (!route) return null;
  // Direct lookup in PROGRAM_TRACKS by trackKey
  for (const track of Object.values(PROGRAM_TRACKS)) {
    if (track.trackKey === route.trackKey) return track;
  }
  return null;
}

export function getRolesForProgram(
  programId: string,
): RoleRouteDef[] {
  return ROLE_ROUTES.filter((r) => r.programId === programId);
}

// Helper to assemble a role route key for navigation
export function roleRouteKey(roleView: string): string {
  return `programs/${roleView}`;
}
