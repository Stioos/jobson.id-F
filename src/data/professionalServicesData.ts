// ==================== TYPES ====================

export interface ProfessionalService {
  slug: string;
  num: string;
  name: string;
  subtitle: string;
  desc: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  heroTitle: string;
  heroSubtitle: string;
  stats: { value: string; label: string }[];
  overview: { title: string; desc: string };
  features: { icon: string; title: string; desc: string }[];
  howItWorks: { step: number; title: string; desc: string }[];
  benefits: { icon: string; title: string; desc: string }[];
  deliverables: { title: string; desc: string }[];
  whoIsFor: { title: string; desc: string; points: string[] }[];
  process: { phase: string; title: string; items: string[] }[];
  techTools: string[];
  successMetrics: { metric: string; desc: string; value: string }[];
  industries: string[];
  testimonials: { name: string; role: string; text: string }[];
  compareBeforeAfter: { before: string; after: string }[];
  relatedServices: string[];
  ctaTitle: string;
  ctaDesc: string;
}

// ==================== DATA ====================

export const professionalServices: ProfessionalService[] = [
  // ─── 1. Career Assessment ─────────────────────────────────────────────
  {
    slug: 'career-assessment',
    num: '01',
    name: 'Find the Career That Fits You',
    subtitle: 'Personalized Career Assessment & Role Matching',
    desc: 'Discover your strengths, identify your best-fit roles, and get a clear career direction.',
    icon: 'Compass',
    color: '#0099FF',
    gradientFrom: '#0099FF',
    gradientTo: '#0055CC',
    heroTitle: 'Discover Your Perfect Career Path',
    heroSubtitle: 'Our AI-powered career assessment analyzes your skills, interests, personality traits, and market demand to match you with roles where you will thrive and grow.',
    stats: [
      { value: '94%', label: 'Assessment Accuracy' },
      { value: '12,000+', label: 'Careers Assessed' },
      { value: '85%', label: 'Satisfaction Rate' },
      { value: '3.2x', label: 'Faster Job Placement' },
    ],
    overview: {
      title: 'What Is Career Assessment?',
      desc: 'Our comprehensive career assessment goes beyond simple aptitude tests. Using psychometric evaluations, skills mapping, industry trend analysis, and AI-driven role matching, we build a detailed career blueprint tailored to your unique profile. Whether you are a fresh graduate uncertain about your next step, a mid-career professional considering a pivot, or someone re-entering the workforce, our assessment delivers clarity and actionable direction.',
    },
    features: [
      { icon: 'Brain', title: 'Psychometric Profiling', desc: 'Scientifically validated personality and aptitude assessments that reveal your natural strengths, work preferences, and ideal work environments.' },
      { icon: 'Target', title: 'AI Role Matching', desc: 'Our proprietary algorithm cross-references your profile with 4,000+ job roles across 30 industries to find your best-fit career paths.' },
      { icon: 'BarChart3', title: 'Skills Gap Analysis', desc: 'Detailed mapping of your current competencies against target role requirements, showing exactly what you need to develop.' },
      { icon: 'TrendingUp', title: 'Market Demand Scoring', desc: 'Real-time labour market data integration that ranks career paths by hiring volume, salary growth, and long-term outlook.' },
      { icon: 'Users', title: 'Expert Career Counselling', desc: 'One-on-one sessions with certified career coaches who interpret your results and help you build a personalised career roadmap.' },
      { icon: 'Lightbulb', title: 'Career Path Explorer', desc: 'Interactive visual maps showing multiple career trajectories, lateral moves, and progression paths from your current position.' },
    ],
    howItWorks: [
      { step: 1, title: 'Complete Your Profile', desc: 'Fill out a comprehensive profile covering your education, work experience, skills, interests, and career aspirations.' },
      { step: 2, title: 'Take the Assessment', desc: 'Complete a series of psychometric, aptitude, and behavioural assessments designed to evaluate your strengths and preferences.' },
      { step: 3, title: 'AI-Powered Analysis', desc: 'Our engine processes your results alongside real-time market data to generate your personalised career match report.' },
      { step: 4, title: 'Expert Review Session', desc: 'Meet with a career counsellor to review findings, discuss options, and refine your shortlisted career paths.' },
      { step: 5, title: 'Receive Your Career Blueprint', desc: 'Get a detailed report with matched roles, skill development plans, salary benchmarks, and a step-by-step action plan.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Eliminate Career Confusion', desc: 'Stop second-guessing your career choices. Our data-driven approach gives you objective clarity on where you belong.' },
      { icon: 'ArrowUpRight', title: 'Higher Earning Potential', desc: 'Professionals who align their careers with their natural strengths earn 23% more on average over their lifetime.' },
      { icon: 'Shield', title: 'Future-Proof Your Career', desc: 'Our market demand scoring ensures the career paths recommended to you have strong growth potential for the next decade.' },
      { icon: 'Clock', title: 'Save Years of Trial & Error', desc: 'Avoid costly career missteps. Get directed toward the right path from day one with evidence-based guidance.' },
      { icon: 'Award', title: 'Confidence in Decisions', desc: 'Make career pivots and educational investments with confidence, backed by comprehensive assessment data.' },
      { icon: 'Star', title: 'Personalised Roadmap', desc: 'Receive a tailored career blueprint with milestones, timelines, and concrete actions—not generic advice.' },
    ],
    deliverables: [
      { title: 'Comprehensive Assessment Report', desc: 'A 25+ page personalised report covering your psychometric profile, strengths map, and detailed career compatibility scores.' },
      { title: 'Top 10 Career Matches', desc: 'Rank-ordered list of career paths with compatibility percentages, salary ranges, growth outlook, and required qualifications.' },
      { title: 'Skills Gap Analysis Matrix', desc: 'Visual breakdown of current skills versus target role requirements with prioritised development recommendations.' },
      { title: 'Career Roadmap Document', desc: 'A 6–12 month action plan with milestones, learning resources, networking targets, and application strategies.' },
      { title: 'Counselling Session Recording', desc: 'Summary report and action items from your one-on-one expert career counselling session.' },
    ],
    whoIsFor: [
      {
        title: 'Fresh Graduates',
        desc: 'Students and recent graduates who are unsure which career path to pursue and need direction aligned with their strengths.',
        points: ['Unsure which industry or role fits your degree', 'Overwhelmed by career options after graduation', 'Want to make an informed first career choice', 'Need guidance on further education vs. entering the workforce'],
      },
      {
        title: 'Mid-Career Professionals',
        desc: 'Working professionals feeling stagnant or considering a career pivot who want data-driven insight into their next move.',
        points: ['Feeling stuck or unfulfilled in your current role', 'Considering a switch to a different industry or function', 'Want to understand transferable skills and new options', 'Planning a strategic career transition'],
      },
      {
        title: 'Career Re-entrants',
        desc: 'Professionals returning to the workforce after a break who need to reassess the market and identify the best re-entry point.',
        points: ['Returning after a career break for family or personal reasons', 'Industry landscape has changed since your last role', 'Need to identify roles that value your experience', 'Want to rebuild confidence with structured guidance'],
      },
      {
        title: 'Students Exploring Options',
        desc: 'College students or those in gap years who want to make informed decisions about their field of study and future career.',
        points: ['Choosing a major or specialisation', 'Deciding between further studies and entering the job market', 'Want to align education choices with career goals', 'Looking for internships in the right direction'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Discovery & Intake', items: ['Detailed profile creation with education, experience, and interests', 'Initial consultation call to understand your goals and concerns', 'Selection of relevant assessment modules based on your career stage'] },
      { phase: 'Phase 2', title: 'Assessment & Testing', items: ['Psychometric evaluation covering personality, aptitude, and work style', 'Technical and functional skills assessment as applicable', 'Behavioural preference questionnaire and values alignment exercise'] },
      { phase: 'Phase 3', title: 'Analysis & Matching', items: ['AI-driven cross-referencing of your profile with market roles', 'Integration of real-time labour market data and salary benchmarks', 'Expert review and validation of AI-generated matches'] },
      { phase: 'Phase 4', title: 'Counselling & Blueprint', items: ['One-on-one session with a certified career counsellor', 'Discussion of findings, trade-offs, and recommended paths', 'Delivery of final career blueprint with actionable next steps'] },
    ],
    techTools: ['CareerMapper AI', 'Holland Code Profiler', 'SHL Occupational Database', 'LinkedIn Skills Insights', 'Burning Glass Labour Market Data', 'O*NET Role Taxonomy', 'StrengthsFinder 2.0', 'CareerExplorer Platform', 'ATS Role Matching Engine', 'PayScale Compensation Database'],
    successMetrics: [
      { metric: 'Role Match Rate', desc: 'Percentage of clients who secure a role within their top 3 matched career paths', value: '89%' },
      { metric: 'Client Satisfaction', desc: 'Average satisfaction score from post-assessment feedback surveys', value: '4.8/5.0' },
      { metric: 'Time to Decision', desc: 'Average time from assessment completion to making a clear career decision', value: '14 Days' },
      { metric: 'Placement Acceleration', desc: 'Average reduction in job search duration compared to unassisted professionals', value: '3.2x Faster' },
    ],
    industries: ['Information Technology', 'Financial Services', 'Healthcare & Pharma', 'Manufacturing & Engineering', 'Education & EdTech', 'Retail & E-Commerce', 'Media & Entertainment', 'Consulting & Professional Services'],
    testimonials: [
      { name: 'Arjun Mehta', role: 'Software Engineer at Infosys', text: 'The career assessment completely changed my perspective. I was pursuing data science when the assessment revealed my strengths were better suited for product management. Six months later, I landed my dream PM role at a top startup.' },
      { name: 'Priya Sharma', role: 'Marketing Lead at Razorpay', text: 'After 7 years in content writing, I was unsure about my next move. The psychometric profiling showed strong strategic thinking scores, and the counsellor helped me plan a transition to marketing strategy. Best investment I have made in my career.' },
      { name: 'Vikram Nair', role: 'Business Analyst at Deloitte', text: 'As a fresh MBA graduate, I was overwhelmed by options. The assessment narrowed 50+ possibilities down to 10 high-fit paths, and the skills gap analysis told me exactly what certifications to pursue. Got placed within 3 months.' },
    ],
    compareBeforeAfter: [
      { before: 'Unsure which career direction to take', after: 'Clear, data-backed career path with matched roles' },
      { before: 'Applying to random jobs hoping for a fit', after: 'Targeted applications aligned with your strengths and goals' },
      { before: 'Guessing which skills to develop next', after: 'Prioritised skill development plan based on role requirements' },
      { before: 'Making career decisions based on peer pressure', after: 'Objective, personalised guidance from certified counsellors' },
      { before: 'No understanding of market demand for your skills', after: 'Real-time labour market insights and salary benchmark data' },
    ],
    relatedServices: ['skills-readiness', 'resume-branding', 'ai-job-matching'],
    ctaTitle: 'Ready to Discover Your Ideal Career?',
    ctaDesc: 'Take our AI-powered career assessment today and receive a personalised career blueprint with your top matched roles, skills gap analysis, and expert counselling session. Stop guessing—start knowing.',
  },

  // ─── 2. Resume & Personal Branding ────────────────────────────────────
  {
    slug: 'resume-branding',
    num: '02',
    name: 'Make Your Profile Impossible to Ignore',
    subtitle: 'Resume, LinkedIn & Personal Branding',
    desc: 'Build a professional profile designed to get noticed by recruiters and hiring managers.',
    icon: 'FileText',
    color: '#7C3AED',
    gradientFrom: '#7C3AED',
    gradientTo: '#5B21B6',
    heroTitle: 'Craft a Profile That Opens Doors',
    heroSubtitle: 'From ATS-optimised resumes to a compelling LinkedIn presence, we build your professional brand so recruiters find you—and choose you.',
    stats: [
      { value: '92%', label: 'Interview Rate' },
      { value: '8,500+', label: 'Profiles Optimised' },
      { value: '3x', label: 'More Recruiter Views' },
      { value: '95%', label: 'ATS Pass Rate' },
    ],
    overview: {
      title: 'What Is Professional Branding?',
      desc: 'Your resume, LinkedIn profile, and online presence form the first impression recruiters have of you. Our branding service combines ATS-optimisation expertise, industry-specific keyword strategies, and personal storytelling to create a cohesive professional identity. We do not just format your CV—we engineer it to pass automated filters, capture attention in 6 seconds, and position you as the ideal candidate for your target roles.',
    },
    features: [
      { icon: 'Search', title: 'ATS-Optimised Resume Design', desc: 'Resumes engineered to pass Applicant Tracking Systems used by 98% of Fortune 500 companies, with strategic keyword placement and formatting.' },
      { icon: 'Globe', title: 'LinkedIn Profile Overhaul', desc: 'Complete LinkedIn transformation including headline, about section, experience bullet points, and recommendations strategy for maximum visibility.' },
      { icon: 'Code2', title: 'Keyword Strategy Engine', desc: 'AI analysis of target job descriptions to identify the exact keywords, phrases, and competencies recruiters are scanning for in your field.' },
      { icon: 'Eye', title: 'Visual Brand Identity', desc: 'Custom professional visual assets including resume design templates, LinkedIn banner, and consistent colour palette across all platforms.' },
      { icon: 'Briefcase', title: 'Industry-Specific Formatting', desc: 'Tailored resume formats for different industries—creative portfolios for design, technical layouts for engineering, executive formats for leadership.' },
      { icon: 'Rocket', title: 'Personal Brand Narrative', desc: 'Crafting a compelling career story that connects your experience, achievements, and aspirations into a powerful professional narrative.' },
    ],
    howItWorks: [
      { step: 1, title: 'Submit Your Current Profile', desc: 'Share your existing resume, LinkedIn profile, target roles, and any additional materials you want us to work with.' },
      { step: 2, title: 'Target Role Analysis', desc: 'We analyse job postings for your target roles to identify required keywords, skills, and competencies that must be included.' },
      { step: 3, title: 'Content Strategy Session', desc: 'A focused call with our branding specialist to uncover your key achievements, unique value proposition, and career narrative.' },
      { step: 4, title: 'Resume & Profile Creation', desc: 'Our team crafts your ATS-optimised resume and LinkedIn makeover with strategic keyword placement and compelling copywriting.' },
      { step: 5, title: 'Review & Delivery', desc: 'You review drafts, request revisions, and receive final files in multiple formats—PDF, Word, and LinkedIn-ready text.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Get Past the ATS Gatekeepers', desc: '95% of large companies use ATS to filter resumes. Our optimisation ensures your profile passes these automated filters every time.' },
      { icon: 'ArrowUpRight', title: '3x More Recruiter Outreach', desc: 'An optimised LinkedIn profile generates 3x more InMail and recruiter views, putting opportunities in your inbox.' },
      { icon: 'Shield', title: 'Consistent Professional Image', desc: 'Present a cohesive brand across your resume, LinkedIn, portfolio, and other platforms for instant credibility.' },
      { icon: 'Clock', title: 'Save 40+ Hours of DIY Effort', desc: 'Stop spending weeks tweaking your resume. Get a professionally crafted profile in a fraction of the time.' },
      { icon: 'Award', title: 'Stand Out in 6 Seconds', desc: 'Recruiters spend an average of 6 seconds on a resume. Our layouts ensure your key selling points are impossible to miss.' },
      { icon: 'Star', title: 'Tailored for Each Application', desc: 'Receive modular templates and keyword guides so you can quickly customise your profile for each application.' },
    ],
    deliverables: [
      { title: 'ATS-Optimised Resume (PDF + Word)', desc: 'A professionally designed resume with strategic keyword placement, clean formatting, and ATS-compatible structure in both PDF and editable Word formats.' },
      { title: 'LinkedIn Profile Transformation', desc: 'Complete rewrite of headline, summary, experience descriptions, and skills section with SEO-optimised keywords and compelling narrative.' },
      { title: 'Cover Letter Templates', desc: 'Three customisable cover letter templates tailored to your industry and target roles, ready for each application.' },
      { title: 'Personal Brand Guide', desc: 'A 10-page guide covering your unique value proposition, elevator pitch, key talking points, and social media strategy.' },
      { title: 'Visual Brand Assets', desc: 'Custom LinkedIn banner, professional colour palette, and typography guide for consistent visual identity across platforms.' },
    ],
    whoIsFor: [
      {
        title: 'Job Seekers',
        desc: 'Active job seekers who need a competitive edge in a crowded market and want their application to stand out to recruiters.',
        points: ['Your current resume is not generating interview calls', 'You are applying but getting no responses from ATS systems', 'Need a professional overhaul before a serious job search', 'Want to target higher-level or higher-paying roles'],
      },
      {
        title: 'Career Switchers',
        desc: 'Professionals pivoting to a new industry who need to reposition their experience and highlight transferable skills.',
        points: ['Moving to a different industry or functional area', 'Need to reframe past experience for a new audience', 'Lack direct experience in your target field', 'Want to build credibility in an unfamiliar domain'],
      },
      {
        title: 'Senior Professionals',
        desc: 'Executives and senior managers who need a polished, boardroom-ready professional brand for leadership opportunities.',
        points: ['Targeting C-suite, VP, or director-level positions', 'Current profile does not reflect your leadership scope', 'Need an executive resume format with board-level messaging', 'Building a personal brand for thought leadership'],
      },
      {
        title: 'Passive Candidates',
        desc: 'Employed professionals who want to be discoverable by recruiters and open to better opportunities without actively searching.',
        points: ['Not actively applying but open to the right opportunity', 'LinkedIn profile has not been updated in over a year', 'Want recruiters to find you for premium roles', 'Building a long-term professional brand presence'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Audit & Intake', items: ['Review of existing resume, LinkedIn, and online presence', 'ATS compatibility check on current materials', 'Identification of target roles, industries, and salary bands'] },
      { phase: 'Phase 2', title: 'Strategy & Storytelling', items: ['Deep-dive call to extract achievements, metrics, and career highlights', 'Keyword research from target job descriptions', 'Development of unique value proposition and brand narrative'] },
      { phase: 'Phase 3', title: 'Content Creation', items: ['Resume writing with ATS optimisation and achievement-focused bullet points', 'LinkedIn profile rewrite with keyword-rich headline and summary', 'Cover letter templates and personal brand guide creation'] },
      { phase: 'Phase 4', title: 'Refinement & Delivery', items: ['Client review with two rounds of revisions included', 'ATS simulation testing to verify pass rates', 'Final delivery in PDF, Word, and plain-text formats'] },
    ],
    techTools: ['JobScan ATS Checker', 'ResumeWorded AI', 'LinkedIn Optimiser Pro', 'Grammarly Business', 'Canva Professional', 'Teal Resume Builder', 'VMock Resume Score', 'Colorlib Resume Templates', 'Hemingway Editor', 'Google Docs Professional Templates'],
    successMetrics: [
      { metric: 'ATS Pass Rate', desc: 'Percentage of optimised resumes that pass automated ATS screening on first submission', value: '95%' },
      { metric: 'Interview Conversion', desc: 'Percentage of clients who receive at least one interview call within 30 days of profile update', value: '92%' },
      { metric: 'LinkedIn Visibility Boost', desc: 'Average increase in LinkedIn profile views and recruiter impressions after optimisation', value: '3x Increase' },
      { metric: 'Client Revision Satisfaction', desc: 'Percentage of clients satisfied with the final deliverable after revision rounds', value: '97%' },
    ],
    industries: ['Information Technology', 'Financial Services & Banking', 'Healthcare & Pharma', 'Management Consulting', 'Manufacturing & Engineering', 'Retail & E-Commerce', 'Media & Advertising', 'Education & EdTech'],
    testimonials: [
      { name: 'Sneha Reddy', role: 'Product Manager at Microsoft', text: 'My resume went from zero callbacks to 5 interview invitations in the first two weeks. The keyword optimisation was a game-changer—every recruiter who reached out mentioned specific skills highlighted in my new profile.' },
      { name: 'Rahul Kapoor', role: 'VP of Engineering at Swiggy', text: 'I was sceptical about LinkedIn optimisation, but my profile views tripled within a month. Two executive recruiters reached out directly with roles I would never have found on job boards. The investment paid for itself tenfold.' },
      { name: 'Ananya Gupta', role: 'UX Designer at Google', text: 'As a career switcher from graphic design to UX, I needed help reframing my experience. The team crafted a narrative that positioned my design background as a strength, not a gap. Landed my dream role at Google within 6 weeks.' },
    ],
    compareBeforeAfter: [
      { before: 'Resume gets rejected by ATS systems silently', after: '95% ATS pass rate with strategically placed keywords' },
      { before: 'Generic LinkedIn profile with 10 profile views per month', after: 'Optimised profile generating 3x more recruiter views and InMails' },
      { before: 'Resume lists duties instead of achievements', after: 'Impact-driven bullet points with quantified results and metrics' },
      { before: 'Inconsistent branding across platforms', after: 'Cohesive professional brand identity with unified visual design' },
      { before: 'No clear personal value proposition', after: 'Compelling career narrative that differentiates you from other candidates' },
    ],
    relatedServices: ['career-assessment', 'job-search-strategy', 'ai-job-matching'],
    ctaTitle: 'Ready to Build a Profile That Gets You Hired?',
    ctaDesc: 'Stop sending resumes into the void. Get an ATS-optimised resume, LinkedIn transformation, and personal brand strategy that puts you in front of the right recruiters. Your next career move starts here.',
  },

  // ─── 3. Skills & Career Readiness ─────────────────────────────────────
  {
    slug: 'skills-readiness',
    num: '03',
    name: 'Become the Candidate Employers Want',
    subtitle: 'Skills & Career Readiness',
    desc: 'Close your skill gaps and build the practical capabilities required for your target roles.',
    icon: 'GraduationCap',
    color: '#10B981',
    gradientFrom: '#10B981',
    gradientTo: '#059669',
    heroTitle: 'Bridge the Gap Between Where You Are and Where You Want to Be',
    heroSubtitle: 'Our skills readiness programme identifies your exact skill gaps and provides structured, project-based learning paths to make you job-ready for your target role.',
    stats: [
      { value: '90%', label: 'Job Readiness Score' },
      { value: '15,000+', label: 'Skills Trained' },
      { value: '78%', label: 'Faster Skill Acquisition' },
      { value: '4.7/5', label: 'Learning Experience Rating' },
    ],
    overview: {
      title: 'What Is Skills & Career Readiness?',
      desc: 'Most job seekers know they need new skills but do not know which ones matter most or how to build them efficiently. Our skills readiness programme uses AI to analyse the gap between your current capabilities and your target role requirements, then delivers a structured learning path with hands-on projects, mentorship, and progress tracking. We focus on practical, employer-validated skills—not just theoretical knowledge.',
    },
    features: [
      { icon: 'BarChart3', title: 'Precision Skills Gap Analysis', desc: 'AI-powered comparison of your current skill set against target role requirements, quantifying every gap with priority scores.' },
      { icon: 'BookOpen', title: 'Structured Learning Paths', desc: 'Curated learning roadmaps combining online courses, hands-on projects, and micro-credentials tailored to your career goals.' },
      { icon: 'Code2', title: 'Project-Based Learning', desc: 'Real-world projects that simulate actual job tasks, building practical skills that employers value and want to see on your resume.' },
      { icon: 'Users', title: 'Mentorship & Peer Learning', desc: 'Access to industry mentors for guidance, feedback on projects, and career advice, plus a community of peers on the same journey.' },
      { icon: 'Cpu', title: 'AI Progress Tracking', desc: 'Real-time dashboards that track your skill development, completion rates, and readiness score as you progress through your learning path.' },
      { icon: 'Award', title: 'Industry Micro-Credentials', desc: 'Earn recognised micro-credentials and skill badges upon completing modules, adding verified competencies to your professional profile.' },
    ],
    howItWorks: [
      { step: 1, title: 'Skills Assessment', desc: 'Take a comprehensive skills evaluation covering technical, functional, and soft skills relevant to your target role.' },
      { step: 2, title: 'Gap Identification', desc: 'Our AI analyses the delta between your current skills and target role requirements, ranking each gap by priority and impact.' },
      { step: 3, title: 'Personalised Learning Path', desc: 'Receive a structured curriculum with recommended courses, projects, and milestones designed to close your specific gaps efficiently.' },
      { step: 4, title: 'Learn & Build', desc: 'Work through courses, complete hands-on projects, participate in mentor sessions, and track your progress in real time.' },
      { step: 5, title: 'Readiness Certification', desc: 'Complete all milestones, pass the final assessment, and receive a Job Readiness Certificate with your verified skills profile.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Faster Skill Building', desc: 'Our targeted approach means you only learn what you need, reducing wasted time on irrelevant content by up to 78%.' },
      { icon: 'ArrowUpRight', title: 'Higher Starting Salary', desc: 'Professionals who close skill gaps before applying negotiate 18–25% higher starting salaries than those who learn on the job.' },
      { icon: 'Shield', title: 'Employer-Validated Curriculum', desc: 'All learning content is sourced from employer requirements, ensuring every skill you build is one companies actually hire for.' },
      { icon: 'Clock', title: 'Flexible, Self-Paced Learning', desc: 'Complete modules on your schedule with lifetime access to all learning materials, projects, and mentor recordings.' },
      { icon: 'Award', title: 'Verified Credentials', desc: 'Earn micro-credentials and skill badges that are verifiable and shareable on LinkedIn and your resume.' },
      { icon: 'Star', title: 'Real-World Project Portfolio', desc: 'Graduate with a portfolio of 3–5 completed projects that demonstrate your new skills to employers.' },
    ],
    deliverables: [
      { title: 'Skills Gap Report', desc: 'A detailed report mapping every skill gap between your current profile and target role, prioritised by impact and hiring relevance.' },
      { title: 'Personalised Learning Curriculum', desc: 'A structured 8–16 week learning path with specific courses, projects, reading materials, and milestone checkpoints.' },
      { title: 'Project Portfolio', desc: '3–5 completed real-world projects with documentation, code repositories, and presentation materials for your professional portfolio.' },
      { title: 'Job Readiness Certificate', desc: 'A verified certificate confirming your readiness score, completed skills, and proficiency levels for your target role.' },
      { title: 'Progress Dashboard Access', desc: 'Ongoing access to your personalised learning dashboard tracking skill scores, completion rates, and readiness metrics.' },
    ],
    whoIsFor: [
      {
        title: 'Aspiring Tech Professionals',
        desc: 'Individuals looking to enter or advance in technology roles who need to build in-demand technical and functional skills.',
        points: ['Want to transition into software development, data science, or cloud computing', 'Have theoretical knowledge but lack practical, project-based experience', 'Need to learn specific tools and frameworks required by target companies', 'Want a structured path instead of random online courses'],
      },
      {
        title: 'Upskilling Professionals',
        desc: 'Working professionals who need to add new skills to stay relevant or qualify for promotions in their current field.',
        points: ['Technology in your field is evolving and your skills are becoming outdated', 'Missed out on a promotion due to a specific skill gap', 'Want to add a technical skill to a non-technical role (e.g., marketing + analytics)', 'Need to demonstrate continuous learning for performance reviews'],
      },
      {
        title: 'Career Switchers',
        desc: 'Professionals moving to a new domain who need to build foundational and intermediate skills in their new field.',
        points: ['Switching from one industry to another (e.g., finance to tech)', 'Have transferable soft skills but need new domain-specific hard skills', 'Need to prove competence in a new field to potential employers', 'Want a credible, structured alternative to another full degree'],
      },
      {
        title: 'Fresh Graduates',
        desc: 'Recent graduates whose academic knowledge does not match the practical skills employers demand in the real world.',
        points: ['Your degree did not cover the tools and frameworks used in industry', 'Employers say you lack practical experience', 'Need to bridge the gap between academic learning and job requirements', 'Want to stand out from other fresh graduates in campus placements'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Skills Diagnosis', items: ['Comprehensive technical and functional skills assessment', 'Comparison against target role job descriptions from real postings', 'Identification and prioritisation of skill gaps by hiring relevance'] },
      { phase: 'Phase 2', title: 'Curriculum Design', items: ['Custom learning path creation with recommended courses and resources', 'Project assignments designed to simulate real job tasks', 'Mentor matching based on your target industry and role'] },
      { phase: 'Phase 3', title: 'Active Learning', items: ['Self-paced course completion with progress tracking', 'Hands-on project work with mentor feedback and code reviews', 'Peer learning sessions and community discussions'] },
      { phase: 'Phase 4', title: 'Certification & Placement', items: ['Final skills assessment and readiness scoring', 'Portfolio compilation and resume integration of new skills', 'Job Readiness Certificate issuance and LinkedIn skill endorsements'] },
    ],
    techTools: ['Coursera for Business', 'Udemy Business', 'Pluralsight', 'GitHub Learning Lab', 'Kaggle Learn', 'LeetCode Practice', 'HackerRank Skills', 'LinkedIn Learning', 'CodeSignal', 'DataCamp'],
    successMetrics: [
      { metric: 'Skill Gap Closure Rate', desc: 'Average percentage of identified skill gaps closed upon programme completion', value: '90%' },
      { metric: 'Time to Job Readiness', desc: 'Average duration from programme start to achieving a job-ready readiness score', value: '12 Weeks' },
      { metric: 'Placement Rate', desc: 'Percentage of programme graduates who secure a role in their target field within 90 days', value: '82%' },
      { metric: 'Skill Retention Rate', desc: 'Percentage of learned skills retained and demonstrated in final assessments', value: '88%' },
    ],
    industries: ['Information Technology', 'Data Science & Analytics', 'Cloud Computing & DevOps', 'Cybersecurity', 'Financial Technology', 'Healthcare IT', 'E-Commerce & Retail Tech', 'Digital Marketing'],
    testimonials: [
      { name: 'Deepak Joshi', role: 'Data Analyst at Flipkart', text: 'I had a commerce background and wanted to break into data analytics. The skills readiness programme identified exactly which tools I needed—SQL, Python, Tableau—and gave me real projects to build proficiency. Got hired at Flipkart within 2 months of completing the programme.' },
      { name: 'Kavitha Rajan', role: 'Cloud Engineer at TCS', text: 'After 5 years in traditional IT support, I wanted to move into cloud engineering. The gap analysis was spot-on—it showed me I needed AWS certifications and Kubernetes experience. The structured learning path made it achievable while working full-time.' },
      { name: 'Nikhil Patel', role: 'Full-Stack Developer at Zoho', text: 'As a fresh CS graduate, I knew theory but had no real projects. The programme gave me 5 portfolio-worthy projects with mentor feedback. Employers were impressed by the practical experience—something my degree alone could not provide.' },
    ],
    compareBeforeAfter: [
      { before: 'Vague idea that you need "more skills" but unsure which ones', after: 'Precise gap analysis with prioritised skills ranked by hiring relevance' },
      { before: 'Random online courses with no structure or completion', after: 'Structured learning path with milestones, mentorship, and accountability' },
      { before: 'Resume lists theoretical knowledge with no proof of ability', after: 'Portfolio of real projects demonstrating practical competence' },
      { before: 'Applying to roles you are not qualified for', after: 'Targeting roles where your skills match or exceed requirements' },
      { before: 'No verifiable proof of new competencies', after: 'Industry-recognised micro-credentials and job readiness certificate' },
    ],
    relatedServices: ['career-assessment', 'portfolio-development', 'mock-interviews'],
    ctaTitle: 'Ready to Become the Candidate Employers Fight Over?',
    ctaDesc: 'Stop guessing which skills you need. Our AI-powered assessment pinpoints your exact gaps and builds a personalised learning path to make you job-ready. Start closing your skill gaps today.',
  },

  // ─── 4. Portfolio & Real-World Project Development ───────────────────
  {
    slug: 'portfolio-development',
    num: '04',
    name: 'Turn Your Skills Into Proof',
    subtitle: 'Portfolio & Real-World Project Development',
    desc: 'Build real projects that demonstrate what you can actually do—not just what you learned.',
    icon: 'FolderOpen',
    color: '#F97316',
    gradientFrom: '#F97316',
    gradientTo: '#C2410C',
    heroTitle: 'Show, Don\'t Tell—Build a Portfolio That Speaks for Itself',
    heroSubtitle: 'Employers hire based on proof, not promises. Our portfolio development programme helps you build industry-relevant projects that demonstrate real skills and get you hired.',
    stats: [
      { value: '88%', label: 'Hiring Rate with Portfolio' },
      { value: '6,200+', label: 'Portfolios Built' },
      { value: '4.9/5', label: 'Employer Impression Score' },
      { value: '5', label: 'Projects per Portfolio' },
    ],
    overview: {
      title: 'What Is Portfolio Development?',
      desc: 'In competitive job markets, a strong portfolio is the single most powerful differentiator. Our portfolio development programme pairs you with industry mentors to design and build 4–6 real-world projects that mirror actual job tasks. Each project is documented, deployed, and presented in a professional portfolio format that employers can evaluate. We focus on quality, relevance, and presentation—not just code or design exercises.',
    },
    features: [
      { icon: 'Target', title: 'Role-Specific Projects', desc: 'Projects designed to match the exact tasks and challenges you would face in your target role, ensuring portfolio relevance to hiring managers.' },
      { icon: 'Cpu', title: 'AI-Powered Project Matching', desc: 'Our AI analyses trending projects in your field, employer preferences, and your skill level to recommend the highest-impact portfolio pieces.' },
      { icon: 'Globe', title: 'Live Deployment & Hosting', desc: 'Every project is deployed to a live environment with a custom domain, so employers can interact with your work directly—not just see screenshots.' },
      { icon: 'BookOpen', title: 'Technical Documentation', desc: 'Comprehensive documentation for each project including architecture diagrams, API references, and decision logs that demonstrate engineering thinking.' },
      { icon: 'Eye', title: 'Portfolio Website Creation', desc: 'A professionally designed personal portfolio website to showcase all projects, skills, and your professional brand in one cohesive experience.' },
      { icon: 'Users', title: 'Expert Mentor Guidance', desc: 'Weekly sessions with industry mentors who provide technical reviews, design feedback, and career advice throughout the project development process.' },
    ],
    howItWorks: [
      { step: 1, title: 'Portfolio Strategy Workshop', desc: 'Define your target roles, identify the types of projects that impress hiring managers, and plan your portfolio architecture.' },
      { step: 2, title: 'Project Selection & Planning', desc: 'Choose 4–6 projects from our curated library or propose custom projects, with detailed technical specifications and timelines for each.' },
      { step: 3, title: 'Build & Iterate', desc: 'Develop each project with mentor support, including code reviews, design critiques, and technical challenges that push your skills.' },
      { step: 4, title: 'Document & Deploy', desc: 'Create professional documentation, deploy projects to live environments, and record demo videos or walkthroughs for each piece.' },
      { step: 5, title: 'Portfolio Launch & Optimisation', desc: 'Assemble everything into a polished portfolio website, optimise for discoverability, and prepare a portfolio presentation script.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Prove Your Skills Tangibly', desc: 'A portfolio eliminates the "I know but can\'t show" problem. Every project is living proof of what you can deliver.' },
      { icon: 'ArrowUpRight', title: '88% Higher Hiring Rate', desc: 'Candidates with a professional portfolio are 88% more likely to receive a job offer compared to those without one.' },
      { icon: 'Shield', title: 'Stand Out in Every Interview', desc: 'When every candidate has a similar degree, your portfolio becomes the differentiator that interviewers remember.' },
      { icon: 'Clock', title: 'Build While You Learn', desc: 'Portfolio projects double as learning experiences—you acquire new skills while creating assets that advance your career.' },
      { icon: 'Award', title: 'Industry-Grade Quality', desc: 'Mentor-guided projects meet professional standards, not academic exercise quality, impressing even senior hiring managers.' },
      { icon: 'Star', title: 'Passive Career Asset', desc: 'Your portfolio works for you 24/7—recruiters discover it, hiring managers review it, and opportunities come to you.' },
    ],
    deliverables: [
      { title: '4–6 Deployed Projects', desc: 'Live, deployed projects accessible via URLs with complete source code, documentation, and demo walkthroughs for each.' },
      { title: 'Professional Portfolio Website', desc: 'A custom-designed, responsive portfolio website showcasing all projects with case study format, skills section, and contact form.' },
      { title: 'Project Case Studies', desc: 'Detailed case studies for each project covering problem statement, technical approach, challenges faced, and solutions implemented.' },
      { title: 'Demo Videos & Screenshots', desc: 'High-quality screen recordings and screenshots for each project, ready for portfolio display and interview presentations.' },
      { title: 'GitHub Repository Organisation', desc: 'Clean, well-documented GitHub profile with professional README files, consistent naming, and impressive contribution graphs.' },
    ],
    whoIsFor: [
      {
        title: 'Software Developers & Engineers',
        desc: 'Developers who need a strong portfolio to showcase their coding skills, system design thinking, and project experience.',
        points: ['Have coding skills but no impressive projects to show', 'GitHub profile is empty or contains only tutorial exercises', 'Need full-stack or system-level projects for job applications', 'Want to demonstrate architecture and design decisions'],
      },
      {
        title: 'Designers & Creative Professionals',
        desc: 'UI/UX designers, graphic designers, and creative professionals who need a curated portfolio to showcase their design thinking and craft.',
        points: ['Design work is scattered across personal files with no cohesive presentation', 'Need case studies that show your design process, not just final screens', 'Applying to companies that require a portfolio link in the application', 'Want a portfolio website that reflects your personal design aesthetic'],
      },
      {
        title: 'Data Scientists & Analysts',
        desc: 'Data professionals who need to demonstrate analytical thinking, modelling skills, and the ability to derive insights from real datasets.',
        points: ['Have completed courses but no end-to-end data science projects', 'Need Jupyter notebooks, dashboards, and model deployments to show', 'Want to demonstrate data cleaning, EDA, modelling, and visualisation skills', 'Applying for roles that require portfolio review as part of the process'],
      },
      {
        title: 'Product & Marketing Professionals',
        desc: 'Product managers, marketers, and business professionals who need to showcase strategy work, case studies, and measurable outcomes.',
        points: ['Have achieved results but no documented case studies', 'Need to demonstrate strategic thinking and business impact', 'Applying for roles that ask for a portfolio or work samples', 'Want to transition from corporate confidentiality to demonstrable work'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Strategy & Planning', items: ['Target role analysis to identify portfolio requirements and expectations', 'Portfolio audit of existing work and assets', 'Project selection and prioritisation based on impact and skill coverage'] },
      { phase: 'Phase 2', title: 'Development Sprint', items: ['Mentor-guided project development with weekly check-ins', 'Code/design reviews with detailed feedback and iteration', 'Technical challenge integration to push beyond comfort zone'] },
      { phase: 'Phase 3', title: 'Documentation & Deployment', items: ['Technical documentation, architecture diagrams, and decision logs', 'Live deployment to cloud hosting with custom domains', 'Demo recording, screenshot capture, and case study writing'] },
      { phase: 'Phase 4', title: 'Portfolio Assembly & Launch', items: ['Portfolio website design and development with responsive layout', 'Content integration, SEO optimisation, and performance tuning', 'Portfolio presentation training and interview prep integration'] },
    ],
    techTools: ['GitHub Pages', 'Vercel', 'Netlify', 'Figma', 'Notion', 'Dribbble', 'Behance', 'AWS Amplify', 'Docker Hub', 'MongoDB Atlas'],
    successMetrics: [
      { metric: 'Portfolio Completion Rate', desc: 'Percentage of enrolled clients who complete and launch a professional portfolio', value: '96%' },
      { metric: 'Employer Engagement', desc: 'Average number of positive employer interactions (views, saves, shares) per portfolio within 60 days', value: '24+' },
      { metric: 'Interview Attribution', desc: 'Percentage of clients who credit their portfolio as a key factor in receiving interview invitations', value: '84%' },
      { metric: 'Project Quality Score', desc: 'Average mentor-assessed quality score for completed portfolio projects on a 10-point scale', value: '8.7/10' },
    ],
    industries: ['Software Development', 'UI/UX Design', 'Data Science & Machine Learning', 'Product Management', 'Cloud Computing', 'Digital Marketing & Growth', 'Game Development', 'Mobile App Development'],
    testimonials: [
      { name: 'Meghna Iyer', role: 'Senior Frontend Developer at Atlassian', text: 'My portfolio was the reason I got called for interviews at Atlassian. The mentor pushed me to build a real-time collaboration tool that demonstrated exactly the kind of system design thinking they look for. The project literally became my interview talking point.' },
      { name: 'Suresh Kumar', role: 'Data Scientist at Amazon', text: 'I had completed multiple ML courses but no portfolio projects. The programme helped me build an end-to-end recommendation engine with a live demo. Amazon\'s hiring manager said my portfolio was the strongest among all candidates.' },
      { name: 'Pooja Nair', role: 'UX Designer at Myntra', text: 'As a self-taught designer, I lacked formal projects. The portfolio programme gave me 5 case studies with real design challenges, user research, and iteration cycles. Myntra\'s design lead specifically mentioned my case study depth during the interview.' },
    ],
    compareBeforeAfter: [
      { before: 'No tangible proof of your skills beyond a resume', after: '4–6 deployed projects with live URLs that employers can experience' },
      { before: 'GitHub profile with random tutorial exercises', after: 'Professional GitHub with well-documented, architecturally sound projects' },
      { before: 'Telling interviewers what you can do', after: 'Showing interviewers deployed projects with live demos and documentation' },
      { before: 'No online presence or discoverable work', after: 'SEO-optimised portfolio website that recruiters find organically' },
      { before: 'Generic portfolio with no narrative or context', after: 'Case study format with problem, approach, challenges, and outcomes' },
    ],
    relatedServices: ['skills-readiness', 'resume-branding', 'mock-interviews'],
    ctaTitle: 'Stop Talking About Your Skills—Start Showing Them',
    ctaDesc: 'Build a professional portfolio with 4–6 real-world projects, live deployments, and expert mentorship. Employers hire based on proof—give them something they cannot ignore.',
  },

  // ─── 5. AI-Powered Job & Role Matching ───────────────────────────────
  {
    slug: 'ai-job-matching',
    num: '05',
    name: 'Get Matched With the Right Jobs',
    subtitle: 'AI-Powered Job & Role Matching',
    desc: 'Discover relevant opportunities matched to your skills, experience, career goals and preferred roles.',
    icon: 'Brain',
    color: '#EF4444',
    gradientFrom: '#EF4444',
    gradientTo: '#B91C1C',
    heroTitle: 'Let AI Find the Jobs Meant for You',
    heroSubtitle: 'Stop scrolling through thousands of irrelevant listings. Our AI analyses your profile, preferences, and career goals to match you with jobs where you have the highest chance of success.',
    stats: [
      { value: '96%', label: 'Match Accuracy' },
      { value: '50,000+', label: 'Jobs Matched Daily' },
      { value: '4.8x', label: 'More Relevant Matches' },
      { value: '72%', label: 'Application-to-Interview Rate' },
    ],
    overview: {
      title: 'What Is AI Job Matching?',
      desc: 'Traditional job search is broken—you spend hours filtering irrelevant listings, and most applications vanish into black holes. Our AI-powered job matching engine analyses your complete professional profile—skills, experience, preferences, salary expectations, and career trajectory—to surface only the most relevant opportunities. We match you not just by keywords but by role fit, culture alignment, growth potential, and compensation compatibility.',
    },
    features: [
      { icon: 'Brain', title: 'Deep Profile Analysis', desc: 'Our AI goes beyond resume keywords to understand your full professional context, including career trajectory, skill depth, and growth patterns.' },
      { icon: 'Target', title: 'Multi-Dimensional Matching', desc: 'Matches based on 15+ criteria including skills, experience level, industry, company culture, growth potential, commute preferences, and compensation range.' },
      { icon: 'Zap', title: 'Real-Time Opportunity Alerts', desc: 'Instant notifications when new roles matching your profile are posted, so you are among the first to apply—a critical advantage for competitive positions.' },
      { icon: 'TrendingUp', title: 'Market Intelligence', desc: 'Salary benchmarking, demand trends, and hiring velocity data for every matched role, so you know the market value of each opportunity.' },
      { icon: 'Search', title: 'Hidden Job Discovery', desc: 'We surface opportunities from company career pages, referral networks, and unlisted positions that are not on major job boards.' },
      { icon: 'BarChart3', title: 'Match Quality Scoring', desc: 'Each job match includes a quality score with a detailed breakdown of why it fits, what gaps exist, and how strong your candidacy is.' },
    ],
    howItWorks: [
      { step: 1, title: 'Create Your Match Profile', desc: 'Build a comprehensive profile with your skills, experience, target roles, salary expectations, location preferences, and career goals.' },
      { step: 2, title: 'AI Engine Calibration', desc: 'Our matching engine processes your profile against our database of 50,000+ active job listings and hiring patterns.' },
      { step: 3, title: 'Receive Matched Opportunities', desc: 'Get a curated list of high-fit job matches ranked by relevance, with quality scores and detailed fit analysis for each.' },
      { step: 4, title: 'Apply with Optimised Materials', desc: 'Use your tailored resume and cover letter (from our branding service) for each matched application for maximum impact.' },
      { step: 5, title: 'Track & Iterate', desc: 'Monitor application status, get feedback on match performance, and refine your profile for even better matches over time.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Stop Wasting Time on Bad Matches', desc: 'No more applying to roles where you are overqualified, underqualified, or culturally misaligned. Every match is high-relevance.' },
      { icon: 'ArrowUpRight', title: 'Apply First, Get Noticed', desc: 'Real-time alerts mean you apply within hours of posting, not days—when applications are reviewed most carefully.' },
      { icon: 'Shield', title: 'Comprehensive Match Transparency', desc: 'Know exactly why a role matches, what the gaps are, and your realistic chances before you invest time in applying.' },
      { icon: 'Clock', title: 'Save 20+ Hours Per Week', desc: 'Eliminate manual job searching. Our AI does the scanning, filtering, and ranking—delivered to your dashboard daily.' },
      { icon: 'Award', title: 'Access Hidden Opportunities', desc: 'Discover roles from referral networks, company career pages, and confidential listings that typical job seekers never see.' },
      { icon: 'Star', title: 'Data-Driven Career Decisions', desc: 'Market intelligence with each match helps you negotiate better, choose between offers, and plan your career strategically.' },
    ],
    deliverables: [
      { title: 'Matched Job Dashboard', desc: 'A personalised dashboard with daily updated job matches, quality scores, and detailed fit analysis for each opportunity.' },
      { title: 'Weekly Match Report', desc: 'A summary report of new matches, application tracking, market trends in your target roles, and recommended adjustments to your profile.' },
      { title: 'Salary Benchmark Data', desc: 'Real-time salary data for each matched role including base, bonus, and equity ranges based on location, experience, and company size.' },
      { title: 'Application Tracker', desc: 'A centralised tracker for all applications with status updates, follow-up reminders, and response rate analytics.' },
      { title: 'Profile Optimisation Insights', desc: 'Monthly recommendations to improve your profile for better match quality, including skills to highlight and keywords to add.' },
    ],
    whoIsFor: [
      {
        title: 'Active Job Seekers',
        desc: 'Professionals actively searching for new roles who want to maximise their efficiency and application success rate.',
        points: ['Tired of spending hours on job boards with low-quality matches', 'Applying to many roles but getting few interview callbacks', 'Want a more targeted, data-driven approach to job search', 'Need to manage multiple applications efficiently'],
      },
      {
        title: 'Senior & Executive Candidates',
        desc: 'Senior professionals and executives looking for leadership roles that are often unlisted or filled through networks.',
        points: ['Targeting VP, director, or C-suite positions', 'Most relevant roles are not posted on public job boards', 'Need confidentiality in your job search', 'Looking for roles with specific culture and leadership fit'],
      },
      {
        title: 'Passive Candidates',
        desc: 'Employed professionals open to better opportunities who want to stay informed without investing hours in active searching.',
        points: ['Happy in your current role but not closed to better offers', 'Want to be alerted if a dream role opens up', 'Do not have time for active job searching', 'Interested in tracking your market value and demand'],
      },
      {
        title: 'Specialised Professionals',
        desc: 'Professionals in niche fields where relevant opportunities are rare and difficult to find through standard search.',
        points: ['Working in a specialised or emerging technology domain', 'Relevant job postings are few and scattered across platforms', 'Need a system that can identify niche role matches', 'Want to stay updated on demand for your specific expertise'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Profile Engineering', items: ['Comprehensive profile creation with skills, experience, and preferences', 'AI calibration to understand your matching priorities and constraints', 'Integration with LinkedIn, GitHub, and other professional profiles'] },
      { phase: 'Phase 2', title: 'Match Generation', items: ['AI scanning of 50,000+ active job listings across platforms', 'Multi-dimensional scoring on 15+ fit criteria', 'Hidden opportunity discovery from company pages and referral networks'] },
      { phase: 'Phase 3', title: 'Delivery & Application', items: ['Daily curated match delivery to your personalised dashboard', 'One-click application with pre-optimised resume and cover letter', 'Application tracking with status updates and follow-up reminders'] },
      { phase: 'Phase 4', title: 'Optimization & Feedback', items: ['Performance analysis of your match quality and application results', 'Profile refinement recommendations based on market feedback', 'Monthly career market intelligence report with trends and insights'] },
    ],
    techTools: ['MatchEngine AI', 'LinkedIn Jobs API', 'Indeed Partner API', 'Glassdoor Integration', 'NLP Entity Extractor', 'SalaryPal Compensation Data', 'Jobvite ATS Integration', 'Greenhouse Recruiting API', 'Workday Recruiting', 'Custom ML Recommendation Engine'],
    successMetrics: [
      { metric: 'Match Accuracy', desc: 'Percentage of job matches rated as highly relevant by clients upon review', value: '96%' },
      { metric: 'Application-to-Interview', desc: 'Percentage of submitted applications through our matching that result in interview invitations', value: '72%' },
      { metric: 'Time to First Match', desc: 'Average time from profile completion to receiving the first high-quality match', value: '< 24 Hours' },
      { metric: 'Hidden Job Discovery', desc: 'Percentage of matched jobs that were not found on major public job boards', value: '34%' },
    ],
    industries: ['Information Technology', 'Financial Services', 'Healthcare & Pharma', 'E-Commerce', 'Management Consulting', 'Manufacturing', 'Education & EdTech', 'Media & Entertainment'],
    testimonials: [
      { name: 'Ritu Agarwal', role: 'Engineering Manager at Adobe', text: 'I was looking for a senior engineering leadership role but everything on job boards felt wrong. The AI matched me with a role at Adobe that was not even publicly listed—I was one of only 8 candidates. The salary benchmark data helped me negotiate 22% above my initial expectation.' },
      { name: 'Amit Verma', role: 'DevOps Lead at Paytm', text: 'As a DevOps specialist, most job matches were irrelevant. This system understood my specific stack—Kubernetes, Terraform, AWS—and matched me with roles that needed exactly those skills. Got 3 interview calls from 5 applications.' },
      { name: 'Divya Menon', role: 'Product Lead at PhonePe', text: 'The hidden job discovery feature is incredible. My current role at PhonePe was never posted on any public platform. The AI found it through a company referral network match. I would never have found it on my own.' },
    ],
    compareBeforeAfter: [
      { before: 'Scrolling through hundreds of irrelevant job postings daily', after: 'Receiving 5–10 highly relevant, curated matches daily' },
      { before: 'Applying blindly without understanding your fit for a role', after: 'Detailed match quality scores with gap analysis for every opportunity' },
      { before: 'Missing out on roles because you saw the posting too late', after: 'Real-time alerts within hours of new job postings matching your profile' },
      { before: 'No salary data for comparison when evaluating offers', after: 'Real-time salary benchmarks for every matched role and location' },
      { before: 'Losing track of applications across multiple platforms', after: 'Centralised dashboard with status tracking and follow-up reminders' },
    ],
    relatedServices: ['career-assessment', 'resume-branding', 'job-search-strategy'],
    ctaTitle: 'Stop Searching. Start Matching.',
    ctaDesc: 'Let our AI find the jobs that are truly meant for you. Create your match profile today and start receiving high-quality, data-backed job opportunities in your inbox within 24 hours.',
  },

  // ─── 6. Mock Interviews & Interview Preparation ────────────────────────
  {
    slug: 'mock-interviews',
    num: '06',
    name: 'Walk Into Interviews With Confidence',
    subtitle: 'Mock Interviews & Interview Preparation',
    desc: 'Practice realistic interviews, improve your answers and prepare for technical, HR and role-specific questions.',
    icon: 'Mic',
    color: '#D4A017',
    gradientFrom: '#D4A017',
    gradientTo: '#A37F12',
    heroTitle: 'Master the Interview Before You Face It',
    heroSubtitle: 'Practise with industry experts in realistic interview simulations. Get detailed feedback, structured frameworks, and the confidence to handle any question they throw at you.',
    stats: [
      { value: '91%', label: 'Interview Success Rate' },
      { value: '10,000+', label: 'Mock Sessions Conducted' },
      { value: '3.5x', label: 'More Confident Performers' },
      { value: '4.9/5', label: 'Session Feedback Score' },
    ],
    overview: {
      title: 'What Is Mock Interview Preparation?',
      desc: 'Interviews are high-stakes performances where preparation makes the difference between an offer and a rejection. Our mock interview programme simulates real interview conditions with industry professionals who ask the exact types of questions you will face. Each session includes structured feedback, recorded review, and a personalised improvement plan covering technical rounds, behavioural questions, HR screens, and case studies.',
    },
    features: [
      { icon: 'Mic', title: 'Realistic Interview Simulations', desc: 'Full-length mock interviews that replicate actual interview conditions—timed rounds, panel formats, and pressure scenarios.' },
      { icon: 'Brain', title: 'AI Answer Analysis', desc: 'AI-powered analysis of your verbal responses covering structure, clarity, confidence, keyword usage, and completeness.' },
      { icon: 'Users', title: 'Industry Expert Interviewers', desc: 'Mock sessions conducted by professionals who have interviewed hundreds of candidates at top companies and know what evaluators look for.' },
      { icon: 'Target', title: 'Role-Specific Question Banks', desc: 'Curated question banks for 500+ roles across 25 industries, covering technical, behavioural, situational, and case-study formats.' },
      { icon: 'BookOpen', title: 'STAR Framework Training', desc: 'Structured coaching on the STAR method, CAR technique, and other proven frameworks for delivering powerful interview answers.' },
      { icon: 'BarChart3', title: 'Performance Analytics', desc: 'Detailed scorecards covering communication, technical depth, problem-solving approach, cultural fit indicators, and overall impression.' },
    ],
    howItWorks: [
      { step: 1, title: 'Interview Profile Setup', desc: 'Share your target company, role, interview format, and any specific concerns or areas where you feel less confident.' },
      { step: 2, title: 'Custom Question Preparation', desc: 'Our team curates role-specific questions based on actual interview patterns for your target company and role type.' },
      { step: 3, title: 'Conduct Mock Interview', desc: 'Complete a realistic mock interview session via video call with an industry expert, simulating actual interview conditions.' },
      { step: 4, title: 'Detailed Feedback Session', desc: 'Receive comprehensive verbal and written feedback covering answer quality, body language, communication, and improvement areas.' },
      { step: 5, title: 'Improvement Plan & Follow-Up', desc: 'Get a structured improvement plan with practice drills, and schedule follow-up sessions to track your progress.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Eliminate Interview Anxiety', desc: 'Practising in realistic conditions reduces interview anxiety by up to 65%, so you perform at your best when it matters.' },
      { icon: 'ArrowUpRight', title: 'Higher Offer Conversion', desc: 'Candidates who complete 3+ mock sessions have a 91% interview success rate—compared to 47% for those who do not prepare.' },
      { icon: 'Shield', title: 'Company-Specific Prep', desc: 'We research your target company\'s interview format, question patterns, and evaluation criteria to tailor your preparation.' },
      { icon: 'Clock', title: 'Learn Proven Answer Frameworks', desc: 'Master the STAR method, CAR technique, and structured problem-solving approaches that impress any interviewer.' },
      { icon: 'Award', title: 'Recorded Sessions for Review', desc: 'All sessions are recorded so you can review your performance, identify patterns, and track improvement over time.' },
      { icon: 'Star', title: 'Holistic Performance Coaching', desc: 'Coverage beyond just answers—body language, voice tone, confidence projection, and handling unexpected questions.' },
    ],
    deliverables: [
      { title: 'Mock Interview Recording', desc: 'Full video recording of your mock interview session for self-review and continued practice.' },
      { title: 'Detailed Feedback Report', desc: 'A comprehensive written report with scores across 12 dimensions including technical accuracy, communication quality, and cultural fit.' },
      { title: 'Answer Improvement Guide', desc: 'Specific rewrites and improvements for each answer you gave, showing how to strengthen structure, impact, and clarity.' },
      { title: 'Question Bank & Prep Materials', desc: 'A curated list of 50+ likely interview questions for your target role with suggested frameworks and sample answers.' },
      { title: 'Personalised Improvement Plan', desc: 'A structured 2-week improvement plan with daily practice drills, recommended resources, and areas to focus on before your actual interview.' },
    ],
    whoIsFor: [
      {
        title: 'First-Time Interviewees',
        desc: 'Fresh graduates and early-career professionals who have limited interview experience and need to build confidence and technique.',
        points: ['Never had a professional job interview before', 'Feel nervous or blank out under interview pressure', 'Unsure how to structure answers to common interview questions', 'Need practice with both technical and HR-style questions'],
      },
      {
        title: 'Job Switchers',
        desc: 'Professionals who have not interviewed in years and need to refresh their skills for a competitive market.',
        points: ['Have been in the same role for 5+ years without interviewing', 'Interview formats and expectations have changed since your last job search', 'Need to prepare for senior-level or leadership interview formats', 'Want to practice salary negotiation and executive-level communication'],
      },
      {
        title: 'Tech Role Candidates',
        desc: 'Candidates preparing for technical interviews at product companies, including coding rounds, system design, and architecture discussions.',
        points: ['Preparing for coding interviews at FAANG or top product companies', 'Need practice with system design and architecture interviews', 'Weak in explaining technical concepts clearly to non-technical interviewers', 'Want to practice whiteboarding and live problem-solving under time pressure'],
      },
      {
        title: 'MBA & Postgraduate Candidates',
        desc: 'Students and professionals preparing for MBA admissions interviews, campus placements, or consulting case interviews.',
        points: ['Preparing for MBA admission interviews at top B-schools', 'Need to crack case interviews for consulting roles', 'Campus placement season approaching with multiple companies', 'Want to differentiate yourself among equally qualified candidates'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Profiling & Planning', items: ['Target company and role analysis with interview format research', 'Self-assessment questionnaire to identify confidence levels and weak areas', 'Custom question bank preparation based on target company patterns'] },
      { phase: 'Phase 2', title: 'Mock Interview Execution', items: ['45–60 minute realistic mock interview via video call', 'Multiple rounds covering technical, behavioural, and HR questions', 'Recording of the complete session for post-review analysis'] },
      { phase: 'Phase 3', title: 'Feedback & Analysis', items: ['Immediate verbal debrief with the interviewer covering strengths and gaps', 'AI-powered analysis of response structure, clarity, and keyword usage', '12-dimension scorecard with ratings and benchmark comparisons'] },
      { phase: 'Phase 4', title: 'Improvement & Follow-Up', items: ['Structured improvement plan with 2-week practice schedule', 'Follow-up mock session to measure progress and refine technique', 'Final prep session 2 days before the actual interview'] },
    ],
    techTools: ['Zoom Pro', 'Otter.ai Transcription', 'Loom Recording', 'Pramp Practice Platform', 'Interviewing.io', 'AlgoExpert', 'LeetCode Mock Interviews', 'BigInterview', 'Google Meet', 'Miro Whiteboard'],
    successMetrics: [
      { metric: 'Interview Success Rate', desc: 'Percentage of clients who receive at least one offer after completing 3+ mock interview sessions', value: '91%' },
      { metric: 'Confidence Improvement', desc: 'Average self-reported confidence increase from pre-session to post-programme surveys', value: '3.5x Increase' },
      { metric: 'Answer Quality Score', desc: 'Average improvement in structured answer quality across all mock sessions from first to last', value: '58% Improvement' },
      { metric: 'Client Satisfaction', desc: 'Average satisfaction rating across all mock interview sessions', value: '4.9/5.0' },
    ],
    industries: ['Software Engineering', 'Product Management', 'Data Science', 'Financial Services', 'Management Consulting', 'Healthcare', 'E-Commerce & Technology', 'Education & Academic'],
    testimonials: [
      { name: 'Karthik Rajan', role: 'Software Engineer at Google', text: 'I had cracked the coding rounds before but always stumbled in behavioural interviews. Three mock sessions with their team transformed my STAR responses. The feedback on my Google mock interview was eerily similar to the actual questions I got on interview day.' },
      { name: 'Shalini Menon', role: 'Product Manager at CRED', text: 'The case interview preparation was exceptional. My mock interviewer was a former McKinsey consultant who grilled me on market sizing and profitability frameworks. When CRED gave me a similar case, I nailed it. Got the offer within a week.' },
      { name: 'Rohan Deshmukh', role: 'Data Scientist at Netflix', text: 'I was terrible at explaining ML models to non-technical interviewers. The mock sessions taught me to use analogies and simplify complex concepts. The interviewer pointed out I was overusing jargon—something I never realised. That one fix changed everything.' },
    ],
    compareBeforeAfter: [
      { before: 'Nervous, rambling answers with no clear structure', after: 'Structured, confident responses using STAR and CAR frameworks' },
      { before: 'Blanking out on unexpected or tough questions', after: 'Prepared strategies for handling curveballs and high-pressure moments' },
      { before: 'No idea what the interviewer is actually evaluating', after: 'Clear understanding of evaluation criteria and how to address each dimension' },
      { before: 'Weak body language and lack of confidence projection', after: 'Polished delivery with strong eye contact, posture, and vocal presence' },
      { before: 'Going into interviews unprepared and hoping for the best', after: 'Walking in with practised answers, backup stories, and a winning mindset' },
    ],
    relatedServices: ['job-search-strategy', 'resume-branding', 'skills-readiness'],
    ctaTitle: 'Do Not Let One Bad Interview Cost You Your Dream Job',
    ctaDesc: 'Practise with industry experts in realistic mock interviews. Get detailed feedback, proven frameworks, and the confidence to handle any question. Book your first mock session today.',
  },

  // ─── 7. Job Search & Application Strategy ─────────────────────────────
  {
    slug: 'job-search-strategy',
    num: '07',
    name: 'Get Hired Faster',
    subtitle: 'Job Search & Application Strategy',
    desc: 'Target the right companies, improve your applications and follow a structured strategy from application to interview.',
    icon: 'Target',
    color: '#EC4899',
    gradientFrom: '#EC4899',
    gradientTo: '#BE185D',
    heroTitle: 'Turn Your Job Search Into a System, Not a Struggle',
    heroSubtitle: 'Replace random applications with a proven, data-driven job search strategy. Target the right companies, craft winning applications, and follow a structured process from first click to final offer.',
    stats: [
      { value: '68%', label: 'Faster Time to Hire' },
      { value: '9,800+', label: 'Strategies Implemented' },
      { value: '3x', label: 'Higher Response Rate' },
      { value: '94%', label: 'Client Satisfaction' },
    ],
    overview: {
      title: 'What Is Job Search Strategy?',
      desc: 'Most job seekers rely on volume—applying to hundreds of roles and hoping something sticks. Our strategic approach replaces brute force with precision. We analyse your target market, identify the right companies, build a tailored application strategy for each, and create a structured follow-up system that keeps you visible to hiring managers. From application timing to referral leveraging, we optimise every variable in the job search process.',
    },
    features: [
      { icon: 'Target', title: 'Target Company Research', desc: 'Data-driven identification of companies that match your career goals, culture preferences, growth potential, and compensation expectations.' },
      { icon: 'Search', title: 'Application Funnel Design', desc: 'A structured funnel with tiered targets—dream companies, stretch goals, and safety nets—ensuring a balanced and strategic application pipeline.' },
      { icon: 'Rocket', title: 'Referral Network Strategy', desc: 'Guided approach to building and leveraging professional referral networks, including warm introduction scripts and LinkedIn outreach templates.' },
      { icon: 'BarChart3', title: 'Application Analytics', desc: 'Track conversion rates at every funnel stage—views, applications, screens, interviews, and offers—to continuously optimise your approach.' },
      { icon: 'Clock', title: 'Follow-Up Automation', desc: 'Structured follow-up cadences and templates for every stage, ensuring you stay visible without being perceived as pushy.' },
      { icon: 'TrendingUp', title: 'Market Timing Intelligence', desc: 'Data on optimal application timing based on company hiring cycles, budget cycles, and industry hiring seasons.' },
    ],
    howItWorks: [
      { step: 1, title: 'Market & Self Assessment', desc: 'We analyse your target market, competitive landscape, and your positioning to build a strategic foundation for your search.' },
      { step: 2, title: 'Target List Creation', desc: 'Build a prioritised list of 40–60 target companies categorised into dream, match, and safety tiers with specific role targets.' },
      { step: 3, title: 'Strategy & Channel Planning', desc: 'Design your application approach for each company—direct application, referral, recruiter outreach, or campus/networking channel.' },
      { step: 4, title: 'Execution & Tracking', desc: 'Execute your strategy with structured weekly targets, tracked applications, follow-ups, and networking activities.' },
      { step: 5, title: 'Review & Optimise', desc: 'Weekly review sessions to analyse conversion data, refine your approach, and pivot strategies based on market feedback.' },
    ],
    benefits: [
      { icon: 'Zap', title: '68% Faster Time to Hire', desc: 'A structured strategy gets you hired in weeks, not months. Our clients land roles 68% faster than unstructured job seekers.' },
      { icon: 'ArrowUpRight', title: '3x Higher Response Rate', desc: 'Targeted applications with tailored outreach generate 3x more responses than generic, mass-applied submissions.' },
      { icon: 'Shield', title: 'No More Black Hole Applications', desc: 'Every application has a channel strategy, follow-up plan, and tracking mechanism so nothing falls through the cracks.' },
      { icon: 'Clock', title: 'Balanced Opportunity Pipeline', desc: 'Maintain a healthy pipeline of opportunities across dream, stretch, and safety-net tiers so you always have options.' },
      { icon: 'Award', title: 'Referral-Based Applications', desc: 'Our referral strategy helps you bypass ATS systems and get direct introductions to hiring managers—30x more effective.' },
      { icon: 'Star', title: 'Data-Driven Decisions', desc: 'Application analytics tell you what is working and what is not, so you invest your time in the highest-return activities.' },
    ],
    deliverables: [
      { title: 'Target Company Matrix', desc: 'A prioritised spreadsheet of 40–60 target companies with tier classification, key contacts, hiring channels, and application status tracking.' },
      { title: 'Application Strategy Document', desc: 'A comprehensive strategy guide covering approach, messaging templates, channel preferences, and timeline for your job search.' },
      { title: 'Outreach Template Library', desc: '15+ proven templates for LinkedIn InMail, cold emails, referral requests, follow-ups, and thank-you messages.' },
      { title: 'Weekly Action Plan', desc: 'Structured weekly targets for applications, networking outreach, follow-ups, and skill development with accountability checkpoints.' },
      { title: 'Conversion Analytics Dashboard', desc: 'A tracking system to monitor your funnel metrics—applications submitted, responses received, screens passed, interviews scheduled, and offers received.' },
    ],
    whoIsFor: [
      {
        title: 'Active Job Seekers',
        desc: 'Professionals actively looking for their next role who want to replace inefficient brute-force applying with a strategic, high-conversion approach.',
        points: ['Applying to 20+ jobs per week but getting few responses', 'Job search feels random and unstructured', 'Not sure which companies to target or how to prioritise', 'Need a system to manage multiple applications efficiently'],
      },
      {
        title: 'Executives & Senior Leaders',
        desc: 'Senior professionals whose job search requires a confidential, relationship-driven approach rather than public applications.',
        points: ['Your next career move requires confidentiality', 'Executive roles are filled through networks, not job boards', 'Need a targeted approach to reach decision-makers directly', 'Building relationships with search firms and board members'],
      },
      {
        title: 'Career Switchers',
        desc: 'Professionals changing industries who need a specialised strategy to position their transferable skills effectively.',
        points: ['Entering a new industry where you have no network', 'Need to reframe your experience for a different audience', 'Traditional job boards are not working for your transition', 'Need guidance on which companies are open to non-traditional backgrounds'],
      },
      {
        title: 'Relocating Professionals',
        desc: 'Professionals planning to relocate to a new city or country who need to build a presence and network in their target market.',
        points: ['Moving to a new city and have no local network', 'Need to apply remotely and convince employers of your commitment', 'Unfamiliar with the local job market and hiring culture', 'Need a strategy that works across geographic boundaries'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Market Research & Positioning', items: ['Analysis of target industry hiring trends, salary benchmarks, and employer demand', 'Competitive positioning assessment based on your unique strengths', 'Identification of geographic and role-specific market opportunities'] },
      { phase: 'Phase 2', title: 'Target List & Strategy Design', items: ['Creation of prioritised 40–60 company target list with tiered classification', 'Channel strategy mapping for each target (direct, referral, recruiter)', 'Outreach messaging and application material preparation'] },
      { phase: 'Phase 3', title: 'Execution & Pipeline Management', items: ['Structured weekly application targets with company-specific approaches', 'Networking outreach cadence with LinkedIn and email templates', 'Application tracking and follow-up scheduling'] },
      { phase: 'Phase 4', title: 'Analytics & Optimisation', items: ['Weekly conversion analysis and strategy refinement', 'A/B testing of outreach messages and application approaches', 'Pipeline health review and course corrections'] },
    ],
    techTools: ['Trello Board', 'Notion Workspace', 'Hunter.io Email Finder', 'LinkedIn Sales Navigator', 'Lusha Contact Database', 'Crystal Knows', 'Streak CRM for Gmail', 'Intentional Careers Tracker', 'Glassdoor Insights', 'AngelList / Wellfound'],
    successMetrics: [
      { metric: 'Time to Hire', desc: 'Average time from strategy kickoff to receiving a job offer', value: '8 Weeks' },
      { metric: 'Application Response Rate', desc: 'Average percentage of applications that receive a positive response (screen or interview)', value: '34%' },
      { metric: 'Pipeline Conversion', desc: 'Average conversion rate from application to interview stage', value: '28%' },
      { metric: 'Referral Success Rate', desc: 'Percentage of referral-based applications that result in an interview invitation', value: '52%' },
    ],
    industries: ['Information Technology', 'Financial Services', 'Consulting', 'Healthcare', 'E-Commerce', 'Manufacturing', 'Education', 'Government & Public Sector'],
    testimonials: [
      { name: 'Anand Krishnan', role: 'Senior Architect at Wipro', text: 'I was applying to 30 jobs a week with almost zero response. The strategy service helped me identify that I was targeting the wrong companies and using generic applications. Within 3 weeks of implementing the targeted approach, I had 6 interview calls—including one from Wipro, where I ultimately landed.' },
      { name: 'Meera Srinivasan', role: 'Product Head at Freshworks', text: 'As a senior professional, I did not want to post my resume publicly. The referral strategy helped me connect with 8 hiring managers through warm LinkedIn introductions. Three of those conversations turned into interviews, and Freshworks made me an offer I could not refuse.' },
      { name: 'Prakash Dwivedi', role: 'Engineering Lead at Ola', text: 'The application funnel concept was eye-opening. I was spending 90% of my time on dream companies with a 2% success rate. After restructuring my pipeline with safety nets and stretch goals, I had multiple offers to choose from. The negotiation leverage alone was worth the investment.' },
    ],
    compareBeforeAfter: [
      { before: 'Applying to random jobs with no prioritisation or strategy', after: 'Structured pipeline with tiered targets and company-specific approaches' },
      { before: 'Low response rates and applications going into black holes', after: '3x higher response rate with tracked follow-ups and referral strategies' },
      { before: 'No visibility into what is working and what is not', after: 'Conversion analytics showing exact performance at every funnel stage' },
      { before: 'Networking feels awkward and random', after: 'Proven outreach templates and scripts for warm introductions to hiring managers' },
      { before: 'Job search is stressful, disorganised, and never-ending', after: 'Systematic weekly plan with clear targets, tracking, and measurable progress' },
    ],
    relatedServices: ['ai-job-matching', 'resume-branding', 'mock-interviews'],
    ctaTitle: 'Stop Applying Randomly. Start Getting Hired.',
    ctaDesc: 'Replace guesswork with strategy. Get a personalised job search plan with target companies, outreach templates, and a tracking system that turns your job search into a data-driven machine. Start today.',
  },

  // ─── 8. Talent Matching & Hiring Connections ───────────────────────────
  {
    slug: 'talent-matching',
    num: '08',
    name: 'Get In Front of Employers',
    subtitle: 'Talent Matching & Hiring Connections',
    desc: 'Connect your profile with relevant employers and hiring opportunities based on your skills and career goals.',
    icon: 'Handshake',
    color: '#06B6D4',
    gradientFrom: '#06B6D4',
    gradientTo: '#0891B2',
    heroTitle: 'Let Employers Find You—Not the Other Way Around',
    heroSubtitle: 'Our talent matching platform connects your profile directly with hiring managers and recruiters who are actively looking for someone with your exact skills, experience, and career goals.',
    stats: [
      { value: '5,200+', label: 'Successful Placements' },
      { value: '1,800+', label: 'Partner Employers' },
      { value: '87%', label: 'Match Satisfaction Rate' },
      { value: '14 Days', label: 'Avg. Time to First Interview' },
    ],
    overview: {
      title: 'What Is Talent Matching?',
      desc: 'Traditional job search puts the burden on you—find the job, apply, wait. Talent matching flips the equation. We present your profile to employers who are actively hiring for your skills and experience. Our platform uses AI to match your capabilities with open positions across our network of 1,800+ partner companies, facilitating direct connections with hiring managers. It is like having a talent agent working for you around the clock.',
    },
    features: [
      { icon: 'Handshake', title: 'Direct Employer Connections', desc: 'Your profile is presented directly to hiring managers at partner companies—not filtered through ATS systems or HR gatekeepers.' },
      { icon: 'Brain', title: 'AI Profile Synthesis', desc: 'Our AI creates a comprehensive talent profile from your resume, assessments, and work history, highlighting your most marketable attributes.' },
      { icon: 'Users', title: 'Curated Employer Network', desc: 'Access to our vetted network of 1,800+ companies ranging from funded startups to Fortune 500 enterprises across 15 industries.' },
      { icon: 'Target', title: 'Precision Matching', desc: 'Matches based on skills, experience depth, industry expertise, location, salary alignment, and cultural fit preferences.' },
      { icon: 'Zap', title: 'Priority Introductions', desc: 'Fast-track introductions to hiring managers with your pre-verified profile, skipping the initial screening rounds.' },
      { icon: 'TrendingUp', title: 'Market Demand Insights', desc: 'Real-time data on which employers are hiring for your skills, salary trends, and demand velocity in your expertise areas.' },
    ],
    howItWorks: [
      { step: 1, title: 'Build Your Talent Profile', desc: 'Create a comprehensive talent profile with verified skills, experience, work samples, and career preferences.' },
      { step: 2, title: 'AI Matching & Verification', desc: 'Our AI analyses your profile, verifies key claims, and matches you against active hiring requirements from partner employers.' },
      { step: 3, title: 'Employer Presentation', desc: 'Your profile is presented to matched employers with a compatibility score and highlights, making it easy for them to evaluate your fit.' },
      { step: 4, title: 'Mutual Interest Confirmation', desc: 'When an employer expresses interest, you receive the opportunity details and can accept or decline the introduction.' },
      { step: 5, title: 'Direct Hiring Manager Connection', desc: 'Upon mutual interest, we facilitate a direct introduction with the hiring manager, bypassing traditional application processes.' },
    ],
    benefits: [
      { icon: 'Zap', title: 'Employers Come to You', desc: 'No more endless applying. Employers review your profile and reach out when they have a matching opportunity.' },
      { icon: 'ArrowUpRight', title: 'Skip the ATS Black Hole', desc: 'Direct introductions to hiring managers mean your profile is seen by decision-makers, not filtered out by algorithms.' },
      { icon: 'Shield', title: 'Pre-Verified Credibility', desc: 'Our verification process adds credibility to your profile, making employers more confident in reaching out to you.' },
      { icon: 'Clock', title: '14 Days to First Interview', desc: 'Our average time from profile activation to first hiring manager interview is just 14 days.' },
      { icon: 'Award', title: 'Exclusive Opportunities', desc: 'Access roles that are not posted publicly—filled exclusively through our talent matching network.' },
      { icon: 'Star', title: 'Higher Quality Matches', desc: '87% of our matched candidates report that the opportunity was highly relevant to their career goals.' },
    ],
    deliverables: [
      { title: 'Verified Talent Profile', desc: 'A comprehensive, pre-verified professional profile optimised for employer review, highlighting your strongest skills and achievements.' },
      { title: 'Employer Match Report', desc: 'A report of all employers matched to your profile with compatibility scores, company details, and role descriptions.' },
      { title: 'Introduction Facilitation', desc: 'Warm, facilitated introductions to interested hiring managers with your profile summary and match rationale.' },
      { title: 'Offer Negotiation Support', desc: 'Guidance and market data to help you evaluate and negotiate offers from matched employers for maximum compensation.' },
      { title: 'Monthly Market Intelligence', desc: 'Monthly reports on demand for your skills, salary trends, and new employers joining the matching network in your domain.' },
    ],
    whoIsFor: [
      {
        title: 'Experienced Professionals',
        desc: 'Professionals with 3+ years of experience who want employers to discover them based on their proven track record.',
        points: ['Have significant experience but tired of traditional job search', 'Want to be approached by quality employers, not just apply to postings', 'Skills are in demand but not easily found through keyword searches', 'Looking for a more passive, dignified approach to career advancement'],
      },
      {
        title: 'Tech Specialists & Experts',
        desc: 'Deep technical specialists whose niche expertise makes them highly sought after by specific employers.',
        points: ['Deep expertise in a specific technology or domain', 'Only a handful of companies need your exact skill set', 'Prefer targeted outreach over mass applications', 'Want to maintain exclusivity and choose among opportunities'],
      },
      {
        title: 'Mid-to-Senior Level Leaders',
        desc: 'Managers and leaders who want confidential access to leadership opportunities without public job searching.',
        points: ['Currently employed and exploring opportunities discreetly', 'Targeting director, VP, or leadership-level positions', 'Need confidentiality in your career exploration', 'Want to evaluate opportunities without burning bridges'],
      },
      {
        title: 'Specialised Domain Experts',
        desc: 'Professionals in specialised fields like AI, cybersecurity, blockchain, or regulated industries where talent is scarce.',
        points: ['Working in a high-demand, low-supply talent niche', 'Employers struggle to find candidates with your expertise', 'Want to leverage your scarcity for better offers', 'Interested in contract, advisory, or full-time opportunities'],
      },
    ],
    process: [
      { phase: 'Phase 1', title: 'Profile Creation & Verification', items: ['Comprehensive talent profile with skills, experience, and work samples', 'Skill verification through assessments or credential validation', 'Preference setting for role type, industry, location, and compensation'] },
      { phase: 'Phase 2', title: 'AI Matching & Employer Outreach', items: ['AI matching against 1,800+ partner employer hiring requirements', 'Profile presentation to matched employers with compatibility highlights', 'Employer interest collection and mutual fit evaluation'] },
      { phase: 'Phase 3', title: 'Introduction & Engagement', items: ['Facilitated warm introductions to interested hiring managers', 'Pre-interview briefing with company and role insights', 'Interview scheduling and preparation support'] },
      { phase: 'Phase 4', title: 'Offer & Onboarding', items: ['Offer evaluation with market salary benchmarking and negotiation support', 'Counter-offer strategy and decision framework', 'Post-placement check-in and employer feedback collection'] },
    ],
    techTools: ['TalentMesh AI', 'LinkedIn Recruiter', 'Greenhouse CRM', 'HackerRank Verified Skills', 'Triplebyte Assessment', 'Credly Badges', 'Zoom Info Contact Database', 'Eightfold AI', 'SeekOut Platform', 'Hired.com Integration'],
    successMetrics: [
      { metric: 'Placement Rate', desc: 'Percentage of active talent profiles that result in at least one hire within 90 days', value: '76%' },
      { metric: 'Time to First Interview', desc: 'Average time from profile activation to first hiring manager introduction', value: '14 Days' },
      { metric: 'Match Satisfaction', desc: 'Percentage of matched candidates who rate their matched opportunity as highly relevant', value: '87%' },
      { metric: 'Employer Retention', desc: 'Percentage of placements still with the matched employer after 12 months', value: '91%' },
    ],
    industries: ['Information Technology', 'Financial Services & FinTech', 'Healthcare & HealthTech', 'E-Commerce & Retail', 'Cloud Infrastructure', 'Cybersecurity', 'Artificial Intelligence & ML', 'Management Consulting'],
    testimonials: [
      { name: 'Dr. Suresh Babu', role: 'AI Research Lead at Reliance Jio', text: 'I was not actively looking but had my profile in the talent matching system. Jio\'s AI team reached out directly—the role was a perfect fit for my NLP research background. The entire process from introduction to offer took 3 weeks. I never had to apply to a single job posting.' },
      { name: 'Nandini Rao', role: 'VP of Engineering at Razorpay', text: 'As a senior engineering leader, I wanted a confidential search. The talent matching team presented my profile to 12 carefully selected companies. Five expressed interest, and I chose Razorpay after evaluating three strong offers. The negotiation support alone helped me secure a 30% hike.' },
      { name: 'Arun Subramanian', role: 'Cloud Architect at Tata Digital', text: 'My expertise in multi-cloud architecture is niche, and most recruiters did not understand it. The talent matching system connected me with Tata Digital\'s cloud transformation team—a role I would never have found on job boards. The match quality was exceptional.' },
    ],
    compareBeforeAfter: [
      { before: 'Spending hours applying to job postings and waiting for responses', after: 'Employers discover your profile and initiate contact with you' },
      { before: 'Resumes lost in ATS systems and never seen by hiring managers', after: 'Direct introductions to decision-makers who understand your value' },
      { before: 'Applying to companies you have never heard of', after: 'Connected with vetted, quality employers from a curated network' },
      { before: 'No leverage in salary negotiations—take it or leave it', after: 'Market data and multiple competing offers give you negotiation power' },
      { before: 'Career exploration feels risky and exposed', after: 'Confidential matching lets you explore opportunities discreetly' },
    ],
    relatedServices: ['ai-job-matching', 'resume-branding', 'job-search-strategy'],
    ctaTitle: 'Let Your Next Employer Find You',
    ctaDesc: 'Create your verified talent profile and get matched with 1,800+ employers actively looking for your skills. Skip the application black hole—get direct introductions to hiring managers. Join the talent network today.',
  },
];

// ==================== HELPERS ====================

export function getProfessionalService(slug: string): ProfessionalService | undefined {
  return professionalServices.find((service) => service.slug === slug);
}
