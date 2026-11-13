"use client";

import { useState, useMemo } from "react";
import {
  FileText, ShieldCheck, CheckCircle2, Copy, RefreshCw, AlertCircle,
  Check, Save, Calendar, MapPin, Building2, ExternalLink, Search,
  Landmark, BadgeCheck, Banknote, Mail, Users, Activity, Hash, Building,
  Plus, Trash2, User, Briefcase, FileCheck, Lock, Eye, Upload, ChevronRight, Pencil, FileStack
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useOrganization } from "../organization-context";
import { GOV_REG_CATEGORIES, INDIAN_STATES } from "@/data/gov-registrations";

interface LegalTaxInfoScreenProps {
  onNavigate?: (sectionId: string) => void;
}

// ---- Reusable API field display card ----
function ApiField({
  label, value, icon: Icon, mono, accent, full,
}: {
  label: string;
  value: string;
  icon?: typeof FileText;
  mono?: boolean;
  accent?: "emerald" | "teal" | "amber";
  full?: boolean;
}) {
  const accentCls =
    accent === "emerald" ? "text-emerald-600 dark:text-emerald-400"
      : accent === "teal" ? "text-teal-600 dark:text-teal-400"
        : accent === "amber" ? "text-amber-600 dark:text-amber-400"
          : "text-foreground dark:text-white";
  return (
    <div className={cn("rounded-2xl border border-border/80 bg-background/80 p-4 dark:border-white/5 dark:bg-slate-950/60", full && "sm:col-span-2 lg:col-span-3")}>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider dark:text-slate-400">{label}</p>
      <p className={cn("mt-1 text-sm font-bold flex items-center gap-1.5", accentCls, mono && "font-mono")}>
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />}
        {value || <span className="text-muted-foreground italic font-normal">—</span>}
      </p>
    </div>
  );
}

