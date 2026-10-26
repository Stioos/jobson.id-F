"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  talentPlacements as seedPlacements,
  sourcingRequests,
  individualLearners,
  partnerClients,
} from "@/lib/lms-data";
import type { TalentPlacement } from "@/lib/lms-data";
import { useNav } from "@/lib/store";
import {
  PageHeader, SectionCard, StatCard, StatusBadge, EmptyState,
  Card, CardContent,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatDate, formatDateTime, daysUntil, timeAgo } from "@/lib/format";
import { ChartTooltip, TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  Handshake, Plus, Search, Building2, Clock, DollarSign, AlertTriangle,
  TrendingUp, Award, ShieldCheck, Filter, Coins,
} from "lucide-react";

// ---------- helpers ----------

function placementDisplayStatus(p: TalentPlacement): string {
  // map internal status to display badge tone
  if (p.status === "joined") return "hired";
  if (p.status === "offered") return "offer";
  if (p.status === "declined") return "declined";
  if (p.status === "left_within_guarantee") return "warning";
  return p.status;
}

function guaranteeDaysLeft(p: TalentPlacement): number {
  // Guarantee starts at joining date
  const join = new Date(p.joiningDate).getTime();
  const end = join + p.guaranteePeriodDays * 86400000;
  return Math.ceil((end - Date.now()) / 86400000);
}

// ---------- form schema ----------

const placementSchema = z.object({
  sourcingRequestId: z.string().min(1, "Select a sourcing request"),
  learnerId: z.string().min(1, "Select a candidate"),
  jobTitle: z.string().min(2, "Job title required"),
  salary: z.coerce.number().min(100000, "Salary seems too low"),
  joiningDate: z.string().min(1, "Joining date required"),
  commissionAmount: z.coerce.number().min(0),
  guaranteePeriodDays: z.coerce.number().min(0).max(365),
});
type PlacementFormValues = z.infer<typeof placementSchema>;

// ---------- main page ----------

