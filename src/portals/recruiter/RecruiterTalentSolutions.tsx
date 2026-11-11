"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  StatCard,
  StatusBadge,
  EmptyState,
  MatchScore,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Users,
  Search,
  Send,
  GraduationCap,
  Award,
  BadgeCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Star,
} from "lucide-react";
import {
  talentSolutionPrograms,
  SOLUTION_TYPE_CONFIG,
} from "@/lib/talent-solutions-data";
import type { TalentSolutionProgram } from "@/lib/talent-solutions-types";
import { jobs } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { useNav } from "@/lib/store";

// ============================================================
// T2H-trained candidate pool (synthesized from real T2H programs)
// ============================================================
interface T2HCandidate {
  id: string;
  name: string;
  programId: string;
  programName: string;
  client: string;
  skills: string[];
  certifications: string[];
  placementStatus: "available" | "in_review" | "submitted" | "placed";
  matchScore: number;
  experienceYears: number;
  rating: number;
  completedAt: string;
}

const CANDIDATE_NAMES = [
  "Aarav Sharma", "Divya Lakshmi", "Karthik Reddy", "Meera Iyer",
  "Rahul Nair", "Sanjay Gupta", "Priya Menon", "Anika Verma",
  "Vikram Patel", "Sneha Reddy", "Arjun Kumar", "Kavya Krishnan",
];

const SKILL_POOLS: Record<string, string[]> = {
  tsp_001: ["React 19", "Node.js", "PostgreSQL", "System Design", "TypeScript"],
  tsp_002: ["Linux", "Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"],
  tsp_003: ["Python", "ML", "MLOps", "TensorFlow", "Data Modeling"],
  tsp_004: ["Network Security", "SIEM", "Incident Response", "DPDP Compliance"],
  tsp_005: ["Go Fundamentals", "gRPC", "Microservices", "Kubernetes", "PostgreSQL"],
  tsp_006: ["React 19", "TypeScript", "Next.js", "Tailwind CSS", "Redux Toolkit"],
  tsp_007: ["AWS Cloud", "Terraform", "Cloud Architecture", "Docker", "CI/CD"],
  tsp_008: ["Financial Modeling", "AI Risk Analysis", "FinTech Compliance", "Python"],
};

function generateCandidates(programType: "TRAIN_TO_HIRE" | "HIRE_TO_TRAIN"): T2HCandidate[] {
  return talentSolutionPrograms
    .filter((p) => p.type === programType)
    .flatMap((p) => {
      const count = p.trained || p.hiredCandidates || 4;
      const placed = p.placed || 0;
      const available = Math.max(0, count - placed);
      const take = Math.min(Math.max(available, 2), 4);
      return Array.from({ length: take }).map((_, i) => {
        const nameIdx = (p.id.charCodeAt(4) + i * 2) % CANDIDATE_NAMES.length;
        const name = CANDIDATE_NAMES[nameIdx];
        const status: T2HCandidate["placementStatus"] =
          i === 0 ? "available" : i === 1 ? "in_review" : i === 2 ? "submitted" : "available";
        return {
          id: `tc_${p.id}_${i}`,
          name,
          programId: p.id,
          programName: p.name,
          client: p.clientName,
          skills: SKILL_POOLS[p.id] ?? p.programCurriculum,
          certifications: p.certifications,
          placementStatus: status,
          matchScore: 78 + ((i * 7) % 20),
          experienceYears: 1 + (i % 3),
          rating: 3.8 + ((i % 5) * 0.2),
          completedAt: p.endDate,
        } as T2HCandidate;
      });
    });
}

const STATUS_LABELS: Record<T2HCandidate["placementStatus"], string> = {
  available: "Available",
  in_review: "In review",
  submitted: "Submitted",
  placed: "Placed",
};

