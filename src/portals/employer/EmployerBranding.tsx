"use client";

import * as React from "react";
import { employers } from "@/lib/mock-data";
import { PageHeader, SectionCard, Card, CardContent } from "@/components/common";
import { AvatarLogo } from "@/components/common/AvatarLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Plus, X, Save, Play, Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

const employer = employers[0];

const initialTestimonials: Testimonial[] = [
  { id: "ts1", name: "Anika Verma", role: "Engineering Manager · 4y at TechCorp", quote: "The engineering culture here is unmatched — I've grown more in 4 years than I thought possible.", rating: 5 },
  { id: "ts2", name: "Rahul Deshpande", role: "Senior Designer · 2y at TechCorp", quote: "Design decisions are respected at the leadership level. Truly a craft-first team.", rating: 5 },
];

export function EmployerBranding() {
  const [banner, setBanner] = React.useState<string | null>(null);
  const [gallery, setGallery] = React.useState<string[]>([]);
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>(initialTestimonials);
  const [whyWork, setWhyWork] = React.useState<string[]>(["Engineer-driven decision making", "Quarterly hackathons", "Stock options for all employees", "Hybrid work, flexible hours"]);
  const [videoUrl, setVideoUrl] = React.useState("");
  const [newWhy, setNewWhy] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const addTestimonial = () => {
    setTestimonials((t) => [...t, { id: `ts_${Date.now()}`, name: "", role: "", quote: "", rating: 5 }]);
  };
  const updateTestimonial = (id: string, patch: Partial<Testimonial>) => {
    setTestimonials((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };
  const removeTestimonial = (id: string) => setTestimonials((t) => t.filter((x) => x.id !== id));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Branding page saved", { description: "Your careers page has been updated." });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employer Branding"
        description="Build your careers page — banner, photos, testimonials, video"
        actions={[
          { label: "Preview", icon: "Eye", variant: "outline", onClick: () => toast.info("Opening careers page preview…") },
          { label: "Save", icon: "Save", onClick: save },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <SectionCard title="Banner image" description="Large hero image at the top of your careers page">
            <div
              className="relative flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 overflow-hidden"
              style={banner ? { backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            >
              {!banner && (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Recommended 1600×400px</p>
                </div>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-3 right-3"
                onClick={() => {
                  const url = `https://picsum.photos/seed/${Math.random().toString(36).slice(2, 8)}/1600/400`;
                  setBanner(url);
                  toast.success("Demo banner applied");
                }}
              >
                <Upload className="mr-2 h-3 w-3" /> {banner ? "Replace" : "Upload"}
              </Button>
            </div>
          </SectionCard>

          {/* Culture gallery */}
          <SectionCard title="Culture photos" description="Show life at your company">
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((src, i) => (
                <div key={i} className="relative aspect-video rounded-md overflow-hidden border">
                  <img src={src} alt={`Culture ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    className="absolute top-1 right-1 rounded-md bg-background/80 p-1 hover:bg-background"
                    onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                className="aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-brand/40 hover:bg-brand/5"
                onClick={() => {
                  const url = `https://picsum.photos/seed/c${Math.random().toString(36).slice(2, 8)}/400/300`;
                  setGallery([...gallery, url]);
                  toast.success("Demo photo added");
                }}
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs mt-1">Add</span>
              </button>
            </div>
          </SectionCard>

          {/* Why work with us */}
          <SectionCard title="Why work with us" description="Top reasons candidates should join">
            <div className="space-y-2">
              {whyWork.map((w, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                  <span className="flex-1">{w}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setWhyWork(whyWork.filter((_, idx) => idx !== i))}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input placeholder="Add a reason…" value={newWhy} onChange={(e) => setNewWhy(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newWhy.trim()) { setWhyWork([...whyWork, newWhy.trim()]); setNewWhy(""); } }} />
                <Button size="icon" onClick={() => { if (newWhy.trim()) { setWhyWork([...whyWork, newWhy.trim()]); setNewWhy(""); } }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Testimonials */}
          <SectionCard
            title="Employee testimonials"
            description="Authentic voices from your team"
            action={<Button size="sm" variant="outline" onClick={addTestimonial}><Plus className="mr-2 h-3 w-3" /> Add</Button>}
          >
            <div className="space-y-3">
              {testimonials.map((t) => (
                <Card key={t.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Quote className="h-5 w-5 text-brand mt-0.5" />
                      <div className="flex-1 space-y-3">
                        <Textarea
                          rows={2}
                          placeholder="What does the employee say?"
                          value={t.quote}
                          onChange={(e) => updateTestimonial(t.id, { quote: e.target.value })}
                          className="border-0 p-0 focus-visible:ring-0 resize-none"
                        />
                        <div className="grid gap-2 sm:grid-cols-2">
                          <Input placeholder="Employee name" value={t.name} onChange={(e) => updateTestimonial(t.id, { name: e.target.value })} />
                          <Input placeholder="Role · tenure" value={t.role} onChange={(e) => updateTestimonial(t.id, { role: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => updateTestimonial(t.id, { rating: s })}>
                              <Star className={`h-4 w-4 ${s <= t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeTestimonial(t.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionCard>

          {/* Video */}
          <SectionCard title="Video embed" description="Culture video or message from leadership">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Paste YouTube/Vimeo URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                <Button variant="outline" onClick={() => toast.info("Video will be embedded on your careers page.")}>Embed</Button>
              </div>
              <div className="aspect-video rounded-md border bg-muted/40 flex items-center justify-center">
                <div className="text-center">
                  <Play className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">{videoUrl ? "Video ready to preview" : "No video embedded yet"}</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SectionCard title="Branding tips">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use authentic photos — avoid stock imagery.</li>
              <li>• Showcase real employees and their stories.</li>
              <li>• Highlight unique benefits and culture rituals.</li>
              <li>• Keep videos under 2 minutes for engagement.</li>
              <li>• Update content quarterly to stay fresh.</li>
            </ul>
          </SectionCard>
          <SectionCard title="Live preview">
            <Card>
              <CardContent className="p-4">
                <div className="h-24 rounded-md bg-gradient-to-br from-brand/30 to-brand/5 flex items-center justify-center mb-3">
                  <AvatarLogo text={employer.logo} size="lg" />
                </div>
                <p className="font-semibold">{employer.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{employer.about}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {whyWork.slice(0, 3).map((w, i) => (
                    <span key={i} className="text-xs rounded-md bg-brand/10 text-brand px-1.5 py-0.5">{w}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </SectionCard>
          <Button className="w-full" onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Save branding"}
          </Button>
        </div>
      </div>
    </div>
  );
}
