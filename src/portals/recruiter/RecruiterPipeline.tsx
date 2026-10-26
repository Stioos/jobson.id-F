"use client";

import * as React from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, type DragEndEvent, type DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  LayoutDashboard, Table as TableIcon, Filter, GripVertical,
} from "lucide-react";
import { PageHeader, SectionCard, MatchScore } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { allApplications } from "@/lib/mock-data";
import { openings } from "@/lib/partner-data";
import type { JobApplication } from "@/lib/types";

type Stage = "Sourced" | "Submitted" | "Interview" | "Offer" | "Placed" | "Rejected";
const STAGES: Stage[] = ["Sourced", "Submitted", "Interview", "Offer", "Placed", "Rejected"];

const STAGE_TONE: Record<Stage, string> = {
  Sourced: "border-t-slate-400",
  Submitted: "border-t-blue-400",
  Interview: "border-t-amber-400",
  Offer: "border-t-teal-400",
  Placed: "border-t-emerald-500",
  Rejected: "border-t-rose-400",
};

// Map application status → pipeline stage
function mapStage(app: JobApplication): Stage {
  switch (app.status) {
    case "submitted":
    case "viewed": return "Submitted";
    case "shortlisted":
    case "assessment": return "Sourced";
    case "interview": return "Interview";
    case "offer": return "Offer";
    case "hired": return "Placed";
    case "rejected":
    case "withdrawn": return "Rejected";
    default: return "Sourced";
  }
}

interface Card {
  id: string;
  candidate: string;
  jobTitle: string;
  client: string;
  match: number;
  stage: Stage;
  tags: string[];
}

function seedCards(): Card[] {
  const cards: Card[] = [];
  allApplications.slice(0, 24).forEach((a) => {
    cards.push({
      id: a.id,
      candidate: a.candidateName,
      jobTitle: a.jobTitle,
      client: a.employerName,
      match: a.matchScore,
      stage: mapStage(a),
      tags: a.tags.slice(0, 2),
    });
  });
  // Add a few Sourced extras so the Sourced column isn't empty
  ["Sneha Patel", "Rahul Bose", "Imran Khan", "Divya Menon"].forEach((n, i) => {
    cards.push({
      id: `extra_${i}`,
      candidate: n,
      jobTitle: openings[i % openings.length].title,
      client: openings[i % openings.length].clientName,
      match: 70 + ((i * 5) % 25),
      stage: "Sourced",
      tags: ["Hot", "Referral"],
    });
  });
  return cards;
}

