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
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  GraduationCap,
  Search,
  MapPin,
  Star,
  Building2,
  Award,
  Clock,
  Users,
  Send,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { partners, trainingCentres, programs, batches, MODEL_LABELS } from "@/lib/partner-data";
import type { TrainingCentre, Program } from "@/lib/partner-types";
import { formatCurrency } from "@/lib/format";

// Synthesize centre-to-program mapping with batches for richer data
interface CentreWithPrograms extends TrainingCentre {
  offeredPrograms: Program[];
}

const CENTRES_WITH_PROGRAMS: CentreWithPrograms[] = trainingCentres.map((c) => {
  // Centres usually offer programs matching their specialities — synthesize from batches
  const centreBatches = batches.filter((b) => b.centreId === c.id);
  const programNames = Array.from(new Set(centreBatches.map((b) => b.programName)));
  const offeredPrograms = programNames
    .map((pn) => programs.find((p) => p.name === pn))
    .filter((p): p is Program => !!p);
  // Fallback: if no batches mapped, offer first 4 programs
  const finalPrograms = offeredPrograms.length > 0 ? offeredPrograms : programs.slice(0, 4);
  return { ...c, offeredPrograms: finalPrograms };
});

const CATEGORY_OPTIONS = Array.from(new Set(programs.map((p) => p.category)));
const LOCATION_OPTIONS = Array.from(new Set(trainingCentres.map((c) => c.city)));

