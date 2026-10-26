"use client";

import * as React from "react";
import { PageHeader, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { plans, subscriptions } from "@/lib/mock-data";
import type { Plan, PlanTier } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { toast } from "sonner";
import { CHART_COLORS, ChartCard, ChartTooltip } from "./_shared";

export function AdminPlans() {
  const [planList, setPlanList] = React.useState<Plan[]>(plans);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Plan | null>(null);

  const popularity = planList.map((p) => ({
    name: p.name,
    subscribers: subscriptions.filter((s) => s.tier === p.tier).length + Math.floor(Math.random() * 60),
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Subscription Plans"
        description="Configure pricing tiers, features, limits, and availability."
        icon={<Icon name="Layers" className="h-6 w-6" />}
        actions={[{ label: "Create plan", onClick: () => setCreateOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Active plans" value={planList.length} icon="Layers" />
        <MiniStat label="Total subscribers" value={formatNumber(popularity.reduce((s, p) => s + p.subscribers, 0))} icon="Users" />
        <MiniStat label="Most popular" value={popularity.sort((a, b) => b.subscribers - a.subscribers)[0]?.name ?? "—"} icon="Crown" />
        <MiniStat label="MRR" value={formatCurrency(subscriptions.filter((s) => s.status === "active").reduce((s, x) => s + x.amount, 0))} icon="Banknote" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {planList.map((p) => {
          const subs = subscriptions.filter((s) => s.tier === p.tier).length;
          return (
            <SectionCard
              key={p.id}
              title={p.name}
              description={`${p.tier} · ${p.target}`}
              action={<div className="flex items-center gap-1">{p.popular && <Badge className="bg-brand/10 text-brand border-brand/20">Popular</Badge>}<Badge variant="secondary" className="capitalize">{p.tier}</Badge></div>}
            >
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold">{formatCurrency(p.priceMonthly, p.currency)}</span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatCurrency(p.priceAnnual, p.currency)}/yr · {p.currency}</p>
                </div>
                <p className="text-sm text-muted-foreground">{p.description}</p>

                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Limits</p>
                  <div className="mt-1 grid grid-cols-3 gap-2 text-center text-xs">
                    <Limit label="Job posts" value={p.limits.jobPosts >= 99999 ? "∞" : p.limits.jobPosts} />
                    <Limit label="Resume views" value={p.limits.resumeViews >= 99999 ? "∞" : p.limits.resumeViews} />
                    <Limit label="Team" value={p.limits.teamMembers >= 99999 ? "∞" : p.limits.teamMembers} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Features</p>
                  <ul className="mt-1 space-y-1 text-sm">
                    {p.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <Icon name="BadgeCheck" className="mt-0.5 h-3.5 w-3.5 text-emerald-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {p.features.length > 4 && <li className="text-xs text-muted-foreground">+{p.features.length - 4} more</li>}
                  </ul>
                </div>

                <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                  <span>{subs} subscribers</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditTarget(p)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast.success(`${p.name} ${subs > 0 ? "deactivated" : "activated"}`)}>{subs > 0 ? "Deactivate" : "Activate"}</Button>
                  </div>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Plan popularity" description="Active subscribers per plan">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularity} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="subscribers" name="Subscribers" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Usage stats per plan" description="Average utilization of key limits.">
          <ul className="space-y-2 text-sm">
            {planList.map((p, i) => (
              <li key={p.id} className="rounded-md border p-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{Math.floor(40 + Math.random() * 50)}% utilized</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${40 + Math.random() * 50}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <PlanDialog open={createOpen} onOpenChange={setCreateOpen} title="Create plan" onSubmit={(p) => {
        setPlanList((prev) => [...prev, p]);
        toast.success("Plan created");
        setCreateOpen(false);
      }} />
      <PlanDialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)} title="Edit plan" initial={editTarget ?? undefined} onSubmit={(p) => {
        if (!editTarget) return;
        setPlanList((prev) => prev.map((x) => (x.id === editTarget.id ? p : x)));
        toast.success("Plan updated");
        setEditTarget(null);
      }} />
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <Icon name={icon} className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Limit({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border bg-muted/30 p-1.5">
      <p className="text-base font-semibold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function PlanDialog({ open, onOpenChange, title, onSubmit, initial }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  onSubmit: (p: Plan) => void;
  initial?: Plan;
}) {
  const [name, setName] = React.useState("");
  const [tier, setTier] = React.useState<PlanTier>("starter");
  const [target, setTarget] = React.useState<Plan["target"]>("employer");
  const [priceMonthly, setPriceMonthly] = React.useState(4999);
  const [priceAnnual, setPriceAnnual] = React.useState(49990);
  const [description, setDescription] = React.useState("");
  const [features, setFeatures] = React.useState("");
  const [jobPosts, setJobPosts] = React.useState(5);
  const [resumeViews, setResumeViews] = React.useState(100);
  const [teamMembers, setTeamMembers] = React.useState(3);
  const [popular, setPopular] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setTier(initial?.tier ?? "starter");
      setTarget(initial?.target ?? "employer");
      setPriceMonthly(initial?.priceMonthly ?? 4999);
      setPriceAnnual(initial?.priceAnnual ?? 49990);
      setDescription(initial?.description ?? "");
      setFeatures((initial?.features ?? []).join("\n"));
      setJobPosts(initial?.limits.jobPosts ?? 5);
      setResumeViews(initial?.limits.resumeViews ?? 100);
      setTeamMembers(initial?.limits.teamMembers ?? 3);
      setPopular(initial?.popular ?? false);
    }
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configure plan details, pricing, and limits.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1 max-h-[60vh] overflow-y-auto scroll-thin pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="p-name">Name</Label><Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-1.5">
              <Label>Tier</Label>
              <Select value={tier} onValueChange={(v) => setTier(v as PlanTier)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="p-m">Price monthly (₹)</Label><Input id="p-m" type="number" value={priceMonthly} onChange={(e) => setPriceMonthly(parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1.5"><Label htmlFor="p-a">Price annual (₹)</Label><Input id="p-a" type="number" value={priceAnnual} onChange={(e) => setPriceAnnual(parseInt(e.target.value) || 0)} /></div>
          </div>
          <div className="space-y-1.5">
            <Label>Target audience</Label>
            <Select value={target} onValueChange={(v) => setTarget(v as Plan["target"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="p-desc">Description</Label><Textarea id="p-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} /></div>
          <div className="space-y-1.5"><Label htmlFor="p-feat">Features (one per line)</Label><Textarea id="p-feat" value={features} onChange={(e) => setFeatures(e.target.value)} rows={4} className="text-xs" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label htmlFor="p-jp">Job posts</Label><Input id="p-jp" type="number" value={jobPosts} onChange={(e) => setJobPosts(parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1.5"><Label htmlFor="p-rv">Resume views</Label><Input id="p-rv" type="number" value={resumeViews} onChange={(e) => setResumeViews(parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1.5"><Label htmlFor="p-tm">Team members</Label><Input id="p-tm" type="number" value={teamMembers} onChange={(e) => setTeamMembers(parseInt(e.target.value) || 0)} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><Switch checked={popular} onCheckedChange={setPopular} />Mark as popular</label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!name.trim()) { toast.error("Name is required"); return; }
            onSubmit({
              id: initial?.id ?? `p_${Date.now()}`,
              tier, name: name.trim(), priceMonthly, priceAnnual, currency: "INR",
              description: description.trim(),
              features: features.split("\n").map((s) => s.trim()).filter(Boolean),
              limits: { jobPosts, resumeViews, teamMembers },
              popular, target,
            });
          }}>{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
