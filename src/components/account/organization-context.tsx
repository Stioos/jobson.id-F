"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { getStoredUser } from "@/lib/auth-store";

export interface AddressDetails {
  companyName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  landmark: string;
  location: string;
}

export interface OrganizationData {
  // Brand Assets & Imagery
  logoUrl: string | null;
  bannerUrl: string | null;

  // Company / Organization Identity
  companyName: string;
  tradeName: string;
  businessType: string;
  natureOfBusiness: string;
  tagline: string;
  employeeRange: string;
  annualRevenue: string;
  establishedYear: string;
  website: string;
  country: string;
  businessSize: string;
  // Nature of Business (multi-select checkbox group)
  natureOfBusinessTypes: string[];
  // Geographical Service Area (multi-select checkbox group)
  geographicalServiceAreas: string[];
  // Supply Capabilities (multi-select checkbox group)
  supplyCapabilities: string[];
  // Countries served (multi-select, shown when International / Worldwide is selected)
  servedCountries: string[];

  // Company & Billing Addresses
  companyAddress: AddressDetails;
  billingAddress: AddressDetails;
  billingSameAsCompany: boolean;

  // Facilities, Location & Markets
  headquarters: string;
  marketsServed: string;
  operatingHours: string;
  timezone: string;
  isExporting: boolean;
  // Structured facility / plant address
  facilityAddress: AddressDetails;

  // Social Media Links (business profile)
  socialLinks: { id: string; platform: string; url: string }[];
  // Profile Visibility
  profileVisibility: "public" | "network" | "private";

  // Address Master — Registered, Billing (multiple), Shipping (multiple)
  registeredAddress: AddressDetails;
  billingAddresses: AddressDetails[];
  shippingAddresses: AddressDetails[];

  // Legal & Tax Information — GST API fields
  gstin: string;
  pan: string;
  taxpayerType: string;
  taxJurisdiction: string;
  gstLegalName: string;
  isGstinVerified: boolean;
  registrationDate: string;
  principalAddress: string;
  natureOfTaxBusiness: string;
  // Additional GST API response fields (from GSTN Master Registry)
  gstStatus: string;          // sts — Active / Cancelled / Suspended / Provisional
  gstConstitution: string;   // ctb — Private Limited / Proprietorship / LLP etc.
  gstTradeName: string;       // tradeNam
  centreJurisdiction: string; // ctj
  stateJurisdictionCode: string; // stjCd
  centreJurisdictionCode: string; // ctjCd
  gstStateJurisdiction: string;  // stj (distinct from taxJurisdiction free text)
  additionalPlacesOfBusiness: string; // adadr (joined)
  fieldVisitConducted: string;   // isFieldVisitConducted — Yes/No
  cancellationDate: string;      // cxdt
  aadhaarAuthStatus: string;      // Aadhaar Authentication Status
  einvoiceApplicable: string;     // e-Invoice applicability — Yes/No
  gstComplianceScore: string;     // GST Compliance Rating (0–10)
  lastGstr1Filed: string;         // Latest GSTR-1 filing period
  lastGstr3bFiled: string;        // Latest GSTR-3B filing period

  // Legal & Tax Information — CIN (Corporate Identity Number) API fields (MCA)
  cin: string;                     // Corporate Identification Number (21-char)
  isCinVerified: boolean;
  cinCompanyName: string;          // Legal company name from MCA
  cinStatus: string;               // Active / Dormant / Struck off / Under liquidation
  companyClass: string;            // Public / Private / OPC
  companyCategory: string;         // Company limited by shares / guarantee / unlimited
  companySubCategory: string;      // Non-govt / Union Govt / State Govt / Subsidiary of Foreign Company
  incorporationDate: string;       // Date of incorporation
  incorporationCountry: string;    // Country of incorporation (India)
  registeredState: string;         // Registered state
  rocCode: string;                  // Registrar of Companies code (e.g. RoC-Bangalore)
  authorizedCapital: string;       // Authorized capital (INR)
  paidUpCapital: string;            // Paid-up capital (INR)
  registeredOfficeAddress: string; // Full registered office address
  companyEmail: string;            // Company email from MCA records
  whetherListed: string;           // Listed on stock exchange — Yes/No
  lastAgmDate: string;             // Last Annual General Meeting date
  lastBalanceSheetDate: string;    // Last balance sheet date
  numberOfDirectors: string;       // Count of current directors
  principalBusinessActivityCode: string; // NIC-2008 code
  principalBusinessActivity: string;     // NIC activity description
  registrationNumber: string;      // MCA registration number

