"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  EmptyState,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { candidateProfiles } from "@/lib/mock-data";
import type { CandidateProfile, WorkExperience, Education } from "@/lib/types";

const summarySchema = z.object({
  summary: z.string().min(20, "Summary must be at least 20 characters"),
  headline: z.string().min(5, "Headline required"),
  location: z.string().min(2, "Location required"),
  expectedSalary: z.coerce.number().min(0),
});
type SummaryForm = z.infer<typeof summarySchema>;

const SKILL_LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;
type SkillLevel = (typeof SKILL_LEVELS)[number];

export function CandidateProfile() {
  const [profile, setProfile] = React.useState<CandidateProfile>(
    () => candidateProfiles[0]
  );
  const [openToWork, setOpenToWork] = React.useState(profile.openToWork);
  const [visibility, setVisibility] = React.useState(profile.visibility);
  const [expDialog, setExpDialog] = React.useState(false);
  const [eduDialog, setEduDialog] = React.useState(false);
  const [editingExp, setEditingExp] = React.useState<WorkExperience | null>(null);
  const [editingEdu, setEditingEdu] = React.useState<Education | null>(null);
  const [newSkill, setNewSkill] = React.useState("");
  const [newSkillLevel, setNewSkillLevel] = React.useState<SkillLevel>("intermediate");

  const form = useForm<SummaryForm>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: profile.summary,
      headline: profile.headline,
      location: profile.location,
      expectedSalary: profile.expectedSalary ?? 0,
    },
  });

  // Compute completeness live from filled fields
  const completeness = React.useMemo(() => computeCompleteness(profile), [profile]);

  function onSummarySubmit(values: SummaryForm) {
    setProfile((p) => ({ ...p, ...values, updatedAt: new Date().toISOString() }));
    toast.success("Profile saved", { description: "Your headline, summary, and salary have been updated." });
  }

  function saveExperience(exp: WorkExperience) {
    setProfile((p) => {
      const exists = p.experience.some((e) => e.id === exp.id);
      const experience = exists
        ? p.experience.map((e) => (e.id === exp.id ? exp : e))
        : [...p.experience, exp];
      return { ...p, experience };
    });
    setExpDialog(false);
    setEditingExp(null);
    toast.success(editingExp ? "Experience updated" : "Experience added");
  }

  function deleteExperience(id: string) {
    setProfile((p) => ({ ...p, experience: p.experience.filter((e) => e.id !== id) }));
    toast.success("Experience removed");
  }

  function saveEducation(edu: Education) {
    setProfile((p) => {
      const exists = p.education.some((e) => e.id === edu.id);
      const education = exists
        ? p.education.map((e) => (e.id === edu.id ? edu : e))
        : [...p.education, edu];
      return { ...p, education };
    });
    setEduDialog(false);
    setEditingEdu(null);
    toast.success(editingEdu ? "Education updated" : "Education added");
  }

  function deleteEducation(id: string) {
    setProfile((p) => ({ ...p, education: p.education.filter((e) => e.id !== id) }));
    toast.success("Education removed");
  }

  function addSkill() {
    if (!newSkill.trim()) return;
    if (profile.skills.some((s) => s.skill.toLowerCase() === newSkill.toLowerCase())) {
      toast.error("Skill already added");
      return;
    }
    setProfile((p) => ({
      ...p,
      skills: [
        ...p.skills,
        { skill: newSkill.trim(), level: newSkillLevel, yearsOfExperience: 1, verified: false },
      ],
    }));
    setNewSkill("");
    setNewSkillLevel("intermediate");
    toast.success("Skill added");
  }

  function updateSkillLevel(skill: string, level: SkillLevel) {
    setProfile((p) => ({
      ...p,
      skills: p.skills.map((s) => (s.skill === skill ? { ...s, level } : s)),
    }));
  }

  function removeSkill(skill: string) {
    setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s.skill !== skill) }));
    toast.success("Skill removed");
  }

  function verifySkill(skill: string) {
    toast.info("Verification requested", {
      description: `${skill} — we'll send you an assessment link shortly.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your professional profile visible to recruiters and employers."
        actions={[
          {
            label: "Preview public view",
            variant: "outline",
            onClick: () => toast.info("Preview", { description: "Opening public profile preview..." }),
          },
        ]}
      />

      {/* Header card */}
      <Card className="overflow-hidden border border-border/80 shadow-xs">
        <CardContent className="p-6 sm:p-6 sm:pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <AvatarLogo text={profile.name} size="xl" />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">{profile.name}</h2>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">{profile.headline}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="MapPin" className="h-3.5 w-3.5 text-muted-foreground/80" /> {profile.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="Briefcase" className="h-3.5 w-3.5 text-muted-foreground/80" /> {profile.experienceYears} yrs exp
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="Building2" className="h-3.5 w-3.5 text-muted-foreground/80" /> {profile.currentCompany}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2.5">
              <div className="flex items-center gap-3">
                <Label htmlFor="otw" className="text-xs font-medium cursor-pointer">
                  Open to work
                </Label>
                <Switch
                  id="otw"
                  checked={openToWork}
                  onCheckedChange={(v) => {
                    setOpenToWork(v);
                    setProfile((p) => ({ ...p, openToWork: v }));
                    toast.success(v ? "Marked as open to work" : "Hidden from recruiters");
                  }}
                />
              </div>
              {openToWork && (
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium text-[11px] gap-1 px-2.5 py-0.5">
                  <Icon name="BadgeCheck" className="h-3.5 w-3.5" /> Actively looking
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-5 border-t border-border/60 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground/90">Profile completeness</span>
              <span className="font-semibold text-brand">{completeness}%</span>
            </div>
            <Progress value={completeness} className="mt-2 h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="summary" className="gap-1">
            <Icon name="User" className="h-4 w-4" /> Summary
          </TabsTrigger>
          <TabsTrigger value="experience" className="gap-1">
            <Icon name="Briefcase" className="h-4 w-4" /> Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="gap-1">
            <Icon name="GraduationCap" className="h-4 w-4" /> Education
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-1">
            <Icon name="Award" className="h-4 w-4" /> Skills
          </TabsTrigger>
          <TabsTrigger value="extras" className="gap-1">
            <Icon name="FolderGit2" className="h-4 w-4" /> Extras
          </TabsTrigger>
          <TabsTrigger value="visibility" className="gap-1">
            <Icon name="Shield" className="h-4 w-4" /> Visibility
          </TabsTrigger>
        </TabsList>

        {/* Summary */}
        <TabsContent value="summary">
          <SectionCard title="Headline & summary" description="The first thing recruiters read.">
            <form onSubmit={form.handleSubmit(onSummarySubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" {...form.register("headline")} />
                {form.formState.errors.headline && (
                  <p className="text-xs text-destructive">{form.formState.errors.headline.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...form.register("location")} />
                  {form.formState.errors.location && (
                    <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="expectedSalary">Expected salary (₹/year)</Label>
                  <Input
                    id="expectedSalary"
                    type="number"
                    {...form.register("expectedSalary")}
                  />
                  {form.formState.errors.expectedSalary && (
                    <p className="text-xs text-destructive">{form.formState.errors.expectedSalary.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="summary">Professional summary</Label>
                <Textarea id="summary" rows={4} {...form.register("summary")} />
                {form.formState.errors.summary && (
                  <p className="text-xs text-destructive">{form.formState.errors.summary.message}</p>
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </SectionCard>
        </TabsContent>

        {/* Experience */}
        <TabsContent value="experience">
          <SectionCard
            title="Work experience"
            description="Most recent first."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingExp(null);
                  setExpDialog(true);
                }}
              >
                <Icon name="PenSquare" className="h-4 w-4" /> Add
              </Button>
            }
          >
            <div className="space-y-3">
              {profile.experience.length === 0 ? (
                <EmptyState
                  icon={<Icon name="Briefcase" className="h-5 w-5" />}
                  title="No experience added"
                  description="Add your work history to build your profile."
                />
              ) : (
                profile.experience.map((exp) => (
                  <div key={exp.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.company}
                          {exp.location ? ` · ${exp.location}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fmtMonth(exp.startDate)} —{" "}
                          {exp.current ? "Present" : exp.endDate ? fmtMonth(exp.endDate) : "—"}
                        </p>
                        {exp.description && (
                          <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingExp(exp);
                            setExpDialog(true);
                          }}
                        >
                          <Icon name="PenSquare" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteExperience(exp.id)}
                        >
                          <Icon name="AlertTriangle" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Education */}
        <TabsContent value="education">
          <SectionCard
            title="Education"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingEdu(null);
                  setEduDialog(true);
                }}
              >
                <Icon name="PenSquare" className="h-4 w-4" /> Add
              </Button>
            }
          >
            <div className="space-y-3">
              {profile.education.length === 0 ? (
                <EmptyState
                  icon={<Icon name="GraduationCap" className="h-5 w-5" />}
                  title="No education added"
                />
              ) : (
                profile.education.map((edu) => (
                  <div key={edu.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {edu.degree} · {edu.field}
                        </p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">
                          {fmtMonth(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? fmtMonth(edu.endDate) : "—"}
                        </p>
                        {edu.grade && (
                          <Badge variant="secondary" className="mt-2">
                            {edu.grade}
                          </Badge>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingEdu(edu);
                            setEduDialog(true);
                          }}
                        >
                          <Icon name="PenSquare" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteEducation(edu.id)}
                        >
                          <Icon name="AlertTriangle" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills">
          <SectionCard title="Skills" description="Add skills and self-assess your level. Get verified to stand out.">
            <div className="space-y-3">
              {profile.skills.map((s) => (
                <div
                  key={s.skill}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.skill}</span>
                    {s.verified ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        <Icon name="BadgeCheck" className="h-3 w-3" /> Verified
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                        onClick={() => verifySkill(s.skill)}
                      >
                        Get verified
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {s.yearsOfExperience}y exp
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={s.level}
                      onValueChange={(v) => updateSkillLevel(s.skill, v as SkillLevel)}
                    >
                      <SelectTrigger className="h-8 w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_LEVELS.map((l) => (
                          <SelectItem key={l} value={l} className="capitalize">
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeSkill(s.skill)}
                    >
                      <Icon name="AlertTriangle" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="Add a skill (e.g. Redux)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Select value={newSkillLevel} onValueChange={(v) => setNewSkillLevel(v as SkillLevel)}>
                  <SelectTrigger className="sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((l) => (
                      <SelectItem key={l} value={l} className="capitalize">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addSkill}>Add</Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Extras */}
        <TabsContent value="extras">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SectionCard title="Certifications">
              <div className="space-y-2">
                {profile.certifications.map((c) => (
                  <div key={c} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                    <Icon name="Award" className="h-4 w-4 text-brand" />
                    {c}
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Languages">
              <div className="space-y-2">
                {profile.languages.map((l) => (
                  <div
                    key={l.language}
                    className="flex items-center justify-between rounded-lg border p-2 text-sm"
                  >
                    <span>{l.language}</span>
                    <Badge variant="secondary">{l.proficiency}</Badge>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Achievements">
              <ul className="space-y-2 text-sm">
                {profile.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon name="TrendingUp" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {a}
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title="Projects">
              <div className="space-y-2">
                {profile.projects.map((p, i) => (
                  <div key={i} className="rounded-lg border p-2 text-sm">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                    {p.link && (
                      <a
                        href={`https://${p.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-brand hover:underline"
                      >
                        {p.link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Links" className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <LinkTile label="GitHub" value={profile.links.github} icon="GitBranch" />
                <LinkTile label="LinkedIn" value={profile.links.linkedin} icon="Users" />
                <LinkTile label="Portfolio" value={profile.links.portfolio} icon="Globe" />
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Visibility */}
        <TabsContent value="visibility">
          <SectionCard
            title="Profile visibility"
            description="Control who can see your profile in search and recruiter talent pools."
          >
            <RadioGroup
              value={visibility}
              onValueChange={(v) => {
                setVisibility(v as typeof visibility);
                setProfile((p) => ({ ...p, visibility: v as typeof visibility }));
                toast.success("Visibility updated");
              }}
              className="space-y-2"
            >
              <VisibilityOption
                value="public"
                title="Public"
                description="Visible to everyone, including search engines."
              />
              <VisibilityOption
                value="employers_only"
                title="Employers only"
                description="Visible only to verified employers and recruiters on JOBSONN."
              />
              <VisibilityOption
                value="private"
                title="Private"
                description="Only visible to you. You won't appear in searches."
              />
            </RadioGroup>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Experience dialog */}
      <ExperienceDialog
        open={expDialog}
        onOpenChange={setExpDialog}
        initial={editingExp}
        onSave={saveExperience}
      />
      {/* Education dialog */}
      <EducationDialog
        open={eduDialog}
        onOpenChange={setEduDialog}
        initial={editingEdu}
        onSave={saveEducation}
      />
    </div>
  );
}

function LinkTile({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon: string;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon name={icon} className="h-4 w-4" /> {label}
      </div>
      {value ? (
        <a
          href={`https://${value}`}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block text-sm text-brand hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">Not added</p>
      )}
    </div>
  );
}

function VisibilityOption({
  value,
  title,
  description,
}: {
  value: string;
  title: string;
  description: string;
}) {
  return (
    <Label
      htmlFor={`vis-${value}`}
      className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-brand has-[:checked]:bg-brand/5"
    >
      <RadioGroupItem value={value} id={`vis-${value}`} className="mt-1" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Label>
  );
}

function ExperienceDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: WorkExperience | null;
  onSave: (exp: WorkExperience) => void;
}) {
  const [form, setForm] = React.useState<WorkExperience>(
    initial ?? {
      id: `we_${Date.now()}`,
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: "",
    }
  );

  React.useEffect(() => {
    if (open) {
      setForm(
        initial ?? {
          id: `we_${Date.now()}`,
          company: "",
          title: "",
          startDate: "",
          endDate: "",
          current: false,
          location: "",
          description: "",
        }
      );
    }
  }, [open, initial]);

  function field<K extends keyof WorkExperience>(key: K, value: WorkExperience[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit experience" : "Add experience"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => field("title", e.target.value)}
              placeholder="Senior Engineer"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Company</Label>
            <Input
              value={form.company}
              onChange={(e) => field("company", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Start date</Label>
            <Input
              type="month"
              value={form.startDate ? form.startDate.slice(0, 7) : ""}
              onChange={(e) => field("startDate", `${e.target.value}-01`)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>End date</Label>
            <Input
              type="month"
              disabled={form.current}
              value={form.endDate ? form.endDate.slice(0, 7) : ""}
              onChange={(e) => field("endDate", `${e.target.value}-01`)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Location</Label>
            <Input
              value={form.location ?? ""}
              onChange={(e) => field("location", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch
              id="current"
              checked={form.current}
              onCheckedChange={(v) => field("current", v)}
            />
            <Label htmlFor="current">I currently work here</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!form.title || !form.company) {
                toast.error("Title and company are required");
                return;
              }
              onSave(form);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EducationDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Education | null;
  onSave: (edu: Education) => void;
}) {
  const [form, setForm] = React.useState<Education>(
    initial ?? {
      id: `ed_${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      grade: "",
    }
  );

  React.useEffect(() => {
    if (open) {
      setForm(
        initial ?? {
          id: `ed_${Date.now()}`,
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
          grade: "",
        }
      );
    }
  }, [open, initial]);

  function field<K extends keyof Education>(key: K, value: Education[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit education" : "Add education"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Institution</Label>
            <Input
              value={form.institution}
              onChange={(e) => field("institution", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Degree</Label>
            <Input
              value={form.degree}
              onChange={(e) => field("degree", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Field</Label>
            <Input
              value={form.field}
              onChange={(e) => field("field", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Input
              value={form.grade ?? ""}
              onChange={(e) => field("grade", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Start date</Label>
            <Input
              type="month"
              value={form.startDate ? form.startDate.slice(0, 7) : ""}
              onChange={(e) => field("startDate", `${e.target.value}-01`)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>End date</Label>
            <Input
              type="month"
              disabled={form.current}
              value={form.endDate ? form.endDate.slice(0, 7) : ""}
              onChange={(e) => field("endDate", `${e.target.value}-01`)}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch
              id="ed-current"
              checked={form.current}
              onCheckedChange={(v) => field("current", v)}
            />
            <Label htmlFor="ed-current">I currently study here</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!form.institution || !form.degree) {
                toast.error("Institution and degree are required");
                return;
              }
              onSave(form);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function fmtMonth(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function computeCompleteness(p: CandidateProfile): number {
  let filled = 0;
  let total = 0;
  const check = (cond: boolean) => {
    total += 1;
    if (cond) filled += 1;
  };
  check(!!p.headline);
  check(p.summary.length > 30);
  check(!!p.location);
  check(p.experience.length >= 1);
  check(p.education.length >= 1);
  check(p.skills.length >= 5);
  check(p.certifications.length >= 1);
  check(p.languages.length >= 1);
  check(p.achievements.length >= 1);
  check(p.projects.length >= 1);
  check(!!p.links.github || !!p.links.linkedin);
  check(p.expectedSalary !== undefined && p.expectedSalary > 0);
  return Math.round((filled / total) * 100);
}
