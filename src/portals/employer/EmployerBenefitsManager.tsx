"use client";

import * as React from "react";
import { PageHeader, SectionCard, Card, CardContent, StatCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Gift, Plus, Heart, Wallet, Sparkles, CalendarOff, Car, CheckCircle2, Eye, Pencil,
} from "lucide-react";

type Category = "Health" | "Financial" | "Perks" | "Leave" | "Parking";

interface Benefit {
  id: string;
  name: string;
  category: Category;
  description: string;
  value: string;
  eligibility: string;
  active: boolean;
}

const CATEGORY_META: Record<Category, { icon: typeof Heart; color: string; bg: string }> = {
  Health: { icon: Heart, color: "text-rose-600", bg: "bg-rose-500/10" },
  Financial: { icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  Perks: { icon: Sparkles, color: "text-amber-600", bg: "bg-amber-500/10" },
  Leave: { icon: CalendarOff, color: "text-violet-600", bg: "bg-violet-500/10" },
  Parking: { icon: Car, color: "text-cyan-600", bg: "bg-cyan-500/10" },
};

const INITIAL_BENEFITS: Benefit[] = [
  { id: "b1", name: "Comprehensive Health Insurance", category: "Health", description: "Family-floater coverage up to ₹10L with cashless hospitalization at 8,000+ hospitals.", value: "₹10L coverage", eligibility: "All full-time employees + family", active: true },
  { id: "b2", name: "Learning & Development Budget", category: "Financial", description: "Annual reimbursement for courses, certifications, conferences and books.", value: "₹50,000/yr", eligibility: "All employees after probation", active: true },
  { id: "b3", name: "Hybrid Work Arrangement", category: "Perks", description: "Choose any 3 days from office or work fully remote with manager approval.", value: "Flexible", eligibility: "All employees", active: true },
  { id: "b4", name: "Employee Stock Options", category: "Financial", description: "ESOPs granted on joining with 4-year vesting and 1-year cliff.", value: "Equity", eligibility: "All full-time employees", active: true },
  { id: "b5", name: "Parental Leave", category: "Leave", description: "Paid leave for new parents — primary caregivers get 26 weeks, secondary 12 weeks.", value: "26 weeks", eligibility: "All employees (1yr+ tenure)", active: true },
  { id: "b6", name: "Wellness Program", category: "Health", description: "On-site gym, yoga sessions, mental health counseling and quarterly health checkups.", value: "Included", eligibility: "On-site & hybrid employees", active: false },
  { id: "b7", name: "Paid Sabbatical", category: "Leave", description: "After 5 years of continuous service, take a 4-week paid sabbatical to recharge.", value: "4 weeks", eligibility: "5+ years tenure", active: false },
  { id: "b8", name: "Reserved Office Parking", category: "Parking", description: "Dedicated covered parking spot at the Bengaluru and Hyderabad offices.", value: "Free", eligibility: "Bengaluru & Hyderabad staff", active: true },
];

export function EmployerBenefitsManager() {
  const [benefits, setBenefits] = React.useState<Benefit[]>(INITIAL_BENEFITS);
  const [form, setForm] = React.useState({ name: "", category: "" as Category | "", description: "", value: "", eligibility: "" });

  const counts = React.useMemo(() => {
    const map: Record<Category, number> = { Health: 0, Financial: 0, Perks: 0, Leave: 0, Parking: 0 };
    benefits.forEach((b) => { map[b.category]++; });
    return map;
  }, [benefits]);

  const activeCount = benefits.filter((b) => b.active).length;

  const toggle = (id: string) => {
    setBenefits((arr) => arr.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
    const b = benefits.find((x) => x.id === id);
    if (b) toast.success(`Benefit ${b.active ? "disabled" : "enabled"}`, { description: b.name });
  };

  const addBenefit = () => {
    if (!form.name.trim() || !form.category || !form.value.trim()) {
      toast.error("Please fill name, category and value");
      return;
    }
    const newB: Benefit = {
      id: `b_${Date.now()}`,
      name: form.name.trim(),
      category: form.category as Category,
      description: form.description.trim() || "—",
      value: form.value.trim(),
      eligibility: form.eligibility.trim() || "All employees",
      active: true,
    };
    setBenefits((arr) => [newB, ...arr]);
    toast.success("Benefit added", { description: `${newB.name} is now visible to candidates.` });
    setForm({ name: "", category: "", description: "", value: "", eligibility: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Benefits Manager"
        description="Curate the benefits candidates see on your company profile"
        icon={<Gift className="h-6 w-6" />}
        actions={[
          { label: "Preview as candidate", variant: "outline", onClick: () => toast.info("Scroll to preview section below") },
        ]}
      />

      {/* Category summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
          const M = CATEGORY_META[cat];
          const IconC = M.icon;
          return (
            <Card key={cat}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${M.bg} ${M.color}`}>
                  <IconC className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{cat}</p>
                  <p className="text-2xl font-semibold">{counts[cat]}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total benefits" value={benefits.length} icon={<Gift className="h-5 w-5" />} />
        <StatCard label="Active (visible)" value={activeCount} tone="success" icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Categories covered" value={`${Object.values(counts).filter((c) => c > 0).length} / 5`} tone="brand" icon={<Sparkles className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active benefits table */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Active benefits"
            description={`${activeCount} of ${benefits.length} visible to candidates`}
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Benefit</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Value</TableHead>
                    <TableHead className="hidden lg:table-cell">Eligibility</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benefits.map((b) => {
                    const M = CATEGORY_META[b.category];
                    const IconC = M.icon;
                    return (
                      <TableRow key={b.id} className={!b.active ? "opacity-60" : ""}>
                        <TableCell>
                          <div className="flex items-start gap-2">
                            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded ${M.bg} ${M.color}`}><IconC className="h-3.5 w-3.5" /></div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{b.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{b.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className={`${M.bg} ${M.color} border-transparent`}>{b.category}</Badge></TableCell>
                        <TableCell className="hidden md:table-cell text-sm font-medium">{b.value}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{b.eligibility}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Switch checked={b.active} onCheckedChange={() => toggle(b.id)} aria-label={`Toggle ${b.name}`} />
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.info(`Edit benefit: ${b.name}`)}><Pencil className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {benefits.length === 0 && (
              <EmptyState icon={<Gift className="h-5 w-5" />} title="No benefits yet" description="Add benefits using the form on the right." />
            )}
          </SectionCard>
        </div>

        {/* Add benefit form */}
        <div>
          <SectionCard title="Add benefit" description="New benefits appear instantly to candidates">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="b-name">Benefit name</Label>
                <Input id="b-name" placeholder="e.g. Gym membership" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category || undefined} onValueChange={(v) => setForm((f) => ({ ...f, category: v as Category }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-value">Value</Label>
                <Input id="b-value" placeholder="e.g. ₹2,000/mo" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-desc">Description</Label>
                <Textarea id="b-desc" rows={3} placeholder="Short description candidates will see" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-elig">Eligibility</Label>
                <Input id="b-elig" placeholder="e.g. All employees after probation" value={form.eligibility} onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))} />
              </div>
              <Button className="w-full" onClick={addBenefit}><Plus className="mr-2 h-4 w-4" /> Add benefit</Button>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Candidate preview */}
      <SectionCard title="Candidate preview" description="How your benefits appear on the public company profile">
        <Tabs defaultValue="grid">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="grid" className="gap-1.5"><Eye className="h-3.5 w-3.5" /> Card view</TabsTrigger>
              <TabsTrigger value="list" className="gap-1.5"><Gift className="h-3.5 w-3.5" /> List view</TabsTrigger>
            </TabsList>
            <p className="text-xs text-muted-foreground">{activeCount} benefits shown</p>
          </div>
          <TabsContent value="grid" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.filter((b) => b.active).map((b) => {
                const M = CATEGORY_META[b.category];
                const IconC = M.icon;
                return (
                  <Card key={b.id} className="hover:-translate-y-0.5 hover:border-brand hover:shadow-md transition-all">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${M.bg} ${M.color}`}><IconC className="h-4 w-4" /></div>
                        <Badge variant="outline" className={`${M.bg} ${M.color} border-transparent`}>{b.category}</Badge>
                      </div>
                      <p className="text-sm font-semibold">{b.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{b.description}</p>
                      <div className="flex items-center justify-between pt-1 border-t">
                        <span className="text-xs text-muted-foreground">Value</span>
                        <span className="text-sm font-medium text-brand">{b.value}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {benefits.filter((b) => b.active).length === 0 && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <EmptyState icon={<Gift className="h-5 w-5" />} title="No active benefits" description="Enable benefits above to show them to candidates." />
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-4">
            <div className="rounded-md border divide-y">
              {benefits.filter((b) => b.active).map((b) => {
                const M = CATEGORY_META[b.category];
                const IconC = M.icon;
                return (
                  <div key={b.id} className="flex items-start gap-3 p-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${M.bg} ${M.color}`}><IconC className="h-4 w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{b.name}</p>
                        <Badge variant="outline" className={`${M.bg} ${M.color} border-transparent text-[10px]`}>{b.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{b.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground"><span className="font-medium text-brand">{b.value}</span> · {b.eligibility}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </SectionCard>
    </div>
  );
}
