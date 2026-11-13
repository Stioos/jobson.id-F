"use client";

import { useState, useMemo } from "react";
import {
  Landmark, Check, X, Info, Building2, FileText, Globe, Users,
  Factory, ShieldCheck, Award, Banknote, Cpu, Truck, GraduationCap, Briefcase,
  Minus, ChevronRight, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrganization } from "../organization-context";
import { GOV_REG_CATEGORIES } from "@/data/gov-registrations";

// Icon mapping for each category
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "business-entity": Building2,
  "tax": FileText,
  "import-export": Globe,
  "state-local": Landmark,
  "labour": Users,
  "industry-specific": Factory,
  "environmental": ShieldCheck,
  "ip-brand": Award,
  "financial": Banknote,
  "technology": Cpu,
  "transport": Truck,
  "education": GraduationCap,
  "other": Briefcase,
};

// Badge type for each registration
type BadgeType = "Mandatory" | "Conditional" | "Optional";

// Mapping of which certificates / licences are mandatory vs conditional vs optional
const MANDATORY_REGS = new Set([
  "Private Limited Company Certificate of Incorporation", "Public Limited Company Certificate of Incorporation",
  "One Person Company (OPC) Certificate of Incorporation", "Limited Liability Partnership (LLP) Certificate of Incorporation",
  "Partnership Firm Certificate", "Sole Proprietorship Certificate",
  "GST Certificate", "PAN – Business Entity", "TAN Certificate",
  "Udyam Certificate (MSME)",
]);

const CONDITIONAL_REGS = new Set([
  "FSSAI Licence", "Drug Licence", "Factory Licence",
  "Shops and Establishments Certificate", "Trade Licence",
  "EPFO Certificate", "ESIC Certificate", "RERA Certificate (Real Estate Projects / Agents)",
  "Import Export Code (IEC) Certificate", "Trademark Certificate",
  "Consent to Establish (CTE)", "Consent to Operate (CTO)",
]);

function getBadgeType(regName: string): BadgeType {
  if (MANDATORY_REGS.has(regName)) return "Mandatory";
  if (CONDITIONAL_REGS.has(regName)) return "Conditional";
  return "Optional";
}

