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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface CmsItem {
  id: string; type: string; title: string; slug: string; status: string; updatedAt: string; author: string;
}

const ITEMS: CmsItem[] = [
  { id: "cms_001", type: "Landing Page", title: "Homepage", slug: "/", status: "published", updatedAt: "2024-09-20", author: "Aarav Sharma" },
  { id: "cms_002", type: "Landing Page", title: "For Employers", slug: "/employers", status: "published", updatedAt: "2024-09-18", author: "Aarav Sharma" },
  { id: "cms_003", type: "Blog Post", title: "10 Resume Tips for 2024", slug: "/blog/resume-tips-2024", status: "published", updatedAt: "2024-09-15", author: "Priya Nair" },
  { id: "cms_004", type: "Blog Post", title: "Hiring Trends in India", slug: "/blog/hiring-trends-india", status: "draft", updatedAt: "2024-09-21", author: "Rohan Mehta" },
  { id: "cms_005", type: "Banner", title: "Diwali Promo Banner", slug: "/banner/diwali-2024", status: "scheduled", updatedAt: "2024-09-19", author: "Aarav Sharma" },
  { id: "cms_006", type: "Legal Page", title: "Terms of Service", slug: "/legal/terms", status: "published", updatedAt: "2024-08-10", author: "Legal Team" },
  { id: "cms_007", type: "Legal Page", title: "Privacy Policy", slug: "/legal/privacy", status: "published", updatedAt: "2024-08-10", author: "Legal Team" },
  { id: "cms_008", type: "Blog Post", title: "How to Ace Interviews", slug: "/blog/ace-interviews", status: "draft", updatedAt: "2024-09-21", author: "Sneha Reddy" },
];

export function SuperAdminCms() {
  const [items, setItems] = React.useState(ITEMS);
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("Blog Post");
  const [body, setBody] = React.useState("");

  const create = () => {
    if (!title) { toast.error("Title required"); return; }
    const slug = `/${type.toLowerCase().replace(/ /g, "-")}/${title.toLowerCase().replace(/ /g, "-")}`;
    setItems([{ id: `cms_${Date.now()}`, type, title, slug, status: "draft", updatedAt: new Date().toISOString().slice(0, 10), author: "You" }, ...items]);
    setTitle(""); setBody("");
    toast.success("Content created as draft");
  };

  const statusBadge = (s: string) => {
    const cls = s === "published" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "scheduled" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CMS"
        description="Manage landing pages, blog posts, banners, and legal pages with versioning."
        icon={<Icon name="FileText" className="h-6 w-6" />}
        actions={[{ label: "Media Library", variant: "outline", onClick: () => toast.info("Opening media library") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Items" value={items.length} icon={<Icon name="FileText" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Published" value={items.filter(i => i.status === "published").length} icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Drafts" value={items.filter(i => i.status === "draft").length} icon={<Icon name="PenSquare" className="h-5 w-5" />} />
        <StatCard label="Scheduled" value={items.filter(i => i.status === "scheduled").length} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="New Content" description="Create page or post" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Landing Page">Landing Page</SelectItem>
                  <SelectItem value="Blog Post">Blog Post</SelectItem>
                  <SelectItem value="Banner">Banner</SelectItem>
                  <SelectItem value="Legal Page">Legal Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My new post" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Body (excerpt)</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="mt-1" />
            </div>
            <Button className="w-full" onClick={create}><Icon name="Plus" className="mr-1 h-4 w-4" /> Create Draft</Button>
          </div>
        </SectionCard>

        <SectionCard title="Content Library" description={`${items.length} items`} className="lg:col-span-2" contentClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(i => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.title}</TableCell>
                  <TableCell><Badge variant="outline">{i.type}</Badge></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{i.slug}</TableCell>
                  <TableCell className="text-xs">{i.author}</TableCell>
                  <TableCell className="text-xs">{formatDate(i.updatedAt)}</TableCell>
                  <TableCell>{statusBadge(i.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </div>
  );
}
