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
import { formatDate } from "@/lib/format";

interface DocumentItem {
  id: string;
  name: string;
  type: "resume" | "offer_letter" | "id_proof" | "certificate" | "other";
  sizeKb: number;
  uploadedAt: string;
}

const SEED_DOCS: DocumentItem[] = [
  {
    id: "d_1",
    name: "Priya_Nair_Resume_v3.pdf",
    type: "resume",
    sizeKb: 184,
    uploadedAt: "2024-10-15T10:00:00Z",
  },
  {
    id: "d_2",
    name: "TechCorp_Offer_Letter.pdf",
    type: "offer_letter",
    sizeKb: 92,
    uploadedAt: "2024-10-12T08:30:00Z",
  },
  {
    id: "d_3",
    name: "PAN_Card.pdf",
    type: "id_proof",
    sizeKb: 56,
    uploadedAt: "2024-08-01T10:00:00Z",
  },
  {
    id: "d_4",
    name: "AWS_Certified_Cloud_Practitioner.pdf",
    type: "certificate",
    sizeKb: 124,
    uploadedAt: "2024-07-22T10:00:00Z",
  },
  {
    id: "d_5",
    name: "Google_UX_Design_Certificate.pdf",
    type: "certificate",
    sizeKb: 110,
    uploadedAt: "2024-06-10T10:00:00Z",
  },
];

const TYPE_LABELS: Record<DocumentItem["type"], string> = {
  resume: "Resume",
  offer_letter: "Offer Letter",
  id_proof: "ID Proof",
  certificate: "Certificate",
  other: "Other",
};

const TYPE_ICONS: Record<DocumentItem["type"], string> = {
  resume: "FileText",
  offer_letter: "Gift",
  id_proof: "Shield",
  certificate: "Award",
  other: "FileStack",
};

export function CandidateDocuments() {
  const [docs, setDocs] = React.useState<DocumentItem[]>(SEED_DOCS);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  function download(d: DocumentItem) {
    toast.success(`Downloading ${d.name}`, {
      description: `${d.sizeKb} KB · ${TYPE_LABELS[d.type]}`,
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    setDocs((prev) => prev.filter((d) => d.id !== deleteId));
    toast.success("Document deleted");
    setDeleteId(null);
  }

  function uploadDoc(name: string, type: DocumentItem["type"], sizeKb: number) {
    setDocs((prev) => [
      {
        id: `d_${Date.now()}`,
        name,
        type,
        sizeKb,
        uploadedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setUploadOpen(false);
    toast.success("Document uploaded");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Vault"
        description="Securely store resumes, offer letters, ID proofs, and certificates."
        actions={[
          { label: "Upload", variant: "default", onClick: () => setUploadOpen(true) },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox
          label="Total documents"
          value={docs.length}
          icon="FileStack"
        />
        <StatBox
          label="Resumes"
          value={docs.filter((d) => d.type === "resume").length}
          icon="FileText"
        />
        <StatBox
          label="Certificates"
          value={docs.filter((d) => d.type === "certificate").length}
          icon="Award"
        />
        <StatBox
          label="Storage used"
          value={`${(docs.reduce((s, d) => s + d.sizeKb, 0) / 1024).toFixed(1)} MB`}
          icon="Database"
        />
      </div>

      {docs.length === 0 ? (
        <EmptyState
          icon={<Icon name="FileStack" className="h-5 w-5" />}
          title="No documents yet"
          description="Upload your first document to get started."
          action={<Button onClick={() => setUploadOpen(true)}>Upload</Button>}
        />
      ) : (
        <SectionCard title="My documents">
          <div className="max-h-[60vh] space-y-2 overflow-y-auto scroll-thin">
            {docs.map((d) => (
              <div
                key={d.id}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon name={TYPE_ICONS[d.type]} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{d.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <Badge variant="outline">{TYPE_LABELS[d.type]}</Badge>
                      <span>{d.sizeKb} KB</span>
                      <span>Uploaded {formatDate(d.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => download(d)}>
                    <Icon name="FileStack" className="h-4 w-4" /> Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteId(d.id)}
                  >
                    <Icon name="AlertTriangle" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onUpload={uploadDoc} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              The document will be permanently removed from your vault. This action
              cannot be undone.
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

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon name={icon} className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="text-sm font-semibold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UploadDialog({
  open,
  onOpenChange,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpload: (name: string, type: DocumentItem["type"], sizeKb: number) => void;
}) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<DocumentItem["type"]>("resume");
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName("");
      setType("resume");
      setDragOver(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription>
            PDF, JPG, or PNG up to 10MB. Stored encrypted at rest.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) setName(file.name);
            }}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              dragOver ? "border-brand bg-brand/5" : "border-border"
            }`}
          >
            <Icon name="FileStack" className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">
              {name || "Drag & drop or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dname">Document name</Label>
            <Input
              id="dname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My_Resume.pdf"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as DocumentItem["type"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resume">Resume</SelectItem>
                <SelectItem value="offer_letter">Offer letter</SelectItem>
                <SelectItem value="id_proof">ID proof</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!name.trim()) {
                toast.error("Document name is required");
                return;
              }
              onUpload(name, type, 80 + Math.floor(Math.random() * 200));
            }}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