export function RecruiterTalentSolutions({ mode = "t2h" }: { mode?: "t2h" | "h2t" }) {
  const { navigate } = useNav();
  const [search, setSearch] = React.useState("");
  const [programFilter, setProgramFilter] = React.useState<string>("all");
  const [skillFilter, setSkillFilter] = React.useState<string[]>([]);
  const [submitFor, setSubmitFor] = React.useState<T2HCandidate | null>(null);
  const [selectedJob, setSelectedJob] = React.useState<string>("");
  const [detail, setDetail] = React.useState<T2HCandidate | null>(null);

  const isH2T = mode === "h2t";
  const targetType = isH2T ? "HIRE_TO_TRAIN" : "TRAIN_TO_HIRE";

  // Candidates for selected mode
  const candidates = React.useMemo(() => generateCandidates(targetType), [targetType]);

  // Programs for selected mode
  const activePrograms = React.useMemo(() => {
    return talentSolutionPrograms.filter((p) => p.type === targetType);
  }, [targetType]);

  // All skill options from programs
  const allSkills = React.useMemo(() => {
    return Array.from(new Set(activePrograms.flatMap((p) => p.programCurriculum)));
  }, [activePrograms]);

  const filtered = React.useMemo(() => {
    return candidates.filter((c) => {
      if (programFilter !== "all" && c.programId !== programFilter) return false;
      if (skillFilter.length > 0 && !skillFilter.every((s) => c.skills.includes(s))) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.programName.toLowerCase().includes(q) &&
          !c.client.toLowerCase().includes(q) &&
          !c.skills.some((s) => s.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [candidates, search, programFilter, skillFilter]);

  // KPIs
  const availableCount = candidates.filter((c) => c.placementStatus === "available").length;
  const placedCount = candidates.filter((c) => c.placementStatus === "placed").length;
  const submittedCount = candidates.filter((c) => c.placementStatus === "submitted").length;
  const avgTimeToPlace = isH2T ? 14 : 18; // days

  // Recruiter's job orders (for submit dialog)
  const recruiterJobs = jobs.slice(0, 6);

  const toggleSkill = (s: string) => {
    setSkillFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleSubmit = () => {
    if (!submitFor) return;
    if (!selectedJob) {
      toast.error("Please select a job order");
      return;
    }
    const job = jobs.find((j) => j.id === selectedJob);
    toast.success("Candidate submitted to mandate", {
      description: `${submitFor.name} submitted to "${job?.title ?? selectedJob}" at ${job?.employerName ?? "client"}.`,
    });
    setSubmitFor(null);
    setSelectedJob("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isH2T ? "Talent & Sourcing — H2T Candidate" : "Talent & Sourcing — T2H Candidate"}
        description={
          isH2T
            ? "Pre-hired and upskilled candidates from client-sponsored Hire-to-Train programs — tailored to custom stack requirements."
            : "Trained and certified candidates from specialized Train-to-Hire bootcamps — ready for placement with your clients. Filter by program, skills, and placement status."
        }
        breadcrumbs={[
          { label: "Recruiter", onClick: () => navigate("recruiter", "overview") },
          { label: "Talent & Sourcing", onClick: () => navigate("recruiter", "sourcing-grp") },
          { label: isH2T ? "H2T Candidate" : "T2H Candidate" },
        ]}
        actions={[
          {
            label: isH2T ? "T2H Candidate" : "H2T Candidate",
            variant: "outline",
            onClick: () => navigate("recruiter", isH2T ? "t2h" : "h2t"),
          },
          {
            label: "Candidate Pool",
            variant: "outline",
            onClick: () => navigate("recruiter", "candidates"),
          },
          {
            label: "Talent & Sourcing Hub",
            variant: "outline",
            onClick: () => navigate("recruiter", "sourcing-grp"),
          },
        ]}
        icon={<Users className="h-6 w-6" />}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Available Candidates" value={availableCount} icon={<Users className="h-5 w-5" />} tone="brand" hint="Ready for submission" />
        <StatCard label="Submitted" value={submittedCount} icon={<Send className="h-5 w-5" />} tone="brand" />
        <StatCard label="Placed (YTD)" value={placedCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Time-to-Place" value={`${avgTimeToPlace} days`} icon={<Clock className="h-5 w-5" />} tone="brand" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by candidate, program, client, or skill…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-full lg:w-64"><SelectValue placeholder="All programs" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All programs</SelectItem>
              {activePrograms.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground">Skills (must have all selected)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {allSkills.slice(0, 12).map((s) => (
              <label key={s} className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs cursor-pointer hover:bg-muted/40">
                <Checkbox checked={skillFilter.includes(s)} onCheckedChange={() => toggleSkill(s)} />
                {s}
              </label>
            ))}
            {skillFilter.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSkillFilter([])}>Clear</Button>
            )}
          </div>
        </div>
      </Card>

      {/* Candidates table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="No matching candidates"
          description={`Adjust filters to find ${isH2T ? "H2T" : "T2H"}-trained candidates for your mandates.`}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Program</TableHead>
                <TableHead className="hidden md:table-cell">Client</TableHead>
                <TableHead className="hidden lg:table-cell">Skills</TableHead>
                <TableHead className="hidden md:table-cell">Certifications</TableHead>
                <TableHead className="text-center">Match</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(c)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={c.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.experienceYears} yrs exp · ★ {c.rating.toFixed(1)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{c.programName}</p>
                    <p className="text-xs text-muted-foreground">Completed {formatDate(c.completedAt)}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{c.client}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {c.skills.slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                      {c.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{c.skills.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BadgeCheck className="h-3.5 w-3.5 text-brand" />
                      {c.certifications.length} cert{c.certifications.length > 1 ? "s" : ""}
                    </div>
                  </TableCell>
                  <TableCell className="text-center"><MatchScore score={c.matchScore} /></TableCell>
                  <TableCell>
                    <StatusBadge status={
                      c.placementStatus === "available" ? "available" :
                      c.placementStatus === "in_review" ? "waiting" :
                      c.placementStatus === "submitted" ? "sent" :
                      "completed"
                    } />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={c.placementStatus === "available" ? "default" : "outline"}
                      disabled={c.placementStatus !== "available"}
                      onClick={(e) => { e.stopPropagation(); setSubmitFor(c); }}
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Submit to mandate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Talent pool snapshot */}
      <SectionCard title={isH2T ? "H2T talent pool summary" : "T2H talent pool summary"} description="Quick overview of available trained talent by program">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activePrograms.map((p) => {
            const inProgram = candidates.filter((c) => c.programId === p.id);
            const available = inProgram.filter((c) => c.placementStatus === "available").length;
            return (
              <Card key={p.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.clientName}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{SOLUTION_TYPE_CONFIG[p.type].shortLabel}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-md border p-2">
                    <p className="font-semibold text-foreground">{p.trained}</p>
                    <p className="text-muted-foreground">Trained</p>
                  </div>
                  <div className="rounded-md border p-2">
                    <p className="font-semibold text-emerald-600">{available}</p>
                    <p className="text-muted-foreground">Available</p>
                  </div>
                  <div className="rounded-md border p-2">
                    <p className="font-semibold text-foreground">{p.placed}</p>
                    <p className="text-muted-foreground">Placed</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      {/* Submit dialog */}
      <Dialog open={!!submitFor} onOpenChange={(o) => !o && setSubmitFor(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit candidate to mandate</DialogTitle>
            <DialogDescription>
              {submitFor && (
                <span>Select the job order to submit <span className="font-semibold text-foreground">{submitFor.name}</span> to.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="job-select">Job order</Label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger id="job-select"><SelectValue placeholder="Select a job order" /></SelectTrigger>
                <SelectContent>
                  {recruiterJobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>{j.title} — {j.employerName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {submitFor && (
              <div className="rounded-lg border bg-muted/40 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <AvatarLogo text={submitFor.name} size="xs" />
                  <div>
                    <p className="font-medium">{submitFor.name}</p>
                    <p className="text-muted-foreground">{submitFor.programName}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {submitFor.skills.slice(0, 4).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitFor(null)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              <Send className="mr-1 h-4 w-4" />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Candidate detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <AvatarLogo text={detail.name} size="md" />
                  <div>
                    <SheetTitle className="text-left">{detail.name}</SheetTitle>
                    <SheetDescription className="text-left">{detail.programName}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md border p-2">
                    <MatchScore score={detail.matchScore} className="mx-auto" />
                    <p className="mt-1 text-xs text-muted-foreground">Match</p>
                  </div>
                  <div className="rounded-md border p-2">
                    <p className="mt-1 text-sm font-semibold">{detail.experienceYears} yrs</p>
                    <p className="text-xs text-muted-foreground">Experience</p>
                  </div>
                  <div className="rounded-md border p-2">
                    <p className="mt-1 text-sm font-semibold">★ {detail.rating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                <SectionCard title="Verified skills">
                  <div className="flex flex-wrap gap-1.5">
                    {detail.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        <BadgeCheck className="mr-1 h-3 w-3 text-brand" />
                        {s}
                      </Badge>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Certifications">
                  <div className="space-y-2">
                    {detail.certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-2 rounded-md border p-2">
                        <Award className="h-4 w-4 text-brand" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Program details">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Client</span><span className="font-medium">{detail.client}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Completed</span><span className="font-medium">{formatDate(detail.completedAt)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Placement status</span><span className="font-medium">{STATUS_LABELS[detail.placementStatus]}</span></div>
                  </div>
                </SectionCard>

                {detail.placementStatus === "available" && (
                  <Button
                    className="w-full"
                    onClick={() => { setSubmitFor(detail); setDetail(null); }}
                  >
                    <Send className="mr-1 h-4 w-4" />
                    Submit to mandate
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
