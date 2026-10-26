"use client";

import * as React from "react";
import { providers, type Provider } from "@/lib/lms-data";
import { PageHeader, Card, CardTitle, CardContent, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TenantDisclaimer, ChartCard } from "./_shared";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { toast } from "sonner";
import {
  Plus, Star, Users2, BookOpen, Calendar, AlertTriangle,
  RefreshCw, Ban, Filter,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

export function TrainingProviders() {
  const [rows, setRows] = React.useState<Provider[]>(providers);
  const [view, setView] = React.useState<"grid" | "table">("grid");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [detail, setDetail] = React.useState<Provider | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [terminate, setTerminate] = React.useState<Provider | null>(null);

  const categories = Array.from(new Set(rows.map((r) => r.category)));
  const filtered = rows.filter((r) => {
    const mc = categoryFilter === "all" || r.category === categoryFilter;
    const ms = statusFilter === "all" || r.status === statusFilter;
    return mc && ms;
  });

  const totalCourses = rows.reduce((s, r) => s + r.courses, 0);
  const totalLearners = rows.reduce((s, r) => s + r.learnersTrained, 0);
  const avgRating = rows.length > 0 ? (rows.reduce((s, r) => s + r.rating, 0) / rows.length).toFixed(2) : "0";
  const activeCount = rows.filter((r) => r.status === "active").length;

  function confirmTerminate() {
    if (!terminate) return;
    setRows((prev) => prev.map((r) => r.id === terminate.id ? { ...r, status: "expired" } : r));
    toast.success(`Contract terminated with ${terminate.name}`);
    setTerminate(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Content providers"
        description="Manage third-party learning content providers — cloud, leadership, security, sales and more."
        actions={[
          { label: "Add provider", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active providers" value={activeCount} icon={<Users2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Courses offered" value={totalCourses} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Learners trained" value={formatNumber(totalLearners)} icon={<Users2 className="h-5 w-5" />} />
        <StatCard label="Avg rating" value={avgRating} icon={<Star className="h-5 w-5" />} tone="success" />
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Button size="sm" variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")}>Grid</Button>
            <Button size="sm" variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")}>Table</Button>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users2 className="h-6 w-6" />} title="No providers match your filters" />
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="cursor-pointer p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md" onClick={() => setDetail(p)}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ background: p.logoColor }}
                  >
                    {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.type}</p>
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px]">{p.category}</Badge>
                {p.specialties.slice(0, 2).map((s) => (
                  <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md border p-2">
                  <p className="font-semibold">{p.courses}</p>
                  <p className="text-[10px] text-muted-foreground">Courses</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="font-semibold">{p.trainers}</p>
                  <p className="text-[10px] text-muted-foreground">Trainers</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="flex items-center justify-center gap-0.5 font-semibold">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />{p.rating}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Rating</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Contract to {formatDate(p.contractEnd)}
                </span>
                <span className="font-semibold text-brand">{formatCurrency(p.pricing)}/yr</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Trainers</TableHead>
                    <TableHead>Contract end</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Learners</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer" onClick={() => setDetail(p)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-bold text-white"
                            style={{ background: p.logoColor }}
                          >
                            {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{p.category}</TableCell>
                      <TableCell className="text-sm">{p.courses}</TableCell>
                      <TableCell className="text-sm">{p.trainers}</TableCell>
                      <TableCell className="text-sm">{formatDate(p.contractEnd)}</TableCell>
                      <TableCell className="text-sm font-medium text-brand">{formatCurrency(p.pricing)}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />{p.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{formatNumber(p.learnersTrained)}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => { if (!o) setDetail(null); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && <ProviderDetail provider={detail} onTerminate={() => setTerminate(detail)} />}
        </SheetContent>
      </Sheet>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add content provider</DialogTitle>
            <DialogDescription>Register a new third-party training content provider.</DialogDescription>
          </DialogHeader>
          <AddProviderForm onCancel={() => setAddOpen(false)} onSubmit={(vals) => {
            const newRow: Provider = {
              id: `pv_new_${Date.now()}`,
              name: vals.name,
              type: vals.type,
              logoColor: vals.logoColor,
              courses: 0, trainers: 0,
              contractStart: vals.contractStart,
              contractEnd: vals.contractEnd,
              pricing: vals.pricing,
              rating: 0,
              learnersTrained: 0,
              status: "pending",
              category: vals.category,
              description: vals.description,
              specialties: vals.specialties.split(",").map((s) => s.trim()).filter(Boolean),
            };
            setRows((r) => [newRow, ...r]);
            setAddOpen(false);
            toast.success(`Provider added — ${vals.name}`);
          }} />
        </DialogContent>
      </Dialog>

      {/* Terminate confirm */}
      <AlertDialog open={!!terminate} onOpenChange={(o) => { if (!o) setTerminate(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate contract with {terminate?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the contract as expired. Active courses from this provider will be unenrolled from new cohorts. Existing enrollments will continue until completion. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep contract</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTerminate} className="bg-rose-600 hover:bg-rose-700">
              <Ban className="mr-2 h-4 w-4" /> Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProviderDetail({ provider, onTerminate }: { provider: Provider; onTerminate: () => void }) {
  const ratingTrend = [
    { period: "Q1", rating: provider.rating - 0.3 },
    { period: "Q2", rating: provider.rating - 0.2 },
    { period: "Q3", rating: provider.rating - 0.1 },
    { period: "Q4", rating: provider.rating },
  ];
  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: provider.logoColor }}
          >
            {provider.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
          <div>
            <SheetTitle>{provider.name}</SheetTitle>
            <SheetDescription>{provider.type} · {provider.category}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">{provider.description}</p>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border p-3">
            <p className="text-lg font-semibold">{provider.courses}</p>
            <p className="text-xs text-muted-foreground">Courses</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-lg font-semibold">{provider.trainers}</p>
            <p className="text-xs text-muted-foreground">Trainers</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-lg font-semibold">{formatNumber(provider.learnersTrained)}</p>
            <p className="text-xs text-muted-foreground">Trained</p>
          </div>
        </div>

        <Card className="p-4">
          <CardTitle className="text-sm">Specialties</CardTitle>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {provider.specialties.map((s) => (
              <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <CardTitle className="text-sm">Contract terms</CardTitle>
          <dl className="mt-2 space-y-1.5 text-xs">
            <div className="flex justify-between"><dt className="text-muted-foreground">Start</dt><dd className="font-medium">{formatDate(provider.contractStart)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">End</dt><dd className="font-medium">{formatDate(provider.contractEnd)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Annual pricing</dt><dd className="font-semibold text-brand">{formatCurrency(provider.pricing)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Cost / learner</dt><dd className="font-medium">{formatCurrency(Math.round(provider.pricing / Math.max(1, provider.learnersTrained)))}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={provider.status} /></dd></div>
          </dl>
        </Card>

        <ChartCard title="Rating trend" description="Quarterly trainer rating">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis domain={[3.5, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => toast.success(`Renewal request sent to ${provider.name}`)}>
            <RefreshCw className="mr-1 h-3.5 w-3.5" /> Renew contract
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Provider contact info shared")}>
            Contact
          </Button>
          <Button size="sm" variant="outline" className="text-rose-600" onClick={onTerminate}>
            <AlertTriangle className="mr-1 h-3.5 w-3.5" /> Terminate
          </Button>
        </div>
      </div>
    </>
  );
}

const LOGO_COLORS = [
  { label: "Emerald", value: "oklch(0.55 0.13 165)" },
  { label: "Teal", value: "oklch(0.6 0.14 200)" },
  { label: "Cyan", value: "oklch(0.6 0.13 230)" },
  { label: "Rose", value: "oklch(0.58 0.2 25)" },
  { label: "Amber", value: "oklch(0.6 0.16 70)" },
  { label: "Violet", value: "oklch(0.6 0.13 300)" },
];

function AddProviderForm({ onCancel, onSubmit }: {
  onCancel: () => void;
  onSubmit: (vals: {
    name: string; type: string; category: string; description: string;
    specialties: string; logoColor: string; pricing: number;
    contractStart: string; contractEnd: string;
  }) => void;
}) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [specialties, setSpecialties] = React.useState("");
  const [logoColor, setLogoColor] = React.useState(LOGO_COLORS[0].value);
  const [pricing, setPricing] = React.useState("");
  const [contractStart, setContractStart] = React.useState(new Date().toISOString().slice(0, 10));
  const [contractEnd, setContractEnd] = React.useState(new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10));

  function submit() {
    if (!name.trim() || !type.trim() || !category.trim()) {
      toast.error("Name, type, and category are required");
      return;
    }
    onSubmit({
      name: name.trim(), type: type.trim(), category: category.trim(),
      description: description.trim(), specialties, logoColor,
      pricing: Number(pricing) || 0, contractStart, contractEnd,
    });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="pn">Provider name</Label>
        <Input id="pn" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CloudMaster Pro" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="pt">Type</Label>
          <Input id="pt" value={type} onChange={(e) => setType(e.target.value)} placeholder="Cloud Training Partner" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pc">Category</Label>
          <Input id="pc" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Cloud & DevOps" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pd">Description</Label>
        <Input id="pd" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description…" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ps">Specialties (comma separated)</Label>
        <Input id="ps" value={specialties} onChange={(e) => setSpecialties(e.target.value)} placeholder="AWS, Kubernetes, Azure" />
      </div>
      <div className="space-y-1.5">
        <Label>Logo color</Label>
        <div className="flex flex-wrap gap-2">
          {LOGO_COLORS.map((c) => (
            <button
              key={c.value} type="button"
              onClick={() => setLogoColor(c.value)}
              className={"h-7 w-7 rounded-full border-2 " + (logoColor === c.value ? "border-foreground" : "border-transparent")}
              style={{ background: c.value }}
              aria-label={c.label}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="pp">Annual pricing</Label>
          <Input id="pp" type="number" value={pricing} onChange={(e) => setPricing(e.target.value)} placeholder="450000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cs">Start</Label>
          <Input id="cs" type="date" value={contractStart} onChange={(e) => setContractStart(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ce">End</Label>
          <Input id="ce" type="date" value={contractEnd} onChange={(e) => setContractEnd(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={submit}><Plus className="mr-2 h-4 w-4" /> Add provider</Button>
      </DialogFooter>
    </div>
  );
}
