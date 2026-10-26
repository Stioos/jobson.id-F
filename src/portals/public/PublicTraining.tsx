"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { trainingCourses, certifications, projectOpportunities } from "@/lib/mock-data";
import type { TrainingCourse, ProjectOpportunity } from "@/lib/types";
import { formatCurrency, formatNumber, timeAgo } from "@/lib/format";
import { Card, CardContent, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Star, Clock, Users, Award, GraduationCap, Search, Sparkles,
  ArrowRight, Briefcase, MapPin, CheckCircle2, Wallet,
} from "lucide-react";
import { toast } from "sonner";

const categories = Array.from(new Set(trainingCourses.map((c) => c.category))).sort();
const levels = ["beginner", "intermediate", "advanced"] as const;

export function PublicTraining() {
  const { navigate } = useNav();
  const [keyword, setKeyword] = React.useState("");
  const [category, setCategory] = React.useState("any");
  const [level, setLevel] = React.useState<string>("any");
  const [enrolled, setEnrolled] = React.useState<Set<string>>(new Set());

  const filteredCourses = React.useMemo(() => {
    return trainingCourses.filter((c) => {
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.skills.some((s) => s.toLowerCase().includes(q)) && !c.provider.toLowerCase().includes(q)) return false;
      }
      if (category !== "any" && c.category !== category) return false;
      if (level !== "any" && c.level !== level) return false;
      return true;
    });
  }, [keyword, category, level]);

  const handleEnroll = (course: TrainingCourse) => {
    setEnrolled((prev) => {
      const next = new Set(prev);
      if (next.has(course.id)) {
        next.delete(course.id);
        toast(`Unenrolled from ${course.title}`);
      } else {
        next.add(course.id);
        toast.success(`Enrolled in ${course.title}`, {
          description: "Find it in your candidate dashboard → Learning.",
          action: { label: "Open", onClick: () => navigate("candidate", "training") },
        });
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5 text-brand" /> Upskill marketplace
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Training &amp; courses</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Curated courses, certifications, and freelance opportunities to keep your career moving.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_200px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search courses, skills, providers" className="pl-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All levels</SelectItem>
              {levels.map((l) => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Courses grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" />}
          title="No courses match your filters"
          description="Try a broader keyword or different category."
          action={<Button variant="outline" size="sm" onClick={() => { setKeyword(""); setCategory("any"); setLevel("any"); }}>Reset filters</Button>}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredCourses.length}</span> courses available
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                enrolled={enrolled.has(c.id)}
                onEnroll={() => handleEnroll(c)}
              />
            ))}
          </div>
        </>
      )}

      {/* Certifications */}
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Industry certifications</h2>
            <p className="mt-1 text-sm text-muted-foreground">Recognized credentials to validate your skills.</p>
          </div>
          <Badge variant="secondary"><Award className="mr-1 h-3 w-3" /> {certifications.length} certifications</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <Card key={cert.id} className="group p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold leading-tight">{cert.name}</h3>
                  <div className="mt-1 text-xs text-muted-foreground">Issued by {cert.issuer}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="outline">{cert.category}</Badge>
                    <Badge variant="outline" className="capitalize">{cert.skillLevel}</Badge>
                    {cert.validityMonths && <Badge variant="secondary">Valid {cert.validityMonths}mo</Badge>}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => toast(`Learn more about ${cert.name}`, { description: "External provider page (simulated)." })}>
                Prepare for this cert <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Freelance & Project Marketplace */}
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-brand">
              <Briefcase className="h-3.5 w-3.5" /> Freelance &amp; Project Marketplace
            </div>
            <h2 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">Project opportunities</h2>
            <p className="mt-1 text-sm text-muted-foreground">Short-term, contract, and commission-based work.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {projectOpportunities.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12">
        <Card className="overflow-hidden border-brand/30 bg-gradient-to-br from-brand/10 via-background to-background p-6 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to invest in your skills?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get personalized course recommendations based on your target roles.</p>
            </div>
            <Button onClick={() => navigate("candidate", "overview")} className="gap-1.5">
              <Sparkles className="h-4 w-4" /> Get recommendations
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

function CourseCard({ course, enrolled, onEnroll }: { course: TrainingCourse; enrolled: boolean; onEnroll: () => void }) {
  return (
    <Card className="group flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <GraduationCap className="h-5 w-5" />
        </div>
        {course.certified && (
          <Badge variant="secondary" className="gap-1">
            <Award className="h-3 w-3" /> Certified
          </Badge>
        )}
      </div>
      <h3 className="mt-3 font-semibold leading-tight group-hover:text-brand">{course.title}</h3>
      <div className="mt-1 text-xs text-muted-foreground">by {course.provider}</div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="outline" className="capitalize">{course.level}</Badge>
        <Badge variant="outline">{course.category}</Badge>
        {course.skills.slice(0, 2).map((s) => (
          <Badge key={s} variant="outline" className="bg-muted/40">{s}</Badge>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{course.rating}</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.durationHours}h</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{formatNumber(course.enrolledCount)} enrolled</span>
      </div>

      <div className="mt-auto pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-brand">{formatCurrency(course.price, course.currency)}</span>
          <span className="text-xs text-muted-foreground">one-time</span>
        </div>
        <Button
          size="sm"
          className="w-full"
          variant={enrolled ? "secondary" : "default"}
          onClick={onEnroll}
        >
          {enrolled ? (
            <><CheckCircle2 className="mr-1 h-4 w-4" /> Enrolled</>
          ) : (
            <>Enroll now <ArrowRight className="ml-1 h-3.5 w-3.5" /></>
          )}
        </Button>
      </div>
    </Card>
  );
}

function ProjectCard({ project }: { project: ProjectOpportunity }) {
  return (
    <Card className="flex h-full flex-col p-5 transition-all hover:border-brand hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary" className="capitalize">{project.type}</Badge>
        <span className="text-xs text-muted-foreground">{timeAgo(project.postedAt)}</span>
      </div>
      <h3 className="mt-3 font-semibold leading-tight">{project.title}</h3>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Briefcase className="h-3.5 w-3.5" /> Client: {project.client}
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.skills.map((s) => (
          <Badge key={s} variant="outline" className="bg-muted/40">{s}</Badge>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3 text-sm">
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Wallet className="h-3 w-3" /> Budget
          </div>
          <div className="font-semibold text-brand">
            {project.budget > 0 ? formatCurrency(project.budget, project.currency) : "Commission"}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> Duration
          </div>
          <div className="font-semibold">{project.duration}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          {project.remote ? <MapPin className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
          {project.remote ? "Remote" : "On-site"}
        </span>
        <span>{project.proposalsCount} proposals</span>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="mt-4 w-full"
        onClick={() => toast.success("Proposal submitted (simulated)", { description: `Your proposal for "${project.title}" has been sent.` })}
      >
        Submit proposal <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </Button>
    </Card>
  );
}
