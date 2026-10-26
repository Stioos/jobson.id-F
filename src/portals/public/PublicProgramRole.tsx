"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Card, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, ArrowLeft, CheckCircle2, Briefcase, Wallet, Quote,
  TrendingUp, Award, Layers, Rocket,
  Clock, Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  getRoleRoute, getRolesForProgram, getProgramTrackByRoleView,
  getPublicProgram, roleRouteKey,
} from "./_programData";
import type { ProgramTrackInfo } from "@/data/programTracksData";

// Per-specialization salary bands (LPA) — keyed by roleView.
const SALARY_BANDS: Record<string, { role: string; min: number; max: number }[]> = {
  "fde-fullstack-engineer": [
    { role: "Forward Deployed Full-Stack Engineer", min: 8, max: 18 },
    { role: "Full-Stack Product Engineer", min: 9, max: 19 },
    { role: "React/Node.js Engineer", min: 7, max: 16 },
    { role: "GraphQL API Engineer", min: 8, max: 17 },
  ],
  "fde-ai-engineer": [
    { role: "AI Engineer", min: 10, max: 22 },
    { role: "ML Engineer", min: 10, max: 21 },
    { role: "LLM Engineer", min: 12, max: 24 },
    { role: "GenAI Engineer", min: 11, max: 23 },
  ],
  "fde-data-engineer": [
    { role: "Data Engineer", min: 9, max: 20 },
    { role: "Analytics Engineer", min: 9, max: 19 },
    { role: "Platform Data Engineer", min: 10, max: 21 },
    { role: "Pipeline Engineer", min: 8, max: 18 },
  ],
  "fde-cloud-engineer": [
    { role: "Cloud Engineer", min: 9, max: 19 },
    { role: "Cloud Architect", min: 12, max: 24 },
    { role: "Cloud-Native Engineer", min: 10, max: 20 },
    { role: "Infrastructure Engineer", min: 9, max: 19 },
  ],
  "fde-ml-engineer": [
    { role: "ML Engineer", min: 12, max: 24 },
    { role: "ML Platform Engineer", min: 13, max: 25 },
    { role: "Model Deployment Engineer", min: 11, max: 22 },
    { role: "MLOps Engineer", min: 12, max: 23 },
  ],
  "fde-security-engineer": [
    { role: "Security Engineer", min: 10, max: 21 },
    { role: "DevSecOps Engineer", min: 10, max: 20 },
    { role: "AppSec Engineer", min: 11, max: 22 },
    { role: "Cloud Security Engineer", min: 11, max: 22 },
  ],
  "fse-software-engineer": [
    { role: "Full Stack Engineer", min: 6, max: 15 },
    { role: "Frontend Engineer", min: 6, max: 14 },
    { role: "Backend Engineer", min: 7, max: 16 },
    { role: "Web Application Engineer", min: 6, max: 14 },
  ],
  "fse-ai-engineer": [
    { role: "AI Engineer", min: 7, max: 17 },
    { role: "Full Stack AI Engineer", min: 8, max: 18 },
    { role: "AI Integration Engineer", min: 7, max: 16 },
    { role: "LLM Application Engineer", min: 8, max: 18 },
  ],
  "fse-product-engineer": [
    { role: "Product Engineer", min: 7, max: 16 },
    { role: "Founding Engineer", min: 8, max: 18 },
    { role: "Full Stack Engineer (Product)", min: 7, max: 15 },
    { role: "Growth Engineer", min: 7, max: 16 },
  ],
  "fse-saas-engineer": [
    { role: "SaaS Engineer", min: 7, max: 16 },
    { role: "Platform Engineer (SaaS)", min: 8, max: 17 },
    { role: "Multi-tenant Systems Engineer", min: 8, max: 18 },
    { role: "Billing/Payments Engineer", min: 7, max: 17 },
  ],
  "fse-cloud-engineer": [
    { role: "Cloud Engineer", min: 7, max: 17 },
    { role: "DevOps Engineer", min: 7, max: 16 },
    { role: "Cloud-Native Engineer", min: 8, max: 18 },
    { role: "Serverless Engineer", min: 7, max: 16 },
  ],
  "fse-enterprise-engineer": [
    { role: "Enterprise Engineer", min: 8, max: 18 },
    { role: "Systems Engineer", min: 8, max: 17 },
    { role: "Integration Engineer", min: 8, max: 18 },
    { role: "Platform Engineer (Enterprise)", min: 9, max: 19 },
  ],
  "dsai-digital-sales-specialist": [
    { role: "Digital Sales Specialist", min: 5, max: 13 },
    { role: "AI Marketing Specialist", min: 5, max: 12 },
    { role: "Growth Marketing Associate", min: 5, max: 11 },
    { role: "Performance Marketing Analyst", min: 5, max: 12 },
  ],
  "dsai-ai-ma-growth-specialist": [
    { role: "Growth Specialist", min: 6, max: 14 },
    { role: "Marketing Automation Specialist", min: 6, max: 13 },
    { role: "Lifecycle Marketing Lead", min: 6, max: 14 },
    { role: "Growth Hacker", min: 6, max: 13 },
  ],
  "dsai-marketing-automation-engineer": [
    { role: "Marketing Solutions Engineer", min: 7, max: 15 },
    { role: "Marketing Automation Engineer", min: 7, max: 15 },
    { role: "Mar-Tech Engineer", min: 7, max: 16 },
    { role: "Chatbot Developer", min: 6, max: 14 },
  ],
  "dsai-sales-marketing-agents": [
    { role: "AI Agents Engineer", min: 8, max: 16 },
    { role: "Sales Automation Engineer", min: 8, max: 17 },
    { role: "Conversational AI Engineer", min: 7, max: 15 },
    { role: "Multi-Agent Systems Engineer", min: 9, max: 18 },
  ],
  "dsai-revenue-growth-engineer": [
    { role: "Revenue Engineer", min: 8, max: 17 },
    { role: "Growth Engineer (ML)", min: 8, max: 18 },
    { role: "Pricing Engineer", min: 8, max: 17 },
    { role: "Revenue Operations Engineer", min: 8, max: 16 },
  ],
  "dsai-customer-solutions-engineer": [
    { role: "Customer Solutions Engineer", min: 7, max: 15 },
    { role: "AI Support Engineer", min: 7, max: 15 },
    { role: "Support Automation Engineer", min: 7, max: 14 },
    { role: "Conversational Support Engineer", min: 7, max: 15 },
  ],
  "cdm-cloud-infrastructure-engineer": [
    { role: "Cloud Infrastructure Engineer", min: 8, max: 20 },
    { role: "Cloud Architect", min: 12, max: 24 },
    { role: "Cloud Security Engineer", min: 9, max: 19 },
    { role: "FinOps Engineer", min: 8, max: 18 },
  ],
  "cdm-devops-engineer": [
    { role: "DevOps Engineer", min: 7, max: 18 },
    { role: "Release Engineer", min: 7, max: 16 },
    { role: "Build & Release Engineer", min: 7, max: 15 },
    { role: "Automation Engineer", min: 7, max: 16 },
  ],
  "cdm-mlops-engineer": [
    { role: "MLOps Engineer", min: 10, max: 22 },
    { role: "ML Platform Engineer", min: 11, max: 23 },
    { role: "ML Infrastructure Engineer", min: 10, max: 21 },
    { role: "Model Deployment Engineer", min: 9, max: 20 },
  ],
  "cdm-sre-engineer": [
    { role: "Site Reliability Engineer", min: 9, max: 21 },
    { role: "Production Engineer", min: 9, max: 20 },
    { role: "Observability Engineer", min: 8, max: 18 },
    { role: "Incident Response Engineer", min: 9, max: 19 },
  ],
  "cdm-kubernetes-engineer": [
    { role: "Kubernetes Engineer", min: 9, max: 20 },
    { role: "Container Platform Engineer", min: 9, max: 19 },
    { role: "Cloud-Native Engineer", min: 9, max: 20 },
    { role: "Cluster Admin", min: 8, max: 18 },
  ],
  "cdm-platform-cicd-engineer": [
    { role: "Platform Engineer", min: 10, max: 22 },
    { role: "Developer Experience Engineer", min: 9, max: 20 },
    { role: "CI/CD Engineer", min: 8, max: 18 },
    { role: "Internal Platform Engineer", min: 9, max: 19 },
  ],
  "gaa-llm-application-engineer": [
    { role: "LLM Application Engineer", min: 8, max: 22 },
    { role: "AI Engineer (LLM)", min: 9, max: 23 },
    { role: "RAG Engineer", min: 8, max: 20 },
    { role: "LLM Platform Engineer", min: 10, max: 24 },
  ],
  "gaa-ai-agents-engineer": [
    { role: "AI Agents Engineer", min: 10, max: 25 },
    { role: "Multi-Agent Systems Engineer", min: 11, max: 26 },
    { role: "Agentic Automation Engineer", min: 10, max: 24 },
    { role: "AI Workflow Engineer", min: 9, max: 22 },
  ],
  "gaa-generative-ai-engineer": [
    { role: "Generative AI Engineer", min: 8, max: 20 },
    { role: "AI Content Engineer", min: 7, max: 18 },
    { role: "Multimodal AI Engineer", min: 9, max: 21 },
    { role: "AI Creative Engineer", min: 7, max: 17 },
  ],
  "gaa-ai-automation-engineer": [
    { role: "AI Automation Engineer", min: 7, max: 18 },
    { role: "Workflow Automation Engineer", min: 7, max: 16 },
    { role: "Process Automation Engineer", min: 7, max: 17 },
    { role: "Integration Engineer (AI)", min: 8, max: 18 },
  ],
  "gaa-conversational-ai-engineer": [
    { role: "Conversational AI Engineer", min: 8, max: 19 },
    { role: "Chatbot Engineer", min: 7, max: 16 },
    { role: "Voice AI Engineer", min: 8, max: 18 },
    { role: "Dialog Systems Engineer", min: 9, max: 20 },
  ],
  "gaa-ai-product-engineer": [
    { role: "AI Product Engineer", min: 10, max: 24 },
    { role: "AI Full-Stack Engineer", min: 9, max: 22 },
    { role: "AI Solutions Engineer", min: 10, max: 23 },
    { role: "AI Product Manager (Technical)", min: 12, max: 26 },
  ],
};

