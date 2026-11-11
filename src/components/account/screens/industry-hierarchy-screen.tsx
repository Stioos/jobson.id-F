"use client";

import { useState, useRef, useEffect } from "react";
import {
  Factory,
  Zap,
  HardHat,
  Car,
  Plane,
  Bot,
  Cpu,
  Code2,
  Brain,
  Cloud,
  ShieldCheck,
  BarChart3,
  Radio,
  Briefcase,
  Lightbulb,
  Wallet,
  Scale,
  Megaphone,
  Stethoscope,
  ShoppingCart,
  Search,
  Check,
  Save,
  ArrowRight,
  ArrowLeft,
  Layers,
} from "lucide-react";
import { ecosystems } from "@/data/taxonomy";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

function getTaxonomyIcon(iconName: string, className = "h-4 w-4") {
  switch (iconName) {
    case "Factory":
      return <Factory className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "HardHat":
      return <HardHat className={className} />;
    case "Car":
      return <Car className={className} />;
    case "Plane":
      return <Plane className={className} />;
    case "Bot":
      return <Bot className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Code2":
      return <Code2 className={className} />;
    case "Brain":
      return <Brain className={className} />;
    case "Cloud":
      return <Cloud className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "BarChart3":
      return <BarChart3 className={className} />;
    case "Radio":
      return <Radio className={className} />;
    case "Briefcase":
      return <Briefcase className={className} />;
    case "Lightbulb":
      return <Lightbulb className={className} />;
    case "Wallet":
      return <Wallet className={className} />;
    case "Scale":
      return <Scale className={className} />;
    case "Megaphone":
      return <Megaphone className={className} />;
    case "Stethoscope":
      return <Stethoscope className={className} />;
    case "ShoppingCart":
      return <ShoppingCart className={className} />;
    default:
      return <Factory className={className} />;
  }
}

interface IndustryHierarchyScreenProps {
  onNavigate?: (sectionId: string) => void;
}

