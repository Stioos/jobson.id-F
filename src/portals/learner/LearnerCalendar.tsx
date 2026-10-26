"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { liveSessions, trainingCourses } from "@/lib/lms-data";
import type { LiveSession } from "@/lib/types";
import { PageHeader, SectionCard, EmptyState, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import { formatDate, formatDateTime, daysUntil } from "@/lib/format";
import {
  LearnerDisclaimer, ThumbnailIcon, durationLabel, LEARNER_ID,
} from "./_shared";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon, Video, Clock, MapPin, Link as LinkIcon,
  Play, Plus, Download, Users, ChevronLeft, ChevronRight, Radio,
} from "lucide-react";

function platformIcon(p: string) {
  return <Video className="h-3.5 w-3.5" />;
}

function startOfWeek(d: Date): Date {
  const r = new Date(d);
  const day = r.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start
  r.setDate(r.getDate() + diff);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function LearnerCalendar() {
  const { navigate } = useNav();
  const [tab, setTab] = React.useState("upcoming");
  const [view, setView] = React.useState<"list" | "week">("list");
  const [weekStart, setWeekStart] = React.useState(startOfWeek(new Date()));

  // Aditya is "registered" for all live sessions in the demo data
  const allSessions = [...liveSessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const now = Date.now();
  const upcoming = allSessions.filter((s) => new Date(s.date).getTime() >= now);
  const past = allSessions.filter((s) => new Date(s.date).getTime() < now);

  const list = tab === "upcoming" ? upcoming : past;

  // Build week view data
  const weekDays = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const ds = d.toDateString();
      const daySessions = allSessions.filter((s) => new Date(s.date).toDateString() === ds);
      return { date: d, sessions: daySessions };
    });
  }, [weekStart, allSessions]);

  function join(s: LiveSession) {
    if (s.meetingLink) {
      toast.success(`Joining "${s.title}"…`, { description: `Opening ${s.platform} meeting` });
    } else {
      toast.info(`This is an in-person session at ${s.location ?? "the venue"}`);
    }
  }
  function addToCalendar(s: LiveSession) {
    toast.success(`Added "${s.title}" to your calendar`, {
      description: `${formatDate(s.date)} · ${s.startTime} IST`,
    });
  }
  function viewRecording(s: LiveSession) {
    if (s.recordingUrl) {
      toast.success("Opening recording…");
    } else {
      toast.info("Recording not yet available");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Sessions"
        description="Live sessions, office hours, and workshops you're registered for."
        icon={<CalendarIcon className="h-5 w-5" />}
        actions={[
          {
            label: view === "list" ? "Week view" : "List view",
            icon: view === "list" ? "Calendar" : "ListChecks",
            variant: "outline",
            onClick: () => setView(view === "list" ? "week" : "list"),
          },
        ]}
      />

      <LearnerDisclaimer />

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming</p>
          <p className="mt-1 text-2xl font-bold text-brand">{upcoming.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Past</p>
          <p className="mt-1 text-2xl font-bold">{past.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Live now</p>
          <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {allSessions.filter((s) => s.status === "live").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total hours</p>
          <p className="mt-1 text-2xl font-bold">
            {Math.round(allSessions.reduce((s, x) => s + x.durationMinutes, 0) / 60)}h
          </p>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {view === "list" ? (
            list.length === 0 ? (
              <EmptyState
                icon={<CalendarIcon className="h-5 w-5" />}
                title={tab === "upcoming" ? "No upcoming sessions" : "No past sessions"}
                description={
                  tab === "upcoming"
                    ? "Browse the catalog to enroll in courses with live sessions."
                    : "Past sessions and their recordings will appear here."
                }
                action={tab === "upcoming" ? <Button variant="outline" size="sm" onClick={() => navigate("candidate", "catalog")}>Browse catalog</Button> : undefined}
              />
            ) : (
              <div className="space-y-3">
                {list.map((s) => {
                  const course = trainingCourses.find((c) => c.id === s.courseId);
                  const daysTo = daysUntil(s.date);
                  return (
                    <Card key={s.id} className={s.status === "live" ? "border-rose-500/40 bg-rose-500/5" : ""}>
                      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                        {/* Date block */}
                        <div className="flex items-center gap-3 sm:w-32 sm:flex-col sm:items-start sm:gap-0">
                          <div className="rounded-lg border bg-muted/30 p-2 text-center sm:w-full">
                            <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                              {new Date(s.date).toLocaleDateString("en-IN", { month: "short" })}
                            </p>
                            <p className="text-xl font-bold leading-none">
                              {new Date(s.date).getDate()}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(s.date).toLocaleDateString("en-IN", { weekday: "short" })}
                            </p>
                          </div>
                          {s.status === "live" && (
                            <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-300">
                              <Radio className="mr-1 h-3 w-3 animate-pulse" /> LIVE
                            </Badge>
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">{s.title}</p>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <AvatarLogo text={s.trainerName} size="xs" className="mr-1" />
                                {s.trainerName}
                                {course && (
                                  <>
                                    <span>·</span>
                                    <button
                                      onClick={() => navigate("candidate", `catalog/${course.id}`)}
                                      className="hover:text-brand"
                                    >
                                      {course.code}
                                    </button>
                                  </>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <StatusBadge status={s.status} />
                              <Badge variant="outline" className="text-[10px] capitalize">
                                {platformIcon(s.platform)}
                                <span className="ml-1">{s.platform}</span>
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {s.startTime} · {durationLabel(s.durationMinutes)}
                            </span>
                            {s.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {s.location}
                              </span>
                            )}
                            {s.meetingLink && (
                              <span className="flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" /> {s.platform} link ready
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {s.registered}/{s.capacity} registered
                            </span>
                            {tab === "upcoming" && daysTo >= 0 && (
                              <span className="font-medium text-brand">
                                in {daysTo === 0 ? "today" : daysTo === 1 ? "1 day" : `${daysTo} days`}
                              </span>
                            )}
                            {tab === "past" && s.attended !== undefined && (
                              <Badge variant="secondary" className="text-[10px]">
                                {s.attended ? "Attended" : "Missed"}
                              </Badge>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {tab === "upcoming" ? (
                              <>
                                <Button size="sm" onClick={() => join(s)}>
                                  <Play className="mr-1 h-3.5 w-3.5" /> Join
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addToCalendar(s)}
                                >
                                  <Plus className="mr-1 h-3.5 w-3.5" /> Add to calendar
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewRecording(s)}
                                disabled={!s.recordingUrl}
                              >
                                <Video className="mr-1 h-3.5 w-3.5" /> View recording
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )
          ) : (
            // Week view
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const w = new Date(weekStart);
                    w.setDate(w.getDate() - 7);
                    setWeekStart(w);
                  }}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Prev week
                </Button>
                <p className="text-sm font-medium">
                  {formatDate(weekStart.toISOString())} —{" "}
                  {formatDate(new Date(weekStart.getTime() + 6 * 86400000).toISOString())}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const w = new Date(weekStart);
                    w.setDate(w.getDate() + 7);
                    setWeekStart(w);
                  }}
                >
                  Next week <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
                {weekDays.map(({ date, sessions }) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={date.toISOString()}
                      className={
                        "min-h-[120px] rounded-lg border p-2 " +
                        (isToday ? "border-brand/40 bg-brand/5" : "")
                      }
                    >
                      <p className="mb-1 text-xs font-semibold">
                        {date.toLocaleDateString("en-IN", { weekday: "short" })}
                      </p>
                      <p className="mb-2 text-lg font-bold">
                        {date.getDate()}
                      </p>
                      <div className="space-y-1">
                        {sessions.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => join(s)}
                            className="block w-full rounded border border-brand/30 bg-brand/10 p-1.5 text-left text-[10px] hover:bg-brand/20"
                          >
                            <p className="font-medium text-brand">{s.startTime}</p>
                            <p className="line-clamp-2 text-foreground">{s.title}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