  // ─── Business Legal Identity (Section A) ───
  legalBusinessName: string;
  legalEntityType: string;
  dateOfIncorporation: string;
  businessRegistrationNumber: string;
  registrationAuthority: string;
  registrationStatus: string;

  // ─── Tax Information (Section B) ───
  panHolderName: string;
  gstRegistrationStatus: string;
  gstRegistrationState: string;
  gstBusinessConstitution: string;
  otherTaxRegistrations: { id: string; type: string; number: string; status: string }[];

  // ─── Ownership & Authorization (Section C) ───
  authorizedRepName: string;
  authorizedRepDesignation: string;
  authorizedRepRelationship: string;
  authorizedRepType: string;
  authorizationStatus: string;

  // ─── Government Registrations & Licences (Section D) ───
  govRegistrations: {
    id: string;
    type: string;
    registrationNumber: string;
    issuingAuthority: string;
    validity: string;
    status: string;
  }[];

  // ─── Bank Verification (Section E) ───
  bankAccountHolderName: string;
  bankAccountType: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankVerificationStatus: string;

  // ─── Verification Status (Section G) ───
  overallVerificationStatus: string;
  verificationLevel: number;
}

export const DEFAULT_ORGANIZATION_DATA: OrganizationData = {
  logoUrl: null,
  bannerUrl: null,
  companyName: "jobson.id Tech & AI Services",
  tradeName: "jobson.id Enterprise Solutions",
  businessType: "Private Limited Company",
  natureOfBusiness: "B2B",
  tagline: "Accelerating Enterprise Digital Transformation & Industrial AI",
  employeeRange: "51-200 Employees",
  annualRevenue: "₹10 Cr - ₹50 Cr ($1.2M - $6M)",
  establishedYear: "2018",
  website: "https://jobson.id",
  country: "IN",
  businessSize: "Medium",
  // Nature of Business (multi-select)
  natureOfBusinessTypes: ["Manufacturing & Production", "Trading & Merchandising", "Professional & Business Services"],
  // Geographical Service Area (multi-select)
  geographicalServiceAreas: ["Local", "Regional", "National", "International"],
  // Supply Capabilities (multi-select)
  supplyCapabilities: ["Products & Materials", "Professional Services", "Consulting & Advisory", "Projects & Execution", "Logistics & Transportation"],
  // Countries served (multi-select) — default sample
  servedCountries: ["India", "United States", "Singapore", "United Arab Emirates"],
  companyAddress: {
    companyName: "jobson.id Tech & AI Services",
    address: "Brigade Tech Gardens, 4th Floor, Tower B, Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    pinCode: "560066",
    landmark: "Near Kundalahalli Metro Station",
    location: "Bengaluru East, Karnataka, India",
  },
  billingAddress: {
    companyName: "jobson.id Tech & AI Services",
    address: "Brigade Tech Gardens, 4th Floor, Tower B, Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    pinCode: "560066",
    landmark: "Near Kundalahalli Metro Station",
    location: "Bengaluru East, Karnataka, India",
  },
  billingSameAsCompany: true,
  headquarters: "Brigade Tech Gardens, Whitefield, Bengaluru 560066",
  marketsServed: "India, North America, Southeast Asia, Middle East",
  operatingHours: "Mon - Fri: 09:00 AM - 07:00 PM IST",
  timezone: "Asia/Kolkata (IST +05:30)",
  isExporting: true,
  facilityAddress: {
    companyName: "jobson.id Tech & AI Services",
    address: "Brigade Tech Gardens, 4th Floor, Tower B, Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    pinCode: "560066",
    landmark: "Near Kundalahalli Metro Station",
    location: "Bengaluru East, Karnataka, India",
  },
  // Social Media Links (business profile) — default sample
  socialLinks: [
    { id: "sl1", platform: "LinkedIn", url: "https://linkedin.com/company/jobson.id" },
    { id: "sl2", platform: "X (Twitter)", url: "https://x.com/jobson.id" },
    { id: "sl3", platform: "GitHub", url: "https://github.com/jobson.id" },
  ],
  // Profile Visibility
  profileVisibility: "public",

  // Address Master — defaults
  registeredAddress: {
    companyName: "jobson.id Tech & AI Services",
    address: "Brigade Tech Gardens, 4th Floor, Tower B, Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    pinCode: "560066",
    landmark: "Near Kundalahalli Metro Station",
    location: "Bengaluru East, Karnataka, India",
  },
  billingAddresses: [
    {
      companyName: "jobson.id Tech & AI Services",
      address: "Brigade Tech Gardens, 4th Floor, Tower B, Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      pinCode: "560066",
      landmark: "Near Kundalahalli Metro Station",
      location: "Bengaluru East, Karnataka, India",
    },
  ],
  shippingAddresses: [
    {
      companyName: "jobson.id Tech & AI Services",
      address: "RMZ Infinity, Old Madras Road, Bennigana Halli",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      pinCode: "560016",
      landmark: "Near Bennigana Halli Metro",
      location: "Bengaluru East, Karnataka, India",
    },
  ],
  gstin: "29ABCDE1234F1Z5",
  pan: "ABCDE1234F",
  taxpayerType: "Regular",
  taxJurisdiction: "Ward 42, Bengaluru East, Karnataka",
  gstLegalName: "jobson.id TECHNOLOGIES PRIVATE LIMITED",
  isGstinVerified: false,
  registrationDate: "14-Mar-2018",
  principalAddress: "Brigade Tech Gardens, 4th Floor, Tower B, Whitefield, Bengaluru, Karnataka, 560066",
  natureOfTaxBusiness: "Software Publishing, AI Consultancy, High-Tech Industrial SaaS Solutions",
  // GST API response fields (populated after Fetch & Verify GSTIN)
  gstStatus: "",
  gstConstitution: "",
  gstTradeName: "",
  centreJurisdiction: "",
  stateJurisdictionCode: "",
  centreJurisdictionCode: "",
  gstStateJurisdiction: "",
  additionalPlacesOfBusiness: "",
  fieldVisitConducted: "",
  cancellationDate: "",
  aadhaarAuthStatus: "",
  einvoiceApplicable: "",
  gstComplianceScore: "",
  lastGstr1Filed: "",
  lastGstr3bFiled: "",
  // CIN API response fields (populated after Fetch & Verify CIN)
  cin: "U72200KA2018PTC112233",
  isCinVerified: false,
  cinCompanyName: "",
  cinStatus: "",
  companyClass: "",
  companyCategory: "",
  companySubCategory: "",
  incorporationDate: "",
  incorporationCountry: "",
  registeredState: "",
  rocCode: "",
  authorizedCapital: "",
  paidUpCapital: "",
  registeredOfficeAddress: "",
  companyEmail: "",
  whetherListed: "",
  lastAgmDate: "",
  lastBalanceSheetDate: "",
  numberOfDirectors: "",
  principalBusinessActivityCode: "",
  principalBusinessActivity: "",
  registrationNumber: "",

  // ─── Business Legal Identity defaults (Section A) ───
  legalBusinessName: "jobson.id TECHNOLOGIES PRIVATE LIMITED",
  legalEntityType: "Private Limited Company",
  dateOfIncorporation: "14-03-2018",
  businessRegistrationNumber: "U72200KA2018PTC112233",
  registrationAuthority: "Registrar of Companies (RoC Bangalore)",
  registrationStatus: "Active",

  // ─── Tax Information defaults (Section B) ───
  panHolderName: "jobson.id TECHNOLOGIES PRIVATE LIMITED",
  gstRegistrationStatus: "Registered",
  gstRegistrationState: "Karnataka (29)",
  gstBusinessConstitution: "Private Limited Company",
  otherTaxRegistrations: [
    { id: "tr1", type: "TAN", number: "BLRW12345A", status: "Verified" },
  ],

  // ─── Ownership & Authorization defaults (Section C) ───
  authorizedRepName: "Harshadeep Reddy",
  authorizedRepDesignation: "Managing Director & Founder",
  authorizedRepRelationship: "Director",
  authorizedRepType: "Authorized Signatory",
  authorizationStatus: "Verified",

  // ─── Government Registrations & Licences defaults (Section D) ───
  govRegistrations: [
    { id: "gr1", type: "Udyam / MSME", registrationNumber: "UDYAM-KA-03-0012345", issuingAuthority: "Ministry of MSME", validity: "Lifetime", status: "Verified" },
    { id: "gr2", type: "Shop & Establishment", registrationNumber: "KA-BLR-S&E-009876", issuingAuthority: "Karnataka Labour Dept", validity: "31-Mar-2025", status: "Verified" },
  ],

  // ─── Bank Verification defaults (Section E) ───
  bankAccountHolderName: "jobson.id TECHNOLOGIES PRIVATE LIMITED",
  bankAccountType: "Current Account",
  bankName: "HDFC Bank",
  bankAccountNumber: "50200012345678",
  bankIfsc: "HDFC0001234",
  bankVerificationStatus: "Pending",

  // ─── Verification Status defaults (Section G) ───
  overallVerificationStatus: "Under Verification",
  verificationLevel: 2,
};