export function IndustryHierarchyScreen({ onNavigate }: IndustryHierarchyScreenProps = {}) {
  const [selectedEcosystem, setSelectedEcosystem] = useState<string | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeSectorId, setActiveSectorId] = useState<string | null>(null);
  const [sectorSearch, setSectorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  // Controls the Industries step — revealed only after the user clicks "Continue"
  const [showIndustries, setShowIndustries] = useState(false);

  const ecoRef = useRef<HTMLDivElement>(null);
  const [ecoHeight, setEcoHeight] = useState(210);

  useEffect(() => {
    if (!ecoRef.current) return;
    const updateHeight = () => {
      if (ecoRef.current) {
        setEcoHeight(ecoRef.current.offsetHeight);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(ecoRef.current);
    return () => observer.disconnect();
  }, []);

  const currentEco = ecosystems.find((e) => e.id === selectedEcosystem);

  // Filtered sectors by search
  const filteredSectors = currentEco
    ? currentEco.categories.filter((s) =>
        s.name.toLowerCase().includes(sectorSearch.trim().toLowerCase())
      )
    : [];

  // Available categories based on checked sectors
  const availableSectors = currentEco
    ? currentEco.categories.filter((s) => selectedSectors.includes(s.id))
    : [];

  const availableCategories = availableSectors.flatMap((s) =>
    s.categories.map((c) => ({ ...c, sectorName: s.name }))
  );

  // Filtered categories by search
  const filteredCategories = availableCategories.filter((c) => {
    const query = categorySearch.trim().toLowerCase();
    if (!query) return true;
    const matchName = c.name.toLowerCase().includes(query);
    const matchSector = c.sectorName?.toLowerCase().includes(query);
    const matchProduct = c.products?.some((p) => p.name.toLowerCase().includes(query));
    return matchName || matchSector || matchProduct;
  });

  // Active sector for the master-detail industries panel (reference image style)
  const activeSector = currentEco?.categories.find((s) => s.id === activeSectorId) || null;
  // Industries (subcategories) for the active sector, filtered by the category search
  const activeSectorIndustries = activeSector
    ? activeSector.categories.filter((c) => {
        const query = categorySearch.trim().toLowerCase();
        if (!query) return true;
        return c.name.toLowerCase().includes(query);
      })
    : [];

  const handleSelectEcosystem = (ecoId: string) => {
    if (selectedEcosystem === ecoId) {
      // Toggle off if clicking active industry
      setSelectedEcosystem(null);
      setSelectedSectors([]);
      setSelectedCategories([]);
      setActiveSectorId(null);
      setShowIndustries(false);
    } else {
      setSelectedEcosystem(ecoId);
      setSelectedSectors([]);
      setSelectedCategories([]);
      setActiveSectorId(null);
      setShowIndustries(false);
      setSectorSearch("");
      setCategorySearch("");
    }
  };

  const toggleSector = (id: string) => {
    setSelectedSectors((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((s) => s !== id) : [...prev, id];

      if (currentEco) {
        // Keep only categories belonging to remaining selected sectors
        const validCategories = currentEco.categories
          .filter((s) => next.includes(s.id))
          .flatMap((s) => s.categories)
          .map((c) => c.id);

        setSelectedCategories((prevCats) =>
          prevCats.filter((catId) => validCategories.includes(catId))
        );
      }

      return next;
    });
    // Set the active sector for the industries panel
    setActiveSectorId(id);
  };

  // Clicking a sector in the left list opens it in the industries panel (master-detail)
  const openSector = (id: string) => {
    setActiveSectorId(id);
    // Ensure the sector is also checked/selected
    if (!selectedSectors.includes(id)) {
      setSelectedSectors((prev) => [...prev, id]);
    }
  };

  const handleSelectAllSectors = () => {
    if (!currentEco) return;

    if (selectedSectors.length === currentEco.categories.length) {
      setSelectedSectors([]);
      setSelectedCategories([]);
    } else {
      setSelectedSectors(currentEco.categories.map((s) => s.id));
    }
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === filteredCategories.length) {
      const filteredIds = new Set(filteredCategories.map((c) => c.id));
      setSelectedCategories((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const filteredIds = filteredCategories.map((c) => c.id);
      setSelectedCategories((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedSectors([]);
    setActiveSectorId(null);
    setCategorySearch("");
  };

  // Continue from Sectors step to Industries step
  const handleContinue = () => {
    if (selectedSectors.length === 0) {
      toast.error("Please select at least one sector to continue.");
      return;
    }
    setShowIndustries(true);
    // Scroll to industries section after render
    setTimeout(() => {
      document.getElementById("industries-step")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleApply = () => {
    if (!selectedEcosystem) {
      toast.error("Please select an industry first.");
      return;
    }
    if (selectedSectors.length === 0) {
      toast.error("Please select at least one sector.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Industry hierarchy and mapping saved successfully!");
      if (onNavigate) {
        onNavigate("category-hierarchy");
      }
    }, 400);
  };

  const handleSave = () => {
    if (!selectedEcosystem) {
      toast.error("Please select an industry first.");
      return;
    }
    if (selectedSectors.length === 0) {
      toast.error("Please select at least one sector.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Industry hierarchy and mapping saved successfully!");
      if (onNavigate) {
        onNavigate("category-hierarchy");
      }
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* ═══════════════════════════════════════════════════
          STEP 1: Select Ecosystem + Sectors
          (shown when showIndustries is false)
          ═══════════════════════════════════════════════════ */}
      {!showIndustries && (
        <>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-slate-950">1</span>
            <span className="text-sm font-bold text-foreground dark:text-white">Step 1 — Select Ecosystem &amp; Sectors</span>
            <span className="text-xs text-muted-foreground dark:text-slate-500">→ Step 2: Industries</span>
          </div>

          {/* Ecosystem cards */}
          <div ref={ecoRef} className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-soft dark:border-white/10 dark:bg-slate-900/95 dark:shadow-none">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground dark:text-white">Select Ecosystem</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full min-w-0">
              {ecosystems.map((eco) => {
                const isSelected = selectedEcosystem === eco.id;
                return (
                  <div
                    key={eco.id}
                    onClick={() => handleSelectEcosystem(eco.id)}
                    className={`group relative flex h-full min-w-0 cursor-pointer items-start gap-2 rounded-lg border p-2.5 transition-all duration-200 ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500/10 shadow-soft ring-2 ring-cyan-500/30 dark:bg-cyan-500/15"
                        : "border-border/80 bg-background/80 hover:border-cyan-500/40 hover:bg-card dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-cyan-500/30"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectEcosystem(eco.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-slate-950 border-border dark:border-white/20 shrink-0 h-3.5 w-3.5"
                    />
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start gap-1.5 min-w-0">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                          {getTaxonomyIcon(eco.icon, "h-3 w-3")}
                        </div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wide text-foreground dark:text-white leading-tight break-words">{eco.name}</h4>
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground dark:text-slate-400">{eco.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sectors grid */}
          {selectedEcosystem && currentEco && (
            <section className="rounded-2xl border border-border bg-card/80 p-3 sm:p-4 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
              <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-white/10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-white">Select Sectors</h3>
                  <p className="text-[10px] text-muted-foreground dark:text-slate-400">{selectedSectors.length} of {filteredSectors.length} selected</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center w-32 sm:w-40">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={sectorSearch}
                      onChange={(e) => setSectorSearch(e.target.value)}
                      className="h-8 w-full rounded-lg border border-border bg-background/90 pl-2.5 pr-8 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllSectors}
                    className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 hover:underline shrink-0 cursor-pointer"
                  >
                    {selectedSectors.length === currentEco.categories.length ? "Deselect all" : "Select all"}
                  </button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-white/10">
                {filteredSectors.map((sec) => {
                  const isSelected = selectedSectors.includes(sec.id);
                  return (
                    <div
                      key={sec.id}
                      onClick={() => toggleSector(sec.id)}
                      className={`flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-[11px] transition-all ${
                        isSelected
                          ? "border-cyan-500/60 bg-cyan-500/10 font-medium text-foreground dark:bg-cyan-500/15 dark:text-white"
                          : "border-border/80 bg-background/80 text-muted-foreground hover:border-cyan-500/40 hover:text-foreground dark:border-white/5 dark:bg-slate-950/40 dark:text-slate-400 dark:hover:border-white/15 dark:hover:text-slate-200"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSector(sec.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-slate-950 border-border dark:border-white/20 shrink-0 h-3.5 w-3.5"
                      />
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                        {getTaxonomyIcon(sec.icon, "h-3 w-3")}
                      </div>
                      <span className="flex-1 select-none truncate">{sec.name}</span>
                      <span className="shrink-0 rounded bg-muted px-1 py-0.5 text-[8px] font-bold text-muted-foreground dark:bg-white/5 dark:text-slate-400">{sec.categories.length}</span>
                    </div>
                  );
                })}
                {filteredSectors.length === 0 && (
                  <div className="col-span-full p-3 text-center text-[11px] text-muted-foreground">No sectors match &quot;{sectorSearch}&quot;.</div>
                )}
              </div>
            </section>
          )}

          {/* Continue to Step 2 button */}
          {selectedSectors.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:bg-cyan-400 cursor-pointer"
              >
                Continue to Industries <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Empty state */}
          {(!selectedEcosystem || !currentEco) && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
              <Layers className="mx-auto h-8 w-8 text-muted-foreground/50 dark:text-slate-600" />
              <p className="mt-2 text-sm font-semibold text-foreground dark:text-white">Select an ecosystem above to view sectors</p>
            </div>
          )}
          {selectedEcosystem && currentEco && selectedSectors.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center dark:border-white/10">
              <p className="text-sm font-semibold text-foreground dark:text-white">Select sectors above, then click Continue to view industries</p>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════
          STEP 2: Select Industries (separate page/view)
          (shown when showIndustries is true)
          ═══════════════════════════════════════════════════ */}
      {showIndustries && selectedSectors.length > 0 && currentEco && (
        <>
          {/* Step indicator + Back button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowIndustries(false)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sectors
              </button>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-slate-950">2</span>
              <span className="text-sm font-bold text-foreground dark:text-white">Step 2 — Select Industries</span>
            </div>
            <span className="text-xs text-muted-foreground dark:text-slate-500">
              {currentEco.name} → {selectedSectors.length} Sectors
            </span>
          </div>

          {/* Industries section */}
          <section className="rounded-2xl border border-border bg-card/80 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none flex flex-col overflow-hidden">
            {/* Header with search */}
            <div className="border-b border-border/60 dark:border-white/10 px-3 py-2.5 sm:px-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-white">Industries</h3>
                  <p className="text-[10px] text-muted-foreground dark:text-slate-400">{selectedCategories.length} of {availableCategories.length} selected — across {selectedSectors.length} sector{selectedSectors.length === 1 ? "" : "s"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center w-32 sm:w-40">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="h-8 w-full rounded-lg border border-border bg-background/90 pl-2.5 pr-8 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  </div>
                  {filteredCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAllCategories}
                      className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 hover:underline shrink-0 cursor-pointer"
                    >
                      {selectedCategories.length === filteredCategories.length ? "Deselect all" : "Select all"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Industries grid — grouped by sector */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 max-h-[500px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-white/10">
              {availableSectors.map((sec) => {
                const secCategories = sec.categories.filter((c) => {
                  const query = categorySearch.trim().toLowerCase();
                  if (!query) return true;
                  return c.name.toLowerCase().includes(query);
                });
                if (secCategories.length === 0) return null;
                return (
                  <div key={sec.id}>
                    <div className="mb-2 flex items-center gap-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                        {getTaxonomyIcon(sec.icon, "h-3.5 w-3.5")}
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 dark:text-slate-300">{sec.name}</h4>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground dark:bg-white/5 dark:text-slate-400">{secCategories.length}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {secCategories.map((cat) => {
                        const isCatSelected = selectedCategories.includes(cat.id);
                        return (
                          <label
                            key={cat.id}
                            className={`group flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 transition-all ${
                              isCatSelected
                                ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30 dark:border-cyan-500/50 dark:bg-cyan-500/15"
                                : "border-border/80 bg-background/80 hover:border-cyan-500/40 hover:bg-muted/50 dark:border-white/5 dark:bg-slate-950/40 dark:hover:border-cyan-500/40 dark:hover:bg-white/[0.04]"
                            }`}
                          >
                            <Checkbox
                              checked={isCatSelected}
                              onCheckedChange={() => toggleCategory(cat.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-slate-950 border-border dark:border-white/20 shrink-0 h-3.5 w-3.5"
                            />
                            <span className={`flex-1 select-none text-[11px] font-medium leading-tight truncate ${isCatSelected ? "text-cyan-700 dark:text-cyan-300" : "text-foreground/80 dark:text-slate-300"}`}>
                              {cat.name}
                            </span>
                            {isCatSelected && <Check className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {filteredCategories.length === 0 && (
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
                  No industries match &quot;{categorySearch}&quot;.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border/60 dark:border-white/10 px-3 py-2.5 sm:px-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold text-foreground dark:text-white">{selectedCategories.length} Selected</span>
                <span className="text-[10px] text-muted-foreground dark:text-slate-500">
                  {currentEco.name} → {selectedSectors.length} Sectors → {selectedCategories.length} Industries
                </span>
              </div>
              <div className="flex items-center gap-3">
                {selectedCategories.length > 0 && (
                  <button type="button" onClick={handleClearAll} className="text-[11px] font-semibold text-muted-foreground hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer">
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save & Continue"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