const BADGE_STYLES: Record<BadgeType, string> = {
  Mandatory: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Conditional: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Optional: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

const BADGE_DOTS: Record<BadgeType, string> = {
  Mandatory: "bg-blue-500",
  Conditional: "bg-amber-500",
  Optional: "bg-emerald-500",
};

const BADGE_SHORT: Record<BadgeType, string> = {
  Mandatory: "Req",
  Conditional: "Cond",
  Optional: "Opt",
};

interface RegistrationsLicencesScreenProps {
  onNavigate?: (sectionId: string) => void;
}

export function RegistrationsLicencesScreen({ onNavigate }: RegistrationsLicencesScreenProps = {}) {
  const { data, updateData, saveData, isSaving } = useOrganization();
  const [activeCategoryId, setActiveCategoryId] = useState<string>(GOV_REG_CATEGORIES[0].id);

  const selectedRegs = data.govRegistrations;

  // Toggle a single certificate / licence on or off
  const toggleReg = (regName: string) => {
    const exists = selectedRegs.some((r) => r.type === regName);
    if (exists) {
      updateData({ govRegistrations: selectedRegs.filter((r) => r.type !== regName) });
      toast.success(`${regName} removed.`);
    } else {
      updateData({ govRegistrations: [...selectedRegs, { id: `gr${Date.now()}`, type: regName, registrationNumber: "", issuingAuthority: "", validity: "", status: "Pending" }] });
      toast.success(`${regName} added.`);
    }
  };

  const removeReg = (id: string) => {
    updateData({ govRegistrations: selectedRegs.filter((r) => r.id !== id) });
    toast.success("Certificate / Licence removed.");
  };

  // Summary stats
  const mandatoryCount = selectedRegs.filter((r) => getBadgeType(r.type) === "Mandatory").length;
  const conditionalCount = selectedRegs.filter((r) => getBadgeType(r.type) === "Conditional").length;
  const optionalCount = selectedRegs.filter((r) => getBadgeType(r.type) === "Optional").length;

  // Active category and its certificates / licences
  const activeCategory = useMemo(
    () => GOV_REG_CATEGORIES.find((c) => c.id === activeCategoryId),
    [activeCategoryId]
  );

  const activeRegistrations = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.registrations;
  }, [activeCategory]);

  // Tri-state selection for the active category
  const activeCatSelectedCount = activeCategory
    ? activeCategory.registrations.filter((r) => selectedRegs.some((sr) => sr.type === r)).length
    : 0;
  const activeCatTotal = activeCategory?.registrations.length ?? 0;
  const activeCatCheckState: "all" | "some" | "none" =
    activeCatSelectedCount === 0 ? "none" : activeCatSelectedCount === activeCatTotal ? "all" : "some";

  const toggleActiveCategoryAll = () => {
    if (!activeCategory) return;
    if (activeCatCheckState === "all") {
      // remove all in this category
      const catRegNames = new Set(activeCategory.registrations);
      updateData({ govRegistrations: selectedRegs.filter((r) => !catRegNames.has(r.type)) });
      toast.success(`Cleared all from ${activeCategory.title}.`);
    } else {
      // add all missing in this category
      const existing = new Set(selectedRegs.map((r) => r.type));
      const toAdd = activeCategory.registrations
        .filter((r) => !existing.has(r))
        .map((r) => ({ id: `gr${Date.now()}-${r}`, type: r, registrationNumber: "", issuingAuthority: "", validity: "", status: "Pending" as const }));
      updateData({ govRegistrations: [...selectedRegs, ...toAdd] });
      toast.success(`Added all ${activeCategory.registrations.length} from ${activeCategory.title}.`);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ───── Info banner (only retained header element) ───── */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
        <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
        <p className="text-xs text-muted-foreground dark:text-slate-300">Choose only the Certification / Licences applicable to your business as registered, industry and operations.</p>
      </div>

      {/* ───── Two-column master-detail layout (fits the screen) ───── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* ═══ LEFT CARD: Categories list ═══ */}
        <div className="flex flex-col rounded-xl border border-border bg-card/80 dark:border-white/10 dark:bg-slate-900/60">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5 dark:border-white/10">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground dark:text-white">Categories</p>
              <p className="text-[10px] text-muted-foreground dark:text-slate-400">{GOV_REG_CATEGORIES.length} groups · {GOV_REG_CATEGORIES.reduce((n, c) => n + c.registrations.length, 0)} items</p>
            </div>
          </div>

          {/* Scrollable category list */}
          <div className="max-h-[460px] min-h-[260px] flex-1 space-y-1.5 overflow-y-auto p-2.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-white/10 dark:hover:scrollbar-thumb-white/20">
            {GOV_REG_CATEGORIES.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground dark:border-white/10">
                No categories available.
              </div>
            )}
            {GOV_REG_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Landmark;
              const isActive = cat.id === activeCategoryId;
              const selectedInCat = cat.registrations.filter((r) => selectedRegs.some((sr) => sr.type === r)).length;
              const totalInCat = cat.registrations.length;
              const checkState: "all" | "some" | "none" =
                selectedInCat === 0 ? "none" : selectedInCat === totalInCat ? "all" : "some";

              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 transition-all",
                    isActive
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/20 dark:border-emerald-500/60 dark:bg-emerald-500/15"
                      : "border-border/60 bg-background/60 hover:border-emerald-500/40 hover:bg-muted/30 dark:border-white/5 dark:bg-slate-950/30 dark:hover:border-emerald-500/30"
                  )}
                >
                  {/* Tri-state checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // toggle all in this category
                      if (checkState === "all") {
                        const catRegNames = new Set(cat.registrations);
                        updateData({ govRegistrations: selectedRegs.filter((r) => !catRegNames.has(r.type)) });
                        toast.success(`Cleared all from ${cat.title}.`);
                      } else {
                        const existing = new Set(selectedRegs.map((r) => r.type));
                        const toAdd = cat.registrations
                          .filter((r) => !existing.has(r))
                          .map((r) => ({ id: `gr${Date.now()}-${r}`, type: r, registrationNumber: "", issuingAuthority: "", validity: "", status: "Pending" as const }));
                        updateData({ govRegistrations: [...selectedRegs, ...toAdd] });
                        toast.success(`Added all ${cat.registrations.length} from ${cat.title}.`);
                      }
                    }}
                    aria-label={checkState === "all" ? "Deselect all in category" : "Select all in category"}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors cursor-pointer",
                      checkState === "all"
                        ? "border-emerald-500 bg-emerald-500 text-slate-950"
                        : checkState === "some"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                        : "border-border bg-background text-transparent group-hover:border-emerald-500/50 dark:border-white/20 dark:bg-slate-950"
                    )}
                  >
                    {checkState === "all" && <Check className="h-3 w-3 stroke-[3]" />}
                    {checkState === "some" && <Minus className="h-3 w-3 stroke-[3]" />}
                  </button>

                  {/* Icon */}
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  {/* Label + meta */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-[11.5px] font-semibold leading-tight",
                        isActive ? "text-emerald-700 dark:text-emerald-200" : "text-foreground dark:text-slate-200"
                      )}
                    >
                      {cat.title}
                    </p>
                    <p className="mt-0.5 text-[9.5px] text-muted-foreground dark:text-slate-400">
                      {totalInCat} items{selectedInCat > 0 && ` · ${selectedInCat} selected`}
                    </p>
                  </div>

                  {/* Active arrow indicator */}
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-all",
                      isActive ? "text-emerald-600 dark:text-emerald-300 translate-x-0 opacity-100" : "text-muted-foreground/40 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ RIGHT CARD: Registrations data for the active category ═══ */}
        <div className="flex min-w-0 flex-col rounded-xl border border-border bg-card/80 dark:border-white/10 dark:bg-slate-900/60">
          {activeCategory && (
            <>
              {/* Right card header */}
              <div className="flex flex-col gap-2 border-b border-border/60 px-3 py-2.5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {(() => {
                      const Icon = CATEGORY_ICONS[activeCategory.id] || Landmark;
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground dark:text-white">{activeCategory.title}</p>
                    <p className="text-[10px] text-muted-foreground dark:text-slate-400">
                      {activeRegistrations.length} shown · {activeCatSelectedCount}/{activeCatTotal} selected
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {/* Legend */}
                  <div className="hidden items-center gap-2 text-[9px] text-muted-foreground dark:text-slate-400 sm:flex">
                    <span className="flex items-center gap-1"><span className={cn("h-1.5 w-1.5 rounded-full", BADGE_DOTS.Mandatory)} /> Mandatory</span>
                    <span className="flex items-center gap-1"><span className={cn("h-1.5 w-1.5 rounded-full", BADGE_DOTS.Conditional)} /> Conditional</span>
                    <span className="flex items-center gap-1"><span className={cn("h-1.5 w-1.5 rounded-full", BADGE_DOTS.Optional)} /> Optional</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleActiveCategoryAll}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {activeCatCheckState === "all" ? "Clear all" : "Select all"}
                  </button>
                </div>
              </div>

              {/* Registrations list */}
              <div className="max-h-[460px] min-h-[260px] flex-1 overflow-y-auto p-2.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-white/10 dark:hover:scrollbar-thumb-white/20">
                {activeRegistrations.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-[11px] text-muted-foreground dark:border-white/10">
                    No registrations match your filters in this category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {activeRegistrations.map((reg) => {
                      const isSelected = selectedRegs.some((r) => r.type === reg);
                      const badge = getBadgeType(reg);
                      return (
                        <label
                          key={reg}
                          className={cn(
                            "group flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-all",
                            isSelected
                              ? "border-emerald-500 bg-emerald-500/10 dark:border-emerald-500/50 dark:bg-emerald-500/15"
                              : "border-border/60 bg-background/60 hover:border-emerald-500/30 hover:bg-muted/30 dark:border-white/5 dark:bg-slate-950/30"
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleReg(reg)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 shrink-0 border-border data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:text-slate-950 dark:border-white/20"
                          />
                          <span
                            className={cn(
                              "flex-1 select-none text-[11px] font-medium leading-tight",
                              isSelected ? "text-emerald-700 dark:text-emerald-200" : "text-foreground/80 dark:text-slate-300"
                            )}
                          >
                            {reg}
                          </span>
                          <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold", BADGE_STYLES[badge])}>
                            {BADGE_SHORT[badge]}
                          </span>
                          {isSelected && <Check className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-300" />}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Right card footer: Selected Registrations summary + Save */}
          <div className="border-t border-border/60 dark:border-white/10">
            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-border/60 dark:divide-white/10">
              <div className="px-3 py-2 text-center">
                <p className="text-base font-extrabold leading-none text-blue-600 dark:text-blue-400">{mandatoryCount}</p>
                <p className="mt-1 text-[9px] font-semibold text-muted-foreground dark:text-slate-400">Mandatory</p>
              </div>
              <div className="px-3 py-2 text-center">
                <p className="text-base font-extrabold leading-none text-amber-600 dark:text-amber-400">{conditionalCount}</p>
                <p className="mt-1 text-[9px] font-semibold text-muted-foreground dark:text-slate-400">Conditional</p>
              </div>
              <div className="px-3 py-2 text-center">
                <p className="text-base font-extrabold leading-none text-emerald-600 dark:text-emerald-400">{optionalCount}</p>
                <p className="mt-1 text-[9px] font-semibold text-muted-foreground dark:text-slate-400">Optional</p>
              </div>
            </div>

            {/* Selected chips (scrollable) */}
            {selectedRegs.length > 0 && (
              <div className="max-h-28 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {selectedRegs.map((reg) => {
                    const badge = getBadgeType(reg.type);
                    return (
                      <span
                        key={reg.id}
                        className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 py-0.5 pl-2 pr-1 dark:border-white/10 dark:bg-slate-950/40"
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", BADGE_DOTS[badge])} />
                        <span className="max-w-[160px] truncate text-[10px] font-medium text-foreground dark:text-slate-200">{reg.type}</span>
                        <button
                          type="button"
                          onClick={() => removeReg(reg.id)}
                          className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"
                          aria-label={`Remove ${reg.type}`}
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="px-3 pb-3 pt-2">
              <button
                type="button"
                onClick={async () => {
                  await saveData("Registrations & Licences");
                  onNavigate?.("documents");
                }}
                disabled={isSaving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Saving..." : `Save Selections (${selectedRegs.length})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
