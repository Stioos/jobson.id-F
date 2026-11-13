"use client";

import { useState } from "react";
import {
  Globe,
  Save,
  ArrowRight, Check,
  Plus, X,
  Boxes, Network, Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useOrganization } from "../organization-context";

interface CompanyInfoScreenProps {
  onNavigate?: (sectionId: string) => void;
}

// ─── Checkbox group option constants (per reference image) ───
const NATURE_OF_BUSINESS_OPTIONS = [
  "Manufacturing & Production",
  "Trading & Merchandising",
  "Distribution & Supply Chain",
  "Retail & Customer Sales",
  "Professional & Business Services",
  "Agency & Business Partnerships",
  "Importer & Exporter",
  "Wholesale & Bulk Trading",
  "Franchise & Dealership Operations",
];
const NATURE_OF_BUSINESS_DESCRIPTIONS: Record<string, string> = {
  "Manufacturing & Production": "Production, assembly, and fabrication of goods",
  "Trading & Merchandising": "Buying and selling of finished goods",
  "Distribution & Supply Chain": "Logistics, warehousing, and distribution networks",
  "Retail & Customer Sales": "Direct sales of goods to end consumers",
  "Professional & Business Services": "Consulting, advisory, and specialized services",
  "Agency & Business Partnerships": "Representing brands as an agent or partner",
  "Importer & Exporter": "Cross-border import and export of goods",
  "Wholesale & Bulk Trading": "Bulk sale of goods to resellers and businesses",
  "Franchise & Dealership Operations": "Operating franchises or authorized dealerships",
};
const GEOGRAPHICAL_SERVICE_AREA_OPTIONS = [
  "Local", "Regional", "National", "International", "Worldwide (Global)",
];
const GEOGRAPHICAL_DESCRIPTIONS: Record<string, string> = {
  "Local": "Serves customers within a specific city, town, or nearby areas.",
  "Regional": "Serves customers across multiple cities, districts, or states within a specific region.",
  "National": "Provides services across the entire country.",
  "International": "Serves customers in multiple countries.",
  "Worldwide (Global)": "Provides products or services across global markets.",
};
const SUPPLY_CAPABILITY_OPTIONS = [
  "Products & Materials",
  "Manufacturing & Production",
  "Job Work & Processing",
  "Professional Services",
  "Manpower & Staffing",
  "Equipment & Machinery Supply",
  "Equipment Rental & Leasing",
  "Equipment Maintenance & Repair",
  "Consulting & Advisory",
  "Design & Engineering",
  "Projects & Execution",
  "Construction & Contract Works",
  "Installation & Commissioning",
  "Procurement & Sourcing",
  "Logistics & Transportation",
  "Testing & Inspection",
  "Training & Development",
  "Outsourcing & Managed Services",
];
const SUPPLY_CAPABILITY_DESCRIPTIONS: Record<string, string> = {
  "Products & Materials": "Finished products, raw materials and components",
  "Manufacturing & Production": "Manufacturing, assembly and production",
  "Job Work & Processing": "Machining, fabrication, processing and customization",
  "Professional Services": "Business, technical and specialized services",
  "Manpower & Staffing": "Skilled, unskilled and contract workforce",
  "Equipment & Machinery Supply": "Industrial equipment, tools and machinery",
  "Equipment Rental & Leasing": "Machinery, tools and equipment on rent or lease",
  "Equipment Maintenance & Repair": "Servicing, maintenance and repairs",
  "Consulting & Advisory": "Business, technical and management consulting",
  "Design & Engineering": "Architecture, CAD, engineering and product design",
  "Projects & Execution": "End-to-end project execution and management",
  "Construction & Contract Works": "Civil, electrical, mechanical and infrastructure works",
  "Installation & Commissioning": "Installation, integration and commissioning",
  "Procurement & Sourcing": "Purchasing, vendor sourcing and material procurement",
  "Logistics & Transportation": "Freight, transportation, warehousing and delivery",
  "Testing & Inspection": "Quality testing, inspection and technical evaluation",
  "Training & Development": "Corporate training, technical training and skill development",
  "Outsourcing & Managed Services": "Business process outsourcing and managed operations",
};

