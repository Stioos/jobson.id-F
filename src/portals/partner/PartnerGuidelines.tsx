"use client";

import * as React from "react";
import { formTemplates } from "@/lib/partner-data";
import { CURRENT_PARTNER, PartnerDisclaimer } from "./_shared";
import { PageHeader, StatCard, SectionCard, StatusBadge, Card, CardContent } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { BookOpen, Search, Download, ChevronDown, ShieldCheck, FileText, AlertCircle } from "lucide-react";

export function PartnerGuidelines() {
  const partner = CURRENT_PARTNER;
  const guidelines = formTemplates.filter((f) => f.type === "guideline");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | null>(guidelines[0]?.id ?? null);

  const categories = Array.from(new Set(guidelines.map((g) => g.category)));
  const filtered = guidelines.filter((g) => {
    if (categoryFilter !== "all" && g.category !== categoryFilter) return false;
    if (search && !`${g.name} ${g.description} ${g.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const mandatoryCount = guidelines.filter((g) => g.mandatory).length;

  // Extended descriptions for each guideline
  const guidelineContent: Record<string, string> = {
    "ftm_005": "GST filing guidelines cover GSTR-1 (monthly outward supplies), GSTR-3B (monthly summary return), and annual GSTR-9. Partners must file by the 20th of the following month. Late filing attracts ₹50/day penalty (CGST + SGST). Input tax credit (ITC) must be reconciled with GSTR-2B before filing.",
    "ftm_009": "DPDP Act compliance requires: (1) Appoint a Data Protection Officer; (2) Obtain explicit consent for data collection; (3) Implement reasonable security safeguards; (4) Notify breaches within 72 hours; (5) Provide data access/correction rights to individuals; (6) Maintain data processing records; (7) Cross-border transfer only to notified countries.",
    "ftm_010": "Co-branding guidelines specify: (1) Logo placement — JOBSONN logo must occupy at least 40% of co-branded materials; (2) Approved color palette (emerald + neutrals); (3) Typography — use JOBSONN-approved fonts; (4) Tagline usage — 'Powered by JOBSONN'; (5) Marketing collateral approval process; (6) Centre signage specifications.",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guidelines & Policies"
        description={`${partner.name} — compliance guidelines, policies, and operational standards.`}
        icon={<Icon name="BookOpen" className="h-6 w-6" />}
      />
      <PartnerDisclaimer />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Guidelines" value={guidelines.length} icon={<BookOpen className="h-5 w-5" />} tone="brand" />
        <StatCard label="Mandatory" value={mandatoryCount} icon={<AlertCircle className="h-5 w-5" />} tone="warning" />
        <StatCard label="Categories" value={categories.length} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Compliance Score" value="92%" icon={<ShieldCheck className="h-5 w-5" />} tone="success" hint="Above threshold" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guidelines..." className="h-9 w-full pl-8 sm:w-64" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">No guidelines match your filters.</div>
          ) : filtered.map((g) => {
            const isOpen = expanded === g.id;
            return (
              <div key={g.id} className="rounded-lg border">
                <button
                  onClick={() => setExpanded(isOpen ? null : g.id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{g.name}</h3>
                        {g.mandatory && <Badge variant="default" className="bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20">Mandatory</Badge>}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{g.description}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">Category: {g.category} · Updated {formatDate(g.lastUpdated)}</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-3">
                    <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                      <p className="leading-relaxed">
                        {guidelineContent[g.id] ?? `${g.description}. This guideline applies to all ${g.category.toLowerCase()} operations. Please review carefully and ensure your centre/team is in full compliance.`}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success("Download started", { description: `${g.name}.pdf downloading.` })}>
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Download PDF
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info("Opening detailed view", { description: g.name })}>
                        Read More →
                      </Button>
                      {g.mandatory && (
                        <Button size="sm" variant="ghost" className="ml-auto text-emerald-600" onClick={() => toast.success("Acknowledged", { description: `${g.name} marked as reviewed.` })}>
                          Mark as Reviewed
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
