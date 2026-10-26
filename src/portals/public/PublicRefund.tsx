"use client";

import * as React from "react";
import {
  RefreshCcw, CheckCircle2, Clock, ShieldX, Wallet, Scale, Mail,
} from "lucide-react";
import { PublicLegalPage, type LegalSection } from "./PublicLegalShared";

const SECTIONS: LegalSection[] = [
  {
    id: "eligibility",
    icon: CheckCircle2,
    title: "Refund Eligibility",
    paragraphs: [
      "Refund eligibility depends on the type of program you enrolled in and the timing of your request. For upfront tuition payments, you may request a full refund within the first 7 days of cohort start, no questions asked. After 7 days, refunds are pro-rated based on the percentage of the program completed.",
      "For Pay-After-Placement (PAP) enrollments, no refund applies because no upfront tuition was charged. Instead, your PAP obligation is waived if you do not secure a qualifying placement within 12 months of cohort end (see the Pay-After-Placement Terms section below).",
      "Corporate training and custom enterprise programs are governed by the master services agreement (MSA) signed between JOBSONN and the client organization. Refund terms for such engagements are defined in the MSA and may differ from this policy.",
    ],
  },
  {
    id: "process",
    icon: RefreshCcw,
    title: "Refund Process",
    paragraphs: [
      "To request a refund, email refunds@jobsonn.com with your full name, registered email, cohort/program name, and the reason for your request. Our team will acknowledge your request within 2 business days and provide a decision within 7 business days.",
      "Approved refunds are processed back to the original payment method within 10 business days of approval. If your original payment method is no longer active, we will work with you to identify an alternative bank account or UPI ID for credit.",
      "If your refund request is denied, you may appeal the decision within 30 days by emailing appeals@jobsonn.com. Appeals are reviewed by our Head of Operations and a decision is provided within 14 days.",
    ],
  },
  {
    id: "timeline",
    icon: Clock,
    title: "Refund Timeline & Pro-Rata Calculation",
    paragraphs: [
      "Refund amounts are calculated pro-rata based on the percentage of program curriculum completed at the time of your request. The completion percentage is determined by the number of curriculum modules marked complete in your learner dashboard.",
      "Examples: (1) Request within 7 days = 100% refund. (2) Request after 25% of curriculum completion = 75% refund. (3) Request after 50% completion = 50% refund. (4) No refund is available after 75% completion, except in cases of documented medical or family emergency (see Disputes section).",
      "Processing fees of ₹500 (or 2% of refund amount, whichever is lower) are deducted from all refunds to cover payment gateway and administrative costs. This fee is waived if the refund is requested within the first 7 days.",
    ],
  },
  {
    id: "non-refundable",
    icon: ShieldX,
    title: "Non-Refundable Items",
    paragraphs: [
      "The following items are non-refundable under any circumstances: (a) certification exam fees charged by third-party providers (e.g., AWS, Microsoft, Google Cloud); (b) hardware or physical learning materials shipped to your address; (c) scholarship application fees; (d) late payment or penalty fees; and (e) services already rendered such as completed mock interviews, resume reviews, or 1:1 mentorship sessions.",
      "If you have received any non-refundable services at the time of your refund request, their value will be deducted from the refund amount before processing.",
      "Pre-paid credits for premium services (such as additional mock interviews or career coaching sessions) are non-refundable but remain valid for 24 months from the date of purchase.",
    ],
  },
  {
    id: "pap-terms",
    icon: Wallet,
    title: "Pay-After-Placement Terms",
    paragraphs: [
      "Under the Pay-After-Placement (PAP) model, you pay no upfront tuition. Your PAP obligation is triggered only when you accept a job offer that meets the criteria defined in your PAP agreement — typically a CTC at or above ₹6 LPA, with a company on our verified employer list.",
      "If you complete the program and do not secure a qualifying placement within 12 months of cohort end, your PAP obligation is fully waived. You owe nothing and may continue to access career support services (mock interviews, partner intros, resume reviews) at no cost during this 12-month window.",
      "If you secure a qualifying placement, your PAP obligation is a fixed percentage of your CTC (capped per your agreement) paid monthly over 12–24 months. The total obligation is capped and disclosed upfront at the time of enrollment — there are no hidden fees or interest charges.",
      "If you voluntarily withdraw from the program after the first 14 days, your PAP obligation remains in effect if you secure a qualifying placement within 12 months of cohort end. If you do not, the obligation is waived.",
    ],
  },
  {
    id: "disputes",
    icon: Scale,
    title: "Disputes & Exceptions",
    paragraphs: [
      "JOBSONN reserves the right to make exceptions to this policy in cases of documented medical emergency, family bereavement, or unforeseen relocation. To request an exception, email exceptions@jobsonn.com with supporting documentation (medical certificate, death certificate, relocation letter).",
      "All refund disputes are first handled through our internal escalation process. If you are not satisfied with the resolution, you may escalate to the Consumer Disputes Redressal Forum having jurisdiction over your billing address, in accordance with the Consumer Protection Act, 2019.",
      "Governing law: This policy is governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.",
    ],
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Us",
    paragraphs: [
      "For refund requests, email refunds@jobsonn.com. For PAP-related queries, email pap@jobsonn.com. For exception requests, email exceptions@jobsonn.com. Our team responds to all queries within 2 business days.",
      "You can also reach us by phone at +91 80 4567 8901 (Monday – Friday, 10 AM – 6 PM IST) or by writing to: Refunds Team, JOBSONN Intelligence Pvt. Ltd., 24 Residency Road, Ashok Nagar, Bengaluru 560025, Karnataka, India.",
      "We are committed to fair, transparent refund practices. If you believe we have not met this commitment, please escalate to our Head of Operations at operations@jobsonn.com.",
    ],
  },
];

export function PublicRefund() {
  return (
    <PublicLegalPage
      title="Refund Policy"
      icon={RefreshCcw}
      badge="Legal"
      intro="Our policy on refunds for upfront tuition, Pay-After-Placement waivers, and non-refundable items. We aim for fair, transparent, and timely processing of every refund request."
      lastUpdated="January 15, 2025"
      sections={SECTIONS}
    />
  );
}