export function LegalTaxInfoScreen({ onNavigate }: LegalTaxInfoScreenProps = {}) {
  const { data, updateData, saveData, verifyGstin, verifyCin, isSaving, isVerifyingGstin, isVerifyingCin } = useOrganization();
  const [govRegSearch, setGovRegSearch] = useState("");
  const [govRegCategory, setGovRegCategory] = useState("all");
  const [govRegState, setGovRegState] = useState("All States");

  // Filter registrations by search + category
  const filteredCategories = useMemo(() => {
    const query = govRegSearch.trim().toLowerCase();
    return GOV_REG_CATEGORIES
      .filter((cat) => govRegCategory === "all" || cat.id === govRegCategory)
      .map((cat) => ({
        ...cat,
        registrations: cat.registrations.filter((r) => !query || r.toLowerCase().includes(query)),
      }))
      .filter((cat) => cat.registrations.length > 0);
  }, [govRegSearch, govRegCategory]);

  const totalRegCount = GOV_REG_CATEGORIES.reduce((sum, c) => sum + c.registrations.length, 0);

  const handleVerifyGstin = async () => {
    await verifyGstin();
  };

  const handleVerifyCin = async () => {
    await verifyCin();
  };

  const handleSave = async () => {
    await saveData("Legal & tax information");
    onNavigate?.("address-master");
  };

  return (
    <div className="space-y-8">
      {/* === B. Tax Information === */}
      <section className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm sm:p-6 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-foreground dark:text-white">Tax Information</h3>
          </div>
          <button type="button" onClick={handleVerifyGstin} disabled={isVerifyingGstin} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 cursor-pointer disabled:opacity-50">
            <RefreshCw className={cn("h-3.5 w-3.5", isVerifyingGstin && "animate-spin")} />
            {isVerifyingGstin ? "Verifying..." : data.isGstinVerified ? "Re-verify" : "Fetch & Verify GSTIN"}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* GSTIN — manual input (mandatory) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">GSTIN <span className="text-rose-500">*</span></label>
            <input type="text" value={data.gstin} onChange={(e) => { const val = e.target.value.toUpperCase(); const derivedPan = val.length >= 12 ? val.slice(2, 12) : data.pan; updateData({ gstin: val, isGstinVerified: false, pan: derivedPan }); }} maxLength={15} placeholder="29ABCDE1234F1Z5" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm font-mono text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
            {data.isGstinVerified && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ Verified</span>}
          </div>
          {/* PAN — manual input (mandatory) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">PAN Number <span className="text-rose-500">*</span></label>
            <input type="text" value={data.pan} onChange={(e) => updateData({ pan: e.target.value.toUpperCase() })} maxLength={10} placeholder="ABCDE1234F" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm font-mono text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
          </div>
          {/* PAN Holder Name — manual input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">PAN Holder Name</label>
            <input type="text" value={data.panHolderName} onChange={(e) => updateData({ panHolderName: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
          </div>
          {/* GST Registration Status — dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">GST Registration Status</label>
            <select value={data.gstRegistrationStatus} onChange={(e) => updateData({ gstRegistrationStatus: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
              <option value="">— Select —</option>
              <option>Registered</option><option>Not Registered</option><option>Composition</option><option>Cancelled</option>
            </select>
          </div>
          {/* GST Registration State — dropdown (Indian states) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">GST Registration State</label>
            <select value={data.gstRegistrationState} onChange={(e) => updateData({ gstRegistrationState: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
              <option value="">— Select —</option>
              <option>Andhra Pradesh (AP)</option><option>Arunachal Pradesh (AR)</option><option>Assam (AS)</option><option>Bihar (BR)</option><option>Chhattisgarh (CG)</option><option>Goa (GA)</option><option>Gujarat (GJ)</option><option>Haryana (HR)</option><option>Himachal Pradesh (HP)</option><option>Jharkhand (JH)</option><option>Karnataka (KA)</option><option>Kerala (KL)</option><option>Madhya Pradesh (MP)</option><option>Maharashtra (MH)</option><option>Manipur (MN)</option><option>Meghalaya (ML)</option><option>Mizoram (MZ)</option><option>Nagaland (NL)</option><option>Odisha (OD)</option><option>Punjab (PB)</option><option>Rajasthan (RJ)</option><option>Sikkim (SK)</option><option>Tamil Nadu (TN)</option><option>Telangana (TG)</option><option>Tripura (TR)</option><option>Uttar Pradesh (UP)</option><option>Uttarakhand (UK)</option><option>West Bengal (WB)</option><option>Delhi (DL)</option><option>Jammu &amp; Kashmir (JK)</option><option>Ladakh (LA)</option><option>Puducherry (PY)</option><option>Chandigarh (CH)</option><option>Other / Not in India</option>
            </select>
          </div>
          {/* GST Business Constitution — dropdown (16 options per reference) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Business Constitution <span className="text-rose-500">*</span></label>
            <select value={data.gstBusinessConstitution} onChange={(e) => updateData({ gstBusinessConstitution: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
              <option value="">— Select —</option>
              <option>Sole Proprietorship</option>
              <option>Partnership</option>
              <option>Limited Partnership</option>
              <option>Limited Liability Partnership (LLP)</option>
              <option>Private Limited Company</option>
              <option>Public Limited Company</option>
              <option>Corporation</option>
              <option>Limited Liability Company (LLC)</option>
              <option>Cooperative</option>
              <option>Non-Profit Organization</option>
              <option>Trust</option>
              <option>Branch Office</option>
              <option>Representative Office</option>
              <option>Joint Venture</option>
              <option>Government Entity</option>
              <option>Other Legal Entity</option>
            </select>
          </div>
        </div>

        {/* Conditional fields based on Business Constitution selection */}
        {data.gstBusinessConstitution && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* CIN — for Private/Public Limited, Corporation, Branch Office */}
            {["Private Limited Company", "Public Limited Company", "Corporation", "Branch Office"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">CIN Number <span className="text-rose-500">*</span></label>
                <input type="text" value={data.cin} onChange={(e) => updateData({ cin: e.target.value.toUpperCase() })} maxLength={21} placeholder="U72200KA2018PTC112233" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm font-mono text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* LLPIN — for LLP */}
            {data.gstBusinessConstitution === "Limited Liability Partnership (LLP)" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">LLPIN Number <span className="text-rose-500">*</span></label>
                <input type="text" value={data.cin} onChange={(e) => updateData({ cin: e.target.value.toUpperCase() })} maxLength={8} placeholder="AAA-1234" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm font-mono text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* Partnership Registration Number — for Partnership / Limited Partnership */}
            {["Partnership", "Limited Partnership"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Partnership Registration No. <span className="text-rose-500">*</span></label>
                <input type="text" value={data.cin} onChange={(e) => updateData({ cin: e.target.value })} placeholder="PR-12345-2018" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* Udyam / MSME — for Sole Proprietorship */}
            {data.gstBusinessConstitution === "Sole Proprietorship" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Udyam / MSME No.</label>
                <input type="text" value={data.cin} onChange={(e) => updateData({ cin: e.target.value })} placeholder="UDYAM-XX-00-0000000" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* Registration Number — for Cooperative, Non-Profit, Trust, Government Entity */}
            {["Cooperative", "Non-Profit Organization", "Trust", "Government Entity", "Joint Venture", "Representative Office", "Other Legal Entity"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Registration Number <span className="text-rose-500">*</span></label>
                <input type="text" value={data.cin} onChange={(e) => updateData({ cin: e.target.value })} placeholder="Registration Number" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* Date of Incorporation — for company-type entities */}
            {["Private Limited Company", "Public Limited Company", "Corporation", "Limited Liability Partnership (LLP)", "Branch Office"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Date of Incorporation <span className="text-rose-500">*</span></label>
                <input type="date" value={data.dateOfIncorporation} onChange={(e) => updateData({ dateOfIncorporation: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* Date of Establishment — for non-company entities */}
            {["Sole Proprietorship", "Partnership", "Limited Partnership", "Cooperative", "Non-Profit Organization", "Trust", "Joint Venture", "Government Entity", "Representative Office", "Other Legal Entity"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Date of Establishment</label>
                <input type="date" value={data.dateOfIncorporation} onChange={(e) => updateData({ dateOfIncorporation: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* ROC Code — for company-type entities */}
            {["Private Limited Company", "Public Limited Company", "Corporation"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">ROC Code</label>
                <select value={data.rocCode} onChange={(e) => updateData({ rocCode: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
                  <option value="">— Select —</option>
                  <option>RoC-Bangalore</option><option>RoC-Mumbai</option><option>RoC-Delhi</option><option>RoC-Chennai</option><option>RoC-Hyderabad</option><option>RoC-Pune</option><option>RoC-Ahmedabad</option><option>RoC-Kolkata</option><option>RoC-Jaipur</option><option>RoC-Cuttack</option><option>RoC-Shillong</option><option>Other</option>
                </select>
              </div>
            )}
            {/* Authorized Capital — for company-type entities */}
            {["Private Limited Company", "Public Limited Company", "Corporation"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Authorized Capital</label>
                <input type="text" value={data.authorizedCapital} onChange={(e) => updateData({ authorizedCapital: e.target.value })} placeholder="₹10,00,000" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* Paid-up Capital — for company-type entities */}
            {["Private Limited Company", "Public Limited Company", "Corporation"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Paid-up Capital</label>
                <input type="text" value={data.paidUpCapital} onChange={(e) => updateData({ paidUpCapital: e.target.value })} placeholder="₹5,00,000" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* Number of Partners — for Partnership / LLP / Limited Partnership */}
            {["Partnership", "Limited Partnership", "Limited Liability Partnership (LLP)"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Number of Partners</label>
                <input type="number" min={2} placeholder="2" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
            {/* Number of Directors — for company-type entities */}
            {["Private Limited Company", "Public Limited Company", "Corporation"].includes(data.gstBusinessConstitution) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Number of Directors</label>
                <input type="number" min={2} value={data.numberOfDirectors || ""} onChange={(e) => updateData({ numberOfDirectors: e.target.value })} placeholder="2" className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
              </div>
            )}
          </div>
        )}

      </section>

      {/* === C. Ownership & Authorization === */}
      <section className="rounded-3xl border border-border bg-card/80 p-5 shadow-soft backdrop-blur-sm sm:p-6 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border/60 dark:border-white/10">
          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-base font-bold text-foreground dark:text-white">Ownership &amp; Authorization</h3>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Authorized Representative Name <span className="text-rose-500">*</span></label>
            <input type="text" value={data.authorizedRepName} onChange={(e) => updateData({ authorizedRepName: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" />
          </div>
          {/* Designation — dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Designation</label>
            <select value={data.authorizedRepDesignation} onChange={(e) => updateData({ authorizedRepDesignation: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
              <option value="">— Select —</option>
              <option>Managing Director</option><option>Director</option><option>CEO / Founder</option><option>Partner</option><option>Proprietor</option><option>Authorized Signatory</option><option>Company Secretary (CS)</option><option>Chief Financial Officer (CFO)</option><option>General Manager</option><option>Other</option>
            </select>
          </div>
          {/* Relationship — dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Relationship with Business</label>
            <select value={data.authorizedRepRelationship} onChange={(e) => updateData({ authorizedRepRelationship: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
              <option value="">— Select —</option>
              <option>Director</option><option>Partner</option><option>Proprietor</option><option>Authorized Signatory</option><option>Managing Partner</option><option>Trustee</option><option>Other</option>
            </select>
          </div>
          {/* Representative Type — dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Representative Type</label>
            <select value={data.authorizedRepType} onChange={(e) => updateData({ authorizedRepType: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
              <option value="">— Select —</option>
              <option>Authorized Signatory</option><option>Power of Attorney Holder</option><option>Statutory Auditor</option><option>Company Secretary</option><option>Other</option>
            </select>
          </div>
          {/* Authorization Status — dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Authorization Status</label>
            <select value={data.authorizationStatus} onChange={(e) => updateData({ authorizationStatus: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
              <option value="">— Select —</option>
              <option>Verified</option><option>Pending Verification</option><option>Not Submitted</option><option>Rejected</option>
            </select>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? "Saving credentials..." : "Save Legal & Tax Info"}
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
