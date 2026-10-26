"use client";

import * as React from "react";
import Image from "next/image";
import { useNav, useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { toast } from "sonner";
import {
  Eye, EyeOff, ArrowRight, ShieldCheck, Users, Building2,
  GraduationCap, Briefcase, Sparkles, Handshake, CheckCircle2,
  Mail, Lock, Crown, type LucideIcon,
} from "lucide-react";
import type { Portal, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RoleDef {
  portal: Portal;
  role: UserRole;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  color: string;
  demoUser: { name: string; email: string; org?: string };
  regRoute: string;
}

export const AUTH_ROLES: RoleDef[] = [
  { portal: "candidate", role: "candidate", label: "Candidate", shortLabel: "Candidate", description: "Find jobs, learn & grow your career", icon: Users, color: "#0EA5E9", demoUser: { name: "Priya Nair", email: "priya.nair@gmail.com" }, regRoute: "register/candidate" },
  { portal: "employer", role: "employer", label: "Employer", shortLabel: "Employer", description: "Hire talent, manage L&D, enterprise", icon: Building2, color: "#8B5CF6", demoUser: { name: "Rohan Mehta", email: "rohan@techcorp.com", org: "TechCorp India" }, regRoute: "register/employer" },
  { portal: "recruiter", role: "recruiter", label: "Recruiter / Agency", shortLabel: "Recruiter", description: "Source, submit & place talent", icon: Briefcase, color: "#F59E0B", demoUser: { name: "Sneha Reddy", email: "sneha@talentbridge.in", org: "TalentBridge" }, regRoute: "register/recruiter" },
  { portal: "training", role: "platform_admin", label: "Training & Admin", shortLabel: "Training", description: "Corporate training + platform admin", icon: GraduationCap, color: "#EF4444", demoUser: { name: "Divya Sharma", email: "divya@skillforge.academy", org: "SkillForge Academy" }, regRoute: "register/training" },
  { portal: "partner", role: "employer", label: "Franchise Partner", shortLabel: "Partner", description: "Run a centre, college, service, tech, AI or recruitment franchise", icon: Handshake, color: "#10B981", demoUser: { name: "Rajesh Kumar", email: "rajesh@chennaitachacademy.in", org: "Chennai Tech Academy" }, regRoute: "register/partner" },
  { portal: "admin", role: "platform_admin", label: "Platform Admin", shortLabel: "Admin", description: "Platform administration & super admin", icon: Crown, color: "#D4A017", demoUser: { name: "Admin User", email: "admin@jobsonn.com" }, regRoute: "register/admin" },
];

export function PublicAuth() {
  const { navigate } = useNav();
  const { login } = useAuth();
  const [selected, setSelected] = React.useState<RoleDef>(AUTH_ROLES[0]);
  const [email, setEmail] = React.useState(selected.demoUser.email);
  const [password, setPassword] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setEmail(selected.demoUser.email);
    setPassword("");
  }, [selected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selected.role);
      toast.success(`Welcome back, ${selected.demoUser.name.split(" ")[0]}!`, {
        description: `Signed in to ${selected.label} portal`,
      });
      navigate(selected.portal, "overview");
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <button onClick={() => navigate("public", "home")} className="flex items-center" aria-label="JOBSONN home">
            <Image src="/jobsonn-logo.png" alt="JOBSONN" width={120} height={32} className="h-7 w-auto object-contain sm:h-8" priority />
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate("public", "home")}>Back to site</Button>
        </header>

        <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-2 lg:gap-12">
          {/* Left: brand */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
              <Sparkles className="h-3.5 w-3.5" /> Enterprise-grade platform for talent, employers & partners
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight lg:text-5xl">
              The unified portal for <span className="text-brand">talent, employers & partners</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground">
              Sign in to access your dedicated workspace — recruit, train, place, and grow careers on one intelligent platform.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: "DPDP-compliant & enterprise-secure" },
                { icon: Sparkles, label: "AI-assisted matching" },
                { icon: Users, label: "2M+ candidates & learners" },
                { icon: Building2, label: "12,000+ hiring companies" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 rounded-lg border bg-card/60 p-3">
                  <f.icon className="h-4 w-4 shrink-0 text-brand" />
                  <span className="text-xs font-medium">{f.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-brand" /> SOC 2 Ready</span>
              <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-brand" /> 256-bit SSL</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-brand" /> GDPR / DPDP</span>
            </div>
          </div>

          {/* Right: login card */}
          <div className="mx-auto w-full max-w-md">
            <Card className="border-border/60 shadow-lg">
              <CardContent className="p-6">
                <h2 className="mb-1 text-xl font-bold">Sign in to your portal</h2>
                <p className="mb-4 text-xs text-muted-foreground">Select your role to continue</p>

                {/* Role selector */}
                <div className="mb-4 grid grid-cols-3 gap-1.5">
                  {AUTH_ROLES.map((r) => (
                    <button key={r.portal} type="button" onClick={() => setSelected(r)}
                      className={cn("flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all",
                        selected.portal === r.portal ? "border-brand bg-brand/5 ring-1 ring-brand/30" : "border-border hover:border-brand/40 hover:bg-muted/40")}>
                      <r.icon className="h-4 w-4" style={{ color: r.color }} />
                      <span className="text-[9px] font-semibold leading-tight">{r.shortLabel}</span>
                    </button>
                  ))}
                </div>
                <p className="mb-3 text-[10px] text-muted-foreground">{selected.description}</p>

                {/* Demo user */}
                <div className="mb-3 flex items-center gap-2.5 rounded-lg border bg-muted/40 p-2.5">
                  <AvatarLogo text={selected.demoUser.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold">{selected.demoUser.name}</div>
                    <div className="truncate text-[10px] text-muted-foreground">{selected.demoUser.email}</div>
                  </div>
                  <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-medium text-brand">Demo</span>
                </div>

                {/* Login form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-[11px]">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className="h-9 pl-8 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-[11px]">Password</Label>
                      <button type="button" className="text-[10px] text-brand hover:underline" onClick={() => toast.info("Password reset link sent (simulated)")}>Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input id="password" type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-9 pl-8 pr-8 text-sm" required />
                      <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-1.5 h-9 text-sm" disabled={loading}>
                    {loading ? "Signing in…" : <>Sign in to {selected.label} <ArrowRight className="h-4 w-4" /></>}
                  </Button>
                </form>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                  <span>Demo environment — any password works. All data is simulated.</span>
                </div>

                {/* Register links — separate page per role */}
                <div className="mt-4 border-t pt-3">
                  <p className="mb-2 text-center text-[11px] text-muted-foreground">New to JOBSONN? Create an account:</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {AUTH_ROLES.map(r => (
                      <button key={r.portal} onClick={() => navigate("public", r.regRoute)}
                        className="flex items-center justify-center gap-1 rounded-md border border-border px-2 py-1.5 text-[10px] font-medium transition-all hover:border-brand hover:bg-brand/5 hover:text-brand">
                        <r.icon className="h-3 w-3" style={{ color: r.color }} />
                        {r.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
