"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";
import { TALENT_SOLUTIONS_CONFIG, getTalentSolution } from "@/data/talentSolutionsConfig";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common";
import { Home, AlertCircle } from "lucide-react";

// Lazy-load each page so Turbopack only compiles the ACTIVE page's dependency
// tree (not all 10 pages at once). This keeps dev-server memory bounded.
const PublicHome = dynamic(() => import("./PublicHome").then((m) => m.PublicHome));
const PublicJobs = dynamic(() => import("./PublicJobs").then((m) => m.PublicJobs));
const PublicJobDetail = dynamic(() => import("./PublicJobDetail").then((m) => m.PublicJobDetail));
const PublicCompanies = dynamic(() => import("./PublicCompanies").then((m) => m.PublicCompanies));
const PublicCompanyDetail = dynamic(() => import("./PublicCompanyDetail").then((m) => m.PublicCompanyDetail));
const PublicSalaryInsights = dynamic(() => import("./PublicSalaryInsights").then((m) => m.PublicSalaryInsights));
const PublicTraining = dynamic(() => import("./PublicTraining").then((m) => m.PublicTraining));
const PublicCareerResources = dynamic(() => import("./PublicCareerResources").then((m) => m.PublicCareerResources));
const PublicAbout = dynamic(() => import("./PublicAbout").then((m) => m.PublicAbout));
const PublicContact = dynamic(() => import("./PublicContact").then((m) => m.PublicContact));
const PublicPartnerLogin = dynamic(() => import("./PublicPartnerLogin").then((m) => m.PublicPartnerLogin));
const PublicAuth = dynamic(() => import("./PublicAuth").then((m) => m.PublicAuth));
const PublicRegister = dynamic(() => import("./PublicRegister").then((m) => m.PublicRegister));
const PublicAccount = dynamic(() => import("./PublicAccount").then((m) => m.PublicAccount));
const PublicPartnerModels = dynamic(() => import("./PublicPartnerModels").then((m) => m.PublicPartnerModels));
const PublicPartnerPrograms = dynamic(() => import("./PublicPartnerPrograms").then((m) => m.PublicPartnerPrograms));
const PublicPartnerCalculator = dynamic(() => import("./PublicPartnerCalculator").then((m) => m.PublicPartnerCalculator));
const PublicPartnerHowItWorks = dynamic(() => import("./PublicPartnerHowItWorks").then((m) => m.PublicPartnerHowItWorks));
const PublicPartnerStories = dynamic(() => import("./PublicPartnerStories").then((m) => m.PublicPartnerStories));
const PublicPartnerFaqs = dynamic(() => import("./PublicPartnerFaqs").then((m) => m.PublicPartnerFaqs));
const PublicPartnerApply = dynamic(() => import("./PublicPartnerApply").then((m) => m.PublicPartnerApply));
const PublicPrograms = dynamic(() => import("./PublicPrograms").then((m) => m.PublicPrograms));
const PublicProgramDetail = dynamic(() => import("./PublicProgramDetail").then((m) => m.PublicProgramDetail));
const PublicProgramRole = dynamic(() => import("./PublicProgramRole").then((m) => m.PublicProgramRole));
const PublicPayAfterPlacement = dynamic(() => import("./PublicPayAfterPlacement").then((m) => m.PublicPayAfterPlacement));
const PublicScholarship = dynamic(() => import("./PublicScholarship").then((m) => m.PublicScholarship));
const PublicTechAIServices = dynamic(() => import("./PublicTechAIServices").then((m) => m.PublicTechAIServices));
const PublicServiceCategory = dynamic(() => import("./PublicServiceCategory").then((m) => m.PublicServiceCategory));
const PublicServiceDetail = dynamic(() => import("./PublicServiceDetail").then((m) => m.PublicServiceDetail));
const PublicProfessionalServices = dynamic(() => import("./PublicProfessionalServices").then((m) => m.PublicProfessionalServices));
const PublicProfessionalServiceDetail = dynamic(() => import("./PublicProfessionalServiceDetail").then((m) => m.PublicProfessionalServiceDetail));
const PublicTalentSolutions = dynamic(() => import("./PublicTalentSolutions").then((m) => m.PublicTalentSolutions));
const PublicTalentRole = dynamic(() => import("./PublicTalentRole").then((m) => m.PublicTalentRole));
const PublicTalentSourcingLanding = dynamic(() => import("./PublicTalentSourcingLanding").then((m) => m.PublicTalentSourcingLanding));
const PublicTalentSourcingSubPage = dynamic(() => import("./PublicTalentSourcingSubPage").then((m) => m.PublicTalentSourcingSubPage));
const PublicTalentSolutionLanding = dynamic(() => import("./PublicTalentSolutionLanding").then((m) => m.PublicTalentSolutionLanding));
const PublicTalentSolutionSubPage = dynamic(() => import("./PublicTalentSolutionSubPage").then((m) => m.PublicTalentSolutionSubPage));
const PublicPlacements = dynamic(() => import("./PublicPlacements").then((m) => m.PublicPlacements));
const PublicEvents = dynamic(() => import("./PublicEvents").then((m) => m.PublicEvents));
const PublicBlogs = dynamic(() => import("./PublicBlogs").then((m) => m.PublicBlogs));
const PublicBlogDetail = dynamic(() => import("./PublicBlogDetail").then((m) => m.PublicBlogDetail));
const PublicVisionMission = dynamic(() => import("./PublicVisionMission").then((m) => m.PublicVisionMission));
const PublicAcademyTraining = dynamic(() => import("./PublicAcademyTraining").then((m) => m.PublicAcademyTraining));
const PublicBecomeSalesAgent = dynamic(() => import("./PublicBecomeSalesAgent").then((m) => m.PublicBecomeSalesAgent));
const PublicIndustriesExperience = dynamic(() => import("./PublicIndustriesExperience").then((m) => m.PublicIndustriesExperience));
const PublicPartnerWithUs = dynamic(() => import("./PublicPartnerWithUs").then((m) => m.PublicPartnerWithUs));
const PublicPartnerSubPage = dynamic(() => import("./PublicPartnerSubPage").then((m) => m.PublicPartnerSubPage));
const PublicBecomeTechConsultant = dynamic(() => import("./PublicBecomeTechConsultant").then((m) => m.PublicBecomeTechConsultant));
const PublicFAQ = dynamic(() => import("./PublicFAQ").then((m) => m.PublicFAQ));
const PublicTerms = dynamic(() => import("./PublicTerms").then((m) => m.PublicTerms));
const PublicPrivacy = dynamic(() => import("./PublicPrivacy").then((m) => m.PublicPrivacy));
const PublicRefund = dynamic(() => import("./PublicRefund").then((m) => m.PublicRefund));
const PublicPlacementPolicy = dynamic(() => import("./PublicPlacementPolicy").then((m) => m.PublicPlacementPolicy));

