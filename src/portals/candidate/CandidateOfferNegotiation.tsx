"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";

type MsgType = "Message" | "Counter-offer" | "Accept" | "Reject";
type Sender = "candidate" | "employer";
type NegotiationStage = "Offer Received" | "Counter Sent" | "Counter Reviewed" | "Agreement" | "Accepted";

interface Terms {
  base: number; // annual in INR
  bonus: number; // annual % of base
  esops: string;
  joiningBonus: number;
}

interface Msg {
  id: string;
  sender: Sender;
  type: MsgType;
  text?: string;
  ts: string;
  original?: Terms;
  proposed?: Terms;
}

interface Negotiation {
  id: string;
  company: string;
  role: string;
  stage: NegotiationStage;
  current: Terms;
  messages: Msg[];
}

const now = Date.now();
const HR = 3600000;

const STAGES: NegotiationStage[] = ["Offer Received", "Counter Sent", "Counter Reviewed", "Agreement", "Accepted"];

const NEGOTIATIONS: Negotiation[] = [
  {
    id: "n1", company: "TechCorp India", role: "Senior Frontend Engineer", stage: "Counter Reviewed",
    current: { base: 3600000, bonus: 10, esops: "₹6L vested over 4 yrs", joiningBonus: 100000 },
    messages: [
      { id: "m1", sender: "employer", type: "Message", ts: new Date(now - 72 * HR).toISOString(), text: "Hi Priya, we're delighted to extend an offer. Please find the terms below." },
      { id: "m2", sender: "employer", type: "Counter-offer", ts: new Date(now - 72 * HR).toISOString(), original: { base: 3400000, bonus: 10, esops: "₹4L vested over 4 yrs", joiningBonus: 50000 } },
      { id: "m3", sender: "candidate", type: "Counter-offer", ts: new Date(now - 48 * HR).toISOString(), original: { base: 3400000, bonus: 10, esops: "₹4L vested over 4 yrs", joiningBonus: 50000 }, proposed: { base: 3800000, bonus: 15, esops: "₹8L vested over 4 yrs", joiningBonus: 150000 }, text: "Thank you! Given my competing offer and 6 years of experience, I'd like to propose the following." },
      { id: "m4", sender: "employer", type: "Message", ts: new Date(now - 24 * HR).toISOString(), text: "Thanks Priya. We can meet you at 36L base + 10% bonus + 6L ESOPs + 1L joining bonus. This is our best offer." },
      { id: "m5", sender: "employer", type: "Counter-offer", ts: new Date(now - 24 * HR).toISOString(), proposed: { base: 3600000, bonus: 10, esops: "₹6L vested over 4 yrs", joiningBonus: 100000 } },
    ],
  },
  {
    id: "n2", company: "FinEdge", role: "Product Engineer", stage: "Counter Sent",
    current: { base: 3200000, bonus: 12, esops: "₹3L vested over 4 yrs", joiningBonus: 75000 },
    messages: [
      { id: "m1", sender: "employer", type: "Counter-offer", ts: new Date(now - 48 * HR).toISOString(), original: { base: 3200000, bonus: 12, esops: "₹3L vested over 4 yrs", joiningBonus: 75000 } },
      { id: "m2", sender: "candidate", type: "Counter-offer", ts: new Date(now - 12 * HR).toISOString(), original: { base: 3200000, bonus: 12, esops: "₹3L vested over 4 yrs", joiningBonus: 75000 }, proposed: { base: 3500000, bonus: 15, esops: "₹5L vested over 4 yrs", joiningBonus: 100000 } },
    ],
  },
  {
    id: "n3", company: "Brightwave Labs", role: "Frontend Engineer", stage: "Offer Received",
    current: { base: 2800000, bonus: 8, esops: "₹2L vested over 4 yrs", joiningBonus: 0 },
    messages: [
      { id: "m1", sender: "employer", type: "Counter-offer", ts: new Date(now - 6 * HR).toISOString(), original: { base: 2800000, bonus: 8, esops: "₹2L vested over 4 yrs", joiningBonus: 0 } },
    ],
  },
];

