"use client";

import * as React from "react";
import {
  Sparkles, ChevronDown, ChevronUp, Filter, ArrowUpDown, CheckCircle2, AlertTriangle, XCircle,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState, Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface MatchBreakdown { skills: number; experience: number; location: number; salary: number; }
interface CandidateMatch {
  id: string;
  name: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  avatarColor: string;
  overallScore: number;
  breakdown: MatchBreakdown;
  missingSkills: string[];
  matchedSkills: string[];
  recommendation: "Fast-track" | "Submit" | "Hold" | "Reject";
}

interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  requiredSkills: string[];
  salaryBand: string;
}

const JOBS: JobOpening[] = [
  { id: "j1", title: "Senior Frontend Engineer", company: "TechCorp India", location: "Bengaluru", requiredSkills: ["React", "TypeScript", "GraphQL", "Next.js", "CSS"], salaryBand: "₹18–28 LPA" },
  { id: "j2", title: "DevOps Engineer", company: "FinEdge Solutions", location: "Pune", requiredSkills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Docker"], salaryBand: "₹15–24 LPA" },
  { id: "j3", title: "ML Engineer", company: "DataMinds AI", location: "Bengaluru", requiredSkills: ["Python", "TensorFlow", "PyTorch", "ML", "MLOps"], salaryBand: "₹22–35 LPA" },
];

const CANDIDATES: Record<string, CandidateMatch[]> = {
  j1: [
    { id: "c1", name: "Arjun Iyer", currentRole: "Senior Frontend Engineer", currentCompany: "TechCorp India", location: "Bengaluru", avatarColor: "oklch(0.55 0.13 165)", overallScore: 92, breakdown: { skills: 38, experience: 28, location: 14, salary: 12 }, missingSkills: ["Next.js"], matchedSkills: ["React", "TypeScript", "GraphQL", "CSS"], recommendation: "Fast-track" },
    { id: "c2", name: "Kavya Reddy", currentRole: "Full Stack Developer", currentCompany: "DataMinds AI", location: "Hyderabad", avatarColor: "oklch(0.6 0.12 200)", overallScore: 84, breakdown: { skills: 34, experience: 26, location: 10, salary: 14 }, missingSkills: ["Next.js", "GraphQL"], matchedSkills: ["React", "TypeScript", "CSS"], recommendation: "Submit" },
    { id: "c3", name: "Priya Nair", currentRole: "Frontend Engineer", currentCompany: "StartupX", location: "Kochi", avatarColor: "oklch(0.6 0.14 350)", overallScore: 78, breakdown: { skills: 32, experience: 22, location: 11, salary: 13 }, missingSkills: ["Next.js", "GraphQL"], matchedSkills: ["React", "TypeScript", "CSS"], recommendation: "Submit" },
    { id: "c4", name: "Sneha Kapoor", currentRole: "Frontend Developer", currentCompany: "Webify", location: "Remote", avatarColor: "oklch(0.6 0.13 30)", overallScore: 71, breakdown: { skills: 28, experience: 24, location: 9, salary: 10 }, missingSkills: ["Next.js", "GraphQL", "TypeScript"], matchedSkills: ["React", "CSS"], recommendation: "Hold" },
    { id: "c5", name: "Vikram Nair", currentRole: "UI Engineer", currentCompany: "DesignHub", location: "Bengaluru", avatarColor: "oklch(0.55 0.14 280)", overallScore: 68, breakdown: { skills: 26, experience: 20, location: 14, salary: 8 }, missingSkills: ["Next.js", "GraphQL", "TypeScript"], matchedSkills: ["React", "CSS"], recommendation: "Hold" },
    { id: "c6", name: "Aditya Sharma", currentRole: "Junior Frontend Dev", currentCompany: "StartupX", location: "Mumbai", avatarColor: "oklch(0.55 0.12 100)", overallScore: 64, breakdown: { skills: 24, experience: 16, location: 11, salary: 13 }, missingSkills: ["Next.js", "GraphQL"], matchedSkills: ["React", "TypeScript", "CSS"], recommendation: "Hold" },
    { id: "c7", name: "Neha Patel", currentRole: "Frontend Engineer", currentCompany: "TechCorp India", location: "Ahmedabad", avatarColor: "oklch(0.6 0.13 200)", overallScore: 58, breakdown: { skills: 20, experience: 18, location: 10, salary: 10 }, missingSkills: ["Next.js", "GraphQL", "TypeScript", "React"], matchedSkills: ["CSS"], recommendation: "Reject" },
    { id: "c8", name: "Rohan Mehta", currentRole: "Backend Engineer", currentCompany: "FinEdge", location: "Pune", avatarColor: "oklch(0.55 0.13 165)", overallScore: 52, breakdown: { skills: 14, experience: 22, location: 8, salary: 8 }, missingSkills: ["Next.js", "GraphQL", "React", "TypeScript", "CSS"], matchedSkills: [], recommendation: "Reject" },
    { id: "c9", name: "Meera Iyer", currentRole: "Full Stack Developer", currentCompany: "Cloudify", location: "Bengaluru", avatarColor: "oklch(0.6 0.14 350)", overallScore: 88, breakdown: { skills: 36, experience: 26, location: 14, salary: 12 }, missingSkills: ["Next.js"], matchedSkills: ["React", "TypeScript", "GraphQL", "CSS"], recommendation: "Fast-track" },
    { id: "c10", name: "Karthik Rao", currentRole: "Senior React Developer", currentCompany: "Webify", location: "Chennai", avatarColor: "oklch(0.55 0.13 280)", overallScore: 81, breakdown: { skills: 34, experience: 27, location: 10, salary: 10 }, missingSkills: ["Next.js", "GraphQL"], matchedSkills: ["React", "TypeScript", "CSS"], recommendation: "Submit" },
  ],
  j2: [],
  j3: [],
};

const RECO_TONES: Record<CandidateMatch["recommendation"], string> = {
  "Fast-track": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  "Submit": "bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/20",
  "Hold": "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  "Reject": "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

function scoreTone(score: number) {
  if (score >= 80) return { ring: "stroke-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500" };
  if (score >= 60) return { ring: "stroke-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500" };
  return { ring: "stroke-rose-500", text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500" };
}

function ScoreRing({ score }: { score: number }) {
  const t = scoreTone(score);
  const r = 18, circ = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex h-12 w-12 items-center justify-center">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" className="stroke-muted" strokeWidth="3.5" />
        <circle cx="22" cy="22" r={r} fill="none" className={t.ring} strokeWidth="3.5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (circ * score) / 100} />
      </svg>
      <span className={`absolute text-xs font-bold ${t.text}`}>{score}</span>
    </div>
  );
}

export function RecruiterAIMatchScoring() {
  const [jobId, setJobId] = React.useState(JOBS[0].id);
  const [rangeFilter, setRangeFilter] = React.useState("all");
  const [sortDesc, setSortDesc] = React.useState(true);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const job = JOBS.find((j) => j.id === jobId)!;
  const allCandidates = CANDIDATES[jobId] ?? [];

  const filtered = React.useMemo(() => {
    let list = [...allCandidates];
    if (rangeFilter === "high") list = list.filter((c) => c.overallScore >= 80);
    else if (rangeFilter === "mid") list = list.filter((c) => c.overallScore >= 60 && c.overallScore < 80);
    else if (rangeFilter === "low") list = list.filter((c) => c.overallScore < 60);
    list.sort((a, b) => sortDesc ? b.overallScore - a.overallScore : a.overallScore - b.overallScore);
    return list;
  }, [allCandidates, rangeFilter, sortDesc]);

  const high = allCandidates.filter((c) => c.overallScore >= 80).length;
  const mid = allCandidates.filter((c) => c.overallScore >= 60 && c.overallScore < 80).length;
  const low = allCandidates.filter((c) => c.overallScore < 60).length;
  const avg = allCandidates.length > 0 ? Math.round(allCandidates.reduce((s, c) => s + c.overallScore, 0) / allCandidates.length) : 0;

  function toggle(id: string) { setExpanded((p) => ({ ...p, [id]: !p[id] })); }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Match Scoring"
        description="AI-powered candidate-to-job matching with explainable scores across Skills, Experience, Location & Salary fit. Sort, filter, and drill into each score breakdown."
        icon={<Icon name="Sparkles" className="h-6 w-6" />}
        actions={[
          { label: "Re-run AI", icon: "Sparkles", variant: "outline", onClick: () => toast.success("AI scoring re-run", { description: `Refreshed scores for ${job.title}` }) },
          { label: "Export matches", icon: "Download", variant: "outline", onClick: () => toast.success("Export started", { description: "ai-matches.csv" }) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Strong matches (≥80)" value={high} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Possible (60–79)" value={mid} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Weak (<60)" value={low} icon={<XCircle className="h-5 w-5" />} tone="danger" />
        <StatCard label="Avg match score" value={avg} icon={<Sparkles className="h-5 w-5" />} tone="brand" />
      </div>

      <SectionCard
        title="Select a job to score candidates"
        description="AI scores update instantly when you switch roles"
        action={
          <Select value={jobId} onValueChange={setJobId}>
            <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {JOBS.map((j) => <SelectItem key={j.id} value={j.id}>{j.title} · {j.company}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-brand/30 bg-brand/5 text-brand">{job.requiredSkills.length} required skills</Badge>
          <Badge variant="outline" className="text-xs">{job.location}</Badge>
          <Badge variant="outline" className="text-xs">{job.salaryBand}</Badge>
          <span className="text-xs text-muted-foreground">Required: {job.requiredSkills.join(", ")}</span>
        </div>
      </SectionCard>

      <SectionCard
        title={`Matched candidates (${filtered.length})`}
        description="Sorted by match score. Click 'Explain score' to see breakdown."
        action={
          <div className="flex items-center gap-2">
            <Select value={rangeFilter} onValueChange={setRangeFilter}>
              <SelectTrigger className="h-8 w-[150px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All scores</SelectItem>
                <SelectItem value="high">High (≥80)</SelectItem>
                <SelectItem value="mid">Mid (60–79)</SelectItem>
                <SelectItem value="low">Low (&lt;60)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setSortDesc((s) => !s)}>
              <ArrowUpDown className="mr-1 h-3.5 w-3.5" /> {sortDesc ? "Desc" : "Asc"}
            </Button>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Sparkles className="h-5 w-5" />} title="No candidates in this range" description="Try a different filter or run AI matching on more candidates." />
        ) : (
          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filtered.map((c) => {
              const isOpen = !!expanded[c.id];
              return (
                <Card key={c.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <ScoreRing score={c.overallScore} />
                      <AvatarLogo name={c.name} color={c.avatarColor} className="h-10 w-10 hidden sm:flex" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold truncate">{c.name}</p>
                          <Badge variant="outline" className={`text-xs ${RECO_TONES[c.recommendation]}`}>{c.recommendation}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.currentRole} · {c.currentCompany} · {c.location}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {c.matchedSkills.map((s) => (
                            <Badge key={s} variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[10px]">✓ {s}</Badge>
                          ))}
                          {c.missingSkills.map((s) => (
                            <Badge key={s} variant="outline" className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 text-[10px]">✕ {s}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggle(c.id)} className="hidden sm:inline-flex">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        Explain score
                      </Button>
                    </div>
                    {isOpen && (
                      <div className="mt-4 grid gap-4 lg:grid-cols-2 border-t pt-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Score breakdown</p>
                          <div className="space-y-2.5">
                            {[
                              { label: "Skills (40%)", v: c.breakdown.skills, max: 40 },
                              { label: "Experience (30%)", v: c.breakdown.experience, max: 30 },
                              { label: "Location (15%)", v: c.breakdown.location, max: 15 },
                              { label: "Salary (15%)", v: c.breakdown.salary, max: 15 },
                            ].map((row) => (
                              <div key={row.label}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">{row.label}</span>
                                  <span className="font-medium">{row.v}/{row.max}</span>
                                </div>
                                <Progress value={(row.v / row.max) * 100} className="h-1.5 [&>div]:bg-brand" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Missing skills & recommendation</p>
                          {c.missingSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {c.missingSkills.map((s) => <Badge key={s} variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-xs">{s}</Badge>)}
                            </div>
                          ) : <p className="text-xs text-emerald-600 mb-3">All required skills matched ✓</p>}
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">Recommended action:</span> {c.recommendation === "Fast-track" ? "Send directly to final round — strong skill and salary fit." : c.recommendation === "Submit" ? "Submit to client; verify missing skills in screening call." : c.recommendation === "Hold" ? "Keep warm; gaps can be closed with upskilling or junior role." : "Do not submit — too many missing skills for this role."}
                          </p>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" onClick={() => toast.success("Added to submission", { description: c.name })}>Submit</Button>
                            <Button size="sm" variant="outline" onClick={() => toast.success("Moved to hold list", { description: c.name })}>Hold</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
