"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { liveSessions, trainingCourses } from "@/lib/lms-data";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, CardDescription, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TenantDisclaimer } from "./_shared";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import {
  ArrowLeft, Video, Calendar, MapPin, Users2, Star, Play,
  Download, AlertTriangle, Link as LinkIcon, CheckCircle2,
  XCircle, Radio, TrendingUp,
} from "lucide-react";

interface MockChat {
  id: string;
  author: string;
  initials: string;
  color: string;
  message: string;
  time: string;
}

interface MockFeedback {
  id: string;
  learner: string;
  initials: string;
  color: string;
  rating: number;
  comment: string;
  time: string;
}

interface MockAttendee {
  id: string;
  name: string;
  email: string;
  registered: boolean;
  attended: boolean;
  joinTime?: string;
  durationMinutes: number;
}

const CHAT_MESSAGES: MockChat[] = [
  { id: "c1", author: "Sneha Kapoor", initials: "SK", color: "oklch(0.6 0.13 300)", message: "Quick question — is the recording going to be available after?", time: "19:05" },
  { id: "c2", author: "Dr. Ananya Iyer", initials: "AI", color: "oklch(0.55 0.13 165)", message: "Yes, recording will be posted within 2 hours after the session.", time: "19:06" },
  { id: "c3", author: "Vikram Singh", initials: "VS", color: "oklch(0.6 0.16 70)", message: "The slide showing concurrent rendering vs sync rendering is gold.", time: "19:14" },
  { id: "c4", author: "Meera Iyer", initials: "MI", color: "oklch(0.55 0.13 200)", message: "Could you share the eval notebook from the demo?", time: "19:22" },
  { id: "c5", author: "Dr. Ananya Iyer", initials: "AI", color: "oklch(0.55 0.13 165)", message: "Yes — uploading to Resources now. Look for react19-concurrent-demo.zip", time: "19:23" },
  { id: "c6", author: "Arjun Iyer", initials: "AI", color: "oklch(0.58 0.2 25)", message: "Can useTransition be used with async data fetching?", time: "19:31" },
  { id: "c7", author: "Dr. Ananya Iyer", initials: "AI", color: "oklch(0.55 0.13 165)", message: "Yes — wrap the fetch in startTransition. We'll cover that in module 2.", time: "19:32" },
  { id: "c8", author: "Priya Nair", initials: "PN", color: "oklch(0.62 0.16 155)", message: "This is super clear. Thanks Ananya!", time: "19:45" },
];

const FEEDBACK: MockFeedback[] = [
  { id: "f1", learner: "Priya Nair", initials: "PN", color: "oklch(0.62 0.16 155)", rating: 5, comment: "Best live session I've attended this year. Loved the live coding.", time: "2 hours ago" },
  { id: "f2", learner: "Vikram Singh", initials: "VS", color: "oklch(0.6 0.16 70)", rating: 5, comment: "Concurrent rendering finally makes sense. The diagrams helped.", time: "3 hours ago" },
  { id: "f3", learner: "Meera Iyer", initials: "MI", color: "oklch(0.55 0.13 200)", rating: 4, comment: "Great content. Could use 10 more minutes of Q&A at the end.", time: "5 hours ago" },
  { id: "f4", learner: "Sneha Kapoor", initials: "SK", color: "oklch(0.6 0.13 300)", rating: 5, comment: "Ananya is an excellent trainer. Practical examples throughout.", time: "6 hours ago" },
  { id: "f5", learner: "Arjun Iyer", initials: "AI", color: "oklch(0.58 0.2 25)", rating: 4, comment: "Audio had a brief glitch around minute 30 but otherwise perfect.", time: "8 hours ago" },
];

