"use client";

import * as React from "react";
import Image from "next/image";
import { useNav } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Menu, Search, Sun, Moon, ChevronDown, Briefcase, Building2,
  GraduationCap, Handshake,
  Newspaper, Target, Cpu, Rocket, Megaphone, BookOpen, Phone, Eye,
  Award, UserCheck, Layers, Globe, ClipboardCheck, Users, TrendingUp,
  Factory, Brain, Code2, Database, Cloud, Box, Bot, Compass,
  ChevronRight, CheckCircle2, type LucideIcon,
  Clock, Landmark, Star, ShieldCheck, Home, MapPin, BarChart3,
  FileText, Mic, Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { serviceCategories } from "@/data/servicesData";

// ============================================================
// NAVIGATION CONFIG DATA
// ============================================================

interface NavRole { label: string; view: string; color: string; badge: string; motive: string[] }
interface NavProgram {
  label: string; view: string; tag: string; color: string; desc: string;
  icon: LucideIcon; highlights: string[]; roles: NavRole[];
}

const PROGRAM_GROUPS: NavProgram[] = [
  {
    label: "Forward Deployed Engineer",
    view: "programs/fde-forward-deployment",
    tag: "FDE-FWD",
    color: "#F59E0B",
    desc: "24-week flagship. Build, deploy & operate production systems across web, mobile, cloud, AI & MLOps.",
    icon: Rocket,
    highlights: [
      "Ship real products to production, not just assignments",
      "Work on live client projects from week 4 onwards",
      "Master AI, cloud, DevOps & full-stack in one program",
      "Get placed with top tech companies across India",
      "Earn while you learn with paid internships built-in",
      "6 specialization tracks to match your career goals",
    ],
    roles: [
      { label: "Full-Stack Engineer", view: "programs/fde-fullstack-engineer", color: "#0EA5E9", badge: "Full-Stack + Deploy", motive: ["Build & ship full-stack apps with React, Node.js & GraphQL to production.", "Master end-to-end deployment with real clients."] },
      { label: "AI Engineer", view: "programs/fde-ai-engineer", color: "#8B5CF6", badge: "AI + MLOps", motive: ["Design intelligent systems that power real products.", "Lead AI transformation from prototype to production."] },
      { label: "Data Engineer", view: "programs/fde-data-engineer", color: "#10B981", badge: "Data + Analytics", motive: ["Architect data pipelines that drive business decisions.", "Turn raw data into actionable intelligence."] },
      { label: "Cloud Engineer", view: "programs/fde-cloud-engineer", color: "#F97316", badge: "Cloud + Infra", motive: ["Architect cloud-native systems on AWS, GCP & Azure.", "Design infrastructure that scales to millions of users."] },
      { label: "ML Engineer", view: "programs/fde-ml-engineer", color: "#EF4444", badge: "ML + Ops", motive: ["Deploy, monitor & scale ML models in production.", "Bridge the gap between data science and engineering."] },
      { label: "Security Engineer", view: "programs/fde-security-engineer", color: "#D4A017", badge: "Security + DevSecOps", motive: ["Protect critical systems from real-world threats.", "Become the guardian of digital infrastructure."] },
    ],
  },
  {
    label: "Fullstack Development Engineering",
    view: "programs/fde-program",
    tag: "FDE",
    color: "#0EA5E9",
    desc: "24-week intensive. Master React, Next.js, Node.js, PostgreSQL & production apps.",
    icon: GraduationCap,
    highlights: [
      "Go from zero to a production-ready full-stack developer",
      "Build 12+ real-world projects for your portfolio",
      "Master React, Next.js, Node.js, PostgreSQL & more",
      "Get direct placement support with 200+ hiring partners",
      "Learn product thinking, not just coding skills",
      "6 specialized paths: AI, SaaS, Cloud, Enterprise & more",
    ],
    roles: [
      { label: "Software Engineer", view: "programs/fse-software-engineer", color: "#0EA5E9", badge: "Frontend + Backend", motive: ["Craft beautiful, scalable applications from scratch.", "Build the skills top companies demand."] },
      { label: "AI Engineer", view: "programs/fse-ai-engineer", color: "#8B5CF6", badge: "AI Integration", motive: ["Integrate AI into real-world applications.", "Become the developer who bridges code and intelligence."] },
      { label: "Product Engineer", view: "programs/fse-product-engineer", color: "#10B981", badge: "Product Thinking", motive: ["Think like a PM, build like an engineer.", "Shape products that users love from ideation to launch."] },
      { label: "SaaS Engineer", view: "programs/fse-saas-engineer", color: "#F97316", badge: "SaaS + Multi-tenant", motive: ["Master multi-tenant architecture & SaaS products.", "Build applications that scale globally."] },
      { label: "Cloud Engineer", view: "programs/fse-cloud-engineer", color: "#EF4444", badge: "Cloud + DevOps", motive: ["Deploy & manage apps across AWS, GCP & Azure.", "Become the cloud expert every team needs."] },
      { label: "Enterprise Engineer", view: "programs/fse-enterprise-engineer", color: "#D4A017", badge: "Enterprise Scale", motive: ["Tackle large-scale systems serving millions of users.", "Build enterprise-grade applications that matter."] },
    ],
  },
  {
    label: "Digital Sales & AI Marketing / AI Engineering",
    view: "programs/dsai-program",
    tag: "DSAI",
    color: "#8B5CF6",
    desc: "20-week program. AI-powered marketing, automation & AI engineering.",
    icon: Megaphone,
    highlights: [
      "Master AI-powered sales, marketing & automation",
      "Build AI agents that sell and market autonomously",
      "Drive real revenue growth with data-driven strategies",
      "Get certified in the fastest-growing tech domain",
      "Hands-on with 10+ marketing automation tools & platforms",
      "6 career paths from sales to AI engineering",
    ],
    roles: [
      { label: "Digital Sales & AI Marketing Specialist", view: "programs/dsai-digital-sales-specialist", color: "#0EA5E9", badge: "Sales + AI Marketing", motive: ["Close deals faster with AI-powered sales strategies.", "Become a revenue-driving digital sales leader."] },
      { label: "AI Marketing Automation & Growth", view: "programs/dsai-ai-ma-growth-specialist", color: "#8B5CF6", badge: "Automation + Growth", motive: ["Automate growth with intelligent marketing systems.", "Scale campaigns that convert using AI."] },
      { label: "Marketing Solutions & Automation Engineer", view: "programs/dsai-marketing-automation-engineer", color: "#10B981", badge: "Marketing + Engineering", motive: ["Build the tools that power modern marketing.", "Engineer automation that drives measurable results."] },
      { label: "AI Sales, Marketing & Agents Engineer", view: "programs/dsai-sales-marketing-agents", color: "#F97316", badge: "Sales + AI Agents", motive: ["Create AI agents that sell & market autonomously.", "Build the future of intelligent business automation."] },
      { label: "AI Revenue & Growth Engineer", view: "programs/dsai-revenue-growth-engineer", color: "#EF4444", badge: "Revenue + Growth", motive: ["Engineer AI systems that maximize revenue.", "Drive explosive growth with data-driven strategies."] },
      { label: "AI Customer Solutions & Automation", view: "programs/dsai-customer-solutions-engineer", color: "#D4A017", badge: "Customer + AI + Auto", motive: ["Delight customers with AI-powered support systems.", "Build automated solutions that retain & grow users."] },
    ],
  },
  {
    label: "Cloud, DevOps & MLOps",
    view: "programs/cdm-program",
    tag: "CDM",
    color: "#10B981",
    desc: "22-week program. Master cloud infrastructure, DevOps automation, Kubernetes & MLOps — ship & scale production systems.",
    icon: Cloud,
    highlights: [
      "Master AWS, Azure & GCP cloud architectures end-to-end",
      "Build CI/CD pipelines that ship code with confidence",
      "Automate infrastructure with Terraform, Ansible & IaC",
      "Deploy & operate ML models in production with MLOps",
      "Run Kubernetes at scale — from clusters to service mesh",
      "6 career paths from cloud engineer to MLOps architect",
    ],
    roles: [
      { label: "Cloud Infrastructure Engineer", view: "programs/cdm-cloud-infrastructure-engineer", color: "#0EA5E9", badge: "Cloud + Arch", motive: ["Architect cloud-native systems on AWS, Azure & GCP.", "Design infrastructure that scales to millions of users."] },
      { label: "DevOps Engineer", view: "programs/cdm-devops-engineer", color: "#8B5CF6", badge: "CI/CD + Auto", motive: ["Automate the entire build-test-deploy lifecycle.", "Become the engineer who ships 10x faster."] },
      { label: "MLOps Engineer", view: "programs/cdm-mlops-engineer", color: "#10B981", badge: "ML + Ops", motive: ["Deploy, monitor & scale ML models in production.", "Bridge the gap between data science and engineering."] },
      { label: "Site Reliability Engineer", view: "programs/cdm-sre-engineer", color: "#F97316", badge: "Reliability + SRE", motive: ["Keep critical systems running at 99.99% uptime.", "Master observability, incident response & chaos engineering."] },
      { label: "Kubernetes & Container Engineer", view: "programs/cdm-kubernetes-engineer", color: "#EF4444", badge: "K8s + Containers", motive: ["Orchestrate containers at enterprise scale.", "Build self-healing, auto-scaling platforms on Kubernetes."] },
      { label: "Platform & CI/CD Engineer", view: "programs/cdm-platform-cicd-engineer", color: "#D4A017", badge: "Platform + Pipelines", motive: ["Build internal developer platforms that teams love.", "Design pipelines that make shipping effortless."] },
    ],
  },
  {
    label: "Gen AI & Agentic Automation Engineer",
    view: "programs/gaa-program",
    tag: "GAA",
    color: "#8B5CF6",
    desc: "20-week program. Master LLMs, AI agents, generative AI & agentic automation — build autonomous systems that work.",
    icon: Bot,
    highlights: [
      "Master LLMs, RAG, prompt engineering & LangChain end-to-end",
      "Build autonomous AI agents with CrewAI, AutoGen & multi-agent systems",
      "Create generative AI apps — text, image, video & code generation",
      "Automate business workflows with AI-powered agentic pipelines",
      "Ship production AI products with monitoring, guardrails & evaluation",
      "6 career paths from LLM engineer to AI automation architect",
    ],
    roles: [
      { label: "LLM Application Engineer", view: "programs/gaa-llm-application-engineer", color: "#0EA5E9", badge: "LLM + RAG", motive: ["Build production apps with LLMs, RAG & LangChain.", "Master prompt engineering, function calling & fine-tuning."] },
      { label: "AI Agents Engineer", view: "programs/gaa-ai-agents-engineer", color: "#8B5CF6", badge: "Multi-Agent + Autonomy", motive: ["Build autonomous AI agents with CrewAI & AutoGen.", "Design multi-agent systems that solve complex tasks end-to-end."] },
      { label: "Generative AI Engineer", view: "programs/gaa-generative-ai-engineer", color: "#10B981", badge: "GenAI + Multimodal", motive: ["Create with GPT, DALL-E, Stable Diffusion & video models.", "Master text, image, video & code generation pipelines."] },
      { label: "AI Automation Engineer", view: "programs/gaa-ai-automation-engineer", color: "#F97316", badge: "Automation + Workflows", motive: ["Automate business workflows with AI-powered agentic pipelines.", "Connect tools, APIs & LLMs to eliminate repetitive work."] },
      { label: "Conversational AI Engineer", view: "programs/gaa-conversational-ai-engineer", color: "#EF4444", badge: "Chat + Voice", motive: ["Build chatbots, voice assistants & dialog systems.", "Master NLP, speech-to-text, text-to-speech & conversation design."] },
      { label: "AI Product Engineer", view: "programs/gaa-ai-product-engineer", color: "#D4A017", badge: "Product + Integration", motive: ["Build AI-first products from idea to production.", "Integrate AI into existing products with measurable impact."] },
    ],
  },
];