export function CandidatePartnerCourses() {
  const [search, setSearch] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [selectedCentre, setSelectedCentre] = React.useState<CentreWithPrograms | null>(null);

  const totalCentres = trainingCentres.length;
  const totalPrograms = programs.length;
  const avgRating = trainingCentres.length > 0
    ? (trainingCentres.reduce((s, c) => s + c.rating, 0) / trainingCentres.length).toFixed(1)
    : "0";
  const totalEnrolled = trainingCentres.reduce((s, c) => s + c.studentsEnrolled, 0);

  // Filter centres
  const filteredCentres = React.useMemo(() => {
    return CENTRES_WITH_PROGRAMS.filter((c) => {
      if (locationFilter !== "all" && c.city !== locationFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.partnerName.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, locationFilter]);

  // Filter programs (for program cards section)
  const filteredPrograms = React.useMemo(() => {
    return programs.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.targetRoles.some((r) => r.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [search, categoryFilter]);

  // Find a partner centre offering this program (for program cards)
  const findCentreForProgram = (program: Program): CentreWithPrograms | undefined => {
    return CENTRES_WITH_PROGRAMS.find((c) => c.offeredPrograms.some((p) => p.id === program.id));
  };

  const handleEnquire = (centre: CentreWithPrograms) => {
    toast.success(`Enquiry sent to ${centre.name}`, {
      description: `${centre.partnerName} will contact you within 24 hours with batch schedules and fees.`,
    });
  };

  const handleEnroll = (program: Program, centre?: CentreWithPrograms) => {
    toast.success(`Enrollment request submitted`, {
      description: `${program.name}${centre ? ` at ${centre.name}` : ""}. Our admissions team will reach out to confirm your seat.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Training Centres & Courses"
        description="Browse jobson.id partner-operated training centres and enroll in industry-aligned certification programs."
        icon={<GraduationCap className="h-6 w-6" />}
        breadcrumbs={[{ label: "Learning Academy" }, { label: "Partner Courses" }]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Training Centres" value={totalCentres} icon={<Building2 className="h-5 w-5" />} tone="brand" hint="Partner-operated" />
        <StatCard label="Programs Available" value={totalPrograms} icon={<BookOpen className="h-5 w-5" />} tone="default" hint="Across all centres" />
        <StatCard label="Avg Centre Rating" value={avgRating} icon={<Star className="h-5 w-5" />} tone="success" hint="From student reviews" />
        <StatCard label="Students Enrolled" value={totalEnrolled} icon={<Users className="h-5 w-5" />} tone="default" hint="Currently studying" />
      </section>

      {/* Search & filter bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search centres, programs, roles…" className="h-9 pl-8" />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {LOCATION_OPTIONS.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="h-9" onClick={() => { setSearch(""); setLocationFilter("all"); setCategoryFilter("all"); }}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Training centres grid */}
      <SectionCard
        title="Partner Training Centres"
        description={`${filteredCentres.length} centres match your filters`}
      >
        {filteredCentres.length === 0 ? (
          <EmptyState icon={<Building2 className="h-5 w-5" />} title="No centres match" description="Try a different location or search term." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCentres.map((c) => (
              <Card
                key={c.id}
                className="cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                onClick={() => setSelectedCentre(c)}
              >
                <div className="flex items-start gap-3">
                  <AvatarLogo text={c.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{c.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{c.partnerName}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />{c.city}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{c.rating.toFixed(1)}</span>
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-3 text-xs text-muted-foreground line-clamp-1">
                  Programs: {c.offeredPrograms.map((p) => p.name).join(", ")}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1 text-center text-xs">
                  <div className="rounded-md bg-muted/30 p-1.5">
                    <div className="font-semibold tabular-nums">{c.studentsEnrolled}</div>
                    <div className="text-[10px] text-muted-foreground">Students</div>
                  </div>
                  <div className="rounded-md bg-muted/30 p-1.5">
                    <div className="font-semibold tabular-nums">{c.batchesActive}</div>
                    <div className="text-[10px] text-muted-foreground">Batches</div>
                  </div>
                  <div className="rounded-md bg-muted/30 p-1.5">
                    <div className="font-semibold tabular-nums">{c.facultyCount}</div>
                    <div className="text-[10px] text-muted-foreground">Faculty</div>
                  </div>
                </div>
                <Button className="mt-3 w-full" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleEnquire(c); }}>
                  <Send className="mr-1.5 h-3.5 w-3.5" />Enquire
                </Button>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Programs grid */}
      <SectionCard
        title="Programs with Partner Affiliation"
        description={`${filteredPrograms.length} programs available across partner centres`}
      >
        {filteredPrograms.length === 0 ? (
          <EmptyState icon={<BookOpen className="h-5 w-5" />} title="No programs match" description="Try a different category." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((p) => {
              const centre = findCentreForProgram(p);
              return (
                <Card key={p.id} className="flex flex-col p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                      <div className="mt-1 truncate font-medium">{p.name}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{p.code}</div>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{centre ? centre.name : "Multiple centres"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3 w-3" />{p.durationWeeks} weeks · {p.deliveryModes.join(", ")}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Award className="h-3 w-3" />
                      <span className="truncate">{p.certifications.join(", ")}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-semibold tabular-nums">{formatCurrency(p.defaultPrice)}</span>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleEnroll(p, centre)}>
                      Enroll
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Centre detail sheet */}
      <Sheet open={!!selectedCentre} onOpenChange={(o) => !o && setSelectedCentre(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {selectedCentre ? (
            <CentreDetail centre={selectedCentre} onEnquire={() => handleEnquire(selectedCentre)} onEnroll={handleEnroll} />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CentreDetail({
  centre,
  onEnquire,
  onEnroll,
}: {
  centre: CentreWithPrograms;
  onEnquire: () => void;
  onEnroll: (p: Program, c?: CentreWithPrograms) => void;
}) {
  const partner = partners.find((p) => p.id === centre.partnerId);
  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="px-6 pt-6">
        <div className="flex items-start gap-4">
          <AvatarLogo text={centre.name} size="xl" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl">{centre.name}</SheetTitle>
            <SheetDescription className="mt-1">
              {centre.partnerName} · Code {centre.code}
            </SheetDescription>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={centre.status} />
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{centre.rating.toFixed(1)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" />{centre.city}
              </Badge>
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto scroll-thin px-6 pb-6">
        {/* Quick stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat icon={<Users className="h-4 w-4" />} label="Enrolled" value={`${centre.studentsEnrolled}`} />
          <MiniStat icon={<BookOpen className="h-4 w-4" />} label="Capacity" value={`${centre.capacity}`} />
          <MiniStat icon={<Users className="h-4 w-4" />} label="Faculty" value={`${centre.facultyCount}`} />
          <MiniStat icon={<CheckCircle2 className="h-4 w-4" />} label="Compliance" value={`${centre.complianceScore}%`} />
        </div>

        {/* Infrastructure */}
        <Card className="mt-5 p-4">
          <h3 className="text-sm font-semibold">Infrastructure</h3>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <div className="text-base font-semibold">{centre.classrooms}</div>
              <div className="text-xs text-muted-foreground">Classrooms</div>
            </div>
            <div>
              <div className="text-base font-semibold">{centre.labs}</div>
              <div className="text-xs text-muted-foreground">Labs</div>
            </div>
            <div>
              <div className="text-base font-semibold">{centre.batchesActive}</div>
              <div className="text-xs text-muted-foreground">Active batches</div>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card className="mt-4 p-4">
          <h3 className="text-sm font-semibold">Address</h3>
          <p className="mt-2 text-sm text-muted-foreground">{centre.address}</p>
          <p className="text-sm text-muted-foreground">{centre.city}, {centre.state}</p>
          {centre.lastInspection ? (
            <p className="mt-2 text-xs text-muted-foreground">Last inspection: {new Date(centre.lastInspection).toLocaleDateString("en-IN")}</p>
          ) : null}
        </Card>

        {/* Partner info */}
        {partner ? (
          <Card className="mt-4 p-4">
            <h3 className="text-sm font-semibold">Partner</h3>
            <div className="mt-2 flex items-center gap-3">
              <AvatarLogo text={partner.name} size="sm" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{partner.name}</div>
                <div className="text-xs text-muted-foreground">{MODEL_LABELS[partner.model]} · {partner.tier}</div>
              </div>
            </div>
          </Card>
        ) : null}

        {/* Programs at this centre */}
        <Card className="mt-4 p-4">
          <h3 className="text-sm font-semibold">Programs at this Centre</h3>
          <div className="mt-3 space-y-2">
            {centre.offeredPrograms.map((p) => (
              <div key={p.id} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{p.durationWeeks} weeks · {p.certifications.join(", ")}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums">{formatCurrency(p.defaultPrice)}</div>
                    <Button size="sm" className="mt-1 h-7 bg-emerald-600 hover:bg-emerald-700" onClick={() => onEnroll(p, centre)}>
                      Enroll
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Button className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700" onClick={onEnquire}>
          <Send className="mr-2 h-4 w-4" />Enquire about this Centre
        </Button>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-1 text-base font-semibold tabular-nums">{value}</div>
    </div>
  );
}