export function PortalRouter() {
  const { route } = useNav();
  return <>{render(route)}</>;
}

export function render(route: string): React.ReactNode {
  const parts = route.split("/").filter(Boolean);
  const head = parts[0] ?? "home";

  switch (head) {
    case "home":
      return <PublicHome />;
    case "jobs":
      return parts[1] ? <PublicJobDetail id={parts[1]} /> : <PublicJobs />;
    case "companies":
      return parts[1] ? <PublicCompanyDetail slug={parts[1]} /> : <PublicCompanies />;
    case "salary-insights":
      return <PublicSalaryInsights />;
    case "training":
      return <PublicTraining />;
    case "career-resources":
      return <PublicCareerResources />;
    case "about":
      return <PublicAbout />;
    case "contact":
      return <PublicContact />;
    case "partner-login":
    case "auth":
    case "signin":
    case "login":
      return <PublicAuth />;
    case "register":
      // register/{roleKey} → role-specific registration page
      return <PublicRegister roleKey={parts[1] || "candidate"} />;
    case "account":
      return <PublicAccount />;
    case "partner-models":
      return <PublicPartnerModels />;
    case "partner-programs":
      return <PublicPartnerPrograms />;
    case "partner-calculator":
      return <PublicPartnerCalculator />;
    case "partner-how-it-works":
      return <PublicPartnerHowItWorks />;
    case "partner-stories":
      return <PublicPartnerStories />;
    case "partner-faqs":
      return <PublicPartnerFaqs />;
    case "partner-apply":
      return <PublicPartnerApply />;
    case "programs":
      if (!parts[1]) return <PublicPrograms />;
      if (
        parts[1] === "fde-forward-deployment" ||
        parts[1] === "fde-program" ||
        parts[1] === "dsai-program" ||
        parts[1] === "cdm-program" ||
        parts[1] === "gaa-program"
      ) {
        return <PublicProgramDetail programId={parts[1]} />;
      }
      return <PublicProgramRole roleView={parts[1]} />;
    case "pay-after-placement":
      return <PublicPayAfterPlacement />;
    case "scholarship":
      return <PublicScholarship />;
    case "tech-ai-services":
      return <PublicTechAIServices />;
    case "services":
      // services/{catSlug}                → category detail
      // services/{catSlug}/{svcSlug}      → service detail
      if (!parts[1]) return <PublicTechAIServices />;
      if (parts[2]) return <PublicServiceDetail catSlug={parts[1]} svcSlug={parts[2]} />;
      return <PublicServiceCategory catSlug={parts[1]} />;
    case "professional-services":
      // professional-services             → landing
      // professional-services/{slug}      → detail
      if (!parts[1]) return <PublicProfessionalServices />;
      return <PublicProfessionalServiceDetail slug={parts[1]} />;
    case "talent-solutions":
      if (parts[1]) {
        const sol = getTalentSolution(parts[1]);
        if (sol) {
          if (parts[2]) return <PublicTalentSolutionSubPage solutionKey={sol.solutionKey} subPageKey={parts[2]} />;
          return <PublicTalentSolutionLanding solutionKey={sol.solutionKey} />;
        }
      }
      return <PublicTalentSolutions />;
    case "talent":
      // talent/{solutionKey}                     → generic landing (all 9 solutions)
      // talent/{solutionKey}/{subPageKey}        → generic sub-page (8 sub-pages each)
      if (!parts[1]) return <PublicTalentSolutions />;
      const talentSolution = getTalentSolution(parts[1]);
      if (talentSolution) {
        if (parts[2]) return <PublicTalentSolutionSubPage solutionKey={talentSolution.solutionKey} subPageKey={parts[2]} />;
        return <PublicTalentSolutionLanding solutionKey={talentSolution.solutionKey} />;
      }
      // Fallback: other talent roles (single pages)
      return <PublicTalentRole roleKey={parts[1]} />;
    case "placements":
      if (parts[1]) return <PublicTalentSolutionSubPage solutionKey="placements" subPageKey={parts[1]} />;
      return <PublicTalentSolutionLanding solutionKey="placements" />;
    case "events":
      return <PublicEvents />;
    case "blogs":
      // blogs/{slug}                    → blog detail
      // bare blogs                      → blog listing
      if (!parts[1]) return <PublicBlogs />;
      return <PublicBlogDetail slug={parts[1]} />;
    case "vision-mission":
      return <PublicVisionMission />;
    case "academy-training":
      return <PublicAcademyTraining />;
    case "become-sales-agent":
      return <PublicBecomeSalesAgent />;
    case "industries-experience":
      return <PublicIndustriesExperience />;
    case "partner-with-us":
      // partner-with-us                        → main landing
      // partner-with-us/{partnerKey}           → partner sub-page
      if (!parts[1]) return <PublicPartnerWithUs />;
      return <PublicPartnerSubPage partnerKey={parts[1]} />;
    case "become-tech-consultant":
      return <PublicBecomeTechConsultant />;
    case "faq":
      return <PublicFAQ />;
    case "terms":
      return <PublicTerms />;
    case "privacy":
      return <PublicPrivacy />;
    case "refund":
      return <PublicRefund />;
    case "placement-policy":
      return <PublicPlacementPolicy />;
    default:
      return <NotFound />;
  }
}

function NotFound() {
  const { navigate } = useNav();
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-20">
      <EmptyState
        icon={<AlertCircle className="h-6 w-6" />}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={
          <Button onClick={() => navigate("public", "home")} className="gap-1.5">
            <Home className="h-4 w-4" /> Back to home
          </Button>
        }
      />
    </div>
  );
}