const TIPS = [
  "Always anchor higher than your target — negotiations tend to settle in the middle.",
  "Negotiate the full package (base, bonus, ESOPs, joining bonus), not just base.",
  "Use competing offers as leverage, but never bluff — be ready to walk away.",
  "Get the final agreed terms in writing before formally accepting.",
  "Ask about ESOP vesting schedule and exercise window — these matter long-term.",
  "Be respectful and collaborative — you'll be working with these people.",
];

function fmtTime(s: string) {
  return new Date(s).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function CandidateOfferNegotiation() {
  const [negs, setNegs] = React.useState<Negotiation[]>(NEGOTIATIONS);
  const [activeId, setActiveId] = React.useState<string>(NEGOTIATIONS[0].id);
  const [draft, setDraft] = React.useState("");
  const [cBase, setCBase] = React.useState("");
  const [cBonus, setCBonus] = React.useState("");
  const [cEsops, setCEsops] = React.useState("");
  const [cJoin, setCJoin] = React.useState("");
  const [showCounter, setShowCounter] = React.useState(false);

  const active = negs.find((n) => n.id === activeId) ?? negs[0];
  const stageIdx = STAGES.indexOf(active.stage);

  const addMessage = (type: MsgType, text?: string, proposed?: Terms) => {
    const newMsg: Msg = { id: `m${Date.now()}`, sender: "candidate", type, text, ts: new Date().toISOString(), proposed };
    setNegs((prev) => prev.map((n) => n.id === active.id ? { ...n, messages: [...n.messages, newMsg], stage: type === "Accept" ? "Accepted" : type === "Counter-offer" ? "Counter Sent" : n.stage } : n));
    if (type === "Accept") toast.success("Offer accepted", { description: `Congratulations! You've accepted ${active.company}'s offer.` });
    else if (type === "Reject") toast.info("Offer declined", { description: `We've notified ${active.company}.` });
    else if (type === "Counter-offer") toast.success("Counter-offer sent", { description: `${active.company} will respond shortly.` });
    else toast.success("Message sent");
    setDraft(""); setShowCounter(false); setCBase(""); setCBonus(""); setCEsops(""); setCJoin("");
  };

  const sendCounter = () => {
    const base = Number(cBase);
    const bonus = Number(cBonus);
    const join = Number(cJoin);
    if (!base || !bonus) { toast.error("Base salary and bonus % are required"); return; }
    const proposed: Terms = { base, bonus, esops: cEsops || "—", joiningBonus: join || 0 };
    addMessage("Counter-offer", draft, proposed);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offer Negotiation"
        description="Negotiate your offer with employers through structured threads. Track counter-offers, terms and agreement status in one place."
        icon={<Icon name="MessagesSquare" className="h-6 w-6" />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active negotiations" value={negs.length} icon={<Icon name="MessagesSquare" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Counter-offers sent" value={negs.reduce((a, n) => a + n.messages.filter((m) => m.type === "Counter-offer" && m.sender === "candidate").length, 0)} icon={<Icon name="Send" className="h-4 w-4" />} tone="brand" />
        <StatCard label="Accepted" value={negs.filter((n) => n.stage === "Accepted").length} icon={<Icon name="CheckCircle2" className="h-4 w-4" />} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Offer selector */}
        <SectionCard title="Your offers" description="Select to view thread">
          <div className="space-y-2 max-h-[480px] overflow-y-auto scroll-thin pr-1">
            {negs.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveId(n.id)}
                className={`w-full rounded-lg border p-3 text-left transition ${n.id === active.id ? "border-brand bg-brand/5" : "border-border hover:border-brand/40"}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{n.company}</p>
                  <Badge variant="outline" className="text-[10px]">{n.stage}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.role}</p>
                <p className="mt-1.5 text-xs font-semibold text-brand">{formatCurrency(n.current.base)}/yr</p>
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Active negotiation */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">{active.company} — {active.role}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Current terms · {formatCurrency(active.current.base)} base + {active.current.bonus}% bonus</p>
              </div>
              <Badge className="bg-brand/10 text-brand">{active.stage}</Badge>
            </CardHeader>
            <CardContent>
              {/* Stage timeline */}
              <div className="flex items-center justify-between gap-2">
                {STAGES.map((s, i) => (
                  <div key={s} className="flex flex-1 flex-col items-center text-center">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${i <= stageIdx ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {i < stageIdx ? <Icon name="Check" className="h-3 w-3" /> : i + 1}
                    </div>
                    <span className={`mt-1 text-[10px] ${i <= stageIdx ? "font-medium text-brand" : "text-muted-foreground"}`}>{s}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <SectionCard title="Conversation" description={`${active.messages.length} messages`}>
            <div className="space-y-3 max-h-[420px] overflow-y-auto scroll-thin pr-1">
              {active.messages.map((m) => {
                const me = m.sender === "candidate";
                return (
                  <div key={m.id} className={`flex ${me ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl p-3 ${me ? "bg-brand text-primary-foreground" : "bg-muted"}`}>
                      <div className="flex items-center gap-2 text-[10px] opacity-80">
                        <span className="font-medium">{me ? "You" : active.company}</span>
                        <span>·</span>
                        <span>{fmtTime(m.ts)}</span>
                      </div>
                      {m.type !== "Message" && (
                        <Badge className={`mt-1 ${me ? "bg-primary-foreground/20 text-primary-foreground" : "bg-brand/10 text-brand"}`}>{m.type}</Badge>
                      )}
                      {m.text && <p className="mt-1.5 text-sm">{m.text}</p>}
                      {m.type === "Counter-offer" && m.proposed && (
                        <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-primary-foreground/10 p-2 text-[11px]">
                          <div><span className="opacity-70">Base:</span> <span className="font-semibold">{formatCurrency(m.proposed.base)}</span></div>
                          <div><span className="opacity-70">Bonus:</span> <span className="font-semibold">{m.proposed.bonus}%</span></div>
                          <div><span className="opacity-70">ESOPs:</span> <span className="font-semibold">{m.proposed.esops}</span></div>
                          <div><span className="opacity-70">Joining:</span> <span className="font-semibold">{formatCurrency(m.proposed.joiningBonus)}</span></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {active.stage === "Accepted" ? (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-4 text-center">
                <Icon name="CheckCircle2" className="mx-auto h-8 w-8 text-emerald-600" />
                <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">Offer accepted — congrats!</p>
              </CardContent>
            </Card>
          ) : (
            <SectionCard title="Reply" description="Send a message or counter-offer">
              <div className="space-y-3">
                <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type your message…" rows={3} />
                {!showCounter ? (
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => addMessage("Message", draft || undefined)} disabled={!draft.trim()}>
                      <Icon name="Send" className="mr-1.5 h-3.5 w-3.5" /> Send message
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowCounter(true)}>
                      <Icon name="Scale" className="mr-1.5 h-3.5 w-3.5" /> Send counter-offer
                    </Button>
                    <Button size="sm" variant="outline" className="text-emerald-600" onClick={() => addMessage("Accept", "I'm happy to accept the current terms.")}>
                      <Icon name="CheckCircle2" className="mr-1.5 h-3.5 w-3.5" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="text-rose-600" onClick={() => addMessage("Reject", "Unfortunately I'll have to decline this offer.")}>
                      <Icon name="X" className="mr-1.5 h-3.5 w-3.5" /> Decline
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 rounded-lg border p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Base (₹/yr)</Label>
                        <Input type="number" value={cBase} onChange={(e) => setCBase(e.target.value)} placeholder="3600000" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Bonus (%)</Label>
                        <Input type="number" value={cBonus} onChange={(e) => setCBonus(e.target.value)} placeholder="15" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">ESOPs</Label>
                        <Input value={cEsops} onChange={(e) => setCEsops(e.target.value)} placeholder="₹6L vested over 4 yrs" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Joining bonus (₹)</Label>
                        <Input type="number" value={cJoin} onChange={(e) => setCJoin(e.target.value)} placeholder="100000" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setShowCounter(false)}>Cancel</Button>
                      <Button size="sm" onClick={sendCounter}>Send counter-offer</Button>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      <SectionCard title="Negotiation tips" description="Field-tested advice from senior recruiters" action={<Badge className="bg-amber-500/10 text-amber-600"><Icon name="Lightbulb" className="mr-1 h-3 w-3" /> Tips</Badge>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map((t, i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                <p className="text-xs text-muted-foreground">{t}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
