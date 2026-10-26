"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  EmptyState,
  StatCard,
  StatusBadge,
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
  GraduationCap,
  Award,
  MapPin,
  Star,
  BadgeCheck,
  Send,
  Briefcase,
  Calendar,
} from "lucide-react";
import { partners, programs, jobOrders, MODEL_LABELS } from "@/lib/partner-data";
import { formatDate } from "@/lib/format";

// ============================================================
// Partner-sourced candidate pool
// (candidates from partner centres / colleges, with batch info)
// ============================================================
interface PartnerCandidate {
  id: string;
  name: string;
  partnerId: string;
  partnerName: string;
  partnerModel: string;
  collegeName?: string;
  centreName?: string;
  programId: string;
  programName: string;
  certification: string;
  batch: string;
  batchStatus: "upcoming" | "active" | "completed";
  skills: string[];
  city: string;
  state: string;
  experienceYears: number;
  rating: number;
  openToWork: boolean;
  completedAt?: string;
  expectedSalary?: number;
}

const CANDIDATES: PartnerCandidate[] = [
  { id: "pc_001", name: "Aarav Sharma", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Chennai East — Main Campus", programId: "prog_001", programName: "Full-Stack Engineering Program", certification: "JOBSONN Full-Stack Certificate", batch: "B-24-07", batchStatus: "completed", skills: ["React", "Node.js", "TypeScript", "PostgreSQL"], city: "Chennai", state: "Tamil Nadu", experienceYears: 0, rating: 4.8, openToWork: true, completedAt: "2024-09-15", expectedSalary: 800000 },
  { id: "pc_002", name: "Divya Lakshmi", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Chennai East — Main Campus", programId: "prog_002", programName: "Data Science & Analytics", certification: "JOBSONN Data Science Certificate", batch: "B-24-06", batchStatus: "completed", skills: ["Python", "Machine Learning", "SQL", "Tableau"], city: "Chennai", state: "Tamil Nadu", experienceYears: 1, rating: 4.6, openToWork: true, completedAt: "2024-08-20", expectedSalary: 950000 },
  { id: "pc_003", name: "Karthik Reddy", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", partnerModel: "CENTRE", centreName: "BSB Koramangala", programId: "prog_005", programName: "Cloud & DevOps Engineering", certification: "JOBSONN Cloud DevOps Certificate", batch: "B-24-13", batchStatus: "upcoming", skills: ["Kubernetes", "AWS", "Terraform", "Docker"], city: "Bengaluru", state: "Karnataka", experienceYears: 2, rating: 4.7, openToWork: true, expectedSalary: 1200000 },
  { id: "pc_004", name: "Meera Iyer", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Velachery Branch", programId: "prog_006", programName: "UI/UX Design Program", certification: "JOBSONN UX Design Certificate", batch: "B-24-08", batchStatus: "completed", skills: ["Figma", "User Research", "Prototyping", "Design Systems"], city: "Chennai", state: "Tamil Nadu", experienceYears: 1, rating: 4.5, openToWork: true, completedAt: "2024-09-30", expectedSalary: 750000 },
  { id: "pc_005", name: "Sanjay Gupta", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Chennai East — Main Campus", programId: "prog_004", programName: "Cybersecurity Essentials", certification: "JOBSONN Security Certificate", batch: "B-24-09", batchStatus: "completed", skills: ["Information Security", "SIEM", "Networking"], city: "Chennai", state: "Tamil Nadu", experienceYears: 0, rating: 4.4, openToWork: true, completedAt: "2024-10-10", expectedSalary: 700000 },
  { id: "pc_006", name: "Priya Senthil", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", partnerModel: "CENTRE", centreName: "BSB Koramangala", programId: "prog_003", programName: "Digital Marketing Mastery", certification: "JOBSONN Digital Marketing Certificate", batch: "B-24-05", batchStatus: "completed", skills: ["SEO", "SEM", "Google Analytics", "Content"], city: "Bengaluru", state: "Karnataka", experienceYears: 1, rating: 4.6, openToWork: false, completedAt: "2024-08-05" },
  { id: "pc_007", name: "Arjun Kanchana", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", partnerModel: "COLLEGE", collegeName: "Kanchana Institute of Technology", programId: "prog_001", programName: "Full-Stack Engineering Program", certification: "JOBSONN Full-Stack Certificate", batch: "Campus 2024", batchStatus: "completed", skills: ["React", "Node.js", "Java", "Spring Boot"], city: "Coimbatore", state: "Tamil Nadu", experienceYears: 0, rating: 4.7, openToWork: true, completedAt: "2024-09-25", expectedSalary: 850000 },
  { id: "pc_008", name: "Lakshmi Venkat", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", partnerModel: "COLLEGE", collegeName: "Kanchana Institute of Technology", programId: "prog_002", programName: "Data Science & Analytics", certification: "JOBSONN Data Science Certificate", batch: "Campus 2024", batchStatus: "completed", skills: ["Python", "Machine Learning", "Statistics", "R"], city: "Coimbatore", state: "Tamil Nadu", experienceYears: 0, rating: 4.5, openToWork: true, completedAt: "2024-09-25", expectedSalary: 900000 },
  { id: "pc_009", name: "Vigneshwar Rao", partnerId: "ptn_003", partnerName: "Veltech University", partnerModel: "COLLEGE", collegeName: "Veltech University", programId: "prog_005", programName: "Cloud & DevOps Engineering", certification: "JOBSONN Cloud DevOps Certificate", batch: "Campus 2024", batchStatus: "completed", skills: ["Kubernetes", "AWS", "Jenkins", "Linux"], city: "Chennai", state: "Tamil Nadu", experienceYears: 0, rating: 4.8, openToWork: true, completedAt: "2024-08-15", expectedSalary: 1100000 },
  { id: "pc_010", name: "Ananya Krishnan", partnerId: "ptn_003", partnerName: "Veltech University", partnerModel: "COLLEGE", collegeName: "Veltech University", programId: "prog_006", programName: "UI/UX Design Program", certification: "JOBSONN UX Design Certificate", batch: "Campus 2024", batchStatus: "completed", skills: ["Figma", "User Research", "Wireframing"], city: "Chennai", state: "Tamil Nadu", experienceYears: 0, rating: 4.6, openToWork: true, completedAt: "2024-07-30", expectedSalary: 720000 },
  { id: "pc_011", name: "Rahul Menon", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Chennai East — Main Campus", programId: "prog_005", programName: "Cloud & DevOps Engineering", certification: "JOBSONN Cloud DevOps Certificate", batch: "B-24-04", batchStatus: "completed", skills: ["AWS", "Terraform", "Kubernetes", "Docker"], city: "Chennai", state: "Tamil Nadu", experienceYears: 1, rating: 4.7, openToWork: true, completedAt: "2024-06-20", expectedSalary: 1300000 },
  { id: "pc_012", name: "Sneha Pillai", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", partnerModel: "CENTRE", centreName: "BSB Koramangala", programId: "prog_002", programName: "Data Science & Analytics", certification: "JOBSONN Data Science Certificate", batch: "B-24-09", batchStatus: "active", skills: ["Python", "SQL", "Machine Learning", "PyTorch"], city: "Bengaluru", state: "Karnataka", experienceYears: 0, rating: 4.5, openToWork: false },
];

const PROGRAM_OPTIONS = programs.map((p) => ({ id: p.id, name: p.name }));
const CERT_OPTIONS = Array.from(new Set(programs.flatMap((p) => p.certifications)));
const BATCH_OPTIONS = Array.from(new Set(CANDIDATES.map((c) => c.batch)));

export function RecruiterPartnerCandidates() {
  const [search, setSearch] = React.useState("");
  const [partnerFilter, setPartnerFilter] = React.useState<string>("all");
  const [programFilter, setProgramFilter] = React.useState<string>("all");
  const [certFilter, setCertFilter] = React.useState<string>("all");
  const [batchFilter, setBatchFilter] = React.useState<string>("all");
  const [openToWorkOnly, setOpenToWorkOnly] = React.useState(false);
  const [selected, setSelected] = React.useState<PartnerCandidate | null>(null);
  const [submitFor, setSubmitFor] = React.useState<PartnerCandidate | null>(null);
  const [selectedJobOrder, setSelectedJobOrder] = React.useState<string>("");

  const totalCandidates = CANDIDATES.length;
  const openCount = CANDIDATES.filter((c) => c.openToWork).length;
  const avgRating = CANDIDATES.length > 0
    ? (CANDIDATES.reduce((s, c) => s + c.rating, 0) / CANDIDATES.length).toFixed(1)
    : "0";
  const partnerCount = new Set(CANDIDATES.map((c) => c.partnerId)).size;

  const filtered = React.useMemo(() => {
    return CANDIDATES.filter((c) => {
      if (partnerFilter !== "all" && c.partnerId !== partnerFilter) return false;
      if (programFilter !== "all" && c.programId !== programFilter) return false;
      if (certFilter !== "all" && c.certification !== certFilter) return false;
      if (batchFilter !== "all" && c.batch !== batchFilter) return false;
      if (openToWorkOnly && !c.openToWork) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.programName.toLowerCase().includes(q) &&
          !c.skills.some((s) => s.toLowerCase().includes(q)) &&
          !c.partnerName.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    }).sort((a, b) => Number(b.openToWork) - Number(a.openToWork) || b.rating - a.rating);
  }, [search, partnerFilter, programFilter, certFilter, batchFilter, openToWorkOnly]);

  const handleSubmit = () => {
    if (!submitFor) return;
    if (!selectedJobOrder) {
      toast.error("Select a job order to submit to");
      return;
    }
    const jo = jobOrders.find((j) => j.id === selectedJobOrder);
    toast.success(`${submitFor.name} submitted to ${jo?.title ?? "job order"}`, {
      description: `Submitted to ${jo?.clientName ?? "client"} via ${submitFor.partnerName}. Client will be notified.`,
    });
    setSubmitFor(null);
    setSelectedJobOrder("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner-Sourced Candidates"
        description="Browse and submit candidates trained at JOBSONN partner training centres and colleges to your open mandates."
        icon={<Users className="h-6 w-6" />}
        breadcrumbs={[{ label: "Talent & Sourcing" }, { label: "Partner Candidates" }]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Candidates" value={totalCandidates} icon={<Users className="h-5 w-5" />} tone="brand" hint="Partner-sourced" />
        <StatCard label="Open to Work" value={openCount} icon={<Briefcase className="h-5 w-5" />} tone="success" hint={`${Math.round((openCount / totalCandidates) * 100)}% available`} />
        <StatCard label="Avg Rating" value={avgRating} icon={<Star className="h-5 w-5" />} tone="default" hint="Partner-rated" />
        <StatCard label="Partner Sources" value={partnerCount} icon={<GraduationCap className="h-5 w-5" />} tone="default" hint="Centres & colleges" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Filters sidebar */}
        <Card className="h-fit p-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filters</h3>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => {
              setPartnerFilter("all"); setProgramFilter("all"); setCertFilter("all"); setBatchFilter("all"); setOpenToWorkOnly(false); setSearch("");
            }}>
              Reset
            </Button>
          </div>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates…" className="h-9 pl-8" />
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Partner</label>
              <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Partners</SelectItem>
                  {partners.filter((p) => p.studentsEnrolled > 0 || p.model === "COLLEGE").map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Program</label>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {PROGRAM_OPTIONS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Certification</label>
              <Select value={certFilter} onValueChange={setCertFilter}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certifications</SelectItem>
                  {CERT_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Batch</label>
              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {BATCH_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border p-2.5 text-sm">
              <Checkbox checked={openToWorkOnly} onCheckedChange={(v) => setOpenToWorkOnly(v === true)} />
              <span>Open to work only</span>
            </label>
          </div>
        </Card>

        {/* Results */}
        <SectionCard
          className="lg:col-span-3"
          title="Partner-Trained Candidates"
          description={`${filtered.length} candidates match your filters`}
        >
          {filtered.length === 0 ? (
            <EmptyState icon={<Users className="h-5 w-5" />} title="No candidates match" description="Try widening your filters." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((c) => (
                <Card
                  key={c.id}
                  className="cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                  onClick={() => setSelected(c)}
                >
                  <div className="flex items-start gap-3">
                    <AvatarLogo text={c.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-medium">{c.name}</span>
                            <Badge variant="outline" className="gap-1 border-brand/30 bg-brand/5 text-brand">
                              <BadgeCheck className="h-3 w-3" />Partner-trained
                            </Badge>
                          </div>
                          <div className="mt-0.5 truncate text-xs text-muted-foreground">{c.programName}</div>
                        </div>
                        {c.openToWork ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Open</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Placed</Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><GraduationCap className="h-3 w-3" />{c.partnerName}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{c.batch}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.skills.slice(0, 4).map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        ))}
                        {c.skills.length > 4 ? (
                          <Badge variant="outline" className="text-[10px]">+{c.skills.length - 4}</Badge>
                        ) : null}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{c.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">· {c.experienceYears}y · {c.city}</span>
                        </span>
                        <Button size="sm" variant="outline" className="h-7" onClick={(e) => { e.stopPropagation(); setSubmitFor(c); }}>
                          <Send className="mr-1 h-3 w-3" />Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {selected ? (
            <CandidateDetail candidate={selected} onSubmit={() => { setSubmitFor(selected); setSelected(null); }} />
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Submit to mandate dialog */}
      <Dialog open={!!submitFor} onOpenChange={(o) => !o && setSubmitFor(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit to Mandate</DialogTitle>
            <DialogDescription>
              Submit <span className="font-medium text-foreground">{submitFor?.name}</span> ({submitFor?.partnerName}) to an open job order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="job-order">Select job order</Label>
              <Select value={selectedJobOrder} onValueChange={setSelectedJobOrder}>
                <SelectTrigger id="job-order" className="mt-1.5"><SelectValue placeholder="Choose an open mandate…" /></SelectTrigger>
                <SelectContent>
                  {jobOrders.filter((j) => j.status === "open" || j.status === "partial").map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.title} — {j.clientName} ({j.positions - j.filled} open)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedJobOrder ? (
              <div className="rounded-md border bg-muted/30 p-3 text-xs">
                {(() => {
                  const jo = jobOrders.find((j) => j.id === selectedJobOrder);
                  if (!jo) return null;
                  return (
                    <div className="space-y-1">
                      <div><span className="text-muted-foreground">Role:</span> <span className="font-medium">{jo.role}</span></div>
                      <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{jo.location}{jo.remote ? " (Remote)" : ""}</span></div>
                      <div><span className="text-muted-foreground">Salary:</span> <span className="font-medium">₹{(jo.salaryMin / 100000).toFixed(1)}L – ₹{(jo.salaryMax / 100000).toFixed(1)}L</span></div>
                      <div><span className="text-muted-foreground">Deadline:</span> <span className="font-medium">{formatDate(jo.deadline)}</span></div>
                    </div>
                  );
                })()}
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitFor(null)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit}>
              <Send className="mr-1.5 h-4 w-4" />Submit Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CandidateDetail({ candidate, onSubmit }: { candidate: PartnerCandidate; onSubmit: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="px-6 pt-6">
        <div className="flex items-start gap-4">
          <AvatarLogo text={candidate.name} size="xl" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl">{candidate.name}</SheetTitle>
            <SheetDescription className="mt-1">
              {candidate.experienceYears}y experience · {candidate.city}, {candidate.state}
            </SheetDescription>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1 border-brand/30 bg-brand/5 text-brand">
                <BadgeCheck className="h-3 w-3" />Partner-trained
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Award className="h-3 w-3" />Certified
              </Badge>
              {candidate.openToWork ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Open to work</Badge>
              ) : (
                <Badge variant="outline">Placed</Badge>
              )}
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto scroll-thin px-6 pb-6">
        {/* Quick facts */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MiniField icon={<GraduationCap className="h-3.5 w-3.5" />} label="Partner" value={candidate.partnerName} />
          <MiniField icon={<Award className="h-3.5 w-3.5" />} label="Certification" value={candidate.certification} />
          <MiniField icon={<Calendar className="h-3.5 w-3.5" />} label="Batch" value={candidate.batch} />
        </div>

        {/* Training details */}
        <Card className="mt-5 p-4">
          <h3 className="text-sm font-semibold">Training & Background</h3>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Program" value={candidate.programName} />
            <Row label="Partner model" value={MODEL_LABELS[candidate.partnerModel as keyof typeof MODEL_LABELS] ?? candidate.partnerModel} />
            {candidate.centreName ? <Row label="Training centre" value={candidate.centreName} /> : null}
            {candidate.collegeName ? <Row label="College" value={candidate.collegeName} /> : null}
            <Row label="Batch status" value={<StatusBadge status={candidate.batchStatus} />} />
            {candidate.completedAt ? <Row label="Completed" value={formatDate(candidate.completedAt)} /> : null}
            <Row label="Candidate rating" value={`${candidate.rating.toFixed(1)} / 5`} />
            {candidate.expectedSalary ? <Row label="Expected CTC" value={`₹${(candidate.expectedSalary / 100000).toFixed(1)}L`} /> : null}
          </div>
        </Card>

        {/* Skills */}
        <Card className="mt-4 p-4">
          <h3 className="text-sm font-semibold">Verified Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {candidate.skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1">
                <BadgeCheck className="h-3 w-3 text-emerald-600" />{s}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Verified through partner assessments and certifications.</p>
        </Card>

        <Button className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700" onClick={onSubmit}>
          <Send className="mr-2 h-4 w-4" />Submit to Mandate
        </Button>
        <Button variant="outline" className="mt-2 w-full" onClick={() => toast.info("Added to hotlist", { description: `${candidate.name} added to your partner-candidate hotlist.` })}>
          Add to Hotlist
        </Button>
      </div>
    </div>
  );
}

function MiniField({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed pb-1.5 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
