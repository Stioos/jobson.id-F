// ==================== TYPES ====================

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  icon: string;
  color: string;
}

export interface ServiceCategory {
  slug: string;
  name: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  services: ServiceItem[];
  keyBenefits: { icon: string; title: string; desc: string }[];
  industries: string[];
  processSteps: { step: number; title: string; desc: string }[];
  techStack: string[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  testimonials: { name: string; role: string; company: string; text: string }[];
}

// ==================== DATA ====================

export const serviceCategories: ServiceCategory[] = [
  // ─── 1. AI-Powered Business Solutions ─────────────────────────────────
  {
    slug: 'ai-powered-business-solutions',
    name: 'AI-Powered Business Solutions',
    icon: 'Brain',
    color: '#0099FF',
    gradientFrom: '#0099FF',
    gradientTo: '#0055CC',
    description:
      'Transform your business operations with intelligent AI systems that automate workflows, enhance customer engagement, and deliver actionable insights across every department.',
    services: [
      {
        id: 'cat1-svc1',
        name: 'Automate Your Business Processes with AI That Works 24/7',
        slug: 'ai-business-process-automation',
        shortDesc:
          'Automate repetitive business processes with intelligent AI workflows that reduce manual effort, minimize errors, and accelerate operations across your organization.',
        icon: 'Workflow',
        color: '#0099FF',
      },
      {
        id: 'cat1-svc2',
        name: 'Delight Every Customer with AI-Powered Support That Never Sleeps',
        slug: 'ai-customer-support-solutions',
        shortDesc:
          'Deploy AI-powered support systems that handle customer queries 24/7 with natural conversations, intelligent routing, and sentiment-aware responses.',
        icon: 'Headphones',
        color: '#0099FF',
      },
      {
        id: 'cat1-svc3',
        name: 'Turn Documents into Data with AI That Reads, Understands & Extracts',
        slug: 'ai-document-intelligence',
        shortDesc:
          'Extract, classify, and process information from documents at scale using advanced OCR, NLP, and machine learning for intelligent document management.',
        icon: 'FileSearch',
        color: '#0099FF',
      },
      {
        id: 'cat1-svc4',
        name: 'Build a Brain for Your Company with AI Knowledge Management',
        slug: 'ai-knowledge-management',
        shortDesc:
          'Build intelligent knowledge bases that automatically organize, retrieve, and recommend information to empower your teams with instant expertise.',
        icon: 'BookOpen',
        color: '#0099FF',
      },
      {
        id: 'cat1-svc5',
        name: 'Deploy AI Voice & Chat Assistants That Feel Human to Every Caller',
        slug: 'ai-voice-chat-assistants',
        shortDesc:
          'Create conversational AI assistants for voice and text that understand context, handle complex queries, and integrate seamlessly with your existing systems.',
        icon: 'Mic',
        color: '#0099FF',
      },
      {
        id: 'cat1-svc6',
        name: 'Integrate AI into Your Enterprise Stack End-to-End, Production-Ready',
        slug: 'enterprise-ai-integration',
        shortDesc:
          'Seamlessly integrate AI capabilities into your existing enterprise systems, ERP, CRM, and workflows to unlock intelligent automation at scale.',
        icon: 'Plug',
        color: '#0099FF',
      },
    ],
    keyBenefits: [
      { icon: 'Zap', title: '40% Faster Operations', desc: 'AI-powered process automation eliminates manual bottlenecks, reducing cycle times across invoicing, approvals, and reporting by up to 40%.' },
      { icon: 'Brain', title: 'Intelligent Decision Making', desc: 'Real-time AI insights surface patterns in your business data that human teams miss, enabling data-driven decisions at every organizational level.' },
      { icon: 'Clock', title: '24/7 AI Availability', desc: 'AI assistants and support systems operate round the clock without fatigue, ensuring consistent service quality and instant responses across all time zones.' },
      { icon: 'DollarSign', title: '60% Cost Reduction', desc: 'Automating document processing, customer support, and knowledge retrieval slashes operational costs while improving accuracy and throughput.' },
      { icon: 'Shield', title: 'Enterprise-Grade Security', desc: 'All AI solutions are deployed with SOC 2 compliant architectures, end-to-end encryption, and role-based access controls for your sensitive business data.' },
      { icon: 'RefreshCw', title: 'Continuous Learning', desc: 'Our AI systems continuously learn from interactions and feedback, improving accuracy and relevance over time without manual retraining cycles.' },
    ],
    industries: ['Banking & Finance', 'Healthcare & Life Sciences', 'Insurance & Risk Management', 'Legal & Compliance', 'Government & Public Sector', 'Telecommunications'],
    processSteps: [
      { step: 1, title: 'Discovery & Audit', desc: 'We analyze your current business processes, identify automation opportunities, and map integration points with existing enterprise systems.' },
      { step: 2, title: 'AI Solution Design', desc: 'Our team architects custom AI workflows, selects the right models, and designs conversational flows tailored to your specific business logic.' },
      { step: 3, title: 'Build & Integrate', desc: 'We develop, train, and deploy AI solutions with seamless integration into your ERP, CRM, and communication platforms with zero downtime.' },
      { step: 4, title: 'Monitor & Optimize', desc: 'Post-launch, we continuously monitor AI performance, retrain models on new data, and optimize workflows for maximum business impact.' },
    ],
    techStack: ['OpenAI GPT-4', 'Azure Cognitive Services', 'LangChain', 'Pinecone', 'Elasticsearch', 'Python', 'TensorFlow', 'FastAPI'],
    stats: [
      { value: '200+', label: 'AI Solutions Deployed' },
      { value: '40%', label: 'Average Cost Savings' },
      { value: '99.2%', label: 'AI Accuracy Rate' },
      { value: '3x', label: 'Faster Processing' },
    ],
    faqs: [
      { q: 'How long does it take to implement an AI business solution?', a: 'Implementation timelines vary from 4-12 weeks depending on complexity. Simple AI chatbots and document processors can be deployed in 4-6 weeks, while enterprise-wide AI integrations with multiple system touchpoints typically take 8-12 weeks including testing and training.' },
      { q: 'Can AI solutions integrate with our existing ERP and CRM systems?', a: 'Absolutely. We have extensive experience integrating AI with SAP, Oracle, Salesforce, Microsoft Dynamics, and custom enterprise systems. Our integration approach uses REST APIs, webhooks, and middleware to ensure seamless data flow without disrupting existing workflows.' },
      { q: 'How do you handle data privacy and security in AI solutions?', a: 'All our AI solutions follow SOC 2 Type II compliance standards. We implement data encryption at rest and in transit, use private cloud or on-premise deployments for sensitive data, and ensure no customer data is used to train public models. We also provide audit trails and access controls.' },
      { q: 'What kind of ROI can we expect from AI business automation?', a: 'Our clients typically see 30-60% reduction in operational costs within the first 6 months. Document processing automation alone saves an average of 15 hours per employee per week. Customer support AI reduces ticket resolution time by 70% while improving CSAT scores by 25-35%.' },
    ],
    testimonials: [
      { name: 'Rajesh Mehta', role: 'VP of Operations', company: 'FinServe Global', text: 'JOBSONN\'s AI document intelligence transformed our loan processing pipeline. What used to take our team 3 days now completes in under 4 hours with higher accuracy. The ROI was visible within the first quarter.' },
      { name: 'Sarah Chen', role: 'CTO', company: 'MedTech Solutions', text: 'The AI knowledge management system they built for our medical device support team has been a game-changer. Support agents now find answers 80% faster, and patient satisfaction scores jumped by 32 points.' },
      { name: 'Arun Patel', role: 'Director of Digital', company: 'InsureRight Inc.', text: 'Their AI customer support solution handles 73% of our queries without human intervention. The sentiment-aware routing ensures complex claims go to the right specialists instantly. Truly enterprise-grade AI.' },
    ],
  },

  // ─── 2. Digital Sales & AI Marketing ─────────────────────────────────
  {
    slug: 'digital-sales-ai-marketing',
    name: 'Digital Sales & AI Marketing',
    icon: 'TrendingUp',
    color: '#7C3AED',
    gradientFrom: '#7C3AED',
    gradientTo: '#5B21B6',
    description:
      'Leverage AI-driven marketing and sales automation to reach the right audience, optimize conversions, and accelerate revenue growth across all digital channels.',
    services: [
      {
        id: 'cat2-svc1',
        name: 'Scale Your Marketing with AI That Learns, Optimizes & Converts',
        slug: 'ai-digital-marketing',
        shortDesc:
          'AI-powered digital marketing strategies that use predictive analytics, audience segmentation, and automated campaign optimization for maximum ROI.',
        icon: 'Target',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc2',
        name: 'Rank Higher with AI-Powered SEO & Content That Search Engines Love',
        slug: 'seo-geo-ai-content-marketing',
        shortDesc:
          'Generate and optimize content with AI for search engines and generative engine optimization (GEO) to dominate organic rankings and AI search results.',
        icon: 'Search',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc3',
        name: 'Be Everywhere Your Customers Are with AI-Driven Search & Social',
        slug: 'search-engine-social-media-marketing',
        shortDesc:
          'Comprehensive SEM and social media marketing with AI-driven ad targeting, A/B testing, and cross-platform campaign management for measurable growth.',
        icon: 'Megaphone',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc4',
        name: 'Grow Your Social Presence on Autopilot with AI That Posts & Engages',
        slug: 'ai-social-media-automation',
        shortDesc:
          'Automate social media posting, engagement, and analytics with AI tools that schedule content, respond to interactions, and track performance in real-time.',
        icon: 'Share2',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc5',
        name: 'Build Funnels That Convert Themselves with AI-Powered Sales Automation',
        slug: 'ai-sales-funnel-automation',
        shortDesc:
          'Build intelligent sales funnels that automatically qualify leads, nurture prospects, and convert opportunities using AI-driven scoring and personalization.',
        icon: 'Filter',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc6',
        name: 'Never Let a Lead Go Cold Again with AI-Powered CRM & Lead Automation',
        slug: 'crm-lead-automation',
        shortDesc:
          'Automate CRM workflows and lead management with AI-powered scoring, routing, follow-ups, and pipeline analytics to close deals faster.',
        icon: 'Users',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc7',
        name: 'Know Your Market Before You Enter It with AI-Powered Research',
        slug: 'ai-market-research-customer-intelligence',
        shortDesc:
          'Market research, competitor intelligence, ICP, buyer personas, and customer insights powered by AI for data-driven strategic decisions.',
        icon: 'BarChart3',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc8',
        name: 'Find Buyers Before They Find You with AI-Powered Lead Generation',
        slug: 'ai-lead-generation-prospecting',
        shortDesc:
          'B2B prospect discovery, target-account research, AI-powered lead lists, and prospect qualification for building high-quality pipelines.',
        icon: 'Target',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc9',
        name: 'Book More Meetings with AI Outbound That Books While You Sleep',
        slug: 'ai-outbound-sales-outreach',
        shortDesc:
          'Personalized LinkedIn outreach, cold outreach, AI sales messaging, and multi-channel prospect engagement for pipeline acceleration.',
        icon: 'Send',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc10',
        name: 'Win the Accounts That Matter with AI-Powered ABM Strategies',
        slug: 'ai-account-based-marketing',
        shortDesc:
          'Target-account campaigns, account intelligence, personalized marketing, and sales alignment for enterprise account growth.',
        icon: 'Layers',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc11',
        name: 'Make Every Ad Dollar Count with AI-Powered Advertising Strategy',
        slug: 'ai-paid-advertising-campaign-strategy',
        shortDesc:
          'Google/Meta/LinkedIn advertising, AI campaign planning, audience targeting, and optimization for maximum ROAS across all platforms.',
        icon: 'Megaphone',
        color: '#7C3AED',
      },
      {
        id: 'cat2-svc12',
        name: 'Equip Your Team to Close More with AI Sales Enablement',
        slug: 'ai-sales-enablement-revenue-intelligence',
        shortDesc:
          'Sales playbooks, AI pitch materials, competitive intelligence, call insights, and revenue reporting for sales team performance.',
        icon: 'TrendingUp',
        color: '#7C3AED',
      },
    ],
    keyBenefits: [
      { icon: 'Target', title: 'Precision Audience Targeting', desc: 'AI analyzes behavioral data, purchase patterns, and engagement signals to identify and target high-converting audience segments with surgical precision.' },
      { icon: 'ArrowUpRight', title: '3x Higher Conversion Rates', desc: 'AI-optimized landing pages, personalized email sequences, and smart A/B testing consistently deliver 2-3x improvement in conversion rates over traditional campaigns.' },
      { icon: 'DollarSign', title: '45% Lower Acquisition Cost', desc: 'Intelligent bid management, audience suppression, and budget allocation algorithms reduce customer acquisition costs by optimizing every dollar of ad spend.' },
      { icon: 'BarChart3', title: 'Real-Time Performance Analytics', desc: 'Live dashboards track every campaign metric, attribution model, and revenue impact so you can pivot strategies instantly based on real market data.' },
      { icon: 'RefreshCw', title: 'Automated Content at Scale', desc: 'Generate SEO-optimized blog posts, social content, ad copy, and email sequences at scale using AI while maintaining your brand voice and messaging consistency.' },
      { icon: 'Users', title: 'Intelligent Lead Scoring', desc: 'AI models score and prioritize leads based on engagement signals, firmographic data, and buying intent, ensuring your sales team focuses on the hottest opportunities.' },
    ],
    industries: ['E-Commerce & Retail', 'SaaS & Technology', 'Real Estate', 'Education & EdTech', 'Healthcare & Wellness', 'B2B & Professional Services'],
    processSteps: [
      { step: 1, title: 'Market & Competitor Analysis', desc: 'We audit your current marketing performance, analyze competitor strategies, and identify untapped channels and audience segments for growth.' },
      { step: 2, title: 'AI Strategy & Funnel Design', desc: 'We design AI-powered marketing funnels, content calendars, and automation workflows tailored to your buyer personas and revenue targets.' },
      { step: 3, title: 'Campaign Launch & Optimization', desc: 'We launch campaigns across channels with AI-driven targeting, then continuously optimize bids, creatives, and messaging based on real-time performance data.' },
      { step: 4, title: 'Scale & Report', desc: 'We scale winning campaigns, refine attribution models, and deliver comprehensive ROI reports with actionable insights for sustained growth.' },
    ],
    techStack: ['Google Ads AI', 'Meta Business Suite', 'HubSpot', 'Semrush', 'ChatGPT API', 'Segment', 'Looker', 'React Email'],
    stats: [
      { value: '350+', label: 'Campaigns Managed' },
      { value: '3.2x', label: 'Average ROAS' },
      { value: '45%', label: 'Lower CAC' },
      { value: '10M+', label: 'Leads Generated' },
    ],
    faqs: [
      { q: 'How does AI improve our digital marketing ROI compared to traditional approaches?', a: 'AI analyzes thousands of data points in real-time to optimize ad targeting, bid amounts, content timing, and channel allocation. Our clients see an average 3.2x ROAS compared to 1.5-2x with traditional methods. AI also enables predictive audience modeling that identifies high-value customers before competitors.' },
      { q: 'What is GEO (Generative Engine Optimization) and why does it matter?', a: 'GEO optimizes your content for AI-powered search engines like ChatGPT, Perplexity, and Google SGE. As more users get answers from AI summaries rather than clicking links, GEO ensures your brand appears in AI-generated responses. We optimize content structure, authority signals, and entity relationships for maximum AI visibility.' },
      { q: 'Can you manage our multi-channel campaigns across different platforms?', a: 'Yes. We manage campaigns across Google Ads, Meta (Facebook/Instagram), LinkedIn, X (Twitter), TikTok, and programmatic display. Our AI platform unifies audience data across channels, enabling cross-platform attribution and automated budget reallocation to the best-performing channels.' },
      { q: 'How do you ensure AI-generated content aligns with our brand voice?', a: 'We start by training AI models on your existing high-performing content, brand guidelines, and style guides. Every piece of AI-generated content goes through human editorial review before publication. We also maintain a brand voice scorecard that measures consistency across all generated content.' },
    ],
    testimonials: [
      { name: 'Priya Sharma', role: 'CMO', company: 'ShopVista E-Commerce', text: 'JOBSONN\'s AI marketing engine took our ROAS from 1.8x to 4.2x in just 5 months. Their predictive audience targeting found customer segments we never knew existed. Revenue grew 180% year-over-year.' },
      { name: 'Marcus Johnson', role: 'VP of Sales', company: 'CloudStack Pro', text: 'The AI sales funnel they built qualifies and nurtures leads better than our best SDRs. Our sales team now only talks to prospects who are ready to buy. Close rates improved by 65% and sales cycle dropped from 45 to 18 days.' },
      { name: 'Lisa Wang', role: 'Founder', company: 'EduBright Academy', text: 'Their GEO strategy got us featured in ChatGPT responses for our top 12 keywords. Organic traffic from AI search engines grew 400% in 6 months. This is the future of SEO and JOBSONN nailed it.' },
    ],
  },

  // ─── 3. AI Agentic & Automation ───────────────────────────────────────
  {
    slug: 'ai-agentic-automation',
    name: 'AI Agentic & Automation',
    icon: 'Bot',
    color: '#10B981',
    gradientFrom: '#10B981',
    gradientTo: '#059669',
    description:
      'Build autonomous AI agents and intelligent automation systems that handle complex tasks, make decisions, and operate independently to transform your operations.',
    services: [
      {
        id: 'cat3-svc1',
        name: 'Build Autonomous AI Agents That Get Things Done Without You',
        slug: 'custom-ai-agents',
        shortDesc:
          'Design and deploy purpose-built AI agents tailored to your business needs — from research assistants to decision-support systems that learn and adapt.',
        icon: 'Bot',
        color: '#10B981',
      },
      {
        id: 'cat3-svc2',
        name: 'Deploy Multi-Agent AI Swarms That Solve Complex Tasks Together',
        slug: 'multi-agent-systems',
        shortDesc:
          'Architect collaborative AI agent networks where specialized agents work together, share knowledge, and coordinate to solve complex, multi-step problems.',
        icon: 'Network',
        color: '#10B981',
      },
      {
        id: 'cat3-svc3',
        name: 'Connect Your Tools & Automate the Busywork with AI Workflows',
        slug: 'ai-workflow-automation',
        shortDesc:
          'Automate end-to-end business workflows with AI that orchestrates tasks, handles exceptions, and continuously optimizes process efficiency.',
        icon: 'Workflow',
        color: '#10B981',
      },
      {
        id: 'cat3-svc4',
        name: 'Automate Your Factory Floor with AI That Optimizes in Real-Time',
        slug: 'ai-manufacturing-process-automation',
        shortDesc:
          'Implement AI-driven manufacturing automation with predictive maintenance, quality control, production optimization, and smart factory solutions.',
        icon: 'Factory',
        color: '#10B981',
      },
      {
        id: 'cat3-svc5',
        name: 'Automate Your Hiring Pipeline with AI That Screens & Shortlists',
        slug: 'ai-recruitment-automation',
        shortDesc:
          'Streamline hiring with AI-powered resume screening, candidate matching, interview scheduling, and onboarding automation for faster talent acquisition.',
        icon: 'UserCheck',
        color: '#10B981',
      },
      {
        id: 'cat3-svc6',
        name: 'Run Your Operations on Autopilot with AI That Monitors 24/7',
        slug: 'ai-operations-automation',
        shortDesc:
          'Automate IT and business operations with AIOps — intelligent monitoring, incident resolution, capacity planning, and process optimization.',
        icon: 'Cog',
        color: '#10B981',
      },
    ],
    keyBenefits: [
      { icon: 'Bot', title: 'Autonomous Task Execution', desc: 'AI agents independently handle complex, multi-step tasks without human intervention — from data research and report generation to procurement and scheduling.' },
      { icon: 'Zap', title: '90% Task Automation Rate', desc: 'Our AI agents successfully complete 90% of assigned tasks autonomously, only escalating edge cases that truly require human judgment and creativity.' },
      { icon: 'Network', title: 'Multi-Agent Collaboration', desc: 'Specialized agents work together like a virtual team — a research agent gathers data, an analysis agent processes it, and a decision agent recommends actions.' },
      { icon: 'Clock', title: 'Instant Scalability', desc: 'Deploy additional AI agents in minutes to handle demand spikes. Unlike human teams, AI agents scale linearly without hiring, training, or management overhead.' },
      { icon: 'Cpu', title: 'Continuous Improvement', desc: 'Agents learn from every interaction, automatically refining their strategies, improving accuracy, and expanding their capability scope over time through self-supervised learning.' },
      { icon: 'Shield', title: 'Guardrails & Compliance', desc: 'Every agent operates within defined guardrails — approval workflows, compliance checks, and audit logging ensure AI actions align with your business policies.' },
    ],
    industries: ['Manufacturing & Industrial', 'Logistics & Supply Chain', 'Financial Services', 'Human Resources & Staffing', 'IT & Technology Operations', 'Healthcare Administration'],
    processSteps: [
      { step: 1, title: 'Process Mapping', desc: 'We document and analyze your existing workflows, identify automation candidates, and define success metrics for each AI agent deployment.' },
      { step: 2, title: 'Agent Architecture', desc: 'We design the agent system — single agents for simple tasks or multi-agent orchestration for complex workflows — with clear decision boundaries and escalation paths.' },
      { step: 3, title: 'Development & Training', desc: 'We build and train agents on your domain data, integrate with your tools and APIs, and implement safety guardrails and human-in-the-loop controls.' },
      { step: 4, title: 'Deploy & Evolve', desc: 'Agents go live with monitoring dashboards. We track performance, gather feedback, and iteratively improve agent capabilities based on real-world results.' },
    ],
    techStack: ['LangGraph', 'CrewAI', 'AutoGen', 'OpenAI Agents SDK', 'n8n', 'Python', 'Redis', 'Docker'],
    stats: [
      { value: '85+', label: 'AI Agents Deployed' },
      { value: '90%', label: 'Task Automation Rate' },
      { value: '75%', label: 'Time Saved' },
      { value: '5x', label: 'Productivity Gain' },
    ],
    faqs: [
      { q: 'What is the difference between AI automation and AI agents?', a: 'Traditional AI automation follows pre-defined rules and triggers (like if-this-then-that). AI agents are autonomous — they understand goals, plan their approach, use tools, make decisions, and adapt when conditions change. Agents can handle novel situations that rule-based automation cannot.' },
      { q: 'How do multi-agent systems work together?', a: 'Multi-agent systems use orchestration frameworks like LangGraph or CrewAI. Each agent has a specialized role — for example, a research agent gathers data, an analyst processes it, a writer creates reports, and a reviewer checks quality. They communicate through shared memory and message passing, coordinating like a virtual team.' },
      { q: 'Can AI agents make decisions autonomously without human oversight?', a: 'Agents can operate autonomously within defined guardrails. We implement configurable autonomy levels — from fully supervised (every action requires approval) to fully autonomous (only escalates exceptions). Most clients start with supervised mode and gradually increase autonomy as confidence builds.' },
      { q: 'What happens when an AI agent encounters a situation it cannot handle?', a: 'Agents are designed with graceful degradation. When confidence is low or a situation falls outside their training, they escalate to human operators with full context about what they tried and why. This human-in-the-loop approach ensures nothing falls through the cracks while maintaining high automation rates.' },
    ],
    testimonials: [
      { name: 'David Kim', role: 'COO', company: 'SteelWorks Manufacturing', text: 'The multi-agent system JOBSONN built for our procurement process is remarkable. One agent negotiates with suppliers, another checks compliance, and a third handles PO generation. Our procurement cycle went from 2 weeks to 2 days.' },
      { name: 'Anita Desai', role: 'CHRO', company: 'TalentFirst Solutions', text: 'Their AI recruitment agents screen 5,000+ applications daily, match candidates to roles with 92% accuracy, and schedule interviews automatically. Our time-to-hire dropped from 34 days to 8 days. It is like having 20 extra recruiters.' },
      { name: 'James Morrison', role: 'VP of IT Ops', company: 'NetScale Systems', text: 'AIOps agents now handle 85% of our L1 and L2 incidents autonomously. Mean time to resolution dropped from 4 hours to 12 minutes. The agents even predict and prevent outages before they impact users.' },
    ],
  },

  // ─── 4. Open Source Ready-to-Use Deployment ──────────────────────────
  {
    slug: 'open-source-deployment',
    name: 'Open Source Ready-to-Use Deployment',
    icon: 'Box',
    color: '#F59E0B',
    gradientFrom: '#F59E0B',
    gradientTo: '#D97706',
    description:
      'Deploy production-ready open source platforms and tools customized for your infrastructure — from AI platforms and ERPs to DevOps toolchains and private clouds.',
    services: [
      {
        id: 'cat4-svc1',
        name: 'Deploy Your Own AI Platform with Zero Vendor Lock-In',
        slug: 'self-hosted-ai-platform-deployment',
        shortDesc:
          'Deploy and configure self-hosted AI platforms like Ollama, Hugging Face, LocalAI, and LlamaIndex on your infrastructure for complete data privacy and control.',
        icon: 'Server',
        color: '#F59E0B',
      },
      {
        id: 'cat4-svc2',
        name: 'Deploy ERPs & Portals That Your Team Actually Wants to Use',
        slug: 'erp-portal-deployment',
        shortDesc:
          'Deploy and customize open source ERP systems (Odoo, ERPNext) and enterprise portals tailored to your business processes and organizational needs.',
        icon: 'LayoutDashboard',
        color: '#F59E0B',
      },
      {
        id: 'cat4-svc3',
        name: 'Ship Custom Apps & Platforms Deployed by Senior Architects',
        slug: 'custom-apps-platforms-deployment',
        shortDesc:
          'Deploy and configure custom applications built on open source frameworks — from CMS platforms and e-commerce to learning management systems.',
        icon: 'AppWindow',
        color: '#F59E0B',
      },
      {
        id: 'cat4-svc4',
        name: 'DevOps Platform Deployment',
        slug: 'devops-platform-deployment',
        shortDesc:
          'Set up comprehensive DevOps platforms with GitLab, Jenkins, ArgoCD, and Terraform for automated build, test, and deployment pipelines.',
        icon: 'GitBranch',
        color: '#F59E0B',
      },
      {
        id: 'cat4-svc5',
        name: 'See Everything, Miss Nothing with AI-Powered Monitoring',
        slug: 'monitoring-observability',
        shortDesc:
          'Deploy monitoring and observability stacks with Prometheus, Grafana, ELK, and Jaeger for full visibility into application performance and system health.',
        icon: 'Activity',
        color: '#F59E0B',
      },
      {
        id: 'cat4-svc6',
        name: 'Deploy Your Own Private Cloud with Security & Control',
        slug: 'private-cloud-deployment',
        shortDesc:
          'Build and deploy private cloud infrastructure using OpenStack, Proxmox, or Kubernetes-based solutions for secure, scalable, self-managed cloud computing.',
        icon: 'Cloud',
        color: '#F59E0B',
      },
    ],
    keyBenefits: [
      { icon: 'DollarSign', title: '70% Cost Savings', desc: 'Open source platforms eliminate expensive licensing fees. Deploy enterprise-grade ERP, AI, and DevOps tools at a fraction of proprietary software costs.' },
      { icon: 'Lock', title: 'Complete Data Sovereignty', desc: 'Self-hosted deployments keep all data within your infrastructure. No third-party data sharing, no vendor lock-in, and full compliance with data residency requirements.' },
      { icon: 'Settings', title: 'Full Customization Freedom', desc: 'Unlike SaaS products, open source platforms give you complete access to source code for unlimited customization, custom workflows, and branded experiences.' },
      { icon: 'Shield', title: 'Proven Enterprise Reliability', desc: 'Platforms like Odoo, GitLab, Kubernetes, and Grafana power thousands of enterprises worldwide. We deploy them with production-grade hardening and high availability.' },
      { icon: 'GitBranch', title: 'No Vendor Lock-In', desc: 'Open source means you own your stack. Migrate, extend, or modify any component without depending on a single vendor\'s roadmap or pricing decisions.' },
      { icon: 'Zap', title: 'Rapid Deployment', desc: 'Our pre-configured deployment templates and automation scripts get open source platforms running in days, not months. We handle security patching, backups, and updates.' },
    ],
    industries: ['Startups & SMEs', 'Government & Defense', 'Healthcare & HIPAA', 'Education & Research', 'Financial Services', 'Manufacturing & Industrial'],
    processSteps: [
      { step: 1, title: 'Requirements & Platform Selection', desc: 'We assess your needs, evaluate open source alternatives, and recommend the best platforms based on features, community support, scalability, and your team\'s skills.' },
      { step: 2, title: 'Infrastructure Planning', desc: 'We design the deployment architecture — single server, HA cluster, or Kubernetes — considering your performance, security, and budget requirements.' },
      { step: 3, title: 'Deploy & Configure', desc: 'We deploy platforms using infrastructure-as-code, configure security settings, integrate with your existing systems, and migrate data from legacy tools.' },
      { step: 4, title: 'Train & Handover', desc: 'We train your team on platform administration, create runbooks, set up monitoring alerts, and provide ongoing support for updates and troubleshooting.' },
    ],
    techStack: ['Docker & Kubernetes', 'Terraform', 'Odoo / ERPNext', 'GitLab CE', 'Prometheus & Grafana', 'Ollama / LocalAI', 'PostgreSQL', 'Nginx'],
    stats: [
      { value: '150+', label: 'Deployments Completed' },
      { value: '70%', label: 'Cost Savings' },
      { value: '99.9%', label: 'Uptime SLA' },
      { value: '48hrs', label: 'Avg Deployment Time' },
    ],
    faqs: [
      { q: 'Are open source platforms secure enough for enterprise use?', a: 'Absolutely. Open source platforms like Kubernetes, GitLab, and Odoo are used by Fortune 500 companies. The open source model means thousands of developers review code for vulnerabilities. We add enterprise-grade security hardening including TLS encryption, RBAC, network policies, and regular security patching.' },
      { q: 'Can we migrate from a proprietary SaaS to an open source alternative?', a: 'Yes, we specialize in SaaS-to-open-source migrations. We handle data export, schema mapping, data transformation, and validation. We have migrated clients from Salesforce to Odoo, Jira to GitLab, Datadog to Prometheus/Grafana, and many more with zero data loss.' },
      { q: 'What ongoing support and maintenance do you provide for open source deployments?', a: 'We provide tiered support plans including 24/7 monitoring, security patching, performance optimization, backup management, and disaster recovery. Our team handles upgrades, compatibility issues, and provides a dedicated Slack channel for your team.' },
      { q: 'How do self-hosted AI platforms compare to cloud AI services like OpenAI?', a: 'Self-hosted AI platforms like Ollama and LocalAI give you complete data privacy, no per-API-call costs, and unlimited usage. While they may require more initial setup, the long-term cost savings are massive for high-volume use cases. We can also deploy fine-tuned models that outperform generic APIs for your specific domain.' },
    ],
    testimonials: [
      { name: 'Ramesh Gupta', role: 'CTO', company: 'GovTech Solutions', text: 'JOBSONN deployed a complete open source DevOps stack — GitLab, ArgoCD, Prometheus, Grafana — in under a week. We saved $180K annually in licensing fees and got better features than our previous proprietary tools.' },
      { name: 'Emily Foster', role: 'IT Director', company: 'MedCare Clinics', text: 'The Odoo ERP they deployed handles our 12 clinics\' operations perfectly. Custom modules for patient management and insurance billing were built in weeks. HIPAA compliance was built in from day one.' },
      { name: 'Ahmed Khan', role: 'Founder', company: 'LearnPath Academy', text: 'Their self-hosted AI platform lets us run LLMs on our own servers with full student data privacy. We process 50K+ student queries monthly with zero data leaving our infrastructure. Incredible value.' },
    ],
  },

  // ─── 5. Custom Software Development ──────────────────────────────────
  {
    slug: 'custom-software-development',
    name: 'Custom Software Development',
    icon: 'Code2',
    color: '#EF4444',
    gradientFrom: '#EF4444',
    gradientTo: '#DC2626',
    description:
      'From enterprise web applications to mobile apps and SaaS platforms, we build robust, scalable software solutions tailored to your unique business requirements.',
    services: [
      {
        id: 'cat5-svc1',
        name: 'Build Enterprise Web Apps That Scale to Millions of Users',
        slug: 'enterprise-web-applications',
        shortDesc:
          'Build scalable, secure enterprise web applications with modern frameworks like React, Next.js, and Node.js that handle complex business logic at scale.',
        icon: 'Globe',
        color: '#EF4444',
      },
      {
        id: 'cat5-svc2',
        name: 'Launch Your SaaS Product with Multi-Tenant Architecture Built to Scale',
        slug: 'saas-development',
        shortDesc:
          'Design and develop multi-tenant SaaS platforms with subscription management, user roles, analytics dashboards, and scalable cloud architecture.',
        icon: 'Layers',
        color: '#EF4444',
      },
      {
        id: 'cat5-svc3',
        name: 'Ship Mobile Apps for iOS & Android from One Codebase, Built to Scale',
        slug: 'mobile-apps',
        shortDesc:
          'Build native and cross-platform mobile apps for iOS and Android using React Native and Flutter with seamless backend integration and offline support.',
        icon: 'Smartphone',
        color: '#EF4444',
      },
      {
        id: 'cat5-svc4',
        name: 'Build Custom ERPs & CRMs That Fit Your Business Perfectly',
        slug: 'erp-crm-development',
        shortDesc:
          'Develop custom ERP and CRM systems that integrate finance, HR, supply chain, sales, and operations into a unified, intelligent business platform.',
        icon: 'LayoutDashboard',
        color: '#EF4444',
      },
      {
        id: 'cat5-svc5',
        name: 'Connect Everything with APIs That Are Fast, Reliable & Secure',
        slug: 'api-development-integration',
        shortDesc:
          'Design, develop, and integrate robust RESTful and GraphQL APIs that connect your systems, enable data flow, and power third-party integrations.',
        icon: 'Plug',
        color: '#EF4444',
      },
      {
        id: 'cat5-svc6',
        name: 'Modernize Your Legacy Systems Without Downtime or Data Loss',
        slug: 'legacy-modernization',
        shortDesc:
          'Migrate and re-architect outdated monolithic applications into modern microservices with cloud-native technologies, containers, and CI/CD pipelines.',
        icon: 'RefreshCw',
        color: '#EF4444',
      },
    ],
    keyBenefits: [
      { icon: 'Code2', title: 'Tailored to Your Business', desc: 'Every line of code is written for your specific requirements. No forced workarounds, no unnecessary features — just a perfect-fit solution that maps to your workflows.' },
      { icon: 'Rocket', title: 'Faster Time to Market', desc: 'Our agile development methodology with 2-week sprints delivers working increments rapidly. MVP to production in 8-12 weeks for most enterprise applications.' },
      { icon: 'Layers', title: 'Scalable Architecture', desc: 'Microservices, horizontal scaling, and cloud-native patterns ensure your software handles growth from 100 to 10 million users without architectural rewrites.' },
      { icon: 'Shield', title: 'Security Built-In', desc: 'OWASP Top 10 compliance, SAST/DAST scanning, dependency auditing, and penetration testing are integrated into every sprint, not bolted on at the end.' },
      { icon: 'GitBranch', title: 'Clean Code & Documentation', desc: 'Every project follows SOLID principles, comprehensive API documentation, architecture decision records, and knowledge transfer sessions for your internal teams.' },
      { icon: 'Monitor', title: 'Production-Grade Quality', desc: '80%+ code coverage, load testing, chaos engineering, and comprehensive monitoring ensure your software performs reliably under real-world conditions.' },
    ],
    industries: ['Fintech & Banking', 'Healthcare & MedTech', 'Logistics & Transportation', 'E-Commerce & Marketplace', 'Education & E-Learning', 'Real Estate & PropTech'],
    processSteps: [
      { step: 1, title: 'Discovery & Architecture', desc: 'We conduct deep-dive workshops to understand your requirements, design system architecture, create wireframes, and define the technical roadmap with clear milestones.' },
      { step: 2, title: 'Agile Development Sprints', desc: 'We build in 2-week sprints with working demos, continuous integration, automated testing, and daily standups to keep you informed and in control of progress.' },
      { step: 3, title: 'Testing & QA', desc: 'Comprehensive testing including unit, integration, E2E, performance, security, and UAT ensures every release meets quality standards before reaching your users.' },
      { step: 4, title: 'Launch & Support', desc: 'We handle deployment, monitoring setup, performance optimization, and provide ongoing maintenance, bug fixes, and feature enhancements post-launch.' },
    ],
    techStack: ['React / Next.js', 'Node.js / NestJS', 'TypeScript', 'PostgreSQL', 'React Native / Flutter', 'AWS / Azure', 'GraphQL', 'Redis'],
    stats: [
      { value: '300+', label: 'Projects Delivered' },
      { value: '12wks', label: 'Avg Time to MVP' },
      { value: '98%', label: 'On-Time Delivery' },
      { value: '4.9/5', label: 'Client Rating' },
    ],
    faqs: [
      { q: 'What development methodology do you follow?', a: 'We follow Scrum/Agile with 2-week sprints. Each sprint includes planning, daily standups, a working demo, and retrospective. You get full visibility through tools like Jira or Linear, and can provide feedback at every sprint review. For fixed-scope projects, we also offer hybrid waterfall-agile approaches.' },
      { q: 'Do you provide dedicated development teams or project-based engagement?', a: 'Both. We offer dedicated team models where developers become an extension of your in-house team, and fixed-price project models with defined scope and timelines. Many clients start with a project and transition to a dedicated team for ongoing development and maintenance.' },
      { q: 'How do you handle project communication and collaboration?', a: 'Every project gets a dedicated PM, daily Slack/Teams communication, weekly progress reports, and sprint demos. We use shared repositories, Figma for design collaboration, and provide access to project management tools. You will never be in the dark about your project status.' },
      { q: 'What happens after the project is delivered? Do you provide maintenance?', a: 'Yes. We offer flexible post-launch support plans — from basic bug fixes to full managed services including monitoring, performance optimization, security patching, and feature development. Our average client relationship extends 2+ years beyond initial delivery.' },
    ],
    testimonials: [
      { name: 'Michael Torres', role: 'CEO', company: 'PayFlow Fintech', text: 'JOBSONN built our entire payment platform from scratch — mobile app, merchant dashboard, and payment gateway API — in 14 weeks. The architecture handles 50K transactions daily without breaking a sweat. Exceptional engineering team.' },
      { name: 'Neha Reddy', role: 'Product Head', company: 'HealthBridge App', text: 'Their React Native team delivered our patient-doctor app for iOS and Android with a shared codebase. Offline sync, real-time chat, and video consultations all work flawlessly. App store approval on first submission.' },
      { name: 'Robert Chang', role: 'CTO', company: 'LogiTrack Systems', text: 'We hired JOBSONN to modernize our 15-year-old logistics platform. They re-architected it into microservices, migrated the database, and launched the new system with zero downtime. A masterclass in legacy modernization.' },
    ],
  },

  // ─── 6. Data Engineering & Analytics ──────────────────────────────────
  {
    slug: 'data-engineering-analytics',
    name: 'Data Engineering & Analytics',
    icon: 'Database',
    color: '#06B6D4',
    gradientFrom: '#06B6D4',
    gradientTo: '#0891B2',
    description:
      'Build robust data infrastructure and unlock strategic insights with comprehensive data engineering, warehousing, real-time analytics, and predictive modeling services.',
    services: [
      {
        id: 'cat6-svc1',
        name: 'Build a Single Source of Truth with Modern Data Warehousing',
        slug: 'data-warehousing',
        shortDesc:
          'Design and implement modern data warehouses on Snowflake, BigQuery, or Redshift that centralize your data for fast, reliable analytical queries at scale.',
        icon: 'HardDrive',
        color: '#06B6D4',
      },
      {
        id: 'cat6-svc2',
        name: 'Move & Transform Data at Scale with Production-Grade ETL/ELT Pipelines',
        slug: 'etl-elt',
        shortDesc:
          'Build reliable ETL/ELT data pipelines using Apache Airflow, dbt, and Spark that extract, transform, and load data from diverse sources into your analytics platform.',
        icon: 'ArrowRightLeft',
        color: '#06B6D4',
      },
      {
        id: 'cat6-svc3',
        name: 'See Your Business in Real-Time with BI Dashboards That Actually Work',
        slug: 'bi-dashboards',
        shortDesc:
          'Create interactive business intelligence dashboards using Power BI, Tableau, or custom solutions that give teams real-time visibility into KPIs and metrics.',
        icon: 'BarChart3',
        color: '#06B6D4',
      },
      {
        id: 'cat6-svc4',
        name: 'Make Decisions Powered by Live Data with Real-Time Analytics',
        slug: 'real-time-analytics',
        shortDesc:
          'Implement real-time analytics with Apache Kafka, Flink, and Spark Streaming for live data ingestion, processing, and instant decision-making.',
        icon: 'Activity',
        color: '#06B6D4',
      },
      {
        id: 'cat6-svc5',
        name: 'Build Data Lakes That Store Everything, Query Anything',
        slug: 'data-lakes',
        shortDesc:
          'Build scalable data lake architectures on AWS S3, Azure Data Lake, or Delta Lake for cost-effective storage and processing of structured and unstructured data.',
        icon: 'Layers',
        color: '#06B6D4',
      },
      {
        id: 'cat6-svc6',
        name: "See What's Coming Before It Arrives with AI-Powered Predictive Analytics",
        slug: 'predictive-analytics',
        shortDesc:
          'Develop predictive models and forecasting solutions using machine learning that anticipate trends, optimize operations, and drive data-informed decisions.',
        icon: 'TrendingUp',
        color: '#06B6D4',
      },
    ],
    keyBenefits: [
      { icon: 'Database', title: 'Unified Data Foundation', desc: 'Consolidate data from 50+ sources — databases, APIs, SaaS tools, spreadsheets — into a single, governed, query-optimized data platform for your entire organization.' },
      { icon: 'Activity', title: 'Real-Time Insights', desc: 'Stream processing with sub-second latency enables live dashboards, instant anomaly detection, and real-time operational decisions instead of waiting for batch reports.' },
      { icon: 'BarChart3', title: 'Self-Service Analytics', desc: 'Empower business users with intuitive dashboards and SQL interfaces so they can explore data and generate reports independently without waiting for data team requests.' },
      { icon: 'TrendingUp', title: 'Predictive Capabilities', desc: 'ML-powered forecasting models predict demand, churn, revenue, and operational metrics with 85-95% accuracy, turning retrospective reporting into proactive strategy.' },
      { icon: 'HardDrive', title: '80% Lower Storage Costs', desc: 'Modern data lake architectures on cloud object storage reduce data warehousing costs by up to 80% compared to traditional on-premise solutions while improving query performance.' },
      { icon: 'Shield', title: 'Data Governance & Quality', desc: 'Built-in data lineage, quality checks, access controls, and compliance automation ensure your data is trustworthy, secure, and auditable across the entire pipeline.' },
    ],
    industries: ['Retail & E-Commerce', 'Banking & Capital Markets', 'Healthcare & Pharma', 'Telecommunications', 'Energy & Utilities', 'Supply Chain & Logistics'],
    processSteps: [
      { step: 1, title: 'Data Audit & Strategy', desc: 'We assess your current data landscape, identify gaps in data collection, catalog existing sources, and design a target architecture aligned with business objectives.' },
      { step: 2, title: 'Pipeline Development', desc: 'We build ETL/ELT pipelines using Airflow and dbt, implement data quality checks, set up schema evolution handling, and configure error recovery mechanisms.' },
      { step: 3, title: 'Analytics & Modeling', desc: 'We create BI dashboards, build predictive models, and implement real-time analytics streams that transform raw data into actionable business intelligence.' },
      { step: 4, title: 'Governance & Optimization', desc: 'We establish data governance frameworks, optimize query performance, set up data catalogs, and train your team on self-service analytics tools and best practices.' },
    ],
    techStack: ['Apache Spark', 'Apache Kafka', 'Snowflake / BigQuery', 'dbt', 'Airflow', 'Power BI / Tableau', 'Python / SQL', 'Delta Lake'],
    stats: [
      { value: '2PB+', label: 'Data Processed Daily' },
      { value: '50+', label: 'Data Sources Integrated' },
      { value: '92%', label: 'Forecast Accuracy' },
      { value: '80%', label: 'Storage Cost Savings' },
    ],
    faqs: [
      { q: 'What is the difference between a data warehouse and a data lake?', a: 'A data warehouse stores structured, processed data optimized for SQL queries and BI reporting. A data lake stores raw structured and unstructured data (logs, images, documents) at low cost. Modern architectures use both — a data lake for raw storage and a data warehouse for analytics, connected by ETL pipelines. We help you determine the right mix.' },
      { q: 'How do you ensure data quality across pipelines?', a: 'We implement multi-layer data quality checks — source validation, schema enforcement, statistical anomaly detection, and business rule validation using tools like Great Expectations and dbt tests. Every data quality issue triggers alerts, and we build automated reconciliation processes that catch and fix data discrepancies.' },
      { q: 'Can you build real-time analytics on top of our existing data infrastructure?', a: 'Yes. We layer real-time streaming using Kafka and Flink on top of your existing batch infrastructure. This hybrid approach lets you keep proven batch pipelines for historical analysis while adding real-time capabilities for live monitoring, fraud detection, and operational dashboards.' },
      { q: 'How long does it take to set up a complete data platform?', a: 'A basic data warehouse with 5-10 source integrations and BI dashboards takes 6-8 weeks. A full-scale data platform with real-time streaming, data lake, predictive models, and self-service analytics typically takes 12-16 weeks. We deliver in phases so you see value from week 4 onwards.' },
    ],
    testimonials: [
      { name: 'Vikram Singh', role: 'Head of Analytics', company: 'RetailMax Group', text: 'JOBSONN built our entire data platform — Snowflake warehouse, 40+ Airflow pipelines, dbt transformations, and Tableau dashboards — in 10 weeks. Our merchandising team now makes decisions based on real-time sales data instead of weekly Excel reports.' },
      { name: 'Laura Mitchell', role: 'VP of Data', company: 'Capital Edge Bank', text: 'Their predictive analytics models for loan default prediction achieved 94% accuracy, saving us $12M in potential bad loans last year. The real-time fraud detection pipeline processes 2M transactions per hour with sub-second latency.' },
      { name: 'Sanjay Patel', role: 'CTO', company: 'TeleConnect Networks', text: 'We went from zero data culture to having 200+ self-service analytics users in 6 months. JOBSONN not only built the infrastructure but also trained our teams and created a data governance framework that our compliance team loves.' },
    ],
  },

  // ─── 7. Cloud Infrastructure & DevOps ────────────────────────────────
  {
    slug: 'cloud-infrastructure-devops',
    name: 'Cloud Infrastructure & DevOps',
    icon: 'Cloud',
    color: '#FFB800',
    gradientFrom: '#FFB800',
    gradientTo: '#E5A700',
    description:
      'Accelerate your cloud journey with expert infrastructure design, migration, containerization, and DevOps automation for speed, reliability, and cost efficiency.',
    services: [
      {
        id: 'cat7-svc1',
        name: 'Move to the Cloud with Zero Downtime & Full Data Integrity',
        slug: 'cloud-migration',
        shortDesc:
          'Plan and execute seamless cloud migrations from on-premise or legacy infrastructure to AWS, Azure, or GCP with minimal downtime and zero data loss.',
        icon: 'ArrowUpRight',
        color: '#FFB800',
      },
      {
        id: 'cat7-svc2',
        name: 'Orchestrate Containers at Scale with Kubernetes Done Right',
        slug: 'kubernetes',
        shortDesc:
          'Design, deploy, and manage Kubernetes clusters for container orchestration with auto-scaling, self-healing, and rolling updates for production workloads.',
        icon: 'Container',
        color: '#FFB800',
      },
      {
        id: 'cat7-svc3',
        name: 'Ship Code with Confidence with CI/CD Pipelines That Just Work',
        slug: 'ci-cd-automation',
        shortDesc:
          'Automate build, test, and deployment pipelines with GitHub Actions, GitLab CI, Jenkins, or ArgoCD for rapid, reliable, and consistent releases.',
        icon: 'GitBranch',
        color: '#FFB800',
      },
      {
        id: 'cat7-svc4',
        name: 'Provision Infrastructure in Minutes with Terraform & IaC',
        slug: 'infrastructure-as-code',
        shortDesc:
          'Define and manage your entire infrastructure using Terraform, Pulumi, or CloudFormation for version-controlled, reproducible, and automated provisioning.',
        icon: 'FileCode',
        color: '#FFB800',
      },
      {
        id: 'cat7-svc5',
        name: 'Lock Down Your Cloud End-to-End with Enterprise-Grade Security',
        slug: 'cloud-security',
        shortDesc:
          'Implement comprehensive cloud security with IAM policies, network segmentation, encryption, compliance monitoring, and zero-trust architecture.',
        icon: 'Shield',
        color: '#FFB800',
      },
      {
        id: 'cat7-svc6',
        name: 'We Run Your DevOps, You Ship with Managed DevOps 24/7',
        slug: 'managed-devops',
        shortDesc:
          'Get end-to-end DevOps management — from pipeline setup and monitoring to incident response and optimization — so your team focuses on building products.',
        icon: 'Settings',
        color: '#FFB800',
      },
    ],
    keyBenefits: [
      { icon: 'Rocket', title: '10x Faster Deployments', desc: 'Automated CI/CD pipelines reduce deployment time from hours to minutes. Push code at 10 AM, and it is in production by 10:02 AM with full rollback capability.' },
      { icon: 'DollarSign', title: '40% Cloud Cost Optimization', desc: 'Right-sizing, reserved instances, spot instances, and automated scaling policies optimize your cloud spend without sacrificing performance or reliability.' },
      { icon: 'Shield', title: 'Zero-Trust Security', desc: 'Every layer — network, identity, data, application — follows zero-trust principles with automated compliance scanning, vulnerability management, and incident response.' },
      { icon: 'Server', title: '99.99% Uptime Guarantee', desc: 'Multi-AZ architectures, auto-scaling, self-healing containers, and automated failover ensure your applications stay available even during infrastructure failures.' },
      { icon: 'GitBranch', title: 'Infrastructure as Code', desc: 'Every infrastructure change goes through code review, version control, and automated testing. Reproduce environments instantly and eliminate configuration drift.' },
      { icon: 'Container', title: 'Container-Native Operations', desc: 'Kubernetes orchestration with Helm charts, service mesh, auto-scaling, and canary deployments gives you enterprise-grade container management for any workload.' },
    ],
    industries: ['SaaS & Cloud-Native', 'Financial Services', 'Media & Entertainment', 'Gaming', 'E-Commerce', 'Healthcare & Life Sciences'],
    processSteps: [
      { step: 1, title: 'Cloud Assessment', desc: 'We audit your current infrastructure, map dependencies, estimate cloud costs, and create a phased migration plan with risk assessment and rollback strategies.' },
      { step: 2, title: 'Architecture & IaC', desc: 'We design cloud-native architecture, write Terraform/Pulumi modules for infrastructure provisioning, and set up Kubernetes clusters with networking and storage.' },
      { step: 3, title: 'Pipeline & Security Setup', desc: 'We configure CI/CD pipelines, implement security controls, set up monitoring and alerting, and establish GitOps workflows for automated deployments.' },
      { step: 4, title: 'Migration & Optimization', desc: 'We execute the migration, validate workloads, optimize performance and costs, train your team, and provide ongoing managed DevOps support.' },
    ],
    techStack: ['AWS / Azure / GCP', 'Kubernetes & Helm', 'Terraform / Pulumi', 'GitHub Actions / ArgoCD', 'Prometheus & Grafana', 'Vault', 'Istio', 'Datadog'],
    stats: [
      { value: '200+', label: 'Cloud Migrations' },
      { value: '99.99%', label: 'Uptime Achieved' },
      { value: '40%', label: 'Cost Reduction' },
      { value: '500+', label: 'Pipelines Automated' },
    ],
    faqs: [
      { q: 'How do you minimize downtime during cloud migration?', a: 'We use blue-green deployments, database replication with sync lag monitoring, and canary releases to migrate with near-zero downtime. For complex migrations, we use a phased approach — migrating non-critical services first, then progressively moving traffic. Most migrations achieve less than 5 minutes of planned downtime.' },
      { q: 'Which cloud provider do you recommend — AWS, Azure, or GCP?', a: 'It depends on your workload, existing Microsoft/Google investments, compliance requirements, and team expertise. AWS has the broadest service catalog, Azure excels for Microsoft shops, and GCP leads in data/AI. We are certified in all three and recommend based on your specific needs — many clients use multi-cloud strategies.' },
      { q: 'What is Infrastructure as Code and why do we need it?', a: 'IaC means defining your entire cloud infrastructure — servers, databases, networks, security policies — as code (Terraform, Pulumi). Benefits include: version control for infrastructure changes, reproducible environments (dev/staging/prod), automated testing of infrastructure, and elimination of manual configuration errors. It is the foundation of modern DevOps.' },
      { q: 'How do you handle cloud cost optimization?', a: 'We implement a multi-layered approach: right-sizing instances based on actual usage, reserved/spot instance strategies for non-critical workloads, automated scaling policies, storage lifecycle management, and continuous cost monitoring with alerting. Our clients typically save 30-50% on their cloud bills within the first 6 months.' },
    ],
    testimonials: [
      { name: 'Chris Anderson', role: 'VP Engineering', company: 'StreamBox Media', text: 'JOBSONN migrated our entire video streaming platform from on-premise to AWS with zero downtime during peak World Cup season. Kubernetes auto-scaling handles 10x traffic spikes effortlessly. Cloud costs actually dropped 35%.' },
      { name: 'Deepa Nair', role: 'DevOps Lead', company: 'FinGuard Security', text: 'Their Terraform modules and ArgoCD GitOps setup transformed our release process. We went from monthly releases with manual deployment anxiety to multiple daily releases with full confidence. MTTR dropped from 2 hours to 8 minutes.' },
      { name: 'Tom Bradley', role: 'CTO', company: 'GameForge Studios', text: 'The Kubernetes cluster JOBSONN manages for our gaming backend handles 2M concurrent players across 3 regions. Their auto-scaling policies and service mesh configuration gave us 99.99% uptime during our biggest launch event.' },
    ],
  },

  // ─── 8. AI / ML Model Development ────────────────────────────────────
  {
    slug: 'ai-ml-model-development',
    name: 'AI / ML Model Development',
    icon: 'Cpu',
    color: '#8B5CF6',
    gradientFrom: '#8B5CF6',
    gradientTo: '#7C3AED',
    description:
      'From machine learning and large language models to computer vision and MLOps — build production-grade AI systems trained on your data for real business impact.',
    services: [
      {
        id: 'cat8-svc1',
        name: 'Deploy ML Models That Predict, Recommend & Drive Decisions',
        slug: 'machine-learning',
        shortDesc:
          'Develop custom ML models for classification, regression, clustering, and recommendation systems using scikit-learn, XGBoost, and PyTorch for your specific use cases.',
        icon: 'Brain',
        color: '#8B5CF6',
      },
      {
        id: 'cat8-svc2',
        name: 'Build Custom Large Language Models Tuned to Your Domain & Data',
        slug: 'llm-development',
        shortDesc:
          'Build, fine-tune, and deploy large language models for chatbots, content generation, code assistants, and domain-specific AI applications using GPT, Llama, and Mistral.',
        icon: 'Sparkles',
        color: '#8B5CF6',
      },
      {
        id: 'cat8-svc3',
        name: 'See, Detect & Classify from Images with Production-Grade Vision AI',
        slug: 'computer-vision',
        shortDesc:
          'Implement image recognition, object detection, video analytics, and visual inspection solutions using YOLO, ResNet, and Vision Transformers for your industry.',
        icon: 'Eye',
        color: '#8B5CF6',
      },
      {
        id: 'cat8-svc4',
        name: 'Understand & Generate Human Language with AI-Powered NLP',
        slug: 'nlp-solutions',
        shortDesc:
          'Build NLP pipelines for text classification, sentiment analysis, entity extraction, summarization, and document processing using transformers and custom models.',
        icon: 'MessageSquare',
        color: '#8B5CF6',
      },
      {
        id: 'cat8-svc5',
        name: 'Deploy, Monitor & Scale ML Models with MLOps Built for Production',
        slug: 'mlops',
        shortDesc:
          'Establish MLOps infrastructure for model versioning, automated training, A/B testing, monitoring, and continuous deployment of ML models in production.',
        icon: 'RefreshCw',
        color: '#8B5CF6',
      },
      {
        id: 'cat8-svc6',
        name: 'Fine-Tune Foundation Models for Your Specific Domain & Use Case',
        slug: 'model-fine-tuning',
        shortDesc:
          'Fine-tune pre-trained AI models on your proprietary data for domain-specific accuracy — from LLMs and vision models to speech and multi-modal systems.',
        icon: 'Sliders',
        color: '#8B5CF6',
      },
    ],
    keyBenefits: [
      { icon: 'Brain', title: 'Domain-Specific Accuracy', desc: 'Models trained on your proprietary data achieve 85-98% accuracy for your specific use cases, far outperforming generic off-the-shelf AI solutions.' },
      { icon: 'Sparkles', title: 'Production-Ready ML', desc: 'Every model comes with MLOps infrastructure — automated retraining, A/B testing, monitoring dashboards, and CI/CD pipelines — not just Jupyter notebooks.' },
      { icon: 'Eye', title: 'Multi-Modal AI Capabilities', desc: 'Build AI that understands text, images, video, and audio. Our multi-modal expertise enables solutions that combine vision, language, and speech in a single system.' },
      { icon: 'Sliders', title: 'Efficient Fine-Tuning', desc: 'LoRA, QLoRA, and PEFT techniques let us fine-tune large models on your data using 90% less compute, making advanced AI accessible without massive GPU budgets.' },
      { icon: 'RefreshCw', title: 'Continuous Model Improvement', desc: 'MLOps pipelines automatically retrain models on new data, detect performance drift, and deploy updated models with zero downtime and full rollback capability.' },
      { icon: 'Shield', title: 'Explainable & Fair AI', desc: 'We implement model explainability (SHAP, LIME), bias detection, and fairness auditing to ensure your AI systems are transparent, trustworthy, and compliant with regulations.' },
    ],
    industries: ['Healthcare & Diagnostics', 'Autonomous Vehicles', 'Financial Trading', 'Retail & Personalization', 'Agriculture & AgTech', 'Manufacturing & Quality'],
    processSteps: [
      { step: 1, title: 'Data Strategy & Collection', desc: 'We define data requirements, assess data quality, implement labeling pipelines, and prepare training datasets with proper splits for train/validation/test.' },
      { step: 2, title: 'Model Development', desc: 'We experiment with multiple model architectures, conduct hyperparameter tuning, cross-validation, and select the best-performing model based on your business metrics.' },
      { step: 3, title: 'MLOps & Deployment', desc: 'We containerize models, set up serving infrastructure (TensorRT, Triton, vLLM), implement A/B testing, and deploy with automated scaling and monitoring.' },
      { step: 4, title: 'Monitor & Retrain', desc: 'We monitor model performance in production, detect data drift and concept drift, trigger automated retraining, and continuously optimize model accuracy.' },
    ],
    techStack: ['PyTorch / TensorFlow', 'Hugging Face', 'LangChain', 'vLLM / TensorRT', 'MLflow', 'AWS SageMaker', 'Python', 'CUDA'],
    stats: [
      { value: '120+', label: 'Models in Production' },
      { value: '94%', label: 'Avg Model Accuracy' },
      { value: '50ms', label: 'Avg Inference Latency' },
      { value: '10x', label: 'Faster Inference' },
    ],
    faqs: [
      { q: 'Do we need a large dataset to build an ML model?', a: 'Not necessarily. For many use cases, we use transfer learning and fine-tuning on pre-trained models, which require significantly less data (hundreds to a few thousand examples). For custom models from scratch, we help with data collection strategies, synthetic data generation, and data augmentation techniques.' },
      { q: 'How do you handle model deployment and serving in production?', a: 'We deploy models using optimized serving frameworks like vLLM for LLMs, TensorRT for vision models, and FastAPI for custom ML models. Models run in Kubernetes with auto-scaling, GPU optimization, and load balancing. We implement canary deployments for safe rollouts and instant rollback if needed.' },
      { q: 'What is MLOps and why is it critical for ML in production?', a: 'MLOps applies DevOps practices to ML — versioning models and data, automating training pipelines, monitoring model performance, and handling drift. Without MLOps, models silently degrade as real-world data changes. Our MLOps setup catches these issues and automatically retrains models before accuracy drops.' },
      { q: 'Can you fine-tune LLMs on our proprietary data while keeping it private?', a: 'Absolutely. We use on-premise or private cloud GPU infrastructure for fine-tuning. Your data never leaves your environment. We use techniques like LoRA and QLoRA that require minimal compute while achieving domain-specific performance that rivals or exceeds generic models on your specific tasks.' },
    ],
    testimonials: [
      { name: 'Dr. Anita Rao', role: 'Head of AI', company: 'DiagnosticsPro Health', text: 'JOBSONN\'s computer vision model for X-ray analysis detects early-stage abnormalities with 96.3% accuracy — surpassing our radiologists in initial screening. It now assists 40+ hospitals in their diagnostic workflow.' },
      { name: 'Kevin Park', role: 'AI Director', company: 'RetailGenius', text: 'The recommendation engine they built increased our average order value by 34% and customer engagement by 52%. Fine-tuned LLMs power our product descriptions and customer chatbot with brand-perfect tone.' },
      { name: 'Sophie Laurent', role: 'CTO', company: 'AgriVision Tech', text: 'Their crop disease detection model processes drone imagery in real-time and identifies 15 types of crop diseases with 91% accuracy. The MLOps pipeline retrains monthly with new field data. Truly transformative for precision agriculture.' },
    ],
  },

  // ─── 9. Digital Transformation Consulting ─────────────────────────────
  {
    slug: 'digital-transformation-consulting',
    name: 'Digital Transformation Consulting',
    icon: 'Compass',
    color: '#EC4899',
    gradientFrom: '#EC4899',
    gradientTo: '#DB2777',
    description:
      'Strategic consulting and hands-on execution to modernize your organization — from AI strategy and process reengineering to technology architecture and governance.',
    services: [
      {
        id: 'cat9-svc1',
        name: 'Get a Roadmap for AI — Not Guesswork, a Real Strategy',
        slug: 'ai-strategy',
        shortDesc:
          'Develop a comprehensive AI strategy aligned with your business goals — identify high-impact use cases, build roadmaps, and establish AI centers of excellence.',
        icon: 'Target',
        color: '#EC4899',
      },
      {
        id: 'cat9-svc2',
        name: 'Re-Architect Your Business for the AI Era — End to End',
        slug: 'digital-transformation',
        shortDesc:
          'End-to-end digital transformation services that modernize operations, digitize customer experiences, and build agile, technology-driven organizations.',
        icon: 'Rocket',
        color: '#EC4899',
      },
      {
        id: 'cat9-svc3',
        name: 'Redesign Your Workflows for the AI Era with Proven Methodology',
        slug: 'process-reengineering',
        shortDesc:
          'Analyze, redesign, and optimize business processes using lean methodologies and AI-driven insights for maximum efficiency and operational excellence.',
        icon: 'Workflow',
        color: '#EC4899',
      },
      {
        id: 'cat9-svc4',
        name: 'Build a Technology Foundation That Lasts for the Next Decade',
        slug: 'technology-architecture',
        shortDesc:
          'Design future-proof technology architectures — microservices, event-driven systems, cloud-native platforms — that scale with your business and support innovation.',
        icon: 'Layout',
        color: '#EC4899',
      },
      {
        id: 'cat9-svc5',
        name: 'Bring Your Tech Stack into Today with IT Modernization',
        slug: 'it-modernization',
        shortDesc:
          'Modernize legacy IT systems with strategic migration plans, cloud adoption roadmaps, and phased modernization approaches that minimize risk and disruption.',
        icon: 'Server',
        color: '#EC4899',
      },
      {
        id: 'cat9-svc6',
        name: "Deploy AI That's Safe, Compliant & Trusted with Proper Governance",
        slug: 'ai-governance',
        shortDesc:
          'Establish AI governance frameworks covering ethical AI, bias detection, model transparency, compliance, and responsible AI practices for trustworthy deployments.',
        icon: 'ShieldCheck',
        color: '#EC4899',
      },
    ],
    keyBenefits: [
      { icon: 'Compass', title: 'Strategic Clarity', desc: 'We cut through technology hype to identify the digital initiatives that deliver maximum business value — aligned with your goals, budget, and organizational readiness.' },
      { icon: 'Layout', title: 'Future-Proof Architecture', desc: 'Technology architectures designed for 5-10 year horizons with microservices, API-first design, and cloud-native patterns that adapt as your business evolves.' },
      { icon: 'Workflow', title: 'Operational Excellence', desc: 'Process reengineering eliminates waste, reduces handoffs, and streamlines workflows — delivering 30-50% efficiency gains while improving quality and employee satisfaction.' },
      { icon: 'ShieldCheck', title: 'Responsible AI Framework', desc: 'Comprehensive AI governance covering bias auditing, explainability, data privacy, regulatory compliance, and ethical guidelines to build trustworthy AI systems.' },
      { icon: 'Users', title: 'Change Management', desc: 'We don\'t just deliver strategy documents — we work alongside your teams to build capabilities, drive adoption, and ensure lasting organizational transformation.' },
      { icon: 'Target', title: 'Measurable Outcomes', desc: 'Every initiative has defined KPIs, success metrics, and milestone checkpoints. We track and report ROI at every phase so you know exactly what value is being delivered.' },
    ],
    industries: ['Banking & Insurance', 'Government & Public Sector', 'Healthcare', 'Manufacturing', 'Retail & Consumer Goods', 'Energy & Utilities'],
    processSteps: [
      { step: 1, title: 'Assessment & Vision', desc: 'We conduct organizational maturity assessments, technology audits, stakeholder interviews, and competitive analysis to define your digital transformation vision and priorities.' },
      { step: 2, title: 'Roadmap & Strategy', desc: 'We create phased transformation roadmaps with business cases, technology selections, resource plans, risk assessments, and quick-win identification for early momentum.' },
      { step: 3, title: 'Execution & Delivery', desc: 'We work embedded with your teams to execute the roadmap — from architecture implementation and vendor selection to process redesign and capability building.' },
      { step: 4, title: 'Sustain & Evolve', desc: 'We establish centers of excellence, train internal teams, set up governance frameworks, and define continuous improvement processes for long-term digital maturity.' },
    ],
    techStack: ['TOGAF Framework', 'ArchiMate', 'Lean / Six Sigma', 'Cloud Strategy', 'Microservices Patterns', 'SAFe Agile', 'ITIL 4', 'COBIT'],
    stats: [
      { value: '50+', label: 'Transformations Led' },
      { value: '45%', label: 'Efficiency Gains' },
      { value: '3x', label: 'Faster Time-to-Market' },
      { value: '$2B+', label: 'Client Value Created' },
    ],
    faqs: [
      { q: 'How long does a digital transformation initiative typically take?', a: 'Transformation timelines vary by scope. A targeted AI strategy engagement takes 4-6 weeks. A department-level digital transformation takes 3-6 months. Enterprise-wide transformation typically spans 12-24 months in phased approaches. We always start with quick wins that deliver value in 4-8 weeks while building toward the long-term vision.' },
      { q: 'Do you only provide strategy consulting or do you also implement?', a: 'We do both — and that is what makes us different. We don\'t hand off a 100-page strategy document and disappear. Our consultants are also hands-on practitioners who architect, build, and deploy alongside your teams. This strategy-to-execution approach ensures vision actually becomes reality.' },
      { q: 'How do you handle organizational change management during transformation?', a: 'Change management is embedded in everything we do. We use the ADKAR framework, conduct stakeholder mapping, run adoption workshops, create champions networks within your organization, and measure adoption metrics. Technology changes nothing if people don\'t adopt it — we ensure they do.' },
      { q: 'What makes your AI governance framework different?', a: 'Our AI governance framework goes beyond compliance checklists. We implement practical tools — bias detection dashboards, model explainability reports, automated audit trails, and risk scoring — that your teams actually use daily. We align with EU AI Act, NIST AI RMF, and industry-specific regulations while keeping governance lightweight and actionable.' },
    ],
    testimonials: [
      { name: 'Rajiv Kapoor', role: 'CEO', company: 'Legacy National Bank', text: 'JOBSONN guided our 18-month digital transformation that touched every department. They helped us move from 40-year-old mainframes to a cloud-native microservices platform. Customer onboarding went from 2 weeks to 15 minutes. Revenue grew 28% in the first year post-transformation.' },
      { name: 'Maria Gonzalez', role: 'CIO', company: 'Metro Health System', text: 'Their AI governance framework was exactly what we needed to deploy clinical AI tools safely. The bias auditing tools and explainability dashboards gave our medical board the confidence to approve 5 AI diagnostic tools that now serve 200K+ patients.' },
      { name: 'Prakash Iyer', role: 'COO', company: 'Heavy Industries Ltd.', text: 'The process reengineering engagement identified $8M in annual savings from operational waste. JOBSONN\'s consultants worked on the shop floor with our teams to redesign workflows. Employee satisfaction improved 40% because we eliminated the frustrating parts of their jobs.' },
    ],
  },
];

// ==================== HELPER FUNCTIONS ====================

/** Returns all 9 service categories */
export function getAllCategories(): ServiceCategory[] {
  return serviceCategories;
}

/** Returns a single category by its slug */
export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((cat) => cat.slug === slug);
}

/** Returns a specific service within a category */
export function getServiceBySlug(
  categorySlug: string,
  serviceSlug: string
): ServiceItem | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.services.find((svc) => svc.slug === serviceSlug);
}

/** Returns related categories (excluding current) */
export function getRelatedCategories(currentSlug: string, limit = 4): ServiceCategory[] {
  return serviceCategories.filter((c) => c.slug !== currentSlug).slice(0, limit);
}

/** Search all services across all categories */
export function searchAllServices(query: string) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: { service: ServiceItem; category: ServiceCategory }[] = [];
  for (const cat of serviceCategories) {
    for (const svc of cat.services) {
      if (
        svc.name.toLowerCase().includes(q) ||
        svc.shortDesc.toLowerCase().includes(q) ||
        cat.name.toLowerCase().includes(q)
      ) {
        results.push({ service: svc, category: cat });
      }
    }
  }
  return results;
}

/** Search services within a single category */
export function searchCategoryServices(categorySlug: string, query: string) {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat || !query.trim()) return [];
  const q = query.toLowerCase();
  return cat.services.filter(
    (svc) =>
      svc.name.toLowerCase().includes(q) ||
      svc.shortDesc.toLowerCase().includes(q)
  );
}
