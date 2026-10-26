"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  talentPools as seedPools,
  talentPoolEntries as seedEntries,
  individualLearners,
  learnerCertificates,
  sourcingRequests,
} from "@/lib/lms-data";
import type { IndividualLearner } from "@/lib/lms-data";
import { useNav } from "@/lib/store";
import {
  PageHeader, SectionCard, StatCard, StatusBadge, MatchScore, EmptyState,
  Card, CardContent,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate, formatNumber } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  Database, Plus, Search, Send, Trash2, ArrowLeft, Users, Award,
  Sparkles, Filter,
} from "lucide-react";

// ---------- types ----------

interface Pool {
  id: string;
  name: string;
  description: string;
  learnerCount: number;
  skills: string[];
  createdAt: string;
}

interface PoolEntry {
  id: string;
  learnerId: string;
  learnerName: string;
  poolId: string;
  poolName: string;
  addedDate: string;
  matchScore: number;
  status: "available" | "shortlisted" | "placed" | "withdrawn";
}

const ALL_SKILLS = Array.from(new Set(individualLearners.flatMap((l) => l.skills.map((s) => s.name)))).sort();

// ---------- form schema ----------

const poolSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Add a short description"),
});
type PoolFormValues = z.infer<typeof poolSchema>;

// ---------- main page ----------

