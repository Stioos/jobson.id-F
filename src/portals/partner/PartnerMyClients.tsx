"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Handshake, Search, Plus, Mail, Phone, Building2, IndianRupee, AlertCircle, TrendingUp } from "lucide-react";

interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  engagementType: string;
  totalRevenue: number;
  outstanding: number;
  status: "active" | "inactive" | "prospect";
  since: string;
  engagements: { name: string; status: string; value: number }[];
  invoices: { id: string; amount: number; status: string; date: string }[];
  communications: { date: string; channel: string; subject: string; outcome: string }[];
}

const CLIENTS: Client[] = [
  {
    id: "cli_001", name: "Wipro Technologies", industry: "IT Services", contactName: "Suresh HR", contactEmail: "suresh@wipro.com", contactPhone: "+91 99000 11111", engagementType: "Training", totalRevenue: 9000000, outstanding: 1800000, status: "active", since: new Date(Date.now() - 420 * 86400000).toISOString(),
    engagements: [{ name: "Full-Stack Training — 200 students", status: "in_progress", value: 9000000 }],
    invoices: [{ id: "INV-2024-0142", amount: 1800000, status: "pending", date: new Date(Date.now() - 15 * 86400000).toISOString() }, { id: "INV-2024-0135", amount: 7200000, status: "paid", date: new Date(Date.now() - 45 * 86400000).toISOString() }],
    communications: [{ date: new Date(Date.now() - 3 * 86400000).toISOString(), channel: "Email", subject: "Q4 batch schedule confirmation", outcome: "Confirmed" }, { date: new Date(Date.now() - 20 * 86400000).toISOString(), channel: "Call", subject: "Curriculum review", outcome: "Approved" }],
  },
  {
    id: "cli_002", name: "Acme Manufacturing", industry: "Manufacturing", contactName: "Anil Sharma", contactEmail: "anil@acme.com", contactPhone: "+91 99000 22222", engagementType: "Project", totalRevenue: 1500000, outstanding: 0, status: "active", since: new Date(Date.now() - 90 * 86400000).toISOString(),
    engagements: [{ name: "Cloud Migration Assessment", status: "completed", value: 1500000 }],
    invoices: [{ id: "INV-2024-0138", amount: 1500000, status: "paid", date: new Date(Date.now() - 10 * 86400000).toISOString() }],
    communications: [{ date: new Date(Date.now() - 7 * 86400000).toISOString(), channel: "Email", subject: "Project completion", outcome: "Signed off" }],
  },
  {
    id: "cli_003", name: "Stellar Retail", industry: "Retail", contactName: "Priya Shah", contactEmail: "priya@stellarretail.in", contactPhone: "+91 99000 33333", engagementType: "Project", totalRevenue: 3200000, outstanding: 640000, status: "active", since: new Date(Date.now() - 180 * 86400000).toISOString(),
    engagements: [{ name: "ERP Integration Phase 1", status: "completed", value: 3200000 }, { name: "ERP Integration Phase 2", status: "proposed", value: 4500000 }],
    invoices: [{ id: "INV-2024-0132", amount: 640000, status: "pending", date: new Date(Date.now() - 5 * 86400000).toISOString() }],
    communications: [{ date: new Date(Date.now() - 1 * 86400000).toISOString(), channel: "Meeting", subject: "Phase 2 scope", outcome: "Pending" }],
  },
  {
    id: "cli_004", name: "FinServe Group", industry: "Financial Services", contactName: "Rahul Mehta", contactEmail: "rahul@finserve.com", contactPhone: "+91 99000 44444", engagementType: "POC", totalRevenue: 800000, outstanding: 0, status: "active", since: new Date(Date.now() - 30 * 86400000).toISOString(),
    engagements: [{ name: "Document AI POC", status: "in_progress", value: 800000 }],
    invoices: [{ id: "INV-2024-0140", amount: 400000, status: "paid", date: new Date(Date.now() - 15 * 86400000).toISOString() }, { id: "INV-2024-0144", amount: 400000, status: "pending", date: new Date(Date.now() - 2 * 86400000).toISOString() }],
    communications: [{ date: new Date(Date.now() - 1 * 86400000).toISOString(), channel: "Email", subject: "POC demo feedback", outcome: "Positive" }],
  },
  {
    id: "cli_005", name: "Northwind Logistics", industry: "Logistics", contactName: "Vikram Singh", contactEmail: "vikram@northwind.in", contactPhone: "+91 99000 55555", engagementType: "AMC", totalRevenue: 4800000, outstanding: 960000, status: "active", since: new Date(Date.now() - 365 * 86400000).toISOString(),
    engagements: [{ name: "DevOps Retainer — Annual AMC", status: "active", value: 4800000 }],
    invoices: [{ id: "INV-2024-0128", amount: 960000, status: "overdue", date: new Date(Date.now() - 35 * 86400000).toISOString() }],
    communications: [{ date: new Date(Date.now() - 5 * 86400000).toISOString(), channel: "Call", subject: "Overdue payment reminder", outcome: "Promised" }],
  },
  {
    id: "cli_006", name: "Kanchana Institute", industry: "Education", contactName: "Dr. Suresh K", contactEmail: "suresh@kanchana.edu.in", contactPhone: "+91 99000 66666", engagementType: "Drive", totalRevenue: 600000, outstanding: 600000, status: "active", since: new Date(Date.now() - 60 * 86400000).toISOString(),
    engagements: [{ name: "Campus Placement Drive — 200 students", status: "in_progress", value: 600000 }],
    invoices: [{ id: "INV-2024-0141", amount: 600000, status: "pending", date: new Date(Date.now() - 8 * 86400000).toISOString() }],
    communications: [{ date: new Date(Date.now() - 2 * 86400000).toISOString(), channel: "Meeting", subject: "Drive logistics", outcome: "Confirmed" }],
  },
  {
    id: "cli_007", name: "Veltech University", industry: "Education", contactName: "Dr. Lakshmi", contactEmail: "lakshmi@veltech.edu", contactPhone: "+91 99000 77777", engagementType: "Training", totalRevenue: 4500000, outstanding: 900000, status: "active", since: new Date(Date.now() - 150 * 86400000).toISOString(),
    engagements: [{ name: "Data Science Program — 120 students", status: "in_progress", value: 4500000 }],
    invoices: [{ id: "INV-2024-0139", amount: 900000, status: "pending", date: new Date(Date.now() - 7 * 86400000).toISOString() }],
    communications: [{ date: new Date(Date.now() - 1 * 86400000).toISOString(), channel: "Email", subject: "Faculty allocation", outcome: "Approved" }],
  },
  {
    id: "cli_008", name: "HealthPlus", industry: "Healthcare", contactName: "Meera Joshi", contactEmail: "meera@healthplus.in", contactPhone: "+91 99000 88888", engagementType: "Project", totalRevenue: 0, outstanding: 0, status: "prospect", since: new Date(Date.now() - 7 * 86400000).toISOString(),
    engagements: [{ name: "Security Audit + AI Threat Detection", status: "proposed", value: 320000 }],
    invoices: [],
    communications: [{ date: new Date(Date.now() - 2 * 86400000).toISOString(), channel: "Email", subject: "Initial proposal sent", outcome: "Awaiting response" }],
  },
  {
    id: "cli_009", name: "TechCorp India", industry: "IT Services", contactName: "Anand Kumar", contactEmail: "anand@techcorp.in", contactPhone: "+91 99000 99999", engagementType: "Hiring", totalRevenue: 1200000, outstanding: 0, status: "active", since: new Date(Date.now() - 200 * 86400000).toISOString(),
    engagements: [{ name: "Recruitment drive — 10 positions", status: "completed", value: 1200000 }],
    invoices: [{ id: "INV-2024-0130", amount: 1200000, status: "paid", date: new Date(Date.now() - 30 * 86400000).toISOString() }],
    communications: [{ date: new Date(Date.now() - 15 * 86400000).toISOString(), channel: "Call", subject: "Renew engagement", outcome: "Discussing" }],
  },
  {
    id: "cli_010", name: "DataMinds AI", industry: "AI / ML", contactName: "Rohan Mehta", contactEmail: "rohan@dataminds.ai", contactPhone: "+91 99000 10101", engagementType: "Internship", totalRevenue: 0, outstanding: 0, status: "active", since: new Date(Date.now() - 90 * 86400000).toISOString(),
    engagements: [{ name: "ML Internship — 2 interns", status: "active", value: 0 }],
    invoices: [],
    communications: [{ date: new Date(Date.now() - 4 * 86400000).toISOString(), channel: "Email", subject: "Intern feedback", outcome: "Positive" }],
  },
];

