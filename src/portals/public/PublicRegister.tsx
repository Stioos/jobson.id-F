"use client";

import * as React from "react";
import Image from "next/image";
import { useNav, useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Handshake,
  Crown,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Info,
  AlertCircle,
  Check,
  ShieldCheck,
  Pencil,
  Clock,
  type LucideIcon,
} from "lucide-react";
import type { Portal, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AccountTypeConfig {
  roleKey: string;
  portal: Portal;
  role: UserRole;
  label: string;
  icon: LucideIcon;
  color: string;
}

const ACCOUNT_TYPES: AccountTypeConfig[] = [
  { roleKey: "candidate", portal: "candidate", role: "candidate", label: "Candidate", icon: Users, color: "#0EA5E9" },
  { roleKey: "employer", portal: "employer", role: "employer", label: "Employer", icon: Building2, color: "#8B5CF6" },
  { roleKey: "recruiter", portal: "recruiter", role: "recruiter", label: "Recruiter", icon: Briefcase, color: "#F59E0B" },
  { roleKey: "training", portal: "training", role: "platform_admin", label: "Training", icon: GraduationCap, color: "#EF4444" },
  { roleKey: "partner", portal: "partner", role: "employer", label: "Partner", icon: Handshake, color: "#10B981" },
  { roleKey: "admin", portal: "admin", role: "platform_admin", label: "Admin", icon: Crown, color: "#D4A017" },
];

const getAccountType = (key?: string): AccountTypeConfig =>
  ACCOUNT_TYPES.find((item) => item.roleKey === key) ?? ACCOUNT_TYPES[0];

const pillInputClass =
  "h-11 rounded-full border-slate-200 dark:border-border bg-white dark:bg-background/80 text-sm text-foreground placeholder:text-slate-400 focus-visible:border-[#0ea5e9] focus-visible:ring-3 focus-visible:ring-[#0ea5e9]/15 transition-all";

interface OtpVerificationCardProps {
  title: string;
  targetValue: string;
  icon: LucideIcon;
  digits: string[];
  onChangeDigits: (next: string[]) => void;
  verified: boolean;
  changeLabel: string;
  onChangeTarget: () => void;
  verifiedMessage: string;
  resendSeconds: number;
  onResend: () => void;
}

/**
 * Shared 6-digit OTP verification card for email & phone verification.
 */
function OtpVerificationCard({
  title,
  targetValue,
  icon: CardIcon,
  digits,
  onChangeDigits,
  verified,
  changeLabel,
  onChangeTarget,
  verifiedMessage,
  resendSeconds,
  onResend,
}: OtpVerificationCardProps) {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const handleDigitChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      onChangeDigits(next);
      return;
    }

    const next = [...digits];
    if (cleaned.length > 1) {
      // Handle multi-digit paste/autofill across boxes
      const chars = cleaned.slice(0, 6 - index).split("");
      chars.forEach((ch, offset) => {
        next[index + offset] = ch;
      });
      onChangeDigits(next);
      const focusIdx = Math.min(index + chars.length, 5);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    next[index] = cleaned;
    onChangeDigits(next);
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      onChangeDigits(next);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? "");
    onChangeDigits(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all shadow-xs",
        verified
          ? "border-emerald-300/90 bg-emerald-50/45 dark:border-emerald-700/60 dark:bg-emerald-950/20"
          : "border-slate-200/90 bg-white dark:border-border dark:bg-card"
      )}
    >
      {/* Top header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
              verified
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                : "bg-sky-50 text-[#0891b2] dark:bg-sky-950/50 dark:text-cyan-400"
            )}
          >
            {verified ? <Check className="h-4 w-4 stroke-[2.5]" /> : <CardIcon className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-foreground">{title}</h2>
            <p className="truncate text-xs text-slate-500 dark:text-muted-foreground">
              Code sent to <strong className="font-semibold text-slate-800 dark:text-foreground">{targetValue}</strong>
            </p>
          </div>
        </div>

        {verified && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 uppercase">
            <Check className="h-3 w-3 stroke-[2.5]" /> Verified
          </span>
        )}
      </div>

      {/* 6-Digit OTP Boxes */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            aria-label={`${title} digit ${idx + 1}`}
            className={cn(
              "h-12 w-full rounded-2xl border text-center text-base font-semibold transition-all focus:outline-none",
              verified
                ? "border-emerald-300 bg-emerald-50/90 text-emerald-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
                : "border-slate-200 bg-white text-slate-900 focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 dark:border-border dark:bg-background dark:text-foreground"
            )}
          />
        ))}
      </div>

      {/* Bottom status / action row */}
      <div className="mt-4 flex items-center justify-between gap-2 text-xs">
        {verified ? (
          <>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" /> {verifiedMessage}
            </span>
            <button
              type="button"
              onClick={onChangeTarget}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-foreground transition-colors cursor-pointer"
            >
              <Pencil className="h-3 w-3" /> {changeLabel}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onChangeTarget}
              className="inline-flex items-center gap-1 font-medium text-[#0891b2] dark:text-cyan-400 hover:underline cursor-pointer"
            >
              <Pencil className="h-3 w-3" /> {changeLabel}
            </button>
            {resendSeconds > 0 ? (
              <span className="inline-flex items-center gap-1 text-slate-500 dark:text-muted-foreground">
                <Clock className="h-3 w-3" /> Resend in {resendSeconds}s
              </span>
            ) : (
              <button
                type="button"
                onClick={onResend}
                className="inline-flex items-center gap-1 font-medium text-[#0891b2] dark:text-cyan-400 hover:underline cursor-pointer"
              >
                <Clock className="h-3 w-3" /> Resend code
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function PublicRegister({ roleKey = "candidate" }: { roleKey?: string }) {
  const { navigate } = useNav();
  const registerAccount = useAuth((s) => s.registerAccount);
  const logout = useAuth((s) => s.logout);

  const [selectedRoleKey, setSelectedRoleKey] = React.useState<string>(
    getAccountType(roleKey).roleKey
  );
  const [step, setStep] = React.useState<"register" | "verify">("register");

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);

  const [showPwd, setShowPwd] = React.useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Step 2: 6-digit OTP verification state
  const [emailDigits, setEmailDigits] = React.useState<string[]>(Array(6).fill(""));
  const [phoneDigits, setPhoneDigits] = React.useState<string[]>(Array(6).fill(""));
  const [emailResendSec, setEmailResendSec] = React.useState(25);
  const [phoneResendSec, setPhoneResendSec] = React.useState(25);

  const emailInputRef = React.useRef<HTMLInputElement | null>(null);
  const phoneInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setSelectedRoleKey(getAccountType(roleKey).roleKey);
  }, [roleKey]);

  const emailVerified = emailDigits.every((d) => /^\d$/.test(d));
  const phoneVerified = phoneDigits.every((d) => /^\d$/.test(d));
  const bothVerified = emailVerified && phoneVerified;

  // Countdown timer while on verify step
  React.useEffect(() => {
    if (step !== "verify") return;
    const id = setInterval(() => {
      setEmailResendSec((s) => (s > 0 ? s - 1 : 0));
      setPhoneResendSec((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  const activeAccountType = getAccountType(selectedRoleKey);
  const ActiveRoleIcon = activeAccountType.icon;

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first name and last name.");
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, "");
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername)) {
      setError("Username must be 3-30 characters using letters, numbers & underscores only.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please confirm your password.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setEmailResendSec(25);
    setPhoneResendSec(25);
    setStep("verify");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    toast.info("Verification codes sent!", {
      description: `Enter any 6-digit code for ${cleanEmail} and ${phone.trim()} to verify.`,
    });
  };

  const handleEditTarget = (field: "email" | "phone") => {
    setStep("register");
    setTimeout(() => {
      if (field === "email") {
        setEmailDigits(Array(6).fill(""));
        emailInputRef.current?.focus();
      } else {
        setPhoneDigits(Array(6).fill(""));
        phoneInputRef.current?.focus();
      }
    }, 50);
  };

  const handleVerifyAndContinue = () => {
    if (!bothVerified || loading) return;

    setLoading(true);
    setTimeout(() => {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const cleanUsername = username.trim().replace(/^@/, "");
      const cleanEmail = email.trim().toLowerCase();
      const initials =
        `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase() || "JO";

      // Ensure user signs in explicitly with their registered credentials on the Sign In page
      logout();
      registerAccount({
        name: fullName,
        username: cleanUsername,
        email: cleanEmail,
        phone: phone.trim(),
        password,
        role: activeAccountType.role,
        portal: activeAccountType.portal,
        avatar: initials,
      });

      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem("jobsonn_redirect_portal");
          sessionStorage.setItem("jobsonn_registered_notice", cleanEmail);
        } catch {}
      }

      toast.success("Account verified!", {
        description: `Sign in with ${cleanEmail} and your password to open the Career Portal.`,
      });
      setLoading(false);
      navigate("public", "auth");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background flex flex-col">
      {/* Minimal Top Bar */}
      <header className="w-full px-4 pt-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("public", "home")}
            className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
            aria-label="JOBSONN home"
          >
            <Image
              src="/jobsonn-logo.png"
              alt="JOBSONN"
              width={120}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </button>
          <button
            type="button"
            onClick={() => navigate("public", "auth")}
            className="text-xs font-medium text-slate-500 hover:text-foreground transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        {step === "register" ? (
          /* Stage 1: Registration Card (Image 1) */
          <div className="w-full max-w-[560px] rounded-[22px] border border-slate-200/80 dark:border-border bg-white dark:bg-card p-6 sm:p-8 shadow-[0_14px_45px_-12px_rgba(15,23,42,0.12)]">
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-[22px] sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground">
                  Create your account
                </h1>
                <p className="mt-1 text-xs sm:text-[13px] text-slate-500 dark:text-muted-foreground">
                  Fill in your information to join JOBSONN as a {activeAccountType.label}.
                </p>
              </div>
              <span
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  borderColor: `${activeAccountType.color}35`,
                  backgroundColor: `${activeAccountType.color}12`,
                  color: activeAccountType.color,
                }}
              >
                <ActiveRoleIcon className="h-3 w-3" />
                {activeAccountType.label}
              </span>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="mt-5 space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-first-name"
                    className="text-xs font-semibold text-slate-800 dark:text-foreground"
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="reg-first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="John"
                      className={cn(pillInputClass, "pl-10 pr-4")}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-last-name"
                    className="text-xs font-semibold text-slate-800 dark:text-foreground"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="reg-last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Doe"
                    className={cn(pillInputClass, "px-4")}
                    required
                  />
                </div>
              </div>

              {/* Username (unique) */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="reg-username"
                  className="text-xs font-semibold text-slate-800 dark:text-foreground"
                >
                  Username{" "}
                  <span className="font-medium text-[#0891b2] dark:text-cyan-400">
                    (unique)
                  </span>
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                    @
                  </span>
                  <Input
                    id="reg-username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                      setUsername(sanitized);
                      if (error) setError(null);
                    }}
                    placeholder="johndoe"
                    className={cn(pillInputClass, "pl-8 pr-4")}
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-muted-foreground">
                  Letters, numbers &amp; underscores only.
                </p>
              </div>

              {/* Email & Phone No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-email"
                    className="text-xs font-semibold text-slate-800 dark:text-foreground"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      ref={emailInputRef}
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="you@company.com"
                      className={cn(pillInputClass, "pl-10 pr-4")}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-phone"
                    className="text-xs font-semibold text-slate-800 dark:text-foreground"
                  >
                    Phone No
                  </Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      ref={phoneInputRef}
                      id="reg-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="+91 98765 43210"
                      className={cn(pillInputClass, "pl-10 pr-4")}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-password"
                    className="text-xs font-semibold text-slate-800 dark:text-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="reg-password"
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="••••••••"
                      className={cn(pillInputClass, "pl-10 pr-10")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-confirm-password"
                    className="text-xs font-semibold text-slate-800 dark:text-foreground"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="reg-confirm-password"
                      type={showConfirmPwd ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="••••••••"
                      className={cn(pillInputClass, "pl-10 pr-10")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd((s) => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={showConfirmPwd ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="flex items-center gap-2.5 rounded-full border border-[#dbeafe] dark:border-sky-900/50 bg-[#f4f8fe] dark:bg-sky-950/30 px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Info className="h-4 w-4 shrink-0 text-[#0284c7] dark:text-sky-400" />
                <span>
                  After registration you&apos;ll verify email &amp; phone, then sign in to open the Career Portal.
                </span>
              </div>

              {/* Terms & Privacy Checkbox */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (error) setError(null);
                  }}
                  className="h-4 w-4 rounded border-slate-300 accent-[#0891b2] cursor-pointer"
                />
                <label
                  htmlFor="reg-terms"
                  className="text-xs text-slate-600 dark:text-muted-foreground cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => navigate("public", "terms")}
                    className="font-medium text-[#0891b2] dark:text-cyan-400 hover:underline"
                  >
                    Terms &amp; Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => navigate("public", "privacy")}
                    className="font-medium text-[#0891b2] dark:text-cyan-400 hover:underline"
                  >
                    Privacy Policy
                  </button>{" "}
                  of JOBSONN.
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-full bg-gradient-to-r from-[#0694b8] via-[#057de0] to-[#085cf7] text-sm font-semibold text-white shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Create Account <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Already have an account */}
              <p className="pt-1 text-center text-xs text-slate-500 dark:text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("public", "auth")}
                  className="inline-flex items-center gap-1 font-semibold text-[#0891b2] dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Sign in <ArrowRight className="h-3 w-3" />
                </button>
              </p>
            </form>
          </div>
        ) : (
          /* Stage 2 & 3: Verify Your Account (Image 2 -> Image 3) */
          <div className="w-full max-w-[760px] py-2">
            {/* Stepper Pills */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300 uppercase">
                <Check className="h-3 w-3 stroke-[2.5]" /> Account
              </span>
              <span className="h-px w-4 sm:w-6 bg-slate-200 dark:bg-border" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300 uppercase">
                <Check className="h-3 w-3 stroke-[2.5]" /> Details
              </span>
              <span className="h-px w-4 sm:w-6 bg-slate-200 dark:bg-border" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0891b2] px-3.5 py-1 text-[11px] font-bold tracking-wider text-white shadow-xs uppercase">
                <ShieldCheck className="h-3.5 w-3.5" /> Verify
              </span>
            </div>

            {/* Heading */}
            <div className="mt-5 text-center">
              <h1 className="text-3xl sm:text-[34px] font-bold tracking-tight text-slate-900 dark:text-foreground">
                Verify your account.
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-slate-500 dark:text-muted-foreground leading-relaxed">
                We sent verification codes to your registered email and phone. Enter the 6-digit codes
                below to activate your JOBSONN account.
              </p>
            </div>

            {/* Side-by-side Email & Phone Verification Cards */}
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              <OtpVerificationCard
                title="Email verification"
                targetValue={email.trim().toLowerCase()}
                icon={Mail}
                digits={emailDigits}
                onChangeDigits={setEmailDigits}
                verified={emailVerified}
                changeLabel="Change email"
                onChangeTarget={() => handleEditTarget("email")}
                verifiedMessage="Email successfully verified"
                resendSeconds={emailResendSec}
                onResend={() => {
                  setEmailResendSec(25);
                  toast.success(`Verification code resent to ${email.trim().toLowerCase()}`);
                }}
              />

              <OtpVerificationCard
                title="Phone verification"
                targetValue={phone.trim()}
                icon={Phone}
                digits={phoneDigits}
                onChangeDigits={setPhoneDigits}
                verified={phoneVerified}
                changeLabel="Change phone"
                onChangeTarget={() => handleEditTarget("phone")}
                verifiedMessage="Phone successfully verified"
                resendSeconds={phoneResendSec}
                onResend={() => {
                  setPhoneResendSec(25);
                  toast.success(`Verification code resent to ${phone.trim()}`);
                }}
              />
            </div>

            {/* Info Notice */}
            <div className="mt-4 flex items-center gap-2.5 rounded-full border border-[#dbeafe] dark:border-sky-900/50 bg-[#f4f8fe] dark:bg-sky-950/30 px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300">
              <Info className="h-4 w-4 shrink-0 text-[#0284c7] dark:text-sky-400" />
              <span>
                Check your spam folder if you don&apos;t see the email. SMS may take up to 30 seconds to arrive.
              </span>
            </div>

            {/* Primary CTA Button (Disabled gray in Image 2 -> Active gradient in Image 3) */}
            <div className="mt-4">
              <Button
                type="button"
                disabled={!bothVerified || loading}
                onClick={handleVerifyAndContinue}
                className={cn(
                  "w-full h-12 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2",
                  bothVerified
                    ? "bg-gradient-to-r from-[#0694b8] via-[#057de0] to-[#085cf7] text-white shadow-md hover:brightness-105 cursor-pointer"
                    : "bg-slate-200/80 text-slate-500 hover:bg-slate-200/80 shadow-none cursor-not-allowed dark:bg-muted dark:text-muted-foreground"
                )}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Activating account...
                  </span>
                ) : bothVerified ? (
                  <>
                    Verify &amp; continue <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "Enter both codes to continue"
                )}
              </Button>
            </div>

            {/* OR Divider & Back to registration */}
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-border" />
              <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">OR</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-border" />
            </div>

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setStep("register")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0891b2] dark:text-cyan-400 hover:underline cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to registration
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-[11px] text-slate-400 dark:text-muted-foreground">
        &copy; {new Date().getFullYear()} JOBSONN. Global Career &amp; Talent Discovery Platform.
      </footer>
    </div>
  );
}
