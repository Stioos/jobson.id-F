"use client";

import * as React from "react";
import { useNav, useAuth } from "@/lib/store";
import { PageHeader, SectionCard, StatusBadge, Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { trainingCourses, learningPaths, learnerEnrollments, trainingCompany } from "@/lib/lms-data";
import type { TrainingCourse, LearningPath } from "@/lib/types";
import {
  Search, GraduationCap, Route as RouteIcon, Star, Clock, Users, ShieldCheck,
  CheckCircle2, ArrowUpRight, Send, Calendar, AlertCircle, Sparkles, Filter,
} from "lucide-react";

const CLIENT_ID = "cc_001";
const recentAssignments = learnerEnrollments
  .filter((e) => e.clientId === CLIENT_ID)
  .sort((a, b) => new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime());

type CatalogItem =
  | { kind: "course"; data: TrainingCourse }
  | { kind: "path"; data: LearningPath };

const catalog: CatalogItem[] = [
  ...trainingCourses.filter((c) => c.status === "published").map((c) => ({ kind: "course" as const, data: c })),
  ...learningPaths.map((p) => ({ kind: "path" as const, data: p })),
];

const categories = Array.from(new Set(trainingCourses.map((c) => c.category)));

const difficultyColor: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  expert: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
};

const bulkSchema = z.object({
  itemId: z.string().min(1, "Select a course or path"),
  itemType: z.enum(["course", "path"]),
  audience: z.enum(["individual", "team", "department", "all"]),
  audienceTarget: z.string().min(1, "Select target"),
  dueDate: z.string().min(1, "Due date required"),
  priority: z.enum(["low", "medium", "high"]),
  message: z.string().max(500).optional().default(""),
});
type BulkForm = z.infer<typeof bulkSchema>;

const DEPARTMENTS = ["Engineering", "Product", "Sales", "Operations", "HR", "Finance", "Design"];
const TEAMS = ["Frontend Pod", "Backend Pod", "Platform Team", "Mobile Squad", "DevOps Cell"];