export function PartnerMyClients() {
  const partner = CURRENT_PARTNER;
  const [clients, setClients] = React.useState<Client[]>(CLIENTS);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Client | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = clients.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !`${c.name} ${c.industry} ${c.contactName}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = clients.filter((c) => c.status === "active").length;
  const prospectCount = clients.filter((c) => c.status === "prospect").length;
  const totalRevenue = clients.reduce((s, c) => s + c.totalRevenue, 0);
  const totalOutstanding = clients.reduce((s, c) => s + c.outstanding, 0);

  function openClient(c: Client) { setSelected(c); setSheetOpen(true); }
  function onAdd(form: { name: string; industry: string; contactName: string; contactEmail: string; engagementType: string }) {
    const newClient: Client = {
      id: `cli_${Date.now()}`, name: form.name, industry: form.industry, contactName: form.contactName, contactEmail: form.contactEmail, contactPhone: "", engagementType: form.engagementType, totalRevenue: 0, outstanding: 0, status: "prospect", since: new Date().toISOString(),
      engagements: [], invoices: [], communications: [],
    };
    setClients((prev) => [...prev, newClient]);
    toast.success("Client added", { description: `${form.name} added to client database.` });
    setAddOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Clients"
        description={`${partner.name} — manage your client database, engagements, invoices, and communication history.`}
        icon={<Icon name="Handshake" className="h-6 w-6" />}
        actions={[{ label: "Add Client", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Clients" value={clients.length} icon={<Handshake className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
        <StatCard label="Prospects" value={prospectCount} icon={<Building2 className="h-5 w-5" />} tone="warning" />
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={<IndianRupee className="h-5 w-5" />} hint={`${formatCurrency(totalOutstanding)} outstanding`} />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..." className="h-9 w-full pl-8 sm:w-64" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="max-h-[480px] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No clients match your filters.</TableCell></TableRow>
              ) : filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openClient(c)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={c.name} size="sm" />
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">Since {formatDate(c.since, { year: "numeric", month: "short" })}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{c.industry}</TableCell>
                  <TableCell className="text-xs">{c.contactName}<br /><span className="text-muted-foreground">{c.contactEmail}</span></TableCell>
                  <TableCell><Badge variant="outline">{c.engagementType}</Badge></TableCell>
                  <TableCell className="text-right font-semibold text-brand">{c.totalRevenue > 0 ? formatCurrency(c.totalRevenue) : "—"}</TableCell>
                  <TableCell className="text-right text-sm">
                    {c.outstanding > 0 ? <span className={c.outstanding > 500000 ? "text-rose-600 font-medium" : "text-amber-600"}>{formatCurrency(c.outstanding)}</span> : "—"}
                  </TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Client detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <AvatarLogo text={selected.name} size="sm" /> {selected.name}
                </SheetTitle>
                <SheetDescription>{selected.industry} · Client since {formatDate(selected.since)}</SheetDescription>
              </SheetHeader>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Revenue</p>
                    <p className="mt-1 text-lg font-semibold text-brand">{formatCurrency(selected.totalRevenue)}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Outstanding</p>
                    <p className="mt-1 text-lg font-semibold text-amber-600">{formatCurrency(selected.outstanding)}</p>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Contact</p>
                  <p className="text-sm">{selected.contactName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {selected.contactEmail}</div>
                  {selected.contactPhone && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {selected.contactPhone}</div>}
                </div>

                <Tabs defaultValue="engagements">
                  <TabsList className="w-full">
                    <TabsTrigger value="engagements" className="flex-1 text-xs">Engagements</TabsTrigger>
                    <TabsTrigger value="invoices" className="flex-1 text-xs">Invoices</TabsTrigger>
                    <TabsTrigger value="comms" className="flex-1 text-xs">Communication</TabsTrigger>
                  </TabsList>
                  <TabsContent value="engagements" className="space-y-2 mt-2">
                    {selected.engagements.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">No engagements yet.</p> : selected.engagements.map((e, i) => (
                      <div key={i} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{e.name}</p>
                          <StatusBadge status={e.status} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Value: {formatCurrency(e.value)}</p>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="invoices" className="space-y-2 mt-2">
                    {selected.invoices.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">No invoices yet.</p> : selected.invoices.map((inv, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="text-xs font-mono">{inv.id}</p>
                          <p className="text-[10px] text-muted-foreground">{formatDate(inv.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatCurrency(inv.amount)}</p>
                          <StatusBadge status={inv.status} />
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="comms" className="space-y-2 mt-2">
                    {selected.communications.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">No communication logged.</p> : selected.communications.map((c, i) => (
                      <div key={i} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium">{c.subject}</p>
                          <Badge variant="outline" className="text-[10px]">{c.channel}</Badge>
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{formatDate(c.date)} · Outcome: {c.outcome}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
              <SheetFooter className="flex-row gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.info("Email drafted", { description: `Composing email to ${selected.contactEmail}` })}><Mail className="mr-1.5 h-3.5 w-3.5" /> Email</Button>
                <Button size="sm" onClick={() => toast.success("Engagement started", { description: `New engagement for ${selected.name}.` })}>New Engagement</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AddClientDialog open={addOpen} onOpenChange={setAddOpen} onAdd={onAdd} />
    </div>
  );
}

function AddClientDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (form: { name: string; industry: string; contactName: string; contactEmail: string; engagementType: string }) => void }) {
  const [form, setForm] = React.useState({ name: "", industry: "", contactName: "", contactEmail: "", engagementType: "Training" });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.contactName) { toast.error("Please fill required fields"); return; }
    onAdd(form);
    setForm({ name: "", industry: "", contactName: "", contactEmail: "", engagementType: "Training" });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>Add a new client to your database.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5"><Label>Client Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Industry</Label><Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></div>
            <div className="space-y-1.5">
              <Label>Engagement Type</Label>
              <Select value={form.engagementType} onValueChange={(v) => setForm({ ...form, engagementType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="AMC">AMC</SelectItem>
                  <SelectItem value="POC">POC</SelectItem>
                  <SelectItem value="Drive">Drive</SelectItem>
                  <SelectItem value="Hiring">Hiring</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Contact Name *</Label><Input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Contact Email</Label><Input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
