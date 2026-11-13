"use client";

import * as React from "react";
import { PageHeader, StatCard, SectionCard, EmptyState } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, timeAgo } from "@/lib/format";

interface Key {
  id: string; name: string; type: "AES-256" | "RSA-2048" | "RSA-4096" | "HMAC" | "ECDSA"; purpose: string; createdAt: string; rotatedAt: string; nextRotation: string; status: "active" | "deprecated" | "scheduled";
}

interface Secret {
  id: string; name: string; type: "api_key" | "db_password" | "oauth_client" | "jwt_signing" | "smtp_creds"; service: string; lastAccessed: string; rotationStatus: "current" | "due" | "overdue";
}

const KEYS: Key[] = [
  { id: "KEY-001", name: "master-data-encryption", type: "AES-256", purpose: "Data at rest (RDS)", createdAt: "2023-01-15", rotatedAt: "2024-09-01", nextRotation: "2024-12-01", status: "active" },
  { id: "KEY-002", name: "jwt-signing-key", type: "RSA-2048", purpose: "JWT signing", createdAt: "2023-06-01", rotatedAt: "2024-08-15", nextRotation: "2024-11-15", status: "active" },
  { id: "KEY-003", name: "kms-root-key", type: "RSA-4096", purpose: "KMS root", createdAt: "2023-01-01", rotatedAt: "2024-03-01", nextRotation: "2025-03-01", status: "active" },
  { id: "KEY-004", name: "legacy-backup-key", type: "AES-256", purpose: "Old backup decryption", createdAt: "2022-06-01", rotatedAt: "2023-06-01", nextRotation: "—", status: "deprecated" },
  { id: "KEY-005", name: "webhook-signing", type: "HMAC", purpose: "Webhook HMAC signatures", createdAt: "2023-08-01", rotatedAt: "2024-09-10", nextRotation: "2024-10-10", status: "scheduled" },
  { id: "KEY-006", name: "payment-pgp", type: "RSA-4096", purpose: "PGP payment files", createdAt: "2023-09-01", rotatedAt: "2024-09-01", nextRotation: "2025-09-01", status: "active" },
];

const SECRETS: Secret[] = [
  { id: "SEC-001", name: "RAZORPAY_KEY_ID", type: "api_key", service: "Razorpay", lastAccessed: "2024-09-22T08:00:00Z", rotationStatus: "current" },
  { id: "SEC-002", name: "STRIPE_SECRET_KEY", type: "api_key", service: "Stripe", lastAccessed: "2024-09-22T07:30:00Z", rotationStatus: "current" },
  { id: "SEC-003", name: "DB_MASTER_PASSWORD", type: "db_password", service: "Postgres primary", lastAccessed: "2024-09-22T08:01:00Z", rotationStatus: "due" },
  { id: "SEC-004", name: "GOOGLE_OAUTH_SECRET", type: "oauth_client", service: "Google Auth", lastAccessed: "2024-09-22T06:00:00Z", rotationStatus: "current" },
  { id: "SEC-005", name: "JWT_SIGNING_PASSPHRASE", type: "jwt_signing", service: "Auth Service", lastAccessed: "2024-09-22T08:00:00Z", rotationStatus: "current" },
  { id: "SEC-006", name: "SES_SMTP_PASSWORD", type: "smtp_creds", service: "AWS SES", lastAccessed: "2024-09-22T07:45:00Z", rotationStatus: "overdue" },
];

const ACCESS_LOG = [
  { id: "AL-9001", actor: "auth-service", action: "sign_jwt", key: "KEY-002", at: "2024-09-22T08:00:00Z", ip: "10.4.0.18" },
  { id: "AL-9000", actor: "backup-job", action: "encrypt_backup", key: "KEY-001", at: "2024-09-22T03:00:00Z", ip: "10.4.0.5" },
  { id: "AL-8999", actor: "admin@jobson.id", action: "view_secret", key: "SEC-001", at: "2024-09-22T02:00:00Z", ip: "10.4.2.18" },
  { id: "AL-8998", actor: "payment-service", action: "decrypt_pgp", key: "KEY-006", at: "2024-09-21T22:00:00Z", ip: "10.4.0.22" },
  { id: "AL-8997", actor: "webhook-dispatcher", action: "sign_hmac", key: "KEY-005", at: "2024-09-21T19:00:00Z", ip: "10.4.0.30" },
];