// "Who should join" — keyed by roleView.
const WHO_SHOULD_JOIN: Record<string, string[]> = {
  "fde-fullstack-engineer": [
    "You have basic programming comfort (any language) and want to ship production full-stack apps for real clients.",
    "You enjoy the full lifecycle — from React UI to Node.js/GraphQL API to PostgreSQL — and want to own features end-to-end.",
    "You thrive in ambiguity and can navigate a live client engagement without step-by-step instructions.",
  ],
  "fde-ai-engineer": [
    "You have programming experience and want to specialize in deploying LLMs, RAG pipelines, and AI agents to production.",
    "You're comfortable with Python and basic ML concepts — or willing to invest 30+ hours/week to catch up.",
    "You want to build AI features that real users interact with, not just notebooks.",
  ],
  "fde-data-engineer": [
    "You enjoy building pipelines, transforming data, and making information flow reliably at scale.",
    "You have basic SQL and Python skills and want to specialize in modern data stack (dbt, Airflow, Kafka, Spark).",
    "You like the satisfaction of a clean dashboard powered by infrastructure you built yourself.",
  ],
  "fde-cloud-engineer": [
    "You're fascinated by cloud infrastructure, automation, and the systems that run other systems.",
    "You have basic Linux/programming comfort and want to master AWS, GCP, Azure, Terraform and Kubernetes.",
    "You like enabling other engineers to ship faster by designing reliable, scalable cloud infrastructure.",
  ],
  "fde-ml-engineer": [
    "You want to bridge the gap between data science and engineering by deploying, monitoring and scaling ML models in production.",
    "You have Python + basic ML knowledge and want to master model deployment, MLOps and A/B testing.",
    "You're excited about MLflow, Kubeflow, drift detection and running experiments that prove business impact.",
  ],
  "fde-security-engineer": [
    "You're passionate about protecting systems and stay curious about new attack vectors.",
    "You have basic programming/scripting experience and want to specialize in AppSec, IAM, and DevSecOps.",
    "You enjoy thinking like an attacker to defend like a pro.",
  ],
  "fse-software-engineer": [
    "You're new to coding or self-taught and want a structured, intensive path to a fullstack engineering role.",
    "You can commit 30–40 hours/week for 24 weeks.",
    "You enjoy building features across the stack — UI, API, database.",
  ],
  "fse-ai-engineer": [
    "You have basic fullstack skills (React + Node) and want to specialize in AI-powered applications.",
    "You're excited about LLMs, RAG, and shipping AI features end-to-end.",
    "You want to be the engineer who bridges traditional web development and modern AI.",
  ],
  "fse-product-engineer": [
    "You want to build products, not just features — and want to think like a PM while coding.",
    "You have basic frontend or backend skills and want to own the full feature lifecycle.",
    "You're considering a future transition to founding your own company.",
  ],
  "fse-saas-engineer": [
    "You want to master multi-tenant architecture, subscription billing, and scalable SaaS patterns.",
    "You have basic fullstack skills and want to specialize in the most in-demand engineering category.",
    "You're aiming for roles at SaaS startups or building your own SaaS.",
  ],
  "fse-cloud-engineer": [
    "You're fascinated by cloud infrastructure and want to combine fullstack with DevOps.",
    "You have basic programming and Linux skills and want to master AWS/GCP, Docker, and Kubernetes.",
    "You want to be the engineer who can both build and deploy apps at scale.",
  ],
  "fse-enterprise-engineer": [
    "You want to build large-scale systems serving millions of users with complex integrations.",
    "You have basic fullstack skills and want to specialize in distributed systems and enterprise architecture.",
    "You're aiming for roles at large product companies or system integrators.",
  ],
  "dsai-digital-sales-specialist": [
    "You're a sales or marketing professional who wants to add AI tools to your toolkit.",
    "You're a beginner with no sales background but strong communication skills and a drive to drive revenue.",
    "You want a career that combines creativity, data, and people skills.",
  ],
  "dsai-ai-ma-growth-specialist": [
    "You're a marketer who wants to master AI-powered automation and growth tactics.",
    "You have basic analytics comfort and want to run experiments that move metrics.",
    "You want to scale your impact beyond manual campaigns.",
  ],
  "dsai-marketing-automation-engineer": [
    "You're an engineer or technical marketer who wants to build the tools that power marketing.",
    "You have basic Python and API skills and want to specialize in marketing engineering.",
    "You enjoy bridging code and campaigns.",
  ],
  "dsai-sales-marketing-agents": [
    "You're a developer who wants to build autonomous AI agents for sales and marketing.",
    "You have Python experience and are excited about LLMs, function calling, and multi-agent orchestration.",
    "You want to be at the frontier of applied AI.",
  ],
  "dsai-revenue-growth-engineer": [
    "You're a technical professional who wants to own revenue as an engineer.",
    "You have basic ML/Python skills and want to apply them to pricing, churn, and growth.",
    "You want a high-impact role that combines engineering, data, and business.",
  ],
  "dsai-customer-solutions-engineer": [
    "You want to build AI-powered customer service platforms that delight users.",
    "You have basic Python/API skills and are excited about NLP, chatbots, and support automation.",
    "You enjoy the intersection of engineering and customer experience.",
  ],
  "cdm-cloud-infrastructure-engineer": [
    "You want to architect cloud systems that scale to millions of users.",
    "You have basic IT/networking knowledge and want to master AWS, Azure & GCP.",
    "You enjoy infrastructure-as-code and want to automate everything.",
  ],
  "cdm-devops-engineer": [
    "You want to be the engineer who ships code 10x faster.",
    "You have basic Linux/Git skills and are excited about CI/CD and automation.",
    "You enjoy breaking down silos between dev and ops.",
  ],
  "cdm-mlops-engineer": [
    "You want to bridge the gap between data science and engineering.",
    "You have Python + basic ML knowledge and want to deploy models in production.",
    "You're excited about model versioning, monitoring and drift detection.",
  ],
  "cdm-sre-engineer": [
    "You want to keep critical systems running at 99.99% uptime.",
    "You have ops/debugging instincts and want to master observability and incident response.",
    "You enjoy chaos engineering and building self-healing systems.",
  ],
  "cdm-kubernetes-engineer": [
    "You want to orchestrate containers at enterprise scale.",
    "You have Docker basics and want to master Kubernetes, Helm and service mesh.",
    "You're excited about GitOps, ArgoCD and cloud-native architectures.",
  ],
  "cdm-platform-cicd-engineer": [
    "You want to build internal developer platforms that teams love.",
    "You have DevOps experience and want to level up to platform engineering.",
    "You're excited about Backstage, Crossplane and developer experience.",
  ],
  "gaa-llm-application-engineer": [
    "You want to build production AI apps with LLMs, RAG & LangChain.",
    "You have Python skills and are excited about prompt engineering and function calling.",
    "You want to deploy AI features that real users interact with.",
  ],
  "gaa-ai-agents-engineer": [
    "You want to build autonomous AI agents with CrewAI, AutoGen & LangGraph.",
    "You have Python + basic AI knowledge and want to build multi-agent systems.",
    "You're excited about agentic workflows, tool use and AI autonomy.",
  ],
  "gaa-generative-ai-engineer": [
    "You want to create with GPT, DALL-E, Stable Diffusion & video models.",
    "You have Python skills and are excited about text, image & video generation.",
    "You want to build multimodal AI content pipelines at scale.",
  ],
  "gaa-ai-automation-engineer": [
    "You want to automate business workflows with AI-powered agentic pipelines.",
    "You have basic Python/API skills and are excited about Zapier, Make.com & n8n.",
    "You want to eliminate repetitive work with intelligent automation.",
  ],
  "gaa-conversational-ai-engineer": [
    "You want to build chatbots, voice assistants & dialog systems.",
    "You have Python + basic NLP knowledge and are excited about Whisper & ElevenLabs.",
    "You want to create AI that truly understands and helps users.",
  ],
  "gaa-ai-product-engineer": [
    "You want to build AI-first products from idea to production.",
    "You have full-stack skills and want to integrate AI into products.",
    "You're excited about AI product strategy, prototyping and metrics.",
  ],
};

