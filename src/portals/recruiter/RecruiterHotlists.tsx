"use client";

import * as React from "react";
import {
  Plus, Flame, Users, Share2, Tag, ListFilter, UserPlus, UserMinus, Eye, X, Search,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState, MatchScore } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { hotlists } from "@/lib/partner-data";
import type { Hotlist } from "@/lib/partner-types";

interface CandidateRow {
  id: string;
  name: string;
  match: number;
  skills: string[];
  experience: number;
  notice: string;
  status: "available" | "shortlisted" | "interviewing" | "placed";
}

// Curated mock candidates per hotlist — keeps the detail view realistic.
const HOTLIST_CANDIDATES: Record<string, CandidateRow[]> = {
  hl_001: [
    { id: "c1", name: "Priya Nair", match: 94, skills: ["React", "TypeScript", "Next.js"], experience: 6, notice: "15 days", status: "available" },
    { id: "c2", name: "Arjun Iyer", match: 88, skills: ["React", "Redux", "Jest"], experience: 5, notice: "Immediate", status: "shortlisted" },
    { id: "c3", name: "Kavya Reddy", match: 82, skills: ["React", "GraphQL"], experience: 4, notice: "30 days", status: "available" },
    { id: "c4", name: "Vikram Singh", match: 76, skills: ["React", "Node.js"], experience: 3, notice: "Immediate", status: "interviewing" },
    { id: "c5", name: "Neha Gupta", match: 71, skills: ["React", "Webpack"], experience: 3, notice: "45 days", status: "available" },
  ],
  hl_002: [
    { id: "c6", name: "Rahul Mehta", match: 91, skills: ["Kubernetes", "AWS", "Terraform"], experience: 7, notice: "30 days", status: "available" },
    { id: "c7", name: "Sanjay Patel", match: 85, skills: ["Kubernetes", "Helm", "ArgoCD"], experience: 6, notice: "Immediate", status: "shortlisted" },
    { id: "c8", name: "Anjali Rao", match: 78, skills: ["Kubernetes", "Docker"], experience: 5, notice: "20 days", status: "available" },
  ],
  hl_003: [
    { id: "c9", name: "Sneha Kapoor", match: 95, skills: ["Python", "ML", "MLOps"], experience: 8, notice: "60 days", status: "available" },
    { id: "c10", name: "Manish Verma", match: 89, skills: ["Python", "TensorFlow", "Keras"], experience: 7, notice: "30 days", status: "available" },
  ],
  hl_004: [
    { id: "c11", name: "Divya Sharma", match: 86, skills: ["Java", "Spring"], experience: 6, notice: "15 days", status: "available" },
    { id: "c12", name: "Karthik Menon", match: 83, skills: [".NET", "Azure"], experience: 5, notice: "Immediate", status: "shortlisted" },
    { id: "c13", name: "Pooja Bhat", match: 79, skills: ["Python", "Django"], experience: 4, notice: "20 days", status: "available" },
  ],
};

const ALL_TAGS = Array.from(new Set(hotlists.flatMap((h) => h.tags))).sort();

