"use client";

import * as React from "react";
import {
  FileText, FileCheck, UserCheck, UserCog, MonitorPlay,
  ShieldAlert, AlertTriangle, RefreshCcw, BookOpenCheck,
} from "lucide-react";
import { PublicLegalPage, type LegalSection } from "./PublicLegalShared";

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    icon: FileCheck,
    title: "Acceptance of Terms",
    paragraphs: [
      "Welcome to jobson.id. By accessing or using our website, mobile applications, candidate portal, employer portal, training portal, agency portal, or any related services (collectively, the \"Services\"), you agree to be bound by these Terms of Service (\"Terms\").",
      "If you do not agree to these Terms, you must not access or use the Services. If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms, and the terms \"you\" and \"your\" refer to both you and that organization.",
      "These Terms form a legally binding agreement between you and jobson.id Intelligence Pvt. Ltd. (\"jobson.id\", \"we\", \"us\", or \"our\").",
    ],
  },
  {
    id: "eligibility",
    icon: UserCheck,
    title: "Eligibility",
    paragraphs: [
      "You must be at least 18 years of age and legally capable of entering into contracts to use the Services. By using the Services, you represent and warrant that you meet these eligibility requirements.",
      "If you are using the Services as a candidate, you further represent that all information provided in your profile — including education, employment history, skills, and preferences — is accurate and verifiable.",
      "If you are using the Services as an employer, agency, or partner, you represent that you are authorized to hire on behalf of your organization and that any job postings, candidate communications, and hiring decisions comply with applicable Indian labor laws, including but not limited to the Industrial Employment (Standing Orders) Act, the Payment of Wages Act, and state-specific shops and establishments regulations.",
    ],
  },
  {
    id: "accounts",
    icon: UserCog,
    title: "User Accounts",
    paragraphs: [
      "To access most features of the Services, you must register for an account. You agree to provide accurate, current, and complete information during registration and to keep your account information updated.",
      "You are solely responsible for maintaining the confidentiality of your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other security breach.",
      "jobson.id reserves the right to suspend or terminate accounts that violate these Terms, including accounts engaged in fraudulent job postings, fake candidate profiles, spam, harassment, or any activity that compromises the integrity of the hiring ecosystem.",
    ],
  },
  {
    id: "platform-use",
    icon: MonitorPlay,
    title: "Platform Use & Acceptable Use Policy",
    paragraphs: [
      "You agree to use the Services only for lawful purposes and in accordance with these Terms. You will not use the Services to: (a) post false, misleading, or fraudulent job postings or candidate profiles; (b) harass, discriminate, or defame any user; (c) collect candidate data for purposes other than legitimate hiring; (d) attempt to reverse-engineer, scrape, or otherwise access our systems in ways not authorized by us; or (e) introduce malware, viruses, or any harmful code.",
      "jobson.id employs AI-assisted matching features. These features are clearly labelled, and where they are still in calibration, they will be marked as \"Simulated\". You acknowledge that AI matching is decision-support, not decision-making, and that hiring decisions remain the sole responsibility of the employer.",
      "We may modify, suspend, or discontinue any part of the Services at any time, with or without notice. We will not be liable to you or any third party for such modifications, suspensions, or discontinuances.",
    ],
  },
  {
    id: "ip",
    icon: ShieldAlert,
    title: "Intellectual Property",
    paragraphs: [
      "The Services, including all content, software, features, branding, and documentation, are the intellectual property of jobson.id and are protected by Indian and international copyright, trademark, and other laws.",
      "Content you submit to the Services — including candidate profiles, resumes, job postings, and messages — remains your property. By submitting such content, you grant jobson.id a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content solely for the purpose of operating and improving the Services.",
      "You represent that you have all necessary rights to the content you submit and that the content does not infringe the intellectual property rights of any third party.",
    ],
  },
  {
    id: "liability",
    icon: AlertTriangle,
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, jobson.id shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising from your use of the Services.",
      "jobson.id provides the Services on an \"as is\" and \"as available\" basis. We do not warrant that the Services will be uninterrupted, error-free, or secure, or that any matching, recommendation, or placement outcome will result in employment.",
      "Our total liability for any claim arising from these Terms or your use of the Services shall not exceed the amount you have paid to jobson.id in the 12 months preceding the claim, or ₹5,000 (Indian Rupees), whichever is greater.",
    ],
  },
  {
    id: "disclaimers",
    icon: RefreshCcw,
    title: "Disclaimers",
    paragraphs: [
      "jobson.id is a hiring platform that facilitates connections between candidates, employers, and recruiting partners. We are not a party to any employment relationship formed through the Services and are not responsible for the conduct of any user — whether candidate, employer, or agency — on or off the platform.",
      "Salary insights, market trends, and other analytics displayed on the Services are illustrative and based on aggregated data. They do not represent guarantees of salary, placement, or market conditions.",
      "Testimonials, case studies, and success stories on the Services reflect individual experiences and are not representative of typical outcomes. Past performance does not guarantee future results.",
    ],
  },
  {
    id: "changes",
    icon: BookOpenCheck,
    title: "Changes to Terms",
    paragraphs: [
      "We may update these Terms from time to time. When we do, we will revise the \"Last updated\" date at the top of this page and, for material changes, notify you via email or in-app notification.",
      "Your continued use of the Services after the effective date of any change constitutes your acceptance of the updated Terms. If you do not agree to the updated Terms, you must stop using the Services.",
      "If you have questions about these Terms, please contact us at legal@jobson.id or write to jobson.id Intelligence Pvt. Ltd., 24 Residency Road, Ashok Nagar, Bengaluru 560025, Karnataka, India.",
    ],
  },
];

export function PublicTerms() {
  return (
    <PublicLegalPage
      title="Terms of Service"
      icon={FileText}
      badge="Legal"
      intro="The terms that govern your use of jobson.id's hiring platform, training programs, and related services. Please read them carefully — they define your rights and responsibilities."
      lastUpdated="January 15, 2025"
      sections={SECTIONS}
    />
  );
}
