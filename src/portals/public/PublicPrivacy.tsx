"use client";

import * as React from "react";
import {
  Shield, Database, Eye, Share2, Lock, Cookie, UserCog,
  Archive, Mail,
} from "lucide-react";
import { PublicLegalPage, type LegalSection } from "./PublicLegalShared";

const SECTIONS: LegalSection[] = [
  {
    id: "collection",
    icon: Database,
    title: "Information We Collect",
    paragraphs: [
      "We collect information you provide directly to us — including your name, email address, phone number, location, education, employment history, skills, preferences, and resume when you create a candidate profile, post a job, or apply for a role.",
      "We also collect information automatically when you use the Services: your IP address, device type, browser type, pages visited, time spent on pages, and interactions with job postings or candidate profiles. This includes cookies and similar technologies (see the Cookies section below).",
      "When you make a payment, we collect billing information necessary to process the transaction. Payment card details are handled by our PCI-DSS compliant payment partners and are never stored on jobson.id's servers.",
    ],
  },
  {
    id: "use",
    icon: Eye,
    title: "How We Use Your Information",
    paragraphs: [
      "We use your information to operate, maintain, and improve the Services — including matching candidates to jobs, surfacing relevant opportunities, facilitating communication between candidates and employers, and providing analytics on hiring market trends.",
      "For candidates, we use your profile information to display your profile to employers (subject to your consent settings), match you to open roles, and notify you of opportunities that align with your preferences.",
      "For employers and partners, we use your information to verify your organization, surface relevant candidates, manage job postings and applications, process payments, and provide account support.",
      "We may also use aggregated, de-identified data for analytics, research, and product improvement. Such data cannot reasonably be used to identify any individual user.",
    ],
  },
  {
    id: "sharing",
    icon: Share2,
    title: "Data Sharing & Disclosure",
    paragraphs: [
      "We share candidate profile information with employers and recruiting agencies only when you apply to a job, accept an introduction, or explicitly consent to your profile being visible. You control your visibility through granular consent settings in your candidate portal.",
      "We share information with service providers who help us operate the Services — such as payment processors, cloud hosting, email delivery, and analytics tools. These providers are bound by strict data protection agreements and may only use your information to provide services to jobson.id.",
      "We may disclose information when required by law, court order, or government request, or when we believe in good faith that disclosure is necessary to protect our rights, the safety of any person, or to investigate fraud or misconduct.",
      "jobson.id never sells candidate data to third parties. We do not share your contact information with marketing partners or advertising networks for their independent use.",
    ],
  },
  {
    id: "security",
    icon: Lock,
    title: "Data Security",
    paragraphs: [
      "We implement industry-standard security measures to protect your information, including TLS encryption in transit, AES-256 encryption at rest, role-based access controls, regular security audits, and continuous monitoring for suspicious activity.",
      "Despite our efforts, no system can be guaranteed to be 100% secure. In the event of a data breach affecting your personal information, we will notify you and the relevant authorities within 72 hours, as required under the Digital Personal Data Protection (DPDP) Act, 2023.",
      "We conduct quarterly security reviews and annual penetration testing by independent third-party security firms. Our security practices are aligned with ISO 27001 and SOC 2 Type II frameworks.",
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies & Tracking Technologies",
    paragraphs: [
      "We use cookies and similar technologies to operate the Services, remember your preferences, analyze usage, and personalize content. You can manage cookies through your browser settings, but disabling cookies may limit certain features.",
      "We use four categories of cookies: (1) Strictly necessary cookies for core functionality; (2) Preference cookies for remembering your settings; (3) Analytics cookies for understanding usage; and (4) Marketing cookies (opt-in only) for measuring campaign effectiveness.",
      "We do not use cookies to track you across third-party websites for advertising purposes. Our marketing cookies, when enabled, are used solely to measure the effectiveness of our own campaigns.",
    ],
  },
  {
    id: "rights",
    icon: UserCog,
    title: "Your Rights",
    paragraphs: [
      "Under the DPDP Act and other applicable laws, you have the right to: (a) access the personal information we hold about you; (b) request correction of inaccurate information; (c) request deletion of your personal information (subject to legal retention requirements); (d) withdraw consent for processing; and (e) data portability — receiving your data in a structured, machine-readable format.",
      "To exercise any of these rights, please contact us at privacy@jobson.id or through the privacy controls in your account settings. We respond to all requests within 30 days.",
      "If you are not satisfied with our response, you have the right to lodge a complaint with the Data Protection Board of India or other relevant regulatory authority.",
    ],
  },
  {
    id: "retention",
    icon: Archive,
    title: "Data Retention",
    paragraphs: [
      "We retain your personal information for as long as your account is active, plus a reasonable period thereafter to comply with legal obligations, resolve disputes, and enforce our agreements.",
      "Candidate profiles are retained for 24 months after your last login. You may request earlier deletion at any time. Employer job postings and applications are retained for 36 months after the position is closed.",
      "Payment records are retained for 7 years as required by Indian tax and accounting laws. Anonymized, aggregated data may be retained indefinitely for analytics and research.",
      "When data is no longer needed, we delete it or anonymize it so that it cannot be associated with you.",
    ],
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Us",
    paragraphs: [
      "If you have questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@jobson.id or write to: Data Protection Officer, jobson.id Intelligence Pvt. Ltd., 24 Residency Road, Ashok Nagar, Bengaluru 560025, Karnataka, India.",
      "For data subject rights requests, please use the dedicated form in your account settings or email dpo@jobson.id with the subject line \"Data Rights Request\". Include your registered email so we can verify your identity.",
      "We are committed to working with you to resolve any concerns about your privacy. If you believe we have not addressed your concern, you may escalate to the Data Protection Board of India.",
    ],
  },
];

export function PublicPrivacy() {
  return (
    <PublicLegalPage
      title="Privacy Policy"
      icon={Shield}
      badge="Legal"
      intro="How jobson.id collects, uses, shares, and protects your personal information. We're DPDP-ready and committed to consent-driven, transparent data practices."
      lastUpdated="January 15, 2025"
      sections={SECTIONS}
    />
  );
}
