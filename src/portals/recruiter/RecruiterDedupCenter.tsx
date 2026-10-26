"use client";

import * as React from "react";
import {
  Copy, GitMerge, Mail, Phone, User, Linkedin, Calendar, Check, X,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState, Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface DupCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  dateAdded: string;
  skillsCount: number;
  linkedin?: string;
  avatarColor: string;
}

interface DupGroup {
  id: string;
  matchField: "email" | "phone" | "name" | "linkedin";
  confidence: "High" | "Medium" | "Low";
  candidates: DupCandidate[];
}

interface MergeHistory {
  id: string;
  date: string;
  mergedInto: string;
  removed: string[];
  by: string;
}

const GROUPS: DupGroup[] = [
  {
    id: "g1", matchField: "email", confidence: "High",
    candidates: [
      { id: "d1a", name: "Arjun Iyer", email: "arjun.iyer@gmail.com", phone: "+91 98765 43210", source: "Naukri", dateAdded: "2024-09-12", skillsCount: 8, linkedin: "in/arjun-iyer", avatarColor: "oklch(0.55 0.13 165)" },
      { id: "d1b", name: "Arjun I.", email: "arjun.iyer@gmail.com", phone: "+91 98765 43210", source: "Referral", dateAdded: "2024-10-02", skillsCount: 5, linkedin: "in/arjun-iyer", avatarColor: "oklch(0.55 0.13 165)" },
    ],
  },
  {
    id: "g2", matchField: "phone", confidence: "High",
    candidates: [
      { id: "d2a", name: "Kavya Reddy", email: "kavya.r@outlook.com", phone: "+91 99876 11223", source: "LinkedIn", dateAdded: "2024-08-22", skillsCount: 7, avatarColor: "oklch(0.6 0.12 200)" },
      { id: "d2b", name: "Kavya R.", email: "kavya.reddy@dataminds.ai", phone: "+91 99876 11223", source: "Career Page", dateAdded: "2024-09-30", skillsCount: 4, avatarColor: "oklch(0.6 0.12 200)" },
    ],
  },
  {
    id: "g3", matchField: "name", confidence: "Medium",
    candidates: [
      { id: "d3a", name: "Rohan Mehta", email: "rohan.m@gmail.com", phone: "+91 90909 88123", source: "Naukri", dateAdded: "2024-07-10", skillsCount: 6, avatarColor: "oklch(0.55 0.13 280)" },
      { id: "d3b", name: "Rohan Mehta", email: "rohan.mehta@finedge.io", phone: "+91 90080 76543", source: "Inbound", dateAdded: "2024-10-15", skillsCount: 5, avatarColor: "oklch(0.55 0.13 280)" },
    ],
  },
  {
    id: "g4", matchField: "linkedin", confidence: "High",
    candidates: [
      { id: "d4a", name: "Sneha Kapoor", email: "sneha.k@yahoo.com", phone: "+91 98112 33445", source: "Referral", dateAdded: "2024-06-18", skillsCount: 6, linkedin: "in/sneha-kapoor", avatarColor: "oklch(0.6 0.13 30)" },
      { id: "d4b", name: "Sneha K.", email: "sneha.kapoor@startupx.com", phone: "+91 98112 99887", source: "LinkedIn", dateAdded: "2024-10-05", skillsCount: 4, linkedin: "in/sneha-kapoor", avatarColor: "oklch(0.6 0.13 30)" },
    ],
  },
  {
    id: "g5", matchField: "name", confidence: "Low",
    candidates: [
      { id: "d5a", name: "Vikram Nair", email: "vikram.nair@gmail.com", phone: "+91 90090 12345", source: "Naukri", dateAdded: "2024-05-22", skillsCount: 9, avatarColor: "oklch(0.55 0.13 100)" },
      { id: "d5b", name: "Vikram N.", email: "vikramnair@dminds.ai", phone: "+91 90080 99988", source: "Talent Pool", dateAdded: "2024-09-08", skillsCount: 7, avatarColor: "oklch(0.55 0.13 100)" },
      { id: "d5c", name: "Vikram Nair", email: "v.nair@webify.io", phone: "+91 97000 12121", source: "Inbound", dateAdded: "2024-10-22", skillsCount: 3, avatarColor: "oklch(0.55 0.13 100)" },
    ],
  },
];

