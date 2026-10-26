export interface ProgramPhase {
  phase: string;
  title: string;
  weeks: string;
  duration: string;
  topics: string[];
}

export interface ProgramHighlight {
  title: string;
  desc: string;
}

export interface ProgramTrackInfo {
  trackKey: string;
  mainProgramId: 'fde-fwd' | 'fde' | 'dsai' | 'cdm' | 'gaa';
  mainProgramName: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  weeks: number;
  mode: string;
  level: string;
  specialization: string;
  techStack: string[];
  highlights: ProgramHighlight[];
  curriculum: ProgramPhase[];
}

export const PROGRAM_TRACKS: Record<string, ProgramTrackInfo> = {
  // ==========================================
  // 1. FORWARD DEPLOYED ENGINEER (FDE-FWD)
  // ==========================================
  'fde-fwd:data engineer': {
    trackKey: 'fde-fwd-data-engineer',
    mainProgramId: 'fde-fwd',
    mainProgramName: 'Forward Deployed Engineer (FDE-FWD)',
    badge: 'FDE-DE',
    title: 'Forward Deployed Data Engineer',
    subtitle: 'Build Data Pipelines, Streaming Systems & Real-Time Analytics',
    description:
      'Become the engineer who turns raw data into reliable infrastructure. Master modern data stacks — Spark, Kafka, Snowflake, dbt — and ship real-time analytics for real clients.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Hybrid / Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Data Engineer',
    techStack: ['Python', 'Apache Spark', 'Kafka', 'Snowflake', 'BigQuery', 'dbt', 'Airflow', 'PostgreSQL', 'Delta Lake', 'AWS'],
    highlights: [
      { title: 'Modern Data Stack', desc: 'Master Snowflake, BigQuery, dbt and Spark — the tools that power data teams at top product companies.' },
      { title: 'Streaming & Real-Time', desc: 'Build real-time data pipelines with Kafka and Flink. Deliver insights in seconds, not hours.' },
      { title: 'Data Infrastructure', desc: 'Design data lakes, warehouses and ETL/ELT pipelines that are testable, version-controlled and production-ready.' },
      { title: 'Client Data Solutions', desc: 'Deploy data infrastructure for real clients. Build pipelines, dashboards and analytics that drive business decisions.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Data Foundations',
        title: 'Phase 1: Data Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'Python for Data Engineering',
          'Advanced SQL & Query Optimization',
          'Data Structures & Algorithms for Data',
          'Statistics & Exploratory Data Analysis',
          'Data Cleaning & Profiling Basics',
        ],
      },
      {
        phase: 'Phase 2: Data Engineering Core',
        title: 'Phase 2: Data Engineering Core',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Apache Spark & Distributed Processing',
          'Apache Kafka & Event Streaming',
          'Apache Airflow for Orchestration',
          'dbt for Data Transformations',
          'Data Warehousing & Dimensional Modeling',
          'ETL/ELT Pipeline Patterns',
        ],
      },
      {
        phase: 'Phase 3: Advanced Data Systems',
        title: 'Phase 3: Advanced Data Systems',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Snowflake & Cloud Data Warehouses',
          'BigQuery & Serverless Analytics',
          'Delta Lake & Data Lakehouse Architecture',
          'Real-Time Streaming & Windowed Analytics',
          'Data Quality, Testing & Observability',
          'Customer Data Platforms & Integration',
        ],
      },
      {
        phase: 'Phase 4: Capstone: Client Data Platform',
        title: 'Phase 4: Capstone: Client Data Platform',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'Live Client Data Pipeline Engagement',
          'Production Dashboard & Analytics Delivery',
          'Data Governance, Security & Compliance',
          'Handover, Documentation & Knowledge Transfer',
          'Capstone: End-to-End Data Platform for a Real Client',
        ],
      },
    ],
  },

  'fde-fwd:ai engineer': {
    trackKey: 'fde-fwd-ai-engineer',
    mainProgramId: 'fde-fwd',
    mainProgramName: 'Forward Deployed Engineer (FDE-FWD)',
    badge: 'FDE-AIE',
    title: 'Forward Deployed AI Engineer',
    subtitle: 'Deploy AI-Powered Solutions with LLMs, RAG & MLOps',
    description:
      'Become the engineer who deploys AI to production. Master LLMs, RAG pipelines, prompt engineering and MLOps. Ship AI features that real users interact with — not notebooks.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Hybrid / Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'AI Engineer',
    techStack: ['Python', 'LangChain', 'OpenAI API', 'TensorFlow', 'PyTorch', 'RAG', 'Vector DBs', 'Docker', 'Kubernetes', 'AWS SageMaker'],
    highlights: [
      { title: 'LLM Engineering', desc: 'Master prompt engineering, function calling, RAG pipelines and LangChain. Build AI features that work in production, not just demos.' },
      { title: 'Model Deployment', desc: 'Deploy ML models with Docker, Kubernetes and SageMaker. Master serving, scaling and A/B testing in production.' },
      { title: 'AI Infrastructure', desc: 'Build the infrastructure that powers AI — vector databases, model registries, inference servers and monitoring.' },
      { title: 'Client AI Solutions', desc: 'Deploy AI solutions for real clients. Gather requirements, prototype, ship and iterate — the forward-deployed AI engineer model.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: AI & ML Foundations',
        title: 'Phase 1: AI & ML Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'Python for ML & Data Science',
          'Statistics & Probability Essentials',
          'Machine Learning Fundamentals (Supervised & Unsupervised)',
          'Deep Learning Basics (Neural Networks, MLPs)',
          'Git, Linux & Environment Setup for AI Projects',
        ],
      },
      {
        phase: 'Phase 2: LLM & Generative AI',
        title: 'Phase 2: LLM & Generative AI',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Prompt Engineering & Chain-of-Thought',
          'LangChain & LLM Orchestration Frameworks',
          'RAG Pipelines & Embedding Strategies',
          'Vector Databases (Pinecone, Weaviate, ChromaDB)',
          'OpenAI API & Function Calling',
          'Fine-Tuning Models (LoRA, QLoRA, PEFT)',
        ],
      },
      {
        phase: 'Phase 3: MLOps & Production AI',
        title: 'Phase 3: MLOps & Production AI',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Model Deployment with Docker & Kubernetes',
          'AWS SageMaker & Managed ML Services',
          'Model Monitoring & Observability',
          'A/B Testing for ML & AI Features',
          'Drift Detection & Automated Retraining',
          'Cost Optimization & Scaling Strategies',
        ],
      },
      {
        phase: 'Phase 4: Capstone: Client AI Deployment',
        title: 'Phase 4: Capstone: Client AI Deployment',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'Live Client AI Project Engagement',
          'Production RAG System Build-Out',
          'AI Monitoring, Guardrails & Safety',
          'Handover, Documentation & Knowledge Transfer',
          'Capstone: End-to-End AI Deployment for a Real Client',
        ],
      },
    ],
  },

  'fde-fwd:fullstack engineer': {
    trackKey: 'fde-fwd-fullstack-engineer',
    mainProgramId: 'fde-fwd',
    mainProgramName: 'Forward Deployed Engineer (FDE-FWD)',
    badge: 'FDE-FSE',
    title: 'Forward Deployed Full-Stack Engineer',
    subtitle: 'Build & Ship Full-Stack Apps with React, Node.js & GraphQL',
    description:
      'Become the engineer who builds end-to-end products and deploys them to real clients. Master React, Next.js, Node.js, GraphQL and microservices — then ship to production from week 4.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Hybrid / Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Full-Stack Engineer',
    techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'microservices'],
    highlights: [
      { title: 'Full-Stack Mastery', desc: 'Build production apps with React, Next.js, Node.js & PostgreSQL — from database schema to pixel-perfect UI.' },
      { title: 'API & Microservices', desc: 'Design GraphQL APIs and microservice architectures that scale. Master API gateways, service meshes and event-driven patterns.' },
      { title: 'Production Deployment', desc: 'Ship to real clients from week 4. Learn CI/CD, Docker, monitoring and incident response — not just coding.' },
      { title: 'Client Engineering', desc: 'Work directly with client engineering teams. Gather requirements, scope features and deliver iteratively — the Palantir FDE model.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Full-Stack Foundations',
        title: 'Phase 1: Full-Stack Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'Modern JavaScript & TypeScript Essentials',
          'React Fundamentals & Component Architecture',
          'Node.js & Express Backend Development',
          'PostgreSQL & SQL Fundamentals',
          'Git, GitHub & Collaboration Workflows',
        ],
      },
      {
        phase: 'Phase 2: Advanced Full-Stack',
        title: 'Phase 2: Advanced Full-Stack',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Next.js, SSR & App Router Patterns',
          'GraphQL API Design & Implementation',
          'Microservices Architecture Patterns',
          'Redis & Caching Strategies',
          'Authentication & Authorization (JWT, OAuth)',
          'API Gateways & Service Mesh Basics',
        ],
      },
      {
        phase: 'Phase 3: Production Engineering',
        title: 'Phase 3: Production Engineering',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Docker & Containerization',
          'CI/CD Pipelines with GitHub Actions',
          'AWS Deployment (EC2, S3, RDS, ECS)',
          'Monitoring, Logging & Observability',
          'Client Project Deployment & Operations',
          'Incident Response & On-Call Practices',
        ],
      },
      {
        phase: 'Phase 4: Capstone & Forward Deployment',
        title: 'Phase 4: Capstone & Forward Deployment',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'Live Client Project Engagement',
          'Production Deployment & Release Management',
          'Incident Response & Postmortems',
          'Handover, Documentation & Knowledge Transfer',
          'Capstone: End-to-End Full-Stack Delivery for a Real Client',
        ],
      },
    ],
  },

  'fde-fwd:cloud engineer': {
    trackKey: 'fde-fwd-cloud-engineer',
    mainProgramId: 'fde-fwd',
    mainProgramName: 'Forward Deployed Engineer (FDE-FWD)',
    badge: 'FDE-CE',
    title: 'Forward Deployed Cloud Engineer',
    subtitle: 'Architect Cloud-Native Systems on AWS, GCP & Azure',
    description:
      'Become the engineer who designs and deploys cloud infrastructure at scale. Master AWS, GCP, Azure, Terraform and Kubernetes — then deploy for real clients.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Hybrid / Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Cloud Engineer',
    techStack: ['AWS', 'GCP', 'Azure', 'Terraform', 'Kubernetes', 'Docker', 'CI/CD', 'CloudFormation', 'IAM', 'CloudWatch'],
    highlights: [
      { title: 'Multi-Cloud Architecture', desc: 'Design and deploy across AWS, GCP and Azure. Pick the right tool for each workload and avoid vendor lock-in.' },
      { title: 'Infrastructure as Code', desc: 'Master Terraform and CloudFormation to provision repeatable, version-controlled infrastructure in minutes.' },
      { title: 'Cloud-Native Deployment', desc: 'Deploy containerized apps on Kubernetes, configure CI/CD and manage auto-scaling for production workloads.' },
      { title: 'Client Cloud Migration', desc: 'Migrate real client workloads to the cloud. Plan, execute and optimize — the forward-deployed cloud engineer model.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Cloud Foundations',
        title: 'Phase 1: Cloud Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'Linux System Administration & Shell Scripting',
          'Networking Fundamentals (TCP/IP, DNS, Load Balancing)',
          'AWS Core Services (EC2, S3, RDS, VPC)',
          'GCP & Azure Fundamentals',
          'Cloud Security & IAM Basics',
        ],
      },
      {
        phase: 'Phase 2: Infrastructure as Code',
        title: 'Phase 2: Infrastructure as Code',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Terraform Fundamentals & Modules',
          'AWS CloudFormation & Native IaC',
          'VPC Design & Network Architecture',
          'Load Balancers & Auto-Scaling Groups',
          'Route53 & DNS Management',
          'Secrets Management & Configuration',
        ],
      },
      {
        phase: 'Phase 3: Cloud-Native Engineering',
        title: 'Phase 3: Cloud-Native Engineering',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Kubernetes & Container Orchestration',
          'Docker & Containerization Best Practices',
          'CI/CD Pipelines for Cloud Workloads',
          'Cloud Security Deep Dive (IAM, Network Policies, RBAC)',
          'Cost Optimization & FinOps',
          'Multi-Cloud Strategy & Hybrid Deployments',
        ],
      },
      {
        phase: 'Phase 4: Capstone: Client Cloud Migration',
        title: 'Phase 4: Capstone: Client Cloud Migration',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'Live Client Cloud Migration Engagement',
          'Production Infrastructure Deployment',
          'Monitoring, Alerting & Incident Response',
          'Handover, Documentation & Knowledge Transfer',
          'Capstone: End-to-End Cloud Migration for a Real Client',
        ],
      },
    ],
  },

  'fde-fwd:ml engineer': {
    trackKey: 'fde-fwd-ml-engineer',
    mainProgramId: 'fde-fwd',
    mainProgramName: 'Forward Deployed Engineer (FDE-FWD)',
    badge: 'FDE-ML',
    title: 'Forward Deployed ML Engineer',
    subtitle: 'Deploy, Monitor & Scale ML Models in Production',
    description:
      'Bridge the gap between data science and engineering. Master model deployment, MLOps, monitoring and A/B testing. Ship ML systems that drive real business ROI for clients.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Hybrid / Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'ML Engineer',
    techStack: ['Python', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'MLflow', 'Kubeflow', 'Seldon', 'Prometheus', 'AWS SageMaker'],
    highlights: [
      { title: 'Model Deployment', desc: 'Deploy ML models as APIs with Docker, Kubernetes and Seldon. Serve predictions at scale with autoscaling and canary releases.' },
      { title: 'ML Lifecycle Management', desc: 'Master MLflow, Kubeflow and Airflow for experiment tracking, model registries and automated training pipelines.' },
      { title: 'Monitoring & A/B Testing', desc: 'Detect data drift, model degradation and performance issues in real time. Run A/B tests to prove business impact.' },
      { title: 'Client ML Solutions', desc: 'Deploy ML systems for real clients. From problem framing to production — the forward-deployed ML engineer model.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: ML & Engineering Foundations',
        title: 'Phase 1: ML & Engineering Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'Python for ML Engineering',
          'Machine Learning Fundamentals (Supervised & Unsupervised)',
          'Docker & Containerization Basics',
          'Git, Linux & Engineering Workflows',
          'Math for ML (Linear Algebra, Calculus Refresher)',
        ],
      },
      {
        phase: 'Phase 2: Model Lifecycle',
        title: 'Phase 2: Model Lifecycle',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'MLflow for Experiment Tracking & Model Registry',
          'Model Packaging & Serialization',
          'Feature Stores & Feature Engineering',
          'Model Evaluation & Validation Strategies',
          'DVC for Data & Model Versioning',
          'TensorFlow & PyTorch Production Patterns',
        ],
      },
      {
        phase: 'Phase 3: Production MLOps',
        title: 'Phase 3: Production MLOps',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Kubeflow & ML Pipeline Orchestration',
          'Airflow for ML Workflow Automation',
          'Seldon Core & KServe for Model Serving',
          'Data Drift & Model Degradation Detection',
          'A/B Testing for ML Models',
          'Automated Retraining & CI/CD for ML',
        ],
      },
      {
        phase: 'Phase 4: Capstone: Client ML Platform',
        title: 'Phase 4: Capstone: Client ML Platform',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'Live Client ML Deployment Engagement',
          'Production Model Serving & Scaling',
          'ML Monitoring, Alerting & Incident Response',
          'Handover, Documentation & Knowledge Transfer',
          'Capstone: End-to-End ML Platform for a Real Client',
        ],
      },
    ],
  },

  'fde-fwd:security engineer': {
    trackKey: 'fde-fwd-security-engineer',
    mainProgramId: 'fde-fwd',
    mainProgramName: 'Forward Deployed Engineer (FDE-FWD)',
    badge: 'FDE-SEC',
    title: 'Forward Deployed Security Engineer',
    subtitle: 'Secure Deployments with Zero-Trust, Cloud Security & DevSecOps',
    description:
      'Become the engineer who embeds security into every deployment. Master zero-trust architecture, cloud security, threat modeling and DevSecOps. Protect real client systems from day one.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Hybrid / Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Security Engineer',
    techStack: ['OWASP', 'Pen Testing', 'Cloud Security', 'Zero-Trust', 'DevSecOps', 'Kubernetes Security', 'IAM', 'Vault', 'Falco', 'Trivy'],
    highlights: [
      { title: 'Cloud Security', desc: 'Master IAM, network security, encryption and compliance across AWS, GCP and Azure. Defense-in-depth for production systems.' },
      { title: 'DevSecOps', desc: 'Embed security into CI/CD pipelines — SAST, DAST, container scanning and IaC security. Shift-left without slowing down.' },
      { title: 'Zero-Trust Architecture', desc: 'Design zero-trust networks, implement mTLS and master identity-based security for modern distributed systems.' },
      { title: 'Client Security Audits', desc: 'Conduct security audits and threat modeling for real client deployments. Find vulnerabilities before attackers do.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Security Foundations',
        title: 'Phase 1: Security Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'Linux Security & System Hardening',
          'Networking & TCP/IP Security Fundamentals',
          'Cryptography & PKI Essentials',
          'OWASP Top 10 Deep Dive',
          'Threat Modeling & Risk Assessment',
        ],
      },
      {
        phase: 'Phase 2: Cloud & App Security',
        title: 'Phase 2: Cloud & App Security',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Identity & Access Management (AWS IAM, Azure AD)',
          'VPC Security, Firewalls & WAF',
          'Kubernetes Security & Network Policies',
          'Application Security & Secure Coding',
          'Penetration Testing Methodology & Labs',
          'Security Code Review & Remediation',
        ],
      },
      {
        phase: 'Phase 3: DevSecOps & Zero-Trust',
        title: 'Phase 3: DevSecOps & Zero-Trust',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'CI/CD Security Scanning (SAST, DAST, SCA)',
          'Container Security (Trivy, Falco, Image Scanning)',
          'Zero-Trust Architecture & mTLS',
          'HashiCorp Vault & Secrets Management',
          'IaC Security (Terraform scanning, policy-as-code)',
          'Compliance Automation (SOC 2, ISO 27001)',
        ],
      },
      {
        phase: 'Phase 4: Capstone: Client Security Audit',
        title: 'Phase 4: Capstone: Client Security Audit',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'Live Client Security Assessment',
          'Vulnerability Remediation & Hardening',
          'DevSecOps Pipeline Setup & Handover',
          'Documentation, Reporting & Knowledge Transfer',
          'Capstone: End-to-End Security Audit for a Real Client',
        ],
      },
    ],
  },

  // ==========================================
  // 2. FULLSTACK DEVELOPMENT ENGINEERING (FDE)
  // ==========================================
  'fde:software engineer': {
    trackKey: 'fse-software-engineer',
    mainProgramId: 'fde',
    mainProgramName: 'Fullstack Development Engineering (FDE)',
    badge: 'FSE-SWE',
    title: 'Full Stack Software Engineer',
    subtitle: 'Master end-to-end web development from frontend UI to backend APIs',
    description:
      'Build complete web applications with modern frontend frameworks, robust backend services, and production-ready deployment pipelines. 24-week intensive program designed for aspiring fullstack developers.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Software Engineer',
    techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'Prisma', 'Express.js', 'Tailwind CSS'],
    highlights: [
      { title: 'Frontend Mastery', desc: 'Build responsive, accessible, and performant user interfaces with React, TypeScript, and Next.js. Master component architecture, state management, and modern CSS.' },
      { title: 'Backend Development', desc: 'Design and build scalable server-side applications with Node.js and Express. Learn API design, middleware patterns, error handling, and microservices architecture.' },
      { title: 'Database Design', desc: 'Master relational and NoSQL databases. Design efficient schemas, write optimized queries, handle migrations, and implement data caching strategies.' },
      { title: 'Production Deployment', desc: 'Deploy applications with Docker, configure CI/CD pipelines, set up cloud infrastructure on AWS, and implement monitoring for reliable production systems.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Foundations',
        title: 'Phase 1: Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'HTML5, CSS3 & Modern JavaScript (ES6+)',
          'Git Version Control & GitHub Collaboration',
          'React Fundamentals & Component Architecture',
          'REST API Design & HTTP Protocols',
          'Responsive Design & Tailwind CSS',
        ],
      },
      {
        phase: 'Phase 2: Frontend Mastery',
        title: 'Phase 2: Frontend Mastery',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Advanced React Patterns (Hooks, Context, Portals)',
          'TypeScript for Frontend Development',
          'Next.js App Router & Server Components',
          'State Management (Zustand, TanStack Query)',
          'Responsive Design & Accessibility (a11y)',
          'Performance Optimization & Code Splitting',
        ],
      },
      {
        phase: 'Phase 3: Backend & Databases',
        title: 'Phase 3: Backend & Databases',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Node.js Event Loop & Streams',
          'Express.js REST API Development',
          'PostgreSQL & Prisma ORM',
          'Authentication & Authorization (JWT, OAuth 2.0)',
          'GraphQL API Development',
          'Testing: Unit, Integration & E2E (Jest, Cypress)',
        ],
      },
      {
        phase: 'Phase 4: Cloud & Deployment',
        title: 'Phase 4: Cloud & Deployment',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'Docker Containerization & Compose',
          'AWS Core Services (EC2, S3, RDS, CloudFront)',
          'CI/CD Pipelines with GitHub Actions',
          'Application Monitoring & Logging (Datadog, Sentry)',
          'Capstone: Full-Stack Application Deployment',
        ],
      },
    ],
  },

  'fde:ai engineer': {
    trackKey: 'fse-ai-engineer',
    mainProgramId: 'fde',
    mainProgramName: 'Fullstack Development Engineering (FDE)',
    badge: 'FSE-AIE',
    title: 'Full Stack AI Engineer',
    subtitle: 'Build full-stack applications powered by AI, LLMs, and intelligent automation',
    description:
      'Combine fullstack development expertise with cutting-edge AI capabilities. Build production applications with LLM integration, RAG pipelines, and AI-powered features. 24-week program.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'AI Engineer',
    techStack: ['React', 'Node.js', 'Python', 'FastAPI', 'LangChain', 'OpenAI', 'Pinecone', 'PostgreSQL', 'Docker', 'AWS'],
    highlights: [
      { title: 'AI-Powered Apps', desc: 'Build intelligent web applications that leverage AI for content generation, personalization, natural language understanding, and smart automation.' },
      { title: 'LLM Integration', desc: 'Master integration of large language models into fullstack applications. Handle streaming responses, function calling, and context management.' },
      { title: 'RAG Pipelines', desc: 'Design and implement Retrieval-Augmented Generation systems that connect LLMs to your data. Build knowledge bases that actually know your business.' },
      { title: 'Production AI Systems', desc: 'Deploy AI features to production with proper monitoring, cost optimization, rate limiting, and fallback strategies for reliable user experiences.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Fullstack Foundations',
        title: 'Phase 1: Fullstack Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'React Fundamentals & Modern JavaScript',
          'Node.js & Express.js Backend Development',
          'Python for AI/ML & FastAPI Basics',
          'REST & GraphQL API Design',
          'Database Design (PostgreSQL & NoSQL)',
        ],
      },
      {
        phase: 'Phase 2: AI/ML Core',
        title: 'Phase 2: AI/ML Core',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Machine Learning Fundamentals & scikit-learn',
          'Large Language Models (GPT, Claude, Gemini)',
          'Prompt Engineering & Chain-of-Thought',
          'LangChain Framework & LLM Chains',
          'Vector Databases (Pinecone, ChromaDB, Weaviate)',
          'Embeddings & Semantic Search',
        ],
      },
      {
        phase: 'Phase 3: Fullstack AI Apps',
        title: 'Phase 3: Fullstack AI Apps',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Building AI Agents with Tool Use & Function Calling',
          'RAG Systems: Document Ingestion & Retrieval',
          'Multi-modal AI (Vision, Audio, Text)',
          'Real-time AI Features (Streaming, WebSocket)',
          'AI UI/UX: Loading States, Streaming Text, Chat Interfaces',
          'Memory Systems & Conversation Management',
        ],
      },
      {
        phase: 'Phase 4: Production AI',
        title: 'Phase 4: Production AI',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'MLOps: Model Versioning & Experiment Tracking',
          'Model Deployment & API Serving',
          'AI Application Monitoring & Cost Optimization',
          'Security: Prompt Injection, Rate Limiting, Guardrails',
          'Capstone: Production AI Application',
        ],
      },
    ],
  },

  'fde:product engineer': {
    trackKey: 'fse-product-engineer',
    mainProgramId: 'fde',
    mainProgramName: 'Fullstack Development Engineering (FDE)',
    badge: 'FSE-PE',
    title: 'Full Stack Product Engineer',
    subtitle: 'Build and ship product features end-to-end, from ideation to production',
    description:
      'Learn to own product features from concept to deployment. Master frontend, backend, databases, and the product thinking skills needed to build features users love. 24-week program.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Product Engineer',
    techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Mixpanel', 'Amplitude', 'Tailwind CSS', 'Figma', 'AWS', 'GitHub Actions'],
    highlights: [
      { title: 'Product Thinking', desc: 'Learn to think like a product manager. Understand user needs, define requirements, prioritize features, and make data-driven decisions that ship impactful products.' },
      { title: 'Fullstack Execution', desc: 'Build complete features across the entire stack. From pixel-perfect UI components to robust APIs and database schemas, own every layer of the feature.' },
      { title: 'User-Centric Design', desc: 'Design interfaces that users love. Master UX principles, user research methods, A/B testing, and iterative design to create delightful product experiences.' },
      { title: 'Data-Driven Development', desc: 'Use analytics and metrics to guide product decisions. Implement tracking, build dashboards, run experiments, and measure the real impact of every feature you ship.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Foundations',
        title: 'Phase 1: Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'HTML5, CSS3 & Modern JavaScript (ES6+)',
          'React Fundamentals & Component Architecture',
          'Product Thinking & User Story Writing',
          'Git Version Control & GitHub Collaboration',
          'Responsive Design & Tailwind CSS',
        ],
      },
      {
        phase: 'Phase 2: Frontend & UX',
        title: 'Phase 2: Frontend & UX',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Advanced React Patterns (Hooks, Context, Portals)',
          'UX Principles & User Research Methods',
          'A/B Testing & Experimentation Frameworks',
          'Product Analytics with Mixpanel & Amplitude',
          'Responsive Design & Accessibility (a11y)',
          'Performance Optimization & Core Web Vitals',
        ],
      },
      {
        phase: 'Phase 3: Backend & Data',
        title: 'Phase 3: Backend & Data',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Node.js & Express.js API Development',
          'PostgreSQL & Prisma ORM',
          'REST API Design & Authentication (JWT)',
          'Feature Flags & Progressive Rollouts',
          'Performance Optimization & Caching Strategies',
          'Testing: Unit, Integration & E2E',
        ],
      },
      {
        phase: 'Phase 4: Product Engineering',
        title: 'Phase 4: Product Engineering',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'CI/CD Pipelines with GitHub Actions',
          'Product Analytics Dashboards & Data Visualization',
          'Launch Strategy & Go-to-Market Execution',
          'Capstone: End-to-End Product Feature Launch',
        ],
      },
    ],
  },

  'fde:saas engineer': {
    trackKey: 'fse-saas-engineer',
    mainProgramId: 'fde',
    mainProgramName: 'Fullstack Development Engineering (FDE)',
    badge: 'FSE-SSE',
    title: 'Full Stack SaaS Engineer',
    subtitle: 'Build scalable multi-tenant SaaS platforms from the ground up',
    description:
      'Master the architecture and development of multi-tenant SaaS applications. Learn subscription management, tenant isolation, scalable infrastructure, and SaaS business fundamentals. 24-week program.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'SaaS Engineer',
    techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Docker', 'AWS', 'Datadog', 'Tailwind CSS'],
    highlights: [
      { title: 'Multi-tenant Architecture', desc: 'Design and implement multi-tenant data models with proper tenant isolation. Learn shared-database, shared-schema, and database-per-tenant strategies for SaaS applications.' },
      { title: 'Subscription Systems', desc: 'Build subscription billing with Stripe, handle plan upgrades/downgrades, manage trials, and implement usage-based pricing models that power SaaS revenue.' },
      { title: 'Scalable Infrastructure', desc: 'Architect SaaS platforms that scale. Master horizontal scaling, load balancing, caching with Redis, and database optimization for thousands of concurrent tenants.' },
      { title: 'SaaS Business Logic', desc: 'Understand SaaS business fundamentals including metrics (MRR, churn, LTV), pricing strategies, customer onboarding flows, and the technical patterns behind successful SaaS products.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: SaaS Foundations',
        title: 'Phase 1: SaaS Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'React Fundamentals & Modern JavaScript',
          'Node.js & Express.js Backend Development',
          'SaaS Business Models & Concepts',
          'Multi-tenancy Basics & Data Isolation',
          'Authentication & Authorization (JWT, OAuth 2.0)',
        ],
      },
      {
        phase: 'Phase 2: Core SaaS',
        title: 'Phase 2: Core SaaS',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Database Design for Multi-Tenant Apps',
          'Subscription Billing with Stripe Integration',
          'Tenant Isolation Strategies & Middleware',
          'REST API Design & Versioning',
          'Role-Based Access Control (RBAC)',
          'Invitation & Team Management Systems',
        ],
      },
      {
        phase: 'Phase 3: Advanced SaaS',
        title: 'Phase 3: Advanced SaaS',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Admin Dashboards & Tenant Management',
          'SaaS Analytics & Tenant-Level Reporting',
          'Email Systems (Transactional & Marketing)',
          'Webhooks & Third-Party Integrations',
          'Rate Limiting & API Throttling',
          'Caching with Redis for Multi-Tenant Performance',
        ],
      },
      {
        phase: 'Phase 4: SaaS Production',
        title: 'Phase 4: SaaS Production',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'CI/CD Pipelines for Multi-Tenant Deployments',
          'Application Monitoring & Alerting (Datadog)',
          'Horizontal Scaling & Load Balancing',
          'Security: Data Encryption, Compliance, Audit Logs',
          'Capstone: Multi-Tenant SaaS Platform',
        ],
      },
    ],
  },

  'fde:cloud engineer': {
    trackKey: 'fse-cloud-engineer',
    mainProgramId: 'fde',
    mainProgramName: 'Fullstack Development Engineering (FDE)',
    badge: 'FSE-CE',
    title: 'Full Stack Cloud Engineer',
    subtitle: 'Build and deploy fullstack applications with deep cloud infrastructure expertise',
    description:
      'Combine fullstack development with cloud architecture skills. Build applications and deploy them on AWS/GCP with Kubernetes, serverless, and infrastructure as code. 24-week program.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Cloud Engineer',
    techStack: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Lambda', 'PostgreSQL', 'Prometheus', 'ArgoCD'],
    highlights: [
      { title: 'Cloud Architecture', desc: 'Learn to design and architect applications for the cloud. Master AWS and GCP services, understand regions, availability zones, VPCs, and build systems that are inherently scalable and fault-tolerant.' },
      { title: 'Serverless Development', desc: 'Build event-driven, serverless applications using AWS Lambda, API Gateway, and DynamoDB. Eliminate server management, reduce costs, and achieve automatic scaling for any workload.' },
      { title: 'Container Orchestration', desc: 'Master Docker and Kubernetes to containerize applications and orchestrate deployments at scale. Learn Helm charts, service meshes, and production-grade container management.' },
      { title: 'Fullstack + DevOps', desc: 'Bridge the gap between development and operations. Build CI/CD pipelines, implement infrastructure as code with Terraform, and automate everything from testing to deployment.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Fullstack Foundations',
        title: 'Phase 1: Fullstack Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'React Fundamentals & Modern JavaScript (ES6+)',
          'Node.js & Express.js Server-Side Development',
          'Linux Fundamentals & Command Line Proficiency',
          'Networking Concepts: TCP/IP, DNS, HTTP/HTTPS',
          'Cloud Computing Basics & Service Models (IaaS, PaaS, SaaS)',
        ],
      },
      {
        phase: 'Phase 2: Cloud Services',
        title: 'Phase 2: Cloud Services',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'AWS Core Services: EC2, S3, RDS, IAM',
          'Serverless Computing with AWS Lambda',
          'API Gateway & DynamoDB for Serverless Apps',
          'Cloud Storage Solutions & Content Delivery (CloudFront)',
          'Identity & Access Management with AWS IAM',
          'Cloud-Native Database Design & Optimization',
        ],
      },
      {
        phase: 'Phase 3: Container & Kubernetes',
        title: 'Phase 3: Container & Kubernetes',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'Docker Fundamentals: Images, Containers, Volumes',
          'Kubernetes Architecture: Pods, Services, Deployments',
          'Helm Charts & Kubernetes Package Management',
          'Service Mesh with Istio & Envoy Proxy',
          'Infrastructure as Code with Terraform',
          'Cloud Security & Network Policies',
        ],
      },
      {
        phase: 'Phase 4: Cloud-Native Apps',
        title: 'Phase 4: Cloud-Native Apps',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'CI/CD Pipelines with GitHub Actions & ArgoCD',
          'Cloud Monitoring with Prometheus & Grafana',
          'Multi-Cloud Strategies: AWS, GCP & Azure',
          'Cost Optimization & FinOps Best Practices',
          'Capstone: Deploy a Fullstack App on Kubernetes',
        ],
      },
    ],
  },

  'fde:enterprise engineer': {
    trackKey: 'fse-enterprise-engineer',
    mainProgramId: 'fde',
    mainProgramName: 'Fullstack Development Engineering (FDE)',
    badge: 'FSE-EE',
    title: 'Full Stack Enterprise Engineer',
    subtitle: 'Architect and build large-scale enterprise applications with complex integrations',
    description:
      'Master enterprise-grade fullstack development. Build applications that handle millions of users, complex business logic, legacy integrations, and strict compliance requirements. 24-week program.',
    duration: '24 Weeks',
    weeks: 24,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Enterprise Engineer',
    techStack: ['React', 'Node.js', 'Java', 'PostgreSQL', 'Kafka', 'Redis', 'Docker', 'AWS', 'GraphQL', 'Kubernetes'],
    highlights: [
      { title: 'Enterprise Architecture', desc: 'Learn to architect large-scale applications with microservices, event-driven patterns, and distributed systems. Design systems that handle millions of requests and complex business workflows.' },
      { title: 'Legacy Integration', desc: 'Master the art of integrating modern web applications with legacy systems, SOAP APIs, mainframes, and on-premise databases. Build bridges between old and new technology stacks.' },
      { title: 'Security & Compliance', desc: 'Implement enterprise-grade security with RBAC, audit logging, encryption, and compliance frameworks like SOC2 and GDPR. Build applications that meet the strictest regulatory requirements.' },
      { title: 'Scalable Systems', desc: 'Design and build applications that scale horizontally and vertically. Master caching strategies, database sharding, message queues, and performance optimization for enterprise workloads.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Enterprise Foundations',
        title: 'Phase 1: Enterprise Foundations',
        weeks: 'Weeks 1–4',
        duration: 'Weeks 1–4',
        topics: [
          'Java/Node.js for Enterprise Applications',
          'Enterprise Design Patterns & SOLID Principles',
          'SQL Mastery & Complex Query Optimization',
          'REST API & GraphQL for Enterprise Services',
          'Security Fundamentals & Threat Modeling',
        ],
      },
      {
        phase: 'Phase 2: Enterprise Backend',
        title: 'Phase 2: Enterprise Backend',
        weeks: 'Weeks 5–10',
        duration: 'Weeks 5–10',
        topics: [
          'Microservices Architecture & Domain-Driven Design',
          'Message Queues with Kafka & RabbitMQ',
          'Event-Driven Architecture & CQRS Patterns',
          'Caching Strategies with Redis & Memcached',
          'Database Sharding & Replication Strategies',
          'API Gateway & Service Mesh Architecture',
        ],
      },
      {
        phase: 'Phase 3: Enterprise Frontend',
        title: 'Phase 3: Enterprise Frontend',
        weeks: 'Weeks 11–18',
        duration: 'Weeks 11–18',
        topics: [
          'React for Enterprise: Design Systems & Component Libraries',
          'Role-Based Access Control (RBAC) Implementation',
          'Audit Logging & Compliance Tracking in UI',
          'Internationalization (i18n) & Localization',
          'Enterprise State Management with Complex Workflows',
          'Accessibility Compliance (WCAG 2.1) for Enterprise',
        ],
      },
      {
        phase: 'Phase 4: Enterprise Production',
        title: 'Phase 4: Enterprise Production',
        weeks: 'Weeks 19–24',
        duration: 'Weeks 19–24',
        topics: [
          'CI/CD Pipelines & Blue-Green Deployments',
          'Application Monitoring & Distributed Tracing',
          'Compliance Frameworks: SOC2, GDPR, HIPAA',
          'Performance Engineering & Load Testing',
          'Capstone: Enterprise-Grade Application Launch',
        ],
      },
    ],
  },

  // ==========================================
  // 3. DIGITAL SALES & AI MARKETING (DSAI)
  // ==========================================
  'dsai:digital sales & ai marketing specialist': {
    trackKey: 'dsai-digital-sales-specialist',
    mainProgramId: 'dsai',
    mainProgramName: 'Digital Sales & AI Marketing / AI Engineering (DSAI)',
    badge: 'DSAI-DS',
    title: 'Digital Sales & AI Marketing Specialist',
    subtitle: 'Master digital sales strategies and AI-powered marketing to drive revenue',
    description:
      'Combine digital sales expertise with AI marketing tools. Learn to generate leads, automate campaigns, and close deals using cutting-edge AI technology. 20-week intensive program.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Digital Sales & AI Marketing Specialist',
    techStack: ['ChatGPT', 'HubSpot', 'Meta Ads', 'Google Ads', 'LinkedIn Sales Nav', 'Google Analytics 4', 'Zapier', 'Mailchimp', 'Canva AI'],
    highlights: [
      { title: 'Digital Sales Mastery', desc: 'Master the complete digital sales cycle from prospecting to closing. Learn social selling, email outreach, CRM workflows, and consultative sales techniques adapted for the digital-first era.' },
      { title: 'AI Marketing Tools', desc: 'Get hands-on with ChatGPT, AI copywriting tools, predictive analytics, and automated campaign platforms. Learn to leverage AI for personalized messaging, audience segmentation, and content creation at scale.' },
      { title: 'Lead Generation', desc: 'Build high-converting lead generation engines using inbound strategies, paid ads, SEO, and AI-powered chatbots. Learn to create multi-channel lead funnels that consistently fill your pipeline.' },
      { title: 'Revenue Analytics', desc: 'Track every rupee of marketing spend to revenue. Master dashboards, attribution models, cohort analysis, and AI-driven forecasting to optimize campaigns and maximize return on investment.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Foundations',
        title: 'Phase 1: Foundations',
        weeks: 'Weeks 1–3',
        duration: 'Weeks 1–3',
        topics: [
          'Digital Marketing Landscape & Sales Funnel Fundamentals',
          'AI in Sales & Marketing: Concepts, Tools & Ethics',
          'Customer Psychology & Buyer Journey Mapping',
          'CRM Basics: HubSpot Setup, Contact Management & Pipelines',
          'Content Marketing Foundations & SEO Principles',
        ],
      },
      {
        phase: 'Phase 2: Digital Sales',
        title: 'Phase 2: Digital Sales',
        weeks: 'Weeks 4–8',
        duration: 'Weeks 4–8',
        topics: [
          'Social Selling: LinkedIn Strategy & Personal Branding',
          'Cold Outreach Mastery: Email Sequences & AI Personalization',
          'Sales Pitching, Objection Handling & Closing Techniques',
          'Meta Ads & Google Ads: Campaign Setup & Optimization',
          'Lead Scoring Models & Qualification Frameworks',
          'Sales Analytics: Conversion Tracking & Pipeline Metrics',
        ],
      },
      {
        phase: 'Phase 3: AI Marketing',
        title: 'Phase 3: AI Marketing',
        weeks: 'Weeks 9–15',
        duration: 'Weeks 9–15',
        topics: [
          'ChatGPT & AI Copywriting for Marketing Campaigns',
          'Marketing Automation: Email Drip Campaigns & Workflows',
          'AI-Powered Audience Segmentation & Predictive Analytics',
          'A/B Testing, CRO & Data-Driven Campaign Optimization',
          'Content at Scale: AI Blog Writing, Social Media & Video Scripts',
          'Attribution Modeling & Multi-Touch Revenue Analysis',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 16–20',
        duration: 'Weeks 16–20',
        topics: [
          'Integrated Digital Sales & AI Marketing Strategy',
          'Building a Full Sales & Marketing Dashboard with Real Data',
          'AI Chatbot Integration for Lead Qualification & Nurture',
          'Capstone: End-to-End Digital Sales Campaign with AI Tools',
        ],
      },
    ],
  },

  'dsai:ai marketing automation & growth': {
    trackKey: 'dsai-ai-ma-growth-specialist',
    mainProgramId: 'dsai',
    mainProgramName: 'Digital Sales & AI Marketing / AI Engineering (DSAI)',
    badge: 'DSAI-MAG',
    title: 'AI Marketing Automation & Growth Specialist',
    subtitle: 'Automate marketing at scale using AI for explosive business growth',
    description:
      'Master AI-powered marketing automation, growth hacking techniques, and data-driven strategies. Build automated funnels, AI content systems, and growth engines for modern businesses. 20-week program.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'AI Marketing Automation & Growth',
    techStack: ['Zapier', 'Make (Integromat)', 'ChatGPT', 'HubSpot', 'Webflow', 'Google Analytics 4', 'Jasper AI', 'Python', 'Airtable'],
    highlights: [
      { title: 'Marketing Automation', desc: 'Build sophisticated multi-channel automation workflows using Zapier, Make, and custom integrations. Learn to trigger personalized emails, SMS, push notifications, and retargeting ads based on user behavior and lifecycle stages.' },
      { title: 'AI Content Generation', desc: 'Harness ChatGPT, Jasper, and custom AI pipelines to produce blog posts, social media content, ad copy, and video scripts at scale. Learn prompt engineering, brand voice calibration, and quality control for AI-generated content.' },
      { title: 'Growth Hacking', desc: 'Master viral loops, referral engines, product-led growth tactics, and creative acquisition strategies. Learn to run rapid experiments, optimize conversion funnels, and find unconventional channels that drive explosive user growth.' },
      { title: 'Data-Driven Decisions', desc: 'Use analytics platforms, cohort analysis, and predictive models to guide every marketing decision. Build dashboards that track real-time KPIs, measure LTV, CAC, and churn, and use AI to forecast growth trajectories.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Marketing Foundations',
        title: 'Phase 1: Marketing Foundations',
        weeks: 'Weeks 1–3',
        duration: 'Weeks 1–3',
        topics: [
          'Modern Marketing Stack: Tools, Channels & Customer Lifecycle',
          'Growth Marketing Mindset: Metrics, Experiments & North Star Framework',
          'AI Fundamentals for Marketing: NLP, Predictive Models & Personalization',
          'Automation Basics: Triggers, Actions, Conditions & Webhooks',
          'Analytics Setup: Google Analytics 4, UTM Tracking & Event Architecture',
        ],
      },
      {
        phase: 'Phase 2: Automation Tools',
        title: 'Phase 2: Automation Tools',
        weeks: 'Weeks 4–8',
        duration: 'Weeks 4–8',
        topics: [
          'Zapier Deep Dive: Multi-Step Zaps, Filters, Formatters & Paths',
          'Make (Integromat): Advanced Scenarios, Routers & Error Handling',
          'Email Automation: Drip Campaigns, Behavioral Triggers & Segmentation',
          'HubSpot Marketing Hub: Workflows, Lists & Lead Scoring',
          'CRM & Marketing Alignment: Sales-Marketing SLAs & Handoff Automation',
          'No-Code Landing Page Builders: Webflow, Carrd & Conversion Optimization',
        ],
      },
      {
        phase: 'Phase 3: AI Growth Strategies',
        title: 'Phase 3: AI Growth Strategies',
        weeks: 'Weeks 9–15',
        duration: 'Weeks 9–15',
        topics: [
          'ChatGPT Prompt Engineering for Marketing Content at Scale',
          'AI-Powered SEO: Content Clusters, Keyword Research & Automated Optimization',
          'Growth Hacking Playbook: Viral Loops, Referral Programs & Product-Led Growth',
          'Paid Ads AI Optimization: Smart Bidding, Creative Testing & Budget Allocation',
          'Predictive Analytics: Churn Prediction, LTV Modeling & Cohort Analysis',
          'Building AI Content Pipelines: Blog, Social, Email & Ad Copy Automation',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 16–20',
        duration: 'Weeks 16–20',
        topics: [
          'Designing a Full Marketing Automation Architecture for a Real Business',
          'Building an AI-Powered Growth Dashboard with Live Metrics & Predictions',
          'End-to-End Campaign: Strategy, Automation Setup, AI Content & Analytics',
          'Capstone: Launch a Growth Engine with Measurable Revenue Impact',
        ],
      },
    ],
  },

  'dsai:marketing solutions & automation engineer': {
    trackKey: 'dsai-marketing-automation-engineer',
    mainProgramId: 'dsai',
    mainProgramName: 'Digital Sales & AI Marketing / AI Engineering (DSAI)',
    badge: 'DSAI-MAE',
    title: 'AI Marketing Solutions & Automation Engineer',
    subtitle: 'Build AI-powered marketing solutions and automation systems for enterprises',
    description:
      'Engineer end-to-end AI marketing solutions. Build chatbots, recommendation engines, automated campaign systems, and AI-driven customer journey platforms. 20-week program.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Marketing Solutions & Automation Engineer',
    techStack: ['Python', 'Dialogflow', 'LangChain', 'TensorFlow', 'PostgreSQL', 'Redis', 'Node.js', 'FastAPI', 'Docker'],
    highlights: [
      { title: 'AI Solution Architecture', desc: 'Design scalable AI marketing architectures combining NLP, recommendation systems, and predictive models that power enterprise-grade marketing platforms.' },
      { title: 'Marketing Engineering', desc: 'Bridge the gap between marketing strategy and engineering. Build robust data pipelines, campaign engines, and real-time personalization systems at scale.' },
      { title: 'Chatbot Development', desc: 'Create intelligent conversational interfaces using Dialogflow, LangChain, and custom NLP models that handle customer queries, lead qualification, and support automation.' },
      { title: 'Campaign Automation', desc: 'Engineer automated marketing workflows that trigger based on user behavior, segment audiences with ML, and optimize campaign performance using reinforcement learning.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: AI Foundations',
        title: 'Phase 1: AI Foundations',
        weeks: 'Weeks 1–3',
        duration: 'Weeks 1–3',
        topics: [
          'Python for AI & Marketing Automation',
          'Machine Learning Fundamentals & Data Pipelines',
          'Natural Language Processing Basics',
          'Marketing Technology Landscape & Integrations',
          'Prompt Engineering for Marketing Use Cases',
        ],
      },
      {
        phase: 'Phase 2: Marketing Engineering',
        title: 'Phase 2: Marketing Engineering',
        weeks: 'Weeks 4–8',
        duration: 'Weeks 4–8',
        topics: [
          'Customer Data Platforms & Segment Analysis',
          'TensorFlow & scikit-learn for Marketing ML',
          'Email & Push Notification Automation Engines',
          'A/B Testing Frameworks & Experimentation',
          'API Integrations: CRM, Analytics, Ad Platforms',
          'Building Real-Time Recommendation Systems',
        ],
      },
      {
        phase: 'Phase 3: Solution Development',
        title: 'Phase 3: Solution Development',
        weeks: 'Weeks 9–15',
        duration: 'Weeks 9–15',
        topics: [
          'Dialogflow Chatbot Design & Deployment',
          'LangChain for Marketing Conversational AI',
          'Marketing Attribution & Predictive Analytics',
          'Node.js Microservices for Marketing Platforms',
          'PostgreSQL & Redis for Campaign Data',
          'CI/CD for AI Marketing Solutions',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 16–20',
        duration: 'Weeks 16–20',
        topics: [
          'Enterprise AI Marketing Platform Architecture',
          'Scalability, Monitoring & Performance Tuning',
          'Capstone: Full AI Marketing Automation Suite',
        ],
      },
    ],
  },

  'dsai:ai sales, marketing & agents engineer': {
    trackKey: 'dsai-sales-marketing-agents',
    mainProgramId: 'dsai',
    mainProgramName: 'Digital Sales & AI Marketing / AI Engineering (DSAI)',
    badge: 'DSAI-SMA',
    title: 'AI Sales, Marketing & Agents Engineer',
    subtitle: 'Build autonomous AI agents for sales outreach, marketing, and customer engagement',
    description:
      'Design and deploy AI agents that automate sales outreach, marketing campaigns, and customer conversations. Master LangChain, agent architectures, and multi-agent systems. 20-week program.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'AI Sales, Marketing & Agents Engineer',
    techStack: ['Python', 'LangChain', 'CrewAI', 'OpenAI API', 'Pinecone', 'FastAPI', 'Redis', 'Docker', 'PostgreSQL'],
    highlights: [
      { title: 'AI Agent Development', desc: 'Master the full lifecycle of building autonomous AI agents — from designing tool-calling capabilities and memory systems to deploying agents that reason, plan, and execute tasks independently.' },
      { title: 'Sales Automation', desc: 'Build AI agents that automate lead qualification, personalized outreach sequences, CRM updates, and follow-ups — reducing manual sales work by 70% while improving conversion rates.' },
      { title: 'Conversational AI', desc: 'Design sophisticated conversational agents that handle multi-turn dialogs, understand intent and context, and deliver human-quality interactions across chat, email, and voice channels.' },
      { title: 'Multi-Agent Systems', desc: 'Architect systems of collaborating AI agents that specialize and coordinate — a research agent, a writer agent, and an outreach agent working together to execute complex marketing campaigns.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Agent Fundamentals',
        title: 'Phase 1: Agent Fundamentals',
        weeks: 'Weeks 1–3',
        duration: 'Weeks 1–3',
        topics: [
          'Python for AI Agent Development',
          'LLM Fundamentals & Prompt Engineering',
          'LangChain Core: Chains, Memory & Tools',
          'Agent Design Patterns & Architectures',
          'Vector Databases & RAG Fundamentals',
        ],
      },
      {
        phase: 'Phase 2: Sales & Marketing Agents',
        title: 'Phase 2: Sales & Marketing Agents',
        weeks: 'Weeks 4–8',
        duration: 'Weeks 4–8',
        topics: [
          'Building Lead Qualification Agents',
          'OpenAI API: Function Calling & Structured Output',
          'Email & Outreach Automation with AI',
          'Pinecone for Semantic Search & Lead Matching',
          'CRM Integration & Data Synchronization',
          'A/B Testing AI-Generated Sales Copy',
        ],
      },
      {
        phase: 'Phase 3: Advanced Agent Systems',
        title: 'Phase 3: Advanced Agent Systems',
        weeks: 'Weeks 9–15',
        duration: 'Weeks 9–15',
        topics: [
          'Multi-Agent Orchestration & CrewAI',
          'FastAPI for Agent Endpoint Deployment',
          'Redis for Agent State & Session Management',
          'Agent Evaluation, Monitoring & Guardrails',
          'Voice Agents & Telephony Integration',
          'Scaling Agents with Async & Queue Systems',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 16–20',
        duration: 'Weeks 16–20',
        topics: [
          'Enterprise Agent Platform Architecture',
          'Security, Compliance & Rate Limiting',
          'Capstone: Multi-Agent Sales & Marketing System',
        ],
      },
    ],
  },

  'dsai:ai revenue & growth engineer': {
    trackKey: 'dsai-revenue-growth-engineer',
    mainProgramId: 'dsai',
    mainProgramName: 'Digital Sales & AI Marketing / AI Engineering (DSAI)',
    badge: 'DSAI-RGE',
    title: 'AI Revenue & Growth Engineer',
    subtitle: 'Engineer AI systems that automate revenue operations and drive scalable growth',
    description:
      'Build AI-powered revenue engines, pricing optimization systems, churn prediction models, and automated growth pipelines. Master the intersection of engineering, sales, marketing, and AI. 20-week program.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'AI Revenue & Growth Engineer',
    techStack: ['Python', 'SQL', 'TensorFlow', 'Apache Airflow', 'Tableau', 'Stripe API', 'Pandas', 'FastAPI', 'PostgreSQL'],
    highlights: [
      { title: 'Revenue Engineering', desc: 'Design AI systems that track, predict, and maximize revenue across every customer touchpoint. Build real-time revenue dashboards, MRR/ARR forecasting models, and automated alerting for revenue anomalies.' },
      { title: 'AI Pricing Systems', desc: 'Build dynamic pricing engines that use ML to optimize prices in real time based on demand elasticity, competitor data, customer segments, and willingness-to-pay signals.' },
      { title: 'Churn Prediction', desc: 'Develop ML models that identify at-risk customers before they leave. Implement proactive retention workflows, segment-based risk scoring, and automated intervention triggers.' },
      { title: 'Growth Pipelines', desc: 'Engineer automated growth loops using AI-driven experimentation, lifecycle marketing automation, expansion revenue playbooks, and data-driven activation sequences.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Revenue Foundations',
        title: 'Phase 1: Revenue Foundations',
        weeks: 'Weeks 1–3',
        duration: 'Weeks 1–3',
        topics: [
          'Revenue Operations & SaaS Metrics Deep Dive',
          'SQL for Revenue Analytics & Cohort Analysis',
          'Python for Data Analysis: Pandas & NumPy Fundamentals',
          'Revenue Dashboarding with Tableau & Data Viz Best Practices',
          'Business Mathematics: LTV, CAC, Payback Period & Unit Economics',
        ],
      },
      {
        phase: 'Phase 2: AI Revenue Systems',
        title: 'Phase 2: AI Revenue Systems',
        weeks: 'Weeks 4–8',
        duration: 'Weeks 4–8',
        topics: [
          'Machine Learning Fundamentals for Business Applications',
          'Churn Prediction: Logistic Regression & Random Forests',
          'Dynamic Pricing with TensorFlow & Reinforcement Learning',
          'Revenue Forecasting with Time Series Models (ARIMA, Prophet)',
          'A/B Testing & Causal Inference for Growth Experiments',
          'Building Revenue APIs with Stripe & Payment Gateway Integration',
        ],
      },
      {
        phase: 'Phase 3: Growth Engineering',
        title: 'Phase 3: Growth Engineering',
        weeks: 'Weeks 9–15',
        duration: 'Weeks 9–15',
        topics: [
          'Growth Loops & Viral Coefficient Engineering',
          'Customer Segmentation with Clustering Algorithms',
          'Automated Email & Lifecycle Marketing Pipelines',
          'Expansion Revenue: Upsell & Cross-sell ML Models',
          'Orchestration with Apache Airflow for Revenue Workflows',
          'Real-time Revenue Monitoring & Anomaly Detection Systems',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 16–20',
        duration: 'Weeks 16–20',
        topics: [
          'End-to-End AI Revenue Engine Deployment',
          'Production ML Pipelines with Monitoring & Retraining',
          'Stakeholder Presentations & Revenue Impact Measurement',
          'Capstone: Build a Complete AI Revenue & Growth Platform',
        ],
      },
    ],
  },

  'dsai:ai customer solutions & automation': {
    trackKey: 'dsai-customer-solutions-engineer',
    mainProgramId: 'dsai',
    mainProgramName: 'Digital Sales & AI Marketing / AI Engineering (DSAI)',
    badge: 'DSAI-CSE',
    title: 'AI Customer Solutions & Automation Engineer',
    subtitle: 'Build AI-powered customer service solutions and automation platforms',
    description:
      'Design and deploy AI customer service platforms, intelligent ticketing systems, sentiment analysis tools, and automated support workflows. Transform how businesses serve their customers. 20-week program.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'AI Customer Solutions & Automation',
    techStack: ['Python', 'Dialogflow', 'PostgreSQL', 'Redis', 'Zendesk API', 'Freshdesk API', 'React', 'FastAPI', 'Docker'],
    highlights: [
      { title: 'Customer AI Platforms', desc: 'Build end-to-end AI customer service platforms with chatbot integration, omnichannel support, knowledge base management, and intelligent routing that handle thousands of concurrent conversations.' },
      { title: 'Sentiment Analysis', desc: 'Develop NLP-powered sentiment analysis systems that classify customer interactions in real time, detect frustration signals, and trigger proactive escalation before issues escalate.' },
      { title: 'Automated Support', desc: 'Engineer automated support workflows using LLMs, decision trees, and RAG pipelines that resolve 60-80% of customer queries without human intervention while maintaining quality.' },
      { title: 'Solution Design', desc: 'Master enterprise customer solution architecture. Design systems that integrate with CRM, ticketing, and communication platforms to create seamless support experiences at scale.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Customer Service Foundations',
        title: 'Phase 1: Customer Service Foundations',
        weeks: 'Weeks 1–3',
        duration: 'Weeks 1–3',
        topics: [
          'Customer Service Operations & Support Metrics (CSAT, NPS, CES)',
          'Python Fundamentals for Support Automation Scripts',
          'Database Design for Ticketing & Customer Data with PostgreSQL',
          'REST APIs & Webhook Integration Patterns',
          'Introduction to NLP & Text Processing with Python',
        ],
      },
      {
        phase: 'Phase 2: AI Customer Solutions',
        title: 'Phase 2: AI Customer Solutions',
        weeks: 'Weeks 4–8',
        duration: 'Weeks 4–8',
        topics: [
          'Building Conversational AI with Dialogflow & LLM Integration',
          'Sentiment Analysis: NLP Models for Customer Emotion Detection',
          'RAG Pipelines for Knowledge Base-Powered Support Bots',
          'Zendesk & Freshdesk API Integration for Ticket Orchestration',
          'Redis Caching for Real-time Customer Context Management',
          'Intent Classification & Entity Extraction for Automated Triage',
        ],
      },
      {
        phase: 'Phase 3: Enterprise Implementation',
        title: 'Phase 3: Enterprise Implementation',
        weeks: 'Weeks 9–15',
        duration: 'Weeks 9–15',
        topics: [
          'Omnichannel Support Platform Architecture',
          'AI Agent Routing & Escalation Engine Design',
          'Customer Health Scoring & Predictive Support Models',
          'React Dashboard for Support Team Performance Analytics',
          'Real-time Notifications, Queues & Event-Driven Architecture',
          'Security, Privacy & Compliance in Customer Data Handling',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 16–20',
        duration: 'Weeks 16–20',
        topics: [
          'Production Deployment of AI Customer Support Platform',
          'Load Testing, Monitoring & Performance Optimization',
          'Stakeholder Demo & Solution Architecture Documentation',
          'Capstone: Build an Enterprise AI Customer Solutions Platform',
        ],
      },
    ],
  },

  // ==========================================
  // 4. CLOUD, DEVOPS & MLOPS (CDM) — 6 specializations
  // ==========================================
  'cdm:cloud infrastructure': {
    trackKey: 'cdm-cloud-infrastructure-engineer',
    mainProgramId: 'cdm',
    mainProgramName: 'Cloud, DevOps & MLOps (CDM)',
    badge: 'CDM-CIE',
    title: 'Cloud Infrastructure Engineer',
    subtitle: 'Architect Cloud-Native Systems on AWS, Azure & GCP',
    description:
      'Become the engineer who designs and operates cloud infrastructure at scale. Master AWS, Azure & GCP, infrastructure-as-code, networking, security and cost optimization. Build systems that scale to millions of users without breaking the budget.',
    duration: '22 Weeks',
    weeks: 22,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Cloud Infrastructure Engineer',
    techStack: ['AWS', 'Azure', 'GCP', 'Terraform', 'CloudFormation', 'VPC', 'IAM', 'Load Balancers', 'Auto Scaling', 'CloudWatch'],
    highlights: [
      { title: 'Multi-Cloud Architecture', desc: 'Design and deploy across AWS, Azure and GCP — pick the right tool for each workload and avoid vendor lock-in.' },
      { title: 'Infrastructure as Code', desc: 'Master Terraform and CloudFormation to provision repeatable, version-controlled infrastructure in minutes, not days.' },
      { title: 'Cloud Networking & Security', desc: 'Build secure VPCs, manage IAM roles, configure firewalls and encryption — defense-in-depth for production systems.' },
      { title: 'Cost Optimization', desc: 'Learn FinOps practices to right-size resources, use reserved instances and cut cloud bills by 40-60% without sacrificing performance.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Cloud Foundations',
        title: 'Phase 1: Cloud Foundations',
        weeks: 'Weeks 1–5',
        duration: 'Weeks 1–5',
        topics: [
          'Linux & Shell Scripting for Cloud',
          'Networking Fundamentals (TCP/IP, DNS, HTTP)',
          'AWS Core Services (EC2, S3, RDS, VPC)',
          'Azure & GCP Fundamentals',
          'Cloud Security & IAM Basics',
        ],
      },
      {
        phase: 'Phase 2: Infrastructure as Code',
        title: 'Phase 2: Infrastructure as Code',
        weeks: 'Weeks 6–11',
        duration: 'Weeks 6–11',
        topics: [
          'Terraform — from zero to production',
          'AWS CloudFormation & CDK',
          'VPC Design, Subnets & Routing',
          'Load Balancers & Auto Scaling Groups',
          'Route53, CDN & Edge Computing',
        ],
      },
      {
        phase: 'Phase 3: Advanced Cloud Engineering',
        title: 'Phase 3: Advanced Cloud Engineering',
        weeks: 'Weeks 12–18',
        duration: 'Weeks 12–18',
        topics: [
          'Multi-Cloud & Hybrid Architectures',
          'Cloud Security Deep Dive (WAF, GuardDuty, KMS)',
          'Cost Optimization & FinOps',
          'Disaster Recovery & Backup Strategies',
          'Serverless (Lambda, Azure Functions, Cloud Run)',
        ],
      },
      {
        phase: 'Phase 4: Capstone & Deployment',
        title: 'Phase 4: Capstone & Deployment',
        weeks: 'Weeks 19–22',
        duration: 'Weeks 19–22',
        topics: [
          'Capstone: Build a Multi-Region Highly-Available Infrastructure',
          'IaC for the entire stack — Terraform modules',
          'Security Audit & Cost Optimization Report',
          'Production Deployment & Handover',
        ],
      },
    ],
  },
  'cdm:devops': {
    trackKey: 'cdm-devops-engineer',
    mainProgramId: 'cdm',
    mainProgramName: 'Cloud, DevOps & MLOps (CDM)',
    badge: 'CDM-DOE',
    title: 'DevOps Engineer',
    subtitle: 'Automate the Build-Test-Deploy Lifecycle',
    description:
      'Become the engineer who ships 10x faster. Master CI/CD pipelines, configuration management, containerization and release automation. Break down silos between dev and ops to deliver software continuously, safely and reliably.',
    duration: '22 Weeks',
    weeks: 22,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'DevOps Engineer',
    techStack: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Docker', 'Ansible', 'Terraform', 'Prometheus', 'Grafana', 'Nexus', 'SonarQube'],
    highlights: [
      { title: 'CI/CD Pipeline Mastery', desc: 'Build end-to-end pipelines with Jenkins, GitLab CI and GitHub Actions — from commit to production in minutes, with automated tests and security scans.' },
      { title: 'Configuration Management', desc: 'Master Ansible, Chef and Puppet to manage hundreds of servers declaratively. No more SSH-and-pray — just code.' },
      { title: 'Containerization', desc: 'Dockerize any application, build multi-stage images and manage registries. Containers are the universal shipping unit of modern software.' },
      { title: 'Release Automation', desc: 'Implement blue-green, canary and rolling deployments. Ship safely with automated rollbacks and zero-downtime releases.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: DevOps Foundations',
        title: 'Phase 1: DevOps Foundations',
        weeks: 'Weeks 1–5',
        duration: 'Weeks 1–5',
        topics: [
          'DevOps Culture & Principles',
          'Linux Administration & Bash Scripting',
          'Git — Branching, Merge Strategies & PR Workflows',
          'Docker — Images, Containers & Compose',
          'Package Management & Artifact Repositories',
        ],
      },
      {
        phase: 'Phase 2: CI/CD Pipelines',
        title: 'Phase 2: CI/CD Pipelines',
        weeks: 'Weeks 6–11',
        duration: 'Weeks 6–11',
        topics: [
          'Jenkins — Pipelines, Jobs & Plugins',
          'GitLab CI & GitHub Actions',
          'Automated Testing in Pipelines',
          'Code Quality with SonarQube & ESLint',
          'Artifact Management with Nexus',
        ],
      },
      {
        phase: 'Phase 3: Configuration & Release',
        title: 'Phase 3: Configuration & Release',
        weeks: 'Weeks 12–18',
        duration: 'Weeks 12–18',
        topics: [
          'Ansible — Playbooks, Roles & Modules',
          'Terraform for Infrastructure',
          'Blue-Green, Canary & Rolling Deployments',
          'Feature Flags & Progressive Delivery',
          'Rollback Strategies & Incident Response',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 19–22',
        duration: 'Weeks 19–22',
        topics: [
          'Capstone: Build a Full CI/CD Pipeline for a Microservices App',
          'Automated Tests, Security Scans & Quality Gates',
          'Zero-Downtime Production Deployment',
          'Monitoring, Alerts & Post-Release Review',
        ],
      },
    ],
  },
  'cdm:mlops': {
    trackKey: 'cdm-mlops-engineer',
    mainProgramId: 'cdm',
    mainProgramName: 'Cloud, DevOps & MLOps (CDM)',
    badge: 'CDM-MLE',
    title: 'MLOps Engineer',
    subtitle: 'Deploy, Monitor & Scale ML Models in Production',
    description:
      'Bridge the gap between data science and engineering. Master the tools and practices to take ML models from notebooks to production — versioning, deployment, monitoring and retraining. Become the engineer who makes AI reliable at scale.',
    duration: '22 Weeks',
    weeks: 22,
    mode: 'Online Interactive',
    level: 'Intermediate',
    specialization: 'MLOps Engineer',
    techStack: ['Python', 'MLflow', 'Kubeflow', 'Kubernetes', 'Docker', 'Airflow', 'BentoML', 'Seldon', 'Evidently', 'Prometheus'],
    highlights: [
      { title: 'Model Versioning & Registry', desc: 'Track every model version, dataset and experiment with MLflow and DVC. Reproducibility is not optional — it is the foundation.' },
      { title: 'Model Deployment', desc: 'Deploy models as APIs with BentoML, Seldon Core and KServe. Serve predictions at scale with autoscaling and canary releases.' },
      { title: 'ML Pipelines', desc: 'Build automated training pipelines with Kubeflow and Airflow — from data ingestion to retraining, on schedule.' },
      { title: 'Monitoring & Drift Detection', desc: 'Detect data drift, concept drift and model degradation in real time with Evidently and Prometheus. Retrain before accuracy drops.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: ML & DevOps Foundations',
        title: 'Phase 1: ML & DevOps Foundations',
        weeks: 'Weeks 1–5',
        duration: 'Weeks 1–5',
        topics: [
          'Python for ML & Data Science',
          'Machine Learning Fundamentals',
          'Docker & Containerization for ML',
          'Git & CI/CD Basics',
          'Linux & Shell Scripting',
        ],
      },
      {
        phase: 'Phase 2: Model Lifecycle',
        title: 'Phase 2: Model Lifecycle',
        weeks: 'Weeks 6–11',
        duration: 'Weeks 6–11',
        topics: [
          'MLflow — Experiment Tracking & Model Registry',
          'DVC — Data Version Control',
          'Model Packaging with BentoML',
          'Feature Stores & Data Pipelines',
          'Model Evaluation & Validation',
        ],
      },
      {
        phase: 'Phase 3: Production MLOps',
        title: 'Phase 3: Production MLOps',
        weeks: 'Weeks 12–18',
        duration: 'Weeks 12–18',
        topics: [
          'Kubeflow — End-to-End ML Pipelines',
          'Airflow for Orchestration',
          'Seldon Core & KServe for Model Serving',
          'Data Drift & Model Monitoring with Evidently',
          'Automated Retraining Strategies',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 19–22',
        duration: 'Weeks 19–22',
        topics: [
          'Capstone: Build an End-to-End MLOps Platform',
          'Automated Training Pipeline & Model Registry',
          'Production Model Serving with Canary Releases',
          'Monitoring Dashboard & Drift Alerts',
        ],
      },
    ],
  },
  'cdm:sre': {
    trackKey: 'cdm-sre-engineer',
    mainProgramId: 'cdm',
    mainProgramName: 'Cloud, DevOps & MLOps (CDM)',
    badge: 'CDM-SRE',
    title: 'Site Reliability Engineer',
    subtitle: 'Keep Critical Systems Running at 99.99% Uptime',
    description:
      'Become the engineer who keeps the lights on. Master observability, incident response, chaos engineering and SLO/SLI design. Build systems that self-heal and teams that learn from every incident.',
    duration: '22 Weeks',
    weeks: 22,
    mode: 'Online Interactive',
    level: 'Intermediate to Advanced',
    specialization: 'Site Reliability Engineer',
    techStack: ['Prometheus', 'Grafana', 'Datadog', 'PagerDuty', 'ELK Stack', 'Jaeger', 'Kubernetes', 'Terraform', 'Ansible', 'Python'],
    highlights: [
      { title: 'Observability Stack', desc: 'Build metrics, logs and traces with Prometheus, Grafana, ELK and Jaeger. See inside your systems — know about issues before users do.' },
      { title: 'Incident Response', desc: 'Master on-call rotations, incident command, postmortems and blameless retrospectives. Turn every outage into a learning opportunity.' },
      { title: 'SLOs & Error Budgets', desc: 'Define Service Level Objectives, track error budgets and make data-driven decisions about when to ship vs. when to stabilize.' },
      { title: 'Chaos Engineering', desc: 'Run controlled experiments with Chaos Mesh and Gremlin to find weaknesses before they cause outages. Resilience is built, not hoped for.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: SRE Foundations',
        title: 'Phase 1: SRE Foundations',
        weeks: 'Weeks 1–5',
        duration: 'Weeks 1–5',
        topics: [
          'SRE Principles & Culture',
          'Linux & System Administration',
          'Networking & TCP/IP Deep Dive',
          'Python for Automation & Scripting',
          'Cloud Fundamentals (AWS/GCP)',
        ],
      },
      {
        phase: 'Phase 2: Observability',
        title: 'Phase 2: Observability',
        weeks: 'Weeks 6–11',
        duration: 'Weeks 6–11',
        topics: [
          'Prometheus — Metrics & Alerting',
          'Grafana — Dashboards & Visualization',
          'ELK Stack — Centralized Logging',
          'Jaeger — Distributed Tracing',
          'Datadog & APM Tools',
        ],
      },
      {
        phase: 'Phase 3: Reliability Engineering',
        title: 'Phase 3: Reliability Engineering',
        weeks: 'Weeks 12–18',
        duration: 'Weeks 12–18',
        topics: [
          'SLOs, SLIs & Error Budgets',
          'Incident Response & On-Call',
          'Postmortems & Blameless Retrospectives',
          'Chaos Engineering with Chaos Mesh',
          'Capacity Planning & Autoscaling',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 19–22',
        duration: 'Weeks 19–22',
        topics: [
          'Capstone: Build a Full Observability Stack',
          'SLO Design & Error Budget Tracking',
          'Chaos Experiment & Incident Response Drill',
          'Production Readiness Review',
        ],
      },
    ],
  },
  'cdm:kubernetes': {
    trackKey: 'cdm-kubernetes-engineer',
    mainProgramId: 'cdm',
    mainProgramName: 'Cloud, DevOps & MLOps (CDM)',
    badge: 'CDM-K8S',
    title: 'Kubernetes & Container Engineer',
    subtitle: 'Orchestrate Containers at Enterprise Scale',
    description:
      'Master Kubernetes — the operating system of the cloud. From clusters to service mesh, learn to deploy, scale and manage containerized applications at enterprise scale. Build self-healing, auto-scaling platforms that run themselves.',
    duration: '22 Weeks',
    weeks: 22,
    mode: 'Online Interactive',
    level: 'Intermediate',
    specialization: 'Kubernetes & Container Engineer',
    techStack: ['Kubernetes', 'Docker', 'Helm', 'Istio', 'ArgoCD', 'Kustomize', 'Cilium', 'Prometheus', 'etcd', 'containerd'],
    highlights: [
      { title: 'Cluster Architecture', desc: 'Design, provision and manage Kubernetes clusters — from kubeadm to managed services (EKS, GKE, AKS). Understand control plane, worker nodes and etcd.' },
      { title: 'Workload Management', desc: 'Deploy Deployments, StatefulSets, DaemonSets, Jobs and CronJobs. Master pods, services, ingress and config — the building blocks of K8s apps.' },
      { title: 'GitOps & ArgoCD', desc: 'Implement GitOps with ArgoCD — declarative deployments where Git is the single source of truth. Roll back with a PR, not a panic.' },
      { title: 'Service Mesh & Security', desc: 'Master Istio for traffic management, mTLS and observability. Secure clusters with RBAC, network policies and Pod Security Standards.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Container & K8s Foundations',
        title: 'Phase 1: Container & K8s Foundations',
        weeks: 'Weeks 1–5',
        duration: 'Weeks 1–5',
        topics: [
          'Docker Deep Dive — Images, Multi-stage, Security',
          'containerd & OCI Runtimes',
          'Kubernetes Architecture — Control Plane & Worker Nodes',
          'Pods, Deployments, Services & Ingress',
          'ConfigMaps, Secrets & Volumes',
        ],
      },
      {
        phase: 'Phase 2: Cluster Operations',
        title: 'Phase 2: Cluster Operations',
        weeks: 'Weeks 6–11',
        duration: 'Weeks 6–11',
        topics: [
          'Cluster Provisioning (kubeadm, EKS, GKE, AKS)',
          'Helm — Package Management & Charts',
          'Kustomize for Environment Management',
          'RBAC, Network Policies & Pod Security',
          'Storage — CSI, PVCs, Storage Classes',
        ],
      },
      {
        phase: 'Phase 3: Advanced K8s',
        title: 'Phase 3: Advanced K8s',
        weeks: 'Weeks 12–18',
        duration: 'Weeks 12–18',
        topics: [
          'GitOps with ArgoCD',
          'Service Mesh with Istio',
          'Autoscaling — HPA, VPA & Cluster Autoscaler',
          'Multi-Cluster & Federation',
          'K8s Observability with Prometheus & Grafana',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 19–22',
        duration: 'Weeks 19–22',
        topics: [
          'Capstone: Build a Multi-Service K8s Platform',
          'GitOps Deployment Pipeline with ArgoCD',
          'Service Mesh, mTLS & Traffic Splitting',
          'Production Hardening & Handover',
        ],
      },
    ],
  },
  'cdm:platform cicd': {
    trackKey: 'cdm-platform-cicd-engineer',
    mainProgramId: 'cdm',
    mainProgramName: 'Cloud, DevOps & MLOps (CDM)',
    badge: 'CDM-PCE',
    title: 'Platform & CI/CD Engineer',
    subtitle: 'Build Internal Developer Platforms That Teams Love',
    description:
      'Become the engineer who makes other engineers 10x more productive. Build internal developer platforms (IDPs), self-service pipelines and golden paths that let teams ship faster without sacrificing safety. Platform engineering is the future of DevOps.',
    duration: '22 Weeks',
    weeks: 22,
    mode: 'Online Interactive',
    level: 'Intermediate to Advanced',
    specialization: 'Platform & CI/CD Engineer',
    techStack: ['Backstage', 'ArgoCD', 'Crossplane', 'Terraform', 'Kubernetes', 'GitHub Actions', 'Jenkins', 'Helm', 'Vault', 'Port'],
    highlights: [
      { title: 'Internal Developer Platform', desc: 'Build IDPs with Backstage and Port — give developers a self-service portal to spin up environments, databases and pipelines in minutes.' },
      { title: 'Golden Path Pipelines', desc: 'Design opinionated CI/CD templates that encode best practices — security, testing and compliance built-in. Teams just plug in and ship.' },
      { title: 'Self-Service Infrastructure', desc: 'Use Crossplane and Terraform to let developers provision infrastructure via PRs — no tickets, no waiting, full governance.' },
      { title: 'Developer Experience', desc: 'Measure and improve DORA metrics, developer satisfaction and time-to-first-PR. A great platform is invisible — developers just work faster.' },
    ],
    curriculum: [
      {
        phase: 'Phase 1: Platform Thinking',
        title: 'Phase 1: Platform Thinking',
        weeks: 'Weeks 1–5',
        duration: 'Weeks 1–5',
        topics: [
          'Platform Engineering Principles',
          'DevEx & DORA Metrics',
          'Linux, Git & Docker Refresher',
          'Kubernetes Fundamentals',
          'CI/CD Basics with GitHub Actions',
        ],
      },
      {
        phase: 'Phase 2: IDP & Portals',
        title: 'Phase 2: IDP & Portals',
        weeks: 'Weeks 6–11',
        duration: 'Weeks 6–11',
        topics: [
          'Backstage — Developer Portal',
          'Port & Humanitec — Self-Service Platforms',
          'Service Catalog & Ownership',
          'Software Templates & Golden Paths',
          'Tech Docs & API References',
        ],
      },
      {
        phase: 'Phase 3: Platform Automation',
        title: 'Phase 3: Platform Automation',
        weeks: 'Weeks 12–18',
        duration: 'Weeks 12–18',
        topics: [
          'Crossplane — Infrastructure as K8s CRDs',
          'Terraform Modules & Registries',
          'ArgoCD — GitOps for the Platform',
          'Secret Management with Vault',
          'Policy as Code with OPA & Kyverno',
        ],
      },
      {
        phase: 'Phase 4: Capstone',
        title: 'Phase 4: Capstone',
        weeks: 'Weeks 19–22',
        duration: 'Weeks 19–22',
        topics: [
          'Capstone: Build an Internal Developer Platform',
          'Self-Service Portal with Backstage/Port',
          'Golden-Path CI/CD Templates',
          'DORA Metrics Dashboard & Platform Handover',
        ],
      },
    ],
  },

  // ==========================================
  // 5. GEN AI & AGENTIC AUTOMATION ENGINEER (GAA) — 6 specializations
  // ==========================================
  'gaa:llm application': {
    trackKey: 'gaa-llm-application-engineer',
    mainProgramId: 'gaa',
    mainProgramName: 'Gen AI & Agentic Automation Engineer (GAA)',
    badge: 'GAA-LLM',
    title: 'LLM Application Engineer',
    subtitle: 'Build Production Apps with LLMs, RAG & LangChain',
    description:
      'Become the engineer who builds production AI apps. Master LLMs, RAG pipelines, prompt engineering, function calling and LangChain. Ship AI features that real users interact with — not just notebooks.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'LLM Application Engineer',
    techStack: ['Python', 'LangChain', 'OpenAI API', 'RAG', 'Vector DBs', 'Pinecone', 'Chroma', 'FastAPI', 'Streamlit', 'Docker'],
    highlights: [
      { title: 'LLM Engineering', desc: 'Master prompt engineering, function calling, RAG pipelines and LangChain. Build AI features that work in production, not just demos.' },
      { title: 'RAG Systems', desc: 'Build retrieval-augmented generation pipelines with vector databases (Pinecone, Chroma), embeddings and semantic search.' },
      { title: 'Production Deployment', desc: 'Deploy LLM apps with FastAPI, Docker and monitoring. Master rate limiting, caching and cost optimization.' },
      { title: 'Fine-Tuning & Customization', desc: 'Fine-tune open-source LLMs (Llama, Mistral) for specific domains. Master LoRA, QLoRA and PEFT techniques.' },
    ],
    curriculum: [
      { phase: 'Phase 1: AI & Python Foundations', title: 'Phase 1: AI & Python Foundations', weeks: 'Weeks 1–4', duration: 'Weeks 1–4', topics: ['Python for AI', 'API fundamentals', 'OpenAI API & function calling', 'Prompt engineering basics', 'Git & collaboration'] },
      { phase: 'Phase 2: LLM & RAG', title: 'Phase 2: LLM & RAG', weeks: 'Weeks 5–10', duration: 'Weeks 5–10', topics: ['LangChain framework', 'RAG pipelines', 'Vector databases (Pinecone, Chroma)', 'Embeddings & semantic search', 'Conversational memory & chains'] },
      { phase: 'Phase 3: Production LLM Apps', title: 'Phase 3: Production LLM Apps', weeks: 'Weeks 11–16', duration: 'Weeks 11–16', topics: ['FastAPI for LLM serving', 'Fine-tuning (LoRA, QLoRA)', 'Monitoring & evaluation', 'Guardrails & safety', 'Cost optimization & caching'] },
      { phase: 'Phase 4: Capstone', title: 'Phase 4: Capstone', weeks: 'Weeks 17–20', duration: 'Weeks 17–20', topics: ['Capstone: Production RAG application', 'Fine-tuned domain LLM', 'Monitoring dashboard & guardrails', 'Deployment & handover'] },
    ],
  },
  'gaa:ai agents': {
    trackKey: 'gaa-ai-agents-engineer',
    mainProgramId: 'gaa',
    mainProgramName: 'Gen AI & Agentic Automation Engineer (GAA)',
    badge: 'GAA-AGE',
    title: 'AI Agents Engineer',
    subtitle: 'Build Autonomous AI Agents with CrewAI & AutoGen',
    description:
      'Become the engineer who builds autonomous AI agents. Master CrewAI, AutoGen, multi-agent systems and agentic workflows. Build agents that plan, reason, use tools and complete complex tasks end-to-end.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Intermediate',
    specialization: 'AI Agents Engineer',
    techStack: ['Python', 'CrewAI', 'AutoGen', 'LangGraph', 'OpenAI API', 'Function Calling', 'Tools', 'Vector DBs', 'Docker', 'FastAPI'],
    highlights: [
      { title: 'Multi-Agent Systems', desc: 'Build multi-agent systems with CrewAI and AutoGen. Agents that collaborate, delegate and solve complex tasks together.' },
      { title: 'Agentic Workflows', desc: 'Design agentic workflows with LangGraph — planning, reasoning, tool use, reflection and self-correction loops.' },
      { title: 'Tool Use & Function Calling', desc: 'Give agents tools — APIs, databases, code execution, web search. Build agents that use tools to accomplish real tasks.' },
      { title: 'Production Agents', desc: 'Deploy autonomous agents with monitoring, memory, guardrails and human-in-the-loop. Ship agents that are safe and reliable.' },
    ],
    curriculum: [
      { phase: 'Phase 1: AI & Agent Foundations', title: 'Phase 1: AI & Agent Foundations', weeks: 'Weeks 1–4', duration: 'Weeks 1–4', topics: ['Python for AI', 'LLM fundamentals', 'OpenAI API & function calling', 'Agent concepts & architectures', 'ReAct pattern'] },
      { phase: 'Phase 2: Agent Frameworks', title: 'Phase 2: Agent Frameworks', weeks: 'Weeks 5–10', duration: 'Weeks 5–10', topics: ['CrewAI — multi-agent orchestration', 'AutoGen — conversational agents', 'LangGraph — agentic workflows', 'Tool use & function calling', 'Memory & state management'] },
      { phase: 'Phase 3: Advanced Agents', title: 'Phase 3: Advanced Agents', weeks: 'Weeks 11–16', duration: 'Weeks 11–16', topics: ['Planning & reasoning strategies', 'Self-reflection & correction', 'Human-in-the-loop design', 'Guardrails & safety', 'Agent monitoring & observability'] },
      { phase: 'Phase 4: Capstone', title: 'Phase 4: Capstone', weeks: 'Weeks 17–20', duration: 'Weeks 17–20', topics: ['Capstone: Multi-agent system for real use case', 'Production deployment with monitoring', 'Safety guardrails & human oversight', 'Handover & documentation'] },
    ],
  },
  'gaa:generative ai': {
    trackKey: 'gaa-generative-ai-engineer',
    mainProgramId: 'gaa',
    mainProgramName: 'Gen AI & Agentic Automation Engineer (GAA)',
    badge: 'GAA-GEN',
    title: 'Generative AI Engineer',
    subtitle: 'Create with GPT, DALL-E, Stable Diffusion & Video Models',
    description:
      'Become the engineer who creates with generative AI. Master text, image, video and code generation. Build multimodal AI apps that generate content at scale — from marketing copy to product images.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Generative AI Engineer',
    techStack: ['Python', 'OpenAI API', 'DALL-E', 'Stable Diffusion', 'Midjourney API', 'FFmpeg', 'ComfyUI', 'Hugging Face', 'FastAPI', 'Docker'],
    highlights: [
      { title: 'Text Generation', desc: 'Master GPT, Claude and open-source LLMs for text generation — marketing copy, code, summaries, translations and more.' },
      { title: 'Image Generation', desc: 'Create images with DALL-E, Stable Diffusion and Midjourney. Master prompt engineering, ControlNet and custom models.' },
      { title: 'Video & Audio', desc: 'Generate video with Runway, Sora and FFmpeg. Create audio with TTS models. Build multimodal content pipelines.' },
      { title: 'Production GenAI', desc: 'Deploy GenAI apps with content moderation, quality scoring, batch processing and cost control. Ship at scale.' },
    ],
    curriculum: [
      { phase: 'Phase 1: GenAI Foundations', title: 'Phase 1: GenAI Foundations', weeks: 'Weeks 1–4', duration: 'Weeks 1–4', topics: ['Python for AI', 'OpenAI API (GPT, DALL-E)', 'Prompt engineering for generation', 'Hugging Face ecosystem', 'Git & collaboration'] },
      { phase: 'Phase 2: Image & Video Gen', title: 'Phase 2: Image & Video Gen', weeks: 'Weeks 5–10', duration: 'Weeks 5–10', topics: ['Stable Diffusion & ComfyUI', 'ControlNet & custom models', 'DALL-E 3 & Midjourney API', 'Video generation (Runway, Sora)', 'Audio generation (TTS, music)'] },
      { phase: 'Phase 3: Production GenAI', title: 'Phase 3: Production GenAI', weeks: 'Weeks 11–16', duration: 'Weeks 11–16', topics: ['Multimodal content pipelines', 'Content moderation & safety', 'Quality scoring & filtering', 'Batch processing & cost control', 'Fine-tuning custom models'] },
      { phase: 'Phase 4: Capstone', title: 'Phase 4: Capstone', weeks: 'Weeks 17–20', duration: 'Weeks 17–20', topics: ['Capstone: Multimodal content generation platform', 'Text + image + video pipeline', 'Content moderation & quality control', 'Deployment & handover'] },
    ],
  },
  'gaa:ai automation': {
    trackKey: 'gaa-ai-automation-engineer',
    mainProgramId: 'gaa',
    mainProgramName: 'Gen AI & Agentic Automation Engineer (GAA)',
    badge: 'GAA-AUT',
    title: 'AI Automation Engineer',
    subtitle: 'Automate Business Workflows with AI-Powered Agentic Pipelines',
    description:
      'Become the engineer who eliminates repetitive work. Master AI-powered workflow automation — connect tools, APIs and LLMs to automate business processes end-to-end. Ship automation that saves thousands of hours.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'AI Automation Engineer',
    techStack: ['Python', 'Zapier', 'Make.com', 'LangChain', 'OpenAI API', 'REST APIs', 'n8n', 'Airflow', 'Docker', 'FastAPI'],
    highlights: [
      { title: 'Workflow Automation', desc: 'Master Zapier, Make.com and n8n to connect 1000+ tools. Build no-code and low-code automation pipelines.' },
      { title: 'AI-Powered Automation', desc: 'Add AI to workflows — LLMs for text processing, classification, extraction and generation. Automate cognitive tasks, not just mechanical ones.' },
      { title: 'Custom Integrations', desc: 'Build custom API integrations with Python and FastAPI. Connect any tool, database or service into your automation pipeline.' },
      { title: 'Process Orchestration', desc: 'Orchestrate complex multi-step processes with Airflow. Handle errors, retries, monitoring and alerting at scale.' },
    ],
    curriculum: [
      { phase: 'Phase 1: Automation Foundations', title: 'Phase 1: Automation Foundations', weeks: 'Weeks 1–4', duration: 'Weeks 1–4', topics: ['Python for automation', 'REST APIs & webhooks', 'Zapier & Make.com basics', 'n8n open-source automation', 'Git & collaboration'] },
      { phase: 'Phase 2: AI-Powered Automation', title: 'Phase 2: AI-Powered Automation', weeks: 'Weeks 5–10', duration: 'Weeks 5–10', topics: ['LangChain for automation', 'LLM-powered text processing', 'Document extraction & classification', 'Email & chat automation', 'Custom API integrations with FastAPI'] },
      { phase: 'Phase 3: Advanced Automation', title: 'Phase 3: Advanced Automation', weeks: 'Weeks 11–16', duration: 'Weeks 11–16', topics: ['Airflow for orchestration', 'Error handling & retries', 'Monitoring & alerting', 'Process optimization & analytics', 'Security & compliance'] },
      { phase: 'Phase 4: Capstone', title: 'Phase 4: Capstone', weeks: 'Weeks 17–20', duration: 'Weeks 17–20', topics: ['Capstone: End-to-end business process automation', 'Multi-tool integration pipeline', 'Monitoring dashboard & analytics', 'Deployment & handover'] },
    ],
  },
  'gaa:conversational ai': {
    trackKey: 'gaa-conversational-ai-engineer',
    mainProgramId: 'gaa',
    mainProgramName: 'Gen AI & Agentic Automation Engineer (GAA)',
    badge: 'GAA-CON',
    title: 'Conversational AI Engineer',
    subtitle: 'Build Chatbots, Voice Assistants & Dialog Systems',
    description:
      'Become the engineer who builds conversational AI. Master chatbots, voice assistants and dialog systems. Use NLP, speech-to-text, text-to-speech and conversation design to create AI that truly understands and helps users.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Beginner to Advanced',
    specialization: 'Conversational AI Engineer',
    techStack: ['Python', 'LangChain', 'OpenAI API', 'Whisper', 'ElevenLabs', 'Rasa', 'Dialogflow', 'FastAPI', 'WebSockets', 'Docker'],
    highlights: [
      { title: 'Chatbot Engineering', desc: 'Build production chatbots with LangChain, Rasa and Dialogflow. Master intent detection, entity extraction and conversation flows.' },
      { title: 'Voice Assistants', desc: 'Build voice assistants with Whisper (speech-to-text) and ElevenLabs (text-to-speech). Create AI you can talk to.' },
      { title: 'Conversation Design', desc: 'Design natural, helpful conversations. Master dialogue management, context handling, personality and tone.' },
      { title: 'Production Conversational AI', desc: 'Deploy chatbots and voice assistants with WebSockets, monitoring and analytics. Ship AI that handles real user conversations.' },
    ],
    curriculum: [
      { phase: 'Phase 1: Conversational AI Foundations', title: 'Phase 1: Conversational AI Foundations', weeks: 'Weeks 1–4', duration: 'Weeks 1–4', topics: ['Python for AI', 'NLP fundamentals', 'OpenAI API for chat', 'Intent detection & entity extraction', 'Git & collaboration'] },
      { phase: 'Phase 2: Chatbot & Voice', title: 'Phase 2: Chatbot & Voice', weeks: 'Weeks 5–10', duration: 'Weeks 5–10', topics: ['LangChain for chatbots', 'Rasa — open-source chatbots', 'Whisper — speech-to-text', 'ElevenLabs — text-to-speech', 'Conversation design & dialogue management'] },
      { phase: 'Phase 3: Production Systems', title: 'Phase 3: Production Systems', weeks: 'Weeks 11–16', duration: 'Weeks 11–16', topics: ['WebSockets for real-time chat', 'Voice assistant integration', 'Context & memory management', 'Analytics & conversation metrics', 'Guardrails & safety'] },
      { phase: 'Phase 4: Capstone', title: 'Phase 4: Capstone', weeks: 'Weeks 17–20', duration: 'Weeks 17–20', topics: ['Capstone: Production voice assistant or chatbot', 'Real-time conversation with memory', 'Analytics dashboard & monitoring', 'Deployment & handover'] },
    ],
  },
  'gaa:ai product': {
    trackKey: 'gaa-ai-product-engineer',
    mainProgramId: 'gaa',
    mainProgramName: 'Gen AI & Agentic Automation Engineer (GAA)',
    badge: 'GAA-PRO',
    title: 'AI Product Engineer',
    subtitle: 'Build AI-First Products from Idea to Production',
    description:
      'Become the engineer who builds AI products. Master the full lifecycle — from AI product strategy and prototyping to production deployment and iteration. Build products where AI is the core, not a feature.',
    duration: '20 Weeks',
    weeks: 20,
    mode: 'Online Interactive',
    level: 'Intermediate',
    specialization: 'AI Product Engineer',
    techStack: ['Python', 'LangChain', 'OpenAI API', 'React', 'Next.js', 'FastAPI', 'Vector DBs', 'Docker', 'Postgres', 'AWS'],
    highlights: [
      { title: 'AI Product Strategy', desc: 'Learn to identify AI opportunities, scope AI products and define success metrics. Think like a PM, build like an engineer.' },
      { title: 'Rapid Prototyping', desc: 'Prototype AI features fast with Streamlit, Gradio and LangChain. Validate ideas before building production systems.' },
      { title: 'Full-Stack AI', desc: 'Build AI products end-to-end — React/Next.js frontend, FastAPI backend, LLM integration, vector DB and deployment.' },
      { title: 'AI Product Metrics', desc: 'Measure what matters — user engagement, AI quality, cost per query, hallucination rate. Iterate based on data.' },
    ],
    curriculum: [
      { phase: 'Phase 1: AI Product Foundations', title: 'Phase 1: AI Product Foundations', weeks: 'Weeks 1–4', duration: 'Weeks 1–4', topics: ['Python & API fundamentals', 'OpenAI API & LangChain', 'AI product strategy & ideation', 'Rapid prototyping with Streamlit', 'Git & collaboration'] },
      { phase: 'Phase 2: Full-Stack AI', title: 'Phase 2: Full-Stack AI', weeks: 'Weeks 5–10', duration: 'Weeks 5–10', topics: ['React & Next.js for AI apps', 'FastAPI backend for LLM serving', 'Vector DB integration (Pinecone)', 'Authentication & user management', 'AI feature design patterns'] },
      { phase: 'Phase 3: Production AI Products', title: 'Phase 3: Production AI Products', weeks: 'Weeks 11–16', duration: 'Weeks 11–16', topics: ['AI product metrics & analytics', 'A/B testing for AI features', 'Cost optimization & scaling', 'User feedback loops & iteration', 'Guardrails, safety & compliance'] },
      { phase: 'Phase 4: Capstone', title: 'Phase 4: Capstone', weeks: 'Weeks 17–20', duration: 'Weeks 17–20', topics: ['Capstone: AI-first product (idea to production)', 'Full-stack app with LLM integration', 'Analytics dashboard & metrics', 'Deployment, demo & handover'] },
    ],
  },
};

/**
 * Helper to resolve the exact program and subprogram track data.
 */
export function getProgramTrackData(
  mainProgramOrPreferred?: string | null,
  subProgramParam?: string | null
): ProgramTrackInfo | null {
  if (!mainProgramOrPreferred) return null;

  let mainProg = mainProgramOrPreferred.trim();
  let subProg = subProgramParam ? subProgramParam.trim() : '';

  // Handle strings like "Forward Deployed Engineer (FDE-FWD) — Data Engineer"
  if (mainProg.includes('—')) {
    const parts = mainProg.split('—').map((s) => s.trim());
    mainProg = parts[0];
    if (!subProg && parts[1]) {
      subProg = parts[1];
    }
  } else if (mainProg.includes(' - ')) {
    const parts = mainProg.split(' - ').map((s) => s.trim());
    mainProg = parts[0];
    if (!subProg && parts[1]) {
      subProg = parts[1];
    }
  }

  // Determine main program ID
  let mainProgId: 'fde-fwd' | 'fde' | 'dsai' | 'cdm' | 'gaa' = 'fde-fwd';
  const lowerMain = mainProg.toLowerCase();
  if (lowerMain.includes('fde-fwd') || lowerMain.includes('forward deployed')) {
    mainProgId = 'fde-fwd';
  } else if (lowerMain.includes('dsai') || lowerMain.includes('digital sales') || lowerMain.includes('sales & ai')) {
    mainProgId = 'dsai';
  } else if (lowerMain.includes('cdm') || lowerMain.includes('cloud, devops') || lowerMain.includes('cloud devops') || lowerMain.includes('mlops')) {
    mainProgId = 'cdm';
  } else if (lowerMain.includes('gaa') || lowerMain.includes('gen ai') || lowerMain.includes('agentic') || lowerMain.includes('generative ai')) {
    mainProgId = 'gaa';
  } else if (lowerMain.includes('fullstack') || lowerMain.includes('fse') || lowerMain.includes('fde')) {
    mainProgId = 'fde';
  }

  const lowerSub = (subProg || '').toLowerCase().trim();

  // Try exact composite key lookup
  const exactKey = `${mainProgId}:${lowerSub}`;
  if (PROGRAM_TRACKS[exactKey]) {
    return PROGRAM_TRACKS[exactKey];
  }

  // Fuzzy match on subprogram
  for (const [key, track] of Object.entries(PROGRAM_TRACKS)) {
    if (key.startsWith(`${mainProgId}:`)) {
      const trackSub = key.replace(`${mainProgId}:`, '');
      if (
        (lowerSub && trackSub.includes(lowerSub)) ||
        (lowerSub && lowerSub.includes(trackSub)) ||
        (track.specialization && track.specialization.toLowerCase() === lowerSub)
      ) {
        return track;
      }
    }
  }

  // Check any track matching subprogram name directly if main program match wasn't found
  if (lowerSub) {
    for (const track of Object.values(PROGRAM_TRACKS)) {
      if (
        track.specialization.toLowerCase() === lowerSub ||
        track.title.toLowerCase().includes(lowerSub) ||
        track.trackKey.toLowerCase().includes(lowerSub)
      ) {
        return track;
      }
    }
  }

  // Default fallback to the first track of that main program
  const defaultTrackForMain = Object.values(PROGRAM_TRACKS).find((t) => t.mainProgramId === mainProgId);
  return defaultTrackForMain || null;
}
