"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { engagements, serviceCatalog } from "@/lib/partner-data";
import type { Engagement } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import {
  KanbanSquare, Plus, Briefcase, AlertTriangle, Eye, ArrowRight, Clock, Award, CheckCircle2,
} from "lucide-react";

const STATUSES: Engagement["status"][] = ["lead", "proposal", "negotiation", "active", "completed", "paused", "cancelled"];
const TYPES: Engagement["type"][] = ["project", "retainer", "amc", "milestone"];

export function PartnerEngagements() {
  const partner = CURRENT_PARTNER;
  // Show all engagements (partner portal manages service/tech/AI engagements across partner ecosystem)
  const [list, setList] = React.useState<Engagement[]>(engagements);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<Engagement | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = list.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    return true;
  });

  const totalValue = list.reduce((s, e) => s + e.value, 0);
  const activeValue = list.filter((e) => e.status === "active").reduce((s, e) => s + e.value, 0);
  const avgSla = list.length > 0 ? Math.round(list.reduce((s, e) => s + e.slaCompliance, 0) / list.length) : 0;
  const slaBreaches = list.filter((e) => e.slaCompliance < 90).length;

  function open(e: Engagement) {
    setSelected(e);
    setSheetOpen(true);
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const service = serviceCatalog.find((s) => s.id === fd.get("serviceId"));
    const newE: Engagement = {
      id: `eng_${Date.now()}`,
      partnerId: partner.id,
      partnerName: partner.name,
      clientName: fd.get("clientName") as string,
      serviceId: fd.get("serviceId") as string,
      serviceName: service?.name ?? "Custom Service",
      type: fd.get("type") as Engagement["type"],
      value: Number(fd.get("value")) || 0,
      startDate: fd.get("startDate") as string,
      status: "lead",
      slaCompliance: 100,
      progress: 0,
      deliveryLead: fd.get("deliveryLead") as string || partner.contactName,
    };
    setList((prev) => [newE, ...prev]);
    setAddOpen(false);
    toast.success("Engagement created", { description: `${newE.clientName} · ${newE.serviceName}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engagements"
        description={`${partner.name} — manage service / technology / AI delivery engagements.`}
        icon={<Icon name="KanbanSquare" className="h-6 w-6" />}
        actions={[
          { label: "Create Engagement", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Engagements" value={list.length} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active Value" value={formatCurrency(activeValue)} icon={<KanbanSquare className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg SLA Compliance" value={`${avgSla}%`} icon={<Award className="h-5 w-5" />} tone={avgSla >= 95 ? "success" : "warning"} />
        <StatCard label="SLA Breaches" value={slaBreaches} icon={<AlertTriangle className="h-5 w-5" />} tone={slaBreaches > 0 ? "danger" : "default"} />
      </div>

      {/* SLA alerts */}
      {slaBreaches > 0 && (
        <Card className="border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{slaBreaches} engagement(s) below 90% SLA compliance</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {list.filter((e) => e.slaCompliance < 90).map((e) => e.clientName).join(", ")}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("SLA report opened")}>View</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Delivery Lead</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">No engagements match the filters.</TableCell></TableRow>
                ) : filtered.map((e) => (
                  <TableRow key={e.id} className="cursor-pointer hover:bg-brand/5" onClick={() => open(e)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={e.clientName} size="sm" />
                        <p className="font-medium">{e.clientName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{e.serviceName}</TableCell>
                    <TableCell><span className="text-xs uppercase">{e.type}</span></TableCell>
                    <TableCell className="text-right font-medium text-brand">{formatCurrency(e.value)}</TableCell>
                    <TableCell><StatusBadge status={e.status} /></TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${e.slaCompliance >= 95 ? "text-emerald-600 dark:text-emerald-400" : e.slaCompliance >= 90 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>{e.slaCompliance}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={e.progress} className="h-1.5 w-16" />
                        <span className="text-xs">{e.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{e.deliveryLead}</TableCell>
                    <TableCell><ArrowRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.clientName}</SheetTitle>
                <SheetDescription>{selected.serviceName} · {selected.type.toUpperCase()}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Engagement Value</p>
                    <p className="text-sm font-semibold text-brand">{formatCurrency(selected.value)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">{formatDate(selected.startDate)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">End Date</p>
                    <p className="text-sm font-medium">{selected.endDate ? formatDate(selected.endDate) : "Open-ended"}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Delivery Lead</p>
                    <p className="text-sm font-medium">{selected.deliveryLead}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">SLA Compliance</p>
                    <p className={`text-sm font-semibold ${selected.slaCompliance >= 95 ? "text-emerald-600 dark:text-emerald-400" : selected.slaCompliance >= 90 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>{selected.slaCompliance}%</p>
                  </div>
                </div>

                <SectionCard title="Progress">
                  <Progress value={selected.progress} className="h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">{selected.progress}% complete</p>
                </SectionCard>

                <SectionCard title="Milestones" description="Key delivery milestones">
                  <ol className="space-y-2 text-sm">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> <div><p className="font-medium">Kickoff & scoping</p><p className="text-xs text-muted-foreground">{formatDate(selected.startDate)}</p></div></li>
                    <li className="flex gap-2"><Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" /> <div><p className="font-medium">Delivery in progress</p><p className="text-xs text-muted-foreground">{selected.progress}% done</p></div></li>
                    {selected.progress >= 100 && <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" /> <div><p className="font-medium">Closure & handover</p></div></li>}
                  </ol>
                </SectionCard>

                <SectionCard title="SLA Tracker">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Response time</span><span className="font-medium">&lt; 4h (within SLA)</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Resolution time</span><span className="font-medium">&lt; 24h (within SLA)</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Uptime</span><span className="font-medium text-emerald-600 dark:text-emerald-400">99.8%</span></div>
                  </div>
                </SectionCard>

                <SectionCard title="Timesheets & Invoicing">
                  <p className="text-sm text-muted-foreground">Logged hours and invoice status sync automatically with the wallet.</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.success("Timesheet view opened")}>View timesheets</Button>
                </SectionCard>

                <SheetFooter>
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Edit form opened")}>Edit</Button>
                  <Button className="flex-1" onClick={() => toast.success("Status update opened")}>Update Status</Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Engagement</DialogTitle>
            <DialogDescription>Start a new service delivery engagement.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" name="clientName" required placeholder="Acme Manufacturing" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="serviceId">Service</Label>
              <Select name="serviceId" defaultValue={serviceCatalog[0]?.id}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {serviceCatalog.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select name="type" defaultValue="project">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="value">Value (₹)</Label>
                <Input id="value" name="value" type="number" min={0} defaultValue={150000} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deliveryLead">Delivery Lead</Label>
                <Input id="deliveryLead" name="deliveryLead" defaultValue={partner.contactName} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