function genAttendees(registered: number, attended: number): MockAttendee[] {
  const out: MockAttendee[] = [];
  const names = ["Priya Nair", "Arjun Iyer", "Kavya Reddy", "Vikram Singh", "Sahil Khan", "Meera Iyer", "Karthik Menon", "Divya Sharma", "Sneha Kapoor", "Rahul Bose", "Anjali Rao", "Sanjay Gupta"];
  for (let i = 0; i < registered; i++) {
    const didAttend = i < attended;
    out.push({
      id: `att_${i + 1}`,
      name: names[i % names.length],
      email: names[i % names.length].toLowerCase().replace(" ", ".") + "@client.com",
      registered: true,
      attended: didAttend,
      joinTime: didAttend ? `${19 + Math.floor(i / 12)}:${(i * 3 % 60).toString().padStart(2, "0")}` : undefined,
      durationMinutes: didAttend ? 60 + Math.floor(Math.random() * 60) : 0,
    });
  }
  return out;
}

export function TrainingLiveSessionDetail({ id }: { id: string }) {
  const { navigate } = useNav();
  const session = React.useMemo(() => liveSessions.find((s) => s.id === id), [id]);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const [confirmResched, setConfirmResched] = React.useState(false);
  const [attendees, setAttendees] = React.useState<MockAttendee[]>([]);

  React.useEffect(() => {
    if (session) {
      setAttendees(genAttendees(session.registered, session.attended ?? Math.round(session.registered * 0.88)));
    }
  }, [session]);

  if (!session) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("training", "live-training")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to live training
        </Button>
        <EmptyState
          icon={<Video className="h-6 w-6" />}
          title="Live session not found"
          description="This session does not exist."
          action={<Button onClick={() => navigate("training", "live-training")}>Browse sessions</Button>}
        />
      </div>
    );
  }

  const course = trainingCourses.find((c) => c.id === session.courseId);
  const registered = attendees.length;
  const attended = attendees.filter((a) => a.attended).length;
  const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 0;
  const avgRating = FEEDBACK.length > 0 ? (FEEDBACK.reduce((s, f) => s + f.rating, 0) / FEEDBACK.length).toFixed(1) : "—";

  const isLive = session.status === "live";
  const isScheduled = session.status === "scheduled";
  const isCompleted = session.status === "completed";

  function confirmCancelSession() {
    setConfirmCancel(false);
    toast.success("Session cancelled — learners notified");
  }
  function confirmReschedule() {
    setConfirmResched(false);
    toast.success("Reschedule dialog opened — pick new date/time");
  }

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate("training", "live-training")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to live training
      </Button>

      <PageHeader
        title={session.title}
        description={`Led by ${session.trainerName}${course ? ` · ${course.name}` : ""}`}
        breadcrumbs={[
          { label: "Live training", onClick: () => navigate("training", "live-training") },
          { label: session.title },
        ]}
        actions={
          isLive || isScheduled
            ? [
              ...(isScheduled ? [{ label: "Start session", icon: "Radio", onClick: () => toast.success("Session started — you are now live") }] : []),
              { label: "Join meeting", icon: "Video", onClick: () => toast.success("Opening meeting link…") },
              ]
            : isCompleted
              ? [{ label: "View recording", icon: "Play", variant: "outline" as const, onClick: () => toast.success("Opening recording…") }]
              : []
        }
      />
      <TenantDisclaimer />

      {/* Hero / status banner */}
      <Card className={"p-4 " + (isLive ? "border-rose-500/40 bg-rose-500/5" : isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : "")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isLive && (
              <span className="flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <Radio className="h-3.5 w-3.5 animate-pulse" /> LIVE NOW
              </span>
            )}
            <StatusBadge status={session.status} />
            <span className="text-sm font-medium capitalize">{session.platform} · {session.modality}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(session.date)} · {session.startTime} · {session.durationMinutes}m
            {session.location && (
              <>
                <MapPin className="ml-2 h-3.5 w-3.5" />
                {session.location}
              </>
            )}
          </div>
        </div>
        {session.meetingLink && (isLive || isScheduled) && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border bg-card p-2.5">
            <LinkIcon className="h-4 w-4 text-brand" />
            <code className="flex-1 truncate text-xs">{session.meetingLink}</code>
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(session.meetingLink ?? "").catch(() => {}); toast.success("Meeting link copied"); }}>
              Copy
            </Button>
          </div>
        )}
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered" value={registered} icon={<Users2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Attended" value={attended} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Attendance rate" value={`${attendanceRate}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Avg rating" value={avgRating} icon={<Star className="h-5 w-5" />} hint={isCompleted ? "Post-session" : "Not yet rated"} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">Attendees ({attendees.length})</TabsTrigger>
          <TabsTrigger value="chat">Chat transcript</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          {isCompleted && <TabsTrigger value="recording">Recording</TabsTrigger>}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-4 lg:col-span-2">
              <CardTitle className="text-base">Session description</CardTitle>
              <CardDescription className="mt-1">
                {course ? `${course.name} · ${course.category}` : "Standalone session"}
              </CardDescription>
              <p className="mt-3 text-sm text-muted-foreground">
                {session.title} is a {session.durationMinutes}-minute live training session led by {session.trainerName}.
                This session covers practical, hands-on content with live coding demos, real-world examples,
                and dedicated Q&A. {session.modality === "online" ? "Join from anywhere — link provided above." : session.modality === "offline" ? `In-person at ${session.location ?? "the venue"}.` : "Hybrid format — join in person or online."}
              </p>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Agenda</p>
                <ol className="mt-2 space-y-1.5 text-sm">
                  {[
                    { t: "0:00", item: "Welcome & introductions" },
                    { t: "0:05", item: "Concept overview" },
                    { t: "0:20", item: "Live coding demo" },
                    { t: "0:50", item: `Q&A (${Math.round(session.durationMinutes / 6)} min)` },
                    { t: `${Math.floor(session.durationMinutes / 60)}:${(session.durationMinutes % 60).toString().padStart(2, "0")}`, item: "Wrap-up & next steps" },
                  ].map((a, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-md border p-2">
                      <span className="font-mono text-xs text-brand">{a.t}</span>
                      <span className="flex-1">{a.item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>

            <Card className="p-4">
              <CardTitle className="text-base">Learning objectives</CardTitle>
              <ul className="mt-3 space-y-2 text-sm">
                {(course?.objectives ?? [
                  "Understand core concepts and terminology",
                  "Apply patterns in real-world scenarios",
                  "Troubleshoot common issues",
                  "Build confidence through hands-on practice",
                ]).slice(0, 4).map((o, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-muted/40 p-3 text-xs">
                <p className="font-semibold">Trainer</p>
                <p className="mt-1 text-muted-foreground">{session.trainerName}</p>
                {course && <p className="text-muted-foreground">Course: {course.code}</p>}
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <CardTitle className="text-base">Session actions</CardTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {isScheduled && (
                <Button size="sm" onClick={() => toast.success("Session started — you are now live")}>
                  <Radio className="mr-1 h-3.5 w-3.5" /> Start session
                </Button>
              )}
              {(isLive || isScheduled) && session.meetingLink && (
                <Button size="sm" variant={isLive ? "default" : "outline"} onClick={() => toast.success("Opening meeting link…")}>
                  <Video className="mr-1 h-3.5 w-3.5" /> Join meeting
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setConfirmResched(true)}>
                <Calendar className="mr-1 h-3.5 w-3.5" /> Reschedule
              </Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmCancel(true)}>
                <AlertTriangle className="mr-1 h-3.5 w-3.5 text-rose-500" /> Cancel session
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Session link copied to clipboard")}>
                <LinkIcon className="mr-1 h-3.5 w-3.5" /> Copy link
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Attendees */}
        <TabsContent value="attendees" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendees ({attendees.length})</CardTitle>
              <CardDescription>
                {attended} of {registered} attended · {attendanceRate}% attendance rate
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[480px] overflow-y-auto scroll-thin">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="p-3">Learner</th>
                      <th className="p-3">Registered</th>
                      <th className="p-3">Attended</th>
                      <th className="p-3">Join time</th>
                      <th className="p-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((a) => (
                      <tr key={a.id} className="border-b last:border-0">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-[10px] font-semibold text-brand">
                              {a.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                            </span>
                            <div>
                              <p className="text-sm font-medium">{a.name}</p>
                              <p className="text-xs text-muted-foreground">{a.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          {a.registered ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                        </td>
                        <td className="p-3">
                          {a.attended ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-rose-500" />}
                        </td>
                        <td className="p-3 font-mono text-xs">{a.joinTime ?? "—"}</td>
                        <td className="p-3 text-xs">{a.durationMinutes > 0 ? `${a.durationMinutes}m` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat transcript */}
        <TabsContent value="chat" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chat transcript</CardTitle>
              <CardDescription>{CHAT_MESSAGES.length} messages during the session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[480px] space-y-3 overflow-y-auto scroll-thin">
                {CHAT_MESSAGES.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                      style={{ background: c.color }}
                    >
                      {c.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <p className="text-sm font-medium">{c.author}</p>
                        <span className="font-mono text-xs text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline" onClick={() => toast.success("Transcript downloaded")}>
                  <Download className="mr-1 h-3.5 w-3.5" /> Download transcript
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback */}
        <TabsContent value="feedback" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-4">
              <CardTitle className="text-base">Rating summary</CardTitle>
              <div className="mt-3 space-y-2">
                {[5, 4, 3, 2, 1].map((r) => {
                  const count = FEEDBACK.filter((f) => f.rating === r).length;
                  const pct = FEEDBACK.length > 0 ? Math.round((count / FEEDBACK.length) * 100) : 0;
                  return (
                    <div key={r} className="flex items-center gap-2 text-xs">
                      <span className="w-6">{r}★</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-right text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 rounded-lg bg-brand/5 p-3 text-center">
                <p className="text-2xl font-bold text-brand">{avgRating}</p>
                <p className="text-xs text-muted-foreground">{FEEDBACK.length} ratings</p>
              </div>
            </Card>

            <Card className="p-4 lg:col-span-2">
              <CardTitle className="text-base">Learner comments</CardTitle>
              <div className="mt-3 max-h-[420px] space-y-3 overflow-y-auto scroll-thin">
                {FEEDBACK.map((f) => (
                  <div key={f.id} className="flex gap-3 border-b pb-3 last:border-0">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                      style={{ background: f.color }}
                    >
                      {f.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{f.learner}</p>
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={"h-3 w-3 " + (i < f.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground")}
                            />
                          ))}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{f.comment}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{f.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Recording */}
        {isCompleted && (
          <TabsContent value="recording" className="mt-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/40 to-slate-900" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <button
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur transition hover:scale-105 hover:bg-white/30"
                    onClick={() => toast.success("Playing recording…")}
                    aria-label="Play recording"
                  >
                    <Play className="ml-1 h-7 w-7 fill-white text-white" />
                  </button>
                  <p className="mt-3 text-sm font-medium">{session.title} — Recording</p>
                  <p className="text-xs text-white/80">{session.durationMinutes} minutes · {session.date.split("T")[0]}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Session recording</p>
                    <p className="text-xs text-muted-foreground">
                      {session.recordingUrl ?? "https://recordings.skillforge.academy/" + session.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.success("Downloading recording…")}>
                      <Download className="mr-1 h-3.5 w-3.5" /> Download MP4
                    </Button>
                    <Button size="sm" onClick={() => toast.success("Recording link copied")}>
                      <LinkIcon className="mr-1 h-3.5 w-3.5" /> Copy link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Cancel confirm */}
      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this session?</AlertDialogTitle>
            <AlertDialogDescription>
              {registered} registered learners will be notified. The session will be removed from the calendar. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep session</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelSession}>Yes, cancel session</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule confirm */}
      <AlertDialog open={confirmResched} onOpenChange={setConfirmResched}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule session?</AlertDialogTitle>
            <AlertDialogDescription>
              All {registered} registered learners will receive a calendar update with the new time. The current meeting link will remain valid.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReschedule}>Open reschedule</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
