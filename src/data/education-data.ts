export const EDUCATION_LEVELS: string[] = [
  "Secondary (10th)",
  "Higher Secondary (12th)",
  "Diploma / Polytechnic",
  "Associate Degree",
  "Undergraduate / Bachelor's",
  "Postgraduate Diploma",
  "Postgraduate / Master's",
  "Doctorate / Ph.D.",
  "Post-Doctoral Fellowship",
  "Vocational / ITI",
  "Professional Certification",
];

export interface DegreeGroup {
  field: string;
  degrees: string[];
}

export const DEGREE_GROUPS: DegreeGroup[] = [
  {
    field: "Engineering & Technology",
    degrees: [
      "Bachelor of Technology (B.Tech)",
      "Bachelor of Engineering (B.E.)",
      "Master of Technology (M.Tech)",
      "Master of Engineering (M.E.)",
      "Diploma in Engineering",
      "Integrated M.Tech",
      "Doctor of Philosophy (Ph.D.) in Engineering",
    ],
  },
  {
    field: "Computer Applications & IT",
    degrees: [
      "Bachelor of Computer Applications (BCA)",
      "Master of Computer Applications (MCA)",
      "B.Sc. in Computer Science",
      "M.Sc. in Computer Science",
      "B.Sc. in Information Technology",
      "M.Sc. in Data Science & AI",
      "Post Graduate Diploma in Computer Applications (PGDCA)",
    ],
  },
  {
    field: "Management & Business",
    degrees: [
      "Bachelor of Business Administration (BBA)",
      "Master of Business Administration (MBA)",
      "Post Graduate Diploma in Management (PGDM)",
      "Bachelor of Management Studies (BMS)",
      "Executive MBA (EMBA)",
      "Doctor of Business Administration (DBA)",
    ],
  },
  {
    field: "Commerce, Finance & Accounting",
    degrees: [
      "Bachelor of Commerce (B.Com)",
      "Master of Commerce (M.Com)",
      "Chartered Accountant (CA)",
      "Company Secretary (CS)",
      "Cost and Management Accountant (CMA)",
      "Chartered Financial Analyst (CFA)",
    ],
  },
  {
    field: "Science & Mathematics",
    degrees: [
      "Bachelor of Science (B.Sc.)",
      "Master of Science (M.Sc.)",
      "Integrated M.Sc.",
      "Doctor of Philosophy (Ph.D.) in Science",
    ],
  },
  {
    field: "Arts, Humanities & Social Sciences",
    degrees: [
      "Bachelor of Arts (B.A.)",
      "Master of Arts (M.A.)",
      "Bachelor of Fine Arts (BFA)",
      "Master of Social Work (MSW)",
      "Bachelor of Journalism & Mass Communication (BJMC)",
    ],
  },
  {
    field: "Design & Architecture",
    degrees: [
      "Bachelor of Design (B.Des)",
      "Master of Design (M.Des)",
      "Bachelor of Architecture (B.Arch)",
      "Master of Architecture (M.Arch)",
    ],
  },
  {
    field: "Medical & Healthcare",
    degrees: [
      "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
      "Bachelor of Dental Surgery (BDS)",
      "Bachelor of Pharmacy (B.Pharm)",
      "Master of Pharmacy (M.Pharm)",
      "Doctor of Medicine (MD)",
      "Bachelor of Physiotherapy (BPT)",
    ],
  },
  {
    field: "Law",
    degrees: [
      "Bachelor of Laws (LL.B.)",
      "Integrated B.A. LL.B.",
      "Master of Laws (LL.M.)",
    ],
  },
  {
    field: "Schooling",
    degrees: [
      "Higher Secondary Certificate (12th / HSC)",
      "Senior Secondary (CBSE / ISC Class XII)",
      "Secondary School Certificate (10th / SSC)",
    ],
  },
];

export const ALL_DEGREES: string[] = DEGREE_GROUPS.flatMap((g) => g.degrees);

export const GENERAL_SPECIALIZATIONS: string[] = [
  "General / Interdisciplinary",
  "Applied Sciences",
  "Computer Science & Engineering",
  "Information Technology",
  "Data Science & Analytics",
  "Artificial Intelligence & Machine Learning",
  "Business Analytics",
  "Operations & Supply Chain",
  "Finance & Accounting",
  "Marketing & Strategy",
  "Human Resources",
  "Economics",
  "Mathematics & Statistics",
  "Project Management",
];

