"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  individualLearners, learnerCourseEnrollments, learnerCertificates,
  trainingCourses, liveSessions,
} from "@/lib/lms-data";
import type { IndividualLearner } from "@/lib/lms-data";
import type { TrainingCourse } from "@/lib/types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Switch } from "@/components/ui/switch";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatDate, timeAgo } from "@/lib/format";
import {
  ChartCard, ChartTooltip, LearnerDisclaimer, SimulatedAiBadge, ThumbnailIcon,
  ProgressRing, StarRating, LEARNER_ID, learnerAchievementsFor,
} from "./_shared";
import { toast } from "sonner";
import {
  Flame, Trophy, GraduationCap, Award, Clock, Briefcase, Play, ArrowRight,
  Video, Calendar as CalendarIcon, ChevronRight, Zap,
} from "lucide-react";

const LEVEL_THRESHOLDS = [0, 500, 1500, 3500, 6000, 9000, 13000, 18000, 24000, 32000];

function levelBounds(points: number): { current: number; next: number } {
  for (let i = 0; i < LEVEL_THRESHOLDS.length - 1; i++) {
    if (points >= LEVEL_THRESHOLDS[i] && points < LEVEL_THRESHOLDS[i + 1]) {
      return { current: LEVEL_THRESHOLDS[i], next: LEVEL_THRESHOLDS[i + 1] };
    }
  }
  return { current: LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1], next: LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] };
}

