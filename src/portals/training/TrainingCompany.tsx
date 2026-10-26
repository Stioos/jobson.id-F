"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { trainingCompany } from "@/lib/lms-data";
import type { TrainingCompany } from "@/lib/types";
import { PageHeader, SectionCard, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  Building2, Star, Users, BookOpen, GraduationCap, Plus, X,
  Save, BadgeCheck, Mail, Phone, Globe, MapPin, Calendar,
} from "lucide-react";

export function TrainingCompany() {
  const [company, setCompany] = React.useState<TrainingCompany>(trainingCompany);
  const [specialtyInput, setSpecialtyInput] = React.useState("");
  const [accreditationInput, setAccreditationInput] = React.useState("");
  const [dirty, setDirty] = React.useState(false);

  const completeness = React.useMemo(() => {
    const fields = [
      !!company.name, !!company.tagline, !!company.about, !!company.website,
      !!company.contactEmail, !!company.contactPhone, !!company.headquarters,
      !!company.gstin, company.specialties.length > 0, company.accreditation.length > 0,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [company]);

  function update<K extends keyof TrainingCompany>(key: K, value: TrainingCompany[K]) {
    setCompany((c) => ({ ...c, [key]: value }));
    setDirty(true);
  }

  function addSpecialty() {
    const v = specialtyInput.trim();
    if (!v) return;
    if (company.specialties.includes(v)) {
      toast.error("Specialty already exists");
      return;
    }
    update("specialties", [...company.specialties, v]);
    setSpecialtyInput("");
  }

  function addAccreditation() {
    const v = accreditationInput.trim();
    if (!v) return;
    if (company.accreditation.includes(v)) {
      toast.error("Accreditation already exists");
      return;
    }
    update("accreditation", [...company.accreditation, v]);
    setAccreditationInput("");
  }

  function save() {
    toast.success("Company profile saved", {
      description: "Your changes are now live across the portal.",
    });
    setDirty(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile"
        description="Manage your training company's public profile, contact details, and credentials."
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[
          { label: "Cancel", variant: "outline", onClick: () => { setCompany(trainingCompany); setDirty(false); } },
          { label: dirty ? "Save changes" : "Saved", onClick: dirty ? save : undefined },
        ]}
      />

      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Rating" value={company.rating.toFixed(1)} icon={<Star className="h-5 w-5" />} tone="warning" hint={`${company.reviewCount} reviews`} />
        <StatCard label="Clients" value={company.corporateClients} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Learners" value={company.learnersTrained.toLocaleString("en-IN")} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Courses" value={company.coursesCount} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Trainers" value={company.trainersCount} icon={<GraduationCap className="h-5 w-5" />} tone="brand" />
        <StatCard label="Founded" value={company.founded} icon={<Calendar className="h-5 w-5" />} hint={`${new Date().getFullYear() - company.founded} years`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Basic Information">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <AvatarLogo text={company.logo} size="xl" />
                <div className="flex-1">
                  <Label htmlFor="logo">Logo initials</Label>
                  <Input id="logo" value={company.logo} maxLength={3} onChange={(e) => update("logo", e.target.value.toUpperCase())} className="mt-1 max-w-[120px]" />
                  <p className="mt-1 text-xs text-muted-foreground">2-3 letter initials used in the avatar.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Company name</Label>
                  <Input id="name" value={company.name} onChange={(e) => update("name", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="founded">Founded year</Label>
                  <Input id="founded" type="number" value={company.founded} onChange={(e) => update("founded", Number(e.target.value))} className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" value={company.tagline} onChange={(e) => update("tagline", e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="about">About</Label>
                <Textarea id="about" value={company.about} onChange={(e) => update("about", e.target.value)} className="mt-1 min-h-[120px]" />
              </div>

              <div>
                <Label htmlFor="hq">Headquarters</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="hq" value={company.headquarters} onChange={(e) => update("headquarters", e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Specialties" description="Areas of training expertise">
            <div className="flex flex-wrap gap-2 mb-3">
              {company.specialties.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1 pr-1">
                  {s}
                  <button onClick={() => update("specialties", company.specialties.filter((x) => x !== s))} className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {company.specialties.length === 0 && <p className="text-sm text-muted-foreground">No specialties added.</p>}
            </div>
            <div className="flex gap-2">
              <Input
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpecialty(); } }}
                placeholder="e.g. Cloud & DevOps"
              />
              <Button variant="outline" onClick={addSpecialty}><Plus className="h-4 w-4" /></Button>
            </div>
          </SectionCard>

          <SectionCard title="Accreditation & Certifications" description="Industry credentials and approvals">
            <div className="flex flex-wrap gap-2 mb-3">
              {company.accreditation.map((a) => (
                <Badge key={a} variant="secondary" className="gap-1 pr-1">
                  <BadgeCheck className="h-3 w-3 text-emerald-500" />
                  {a}
                  <button onClick={() => update("accreditation", company.accreditation.filter((x) => x !== a))} className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {company.accreditation.length === 0 && <p className="text-sm text-muted-foreground">No accreditations added.</p>}
            </div>
            <div className="flex gap-2">
              <Input
                value={accreditationInput}
                onChange={(e) => setAccreditationInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAccreditation(); } }}
                placeholder="e.g. NSDC Approved"
              />
              <Button variant="outline" onClick={addAccreditation}><Plus className="h-4 w-4" /></Button>
            </div>
          </SectionCard>
        </div>

        {/* Right: contact + completeness */}
        <div className="space-y-4">
          <SectionCard title="Contact Information">
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={company.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} className="pl-9" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" value={company.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} className="pl-9" />
                </div>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="website" value={company.website} onChange={(e) => update("website", e.target.value)} className="pl-9" />
                </div>
              </div>
              <div>
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" value={company.gstin ?? ""} onChange={(e) => update("gstin", e.target.value)} className="mt-1" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Profile Completeness">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Complete</span>
                <span className="font-semibold">{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completeness === 100
                  ? "Your profile is complete. Excellent!"
                  : "Add the missing fields to improve visibility in the marketplace."}
              </p>
              <Button variant="outline" className="w-full" onClick={save} disabled={!dirty}>
                <Save className="mr-2 h-4 w-4" />
                {dirty ? "Save changes" : "All changes saved"}
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Public Profile Preview">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <AvatarLogo text={company.logo} size="lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="truncate font-semibold">{company.name}</p>
                    {company.verified && <BadgeCheck className="h-4 w-4 text-brand" />}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{company.tagline}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-xs text-muted-foreground">{company.about}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {company.specialties.slice(0, 4).map((s) => (
                  <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{company.rating}</span>
                <span>·</span>
                <span>{company.corporateClients} clients</span>
                <span>·</span>
                <span>{company.headquarters}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
