"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Category {
  id: string; name: string; subCats: string[]; roleTemplates: number; jobsLinked: number;
}

const CATEGORIES: Category[] = [
  { id: "cat_001", name: "Software Engineering", subCats: ["Frontend", "Backend", "DevOps", "Mobile", "Data"], roleTemplates: 42, jobsLinked: 4820 },
  { id: "cat_002", name: "Data & AI", subCats: ["Data Science", "ML Engineering", "Data Engineering", "Analytics"], roleTemplates: 28, jobsLinked: 2140 },
  { id: "cat_003", name: "Sales & Marketing", subCats: ["B2B Sales", "Digital Marketing", "Content", "Growth"], roleTemplates: 36, jobsLinked: 3280 },
  { id: "cat_004", name: "Finance & Accounting", subCats: ["Accounting", "FP&A", "Audit", "Treasury"], roleTemplates: 22, jobsLinked: 1480 },
  { id: "cat_005", name: "Operations", subCats: ["Supply Chain", "Procurement", "Logistics", "Quality"], roleTemplates: 18, jobsLinked: 920 },
  { id: "cat_006", name: "Human Resources", subCats: ["Recruitment", "L&D", "Payroll", "HRBP"], roleTemplates: 14, jobsLinked: 640 },
  { id: "cat_007", name: "Healthcare", subCats: ["Clinical", "Allied Health", "Admin"], roleTemplates: 12, jobsLinked: 380 },
];

export function SuperAdminJobTaxonomy() {
  const [name, setName] = React.useState("");
  const [cats, setCats] = React.useState(CATEGORIES);
  const [expanded, setExpanded] = React.useState<string | null>("cat_001");

  const addCategory = () => {
    if (!name) { toast.error("Category name required"); return; }
    setCats([{ id: `cat_${Date.now()}`, name, subCats: [], roleTemplates: 0, jobsLinked: 0 }, ...cats]);
    setName("");
    toast.success("Category created");
  };

  const addSub = (id: string) => {
    const sub = prompt("Sub-category name?");
    if (sub) {
      setCats(cats.map(c => c.id === id ? { ...c, subCats: [...c.subCats, sub] } : c));
      toast.success("Sub-category added");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Taxonomy"
        description="Manage job categories, sub-categories, and role templates used across the platform."
        icon={<Icon name="Briefcase" className="h-6 w-6" />}
        actions={[{ label: "Export Taxonomy", variant: "outline", onClick: () => toast.success("Taxonomy exported") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Categories" value={cats.length} icon={<Icon name="Briefcase" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Sub-Categories" value={cats.reduce((s, c) => s + c.subCats.length, 0)} icon={<Icon name="Layers" className="h-5 w-5" />} />
        <StatCard label="Role Templates" value={cats.reduce((s, c) => s + c.roleTemplates, 0)} icon={<Icon name="LayoutTemplate" className="h-5 w-5" />} tone="success" />
        <StatCard label="Jobs Linked" value={cats.reduce((s, c) => s + c.jobsLinked, 0).toLocaleString("en-IN")} icon={<Icon name="FileText" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Add Category" description="Create a new top-level category" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Category name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Legal & Compliance" className="mt-1" />
            </div>
            <Button className="w-full" onClick={addCategory}><Icon name="Plus" className="mr-1 h-4 w-4" /> Create</Button>
          </div>
        </SectionCard>

        <SectionCard title="Category Tree" description="Click to expand" className="lg:col-span-2">
          <div className="space-y-2">
            {cats.map(c => (
              <div key={c.id} className="rounded-lg border bg-card">
                <button
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="Briefcase" className="h-4 w-4 text-brand" />
                    <span className="font-medium">{c.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{c.subCats.length} subs</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{c.roleTemplates} templates</span>
                    <span>{c.jobsLinked.toLocaleString("en-IN")} jobs</span>
                    <Icon name="ChevronDown" className={`h-4 w-4 transition-transform ${expanded === c.id ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {expanded === c.id && (
                  <div className="border-t p-3">
                    <div className="mb-2 text-xs font-medium text-muted-foreground">Sub-categories</div>
                    <div className="flex flex-wrap gap-2">
                      {c.subCats.map(s => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                      {c.subCats.length === 0 && <span className="text-xs text-muted-foreground">No sub-categories</span>}
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 h-7 text-xs" onClick={() => addSub(c.id)}>
                      <Icon name="Plus" className="mr-1 h-3 w-3" /> Add Sub
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
