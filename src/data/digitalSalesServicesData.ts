
// ==================== TYPES ====================

export interface DigitalSalesService {
  slug: string;
  viewName: string;
  num: string;
  name: string;
  subtitle: string;
  desc: string;
  icon: string;
  color: string;
  heroTitle: string;
  heroSubtitle: string;
  stats: { value: string; label: string }[];
  overview: string;
  features: { icon: string; title: string; desc: string }[];
  howItWorks: { step: number; title: string; desc: string }[];
  benefits: { icon: string; title: string; desc: string }[];
  deliverables: { title: string; desc: string }[];
  whoIsFor: { title: string; desc: string; points: string[] }[];
  process: { phase: string; title: string; items: string[] }[];
  techTools: string[];
  successMetrics: { metric: string; desc: string; value: string }[];
  industries: string[];
  testimonials: { name: string; role: string; company: string; text: string }[];
  compareBeforeAfter: { before: string; after: string }[];
  relatedServices: string[];
  ctaTitle: string;
  ctaDesc: string;
}

// ==================== DATA ====================

export const digitalSalesServices: DigitalSalesService[] = [
  // ─── 1. AI Market Research & Customer Intelligence ─────────────────────
  {
    slug: 'ai-market-research-customer-intelligence',
    viewName: 'ds-ai-market-research',
    num: '01',
    name: 'AI Market Research & Customer Intelligence',
    subtitle: 'Market research, competitor intelligence, ICP, buyer personas, customer insights',
    desc: 'Leverage AI to uncover deep market insights, map competitors, and build data-driven buyer personas.',
    icon: 'BarChart3',
    color: '#7C3AED',
    heroTitle: 'Unlock Market Intelligence with AI-Powered Research',
    heroSubtitle: 'Transform raw market data into actionable business intelligence. Our AI engine continuously analyzes competitor moves, customer behaviour, and industry trends so you can make confident, data-backed decisions.',
    stats: [
      { value: '10x', label: 'Faster Research Cycles' },
      { value: '200+', label: 'Markets Analysed' },
      { value: '93%', label: 'Insight Accuracy' },
      { value: '45%', label: 'Cost Reduction' },
    ],
    overview: 'Our AI Market Research & Customer Intelligence service replaces weeks of manual research with hours of automated, deep analysis. We deploy proprietary AI models that scrape, aggregate, and synthesise data from thousands of sources—industry reports, social media, review platforms, job postings, patent filings, and more—to build a 360-degree view of your market landscape. From defining your Ideal Customer Profile (ICP) and crafting detailed buyer personas to tracking competitor positioning and identifying whitespace opportunities, we deliver intelligence that directly feeds your go-to-market strategy. Every insight is validated, sourced, and presented in actionable frameworks your team can act on immediately.',
    features: [
      { icon: 'Search', title: 'AI-Powered Market Scanning', desc: 'Continuously monitor thousands of data sources including news, social media, forums, job boards, and industry databases to detect emerging trends, threats, and opportunities in real time.' },
      { icon: 'Users', title: 'Ideal Customer Profile (ICP) Builder', desc: 'Use machine learning on your CRM data and market signals to define and refine your ideal customer profile with firmographic, technographic, and behavioural attributes.' },
      { icon: 'Brain', title: 'Buyer Persona Generation', desc: 'AI constructs multi-dimensional buyer personas including pain points, decision criteria, buying triggers, preferred channels, and objection patterns based on real market data.' },
      { icon: 'Eye', title: 'Competitor Intelligence Dashboard', desc: 'Real-time tracking of competitor pricing, product launches, marketing campaigns, hiring patterns, and customer sentiment with automated alerts and comparative analysis.' },
      { icon: 'BarChart3', title: 'TAM/SAM/SOM Analysis', desc: 'AI-driven market sizing that combines public data, industry reports, and proprietary models to calculate Total Addressable Market, Serviceable Addressable Market, and Serviceable Obtainable Market.' },
      { icon: 'TrendingUp', title: 'Voice of Customer Analytics', desc: 'Aggregate and analyse customer feedback from reviews, support tickets, surveys, and social media to extract sentiment trends, feature requests, and satisfaction drivers.' },
    ],
    howItWorks: [
      { step: 1, title: 'Discovery & Scoping', desc: 'We align on your business objectives, target markets, competitive landscape, and the specific intelligence gaps you need to fill. We define KPIs and delivery timelines.' },
      { step: 2, title: 'Data Source Mapping', desc: 'Our team identifies and connects to the most relevant data sources—paid databases, public records, social APIs, scraping targets, and your internal CRM data.' },
      { step: 3, title: 'AI Model Training & Analysis', desc: 'We configure and run our AI research pipelines: NLP models for sentiment analysis, clustering algorithms for segment discovery, and predictive models for trend forecasting.' },
      { step: 4, title: 'Insight Synthesis & Validation', desc: 'Raw outputs are synthesised into structured intelligence. Every insight is cross-validated against multiple sources and reviewed by our analyst team for accuracy.' },
      { step: 5, title: 'Delivery & Ongoing Monitoring', desc: 'You receive comprehensive reports, interactive dashboards, and actionable recommendations. We set up continuous monitoring with automated alerts for market shifts.' },
    ],
    benefits: [
      { icon: 'Zap', title: '10x Faster Insights', desc: 'What used to take weeks of manual research now takes hours. AI automates data collection, cleaning, and analysis so your team can focus on strategy.' },
      { icon: 'Target', title: 'Laser-Focused Targeting', desc: 'Data-driven ICPs and buyer personas eliminate guesswork from your marketing and sales targeting, improving conversion rates across all channels.' },
      { icon: 'Shield', title: 'Competitive Advantage', desc: 'Stay ahead of competitor moves with real-time intelligence. Never be blindsided by a competitor launch, pricing change, or market shift again.' },
      { icon: 'TrendingUp', title: 'Data-Backed Decisions', desc: 'Replace gut-feel decisions with evidence-based strategy. Every recommendation comes with supporting data, confidence scores, and source citations.' },
      { icon: 'Award', title: 'Reduced Research Costs', desc: 'Cut your market research spend by up to 45% while getting broader, deeper, and more current intelligence than traditional agencies provide.' },
      { icon: 'Eye', title: 'Continuous Intelligence', desc: 'Unlike one-off research reports, our AI systems provide ongoing monitoring and alerts, so your market intelligence is always current and actionable.' },
    ],
    deliverables: [
      { title: 'Market Landscape Report', desc: 'A comprehensive 40+ page report covering market size, growth trends, key players, regulatory environment, and technology adoption patterns.' },
      { title: 'Competitor Intelligence Dashboard', desc: 'An interactive dashboard tracking 10-20 competitors with automated updates on pricing, positioning, marketing activity, and customer sentiment.' },
      { title: 'Buyer Persona Playbook', desc: 'Detailed persona documents for 3-5 buyer types including demographics, psychographics, pain points, buying journey maps, and messaging recommendations.' },
      { title: 'ICP Scoring Model', desc: 'A machine-learning model that scores and ranks accounts based on fit, intent, and likelihood to convert, ready for CRM integration.' },
      { title: 'Opportunity Heatmap', desc: 'Visual representation of market whitespace, underserved segments, and high-potential verticals prioritised by revenue potential.' },
    ],
    whoIsFor: [
      {
        title: 'B2B SaaS Companies',
        desc: 'SaaS companies needing deep market understanding to refine positioning, identify expansion verticals, and build product-market fit.',
        points: ['Launching a new product or feature', 'Entering a new geographic market', 'Losing deals to competitors', 'Need to validate product-market fit'],
      },
      {
        title: 'Marketing & RevOps Leaders',
        desc: 'Marketing and revenue operations leaders who need data-driven buyer intelligence to improve campaign targeting and pipeline quality.',
        points: ['High cost-per-lead with low conversion', 'Lack of clarity on ideal customer attributes', 'Struggling to personalise campaigns at scale', 'Need to align marketing and sales on ICP'],
      },
      {
        title: 'Investors & PE Firms',
        desc: 'Investment firms conducting due diligence on market opportunities, competitive landscapes, and growth potential for portfolio companies.',
        points: ['Evaluating a potential investment', 'Assessing market size and growth', 'Benchmarking portfolio company performance', 'Identifying acquisition targets'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Intelligence Briefing', items: ['Stakeholder interviews to understand objectives', 'Define research scope, markets, and competitors', 'Identify key intelligence questions', 'Agree on KPIs, timelines, and deliverables'] },
      { phase: 'Phase 2', title: 'Data Acquisition & Processing', items: ['Connect to 50+ data sources and APIs', 'Deploy web scrapers for competitor monitoring', 'Integrate internal CRM and analytics data', 'Clean, normalise, and enrich datasets'] },
      { phase: 'Phase 3', title: 'AI Analysis & Modelling', items: ['Run NLP sentiment analysis on customer feedback', 'Build clustering models for segment discovery', 'Forecast market trends using time-series models', 'Generate competitor benchmarking matrices'] },
      { phase: 'Phase 4', title: 'Insight Delivery & Activation', items: ['Synthesise findings into executive summaries', 'Build interactive dashboards and visualisations', 'Present findings and recommendations to stakeholders', 'Set up continuous monitoring and alert systems'] },
    ],
    techTools: ['Python', 'OpenAI GPT-4', 'Scrapy', 'Selenium', 'Tableau', 'Google BigQuery', 'SEMrush', 'Crunchbase', 'LinkedIn Sales Navigator', 'Snowflake'],
    successMetrics: [
      { metric: 'Research Speed', desc: 'Time from brief to actionable insights', value: '10x Faster' },
      { metric: 'Data Coverage', desc: 'Number of sources analysed per project', value: '500+ Sources' },
      { metric: 'Prediction Accuracy', desc: 'Accuracy of trend forecasts after 90 days', value: '93%' },
      { metric: 'Cost Savings', desc: 'Reduction vs traditional research agencies', value: '45%' },
    ],
    industries: ['SaaS & Technology', 'Financial Services', 'Healthcare & Life Sciences', 'Manufacturing & Industrial', 'Retail & E-Commerce', 'Professional Services'],
    testimonials: [
      { name: 'Priya Sharma', role: 'VP of Marketing', company: 'CloudSync Technologies', text: 'The AI market research completely transformed our go-to-market strategy. We identified three underserved segments that now account for 40% of our pipeline. The competitor intelligence dashboard alone is worth 10x what we paid.' },
      { name: 'Michael Chen', role: 'Head of Revenue Operations', company: 'FinEdge Solutions', text: 'We went from guessing our ICP to having a data-driven scoring model that increased our win rate by 28%. The buyer personas are incredibly detailed and our sales team actually uses them.' },
      { name: 'Sarah Mitchell', role: 'Managing Director', company: 'Apex Ventures', text: 'As a PE firm, we needed rapid market intelligence for due diligence. This team delivered in 3 days what our traditional research partners took 6 weeks to provide. The depth and accuracy were outstanding.' },
    ],
    compareBeforeAfter: [
      { before: 'Spent 4-6 weeks on manual market research with outdated reports', after: 'Get comprehensive, real-time intelligence in 2-3 business days' },
      { before: 'Relied on gut feeling to define target customers', after: 'Data-driven ICP with ML-powered fit scoring integrated into CRM' },
      { before: 'Competitor analysis was a quarterly PowerPoint that was stale by the time it was done', after: 'Live competitor dashboard with automated alerts on pricing, launches, and sentiment shifts' },
      { before: 'Buyer personas were based on assumptions and a few customer interviews', after: 'AI-generated personas built from thousands of real data points across reviews, social, and CRM' },
      { before: 'No visibility into market trends until quarterly business reviews', after: 'Continuous trend monitoring with predictive alerts delivered to your inbox weekly' },
    ],
    relatedServices: ['ds-ai-lead-generation', 'ds-ai-abm', 'ds-ai-paid-advertising'],
    ctaTitle: 'Ready to Turn Market Data into Revenue?',
    ctaDesc: 'Stop guessing and start knowing. Get AI-powered market intelligence that gives your team the competitive edge they need to close more deals, faster.',
  },

  // ─── 2. AI Lead Generation & Prospecting ───────────────────────────────
  {
    slug: 'ai-lead-generation-prospecting',
    viewName: 'ds-ai-lead-generation',
    num: '02',
    name: 'AI Lead Generation & Prospecting',
    subtitle: 'B2B prospect discovery, target-account research, lead lists, prospect qualification',
    desc: 'AI-driven prospect discovery and qualification that fills your pipeline with high-intent, high-fit leads.',
    icon: 'Target',
    color: '#0099FF',
    heroTitle: 'Fill Your Pipeline with AI-Qualified, High-Intent Leads',
    heroSubtitle: 'Stop wasting time on low-quality leads. Our AI prospecting engine identifies, qualifies, and enriches your ideal prospects at scale—so your sales team only talks to buyers who are ready to engage.',
    stats: [
      { value: '5x', label: 'More Qualified Leads' },
      { value: '68%', label: 'Higher Conversion Rate' },
      { value: '150K+', label: 'Leads Generated' },
      { value: '3.5x', label: 'ROI on Lead Spend' },
    ],
    overview: 'Our AI Lead Generation & Prospecting service combines advanced machine learning with multi-source data enrichment to identify and qualify prospects that match your Ideal Customer Profile. We go beyond basic contact lists—our AI evaluates intent signals, firmographic data, technographic profiles, and behavioural patterns to score and prioritise leads. The result is a continuously refreshed pipeline of high-fit, high-intent prospects, complete with enriched contact data, buying signals, and personalised talking points. Whether you need account-based prospecting for enterprise deals or high-volume lead generation for SaaS trials, our AI adapts to your business model and scales with your growth.',
    features: [
      { icon: 'Search', title: 'AI Prospect Discovery Engine', desc: 'Machine learning models scan millions of company profiles, job postings, funding events, and technology signals to discover prospects that match your ICP with high precision.' },
      { icon: 'Cpu', title: 'Multi-Source Data Enrichment', desc: 'Every prospect is enriched with 50+ data points including company size, revenue, tech stack, recent news, funding rounds, org chart data, and contact details.' },
      { icon: 'TrendingUp', title: 'Intent Signal Detection', desc: 'AI monitors web behaviour, content consumption, social activity, and buying signals to identify prospects actively researching solutions like yours.' },
      { icon: 'BarChart3', title: 'Lead Scoring & Prioritisation', desc: 'Proprietary scoring model combines fit, intent, engagement, and timing signals to rank every prospect so your sales team knows exactly who to call first.' },
      { icon: 'Users', title: 'Account Research Automation', desc: 'AI automatically researches each target account—key decision-makers, org structure, pain points, current tech stack, and recent events—to arm your reps with context.' },
      { icon: 'Zap', title: 'CRM Auto-Integration', desc: 'Qualified leads flow directly into your CRM (Salesforce, HubSpot, Pipedrive) with full enrichment data, activity history, and suggested next actions.' },
    ],
    howItWorks: [
      { step: 1, title: 'ICP & Criteria Definition', desc: 'We work with you to define your ideal customer profile, qualifying criteria, target industries, company sizes, and geographic focus areas.' },
      { step: 2, title: 'AI Model Configuration', desc: 'Our team configures the prospecting AI with your ICP parameters, data sources, enrichment rules, and scoring thresholds.' },
      { step: 3, title: 'Prospect Discovery & Enrichment', desc: 'The AI engine scans millions of records, identifies matching prospects, enriches them with 50+ data attributes, and applies intent scoring.' },
      { step: 4, title: 'Quality Assurance & Verification', desc: 'Every lead undergoes email verification, phone validation, duplicate checking, and manual QA sampling to ensure data quality above 95%.' },
      { step: 5, title: 'Delivery & Continuous Generation', desc: 'Leads are delivered to your CRM in batches or via real-time webhooks. The AI continuously discovers new prospects and updates existing records.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Scale Without Scaling Headcount', desc: 'Generate thousands of qualified leads without hiring a team of SDRs. Our AI does the heavy lifting of discovery, research, and enrichment at a fraction of the cost.' },
      { icon: 'Target', title: 'Higher Lead Quality', desc: 'AI scoring ensures only high-fit, high-intent leads reach your sales team. Average conversion rates increase by 68% compared to traditional prospecting lists.' },
      { icon: 'TrendingUp', title: 'Shorter Sales Cycles', desc: 'Enriched prospect data and intent signals mean your reps have better conversations faster. Average deal velocity improves by 35%.' },
      { icon: 'Eye', title: 'Real-Time Pipeline Visibility', desc: 'See your pipeline grow in real time with dashboards showing lead quality distribution, source performance, and conversion funnel metrics.' },
      { icon: 'Award', title: 'Lower Cost Per Acquisition', desc: 'Reduce your CAC by targeting the right prospects from day one. AI-qualified leads convert at 3-5x the rate of cold lists.' },
      { icon: 'Shield', title: 'GDPR & Compliance Built In', desc: 'Every lead is sourced and processed with full compliance to GDPR, CCPA, and CAN-SPAM regulations. Consent signals are tracked and documented.' },
    ],
    deliverables: [
      { title: 'Qualified Lead Database', desc: 'A continuously refreshed database of prospects matching your ICP, complete with contact details, company data, and qualification scores.' },
      { title: 'Lead Scoring Model', desc: 'A custom AI lead scoring model trained on your historical win/loss data, deployed and integrated into your CRM for real-time scoring.' },
      { title: 'Account Research Briefs', desc: 'For each target account, a one-page research brief covering key contacts, pain points, tech stack, recent events, and suggested conversation openers.' },
      { title: 'Intent Signal Reports', desc: 'Weekly reports highlighting prospects showing active buying intent, ranked by signal strength and recency.' },
      { title: 'Pipeline Analytics Dashboard', desc: 'A live dashboard tracking lead volume, quality scores, conversion rates, and ROI across all prospecting channels and campaigns.' },
    ],
    whoIsFor: [
      {
        title: 'B2B Sales Teams',
        desc: 'Sales organisations that need a consistent flow of qualified leads to keep their pipeline healthy and reps productive.',
        points: ['SDRs spending too much time on research', 'Pipeline is inconsistent month to month', 'Low conversion rates on cold outreach', 'Reps lack context before prospect calls'],
      },
      {
        title: 'SaaS & Technology Companies',
        desc: 'High-growth SaaS companies needing to rapidly scale their prospecting without proportionally scaling their sales headcount.',
        points: ['Need to accelerate pipeline growth', 'Entering new markets or verticals', 'High volume of low-ACV deals', 'Freemium-to-paid conversion optimisation'],
      },
      {
        title: 'Marketing Agencies',
        desc: 'Agencies running lead generation campaigns for clients who need a reliable, scalable source of qualified B2B leads.',
        points: ['Clients demand higher lead quality', 'Need white-label lead generation', 'Scaling multiple client campaigns', 'Proving ROI on lead gen spend'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Strategy & ICP Alignment', items: ['Workshop to define ICP and qualification criteria', 'Audit existing lead sources and quality', 'Set target metrics and SLAs', 'Map data sources and integration points'] },
      { phase: 'Phase 2', title: 'AI Engine Setup', items: ['Configure prospecting AI with ICP parameters', 'Set up data enrichment pipelines', 'Build custom lead scoring model', 'Integrate with CRM and marketing tools'] },
      { phase: 'Phase 3', title: 'Prospecting & Qualification', items: ['Run AI discovery across target segments', 'Enrich and score all identified prospects', 'Verify contact data and remove duplicates', 'Deliver initial batch of qualified leads'] },
      { phase: 'Phase 4', title: 'Optimisation & Scale', items: ['Analyse lead-to-opportunity conversion data', 'Refine scoring model based on feedback', 'Expand to additional segments or geographies', 'Set up continuous lead generation workflows'] },
    ],
    techTools: ['Apollo.io', 'Clay', 'OpenAI GPT-4', 'Salesforce', 'HubSpot', 'Clearbit', 'ZoomInfo', 'PhantomBuster', 'Airtable', 'Make (Integromat)'],
    successMetrics: [
      { metric: 'Lead Volume', desc: 'Average qualified leads generated per month', value: '500+' },
      { metric: 'Data Accuracy', desc: 'Email and contact validity rate', value: '97%' },
      { metric: 'Conversion Lift', desc: 'Improvement in lead-to-opportunity rate', value: '68%' },
      { metric: 'Cost Per Lead', desc: 'Average cost per qualified lead', value: '70% Less' },
    ],
    industries: ['SaaS & Technology', 'Financial Services', 'Cybersecurity', 'Healthcare IT', 'Manufacturing', 'Professional Services'],
    testimonials: [
      { name: 'David Park', role: 'Head of Sales', company: 'NexaPay', text: 'We went from 200 leads per month to over 1,200 qualified leads, and our conversion rate doubled. The AI scoring is scarily accurate—our top-scored leads close at 4x the rate of average leads.' },
      { name: 'Aisha Rahman', role: 'VP of Growth', company: 'TalentBridge AI', text: 'The prospecting engine replaced two full-time SDRs and delivers better results at a third of the cost. The account research briefs save our AEs hours of prep time every week.' },
      { name: 'James O\'Brien', role: 'Founder & CEO', company: 'GrowthStack Agency', text: 'We use this for 15 client accounts and the quality is consistently outstanding. The intent signals are a game-changer—our clients love getting leads who are actively looking for solutions.' },
    ],
    compareBeforeAfter: [
      { before: 'SDRs spent 70% of their time researching and only 30% selling', after: 'AI handles research and enrichment; SDRs focus 90% of time on actual selling' },
      { before: 'Purchased lead lists had 30-40% invalid or outdated contacts', after: 'AI-verified leads with 97%+ data accuracy and real-time enrichment' },
      { before: 'No way to prioritise which leads to call first', after: 'Every lead has a predictive score ranking fit, intent, and timing' },
      { before: 'Pipeline was inconsistent—feast or famine every quarter', after: 'Steady, predictable flow of qualified leads with monthly reporting and forecasting' },
      { before: 'Prospecting scaled linearly with headcount—expensive and slow', after: 'AI scales lead generation exponentially without adding headcount' },
    ],
    relatedServices: ['ds-ai-market-research', 'ds-ai-outbound-sales', 'ds-ai-abm'],
    ctaTitle: 'Stop Chasing Bad Leads. Start Closing Deals.',
    ctaDesc: 'Our AI prospecting engine fills your pipeline with qualified, high-intent leads that actually convert. Get started with a free pilot today.',
  },

  // ─── 3. AI Outbound Sales & Outreach ────────────────────────────────────
  {
    slug: 'ai-outbound-sales-outreach',
    viewName: 'ds-ai-outbound-sales',
    num: '03',
    name: 'AI Outbound Sales & Outreach',
    subtitle: 'Personalized LinkedIn, cold outreach, sales messaging, multi-channel engagement',
    desc: 'Deploy AI-powered, hyper-personalised outreach across email, LinkedIn, and phone to book more meetings with less effort.',
    icon: 'Send',
    color: '#10B981',
    heroTitle: 'Book More Meetings with AI-Personalized Outreach at Scale',
    heroSubtitle: 'Generic templates are dead. Our AI crafts hyper-personalised messages for every prospect based on their profile, company news, and buying signals—driving 5-10x higher reply rates across email, LinkedIn, and multi-channel sequences.',
    stats: [
      { value: '8x', label: 'Higher Reply Rates' },
      { value: '300%', label: 'Meeting Book Rate Uplift' },
      { value: '50K+', label: 'Meetings Booked' },
      { value: '60%', label: 'Reduction in Sales Cycle' },
    ],
    overview: 'Our AI Outbound Sales & Outreach service replaces generic cold outreach with intelligent, data-driven messaging that resonates with each individual prospect. Using AI, we analyse every prospect\'s professional background, company news, social activity, and tech stack to craft messages that feel genuinely personal. We design and execute multi-channel sequences spanning LinkedIn (connection requests, InMails, profile views), email (cold, warm, follow-up), and even phone scripts. Every message is A/B tested, every sequence is optimised based on performance data, and every interaction feeds back into our AI to improve future outreach. The result is dramatically higher engagement rates, more meetings booked, and a sales pipeline that converts.',
    features: [
      { icon: 'Brain', title: 'AI Message Personalisation', desc: 'GPT-4 powered engine generates unique, contextually relevant messages for each prospect by analysing their LinkedIn profile, recent company news, social posts, and mutual connections.' },
      { icon: 'Globe', title: 'Multi-Channel Sequencing', desc: 'Orchestrate outreach across LinkedIn, email, phone, and Twitter in automated sequences with smart delays, channel switches, and escalation triggers based on engagement.' },
      { icon: 'BarChart3', title: 'A/B Testing Engine', desc: 'Continuously test subject lines, opening hooks, CTAs, send times, and channel combinations to optimise reply rates with statistical significance.' },
      { icon: 'Target', title: 'Smart Follow-Up Logic', desc: 'AI determines the optimal follow-up timing, channel, and message based on prospect behaviour—opens, clicks, profile views, and response patterns.' },
      { icon: 'Users', title: 'LinkedIn Automation Suite', desc: 'Automated LinkedIn workflows including profile views, connection requests, personalised InMails, and engagement with prospect content to warm up leads before outreach.' },
      { icon: 'Zap', title: 'Meeting Booking Integration', desc: 'Direct integration with Calendly, Cal.com, and your calendar to auto-book meetings when prospects express interest—eliminating the back-and-forth.' },
    ],
    howItWorks: [
      { step: 1, title: 'Messaging Strategy & Playbook', desc: 'We develop your outbound messaging framework: value propositions, pain point narratives, objection handling, and channel-specific templates tailored to your ICP.' },
      { step: 2, title: 'AI Training & Calibration', desc: 'Our AI studies your best-performing emails, call recordings, and win/loss data to learn your voice, value props, and what resonates with your buyers.' },
      { step: 3, title: 'Sequence Design & Launch', desc: 'Multi-step sequences are designed across email, LinkedIn, and phone with personalisation variables, A/B tests, and smart routing logic.' },
      { step: 4, title: 'Execution & Optimisation', desc: 'Outreach campaigns run daily with real-time monitoring. AI adjusts messaging, timing, and channel mix based on performance data.' },
      { step: 5, title: 'Reporting & Iteration', desc: 'Weekly performance reports with reply rates, meeting bookings, pipeline contribution, and actionable recommendations for continuous improvement.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Dramatically Higher Reply Rates', desc: 'AI-personalised messages get 5-10x more replies than generic templates because they speak directly to each prospect\'s situation and pain points.' },
      { icon: 'TrendingUp', title: 'Scale Without Losing Personal Touch', desc: 'Send thousands of truly personalised messages that feel 1:1 crafted. AI scales personalisation to a level no human team could match manually.' },
      { icon: 'Target', title: 'More Meetings, Less Effort', desc: 'Automated sequences handle the heavy lifting of follow-ups and channel switching. Your reps only step in when a prospect is engaged and ready.' },
      { icon: 'Eye', title: 'Data-Driven Optimisation', desc: 'Every element is tested and optimised—subject lines, send times, channel order, message length—so your outreach continuously improves.' },
      { icon: 'Award', title: 'Consistent Pipeline Generation', desc: 'Turn outbound into a predictable, reliable pipeline source. Know exactly how many meetings you\'ll book per month based on outreach volume.' },
      { icon: 'Shield', title: 'Reputation & Compliance Protection', desc: 'Smart sending limits, warm-up protocols, and compliance checks protect your domain reputation and keep you within platform guidelines.' },
    ],
    deliverables: [
      { title: 'Outbound Messaging Playbook', desc: 'A comprehensive playbook covering value propositions, messaging frameworks, objection handling, and channel-specific best practices for your ICP.' },
      { title: 'Multi-Channel Sequence Library', desc: '10-15 tested outreach sequences spanning email, LinkedIn, and phone, each with personalisation rules, A/B variants, and escalation logic.' },
      { title: 'Meeting Booking Dashboard', desc: 'Real-time dashboard tracking outreach volume, reply rates, positive responses, meetings booked, and pipeline value generated.' },
      { title: 'Weekly Performance Reports', desc: 'Detailed weekly reports with open rates, reply rates, meeting conversion, top-performing messages, and optimisation recommendations.' },
      { title: 'Prospect Response Analytics', desc: 'Analysis of all prospect responses—objections, questions, interest signals—to refine messaging and inform sales coaching.' },
    ],
    whoIsFor: [
      {
        title: 'B2B Sales Teams',
        desc: 'Inside sales and SDR teams that need to book more qualified meetings through outbound prospecting at scale.',
        points: ['SDRs struggling to get replies to cold emails', 'Meeting booking targets consistently missed', 'Generic templates getting poor results', 'Need to scale outbound without hiring more SDRs'],
      },
      {
        title: 'B2B Founders & CEOs',
        desc: 'Founders who need to generate early pipeline and validate their market before building a full sales team.',
        points: ['Need to validate product-market fit', 'Building initial sales pipeline', 'Limited budget for a large sales team', 'Want to personally connect with prospects but at scale'],
      },
      {
        title: 'Revenue Leaders',
        desc: 'VPs and CROs looking to add a predictable, scalable outbound motion to complement inbound and other acquisition channels.',
        points: ['Over-reliance on inbound leads', 'Need to diversify pipeline sources', 'Want predictable meeting volume', 'Scaling from $1M to $10M ARR'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Strategy & Playbook Development', items: ['Analyse current outbound performance and win/loss data', 'Define value propositions and messaging pillars', 'Map buyer pain points and objections', 'Create channel-specific messaging frameworks'] },
      { phase: 'Phase 2', title: 'AI Configuration & Sequence Design', items: ['Train AI on your best-performing outreach messages', 'Design multi-channel cadence sequences', 'Set up A/B testing matrix', 'Configure personalisation data sources'] },
      { phase: 'Phase 3', title: 'Campaign Execution', items: ['Launch initial outreach campaigns', 'Monitor deliverability and engagement', 'Manage domain warm-up and sender reputation', 'Execute smart follow-up sequences'] },
      { phase: 'Phase 4', title: 'Optimisation & Scale', items: ['Analyse performance data and iterate on messaging', 'Optimize send times, channels, and sequences', 'Expand to new segments or territories', 'Refine AI models based on response data'] },
    ],
    techTools: ['Lemlist', 'Instantly', 'LinkedIn Sales Navigator', 'Clay', 'OpenAI GPT-4', 'HubSpot', 'Salesforce', 'Apollo.io', 'Calendly', 'Smartlead'],
    successMetrics: [
      { metric: 'Reply Rate', desc: 'Average positive reply rate across campaigns', value: '12-18%' },
      { metric: 'Meetings Booked', desc: 'Average meetings booked per month per campaign', value: '50+' },
      { metric: 'Meeting Show Rate', desc: 'Percentage of booked meetings that show up', value: '85%' },
      { metric: 'Pipeline Generated', desc: 'Average pipeline value created per month', value: '3-5x ROI' },
    ],
    industries: ['SaaS & Technology', 'Financial Services', 'Professional Services', 'Cybersecurity', 'Healthcare IT', 'Marketing & Advertising'],
    testimonials: [
      { name: 'Alex Torres', role: 'Sales Director', company: 'DataVault Solutions', text: 'Our reply rate went from 2% to 14% in the first month. The AI personalisation is incredible—prospects actually think our SDRs spent hours researching them. We booked 3x more meetings with the same team size.' },
      { name: 'Emily Watson', role: 'Founder & CEO', company: 'Streamline HR', text: 'As a founder, I needed to generate pipeline fast. This team set up my entire outbound motion in 2 weeks. I\'m now booking 15+ qualified meetings per week and my pipeline has never been healthier.' },
      { name: 'Raj Krishnamurthy', role: 'CRO', company: 'FinServe Technologies', text: 'We added outbound as our third pipeline channel and within 3 months it was contributing 35% of our total pipeline. The AI optimisation continuously improves results—we keep getting better every month.' },
    ],
    compareBeforeAfter: [
      { before: 'SDRs copied and pasted templates with minor name changes', after: 'Every message is uniquely crafted by AI based on prospect\'s profile, news, and signals' },
      { before: '2% reply rate on cold emails—most messages went unread', after: '12-18% reply rate with AI-optimised subject lines, timing, and personalisation' },
      { before: 'Follow-ups were inconsistent—some prospects got 2 touches, others got 10', after: 'Smart sequences with optimal touch frequency, channel switching, and escalation logic' },
      { before: 'No way to know which messages worked—just gut feel', after: 'A/B testing on every element with statistical significance tracking and performance dashboards' },
      { before: 'LinkedIn outreach was manual and limited to 50 connections per day', after: 'Automated LinkedIn sequences with AI-personalised connection requests, InMails, and profile engagement' },
    ],
    relatedServices: ['ds-ai-lead-generation', 'ds-ai-abm', 'ds-ai-sales-enablement'],
    ctaTitle: 'Turn Cold Outreach into Hot Conversations',
    ctaDesc: 'AI-personalised outreach that books 5-10x more meetings than generic templates. Start your free pilot and see the difference in 2 weeks.',
  },

  // ─── 4. AI Account-Based Marketing (ABM) ───────────────────────────────
  {
    slug: 'ai-account-based-marketing',
    viewName: 'ds-ai-abm',
    num: '04',
    name: 'AI Account-Based Marketing (ABM)',
    subtitle: 'Target-account campaigns, account intelligence, personalized marketing, sales alignment',
    desc: 'AI-driven ABM that aligns marketing and sales around high-value target accounts with personalised campaigns at scale.',
    icon: 'Layers',
    color: '#F97316',
    heroTitle: 'Win More Enterprise Deals with AI-Powered ABM',
    heroSubtitle: 'Align marketing and sales around your highest-value accounts. Our AI delivers deep account intelligence, personalised multi-threaded campaigns, and real-time buying committee tracking to accelerate enterprise deal closure.',
    stats: [
      { value: '3.5x', label: 'Pipeline Increase' },
      { value: '85%', label: 'Sales-Marketing Alignment' },
      { value: '200+', label: 'ABM Campaigns Run' },
      { value: '42%', label: 'Larger Average Deal Size' },
    ],
    overview: 'Our AI Account-Based Marketing service transforms how you approach your most valuable opportunities. Instead of casting a wide net, we use AI to identify, prioritise, and engage specific high-value accounts with hyper-personalised campaigns. Our AI builds comprehensive account profiles covering every member of the buying committee, maps the political landscape, tracks engagement signals across your entire digital footprint, and orchestrates coordinated multi-channel campaigns that feel 1:1 to every stakeholder. Marketing and sales operate from a single source of truth, with AI-driven insights informing every touchpoint. The result is faster deal progression, larger deal sizes, and dramatically higher win rates on your enterprise opportunities.',
    features: [
      { icon: 'Search', title: 'AI Account Selection & Prioritisation', desc: 'Machine learning models analyse your CRM data, market signals, and firmographic attributes to score and rank accounts by revenue potential, fit, and likelihood to buy.' },
      { icon: 'Users', title: 'Buying Committee Mapping', desc: 'AI identifies and profiles every decision-maker, influencer, champion, and blocker within target accounts—complete with org charts, reporting lines, and relationship maps.' },
      { icon: 'Brain', title: 'Personalised Account Campaigns', desc: 'AI generates unique content, messaging, and creative assets tailored to each account\'s industry, challenges, tech stack, and strategic priorities.' },
      { icon: 'Eye', title: 'Account Engagement Tracking', desc: 'Unified tracking across all channels—website visits, email opens, content downloads, event attendance, social engagement—mapped to individual buying committee members.' },
      { icon: 'BarChart3', title: 'Sales-Marketing Alignment Platform', desc: 'Shared dashboards, account plans, and real-time alerts ensure marketing and sales are perfectly synchronised on every target account.' },
      { icon: 'TrendingUp', title: 'Predictive Deal Scoring', desc: 'AI models predict deal probability, expected close date, and optimal next actions based on engagement patterns, historical win data, and market conditions.' },
    ],
    howItWorks: [
      { step: 1, title: 'Account Strategy & Tiering', desc: 'We work with your leadership to define ABM strategy, tier accounts (1:1, 1:Few, 1:Many), set engagement goals, and assign account teams.' },
      { step: 2, title: 'Account Intelligence & Mapping', desc: 'AI builds comprehensive profiles for each target account: company data, buying committee, org charts, pain points, tech stack, and competitive presence.' },
      { step: 3, title: 'Campaign Creation & Launch', desc: 'Personalised campaigns are designed for each account tier with custom content, multi-channel sequences, and coordinated sales and marketing actions.' },
      { step: 4, title: 'Execution & Engagement Tracking', desc: 'Campaigns go live across all channels. AI tracks engagement at the account and individual level, providing real-time intent signals to the sales team.' },
      { step: 5, title: 'Optimisation & Expansion', desc: 'Performance is analysed, campaigns are optimised, successful patterns are scaled, and underperforming accounts are re-evaluated or retargeted.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Larger Deal Sizes', desc: 'ABM drives 42% larger average deal sizes by engaging multiple stakeholders and building consensus across the buying committee from the start.' },
      { icon: 'Target', title: 'Higher Win Rates', desc: 'Personalised, multi-threaded engagement increases win rates by 30-50% on enterprise deals compared to traditional sales approaches.' },
      { icon: 'Users', title: 'Sales-Marketing Alignment', desc: 'Shared account intelligence, coordinated campaigns, and unified metrics eliminate the silos that derail enterprise deals.' },
      { icon: 'TrendingUp', title: 'Shorter Enterprise Sales Cycles', desc: 'AI-driven engagement tracking and predictive deal scoring help you identify bottlenecks and accelerate deal progression.' },
      { icon: 'Eye', title: 'Account-Level Insights', desc: 'Understand exactly how each account is engaging, which stakeholders are warm, and what content is resonating—enabling precision follow-ups.' },
      { icon: 'Award', title: 'Measurable ABM ROI', desc: 'Clear attribution from campaign touchpoints to pipeline and revenue, so you can prove ABM\'s impact on your top-line growth.' },
    ],
    deliverables: [
      { title: 'ABM Strategy Document', desc: 'A comprehensive strategy covering account tiering criteria, engagement goals, channel mix, content strategy, and measurement framework.' },
      { title: 'Account Intelligence Dossiers', desc: 'Detailed dossiers for each target account including buying committee maps, org charts, pain points, competitive landscape, and engagement recommendations.' },
      { title: 'Personalised Campaign Assets', desc: 'Custom content for each account tier: landing pages, email sequences, LinkedIn content, direct mail concepts, and sales enablement materials.' },
      { title: 'ABM Performance Dashboard', desc: 'Real-time dashboard tracking account engagement scores, campaign performance, pipeline progression, and revenue attribution by account.' },
      { title: 'Monthly ABM Review Reports', desc: 'Detailed monthly analysis of account engagement trends, campaign effectiveness, pipeline impact, and strategic recommendations.' },
    ],
    whoIsFor: [
      {
        title: 'Enterprise B2B Companies',
        desc: 'Companies with average deal sizes above $50K that need to close fewer but larger, more strategic deals.',
        points: ['Long sales cycles (3-12 months)', 'Multiple stakeholders in every deal', 'High-value, low-volume sales motion', 'Complex products requiring education'],
      },
      {
        title: 'SaaS Companies Scaling Up-Market',
        desc: 'SaaS companies transitioning from SMB/mid-market to enterprise sales that need a new go-to-market approach.',
        points: ['Moving upmarket to larger deals', 'Need to build enterprise sales muscle', 'Current outbound isn\'t working for enterprise', 'Deal sizes stagnating at mid-market levels'],
      },
      {
        title: 'Sales & Marketing Leaders',
        desc: 'CMOs, CROs, and VPs who need to align their teams around a shared account strategy and demonstrate measurable pipeline impact.',
        points: ['Sales and marketing operating in silos', 'Difficulty proving marketing\'s impact on revenue', 'Enterprise pipeline is unpredictable', 'Need better account-level visibility'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'ABM Strategy & Account Selection', items: ['Workshop with sales and marketing leadership', 'Define ICP criteria for account selection', 'Analyze CRM for lookalike account patterns', 'Tier accounts into 1:1, 1:Few, and 1:Many'] },
      { phase: 'Phase 2', title: 'Account Intelligence & Planning', items: ['Build comprehensive account profiles', 'Map buying committees and decision dynamics', 'Identify account-specific pain points and triggers', 'Create account engagement plans for each tier'] },
      { phase: 'Phase 3', title: 'Campaign Design & Execution', items: ['Develop personalised content and messaging', 'Design multi-channel campaign sequences', 'Launch coordinated sales and marketing actions', 'Enable sales team with account-specific playbooks'] },
      { phase: 'Phase 4', title: 'Measure, Optimise & Scale', items: ['Track account engagement and pipeline progression', 'Optimise campaigns based on performance data', 'Scale successful patterns across more accounts', 'Refine account selection model with learnings'] },
    ],
    techTools: ['Demandbase', '6sense', 'Terminus', 'HubSpot', 'Salesforce', 'Clay', 'OpenAI GPT-4', 'LinkedIn Campaign Manager', 'Clearbit', 'Bombora'],
    successMetrics: [
      { metric: 'Pipeline Growth', desc: 'Increase in target account pipeline value', value: '3.5x' },
      { metric: 'Win Rate', desc: 'Improvement in enterprise deal win rate', value: '+38%' },
      { metric: 'Deal Size', desc: 'Increase in average enterprise deal size', value: '+42%' },
      { metric: 'Sales Cycle', desc: 'Reduction in average enterprise sales cycle', value: '-25%' },
    ],
    industries: ['SaaS & Technology', 'Financial Services', 'Cybersecurity', 'Healthcare & Life Sciences', 'Manufacturing', 'Consulting'],
    testimonials: [
      { name: 'Jennifer Liu', role: 'CMO', company: 'CyberShield Enterprise', text: 'ABM transformed our enterprise pipeline. We went from scattered outreach to coordinated campaigns that engage entire buying committees. Our average deal size increased by 55% and win rates are up 40%.' },
      { name: 'Mark Anderson', role: 'CRO', company: 'Apex Cloud Solutions', text: 'For the first time, marketing and sales are truly aligned. The shared account dashboards and AI-driven engagement scores mean our AEs know exactly when and how to engage. Pipeline from target accounts is up 4x.' },
      { name: 'Sneha Patel', role: 'VP of Demand Generation', company: 'HealthTech Pro', text: 'The buying committee mapping alone was a revelation. We discovered influencers we never knew existed and tailored our messaging accordingly. Three of our largest deals this quarter came directly from ABM campaigns.' },
    ],
    compareBeforeAfter: [
      { before: 'Marketing generated leads without knowing which accounts mattered most', after: 'AI identifies and prioritises high-value accounts; all campaigns are account-targeted' },
      { before: 'Sales and marketing had different views of account engagement', after: 'Unified account dashboards with real-time engagement scores visible to both teams' },
      { before: 'One SDR per account with limited bandwidth for multi-threading', after: 'AI identifies and maps the entire buying committee; campaigns engage all stakeholders' },
      { before: 'Content was generic and didn\'t resonate with specific accounts', after: 'Every piece of content is personalised to the account\'s industry, challenges, and priorities' },
      { before: 'No way to measure marketing\'s impact on enterprise deals', after: 'Full attribution from campaign touchpoints to pipeline and closed revenue by account' },
    ],
    relatedServices: ['ds-ai-market-research', 'ds-ai-lead-generation', 'ds-ai-sales-enablement'],
    ctaTitle: 'Turn Target Accounts into Closed Deals',
    ctaDesc: 'Align your teams, personalise at scale, and accelerate your biggest deals with AI-powered ABM. Start with a strategy session today.',
  },

  // ─── 5. AI Paid Advertising & Campaign Strategy ────────────────────────
  {
    slug: 'ai-paid-advertising-campaign-strategy',
    viewName: 'ds-ai-paid-advertising',
    num: '05',
    name: 'AI Paid Advertising & Campaign Strategy',
    subtitle: 'Google/Meta/LinkedIn advertising, campaign planning, audience targeting, optimization',
    desc: 'AI-optimised paid advertising across Google, Meta, and LinkedIn that maximises ROI through intelligent targeting, creative testing, and budget allocation.',
    icon: 'Megaphone',
    color: '#EF4444',
    heroTitle: 'Maximise Ad ROI with AI-Optimised Campaigns',
    heroSubtitle: 'Stop wasting ad spend on the wrong audiences. Our AI manages and optimises your Google, Meta, and LinkedIn campaigns in real time—testing creatives, adjusting bids, and reallocating budgets to maximise every dollar.',
    stats: [
      { value: '4.2x', label: 'Average ROAS' },
      { value: '52%', label: 'Lower CPA' },
      { value: '$50M+', label: 'Ad Spend Managed' },
      { value: '180%', label: 'Improvement in CTR' },
    ],
    overview: 'Our AI Paid Advertising & Campaign Strategy service takes the guesswork out of paid media. We combine AI-powered audience targeting, automated creative testing, real-time bid optimisation, and intelligent budget allocation to maximise the return on every advertising dollar. Whether you\'re running Google Ads (Search, Display, YouTube), Meta Ads (Facebook, Instagram), or LinkedIn Ads, our AI continuously analyses performance data, identifies winning patterns, and makes thousands of micro-optimisations per day that no human team could replicate. From campaign strategy and audience research to creative production and ongoing optimisation, we manage the full lifecycle of your paid advertising to deliver measurable pipeline and revenue impact.',
    features: [
      { icon: 'Target', title: 'AI Audience Targeting & Segmentation', desc: 'Machine learning identifies your highest-converting audience segments by analysing demographics, behaviour, interests, and lookalike patterns across platforms.' },
      { icon: 'Cpu', title: 'Real-Time Bid Optimisation', desc: 'AI algorithms adjust bids every few minutes based on conversion probability, competition, time of day, and device to maximise ROI within your budget.' },
      { icon: 'Eye', title: 'Automated Creative Testing', desc: 'AI generates, tests, and optimises ad creatives—including headlines, images, videos, and CTAs—at scale to find winning combinations.' },
      { icon: 'BarChart3', title: 'Intelligent Budget Allocation', desc: 'AI dynamically shifts budget across campaigns, ad sets, and platforms based on real-time performance to maximise overall ROAS.' },
      { icon: 'Brain', title: 'AI Ad Copy Generation', desc: 'GPT-powered copywriting generates dozens of ad variations optimised for each platform, audience segment, and campaign objective.' },
      { icon: 'TrendingUp', title: 'Cross-Platform Attribution', desc: 'Unified tracking and attribution across Google, Meta, LinkedIn, and other channels so you can see the true impact of your ad spend on pipeline and revenue.' },
    ],
    howItWorks: [
      { step: 1, title: 'Strategy & Audience Research', desc: 'We audit your current ad accounts, research your audience, analyse competitors\' ad strategies, and define campaign objectives, KPIs, and budget allocation.' },
      { step: 2, title: 'Campaign Architecture & Setup', desc: 'Campaign structures are built across platforms with AI-optimised targeting, audience segments, bid strategies, tracking, and conversion goals.' },
      { step: 3, title: 'Creative Production & Launch', desc: 'AI generates ad copy variations, we produce or optimise creative assets, and campaigns go live with comprehensive tracking and attribution.' },
      { step: 4, title: 'AI Optimisation & Scaling', desc: 'AI continuously optimises bids, budgets, audiences, and creatives. Winning combinations are scaled; underperformers are paused or restructured.' },
      { step: 5, title: 'Reporting & Strategic Reviews', desc: 'Detailed weekly and monthly reports with performance analysis, insights, and strategic recommendations. Regular reviews align ad strategy with business goals.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Maximised ROAS', desc: 'AI optimisation delivers 3-5x better ROAS than manual campaign management by making thousands of micro-optimisations every day.' },
      { icon: 'Target', title: 'Lower Cost Per Acquisition', desc: 'Intelligent bidding and budget allocation reduce your CPA by 40-60% while maintaining or increasing lead volume and quality.' },
      { icon: 'TrendingUp', title: 'Scalable Growth', desc: 'AI identifies the optimal budget level and scaling pace for each campaign so you can grow ad spend profitably without hitting diminishing returns.' },
      { icon: 'Eye', title: 'Data-Driven Creative Decisions', desc: 'Stop debating ad creative in meetings. AI tests systematically and lets the data decide which creatives, copy, and CTAs perform best.' },
      { icon: 'Award', title: 'Full-Funnel Strategy', desc: 'Coordinated campaigns across awareness, consideration, and conversion stages ensure prospects are nurtured through the entire buyer journey.' },
      { icon: 'Shield', title: 'Fraud Detection & Brand Safety', desc: 'AI monitors for click fraud, invalid traffic, and brand safety violations, protecting your budget and reputation.' },
    ],
    deliverables: [
      { title: 'Paid Media Strategy Document', desc: 'A comprehensive strategy covering channel mix, audience targeting, budget allocation, campaign structure, and success metrics.' },
      { title: 'Campaign Architecture Setup', desc: 'Fully built and configured campaigns across Google, Meta, and/or LinkedIn with tracking, conversion goals, and bid strategies.' },
      { title: 'Ad Creative Library', desc: 'A library of AI-generated and human-reviewed ad creatives including copy variations, image ads, and video concepts for each campaign.' },
      { title: 'Performance Analytics Dashboard', desc: 'Real-time dashboard tracking spend, impressions, clicks, conversions, CPA, ROAS, and pipeline impact across all campaigns.' },
      { title: 'Monthly Performance & Strategy Report', desc: 'Detailed monthly report with performance analysis, optimisation actions taken, competitive insights, and next-month strategy recommendations.' },
    ],
    whoIsFor: [
      {
        title: 'B2B Companies',
        desc: 'B2B companies running Google, LinkedIn, or Meta ads that want to improve lead quality and reduce cost per acquisition.',
        points: ['High CPA with low lead quality', 'Ads not generating qualified pipeline', 'Lack of time or expertise to optimise campaigns', 'Need to prove marketing\'s revenue contribution'],
      },
      {
        title: 'D2C & E-Commerce Brands',
        desc: 'Direct-to-consumer brands that need to maximise ROAS on Meta and Google ads to drive profitable revenue growth.',
        points: ['Scaling ad spend but ROAS is declining', 'Creative fatigue and ad performance dropping', 'Need better audience targeting and segmentation', 'Struggling with attribution across channels'],
      },
      {
        title: 'Growth & Marketing Leaders',
        desc: 'CMOs and growth leaders who need a data-driven paid media partner that delivers measurable business outcomes, not just vanity metrics.',
        points: ['Current agency not delivering results', 'Need AI-powered optimisation', 'Want transparent reporting and attribution', 'Looking to scale paid acquisition profitably'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Audit & Strategy', items: ['Comprehensive audit of existing ad accounts', 'Competitor ad analysis and benchmarking', 'Define campaign objectives, KPIs, and budgets', 'Develop channel strategy and audience plan'] },
      { phase: 'Phase 2', title: 'Build & Launch', items: ['Set up campaign architecture and tracking', 'Configure audience segments and targeting', 'Produce and test ad creatives', 'Launch campaigns with AI bid strategies'] },
      { phase: 'Phase 3', title: 'Optimise & Scale', items: ['AI-driven bid and budget optimisation', 'Systematic creative A/B testing', 'Audience expansion and refinement', 'Cross-platform budget reallocation'] },
      { phase: 'Phase 4', title: 'Report & Iterate', items: ['Weekly performance monitoring and adjustments', 'Monthly strategic review and reporting', 'Competitive landscape updates', 'Quarterly strategy refresh and planning'] },
    ],
    techTools: ['Google Ads', 'Meta Business Suite', 'LinkedIn Campaign Manager', 'Google Analytics 4', 'TripleWhale', 'Optmyzr', 'AdCreative.ai', 'OpenAI GPT-4', 'Segment', 'Looker Studio'],
    successMetrics: [
      { metric: 'ROAS', desc: 'Average return on ad spend across campaigns', value: '4.2x' },
      { metric: 'CPA Reduction', desc: 'Average reduction in cost per acquisition', value: '52%' },
      { metric: 'CTR Improvement', desc: 'Average click-through rate improvement', value: '180%' },
      { metric: 'Pipeline Attribution', desc: 'Revenue attributed to paid campaigns', value: '35% of Total' },
    ],
    industries: ['SaaS & Technology', 'E-Commerce & Retail', 'Financial Services', 'Education & EdTech', 'Healthcare', 'Real Estate'],
    testimonials: [
      { name: 'Lisa Chang', role: 'VP of Marketing', company: 'ShopEase Commerce', text: 'Our ROAS went from 1.8x to 5.2x in just 3 months. The AI optimisation catches opportunities we would never have spotted manually. Best ad investment we\'ve ever made.' },
      { name: 'Tom Richards', role: 'Head of Demand Gen', company: 'SaaSPro Technologies', text: 'We were burning $80K/month on ads with mediocre results. This team restructured everything, and now we\'re getting 3x the leads at 40% less cost. The weekly optimisation reports are incredibly detailed.' },
      { name: 'Priya Nair', role: 'CMO', company: 'EduNext Learning', text: 'The cross-platform attribution was a game-changer. We finally understand which channels actually drive enrollments, not just clicks. We shifted 30% of our budget based on their recommendations and saw an immediate uplift.' },
    ],
    compareBeforeAfter: [
      { before: 'Manual bid management with daily budgets and basic rules', after: 'AI adjusts bids every few minutes based on conversion probability and competition' },
      { before: 'A/B tested 2-3 ad variations per month manually', after: 'AI tests dozens of creative and copy combinations simultaneously across platforms' },
      { before: 'Budget was allocated based on last month\'s performance', after: 'AI reallocates budget in real-time to the best-performing campaigns and audiences' },
      { before: 'Measured success by impressions, clicks, and CPC', after: 'Full-funnel attribution from ad click to pipeline and closed revenue' },
      { before: 'Scaling ad spend meant declining ROAS', after: 'AI identifies the optimal scaling pace to grow spend while maintaining or improving ROAS' },
    ],
    relatedServices: ['ds-ai-lead-generation', 'ds-ai-outbound-sales', 'ds-ai-market-research'],
    ctaTitle: 'Stop Wasting Ad Spend. Start Maximising Revenue.',
    ctaDesc: 'AI-optimised campaigns that deliver 3-5x better ROAS. Get a free ad account audit and see how much you\'re leaving on the table.',
  },

  // ─── 6. AI Sales Enablement & Revenue Intelligence ─────────────────────
  {
    slug: 'ai-sales-enablement-revenue-intelligence',
    viewName: 'ds-ai-sales-enablement',
    num: '06',
    name: 'AI Sales Enablement & Revenue Intelligence',
    subtitle: 'Sales playbooks, pitch materials, competitive intelligence, call insights, revenue reporting',
    desc: 'AI-powered sales enablement that equips your team with the right content, insights, and intelligence to close more deals.',
    icon: 'TrendingUp',
    color: '#D4A017',
    heroTitle: 'Equip Your Sales Team to Close More Deals',
    heroSubtitle: 'AI-powered sales enablement that delivers the right content, competitive intelligence, call insights, and revenue analytics exactly when your reps need them—turning every interaction into a closing opportunity.',
    stats: [
      { value: '29%', label: 'Win Rate Increase' },
      { value: '40%', label: 'Faster Ramp Time',
      },
      { value: '500+', label: 'Sales Plays Delivered' },
      { value: '3.8x', label: 'Content Utilisation' },
    ],
    overview: 'Our AI Sales Enablement & Revenue Intelligence service transforms your sales organisation from intuition-driven to intelligence-driven. We build AI-powered systems that deliver the right content, competitive battle cards, and customer insights to your reps at exactly the right moment in the deal cycle. Our AI analyses sales calls to extract key insights, objections, and coaching opportunities. It tracks competitive mentions and market positioning in real time. And it provides revenue intelligence—pipeline analytics, forecast accuracy, deal risk scoring, and rep performance insights—that help leaders make data-backed decisions. From onboarding new reps 40% faster to giving seasoned veterans the edge they need to close enterprise deals, our AI sales enablement platform makes every seller more effective.',
    features: [
      { icon: 'BookOpen', title: 'AI Content Recommendations', desc: 'Context-aware engine recommends the perfect sales content—case studies, pitch decks, one-pagers, ROI calculators—based on deal stage, industry, and prospect profile.' },
      { icon: 'Brain', title: 'Sales Call Intelligence', desc: 'AI transcribes and analyses every sales call to extract key topics, competitor mentions, objections, sentiment, and coaching opportunities with automatic CRM logging.' },
      { icon: 'Shield', title: 'Competitive Battle Cards', desc: 'Dynamic battle cards that update in real time with competitive intelligence—positioning, pricing, recent news, win/loss patterns, and recommended talk tracks.' },
      { icon: 'BarChart3', title: 'Revenue Intelligence Dashboard', desc: 'Executive dashboard with pipeline health, forecast accuracy, deal velocity, rep performance, and AI-powered risk scoring for every open opportunity.' },
      { icon: 'Target', title: 'Deal Coaching & Next Steps', desc: 'AI analyses deal patterns and suggests next best actions, identifies stalled deals, recommends coaching interventions, and flags at-risk opportunities.' },
      { icon: 'Zap', title: 'Sales Playbook Automation', desc: 'AI maintains and evolves your sales playbooks based on real-time win/loss data, ensuring your team always follows the most effective selling motions.' },
    ],
    howItWorks: [
      { step: 1, title: 'Sales Process Audit', desc: 'We audit your current sales process, content library, tech stack, and team capabilities to identify gaps and opportunities for AI-powered enablement.' },
      { step: 2, title: 'Platform & Content Setup', desc: 'We configure the sales enablement platform, import and organise your content library, build battle card templates, and set up call intelligence integrations.' },
      { step: 3, title: 'AI Model Training', desc: 'Our AI analyses your historical calls, emails, win/loss data, and deal patterns to build predictive models and recommendation engines.' },
      { step: 4, title: 'Team Enablement & Launch', desc: 'We train your sales team on the new tools, content, and processes. Playbooks are deployed, dashboards go live, and the AI starts delivering insights.' },
      { step: 5, title: 'Optimisation & Evolution', desc: 'Continuous analysis of usage data, deal outcomes, and rep feedback to refine content, update battle cards, improve recommendations, and expand capabilities.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Higher Win Rates', desc: 'AI-guided selling with the right content and insights at the right time increases win rates by 25-35% across the team.' },
      { icon: 'Users', title: 'Faster Rep Ramp-Up', desc: 'New reps become productive 40% faster with AI-curated content, automated playbooks, and intelligent coaching from day one.' },
      { icon: 'TrendingUp', title: 'Better Deal Visibility', desc: 'Revenue intelligence gives leaders real-time visibility into pipeline health, deal risks, and forecast accuracy—no more spreadsheet guessing.' },
      { icon: 'Eye', title: 'Competitive Advantage', desc: 'Dynamic battle cards and real-time competitive intelligence mean your reps always know how to handle competitive situations.' },
      { icon: 'Award', title: 'Data-Driven Coaching', desc: 'AI identifies coaching opportunities from call analysis and deal patterns, so managers focus coaching time where it has the most impact.' },
      { icon: 'Target', title: 'Consistent Execution', desc: 'Automated playbooks and content recommendations ensure every rep follows best practices—raising the floor of your team\'s performance.' },
    ],
    deliverables: [
      { title: 'Sales Enablement Platform', desc: 'A fully configured AI-powered sales enablement platform with content management, recommendations engine, and rep analytics.' },
      { title: 'Sales Playbook Library', desc: '6-10 AI-maintained playbooks covering discovery, demo, proposal, negotiation, and closing for each of your key segments.' },
      { title: 'Competitive Battle Card Set', desc: 'Dynamic battle cards for your top 8-12 competitors with positioning, strengths/weaknesses, objection handling, and win strategies.' },
      { title: 'Revenue Intelligence Dashboard', desc: 'Executive dashboard with pipeline analytics, forecast accuracy, deal risk scores, rep performance, and AI-generated recommendations.' },
      { title: 'Call Intelligence & Coaching Reports', desc: 'Weekly coaching reports summarising call insights, rep performance trends, common objections, and skill development opportunities.' },
    ],
    whoIsFor: [
      {
        title: 'Sales Leaders & Enablement Teams',
        desc: 'VPs of Sales, CROs, and sales enablement managers who need to equip their teams with the right tools and content to win more deals.',
        points: ['Win rates are stagnant or declining', 'New reps take too long to ramp', 'Sales content is underutilised', 'Need better pipeline visibility and forecasting'],
      },
      {
        title: 'Fast-Growing Companies',
        desc: 'Companies rapidly scaling their sales teams that need systems and processes to maintain quality and consistency at scale.',
        points: ['Scaling from 10 to 50+ reps', 'Onboarding new reps is slow and inconsistent', 'Need to maintain quality as team grows', 'Lack of standardised sales processes'],
      },
      {
        title: 'Enterprise Sales Organisations',
        desc: 'Complex enterprise sales teams that deal with long cycles, multiple stakeholders, and intense competition.',
        points: ['Complex enterprise deals with many stakeholders', 'Competitive losses due to poor positioning', 'Inconsistent deal execution across reps', 'Need better forecasting and pipeline management'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Assessment & Strategy', items: ['Audit current sales process and content', 'Interview sales reps and managers', 'Map the buyer journey and content gaps', 'Define enablement objectives and KPIs'] },
      { phase: 'Phase 2', title: 'Platform & Content Build', items: ['Configure sales enablement platform', 'Organise and tag content library', 'Build competitive battle cards', 'Create sales playbooks for key scenarios'] },
      { phase: 'Phase 3', title: 'AI Training & Integration', items: ['Train AI on historical call and deal data', 'Set up call intelligence integrations', 'Build revenue intelligence dashboards', 'Configure content recommendation engine'] },
      { phase: 'Phase 4', title: 'Launch & Continuous Improvement', items: ['Train sales team on platform and playbooks', 'Launch with change management support', 'Monitor adoption and measure impact', 'Continuously refine based on data and feedback'] },
    ],
    techTools: ['Gong', 'Salesloft', 'Highspot', 'Seismic', 'Clari', 'OpenAI GPT-4', 'Salesforce', 'HubSpot', 'Notion', 'Looker'],
    successMetrics: [
      { metric: 'Win Rate', desc: 'Improvement in overall sales win rate', value: '+29%' },
      { metric: 'Ramp Time', desc: 'Reduction in new rep ramp-up time', value: '40% Faster' },
      { metric: 'Content Utilisation', desc: 'Increase in sales content usage by reps', value: '3.8x' },
      { metric: 'Forecast Accuracy', desc: 'Improvement in revenue forecast accuracy', value: '+35%' },
    ],
    industries: ['SaaS & Technology', 'Financial Services', 'Professional Services', 'Healthcare', 'Manufacturing', 'Cybersecurity'],
    testimonials: [
      { name: 'Robert Kim', role: 'CRO', company: 'TechVenture Solutions', text: 'The revenue intelligence dashboard alone transformed how we manage our pipeline. We can now see deal risks weeks before they materialise. Our forecast accuracy went from 65% to 92%.' },
      { name: 'Amanda Foster', role: 'VP of Sales Enablement', company: 'DataPrime Analytics', text: 'New rep ramp time dropped from 6 months to 3.5 months. The AI content recommendations mean reps always have the right materials at the right time. Content utilisation went from 15% to 58%.' },
      { name: 'Vikram Singh', role: 'Sales Director', company: 'SecureNet Global', text: 'The competitive battle cards are a lifesaver. In our last 5 competitive deals, our reps knew exactly how to position against the incumbent. We won 4 out of 5—a 300% improvement over our historical competitive win rate.' },
    ],
    compareBeforeAfter: [
      { before: 'Reps spent 30% of their time searching for the right content', after: 'AI recommends the perfect content based on deal context—reps find it in seconds' },
      { before: 'Sales calls were a black box—managers relied on rep self-reporting', after: 'AI transcribes and analyses every call, extracting insights, objections, and coaching opportunities' },
      { before: 'Competitive battle cards were static PDFs that were months out of date', after: 'Dynamic battle cards update automatically with latest competitive intelligence and win/loss data' },
      { before: 'Forecasting was done in spreadsheets with 60-70% accuracy', after: 'AI-powered revenue intelligence delivers 90%+ forecast accuracy with deal-level risk scoring' },
      { before: 'New reps took 6+ months to become fully productive', after: 'AI-curated onboarding and content reduce ramp time to 3-4 months' },
    ],
    relatedServices: ['ds-ai-outbound-sales', 'ds-ai-abm', 'ds-ai-market-research'],
    ctaTitle: 'Turn Your Sales Team into a Revenue Machine',
    ctaDesc: 'AI-powered enablement that helps every rep sell like your best rep. Get started with a sales process audit and see the ROI in 30 days.',
  },
];

// ==================== LOOKUP ====================

export function getDigitalSalesService(viewName: string): DigitalSalesService | undefined {
  return digitalSalesServices.find((s) => s.viewName === viewName);
}