const TALENT_SEGMENTS: {
  segmentLabel: string; segmentColor: string; isHorizontal?: boolean;
  items: { label: string; view: string; icon: LucideIcon; desc: string; color: string; badge: string }[]
}[] = [
  {
    segmentLabel: "Talent Development",
    segmentColor: "#0EA5E9",
    items: [
      { label: "Train to Hire", view: "talent/talent-train-to-hire", icon: GraduationCap, desc: "Upskill fresh talent through industry-aligned training before they join your team.", color: "#0EA5E9", badge: "Training + Placement" },
      { label: "Hire to Train", view: "talent/talent-hire-to-train", icon: UserCheck, desc: "Hire promising candidates and we train them to meet your specific requirements.", color: "#8B5CF6", badge: "Hire + Upskill" },
      { label: "Corporate Training", view: "talent/talent-corporate-training", icon: Award, desc: "Custom corporate training programs designed to upskill your existing workforce.", color: "#F97316", badge: "Enterprise Training" },
    ],
  },
  {
    segmentLabel: "Workforce Solutions",
    segmentColor: "#10B981",
    items: [
      { label: "Sourcing & Recruitment", view: "talent/talent-sourcing-recruitment", icon: Search, desc: "AI-powered talent sourcing from 2M+ candidates. Find the right fit fast.", color: "#0EA5E9", badge: "Talent Sourcing" },
      { label: "Flexible Deployment", view: "talent/talent-flexible-deployment", icon: Layers, desc: "Deploy talent flexibly — contract, project-based, or on-demand staffing.", color: "#10B981", badge: "On-Demand Talent" },
      { label: "End-to-End Workforce", view: "talent/talent-end-to-end-workforce", icon: Globe, desc: "Complete workforce management from hiring to retention, one partner.", color: "#8B5CF6", badge: "Full Lifecycle" },
    ],
  },
  {
    segmentLabel: "Assessment & Placements",
    segmentColor: "#F97316",
    items: [
      { label: "Talent Assessment", view: "talent/talent-assessment", icon: ClipboardCheck, desc: "AI-powered assessments to evaluate technical skills, aptitude, and cultural fit.", color: "#EF4444", badge: "AI Assessment" },
      { label: "Staffing Solutions", view: "talent/talent-staffing", icon: Users, desc: "Flexible staffing models — contract, permanent, or project-based — to scale your team.", color: "#10B981", badge: "Flexible Staffing" },
      { label: "Placements", view: "placements", icon: TrendingUp, desc: "Explore placement opportunities and connect with top employers across industries.", color: "#D4A017", badge: "Career Placement" },
    ],
  },
  {
    segmentLabel: "Get Started",
    segmentColor: "#D4A017",
    isHorizontal: true,
    items: [
      { label: "Register as Candidate", view: "candidate/overview", icon: GraduationCap, desc: "Access 10,000+ job opportunities with AI-powered matching.", color: "#0EA5E9", badge: "Job Seeker" },
      { label: "Register as Employer", view: "employer/overview", icon: Building2, desc: "Start hiring from 50,000+ verified candidates.", color: "#8B5CF6", badge: "Hire Talent" },
      { label: "Professional Services", view: "professional-services", icon: BookOpen, desc: "Career assessment, resume building, interview coaching, and 8 professional services.", color: "#D4A017", badge: "8 Services" },
    ],
  },
];

