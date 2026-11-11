// ============================================================
// JOBSONN Category Hierarchy Data
// Placeholder data - replace with real categories
// 3-tier taxonomy: Category -> Subcategory -> Item
// ============================================================

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  items: CategoryItem[];
}

export interface CategoryRoot {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  subcategories: Subcategory[];
}

export const CATEGORIES_DATA: CategoryRoot[] = [
  {
    id: "products-goods",
    name: "PRODUCTS & GOODS",
    shortName: "Products",
    tagline: "Build • Produce • Distribute",
    icon: "Boxes",
    subcategories: [
      {
        id: "raw-materials",
        name: "Raw Materials",
        icon: "Layers",
        items: [
          { id: "metals-alloys", name: "Metals & Alloys", count: 4 },
          { id: "polymers-plastics", name: "Polymers & Plastics", count: 3 },
          { id: "chemicals-minerals", name: "Chemicals & Minerals", count: 5 },
        ],
      },
      {
        id: "machinery-equipment",
        name: "Machinery & Equipment",
        icon: "Cog",
        items: [
          { id: "cnc-machine-tools", name: "CNC & Machine Tools", count: 6 },
          { id: "heavy-industrial-plant", name: "Heavy Industrial Plant", count: 4 },
          { id: "conveyors-material-handling", name: "Conveyors & Handling", count: 3 },
          { id: "pumps-valves", name: "Pumps & Valves", count: 5 },
        ],
      },
      {
        id: "electronics-components",
        name: "Electronics & Components",
        icon: "Cpu",
        items: [
          { id: "semiconductors-ics", name: "Semiconductors & ICs", count: 8 },
          { id: "pcb-assemblies", name: "PCB Assemblies", count: 4 },
          { id: "sensors-transducers", name: "Sensors & Transducers", count: 6 },
          { id: "power-supplies", name: "Power Supplies", count: 3 },
        ],
      },
      {
        id: "consumer-goods",
        name: "Consumer Goods",
        icon: "ShoppingBag",
        items: [
          { id: "home-appliances", name: "Home Appliances", count: 4 },
          { id: "personal-electronics", name: "Personal Electronics", count: 5 },
          { id: "fmcg-packaged-goods", name: "FMCG Packaged Goods", count: 6 },
        ],
      },
      {
        id: "packaging",
        name: "Packaging",
        icon: "Package",
        items: [
          { id: "corrugated-boxes", name: "Corrugated & Paper", count: 3 },
          { id: "flexible-packaging", name: "Flexible Packaging", count: 4 },
          { id: "protective-cushioning", name: "Protective Cushioning", count: 2 },
        ],
      },
      {
        id: "industrial-supplies",
        name: "Industrial Supplies",
        icon: "Wrench",
        items: [
          { id: "fasteners-hardware", name: "Fasteners & Hardware", count: 5 },
          { id: "safety-ppe", name: "Safety & PPE", count: 4 },
          { id: "lubricants-adhesives", name: "Lubricants & Adhesives", count: 3 },
        ],
      },
    ],
  },
  {
    id: "services-solutions",
    name: "SERVICES & SOLUTIONS",
    shortName: "Services",
    tagline: "Consult • Deliver • Support",
    icon: "Briefcase",
    subcategories: [
      {
        id: "consulting",
        name: "Consulting",
        icon: "Lightbulb",
        items: [
          { id: "management-consulting", name: "Management Consulting", count: 4 },
          { id: "technical-advisory", name: "Technical Advisory", count: 3 },
          { id: "compliance-regulatory", name: "Compliance & Regulatory", count: 3 },
        ],
      },
      {
        id: "logistics-transport",
        name: "Logistics & Transport",
        icon: "Truck",
        items: [
          { id: "freight-forwarding", name: "Freight Forwarding", count: 4 },
          { id: "warehousing-fulfillment", name: "Warehousing & Fulfillment", count: 5 },
          { id: "last-mile-delivery", name: "Last-Mile Delivery", count: 3 },
        ],
      },
      {
        id: "maintenance-repair",
        name: "Maintenance & Repair",
        icon: "Wrench",
        items: [
          { id: "preventive-maintenance", name: "Preventive Maintenance", count: 3 },
          { id: "equipment-overhaul", name: "Equipment Overhaul", count: 2 },
          { id: "field-service-support", name: "Field Service Support", count: 4 },
        ],
      },
      {
        id: "training-education",
        name: "Training & Education",
        icon: "GraduationCap",
        items: [
          { id: "corporate-upskilling", name: "Corporate Upskilling", count: 3 },
          { id: "safety-certifications", name: "Safety Certifications", count: 2 },
        ],
      },
      {
        id: "marketing-design",
        name: "Marketing & Design",
        icon: "Megaphone",
        items: [
          { id: "brand-strategy", name: "Brand Strategy", count: 3 },
          { id: "digital-marketing", name: "Digital Marketing", count: 5 },
          { id: "industrial-design", name: "Industrial Design", count: 2 },
        ],
      },
    ],
  },
  {
    id: "digital-technology",
    name: "DIGITAL & TECHNOLOGY",
    shortName: "Technology",
    tagline: "Software • Cloud • Intelligence",
    icon: "Bot",
    subcategories: [
      {
        id: "software-saas",
        name: "Software & SaaS",
        icon: "Code2",
        items: [
          { id: "enterprise-erp-crm", name: "Enterprise ERP & CRM", count: 5 },
          { id: "workflow-automation-tools", name: "Workflow Automation Tools", count: 4 },
          { id: "developer-devops-tools", name: "Developer & DevOps Tools", count: 6 },
          { id: "collaboration-suites", name: "Collaboration Suites", count: 3 },
        ],
      },
      {
        id: "cloud-hosting",
        name: "Cloud & Hosting",
        icon: "Cloud",
        items: [
          { id: "iaas-compute-storage", name: "IaaS Compute & Storage", count: 4 },
          { id: "managed-kubernetes", name: "Managed Kubernetes", count: 3 },
          { id: "serverless-edge", name: "Serverless & Edge Platforms", count: 3 },
        ],
      },
      {
        id: "data-analytics",
        name: "Data & Analytics",
        icon: "BarChart3",
        items: [
          { id: "business-intelligence-bi", name: "Business Intelligence & BI", count: 4 },
          { id: "data-warehouses-lakes", name: "Data Warehouses & Lakes", count: 3 },
          { id: "real-time-streaming", name: "Real-time Streaming Analytics", count: 3 },
        ],
      },
      {
        id: "cybersecurity",
        name: "Cybersecurity",
        icon: "ShieldCheck",
        items: [
          { id: "identity-access-iam", name: "Identity & Access (IAM)", count: 4 },
          { id: "endpoint-cloud-security", name: "Endpoint & Cloud Security", count: 4 },
          { id: "threat-detection-soc", name: "Threat Detection & SOC", count: 3 },
        ],
      },
      {
        id: "ai-automation",
        name: "AI & Automation",
        icon: "Brain",
        items: [
          { id: "genai-agents-llms", name: "GenAI Agents & LLMs", count: 5 },
          { id: "computer-vision-speech", name: "Computer Vision & Speech", count: 3 },
          { id: "robotic-process-automation", name: "Robotic Process Automation", count: 4 },
        ],
      },
    ],
  },
];

