"use client";

import * as React from "react";
import {
  Plus, Mail, Tag, Clock, BarChart3, Copy, Pencil, Eye, Send, Variable,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";
import { emailTemplates as initialTemplates } from "@/lib/partner-data";
import type { EmailTemplate } from "@/lib/partner-types";

const CATEGORY_TONE: Record<string, string> = {
  candidate: "bg-brand/10 text-brand border-brand/30",
  client: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/30",
  internal: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30",
  offer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
  rejection: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30",
  interview: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30",
};

const SAMPLE_DATA: Record<string, string> = {
  candidate_name: "Priya Nair",
  client_name: "TechCorp India",
  client_contact: "Meera (HR)",
  job_title: "Senior Full-Stack Engineer",
  recruiter_name: "Karthik Subramanian",
  interview_date: "12 Nov 2025",
  interview_time: "10:30 AM IST",
  interview_mode: "Video (Google Meet)",
  salary: "₹22,00,000 CTC",
  joining_date: "01 Dec 2025",
  orientation_date: "01 Dec 2025",
  mandates_summary: "JO-2024-0501 (1/3 placed), JO-2024-0502 (0/2 placed)",
  submissions_count: "12",
  interviews_count: "4",
};

function renderTemplate(tpl: string, data: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k: string) => data[k] ?? `{{${k}}}`);
}