// Testimonials (one per roleView is overkill — use program-level testimonials as fallback).
const TESTIMONIALS: Record<string, { name: string; role: string; company: string; initials: string; quote: string; ctc: string }[]> = {
  "fde-fullstack-engineer": [
    { name: "Aarav Kulkarni", role: "Forward Deployed Full-Stack Engineer", company: "Razorpay", initials: "AK", ctc: "₹16 LPA", quote: "The forward-deployment mindset was the unlock. I had real production war stories with React, Node.js and GraphQL to tell in interviews — that's why I beat candidates from Tier-1 colleges." },
    { name: "Megha Rao", role: "Full-Stack Engineer", company: "PhonePe", initials: "MR", ctc: "₹14 LPA", quote: "By week 12 I was shipping full-stack features — React UI, GraphQL API, Postgres — that real users clicked. The transition from assignments to production was scary at first but that's what hiring managers want." },
  ],
  "fse-software-engineer": [
    { name: "Pooja Reddy", role: "Full Stack Engineer", company: "Swiggy", initials: "PR", ctc: "₹12 LPA", quote: "From a non-CS background to a fullstack role at Swiggy in 24 weeks. The mentorship and project feedback were brutal but exactly what I needed." },
    { name: "Rahul Jain", role: "Full Stack Engineer", company: "Razorpay", initials: "RJ", ctc: "₹13 LPA", quote: "12 portfolio projects, 1:1 mentorship, and a placement cell that actually cares. Worth every rupee — and I only paid after I got the offer." },
  ],
  "dsai-digital-sales-specialist": [
    { name: "Karthik Iyer", role: "AI Marketing Engineer", company: "Zoho", initials: "KI", ctc: "₹11 LPA", quote: "I was a sales guy who couldn't code. Now I build AI agents that book meetings autonomously. My salary tripled in 6 months." },
    { name: "Ananya S", role: "Growth Specialist", company: "CRED", initials: "AS", ctc: "₹10 LPA", quote: "The AI marketing tooling I learned here saves me 15 hours a week. I run experiments now, not just campaigns." },
  ],
  "cdm-devops-engineer": [
    { name: "Arjun Reddy", role: "DevOps Engineer", company: "Razorpay", initials: "AR", ctc: "₹16 LPA", quote: "I was stuck in a support role for 3 years. The CDM program gave me the exact skills — Terraform, Kubernetes, CI/CD — that every product company was hiring for." },
    { name: "Neha Gupta", role: "DevOps Engineer", company: "PhonePe", initials: "NG", ctc: "₹15 LPA", quote: "The CI/CD capstone was my interview showpiece. I built a full pipeline with automated tests, security scans and zero-downtime deployment. Hiring managers were blown away." },
  ],
  "cdm-mlops-engineer": [
    { name: "Priya Nair", role: "MLOps Engineer", company: "Postman", initials: "PN", ctc: "₹20 LPA", quote: "The MLOps track is gold. I went from notebooks to deploying models on Kubernetes with full monitoring and drift detection. Highest-paying role in my cohort." },
    { name: "Rahul Verma", role: "ML Platform Engineer", company: "Groww", initials: "RV", ctc: "₹22 LPA", quote: "I bridged data science and engineering. The Kubeflow + MLflow + Evidently stack I learned here is exactly what production ML teams use. Rare skills, premium pay." },
  ],
  "cdm-sre-engineer": [
    { name: "Siddharth Verma", role: "Site Reliability Engineer", company: "Zerodha", initials: "SV", ctc: "₹18 LPA", quote: "The SRE specialization taught me to think in SLOs, error budgets and postmortems. I now run on-call for a system that processes millions of trades." },
    { name: "Anika Patel", role: "Production Engineer", company: "Swiggy", initials: "AP", ctc: "₹17 LPA", quote: "The chaos engineering labs were terrifying — and exactly what I needed. I now design systems that survive the failures I used to fear." },
  ],
  "cdm-kubernetes-engineer": [
    { name: "Vikram Singh", role: "Kubernetes Engineer", company: "Razorpay", initials: "VS", ctc: "₹19 LPA", quote: "K8s is the operating system of the cloud. The program took me from Docker basics to running multi-cluster service mesh. Every product company is hiring for this." },
    { name: "Divya Reddy", role: "Container Platform Engineer", company: "Freshworks", initials: "DR", ctc: "₹18 LPA", quote: "The GitOps with ArgoCD module changed how I think about deployments. Roll back with a PR, not a panic. Pure engineering joy." },
  ],
  "cdm-cloud-infrastructure-engineer": [
    { name: "Karan Mehta", role: "Cloud Infrastructure Engineer", company: "Postman", initials: "KM", ctc: "₹17 LPA", quote: "Multi-cloud architecture was the unlock. I now design systems that span AWS, Azure and GCP — and I cut my company's cloud bill by 40% with the FinOps skills I learned." },
    { name: "Sneha Iyer", role: "Cloud Architect", company: "Zoho", initials: "SI", ctc: "₹21 LPA", quote: "From a sysadmin to a cloud architect in 22 weeks. The Terraform modules I built during the capstone are now in production at Zoho. Real work, real impact." },
  ],
  "cdm-platform-cicd-engineer": [
    { name: "Aditya Rao", role: "Platform Engineer", company: "CRED", initials: "AR", ctc: "₹20 LPA", quote: "Building an internal developer platform with Backstage was the most satisfying project of my career. Developers at CRED now ship 3x faster because of the golden paths I built." },
    { name: "Meera Kapoor", role: "Developer Experience Engineer", company: "Groww", initials: "MK", ctc: "₹19 LPA", quote: "Platform engineering is the future of DevOps. The DORA metrics dashboard I built during the capstone is now used by our VP of Engineering every week. High visibility, high impact." },
  ],
  "gaa-llm-application-engineer": [
    { name: "Rohan Khanna", role: "LLM Application Engineer", company: "Postman", initials: "RK", ctc: "₹20 LPA", quote: "The RAG and LangChain modules were incredible. I built a production document-Q&A system that handles 10,000+ queries a day. The fine-tuning track gave me skills very few engineers in India have." },
    { name: "Anika Sharma", role: "AI Engineer (LLM)", company: "Razorpay", initials: "AS", ctc: "₹22 LPA", quote: "From zero AI knowledge to deploying LLM apps with FastAPI and monitoring. The capstone RAG system I built is now used by Razorpay's support team. Production AI, not notebooks." },
  ],
  "gaa-ai-agents-engineer": [
    { name: "Ananya Gupta", role: "AI Agents Engineer", company: "Razorpay", initials: "AG", ctc: "₹22 LPA", quote: "The GAA program is the future. I went from zero AI knowledge to building multi-agent systems with CrewAI that automate real business workflows. My agent capstone is now in production." },
    { name: "Karan Mehta", role: "Multi-Agent Systems Engineer", company: "CRED", initials: "KM", ctc: "₹24 LPA", quote: "Building autonomous agents with LangGraph and AutoGen was mind-blowing. I built a multi-agent research system that replaced 3 FTEs. Every product company is hiring for this." },
  ],
  "gaa-generative-ai-engineer": [
    { name: "Divya Reddy", role: "Generative AI Engineer", company: "Groww", initials: "DR", ctc: "₹18 LPA", quote: "Creating with GPT-4, DALL-E and Stable Diffusion was incredible. I built a multimodal content pipeline that generates marketing assets at scale. Creative engineering at its best." },
    { name: "Arjun Nair", role: "Multimodal AI Engineer", company: "Swiggy", initials: "AN", ctc: "₹19 LPA", quote: "The text + image + video generation pipeline I built during the capstone is now used by Swiggy's content team. AI creativity is a real career now." },
  ],
  "gaa-ai-automation-engineer": [
    { name: "Vikram Singh", role: "AI Automation Engineer", company: "Freshworks", initials: "VS", ctc: "₹16 LPA", quote: "I automated 40+ business workflows with AI-powered pipelines. The Zapier + LangChain + Airflow stack I learned here saves my company 2,000+ hours per month. Real impact." },
    { name: "Neha Patel", role: "Workflow Automation Engineer", company: "Zoho", initials: "NP", ctc: "₹15 LPA", quote: "The automation track is perfect for engineers who want immediate business impact. Every workflow I automate saves real money. My capstone automation is now company-wide." },
  ],
  "gaa-conversational-ai-engineer": [
    { name: "Sneha Iyer", role: "Conversational AI Engineer", company: "PhonePe", initials: "SI", ctc: "₹18 LPA", quote: "Building a voice assistant with Whisper + ElevenLabs + LangChain was incredible. My chatbot handles 50,000+ conversations a day with 91% resolution rate. AI that actually helps users." },
    { name: "Rahul Verma", role: "Voice AI Engineer", company: "Razorpay", initials: "RV", ctc: "₹17 LPA", quote: "The conversational AI track is unique. I built a voice-first support bot that reduced ticket volume by 40%. The Whisper + TTS integration was my favorite part." },
  ],
  "gaa-ai-product-engineer": [
    { name: "Sneha Reddy", role: "AI Product Engineer", company: "CRED", initials: "SR", ctc: "₹24 LPA", quote: "The AI Product track taught me to think end-to-end — from AI strategy to full-stack implementation. I shipped an AI-first product as my capstone that CRED is now piloting." },
    { name: "Aditya Patel", role: "AI Full-Stack Engineer", company: "Postman", initials: "AP", ctc: "₹22 LPA", quote: "Building AI products with React + FastAPI + LangChain + Pinecone was exactly what I wanted. The capstone AI product I built is now my portfolio showpiece. Highest-paying role in my cohort." },
  ],
};

