"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { corporateClients, learnerEnrollments, trainingPrograms, trainingBudgets, trainingInvoices } from "@/lib/lms-data";
import type { CorporateClient } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatDate, daysUntil, formatNumber } from "@/lib/format";
import { ChartTooltip, TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, Search, Handshake, Users, TrendingUp, AlertTriangle, Building2, Mail, Phone, MapPin } from "lucide-react";

const clientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  industry: z.string().min(2, "Required"),
  size: z.string().min(1, "Required"),
  location: z.string().min(2, "Required"),
  contactName: z.string().min(2, "Required"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(6, "Required"),
  contractValue: z.coerce.number().min(0),
});
type ClientFormValues = z.infer<typeof clientSchema>;

const SIZES = ["1-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];

export function TrainingClients() {
  const [rows, setRows] = React.useState<CorporateClient[]>(corporateClients);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detailClient, setDetailClient] = React.useState<CorporateClient | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema) as Resolver<ClientFormValues>,
    defaultValues: { name: "", industry: "", size: "51-200", location: "", contactName: "", contactEmail: "", contactPhone: "", contractValue: 500000 },
  });

  const filtered = rows.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalContractValue = filtered.reduce((s, c) => s + c.contractValue, 0);
  const totalEmployees = filtered.reduce((s, c) => s + c.employeesEnrolled, 0);
  const avgHealth = filtered.length > 0 ? Math.round(filtered.reduce((s, c) => s + c.healthScore, 0) / filtered.length) : 0;
  const renewalsSoon = filtered.filter((c) => c.status !== "expired" && daysUntil(c.renewalDate) <= 60).length;

  function onSubmit(values: ClientFormValues) {
    const newClient: CorporateClient = {
      id: `cc_new_${Date.now()}`,
      logo: values.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
      name: values.name,
      industry: values.industry,
      size: values.size,
      location: values.location,
      contactName: values.contactName,
      contactEmail: values.contactEmail,
      contactPhone: values.contactPhone,
      contractStart: new Date().toISOString().slice(0, 10),
      contractEnd: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      contractValue: values.contractValue,
      currency: "INR",
      employeesEnrolled: 0,
      coursesAssigned: 0,
      status: "trial",
      healthScore: 70,
      renewalDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      assignedAccountManager: "Divya Sharma",
    };
    setRows((r) => [newClient, ...r]);
    setAddOpen(false);
    form.reset();
    toast.success(`Client added — ${values.name}`, { description: "Status set to Trial. Begin onboarding." });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Corporate Clients"
        description="Manage your B2B corporate training clients — contracts, health, and renewals."
        icon={<Icon name="Handshake" className="h-6 w-6" />}
        actions={[{ label: "Add client", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />

      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Clients" value={filtered.length} icon={<Handshake className="h-5 w-5" />} tone="brand" />
        <StatCard label="Contract Value" value={formatCurrency(totalContractValue)} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
        <StatCard label="Employees Enrolled" value={formatNumber(totalEmployees)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Avg Health Score" value={avgHealth} icon={<TrendingUp className="h-5 w-5" />} tone={avgHealth >= 80 ? "success" : "warning"} hint={`${renewalsSoon} renewals ≤60d`} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Handshake className="h-5 w-5" />} title="No clients found" description="Adjust filters or add a new client." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                  <TableHead className="text-right">Contract</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[120px]">Health</TableHead>
                  <TableHead>Renewal</TableHead>
                  <TableHead>Account Mgr</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const d = daysUntil(c.renewalDate);
                  return (
                    <TableRow key={c.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDetailClient(c)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={c.logo} size="sm" />
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.contactName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{c.industry}</TableCell>
                      <TableCell className="text-sm">{c.size}</TableCell>
                      <TableCell className="text-sm">{c.location}</TableCell>
                      <TableCell className="text-right text-sm">{formatNumber(c.employeesEnrolled)}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatCurrency(c.contractValue)}</TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={c.healthScore} className="h-1.5 w-16" />
                          <span className="text-xs text-muted-foreground">{c.healthScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={d < 0 ? "text-xs font-semibold text-rose-600 dark:text-rose-400" : d <= 60 ? "text-xs font-semibold text-amber-600 dark:text-amber-400" : "text-xs text-muted-foreground"}>
                          {formatDate(c.renewalDate)}
                          {d < 0 ? ` (${Math.abs(d)}d over)` : ` (${d}d)`}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{c.assignedAccountManager}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Detail Sheet */}
      <Sheet open={!!detailClient} onOpenChange={(o) => !o && setDetailClient(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detailClient && <ClientDetail client={detailClient} />}
        </SheetContent>
      </Sheet>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Corporate Client</DialogTitle>
            <DialogDescription>Register a new B2B client. Status defaults to Trial.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Company name *</Label>
                <Input id="name" {...form.register("name")} className="mt-1" />
                {form.formState.errors.name && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Input id="industry" placeholder="Information Technology" {...form.register("industry")} className="mt-1" />
                {form.formState.errors.industry && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.industry.message}</p>}
              </div>
              <div>
                <Label htmlFor="size">Company size</Label>
                <Select defaultValue="51-200" onValueChange={(v) => form.setValue("size", v)}>
                  <SelectTrigger id="size" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input id="location" placeholder="Bengaluru" {...form.register("location")} className="mt-1" />
                {form.formState.errors.location && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.location.message}</p>}
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
                <Input id="contactPhone" {...form.register("contactPhone")} className="mt-1" />
                {form.formState.errors.contactPhone && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.contactPhone.message}</p>}
              </div>
              <div>
                <Label htmlFor="contractValue">Annual contract value (₹)</Label>
                <Input id="contractValue" type="number" {...form.register("contractValue")} className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Add client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClientDetail({ client }: { client: CorporateClient }) {
  const enrollments = learnerEnrollments.filter((e) => e.clientId === client.id);
  const programs = trainingPrograms.filter((p) => p.clientId === client.id);
  const budgets = trainingBudgets.filter((b) => b.clientId === client.id);
  const invoices = trainingInvoices.filter((i) => i.clientId === client.id);
  const totalBudgetAlloc = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalBudgetUsed = budgets.reduce((s, b) => s + b.used, 0);
  const utilPct = totalBudgetAlloc > 0 ? Math.round((totalBudgetUsed / totalBudgetAlloc) * 100) : 0;

  // synthetic 6-pt health trend
  const healthTrend = Array.from({ length: 6 }).map((_, i) => ({
    month: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"][i],
    score: Math.max(40, Math.min(100, client.healthScore - 8 + i * 3 + (i % 2 === 0 ? 2 : -1))),
  }));

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <AvatarLogo text={client.logo} size="lg" />
          <div>
            <SheetTitle className="text-lg">{client.name}</SheetTitle>
            <SheetDescription>{client.industry} · {client.size} · {client.location}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Contract value</p>
            <p className="text-lg font-semibold">{formatCurrency(client.contractValue)}</p>
            <p className="text-xs text-muted-foreground">{formatDate(client.contractStart)} → {formatDate(client.contractEnd)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Health score</p>
            <p className="text-lg font-semibold">{client.healthScore}/100</p>
            <Progress value={client.healthScore} className="mt-1 h-1.5" />
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Employees enrolled</p>
            <p className="text-lg font-semibold">{formatNumber(client.employeesEnrolled)}</p>
            <p className="text-xs text-muted-foreground">{client.coursesAssigned} courses assigned</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Budget utilization</p>
            <p className="text-lg font-semibold">{utilPct}%</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalBudgetUsed)} of {formatCurrency(totalBudgetAlloc)}</p>
          </div>
        </div>

        <SectionCard title="Contact">
          <div className="space-y-1.5 text-sm">
            <p className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" />{client.contactName}</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{client.contactEmail}</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{client.contactPhone}</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{client.location}</p>
          </div>
        </SectionCard>

        <SectionCard title="Health Trend" description="Last 6 months">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrend}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis domain={[40, 100]} tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="score" name="Health" stroke="#10b981" strokeWidth={2} fill="url(#healthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title={`Programs (${programs.length})`}>
          {programs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active programs.</p>
          ) : (
            <ul className="space-y-2 max-h-40 overflow-y-auto scroll-thin">
              {programs.map((p) => (
                <li key={p.id} className="rounded-lg border p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{p.enrolled}/{p.targetLearners} enrolled · {p.completed} completed</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title={`Recent Enrollments (${enrollments.length})`}>
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No enrollments yet.</p>
          ) : (
            <ul className="space-y-1.5 max-h-32 overflow-y-auto scroll-thin">
              {enrollments.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{e.learnerName} — {e.courseName}</span>
                  <StatusBadge status={e.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title={`Invoices (${invoices.length})`}>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices.</p>
          ) : (
            <ul className="space-y-1.5">
              {invoices.map((i) => (
                <li key={i.id} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs">{i.number}</span>
                  <span className="text-muted-foreground">{formatCurrency(i.total)}</span>
                  <StatusBadge status={i.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {daysUntil(client.renewalDate) <= 60 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-amber-700 dark:text-amber-400">Renewal approaching</p>
              <p className="text-muted-foreground">{daysUntil(client.renewalDate) < 0 ? `${Math.abs(daysUntil(client.renewalDate))} days overdue` : `${daysUntil(client.renewalDate)} days remaining`} — schedule renewal review with {client.assignedAccountManager}.</p>
            </div>
          </div>
        )}
      </div>

      <SheetFooter className="mt-6">
        <Button variant="outline">Schedule review</Button>
        <Button>Open in CRM</Button>
      </SheetFooter>
    </>
  );
}