const RESOURCES_SUB: { label: string; view: string; icon: React.ReactNode; desc: string }[] = [
  { label: "About Us", view: "about", icon: <Building2 className="h-5 w-5" />, desc: "Learn about our mission, values, and the team driving innovation." },
  { label: "Contact", view: "contact", icon: <Phone className="h-5 w-5" />, desc: "Get in touch with our team for inquiries and support." },
  { label: "Vision & Mission", view: "vision-mission", icon: <Eye className="h-5 w-5" />, desc: "Discover our vision for the future and mission to transform industries." },
  { label: "Academy & Training", view: "academy-training", icon: <GraduationCap className="h-5 w-5" />, desc: "Comprehensive training programs for individuals and enterprises." },
  { label: "Become a Sales Agent", view: "become-sales-agent", icon: <Megaphone className="h-5 w-5" />, desc: "Join our sales network and earn attractive commissions." },
  { label: "Industries Experience", view: "industries-experience", icon: <Factory className="h-5 w-5" />, desc: "Explore our deep expertise across diverse industry verticals." },
  { label: "Partner with Us", view: "partner-with-us", icon: <Handshake className="h-5 w-5" />, desc: "Build strategic partnerships for mutual growth and innovation." },
  { label: "Become a Tech Consultant", view: "become-tech-consultant", icon: <Brain className="h-5 w-5" />, desc: "Leverage your expertise to solve complex challenges for enterprises." },
];

const catIconMap: Record<string, LucideIcon> = {
  Brain, Megaphone, Bot, Box, Code2, Database, Cloud, Cpu, Compass,
};

const TECH_AI_CAT_SEGMENTS: { segmentLabel: string; color: string; slugs: string[] }[] = [
  { segmentLabel: "AI & Intelligence", color: "#0EA5E9", slugs: ["ai-powered-business-solutions", "ai-agentic-automation", "ai-ml-model-development"] },
  { segmentLabel: "Digital & Engineering", color: "#8B5CF6", slugs: ["digital-sales-ai-marketing", "custom-software-development", "data-engineering-analytics"] },
  { segmentLabel: "Infrastructure & Strategy", color: "#10B981", slugs: ["cloud-infrastructure-devops", "open-source-deployment", "digital-transformation-consulting"] },
];

// Helper: navigate to a public route
function useGo() {
  const { navigate } = useNav();
  return React.useCallback((view: string) => {
    // "candidate/overview" and "employer/overview" cross-portal links
    if (view.includes("/") && ["candidate", "employer", "recruiter", "training", "partner", "admin", "agency", "enterprise", "learner"].includes(view.split("/")[0])) {
      const [portal, ...rest] = view.split("/");
      navigate(portal as any, rest.join("/") || "overview");
    } else {
      navigate("public", view);
    }
  }, [navigate]);
}

