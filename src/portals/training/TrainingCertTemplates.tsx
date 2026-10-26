"use client";

import * as React from "react";
import { certificateTemplates } from "@/lib/lms-data";
import type { CertificateTemplate } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import { Plus, FileEdit, X, Award, Eye } from "lucide-react";

const FIELD_OPTIONS = ["Learner Name", "Course", "Issue Date", "Expiry Date", "Verify ID", "Score", "Regulation", "Program", "Trainer", "Duration"];

export function TrainingCertTemplates() {
  const [rows, setRows] = React.useState<CertificateTemplate[]>(certificateTemplates);
  const [addOpen, setAddOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<CertificateTemplate | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<CertificateTemplate | null>(null);

  const [name, setName] = React.useState("");
  const [design, setDesign] = React.useState("");
  const [fields, setFields] = React.useState<string[]>(["Learner Name", "Course", "Issue Date", "Verify ID"]);

  function toggleField(f: string) {
    setFields((arr) => arr.includes(f) ? arr.filter((x) => x !== f) : [...arr, f]);
  }

  function create() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    const newT: CertificateTemplate = {
      id: `ct_new_${Date.now()}`,
      name, design: design || "Custom design", fields, status: "draft",
    };
    setRows((r) => [...r, newT]);
    setAddOpen(false);
    setName(""); setDesign(""); setFields(["Learner Name", "Course", "Issue Date", "Verify ID"]);
    toast.success(`Template created — ${name}`);
  }

  function toggleStatus(t: CertificateTemplate) {
    setRows((r) => r.map((x) => x.id === t.id ? { ...x, status: x.status === "active" ? "draft" : "active" } : x));
    toast.success(`${t.name} ${t.status === "active" ? "deactivated" : "activated"}`);
  }

  function confirmDelete() {
    if (!deleteItem) return;
    setRows((r) => r.filter((x) => x.id !== deleteItem.id));
    toast.success(`Deleted — ${deleteItem.name}`);
    setDeleteItem(null);
  }

  const activeCount = rows.filter((t) => t.status === "active").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Certificate Templates"
        description="Design and manage certificate templates for issuance."
        icon={<Icon name="FileEdit" className="h-6 w-6" />}
        actions={[{ label: "Create template", icon: "Plus", onClick: () => setAddOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Templates" value={rows.length} icon={<FileEdit className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={activeCount} icon={<FileEdit className="h-5 w-5" />} tone="success" />
        <StatCard label="Drafts" value={rows.length - activeCount} icon={<FileEdit className="h-5 w-5" />} />
        <StatCard label="Total Fields" value={rows.reduce((s, t) => s + t.fields.length, 0)} icon={<FileEdit className="h-5 w-5" />} />
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<FileEdit className="h-5 w-5" />} title="No templates yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((t) => (
            <div key={t.id} className="rounded-xl border bg-card p-4 hover:border-brand/40 hover:shadow-md transition-all flex flex-col">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{t.name}</h3>
                <StatusBadge status={t.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{t.design}</p>

              {/* Visual mockup */}
              <div className="mt-3 rounded-lg border-2 border-brand/20 p-4 bg-gradient-to-br from-brand/5 to-card">
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto text-brand" />
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">Certificate of Completion</p>
                  <p className="text-sm font-bold mt-1">SkillForge Academy</p>
                  <div className="my-2 border-t border-dashed border-brand/20" />
                  <p className="text-[10px] text-muted-foreground">This certifies that</p>
                  <p className="text-xs font-semibold">[Learner Name]</p>
                  <p className="text-[10px] text-muted-foreground mt-1">has completed</p>
                  <p className="text-xs font-medium">[Course]</p>
                  <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
                    <span>[Issue Date]</span>
                    <span>[Verify ID]</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {t.fields.map((f) => <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>)}
              </div>

              <div className="mt-3 flex gap-2 border-t pt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreview(t)}><Eye className="mr-1 h-3 w-3" />Preview</Button>
                <Button size="sm" variant="outline" onClick={() => toggleStatus(t)}>{t.status === "active" ? "Deactivate" : "Activate"}</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
            <DialogDescription>Define a new certificate design.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ct-name">Template name *</Label>
              <Input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="ct-design">Design description</Label>
              <Textarea id="ct-design" value={design} onChange={(e) => setDesign(e.target.value)} className="mt-1 min-h-[60px]" placeholder="e.g. Classic white with gold accent border" />
            </div>
            <div>
              <Label>Fields to include</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {FIELD_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleField(f)}
                    className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${fields.includes(f) ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-muted"}`}
                  >
                    {fields.includes(f) && <X className="inline h-3 w-3 mr-0.5" />}
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={create}>Create template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{preview?.name}</DialogTitle>
            <DialogDescription>{preview?.design}</DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="rounded-lg border-2 border-brand/30 p-8 bg-gradient-to-br from-brand/5 to-card">
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto text-brand" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Certificate of Completion</p>
                <p className="text-2xl font-bold mt-2 text-brand">SkillForge Academy</p>
                <p className="text-xs text-muted-foreground">NSDC Approved · ISO 29993 Certified</p>
                <div className="my-4 border-t border-dashed border-brand/30" />
                <p className="text-sm text-muted-foreground">This is to certify that</p>
                <p className="text-xl font-serif font-semibold my-2">Priya Nair</p>
                <p className="text-sm text-muted-foreground">has successfully completed</p>
                <p className="text-lg font-medium mt-1">Advanced React 19 & Next.js</p>
                <div className="mt-6 flex justify-between text-xs text-muted-foreground">
                  <div className="text-left">
                    <p className="font-medium">Issue Date</p>
                    <p>15 Oct 2024</p>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full border-2 border-brand/40 mx-auto" />
                    <p className="mt-1">SkillForge Seal</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Verify ID</p>
                    <p className="font-mono">SF-CERT-2024-10001</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(preview)}>Delete template</Button>
            <DialogClose asChild><Button>Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>This will remove <span className="font-medium">{deleteItem?.name}</span>. Existing certificates keep their issued template snapshot.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
