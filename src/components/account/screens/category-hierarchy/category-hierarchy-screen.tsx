"use client";

import { useState, useMemo } from "react";
import {
  Boxes, Briefcase, Bot, Layers, Cog, Cpu, ShoppingBag, Package,
  Wrench, Lightbulb, Truck, GraduationCap, Megaphone, Code2, Cloud,
  BarChart3, ShieldCheck, Brain, FolderTree,
  Zap, Factory, Building2, Car, PenTool,
  Hammer, ClipboardCheck, HardHat,
  Check, X, Minus, ChevronRight, Save, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CATEGORIES_DATA, CategoryRoot, INDUSTRIAL_CATEGORIES,
} from "./category-hierarchy.data";

// ─── Icon resolver ───
const ICONS: Record<string, LucideIcon> = {
  Boxes, Briefcase, Bot, Layers, Cog, Cpu, ShoppingBag, Package, Wrench,
  Lightbulb, Truck, GraduationCap, Megaphone, Code2, Cloud, BarChart3,
  ShieldCheck, Brain, FolderTree, Zap, Factory, Building2, Car, PenTool,
  Hammer, ClipboardCheck, HardHat,
};

function getIcon(name: string): LucideIcon {
  return ICONS[name] || FolderTree;
}

interface CategoryHierarchyScreenProps {
  onNavigate?: (sectionId: string) => void;
}

