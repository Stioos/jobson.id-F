"use client";

import * as React from "react";
import { Building2, CheckCircle2, Save, Plus, X, Upload } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { agencies } from "@/lib/mock-data";
import { clientAgreements } from "@/lib/portal-data";

export function AgencyProfile() {
  const agency = agencies[0];
  const [name, setName] = React.useState(agency.name);
  const [description, setDescription] = React.useState(agency.description);
  const [defaultRate, setDefaultRate] = React.useState(agency.commissionRateDefault.toString());
  const [specialties, setSpecialties] = React.useState<string[]>(agency.specialties);
  const [newSpecialty, setNewSpecialty] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("ops@talentbridge.in");
  const [contactPhone, setContactPhone] = React.useState("+91 80 4567 8901");
  const [website, setWebsite] = React.useState("https://talentbridge.in");
  const [gstin, setGstin] = React.useState("29TBCON1234F1Z5");
  const [agreementTemplate, setAgreementTemplate] = React.useState(
    "TalentBridge Consulting will provide recruitment services to {{client}} on an exclusive basis. Commission: {{rate}}% of first-year CTC. Guarantee: 90 days. Payment terms: Net 30 from candidate joining date."
  );

  // ---- Profile completeness (computed live) ----
  const completeness = React.useMemo(() => {
    const checks: boolean[] = [
      !!name.trim(),
      !!description.trim() && description.trim().length >= 20,
      !!defaultRate && !isNaN(parseFloat(defaultRate)) && parseFloat(defaultRate) > 0,
      specialties.length >= 3,
      !!contactEmail.trim() && /.+@.+\..+/.test(contactEmail),
      !!contactPhone.trim(),
      !!website.trim(),
      !!gstin.trim(),
      agreementTemplate.includes("{{client}}") && agreementTemplate.includes("{{rate}}"),
    ];
    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  }, [name, description, defaultRate, specialties, contactEmail, contactPhone, website, gstin, agreementTemplate]);

  const missing: string[] = React.useMemo(() => {
    const m: string[] = [];
    if (!name.trim()) m.push("Agency name");
    if (!description.trim() || description.trim().length < 20) m.push("Description (min 20 chars)");
    if (!defaultRate || isNaN(parseFloat(defaultRate)) || parseFloat(defaultRate) <= 0) m.push("Default commission rate");
    if (specialties.length < 3) m.push("At least 3 specialties");
    if (!contactEmail.trim() || !/.+@.+\..+/.test(contactEmail)) m.push("Valid contact email");
    if (!contactPhone.trim()) m.push("Contact phone");
    if (!website.trim()) m.push("Website");
    if (!gstin.trim()) m.push("GSTIN");
    if (!agreementTemplate.includes("{{client}}") || !agreementTemplate.includes("{{rate}}")) m.push("Agreement template placeholders");
    return m;
  }, [name, description, defaultRate, specialties, contactEmail, contactPhone, website, gstin, agreementTemplate]);

  const addSpecialty = () => {
    const s = newSpecialty.trim();
    if (!s) return;
    if (specialties.includes(s)) {
      toast.error("Specialty already added");
      return;
    }
    setSpecialties((prev) => [...prev, s]);
    setNewSpecialty("");
  };

  const saveAll = () => {
    if (completeness < 60) {
      toast.error("Profile incomplete", { description: `Fill in: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "…" : ""}` });
      return;
    }
    toast.success("Agency profile saved", { description: `${completeness}% complete` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agency profile"
        description="Manage your agency's public profile, specialties, and agreement defaults. Changes are visible to clients and recruiters."
        actions={[{ label: "Save changes", onClick: saveAll }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Recruiters" value={agency.recruiterCount} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Clients" value={agency.clientCount} icon={<Building2 className="h-5 w-5" />} tone="default" />
        <StatCard label="Placements (all-time)" value={agency.placementCount} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Rating" value={`${agency.rating} ★`} icon={<Building2 className="h-5 w-5" />} tone="warning" />
      </div>

      {/* Profile completeness */}
      <SectionCard
        title="Profile completeness"
        description="Complete profiles earn more client trust and rank higher in agency search."
        action={<Badge className={completeness >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : completeness >= 60 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"}>{completeness}%</Badge>}
      >
        <Progress value={completeness} className="h-2" />
        {missing.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {missing.map((m) => (
              <Badge key={m} variant="outline" className="bg-amber-500/5 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[10px]">{m}</Badge>
            ))}
          </div>
        ) : (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Profile complete. Your agency is fully discoverable by clients.
          </p>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Identity" className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <AvatarLogo text={agency.name} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold">{agency.name}</p>
                {agency.verified && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle2 className="mr-1 h-3 w-3" /> Verified</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">Slug: {agency.slug}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.success("Logo upload dialog opened")}>
                <Upload className="mr-1 h-3.5 w-3.5" /> Change logo
              </Button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="a-name">Agency name</Label>
              <Input id="a-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="a-rate">Default commission rate (%)</Label>
              <Input id="a-rate" type="number" step="0.01" value={defaultRate} onChange={(e) => setDefaultRate(e.target.value)} />
              <p className="mt-1 text-[11px] text-muted-foreground">Used as default for new agreements — configurable per client.</p>
            </div>
          </div>
          <div className="mt-3">
            <Label htmlFor="a-desc">Description</Label>
            <Textarea id="a-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="mt-3">
            <Label>Specialties</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {specialties.map((s) => (
                <Badge key={s} variant="outline" className="gap-1">
                  {s}
                  <button onClick={() => setSpecialties((prev) => prev.filter((x) => x !== s))} aria-label={`Remove ${s}`}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {specialties.length === 0 && <p className="text-xs text-muted-foreground">No specialties added.</p>}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Add specialty (e.g. Healthcare)"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                className="h-8"
              />
              <Button size="sm" variant="outline" onClick={addSpecialty}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Verification & contact">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Verification status</p>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Verified</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">GSTIN verified · Business registration confirmed.</p>
          </div>
          <div className="mt-3 space-y-2">
            <div>
              <Label htmlFor="a-website">Website</Label>
              <Input id="a-website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="a-gstin">GSTIN</Label>
              <Input id="a-gstin" value={gstin} onChange={(e) => setGstin(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="a-email">Operations email</Label>
              <Input id="a-email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="a-phone">Phone</Label>
              <Input id="a-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
          </div>
          <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => toast.success("Re-verification request submitted")}>
            Request re-verification
          </Button>
        </SectionCard>
      </div>

      <SectionCard title="Agreement template" description="Default template applied to new client agreements. Use {{client}} and {{rate}} placeholders.">
        <Textarea value={agreementTemplate} onChange={(e) => setAgreementTemplate(e.target.value)} rows={5} />
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => toast.success("Preview rendered", { description: "Sample agreement preview generated" })}>Preview</Button>
          <Button onClick={() => toast.success("Agreement template saved")}><Save className="mr-1 h-4 w-4" /> Save template</Button>
        </div>
      </SectionCard>

      <SectionCard title="Active agreements snapshot" description="Per-client commission rates set on each agreement.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="py-2 text-left font-medium">Client</th>
                <th className="text-center font-medium">Status</th>
                <th className="text-center font-medium">Commission</th>
                <th className="text-center font-medium">Payment terms</th>
                <th className="text-center font-medium">Guarantee</th>
              </tr>
            </thead>
            <tbody>
              {clientAgreements.map((c) => (
                <tr key={c.employerId} className="border-b last:border-0">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={c.employerName} size="xs" />
                      <span className="font-medium">{c.employerName}</span>
                    </div>
                  </td>
                  <td className="text-center"><Badge variant="outline" className="capitalize">{c.status}</Badge></td>
                  <td className="text-center font-semibold">{c.commissionRate}%</td>
                  <td className="text-center uppercase text-xs">{c.paymentTerms.replace("_", " ")}</td>
                  <td className="text-center text-xs">{c.guaranteePeriodDays}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Rates above are per-agreement. They are configurable per client and subject to legal &amp; accounting review — never universal across all clients.
        </p>
      </SectionCard>
    </div>
  );
}

