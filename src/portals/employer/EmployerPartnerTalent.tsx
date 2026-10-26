"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  EmptyState,
  MatchScore,
  StatCard,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Search,
  GraduationCap,
  Award,
  MapPin,
  Briefcase,
  Star,
  BadgeCheck,
  Send,
  Sparkles,
} from "lucide-react";
import { partners, programs, trainingCentres, colleges, MODEL_LABELS } from "@/lib/partner-data";

// ============================================================
// Synthetic partner-trained talent pool
// (derived from real partner + program data)
// ============================================================
interface PartnerTrainedTalent {
  id: string;
  name: string;
  partnerId: string;
  partnerName: string;
  partnerModel: string;
  centreName?: string;
  programId: string;
  programName: string;
  certification: string;
  skills: string[];
  matchScore: number;
  city: string;
  state: string;
  experienceYears: number;
  currentRole?: string;
  openToWork: boolean;
  completedAt: string;
  rating: number;
  batch?: string;
}

const TALENT_POOL: PartnerTrainedTalent[] = [
  { id: "ptt_001", name: "Aarav Sharma", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Chennai East — Main Campus", programId: "prog_001", programName: "Full-Stack Engineering Program", certification: "JOBSONN Full-Stack Certificate", skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"], matchScore: 92, city: "Chennai", state: "Tamil Nadu", experienceYears: 0, openToWork: true, completedAt: "2024-09-15", rating: 4.8, batch: "B-24-07" },
  { id: "ptt_002", name: "Divya Lakshmi", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Chennai East — Main Campus", programId: "prog_002", programName: "Data Science & Analytics", certification: "JOBSONN Data Science Certificate", skills: ["Python", "Machine Learning", "Pandas", "SQL", "Tableau"], matchScore: 88, city: "Chennai", state: "Tamil Nadu", experienceYears: 1, currentRole: "Junior Data Analyst", openToWork: true, completedAt: "2024-08-20", rating: 4.6, batch: "B-24-06" },
  { id: "ptt_003", name: "Karthik Reddy", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", partnerModel: "CENTRE", centreName: "BSB Koramangala", programId: "prog_005", programName: "Cloud & DevOps Engineering", certification: "JOBSONN Cloud DevOps Certificate", skills: ["Kubernetes", "AWS", "Terraform", "Docker", "CI/CD"], matchScore: 94, city: "Bengaluru", state: "Karnataka", experienceYears: 2, currentRole: "DevOps Intern", openToWork: true, completedAt: "2024-10-01", rating: 4.7, batch: "B-24-13" },
  { id: "ptt_004", name: "Meera Iyer", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Velachery Branch", programId: "prog_006", programName: "UI/UX Design Program", certification: "JOBSONN UX Design Certificate", skills: ["Figma", "User Research", "Prototyping", "Design Systems"], matchScore: 85, city: "Chennai", state: "Tamil Nadu", experienceYears: 1, openToWork: true, completedAt: "2024-09-30", rating: 4.5, batch: "B-24-08" },
  { id: "ptt_005", name: "Sanjay Gupta", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Chennai East — Main Campus", programId: "prog_004", programName: "Cybersecurity Essentials", certification: "JOBSONN Security Certificate", skills: ["Information Security", "SIEM", "Penetration Testing", "Networking"], matchScore: 79, city: "Chennai", state: "Tamil Nadu", experienceYears: 0, openToWork: true, completedAt: "2024-10-10", rating: 4.4, batch: "B-24-09" },
  { id: "ptt_006", name: "Priya Senthil", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", partnerModel: "CENTRE", centreName: "BSB Koramangala", programId: "prog_003", programName: "Digital Marketing Mastery", certification: "JOBSONN Digital Marketing Certificate", skills: ["SEO", "SEM", "Google Analytics", "Social Media", "Content"], matchScore: 82, city: "Bengaluru", state: "Karnataka", experienceYears: 1, currentRole: "SEO Executive", openToWork: false, completedAt: "2024-08-05", rating: 4.6, batch: "B-24-05" },
  { id: "ptt_007", name: "Arjun Kanchana", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", partnerModel: "COLLEGE", programId: "prog_001", programName: "Full-Stack Engineering Program", certification: "JOBSONN Full-Stack Certificate", skills: ["React", "Node.js", "Java", "Spring Boot", "MySQL"], matchScore: 90, city: "Coimbatore", state: "Tamil Nadu", experienceYears: 0, openToWork: true, completedAt: "2024-09-25", rating: 4.7, batch: "Campus 2024" },
  { id: "ptt_008", name: "Lakshmi Venkat", partnerId: "ptn_003", partnerName: "Kanchana Institute of Technology", partnerModel: "COLLEGE", programId: "prog_002", programName: "Data Science & Analytics", certification: "JOBSONN Data Science Certificate", skills: ["Python", "Machine Learning", "Statistics", "R", "Visualization"], matchScore: 86, city: "Coimbatore", state: "Tamil Nadu", experienceYears: 0, openToWork: true, completedAt: "2024-09-25", rating: 4.5, batch: "Campus 2024" },
  { id: "ptt_009", name: "Vigneshwar Rao", partnerId: "ptn_003", partnerName: "Veltech University", partnerModel: "COLLEGE", programId: "prog_005", programName: "Cloud & DevOps Engineering", certification: "JOBSONN Cloud DevOps Certificate", skills: ["Kubernetes", "AWS", "Jenkins", "Linux", "Bash"], matchScore: 91, city: "Chennai", state: "Tamil Nadu", experienceYears: 0, openToWork: true, completedAt: "2024-08-15", rating: 4.8, batch: "Campus 2024" },
  { id: "ptt_010", name: "Ananya Krishnan", partnerId: "ptn_003", partnerName: "Veltech University", partnerModel: "COLLEGE", programId: "prog_006", programName: "UI/UX Design Program", certification: "JOBSONN UX Design Certificate", skills: ["Figma", "User Research", "Wireframing", "Prototyping"], matchScore: 84, city: "Chennai", state: "Tamil Nadu", experienceYears: 0, openToWork: true, completedAt: "2024-07-30", rating: 4.6, batch: "Campus 2024" },
  { id: "ptt_011", name: "Rahul Menon", partnerId: "ptn_001", partnerName: "Chennai Tech Academy", partnerModel: "CENTRE", centreName: "Chennai East — Main Campus", programId: "prog_005", programName: "Cloud & DevOps Engineering", certification: "JOBSONN Cloud DevOps Certificate", skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Python"], matchScore: 89, city: "Chennai", state: "Tamil Nadu", experienceYears: 1, currentRole: "Cloud Engineer", openToWork: true, completedAt: "2024-06-20", rating: 4.7, batch: "B-24-04" },
  { id: "ptt_012", name: "Sneha Pillai", partnerId: "ptn_002", partnerName: "Bengaluru Skills Centre", partnerModel: "CENTRE", centreName: "BSB Koramangala", programId: "prog_002", programName: "Data Science & Analytics", certification: "JOBSONN Data Science Certificate", skills: ["Python", "SQL", "Machine Learning", "Deep Learning", "PyTorch"], matchScore: 87, city: "Bengaluru", state: "Karnataka", experienceYears: 0, openToWork: true, completedAt: "2024-09-10", rating: 4.5, batch: "B-24-09" },
];

const PROGRAM_OPTIONS = programs.map((p) => ({ id: p.id, name: p.name }));
const CERT_OPTIONS = Array.from(new Set(programs.flatMap((p) => p.certifications)));
const LOCATION_OPTIONS = Array.from(new Set(TALENT_POOL.map((t) => t.city)));

export function EmployerPartnerTalent() {
  const [search, setSearch] = React.useState("");
  const [partnerFilter, setPartnerFilter] = React.useState<string>("all");
  const [programFilter, setProgramFilter] = React.useState<string>("all");
  const [certFilter, setCertFilter] = React.useState<string>("all");
  const [locationFilter, setLocationFilter] = React.useState<string>("all");
  const [openToWorkOnly, setOpenToWorkOnly] = React.useState(false);
  const [selected, setSelected] = React.useState<PartnerTrainedTalent | null>(null);

  const totalTalent = TALENT_POOL.length;
  const openCount = TALENT_POOL.filter((t) => t.openToWork).length;
  const avgMatch = TALENT_POOL.length > 0 ? Math.round(TALENT_POOL.reduce((s, t) => s + t.matchScore, 0) / TALENT_POOL.length) : 0;
  const partnerCount = new Set(TALENT_POOL.map((t) => t.partnerId)).size;

  const filtered = React.useMemo(() => {
    return TALENT_POOL.filter((t) => {
      if (partnerFilter !== "all" && t.partnerId !== partnerFilter) return false;
      if (programFilter !== "all" && t.programId !== programFilter) return false;
      if (certFilter !== "all" && t.certification !== certFilter) return false;
      if (locationFilter !== "all" && t.city !== locationFilter) return false;
      if (openToWorkOnly && !t.openToWork) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.name.toLowerCase().includes(q) &&
          !t.programName.toLowerCase().includes(q) &&
          !t.skills.some((s) => s.toLowerCase().includes(q)) &&
          !t.partnerName.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [search, partnerFilter, programFilter, certFilter, locationFilter, openToWorkOnly]);

  const handleRequest = (talent: PartnerTrainedTalent) => {
    toast.success(`Candidate request sent for ${talent.name}`, {
      description: `${talent.partnerName} will receive the request and confirm availability within 48 hours.`,
    });
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner-Trained Talent"
        description="Hire from candidates trained and certified by JOBSONN's network of franchise partners."
        icon={<Users className="h-6 w-6" />}
        breadcrumbs={[{ label: "Partners" }, { label: "Partner Talent" }]}
        actions={[
          { label: "Bulk Request", variant: "outline", onClick: () => toast.info("Bulk request mode", { description: "Select multiple candidates and send a single request to partners." }) },
        ]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Talent Pool" value={totalTalent} icon={<Users className="h-5 w-5" />} tone="brand" hint="Partner-trained" />
        <StatCard label="Open to Work" value={openCount} icon={<Briefcase className="h-5 w-5" />} tone="success" hint={`${Math.round((openCount / totalTalent) * 100)}% available`} />
        <StatCard label="Avg Match Score" value={avgMatch} icon={<Sparkles className="h-5 w-5" />} tone="default" hint="Across all candidates" />
        <StatCard label="Partner Sources" value={partnerCount} icon={<GraduationCap className="h-5 w-5" />} tone="default" hint="Centres & colleges" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Filters sidebar */}
        <Card className="h-fit p-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filters</h3>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => {
              setPartnerFilter("all"); setProgramFilter("all"); setCertFilter("all"); setLocationFilter("all"); setOpenToWorkOnly(false); setSearch("");
            }}>
              Reset
            </Button>
          </div>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skills, names…" className="h-9 pl-8" />
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Partner</label>
              <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                <SelectTrigger className="mt-1 h-9"><SelectValue placeholder="All partners" /></SelectTrigger>
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
                <SelectTrigger className="mt-1 h-9"><SelectValue placeholder="All programs" /></SelectTrigger>
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
                <SelectTrigger className="mt-1 h-9"><SelectValue placeholder="All certifications" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certifications</SelectItem>
                  {CERT_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="mt-1 h-9"><SelectValue placeholder="All locations" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {LOCATION_OPTIONS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
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
          title="Available Talent"
          description={`${filtered.length} candidates match your filters`}
        >
          {filtered.length === 0 ? (
            <EmptyState icon={<Users className="h-5 w-5" />} title="No candidates match" description="Try widening your filters or clearing the search." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((t) => (
                <Card
                  key={t.id}
                  className="cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                  onClick={() => setSelected(t)}
                >
                  <div className="flex items-start gap-3">
                    <AvatarLogo text={t.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-medium">{t.name}</span>
                            <Badge variant="outline" className="gap-1 border-brand/30 bg-brand/5 text-brand">
                              <BadgeCheck className="h-3 w-3" />Partner-trained
                            </Badge>
                          </div>
                          <div className="mt-0.5 truncate text-xs text-muted-foreground">{t.programName}</div>
                        </div>
                        <MatchScore score={t.matchScore} />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><GraduationCap className="h-3 w-3" />{t.partnerName}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{t.city}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {t.skills.slice(0, 4).map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        ))}
                        {t.skills.length > 4 ? (
                          <Badge variant="outline" className="text-[10px]">+{t.skills.length - 4}</Badge>
                        ) : null}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{t.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">· {t.experienceYears}y exp</span>
                        </span>
                        {t.openToWork ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Open to work</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Placed</Badge>
                        )}
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
            <TalentDetail talent={selected} onRequest={() => handleRequest(selected)} />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function TalentDetail({ talent, onRequest }: { talent: PartnerTrainedTalent; onRequest: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="px-6 pt-6">
        <div className="flex items-start gap-4">
          <AvatarLogo text={talent.name} size="xl" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl">{talent.name}</SheetTitle>
            <SheetDescription className="mt-1">
              {talent.currentRole ?? "Recent graduate"} · {talent.experienceYears}y experience
            </SheetDescription>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1 border-brand/30 bg-brand/5 text-brand">
                <BadgeCheck className="h-3 w-3" />Partner-trained
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Award className="h-3 w-3" />Certified
              </Badge>
              {talent.openToWork ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Open to work</Badge>
              ) : (
                <Badge variant="outline">Placed</Badge>
              )}
            </div>
          </div>
          <MatchScore score={talent.matchScore} />
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto scroll-thin px-6 pb-6">
        {/* Quick facts */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MiniField icon={<GraduationCap className="h-3.5 w-3.5" />} label="Partner" value={talent.partnerName} />
          <MiniField icon={<Award className="h-3.5 w-3.5" />} label="Certification" value={talent.certification} />
          <MiniField icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={`${talent.city}, ${talent.state}`} />
        </div>

        {/* Training details */}
        <Card className="mt-5 p-4">
          <h3 className="text-sm font-semibold">Training Details</h3>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Program" value={talent.programName} />
            <Row label="Partner model" value={MODEL_LABELS[talent.partnerModel as keyof typeof MODEL_LABELS] ?? talent.partnerModel} />
            {talent.centreName ? <Row label="Training centre" value={talent.centreName} /> : null}
            {talent.batch ? <Row label="Batch" value={talent.batch} /> : null}
            <Row label="Completed" value={talent.completedAt} />
            <Row label="Candidate rating" value={`${talent.rating.toFixed(1)} / 5`} />
          </div>
        </Card>

        {/* Skills */}
        <Card className="mt-4 p-4">
          <h3 className="text-sm font-semibold">Verified Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {talent.skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1">
                <BadgeCheck className="h-3 w-3 text-emerald-600" />{s}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Skills verified through partner assessments and certifications.</p>
        </Card>

        {/* Match analysis */}
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Match Analysis</h3>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />Simulated AI
            </Badge>
          </div>
          <div className="mt-3 space-y-2">
            <MatchBar label="Skills alignment" value={talent.matchScore} />
            <MatchBar label="Certification relevance" value={Math.min(100, talent.matchScore + 5)} />
            <MatchBar label="Location fit" value={Math.max(60, talent.matchScore - 10)} />
            <MatchBar label="Experience match" value={Math.max(50, talent.matchScore - 15)} />
          </div>
        </Card>

        <Button className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700" onClick={onRequest}>
          <Send className="mr-2 h-4 w-4" />Request Candidate
        </Button>
        <Button variant="outline" className="mt-2 w-full" onClick={() => toast.info("Saved to shortlist", { description: `${talent.name} added to your partner-talent shortlist.` })}>
          Add to Shortlist
        </Button>
      </div>
    </div>
  );
}

function MiniField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed pb-1.5 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function MatchBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <Progress value={value} className="mt-1 h-1.5" />
    </div>
  );
}