// ============================================================
// MEGA DROPDOWN: PROGRAMS (two-panel)
// ============================================================
function ProgramsDropdown({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const activeViews = ["programs", ...PROGRAM_GROUPS.flatMap(p => [p.view, ...p.roles.map(r => r.view)])];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { setOpen(false); setHoveredIdx(null); }}
    >
      <button
        onClick={() => go("programs")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
          activeViews.some(v => v === "programs" + (hoveredIdx !== null ? "" : "")) ? "text-brand" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <GraduationCap className="h-4 w-4 opacity-70" />
        <span>Programs</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 flex pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))" }}>
          {/* Left panel: programs list */}
          <div className="w-[420px] rounded-l-xl border bg-popover p-4">
            <div className="grid grid-cols-1 gap-2">
              {PROGRAM_GROUPS.map((prog, idx) => {
                const ProgIcon = prog.icon;
                const isHovered = hoveredIdx === idx;
                return (
                  <button
                    key={prog.view}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onClick={() => { go(prog.view); setOpen(false); }}
                    className="flex items-center gap-3 rounded-lg border border-transparent p-3 text-left transition-all hover:shadow-sm"
                    style={{ background: isHovered ? `${prog.color}10` : "transparent", borderColor: isHovered ? `${prog.color}30` : "transparent" }}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${prog.color}18`, color: prog.color }}>
                      <ProgIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: isHovered ? prog.color : "hsl(var(--foreground))" }}>{prog.label}</span>
                        <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${prog.color}18`, color: prog.color }}>{prog.tag}</span>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{prog.desc}</p>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 flex-shrink-0 transition-all", isHovered ? "translate-x-0.5 opacity-100" : "opacity-0")} style={{ color: prog.color }} />
                  </button>
                );
              })}
            </div>
            {hoveredIdx !== null && (
              <div className="mt-3 border-t pt-3" style={{ borderColor: `${PROGRAM_GROUPS[hoveredIdx].color}25` }}>
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider" style={{ color: PROGRAM_GROUPS[hoveredIdx].color }}>
                  Why Join {PROGRAM_GROUPS[hoveredIdx].tag}?
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {PROGRAM_GROUPS[hoveredIdx].highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: PROGRAM_GROUPS[hoveredIdx].color }} />
                      <span className="text-xs leading-snug text-muted-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between border-t pt-2.5">
              <span className="text-xs text-muted-foreground">5 programs · 30 specializations</span>
              <button onClick={() => { go("programs"); setOpen(false); }} className="rounded-md bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20">
                View All →
              </button>
            </div>
          </div>
          {/* Right panel: roles */}
          {hoveredIdx !== null && (() => {
            const prog = PROGRAM_GROUPS[hoveredIdx];
            return (
              <div className="flex w-[380px] flex-col rounded-r-xl border border-l-0 bg-popover p-4">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${prog.color}18`, color: prog.color }}>
                    <prog.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold">{prog.label}</h3>
                    <p className="text-xs text-muted-foreground">{prog.roles.length} specializations</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-1.5 overflow-y-auto pr-1" style={{ maxHeight: "340px" }}>
                  {prog.roles.map((role) => (
                    <button
                      key={role.view}
                      onClick={() => { go(role.view); setOpen(false); }}
                      className="flex items-start gap-2.5 rounded-lg border border-transparent p-2.5 text-left transition-all hover:shadow-sm"
                      style={{ background: `${role.color}08` }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${role.color}12`; e.currentTarget.style.borderColor = `${role.color}25`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = `${role.color}08`; e.currentTarget.style.borderColor = "transparent"; }}
                    >
                      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: role.color }} />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold" style={{ color: role.color }}>{role.label}</span>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{role.motive[0]}</p>
                        <p className="mt-0.5 truncate text-[11px] font-medium" style={{ color: role.color }}>{role.motive[1]}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { go(prog.view); setOpen(false); }}
                  className="mt-2.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors"
                  style={{ background: `${prog.color}10`, color: prog.color, borderColor: `${prog.color}30` }}
                >
                  View Full Program →
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MEGA DROPDOWN: PRO SERVICES (two-panel — 6 categories merging ALL 9 tech-ai + 8 professional services = 68 services)
// ============================================================
const PRO_SERVICE_CATEGORIES = [
  {
    key: "ai-intelligence",
    label: "AI & Intelligence",
    tagline: "Make machines work for you",
    desc: "AI business solutions, agentic automation & custom ML models that turn data into decisions.",
    icon: Brain,
    color: "#0EA5E9",
    services: [
      { catSlug: "ai-powered-business-solutions", slug: "ai-business-process-automation", name: "AI Business Process Automation", desc: "Automate repetitive workflows with AI." },
      { catSlug: "ai-powered-business-solutions", slug: "ai-customer-support-solutions", name: "AI Customer Support Solutions", desc: "24/7 intelligent support agents." },
      { catSlug: "ai-powered-business-solutions", slug: "ai-document-intelligence", name: "AI Document Intelligence", desc: "Extract & understand any document." },
      { catSlug: "ai-powered-business-solutions", slug: "ai-knowledge-management", name: "AI Knowledge Management", desc: "Turn scattered info into a brain." },
      { catSlug: "ai-powered-business-solutions", slug: "ai-voice-chat-assistants", name: "AI Voice & Chat Assistants", desc: "Conversational AI that feels human." },
      { catSlug: "ai-powered-business-solutions", slug: "enterprise-ai-integration", name: "Enterprise AI Integration", desc: "Embed AI into your stack, end-to-end." },
      { catSlug: "ai-agentic-automation", slug: "custom-ai-agents", name: "Custom AI Agents", desc: "Autonomous agents that get things done." },
      { catSlug: "ai-agentic-automation", slug: "multi-agent-systems", name: "Multi-Agent Systems", desc: "Swarm intelligence for complex tasks." },
      { catSlug: "ai-agentic-automation", slug: "ai-workflow-automation", name: "AI Workflow Automation", desc: "Connect tools, automate the busywork." },
      { catSlug: "ai-ml-model-development", slug: "machine-learning", name: "Machine Learning", desc: "Predictive models tailored to your data." },
      { catSlug: "ai-ml-model-development", slug: "llm-development", name: "LLM Development", desc: "Custom large-language-model solutions." },
      { catSlug: "ai-ml-model-development", slug: "computer-vision", name: "Computer Vision", desc: "See, detect & classify from images." },
      { catSlug: "ai-ml-model-development", slug: "nlp-solutions", name: "NLP Solutions", desc: "Understand & generate human language." },
      { catSlug: "ai-ml-model-development", slug: "model-fine-tuning", name: "Model Fine-Tuning", desc: "Tune foundation models for your domain." },
    ],
  },
  {
    key: "build-engineer",
    label: "Build & Engineer",
    tagline: "Ship products, not prototypes",
    desc: "Custom software, mobile apps, SaaS platforms & data pipelines engineered for scale.",
    icon: Code2,
    color: "#8B5CF6",
    services: [
      { catSlug: "custom-software-development", slug: "enterprise-web-applications", name: "Enterprise Web Applications", desc: "Robust web apps built for scale." },
      { catSlug: "custom-software-development", slug: "saas-development", name: "SaaS Development", desc: "Multi-tenant SaaS, end-to-end." },
      { catSlug: "custom-software-development", slug: "mobile-apps", name: "Mobile Apps", desc: "iOS + Android, one codebase." },
      { catSlug: "custom-software-development", slug: "erp-crm-development", name: "ERP & CRM Development", desc: "Custom ERPs & CRMs that fit you." },
      { catSlug: "custom-software-development", slug: "api-development-integration", name: "API Development & Integration", desc: "Connect everything, reliably." },
      { catSlug: "custom-software-development", slug: "legacy-modernization", name: "Legacy Modernization", desc: "Bring old systems into the modern era." },
      { catSlug: "data-engineering-analytics", slug: "data-warehousing", name: "Data Warehousing", desc: "A single source of truth." },
      { catSlug: "data-engineering-analytics", slug: "etl-elt", name: "ETL / ELT", desc: "Move & transform data at scale." },
      { catSlug: "data-engineering-analytics", slug: "bi-dashboards", name: "BI Dashboards", desc: "See your business in real time." },
      { catSlug: "data-engineering-analytics", slug: "real-time-analytics", name: "Real-Time Analytics", desc: "Decisions powered by live data." },
      { catSlug: "data-engineering-analytics", slug: "predictive-analytics", name: "Predictive Analytics", desc: "See what's coming before it arrives." },
    ],
  },
  {
    key: "cloud-deploy",
    label: "Cloud & Deploy",
    tagline: "Infrastructure that scales itself",
    desc: "Cloud migration, DevOps, Kubernetes & open-source platform deployment — built to scale.",
    icon: Cloud,
    color: "#10B981",
    services: [
      { catSlug: "cloud-infrastructure-devops", slug: "cloud-migration", name: "Cloud Migration", desc: "Move to the cloud, zero downtime." },
      { catSlug: "cloud-infrastructure-devops", slug: "kubernetes", name: "Kubernetes", desc: "Container orchestration done right." },
      { catSlug: "cloud-infrastructure-devops", slug: "ci-cd-automation", name: "CI/CD Automation", desc: "Ship code with confidence." },
      { catSlug: "cloud-infrastructure-devops", slug: "infrastructure-as-code", name: "Infrastructure as Code", desc: "Reproducible infra, every time." },
      { catSlug: "cloud-infrastructure-devops", slug: "cloud-security", name: "Cloud Security", desc: "Lock down your cloud, end-to-end." },
      { catSlug: "cloud-infrastructure-devops", slug: "managed-devops", name: "Managed DevOps", desc: "We run your DevOps, you ship." },
      { catSlug: "open-source-deployment", slug: "self-hosted-ai-platform-deployment", name: "Self-Hosted AI Platform", desc: "Your own AI, your own cloud." },
      { catSlug: "open-source-deployment", slug: "erp-portal-deployment", name: "ERP & Portal Deployment", desc: "Open-source ERPs, deployed fast." },
      { catSlug: "open-source-deployment", slug: "devops-platform-deployment", name: "DevOps Platform Deployment", desc: "Full DevOps stack, set up for you." },
      { catSlug: "open-source-deployment", slug: "private-cloud-deployment", name: "Private Cloud Deployment", desc: "Your cloud, your rules." },
    ],
  },
  {
    key: "grow-market",
    label: "Grow & Market",
    tagline: "Turn attention into revenue",
    desc: "AI-powered digital marketing, sales automation & lead intelligence that fills your pipeline.",
    icon: Megaphone,
    color: "#F59E0B",
    services: [
      { catSlug: "digital-sales-ai-marketing", slug: "ai-digital-marketing", name: "AI Digital Marketing", desc: "Marketing that learns & optimizes." },
      { catSlug: "digital-sales-ai-marketing", slug: "seo-geo-ai-content-marketing", name: "SEO & GEO AI Content", desc: "Rank higher with AI content." },
      { catSlug: "digital-sales-ai-marketing", slug: "search-engine-social-media-marketing", name: "Search & Social Media Marketing", desc: "Be everywhere your customers are." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-social-media-automation", name: "AI Social Media Automation", desc: "Post, engage & grow on autopilot." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-sales-funnel-automation", name: "AI Sales Funnel Automation", desc: "Funnels that convert themselves." },
      { catSlug: "digital-sales-ai-marketing", slug: "crm-lead-automation", name: "CRM & Lead Automation", desc: "Never let a lead go cold." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-market-research-customer-intelligence", name: "AI Market Research", desc: "Know your market before entering it." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-lead-generation-prospecting", name: "AI Lead Generation", desc: "Find buyers before they find you." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-outbound-sales-outreach", name: "AI Outbound Sales", desc: "Outreach that books meetings." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-account-based-marketing", name: "AI Account-Based Marketing", desc: "Win the accounts that matter." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-paid-advertising-campaign-strategy", name: "AI Paid Advertising", desc: "Ads that spend smarter." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-sales-enablement-revenue-intelligence", name: "AI Sales Enablement", desc: "Equip your team to close more." },
    ],
  },
  {
    key: "transform-strategize",
    label: "Transform & Strategize",
    tagline: "Future-proof your business",
    desc: "Digital transformation consulting, AI strategy & technology architecture that re-architects your business.",
    icon: Compass,
    color: "#EC4899",
    services: [
      { catSlug: "digital-transformation-consulting", slug: "ai-strategy", name: "AI Strategy", desc: "A roadmap for AI, not guesswork." },
      { catSlug: "digital-transformation-consulting", slug: "digital-transformation", name: "Digital Transformation", desc: "Rebuild how you operate." },
      { catSlug: "digital-transformation-consulting", slug: "process-reengineering", name: "Process Reengineering", desc: "Redesign workflows for the AI era." },
      { catSlug: "digital-transformation-consulting", slug: "technology-architecture", name: "Technology Architecture", desc: "A foundation built to last." },
      { catSlug: "digital-transformation-consulting", slug: "it-modernization", name: "IT Modernization", desc: "Bring your tech into today." },
      { catSlug: "digital-transformation-consulting", slug: "ai-governance", name: "AI Governance", desc: "AI that's safe, compliant & trusted." },
    ],
  },
  {
    key: "career-services",
    label: "Career Services",
    tagline: "From lost to hired, fast",
    desc: "8 professional services — career assessment, resume branding, skills, portfolio, AI job matching, mock interviews & more.",
    icon: GraduationCap,
    color: "#EF4444",
    services: [
      { catSlug: "professional", slug: "career-assessment", name: "Career Assessment & Role Matching", desc: "Find your true north with AI." },
      { catSlug: "professional", slug: "resume-branding", name: "Resume, LinkedIn & Personal Branding", desc: "Stand out before you speak." },
      { catSlug: "professional", slug: "skills-readiness", name: "Skills & Career Readiness", desc: "Become the candidate employers want." },
      { catSlug: "professional", slug: "portfolio-development", name: "Portfolio & Real-World Projects", desc: "Turn skills into proof." },
      { catSlug: "professional", slug: "ai-job-matching", name: "AI-Powered Job & Role Matching", desc: "Your AI co-pilot for the right job." },
      { catSlug: "professional", slug: "mock-interviews", name: "Mock Interviews & Interview Prep", desc: "Walk in calm. Walk out hired." },
      { catSlug: "professional", slug: "job-search-strategy", name: "Job Search & Application Strategy", desc: "Get hired faster, not just apply more." },
      { catSlug: "professional", slug: "talent-matching", name: "Talent Matching & Hiring Connections", desc: "Get in front of employers directly." },
    ],
  },
];

