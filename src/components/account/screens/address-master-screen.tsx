"use client";

import { useState } from "react";
import {
  MapPin, Building2, Globe, Plus, Trash2, Save, FileText, Landmark, Truck, Pencil, X, Check
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useOrganization, type AddressDetails } from "../organization-context";

interface AddressMasterScreenProps {
  onNavigate?: (sectionId: string) => void;
}

const EMPTY_ADDRESS: AddressDetails = {
  companyName: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pinCode: "",
  landmark: "",
  location: "",
};

// ─── Editable form card (used for Add / Edit flows) ───
function AddressFormCard({
  initial,
  onSave,
  onCancel,
  accentColor,
}: {
  initial: AddressDetails;
  onSave: (address: AddressDetails) => void;
  onCancel: () => void;
  accentColor: "blue" | "amber";
}) {
  const [draft, setDraft] = useState<AddressDetails>(initial);
  const inputCls = "h-10 w-full rounded-lg border border-border bg-background/80 px-3 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white";
  const inputIconCls = "h-10 w-full rounded-lg border border-border bg-background/80 pl-9 pr-3 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white";
  const labelCls = "text-xs font-semibold text-foreground/80 dark:text-slate-300";

  const accentRing = accentColor === "blue" ? "ring-blue-500/30" : "ring-amber-500/30";
  const accentBorder = accentColor === "blue" ? "border-blue-500/40" : "border-amber-500/40";

  const handleSave = () => {
    if (!draft.companyName.trim() || !draft.address.trim() || !draft.city.trim() || !draft.state.trim() || !draft.country.trim() || !draft.pinCode.trim()) {
      toast.error("Please fill in all required address fields.");
      return;
    }
    onSave(draft);
  };

  return (
    <div className={cn("relative rounded-xl border bg-card/80 p-4 shadow-sm ring-1 dark:bg-slate-900/60 dark:shadow-none", accentBorder, accentRing)}>
      <div className="space-y-3">
        {/* Company Name — full width */}
        <div className="space-y-1">
          <label className={labelCls}>Company Name <span className="text-rose-500">*</span></label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
            <input type="text" value={draft.companyName} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} className={inputIconCls} placeholder="Company name" />
          </div>
        </div>
        {/* Address — full width */}
        <div className="space-y-1">
          <label className={labelCls}>Address <span className="text-rose-500">*</span></label>
          <textarea rows={2} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} className="w-full resize-y rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white" placeholder="Street address" />
        </div>
        {/* City / State */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={labelCls}>City <span className="text-rose-500">*</span></label>
            <input type="text" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className={inputCls} placeholder="City" />
          </div>
          <div className="space-y-1">
            <label className={labelCls}>State <span className="text-rose-500">*</span></label>
            <input type="text" value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} className={inputCls} placeholder="State" />
          </div>
        </div>
        {/* Country / Pin Code */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={labelCls}>Country <span className="text-rose-500">*</span></label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input type="text" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} className={inputIconCls} placeholder="Country" />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelCls}>Pin Code <span className="text-rose-500">*</span></label>
            <input type="text" value={draft.pinCode} onChange={(e) => setDraft({ ...draft, pinCode: e.target.value })} className={inputCls} placeholder="Pin code" />
          </div>
        </div>
        {/* Landmark / Location */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={labelCls}>Landmark</label>
            <div className="relative">
              <Landmark className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input type="text" value={draft.landmark} onChange={(e) => setDraft({ ...draft, landmark: e.target.value })} className={inputIconCls} placeholder="Landmark" />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelCls}>Location</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground dark:text-slate-500" />
              <input type="text" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className={inputIconCls} placeholder="Location" />
            </div>
          </div>
        </div>
      </div>

      {/* Save / Cancel actions */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:hover:bg-white/10 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
        >
          <Check className="h-3.5 w-3.5" /> Save Address
        </button>
      </div>
    </div>
  );
}

