"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { jobs, employerJobsExtra } from "@/lib/mock-data";
import { PageHeader, SectionCard, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { toast } from "sonner";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import { Plus, MoreHorizontal, Search, ArrowUpDown, Eye, Copy, Pause, Play, Archive, XCircle, Pencil, Briefcase } from "lucide-react";
import type { Job, JobStatus } from "@/lib/types";

const ALL_JOBS = [...jobs, ...employerJobsExtra].filter((j) => j.employerId === "e_001");

const STATUSES: (JobStatus | "all")[] = ["all", "published", "draft", "pending_approval", "paused", "closed", "archived"];

type SortKey = "title" | "postedAt" | "applicationCount" | "viewCount";

export function EmployerJobs() {
  const { navigate } = useNav();
  const [tab, setTab] = React.useState<JobStatus | "all">("all");
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("postedAt");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  const filtered = React.useMemo(() => {
    let list = ALL_JOBS;
    if (tab !== "all") list = list.filter((j) => j.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((j) => j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || (j.requisitionId ?? "").toLowerCase().includes(q));
    }
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "postedAt") cmp = new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
      else if (sortKey === "applicationCount") cmp = a.applicationCount - b.applicationCount;
      else if (sortKey === "viewCount") cmp = a.viewCount - b.viewCount;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [tab, search, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  };

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: ALL_JOBS.length };
    for (const s of STATUSES) if (s !== "all") c[s] = ALL_JOBS.filter((j) => j.status === s).length;
    return c;
  }, []);

  const act = (j: Job, action: string) => {
    if (action === "duplicate") toast.success(`Duplicated "${j.title}"`, { description: "A draft copy was created." });
    else if (action === "preview") toast.info(`Previewing "${j.title}"`);
    else if (action === "pause") toast.warning(`Paused "${j.title}"`);
    else if (action === "resume") toast.success(`Resumed "${j.title}"`);
    else if (action === "close") toast.warning(`Closed "${j.title}"`);
    else if (action === "archive") toast.info(`Archived "${j.title}"`);
    else if (action === "edit") navigate("employer", "create-job");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Manage all your job postings — published, drafts, pending and closed"
        actions={[{ label: "Create job", icon: "Plus", onClick: () => navigate("employer", "create-job") }]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as JobStatus | "all")}>
          <TabsList className="flex-wrap h-auto">
            {STATUSES.map((s) => (
              <TabsTrigger key={s} value={s} className="text-xs capitalize">
                {s === "all" ? "All" : s.replace("_", " ")} ({counts[s] ?? 0})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search jobs…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
      </div>

      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="No jobs found"
            description="Try adjusting filters or create a new job."
            action={<Button onClick={() => navigate("employer", "create-job")}><Plus className="mr-2 h-4 w-4" /> Create job</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%]"><button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("title")}>Title <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Req ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Hiring manager</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right"><button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("applicationCount")}>Apps <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead className="text-right"><button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("viewCount")}>Views <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead><button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("postedAt")}>Posted <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((j) => (
                  <TableRow key={j.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AvatarLogo text={j.employerLogo} size="sm" />
                        <div>
                          <p className="font-medium text-sm">{j.title}</p>
                          <p className="text-xs text-muted-foreground">{j.department} · {j.employmentType}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={j.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{j.requisitionId ?? "—"}</TableCell>
                    <TableCell className="text-sm">{j.location}</TableCell>
                    <TableCell className="text-sm">{j.hiringManager ?? "—"}</TableCell>
                    <TableCell className="text-right text-sm">{j.budget ? formatCurrency(j.budget, j.currency) : "—"}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{j.applicationCount}</TableCell>
                    <TableCell className="text-right text-sm">{j.viewCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{timeAgo(j.postedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => act(j, "preview")}><Eye className="mr-2 h-4 w-4" /> Preview</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => act(j, "edit")}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => act(j, "duplicate")}><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {j.status === "paused" ? (
                            <DropdownMenuItem onClick={() => act(j, "resume")}><Play className="mr-2 h-4 w-4" /> Resume</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => act(j, "pause")}><Pause className="mr-2 h-4 w-4" /> Pause</DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => act(j, "close")} className="text-amber-600"><XCircle className="mr-2 h-4 w-4" /> Close</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => act(j, "archive")} className="text-muted-foreground"><Archive className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
