"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  sourcingRequests as seedRequests,
  partnerClients,
  individualLearners,
  learnerCertificates,
  talentPoolEntries,
  talentPlacements,
} from "@/lib/lms-data";
import type { SourcingRequest, IndividualLearner } from "@/lib/lms-data";
import { useNav } from "@/lib/store";
import {
  PageHeader, SectionCard, StatCard, StatusBadge, MatchScore, EmptyState,
  Card, CardContent,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  Briefcase, Plus, Search, Send, Building2, Clock, Users, Target,
  TrendingUp, Award, MapPin, DollarSign, AlertTriangle, ArrowLeft, Filter,
} from "lucide-react";

// ---------- helpers ----------

const ALL_SKILLS = Array.from(new Set(individualLearners.flatMap((l) => l.skills.map((s) => s.name)))).sort();
const ALL_CERTS = Array.from(new Set(learnerCertificates.map((c) => c.courseName))).sort();

function computeMatchScore(learner: IndividualLearner, req: SourcingRequest): number {
  let score = 50;
  const learnerSkillNames = learner.skills.map((s) => s.name);
  const skillHits = req.skillsRequired.filter((s) => learnerSkillNames.includes(s)).length;
  if (req.skillsRequired.length > 0) score += (skillHits / req.skillsRequired.length) * 30;
  const learnerCerts = learnerCertificates.filter((c) => c.learnerId === learner.id).map((c) => c.courseName);
  const certHits = req.certificationsRequired.filter((c => learnerCerts.some((lc) => lc.startsWith(c.slice(0, 12))))).length;
  if (req.certificationsRequired.length > 0) score += (certHits / req.certificationsRequired.length) * 15;
  if (learner.experience >= req.experienceMin) score += 5;
  if (learner.openToWork) score += 5;
  const hash = learner.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  score += (hash % 5);
  return Math.max(35, Math.min(99, Math.round(score)));
}

function matchedCandidates(req: SourcingRequest): { learner: IndividualLearner; score: number }[] {
  return individualLearners
    .filter((l) => l.openToWork)
    .map((l) => ({ learner: l, score: computeMatchScore(l, req) }))
    .sort((a, b) => b.score - a.score);
}

// ---------- form schema ----------

const requestSchema = z.object({
  employerId: z.string().min(1, "Select a partner client"),
  title: z.string().min(3, "Title required"),
  role: z.string().min(2, "Role required"),
  experienceMin: z.coerce.number().min(0).max(20),
  location: z.string().min(2, "Location required"),
  remote: z.boolean().default(false),
  salaryRange: z.string().min(3, "Salary range required"),
  positions: z.coerce.number().min(1).max(50),
  deadline: z.string().min(1, "Deadline required"),
  commissionPerPlacement: z.coerce.number().min(0),
  notes: z.string().optional(),
});
type RequestFormValues = z.infer<typeof requestSchema>;

// ---------- main page ----------