const COVERAGE = [
  { layer: "Database at rest", encrypted: true, algorithm: "AES-256 (KMS-managed)" },
  { layer: "Database backups", encrypted: true, algorithm: "AES-256 (S3 SSE-KMS)" },
  { layer: "Object storage (S3)", encrypted: true, algorithm: "AES-256 (S3 SSE-KMS)" },
  { layer: "In transit (TLS)", encrypted: true, algorithm: "TLS 1.3" },
  { layer: "Application logs", encrypted: true, algorithm: "AES-256" },
  { layer: "Audit logs archive", encrypted: true, algorithm: "AES-256 (Glacier)" },
];

export function SuperAdminKmsVault() {
  const activeKeys = KEYS.filter(k => k.status === "active").length;
  const overdue = SECRETS.filter(s => s.rotationStatus === "overdue").length;
  const due = SECRETS.filter(s => s.rotationStatus === "due").length;

  const statusBadge = (s: string) => {
    const cls = s === "active" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "scheduled" ? "bg-cyan-500/15 text-cyan-700 border-cyan-500/30"
      : "bg-muted text-muted-foreground";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  const rotBadge = (s: string) => {
    const cls = s === "current" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : s === "due" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-rose-500/15 text-rose-700 border-rose-500/30";
    return <Badge variant="outline" className={cls}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="KMS & Secrets Vault"
        description="Encryption keys, rotation schedule, secret references, access log, and encryption coverage across all services."
        icon={<Icon name="Key" className="h-6 w-6" />}
        actions={[
          { label: "Rotate All Due", variant: "outline", onClick: () => toast.success("Rotation job queued for 1 due + 1 overdue secret") },
          { label: "Add Secret", onClick: () => toast.info("Opening secret intake form") },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <StatCard label="Active Keys" value={activeKeys} icon={<Icon name="Key" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Secrets Managed" value={SECRETS.length} icon={<Icon name="Lock" className="h-5 w-5" />} />
        <StatCard label="Rotation Due" value={due} icon={<Icon name="Clock" className="h-5 w-5" />} tone="warning" />
        <StatCard label="Overdue" value={overdue} icon={<Icon name="AlertTriangle" className="h-5 w-5" />} tone="danger" />
      </div>

      <SectionCard title="Encryption Keys" description="Key inventory with rotation schedule" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Rotated</TableHead>
              <TableHead>Next Rotation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {KEYS.map(k => (
              <TableRow key={k.id}>
                <TableCell className="font-mono text-xs">{k.id}</TableCell>
                <TableCell className="font-medium">{k.name}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{k.type}</Badge></TableCell>
                <TableCell className="text-xs">{k.purpose}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(k.createdAt)}</TableCell>
                <TableCell className="text-xs">{formatDate(k.rotatedAt)}</TableCell>
                <TableCell className="text-xs">{k.nextRotation === "—" ? "—" : formatDate(k.nextRotation)}</TableCell>
                <TableCell>{statusBadge(k.status)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Rotation queued for ${k.name}`)}>Rotate</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Secrets Vault" description="API keys, DB passwords, OAuth credentials">
          <ul className="space-y-2">
            {SECRETS.map(s => (
              <li key={s.id} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name="Lock" className="h-3.5 w-3.5 text-brand" />
                    <span className="font-mono text-xs">{s.name}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.service} · {s.type.replace(/_/g, " ")} · accessed {timeAgo(s.lastAccessed)}</p>
                </div>
                {rotBadge(s.rotationStatus)}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Encryption Coverage" description="Verified encryption layers">
          <ul className="space-y-2">
            {COVERAGE.map(c => (
              <li key={c.layer} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle2" className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="font-medium">{c.layer}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.algorithm}</p>
                  </div>
                </div>
                <Progress className="h-1.5 w-12" value={100} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="KMS Access Log" description="All key & secret access events (24h)">
        {ACCESS_LOG.length === 0 ? (
          <EmptyState icon={<Icon name="History" className="h-5 w-5" />} title="No access events" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Key / Secret</TableHead>
                <TableHead>At</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACCESS_LOG.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="font-mono text-xs">{l.id}</TableCell>
                  <TableCell className="font-medium text-xs">{l.actor}</TableCell>
                  <TableCell className="text-xs">{l.action}</TableCell>
                  <TableCell className="font-mono text-xs">{l.key}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(l.at)}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{l.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
