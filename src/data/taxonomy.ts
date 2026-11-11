export interface TaxonomyProduct {
  id: string;
  name: string;
}

export interface TaxonomyCategory {
  id: string;
  name: string;
  products?: TaxonomyProduct[];
}

export interface TaxonomySector {
  id: string;
  name: string;
  icon: string;
  categories: TaxonomyCategory[];
}

export interface TaxonomyEcosystem {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  categories: TaxonomySector[];
}

export const ecosystems: TaxonomyEcosystem[] = [
  {
    id: "tech-digital-ai",
    name: "Technology, Cloud & AI Ecosystem",
    tagline: "Software engineering, enterprise AI, cloud infrastructure & cybersecurity",
    icon: "Cpu",
    categories: [
      {
        id: "software-engineering",
        name: "Software & SaaS Engineering",
        icon: "Code2",
        categories: [
          {
            id: "enterprise-saas",
            name: "Enterprise SaaS Platforms",
            products: [
              { id: "p-erp", name: "Cloud ERP & Workflow Suites" },
              { id: "p-crm", name: "CRM & Revenue Intelligence" },
              { id: "p-hrms", name: "HRMS & Talent Platforms" },
            ],
          },
          {
            id: "web-mobile-apps",
            name: "Web & Mobile Application Development",
            products: [
              { id: "p-react", name: "Next.js & React Frontends" },
              { id: "p-mobile", name: "Cross-Platform Mobile Apps" },
            ],
          },
          {
            id: "api-microservices",
            name: "APIs, Microservices & Integrations",
            products: [
              { id: "p-gateway", name: "API Gateways & Event Mesh" },
              { id: "p-ipaas", name: "Enterprise iPaaS Connectors" },
            ],
          },
        ],
      },
      {
        id: "ai-data-platforms",
        name: "Generative AI, Data & Analytics",
        icon: "Brain",
        categories: [
          {
            id: "agentic-ai",
            name: "Agentic Automation & LLM Systems",
            products: [
              { id: "p-agents", name: "Autonomous Enterprise Agents" },
              { id: "p-rag", name: "Enterprise RAG Knowledge Engines" },
            ],
          },
          {
            id: "data-engineering",
            name: "Data Warehousing & BI",
            products: [
              { id: "p-lakehouse", name: "Cloud Data Lakehouses" },
              { id: "p-bi", name: "Real-Time Executive Dashboards" },
            ],
          },
        ],
      },
      {
        id: "cloud-cybersecurity",
        name: "Cloud Infrastructure & Cybersecurity",
        icon: "ShieldCheck",
        categories: [
          {
            id: "cloud-devops",
            name: "CloudOps, Kubernetes & MLOps",
            products: [
              { id: "p-k8s", name: "Managed Kubernetes Clusters" },
              { id: "p-cicd", name: "Zero-Downtime CI/CD Pipelines" },
            ],
          },
          {
            id: "infosec",
            name: "Zero-Trust Security & DPDP Compliance",
            products: [
              { id: "p-soc", name: "Managed SOC & Threat Detection" },
              { id: "p-iam", name: "Identity & Access Governance" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "industrial-manufacturing",
    name: "Industrial, Manufacturing & Supply Chain",
    tagline: "Smart factories, procurement, industrial automation & logistics",
    icon: "Factory",
    categories: [
      {
        id: "advanced-manufacturing",
        name: "Discrete & Process Manufacturing",
        icon: "Bot",
        categories: [
          {
            id: "industrial-automation",
            name: "Robotics & Factory Automation",
            products: [
              { id: "p-plc", name: "PLC / SCADA Control Systems" },
              { id: "p-cobot", name: "Collaborative Assembly Robots" },
            ],
          },
          {
            id: "automotive-ev",
            name: "Automotive & EV Components",
            products: [
              { id: "p-bms", name: "EV Battery Management Units" },
              { id: "p-cnc", name: "Precision CNC Machined Parts" },
            ],
          },
        ],
      },
      {
        id: "energy-infra",
        name: "Energy, Infrastructure & Construction",
        icon: "Zap",
        categories: [
          {
            id: "clean-energy",
            name: "Solar, Grid & Renewable Systems",
            products: [
              { id: "p-solar", name: "Utility-Scale Solar Inverters" },
              { id: "p-ess", name: "Commercial Energy Storage" },
            ],
          },
          {
            id: "logistics-warehousing",
            name: "Cold Chain & 3PL Logistics",
            products: [
              { id: "p-wms", name: "Automated Warehouse Fulfillment" },
              { id: "p-fleet", name: "Telematics & Fleet Tracking" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "talent-enterprise-services",
    name: "Talent, Consulting & Enterprise Services",
    tagline: "Workforce solutions, skilling academies, finance & healthcare services",
    icon: "Briefcase",
    categories: [
      {
        id: "workforce-hr",
        name: "Talent & Workforce Solutions",
        icon: "Briefcase",
        categories: [
          {
            id: "staffing-rpo",
            name: "IT Staffing, RPO & Executive Search",
            products: [
              { id: "p-tech-hire", name: "Forward-Deployed Engineering Teams" },
              { id: "p-bulk-hire", name: "Managed Volume Hiring Engine" },
            ],
          },
          {
            id: "corporate-training",
            name: "Enterprise L&D & Skilling Academies",
            products: [
              { id: "p-bootcamps", name: "Role-Ready AI & Cloud Cohorts" },
              { id: "p-assessments", name: "Skill Benchmarking Labs" },
            ],
          },
        ],
      },
      {
        id: "bfsi-health",
        name: "FinTech, Healthcare & B2B Advisory",
        icon: "Wallet",
        categories: [
          {
            id: "fintech-services",
            name: "Payments, Lending & Compliance Tech",
            products: [
              { id: "p-kyc", name: "Digital KYC & Risk Scoring" },
              { id: "p-payroll", name: "Cross-Border Payroll Rail" },
            ],
          },
          {
            id: "healthcare-systems",
            name: "Digital Health & Clinical Operations",
            products: [
              { id: "p-ehr", name: "Connected EHR & Diagnostics" },
              { id: "p-tele", name: "Enterprise Telehealth Platforms" },
            ],
          },
        ],
      },
    ],
  },
];