interface OrganizationContextValue {
  data: OrganizationData;
  updateData: (updates: Partial<OrganizationData>) => void;
  updateCompanyAddress: (addressUpdates: Partial<AddressDetails>) => void;
  updateBillingAddress: (addressUpdates: Partial<AddressDetails>) => void;
  updateFacilityAddress: (addressUpdates: Partial<AddressDetails>) => void;
  setBillingSameAsCompany: (same: boolean) => void;
  // Address Master helpers
  updateRegisteredAddress: (addressUpdates: Partial<AddressDetails>) => void;
  addBillingAddress: () => void;
  addBillingAddressFull: (address: AddressDetails) => void;
  updateBillingAddressAt: (index: number, addressUpdates: Partial<AddressDetails>) => void;
  removeBillingAddressAt: (index: number) => void;
  addShippingAddress: () => void;
  addShippingAddressFull: (address: AddressDetails) => void;
  updateShippingAddressAt: (index: number, addressUpdates: Partial<AddressDetails>) => void;
  removeShippingAddressAt: (index: number) => void;
  // Update the canonical company name AND mirror it to all address sub-objects
  updateCompanyName: (name: string) => void;
  // Toggle a multi-select checkbox value in one of the three checkbox groups
  toggleBusinessType: (value: string) => void;
  toggleGeographicalArea: (value: string) => void;
  toggleSupplyCapability: (value: string) => void;
  toggleServedCountry: (value: string) => void;
  saveData: (sectionName?: string) => Promise<void>;
  verifyGstin: () => Promise<boolean>;
  verifyCin: () => Promise<boolean>;
  isSaving: boolean;
  isVerifyingGstin: boolean;
  isVerifyingCin: boolean;
}

