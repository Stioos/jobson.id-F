"use client";

import * as React from "react";
import Image from "next/image";
import { useNav } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Menu, Search, ChevronDown, Briefcase, Building2,
  GraduationCap, Handshake,
  Newspaper, Target, Cpu, Rocket, Megaphone, BookOpen, Phone, Eye,
  Award, UserCheck, Layers, Globe, ClipboardCheck, Users, TrendingUp,
  Factory, Brain, Code2, Database, Cloud, Box, Bot, Compass,
  ChevronRight, CheckCircle2, type LucideIcon,
  Clock, Landmark, Star, ShieldCheck, Home, MapPin, BarChart3,
  FileText, Mic, Sparkles, ArrowRight, LayoutGrid, Headset,
} from "lucide-react";
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
    twoLineTitle: "Make Machines Work\nFor Your Business",
    tagline: "Put AI to work — so you don't have to",
    heroLine: "Automate the busywork. Amplify every team.",
    desc: "AI agents, business automation, custom ML models & LLMs that turn scattered data into decisions — shipped in weeks.",
    icon: Brain,
    color: "#0EA5E9",
    services: [
      { catSlug: "ai-powered-business-solutions", slug: "ai-business-process-automation", name: "AI Business Process Automation", desc: "Automate repetitive workflows 24/7 with AI." },
      { catSlug: "ai-powered-business-solutions", slug: "ai-customer-support-solutions", name: "AI Customer Support Solutions", desc: "24/7 intelligent support that never sleeps." },
      { catSlug: "ai-powered-business-solutions", slug: "ai-document-intelligence", name: "AI Document Intelligence", desc: "Extract, classify & understand any document." },
      { catSlug: "ai-powered-business-solutions", slug: "ai-knowledge-management", name: "AI Knowledge Management", desc: "Turn scattered info into a company brain." },
      { catSlug: "ai-powered-business-solutions", slug: "ai-voice-chat-assistants", name: "AI Voice & Chat Assistants", desc: "Conversational AI that feels truly human." },
      { catSlug: "ai-powered-business-solutions", slug: "enterprise-ai-integration", name: "Enterprise AI Integration", desc: "Embed AI into your stack, end-to-end." },
      { catSlug: "ai-agentic-automation", slug: "custom-ai-agents", name: "Custom AI Agents", desc: "Autonomous agents that get things done." },
      { catSlug: "ai-agentic-automation", slug: "multi-agent-systems", name: "Multi-Agent Systems", desc: "Swarm intelligence for complex tasks." },
      { catSlug: "ai-agentic-automation", slug: "ai-workflow-automation", name: "AI Workflow Automation", desc: "Connect tools, automate the busywork." },
      { catSlug: "ai-ml-model-development", slug: "machine-learning", name: "Machine Learning Models", desc: "Predictive models tuned to your data." },
      { catSlug: "ai-ml-model-development", slug: "llm-development", name: "LLM Development", desc: "Custom large-language-model solutions." },
      { catSlug: "ai-ml-model-development", slug: "computer-vision", name: "Computer Vision", desc: "See, detect & classify from images." },
      { catSlug: "ai-ml-model-development", slug: "nlp-solutions", name: "NLP Solutions", desc: "Understand & generate human language." },
      { catSlug: "ai-ml-model-development", slug: "model-fine-tuning", name: "Model Fine-Tuning", desc: "Tune foundation models for your domain." },
    ],
  },
  {
    key: "build-engineer",
    label: "Build & Engineer",
    twoLineTitle: "Ship Products,\nNot Prototypes",
    tagline: "From idea to production — engineered to scale",
    heroLine: "Software your users love. Code your team trusts.",
    desc: "Custom web apps, mobile, SaaS platforms, ERPs & data pipelines — engineered by senior architects who ship at scale.",
    icon: Code2,
    color: "#8B5CF6",
    services: [
      { catSlug: "custom-software-development", slug: "enterprise-web-applications", name: "Enterprise Web Applications", desc: "Robust web apps built for millions of users." },
      { catSlug: "custom-software-development", slug: "saas-development", name: "SaaS Product Development", desc: "Multi-tenant SaaS, end-to-end." },
      { catSlug: "custom-software-development", slug: "mobile-apps", name: "Mobile App Development", desc: "iOS + Android from one codebase." },
      { catSlug: "custom-software-development", slug: "erp-crm-development", name: "ERP & CRM Development", desc: "Custom ERPs & CRMs that fit you perfectly." },
      { catSlug: "custom-software-development", slug: "api-development-integration", name: "API Development & Integration", desc: "Connect everything, reliably & fast." },
      { catSlug: "custom-software-development", slug: "legacy-modernization", name: "Legacy Modernization", desc: "Bring old systems into the modern era." },
      { catSlug: "data-engineering-analytics", slug: "data-warehousing", name: "Data Warehousing", desc: "A single source of truth for all teams." },
      { catSlug: "data-engineering-analytics", slug: "etl-elt", name: "ETL / ELT Pipelines", desc: "Move & transform data at scale." },
      { catSlug: "data-engineering-analytics", slug: "bi-dashboards", name: "BI Dashboards", desc: "See your business in real-time." },
      { catSlug: "data-engineering-analytics", slug: "real-time-analytics", name: "Real-Time Analytics", desc: "Decisions powered by live data." },
      { catSlug: "data-engineering-analytics", slug: "predictive-analytics", name: "Predictive Analytics", desc: "See what's coming before it arrives." },
    ],
  },
  {
    key: "cloud-deploy",
    label: "Cloud & Deploy",
    twoLineTitle: "Scale Infra That\nScales Itself",
    tagline: "Infrastructure that never sleeps or breaks",
    heroLine: "Cloud that scales itself. DevOps that ships itself.",
    desc: "Cloud migration, Kubernetes, CI/CD, IaC & self-hosted platforms — infrastructure engineered for zero downtime.",
    icon: Cloud,
    color: "#10B981",
    services: [
      { catSlug: "cloud-infrastructure-devops", slug: "cloud-migration", name: "Cloud Migration", desc: "Move to the cloud with zero downtime." },
      { catSlug: "cloud-infrastructure-devops", slug: "kubernetes", name: "Kubernetes Orchestration", desc: "Container orchestration done right." },
      { catSlug: "cloud-infrastructure-devops", slug: "ci-cd-automation", name: "CI/CD Automation", desc: "Ship code with confidence, daily." },
      { catSlug: "cloud-infrastructure-devops", slug: "infrastructure-as-code", name: "Infrastructure as Code", desc: "Reproducible infra, every single time." },
      { catSlug: "cloud-infrastructure-devops", slug: "cloud-security", name: "Cloud Security", desc: "Lock down your cloud, end-to-end." },
      { catSlug: "cloud-infrastructure-devops", slug: "managed-devops", name: "Managed DevOps", desc: "We run your DevOps, you ship product." },
      { catSlug: "open-source-deployment", slug: "self-hosted-ai-platform-deployment", name: "Self-Hosted AI Platform", desc: "Your own AI, your own cloud, your rules." },
      { catSlug: "open-source-deployment", slug: "erp-portal-deployment", name: "ERP & Portal Deployment", desc: "Open-source ERPs, deployed fast." },
      { catSlug: "open-source-deployment", slug: "devops-platform-deployment", name: "DevOps Platform Deployment", desc: "Full DevOps stack, set up for you." },
      { catSlug: "open-source-deployment", slug: "private-cloud-deployment", name: "Private Cloud Deployment", desc: "Your cloud, your sovereignty, your control." },
    ],
  },
  {
    key: "grow-market",
    label: "Grow & Market",
    twoLineTitle: "Turn Attention\nInto Revenue",
    tagline: "Pipeline on autopilot, revenue on repeat",
    heroLine: "Attention in. Revenue out. On autopilot.",
    desc: "AI-powered digital marketing, sales automation & lead intelligence that fills your pipeline — and books meetings while you sleep.",
    icon: Megaphone,
    color: "#F59E0B",
    services: [
      { catSlug: "digital-sales-ai-marketing", slug: "ai-digital-marketing", name: "AI Digital Marketing", desc: "Marketing that learns & optimizes itself." },
      { catSlug: "digital-sales-ai-marketing", slug: "seo-geo-ai-content-marketing", name: "SEO & GEO AI Content", desc: "Rank higher with AI-crafted content." },
      { catSlug: "digital-sales-ai-marketing", slug: "search-engine-social-media-marketing", name: "Search & Social Media Marketing", desc: "Be everywhere your customers are." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-social-media-automation", name: "AI Social Media Automation", desc: "Post, engage & grow on autopilot." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-sales-funnel-automation", name: "AI Sales Funnel Automation", desc: "Funnels that convert themselves." },
      { catSlug: "digital-sales-ai-marketing", slug: "crm-lead-automation", name: "CRM & Lead Automation", desc: "Never let a single lead go cold." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-market-research-customer-intelligence", name: "AI Market Research", desc: "Know your market before you enter it." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-lead-generation-prospecting", name: "AI Lead Generation", desc: "Find buyers before they find you." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-outbound-sales-outreach", name: "AI Outbound Sales Outreach", desc: "Outreach that books meetings while you sleep." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-account-based-marketing", name: "AI Account-Based Marketing", desc: "Win the enterprise accounts that matter." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-paid-advertising-campaign-strategy", name: "AI Paid Advertising", desc: "Ads that spend smarter, not harder." },
      { catSlug: "digital-sales-ai-marketing", slug: "ai-sales-enablement-revenue-intelligence", name: "AI Sales Enablement", desc: "Equip your team to close more, faster." },
    ],
  },
  {
    key: "transform-strategize",
    label: "Transform & Strategize",
    twoLineTitle: "Future-Proof\nYour Business",
    tagline: "Re-architect for the AI era — end to end",
    heroLine: "A roadmap that future-proofs every department.",
    desc: "Digital transformation consulting, AI strategy & technology architecture that re-architects your business for the AI era.",
    icon: Compass,
    color: "#EC4899",
    services: [
      { catSlug: "digital-transformation-consulting", slug: "ai-strategy", name: "AI Strategy & Roadmap", desc: "A roadmap for AI, not guesswork." },
      { catSlug: "digital-transformation-consulting", slug: "digital-transformation", name: "Digital Transformation", desc: "Rebuild how you operate, end-to-end." },
      { catSlug: "digital-transformation-consulting", slug: "process-reengineering", name: "Process Reengineering", desc: "Redesign workflows for the AI era." },
      { catSlug: "digital-transformation-consulting", slug: "technology-architecture", name: "Technology Architecture", desc: "A foundation built to last a decade." },
      { catSlug: "digital-transformation-consulting", slug: "it-modernization", name: "IT Modernization", desc: "Bring your tech stack into today." },
      { catSlug: "digital-transformation-consulting", slug: "ai-governance", name: "AI Governance & Risk", desc: "AI that's safe, compliant & trusted." },
    ],
  },
  {
    key: "career-services",
    label: "Career Services",
    twoLineTitle: "From Lost to Hired,\nFast",
    tagline: "Land the job you actually deserve",
    heroLine: "Stand out before you speak. Get hired, not just apply.",
    desc: "8 professional services — career assessment, resume branding, skills, portfolio, AI job matching, mock interviews & more.",
    icon: GraduationCap,
    color: "#EF4444",
    services: [
      { catSlug: "professional", slug: "career-assessment", name: "Career Assessment & Role Matching", desc: "Find your true north with AI precision." },
      { catSlug: "professional", slug: "resume-branding", name: "Resume, LinkedIn & Personal Branding", desc: "Stand out before you even speak." },
      { catSlug: "professional", slug: "skills-readiness", name: "Skills & Career Readiness", desc: "Become the candidate employers want." },
      { catSlug: "professional", slug: "portfolio-development", name: "Portfolio & Real-World Projects", desc: "Turn skills into undeniable proof." },
      { catSlug: "professional", slug: "ai-job-matching", name: "AI-Powered Job & Role Matching", desc: "Your AI co-pilot for the right job." },
      { catSlug: "professional", slug: "mock-interviews", name: "Mock Interviews & Interview Prep", desc: "Walk in calm. Walk out hired." },
      { catSlug: "professional", slug: "job-search-strategy", name: "Job Search & Application Strategy", desc: "Get hired faster, not just apply more." },
      { catSlug: "professional", slug: "talent-matching", name: "Talent Matching & Hiring Connections", desc: "Get in front of employers directly." },
    ],
  },
];