export function LearnerOverview() {
  const { navigate } = useNav();
  const learner = individualLearners.find((l) => l.id === LEARNER_ID) as IndividualLearner;
  const myEnrollments = learnerCourseEnrollments.filter((e) => e.learnerId === LEARNER_ID);
  const myCerts = learnerCertificates.filter((c) => c.learnerId === LEARNER_ID);
  const myAchievements = learnerAchievementsFor(LEARNER_ID);

  const inProgress = myEnrollments.filter((e) => e.status === "in_progress");
  const completed = myEnrollments.filter((e) => e.status === "completed");
  const continueLearning = [...inProgress]
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
    .slice(0, 2);

  const featuredCourses = trainingCourses
    .filter((c) => c.status === "published" && !myEnrollments.some((e) => e.courseId === c.id))
    .slice(0, 3);

  const upcomingSessions = liveSessions
    .filter((s) => s.status === "scheduled" || s.status === "live")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const bounds = levelBounds(learner.points);
  const levelProgress = Math.round(
    ((learner.points - bounds.current) / (bounds.next - bounds.current)) * 100,
  );
  const pointsToNext = bounds.next - learner.points;

  // leaderboard rank
  const ranked = [...individualLearners].sort((a, b) => b.points - a.points);
  const rank = ranked.findIndex((l) => l.id === LEARNER_ID) + 1;

  // weekly learning goal (5h/week target)
  const weeklyGoalMinutes = 300;
  const weeklySpentMinutes = 184;
  const weeklyPct = Math.min(100, Math.round((weeklySpentMinutes / weeklyGoalMinutes) * 100));

  // 6-week learning hours trend (mock)
  const weeklyTrend = [
    { week: "W1", hours: 4.2 },
    { week: "W2", hours: 5.8 },
    { week: "W3", hours: 3.5 },
    { week: "W4", hours: 6.4 },
    { week: "W5", hours: 5.1 },
    { week: "W6", hours: 3.0 },
  ];

  const [openToWork, setOpenToWork] = React.useState(learner.openToWork);
  function toggleOpenToWork(v: boolean) {
    setOpenToWork(v);
    toast.success(v ? "You're now visible to recruiters as Open to Work" : "Open to Work turned off");
  }

  function courseById(id: string): TrainingCourse | undefined {
    return trainingCourses.find((c) => c.id === id);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${learner.name.split(" ")[0]} 👋`}
        description={`${learner.headline} · Level ${learner.level} · ${learner.points.toLocaleString("en-IN")} points`}
        icon={<Icon name="LayoutDashboard" className="h-6 w-6" />}
        actions={[
          { label: "Browse Courses", icon: "BookOpen", variant: "outline", onClick: () => navigate("candidate", "catalog") },
          { label: "My Learning", icon: "GraduationCap", onClick: () => navigate("candidate", "my-learning") },
        ]}
      />

      <LearnerDisclaimer />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Day Streak"
          value={`${learner.streak} days`}
          icon={<Flame className="h-5 w-5" />}
          tone="warning"
          hint="Keep it going!"
        />
        <StatCard
          label="Points & Level"
          value={`${learner.points.toLocaleString("en-IN")}`}
          icon={<Zap className="h-5 w-5" />}
          tone="brand"
          hint={`Level ${learner.level} · ${pointsToNext} pts to L${learner.level + 1}`}
        />
        <StatCard
          label="In Progress"
          value={inProgress.length}
          icon={<Play className="h-5 w-5" />}
          tone="default"
          hint={`${completed.length} completed`}
        />
        <StatCard
          label="Certificates"
          value={myCerts.length}
          icon={<Award className="h-5 w-5" />}
          tone="success"
          hint={`${myCerts.filter((c) => c.status === "active").length} active`}
        />
        <StatCard
          label="Learning Hours"
          value={`${learner.learningHours}h`}
          icon={<Clock className="h-5 w-5" />}
          tone="default"
          hint="Lifetime"
        />
        <StatCard
          label="Leaderboard"
          value={`#${rank}`}
          icon={<Trophy className="h-5 w-5" />}
          tone="brand"
          hint={`of ${individualLearners.length} learners`}
        />
      </div>

      {/* Continue learning + right rail */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Continue learning */}
          <SectionCard
            title="Continue learning"
            description="Pick up where you left off"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate("candidate", "my-learning")}>
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            }
          >
            {continueLearning.length === 0 ? (
              <EmptyState
                icon={<Play className="h-5 w-5" />}
                title="Nothing in progress yet"
                description="Browse the catalog to start your first course."
                action={<Button size="sm" onClick={() => navigate("candidate", "catalog")}>Browse courses</Button>}
              />
            ) : (
              <div className="space-y-3">
                {continueLearning.map((enr) => {
                  const course = courseById(enr.courseId);
                  if (!course) return null;
                  return (
                    <div
                      key={enr.id}
                      className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
                    >
                      <ThumbnailIcon color={course.thumbnailColor} icon={course.thumbnailIcon} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{course.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Last accessed {timeAgo(enr.lastAccessed)} · {Math.round(enr.timeSpentMinutes / 60)}h spent
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => navigate("candidate", `my-learning/${enr.courseId}`)}
                          >
                            <Play className="mr-1 h-3.5 w-3.5" /> Resume
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Progress value={enr.progress} className="h-1.5 flex-1" />
                          <span className="text-xs font-medium text-brand">{enr.progress}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Recommended for you */}
          <SectionCard
            title="Recommended for you"
            description="Courses matched to your skills & goals"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate("candidate", "recommendations")}>
                More <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {featuredCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate("candidate", `catalog/${c.id}`)}
                  className="group rounded-lg border p-3 text-left transition hover:border-brand/40 hover:shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <ThumbnailIcon color={c.thumbnailColor} icon={c.thumbnailIcon} size="sm" />
                    <SimulatedAiBadge />
                  </div>
                  <p className="line-clamp-2 text-sm font-semibold">{c.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.category}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <StarRating value={c.rating} count={c.ratingCount} />
                    <span className="font-semibold text-brand">₹{c.price.toLocaleString("en-IN")}</span>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Weekly learning goal chart */}
          <ChartCard
            title="Weekly learning hours"
            description={`Goal: ${Math.round(weeklyGoalMinutes / 60)}h / week · This week: ${(weeklySpentMinutes / 60).toFixed(1)}h`}
            action={
              <Badge variant="secondary" className="text-xs">
                {weeklyPct}% of weekly goal
              </Badge>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="oh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  name="Hours"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#oh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Open to work toggle */}
          <Card className={openToWork ? "border-brand/40 bg-brand/5" : ""}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm">Open to work</CardTitle>
                <CardDescription className="mt-1 text-xs">
                  Be discovered by recruiters from partner companies
                </CardDescription>
              </div>
              <Switch checked={openToWork} onCheckedChange={toggleOpenToWork} />
            </CardHeader>
            <CardContent>
              {openToWork ? (
                <div className="flex items-center gap-2 text-xs text-brand">
                  <Briefcase className="h-4 w-4" />
                  <span>You're visible to recruiters · {ranked.length - rank} above you on the leaderboard</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Turn this on to let partner recruiters find you for relevant roles.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Level progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {learner.level}
                </span>
                Level {learner.level} progress
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <ProgressRing value={levelProgress} size={84} label={`L${learner.level + 1}`} />
              <div className="text-sm">
                <p className="font-semibold">{learner.points.toLocaleString("en-IN")} pts</p>
                <p className="text-xs text-muted-foreground">
                  {pointsToNext.toLocaleString("en-IN")} more to reach Level {learner.level + 1}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 h-7"
                  onClick={() => navigate("candidate", "achievements")}
                >
                  View badges <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming live sessions */}
          <SectionCard
            title="Upcoming live sessions"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate("candidate", "calendar")}>
                All <ChevronRight className="h-4 w-4" />
              </Button>
            }
          >
            {upcomingSessions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No live sessions scheduled.</p>
            ) : (
              <ul className="space-y-2">
                {upcomingSessions.map((s) => (
                  <li key={s.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium">{s.title}</p>
                      {s.status === "live" ? (
                        <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-300">● LIVE</Badge>
                      ) : (
                        <StatusBadge status={s.status} />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.trainerName}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(s.date)} · {s.startTime}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => toast.success(`Joining "${s.title}"…`)}
                      >
                        <Video className="mr-1 h-3 w-3" /> Join
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Recent achievements */}
          <SectionCard
            title="Recent achievements"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate("candidate", "achievements")}>
                All <ChevronRight className="h-4 w-4" />
              </Button>
            }
          >
            <ul className="space-y-2">
              {myAchievements.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon name={a.icon} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">+{a.points}</Badge>
                </li>
              ))}
              {myAchievements.length === 0 && (
                <li className="py-4 text-center text-sm text-muted-foreground">No achievements yet — keep learning!</li>
              )}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
