"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { CURRENT_PARTNER, PartnerDisclaimer, ChartCard, ChartTooltip, CHART_COLORS } from "./_shared";
import { leads } from "@/lib/partner-data";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { toast } from "sonner";
import {
  Megaphone, Plus, Download, TrendingUp, Target, Users, Sparkles, Share2, Eye, MousePointerClick,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: "active" | "scheduled" | "completed" | "paused";
  reach: number;
  conversions: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate?: string;
  description: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: "cmp_001", name: "Referral Bonus — Q4", channel: "Referral", status: "active", reach: 1240, conversions: 86, budget: 50000, spent: 32400, startDate: "2024-10-01", description: "Existing students refer new admissions and earn ₹2,000 cashback." },
  { id: "cmp_002", name: "Early-Bird Discount — Nov Batch", channel: "Email", status: "active", reach: 3800, conversions: 142, budget: 20000, spent: 12400, startDate: "2024-10-15", description: "15% early-bird discount for first 30 enrolments in November batch." },
  { id: "cmp_003", name: "Alumni Testimonial Drive", channel: "Social Media", status: "active", reach: 8600, conversions: 64, budget: 35000, spent: 22800, startDate: "2024-09-20", description: "Video testimonials from placed alumni shared on LinkedIn & Instagram." },
  { id: "cmp_004", name: "Diwali Social Media Drive", channel: "Social Media", status: "completed", reach: 14200, conversions: 218, budget: 60000, spent: 58400, startDate: "2024-10-20", endDate: "2024-11-05", description: "Diwali-themed creative campaign across all social platforms." },
  { id: "cmp_005", name: "College Campus Drive — Dec", channel: "Offline", status: "scheduled", reach: 0, conversions: 0, budget: 40000, spent: 0, startDate: "2024-12-05", description: "On-campus awareness sessions at 6 engineering colleges in Tamil Nadu." },
];

const ASSETS = [
  { name: "Q4 Referral Flyer (PDF)", size: "1.2 MB", type: "Flyer" },
  { name: "Program Brochure — Full-Stack", size: "3.4 MB", type: "Brochure" },
  { name: "Instagram Carousel Template", size: "640 KB", type: "Social" },
  { name: "LinkedIn Post Template — Hiring", size: "210 KB", type: "Social" },
  { name: "Alumni Testimonial Video (mp4)", size: "48 MB", type: "Video" },
  { name: "Email Signature Banner", size: "84 KB", type: "Email" },
];

