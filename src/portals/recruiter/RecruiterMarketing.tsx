"use client";

import * as React from "react";
import {
  Plus, Megaphone, Download, Eye, MousePointerClick, Target,
  TrendingUp, FileText, Share2, Mail, Linkedin, MessageSquare,
  PenSquare, ExternalLink, Image as ImageIcon, Hash, Sparkles,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { sourcingCampaigns } from "@/lib/partner-data";
import type { SourcingCampaign } from "@/lib/partner-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

const TYPE_TONE: Record<string, string> = {
  social: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
  referral: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  job_board: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
  linkedin: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20",
  email: "bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/20",
  event: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
};

const MARKETING_ASSETS = [
  { id: "tpl_001", name: "Senior Engineer Job Posting Template", category: "Job posting", icon: FileText, description: "Battle-tested template with bias-checked language and skills matrix.", uses: 142 },
  { id: "tpl_002", name: "TechCorp Brand Social Kit", category: "Social media", icon: Share2, description: "12 ready-to-post graphics for LinkedIn / Twitter / Instagram.", uses: 89 },
  { id: "tpl_003", name: "DevOps Candidate Outreach Sequence", category: "Email campaign", icon: Mail, description: "5-touch email sequence with subject-line A/B variants.", uses: 215 },
  { id: "tpl_004", name: "Q4 Sourcing Playbook", category: "Playbook", icon: PenSquare, description: "Step-by-step sourcing playbook for high-demand roles.", uses: 47 },
  { id: "tpl_005", name: "ML Engineer LinkedIn Recruiter Script", category: "Outreach script", icon: Linkedin, description: "Connection request + 3 follow-up InMail templates.", uses: 168 },
  { id: "tpl_006", name: "Candidate Nurturing Newsletter", category: "Email campaign", icon: Mail, description: "Monthly newsletter to keep warm candidates engaged.", uses: 63 },
  { id: "tpl_007", name: "Webinar Promo Kit", category: "Social media", icon: ImageIcon, description: "Graphics + email + landing copy for hiring webinars.", uses: 31 },
  { id: "tpl_008", name: "Referral Program Launch Kit", category: "Playbook", icon: Hash, description: "Launch kit for driving referrals from placed candidates.", uses: 54 },
];

const LEAD_SOURCE_DATA = [
  { source: "LinkedIn", candidates: 412, color: "oklch(0.65 0.18 162)" },
  { source: "Naukri", candidates: 268, color: "oklch(0.6 0.13 250)" },
  { source: "Referrals", candidates: 154, color: "oklch(0.7 0.18 70)" },
  { source: "Email", candidates: 98, color: "oklch(0.65 0.13 200)" },
  { source: "Events", candidates: 62, color: "oklch(0.65 0.18 350)" },
  { source: "Website", candidates: 44, color: "oklch(0.7 0.13 30)" },
];

export function RecruiterMarketing() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [form, setForm] = React.useState({
    name: "", type: "linkedin", channel: "LinkedIn Recruiter",
    budget: 50000, startDate: "", endDate: "",
  });

  const filteredCampaigns = sourcingCampaigns.filter((c) => typeFilter === "all" || c.type === typeFilter);
  const totalReach = sourcingCampaigns.reduce((a, c) => a + c.targetCandidates, 0);
  const totalSourced = sourcingCampaigns.reduce((a, c) => a + c.sourced, 0);
  const totalBudget = sourcingCampaigns.reduce((a, c) => a + c.budget, 0);
  const totalSpent = sourcingCampaigns.reduce((a, c) => a + c.spent, 0);
  const avgRoi = Math.round(((totalSourced - totalSpent / 1000) / Math.max(1, totalSpent)) * 100);

  function handleCreate() {
    if (!form.name.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    toast.success(`Campaign "${form.name}" created`, { description: `${form.type} • ${form.channel} • Budget ${formatCurrency(form.budget)}` });
    setCreateOpen(false);
    setForm({ name: "", type: "linkedin", channel: "LinkedIn Recruiter", budget: 50000, startDate: "", endDate: "" });
  }

  function handleDownload(assetName: string) {
    toast.success("Asset downloaded", { description: assetName });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing centre"
        description="Run sourcing campaigns, manage reusable marketing assets, and track lead-source performance."
        actions={[
          { label: "Create campaign", onClick: () => setCreateOpen(true) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total reach" value={totalReach.toLocaleString("en-IN")} icon={<Eye className="h-5 w-5" />} tone="brand" hint="Targeted candidates" />
        <StatCard label="Candidates sourced" value={totalSourced.toLocaleString("en-IN")} icon={<Target className="h-5 w-5" />} tone="success" hint={`${Math.round((totalSourced / Math.max(1, totalReach)) * 100)}% conv.`} />
        <StatCard label="Budget utilisation" value={`${Math.round((totalSpent / Math.max(1, totalBudget)) * 100)}%`} icon={<TrendingUp className="h-5 w-5" />} tone="warning" hint={`${formatCurrency(totalSpent)} / ${formatCurrency(totalBudget)}`} />
        <StatCard label="Avg ROI" value={`${avgRoi}%`} icon={<MousePointerClick className="h-5 w-5" />} tone="default" hint="Sourced vs spent" />
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-3 h-9 max-w-md">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="assets">Marketing assets</TabsTrigger>
          <TabsTrigger value="sources">Lead sources</TabsTrigger>
        </TabsList>

        {/* CAMPAIGNS */}
        <TabsContent value="campaigns" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="job_board">Job board</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredCampaigns.length === 0 ? (
            <EmptyState icon={<Megaphone className="h-5 w-5" />} title="No campaigns" description="Create your first campaign to start sourcing." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ASSETS */}
        <TabsContent value="assets" className="mt-4 space-y-4">
          <SectionCard
            title="Marketing assets library"
            description="Reusable templates, scripts and kits for your sourcing team. Download → adapt → launch."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MARKETING_ASSETS.map((a) => {
                const IconCmp = a.icon;
                return (
                  <div key={a.id} className="rounded-xl border p-4 hover:border-brand hover:shadow-sm transition flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <IconCmp className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-xs">{a.category}</Badge>
                    </div>
                    <div className="font-semibold text-sm leading-tight">{a.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{a.description}</div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{a.uses} uses</span>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(a.name)}>
                        <Download className="h-3.5 w-3.5 mr-1.5" />Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Branding guidelines" description="Brand-compliant assets to use in your candidate communications.">
            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); toast.success("Brand guide PDF opened"); }}
                className="flex items-center gap-3 rounded-lg border p-3 hover:border-brand hover:bg-muted/30 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand"><FileText className="h-4 w-4" /></div>
                <div className="min-w-0">
                  <div className="font-medium text-sm">jobson.id Brand Guide v3</div>
                  <div className="text-xs text-muted-foreground">Logos, colors, fonts</div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); toast.success("Visual assets ZIP downloaded"); }}
                className="flex items-center gap-3 rounded-lg border p-3 hover:border-brand hover:bg-muted/30 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand"><ImageIcon className="h-4 w-4" /></div>
                <div className="min-w-0">
                  <div className="font-medium text-sm">Stock visuals kit</div>
                  <div className="text-xs text-muted-foreground">24 curated images</div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); toast.success("Compliance checklist opened"); }}
                className="flex items-center gap-3 rounded-lg border p-3 hover:border-brand hover:bg-muted/30 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand"><Sparkles className="h-4 w-4" /></div>
                <div className="min-w-0">
                  <div className="font-medium text-sm">Inclusive language checklist</div>
                  <div className="text-xs text-muted-foreground">Bias-free copy guide</div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
              </a>
            </div>
          </SectionCard>
        </TabsContent>

        {/* SOURCES */}
        <TabsContent value="sources" className="mt-4 space-y-4">
          <SectionCard title="Lead source performance" description="Which channels deliver the most candidates? Use this to reallocate your budget.">
            <div className="rounded-lg border p-3">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={LEAD_SOURCE_DATA} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                  <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [`${v} candidates`, "Sourced"]} />
                  <Bar dataKey="candidates" radius={[4, 4, 0, 0]}>
                    {LEAD_SOURCE_DATA.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {LEAD_SOURCE_DATA.map((s) => (
                <div key={s.source} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-sm font-medium">{s.source}</span>
                  </div>
                  <span className="text-sm font-semibold">{s.candidates}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Create campaign dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create sourcing campaign</DialogTitle>
            <DialogDescription>Define a campaign to source candidates for an open mandate.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="cm-name">Campaign name *</Label>
              <Input id="cm-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Q4 ML Engineer Sprint" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="cm-type">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger id="cm-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="job_board">Job board</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cm-channel">Channel</Label>
                <Input id="cm-channel" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cm-budget">Budget (₹)</Label>
              <Input id="cm-budget" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="cm-start">Start date</Label>
                <Input id="cm-start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cm-end">End date</Label>
                <Input id="cm-end" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: SourcingCampaign }) {
  const conversion = campaign.targetCandidates > 0 ? Math.round((campaign.sourced / campaign.targetCandidates) * 100) : 0;
  const budgetUsed = campaign.budget > 0 ? Math.round((campaign.spent / campaign.budget) * 100) : 0;
  return (
    <div className="rounded-xl border p-4 hover:border-brand hover:shadow-sm transition flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm leading-tight">{campaign.name}</div>
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{campaign.description}</div>
        </div>
        <Badge variant="outline" className={`text-xs capitalize ${TYPE_TONE[campaign.type]}`}>{campaign.type.replace("_", " ")}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
        <div className="rounded-lg bg-muted/40 p-2">
          <div className="text-muted-foreground">Sourced</div>
          <div className="font-semibold text-sm">{campaign.sourced} / {campaign.targetCandidates}</div>
        </div>
        <div className="rounded-lg bg-muted/40 p-2">
          <div className="text-muted-foreground">Submitted</div>
          <div className="font-semibold text-sm">{campaign.submitted}</div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Sourcing conversion</span>
          <span>{conversion}%</span>
        </div>
        <Progress value={conversion} className="h-1.5" />
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Budget: {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}</span>
          <span>{budgetUsed}%</span>
        </div>
        <Progress value={budgetUsed} className="h-1.5" />
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <div className="text-xs text-muted-foreground">
          {formatDate(campaign.startDate)} → {formatDate(campaign.endDate)}
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      <div className="flex gap-2 mt-3">
        <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Performance report downloaded", { description: campaign.name })}>
          <Download className="h-3.5 w-3.5 mr-1" />Report
        </Button>
        {campaign.status === "active" && (
          <Button size="sm" variant="ghost" onClick={() => toast.success("Campaign paused", { description: campaign.name })}>Pause</Button>
        )}
        {campaign.status === "paused" && (
          <Button size="sm" variant="ghost" onClick={() => toast.success("Campaign resumed", { description: campaign.name })}>Resume</Button>
        )}
      </div>
    </div>
  );
}
