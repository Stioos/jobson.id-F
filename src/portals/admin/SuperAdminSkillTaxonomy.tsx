"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Skill {
  id: string; name: string; aliases: string[]; category: string; level: string; jobsLinked: number; verified: boolean;
}

const SKILLS: Skill[] = [
  { id: "sk_001", name: "React", aliases: ["ReactJS", "React.js"], category: "Frontend", level: "Framework", jobsLinked: 1840, verified: true },
  { id: "sk_002", name: "TypeScript", aliases: ["TS"], category: "Frontend", level: "Language", jobsLinked: 1620, verified: true },
  { id: "sk_003", name: "Node.js", aliases: ["NodeJS", "Node"], category: "Backend", level: "Runtime", jobsLinked: 1280, verified: true },
  { id: "sk_004", name: "Python", aliases: ["py"], category: "Backend", level: "Language", jobsLinked: 2140, verified: true },
  { id: "sk_005", name: "PostgreSQL", aliases: ["Postgres", "pg"], category: "Database", level: "RDBMS", jobsLinked: 980, verified: true },
  { id: "sk_006", name: "AWS", aliases: ["Amazon Web Services"], category: "DevOps", level: "Cloud", jobsLinked: 1420, verified: true },
  { id: "sk_007", name: "Docker", aliases: ["Containers"], category: "DevOps", level: "Tool", jobsLinked: 1080, verified: true },
  { id: "sk_008", name: "Kubernetes", aliases: ["K8s"], category: "DevOps", level: "Orchestrator", jobsLinked: 720, verified: true },
  { id: "sk_009", name: "TensorFlow", aliases: ["TF"], category: "AI/ML", level: "Framework", jobsLinked: 320, verified: false },
  { id: "sk_010", name: "Salesforce", aliases: ["SF", "SFDC"], category: "CRM", level: "Platform", jobsLinked: 480, verified: true },
];

export function SuperAdminSkillTaxonomy() {
  const [search, setSearch] = React.useState("");
  const [skills, setSkills] = React.useState(SKILLS);
  const [newName, setNewName] = React.useState("");
  const [newCat, setNewCat] = React.useState("");

  const filtered = skills.filter(s => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.aliases.some(a => a.toLowerCase().includes(q)) || s.category.toLowerCase().includes(q);
  });

  const addSkill = () => {
    if (!newName) { toast.error("Skill name required"); return; }
    setSkills([{ id: `sk_${Date.now()}`, name: newName, aliases: [], category: newCat || "General", level: "Skill", jobsLinked: 0, verified: false }, ...skills]);
    setNewName(""); setNewCat("");
    toast.success("Skill added to graph");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Taxonomy"
        description="Centralized skill graph with aliases, categories, and levels. Used for AI matching and search."
        icon={<Icon name="Brain" className="h-6 w-6" />}
        actions={[{ label: "Rebuild Graph", variant: "outline", onClick: () => toast.success("Skill graph rebuild queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Skills" value={skills.length} icon={<Icon name="Brain" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Categories" value={new Set(skills.map(s => s.category)).size} icon={<Icon name="Layers" className="h-5 w-5" />} />
        <StatCard label="Verified" value={skills.filter(s => s.verified).length} icon={<Icon name="ShieldCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Aliases" value={skills.reduce((s, x) => s + x.aliases.length, 0)} icon={<Icon name="Tags" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Add Skill" description="Extend the skill graph" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Skill name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. GraphQL" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="e.g. API" className="mt-1" />
            </div>
            <Button className="w-full" onClick={addSkill}><Icon name="Plus" className="mr-1 h-4 w-4" /> Add Skill</Button>
          </div>
        </SectionCard>

        <SectionCard title="Skill Graph" description={`${filtered.length} skills`} className="lg:col-span-2">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skills or aliases…" className="mb-3 h-9" />
          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {filtered.map(s => (
              <div key={s.id} className="rounded-lg border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.name}</span>
                      {s.verified && <Icon name="ShieldCheck" className="h-3.5 w-3.5 text-emerald-500" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.category} • {s.level}</div>
                  </div>
                  <div className="text-right text-xs">
                    <Badge variant="secondary">{s.jobsLinked} jobs</Badge>
                  </div>
                </div>
                {s.aliases.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.aliases.map(a => (
                      <Badge key={a} variant="outline" className="text-[10px]">{a}</Badge>
                    ))}
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