export const SPECIALIZATIONS_BY_DEGREE: Record<string, string[]> = {
  "Bachelor of Technology (B.Tech)": [
    "Computer Science & Engineering",
    "Information Technology",
    "Artificial Intelligence & Machine Learning",
    "Data Science & Engineering",
    "Electronics & Communication Engineering",
    "Electrical & Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Aerospace Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Robotics & Automation",
  ],
  "Bachelor of Computer Applications (BCA)": [
    "Computer Applications",
    "Software Development",
    "Cloud Computing & Cyber Security",
    "Artificial Intelligence & Data Science",
    "Web & Mobile Development",
    "Database Management Systems",
  ],
  "Master of Computer Applications (MCA)": [
    "Software Engineering & Cloud Systems",
    "Artificial Intelligence & Machine Learning",
    "Cyber Security",
    "Full-Stack Web Systems",
    "Enterprise Data Engineering",
  ],
  "Master of Business Administration (MBA)": [
    "Finance",
    "Marketing",
    "Human Resource Management",
    "Operations & Supply Chain Management",
    "Business Analytics",
    "Information Technology & Systems",
    "International Business",
    "Strategy & Entrepreneurship",
    "Product Management",
  ],
  "Bachelor of Arts (B.A.)": [
    "Economics",
    "English Literature",
    "Psychology",
    "Political Science",
    "History",
    "Sociology",
    "Journalism & Mass Communication",
    "Public Administration",
  ],
  "Bachelor of Science (B.Sc.)": [
    "Computer Science",
    "Information Technology",
    "Mathematics",
    "Statistics",
    "Physics",
    "Chemistry",
    "Biotechnology",
    "Microbiology",
    "Data Science",
  ],
  "Bachelor of Medicine, Bachelor of Surgery (MBBS)": [
    "General Medicine",
    "General Surgery",
    "Pediatrics",
    "Orthopedics",
    "Radiology",
    "Dermatology",
    "Community Medicine",
  ],
};

export const INSTITUTIONS: string[] = [
  "Indian Institute of Technology (IIT) Bombay",
  "Indian Institute of Technology (IIT) Delhi",
  "Indian Institute of Technology (IIT) Madras",
  "Indian Institute of Technology (IIT) Kanpur",
  "Indian Institute of Technology (IIT) Kharagpur",
  "Indian Institute of Science (IISc) Bengaluru",
  "National Institute of Technology (NIT) Trichy",
  "National Institute of Technology (NIT) Surathkal",
  "National Institute of Technology (NIT) Warangal",
  "Birla Institute of Technology & Science (BITS) Pilani",
  "Indian Institute of Management (IIM) Ahmedabad",
  "Indian Institute of Management (IIM) Bangalore",
  "Indian Institute of Management (IIM) Calcutta",
  "Vellore Institute of Technology (VIT)",
  "SRM Institute of Science and Technology",
  "Manipal Academy of Higher Education",
  "Delhi University (DU)",
  "Jawaharlal Nehru University (JNU)",
  "University of Mumbai",
  "Savitribai Phule Pune University",
  "Bengaluru City University",
  "Visvesvaraya Technological University (VTU)",
  "Anna University",
  "Osmania University",
  "Christ University, Bengaluru",
  "Symbiosis International University",
  "Amity University",
  "Lovely Professional University (LPU)",
  "PES University",
  "RV College of Engineering",
  "BMS College of Engineering",
  "IIIT Hyderabad",
  "IIIT Bangalore",
  "Stanford University",
  "Massachusetts Institute of Technology (MIT)",
  "Harvard University",
  "University of Oxford",
  "University of Cambridge",
  "National University of Singapore (NUS)",
];

export const INSTITUTION_TYPES: string[] = [
  "Central University",
  "State University",
  "Deemed University",
  "Private University",
  "Autonomous Institute",
  "Institute of National Importance (IIT / NIT / IIM)",
  "Affiliated College",
  "Polytechnic / Diploma Institute",
  "International University",
  "Open / Distance University",
];

