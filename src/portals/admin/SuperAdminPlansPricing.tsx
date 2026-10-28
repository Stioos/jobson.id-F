"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface Plan {
  id: string; name: string; portals: string[]; price: number; interval: string; features: string[]; active: boolean; subscribers: number;
}

const PLANS: Plan[] = [
  { id: "pl_001", name: "Free", portals: ["candidate"], price: 0, interval: "month", features: ["5 applications/mo", "Basic profile", "Community access"], active: true, subscribers: 18_400 },
  { id: "pl_002", name: "Starter", portals: ["candidate", "employer"], price: 499, interval: "month", features: ["Unlimited applications", "Profile booster", "Resume builder", "Job alerts"], active: true, subscribers: 1_240 },
  { id: "pl_003", name: "Professional", portals: ["employer", "recruiter", "training"], price: 4_999, interval: "month", features: ["Up to 25 job slots", "AI match scoring", "Analytics dashboard", "Priority support"], active: true, subscribers: 318 },
  { id: "pl_004", name: "Business", portals: ["employer", "recruiter", "partner"], price: 14_999, interval: "month", features: ["100 job slots", "Team collaboration", "Custom workflows", "API access", "Dedicated CSM"], active: true, subscribers: 84 },
  { id: "pl_005", name: "Enterprise", portals: ["employer", "recruiter", "partner", "training"], price: 49_999, interval: "month", features: ["Unlimited slots", "SSO + SCIM", "Custom integrations", "SLA + 99.99% uptime", "On-prem option", "White-glove onboarding"], active: true, subscribers: 12 },
  { id: "pl_006", name: "Legacy (Deprecated)", portals: ["candidate"], price: 99, interval: "month", features: ["Legacy plan", "Limited features"], active: false, subscribers: 4 },
];

export function SuperAdminPlansPricing() {
  const [plans, setPlans] = React.useState(PLANS);
  const [newName, setNewName] = React.useState("");
  const [newPrice, setNewPrice] = React.useState("");

  const togglePlan = (id: string) => {
    setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const p = plans.find(x => x.id === id);
    toast.success(`${p?.name} ${p?.active ? "deactivated" : "activated"}`);
  };

  const addPlan = () => {
    if (!newName) { toast.error("Plan name required"); return; }
    const p: Plan = { id: `pl_${Date.now()}`, name: newName, portals: ["candidate"], price: Number(newPrice) || 0, interval: "month", features: ["Custom feature set"], active: true, subscribers: 0 };
    setPlans([p, ...plans]);
    setNewName(""); setNewPrice("");
    toast.success("Plan created");
  };

  const totalSubs = plans.reduce((s, p) => s + p.subscribers, 0);
  const mrr = plans.reduce((s, p) => s + p.price * p.subscribers, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plans & Pricing"
        description="Manage plan tiers across portals — pricing, features, and active status."
        icon={<Icon name="Tag" className="h-6 w-6" />}
        actions={[{ label: "Export Plans", variant: "outline", onClick: () => toast.success("Plans exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Plans" value={plans.length} icon={<Icon name="Tag" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={plans.filter(p => p.active).length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Subscribers" value={totalSubs.toLocaleString("en-IN")} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="MRR" value={formatCurrency(mrr)} icon={<Icon name="Banknote" className="h-5 w-5" />} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Create Plan" description="Define a new tier" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Plan name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Premium" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Price (₹/month)</Label>
              <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="999" className="mt-1" />
            </div>
            <Button className="w-full" onClick={addPlan}><Icon name="Plus" className="mr-1 h-4 w-4" /> Create Plan</Button>
          </div>
        </SectionCard>

        <SectionCard title="Plan Registry" description={`${plans.length} plans`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Portals</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Subs</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.features.length} features</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.portals.map(po => <Badge key={po} variant="outline" className="text-[10px]">{po}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{p.price === 0 ? "Free" : formatCurrency(p.price)}</TableCell>
                  <TableCell>{p.subscribers.toLocaleString("en-IN")}</TableCell>
                  <TableCell>{formatCurrency(p.price * p.subscribers)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={p.active} onCheckedChange={() => togglePlan(p.id)} />
                      <Badge variant={p.active ? "default" : "secondary"} className={p.active ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : ""}>
                        {p.active ? "ON" : "OFF"}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
}
