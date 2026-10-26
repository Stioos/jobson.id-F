"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { serviceCatalog } from "@/lib/partner-data";
import type { ServiceCatalogItem } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { Layers, Plus, Search, Edit, Clock, ShieldCheck, Eye } from "lucide-react";

const CATEGORIES = ["Cloud", "DevOps", "Maintenance", "Data", "Design", "Security"];

export function PartnerServiceCatalog() {
  const partner = CURRENT_PARTNER;
  const [list, setList] = React.useState<ServiceCatalogItem[]>(serviceCatalog);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ServiceCatalogItem | null>(null);

  const filtered = list.filter((s) => {
    if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
    if (search && !`${s.name} ${s.description} ${s.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = list.filter((s) => s.active).length;
  const avgPrice = list.length > 0 ? Math.round(list.reduce((s, x) => s + x.standardPrice, 0) / list.length) : 0;
  const premiumCount = list.filter((s) => s.slaLevel === "premium").length;

  function toggleActive(id: string) {
    setList((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
    const s = list.find((x) => x.id === id);
    if (s) toast.success(`Service ${s.active ? "deactivated" : "activated"}`, { description: s.name });
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (editing) {
      const updated: ServiceCatalogItem = {
        ...editing,
        name: fd.get("name") as string,
        category: fd.get("category") as string,
        description: fd.get("description") as string,
        deliveryModel: fd.get("deliveryModel") as ServiceCatalogItem["deliveryModel"],
        standardPrice: Number(fd.get("standardPrice")) || 0,
        slaLevel: fd.get("slaLevel") as ServiceCatalogItem["slaLevel"],
        duration: fd.get("duration") as string,
      };
      setList((prev) => prev.map((s) => (s.id === editing.id ? updated : s)));
      toast.success("Service updated", { description: updated.name });
      setEditing(null);
    } else {
      const newS: ServiceCatalogItem = {
        id: `sc_${Date.now()}`,
        name: fd.get("name") as string,
        category: fd.get("category") as string,
        description: fd.get("description") as string,
        deliveryModel: fd.get("deliveryModel") as ServiceCatalogItem["deliveryModel"],
        standardPrice: Number(fd.get("standardPrice")) || 0,
        slaLevel: fd.get("slaLevel") as ServiceCatalogItem["slaLevel"],
        duration: fd.get("duration") as string,
        active: true,
      };
      setList((prev) => [...prev, newS]);
      setAddOpen(false);
      toast.success("Service added", { description: newS.name });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Catalog"
        description={`${partner.name} — manage your service offerings (SERVICE / TECHNOLOGY / AI models).`}
        icon={<Icon name="Layers" className="h-6 w-6" />}
        actions={[
          { label: "Add Service", icon: "Plus", onClick: () => { setEditing(null); setAddOpen(true); } },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Services" value={list.length} icon={<Layers className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<ShieldCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Price" value={formatCurrency(avgPrice)} icon={<Layers className="h-5 w-5" />} />
        <StatCard label="Premium SLA" value={premiumCount} icon={<ShieldCheck className="h-5 w-5" />} tone="warning" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, category…" className="pl-8" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Layers className="h-5 w-5" />} title="No services found" description="Add a new service offering to populate your catalog." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <Card key={s.id} className={!s.active ? "opacity-70" : ""}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{s.name}</CardTitle>
                  <CardDescription className="mt-1">{s.category} · <span className="uppercase">{s.deliveryModel}</span></CardDescription>
                </div>
                <Switch checked={s.active} onCheckedChange={() => toggleActive(s.id)} />
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{s.description}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border p-2">
                    <p className="text-sm font-semibold text-brand">{formatCurrency(s.standardPrice)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Price</p>
                  </div>
                  <div className="rounded-lg border p-2">
                    <p className="text-sm font-semibold capitalize">{s.slaLevel}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">SLA</p>
                  </div>
                  <div className="rounded-lg border p-2">
                    <p className="text-sm font-semibold">{s.duration}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Duration</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Service details opened")}>
                    <Eye className="h-4 w-4 mr-1.5" /> View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setEditing(s); setAddOpen(true); }}>
                    <Edit className="h-4 w-4 mr-1.5" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
            <DialogDescription>{editing ? "Update the service offering." : "Add a new service to your catalog."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Service Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={editing?.category ?? "Cloud"}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deliveryModel">Delivery Model</Label>
                <Select name="deliveryModel" defaultValue={editing?.deliveryModel ?? "project"}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="retainer">Retainer</SelectItem>
                    <SelectItem value="amc">AMC</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={editing?.description} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="standardPrice">Price (₹)</Label>
                <Input id="standardPrice" name="standardPrice" type="number" min={0} defaultValue={editing?.standardPrice ?? 100000} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slaLevel">SLA Level</Label>
                <Select name="slaLevel" defaultValue={editing?.slaLevel ?? "standard"}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" name="duration" defaultValue={editing?.duration ?? "4 weeks"} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setAddOpen(false); setEditing(null); }}>Cancel</Button>
              <Button type="submit">{editing ? "Save Changes" : "Add Service"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
