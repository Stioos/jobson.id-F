"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  group?: string;
}

interface SearchableComboboxProps {
  options: (string | ComboboxOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  allowManualEntry?: boolean;
  manualEntryPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Searchable combobox built on shadcn Popover + Command (cmdk).
 *
 * - Type-to-search across all options
 * - Optional grouped display (when options carry a `group` field)
 * - "Other / Add Manually" support: when `allowManualEntry` is true, an extra
 *   command item lets the user enter a custom value via a small inline input
 */
export function SearchableCombobox({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  allowManualEntry = false,
  manualEntryPlaceholder = "Enter manually…",
  className,
  disabled = false,
}: SearchableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [manualMode, setManualMode] = React.useState(false);
  const [manualValue, setManualValue] = React.useState("");

  // Normalize incoming options
  const normalized: ComboboxOption[] = React.useMemo(
    () =>
      options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : { group: undefined, ...o }
      ),
    [options]
  );

  // Group options for display
  const grouped = React.useMemo(() => {
    const map = new Map<string, ComboboxOption[]>();
    for (const o of normalized) {
      const g = o.group || "All";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(o);
    }
    return Array.from(map.entries());
  }, [normalized]);

  const hasGroups = grouped.length > 1 || (grouped.length === 1 && grouped[0][0] !== "All");

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setManualMode(false);
    setManualValue("");
  };

  const handleManualSubmit = () => {
    const trimmed = manualValue.trim();
    if (!trimmed) return;
    handleSelect(trimmed);
  };

  const triggerLabel = React.useMemo(() => {
    if (!value) return null;
    const found = normalized.find((o) => o.value === value);
    return found ? found.label : value; // show custom/manual value as-is
  }, [value, normalized]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between rounded-lg px-3 text-xs font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{triggerLabel || placeholder}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(22rem,calc(100vw-2rem))] p-0" align="start">
        {manualMode ? (
          <div className="flex flex-col gap-2 p-2">
            <input
              autoFocus
              type="text"
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleManualSubmit();
                }
              }}
              placeholder={manualEntryPlaceholder}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 rounded-md text-xs"
                onClick={() => {
                  setManualMode(false);
                  setManualValue("");
                }}
              >
                Back
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 rounded-md bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                onClick={handleManualSubmit}
              >
                Use this
              </Button>
            </div>
          </div>
        ) : (
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9 text-xs" />
            <CommandList className="max-h-64">
              <CommandEmpty>{emptyText}</CommandEmpty>
              {hasGroups
                ? grouped.map(([group, items]) => (
                    <CommandGroup key={group} heading={group} className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {items.map((o) => (
                        <CommandItem
                          key={o.value}
                          value={o.value}
                          onSelect={handleSelect}
                          className="text-xs"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-3.5 w-3.5",
                              value === o.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {o.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))
                : (
                  <CommandGroup>
                    {normalized.map((o) => (
                      <CommandItem
                        key={o.value}
                        value={o.value}
                        onSelect={handleSelect}
                        className="text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-3.5 w-3.5",
                            value === o.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {o.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              {allowManualEntry && (
                <CommandGroup>
                  <CommandItem
                    value="__manual_entry__"
                    onSelect={() => setManualMode(true)}
                    className="text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Other / Add manually
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
