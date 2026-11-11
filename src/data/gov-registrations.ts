export interface GovRegCategory {
  id: string;
  title: string;
  registrations: string[];
}

export const GOV_REG_CATEGORIES: GovRegCategory[] = [
  {
    id: "business-entity",
    title: "Business Entity & Incorporation",
    registrations: [
      "Private Limited Company Certificate of Incorporation",
      "Public Limited Company Certificate of Incorporation",
      "One Person Company (OPC) Certificate of Incorporation",
      "Limited Liability Partnership (LLP) Certificate of Incorporation",
      "Partnership Firm Certificate",
      "Sole Proprietorship Certificate",
      "Udyam Certificate (MSME)",
      "Startup India (DPIIT) Recognition Certificate",
      "Section 8 / Non-Profit Registration",
    ],
  },
  {
    id: "tax",
    title: "Tax & Statutory Registrations",
    registrations: [
      "GST Certificate",
      "PAN – Business Entity",
      "TAN Certificate",
      "Professional Tax Registration (PTRC / PTEC)",
      "LUT (Letter of Undertaking) – GST Export",
    ],
  },
  {
    id: "import-export",
    title: "Import, Export & Customs",
    registrations: [
      "Import Export Code (IEC) Certificate",
      "AD Code Registration (Customs)",
      "APEDA / Export Promotion Council Registration",
      "Authorized Economic Operator (AEO) Certificate",
      "Certificate of Origin Registration",
    ],
  },
  {
    id: "state-local",
    title: "State & Municipal Licences",
    registrations: [
      "Shops and Establishments Certificate",
      "Trade Licence",
      "Municipal Health & Sanitation Licence",
      "Fire Safety NOC",
      "Signage / Hoarding Permit",
    ],
  },
  {
    id: "labour",
    title: "Labour & Employee Welfare",
    registrations: [
      "EPFO Certificate",
      "ESIC Certificate",
      "Contract Labour Licence (CLRA)",
      "Labour Welfare Fund (LWF) Registration",
      "Gratuity Trust Registration",
    ],
  },
  {
    id: "industry-specific",
    title: "Industry-Specific Licences",
    registrations: [
      "FSSAI Licence",
      "Drug Licence",
      "Factory Licence",
      "BIS Certification / ISI Mark",
      "PSARA Licence (Private Security)",
      "RERA Certificate (Real Estate Projects / Agents)",
      "PESO Explosive / Petroleum Licence",
    ],
  },
  {
    id: "environmental",
    title: "Environmental & Pollution Control",
    registrations: [
      "Consent to Establish (CTE)",
      "Consent to Operate (CTO)",
      "Hazardous Waste Authorization",
      "E-Waste EPR Authorization",
      "Plastic Waste EPR Registration",
    ],
  },
  {
    id: "ip-brand",
    title: "Intellectual Property & Brand",
    registrations: [
      "Trademark Certificate",
      "Patent Registration Certificate",
      "Copyright Registration",
      "Industrial Design Registration",
      "ISO 9001 / ISO 27001 Quality Certificate",
    ],
  },
  {
    id: "financial",
    title: "Financial, RBI & Regulatory",
    registrations: [
      "RBI NBFC / PPI Licence",
      "SEBI Registration",
      "IRDAI Corporate Agent Licence",
      "LEI (Legal Entity Identifier) Registration",
    ],
  },
  {
    id: "technology",
    title: "Technology & Telecom",
    registrations: [
      "OSP (Other Service Provider) Registration – DoT",
      "STPI Registration",
      "CERT-In Compliance Empanelment",
      "DPDP Data Fiduciary Registration",
    ],
  },
  {
    id: "transport",
    title: "Transport & Logistics",
    registrations: [
      "Goods Carriage National Permit",
      "Custom House Agent (CHA) Licence",
      "Dangerous Goods Handling Permit",
      "Warehouse WDRA Registration",
    ],
  },
  {
    id: "education",
    title: "Education & Skilling",
    registrations: [
      "NSDC / Skill India Training Partner",
      "AICTE / UGC Affiliation",
      "ISO 21001 Educational Organization Certificate",
    ],
  },
  {
    id: "other",
    title: "Other Regulatory Clearances",
    registrations: [
      "GeM (Government e-Marketplace) Seller Registration",
      "NSIC Single Point Registration",
      "Dun & Bradstreet D-U-N-S Number",
    ],
  },
];

export const INDIAN_STATES: string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
