"use client";

import * as React from "react";
import { employers } from "@/lib/mock-data";
import { PageHeader, SectionCard, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, X, Save, Eye, Upload, Building2, Globe, Linkedin, Twitter } from "lucide-react";

const employer = employers[0];

const INDUSTRIES = ["Information Technology", "Financial Services / Fintech", "Healthcare / HealthTech", "Renewable Energy", "EdTech", "Logistics & Supply Chain"];
const SIZES = ["1-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];

export function EmployerCompanyProfile() {
  const [form, setForm] = React.useState({
    name: employer.name,
    industry: employer.industry,
    size: employer.size,
    founded: String(employer.founded),
    headquarters: employer.headquarters,
    website: employer.website,
    about: employer.about,
    mission: employer.mission,
    benefits: [...employer.benefits],
    culture: [...employer.culture],
    locations: [...employer.locations],
    linkedin: employer.socialLinks?.linkedin ?? "",
    twitter: employer.socialLinks?.twitter ?? "",
  });
  const [saving, setSaving] = React.useState(false);
  const [newBenefit, setNewBenefit] = React.useState("");
  const [newCulture, setNewCulture] = React.useState("");
  const [newLocation, setNewLocation] = React.useState("");

  const completeness = React.useMemo(() => {
    let filled = 0;
    const total = 10;
    if (form.name) filled++;
    if (form.industry) filled++;
    if (form.size) filled++;
    if (form.founded) filled++;
    if (form.headquarters) filled++;
    if (form.website) filled++;
    if (form.about.length > 50) filled++;
    if (form.mission.length > 20) filled++;
    if (form.benefits.length >= 3) filled++;
    if (form.locations.length >= 1) filled++;
    return Math.round((filled / total) * 100);
  }, [form]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Company profile saved", { description: "Your changes are now live on your careers page." });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile"
        description="Manage your public company information visible to candidates"
        actions={[
          { label: "Preview", icon: "Eye", variant: "outline", onClick: () => toast.info("Opening public preview…") },
          { label: "Save changes", icon: "Save", onClick: save },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <SectionCard title="Basic information" description="Core company details">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <AvatarLogo text={employer.logo} size="xl" />
                <div>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Logo upload is a demo UI only.")}>
                    <Upload className="mr-2 h-4 w-4" /> Upload logo
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">PNG/SVG, max 1MB. Square recommended.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Company name</Label>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Industry</Label>
                  <Select value={form.industry} onValueChange={(v) => set("industry", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Company size</Label>
                  <Select value={form.size} onValueChange={(v) => set("size", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Founded year</Label>
                  <Input type="number" value={form.founded} onChange={(e) => set("founded", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Headquarters</Label>
                  <Input value={form.headquarters} onChange={(e) => set("headquarters", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Website</Label>
                  <Input value={form.website} onChange={(e) => set("website", e.target.value)} />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* About + Mission */}
          <SectionCard title="About & Mission" description="Tell your story">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>About the company</Label>
                <Textarea rows={5} value={form.about} onChange={(e) => set("about", e.target.value)} />
                <p className="text-xs text-muted-foreground">{form.about.length} characters</p>
              </div>
              <div className="space-y-1.5">
                <Label>Mission statement</Label>
                <Textarea rows={3} value={form.mission} onChange={(e) => set("mission", e.target.value)} />
              </div>
            </div>
          </SectionCard>

          {/* Benefits & Culture */}
          <div className="grid gap-6 md:grid-cols-2">
            <SectionCard title="Benefits" description="What you offer employees">
              <div className="space-y-2">
                {form.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                    <span className="flex-1">{b}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => set("benefits", form.benefits.filter((_, idx) => idx !== i))}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input placeholder="Add a benefit…" value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newBenefit.trim()) { set("benefits", [...form.benefits, newBenefit.trim()]); setNewBenefit(""); } }} />
                  <Button size="icon" onClick={() => { if (newBenefit.trim()) { set("benefits", [...form.benefits, newBenefit.trim()]); setNewBenefit(""); } }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Culture" description="What makes your team unique">
              <div className="space-y-2">
                {form.culture.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                    <span className="flex-1">{c}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => set("culture", form.culture.filter((_, idx) => idx !== i))}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input placeholder="Add a culture trait…" value={newCulture} onChange={(e) => setNewCulture(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newCulture.trim()) { set("culture", [...form.culture, newCulture.trim()]); setNewCulture(""); } }} />
                  <Button size="icon" onClick={() => { if (newCulture.trim()) { set("culture", [...form.culture, newCulture.trim()]); setNewCulture(""); } }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Locations + Social */}
          <SectionCard title="Office locations" description="Where you operate">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {form.locations.map((l, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {l}
                    <button onClick={() => set("locations", form.locations.filter((_, idx) => idx !== i))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add location…" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newLocation.trim()) { set("locations", [...form.locations, newLocation.trim()]); setNewLocation(""); } }} />
                <Button size="icon" onClick={() => { if (newLocation.trim()) { set("locations", [...form.locations, newLocation.trim()]); setNewLocation(""); } }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SectionCard title="Profile completeness">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold">{completeness}%</span>
                <Badge variant={completeness >= 80 ? "default" : "secondary"}>{completeness >= 80 ? "Great" : "Needs work"}</Badge>
              </div>
              <Progress value={completeness} />
              <p className="text-xs text-muted-foreground">Profiles with 80%+ completeness receive 3x more applicants on average.</p>
            </div>
          </SectionCard>

          <SectionCard title="Public profile preview">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <AvatarLogo text={employer.logo} size="lg" />
                  <div>
                    <p className="font-semibold">{form.name}</p>
                    <p className="text-xs text-muted-foreground">{form.industry} · {form.size}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {form.headquarters}</p>
                  <p className="flex items-center gap-1"><Globe className="h-3 w-3" /> {form.website}</p>
                  <p className="flex items-center gap-1"><Linkedin className="h-3 w-3" /> {form.linkedin || "—"}</p>
                  <p className="flex items-center gap-1"><Twitter className="h-3 w-3" /> {form.twitter || "—"}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">{form.about}</p>
              </CardContent>
            </Card>
          </SectionCard>

          <Button className="w-full" onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
