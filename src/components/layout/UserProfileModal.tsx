"use client";

import * as React from "react";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  Download,
  Calendar,
  Building2,
  DollarSign,
  Clock,
} from "lucide-react";

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileModal({ open, onOpenChange }: UserProfileModalProps) {
  const { user } = useAuth();

  // Profile Form States
  const [name, setName] = React.useState(user?.name || "User");
  const [headline, setHeadline] = React.useState(
    "Full-Stack Software Engineer & Cloud Architect | Open to Opportunities"
  );
  const [phone, setPhone] = React.useState("+91 98765 43210");
  const [location, setLocation] = React.useState("Bengaluru, India");
  const [bio, setBio] = React.useState(
    "Passionate software engineer with 5+ years of experience crafting scalable web and mobile applications using React, Next.js, Node.js, and cloud platforms."
  );

  React.useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name, open]);

  // Preferences
  const [preferredRole, setPreferredRole] = React.useState("Senior Full Stack Engineer");
  const [workArrangement, setWorkArrangement] = React.useState("Hybrid / Remote");
  const [expectedSalary, setExpectedSalary] = React.useState("₹24 - ₹32 LPA");
  const [noticePeriod, setNoticePeriod] = React.useState("15 - 30 Days");

  // Links
  const [linkedin, setLinkedin] = React.useState("https://linkedin.com/in/jobson-id");
  const [github, setGithub] = React.useState("https://github.com/jobson-id");
  const [portfolio, setPortfolio] = React.useState("https://jobson.id");

  // Skills
  const [skills, setSkills] = React.useState([
    { name: "React", level: "Expert" },
    { name: "Next.js", level: "Expert" },
    { name: "TypeScript", level: "Advanced" },
    { name: "Node.js", level: "Advanced" },
    { name: "Python", level: "Intermediate" },
    { name: "PostgreSQL", level: "Advanced" },
    { name: "AWS Cloud", level: "Intermediate" },
    { name: "Docker", level: "Intermediate" },
    { name: "Tailwind CSS", level: "Expert" },
    { name: "GraphQL", level: "Intermediate" },
  ]);
  const [newSkillName, setNewSkillName] = React.useState("");

  // Experience list
  const [experiences, setExperiences] = React.useState([
    {
      id: "exp-1",
      role: "Senior Full Stack Engineer",
      company: "TechCorp Solutions",
      duration: "2023 – Present",
      description: "Spearheaded enterprise dashboard modernization with Next.js & TypeScript, cutting page load by 45%.",
    },
    {
      id: "exp-2",
      role: "Software Developer",
      company: "InnovateLabs India",
      duration: "2021 – 2023",
      description: "Built microservices and scalable REST/GraphQL APIs handling 100K+ daily requests.",
    },
  ]);

  // Education list
  const [educations, setEducations] = React.useState([
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science & Engineering",
      institution: "National Institute of Technology (NIT)",
      year: "2017 – 2021",
      grade: "8.8 CGPA",
    },
  ]);

  // Sync name when user prop changes
  React.useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name, open]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      toast.info("Skill already exists in your profile");
      return;
    }
    setSkills((prev) => [...prev, { name: newSkillName.trim(), level: "Intermediate" }]);
    setNewSkillName("");
    toast.success("Skill added!");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedName = name.trim() || user?.name || "User";
    const initials = updatedName.slice(0, 2).toUpperCase();

    if (user) {
      useAuth.setState({
        user: {
          ...user,
          name: updatedName,
          avatar: initials,
        },
      });
    }

    toast.success("Profile saved successfully!", {
      description: "All profile details and career preferences have been updated.",
    });
    onOpenChange(false);
  };

  const initials = user?.avatar || (name ? name.slice(0, 2).toUpperCase() : "JI");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-900 text-2xl font-black uppercase shadow-lg ring-4 ring-white/20">
                {initials}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                  {name}
                  <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30 text-[10px] font-semibold">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Candidate
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-emerald-100/90 text-xs mt-0.5">
                  {user?.email || "jobson.id@gmail.com"}
                </DialogDescription>
                <p className="text-emerald-200/80 text-[11px] mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {phone}</span>
                </p>
              </div>
            </div>

            {/* Completeness Pill */}
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm sm:text-right border border-white/10 w-full sm:w-auto">
              <div className="text-[10px] uppercase font-semibold text-emerald-200 tracking-wider">
                Profile Completeness
              </div>
              <div className="text-lg font-black text-white mt-0.5">95%</div>
              <Progress value={95} className="h-1.5 w-28 bg-white/20 mt-1" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="overview" className="p-6 pt-4">
          <TabsList className="grid grid-cols-4 w-full h-10 p-1 bg-muted/60 mb-5">
            <TabsTrigger value="overview" className="text-xs gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="text-xs gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Experience</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Skills</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>Career & CV</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-4 focus-visible:outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="prof-name-input" className="text-xs font-semibold">
                  Display / Full Name
                </Label>
                <Input
                  id="prof-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-email-input" className="text-xs font-semibold">
                  Primary Email
                </Label>
                <Input
                  id="prof-email-input"
                  value={user?.email || "jobson.id@gmail.com"}
                  disabled
                  className="h-9 text-xs bg-muted/50 cursor-not-allowed opacity-80"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-phone-input" className="text-xs font-semibold">
                  Phone Number
                </Label>
                <Input
                  id="prof-phone-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="+91..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-loc-input" className="text-xs font-semibold">
                  Current City / Location
                </Label>
                <Input
                  id="prof-loc-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="e.g. Bengaluru, India"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-headline-input" className="text-xs font-semibold">
                Professional Headline
              </Label>
              <Input
                id="prof-headline-input"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. Full-Stack Software Engineer & Cloud Architect"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-bio-input" className="text-xs font-semibold">
                Professional Summary / Bio
              </Label>
              <Textarea
                id="prof-bio-input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="text-xs resize-none"
                placeholder="Brief summary of your background, achievements & passions..."
              />
            </div>
          </TabsContent>

          {/* TAB 2: EXPERIENCE & EDUCATION */}
          <TabsContent value="experience" className="space-y-5 focus-visible:outline-none">
            {/* Experience Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-emerald-600" /> Work Experience
                </h4>
              </div>
              <div className="space-y-2.5">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-lg border p-3 bg-card hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-foreground">{exp.role}</h5>
                        <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                          <Building2 className="h-3 w-3" /> {exp.company}
                          <span>•</span>
                          <Clock className="h-3 w-3" /> {exp.duration}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground/90 mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-600" /> Education & Degrees
                </h4>
              </div>
              <div className="space-y-2.5">
                {educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="rounded-lg border p-3 bg-card hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-foreground">{edu.degree}</h5>
                        <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                          <Building2 className="h-3 w-3" /> {edu.institution}
                          <span>•</span>
                          <Calendar className="h-3 w-3" /> {edu.year}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {edu.grade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: SKILLS */}
          <TabsContent value="skills" className="space-y-4 focus-visible:outline-none">
            <div>
              <Label className="text-xs font-semibold mb-2 block">
                Technical Skills & Tools ({skills.length})
              </Label>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                {skills.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant="secondary"
                    className="gap-1.5 py-1 px-2.5 text-xs font-medium border bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  >
                    <span>{skill.name}</span>
                    <span className="text-[9px] opacity-60">({skill.level})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="text-emerald-700 hover:text-rose-600 dark:text-emerald-400"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Add New Skill */}
            <form onSubmit={handleAddSkill} className="flex gap-2 pt-2 border-t">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Add a new skill (e.g. Kubernetes, Rust, Figma)..."
                className="h-9 text-xs"
              />
              <Button type="submit" size="sm" className="h-9 px-3 gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </form>
          </TabsContent>

          {/* TAB 4: PREFERENCES & RESUME */}
          <TabsContent value="preferences" className="space-y-4 focus-visible:outline-none">
            {/* Resume Card */}
            <div className="rounded-xl border border-emerald-600/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700 text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      {name.replace(/\s+/g, "_")}_Resume_2026.pdf
                    </h5>
                    <p className="text-[10px] text-muted-foreground">
                      Updated yesterday • 184 KB • PDF
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] gap-1"
                    onClick={() => toast.info("Downloading resume preview...")}
                  >
                    <Download className="h-3 w-3" /> View
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] gap-1"
                    onClick={() => toast.success("Select a file to replace current resume (PDF max 5MB)")}
                  >
                    <Upload className="h-3 w-3" /> Update
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> Desired Job Title
                </Label>
                <Input
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Preferred Work Mode
                </Label>
                <Input
                  value={workArrangement}
                  onChange={(e) => setWorkArrangement(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Expected CTC / Salary
                </Label>
                <Input
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Notice Period
                </Label>
                <Input
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Label className="text-xs font-semibold">Professional Web Links</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 bg-card">
                  <Globe className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn URL"
                    className="w-full bg-transparent text-[11px] outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 bg-card">
                  <Globe className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200 shrink-0" />
                  <input
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="GitHub URL"
                    className="w-full bg-transparent text-[11px] outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 bg-card">
                  <Globe className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <input
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="Portfolio URL"
                    className="w-full bg-transparent text-[11px] outline-none"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-9 px-5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm"
              onClick={handleSave}
            >
              Save Profile Changes
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

