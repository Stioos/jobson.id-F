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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/format";

type MethodType = "Credit Card" | "Debit Card" | "UPI" | "Net Banking" | "Bank Account";

interface PaymentMethod {
  id: string;
  type: MethodType;
  masked: string;
  name: string;
  expiry?: string;
  upiId?: string;
  bank?: string;
  default: boolean;
  addedOn: string;
}

const SEED_METHODS: PaymentMethod[] = [
  { id: "pm_1", type: "Credit Card", masked: "•••• •••• •••• 4291", name: "Aarav Sharma", expiry: "08/27", default: true, addedOn: "2024-08-12" },
  { id: "pm_2", type: "UPI", masked: "aarav.s@okhdfcbank", name: "Aarav Sharma", upiId: "aarav.s@okhdfcbank", default: false, addedOn: "2024-09-03" },
  { id: "pm_3", type: "Debit Card", masked: "•••• •••• •••• 8821", name: "Aarav Sharma", expiry: "11/26", default: false, addedOn: "2024-07-21" },
  { id: "pm_4", type: "Net Banking", masked: "HDFC Bank ••••2210", name: "Aarav Sharma", bank: "HDFC Bank", default: false, addedOn: "2024-06-15" },
  { id: "pm_5", type: "Bank Account", masked: "ICICI •••• 7752 (IFSC: ICIC0001234)", name: "Aarav Sharma", bank: "ICICI Bank", default: false, addedOn: "2024-05-08" },
];

const TYPE_ICON: Record<MethodType, string> = {
  "Credit Card": "CreditCard",
  "Debit Card": "CreditCard",
  "UPI": "Smartphone",
  "Net Banking": "Landmark",
  "Bank Account": "Landmark",
};