const HISTORY: MergeHistory[] = [
  { id: "h1", date: "2024-10-20", mergedInto: "Priya Nair", removed: ["priya.nair@gmail.com (dup)"], by: "Recruiter: Amit" },
  { id: "h2", date: "2024-10-15", mergedInto: "Aditya Sharma", removed: ["aditya.s@outlook.com (dup)"], by: "System (auto)" },
  { id: "h3", date: "2024-10-08", mergedInto: "Neha Patel", removed: ["neha@webify.io (dup)", "n.patel@startupx.com (dup)"], by: "Recruiter: Sara" },
];

const CONFIDENCE_TONES: Record<DupGroup["confidence"], string> = {
  High: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  Low: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
};

const FIELD_ICONS: Record<DupGroup["matchField"], React.ReactNode> = {
  email: <Mail className="h-3.5 w-3.5" />,
  phone: <Phone className="h-3.5 w-3.5" />,
  name: <User className="h-3.5 w-3.5" />,
  linkedin: <Linkedin className="h-3.5 w-3.5" />,
};

export function RecruiterDedupCenter() {
  const [groups, setGroups] = React.useState<DupGroup[]>(GROUPS);
  const [history, setHistory] = React.useState<MergeHistory[]>(HISTORY);
  const [settings, setSettings] = React.useState({ email: true, phone: true, name: true, linkedin: false, autoMerge: false });
  const [mergeGroup, setMergeGroup] = React.useState<DupGroup | null>(null);
  const [selectedMaster, setSelectedMaster] = React.useState<string>("");

  function openMerge(g: DupGroup) {
    setMergeGroup(g);
    setSelectedMaster(g.candidates[0].id);
  }

  function confirmMerge() {
    if (!mergeGroup) return;
    const master = mergeGroup.candidates.find((c) => c.id === selectedMaster);
    const removed = mergeGroup.candidates.filter((c) => c.id !== selectedMaster);
    if (!master) return;
    const newHistory: MergeHistory = {
      id: `h_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      mergedInto: master.name,
      removed: removed.map((c) => `${c.email} (dup)`),
      by: "Recruiter: You",
    };
    setHistory((h) => [newHistory, ...h]);
    setGroups((g) => g.filter((x) => x.id !== mergeGroup.id));
    toast.success("Merged duplicates", { description: `${removed.length} duplicate profile(s) merged into ${master.name}` });
    setMergeGroup(null);
  }

  function dismiss(g: DupGroup) {
    setGroups((arr) => arr.filter((x) => x.id !== g.id));
    toast.info("Duplicate group dismissed", { description: "Not actually duplicates — keep both." });
  }

  function runAutoDetect() {
    toast.success("Auto-detect scan started", { description: "Scanning all candidates for matches…" });
  }

  const totalDuplicates = groups.reduce((s, g) => s + g.candidates.length - 1, 0);
  const highConfidence = groups.filter((g) => g.confidence === "High").length;
  const mergeCount = history.length;
  const cleaned = totalDuplicates;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Dedup Center"
        description="Detect, review, and merge duplicate candidate profiles. Auto-scan by email, phone, name, or LinkedIn. Every merge is logged for audit."
        icon={<Icon name="Copy" className="h-6 w-6" />}
        actions={[
          { label: "Run auto-detect", icon: "Sparkles", variant: "outline", onClick: runAutoDetect },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Duplicate groups" value={groups.length} icon={<Copy className="h-5 w-5" />} tone="brand" />
        <StatCard label="Duplicate profiles" value={totalDuplicates} icon={<User className="h-5 w-5" />} tone="warning" />
        <StatCard label="High confidence" value={highConfidence} icon={<Check className="h-5 w-5" />} tone="danger" />
        <StatCard label="Merges completed" value={mergeCount} icon={<GitMerge className="h-5 w-5" />} tone="success" />
      </div>

      <SectionCard title="Auto-detect settings" description="Choose which fields trigger duplicate detection">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {([
            { key: "email", label: "Email match", desc: "Same email address" },
            { key: "phone", label: "Phone match", desc: "Same phone number" },
            { key: "name", label: "Name match", desc: "Same full name" },
            { key: "linkedin", label: "LinkedIn match", desc: "Same LinkedIn handle" },
          ] as const).map((s) => (
            <div key={s.key} className="flex items-start justify-between gap-3 rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">{s.label}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
              <Switch checked={settings[s.key]} onCheckedChange={(v) => setSettings((p) => ({ ...p, [s.key]: v }))} />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-brand/30 bg-brand/5 p-3">
          <div>
            <Label className="text-sm font-medium">Auto-merge High-confidence duplicates</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Automatically merge when email AND phone both match</p>
          </div>
          <Switch checked={settings.autoMerge} onCheckedChange={(v) => { setSettings((p) => ({ ...p, autoMerge: v })); toast.info(v ? "Auto-merge enabled" : "Auto-merge disabled"); }} />
        </div>
      </SectionCard>

      <SectionCard title="Potential duplicates" description="Review each group and merge or dismiss">
        {groups.length === 0 ? (
          <EmptyState icon={<Check className="h-5 w-5" />} title="No duplicates found" description="Your candidate database is clean!" />
        ) : (
          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
            {groups.map((g) => (
              <Card key={g.id}>
                <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${CONFIDENCE_TONES[g.confidence]}`}>{g.confidence} confidence</Badge>
                    <Badge variant="outline" className="text-xs gap-1">{FIELD_ICONS[g.matchField]} {g.matchField} match</Badge>
                    <span className="text-xs text-muted-foreground">{g.candidates.length} profiles</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => dismiss(g)}>Dismiss</Button>
                    <Button size="sm" onClick={() => openMerge(g)}><GitMerge className="mr-1 h-3.5 w-3.5" /> Merge</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {g.candidates.map((c) => (
                      <div key={c.id} className="rounded-lg border p-3">
                        <div className="flex items-start gap-2.5">
                          <AvatarLogo name={c.name} color={c.avatarColor} className="h-9 w-9" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{c.name}</p>
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</p>
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px]">{c.source}</Badge>
                          <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" />{formatDate(c.dateAdded)}</span>
                          <span className="flex items-center gap-0.5"><Check className="h-3 w-3" />{c.skillsCount} skills</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Merge history" description="Audit trail of all past merges">
        {history.length === 0 ? (
          <EmptyState icon={<GitMerge className="h-5 w-5" />} title="No merges yet" />
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"><GitMerge className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">Merged into <span className="text-brand">{h.mergedInto}</span></p>
                    <p className="text-xs text-muted-foreground truncate">Removed: {h.removed.join(", ")}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0">
                  <p>{formatDate(h.date)}</p>
                  <p>{h.by}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <Dialog open={!!mergeGroup} onOpenChange={(o) => !o && setMergeGroup(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Merge duplicate profiles</DialogTitle>
            <DialogDescription>Select the master profile to keep, then choose fields to retain from each duplicate.</DialogDescription>
          </DialogHeader>
          {mergeGroup && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Master profile (primary)</Label>
                <div className="mt-2 space-y-2">
                  {mergeGroup.candidates.map((c) => (
                    <label key={c.id} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer ${selectedMaster === c.id ? "border-brand bg-brand/5" : ""}`}>
                      <input type="radio" name="master" checked={selectedMaster === c.id} onChange={() => setSelectedMaster(c.id)} className="accent-emerald-600" />
                      <AvatarLogo name={c.name} color={c.avatarColor} className="h-8 w-8" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.email} · {c.phone}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{c.source}</Badge>
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs text-muted-foreground">
                <Check className="inline h-3.5 w-3.5 text-brand mr-1" />
                Merge will combine skills, work history, and notes from all duplicates into the master profile. Duplicate entries will be soft-deleted (recoverable for 30 days).
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={confirmMerge}><GitMerge className="mr-1 h-4 w-4" /> Confirm merge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
