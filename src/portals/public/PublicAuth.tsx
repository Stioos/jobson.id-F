"use client";

import * as React from "react";
import Image from "next/image";
import { useNav, useAuth, authenticateUserCredentials } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/common";
import { toast } from "sonner";
import {
  Eye, EyeOff, ArrowRight, ShieldCheck, Users, Building2,
  GraduationCap, Briefcase, Sparkles, Handshake, CheckCircle2,
  Mail, Lock, Crown, AlertCircle, type LucideIcon,
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
  const { navigate, setRole } = useNav();
  const { setUser } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [registeredEmailNotice, setRegisteredEmailNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const noticeEmail = sessionStorage.getItem("jobsonn_registered_notice");
        if (noticeEmail) {
          setRegisteredEmailNotice(noticeEmail);
        }
      } catch {}
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    let redirectPortal: string | null = null;
    if (typeof window !== "undefined") {
      try {
        redirectPortal = sessionStorage.getItem("jobsonn_redirect_portal");
      } catch {}
    }

    const authResult = authenticateUserCredentials(email, password, redirectPortal);
    if (!authResult.ok) {
      setError(authResult.error);
      toast.error(authResult.toastTitle, {
        description: authResult.toastDescription,
      });
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem("jobsonn_redirect_portal");
          sessionStorage.removeItem("jobsonn_registered_notice");
        } catch {}
      }

      setRole(authResult.user.role);
      setUser(authResult.user);

      toast.success(`Welcome back, ${authResult.user.name}!`);

      if (authResult.portal && authResult.portal !== "public") {
        navigate(authResult.portal, "overview");
      } else {
        navigate("public", "home");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("public", "home")}
            className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
            aria-label="JOBSONN home"
          >
            <Image src="/jobsonn-logo.png" alt="JOBSONN" width={120} height={32} className="h-7 w-auto object-contain sm:h-8" priority />
          </button>
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
                <h2 className="mb-1 text-xl font-bold">Sign in to your account</h2>
                <p className="mb-4 text-xs text-muted-foreground">Enter your credentials to continue</p>

                {/* Login form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {registeredEmailNotice && !error && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        Account created for <strong>{registeredEmailNotice}</strong>. Enter your email and password to sign in.
                      </span>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-[11px]">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="Enter your email id"
                        required
                        className="h-9 pl-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-[11px]">Password</Label>
                      <button type="button" className="text-[10px] text-brand hover:underline" onClick={() => toast.info("Password reset link sent (simulated)")}>Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="Enter your password"
                        className="h-9 pl-8 pr-8 text-sm"
                        required
                      />
                      <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-1.5 h-9 text-sm" disabled={loading}>
                    {loading ? "Signing in…" : <>Sign in <ArrowRight className="h-4 w-4" /></>}
                  </Button>
                </form>

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
