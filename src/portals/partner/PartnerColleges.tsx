"use client";

import * as React from "react";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { colleges, collegePartnershipModels } from "@/lib/partner-data";
import type { College } from "@/lib/partner-types";
import { PageHeader, StatCard, SectionCard, StatusBadge, EmptyState, Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatNumber, formatDate } from "@/lib/format";
import { toast } from "sonner";
import {
  GraduationCap, Plus, MapPin, Users, Award, Briefcase, Eye, ArrowRight, FileSignature, Calendar, Building2,
} from "lucide-react";

export function PartnerColleges() {
  const partner = CURRENT_PARTNER;
  // Show all colleges (the user is operating the partner portal — they manage college partnerships)
  const [collegeList, setCollegeList] = React.useState<College[]>(colleges);
  const [selected, setSelected] = React.useState<College | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const totalStudents = collegeList.reduce((s, c) => s + c.totalStudents, 0);
  const totalEnrolled = collegeList.reduce((s, c) => s + c.studentsEnrolled, 0);
  const signedCount = collegeList.filter((c) => c.mouStatus === "signed" || c.mouStatus === "renewed").length;
  const totalPlacements = collegeList.reduce((s, c) => s + c.placements, 0);

  function openCollege(c: College) {
    setSelected(c);
    setSheetOpen(true);
  }

  function updateMou(c: College, status: College["mouStatus"]) {
    setCollegeList((prev) => prev.map((p) => (p.id === c.id ? { ...p, mouStatus: status, mouSignedAt: status === "signed" ? new Date().toISOString() : p.mouSignedAt } : p)));
    if (selected?.id === c.id) setSelected({ ...c, mouStatus: status, mouSignedAt: status === "signed" ? new Date().toISOString() : c.mouSignedAt });
    toast.success(`MoU ${status}`, { description: `${c.name} → ${status}` });
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newC: College = {
      id: `col_${Date.now()}`,
      partnerId: partner.id,
      partnerName: partner.name,
      name: fd.get("name") as string,
      code: (fd.get("code") as string).toUpperCase(),
      institutionType: fd.get("institutionType") as College["institutionType"],
      affiliation: fd.get("affiliation") as College["affiliation"],
      fundingType: "PRIVATE",
      establishedYear: Number(fd.get("establishedYear")) || 2000,
      city: fd.get("city") as string,
      state: fd.get("state") as string,
      totalStudents: Number(fd.get("totalStudents")) || 0,
      totalFaculty: Number(fd.get("totalFaculty")) || 0,
      hasPlacementCell: true,
      hasTrainingCell: false,
      accreditation: "NAAC A",
      partnershipModel: fd.get("partnershipModel") as College["partnershipModel"],
      mouStatus: "draft",
      programsMapped: 0,
      studentsEnrolled: 0,
      placements: 0,
      placementRate: 0,
      status: "onboarding",
    };
    setCollegeList((prev) => [...prev, newC]);
    setAddOpen(false);
    toast.success("College added", { description: `${newC.name} — ${newC.city}` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="College Partnerships"
        description={`${partner.name} — manage college MoUs, programs mapped, and placement outcomes.`}
        icon={<Icon name="GraduationCap" className="h-6 w-6" />}
        actions={[
          { label: "Add College", icon: "Plus", onClick: () => setAddOpen(true) },
        ]}
      />

      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Colleges" value={collegeList.length} icon={<Building2 className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Students" value={formatNumber(totalStudents)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="MoUs Signed" value={signedCount} icon={<FileSignature className="h-5 w-5" />} tone="success" />
        <StatCard label="Placements" value={formatNumber(totalPlacements)} icon={<Briefcase className="h-5 w-5" />} tone="warning" />
      </div>

      <Tabs defaultValue="colleges">
        <TabsList>
          <TabsTrigger value="colleges">Colleges</TabsTrigger>
          <TabsTrigger value="models">Partnership Models (A–E)</TabsTrigger>
        </TabsList>

        <TabsContent value="colleges" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>College</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Affiliation</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>MoU Status</TableHead>
                      <TableHead>Programs</TableHead>
                      <TableHead>Placements</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collegeList.map((c) => (
                      <TableRow key={c.id} className="cursor-pointer hover:bg-brand/5" onClick={() => openCollege(c)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AvatarLogo text={c.name} size="sm" />
                            <div>
                              <p className="font-medium">{c.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{c.code}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><span className="text-xs">{c.institutionType.toLowerCase()}</span></TableCell>
                        <TableCell><span className="text-xs">{c.affiliation.toLowerCase().replace(/_/g, " ")}</span></TableCell>
                        <TableCell className="text-sm">{c.city}</TableCell>
                        <TableCell className="text-sm">{formatNumber(c.totalStudents)}</TableCell>
                        <TableCell><span className="rounded-md border px-2 py-0.5 text-xs font-semibold">Model {c.partnershipModel}</span></TableCell>
                        <TableCell><StatusBadge status={c.mouStatus} /></TableCell>
                        <TableCell className="text-sm">{c.programsMapped}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{c.placements}</span>
                            <span className="text-xs text-muted-foreground">{c.placementRate}% rate</span>
                          </div>
                        </TableCell>
                        <TableCell><ArrowRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {collegePartnershipModels.map((m) => (
              <Card key={m.id}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">Model {m.id}</span>
                    {m.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border p-2">
                      <p className="font-medium text-muted-foreground uppercase">jobson.id Scope</p>
                      <ul className="mt-1 space-y-0.5">
                        {m.jobsonIdScope.map((s) => <li key={s}>• {s}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-lg border p-2">
                      <p className="font-medium text-muted-foreground uppercase">College Scope</p>
                      <ul className="mt-1 space-y-0.5">
                        {m.collegeScope.map((s) => <li key={s}>• {s}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-lg bg-brand/5 border border-brand/20 p-2 text-xs">
                    <p><span className="font-medium">Revenue Model:</span> {m.revenueModel}</p>
                    <p><span className="font-medium">Ideal for:</span> {m.idealFor}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium capitalize">{selected.institutionType.toLowerCase()}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Affiliation</p>
                    <p className="text-sm font-medium capitalize">{selected.affiliation.toLowerCase().replace(/_/g, " ")}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Established</p>
                    <p className="text-sm font-medium">{selected.establishedYear}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Accreditation</p>
                    <p className="text-sm font-medium">{selected.accreditation}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Total Students</p>
                    <p className="text-sm font-medium">{formatNumber(selected.totalStudents)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Total Faculty</p>
                    <p className="text-sm font-medium">{selected.totalFaculty}</p>
                  </div>
                </div>

                <SectionCard title="Partnership & MoU">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border p-2">
                        <p className="text-xs text-muted-foreground">Model</p>
                        <p className="text-sm font-semibold">Model {selected.partnershipModel}</p>
                      </div>
                      <div className="rounded-lg border p-2">
                        <p className="text-xs text-muted-foreground">MoU Status</p>
                        <StatusBadge status={selected.mouStatus} />
                      </div>
                    </div>
                    {selected.mouSignedAt && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> Signed on {formatDate(selected.mouSignedAt)}
                        {selected.mouExpiresAt && ` · Expires ${formatDate(selected.mouExpiresAt)}`}
                      </p>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Programs & Outcomes">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Programs Mapped</span><span className="font-medium">{selected.programsMapped}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Students Enrolled</span><span className="font-medium">{formatNumber(selected.studentsEnrolled)}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Placements</span><span className="font-medium">{selected.placements}</span></div>
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Placement Rate</span>
                        <span>{selected.placementRate}%</span>
                      </div>
                      <Progress value={selected.placementRate} className="h-2" />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="MoU Management" description="Lifecycle actions">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateMou(selected, "draft")}>Draft</Button>
                    <Button size="sm" variant="outline" onClick={() => updateMou(selected, "sent")}>Send</Button>
                    <Button size="sm" onClick={() => updateMou(selected, "signed")}><FileSignature className="h-4 w-4 mr-1.5" /> Sign</Button>
                    <Button size="sm" variant="outline" onClick={() => updateMou(selected, "renewed")}>Renew</Button>
                  </div>
                </SectionCard>

                <SheetFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Programs mapping opened")}>Map Programs</Button>
                  <Button className="flex-1" onClick={() => toast.success("Edit form opened")}>Edit</Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add college dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add College</DialogTitle>
            <DialogDescription>Register a new college partnership.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">College Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <Input id="code" name="code" required placeholder="ABC-001" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="institutionType">Type</Label>
                <Select name="institutionType" defaultValue="COLLEGE">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COLLEGE">College</SelectItem>
                    <SelectItem value="UNIVERSITY">University</SelectItem>
                    <SelectItem value="INSTITUTE">Institute</SelectItem>
                    <SelectItem value="POLYTECHNIC">Polytechnic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="affiliation">Affiliation</Label>
                <Select name="affiliation" defaultValue="AFFILIATED">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AFFILIATED">Affiliated</SelectItem>
                    <SelectItem value="AUTONOMOUS">Autonomous</SelectItem>
                    <SelectItem value="DEEMED">Deemed</SelectItem>
                    <SelectItem value="STATE_PRIVATE">State Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="establishedYear">Established</Label>
                <Input id="establishedYear" name="establishedYear" type="number" defaultValue={2005} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="totalStudents">Total Students</Label>
                <Input id="totalStudents" name="totalStudents" type="number" defaultValue={3000} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="totalFaculty">Total Faculty</Label>
                <Input id="totalFaculty" name="totalFaculty" type="number" defaultValue={150} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="partnershipModel">Partnership Model</Label>
              <Select name="partnershipModel" defaultValue="A">
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Model A — Curriculum Integration</SelectItem>
                  <SelectItem value="B">Model B — Co-branded Centre</SelectItem>
                  <SelectItem value="C">Model C — Faculty Development</SelectItem>
                  <SelectItem value="D">Model D — Placement Partnership</SelectItem>
                  <SelectItem value="E">Model E — Full Campus MoU</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Add College</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
