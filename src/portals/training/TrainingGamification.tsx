"use client";

import * as React from "react";
import { gamificationConfig, learnerAchievements } from "@/lib/lms-data";
import type { GamificationConfig } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { timeAgo, formatNumber } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Trophy, Flame, Crown, Brain, Rocket, Award, Save, X, Plus } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Trophy, Flame, Crown, Brain, Rocket, Award,
};

export function TrainingGamification() {
  const [config, setConfig] = React.useState<GamificationConfig>(gamificationConfig);
  const [badges, setBadges] = React.useState(gamificationConfig.badgeThresholds);
  const [newBadgeName, setNewBadgeName] = React.useState("");
  const [newBadgePoints, setNewBadgePoints] = React.useState(1000);
  const [newBadgeIcon, setNewBadgeIcon] = React.useState("Trophy");

  // Leaderboard: aggregate points by learner from achievements
  const leaderboard = React.useMemo(() => {
    const map: Record<string, { learnerId: string; learnerName: string; points: number }> = {};
    learnerAchievements.forEach((a) => {
      if (!map[a.learnerId]) map[a.learnerId] = { learnerId: a.learnerId, learnerName: a.learnerName, points: 0 };
      map[a.learnerId].points += a.points;
    });
    // synthetic extra points from enrollments
    const extra: Record<string, number> = {
      e_001: 4200, e_002: 3100, e_003: 5800, e_004: 2900, e_005: 1500, e_006: 800, e_007: 3400, e_008: 2100,
    };
    Object.entries(extra).forEach(([id, pts]) => {
      if (!map[id]) map[id] = { learnerId: id, learnerName: `Learner ${id.slice(-3)}`, points: 0 };
      map[id].points += pts;
    });
    return Object.values(map).sort((a, b) => b.points - a.points).slice(0, 10);
  }, []);

  function updateConfig<K extends keyof GamificationConfig>(key: K, value: GamificationConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  function save() {
    setConfig((c) => ({ ...c, badgeThresholds: badges }));
    toast.success("Gamification config saved");
  }

  function addBadge() {
    if (!newBadgeName.trim()) { toast.error("Badge name required"); return; }
    setBadges((b) => [...b, { name: newBadgeName, points: newBadgePoints, icon: newBadgeIcon }]);
    setNewBadgeName("");
    toast.success(`Badge added — ${newBadgeName}`);
  }

  function removeBadge(name: string) {
    setBadges((b) => b.filter((x) => x.name !== name));
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gamification"
        description="Configure points, badges, and leaderboards to drive engagement."
        icon={<Icon name="Trophy" className="h-6 w-6" />}
        actions={[{ label: "Save", icon: "Save", onClick: save }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Points / Course" value={config.pointsPerCourse} icon={<Trophy className="h-5 w-5" />} tone="brand" />
        <StatCard label="Points / Assessment" value={config.pointsPerAssessment} icon={<Award className="h-5 w-5" />} />
        <StatCard label="Points / Live Session" value={config.pointsPerLiveSession} icon={<Rocket className="h-5 w-5" />} />
        <StatCard label="Badges" value={badges.length} icon={<Crown className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Config */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Points Configuration" description="Reward learners for engagement">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="p-course">Per course completion</Label>
                <Input id="p-course" type="number" value={config.pointsPerCourse} onChange={(e) => updateConfig("pointsPerCourse", Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="p-assess">Per assessment pass</Label>
                <Input id="p-assess" type="number" value={config.pointsPerAssessment} onChange={(e) => updateConfig("pointsPerAssessment", Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="p-live">Per live session attended</Label>
                <Input id="p-live" type="number" value={config.pointsPerLiveSession} onChange={(e) => updateConfig("pointsPerLiveSession", Number(e.target.value))} className="mt-1" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Badge Thresholds" description="Define achievement milestones">
            <ul className="space-y-2">
              {badges.map((b) => {
                const IconCmp = ICON_MAP[b.icon] ?? Trophy;
                return (
                  <li key={b.name} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <IconCmp className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{formatNumber(b.points)} points</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeBadge(b.name)}><X className="h-4 w-4" /></Button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
              <Input value={newBadgeName} onChange={(e) => setNewBadgeName(e.target.value)} placeholder="Badge name" className="flex-1 min-w-[140px] h-9" />
              <Input type="number" value={newBadgePoints} onChange={(e) => setNewBadgePoints(Number(e.target.value))} placeholder="Points" className="w-[100px] h-9" />
              <select value={newBadgeIcon} onChange={(e) => setNewBadgeIcon(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
                {Object.keys(ICON_MAP).map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              <Button variant="outline" size="sm" onClick={addBadge}><Plus className="h-4 w-4" /></Button>
            </div>
          </SectionCard>

          <SectionCard title="Settings">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Leaderboard enabled</p>
                <p className="text-xs text-muted-foreground">Show learner rankings to all clients</p>
              </div>
              <Switch checked={config.leaderboardEnabled} onCheckedChange={(v) => updateConfig("leaderboardEnabled", v)} />
            </div>
          </SectionCard>
        </div>

        {/* Leaderboard */}
        <SectionCard title="Leaderboard" description="Top learners by points">
          <ul className="space-y-2 max-h-[400px] overflow-y-auto scroll-thin">
            {leaderboard.map((l, i) => {
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
              return (
                <li key={l.learnerId} className={`flex items-center gap-2 rounded-lg border p-2 ${i === 0 ? "border-amber-500/30 bg-amber-500/5" : ""}`}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {medal ?? i + 1}
                  </span>
                  <AvatarLogo text={l.learnerName} size="xs" />
                  <span className="text-sm font-medium truncate flex-1">{l.learnerName}</span>
                  <span className="text-sm font-bold text-brand">{formatNumber(l.points)}</span>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      {/* Badges showcase */}
      <SectionCard title="Badges Showcase" description="Achievement types learners can earn">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((b) => {
            const IconCmp = ICON_MAP[b.icon] ?? Trophy;
            return (
              <div key={b.name} className="rounded-xl border p-4 text-center hover:border-brand/40 hover:bg-brand/5 transition-colors">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <IconCmp className="h-6 w-6" />
                </div>
                <p className="mt-2 text-sm font-medium">{b.name}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(b.points)} pts</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Recent achievements feed */}
      <SectionCard title="Recent Achievements" description="Latest learner milestones">
        {learnerAchievements.length === 0 ? (
          <EmptyState icon={<Trophy className="h-5 w-5" />} title="No achievements yet" />
        ) : (
          <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
            {learnerAchievements.map((a) => {
              const IconCmp = ICON_MAP[a.icon] ?? Trophy;
              return (
                <li key={a.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <IconCmp className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-brand">+{a.points} pts</p>
                    <p className="text-[10px] text-muted-foreground">{timeAgo(a.earnedAt)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
