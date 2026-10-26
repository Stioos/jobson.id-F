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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { referrals } from "@/lib/mock-data";
import type { Referral } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { CHART_COLORS, ChartCard, ChartTooltip, makeSeries, Toolbar } from "./_shared";

export function AdminReferrals() {
  const [rows, setRows] = React.useState<Referral[]>(referrals);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [payoutTarget, setPayoutTarget] = React.useState<Referral | null>(null);
  const [config, setConfig] = React.useState({
    tier1: 5000, tier2: 2500, tier3: 1000, cookieDays: 30,
  });

  const filtered = rows.filter((r) => {
    if (search && !`${r.referrerName} ${r.refereeName} ${r.referrerEmail}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  const conversions = rows.filter((r) => r.status === "converted" || r.status === "rewarded").length;
  const totalRewards = rows.reduce((s, r) => s + r.reward, 0);
  const attributed = 842000;

  const trend = makeSeries("refs", 14, 18, 8).map((p) => ({ ...p }));

  const markRewarded = () => {
    if (!payoutTarget) return;
    setRows((p) => p.map((r) => (r.id === payoutTarget.id ? { ...r, status: "rewarded" } : r)));
    toast.success("Payout processed", { description: `${formatCurrency(payoutTarget.reward, payoutTarget.currency)} to ${payoutTarget.referrerName}` });
    setPayoutTarget(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Referrals & Affiliates"
        description="Manage referral program, affiliates, and payouts."
        icon={<Icon name="Repeat" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Exported (demo)") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Total referrals" value={rows.length + 124} icon="Repeat" />
        <MiniStat label="Conversions" value={conversions + 38} icon="BadgeCheck" tone="success" />
        <MiniStat label="Rewards paid" value={formatCurrency(totalRewards + 184000)} icon="Banknote" />
        <MiniStat label="Revenue attributed" value={formatCurrency(attributed)} icon="TrendingUp" tone="success" />
      </div>

      <SectionCard title={`Referrals (${filtered.length})`}>
        <Toolbar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search referrer or referee..."
          filters={
            <SelectCompact value={statusFilter} onChange={setStatusFilter} options={[
              { v: "all", l: "All statuses" },
              { v: "pending", l: "Pending" },
              { v: "signed_up", l: "Signed up" },
              { v: "converted", l: "Converted" },
              { v: "rewarded", l: "Rewarded" },
              { v: "expired", l: "Expired" },
            ]} />
          }
        />
        <div className="mt-3 max-h-[26rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Referrer</TableHead>
                <TableHead>Referee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{r.referrerName}</p>
                    <p className="text-xs text-muted-foreground">{r.referrerEmail}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{r.refereeName}</p>
                    <p className="text-xs text-muted-foreground">{r.refereeEmail}</p>
                  </TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-sm">{r.reward > 0 ? formatCurrency(r.reward, r.currency) : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    {r.status === "converted" && <Button size="sm" variant="outline" onClick={() => setPayoutTarget(r)}>Process payout</Button>}
                    {r.status !== "converted" && <Button size="sm" variant="ghost" onClick={() => toast.info("View referral (demo)")}>View</Button>}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">No referrals.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Referral trend (14d)" description="Daily referral signups">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gRef" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="Referrals" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gRef)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <SectionCard title="Affiliate program config" description="Commission tiers and cookie duration.">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="t1">Tier 1 reward (₹)</Label><Input id="t1" type="number" value={config.tier1} onChange={(e) => setConfig((p) => ({ ...p, tier1: parseInt(e.target.value) || 0 }))} /></div>
            <div className="space-y-1.5"><Label htmlFor="t2">Tier 2 reward (₹)</Label><Input id="t2" type="number" value={config.tier2} onChange={(e) => setConfig((p) => ({ ...p, tier2: parseInt(e.target.value) || 0 }))} /></div>
            <div className="space-y-1.5"><Label htmlFor="t3">Tier 3 reward (₹)</Label><Input id="t3" type="number" value={config.tier3} onChange={(e) => setConfig((p) => ({ ...p, tier3: parseInt(e.target.value) || 0 }))} /></div>
            <div className="space-y-1.5"><Label htmlFor="cd">Cookie duration (days)</Label><Input id="cd" type="number" value={config.cookieDays} onChange={(e) => setConfig((p) => ({ ...p, cookieDays: parseInt(e.target.value) || 0 }))} /></div>
          </div>
          <Button size="sm" className="mt-3" onClick={() => toast.success("Affiliate config saved")}>Save config</Button>
        </SectionCard>
      </div>

      <SectionCard title="Payout management" description="Pending and completed affiliate payouts.">
        <ul className="space-y-2 text-sm">
          {rows.filter((r) => r.reward > 0).map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="text-sm font-medium">{r.referrerName}</p>
                <p className="text-xs text-muted-foreground">{r.referrerEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatCurrency(r.reward, r.currency)}</span>
                <Badge variant="outline" className="capitalize">{r.status}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <Dialog open={!!payoutTarget} onOpenChange={(o) => !o && setPayoutTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process payout</DialogTitle>
            <DialogDescription>{payoutTarget && `${formatCurrency(payoutTarget.reward, payoutTarget.currency)} to ${payoutTarget.referrerName} (${payoutTarget.referrerEmail})`}</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">This will mark the referral as rewarded and queue the payout for the next batch.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutTarget(null)}>Cancel</Button>
            <Button onClick={markRewarded} className="bg-emerald-600 hover:bg-emerald-700">Confirm payout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone?: "success" }) {
  const toneCls = tone === "success" ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300" : "text-muted-foreground bg-muted";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneCls}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SelectCompact({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
