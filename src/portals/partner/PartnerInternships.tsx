"use client";

import * as React from "react";
import { internships as seedInternships } from "@/lib/partner-data";
import type { Internship } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Briefcase, Plus, Search, Mail, Star, Calendar } from "lucide-react";

export function PartnerInternships() {
  const partner = CURRENT_PARTNER;
  const [internships] = React.useState<Internship[]>(seedInternships);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Internship | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = internships.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (search && !`${i.studentName} ${i.company} ${i.role} ${i.mentor}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const inProgress = internships.filter((i) => i.status === "in_progress").length;
  const completed = internships.filter((i) => i.status === "completed").length;
  const avgStipend = internships.length > 0 ? Math.round(internships.reduce((s, i) => s + i.stipend, 0) / internships.length) : 0;

  function openInternship(i: Internship) { setSelected(i); setSheetOpen(true); }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internships"
        description={`${partner.name} — track and manage student internships across companies and roles.`}
        icon={<Icon name="Briefcase" className="h-6 w-6" />}
        actions={[{ label: "Add Internship", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Internships" value={internships.length} icon={<Briefcase className="h-5 w-5" />} tone="brand" />
        <StatCard label="In Progress" value={inProgress} icon={<Briefcase className="h-5 w-5" />} tone="warning" />
        <StatCard label="Completed" value={completed} icon={<Star className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Stipend" value={formatCurrency(avgStipend)} icon={<Briefcase className="h-5 w-5" />} />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search internships..." className="h-9 w-full pl-8 sm:w-64" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="max-h-[480px] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Stipend</TableHead>
                <TableHead>Mentor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">No internships match your filters.</TableCell></TableRow>
              ) : filtered.map((i) => (
                <TableRow key={i.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openInternship(i)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={i.studentName} size="sm" />
                      <span className="font-medium text-sm">{i.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{i.company}</TableCell>
                  <TableCell className="text-sm">{i.role}</TableCell>
                  <TableCell className="text-xs">{i.duration}</TableCell>
                  <TableCell className="text-xs">{formatDate(i.startDate)}</TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                  <TableCell className="text-right text-sm font-semibold">{formatCurrency(i.stipend)}/mo</TableCell>
                  <TableCell className="text-xs">{i.mentor ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-brand" /> {selected.role}
                </SheetTitle>
                <SheetDescription>{selected.company} · {selected.studentName}</SheetDescription>
              </SheetHeader>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Stipend</p>
                    <p className="mt-1 text-lg font-semibold text-brand">{formatCurrency(selected.stipend)}/mo</p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Duration</p>
                    <p className="mt-1 text-sm font-semibold">{selected.duration}</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Student</p>
                  <p className="text-sm">{selected.studentName}</p>
                  {selected.collegeName && <p className="text-xs text-muted-foreground">{selected.collegeName}</p>}
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Internship Details</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Start Date:</span><span className="font-medium">{formatDate(selected.startDate)}</span></div>
                    {selected.endDate && <div className="flex justify-between"><span className="text-muted-foreground">End Date:</span><span className="font-medium">{formatDate(selected.endDate)}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Mentor:</span><span className="font-medium">{selected.mentor ?? "Not assigned"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><StatusBadge status={selected.status} /></div>
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-row gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.info("Email drafted", { description: `Composing email to ${selected.studentName}` })}><Mail className="mr-1.5 h-3.5 w-3.5" /> Contact</Button>
                <Button size="sm" onClick={() => toast.success("Marked complete", { description: `${selected.studentName}'s internship marked complete.` })}><Star className="mr-1.5 h-3.5 w-3.5" /> Mark Complete</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Internship</DialogTitle>
            <DialogDescription>Record a new student internship.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Internship added", { description: "Student internship recorded." }); setAddOpen(false); }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Student Name *</Label><Input required /></div>
              <div className="space-y-1.5"><Label>Company *</Label><Input required /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Role *</Label><Input required /></div>
              <div className="space-y-1.5"><Label>Duration</Label><Input placeholder="3 months" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label>Stipend (₹/mo)</Label><Input type="number" /></div>
            </div>
            <div className="space-y-1.5"><Label>Mentor</Label><Input /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Add Internship</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
