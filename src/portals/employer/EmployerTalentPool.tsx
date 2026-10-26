"use client";

import * as React from "react";
import { talentPools, candidateProfiles } from "@/lib/mock-data";
import { PageHeader, SectionCard, Card, CardContent, EmptyState, StatusBadge } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { Plus, Database, ArrowLeft, Users, X } from "lucide-react";
import type { TalentPool } from "@/lib/types";

export function EmployerTalentPool() {
  const [pools, setPools] = React.useState<TalentPool[]>(talentPools);
  const [selected, setSelected] = React.useState<TalentPool | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<TalentPool | null>(null);
  const [newPool, setNewPool] = React.useState({ name: "", description: "", tags: "" });

  const create = () => {
    if (!newPool.name.trim()) { toast.error("Pool name is required"); return; }
    const pool: TalentPool = {
      id: `tp_${Date.now()}`,
      name: newPool.name.trim(),
      description: newPool.description.trim() || "—",
      candidateCount: 0,
      owner: "Rohan Mehta",
      tags: newPool.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    setPools([pool, ...pools]);
    setNewPool({ name: "", description: "", tags: "" });
    setCreateOpen(false);
    toast.success(`Talent pool "${pool.name}" created`);
  };

  const removePool = () => {
    if (!deleteTarget) return;
    setPools(pools.filter((p) => p.id !== deleteTarget.id));
    if (selected?.id === deleteTarget.id) setSelected(null);
    setDeleteTarget(null);
    toast.success("Talent pool deleted");
  };

  // Mock candidates per pool (sample 5-8 from candidateProfiles)
  const poolCandidates = React.useMemo(() => {
    const seed = (selected?.id ?? "").length;
    return candidateProfiles.slice(0, 6).map((c, i) => ({
      ...c,
      matchScore: 60 + ((i + seed) % 35) + 5,
    }));
  }, [selected]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Pools"
        description="Curated groups of candidates for future and current roles"
        actions={[{ label: "Create pool", icon: "Plus", onClick: () => setCreateOpen(true) }]}
      />

      {!selected ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pools.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(p)}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Database className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">{p.candidateCount} candidates</Badge>
                </div>
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>)}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                  <span><Users className="inline h-3 w-3 mr-1" /> {p.owner}</span>
                  <span>{formatDate(p.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}><ArrowLeft className="mr-2 h-4 w-4" /> All pools</Button>
            <Button variant="outline" size="sm" className="text-rose-600" onClick={() => setDeleteTarget(selected)}>Delete pool</Button>
          </div>

          <SectionCard title={selected.name} description={selected.description}>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span><Users className="inline h-3 w-3 mr-1" /> {selected.candidateCount} candidates</span>
              <span>Owner: {selected.owner}</span>
              <span>Created: {formatDate(selected.createdAt)}</span>
              {selected.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
            </div>
          </SectionCard>

          <SectionCard title="Candidates in this pool" action={<Button size="sm" onClick={() => toast.info("Add candidates from Talent Search")}><Plus className="mr-2 h-3 w-3" /> Add candidate</Button>}>
            {poolCandidates.length === 0 ? (
              <EmptyState icon={<Users className="h-5 w-5" />} title="Pool is empty" description="Add candidates from Talent Search." />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto scroll-thin">
                {poolCandidates.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40">
                    <AvatarLogo text={c.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.headline}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{c.experienceYears}y</Badge>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.success(`Removed ${c.name} from pool`)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create talent pool</DialogTitle>
            <DialogDescription>Group candidates by skill, role, or stage.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Pool name *</Label>
              <Input placeholder="e.g. Senior Backend (Go)" value={newPool.name} onChange={(e) => setNewPool({ ...newPool, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={3} placeholder="What's this pool for?" value={newPool.description} onChange={(e) => setNewPool({ ...newPool, description: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma-separated)</Label>
              <Input placeholder="react, senior, bengaluru" value={newPool.tags} onChange={(e) => setNewPool({ ...newPool, tags: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={create}>Create pool</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete talent pool?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove "{deleteTarget?.name}" and its {deleteTarget?.candidateCount} candidate associations. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removePool} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="hidden"><StatusBadge status="active" /></div>
    </div>
  );
}