export function TrainingPlacements() {
  const { navigate } = useNav();
  const [placements, setPlacements] = React.useState<TalentPlacement[]>(seedPlacements);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [employerFilter, setEmployerFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<TalentPlacement | null>(null);
  const [logOpen, setLogOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState("");

  const form = useForm<PlacementFormValues>({
    resolver: zodResolver(placementSchema) as Resolver<PlacementFormValues>,
    defaultValues: {
      sourcingRequestId: "", learnerId: "", jobTitle: "",
      salary: 2000000, joiningDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      commissionAmount: 50000, guaranteePeriodDays: 90,
    },
  });

  // Watch request to derive jobTitle + commission defaults
  const watchedReq = form.watch("sourcingRequestId");
  React.useEffect(() => {
    const req = sourcingRequests.find((r) => r.id === watchedReq);
    if (req) {
      form.setValue("jobTitle", req.role);
      if (req.commissionPerPlacement) form.setValue("commissionAmount", req.commissionPerPlacement);
    }
  }, [watchedReq, form]);

  const filtered = placements.filter((p) => {
    const matchSearch = !search ||
      p.learnerName.toLowerCase().includes(search.toLowerCase()) ||
      p.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.employerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchEmployer = employerFilter === "all" || p.employerName === employerFilter;
    return matchSearch && matchStatus && matchEmployer;
  });

  // KPIs
  const joined = placements.filter((p) => p.status === "joined").length;
  const totalCommission = placements.filter((p) => p.status === "joined" || p.status === "offered").reduce((s, p) => s + p.commissionAmount, 0);
  const totalEarned = placements.filter((p) => p.status === "joined").reduce((s, p) => s + p.commissionAmount, 0);
  // Avg time-to-place: from request createdAt to placedDate
  const placeTimes = placements.map((p) => {
    const req = sourcingRequests.find((r) => r.id === p.sourcingRequestId);
    if (!req) return null;
    return Math.round((new Date(p.placedDate).getTime() - new Date(req.createdAt).getTime()) / 86400000);
  }).filter((x): x is number => x !== null);
  const avgTimeToPlace = placeTimes.length ? Math.round(placeTimes.reduce((a, b) => a + b, 0) / placeTimes.length) : 0;

  const guaranteeActive = placements.filter((p) => p.status === "joined" && guaranteeDaysLeft(p) > 0).length;
  const atRisk = placements.filter((p) => p.status === "joined" && guaranteeDaysLeft(p) > 0 && guaranteeDaysLeft(p) <= 14).length;

  // Commission trend (synthetic)
  const trend = [
    { month: "May", commission: 0, placements: 0 },
    { month: "Jun", commission: 25000, placements: 1 },
    { month: "Jul", commission: 70000, placements: 1 },
    { month: "Aug", commission: 130000, placements: 2 },
    { month: "Sep", commission: 130000, placements: 2 },
    { month: "Oct", commission: 200000, placements: 3 },
  ];

  function onLog(values: PlacementFormValues) {
    const req = sourcingRequests.find((r) => r.id === values.sourcingRequestId);
    const learner = individualLearners.find((l) => l.id === values.learnerId);
    if (!req || !learner) { toast.error("Invalid selection"); return; }
    const newPlacement: TalentPlacement = {
      id: `tpl_new_${Date.now()}`,
      learnerId: learner.id, learnerName: learner.name,
      sourcingRequestId: req.id,
      jobTitle: values.jobTitle, employerName: req.employerName,
      placedDate: new Date().toISOString(),
      joiningDate: new Date(values.joiningDate).toISOString(),
      salary: values.salary, currency: "INR",
      commissionAmount: values.commissionAmount,
      status: "offered",
      guaranteePeriodDays: values.guaranteePeriodDays,
    };
    setPlacements((p) => [newPlacement, ...p]);
    setLogOpen(false);
    form.reset();
    setSelectedRequest("");
    toast.success(`Placement logged — ${learner.name}`, {
      description: `${values.jobTitle} at ${req.employerName} · Commission ${formatCurrency(values.commissionAmount)}`,
    });
  }

  function markJoined(p: TalentPlacement) {
    setPlacements((ps) => ps.map((x) => x.id === p.id ? { ...x, status: "joined" as const, joiningDate: new Date().toISOString() } : x));
    setDetail((d) => d && d.id === p.id ? { ...d, status: "joined" as const, joiningDate: new Date().toISOString() } : d);
    toast.success(`${p.learnerName} marked as joined`, { description: `${p.employerName} · guarantee period active for ${p.guaranteePeriodDays}d` });
  }

  function markDeclined(p: TalentPlacement) {
    setPlacements((ps) => ps.map((x) => x.id === p.id ? { ...x, status: "declined" as const } : x));
    setDetail((d) => d && d.id === p.id ? { ...d, status: "declined" as const } : d);
    toast.info(`${p.learnerName} declined the offer`, { description: "Commission forfeited. Candidate returns to active pool." });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Placements"
        description="Track candidate placements, joining status, commission earned, and guarantee-period risk. Recruiter & placement team view."
        icon={<Handshake className="h-6 w-6" />}
        actions={[{ label: "Log placement", icon: "Plus", onClick: () => setLogOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total placements" value={placements.length} icon={<Handshake className="h-5 w-5" />} tone="brand" />
        <StatCard label="Joined" value={joined} icon={<ShieldCheck className="h-5 w-5" />} tone="success" hint={`${placements.filter((p) => p.status === "offered").length} offers pending`} />
        <StatCard label="Commission earned" value={formatCurrency(totalEarned)} icon={<Coins className="h-5 w-5" />} tone="success" hint={`${formatCurrency(totalCommission)} in pipeline`} />
        <StatCard label="Avg time-to-place" value={`${avgTimeToPlace}d`} icon={<Clock className="h-5 w-5" />} hint={`${guaranteeActive} in guarantee · ${atRisk} at risk`} tone={atRisk > 0 ? "warning" : "default"} />
      </div>

      {atRisk > 0 && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-amber-700 dark:text-amber-400">{atRisk} placement(s) approaching guarantee-period expiry</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80">Reach out to the candidate and employer to confirm retention before guarantee lapses.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Commission trend" description="Earned + pipeline over the last 6 months" className="lg:col-span-2">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="cFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} tickFormatter={(v) => v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${v / 1000}K`} />
                <RTooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="commission" name="Commission (₹)" stroke="#10b981" strokeWidth={2} fill="url(#cFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Commission reconciliation" description="By employer">
          <div className="space-y-2">
            {partnerClients.slice(0, 5).map((c) => {
              const cPlacements = placements.filter((p) => p.employerName === c.name);
              const earned = cPlacements.filter((p) => p.status === "joined").reduce((s, p) => s + p.commissionAmount, 0);
              const pipeline = cPlacements.filter((p) => p.status === "offered").reduce((s, p) => s + p.commissionAmount, 0);
              return (
                <div key={c.id} className="flex items-center justify-between rounded-md border p-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{cPlacements.length} placement(s) · pipeline {formatCurrency(pipeline)}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(earned)}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by candidate, role, employer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="offered">Offered</SelectItem>
            <SelectItem value="joined">Joined</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="left_within_guarantee">Left (in guarantee)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={employerFilter} onValueChange={setEmployerFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Employer" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All employers</SelectItem>
            {Array.from(new Set(placements.map((p) => p.employerName))).map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Placements table */}
      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Handshake className="h-5 w-5" />}
            title="No placements yet"
            description="Log your first placement to start tracking commission and guarantee periods."
            action={<Button onClick={() => setLogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Log placement</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead>Joining</TableHead>
                  <TableHead>Guarantee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const gLeft = p.status === "joined" ? guaranteeDaysLeft(p) : null;
                  return (
                    <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(p)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={p.learnerName} size="sm" />
                          <span className="font-medium">{p.learnerName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{p.jobTitle}</TableCell>
                      <TableCell className="text-sm">{p.employerName}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatCurrency(p.salary)}</TableCell>
                      <TableCell className="text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(p.commissionAmount)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(p.placedDate)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(p.joiningDate)}</TableCell>
                      <TableCell>
                        {gLeft === null ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : gLeft > 14 ? (
                          <span className="text-xs text-muted-foreground">{gLeft}d left</span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{gLeft}d left</span>
                        )}
                      </TableCell>
                      <TableCell><StatusBadge status={placementDisplayStatus(p)} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail Sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && (
            <PlacementDetail
              placement={detail}
              onMarkJoined={() => markJoined(detail)}
              onMarkDeclined={() => markDeclined(detail)}
              navigate={navigate}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Log placement dialog */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log placement</DialogTitle>
            <DialogDescription>Record a candidate placement from a sourcing request. Commission is configurable per partner agreement.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onLog)} className="space-y-4">
            <div>
              <Label htmlFor="req">Sourcing request *</Label>
              <Select value={form.watch("sourcingRequestId")} onValueChange={(v) => { form.setValue("sourcingRequestId", v); setSelectedRequest(v); }}>
                <SelectTrigger id="req" className="mt-1"><SelectValue placeholder="Select request" /></SelectTrigger>
                <SelectContent>
                  {sourcingRequests.map((r) => <SelectItem key={r.id} value={r.id}>{r.title} — {r.employerName}</SelectItem>)}
                </SelectContent>
              </Select>
              {form.formState.errors.sourcingRequestId && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.sourcingRequestId.message}</p>}
            </div>
            <div>
              <Label htmlFor="learner">Candidate *</Label>
              <Select value={form.watch("learnerId")} onValueChange={(v) => form.setValue("learnerId", v)}>
                <SelectTrigger id="learner" className="mt-1"><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  {individualLearners.filter((l) => l.openToWork).map((l) => <SelectItem key={l.id} value={l.id}>{l.name} — {l.headline}</SelectItem>)}
                </SelectContent>
              </Select>
              {form.formState.errors.learnerId && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.learnerId.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="jt">Job title *</Label>
                <Input id="jt" {...form.register("jobTitle")} className="mt-1" />
                {form.formState.errors.jobTitle && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.jobTitle.message}</p>}
              </div>
              <div>
                <Label htmlFor="sal">Annual salary (₹) *</Label>
                <Input id="sal" type="number" min={100000} step={50000} {...form.register("salary")} className="mt-1" />
                {form.formState.errors.salary && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.salary.message}</p>}
                <p className="mt-1 text-[11px] text-muted-foreground">e.g. ₹24,00,000 (24L) for a senior engineer.</p>
              </div>
              <div>
                <Label htmlFor="jd">Joining date *</Label>
                <Input id="jd" type="date" {...form.register("joiningDate")} className="mt-1" />
                {form.formState.errors.joiningDate && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.joiningDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="comm">Commission amount (₹)</Label>
                <Input id="comm" type="number" min={0} step={5000} {...form.register("commissionAmount")} className="mt-1" />
                <p className="mt-1 text-[11px] text-muted-foreground">Default from request — editable per agreement.</p>
              </div>
              <div>
                <Label htmlFor="gp">Guarantee period (days)</Label>
                <Input id="gp" type="number" min={0} max={365} {...form.register("guaranteePeriodDays")} className="mt-1" />
                <p className="mt-1 text-[11px] text-muted-foreground">If candidate leaves within this period, commission may be refunded.</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Log placement</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- PlacementDetail ----------

function PlacementDetail({
  placement, onMarkJoined, onMarkDeclined, navigate,
}: {
  placement: TalentPlacement;
  onMarkJoined: () => void;
  onMarkDeclined: () => void;
  navigate: (portal: string, route: string) => void;
}) {
  const req = sourcingRequests.find((r) => r.id === placement.sourcingRequestId);
  const learner = individualLearners.find((l) => l.id === placement.learnerId);
  const gLeft = placement.status === "joined" ? guaranteeDaysLeft(placement) : null;
  const guaranteeProgress = placement.status === "joined" && gLeft !== null
    ? Math.max(0, Math.min(100, Math.round(((placement.guaranteePeriodDays - gLeft) / placement.guaranteePeriodDays) * 100)))
    : 0;

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={placement.learnerName} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg">{placement.learnerName}</SheetTitle>
              <StatusBadge status={placementDisplayStatus(placement)} />
            </div>
            <SheetDescription>{placement.jobTitle} · {placement.employerName}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-5 space-y-5">
        {/* Key info */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Annual salary</p>
            <p className="text-sm font-semibold">{formatCurrency(placement.salary)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Commission</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(placement.commissionAmount)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Effective rate</p>
            <p className="text-sm font-semibold">{((placement.commissionAmount / placement.salary) * 100).toFixed(2)}%</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Placed on</p>
            <p className="text-sm font-medium">{formatDate(placement.placedDate)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Joining date</p>
            <p className="text-sm font-medium">{formatDate(placement.joiningDate)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Guarantee period</p>
            <p className="text-sm font-medium">{placement.guaranteePeriodDays} days</p>
          </Card>
        </div>

        {/* Guarantee progress */}
        {placement.status === "joined" && gLeft !== null && (
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Guarantee period</p>
              <span className={`text-xs font-bold ${gLeft <= 14 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {gLeft > 0 ? `${gLeft} days remaining` : "Expired"}
              </span>
            </div>
            <Progress value={guaranteeProgress} className={`h-2 ${gLeft <= 14 ? "[&>div]:bg-amber-500" : ""}`} />
            {gLeft <= 14 && gLeft > 0 && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="mr-1 inline h-3 w-3" />At-risk: guarantee period expiring soon. Confirm retention.
              </p>
            )}
          </div>
        )}

        {/* Linked request + candidate */}
        {req && (
          <div className="rounded-lg border p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sourcing request</p>
            <p className="text-sm font-medium">{req.title}</p>
            <p className="text-xs text-muted-foreground">{req.role} · {req.employerName}</p>
            <Button size="sm" variant="link" className="mt-1 h-auto p-0 text-brand" onClick={() => navigate("training", "sourcing-requests")}>
              View all requests →
            </Button>
          </div>
        )}

        {learner && (
          <div className="rounded-lg border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Candidate profile</p>
            <div className="flex flex-wrap gap-1">
              {learner.skills.map((s) => <Badge key={s.name} variant="outline" className="text-[10px]">{s.name} · L{s.level}</Badge>)}
            </div>
            <Button size="sm" variant="link" className="mt-1 h-auto p-0 text-brand" onClick={() => navigate("training", "talent-search")}>
              Search talent pool →
            </Button>
          </div>
        )}

        {placement.status === "left_within_guarantee" && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3">
            <p className="font-medium text-rose-700 dark:text-rose-400">Candidate left within guarantee period</p>
            <p className="mt-1 text-xs text-rose-700/80 dark:text-rose-400/80">
              Commission of {formatCurrency(placement.commissionAmount)} may be refundable to {placement.employerName} per agreement terms. Initiate reconciliation.
            </p>
          </div>
        )}

        {/* Actions */}
        {placement.status === "offered" && (
          <SheetFooter className="flex-row gap-2">
            <Button onClick={onMarkJoined}><ShieldCheck className="mr-2 h-4 w-4" /> Mark as joined</Button>
            <Button variant="outline" className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-700" onClick={onMarkDeclined}>Declined</Button>
          </SheetFooter>
        )}
        {placement.status === "joined" && (
          <SheetFooter>
            <Button variant="outline" onClick={() => toast.info("Reconciliation report queued", { description: "Guarantee-period review scheduled." })}>
              <Coins className="mr-2 h-4 w-4" /> Reconcile commission
            </Button>
          </SheetFooter>
        )}
      </div>
    </>
  );
}