// Subcategory metadata — maps catSlug to display label + icon
const SUBCATEGORY_META: Record<string, { label: string; icon: LucideIcon }> = {
  "ai-powered-business-solutions": { label: "AI-Powered Business Solutions", icon: Brain },
  "ai-agentic-automation": { label: "AI Agentic & Automation", icon: Bot },
  "ai-ml-model-development": { label: "AI / ML Model Development", icon: Cpu },
  "custom-software-development": { label: "Custom Software Development", icon: Code2 },
  "data-engineering-analytics": { label: "Data Engineering & Analytics", icon: Database },
  "cloud-infrastructure-devops": { label: "Cloud Infrastructure & DevOps", icon: Cloud },
  "open-source-deployment": { label: "Open Source Deployment", icon: Box },
  "digital-sales-ai-marketing": { label: "Digital Sales & AI Marketing", icon: Megaphone },
  "digital-transformation-consulting": { label: "Digital Transformation Consulting", icon: Compass },
  "professional": { label: "Professional Career Services", icon: GraduationCap },
};

function ProServicesDropdown({ go }: { go: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState<string>("ai-intelligence");

  // Derive subcategory groups for a given mega-category
  const getSubcategories = (cat: typeof PRO_SERVICE_CATEGORIES[0]) => {
    const groups: Record<string, typeof cat.services> = {};
    cat.services.forEach((svc) => {
      if (!groups[svc.catSlug]) groups[svc.catSlug] = [];
      groups[svc.catSlug].push(svc);
    });
    return Object.entries(groups).map(([catSlug, services]) => ({
      catSlug,
      meta: SUBCATEGORY_META[catSlug] ?? { label: catSlug, icon: Layers },
      services,
    }));
  };

  const handleServiceClick = (catSlug: string, svcSlug: string) => {
    if (catSlug === "professional") {
      go(`professional-services/${svcSlug}`);
    } else {
      go(`services/${catSlug}/${svcSlug}`);
    }
    setOpen(false);
  };

  const handleSubcategoryClick = (catSlug: string) => {
    if (catSlug === "professional") go("professional-services");
    else go(`services/${catSlug}`);
    setOpen(false);
  };

  const activeCat = PRO_SERVICE_CATEGORIES.find(c => c.key === activeKey) ?? PRO_SERVICE_CATEGORIES[0];
  const subcats = getSubcategories(activeCat);
  const ActiveIcon = activeCat.icon;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { setOpen(false); setActiveKey("ai-intelligence"); }}
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
        <div className="absolute left-0 top-full z-50 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.18))" }}>
          <div className="flex w-[860px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-popover">
            {/* ============== LEFT SIDEBAR: solution categories ============== */}
            <div className="flex w-[260px] flex-col border-r bg-muted/30 p-3">
              {/* Sidebar header */}
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Solution Categories</span>
                <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[8px] font-bold text-brand">68</span>
              </div>
              {/* Category list */}
              <div className="flex flex-col gap-0.5 overflow-y-auto" style={{ maxHeight: "400px" }}>
                {PRO_SERVICE_CATEGORIES.map((cat) => {
                  const CatIcon = cat.icon;
                  const isActive = activeKey === cat.key;
                  const subcatCount = new Set(cat.services.map(s => s.catSlug)).size;
                  return (
                    <button
                      key={cat.key}
                      onMouseEnter={() => setActiveKey(cat.key)}
                      onClick={() => {
                        if (cat.key === "career-services") go("professional-services");
                        else go(`services/${cat.services[0].catSlug}`);
                        setOpen(false);
                      }}
                      className="group relative flex items-start gap-2.5 rounded-lg p-2 text-left transition-all duration-150"
                      style={{
                        background: isActive ? `${cat.color}12` : "transparent",
                      }}
                    >
                      {/* Active left border */}
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full transition-opacity"
                        style={{ background: cat.color, opacity: isActive ? 1 : 0 }}
                      />
                      {/* Icon */}
                      <div
                        className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-transform group-hover:scale-105"
                        style={{
                          background: isActive ? cat.color : `${cat.color}18`,
                          color: isActive ? "#fff" : cat.color,
                        }}
                      >
                        <CatIcon className="h-3.5 w-3.5" />
                      </div>
                      {/* Label + subtitle */}
                      <div className="min-w-0 flex-1">
                        <span
                          className="block truncate text-[11px] font-bold transition-colors"
                          style={{ color: isActive ? cat.color : "hsl(var(--foreground))" }}
                        >
                          {cat.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[9px] text-muted-foreground">
                          {cat.services.length} services · {subcatCount} {subcatCount === 1 ? "subcategory" : "subcategories"}
                        </span>
                      </div>
                      {isActive && (
                        <ChevronRight className="mt-1 h-3 w-3 flex-shrink-0" style={{ color: cat.color }} />
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Sidebar footer */}
              <div className="mt-2 border-t pt-2">
                <button
                  onClick={() => { go("tech-ai-services"); setOpen(false); }}
                  className="flex w-full items-center justify-center gap-1 rounded-md bg-brand px-2 py-1.5 text-[10px] font-bold text-brand-foreground transition-colors hover:bg-brand/90"
                >
                  View All Services <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* ============== RIGHT PANEL: active category detail ============== */}
            <div className="flex flex-1 flex-col p-4">
              {/* Category header */}
              <div
                className="mb-3 rounded-lg p-3"
                style={{ background: `${activeCat.color}0A`, borderLeft: `3px solid ${activeCat.color}` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${activeCat.color}, ${activeCat.color}CC)`, color: "#fff" }}
                    >
                      <ActiveIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: activeCat.color }}>
                        {activeCat.label}
                      </span>
                      <h3 className="mt-0.5 text-sm font-bold leading-tight text-foreground">
                        {activeCat.twoLineTitle.split("\n").map((line, i) => (
                          <span key={i} className="block">{line}</span>
                        ))}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
                        {activeCat.desc}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (activeCat.key === "career-services") go("professional-services");
                      else go(`services/${activeCat.services[0].catSlug}`);
                      setOpen(false);
                    }}
                    className="flex flex-shrink-0 items-center gap-1 rounded-md border px-2.5 py-1.5 text-[10px] font-bold transition-colors"
                    style={{ borderColor: activeCat.color, color: activeCat.color, background: "transparent" }}
                  >
                    Explore category <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Subcategory cards — 2-column grid */}
              <div className="grid grid-cols-2 gap-2.5 overflow-y-auto pr-1" style={{ maxHeight: "300px" }}>
                {subcats.map((sub) => {
                  const SubIcon = sub.meta.icon;
                  return (
                    <div
                      key={sub.catSlug}
                      className="group rounded-lg border border-border bg-card p-2.5 transition-all duration-150 hover:border-brand/40 hover:shadow-sm"
                    >
                      {/* Subcategory header */}
                      <button
                        onClick={() => handleSubcategoryClick(sub.catSlug)}
                        className="mb-1.5 flex w-full items-center gap-1.5 border-b border-border pb-1.5 text-left"
                      >
                        <div
                          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded"
                          style={{ background: `${activeCat.color}18`, color: activeCat.color }}
                        >
                          <SubIcon className="h-3 w-3" />
                        </div>
                        <span className="flex-1 text-[11px] font-bold leading-tight text-foreground transition-colors group-hover:text-brand">
                          {sub.meta.label}
                        </span>
                        <span
                          className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold"
                          style={{ background: `${activeCat.color}1A`, color: activeCat.color }}
                        >
                          {sub.services.length}
                        </span>
                      </button>
                      {/* Service items */}
                      <div className="space-y-0.5">
                        {sub.services.slice(0, 3).map((svc) => (
                          <button
                            key={svc.slug}
                            onClick={() => handleServiceClick(svc.catSlug, svc.slug)}
                            className="flex w-full items-start gap-1.5 rounded px-1 py-1 text-left transition-colors hover:bg-accent"
                          >
                            <span
                              className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full"
                              style={{ background: activeCat.color }}
                            />
                            <span className="text-[10px] leading-tight text-muted-foreground transition-colors hover:text-foreground">
                              {svc.name}
                            </span>
                          </button>
                        ))}
                        {sub.services.length > 3 && (
                          <button
                            onClick={() => handleSubcategoryClick(sub.catSlug)}
                            className="mt-0.5 flex w-full items-center gap-1 rounded px-1 py-0.5 text-left text-[10px] font-semibold transition-colors hover:bg-accent"
                            style={{ color: activeCat.color }}
                          >
                            +{sub.services.length - 3} more services <ArrowRight className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// APPS DROPDOWN — portal switcher grid (2x3)
// ============================================================
const APPS_ITEMS = [
  { label: "Candidate", icon: Users, color: "#3B82F6", portal: "candidate" as const, desc: "Find jobs & track applications" },
  { label: "Employer", icon: Building2, color: "#8B5CF6", portal: "employer" as const, desc: "Hire talent & manage postings" },
  { label: "Recruiter", icon: Briefcase, color: "#F59E0B", portal: "recruiter" as const, desc: "Source candidates & earn commissions" },
  { label: "Training", icon: GraduationCap, color: "#EF4444", portal: "training" as const, desc: "Upskill with programs & courses" },
  { label: "Partner", icon: Handshake, color: "#10B981", portal: "partner" as const, desc: "Grow your business with us" },
  { label: "Consultant", icon: Headset, color: "#D4A017", portal: "agency" as const, desc: "Manage projects & clients" },
];

function AppsDropdown() {
  const [open, setOpen] = React.useState(false);
  const { navigate } = useNav();

  const handleClick = (portal: string) => {
    navigate(portal as any, "overview");
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand/5 hover:border-brand/40"
        aria-label="Apps"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span>Apps</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.18))" }}>
          <div className="w-[320px] rounded-xl border bg-popover p-3">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between border-b pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand">Switch Portal</span>
              <span className="text-[9px] text-muted-foreground">6 portals</span>
            </div>
            {/* 2x3 grid */}
            <div className="grid grid-cols-3 gap-2">
              {APPS_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleClick(item.portal)}
                    className="group flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ borderTopColor: item.color, borderTopWidth: 2 }}
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-bold text-foreground">{item.label}</span>
                  </button>
                );
              })}
            </div>
            {/* Footer */}
            <div className="mt-3 border-t pt-2 text-center">
              <p className="text-[10px] text-muted-foreground">Select a portal to switch your dashboard view</p>
            </div>
          </div>
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

  // ===================== FILTER DATA (from reference images) =====================
  const workModeFilters = [
    { label: "On-site", count: "3,027" },
    { label: "Hybrid", count: "102" },
    { label: "Remote", count: "74" },
  ];

  const locationFilters = [
    { label: "Bangalore", count: "3,661" },
    { label: "Hyderabad", count: "257" },
    { label: "Pune", count: "18" },
    { label: "Kolkata", count: "16" },
  ];

  const departmentFilters = [
    { label: "Engineering / R&D", count: "706" },
    { label: "IT & Software Dev.", count: "698" },
    { label: "Customer Support", count: "437" },
    { label: "Product & Marketing", count: "347" },
  ];

  const salaryFilters = [
    { label: "₹0-40k / mo", value: 0 },
    { label: "₹40k-80k / mo", value: 40000 },
    { label: "₹80k-120k / mo", value: 80000 },
    { label: "₹120k+ / mo", value: 120000 },
  ];

  const companyTypeFilters = [
    { label: "Foreign MNC", count: "2,073" },
    { label: "Indian MNC", count: "701" },
    { label: "Corporate", count: "637" },
    { label: "Startup", count: "417" },
  ];

  const roleCategoryFilters = [
    { label: "Software Development", count: "5,144" },
    { label: "Engineering/Construction", count: "1,466" },
    { label: "IT Services/ESM", count: "508" },
    { label: "KPO/BPO/BackOffice", count: "483" },
  ];

  const educationFilters = [
    { label: "Any Graduation/Diploma", count: "1,681" },
    { label: "B.Tech/B.E.", count: "1,610" },
    { label: "MBA/PGDM", count: "685" },
    { label: "Doctorate Ph.D.", count: "39" },
  ];

  const industryFilters = [
    { label: "IT Services & Consulting", count: "2,756" },
    { label: "Internet/E-commerce", count: "650" },
    { label: "Education/Training", count: "304" },
    { label: "Management Consulting", count: "145" },
  ];

  const topCompaniesFilters = [
    { label: "Accenture", count: "720" },
    { label: "TCS", count: "667" },
    { label: "Infosys", count: "587" },
    { label: "Reliance", count: "404" },
  ];

  const postedByFilters = [
    { label: "Company", count: "6,076" },
    { label: "Consultancy", count: "573" },
  ];

  const shiftFilters = [
    { label: "Urgent", count: "56" },
    { label: "Shift-Rot", count: "9" },
    { label: "Grave", count: "2" },
    { label: "UK-India", count: "1" },
  ];

  const freshnessFilters = [
    { label: "Last 24 hours", value: 1 },
    { label: "Last 3 days", value: 3 },
    { label: "Last 7 days", value: 7 },
    { label: "Last 30 days", value: 30 },
  ];

  // ===================== NAVIGATION HANDLERS =====================
  const applyFilter = (filterData: Record<string, unknown>) => {
    sessionStorage.setItem("jobsonn_job_search", JSON.stringify(filterData));
    // Use full page navigation so PublicJobs remounts and reads sessionStorage
    window.location.assign("/jobs");
    setOpen(false);
  };

  const handleWorkMode = (label: string) => {
    const map: Record<string, string> = { "On-site": "onsite", "Hybrid": "hybrid", "Remote": "remote" };
    applyFilter({ workArrangements: [map[label]], keyword: "", location: "" });
  };

  const handleLocation = (label: string) => {
    applyFilter({ keyword: "", location: label, experienceMin: 0 });
  };

  const handleDepartment = (label: string) => {
    applyFilter({ keyword: label, location: "", category: label });
  };

  const handleSalary = (value: number) => {
    applyFilter({ keyword: "", location: "", salaryMin: value });
  };

  const handleKeyword = (label: string) => {
    applyFilter({ keyword: label, location: "" });
  };

  const handleFreshness = (value: number) => {
    applyFilter({ keyword: "", location: "", postedWithinDays: value });
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
        <div className="absolute left-0 top-full z-50 pt-2" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.18))" }}>
          <div className="w-[920px] max-w-[calc(100vw-2rem)] rounded-xl border bg-popover">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-brand" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand">Job Search Filters</span>
                </div>
                <p className="mt-0.5 text-sm font-bold text-foreground">150,000+ live roles — filter & find your fit</p>
              </div>
              <button
                onClick={() => { go("jobs"); setOpen(false); }}
                className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-brand-foreground transition-transform hover:scale-105"
              >
                Browse All Jobs <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Filter grid — 4 columns */}
            <div className="grid grid-cols-4 gap-0">
              {/* ===== Column 1: Work Mode + Location + Freshness ===== */}
              <div className="border-r p-3">
                {/* Work Mode */}
                <FilterSection title="Work Mode" icon={Home} color="#10B981">
                  {workModeFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleWorkMode(f.label)} />
                  ))}
                </FilterSection>
                {/* Location */}
                <FilterSection title="Location" icon={MapPin} color="#0EA5E9">
                  {locationFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleLocation(f.label)} />
                  ))}
                </FilterSection>
                {/* Freshness */}
                <FilterSection title="Freshness" icon={Clock} color="#F59E0B">
                  {freshnessFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} onClick={() => handleFreshness(f.value)} />
                  ))}
                </FilterSection>
              </div>

              {/* ===== Column 2: Department + Role Category + Salary ===== */}
              <div className="border-r p-3">
                {/* Department */}
                <FilterSection title="Department" icon={Briefcase} color="#8B5CF6">
                  {departmentFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleDepartment(f.label)} />
                  ))}
                </FilterSection>
                {/* Role Category */}
                <FilterSection title="Role Category" icon={Users} color="#EC4899">
                  {roleCategoryFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleKeyword(f.label)} />
                  ))}
                </FilterSection>
                {/* Salary */}
                <FilterSection title="Salary" icon={TrendingUp} color="#10B981">
                  {salaryFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} onClick={() => handleSalary(f.value)} />
                  ))}
                </FilterSection>
              </div>

              {/* ===== Column 3: Company Type + Top Companies + Posted By ===== */}
              <div className="border-r p-3">
                {/* Company Type */}
                <FilterSection title="Company Type" icon={Building2} color="#0EA5E9">
                  {companyTypeFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleKeyword(f.label)} />
                  ))}
                </FilterSection>
                {/* Top Companies */}
                <FilterSection title="Top Companies" icon={Star} color="#F59E0B">
                  {topCompaniesFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleKeyword(f.label)} />
                  ))}
                </FilterSection>
                {/* Posted By */}
                <FilterSection title="Posted By" icon={UserCheck} color="#8B5CF6">
                  {postedByFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleKeyword(f.label)} />
                  ))}
                </FilterSection>
              </div>

              {/* ===== Column 4: Industry + Education + Shift ===== */}
              <div className="p-3">
                {/* Industry */}
                <FilterSection title="Industry" icon={Factory} color="#EF4444">
                  {industryFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleKeyword(f.label)} />
                  ))}
                </FilterSection>
                {/* Education */}
                <FilterSection title="Education" icon={GraduationCap} color="#D4A017">
                  {educationFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleKeyword(f.label)} />
                  ))}
                </FilterSection>
                {/* Shift */}
                <FilterSection title="Shift" icon={Clock} color="#14B8A6">
                  {shiftFilters.map((f) => (
                    <FilterItem key={f.label} label={f.label} count={f.count} onClick={() => handleKeyword(f.label)} />
                  ))}
                </FilterSection>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand" />
                <span className="text-[11px] font-medium text-muted-foreground">Click any filter to instantly refine your job search</span>
              </div>
              <button
                onClick={() => { go("contact"); setOpen(false); }}
                className="flex items-center gap-1 text-[11px] font-bold text-brand transition-colors hover:underline"
              >
                Need help finding? <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FILTER SECTION + ITEM — compact filter UI for Jobs dropdown
// ============================================================
function FilterSection({
  title, icon: Icon, color, children,
}: {
  title: string;
  icon: LucideIcon;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center gap-1.5 border-b border-border pb-1">
        <Icon className="h-3 w-3" style={{ color }} />
        <span className="text-[10px] font-bold uppercase tracking-wide text-foreground">{title}</span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterItem({
  label, count, onClick,
}: {
  label: string;
  count?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded px-1.5 py-1 text-left transition-colors hover:bg-accent"
    >
      <span className="flex-1 truncate text-[11px] text-muted-foreground transition-colors hover:text-foreground">
        {label}
      </span>
      {count && (
        <span className="ml-1 flex-shrink-0 text-[9px] text-muted-foreground/70">{count}</span>
      )}
    </button>
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
                <button onClick={() => { go("tech-ai-services"); setOpen(false); }} className="flex items-center justify-between rounded-md px-3 py-1.5 text-left text-xs font-medium text-brand hover:bg-brand/10">
                  <span>View All Pro Services</span>
                  <span className="text-[9px] font-bold">68 services</span>
                </button>
                {PRO_SERVICE_CATEGORIES.map(cat => (
                  <div key={cat.key} className="mt-1 rounded-md border border-border/60 bg-muted/30 p-2">
                    <button
                      onClick={() => {
                        if (cat.key === "career-services") go("professional-services");
                        else go(`services/${cat.services[0].catSlug}`);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-1.5 px-1 pb-1 text-left"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: cat.color }}>{cat.label}</span>
                      <span className="ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: `${cat.color}1A`, color: cat.color }}>{cat.services.length}</span>
                    </button>
                    <p className="px-2 pb-1 text-[10px] italic text-muted-foreground">{cat.tagline}</p>
                    <div className="mt-0.5 grid grid-cols-1">
                      {cat.services.map(svc => (
                        <button
                          key={svc.slug}
                          onClick={() => {
                            if (svc.catSlug === "professional") go(`professional-services/${svc.slug}`);
                            else go(`services/${svc.catSlug}/${svc.slug}`);
                            setOpen(false);
                          }}
                          className="rounded-md px-2 py-1 text-left text-[11px] text-foreground hover:bg-background"
                        >
                          {svc.name}
                        </button>
                      ))}
                    </div>
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
                <button onClick={() => { go("jobs"); setOpen(false); }} className="flex items-center justify-between rounded-md px-3 py-1.5 text-left text-xs font-medium text-brand hover:bg-brand/10">
                  <span>Browse All Jobs</span>
                  <span className="text-[9px] font-bold">150k+</span>
                </button>
                <span className="mt-2 px-3 text-[10px] font-bold uppercase text-muted-foreground">Work Mode</span>
                {["On-site", "Hybrid", "Remote"].map(j => (
                  <button key={j} onClick={() => { go("jobs"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{j}</button>
                ))}
                <span className="mt-2 px-3 text-[10px] font-bold uppercase text-muted-foreground">Location</span>
                {["Bangalore", "Hyderabad", "Pune", "Kolkata"].map(j => (
                  <button key={j} onClick={() => { go("jobs"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{j}</button>
                ))}
                <span className="mt-2 px-3 text-[10px] font-bold uppercase text-muted-foreground">Department</span>
                {["Engineering / R&D", "IT & Software Dev.", "Customer Support", "Product & Marketing"].map(j => (
                  <button key={j} onClick={() => { go("jobs"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{j}</button>
                ))}
                <span className="mt-2 px-3 text-[10px] font-bold uppercase text-muted-foreground">Company Type</span>
                {["Foreign MNC", "Indian MNC", "Corporate", "Startup"].map(j => (
                  <button key={j} onClick={() => { go("jobs"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{j}</button>
                ))}
                <span className="mt-2 px-3 text-[10px] font-bold uppercase text-muted-foreground">Industry</span>
                {["IT Services & Consulting", "Internet/E-commerce", "Education/Training"].map(j => (
                  <button key={j} onClick={() => { go("jobs"); setOpen(false); }} className="rounded-md px-3 py-1.5 text-left text-xs hover:bg-muted">{j}</button>
                ))}
                <span className="mt-2 px-3 text-[10px] font-bold uppercase text-muted-foreground">Education</span>
                {["Any Graduation", "B.Tech/B.E.", "MBA/PGDM", "Doctorate Ph.D."].map(j => (
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
  const { navigate } = useNav();
  const [scrolled, setScrolled] = React.useState(false);
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
          <AppsDropdown />
          <Button size="sm" className="h-8 gap-1.5 px-3 text-xs" onClick={() => navigate("public", "partner-login")}>
            <UserCheck className="h-3.5 w-3.5" />
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}