export function EmployerAssignLearning() {
  const { user } = useAuth();
  const [tab, setTab] = React.useState("catalog");
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [assignDialog, setAssignDialog] = React.useState<{ item: CatalogItem } | null>(null);
  const [recentlyAssigned, setRecentlyAssigned] = React.useState(recentAssignments);

  const form = useForm<BulkForm>({
    resolver: zodResolver(bulkSchema) as Resolver<BulkForm>,
    defaultValues: {
      itemId: "",
      itemType: "course",
      audience: "team",
      audienceTarget: "",
      dueDate: "",
      priority: "medium",
      message: "",
    },
  });

  const audienceWatch = useWatch({ control: form.control, name: "audience" });
  const itemTypeWatch = useWatch({ control: form.control, name: "itemType" });
  const itemIdWatch = useWatch({ control: form.control, name: "itemId" });
  const audienceTargetWatch = useWatch({ control: form.control, name: "audienceTarget" });
  const priorityWatch = useWatch({ control: form.control, name: "priority" });

  const filtered = React.useMemo(() => {
    return catalog.filter((item) => {
      const name = item.kind === "course" ? item.data.name : item.data.name;
      const category = item.kind === "course" ? item.data.category : item.data.category;
      const matchSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || category === categoryFilter;
      const matchType = typeFilter === "all" || item.kind === typeFilter;
      return matchSearch && matchCat && matchType;
    });
  }, [search, categoryFilter, typeFilter]);

  function quickAssign(item: CatalogItem) {
    setAssignDialog({ item });
  }

  function confirmQuickAssign() {
    if (!assignDialog) return;
    const name = assignDialog.item.kind === "course" ? assignDialog.item.data.name : assignDialog.item.data.name;
    const courseId = assignDialog.item.kind === "course" ? assignDialog.item.data.id : assignDialog.item.data.id;
    setRecentlyAssigned((prev) => [
      {
        id: `le_new_${Date.now()}`,
        learnerId: "e_new",
        learnerName: "Multiple employees",
        courseId,
        courseName: name,
        progress: 0,
        status: "in_progress" as const,
        enrolledDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        timeSpentMinutes: 0,
        assignedBy: user?.name ?? "Rohan Mehta",
        clientId: CLIENT_ID,
        clientName: "TechCorp India",
      },
      ...prev,
    ]);
    toast.success("Learning assigned", {
      description: `"${name}" assigned to selected employees. Notifications sent.`,
    });
    setAssignDialog(null);
  }

  function onBulkSubmit(values: BulkForm) {
    const item = catalog.find((c) =>
      c.kind === values.itemType && (c.kind === "course" ? c.data.id : c.data.id) === values.itemId
    );
    const name = item ? (item.kind === "course" ? item.data.name : item.data.name) : values.itemId;
    const audienceLabel =
      values.audience === "all" ? "all employees"
        : values.audience === "department" ? `${values.audienceTarget} department`
        : values.audience === "team" ? `${values.audienceTarget} team`
        : values.audienceTarget;

    setRecentlyAssigned((prev) => [
      {
        id: `le_bulk_${Date.now()}`,
        learnerId: "e_bulk",
        learnerName: audienceLabel,
        courseId: values.itemId,
        courseName: name,
        progress: 0,
        status: "in_progress" as const,
        enrolledDate: new Date().toISOString(),
        dueDate: values.dueDate,
        timeSpentMinutes: 0,
        assignedBy: user?.name ?? "Rohan Mehta",
        clientId: CLIENT_ID,
        clientName: "TechCorp India",
      },
      ...prev,
    ]);

    toast.success("Bulk assignment complete", {
      description: `"${name}" → ${audienceLabel}. Due ${formatDate(values.dueDate)}. Priority: ${values.priority}.`,
    });
    form.reset({
      itemId: "",
      itemType: "course",
      audience: "team",
      audienceTarget: "",
      dueDate: "",
      priority: "medium",
      message: "",
    });
  }

  const audienceOptions =
    audienceWatch === "department" ? DEPARTMENTS
    : audienceWatch === "team" ? TEAMS
    : audienceWatch === "individual" ? ["Priya Nair", "Arjun Iyer", "Karthik Menon", "Divya Sharma"]
    : ["All employees"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assign Learning"
        description={`Browse SkillForge Academy catalog and assign training to ${"TechCorp India"} employees`}
        actions={[
          { label: "Employee learning", icon: "UserCheck", variant: "outline", onClick: () => useNav.getState().navigate("employer", "employee-learning") },
        ]}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="catalog"><GraduationCap className="mr-1.5 h-3.5 w-3.5" /> Browse Catalog</TabsTrigger>
          <TabsTrigger value="bulk"><Send className="mr-1.5 h-3.5 w-3.5" /> Bulk Assign</TabsTrigger>
        </TabsList>

        {/* Catalog tab */}
        <TabsContent value="catalog" className="mt-4 space-y-4">
          {/* Filter bar */}
          <Card className="p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses & paths..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="course">Courses</SelectItem>
                  <SelectItem value="path">Learning paths</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="ml-auto">
                <Filter className="mr-1 h-3 w-3" /> {filtered.length} items
              </Badge>
            </div>
          </Card>

          {/* Catalog grid */}
          {filtered.length === 0 ? (
            <EmptyState icon={<Search className="h-5 w-5" />} title="No items match" description="Try a different search or filter." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => {
                const isCourse = item.kind === "course";
                const course = isCourse ? item.data : null;
                const path = !isCourse ? item.data : null;
                const name = isCourse ? course!.name : path!.name;
                const description = isCourse ? course!.description : path!.description;
                const category = isCourse ? course!.category : path!.category;
                const difficulty = isCourse ? course!.difficulty : "intermediate";
                const durationMinutes = isCourse ? course!.durationMinutes : path!.totalDurationMinutes;
                const rating = isCourse ? course!.rating : 4.6;
                const enrollments = isCourse ? course!.enrollments : path!.enrolledCount;
                const price = isCourse ? course!.price : 0;
                const isCompliance = isCourse ? course!.isCompliance : path!.isMandatory;
                const hasCert = isCourse ? course!.hasCertificate : true;
                const color = isCourse ? course!.thumbnailColor : path!.thumbnailColor;
                const hours = Math.round(durationMinutes / 60);

                return (
                  <Card key={`${item.kind}-${isCourse ? course!.id : path!.id}`} className="flex flex-col overflow-hidden hover:border-brand/40 hover:shadow-md transition-all">
                    <div className="h-2" style={{ backgroundColor: color }} />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}20`, color }}>
                            {isCourse ? <GraduationCap className="h-4 w-4" /> : <RouteIcon className="h-4 w-4" />}
                          </div>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {isCourse ? "Course" : "Path"}
                          </Badge>
                        </div>
                        {isCompliance && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
                            <ShieldCheck className="mr-0.5 h-2.5 w-2.5" /> Mandatory
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm leading-snug line-clamp-2 mt-2">{name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3 pt-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className={`text-[10px] capitalize border ${difficultyColor[difficulty]}`}>{difficulty}</Badge>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {hours}h</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {rating}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {enrollments.toLocaleString("en-IN")}</span>
                        {hasCert && <Badge variant="outline" className="text-[10px] bg-brand/5 text-brand border-brand/20">Cert</Badge>}
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
                        <span className="text-sm font-semibold">
                          {price > 0 ? formatCurrency(price) : <span className="text-xs text-muted-foreground">Path</span>}
                        </span>
                        <Button size="sm" onClick={() => quickAssign(item)}>
                          <Send className="mr-1 h-3 w-3" /> Assign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Bulk assign tab */}
        <TabsContent value="bulk" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Bulk assignment</CardTitle>
                <CardDescription>Assign a course or learning path to multiple employees at once.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onBulkSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Type</Label>
                      <Select
                        value={itemTypeWatch}
                        onValueChange={(v) => {
                          form.setValue("itemType", v as "course" | "path");
                          form.setValue("itemId", "");
                        }}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="path">Learning path</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>{itemTypeWatch === "course" ? "Course" : "Learning path"}</Label>
                      <Select
                        value={itemIdWatch}
                        onValueChange={(v) => form.setValue("itemId", v)}
                      >
                        <SelectTrigger><SelectValue placeholder={`Select ${itemTypeWatch}`} /></SelectTrigger>
                        <SelectContent className="max-h-72">
                          {itemTypeWatch === "course"
                            ? trainingCourses.filter((c) => c.status === "published").map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))
                            : learningPaths.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      {form.formState.errors.itemId && (
                        <p className="text-xs text-rose-600">{form.formState.errors.itemId.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Target audience</Label>
                      <Select
                        value={audienceWatch}
                        onValueChange={(v) => {
                          form.setValue("audience", v as BulkForm["audience"]);
                          form.setValue("audienceTarget", "");
                        }}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                          <SelectItem value="department">Department</SelectItem>
                          <SelectItem value="all">All employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Target</Label>
                      <Select
                        value={audienceTargetWatch}
                        onValueChange={(v) => form.setValue("audienceTarget", v)}
                        disabled={audienceWatch === "all"}
                      >
                        <SelectTrigger><SelectValue placeholder="Select target" /></SelectTrigger>
                        <SelectContent>
                          {audienceWatch === "all"
                            ? <SelectItem value="all">All employees</SelectItem>
                            : audienceOptions.map((o) => (
                              <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      {form.formState.errors.audienceTarget && (
                        <p className="text-xs text-rose-600">{form.formState.errors.audienceTarget.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Due date</Label>
                      <Input
                        type="date"
                        {...form.register("dueDate")}
                      />
                      {form.formState.errors.dueDate && (
                        <p className="text-xs text-rose-600">{form.formState.errors.dueDate.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Priority</Label>
                      <Select
                        value={priorityWatch}
                        onValueChange={(v) => form.setValue("priority", v as BulkForm["priority"])}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Notification message (optional)</Label>
                    <Textarea
                      placeholder="Add a message employees will see with this assignment..."
                      rows={3}
                      {...form.register("message")}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      Employees will be notified via email + in-app
                    </p>
                    <Button type="submit">
                      <Send className="mr-1.5 h-3.5 w-3.5" /> Assign learning
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tips & guidelines</CardTitle>
                <CardDescription>Best practices for assigning learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-lg border bg-brand/5 p-3">
                  <p className="flex items-center gap-1.5 font-medium text-sm">
                    <CheckCircle2 className="h-4 w-4 text-brand" /> Set realistic deadlines
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Allow 2-4 weeks for short courses, 4-8 weeks for paths.</p>
                </div>
                <div className="rounded-lg border bg-amber-500/5 p-3">
                  <p className="flex items-center gap-1.5 font-medium text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Compliance first
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Assign mandatory compliance training before optional upskilling.</p>
                </div>
                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="flex items-center gap-1.5 font-medium text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" /> Avoid overload
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Cap at 2 active assignments per employee.</p>
                </div>
                <div className="rounded-lg border bg-violet-500/5 p-3">
                  <p className="flex items-center gap-1.5 font-medium text-sm">
                    <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" /> Personalize
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Use the Skill Gaps tool to target real needs.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent assignments */}
      <SectionCard
        title="Recent assignments"
        description="Learning assignments to TechCorp employees"
        action={<Button size="sm" variant="ghost" onClick={() => useNav.getState().navigate("employer", "employee-learning")}>View all <ArrowUpRight className="ml-1 h-3 w-3" /></Button>}
      >
        {recentlyAssigned.length === 0 ? (
          <EmptyState icon={<Send className="h-5 w-5" />} title="No assignments yet" description="Use the catalog or bulk assign to start." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target</TableHead>
                  <TableHead>Course / Path</TableHead>
                  <TableHead>Assigned by</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentlyAssigned.slice(0, 8).map((a) => (
                  <TableRow key={a.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={a.learnerName} size="xs" />
                        <span className="text-sm font-medium">{a.learnerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[260px] truncate">{a.courseName}</TableCell>
                    <TableCell className="text-sm">{a.assignedBy ?? "—"}</TableCell>
                    <TableCell className="text-sm">{formatDate(a.enrolledDate)}</TableCell>
                    <TableCell className="text-sm">{a.dueDate ? formatDate(a.dueDate) : "—"}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Quick-assign dialog */}
      <Dialog open={!!assignDialog} onOpenChange={(o) => !o && setAssignDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign learning</DialogTitle>
            <DialogDescription>
              Confirm assignment of <span className="font-medium text-foreground">{assignDialog?.item.kind === "course" ? assignDialog.item.data.name : assignDialog?.item.data.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This will create an enrollment for the selected employee(s) and notify them via email. Use the Bulk Assign tab to target teams or departments.
            </p>
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">{trainingCompany.name}</p>
              <p>Powered by your corporate training partner. Certificates will be issued on completion where applicable.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialog(null)}>Cancel</Button>
            <Button onClick={confirmQuickAssign}>
              <Send className="mr-1.5 h-3.5 w-3.5" /> Confirm assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
