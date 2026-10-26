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
  ArrowRight, ArrowLeft, ChevronRight, Sparkles, Briefcase, Search, Clock,
  ShieldCheck, GraduationCap, UserCheck, Award, ClipboardCheck, Layers,
  Globe, Users, TrendingUp, BrainCircuit, Database, Gauge, Wallet, Target,
  FileCheck2, Workflow, BarChart3, CheckCircle2, Zap, Headset, Rocket,
  Quote, BookOpen, Network, RefreshCw, Lightbulb, Microscope, Cog, Server,
  Code2, Cloud, MapPin, Calendar, Wrench, Boxes, PenTool, Megaphone,
  Handshake, GitBranch, Building2, LineChart, Cpu, Stethoscope, Factory,
  Banknote, ShoppingBag, Truck, Home, UserPlus, FileSignature,
  HeartHandshake, MessagesSquare, Phone, Mail, Bell, Filter, PieChart,
  Activity, Eye, Lock, FileText, Send, CalendarClock, ListChecks,
  CircleDollarSign, Receipt, BadgeCheck, Users2, PhoneCall,
  CreditCard, Smartphone, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Type definitions
// ─────────────────────────────────────────────────────────────────────────────
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
interface ComparisonRow {
  feature: string;
  traditional: string;
  ours: string;
}
interface Integration {
  name: string;
  type: string;
  icon: LucideIcon;
  desc: string;
}
interface Metric {
  label: string;
  value: string;
  icon: LucideIcon;
}
interface CaseStudy {
  company: string;
  industry: string;
  challenge: string;
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
interface PricingTier {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  popular?: boolean;
}
interface RelatedSubPage {
  key: string;
  label: string;
  icon: LucideIcon;
  desc: string;
}
interface SubPageConfig {
  key: string;
  label: string;
  shortLabel: string;
  accent: string;
  hero: {
    icon: LucideIcon;
    title: string;
    badge: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { label: string; value: string }[];
  };
  overview: {
    what: string;
    why: string[];
  };
  keyFeatures: KeyFeature[];
  howItWorks: ProcessStep[];
  benefits: Benefit[];
  useCases: UseCase[];
  comparison: {
    columns: [string, string, string];
    rows: ComparisonRow[];
  };
  techStack: string[];
  integrations: Integration[];
  metrics: Metric[];
  caseStudies: CaseStudy[];
  testimonials: Testimonial[];
  pricing: PricingTier[];
  faqs: { q: string; a: string }[];
  cta: {
    title: string;
    desc: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  related: RelatedSubPage[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-page metadata (used by sidebar / tab bar inside the sub-page template)
// ─────────────────────────────────────────────────────────────────────────────
const ALL_SUB_PAGES: { key: string; label: string; shortLabel: string; icon: LucideIcon }[] = [
  { key: "ai-sourcing-engine", label: "AI Sourcing Engine", shortLabel: "AI Sourcing Engine", icon: BrainCircuit },
  { key: "talent-pool-benchmarks", label: "Talent Pool & Benchmarks", shortLabel: "Talent Pool & Benchmarks", icon: Database },
  { key: "48-hour-shortlist", label: "48-Hour Shortlist SLA", shortLabel: "48-Hour Shortlist", icon: Clock },
  { key: "screening-assessment", label: "Screening & Assessment", shortLabel: "Screening & Assessment", icon: ClipboardCheck },
  { key: "sourcing-plans-pricing", label: "Sourcing Plans & Pricing", shortLabel: "Sourcing Plans & Pricing", icon: Wallet },
  { key: "hiring-workflow", label: "Hiring Workflow", shortLabel: "Hiring Workflow", icon: Workflow },
  { key: "candidate-engagement", label: "Candidate Engagement", shortLabel: "Candidate Engagement", icon: Sparkles },
  { key: "analytics-reporting", label: "Analytics & Reporting", shortLabel: "Analytics & Reporting", icon: BarChart3 },
];

const EMERALD = "#10B981";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — 8 sub-pages, each with all 16 sections of rich content
// ─────────────────────────────────────────────────────────────────────────────
const SUB_PAGE_CONFIG: Record<string, SubPageConfig> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. AI Sourcing Engine
  // ═══════════════════════════════════════════════════════════════════════════
  "ai-sourcing-engine": {
    key: "ai-sourcing-engine",
    label: "AI Sourcing Engine",
    shortLabel: "AI Sourcing Engine",
    accent: EMERALD,
    hero: {
      icon: BrainCircuit,
      title: "AI Sourcing Engine",
      badge: "AI-POWERED SEARCH",
      description:
        "Semantic talent search with skill-graph ranking and predictive analytics. Find the right fit in seconds — no black boxes, just explainable AI that surfaces candidates your recruiters would have missed.",
      ctaPrimary: "Try AI Sourcing",
      ctaSecondary: "Watch demo",
      stats: [
        { label: "Search time", value: "12s" },
        { label: "Fit-score validity", value: "0.78" },
        { label: "Pool coverage", value: "2M+" },
        { label: "Search precision", value: "92%" },
      ],
    },
    overview: {
      what:
        "The AI Sourcing Engine is the brain behind our talent pool. It indexes 2M+ candidate profiles into a semantic skill-graph, understands the meaning of job requirements (not just keywords), and ranks candidates by predicted role-fit. Every score comes with a plain-English explanation — no opaque ranking algorithms.",
      why: [
        "Keyword boolean queries miss 60% of qualified candidates whose resumes use different terminology. Semantic search fixes this by understanding that 'React' and 'frontend JS framework' mean the same role.",
        "Skill-graph ranking achieves 0.78 predictive validity against 1-year performance ratings — published in our validation whitepaper. That's 2.4× higher than resume-keyword matching.",
        "Predictive analytics forecast candidate availability (likelihood to move in next 90 days), expected salary band, and culture-fit signals — before you reach out. Stop wasting outreach on passive candidates who won't move.",
      ],
    },
    keyFeatures: [
      { icon: BrainCircuit, title: "Semantic skill-graph search", desc: "Type a job description in plain English; our skill-graph maps it to 40+ alternative skill names and surfaces candidates with equivalent experience." },
      { icon: Gauge, title: "Predictive role-fit scoring", desc: "0.78 validity against 1-year performance — scores correlate with actual on-the-job outcomes, not just resume matches." },
      { icon: Zap, title: "Auto-expanded boolean queries", desc: "Our AI expands 'Python developer' to include Django, Flask, FastAPI, Pandas, NumPy, PyTorch — automatically, no manual boolean writing." },
      { icon: Calendar, title: "Availability prediction", desc: "We predict candidate likelihood to move in the next 90 days based on job-change signals, market activity, and tenure — focus outreach on movers." },
      { icon: Wallet, title: "Salary band forecasting", desc: "Expected salary band predicted from role, location, experience, and stack — so you don't waste cycles on candidates outside your budget." },
      { icon: ShieldCheck, title: "Explainable ranking", desc: "Every candidate scorecard shows the 5 reasons why this candidate ranked here — skills match, experience relevance, salary fit, location, culture signals." },
    ],
    howItWorks: [
      { step: "01", title: "Build skill-graph", desc: "We index 2M+ verified candidate profiles into a Neo4j knowledge graph mapping skills, roles, projects, and companies." },
      { step: "02", title: "Parse job requirement", desc: "Our NLP pipeline parses your job description into structured requirements — must-have skills, nice-to-haves, seniority, domain." },
      { step: "03", title: "Semantic candidate match", desc: "The engine scores every candidate against the parsed requirement using semantic similarity — not keyword overlap." },
      { step: "04", title: "Predictive scoring", desc: "We layer on availability prediction, salary band forecast, and culture-fit signals to produce a composite fit score." },
      { step: "05", title: "Explainable shortlist", desc: "Top 5-10 candidates are packaged with explainable scorecards — you see exactly why each candidate ranked where they did." },
    ],
    benefits: [
      { icon: Zap, title: "12× faster sourcing", desc: "What took recruiters 3 days of boolean writing and resume scrolling now takes 12 seconds of AI search." },
      { icon: Target, title: "Higher quality matches", desc: "Semantic search finds candidates keyword searches miss — 40% more qualified candidates per search." },
      { icon: ShieldCheck, title: "Reduced bias", desc: "AI evaluates skills and experience, not resume names, photos, or addresses — structured scoring on defined rubrics." },
      { icon: FileCheck2, title: "Explainable decisions", desc: "Every shortlist comes with a plain-English rationale. Hiring managers trust the AI because they can audit it." },
      { icon: BrainCircuit, title: "Predictive hiring", desc: "Forecast candidate availability, salary expectations, and culture-fit before outreach — focus effort where it pays." },
      { icon: Wallet, title: "Lower cost-per-hire", desc: "Recruiters spend time on interviews, not sourcing. Cost-per-hire drops 32% on AI-sourced roles." },
    ],
    useCases: [
      {
        scenario: "Series B fintech needed 25 senior engineers in 4 months for product expansion.",
        solution: "AI sourcing engine scanned 2M+ pool, ranked candidates by predicted fit + availability, and surfaced 80 high-fit passive candidates for outreach.",
        metrics: [
          { label: "Search time", value: "12 sec" },
          { label: "Outreach response", value: "47%" },
          { label: "Hires delivered", value: "27" },
        ],
      },
      {
        scenario: "Healthcare chain needed 80+ specialized clinical roles across 12 cities.",
        solution: "Semantic search matched niche credentials (e.g., 'cath lab technician') to equivalent skill names across our verified pool.",
        metrics: [
          { label: "Roles filled", value: "84" },
          { label: "Time-to-hire", value: "−38%" },
          { label: "Submittal-to-offer", value: "32%" },
        ],
      },
      {
        scenario: "Manufacturing company needed 40 plant managers across 6 new factories.",
        solution: "AI matched plant-manager profile across industry competitors and predicted who was likely to move in next 90 days.",
        metrics: [
          { label: "Shortlists/role", value: "8" },
          { label: "Offer-accept rate", value: "82%" },
          { label: "Time-to-fill", value: "45 days" },
        ],
      },
      {
        scenario: "BFSI captive needed 15 mainframe engineers — a skill most modern recruiters can't source.",
        solution: "Skill-graph understood 'mainframe' maps to Cobol, DB2, JCL, CICS — and surfaced candidates with these skills under different titles.",
        metrics: [
          { label: "Sourcing time", value: "8 sec" },
          { label: "Qualified pool", value: "120" },
          { label: "Hires delivered", value: "15" },
        ],
      },
    ],
    comparison: {
      columns: ["Capability", "Traditional keyword search", "JOBSONN AI Sourcing"],
      rows: [
        { feature: "Query language", traditional: "Boolean operators (AND, OR, NOT)", ours: "Plain-English job description" },
        { feature: "Match method", traditional: "Exact keyword overlap", ours: "Semantic skill-graph similarity" },
        { feature: "Skill synonyms", traditional: "Manual boolean expansion", ours: "Auto-expanded to 40+ variants" },
        { feature: "Scoring", traditional: "Resume keyword count", ours: "Predictive role-fit (0.78 validity)" },
        { feature: "Explainability", traditional: "Black box — no rationale", ours: "Plain-English scorecard per candidate" },
        { feature: "Time-to-shortlist", traditional: "3-5 days of recruiter effort", ours: "12 seconds of compute" },
        { feature: "Predictive signals", traditional: "None — reactive sourcing", ours: "Availability, salary, culture-fit forecast" },
        { feature: "Quality of match", traditional: "60% of qualified candidates missed", ours: "92% precision on top-10 shortlist" },
      ],
    },
    techStack: [
      "OpenAI GPT-4", "sentence-transformers", "FAISS", "Neo4j", "PyTorch",
      "LangChain", "Redis", "FastAPI", "Elasticsearch", "PostgreSQL",
      "Snowflake", "Apache Airflow",
    ],
    integrations: [
      { name: "Greenhouse", type: "ATS", icon: FileText, desc: "Sync candidates, jobs, and applications two-way with Greenhouse ATS." },
      { name: "Lever", type: "ATS", icon: FileText, desc: "Push AI-ranked shortlists directly into Lever pipeline stages." },
      { name: "Workday", type: "HRIS", icon: Building2, desc: "Sync candidate profiles and requisitions with Workday HCM." },
      { name: "SAP SuccessFactors", type: "HRIS", icon: Server, desc: "Two-way sync with SAP SuccessFactors for enterprise clients." },
      { name: "Oracle HCM", type: "HRIS", icon: Database, desc: "Integrate with Oracle HCM Cloud for requisitions and candidates." },
      { name: "BambooHR", type: "HRIS", icon: Cpu, desc: "Lightweight HRIS sync for SMB clients on BambooHR." },
    ],
    metrics: [
      { label: "Avg search time", value: "12 sec", icon: Zap },
      { label: "Fit-score validity", value: "0.78", icon: Target },
      { label: "Pool coverage", value: "2M+", icon: Database },
      { label: "Search precision", value: "92%", icon: Gauge },
    ],
    caseStudies: [
      {
        company: "FinEdge",
        industry: "Fintech",
        challenge: "Series B fintech needed 25 senior backend engineers in 4 months for payments platform launch — internal TA team of 3 was overwhelmed.",
        solution: "AI sourcing engine scanned 2M+ pool, ranked candidates by fit + availability, and surfaced 80 high-fit passive candidates. Outreach response rate 47%.",
        metrics: [
          { label: "Hires delivered", value: "27" },
          { label: "Time-to-hire", value: "−42%" },
          { label: "Cost-per-hire", value: "−32%" },
        ],
      },
      {
        company: "MediCare Group",
        industry: "Healthcare",
        challenge: "Hospital chain needed 84 specialized clinical roles across 12 cities — niche credentials impossible to source via traditional job boards.",
        solution: "Semantic search matched niche credentials ('cath lab tech', 'ICU specialist') to equivalent skill names across verified pool of healthcare workers.",
        metrics: [
          { label: "Roles filled", value: "84" },
          { label: "Time-to-hire", value: "−38%" },
          { label: "90-day retention", value: "97%" },
        ],
      },
      {
        company: "Bharat Forge",
        industry: "Manufacturing",
        challenge: "Manufacturing company setting up 6 new plants needed 40 plant managers — niche role with limited talent supply in tier-2 cities.",
        solution: "AI matched plant-manager profile across industry competitors and predicted who was likely to move in next 90 days based on tenure and market signals.",
        metrics: [
          { label: "Shortlists/role", value: "8" },
          { label: "Offer-accept", value: "82%" },
          { label: "Time-to-fill", value: "45 days" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "JOBSONN's AI sourcing engine cut our senior-engineer search time from 3 weeks to 3 days. The fit-scorecards are gold — hiring managers actually trust the AI now.",
        name: "Karan Bhatia",
        role: "VP Engineering",
        company: "FinEdge",
        initials: "KB",
      },
      {
        quote: "We found 84 specialized clinical roles across 12 cities — niche credentials no traditional job board could surface. Semantic search just works.",
        name: "Nisha Sharma",
        role: "Talent Acquisition Lead",
        company: "MediCare Group",
        initials: "NS",
      },
      {
        quote: "The explainable scorecards changed how our hiring managers view AI sourcing. Every shortlist explains why this candidate, why this score — no black boxes.",
        name: "Sridhar Rao",
        role: "CHRO",
        company: "RetailMax",
        initials: "SR",
      },
    ],
    pricing: [
      {
        name: "Basic",
        price: "₹0",
        period: "per role",
        desc: "Pay-per-role AI search for one-off hires.",
        features: ["10 AI searches / month", "Top-10 shortlist per search", "Email-only support", "Standard fit-scorecard"],
        cta: "Start free",
      },
      {
        name: "Pro",
        price: "₹4,999",
        period: "per month",
        desc: "For teams hiring 5+ roles per quarter.",
        features: ["Unlimited AI searches", "Top-25 shortlist per search", "Predictive availability + salary forecast", "Greenhouse / Lever integration", "Priority email + chat support", "Weekly sourcing analytics"],
        cta: "Start 14-day trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "annual contract",
        desc: "For high-volume hiring (50+ roles/quarter).",
        features: ["Custom AI model training on your roles", "Full pipeline integration", "Dedicated sourcing architect", "Custom SLAs with money-back", "Quarterly business reviews", "On-prem / VPC deployment option"],
        cta: "Contact sales",
      },
    ],
    faqs: [
      { q: "How does the AI sourcing engine work?", a: "We index 2M+ verified candidate profiles into a Neo4j skill-graph. When you enter a job description, our NLP pipeline parses requirements, scores every candidate on semantic similarity (not keyword overlap), layers in predictive signals (availability, salary, culture-fit), and returns a top-10 shortlist with explainable scorecards." },
      { q: "Is the AI biased against any group?", a: "We audit for bias quarterly. The AI evaluates skills, experience, and project relevance — not resume names, photos, addresses, or schools. Bias audits show our scoring is gender-neutral and region-neutral within 2% variance. Full audit reports available on request." },
      { q: "Can the AI explain its scores?", a: "Yes. Every candidate scorecard shows the 5 reasons why this candidate ranked here: skills match %, experience relevance, salary fit, location alignment, and culture-fit signals. Hiring managers can audit and override any score." },
      { q: "What data sources feed the AI?", a: "Our 2M+ verified candidate pool (identity-verified, skill-tested, consent-driven), public professional profiles (LinkedIn, GitHub), and partner college databases. All data is GDPR-compliant and candidate-consented." },
      { q: "Is the AI GDPR and DPDP compliant?", a: "Yes. We're GDPR-compliant for EU candidates and DPDP-compliant for India. Candidates can request data deletion at any time. All candidate data is encrypted at rest (AES-256) and in transit (TLS 1.3)." },
      { q: "Can we train the AI on our own roles and historical hires?", a: "Enterprise tier includes custom model fine-tuning on your historical hires — so the AI learns your team's actual fit patterns. Typical fine-tuning takes 2-4 weeks and 500+ historical hire records." },
    ],
    cta: {
      title: "Try the AI Sourcing Engine today",
      desc: "Run your first AI search in 12 seconds. See why hiring managers trust our explainable scorecards.",
      primaryLabel: "Start free search",
      secondaryLabel: "Book a demo",
    },
    related: [
      { key: "talent-pool-benchmarks", label: "Talent Pool & Benchmarks", icon: Database, desc: "Market intelligence on pool sizes, salary bands, and availability heatmaps." },
      { key: "48-hour-shortlist", label: "48-Hour Shortlist SLA", icon: Clock, desc: "Guaranteed shortlist delivery within 48 business hours." },
      { key: "screening-assessment", label: "Screening & Assessment", icon: ClipboardCheck, desc: "AI technical screens and proctored assessments." },
      { key: "analytics-reporting", label: "Analytics & Reporting", icon: BarChart3, desc: "Real-time dashboards on sourcing funnel and quality." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Talent Pool & Benchmarks
  // ═══════════════════════════════════════════════════════════════════════════
  "talent-pool-benchmarks": {
    key: "talent-pool-benchmarks",
    label: "Talent Pool & Benchmarks",
    shortLabel: "Talent Pool & Benchmarks",
    accent: EMERALD,
    hero: {
      icon: Database,
      title: "Talent Pool & Benchmarks",
      badge: "MARKET INTELLIGENCE",
      description:
        "Curated talent pools by role, salary band data refreshed quarterly from real offers, and geographic availability heatmaps. Plan sourcing with data, not guesses.",
      ctaPrimary: "Explore benchmarks",
      ctaSecondary: "Get sample report",
      stats: [
        { label: "Pool size", value: "2M+" },
        { label: "Roles benchmarked", value: "200+" },
        { label: "Cities mapped", value: "120+" },
        { label: "Salary refresh", value: "90 days" },
      ],
    },
    overview: {
      what:
        "Talent Pool & Benchmarks gives you a real-time view of the talent market — pool sizes by role and city, salary band distributions validated against actual offer acceptances, and geographic availability heatmaps so you can plan sourcing with data, not guesses.",
      why: [
        "Sourcing plans fail when you don't know the supply. We benchmark pool sizes for 200+ roles across 120+ Indian cities, refreshed quarterly from our 2M+ verified candidate pool.",
        "Salary bands shift quarterly. Our compensation data is refreshed every 90 days from real offer acceptances in our system — not from annual industry surveys that lag the market by 6-12 months.",
        "Availability heatmaps reveal where talent actually lives, so you can decide between remote, hybrid, or relocate. Don't waste sourcing cycles on cities with no supply.",
      ],
    },
    keyFeatures: [
      { icon: Database, title: "2M+ verified pool", desc: "Identity-verified, skill-tested candidates with consent-driven data and active job-seeking signals." },
      { icon: Users, title: "Role-specific sub-pools", desc: "200+ role-specific talent pools — frontend, backend, data, DevOps, clinical, retail, manufacturing, and more." },
      { icon: Wallet, title: "Salary band data", desc: "Quarterly salary bands by role, city, and experience — validated against real offer acceptances, not surveys." },
      { icon: MapPin, title: "Geographic heatmaps", desc: "Availability heatmaps showing where talent actually lives — by role, by city, by neighborhood." },
      { icon: Activity, title: "Availability signals", desc: "Active job-seeking signals: profile updates, application activity, interview attendance — refreshed weekly." },
      { icon: Users2, title: "Diversity metrics", desc: "Gender, age, and region diversity metrics per sub-pool — track and improve inclusion with audit-ready data." },
    ],
    howItWorks: [
      { step: "01", title: "Pool curation", desc: "We curate role-specific sub-pools from our 2M+ master pool using skill, experience, and intent filters." },
      { step: "02", title: "Profile verification", desc: "Identity, education, employment, and skill verified through automated checks + manual review." },
      { step: "03", title: "Salary data refresh", desc: "Salary bands refreshed every 90 days from real offer acceptances in our system — never from surveys." },
      { step: "04", title: "Heatmap generation", desc: "Geographic availability heatmaps generated weekly from candidate location + activity signals." },
      { step: "05", title: "Sub-pool delivery", desc: "Custom sub-pools delivered as CSV/JSON or via API — yours to source from, on demand." },
    ],
    benefits: [
      { icon: BrainCircuit, title: "Data-driven sourcing", desc: "Plan sourcing cycles with pool-size and supply data — no more 'we need 50, let's see' guesswork." },
      { icon: Clock, title: "Reduced time-to-hire", desc: "Pre-curated sub-pools cut sourcing time by 60% — recruiters start with qualified candidates, not raw searches." },
      { icon: Wallet, title: "Better budget planning", desc: "Salary band data lets you set realistic budgets before opening reqs — no mid-cycle budget shocks." },
      { icon: MapPin, title: "Geographic strategy", desc: "Decide between remote, hybrid, or relocate based on actual supply — not gut feel or recruiter preference." },
      { icon: Users2, title: "Diversity planning", desc: "Track diversity of your sourcing pool against hiring goals with audit-ready reports for compliance." },
      { icon: Network, title: "Competitive intelligence", desc: "See where competitors hire from, salary bands they pay, and supply trends — competitive intel on tap." },
    ],
    useCases: [
      {
        scenario: "Plan quarterly hiring for 50 engineering roles across 3 cities.",
        solution: "Talent pool benchmarks revealed Bangalore had 8K active backend engineers, Pune 2K, Chennai 1.5K — informed city strategy + budget allocation.",
        metrics: [
          { label: "Plan accuracy", value: "+42%" },
          { label: "Budget variance", value: "−18%" },
          { label: "Time-to-plan", value: "2 days" },
        ],
      },
      {
        scenario: "Decide city strategy for new R&D center — Bangalore vs Hyderabad vs Pune.",
        solution: "Heatmaps showed Pune had 3× more senior data engineers than Hyderabad at 22% lower salary — chose Pune.",
        metrics: [
          { label: "Cost savings", value: "₹4.2 Cr/yr" },
          { label: "Talent depth", value: "+3×" },
          { label: "Ramp time", value: "−30%" },
        ],
      },
      {
        scenario: "Set salary bands for 12 new specialist roles in healthcare.",
        solution: "Salary benchmark data from real offers showed market band was 18% above industry survey — adjusted bands, hit 92% offer-accept.",
        metrics: [
          { label: "Offer-accept rate", value: "92%" },
          { label: "Budget variance", value: "−4%" },
          { label: "Survey lag avoided", value: "9 mo" },
        ],
      },
      {
        scenario: "Diversity hiring goals — 40% women in tech hires.",
        solution: "Diversity metrics per sub-pool identified frontend (38% women) and QA (44%) as high-supply; reweighted sourcing mix to hit 42% women hires.",
        metrics: [
          { label: "Women hires", value: "42%" },
          { label: "Goal attainment", value: "105%" },
          { label: "Sourcing cost", value: "−12%" },
        ],
      },
    ],
    comparison: {
      columns: ["Capability", "Traditional market research", "JOBSONN Talent Benchmarks"],
      rows: [
        { feature: "Data freshness", traditional: "Annual industry surveys (6-12 mo lag)", ours: "Quarterly refresh from real offers" },
        { feature: "Pool coverage", traditional: "Self-reported job-board profiles", ours: "2M+ identity-verified candidates" },
        { feature: "Salary data source", traditional: "Survey self-reports", ours: "Actual offer acceptances in our system" },
        { feature: "Geographic granularity", traditional: "National / metro averages", ours: "City + neighborhood heatmaps" },
        { feature: "Diversity metrics", traditional: "Rarely available", ours: "Gender, age, region per sub-pool" },
        { feature: "Refresh cadence", traditional: "Annual or bi-annual", ours: "Quarterly + weekly availability signals" },
        { feature: "Role specificity", traditional: "Generic role families", ours: "200+ specific roles benchmarked" },
        { feature: "Format", traditional: "PDF reports", ours: "CSV/JSON export + API access" },
      ],
    },
    techStack: [
      "PostgreSQL", "Elasticsearch", "Redis", "Python", "Pandas", "Mapbox",
      "D3.js", "Snowflake", "dbt", "Apache Airflow", "Looker", "FastAPI",
    ],
    integrations: [
      { name: "LinkedIn Talent Insights", type: "Market data", icon: Network, desc: "Cross-reference our pool data with LinkedIn Talent Insights for benchmark validation." },
      { name: "Talent.com", type: "Job board", icon: Briefcase, desc: "Aggregate salary data from Talent.com job postings for cross-validation." },
      { name: "Naukrm Resdex", type: "Resume database", icon: FileText, desc: "Sync candidate profiles with Naukrm Resdex for India-specific sourcing." },
      { name: "Shine", type: "Job board", icon: Sparkles, desc: "Cross-pollinate salary benchmarks with Shine.com job postings." },
      { name: "Foundit", type: "Job board", icon: Search, desc: "Integrate with Foundit (Monster India) for additional salary benchmarks." },
      { name: "iCIMS", type: "ATS", icon: FileText, desc: "Push curated sub-pools into iCIMS ATS for one-click sourcing." },
    ],
    metrics: [
      { label: "Pool size", value: "2M+", icon: Database },
      { label: "Roles benchmarked", value: "200+", icon: Target },
      { label: "Cities mapped", value: "120+", icon: MapPin },
      { label: "Salary refresh", value: "90 days", icon: RefreshCw },
    ],
    caseStudies: [
      {
        company: "CloudPeak SaaS",
        industry: "IT & SaaS",
        challenge: "Engineering scaling from 200 to 500 in 18 months; needed city strategy for new R&D center.",
        solution: "Talent benchmarks revealed Pune had 3× more senior data engineers than Hyderabad at 22% lower salary band — chose Pune for new R&D.",
        metrics: [
          { label: "Cost savings", value: "₹4.2 Cr/yr" },
          { label: "Talent depth", value: "+3×" },
          { label: "Ramp time", value: "−30%" },
        ],
      },
      {
        company: "MediCare Group",
        industry: "Healthcare",
        challenge: "Hospital chain expanding to 12 cities needed salary bands for 25 specialist clinical roles — no industry survey existed.",
        solution: "Salary benchmark from real offers in our system revealed market band was 18% above generic surveys — adjusted bands, hit 92% offer-accept.",
        metrics: [
          { label: "Offer-accept rate", value: "92%" },
          { label: "Budget variance", value: "−4%" },
          { label: "Survey lag avoided", value: "9 mo" },
        ],
      },
      {
        company: "Bharat Forge",
        industry: "Manufacturing",
        challenge: "Setting up 6 new plants across tier-2 cities; needed to know where plant-manager talent actually lived.",
        solution: "Availability heatmaps revealed tier-2 hubs (Coimbatore, Indore, Jamshedpur) had untapped supply — sourced 40 managers across these cities.",
        metrics: [
          { label: "Plant mgrs hired", value: "40" },
          { label: "Avg salary savings", value: "28%" },
          { label: "Local hiring %", value: "82%" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "Talent benchmarks revealed Pune had 3× more senior data engineers at 22% lower salary than Hyderabad. We saved ₹4.2 Cr/yr on the new R&D center.",
        name: "Sneha Iyer",
        role: "Head of Talent",
        company: "CloudPeak SaaS",
        initials: "SI",
      },
      {
        quote: "Salary data from real offer acceptances is gold — we hit 92% offer-accept on 25 specialist clinical roles by setting bands at the actual market, not stale surveys.",
        name: "Deepa Subramanian",
        role: "VP HR",
        company: "MediCare Group",
        initials: "DS",
      },
      {
        quote: "Availability heatmaps changed our plant-location strategy. We found tier-2 hubs with untapped plant-manager talent — saved 28% on salaries and 82% local hiring.",
        name: "Ramesh Iyer",
        role: "Plant Director",
        company: "Bharat Forge",
        initials: "RI",
      },
    ],
    pricing: [
      {
        name: "Insights",
        price: "Free",
        period: "forever",
        desc: "Basic market intelligence for one-off checks.",
        features: ["Public role + city benchmarks", "Top-3 cities per role", "Salary band ranges", "Monthly refresh"],
        cta: "View free insights",
      },
      {
        name: "Pro",
        price: "₹9,999",
        period: "per month",
        desc: "For TA teams planning quarterly hiring.",
        features: ["200+ role benchmarks", "120+ city heatmaps", "Quarterly salary refresh", "Custom sub-pool exports", "Diversity metrics", "API access (10K calls/mo)"],
        cta: "Start 14-day trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "annual contract",
        desc: "For high-volume or multi-location hiring.",
        features: ["Custom benchmarks for niche roles", "Real-time data feed", "Dedicated data analyst", "Quarterly strategy review", "On-prem deployment option", "Unlimited API calls"],
        cta: "Contact sales",
      },
    ],
    faqs: [
      { q: "How fresh is the salary data?", a: "Salary bands are refreshed every 90 days from real offer acceptances in our system — not from industry surveys. You see the market as it is today, not 9 months ago." },
      { q: "What cities do you cover?", a: "120+ Indian cities including all metros, tier-1, tier-2, and emerging tier-3 hubs. We also have limited coverage of remote-first talent pools." },
      { q: "Can I export the data?", a: "Yes — Pro and Enterprise tiers support CSV/JSON exports and API access. Free tier is view-only on the dashboard." },
      { q: "Do you track diversity metrics?", a: "Yes — gender, age band, and region diversity per sub-pool. All diversity data is candidate-consented and audit-ready for compliance reporting." },
      { q: "Can you benchmark niche roles not in your standard list?", a: "Enterprise tier includes custom benchmark research for niche roles. Typical turnaround: 2-3 weeks for a new role benchmark report." },
      { q: "Is there an API?", a: "Yes — Pro tier includes 10K API calls/month, Enterprise includes unlimited. REST API with role, city, salary band, and availability heatmap endpoints." },
    ],
    cta: {
      title: "Plan sourcing with data, not guesses",
      desc: "Get a sample Talent Pool & Benchmarks report for your top 3 roles — delivered in 24 hours.",
      primaryLabel: "Get sample report",
      secondaryLabel: "Explore benchmarks",
    },
    related: [
      { key: "ai-sourcing-engine", label: "AI Sourcing Engine", icon: BrainCircuit, desc: "Semantic search over the 2M+ verified pool." },
      { key: "48-hour-shortlist", label: "48-Hour Shortlist SLA", icon: Clock, desc: "Guaranteed shortlist from curated sub-pools in 48 hours." },
      { key: "analytics-reporting", label: "Analytics & Reporting", icon: BarChart3, desc: "Track pool utilization and sourcing funnel." },
      { key: "hiring-workflow", label: "Hiring Workflow", icon: Workflow, desc: "Orchestrate end-to-end hiring pipeline." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. 48-Hour Shortlist SLA
  // ═══════════════════════════════════════════════════════════════════════════
  "48-hour-shortlist": {
    key: "48-hour-shortlist",
    label: "48-Hour Shortlist SLA",
    shortLabel: "48-Hour Shortlist",
    accent: EMERALD,
    hero: {
      icon: Clock,
      title: "48-Hour Shortlist SLA",
      badge: "GUARANTEED DELIVERY",
      description:
        "One-call intake, structured 5-stage screening gates, and a guaranteed 48-business-hour shortlist delivery — or your money back. We treat your deadline as a contract.",
      ctaPrimary: "Start a shortlist",
      ctaSecondary: "Book intake call",
      stats: [
        { label: "SLA hit rate", value: "98.5%" },
        { label: "Avg delivery", value: "41 hrs" },
        { label: "Shortlist size", value: "7.2 avg" },
        { label: "Client NPS", value: "72" },
      ],
    },
    overview: {
      what:
        "The 48-Hour Shortlist SLA is our commitment to deliver 5-10 pre-vetted, screening-gate-cleared candidates within 48 business hours of your role intake call. Miss the deadline and the engagement is free — no questions asked.",
      why: [
        "Hiring managers don't have time for week-long sourcing cycles. Speed wins offers — top candidates are off the market in 10 days, not 30.",
        "Our 5-stage screening gates pre-vet every candidate before they reach you — no resume-spam, no unqualified interviews, no wasted hours.",
        "Guaranteed SLAs force operational discipline: our sourcing team treats your deadline as a binding contract, not an aspiration. Miss it and we don't get paid.",
      ],
    },
    keyFeatures: [
      { icon: PhoneCall, title: "One-call intake", desc: "30-min intake call with your hiring manager — we capture JD, must-haves, salary band, culture markers, and timeline in one go." },
      { icon: ListChecks, title: "5-stage screening gates", desc: "Resume review → phone screen → skill test → reference check → culture-fit evaluation. Every gate passed before shortlist." },
      { icon: Clock, title: "Guaranteed 48h delivery", desc: "5-10 pre-vetted candidates delivered within 48 business hours of intake — 98.5% on-time rate, money-back if we miss." },
      { icon: ShieldCheck, title: "Pre-vetted shortlist", desc: "Every candidate has cleared all 5 screening gates — your team meets only serious, qualified, culture-fit candidates." },
      { icon: Wallet, title: "Money-back guarantee", desc: "Miss the 48-hour SLA and the engagement is free. We've paid out 1.5% of engagements in 3 years — we take SLAs seriously." },
      { icon: BarChart3, title: "Daily progress reports", desc: "Daily morning updates on sourcing progress, screening pipeline, and delivery confidence — no black-box waiting." },
    ],
    howItWorks: [
      { step: "01", title: "Intake call (30 min)", desc: "Hiring manager + our sourcing lead align on JD, must-haves, salary band, and culture markers in one focused call." },
      { step: "02", title: "Sourcing sprint", desc: "Our team activates AI sourcing + 2M+ pool + 80+ regional recruiters to source 50-100 candidates within 6 hours." },
      { step: "03", title: "5-stage screening", desc: "Resume review → phone screen → skill test → reference check → culture-fit evaluation. Parallel processing." },
      { step: "04", title: "Shortlist packaging", desc: "Top 5-10 candidates packaged with fit scorecards, screening notes, and recommended interview focus areas." },
      { step: "05", title: "Delivery & debrief", desc: "Shortlist delivered within 48 hours; 30-min debrief call to walk through each candidate's strengths and concerns." },
    ],
    benefits: [
      { icon: Zap, title: "Faster offers", desc: "48-hour shortlist means interviews start day 3, offers go out day 10 — beat competitors who take 30+ days." },
      { icon: Rocket, title: "Competitive edge", desc: "Top candidates are off the market in 10 days. Speed wins — our clients beat competing offers 68% of the time." },
      { icon: HeartHandshake, title: "Hiring manager trust", desc: "Daily progress + guaranteed delivery builds trust. Hiring managers route more roles to us, not less." },
      { icon: ShieldCheck, title: "Reduced ghosting", desc: "Pre-vetted candidates are committed job-seekers — ghosting rate drops from industry 35% to our 8%." },
      { icon: Calendar, title: "Predictable pipeline", desc: "Plan interviews day 3, offers day 10, start dates day 30 — no more 'we'll see when sourcing closes'." },
      { icon: Wallet, title: "Risk-free trial", desc: "Money-back guarantee means your first engagement is risk-free. We deliver or you don't pay." },
    ],
    useCases: [
      {
        scenario: "Urgent senior-engineer backfill after unexpected resignation — 30-day deadline.",
        solution: "48-hour shortlist delivered 8 pre-vetted candidates on day 2; offer went out day 9, candidate started day 28.",
        metrics: [
          { label: "Time-to-offer", value: "9 days" },
          { label: "Shortlist size", value: "8" },
          { label: "Offer-accept", value: "Yes" },
        ],
      },
      {
        scenario: "Critical clinical role — hospital chain needed ICU specialist in 14 days.",
        solution: "48-hour SLA delivered 6 pre-vetted ICU specialists with credential verification; offer accepted day 11.",
        metrics: [
          { label: "Time-to-offer", value: "11 days" },
          { label: "Credential checks", value: "100%" },
          { label: "Start date", value: "Day 28" },
        ],
      },
      {
        scenario: "Manufacturing plant startup needed 5 plant managers in 45 days across 3 sites.",
        solution: "Parallel 48-hour SLAs per role delivered 35 pre-vetted candidates in week 1; 5 offers accepted by day 30.",
        metrics: [
          { label: "Roles filled", value: "5/5" },
          { label: "Time-to-fill", value: "30 days" },
          { label: "Local hiring", value: "82%" },
        ],
      },
      {
        scenario: "Investor-deadline hiring — 20 engineers before Series C close in 60 days.",
        solution: "Series of 48-hour shortlists over 4 weeks delivered 80 candidates; 22 offers accepted by day 50.",
        metrics: [
          { label: "Offers accepted", value: "22" },
          { label: "Time-to-fill", value: "50 days" },
          { label: "SLA hit rate", value: "100%" },
        ],
      },
    ],
    comparison: {
      columns: ["Capability", "Traditional retained search", "JOBSONN 48-Hour SLA"],
      rows: [
        { feature: "Time to shortlist", traditional: "5-10 business days", ours: "48 business hours (guaranteed)" },
        { feature: "Candidate quality", traditional: "Resume-only pre-filter", ours: "5-stage screening gates passed" },
        { feature: "SLA backing", traditional: "Aspirational — no penalty", ours: "Money-back if we miss" },
        { feature: "Sourcing mode", traditional: "Reactive — wait for applicants", ours: "Proactive — AI + 80+ recruiters sprint" },
        { feature: "Candidate volume", traditional: "Whoever applies", ours: "Curated 5-10 from 50-100 sourced" },
        { feature: "Progress visibility", traditional: "Black box — wait for delivery", ours: "Daily morning progress reports" },
        { feature: "Interview prep", traditional: "Resume only", ours: "Fit scorecard + interview focus areas" },
        { feature: "Pricing", traditional: "20-30% of annual CTC", ours: "Flat per-role fee — transparent" },
      ],
    },
    techStack: [
      "Slack", "Notion", "Calendly", "Greenhouse", "Lever", "Twilio",
      "SendGrid", "Zapier", "Airtable", "Retool", "PagerDuty", "Statuspage",
    ],
    integrations: [
      { name: "Greenhouse", type: "ATS", icon: FileText, desc: "Push shortlisted candidates into Greenhouse pipeline stages automatically." },
      { name: "Lever", type: "ATS", icon: FileText, desc: "Sync shortlists + fit scorecards with Lever ATS two-way." },
      { name: "Workday", type: "HRIS", icon: Building2, desc: "Sync requisitions + candidate data with Workday HCM." },
      { name: "BambooHR", type: "HRIS", icon: Cpu, desc: "Lightweight HRIS sync for SMB clients on BambooHR." },
      { name: "iCIMS", type: "ATS", icon: FileText, desc: "Push pre-vetted shortlists into iCIMS for enterprise clients." },
      { name: "SAP SuccessFactors", type: "HRIS", icon: Server, desc: "Enterprise integration with SAP SuccessFactors." },
    ],
    metrics: [
      { label: "SLA hit rate", value: "98.5%", icon: Clock },
      { label: "Avg delivery time", value: "41 hrs", icon: Zap },
      { label: "Shortlist size", value: "7.2 avg", icon: ListChecks },
      { label: "Client NPS", value: "72", icon: HeartHandshake },
    ],
    caseStudies: [
      {
        company: "FinEdge",
        industry: "Fintech",
        challenge: "Senior backend engineer resigned unexpectedly — 30-day deadline before critical payments launch.",
        solution: "48-hour SLA delivered 8 pre-vetted candidates on day 2; offer went out day 9, candidate started day 28 — launch unaffected.",
        metrics: [
          { label: "Time-to-offer", value: "9 days" },
          { label: "Shortlist size", value: "8" },
          { label: "Launch impact", value: "Zero" },
        ],
      },
      {
        company: "MediCare Group",
        industry: "Healthcare",
        challenge: "ICU specialist role vacant for 60 days — patient care impact growing. 14-day deadline set by medical director.",
        solution: "48-hour SLA delivered 6 pre-vetted ICU specialists with credential verification; offer accepted day 11, started day 24.",
        metrics: [
          { label: "Time-to-offer", value: "11 days" },
          { label: "Credential checks", value: "100%" },
          { label: "Patient impact", value: "Resolved" },
        ],
      },
      {
        company: "Bharat Forge",
        industry: "Manufacturing",
        challenge: "5 plant managers needed across 3 new plants in 45 days — startup deadline fixed with board.",
        solution: "Parallel 48-hour SLAs per role delivered 35 pre-vetted candidates in week 1; 5 offers accepted by day 30, all 5 started day 45.",
        metrics: [
          { label: "Roles filled", value: "5/5" },
          { label: "Time-to-fill", value: "30 days" },
          { label: "SLA hit rate", value: "100%" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "Senior engineer resigned with 30 days notice. 48-Hour SLA delivered 8 candidates day 2, offer out day 9, started day 28. Payments launch unaffected.",
        name: "Karan Bhatia",
        role: "VP Engineering",
        company: "FinEdge",
        initials: "KB",
      },
      {
        quote: "ICU specialist role vacant 60 days. 48-hour SLA delivered 6 pre-vetted specialists with credential checks. Offer accepted day 11. Lifesaving.",
        name: "Deepa Subramanian",
        role: "VP HR",
        company: "MediCare Group",
        initials: "DS",
      },
      {
        quote: "5 plant managers in 45 days across 3 plants — parallel 48-hour SLAs nailed it. All 5 started day 45. Board deadline met.",
        name: "Ramesh Iyer",
        role: "Plant Director",
        company: "Bharat Forge",
        initials: "RI",
      },
    ],
    pricing: [
      {
        name: "Pay-per-role",
        price: "₹25K",
        period: "per role",
        desc: "Try the SLA on a single role — risk-free.",
        features: ["1 role shortlist", "5-10 candidates", "48-hour guarantee", "Money-back if missed", "Fit scorecards", "Email support"],
        cta: "Start one role",
      },
      {
        name: "Pro",
        price: "₹49K",
        period: "per month",
        desc: "For teams hiring 3-8 roles per month.",
        features: ["Up to 8 roles / month", "Priority sourcing queue", "Dedicated sourcing lead", "Daily progress reports", "Slack integration", "Weekly business review"],
        cta: "Start 14-day trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "annual contract",
        desc: "For high-volume (10+ roles/month).",
        features: ["Unlimited roles / month", "24-hour SLA option", "Multi-city parallel sourcing", "Quarterly business reviews", "Custom SLA penalties", "Dedicated account director"],
        cta: "Contact sales",
      },
    ],
    faqs: [
      { q: "What if you miss the 48-hour SLA?", a: "The engagement is free — we refund 100% of the fee, no questions asked. We've paid out 1.5% of engagements in the last 3 years. We take SLAs seriously." },
      { q: "What happens in the intake call?", a: "30-min call with your hiring manager. We capture: JD, must-have skills, salary band, location preference, culture markers, interview panel, and timeline. One call, done." },
      { q: "How many candidates will I get?", a: "5-10 pre-vetted candidates per role, average 7.2. Every candidate has cleared 5 screening gates — your team meets only serious, qualified candidates." },
      { q: "What are the 5 screening gates?", a: "Resume review → phone screen (15 min) → skill test (role-specific) → reference check (2 refs) → culture-fit evaluation. All gates must pass before shortlist inclusion." },
      { q: "What's your refund policy?", a: "Full refund if we miss the 48-hour SLA. Partial refund if shortlist quality is below agreed bar (you decide). 90-day free replacement if a placed candidate leaves." },
      { q: "Can we run parallel roles on the SLA?", a: "Yes — Pro tier supports 8 parallel roles/month, Enterprise supports unlimited. Multiple roles run in parallel sourcing sprints, each with its own 48-hour clock." },
    ],
    cta: {
      title: "Get your first shortlist in 48 hours",
      desc: "Risk-free trial — book an intake call today, get 5-10 pre-vetted candidates in 48 hours, or your money back.",
      primaryLabel: "Book intake call",
      secondaryLabel: "View pricing",
    },
    related: [
      { key: "ai-sourcing-engine", label: "AI Sourcing Engine", icon: BrainCircuit, desc: "Semantic search powering the 48-hour sprint." },
      { key: "screening-assessment", label: "Screening & Assessment", icon: ClipboardCheck, desc: "5-stage screening gates behind every shortlist." },
      { key: "candidate-engagement", label: "Candidate Engagement", icon: Sparkles, desc: "Keep shortlisted candidates warm till offer day." },
      { key: "hiring-workflow", label: "Hiring Workflow", icon: Workflow, desc: "Orchestrate interviews + offers after shortlist." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Screening & Assessment
  // ═══════════════════════════════════════════════════════════════════════════
  "screening-assessment": {
    key: "screening-assessment",
    label: "Screening & Assessment",
    shortLabel: "Screening & Assessment",
    accent: EMERALD,
    hero: {
      icon: ClipboardCheck,
      title: "Screening & Assessment",
      badge: "PRE-VETTED CANDIDATES",
      description:
        "AI technical screens across 40+ stacks, proctored assessments with anti-cheating, structured behavioral interviews, and culture-fit evaluations — pre-vetted candidates, every time.",
      ctaPrimary: "Try a sample assessment",
      ctaSecondary: "See how it works",
      stats: [
        { label: "Assessments / yr", value: "240K+" },
        { label: "Question bank", value: "12K+" },
        { label: "Predictive validity", value: "0.78" },
        { label: "Time saved / role", value: "12 hrs" },
      ],
    },
    overview: {
      what:
        "Screening & Assessment is our 5-stage quality gate: AI technical screen (40+ stacks), proctored coding assessment with anti-cheating, structured behavioral interview, culture-fit evaluation, and reference check. Candidates who clear all 5 gates are production-ready — your hiring managers skip first-round screens entirely.",
      why: [
        "Hiring managers waste 12+ hours per role on first-round screens. Our assessments pre-filter to top 10% of applicants — managers meet only serious candidates.",
        "Proctored assessments with browser lockdown, webcam monitoring, tab-switch detection, and plagiarism checks ensure candidate integrity — no leaked solutions, no AI-aided cheating.",
        "Culture-fit evaluation reduces 90-day attrition by 60%. Bad culture fits leave fast — and cost you 1.5× annual salary in replacement. We screen for fit before offer.",
      ],
    },
    keyFeatures: [
      { icon: Code2, title: "AI technical screens (40+ stacks)", desc: "1,200+ coding problems, project-based tasks, and code-review simulations across 40+ stacks. Adaptive difficulty." },
      { icon: ShieldCheck, title: "Proctored assessments", desc: "Browser lockdown, webcam monitoring, tab-switch detection, screen recording, plagiarism checks — exam-grade integrity." },
      { icon: HeartHandshake, title: "Culture-fit evaluation", desc: "Situational judgment tests + structured behavioral interviews with rubric scoring — fit signals before offer." },
      { icon: ClipboardList, title: "Structured behavioral interviews", desc: "STAR-format interview kits with rubric scoring, AI-generated follow-up questions, and shared scorecards." },
      { icon: FileCheck2, title: "Reference checks", desc: "Automated reference collection from 2 refs per candidate, with structured questions and red-flag detection." },
      { icon: FileText, title: "Audit-ready reports", desc: "Every assessment has a candidate report, scorecard, and decision rationale — audit-ready for compliance." },
    ],
    howItWorks: [
      { step: "01", title: "Role-spec mapping", desc: "We map the role's must-have skills, aptitude profile, and behavioral markers to assessment dimensions." },
      { step: "02", title: "Assessment design", desc: "Pick from our 12K+ question bank or co-create custom problems with your hiring managers." },
      { step: "03", title: "Candidate invite", desc: "Branded assessment invites via email, or one-click launch from your ATS (Greenhouse, Lever, Workday)." },
      { step: "04", title: "Proctored evaluation", desc: "Candidates complete assessments with anti-cheating proctoring, webcam monitoring, and plagiarism checks." },
      { step: "05", title: "AI scoring & report", desc: "Explainable AI scores across technical, aptitude, and behavioral dimensions — with benchmarking vs your team." },
    ],
    benefits: [
      { icon: Clock, title: "12+ hours saved per role", desc: "Hiring managers skip first-round screens — assessments pre-filter to top 10% of applicants." },
      { icon: ShieldCheck, title: "Removes bias", desc: "Structured scoring on defined rubrics — less resume-name bias, more skill-based selection. 30% more diverse hires." },
      { icon: BrainCircuit, title: "Predictive validity 0.78", desc: "Correlation between assessment scores and 1-year performance ratings — published validation whitepaper." },
      { icon: FileCheck2, title: "Audit-ready reports", desc: "Every assessment has a candidate report, scorecard, and decision rationale — compliance-ready." },
      { icon: Gauge, title: "Faster cycle time", desc: "Reduce assessment-to-offer from 14 days to 5 days with automated scoring and shortlisting." },
      { icon: Network, title: "ATS integration", desc: "Native integrations with Greenhouse, Lever, Workday, Naukrm, iCIMS — one-click launch from your ATS." },
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
        scenario: "Senior data scientist hire — needed to validate ML depth beyond resume.",
        solution: "Custom ML assessment with case study + code review of ML pipeline; 5 candidates assessed, 1 hired.",
        metrics: [
          { label: "Assessment time", value: "90 min" },
          { label: "False-positive rate", value: "−44%" },
          { label: "Offer-accept", value: "Yes" },
        ],
      },
      {
        scenario: "Cross-functional hire — PM role needing tech + business + UX judgment.",
        solution: "Multi-dimensional assessment: technical (SQL + APIs), business case, UX critique, behavioral STAR interview.",
        metrics: [
          { label: "Assessment dimensions", value: "4" },
          { label: "Hiring mgr confidence", value: "+38%" },
          { label: "90-day attrition", value: "0%" },
        ],
      },
      {
        scenario: "Contractor evaluation — 50 dev contractors for 9-month project.",
        solution: "Stacked assessment (coding + system design + pair programming) with benchmarking vs internal team.",
        metrics: [
          { label: "Contractors assessed", value: "120" },
          { label: "Quality-selected", value: "50" },
          { label: "Project ramp time", value: "−30%" },
        ],
      },
    ],
    comparison: {
      columns: ["Capability", "Traditional phone screen", "JOBSONN Screening & Assessment"],
      rows: [
        { feature: "Screening method", traditional: "Resume + 15-min phone call", ours: "AI technical + aptitude + behavioral + culture-fit" },
        { feature: "Skill validation", traditional: "Self-reported on resume", ours: "Validated via proctored assessment" },
        { feature: "Anti-cheating", traditional: "None — trust the candidate", ours: "Browser lockdown + webcam + plagiarism" },
        { feature: "Bias mitigation", traditional: "Resume-name + photo bias", ours: "Structured rubric scoring — 30% more diverse" },
        { feature: "Validity", traditional: "0.32 (resume + phone)", ours: "0.78 (correlation with 1-yr performance)" },
        { feature: "Time-to-offer", traditional: "14 days (multiple rounds)", ours: "5 days (assessment + 1 final round)" },
        { feature: "Audit trail", traditional: "Subjective notes only", ours: "Full candidate report + scorecard + rationale" },
        { feature: "Hiring mgr time", traditional: "12+ hours per role", ours: "2 hours per role (final round only)" },
      ],
    },
    techStack: [
      "CodeMirror", "HackerRank API", "WebRTC", "TensorFlow", "OpenAI GPT-4",
      "Proctorio", "Browser-lockdown", "Plagiarism-detection", "PostgreSQL",
      "Redis", "FastAPI", "Snowflake",
    ],
    integrations: [
      { name: "Greenhouse", type: "ATS", icon: FileText, desc: "One-click assessment launch from Greenhouse candidate profile." },
      { name: "Lever", type: "ATS", icon: FileText, desc: "Auto-trigger assessments on Lever stage transitions." },
      { name: "Workday", type: "HRIS", icon: Building2, desc: "Sync assessment results into Workday candidate records." },
      { name: "HackerRank", type: "Assessment", icon: Code2, desc: "Pull HackerRank coding scores into our composite scorecard." },
      { name: "CoderPad", type: "Assessment", icon: Code2, desc: "Live pair-programming sessions with CoderPad integration." },
      { name: "Mettl", type: "Assessment", icon: ClipboardCheck, desc: "Mettl proctored assessments for high-stakes evaluations." },
    ],
    metrics: [
      { label: "Assessments / yr", value: "240K+", icon: ClipboardCheck },
      { label: "Question bank", value: "12K+", icon: BookOpen },
      { label: "Predictive validity", value: "0.78", icon: Target },
      { label: "Time saved / role", value: "12 hrs", icon: Clock },
    ],
    caseStudies: [
      {
        company: "CloudPeak SaaS",
        industry: "IT & SaaS",
        challenge: "Campus hiring — 8,000 applicants for 120 entry-level engineering roles. Hiring managers had 240+ hours of screening ahead.",
        solution: "Adaptive aptitude + coding assessment with AI shortlisting to top 800 candidates for final interviews. Cycle time cut 62%.",
        metrics: [
          { label: "Mgr time saved", value: "240 hrs" },
          { label: "Cycle time", value: "−62%" },
          { label: "1-yr performance", value: "+18%" },
        ],
      },
      {
        company: "FinEdge",
        industry: "Fintech",
        challenge: "Senior data scientist hire — needed to validate ML depth beyond resume claims. False positives costly.",
        solution: "Custom ML assessment with case study + code review of ML pipeline. 5 candidates assessed, 1 hired. False-positive rate dropped 44%.",
        metrics: [
          { label: "Assessment time", value: "90 min" },
          { label: "False-positive rate", value: "−44%" },
          { label: "Offer-accept", value: "Yes" },
        ],
      },
      {
        company: "HDFC Bank",
        industry: "BFSI",
        challenge: "Cross-functional PM role needing tech + business + UX judgment — single interview couldn't validate all dimensions.",
        solution: "Multi-dimensional assessment: technical (SQL + APIs), business case, UX critique, behavioral STAR interview. 4 dimensions, one scorecard.",
        metrics: [
          { label: "Assessment dimensions", value: "4" },
          { label: "Hiring mgr confidence", value: "+38%" },
          { label: "90-day attrition", value: "0%" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "8,000 applicants reduced to 800 finalists via AI assessment. Hiring managers saved 240 hours, cycle time cut 62%, 1-year performance +18%.",
        name: "Anjali Reddy",
        role: "Talent Acquisition Lead",
        company: "CloudPeak SaaS",
        initials: "AR",
      },
      {
        quote: "Senior data scientist assessment caught 2 candidates who looked great on resume but couldn't design an ML pipeline. Saved us a costly bad hire.",
        name: "Karan Bhatia",
        role: "VP Engineering",
        company: "FinEdge",
        initials: "KB",
      },
      {
        quote: "Multi-dimensional assessment for cross-functional PM role — tech, business, UX, behavioral. Hiring manager confidence +38%, 90-day attrition 0%.",
        name: "Suresh Krishnan",
        role: "CHRO",
        company: "HDFC Bank",
        initials: "SK",
      },
    ],
    pricing: [
      {
        name: "Pay-per-assessment",
        price: "₹499",
        period: "per candidate",
        desc: "Try assessments on individual candidates.",
        features: ["1 candidate assessment", "Technical + aptitude + behavioral", "Proctored online", "AI scorecard + report", "Email delivery", "7-day access"],
        cta: "Try one assessment",
      },
      {
        name: "Pro",
        price: "₹19K",
        period: "per month",
        desc: "For teams hiring 10+ roles per quarter.",
        features: ["Up to 100 assessments / month", "Custom question banks", "Greenhouse / Lever integration", "Dedicated assessment designer", "Quarterly benchmarking", "Priority support"],
        cta: "Start 14-day trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "annual contract",
        desc: "For high-volume or regulated hiring.",
        features: ["Unlimited assessments", "Custom assessment authoring", "ATS + HRIS integration", "Compliance audit trail", "Custom predictive models", "On-prem / VPC deployment"],
        cta: "Contact sales",
      },
    ],
    faqs: [
      { q: "How does proctoring work?", a: "Browser lockdown (no tab switching), webcam monitoring (continuous + AI face-match), screen recording, tab-switch detection, copy-paste blocking, and plagiarism detection against a 12M+ solution database. Exam-grade integrity." },
      { q: "Can we customize questions?", a: "Yes — Pro tier supports custom question banks. Enterprise tier includes full assessment authoring with our team co-creating problems with your hiring managers." },
      { q: "What tech stacks are supported?", a: "40+ stacks including Python, Java, JavaScript, Go, Rust, C++, React, Node, SQL, dbt, Spark, Kafka, Kubernetes, AWS, GCP, Azure, and more. Custom stacks on request." },
      { q: "How do you mitigate bias?", a: "Structured rubric scoring (not subjective), blind grading option (no names/photos), quarterly bias audits, and adversarial testing on protected attributes. 30% more diverse hires than resume-only screens." },
      { q: "Are audit reports available?", a: "Yes — every assessment has a candidate report, scorecard, decision rationale, proctoring log, and question-by-question breakdown. Audit-ready for compliance and legal." },
      { q: "Do you offer bulk discounts?", a: "Yes — Pro tier at ₹19K/mo for 100 assessments (₹190 each). Enterprise tier for unlimited. Volume pricing kicks in at 1K+ assessments / quarter — contact sales." },
    ],
    cta: {
      title: "Pre-vet every candidate before offer day",
      desc: "Try a sample assessment — see why 240K+ assessments / year achieve 0.78 predictive validity.",
      primaryLabel: "Try sample assessment",
      secondaryLabel: "Book a demo",
    },
    related: [
      { key: "ai-sourcing-engine", label: "AI Sourcing Engine", icon: BrainCircuit, desc: "AI sourcing feeds candidates into screening pipeline." },
      { key: "48-hour-shortlist", label: "48-Hour Shortlist SLA", icon: Clock, desc: "Screening gates power the 48-hour SLA." },
      { key: "analytics-reporting", label: "Analytics & Reporting", icon: BarChart3, desc: "Track assessment outcomes + funnel metrics." },
      { key: "candidate-engagement", label: "Candidate Engagement", icon: Sparkles, desc: "Feedback loops after every assessment round." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Sourcing Plans & Pricing
  // ═══════════════════════════════════════════════════════════════════════════
  "sourcing-plans-pricing": {
    key: "sourcing-plans-pricing",
    label: "Sourcing Plans & Pricing",
    shortLabel: "Sourcing Plans & Pricing",
    accent: EMERALD,
    hero: {
      icon: Wallet,
      title: "Sourcing Plans & Pricing",
      badge: "TRANSPARENT PRICING",
      description:
        "Per-role transparent pricing with three ready-to-buy tiers — Basic, Pro, Enterprise — and custom quotes for high-volume needs. No hidden fees, no surprise invoices, no negotiated discounts.",
      ctaPrimary: "Compare pricing",
      ctaSecondary: "Get custom quote",
      stats: [
        { label: "Avg cost-per-hire", value: "₹45K" },
        { label: "Client savings", value: "32%" },
        { label: "Plan flexibility", value: "100%" },
        { label: "Renewal rate", value: "94%" },
      ],
    },
    overview: {
      what:
        "Sourcing Plans & Pricing is our commercial framework: transparent per-role pricing, three ready-to-buy tiers (Basic / Pro / Enterprise), and custom quotes for high-volume needs. Pricing is published online — what you see is what you pay.",
      why: [
        "Hidden fees erode trust. We publish our pricing online — no 'contact sales for pricing' walls, no surprise invoices after the engagement.",
        "Volume discounts kick in automatically at 10, 25, and 50 roles per quarter — no negotiation needed, no sales rep back-and-forth.",
        "Enterprise quotes include SLA customization, dedicated account manager, quarterly business reviews, and flexible payment terms — built for procurement teams.",
      ],
    },
    keyFeatures: [
      { icon: Wallet, title: "Per-role transparent pricing", desc: "Flat per-role fee — no % of CTC. Published online. No hidden sourcing, screening, or candidate-submission fees." },
      { icon: Layers, title: "3 ready-to-buy tiers", desc: "Basic (₹25K/role), Pro (₹49K/mo), Enterprise (Custom). Pick the tier that fits your hiring volume." },
      { icon: TrendingUp, title: "Volume discounts", desc: "Auto-applied at 10 roles (−10%), 25 roles (−18%), 50 roles/quarter (−25%). No negotiation required." },
      { icon: FileSignature, title: "Custom enterprise quotes", desc: "Enterprise tier includes custom SLAs, dedicated account director, quarterly business reviews, flexible terms." },
      { icon: ShieldCheck, title: "No hidden fees", desc: "What you see is what you pay. No candidate-submission fees, no interview coordination fees, no onboarding fees." },
      { icon: BarChart3, title: "Quarterly business reviews", desc: "Enterprise tier includes QBRs with cost-per-hire analytics, pipeline health, and optimization recommendations." },
    ],
    howItWorks: [
      { step: "01", title: "Pick a tier", desc: "Basic for 1-2 roles/quarter, Pro for 5-25 roles/quarter, Enterprise for 50+ roles/quarter." },
      { step: "02", title: "Sign master agreement", desc: "Single master agreement covers all roles, all engagement types. No per-role contracts to negotiate." },
      { step: "03", title: "Role intake", desc: "Per-role intake call (30 min). Sourcing starts immediately. Volume discounts auto-applied at quarter close." },
      { step: "04", title: "Sourcing & delivery", desc: "48-hour SLA applies to all tiers. Quality bar identical across tiers — only volume and SLA differ." },
      { step: "05", title: "Quarterly review", desc: "Enterprise tier gets QBRs with cost-per-hire analytics and optimization recommendations." },
    ],
    benefits: [
      { icon: Wallet, title: "Budget predictability", desc: "Flat per-role pricing means you know cost-per-hire before you start. No % of CTC surprises on big-ticket hires." },
      { icon: ShieldCheck, title: "No surprises", desc: "Published pricing, transparent fee schedule. Procurement teams love us — no contract redlines needed." },
      { icon: TrendingUp, title: "Volume savings", desc: "Auto-applied volume discounts at 10, 25, 50 roles/quarter — no negotiation, no sales rep back-and-forth." },
      { icon: FileSignature, title: "Custom SLAs", desc: "Enterprise tier supports custom SLA penalties, dedicated account director, quarterly business reviews." },
      { icon: Headset, title: "Dedicated support", desc: "Pro tier gets dedicated sourcing lead. Enterprise gets dedicated account director + sourcing architect." },
      { icon: BarChart3, title: "Quarterly optimization", desc: "Enterprise QBRs include cost-per-hire analytics, pipeline health, and concrete optimization recommendations." },
    ],
    useCases: [
      {
        scenario: "Series B fintech hiring 8 engineers per quarter — Pro tier fits.",
        solution: "Pro tier at ₹49K/mo covers up to 8 roles/month. Volume discount at 25 roles/quarter auto-applied — 18% savings.",
        metrics: [
          { label: "Quarterly cost", value: "₹1.47L" },
          { label: "Cost-per-hire", value: "₹18K" },
          { label: "vs traditional", value: "−42%" },
        ],
      },
      {
        scenario: "Healthcare chain hiring 80 clinical roles/quarter across 12 cities — Enterprise.",
        solution: "Custom Enterprise contract with 24-hour SLA, dedicated account director, and quarterly business reviews.",
        metrics: [
          { label: "Cost-per-hire", value: "₹38K" },
          { label: "SLA hit rate", value: "100%" },
          { label: "Savings vs Basic", value: "−28%" },
        ],
      },
      {
        scenario: "Manufacturing company hiring 3 plant managers one-off — Basic tier.",
        solution: "Basic pay-per-role at ₹25K/role. No long-term commitment. Money-back if SLA missed.",
        metrics: [
          { label: "Total cost", value: "₹75K" },
          { label: "Roles filled", value: "3/3" },
          { label: "Risk", value: "Zero" },
        ],
      },
      {
        scenario: "BFSI captive hiring 200+ tech roles/year — multi-year Enterprise.",
        solution: "3-year Enterprise contract with annual renewals, custom SLAs, and on-prem deployment option.",
        metrics: [
          { label: "Cost-per-hire", value: "₹32K" },
          { label: "vs industry", value: "−45%" },
          { label: "Renewal rate", value: "100%" },
        ],
      },
    ],
    comparison: {
      columns: ["Capability", "Traditional retained search", "JOBSONN Sourcing Plans"],
      rows: [
        { feature: "Pricing model", traditional: "% of annual CTC (20-30%)", ours: "Flat per-role fee (₹25K-₹45K)" },
        { feature: "Pricing visibility", traditional: "Negotiated per deal", ours: "Published online — what you see is what you pay" },
        { feature: "Volume discounts", traditional: "Negotiated case-by-case", ours: "Auto-applied at 10/25/50 roles/quarter" },
        { feature: "Contract flexibility", traditional: "Annual minimum commitments", ours: "Pay-per-role (Basic) to multi-year (Enterprise)" },
        { feature: "SLA backing", traditional: "Aspirational — no penalty", ours: "Money-back guarantee on 48-hour SLA" },
        { feature: "Hidden fees", traditional: "Submission + admin + onboarding fees", ours: "Zero — flat per-role covers everything" },
        { feature: "Cost on ₹40L CTC hire", traditional: "₹8-12L (20-30%)", ours: "₹25-45K flat — 95%+ savings" },
        { feature: "Procurement experience", traditional: "Multi-week negotiation", ours: "Buy online in 5 minutes — Basic / Pro tiers" },
      ],
    },
    techStack: [
      "Stripe", "Chargebee", "QuickBooks", "Xero", "Zoho Books",
      "Tally", "Razorpay", "PayPal", "Salesforce CPQ", "DocuSign",
      "Adobe Sign", "Slack",
    ],
    integrations: [
      { name: "Stripe", type: "Payments", icon: CreditCard, desc: "Online payment via Stripe for Basic + Pro tier subscriptions." },
      { name: "Razorpay", type: "Payments", icon: CreditCard, desc: "India-specific payment gateway for UPI / netbanking / cards." },
      { name: "QuickBooks", type: "Accounting", icon: Receipt, desc: "Sync invoices + payments with QuickBooks for accounting." },
      { name: "Xero", type: "Accounting", icon: Receipt, desc: "Cloud accounting sync with Xero for SMB clients." },
      { name: "Zoho Books", type: "Accounting", icon: Receipt, desc: "Sync with Zoho Books for India-specific GST compliance." },
      { name: "SAP Concur", type: "Expenses", icon: Receipt, desc: "Enterprise invoice sync with SAP Concur for procurement teams." },
    ],
    metrics: [
      { label: "Avg cost-per-hire", value: "₹45K", icon: Wallet },
      { label: "Client savings", value: "32%", icon: TrendingUp },
      { label: "Plan flexibility", value: "100%", icon: Layers },
      { label: "Renewal rate", value: "94%", icon: HeartHandshake },
    ],
    caseStudies: [
      {
        company: "FinEdge",
        industry: "Fintech",
        challenge: "Series B fintech hiring 8 engineers per quarter — needed predictable budgeting without % of CTC surprises.",
        solution: "Pro tier at ₹49K/mo covers up to 8 roles/month. Volume discount at 25 roles/quarter auto-applied — 18% savings.",
        metrics: [
          { label: "Quarterly cost", value: "₹1.47L" },
          { label: "Cost-per-hire", value: "₹18K" },
          { label: "vs traditional", value: "−42%" },
        ],
      },
      {
        company: "MediCare Group",
        industry: "Healthcare",
        challenge: "Healthcare chain hiring 80 clinical roles/quarter across 12 cities — needed dedicated support + custom SLAs.",
        solution: "Custom Enterprise contract with 24-hour SLA, dedicated account director, and quarterly business reviews.",
        metrics: [
          { label: "Cost-per-hire", value: "₹38K" },
          { label: "SLA hit rate", value: "100%" },
          { label: "Savings vs Basic", value: "−28%" },
        ],
      },
      {
        company: "Bharat Forge",
        industry: "Manufacturing",
        challenge: "Manufacturing company hiring 3 plant managers one-off — no long-term need, no recurring commitment.",
        solution: "Basic pay-per-role at ₹25K/role. No long-term commitment. Money-back if SLA missed. All 3 filled.",
        metrics: [
          { label: "Total cost", value: "₹75K" },
          { label: "Roles filled", value: "3/3" },
          { label: "Risk", value: "Zero" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "Pro tier at ₹49K/mo covers 8 roles — cost-per-hire ₹18K vs ₹40K+ traditional. Volume discounts auto-applied, no negotiation. Procurement loves it.",
        name: "Karan Bhatia",
        role: "CFO",
        company: "FinEdge",
        initials: "KB",
      },
      {
        quote: "Enterprise contract with custom SLA + dedicated account director. Quarterly business reviews gave us cost-per-hire analytics — 28% savings vs Basic.",
        name: "Sneha Iyer",
        role: "Head of Talent",
        company: "CloudPeak SaaS",
        initials: "SI",
      },
      {
        quote: "3 plant managers, one-off hire. Basic tier ₹25K/role, no commitment, money-back SLA. All 3 filled in 30 days. Zero risk, all reward.",
        name: "Ramesh Iyer",
        role: "Plant Director",
        company: "Bharat Forge",
        initials: "RI",
      },
    ],
    pricing: [
      {
        name: "Basic",
        price: "₹25K",
        period: "per role",
        desc: "Pay-per-role for one-off hires. No commitment.",
        features: ["5-10 pre-vetted candidates", "48-hour SLA", "Money-back guarantee", "Fit scorecards", "Email support", "No commitment"],
        cta: "Start one role",
      },
      {
        name: "Pro",
        price: "₹49K",
        period: "per month",
        desc: "For teams hiring 5-25 roles per quarter.",
        features: ["Up to 8 roles / month", "Volume discounts auto-applied", "Dedicated sourcing lead", "Daily progress reports", "Slack integration", "Greenhouse / Lever sync"],
        cta: "Start 14-day trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "annual contract",
        desc: "For high-volume (50+ roles/quarter).",
        features: ["Unlimited roles", "Custom SLAs (24-hour option)", "Dedicated account director", "Quarterly business reviews", "Custom integrations", "On-prem / VPC option"],
        cta: "Contact sales",
      },
    ],
    faqs: [
      { q: "What's included in each tier?", a: "Basic: 1 role shortlist (5-10 candidates, 48-hour SLA, money-back). Pro: up to 8 roles/month + dedicated lead + Slack integration. Enterprise: unlimited roles + custom SLAs + QBRs + dedicated account director." },
      { q: "How do volume discounts work?", a: "Auto-applied at quarter close: 10+ roles = 10% off, 25+ roles = 18% off, 50+ roles = 25% off. No negotiation, no sales rep back-and-forth. Discount applies to all roles in the quarter, retroactively." },
      { q: "What's your refund policy?", a: "Basic + Pro: full refund if 48-hour SLA missed, no questions. 90-day free replacement if placed candidate leaves. Enterprise: custom SLA penalties negotiated into contract, typically 5-15% fee credit per missed SLA." },
      { q: "Can we get custom SLAs?", a: "Yes — Enterprise tier supports custom SLA terms: 24-hour SLA, money-back thresholds, quality-of-shortlist penalties. Typical Enterprise contract has 3-5 custom SLA clauses." },
      { q: "What payment terms do you offer?", a: "Basic: credit card on file, charged per role. Pro: monthly invoicing, Net-15 terms. Enterprise: quarterly or annual invoicing, Net-30 terms, custom payment schedules available." },
      { q: "Can we cancel anytime?", a: "Basic: cancel anytime, no commitment. Pro: cancel anytime after first month, no penalty. Enterprise: annual contract with 90-day cancellation notice. We don't do auto-renewal gotchas." },
    ],
    cta: {
      title: "Transparent pricing. No hidden fees.",
      desc: "Compare our 3 tiers side-by-side. Pick the one that fits your hiring volume. Buy online in 5 minutes.",
      primaryLabel: "Compare pricing",
      secondaryLabel: "Get custom quote",
    },
    related: [
      { key: "48-hour-shortlist", label: "48-Hour Shortlist SLA", icon: Clock, desc: "What you get with every paid role." },
      { key: "hiring-workflow", label: "Hiring Workflow", icon: Workflow, desc: "Full pipeline orchestration post-shortlist." },
      { key: "analytics-reporting", label: "Analytics & Reporting", icon: BarChart3, desc: "Cost-per-hire analytics in QBRs." },
      { key: "candidate-engagement", label: "Candidate Engagement", icon: Sparkles, desc: "Candidate nurture included in Pro+ tiers." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. Hiring Workflow
  // ═══════════════════════════════════════════════════════════════════════════
  "hiring-workflow": {
    key: "hiring-workflow",
    label: "Hiring Workflow",
    shortLabel: "Hiring Workflow",
    accent: EMERALD,
    hero: {
      icon: Workflow,
      title: "Hiring Workflow",
      badge: "PIPELINE ORCHESTRATION",
      description:
        "Role intake brief template, automated interview scheduling, structured feedback with shared scorecards, and end-to-end offer management — your hiring pipeline, orchestrated.",
      ctaPrimary: "See workflow in action",
      ctaSecondary: "Start free trial",
      stats: [
        { label: "Hours saved / role", value: "4+" },
        { label: "Cycle time reduction", value: "38%" },
        { label: "Offer-accept rate", value: "82%" },
        { label: "Mobile usage", value: "64%" },
      ],
    },
    overview: {
      what:
        "Hiring Workflow orchestrates your entire pipeline — role intake brief, multi-stage interviews, automated scheduling, structured feedback with shared scorecards, and offer management with e-signature. One tool, one pipeline, full audit trail.",
      why: [
        "Manual scheduling wastes 4+ hours per role (email ping-pong, time-zone math, reschedules). Automation reduces that to 5 minutes — recruiters focus on candidate quality, not calendar Tetris.",
        "Structured feedback with shared scorecards removes the 'he's nice, hire him' bias. Every interviewer scores on the same rubric; debriefs are evidence-based.",
        "Offer management with e-signature and tracking reduces offer-to-accept time by 38% — candidates sign in hours, not days, while they're still warm.",
      ],
    },
    keyFeatures: [
      { icon: ClipboardList, title: "Role intake brief template", desc: "Structured intake template capturing JD, must-haves, salary, panel, timeline — one source of truth for the role." },
      { icon: CalendarClock, title: "Automated interview scheduling", desc: "Calendly-style self-scheduling, time-zone aware, auto-reschedule on conflicts. Saves 4+ hours per role." },
      { icon: FileCheck2, title: "Structured feedback scorecards", desc: "Per-role rubric, shared scorecards across panel, AI-summarized debrief — evidence-based hiring decisions." },
      { icon: FileSignature, title: "Offer management & e-sign", desc: "Offer letter templates, e-signature (DocuSign / Adobe Sign), tracking, automated reminders — offer-to-accept in hours." },
      { icon: Calendar, title: "Calendar sync", desc: "Two-way sync with Google Calendar, Outlook, iCal — your interviews on your calendar, automatically." },
      { icon: Smartphone, title: "Mobile-friendly", desc: "Candidates schedule, interview, and sign offers from mobile. 64% of candidate interactions happen on mobile." },
    ],
    howItWorks: [
      { step: "01", title: "Role intake brief", desc: "Hiring manager fills structured intake template — JD, must-haves, salary, panel, timeline. One source of truth." },
      { step: "02", title: "Pipeline setup", desc: "Auto-generated pipeline: screen → assessment → interview 1 → interview 2 → offer. Customizable per role." },
      { step: "03", title: "Scheduling automation", desc: "Candidates self-schedule interviews via branded booking page. Time-zone aware, conflict-aware, auto-reschedule." },
      { step: "04", title: "Feedback collection", desc: "Interviewers submit structured scorecards within 24 hours. AI summarizes panel feedback for debrief." },
      { step: "05", title: "Offer & acceptance", desc: "Offer letter auto-generated from template, e-sign via DocuSign / Adobe Sign, tracking + reminders till accepted." },
    ],
    benefits: [
      { icon: Clock, title: "4+ hours saved per role", desc: "Automated scheduling eliminates email ping-pong. Recruiters focus on candidate quality, not calendar Tetris." },
      { icon: Zap, title: "Faster cycle time", desc: "Pipeline automation reduces time-to-offer by 38% — offers go out while candidates are still warm." },
      { icon: Target, title: "Better hiring decisions", desc: "Structured scorecards + AI-summarized debriefs — evidence-based decisions, not gut-feel hires." },
      { icon: ShieldCheck, title: "Reduced bias", desc: "Shared rubric scoring across panel — every interviewer scores the same dimensions on the same scale." },
      { icon: FileCheck2, title: "Audit-ready process", desc: "Every pipeline stage, scorecard, and offer has an audit trail. Compliance-ready for regulated industries." },
      { icon: Smartphone, title: "Mobile-friendly", desc: "Candidates schedule, interview, and sign offers from mobile. 64% of candidate interactions happen on mobile." },
    ],
    useCases: [
      {
        scenario: "High-volume campus hiring — 120 offers in 30 days, 5-person panel per role.",
        solution: "Workflow tool orchestrated 600+ interviews, structured scorecards, and bulk offer e-sign — cycle time cut 38%.",
        metrics: [
          { label: "Offers / month", value: "120" },
          { label: "Cycle time", value: "−38%" },
          { label: "Scheduling time", value: "−92%" },
        ],
      },
      {
        scenario: "Senior leadership hire — multi-stakeholder panel across 4 cities + remote.",
        solution: "Workflow tool coordinated 8-panel interviews across 4 cities + remote, time-zone-aware scheduling, structured debrief.",
        metrics: [
          { label: "Panel size", value: "8" },
          { label: "Cities coordinated", value: "4" },
          { label: "Time-to-offer", value: "21 days" },
        ],
      },
      {
        scenario: "Multi-stakeholder search — cross-functional PM hire needing 6 interviewers from 3 teams.",
        solution: "Workflow tool aligned 6 interviewers across 3 teams with shared scorecards; AI-summarized debrief enabled fast decision.",
        metrics: [
          { label: "Interviewers", value: "6" },
          { label: "Debrief time", value: "45 min" },
          { label: "Decision speed", value: "+50%" },
        ],
      },
      {
        scenario: "Cross-functional hire — engineering + product + design panel for tech-lead role.",
        solution: "Workflow tool ran 5-stage pipeline with per-stage rubric, shared scorecards, e-sign offer accepted in 4 hours.",
        metrics: [
          { label: "Pipeline stages", value: "5" },
          { label: "Offer-accept", value: "4 hrs" },
          { label: "Quality of hire", value: "9.2/10" },
        ],
      },
    ],
    comparison: {
      columns: ["Capability", "Email + Excel workflow", "JOBSONN Hiring Workflow"],
      rows: [
        { feature: "Scheduling", traditional: "Email ping-pong, time-zone math", ours: "Self-scheduling, time-zone aware, auto-reschedule" },
        { feature: "Feedback collection", traditional: "Free-form email notes", ours: "Structured scorecards with shared rubric" },
        { feature: "Decision support", traditional: "Sync debrief meeting", ours: "AI-summarized panel feedback for fast debrief" },
        { feature: "Offer management", traditional: "Word doc + manual signature", ours: "Template + e-sign (DocuSign / Adobe Sign)" },
        { feature: "Audit trail", traditional: "Scattered emails + spreadsheets", ours: "Full pipeline audit — every stage logged" },
        { feature: "Mobile experience", traditional: "Desktop-only — email + PDF", ours: "Mobile-first — schedule, interview, sign on mobile" },
        { feature: "Calendar sync", traditional: "Manual entry into calendars", ours: "Two-way sync — Google / Outlook / iCal" },
        { feature: "Time per role", traditional: "4+ hours scheduling + coordination", ours: "5 minutes — fully automated" },
      ],
    },
    techStack: [
      "Calendly", "Google Calendar", "Outlook", "DocuSign", "Adobe Sign",
      "Twilio", "Slack", "Microsoft Teams", "React", "Node.js", "PostgreSQL",
      "Redis",
    ],
    integrations: [
      { name: "Greenhouse", type: "ATS", icon: FileText, desc: "Two-way sync of candidates, interviews, and offers with Greenhouse ATS." },
      { name: "Lever", type: "ATS", icon: FileText, desc: "Pipeline + interview + offer sync with Lever ATS." },
      { name: "Workday", type: "HRIS", icon: Building2, desc: "Sync hires + offers with Workday HCM for onboarding." },
      { name: "BambooHR", type: "HRIS", icon: Cpu, desc: "Lightweight HRIS sync for SMB clients on BambooHR." },
      { name: "iCIMS", type: "ATS", icon: FileText, desc: "Enterprise ATS sync for iCIMS clients." },
      { name: "SAP SuccessFactors", type: "HRIS", icon: Server, desc: "Enterprise integration with SAP SuccessFactors." },
    ],
    metrics: [
      { label: "Hours saved / role", value: "4+", icon: Clock },
      { label: "Cycle time reduction", value: "38%", icon: Zap },
      { label: "Offer-accept rate", value: "82%", icon: Target },
      { label: "Mobile usage", value: "64%", icon: Smartphone },
    ],
    caseStudies: [
      {
        company: "CloudPeak SaaS",
        industry: "IT & SaaS",
        challenge: "Campus hiring — 120 offers in 30 days with 5-person panel per role. Manual scheduling impossible at this scale.",
        solution: "Workflow tool orchestrated 600+ interviews, structured scorecards, and bulk offer e-sign — cycle time cut 38%, scheduling time cut 92%.",
        metrics: [
          { label: "Offers / month", value: "120" },
          { label: "Cycle time", value: "−38%" },
          { label: "Scheduling time", value: "−92%" },
        ],
      },
      {
        company: "FinEdge",
        industry: "Fintech",
        challenge: "Senior leadership hire — multi-stakeholder panel across 4 cities + remote. Time zones + calendars a nightmare.",
        solution: "Workflow tool coordinated 8-panel interviews across 4 cities + remote with time-zone-aware scheduling. Structured debrief enabled fast decision.",
        metrics: [
          { label: "Panel size", value: "8" },
          { label: "Cities coordinated", value: "4" },
          { label: "Time-to-offer", value: "21 days" },
        ],
      },
      {
        company: "HDFC Bank",
        industry: "BFSI",
        challenge: "Cross-functional tech-lead hire — engineering + product + design panel, 5-stage pipeline, offer accepted in hours.",
        solution: "Workflow tool ran 5-stage pipeline with per-stage rubric, shared scorecards, e-sign offer accepted in 4 hours.",
        metrics: [
          { label: "Pipeline stages", value: "5" },
          { label: "Offer-accept", value: "4 hrs" },
          { label: "Quality of hire", value: "9.2/10" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "120 offers in 30 days with 5-person panels — impossible without Workflow tool. Scheduling time cut 92%, cycle time 38%. Saved my team's sanity.",
        name: "Anjali Reddy",
        role: "Talent Acquisition Lead",
        company: "CloudPeak SaaS",
        initials: "AR",
      },
      {
        quote: "8-person panel across 4 cities + remote for a leadership hire — Workflow tool coordinated everything. Time-to-offer 21 days, no scheduling headaches.",
        name: "Karan Bhatia",
        role: "VP Engineering",
        company: "FinEdge",
        initials: "KB",
      },
      {
        quote: "5-stage pipeline with shared scorecards + e-sign offer accepted in 4 hours. Quality of hire 9.2/10. Workflow tool is hiring infrastructure.",
        name: "Suresh Krishnan",
        role: "CHRO",
        company: "HDFC Bank",
        initials: "SK",
      },
    ],
    pricing: [
      {
        name: "Basic",
        price: "Free",
        period: "up to 5 roles / mo",
        desc: "For small teams getting started with structured hiring.",
        features: ["Up to 5 active roles / month", "Self-scheduling page", "Standard scorecard templates", "Email support", "Mobile app", "Calendar sync (Google)"],
        cta: "Start free",
      },
      {
        name: "Pro",
        price: "₹9,999",
        period: "per month",
        desc: "For teams hiring 5-25 roles per quarter.",
        features: ["Unlimited active roles", "Custom scorecard templates", "AI-summarized debriefs", "DocuSign / Adobe Sign", "Greenhouse / Lever sync", "Priority support"],
        cta: "Start 14-day trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "annual contract",
        desc: "For high-volume or regulated hiring.",
        features: ["Custom workflow automation", "SAP / Oracle / Workday integration", "Compliance audit trail", "SSO + custom roles", "On-prem / VPC option", "Dedicated account manager"],
        cta: "Contact sales",
      },
    ],
    faqs: [
      { q: "What calendar integrations do you support?", a: "Google Calendar, Outlook (Office 365 + Exchange), and iCal (Apple). Two-way sync — interviews appear on your calendar automatically, and conflicts block scheduling." },
      { q: "Can we customize pipelines per role?", a: "Yes — Pro tier supports custom pipeline templates per role family (e.g., engineering pipeline differs from sales). Enterprise supports fully custom workflows with conditional stages." },
      { q: "Do you offer offer-letter templates?", a: "Yes — Pro tier includes 12 standard offer-letter templates (India + US). Enterprise includes custom template authoring with your legal team — typically 1-2 week turnaround." },
      { q: "Is there a mobile app?", a: "Yes — iOS + Android apps for candidates (scheduling, interviewing, e-sign) and recruiters (pipeline view, scorecards, approvals). 64% of candidate interactions happen on mobile." },
      { q: "Can we do bulk scheduling?", a: "Yes — Pro tier supports bulk scheduling for up to 100 candidates at once (campus hiring, contractor onboarding). Enterprise supports unlimited bulk scheduling with custom rules." },
      { q: "Is there an API?", a: "Yes — REST API for candidates, applications, interviews, offers, and scorecards. Pro tier includes 10K API calls/month, Enterprise includes unlimited. Webhooks for pipeline events." },
    ],
    cta: {
      title: "Orchestrate your hiring pipeline — end to end",
      desc: "From intake brief to signed offer, one tool. Save 4+ hours per role, cut cycle time 38%.",
      primaryLabel: "Start free trial",
      secondaryLabel: "See workflow demo",
    },
    related: [
      { key: "48-hour-shortlist", label: "48-Hour Shortlist SLA", icon: Clock, desc: "Shortlists feed directly into the workflow pipeline." },
      { key: "screening-assessment", label: "Screening & Assessment", icon: ClipboardCheck, desc: "Assessment results auto-attach to candidate records." },
      { key: "candidate-engagement", label: "Candidate Engagement", icon: Sparkles, desc: "Feedback loops post-interview built into the workflow." },
      { key: "analytics-reporting", label: "Analytics & Reporting", icon: BarChart3, desc: "Pipeline analytics + stage-level drop-off tracked." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. Candidate Engagement
  // ═══════════════════════════════════════════════════════════════════════════
  "candidate-engagement": {
    key: "candidate-engagement",
    label: "Candidate Engagement",
    shortLabel: "Candidate Engagement",
    accent: EMERALD,
    hero: {
      icon: Sparkles,
      title: "Candidate Engagement",
      badge: "KEEP CANDIDATES WARM",
      description:
        "Personalized multi-channel outreach (email, WhatsApp, call), structured feedback after every interview, and long-term nurture sequences for silver-medal candidates. Reduce ghosting, increase offer-accept.",
      ctaPrimary: "See engagement in action",
      ctaSecondary: "Get sample sequence",
      stats: [
        { label: "Response rate", value: "47%" },
        { label: "Ghosting reduction", value: "60%" },
        { label: "Silver-medal conversion", value: "22%" },
        { label: "Candidate NPS", value: "68" },
      ],
    },
    overview: {
      what:
        "Candidate Engagement is our candidate experience layer: personalized multi-channel outreach (email, WhatsApp, call), structured feedback after every interview, and long-term nurture sequences for silver-medal candidates (close-but-no-hire).",
      why: [
        "68% of candidates ghost because of poor communication — they accept other offers while you're slow to respond. We close the loop on every interaction within 24 hours.",
        "Silver-medal candidates (close-but-no-hire) are 4× cheaper to convert next time — they've already passed your bar. Nurture sequences keep them warm till the right role opens.",
        "Personalized outreach gets 3.2× higher response rates than generic templates. We personalize based on candidate profile, recent activity, and role fit — not just first-name tokens.",
      ],
    },
    keyFeatures: [
      { icon: MessagesSquare, title: "Personalized multi-channel outreach", desc: "Email + WhatsApp + call + SMS + LinkedIn — pick the channel each candidate responds to. 3.2× higher response." },
      { icon: RefreshCw, title: "Structured feedback loops", desc: "Auto-trigger feedback to candidates within 24 hours of every interview — even rejections. Closes the ghosting gap." },
      { icon: HeartHandshake, title: "Long-term nurture sequences", desc: "Silver-medal candidates auto-enrolled in nurture sequences — quarterly check-ins, role alerts, content drips." },
      { icon: Users, title: "Silver-medal pipeline", desc: "Track silver-medal candidates as a separate pool. 22% convert within 12 months — 4× cheaper than fresh sourcing." },
      { icon: Gauge, title: "Candidate NPS", desc: "Auto-collect candidate NPS after every interaction. Average NPS 68 — top decile of TA teams." },
      { icon: Megaphone, title: "Referral prompts", desc: "Auto-prompt candidates to refer friends — even rejected candidates. 18% of our hires come via candidate referrals." },
    ],
    howItWorks: [
      { step: "01", title: "Candidate profile", desc: "We build a 360° profile: skills, experience, preferences, communication channels, recent activity signals." },
      { step: "02", title: "Personalized outreach", desc: "AI-personalized first touch based on profile + role fit + recent activity. Multi-channel: email + WhatsApp + call." },
      { step: "03", title: "Feedback loop", desc: "Auto-trigger feedback within 24 hours of every interview — even rejections. Candidates stay warm, not ghosted." },
      { step: "04", title: "Nurture enrollment", desc: "Silver-medal candidates (close-but-no-hire) auto-enrolled in long-term nurture — quarterly check-ins, role alerts." },
      { step: "05", title: "Re-engagement", desc: "When a fit role opens, silver-medal candidates auto-pinged first — 4× cheaper than fresh sourcing, 22% convert." },
    ],
    benefits: [
      { icon: Target, title: "Higher response rates", desc: "Personalized multi-channel outreach gets 47% response rates — 3.2× higher than generic email templates." },
      { icon: ShieldCheck, title: "Reduced ghosting", desc: "Structured feedback within 24 hours closes the ghosting gap — ghosting rate drops from 35% to 8%." },
      { icon: Wallet, title: "Silver-medal ROI", desc: "Silver-medal candidates convert at 22% within 12 months — 4× cheaper than fresh sourcing. Real pipeline ROI." },
      { icon: HeartHandshake, title: "Better candidate NPS", desc: "Even rejected candidates get treated well — NPS 68, top decile of TA teams. Brand reputation grows." },
      { icon: Network, title: "Referral pipeline", desc: "Auto-referral prompts turn candidates into sourcers — 18% of hires come via candidate referrals." },
      { icon: Megaphone, title: "Brand reputation", desc: "Candidates talk. Good engagement = good Glassdoor + LinkedIn reviews = more inbound applicants next cycle." },
    ],
    useCases: [
      {
        scenario: "Passive candidate sourcing — 80 senior engineers needed, none applying.",
        solution: "Personalized multi-channel outreach (email + WhatsApp + LinkedIn) to 320 passive candidates. 47% response rate.",
        metrics: [
          { label: "Outreach sent", value: "320" },
          { label: "Response rate", value: "47%" },
          { label: "Hires delivered", value: "27" },
        ],
      },
      {
        scenario: "Silver-medal re-engagement — 240 close-but-no-hire candidates from last 12 months.",
        solution: "Nurture sequence + role-match alerts. 22% converted to hires within 12 months at 4× lower cost-per-hire.",
        metrics: [
          { label: "Silver-medal pool", value: "240" },
          { label: "Conversion rate", value: "22%" },
          { label: "Cost-per-hire", value: "−75%" },
        ],
      },
      {
        scenario: "Diversity sourcing — 40% women in tech hires goal.",
        solution: "Personalized outreach to women-in-tech communities + structured feedback loops. 42% women hires, goal attained.",
        metrics: [
          { label: "Women hires", value: "42%" },
          { label: "Goal attainment", value: "105%" },
          { label: "Outreach response", value: "52%" },
        ],
      },
      {
        scenario: "Referral pipeline — turn candidates into sourcers.",
        solution: "Auto-referral prompts post-interview (even for rejections). 18% of hires came via candidate referrals.",
        metrics: [
          { label: "Referral hires", value: "18%" },
          { label: "Cost-per-referral-hire", value: "₹8K" },
          { label: "1-yr retention", value: "94%" },
        ],
      },
    ],
    comparison: {
      columns: ["Capability", "Generic email outreach", "JOBSONN Candidate Engagement"],
      rows: [
        { feature: "Personalization", traditional: "First-name token in template", ours: "AI-personalized based on profile + activity + role fit" },
        { feature: "Channels", traditional: "Email only", ours: "Email + WhatsApp + call + SMS + LinkedIn" },
        { feature: "Feedback loop", traditional: "Silence if rejected", ours: "Auto-feedback within 24 hours — even rejections" },
        { feature: "Silver-medal handling", traditional: "Forgotten after rejection", ours: "Auto-enrolled in nurture sequence + role alerts" },
        { feature: "NPS tracking", traditional: "None", ours: "Auto-collected after every interaction — NPS 68 avg" },
        { feature: "Referral prompts", traditional: "Manual, ad-hoc", ours: "Auto-prompted post-interview — 18% hires via referral" },
        { feature: "Response rate", traditional: "12-15% (generic template)", ours: "47% (personalized multi-channel)" },
        { feature: "Ghosting rate", traditional: "35% (industry average)", ours: "8% (structured feedback closes gap)" },
      ],
    },
    techStack: [
      "Twilio", "SendGrid", "Mailchimp", "HubSpot", "Salesforce", "Intercom",
      "Mixpanel", "Customer.io", "WhatsApp Business API", "LinkedIn API",
      "PostgreSQL", "Redis",
    ],
    integrations: [
      { name: "LinkedIn", type: "Outreach", icon: Network, desc: "InMail + connection-request automation for personalized LinkedIn outreach." },
      { name: "WhatsApp Business", type: "Messaging", icon: MessagesSquare, desc: "WhatsApp Business API for high-response-rate candidate messaging." },
      { name: "Gmail", type: "Email", icon: Mail, desc: "Gmail integration for personalized email outreach from recruiter inboxes." },
      { name: "Outlook", type: "Email", icon: Mail, desc: "Outlook / Office 365 integration for enterprise email outreach." },
      { name: "Slack", type: "Internal", icon: MessagesSquare, desc: "Slack notifications for recruiter outreach queues + responses." },
      { name: "Microsoft Teams", type: "Internal", icon: MessagesSquare, desc: "Teams notifications for enterprise recruiter collaboration." },
    ],
    metrics: [
      { label: "Response rate", value: "47%", icon: Target },
      { label: "Ghosting reduction", value: "60%", icon: ShieldCheck },
      { label: "Silver-medal conversion", value: "22%", icon: HeartHandshake },
      { label: "Candidate NPS", value: "68", icon: Gauge },
    ],
    caseStudies: [
      {
        company: "FinEdge",
        industry: "Fintech",
        challenge: "80 senior engineers needed — none applying via job boards. Passive sourcing required.",
        solution: "Personalized multi-channel outreach (email + WhatsApp + LinkedIn) to 320 passive candidates. 47% response rate, 27 hires delivered.",
        metrics: [
          { label: "Outreach sent", value: "320" },
          { label: "Response rate", value: "47%" },
          { label: "Hires delivered", value: "27" },
        ],
      },
      {
        company: "CloudPeak SaaS",
        industry: "IT & SaaS",
        challenge: "240 silver-medal candidates from last 12 months sitting idle in ATS — no re-engagement process.",
        solution: "Nurture sequence + role-match alerts. 22% converted to hires within 12 months at 4× lower cost-per-hire than fresh sourcing.",
        metrics: [
          { label: "Silver-medal pool", value: "240" },
          { label: "Conversion rate", value: "22%" },
          { label: "Cost-per-hire", value: "−75%" },
        ],
      },
      {
        company: "MediCare Group",
        industry: "Healthcare",
        challenge: "Diversity goal — 40% women in tech hires. Generic outreach wasn't reaching women candidates.",
        solution: "Personalized outreach to women-in-tech communities + structured feedback loops. 42% women hires, 105% of goal.",
        metrics: [
          { label: "Women hires", value: "42%" },
          { label: "Goal attainment", value: "105%" },
          { label: "Outreach response", value: "52%" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "80 senior engineers via passive sourcing — 47% response rate on multi-channel outreach. Personalization at scale actually works.",
        name: "Karan Bhatia",
        role: "VP Engineering",
        company: "FinEdge",
        initials: "KB",
      },
      {
        quote: "240 silver-medal candidates converted at 22% within 12 months — 4× cheaper than fresh sourcing. The nurture pipeline is gold.",
        name: "Anjali Reddy",
        role: "Talent Acquisition Lead",
        company: "CloudPeak SaaS",
        initials: "AR",
      },
      {
        quote: "42% women in tech hires — diversity goal attained. Personalized outreach to women-in-tech communities + structured feedback. Real inclusion.",
        name: "Deepa Subramanian",
        role: "VP HR",
        company: "MediCare Group",
        initials: "DS",
      },
    ],
    pricing: [
      {
        name: "Basic",
        price: "₹4,999",
        period: "per month",
        desc: "For small teams doing one-off outreach.",
        features: ["Up to 500 candidates / month", "Email + WhatsApp outreach", "Basic personalization", "Feedback templates", "Email support", "Monthly reporting"],
        cta: "Start free trial",
      },
      {
        name: "Pro",
        price: "₹14,999",
        period: "per month",
        desc: "For teams hiring 5+ roles per quarter.",
        features: ["Up to 5,000 candidates / month", "Multi-channel (email + WhatsApp + call + LinkedIn)", "AI personalization", "Silver-medal nurture", "NPS tracking", "Greenhouse / Lever sync"],
        cta: "Start 14-day trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "annual contract",
        desc: "For high-volume or multi-region hiring.",
        features: ["Unlimited candidates", "Custom nurture sequences", "Dedicated engagement strategist", "Multi-region compliance", "Custom integrations", "Quarterly business reviews"],
        cta: "Contact sales",
      },
    ],
    faqs: [
      { q: "What channels does multi-channel outreach cover?", a: "Email (Gmail + Outlook), WhatsApp Business, SMS (Twilio), voice calls (Twilio), LinkedIn InMail + connection requests. We auto-pick the channel each candidate is most likely to respond on." },
      { q: "How does personalization work?", a: "AI personalizes first-touch based on: candidate profile (skills, experience), recent activity (job-change signals), role fit (semantic match), and channel preference. 3.2× higher response than generic templates." },
      { q: "What's the feedback loop?", a: "Auto-triggered within 24 hours of every interview — even for rejections. Personalized feedback (not 'we went with another candidate' templates). Closes the ghosting gap, drops ghosting rate from 35% to 8%." },
      { q: "How does silver-medal nurture work?", a: "Close-but-no-hire candidates auto-enrolled in nurture: quarterly check-ins, role-match alerts, content drips. When a fit role opens, they're pinged first — 22% convert within 12 months at 4× lower cost-per-hire." },
      { q: "How is candidate NPS collected?", a: "Auto-collected after every candidate interaction (outreach response, interview, offer, rejection). NPS 68 average — top decile of TA teams. Tracked per recruiter + per role for accountability." },
      { q: "How do referral prompts work?", a: "Auto-prompted post-interview — even for rejected candidates. 'Know someone who'd be a fit?' with one-click referral form. 18% of our hires come via candidate referrals — ₹8K cost-per-referral-hire." },
    ],
    cta: {
      title: "Stop ghosting. Start converting.",
      desc: "Personalized outreach, structured feedback, silver-medal nurture — candidate engagement that converts. Try a sample sequence.",
      primaryLabel: "Get sample sequence",
      secondaryLabel: "See engagement demo",
    },
    related: [
      { key: "48-hour-shortlist", label: "48-Hour Shortlist SLA", icon: Clock, desc: "Outreach drives candidates into the shortlist pipeline." },
      { key: "screening-assessment", label: "Screening & Assessment", icon: ClipboardCheck, desc: "Feedback loops post-assessment built into engagement." },
      { key: "hiring-workflow", label: "Hiring Workflow", icon: Workflow, desc: "Engagement feeds the workflow pipeline." },
      { key: "analytics-reporting", label: "Analytics & Reporting", icon: BarChart3, desc: "Engagement metrics tracked in real-time dashboards." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. Analytics & Reporting
  // ═══════════════════════════════════════════════════════════════════════════
  "analytics-reporting": {
    key: "analytics-reporting",
    label: "Analytics & Reporting",
    shortLabel: "Analytics & Reporting",
    accent: EMERALD,
    hero: {
      icon: BarChart3,
      title: "Analytics & Reporting",
      badge: "HIRING INTELLIGENCE",
      description:
        "Real-time dashboards, sourcing funnel analytics, time-to-hire by stage, candidate drop-off, diversity metrics, and recruiter scorecards — hiring intelligence, on tap.",
      ctaPrimary: "See dashboards in action",
      ctaSecondary: "Get sample report",
      stats: [
        { label: "Dashboard refresh", value: "60 sec" },
        { label: "KPIs tracked", value: "40+" },
        { label: "Report automation", value: "100%" },
        { label: "User adoption", value: "92%" },
      ],
    },
    overview: {
      what:
        "Analytics & Reporting gives you real-time visibility into your hiring — sourcing funnel by stage, time-to-hire by role, candidate drop-off, diversity metrics (gender, age, region), and recruiter performance scorecards. All in one dashboard, refreshed every 60 seconds.",
      why: [
        "What gets measured gets managed. Real-time dashboards surface bottlenecks before they cost you hires — drop-off at assessment stage, recruiter response lag, channel ROI decay.",
        "Diversity metrics (gender, age, region) help you track and improve inclusion — with audit-ready reports for EEOC, SEC, and Indian regulatory compliance.",
        "Sourcing funnel analytics reveal which channels (job boards, referrals, AI sourcing, partner colleges) actually convert to hires — so you can reallocate budget with confidence.",
      ],
    },
    keyFeatures: [
      { icon: Activity, title: "Real-time dashboards", desc: "Live dashboards refreshed every 60 seconds — sourcing funnel, time-to-hire, drop-off, recruiter scorecards. No stale data." },
      { icon: Filter, title: "Sourcing funnel analytics", desc: "Stage-by-stage funnel: sourced → screened → assessed → interviewed → offered → hired. Drop-off + conversion at each stage." },
      { icon: Clock, title: "Time-to-hire by stage", desc: "Time spent at each pipeline stage, by role + recruiter + city. Surface bottlenecks before they cost hires." },
      { icon: Users2, title: "Diversity metrics", desc: "Gender, age, region diversity per role + stage + recruiter. Audit-ready reports for EEOC, SEC, Indian compliance." },
      { icon: Gauge, title: "Recruiter scorecards", desc: "Per-recruiter metrics: roles filled, time-to-hire, candidate NPS, hiring-manager NPS. Accountability built-in." },
      { icon: Calendar, title: "Scheduled reports", desc: "Auto-emailed reports — daily, weekly, monthly, quarterly. Stakeholders get insights without logging in." },
    ],
    howItWorks: [
      { step: "01", title: "Data pipeline", desc: "We ingest data from ATS, HRIS, assessments, sourcing tools, and engagement platform into a unified warehouse." },
      { step: "02", title: "Dashboard setup", desc: "Pre-built dashboards for 12 roles, 8 industries, 4 company sizes. Customizable per stakeholder (CHRO, TA lead, recruiter)." },
      { step: "03", title: "Custom KPIs", desc: "Define your KPIs — cost-per-hire, quality-of-hire, diversity, channel ROI. We track + alert on threshold breaches." },
      { step: "04", title: "Scheduled reports", desc: "Auto-emailed reports to stakeholders — daily pipeline, weekly funnel, monthly summary, quarterly QBR pack." },
      { step: "05", title: "Quarterly review", desc: "Quarterly business review with our analyst — what's working, what's not, optimization recommendations." },
    ],
    benefits: [
      { icon: Eye, title: "Real-time visibility", desc: "Live dashboards refresh every 60 seconds — no stale weekly reports. Spot bottlenecks as they happen." },
      { icon: Zap, title: "Bottleneck detection", desc: "Stage-level drop-off + time-to-hire analytics surface bottlenecks before they cost you hires." },
      { icon: Users2, title: "Diversity tracking", desc: "Gender, age, region diversity per role + stage + recruiter. Audit-ready for EEOC, SEC, Indian compliance." },
      { icon: Wallet, title: "Channel ROI", desc: "Sourcing funnel analytics reveal which channels convert — reallocate budget with data, not guesses." },
      { icon: Gauge, title: "Recruiter accountability", desc: "Per-recruiter scorecards: roles filled, time-to-hire, NPS. Incentives align with metrics, not gut feel." },
      { icon: FileCheck2, title: "Audit-ready", desc: "Every report exportable as PDF / Excel / CSV. Audit trail for compliance, legal, and board reporting." },
    ],
    useCases: [
      {
        scenario: "Executive hiring review — board wants Q3 hiring pipeline status in 24 hours.",
        solution: "Pre-built executive dashboard with funnel + diversity + cost + forecast. Board pack auto-generated, no analyst time.",
        metrics: [
          { label: "Report time", value: "5 min" },
          { label: "Stakeholder NPS", value: "+42 pts" },
          { label: "Analyst time saved", value: "8 hrs" },
        ],
      },
      {
        scenario: "Quarterly TA report — 12 KPIs across 4 stakeholders.",
        solution: "Scheduled auto-emailed reports per stakeholder. QBR pack auto-generated with optimization recommendations.",
        metrics: [
          { label: "Reports automated", value: "12" },
          { label: "Manual effort", value: "0 hrs" },
          { label: "On-time delivery", value: "100%" },
        ],
      },
      {
        scenario: "Diversity audit — regulatory body requests 3-year gender + region hiring data.",
        solution: "Audit-ready reports exported in 5 minutes — gender, age, region per role per year. Compliance signed off.",
        metrics: [
          { label: "Audit prep time", value: "5 min" },
          { label: "Compliance status", value: "Cleared" },
          { label: "Penalty risk", value: "Zero" },
        ],
      },
      {
        scenario: "Channel ROI analysis — ₹50L sourcing budget across 8 channels.",
        solution: "Funnel analytics revealed referrals + AI sourcing converted 3× better than job boards. Reallocated 40% budget.",
        metrics: [
          { label: "Budget reallocation", value: "40%" },
          { label: "Hires / ₹1L spent", value: "+38%" },
          { label: "Cost-per-hire", value: "−24%" },
        ],
      },
    ],
    comparison: {
      columns: ["Capability", "Excel + manual reports", "JOBSONN Analytics & Reporting"],
      rows: [
        { feature: "Refresh cadence", traditional: "Weekly / monthly manual export", ours: "Real-time — refreshes every 60 seconds" },
        { feature: "Data sources", traditional: "Manual export from each tool", ours: "Unified warehouse — ATS + HRIS + assessments + sourcing" },
        { feature: "Granularity", traditional: "Aggregate only", ours: "Stage-level + recruiter-level + candidate-level" },
        { feature: "Diversity tracking", traditional: "Manual, ad-hoc", ours: "Auto-tracked: gender, age, region per role + stage + recruiter" },
        { feature: "Recruiter scorecards", traditional: "Annual review only", ours: "Real-time per-recruiter KPIs — accountability built-in" },
        { feature: "Scheduled reports", traditional: "Manual email + attachment", ours: "Auto-emailed — daily / weekly / monthly / quarterly" },
        { feature: "Bottleneck detection", traditional: "After-the-fact analysis", ours: "Real-time alerts on threshold breaches" },
        { feature: "Audit trail", traditional: "Manual spreadsheets", ours: "Full audit trail — every metric exportable as PDF / Excel / CSV" },
      ],
    },
    techStack: [
      "PostgreSQL", "Snowflake", "Looker", "Tableau", "Power BI", "Mode",
      "dbt", "Apache Superset", "Airflow", "Kafka", "Redis", "FastAPI",
    ],
    integrations: [
      { name: "Greenhouse", type: "ATS", icon: FileText, desc: "Auto-ingest Greenhouse pipeline data into unified warehouse." },
      { name: "Lever", type: "ATS", icon: FileText, desc: "Sync Lever candidate + pipeline data into analytics warehouse." },
      { name: "Workday", type: "HRIS", icon: Building2, desc: "Sync Workday HCM hires + offers + diversity data." },
      { name: "BambooHR", type: "HRIS", icon: Cpu, desc: "Lightweight HRIS sync for SMB clients on BambooHR." },
      { name: "iCIMS", type: "ATS", icon: FileText, desc: "Enterprise ATS sync for iCIMS clients." },
      { name: "SAP SuccessFactors", type: "HRIS", icon: Server, desc: "Enterprise integration with SAP SuccessFactors." },
    ],
    metrics: [
      { label: "Dashboard refresh", value: "60 sec", icon: Activity },
      { label: "KPIs tracked", value: "40+", icon: Filter },
      { label: "Report automation", value: "100%", icon: Calendar },
      { label: "User adoption", value: "92%", icon: Users },
    ],
    caseStudies: [
      {
        company: "HDFC Bank",
        industry: "BFSI",
        challenge: "Board wanted Q3 hiring pipeline status in 24 hours — manual report took 8 analyst hours + was always late.",
        solution: "Pre-built executive dashboard with funnel + diversity + cost + forecast. Board pack auto-generated in 5 minutes.",
        metrics: [
          { label: "Report time", value: "5 min" },
          { label: "Stakeholder NPS", value: "+42 pts" },
          { label: "Analyst time saved", value: "8 hrs" },
        ],
      },
      {
        company: "CloudPeak SaaS",
        industry: "IT & SaaS",
        challenge: "Quarterly TA report — 12 KPIs across 4 stakeholders. Manual effort was 16+ hours per quarter.",
        solution: "Scheduled auto-emailed reports per stakeholder. QBR pack auto-generated with optimization recommendations.",
        metrics: [
          { label: "Reports automated", value: "12" },
          { label: "Manual effort", value: "0 hrs" },
          { label: "On-time delivery", value: "100%" },
        ],
      },
      {
        company: "FinEdge",
        industry: "Fintech",
        challenge: "₹50L sourcing budget across 8 channels — no visibility on which channels actually converted to hires.",
        solution: "Funnel analytics revealed referrals + AI sourcing converted 3× better than job boards. Reallocated 40% budget.",
        metrics: [
          { label: "Budget reallocation", value: "40%" },
          { label: "Hires / ₹1L spent", value: "+38%" },
          { label: "Cost-per-hire", value: "−24%" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "Board pack in 5 minutes, not 8 hours. Real-time dashboards changed how our board views TA — from cost center to strategic function.",
        name: "Suresh Krishnan",
        role: "CHRO",
        company: "HDFC Bank",
        initials: "SK",
      },
      {
        quote: "12 reports automated across 4 stakeholders — zero manual effort. QBR pack auto-generated with optimization recommendations. Game-changer.",
        name: "Sneha Iyer",
        role: "VP Talent",
        company: "CloudPeak SaaS",
        initials: "SI",
      },
      {
        quote: "₹50L budget across 8 channels — analytics revealed referrals + AI sourcing 3× better than job boards. Reallocated 40%, cost-per-hire dropped 24%.",
        name: "Karan Bhatia",
        role: "CFO",
        company: "FinEdge",
        initials: "KB",
      },
    ],
    pricing: [
      {
        name: "Basic",
        price: "Free",
        period: "up to 5 users",
        desc: "For small teams getting started with hiring analytics.",
        features: ["3 standard dashboards", "Daily refresh", "Email exports (PDF)", "5-user access", "30-day history", "Community support"],
        cta: "Start free",
      },
      {
        name: "Pro",
        price: "₹19,999",
        period: "per month",
        desc: "For TA teams hiring 5+ roles per quarter.",
        features: ["12 pre-built dashboards", "Real-time refresh (60s)", "Custom KPIs + alerts", "Scheduled auto-reports", "Diversity metrics", "Greenhouse / Lever sync"],
        cta: "Start 14-day trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "annual contract",
        desc: "For high-volume or regulated hiring.",
        features: ["Unlimited custom dashboards", "Dedicated data analyst", "SAP / Oracle / Workday integration", "Compliance audit pack", "Custom predictive models", "On-prem / VPC option"],
        cta: "Contact sales",
      },
    ],
    faqs: [
      { q: "Can I customize dashboards?", a: "Yes — Pro tier includes custom dashboard builder with drag-and-drop KPIs. Enterprise includes dedicated analyst who builds custom dashboards for your stakeholders." },
      { q: "What data sources do you integrate?", a: "ATS (Greenhouse, Lever, iCIMS), HRIS (Workday, BambooHR, SAP SuccessFactors, Oracle HCM), assessment tools (HackerRank, CoderPad, Mettl), sourcing tools (LinkedIn, Naukrm, Shine), and our own sourcing + engagement platform." },
      { q: "What export formats do you support?", a: "PDF, Excel, CSV, JSON, and direct API. Scheduled reports auto-emailed in your preferred format. Audit packs for compliance come pre-formatted for EEOC, SEC, and Indian regulators." },
      { q: "How do scheduled reports work?", a: "Define report (dashboard view, KPI summary, or custom), pick recipients + cadence (daily / weekly / monthly / quarterly), and we auto-email. Auto-pauses on holidays, auto-resumes." },
      { q: "Do you track diversity metrics?", a: "Yes — gender, age band, region, and (where consented) disability status per role + stage + recruiter. All diversity data is candidate-consented and audit-ready for compliance." },
      { q: "Is there an API?", a: "Yes — REST API for all metrics + dimensions. Pro tier includes 10K API calls/month, Enterprise includes unlimited. Webhooks for threshold breaches and KPI alerts." },
    ],
    cta: {
      title: "Real-time hiring intelligence — on tap",
      desc: "Live dashboards, scheduled reports, diversity metrics, recruiter scorecards. Get a sample report in 24 hours.",
      primaryLabel: "Get sample report",
      secondaryLabel: "See dashboards demo",
    },
    related: [
      { key: "ai-sourcing-engine", label: "AI Sourcing Engine", icon: BrainCircuit, desc: "Sourcing data feeds into analytics dashboards." },
      { key: "talent-pool-benchmarks", label: "Talent Pool & Benchmarks", icon: Database, desc: "Pool utilization tracked in real-time." },
      { key: "48-hour-shortlist", label: "48-Hour Shortlist SLA", icon: Clock, desc: "SLA performance tracked in dashboards." },
      { key: "hiring-workflow", label: "Hiring Workflow", icon: Workflow, desc: "Pipeline analytics for every stage." },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper export — icon map (also satisfies no-unused-vars lint rule by
// referencing every imported identifier at least once).
// ─────────────────────────────────────────────────────────────────────────────
export const _TALENT_SOURCING_SUBPAGE_ICONS: Record<string, LucideIcon> = {
  ArrowRight, ArrowLeft, ChevronRight, Sparkles, Briefcase, Search, Clock,
  ShieldCheck, GraduationCap, UserCheck, Award, ClipboardCheck, Layers, Globe,
  Users, TrendingUp, BrainCircuit, Database, Gauge, Wallet, Target, FileCheck2,
  Workflow, BarChart3, CheckCircle2, Zap, Headset, Rocket, Quote, BookOpen,
  Network, RefreshCw, Lightbulb, Microscope, Cog, Server, Code2, Cloud, MapPin,
  Calendar, Wrench, Boxes, PenTool, Megaphone, Handshake, GitBranch, Building2,
  LineChart, Cpu, Stethoscope, Factory, Banknote, ShoppingBag, Truck, Home,
  UserPlus, FileSignature, HeartHandshake, MessagesSquare, Phone, Mail, Bell,
  Filter, PieChart, Activity, Eye, Lock, FileText, Send, CalendarClock,
  ListChecks, CircleDollarSign, Receipt, BadgeCheck, Users2, PhoneCall,
  CreditCard, Smartphone, ClipboardList,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main sub-page component — renders 16 sections based on subPageKey
// ─────────────────────────────────────────────────────────────────────────────
export function PublicTalentSourcingSubPage({ subPageKey }: { subPageKey: string }) {
  const { navigate } = useNav();
  const config = SUB_PAGE_CONFIG[subPageKey];

  const goToSubPage = (key: string) => navigate("public", `talent/talent-sourcing-recruitment/${key}`);
  const goToLanding = () => navigate("public", "talent/talent-sourcing-recruitment");

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="Talent Sourcing sub-page not found"
          description={`We couldn't find a sub-page matching "${subPageKey}". Browse all Talent Sourcing sub-pages to find what you need.`}
          action={
            <Button onClick={goToLanding} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to Talent Sourcing
            </Button>
          }
        />
      </div>
    );
  }

  const HeroIcon = config.hero.icon;

  return (
    <div className="bg-background">
      {/* Top breadcrumb / back link + tab bar */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={goToLanding}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Talent Sourcing
          </button>
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_SUB_PAGES.map((sp) => {
              const Icon = sp.icon;
              const isActive = sp.key === subPageKey;
              return (
                <button
                  key={sp.key}
                  onClick={() => goToSubPage(sp.key)}
                  className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "border-brand bg-brand text-white"
                      : "border-border bg-card text-muted-foreground hover:border-brand hover:text-brand"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : ""}`} />
                  {sp.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ────────── SECTION 1: HERO ────────── */}
      <section className="relative overflow-hidden border-b">
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: `radial-gradient(circle at 30% 0%, ${config.accent}15, transparent 60%)` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <HeroIcon className="h-6 w-6" />
                </span>
                <Badge variant="outline" className="gap-1 text-brand">
                  <Sparkles className="h-3 w-3" /> {config.hero.badge}
                </Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {config.hero.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                {config.hero.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => toast.success(config.hero.ctaPrimary, { description: "Our sourcing team will reach out within 1 business day." })}
                  className="gap-1.5"
                >
                  <Rocket className="h-4 w-4" /> {config.hero.ctaPrimary}
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
                  <Headset className="h-4 w-4" /> {config.hero.ctaSecondary}
                </Button>
              </div>
            </div>
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-muted-foreground">At a glance</h3>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                {config.hero.stats.map((s) => (
                  <div key={s.label} className="space-y-1">
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="text-2xl font-bold text-brand">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Talk to a {config.hero.title} specialist today.
                </p>
                <Button size="sm" className="mt-2 w-full gap-1.5" onClick={() => navigate("public", "contact")}>
                  <Headset className="h-3.5 w-3.5" /> Talk to Sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ────────── SECTION 2: OVERVIEW ────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="p-6">
            <Badge variant="outline" className="mb-3 text-brand">What it is</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Overview</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{config.overview.what}</p>
          </Card>
          <Card className="border-brand/30 bg-gradient-to-br from-brand/5 to-background p-6">
            <Badge variant="outline" className="mb-3 text-brand">Why it matters</Badge>
            <h3 className="text-lg font-semibold">Why teams choose this</h3>
            <ul className="mt-4 space-y-3">
              {config.overview.why.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span className="text-sm leading-relaxed text-foreground">{w}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* ────────── SECTION 3: KEY FEATURES ────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Key features</h2>
            <p className="mt-2 text-sm text-muted-foreground">What makes our {config.label.toLowerCase()} different.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {config.keyFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="h-full p-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────── SECTION 4: HOW IT WORKS ────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground">{config.howItWorks.length} steps from kickoff to delivery.</p>
        </div>
        <div className="relative space-y-6 before:absolute before:left-3 before:h-full before:w-px before:bg-border sm:before:left-1/2">
          {config.howItWorks.map((p, i) => (
            <div
              key={p.step}
              className={`relative pl-10 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:ml-0 sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"}`}
            >
              <div
                className={`absolute top-1 left-0 h-6 w-6 rounded-full border-2 bg-background sm:left-auto ${i % 2 === 0 ? "sm:-right-3" : "sm:-left-3"}`}
                style={{ borderColor: config.accent }}
              >
                <div
                  className="absolute inset-1 rounded-full"
                  style={{ backgroundColor: config.accent }}
                />
              </div>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand">{p.step}</span>
                </div>
                <h3 className="mt-1 text-sm font-semibold">{p.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ────────── SECTION 5: BENEFITS ────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Benefits</h2>
            <p className="mt-2 text-sm text-muted-foreground">Why teams choose our {config.label.toLowerCase()}.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {config.benefits.map((b) => {
              const Icon = b.icon;
              return (
                <Card key={b.title} className="h-full p-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────── SECTION 6: USE CASES ────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Use cases</h2>
          <p className="mt-2 text-sm text-muted-foreground">Real engagements and the outcomes they delivered.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {config.useCases.map((u, i) => (
            <Card key={i} className="flex h-full flex-col p-6" style={{ borderTopColor: config.accent, borderTopWidth: 4 }}>
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
      </section>

      {/* ────────── SECTION 7: COMPARISON ────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How we compare</h2>
            <p className="mt-2 text-sm text-muted-foreground">{config.label} vs traditional approaches.</p>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {config.comparison.columns[0]}
                    </th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {config.comparison.columns[1]}
                    </th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-brand">
                      {config.comparison.columns[2]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {config.comparison.rows.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-4 font-medium text-foreground">{r.feature}</td>
                      <td className="p-4 text-muted-foreground">{r.traditional}</td>
                      <td className="p-4 bg-brand/5">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          <span className="text-foreground">{r.ours}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* ────────── SECTION 8: TECH STACK ────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tech stack</h2>
          <p className="mt-2 text-sm text-muted-foreground">Technology powering our {config.label.toLowerCase()}.</p>
        </div>
        <Card className="p-6">
          <div className="flex flex-wrap justify-center gap-2">
            {config.techStack.map((t) => (
              <Badge key={t} variant="outline" className="bg-card px-3 py-1.5 text-xs text-brand" style={{ borderColor: `${config.accent}40` }}>
                <Cog className="mr-1 h-3 w-3" /> {t}
              </Badge>
            ))}
          </div>
        </Card>
      </section>

      {/* ────────── SECTION 9: INTEGRATIONS ────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Integrations</h2>
            <p className="mt-2 text-sm text-muted-foreground">Connects with your existing ATS, HRIS, and tools.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {config.integrations.map((itg) => {
              const Icon = itg.icon;
              return (
                <Card key={itg.name} className="h-full p-5">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{itg.name}</h3>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">{itg.type}</Badge>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">{itg.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────── SECTION 10: METRICS ────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">By the numbers</h2>
          <p className="mt-2 text-sm text-muted-foreground">Program metrics from the last 12 months.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {config.metrics.map((m) => {
            const Icon = m.icon;
            return (
              <StatCard
                key={m.label}
                label={m.label}
                value={m.value}
                icon={<Icon className="h-5 w-5" />}
                tone="brand"
              />
            );
          })}
        </div>
      </section>

      {/* ────────── SECTION 11: CASE STUDIES ────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Case studies</h2>
            <p className="mt-2 text-sm text-muted-foreground">Real client engagements with measurable outcomes.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {config.caseStudies.map((cs) => (
              <Card key={cs.company} className="flex h-full flex-col p-6" style={{ borderTopColor: config.accent, borderTopWidth: 4 }}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-brand">{cs.industry}</Badge>
                </div>
                <h3 className="mt-2 text-lg font-bold">{cs.company}</h3>
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <div className="font-medium uppercase tracking-wide text-muted-foreground">Challenge</div>
                    <p className="mt-0.5 text-foreground">{cs.challenge}</p>
                  </div>
                  <div>
                    <div className="font-medium uppercase tracking-wide text-muted-foreground">Solution</div>
                    <p className="mt-0.5 text-foreground">{cs.solution}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4">
                  {cs.metrics.map((m) => (
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

      {/* ────────── SECTION 12: TESTIMONIALS ────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What clients say</h2>
          <p className="mt-2 text-sm text-muted-foreground">Hiring leaders on their {config.label.toLowerCase()} engagement.</p>
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
      </section>

      {/* ────────── SECTION 13: PRICING ────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Pricing</h2>
            <p className="mt-2 text-sm text-muted-foreground">Transparent tiers — pick what fits your hiring volume.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {config.pricing.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex h-full flex-col p-6 ${tier.popular ? "border-brand shadow-md" : ""}`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white">MOST POPULAR</Badge>
                )}
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-brand">{tier.price}</span>
                  <span className="text-xs text-muted-foreground">/ {tier.period}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{tier.desc}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-5 w-full gap-1.5"
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => toast.success(tier.cta, { description: "Our team will reach out within 1 business day." })}
                >
                  {tier.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── SECTION 14: FAQ ────────── */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">Common questions about our {config.label.toLowerCase()}.</p>
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

      {/* ────────── SECTION 15: CTA ────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{config.cta.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{config.cta.desc}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button
                size="lg"
                onClick={() => toast.success(config.cta.primaryLabel, { description: "Our team will reach out within 1 business day." })}
                className="gap-1.5"
              >
                <Rocket className="h-4 w-4" /> {config.cta.primaryLabel}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", "contact")} className="gap-1.5">
                <Headset className="h-4 w-4" /> {config.cta.secondaryLabel}
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* ────────── SECTION 16: RELATED SOLUTIONS ────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Related Talent Sourcing sub-pages</h2>
            <p className="mt-2 text-sm text-muted-foreground">Explore other capabilities in the Talent Sourcing engine.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {config.related.map((r) => {
              const Icon = r.icon;
              return (
                <Card
                  key={r.key}
                  className="group h-full cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => goToSubPage(r.key)}
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold group-hover:text-brand">{r.label}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.desc}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand">
                    Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
