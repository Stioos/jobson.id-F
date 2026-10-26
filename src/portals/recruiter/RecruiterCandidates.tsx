"use client";

import * as React from "react";
import {
  Search, Sparkles, MapPin, Briefcase, Mail, Send, AlertCircle, Wand2, Loader2, ShieldCheck,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, MatchScore, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { candidateProfiles } from "@/lib/mock-data";
import { requisitions, submissions } from "@/lib/portal-data";
import type { CandidateProfile } from "@/lib/types";

interface AISourcedCandidate {
  id: string;
  name: string;
  headline: string;
  location: string;
  experienceYears: number;
  skills: string[];
  matchScore: number;
  simulated: true;
}

const SAMPLE_AI_QUERIES = [
  "Senior React engineers in Bengaluru open to hybrid, 5+ years",
  "Backend engineers with Go and Kubernetes, open to remote",
  "Product managers with payments/fintech experience, Mumbai",
  "DevOps with AWS and Terraform, 3+ years, India",
];

export function RecruiterCandidates() {
  const [search, setSearch] = React.useState("");
  const [skillFilter, setSkillFilter] = React.useState("all");
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [experienceFilter, setExperienceFilter] = React.useState("all");
  const [submitCandidate, setSubmitCandidate] = React.useState<CandidateProfile | null>(null);
  const [withdrawCandidate, setWithdrawCandidate] = React.useState<CandidateProfile | null>(null);

  // AI sourcing
  const [aiQuery, setAiQuery] = React.useState("");
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiResults, setAiResults] = React.useState<AISourcedCandidate[] | null>(null);

  const allSkills = Array.from(new Set(candidateProfiles.flatMap((c) => c.skills.map((s) => s.skill)))).sort();
  const allLocations = Array.from(new Set(candidateProfiles.map((c) => c.location)));

  const filtered = candidateProfiles.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      const matches =
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.skills.some((s) => s.skill.toLowerCase().includes(q)) ||
        c.currentJobTitle.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (skillFilter !== "all" && !c.skills.some((s) => s.skill === skillFilter)) return false;
    if (locationFilter !== "all" && c.location !== locationFilter) return false;
    if (experienceFilter !== "all") {
      const min = parseInt(experienceFilter, 10);
      if (c.experienceYears < min) return false;
    }
    return true;
  });

  const candidateSubs = (candidateId: string) => submissions.filter((s) => s.candidateId === candidateId);

  const runAISourcing = () => {
    if (!aiQuery.trim()) {
      toast.error("Enter a sourcing query first");
      return;
    }
    setAiLoading(true);
    setAiResults(null);
    setTimeout(() => {
      // Simulated AI sourcing — deterministic fake results based on query keywords
      const q = aiQuery.toLowerCase();
      const pool: AISourcedCandidate[] = [];
      if (q.includes("react") || q.includes("frontend")) {
        pool.push({ id: "ai_1", name: "Priya Nair (simulated)", headline: "Senior Frontend Engineer · React", location: "Bengaluru", experienceYears: 6, skills: ["React", "TypeScript", "Next.js"], matchScore: 94, simulated: true });
        pool.push({ id: "ai_2", name: "Meera Krishnan (simulated)", headline: "Frontend Lead · React + Design Systems", location: "Bengaluru", experienceYears: 5, skills: ["React", "Tailwind", "GraphQL"], matchScore: 82, simulated: true });
      }
      if (q.includes("go") || q.includes("backend") || q.includes("kubernetes")) {
        pool.push({ id: "ai_3", name: "Arjun Iyer (simulated)", headline: "Backend Engineer · Go & Distributed Systems", location: "Hyderabad", experienceYears: 5, skills: ["Go", "Kubernetes", "PostgreSQL"], matchScore: 91, simulated: true });
      }
      if (q.includes("product") || q.includes("pm") || q.includes("payments")) {
        pool.push({ id: "ai_4", name: "Kavya Reddy (simulated)", headline: "Lead PM — Fintech / Payments", location: "Mumbai", experienceYears: 7, skills: ["Product Strategy", "Payments"], matchScore: 96, simulated: true });
      }
      if (q.includes("devops") || q.includes("aws") || q.includes("terraform")) {
        pool.push({ id: "ai_5", name: "Vikram Singh (simulated)", headline: "DevOps / SRE · AWS + Terraform", location: "Pune", experienceYears: 4, skills: ["AWS", "Kubernetes", "Terraform"], matchScore: 88, simulated: true });
      }
      if (pool.length === 0) {
        pool.push({ id: "ai_x", name: "Top matched profile (simulated)", headline: "Skills aligned to your query", location: "India", experienceYears: 5, skills: ["Cross-functional"], matchScore: 78, simulated: true });
      }
      setAiResults(pool);
      setAiLoading(false);
      toast.success("AI sourcing complete", { description: "Simulated results returned (3 candidates)" });
    }, 1300);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate sourcing"
        description="Search the JOBSONN talent database, source with the simulated AI assistant, and submit candidates to your client requisitions."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="In talent DB" value={candidateProfiles.length} icon={<Search className="h-5 w-5" />} tone="brand" />
        <StatCard label="Your submissions" value={submissions.length} icon={<Send className="h-5 w-5" />} tone="default" />
        <StatCard label="Active requisitions" value={requisitions.filter((r) => r.status === "open").length} icon={<Briefcase className="h-5 w-5" />} tone="success" />
        <StatCard label="Duplicate flags" value={submissions.filter((s) => s.duplicateFlag).length} icon={<AlertCircle className="h-5 w-5" />} tone="warning" hint="Cross-recruiter" />
      </div>

      <SectionCard
        title="AI sourcing assistant"
        description="Natural-language search across passive candidates. Powered by a simulated AI model — results are illustrative."
        action={<Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20"><Sparkles className="mr-1 h-3 w-3" /> Simulated AI</Badge>}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Wand2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />
              <Input
                placeholder="e.g. Senior React engineers in Bengaluru open to hybrid"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runAISourcing()}
                className="pl-9"
              />
            </div>
            <Button onClick={runAISourcing} disabled={aiLoading} className="bg-violet-600 hover:bg-violet-700">
              {aiLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sourcing…</> : <><Sparkles className="mr-2 h-4 w-4" /> Source</>}
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_AI_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => setAiQuery(q)}
                className="rounded-full border bg-card px-2.5 py-1 text-xs text-muted-foreground transition hover:border-violet-400/40 hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>

          {aiResults && (
            <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                  {aiResults.length} simulated matches
                </p>
                <Badge variant="outline" className="text-violet-600 border-violet-500/30">Simulated AI</Badge>
              </div>
              <ul className="mt-2 space-y-2">
                {aiResults.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                    <AvatarLogo text={r.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{r.headline} · {r.experienceYears}y · {r.location}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {r.skills.map((s) => (
                          <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <MatchScore score={r.matchScore} />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success("Added to shortlist (simulated)", { description: r.name })}
                    >
                      Save
                    </Button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-muted-foreground">
                These are simulated candidates generated for demonstration. Connect a real sourcing provider in Settings → Integrations.
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Talent database"
        description="Search and filter candidates. Duplicate submissions to the same client/role are blocked automatically."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search name, skills, role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Skill" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All skills</SelectItem>
                {allSkills.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {allLocations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Experience" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any exp</SelectItem>
                <SelectItem value="2">2+ years</SelectItem>
                <SelectItem value="4">4+ years</SelectItem>
                <SelectItem value="6">6+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="No candidates match"
            description="Try the AI sourcing assistant for broader passive-candidate search."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const subs = candidateSubs(c.id);
              return (
                <div key={c.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <AvatarLogo text={c.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">{c.name}</p>
                        {c.openToWork && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Open to work</Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{c.currentJobTitle}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {c.location} · {c.experienceYears}y exp
                      </p>
                    </div>
                    <MatchScore score={c.profileCompleteness} />
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{c.headline}</p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.skills.slice(0, 4).map((s) => (
                      <Badge key={s.skill} variant="outline" className="text-[10px]">{s.skill}</Badge>
                    ))}
                  </div>

                  {subs.length > 0 && (
                    <div className="mt-3 rounded-lg border bg-muted/30 p-2 text-xs">
                      <p className="text-muted-foreground">Existing submissions:</p>
                      <ul className="mt-1 space-y-0.5">
                        {subs.map((s) => (
                          <li key={s.id} className="flex items-center justify-between">
                            <span className="truncate">{s.clientName} — {s.jobTitle}</span>
                            <StatusBadge status={s.status} className="ml-2" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setSubmitCandidate(c)}>
                      <Send className="mr-1 h-3.5 w-3.5" /> Submit to client
                    </Button>
                    {subs.length > 0 && (
                      <Button size="sm" variant="ghost" onClick={() => setWithdrawCandidate(c)}>
                        <AlertCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SubmitToClientDialog
        candidate={submitCandidate}
        onOpenChange={(v) => !v && setSubmitCandidate(null)}
      />
      <WithdrawDialog
        candidate={withdrawCandidate}
        onOpenChange={(v) => !v && setWithdrawCandidate(null)}
      />
    </div>
  );
}

function SubmitToClientDialog({
  candidate, onOpenChange,
}: {
  candidate: CandidateProfile | null;
  onOpenChange: (v: boolean) => void;
}) {
  const [clientId, setClientId] = React.useState("");
  const [requisitionId, setRequisitionId] = React.useState("");
  const [note, setNote] = React.useState("");
  const [consent, setConsent] = React.useState(true);

  React.useEffect(() => {
    if (candidate) {
      setClientId("");
      setRequisitionId("");
      setNote("");
      setConsent(true);
    }
  }, [candidate]);

  const clientReqs = requisitions.filter((r) => r.status === "open" && (!clientId || r.clientId === clientId));
  const duplicate = candidate && requisitions.find((r) => r.id === requisitionId)
    ? submissions.some(
        (s) => s.candidateId === candidate?.id && s.requisitionId === requisitionId
      )
    : false;

  return (
    <Dialog open={!!candidate} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit candidate to client</DialogTitle>
          <DialogDescription>
            {candidate && (
              <>
                <span className="font-medium">{candidate.name}</span> — {candidate.headline}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Client</Label>
            <Select value={clientId} onValueChange={(v) => { setClientId(v); setRequisitionId(""); }}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {Array.from(new Set(requisitions.filter((r) => r.status === "open").map((r) => r.clientId))).map((id) => {
                  const r = requisitions.find((x) => x.clientId === id)!;
                  return <SelectItem key={id} value={id}>{r.clientName}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Requisition</Label>
            <Select value={requisitionId} onValueChange={setRequisitionId}>
              <SelectTrigger><SelectValue placeholder="Select requisition" /></SelectTrigger>
              <SelectContent>
                {clientReqs.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {duplicate && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2 text-xs text-amber-700 dark:text-amber-300">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>Duplicate submission detected — this candidate was already submitted to this requisition. You can still proceed, but a duplicate flag will be raised.</span>
            </div>
          )}
          <div>
            <Label htmlFor="submit-note">Note to client (optional)</Label>
            <Input id="submit-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why this candidate is a strong fit" />
          </div>
          <label className="flex items-start gap-2 rounded-lg border p-2 text-xs">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
            />
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              I have explicit candidate consent to share their profile with this client.
            </span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!requisitionId || !consent}
            onClick={() => {
              const req = requisitions.find((r) => r.id === requisitionId)!;
              onOpenChange(false);
              toast.success("Candidate submitted", {
                description: `${candidate?.name} → ${req.clientName} (${req.title})`,
              });
            }}
          >
            Submit candidate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WithdrawDialog({
  candidate, onOpenChange,
}: {
  candidate: CandidateProfile | null;
  onOpenChange: (v: boolean) => void;
}) {
  const subs = candidate ? submissions.filter((s) => s.candidateId === candidate.id) : [];
  const [selected, setSelected] = React.useState<string>("");

  return (
    <AlertDialog open={!!candidate} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw submission</AlertDialogTitle>
          <AlertDialogDescription>
            {candidate && <>Select the submission to withdraw for <strong>{candidate.name}</strong>. This action cannot be undone.</>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          {subs.map((s) => (
            <label
              key={s.id}
              className={`flex items-center gap-3 rounded-lg border p-2 text-sm ${selected === s.id ? "border-rose-500/40 bg-rose-500/5" : ""}`}
            >
              <input
                type="radio"
                name="withdrawSub"
                checked={selected === s.id}
                onChange={() => setSelected(s.id)}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{s.clientName}</p>
                <p className="truncate text-xs text-muted-foreground">{s.jobTitle}</p>
              </div>
              <StatusBadge status={s.status} />
            </label>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!selected}
            onClick={() => {
              const s = subs.find((x) => x.id === selected);
              onOpenChange(false);
              toast.success("Submission withdrawn", { description: s ? `${s.candidateName} → ${s.clientName}` : "" });
            }}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Withdraw
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