const STORAGE_KEY = "webuos_organization_profile_data";

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OrganizationData>(DEFAULT_ORGANIZATION_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifyingGstin, setIsVerifyingGstin] = useState(false);
  const [isVerifyingCin, setIsVerifyingCin] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setData((prev) => ({
            ...prev,
            ...parsed,
            companyAddress: {
              ...DEFAULT_ORGANIZATION_DATA.companyAddress,
              ...(parsed.companyAddress || {}),
            },
            billingAddress: {
              ...DEFAULT_ORGANIZATION_DATA.billingAddress,
              ...(parsed.billingAddress || {}),
            },
            facilityAddress: {
              ...DEFAULT_ORGANIZATION_DATA.facilityAddress,
              ...(parsed.facilityAddress || {}),
            },
            billingSameAsCompany:
              parsed.billingSameAsCompany !== undefined
                ? parsed.billingSameAsCompany
                : DEFAULT_ORGANIZATION_DATA.billingSameAsCompany,
          }));
        }
      }
    } catch {
      // ignore JSON parse or localStorage errors
    } finally {
      const storedUser = getStoredUser();
      const storedCompany = storedUser?.companyName;
      if (storedCompany) {
        setData((prev) => ({
          ...prev,
          companyName: storedCompany,
        }));
      }
      setIsHydrated(true);
    }
  }, []);

  // Update in-memory state and sync to localStorage
  const updateData = useCallback((updates: Partial<OrganizationData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Update the canonical company name AND mirror it to all address sub-objects
  // (companyAddress, billingAddress, facilityAddress) so they stay in sync.
  const updateCompanyName = useCallback((name: string) => {
    setData((prev) => {
      const next = {
        ...prev,
        companyName: name,
        companyAddress: { ...prev.companyAddress, companyName: name },
        billingAddress: { ...prev.billingAddress, companyName: name },
        facilityAddress: { ...prev.facilityAddress, companyName: name },
      };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Generic toggle helper for multi-select checkbox groups
  const toggleArrayValue = useCallback((key: "natureOfBusinessTypes" | "geographicalServiceAreas" | "supplyCapabilities" | "servedCountries", value: string) => {
    setData((prev) => {
      const current = prev[key] || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      const updated = { ...prev, [key]: next };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const toggleBusinessType = useCallback((value: string) => toggleArrayValue("natureOfBusinessTypes", value), [toggleArrayValue]);
  const toggleGeographicalArea = useCallback((value: string) => toggleArrayValue("geographicalServiceAreas", value), [toggleArrayValue]);
  const toggleSupplyCapability = useCallback((value: string) => toggleArrayValue("supplyCapabilities", value), [toggleArrayValue]);
  const toggleServedCountry = useCallback((value: string) => toggleArrayValue("servedCountries", value), [toggleArrayValue]);

  // Helper to update Bill To address and optionally sync billing address
  const updateCompanyAddress = useCallback((addressUpdates: Partial<AddressDetails>) => {
    setData((prev) => {
      const nextCompany = { ...prev.companyAddress, ...addressUpdates };
      const nextBilling = prev.billingSameAsCompany ? { ...nextCompany } : prev.billingAddress;
      const next = {
        ...prev,
        companyAddress: nextCompany,
        billingAddress: nextBilling,
      };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Helper to update billing address
  const updateBillingAddress = useCallback((addressUpdates: Partial<AddressDetails>) => {
    setData((prev) => {
      const nextBilling = { ...prev.billingAddress, ...addressUpdates };
      const next = {
        ...prev,
        billingAddress: nextBilling,
      };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Helper to update facility / plant address (Facilities, Location & Markets)
  const updateFacilityAddress = useCallback((addressUpdates: Partial<AddressDetails>) => {
    setData((prev) => {
      const nextFacility = { ...prev.facilityAddress, ...addressUpdates };
      const next = {
        ...prev,
        facilityAddress: nextFacility,
      };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // ─── Address Master helpers ───
  const persist = (next: OrganizationData) => {
    try { if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const updateRegisteredAddress = useCallback((addressUpdates: Partial<AddressDetails>) => {
    setData((prev) => { const next = { ...prev, registeredAddress: { ...prev.registeredAddress, ...addressUpdates } }; persist(next); return next; });
  }, []);

  const addBillingAddress = useCallback(() => {
    setData((prev) => {
      const empty: AddressDetails = { companyName: prev.companyName, address: "", city: "", state: "", country: "", pinCode: "", landmark: "", location: "" };
      const next = { ...prev, billingAddresses: [...prev.billingAddresses, empty] };
      persist(next); return next;
    });
  }, []);

  const addBillingAddressFull = useCallback((address: AddressDetails) => {
    setData((prev) => {
      const next = { ...prev, billingAddresses: [...prev.billingAddresses, address] };
      persist(next); return next;
    });
  }, []);

  const updateBillingAddressAt = useCallback((index: number, addressUpdates: Partial<AddressDetails>) => {
    setData((prev) => {
      const arr = [...prev.billingAddresses];
      arr[index] = { ...arr[index], ...addressUpdates };
      const next = { ...prev, billingAddresses: arr }; persist(next); return next;
    });
  }, []);

  const removeBillingAddressAt = useCallback((index: number) => {
    setData((prev) => { const next = { ...prev, billingAddresses: prev.billingAddresses.filter((_, i) => i !== index) }; persist(next); return next; });
  }, []);

  const addShippingAddress = useCallback(() => {
    setData((prev) => {
      const empty: AddressDetails = { companyName: prev.companyName, address: "", city: "", state: "", country: "", pinCode: "", landmark: "", location: "" };
      const next = { ...prev, shippingAddresses: [...prev.shippingAddresses, empty] };
      persist(next); return next;
    });
  }, []);

  const addShippingAddressFull = useCallback((address: AddressDetails) => {
    setData((prev) => {
      const next = { ...prev, shippingAddresses: [...prev.shippingAddresses, address] };
      persist(next); return next;
    });
  }, []);

  const updateShippingAddressAt = useCallback((index: number, addressUpdates: Partial<AddressDetails>) => {
    setData((prev) => {
      const arr = [...prev.shippingAddresses];
      arr[index] = { ...arr[index], ...addressUpdates };
      const next = { ...prev, shippingAddresses: arr }; persist(next); return next;
    });
  }, []);

  const removeShippingAddressAt = useCallback((index: number) => {
    setData((prev) => { const next = { ...prev, shippingAddresses: prev.shippingAddresses.filter((_, i) => i !== index) }; persist(next); return next; });
  }, []);

  // Helper to toggle "Same as Billing"
  const setBillingSameAsCompany = useCallback((same: boolean) => {
    setData((prev) => {
      const next = {
        ...prev,
        billingSameAsCompany: same,
        billingAddress: same ? { ...prev.companyAddress } : prev.billingAddress,
      };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const verifyGstin = useCallback(async (): Promise<boolean> => {
    const currentGstin = data.gstin?.trim() ?? "";
    if (!currentGstin || currentGstin.length < 10) {
      toast.error("Please enter a valid 15-character GSTIN number.");
      return false;
    }

    setIsVerifyingGstin(true);
    // Simulate GSTN Master Registry API lookup (GET /api/gstin/{gstin})
    await new Promise((res) => setTimeout(res, 950));

    // Extract PAN from characters 2 to 12 of the GSTIN (positions 3–12)
    const derivedPan = currentGstin.length >= 12 ? currentGstin.slice(2, 12) : data.pan;

    // Simulated GST API response payload — populated from the GSTN Master Registry.
    // In production this would be the JSON body returned by the GST search endpoint.
    const gstApiResponse = {
      legalName: "jobson.id TECHNOLOGIES PRIVATE LIMITED",
      tradeName: "jobson.id Enterprise Solutions",
      status: "Active",
      constitution: "Private Limited Company",
      taxpayerType: "Regular",
      centreJurisdiction: "Commissionerate - Bengaluru East, Range - S1",
      stateJurisdiction: "State - Karnataka, Ward - 42",
      stateJurisdictionCode: "KA042",
      centreJurisdictionCode: "TX029",
      registrationDate: "14-Mar-2018",
      cancellationDate: "",
      principalAddress: "Brigade Tech Gardens, 4th Floor, Tower B, Whitefield, Bengaluru, Karnataka, 560066",
      additionalPlaces: "Brigade Tech Gardens, Tower C, Whitefield, Bengaluru; RMZ Infinity, Old Madras Road, Bengaluru",
      natureOfBusiness: "Software Publishing, AI Consultancy, High-Tech Industrial SaaS Solutions",
      fieldVisitConducted: "No",
      aadhaarAuthStatus: "Yes",
      einvoiceApplicable: "Yes",
      complianceScore: "9 / 10",
      lastGstr1: "08-2024",
      lastGstr3b: "08-2024",
    };

    updateData({
      isGstinVerified: true,
      pan: derivedPan,
      gstLegalName: gstApiResponse.legalName,
      gstTradeName: gstApiResponse.tradeName,
      gstStatus: gstApiResponse.status,
      gstConstitution: gstApiResponse.constitution,
      taxpayerType: gstApiResponse.taxpayerType,
      centreJurisdiction: gstApiResponse.centreJurisdiction,
      gstStateJurisdiction: gstApiResponse.stateJurisdiction,
      stateJurisdictionCode: gstApiResponse.stateJurisdictionCode,
      centreJurisdictionCode: gstApiResponse.centreJurisdictionCode,
      registrationDate: gstApiResponse.registrationDate,
      cancellationDate: gstApiResponse.cancellationDate,
      principalAddress: gstApiResponse.principalAddress,
      additionalPlacesOfBusiness: gstApiResponse.additionalPlaces,
      natureOfTaxBusiness: gstApiResponse.natureOfBusiness,
      fieldVisitConducted: gstApiResponse.fieldVisitConducted,
      aadhaarAuthStatus: gstApiResponse.aadhaarAuthStatus,
      einvoiceApplicable: gstApiResponse.einvoiceApplicable,
      gstComplianceScore: gstApiResponse.complianceScore,
      lastGstr1Filed: gstApiResponse.lastGstr1,
      lastGstr3bFiled: gstApiResponse.lastGstr3b,
    });

    setIsVerifyingGstin(false);
    toast.success("GSTIN verified & all registry fields fetched from GST Portal API!");
    return true;
  }, [data.gstin, data.pan, updateData]);

  // Simulated CIN (Corporate Identity Number) lookup against the MCA registry.
  // In production this would call the MCA21 / corporate registry API.
  const verifyCin = useCallback(async (): Promise<boolean> => {
    const currentCin = data.cin?.trim() ?? "";
    if (!currentCin || currentCin.length < 10) {
      toast.error("Please enter a valid 21-character CIN number.");
      return false;
    }

    setIsVerifyingCin(true);
    // Simulate MCA company master data API lookup
    await new Promise((res) => setTimeout(res, 950));

    // Simulated MCA / CIN API response payload.
    const cinApiResponse = {
      companyName: "jobson.id TECHNOLOGIES PRIVATE LIMITED",
      registrationNumber: "112233",
      incorporationDate: "14-03-2018",
      cinStatus: "Active",
      email: "secretarial@jobson.id",
      incorporationCountry: "India",
      registeredState: "Karnataka",
      rocCode: "RoC-Bangalore",
      companyClass: "Private",
      companyCategory: "Company limited by shares",
      companySubCategory: "Non-govt company",
      authorizedCapital: "₹1,00,00,000",
      paidUpCapital: "₹50,00,000",
      registeredOfficeAddress: "Brigade Tech Gardens, 4th Floor, Tower B, Whitefield, Bengaluru, Karnataka, 560066",
      whetherListed: "No",
      lastAgmDate: "30-09-2023",
      lastBalanceSheetDate: "31-03-2023",
      numberOfDirectors: "4",
      principalBusinessActivityCode: "62011",
      principalBusinessActivity: "Ready-made interactive leisure software and entertainment software development",
    };

    updateData({
      isCinVerified: true,
      cinCompanyName: cinApiResponse.companyName,
      registrationNumber: cinApiResponse.registrationNumber,
      incorporationDate: cinApiResponse.incorporationDate,
      cinStatus: cinApiResponse.cinStatus,
      companyEmail: cinApiResponse.email,
      incorporationCountry: cinApiResponse.incorporationCountry,
      registeredState: cinApiResponse.registeredState,
      rocCode: cinApiResponse.rocCode,
      companyClass: cinApiResponse.companyClass,
      companyCategory: cinApiResponse.companyCategory,
      companySubCategory: cinApiResponse.companySubCategory,
      authorizedCapital: cinApiResponse.authorizedCapital,
      paidUpCapital: cinApiResponse.paidUpCapital,
      registeredOfficeAddress: cinApiResponse.registeredOfficeAddress,
      whetherListed: cinApiResponse.whetherListed,
      lastAgmDate: cinApiResponse.lastAgmDate,
      lastBalanceSheetDate: cinApiResponse.lastBalanceSheetDate,
      numberOfDirectors: cinApiResponse.numberOfDirectors,
      principalBusinessActivityCode: cinApiResponse.principalBusinessActivityCode,
      principalBusinessActivity: cinApiResponse.principalBusinessActivity,
    });

    setIsVerifyingCin(false);
    toast.success("CIN verified & all company master data fetched from MCA Registry!");
    return true;
  }, [data.cin, updateData]);

  const saveData = useCallback(
    async (sectionName: string = "Organization profile"): Promise<void> => {
      setIsSaving(true);
      await new Promise((res) => setTimeout(res, 600));
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch {
        // ignore
      }
      setIsSaving(false);
      toast.success(`${sectionName} updated successfully!`);
    },
    [data]
  );

  return (
    <OrganizationContext.Provider
      value={{
        data,
        updateData,
        updateCompanyName,
        updateCompanyAddress,
        updateBillingAddress,
        updateFacilityAddress,
        setBillingSameAsCompany,
        updateRegisteredAddress,
        addBillingAddress,
        addBillingAddressFull,
        updateBillingAddressAt,
        removeBillingAddressAt,
        addShippingAddress,
        addShippingAddressFull,
        updateShippingAddressAt,
        removeShippingAddressAt,
        toggleBusinessType,
        toggleGeographicalArea,
        toggleSupplyCapability,
        toggleServedCountry,
        saveData,
        verifyGstin,
        verifyCin,
        isSaving,
        isVerifyingGstin,
        isVerifyingCin,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
}
