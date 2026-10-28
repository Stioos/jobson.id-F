"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Trainer {
  id: string; name: string; expertise: string; provider: string; rating: number; courses: number; students: number; utilization: number; certified: boolean; score: number;
}

const TRAINERS: Trainer[] = [
  { id: "TR-001", name: "Dr. Anita Krishnan", expertise: "React / Frontend", provider: "CodeCraft Bootcamp", rating: 4.8, courses: 12, students: 482, utilization: 86, certified: true, score: 92 },
  { id: "TR-002", name: "Rajesh Khanna", expertise: "Python / ML", provider: "DataInsight Labs", rating: 4.9, courses: 8, students: 318, utilization: 92, certified: true, score: 95 },
  { id: "TR-003", name: "Lakshmi Menon", expertise: "AWS / Cloud", provider: "CloudMaster Academy", rating: 4.6, courses: 15, students: 296, utilization: 78, certified: true, score: 88 },
  { id: "TR-004", name: "Suresh Pillai", expertise: "Sales / Negotiation", provider: "SalesPro Trainers", rating: 4.3, courses: 6, students: 184, utilization: 64, certified: false, score: 72 },
  { id: "TR-005", name: "Deepa Raghavan", expertise: "Leadership / Soft Skills", provider: "SoftSkill Studio", rating: 4.7, courses: 9, students: 248, utilization: 82, certified: true, score: 90 },
  { id: "TR-006", name: "Vijay Anand", expertise: "Kubernetes / DevOps", provider: "CloudMaster Academy", rating: 4.4, courses: 5, students: 112, utilization: 58, certified: false, score: 76 },
  { id: "TR-007", name: "Kavita Nair", expertise: "Excel / Finance", provider: "Apex Skill Academy", rating: 4.5, courses: 11, students: 364, utilization: 84, certified: true, score: 86 },
  { id: "TR-008", name: "Manoj Gupta", expertise: "Digital Marketing", provider: "SalesPro Trainers", rating: 4.1, courses: 4, students: 96, utilization: 42, certified: false, score: 64 },
];

export function SuperAdminTrainersDirectory() {
  const [search, setSearch] = React.useState("");
  const [provider, setProvider] = React.useState("all");

  const filtered = TRAINERS.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.expertise.toLowerCase().includes(q);
    const matchProvider = provider === "all" || t.provider === provider;
    return matchSearch && matchProvider;
  });

  const providers = Array.from(new Set(TRAINERS.map(t => t.provider)));
  const avgRating = (TRAINERS.reduce((a, t) => a + t.rating, 0) / TRAINERS.length).toFixed(2);
  const avgUtilization = Math.round(TRAINERS.reduce((a, t) => a + t.utilization, 0) / TRAINERS.length);

  const scoreTone = (s: number) => s >= 90 ? "text-emerald-600" : s >= 75 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Trainers"
        description="Trainer directory across all training providers — expertise, ratings, course volume, utilization, and certification status."
        icon={<Icon name="GraduationCap" className="h-6 w-6" />}
        actions={[{ label: "Export", variant: "outline", onClick: () => toast.success("Trainer directory export queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Total Trainers" value={TRAINERS.length} icon={<Icon name="GraduationCap" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Certified" value={TRAINERS.filter(t => t.certified).length} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg Rating" value={avgRating} icon={<Icon name="Star" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Avg Utilization" value={`${avgUtilization}%`} icon={<Icon name="Activity" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Top Performers" description="Highest-scoring trainers (composite scorecard)">
        <div className="grid gap-3 md:grid-cols-2">
          {[...TRAINERS].sort((a, b) => b.score - a.score).slice(0, 4).map((t, i) => (
            <Card key={t.id} className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${i === 0 ? "bg-amber-500/15 text-amber-600" : "bg-brand/10 text-brand"}`}>
                <Icon name={i === 0 ? "Trophy" : "Star"} className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.expertise} · {t.provider}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-semibold ${scoreTone(t.score)}`}>{t.score}</p>
                <p className="text-xs text-muted-foreground">{t.rating}★ · {t.utilization}% util</p>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Trainer Directory" description={`${filtered.length} of ${TRAINERS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search trainer or expertise…" className="h-9 max-w-sm" />
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="h-8 w-44 text-xs"><SelectValue placeholder="Provider" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Cert</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium">{t.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{t.id}</div>
                  </TableCell>
                  <TableCell className="text-xs">{t.expertise}</TableCell>
                  <TableCell className="text-xs">{t.provider}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" className="h-3 w-3 text-amber-500" />
                      <span className="text-xs">{t.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{t.courses}</TableCell>
                  <TableCell className="text-xs">{t.students}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress className="h-1.5 w-14" value={t.utilization} />
                      <span className="text-xs">{t.utilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-sm font-medium ${scoreTone(t.score)}`}>{t.score}</TableCell>
                  <TableCell>
                    {t.certified ? <Icon name="BadgeCheck" className="h-4 w-4 text-emerald-500" /> : <Icon name="AlertTriangle" className="h-4 w-4 text-amber-500" />}
                  </TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${t.name}'s scorecard…`)}>View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
