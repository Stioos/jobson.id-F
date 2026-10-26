"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  individualLearners, gamificationConfig,
} from "@/lib/lms-data";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import {
  LearnerDisclaimer, ProgressRing, LEARNER_ID, learnerAchievementsFor,
} from "./_shared";
import { timeAgo } from "@/lib/format";
import { toast } from "sonner";
import {
  Trophy, Flame, Zap, Crown, Brain, Rocket, Award, TrendingUp, Sparkles,
  Medal, Target,
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

// GitHub-style 90-day streak grid (mock deterministic data)
function generateStreakGrid(streak: number): number[] {
  const days = 90;
  const grid: number[] = [];
  // Seed values: high activity in last `streak` days
  for (let i = 0; i < days; i++) {
    const daysFromEnd = days - i;
    if (daysFromEnd <= streak) {
      // Active — random learning intensity 1..4
      grid.push(1 + ((i * 7) % 4));
    } else if (i % 7 === 0 || i % 5 === 0) {
      grid.push(1 + ((i * 3) % 3));
    } else if (i % 3 === 0) {
      grid.push(1);
    } else {
      grid.push(0);
    }
  }
  return grid;
}

function intensityClass(v: number): string {
  if (v === 0) return "bg-muted";
  if (v === 1) return "bg-brand/30";
  if (v === 2) return "bg-brand/55";
  if (v === 3) return "bg-brand/80";
  return "bg-brand";
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="h-5 w-5" />,
  Flame: <Flame className="h-5 w-5" />,
  Trophy: <Trophy className="h-5 w-5" />,
  Brain: <Brain className="h-5 w-5" />,
  Crown: <Crown className="h-5 w-5" />,
  Award: <Award className="h-5 w-5" />,
  ShieldCheck: <Icon name="ShieldCheck" className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
};

export function LearnerAchievements() {
  const { navigate } = useNav();
  const learner = individualLearners.find((l) => l.id === LEARNER_ID)!;
  const achievements = learnerAchievementsFor(LEARNER_ID);

  const bounds = levelBounds(learner.points);
  const levelProgress = Math.round(
    ((learner.points - bounds.current) / (bounds.next - bounds.current)) * 100,
  );
  const pointsToNext = bounds.next - learner.points;

  // Badges from gamificationConfig.badgeThresholds
  const badges = gamificationConfig.badgeThresholds.map((b) => ({
    ...b,
    earned: learner.points >= b.points,
  }));

  // Streak grid (last 90 days)
  const streakGrid = generateStreakGrid(learner.streak);

  // Leaderboard (top 10 by points)
  const leaderboard = [...individualLearners]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);
  const myRank = leaderboard.findIndex((l) => l.id === LEARNER_ID) + 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        description="Your points, badges, streaks, and rank on the SkillForge leaderboard."
        icon={<Trophy className="h-5 w-5" />}
        actions={[
          { label: "View certificates", icon: "Award", variant: "outline", onClick: () => navigate("candidate", "certificates") },
        ]}
      />

      <LearnerDisclaimer />

      {/* Simulated note */}
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
        <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-muted-foreground">
          Gamification is <span className="font-medium">simulated</span> for this demo — points and badges are illustrative.
        </span>
      </div>

      {/* Points & level */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-brand" /> Points & Level
            </CardTitle>
            <CardDescription>Earn points by completing courses, quizzes, and live sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <ProgressRing value={levelProgress} size={120} label={`L${learner.level + 1}`} />
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{learner.points.toLocaleString("en-IN")}</span>
                    <span className="text-sm text-muted-foreground">lifetime points</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Badge className="bg-brand/15 text-brand">
                      <span className="mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                        {learner.level}
                      </span>
                      Level {learner.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {pointsToNext.toLocaleString("en-IN")} pts to Level {learner.level + 1}
                    </span>
                  </div>
                </div>
                <Progress value={levelProgress} className="h-2" />
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border p-2">
                    <p className="text-xs text-muted-foreground">Per course</p>
                    <p className="text-sm font-semibold">+{gamificationConfig.pointsPerCourse}</p>
                  </div>
                  <div className="rounded-lg border p-2">
                    <p className="text-xs text-muted-foreground">Per quiz</p>
                    <p className="text-sm font-semibold">+{gamificationConfig.pointsPerAssessment}</p>
                  </div>
                  <div className="rounded-lg border p-2">
                    <p className="text-xs text-muted-foreground">Per live</p>
                    <p className="text-sm font-semibold">+{gamificationConfig.pointsPerLiveSession}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak snapshot */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-4 w-4 text-amber-500" /> Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">
              {learner.streak}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">days in a row</p>
            <div className="mt-3 flex justify-center gap-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`h-6 w-6 rounded-md ${
                    i < learner.streak % 7 || learner.streak >= 7 ? "bg-amber-500" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Learn today to extend your streak to {learner.streak + 1} days
            </p>
            <Button
              size="sm"
              className="mt-3 w-full"
              onClick={() => navigate("candidate", "my-learning")}
            >
              <Flame className="mr-1 h-3.5 w-3.5" /> Keep streak alive
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Badges showcase */}
      <SectionCard
        title="Badges"
        description={`${badges.filter((b) => b.earned).length} of ${badges.length} badges earned`}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((b) => (
            <div
              key={b.name}
              className={
                "flex flex-col items-center rounded-xl border p-4 text-center transition " +
                (b.earned
                  ? "border-brand/30 bg-brand/5"
                  : "border-dashed opacity-60")
              }
            >
              <div
                className={
                  "mb-2 flex h-14 w-14 items-center justify-center rounded-full " +
                  (b.earned ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground")
                }
              >
                {ICON_MAP[b.icon] ?? <Medal className="h-5 w-5" />}
              </div>
              <p className="text-xs font-semibold">{b.name}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {b.earned ? "Earned" : `${b.points.toLocaleString("en-IN")} pts`}
              </p>
              {!b.earned && (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {(b.points - learner.points).toLocaleString("en-IN")} more to unlock
                </p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Streak calendar */}
      <SectionCard
        title="Learning activity"
        description="Your daily learning activity over the last 90 days"
      >
        <div className="space-y-3">
          <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2">
            {streakGrid.map((v, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-sm ${intensityClass(v)}`}
                title={`Day ${i + 1}: ${v > 0 ? `${v} session${v > 1 ? "s" : ""}` : "No activity"}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>90 days ago</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((v) => (
                <div key={v} className={`h-3 w-3 rounded-sm ${intensityClass(v)}`} />
              ))}
              <span>More</span>
            </div>
            <span>Today</span>
          </div>
        </div>
      </SectionCard>

      {/* Leaderboard + Recent achievements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Leaderboard"
          description="Top 10 SkillForge learners this month"
          action={
            <Badge variant="secondary" className="text-xs">
              You're #{myRank}
            </Badge>
          }
        >
          <ul className="max-h-96 space-y-2 overflow-y-auto scroll-thin pr-1">
            {leaderboard.map((l, i) => {
              const isMe = l.id === LEARNER_ID;
              return (
                <li
                  key={l.id}
                  className={
                    "flex items-center gap-3 rounded-lg border p-2.5 " +
                    (isMe ? "border-brand/40 bg-brand/5" : "")
                  }
                >
                  <span
                    className={
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                      (i === 0
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                        : i === 1
                        ? "bg-slate-400/20 text-slate-600 dark:text-slate-300"
                        : i === 2
                        ? "bg-orange-500/20 text-orange-700 dark:text-orange-400"
                        : "bg-muted text-muted-foreground")
                    }
                  >
                    {i + 1}
                  </span>
                  <AvatarLogo text={l.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {l.name}
                      {isMe && <span className="ml-1 text-xs text-brand">(you)</span>}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      Level {l.level} · {l.streak}d streak
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand">
                      {l.points.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">pts</p>
                  </div>
                  {i < 3 && (
                    <Trophy className={
                      "h-4 w-4 " +
                      (i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : "text-orange-500")
                    } />
                  )}
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          title="Recent achievements"
          description="Your latest badges, milestones, and streaks"
        >
          <ul className="max-h-96 space-y-2 overflow-y-auto scroll-thin pr-1">
            {achievements.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                  {ICON_MAP[a.icon] ?? <Medal className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.description}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {timeAgo(a.earnedAt)} · <span className="capitalize">{a.type}</span>
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  +{a.points.toLocaleString("en-IN")}
                </Badge>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
