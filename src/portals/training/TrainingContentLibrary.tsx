"use client";

import * as React from "react";
import { contentLibrary, trainers } from "@/lib/lms-data";
import type { ContentLibraryItem } from "@/lib/types";
import { PageHeader, SectionCard, StatCard, StatusBadge, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate, formatNumber } from "@/lib/format";
import { TenantDisclaimer } from "./_shared";
import { toast } from "sonner";
import {
  Plus, Search, FolderOpen, FileText, FileImage, FileVideo,
  Presentation, FileCode, Upload, Download, Eye, Trash2, UploadCloud, Link as LinkIcon,
} from "lucide-react";

const TYPE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText, image: FileImage, video: FileVideo,
  presentation: Presentation, document: FileText, template: FileCode,
  audio: FileVideo, scorm: FileText,
};

const TYPES = ["pdf", "image", "video", "presentation", "document", "template"];
const CATEGORIES = ["Technology", "Leadership", "Compliance", "Sales", "Data & AI"];

export function TrainingContentLibrary() {
  const [rows, setRows] = React.useState<ContentLibraryItem[]>(contentLibrary);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState<ContentLibraryItem | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploadTitle, setUploadTitle] = React.useState("");
  const [uploadType, setUploadType] = React.useState("pdf");
  const [uploadCategory, setUploadCategory] = React.useState("Technology");

  const filtered = rows.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.tags.some((t) => t.includes(search.toLowerCase()));
    const matchType = typeFilter === "all" || r.type === typeFilter;
    const matchCat = categoryFilter === "all" || r.category === categoryFilter;
    return matchSearch && matchType && matchCat;
  });

  const totalUsage = rows.reduce((s, r) => s + r.usageCount, 0);

  function upload() {
    if (!uploadTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    const newItem: ContentLibraryItem = {
      id: `cl_new_${Date.now()}`,
      title: uploadTitle,
      type: uploadType as ContentLibraryItem["type"],
      category: uploadCategory,
      size: "1.0 MB",
      uploadedBy: "Divya Sharma",
      uploadedAt: new Date().toISOString(),
      tags: [],
      usageCount: 0,
    };
    setRows((r) => [newItem, ...r]);
    setUploadOpen(false);
    setUploadTitle("");
    toast.success(`Uploaded — ${uploadTitle}`);
  }

  function confirmDelete() {
    if (!deleteItem) return;
    setRows((r) => r.filter((x) => x.id !== deleteItem.id));
    toast.success(`Deleted — ${deleteItem.title}`);
    setDeleteItem(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Content Library"
        description="Centralized repository for training materials, templates, and assets."
        icon={<Icon name="FolderOpen" className="h-6 w-6" />}
        actions={[{ label: "Upload", icon: "Upload", onClick: () => setUploadOpen(true) }]}
      />
      <TenantDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Assets" value={rows.length} icon={<FolderOpen className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Usage" value={formatNumber(totalUsage)} icon={<Download className="h-5 w-5" />} />
        <StatCard label="Categories" value={new Set(rows.map((r) => r.category)).size} icon={<FolderOpen className="h-5 w-5" />} />
        <StatCard label="Avg Usage / Asset" value={rows.length > 0 ? Math.round(totalUsage / rows.length) : 0} icon={<Eye className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<FolderOpen className="h-5 w-5" />} title="No assets found" description="Adjust filters or upload new content." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const IconCmp = TYPE_ICONS[r.type] ?? FileText;
                  return (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                            <IconCmp className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-sm">{r.title}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="capitalize text-xs">{r.type}</Badge></TableCell>
                      <TableCell className="text-sm">{r.category}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.size}</TableCell>
                      <TableCell className="text-sm">{r.uploadedBy}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(r.uploadedAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {r.tags.slice(0, 2).map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">{formatNumber(r.usageCount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => toast.info(`Previewing: ${r.title}`)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading: ${r.title}`)}><Download className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteItem(r)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Content</DialogTitle>
            <DialogDescription>Add a new asset to the content library.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragOver ? "border-brand bg-brand/5" : "border-muted-foreground/30"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); toast.success("File dropped — simulating upload"); }}
            >
              <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Drag & drop files here</p>
              <p className="text-xs text-muted-foreground">PDF, images, videos, presentations up to 100MB</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info("Browse dialog (simulated)")}>
                <LinkIcon className="mr-1 h-3 w-3" />Browse
              </Button>
            </div>
            <div>
              <Label htmlFor="up-title">Title *</Label>
              <Input id="up-title" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={upload}><Upload className="mr-1 h-4 w-4" />Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-medium">{deleteItem?.title}</span> from the content library. Used {deleteItem ? formatNumber(deleteItem.usageCount) : 0} times.
            </AlertDialogDescription>
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
