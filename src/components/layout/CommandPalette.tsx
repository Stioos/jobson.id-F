"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { portalConfigs } from "./portal-config";
import { Icon } from "@/components/common/Icon";
import { jobs, employers, candidateProfiles } from "@/lib/mock-data";
import type { Portal } from "@/lib/types";

export function CommandPalette() {
  const { commandOpen, setCommandOpen, navigate } = useNav();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandOpen, setCommandOpen]);

  const go = (portal: Portal, route: string) => {
    navigate(portal, route);
    setCommandOpen(false);
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search jobs, companies, candidates, or navigate…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Navigate">
          {portalConfigs.candidate.sections.flatMap((s) => s.items).slice(0, 6).map((i) => (
            <CommandItem key={`c_${i.key}`} onSelect={() => go("candidate", i.key)}>
              <Icon name={i.icon} className="h-4 w-4 text-brand" />
              <span>Candidate › {i.label}</span>
            </CommandItem>
          ))}
          {portalConfigs.employer.sections.flatMap((s) => s.items).slice(0, 6).map((i) => (
            <CommandItem key={`e_${i.key}`} onSelect={() => go("employer", i.key)}>
              <Icon name={i.icon} className="h-4 w-4 text-brand" />
              <span>Employer › {i.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Jobs">
          {jobs.slice(0, 5).map((j) => (
            <CommandItem key={j.id} onSelect={() => go("public", `jobs/${j.id}`)}>
              <Icon name="Briefcase" className="h-4 w-4 text-brand" />
              <span className="flex-1">{j.title}</span>
              <span className="text-xs text-muted-foreground">{j.employerName}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Companies">
          {employers.slice(0, 5).map((e) => (
            <CommandItem key={e.id} onSelect={() => go("public", `companies/${e.slug}`)}>
              <Icon name="Building2" className="h-4 w-4 text-brand" />
              <span className="flex-1">{e.name}</span>
              <span className="text-xs text-muted-foreground">{e.industry}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Switch Portal">
          <CommandItem onSelect={() => go("public", "partner-login")}>Partner Login</CommandItem>
          <CommandItem onSelect={() => go("public", "home")}>Public Career Portal</CommandItem>
          <CommandItem onSelect={() => go("candidate", "overview")}>Candidate Portal</CommandItem>
          <CommandItem onSelect={() => go("employer", "overview")}>Employer Portal</CommandItem>
          <CommandItem onSelect={() => go("recruiter", "overview")}>Recruiter & Agency Portal</CommandItem>
          <CommandItem onSelect={() => go("training", "overview")}>Training & Admin Portal</CommandItem>
          <CommandItem onSelect={() => go("partner", "overview")}>Partner Portal (Franchise)</CommandItem>
          <CommandItem onSelect={() => go("admin", "sa-overview")}>Super Admin Portal</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
