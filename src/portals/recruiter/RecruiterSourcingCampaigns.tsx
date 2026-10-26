"use client";

import * as React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import {
  Plus, Megaphone, Rocket, Pause, Play, Users, Target, TrendingUp, Coins,
  Calendar,
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
import { formatCurrency, formatDate, formatNumber, daysUntil, timeAgo } from "@/lib/format";
import type { Currency } from "@/lib/types";
import { sourcingCampaigns, openings, clientAccounts } from "@/lib/partner-data";
import type { SourcingCampaign } from "@/lib/partner-data";

const TYPE_META: Record<string, { icon: React.ReactNode; tone: string }> = {
  social: { icon: <Megaphone className="h-3.5 w-3.5" />, tone: "border-violet-400" },
  referral: { icon: <Users className="h-3.5 w-3.5" />, tone: "border-emerald-400" },
  job_board: { icon: <Megaphone className="h-3.5 w-3.5" />, tone: "border-amber-400" },
  linkedin: { icon: <Megaphone className="h-3.5 w-3.5" />, tone: "border-blue-400" },
  email: { icon: <Megaphone className="h-3.5 w-3.5" />, tone: "border-teal-400" },
  event: { icon: <Calendar className="h-3.5 w-3.5" />, tone: "border-rose-400" },
};

const SOURCED_SAMPLES: Record<string, { name: string; match: number; status: string }[]> = {
  scm_001: [
    { name: "Rohit Sharma", match: 88, status: "Submitted" },
    { name: "Neha Joshi", match: 81, status: "Interview" },
    { name: "Imran Khan", match: 74, status: "Sourced" },
    { name: "Divya Reddy", match: 69, status: "Sourced" },
  ],
  scm_002: [
    { name: "Sneha Patel", match: 86, status: "Interview" },
    { name: "Arjun Nair", match: 79, status: "Submitted" },
    { name: "Vikram Bose", match: 72, status: "Sourced" },
  ],
  scm_003: [
    { name: "Priya Iyer", match: 90, status: "Placed" },
    { name: "Karthik Rao", match: 84, status: "Placed" },
    { name: "Sara Khan", match: 76, status: "Submitted" },
  ],
  scm_004: [
    { name: "Aman Verma", match: 78, status: "Sourced" },
    { name: "Ritu Sharma", match: 71, status: "Contacted" },
  ],
  scm_005: [],
};

export function RecruiterSourcingCampaigns() {
  const [campaigns, setCampaigns] = React.useState<SourcingCampaign[]>(sourcingCampaigns);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<SourcingCampaign | null>(null);

  const filtered = campaigns.filter((c) => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const active = campaigns.filter((c) => c.status === "active").length;
  const totalSourced = campaigns.reduce((a, c) => a + c.sourced, 0);
  const totalSubmitted = campaigns.reduce((a, c) => a + c.submitted, 0);
  const totalSpent = campaigns.reduce((a, c) => a + c.spent, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sourcing campaigns"
        description="Run targeted sourcing sprints across LinkedIn, job boards, referrals, email, and events. Track funnel and ROI per campaign."
        actions={[{ label: "Create campaign", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Active campaigns" value={active} icon={<Rocket className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total sourced" value={formatNumber(totalSourced)} icon={<Users className="h-5 w-5" />} tone="default" hint="Across all campaigns" />
        <StatCard label="Submitted" value={formatNumber(totalSubmitted)} icon={<Target className="h-5 w-5" />} tone="success" hint={`${Math.round((totalSubmitted / Math.max(totalSourced, 1)) * 100)}% qualification rate`} />
        <StatCard label="Total spent" value={formatCurrency(totalSpent, "INR" as Currency)} icon={<Coins className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="Campaigns"
        description="Click any campaign to view the full funnel, ROI, and sourced candidates."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="job_board">Job board</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={<Megaphone className="h-5 w-5" />} title="No campaigns match" description="Adjust filters or create a new campaign." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto scroll-thin pr-1">
            {filtered.map((c) => {
              const sourcedPct = c.targetCandidates > 0 ? (c.sourced / c.targetCandidates) * 100 : 0;
              const qualifiedPct = c.sourced > 0 ? (c.qualified / c.sourced) * 100 : 0;
              const submittedPct = c.qualified > 0 ? (c.submitted / c.qualified) * 100 : 0;
              const budgetPct = c.budget > 0 ? (c.spent / c.budget) * 100 : 0;
              const costPerSubmit = c.submitted > 0 ? Math.round(c.spent / c.submitted) : 0;
              return (
                <button
                  key={c.id}
                  onClick={() => setDetail(c)}
                  className="text-left rounded-lg border bg-card p-4 hover:border-brand hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className={`rounded-md border-l-2 ${TYPE_META[c.type].tone} bg-muted/40 p-1.5`}>
                        {TYPE_META[c.type].icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{c.channel}</p>
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                  {/* Funnel */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Sourced</span>
                      <span className="font-medium">{c.sourced}/{c.targetCandidates}</span>
                    </div>
                    <Progress value={sourcedPct} className="h-1" />
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Qualified</span>
                      <span className="font-medium">{c.qualified}</span>
                    </div>
                    <Progress value={qualifiedPct} className="h-1" />
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Submitted</span>
                      <span className="font-medium">{c.submitted}</span>
                    </div>
                    <Progress value={submittedPct} className="h-1" />
                  </div>
                  {/* Budget */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Budget</p>
                      <p className="font-medium">{formatCurrency(c.spent, "INR" as Currency)} / {formatCurrency(c.budget, "INR" as Currency)}</p>
                      <Progress value={budgetPct} className="h-1 w-32 mt-1" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Cost / submit</p>
                      <p className="font-medium">{costPerSubmit > 0 ? formatCurrency(costPerSubmit, "INR" as Currency) : "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2">
                    <span>{formatDate(c.startDate)} – {formatDate(c.endDate)}</span>
                    {c.status === "active" && <span>{daysUntil(c.endDate)}d left</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </SectionCard>

      <CreateCampaignDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={(rec) => {
          setCampaigns((prev) => [rec, ...prev]);
        }}
      />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && (
            <CampaignDetail
              campaign={detail}
              onClose={() => setDetail(null)}
              onToggleStatus={() => {
                const newStatus: SourcingCampaign["status"] = detail.status === "active" ? "paused" : "active";
                setCampaigns((prev) => prev.map((x) => x.id === detail.id ? { ...x, status: newStatus } : x));
                setDetail((d) => d ? { ...d, status: newStatus } : null);
                toast.success(`Campaign ${newStatus === "active" ? "resumed" : "paused"}`);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CreateCampaignDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (rec: SourcingCampaign) => void;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<SourcingCampaign["type"]>("linkedin");
  const [channel, setChannel] = React.useState("LinkedIn Recruiter");
  const [target, setTarget] = React.useState("50");
  const [budget, setBudget] = React.useState("50000");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [jobOrderId, setJobOrderId] = React.useState("");

  const submit = () => {
    if (!name || !description) {
      toast.error("Name and description are required");
      return;
    }
    const rec: SourcingCampaign = {
      id: "scm_" + Date.now(),
      name, description, type, channel,
      targetCandidates: Number(target),
      sourced: 0, qualified: 0, submitted: 0,
      startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      status: "scheduled",
      budget: Number(budget),
      spent: 0,
      jobOrderId: jobOrderId || undefined,
    };
    onCreate(rec);
    toast.success(`Campaign "${name}" created`);
    onOpenChange(false);
    setName(""); setDescription(""); setTarget("50"); setBudget("50000"); setStartDate(""); setEndDate(""); setJobOrderId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create sourcing campaign</DialogTitle>
          <DialogDescription>Define a new multi-channel sourcing sprint tied to a job order.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label>Campaign name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q4 DevOps Sourcing Sprint" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as SourcingCampaign["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="job_board">Job board</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Channel</Label>
            <Input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="e.g. LinkedIn Recruiter" />
          </div>
          <div className="space-y-2">
            <Label>Target candidates</Label>
            <Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Budget (₹)</Label>
            <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Start date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>End date</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Linked job order (optional)</Label>
            <Select value={jobOrderId} onValueChange={setJobOrderId}>
              <SelectTrigger><SelectValue placeholder="Select mandate" /></SelectTrigger>
              <SelectContent>
                {openings.map((o) => <SelectItem key={o.id} value={o.jobOrderId}>{o.title} — {o.clientName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Create campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CampaignDetail({
  campaign, onClose, onToggleStatus,
}: {
  campaign: SourcingCampaign;
  onClose: () => void;
  onToggleStatus: () => void;
}) {
  const sourced = campaign.sourced;
  const qualified = campaign.qualified;
  const submitted = campaign.submitted;
  const costPerSubmit = submitted > 0 ? Math.round(campaign.spent / submitted) : 0;
  const costPerSource = sourced > 0 ? Math.round(campaign.spent / sourced) : 0;
  const submitRate = sourced > 0 ? Math.round((submitted / sourced) * 100) : 0;
  const candidates = SOURCED_SAMPLES[campaign.id] ?? [];

  const funnel = [
    { stage: "Sourced", value: sourced, fill: "#0ea5e9" },
    { stage: "Qualified", value: qualified, fill: "#f59e0b" },
    { stage: "Submitted", value: submitted, fill: "#10b981" },
  ];

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <div className={`rounded-md border-l-2 ${TYPE_META[campaign.type].tone} bg-muted/40 p-2`}>
            {TYPE_META[campaign.type].icon}
          </div>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg">{campaign.name}</SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2 text-xs">
              <span>{campaign.channel}</span>
              <span>•</span>
              <span>{formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}</span>
            </SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <StatusBadge status={campaign.status} />
          <Badge variant="outline" className="text-xs capitalize">{campaign.type.replace(/_/g, " ")}</Badge>
        </div>
      </SheetHeader>

      <div className="space-y-5 mt-5">
        <p className="text-sm text-muted-foreground">{campaign.description}</p>

        {/* Funnel chart */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Funnel</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} className="text-muted-foreground" width={70} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnel.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROI metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-lg border p-3">
            <p className="text-[10px] text-muted-foreground">Cost / source</p>
            <p className="font-semibold text-sm">{costPerSource > 0 ? formatCurrency(costPerSource, "INR" as Currency) : "—"}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-[10px] text-muted-foreground">Cost / submit</p>
            <p className="font-semibold text-sm">{costPerSubmit > 0 ? formatCurrency(costPerSubmit, "INR" as Currency) : "—"}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-[10px] text-muted-foreground">Submit rate</p>
            <p className="font-semibold text-sm">{submitRate}%</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-[10px] text-muted-foreground">Budget used</p>
            <p className="font-semibold text-sm">{Math.round((campaign.spent / Math.max(campaign.budget, 1)) * 100)}%</p>
          </div>
        </div>

        {/* Budget progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-medium">{formatCurrency(campaign.spent, "INR" as Currency)} / {formatCurrency(campaign.budget, "INR" as Currency)}</span>
          </div>
          <Progress value={(campaign.spent / Math.max(campaign.budget, 1)) * 100} className="h-2" />
        </div>

        {/* Sourced candidates */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> Sourced candidates ({candidates.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto scroll-thin">
            {candidates.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3 border rounded">No candidates sourced yet.</p>
            ) : candidates.map((c, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
                <AvatarLogo text={c.name} size="xs" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.status}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${c.match >= 80 ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "border-amber-500/30 text-amber-600 dark:text-amber-400"}`}>
                  {c.match}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {(campaign.status === "active" || campaign.status === "paused") && (
            <Button size="sm" onClick={onToggleStatus}>
              {campaign.status === "active" ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Resume</>}
            </Button>
          )}
          {campaign.status === "scheduled" && (
            <Button size="sm" onClick={() => toast.success("Campaign launched")}><Rocket className="h-3.5 w-3.5" /> Launch now</Button>
          )}
          <Button size="sm" variant="outline" onClick={() => toast.success("Performance report downloaded")}>Download report</Button>
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
}
