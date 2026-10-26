"use client";

import * as React from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

type Page = {
  id: string;
  name: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  lastEdited: string;
  lastEditor: string;
};

const PAGES: Page[] = [
  { id: "p1", name: "Home", slug: "/", status: "published", lastEdited: "2024-10-18T10:00:00Z", lastEditor: "Aarav Sharma" },
  { id: "p2", name: "About", slug: "/about", status: "published", lastEdited: "2024-09-22T10:00:00Z", lastEditor: "Sneha Reddy" },
  { id: "p3", name: "Pricing", slug: "/pricing", status: "published", lastEdited: "2024-10-15T10:00:00Z", lastEditor: "Aarav Sharma" },
  { id: "p4", name: "Careers", slug: "/careers", status: "draft", lastEdited: "2024-10-10T10:00:00Z", lastEditor: "Sneha Reddy" },
  { id: "p5", name: "Resources", slug: "/resources", status: "published", lastEdited: "2024-10-12T10:00:00Z", lastEditor: "Aarav Sharma" },
  { id: "p6", name: "Terms", slug: "/terms", status: "published", lastEdited: "2024-08-30T10:00:00Z", lastEditor: "Aarav Sharma" },
  { id: "p7", name: "Privacy", slug: "/privacy", status: "published", lastEdited: "2024-08-30T10:00:00Z", lastEditor: "Aarav Sharma" },
];

const BANNERS = [
  { id: "b1", name: "Diwali Hiring Fest", active: true, clickRate: "3.2%" },
  { id: "b2", name: "Enterprise Demo CTA", active: false, clickRate: "1.8%" },
];

export function AdminCms() {
  const [pages] = React.useState<Page[]>(PAGES);
  const [editTarget, setEditTarget] = React.useState<Page | null>(null);
  const [banners, setBanners] = React.useState(BANNERS);
  const [seoOpen, setSeoOpen] = React.useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        title="CMS & Landing Pages"
        description="Manage marketing pages, banners, and SEO settings."
        icon={<Icon name="FileEdit" className="h-6 w-6" />}
        actions={[{ label: "New page", onClick: () => toast.info("New page (demo)") }, { label: "SEO settings", variant: "outline", onClick: () => setSeoOpen(true) }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Total pages" value={pages.length} icon="FileText" />
        <MiniStat label="Published" value={pages.filter((p) => p.status === "published").length} icon="BadgeCheck" tone="success" />
        <MiniStat label="Drafts" value={pages.filter((p) => p.status === "draft").length} icon="FileEdit" tone="warning" />
        <MiniStat label="Active banners" value={banners.filter((b) => b.active).length} icon="LayoutTemplate" />
      </div>

      <SectionCard title="Landing pages" description="Manage site content. Click a page to edit.">
        <div className="max-h-[28rem] overflow-y-auto scroll-thin rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last edited</TableHead>
                <TableHead>Editor</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.slug}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(p.lastEdited)}</TableCell>
                  <TableCell className="text-sm">{p.lastEditor}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setEditTarget(p)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`Preview ${p.slug} (demo)`)}>Preview</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Banners & hero" description="Site-wide promotional banners.">
          <ul className="space-y-2">
            {banners.map((b) => (
              <li key={b.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">Click rate: {b.clickRate}</p>
                  </div>
                  <Switch checked={b.active} onCheckedChange={(v) => {
                    setBanners((p) => p.map((x) => (x.id === b.id ? { ...x, active: v } : x)));
                    toast.success(`${b.name} ${v ? "activated" : "deactivated"}`);
                  }} />
                </div>
              </li>
            ))}
          </ul>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.info("New banner form (demo)")}>Add banner</Button>
        </SectionCard>

        <SectionCard title="Publish & schedule" description="Upcoming scheduled content changes.">
          <ul className="space-y-2 text-sm">
            {[
              { name: "Diwali Hiring Fest banner", when: "2024-10-28T00:00:00Z", action: "Publish" },
              { name: "Careers page refresh", when: "2024-11-01T00:00:00Z", action: "Publish" },
              { name: "Pricing update v2", when: "2024-11-05T00:00:00Z", action: "Publish" },
            ].map((s) => (
              <li key={s.name} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.action} on {formatDate(s.when)}</p>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <PageEditorDialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)} page={editTarget} onSave={(name, content) => {
        toast.success("Page saved", { description: `${name} updated. ${content.length} chars.` });
        setEditTarget(null);
      }} />

      <SeoDialog open={seoOpen} onOpenChange={setSeoOpen} onSave={() => {
        toast.success("SEO settings saved");
        setSeoOpen(false);
      }} />
    </div>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone?: "success" | "warning" }) {
  const toneCls = tone === "success" ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300" : tone === "warning" ? "text-amber-600 bg-amber-500/10 dark:text-amber-300" : "text-muted-foreground bg-muted";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneCls}`}><Icon name={icon} className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function PageEditorDialog({ open, onOpenChange, page, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; page: Page | null; onSave: (name: string, content: string) => void }) {
  const [content, setContent] = React.useState("");
  React.useEffect(() => { setContent(page ? `# ${page.name}\n\nWelcome to ${page.name}. This is editable content (rich-text editor placeholder).` : ""); }, [page]);
  if (!page) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit: {page.name}</DialogTitle>
          <DialogDescription>Slug: {page.slug} · Rich-text editor (placeholder)</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-1">
          <div className="flex flex-wrap gap-1 border-b pb-2">
            <Button size="sm" variant="ghost" onClick={() => toast.info("Bold (demo)")}><strong>B</strong></Button>
            <Button size="sm" variant="ghost" onClick={() => toast.info("Italic (demo)")}><em>I</em></Button>
            <Button size="sm" variant="ghost" onClick={() => toast.info("H1 (demo)")}>H1</Button>
            <Button size="sm" variant="ghost" onClick={() => toast.info("H2 (demo)")}>H2</Button>
            <Button size="sm" variant="ghost" onClick={() => toast.info("Link (demo)")}>Link</Button>
            <Button size="sm" variant="ghost" onClick={() => toast.info("Image (demo)")}>Image</Button>
          </div>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} className="font-mono text-xs" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => toast.info("Preview opened")}>Preview</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave(page.name, content)}>Save draft</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { onSave(page.name, content); toast.success("Page published"); }}>Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SeoDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; onSave: () => void }) {
  const [title, setTitle] = React.useState("JOBSONN — Hire smarter. Hire faster.");
  const [description, setDescription] = React.useState("JOBSONN is India's AI-powered hiring platform connecting employers with verified talent.");
  const [keywords, setKeywords] = React.useState("hiring, jobs, recruitment, india");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SEO settings</DialogTitle>
          <DialogDescription>Default site-wide SEO meta. Per-page overrides supported.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5"><Label htmlFor="seo-title">Default title</Label><Input id="seo-title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="seo-desc">Default description</Label><Textarea id="seo-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
          <div className="space-y-1.5"><Label htmlFor="seo-kw">Keywords</Label><Input id="seo-kw" value={keywords} onChange={(e) => setKeywords(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
