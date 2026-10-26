"use client";

import * as React from "react";
import { renewals as seedRenewals } from "@/lib/partner-data";
import type { Renewal } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";
import { RotateCcw, Plus, Send, AlertTriangle, CalendarClock, FileText } from "lucide-react";

export function PartnerRenewals() {
  const partner = CURRENT_PARTNER;
  const [renewals] = React.useState<Renewal[]>(seedRenewals);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [initiateOpen, setInitiateOpen] = React.useState(false);
  const [initiateTarget, setInitiateTarget] = React.useState<Renewal | null>(null);

  const filtered = renewals.filter((r) => statusFilter === "all" || r.status === statusFilter);
  const overdue = renewals.filter((r) => r.daysToExpiry < 0);
  const urgent = renewals.filter((r) => r.daysToExpiry >= 0 && r.daysToExpiry <= 60);
  const inRenewal = renewals.filter((r) => r.status === "in_renewal");
  const totalValue = renewals.reduce((s, r) => s + r.value, 0);

  function sendNotice(r: Renewal) {
    toast.success("Renewal notice sent", { description: `${r.partnerName} notified about upcoming renewal.` });
  }
  function openInitiate(r?: Renewal) {
    setInitiateTarget(r ?? null);
    setInitiateOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Renewals"
        description={`${partner.name} — track and manage partnership agreement renewals across all partner models.`}
        icon={<Icon name="RotateCcw" className="h-6 w-6" />}
        actions={[{ label: "Initiate Renewal", icon: "Plus", onClick: () => openInitiate() }]}
      />
      <PartnerDisclaimer />

      {/* Overdue/urgent alerts */}
      {(overdue.length > 0 || urgent.length > 0) && (
        <div className="space-y-2">
          {overdue.length > 0 && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 p-3 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-rose-700">{overdue.length} agreement(s) overdue</p>
                <p className="text-xs text-rose-700/80">{overdue.map((r) => r.partnerName).join(", ")} — please initiate renewal immediately.</p>
              </div>
            </div>
          )}
          {urgent.length > 0 && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 flex items-start gap-3">
              <CalendarClock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-700">{urgent.length} agreement(s) expiring within 60 days</p>
                <p className="text-xs text-amber-700/80">{urgent.map((r) => r.partnerName).join(", ")}.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Renewals" value={renewals.length} icon={<RotateCcw className="h-5 w-5" />} tone="brand" />
        <StatCard label="In Renewal" value={inRenewal.length} icon={<RotateCcw className="h-5 w-5" />} tone="warning" />
        <StatCard label="Urgent (<60d)" value={urgent.length} icon={<CalendarClock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Total Value" value={formatCurrency(totalValue)} icon={<FileText className="h-5 w-5" />} tone="success" />
      </div>

      {/* Renewal timeline visualization */}
      <SectionCard title="Renewal Timeline" description="Days to expiry — sorted by urgency">
        <div className="space-y-2 max-h-72 overflow-y-auto scroll-thin">
          {[...renewals].sort((a, b) => a.daysToExpiry - b.daysToExpiry).map((r) => {
            const days = r.daysToExpiry;
            const pct = Math.max(0, Math.min(100, (days / 365) * 100));
            const tone = days < 0 ? "bg-rose-500" : days < 60 ? "bg-amber-500" : days < 180 ? "bg-blue-500" : "bg-emerald-500";
            return (
              <div key={r.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{r.partnerName}</span>
                  <span className={cn("font-semibold", days < 0 ? "text-rose-600" : days < 60 ? "text-amber-600" : "text-muted-foreground")}>
                    {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days to expiry`}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className={cn("h-1.5 rounded-full", tone)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <h3 className="text-sm font-semibold">All Renewals</h3>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not_due">Not Due</SelectItem>
              <SelectItem value="due_soon">Due Soon</SelectItem>
              <SelectItem value="in_renewal">In Renewal</SelectItem>
              <SelectItem value="renewed">Renewed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="max-h-[480px] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Agreement</TableHead>
                <TableHead>Current End</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>Days to Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Terms</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">No renewals match your filter.</TableCell></TableRow>
              ) : filtered.map((r) => {
                const days = r.daysToExpiry;
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{r.partnerName}</p>
                      <p className="text-[10px] text-muted-foreground">{r.partnerModel}</p>
                    </TableCell>
                    <TableCell className="text-xs">{r.agreementType}</TableCell>
                    <TableCell className="text-xs">{formatDate(r.currentEndDate)}</TableCell>
                    <TableCell className="text-xs">{formatDate(r.renewalDate)}</TableCell>
                    <TableCell>
                      <span className={cn("text-xs font-semibold", days < 0 ? "text-rose-600" : days < 60 ? "text-amber-600" : "text-muted-foreground")}>
                        {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-xs max-w-[180px]">{r.currentTerms}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-brand">{formatCurrency(r.value)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => sendNotice(r)} title="Send renewal notice"><Send className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => openInitiate(r)} title="Initiate renewal"><RotateCcw className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <InitiateRenewalDialog open={initiateOpen} onOpenChange={setInitiateOpen} target={initiateTarget} />
    </div>
  );
}

function InitiateRenewalDialog({ open, onOpenChange, target }: { open: boolean; onOpenChange: (o: boolean) => void; target: Renewal | null }) {
  const [form, setForm] = React.useState({ proposedTerms: "", newDuration: "3 years", newPartnerShare: "" });
  React.useEffect(() => {
    if (target) setForm({ proposedTerms: target.proposedTerms ?? "", newDuration: "3 years", newPartnerShare: "" });
    else setForm({ proposedTerms: "", newDuration: "3 years", newPartnerShare: "" });
  }, [target, open]);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Renewal initiated", { description: target ? `${target.partnerName} renewal started.` : "New renewal started." });
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Initiate Renewal</DialogTitle>
          <DialogDescription>
            {target ? `Renewal for ${target.partnerName} — ${target.agreementType}` : "Start a new renewal process."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          {target && (
            <div className="rounded-lg border bg-muted/40 p-3 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Current End:</span><span className="font-medium">{formatDate(target.currentEndDate)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Current Terms:</span><span className="font-medium">{target.currentTerms}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Current Value:</span><span className="font-medium">{formatCurrency(target.value)}</span></div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Proposed Terms</Label>
            <Textarea rows={2} value={form.proposedTerms} onChange={(e) => setForm({ ...form, proposedTerms: e.target.value })} placeholder="e.g. Premium — 70% partner share + 2 new programs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>New Duration</Label>
              <Select value={form.newDuration} onValueChange={(v) => setForm({ ...form, newDuration: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 year">1 year</SelectItem>
                  <SelectItem value="2 years">2 years</SelectItem>
                  <SelectItem value="3 years">3 years</SelectItem>
                  <SelectItem value="5 years">5 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>New Partner Share %</Label>
              <Input type="number" value={form.newPartnerShare} onChange={(e) => setForm({ ...form, newPartnerShare: e.target.value })} placeholder="70" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Initiate Renewal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