// ─── Reusable checkbox group section ───
function CheckboxGroupSection({
  title, description, icon: Icon, accent, options, selectedValues, onToggle, descriptions,
}: {
  title: string;
  description: string;
  icon: typeof Boxes;
  accent: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  descriptions?: Record<string, string>;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      {/* Header bar */}
      <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4 sm:px-7 dark:border-white/10">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", accent)}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-foreground dark:text-white">{title}</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground dark:bg-white/5 dark:text-slate-300">
              {selectedValues.length} selected
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">{description}</p>
        </div>
      </div>

      {/* Checkbox grid */}
      <div className={cn("grid gap-2.5 p-5 sm:gap-3 sm:p-7", descriptions ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
        {options.map((opt) => {
          const isChecked = selectedValues.includes(opt);
          const desc = descriptions?.[opt];
          return (
            <label
              key={opt}
              className={cn(
                "group flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 transition-all",
                isChecked
                  ? "border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30 dark:border-emerald-500/50 dark:bg-emerald-500/15"
                  : "border-border bg-background/80 hover:border-emerald-500/40 hover:bg-muted/50 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-emerald-500/40 dark:hover:bg-white/[0.04]"
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(opt)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-emerald-600 focus:ring-emerald-500 dark:border-white/20"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className={cn(
                    "text-xs font-semibold leading-tight",
                    isChecked ? "text-emerald-700 dark:text-emerald-300" : "text-foreground/80 dark:text-slate-300"
                  )}>
                    {opt}
                  </span>
                  {isChecked && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                {desc && (
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground dark:text-slate-400">{desc}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}

export function CompanyInfoScreen({ onNavigate }: CompanyInfoScreenProps = {}) {
  const {
    data,
    updateData,
    toggleBusinessType,
    toggleGeographicalArea,
    toggleSupplyCapability,
    toggleServedCountry,
    saveData,
    isSaving,
  } = useOrganization();

  const [copiedGstin, setCopiedGstin] = useState(false);
  // New country input for the servedCountries multi-select
  const [newCountry, setNewCountry] = useState("");

  const handleCopyGstin = () => {
    if (data.gstin) {
      navigator.clipboard.writeText(data.gstin);
      setCopiedGstin(true);
      toast.success("GSTIN copied to clipboard!");
      setTimeout(() => setCopiedGstin(false), 2000);
    }
  };

  const handleSaveAndContinue = async () => {
    await saveData("Company info details");

    if (onNavigate) {
      onNavigate("industry");
      toast.info("Continuing to Industry Hierarchy step...");
    }
  };

  const handleSaveOnly = async () => {
    await saveData("Company info details");
  };

  return (
    <div className="space-y-8">
      {/* ───────────────────────────────────────────────
          Header
          (screen title & description now render in the dashboard header)
      ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        {/* "Visit Official Website" button removed per request */}
      </div>

      {/* ───────────────────────────────────────────────
          Section 1: Nature of Business, Geographical Service Area & Supply Capabilities
          (Replaces the former "Organization Identity" section)
      ─────────────────────────────────────────────── */}
      <div className="space-y-6">
        <CheckboxGroupSection
          title="Nature of Business"
          description="Select all business activities that apply to your organization."
          icon={Boxes}
          accent="bg-purple-500/15 text-purple-600 dark:text-purple-400"
          options={NATURE_OF_BUSINESS_OPTIONS}
          selectedValues={data.natureOfBusinessTypes}
          onToggle={toggleBusinessType}
          descriptions={NATURE_OF_BUSINESS_DESCRIPTIONS}
        />

        <CheckboxGroupSection
          title="Geographical Service Area"
          description="Select the geographical markets your organization serves."
          icon={Network}
          accent="bg-blue-500/15 text-blue-600 dark:text-blue-400"
          options={GEOGRAPHICAL_SERVICE_AREA_OPTIONS}
          selectedValues={data.geographicalServiceAreas}
          onToggle={toggleGeographicalArea}
          descriptions={GEOGRAPHICAL_DESCRIPTIONS}
        />

        {/* Countries Served — multi-select (shown when International or Worldwide is selected) */}
        {(data.geographicalServiceAreas.includes("International") || data.geographicalServiceAreas.includes("Worldwide (Global)")) && (
          <section className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-card shadow-soft dark:to-slate-900 dark:shadow-none">
            <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4 sm:px-7 dark:border-white/10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Globe className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-foreground dark:text-white">Countries Served</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground dark:bg-white/5 dark:text-slate-300">
                    {data.servedCountries.length} countries
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground dark:text-slate-400">
                  Add the countries where your organization serves customers.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              {/* Selected countries as removable chips */}
              <div className="flex flex-wrap gap-2">
                {data.servedCountries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                  >
                    {country}
                    <button
                      type="button"
                      onClick={() => toggleServedCountry(country)}
                      className="text-emerald-600/60 hover:text-rose-500 dark:text-emerald-400/60 dark:hover:text-rose-400 cursor-pointer"
                      aria-label={`Remove ${country}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {data.servedCountries.length === 0 && (
                  <p className="text-xs text-muted-foreground dark:text-slate-400">No countries added yet. Use the box below to add countries.</p>
                )}
              </div>

              {/* Add country input */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const c = newCountry.trim();
                      if (!c) return;
                      if (data.servedCountries.some((x) => x.toLowerCase() === c.toLowerCase())) {
                        toast.error("Country already added.");
                        return;
                      }
                      toggleServedCountry(c);
                      setNewCountry("");
                    }
                  }}
                  placeholder="Type a country name and press Enter (e.g. Germany)"
                  className="h-10 flex-1 rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    const c = newCountry.trim();
                    if (!c) return;
                    if (data.servedCountries.some((x) => x.toLowerCase() === c.toLowerCase())) {
                      toast.error("Country already added.");
                      return;
                    }
                    toggleServedCountry(c);
                    setNewCountry("");
                    toast.success(`${c} added to countries served.`);
                  }}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-emerald-500 px-4 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Country
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground dark:text-slate-500">
                Quick-pick common countries — click to add:
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["India", "United States", "United Kingdom", "Singapore", "United Arab Emirates", "Germany", "Australia", "Japan", "Canada", "Saudi Arabia"].map((c) => {
                  const already = data.servedCountries.some((x) => x.toLowerCase() === c.toLowerCase());
                  return (
                    <button
                      key={c}
                      type="button"
                      disabled={already}
                      onClick={() => toggleServedCountry(c)}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer",
                        already
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default"
                          : "border-border bg-background/80 text-foreground/70 hover:border-emerald-500/40 hover:text-emerald-600 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
                      )}
                    >
                      {already && <Check className="mr-1 inline h-2.5 w-2.5" />}{c}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <CheckboxGroupSection
          title="Supply Capabilities"
          description="Select the supply capabilities your organization offers."
          icon={Wrench}
          accent="bg-amber-500/15 text-amber-600 dark:text-amber-400"
          options={SUPPLY_CAPABILITY_OPTIONS}
          selectedValues={data.supplyCapabilities}
          onToggle={toggleSupplyCapability}
          descriptions={SUPPLY_CAPABILITY_DESCRIPTIONS}
        />
      </div>



      {/* ───────────────────────────────────────────────
          Footer Actions: Save & Continue
      ─────────────────────────────────────────────── */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleSaveOnly}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/80 px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:hover:bg-white/10 disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={handleSaveAndContinue}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? "Saving details..." : "Save & Continue"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