const COUNTRY_STATE_MAP: Record<string, string[]> = {
  India: [
    "Karnataka",
    "Maharashtra",
    "Delhi NCR",
    "Tamil Nadu",
    "Telangana",
    "Andhra Pradesh",
    "Gujarat",
    "West Bengal",
    "Uttar Pradesh",
    "Rajasthan",
    "Kerala",
    "Haryana",
    "Punjab",
    "Madhya Pradesh",
    "Bihar",
    "Odisha",
    "Assam",
    "Chandigarh",
    "Goa",
  ],
  "United States": [
    "California",
    "New York",
    "Texas",
    "Washington",
    "Massachusetts",
    "Illinois",
    "Georgia",
    "Florida",
  ],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Canada: ["Ontario", "British Columbia", "Quebec", "Alberta"],
  Germany: ["Bavaria", "Berlin", "Baden-Württemberg", "North Rhine-Westphalia"],
  Singapore: ["Central Region", "East Region", "North Region", "West Region"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
};

const STATE_CITY_MAP: Record<string, string[]> = {
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Navi Mumbai"],
  "Delhi NCR": ["New Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Vellore"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "West Bengal": ["Kolkata", "Siliguri", "Durgapur", "Kharagpur"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur", "Varanasi", "Prayagraj", "Agra"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Pilani"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  Punjab: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior", "Jabalpur"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh"],
  Chandigarh: ["Chandigarh"],
  Goa: ["Panaji", "Margao", "Vasco da Gama"],
  California: ["San Francisco", "San Jose", "Los Angeles", "San Diego", "Palo Alto"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
  Texas: ["Austin", "Dallas", "Houston", "San Antonio"],
  Washington: ["Seattle", "Redmond", "Bellevue"],
  Massachusetts: ["Boston", "Cambridge", "Worcester"],
  Illinois: ["Chicago", "Evanston", "Urbana"],
  Georgia: ["Atlanta", "Savannah"],
  Florida: ["Miami", "Orlando", "Tampa"],
  England: ["London", "Manchester", "Oxford", "Cambridge", "Birmingham"],
  Scotland: ["Edinburgh", "Glasgow", "Aberdeen"],
  Ontario: ["Toronto", "Waterloo", "Ottawa"],
  "British Columbia": ["Vancouver", "Victoria"],
  Dubai: ["Dubai"],
  "Abu Dhabi": ["Abu Dhabi"],
  "Central Region": ["Singapore"],
  "New South Wales": ["Sydney", "Newcastle"],
  Victoria: ["Melbourne", "Geelong"],
};

export const COUNTRIES: string[] = Object.keys(COUNTRY_STATE_MAP);

export function getStatesForCountry(country: string): string[] {
  if (!country) return COUNTRY_STATE_MAP.India;
  return COUNTRY_STATE_MAP[country] || ["Other State / Province"];
}

export function getCitiesForState(state: string): string[] {
  if (!state) return [];
  return STATE_CITY_MAP[state] || [state];
}

const currentYear = 2026;
export const YEARS: string[] = Array.from({ length: 45 }, (_, i) => String(currentYear + 4 - i));

export const COURSE_DURATIONS: string[] = [
  "6 Months",
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years",
  "5.5 Years",
];

export const COMPLETION_STATUSES: string[] = [
  "Completed",
  "Pursuing / Ongoing",
  "Awaiting Results",
  "Discontinued / Partial",
];

export const EDUCATION_MODES: string[] = [
  "Full-time (On-Campus)",
  "Part-time",
  "Online / Remote",
  "Hybrid / Executive",
  "Distance Learning",
];

export const COURSE_TYPES: string[] = [
  "Regular / Full-time",
  "Part-time",
  "Correspondence / Distance",
  "Executive",
  "Honours / Research",
];

export const GRADING_SYSTEMS: string[] = [
  "CGPA (10-Point Scale)",
  "CGPA (4-Point Scale)",
  "Percentage (%)",
  "Letter Grade",
  "Division / Class",
  "Pass / Distinction",
];

export const GRADES: string[] = [
  "O (Outstanding)",
  "A+ (First Class with Distinction)",
  "A (First Class)",
  "B+ (Second Class Honours)",
  "B (Second Class)",
  "C (Pass)",
  "Distinction",
  "First Division",
  "Second Division",
];

export const ACADEMIC_HONOURS: string[] = [
  "None",
  "First Class with Distinction",
  "University Gold Medalist",
  "Dean's List",
  "Summa Cum Laude",
  "Magna Cum Laude",
  "Cum Laude",
  "Merit Scholarship Recipient",
  "Department Rank Holder",
];

export const MEDIUMS_OF_INSTRUCTION: string[] = [
  "English",
  "Hindi",
  "Kannada",
  "Tamil",
  "Telugu",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Malayalam",
  "Bilingual",
];

export const ACCREDITATIONS: string[] = [
  "NAAC A++",
  "NAAC A+",
  "NAAC A",
  "NBA Accredited",
  "AICTE Approved",
  "UGC Recognized",
  "NIRF Top 50",
  "AACSB Accredited",
  "AMBA Accredited",
  "EQUIS Accredited",
  "ABET Accredited",
  "BCI Approved",
  "NMC Recognized",
];
