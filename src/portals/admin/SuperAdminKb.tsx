"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

interface Article {
  id: string; title: string; category: string; status: "published" | "draft"; views: number; updatedAt: string; author: string;
}

const ARTICLES: Article[] = [
  { id: "kb_001", title: "How to post your first job", category: "Employer", status: "published", views: 8_420, updatedAt: "2024-09-18", author: "Support Team" },
  { id: "kb_002", title: "Understanding partner revenue splits", category: "Partner", status: "published", views: 4_280, updatedAt: "2024-09-15", author: "Finance Team" },
  { id: "kb_003", title: "GST invoice generation guide", category: "Recruiter", status: "published", views: 6_400, updatedAt: "2024-09-12", author: "Billing Team" },
  { id: "kb_004", title: "Optimizing your candidate profile", category: "Candidate", status: "published", views: 12_180, updatedAt: "2024-09-10", author: "Support Team" },
  { id: "kb_005", title: "Course certification workflow", category: "Training", status: "published", views: 3_120, updatedAt: "2024-09-08", author: "Training Team" },
  { id: "kb_006", title: "API rate limits and quotas", category: "Developer", status: "published", views: 1_840, updatedAt: "2024-09-05", author: "Engineering" },
  { id: "kb_007", title: "Resume builder pro tips (draft)", category: "Candidate", status: "draft", views: 0, updatedAt: "2024-09-21", author: "Support Team" },
  { id: "kb_008", title: "Bulk import employers (CSV)", category: "Admin", status: "draft", views: 0, updatedAt: "2024-09-20", author: "Platform Admin" },
];

const CATS = ["Candidate", "Employer", "Recruiter", "Training", "Partner", "Developer", "Admin"];

export function SuperAdminKb() {
  const [search, setSearch] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [newCat, setNewCat] = React.useState("Candidate");
  const [articles, setArticles] = React.useState(ARTICLES);

  const filtered = articles.filter(a => {
    const s = search.toLowerCase();
    const m1 = !s || a.title.toLowerCase().includes(s);
    const m2 = cat === "all" || a.category === cat;
    return m1 && m2;
  });

  const create = () => {
    if (!title || !body) { toast.error("Title and body required"); return; }
    setArticles([{ id: `kb_${Date.now()}`, title, category: newCat, status: "draft", views: 0, updatedAt: new Date().toISOString().slice(0, 10), author: "You" }, ...articles]);
    setTitle(""); setBody("");
    toast.success("Article saved as draft");
  };

  const publish = (id: string) => {
    setArticles(articles.map(a => a.id === id ? { ...a, status: "published" } : a));
    toast.success("Article published");
  };

  const statusBadge = (s: string) => {
    const cls = s === "published" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        description="Help articles organized by category and portal. Create, edit, publish."
        icon={<Icon name="BookOpen" className="h-6 w-6" />}
        actions={[{ label: "View Public KB", variant: "outline", onClick: () => toast.info("Opening public KB") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Articles" value={articles.length} icon={<Icon name="BookOpen" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Published" value={articles.filter(a => a.status === "published").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Drafts" value={articles.filter(a => a.status === "draft").length} icon={<Icon name="PenSquare" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Total Views (30d)" value="36.2K" icon={<Icon name="Eye" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="New Article" description="Create help article" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="How to…" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={newCat} onValueChange={setNewCat}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Body (Markdown)</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="mt-1 font-mono text-xs" />
            </div>
            <Button className="w-full" onClick={create}><Icon name="Plus" className="mr-1 h-4 w-4" /> Save Draft</Button>
          </div>
        </SectionCard>

        <SectionCard title="Article Library" description={`${filtered.length} of ${articles.length}`} className="lg:col-span-2">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles…" className="h-9 max-w-xs" />
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            {filtered.map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{a.title}</span>
                    {statusBadge(a.status)}
                    <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">by {a.author} • updated {formatDate(a.updatedAt)} • {a.views.toLocaleString("en-IN")} views</div>
                </div>
                <div className="flex gap-1">
                  {a.status === "draft" && <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => publish(a.id)}>Publish</Button>}
                  <Button variant="ghost" size="sm" onClick={() => toast.info(`Editing ${a.title}`)}>Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