function ProServicesDropdown({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [hoveredKey, setHoveredKey] = React.useState<string | null>("ai-intelligence");

  const handleServiceClick = (catSlug: string, svcSlug: string) => {
    if (catSlug === "professional") {
      go(`professional-services/${svcSlug}`);
    } else {
      go(`services/${catSlug}/${svcSlug}`);
    }
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { setOpen(false); setHoveredKey("ai-intelligence"); }}
    >
      <button
        onClick={() => go("professional-services")}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Sparkles className="h-4 w-4 opacity-70" />
        <span>Pro Services</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 flex -translate-x-1/2 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))" }}>
          {/* Left panel: 6 category cards */}
          <div className="w-[400px] rounded-l-xl border bg-popover p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand">All Pro Services</span>
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-bold text-brand">68 services</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {PRO_SERVICE_CATEGORIES.map((cat) => {
                const CatIcon = cat.icon;
                const isHovered = hoveredKey === cat.key;
                return (
                  <button
                    key={cat.key}
                    onMouseEnter={() => setHoveredKey(cat.key)}
                    onClick={() => {
                      if (cat.key === "career-services") go("professional-services");
                      else go(`services/${cat.services[0].catSlug}`);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg border border-transparent p-2.5 text-left transition-all"
                    style={{ background: isHovered ? `${cat.color}10` : "transparent", borderColor: isHovered ? `${cat.color}30` : "transparent" }}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${cat.color}18`, color: cat.color }}>
                      <CatIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold" style={{ color: isHovered ? cat.color : undefined }}>{cat.label}</span>
                        <span className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold" style={{ background: `${cat.color}18`, color: cat.color }}>
                          {cat.services.length}
                        </span>
                      </div>
                      <span className="mt-0.5 block truncate text-[11px] italic text-muted-foreground">{cat.tagline}</span>
                    </div>
                    <ChevronRight className={cn("h-3.5 w-3.5 flex-shrink-0 transition-opacity", isHovered ? "opacity-100" : "opacity-0")} style={{ color: cat.color }} />
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-2.5">
              <span className="text-xs text-muted-foreground">6 categories · 68 services</span>
              <button onClick={() => { go("tech-ai-services"); setOpen(false); }} className="rounded-md bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20">
                Explore all →
              </button>
            </div>
          </div>
          {/* Right panel: services of hovered category */}
          {hoveredKey && (() => {
            const cat = PRO_SERVICE_CATEGORIES.find(c => c.key === hoveredKey);
            if (!cat) return null;
            const CatIcon = cat.icon;
            return (
              <div className="flex w-[460px] flex-col rounded-r-xl border border-l-0 bg-popover p-4">
                <div className="mb-2 flex items-start gap-2.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${cat.color}18`, color: cat.color }}>
                    <CatIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold">{cat.label}</h3>
                    <p className="text-xs font-medium italic" style={{ color: cat.color }}>{cat.tagline}</p>
                  </div>
                </div>
                <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{cat.desc}</p>
                <div className="grid grid-cols-1 gap-0.5 overflow-y-auto pr-1" style={{ maxHeight: "320px" }}>
                  {cat.services.map((svc) => (
                    <button
                      key={svc.slug}
                      onClick={() => handleServiceClick(svc.catSlug, svc.slug)}
                      className="flex items-start gap-2.5 rounded-lg border border-transparent p-2 text-left transition-all"
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${cat.color}08`; e.currentTarget.style.borderColor = `${cat.color}20`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                    >
                      <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: cat.color }} />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold">{svc.name}</span>
                        <p className="line-clamp-1 text-[11px] text-muted-foreground">{svc.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (cat.key === "career-services") go("professional-services");
                    else go(`services/${cat.services[0].catSlug}`);
                    setOpen(false);
                  }}
                  className="mt-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors"
                  style={{ background: `${cat.color}10`, color: cat.color, borderColor: `${cat.color}30` }}
                >
                  Explore {cat.label} →
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MEGA DROPDOWN: TALENT SOLUTIONS (single wide panel, 3-col + horizontal strip)
// ============================================================
function TalentSolutionsDropdown({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => go("talent-solutions")}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Target className="h-4 w-4 opacity-70" />
        <span>Hire Talent</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[840px] -translate-x-1/2 rounded-xl border bg-popover p-5 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))" }}>
          {/* 3-column grid */}
          <div className="grid grid-cols-3 gap-4">
            {TALENT_SEGMENTS.slice(0, 3).map((segment) => (
              <div key={segment.segmentLabel}>
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest" style={{ color: segment.segmentColor }}>
                  {segment.segmentLabel}
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {segment.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.view}
                        onClick={() => { go(item.view); setOpen(false); }}
                        className="flex items-start gap-2.5 rounded-lg border border-transparent p-2.5 text-left transition-all hover:shadow-sm"
                        style={{ background: `${item.color}06` }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = `${item.color}10`; e.currentTarget.style.borderColor = `${item.color}25`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = `${item.color}06`; e.currentTarget.style.borderColor = "transparent"; }}
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${item.color}18`, color: item.color }}>
                          <ItemIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold">{item.label}</span>
                            <span className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold" style={{ background: `${item.color}18`, color: item.color }}>{item.badge}</span>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* Horizontal Get Started strip */}
          <div className="mt-4 border-t pt-3">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brand">Get Started</span>
            <div className="grid grid-cols-3 gap-3">
              {TALENT_SEGMENTS[3].items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => { go(item.view); setOpen(false); }}
                    className="flex items-center gap-2.5 rounded-lg border border-brand/20 bg-brand/5 p-2.5 text-left transition-all hover:border-brand hover:bg-brand/10"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                      <ItemIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-bold">{item.label}</span>
                      <p className="line-clamp-1 text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-2.5">
            <span className="text-xs text-muted-foreground">12 solutions · 4 segments</span>
            <button onClick={() => { go("talent-solutions"); setOpen(false); }} className="rounded-md bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20">
              View All →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// DROPDOWN: RESOURCES (single panel, 2-col split)
// ============================================================
function ResourcesDropdown({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const company = RESOURCES_SUB.slice(0, 4);
  const opportunities = RESOURCES_SUB.slice(4, 8);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => go("about")}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <BookOpen className="h-4 w-4 opacity-70" />
        <span>Resources</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 w-[640px] rounded-xl border bg-popover p-4 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))" }}>
          <div className="grid grid-cols-2 gap-4">
            {/* Company column */}
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brand">Company</span>
              <div className="grid grid-cols-1 gap-1">
                {company.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => { go(item.view); setOpen(false); }}
                    className="flex items-start gap-3 rounded-lg border border-transparent p-2.5 text-left transition-all hover:bg-muted/50"
                  >
                    <span className="flex-shrink-0 text-brand">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold">{item.label}</span>
                      <p className="line-clamp-2 text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Opportunities column */}
            <div className="border-l pl-4">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "#8B5CF6" }}>Opportunities</span>
              <div className="grid grid-cols-1 gap-1">
                {opportunities.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => { go(item.view); setOpen(false); }}
                    className="flex items-start gap-3 rounded-lg border border-transparent p-2.5 text-left transition-all hover:bg-muted/50"
                  >
                    <span className="flex-shrink-0" style={{ color: "#8B5CF6" }}>{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold">{item.label}</span>
                      <p className="line-clamp-2 text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MEGA DROPDOWN: JOBS (3-column — categories, demand, locations)
// ============================================================
function JobsDropdown({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);

  const popularCategories = [
    { label: "AI & ML Jobs", icon: Cpu, color: "#0EA5E9", count: "12,450+" },
    { label: "Growth & Sales Jobs", icon: TrendingUp, color: "#10B981", count: "8,320+" },
    { label: "Brand & Marketing Jobs", icon: Megaphone, color: "#F59E0B", count: "5,140+" },
    { label: "Data & Analytics Jobs", icon: BarChart3, color: "#8B5CF6", count: "3,890+" },
    { label: "People & Culture Jobs", icon: Users, color: "#EC4899", count: "4,260+" },
    { label: "Product Engineering Jobs", icon: Code2, color: "#EF4444", count: "9,750+" },
  ];

  const jobsInDemand = [
    { label: "Launchpad Roles (0–2 yrs)", icon: GraduationCap, color: "#0EA5E9", count: "6,500+" },
    { label: "Global-First Companies", icon: Building2, color: "#8B5CF6", count: "4,200+" },
    { label: "Work-from-Anywhere", icon: Home, color: "#10B981", count: "3,100+" },
    { label: "Async-First Remote", icon: Home, color: "#14B8A6", count: "2,850+" },
    { label: "Instant-Interview Jobs", icon: UserCheck, color: "#F59E0B", count: "1,940+" },
    { label: "Flex & Gig Roles", icon: Clock, color: "#EC4899", count: "1,620+" },
  ];

  const jobsByLocation = [
    { label: "Jobs in Delhi", count: "18,200+" },
    { label: "Jobs in Mumbai", count: "15,800+" },
    { label: "Jobs in Bangalore", count: "22,400+" },
    { label: "Jobs in Hyderabad", count: "12,600+" },
    { label: "Jobs in Chennai", count: "9,300+" },
    { label: "Jobs in Pune", count: "8,750+" },
  ];

  const handleJobNav = (label: string) => {
    sessionStorage.setItem(
      "jobsonn_job_search",
      JSON.stringify({ keyword: label.replace("Jobs in ", "").replace(" Jobs", ""), location: "", experienceMin: 0 })
    );
    go("jobs");
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => go("jobs")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
          open ? "text-brand" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Briefcase className="h-4 w-4 opacity-70" />
        <span>Jobs</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[760px] -translate-x-1/2 rounded-xl border bg-popover p-5 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))" }}>
          <div className="grid grid-cols-3 gap-5">
            {/* Column 1: Popular categories */}
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brand">Future-Ready Roles</span>
              <div className="grid grid-cols-1 gap-0.5">
                {popularCategories.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleJobNav(item.label)}
                      className="flex items-center gap-2.5 rounded-lg border border-transparent p-2 text-left transition-all hover:bg-muted/50"
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md" style={{ background: `${item.color}18`, color: item.color }}>
                        <ItemIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 text-xs font-semibold">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground">{item.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Column 2: Jobs in demand */}
            <div className="border-l pl-5">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "#F59E0B" }}>Trending Now</span>
              <div className="grid grid-cols-1 gap-0.5">
                {jobsInDemand.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleJobNav(item.label)}
                      className="flex items-center gap-2.5 rounded-lg border border-transparent p-2 text-left transition-all hover:bg-muted/50"
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md" style={{ background: `${item.color}18`, color: item.color }}>
                        <ItemIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 text-xs font-semibold">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground">{item.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Column 3: Jobs by location */}
            <div className="border-l pl-5">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "#10B981" }}>Hiring Hotspots</span>
              <div className="grid grid-cols-1 gap-0.5">
                {jobsByLocation.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      sessionStorage.setItem("jobsonn_job_search", JSON.stringify({ keyword: "", location: item.label.replace("Jobs in ", ""), experienceMin: 0 }));
                      go("jobs");
                      setOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-lg border border-transparent p-2 text-left transition-all hover:bg-muted/50"
                  >
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-xs font-semibold">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground">{item.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Footer CTA */}
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">50,000+ live roles refreshed daily</span>
            <button onClick={() => { go("jobs"); setOpen(false); }} className="rounded-md bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20">
              Explore all opportunities →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MEGA DROPDOWN: EMPLOYERS (2-column — categories + collections)
// ============================================================
function EmployersDropdown({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);

  const exploreCategories = [
    { label: "Unicorn Trailblazers", icon: Rocket, color: "#8B5CF6", desc: "Billion-dollar visionaries", count: "45+" },
    { label: "Global Powerhouses", icon: Building2, color: "#0EA5E9", desc: "Multi-national legends", count: "320+" },
    { label: "Hyper-Growth Startups", icon: Target, color: "#10B981", desc: "Scaling at warp speed", count: "1,200+" },
    { label: "Product-First Builders", icon: Code2, color: "#F59E0B", desc: "Craft-led engineering teams", count: "680+" },
    { label: "Digital-Native Disruptors", icon: Globe, color: "#EC4899", desc: "Born-on-the-internet brands", count: "540+" },
  ];

  const exploreCollections = [
    { label: "Top-Rated Workplaces", icon: Award, color: "#F59E0B", desc: "Loved by their people", count: "100+" },
    { label: "Deep-Tech Innovators", icon: Cpu, color: "#0EA5E9", desc: "AI, cloud & frontier tech", count: "450+" },
    { label: "FinTech Pioneers", icon: Landmark, color: "#10B981", desc: "Reimagining money", count: "180+" },
    { label: "Spotlight Employers", icon: Star, color: "#8B5CF6", desc: "Actively scaling teams", count: "60+" },
    { label: "Verified & Trusted", icon: ShieldCheck, color: "#EF4444", desc: "Vetted for transparency", count: "220+" },
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => go("companies")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
          open ? "text-brand" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Building2 className="h-4 w-4 opacity-70" />
        <span>Employers</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 rounded-xl border bg-popover p-5 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))" }}>
          <div className="grid grid-cols-2 gap-5">
            {/* Column 1: Explore categories */}
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brand">Discover by DNA</span>
              <div className="grid grid-cols-1 gap-0.5">
                {exploreCategories.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { go("companies"); setOpen(false); }}
                      className="flex items-center gap-2.5 rounded-lg border border-transparent p-2 text-left transition-all hover:bg-muted/50"
                    >
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md" style={{ background: `${item.color}18`, color: item.color }}>
                        <ItemIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">{item.label}</span>
                        <span className="block truncate text-[10px] text-muted-foreground">{item.desc}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{item.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Column 2: Explore collections */}
            <div className="border-l pl-5">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "#8B5CF6" }}>Curated Spotlights</span>
              <div className="grid grid-cols-1 gap-0.5">
                {exploreCollections.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { go("companies"); setOpen(false); }}
                      className="flex items-center gap-2.5 rounded-lg border border-transparent p-2 text-left transition-all hover:bg-muted/50"
                    >
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md" style={{ background: `${item.color}18`, color: item.color }}>
                        <ItemIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">{item.label}</span>
                        <span className="block truncate text-[10px] text-muted-foreground">{item.desc}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{item.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Footer CTA */}
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">12,000+ teams hiring right now</span>
            <button onClick={() => { go("companies"); setOpen(false); }} className="rounded-md bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20">
              Meet the employers →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// DROPDOWN: BLOGS (simple link with dropdown for categories)
