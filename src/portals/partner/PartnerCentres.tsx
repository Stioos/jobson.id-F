"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { trainingCentres } from "@/lib/partner-data";
import type { TrainingCentre } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatNumber, formatDate } from "@/lib/format";
import { toast } from "sonner";
import {
  Building2, Plus, MapPin, Users, Star, ShieldCheck, CalendarCheck2, Eye, AlertTriangle,
} from "lucide-react";

export function PartnerCentres() {
  const partner = CURRENT_PARTNER;
  const [centres, setCentres] = React.useState<TrainingCentre[]>(trainingCentres.filter((c) => c.partnerId === partner.id));
  const [selected, setSelected] = React.useState<TrainingCentre | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const totalCapacity = centres.reduce((s, c) => s + c.capacity, 0);
  const totalEnrolled = centres.reduce((s, c) => s + c.studentsEnrolled, 0);
  const avgCompliance = centres.length > 0 ? Math.round(centres.reduce((s, c) => s + c.complianceScore, 0) / centres.length) : 0;
  const avgRating = centres.length > 0 ? (centres.reduce((s, c) => s + c.rating, 0) / centres.length).toFixed(1) : "—";
  const utilization = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  function openCentre(c: TrainingCentre) {
    setSelected(c);
    setSheetOpen(true);
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newC: TrainingCentre = {
      id: `tc_${Date.now()}`,
      partnerId: partner.id,
      partnerName: partner.name,
      name: fd.get("name") as string,
      code: (fd.get("code") as string).toUpperCase(),
      city: fd.get("city") as string,
      state: fd.get("state") as string,
      address: fd.get("address") as string,
      capacity: Number(fd.get("capacity")) || 0,
      classrooms: Number(fd.get("classrooms")) || 0,
      labs: Number(fd.get("labs")) || 0,
      facultyCount: Number(fd.get("faculty")) || 0,
      studentsEnrolled: 0,
      batchesActive: 0,
      rating: 0,
      status: "setup",
      complianceScore: 0,
    };
    setCentres((prev) => [...prev, newC]);
    setAddOpen(false);
    toast.success("Centre added", { description: `${newC.name} — ${newC.city}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Centres"
        description={`${partner.name} — manage your physical training infrastructure (CENTRE model).`}
        icon={<Icon name="Building2" className="h-6 w-6" />}
        actions={[
          { label: "Add Centre", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Centres" value={centres.length} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Capacity" value={formatNumber(totalCapacity)} icon={<Users className="h-5 w-5" />} hint={`${utilization}% utilized`} />
        <StatCard label="Avg Compliance" value={`${avgCompliance}%`} icon={<ShieldCheck className="h-5 w-5" />} tone={avgCompliance >= 85 ? "success" : "warning"} />
        <StatCard label="Avg Rating" value={avgRating} icon={<Star className="h-5 w-5" />} tone="warning" />
      </div>

      {/* Centre cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {centres.map((c) => (
          <Card key={c.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="flex items-start gap-3">
                <AvatarLogo text={c.code} size="lg" />
                <div>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" /> {c.address}
                  </CardDescription>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="rounded-lg border p-2">
                  <p className="text-sm font-semibold">{c.capacity}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Capacity</p>
                </div>
                <div className="rounded-lg border p-2">
                  <p className="text-sm font-semibold">{c.classrooms}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Rooms</p>
                </div>
                <div className="rounded-lg border p-2">
                  <p className="text-sm font-semibold">{c.labs}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Labs</p>
                </div>
                <div className="rounded-lg border p-2">
                  <p className="text-sm font-semibold">{c.facultyCount}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Faculty</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Utilization</span>
                    <span>{c.studentsEnrolled}/{c.capacity}</span>
                  </div>
                  <Progress value={(c.studentsEnrolled / c.capacity) * 100} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Compliance</span>
                    <span>{c.complianceScore}%</span>
                  </div>
                  <Progress value={c.complianceScore} className="h-1.5" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  <Star className="inline h-3 w-3 text-amber-500" /> {c.rating} · {c.batchesActive} active batches
                </span>
                <Button size="sm" variant="outline" onClick={() => openCentre(c)}>
                  <Eye className="h-4 w-4 mr-1.5" /> View details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inspection schedule */}
      <SectionCard title="Upcoming Inspections" description="Scheduled compliance audits">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Centre</TableHead>
              <TableHead>Last Inspection</TableHead>
              <TableHead>Next Due</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centres.map((c) => {
              const last = c.lastInspection ? new Date(c.lastInspection) : null;
              const next = last ? new Date(last.getTime() + 90 * 86400000) : new Date(Date.now() + 30 * 86400000);
              const days = Math.ceil((next.getTime() - Date.now()) / 86400000);
              const overdue = days < 0;
              const urgent = days >= 0 && days <= 30;
              return (
                <TableRow key={c.id} className="cursor-pointer hover:bg-brand/5" onClick={() => openCentre(c)}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-sm">{c.lastInspection ? formatDate(c.lastInspection) : "—"}</TableCell>
                  <TableCell className="text-sm">{formatDate(next.toISOString())}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={c.complianceScore} className="h-1.5 w-12" />
                      <span className="text-xs">{c.complianceScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {overdue ? (
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">{Math.abs(days)}d overdue</span>
                    ) : urgent ? (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{days}d left</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{days}d left</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      {/* Detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>{selected.code} · {selected.city}, {selected.state}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="text-sm font-semibold">{selected.capacity}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Enrolled</p>
                    <p className="text-sm font-semibold">{selected.studentsEnrolled} ({Math.round((selected.studentsEnrolled / selected.capacity) * 100)}%)</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Classrooms</p>
                    <p className="text-sm font-semibold">{selected.classrooms}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Labs</p>
                    <p className="text-sm font-semibold">{selected.labs}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Faculty</p>
                    <p className="text-sm font-semibold">{selected.facultyCount}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Active Batches</p>
                    <p className="text-sm font-semibold">{selected.batchesActive}</p>
                  </div>
                </div>

                <SectionCard title="Compliance & Inspection">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Compliance Score</span>
                        <span>{selected.complianceScore}%</span>
                      </div>
                      <Progress value={selected.complianceScore} className="h-2" />
                    </div>
                    <div className="rounded-lg border p-3 text-sm">
                      <p className="flex items-center gap-2"><CalendarCheck2 className="h-4 w-4 text-muted-foreground" /> Last Inspection: {selected.lastInspection ? formatDate(selected.lastInspection) : "—"}</p>
                      <p className="flex items-center gap-2 mt-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Next inspection due in ~90 days</p>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Inspection History" description="Past audits">
                  <ul className="space-y-2">
                    <li className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Standard Audit</p>
                        <StatusBadge status="success" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{selected.lastInspection ? formatDate(selected.lastInspection) : "—"} · Score: {selected.complianceScore}%</p>
                    </li>
                    <li className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Infrastructure Check</p>
                        <StatusBadge status="success" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{selected.lastInspection ? formatDate(new Date(new Date(selected.lastInspection).getTime() - 90 * 86400000).toISOString()) : "—"} · Score: 91%</p>
                    </li>
                  </ul>
                </SectionCard>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Inspection scheduled", { description: `${selected.name} — next available slot` })}>Schedule Inspection</Button>
                  <Button className="flex-1" onClick={() => toast.success("Edit form opened")}>Edit</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add centre dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Training Centre</DialogTitle>
            <DialogDescription>Register a new physical training location.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Centre Name</Label>
                <Input id="name" name="name" required placeholder="Anna Nagar Branch" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <Input id="code" name="code" required placeholder="CTA-ANN" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required placeholder="Chennai" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required placeholder="Tamil Nadu" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" rows={2} required placeholder="Full postal address" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" min={0} defaultValue={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="classrooms">Rooms</Label>
                <Input id="classrooms" name="classrooms" type="number" min={0} defaultValue={3} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="labs">Labs</Label>
                <Input id="labs" name="labs" type="number" min={0} defaultValue={1} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="faculty">Faculty</Label>
                <Input id="faculty" name="faculty" type="number" min={0} defaultValue={6} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Add Centre</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
