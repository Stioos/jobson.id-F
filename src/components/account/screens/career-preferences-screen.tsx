"use client";

import { useState } from "react";
import {
  Target, Briefcase, Building2, MapPin, Banknote, Laptop, Clock,
  Plane, FileText, Plus, ChevronRight, Compass, Save
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEmployeeProfile } from "@/hooks/use-employee-profile";

interface CareerPreferencesScreenProps {
  onNavigate?: (sectionId: string) => void;
}

export function CareerPreferencesScreen({ onNavigate }: CareerPreferencesScreenProps) {
  const { profile, updateProfile } = useEmployeeProfile();
  const [newIndustry, setNewIndustry] = useState("");

  // Local shorthand for the prefs slice
  const prefs = {
    currentStatus: profile.currentStatus,
    desiredJobTitle: profile.desiredJobTitle,
    preferredIndustry: profile.preferredIndustries,
    jobCategory: profile.jobCategory,
    expectedSalary: profile.expectedSalary,
    preferredLocation: profile.preferredLocation,
    workMode: profile.workMode,
    employmentType: profile.employmentType,
    relocation: profile.relocation,
    availability: profile.availability,
  };

  const setField = (key: string, value: string) => {
    updateProfile({ [key]: value } as any);
  };

  const addIndustry = () => {
    const ind = newIndustry.trim();
    if (!ind) return;
    if (profile.preferredIndustries.some((x) => x.toLowerCase() === ind.toLowerCase())) {
      toast.error("Industry already added.");
      return;
    }
    updateProfile({ preferredIndustries: [...profile.preferredIndustries, ind] });
    setNewIndustry("");
    toast.success(`Industry "${ind}" added.`);
  };

  const removeIndustry = (idx: number) => {
    const removed = profile.preferredIndustries[idx];
    updateProfile({ preferredIndustries: profile.preferredIndustries.filter((_, i) => i !== idx) });
    toast.success(`Industry "${removed}" removed.`);
  };

  const handleSaveObjectives = () => {
    updateProfile({ careerObjectives: profile.careerObjectives });
    toast.success("Career objectives saved successfully!");
  };

  const handleSavePreferences = () => {
    // All fields are already persisted via updateProfile on each change,
    // but this gives explicit feedback to the user.
    toast.success("Career preferences saved successfully!");
  };

  const fields: { label: string; icon: typeof Briefcase; value: string; key: string; options: string[] }[] = [
    { label: "Current Status", icon: Compass, value: prefs.currentStatus, key: "currentStatus", options: ["Actively looking", "Open to offers", "Not looking", "Passive"] },
    { label: "Employment Type", icon: Clock, value: prefs.employmentType, key: "employmentType", options: ["Full-time", "Part-time", "Contract", "Internship"] },
    { label: "Work Mode", icon: Laptop, value: prefs.workMode, key: "workMode", options: ["Remote", "Hybrid", "On-site"] },
    { label: "Availability", icon: Clock, value: prefs.availability, key: "availability", options: ["Immediately", "15 Days", "30 Days", "60 Days"] },
    { label: "Relocation", icon: Plane, value: prefs.relocation, key: "relocation", options: ["Willing to relocate", "Not willing to relocate", "Open to discuss"] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-7 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
            <Target className="h-6 w-6" />
          </span>
        </div>
      </section>

      {/* Desired Job Title & Category */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center gap-2.5 pb-4">
          <Briefcase className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-base font-bold text-foreground dark:text-white">Desired Role</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Desired Job Title</Label>
            <Input value={prefs.desiredJobTitle} onChange={(e) => setField("desiredJobTitle", e.target.value)} className="h-9 rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Job Category</Label>
            <Input value={prefs.jobCategory} onChange={(e) => setField("jobCategory", e.target.value)} className="h-9 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Preferred Industries */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">Preferred Industries</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {prefs.preferredIndustry.map((ind, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
              {ind}
              <button type="button" onClick={() => removeIndustry(i)} className="ml-0.5 text-amber-600/60 hover:text-amber-600 dark:text-amber-400/60 cursor-pointer">×</button>
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Input value={newIndustry} onChange={(e) => setNewIndustry(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addIndustry()} placeholder="Add industry e.g. Healthcare" className="h-9 rounded-lg" />
          <Button type="button" onClick={addIndustry} className="h-9 shrink-0 rounded-lg bg-amber-500 text-xs font-bold text-slate-950 hover:bg-amber-400"><Plus className="h-3.5 w-3.5" /></Button>
        </div>
      </section>

      {/* Salary & Location */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
          <div className="flex items-center gap-2.5 pb-4">
            <Banknote className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">Expected Salary</h3>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Salary Range</Label>
            <Input value={prefs.expectedSalary} onChange={(e) => setField("expectedSalary", e.target.value)} className="h-9 rounded-lg" />
          </div>
        </section>
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
          <div className="flex items-center gap-2.5 pb-4">
            <MapPin className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">Preferred Location</h3>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground dark:text-slate-400">Location Preference</Label>
            <Input value={prefs.preferredLocation} onChange={(e) => setField("preferredLocation", e.target.value)} className="h-9 rounded-lg" />
          </div>
        </section>
      </div>

      {/* Work Preferences (selects) */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <Laptop className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">Work Preferences</h3>
          </div>
          <Button type="button" onClick={handleSavePreferences} className="h-9 rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400">
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save Preferences
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key} className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground dark:text-slate-400">
                  <Icon className="h-3.5 w-3.5" /> {f.label}
                </Label>
                <Select value={f.value} onValueChange={(v) => setField(f.key, v)}>
                  <SelectTrigger className="h-9 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </section>

      {/* Career Objectives */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center gap-2.5 pb-4">
          <FileText className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-base font-bold text-foreground dark:text-white">Career Objectives</h3>
        </div>
        <Textarea
          value={profile.careerObjectives}
          onChange={(e) => updateProfile({ careerObjectives: e.target.value })}
          className="rounded-lg text-sm"
          rows={4}
          placeholder="Describe your career goals and objectives..."
        />
        <div className="mt-3 flex justify-end">
          <Button type="button" onClick={handleSaveObjectives} className="h-9 rounded-lg bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400">
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save Objectives
          </Button>
        </div>
      </section>

      {/* Next Step CTA */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card p-5 dark:via-slate-900/80 dark:to-slate-900">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-foreground dark:text-white">Showcase your projects and portfolio next</p>
          <button type="button" onClick={() => onNavigate?.("projects-portfolio")} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-amber-400 cursor-pointer">
            Continue <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
