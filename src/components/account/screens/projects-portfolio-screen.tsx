"use client";

import { useState, useMemo } from "react";
import {
  FolderGit2, Plus, ChevronRight, Star, Search, Filter,
  LayoutGrid, List, X, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ProjectForm, PortfolioForm, AwardForm, PublicationForm,
  ProjectCard, PortfolioCard, AwardCard, PublicationCard,
  emptyProject, emptyPortfolio, emptyAward, emptyPublication,
  type ProjectRecord, type PortfolioRecord, type AwardRecord, type PublicationRecord,
} from "./projects-portfolio/portfolio-components";
import {
  PROJECT_CATEGORIES, PROJECT_STATUSES, WORK_CATEGORIES,
  AWARD_CATEGORIES, PUBLICATION_TYPES, VISIBILITY_OPTIONS,
} from "@/data/projects-data";

interface ProjectsPortfolioScreenProps {
  onNavigate?: (sectionId: string) => void;
}

type EntryType = "projects" | "portfolio" | "awards" | "publications";
type SortKey = "recent" | "title";

// Seed data — preserves existing records but with all new fields
function seedProjects(): ProjectRecord[] {
  return [
    {
      id: "p1", title: "E-Commerce Analytics Platform", category: "Web Application", type: "Professional / Company Project",
      role: "Lead Frontend Engineer", description: "Built a real-time analytics dashboard processing 1M+ events/day with React, Node.js and Kafka.",
      status: "Completed", startDate: "2023-01-15", visibility: "Public",
      endDate: "2023-08-30", isOngoing: false, organization: "Tech Solutions Pvt Ltd", clientName: "",
      teamSize: "6", teamType: "Team Project", teamPosition: "Tech Lead", location: "", country: "India", state: "Karnataka", city: "Bengaluru",
      technologies: ["React", "TypeScript", "Node.js", "Kafka", "AWS"],
      programmingLanguages: ["TypeScript"], frameworks: ["React", "Node.js"],
      databases: ["PostgreSQL"], cloudPlatforms: ["AWS"], devTools: ["Git", "Jira"],
      apis: [], technicalSkills: [], architecture: ["Microservices"], versionControl: ["Git"],
      roleSummary: "Led frontend architecture for the analytics platform.",
      keyResponsibilities: "Led a team of 6 engineers; architected microservices and CI/CD pipelines.",
      individualContribution: "Built the real-time event processing pipeline and dashboard.",
      teamResponsibilities: "Code reviews and mentoring.", majorChallenges: "Handling 1M+ events/day with low latency.",
      solutionsImplemented: "Implemented Kafka + Redis caching for sub-second dashboards.",
      technicalDecisions: "Chose React Query for server state; Tailwind for design system.",
      leadershipResponsibilities: "Mentored 4 engineers; ran sprint planning.",
      outcomes: "Reduced deployment time by 60%; improved dashboard performance by 40%.",
      businessImpact: "Enabled real-time business decisions; $2M+ revenue impact.",
      achievements: [
        { id: "a1", type: "Performance Improvement", title: "Improved dashboard performance", description: "Optimized database queries and caching", metric: "40%" },
        { id: "a2", type: "Users / Customers Served", title: "Active users", description: "Onboarded enterprise customers", metric: "1M+ users" },
      ],
      links: [
        { id: "l1", type: "Live Project URL", url: "https://analytics.example.com", isPrimary: true },
        { id: "l2", type: "GitHub Repository", url: "https://github.com/user/analytics", isPrimary: false },
      ],
      attachments: [],
      isFeatured: true,
    },
    {
      id: "p2", title: "AI Resume Parser", category: "AI / Machine Learning", type: "Personal Project",
      role: "Full Stack Developer", description: "ML-powered resume parser achieving 94% accuracy across 10+ document formats.",
      status: "Completed", startDate: "2022-06-01", visibility: "Public",
      endDate: "2022-12-15", isOngoing: false, organization: "", clientName: "",
      teamSize: "1", teamType: "Individual Project", teamPosition: "", location: "", country: "India", state: "", city: "",
      technologies: ["Python", "FastAPI", "React", "PostgreSQL"],
      programmingLanguages: ["Python"], frameworks: ["React", "FastAPI"],
      databases: ["PostgreSQL"], cloudPlatforms: [], devTools: ["Git"],
      apis: ["OpenAI API"], technicalSkills: ["Machine Learning"], architecture: ["Serverless"], versionControl: ["Git"],
      roleSummary: "Built an end-to-end ML-powered resume parser.",
      keyResponsibilities: "Built ML model, API, and frontend from scratch.",
      individualContribution: "Designed the ML pipeline achieving 94% accuracy.",
      teamResponsibilities: "", majorChallenges: "Handling 10+ document formats with high accuracy.",
      solutionsImplemented: "Used ensemble of layout parser + LLM for robust extraction.",
      technicalDecisions: "Chose FastAPI for async performance; React for UI.",
      leadershipResponsibilities: "",
      outcomes: "Achieved 94% accuracy across 10+ formats.",
      businessImpact: "",
      achievements: [{ id: "a3", type: "Performance Improvement", title: "Parser accuracy", description: "Across 10+ formats", metric: "94%" }],
      links: [
        { id: "l3", type: "Live Project URL", url: "https://resumeparser.example.com", isPrimary: true },
        { id: "l4", type: "GitHub Repository", url: "https://github.com/user/resume-parser", isPrimary: false },
      ],
      attachments: [],
      isFeatured: false,
    },
  ];
}

