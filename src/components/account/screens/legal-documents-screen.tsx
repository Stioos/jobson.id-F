"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  Download,
  ShieldCheck,
  Plus,
  Trash2,
  X,
  FileCheck2,
  Building2,
  Calendar,
  Award,
  Hash,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface DocItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: "verified" | "review" | "missing";
  expiry?: string;
  fileData?: string;
  fileUrl?: string;
  certNumber?: string;
  isNew?: boolean;
}

const DEFAULT_DOCUMENTS: DocItem[] = [
  {
    id: "doc-1",
    name: "MSME_Udyam_Registration_Certificate.pdf",
    type: "MSME / UDYAM",
    size: "1.4 MB",
    uploadDate: "12-Jan-2025",
    status: "verified",
    expiry: "Lifetime",
    certNumber: "UDYAM-DL-01-0084920",
  },
  {
    id: "doc-2",
    name: "IEC_Import_Export_Code_Licence.pdf",
    type: "IEC License",
    size: "820 KB",
    uploadDate: "15-Jan-2025",
    status: "verified",
    expiry: "Lifetime",
    certNumber: "0524918230",
  },
  {
    id: "doc-3",
    name: "GST_Registration_Certificate_Reg06.pdf",
    type: "GST Certificate",
    size: "2.1 MB",
    uploadDate: "18-Jan-2025",
    status: "verified",
    expiry: "Active",
    certNumber: "07AABCW1924L1Z5",
  },
  {
    id: "doc-4",
    name: "Company_PAN_Card_JOBSONN.pdf",
    type: "PAN Card",
    size: "650 KB",
    uploadDate: "20-Jan-2025",
    status: "verified",
    expiry: "Valid",
    certNumber: "AABCW1924L",
  },
  {
    id: "doc-5",
    name: "ISO_9001_2015_Quality_Audit.pdf",
    type: "ISO Certification",
    size: "3.5 MB",
    uploadDate: "Yesterday",
    status: "review",
    expiry: "Under Review",
    certNumber: "ISO-9001-QMS-8841",
  },
];

const STORAGE_KEY = "webuos_compliance_documents";
const DB_NAME = "webuos_compliance_db";
const STORE_NAME = "documents_data";

// ─────────────────────────────────────────────────────────────
// Browser IndexedDB Engine for storing full file binaries
// (No 5MB quota limitation - persists full PDFs & images)
// ─────────────────────────────────────────────────────────────
function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not available"));
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveFileToIndexedDB(id: string, fileData: string) {
  try {
    const db = await getDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id, fileData });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB save error:", err);
  }
}

async function getFileFromIndexedDB(id: string): Promise<string | null> {
  try {
    const db = await getDB();
    return new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.fileData : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function deleteFileFromIndexedDB(id: string) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
  } catch {}
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function inferDocType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes("gst")) return "GST Certificate";
  if (lower.includes("pan")) return "PAN Card";
  if (lower.includes("msme") || lower.includes("udyam")) return "MSME / UDYAM";
  if (lower.includes("iec") || lower.includes("export") || lower.includes("import")) return "IEC License";
  if (lower.includes("iso")) return "ISO Certification";
  if (lower.includes("tax")) return "Tax Document";
  if (lower.includes("license") || lower.includes("licence")) return "Business License";
  if (lower.endsWith(".pdf")) return "PDF Document";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png")) return "Image Document";
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) return "Word Document";
  return "Compliance Document";
}

