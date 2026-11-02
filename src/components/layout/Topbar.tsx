"use client";

import * as React from "react";
import { useNav, useAuth } from "@/lib/store";
import { portalConfigs } from "./portal-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Icon } from "@/components/common/Icon";
import { Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut, User, Settings, Shield, Sparkles, Building2 } from "lucide-react";
import { useTheme } from "next-themes";
import type { Portal, UserRole } from "@/lib/types";
import { notifications as notifData } from "@/lib/mock-data";
import { timeAgo } from "@/lib/format";

const portalOrder: Portal[] = ["public", "candidate", "employer", "recruiter", "training", "partner", "admin"];

const roleLabels: Record<UserRole, string> = {
  candidate: "Candidate",
  employer: "Employer",
  recruiter: "Recruiter",
  agency: "Agency",
  enterprise_admin: "Enterprise Admin",
  hiring_manager: "Hiring Manager",
  interviewer: "Interviewer",
  billing_manager: "Billing Manager",
  org_admin: "Org Admin",
  platform_admin: "Platform Admin",
  support: "Support",
};

const roleToPortal: Partial<Record<UserRole, Portal>> = {
  candidate: "candidate",
  employer: "employer",
  recruiter: "recruiter",
  agency: "agency",
  enterprise_admin: "enterprise",
  hiring_manager: "employer",
  interviewer: "employer",
  billing_manager: "employer",
  org_admin: "employer",
  platform_admin: "admin",
  support: "admin",
};

export function Topbar() {
  const { portal, navigate, setCommandOpen, setSidebarOpen, role, setRole } = useNav();
  const { user, login } = useAuth();
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const cfg = portalConfigs[portal];
  const unread = notifData.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-4">
      <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => setSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Portal switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 font-semibold">
            <Icon name={cfg.sections[0].items[0].icon} className="h-4 w-4 text-brand" />
            <span className="hidden sm:inline">{cfg.label}</span>
            <span className="sm:hidden">{cfg.short}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Switch portal</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {portalOrder.map((p) => {
            const c = portalConfigs[p];
            return (
              <DropdownMenuItem
                key={p}
                onClick={() => {
                  if (p === "public") navigate("public", "home");
                  else if (p === "candidate") navigate("candidate", "overview");
                  else if (p === "employer") navigate("employer", "overview");
                  else if (p === "recruiter") navigate("recruiter", "overview");
                  else if (p === "training") navigate("training", "overview");
                  else if (p === "partner") navigate("partner", "overview");
                  else if (p === "admin") {
                    setRole("platform_admin");
                    login("platform_admin");
                    navigate("admin", "sa-overview");
                  }
                }}
                className="flex items-center gap-2.5 py-2"
              >
                <Icon name={c.sections[0].items[0].icon} className="h-4 w-4 text-brand" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.label}</div>
                  <div className="text-xs text-muted-foreground">{c.description}</div>
                </div>
                {portal === p && <span className="h-2 w-2 rounded-full bg-brand" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search / command */}
      <button
        onClick={() => setCommandOpen(true)}
        className="group ml-1 hidden h-9 flex-1 items-center gap-2 rounded-lg border bg-muted/40 px-3 text-sm text-muted-foreground hover:bg-muted sm:flex sm:max-w-md"
      >
        <Search className="h-4 w-4" />
        <span>Search jobs, candidates, companies…</span>
        <kbd className="ml-auto rounded border bg-background px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </button>
      <Button variant="ghost" size="icon" className="sm:hidden h-9 w-9" onClick={() => setCommandOpen(true)}>
        <Search className="h-4 w-4" />
      </Button>

      <div className="ml-auto flex items-center gap-1">
        {/* AI assistant */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden gap-1.5 md:flex"
          onClick={() => navigate(portal === "public" ? "candidate" : portal, portal === "public" ? "recommended" : "overview")}
        >
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="hidden lg:inline">AI Assistant</span>
        </Button>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-xs font-normal text-muted-foreground">{unread} unread</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto scroll-thin">
              {notifData.slice(0, 6).map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2.5" onClick={() => navigate(portal, n.actionRoute ?? "overview")}>
                  <div className="flex w-full items-center gap-2">
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />}
                    <span className="flex-1 text-sm font-medium">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{timeAgo(n.timestamp)}</span>
                  </div>
                  <p className="line-clamp-2 pl-4 text-xs text-muted-foreground">{n.description}</p>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 pl-1.5 pr-2">
              <AvatarLogo text={user?.name ?? "Guest"} size="sm" />
              <span className="hidden text-sm font-medium sm:inline">{user?.name?.split(" ")[0] ?? "Guest"}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="flex items-center gap-2.5 p-2">
              <AvatarLogo text={user?.name ?? "Guest"} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            {user?.orgName && (
              <div className="mx-2 mb-1 flex items-center gap-1.5 rounded-md bg-muted px-2 py-1.5 text-xs">
                <Building2 className="h-3 w-3" />
                <span className="truncate">{user.orgName}</span>
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Demo role (simulated)</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={role === "candidate"}
              onCheckedChange={() => { setRole("candidate"); login("candidate"); navigate("candidate", "overview"); }}
            >
              Candidate
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={role === "employer"}
              onCheckedChange={() => { setRole("employer"); login("employer"); navigate("employer", "overview"); }}
            >
              Employer
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={role === "recruiter"}
              onCheckedChange={() => { setRole("recruiter"); login("recruiter"); navigate("recruiter", "overview"); }}
            >
              Recruiter / Agency
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={role === "enterprise_admin"}
              onCheckedChange={() => { setRole("enterprise_admin"); login("enterprise_admin"); navigate("enterprise", "overview"); }}
            >
              Enterprise
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={role === "platform_admin"}
              onCheckedChange={() => { setRole("platform_admin"); login("platform_admin"); navigate("admin", "overview"); }}
            >
              Platform Admin
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(portal === "public" ? "candidate" : portal, "settings")}>
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("public", "home")}>
              <User className="h-4 w-4" /> View public site
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("admin", "audit")}>
              <Shield className="h-4 w-4" /> Audit log
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600 dark:text-rose-400" onClick={() => { useAuth.getState().logout(); navigate("public", "home"); }}>
              <LogOut className="h-4 w-4" /> Sign out (demo)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
