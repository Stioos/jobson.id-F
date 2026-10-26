"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  individualLearners, trainingCourses, careerPaths,
} from "@/lib/lms-data";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  LearnerDisclaimer, SkillBar, LEARNER_ID,
} from "./_shared";
import { toast } from "sonner";
import {
  Brain, BadgeCheck, ShieldQuestion, Download, TrendingUp, Plus, Target,
  ArrowRight, Sparkles, Award,
} from "lucide-react";

const LEVEL_LABELS = ["—", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];

interface SkillEntry {
  name: string;
  level: number;
  verified: boolean;
}

const SUGGESTED_SKILLS = [
  "JavaScript", "Node.js", "GraphQL", "Redux", "Webpack", "Testing (Jest)",
  "Docker", "CI/CD", "Accessibility (a11y)", "Web Performance",
];

export function LearnerMySkills() {
  const { navigate } = useNav();
  const learner = individualLearners.find((l) => l.id === LEARNER_ID)!;
  const [skills, setSkills] = React.useState<SkillEntry[]>(learner.skills);
  const [addOpen, setAddOpen] = React.useState(false);
  const [newSkill, setNewSkill] = React.useState("");
  const [newLevel, setNewLevel] = React.useState("2");

  // Career-path-driven skill gaps
  const targetPath = careerPaths[0]; // Frontend Developer — Aditya's current career
  const targetSkills = Array.from(
    new Set(
      trainingCourses
        .filter((c) => targetPath.courses.includes(c.id))
        .flatMap((c) => c.skills),
    ),
  );

  const verifiedCount = skills.filter((s) => s.verified).length;
  const radarData = skills.map((s) => ({
    skill: s.name,
    level: s.level,
    fullMark: 5,
  }));

  function addSkill() {
    if (!newSkill.trim()) {
      toast.error("Please enter a skill name");
      return;
    }
    if (skills.some((s) => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      toast.error("Skill already in your profile");
      return;
    }
    setSkills((arr) => [...arr, { name: newSkill.trim(), level: parseInt(newLevel, 10), verified: false }]);
    toast.success(`Added "${newSkill.trim()}" to your skills`);
    setNewSkill("");
    setNewLevel("2");
    setAddOpen(false);
  }
  function removeSkill(name: string) {
    setSkills((arr) => arr.filter((s) => s.name !== name));
    toast.info(`Removed "${name}"`);
  }
  function verifySkill(name: string) {
    toast.success(`Verification requested for "${name}"`, {
      description: "Take a SkillForge assessment to verify this skill.",
    });
  }
  function exportProfile() {
    toast.success("Skill profile exported", {
      description: "LinkedIn-ready skills file downloaded",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Skills"
        description="Track, verify, and showcase your skills to recruiters."
        icon={<Brain className="h-5 w-5" />}
        actions={[
          { label: "Export profile", icon: "Download", variant: "outline", onClick: exportProfile },
          { label: "Add skill", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />

      <LearnerDisclaimer />

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SectionCard title="Total skills" className="p-4">
          <p className="text-2xl font-bold">{skills.length}</p>
        </SectionCard>
        <SectionCard title="Verified" className="p-4">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{verifiedCount}</p>
        </SectionCard>
        <SectionCard title="Avg level" className="p-4">
          <p className="text-2xl font-bold text-brand">
            {(skills.reduce((s, x) => s + x.level, 0) / skills.length).toFixed(1)}
          </p>
        </SectionCard>
        <SectionCard title="Target path" className="p-4">
          <p className="text-sm font-semibold">{targetPath.name}</p>
          <p className="text-xs text-muted-foreground">{targetPath.outcome}</p>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar chart */}
        <SectionCard
          title="Skill levels"
          description="Visualized across your skill profile"
        >
          <div className="h-72 w-full">
            {skills.length < 3 ? (
              <EmptyState
                icon={<Brain className="h-5 w-5" />}
                title="Add at least 3 skills to see the radar chart"
                description="Your skill visualization will appear here."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius={90}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                  <Radar
                    name="Level"
                    dataKey="level"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="#10b981"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--popover))",
                      fontSize: 12,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>

        {/* Skill list with bars */}
        <SectionCard
          title="Skill profile"
          description="Verified skills carry more weight with recruiters"
        >
          <ul className="max-h-72 space-y-3 overflow-y-auto scroll-thin pr-1">
            {skills.map((s) => (
              <li key={s.name} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{s.name}</p>
                      {s.verified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          <BadgeCheck className="mr-1 h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          <ShieldQuestion className="mr-1 h-3 w-3" /> Unverified
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <SkillBar level={s.level} />
                      <span className="text-[10px] text-muted-foreground">
                        {LEVEL_LABELS[s.level]} (L{s.level})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {!s.verified && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      onClick={() => verifySkill(s.name)}
                    >
                      <BadgeCheck className="mr-1 h-3 w-3" /> Get verified
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-rose-600 hover:text-rose-700"
                    onClick={() => removeSkill(s.name)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Skill gaps */}
      <SectionCard
        title="Skill gaps for your target path"
        description={`Frontend Developer path · ${targetSkills.length} target skills`}
        action={
          <Button variant="ghost" size="sm" onClick={() => navigate("candidate", "career-paths")}>
            Change path <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {targetSkills.map((skill) => {
            const mine = skills.find((s) => s.name === skill);
            const has = !!mine;
            return (
              <div key={skill} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  {has ? (
                    <BadgeCheck className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Target className="h-4 w-4 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{skill}</p>
                    <p className="text-xs text-muted-foreground">
                      {has
                        ? `You're at L${mine!.level} · ${LEVEL_LABELS[mine!.level]}`
                        : "Not yet on your profile"}
                    </p>
                  </div>
                </div>
                {!has && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7"
                    onClick={() => {
                      setNewSkill(skill);
                      setNewLevel("2");
                      setAddOpen(true);
                    }}
                  >
                    <Plus className="mr-1 h-3 w-3" /> Add
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Recommended skills to learn */}
      <SectionCard
        title="Recommended skills to learn"
        description="Skills in high demand for your target role"
      >
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.filter((s) => !skills.some((sk) => sk.name === s)).map((s) => (
            <Button
              key={s}
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => {
                setNewSkill(s);
                setNewLevel("2");
                setAddOpen(true);
              }}
            >
              <Plus className="mr-1 h-3 w-3" /> {s}
            </Button>
          ))}
        </div>
      </SectionCard>

      {/* Add skill dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a skill</DialogTitle>
            <DialogDescription>
              Add a skill to your profile. You can verify it later by completing a SkillForge assessment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="skill-name">Skill name</Label>
              <input
                id="skill-name"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. GraphQL"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                list="suggested-skills"
              />
              <datalist id="suggested-skills">
                {SUGGESTED_SKILLS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div>
              <Label>Proficiency level</Label>
              <Select value={newLevel} onValueChange={setNewLevel}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">L1 — Beginner</SelectItem>
                  <SelectItem value="2">L2 — Intermediate</SelectItem>
                  <SelectItem value="3">L3 — Advanced</SelectItem>
                  <SelectItem value="4">L4 — Expert</SelectItem>
                  <SelectItem value="5">L5 — Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addSkill}>
              <Plus className="mr-1 h-4 w-4" /> Add skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
