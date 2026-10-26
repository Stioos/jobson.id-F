"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import type { Partner, CapabilityState } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Building2, Save, BadgeCheck, Plus, X, Award, Calendar, ShieldCheck } from "lucide-react";

const CAPABILITY_LABELS: Record<keyof Partner["capabilities"], string> = {
  centreManagement: "Centre Management",
  centreInspection: "Centre Inspection",
  infrastructure: "Infrastructure",
  physicalTraining: "Physical Training",
  localDelivery: "Local Delivery",
  serviceDelivery: "Service Delivery",
  leadGeneration: "Lead Generation",
  counselling: "Counselling",
  admissions: "Admissions",
  referrals: "Referrals",
  marketing: "Marketing",
  wallet: "Wallet",
  settlements: "Settlements",
  lmsAccess: "LMS Access",
  certificationAccess: "Certification Access",
};

function capabilityTone(s: CapabilityState) {
  if (s === "ENABLED") return "success";
  if (s === "DISABLED") return "default";
  return "warning";
}

export function PartnerProfile() {
  const partner = CURRENT_PARTNER;
  const [form, setForm] = React.useState({
    name: partner.name,
    legalName: partner.legalName,
    contactName: partner.contactName,
    contactEmail: partner.contactEmail,
    contactPhone: partner.contactPhone,
    city: partner.city,
    state: partner.state,
    territory: partner.territory ?? "",
    specialities: partner.specialities ?? [],
    accreditation: partner.accreditation ?? [],
  });
  const [newSpeciality, setNewSpeciality] = React.useState("");
  const [newAccreditation, setNewAccreditation] = React.useState("");

  // Profile completeness: count non-empty fields
  const fields = [
    form.name, form.legalName, form.contactName, form.contactEmail, form.contactPhone,
    form.city, form.state, form.territory, form.specialities.join(","), form.accreditation.join(","),
  ];
  const completeness = Math.round((fields.filter((f) => f && f.trim().length > 0).length / fields.length) * 100);

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSpeciality() {
    if (!newSpeciality.trim()) return;
    update("specialities", [...form.specialities, newSpeciality.trim()]);
    setNewSpeciality("");
  }
  function removeSpeciality(s: string) {
    update("specialities", form.specialities.filter((x) => x !== s));
  }
  function addAccreditation() {
    if (!newAccreditation.trim()) return;
    update("accreditation", [...form.accreditation, newAccreditation.trim()]);
    setNewAccreditation("");
  }
  function removeAccreditation(a: string) {
    update("accreditation", form.accreditation.filter((x) => x !== a));
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Profile saved", { description: `${form.name} · ${form.city}, ${form.state}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Profile"
        description={`${partner.name} — franchise profile, capabilities, and agreement details.`}
        icon={<Icon name="Building2" className="h-6 w-6" />}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Partner Model" value={partner.model} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Tier" value={partner.tier} icon={<Award className="h-5 w-5" />} tone="warning" />
        <StatCard label="Status" value={partner.status} icon={<ShieldCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Rating" value={`${partner.rating} ★`} icon={<BadgeCheck className="h-5 w-5" />} />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile Completeness</CardTitle>
            <CardDescription>Keep your profile up-to-date for higher visibility.</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={completeness} className="h-2" />
            <p className="mt-2 text-sm text-muted-foreground">{completeness}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="legalName">Legal Name</Label>
                <Input id="legalName" value={form.legalName} onChange={(e) => update("legalName", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="contactName">Contact Person</Label>
                <Input id="contactName" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">Email</Label>
                <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input id="contactPhone" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state} onChange={(e) => update("state", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="territory">Territory</Label>
                <Input id="territory" value={form.territory} onChange={(e) => update("territory", e.target.value)} placeholder="e.g. Chennai East" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Specialities & Accreditation</CardTitle>
            <CardDescription>Tags that show up on your public profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Specialities</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.specialities.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 rounded-md border border-brand/30 bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
                    {s}
                    <button type="button" onClick={() => removeSpeciality(s)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {form.specialities.length === 0 && <p className="text-xs text-muted-foreground">No specialities added.</p>}
              </div>
              <div className="mt-2 flex gap-2">
                <Input value={newSpeciality} onChange={(e) => setNewSpeciality(e.target.value)} placeholder="Add speciality…" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpeciality(); } }} />
                <Button type="button" variant="outline" onClick={addSpeciality}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div>
              <Label className="text-sm">Accreditation</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.accreditation.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <BadgeCheck className="h-3 w-3" /> {a}
                    <button type="button" onClick={() => removeAccreditation(a)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {form.accreditation.length === 0 && <p className="text-xs text-muted-foreground">No accreditation added.</p>}
              </div>
              <div className="mt-2 flex gap-2">
                <Input value={newAccreditation} onChange={(e) => setNewAccreditation(e.target.value)} placeholder="Add accreditation…" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAccreditation(); } }} />
                <Button type="button" variant="outline" onClick={addAccreditation}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capabilities matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Capabilities Matrix</CardTitle>
            <CardDescription>What your partnership model allows. Switch model → contact partnership team.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(CAPABILITY_LABELS) as (keyof Partner["capabilities"])[]).map((cap) => {
                const state = partner.capabilities[cap];
                return (
                  <div key={cap} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm font-medium">{CAPABILITY_LABELS[cap]}</span>
                    <StatusBadge status={state.toLowerCase()} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Agreement details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agreement Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Agreement Start</p>
                <p className="mt-1 text-sm font-medium flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDate(partner.agreementStart)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Agreement End</p>
                <p className="mt-1 text-sm font-medium flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDate(partner.agreementEnd)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Tier</p>
                <p className="mt-1 text-sm font-semibold capitalize text-brand">{partner.tier}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Established</p>
                <p className="mt-1 text-sm font-medium">{partner.establishedYear}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              To switch partner model or upgrade tier, please contact the partnership team at <span className="font-medium text-brand">partnerships@jobsonn.com</span>.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => toast.info("Reset to original values", { description: "Reload page to revert" })}>Reset</Button>
          <Button type="submit"><Save className="h-4 w-4 mr-2" /> Save Profile</Button>
        </div>
      </form>
    </div>
  );
}
