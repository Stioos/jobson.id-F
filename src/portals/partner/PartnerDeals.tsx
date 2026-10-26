"use client";

import * as React from "react";
import { deals, MODEL_LABELS } from "@/lib/partner-data";
import type { Deal } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Briefcase, Plus, Search, KanbanSquare, Table2, TrendingUp, Trophy, Target, IndianRupee, Mail, User } from "lucide-react";

const STAGES = ["lead", "qualified", "proposal", "negotiation", "won", "lost"] as const;
const STAGE_LABEL: Record<string, string> = {
  lead: "Lead", qualified: "Qualified", proposal: "Proposal", negotiation: "Negotiation", won: "Won", lost: "Lost",
};

export function PartnerDeals() {
  const partner = CURRENT_PARTNER;
  const [view, setView] = React.useState<"table" | "kanban">("kanban");
  const [stageFilter, setStageFilter] = React.useState("all");
  const [modelFilter, setModelFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Deal | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = deals.filter((d) => {
    if (stageFilter !== "all" && d.stage !== stageFilter) return false;
    if (modelFilter !== "all" && d.model !== modelFilter) return false;
    if (search && !`${d.dealName} ${d.clientName} ${d.contactName} ${d.partnerName}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // KPIs
  const pipelineValue = filtered.filter((d) => d.stage !== "won" && d.stage !== "lost").reduce((s, d) => s + d.value, 0);
  const wonThisQuarter = filtered.filter((d) => d.stage === "won").reduce((s, d) => s + d.value, 0);
  const wonCount = filtered.filter((d) => d.stage === "won").length;
  const lostCount = filtered.filter((d) => d.stage === "lost").length;
  const winRate = wonCount + lostCount > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : 0;
  const avgDealSize = wonCount > 0 ? Math.round(wonThisQuarter / wonCount) : 0;

  function openDeal(d: Deal) {
    setSelected(d);
    setSheetOpen(true);
  }

  function onCreate(form: { dealName: string; clientName: string; value: string; stage: string; contactName: string; contactEmail: string; description: string }) {
    toast.success("Deal created", { description: `${form.dealName} for ${form.clientName} added to pipeline.` });
    setCreateOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals Pipeline"
        description={`${partner.name} — track and manage deals across Lead → Qualified → Proposal → Negotiation → Won/Lost.`}
        icon={<Icon name="Briefcase" className="h-6 w-6" />}
        actions={[
          { label: "Create Deal", icon: "Plus", onClick: () => setCreateOpen(true) },
        ]}
      />
      <PartnerDisclaimer />

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pipeline Value" value={formatCurrency(pipelineValue)} icon={<Target className="h-5 w-5" />} tone="brand" hint={`${filtered.filter((d) => d.stage !== "won" && d.stage !== "lost").length} active deals`} />
        <StatCard label="Won This Quarter" value={formatCurrency(wonThisQuarter)} icon={<Trophy className="h-5 w-5" />} tone="success" hint={`${wonCount} deals won`} />
        <StatCard label="Win Rate" value={`${winRate}%`} icon={<TrendingUp className="h-5 w-5" />} delta={{ value: `${wonCount}W / ${lostCount}L`, positive: winRate >= 50 }} />
        <StatCard label="Avg Deal Size" value={formatCurrency(avgDealSize)} icon={<IndianRupee className="h-5 w-5" />} />
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search deals, clients, contacts..."
                className="h-9 w-full pl-8 sm:w-64"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {STAGES.map((s) => <SelectItem key={s} value={s}>{STAGE_LABEL[s]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Model" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {Object.entries(MODEL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as "table" | "kanban")}>
            <TabsList className="h-9">
              <TabsTrigger value="kanban" className="text-xs"><KanbanSquare className="mr-1 h-3.5 w-3.5" />Kanban</TabsTrigger>
              <TabsTrigger value="table" className="text-xs"><Table2 className="mr-1 h-3.5 w-3.5" />Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {view === "kanban" ? (
        <div className="grid gap-4 lg:grid-cols-6 overflow-x-auto">
          {STAGES.map((stage) => {
            const stageDeals = filtered.filter((d) => d.stage === stage);
            const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={stage} className="flex flex-col gap-3 min-w-[220px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={stage} />
                    <span className="text-xs text-muted-foreground">{stageDeals.length}</span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{formatCurrency(stageValue)}</span>
                </div>
                <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto scroll-thin pr-1">
                  {stageDeals.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-center text-[11px] text-muted-foreground">No deals</div>
                  ) : stageDeals.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => openDeal(d)}
                      className="rounded-lg border bg-card p-3 text-left transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                    >
                      <p className="text-xs font-semibold leading-tight line-clamp-2">{d.dealName}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground truncate">{d.clientName}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-brand">{formatCurrency(d.value)}</span>
                        <span className="text-[10px] text-muted-foreground">{d.probability}%</span>
                      </div>
                      <Progress value={d.probability} className="mt-1.5 h-1" />
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <User className="h-3 w-3" /> {d.assignedTo}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Expected Close</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No deals match your filters.</TableCell></TableRow>
                ) : filtered.map((d) => (
                  <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDeal(d)}>
                    <TableCell className="font-medium">{d.dealName}</TableCell>
                    <TableCell>{d.clientName}</TableCell>
                    <TableCell className="font-semibold text-brand">{formatCurrency(d.value)}</TableCell>
                    <TableCell><StatusBadge status={d.stage} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={d.probability} className="h-1.5 w-12" />
                        <span className="text-xs text-muted-foreground">{d.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{formatDate(d.expectedCloseDate)}</TableCell>
                    <TableCell className="text-xs">{d.contactName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{d.assignedTo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Deal detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-brand" /> {selected.dealName}
                </SheetTitle>
                <SheetDescription>Created {timeAgo(selected.createdAt)} · {selected.partnerName}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Deal Value</p>
                    <p className="mt-1 text-lg font-semibold text-brand">{formatCurrency(selected.value)}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Stage</p>
                    <div className="mt-1"><StatusBadge status={selected.stage} /></div>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Probability</p>
                    <p className="mt-1 text-sm font-medium">{selected.probability}%</p>
                    <Progress value={selected.probability} className="mt-1 h-1.5" />
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Model</p>
                    <p className="mt-1 text-sm font-medium">{MODEL_LABELS[selected.model]}</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Client</p>
                  <p className="text-sm">{selected.clientName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><User className="h-3 w-3" /> {selected.contactName}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {selected.contactEmail}</div>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Description</p>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-muted-foreground">Expected Close</p><p className="font-medium">{formatDate(selected.expectedCloseDate)}</p></div>
                  <div><p className="text-muted-foreground">Assigned To</p><p className="font-medium">{selected.assignedTo}</p></div>
                </div>
              </div>
              <SheetFooter className="flex-row gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.info("Email drafted", { description: `Opening mail client to ${selected.contactEmail}` })}>Email Client</Button>
                <Button size="sm" onClick={() => { toast.success("Deal advanced", { description: `${selected.dealName} moved to next stage.` }); setSheetOpen(false); }}>Advance Stage</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CreateDealDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={onCreate} />
    </div>
  );
}

function CreateDealDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (form: { dealName: string; clientName: string; value: string; stage: string; contactName: string; contactEmail: string; description: string }) => void }) {
  const [form, setForm] = React.useState({ dealName: "", clientName: "", value: "", stage: "lead", contactName: "", contactEmail: "", description: "" });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.dealName || !form.clientName || !form.value) {
      toast.error("Please fill required fields");
      return;
    }
    onCreate(form);
    setForm({ dealName: "", clientName: "", value: "", stage: "lead", contactName: "", contactEmail: "", description: "" });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
          <DialogDescription>Add a new deal to your pipeline.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Deal Name *</Label>
            <Input value={form.dealName} onChange={(e) => setForm({ ...form, dealName: e.target.value })} placeholder="e.g. Cloud Migration — Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Client Name *</Label>
              <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Value (₹) *</Label>
              <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="100000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => <SelectItem key={s} value={s}>{STAGE_LABEL[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Contact Name</Label>
              <Input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Contact Email</Label>
            <Input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create Deal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
