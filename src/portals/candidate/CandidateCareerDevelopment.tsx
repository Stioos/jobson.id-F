"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNav } from "@/lib/store";
import { candidateProfiles, trainingCourses } from "@/lib/mock-data";
import { aiService } from "@/lib/mock-api";
import { formatDate } from "@/lib/format";

const TARGET_ROLES: Record<string, { name: string; skills: string[] }> = {
  staff_fe: {
    name: "Staff Frontend Engineer",
    skills: ["React", "TypeScript", "System Design", "Performance", "Accessibility", "Leadership"],
  },
  em: {
    name: "Engineering Manager",
    skills: ["Leadership", "Mentoring", "Roadmapping", "Hiring", "Communication", "Strategy"],
  },
  fullstack: {
    name: "Full-Stack Engineer",
    skills: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript", "System Design"],
  },
};

const TIMELINES = ["3 months", "6 months", "1 year", "2 years"] as const;

export function CandidateCareerDevelopment() {
  const { navigate } = useNav();
  const profile = candidateProfiles[0];
  const [targetRole, setTargetRole] = React.useState("staff_fe");
  const [timeline, setTimeline] = React.useState<(typeof TIMELINES)[number]>("6 months");
  const [notes, setNotes] = React.useState(
    "Grow into a Staff-level role leading design system initiatives across multiple teams."
  );
  const [mockOpen, setMockOpen] = React.useState(false);
  const [mockLoading, setMockLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState<string[] | null>(null);

  const target = TARGET_ROLES[targetRole];
  const mySkillMap = new Map(profile.skills.map((s) => [s.skill, s.level]));
  const levelToScore = (l?: string) =>
    l === "expert" ? 5 : l === "advanced" ? 4 : l === "intermediate" ? 3 : l === "beginner" ? 2 : 1;
  const targetLevelToScore = () => 4.5; // assume "advanced/expert" target

  const radarData = target.skills.map((skill) => ({
    skill,
    current: levelToScore(mySkillMap.get(skill)),
    target: targetLevelToScore(),
  }));

  const missing = target.skills.filter((s) => !mySkillMap.has(s));

  // Recommended learning path: pick courses that cover missing/matching skills
  const recommendedCourses = trainingCourses
    .filter((c) => c.skills.some((s) => target.skills.includes(s)))
    .slice(0, 4);

  function saveGoal() {
    toast.success("Career goal saved", {
      description: `Target: ${target.name} in ${timeline}.`,
    });
  }

  async function startMock() {
    setMockOpen(true);
    setMockLoading(true);
    setQuestions(null);
    try {
      const res = await aiService.generateInterviewQuestions(target.name, "technical");
      setQuestions((res as { questions: string[] }).questions);
    } catch {
      toast.error("Failed to generate questions");
    } finally {
      setMockLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Development"
        description="Set goals, visualize skill gaps, and follow a learning plan to reach your next role."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Career goal form */}
        <SectionCard
          title="Career goal"
          description="Define where you want to go."
          className="lg:col-span-1"
        >
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Target role</Label>
              <Select value={targetRole} onValueChange={setTargetRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TARGET_ROLES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Target timeline</Label>
              <Select
                value={timeline}
                onValueChange={(v) => setTimeline(v as (typeof TIMELINES)[number])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={saveGoal}>
              Save goal
            </Button>
          </div>
        </SectionCard>

        {/* Skill gap radar */}
        <SectionCard
          title="Skill gap visualization"
          description={`Current vs target for ${target.name}`}
          className="lg:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.15}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Strengths to leverage
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {target.skills
                  .filter((s) => mySkillMap.has(s))
                  .map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    >
                      {s} ({mySkillMap.get(s)})
                    </Badge>
                  ))}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Skills to develop ({missing.length})
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {missing.length === 0 ? (
                  <span className="text-xs text-muted-foreground">
                    No gaps — you&apos;re ready!
                  </span>
                ) : (
                  missing.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    >
                      {s}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Learning path */}
      <SectionCard
        title="Recommended learning path"
        description="Curated courses to bridge your skill gaps."
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("candidate", "training")}
          >
            Browse all
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {recommendedCourses.map((c, i) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      <span className="mr-1 text-brand">#{i + 1}</span> {c.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.provider} · {c.durationHours}h · ★ {c.rating}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {c.level}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success("Enrolled!", { description: c.title })}
                  >
                    Enroll
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Mock interview prep */}
      <SectionCard
        title="Mock interview prep"
        description="Practice with AI-generated questions for your target role."
      >
        <div className="flex flex-col items-start gap-3 rounded-lg border border-brand/20 bg-brand/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{target.name} — mock interview</p>
              <Badge className="gap-1 bg-brand/10 text-brand">
                <Icon name="Sparkles" className="h-3 w-3" /> Simulated AI
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Generates 4 practice questions based on the target role.
            </p>
          </div>
          <Button onClick={startMock}>
            <Icon name="MessagesSquare" className="h-4 w-4" /> Start mock interview
          </Button>
        </div>
      </SectionCard>

      <Dialog open={mockOpen} onOpenChange={setMockOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Mock interview — {target.name}</DialogTitle>
            <DialogDescription>
              Practice these questions out loud or write your answers. AI-generated,
              illustrative only.
            </DialogDescription>
          </DialogHeader>
          {mockLoading ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              <p className="text-sm text-muted-foreground">Generating questions…</p>
            </div>
          ) : questions ? (
            <ol className="space-y-3">
              {questions.map((q, i) => (
                <li key={i} className="rounded-lg border p-3 text-sm">
                  <span className="mr-2 font-medium text-brand">Q{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ol>
          ) : null}
          {questions && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setMockOpen(false)}>
                Done
              </Button>
              <Button onClick={startMock}>Regenerate</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
