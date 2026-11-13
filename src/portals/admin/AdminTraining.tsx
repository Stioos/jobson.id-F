"use client";

import * as React from "react";
import { PageHeader, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { trainingCourses, certifications } from "@/lib/mock-data";
import type { TrainingCourse, Certification } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { toast } from "sonner";
import { CHART_COLORS, ChartCard, ChartTooltip } from "./_shared";

type CourseRow = TrainingCourse & { enabled: boolean };
type CertRow = Certification & { enabled: boolean };

export function AdminTraining() {
  const [courses, setCourses] = React.useState<CourseRow[]>(() => trainingCourses.map((c) => ({ ...c, enabled: true })));
  const [certs, setCerts] = React.useState<CertRow[]>(() => certifications.map((c) => ({ ...c, enabled: true })));
  const [courseOpen, setCourseOpen] = React.useState(false);
  const [certOpen, setCertOpen] = React.useState(false);

  const totalRevenue = courses.reduce((s, c) => s + c.enrolledCount * c.price, 0);
  const totalEnrolled = courses.reduce((s, c) => s + c.enrolledCount, 0);
  const enrollmentByCategory = Object.entries(
    courses.reduce<Record<string, number>>((acc, c) => {
      acc[c.category] = (acc[c.category] ?? 0) + c.enrolledCount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Training & Certifications"
        description="Manage courses, certifications, enrollment, and training revenue."
        icon={<Icon name="GraduationCap" className="h-6 w-6" />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Courses" value={courses.length} icon="BookOpen" />
        <MiniStat label="Certifications" value={certs.length} icon="Award" />
        <MiniStat label="Total enrolled" value={formatNumber(totalEnrolled)} icon="Users" />
        <MiniStat label="Training revenue" value={formatCurrency(totalRevenue)} icon="Banknote" />
      </div>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="certs">Certifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4 mt-4">
          <SectionCard title={`Courses (${courses.length})`} action={<Button size="sm" onClick={() => setCourseOpen(true)}>Add course</Button>}>
            <div className="max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{c.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[16rem]">{c.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{c.provider}</TableCell>
                      <TableCell><Badge variant="secondary">{c.category}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{c.level}</Badge></TableCell>
                      <TableCell className="text-sm">{c.durationHours}h</TableCell>
                      <TableCell className="text-sm">{formatNumber(c.enrolledCount)}</TableCell>
                      <TableCell className="text-sm">{formatCurrency(c.price, c.currency)}</TableCell>
                      <TableCell className="text-sm">{c.rating} ★</TableCell>
                      <TableCell><Switch checked={c.enabled} onCheckedChange={(v) => { setCourses((p) => p.map((x) => (x.id === c.id ? { ...x, enabled: v } : x))); toast.success(`${c.title} ${v ? "enabled" : "disabled"}`); }} /></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => toast.info("Edit course (demo)")}>Edit</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="certs" className="space-y-4 mt-4">
          <SectionCard title={`Certifications (${certs.length})`} action={<Button size="sm" onClick={() => setCertOpen(true)}>Add certification</Button>}>
            <div className="max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Issuer</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Skill level</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certs.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-sm font-medium">{c.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.issuer}</TableCell>
                      <TableCell><Badge variant="secondary">{c.category}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{c.skillLevel}</Badge></TableCell>
                      <TableCell className="text-sm">{c.validityMonths ? `${c.validityMonths} months` : "—"}</TableCell>
                      <TableCell><Switch checked={c.enabled} onCheckedChange={(v) => { setCerts((p) => p.map((x) => (x.id === c.id ? { ...x, enabled: v } : x))); toast.success(`${c.name} ${v ? "enabled" : "disabled"}`); }} /></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => toast.info("Edit certification (demo)")}>Edit</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Enrollment by category" description="Where learners are spending time">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentByCategory} margin={{ left: -16, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" name="Enrolled" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <SectionCard title="Top courses by revenue" description="Highest-grossing courses (30d).">
              <ul className="space-y-2 text-sm">
                {[...courses].sort((a, b) => b.enrolledCount * b.price - a.enrolledCount * a.price).slice(0, 5).map((c, i) => (
                  <li key={c.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span className="flex items-center gap-2"><Badge variant="outline">{i + 1}</Badge><span className="truncate">{c.title}</span></span>
                    <span className="font-medium">{formatCurrency(c.enrolledCount * c.price, c.currency)}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>

      <AddCourseDialog open={courseOpen} onOpenChange={setCourseOpen} onAdd={(c) => {
        setCourses((p) => [{ ...c, enabled: true }, ...p]);
        toast.success("Course added");
        setCourseOpen(false);
      }} />
      <AddCertDialog open={certOpen} onOpenChange={setCertOpen} onAdd={(c) => {
        setCerts((p) => [{ ...c, enabled: true }, ...p]);
        toast.success("Certification added");
        setCertOpen(false);
      }} />
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <Icon name={icon} className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function AddCourseDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (c: TrainingCourse) => void }) {
  const [title, setTitle] = React.useState("");
  const [provider, setProvider] = React.useState("");
  const [category, setCategory] = React.useState("Engineering");
  const [level, setLevel] = React.useState<TrainingCourse["level"]("intermediate");
  const [duration, setDuration] = React.useState(20);
  const [price, setPrice] = React.useState(2999);
  const [description, setDescription] = React.useState("");
  const [certified, setCertified] = React.useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add course</DialogTitle>
          <DialogDescription>Create a new training course entry.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1 max-h-[60vh] overflow-y-auto scroll-thin pr-1">
          <div className="space-y-1.5"><Label htmlFor="c-title">Title</Label><Input id="c-title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="c-prov">Provider</Label><Input id="c-prov" value={provider} onChange={(e) => setProvider(e.target.value)} /></div>
            <div className="space-y-1.5"><Label htmlFor="c-cat">Category</Label><Input id="c-cat" value={category} onChange={(e) => setCategory(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Level</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as TrainingCourse["level"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label htmlFor="c-dur">Duration (h)</Label><Input id="c-dur" type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1.5"><Label htmlFor="c-price">Price (₹)</Label><Input id="c-price" type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value) || 0)} /></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="c-desc">Description</Label><Textarea id="c-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} /></div>
          <label className="flex items-center gap-2 text-sm"><Switch checked={certified} onCheckedChange={setCertified} />Certified course</label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!title.trim()) { toast.error("Title is required"); return; }
            onAdd({
              id: `tc_${Date.now()}`, title: title.trim(), provider: provider.trim() || "jobson.id Academy",
              category, level, durationHours: duration, rating: 0, enrolledCount: 0, price, currency: "INR",
              skills: [], description: description.trim(), certified,
            });
            setTitle(""); setProvider(""); setDescription("");
          }}>Add course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddCertDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (c: Certification) => void }) {
  const [name, setName] = React.useState("");
  const [issuer, setIssuer] = React.useState("");
  const [category, setCategory] = React.useState("Engineering");
  const [skillLevel, setSkillLevel] = React.useState<Certification["skillLevel"]("professional");
  const [validity, setValidity] = React.useState(24);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add certification</DialogTitle>
          <DialogDescription>Register a new industry certification.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5"><Label htmlFor="ct-name">Name</Label><Input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="ct-iss">Issuer</Label><Input id="ct-iss" value={issuer} onChange={(e) => setIssuer(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="ct-cat">Category</Label><Input id="ct-cat" value={category} onChange={(e) => setCategory(e.target.value)} /></div>
            <div className="space-y-1.5">
              <Label>Skill level</Label>
              <Select value={skillLevel} onValueChange={(v) => setSkillLevel(v as Certification["skillLevel"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="associate">Associate</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="ct-val">Validity (months)</Label><Input id="ct-val" type="number" value={validity} onChange={(e) => setValidity(parseInt(e.target.value) || 0)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!name.trim()) { toast.error("Name is required"); return; }
            onAdd({ id: `cert_${Date.now()}`, name: name.trim(), issuer: issuer.trim(), category, validityMonths: validity || undefined, skillLevel });
            setName(""); setIssuer("");
          }}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
