"use client";

import * as React from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader, SectionCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Building2, Plus, Search, ShieldCheck } from "lucide-react";
import {
  ENTERPRISE_ENTITIES, ENTERPRISE_TEAMS, TENANT_NAME, type EnterpriseEntity, type EntityType,
  entityTypeBadge, countryCodeToFlag, TenantDisclaimer,
} from "./_shared";
import { jobs, employerJobsExtra } from "@/lib/mock-data";
import { formatNumber, formatDate } from "@/lib/format";

const entitySchema = z.object({
  name: z.string().min(2, "Name too short").max(80),
  type: z.enum(["parent", "subsidiary", "acquisition", "joint_venture"]),
  city: z.string().min(2, "Required"),
  countryCode: z.string().min(2, "Required").max(2),
  industry: z.string().min(2, "Required"),
  adminName: z.string().min(2, "Required"),
  adminEmail: z.string().email("Invalid email"),
  headcount: z.coerce.number().int().min(0).max(500000),
});

type EntityFormValues = z.infer<typeof entitySchema>;

export function EnterpriseEntities() {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<EnterpriseEntity | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [rows, setRows] = React.useState<EnterpriseEntity[]>(ENTERPRISE_ENTITIES);

  const form = useForm<EntityFormValues>({
    resolver: zodResolver(entitySchema) as Resolver<EntityFormValues>,
    defaultValues: {
      name: "", type: "subsidiary", city: "", countryCode: "IN",
      industry: "Information Technology", adminName: "", adminEmail: "", headcount: 0,
    },
  });
  const typeWatch = useWatch({ control: form.control, name: "type" });

  const filtered = rows.filter((e) => {
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (search && !`${e.name} ${e.city} ${e.country} ${e.admin} ${e.industry}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function onSubmit(values: EntityFormValues) {
    const newEntity: EnterpriseEntity = {
      id: `e_new_${Date.now()}`,
      name: values.name,
      slug: values.name.toLowerCase().replace(/\s+/g, "-"),
      logo: values.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
      type: values.type,
      parentId: values.type === "parent" ? null : "e_001",
      country: countryCodeToCountry(values.countryCode),
      countryCode: values.countryCode,
      city: values.city,
      industry: values.industry,
      headcount: values.headcount,
      openReqs: 0,
      admin: values.adminName,
      adminEmail: values.adminEmail,
      status: "onboarding",
      brandingColor: "#10b981",
      createdAt: new Date().toISOString(),
    };
    setRows((r) => [...r, newEntity]);
    setAddOpen(false);
    form.reset();
    toast.success(`Entity “${newEntity.name}” created`, { description: "Status: Onboarding. Backend must verify legal entity documents before activation." });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Entities & Brands"
        description={`${TENANT_NAME} tenant — manage subsidiaries, acquisitions, and joint ventures. Frontend scoping is UI-only; the backend enforces tenant isolation per request.`}
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[{ label: "Add entity", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />

      <TenantDisclaimer />

      <SectionCard title={`Entities (${filtered.length})`} description="Click a row to view entity detail, members, and open jobs.">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entities..."
              className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="subsidiary">Subsidiary</SelectItem>
              <SelectItem value="acquisition">Acquisition</SelectItem>
              <SelectItem value="joint_venture">Joint Venture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Building2 className="h-5 w-5" />} title="No entities" description="Try a different filter or add a new entity." />
        ) : (
          <div className="max-h-[34rem] overflow-y-auto scroll-thin rounded-lg border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Headcount</TableHead>
                  <TableHead className="text-right">Open reqs</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => {
                  const t = entityTypeBadge(e.type);
                  return (
                    <TableRow
                      key={e.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(e)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <AvatarLogo text={e.logo} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{e.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{e.city} · {e.industry}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${t.cls}`}>{t.label}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{countryCodeToFlag(e.countryCode)} {e.country}</span>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatNumber(e.headcount)}</TableCell>
                      <TableCell className="text-right text-sm">{e.openReqs}</TableCell>
                      <TableCell className="text-sm">{e.admin}</TableCell>
                      <TableCell><StatusBadge status={e.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Entity detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          {selected && <EntityDetail entity={selected} />}
          <SheetClose className="absolute right-4 top-4" />
        </SheetContent>
      </Sheet>

      {/* Add entity Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add entity</DialogTitle>
            <DialogDescription>Create a new entity under the {TENANT_NAME} tenant.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Entity name" error={form.formState.errors.name?.message}>
                <Input {...form.register("name")} placeholder="TechCorp LATAM" />
              </Field>
              <Field label="Type">
                <Select value={typeWatch} onValueChange={(v) => form.setValue("type", v as EntityType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="subsidiary">Subsidiary</SelectItem>
                    <SelectItem value="acquisition">Acquisition</SelectItem>
                    <SelectItem value="joint_venture">Joint Venture</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" error={form.formState.errors.city?.message}>
                <Input {...form.register("city")} placeholder="São Paulo" />
              </Field>
              <Field label="Country code (ISO-2)" error={form.formState.errors.countryCode?.message}>
                <Input {...form.register("countryCode")} placeholder="BR" maxLength={2} />
              </Field>
            </div>
            <Field label="Industry" error={form.formState.errors.industry?.message}>
              <Input {...form.register("industry")} placeholder="Information Technology" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Admin name" error={form.formState.errors.adminName?.message}>
                <Input {...form.register("adminName")} placeholder="Maria Silva" />
              </Field>
              <Field label="Admin email" error={form.formState.errors.adminEmail?.message}>
                <Input {...form.register("adminEmail")} placeholder="maria.silva@techcorp.com" />
              </Field>
            </div>
            <Field label="Headcount" error={form.formState.errors.headcount?.message}>
              <Input type="number" {...form.register("headcount")} placeholder="0" />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create entity</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EntityDetail({ entity }: { entity: EnterpriseEntity }) {
  const teams = ENTERPRISE_TEAMS.filter((t) => t.entityId === entity.id);
  const allJobs = [...jobs, ...employerJobsExtra].filter((j) => j.employerId === entity.id);
  const published = allJobs.filter((j) => j.status === "published");
  const t = entityTypeBadge(entity.type);
  return (
    <div>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <AvatarLogo text={entity.logo} size="lg" />
          <div>
            <SheetTitle className="text-lg">{entity.name}</SheetTitle>
            <SheetDescription>{entity.industry} · {countryCodeToFlag(entity.countryCode)} {entity.city}, {entity.country}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="px-4 pb-6 pt-4 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${t.cls}`}>{t.label}</span>
          <StatusBadge status={entity.status} />
          {entity.parentId && (
            <span className="text-xs text-muted-foreground">
              Parent: {ENTERPRISE_ENTITIES.find((e) => e.id === entity.parentId)?.name ?? "—"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Headcount" value={formatNumber(entity.headcount)} />
          <Stat label="Open reqs" value={entity.openReqs} />
          <Stat label="Published jobs" value={published.length} />
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <h4 className="text-sm font-semibold">Entity admin</h4>
          <div className="flex items-center gap-3">
            <AvatarLogo text={entity.admin} size="sm" />
            <div>
              <p className="text-sm font-medium">{entity.admin}</p>
              <p className="text-xs text-muted-foreground">{entity.adminEmail}</p>
            </div>
            <ShieldCheck className="ml-auto h-4 w-4 text-brand" />
          </div>
          <p className="text-xs text-muted-foreground">Added {formatDate(entity.createdAt)}</p>
        </div>

        <SectionCard title={`Teams (${teams.length})`} description="Business units in this entity">
          {teams.length === 0 ? (
            <EmptyState title="No teams" description="No teams created for this entity yet." />
          ) : (
            <ul className="space-y-2">
              {teams.map((tm) => (
                <li key={tm.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{tm.name}</p>
                      <p className="text-xs text-muted-foreground">{tm.department} · Lead: {tm.lead}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{tm.memberCount} members</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title={`Open jobs (${allJobs.length})`} description="All jobs under this entity">
          {allJobs.length === 0 ? (
            <EmptyState title="No jobs" description="No jobs posted by this entity." />
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
              {allJobs.map((j) => (
                <li key={j.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{j.title}</p>
                    <p className="text-xs text-muted-foreground">{j.department} · {j.location}</p>
                  </div>
                  <StatusBadge status={j.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
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

function countryCodeToCountry(cc: string): string {
  const map: Record<string, string> = {
    IN: "India", SG: "Singapore", DE: "Germany", US: "United States",
    GB: "United Kingdom", AE: "United Arab Emirates", AU: "Australia",
    BR: "Brazil", CA: "Canada", FR: "France", JP: "Japan", NL: "Netherlands",
  };
  return map[cc.toUpperCase()] ?? cc;
}