function seedPortfolio(): PortfolioRecord[] {
  return [
    { id: "w1", title: "UI Design System", category: "UI / UX Design", description: "A component library used across 5 products.", role: "Lead Designer", skills: ["Figma", "Design Systems", "Accessibility"], workSampleUrl: "https://figma.com/file/abc", previewUrl: "", completionDate: "2023-05-20", visibility: "Public", isFeatured: true },
    { id: "w2", title: "Technical Blog Series", category: "Content Writing", description: "12 articles on scalable architecture published on Medium.", role: "Author", skills: ["Technical Writing", "Distributed Systems"], workSampleUrl: "https://medium.com/@user", previewUrl: "", completionDate: "2023-09-01", visibility: "Public", isFeatured: false },
  ];
}

function seedAwards(): AwardRecord[] {
  return [
    { id: "aw1", title: "Smart India Hackathon Winner", category: "Hackathon Recognition", issuingOrg: "Govt. of India", description: "Won the national-level hackathon among 5000+ teams.", awardDate: "2018-03-15", recognitionLevel: "National", certificateNumber: "SIH-2018-001234", verificationUrl: "https://sih.gov.in/verify/1234", attachmentName: "SIH-Certificate.pdf", visibility: "Public", isFeatured: true },
    { id: "aw2", title: "Best Innovator Award", category: "Company Recognition", issuingOrg: "Tech Solutions Pvt Ltd", description: "Annual innovation award for the payments platform project.", awardDate: "2022-12-20", recognitionLevel: "Internal / Company", certificateNumber: "", verificationUrl: "", attachmentName: "", visibility: "Public", isFeatured: false },
  ];
}

function seedPublications(): PublicationRecord[] {
  return [
    { id: "pu1", title: "Scaling React Apps to Millions of Users", type: "Blog / Industry Article", researchArea: "Frontend Performance", abstract: "A deep dive into techniques for scaling React applications to handle millions of users.", authorName: "John Doe", coAuthors: "", publisher: "Medium · Engineering Blog", publicationDate: "2023-04-10", doi: "", isbn: "", url: "https://medium.com/@user/scaling-react", attachmentName: "", patentNumber: "", patentStatus: "Not Applicable", visibility: "Public", isFeatured: true },
  ];
}