export function PartnerMarketing() {
  const { navigate } = useNav();
  const partner = CURRENT_PARTNER;
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [addOpen, setAddOpen] = React.useState(false);

  const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const overallRoi = totalSpent > 0 ? Math.round(((totalConversions * 28000 - totalSpent) / totalSpent) * 100) : 0;

  const sourceData = (() => {
    const map: Record<string, number> = {};
    leads.filter((l) => l.partnerId === partner.id).forEach((l) => {
      const k = l.leadSource.replace(/_/g, " ");
      map[k] = (map[k] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newC: Campaign = {
      id: `cmp_${Date.now()}`,
      name: fd.get("name") as string,
      channel: fd.get("channel") as string,
      status: "scheduled",
      reach: 0,
      conversions: 0,
      budget: Number(fd.get("budget")) || 0,
      spent: 0,
      startDate: (fd.get("startDate") as string) || new Date().toISOString().slice(0, 10),
      description: fd.get("description") as string,
    };
    setCampaigns((prev) => [newC, ...prev]);
    setAddOpen(false);
    toast.success("Campaign created", { description: `${newC.name} — ${newC.channel}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Centre"
        description={`${partner.name} — run campaigns, distribute assets, and track lead-source performance.`}
        icon={<Icon name="Megaphone" className="h-6 w-6" />}
        actions={[
          { label: "Create Campaign", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Reach" value={totalReach.toLocaleString("en-IN")} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Conversions" value={totalConversions} icon={<Target className="h-5 w-5" />} tone="success" />
        <StatCard label="Budget Used" value={`₹${(totalSpent / 1000).toFixed(1)}K / ₹${(totalBudget / 1000).toFixed(1)}K`} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overall ROI" value={`${overallRoi}%`} icon={<Sparkles className="h-5 w-5" />} delta={{ value: "vs last quarter", positive: overallRoi > 0 }} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Lead Source Performance" description="Distribution of leads by source" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
              <Bar dataKey="value" name="Leads" radius={[4, 4, 0, 0]}>
                {sourceData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Quick Stats" description="At-a-glance">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Active Campaigns</span><span className="font-semibold">{campaigns.filter((c) => c.status === "active").length}</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Scheduled</span><span className="font-semibold">{campaigns.filter((c) => c.status === "scheduled").length}</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Completed</span><span className="font-semibold">{campaigns.filter((c) => c.status === "completed").length}</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Avg Conversion Rate</span><span className="font-semibold text-brand">{totalReach > 0 ? ((totalConversions / totalReach) * 100).toFixed(2) : 0}%</span></li>
          </ul>
        </SectionCard>
      </div>

      {/* Campaigns grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {campaigns.map((c) => {
          const roi = c.spent > 0 ? Math.round(((c.conversions * 28000 - c.spent) / c.spent) * 100) : 0;
          const convRate = c.reach > 0 ? ((c.conversions / c.reach) * 100).toFixed(2) : "0";
          return (
            <Card key={c.id}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-brand" /> {c.name}
                  </CardTitle>
                  <CardDescription className="mt-1">{c.channel} · Started {c.startDate}</CardDescription>
                </div>
                <StatusBadge status={c.status} />
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{c.description}</p>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="rounded-lg border p-2">
                    <Eye className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
                    <p className="mt-1 text-sm font-semibold">{c.reach.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Reach</p>
                  </div>
                  <div className="rounded-lg border p-2">
                    <MousePointerClick className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
                    <p className="mt-1 text-sm font-semibold">{c.conversions}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Conv.</p>
                  </div>
                  <div className="rounded-lg border p-2">
                    <Target className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
                    <p className="mt-1 text-sm font-semibold">{convRate}%</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Rate</p>
                  </div>
                  <div className="rounded-lg border p-2">
                    <TrendingUp className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
                    <p className={`mt-1 text-sm font-semibold ${roi >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{roi}%</p>
                    <p className="text-[10px] text-muted-foreground uppercase">ROI</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Budget Used</span>
                    <span>₹{(c.spent / 1000).toFixed(1)}K / ₹{(c.budget / 1000).toFixed(1)}K</span>
                  </div>
                  <Progress value={c.budget > 0 ? (c.spent / c.budget) * 100 : 0} className="h-1.5" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Campaign details opened")}>Details</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Campaign duplicated")}>Duplicate</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Marketing assets */}
      <SectionCard
        title="Marketing Assets"
        description="Downloadable flyers, brochures & social templates"
        action={<Button size="sm" variant="ghost" onClick={() => toast.success("Asset library opened")}>Browse all</Button>}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ASSETS.map((a) => (
            <div key={a.name} className="flex items-center justify-between rounded-lg border p-3 hover:border-brand/40 hover:bg-brand/5 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Download className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.type} · {a.size}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Download started", { description: a.name })}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Need help crafting campaigns?" description="jobson.id marketing team can co-create assets with you">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate("partner", "support")}>
            <Sparkles className="h-4 w-4 mr-2" /> Request marketing support
          </Button>
          <Button variant="outline" onClick={() => toast.success("Shareable link copied to clipboard")}>
            <Share2 className="h-4 w-4 mr-2" /> Share partner portal link
          </Button>
        </div>
      </SectionCard>

      {/* Create campaign dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>Set up a new marketing campaign for your centre.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Campaign Name</Label>
              <Input id="name" name="name" required placeholder="e.g. New Year Skills Drive" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="channel">Channel</Label>
                <Select name="channel" defaultValue="Email">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input id="budget" name="budget" type="number" min={0} defaultValue={25000} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} placeholder="Campaign goal & messaging…" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
