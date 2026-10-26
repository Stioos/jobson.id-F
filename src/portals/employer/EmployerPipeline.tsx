"use client";

import * as React from "react";
import {
  DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors, closestCorners, useDroppable, useDraggable,
} from "@dnd-kit/core";
import { useNav } from "@/lib/store";
import { jobs, employerJobsExtra, allApplications } from "@/lib/mock-data";
import { applicationService } from "@/lib/mock-api";
import { PageHeader, SectionCard, StatusBadge, MatchScore, Card, CardContent, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";
import { KanbanSquare, Table as TableIcon, GripVertical } from "lucide-react";
import type { ApplicationStatus, JobApplication } from "@/lib/types";

const EMPLOYER_JOBS = [...jobs, ...employerJobsExtra].filter((j) => j.employerId === "e_001");

const COLUMNS: { id: ApplicationStatus; label: string; tone: string }[] = [
  { id: "submitted", label: "Applied", tone: "bg-blue-500" },
  { id: "viewed", label: "Screening", tone: "bg-cyan-500" },
  { id: "assessment", label: "Assessment", tone: "bg-amber-500" },
  { id: "interview", label: "Interview", tone: "bg-violet-500" },
  { id: "offer", label: "Offer", tone: "bg-teal-500" },
  { id: "hired", label: "Hired", tone: "bg-emerald-500" },
  { id: "rejected", label: "Rejected", tone: "bg-rose-500" },
];

interface ColumnProps {
  col: { id: ApplicationStatus; label: string; tone: string };
  apps: JobApplication[];
}

function PipelineColumn({ col, apps }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30">
      <div className="flex items-center gap-2 border-b p-3">
        <span className={`h-2 w-2 rounded-full ${col.tone}`} />
        <span className="text-sm font-medium">{col.label}</span>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{apps.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 p-2 min-h-[200px] overflow-y-auto scroll-thin max-h-[calc(100vh-260px)] ${isOver ? "bg-brand/5" : ""}`}
      >
        {apps.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">Drop candidates here</p>
        ) : (
          apps.map((a) => <PipelineCard key={a.id} app={a} />)
        )}
      </div>
    </div>
  );
}

function PipelineCard({ app }: { app: JobApplication }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: app.id });
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing rounded-md border bg-background p-2.5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-3.5 w-3.5 text-muted-foreground/60" />
        <AvatarLogo text={app.candidateName} size="xs" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{app.candidateName}</p>
          <p className="truncate text-xs text-muted-foreground">{app.jobTitle}</p>
        </div>
        <MatchScore score={app.matchScore} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{timeAgo(app.appliedAt)}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={`h-2 w-2 rounded-full mr-0.5 ${s <= (app.rating ?? 0) ? "bg-amber-400" : "bg-muted"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmployerPipeline() {
  const { navigate } = useNav();
  const [apps, setApps] = React.useState<JobApplication[]>(() =>
    allApplications.filter((a) => EMPLOYER_JOBS.some((j) => j.id === a.jobId))
  );
  const [jobFilter, setJobFilter] = React.useState<string>("all");
  const [view, setView] = React.useState<"kanban" | "table">("kanban");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = React.useMemo(() => {
    return jobFilter === "all" ? apps : apps.filter((a) => a.jobId === jobFilter);
  }, [apps, jobFilter]);

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const newStatus = over.id as ApplicationStatus;
    const app = apps.find((a) => a.id === active.id);
    if (!app || app.status === newStatus) return;
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a)));
    await applicationService.updateStatus(app.id, newStatus);
    toast.success(`${app.candidateName} moved to ${newStatus.replace("_", " ")}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment Pipeline"
        description="Drag candidates across stages to update their application status"
        actions={[{ label: "View applicants", icon: "Users", variant: "outline", onClick: () => navigate("employer", "applicants") }]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-full sm:w-72"><SelectValue placeholder="All jobs" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All jobs ({EMPLOYER_JOBS.length})</SelectItem>
            {EMPLOYER_JOBS.map((j) => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "table")}>
          <TabsList>
            <TabsTrigger value="kanban"><KanbanSquare className="mr-1 h-3 w-3" /> Kanban</TabsTrigger>
            <TabsTrigger value="table"><TableIcon className="mr-1 h-3 w-3" /> Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "kanban" ? (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 scroll-thin">
            {COLUMNS.map((col) => (
              <PipelineColumn key={col.id} col={col} apps={filtered.filter((a) => a.status === col.id)} />
            ))}
          </div>
        </DndContext>
      ) : (
        <SectionCard>
          {filtered.length === 0 ? (
            <EmptyState icon={<KanbanSquare className="h-5 w-5" />} title="No candidates" description="Try a different job filter." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Applied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={a.candidateName} size="xs" />
                          <span className="text-sm font-medium">{a.candidateName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.jobTitle}</TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                      <TableCell><MatchScore score={a.matchScore} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{timeAgo(a.appliedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
}
