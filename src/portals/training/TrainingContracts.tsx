"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { corporateClients } from "@/lib/lms-data";
import type { CorporateClient } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, FileText, Banknote, AlertTriangle, Clock } from "lucide-react";

const contractSchema = z.object({
  clientId: z.string().min(1, "Required"),
  value: z.coerce.number().min(0),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
});
type FormValues = z.infer<typeof contractSchema>;

interface ContractRow extends CorporateClient {
  daysToRenewal: number;
  contractStatus: "active" | "expiring" | "expired";
}

export function TrainingContracts() {
  const [rows, setRows] = React.useState<CorporateClient[]>(corporateClients);
  const [filter, setFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(contractSchema) as Resolver<FormValues>,
    defaultValues: { clientId: corporateClients[0]?.id ?? "", value: 1000000, startDate: new Date().toISOString().slice(0, 10), endDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10) },
  });

  const enriched: ContractRow[] = rows.map((r) => {
    const d = daysUntil(r.renewalDate);
    const status = r.status === "expired" || d < 0 ? "expired" : d <= 60 ? "expiring" : "active";
    return { ...r, daysToRenewal: d, contractStatus: status };
  });

  const filtered = enriched.filter((c) => filter === "all" || c.contractStatus === filter);

  const totalValue = filtered.reduce((s, c) => s + c.contractValue, 0);
  const expiring30 = enriched.filter((c) => c.daysToRenewal >= 0 && c.daysToRenewal <= 30).length;
  const expiring60 = enriched.filter((c) => c.daysToRenewal > 30 && c.daysToRenewal <= 60).length;
  const expiring90 = enriched.filter((c) => c.daysToRenewal > 60 && c.daysToRenewal <= 90).length;
  const expiredCount = enriched.filter((c) => c.contractStatus === "expired").length;

  function onSubmit(values: FormValues) {
    const client = corporateClients.find((c) => c.id === values.clientId);
    if (!client) return;
    const newContract: CorporateClient = {
      ...client,
      contractStart: values.startDate,
      contractEnd: values.endDate,
      contractValue: values.value,
      renewalDate: values.endDate,
      status: "active",
    };
    setRows((r) => [newContract, ...r.filter((x) => x.id !== client.id)]);
    setAddOpen(false);
    form.reset();
    toast.success(`Contract created — ${client.name}`, { description: `${formatCurrency(values.value)} · ends ${formatDate(values.endDate)}` });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contracts & Renewals"
        description="Track B2B training contracts and renewal pipeline."
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[{ label: "Create contract", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Contract Value" value={formatCurrency(totalValue)} icon={<Banknote className="h-5 w-5" />} tone="success" />
        <StatCard label="Expiring ≤30d" value={expiring30} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
        <StatCard label="Expiring 31-60d" value={expiring60} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Expiring 61-90d" value={expiring90} icon={<Clock className="h-5 w-5" />} hint={`${expiredCount} expired`} />
      </div>

      {/* Renewal pipeline */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Critical (≤30d)", count: expiring30, tone: "border-rose-500/40 bg-rose-500/5 text-rose-700 dark:text-rose-300" },
          { label: "Soon (31-60d)", count: expiring60, tone: "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300" },
          { label: "Planning (61-90d)", count: expiring90, tone: "border-brand/40 bg-brand/5 text-brand" },
        ].map((b) => (
          <div key={b.label} className={`rounded-lg border p-4 ${b.tone}`}>
            <p className="text-xs font-medium uppercase tracking-wide">{b.label}</p>
            <p className="mt-2 text-2xl font-bold">{b.count}</p>
            <p className="text-xs">contracts</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All contracts</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring (≤60d)</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<FileText className="h-5 w-5" />} title="No contracts found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Contract Value</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Renewal Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={c.logo} size="sm" />
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.industry}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(c.contractValue)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(c.contractStart)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(c.contractEnd)}</TableCell>
                    <TableCell className="text-sm">{formatDate(c.renewalDate)}</TableCell>
                    <TableCell>
                      <span className={c.daysToRenewal < 0 ? "text-sm font-semibold text-rose-600 dark:text-rose-400" : c.daysToRenewal <= 30 ? "text-sm font-semibold text-amber-600 dark:text-amber-400" : "text-sm text-muted-foreground"}>
                        {c.daysToRenewal < 0 ? `${Math.abs(c.daysToRenewal)}d overdue` : `${c.daysToRenewal}d`}
                      </span>
                    </TableCell>
                    <TableCell>
                      {c.contractStatus === "expired" ? <StatusBadge status="expired" /> : c.contractStatus === "expiring" ? <StatusBadge status="pending" /> : <StatusBadge status="active" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Contract</DialogTitle>
            <DialogDescription>Register or renew a B2B training contract.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="c-client">Client *</Label>
              <Select defaultValue={form.getValues("clientId")} onValueChange={(v) => form.setValue("clientId", v)}>
                <SelectTrigger id="c-client" className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="c-value">Contract value (₹) *</Label>
              <Input id="c-value" type="number" {...form.register("value")} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="c-start">Start *</Label>
                <Input id="c-start" type="date" {...form.register("startDate")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="c-end">End / Renewal *</Label>
                <Input id="c-end" type="date" {...form.register("endDate")} className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Create contract</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
