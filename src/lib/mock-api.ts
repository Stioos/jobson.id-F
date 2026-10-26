"use client";

import {
  applications,
  allApplications,
  assessmentResults,
  assessments,
  auditLogs,
  candidateProfiles,
  certifications,
  employers,
  agencies,
  integrations,
  interviews,
  invoices,
  jobs,
  employerJobsExtra,
  messages,
  notifications,
  offers,
  payments,
  plans,
  platformUsers,
  projectOpportunities,
  promotions,
  referrals,
  subscriptions,
  supportTickets,
  talentPools,
  trainingCourses,
  flaggedJobs,
} from "./mock-data";
import type {
  ApplicationStatus,
  Job,
  JobApplication,
  Portal,
} from "./types";

// Simulated async latency
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

// ============================================================
// Jobs
// ============================================================
export const jobService = {
  async list(params?: {
    q?: string;
    location?: string;
    workArrangement?: string;
    employmentType?: string;
    experienceMin?: number;
    salaryMin?: number;
    category?: string;
    remote?: boolean;
    featured?: boolean;
    urgent?: boolean;
    postedWithinDays?: number;
    sort?: "relevance" | "recent" | "salary_high";
  }) {
    await delay();
    let result = [...jobs];
    if (params?.q) {
      const q = params.q.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.employerName.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (params?.location) {
      result = result.filter((j) => j.location.toLowerCase().includes(params.location!.toLowerCase()));
    }
    if (params?.workArrangement && params.workArrangement !== "any") {
      result = result.filter((j) => j.workArrangement === params.workArrangement);
    }
    if (params?.employmentType && params.employmentType !== "any") {
      result = result.filter((j) => j.employmentType === params.employmentType);
    }
    if (params?.category && params.category !== "any") {
      result = result.filter((j) => j.category === params.category);
    }
    if (typeof params?.experienceMin === "number") {
      result = result.filter((j) => j.experienceMax >= params.experienceMin!);
    }
    if (typeof params?.salaryMin === "number") {
      result = result.filter((j) => j.salaryMax >= params.salaryMin!);
    }
    if (params?.featured) result = result.filter((j) => j.featured);
    if (params?.urgent) result = result.filter((j) => j.urgent);
    if (params?.postedWithinDays) {
      const cutoff = Date.now() - params.postedWithinDays * 86400000;
      result = result.filter((j) => new Date(j.postedAt).getTime() >= cutoff);
    }
    if (params?.sort === "recent") {
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (params?.sort === "salary_high") {
      result.sort((a, b) => b.salaryMax - a.salaryMax);
    }
    return result;
  },
  async get(id: string) {
    await delay(80);
    return jobs.find((j) => j.id === id || j.slug === id) ?? null;
  },
  async getByEmployer(employerId: string) {
    await delay();
    return [...jobs, ...employerJobsExtra].filter((j) => j.employerId === employerId);
  },
  async featured() {
    await delay();
    return jobs.filter((j) => j.featured && j.status === "published");
  },
  async recommended(candidateId: string) {
    await delay(180);
    // Simulated AI recommendation
    const candidate = candidateProfiles.find((c) => c.id === candidateId) ?? candidateProfiles[0];
    return jobs
      .filter((j) => j.status === "published")
      .map((j) => {
        const matched = j.skills.filter((s) => candidate.skills.some((cs) => cs.skill === s));
        const missing = j.skills.filter((s) => !candidate.skills.some((cs) => cs.skill === s));
        const score = Math.min(99, Math.round(60 + (matched.length / Math.max(1, j.skills.length)) * 35));
        return { job: j, score, matched, missing };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  },
};

// ============================================================
// Applications
// ============================================================
export const applicationService = {
  async listForCandidate(candidateId: string) {
    await delay();
    return applications.filter((a) => a.candidateId === candidateId);
  },
  async listForJob(jobId: string) {
    await delay();
    return allApplications.filter((a) => a.jobId === jobId);
  },
  async listForEmployer(_employerId: string) {
    await delay();
    return allApplications;
  },
  async updateStatus(id: string, status: ApplicationStatus, note?: string) {
    await delay(100);
    const app = allApplications.find((a) => a.id === id);
    if (app) {
      app.status = status;
      app.updatedAt = new Date().toISOString();
      app.timeline.push({
        id: `t_${Date.now()}`,
        status,
        timestamp: new Date().toISOString(),
        actor: "You",
        note,
      });
    }
    return app;
  },
  async apply(jobId: string, candidateId: string, answers: { question: string; answer: string }[]) {
    await delay(200);
    const job = jobs.find((j) => j.id === jobId)!;
    const candidate = candidateProfiles.find((c) => c.id === candidateId) ?? candidateProfiles[0];
    const matched = job.skills.filter((s) => candidate.skills.some((cs) => cs.skill === s));
    const missing = job.skills.filter((s) => !candidate.skills.some((cs) => cs.skill === s));
    const score = Math.min(99, Math.round(55 + (matched.length / Math.max(1, job.skills.length)) * 40));
    const newApp: JobApplication = {
      id: `a_new_${Date.now()}`,
      jobId,
      jobTitle: job.title,
      employerName: job.employerName,
      employerLogo: job.employerLogo,
      candidateId,
      candidateName: candidate.name,
      status: "submitted",
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      matchScore: score,
      matchReasons: matched.map((m) => `${m} matched`),
      missingSkills: missing,
      answers,
      stage: 1,
      timeline: [{ id: "t1", status: "submitted", timestamp: new Date().toISOString(), actor: candidate.name }],
      rating: 0,
      tags: [],
      notes: [],
    };
    allApplications.unshift(newApp);
    applications.unshift(newApp);
    return newApp;
  },
};

// ============================================================
// Employers, Agencies, Candidates
// ============================================================
export const employerService = {
  async list() {
    await delay();
    return employers;
  },
  async get(slug: string) {
    await delay(80);
    return employers.find((e) => e.slug === slug || e.id === slug) ?? null;
  },
  async jobsForEmployer(id: string) {
    await delay();
    return [...jobs, ...employerJobsExtra].filter((j) => j.employerId === id);
  },
};
export const agencyService = {
  async list() {
    await delay();
    return agencies;
  },
};
export const candidateService = {
  async get(id: string) {
    await delay(80);
    return candidateProfiles.find((c) => c.id === id) ?? candidateProfiles[0];
  },
  async list() {
    await delay();
    return candidateProfiles;
  },
};

// ============================================================
// Interviews, Assessments, Offers
// ============================================================
export const interviewService = {
  async list() {
    await delay();
    return interviews;
  },
};
export const assessmentService = {
  async list() {
    await delay();
    return assessments;
  },
  async results() {
    await delay();
    return assessmentResults;
  },
};
export const offerService = {
  async list() {
    await delay();
    return offers;
  },
};

// ============================================================
// Comms
// ============================================================
export const messageService = {
  async list(folder?: string) {
    await delay();
    return folder ? messages.filter((m) => m.folder === folder) : messages;
  },
};
export const notificationService = {
  async list() {
    await delay(60);
    return notifications;
  },
};

// ============================================================
// Billing
// ============================================================
export const planService = { async list() { await delay(); return plans; } };
export const subscriptionService = { async list() { await delay(); return subscriptions; } };
export const invoiceService = { async list() { await delay(); return invoices; } };
export const paymentService = { async list() { await delay(); return payments; } };
export const promotionService = { async list() { await delay(); return promotions; } };
export const referralService = { async list() { await delay(); return referrals; } };

// ============================================================
// Learning & marketplace
// ============================================================
export const trainingService = { async list() { await delay(); return trainingCourses; } };
export const certificationService = { async list() { await delay(); return certifications; } };
export const projectService = { async list() { await delay(); return projectOpportunities; } };

// ============================================================
// Talent & admin
// ============================================================
export const talentPoolService = { async list() { await delay(); return talentPools; } };
export const supportService = { async list() { await delay(); return supportTickets; } };
export const auditService = { async list() { await delay(); return auditLogs; } };
export const integrationService = { async list() { await delay(); return integrations; } };
export const adminUserService = { async list() { await delay(); return platformUsers; } };
export const moderationService = { async list() { await delay(); return flaggedJobs; } };

// ============================================================
// Simulated AI services (mock) — clearly labelled
// ============================================================
export const aiService = {
  async parseResume(_fileName: string) {
    await delay(900);
    return {
      name: "Priya Nair",
      headline: "Senior Frontend Engineer",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      experienceYears: 6,
      education: "B.E. Computer Science, BITS Pilani",
      confidence: 0.94,
      simulated: true,
    };
  },
  async generateJobDescription(title: string, department: string) {
    await delay(1100);
    return {
      description: `We are seeking a talented ${title} to join our ${department} team. You will be responsible for delivering high-impact features, collaborating across functions, and driving technical excellence. This is a hands-on role requiring strong problem-solving, ownership, and a passion for quality.`,
      responsibilities: [
        "Design and ship features end-to-end",
        "Collaborate with product, design, and engineering",
        "Write tested, maintainable, well-documented code",
        "Participate in code reviews and mentorship",
      ],
      requirements: [
        "Relevant professional experience",
        "Strong fundamentals in computer science",
        "Excellent communication skills",
      ],
      simulated: true,
    };
  },
  async matchCandidateToJob(jobId: string, candidateId: string) {
    await delay(700);
    const job = jobs.find((j) => j.id === jobId)!;
    const candidate = candidateProfiles.find((c) => c.id === candidateId) ?? candidateProfiles[0];
    const matched = job.skills.filter((s) => candidate.skills.some((cs) => cs.skill === s));
    const missing = job.skills.filter((s) => !candidate.skills.some((cs) => cs.skill === s));
    return {
      score: Math.min(99, Math.round(60 + (matched.length / Math.max(1, job.skills.length)) * 35)),
      matched,
      missing,
      reasons: matched.map((m) => `${m} — verified in candidate profile`),
      simulated: true,
    };
  },
  async generateInterviewQuestions(jobTitle: string, type: string) {
    await delay(900);
    const base: Record<string, string[]> = {
      technical: [
        "Walk us through a complex system you designed. What were the trade-offs?",
        "How would you design X for 10x scale?",
        "Describe a production incident you led. Root cause and postmortem?",
        "How do you approach testing strategy for a critical service?",
      ],
      hr: [
        "Tell us about yourself and why this role?",
        "Describe a conflict with a teammate and how you resolved it.",
        "Where do you see yourself in 3 years?",
        "What does your ideal team look like?",
      ],
    };
    return {
      questions: base[type] ?? base.technical,
      jobTitle,
      simulated: true,
    };
  },
  async checkBias(text: string) {
    await delay(800);
    const masculine = ["aggressive", "dominant", "rockstar", "ninja", "competitive"];
    const found = masculine.filter((w) => text.toLowerCase().includes(w));
    return {
      biasTerms: found,
      inclusivityScore: Math.max(60, 100 - found.length * 12),
      suggestions: found.map((w) => `Consider replacing "${w}" with neutral language`),
      simulated: true,
    };
  },
};

// ============================================================
// LMS / Corporate Training Services
// ============================================================
import {
  trainingCompany, corporateClients, trainingCourses as lmsCourses, draftCourses,
  learningPaths, cohorts, liveSessions, trainers, trainingAssessments,
  questionBank, assessmentAttempts, certificates, certificateTemplates,
  skillFrameworks, skillGaps, learnerEnrollments, trainingPrograms,
  complianceTracks, surveys, gamificationConfig, learnerAchievements,
  trainingBudgets, trainingInvoices, contentLibrary, workflowAutomations,
} from "./lms-data";

export const lmsCompanyService = { async get() { await delay(60); return trainingCompany; } };
export const lmsClientService = {
  async list() { await delay(); return corporateClients; },
  async get(id: string) { await delay(80); return corporateClients.find((c) => c.id === id) ?? null; },
};
export const lmsCourseService = {
  async list() { await delay(); return [...lmsCourses, ...draftCourses]; },
  async published() { await delay(); return lmsCourses.filter((c) => c.status === "published"); },
  async get(id: string) { await delay(80); return [...lmsCourses, ...draftCourses].find((c) => c.id === id) ?? null; },
};
export const lmsPathService = { async list() { await delay(); return learningPaths; } };
export const lmsCohortService = { async list() { await delay(); return cohorts; } };
export const lmsSessionService = { async list() { await delay(); return liveSessions; } };
export const lmsTrainerService = { async list() { await delay(); return trainers; } };
export const lmsAssessmentService = {
  async list() { await delay(); return trainingAssessments; },
  async questions() { await delay(); return questionBank; },
  async attempts() { await delay(); return assessmentAttempts; },
};
export const lmsCertificateService = {
  async list() { await delay(); return certificates; },
  async templates() { await delay(); return certificateTemplates; },
};
export const lmsSkillService = {
  async frameworks() { await delay(); return skillFrameworks; },
  async gaps() { await delay(); return skillGaps; },
};
export const lmsEnrollmentService = { async list() { await delay(); return learnerEnrollments; } };
export const lmsProgramService = { async list() { await delay(); return trainingPrograms; } };
export const lmsComplianceService = { async list() { await delay(); return complianceTracks; } };
export const lmsSurveyService = { async list() { await delay(); return surveys; } };
export const lmsGamificationService = {
  async config() { await delay(60); return gamificationConfig; },
  async achievements() { await delay(); return learnerAchievements; },
};
export const lmsBudgetService = { async list() { await delay(); return trainingBudgets; } };
export const lmsInvoiceService = { async list() { await delay(); return trainingInvoices; } };
export const lmsContentService = { async list() { await delay(); return contentLibrary; } };
export const lmsWorkflowService = { async list() { await delay(); return workflowAutomations; } };

export const lmsAiService = {
  async generateCourseOutline(title: string, category: string) {
    await delay(1000);
    return {
      modules: [
        { title: `${title} — Fundamentals`, lessons: ["Introduction & Core Concepts", "Key Terminology", "Foundational Principles"] },
        { title: "Practical Application", lessons: ["Hands-on Exercise", "Real-world Scenarios", "Best Practices"] },
        { title: "Advanced Topics & Assessment", lessons: ["Advanced Techniques", "Common Pitfalls", "Final Assessment"] },
      ],
      objectives: [`Master core ${category} concepts`, `Apply skills in real scenarios`, `Pass the final assessment`],
      simulated: true,
    };
  },
  async recommendCourses(learnerId: string) {
    await delay(800);
    const enrollments = learnerEnrollments.filter((e) => e.learnerId === learnerId);
    const completed = enrollments.filter((e) => e.status === "completed" || e.status === "certified");
    const inProgress = enrollments.filter((e) => e.status === "in_progress");
    return {
      recommendations: lmsCourses.filter((c) => c.status === "published").slice(0, 4).map((c) => ({
        course: c,
        reason: `Matches your interest in ${c.category}`,
        matchScore: 70 + Math.floor(Math.random() * 25),
      })),
      completedCount: completed.length,
      inProgressCount: inProgress.length,
      simulated: true,
    };
  },
  async skillGapAnalysis(clientId: string) {
    await delay(900);
    return {
      gaps: skillGaps,
      recommendations: skillGaps.map((g) => `Enroll ${g.employeesAffected} employees in ${g.skillName} training`),
      prioritySkills: skillGaps.filter((g) => g.gap >= 2).map((g) => g.skillName),
      simulated: true,
    };
  },
};
