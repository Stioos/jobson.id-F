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
  Users,
  Search,
  GraduationCap,
  MapPin,
  Star,
  Building2,
  Handshake,
  Briefcase,
  Network,
  Mail,
  Phone,
  Send,
  Award,
} from "lucide-react";
import { partners, jobOrders, colleges, trainingCentres, MODEL_LABELS } from "@/lib/partner-data";
import type { Partner, PartnerModel } from "@/lib/partner-types";
import { formatNumber, formatDate } from "@/lib/format";

// Recruitment-relevant partner models: CENTRE, COLLEGE, RECRUITMENT
const RELEVANT_MODELS: PartnerModel[] = ["CENTRE", "COLLEGE", "RECRUITMENT"];

// Mock open mandates per partner (recruitment-relevant)
const PARTNER_OPEN_MANDATES: Record<string, number> = {
  ptn_001: 3,
  ptn_002: 1,
  ptn_003: 4,
  ptn_007: 5,
};

// Mock placements count per partner
const PARTNER_PLACEMENTS: Record<string, number> = {
  ptn_001: 320,
  ptn_002: 180,
  ptn_003: 620,
  ptn_007: 145,
};

export function RecruiterPartnerNetwork() {
  const [search, setSearch] = React.useState("");
  const [modelFilter, setModelFilter] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<Partner | null>(null);

  const recruitmentPartners = React.useMemo(() => {
    return partners
      .filter((p) => RELEVANT_MODELS.includes(p.model))
      .filter((p) => {
        if (modelFilter !== "all" && p.model !== modelFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          if (!p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !(p.specialities ?? []).some((s) => s.toLowerCase().includes(q))) return false;
        }
        return true;
      });
  }, [search, modelFilter]);

  // Stats
  const totalPartners = partners.filter((p) => RELEVANT_MODELS.includes(p.model)).length;
  const totalStudents = partners.filter((p) => RELEVANT_MODELS.includes(p.model)).reduce((s, p) => s + p.studentsEnrolled, 0);
  const totalPlacements = Object.values(PARTNER_PLACEMENTS).reduce((s, v) => s + v, 0);
  const totalMandates = Object.values(PARTNER_OPEN_MANDATES).reduce((s, v) => s + v, 0);

  const handleConnect = (partner: Partner) => {
    toast.success(`Connection request sent to ${partner.name}`, {
      description: `${partner.contactName} will receive your request. You'll be able to share mandates and source candidates once connected.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Network"
        description="Connect with JOBSONN franchise partners — centres, colleges, and recruitment partners — to source candidates and share mandates."
        icon={<Network className="h-6 w-6" />}
        breadcrumbs={[{ label: "Talent & Sourcing" }, { label: "Partner Network" }]}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Network Partners" value={totalPartners} icon={<Network className="h-5 w-5" />} tone="brand" hint="Centre · College · Recruitment" />
        <StatCard label="Students Trained" value={formatNumber(totalStudents)} icon={<GraduationCap className="h-5 w-5" />} tone="default" hint="Across network" />
        <StatCard label="Placements" value={formatNumber(totalPlacements)} icon={<Handshake className="h-5 w-5" />} tone="success" hint="Via partners" />
        <StatCard label="Open Mandates" value={totalMandates} icon={<Briefcase className="h-5 w-5" />} tone="default" hint="Shared by partners" />
      </section>

      <SectionCard
        title="Recruitment-Relevant Partners"
        description={`${recruitmentPartners.length} partners available for collaboration`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search partners…" className="h-9 w-48 pl-8" />
            </div>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Model" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                <SelectItem value="CENTRE">Training Centre</SelectItem>
                <SelectItem value="COLLEGE">College / University</SelectItem>
                <SelectItem value="RECRUITMENT">Recruitment Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {recruitmentPartners.length === 0 ? (
          <EmptyState icon={<Network className="h-5 w-5" />} title="No partners match" description="Try a different filter or search term." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recruitmentPartners.map((p) => {
              const placements = PARTNER_PLACEMENTS[p.id] ?? 0;
              const openMandates = PARTNER_OPEN_MANDATES[p.id] ?? 0;
              return (
                <Card
                  key={p.id}
                  className="cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                  onClick={() => setSelected(p)}
                >
                  <div className="flex items-start gap-3">
                    <AvatarLogo text={p.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{p.name}</div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <StatusBadge status={p.model.toLowerCase()} />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{p.city}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-foreground">{p.rating.toFixed(1)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {(p.specialities ?? []).length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(p.specialities ?? []).slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                      {(p.specialities ?? []).length > 3 ? (
                        <Badge variant="outline" className="text-[10px]">+{(p.specialities ?? []).length - 3}</Badge>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="rounded-md bg-muted/30 p-1.5">
                      <div className="font-semibold tabular-nums">{p.studentsEnrolled > 0 ? formatNumber(p.studentsEnrolled) : "—"}</div>
                      <div className="text-[10px] text-muted-foreground">Students</div>
                    </div>
                    <div className="rounded-md bg-muted/30 p-1.5">
                      <div className="font-semibold tabular-nums">{placements > 0 ? formatNumber(placements) : "—"}</div>
                      <div className="text-[10px] text-muted-foreground">Placed</div>
                    </div>
                    <div className="rounded-md bg-muted/30 p-1.5">
                      <div className="font-semibold tabular-nums">{openMandates}</div>
                      <div className="text-[10px] text-muted-foreground">Mandates</div>
                    </div>
                  </div>
                  <Button className="mt-3 w-full" size="sm" onClick={(e) => { e.stopPropagation(); handleConnect(p); }}>
                    <Send className="mr-1.5 h-3.5 w-3.5" />Connect with Partner
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Partner detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {selected ? (
            <PartnerDetail partner={selected} onConnect={() => handleConnect(selected)} />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PartnerDetail({ partner, onConnect }: { partner: Partner; onConnect: () => void }) {
  const partnerColleges = colleges.filter((c) => c.partnerId === partner.id);
  const partnerCentres = trainingCentres.filter((c) => c.partnerId === partner.id);
  const partnerJobOrders = jobOrders.filter((j) => j.assignedRecruiter === partner.contactName || j.clientName === partner.name);
  const placements = PARTNER_PLACEMENTS[partner.id] ?? 0;
  const openMandates = PARTNER_OPEN_MANDATES[partner.id] ?? 0;

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="px-6 pt-6">
        <div className="flex items-start gap-4">
          <AvatarLogo text={partner.name} size="xl" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl">{partner.name}</SheetTitle>
            <SheetDescription className="mt-1">{partner.legalName}</SheetDescription>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={partner.model.toLowerCase()} />
              <Badge variant="outline" className="capitalize">{partner.tier}</Badge>
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{partner.rating.toFixed(1)}
              </Badge>
            </div>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto scroll-thin px-6 pb-6">
        {/* Quick stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat icon={<GraduationCap className="h-4 w-4" />} label="Students" value={partner.studentsEnrolled > 0 ? formatNumber(partner.studentsEnrolled) : "—"} />
          <MiniStat icon={<Handshake className="h-4 w-4" />} label="Placements" value={placements > 0 ? formatNumber(placements) : "—"} />
          <MiniStat icon={<Briefcase className="h-4 w-4" />} label="Open Mandates" value={`${openMandates}`} />
          <MiniStat icon={<Building2 className="h-4 w-4" />} label="Joined" value={formatDate(partner.joinedAt, { month: "short", year: "numeric" })} />
        </div>

        {/* Contact info */}
        <Card className="mt-5 p-4">
          <h3 className="text-sm font-semibold">Contact</h3>
          <div className="mt-3 space-y-2 text-sm">
            <ContactRow icon={<Users className="h-3.5 w-3.5" />} label="Primary Contact" value={partner.contactName} />
            <ContactRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={partner.contactEmail} />
            <ContactRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={partner.contactPhone} />
            <ContactRow icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={`${partner.city}, ${partner.state}`} />
          </div>
        </Card>

        {/* Specialities */}
        {partner.specialities && partner.specialities.length > 0 ? (
          <Card className="mt-4 p-4">
            <h3 className="text-sm font-semibold">Specialities</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {partner.specialities.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </Card>
        ) : null}

        {/* Centres (if applicable) */}
        {partnerCentres.length > 0 ? (
          <Card className="mt-4 p-4">
            <h3 className="text-sm font-semibold">Training Centres ({partnerCentres.length})</h3>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto scroll-thin">
              {partnerCentres.map((c) => (
                <div key={c.id} className="rounded-md border p-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.city} · {c.code}</div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {/* Colleges (if applicable) */}
        {partnerColleges.length > 0 ? (
          <Card className="mt-4 p-4">
            <h3 className="text-sm font-semibold">Colleges ({partnerColleges.length})</h3>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto scroll-thin">
              {partnerColleges.map((c) => (
                <div key={c.id} className="rounded-md border p-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.city} · {c.accreditation}</div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Students: <span className="font-medium text-foreground">{formatNumber(c.totalStudents)}</span></span>
                    <span>·</span>
                    <span>Placement rate: <span className="font-medium text-foreground">{c.placementRate}%</span></span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {/* Active mandates */}
        {partnerJobOrders.length > 0 ? (
          <Card className="mt-4 p-4">
            <h3 className="text-sm font-semibold">Active Mandates ({partnerJobOrders.length})</h3>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto scroll-thin">
              {partnerJobOrders.map((j) => (
                <div key={j.id} className="rounded-md border p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{j.title}</div>
                      <div className="text-xs text-muted-foreground">{j.clientName} · {j.location}</div>
                    </div>
                    <StatusBadge status={j.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {/* Accreditations */}
        {partner.accreditation && partner.accreditation.length > 0 ? (
          <Card className="mt-4 p-4">
            <h3 className="text-sm font-semibold">Accreditations</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {partner.accreditation.map((a) => (
                <Badge key={a} variant="outline" className="gap-1">
                  <Award className="h-3 w-3" />{a}
                </Badge>
              ))}
            </div>
          </Card>
        ) : null}

        <Button className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700" onClick={onConnect}>
          <Send className="mr-2 h-4 w-4" />Connect with Partner
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

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="ml-auto text-sm font-medium">{value}</span>
    </div>
  );
}
