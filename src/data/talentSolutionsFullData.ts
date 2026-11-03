// ============================================================
// TALENT SOLUTIONS FULL DATA — Extracted directly from jobsonn.com
// Contains 100% comprehensive data for every option in the Talent
// dropdown: Train to Hire, Hire to Train, Corporate Training, etc.
// ============================================================

export interface MetricItem {
  value: string;
  label: string;
  desc?: string;
}

export interface WhyItWinsItem {
  title: string;
  desc: string;
  iconName?: string;
}

export interface AudienceTrack {
  tag: string;
  title: string;
  desc: string;
  points: string[];
  ctaText: string;
}

export interface ProcessStepItem {
  step: string;
  title: string;
  desc: string;
}

export interface BenefitItem {
  title: string;
  desc: string;
}

export interface UseCaseItem {
  scenario: string;
  solution: string;
  metrics: { label: string; value: string }[];
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FullTalentSolution {
  solutionKey: string;
  label: string;
  badge: string;
  heroHeadline: string;
  heroSubheadline: string;
  slaNotice: string;
  heroStats: MetricItem[];
  whyItWins: WhyItWinsItem[];
  bothSides: {
    employers: AudienceTrack;
    candidates: AudienceTrack;
  };
  processSteps: ProcessStepItem[];
  benefits: BenefitItem[];
  useCases: UseCaseItem[];
  testimonials: TestimonialItem[];
  deliverables: string[];
  faqs: FAQItem[];
}

export const TALENT_SOLUTIONS_FULL_DATA: Record<string, FullTalentSolution> = {
  "talent-train-to-hire": {
    solutionKey: "talent-train-to-hire",
    label: "Train to Hire",
    badge: "Training + Placement",
    heroHeadline: "Train to Hire — trained on your exact stack",
    heroSubheadline: "We co-design the training syllabus with your tech leads — your tools, your conventions, your workflows — so graduates join as contributors, not beginners.",
    slaNotice: "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.",
    heroStats: [
      { value: "8–12 wks", label: "Ready-to-join", desc: "Intake to contribution" },
      { value: "96%", label: "12-mo Retention", desc: "Industry-leading retention" },
      { value: "2M+", label: "Candidate pool", desc: "Pre-screened talent" },
      { value: "90 days", label: "Replacement SLA", desc: "Guaranteed replacement" },
    ],
    whyItWins: [
      {
        title: "Role profile workshops",
        desc: "Every plan starts from role profile workshops — so outcomes stay predictable and scope never drifts silently.",
      },
      {
        title: "Stack-specific modules",
        desc: "You get stack-specific modules as a standing part of the workflow, with named owners and weekly checkpoints from day one.",
      },
      {
        title: "Client checkpoint reviews",
        desc: "Client checkpoint reviews is engineered into every train to Hire engagement — owned, measured and reported, not bolted on afterwards.",
      },
    ],
    bothSides: {
      employers: {
        tag: "HIRING PARTNER",
        title: "Talent shaped around your stack",
        desc: "Stop paying for skills you don't need and missing the ones you do. Co-design a customized training curriculum with your technical leaders and build a talent pipeline aligned with your business requirements.",
        points: [
          "Curriculum co-designed with your technical team.",
          "Practical projects based on your workflows.",
          "Candidate assessment and skill verification.",
          "Customized cohorts based on hiring requirements.",
        ],
        ctaText: "Scope Your First Cohort",
      },
      candidates: {
        tag: "CANDIDATE TRACK",
        title: "A career runway, not just a course",
        desc: "Build practical skills through structured training, hands-on projects, mentorship, and career preparation aligned with employer requirements.",
        points: [
          "Structured, role-specific training.",
          "Hands-on projects and portfolio development.",
          "Skill assessments and progress tracking.",
          "Career guidance and employer-aligned preparation.",
        ],
        ctaText: "Apply to the Program",
      },
    },
    processSteps: [
      { step: "01", title: "Requirement workshop", desc: "We sit with your hiring managers to map role specs, must-have skills, and project archetypes." },
      { step: "02", title: "Cohort sourcing", desc: "We recruit fresh graduates from 200+ partner colleges and our 2M+ candidate pool." },
      { step: "03", title: "Screening & selection", desc: "Aptitude, coding fundamentals, and behavioral screens — top 15% selected." },
      { step: "04", title: "Custom training program", desc: "12–16 week intensive curriculum with weekly milestones and project demos." },
      { step: "05", title: "Final assessment", desc: "Your team evaluates capstone projects and conducts fit interviews." },
      { step: "06", title: "Deployment & onboarding", desc: "Selected candidates join your team with structured 30/60/90-day onboarding." },
    ],
    benefits: [
      { title: "Lower cost-per-hire", desc: "Up to 45% reduction vs lateral hiring, with no recruiter commissions or premium salaries." },
      { title: "Culture-fit candidates", desc: "Cohort trained on your values and engineering norms from day one of training." },
      { title: "Predictable pipeline", desc: "Quarterly batch calendar — plan hiring 3–6 months ahead with confidence." },
      { title: "Stack-aligned skills", desc: "No re-skilling gap — candidates ship code in your exact stack from week one." },
      { title: "Higher retention", desc: "Trained-from-scratch engineers stay 2.3× longer than lateral hires at 18 months." },
      { title: "Scalable model", desc: "From 10 to 200+ engineers per year without ballooning recruiting team headcount." },
    ],
    useCases: [
      {
        scenario: "Payments fintech launching a new platform needed 80 backend engineers in 6 months.",
        solution: "Train-to-Hire cohort of 120 graduates trained in Java, Kafka, payments domain, and observability.",
        metrics: [
          { label: "Hires delivered", value: "84" },
          { label: "Time-to-hire", value: "−58%" },
          { label: "1-yr retention", value: "96%" },
        ],
      },
      {
        scenario: "Enterprise SaaS scaling engineering from 200 to 500 in 18 months without inflating recruiter costs.",
        solution: "Two Train-to-Hire cohorts per year — 60 frontend + 60 fullstack engineers — trained in React/Node.",
        metrics: [
          { label: "Cost-per-hire", value: "−42%" },
          { label: "Recruiter headcount", value: "+0" },
          { label: "Ramp time", value: "−30%" },
        ],
      },
      {
        scenario: "BFSI captive needed mainframe and core-banking skills that fresh graduates typically lack.",
        solution: "Custom 16-week program covering Cobol, DB2, and core-banking domain with bank SMEs as guest faculty.",
        metrics: [
          { label: "Cohort size", value: "40" },
          { label: "Deployment rate", value: "88%" },
          { label: "Productivity parity", value: "5 mo" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "JOBSONN's train-to-hire cohort delivered 84 production-ready engineers in 5 months — exactly the domain depth we needed for our payments launch.",
        name: "Rajesh Kumar",
        role: "VP Engineering",
        company: "FinEdge",
        initials: "RK",
      },
      {
        quote: "We scaled engineering from 200 to 480 in 18 months without adding a single recruiter — Train-to-Hire became our primary pipeline.",
        name: "Sneha Iyer",
        role: "Head of Talent",
        company: "CloudPeak SaaS",
        initials: "SI",
      },
    ],
    deliverables: [
      "Co-designed syllabus matching client tech stack and conventions",
      "Bi-weekly cohort progress dashboards with milestone assessments",
      "Production-grade capstone project codebase with code-review history",
      "Individual candidate technical profiles with interview recording links",
      "Full background verification report (education, criminal, identity)",
      "Readiness assessment scorecard signed off by your hiring managers",
      "30-day ramp plan with shared scorecard for tracking early performance",
    ],
    faqs: [
      { q: "How long does the Train to Hire program take?", a: "Standard cohorts run 8 to 16 weeks depending on tech stack complexity. Cloud and fullstack tracks are typically 12 weeks, while specialized domain tracks (e.g. core banking) run 16 weeks." },
      { q: "Who pays for the training?", a: "Training costs are sponsored by the hiring employer or built into a tiered placement fee upon successful deployment. Candidates train free of charge." },
      { q: "What happens if a candidate doesn't meet the bar?", a: "We maintain a 15–20% buffer in every cohort. Only candidates who clear your engineering bar and capstone project are offered for deployment." },
      { q: "What is your replacement warranty?", a: "Every placement is covered by a 90-day free replacement guarantee. If a hire does not perform as expected, we replace them immediately." },
    ],
  },

  "talent-hire-to-train": {
    solutionKey: "talent-hire-to-train",
    label: "Hire to Train",
    badge: "Hire + Upskill",
    heroHeadline: "Hire the attitude — we train the skills on the job",
    heroSubheadline: "Hire promising candidates on aptitude and attitude first, then JOBSONN trains them on the job — your stack, your processes, your standards — into the exact role you need filled.",
    slaNotice: "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.",
    heroStats: [
      { value: "2–3 wks", label: "Offer to onboard", desc: "Fast intake velocity" },
      { value: "82%", label: "Ramp target @ 90 days", desc: "Full team productivity" },
      { value: "45%", label: "Saved vs senior hire", desc: "Optimized hiring cost" },
      { value: "10 days", label: "Median cycle", desc: "Shortlist to offer" },
    ],
    whyItWins: [
      {
        title: "Aptitude over pedigree",
        desc: "Our screens weigh learning velocity, grit and problem-solving — predictors of on-the-job success that CVs can't show.",
      },
      {
        title: "Trained on your real work",
        desc: "No classroom simulations. New hires ramp on live tickets, shadowing your seniors from week one.",
      },
      {
        title: "Mentors in the loop",
        desc: "Every hire gets a JOBSONN mentor plus a named buddy on your team, with weekly sync baked into the ramp.",
      },
    ],
    bothSides: {
      employers: {
        tag: "HIRING PARTNER",
        title: "Hire for potential. Build skills on the job.",
        desc: "Find promising candidates for your open roles, then build their skills through structured on-the-job training aligned with your team's real workflows.",
        points: [
          "Structured role-specific training and ramp-up plans",
          "Dedicated mentoring and progress reviews",
          "Skills assessments tied to job requirements",
          "Clear training milestones and performance reporting",
        ],
        ctaText: "Design a Hire-to-Train Plan",
      },
      candidates: {
        tag: "CANDIDATE TRACK",
        title: "Turn your potential into practical skills.",
        desc: "Explore role-aligned learning, practical projects, mentoring, and skills assessments that help you prepare for real job opportunities.",
        points: [
          "Role-focused learning paths",
          "Practical projects and guided feedback",
          "Mentorship and skills assessments",
          "Progress tracking and completion credentials",
        ],
        ctaText: "Explore Candidate Assessment",
      },
    },
    processSteps: [
      { step: "01", title: "Role profile & gap analysis", desc: "We map your must-have foundational aptitudes vs the skills you can train on the job." },
      { step: "02", title: "Aptitude-first sourcing", desc: "We screen candidates on problem-solving, cognitive ability, and learning velocity." },
      { step: "03", title: "Direct offer & hiring", desc: "You hire the candidates directly onto your payroll with confidence in their growth potential." },
      { step: "04", title: "On-the-job training track", desc: "JOBSONN deploys customized technical modules and labs embedded into their work week." },
      { step: "05", title: "Dual mentorship", desc: "Each trainee is paired with a JOBSONN senior engineer mentor and an internal company buddy." },
      { step: "06", title: "90-day milestone sign-off", desc: "Structured reviews at 30, 60, and 90 days ensure candidates reach full autonomy." },
    ],
    benefits: [
      { title: "Expanded candidate pool", desc: "Access 10x more candidates by evaluating learning velocity rather than narrow keyword matches." },
      { title: "Lower compensation inflation", desc: "Hire high-potential talent at market-entry rates and reward them as their skills compound." },
      { title: "Tailored to your codebase", desc: "Engineers learn your architecture, design systems, and CI/CD pipelines from day one." },
      { title: "Reduced senior engineer burnout", desc: "JOBSONN mentors handle early technical onboarding, freeing your senior leads." },
      { title: "Higher loyalty & retention", desc: "Employees whose careers you invest in demonstrate significantly higher company loyalty." },
      { title: "Guaranteed replacement", desc: "If a candidate fails to hit ramp milestones at 60 days, we replace them at no charge." },
    ],
    useCases: [
      {
        scenario: "Fast-growing AI startup needed engineers familiar with LangChain and vector databases.",
        solution: "Hired strong Python/Django developers and ran them through an intensive 4-week generative AI ramp.",
        metrics: [
          { label: "Ramp time", value: "3.5 wks" },
          { label: "Cost vs senior", value: "−52%" },
          { label: "PR velocity", value: "4.8 PRs/wk" },
        ],
      },
      {
        scenario: "Logistics enterprise migrating from monolithic Java to Go microservices.",
        solution: "Hired existing Java team into Go-to-Train cohort with weekly architecture pairing and code audits.",
        metrics: [
          { label: "Engineers transitioned", value: "45" },
          { label: "Zero delivery drop", value: "100%" },
          { label: "Deployment cycle", value: "−40%" },
        ],
      },
      {
        scenario: "Fintech company expanding fraud detection analytics.",
        solution: "Recruited math/physics graduates and trained them on real-time fraud feature engineering.",
        metrics: [
          { label: "Hires deployed", value: "18" },
          { label: "Retention at 1 yr", value: "94%" },
          { label: "Time to productivity", value: "45 days" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "Hire-to-Train allowed us to build an exceptional ML engineering squad in 6 weeks when senior ML engineers were virtually unobtainable.",
        name: "Vikram Malhotra",
        role: "CTO",
        company: "Synthetix AI",
        initials: "VM",
      },
      {
        quote: "The dual mentorship model was key. JOBSONN mentors answered the day-to-day coding questions, while our leads focused on architecture.",
        name: "Ananya Deshmukh",
        role: "Engineering Director",
        company: "OmniLogistics",
        initials: "AD",
      },
    ],
    deliverables: [
      "Custom role capability matrix and syllabus blueprint",
      "Weekly mentor feedback and milestone scorecard",
      "Git commit and code review progression metrics",
      "30-day and 60-day structured performance evaluations",
      "Access to JOBSONN virtual sandbox environments and labs",
      "Final 90-day autonomy audit report signed off by technical leads",
    ],
    faqs: [
      { q: "Can we use our own hires for training?", a: "Yes! Many clients source candidates themselves and use Hire-to-Train as a structured onboarding ramp. We can also source candidates for you if needed." },
      { q: "How is this different from Train to Hire?", a: "In Train to Hire, we recruit the candidates and train them before deployment. In Hire to Train, candidates are already hired (by you or us) — we focus on the live on-the-job upskilling ramp." },
      { q: "Is training hosted at our office?", a: "Yes, training can be at your office, our partner campus, online, or hybrid. We recommend at least partial in-person for the first 2 weeks for culture immersion." },
      { q: "What if a trainee fails the readiness assessment?", a: "We provide extended coaching (1–2 weeks) for borderline cases. If a trainee still doesn't meet the bar, we provide a remediation plan or replace the candidate." },
    ],
  },

  "talent-corporate-training": {
    solutionKey: "talent-corporate-training",
    label: "Corporate Training",
    badge: "Enterprise Training",
    heroHeadline: "Enterprise upskilling at scale: a workforce ready for what's next",
    heroSubheadline: "Custom curricula and cohort programs that upskill hundreds or thousands of existing employees at once — technology, data, AI and leadership tracks with L&D ROI you can actually measure.",
    slaNotice: "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.",
    heroStats: [
      { value: "28,000+", label: "Employees upskilled", desc: "Across cloud, data, AI" },
      { value: "140+", label: "Enterprise cohorts", desc: "50 to 5,000 learners" },
      { value: "3.4x", label: "Median L&D ROI", desc: "First-year return" },
      { value: "92%", label: "Completion rate", desc: "Cohort delivery model" },
    ],
    whyItWins: [
      {
        title: "Strategy-first curricula",
        desc: "Every module ladders up to a business outcome you name — adoption, quality, revenue or risk.",
      },
      {
        title: "Cohorts, not content dumps",
        desc: "Facilitated peer cohorts with live sessions, labs and capstones — the format that finishes.",
      },
      {
        title: "ROI you can defend",
        desc: "Pre/post skill deltas, application tracking and business-KPI linkage in one exec dashboard.",
      },
    ],
    bothSides: {
      employers: {
        tag: "LEARNING STRATEGY",
        title: "Turn Learning into Measurable Business Impact",
        desc: "Design corporate learning programs around your business goals, employee capability gaps, existing tools, and measurable outcomes. Every learning path should connect directly to the work your teams need to deliver.",
        points: [
          "Role-based skill gap analysis",
          "Custom curriculum aligned with business objectives",
          "Before-and-after capability assessments",
          "Manager toolkits and reinforcement plans",
          "Learning effectiveness and ROI reporting",
        ],
        ctaText: "Design a Training Program",
      },
      candidates: {
        tag: "BUSINESS ENABLEMENT",
        title: "Build the Skills Your Business Needs Next",
        desc: "Prepare teams for emerging technologies, changing workflows, and new business priorities with practical, project-based corporate training designed around real operational challenges.",
        points: [
          "Technology and role-specific learning tracks",
          "Practical projects based on business scenarios",
          "Training schedules aligned with delivery commitments",
          "Progress tracking and manager visibility",
          "Executive-ready capability reports",
        ],
        ctaText: "Explore Training Tracks",
      },
    },
    processSteps: [
      { step: "01", title: "Enterprise skills diagnostic", desc: "We run automated skill assessments and manager surveys to pinpoint capability gaps across departments." },
      { step: "02", title: "Bespoke curriculum architecture", desc: "We co-create role tracks, real-world case studies, and lab environments aligned with your quarterly goals." },
      { step: "03", title: "Cohort scheduling & LMS setup", desc: "Seamless SSO integration with your LMS (Cornerstone, Degreed, Workday) and flexible scheduling." },
      { step: "04", title: "Live expert delivery & labs", desc: "Masterclasses led by senior practitioners with guided sandbox coding and architecture sprints." },
      { step: "05", title: "Manager toolkits & capstone", desc: "Trainees build practical artifacts solving real company bottlenecks with manager review." },
      { step: "06", title: "Impact & ROI scorecard", desc: "Comprehensive executive report detailing skill gains, certification rates, and operational impact." },
    ],
    benefits: [
      { title: "3.4x Measured ROI", desc: "Quantifiable returns on productivity, internal mobility, and reduced external consultant spend." },
      { title: "92% Completion rate", desc: "Peer accountability, live facilitator check-ins, and capstone milestones drive real completion." },
      { title: "Customized to your stack", desc: "Labs run in your cloud environment (AWS, Azure, GCP) using your real architectural patterns." },
      { title: "Global delivery scale", desc: "Programs delivered across 18 languages, multiple time zones, and hybrid or virtual formats." },
      { title: "Executive reporting", desc: "Real-time telemetry on participation, skill delta percentiles, and manager satisfaction." },
      { title: "Industry certifications", desc: "Learners prepare for and earn recognized AWS, Google Cloud, Azure, and Kubernetes credentials." },
    ],
    useCases: [
      {
        scenario: "Tier-1 bank needed 1,200 software engineers certified in AWS Cloud and Kubernetes within 9 months.",
        solution: "Enterprise Cloud Academy delivered in rolling cohorts of 100 with hands-on banking simulation labs.",
        metrics: [
          { label: "Engineers certified", value: "1,140" },
          { label: "Completion rate", value: "95%" },
          { label: "Cloud migration time", value: "−4 months" },
        ],
      },
      {
        scenario: "Global retail giant modernizing legacy supply chain systems into event-driven Kafka architecture.",
        solution: "Custom 6-week bootcamp for 350 backend developers featuring live Kafka cluster debugging.",
        metrics: [
          { label: "Microservices shipped", value: "24" },
          { label: "Consultant savings", value: "$1.8M" },
          { label: "Incident rate", value: "−34%" },
        ],
      },
      {
        scenario: "Automotive conglomerate establishing an in-house Autonomous & Connected Vehicle software division.",
        solution: "Comprehensive C++, ROS2, and embedded Linux academy for 200 mechanical/electrical engineers.",
        metrics: [
          { label: "Upskilled to software", value: "185" },
          { label: "Time to first PR", value: "12 days" },
          { label: "Manager rating", value: "4.9/5" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "JOBSONN transformed our cloud upskilling. Rather than endless videos, our engineers built real microservices in simulated sandbox accounts. Outstanding impact.",
        name: "Arun Venkat",
        role: "Chief Learning Officer",
        company: "Standard Chartered Bank",
        initials: "AV",
      },
      {
        quote: "The pre- and post-program assessments gave our executive committee complete confidence in the L&D spend. We proved a 3.8x return in year one.",
        name: "Claire Dupont",
        role: "VP Global Talent Development",
        company: "Carrefour Group",
        initials: "CD",
      },
    ],
    deliverables: [
      "Enterprise Skill Gap diagnostic report with department heatmaps",
      "Custom syllabus and sandbox lab architecture specification",
      "Executive real-time dashboard tracking attendance and skill delta",
      "SCORM-compliant digital learning assets for permanent LMS hosting",
      "Proctored certification exam vouchers and passing certificates",
      "30/60/90-day post-training productivity and application audit",
    ],
    faqs: [
      { q: "What is the minimum and maximum cohort size?", a: "Pilot cohorts start at 15 learners. We routinely deliver enterprise academies for cohorts of 50 to 5,000+ employees simultaneously across regions." },
      { q: "Can you train at our office premises?", a: "Yes! We support onsite delivery at your offices, fully virtual live delivery, or hybrid models with virtual masterclasses and in-person hackathons." },
      { q: "Do you integrate with our corporate LMS?", a: "Yes — we provide SCORM/xAPI-compliant packages and native SSO integration for Workday, Cornerstone, Degreed, SuccessFactors, and Moodle." },
      { q: "How is the return on investment (ROI) measured?", a: "We establish baseline metrics upfront (e.g. cycle time, cloud defects, billable velocity) and track pre- and post-training scores alongside a 90-day manager survey." },
    ],
  },

  "talent-sourcing-recruitment": {
    solutionKey: "talent-sourcing-recruitment",
    label: "Sourcing & Recruitment",
    badge: "Talent Sourcing",
    heroHeadline: "The right candidate already exists — our AI finds them in 48 hours",
    heroSubheadline: "AI-powered sourcing across a 2M+ verified candidate pool surfaces your next hire in days, not months — direct-hire recruitment with shortlists in 48 hours and pay-after-join pricing.",
    slaNotice: "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.",
    heroStats: [
      { value: "48 hours", label: "Shortlist delivery", desc: "Guaranteed SLA" },
      { value: "2M+", label: "Verified pool", desc: "Assessed candidates" },
      { value: "90 days", label: "Replacement warranty", desc: "No questions asked" },
      { value: "4.9/5", label: "Client satisfaction", desc: "Over 500+ employers" },
    ],
    whyItWins: [
      {
        title: "Semantics, not keywords",
        desc: "Our engine reads demonstrated skills and trajectory — so a great engineer at a no-name startup outranks a mediocre one at a logo.",
      },
      {
        title: "Passive talent, actually reached",
        desc: "We don't wait for applications. Our outreach agents engage vetted, gainfully employed candidates through personalized technical hooks.",
      },
      {
        title: "Evidence-backed shortlists",
        desc: "Every profile comes with verified code samples, technical assessment scores, and calibrated salary expectations.",
      },
    ],
    bothSides: {
      employers: {
        tag: "HIRING PARTNER",
        title: "Close hard-to-fill tech roles in days",
        desc: "Stop sifting through hundreds of unqualified resumes. Receive a curated shortlist of 3–5 pre-interviewed candidates ready to join.",
        points: [
          "Calibrated candidate shortlist delivered in 48 hours",
          "Technical screening and code verification included",
          "Clear candidate salary benchmarks and notice periods",
          "Zero upfront cost — contingent success-fee model",
        ],
        ctaText: "Send a Role Brief",
      },
      candidates: {
        tag: "CANDIDATE TRACK",
        title: "Get matched with high-growth companies",
        desc: "Skip the resume black hole. Get discovered by verified tech employers based on your actual coding skills and project achievements.",
        points: [
          "Confidential job matching with top tech firms",
          "Accurate salary and role level benchmarking",
          "Direct introductions to hiring managers",
          "Dedicated candidate advocate throughout the process",
        ],
        ctaText: "Join the Talent Pool",
      },
    },
    processSteps: [
      { step: "01", title: "Role intake call (15 mins)", desc: "We capture role requirements, stack specifics, compensation bands, and cultural signals." },
      { step: "02", title: "AI semantic sourcing", desc: "Our algorithm queries 2M+ profiles and external networks matching depth, trajectory, and availability." },
      { step: "03", title: "Technical & culture screening", desc: "JOBSONN recruiters conduct 30-min technical screens, verifying motivations and notice periods." },
      { step: "04", title: "48-Hour shortlist delivery", desc: "You receive 3–5 candidate dossiers complete with assessment scores and video snippets." },
      { step: "05", title: "Interview scheduling & prep", desc: "We coordinate candidate interviews and handle pre-interview briefing and feedback loops." },
      { step: "06", title: "Offer negotiation & onboarding", desc: "We manage offer closure, compensation alignment, and notice period check-ins to ensure joining." },
    ],
    benefits: [
      { title: "48-Hour Shortlist SLA", desc: "Cut time-to-hire by 65% with calibrated candidates delivered within two business days." },
      { title: "Contingent Success Pricing", desc: "Pay only when a candidate accepts and joins. Zero upfront retainers or hidden subscriptions." },
      { title: "90-Day Free Replacement", desc: "If a placed hire leaves or is terminated within 90 days, we replace them at no extra charge." },
      { title: "Deep Domain Specialization", desc: "Recruiters with software engineering and cloud backgrounds speak your team's language." },
      { title: "Transparent Fit Scoring", desc: "Plain-English explanation of why each candidate matches your specific team dynamics." },
      { title: "High Offer Acceptance (94%)", desc: "Pre-screened salary expectations and counter-offer coaching ensure near-perfect offer closure." },
    ],
    useCases: [
      {
        scenario: "US SaaS company establishing a 50-person India tech center in Bengaluru.",
        solution: "Dedicated sprint recruiters delivered 42 senior and lead engineer placements in 75 days.",
        metrics: [
          { label: "Offers accepted", value: "42" },
          { label: "Acceptance rate", value: "95%" },
          { label: "Time-to-fill", value: "18 days" },
        ],
      },
      {
        scenario: "Series B healthtech needing a specialized Chief Architect with HIPAA & Kubernetes expertise.",
        solution: "Headhunting passive candidates across captive healthcare R&D centers.",
        metrics: [
          { label: "Shortlist delivered", value: "48 hrs" },
          { label: "Interview-to-offer", value: "10 days" },
          { label: "Placement retention", value: "100%" },
        ],
      },
      {
        scenario: "E-commerce platform scaling for festival season with 20 backend and DevOps contractors.",
        solution: "Rapid sourcing engine staffed all 20 roles with vetted contractors within 1 week.",
        metrics: [
          { label: "Contractors placed", value: "20" },
          { label: "Sourcing turnaround", value: "5 days" },
          { label: "Uptime achieved", value: "99.99%" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "JOBSONN sent us three candidate dossiers on Tuesday after a Monday morning brief. We made an offer by Friday. Best recruiting experience we've had.",
        name: "Meera Krishnan",
        role: "Director of People",
        company: "PayScale India",
        initials: "MK",
      },
      {
        quote: "Their technical screening is legitimate. Candidates came prepared, understood our architecture, and cleared our senior code review effortlessly.",
        name: "Siddharth Rao",
        role: "Engineering Manager",
        company: "Swarm Analytics",
        initials: "SR",
      },
    ],
    deliverables: [
      "Calibrated 3–5 candidate dossiers within 48 hours of role intake",
      "Technical assessment scorecards and code challenge results",
      "Salary benchmarking and competitive offer structure advisory",
      "Detailed compensation breakdown and notice period verification",
      "Comprehensive reference checks (minimum 2 senior references)",
      "90-day written replacement guarantee contract",
    ],
    faqs: [
      { q: "What is your pricing model for talent sourcing?", a: "We operate primarily on a contingent success-fee model (a percentage of the first year CTC paid only after the candidate joins). Retained executive search options are also available." },
      { q: "How do you guarantee a 48-hour shortlist?", a: "Our proprietary AI talent graph maintains pre-screened, continuously updated profiles of active and passive engineers across 40+ technology categories." },
      { q: "What happens if a candidate backs out after accepting?", a: "We immediately activate backup candidates from the shortlist and handle offer extensions at zero additional charge." },
      { q: "Which seniority levels do you recruit for?", a: "We recruit across Software Engineers (2–5 yrs), Senior Engineers (5–8 yrs), Tech Leads, Engineering Managers, and VP/C-Suite leadership." },
    ],
  },

  "talent-flexible-deployment": {
    solutionKey: "talent-flexible-deployment",
    label: "Flexible Deployment",
    badge: "On-Demand Talent",
    heroHeadline: "Talent that flexes with your roadmap — scale up or down in days",
    heroSubheadline: "Contract, project-based and on-demand pods of pre-vetted professionals plug into your teams fast — and flex down just as fast when priorities shift. One bench, one invoice, zero admin.",
    slaNotice: "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.",
    heroStats: [
      { value: "48 hours", label: "Deployment SLA", desc: "Brief to kickoff" },
      { value: "3–15", label: "Pod squad size", desc: "Custom technical mix" },
      { value: "100%", label: "Statutory compliance", desc: "Zero legal liability" },
      { value: "Zero", label: "Admin overhead", desc: "Consolidated billing" },
    ],
    whyItWins: [
      {
        title: "Days, not quarters",
        desc: "A briefed pod kicks off in five days — hiring, vetting and onboarding already done.",
      },
      {
        title: "Pods shaped to your org",
        desc: "Squads of 3–15 with the exact mix of skills and seniority your roadmap needs.",
      },
      {
        title: "Elastic by design",
        desc: "Scale up for the peak, down for the trough — capacity changes land within 48 hours.",
      },
    ],
    bothSides: {
      employers: {
        tag: "HIRING PARTNER",
        title: "Scale engineering capacity on demand",
        desc: "Deploy specialized contract engineers, dedicated offshore squads, or project pods without expanding internal headcount or taking on permanent liabilities.",
        points: [
          "Pre-vetted contractors available within 48 hours",
          "Flexible 3-month to 24-month engagement terms",
          "Full payroll, benefits, and tax compliance handled by JOBSONN",
          "Seamless transition to permanent hires (temp-to-perm)",
        ],
        ctaText: "Staff My Pod",
      },
      candidates: {
        tag: "CANDIDATE TRACK",
        title: "High-impact contract and project roles",
        desc: "Work on cutting-edge enterprise projects with top brands, guaranteed on-time monthly pay, and steady access to premium engagements.",
        points: [
          "High hourly and monthly contract rates",
          "Work with tier-1 technology organizations",
          "Comprehensive contractor support and payroll management",
          "Access to back-to-back projects across seasons",
        ],
        ctaText: "Join the Consultant Bench",
      },
    },
    processSteps: [
      { step: "01", title: "Project & pod scoping", desc: "We define team composition, tech stack, duration, time-zone overlap, and SLA requirements." },
      { step: "02", title: "Bench matching & pod assembly", desc: "We assemble an interview-ready squad from our pre-vetted contractor bench in 48 hours." },
      { step: "03", title: "Client interview & sign-off", desc: "You interview and validate team members before deployment; instant replacements if not a fit." },
      { step: "04", title: "Day 1 kickoff & sprint alignment", desc: "Engineers join your Jira, Slack, and code repositories with pre-configured dev environments." },
      { step: "05", title: "Weekly velocity & milestone reviews", desc: "A dedicated Delivery Lead monitors sprint output, timesheets, and technical delivery." },
      { step: "06", title: "Elastic scaling & transition", desc: "Add or roll off capacity with 2-week notice, or convert key contractors into full-time employees." },
    ],
    benefits: [
      { title: "Rapid Time-to-Kickoff", desc: "Deploy seasoned engineers in under 5 business days without lengthy recruiting cycles." },
      { title: "100% Legal & Tax Compliance", desc: "JOBSONN acts as Employer of Record (EOR), handling PF, ESIC, GST, and statutory liabilities." },
      { title: "Zero Long-Term Commitments", desc: "Scale up for major feature launches and scale down as maintenance phases begin." },
      { title: "Dedicated Delivery Management", desc: "Every engagement includes a Delivery Manager who tracks SLA adherence and sprint progress." },
      { title: "Temp-to-Perm Flexibility", desc: "Evaluate contractor performance in production before extending full-time offers." },
      { title: "Cost Predictability", desc: "All-inclusive monthly rate cards with zero hidden recruitment fees or benefits overhead." },
    ],
    useCases: [
      {
        scenario: "European fintech expanding into APAC needed an 8-engineer DevOps pod for 6 months.",
        solution: "Deployed dedicated pod covering Kubernetes, Terraform, and 24/7 on-call rotations.",
        metrics: [
          { label: "Pod assembled", value: "4 days" },
          { label: "SLA compliance", value: "99.9%" },
          { label: "Cost savings", value: "38%" },
        ],
      },
      {
        scenario: "E-learning company facing 300% traffic surge during exam season.",
        solution: "Scaled engineering squad by 15 fullstack engineers for 4 months to stabilize infra.",
        metrics: [
          { label: "Zero downtime", value: "100%" },
          { label: "Latency reduction", value: "45%" },
          { label: "Rolled off smoothly", value: "4 months" },
        ],
      },
      {
        scenario: "Automotive supplier building prototype in-vehicle infotainment app.",
        solution: "Supplied specialized Flutter and embedded Android team for a 12-week MVP build.",
        metrics: [
          { label: "MVP delivered", value: "12 wks" },
          { label: "Design compliance", value: "100%" },
          { label: "Converted to perm", value: "3 engineers" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "Having a pre-vetted team of 6 engineers ready to deploy in 48 hours saved our product release date. They felt like our own team from day one.",
        name: "Devendra Joshi",
        role: "Head of Engineering",
        company: "NextGen Logistics",
        initials: "DJ",
      },
      {
        quote: "The billing and compliance simplicity is what sold us. One monthly invoice, zero HR complications, and rock-solid code quality.",
        name: "Sarah Jenkins",
        role: "VP Operations",
        company: "FinScale Europe",
        initials: "SJ",
      },
    ],
    deliverables: [
      "Master Services Agreement with defined service level agreements",
      "Consolidated monthly invoicing with verified timesheet telemetry",
      "Non-disclosure and intellectual property assignment guarantees",
      "Weekly sprint velocity and burn-down reports",
      "Dedicated Delivery Lead and replacement guarantee protocol",
      "Documented handover and IP transfer upon project completion",
    ],
    faqs: [
      { q: "How quickly can contract talent start?", a: "Pre-vetted bench consultants can be onboarded and coding within 48 to 72 hours of contract approval." },
      { q: "What is the minimum contract duration?", a: "Engagements typically run from 3 months up to 24 months. We also accommodate project-based milestones with fixed-fee SOWs." },
      { q: "Can we convert a contractor to a permanent employee?", a: "Yes! We offer a smooth Temp-to-Perm conversion path after a predetermined trial duration." },
      { q: "Who handles statutory compliance and benefits?", a: "JOBSONN handles 100% of payroll, taxation, healthcare, and statutory requirements." },
    ],
  },

  "talent-end-to-end-workforce": {
    solutionKey: "talent-end-to-end-workforce",
    label: "End-to-End Workforce",
    badge: "Full Lifecycle",
    heroHeadline: "Your entire workforce lifecycle — one accountable partner",
    heroSubheadline: "Planning, hiring, onboarding, management, retention and analytics — an end-to-end operating partner for the workforce decisions that used to live in six different vendors.",
    slaNotice: "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.",
    heroStats: [
      { value: "One", label: "Operating partner", desc: "Single accountability" },
      { value: "6-in-1", label: "Vendors unified", desc: "Consolidated workflow" },
      { value: "58%", label: "Faster time-to-hire", desc: "Streamlined funnel" },
      { value: "2.3x", label: "Higher retention", desc: "Integrated career paths" },
    ],
    whyItWins: [
      {
        title: "One strategy, one owner",
        desc: "A single workforce plan governs hiring, training, deployment and retention — no more vendors optimizing their own slice.",
      },
      {
        title: "Every signal in one place",
        desc: "ATS, LMS, deployment and attrition data unified into one graph your leaders can actually query.",
      },
      {
        title: "True strategic alignment",
        desc: "Talent planning aligns directly with your product roadmap and revenue expansion milestones.",
      },
    ],
    bothSides: {
      employers: {
        tag: "ENTERPRISE WORKFORCE",
        title: "Consolidate your entire talent infrastructure",
        desc: "Transform how your organization recruits, assesses, trains, and retains high-caliber technical talent with an enterprise operating partnership.",
        points: [
          "Strategic workforce planning tied to business roadmap",
          "Automated talent sourcing, assessment, and hiring pipeline",
          "Integrated corporate onboarding and upskilling academies",
          "Unified workforce analytics, compliance, and retention reporting",
        ],
        ctaText: "Map My Workforce",
      },
      candidates: {
        tag: "CAREER DEVELOPMENT",
        title: "End-to-end career acceleration",
        desc: "Join a talent ecosystem that doesn't just place you in a role, but invests in your ongoing professional development and career progression.",
        points: [
          "Structured skills assessment and gap mapping",
          "Sponsored corporate training and certification tracks",
          "Internal mobility and long-term career growth options",
          "Continuous mentorship and executive coaching",
        ],
        ctaText: "Explore Workforce Network",
      },
    },
    processSteps: [
      { step: "01", title: "Enterprise talent audit", desc: "Comprehensive audit of existing headcount, recruiting costs, attrition hotspots, and skill gaps." },
      { step: "02", title: "Workforce master plan", desc: "Co-designing a 12-month integrated workforce plan aligned with product and revenue roadmap." },
      { step: "03", title: "Unified talent acquisition engine", desc: "Deploying high-volume sourcing, AI assessment screens, and executive hiring pods." },
      { step: "04", title: "Continuous learning & academy", desc: "Establishing custom corporate academies to upskill existing teams and onboard new hires." },
      { step: "05", title: "Retention & performance management", desc: "Real-time engagement telemetry, career progression ladders, and attrition risk alerts." },
      { step: "06", title: "Executive workforce telemetry", desc: "Monthly board-ready dashboards detailing cost-per-hire, productivity parity, and ROI." },
    ],
    benefits: [
      { title: "Single Accountability Partner", desc: "Eliminate finger-pointing between recruitment agencies, training firms, and staffing vendors." },
      { title: "35% Total Cost Reduction", desc: "Consolidated vendor rates, lower recruiter commissions, and reduced employee turnover." },
      { title: "Predictable Talent Velocity", desc: "Always have qualified talent ready before new enterprise customer contracts kick off." },
      { title: "Executive-Ready Visibility", desc: "Unified dashboards giving C-suite leaders immediate insight into talent capacity." },
      { title: "Superior Employer Brand", desc: "Consistent, world-class candidate and employee onboarding experiences." },
      { title: "Global Scaling Readiness", desc: "Standardized hiring and onboarding playbooks that replicate across new geographic hubs." },
    ],
    useCases: [
      {
        scenario: "Multi-billion dollar IT services firm needing to modernize 15,000 legacy consultants.",
        solution: "End-to-End workforce partnership integrating hiring, cloud training, and client deployment.",
        metrics: [
          { label: "Consultants re-skilled", value: "14,200" },
          { label: "Margin expansion", value: "+4.2%" },
          { label: "Attrition drop", value: "−28%" },
        ],
      },
      {
        scenario: "Healthcare conglomerate building an integrated digital health engineering division.",
        solution: "Managed workforce solution establishing complete hiring, clinical-tech training, and compliance.",
        metrics: [
          { label: "Team assembled", value: "220 hires" },
          { label: "SLA compliance", value: "100%" },
          { label: "Time-to-market", value: "−6 mos" },
        ],
      },
      {
        scenario: "Series C fintech scaling from 150 to 600 employees in 12 months.",
        solution: "Full lifecycle talent operations covering recruitment, onboarding, and leadership coaching.",
        metrics: [
          { label: "Headcount target", value: "100% met" },
          { label: "Cost-per-hire", value: "−48%" },
          { label: "Retention at 1 yr", value: "96%" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "Consolidating six disparate recruiting and training vendors into JOBSONN's end-to-end partnership was the best operational decision we made this year.",
        name: "Pradeep Nambiar",
        role: "Chief Operating Officer",
        company: "Vantage Global Technologies",
        initials: "PN",
      },
      {
        quote: "We scaled our digital hub by 400 engineers with zero drop in engineering quality. The unified workforce analytics gave us real peace of mind.",
        name: "Ritu Singhal",
        role: "Chief People Officer",
        company: "InnoTech Health",
        initials: "RS",
      },
    ],
    deliverables: [
      "Annual Enterprise Workforce Strategy and Headcount Roadmap",
      "Unified Talent Acquisition SLA and Delivery Governance Charter",
      "Corporate Learning Academy curriculum and LMS integration",
      "Employee Net Promoter Score (eNPS) and Retention Telemetry",
      "Enterprise Compliance and Statutory Audit Clearance reports",
      "Quarterly Executive Board Workforce Review and ROI Scorecards",
    ],
    faqs: [
      { q: "What does an End-to-End Workforce partnership entail?", a: "We act as your dedicated workforce operations engine — handling talent planning, sourcing, technical screening, onboarding, continuous upskilling, and retention analytics." },
      { q: "How does this compare to traditional RPO (Recruitment Process Outsourcing)?", a: "Traditional RPO only focuses on filling seats. We integrate technical training, performance telemetry, and retention strategies to guarantee long-term workforce productivity." },
      { q: "Can we transition existing vendors into this framework?", a: "Yes! We run seamless vendor consolidation transitions with zero disruption to active hiring pipelines." },
      { q: "What size company benefits most from this model?", a: "High-growth scale-ups (100+ employees) and established enterprises (1,000+ employees) scaling technical divisions gain the highest ROI." },
    ],
  },

  "talent-assessment": {
    solutionKey: "talent-assessment",
    label: "Talent Assessment",
    badge: "AI Assessment",
    heroHeadline: "Assessments you can actually trust: proctored, verifiable, instant",
    heroSubheadline: "AI-powered assessments of technical skill, aptitude, communication and job-readiness — proctored, anti-cheat and verifiable. Employers hire on evidence; candidates prove skills no CV can show.",
    slaNotice: "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.",
    heroStats: [
      { value: "100%", label: "Anti-cheat proctored", desc: "Real-time webcam & code check" },
      { value: "1,500+", label: "Validated tests", desc: "Coding, cognitive, domain" },
      { value: "Instant", label: "Explainable scores", desc: "No black-box decisions" },
      { value: "60%", label: "Fewer mis-hires", desc: "Evidence-backed selection" },
    ],
    whyItWins: [
      {
        title: "Science-backed scoring",
        desc: "Psychometrically validated items calibrated against real job outcomes — not trivia banks.",
      },
      {
        title: "Proctoring that travels with the test",
        desc: "Identity checks, environment scanning and multi-signal anomaly detection on every session.",
      },
      {
        title: "Credentials that verify",
        desc: "Scores ship as tamper-evident, link-verifiable credentials any employer can check in seconds.",
      },
    ],
    bothSides: {
      employers: {
        tag: "HIRING PARTNER",
        title: "Hire on evidence, not assumptions",
        desc: "Replace CV guesswork with structured, role-specific assessments, benchmarked scores, and verifiable candidate results.",
        points: [
          "Role-specific assessment blueprints matching your stack",
          "Proctored and integrity-aware assessment sessions",
          "Benchmark-based candidate scoring vs top 10% industry engineers",
          "Structured interview recommendations for technical hiring managers",
        ],
        ctaText: "Design an Assessment",
      },
      candidates: {
        tag: "CANDIDATE TRACK",
        title: "Prove your skills with confidence",
        desc: "Demonstrate your abilities through structured assessments and build a shareable record of your verified technical capabilities.",
        points: [
          "Practice assessments before taking real screens",
          "Clear and objective assessment instructions",
          "Fair and consistent evaluation with zero bias",
          "Shareable, link-verifiable certification credentials",
        ],
        ctaText: "Take a Practice Assessment",
      },
    },
    processSteps: [
      { step: "01", title: "Role blueprint creation", desc: "Select from 1,500+ pre-built tests or customize coding challenges aligned to your repo standards." },
      { step: "02", title: "Automated candidate dispatch", desc: "Send one-click assessment invites integrated directly into your ATS (Greenhouse, Lever, Workday)." },
      { step: "03", title: "AI-Proctored test session", desc: "Browser lockdown, webcam face verification, copy-paste blocking, and secondary screen detection." },
      { step: "04", title: "Multi-dimensional scoring", desc: "Algorithm analyzes code correctness, time complexity, memory efficiency, and architecture style." },
      { step: "05", title: "Plain-English diagnostic dossier", desc: "Hiring managers receive instant candidate report with code replay and interview talking points." },
      { step: "06", title: "Verifiable credential issuance", desc: "Candidates receive encrypted, shareable badges validating their verified skillset." },
    ],
    benefits: [
      { title: "Zero False-Positive Hires", desc: "Cut technical interview drop-off by 70% by ensuring only verified engineers reach your tech leads." },
      { title: "Uncompromising Integrity", desc: "Multi-signal anti-cheating prevents ChatGPT copy-pasting, proxy test-takers, and tab switching." },
      { title: "Explainable AI Scoring", desc: "Every score provides line-by-line code evaluation — no black-box mystery algorithms." },
      { title: "Seamless ATS Integration", desc: "Trigger tests automatically from Greenhouse, Lever, Workday, or our open REST API." },
      { title: "Inclusive & Bias-Free", desc: "Standardized rubrics remove demographic bias and evaluate pure problem-solving aptitude." },
      { title: "Candidate-Friendly UX", desc: "Full IDE experience with syntax highlighting, autocomplete, and automated unit test runners." },
    ],
    useCases: [
      {
        scenario: "Fintech scaling campus hiring received 18,000 applicants for 150 software roles.",
        solution: "Automated AI-proctored coding and aptitude screen filtered applicants down to top 400 in 48 hours.",
        metrics: [
          { label: "Applicants screened", value: "18,000" },
          { label: "Engineering time saved", value: "1,200 hrs" },
          { label: "Cheating caught", value: "14.2%" },
        ],
      },
      {
        scenario: "Cybersecurity firm evaluating senior penetration testers across red-team simulation scenarios.",
        solution: "Custom interactive Linux terminal assessment with live vulnerability exploitation challenges.",
        metrics: [
          { label: "Test accuracy", value: "98.5%" },
          { label: "Lead time", value: "−5 days" },
          { label: "Mis-hire rate", value: "0%" },
        ],
      },
      {
        scenario: "Enterprise SaaS assessing existing engineering teams for cloud migration readiness.",
        solution: "Organizational skill mapping across AWS and microservices architecture.",
        metrics: [
          { label: "Engineers mapped", value: "450" },
          { label: "Skill gap identified", value: "32%" },
          { label: "Training targeted", value: "100%" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "The code replay feature is phenomenal. Our tech leads can see exactly how a candidate brainstormed, debugged, and optimized their solution.",
        name: "Karthik Sundaram",
        role: "Head of Talent Acquisition",
        company: "Paytm Payments",
        initials: "KS",
      },
      {
        quote: "Our engineer interviewing time dropped by 60%. We now only interview candidates who have already demonstrated solid coding fundamentals.",
        name: "Elena Rostova",
        role: "Director of Engineering",
        company: "DataCloud Global",
        initials: "ER",
      },
    ],
    deliverables: [
      "Custom role assessment blueprints and challenge problem sets",
      "AI proctoring session logs with timestamped anomaly flags",
      "Full code playback and syntax efficiency scorecard",
      "Plain-English interview question generator for hiring managers",
      "Encrypted tamper-proof skill credential link for candidates",
      "ATS integration connector setup and webhook documentation",
    ],
    faqs: [
      { q: "How do you prevent candidates from using ChatGPT or AI tools?", a: "Our test environment features full browser lockdown, clipboard disabling, keystroke pattern analysis, and unique randomized question banks designed to test novel reasoning." },
      { q: "Can we write our own custom coding challenges?", a: "Yes! You can author private questions in 35+ programming languages, complete with custom unit test suites and hidden edge-case tests." },
      { q: "Does the assessment platform integrate with our ATS?", a: "Yes — native plug-and-play integrations are available for Greenhouse, Lever, Workday, SmartRecruiters, and custom webhooks." },
      { q: "What happens if a candidate experiences a network drop?", a: "The environment autosaves code locally every 5 seconds. Candidates can seamlessly reconnect without losing progress, while anti-cheat monitors any prolonged absence." },
    ],
  },

  "talent-staffing": {
    solutionKey: "talent-staffing",
    label: "Staffing Solutions",
    badge: "Flexible Staffing",
    heroHeadline: "Staffing that moves at your speed — 48h shortlists, guarantees in writing",
    heroSubheadline: "Comprehensive staffing solutions across contract staffing, contract-to-hire, permanent hiring, and project-based staffing — complete with talent screening, 48-hour shortlists, onboarding, and compliance coordination.",
    slaNotice: "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.",
    heroStats: [
      { value: "48 hours", label: "Shortlist SLA", desc: "Speed to candidate" },
      { value: "4 modes", label: "One partner", desc: "Contract, C2H, Direct, SOW" },
      { value: "90 days", label: "Replacement warranty", desc: "Guaranteed in writing" },
      { value: "94%", label: "Offer acceptance", desc: "Pre-screened candidates" },
    ],
    whyItWins: [
      {
        title: "48-hour response",
        desc: "A calibrated shortlist within two business days — because requirements age badly.",
      },
      {
        title: "Vetted before you see them",
        desc: "Skills assessed, references checked and compliance cleared before anyone hits your inbox.",
      },
      {
        title: "Four modes, one partner",
        desc: "Contract, contract-to-hire, permanent and project-based under one roof — no re-briefing new agencies per mode.",
      },
    ],
    bothSides: {
      employers: {
        tag: "HIRING PARTNER",
        title: "Submit your requirement, get calibrated shortlists",
        desc: "Submit open hiring requirements with custom role parameters. We recommend the optimal staffing model, provide transparent commercial rate cards, and deliver screened candidate shortlists in 48 hours.",
        points: [
          "Fast requirement submission & role scoping",
          "Staffing model recommendations (Contract, C2H, Direct)",
          "Transparent rate cards and commercial terms",
          "Pre-vetted, interview-ready candidate shortlists",
        ],
        ctaText: "Send a Requirement",
      },
      candidates: {
        tag: "CANDIDATE TRACK",
        title: "Project-based team assembly and delivery",
        desc: "Assemble dedicated project teams with precise skill matching and timeline alignment. Backed by dedicated delivery coordination, milestone tracking, and seamless project close-out.",
        points: [
          "Rapid team assembly aligned to project scope",
          "Multi-discipline skill matching & verification",
          "Dedicated delivery coordination & milestone tracking",
          "Clean handover and documented project close-out",
        ],
        ctaText: "Plan a Project Team",
      },
    },
    processSteps: [
      { step: "01", title: "Requirement intake & model match", desc: "We review role requirements and recommend the optimal staffing format (Contract, C2H, Permanent)." },
      { step: "02", title: "AI candidate matching & screening", desc: "We filter our 2M+ candidate pool for verified technical capability and immediate availability." },
      { step: "03", title: "48-Hour vetted shortlist", desc: "You receive 3–5 pre-interviewed candidate profiles complete with rate cards and assessments." },
      { step: "04", title: "Client interview & selection", desc: "We coordinate swift interview rounds and gather immediate feedback from hiring managers." },
      { step: "05", title: "Compliance, background & offer", desc: "Full background check, identity verification, contract generation, and equipment setup." },
      { step: "06", title: "Day 1 onboarding & management", desc: "Structured onboarding check-in followed by ongoing performance and timesheet tracking." },
    ],
    benefits: [
      { title: "Four Flexible Models", desc: "Easily switch between Contract, Contract-to-Hire, Permanent Placement, and Statement-of-Work (SOW)." },
      { title: "48-Hour Calibrated Delivery", desc: "Eliminate hiring lag with guaranteed pre-screened shortlists in 48 hours." },
      { title: "Full Statutory Compliance", desc: "We shoulder 100% of Employer of Record liabilities, payroll, tax deductions, and benefits." },
      { title: "90-Day Written Warranty", desc: "Zero financial risk with a complete 90-day replacement guarantee on all placements." },
      { title: "Volume Hiring Capacity", desc: "Proven ability to scale from single niche hires to 100+ engineer staffing surges." },
      { title: "Transparent Rate Cards", desc: "Clear, upfront margins with zero surprise markups or administrative fees." },
    ],
    useCases: [
      {
        scenario: "Tier-1 bank needed 45 senior QA automation engineers for a core banking release.",
        solution: "Staffed 45 engineers on a 9-month contract with 10 converted to permanent roles.",
        metrics: [
          { label: "Staffed in", value: "14 days" },
          { label: "SLA compliance", value: "99.8%" },
          { label: "Converted to perm", value: "10 engineers" },
        ],
      },
      {
        scenario: "Healthcare software vendor needing specialized HL7/FHIR integration consultants.",
        solution: "Sourced 6 niche healthtech integration specialists across multiple locations.",
        metrics: [
          { label: "Shortlist turnaround", value: "48 hrs" },
          { label: "Offer acceptance", value: "100%" },
          { label: "Retention", value: "100%" },
        ],
      },
      {
        scenario: "Gaming studio scaling frontend development for holiday game launch.",
        solution: "Deployed 12 Unity and React developers on flexible 4-month contracts.",
        metrics: [
          { label: "Deployed in", value: "6 days" },
          { label: "Release on schedule", value: "Yes" },
          { label: "Cost vs internal hire", value: "−32%" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "JOBSONN is our primary staffing partner. When we had a client audit requiring 30 Java engineers in 10 days, they delivered 32 qualified candidates.",
        name: "Manoj Agarwal",
        role: "Head of Staffing & Resourcing",
        company: "GlobalLogic India",
        initials: "MA",
      },
      {
        quote: "The contract-to-hire option gave us the flexibility to test candidates on live sprints before committing to full-time headcount. Brilliant model.",
        name: "Sunita Roy",
        role: "VP Engineering",
        company: "CareFirst Health",
        initials: "SR",
      },
    ],
    deliverables: [
      "Staffing Master Agreement and Commercial Schedule rate cards",
      "Candidate background check dossiers (education, criminal, experience)",
      "Weekly automated timesheet tracking and manager sign-off",
      "Statutory compliance and tax deduction clearance certificates",
      "Performance review checkpoints at 30, 60, and 90 days",
      "Smooth contract termination or permanent conversion agreement",
    ],
    faqs: [
      { q: "What is the difference between Contract and Contract-to-Hire?", a: "Contract staffing is for a set duration (e.g. 3–12 months) to meet a specific roadmap need. Contract-to-Hire allows you to evaluate the engineer for 3–6 months with the intent to convert them to your permanent payroll." },
      { q: "How quickly can candidates start?", a: "Contractors can typically start within 3 to 7 business days. Permanent hires depend on candidate notice periods (typically 15 to 30 days)." },
      { q: "Who manages contractor payroll and taxes?", a: "JOBSONN is the legal Employer of Record and handles 100% of payroll, PF, ESIC, insurance, and statutory filings." },
      { q: "What happens if a contractor underperforms?", a: "We replace underperforming contractors within 48 to 72 hours at no cost to your organization." },
    ],
  },

  "placements": {
    solutionKey: "placements",
    label: "Placements",
    badge: "Career Placement",
    heroHeadline: "Careers launched, roles filled — one placement engine",
    heroSubheadline: "Job seekers get matched into live roles by AI that reads verified skills; employers get placement-ready talent from a pipeline that's already been trained, assessed and vetted. Both sides win faster.",
    slaNotice: "Backed by written SLAs, replacement guarantees and weekly performance reporting — scoped to your goals on a free discovery call.",
    heroStats: [
      { value: "96%", label: "Placement rate", desc: "Trained candidates" },
      { value: "48h", label: "Shortlist SLA", desc: "Employer turnaround" },
      { value: "500+", label: "Hiring partners", desc: "Top tech companies" },
      { value: "₹8.4L", label: "Avg starting CTC", desc: "For technical grads" },
    ],
    whyItWins: [
      {
        title: "Matching on verified skill",
        desc: "The engine weighs assessed skills and trajectory — not keyword stuffing or referral luck.",
      },
      {
        title: "Assessed before introduction",
        desc: "Proctored assessments and reference checks are done before anyone meets anyone.",
      },
      {
        title: "Free for candidates, always",
        desc: "Job seekers never pay fees or commissions — employers carry transparent success pricing.",
      },
    ],
    bothSides: {
      employers: {
        tag: "HIRING PARTNER",
        title: "Access placement-ready talent on demand",
        desc: "Hire pre-screened graduates and career switchers who have completed industry-standard training and passed rigorous proctored technical evaluations.",
        points: [
          "Direct access to top 10% graduates from partner academies",
          "Verified GitHub portfolios and capstone project demonstrations",
          "Automated interview scheduling and pre-briefed candidates",
          "Zero placement risk with our 90-day replacement guarantee",
        ],
        ctaText: "Hire Placement-Ready Talent",
      },
      candidates: {
        tag: "CANDIDATE TRACK",
        title: "Launch your career with verified skills",
        desc: "Get placed in high-growth technology roles based on your actual ability to write clean code and solve problems, not your college brand.",
        points: [
          "100% free placement assistance for verified candidates",
          "1:1 resume optimization and mock interview coaching",
          "Direct interviews with 500+ verified hiring partners",
          "Salary negotiation advisory and offer letter support",
        ],
        ctaText: "Find My Next Role",
      },
    },
    processSteps: [
      { step: "01", title: "Candidate profiling & assessment", desc: "Candidates complete proctored coding and aptitude screens to verify real-world competency." },
      { step: "02", title: "Career coaching & portfolio review", desc: "Senior mentors review GitHub repositories, refine resumes, and conduct mock tech interviews." },
      { step: "03", title: "AI employer matching", desc: "Our engine maps candidate strengths directly to verified open vacancies at 500+ tech companies." },
      { step: "04", title: "Direct interview coordination", desc: "Candidates bypass HR gatekeepers and interview directly with engineering hiring managers." },
      { step: "05", title: "Offer evaluation & negotiation", desc: "We guide candidates through compensation packages, stock options, and growth trajectory." },
      { step: "06", title: "Day 1 onboarding & 90-day check-in", desc: "We follow up post-joining to ensure smooth team integration and career satisfaction." },
    ],
    benefits: [
      { title: "Zero Cost for Candidates", desc: "We never charge job seekers. We are compensated entirely by hiring employers upon successful placement." },
      { title: "Pre-Interviewed & Vetted", desc: "Employers meet only candidates whose technical and communication skills have already been validated." },
      { title: "High Retention Rates (96%)", desc: "Candidates placed through skills matching stay significantly longer than cold applicants." },
      { title: "Transparent Salary Data", desc: "Comprehensive salary benchmarks ensure fair compensation for candidates and employers alike." },
      { title: "Fast-Track Hiring Loops", desc: "Placement cycles average 10 to 14 days from initial introduction to signed offer letter." },
      { title: "Continuous Upskilling Access", desc: "Placed alumni receive continued access to JOBSONN advanced workshops and masterclasses." },
    ],
    useCases: [
      {
        scenario: "Tier-2 university computer science graduate struggling to get interviews at product companies.",
        solution: "Completed JOBSONN verification assessment and was matched with an enterprise SaaS company in 8 days.",
        metrics: [
          { label: "Salary increase", value: "2.4x" },
          { label: "Interviews secured", value: "3" },
          { label: "Days to offer", value: "8 days" },
        ],
      },
      {
        scenario: "Fintech scaling its engineering graduate program needed 60 entry-level software developers.",
        solution: "Sourced and placed 60 verified candidates across fullstack and DevOps roles.",
        metrics: [
          { label: "Placements delivered", value: "60" },
          { label: "Offer acceptance", value: "96%" },
          { label: "Retention at 1 yr", value: "95%" },
        ],
      },
      {
        scenario: "Career switcher transitioning from mechanical engineering into fullstack web development.",
        solution: "Mentorship and project review led to a Junior Fullstack placement at a healthtech startup.",
        metrics: [
          { label: "Time to placement", value: "21 days" },
          { label: "Starting CTC", value: "₹7.5 LPA" },
          { label: "Performance rating", value: "Exceeds bar" },
        ],
      },
    ],
    testimonials: [
      {
        quote: "JOBSONN got me three interviews in one week after months of sending resumes into online portals. I accepted an offer at a fantastic SaaS company.",
        name: "Abhishek Verma",
        role: "Software Engineer",
        company: "Placed at CloudNine",
        initials: "AV",
      },
      {
        quote: "Every graduate we hired through JOBSONN's placement engine was productive from their second week. The pre-screening is truly thorough.",
        name: "Deepa Menon",
        role: "Head of Campus Talent",
        company: "Zeta Interactive",
        initials: "DM",
      },
    ],
    deliverables: [
      "Verified candidate technical skill profile and GitHub project audit",
      "Recorded video interview introduction and proctoring log",
      "Standardized background check verification report",
      "Salary benchmarking and offer closure facilitation",
      "90-day replacement warranty for hiring employers",
      "Candidate career onboarding and mentorship toolkit",
    ],
    faqs: [
      { q: "Is placement assistance really free for candidates?", a: "Yes, 100%! Candidates never pay any registration fees or placement commissions. Hiring employers cover all commercial fees." },
      { q: "How long does it take to get placed?", a: "Candidates with verified assessment scores typically receive interview invitations within 5 to 10 days of profile activation." },
      { q: "Which companies hire through JOBSONN Placements?", a: "Over 500+ companies — ranging from fast-growing Series A–C startups to established tech enterprises and global multinationals." },
      { q: "What is your placement replacement guarantee for employers?", a: "All placements are backed by our standard 90-day free replacement guarantee." },
    ],
  },
};

export function getFullTalentSolution(key: string): FullTalentSolution | undefined {
  return TALENT_SOLUTIONS_FULL_DATA[key];
}
