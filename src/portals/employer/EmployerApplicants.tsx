"use client";

import * as React from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel,
  flexRender, createColumnHelper, type SortingState, type RowSelectionState, type ColumnDef,
} from "@tanstack/react-table";
import { jobs, employerJobsExtra, allApplications, candidateProfiles } from "@/lib/mock-data";
import { applicationService } from "@/lib/mock-api";
import { PageHeader, SectionCard, StatusBadge, MatchScore, EmptyState, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";
import { Search, Star, ChevronLeft, ChevronRight, MoreHorizontal, X, MessageSquare, Mail, MapPin, Briefcase, Clock, FileText, Calendar } from "lucide-react";
import type { JobApplication, ApplicationStatus } from "@/lib/types";

const EMPLOYER_JOBS = [...jobs, ...employerJobsExtra].filter((j) => j.employerId === "e_001");
const INITIAL_APPS = allApplications.filter((a) => EMPLOYER_JOBS.some((j) => j.id === a.jobId));

const STATUS_OPTIONS: ApplicationStatus[] = ["submitted", "viewed", "shortlisted", "assessment", "interview", "offer", "hired", "rejected"];

const REJECTION_TEMPLATES = [
  { id: "rt1", label: "Not enough experience", body: "Thank you for applying. Unfortunately, we are moving forward with candidates who have more experience in the required areas." },
  { id: "rt2", label: "Skills mismatch", body: "Thank you for your interest. We are looking for candidates with stronger alignment to the role's technical requirements." },
  { id: "rt3", label: "Position filled", body: "Thank you for applying. The position has been filled, but we'd love to keep your profile for future opportunities." },
  { id: "rt4", label: "Salary expectations", body: "Thank you for applying. Unfortunately, we are unable to meet your salary expectations for this role." },
];

const columnHelper = createColumnHelper<JobApplication>();

export function EmployerApplicants() {
  const [data, setData] = React.useState<JobApplication[]>(INITIAL_APPS);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "appliedAt", desc: true }]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [jobFilter, setJobFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<ApplicationStatus[]>([]);
  const [selected, setSelected] = React.useState<JobApplication | null>(null);
  const [notes, setNotes] = React.useState<JobApplication["notes"]>([]);
  const [newNote, setNewNote] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [rejectTemplate, setRejectTemplate] = React.useState(REJECTION_TEMPLATES[0].id);
  const [rejectReason, setRejectReason] = React.useState(REJECTION_TEMPLATES[0].body);

  const filtered = React.useMemo(() => {
    let list = data;
    if (jobFilter !== "all") list = list.filter((a) => a.jobId === jobFilter);
    if (statusFilter.length > 0) list = list.filter((a) => statusFilter.includes(a.status));
    if (globalFilter.trim()) {
      const q = globalFilter.toLowerCase();
      list = list.filter((a) => a.candidateName.toLowerCase().includes(q) || a.jobTitle.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return list;
  }, [data, jobFilter, statusFilter, globalFilter]);

  const columns = React.useMemo<ColumnDef<JobApplication>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
    },
    {
      id: "candidate",
      header: "Candidate",
      accessorFn: (r) => r.candidateName,
      cell: ({ row }) => (
        <button onClick={() => openApplicant(row.original)} className="flex items-center gap-2 text-left">
          <AvatarLogo text={row.original.candidateName} size="sm" />
          <div>
            <p className="font-medium text-sm hover:underline">{row.original.candidateName}</p>
            <p className="text-xs text-muted-foreground">{row.original.jobTitle}</p>
          </div>
        </button>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (r) => r.status,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "matchScore",
      header: "Match",
      accessorFn: (r) => r.matchScore,
      cell: ({ row }) => <MatchScore score={row.original.matchScore} />,
    },
    {
      id: "rating",
      header: "Rating",
      accessorFn: (r) => r.rating ?? 0,
      cell: ({ row }) => (
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`h-3 w-3 ${s <= (row.original.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
          ))}
        </div>
      ),
    },
    {
      id: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-xs font-normal">{t}</Badge>)}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: "appliedAt",
      header: "Applied",
      accessorFn: (r) => new Date(r.appliedAt).getTime(),
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{timeAgo(row.original.appliedAt)}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => openApplicant(row.original)}>
          View
        </Button>
      ),
      enableSorting: false,
    },
  ], []);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const openApplicant = (app: JobApplication) => {
    setSelected(app);
    setNotes(app.notes);
    setRating(app.rating ?? 0);
  };

  const addNote = () => {
    if (!newNote.trim() || !selected) return;
    const note = { author: "Rohan Mehta", text: newNote.trim(), timestamp: new Date().toISOString() };
    setNotes([note, ...notes]);
    setNewNote("");
    toast.success("Note added");
  };

  const updateStatus = async (status: ApplicationStatus) => {
    if (!selected) return;
    await applicationService.updateStatus(selected.id, status);
    setData((d) => d.map((a) => a.id === selected.id ? { ...a, status } : a));
    setSelected({ ...selected, status });
    toast.success(`Moved to ${status.replace("_", " ")}`);
  };

  const reject = () => {
    if (!selected) return;
    updateStatus("rejected");
    toast.success("Candidate rejected", { description: rejectReason.slice(0, 80) + "…" });
    setRejectOpen(false);
  };

  const toggleStatusFilter = (s: ApplicationStatus) => {
    setStatusFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const bulkAction = (action: "shortlist" | "reject" | "tag") => {
    const ids = Object.keys(rowSelection);
    if (ids.length === 0) return;
    if (action === "shortlist") {
      setData((d) => d.map((a) => ids.includes(a.id) ? { ...a, status: "shortlisted" } : a));
      toast.success(`${ids.length} candidates moved to shortlist`);
    } else if (action === "reject") {
      setData((d) => d.map((a) => ids.includes(a.id) ? { ...a, status: "rejected" } : a));
      toast.warning(`${ids.length} candidates rejected`);
    } else {
      setData((d) => d.map((a) => ids.includes(a.id) ? { ...a, tags: [...new Set([...a.tags, "reviewed"])] } : a));
      toast.success(`Tagged ${ids.length} candidates`);
    }
    setRowSelection({});
  };

  const candidateProfile = selected ? candidateProfiles.find((c) => c.id === selected.candidateId) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applicants"
        description={`${data.length} candidates across ${EMPLOYER_JOBS.length} jobs`}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search candidates, jobs, tags…" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="pl-8" />
          </div>
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="All jobs" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jobs</SelectItem>
              {EMPLOYER_JOBS.map((j) => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => toggleStatusFilter(s)}
              className={`rounded-full border px-2.5 py-1 text-xs capitalize transition-colors ${statusFilter.includes(s) ? "border-brand bg-brand/10 text-brand" : "border-border text-muted-foreground hover:bg-muted"}`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions bar */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-brand/5 px-4 py-2">
          <span className="text-sm font-medium">{Object.keys(rowSelection).length} selected</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">Bulk actions <MoreHorizontal className="ml-2 h-3 w-3" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Move to stage</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => bulkAction("shortlist")}>Shortlist</DropdownMenuItem>
              <DropdownMenuItem onClick={() => bulkAction("tag")}>Add "reviewed" tag</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => bulkAction("reject")} className="text-rose-600">Reject all</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Table */}
      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Search className="h-5 w-5" />} title="No applicants found" description="Adjust your filters to see more candidates." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id} style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}>
                        {header.isPlaceholder ? null : (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className={`flex items-center gap-1 ${header.column.getCanSort() ? "cursor-pointer hover:text-foreground" : ""}`}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{ asc: "↑", desc: "↓" }[header.column.getIsSorted() as string] ?? ""}
                          </button>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className={row.getIsSelected() ? "bg-brand/5" : "hover:bg-muted/40"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-1 pt-3">
            <p className="text-xs text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} · {filtered.length} candidates
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <Button size="sm" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Candidate drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto scroll-thin">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <AvatarLogo text={selected.candidateName} size="lg" />
                  <div>
                    <SheetTitle className="text-left">{selected.candidateName}</SheetTitle>
                    <SheetDescription className="text-left">{selected.jobTitle} · Applied {timeAgo(selected.appliedAt)}</SheetDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <MatchScore score={selected.matchScore} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <StatusBadge status={selected.status} />
                  {selected.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-6">
                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateStatus("shortlisted")}><Star className="mr-2 h-3 w-3" /> Shortlist</Button>
                  <Button size="sm" variant="outline" onClick={() => { toast.success("Assessment sent"); updateStatus("assessment"); }}><FileText className="mr-2 h-3 w-3" /> Send assessment</Button>
                  <Button size="sm" variant="outline" onClick={() => { toast.success("Interview scheduled"); updateStatus("interview"); }}><Calendar className="mr-2 h-3 w-3" /> Schedule interview</Button>
                  <Button size="sm" variant="outline" className="text-rose-600" onClick={() => { setRejectReason(REJECTION_TEMPLATES.find((r) => r.id === rejectTemplate)?.body ?? ""); setRejectOpen(true); }}><X className="mr-2 h-3 w-3" /> Reject</Button>
                </div>

                {/* Contact + profile */}
                <SectionCard title="Profile" contentClassName="space-y-2 text-sm">
                  {candidateProfile ? (
                    <>
                      <p className="text-muted-foreground">{candidateProfile.headline}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {candidateProfile.email}</p>
                        <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {candidateProfile.location}</p>
                        <p className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {candidateProfile.experienceYears}y exp</p>
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {candidateProfile.noticePeriodDays}d notice</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mt-2 mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {candidateProfile.skills.map((s) => <Badge key={s.skill} variant="secondary" className="text-xs">{s.skill}</Badge>)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No extended profile available.</p>
                  )}
                </SectionCard>

                {/* Match analysis */}
                <SectionCard title="Match analysis" description="Simulated AI — based on resume parsing">
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs font-medium text-emerald-600 mb-1">Matched</p>
                      <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                        {selected.matchReasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                    {selected.missingSkills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-amber-600 mb-1">Missing</p>
                        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                          {selected.missingSkills.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </SectionCard>

                {/* Screening answers */}
                {selected.answers.length > 0 && (
                  <SectionCard title="Screening answers">
                    <div className="space-y-2 text-sm">
                      {selected.answers.map((a, i) => (
                        <div key={i} className="rounded-md border p-2">
                          <p className="text-xs text-muted-foreground">{a.question}</p>
                          <p className="font-medium">{a.answer}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Rating */}
                <SectionCard title="Rating">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => { setRating(s); toast.success(`Rated ${s} stars`); }}>
                        <Star className={`h-6 w-6 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                      </button>
                    ))}
                  </div>
                </SectionCard>

                {/* Timeline */}
                <SectionCard title="Timeline">
                  <ol className="relative border-l border-border pl-4 space-y-3">
                    {[...selected.timeline].reverse().map((ev, i) => (
                      <li key={i} className="text-sm">
                        <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-brand border-2 border-background" />
                        <p className="font-medium capitalize">{ev.status.replace("_", " ")}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(ev.timestamp, { hour: "2-digit", minute: "2-digit" })} · {ev.actor}</p>
                        {ev.note && <p className="text-xs text-muted-foreground mt-0.5">{ev.note}</p>}
                      </li>
                    ))}
                  </ol>
                </SectionCard>

                {/* Notes */}
                <SectionCard title="Internal notes">
                  <div className="space-y-2">
                    {notes.length === 0 && <p className="text-xs text-muted-foreground">No notes yet.</p>}
                    {notes.map((n, i) => (
                      <div key={i} className="rounded-md border p-2 text-sm">
                        <p>{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.author} · {timeAgo(n.timestamp)}</p>
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Textarea rows={2} placeholder="Add an internal note…" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                      <Button size="sm" onClick={addNote}><MessageSquare className="mr-2 h-3 w-3" /> Add note</Button>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Rejection dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject candidate</DialogTitle>
            <DialogDescription>Send a rejection email to {selected?.candidateName}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Template</Label>
              <Select value={rejectTemplate} onValueChange={(v) => { setRejectTemplate(v); setRejectReason(REJECTION_TEMPLATES.find((r) => r.id === v)?.body ?? ""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REJECTION_TEMPLATES.map((r) => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Message</Label>
              <Textarea rows={5} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={reject}><X className="mr-2 h-4 w-4" /> Reject & send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
