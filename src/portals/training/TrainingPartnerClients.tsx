"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  partnerClients as seedClients,
  sourcingRequests,
  talentPlacements,
} from "@/lib/lms-data";
import type { PartnerClient } from "@/lib/lms-data";
import { useNav } from "@/lib/store";
import {
  PageHeader, SectionCard, StatCard, StatusBadge, EmptyState,
  Card,
} from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  Building2, Plus, Search, Mail, Phone, Briefcase, Handshake, Coins,
  TrendingUp, Calendar, Filter, RefreshCw, Ban, ShieldCheck, AlertTriangle,
} from "lucide-react";

// ---------- form schema ----------

const clientSchema = z.object({
  name: z.string().min(2, "Company name required"),
  industry: z.string().min(2, "Industry required"),
  contactName: z.string().min(2, "Contact name required"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(6, "Phone required"),
  commissionRate: z.coerce.number().min(0).max(25, "Max 25%"),
  agreementStart: z.string().min(1, "Required"),
  agreementEnd: z.string().min(1, "Required"),
});
type ClientFormValues = z.infer<typeof clientSchema>;

const INDUSTRIES = ["Information Technology", "Fintech", "AI/ML", "Banking", "Startup", "Healthcare", "E-commerce", "Manufacturing", "Consulting", "Education"];

// ---------- main page ----------

export function TrainingPartnerClients() {
  const { navigate } = useNav();
  const [clients, setClients] = React.useState<PartnerClient[]>(seedClients);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<PartnerClient | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [renewFor, setRenewFor] = React.useState<PartnerClient | null>(null);
  const [terminateFor, setTerminateFor] = React.useState<PartnerClient | null>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema) as Resolver<ClientFormValues>,
    defaultValues: {
      name: "", industry: "Information Technology",
      contactName: "", contactEmail: "", contactPhone: "",
      commissionRate: 8.33,
      agreementStart: new Date().toISOString().slice(0, 10),
      agreementEnd: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
    },
  });

  const filtered = clients.filter((c) => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // KPIs
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "active").length;
  const totalEarned = clients.reduce((s, c) => s + c.totalCommissionEarned, 0);
  const totalPlacements = clients.reduce((s, c) => s + c.totalPlacements, 0);
  const avgRate = clients.length > 0 ? (clients.reduce((s, c) => s + c.commissionRate, 0) / clients.length).toFixed(2) : "0";

  function onAdd(values: ClientFormValues) {
    const newClient: PartnerClient = {
      id: `pc_new_${Date.now()}`,
      name: values.name,
      logo: values.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
      industry: values.industry,
      contactName: values.contactName,
      contactEmail: values.contactEmail,
      contactPhone: values.contactPhone,
      agreementStart: values.agreementStart,
      agreementEnd: values.agreementEnd,
      commissionRate: values.commissionRate,
      totalPositionsRequested: 0,
      totalPlacements: 0,
      totalCommissionEarned: 0,
      status: "trial",
      hiringActive: true,
    };
    setClients((c) => [newClient, ...c]);
    setAddOpen(false);
    form.reset();
    toast.success(`Partner client added — ${values.name}`, {
      description: `Status: Trial · Commission rate ${values.commissionRate}% (configurable).`,
    });
  }

  function renew(c: PartnerClient) {
    const newEnd = new Date(c.agreementEnd);
    newEnd.setFullYear(newEnd.getFullYear() + 1);
    setClients((cs) => cs.map((x) => x.id === c.id ? {
      ...x,
      status: "active" as const,
      agreementEnd: newEnd.toISOString(),
    } : x));
    setDetail((d) => d && d.id === c.id ? { ...d, status: "active" as const, agreementEnd: newEnd.toISOString() } : d);
    setRenewFor(null);
    toast.success(`Agreement renewed — ${c.name}`, { description: `New end date: ${formatDate(newEnd.toISOString())}` });
  }

  function terminate(c: PartnerClient) {
    setClients((cs) => cs.map((x) => x.id === c.id ? { ...x, status: "expired" as const, hiringActive: false } : x));
    setDetail((d) => d && d.id === c.id ? { ...d, status: "expired" as const, hiringActive: false } : d);
    setTerminateFor(null);
    toast.info(`Agreement terminated — ${c.name}`, { description: "Marked as expired. Existing placements remain in guarantee." });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Partner Clients"
        description="Employer partners who hire from SkillForge's certified talent pool. Manage agreements, commission rates, and performance."
        icon={<Building2 className="h-6 w-6" />}
        actions={[{ label: "Add partner", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />
      <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs text-muted-foreground">
        <span className="font-semibold text-brand">Commission rates are configurable per agreement.</span> Default is 8.33% (1 month of annual CTC) but can be negotiated per client — edit on add/renew.
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total partners" value={totalClients} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active agreements" value={activeClients} icon={<ShieldCheck className="h-5 w-5" />} tone="success" hint={`${clients.filter((c) => c.status === "trial").length} on trial`} />
        <StatCard label="Total placements" value={totalPlacements} icon={<Handshake className="h-5 w-5" />} />
        <StatCard label="Commission earned" value={formatCurrency(totalEarned)} icon={<Coins className="h-5 w-5" />} tone="success" hint={`avg ${avgRate}% rate`} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, industry, contact..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => navigate("training", "sourcing-requests")} className="ml-auto">
          <Briefcase className="mr-1 h-3.5 w-3.5" /> View requests
        </Button>
      </div>

      {/* Table */}
      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-5 w-5" />}
            title="No partner clients"
            description="Adjust filters or add a new partner employer."
            action={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add partner</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Agreement</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Req</TableHead>
                  <TableHead className="text-right">Placed</TableHead>
                  <TableHead className="text-right">Earned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hiring</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const d = daysUntil(c.agreementEnd);
                  return (
                    <TableRow key={c.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetail(c)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={c.logo} size="sm" />
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{c.industry}</TableCell>
                      <TableCell className="text-sm">
                        <p>{c.contactName}</p>
                        <p className="text-xs text-muted-foreground">{c.contactEmail}</p>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs ${d < 0 ? "text-rose-600 dark:text-rose-400" : d <= 60 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                          Until {formatDate(c.agreementEnd)}
                          <br />
                          {d < 0 ? `(${Math.abs(d)}d over)` : `(${d}d)`}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">{c.commissionRate}%</TableCell>
                      <TableCell className="text-right text-sm">{c.totalPositionsRequested}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{c.totalPlacements}</TableCell>
                      <TableCell className="text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(c.totalCommissionEarned)}</TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell>
                        {c.hiringActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Paused</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail Sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && (
            <ClientDetail
              client={detail}
              onRenew={() => setRenewFor(detail)}
              onTerminate={() => setTerminateFor(detail)}
              navigate={navigate}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Renew alert */}
      <AlertDialog open={!!renewFor} onOpenChange={(o) => !o && setRenewFor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Renew agreement?</AlertDialogTitle>
            <AlertDialogDescription>
              {renewFor && `This will renew the agreement with ${renewFor.name} for 1 year from the current end date (${formatDate(renewFor.agreementEnd)}). Status will be set to Active.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => renewFor && renew(renewFor)}>Renew agreement</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terminate alert */}
      <AlertDialog open={!!terminateFor} onOpenChange={(o) => !o && setTerminateFor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate agreement?</AlertDialogTitle>
          <AlertDialogDescription>
            {terminateFor && `This will mark the agreement with ${terminateFor.name} as expired. The partner will no longer be able to submit new requests. Existing placements remain in guarantee. This action cannot be undone.`}
          </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => terminateFor && terminate(terminateFor)}
            >
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add partner client</DialogTitle>
            <DialogDescription>Register a new employer partner. Status defaults to Trial. Commission rate is configurable per agreement.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onAdd)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Company name *</Label>
                <Input id="name" {...form.register("name")} className="mt-1" />
                {form.formState.errors.name && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={form.watch("industry")} onValueChange={(v) => form.setValue("industry", v)}>
                  <SelectTrigger id="industry" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
                {form.formState.errors.industry && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.industry.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactName">Contact name *</Label>
                <Input id="contactName" {...form.register("contactName")} className="mt-1" />
                {form.formState.errors.contactName && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.contactName.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact email *</Label>
                <Input id="contactEmail" type="email" {...form.register("contactEmail")} className="mt-1" />
                {form.formState.errors.contactEmail && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.contactEmail.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact phone *</Label>
                <Input id="contactPhone" placeholder="+91 ..." {...form.register("contactPhone")} className="mt-1" />
                {form.formState.errors.contactPhone && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.contactPhone.message}</p>}
              </div>
              <div>
                <Label htmlFor="rate">Commission rate (%) *</Label>
                <Input id="rate" type="number" step="0.01" min={0} max={25} {...form.register("commissionRate")} className="mt-1" />
                {form.formState.errors.commissionRate && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.commissionRate.message}</p>}
                <p className="mt-1 text-[11px] text-muted-foreground">Default 8.33% (1 month of CTC). Editable per agreement.</p>
              </div>
              <div>
                <Label htmlFor="agStart">Agreement start *</Label>
                <Input id="agStart" type="date" {...form.register("agreementStart")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="agEnd">Agreement end *</Label>
                <Input id="agEnd" type="date" {...form.register("agreementEnd")} className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Add partner</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- ClientDetail ----------

function ClientDetail({
  client, onRenew, onTerminate, navigate,
}: {
  client: PartnerClient;
  onRenew: () => void;
  onTerminate: () => void;
  navigate: (portal: string, route: string) => void;
}) {
  const requests = sourcingRequests.filter((r) => r.employerName === client.name);
  const placements = talentPlacements.filter((p) => p.employerName === client.name);
  const joined = placements.filter((p) => p.status === "joined").length;
  const pipeline = placements.filter((p) => p.status === "offered").reduce((s, p) => s + p.commissionAmount, 0);
  const d = daysUntil(client.agreementEnd);
  const fulfillmentRate = client.totalPositionsRequested > 0 ? Math.round((client.totalPlacements / client.totalPositionsRequested) * 100) : 0;

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <AvatarLogo text={client.logo} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <SheetTitle className="text-lg">{client.name}</SheetTitle>
              <StatusBadge status={client.status} />
              {client.hiringActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Hiring active
                </span>
              )}
            </div>
            <SheetDescription>{client.industry}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-5 space-y-5">
        {/* Agreement terms */}
        <SectionCard title="Agreement terms" description="Commission rate is configurable per agreement">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Start date</p>
              <p className="text-sm font-medium">{formatDate(client.agreementStart)}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">End date</p>
              <p className={`text-sm font-medium ${d < 0 ? "text-rose-600 dark:text-rose-400" : d <= 60 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                {formatDate(client.agreementEnd)}
                <br /><span className="text-xs font-normal">{d < 0 ? `${Math.abs(d)}d over` : `${d}d left`}</span>
              </p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Commission rate</p>
              <p className="text-sm font-semibold text-brand">{client.commissionRate}%</p>
              <p className="text-[10px] text-muted-foreground">per placement (of annual CTC)</p>
            </Card>
          </div>
          {(d <= 60 && d >= 0) && (
            <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
              <AlertTriangle className="mr-1 inline h-3 w-3 text-amber-600 dark:text-amber-400" />
              <span className="font-medium text-amber-700 dark:text-amber-400">Agreement expiring in {d} days.</span> Renew to maintain continuity.
            </div>
          )}
          {d < 0 && (
            <div className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-xs">
              <AlertTriangle className="mr-1 inline h-3 w-3 text-rose-600 dark:text-rose-400" />
              <span className="font-medium text-rose-700 dark:text-rose-400">Agreement expired {Math.abs(d)} days ago.</span> Renew or terminate.
            </div>
          )}
        </SectionCard>

        {/* Contact */}
        <SectionCard title="Primary contact">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-md border p-2.5">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{client.contactName}</p>
            </div>
            <div className="rounded-md border p-2.5">
              <p className="text-xs text-muted-foreground">Email</p>
              <a href={`mailto:${client.contactEmail}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                <Mail className="h-3 w-3" /> {client.contactEmail}
              </a>
            </div>
            <div className="rounded-md border p-2.5">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="inline-flex items-center gap-1 text-sm font-medium">
                <Phone className="h-3 w-3" /> {client.contactPhone}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Performance */}
        <SectionCard title="Performance summary" description="Hiring funnel and commission">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="p-3 text-center">
              <p className="text-xl font-semibold">{client.totalPositionsRequested}</p>
              <p className="text-xs text-muted-foreground">positions requested</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-semibold">{client.totalPlacements}</p>
              <p className="text-xs text-muted-foreground">placements made</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-semibold">{fulfillmentRate}%</p>
              <p className="text-xs text-muted-foreground">fulfillment rate</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(client.totalCommissionEarned)}</p>
              <p className="text-xs text-muted-foreground">earned (+{formatCurrency(pipeline)} pipeline)</p>
            </Card>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">Fulfillment progress</span>
              <span className="text-muted-foreground">{client.totalPlacements}/{client.totalPositionsRequested}</span>
            </div>
            <Progress value={fulfillmentRate} className="h-2" />
          </div>
        </SectionCard>

        {/* Tabs: requests + placements */}
        <Tabs defaultValue="requests">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="placements">Placements ({placements.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="mt-3">
            {requests.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No requests from this partner yet.</p>
            ) : (
              <div className="space-y-2">
                {requests.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.role} · {r.positions} positions</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="placements" className="mt-3">
            {placements.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No placements for this partner yet.</p>
            ) : (
              <div className="space-y-2">
                {placements.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                    <Handshake className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.learnerName}</p>
                      <p className="text-xs text-muted-foreground">{p.jobTitle} · {formatCurrency(p.salary)}</p>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+{formatCurrency(p.commissionAmount)}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <SheetFooter className="flex-row gap-2 flex-wrap">
          <Button onClick={onRenew}><RefreshCw className="mr-2 h-4 w-4" /> Renew agreement</Button>
          <Button variant="outline" onClick={() => navigate("training", "sourcing-requests")}>
            <Briefcase className="mr-2 h-4 w-4" /> View all requests
          </Button>
          <Button variant="outline" className="ml-auto text-rose-600 hover:bg-rose-500/10 hover:text-rose-700" onClick={onTerminate}>
            <Ban className="mr-2 h-4 w-4" /> Terminate
          </Button>
        </SheetFooter>
      </div>
    </>
  );
}
