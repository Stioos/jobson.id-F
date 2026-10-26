"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { promotions } from "@/lib/mock-data";
import type { Promotion } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { CHART_COLORS, ChartCard, ChartTooltip, Toolbar } from "./_shared";

type AdSlot = { id: string; name: string; placement: string; price: number; booked: boolean; sponsor?: string };

const AD_SLOTS: AdSlot[] = [
  { id: "ad_1", name: "Home hero banner", placement: "Top of /home", price: 50000, booked: true, sponsor: "TechCorp India" },
  { id: "ad_2", name: "Sidebar — job search", placement: "/jobs sidebar", price: 18000, booked: true, sponsor: "FinEdge Solutions" },
  { id: "ad_3", name: "Search result top", placement: "/jobs results", price: 24000, booked: false },
  { id: "ad_4", name: "Email footer", placement: "Job alert emails", price: 12000, booked: false },
];

export function AdminPromotions() {
  const [rows, setRows] = React.useState<Promotion[]>(promotions);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [editTarget, setEditTarget] = React.useState<Promotion | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Promotion | null>(null);

  const filtered = rows.filter((p) => {
    if (search && !`${p.name} ${p.code}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  const redemptionData = rows.map((p) => ({ name: p.code, used: p.usedCount, limit: p.usageLimit }));

  const remove = () => {
    if (!deleteTarget) return;
    setRows((p) => p.filter((x) => x.id !== deleteTarget.id));
    toast.error("Promotion deleted", { description: `${deleteTarget.code} removed.` });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Promotions & Advertisements"
        description="Manage promotional codes, featured/sponsored jobs, and ad inventory."
        icon={<Icon name="Megaphone" className="h-6 w-6" />}
        actions={[{ label: "Create promotion", onClick: () => setCreateOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Active promos" value={rows.filter((r) => r.status === "active").length} icon="Megaphone" />
        <MiniStat label="Total redemptions" value={rows.reduce((s, r) => s + r.usedCount, 0)} icon="Repeat" />
        <MiniStat label="Featured jobs" value={8} icon="Star" />
        <MiniStat label="Ad slots booked" value={`${AD_SLOTS.filter((s) => s.booked).length}/${AD_SLOTS.length}`} icon="LayoutTemplate" />
      </div>

      <SectionCard title={`Promotions (${filtered.length})`}>
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search name or code..."
          filters={
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          }
          actions={<Button size="sm" variant="outline" onClick={() => toast.success("Exported (demo)")}>Export</Button>}
        />
        <div className="mt-3 max-h-[26rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm font-medium">{p.name}</TableCell>
                  <TableCell><code className="text-xs font-mono">{p.code}</code></TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{p.type}</Badge></TableCell>
                  <TableCell className="text-sm">{p.type === "percentage" ? `${p.value}%` : formatCurrency(p.value)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-brand" style={{ width: `${Math.min(100, (p.usedCount / p.usageLimit) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{p.usedCount}/{p.usageLimit}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(p.validFrom)} → {formatDate(p.validUntil)}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setEditTarget(p)}>Edit</Button>
                    <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => setDeleteTarget(p)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No promotions.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Promotion redemption" description="Used vs limit per code">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={redemptionData} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="used" name="Used" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
              <Bar dataKey="limit" name="Limit" fill={CHART_COLORS[2]} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Featured & sponsored jobs" description="Manage sponsored job campaigns.">
          <ul className="space-y-2 text-sm">
            {[
              { title: "Senior Frontend Engineer", org: "TechCorp India", type: "Featured", days: 12 },
              { title: "Lead Backend Engineer", org: "FinEdge Solutions", type: "Sponsored", days: 7 },
              { title: "Cloud Architect", org: "MediCore Health", type: "Featured", days: 4 },
            ].map((j, i) => (
              <li key={i} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{j.title}</p>
                  <p className="text-xs text-muted-foreground">{j.org}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{j.type}</Badge>
                  <Badge variant="outline">{j.days}d left</Badge>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Ad inventory" description="Banner and sidebar slots available for sponsorship.">
        <div className="grid gap-2 md:grid-cols-2">
          {AD_SLOTS.map((s) => (
            <div key={s.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{s.name}</p>
                <Badge variant={s.booked ? "default" : "outline"} className={s.booked ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}>
                  {s.booked ? "Booked" : "Available"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.placement}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{formatCurrency(s.price)}</span>
                {s.booked && s.sponsor ? <span className="text-xs text-muted-foreground">Sponsor: {s.sponsor}</span> : <Button size="sm" variant="outline" onClick={() => toast.info("Booking flow (demo)")}>Book slot</Button>}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <PromoDialog open={createOpen} onOpenChange={setCreateOpen} title="Create promotion" onSubmit={(p) => {
        setRows((prev) => [{ ...p, id: `pr_${Date.now()}` }, ...prev]);
        toast.success("Promotion created");
        setCreateOpen(false);
      }} />
      <PromoDialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)} title="Edit promotion" initial={editTarget ?? undefined} onSubmit={(p) => {
        if (!editTarget) return;
        setRows((prev) => prev.map((x) => (x.id === editTarget.id ? p : x)));
        toast.success("Promotion updated");
        setEditTarget(null);
      }} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete promotion {deleteTarget?.code}?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the promotion code. Existing redemptions are preserved in reports.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <Icon name={icon} className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function PromoDialog({ open, onOpenChange, title, onSubmit, initial }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  onSubmit: (p: Promotion) => void;
  initial?: Promotion;
}) {
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [type, setType] = React.useState<Promotion["type"]>("percentage");
  const [value, setValue] = React.useState(15);
  const [usageLimit, setUsageLimit] = React.useState(100);
  const [status, setStatus] = React.useState<Promotion["status"]>("active");

  React.useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setCode(initial?.code ?? "");
      setType(initial?.type ?? "percentage");
      setValue(initial?.value ?? 15);
      setUsageLimit(initial?.usageLimit ?? 100);
      setStatus(initial?.status ?? "active");
    }
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configure promotion code, value, and limits.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5"><Label htmlFor="pr-name">Name</Label><Input id="pr-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="pr-code">Code</Label><Input id="pr-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SUMMER25" /></div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as Promotion["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="pr-val">{type === "percentage" ? "Value (%)" : "Value (₹)"}</Label><Input id="pr-val" type="number" value={value} onChange={(e) => setValue(parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-1.5"><Label htmlFor="pr-lim">Usage limit</Label><Input id="pr-lim" type="number" value={usageLimit} onChange={(e) => setUsageLimit(parseInt(e.target.value) || 0)} /></div>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Promotion["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!name.trim() || !code.trim()) { toast.error("Name and code are required"); return; }
            onSubmit({
              id: initial?.id ?? "",
              name: name.trim(), code: code.trim(), type, value, usageLimit,
              usedCount: initial?.usedCount ?? 0,
              validFrom: initial?.validFrom ?? new Date().toISOString(),
              validUntil: initial?.validUntil ?? new Date(Date.now() + 30 * 86400000).toISOString(),
              status,
            });
          }}>{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
