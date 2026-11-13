"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { formatDate, timeAgo } from "@/lib/format";

type Category = "Brochures" | "Posters" | "Social Media Kits" | "Video Reels" | "Email Templates";
type Lang = "English" | "Hindi" | "Kannada" | "Tamil" | "Telugu" | "Bilingual";

interface Material {
  id: string; title: string; category: Category; type: string; lang: Lang;
  downloads: number; lastUpdated: string; thumbColor: string;
}

const SEED: Material[] = [
  { id: "m1", title: "jobson.id Brand Brochure 2025", category: "Brochures", type: "PDF · 4pp", lang: "English", downloads: 248, lastUpdated: "2025-01-12", thumbColor: "bg-brand/20" },
  { id: "m2", title: "Talent Solutions One-Pager", category: "Brochures", type: "PDF · 1pp", lang: "English", downloads: 312, lastUpdated: "2025-01-10", thumbColor: "bg-amber-500/20" },
  { id: "m3", title: "Hindi Brand Brochure", category: "Brochures", type: "PDF · 4pp", lang: "Hindi", downloads: 96, lastUpdated: "2025-01-05", thumbColor: "bg-teal-500/20" },
  { id: "m4", title: "Campus Drive Poster — A2", category: "Posters", type: "PNG · A2", lang: "Bilingual", downloads: 184, lastUpdated: "2025-01-08", thumbColor: "bg-rose-500/20" },
  { id: "m5", title: "Now Hiring — Engineer", category: "Posters", type: "PNG · A3", lang: "English", downloads: 268, lastUpdated: "2025-01-14", thumbColor: "bg-violet-500/20" },
  { id: "m6", title: "Instagram Carousel — Career Tips", category: "Social Media Kits", type: "PSD · 1080×1080", lang: "English", downloads: 412, lastUpdated: "2025-01-15", thumbColor: "bg-brand/20" },
  { id: "m7", title: "LinkedIn Banner Pack", category: "Social Media Kits", type: "PNG · 1584×396", lang: "English", downloads: 358, lastUpdated: "2025-01-13", thumbColor: "bg-amber-500/20" },
  { id: "m8", title: "Festive Hiring Reel", category: "Video Reels", type: "MP4 · 30s", lang: "English", downloads: 192, lastUpdated: "2025-01-09", thumbColor: "bg-teal-500/20" },
  { id: "m9", title: "Talent Sourcing Promo Reel", category: "Video Reels", type: "MP4 · 45s", lang: "Bilingual", downloads: 144, lastUpdated: "2025-01-11", thumbColor: "bg-rose-500/20" },
  { id: "m10", title: "Welcome Email — New Partner", category: "Email Templates", type: "HTML", lang: "English", downloads: 86, lastUpdated: "2025-01-04", thumbColor: "bg-violet-500/20" },
  { id: "m11", title: "Drive Announcement Email", category: "Email Templates", type: "HTML", lang: "English", downloads: 124, lastUpdated: "2025-01-06", thumbColor: "bg-brand/20" },
  { id: "m12", title: "Regional Email — Karnataka", category: "Email Templates", type: "HTML", lang: "Kannada", downloads: 48, lastUpdated: "2025-01-03", thumbColor: "bg-amber-500/20" },
];

const CATEGORIES: Category[] = ["Brochures", "Posters", "Social Media Kits", "Video Reels", "Email Templates"];

export function PartnerMarketingMaterials() {
  const [items, setItems] = React.useState<Material[]>(SEED);
  const [tab, setTab] = React.useState<Category>("Brochures");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", type: "", lang: "English" as Lang });

  const visible = items.filter((i) => i.category === tab);
  const totalDownloads = items.reduce((s, i) => s + i.downloads, 0);
  const topItem = [...items].sort((a, b) => b.downloads - a.downloads)[0];
  const localized = items.filter((i) => i.lang !== "English").length;

  const download = (m: Material) => {
    setItems((is) => is.map((x) => x.id === m.id ? { ...x, downloads: x.downloads + 1 } : x));
    toast.success(`Downloading: ${m.title}`);
  };
  const upload = () => {
    if (!form.title.trim() || !form.type.trim()) { toast.error("Title and type required"); return; }
    const m: Material = {
      id: `m${Date.now()}`, title: form.title.trim(), category: tab, type: form.type.trim(),
      lang: form.lang, downloads: 0, lastUpdated: new Date().toISOString().slice(0, 10),
      thumbColor: "bg-brand/20",
    };
    setItems((is) => [m, ...is]);
    setUploadOpen(false); setForm({ title: "", type: "", lang: "English" });
    toast.success("Material uploaded");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Materials"
        description="Brand-approved collateral library — brochures, posters, social kits, reels & email templates."
        icon={<Icon name="FolderOpen" className="h-6 w-6" />}
        actions={[{ label: "Upload Material", icon: "Upload", onClick: () => setUploadOpen(true) }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Materials" value={items.length} icon={<Icon name="FolderOpen" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Total Downloads" value={totalDownloads.toLocaleString("en-IN")} icon={<Icon name="Download" className="h-5 w-5" />} />
        <StatCard label="Most Downloaded" value={topItem?.downloads ?? 0} hint={topItem?.title} icon={<Icon name="TrendingUp" className="h-5 w-5" />} tone="success" />
        <StatCard label="Localized" value={localized} icon={<Icon name="Globe" className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button key={c} variant={tab === c ? "default" : "outline"} size="sm" className={tab === c ? "bg-brand text-white hover:bg-brand/90" : ""} onClick={() => setTab(c)}>
            {c}
          </Button>
        ))}
      </div>

      <SectionCard title={tab} description={`${visible.length} materials`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <div className={`flex h-28 items-center justify-center ${m.thumbColor}`}>
                <Icon name={m.category === "Video Reels" ? "Video" : m.category === "Email Templates" ? "Mail" : "FileText"} className="h-10 w-10 text-brand" />
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium leading-tight">{m.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.type}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  <Badge variant="outline" className="text-[9px]">{m.lang}</Badge>
                  <Badge variant="outline" className="text-[9px]">{m.downloads} downloads</Badge>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">Updated {formatDate(m.lastUpdated)}</p>
                <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => download(m)}>
                  <Icon name="Download" className="mr-1 h-3 w-3" /> Download
                </Button>
              </CardContent>
            </Card>
          ))}
          {visible.length === 0 && (
            <div className="col-span-full"><EmptyState icon={<Icon name="FolderOpen" className="h-5 w-5" />} title="No materials in this category" /></div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Usage Analytics" description="Most downloaded materials & partner usage">
        <div className="space-y-2">
          {[...items].sort((a, b) => b.downloads - a.downloads).slice(0, 5).map((m, i) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.category} · {m.lang}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-24 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(m.downloads / topItem.downloads) * 100}%` }} />
                </div>
                <Badge variant="outline" className="text-brand">{m.downloads}</Badge>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Material — {tab}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Material name" /></div>
            <div><Label>Type / Format</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="e.g. PDF · 4pp" /></div>
            <div>
              <Label>Language</Label>
              <Select value={form.lang} onValueChange={(v: Lang) => setForm({ ...form, lang: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Kannada">Kannada</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Bilingual">Bilingual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
              <Icon name="Upload" className="mx-auto mb-2 h-6 w-6" />
              Drop file here or click to browse (mock)
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={upload} className="bg-brand text-white hover:bg-brand/90">Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
