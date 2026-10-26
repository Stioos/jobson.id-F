"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { lmsAiService } from "@/lib/mock-api";
import { trainers } from "@/lib/lms-data";
import type { CourseModule } from "@/lib/types";
import { PageHeader, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SimulatedAiBadge, TenantDisclaimer, durationLabel, ThumbnailIcon } from "./_shared";
import { toast } from "sonner";
import {
  Sparkles, Plus, X, Trash2, Save, Send, Eye, BookOpen,
  Video, FileText, Clock, Award, CheckCircle2,
} from "lucide-react";

const builderSchema = z.object({
  name: z.string().min(2, "Required"),
  code: z.string().min(2, "Required"),
  category: z.string().min(1, "Required"),
  subcategory: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  description: z.string().min(10, "Add at least 10 chars"),
  language: z.string().min(2, "Required"),
  visibility: z.enum(["public", "private", "restricted"]),
  price: z.coerce.number().min(0),
  hasCertificate: z.boolean(),
  isMandatory: z.boolean(),
  isCompliance: z.boolean(),
});
type FormValues = z.infer<typeof builderSchema>;

const CATEGORIES = ["Technology", "Leadership", "Compliance", "Sales", "Data & AI"];

export function TrainingCourseBuilder() {
  const [tab, setTab] = React.useState("basic");
  const [modules, setModules] = React.useState<CourseModule[]>([]);
  const [materials, setMaterials] = React.useState<{ id: string; type: string; title: string }[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [prereqs, setPrereqs] = React.useState<string[]>([]);
  const [prereqInput, setPrereqInput] = React.useState("");
  const [objectives, setObjectives] = React.useState<string[]>([]);
  const [objInput, setObjInput] = React.useState("");
  const [thumbnailColor, setThumbnailColor] = React.useState("oklch(0.55 0.13 165)");
  const [thumbnailIcon, setThumbnailIcon] = React.useState("BookOpen");
  const [generating, setGenerating] = React.useState(false);
  const [aiBadge, setAiBadge] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(builderSchema) as Resolver<FormValues>,
    defaultValues: {
      name: "", code: "SF-", category: "Technology", subcategory: "",
      difficulty: "intermediate", description: "", language: "English",
      visibility: "public", price: 9999, hasCertificate: true,
      isMandatory: false, isCompliance: false,
    },
  });

  function addModule() {
    const newMod: CourseModule = {
      id: `m_${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      lessons: [],
      order: modules.length + 1,
    };
    setModules((m) => [...m, newMod]);
  }

  function updateModuleTitle(id: string, title: string) {
    setModules((m) => m.map((x) => x.id === id ? { ...x, title } : x));
  }

  function removeModule(id: string) {
    setModules((m) => m.filter((x) => x.id !== id).map((x, i) => ({ ...x, order: i + 1 })));
    toast.info("Module removed");
  }

  function addLesson(modId: string) {
    setModules((m) => m.map((x) => x.id === modId ? {
      ...x,
      lessons: [...x.lessons, { id: `l_${Date.now()}_${Math.random()}`, title: "New Lesson", type: "video" as const, durationMinutes: 30 }],
    } : x));
  }

  function updateLesson(modId: string, lessonId: string, field: "title" | "type" | "durationMinutes", value: string | number) {
    setModules((m) => m.map((x) => x.id === modId ? {
      ...x,
      lessons: x.lessons.map((l) => l.id === lessonId ? { ...l, [field]: value } : l),
    } : x));
  }

  function removeLesson(modId: string, lessonId: string) {
    setModules((m) => m.map((x) => x.id === modId ? { ...x, lessons: x.lessons.filter((l) => l.id !== lessonId) } : x));
  }

  function addTag() {
    const v = tagInput.trim().toLowerCase();
    if (!v || tags.includes(v)) return;
    setTags((t) => [...t, v]);
    setTagInput("");
  }

  function addPrereq() {
    const v = prereqInput.trim();
    if (!v) return;
    setPrereqs((p) => [...p, v]);
    setPrereqInput("");
  }

  function addObj() {
    const v = objInput.trim();
    if (!v) return;
    setObjectives((o) => [...o, v]);
    setObjInput("");
  }

  async function aiGenerateOutline() {
    const name = form.getValues("name");
    if (name.length < 3) {
      toast.error("Enter a course name first");
      return;
    }
    setGenerating(true);
    try {
      const result = await lmsAiService.generateCourseOutline(name, form.getValues("category"));
      const newModules: CourseModule[] = result.modules.map((m, i) => ({
        id: `m_ai_${Date.now()}_${i}`,
        title: m.title,
        lessons: m.lessons.map((l, j) => ({
          id: `l_ai_${Date.now()}_${i}_${j}`,
          title: l,
          type: j === m.lessons.length - 1 ? "quiz" as const : "video" as const,
          durationMinutes: 30,
        })),
        order: i + 1,
      }));
      setModules(newModules);
      setObjectives(result.objectives);
      setAiBadge(true);
      toast.success("AI outline generated", { description: "Review and customize the curriculum." });
    } finally {
      setGenerating(false);
    }
  }

  function saveDraft() {
    toast.success("Course saved as draft", { description: form.getValues("name") });
  }

  function publish() {
    const values = form.getValues();
    if (!values.name || values.name.length < 3) {
      toast.error("Course name is required");
      form.setFocus("name");
      return;
    }
    if (modules.length === 0) {
      toast.error("Add at least one module before publishing");
      setTab("content");
      return;
    }
    toast.success("Course published!", { description: `${values.name} is now live in your catalog.` });
  }

  const totalDuration = modules.reduce((s, m) => s + m.lessons.reduce((ls, l) => ls + l.durationMinutes, 0), 0);
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);

  const values = form.watch();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Course Builder"
        description="Author a new course — content, materials, settings."
        icon={<Icon name="LayoutTemplate" className="h-6 w-6" />}
        actions={[
          { label: "Save draft", icon: "Save", variant: "outline", onClick: saveDraft },
          { label: "Publish", icon: "Send", onClick: publish },
        ]}
      />
      <TenantDisclaimer />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="basic">1. Basic</TabsTrigger>
          <TabsTrigger value="content">2. Content {aiBadge && <SimulatedAiBadge className="ml-2" />}</TabsTrigger>
          <TabsTrigger value="materials">3. Materials</TabsTrigger>
          <TabsTrigger value="settings">4. Settings</TabsTrigger>
          <TabsTrigger value="preview"><Eye className="h-3 w-3 mr-1" />Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <SectionCard title="Basic Information">
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="b-name">Course name *</Label>
                  <Input id="b-name" {...form.register("name")} className="mt-1" />
                  {form.formState.errors.name && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="b-code">Course code *</Label>
                  <Input id="b-code" {...form.register("code")} className="mt-1" />
                  {form.formState.errors.code && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.code.message}</p>}
                </div>
                <div>
                  <Label htmlFor="b-cat">Category</Label>
                  <Select defaultValue={form.getValues("category")} onValueChange={(v) => form.setValue("category", v)}>
                    <SelectTrigger id="b-cat" className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="b-sub">Subcategory</Label>
                  <Input id="b-sub" {...form.register("subcategory")} className="mt-1" placeholder="e.g. Frontend" />
                </div>
                <div>
                  <Label htmlFor="b-diff">Difficulty</Label>
                  <Select defaultValue={form.getValues("difficulty")} onValueChange={(v) => form.setValue("difficulty", v as FormValues["difficulty"])}>
                    <SelectTrigger id="b-diff" className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                    <SelectContent>{["beginner", "intermediate", "advanced", "expert"].map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="b-lang">Language</Label>
                  <Input id="b-lang" {...form.register("language")} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="b-desc">Description *</Label>
                <Textarea id="b-desc" {...form.register("description")} className="mt-1 min-h-[100px]" />
                {form.formState.errors.description && <p className="mt-1 text-xs text-rose-500">{form.formState.errors.description.message}</p>}
              </div>

              <div>
                <Label>Thumbnail style</Label>
                <div className="mt-2 flex items-center gap-3">
                  <ThumbnailIcon color={thumbnailColor} icon={thumbnailIcon} size="md" />
                  <div className="flex flex-wrap gap-2">
                    {["oklch(0.55 0.13 165)", "oklch(0.6 0.14 200)", "oklch(0.58 0.2 25)", "oklch(0.6 0.13 300)", "oklch(0.52 0.11 162)", "oklch(0.55 0.13 200)"].map((c) => (
                      <button key={c} type="button" onClick={() => setThumbnailColor(c)} className={`h-8 w-8 rounded-md border-2 ${thumbnailColor === c ? "border-brand" : "border-transparent"}`} style={{ background: c }} />
                    ))}
                  </div>
                  <Select value={thumbnailIcon} onValueChange={setThumbnailIcon}>
                    <SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Code", "Cloud", "Users", "Brain", "ShieldCheck", "Trophy", "Crown", "Route"].map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </SectionCard>
        </TabsContent>

        <TabsContent value="content" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium">Curriculum</h3>
              <p className="text-xs text-muted-foreground">{modules.length} modules · {totalLessons} lessons · {durationLabel(totalDuration)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={aiGenerateOutline} disabled={generating}>
                <Sparkles className="mr-1 h-4 w-4" />
                {generating ? "Generating…" : "AI Generate Outline"}
              </Button>
              <Button size="sm" onClick={addModule}><Plus className="mr-1 h-4 w-4" />Add module</Button>
            </div>
          </div>

          {modules.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-5 w-5" />}
              title="No modules yet"
              description="Add a module manually or use AI to generate an outline."
            />
          ) : (
            <div className="space-y-3">
              {modules.map((m) => (
                <div key={m.id} className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-brand/10 text-xs font-bold text-brand">{m.order}</span>
                    <Input
                      value={m.title}
                      onChange={(e) => updateModuleTitle(m.id, e.target.value)}
                      className="flex-1 font-medium"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeModule(m.id)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                  </div>
                  <div className="mt-3 space-y-2 pl-8">
                    {m.lessons.map((l) => (
                      <div key={l.id} className="flex items-center gap-2">
                        <Input
                          value={l.title}
                          onChange={(e) => updateLesson(m.id, l.id, "title", e.target.value)}
                          className="flex-1 h-8 text-sm"
                        />
                        <Select value={l.type} onValueChange={(v) => updateLesson(m.id, l.id, "type", v)}>
                          <SelectTrigger className="h-8 w-[100px] text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>{["video", "quiz", "assignment", "project", "live", "reading"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={l.durationMinutes}
                          onChange={(e) => updateLesson(m.id, l.id, "durationMinutes", Number(e.target.value))}
                          className="h-8 w-[70px] text-sm"
                          min={0}
                        />
                        <span className="text-xs text-muted-foreground">min</span>
                        <Button variant="ghost" size="sm" onClick={() => removeLesson(m.id, l.id)}><X className="h-3 w-3" /></Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => addLesson(m.id)} className="text-xs">
                      <Plus className="mr-1 h-3 w-3" />Add lesson
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials" className="mt-4">
          <SectionCard
            title="Course Materials"
            description="Upload PDFs, videos, links, and reference docs"
            action={<Button size="sm" variant="outline" onClick={() => setMaterials((m) => [...m, { id: `mat_${Date.now()}`, type: "pdf", title: "New material" }])}><Plus className="mr-1 h-4 w-4" />Add</Button>}
          >
            {materials.length === 0 ? (
              <EmptyState icon={<FileText className="h-5 w-5" />} title="No materials" description="Add downloadable resources for learners." />
            ) : (
              <ul className="space-y-2">
                {materials.map((mat) => (
                  <li key={mat.id} className="flex items-center gap-2 rounded-lg border p-2">
                    <Input value={mat.title} onChange={(e) => setMaterials((m) => m.map((x) => x.id === mat.id ? { ...x, title: e.target.value } : x))} className="flex-1 h-8 text-sm" />
                    <Select value={mat.type} onValueChange={(v) => setMaterials((m) => m.map((x) => x.id === mat.id ? { ...x, type: v } : x))}>
                      <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{["pdf", "video", "document", "presentation", "link"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => setMaterials((m) => m.filter((x) => x.id !== mat.id))}><X className="h-4 w-4" /></Button>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <SectionCard title="Tags">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1 pr-1">{t}
                    <button onClick={() => setTags((x) => x.filter((y) => y !== t))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Add tag" className="h-8 text-sm" />
                <Button variant="outline" size="sm" onClick={addTag}><Plus className="h-3 w-3" /></Button>
              </div>
            </SectionCard>

            <SectionCard title="Prerequisites">
              <ul className="space-y-1 mb-2">
                {prereqs.map((p, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="truncate">• {p}</span>
                    <button onClick={() => setPrereqs((x) => x.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input value={prereqInput} onChange={(e) => setPrereqInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPrereq(); } }} placeholder="Add prerequisite" className="h-8 text-sm" />
                <Button variant="outline" size="sm" onClick={addPrereq}><Plus className="h-3 w-3" /></Button>
              </div>
            </SectionCard>

            <SectionCard title="Objectives">
              <ul className="space-y-1 mb-2">
                {objectives.map((o, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="truncate">• {o}</span>
                    <button onClick={() => setObjectives((x) => x.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input value={objInput} onChange={(e) => setObjInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addObj(); } }} placeholder="Add objective" className="h-8 text-sm" />
                <Button variant="outline" size="sm" onClick={addObj}><Plus className="h-3 w-3" /></Button>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <SectionCard title="Course Settings">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="s-vis">Visibility</Label>
                  <Select defaultValue={form.getValues("visibility")} onValueChange={(v) => form.setValue("visibility", v as FormValues["visibility"])}>
                    <SelectTrigger id="s-vis" className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                    <SelectContent>{["public", "private", "restricted"].map((v) => <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="s-price">Price (₹)</Label>
                  <Input id="s-price" type="number" {...form.register("price")} className="mt-1" />
                </div>
              </div>

              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Issue certificate on completion</p>
                    <p className="text-xs text-muted-foreground">Generate a certificate when learners finish this course</p>
                  </div>
                  <Switch checked={form.watch("hasCertificate")} onCheckedChange={(v) => form.setValue("hasCertificate", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Mandatory course</p>
                    <p className="text-xs text-muted-foreground">Required for assigned learners</p>
                  </div>
                  <Switch checked={form.watch("isMandatory")} onCheckedChange={(v) => form.setValue("isMandatory", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Compliance course</p>
                    <p className="text-xs text-muted-foreground">Counts toward compliance tracking</p>
                  </div>
                  <Switch checked={form.watch("isCompliance")} onCheckedChange={(v) => form.setValue("isCompliance", v)} />
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <SectionCard title="Course Preview" description="What learners will see">
            <div className="rounded-xl border p-6">
              <div className="flex items-start gap-4">
                <ThumbnailIcon color={thumbnailColor} icon={thumbnailIcon} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{form.getValues("code") || "SF-XXX"}</span>
                    <Badge variant="outline" className="capitalize">{form.getValues("difficulty")}</Badge>
                    {values.hasCertificate && <Badge variant="outline" className="text-brand border-brand/30">Certificate</Badge>}
                    {values.isMandatory && <Badge variant="outline" className="text-amber-600 border-amber-500/30">Mandatory</Badge>}
                  </div>
                  <h2 className="text-xl font-semibold">{form.getValues("name") || "Untitled course"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{form.getValues("description") || "No description yet."}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{durationLabel(totalDuration)}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{modules.length} modules</span>
                    <span className="flex items-center gap-1"><Video className="h-3 w-3" />{totalLessons} lessons</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <span className="text-lg font-bold text-brand">{form.getValues("price") > 0 ? `₹${form.getValues("price").toLocaleString("en-IN")}` : "Free"}</span>
                    <Button>Enroll now</Button>
                  </div>
                </div>
              </div>

              {objectives.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">What you&apos;ll learn</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {objectives.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {modules.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">Curriculum</h3>
                  <div className="space-y-2">
                    {modules.map((m) => (
                      <div key={m.id} className="rounded-lg border p-3">
                        <p className="text-sm font-medium">{m.order}. {m.title}</p>
                        <ul className="mt-1 space-y-0.5">
                          {m.lessons.map((l) => (
                            <li key={l.id} className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{l.title}</span>
                              <span>{durationLabel(l.durationMinutes)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={saveDraft}><Save className="mr-1 h-4 w-4" />Save draft</Button>
        <Button onClick={publish}><Send className="mr-1 h-4 w-4" />Publish</Button>
      </div>
    </div>
  );
}
