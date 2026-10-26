"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate, timeAgo } from "@/lib/format";

interface JobAlert {
  id: string;
  query: string;
  frequency: "daily" | "weekly" | "instant";
  emailEnabled: boolean;
  paused: boolean;
  lastTriggered?: string;
  matchCount: number;
}

const SEED_ALERTS: JobAlert[] = [
  {
    id: "ja_1",
    query: "Senior React Remote",
    frequency: "daily",
    emailEnabled: true,
    paused: false,
    lastTriggered: new Date(Date.now() - 1 * 86400000).toISOString(),
    matchCount: 5,
  },
  {
    id: "ja_2",
    query: "Product Manager Mumbai",
    frequency: "weekly",
    emailEnabled: true,
    paused: false,
    lastTriggered: new Date(Date.now() - 4 * 86400000).toISOString(),
    matchCount: 12,
  },
  {
    id: "ja_3",
    query: "Go Backend Engineer",
    frequency: "instant",
    emailEnabled: false,
    paused: true,
    lastTriggered: new Date(Date.now() - 14 * 86400000).toISOString(),
    matchCount: 0,
  },
  {
    id: "ja_4",
    query: "Frontend Bengaluru 20L+",
    frequency: "daily",
    emailEnabled: true,
    paused: false,
    lastTriggered: new Date(Date.now() - 0.5 * 86400000).toISOString(),
    matchCount: 8,
  },
];

export function CandidateAlerts() {
  const [alerts, setAlerts] = React.useState<JobAlert[]>(SEED_ALERTS);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  function togglePause(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, paused: !a.paused } : a))
    );
    const a = alerts.find((x) => x.id === id);
    toast.success(a && !a.paused ? "Alert paused" : "Alert resumed");
  }

  function toggleEmail(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, emailEnabled: !a.emailEnabled } : a))
    );
  }

  function createAlert(values: {
    query: string;
    frequency: "daily" | "weekly" | "instant";
    emailEnabled: boolean;
  }) {
    setAlerts((prev) => [
      {
        id: `ja_${Date.now()}`,
        query: values.query,
        frequency: values.frequency,
        emailEnabled: values.emailEnabled,
        paused: false,
        matchCount: 0,
      },
      ...prev,
    ]);
    setCreateOpen(false);
    toast.success("Alert created", { description: values.query });
  }

  function confirmDelete() {
    if (!deleteId) return;
    setAlerts((prev) => prev.filter((a) => a.id !== deleteId));
    toast.success("Alert deleted");
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Alerts"
        description="Get notified when new jobs match your saved searches."
        actions={[
          { label: "Create alert", variant: "default", onClick: () => setCreateOpen(true) },
        ]}
      />

      {alerts.length === 0 ? (
        <EmptyState
          icon={<Icon name="Bell" className="h-5 w-5" />}
          title="No alerts yet"
          description="Create an alert to be the first to know about matching jobs."
          action={<Button onClick={() => setCreateOpen(true)}>Create alert</Button>}
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{a.query}</p>
                      <Badge variant="outline" className="capitalize">
                        {a.frequency}
                      </Badge>
                      {a.paused ? (
                        <Badge className="bg-slate-500/10 text-slate-600 dark:text-slate-300">
                          Paused
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Icon name="BellRing" className="h-3 w-3" />
                        {a.matchCount} matches
                      </span>
                      {a.lastTriggered && (
                        <span className="inline-flex items-center gap-1">
                          <Icon name="Clock" className="h-3 w-3" />
                          Last triggered {timeAgo(a.lastTriggered)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
                      <Label
                        htmlFor={`em-${a.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Email
                      </Label>
                      <Switch
                        id={`em-${a.id}`}
                        checked={a.emailEnabled}
                        onCheckedChange={() => toggleEmail(a.id)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePause(a.id)}
                    >
                      {a.paused ? "Resume" : "Pause"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteId(a.id)}
                    >
                      <Icon name="AlertTriangle" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SectionCard title="How alerts work" description="Get the most out of your saved searches.">
        <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <li className="flex items-start gap-2">
            <Icon name="Bell" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            We scan every new job posting against your saved queries.
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Mail" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Email digests arrive at your chosen frequency.
          </li>
          <li className="flex items-start gap-2">
            <Icon name="BellRing" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Instant alerts fire within minutes for high-priority matches.
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Cog" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Pause anytime without losing your search criteria.
          </li>
        </ul>
      </SectionCard>

      <CreateAlertDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createAlert}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this alert?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll stop receiving notifications for this saved search. You can
              recreate it anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CreateAlertDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (v: { query: string; frequency: "daily" | "weekly" | "instant"; emailEnabled: boolean }) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [frequency, setFrequency] = React.useState<"daily" | "weekly" | "instant">("daily");
  const [emailEnabled, setEmailEnabled] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setFrequency("daily");
      setEmailEnabled(true);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create job alert</DialogTitle>
          <DialogDescription>
            We&apos;ll notify you when new jobs match your query.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="q">Search query</Label>
            <Input
              id="q"
              placeholder="e.g. Senior React Remote"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(v) => setFrequency(v as "daily" | "weekly" | "instant")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="email"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
            <Label htmlFor="email">Send email notifications</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!query.trim()) {
                toast.error("Query is required");
                return;
              }
              onCreate({ query, frequency, emailEnabled });
            }}
          >
            Create alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
