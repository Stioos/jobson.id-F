"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

interface Exit {
  id: string; employee: string; employer: string; reason: "resignation" | "termination" | "absconded" | "retirement"; exitDate: string; clearance: "pending" | "completed" | "delayed"; fnf: "pending" | "processed" | "disputed"; interview: "pending" | "completed" | "skipped";
}

const EXITS: Exit[] = [
  { id: "EX-2024-301", employee: "Karthik Iyer", employer: "Tech Mahindra", reason: "termination", exitDate: "2024-09-15", clearance: "completed", fnf: "processed", interview: "completed" },
  { id: "EX-2024-302", employee: "Pooja Shah", employer: "Wipro Ltd", reason: "resignation", exitDate: "2024-09-20", clearance: "pending", fnf: "pending", interview: "pending" },
  { id: "EX-2024-303", employee: "Imran Khan", employer: "Cognizant", reason: "absconded", exitDate: "2024-09-10", clearance: "delayed", fnf: "disputed", interview: "skipped" },
  { id: "EX-2024-304", employee: "Divya Menon", employer: "TCS", reason: "resignation", exitDate: "2024-09-22", clearance: "pending", fnf: "pending", interview: "pending" },
  { id: "EX-2024-305", employee: "Ravi Kumar", employer: "Infosys BPM", reason: "resignation", exitDate: "2024-09-18", clearance: "completed", fnf: "processed", interview: "completed" },
  { id: "EX-2024-306", employee: "Anita Gupta", employer: "HCL Technologies", reason: "retirement", exitDate: "2024-09-30", clearance: "pending", fnf: "pending", interview: "completed" },
  { id: "EX-2024-307", employee: "Sam Patel", employer: "Accenture", reason: "resignation", exitDate: "2024-09-25", clearance: "delayed", fnf: "pending", interview: "pending" },
  { id: "EX-2024-308", employee: "Neha Rao", employer: "TechCorp India", reason: "termination", exitDate: "2024-09-12", clearance: "completed", fnf: "disputed", interview: "skipped" },
];

const ATTRITION = [
  { employer: "Cognizant", rate: 18.4, headcount: 240 },
  { employer: "Wipro Ltd", rate: 14.2, headcount: 180 },
  { employer: "Infosys BPM", rate: 11.8, headcount: 165 },
  { employer: "Tech Mahindra", rate: 9.6, headcount: 120 },
  { employer: "TCS", rate: 7.2, headcount: 320 },
  { employer: "Accenture", rate: 6.4, headcount: 145 },
];

const REASONS = [
  { reason: "Resignation", pct: 62 },
  { reason: "Termination", pct: 18 },
  { reason: "Absconded", pct: 12 },
  { reason: "Retirement", pct: 8 },
];

export function SuperAdminExitOversight() {
  const [search, setSearch] = React.useState("");
  const [reason, setReason] = React.useState("all");

  const filtered = EXITS.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.employee.toLowerCase().includes(q) || e.employer.toLowerCase().includes(q);
    const matchReason = reason === "all" || e.reason === reason;
    return matchSearch && matchReason;
  });

  const pendingClearance = EXITS.filter(e => e.clearance !== "completed").length;
  const disputedFnF = EXITS.filter(e => e.fnf === "disputed").length;
  const pendingInterview = EXITS.filter(e => e.interview === "pending").length;

  const clearanceBadge = (s: Exit["clearance"]) => {
    const cls = s === "completed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : s === "delayed" ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exit Management"
        description="Track all employee exits across employers — exit reasons, clearance status, F&F settlements, and exit-interview completion. Spot attrition trends by employer."
        icon={<Icon name="DoorOpen" className="h-6 w-6" />}
        actions={[{ label: "Attrition Report", variant: "outline", onClick: () => toast.success("Attrition report queued") }]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Exits (90d)" value={EXITS.length} icon={<Icon name="DoorOpen" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Pending Clearance" value={pendingClearance} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Disputed F&F" value={disputedFnF} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
        <StatCard label="Exit Interview Due" value={pendingInterview} icon={<Icon name="FilePen" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Attrition Rate by Employer" description="Last 90 days" className="lg:col-span-2">
          <div className="space-y-2">
            {ATTRITION.sort((a, b) => b.rate - a.rate).map(a => (
              <div key={a.employer} className="flex items-center gap-3">
                <span className="w-40 text-xs">{a.employer}</span>
                <Progress className="h-2 flex-1" value={a.rate * 5} />
                <span className="w-12 text-right text-xs font-medium">{a.rate}%</span>
                <span className="w-16 text-right text-xs text-muted-foreground">{a.headcount} exits</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Exit Reasons" description="Distribution">
          <div className="space-y-2">
            {REASONS.map(r => (
              <div key={r.reason} className="flex items-center gap-3">
                <span className="w-24 text-xs">{r.reason}</span>
                <Progress className="h-2 flex-1" value={r.pct} />
                <span className="w-10 text-right text-xs">{r.pct}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="All Exits" description={`${filtered.length} of ${EXITS.length}`}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee or employer…" className="h-9 max-w-sm" />
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Reason" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="resignation">Resignation</SelectItem>
              <SelectItem value="termination">Termination</SelectItem>
              <SelectItem value="absconded">Absconded</SelectItem>
              <SelectItem value="retirement">Retirement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exit ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Exit Date</TableHead>
                <TableHead>Clearance</TableHead>
                <TableHead>F&F</TableHead>
                <TableHead>Interview</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id} className={e.fnf === "disputed" ? "bg-rose-500/5" : e.clearance === "delayed" ? "bg-amber-500/5" : ""}>
                  <TableCell className="font-mono text-xs">{e.id}</TableCell>
                  <TableCell className="font-medium text-sm">{e.employee}</TableCell>
                  <TableCell className="text-xs">{e.employer}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs capitalize">{e.reason}</Badge></TableCell>
                  <TableCell className="text-xs">{formatDate(e.exitDate)}</TableCell>
                  <TableCell>{clearanceBadge(e.clearance)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${e.fnf === "processed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : e.fnf === "disputed" ? "bg-rose-500/15 text-rose-700 border-rose-500/30" : "bg-amber-500/15 text-amber-700 border-amber-500/30"}`}>{e.fnf}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${e.interview === "completed" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : e.interview === "skipped" ? "bg-muted text-muted-foreground" : "bg-amber-500/15 text-amber-700 border-amber-500/30"}`}>{e.interview}</Badge>
                  </TableCell>
                  <TableCell><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Opening ${e.id}…`)}>Manage</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Disputed F&F Settlements" description="Requires HR intervention">
        {disputedFnF === 0 ? (
          <EmptyState icon={<Icon name="CheckCircle2" className="h-6 w-6" />} title="No disputes" description="All F&F settlements are clean." />
        ) : (
          <div className="space-y-2">
            {EXITS.filter(e => e.fnf === "disputed").map(e => (
              <div key={e.id} className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
                <Icon name="AlertTriangle" className="h-5 w-5 text-rose-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.employee} · {e.employer}</p>
                  <p className="text-xs text-muted-foreground">Disputed F&F · exit {formatDate(e.exitDate)} · reason: {e.reason}</p>
                </div>
                <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast.success(`Mediation opened for ${e.id}`)}>Mediate</Button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
