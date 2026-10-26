"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { leads, LEAD_SOURCES } from "@/lib/partner-data";
import type { Lead } from "@/lib/partner-types";
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
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Users, Plus, Search, Phone, Mail, MapPin, Filter, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const STATUSES: Lead["status"][] = ["new", "contacted", "qualified", "enrolled", "lost", "nurture"];

export function PartnerLeads() {
  const { navigate } = useNav();
  const partner = CURRENT_PARTNER;
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [sourceFilter, setSourceFilter] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [view, setView] = React.useState<"table" | "pipeline">("table");
  const [leadList, setLeadList] = React.useState<Lead[]>(
    leads.filter((l) => l.partnerId === partner.id || !l.partnerId)
  );

  const filtered = leadList.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (sourceFilter !== "all" && l.leadSource !== sourceFilter) return false;
    if (search && !`${l.name} ${l.email} ${l.programInterest} ${l.city}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pipelineByStatus = (st: Lead["status"]) => filtered.filter((l) => l.status === st);

  const totalPipelineValue = filtered.reduce((s, l) => s + (l.status !== "lost" && l.status !== "enrolled" ? l.estimatedValue : 0), 0);
  const enrolledValue = filtered.filter((l) => l.status === "enrolled").reduce((s, l) => s + l.estimatedValue, 0);
  const convRate = filtered.length > 0 ? Math.round((filtered.filter((l) => l.status === "enrolled").length / filtered.length) * 100) : 0;

  function openLead(l: Lead) {
    setSelectedLead(l);
    setSheetOpen(true);
  }

  function moveLead(id: string, to: Lead["status"]) {
    setLeadList((prev) => prev.map((l) => (l.id === id ? { ...l, status: to } : l)));
    toast.success(`Lead moved to ${to}`, { description: `${id} → ${to}` });
  }

  function handleAddLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      partnerId: partner.id,
      partnerName: partner.name,
      leadSource: (fd.get("leadSource") as string) as Lead["leadSource"],
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      programInterest: fd.get("programInterest") as string,
      city: fd.get("city") as string,
      status: "new",
      estimatedValue: Number(fd.get("estimatedValue")) || 0,
      createdAt: new Date().toISOString(),
      assignedTo: fd.get("assignedTo") as string || "Unassigned",
      notes: fd.get("notes") as string,
    };
    setLeadList((prev) => [newLead, ...prev]);
    setAddOpen(false);
    toast.success("Lead added", { description: `${newLead.name} · ${newLead.programInterest}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads & CRM"
        description={`${partner.name} — manage leads, pipeline, and counsellor assignments.`}
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[
          { label: "Pipeline View", icon: "KanbanSquare", variant: "outline", onClick: () => setView(view === "table" ? "pipeline" : "table") },
          { label: "Add Lead", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Leads" value={filtered.length} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pipeline Value" value={formatCurrency(totalPipelineValue)} icon={<ArrowRight className="h-5 w-5" />} />
        <StatCard label="Enrolled Value" value={formatCurrency(enrolledValue)} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Conversion Rate" value={`${convRate}%`} icon={<Filter className="h-5 w-5" />} tone="warning" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, program, city, email…" className="pl-8" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Lead Source</Label>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {LEAD_SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {view === "table" ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Program Interest</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Est. Value</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">No leads match the filters.</TableCell></TableRow>
                  ) : filtered.map((l) => (
                    <TableRow key={l.id} className="cursor-pointer hover:bg-brand/5" onClick={() => openLead(l)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={l.name} size="sm" />
                          <div>
                            <p className="font-medium">{l.name}</p>
                            <p className="text-xs text-muted-foreground">{l.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{l.programInterest}</TableCell>
                      <TableCell><StatusBadge status={l.leadSource.replace(/_/g, " ").toLowerCase()} /></TableCell>
                      <TableCell className="text-sm">{l.city}</TableCell>
                      <TableCell><StatusBadge status={l.status} /></TableCell>
                      <TableCell className="text-right font-medium text-brand">{formatCurrency(l.estimatedValue)}</TableCell>
                      <TableCell className="text-sm">{l.assignedTo ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{timeAgo(l.createdAt)}</TableCell>
                      <TableCell><ArrowRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5 xl:grid-cols-6">
          {STATUSES.filter((s) => s !== "lost" && s !== "nurture").map((st) => {
            const items = pipelineByStatus(st);
            return (
              <Card key={st} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm capitalize">{st}</CardTitle>
                    <span className="text-xs text-muted-foreground">{items.length}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-2 max-h-[480px] overflow-y-auto scroll-thin">
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">No leads</p>
                  ) : items.map((l) => (
                    <div key={l.id} className="rounded-lg border p-2.5 hover:border-brand/40 hover:bg-brand/5 cursor-pointer" onClick={() => openLead(l)}>
                      <p className="text-sm font-medium truncate">{l.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{l.programInterest}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-xs font-medium text-brand">{formatCurrency(l.estimatedValue)}</span>
                        <span className="text-xs text-muted-foreground">{l.city}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Lost / Nurture</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-2 max-h-[480px] overflow-y-auto scroll-thin">
              {pipelineByStatus("lost").concat(pipelineByStatus("nurture")).length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">None</p>
              ) : pipelineByStatus("lost").concat(pipelineByStatus("nurture")).map((l) => (
                <div key={l.id} className="rounded-lg border p-2.5 opacity-70 hover:opacity-100 cursor-pointer" onClick={() => openLead(l)}>
                  <p className="text-sm font-medium truncate">{l.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{l.programInterest}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <StatusBadge status={l.status} />
                    <span className="text-xs text-muted-foreground">{formatCurrency(l.estimatedValue)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lead detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedLead.name}</SheetTitle>
                <SheetDescription>
                  {selectedLead.programInterest} · Created {timeAgo(selectedLead.createdAt)}
                </SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={selectedLead.status} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Source</p>
                    <StatusBadge status={selectedLead.leadSource.replace(/_/g, " ").toLowerCase()} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Est. Value</p>
                    <p className="text-sm font-semibold text-brand">{formatCurrency(selectedLead.estimatedValue)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Assigned To</p>
                    <p className="text-sm font-medium">{selectedLead.assignedTo ?? "Unassigned"}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Contact</p>
                  <p className="text-sm flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {selectedLead.email}</p>
                  <p className="text-sm flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {selectedLead.phone}</p>
                  <p className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {selectedLead.city}</p>
                </div>

                <SectionCard title="Timeline" description="Lead journey">
                  <ol className="space-y-3">
                    <li className="flex gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Lead created</p>
                        <p className="text-xs text-muted-foreground">{formatDate(selectedLead.createdAt)}</p>
                      </div>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Counsellor outreach</p>
                        <p className="text-xs text-muted-foreground">{selectedLead.assignedTo ?? "Pending"}</p>
                      </div>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium capitalize">Current stage: {selectedLead.status}</p>
                        <p className="text-xs text-muted-foreground">Next: convert to enrollment</p>
                      </div>
                    </li>
                  </ol>
                </SectionCard>

                {selectedLead.notes && (
                  <SectionCard title="Notes">
                    <p className="text-sm">{selectedLead.notes}</p>
                  </SectionCard>
                )}

                <SectionCard title="Move to stage" description="Update pipeline status">
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={selectedLead.status === s ? "default" : "outline"}
                        onClick={() => {
                          moveLead(selectedLead.id, s);
                          setSelectedLead({ ...selectedLead, status: s });
                        }}
                        className="capitalize"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </SectionCard>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => { moveLead(selectedLead.id, "enrolled"); setSelectedLead({ ...selectedLead, status: "enrolled" }); toast.success("Converted to enrollment", { description: `${selectedLead.name} enrolled` }); }}>
                    Convert to Enrollment
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("Email composer opened")}>Email</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add lead dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogTrigger asChild>
          <span className="hidden" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>Capture a new lead into your CRM pipeline.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLead} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Full name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required placeholder="+91 …" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="lead@email.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required placeholder="Chennai" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="estimatedValue">Estimated Value (₹)</Label>
                <Input id="estimatedValue" name="estimatedValue" type="number" min={0} defaultValue={0} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="programInterest">Program Interest</Label>
              <Select name="leadSource" defaultValue="PARTNER_GENERATED">
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input id="programInterest" name="programInterest" required placeholder="Full-Stack Engineering Program" className="mt-2" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input id="assignedTo" name="assignedTo" placeholder="Counsellor A" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} placeholder="Optional notes…" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Save Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
