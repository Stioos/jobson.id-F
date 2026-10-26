"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trainers, liveSessions, trainingCourses, cohorts } from "@/lib/lms-data";
import type { Trainer } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import { formatCurrency, formatNumber } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, GraduationCap, Star, Users, Award, BarChart3, Mail } from "lucide-react";

const trainerSchema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Valid email required"),
  expertise: z.string().min(2, "Comma-separated list"),
  bio: z.string().min(10, "Add a short bio"),
  type: z.enum(["internal", "external"]),
  hourlyRate: z.coerce.number().min(0),
});
type FormValues = z.infer<typeof trainerSchema>;

export function TrainingTrainers() {
  const [rows, setRows] = React.useState<Trainer[]>(trainers);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<Trainer | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(trainerSchema) as Resolver<FormValues>,
    defaultValues: { name: "", email: "", expertise: "", bio: "", type: "internal", hourlyRate: 6000 },
  });

  const filtered = rows.filter((t) => {
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchType && matchStatus;
  });

  const activeCount = rows.filter((t) => t.status === "active").length;
  const totalSessions = rows.reduce((s, t) => s + t.sessionsConducted, 0);
  const totalLearners = rows.reduce((s, t) => s + t.learnersTrained, 0);
  const avgRating = rows.length > 0 ? (rows.reduce((s, t) => s + t.rating, 0) / rows.length).toFixed(2) : "0";

  function onSubmit(values: FormValues) {
    const colors = ["oklch(0.6 0.13 300)", "oklch(0.52 0.11 162)", "oklch(0.55 0.13 200)", "oklch(0.58 0.2 25)", "oklch(0.6 0.16 70)"];
    const newTrainer: Trainer = {
      id: `tr_new_${Date.now()}`,
      name: values.name,
      email: values.email,
      avatarColor: colors[rows.length % colors.length],
      expertise: values.expertise.split(",").map((s) => s.trim()).filter(Boolean),
      rating: 0,
      sessionsConducted: 0,
      learnersTrained: 0,
      type: values.type,
      status: "active",
      bio: values.bio,
      certifications: [],
      hourlyRate: values.hourlyRate,
      currency: "INR",
    };
    setRows((r) => [...r, newTrainer]);
    setAddOpen(false);
    form.reset();
    toast.success(`Trainer added — ${values.name}`);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Trainers"
        description="Manage your internal and external trainer network."
        icon={<Icon name="GraduationCap" className="h-6 w-6" />}
        actions={[{ label: "Add trainer", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Trainers" value={rows.length} icon={<GraduationCap className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<GraduationCap className="h-5 w-5" />} tone="success" />
        <StatCard label="Sessions Delivered" value={formatNumber(totalSessions)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Avg Rating" value={avgRating} icon={<Star className="h-5 w-5" />} tone="warning" hint={`${formatNumber(totalLearners)} learners trained`} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="external">External</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_leave">On leave</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<GraduationCap className="h-5 w-5" />} title="No trainers found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => setDetail(t)}
              className="text-left rounded-xl border bg-card p-4 hover:border-brand/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white" style={{ background: t.avatarColor }}>
                  {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-semibold leading-tight truncate">{t.name}</h3>
                    <StatusBadge status={t.status === "on_leave" ? "paused" : t.status === "inactive" ? "archived" : "active"} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                  <Badge variant="outline" className="mt-1 text-[10px] capitalize">{t.type}</Badge>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.expertise.slice(0, 3).map((e) => <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>)}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-xs">
                <div className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{t.rating.toFixed(1)}</div>
                <div className="flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" />{formatNumber(t.sessionsConducted)}</div>
                <div className="flex items-center gap-1"><GraduationCap className="h-3 w-3 text-muted-foreground" />{formatNumber(t.learnersTrained)}</div>
              </div>
              <div className="mt-2 flex items-center justify-between border-t pt-2">
                <span className="text-xs text-muted-foreground">Hourly rate</span>
                <span className="text-sm font-semibold">{t.hourlyRate ? formatCurrency(t.hourlyRate) : "—"}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full font-semibold text-white text-lg" style={{ background: detail.avatarColor }}>
                    {detail.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <SheetTitle>{detail.name}</SheetTitle>
                    <SheetDescription>{detail.email}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-lg font-semibold flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" />{detail.rating.toFixed(1)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Sessions</p>
                    <p className="text-lg font-semibold">{detail.sessionsConducted}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Learners Trained</p>
                    <p className="text-lg font-semibold">{formatNumber(detail.learnersTrained)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Hourly Rate</p>
                    <p className="text-lg font-semibold">{detail.hourlyRate ? formatCurrency(detail.hourlyRate) : "—"}</p>
                  </div>
                </div>
                <SectionCard title="Bio">
                  <p className="text-sm text-muted-foreground">{detail.bio}</p>
                </SectionCard>
                <SectionCard title="Expertise">
                  <div className="flex flex-wrap gap-1.5">
                    {detail.expertise.map((e) => <Badge key={e} variant="secondary">{e}</Badge>)}
                  </div>
                </SectionCard>
                <SectionCard title="Certifications">
                  {detail.certifications.length === 0 ? <p className="text-sm text-muted-foreground">No certifications.</p> :
                    <ul className="space-y-1">{detail.certifications.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-brand" />{c}
                      </li>
                    ))}</ul>}
                </SectionCard>
                <SectionCard title={`Sessions (${liveSessions.filter((s) => s.trainerId === detail.id).length})`}>
                  <ul className="space-y-1.5 max-h-40 overflow-y-auto scroll-thin">
                    {liveSessions.filter((s) => s.trainerId === detail.id).map((s) => (
                      <li key={s.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{s.title}</span>
                        <StatusBadge status={s.status} />
                      </li>
                    ))}
                    {liveSessions.filter((s) => s.trainerId === detail.id).length === 0 && <p className="text-sm text-muted-foreground">No sessions.</p>}
                  </ul>
                </SectionCard>
                <SheetFooter>
                  <Button variant="outline" onClick={() => toast.info("Opening trainer analytics")}><BarChart3 className="mr-1 h-4 w-4" />View performance</Button>
                  <Button onClick={() => toast.info(`Emailing: ${detail.email}`)}><Mail className="mr-1 h-4 w-4" />Contact</Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trainer</DialogTitle>
            <DialogDescription>Register a new trainer (internal or external).</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="t-name">Name *</Label>
              <Input id="t-name" {...form.register("name")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="t-email">Email *</Label>
              <Input id="t-email" type="email" {...form.register("email")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="t-exp">Expertise (comma-separated) *</Label>
              <Input id="t-exp" placeholder="React, TypeScript, Performance" {...form.register("expertise")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="t-bio">Bio *</Label>
              <Textarea id="t-bio" {...form.register("bio")} className="mt-1 min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select defaultValue={form.getValues("type")} onValueChange={(v) => form.setValue("type", v as FormValues["type"])}>
                  <SelectTrigger className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                  <SelectContent>{["internal", "external"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="t-rate">Hourly rate (₹)</Label>
                <Input id="t-rate" type="number" {...form.register("hourlyRate")} className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Add trainer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
