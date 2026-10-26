"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { jobs, employerJobsExtra, allApplications } from "@/lib/mock-data";
import { PageHeader, SectionCard, Card, CardContent, EmptyState } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquarePlus, Trash2, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { timeAgo } from "@/lib/format";

const EMPLOYER_JOBS = [...jobs, ...employerJobsExtra].filter((j) => j.employerId === "e_001");

interface ShortlistEntry {
  appId: string;
  note: string;
  addedAt: string;
}

export function EmployerShortlists() {
  const { navigate } = useNav();
  const [jobId, setJobId] = React.useState<string>(EMPLOYER_JOBS[0]?.id ?? "");
  const [shortlists, setShortlists] = React.useState<Record<string, Record<string, ShortlistEntry>>>({});
  const [noteDraft, setNoteDraft] = React.useState<Record<string, string>>({});

  const job = EMPLOYER_JOBS.find((j) => j.id === jobId);
  const jobApps = allApplications.filter((a) => a.jobId === jobId);
  const shortlistedIds = Object.keys(shortlists[jobId] ?? {});
  const shortlistedApps = jobApps.filter((a) => shortlistedIds.includes(a.id));

  const addToShortlist = (appId: string) => {
    setShortlists((prev) => ({
      ...prev,
      [jobId]: { ...(prev[jobId] ?? {}), [appId]: { appId, note: "", addedAt: new Date().toISOString() } },
    }));
    const cand = jobApps.find((a) => a.id === appId)?.candidateName;
    toast.success(`${cand} added to shortlist`);
  };

  const removeFromShortlist = (appId: string) => {
    setShortlists((prev) => {
      const next = { ...prev };
      if (next[jobId]) {
        delete next[jobId][appId];
      }
      return next;
    });
    toast.info("Removed from shortlist");
  };

  const saveNote = (appId: string) => {
    const text = noteDraft[appId]?.trim();
    if (!text) return;
    setShortlists((prev) => ({
      ...prev,
      [jobId]: { ...(prev[jobId] ?? {}), [appId]: { ...(prev[jobId]?.[appId] ?? { appId, addedAt: new Date().toISOString() }), note: text } },
    }));
    setNoteDraft((p) => ({ ...p, [appId]: "" }));
    toast.success("Note saved");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shortlists"
        description="Track top candidates per active job"
        actions={[{ label: "Pipeline", icon: "KanbanSquare", variant: "outline", onClick: () => navigate("employer", "pipeline") }]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={jobId} onValueChange={setJobId}>
          <SelectTrigger className="w-full sm:w-80"><SelectValue placeholder="Select a job" /></SelectTrigger>
          <SelectContent>
            {EMPLOYER_JOBS.map((j) => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="secondary">{shortlistedApps.length} shortlisted</Badge>
      </div>

      {job && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Candidates pool */}
          <SectionCard title="All applicants" description={`${jobApps.length} candidates applied to this job`}>
            {jobApps.length === 0 ? (
              <EmptyState icon={<ListChecks className="h-5 w-5" />} title="No applicants" description="No candidates have applied to this job." />
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto scroll-thin">
                {jobApps.filter((a) => !shortlistedIds.includes(a.id)).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40">
                    <AvatarLogo text={a.candidateName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.candidateName}</p>
                      <p className="truncate text-xs text-muted-foreground">Match {a.matchScore} · {timeAgo(a.appliedAt)}</p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= (a.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                      ))}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => addToShortlist(a.id)}>
                      <Star className="mr-1 h-3 w-3" /> Shortlist
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Shortlist */}
          <SectionCard title={`Shortlist for ${job.title}`} description="Top candidates with internal notes">
            {shortlistedApps.length === 0 ? (
              <EmptyState icon={<Star className="h-5 w-5" />} title="Shortlist is empty" description="Add candidates from the list on the left." />
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto scroll-thin">
                {shortlistedApps.map((a) => {
                  const entry = shortlists[jobId]?.[a.id];
                  return (
                    <Card key={a.id}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center gap-3">
                          <AvatarLogo text={a.candidateName} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{a.candidateName}</p>
                            <p className="text-xs text-muted-foreground">Added {entry ? timeAgo(entry.addedAt) : "—"}</p>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`h-3 w-3 ${s <= (a.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                            ))}
                          </div>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-600" onClick={() => removeFromShortlist(a.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {entry?.note && (
                          <p className="rounded-md bg-muted/50 p-2 text-xs">{entry.note}</p>
                        )}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a note…"
                            value={noteDraft[a.id] ?? ""}
                            onChange={(e) => setNoteDraft((p) => ({ ...p, [a.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === "Enter") saveNote(a.id); }}
                          />
                          <Button size="icon" onClick={() => saveNote(a.id)}>
                            <MessageSquarePlus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      )}
    </div>
  );
}