export function CandidatePaymentMethods() {
  const [methods, setMethods] = React.useState<PaymentMethod[]>(SEED_METHODS);
  const [cardOpen, setCardOpen] = React.useState(false);
  const [upiOpen, setUpiOpen] = React.useState(false);
  const [card, setCard] = React.useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upi, setUpi] = React.useState({ id: "", name: "" });

  const setDefault = (id: string) => {
    setMethods((ms) => ms.map((m) => ({ ...m, default: m.id === id })));
    toast.success("Default payment method updated");
  };
  const remove = (id: string) => {
    setMethods((ms) => ms.filter((m) => m.id !== id));
    toast.success("Payment method removed");
  };
  const addCard = () => {
    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      toast.error("Please fill in all card details");
      return;
    }
    const last4 = card.number.replace(/\s/g, "").slice(-4);
    setMethods((ms) => [
      { id: `pm_${Date.now()}`, type: "Credit Card", masked: `•••• •••• •••• ${last4}`, name: card.name, expiry: card.expiry, default: false, addedOn: new Date().toISOString() },
      ...ms,
    ]);
    setCard({ number: "", name: "", expiry: "", cvv: "" });
    setCardOpen(false);
    toast.success("Credit card added successfully");
  };
  const addUpi = () => {
    if (!upi.id || !upi.name) {
      toast.error("Please enter a valid UPI ID");
      return;
    }
    setMethods((ms) => [
      { id: `pm_${Date.now()}`, type: "UPI", masked: upi.id, name: upi.name, upiId: upi.id, default: false, addedOn: new Date().toISOString() },
      ...ms,
    ]);
    setUpi({ id: "", name: "" });
    setUpiOpen(false);
    toast.success("UPI ID added successfully");
  };

  const defaultCount = methods.filter((m) => m.default).length;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Payment Methods"
        description="Manage saved cards, UPI IDs, and bank accounts used for subscription and one-time payments."
        icon={<Icon name="CreditCard" className="h-6 w-6" />}
        actions={[
          {
            label: "Add Card",
            variant: "default",
            onClick: () => setCardOpen(true),
          },
          {
            label: "Add UPI",
            variant: "outline",
            onClick: () => setUpiOpen(true),
          },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Saved Methods" value={methods.length} icon={<Icon name="CreditCard" className="h-5 w-5" />} tone="brand" />
        <StatCard label="Default Set" value={defaultCount > 0 ? "Yes" : "No"} icon={<Icon name="BadgeCheck" className="h-5 w-5" />} tone="success" />
        <StatCard label="Cards" value={methods.filter((m) => m.type.includes("Card")).length} icon={<Icon name="CreditCard" className="h-5 w-5" />} tone="default" />
        <StatCard label="UPI / Bank" value={methods.filter((m) => m.type === "UPI" || m.type === "Bank Account").length} icon={<Icon name="Landmark" className="h-5 w-5" />} tone="default" />
      </div>

      <SectionCard title="Saved Payment Methods" description="All stored instruments. PCI-DSS compliant vault tokenization.">
        {methods.length === 0 ? (
          <EmptyState icon={<Icon name="CreditCard" className="h-6 w-6" />} title="No payment methods saved" description="Add a card or UPI to enable faster checkout." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {methods.map((m) => (
              <Card key={m.id} className="overflow-hidden border-brand/15">
                <CardHeader className="flex-row items-start justify-between space-y-0 bg-brand/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon name={TYPE_ICON[m.type]} className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{m.type}</CardTitle>
                      <p className="mt-0.5 text-xs text-muted-foreground">Added on {formatDate(m.addedOn)}</p>
                    </div>
                  </div>
                  {m.default && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Default</Badge>}
                </CardHeader>
                <CardContent className="space-y-2 pt-4">
                  <div className="font-mono text-sm font-medium tracking-wide">{m.masked}</div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>Name: <span className="text-foreground">{m.name}</span></span>
                    {m.expiry && <span>Expiry: <span className="text-foreground">{m.expiry}</span></span>}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    {!m.default && (
                      <Button size="sm" variant="outline" onClick={() => setDefault(m.id)}>
                        Set Default
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => remove(m.id)}>
                      <Icon name="Trash2" className="mr-1 h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Security & Privacy" description="How we protect your payment information.">
        <ul className="grid gap-3 text-sm sm:grid-cols-2">
          <li className="flex items-start gap-2">
            <Icon name="ShieldCheck" className="mt-0.5 h-4 w-4 text-brand" />
            <span>Card numbers are tokenized via PCI-DSS Level 1 compliant vault. We never store raw PAN or CVV.</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Lock" className="mt-0.5 h-4 w-4 text-brand" />
            <span>256-bit TLS encryption for all transactions. 3D Secure 2.0 enforced on every card payment.</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Fingerprint" className="mt-0.5 h-4 w-4 text-brand" />
            <span>Biometric or device PIN required for UPI autopay mandates above ₹2,000.</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 text-amber-600" />
            <span>Never share OTP, CVV, or UPI PIN. JOBSONN will never ask for these over call or email.</span>
          </li>
        </ul>
      </SectionCard>

      {/* Add card dialog */}
      <Dialog open={cardOpen} onOpenChange={setCardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Credit / Debit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="card-num">Card Number</Label>
              <Input id="card-num" placeholder="4111 1111 1111 1111" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="card-name">Name on Card</Label>
              <Input id="card-name" placeholder="Aarav Sharma" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="card-exp">Expiry (MM/YY)</Label>
                <Input id="card-exp" placeholder="08/27" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="card-cvv">CVV</Label>
                <Input id="card-cvv" type="password" placeholder="•••" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCardOpen(false)}>Cancel</Button>
            <Button onClick={addCard}>Save Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add UPI dialog */}
      <Dialog open={upiOpen} onOpenChange={setUpiOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add UPI ID</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="upi-id">UPI ID</Label>
              <Input id="upi-id" placeholder="yourname@okhdfcbank" value={upi.id} onChange={(e) => setUpi({ ...upi, id: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="upi-name">Registered Name</Label>
              <Input id="upi-name" placeholder="Aarav Sharma" value={upi.name} onChange={(e) => setUpi({ ...upi, name: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpiOpen(false)}>Cancel</Button>
            <Button onClick={addUpi}>Verify & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