// ============================================================
// Industrial Category Tiles (top-level)
// 16 industrial domain categories shown as colorful tiles grid
// ============================================================

export interface IndustrialCategory {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  color: string; // tailwind text color class
  bg: string;    // tailwind bg color class
}

export const INDUSTRIAL_CATEGORIES: IndustrialCategory[] = [
  {
    id: "industrial-supplies-consumables",
    name: "Industrial Supplies, Components & Consumables",
    shortName: "Industrial Supplies",
    tagline: "Consumables · Components · Spares",
    icon: "Package",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    id: "machinery-equipment-tools",
    name: "Machinery, Equipment, Tools & Spare Parts",
    shortName: "Machinery & Tools",
    tagline: "Heavy · CNC · Precision · Spares",
    icon: "Cog",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/15",
  },
  {
    id: "manufacturing-production-fabrication",
    name: "Manufacturing, Production & Fabrication Solutions",
    shortName: "Manufacturing Solutions",
    tagline: "Assembly · Fabrication · Output",
    icon: "Factory",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/15",
  },
  {
    id: "engineering-design-technical",
    name: "Engineering, Design & Technical Services",
    shortName: "Engineering & Design",
    tagline: "CAD · Design · Technical",
    icon: "PenTool",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/15",
  },
  {
    id: "electrical-electronics-instrumentation",
    name: "Electrical, Electronics & Instrumentation Solutions",
    shortName: "Electrical & Instrumentation",
    tagline: "Power · Control · Measurement",
    icon: "Zap",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/15",
  },
  {
    id: "automation-robotics-control",
    name: "Industrial Automation, Robotics & Control Systems",
    shortName: "Automation & Robotics",
    tagline: "PLC · SCADA · Robotics",
    icon: "Bot",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/15",
  },
  {
    id: "metals-alloys-raw-materials",
    name: "Metals, Alloys, Raw Materials & Industrial Chemicals",
    shortName: "Metals & Materials",
    tagline: "Steel · Alloys · Chemicals",
    icon: "Layers",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-500/15",
  },
  {
    id: "construction-infrastructure-facility",
    name: "Construction, Infrastructure & Facility Solutions",
    shortName: "Construction & Infrastructure",
    tagline: "Build · Civil · Facility",
    icon: "Building2",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/15",
  },
  {
    id: "automotive-transportation-mobile",
    name: "Automotive, Transportation & Mobile Equipment",
    shortName: "Automotive & Transport",
    tagline: "Vehicles · Fleet · Mobile",
    icon: "Car",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    id: "logistics-warehousing-supply-chain",
    name: "Logistics, Warehousing & Supply Chain Solutions",
    shortName: "Logistics & Warehousing",
    tagline: "Freight · Warehouse · Chain",
    icon: "Truck",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/15",
  },
  {
    id: "workplace-safety-environmental",
    name: "Workplace, Safety & Environmental Solutions",
    shortName: "Safety & Environment",
    tagline: "PPE · Compliance · Environment",
    icon: "ShieldCheck",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  {
    id: "maintenance-testing-inspection-support",
    name: "Maintenance, Testing, Inspection & Technical Support",
    shortName: "Maintenance & Testing",
    tagline: "Service · Testing · Inspection",
    icon: "Wrench",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/15",
  },
  {
    id: "repair-maintenance-contract-production",
    name: "Repair, Maintenance & Contract Production",
    shortName: "Repair & Contract Production",
    tagline: "Repair · Overhaul · Contract",
    icon: "Hammer",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/15",
  },
  {
    id: "quality-control-testing-inspection",
    name: "Quality Control, Testing & Inspection",
    shortName: "Quality Control & Inspection",
    tagline: "QA · Testing · Inspection",
    icon: "ClipboardCheck",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/15",
  },
  {
    id: "industrial-projects-installation-commissioning",
    name: "Industrial Projects, Installation & Commissioning Services",
    shortName: "Projects & Commissioning",
    tagline: "Installation · Commissioning",
    icon: "HardHat",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/15",
  },
  {
    id: "industrial-software-digitalization-smart-manufacturing",
    name: "Industrial Software, Digitalization & Smart Manufacturing",
    shortName: "Software & Smart Manufacturing",
    tagline: "Digital · IIoT · Smart Mfg",
    icon: "Code2",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/15",
  },
];


