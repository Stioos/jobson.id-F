"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { cohorts, liveSessions, corporateClients } from "@/lib/lms-data";
import type { Cohort } from "@/lib/types";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, CardDescription, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { TenantDisclaimer, ChartCard } from "./_shared";
import { formatDate, formatDateTime, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import {
  ArrowLeft, Users2, CheckCircle2, TrendingUp, Calendar, MapPin, Plus,
  Send, Megaphone, Video, Clock, GraduationCap, UserPlus,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";

interface MockLearner {
  id: string;
  name: string;
  email: string;
  progress: number;
  attendance: number;
  lastActive: string;
  status: "active" | "lagging" | "completed" | "overdue";
}

const FIRST_NAMES = ["Aarav", "Diya", "Vivaan", "Ananya", "Reyansh", "Ishaan", "Saanvi", "Aditya", "Myra", "Kabir", "Aanya", "Vihaan", "Pari", "Arjun", "Anika", "Neha", "Rohan", "Sara", "Krishna", "Tara", "Dhruv", "Kiara", "Ayaan", "Riya"];
const LAST_NAMES = ["Sharma", "Verma", "Patel", "Reddy", "Iyer", "Nair", "Gupta", "Mehta", "Singh", "Kapoor", "Rao", "Joshi", "Bose", "Khan", "Malhotra"];

function genLearners(count: number, cohortProgress: number): MockLearner[] {
  const out: MockLearner[] = [];
  for (let i = 0; i < count; i++) {
    const name = `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i + 3) % LAST_NAMES.length]}`;
    const progress = Math.max(0, Math.min(100, cohortProgress + Math.round((Math.random() - 0.4) * 50)));
    const attendance = 70 + Math.floor(Math.random() * 30);
    const daysBack = Math.floor(Math.random() * 7);
    const status: MockLearner["status"] =
      progress >= 100 ? "completed"
      : progress < 20 ? "lagging"
      : attendance < 75 ? "overdue"
      : "active";
    out.push({
      id: `ml_${i + 1}`,
      name,
      email: name.toLowerCase().replace(" ", ".") + "@client.com",
      progress,
      attendance,
      lastActive: new Date(Date.now() - daysBack * 86400000).toISOString(),
      status,
    });
  }
  return out;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  time: string;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "an_1", title: "Welcome to the cohort!", body: "Welcome everyone. Please review the schedule and join the kick-off session this week.", author: "Divya Sharma", time: "7 days ago" },
  { id: "an_2", title: "Module 1 materials posted", body: "Module 1 slides, code samples, and the lab guide are now available under Resources. Review before the next live session.", author: "Dr. Ananya Iyer", time: "5 days ago" },
  { id: "an_3", title: "Live session moved to 7:30 PM IST", body: "Due to a trainer conflict, Tuesday's live session will start 30 minutes later. Calendar invites updated.", author: "Divya Sharma", time: "2 days ago" },
  { id: "an_4", title: "Quiz 1 deadline extended", body: "Quiz 1 deadline extended by 2 days to accommodate the schedule change. New deadline: Friday 11:59 PM IST.", author: "Dr. Ananya Iyer", time: "1 day ago" },
];

export function TrainingCohortDetail({ id }: { id: string }) {
  const { navigate } = useNav();
  const cohort = React.useMemo(() => cohorts.find((c) => c.id === id), [id]);

  const [learners, setLearners] = React.useState<MockLearner[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [newLearnerName, setNewLearnerName] = React.useState("");
  const [newLearnerEmail, setNewLearnerEmail] = React.useState("");
  const [tab, setTab] = React.useState("learners");

  React.useEffect(() => {
    if (cohort) {
      setLearners(genLearners(cohort.learnerCount, cohort.progress));
    }
  }, [cohort]);

  if (!cohort) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("training", "cohorts")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to cohorts
        </Button>
        <EmptyState
          icon={<Users2 className="h-6 w-6" />}
          title="Cohort not found"
          description="This cohort does not exist."
          action={<Button onClick={() => navigate("training", "cohorts")}>Browse cohorts</Button>}
        />
      </div>
    );
  }

  const sessions = liveSessions.filter((s) => s.cohortId === cohort.id);
  const sessionsCompleted = sessions.filter((s) => s.status === "completed").length;
  const client = corporateClients.find((c) => c.id === cohort.clientId);

  const avgProgress = learners.length > 0
    ? Math.round(learners.reduce((s, l) => s + l.progress, 0) / learners.length)
    : cohort.progress;
  const avgAttendance = learners.length > 0
    ? Math.round(learners.reduce((s, l) => s + l.attendance, 0) / learners.length)
    : cohort.attendanceRate;

  // Progress distribution buckets
  const buckets = [
    { range: "0-25%", count: learners.filter((l) => l.progress < 25).length },
    { range: "25-50%", count: learners.filter((l) => l.progress >= 25 && l.progress < 50).length },
    { range: "50-75%", count: learners.filter((l) => l.progress >= 50 && l.progress < 75).length },
    { range: "75-100%", count: learners.filter((l) => l.progress >= 75).length },
  ];
  const attendanceTrend = [
    { week: "Wk 1", attendance: 92 },
    { week: "Wk 2", attendance: 88 },
    { week: "Wk 3", attendance: 94 },
    { week: "Wk 4", attendance: avgAttendance },
  ];
  const statusPie = [
    { name: "Active", value: learners.filter((l) => l.status === "active").length, color: "#10b981" },
    { name: "Lagging", value: learners.filter((l) => l.status === "lagging").length, color: "#f59e0b" },
    { name: "Overdue", value: learners.filter((l) => l.status === "overdue").length, color: "#ef4444" },
    { name: "Completed", value: learners.filter((l) => l.status === "completed").length, color: "#14b8a6" },
  ];

  function addLearner() {
    if (!newLearnerName.trim() || !newLearnerEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }
    const newLearner: MockLearner = {
      id: `ml_new_${Date.now()}`,
      name: newLearnerName.trim(),
      email: newLearnerEmail.trim(),
      progress: 0,
      attendance: 0,
      lastActive: new Date().toISOString(),
      status: "active",
    };
    setLearners((l) => [...l, newLearner]);
    setNewLearnerName("");
    setNewLearnerEmail("");
    setAddOpen(false);
    toast.success(`${newLearner.name} added to cohort`);
  }

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate("training", "cohorts")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to cohorts
      </Button>

      <PageHeader
        title={cohort.name}
        description={cohort.courseName}
        breadcrumbs={[
          { label: "Cohorts", onClick: () => navigate("training", "cohorts") },
          { label: cohort.name },
        ]}
        actions={[
          { label: "Message cohort", icon: "Send", variant: "outline", onClick: () => toast.success(`Message sent to all ${learners.length} learners`) },
          { label: "Add learners", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />
      <TenantDisclaimer />

      {/* Header info card */}
      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCell label="Course" value={cohort.courseName ?? "—"} icon={<GraduationCap className="h-4 w-4" />} />
          <InfoCell label="Trainer" value={cohort.trainerName} icon={<Users2 className="h-4 w-4" />} />
          <InfoCell label="Client" value={cohort.clientName ?? "—"} icon={<Icon name="Building2" className="h-4 w-4" />} />
          <InfoCell label="Status" value={<StatusBadge status={cohort.status} />} icon={<CheckCircle2 className="h-4 w-4" />} />
          <InfoCell label="Schedule" value={cohort.schedule} icon={<Calendar className="h-4 w-4" />} />
          <InfoCell label="Modality" value={<span className="capitalize">{cohort.modality}</span>} icon={<Video className="h-4 w-4" />} />
          <InfoCell label="Location" value={cohort.location ?? "Online"} icon={<MapPin className="h-4 w-4" />} />
          <InfoCell label="Timeline" value={`${formatDate(cohort.startDate)} → ${formatDate(cohort.endDate)}`} icon={<Clock className="h-4 w-4" />} />
        </div>
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Learners" value={learners.length} icon={<Users2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Avg attendance" value={`${avgAttendance}%`} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg progress" value={`${avgProgress}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Sessions done" value={`${sessionsCompleted}/${sessions.length || "—"}`} icon={<Video className="h-5 w-5" />} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="learners">Learners ({learners.length})</TabsTrigger>
          <TabsTrigger value="sessions">Sessions ({sessions.length})</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        {/* Learners tab */}
        <TabsContent value="learners" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Enrolled learners</CardTitle>
                <CardDescription>{learners.length} learners enrolled in this cohort</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
                <UserPlus className="mr-1 h-3.5 w-3.5" /> Add learners
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[480px] overflow-y-auto scroll-thin">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Last active</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {learners.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AvatarLogo text={l.name} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{l.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{l.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={l.progress} className="h-1.5 w-20" />
                            <span className="text-xs font-medium">{l.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs">{l.attendance}%</span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTime(l.lastActive)}
                        </TableCell>
                        <TableCell><StatusBadge status={l.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions tab */}
        <TabsContent value="sessions" className="mt-4">
          {sessions.length === 0 ? (
            <EmptyState
              icon={<Video className="h-6 w-6" />}
              title="No sessions scheduled"
              description="Live sessions for this cohort will appear here once scheduled."
              action={<Button onClick={() => navigate("training", "live-training")}>Schedule session</Button>}
            />
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <Card key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(s.date)} · {s.startTime} · {s.durationMinutes}m · <span className="capitalize">{s.platform}</span>
                      </p>
                      {s.attended !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          Attended: {s.attended}/{s.registered}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={s.status} />
                    {s.status === "completed" && s.recordingUrl ? (
                      <Button size="sm" variant="outline" onClick={() => toast.success("Opening recording…")}>
                        View recording
                      </Button>
                    ) : s.status === "scheduled" && s.meetingLink ? (
                      <Button size="sm" onClick={() => toast.success("Opening meeting link…")}>
                        Join
                      </Button>
                    ) : null}
                    <Button size="sm" variant="ghost" onClick={() => navigate("training", `live-training/${s.id}`)}>
                      Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Progress tab */}
        <TabsContent value="progress" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Progress distribution" description="Learners grouped by completion">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buckets}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Attendance trend" description="Weekly attendance rate">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Learner status mix" description="Active vs at-risk learners">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPie.filter((s) => s.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {statusPie.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <Card className="p-4">
              <CardTitle className="text-base">Cohort health snapshot</CardTitle>
              <CardDescription className="mt-1">Real-time engagement indicators</CardDescription>
              <div className="mt-3 space-y-2 text-sm">
                <HealthRow label="On-track learners" value={learners.filter((l) => l.status === "active" || l.status === "completed").length} total={learners.length} color="bg-emerald-500" />
                <HealthRow label="At-risk learners" value={learners.filter((l) => l.status === "lagging" || l.status === "overdue").length} total={learners.length} color="bg-amber-500" />
                <HealthRow label="Days remaining" value={Math.max(0, daysUntil(cohort.endDate))} total={Math.max(1, Math.round((new Date(cohort.endDate).getTime() - new Date(cohort.startDate).getTime()) / 86400000))} color="bg-brand" suffix=" days" />
              </div>
              {client && (
                <p className="mt-3 rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">
                  Client: <span className="font-medium text-foreground">{client.name}</span> · Account manager: {client.assignedAccountManager}
                </p>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Announcements tab */}
        <TabsContent value="announcements" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Cohort announcements</CardTitle>
                <CardDescription>Posts from trainers and account managers to the cohort</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("New announcement dialog opened")}>
                <Megaphone className="mr-1 h-3.5 w-3.5" /> New announcement
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_ANNOUNCEMENTS.map((a) => (
                <div key={a.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Megaphone className="mt-0.5 h-4 w-4 text-brand" />
                      <div>
                        <p className="text-sm font-medium">{a.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Posted by {a.author} · {a.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add learner dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add learners to cohort</DialogTitle>
            <DialogDescription>
              Add new learners to &quot;{cohort.name}&quot;. They will receive an enrollment invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="nl-name">Learner name</Label>
              <Input id="nl-name" value={newLearnerName} onChange={(e) => setNewLearnerName(e.target.value)} placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nl-email">Email</Label>
              <Input id="nl-email" type="email" value={newLearnerEmail} onChange={(e) => setNewLearnerEmail(e.target.value)} placeholder="name@company.com" />
            </div>
            <p className="text-xs text-muted-foreground">For bulk add, upload a CSV with name & email columns.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={addLearner}>
              <UserPlus className="mr-2 h-4 w-4" /> Add learner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCell({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-brand">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function HealthRow({ label, value, total, color, suffix = "" }: { label: string; value: number; total: number; color: string; suffix?: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}{suffix} ({pct}%)</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={"h-full " + color} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
