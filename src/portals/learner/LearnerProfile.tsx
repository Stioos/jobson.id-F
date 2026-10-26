"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { individualLearners } from "@/lib/lms-data";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LearnerDisclaimer, SkillBar, LEARNER_ID,
} from "./_shared";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, MapPin, Phone, Mail, Globe, Github, Linkedin, Briefcase,
  CheckCircle2, Eye, Save, Plus, X,
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name too short"),
  headline: z.string().min(5, "Headline too short"),
  bio: z.string().min(20, "Bio too short — at least 20 chars"),
  location: z.string().min(2, "Location required"),
  phone: z.string().optional(),
  jobTitle: z.string().min(2, "Job title required"),
  experience: z.coerce.number().min(0).max(50),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const LEVEL_LABELS = ["—", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];

export function LearnerProfile() {
  const { navigate } = useNav();
  const learner = individualLearners.find((l) => l.id === LEARNER_ID)!;

  const [skills, setSkills] = React.useState(learner.skills);
  const [openToWork, setOpenToWork] = React.useState(learner.openToWork);
  const [publicToRecruiters, setPublicToRecruiters] = React.useState(true);
  const [newSkill, setNewSkill] = React.useState("");
  const [newLevel, setNewLevel] = React.useState("2");

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: learner.name,
      headline: learner.headline,
      bio: learner.bio,
      location: learner.location,
      phone: learner.phone ?? "",
      jobTitle: learner.jobTitle,
      experience: learner.experience,
      github: learner.links?.github ?? "",
      linkedin: learner.links?.linkedin ?? "",
      portfolio: learner.links?.portfolio ?? "",
    },
  });
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = form;

  const watched = watch();

  // Profile completeness %
  const completeness = React.useMemo(() => {
    let total = 8;
    let done = 0;
    if (watched.name) done++;
    if (watched.headline) done++;
    if (watched.bio && watched.bio.length >= 20) done++;
    if (watched.location) done++;
    if (watched.phone) done++;
    if (watched.jobTitle) done++;
    if (skills.length >= 3) done++;
    if (watched.linkedin || watched.github || watched.portfolio) done++;
    return Math.round((done / total) * 100);
  }, [watched, skills]);

  function onSubmit(_data: ProfileForm) {
    toast.success("Profile saved", {
      description: "Recruiters will see your updated profile",
    });
  }
  function addSkill() {
    if (!newSkill.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      toast.error("Skill already added");
      return;
    }
    setSkills((arr) => [...arr, { name: newSkill.trim(), level: parseInt(newLevel, 10), verified: false }]);
    setNewSkill("");
    setNewLevel("2");
    toast.success("Skill added");
  }
  function removeSkill(name: string) {
    setSkills((arr) => arr.filter((s) => s.name !== name));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="This is how recruiters from partner companies see you."
        icon={<User className="h-5 w-5" />}
        actions={[
          { label: "Save", icon: "Save", onClick: handleSubmit(onSubmit) },
        ]}
      />

      <LearnerDisclaimer />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Editable form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Completeness */}
          <SectionCard
            title="Profile completeness"
            description="Complete profiles get 3x more recruiter views"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{completeness}% complete</span>
                {completeness === 100 && (
                  <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> All set!
                  </Badge>
                )}
              </div>
              <Progress value={completeness} className="h-2" />
            </div>
          </SectionCard>

          {/* Basic info */}
          <SectionCard title="Basic information" description="Your name and headline">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jobTitle">Job title</Label>
                <Input id="jobTitle" {...register("jobTitle")} />
                {errors.jobTitle && <p className="text-xs text-rose-600">{errors.jobTitle.message}</p>}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" placeholder="e.g. Frontend Developer | React • TypeScript" {...register("headline")} />
                {errors.headline && <p className="text-xs text-rose-600">{errors.headline.message}</p>}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell recruiters about yourself…"
                  {...register("bio")}
                />
                {errors.bio && <p className="text-xs text-rose-600">{errors.bio.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} />
                {errors.location && <p className="text-xs text-rose-600">{errors.location.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+91 98765 43210" {...register("phone")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="experience">Years of experience</Label>
                <Input id="experience" type="number" min={0} max={50} {...register("experience")} />
                {errors.experience && <p className="text-xs text-rose-600">{errors.experience.message}</p>}
              </div>
            </div>
          </SectionCard>

          {/* Links */}
          <SectionCard title="Links" description="Add your professional presence">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="flex items-center gap-1">
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </Label>
                <Input id="linkedin" placeholder="linkedin.com/in/…" {...register("linkedin")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="github" className="flex items-center gap-1">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </Label>
                <Input id="github" placeholder="github.com/…" {...register("github")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="portfolio" className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> Portfolio
                </Label>
                <Input id="portfolio" placeholder="yoursite.com" {...register("portfolio")} />
              </div>
            </div>
          </SectionCard>

          {/* Skills */}
          <SectionCard
            title="Skills"
            description="Add skills to be matched against job openings"
            action={
              <Badge variant="secondary" className="text-xs">
                {skills.length} skills
              </Badge>
            }
          >
            <div className="space-y-3">
              <ul className="space-y-2">
                {skills.map((s) => (
                  <li
                    key={s.name}
                    className="flex items-center gap-3 rounded-lg border p-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{s.name}</p>
                        {s.verified && (
                          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px]">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <SkillBar level={s.level} />
                        <span className="text-[10px] text-muted-foreground">
                          {LEVEL_LABELS[s.level]}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-rose-600 hover:text-rose-700"
                      onClick={() => removeSkill(s.name)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="new-skill">Add a skill</Label>
                  <Input
                    id="new-skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. GraphQL"
                  />
                </div>
                <div className="w-32 space-y-1.5">
                  <Label>Level</Label>
                  <Select value={newLevel} onValueChange={setNewLevel}>
                    <SelectTrigger className="w-full">
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
                <Button type="button" onClick={addSkill}>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Visibility settings */}
          <SectionCard title="Visibility" description="Control how recruiters find you">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Open to work</p>
                  <p className="text-xs text-muted-foreground">
                    Show recruiters you&apos;re actively looking for new opportunities
                  </p>
                </div>
                <Switch checked={openToWork} onCheckedChange={setOpenToWork} />
              </div>
              <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Public to recruiters</p>
                  <p className="text-xs text-muted-foreground">
                    Allow recruiters from partner companies to find you in talent search
                  </p>
                </div>
                <Switch checked={publicToRecruiters} onCheckedChange={setPublicToRecruiters} />
              </div>
            </div>
          </SectionCard>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("candidate", "overview")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-1 h-4 w-4" /> Save profile
            </Button>
          </div>
        </form>

        {/* Preview card */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <SectionCard
            title="Recruiter preview"
            description="How recruiters see your profile"
            action={
              <Badge variant="outline" className="text-[10px]">
                <Eye className="mr-1 h-3 w-3" /> Live preview
              </Badge>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <AvatarLogo text={watched.name || "AR"} size="xl" />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">{watched.name || "Aditya Rao"}</p>
                  <p className="truncate text-xs text-muted-foreground">{watched.headline}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                    {watched.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {watched.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> {watched.experience} yrs
                    </span>
                    {openToWork && (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px]">
                        Open to work
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bio</p>
                <p className="mt-1 text-sm">{watched.bio || "—"}</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Top skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 5).map((s) => (
                    <Badge key={s.name} variant="secondary" className="text-[10px]">
                      {s.verified && <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />}
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Links</p>
                <ul className="space-y-1 text-xs">
                  {watched.linkedin && (
                    <li className="flex items-center gap-1 text-brand">
                      <Linkedin className="h-3 w-3" /> {watched.linkedin}
                    </li>
                  )}
                  {watched.github && (
                    <li className="flex items-center gap-1 text-brand">
                      <Github className="h-3 w-3" /> {watched.github}
                    </li>
                  )}
                  {watched.portfolio && (
                    <li className="flex items-center gap-1 text-brand">
                      <Globe className="h-3 w-3" /> {watched.portfolio}
                    </li>
                  )}
                </ul>
              </div>

              <div className="border-t pt-3 text-[10px] text-muted-foreground">
                Profile last updated {new Date().toLocaleDateString("en-IN")}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