export function PublicProgramRole({ roleView }: { roleView: string }) {
  const { navigate } = useNav();

  const roleRoute = getRoleRoute(roleView);
  const track: ProgramTrackInfo | null = getProgramTrackByRoleView(roleView);

  if (!roleRoute || !track) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={<Award className="h-6 w-6" />}
          title="Specialization not found"
          description={`We couldn't find a specialization track for "${roleView}".`}
          action={
            <Button onClick={() => navigate("public", "programs")} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> All programs
            </Button>
          }
        />
      </div>
    );
  }

  const program = getPublicProgram(roleRoute.programId);
  const accent = roleRoute.color;
  const siblings = getRolesForProgram(roleRoute.programId).filter(
    (r) => r.roleView !== roleView,
  );
  const salaryBands = SALARY_BANDS[roleView] ?? [];
  const whoShouldJoin = WHO_SHOULD_JOIN[roleView] ?? [];
  const testimonials = TESTIMONIALS[roleView] ?? [];

  return (
    <div className="bg-background">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <button
            onClick={() => navigate("public", roleRoute.programId)}
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to {program?.label ?? "program"}
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="secondary"
                  className="border text-xs font-semibold"
                  style={{ color: accent, borderColor: accent, backgroundColor: `${accent}14` }}
                >
                  {track.badge}
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs">
                  <Layers className="h-3 w-3" /> {program?.tag} · {program?.label.replace(/^(Forward Deployed|Fullstack Development|Digital Sales & AI Marketing \/ AI) /, "")}
                </Badge>
                <Badge variant="outline" className="gap-1 border-brand text-brand">
                  <Wallet className="h-3 w-3" /> Pay After Placement
                </Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {track.title}
              </h1>
              <p className="mt-3 text-base font-medium" style={{ color: accent }}>
                {track.subtitle}
              </p>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                {track.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => toast.success("Application started!", {
                  description: `You're applying for the ${track.title} specialization. A counselor will reach out within 24 hours.`,
                })} className="gap-1.5">
                  <Rocket className="h-4 w-4" /> Apply for this specialization
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("public", roleRoute.programId)} className="gap-1.5">
                  <Layers className="h-4 w-4" /> View full program
                </Button>
              </div>
            </div>

            {/* Hero side card */}
            <Card className="p-6" style={{ borderColor: accent + "55" }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Specialization</p>
                  <p className="text-sm font-semibold">{track.specialization}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold">{track.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weeks</p>
                  <p className="text-sm font-semibold">{track.weeks} weeks</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="text-sm font-semibold">{track.mode}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-sm font-semibold">{track.level}</p>
                </div>
              </div>
              {salaryBands.length > 0 && (
                <div className="mt-5 border-t pt-4">
                  <p className="text-xs text-muted-foreground">Starting salary band</p>
                  <p className="text-base font-bold text-brand">
                    ₹{salaryBands[0].min}–{salaryBands[0].max} LPA
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* ===================== HIGHLIGHTS GRID ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What you&apos;ll master</h2>
          <p className="mt-2 text-sm text-muted-foreground">Four core competencies that define this specialization.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {track.highlights.map((h, i) => (
            <Card key={i} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight">{h.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{h.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== CURRICULUM PHASES ===================== */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Curriculum</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {track.curriculum.length} phases across {track.weeks} weeks. Built and refreshed with hiring partners.
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" /> {track.weeks} weeks total
            </Badge>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {track.curriculum.map((phase, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${accent}1A`, color: accent }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{phase.title}</h3>
                      <p className="text-xs text-muted-foreground">{phase.weeks}</p>
                    </div>
                  </div>
                </div>
                <ul className="mt-4 max-h-44 space-y-1.5 overflow-y-auto pr-2 scroll-thin">
                  {phase.topics.map((t, ti) => (
                    <li key={ti} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TECH STACK ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tech stack you&apos;ll master</h2>
          <p className="mt-2 text-sm text-muted-foreground">Hands-on with {track.techStack.length} production tools hiring partners use daily.</p>
        </div>
        <Card className="p-5">
          <div className="flex flex-wrap gap-2">
            {track.techStack.map((t) => (
              <Badge key={t} variant="secondary" className="border">
                {t}
              </Badge>
            ))}
          </div>
        </Card>
      </section>

      {/* ===================== CAREER OUTCOMES ===================== */}
      {salaryBands.length > 0 && (
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Career outcomes</h2>
              <p className="mt-2 text-sm text-muted-foreground">Roles graduates of this specialization typically land, with realistic salary bands.</p>
            </div>
            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                {salaryBands.map((o, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${accent}1A`, color: accent }}
                      >
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{o.role}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-brand">₹{o.min}–{o.max} LPA</p>
                      <p className="text-[10px] text-muted-foreground">starting CTC</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <p className="mt-3 text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3" />
              Top 10% of graduates earn 30–60% above the upper band. Based on the last 3 cohorts of this specialization.
            </p>
          </div>
        </section>
      )}

      {/* ===================== WHO SHOULD JOIN ===================== */}
      {whoShouldJoin.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Who should join</h2>
            <p className="mt-2 text-sm text-muted-foreground">Is this specialization right for you? See if you match the profile.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {whoShouldJoin.map((w, i) => (
              <Card key={i} className="p-5" style={{ borderColor: accent + "44" }}>
                <div
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <Users className="h-4 w-4" />
                </div>
                <p className="text-sm text-muted-foreground">{w}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ===================== SIBLING ROLES ===================== */}
      {siblings.length > 0 && (
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Other specializations in this program</h2>
                <p className="mt-2 text-sm text-muted-foreground">Explore the {siblings.length} other tracks you can switch into during Phase 1.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("public", roleRoute.programId)} className="gap-1.5">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((r) => (
                <Card
                  key={r.roleView}
                  className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                  onClick={() => navigate("public", roleRouteKey(r.roleView))}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${r.color}1A`, color: r.color }}
                    >
                      <Award className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="border text-[10px]"
                      style={{ color: r.color, borderColor: r.color + "66" }}>
                      {r.badge}
                    </Badge>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-tight">{r.label}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{r.motive}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    View details <ArrowRight className="h-3 w-3" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== TESTIMONIALS ===================== */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Graduate stories</h2>
            <p className="mt-2 text-sm text-muted-foreground">From this specialization to offers at top companies.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {testimonials.map((t) => (
              <Card key={t.name} className="flex h-full flex-col p-6">
                <Quote className="h-6 w-6 text-brand/40" />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3 border-t pt-4">
                  <AvatarLogo text={t.initials} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.role} · {t.company}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto border border-brand/40 text-brand">{t.ctc}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to become a {track.specialization.toLowerCase()}?
              </h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Apply now or talk to a counselor about whether this specialization fits your background and goals.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => toast.success("Application started!", {
                description: `Applying for ${track.title}. A counselor will reach out within 24 hours.`,
              })} className="gap-1.5">
                <Rocket className="h-4 w-4" /> Apply Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("public", roleRoute.programId)} className="gap-1.5">
                <Layers className="h-4 w-4" /> View Full Program
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
