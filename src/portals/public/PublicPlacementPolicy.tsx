"use client";

import * as React from "react";
import {
  Trophy, CheckCircle2, ClipboardList, Building2, Wallet,
  AlertTriangle, Mail,
} from "lucide-react";
import { PublicLegalPage, type LegalSection } from "./PublicLegalShared";

const SECTIONS: LegalSection[] = [
  {
    id: "guarantee",
    icon: Trophy,
    title: "Placement Guarantee",
    paragraphs: [
      "JOBSONN Academy offers a Placement Guarantee to learners enrolled in eligible Pay-After-Placement (PAP) programs. The guarantee means: if you do not secure a qualifying placement within 12 months of cohort end, your PAP obligation is fully waived and you owe nothing.",
      "A \"qualifying placement\" is defined as a full-time job offer with a CTC at or above the threshold specified in your PAP agreement (typically ₹6 LPA for entry-level programs and ₹12 LPA for senior tracks), from a company on our verified employer list.",
      "The Placement Guarantee applies only to learners who meet the Eligibility Criteria defined below and complete all program requirements (curriculum, capstone, assessments, and career readiness milestones) by cohort end.",
    ],
  },
  {
    id: "eligibility",
    icon: CheckCircle2,
    title: "Eligibility Criteria",
    paragraphs: [
      "To be eligible for the Placement Guarantee, you must: (a) maintain a minimum 85% attendance rate across live sessions; (b) submit all assignments and projects by their deadlines; (c) achieve a passing score on all module assessments; (d) complete and present a capstone project that meets our rubric; (e) complete the career readiness milestones (resume review, mock interviews, portfolio); and (f) actively participate in the placement process for the full 12-month window after cohort end.",
      "\"Active participation\" means: responding to recruiter outreach within 48 hours, attending scheduled interviews, providing feedback after each interview, and not declining more than 3 qualifying offers without a valid reason.",
      "Learners who fail to meet these criteria forfeit the Placement Guarantee. They may continue to access career support services, but their PAP obligation will remain in effect if they secure a qualifying placement within 12 months of cohort end.",
    ],
  },
  {
    id: "process",
    icon: ClipboardList,
    title: "Placement Process",
    paragraphs: [
      "Our placement process begins in week 12 of the cohort (during the Capstone phase) and continues for up to 12 months after cohort end. The process includes: profile review and polish, mock interviews, recruiter introductions, interview scheduling, offer evaluation, and salary negotiation support.",
      "We work with 200+ hiring partners across India, including product companies, service firms, startups, and unicorns. We match you to opportunities based on your skills, preferences, and location, but you also play an active role by applying to jobs surfaced through the JOBSONN candidate portal.",
      "The 12-month placement window starts on the date of cohort completion (last day of the program). The first 90 days post-cohort are the highest-intensity placement period; placements typically occur within 4–6 months for eligible learners.",
    ],
  },
  {
    id: "partnerships",
    icon: Building2,
    title: "Employer Partnerships",
    paragraphs: [
      "JOBSONN has direct hiring relationships with 200+ verified employers across India, including Google, Amazon, Microsoft, TCS, Infosys, Wipro, Accenture, Flipkart, Swiggy, Zomato, Razorpay, Zerodha, and many growth-stage startups.",
      "All employer partners are vetted for legitimacy, compensation timeliness, and workplace standards. We do not partner with employers who have a documented history of delayed salaries, misleading job descriptions, or unethical hiring practices.",
      "We continuously expand our hiring network based on learner demand, geographic priorities, and emerging sectors. If you have a specific company or sector in mind that isn't currently in our partner network, share it with your career coach — we'll work to add them.",
    ],
  },
  {
    id: "salary-commitments",
    icon: Wallet,
    title: "Salary Commitments",
    paragraphs: [
      "Salary commitments are program-specific and disclosed in writing at the time of enrollment. For 2024–2025 cohorts, the commitments are: FDE — average ₹14 LPA, range ₹8–28 LPA; DSAI — average ₹16 LPA, range ₹10–32 LPA; FDE-FWD — average ₹15 LPA, range ₹9–30 LPA; Engineering Foundations — average ₹8 LPA, range ₹6–12 LPA.",
      "These commitments are illustrative based on 2024 placement data. They represent typical outcomes for eligible learners who actively participate in the placement process. They are not guarantees of any individual salary — your actual CTC will depend on your skills, interview performance, employer, and market conditions.",
      "If your placement falls significantly below the stated range (more than 30% below the floor of the range) and you meet all eligibility criteria, you may request a placement review by emailing placements@jobsonn.com. We will work with you to identify additional opportunities aligned with your target range.",
    ],
  },
  {
    id: "exclusions",
    icon: AlertTriangle,
    title: "Exclusions & Limitations",
    paragraphs: [
      "The Placement Guarantee does not apply if: (a) you decline 3 or more qualifying offers without a valid reason; (b) you accept employment outside the JOBSONN placement process without prior notification; (c) you fail to meet the Eligibility Criteria; (d) you relocate outside India for more than 90 days during the placement window; or (e) you are removed from the program for academic or disciplinary reasons.",
      "\"Valid reason\" for declining an offer includes: compensation more than 30% below your stated target; role mismatch (e.g., backend role offered to a frontend specialist); location mismatch (more than 50km from your stated preference without relocation support); or workplace concerns documented during the interview process.",
      "The Placement Guarantee is a financial guarantee (PAP waiver), not a guarantee of a specific employer, role, or salary. We commit to working with you in good faith to find a qualifying placement — but we cannot guarantee placement at any specific company or at the top of the stated salary range.",
    ],
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Us",
    paragraphs: [
      "For questions about the Placement Policy, email placements@jobsonn.com. For PAP-related queries, email pap@jobsonn.com. For career coaching and placement support, contact your assigned career coach through the learner portal.",
      "You can also reach us by phone at +91 80 4567 8903 (Monday – Friday, 10 AM – 6 PM IST) or by writing to: Placements Team, JOBSONN Intelligence Pvt. Ltd., 24 Residency Road, Ashok Nagar, Bengaluru 560025, Karnataka, India.",
      "We are committed to transparent, accountable placement practices. If you believe we have not met this commitment, please escalate to our Head of Placements at placements-head@jobsonn.com.",
    ],
  },
];

export function PublicPlacementPolicy() {
  return (
    <PublicLegalPage
      title="Placement Policy"
      icon={Trophy}
      badge="Legal"
      intro="Our commitment to placement outcomes for JOBSONN Academy learners — including the Pay-After-Placement guarantee, eligibility criteria, employer partnerships, salary commitments, and exclusions."
      lastUpdated="January 15, 2025"
      sections={SECTIONS}
    />
  );
}