export function TrainingTalentPools() {
  const { navigate } = useNav();
  const [pools, setPools] = React.useState<Pool[]>(seedPools);
  const [entries, setEntries] = React.useState<PoolEntry[]>(seedEntries);
  const [skillFilter, setSkillFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [activePool, setActivePool] = React.useState<Pool | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [addLearnersOpen, setAddLearnersOpen] = React.useState(false);
  const [createSkills, setCreateSkills] = React.useState<string[]>([]);
  const [removeEntry, setRemoveEntry] = React.useState<PoolEntry | null>(null);
  const [submitEntry, setSubmitEntry] = React.useState<PoolEntry | null>(null);
  const [submitRequest, setSubmitRequest] = React.useState("");

  const form = useForm<PoolFormValues>({
    resolver: zodResolver(poolSchema) as Resolver<PoolFormValues>,
    defaultValues: { name: "", description: "" },
  });

  const filteredPools = pools.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchSkill = skillFilter === "all" || p.skills.includes(skillFilter);
    return matchSearch && matchSkill;
  });

  const totalLearners = entries.length;
  const totalPools = pools.length;
  const availableCount = entries.filter((e) => e.status === "available").length;
  const avgMatch = entries.length > 0 ? Math.round(entries.reduce((s, e) => s + e.matchScore, 0) / entries.length) : 0;

  function onCreate(values: PoolFormValues) {
    const id = `tpl_new_${Date.now()}`;
    const newPool: Pool = {
      id, name: values.name, description: values.description,
      learnerCount: 0, skills: createSkills, createdAt: new Date().toISOString(),
    };
    setPools((p) => [newPool, ...p]);
    setCreateOpen(false);
    form.reset();
    setCreateSkills([]);
    toast.success(`Talent pool created — ${values.name}`, { description: "Add certified learners to begin sourcing." });
  }

  function onRemove(entry: PoolEntry) {
    setEntries((e) => e.filter((x) => x.id !== entry.id));
    setPools((p) => p.map((pool) => pool.id === entry.poolId ? { ...pool, learnerCount: Math.max(0, pool.learnerCount - 1) } : pool));
    setRemoveEntry(null);
    toast.success(`${entry.learnerName} removed from pool`, { description: "Status updated." });
  }

  function addLearnerToPool(learner: IndividualLearner, pool: Pool) {
    if (entries.some((e) => e.learnerId === learner.id && e.poolId === pool.id)) {
      toast.error(`${learner.name} is already in this pool`);
      return;
    }
    const hash = (learner.id + pool.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = 60 + (hash % 38);
    const newEntry: PoolEntry = {
      id: `tpe_new_${Date.now()}`,
      learnerId: learner.id, learnerName: learner.name,
      poolId: pool.id, poolName: pool.name,
      addedDate: new Date().toISOString(),
      matchScore: score, status: "available",
    };
    setEntries((e) => [newEntry, ...e]);
    setPools((p) => p.map((pp) => pp.id === pool.id ? { ...pp, learnerCount: pp.learnerCount + 1 } : pp));
    toast.success(`${learner.name} added to ${pool.name}`, { description: `Match score: ${score}/100` });
  }

  function submitToRequest(entry: PoolEntry, requestId: string) {
    const req = sourcingRequests.find((r) => r.id === requestId);
    if (!req) { toast.error("Select a sourcing request first"); return; }
    setEntries((e) => e.map((x) => x.id === entry.id ? { ...x, status: "shortlisted" as const } : x));
    toast.success(`${entry.learnerName} submitted to ${req.employerName}`, {
      description: `Role: ${req.role} · Pool entry marked shortlisted.`,
    });
    setSubmitEntry(null);
    setSubmitRequest("");
  }

  // ---------- pool detail view ----------
  if (activePool) {
    const poolEntries = entries.filter((e) => e.poolId === activePool.id);
    return (
      <div className="space-y-5">
        <PageHeader
          title={activePool.name}
          description={activePool.description}
          icon={<Database className="h-6 w-6" />}
          breadcrumbs={[
            { label: "Talent Pools", onClick: () => setActivePool(null) },
            { label: activePool.name },
          ]}
          actions={[
            { label: "Add learners", icon: "Plus", onClick: () => setAddLearnersOpen(true) },
          ]}
        />

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard label="Learners in pool" value={poolEntries.length} icon={<Users className="h-5 w-5" />} tone="brand" />
          <StatCard label="Available" value={poolEntries.filter((e) => e.status === "available").length} icon={<Database className="h-5 w-5" />} tone="success" />
          <StatCard label="Avg match" value={poolEntries.length ? Math.round(poolEntries.reduce((s, e) => s + e.matchScore, 0) / poolEntries.length) : "—"} icon={<Sparkles className="h-5 w-5" />} />
          <StatCard label="Skills tagged" value={activePool.skills.length} icon={<Award className="h-5 w-5" />} />
        </div>

        {activePool.skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pool skills:</span>
            {activePool.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
          </div>
        )}

        <SectionCard title="Pool members" description={`${poolEntries.length} certified learners in this pool`}>
          {poolEntries.length === 0 ? (
            <EmptyState
              icon={<Users className="h-5 w-5" />}
              title="Pool is empty"
              description="Add certified learners to this pool to begin sourcing."
              action={<Button onClick={() => setAddLearnersOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add learners</Button>}
            />
          ) : (
            <div className="space-y-2">
              {poolEntries.map((e) => {
                const learner = individualLearners.find((l) => l.id === e.learnerId);
                return (
                  <div key={e.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <AvatarLogo text={e.learnerName} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">{e.learnerName}</p>
                          <StatusBadge status={e.status} />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {learner?.headline ?? "—"} · Added {formatDate(e.addedDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MatchScore score={e.matchScore} />
                      <Button size="sm" variant="outline" onClick={() => { setSubmitEntry(e); setSubmitRequest(sourcingRequests.find((r) => r.status === "open" || r.status === "in_progress")?.id ?? ""); }}>
                        <Send className="mr-1 h-3.5 w-3.5" /> Submit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-700" onClick={() => setRemoveEntry(e)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Add learners dialog */}
        <Dialog open={addLearnersOpen} onOpenChange={setAddLearnersOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add learners to "{activePool.name}"</DialogTitle>
              <DialogDescription>Search certified learners from the pool. Click to add. Learners already in this pool are hidden.</DialogDescription>
            </DialogHeader>
            <AddLearnersPicker
              poolId={activePool.id}
              existingEntryIds={entries.filter((e) => e.poolId === activePool.id).map((e) => e.learnerId)}
              onAdd={(l) => addLearnerToPool(l, activePool)}
              onClose={() => setAddLearnersOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Remove confirm */}
        <AlertDialog open={!!removeEntry} onOpenChange={(o) => !o && setRemoveEntry(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove from pool?</AlertDialogTitle>
              <AlertDialogDescription>
                {removeEntry && `This will remove ${removeEntry.learnerName} from "${removeEntry.poolName}". The learner's account and certificates are unaffected.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-rose-600 hover:bg-rose-700"
                onClick={() => removeEntry && onRemove(removeEntry)}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Submit to request dialog */}
        <Dialog open={!!submitEntry} onOpenChange={(o) => !o && setSubmitEntry(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit to sourcing request</DialogTitle>
              <DialogDescription>
                {submitEntry && `Submit ${submitEntry.learnerName} to an open request from a partner client.`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="submit-req">Sourcing request</Label>
                <Select value={submitRequest} onValueChange={setSubmitRequest}>
                  <SelectTrigger id="submit-req"><SelectValue placeholder="Select a request" /></SelectTrigger>
                  <SelectContent>
                    {sourcingRequests.filter((r) => r.status === "open" || r.status === "in_progress").map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.title} — {r.employerName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {submitEntry && submitRequest && (() => {
                const r = sourcingRequests.find((x) => x.id === submitRequest);
                if (!r) return null;
                return (
                  <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Pool match score</span>
                      <span className="font-bold">{submitEntry.matchScore}/100</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">Commission on placement: {r.commissionPerPlacement ? `₹${r.commissionPerPlacement.toLocaleString("en-IN")}` : "—"}</p>
                  </div>
                );
              })()}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button disabled={!submitRequest} onClick={() => submitEntry && submitToRequest(submitEntry, submitRequest)}>
                <Send className="mr-2 h-4 w-4" /> Submit candidate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ---------- pool grid view ----------
  return (
    <div className="space-y-5">
      <PageHeader
        title="Talent Pools"
        description="Curated pools of certified learners. Group by skill, certification, or hiring campaign — then submit candidates to employer requests."
        icon={<Database className="h-6 w-6" />}
        actions={[{ label: "Create pool", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total pools" value={totalPools} icon={<Database className="h-5 w-5" />} tone="brand" />
        <StatCard label="Learners in pools" value={totalLearners} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Available" value={availableCount} icon={<Sparkles className="h-5 w-5" />} tone="success" hint="not yet submitted" />
        <StatCard label="Avg match" value={avgMatch || "—"} icon={<Award className="h-5 w-5" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search pools..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="h-9 w-[180px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Filter by skill" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {ALL_SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => navigate("training", "talent-search")} className="ml-auto">
          <Search className="mr-1 h-3.5 w-3.5" /> Find candidates
        </Button>
      </div>

      {/* Pool cards */}
      {filteredPools.length === 0 ? (
        <EmptyState
          icon={<Database className="h-5 w-5" />}
          title="No pools found"
          description="Create your first talent pool to begin sourcing."
          action={<Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" /> Create pool</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPools.map((p) => {
            const poolEntries = entries.filter((e) => e.poolId === p.id);
            const available = poolEntries.filter((e) => e.status === "available").length;
            return (
              <Card key={p.id} className="cursor-pointer p-4 transition hover:shadow-md" onClick={() => setActivePool(p)}>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Database className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</span>
                </div>
                <h3 className="mt-3 font-semibold">{p.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                  {p.skills.length > 3 && <Badge variant="outline" className="text-[10px]">+{p.skills.length - 3}</Badge>}
                  {p.skills.length === 0 && <span className="text-[10px] text-muted-foreground">no skills tagged</span>}
                </div>
                <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs">
                  <span className="font-medium">{p.learnerCount} learners</span>
                  <span className="text-muted-foreground">{available} available</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create pool dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create talent pool</DialogTitle>
            <DialogDescription>Group certified learners by skill, role, or campaign. You can add learners after creating.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
            <div>
              <Label htmlFor="pool-name">Pool name *</Label>
              <Input id="pool-name" placeholder="e.g. Senior Frontend Engineers" {...form.register("name")} className="mt-1" />
              {form.formState.errors.name && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="pool-desc">Description *</Label>
              <Textarea id="pool-desc" placeholder="What kind of candidates belong in this pool?" {...form.register("description")} className="mt-1" rows={3} />
              {form.formState.errors.description && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.description.message}</p>}
            </div>
            <div>
              <Label>Skills to tag (optional)</Label>
              <p className="mt-1 text-xs text-muted-foreground">Helps filter pools and surface match scores.</p>
              <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto scroll-thin">
                {ALL_SKILLS.map((s) => {
                  const active = createSkills.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCreateSkills((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s])}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                        active ? "border-brand bg-brand text-white" : "border-border bg-card hover:border-brand/40 hover:bg-brand/5"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Create pool</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- AddLearnersPicker ----------

function AddLearnersPicker({
  poolId, existingEntryIds, onAdd, onClose,
}: {
  poolId: string;
  existingEntryIds: string[];
  onAdd: (learner: IndividualLearner) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = React.useState("");
  const [skillFilter, setSkillFilter] = React.useState("all");

  const available = individualLearners.filter((l) => !existingEntryIds.includes(l.id));
  const filtered = available.filter((l) => {
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.headline.toLowerCase().includes(search.toLowerCase());
    const matchSkill = skillFilter === "all" || l.skills.some((s) => s.name === skillFilter);
    return matchSearch && matchSkill;
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search learners..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Skill" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {ALL_SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="max-h-96 space-y-1.5 overflow-y-auto scroll-thin">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No certified learners match.</p>
        ) : (
          filtered.map((l) => {
            const certs = learnerCertificates.filter((c) => c.learnerId === l.id);
            return (
              <div key={l.id} className="flex items-center justify-between rounded-lg border p-2.5 hover:bg-muted/40">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <AvatarLogo text={l.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{l.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{l.headline}</p>
                  </div>
                  <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                    <span>{certs.length} certs</span>
                    {l.openToWork && <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 text-[10px]">Open</Badge>}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAdd(l)}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add
                </Button>
              </div>
            );
          })
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Done</Button>
      </DialogFooter>
    </div>
  );
}
