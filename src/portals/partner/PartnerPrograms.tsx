"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { CURRENT_PARTNER, PartnerDisclaimer, computeSplit } from "./_shared";
import { programs, LEAD_SOURCES } from "@/lib/partner-data";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { BookOpen, Search, Eye, Plus, Clock, Award, TrendingUp, ArrowRight } from "lucide-react";

const CATEGORIES = Array.from(new Set(programs.map((p) => p.category)));

export function PartnerPrograms() {
  const { navigate } = useNav();
  const partner = CURRENT_PARTNER;
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<typeof programs[number] | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [previewLeadSource, setPreviewLeadSource] = React.useState("PARTNER_GENERATED");
  const [previewDiscount, setPreviewDiscount] = React.useState(0);

  const filtered = programs.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search && !`${p.name} ${p.code} ${p.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = programs.filter((p) => p.active).length;
  const avgPrice = programs.length > 0 ? Math.round(programs.reduce((s, p) => s + p.defaultPrice, 0) / programs.length) : 0;
  const avgPartnerPct = programs.length > 0 ? Math.round(programs.reduce((s, p) => s + p.partnerPct, 0) / programs.length) : 0;

  function openProgram(p: typeof programs[number]) {
    setSelected(p);
    setPreviewDiscount(0);
    setPreviewLeadSource("PARTNER_GENERATED");
    setDialogOpen(true);
  }

  // Preview revenue split for the selected program (using program's own pct + lead source default)
  const previewResult = selected ? computeSplit({
    gross: selected.defaultPrice,
    discount: previewDiscount,
    gatewayFeePct: 2,
    taxPct: 18,
    partnerPct: selected.partnerPct,
    jobsonIdPct: selected.jobsonIdPct,
    ruleName: `${selected.name} preview`,
  }) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs Catalog"
        description={`${partner.name} — browse jobson.id programs you can deliver. Partner share & revenue preview included.`}
        icon={<Icon name="BookOpen" className="h-6 w-6" />}
        actions={[
          { label: "Revenue Calculator", icon: "Calculator", variant: "outline", onClick: () => navigate("partner", "calculator") },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Programs" value={programs.length} icon={<BookOpen className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<Award className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Price" value={formatCurrency(avgPrice)} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Avg Partner %" value={`${avgPartnerPct}%`} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, code, category…" className="pl-8" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-5 w-5" />} title="No programs found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className={!p.active ? "opacity-70" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <CardDescription className="mt-1 font-mono text-xs">{p.code} · {p.category}</CardDescription>
                  </div>
                  <StatusBadge status={p.active ? "active" : "expired"} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border p-2">
                    <p className="text-xs font-semibold">{p.durationWeeks}w</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Duration</p>
                  </div>
                  <div className="rounded-lg border p-2">
                    <p className="text-xs font-semibold text-brand">{formatCurrency(p.defaultPrice)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Price</p>
                  </div>
                  <div className="rounded-lg border p-2">
                    <p className="text-xs font-semibold text-brand">{p.partnerPct}%</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Partner</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.targetRoles.slice(0, 3).map((r) => (
                    <span key={r} className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium">{r}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openProgram(p)}>
                    <Eye className="h-4 w-4 mr-1.5" /> View Details
                  </Button>
                  <Button size="sm" onClick={() => toast.success("Enrollment form opened", { description: p.name })}>
                    <Plus className="h-4 w-4 mr-1.5" /> Enroll
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail dialog with revenue preview */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              <span className="font-mono text-xs">{selected?.code}</span> · {selected?.category} · {selected?.durationWeeks} weeks
            </DialogDescription>
          </DialogHeader>
          {selected && previewResult && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto scroll-thin">
              <p className="text-sm text-muted-foreground">{selected.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded-lg border p-2 text-center">
                  <p className="text-xs font-semibold text-brand">{formatCurrency(selected.defaultPrice)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Price</p>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <p className="text-xs font-semibold">{selected.durationWeeks}w</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Duration</p>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <p className="text-xs font-semibold text-brand">{selected.partnerPct}%</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Partner</p>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <p className="text-xs font-semibold">{selected.jobsonIdPct}%</p>
                  <p className="text-[10px] text-muted-foreground uppercase">jobson.id</p>
                </div>
              </div>

              <SectionCard title="Delivery Modes" contentClassName="flex flex-wrap gap-2">
                {selected.deliveryModes.map((m) => (
                  <span key={m} className="rounded-md border px-2 py-0.5 text-xs font-medium capitalize">{m}</span>
                ))}
              </SectionCard>

              <SectionCard title="Certifications" contentClassName="flex flex-wrap gap-2">
                {selected.certifications.map((c) => (
                  <span key={c} className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">{c}</span>
                ))}
              </SectionCard>

              <SectionCard title="Target Roles" contentClassName="flex flex-wrap gap-2">
                {selected.targetRoles.map((r) => (
                  <span key={r} className="rounded-md border px-2 py-0.5 text-xs font-medium">{r}</span>
                ))}
              </SectionCard>

              {/* Revenue preview */}
              <Card className="border-brand/30 bg-brand/5">
                <CardHeader>
                  <CardTitle className="text-base">Revenue Split Preview</CardTitle>
                  <CardDescription>Adjust discount & lead source to see partner share.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Lead Source</Label>
                      <Select value={previewLeadSource} onValueChange={setPreviewLeadSource}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {LEAD_SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Discount (₹)</Label>
                      <Input type="number" min={0} max={selected.defaultPrice} value={previewDiscount} onChange={(e) => setPreviewDiscount(Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-brand/30 bg-brand/5 p-3">
                    <p className="text-xs text-muted-foreground uppercase">Partner Share</p>
                    <p className="text-2xl font-bold text-brand">{formatCurrency(previewResult.partnerShare)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">jobson.id share: {formatCurrency(previewResult.jobsonIdShare)} · Net after fees: {formatCurrency(previewResult.netAfterFees)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate("partner", "calculator")}>
              <ArrowRight className="h-4 w-4 mr-2" /> Full Calculator
            </Button>
            <Button onClick={() => { setDialogOpen(false); toast.success("Enrollment form opened", { description: selected?.name }); }}>
              <Plus className="h-4 w-4 mr-2" /> Enroll Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
