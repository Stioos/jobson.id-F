"use client";

import * as React from "react";
import { campaigns, trainingCourses, corporateClients, type Campaign } from "@/lib/lms-data";
import { PageHeader, Card, CardTitle, CardContent, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { TenantDisclaimer, ChartCard } from "./_shared";
import { formatDate, formatNumber, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import {
  Plus, Megaphone, Mail, Smartphone, UserCheck, Target, Play, Pause,
  TrendingUp, Filter,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const TYPE_LABEL: Record<Campaign["type"], string> = {
  upskilling: "Upskilling",
  compliance: "Compliance",
  onboarding: "Onboarding",
  leadership: "Leadership",
  certification: "Certification",
};

const CHANNEL_LABEL: Record<Campaign["channel"], string> = {
  email: "Email",
  in_app: "In-app",
  sms: "SMS",
  manager: "Manager",
};

function ChannelIcon({ channel }: { channel: Campaign["channel"] }) {
  if (channel === "email") return <Mail className="h-3 w-3" />;
  if (channel === "sms") return <Smartphone className="h-3 w-3" />;
  if (channel === "manager") return <UserCheck className="h-3 w-3" />;
  return <Megaphone className="h-3 w-3" />;
}

export function TrainingCampaigns() {
  const [rows, setRows] = React.useState<Campaign[]>(campaigns);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<Campaign | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = rows.filter((r) => {
    const mt = typeFilter === "all" || r.type === typeFilter;
    const ms = statusFilter === "all" || r.status === statusFilter;
    return mt && ms;
  });

  const totalTarget = rows.reduce((s, r) => s + r.targetLearners, 0);
  const totalEnrolled = rows.reduce((s, r) => s + r.enrolled, 0);
  const totalCompleted = rows.reduce((s, r) => s + r.completed, 0);
  const activeCount = rows.filter((r) => r.status === "active").length;

  function toggleStatus(c: Campaign) {
    setRows((prev) =>
      prev.map((r) => r.id === c.id
        ? { ...r, status: r.status === "active" ? "scheduled" : "active" }
        : r,
      ),
    );
    toast.success(`${c.name} ${c.status === "active" ? "paused" : "launched"}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Campaigns"
        description="Drive enrollment through targeted training campaigns across channels."
        actions={[{ label: "Create campaign", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active campaigns" value={activeCount} icon={<Megaphone className="h-5 w-5" />} tone="brand" />
        <StatCard label="Target learners" value={formatNumber(totalTarget)} icon={<Target className="h-5 w-5" />} />
        <StatCard label="Enrolled" value={formatNumber(totalEnrolled)} icon={<UserCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Completed" value={formatNumber(totalCompleted)} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[170px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="upskilling">Upskilling</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="leadership">Leadership</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">{filtered.length} campaigns</span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState icon={<Megaphone className="h-6 w-6" />} title="No campaigns" description="Create your first campaign to start driving enrollments." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const enrolledPct = c.targetLearners > 0 ? Math.round((c.enrolled / c.targetLearners) * 100) : 0;
            const completedPct = c.enrolled > 0 ? Math.round((c.completed / c.enrolled) * 100) : 0;
            return (
              <Card key={c.id} className="cursor-pointer p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md" onClick={() => setDetail(c)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                      style={{ background: c.color }}
                    >
                      <Megaphone className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.clientName ?? "All clients"}</p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">{TYPE_LABEL[c.type]}</Badge>
                  <Badge variant="outline" className="text-[10px] gap-1"><ChannelIcon channel={c.channel} /> {CHANNEL_LABEL[c.channel]}</Badge>
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Enrollment</span>
                      <span className="font-medium">{formatNumber(c.enrolled)}/{formatNumber(c.targetLearners)} ({enrolledPct}%)</span>
                    </div>
                    <Progress value={enrolledPct} className="mt-1 h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-medium">{formatNumber(c.completed)} ({completedPct}%)</span>
                    </div>
                    <Progress value={completedPct} className="mt-1 h-1.5" />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {c.coursesIncluded.slice(0, 2).map((cid) => {
                    const course = trainingCourses.find((co) => co.id === cid);
                    return course ? (
                      <Badge key={cid} variant="outline" className="text-[10px]">{course.code}</Badge>
                    ) : null;
                  })}
                  {c.coursesIncluded.length > 2 && (
                    <Badge variant="outline" className="text-[10px]">+{c.coursesIncluded.length - 2}</Badge>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-muted-foreground">
                    Goal {c.goal}% · ends {formatDate(c.endDate)}
                  </span>
                  <Button
                    size="sm" variant="outline"
                    onClick={(e) => { e.stopPropagation(); toggleStatus(c); }}
                  >
                    {c.status === "active" ? (
                      <><Pause className="mr-1 h-3 w-3" /> Pause</>
                    ) : (
                      <><Play className="mr-1 h-3 w-3" /> Launch</>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => { if (!o) setDetail(null); }}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && <CampaignDetail campaign={detail} onToggle={() => { toggleStatus(detail); setDetail(null); }} />}
        </SheetContent>
      </Sheet>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create campaign</DialogTitle>
            <DialogDescription>Configure a new training campaign to drive enrollment.</DialogDescription>
          </DialogHeader>
          <CreateCampaignForm
            onCancel={() => setCreateOpen(false)}
            onSubmit={(vals) => {
              const newRow: Campaign = {
                id: `cmp_new_${Date.now()}`,
                name: vals.name,
                description: `New ${vals.type} campaign`,
                type: vals.type,
                clientId: vals.clientId || undefined,
                clientName: corporateClients.find((c) => c.id === vals.clientId)?.name,
                targetLearners: vals.targetLearners,
                enrolled: 0,
                completed: 0,
                startDate: vals.startDate,
                endDate: vals.endDate,
                goal: vals.goal,
                progress: 0,
                status: "draft",
                color: "oklch(0.55 0.13 165)",
                coursesIncluded: vals.courseIds,
                channel: vals.channel,
              };
              setRows((r) => [newRow, ...r]);
              setCreateOpen(false);
              toast.success(`Campaign created — ${vals.name}`);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CampaignDetail({ campaign, onToggle }: { campaign: Campaign; onToggle: () => void }) {
  const funnel = [
    { stage: "Targeted", value: campaign.targetLearners, color: "#94a3b8" },
    { stage: "Reached", value: Math.round(campaign.targetLearners * 0.85), color: "#0ea5e9" },
    { stage: "Enrolled", value: campaign.enrolled, color: "#10b981" },
    { stage: "In progress", value: campaign.enrolled - campaign.completed, color: "#f59e0b" },
    { stage: "Completed", value: campaign.completed, color: "#14b8a6" },
  ];
  const channelMix = [
    { name: "Email", value: Math.round(campaign.enrolled * 0.45), color: "#10b981" },
    { name: "In-app", value: Math.round(campaign.enrolled * 0.30), color: "#14b8a6" },
    { name: "Manager", value: Math.round(campaign.enrolled * 0.15), color: "#0ea5e9" },
    { name: "SMS", value: Math.round(campaign.enrolled * 0.10), color: "#f59e0b" },
  ];
  const mockLearners = React.useMemo(() => {
    const names = ["Priya Nair", "Arjun Iyer", "Kavya Reddy", "Vikram Singh", "Sahil Khan", "Meera Iyer", "Karthik Menon", "Divya Sharma"];
    return names.slice(0, Math.min(8, campaign.enrolled)).map((n, i) => ({
      id: `cl_${i}`, name: n,
      progress: Math.max(0, Math.min(100, Math.round((campaign.completed / Math.max(1, campaign.enrolled)) * 100 + (Math.random() - 0.5) * 40))),
      status: i < campaign.completed ? "completed" : i % 3 === 0 ? "lagging" : "active",
    }));
  }, [campaign]);

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
            style={{ background: campaign.color }}
          >
            <Megaphone className="h-6 w-6" />
          </span>
          <div>
            <SheetTitle>{campaign.name}</SheetTitle>
            <SheetDescription>{campaign.description}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="rounded-lg border p-2">
            <p className="text-base font-semibold">{formatNumber(campaign.targetLearners)}</p>
            <p className="text-muted-foreground">Target</p>
          </div>
          <div className="rounded-lg border p-2">
            <p className="text-base font-semibold text-brand">{formatNumber(campaign.enrolled)}</p>
            <p className="text-muted-foreground">Enrolled</p>
          </div>
          <div className="rounded-lg border p-2">
            <p className="text-base font-semibold text-emerald-600">{formatNumber(campaign.completed)}</p>
            <p className="text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-lg border p-2">
            <p className="text-base font-semibold">{campaign.goal}%</p>
            <p className="text-muted-foreground">Goal</p>
          </div>
        </div>

        <ChartCard title="Enrollment funnel" description="Targeted → reached → enrolled → completed">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {funnel.map((f, i) => (
                  <Cell key={i} fill={f.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Channel performance" description="Enrollments by channel">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={channelMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {channelMix.map((c) => (
                  <Cell key={c.name} fill={c.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-4">
          <CardTitle className="text-sm">Courses in this campaign</CardTitle>
          <div className="mt-2 space-y-2">
            {campaign.coursesIncluded.map((cid) => {
              const course = trainingCourses.find((c) => c.id === cid);
              return course ? (
                <div key={cid} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.code} · {course.category}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{course.difficulty}</Badge>
                </div>
              ) : null;
            })}
          </div>
        </Card>

        <Card className="p-4">
          <CardTitle className="text-sm">Sample enrolled learners</CardTitle>
          <div className="mt-2 max-h-72 space-y-2 overflow-y-auto scroll-thin">
            {mockLearners.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-[10px] font-semibold text-brand">
                    {l.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <span className="text-sm font-medium">{l.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={l.progress} className="h-1.5 w-16" />
                  <span className="text-xs">{l.progress}%</span>
                  <StatusBadge status={l.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="rounded-lg border bg-muted/30 p-3 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Timeline</span><span>{formatDate(campaign.startDate)} → {formatDate(campaign.endDate)}</span></div>
          <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Days remaining</span><span>{Math.max(0, daysUntil(campaign.endDate))}</span></div>
          <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Channel</span><span className="capitalize">{CHANNEL_LABEL[campaign.channel]}</span></div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onToggle}>
            {campaign.status === "active" ? <><Pause className="mr-1 h-3.5 w-3.5" /> Pause</> : <><Play className="mr-1 h-3.5 w-3.5" /> Launch</>}
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Reminder sent to non-enrolled learners")}>
            <Mail className="mr-1 h-3.5 w-3.5" /> Send reminder
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Campaign report downloaded")}>
            Export report
          </Button>
        </div>
      </div>
    </>
  );
}

function CreateCampaignForm({ onCancel, onSubmit }: {
  onCancel: () => void;
  onSubmit: (vals: {
    name: string;
    type: Campaign["type"];
    clientId: string;
    targetLearners: number;
    courseIds: string[];
    channel: Campaign["channel"];
    startDate: string;
    endDate: string;
    goal: number;
  }) => void;
}) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<Campaign["type"]>("upskilling");
  const [clientId, setClientId] = React.useState("");
  const [targetLearners, setTargetLearners] = React.useState("100");
  const [courseIds, setCourseIds] = React.useState<string[]>([]);
  const [channel, setChannel] = React.useState<Campaign["channel"]>("email");
  const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = React.useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [goal, setGoal] = React.useState("80");

  function toggleCourse(id: string) {
    setCourseIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }

  function submit() {
    if (!name.trim()) { toast.error("Campaign name is required"); return; }
    if (courseIds.length === 0) { toast.error("Select at least one course"); return; }
    onSubmit({
      name: name.trim(), type, clientId,
      targetLearners: Number(targetLearners) || 0,
      courseIds, channel, startDate, endDate,
      goal: Number(goal) || 0,
    });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="cn">Campaign name</Label>
        <Input id="cn" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q1 Frontend Upskilling" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as Campaign["type"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upskilling">Upskilling</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="leadership">Leadership</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Channel</Label>
          <Select value={channel} onValueChange={(v) => setChannel(v as Campaign["channel"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="in_app">In-app</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Client (optional)</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger><SelectValue placeholder="All clients" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All clients</SelectItem>
              {corporateClients.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tl">Target learners</Label>
          <Input id="tl" type="number" value={targetLearners} onChange={(e) => setTargetLearners(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Courses (multi-select)</Label>
        <div className="max-h-40 space-y-2 overflow-y-auto scroll-thin rounded-md border p-2">
          {trainingCourses.filter((c) => c.status === "published").map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={courseIds.includes(c.id)}
                onCheckedChange={() => toggleCourse(c.id)}
              />
              <span className="flex-1">{c.name}</span>
              <Badge variant="outline" className="text-[10px]">{c.code}</Badge>
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="sd">Start</Label>
          <Input id="sd" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ed">End</Label>
          <Input id="ed" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gl">Goal %</Label>
          <Input id="gl" type="number" value={goal} onChange={(e) => setGoal(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={submit}><Plus className="mr-2 h-4 w-4" /> Create</Button>
      </DialogFooter>
    </div>
  );
}
