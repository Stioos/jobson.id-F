"use client";

import * as React from "react";
import { Database, Plus, Users, Tag, Search, Trash2 } from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";
import { talentPools, candidateProfiles } from "@/lib/mock-data";
import type { TalentPool } from "@/lib/types";

export function RecruiterTalentPool() {
  const [pools, setPools] = React.useState<TalentPool[]>(talentPools);
  const [addOpen, setAddOpen] = React.useState(false);
  const [deletePool, setDeletePool] = React.useState<TalentPool | null>(null);
  const [detail, setDetail] = React.useState<TalentPool | null>(null);
  const [search, setSearch] = React.useState("");

  const totalCandidates = pools.reduce((a, p) => a + p.candidateCount, 0);

  const filteredPools = pools.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some((t) => t.includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent pools"
        description="Curated pools of pre-screened candidates. Use pools to accelerate submissions to similar roles."
        actions={[{ label: "Create pool", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Total pools" value={pools.length} icon={<Database className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total candidates" value={totalCandidates} icon={<Users className="h-5 w-5" />} tone="default" />
        <StatCard label="Avg pool size" value={Math.round(totalCandidates / Math.max(1, pools.length))} icon={<Users className="h-5 w-5" />} tone="success" />
        <StatCard label="Tags" value={Array.from(new Set(pools.flatMap((p) => p.tags))).length} icon={<Tag className="h-5 w-5" />} tone="warning" />
      </div>

      <SectionCard
        title="Your talent pools"
        description="Click a pool to view candidates and manage membership."
        action={
          <Input
            placeholder="Search pools…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-56"
          />
        }
      >
        {filteredPools.length === 0 ? (
          <EmptyState
            icon={<Database className="h-5 w-5" />}
            title="No talent pools yet"
            description="Create your first pool to organize candidates by skill, role, or specialty."
            action={<Button size="sm" onClick={() => setAddOpen(true)}><Plus className="mr-1 h-4 w-4" /> Create pool</Button>}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPools.map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => setDetail(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetail(p);
                  }
                }}
                className="cursor-pointer rounded-xl border bg-card p-4 text-left transition hover:border-brand/40 hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Database className="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setDeletePool(p); }}
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Delete pool"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{p.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Owner: {p.owner}</span>
                  <span className="font-semibold">{p.candidateCount} candidates</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Created {timeAgo(p.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <CreatePoolDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={(name, description, tags) => {
          const newPool: TalentPool = {
            id: `tp_new_${Date.now()}`,
            name,
            description,
            candidateCount: 0,
            owner: "Sneha Reddy",
            tags,
            createdAt: new Date().toISOString(),
          };
          setPools((prev) => [newPool, ...prev]);
          setAddOpen(false);
          toast.success("Pool created", { description: name });
        }}
      />

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{detail.name}</div>
                    <div className="text-xs text-muted-foreground">{detail.candidateCount} candidates</div>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">Talent pool details</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <p className="text-sm text-muted-foreground">{detail.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.tags.map((t) => (
                    <Badge key={t} variant="outline">{t}</Badge>
                  ))}
                </div>

                <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                  <div className="grid grid-cols-2 gap-y-1">
                    <span className="text-muted-foreground">Owner</span>
                    <span className="text-right font-medium">{detail.owner}</span>
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-right font-medium">{formatDate(detail.createdAt)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Sample candidates</h4>
                  <p className="mb-2 text-xs text-muted-foreground">Pre-screened profiles in this pool</p>
                  <ul className="max-h-72 space-y-2 overflow-y-auto scroll-thin">
                    {candidateProfiles.slice(0, 4).map((c) => (
                      <li key={c.id} className="flex items-center gap-3 rounded-lg border bg-card p-2">
                        <AvatarLogo text={c.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{c.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{c.currentJobTitle} · {c.location}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => toast.success("Added to shortlist", { description: c.name })}>
                          Submit
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => toast.success("Candidate add dialog opened")}>
                    <Plus className="mr-1 h-4 w-4" /> Add candidates
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Export started", { description: `${detail.name} (CSV)` })}>
                    Export CSV
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deletePool} onOpenChange={(v) => !v && setDeletePool(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete talent pool?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletePool && (<>This will permanently delete <strong>{deletePool.name}</strong> ({deletePool.candidateCount} candidates). Candidates themselves will not be deleted from the database.</>)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (deletePool) {
                  setPools((prev) => prev.filter((p) => p.id !== deletePool.id));
                  toast.success("Pool deleted", { description: deletePool.name });
                }
                setDeletePool(null);
              }}
            >
              Delete pool
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CreatePoolDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (name: string, description: string, tags: string[]) => void;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("");

  const reset = () => { setName(""); setDescription(""); setTagsInput(""); };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create talent pool</DialogTitle>
          <DialogDescription>Group candidates by skill, role, or specialty.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="p-name">Pool name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Senior React Engineers" />
          </div>
          <div>
            <Label htmlFor="p-desc">Description</Label>
            <Textarea id="p-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Pre-screened candidates with 5+ years React" />
          </div>
          <div>
            <Label htmlFor="p-tags">Tags (comma-separated)</Label>
            <Input id="p-tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="react, senior, frontend" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!name) { toast.error("Pool name required"); return; }
              const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
              onCreate(name, description || "—", tags);
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
