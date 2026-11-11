"use client";

import { useRef, useState } from "react";
import {
  Building2, Globe, MapPin, Users, DollarSign, Calendar, Clock,
  Eye, Save, Upload, Pencil, ImagePlus, X, Link2, Lock, Plus, Trash2, Check
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useOrganization } from "../organization-context";
import { getInitials } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

// 26 social media platforms with icons (using lucide-react brand-agnostic icons + simple-icons via CDN)
const SOCIAL_PLATFORMS = [
  "LinkedIn", "X (Twitter)", "GitHub", "Instagram", "Facebook",
  "YouTube", "WhatsApp", "Telegram", "Discord", "Reddit",
  "Pinterest", "TikTok", "Snapchat", "Tumblr", "Medium",
  "Quora", "Stack Overflow", "Behance", "Dribbble", "Flickr",
  "Vimeo", "Vine", "Periscope", "Website", "Blog", "Other",
] as const;

interface BusinessProfileScreenProps {
  onNavigate?: (sectionId: string) => void;
}

export function BusinessProfileScreen({ onNavigate }: BusinessProfileScreenProps = {}) {
  const { data, updateData, updateCompanyName, updateFacilityAddress, saveData, isSaving } = useOrganization();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [newSocialPlatform, setNewSocialPlatform] = useState<string>("LinkedIn");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // ─── Social link handlers ───
  const addSocialLink = () => {
    if (!newSocialUrl.trim()) {
      toast.error("Please enter a URL.");
      return;
    }
    const link = { id: `sl${Date.now()}`, platform: newSocialPlatform, url: newSocialUrl.trim() };
    updateData({ socialLinks: [...data.socialLinks, link] });
    setNewSocialUrl("");
    toast.success(`${newSocialPlatform} link added.`);
  };

  const removeSocialLink = (id: string) => {
    updateData({ socialLinks: data.socialLinks.filter((s) => s.id !== id) });
    toast.success("Social link removed.");
  };

  const updateSocialLinkUrl = (id: string, url: string) => {
    updateData({ socialLinks: data.socialLinks.map((s) => s.id === id ? { ...s, url } : s) });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo file size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updateData({ logoUrl: reader.result as string });
        toast.success("Official logo replaced successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Banner file size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updateData({ bannerUrl: reader.result as string });
        toast.success("Cover banner updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    saveData("Business profile");
  };

  return (
    <div className="space-y-8">
      {/* Brand Assets & Imagery — cover banner + logo profile card
          Redesigned to match personal-info cover+avatar pattern */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        {/* Hidden file inputs */}
        <input
          ref={logoInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleLogoChange}
          className="hidden"
        />
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleBannerChange}
          className="hidden"
        />

        {/* Cover Photo */}
        <div className="relative h-40 w-full sm:h-48">
          {data.bannerUrl ? (
            <img src={data.bannerUrl} alt="Cover banner" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-indigo-600/30 dark:from-cyan-500/20 dark:via-blue-600/10 dark:to-indigo-600/20" />
          )}
          {/* Cover overlay actions */}
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-black/70 cursor-pointer"
            >
              <ImagePlus className="h-3.5 w-3.5" /> {data.bannerUrl ? "Change Cover" : "Upload Cover"}
            </button>
            {data.bannerUrl && (
              <button
                type="button"
                onClick={() => {
                  updateData({ bannerUrl: null });
                  if (bannerInputRef.current) bannerInputRef.current.value = "";
                  toast.info("Cover image removed.");
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 cursor-pointer"
                aria-label="Remove cover"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {/* Preview Live Profile link (top-left, moved from old header) */}
          <Link
            href="/companies"
            className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-black/70"
          >
            <Eye className="h-3 w-3" /> Preview
          </Link>
        </div>

        {/* Logo + actions row (overlapping cover) */}
        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs transition-all hover:border-cyan-500/40 hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" /> Edit Logo
            </button>
          </div>

          {/* Logo overlapping cover */}
          <div className="mt-[-3rem] flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="relative group">
              {data.logoUrl ? (
                <img
                  src={data.logoUrl}
                  alt={data.companyName || "Logo"}
                  className="h-24 w-24 rounded-2xl object-cover shadow-lg shadow-cyan-500/20 ring-4 ring-card dark:ring-slate-900"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-cyan-500/20 ring-4 ring-card dark:ring-slate-900">
                  <span suppressHydrationWarning>{getInitials(data.companyName)}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-md transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-background dark:ring-[#0c1322]"
                title="Edit logo"
                aria-label="Edit logo"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600/10 px-4 py-2 text-xs font-semibold text-cyan-600 transition-all hover:bg-cyan-600/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" /> Upload new image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateData({ logoUrl: null });
                    if (logoInputRef.current) logoInputRef.current.value = "";
                    toast.info("Logo reset to default.");
                  }}
                  className="rounded-xl border border-border bg-transparent px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
                >
                  Remove photo
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground/80 dark:text-slate-500">
                Logo: JPG, PNG, WebP or SVG up to 5MB (512×512px recommended). Cover: JPG, PNG, WebP up to 5MB (1500×500px recommended).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Company Details Form */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <h3 className="text-base font-bold text-foreground dark:text-white">Company Identity</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Registered Business Name</label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => updateCompanyName(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>
            <p className="text-[11px] text-muted-foreground/80 dark:text-slate-500">Synced to billing, shipping &amp; facility addresses automatically.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Trade Name / Brand Name</label>
            <input
              type="text"
              value={data.tradeName}
              onChange={(e) => updateData({ tradeName: e.target.value })}
              className="h-11 w-full rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Business Type</label>
            <select
              value={data.businessType}
              onChange={(e) => updateData({ businessType: e.target.value })}
              className="h-11 w-full rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            >
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="General Partnership">General Partnership</option>
              <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
              <option value="Limited Partnership (LP)">Limited Partnership (LP)</option>
              <option value="Private Limited Company">Private Limited Company</option>
              <option value="Public Limited Company">Public Limited Company</option>
              <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
              <option value="Corporation (Inc. / Corp.)">Corporation (Inc. / Corp.)</option>
              <option value="Private Company Limited by Shares">Private Company Limited by Shares</option>
              <option value="Public Company Limited by Shares">Public Company Limited by Shares</option>
              <option value="Unlimited Company">Unlimited Company</option>
              <option value="Cooperative Society">Cooperative Society</option>
              <option value="Joint Venture (JV)">Joint Venture (JV)</option>
              <option value="Non-Profit Organization (NPO)">Non-Profit Organization (NPO)</option>
              <option value="Trust / Foundation">Trust / Foundation</option>
            </select>
          </div>

          {/* Business Size — dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Business Size</label>
            <select
              value={data.businessSize}
              onChange={(e) => updateData({ businessSize: e.target.value })}
              className="h-11 w-full rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            >
              <option value="Micro">Micro (1-9 employees)</option>
              <option value="Startup">Startup (Pre-revenue / Early stage)</option>
              <option value="Small">Small (10-49 employees)</option>
              <option value="Medium">Medium (50-249 employees)</option>
              <option value="Large">Large (250-999 employees)</option>
              <option value="Enterprise">Enterprise (1,000-4,999 employees)</option>
              <option value="Corporation">Corporation (5,000-10,000 employees)</option>
              <option value="Global Corporation">Global Corporation (10,000+ employees)</option>
              <option value="MSME">MSME (Registered Micro/Small/Medium)</option>
              <option value="Freelancer / Solo">Freelancer / Solo Professional</option>
            </select>
          </div>

          {/* Country — dropdown with flag, name, currency, currency symbol, country code */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Country</label>
            <select
              value={data.country}
              onChange={(e) => updateData({ country: e.target.value })}
              className="h-11 w-full rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            >
                <option value="IN">🇮🇳 India — INR (₹) +91</option>
                <option value="US">🇺🇸 United States — USD ($) +1</option>
                <option value="GB">🇬🇧 United Kingdom — GBP (£) +44</option>
                <option value="AE">🇦🇪 United Arab Emirates — AED (د.إ) +971</option>
                <option value="SG">🇸🇬 Singapore — SGD (S$) +65</option>
                <option value="AU">🇦🇺 Australia — AUD (A$) +61</option>
                <option value="CA">🇨🇦 Canada — CAD (C$) +1</option>
                <option value="DE">🇩🇪 Germany — EUR (€) +49</option>
                <option value="FR">🇫🇷 France — EUR (€) +33</option>
                <option value="NL">🇳🇱 Netherlands — EUR (€) +31</option>
                <option value="CH">🇨🇭 Switzerland — CHF (Fr) +41</option>
                <option value="JP">🇯🇵 Japan — JPY (¥) +81</option>
                <option value="CN">🇨🇳 China — CNY (¥) +86</option>
                <option value="HK">🇭🇰 Hong Kong — HKD (HK$) +852</option>
                <option value="KR">🇰🇷 South Korea — KRW (₩) +82</option>
                <option value="TH">🇹🇭 Thailand — THB (฿) +66</option>
                <option value="MY">🇲🇾 Malaysia — MYR (RM) +60</option>
                <option value="ID">🇮🇩 Indonesia — IDR (Rp) +62</option>
                <option value="PH">🇵🇭 Philippines — PHP (₱) +63</option>
                <option value="VN">🇻🇳 Vietnam — VND (₫) +84</option>
                <option value="BD">🇧🇩 Bangladesh — BDT (৳) +880</option>
                <option value="PK">🇵🇰 Pakistan — PKR (₨) +92</option>
                <option value="LK">🇱🇰 Sri Lanka — LKR (Rs) +94</option>
                <option value="NP">🇳🇵 Nepal — NPR (रू) +977</option>
                <option value="BH">🇧🇹 Bhutan — BTN (Nu) +975</option>
                <option value="MV">🇲🇻 Maldives — MVR (Rf) +960</option>
                <option value="AF">🇦🇫 Afghanistan — AFN (؋) +93</option>
                <option value="SA">🇸🇦 Saudi Arabia — SAR (﷼) +966</option>
                <option value="QA">🇶🇦 Qatar — QAR (﷼) +974</option>
                <option value="KW">🇰🇼 Kuwait — KWD (د.ك) +965</option>
                <option value="BH2">🇧🇭 Bahrain — BHD (.د.ب) +973</option>
                <option value="OM">🇴🇲 Oman — OMR (﷼) +968</option>
                <option value="JO">🇯🇴 Jordan — JOD (د.ا) +962</option>
                <option value="LB">🇱🇧 Lebanon — LBP (£) +961</option>
                <option value="EG">🇪🇬 Egypt — EGP (£) +20</option>
                <option value="NG">🇳🇬 Nigeria — NGN (₦) +234</option>
                <option value="ZA">🇿🇦 South Africa — ZAR (R) +27</option>
                <option value="KE">🇰🇪 Kenya — KES (KSh) +254</option>
                <option value="GH">🇬🇭 Ghana — GHS (₵) +233</option>
                <option value="ET">🇪🇹 Ethiopia — ETB (Br) +251</option>
                <option value="TZ">🇹🇿 Tanzania — TZS (TSh) +255</option>
                <option value="BR">🇧🇷 Brazil — BRL (R$) +55</option>
                <option value="MX">🇲🇽 Mexico — MXN ($) +52</option>
                <option value="AR">🇦🇷 Argentina — ARS ($) +54</option>
                <option value="CL">🇨🇱 Chile — CLP ($) +56</option>
                <option value="CO">🇨🇴 Colombia — COP ($) +57</option>
                <option value="PE">🇵🇪 Peru — PEN (S/) +51</option>
                <option value="VE">🇻🇪 Venezuela — VES (Bs) +58</option>
                <option value="RU">🇷🇺 Russia — RUB (₽) +7</option>
                <option value="TR">🇹🇷 Turkey — TRY (₺) +90</option>
                <option value="PL">🇵🇱 Poland — PLN (zł) +48</option>
                <option value="SE">🇸🇪 Sweden — SEK (kr) +46</option>
                <option value="NO">🇳🇴 Norway — NOK (kr) +47</option>
                <option value="DK">🇩🇰 Denmark — DKK (kr) +45</option>
                <option value="FI">🇫🇮 Finland — EUR (€) +358</option>
                <option value="IE">🇮🇪 Ireland — EUR (€) +353</option>
                <option value="PT">🇵🇹 Portugal — EUR (€) +351</option>
                <option value="ES">🇪🇸 Spain — EUR (€) +34</option>
                <option value="IT">🇮🇹 Italy — EUR (€) +39</option>
                <option value="GR">🇬🇷 Greece — EUR (€) +30</option>
                <option value="AT">🇦🇹 Austria — EUR (€) +43</option>
                <option value="BE">🇧🇪 Belgium — EUR (€) +32</option>
                <option value="CZ">🇨🇿 Czech Republic — CZK (Kč) +420</option>
                <option value="HU">🇭🇺 Hungary — HUF (Ft) +36</option>
                <option value="RO">🇷🇴 Romania — RON (lei) +40</option>
                <option value="BG">🇧🇬 Bulgaria — BGN (лв) +359</option>
                <option value="HR">🇭🇷 Croatia — EUR (€) +385</option>
                <option value="IL">🇮🇱 Israel — ILS (₪) +972</option>
                <option value="NZ">🇳🇿 New Zealand — NZD (NZ$) +64</option>
                <option value="OTHER">🌍 Other / Not Listed</option>
              </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Company Tagline / Value Proposition</label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => updateData({ tagline: e.target.value })}
              className="h-11 w-full rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Employee Range</label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <select
                value={data.employeeRange}
                onChange={(e) => updateData({ employeeRange: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              >
                <option value="1-10 Employees">1 – 10 Employees</option>
                <option value="11-50 Employees">11 – 50 Employees</option>
                <option value="51-200 Employees">51 – 200 Employees</option>
                <option value="201-500 Employees">201 – 500 Employees</option>
                <option value="501-1000 Employees">501 – 1,000 Employees</option>
                <option value="1001-5000 Employees">1,001 – 5,000 Employees</option>
                <option value="5001-10000 Employees">5,001 – 10,000 Employees</option>
                <option value="10000+ Employees">10,000+ Employees</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Annual Revenue Bracket</label>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <select
                value={data.annualRevenue}
                onChange={(e) => updateData({ annualRevenue: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              >
                <option value="Pre-revenue / Startup">Pre-revenue / Startup</option>
                <option value="Up to ₹1 Cr ($0 - $120K)">Up to ₹1 Cr ($0 – $120K)</option>
                <option value="₹1 Cr - ₹10 Cr ($120K - $1.2M)">₹1 Cr – ₹10 Cr ($120K – $1.2M)</option>
                <option value="₹10 Cr - ₹50 Cr ($1.2M - $6M)">₹10 Cr – ₹50 Cr ($1.2M – $6M)</option>
                <option value="₹50 Cr - ₹100 Cr ($6M - $12M)">₹50 Cr – ₹100 Cr ($6M – $12M)</option>
                <option value="₹100 Cr - ₹500 Cr ($12M - $60M)">₹100 Cr – ₹500 Cr ($12M – $60M)</option>
                <option value="₹500 Cr - ₹1000 Cr ($60M - $120M)">₹500 Cr – ₹1000 Cr ($60M – $120M)</option>
                <option value="₹1000 Cr+ ($120M+)">₹1000 Cr+ ($120M+)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Year Established</label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input
                type="text"
                value={data.establishedYear}
                onChange={(e) => updateData({ establishedYear: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Official Website URL</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input
                type="url"
                value={data.website}
                onChange={(e) => updateData({ website: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>
          </div>

          {/* Operating Hours — dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Operating Hours</label>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <select
                value={data.operatingHours}
                onChange={(e) => updateData({ operatingHours: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              >
                <option value="24/7 — Always Open">24/7 — Always Open</option>
                <option value="Mon - Fri: 09:00 AM - 06:00 PM">Mon – Fri: 09:00 AM – 06:00 PM</option>
                <option value="Mon - Fri: 09:00 AM - 07:00 PM IST">Mon – Fri: 09:00 AM – 07:00 PM IST</option>
                <option value="Mon - Fri: 09:00 AM - 05:00 PM">Mon – Fri: 09:00 AM – 05:00 PM</option>
                <option value="Mon - Fri: 10:00 AM - 07:00 PM">Mon – Fri: 10:00 AM – 07:00 PM</option>
                <option value="Mon - Sat: 09:00 AM - 06:00 PM">Mon – Sat: 09:00 AM – 06:00 PM</option>
                <option value="Mon - Sat: 09:00 AM - 08:00 PM">Mon – Sat: 09:00 AM – 08:00 PM</option>
                <option value="Mon - Sun: 09:00 AM - 09:00 PM">Mon – Sun: 09:00 AM – 09:00 PM</option>
                <option value="Sun - Thu: 09:00 AM - 06:00 PM">Sun – Thu: 09:00 AM – 06:00 PM (Middle East)</option>
                <option value="Flexible / By Appointment">Flexible / By Appointment</option>
              </select>
            </div>
          </div>

          {/* Timezone — dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 dark:text-slate-300">Timezone</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <select
                value={data.timezone}
                onChange={(e) => updateData({ timezone: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              >
                <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30) — India</option>
                <option value="Asia/Dubai (GST +04:00)">Asia/Dubai (GST +04:00) — UAE</option>
                <option value="Asia/Singapore (SGT +08:00)">Asia/Singapore (SGT +08:00) — Singapore</option>
                <option value="Asia/Tokyo (JST +09:00)">Asia/Tokyo (JST +09:00) — Japan</option>
                <option value="Asia/Shanghai (CST +08:00)">Asia/Shanghai (CST +08:00) — China</option>
                <option value="Asia/Hong_Kong (HKT +08:00)">Asia/Hong Kong (HKT +08:00)</option>
                <option value="Asia/Bangkok (ICT +07:00)">Asia/Bangkok (ICT +07:00) — Thailand</option>
                <option value="Asia/Karachi (PKT +05:00)">Asia/Karachi (PKT +05:00) — Pakistan</option>
                <option value="Asia/Dhaka (BST +06:00)">Asia/Dhaka (BST +06:00) — Bangladesh</option>
                <option value="Asia/Kathmandu (NPT +05:45)">Asia/Kathmandu (NPT +05:45) — Nepal</option>
                <option value="Asia/Colombo (IST +05:30)">Asia/Colombo (IST +05:30) — Sri Lanka</option>
                <option value="Australia/Sydney (AEDT +11:00)">Australia/Sydney (AEDT +11:00)</option>
                <option value="Australia/Melbourne (AEDT +11:00)">Australia/Melbourne (AEDT +11:00)</option>
                <option value="Pacific/Auckland (NZDT +13:00)">Pacific/Auckland (NZDT +13:00) — New Zealand</option>
                <option value="Europe/London (GMT +00:00)">Europe/London (GMT +00:00) — UK</option>
                <option value="Europe/Paris (CET +01:00)">Europe/Paris (CET +01:00) — France</option>
                <option value="Europe/Berlin (CET +01:00)">Europe/Berlin (CET +01:00) — Germany</option>
                <option value="Europe/Amsterdam (CET +01:00)">Europe/Amsterdam (CET +01:00)</option>
                <option value="Europe/Zurich (CET +01:00)">Europe/Zurich (CET +01:00) — Switzerland</option>
                <option value="Europe/Moscow (MSK +03:00)">Europe/Moscow (MSK +03:00) — Russia</option>
                <option value="America/New_York (EST -05:00)">America/New York (EST -05:00) — USA East</option>
                <option value="America/Chicago (CST -06:00)">America/Chicago (CST -06:00) — USA Central</option>
                <option value="America/Denver (MST -07:00)">America/Denver (MST -07:00) — USA Mountain</option>
                <option value="America/Los_Angeles (PST -08:00)">America/Los Angeles (PST -08:00) — USA West</option>
                <option value="America/Toronto (EST -05:00)">America/Toronto (EST -05:00) — Canada</option>
                <option value="America/Sao_Paulo (BRT -03:00)">America/São Paulo (BRT -03:00) — Brazil</option>
                <option value="America/Mexico_City (CST -06:00)">America/Mexico City (CST -06:00) — Mexico</option>
                <option value="Africa/Cairo (EET +02:00)">Africa/Cairo (EET +02:00) — Egypt</option>
                <option value="Africa/Johannesburg (SAST +02:00)">Africa/Johannesburg (SAST +02:00) — South Africa</option>
                <option value="Africa/Nairobi (EAT +03:00)">Africa/Nairobi (EAT +03:00) — Kenya</option>
              </select>
            </div>
          </div>
        </div>
      </section>


      {/* ─── Social Media Links ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center gap-2.5 pb-4">
          <Link2 className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-base font-bold text-foreground dark:text-white">Social Media Links</h3>
        </div>
        <p className="text-xs text-muted-foreground dark:text-slate-400 mb-4">Add links to your social profiles and online presence.</p>

        {/* Existing social links */}
        <div className="space-y-3">
          {data.socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <span className="inline-flex h-11 w-32 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 px-3 text-xs font-bold text-foreground dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                {link.platform}
              </span>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateSocialLinkUrl(link.id, e.target.value)}
                className="h-11 flex-1 rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeSocialLink(link.id)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-500 dark:border-white/10 dark:text-slate-400 cursor-pointer"
                aria-label="Remove link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new social link */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={newSocialPlatform}
            onChange={(e) => setNewSocialPlatform(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white sm:w-40"
          >
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input
            type="url"
            value={newSocialUrl}
            onChange={(e) => setNewSocialUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSocialLink()}
            placeholder="https://..."
            className="h-11 flex-1 rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
          />
          <button
            type="button"
            onClick={addSocialLink}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Link
          </button>
        </div>
      </section>

      {/* ─── Profile Visibility & Privacy ─── */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
        <div className="flex items-center gap-2.5 pb-4">
          <Lock className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-base font-bold text-foreground dark:text-white">Profile Visibility &amp; Privacy</h3>
        </div>
        <p className="text-xs text-muted-foreground dark:text-slate-400 mb-4">Control who can discover and view your business profile.</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { id: "public" as const, title: "Public", desc: "Visible to all visitors on JOBSONN directory" },
            { id: "network" as const, title: "Verified Network Only", desc: "Only logged-in verified accounts can view" },
            { id: "private" as const, title: "Private / Hidden", desc: "Hidden from public search, only direct links work" },
          ].map((v) => (
            <div
              key={v.id}
              onClick={() => updateData({ profileVisibility: v.id })}
              className={cn(
                "flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all",
                data.profileVisibility === v.id
                  ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30"
                  : "border-border bg-background/80 hover:border-border/80 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-white/20",
              )}
            >
              <div>
                <p className="text-sm font-bold text-foreground dark:text-white">{v.title}</p>
                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">{v.desc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                {data.profileVisibility === v.id && <Check className="h-3.5 w-3.5" />}
                {data.profileVisibility === v.id ? "Selected" : "Click to select"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? "Saving profile..." : "Save Business Profile"}
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
