"use client";

import * as React from "react";
import { useNav, useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common";
import { BrandMark } from "@/components/layout/PortalSidebar";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Users, Building2, GraduationCap, Briefcase, Sparkles, Handshake, CheckCircle2 } from "lucide-react";
import type { Portal, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PortalOption {
  portal: Portal;
  role: UserRole;
  label: string;
  description: string;
  icon: typeof Users;
  color: string;
  user: { name: string; email: string; org?: string };
}

const PORTAL_OPTIONS: PortalOption[] = [
  { portal: "candidate", role: "candidate", label: "Candidate", description: "Find jobs, learn & grow your career", icon: Users, color: "oklch(0.55 0.13 165)", user: { name: "Priya Nair", email: "priya.nair@gmail.com" } },
  { portal: "employer", role: "employer", label: "Employer", description: "Hire talent, manage L&D, enterprise", icon: Building2, color: "oklch(0.6 0.14 200)", user: { name: "Rohan Mehta", email: "rohan@techcorp.com", org: "TechCorp India" } },
  { portal: "recruiter", role: "recruiter", label: "Recruiter / Agency", description: "Source, submit & place talent", icon: Briefcase, color: "oklch(0.6 0.16 70)", user: { name: "Sneha Reddy", email: "sneha@talentbridge.in", org: "TalentBridge" } },
  { portal: "training", role: "platform_admin", label: "Training & Admin", description: "Corporate training + platform admin", icon: GraduationCap, color: "oklch(0.6 0.13 300)", user: { name: "Divya Sharma", email: "divya@skillforge.academy", org: "SkillForge Academy" } },
  { portal: "partner", role: "employer", label: "Franchise Partner", description: "Run a centre, college, service, tech, AI or recruitment franchise", icon: Handshake, color: "oklch(0.55 0.13 165)", user: { name: "Rajesh Kumar", email: "rajesh@chennaitachacademy.in", org: "Chennai Tech Academy" } },
];

export function PublicPartnerLogin() {
  const { navigate } = useNav();
  const { login } = useAuth();
  const [selected, setSelected] = React.useState<PortalOption>(PORTAL_OPTIONS[0]);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      toast.error("Please enter email and password");
      return;
    }

    const VALID_EMAIL = "jobson.id@gmail.com";
    const VALID_PASSWORD = "businessos2026";

    if (normalizedEmail === VALID_EMAIL && password !== VALID_PASSWORD) {
      toast.error("Invalid credentials", {
        description: "The password entered is incorrect.",
      });
      return;
    }

    const emailName = normalizedEmail.includes("@") ? normalizedEmail.split("@")[0] : normalizedEmail;
    const initials = emailName.slice(0, 2).toUpperCase();

    setLoading(true);
    setTimeout(() => {
      login("candidate");
      useAuth.setState({
        user: {
          id: "u_candidate",
          name: emailName,
          email: normalizedEmail,
          role: "candidate",
          avatar: initials,
        },
        isAuthenticated: true,
      });
      toast.success(`Welcome back, ${emailName}!`);
      navigate("public", "home");
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandMark className="h-9 w-9" />
            <div className="text-left">
              <div className="text-lg font-bold tracking-tight">JOBSONN</div>
              <div className="text-[10px] text-muted-foreground">Partner Portal</div>
            </div>
          </div>
        </header>

        {/* Main split layout */}
        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: brand + value prop */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
              <Sparkles className="h-3.5 w-3.5" /> One platform, every role
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight lg:text-5xl">
              The unified portal for{" "}
              <span className="text-brand">talent, employers & partners</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground">
              Sign in to access your dedicated workspace — recruit, train, place, and
              grow careers on one intelligent platform.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: "DPDP-compliant & secure" },
                { icon: Sparkles, label: "AI-assisted matching" },
                { icon: Users, label: "48K+ learners & candidates" },
                { icon: Building2, label: "120+ corporate clients" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 rounded-lg border bg-card/60 p-3">
                  <f.icon className="h-4 w-4 shrink-0 text-brand" />
                  <span className="text-xs font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: login card */}
          <div className="mx-auto w-full max-w-md">
            <Card className="border-border/60 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Sign in to your portal</CardTitle>
                <CardDescription>Select your role to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Portal selector */}
                <div className="grid grid-cols-2 gap-2">
                  {PORTAL_OPTIONS.map((opt) => (
                    <button
                      key={opt.portal}
                      type="button"
                      onClick={() => setSelected(opt)}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all",
                        selected.portal === opt.portal
                          ? "border-brand bg-brand/5 ring-1 ring-brand/30"
                          : "border-border hover:border-brand/40 hover:bg-muted/40"
                      )}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: `${opt.color}20` }}>
                        <opt.icon className="h-4 w-4" style={{ color: opt.color }} />
                      </div>
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className="text-[10px] leading-tight text-muted-foreground line-clamp-2">{opt.description}</div>
                    </button>
                  ))}
                </div>

                {/* Login form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs">Password</Label>
                      <button type="button" className="text-[10px] text-brand hover:underline" onClick={() => toast.info("Password reset link sent (simulated)")}>
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-1.5" disabled={loading}>
                    {loading ? "Signing in…" : <>Sign in to {selected.label} <ArrowRight className="h-4 w-4" /></>}
                  </Button>
                </form>

                <div className="border-t pt-3 text-center text-xs text-muted-foreground">
                  New to JOBSONN?{" "}
                  <button onClick={() => navigate("public", "home")} className="font-medium text-brand hover:underline">
                    Create an account
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