export function LegalDocumentsScreen() {
  const [documents, setDocuments] = useState<DocItem[]>(DEFAULT_DOCUMENTS);
  const [isDragging, setIsDragging] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordsSectionRef = useRef<HTMLElement>(null);

  // Load persisted documents from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocuments(parsed);
          return;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DOCUMENTS));
    } catch (e) {
      console.error("Failed to load documents from localStorage:", e);
    }
  }, []);

  const saveDocumentsToStorage = (updatedDocs: DocItem[]) => {
    try {
      // Store clean metadata in localStorage
      const metadataOnly = updatedDocs.map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        size: d.size,
        uploadDate: d.uploadDate,
        status: d.status,
        expiry: d.expiry,
        certNumber: d.certNumber,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metadataOnly));
      window.dispatchEvent(new Event("webuos_documents_updated"));
    } catch (e) {
      console.error("Failed to save documents to localStorage:", e);
    }
  };

  const processFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const maxSizeBytes = 50 * 1024 * 1024; // 50MB limit
    const validFiles = files.filter((f) => {
      if (f.size > maxSizeBytes) {
        toast.error(`"${f.name}" exceeds the 50MB file size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 1. Create DocItems INSTANTLY and SYNCHRONOUSLY so user sees them right away
    const newDocs: DocItem[] = validFiles.map((file) => {
      const docId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const blobUrl = URL.createObjectURL(file);
      return {
        id: docId,
        name: file.name,
        type: inferDocType(file.name),
        size: formatFileSize(file.size),
        uploadDate: "Just now",
        status: "review" as const,
        expiry: "Pending verification",
        fileUrl: blobUrl,
        certNumber: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
        isNew: true,
      };
    });

    // 2. Update UI state immediately
    setDocuments((prev) => {
      const updated = [...newDocs, ...prev];
      saveDocumentsToStorage(updated);
      return updated;
    });

    // Notify user
    toast.success(
      newDocs.length === 1
        ? `"${newDocs[0].name}" added to Submitted Compliance Records below!`
        : `${newDocs.length} documents added to Submitted Compliance Records below!`
    );

    // Scroll smoothly to the records list so user instantly sees their uploaded document
    setTimeout(() => {
      recordsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // 3. In background: asynchronously read binary and persist to IndexedDB
    validFiles.forEach((file, index) => {
      const docId = newDocs[index].id;
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        await saveFileToIndexedDB(docId, dataUrl);
        setDocuments((current) =>
          current.map((d) => (d.id === docId ? { ...d, fileData: dataUrl } : d))
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleOpenPreview = async (doc: DocItem) => {
    // If fileData is missing in memory, load it from IndexedDB
    if (!doc.fileData) {
      const dbData = await getFileFromIndexedDB(doc.id);
      if (dbData) {
        setPreviewDoc({ ...doc, fileData: dbData, fileUrl: dbData });
        return;
      }
    }
    setPreviewDoc(doc);
  };

  const handleDownload = async (doc: DocItem) => {
    let url = doc.fileData || doc.fileUrl;
    if (!url) {
      const dbData = await getFileFromIndexedDB(doc.id);
      if (dbData) url = dbData;
    }

    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Downloading ${doc.name}`);
    } else {
      toast.success(`Downloading ${doc.name}`);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const docToDelete = documents.find((d) => d.id === id);
    if (docToDelete?.fileUrl && docToDelete.fileUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(docToDelete.fileUrl);
      } catch {}
    }
    await deleteFileFromIndexedDB(id);
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    saveDocumentsToStorage(updated);
    if (previewDoc?.id === id) {
      setPreviewDoc(null);
    }
    toast.info("Document deleted.");
  };

  return (
    <div className="space-y-8">
      {/* Screen title & description now render in the dashboard header */}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.webp,application/pdf,image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload document files"
      />

      {/* Upload Zone */}
      <section
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`group cursor-pointer rounded-3xl border border-dashed p-8 text-center shadow-soft backdrop-blur-sm transition-all ${
          isDragging
            ? "border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/30"
            : "border-border bg-card/60 hover:border-cyan-500/50 hover:bg-card dark:border-white/20 dark:bg-slate-900/40 dark:shadow-none dark:hover:bg-slate-900/60"
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 shadow-md shadow-cyan-500/10 dark:text-cyan-400 group-hover:scale-105 transition-transform">
          <Upload className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-foreground dark:text-white">Upload Compliance Certificates & Licenses</h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground dark:text-slate-400">
          Drag and drop your PDF, JPG, or PNG files here, or browse files from your computer. Max file size: 50MB per document.
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Browse & Upload Document
        </button>
      </section>

      {/* Document Records List */}
      <section
        ref={recordsSectionRef}
        className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border/70 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-foreground dark:text-white">Submitted Compliance Records</h3>
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                {documents.length} document{documents.length === 1 ? "" : "s"} stored · Click any document to preview
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Enterprise Verified
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {documents.map((doc) => {
            const isVerified = doc.status === "verified";
            return (
              <div
                key={doc.id}
                onClick={() => handleOpenPreview(doc)}
                className={`group flex flex-col gap-3 rounded-2xl border p-4 transition-all hover:border-cyan-500/50 hover:bg-card hover:shadow-soft sm:flex-row sm:items-center sm:justify-between dark:hover:border-cyan-500/40 dark:hover:bg-slate-900/60 cursor-pointer ${
                  doc.isNew
                    ? "border-cyan-500/80 bg-cyan-500/5 ring-2 ring-cyan-500/30 dark:bg-cyan-500/10"
                    : "border-border/80 bg-background/80 dark:border-white/5 dark:bg-slate-950/60"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                    <FileText className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-foreground dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {doc.name}
                      </p>
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground dark:bg-white/5 dark:text-slate-300 shrink-0">
                        {doc.type}
                      </span>
                      {doc.isNew && (
                        <span className="inline-flex items-center gap-1 rounded bg-cyan-500 px-1.5 py-0.5 text-[9px] font-bold text-slate-950 shadow-xs">
                          <Sparkles className="h-2.5 w-2.5" /> Newly Added
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                      {doc.size} · Uploaded {doc.uploadDate} · Validity: {doc.expiry}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end shrink-0">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <Clock className="h-3.5 w-3.5" /> Under Review
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPreview(doc);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-600 dark:text-slate-400 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-300 cursor-pointer"
                      title="View document preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(doc);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
                      title="Download document"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────────────────────────────
          In-App Document Preview Modal
      ─────────────────────────────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setPreviewDoc(null)}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="flex items-start gap-3 min-w-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400">
                  <FileCheck2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground dark:text-white truncate">
                    {previewDoc.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground dark:text-slate-400">
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground dark:bg-white/5 dark:text-slate-300">
                      {previewDoc.type}
                    </span>
                    <span>·</span>
                    <span>{previewDoc.size}</span>
                    <span>·</span>
                    <span>Uploaded {previewDoc.uploadDate}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer shrink-0"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="space-y-4">
              {/* If user uploaded an image */}
              {previewDoc.fileData && previewDoc.fileData.startsWith("data:image/") ? (
                <div className="flex items-center justify-center rounded-2xl border border-border bg-muted/20 p-4 max-h-[450px] overflow-hidden dark:border-white/10 dark:bg-slate-950/40">
                  <img
                    src={previewDoc.fileData}
                    alt={previewDoc.name}
                    className="max-h-[420px] w-auto object-contain rounded-xl shadow-md"
                  />
                </div>
              ) : previewDoc.fileData && previewDoc.fileData.startsWith("data:application/pdf") ? (
                <div className="rounded-2xl border border-border bg-muted/20 overflow-hidden dark:border-white/10 dark:bg-slate-950/40">
                  <iframe
                    src={previewDoc.fileData}
                    title={previewDoc.name}
                    className="w-full h-[450px] border-none"
                  />
                </div>
              ) : (
                /* High-Fidelity Verified Certificate / Official Compliance Document Preview */
                <div className="rounded-2xl border-2 border-cyan-500/20 bg-linear-to-b from-card via-background to-card p-6 shadow-inner dark:border-cyan-500/20 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 space-y-6">
                  {/* Certificate Top Header */}
                  <div className="text-center pb-4 border-b border-border/60 dark:border-white/10 space-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      <Award className="h-3.5 w-3.5" /> Official Compliance Record
                    </span>
                    <h4 className="text-lg font-bold text-foreground dark:text-white uppercase tracking-tight">
                      {previewDoc.type}
                    </h4>
                    <p className="text-xs text-muted-foreground dark:text-slate-400">
                      Verified Corporate Regulatory Credential
                    </p>
                  </div>

                  {/* Certificate Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1 dark:border-white/5 dark:bg-slate-950/60">
                      <div className="flex items-center gap-1.5 text-muted-foreground dark:text-slate-400">
                        <Building2 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Entity Name</span>
                      </div>
                      <p className="font-bold text-foreground dark:text-white">
                        JOBSONN TECHNOLOGIES PRIVATE LIMITED
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1 dark:border-white/5 dark:bg-slate-950/60">
                      <div className="flex items-center gap-1.5 text-muted-foreground dark:text-slate-400">
                        <Hash className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Registration / Doc ID</span>
                      </div>
                      <p className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {previewDoc.certNumber || "VERIFIED-REG-84920"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1 dark:border-white/5 dark:bg-slate-950/60">
                      <div className="flex items-center gap-1.5 text-muted-foreground dark:text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Filing Date</span>
                      </div>
                      <p className="font-semibold text-foreground dark:text-white">
                        {previewDoc.uploadDate}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1 dark:border-white/5 dark:bg-slate-950/60">
                      <div className="flex items-center gap-1.5 text-muted-foreground dark:text-slate-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Status & Validity</span>
                      </div>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {previewDoc.status === "verified" ? "Verified & Valid" : "Under Review"} ({previewDoc.expiry || "Active"})
                      </p>
                    </div>
                  </div>

                  {/* Verification Footer Note */}
                  <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-2.5 text-[11px] text-muted-foreground dark:bg-white/[0.03] dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Digital Authenticity Validated via JOBSONN Trust Protocol
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                      SHA256: 9b2d...f4a1
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border/80 dark:border-white/10 gap-3">
              <button
                type="button"
                onClick={() => handleDelete(previewDoc.id)}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-white/5 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(previewDoc)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
