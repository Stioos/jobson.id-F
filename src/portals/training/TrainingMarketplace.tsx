"use client";

import * as React from "react";
import { trainingCourses, corporateClients } from "@/lib/lms-data";
import type { TrainingCourse } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { formatCurrency, formatNumber } from "@/lib/format";
import { ThumbnailIcon, TenantDisclaimer, durationLabel } from "./_shared";
import { toast } from "sonner";
import { ShoppingBag, Star, Users, TrendingUp, Plus, Search, Crown } from "lucide-react";

export function TrainingMarketplace() {
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("popular");
  const [addOpen, setAddOpen] = React.useState<TrainingCourse | null>(null);
  const [selectedClient, setSelectedClient] = React.useState(corporateClients[0]?.id ?? "");

  const published = trainingCourses.filter((c) => c.status === "published" && c.visibility !== "private");

  const filtered = published.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tags.some((t) => t.includes(search.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "popular") return b.enrollments - a.enrollments;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    return 0;
  });

  const featured = [...published].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const totalRevenue = published.reduce((s, c) => s + c.enrollments * c.price, 0);
  const avgPrice = published.length > 0 ? Math.round(published.reduce((s, c) => s + c.price, 0) / published.length) : 0;

  function addToCatalog() {
    if (!addOpen) return;
    const client = corporateClients.find((c) => c.id === selectedClient);
    toast.success(`Added to ${client?.name} catalog`, { description: `${addOpen.name} is now available for purchase.` });
    setAddOpen(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Course Marketplace"
        description="Offer published courses to corporate clients — bundled or à la carte."
        icon={<Icon name="ShoppingBag" className="h-6 w-6" />}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Courses Listed" value={published.length} icon={<ShoppingBag className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Revenue Potential" value={formatCurrency(totalRevenue)} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Price" value={formatCurrency(avgPrice)} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard label="Total Enrolled" value={formatNumber(published.reduce((s, c) => s + c.enrollments, 0))} icon={<Users className="h-5 w-5" />} />
      </div>

      {/* Featured */}
      <SectionCard title="Featured Courses" description="Top-rated by learners">
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setAddOpen(c)}
              className="text-left rounded-xl border bg-gradient-to-br from-brand/5 to-card p-4 hover:border-brand/40 hover:shadow-md transition-all relative"
            >
              {i === 0 && <Badge className="absolute -top-2 -right-2"><Crown className="h-3 w-3 mr-1" />Top Rated</Badge>}
              <div className="flex items-start gap-3">
                <ThumbnailIcon color={c.thumbnailColor} icon={c.thumbnailIcon} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold leading-tight line-clamp-2">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.instructorName}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-semibold">{c.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({c.ratingCount})</span>
                </div>
                <span className="font-bold text-brand">{formatCurrency(c.price)}</span>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* All courses */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search marketplace..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="rating">Top rated</SelectItem>
            <SelectItem value="price-low">Price: low to high</SelectItem>
            <SelectItem value="price-high">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={<ShoppingBag className="h-5 w-5" />} title="No courses found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-4 hover:border-brand/40 hover:shadow-md transition-all flex flex-col">
              <div className="flex items-start gap-3">
                <ThumbnailIcon color={c.thumbnailColor} icon={c.thumbnailIcon} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold leading-tight line-clamp-2">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.instructorName}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground line-clamp-2 flex-1">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                <Badge variant="outline" className="text-[10px] capitalize">{c.difficulty}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-xs">
                <div className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{c.rating.toFixed(1)}</div>
                <div className="flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" />{formatNumber(c.enrollments)}</div>
                <div className="flex items-center gap-1 text-muted-foreground">{durationLabel(c.durationMinutes)}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-brand">{formatCurrency(c.price)}</span>
                <Button size="sm" onClick={() => setAddOpen(c)}>
                  <Plus className="mr-1 h-3 w-3" />Add to client
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add to client catalog dialog */}
      <Dialog open={!!addOpen} onOpenChange={(o) => !o && setAddOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Client Catalog</DialogTitle>
            <DialogDescription>
              {addOpen && <>Make <span className="font-medium">{addOpen.name}</span> available for purchase by a corporate client.</>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select client</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{corporateClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {addOpen && (
              <div className="rounded-lg border p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-lg font-bold text-brand">{formatCurrency(addOpen.price)}</p>
                <p className="text-xs text-muted-foreground mt-1">Revenue potential per enrollment × current {formatNumber(addOpen.enrollments)} enrolled across all clients</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={addToCatalog}>Add to catalog</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