export function CategoryHierarchyScreen({ onNavigate }: CategoryHierarchyScreenProps = {}) {
  // Active category (always one is active, defaults to first)
  const [activeCategoryId, setActiveCategoryId] = useState<string>(CATEGORIES_DATA[0].id);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  // Selected industrial category tiles (top-level)
  const [selectedIndustrial, setSelectedIndustrial] = useState<string[]>([]);

  // Active category object
  const activeCategory: CategoryRoot | undefined = useMemo(
    () => CATEGORIES_DATA.find((c) => c.id === activeCategoryId),
    [activeCategoryId]
  );

  // Active category's subcategories (the data shown in right card)
  const activeSubcategories = useMemo(() => activeCategory?.subcategories || [], [activeCategory]);

  // Tri-state for the active category
  const activeCatSelectedCount = activeSubcategories.filter((s) =>
    selectedSubcategories.includes(s.id)
  ).length;
  const activeCatTotal = activeSubcategories.length;
  const activeCatCheckState: "all" | "some" | "none" =
    activeCatSelectedCount === 0 ? "none" : activeCatSelectedCount === activeCatTotal ? "all" : "some";

  // Toggle a single subcategory
  const toggleSubcategory = (subId: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subId) ? prev.filter((s) => s !== subId) : [...prev, subId]
    );
  };

  // Toggle all subcategories in the active category
  const toggleActiveCategoryAll = () => {
    if (!activeCategory) return;
    if (activeCatCheckState === "all") {
      // remove all in this category
      const catSubIds = new Set(activeCategory.subcategories.map((s) => s.id));
      setSelectedSubcategories((prev) => prev.filter((id) => !catSubIds.has(id)));
      toast.success(`Cleared all from ${activeCategory.name}.`);
    } else {
      // add all missing in this category
      const existing = new Set(selectedSubcategories);
      const toAdd = activeCategory.subcategories.map((s) => s.id).filter((id) => !existing.has(id));
      setSelectedSubcategories((prev) => [...prev, ...toAdd]);
      toast.success(`Added all ${activeCategory.subcategories.length} from ${activeCategory.name}.`);
    }
  };

  // Tri-state checkbox click for a category row in the left card
  const toggleCategoryAll = (catId: string) => {
    const cat = CATEGORIES_DATA.find((c) => c.id === catId);
    if (!cat) return;
    const catSubIds = new Set(cat.subcategories.map((s) => s.id));
    const selectedInCat = selectedSubcategories.filter((id) => catSubIds.has(id)).length;
    if (selectedInCat === cat.subcategories.length) {
      // all selected → remove all
      setSelectedSubcategories((prev) => prev.filter((id) => !catSubIds.has(id)));
      toast.success(`Cleared all from ${cat.name}.`);
    } else {
      // add all missing
      const existing = new Set(selectedSubcategories);
      const toAdd = cat.subcategories.map((s) => s.id).filter((id) => !existing.has(id));
      setSelectedSubcategories((prev) => [...prev, ...toAdd]);
      toast.success(`Added all ${cat.subcategories.length} from ${cat.name}.`);
    }
  };

  const removeSelected = (subId: string) => {
    setSelectedSubcategories((prev) => prev.filter((id) => id !== subId));
    toast.success("Subcategory removed.");
  };

  // Summary stats — items count across selected subcategories
  const totalItemsSelected = useMemo(() => {
    let count = 0;
    for (const cat of CATEGORIES_DATA) {
      for (const sub of cat.subcategories) {
        if (selectedSubcategories.includes(sub.id)) {
          count += sub.items.length;
        }
      }
    }
    return count;
  }, [selectedSubcategories]);

  const totalSubcategoriesSelected = selectedSubcategories.length;
  const totalCategoriesTouched = useMemo(() => {
    let n = 0;
    for (const cat of CATEGORIES_DATA) {
      const catSubIds = new Set(cat.subcategories.map((s) => s.id));
      if (selectedSubcategories.some((id) => catSubIds.has(id))) n++;
    }
    return n;
  }, [selectedSubcategories]);

  // Toggle an industrial category tile
  const toggleIndustrial = (id: string) => {
    setSelectedIndustrial((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selectedSubcategories.length === 0) {
      toast.error("Please select at least one subcategory.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Category preferences saved successfully");
      if (onNavigate) onNavigate("registrations-licences");
    }, 400);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ───── Industrial Category Tiles (top-level, 4 cols × 4 rows) ───── */}
      <div className="rounded-xl border border-border bg-card/80 p-2.5 dark:border-white/10 dark:bg-slate-900/60">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
          {INDUSTRIAL_CATEGORIES.map((cat) => {
            const Icon = getIcon(cat.icon);
            const isSelected = selectedIndustrial.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleIndustrial(cat.id)}
                className={cn(
                  "group flex cursor-pointer items-start gap-2 rounded-lg border p-2 transition-all text-left",
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/20 dark:border-cyan-500/60 dark:bg-cyan-500/15"
                    : "border-border/60 bg-background/60 hover:border-cyan-500/40 hover:bg-muted/30 dark:border-white/5 dark:bg-slate-950/30 dark:hover:border-cyan-500/30"
                )}
              >
                {/* Checkbox */}
                <span
                  className={cn(
                    "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border transition-colors mt-0.5",
                    isSelected
                      ? "border-cyan-500 bg-cyan-500 text-slate-950"
                      : "border-border bg-background text-transparent group-hover:border-cyan-500/50 dark:border-white/20 dark:bg-slate-950"
                  )}
                >
                  {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </span>
                {/* Icon */}
                <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", cat.bg)}>
                  <Icon className={cn("h-4 w-4", cat.color)} />
                </span>
                {/* Label — full content */}
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[10px] font-bold leading-snug", isSelected ? "text-cyan-700 dark:text-cyan-200" : "text-foreground dark:text-slate-200")}>
                    {cat.name}
                  </p>
                  <p className="mt-0.5 text-[8.5px] text-muted-foreground dark:text-slate-400 leading-tight">
                    {cat.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ───── Two-column master-detail layout (fits the screen) ───── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* ═══ LEFT CARD: Categories list ═══ */}
        <div className="flex flex-col rounded-xl border border-border bg-card/80 dark:border-white/10 dark:bg-slate-900/60">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5 dark:border-white/10">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground dark:text-white">Categories</p>
              <p className="text-[10px] text-muted-foreground dark:text-slate-400">
                {CATEGORIES_DATA.length} groups · {CATEGORIES_DATA.reduce((n, c) => n + c.subcategories.length, 0)} subcategories
              </p>
            </div>
          </div>

          {/* Scrollable category list */}
          <div className="max-h-[460px] min-h-[260px] flex-1 space-y-1.5 overflow-y-auto p-2.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-white/10 dark:hover:scrollbar-thumb-white/20">
            {CATEGORIES_DATA.map((cat) => {
              const Icon = getIcon(cat.icon);
              const isActive = cat.id === activeCategoryId;
              const catSubIds = new Set(cat.subcategories.map((s) => s.id));
              const selectedInCat = selectedSubcategories.filter((id) => catSubIds.has(id)).length;
              const totalInCat = cat.subcategories.length;
              const checkState: "all" | "some" | "none" =
                selectedInCat === 0 ? "none" : selectedInCat === totalInCat ? "all" : "some";

              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 transition-all",
                    isActive
                      ? "border-cyan-500 bg-cyan-500/10 shadow-sm ring-1 ring-cyan-500/20 dark:border-cyan-500/60 dark:bg-cyan-500/15"
                      : "border-border/60 bg-background/60 hover:border-cyan-500/40 hover:bg-muted/30 dark:border-white/5 dark:bg-slate-950/30 dark:hover:border-cyan-500/30"
                  )}
                >
                  {/* Tri-state checkbox */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleCategoryAll(cat.id); }}
                    aria-label={checkState === "all" ? "Deselect all in category" : "Select all in category"}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors cursor-pointer",
                      checkState === "all"
                        ? "border-cyan-500 bg-cyan-500 text-slate-950"
                        : checkState === "some"
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-600 dark:text-cyan-300"
                        : "border-border bg-background text-transparent group-hover:border-cyan-500/50 dark:border-white/20 dark:bg-slate-950"
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
                        ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300"
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
                        isActive ? "text-cyan-700 dark:text-cyan-200" : "text-foreground dark:text-slate-200"
                      )}
                    >
                      {cat.shortName}
                    </p>
                    <p className="mt-0.5 text-[9.5px] text-muted-foreground dark:text-slate-400">
                      {totalInCat} subcategories{selectedInCat > 0 && ` · ${selectedInCat} selected`}
                    </p>
                  </div>

                  {/* Active arrow indicator */}
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-all",
                      isActive
                        ? "text-cyan-600 dark:text-cyan-300 translate-x-0 opacity-100"
                        : "text-muted-foreground/40 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ RIGHT CARD: Subcategories data for the active category ═══ */}
        <div className="flex min-w-0 flex-col rounded-xl border border-border bg-card/80 dark:border-white/10 dark:bg-slate-900/60">
          {activeCategory && (
            <>
              {/* Right card header */}
              <div className="flex flex-col gap-2 border-b border-border/60 px-3 py-2.5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {(() => {
                      const Icon = getIcon(activeCategory.icon);
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground dark:text-white">{activeCategory.name}</p>
                    <p className="text-[10px] text-muted-foreground dark:text-slate-400">
                      {activeSubcategories.length} subcategories · {activeCatSelectedCount}/{activeCatTotal} selected
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleActiveCategoryAll}
                    className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    {activeCatCheckState === "all" ? "Clear all" : "Select all"}
                  </button>
                </div>
              </div>

              {/* Subcategories list */}
              <div className="max-h-[460px] min-h-[260px] flex-1 overflow-y-auto p-2.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-white/10 dark:hover:scrollbar-thumb-white/20">
                {activeSubcategories.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-[11px] text-muted-foreground dark:border-white/10">
                    No subcategories available.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {activeSubcategories.map((sub) => {
                      const isSelected = selectedSubcategories.includes(sub.id);
                      const SubIcon = getIcon(sub.icon);
                      return (
                        <label
                          key={sub.id}
                          className={cn(
                            "group flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-all",
                            isSelected
                              ? "border-cyan-500 bg-cyan-500/10 dark:border-cyan-500/50 dark:bg-cyan-500/15"
                              : "border-border/60 bg-background/60 hover:border-cyan-500/30 hover:bg-muted/30 dark:border-white/5 dark:bg-slate-950/30"
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSubcategory(sub.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 shrink-0 border-border data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-slate-950 dark:border-white/20"
                          />
                          <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md", isSelected ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300" : "bg-blue-500/10 text-blue-600 dark:text-blue-400")}>
                            <SubIcon className="h-3 w-3" />
                          </span>
                          <span
                            className={cn(
                              "flex-1 select-none text-[11px] font-medium leading-tight",
                              isSelected ? "text-cyan-700 dark:text-cyan-200" : "text-foreground/80 dark:text-slate-300"
                            )}
                          >
                            {sub.name}
                          </span>
                          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground dark:bg-white/5 dark:text-slate-400">
                            {sub.items.length} items
                          </span>
                          {isSelected && <Check className="h-3 w-3 shrink-0 text-cyan-600 dark:text-cyan-300" />}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Right card footer: summary + Save */}
          <div className="border-t border-border/60 dark:border-white/10">
            {/* Stats row */}
            <div className="grid grid-cols-4 divide-x divide-border/60 dark:divide-white/10">
              <div className="px-2 py-2 text-center">
                <p className="text-base font-extrabold leading-none text-cyan-600 dark:text-cyan-400">{selectedIndustrial.length}</p>
                <p className="mt-1 text-[9px] font-semibold text-muted-foreground dark:text-slate-400">Industrial</p>
              </div>
              <div className="px-2 py-2 text-center">
                <p className="text-base font-extrabold leading-none text-blue-600 dark:text-blue-400">{totalCategoriesTouched}</p>
                <p className="mt-1 text-[9px] font-semibold text-muted-foreground dark:text-slate-400">Categories</p>
              </div>
              <div className="px-2 py-2 text-center">
                <p className="text-base font-extrabold leading-none text-amber-600 dark:text-amber-400">{totalSubcategoriesSelected}</p>
                <p className="mt-1 text-[9px] font-semibold text-muted-foreground dark:text-slate-400">Subcategories</p>
              </div>
              <div className="px-2 py-2 text-center">
                <p className="text-base font-extrabold leading-none text-emerald-600 dark:text-emerald-400">{totalItemsSelected}</p>
                <p className="mt-1 text-[9px] font-semibold text-muted-foreground dark:text-slate-400">Items</p>
              </div>
            </div>

            {/* Selected chips (scrollable) */}
            {selectedSubcategories.length > 0 && (
              <div className="max-h-28 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubcategories.map((subId) => {
                    // find the subcategory name
                    let subName = subId;
                    let subIconName = "FolderTree";
                    for (const cat of CATEGORIES_DATA) {
                      const found = cat.subcategories.find((s) => s.id === subId);
                      if (found) { subName = found.name; subIconName = found.icon; break; }
                    }
                    const SubIcon = getIcon(subIconName);
                    return (
                      <span
                        key={subId}
                        className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 py-0.5 pl-2 pr-1 dark:border-white/10 dark:bg-slate-950/40"
                      >
                        <SubIcon className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="max-w-[160px] truncate text-[10px] font-medium text-foreground dark:text-slate-200">{subName}</span>
                        <button
                          type="button"
                          onClick={() => removeSelected(subId)}
                          className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"
                          aria-label={`Remove ${subName}`}
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
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                {isSaving ? "Saving..." : `Save Selections (${selectedSubcategories.length})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
