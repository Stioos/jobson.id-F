"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { jobs, employers } from "@/lib/mock-data";
import type { Job, WorkArrangement, EmploymentType } from "@/lib/types";
import { formatCurrency, formatNumber, timeAgo } from "@/lib/format";
import { Card, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Search, MapPin, Briefcase, Clock, Bookmark, BookmarkCheck,
  SlidersHorizontal, X, Users, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const workArrangements: WorkArrangement[] = ["remote", "hybrid", "onsite"];
const employmentTypes: EmploymentType[] = ["full-time", "part-time", "contract", "internship", "temporary", "freelance"];
const categories = Array.from(new Set(jobs.map((j) => j.category)));
const industries = Array.from(new Set(jobs.map((j) => j.industry)));

type SortKey = "relevance" | "recent" | "salary_high";

interface FilterState {
  keyword: string;
  location: string;
  workArrangements: WorkArrangement[];
  employmentTypes: EmploymentType[];
  experienceMin: number;
  salaryMin: number;
  category: string; // "any" or value
  postedWithinDays: number | 0;
  sort: SortKey;
}

const initialFilters: FilterState = {
  keyword: "",
  location: "",
  workArrangements: [],
  employmentTypes: [],
  experienceMin: 0,
  salaryMin: 0,
  category: "any",
  postedWithinDays: 0,
  sort: "relevance",
};

export function PublicJobs() {
  const { navigate } = useNav();
  const [filters, setFilters] = React.useState<FilterState>(initialFilters);
  const [visibleCount, setVisibleCount] = React.useState(6);
  const [savedJobs, setSavedJobs] = React.useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from sessionStorage (set by home page search or header dropdown filters)
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem("jobsonn_job_search");
      if (raw) {
        const data = JSON.parse(raw) as Partial<FilterState> & {
          keyword?: string;
          location?: string;
          category?: string;
          experienceMin?: number;
          salaryMin?: number;
          postedWithinDays?: number;
          workArrangements?: WorkArrangement[];
          employmentTypes?: EmploymentType[];
        };
        setFilters((f) => ({
          ...f,
          keyword: data.keyword ?? f.keyword,
          location: data.location ?? f.location,
          category: data.category ?? f.category,
          experienceMin: data.experienceMin ?? f.experienceMin,
          salaryMin: data.salaryMin ?? f.salaryMin,
          postedWithinDays: data.postedWithinDays ?? f.postedWithinDays,
          workArrangements: data.workArrangements ?? f.workArrangements,
          employmentTypes: data.employmentTypes ?? f.employmentTypes,
        }));
        sessionStorage.removeItem("jobsonn_job_search");
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const filtered = React.useMemo(() => {
    let result = jobs.filter((j) => j.status === "published");
    if (filters.keyword.trim()) {
      const q = filters.keyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.employerName.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (filters.location.trim()) {
      const l = filters.location.toLowerCase();
      result = result.filter((j) => j.location.toLowerCase().includes(l));
    }
    if (filters.workArrangements.length > 0) {
      result = result.filter((j) => filters.workArrangements.includes(j.workArrangement));
    }
    if (filters.employmentTypes.length > 0) {
      result = result.filter((j) => filters.employmentTypes.includes(j.employmentType));
    }
    if (filters.experienceMin > 0) {
      result = result.filter((j) => j.experienceMax >= filters.experienceMin);
    }
    if (filters.salaryMin > 0) {
      result = result.filter((j) => j.salaryMax >= filters.salaryMin);
    }
    if (filters.category !== "any") {
      result = result.filter((j) => j.category === filters.category);
    }
    if (filters.postedWithinDays > 0) {
      const cutoff = Date.now() - filters.postedWithinDays * 86400000;
      result = result.filter((j) => new Date(j.postedAt).getTime() >= cutoff);
    }
    if (filters.sort === "recent") {
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (filters.sort === "salary_high") {
      result.sort((a, b) => b.salaryMax - a.salaryMax);
    } else {
      // relevance: featured first, then by viewCount
      result.sort((a, b) => Number(b.featured) - Number(a.featured) || b.viewCount - a.viewCount);
    }
    return result;
  }, [filters]);

  const visibleJobs = filtered.slice(0, visibleCount);
  const activeFilterCount =
    (filters.keyword ? 1 : 0) +
    (filters.location ? 1 : 0) +
    filters.workArrangements.length +
    filters.employmentTypes.length +
    (filters.experienceMin > 0 ? 1 : 0) +
    (filters.salaryMin > 0 ? 1 : 0) +
    (filters.category !== "any" ? 1 : 0) +
    (filters.postedWithinDays > 0 ? 1 : 0);

  const toggleSaved = (jobId: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        toast("Removed from saved jobs");
      } else {
        next.add(jobId);
        toast.success("Saved! View in your candidate dashboard", {
          action: { label: "Open", onClick: () => navigate("candidate", "saved-jobs") },
        });
      }
      return next;
    });
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setVisibleCount(6);
  };

  const toggleWorkArrangement = (w: WorkArrangement) => {
    setFilters((f) => ({
      ...f,
      workArrangements: f.workArrangements.includes(w)
        ? f.workArrangements.filter((x) => x !== w)
        : [...f.workArrangements, w],
    }));
    setVisibleCount(6);
  };

  const toggleEmploymentType = (t: EmploymentType) => {
    setFilters((f) => ({
      ...f,
      employmentTypes: f.employmentTypes.includes(t)
        ? f.employmentTypes.filter((x) => x !== t)
        : [...f.employmentTypes, t],
    }));
    setVisibleCount(6);
  };

  const FiltersPanel = (
    <div className="space-y-5">
      <div>
        <Label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Keyword</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.keyword}
            onChange={(e) => { setFilters((f) => ({ ...f, keyword: e.target.value })); setVisibleCount(6); }}
            placeholder="Job title, skill"
            className="pl-9"
          />
        </div>
      </div>
      <div>
        <Label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Location</Label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.location}
            onChange={(e) => { setFilters((f) => ({ ...f, location: e.target.value })); setVisibleCount(6); }}
            placeholder="City or region"
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Work arrangement</Label>
        <div className="space-y-2">
          {workArrangements.map((w) => (
            <label key={w} className="flex cursor-pointer items-center gap-2 text-sm capitalize">
              <Checkbox
                checked={filters.workArrangements.includes(w)}
                onCheckedChange={() => toggleWorkArrangement(w)}
              />
              {w}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Employment type</Label>
        <div className="space-y-2">
          {employmentTypes.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2 text-sm capitalize">
              <Checkbox
                checked={filters.employmentTypes.includes(t)}
                onCheckedChange={() => toggleEmploymentType(t)}
              />
              {t.replace("-", " ")}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Min experience: <span className="text-brand">{filters.experienceMin} yrs</span>
        </Label>
        <Slider
          value={[filters.experienceMin]}
          min={0}
          max={15}
          step={1}
          onValueChange={(v) => { setFilters((f) => ({ ...f, experienceMin: v[0] })); setVisibleCount(6); }}
        />
      </div>

      <div>
        <Label className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Min salary: <span className="text-brand">{formatCurrency(filters.salaryMin, "INR")}</span>
        </Label>
        <Slider
          value={[filters.salaryMin]}
          min={0}
          max={5000000}
          step={100000}
          onValueChange={(v) => { setFilters((f) => ({ ...f, salaryMin: v[0] })); setVisibleCount(6); }}
        />
      </div>

      <div>
        <Label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</Label>
        <Select
          value={filters.category}
          onValueChange={(v) => { setFilters((f) => ({ ...f, category: v })); setVisibleCount(6); }}
        >
          <SelectTrigger><SelectValue placeholder="Any category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any category</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Posted within</Label>
        <Select
          value={String(filters.postedWithinDays)}
          onValueChange={(v) => { setFilters((f) => ({ ...f, postedWithinDays: Number(v) })); setVisibleCount(6); }}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any time</SelectItem>
            <SelectItem value="1">Last 24 hours</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" size="sm" className="w-full" onClick={resetFilters}>
          <X className="mr-1 h-4 w-4" /> Clear all filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Find your next opportunity</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse {formatNumber(jobs.length)} active openings across India&apos;s leading employers.
        </p>
      </div>

      {/* Mobile filter trigger */}
      <div className="mb-4 flex items-center gap-2 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 h-5 px-1.5 text-[10px]">{activeFilterCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">{FiltersPanel}</div>
          </SheetContent>
        </Sheet>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.keyword}
            onChange={(e) => { setFilters((f) => ({ ...f, keyword: e.target.value })); setVisibleCount(6); }}
            placeholder="Search jobs"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <Card className="sticky top-20 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Filters</h2>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-[10px]">{activeFilterCount} active</Badge>
              )}
            </div>
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-1 scroll-thin">
              {FiltersPanel}
            </div>
          </Card>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {hydrated && (
                <><span className="font-semibold text-foreground">{filtered.length}</span> jobs found{filters.keyword && <> for &ldquo;{filters.keyword}&rdquo;</>}</>
              )}
            </p>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Sort by</Label>
              <Select value={filters.sort} onValueChange={(v) => setFilters((f) => ({ ...f, sort: v as SortKey }))}>
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="recent">Most recent</SelectItem>
                  <SelectItem value="salary_high">Highest salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {visibleJobs.length === 0 ? (
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title="No jobs match your filters"
              description="Try widening your search — clear filters or use a broader keyword."
              action={<Button variant="outline" size="sm" onClick={resetFilters}>Clear filters</Button>}
            />
          ) : (
            <div className="space-y-4">
              {visibleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedJobs.has(job.id)}
                  onToggleSave={() => toggleSaved(job.id)}
                />
              ))}
              {visibleCount < filtered.length && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={() => setVisibleCount((c) => c + 6)}>
                    Load more ({filtered.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, saved, onToggleSave }: { job: Job; saved: boolean; onToggleSave: () => void }) {
  const { navigate } = useNav();
  const employer = employers.find((e) => e.id === job.employerId);
  return (
    <Card className="group p-4 transition-all hover:border-brand hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("public", `jobs/${job.id}`)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate("public", `jobs/${job.id}`); } }}
          className="flex flex-1 cursor-pointer items-start gap-3 text-left"
        >
          <AvatarLogo text={job.employerName} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold leading-tight group-hover:text-brand">{job.title}</h3>
              {job.featured && <Badge className="bg-brand/10 text-brand">Featured</Badge>}
              {job.urgent && <Badge variant="destructive" className="bg-rose-500/10 text-rose-600">Urgent</Badge>}
              {job.sponsored && <Badge variant="secondary" className="text-[10px]">Sponsored</Badge>}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); if (employer) navigate("public", `companies/${employer.slug}`); }}
              className="mt-0.5 text-sm text-muted-foreground hover:text-brand hover:underline"
            >
              {job.employerName}
            </button>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
              <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.experienceMin}-{job.experienceMax} yrs</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(job.postedAt)}</span>
              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(job.applicationCount)} applied</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="secondary" className="capitalize">{job.workArrangement}</Badge>
              <Badge variant="outline" className="capitalize">{job.employmentType.replace("-", " ")}</Badge>
              {job.skills.slice(0, 4).map((s) => (
                <Badge key={s} variant="outline" className="bg-muted/50">{s}</Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="outline" className="bg-muted/50">+{job.skills.length - 4}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-44">
          <div className="text-right">
            <div className="text-sm font-bold text-brand">
              {job.showSalary ? formatCurrency(job.salaryMin, job.currency) : "—"}
            </div>
            {job.showSalary && (
              <div className="text-xs text-muted-foreground">to {formatCurrency(job.salaryMax, job.currency)}</div>
            )}
          </div>
          <Button size="sm" onClick={() => navigate("public", `jobs/${job.id}`)}>
            View &amp; Apply <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={onToggleSave} className="gap-1.5">
            {saved ? <BookmarkCheck className="h-3.5 w-3.5 text-brand" /> : <Bookmark className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
