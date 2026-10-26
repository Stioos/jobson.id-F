"use client";

import * as React from "react";
import { faculty as seedFaculty } from "@/lib/partner-data";
import type { Faculty } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Users, Plus, Search, Mail, Star, Award, BookOpen, GraduationCap, Calendar } from "lucide-react";

export function PartnerFaculty() {
  const partner = CURRENT_PARTNER;
  const [faculty] = React.useState<Faculty[]>(seedFaculty);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [specFilter, setSpecFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Faculty | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const allSpecs = Array.from(new Set(faculty.flatMap((f) => f.specializations)));
  const filtered = faculty.filter((f) => {
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (specFilter !== "all" && !f.specializations.includes(specFilter)) return false;
    if (search && !`${f.name} ${f.email} ${f.qualifications}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = faculty.filter((f) => f.status === "active").length;
  const onLeaveCount = faculty.filter((f) => f.status === "on_leave").length;
  const avgRating = faculty.length > 0 ? (faculty.reduce((s, f) => s + f.rating, 0) / faculty.length).toFixed(1) : "0";
  const totalStudents = faculty.reduce((s, f) => s + f.studentsTaught, 0);

  function openFaculty(f: Faculty) { setSelected(f); setSheetOpen(true); }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty"
        description={`${partner.name} — manage your faculty members, their specializations, courses, and performance.`}
        icon={<Icon name="Users" className="h-6 w-6" />}
        actions={[{ label: "Add Faculty", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Faculty" value={faculty.length} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<Users className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Rating" value={avgRating} icon={<Star className="h-5 w-5" />} tone="warning" hint={`${onLeaveCount} on leave`} />
        <StatCard label="Students Taught" value={totalStudents} icon={<GraduationCap className="h-5 w-5" />} />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search faculty..." className="h-9 w-full pl-8 sm:w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={specFilter} onValueChange={setSpecFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Specialization" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specs</SelectItem>
                {allSpecs.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="max-h-[480px] overflow-y-auto scroll-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specializations</TableHead>
                <TableHead>Qualifications</TableHead>
                <TableHead>Exp.</TableHead>
                <TableHead>Certifications</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">No faculty match your filters.</TableCell></TableRow>
              ) : filtered.map((f) => (
                <TableRow key={f.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openFaculty(f)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarLogo text={f.name} size="sm" />
                      <div>
                        <p className="font-medium text-sm">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground">{f.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {f.specializations.slice(0, 2).map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                      {f.specializations.length > 2 && <span className="text-[10px] text-muted-foreground">+{f.specializations.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs max-w-[180px] truncate">{f.qualifications}</TableCell>
                  <TableCell className="text-sm">{f.experience}y</TableCell>
                  <TableCell className="text-xs">{f.certifications.length}</TableCell>
                  <TableCell className="text-sm">{f.coursesAssigned}</TableCell>
                  <TableCell className="text-sm">{f.studentsTaught}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-sm font-medium">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />{f.rating}
                    </span>
                  </TableCell>
                  <TableCell><StatusBadge status={f.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Faculty detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <AvatarLogo text={selected.name} size="md" /> {selected.name}
                </SheetTitle>
                <SheetDescription>{selected.partnerName} · Joined {formatDate(selected.joinedAt, { year: "numeric", month: "short" })}</SheetDescription>
              </SheetHeader>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Rating</p>
                    <p className="mt-1 text-lg font-semibold flex items-center gap-1"><Star className="h-4 w-4 text-amber-500 fill-amber-500" />{selected.rating}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Experience</p>
                    <p className="mt-1 text-lg font-semibold">{selected.experience} years</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Contact</p>
                  <p className="text-sm">{selected.email}</p>
                  <p className="text-xs text-muted-foreground">{selected.phone}</p>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Qualifications</p>
                  <p className="text-sm">{selected.qualifications}</p>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.specializations.map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs font-semibold">Certifications</p>
                  <div className="space-y-1">
                    {selected.certifications.map((c) => (
                      <div key={c} className="flex items-center gap-2 text-xs">
                        <Award className="h-3.5 w-3.5 text-brand" /> {c}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> Courses</p>
                    <p className="mt-1 text-sm font-semibold">{selected.coursesAssigned}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Students</p>
                    <p className="mt-1 text-sm font-semibold">{selected.studentsTaught}</p>
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-row gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.info("Email drafted", { description: `Composing email to ${selected.email}` })}><Mail className="mr-1.5 h-3.5 w-3.5" /> Email</Button>
                <Button size="sm" onClick={() => toast.success("Schedule opened", { description: "Opening calendar to assign new batch." })}><Calendar className="mr-1.5 h-3.5 w-3.5" /> Assign Course</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Faculty Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Faculty Member</DialogTitle>
            <DialogDescription>Register a new faculty member.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Faculty added", { description: "Welcome aboard!" }); setAddOpen(false); }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Name *</Label><Input required /></div>
              <div className="space-y-1.5"><Label>Email *</Label><Input type="email" required /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Phone</Label><Input /></div>
              <div className="space-y-1.5"><Label>Experience (years)</Label><Input type="number" /></div>
            </div>
            <div className="space-y-1.5"><Label>Qualifications</Label><Input placeholder="e.g. PhD Computer Science, IIT Madras" /></div>
            <div className="space-y-1.5"><Label>Specializations (comma-separated)</Label><Input placeholder="React, Full-Stack, System Design" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Add Faculty</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