export function TrainingSourcingRequests() {
  const { navigate } = useNav();
  const [requests, setRequests] = React.useState<SourcingRequest[]>(seedRequests);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<SourcingRequest | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [submitFor, setSubmitFor] = React.useState<SourcingRequest | null>(null);
  const [submitLearner, setSubmitLearner] = React.useState("");
  const [formSkills, setFormSkills] = React.useState<string[]>([]);
  const [formCerts, setFormCerts] = React.useState<string[]>([]);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema) as Resolver<RequestFormValues>,
    defaultValues: {
      employerId: "", title: "", role: "", experienceMin: 3, location: "",
      remote: false, salaryRange: "₹10-18L", positions: 1,
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      commissionPerPlacement: 50000, notes: "",
    },
  });

  const filtered = requests.filter((r) => {
    const matchSearch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase()) ||
      r.employerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchPriority = priorityFilter === "all" || r.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  // KPIs
  const openCount = requests.filter((r) => r.status === "open" || r.status === "in_progress").length;
  const totalPositions = requests.reduce((s, r) => s + r.positions, 0);
  const totalPlaced = requests.reduce((s, r) => s + r.placementsMade, 0);
  const fulfillmentRate = totalPositions > 0 ? Math.round((totalPlaced / totalPositions) * 100) : 0;

  function onCreate(values: RequestFormValues) {
    const employer = partnerClients.find((p) => p.id === values.employerId);
    if (!employer) { toast.error("Select a valid partner client"); return; }
    const newReq: SourcingRequest = {
      id: `sr_new_${Date.now()}`,
      title: values.title,
      employerName: employer.name,
      employerContact: employer.contactName,
      employerEmail: employer.contactEmail,
      role: values.role,
      skillsRequired: formSkills,
      certificationsRequired: formCerts,
      experienceMin: values.experienceMin,
      location: values.location,
      remote: values.remote,
      salaryRange: values.salaryRange,
      positions: values.positions,
      status: "open",
      priority: "medium",
      createdAt: new Date().toISOString(),
      deadline: new Date(values.deadline).toISOString(),
      candidatesShortlisted: 0,
      candidatesSubmitted: 0,
      placementsMade: 0,
      commissionPerPlacement: values.commissionPerPlacement,
      notes: values.notes,
    };
    setRequests((r) => [newReq, ...r]);
    setCreateOpen(false);
    form.reset();
    setFormSkills([]); setFormCerts([]);
    toast.success(`Sourcing request created — ${values.title}`, { description: `Submitted to ${employer.name}.` });
  }

  function submitCandidate(req: SourcingRequest, learnerId: string) {
    const learner = individualLearners.find((l) => l.id === learnerId);
    if (!learner) { toast.error("Select a candidate first"); return; }
    setRequests((rs) => rs.map((r) => r.id === req.id ? {
      ...r,
      candidatesSubmitted: r.candidatesSubmitted + 1,
      candidatesShortlisted: Math.max(r.candidatesShortlisted, r.candidatesSubmitted + 1),
      status: r.status === "open" ? "in_progress" : r.status,
    } : r));
    setDetail((d) => d && d.id === req.id ? { ...d, candidatesSubmitted: d.candidatesSubmitted + 1, status: d.status === "open" ? "in_progress" : d.status } : d);
    toast.success(`${learner.name} submitted to ${req.employerName}`, {
      description: `Role: ${req.role} · Commission on placement: ${req.commissionPerPlacement ? formatCurrency(req.commissionPerPlacement) : "—"}`,
    });
    setSubmitFor(null);
    setSubmitLearner("");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sourcing Requests"
        description="Talent requests from partner employer clients. Match certified learners, submit candidates, and earn placement commissions."
        icon={<Briefcase className="h-6 w-6" />}
        actions={[{ label: "New request", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open requests" value={openCount} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total positions" value={totalPositions} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Fulfillment rate" value={`${fulfillmentRate}%`} icon={<Target className="h-5 w-5" />} tone={fulfillmentRate >= 50 ? "success" : "warning"} hint={`${totalPlaced} placed / ${totalPositions} req`} />
        <StatCard label="Avg commission/role" value={formatCurrency(requests.reduce((s, r) => s + (r.commissionPerPlacement ?? 0), 0) / Math.max(1, requests.length))} icon={<DollarSign className="h-5 w-5" />} tone="success" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title, role, employer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests table */}
      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="No sourcing requests"
            description="Adjust filters or create a new request from a partner client."
            action={<Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" /> New request</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Positions</TableHead>
                  <TableHead className="text-right">Submitted</TableHead>
                  <TableHead className="text-right">Placed</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const d = daysUntil(r.deadline);
                  return (
                    <TableRow key={r.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(r)}>
                      <TableCell>
                        <p className="font-medium">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.id}</p>
                      </TableCell>
                      <TableCell className="text-sm">{r.employerName}</TableCell>
                      <TableCell className="text-sm">{r.role}</TableCell>
                      <TableCell className="text-sm">{r.location}{r.remote && <Badge variant="outline" className="ml-1 text-[10px]">Remote</Badge>}</TableCell>
                      <TableCell className="text-right text-sm">{r.positions}</TableCell>
                      <TableCell className="text-right text-sm">{r.candidatesSubmitted}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{r.placementsMade}</TableCell>
                      <TableCell><StatusBadge status={r.priority} /></TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell>
                        <span className={d < 0 ? "text-xs font-semibold text-rose-600 dark:text-rose-400" : d <= 7 ? "text-xs font-semibold text-amber-600 dark:text-amber-400" : "text-xs text-muted-foreground"}>
                          {formatDate(r.deadline)}
                          {d < 0 ? ` (${Math.abs(d)}d over)` : ` (${d}d)`}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail Sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && <RequestDetail req={detail} onSubmit={() => { setSubmitFor(detail); setSubmitLearner(""); }} navigate={navigate} />}
        </SheetContent>
      </Sheet>

      {/* Submit candidate dialog */}
      <Dialog open={!!submitFor} onOpenChange={(o) => !o && setSubmitFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit candidate</DialogTitle>
            <DialogDescription>
              {submitFor && `Submit a certified learner for "${submitFor.title}" at ${submitFor.employerName}.`}
            </DialogDescription>
          </DialogHeader>
          {submitFor && (
            <SubmitCandidatePicker
              req={submitFor}
              selectedLearner={submitLearner}
              onSelect={setSubmitLearner}
            />
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button disabled={!submitLearner || !submitFor} onClick={() => submitFor && submitCandidate(submitFor, submitLearner)}>
              <Send className="mr-2 h-4 w-4" /> Submit candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create request dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New sourcing request</DialogTitle>
            <DialogDescription>Create a talent request from a partner employer client. Skill and certification requirements drive match scores.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
            <div>
              <Label htmlFor="employer">Partner client *</Label>
              <Select value={form.watch("employerId")} onValueChange={(v) => form.setValue("employerId", v)}>
                <SelectTrigger id="employer" className="mt-1"><SelectValue placeholder="Select partner client" /></SelectTrigger>
                <SelectContent>
                  {partnerClients.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} ({p.industry})</SelectItem>)}
                </SelectContent>
              </Select>
              {form.formState.errors.employerId && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.employerId.message}</p>}
              <p className="mt-1 text-[11px] text-muted-foreground">Commission rate is configurable per partner agreement — see Partner Clients.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="title">Request title *</Label>
                <Input id="title" placeholder="Senior React Engineer" {...form.register("title")} className="mt-1" />
                {form.formState.errors.title && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input id="role" placeholder="Senior Frontend Engineer" {...form.register("role")} className="mt-1" />
                {form.formState.errors.role && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.role.message}</p>}
              </div>
              <div>
                <Label htmlFor="exp">Min experience (years)</Label>
                <Input id="exp" type="number" min={0} max={20} {...form.register("experienceMin")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="loc">Location *</Label>
                <Input id="loc" placeholder="Bengaluru" {...form.register("location")} className="mt-1" />
                {form.formState.errors.location && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.location.message}</p>}
              </div>
              <div>
                <Label htmlFor="sal">Salary range *</Label>
                <Input id="sal" placeholder="₹18-28L" {...form.register("salaryRange")} className="mt-1" />
                {form.formState.errors.salaryRange && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.salaryRange.message}</p>}
              </div>
              <div>
                <Label htmlFor="pos">Positions</Label>
                <Input id="pos" type="number" min={1} max={50} {...form.register("positions")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline *</Label>
                <Input id="deadline" type="date" {...form.register("deadline")} className="mt-1" />
                {form.formState.errors.deadline && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.deadline.message}</p>}
              </div>
              <div>
                <Label htmlFor="comm">Commission per placement (₹)</Label>
                <Input id="comm" type="number" min={0} {...form.register("commissionPerPlacement")} className="mt-1" />
                <p className="mt-1 text-[11px] text-muted-foreground">Default 8.33% of annual CTC (1 month salary).</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remote"
                className="h-4 w-4 rounded border-border"
                checked={form.watch("remote")}
                onChange={(e) => form.setValue("remote", e.target.checked)}
              />
              <Label htmlFor="remote" className="cursor-pointer text-sm">Remote-eligible role</Label>
            </div>
            <div>
              <Label>Skills required</Label>
              <div className="mt-2 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto scroll-thin">
                {ALL_SKILLS.map((s) => {
                  const active = formSkills.includes(s);
                  return (
                    <button key={s} type="button" onClick={() => setFormSkills((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s])}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${active ? "border-brand bg-brand text-white" : "border-border bg-card hover:border-brand/40 hover:bg-brand/5"}`}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Certifications required (optional)</Label>
              <div className="mt-2 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto scroll-thin">
                {ALL_CERTS.map((c) => {
                  const active = formCerts.includes(c);
                  return (
                    <button key={c} type="button" onClick={() => setFormCerts((cur) => cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c])}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${active ? "border-brand bg-brand text-white" : "border-border bg-card hover:border-brand/40 hover:bg-brand/5"}`}>
                      <Award className="mr-1 inline h-3 w-3" />{c}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" placeholder="Anything else the recruiter should know..." {...form.register("notes")} className="mt-1" rows={2} />
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Create request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- RequestDetail ----------

function RequestDetail({
  req, onSubmit, navigate,
}: {
  req: SourcingRequest;
  onSubmit: () => void;
  navigate: (portal: string, route: string) => void;
}) {
  const matches = matchedCandidates(req);
  const placements = talentPlacements.filter((p) => p.sourcingRequestId === req.id);
  const poolEntries = talentPoolEntries.filter((e) => e.status !== "withdrawn").slice(0, 5);
  const d = daysUntil(req.deadline);
  const progress = req.positions > 0 ? Math.min(100, Math.round((req.placementsMade / req.positions) * 100)) : 0;

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg">{req.title}</SheetTitle>
              <StatusBadge status={req.status} />
              <StatusBadge status={req.priority} />
            </div>
            <SheetDescription>{req.role} · {req.employerName}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-5 space-y-5">
        {/* Key info */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-medium">{req.location}{req.remote && " · Remote OK"}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Salary range</p>
            <p className="text-sm font-medium">{req.salaryRange}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Min experience</p>
            <p className="text-sm font-medium">{req.experienceMin}+ years</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Positions</p>
            <p className="text-sm font-medium">{req.positions}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Commission/role</p>
            <p className="text-sm font-medium">{req.commissionPerPlacement ? formatCurrency(req.commissionPerPlacement) : "—"}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Deadline</p>
            <p className={`text-sm font-medium ${d < 0 ? "text-rose-600" : d <= 7 ? "text-amber-600" : ""}`}>
              {formatDate(req.deadline)} ({d < 0 ? `${Math.abs(d)}d over` : `${d}d left`})
            </p>
          </Card>
        </div>

        {/* Skills & certs required */}
        <div className="space-y-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills required</p>
            <div className="flex flex-wrap gap-1">
              {req.skillsRequired.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
          {req.certificationsRequired.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Certifications required</p>
              <div className="flex flex-wrap gap-1">
                {req.certificationsRequired.map((c) => <Badge key={c} variant="outline"><Award className="mr-1 h-3 w-3" />{c}</Badge>)}
              </div>
            </div>
          )}
        </div>

        {/* Fulfillment progress */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium">Fulfillment progress</span>
            <span className="text-muted-foreground">{req.placementsMade}/{req.positions} placed · {req.candidatesSubmitted} submitted</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Employer contact */}
        <div className="rounded-lg border p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employer contact</p>
          <p className="text-sm font-medium">{req.employerContact}</p>
          <p className="text-xs text-muted-foreground">{req.employerEmail}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="matches">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matches">AI matches ({matches.length})</TabsTrigger>
            <TabsTrigger value="submitted">Submitted ({req.candidatesSubmitted})</TabsTrigger>
            <TabsTrigger value="placements">Placements ({placements.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="matches" className="mt-3">
            <div className="space-y-2">
              {matches.slice(0, 6).map(({ learner, score }) => (
                <div key={learner.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                  <AvatarLogo text={learner.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{learner.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{learner.headline}</p>
                  </div>
                  <div className="hidden gap-1 sm:flex">
                    {learner.skills.slice(0, 2).map((s) => <Badge key={s.name} variant="outline" className="text-[10px]">{s.name}</Badge>)}
                  </div>
                  <MatchScore score={score} />
                  <Button size="sm" variant="outline" onClick={onSubmit}>
                    <Send className="mr-1 h-3 w-3" /> Submit
                  </Button>
                </div>
              ))}
              {matches.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No matching candidates currently open to work.</p>}
            </div>
          </TabsContent>
          <TabsContent value="submitted" className="mt-3">
            {req.candidatesSubmitted === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No candidates submitted yet.</p>
            ) : (
              <div className="space-y-2">
                {poolEntries.slice(0, req.candidatesSubmitted).map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                    <AvatarLogo text={e.learnerName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{e.learnerName}</p>
                      <p className="text-xs text-muted-foreground">Submitted · Match {e.matchScore}</p>
                    </div>
                    <StatusBadge status="shortlisted" />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="placements" className="mt-3">
            {placements.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No placements yet for this request.</p>
            ) : (
              <div className="space-y-2">
                {placements.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                    <AvatarLogo text={p.learnerName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.learnerName}</p>
                      <p className="text-xs text-muted-foreground">{p.jobTitle} · {formatCurrency(p.salary)}</p>
                    </div>
                    <StatusBadge status={p.status === "joined" ? "hired" : p.status === "offered" ? "offer" : p.status === "declined" ? "declined" : "warning"} />
                    <Button size="sm" variant="ghost" onClick={() => navigate("training", "placements")}>View</Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {req.notes && (
          <div className="rounded-lg bg-muted/40 p-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
            {req.notes}
          </div>
        )}

        <SheetFooter className="flex-row gap-2">
          <Button onClick={onSubmit}><Send className="mr-2 h-4 w-4" /> Submit candidate</Button>
          <Button variant="outline" onClick={() => navigate("training", "talent-search")}>
            <Search className="mr-2 h-4 w-4" /> Find more candidates
          </Button>
        </SheetFooter>
      </div>
    </>
  );
}

// ---------- SubmitCandidatePicker ----------

function SubmitCandidatePicker({
  req, selectedLearner, onSelect,
}: {
  req: SourcingRequest;
  selectedLearner: string;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = React.useState("");
  const matches = matchedCandidates(req);
  const filtered = matches.filter(({ learner }) =>
    !search || learner.name.toLowerCase().includes(search.toLowerCase()) || learner.headline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="max-h-96 space-y-1.5 overflow-y-auto scroll-thin">
        {filtered.map(({ learner, score }) => (
          <button
            key={learner.id}
            type="button"
            onClick={() => onSelect(learner.id)}
            className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition ${
              selectedLearner === learner.id ? "border-brand bg-brand/5" : "hover:bg-muted/40"
            }`}
          >
            <AvatarLogo text={learner.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{learner.name}</p>
              <p className="truncate text-xs text-muted-foreground">{learner.headline}</p>
            </div>
            <div className="hidden gap-1 sm:flex">
              {learner.skills.slice(0, 2).map((s) => <Badge key={s.name} variant="outline" className="text-[10px]">{s.name}</Badge>)}
            </div>
            <MatchScore score={score} />
          </button>
        ))}
      </div>
    </div>
  );
}
