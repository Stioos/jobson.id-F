"use client";

import * as React from "react";
import {
  Plus, Building2, Phone, Mail, Calendar, Trophy, Target,
  TrendingUp, DollarSign, ChevronRight, Handshake, ArrowRight, GripVertical,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";

type LeadStage = "prospect" | "contacted" | "proposal" | "negotiation" | "won" | "lost";

interface DevLead {
  id: string;
  company: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  stage: LeadStage;
  estimatedAnnualValue: number;
  expectedCloseDate: string;
  source: string;
  owner: string;
  probability: number;
  nextAction: string;
  nextActionDate: string;
  notes: string;
}

const STAGES: { key: LeadStage; label: string; tone: string }[] = [
  { key: "prospect", label: "Prospect", tone: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20" },
  { key: "contacted", label: "Contacted", tone: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20" },
  { key: "proposal", label: "Proposal sent", tone: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20" },
  { key: "negotiation", label: "Negotiation", tone: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20" },
  { key: "won", label: "Won", tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20" },
  { key: "lost", label: "Lost", tone: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20" },
];

const INITIAL_LEADS: DevLead[] = [
  { id: "ld_001", company: "InnovateLabs", industry: "SaaS", contactName: "Ankit Maheshwari", contactEmail: "ankit@innovatelabs.io", contactPhone: "+91 99887 12345", stage: "prospect", estimatedAnnualValue: 1800000, expectedCloseDate: "2024-12-15", source: "LinkedIn outreach", owner: "Karthik Subramanian", probability: 20, nextAction: "Send intro deck", nextActionDate: "2024-11-05", notes: "Heads a 200-person eng team. Hiring 30+ next year." },
  { id: "ld_002", company: "CloudScale Systems", industry: "Cloud Infrastructure", contactName: "Deepa Iyengar", contactEmail: "deepa@cloudscale.in", contactPhone: "+91 98200 65432", stage: "contacted", estimatedAnnualValue: 2400000, expectedCloseDate: "2024-12-20", source: "Referral", owner: "Karthik Subramanian", probability: 35, nextAction: "Discovery call scheduled", nextActionDate: "2024-11-08", notes: "Came via Arjun Iyer referral. Hiring DevOps + SREs." },
  { id: "ld_003", company: "NexaPay", industry: "Fintech", contactName: "Rahul Bansal", contactEmail: "rahul@nexapay.com", contactPhone: "+91 90090 11223", stage: "proposal", estimatedAnnualValue: 3200000, expectedCloseDate: "2024-11-30", source: "Inbound (website)", owner: "Karthik Subramanian", probability: 55, nextAction: "Awaiting feedback on MSA", nextActionDate: "2024-11-06", notes: "Need 25 engineers across 4 squads. Sent tailored proposal." },
  { id: "ld_004", company: "MediTech Solutions", industry: "Healthcare IT", contactName: "Sunita Rao", contactEmail: "sunita@meditech.io", contactPhone: "+91 91100 44556", stage: "negotiation", estimatedAnnualValue: 1500000, expectedCloseDate: "2024-11-22", source: "Event", owner: "Karthik Subramanian", probability: 70, nextAction: "Finalize commercial terms", nextActionDate: "2024-11-07", notes: "Want exclusive partnership. Negotiating 18% fee." },
  { id: "ld_005", company: "EduSpark", industry: "Edtech", contactName: "Vivek Sharma", contactEmail: "vivek@eduspark.in", contactPhone: "+91 93300 77889", stage: "prospect", estimatedAnnualValue: 900000, expectedCloseDate: "2025-01-10", source: "Cold email", owner: "Karthik Subramanian", probability: 15, nextAction: "Follow-up email #2", nextActionDate: "2024-11-09", notes: "Series A funded. Building instructor team." },
  { id: "ld_006", company: "AutoDrive AI", industry: "Automotive AI", contactName: "Megha Kapoor", contactEmail: "megha@autodrive.ai", contactPhone: "+91 94400 22110", stage: "contacted", estimatedAnnualValue: 4200000, expectedCloseDate: "2024-12-28", source: "Conference", owner: "Karthik Subramanian", probability: 40, nextAction: "Onsite demo next week", nextActionDate: "2024-11-12", notes: "Hiring ML/CV engineers aggressively. Big budget." },
  { id: "ld_007", company: "GreenGrid Energy", industry: "Cleantech", contactName: "Aditya Nair", contactEmail: "aditya@greengrid.in", contactPhone: "+91 95500 33445", stage: "proposal", estimatedAnnualValue: 1100000, expectedCloseDate: "2024-12-05", source: "Referral", owner: "Karthik Subramanian", probability: 50, nextAction: "Send revised SOW", nextActionDate: "2024-11-06", notes: "Need 15 solar engineers. Revising scope after call." },
  { id: "ld_008", company: "Quantum Retail", industry: "Retail Tech", contactName: "Pooja Desai", contactEmail: "pooja@quantumretail.co", contactPhone: "+91 97700 88990", stage: "won", estimatedAnnualValue: 2800000, expectedCloseDate: "2024-10-28", source: "Inbound (website)", owner: "Karthik Subramanian", probability: 100, nextAction: "Onboarding kickoff", nextActionDate: "2024-11-10", notes: "Closed! 12-month MSA signed." },
  { id: "ld_009", company: "FoodieBox", industry: "Food delivery", contactName: "Karan Malhotra", contactEmail: "karan@foodiebox.in", contactPhone: "+91 98800 12340", stage: "lost", estimatedAnnualValue: 700000, expectedCloseDate: "2024-10-15", source: "LinkedIn outreach", owner: "Karthik Subramanian", probability: 0, nextAction: "Lost — went with internal team", nextActionDate: "2024-10-15", notes: "Decided to build in-house TA. Revisit in 6 months." },
  { id: "ld_010", company: "FinSecure Bank", industry: "Banking", contactName: "Geetha Krishnan", contactEmail: "geetha@finsecure.co", contactPhone: "+91 96600 55667", stage: "negotiation", estimatedAnnualValue: 3600000, expectedCloseDate: "2024-12-12", source: "Referral", owner: "Karthik Subramanian", probability: 65, nextAction: "Legal review meeting", nextActionDate: "2024-11-11", notes: "Multi-year contract for compliance + risk hiring." },
];

const BD_ACTIVITIES = [
  { day: "Today", items: [
    { type: "call", label: "Discovery call — CloudScale Systems", time: "11:00 AM", outcome: "Positive" },
    { type: "email", label: "Sent proposal to NexaPay", time: "1:30 PM", outcome: "Awaiting reply" },
    { type: "meeting", label: "Negotiation — MediTech Solutions", time: "3:00 PM", outcome: "In progress" },
  ]},
  { day: "Yesterday", items: [
    { type: "call", label: "Follow-up — EduSpark", time: "10:00 AM", outcome: "Voicemail" },
    { type: "email", label: "Intro deck to AutoDrive AI", time: "2:00 PM", outcome: "Replied" },
  ]},
  { day: "This week", items: [
    { type: "meeting", label: "Onboarding kickoff — Quantum Retail", time: "Tomorrow 4 PM", outcome: "Scheduled" },
    { type: "call", label: "Legal review — FinSecure Bank", time: "Mon 11 AM", outcome: "Scheduled" },
  ]},
];

const ACTIVITY_ICON: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  meeting: <Calendar className="h-4 w-4" />,
};

export function RecruiterClientDev() {
  const [leads, setLeads] = React.useState<DevLead[]>(INITIAL_LEADS);
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<DevLead | null>(null);
  const [view, setView] = React.useState<"kanban" | "table">("kanban");
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    company: "", industry: "", contactName: "", contactEmail: "", contactPhone: "",
    stage: "prospect", estimatedAnnualValue: 1000000, expectedCloseDate: "",
    source: "LinkedIn outreach", probability: 20, nextAction: "",
  });

  const totalPipeline = leads.filter((l) => l.stage !== "won" && l.stage !== "lost").reduce((a, l) => a + l.estimatedAnnualValue, 0);
  const wonValue = leads.filter((l) => l.stage === "won").reduce((a, l) => a + l.estimatedAnnualValue, 0);
  const weightedForecast = leads.filter((l) => l.stage !== "won" && l.stage !== "lost").reduce((a, l) => a + Math.round(l.estimatedAnnualValue * l.probability / 100), 0);
  const conversionRate = leads.length > 0 ? Math.round((leads.filter((l) => l.stage === "won").length / leads.length) * 100) : 0;

  function handleAddLead() {
    if (!form.company.trim() || !form.contactEmail.trim()) {
      toast.error("Company name and contact email are required");
      return;
    }
    const newLead: DevLead = {
      id: `ld_${Date.now()}`,
      company: form.company,
      industry: form.industry || "—",
      contactName: form.contactName || "—",
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone || "—",
      stage: form.stage as LeadStage,
      estimatedAnnualValue: Number(form.estimatedAnnualValue) || 0,
      expectedCloseDate: form.expectedCloseDate || "—",
      source: form.source,
      owner: "Karthik Subramanian",
      probability: Number(form.probability) || 0,
      nextAction: form.nextAction || "Schedule intro call",
      nextActionDate: form.expectedCloseDate || "—",
      notes: "Newly added lead.",
    };
    setLeads([newLead, ...leads]);
    toast.success(`Lead "${form.company}" added`, { description: `Stage: ${form.stage}` });
    setAddOpen(false);
    setForm({ company: "", industry: "", contactName: "", contactEmail: "", contactPhone: "", stage: "prospect", estimatedAnnualValue: 1000000, expectedCloseDate: "", source: "LinkedIn outreach", probability: 20, nextAction: "" });
  }

  function handleDragStart(id: string) { setDragId(id); }
  function handleDrop(targetStage: LeadStage) {
    if (!dragId) return;
    setLeads((prev) => prev.map((l) => l.id === dragId ? {
      ...l,
      stage: targetStage,
      probability: targetStage === "won" ? 100 : targetStage === "lost" ? 0 : l.probability,
    } : l));
    const moved = leads.find((l) => l.id === dragId);
    if (moved) toast.success(`"${moved.company}" moved to ${targetStage}`, { description: "Pipeline updated" });
    setDragId(null);
  }

  function advanceStage(lead: DevLead) {
    const order: LeadStage[] = ["prospect", "contacted", "proposal", "negotiation", "won"];
    const idx = order.indexOf(lead.stage);
    if (idx < 0 || idx === order.length - 1) return;
    const next = order[idx + 1];
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, stage: next, probability: next === "won" ? 100 : Math.min(100, l.probability + 15) } : l));
    toast.success(`"${lead.company}" advanced to ${next}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client development"
        description="Prospect, qualify and convert new client accounts. Track your BD pipeline and forecast revenue."
        actions={[
          { label: "Add lead", onClick: () => setAddOpen(true) },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Pipeline value" value={formatCurrency(totalPipeline)} icon={<TrendingUp className="h-5 w-5" />} tone="brand" hint="Open leads" />
        <StatCard label="Weighted forecast" value={formatCurrency(weightedForecast)} icon={<Target className="h-5 w-5" />} tone="success" hint="Probability-weighted" />
        <StatCard label="Won this quarter" value={formatCurrency(wonValue)} icon={<Trophy className="h-5 w-5" />} tone="warning" hint={`${leads.filter((l) => l.stage === "won").length} accounts`} />
        <StatCard label="Conversion rate" value={`${conversionRate}%`} icon={<DollarSign className="h-5 w-5" />} tone="default" hint="Won / total leads" />
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {leads.filter((l) => l.stage !== "won" && l.stage !== "lost").length} open leads
        </div>
        <div className="inline-flex rounded-lg border bg-muted/40 p-1 text-xs">
          <button
            className={`px-3 py-1.5 rounded-md font-medium transition ${view === "kanban" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            onClick={() => setView("kanban")}
          >Kanban</button>
          <button
            className={`px-3 py-1.5 rounded-md font-medium transition ${view === "table" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            onClick={() => setView("table")}
          >Table</button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage.key);
            const stageValue = stageLeads.reduce((a, l) => a + l.estimatedAnnualValue, 0);
            return (
              <div
                key={stage.key}
                className="rounded-xl border bg-muted/20 p-3 min-h-[200px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stage.key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${stage.tone}`}>{stage.label}</span>
                    <span className="text-xs text-muted-foreground">{stageLeads.length}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-3">{formatCurrency(stageValue)}</div>
                <div className="space-y-2">
                  {stageLeads.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">Drop leads here</div>
                  ) : stageLeads.map((l) => (
                    <div
                      key={l.id}
                      draggable
                      onDragStart={() => handleDragStart(l.id)}
                      onClick={() => setDetail(l)}
                      className="group rounded-lg border bg-background p-3 cursor-pointer hover:border-brand hover:shadow-sm transition"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 cursor-grab group-hover:text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{l.company}</div>
                          <div className="text-xs text-muted-foreground truncate">{l.industry}</div>
                          <div className="mt-2 text-sm font-semibold">{formatCurrency(l.estimatedAnnualValue)}</div>
                          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{l.probability}%</span>
                            <span>{l.contactName}</span>
                          </div>
                          <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-brand" style={{ width: `${l.probability}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <SectionCard title="Leads" description="Click a lead to view details, advance stage, or update next action.">
          <div className="max-h-96 overflow-y-auto scroll-thin -mx-4 sm:-mx-5">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30 sticky top-0">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Company</th>
                  <th className="px-3 py-2 font-medium hidden md:table-cell">Industry</th>
                  <th className="px-3 py-2 font-medium">Stage</th>
                  <th className="px-3 py-2 font-medium text-right">Value</th>
                  <th className="px-3 py-2 font-medium text-center hidden sm:table-cell">Prob.</th>
                  <th className="px-3 py-2 font-medium hidden lg:table-cell">Close date</th>
                  <th className="px-3 py-2 font-medium hidden lg:table-cell">Source</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setDetail(l)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={l.company} size="sm" />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{l.company}</div>
                          <div className="text-xs text-muted-foreground truncate">{l.contactName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell text-muted-foreground">{l.industry}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize"
                        style={{}}>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${STAGES.find((s) => s.key === l.stage)?.tone}`}>{l.stage}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold">{formatCurrency(l.estimatedAnnualValue)}</td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">{l.probability}%</td>
                    <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground">{formatDate(l.expectedCloseDate)}</td>
                    <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground">{l.source}</td>
                    <td className="px-3 py-3"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* BD activity tracker */}
      <SectionCard title="BD activity tracker" description="Your recent and upcoming business development activities.">
        <div className="grid gap-4 md:grid-cols-3">
          {BD_ACTIVITIES.map((group) => (
            <div key={group.day} className="rounded-lg border p-4">
              <div className="text-sm font-semibold mb-3">{group.day}</div>
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">{ACTIVITY_ICON[item.type]}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium leading-tight">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.time}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">{item.outcome}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Add lead dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add new BD lead</DialogTitle>
            <DialogDescription>Capture the prospect. You can enrich and advance the stage as you progress.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ld-company">Company *</Label>
                <Input id="ld-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. NexaPay" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ld-industry">Industry</Label>
                <Input id="ld-industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Fintech / SaaS / ..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ld-contact">Contact name</Label>
                <Input id="ld-contact" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ld-email">Contact email *</Label>
                <Input id="ld-email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="name@company.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ld-phone">Phone</Label>
                <Input id="ld-phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ld-source">Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                  <SelectTrigger id="ld-source"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn outreach">LinkedIn outreach</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Inbound (website)">Inbound (website)</SelectItem>
                    <SelectItem value="Cold email">Cold email</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ld-stage">Stage</Label>
                <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                  <SelectTrigger id="ld-stage"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ld-prob">Probability (%)</Label>
                <Input id="ld-prob" type="number" min={0} max={100} value={form.probability} onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ld-value">Est. annual value (₹)</Label>
                <Input id="ld-value" type="number" value={form.estimatedAnnualValue} onChange={(e) => setForm({ ...form, estimatedAnnualValue: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ld-close">Expected close date</Label>
                <Input id="ld-close" type="date" value={form.expectedCloseDate} onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ld-next">Next action</Label>
              <Input id="ld-next" value={form.nextAction} onChange={(e) => setForm({ ...form, nextAction: e.target.value })} placeholder="e.g. Schedule discovery call" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLead}>Add lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <AvatarLogo text={detail.company} size="lg" />
                  <div>
                    <SheetTitle className="text-xl">{detail.company}</SheetTitle>
                    <SheetDescription>{detail.industry} • Lead owner: {detail.owner}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Est. annual value</div>
                    <div className="text-lg font-semibold mt-1">{formatCurrency(detail.estimatedAnnualValue)}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Probability</div>
                    <div className="text-lg font-semibold mt-1">{detail.probability}%</div>
                    <Progress value={detail.probability} className="h-1.5 mt-2" />
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="text-sm font-semibold">Contact</div>
                  <div className="text-sm">{detail.contactName}</div>
                  <div className="text-xs text-muted-foreground">{detail.contactEmail}</div>
                  <div className="text-xs text-muted-foreground">{detail.contactPhone}</div>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="text-sm font-semibold">Pipeline info</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Stage</div>
                    <div className="font-medium capitalize">{detail.stage}</div>
                    <div className="text-muted-foreground">Source</div>
                    <div className="font-medium">{detail.source}</div>
                    <div className="text-muted-foreground">Expected close</div>
                    <div className="font-medium">{formatDate(detail.expectedCloseDate)}</div>
                    <div className="text-muted-foreground">Days to close</div>
                    <div className="font-medium">{daysUntil(detail.expectedCloseDate)}d</div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-semibold mb-1">Next action</div>
                  <div className="text-sm">{detail.nextAction}</div>
                  <div className="text-xs text-muted-foreground mt-1">Due {formatDate(detail.nextActionDate)}</div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-semibold mb-1">Notes</div>
                  <div className="text-sm text-muted-foreground">{detail.notes}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {detail.stage !== "won" && detail.stage !== "lost" && (
                    <Button size="sm" onClick={() => advanceStage(detail)}>
                      <ArrowRight className="h-4 w-4 mr-1.5" />Advance stage
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => toast.success("Email drafted", { description: `Outreach to ${detail.contactEmail}` })}>
                    <Mail className="h-4 w-4 mr-1.5" />Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Call scheduled", { description: detail.contactName })}>
                    <Phone className="h-4 w-4 mr-1.5" />Log call
                  </Button>
                  {detail.stage === "won" && (
                    <Button size="sm" variant="secondary" onClick={() => toast.success("Account created", { description: `${detail.company} onboarded as active client` })}>
                      <Handshake className="h-4 w-4 mr-1.5" />Convert to account
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
