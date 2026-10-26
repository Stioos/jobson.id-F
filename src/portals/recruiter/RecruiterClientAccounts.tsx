"use client";

import * as React from "react";
import {
  Plus, Building2, Crown, Star, Search, Users, Briefcase, Receipt,
  TrendingUp, HeartPulse, Phone, Mail, ChevronRight,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import { clientAccounts } from "@/lib/partner-data";
import type { ClientAccount } from "@/lib/partner-data";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const TIER_TONE: Record<string, string> = {
  bronze: "bg-amber-700/10 text-amber-700 dark:text-amber-300 border-amber-700/20",
  silver: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
  gold: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  platinum: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
};

const HEALTH_TIMELINE = [
  { month: "May", score: 78 },
  { month: "Jun", score: 82 },
  { month: "Jul", score: 79 },
  { month: "Aug", score: 85 },
  { month: "Sep", score: 89 },
  { month: "Oct", score: 92 },
];

const REVENUE_TREND = [
  { month: "May", revenue: 120000 },
  { month: "Jun", revenue: 180000 },
  { month: "Jul", revenue: 240000 },
  { month: "Aug", revenue: 310000 },
  { month: "Sep", revenue: 380000 },
  { month: "Oct", revenue: 420000 },
];

const SAMPLE_INVOICES = [
  { id: "INV-2024-5001", amount: 200000, status: "paid", issued: "2024-09-12", due: "2024-09-26" },
  { id: "INV-2024-5018", amount: 120000, status: "pending", issued: "2024-10-01", due: "2024-10-15" },
  { id: "INV-2024-5023", amount: 80000, status: "overdue", issued: "2024-09-20", due: "2024-10-04" },
];

const SAMPLE_MANDATES = [
  { id: "jo_001", title: "Senior Full-Stack Engineer", positions: 3, filled: 1, status: "open" },
  { id: "jo_006", title: "Backend Engineer (Go)", positions: 2, filled: 0, status: "open" },
  { id: "jo_005", title: "UI/UX Designer", positions: 1, filled: 1, status: "fulfilled" },
  { id: "jo_009", title: "Data Engineer", positions: 2, filled: 0, status: "open" },
];

const SAMPLE_PLACEMENTS = [
  { candidate: "Kavya Reddy", role: "ML Engineer", date: "2024-10-12", fee: 250000 },
  { candidate: "Rohit Sharma", role: "Senior SDET", date: "2024-09-04", fee: 200000 },
  { candidate: "Neha Patel", role: "Product Manager", date: "2024-08-22", fee: 220000 },
];

function HealthScore({ score }: { score: number }) {
  const tone = score >= 85 ? "text-emerald-600 dark:text-emerald-400" : score >= 70 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";
  const barTone = score >= 85 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className={`font-semibold ${tone}`}>{score}</span>
          <span className="text-muted-foreground">/100</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className={`h-full ${barTone}`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}

export function RecruiterClientAccounts() {
  const [search, setSearch] = React.useState("");
  const [tierFilter, setTierFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<ClientAccount | null>(null);

  // Add client form state
  const [form, setForm] = React.useState({
    name: "", industry: "", contactName: "", contactEmail: "", contactPhone: "",
    tier: "bronze", assignedAccountManager: "Karthik Subramanian",
  });

  const filtered = clientAccounts.filter((c) => {
    if (tierFilter !== "all" && c.tier !== tierFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.industry.toLowerCase().includes(q) && !c.contactName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalRevenue = clientAccounts.reduce((a, c) => a + c.totalRevenue, 0);
  const totalOutstanding = clientAccounts.reduce((a, c) => a + c.outstandingInvoices, 0);
  const totalPlacements = clientAccounts.reduce((a, c) => a + c.totalPlacements, 0);
  const activeClients = clientAccounts.filter((c) => c.status === "active").length;
  const avgHealth = Math.round(clientAccounts.reduce((a, c) => a + c.healthScore, 0) / clientAccounts.length);

  function handleAddClient() {
    if (!form.name.trim() || !form.contactEmail.trim()) {
      toast.error("Client name and contact email are required");
      return;
    }
    toast.success(`Client "${form.name}" added`, { description: `Tier: ${form.tier} • Manager: ${form.assignedAccountManager}` });
    setAddOpen(false);
    setForm({ name: "", industry: "", contactName: "", contactEmail: "", contactPhone: "", tier: "bronze", assignedAccountManager: "Karthik Subramanian" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client accounts"
        description="Manage your client relationships, mandates, revenue and account health in one place."
        actions={[{ label: "Add client", onClick: () => setAddOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Active clients" value={activeClients} icon={<Building2 className="h-5 w-5" />} tone="brand" hint={`${clientAccounts.length} total`} />
        <StatCard label="Total revenue" value={formatCurrency(totalRevenue)} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
        <StatCard label="Outstanding invoices" value={formatCurrency(totalOutstanding)} icon={<Receipt className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg health score" value={avgHealth} icon={<HeartPulse className="h-5 w-5" />} tone="default" hint="Across all accounts" />
      </div>

      <SectionCard
        title="Accounts"
        description="Click a client to view mandates, placements, revenue trend, invoices and health timeline."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name, industry, contact…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-44 pl-8 sm:w-56"
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Tier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-5 w-5" />}
            title="No client accounts match"
            description="Adjust your search or filters to see accounts."
          />
        ) : (
          <div className="max-h-[32rem] overflow-y-auto scroll-thin -mx-4 sm:-mx-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Industry</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="text-center">Mandates</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Placements</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Outstanding</TableHead>
                  <TableHead className="min-w-[140px]">Health</TableHead>
                  <TableHead className="hidden xl:table-cell">Last activity</TableHead>
                  <TableHead className="hidden lg:table-cell">Account manager</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setDetail(c)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <AvatarLogo text={c.name} size="sm" />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{c.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden truncate">{c.industry}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{c.industry}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${TIER_TONE[c.tier]}`}>
                        {c.tier === "platinum" && <Crown className="h-3 w-3" />}
                        {c.tier === "gold" && <Star className="h-3 w-3" />}
                        {c.tier}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">{c.contactName}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">{c.contactEmail}</div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{c.openMandates}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell font-medium">{c.totalPlacements}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(c.totalRevenue)}</TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {c.outstandingInvoices > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">{formatCurrency(c.outstandingInvoices)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell><HealthScore score={c.healthScore} /></TableCell>
                    <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{timeAgo(c.lastActivity)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{c.assignedAccountManager}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <StatusBadge status={c.status} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Add client dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add new client account</DialogTitle>
            <DialogDescription>Capture the basics. You can enrich the profile after the first meeting.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="ca-name">Client name *</Label>
              <Input id="ca-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. TechCorp India" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ca-industry">Industry</Label>
                <Input id="ca-industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="IT / Fintech / AI" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ca-tier">Tier</Label>
                <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
                  <SelectTrigger id="ca-tier"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ca-contact">Primary contact name</Label>
              <Input id="ca-contact" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="e.g. Rohan Mehta" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ca-email">Contact email *</Label>
                <Input id="ca-email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="rohan@client.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ca-phone">Phone</Label>
                <Input id="ca-phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="+91 …" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ca-am">Account manager</Label>
              <Input id="ca-am" value={form.assignedAccountManager} onChange={(e) => setForm({ ...form, assignedAccountManager: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddClient}>Add client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <AvatarLogo text={detail.name} size="lg" />
                  <div>
                    <SheetTitle className="text-xl">{detail.name}</SheetTitle>
                    <SheetDescription className="flex flex-wrap items-center gap-2 mt-1">
                      <span>{detail.industry}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${TIER_TONE[detail.tier]}`}>
                        {detail.tier === "platinum" && <Crown className="h-3 w-3" />}
                        {detail.tier === "gold" && <Star className="h-3 w-3" />}
                        {detail.tier}
                      </span>
                      <StatusBadge status={detail.status} />
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="px-4 pb-6 space-y-5">
                {/* KPI row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">Open mandates</div>
                    <div className="text-lg font-semibold mt-1">{detail.openMandates}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">Total placements</div>
                    <div className="text-lg font-semibold mt-1">{detail.totalPlacements}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">Total revenue</div>
                    <div className="text-lg font-semibold mt-1">{formatCurrency(detail.totalRevenue)}</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-xs text-muted-foreground">Outstanding</div>
                    <div className="text-lg font-semibold mt-1">{formatCurrency(detail.outstandingInvoices)}</div>
                  </div>
                </div>

                {/* Contact */}
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="text-sm font-semibold">Primary contact</div>
                  <div className="text-sm">{detail.contactName}</div>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{detail.contactEmail}</span>
                    <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{detail.contactPhone}</span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-1">
                    Account manager: <span className="font-medium text-foreground">{detail.assignedAccountManager}</span>
                  </div>
                </div>

                <Tabs defaultValue="mandates">
                  <TabsList className="grid w-full grid-cols-4 h-9">
                    <TabsTrigger value="mandates">Mandates</TabsTrigger>
                    <TabsTrigger value="placements">Placements</TabsTrigger>
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mandates" className="mt-3 space-y-2">
                    {SAMPLE_MANDATES.map((m) => (
                      <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{m.title}</div>
                          <div className="text-xs text-muted-foreground">{m.id} • {m.filled}/{m.positions} filled</div>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="placements" className="mt-3 space-y-2">
                    {SAMPLE_PLACEMENTS.map((p, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{p.candidate}</div>
                          <div className="text-xs text-muted-foreground">{p.role} • {formatDate(p.date)}</div>
                        </div>
                        <div className="text-sm font-semibold">{formatCurrency(p.fee)}</div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="revenue" className="mt-3 space-y-3">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-semibold mb-1">Revenue trend (last 6 months)</div>
                      <div className="text-xs text-muted-foreground mb-3">Illustrative — based on placement fees collected.</div>
                      <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={REVENUE_TREND} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
                          <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="oklch(0.65 0.18 162)" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="oklch(0.65 0.18 162)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                          <Tooltip formatter={(v: number) => formatCurrency(v)} />
                          <Area type="monotone" dataKey="revenue" stroke="oklch(0.65 0.18 162)" strokeWidth={2} fill="url(#revGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="invoices" className="mt-3 space-y-2">
                    {SAMPLE_INVOICES.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{inv.id}</div>
                          <div className="text-xs text-muted-foreground">Issued {formatDate(inv.issued)} • Due {formatDate(inv.due)}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{formatCurrency(inv.amount)}</span>
                          <StatusBadge status={inv.status} />
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                {/* Health timeline */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-semibold">Account health timeline</div>
                    <span className="text-sm font-semibold">{detail.healthScore}/100</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">6-month rolling health score, derived from revenue, placement velocity and engagement.</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={HEALTH_TIMELINE} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="score" fill="oklch(0.65 0.18 162)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => toast.success("Calendar invite sent", { description: `QBR scheduled with ${detail.contactName}` })}>
                    <Briefcase className="h-4 w-4 mr-1.5" />Schedule QBR
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Statement of work drafted", { description: `Open mandates for ${detail.name}` })}>
                    <Users className="h-4 w-4 mr-1.5" />Draft SOW
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Activity report exported", { description: `${detail.name} • last 90 days` })}>
                    Export activity
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
