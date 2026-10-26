"use client";

import * as React from "react";
import { formTemplates } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatDate, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { FileText, Search, Download, Upload, FileCheck, AlertCircle } from "lucide-react";

const TYPE_ICON: Record<string, string> = { form: "FileText", certificate: "Award", guideline: "BookOpen", agreement: "FileText" };

export function PartnerForms() {
  const partner = CURRENT_PARTNER;
  const [forms, setForms] = React.useState(formTemplates);
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [uploadTarget, setUploadTarget] = React.useState<string | null>(null);

  const categories = Array.from(new Set(forms.map((f) => f.category)));
  const filtered = forms.filter((f) => {
    if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
    if (typeFilter !== "all" && f.type !== typeFilter) return false;
    if (search && !`${f.name} ${f.description} ${f.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const mandatoryCount = forms.filter((f) => f.mandatory).length;
  const formsCount = forms.filter((f) => f.type === "form").length;
  const agreementsCount = forms.filter((f) => f.type === "agreement").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forms & Assistance"
        description={`${partner.name} — download mandatory forms, upload completed forms, and access compliance documentation.`}
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[{ label: "Upload Form", icon: "Upload", variant: "outline", onClick: () => { setUploadTarget(null); setUploadOpen(true); } }]}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Forms" value={forms.length} icon={<FileText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Mandatory" value={mandatoryCount} icon={<AlertCircle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Standard Forms" value={formsCount} icon={<FileCheck className="h-5 w-5" />} />
        <StatCard label="Agreements" value={agreementsCount} icon={<FileText className="h-5 w-5" />} />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search forms..." className="h-9 w-full pl-8 sm:w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="form">Forms</SelectItem>
                <SelectItem value="certificate">Certificates</SelectItem>
                <SelectItem value="guideline">Guidelines</SelectItem>
                <SelectItem value="agreement">Agreements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-10 text-sm text-muted-foreground">No forms match your filters.</div>
          ) : filtered.map((f) => (
            <Card key={f.id} className="p-4 hover:border-brand hover:shadow-md transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon name={TYPE_ICON[f.type]} className="h-5 w-5" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[10px]">{f.type}</Badge>
                  </div>
                </div>
                {f.mandatory && <Badge variant="default" className="bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20">Mandatory</Badge>}
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-tight">{f.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{f.description}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Category: {f.category}</span>
                <span>Updated {timeAgo(f.lastUpdated)}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Download started", { description: `${f.name}.pdf downloading.` })}>
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setUploadTarget(f.name); setUploadOpen(true); }}>
                  <Upload className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} target={uploadTarget} />
    </div>
  );
}

function UploadDialog({ open, onOpenChange, target }: { open: boolean; onOpenChange: (o: boolean) => void; target: string | null }) {
  const [file, setFile] = React.useState<string | null>(null);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { toast.error("Please select a file"); return; }
    toast.success("Form uploaded", { description: `${file} uploaded for ${target ?? "review"}.` });
    setFile(null);
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Completed Form</DialogTitle>
          <DialogDescription>
            {target ? `Upload your completed version of: ${target}` : "Upload a completed form for review."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Select File</Label>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} accept=".pdf,.doc,.docx,.jpg,.png" />
            <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10 MB)</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
