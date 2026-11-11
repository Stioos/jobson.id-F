export const PROJECT_CATEGORIES: string[] = [
  "Web Application",
  "Mobile Application",
  "AI / Machine Learning",
  "Data Science & Analytics",
  "Cloud & DevOps Infrastructure",
  "Enterprise SaaS",
  "E-Commerce & Marketplace",
  "FinTech & Payments",
  "IoT / Embedded Systems",
  "API & Microservices",
  "UI/UX & Design System",
  "Open Source Library",
];

export const PROJECT_TYPES: string[] = [
  "Professional / Company Project",
  "Freelance / Client Project",
  "Personal / Side Project",
  "Open Source Contribution",
  "Academic / Capstone Project",
  "Hackathon / Competition",
  "Research & Development",
];

export const PROJECT_STATUSES: string[] = [
  "Completed",
  "In Progress",
  "Live / Production",
  "Prototype / MVP",
  "On Hold",
  "Archived",
];

export const STATUS_COLOR: Record<string, string> = {
  Completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "In Progress": "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "Live / Production": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  "Prototype / MVP": "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "On Hold": "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  Archived: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export const VISIBILITY_OPTIONS: string[] = [
  "Public",
  "Employers & Recruiters Only",
  "Connections Only",
  "Private",
];

export const VISIBILITY_COLOR: Record<string, string> = {
  Public: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "Employers & Recruiters Only": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  "Connections Only": "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Private: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
};

export const TEAM_OPTIONS: string[] = [
  "Individual Project",
  "Team Project",
  "Cross-Functional Team",
  "Open Source Community",
];

export const LINK_TYPES: string[] = [
  "Live Project URL",
  "GitHub Repository",
  "GitLab Repository",
  "Demo Video",
  "Case Study / Blog",
  "Presentation Deck",
  "Sandbox / Playground",
  "Other Link",
];

export const LINK_ICONS: Record<string, string> = {
  "Live Project URL": "ExternalLink",
  "GitHub Repository": "Github",
  "GitLab Repository": "Gitlab",
  "Demo Video": "Video",
  "Case Study / Blog": "FileText",
  "Presentation Deck": "Presentation",
  "Sandbox / Playground": "Box",
  "Other Link": "Link2",
};

export const ATTACHMENT_TYPES: string[] = [
  "Case Study PDF",
  "Architecture Diagram",
  "UI Screenshots",
  "Demo Video",
  "Slide Deck",
  "Whitepaper",
];

export interface TechGroup {
  label: string;
  items: string[];
}

export const TECH_GROUPS: TechGroup[] = [
  {
    label: "Programming Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "Go", "C#", "C++", "Rust", "SQL", "Kotlin", "Swift"],
  },
  {
    label: "Frameworks & Libraries",
    items: ["React", "Next.js", "Node.js", "Express", "NestJS", "FastAPI", "Django", "Spring Boot", "Tailwind CSS", "Angular", "Vue.js"],
  },
  {
    label: "AI & Machine Learning",
    items: ["OpenAI API", "LangChain", "LangGraph", "PyTorch", "TensorFlow", "Hugging Face", "RAG Pipelines", "Vector Databases"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "DynamoDB", "Snowflake", "Supabase", "Elasticsearch"],
  },
  {
    label: "Cloud Platforms",
    items: ["AWS", "Microsoft Azure", "Google Cloud (GCP)", "Vercel", "Cloudflare", "DigitalOcean"],
  },
  {
    label: "DevOps & Containers",
    items: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins", "Prometheus", "Grafana"],
  },
  {
    label: "Development Tools",
    items: ["Git", "VS Code", "Jira", "Linear", "Figma", "Postman", "Datadog", "Sentry"],
  },
  {
    label: "APIs & Integrations",
    items: ["REST API", "GraphQL", "gRPC", "WebSockets", "Kafka", "Stripe", "Razorpay", "OAuth 2.0 / OIDC"],
  },
  {
    label: "Testing & QA",
    items: ["Jest", "Vitest", "Playwright", "Cypress", "Pytest", "Selenium"],
  },
  {
    label: "Version Control Tools",
    items: ["Git", "GitHub", "GitLab", "Bitbucket", "Azure Repos"],
  },
  {
    label: "Architecture / Methodology",
    items: ["Microservices", "Event-Driven Architecture", "Serverless", "Monorepo", "Clean Architecture", "Domain-Driven Design", "Agile / Scrum"],
  },
];

export const ALL_TECH: string[] = Array.from(new Set(TECH_GROUPS.flatMap((g) => g.items)));

export const WORK_CATEGORIES: string[] = [
  "UI/UX Design",
  "Web & Product Engineering",
  "System Architecture",
  "Data Visualization & BI",
  "AI Agent & Automation",
  "Technical Writing & Case Studies",
  "Brand & Marketing Creatives",
];

export const AWARD_CATEGORIES: string[] = [
  "Engineering Excellence",
  "Innovation & Patent",
  "Hackathon Winner",
  "Leadership & Impact",
  "Academic Honour",
  "Client Recognition",
  "Open Source Recognition",
];

export const RECOGNITION_LEVELS: string[] = [
  "Global / International",
  "National",
  "Regional / State",
  "Company / Organization",
  "University / Academic",
];

export const PUBLICATION_TYPES: string[] = [
  "Peer-Reviewed Journal Paper",
  "Conference Paper",
  "Technical Blog / Engineering Article",
  "Whitepaper / Industry Report",
  "Book / Book Chapter",
  "Patent Filing",
];

export const PATENT_STATUSES: string[] = [
  "Not Applicable",
  "Granted",
  "Published",
  "Filed / Pending",
  "Provisional",
];

export const ACHIEVEMENT_TYPES: string[] = [
  "Performance Improvement",
  "Users / Customers Served",
  "Revenue / Cost Impact",
  "Reliability / Uptime",
  "Delivery Speed",
  "Quality / Test Coverage",
];
