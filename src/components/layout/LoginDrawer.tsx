"use client";

import * as React from "react";
import Image from "next/image";
import { useNav, useAuth } from "@/lib/store";
import type { UserRole } from "@/lib/types";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  Handshake,
  Crown,
} from "lucide-react";

const REGISTER_ROLES = [
  { label: "Candidate", route: "register/candidate", icon: Users, color: "#0EA5E9" },
  { label: "Employer", route: "register/employer", icon: Building2, color: "#8B5CF6" },
  { label: "Recruiter", route: "register/recruiter", icon: Briefcase, color: "#F59E0B" },
  { label: "Training", route: "register/training", icon: GraduationCap, color: "#EF4444" },
  { label: "Partner", route: "register/partner", icon: Handshake, color: "#10B981" },
  { label: "Admin", route: "register/admin", icon: Crown, color: "#D4A017" },
];

export function LoginDrawer() {
  const { loginDrawerOpen, setLoginDrawerOpen, navigate, setRole } = useNav();
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);
  const [keepSignedIn, setKeepSignedIn] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset errors when drawer opens/closes
  React.useEffect(() => {
    if (loginDrawerOpen) {
      setError(null);
    }
  }, [loginDrawerOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const ALLOWED_EMAILS = ["jobson.id@gmail.com", "jobson.id"];
    const ALLOWED_PASSWORD = "businessos2026";

    // Strictly check email
    if (!ALLOWED_EMAILS.includes(normalizedEmail)) {
      setError("Invalid email address. Access is restricted to authorized accounts.");
      toast.error("Invalid credentials", {
        description: "Only authorized accounts can sign in.",
      });
      return;
    }

    // Strictly check password
    if (password !== ALLOWED_PASSWORD) {
      setError("Invalid password for jobson.id@gmail.com. Please try again.");
      toast.error("Invalid credentials", {
        description: "The password entered is incorrect.",
      });
      return;
    }

    setError(null);
    setLoading(true);

    const emailName = "jobson.id";
    const fullEmail = "jobson.id@gmail.com";
    const initials = "JO";

    setTimeout(() => {
      let redirectPortal: string | null = null;
      if (typeof window !== "undefined") {
        try {
          redirectPortal = sessionStorage.getItem("jobsonn_redirect_portal");
          sessionStorage.removeItem("jobsonn_redirect_portal");
        } catch {}
      }

      const roleForPortal: UserRole =
        redirectPortal === "partner" || redirectPortal === "employer"
          ? "employer"
          : redirectPortal === "recruiter"
          ? "recruiter"
          : redirectPortal === "admin"
          ? "platform_admin"
          : redirectPortal === "training"
          ? "training"
          : "candidate";

      setRole(roleForPortal);
      login(roleForPortal);
      useAuth.setState({
        user: {
          id: `u_${Date.now()}`,
          name: emailName,
          email: fullEmail,
          role: roleForPortal,
          avatar: initials,
        },
        isAuthenticated: true,
      });

      toast.success(`Welcome back, ${emailName}!`);
      setLoading(false);
      setLoginDrawerOpen(false);

      if (redirectPortal && redirectPortal !== "public") {
        navigate(redirectPortal as any, "overview");
      }
    }, 600);
  };

  return (
    <Sheet open={loginDrawerOpen} onOpenChange={setLoginDrawerOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-[480px] p-0 flex flex-col justify-between h-full bg-card shadow-2xl border-l border-border/80"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/jobsonn-logo.png"
              alt="JOBSONN"
              width={110}
              height={28}
              className="h-6 w-auto object-contain"
              priority
            />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Portal Sign In
            </span>
          </div>
        </div>

        {/* Scrollable Center Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-sm">
            {/* Top Shield Icon Badge */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
              <ShieldCheck className="h-7 w-7" />
            </div>

            {/* Title & Subtitle */}
            <SheetTitle className="mt-4 text-center text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </SheetTitle>
            <SheetDescription className="mt-1 text-center text-xs text-muted-foreground">
              Sign in to manage your professional profile and workplace network.
            </SheetDescription>

            {/* Error Message */}
            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="drawer-email" className="text-xs font-medium text-foreground">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="drawer-email"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="jobson.id@gmail.com"
                    required
                    className="h-10 pl-9 pr-3 text-sm rounded-lg border-border/80 bg-background/80 focus:border-brand"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="drawer-password" className="text-xs font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="drawer-password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••"
                    required
                    className="h-10 pl-9 pr-10 text-sm rounded-lg border-border/80 bg-background/80 focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Keep Signed In & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Password reset instructions sent (simulated)")}
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign in to JOBSONN <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Register Options Grid (Candidate, Employer, Recruiter, Training, Partner, Admin) */}
              <div className="pt-6 border-t border-border/80 mt-6">
                <p className="mb-3 text-center text-xs text-muted-foreground font-normal">
                  New to JOBSONN? Create an account:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {REGISTER_ROLES.map((role) => {
                    const RoleIcon = role.icon;
                    return (
                      <button
                        key={role.route}
                        type="button"
                        onClick={() => {
                          setLoginDrawerOpen(false);
                          navigate("public", role.route);
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-background/60 py-2.5 px-2 text-xs font-medium text-foreground transition-all duration-150 hover:border-brand hover:bg-brand/5 hover:text-brand shadow-2xs"
                      >
                        <RoleIcon className="h-3.5 w-3.5 shrink-0" style={{ color: role.color }} />
                        <span className="truncate">{role.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

