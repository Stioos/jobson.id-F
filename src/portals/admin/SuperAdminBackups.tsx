"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime, timeAgo } from "@/lib/format";

const BACKUPS = [
  { id: "bk_001", type: "Full DB", size: "4.2 GB", startedAt: "2024-09-21T02:00:00Z", completedAt: "2024-09-21T02:14:00Z", status: "success", location: "s3://jobsonn-backups/prod/db/2024-09-21" },
  { id: "bk_002", type: "Incremental", size: "82 MB", startedAt: "2024-09-21T06:00:00Z", completedAt: "2024-09-21T06:00:42Z", status: "success", location: "s3://jobsonn-backups/prod/inc/2024-09-21-06" },
  { id: "bk_003", type: "Incremental", size: "118 MB", startedAt: "2024-09-21T12:00:00Z", completedAt: "2024-09-21T12:01:08Z", status: "success", location: "s3://jobsonn-backups/prod/inc/2024-09-21-12" },
  { id: "bk_004", type: "Incremental", size: "94 MB", startedAt: "2024-09-21T18:00:00Z", completedAt: "2024-09-21T18:00:52Z", status: "success", location: "s3://jobsonn-backups/prod/inc/2024-09-21-18" },
  { id: "bk_005", type: "Full DB", size: "4.1 GB", startedAt: "2024-09-20T02:00:00Z", completedAt: "2024-09-20T02:12:00Z", status: "success", location: "s3://jobsonn-backups/prod/db/2024-09-20" },
  { id: "bk_006", type: "Full DB", size: "4.0 GB", startedAt: "2024-09-19T02:00:00Z", completedAt: "2024-09-19T02:11:00Z", status: "failed", location: "—" },
];

const RESTORE_POINTS = [
  { id: "rp_001", label: "Sep 21, 2024 02:14 UTC", backup: "bk_001", status: "available", age: "14h ago" },
  { id: "rp_002", label: "Sep 20, 2024 02:12 UTC", backup: "bk_005", status: "available", age: "1d ago" },
  { id: "rp_003", label: "Sep 19, 2024 02:11 UTC", backup: "bk_006", status: "failed", age: "2d ago" },
  { id: "rp_004", label: "Sep 18, 2024 02:10 UTC", backup: "bk_007", status: "available", age: "3d ago" },
];

export function SuperAdminBackups() {
  const [autoBackup, setAutoBackup] = React.useState(true);

  const statusBadge = (s: string) => {
    const cls = s === "success" || s === "available" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Backups & DR"
        description="Backup schedule, restore points, and DR runbook for disaster recovery."
        icon={<Icon name="Database" className="h-6 w-6" />}
        actions={[
          { label: "Run Backup Now", onClick: () => toast.success("Manual backup initiated") },
          { label: "DR Drill", variant: "outline", onClick: () => toast.warning("DR drill scheduled — staging env") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Backups (7d)" value={BACKUPS.length} icon={<Icon name="Database" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Success Rate" value="98.4%" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} tone="success" />
        <StatCard label="Last Backup" value="14h ago" icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="RPO / RTO" value="6h / 30m" icon={<Icon name="Activity" className="h-5 w-5" />} />
      </div>

      <SectionCard title="Backup Schedule" description="Automated backup policy">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border bg-card p-4">
            <div className="flex items-center gap-2">
              <Icon name="Database" className="h-4 w-4 text-brand" />
              <span className="font-medium">Full DB</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Daily at 02:00 UTC</p>
            <p className="mt-1 text-xs">Retention: 30 days</p>
            <p className="mt-1 text-xs">Size: ~4.2 GB</p>
          </div>
          <div className="rounded-md border bg-card p-4">
            <div className="flex items-center gap-2">
              <Icon name="Layers" className="h-4 w-4 text-brand" />
              <span className="font-medium">Incremental</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Every 6 hours</p>
            <p className="mt-1 text-xs">Retention: 7 days</p>
            <p className="mt-1 text-xs">Size: ~100 MB</p>
          </div>
          <div className="rounded-md border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Settings" className="h-4 w-4 text-brand" />
                <span className="font-medium">Auto-backup</span>
              </div>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">S3 cross-region replication</p>
            <p className="mt-1 text-xs">KMS-encrypted at rest</p>
            <p className="mt-1 text-xs">Verified by checksums</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Restore Points" description="Available point-in-time recovery targets" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restore Point</TableHead>
              <TableHead>Backup ID</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RESTORE_POINTS.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.label}</TableCell>
                <TableCell className="font-mono text-xs">{r.backup}</TableCell>
                <TableCell className="text-xs">{r.age}</TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
                <TableCell>
                  {r.status === "available" && (
                    <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast.warning(`Restore from ${r.label} initiated — staging env`)}>Restore</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Backup History" description="Last 7 days" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {BACKUPS.map(b => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.id}</TableCell>
                <TableCell><Badge variant="outline">{b.type}</Badge></TableCell>
                <TableCell className="text-xs">{b.size}</TableCell>
                <TableCell className="text-xs">{formatDateTime(b.startedAt)}</TableCell>
                <TableCell className="text-xs">{b.completedAt ? formatDateTime(b.completedAt) : "—"}</TableCell>
                <TableCell>{statusBadge(b.status)}</TableCell>
                <TableCell>
                  {b.status === "success" && <Button variant="ghost" size="sm" onClick={() => toast.success(`Verified ${b.id} — checksum OK`)}>Verify</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
