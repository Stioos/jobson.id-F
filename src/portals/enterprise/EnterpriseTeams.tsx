"use client";

import * as React from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNav } from "@/lib/store";
import { PageHeader, SectionCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { ChevronRight, ChevronDown, Plus, Users, Building2 } from "lucide-react";
import { toast } from "sonner";
import {
  ENTERPRISE_ENTITIES, ENTERPRISE_TEAMS, DEPARTMENTS, TENANT_NAME,
  type EnterpriseTeam, entityById, TenantDisclaimer,
} from "./_shared";
import { cn } from "@/lib/utils";

const teamSchema = z.object({
  entityId: z.string().min(1, "Select entity"),
  department: z.string().min(1, "Required"),
  name: z.string().min(2, "Team name too short").max(80),
  lead: z.string().min(2, "Required"),
  hiringManager: z.string().min(2, "Required"),
  memberCount: z.coerce.number().int().min(0).max(100000),
});

type TeamFormValues = z.infer<typeof teamSchema>;

export function EnterpriseTeams() {
  const [rows, setRows] = React.useState<EnterpriseTeam[]>(ENTERPRISE_TEAMS);
  const [entityFilter, setEntityFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(ENTERPRISE_ENTITIES.map((e) => e.id)));

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema) as Resolver<TeamFormValues>,
    defaultValues: { entityId: "e_001", department: "Engineering", name: "", lead: "", hiringManager: "", memberCount: 0 },
  });
  const entityIdWatch = useWatch({ control: form.control, name: "entityId" });
  const departmentWatch = useWatch({ control: form.control, name: "department" });

  const entities = ENTERPRISE_ENTITIES;
  const filteredEntities = entityFilter === "all" ? entities : entities.filter((e) => e.id === entityFilter);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onSubmit(values: TeamFormValues) {
    const newTeam: EnterpriseTeam = {
      id: `t_new_${Date.now()}`,
      entityId: values.entityId,
      department: values.department,
      name: values.name,
      parentTeamId: null,
      lead: values.lead,
      memberCount: values.memberCount,
      openReqs: 0,
      performance: 70,
      hiringManager: values.hiringManager,
    };
    setRows((r) => [...r, newTeam]);
    setExpanded((prev) => new Set(prev).add(values.entityId));
    setAddOpen(false);
    form.reset();
    toast.success(`Team “${newTeam.name}” created`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Teams & Business Units"
        description={`Hierarchical organization of teams across ${TENANT_NAME} entities.`}
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[{ label: "Add team", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />

      <TenantDisclaimer />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Entity:</span>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="h-9 w-[240px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities ({entities.length})</SelectItem>
            {entities.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredEntities.length === 0 ? (
        <EmptyState icon={<Building2 className="h-5 w-5" />} title="No entities" />
      ) : (
        <div className="space-y-3">
          {filteredEntities.map((entity) => {
            const teams = rows.filter((t) => t.entityId === entity.id);
            const rootTeams = teams.filter((t) => !t.parentTeamId);
            const isOpen = expanded.has(entity.id);
            return (
              <Collapsible key={entity.id} open={isOpen} onOpenChange={() => toggle(entity.id)}>
                <div className="rounded-xl border bg-card">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors">
                      {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      <AvatarLogo text={entity.logo} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{entity.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {entity.city} · {teams.length} teams · {teams.reduce((s, t) => s + t.memberCount, 0)} members · {teams.reduce((s, t) => s + t.openReqs, 0)} open reqs
                        </p>
                      </div>
                      <StatusBadge status={entity.status} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t p-4">
                      {rootTeams.length === 0 ? (
                        <EmptyState title="No teams" description="Add a team to this entity." />
                      ) : (
                        <div className="space-y-2">
                          {rootTeams.map((t) => (
                            <TeamNode key={t.id} team={t} allTeams={rows} depth={0} />
                          ))}
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add team</DialogTitle>
            <DialogDescription>Create a new team under an entity. Sub-team nesting supported post-creation.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Entity" error={form.formState.errors.entityId?.message}>
                <Select value={entityIdWatch} onValueChange={(v) => form.setValue("entityId", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ENTERPRISE_ENTITIES.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Department" error={form.formState.errors.department?.message}>
                <Select value={departmentWatch} onValueChange={(v) => form.setValue("department", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Team name" error={form.formState.errors.name?.message}>
              <Input {...form.register("name")} placeholder="Payments Engineering" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Team lead" error={form.formState.errors.lead?.message}>
                <Input {...form.register("lead")} placeholder="Anika Verma" />
              </Field>
              <Field label="Hiring manager" error={form.formState.errors.hiringManager?.message}>
                <Input {...form.register("hiringManager")} placeholder="Anika Verma" />
              </Field>
            </div>
            <Field label="Member count" error={form.formState.errors.memberCount?.message}>
              <Input type="number" {...form.register("memberCount")} placeholder="0" />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create team</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamNode({ team, allTeams, depth }: { team: EnterpriseTeam; allTeams: EnterpriseTeam[]; depth: number }) {
  const children = allTeams.filter((t) => t.parentTeamId === team.id);
  const [open, setOpen] = React.useState(depth < 1);
  const ent = entityById(team.entityId);
  return (
    <div>
      <div
        className={cn(
          "rounded-lg border bg-background p-3 hover:border-brand/30 transition-colors",
          depth > 0 && "ml-4 border-dashed"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {children.length > 0 ? (
              <button
                onClick={() => setOpen((o) => !o)}
                className="rounded p-0.5 hover:bg-muted"
                aria-label={open ? "Collapse" : "Expand"}
              >
                {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <span className="w-5" />
            )}
            <AvatarLogo text={team.lead} size="xs" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{team.name}</p>
              <p className="text-xs text-muted-foreground">
                {team.department} · Lead: {team.lead} · HM: {team.hiringManager}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">Members</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                {team.memberCount}
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-muted-foreground">Open reqs</p>
              <p className="text-sm font-medium">{team.openReqs}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Perf</p>
              <div className="flex items-center gap-2">
                <Progress value={team.performance} className="h-2 w-16" />
                <span className="text-xs font-medium">{team.performance}</span>
              </div>
            </div>
          </div>
        </div>
        {ent && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Entity: {ent.name}
          </p>
        )}
      </div>
      {open && children.length > 0 && (
        <div className="mt-2 space-y-2 border-l border-dashed border-border ml-3 pl-3">
          {children.map((c) => (
            <TeamNode key={c.id} team={c} allTeams={allTeams} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
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
