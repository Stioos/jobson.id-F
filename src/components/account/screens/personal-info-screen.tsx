"use client";

import { useState, useRef, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, Globe, Pencil, Shield, Save, Check,
  ImagePlus, X, Calendar, Languages, Link2, Plus, Trash2, Lock,
} from "lucide-react";
import { toast } from "sonner";
import { getStoredUser, saveUserData, getInitials } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

interface PersonalInfoScreenProps {
  email: string;
  phone: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export function PersonalInfoScreen({ email: initialEmail, phone: initialPhone }: PersonalInfoScreenProps) {
  // Safe initial hydration matching SSR
  const [fullName, setFullName] = useState("Harshadeep Reddy");
  const [displayName, setDisplayName] = useState("Harsha");
  const [email, setEmail] = useState(initialEmail || "jobson.id@gmail.com");
  const [phone, setPhone] = useState(initialPhone || "+91 78295 23537");

  useEffect(() => {
    const stored = getStoredUser();
    if (stored?.fullName) setFullName(stored.fullName);
    if (stored?.firstName) setDisplayName(stored.firstName);
    else if (stored?.fullName) setDisplayName(stored.fullName.split(" ")[0]);
    if (stored?.email) setEmail(stored.email);
    if (stored?.phone) setPhone(stored.phone);
  }, []);

  // Basic profile details
  const [jobTitle, setJobTitle] = useState("Managing Director & Founder");
  const [headline, setHeadline] = useState("Transforming Data into Growth | Business Intelligence | Revenue-Driven Sales & Marketing | Procurement & Supply Chains | Product Design & Development | Strategy & Process Excellence | End-to-End Manufacturing Solutions");
  const [pronouns, setPronouns] = useState("he/him");
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState("1995-08-14");

  // Address
  const [addressLine, setAddressLine] = useState("12, MG Road, Brigade Tower");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Karnataka");
  const [city, setCity] = useState("Bengaluru");
  const [pincode, setPincode] = useState("560001");
  const [landmark, setLandmark] = useState("Opp. Trinity Metro Station");
  const [areaName, setAreaName] = useState("MG Road / Halasuru");

  // Languages
  const [languages, setLanguages] = useState<string[]>(["English", "Hindi", "Kannada", "Telugu"]);
  const [newLanguage, setNewLanguage] = useState("");

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: "s1", platform: "LinkedIn", url: "https://linkedin.com/in/harshadeep" },
    { id: "s2", platform: "X (Twitter)", url: "https://x.com/harshadeep" },
    { id: "s3", platform: "GitHub", url: "https://github.com/harshadeep" },
  ]);
  const [newSocialPlatform, setNewSocialPlatform] = useState("LinkedIn");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Profile visibility & privacy
  const [visibility, setVisibility] = useState<"public" | "network" | "private">("public");
  const [showDob, setShowDob] = useState<"full" | "month-day" | "hidden">("month-day");
  const [showAddress, setShowAddress] = useState<"full" | "city-only" | "hidden">("city-only");
  const [allowSearchIndexing, setAllowSearchIndexing] = useState(true);
  const [allowDataCollection, setAllowDataCollection] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
        toast.success("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Cover image exceeds 8MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCoverUrl(reader.result as string);
        toast.success("Profile cover updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Photo reset to default avatar.");
  };

  const handleRemoveCover = () => {
    setCoverUrl(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
    toast.info("Cover image removed.");
  };

  const addLanguage = () => {
    const lang = newLanguage.trim();
    if (!lang) return;
    if (languages.some((l) => l.toLowerCase() === lang.toLowerCase())) {
      toast.error("Language already added.");
      return;
    }
    setLanguages((prev) => [...prev, lang]);
    setNewLanguage("");
  };

  const removeLanguage = (lang: string) => {
    setLanguages((prev) => prev.filter((l) => l !== lang));
  };

  const addSocialLink = () => {
    if (!newSocialUrl.trim()) return;
    setSocialLinks((prev) => [...prev, { id: `s${Date.now()}`, platform: newSocialPlatform, url: newSocialUrl.trim() }]);
    setNewSocialUrl("");
    toast.success("Social link added.");
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    saveUserData({
      fullName,
      firstName: displayName,
      email,
      phone,
    });
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Personal information updated successfully!");
    }, 600);
  };

  const inputCls = "h-11 w-full rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-600";
  const inputIconCls = "h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-600";

  return (
    <div className="space-y-8">
      {/* === 1. Profile Photo, Cover & Identity === */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        {/* Cover Photo */}
        <div className="relative h-40 w-full sm:h-48">
          {coverUrl ? (
            <img src={coverUrl} alt="Profile cover" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-indigo-600/30 dark:from-cyan-500/20 dark:via-blue-600/10 dark:to-indigo-600/20" />
          )}
          {/* Cover overlay actions */}
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-black/70 cursor-pointer"
            >
              <ImagePlus className="h-3.5 w-3.5" /> {coverUrl ? "Change Cover" : "Upload Cover"}
            </button>
            {coverUrl && (
              <button
                type="button"
                onClick={handleRemoveCover}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 cursor-pointer"
                aria-label="Remove cover"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleCoverChange} className="hidden" />
        </div>

        {/* Profile Photo + Identity */}
        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs transition-all hover:border-cyan-500/40 hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" /> Edit Photo
            </button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleFileChange} className="hidden" />

          {/* Avatar overlapping cover */}
          <div className="mt-[-3rem] flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="relative group">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName || "Profile"} className="h-24 w-24 rounded-2xl object-cover shadow-lg shadow-cyan-500/20 ring-4 ring-card dark:ring-slate-900" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-cyan-500/20 ring-4 ring-card dark:ring-slate-900">
                  {getInitials(fullName)}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-md transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-background dark:ring-[#0c1322]"
                title="Edit profile photo"
                aria-label="Edit profile photo"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600/10 px-4 py-2 text-xs font-semibold text-cyan-600 transition-all hover:bg-cyan-600/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" /> Upload new image
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="rounded-xl border border-border bg-transparent px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
                >
                  Remove photo
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground/80 dark:text-slate-500">Profile photo: JPG, PNG, WebP or SVG up to 5MB (400×400px). Cover: JPG, PNG, WebP up to 8MB (1500×500px recommended).</p>
            </div>
          </div>
        </div>
      </section>

      {/* === 2. Basic Profile Details === */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <h3 className="text-base font-bold text-foreground dark:text-white">Basic Profile Details</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Full Legal Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputIconCls} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Display Name / Alias</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Job Title / Designation</label>
            <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Pronouns</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <select value={pronouns} onChange={(e) => setPronouns(e.target.value)} className={inputIconCls}>
                <option value="he/him">he/him</option>
                <option value="she/her">she/her</option>
                <option value="they/them">they/them</option>
                <option value="he/they">he/they</option>
                <option value="she/they">she/they</option>
                <option value="custom">Custom</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputCls}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="nonbinary">Non-binary / Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Date of Birth</label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputIconCls} />
            </div>
          </div>
        </div>

        {/* Headline — full-width bordered box (label above content), like a LinkedIn-style professional summary */}
        <div className="mt-6 space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Headline</label>
          <textarea
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            rows={3}
            placeholder="e.g. Transforming Data into Growth | Business Intelligence | Revenue-Driven Sales & Marketing | Procurement & Supply Chains | Product Design & Development | Strategy & Process Excellence | End-to-End Manufacturing Solutions"
            className="w-full resize-y rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-600"
          />
          <p className="text-[11px] text-muted-foreground/80 dark:text-slate-500">Your professional headline — separate skills, domains, or value props with a pipe (|). Shown prominently on your profile card.</p>
        </div>
      </section>

      {/* === Contact & Verified Channels === */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <h3 className="text-base font-bold text-foreground dark:text-white">Contact</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Email Address (Verified)</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input type="email" value={email} disabled className="h-11 w-full rounded-xl border border-emerald-500/30 bg-muted/50 pl-10 pr-24 text-sm text-muted-foreground cursor-not-allowed dark:bg-slate-950/40 dark:text-slate-300" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Phone Number (Verified)</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input type="text" value={phone} disabled className="h-11 w-full rounded-xl border border-emerald-500/30 bg-muted/50 pl-10 pr-24 text-sm text-muted-foreground cursor-not-allowed dark:bg-slate-950/40 dark:text-slate-300" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* === 3. Address === */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <h3 className="text-base font-bold text-foreground dark:text-white">Address</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Address Line</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input type="text" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="House no, street, building" className={inputIconCls} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Country</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputIconCls} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">State / Region</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Pincode / ZIP</label>
            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="e.g. 560001" className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Landmark</label>
            <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Nearby landmark" className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Location Name / Area</label>
            <input type="text" value={areaName} onChange={(e) => setAreaName(e.target.value)} placeholder="e.g. MG Road / Halasuru" className={inputCls} />
          </div>
        </div>
      </section>

      {/* === 4. Date of Birth & Languages === */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground dark:text-white">
          <Languages className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400" /> Languages Known
        </h3>
        <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">Languages you can speak, read, or write.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {languages.map((lang) => (
            <span key={lang} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-2.5 py-1.5 text-xs font-medium text-foreground dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              {lang}
              <button type="button" onClick={() => removeLanguage(lang)} className="text-muted-foreground hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 cursor-pointer" aria-label={`Remove ${lang}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {languages.length === 0 && <p className="text-xs text-muted-foreground dark:text-slate-400">No languages added yet.</p>}
        </div>
        <div className="mt-4 flex gap-2">
          <input type="text" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLanguage()} placeholder="Add a language e.g. Tamil" className={inputCls} />
          <button type="button" onClick={addLanguage} className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-cyan-500 px-4 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </section>

      {/* === 5. Social Media Links === */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground dark:text-white">
          <Link2 className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400" /> Social Media Links
        </h3>
        <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">Add links to your social profiles and online presence.</p>

        <div className="mt-4 space-y-3">
          {socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <span className="inline-flex h-11 w-32 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 px-3 text-xs font-bold text-foreground dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                {link.platform}
              </span>
              <input type="url" value={link.url} onChange={(e) => setSocialLinks((prev) => prev.map((s) => s.id === link.id ? { ...s, url: e.target.value } : s))} className={inputCls} />
              <button type="button" onClick={() => removeSocialLink(link.id)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-500 dark:border-white/10 dark:text-slate-400 cursor-pointer" aria-label="Remove link">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new social link */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <select value={newSocialPlatform} onChange={(e) => setNewSocialPlatform(e.target.value)} className={cn(inputCls, "sm:w-40")}>
            <option value="LinkedIn">LinkedIn</option>
            <option value="X (Twitter)">X (Twitter)</option>
            <option value="GitHub">GitHub</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="YouTube">YouTube</option>
            <option value="Behance">Behance</option>
            <option value="Dribbble">Dribbble</option>
            <option value="Website">Personal Website</option>
          </select>
          <input type="url" value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSocialLink()} placeholder="https://..." className={inputCls} />
          <button type="button" onClick={addSocialLink} className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-cyan-500 px-4 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Add Link
          </button>
        </div>
      </section>

      {/* === Profile Visibility & Privacy === */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground dark:text-white">
          <Lock className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" /> Profile Visibility & Privacy
        </h3>
        <p className="text-xs text-muted-foreground dark:text-slate-400">Control who can discover and view your personal data.</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { id: "public", title: "Public", desc: "Visible to all visitors on JOBSONN directory" },
            { id: "network", title: "Verified Network Only", desc: "Only logged-in verified accounts can view" },
            { id: "private", title: "Private / Hidden", desc: "Hidden from public search; only direct links work" },
          ].map((v) => (
            <div
              key={v.id}
              onClick={() => setVisibility(v.id as any)}
              className={cn(
                "flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all",
                visibility === v.id
                  ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30"
                  : "border-border bg-background/80 hover:border-border/80 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-white/20",
              )}
            >
              <div>
                <p className="text-sm font-bold text-foreground dark:text-white">{v.title}</p>
                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">{v.desc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                {visibility === v.id && <Check className="h-3.5 w-3.5" />}
                {visibility === v.id ? "Selected" : "Click to select"}
              </span>
            </div>
          ))}
        </div>

        {/* Field-level visibility toggles */}
        <div className="mt-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-500">Field-level Visibility</p>

          {/* DOB visibility */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">Date of Birth</p>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Control how much of your DOB is visible to others.</p>
            </div>
            <select value={showDob} onChange={(e) => setShowDob(e.target.value as any)} className="h-9 rounded-lg border border-border bg-background/80 px-3 text-xs text-foreground dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
              <option value="full">Show full date</option>
              <option value="month-day">Show month & day only</option>
              <option value="hidden">Hide completely</option>
            </select>
          </div>

          {/* Address visibility */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-950/40">
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">Address</p>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Control how much of your address is visible.</p>
            </div>
            <select value={showAddress} onChange={(e) => setShowAddress(e.target.value as any)} className="h-9 rounded-lg border border-border bg-background/80 px-3 text-xs text-foreground dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
              <option value="full">Show full address</option>
              <option value="city-only">Show city & country only</option>
              <option value="hidden">Hide completely</option>
            </select>
          </div>

          {/* Search indexing toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 p-4 dark:border-white/5 dark:bg-slate-950/40">
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">Allow search engine indexing</p>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Let Google & other search engines index your profile.</p>
            </div>
            <button
              type="button"
              onClick={() => setAllowSearchIndexing((v) => !v)}
              className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer", allowSearchIndexing ? "bg-cyan-500" : "bg-muted dark:bg-slate-700")}
              aria-pressed={allowSearchIndexing}
              aria-label="Toggle search indexing"
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", allowSearchIndexing ? "translate-x-5" : "translate-x-0.5")} />
            </button>
          </div>

          {/* Data collection toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 p-4 dark:border-white/5 dark:bg-slate-950/40">
            <div>
              <p className="text-sm font-bold text-foreground dark:text-white">Allow personal data collection</p>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Consent to JOBSONN collecting your personal data for profile services.</p>
            </div>
            <button
              type="button"
              onClick={() => setAllowDataCollection((v) => !v)}
              className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer", allowDataCollection ? "bg-cyan-500" : "bg-muted dark:bg-slate-700")}
              aria-pressed={allowDataCollection}
              aria-label="Toggle data collection"
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", allowDataCollection ? "translate-x-5" : "translate-x-0.5")} />
            </button>
          </div>
        </div>
      </section>

      {/* === Save Button Bar === */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? "Saving changes..." : "Save Personal Info"}
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
