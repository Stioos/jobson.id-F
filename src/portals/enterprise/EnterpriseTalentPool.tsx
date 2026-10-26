"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader, SectionCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Database, Plus, Trash2, ShieldCheck, Users, Globe2 } from "lucide-react";
import { toast } from "sonner";
import {
  ENTERPRISE_ENTITIES, TENANT_NAME, TenantDisclaimer,
} from "./_shared";
import { talentPools as SEED_POOLS } from "@/lib/mock-data";
import type { TalentPool } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface EnterpriseTalentPool extends TalentPool {
  sharedWith: string[]; // entity IDs
  policy: "open" | "conditional" | "closed";
  shareable: boolean;
}

const poolSchema = z.object({
  name: z.string().min(2, "Required").max(80),
  description: z.string().min(2, "Required").max(240),
  policy: z.enum(["open", "conditional", "closed"]),
});

type PoolFormValues = z.infer<typeof poolSchema>;

export function EnterpriseTalentPool() {
  const [pools, setPools] = React.useState<EnterpriseTalentPool[]>(
    SEED_POOLS.map((p, i) => ({
      ...p,
      owner: i === 0 ? "Anika Verma" : i === 1 ? "Wei Lin" : i === 2 ? "Meera Krishnan" : "Rajiv Kumar",
      sharedWith: i === 0 ? ["e_001", "e_apac", "e_eu"] : i === 1 ? ["e_001"] : i === 3 ? ["e_001", "e_004"] : ["e_001"],
      policy: i === 0 ? "open" : i === 1 ? "conditional" : i === 2 ? "closed" : "open",
      shareable: true,
    }))
  );
  const [addOpen, setAddOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [policyOpen, setPolicyOpen] = React.useState<string | null>(null);
  const [policyDraft, setPolicyDraft] = React.useState<{ sharedWith: string[]; policy: "open" | "conditional" | "closed" }>({ sharedWith: [], policy: "conditional" });

  const form = useForm<PoolFormValues>({
    resolver: zodResolver(poolSchema),
    defaultValues: { name: "", description: "", policy: "conditional" },
  });
  const policyWatch = useWatch({ control: form.control, name: "policy" });

  function toggleShare(poolId: string, entityId: string) {
    setPools((prev) => prev.map((p) => {
      if (p.id !== poolId) return p;
      const has = p.sharedWith.includes(entityId);
      return {
        ...p,
        sharedWith: has ? p.sharedWith.filter((e) => e !== entityId) : [...p.sharedWith, entityId],
      };
    }));
  }

  function openPolicyEditor(poolId: string) {
    const pool = pools.find((p) => p.id === poolId);
    if (!pool) return;
    setPolicyDraft({ sharedWith: pool.sharedWith, policy: pool.policy });
    setPolicyOpen(poolId);
  }

  function savePolicy() {
    if (!policyOpen) return;
    setPools((prev) => prev.map((p) => p.id === policyOpen ? { ...p, ...policyDraft } : p));
    toast.success("Sharing policy updated");
    setPolicyOpen(null);
  }

  function onSubmit(values: PoolFormValues) {
    const newPool: EnterpriseTalentPool = {
      id: `tp_new_${Date.now()}`,
      name: values.name,
      description: values.description,
      candidateCount: 0,
      owner: "Rohan Mehta",
      tags: [],
      createdAt: new Date().toISOString(),
      sharedWith: ["e_001"],
      policy: values.policy,
      shareable: true,
    };
    setPools((p) => [...p, newPool]);
    setAddOpen(false);
    form.reset();
    toast.success(`Talent pool “${newPool.name}” created`);
  }

  function removePool() {
    if (!deleteId) return;
    const pool = pools.find((p) => p.id === deleteId);
    setPools((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    toast.success(`Talent pool “${pool?.name}” deleted`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Centralized Talent Pool"
        description={`Cross-entity candidate pools for ${TENANT_NAME}. Controlled sharing — backend enforces per-entity access on every read.`}
        icon={<Icon name="Database" className="h-6 w-6" />}
        actions={[{ label: "Add pool", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />

      <TenantDisclaimer />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">Total pools</p>
          <p className="mt-1 text-2xl font-semibold">{pools.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">Candidates</p>
          <p className="mt-1 text-2xl font-semibold">{pools.reduce((s, p) => s + p.candidateCount, 0).toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">Cross-entity shares</p>
          <p className="mt-1 text-2xl font-semibold">{pools.reduce((s, p) => s + p.sharedWith.length, 0)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {pools.length === 0 && (
          <div className="lg:col-span-2">
            <EmptyState icon={<Database className="h-5 w-5" />} title="No talent pools" description="Create your first centralized talent pool." />
          </div>
        )}
        {pools.map((p) => {
          const sharedEntities = ENTERPRISE_ENTITIES.filter((e) => p.sharedWith.includes(e.id));
          return (
            <SectionCard
              key={p.id}
              title={p.name}
              description={p.description}
              action={
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openPolicyEditor(p.id)}>Edit sharing</Button>
                  <Button size="sm" variant="ghost" className="text-rose-600 dark:text-rose-400" onClick={() => setDeleteId(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              }
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-brand/20 bg-brand/10 text-brand">
                    <Users className="h-3 w-3 mr-1" />
                    {p.candidateCount} candidates
                  </Badge>
                  <PolicyBadge policy={p.policy} />
                  <span className="text-xs text-muted-foreground">Owner: {p.owner}</span>
                </div>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                    Shared with entities ({p.sharedWith.length}/{ENTERPRISE_ENTITIES.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ENTERPRISE_ENTITIES.map((e) => {
                      const checked = p.sharedWith.includes(e.id);
                      return (
                        <label
                          key={e.id}
                          className="flex items-center gap-2 rounded-md border bg-background p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleShare(p.id, e.id)}
                          />
                          <AvatarLogo text={e.logo} size="xs" />
                          <span className="truncate text-xs">{e.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {sharedEntities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    <Globe2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Active share scope:</span>
                    {sharedEntities.map((e) => (
                      <Badge key={e.id} variant="secondary" className="text-[10px]">
                        {e.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">Created {formatDate(p.createdAt)}</p>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <SectionCard title="Sharing policy editor" description="Policies that govern how pools propagate across entities.">
        <ul className="space-y-2">
          <PolicyRow
            icon={<ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
            name="Open"
            description="All entities in the tenant can read & add candidates from this pool."
          />
          <PolicyRow
            icon={<ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
            name="Conditional"
            description="Sharing is explicit per-entity, with optional sub-team scoping."
          />
          <PolicyRow
            icon={<ShieldCheck className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
            name="Closed"
            description="Pool is private to the owning entity. No cross-entity sharing."
          />
        </ul>
      </SectionCard>

      {/* Add pool dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add talent pool</DialogTitle>
            <DialogDescription>Create a centralized pool. Default sharing: owning entity only.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Field label="Pool name" error={form.formState.errors.name?.message}>
              <Input {...form.register("name")} placeholder="Senior Engineering Leadership" />
            </Field>
            <Field label="Description" error={form.formState.errors.description?.message}>
              <Textarea {...form.register("description")} rows={2} placeholder="Pre-screened senior engineering leaders across the tenant." />
            </Field>
            <Field label="Sharing policy">
              <div className="grid grid-cols-3 gap-2">
                {(["open", "conditional", "closed"] as const).map((p) => (
                  <label
                    key={p}
                    className={`flex cursor-pointer flex-col items-center rounded-md border p-2 text-xs ${policyWatch === p ? "border-brand bg-brand/5" : ""}`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      checked={policyWatch === p}
                      onChange={() => form.setValue("policy", p)}
                    />
                    <span className="font-medium capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create pool</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit policy dialog */}
      <Dialog open={!!policyOpen} onOpenChange={(o) => !o && setPolicyOpen(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit sharing policy</DialogTitle>
            <DialogDescription>Choose which entities can access this pool and the policy type.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Policy type">
              <div className="grid grid-cols-3 gap-2">
                {(["open", "conditional", "closed"] as const).map((p) => (
                  <label
                    key={p}
                    className={`flex cursor-pointer flex-col items-center rounded-md border p-2 text-xs ${policyDraft.policy === p ? "border-brand bg-brand/5" : ""}`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      checked={policyDraft.policy === p}
                      onChange={() => setPolicyDraft((d) => ({ ...d, policy: p }))}
                    />
                    <span className="font-medium capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Share with entities">
              <div className="grid grid-cols-2 gap-2">
                {ENTERPRISE_ENTITIES.map((e) => {
                  const checked = policyDraft.sharedWith.includes(e.id);
                  return (
                    <label key={e.id} className="flex items-center gap-2 rounded-md border p-2 cursor-pointer hover:bg-muted/50">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => setPolicyDraft((d) => ({
                          ...d,
                          sharedWith: checked ? d.sharedWith.filter((x) => x !== e.id) : [...d.sharedWith, e.id],
                        }))}
                      />
                      <AvatarLogo text={e.logo} size="xs" />
                      <span className="truncate text-xs">{e.name}</span>
                    </label>
                  );
                })}
              </div>
            </Field>
            <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-2 text-xs text-muted-foreground">
              <Switch id="share-subteams" defaultChecked />
              <Label htmlFor="share-subteams" className="text-xs cursor-pointer">Restrict to specific sub-teams (optional)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPolicyOpen(null)}>Cancel</Button>
            <Button onClick={savePolicy}>Save policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete talent pool?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the pool and its cross-entity shares. Candidate records remain in their source entities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white" onClick={removePool}>Delete pool</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PolicyBadge({ policy }: { policy: "open" | "conditional" | "closed" }) {
  const cls = policy === "open"
    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
    : policy === "conditional"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
      : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {policy} sharing
    </span>
  );
}

function PolicyRow({ icon, name, description }: { icon: React.ReactNode; name: string; description: string }) {
  return (
    <li className="flex items-start gap-3 rounded-lg border p-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