export function RecruiterPipeline() {
  const [cards, setCards] = React.useState<Card[]>(() => seedCards());
  const [jobFilter, setJobFilter] = React.useState("all");
  const [view, setView] = React.useState<"kanban" | "table">("kanban");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const filtered = React.useMemo(() => {
    if (jobFilter === "all") return cards;
    return cards.filter((c) => c.client === jobFilter);
  }, [cards, jobFilter]);

  const cardsByStage = (stage: Stage) => filtered.filter((c) => c.stage === stage);

  const activeCard = filtered.find((c) => c.id === activeId) ?? null;

  function findStageOf(id: string): Stage | undefined {
    return cards.find((c) => c.id === id)?.stage;
  }

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const activeStage = findStageOf(String(active.id));
    // over could be a column droppable (id = stage) or another card
    const overId = String(over.id);
    const overIsStage = STAGES.includes(overId as Stage);
    const targetStage: Stage | undefined = overIsStage
      ? (overId as Stage)
      : findStageOf(overId);
    if (!activeStage || !targetStage) return;

    if (activeStage === targetStage) {
      // reorder within column
      setCards((prev) => {
        const col = prev.filter((c) => c.stage === activeStage);
        const oldIdx = col.findIndex((c) => c.id === active.id);
        const newIdx = col.findIndex((c) => c.id === over.id);
        if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev;
        const reordered = arrayMove(col, oldIdx, newIdx);
        const others = prev.filter((c) => c.stage !== activeStage);
        return [...others, ...reordered];
      });
      return;
    }

    // Move to different stage
    setCards((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, stage: targetStage } : c))
    );
    const card = cards.find((c) => c.id === active.id);
    if (card) {
      toast.success(`${card.candidate} moved to ${targetStage}`, {
        description: `${card.jobTitle} • ${card.client}`,
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline board"
        description="Drag candidates across stages. The kanban mirrors your end-to-end submission-to-placement funnel."
        actions={[
          {
            label: view === "kanban" ? "Table view" : "Kanban view",
            variant: "outline",
            onClick: () => setView(view === "kanban" ? "table" : "kanban"),
          },
        ]}
      />

      <SectionCard
        title={view === "kanban" ? "Kanban board" : "Pipeline table"}
        description={
          view === "kanban"
            ? "Drag cards horizontally between columns, or vertically to reorder within a column."
            : "Tabular view of every candidate in your active pipeline."
        }
        action={
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="h-8 w-48"><SelectValue placeholder="All jobs" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {Array.from(new Set(openings.map((o) => o.clientName))).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="hidden sm:flex items-center rounded-md border p-0.5">
              <Button size="sm" variant={view === "kanban" ? "default" : "ghost"} className="h-7" onClick={() => setView("kanban")}>
                <LayoutDashboard className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant={view === "table" ? "default" : "ghost"} className="h-7" onClick={() => setView("table")}>
                <TableIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        }
      >
        {view === "kanban" ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {STAGES.map((stage) => (
                <Column
                  key={stage}
                  stage={stage}
                  cards={cardsByStage(stage)}
                />
              ))}
            </div>
            <DragOverlay>
              {activeCard ? <CardView card={activeCard} dragging /> : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="max-h-[640px] overflow-y-auto scroll-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead className="hidden md:table-cell">Job</TableHead>
                  <TableHead className="hidden lg:table-cell">Client</TableHead>
                  <TableHead className="text-center">Match</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No candidates in pipeline.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AvatarLogo text={c.candidate} size="xs" />
                          <div>
                            <p className="text-sm font-medium">{c.candidate}</p>
                            <p className="text-[10px] text-muted-foreground md:hidden">{c.client}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{c.jobTitle}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{c.client}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={c.match >= 80 ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "border-amber-500/30 text-amber-600 dark:text-amber-400"}>
                          {c.match}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={c.stage}
                          onValueChange={(v) => {
                            setCards((prev) => prev.map((x) => x.id === c.id ? { ...x, stage: v as Stage } : x));
                            toast.success(`${c.candidate} moved to ${v}`);
                          }}
                        >
                          <SelectTrigger className="h-7 w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function Column({ stage, cards }: { stage: Stage; cards: Card[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg border-t-4 ${STAGE_TONE[stage]} border-x border-b bg-muted/30 min-h-[200px] transition-colors ${isOver ? "ring-2 ring-brand/40 bg-brand/5" : ""}`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stage}</h4>
        <Badge variant="outline" className="text-[10px] h-5">{cards.length}</Badge>
      </div>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 p-2 flex-1 overflow-y-auto scroll-thin max-h-[560px]">
          {cards.length === 0 ? (
            <div className="text-[10px] text-muted-foreground text-center py-6 border border-dashed rounded">Drop here</div>
          ) : (
            cards.map((c) => <SortableCard key={c.id} card={c} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <CardView card={card} />
    </div>
  );
}

function CardView({ card, dragging }: { card: Card; dragging?: boolean }) {
  return (
    <div className={`group rounded-md border bg-card p-2.5 shadow-sm hover:border-brand hover:shadow-md transition-all ${dragging ? "ring-2 ring-brand shadow-lg rotate-1" : ""}`}>
      <div className="flex items-start gap-2">
        <AvatarLogo text={card.candidate} size="xs" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium truncate">{card.candidate}</p>
          <p className="text-[10px] text-muted-foreground truncate">{card.jobTitle}</p>
          <p className="text-[10px] text-muted-foreground truncate">{card.client}</p>
        </div>
        <GripVertical className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <MatchScore score={card.match} className="h-7 w-7" />
        <div className="flex flex-wrap gap-1">
          {card.tags.map((t) => (
            <Badge key={t} variant="outline" className="text-[9px] h-4 px-1">{t}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