export function RecruiterEmailTemplates() {
  const [templates, setTemplates] = React.useState<EmailTemplate[]>(initialTemplates);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [view, setView] = React.useState<"grid" | "table">("grid");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<EmailTemplate | null>(null);

  const filtered = templates.filter((t) => {
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.subject.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalUsage = templates.reduce((a, t) => a + t.usageCount, 0);
  const lastUsed = templates.filter((t) => t.lastUsed).sort((a, b) => (b.lastUsed ?? "").localeCompare(a.lastUsed ?? ""))[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email templates"
        description="Reusable email templates with variable placeholders. Insert, preview, and use across your recruitment workflow."
        actions={[{ label: "Create template", onClick: () => setCreateOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Templates" value={templates.length} icon={<Mail className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total usage" value={totalUsage} icon={<BarChart3 className="h-5 w-5" />} tone="default" hint="All-time sends" />
        <StatCard label="Categories" value={Array.from(new Set(templates.map((t) => t.category))).length} icon={<Tag className="h-5 w-5" />} tone="warning" />
        <StatCard label="Last used" value={lastUsed ? timeAgo(lastUsed.lastUsed!) : "—"} icon={<Clock className="h-5 w-5" />} tone="success" hint={lastUsed?.name} />
      </div>

      <SectionCard
        title="Templates"
        description="Click a template to edit it. Use the 'Use' action to copy rendered text to your clipboard."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search name, subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 sm:w-56"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejection">Rejection</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-md border">
              <button
                onClick={() => setView("grid")}
                className={`px-2.5 py-1 text-xs ${view === "grid" ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Grid view"
              >Grid</button>
              <button
                onClick={() => setView("table")}
                className={`px-2.5 py-1 text-xs ${view === "table" ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Table view"
              >Table</button>
            </div>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Mail className="h-5 w-5" />}
            title="No templates match"
            description="Adjust filters or create a new template."
          />
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <div key={t.id} className="rounded-xl border bg-card p-4 hover:border-brand hover:shadow-sm transition-all flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{t.subject}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${CATEGORY_TONE[t.category]}`}>
                    {t.category}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">
                    <Variable className="h-3 w-3 mr-1" />{t.variables.length} vars
                  </Badge>
                  <span>{t.usageCount} uses</span>
                  {t.lastUsed && <span>· last {timeAgo(t.lastUsed)}</span>}
                </div>
                <div className="mt-3 flex items-center gap-1.5 border-t pt-3">
                  <Button size="sm" variant="outline" className="h-7 flex-1" onClick={() => setEditTarget(t)}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 flex-1"
                    onClick={() => {
                      navigator.clipboard?.writeText(renderTemplate(t.body, SAMPLE_DATA));
                      toast.success("Template copied", { description: `${t.name} — rendered with sample data` });
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Use
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto scroll-thin">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="p-2 font-medium">Name</th>
                  <th className="p-2 font-medium">Category</th>
                  <th className="hidden md:table-cell p-2 font-medium">Subject</th>
                  <th className="text-center p-2 font-medium">Vars</th>
                  <th className="text-center p-2 font-medium">Uses</th>
                  <th className="hidden sm:table-cell p-2 font-medium">Last used</th>
                  <th className="text-right p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-2 font-medium">{t.name}</td>
                    <td className="p-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${CATEGORY_TONE[t.category]}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell p-2 text-xs text-muted-foreground truncate max-w-xs">{t.subject}</td>
                    <td className="text-center p-2">{t.variables.length}</td>
                    <td className="text-center p-2">{t.usageCount}</td>
                    <td className="hidden sm:table-cell p-2 text-xs text-muted-foreground">{t.lastUsed ? timeAgo(t.lastUsed) : "—"}</td>
                    <td className="text-right p-2">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditTarget(t)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2"
                          onClick={() => {
                            navigator.clipboard?.writeText(renderTemplate(t.body, SAMPLE_DATA));
                            toast.success("Template copied", { description: t.name });
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <CreateTemplateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(tpl) => {
          setTemplates((prev) => [tpl, ...prev]);
          toast.success("Template created", { description: tpl.name });
        }}
      />

      <EditTemplateDialog
        template={editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        onSave={(updated) => {
          setTemplates((prev) => prev.map((t) => t.id === updated.id ? updated : t));
          setEditTarget(null);
          toast.success("Template saved", { description: updated.name });
        }}
      />
    </div>
  );
}

interface TemplateForm {
  name: string;
  category: EmailTemplate["category"];
  subject: string;
  body: string;
  variables: string[];
}

function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{(\w+)\}\}/g) ?? [];
  return Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, ""))));
}

function CreateTemplateDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (tpl: EmailTemplate) => void;
}) {
  const [form, setForm] = React.useState<TemplateForm>({
    name: "", category: "candidate", subject: "", body: "", variables: [],
  });

  const reset = () => setForm({ name: "", category: "candidate", subject: "", body: "", variables: [] });

  const detectedVars = extractVariables(`${form.subject} ${form.body}`);

  const insertVar = (v: string) => {
    setForm((p) => ({ ...p, body: `${p.body}{{${v}}}` }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create email template</DialogTitle>
          <DialogDescription>Use {"{{variable}}"} placeholders. Variables are auto-detected from subject and body.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="et-name">Name *</Label>
              <Input id="et-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Interview Reminder" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as EmailTemplate["category"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejection">Rejection</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="et-subject">Subject *</Label>
            <Input id="et-subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} placeholder="Interview Invitation — {{job_title}}" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="et-body">Body</Label>
            <Textarea id="et-body" rows={8} value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} placeholder="Hi {{candidate_name}}, …" className="font-mono text-xs" />
          </div>

          {/* Variable insertion */}
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground">Detected variables ({detectedVars.length})</p>
              <span className="text-[10px] text-muted-foreground">Click to insert into body</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {COMMON_VARS.map((v) => (
                <button
                  key={v}
                  onClick={() => insertVar(v)}
                  className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-mono hover:border-brand hover:text-brand transition-colors"
                >
                  {`{{${v}}}`}
                </button>
              ))}
            </div>
            {detectedVars.length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-[10px] text-muted-foreground mb-1">In use:</p>
                <div className="flex flex-wrap gap-1">
                  {detectedVars.map((v) => (
                    <Badge key={v} variant="secondary" className="text-[10px] font-mono">{v}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!form.name || !form.subject) {
                toast.error("Name and subject are required");
                return;
              }
              onCreate({
                id: `et_${Date.now()}`,
                name: form.name,
                category: form.category,
                subject: form.subject,
                body: form.body,
                variables: detectedVars,
                usageCount: 0,
              });
              onOpenChange(false);
              reset();
            }}
          >
            Create template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const COMMON_VARS = [
  "candidate_name", "client_name", "client_contact", "job_title", "recruiter_name",
  "interview_date", "interview_time", "interview_mode", "salary", "joining_date",
  "orientation_date", "mandates_summary", "submissions_count", "interviews_count",
];

function EditTemplateDialog({
  template, onOpenChange, onSave,
}: {
  template: EmailTemplate | null;
  onOpenChange: (v: boolean) => void;
  onSave: (tpl: EmailTemplate) => void;
}) {
  const [form, setForm] = React.useState<TemplateForm | null>(null);
  React.useEffect(() => {
    if (template) {
      setForm({
        name: template.name,
        category: template.category,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
      });
    }
  }, [template]);

  if (!template || !form) return null;

  const detectedVars = extractVariables(`${form.subject} ${form.body}`);
  const insertVar = (v: string) => setForm((p) => p ? { ...p, body: `${p.body}{{${v}}}` } : p);
  const previewSubject = renderTemplate(form.subject, SAMPLE_DATA);
  const previewBody = renderTemplate(form.body, SAMPLE_DATA);

  return (
    <Dialog open={!!template} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit template</DialogTitle>
          <DialogDescription>{template.name} — auto-saves detected variables.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit"><Pencil className="h-3.5 w-3.5 mr-1" />Edit</TabsTrigger>
            <TabsTrigger value="preview"><Eye className="h-3.5 w-3.5 mr-1" />Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ed-name">Name</Label>
                <Input id="ed-name" value={form.name} onChange={(e) => setForm((p) => p ? { ...p, name: e.target.value } : p)} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((p) => p ? { ...p, category: v as EmailTemplate["category"] } : p)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejection">Rejection</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ed-subject">Subject</Label>
              <Input id="ed-subject" value={form.subject} onChange={(e) => setForm((p) => p ? { ...p, subject: e.target.value } : p)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ed-body">Body</Label>
              <Textarea id="ed-body" rows={10} value={form.body} onChange={(e) => setForm((p) => p ? { ...p, body: e.target.value } : p)} className="font-mono text-xs" />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground">Variables</p>
                <span className="text-[10px] text-muted-foreground">Click to insert</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {COMMON_VARS.map((v) => (
                  <button
                    key={v}
                    onClick={() => insertVar(v)}
                    className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-mono hover:border-brand hover:text-brand transition-colors"
                  >
                    {`{{${v}}}`}
                  </button>
                ))}
              </div>
              {detectedVars.length > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-[10px] text-muted-foreground mb-1">Detected ({detectedVars.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {detectedVars.map((v) => (
                      <Badge key={v} variant="secondary" className="text-[10px] font-mono">{v}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">Rendered with sample data:</p>
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Subject</p>
                <p className="text-sm font-medium mt-0.5">{previewSubject}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Body</p>
                <pre className="mt-0.5 whitespace-pre-wrap font-sans text-sm">{previewBody}</pre>
              </div>
            </div>
            <div className="rounded-lg border bg-amber-500/5 border-amber-500/30 p-3 flex items-start gap-2">
              <Variable className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-amber-700 dark:text-amber-300">Sample data used for preview</p>
                <p className="text-muted-foreground mt-0.5">Actual send will use real candidate/client values from your placements database.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard?.writeText(renderTemplate(form.body, SAMPLE_DATA));
              toast.success("Copied to clipboard", { description: `${form.name} — rendered with sample data` });
            }}
          >
            <Copy className="h-4 w-4 mr-1" /> Copy
          </Button>
          <Button
            onClick={() => onSave({
              ...template,
              name: form.name,
              category: form.category,
              subject: form.subject,
              body: form.body,
              variables: detectedVars,
            })}
          >
            <Send className="h-4 w-4 mr-1" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