export function ProjectsPortfolioScreen({ onNavigate }: ProjectsPortfolioScreenProps) {
  const [projects, setProjects] = useState<ProjectRecord[]>(seedProjects);
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>(seedPortfolio);
  const [awards, setAwards] = useState<AwardRecord[]>(seedAwards);
  const [publications, setPublications] = useState<PublicationRecord[]>(seedPublications);

  const [activeTab, setActiveTab] = useState<EntryType>("projects");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectDraft, setProjectDraft] = useState<ProjectRecord>(emptyProject());
  const [portfolioDraft, setPortfolioDraft] = useState<PortfolioRecord>(emptyPortfolio());
  const [awardDraft, setAwardDraft] = useState<AwardRecord>(emptyAward());
  const [pubDraft, setPubDraft] = useState<PublicationRecord>(emptyPublication());
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: EntryType; id: string; title: string } | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // ─── Projects handlers ───
  const openAdd = () => {
    setEditingId(null);
    if (activeTab === "projects") setProjectDraft(emptyProject());
    else if (activeTab === "portfolio") setPortfolioDraft(emptyPortfolio());
    else if (activeTab === "awards") setAwardDraft(emptyAward());
    else setPubDraft(emptyPublication());
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSaveProject = (p: ProjectRecord) => {
    setProjects((prev) => {
      if (editingId) return prev.map((x) => (x.id === editingId ? { ...p, id: editingId } : x));
      return [...prev, { ...p, id: `p-${Date.now()}` }];
    });
    toast.success(editingId ? "Project updated successfully!" : "Project added successfully!");
    closeForm();
  };
  const handleSavePortfolio = (p: PortfolioRecord) => {
    setPortfolios((prev) => {
      if (editingId) return prev.map((x) => (x.id === editingId ? { ...p, id: editingId } : x));
      return [...prev, { ...p, id: `w-${Date.now()}` }];
    });
    toast.success(editingId ? "Portfolio item updated successfully!" : "Portfolio item added successfully!");
    closeForm();
  };
  const handleSaveAward = (a: AwardRecord) => {
    setAwards((prev) => {
      if (editingId) return prev.map((x) => (x.id === editingId ? { ...a, id: editingId } : x));
      return [...prev, { ...a, id: `aw-${Date.now()}` }];
    });
    toast.success(editingId ? "Award updated successfully!" : "Award added successfully!");
    closeForm();
  };
  const handleSavePub = (p: PublicationRecord) => {
    setPublications((prev) => {
      if (editingId) return prev.map((x) => (x.id === editingId ? { ...p, id: editingId } : x));
      return [...prev, { ...p, id: `pu-${Date.now()}` }];
    });
    toast.success(editingId ? "Publication updated successfully!" : "Publication added successfully!");
    closeForm();
  };

  const handleDeleteClick = (type: EntryType, id: string, title: string) => setDeleteConfirm({ type, id, title });
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    if (type === "projects") setProjects((prev) => prev.filter((p) => p.id !== id));
    else if (type === "portfolio") setPortfolios((prev) => prev.filter((p) => p.id !== id));
    else if (type === "awards") setAwards((prev) => prev.filter((a) => a.id !== id));
    else setPublications((prev) => prev.filter((p) => p.id !== id));
    toast.success("Record deleted.");
    setDeleteConfirm(null);
  };

  const handleDuplicate = (p: ProjectRecord) => {
    const copy = { ...p, id: `p-${Date.now()}`, title: `${p.title} (Copy)`, isFeatured: false };
    setProjects((prev) => [...prev, copy]);
    toast.success("Project duplicated.");
  };

  const toggleFeatured = (type: EntryType, id: string) => {
    if (type === "projects") setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p)));
    else if (type === "portfolio") setPortfolios((prev) => prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p)));
    else if (type === "awards") setAwards((prev) => prev.map((a) => (a.id === id ? { ...a, isFeatured: !a.isFeatured } : a)));
    else setPublications((prev) => prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p)));
    toast.success("Featured status updated.");
  };

  // ─── Filtered + sorted projects ───
  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (filterCategory !== "all" && p.category !== filterCategory) return false;
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (showFeaturedOnly && !p.isFeatured) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.technologies.some((t) => t.toLowerCase().includes(q))) return false;
      return true;
    });
    if (sortBy === "recent") list = list.sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
    else list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [projects, search, filterCategory, filterStatus, sortBy, showFeaturedOnly]);

  const filteredPortfolios = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = portfolios.filter((p) => {
      if (filterCategory !== "all" && p.category !== filterCategory) return false;
      if (showFeaturedOnly && !p.isFeatured) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.skills.some((s) => s.toLowerCase().includes(q))) return false;
      return true;
    });
    if (sortBy === "recent") list = list.sort((a, b) => (b.completionDate || "").localeCompare(a.completionDate || ""));
    else list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [portfolios, search, filterCategory, showFeaturedOnly, sortBy]);

  const filteredAwards = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = awards.filter((a) => {
      if (filterCategory !== "all" && a.category !== filterCategory) return false;
      if (showFeaturedOnly && !a.isFeatured) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.issuingOrg.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortBy === "recent") list = list.sort((a, b) => (b.awardDate || "").localeCompare(a.awardDate || ""));
    else list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [awards, search, filterCategory, showFeaturedOnly, sortBy]);

  const filteredPubs = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = publications.filter((p) => {
      if (filterCategory !== "all" && p.type !== filterCategory) return false;
      if (showFeaturedOnly && !p.isFeatured) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.authorName.toLowerCase().includes(q) && !p.publisher.toLowerCase().includes(q) && !p.abstract.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortBy === "recent") list = list.sort((a, b) => (b.publicationDate || "").localeCompare(a.publicationDate || ""));
    else list = list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [publications, search, filterCategory, showFeaturedOnly, sortBy]);

  // Stats for header
  const counts = {
    projects: projects.length,
    portfolio: portfolios.length,
    awards: awards.length,
    publications: publications.length,
  };
  const featuredCount = projects.filter((p) => p.isFeatured).length + portfolios.filter((p) => p.isFeatured).length + awards.filter((a) => a.isFeatured).length + publications.filter((p) => p.isFeatured).length;

  // Category options based on active tab
  const categoryOptions = activeTab === "projects" ? PROJECT_CATEGORIES
    : activeTab === "portfolio" ? WORK_CATEGORIES
    : activeTab === "awards" ? AWARD_CATEGORIES
    : PUBLICATION_TYPES;

  const tabs: { id: EntryType; label: string; count: number }[] = [
    { id: "projects", label: "Projects", count: counts.projects },
    { id: "portfolio", label: "Portfolio", count: counts.portfolio },
    { id: "awards", label: "Awards", count: counts.awards },
    { id: "publications", label: "Publications", count: counts.publications },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-7 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <FolderGit2 className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-bold text-foreground dark:text-white">Projects, Portfolio & Achievements</h3>
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                {counts.projects} projects · {counts.portfolio} portfolio items · {counts.awards} awards · {counts.publications} publications · {featuredCount} featured
              </p>
            </div>
          </div>
          <Button type="button" onClick={showForm ? closeForm : openAdd} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
            {showForm ? <><X className="h-3.5 w-3.5" /> Cancel</> : <><Plus className="h-3.5 w-3.5" /> Add New</>}
          </Button>
        </div>
      </section>

      {/* Tabs */}
      <div className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-card/80 p-1 dark:border-white/10 dark:bg-slate-900/60">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setActiveTab(t.id); setSearch(""); setFilterCategory("all"); setFilterStatus("all"); setShowFeaturedOnly(false); }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              activeTab === t.id ? "bg-cyan-500 text-slate-950" : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"
            )}
          >
            {t.label} <span className={cn("rounded-full px-1.5 text-[10px]", activeTab === t.id ? "bg-slate-950/20" : "bg-muted dark:bg-white/10")}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Form (renders based on active tab) */}
      {showForm && activeTab === "projects" && (
        <ProjectForm initial={projectDraft} onSave={handleSaveProject} onCancel={closeForm} isEditing={!!editingId} />
      )}
      {showForm && activeTab === "portfolio" && (
        <PortfolioForm initial={portfolioDraft} onSave={handleSavePortfolio} onCancel={closeForm} isEditing={!!editingId} />
      )}
      {showForm && activeTab === "awards" && (
        <AwardForm initial={awardDraft} onSave={handleSaveAward} onCancel={closeForm} isEditing={!!editingId} />
      )}
      {showForm && activeTab === "publications" && (
        <PublicationForm initial={pubDraft} onSave={handleSavePub} onCancel={closeForm} isEditing={!!editingId} />
      )}

      {/* Filter & Search bar */}
      <section className="rounded-2xl border border-border bg-card/80 p-4 dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}…`}
              className="h-9 rounded-lg pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-9 rounded-lg sm:w-48"><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          {activeTab === "projects" && (
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 rounded-lg sm:w-40"><SelectValue placeholder="All status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="h-9 rounded-lg sm:w-40"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => setShowFeaturedOnly((v) => !v)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold cursor-pointer",
              showFeaturedOnly ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400" : "border-border text-muted-foreground hover:bg-muted dark:border-white/10 dark:hover:bg-white/5"
            )}
            title="Show featured only"
          >
            <Star className="h-3.5 w-3.5" /> Featured
          </button>
          {activeTab === "projects" && (
            <div className="inline-flex shrink-0 overflow-hidden rounded-lg border border-border dark:border-white/10">
              <button type="button" onClick={() => setView("grid")} className={cn("inline-flex h-9 w-9 items-center justify-center cursor-pointer", view === "grid" ? "bg-cyan-500 text-slate-950" : "text-muted-foreground hover:bg-muted dark:hover:bg-white/5")} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></button>
              <button type="button" onClick={() => setView("list")} className={cn("inline-flex h-9 w-9 items-center justify-center cursor-pointer", view === "list" ? "bg-cyan-500 text-slate-950" : "text-muted-foreground hover:bg-muted dark:hover:bg-white/5")} aria-label="List view"><List className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Projects list ─── */}
      {activeTab === "projects" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-bold text-foreground dark:text-white">Projects</h3>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground dark:bg-white/5 dark:text-slate-300">{filteredProjects.length} of {projects.length}</span>
          </div>
          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
              <Filter className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground dark:text-slate-400">No projects match your filters.</p>
            </div>
          ) : (
            <div className={cn(view === "grid" ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3" : "space-y-3")}>
              {filteredProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  view={view}
                  onEdit={() => { setProjectDraft({ ...p }); setEditingId(p.id); setShowForm(true); }}
                  onDelete={() => handleDeleteClick("projects", p.id, p.title)}
                  onDuplicate={() => handleDuplicate(p)}
                  onToggleFeatured={() => toggleFeatured("projects", p.id)}
                  onToggleExpand={() => {}}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ─── Portfolio list ─── */}
      {activeTab === "portfolio" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-bold text-foreground dark:text-white">Portfolio & Work Samples</h3>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground dark:bg-white/5 dark:text-slate-300">{filteredPortfolios.length} of {portfolios.length}</span>
          </div>
          {filteredPortfolios.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
              <Filter className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground dark:text-slate-400">No portfolio items match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredPortfolios.map((p) => (
                <PortfolioCard
                  key={p.id}
                  item={p}
                  onEdit={() => { setPortfolioDraft({ ...p }); setEditingId(p.id); setShowForm(true); }}
                  onDelete={() => handleDeleteClick("portfolio", p.id, p.title)}
                  onToggleFeatured={() => toggleFeatured("portfolio", p.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ─── Awards list ─── */}
      {activeTab === "awards" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-bold text-foreground dark:text-white">Awards & Achievements</h3>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground dark:bg-white/5 dark:text-slate-300">{filteredAwards.length} of {awards.length}</span>
          </div>
          {filteredAwards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
              <Filter className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground dark:text-slate-400">No awards match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredAwards.map((a) => (
                <AwardCard
                  key={a.id}
                  award={a}
                  onEdit={() => { setAwardDraft({ ...a }); setEditingId(a.id); setShowForm(true); }}
                  onDelete={() => handleDeleteClick("awards", a.id, a.title)}
                  onToggleFeatured={() => toggleFeatured("awards", a.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ─── Publications list ─── */}
      {activeTab === "publications" && (
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-bold text-foreground dark:text-white">Publications & Research</h3>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground dark:bg-white/5 dark:text-slate-300">{filteredPubs.length} of {publications.length}</span>
          </div>
          {filteredPubs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
              <Filter className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground dark:text-slate-400">No publications match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredPubs.map((p) => (
                <PublicationCard
                  key={p.id}
                  pub={p}
                  onEdit={() => { setPubDraft({ ...p }); setEditingId(p.id); setShowForm(true); }}
                  onDelete={() => handleDeleteClick("publications", p.id, p.title)}
                  onToggleFeatured={() => toggleFeatured("publications", p.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Delete confirmation dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400"><AlertTriangle className="h-5 w-5" /></span>
              <h3 className="text-sm font-bold text-foreground dark:text-white">Delete Record?</h3>
            </div>
            <p className="text-xs text-muted-foreground dark:text-slate-400">This action cannot be undone. &ldquo;{deleteConfirm.title}&rdquo; will be permanently removed.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="h-9 rounded-lg text-xs">Cancel</Button>
              <Button onClick={confirmDelete} className="h-9 rounded-lg bg-rose-500 text-xs font-bold text-white hover:bg-rose-600">Delete Record</Button>
            </div>
          </div>
        </div>
      )}

      {/* Next Step CTA */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card p-5 dark:via-slate-900/80 dark:to-slate-900">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-foreground dark:text-white">Upload your resume and documents for verification</p>
          <button type="button" onClick={() => onNavigate?.("resume-documents")} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-amber-400 cursor-pointer">
            Continue <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