// ─── Display-only saved address card (with Edit + Delete actions) ───
function AddressDisplayCard({
  address,
  index,
  accentColor,
  badge,
  onEdit,
  onDelete,
}: {
  address: AddressDetails;
  index: number;
  accentColor: "blue" | "amber";
  badge?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const labelCls = "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-slate-500";
  const valueCls = "text-xs font-medium text-foreground dark:text-slate-200 break-words";

  return (
    <div className="relative rounded-xl border border-border bg-card/80 p-4 shadow-sm transition-all hover:border-cyan-500/30 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
      {/* Top-right action buttons */}
      <div className="absolute right-3 top-3 flex items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-400 cursor-pointer"
          aria-label={`Edit address ${index + 1}`}
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/15 cursor-pointer"
          aria-label={`Delete address ${index + 1}`}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Display-only address info (grid view) */}
      <div className="grid grid-cols-1 gap-2">
        <div className="pr-14">
          <p className={labelCls}>Company Name</p>
          <p className={valueCls}>{address.companyName || "—"}</p>
        </div>
        <div>
          <p className={labelCls}>Address</p>
          <p className={valueCls}>{address.address || "—"}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className={labelCls}>City</p>
            <p className={valueCls}>{address.city || "—"}</p>
          </div>
          <div>
            <p className={labelCls}>State</p>
            <p className={valueCls}>{address.state || "—"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className={labelCls}>Country</p>
            <p className={valueCls}>{address.country || "—"}</p>
          </div>
          <div>
            <p className={labelCls}>Pin Code</p>
            <p className={valueCls}>{address.pinCode || "—"}</p>
          </div>
        </div>
        {(address.landmark || address.location) && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className={labelCls}>Landmark</p>
              <p className={valueCls}>{address.landmark || "—"}</p>
            </div>
            <div>
              <p className={labelCls}>Location</p>
              <p className={valueCls}>{address.location || "—"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Add Address card button (dashed) ───
function AddAddressCard({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 py-4 text-sm font-bold text-cyan-600 transition-all hover:border-cyan-500 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed dark:text-cyan-400 cursor-pointer"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

export function AddressMasterScreen({ onNavigate }: AddressMasterScreenProps = {}) {
  const {
    data,
    updateRegisteredAddress,
    addBillingAddressFull,
    updateBillingAddressAt,
    removeBillingAddressAt,
    addShippingAddressFull,
    updateShippingAddressAt,
    removeShippingAddressAt,
    saveData,
    isSaving,
  } = useOrganization();

  // Edit / Add state for Billing
  // editingBillingIndex: null = not editing, -1 = adding new, >=0 = editing existing at that index
  const [editingBillingIndex, setEditingBillingIndex] = useState<number | null>(null);
  const [billingDraft, setBillingDraft] = useState<AddressDetails>(EMPTY_ADDRESS);

  // Edit / Add state for Shipping
  const [editingShippingIndex, setEditingShippingIndex] = useState<number | null>(null);
  const [shippingDraft, setShippingDraft] = useState<AddressDetails>(EMPTY_ADDRESS);

  // ─── Billing handlers ───
  const startAddBilling = () => {
    setBillingDraft({ ...EMPTY_ADDRESS, companyName: data.companyName });
    setEditingBillingIndex(-1);
  };
  const startEditBilling = (index: number) => {
    setBillingDraft({ ...data.billingAddresses[index] });
    setEditingBillingIndex(index);
  };
  const cancelBillingEdit = () => {
    setEditingBillingIndex(null);
    setBillingDraft(EMPTY_ADDRESS);
  };
  const saveBilling = (address: AddressDetails) => {
    if (editingBillingIndex === -1) {
      addBillingAddressFull(address);
      toast.success("Billing address added.");
    } else if (editingBillingIndex !== null) {
      updateBillingAddressAt(editingBillingIndex, address);
      toast.success("Billing address updated.");
    }
    cancelBillingEdit();
  };
  const deleteBilling = (index: number) => {
    removeBillingAddressAt(index);
    toast.success("Billing address deleted.");
    if (editingBillingIndex === index) cancelBillingEdit();
  };

  // ─── Shipping handlers ───
  const startAddShipping = () => {
    setShippingDraft({ ...EMPTY_ADDRESS, companyName: data.companyName });
    setEditingShippingIndex(-1);
  };
  const startEditShipping = (index: number) => {
    setShippingDraft({ ...data.shippingAddresses[index] });
    setEditingShippingIndex(index);
  };
  const cancelShippingEdit = () => {
    setEditingShippingIndex(null);
    setShippingDraft(EMPTY_ADDRESS);
  };
  const saveShipping = (address: AddressDetails) => {
    if (editingShippingIndex === -1) {
      addShippingAddressFull(address);
      toast.success("Shipping address added.");
    } else if (editingShippingIndex !== null) {
      updateShippingAddressAt(editingShippingIndex, address);
      toast.success("Shipping address updated.");
    }
    cancelShippingEdit();
  };
  const deleteShipping = (index: number) => {
    removeShippingAddressAt(index);
    toast.success("Shipping address deleted.");
    if (editingShippingIndex === index) cancelShippingEdit();
  };

  return (
    <div className="space-y-6">
      {/* ─── 1. Registered Address (single, editable) ─── */}
      <div>
        <AddressFormCard
          initial={data.registeredAddress}
          onSave={(address) => { updateRegisteredAddress(address); toast.success("Registered address saved."); }}
          onCancel={() => { /* Registered is always editable, no cancel */ }}
          accentColor="blue"
        />
      </div>

      {/* ─── 2. Billing & Shipping Addresses (side-by-side, grid of saved cards) ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ───── Billing column ───── */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-foreground dark:text-white">Billing Addresses</h3>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Saved billing addresses for invoices and payments</p>
            </div>
          </div>

          {/* Grid of saved billing address cards */}
          {data.billingAddresses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {data.billingAddresses.map((addr, i) => (
                editingBillingIndex === i ? (
                  <AddressFormCard
                    key={`billing-edit-${i}`}
                    initial={billingDraft}
                    onSave={saveBilling}
                    onCancel={cancelBillingEdit}
                    accentColor="blue"
                  />
                ) : (
                  <AddressDisplayCard
                    key={`billing-${i}`}
                    address={addr}
                    index={i}
                    accentColor="blue"
                    badge={i === 0 ? "Primary" : undefined}
                    onEdit={() => startEditBilling(i)}
                    onDelete={() => deleteBilling(i)}
                  />
                )
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground dark:border-white/10 dark:text-slate-400">
              No billing addresses yet. Click below to add one.
            </div>
          )}

          {/* Add new billing form (when adding) */}
          {editingBillingIndex === -1 && (
            <div className="mt-4">
              <AddressFormCard
                initial={billingDraft}
                onSave={saveBilling}
                onCancel={cancelBillingEdit}
                accentColor="blue"
              />
            </div>
          )}

          {/* Add Billing button (hidden while editing/adding) */}
          {editingBillingIndex === null && (
            <div className="mt-4">
              <AddAddressCard label="Add Billing Address" onClick={startAddBilling} />
            </div>
          )}
        </div>

        {/* ───── Shipping column ───── */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-foreground dark:text-white">Shipping Addresses</h3>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Saved shipping addresses for delivery of goods</p>
            </div>
          </div>

          {/* Grid of saved shipping address cards */}
          {data.shippingAddresses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {data.shippingAddresses.map((addr, i) => (
                editingShippingIndex === i ? (
                  <AddressFormCard
                    key={`shipping-edit-${i}`}
                    initial={shippingDraft}
                    onSave={saveShipping}
                    onCancel={cancelShippingEdit}
                    accentColor="amber"
                  />
                ) : (
                  <AddressDisplayCard
                    key={`shipping-${i}`}
                    address={addr}
                    index={i}
                    accentColor="amber"
                    badge={i === 0 ? "Primary" : undefined}
                    onEdit={() => startEditShipping(i)}
                    onDelete={() => deleteShipping(i)}
                  />
                )
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground dark:border-white/10 dark:text-slate-400">
              No shipping addresses yet. Click below to add one.
            </div>
          )}

          {/* Add new shipping form (when adding) */}
          {editingShippingIndex === -1 && (
            <div className="mt-4">
              <AddressFormCard
                initial={shippingDraft}
                onSave={saveShipping}
                onCancel={cancelShippingEdit}
                accentColor="amber"
              />
            </div>
          )}

          {/* Add Shipping button (hidden while editing/adding) */}
          {editingShippingIndex === null && (
            <div className="mt-4">
              <AddAddressCard label="Add Shipping Address" onClick={startAddShipping} />
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={async () => {
            await saveData("Address master");
            onNavigate?.("company-info");
          }}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Address Master"}
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