export function RecruiterHotlists() {
  const [search, setSearch] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState<string[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<Hotlist | null>(null);

  const toggleTag = (t: string) =>
    setTagFilter((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const filtered = hotlists.filter((h) => {
    if (search) {
      const q = search.toLowerCase();
      if (!h.name.toLowerCase().includes(q) && !h.description.toLowerCase().includes(q)) return false;
    }
    if (tagFilter.length > 0 && !tagFilter.every((t) => h.tags.includes(t))) return false;
    return true;
  });

  const totalCandidates = hotlists.reduce((a, h) => a + h.candidateCount, 0);
  const sharedCount = hotlists.filter((h) => h.shared).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotlists"
        description="Curated candidate lists for fast sourcing. Tag, share, and track match scores per candidate."
        actions={[{ label: "Create hotlist", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Hotlists" value={hotlists.length} icon={<Flame className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total candidates" value={totalCandidates} icon={<Users className="h-5 w-5" />} tone="default" />
        <StatCard label="Shared" value={sharedCount} icon={<Share2 className="h-5 w-5" />} tone="success" hint="Visible to team" />
        <StatCard label="Tags" value={ALL_TAGS.length} icon={<Tag className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="Filter by tag"
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hotlists…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-40 sm:w-56 pl-8"
              />
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((t) => {
            const active = tagFilter.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "bg-brand text-brand-foreground border-brand"
                    : "bg-card text-muted-foreground border-border hover:border-brand hover:text-brand"
                }`}
              >
                <Tag className="h-3 w-3" />
                {t}
                {active && <X className="h-3 w-3" />}
              </button>
            );
          })}
          {tagFilter.length > 0 && (
            <button
              onClick={() => setTagFilter([])}
              className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ListFilter className="h-3 w-3 mr-1" /> Clear
            </button>
          )}
        </div>
      </SectionCard>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Flame className="h-5 w-5" />}
          title="No hotlists match"
          description="Adjust filters or create a new hotlist to get started."
          action={<Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-1" /> New hotlist</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((h) => (
            <button
              key={h.id}
              onClick={() => setDetail(h)}
              className="text-left rounded-xl border bg-card p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-brand transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Flame className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight truncate">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.candidateCount} candidates</p>
                  </div>
                </div>
                {h.shared && (
                  <Badge variant="outline" className="bg-brand/5 text-brand border-brand/30 text-[10px]">
                    <Share2 className="h-3 w-3 mr-1" />Shared
                  </Badge>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{h.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {h.tags.slice(0, 4).map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                ))}
                {h.tags.length > 4 && (
                  <Badge variant="outline" className="text-[10px]">+{h.tags.length - 4}</Badge>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <span>By {h.createdBy.split(" ").map((p, i) => i === 0 ? p : p[0] + ".").join(" ")}</span>
                <span>{formatDate(h.createdAt, { day: "numeric", month: "short" })}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <AddHotlistDialog open={addOpen} onOpenChange={setAddOpen} />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && <HotlistDetail hotlist={detail} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function HotlistDetail({ hotlist }: { hotlist: Hotlist }) {
  const [candidates, setCandidates] = React.useState<CandidateRow[]>(
    HOTLIST_CANDIDATES[hotlist.id] ?? []
  );
  const [addOpen, setAddOpen] = React.useState(false);

  const removeCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    toast.success("Candidate removed", { description: `${candidates.length - 1} remaining in ${hotlist.name}` });
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Flame className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">{hotlist.name}</div>
            <div className="text-xs text-muted-foreground">
              {candidates.length} candidates · By {hotlist.createdBy}
            </div>
          </div>
        </SheetTitle>
        <SheetDescription className="sr-only">Hotlist detail</SheetDescription>
      </SheetHeader>
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">{hotlist.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          {hotlist.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-xs"><Tag className="h-3 w-3 mr-1" />{t}</Badge>
          ))}
          {hotlist.shared && (
            <Badge variant="outline" className="bg-brand/5 text-brand border-brand/30 text-xs">
              <Share2 className="h-3 w-3 mr-1" />Shared with team
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.success("Share link copied", { description: `${hotlist.name} is now shareable with your team` })}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info("Hotlist opened in sourcing view", { description: `${candidates.length} candidates` })}>
            <Eye className="h-4 w-4 mr-1" /> Open in sourcing
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Add candidates
          </Button>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Candidates</h4>
          {candidates.length === 0 ? (
            <EmptyState
              icon={<Users className="h-5 w-5" />}
              title="No candidates yet"
              description="Add candidates to this hotlist to start sourcing."
            />
          ) : (
            <div className="max-h-96 overflow-y-auto scroll-thin space-y-2">
              {candidates.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-lg border p-3 hover:border-brand transition-colors">
                  <MatchScore score={c.match} />
                  <AvatarLogo text={c.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <div className="flex flex-wrap items-center gap-1 mt-0.5">
                      {c.skills.slice(0, 3).map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                      ))}
                      <span className="text-[10px] text-muted-foreground">· {c.experience}y · {c.notice}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCandidate(c.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                    aria-label="Remove candidate"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddCandidatesDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={(names) => {
          const newRows: CandidateRow[] = names.map((n, i) => ({
            id: `c_new_${Date.now()}_${i}`,
            name: n,
            match: Math.floor(60 + Math.random() * 35),
            skills: [],
            experience: 0,
            notice: "TBD",
            status: "available",
          }));
          setCandidates((prev) => [...prev, ...newRows]);
          toast.success(`${newRows.length} candidate(s) added`, { description: `to ${hotlist.name}` });
        }}
      />
    </>
  );
}

function AddCandidatesDialog({
  open, onOpenChange, onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (names: string[]) => void;
}) {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);

  const pool = ["Aditya Kumar", "Bhavya Reddy", "Chetan Joshi", "Deepa Menon", "Eshwar Iyer", "Farida Khan", "Gaurav Nair", "Harini Rao"];

  const reset = () => { setSearch(""); setSelected([]); };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add candidates</DialogTitle>
          <DialogDescription>Search and pick candidates from your talent pool to add to this hotlist.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Search talent pool…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto scroll-thin rounded-lg border">
            {pool
              .filter((n) => !search || n.toLowerCase().includes(search.toLowerCase()))
              .map((n) => {
                const isSel = selected.includes(n);
                return (
                  <button
                    key={n}
                    onClick={() => setSelected((prev) => isSel ? prev.filter((x) => x !== n) : [...prev, n])}
                    className={`flex w-full items-center gap-3 border-b p-2.5 text-left transition-colors last:border-0 ${
                      isSel ? "bg-brand/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <AvatarLogo text={n} size="sm" />
                    <span className="text-sm font-medium flex-1">{n}</span>
                    {isSel && <Badge variant="default" className="text-[10px]">Selected</Badge>}
                  </button>
                );
              })}
          </div>
          {selected.length > 0 && (
            <p className="text-xs text-muted-foreground">{selected.length} selected</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={selected.length === 0}
            onClick={() => {
              onAdd(selected);
              onOpenChange(false);
            }}
          >
            Add {selected.length > 0 ? `(${selected.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddHotlistDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [shared, setShared] = React.useState(false);

  const reset = () => { setName(""); setDescription(""); setTags(""); setShared(false); };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create hotlist</DialogTitle>
          <DialogDescription>Curate a list of pre-screened candidates for fast sourcing on similar mandates.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="hl-name">Name *</Label>
            <Input id="hl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Immediate Joiners — React" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hl-desc">Description</Label>
            <Textarea id="hl-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short summary of who's on this list" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hl-tags">Tags (comma-separated)</Label>
            <Input id="hl-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, immediate, senior" />
          </div>
          <label className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Share with team</p>
              <p className="text-xs text-muted-foreground">Make this hotlist visible to other recruiters in your agency</p>
            </div>
            <Switch checked={shared} onCheckedChange={setShared} />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!name) {
                toast.error("Hotlist name is required");
                return;
              }
              onOpenChange(false);
              toast.success("Hotlist created", { description: name });
              reset();
            }}
          >
            Create hotlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