// ============================================================
function BlogsDropdown({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const blogCategories = [
    { label: "AI & Machine Learning", icon: Brain, color: "#0EA5E9", slugs: ["future-of-ai-india", "rise-of-generative-ai-development", "data-science-vs-machine-learning-career", "python-ai-machine-learning-guide"] },
    { label: "Technology & Engineering", icon: Code2, color: "#8B5CF6", slugs: ["fullstack-development-roadmap", "scalable-apis-nodejs-typescript", "mastering-react-19-new-features", "top-20-javascript-frameworks"] },
    { label: "Career & Growth", icon: TrendingUp, color: "#10B981", slugs: ["crack-faang-interviews", "six-figure-tech-career-no-cs-degree", "remote-work-tech-career-guide", "complete-guide-product-management-tech"] },
    { label: "Marketing & SEO", icon: Megaphone, color: "#F59E0B", slugs: ["digital-marketing-ai-playbook", "content-marketing-10x-organic-traffic", "seo-age-of-ai", "social-media-marketing-trends"] },
    { label: "Cloud & DevOps", icon: Cloud, color: "#EF4444", slugs: ["cloud-computing-career-guide", "devops-engineering-beginner-expert"] },
    { label: "Education & Pay After Placement", icon: GraduationCap, color: "#D4A017", slugs: ["pay-after-placement-revolutionizing-education", "cybersecurity-careers-india"] },
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => go("blogs")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
          open ? "text-brand" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Newspaper className="h-4 w-4 opacity-70" />
        <span>Blog</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 rounded-xl border bg-popover p-4 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))" }}>
          <div className="grid grid-cols-2 gap-4">
            {blogCategories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.label}>
                  <span className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: cat.color }}>
                    <CatIcon className="h-3 w-3" /> {cat.label}
                  </span>
                  <div className="grid grid-cols-1 gap-0.5">
                    {cat.slugs.map((slug) => (
                      <button
                        key={slug}
                        onClick={() => { go(`blogs/${slug}`); setOpen(false); }}
                        className="flex items-center gap-2 rounded-md border border-transparent p-1.5 text-left text-xs text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                      >
                        <span className="h-1 w-1 flex-shrink-0 rounded-full" style={{ background: cat.color }} />
                        <span className="flex-1 truncate">{slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-2.5">
            <span className="text-xs text-muted-foreground">20+ articles across 6 categories</span>
            <button onClick={() => { go("blogs"); setOpen(false); }} className="rounded-md bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20">
              View all blogs →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// DROPDOWN: PARTNERS (4 partner types)
// ============================================================
function PartnersDropdown({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const partnerTypes = [
    { label: "Recruitment Partner", icon: UserCheck, color: "#0EA5E9", desc: "Earn revenue by referring candidates & employers to JOBSONN.", badge: "Revenue Share", route: "partner-with-us/recruitment-partner" },
    { label: "Physical Centre Partner", icon: Building2, color: "#8B5CF6", desc: "Run a JOBSONN training & assessment centre in your city.", badge: "Franchise", route: "partner-with-us/physical-centre-partner" },
    { label: "University Partner", icon: GraduationCap, color: "#10B981", desc: "Bring JOBSONN programs, placements & certifications to your campus.", badge: "Campus", route: "partner-with-us/university-partner" },
    { label: "Training Partner", icon: BookOpen, color: "#EF4444", desc: "Deliver JOBSONN-certified training programs as a certified trainer.", badge: "Certified", route: "partner-with-us/training-partner" },
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => go("partner-with-us")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
          open ? "text-brand" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Handshake className="h-4 w-4 opacity-70" />
        <span>Partners</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 w-[480px] rounded-xl border bg-popover p-4 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))" }}>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brand">Partner with JOBSONN</span>
          <div className="grid grid-cols-1 gap-1">
            {partnerTypes.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => { go(item.route); setOpen(false); }}
                  className="flex items-start gap-2.5 rounded-lg border border-transparent p-2.5 text-left transition-all hover:bg-muted/50"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${item.color}18`, color: item.color }}>
                    <ItemIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold" style={{ background: `${item.color}18`, color: item.color }}>{item.badge}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-2.5">
            <span className="text-xs text-muted-foreground">4 partner programs · Revenue sharing available</span>
            <button onClick={() => { go("partner-with-us"); setOpen(false); }} className="rounded-md bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20">
              Become a partner →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MOBILE NAV (Sheet with accordion)
// ============================================================
function MobileNav({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Image
              src="/jobsonn-logo.png"
              alt="JOBSONN"
              width={130}
              height={36}
              className="h-7 w-auto object-contain"
            />
          </SheetTitle>
        </SheetHeader>
        <Accordion type="multiple" className="mt-4">
          <AccordionItem value="programs">
            <AccordionTrigger className="text-sm font-semibold">Programs</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-2">
                <button onClick={() => { go("programs"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs font-medium text-brand hover:bg-brand/10">View All Programs</button>
                {PROGRAM_GROUPS.map(p => (
                  <button key={p.view} onClick={() => { go(p.view); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{p.label}</button>
                ))}
                <div className="mt-1 border-t pt-1">
                  {PROGRAM_GROUPS.flatMap(p => p.roles).map(r => (
                    <button key={r.view} onClick={() => { go(r.view); setOpen(false); }} className="rounded-md px-3 py-1 text-left text-[11px] text-muted-foreground hover:bg-muted">{r.label}</button>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="pro">
            <AccordionTrigger className="text-sm font-semibold">Pro Services</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-2">
                <button onClick={() => { go("tech-ai-services"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs font-medium text-brand hover:bg-brand/10">View All Pro Services</button>
                {PRO_SERVICE_CATEGORIES.map(cat => (
                  <div key={cat.key}>
                    <span className="mt-1 block px-3 text-[10px] font-bold uppercase" style={{ color: cat.color }}>{cat.label}</span>
                    {cat.services.map(svc => (
                      <button
                        key={svc.slug}
                        onClick={() => {
                          if (svc.catSlug === "professional") go(`professional-services/${svc.slug}`);
                          else go(`services/${svc.catSlug}/${svc.slug}`);
                          setOpen(false);
                        }}
                        className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted"
                      >
                        {svc.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="talent">
            <AccordionTrigger className="text-sm font-semibold">Hire Talent</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-2">
                <button onClick={() => { go("talent-solutions"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs font-medium text-brand hover:bg-brand/10">View All Solutions</button>
                {TALENT_SEGMENTS.flatMap(s => s.items).map(item => (
                  <button key={item.view} onClick={() => { go(item.view); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{item.label}</button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="jobs">
            <AccordionTrigger className="text-sm font-semibold">Jobs</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-2">
                <button onClick={() => { go("jobs"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs font-medium text-brand hover:bg-brand/10">Browse All Jobs</button>
                <span className="mt-1 px-3 text-[10px] font-bold uppercase text-muted-foreground">Popular</span>
                {["IT Jobs", "Sales Jobs", "Marketing Jobs", "Data Science Jobs", "HR Jobs", "Engineering Jobs"].map(j => (
                  <button key={j} onClick={() => { go("jobs"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{j}</button>
                ))}
                <span className="mt-1 px-3 text-[10px] font-bold uppercase text-muted-foreground">In Demand</span>
                {["Fresher Jobs", "MNC Jobs", "Remote Jobs", "Work from Home", "Walk-in Jobs", "Part-time Jobs"].map(j => (
                  <button key={j} onClick={() => { go("jobs"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{j}</button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="employers">
            <AccordionTrigger className="text-sm font-semibold">Employers</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-2">
                <button onClick={() => { go("companies"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs font-medium text-brand hover:bg-brand/10">View All Employers</button>
                <span className="mt-1 px-3 text-[10px] font-bold uppercase text-muted-foreground">Categories</span>
                {["Unicorn", "MNC", "Startup", "Product based", "Internet"].map(c => (
                  <button key={c} onClick={() => { go("companies"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{c}</button>
                ))}
                <span className="mt-1 px-3 text-[10px] font-bold uppercase text-muted-foreground">Collections</span>
                {["Top companies", "IT companies", "Fintech companies", "Featured companies"].map(c => (
                  <button key={c} onClick={() => { go("companies"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{c}</button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="resources">
            <AccordionTrigger className="text-sm font-semibold">Resources</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-2">
                {RESOURCES_SUB.map(item => (
                  <button key={item.view} onClick={() => { go(item.view); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{item.label}</button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="partners">
            <AccordionTrigger className="text-sm font-semibold">Partners</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 pl-2">
                <button onClick={() => { go("partner-with-us"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs font-medium text-brand hover:bg-brand/10">Partner Overview</button>
                {[
                  { label: "Recruitment Partner", route: "partner-with-us/recruitment-partner" },
                  { label: "Physical Centre Partner", route: "partner-with-us/physical-centre-partner" },
                  { label: "University Partner", route: "partner-with-us/university-partner" },
                  { label: "Training Partner", route: "partner-with-us/training-partner" },
                ].map(p => (
                  <button key={p.route} onClick={() => { go(p.route); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{p.label}</button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-2 flex flex-col gap-1 border-t pt-2">
          <button onClick={() => { go("placements"); setOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-muted">Placements</button>
          <button onClick={() => { go("professional-services"); setOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-muted">Professional Services</button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================
// MAIN NAVBAR
// ============================================================
export function PublicNavbar() {
  const { navigate, route, setCommandOpen } = useNav();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = useGo();

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b transition-all duration-300",
      scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70"
    )}>
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <MobileNav go={go} />

        {/* Logo */}
        <button onClick={() => go("home")} className="flex items-center" aria-label="JOBSONN home">
          <Image
            src="/jobsonn-logo.png"
            alt="JOBSONN"
            width={120}
            height={32}
            className="h-6 w-auto object-contain sm:h-7"
            priority
          />
        </button>

        {/* Desktop nav with mega dropdowns */}
        <nav className="hidden items-center gap-0.5 lg:flex" style={{ overflow: "visible" }}>
          <ProgramsDropdown go={go} />
          <ProServicesDropdown go={go} />
          <TalentSolutionsDropdown go={go} />
          <JobsDropdown go={go} />
          <EmployersDropdown go={go} />
          <PartnersDropdown go={go} />
          <ResourcesDropdown go={go} />
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCommandOpen(true)}>
            <Search className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {mounted && theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          <Button size="sm" className="h-7 px-3 text-xs" onClick={() => navigate("public", "partner-login")}>
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
