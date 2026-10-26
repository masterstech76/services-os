export interface TechnicianAssignment {
  id: string; // e.g. "carlos-mendez"
  name: string;
  role: string;
  badge: string;
  certifications: string;
  rating: number;
  reviewCount: number;
  initials: string;
  status: "available" | "busy_coming_soon" | "en_route";
  statusNote: string;
  stagedZone: string;
  truckStockNote: string;
  speedTier: "fast" | "medium" | "regular";
  buttonText: string;
  profileHref: string;
  bookHref: string;
}

export interface DiagnosticPhase {
  phase: string;
  title: string;
  desc: string;
  iconName: "ThermometerSnowflake" | "Gauge" | "Zap" | "CheckCircle2" | "Wrench" | "Sparkles" | "Flame" | "Sliders" | "ShieldCheck";
}

export interface CommonIssue {
  symptom: string;
  cause: string;
}

export interface TruckStockPart {
  name: string;
  spec: string;
}

export interface AiFailureRisk {
  component: string;
  probability: number;
  risk: "high" | "medium" | "low";
}

export interface AiTelemetryData {
  ambientTemp: number;
  humidity: number;
  powerGridStability: string;
  failureProbabilities: AiFailureRisk[];
  aiDiagnosticInsight: string;
  modelConfidence: number;
  lastUpdatedMinutesAgo: number;
}

export interface ServiceDetail {
  slug: string; // e.g. "ac-repair"
  title: string;
  shortTitle: string;
  category: "cooling" | "heating" | "iaq" | "emergency" | "commercial";
  categoryLabel: string;
  speedTier: "fast" | "medium" | "regular";
  speedBadge: string;
  price: string;
  duration: string;
  headlinePrefix: string;
  highlightWord: string;
  headlineSuffix: string;
  description: string;
  image: string;
  valueProps: {
    warranty: string;
    arrivalWindow: string;
    pricingNote: string;
  };
  bookHref: string;
  diagnosticPhases: DiagnosticPhase[];
  commonIssues: CommonIssue[];
  truckStockParts: TruckStockPart[];
  aiTelemetry: AiTelemetryData;
  assignedTechnicians: TechnicianAssignment[];
}

export const MASTER_TECHNICIANS: Record<string, TechnicianAssignment> = {
  "carlos-mendez": {
    id: "carlos-mendez",
    name: "Carlos Mendez",
    role: "Lead Master Emergency & Inverter Specialist",
    badge: "In Van #104 · On-Duty Specialist",
    certifications: "Master AC & Inverter Specialist · 12+ Years · EPA Universal 608 & NATE Master",
    rating: 4.96,
    reviewCount: 148,
    initials: "CM",
    status: "available",
    statusNote: "In Van #104 · Staged in Brickell & Downtown · Ready for immediate dispatch",
    stagedZone: "Brickell & Downtown (15–25m ETA)",
    truckStockNote: "Stock: 95% of universal capacitors, contactors, fan motors & R-410A.",
    speedTier: "fast",
    buttonText: "Dispatch Carlos Now →",
    profileHref: "/reviews/carlos-mendez",
    bookHref: "/book?serviceId=svc-ac-repair&tech=carlos",
  },
  "marcus-vance": {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Senior Compressor Diagnostics & Electrical Specialist",
    badge: "In Van #102 · On Active Job Site",
    certifications: "High-Voltage Circuits, Compressor Overload & Electronic Expansion Valves · 10+ Years",
    rating: 4.92,
    reviewCount: 112,
    initials: "MV",
    status: "busy_coming_soon",
    statusNote: "Servicing capacitor swap in Coral Gables · Finishing in ~35 mins · Next in dispatch queue",
    stagedZone: "Coral Gables & Kendall (20–30m ETA after current job)",
    truckStockNote: "Stock: Hard-start kits, high-voltage contactors, and nitrogen sniffers.",
    speedTier: "medium",
    buttonText: "Schedule Marcus (Coming Soon) →",
    profileHref: "/reviews/marcus-vance",
    bookHref: "/book?serviceId=svc-ac-repair&tech=marcus",
  },
  "elena-rivera": {
    id: "elena-rivera",
    name: "Elena Rivera",
    role: "Commercial Rooftop RTU & Heavy Chillers Lead",
    badge: "In Van #108 · Commercial Standby",
    certifications: "Multi-Zone VRF, Water-Source Heat Pumps & Packaged Rooftops · 14+ Years",
    rating: 4.98,
    reviewCount: 96,
    initials: "ER",
    status: "available",
    statusNote: "Staged in Doral & Airport Industrial Zone · Ready for commercial dispatch",
    stagedZone: "Doral & Miami Beach (30m ETA)",
    truckStockNote: "Stock: Multi-stage scroll compressors, 3-phase contactors & RTU belts.",
    speedTier: "regular",
    buttonText: "Request Elena for Service →",
    profileHref: "/reviews/elena-rivera",
    bookHref: "/contact?specialist=elena-rivera",
  },
  "david-kim": {
    id: "david-kim",
    name: "David Kim",
    role: "Indoor Air Quality, Duct & Smart Controls Specialist",
    badge: "In Van #105 · On-Duty Specialist",
    certifications: "BPI Building Analyst, NADCA Certified ASCS, Smart Thermostat Integration Lead · 8+ Years",
    rating: 4.95,
    reviewCount: 84,
    initials: "DK",
    status: "busy_coming_soon",
    statusNote: "Completing whole-home duct sanitization in Pinecrest · Finishing in ~45 mins",
    stagedZone: "South Miami & Pinecrest (25–35m ETA after completion)",
    truckStockNote: "Stock: HEPA negative-air collectors, Nest/Ecobee smart bases, UV-C purifiers.",
    speedTier: "medium",
    buttonText: "Book David (Coming Soon) →",
    profileHref: "/reviews/david-kim",
    bookHref: "/book?serviceId=svc-duct-cleaning&tech=david",
  },
};

export const SERVICES_DETAIL_DATA: Record<string, ServiceDetail> = {
  "ac-repair": {
    slug: "ac-repair",
    title: "AC Diagnostic & Precision Repair",
    shortTitle: "AC Repair",
    category: "cooling",
    categoryLabel: "Cooling & Inverters",
    speedTier: "medium",
    speedBadge: "Medium Time Service · Same-Day Arrival",
    price: "$129 Flat Diagnostic",
    duration: "45–60 min visit",
    headlinePrefix: "Rapid AC Diagnostic & Repair Within",
    highlightWord: "60 Minutes",
    headlineSuffix: "",
    description: "When South Florida heat peaks, a broken AC is an emergency. Our master certified technicians arrive in fully equipped rolling warehouses to test, diagnose, and repair your air conditioner on the first visit with 100% credited diagnostic fees.",
    image: "/images/svc-ac-repair.jpg",
    valueProps: {
      warranty: "1-Year Workmanship Warranty",
      arrivalWindow: "60-Minute Arrival Window",
      pricingNote: "$129 Upfront Flat Diagnostic (100% Credited)",
    },
    bookHref: "/book?serviceId=svc-ac-repair",
    diagnosticPhases: [
      {
        phase: "Phase 01",
        title: "Digital Static & Delta-T Analysis",
        desc: "Precision dual-thermistor temperature drop reading across coil to verify airflow CFM.",
        iconName: "ThermometerSnowflake",
      },
      {
        phase: "Phase 02",
        title: "Microfarad & High-Voltage Check",
        desc: "Capacitor tolerance testing, contactor pitting inspection, and compressor run amp analysis.",
        iconName: "Zap",
      },
      {
        phase: "Phase 03",
        title: "Electronic Refrigerant Sniffing",
        desc: "Nitrogen pressure holding and ultrasonic leak detection on evaporator coils and service valves.",
        iconName: "Gauge",
      },
      {
        phase: "Phase 04",
        title: "Upfront Digital Quote & Repair",
        desc: "Instant menu pricing with flat-rate labor and OEM parts before turning any wrench.",
        iconName: "CheckCircle2",
      },
    ],
    commonIssues: [
      { symptom: "Warm Air Blowing from Vents", cause: "Faulty run capacitor or low refrigerant charge from micro-leak." },
      { symptom: "Outdoor Unit Buzzing but Fan Not Spinning", cause: "Seized condenser fan motor or failed dual-run capacitor." },
      { symptom: "Water Pooling Around Indoor Air Handler", cause: "Clogged primary condensate drain line or cracked drain pan." },
      { symptom: "AC Unit Rapidly Short Cycling On and Off", cause: "Dirty evaporator coil, high-pressure limit switch tripping, or bad thermostat." },
      { symptom: "Circuit Breaker Tripping on AC Start", cause: "Compressor motor winding ground fault or defective hard-start capacitor." },
      { symptom: "Musty or Burning Odor Coming from Vents", cause: "Burned blower motor windings or microbial growth in duct plenum." },
    ],
    truckStockParts: [
      { name: "Dual Run Capacitors", spec: "35/5, 45/5, 55/5 MFD Universal Turbo 200" },
      { name: "Heavy-Duty Contactors", spec: "30A & 40A Single & Double Pole Sealed" },
      { name: "Condenser Fan Motors", spec: "1/4 to 1/3 HP Multi-Horsepower 1075 RPM" },
      { name: "Safety Float Switches", spec: "Magnetic Reed Secondary Drain Line Shut-off" },
      { name: "Universal Hard-Start Kits", spec: "SPP6 / 5-2-1 Compressor Torque Boosters" },
      { name: "Factory Refrigerant", spec: "Virgin R-410A & R-22 Diagnostic Cylinder" },
    ],
    aiTelemetry: {
      ambientTemp: 91,
      humidity: 82,
      powerGridStability: "99.4% Grid Stable (Minor Voltage Fluctuation Detected)",
      failureProbabilities: [
        { component: "Dual Run Capacitor Microfarad Drift", probability: 44, risk: "high" },
        { component: "Electrical Contactor Arc Pitting", probability: 28, risk: "medium" },
        { component: "Condensate Drain Line Sludge Clog", probability: 18, risk: "low" },
        { component: "Compressor Mechanical Valve Wear", probability: 10, risk: "low" },
      ],
      aiDiagnosticInsight: "High ambient heat (91°F) and 82% humidity currently place top mechanical stress on outdoor run capacitors. 44% of today's dispatched diagnostics in the metro area required capacitor replacement.",
      modelConfidence: 94.8,
      lastUpdatedMinutesAgo: 2,
    },
    assignedTechnicians: [
      MASTER_TECHNICIANS["carlos-mendez"],
      MASTER_TECHNICIANS["marcus-vance"],
      MASTER_TECHNICIANS["elena-rivera"],
    ],
  },

  "ac-tuneup": {
    slug: "ac-tuneup",
    title: "21-Point AC Maintenance & Tune-Up Special",
    shortTitle: "AC Tune-Up",
    category: "cooling",
    categoryLabel: "Preventative Maintenance",
    speedTier: "regular",
    speedBadge: "Regular Service · 60-Day Breakdown Guarantee",
    price: "$89 Special",
    duration: "60 min comprehensive",
    headlinePrefix: "Complete 21-Point AC Tune-Up for Just",
    highlightWord: "$89",
    headlineSuffix: "",
    description: "Prevent costly summer breakdowns, slash monthly power bills, and extend equipment lifespan. Our factory-certified specialists perform chemical coil rinses, electrical terminal torquing, and full delta-T efficiency tests.",
    image: "/images/svc-ac-tuneup.jpg",
    valueProps: {
      warranty: "60-Day No-Breakdown Guarantee",
      arrivalWindow: "Same-Day & Scheduled Slots",
      pricingNote: "$89 Flat Special (No Hidden Fees)",
    },
    bookHref: "/book?serviceId=svc-ac-tuneup",
    diagnosticPhases: [
      {
        phase: "Phase 01",
        title: "Condenser Coil Chemical Cleansing",
        desc: "Non-acid foaming rinse of aluminum fins to extract imbedded salt, dirt, and pet dander.",
        iconName: "Sparkles",
      },
      {
        phase: "Phase 02",
        title: "Nitrogen Condensate Blowout",
        desc: "High-pressure drain line flush with biocidal slow-release pan tablets inserted to prevent leaks.",
        iconName: "Wrench",
      },
      {
        phase: "Phase 03",
        title: "High-Voltage Terminal Torquing",
        desc: "Testing all capacitor microfarads (±5%), contactor resistance, and wire insulation integrity.",
        iconName: "Zap",
      },
      {
        phase: "Phase 04",
        title: "Subcooling & Temperature Split Verification",
        desc: "Digital gauge calibration to ensure the optimal 18°–22°F temperature differential across coils.",
        iconName: "ShieldCheck",
      },
    ],
    commonIssues: [
      { symptom: "Utility Bills Steadily Climbing Each Month", cause: "Dirty condenser fins forcing compressor to pull 30% more amperage." },
      { symptom: "Musty Mold Smell When AC Kicks On", cause: "Algae growth inside secondary drain pan or evaporator plenum." },
      { symptom: "Air Conditioner Running Non-Stop to Hit 74°F", cause: "Restricted airflow or microfarad loss causing motor to overheat." },
      { symptom: "Loud Vibration When Outdoor Fan Starts", cause: "Out-of-balance fan blades or loose compressor mounting isolation pads." },
      { symptom: "Occasional Water Dripping from Air Handler", cause: "Partial sludge buildup slowing condensate siphon flow." },
      { symptom: "Humidity Feeling Clammy Above 55% Indoors", cause: "Improper refrigerant superheat balance resulting in inadequate moisture removal." },
    ],
    truckStockParts: [
      { name: "Algae-Clear Pan Tablets", spec: "Slow-Release Quaternary Ammonium Biocide" },
      { name: "Condenser Fin Combs", spec: "Precision 8 to 20 Fins-Per-Inch Straightener" },
      { name: "OEM Contactor Relays", spec: "Siemens & Packard 30A 24V Coil Terminals" },
      { name: "Compressor Hard Starts", spec: "5-2-1 Potential Relay Capacitive Starters" },
      { name: "High-Pressure Nitrogen", spec: "40 cu. ft. Dry Nitrogen Line Blowout Tank" },
      { name: "Universal Air Filters", spec: "MERV 8 & 11 High-Flow Pleated Media" },
    ],
    aiTelemetry: {
      ambientTemp: 89,
      humidity: 78,
      powerGridStability: "100% Stable",
      failureProbabilities: [
        { component: "Condensate Drain Overflow Without Treatment", probability: 52, risk: "high" },
        { component: "Coil Efficiency Loss from Salt Accumulation", probability: 35, risk: "medium" },
        { component: "Run Capacitor Microfarad Degradation", probability: 22, risk: "low" },
        { component: "Blower Motor Bearing Friction", probability: 11, risk: "low" },
      ],
      aiDiagnosticInsight: "Units running past 6 months without chemical coil washing suffer an average 18% thermal efficiency drop, costing ~$42/month in extra electricity.",
      modelConfidence: 96.1,
      lastUpdatedMinutesAgo: 5,
    },
    assignedTechnicians: [
      MASTER_TECHNICIANS["carlos-mendez"],
      MASTER_TECHNICIANS["marcus-vance"],
      MASTER_TECHNICIANS["david-kim"],
    ],
  },

  "emergency-hvac": {
    slug: "emergency-hvac",
    title: "24/7 Priority Emergency HVAC Dispatch",
    shortTitle: "Emergency HVAC",
    category: "emergency",
    categoryLabel: "24/7 Priority Dispatch",
    speedTier: "fast",
    speedBadge: "Fast Service · Guaranteed Under 60 Minutes",
    price: "Priority Dispatch",
    duration: "Under 60 Min Arrival",
    headlinePrefix: "24/7 Emergency HVAC Repair in",
    highlightWord: "60 Minutes",
    headlineSuffix: "or Less",
    description: "When your AC drops out during brutal heatwaves or water starts pouring into your living room, our priority emergency fleet is rolling with on-duty master technicians staged across the metro area.",
    image: "/images/hero.jpg",
    valueProps: {
      warranty: "1-Year Workmanship Warranty",
      arrivalWindow: "15–25 Min Average ETA",
      pricingNote: "Zero Weekend or Late Night Surcharges",
    },
    bookHref: "/services/emergency-hvac",
    diagnosticPhases: [
      {
        phase: "Phase 01",
        title: "Immediate 5-Minute Dispatch",
        desc: "Your emergency booking directly pings the nearest GPS-staged rolling warehouse van.",
        iconName: "Zap",
      },
      {
        phase: "Phase 02",
        title: "Live GPS En-Route SMS Tracking",
        desc: "Receive real-time live map tracking, van number, and technician credentials on your phone.",
        iconName: "Sliders",
      },
      {
        phase: "Phase 03",
        title: "Mobile Rolling Warehouse Diagnostic",
        desc: "Vans carry 95% of universal OEM contactors, motors, capacitors, and refrigerant.",
        iconName: "Wrench",
      },
      {
        phase: "Phase 04",
        title: "Immediate On-Site Cold Air Restoration",
        desc: "Emergency repair completed on the first visit with upfront flat-rate approval.",
        iconName: "CheckCircle2",
      },
    ],
    commonIssues: [
      { symptom: "Complete AC Failure During 90°F+ Heat Wave", cause: "Blown dual run capacitor or grounded compressor motor." },
      { symptom: "Ceiling Leaking Water Under Air Handler", cause: "Clogged primary siphon drain with defective secondary float switch." },
      { symptom: "Loud Electrical Humming with Burnt Smell", cause: "Welded high-voltage contactor points shorting main lugs." },
      { symptom: "Condenser Fan Blade Stationary While Motor Sizzles", cause: "Burned auxiliary start winding or seized shaft sleeve bearing." },
      { symptom: "Coil Frozen Solid Into a Block of Ice", cause: "Complete refrigerant depletion or zero airflow from failed blower motor." },
      { symptom: "Thermostat Screen Blank & System Unresponsive", cause: "Blown 3A control board fuse or water float switch lockout." },
    ],
    truckStockParts: [
      { name: "Universal Turbo 200 Capacitors", spec: "Multi-Capacitance 2.5 to 67.5 MFD High Temp" },
      { name: "Heavy-Duty 40A Contactors", spec: "Sealed Magnetic Inrush Switching Contactors" },
      { name: "Refrigerant Recovery Stations", spec: "Appion G5 Twin Fast Refrigerant Extractor" },
      { name: "High-CFM Fan Motors", spec: "1/3 HP 208-230V Reversible Multi-Mount" },
      { name: "Digital Float Shut-Offs", spec: "Glow-LED Secondary Safe-T-Switch" },
      { name: "Direct OEM Transformers", spec: "40VA 120/208/240V Primary to 24V Secondary" },
    ],
    aiTelemetry: {
      ambientTemp: 92,
      humidity: 84,
      powerGridStability: "98.9% (Afternoon Brownout Surge Warnings)",
      failureProbabilities: [
        { component: "Thermal Overload Compressor Shutdown", probability: 48, risk: "high" },
        { component: "Run Capacitor Dielectric Breakdown", probability: 38, risk: "high" },
        { component: "Secondary Float Switch Water Trip", probability: 26, risk: "medium" },
        { component: "Contactor Coil Burnout", probability: 19, risk: "low" },
      ],
      aiDiagnosticInsight: "Thermal saturation detected across South Florida metro. Our AI fleet dispatch has staged 4 vans within 12 miles of major urban residential centers to maintain under-25-minute response times.",
      modelConfidence: 97.4,
      lastUpdatedMinutesAgo: 1,
    },
    assignedTechnicians: [
      MASTER_TECHNICIANS["carlos-mendez"],
      MASTER_TECHNICIANS["marcus-vance"],
      MASTER_TECHNICIANS["elena-rivera"],
    ],
  },

  "refrigerant-recharge": {
    slug: "refrigerant-recharge",
    title: "Refrigerant Leak Test & Eco-Recharge",
    shortTitle: "Refrigerant Recharge",
    category: "cooling",
    categoryLabel: "Refrigeration & EPA",
    speedTier: "medium",
    speedBadge: "Medium Time Service · Certified Subcooling",
    price: "$125/hr + Refrigerant",
    duration: "~60 min visit",
    headlinePrefix: "Pinpoint Refrigerant Leak Detection &",
    highlightWord: "Subcooling Balancing",
    headlineSuffix: "",
    description: "Never top off blindly. Adding freon without fixing leaks is illegal under EPA regulations and wastes money. We inject ultraviolet dye, pressurize with dry nitrogen, and balance exact manufacturer superheat.",
    image: "/images/svc-refrigerant-recharge.jpg",
    valueProps: {
      warranty: "1-Year Leak Seal Guarantee",
      arrivalWindow: "Same-Day Diagnostic Slots",
      pricingNote: "EPA Universal Certified Recovery",
    },
    bookHref: "/book?serviceId=svc-refrigerant-recharge",
    diagnosticPhases: [
      {
        phase: "Phase 01",
        title: "Digital Manifold Pressure Logging",
        desc: "Measuring vapor and liquid saturation temperatures against ambient ambient bulb conditions.",
        iconName: "Gauge",
      },
      {
        phase: "Phase 02",
        title: "Ultrasonic & Heated Diode Leak Sniffing",
        desc: "Pinpointing micro-fissures in copper U-bends and Schrader service valve cores down to 0.1 oz/yr.",
        iconName: "ThermometerSnowflake",
      },
      {
        phase: "Phase 03",
        title: "Dry Nitrogen Pressure Hold Test",
        desc: "Pressurizing closed coil circuit to 350 PSI to prove leak-tight integrity before charging.",
        iconName: "Wrench",
      },
      {
        phase: "Phase 04",
        title: "Digital Scale Subcooling Charge",
        desc: "Weighing in virgin R-410A with a certified digital scale to factory subcooling specifications (±1°F).",
        iconName: "ShieldCheck",
      },
    ],
    commonIssues: [
      { symptom: "Ice Layer Creeping Along Copper Refrigerant Line", cause: "Low suction pressure causing boiling refrigerant to drop below 32°F in coil." },
      { symptom: "Hissing Sound Near Evaporator Coil Inside House", cause: "Pinhole formicary corrosion pinhole leaking refrigerant under pressure." },
      { symptom: "Air Feels Mildly Cool but Humidity Stays Stifling", cause: "Insufficient refrigerant volume to drop coil surface below dew point." },
      { symptom: "Outdoor Unit Running Continuously Without Shutting Off", cause: "Compressor struggling to satisfy thermostat setpoint due to depleted gas." },
      { symptom: "Oily Residue Found Around Copper Service Valves", cause: "Refrigerant oil leaking past damaged Schrader core seals." },
      { symptom: "AC Freezes Up Again 3 Weeks After Being Charged", cause: "Unaddressed micro-leak venting newly added gas to the atmosphere." },
    ],
    truckStockParts: [
      { name: "Virgin Puron R-410A Cylinders", spec: "AHRI-700 Purity Certified 25 lb Containers" },
      { name: "Universal Schrader Valve Cores", spec: "Teflon High-Pressure Valve Cores & Caps" },
      { name: "Electronic Leak Detector Sniffers", spec: "Infrared Fieldpiece Heated Diode Sniffers" },
      { name: "HVAC UV Fluorescent Dyes", spec: "Solvent-Free Universal Dye Injection Cartridges" },
      { name: "Braze-Tite Nitrogen Regulator", spec: "0-500 PSI High-Purity Pressure Testing Rig" },
      { name: "Thermal Expansion Valves (TXV)", spec: "Danfoss & Sporlan R-410A Adjustable TXVs" },
    ],
    aiTelemetry: {
      ambientTemp: 90,
      humidity: 80,
      powerGridStability: "100% Stable",
      failureProbabilities: [
        { component: "Evaporator U-Bend Formicary Corrosion Leak", probability: 42, risk: "high" },
        { component: "Schrader Port Service Cap Leak", probability: 29, risk: "medium" },
        { component: "Thermal Expansion Valve (TXV) Hunting", probability: 16, risk: "low" },
        { component: "Liquid Line Filter Drier Restriction", probability: 13, risk: "low" },
      ],
      aiDiagnosticInsight: "South Florida coastal salt air accelerates aluminum-copper galvanic corrosion. AI diagnostics show evaporator coil leaks peak in systems aged 6–9 years.",
      modelConfidence: 95.2,
      lastUpdatedMinutesAgo: 3,
    },
    assignedTechnicians: [
      MASTER_TECHNICIANS["carlos-mendez"],
      MASTER_TECHNICIANS["marcus-vance"],
      MASTER_TECHNICIANS["david-kim"],
    ],
  },

  "duct-cleaning": {
    slug: "duct-cleaning",
    title: "Whole-Home Air Duct Cleaning & HEPA Sanitization",
    shortTitle: "Duct Cleaning",
    category: "iaq",
    categoryLabel: "Indoor Air Quality",
    speedTier: "regular",
    speedBadge: "Regular Service · Whole-Home Sanitization",
    price: "$249 Whole Home",
    duration: "~180 min service",
    headlinePrefix: "Medical-Grade HEPA Air Duct Cleaning &",
    highlightWord: "Antimicrobial Fogging",
    headlineSuffix: "",
    description: "Eliminate years of accumulated dust, mold spores, pet dander, and allergens from your ductwork. We deploy commercial negative-air vacuum extractors and EPA-registered botanical sanitizing fogging.",
    image: "/images/svc-duct-cleaning.jpg",
    valueProps: {
      warranty: "100% Odor & Dust Guarantee",
      arrivalWindow: "Scheduled Half-Day Arrival",
      pricingNote: "Upfront Whole-Home Flat Rate",
    },
    bookHref: "/book?serviceId=svc-duct-cleaning",
    diagnosticPhases: [
      {
        phase: "Phase 01",
        title: "Borescope Video Camera Inspection",
        desc: "Guiding a 1080p camera through main duct trunks to show live before footage of mold and dust.",
        iconName: "Sliders",
      },
      {
        phase: "Phase 02",
        title: "High-CFM HEPA Negative Air Seal",
        desc: "Creating 3,500 CFM negative vacuum pressure so zero dust escapes into your living space.",
        iconName: "Gauge",
      },
      {
        phase: "Phase 03",
        title: "Rotary Brush Agitation",
        desc: "Spinning mechanical agitation brushes down each register line to dislodge stuck debris.",
        iconName: "Wrench",
      },
      {
        phase: "Phase 04",
        title: "EPA-Registered Botanical Fogging",
        desc: "Atomizing plant-based thyme oil antimicrobial mist through the system to kill mold spores.",
        iconName: "Sparkles",
      },
    ],
    commonIssues: [
      { symptom: "Excessive Dust Accumulating on Furniture Within Days", cause: "Return air duct pulling unconditioned attic insulation and dust." },
      { symptom: "Musty or Mildew Smells Every Time Fan Starts", cause: "Microbial fungal colonies growing inside fiberglass duct liner." },
      { symptom: "Worsening Asthma or Allergy Symptoms Indoors", cause: "Dust mites, pollen, and pet dander circulating repeatedly through vents." },
      { symptom: "Uneven Airflow with Weak Air in Certain Bedrooms", cause: "Debris blockage or disconnected flex duct in the ceiling crawlspace." },
      { symptom: "Dark Sooty Rings Staining Around Ceiling Vents", cause: "High-velocity air escaping unsealed register boots pulling ceiling insulation." },
      { symptom: "Recent Home Remodel Left Fine Sheetrock Dust Everywhere", cause: "HVAC was run during drywall sanding, coating trunk lines with gypsum dust." },
    ],
    truckStockParts: [
      { name: "Negative Air HEPA Machines", spec: "3-Stage 0.3 Micron 3,500 CFM Commercial Extractor" },
      { name: "Rotary Air Duct Brushes", spec: "Nylon & Polyurethane Forward/Reverse Duct Whips" },
      { name: "Benefect Botanical Disinfectant", spec: "EPA-Registered Food-Contact Safe Thyme Fogging" },
      { name: "Aeroseal Duct Mastic Sealant", spec: "UL 181A-M Flexible Fiber-Reinforced Duct Mastic" },
      { name: "Borescope Inspection Scopes", spec: "50-Foot HD Fiber-Optic Articulating Video Camera" },
      { name: "Custom Register Magnetic Covers", spec: "Negative Pressure Isolation Vent Dampers" },
    ],
    aiTelemetry: {
      ambientTemp: 88,
      humidity: 76,
      powerGridStability: "100% Stable",
      failureProbabilities: [
        { component: "Return Duct Attic Leakage & Insulation Infiltration", probability: 46, risk: "high" },
        { component: "Supply Plenum Mold Spore Colonization", probability: 34, risk: "medium" },
        { component: "Register Boot Seal Separation", probability: 25, risk: "medium" },
        { component: "Blower Squirrel Cage Dust Loading", probability: 15, risk: "low" },
      ],
      aiDiagnosticInsight: "High summer humidity creates ideal condensation points inside fiberglass duct plenums. AI IAQ models recommend complete HEPA sanitization every 3 years in subtropical climates.",
      modelConfidence: 94.2,
      lastUpdatedMinutesAgo: 6,
    },
    assignedTechnicians: [
      MASTER_TECHNICIANS["david-kim"],
      MASTER_TECHNICIANS["carlos-mendez"],
      MASTER_TECHNICIANS["marcus-vance"],
    ],
  },

  "furnace-repair": {
    slug: "furnace-repair",
    title: "Furnace & Heat Pump Safety Repair",
    shortTitle: "Furnace Repair",
    category: "heating",
    categoryLabel: "Heating & Heat Pumps",
    speedTier: "medium",
    speedBadge: "Medium Time Service · Safety Certified",
    price: "$129 Flat Diagnostic",
    duration: "~90 min visit",
    headlinePrefix: "Emergency Heating, Heat Pump &",
    highlightWord: "Electric Furnace Repair",
    headlineSuffix: "",
    description: "When chilly winter cold fronts roll into Florida, an unexpected heating failure can leave your home shivering. Our technicians diagnose electric heat strips, reversing valves, and sequencer relays with 100% upfront pricing.",
    image: "/images/svc-furnace-repair.jpg",
    valueProps: {
      warranty: "1-Year Workmanship Warranty",
      arrivalWindow: "Same-Day Diagnostic Slots",
      pricingNote: "$129 Flat Rate (Credited Toward Repair)",
    },
    bookHref: "/book?serviceId=svc-furnace-repair",
    diagnosticPhases: [
      {
        phase: "Phase 01",
        title: "High-Amperage Heating Strip Load Test",
        desc: "Measuring kilowatt power draw across nickel-chromium electric heat coils with clamp meters.",
        iconName: "Flame",
      },
      {
        phase: "Phase 02",
        title: "Safety Thermal Cutoff Inspection",
        desc: "Verifying high-limit safety switches to protect against overheating hazards and fire risk.",
        iconName: "ShieldCheck",
      },
      {
        phase: "Phase 03",
        title: "Heat Pump Reversing Valve Diagnostics",
        desc: "Testing 4-way solenoid valve operation to ensure seamless switching between cooling and heating.",
        iconName: "Sliders",
      },
      {
        phase: "Phase 04",
        title: "Sequencer Relay & Blower Timing Check",
        desc: "Ensuring stepped energization so your home circuit breaker does not trip under full heating load.",
        iconName: "Zap",
      },
    ],
    commonIssues: [
      { symptom: "Heat Pump Blowing Cool Air in Heating Mode", cause: "Defective 4-way reversing valve solenoid coil or auxiliary heat strip lock." },
      { symptom: "Burning Electrical Odor on First Cold Day", cause: "Accumulated dust burning off heating elements, or melted sequencer wiring lugs." },
      { symptom: "Heater Runs for 2 Minutes Then Shuts Down", cause: "Primary high-temperature limit switch tripping due to low blower airflow." },
      { symptom: "Air Handler Circuit Breaker Trips Immediately When Heat Starts", cause: "Grounded electric heat element wire touching the metal chassis." },
      { symptom: "Outdoor Heat Pump Freezing Solid into a Block of Ice", cause: "Failed defrost control board, stuck defrost thermostat, or bad reversing valve." },
      { symptom: "Blower Fan Keeps Running Even After Heater Turns Off", cause: "Stuck fan delay relay or defective sequencer switch contacts." },
    ],
    truckStockParts: [
      { name: "Electric Heat Strip Elements", spec: "5 kW, 8 kW & 10 kW Nichrome Open Coils" },
      { name: "Heat Sequencer Relays", spec: "Packard & Supco Multi-Stage Thermal Sequencers" },
      { name: "High-Limit Safety Cutouts", spec: "Automatic Reset 130°F–170°F Bimetal Switches" },
      { name: "Heat Pump Reversing Solenoids", spec: "24V AC Universal 4-Way Solenoid Coils" },
      { name: "Defrost Control Boards", spec: "Universal Demand & Time-Temperature Boards" },
      { name: "Heavy-Gauge Heat Wire Lugs", spec: "High-Temperature Ceramic Wire Terminals" },
    ],
    aiTelemetry: {
      ambientTemp: 64,
      humidity: 55,
      powerGridStability: "99.8% Stable",
      failureProbabilities: [
        { component: "Electric Heat Sequencer Relay Failure", probability: 41, risk: "high" },
        { component: "High-Limit Thermal Safety Switch Trip", probability: 31, risk: "medium" },
        { component: "Heat Pump Defrost Sensor Drift", probability: 18, risk: "low" },
        { component: "Reversing Valve 4-Way Solenoid Hang", probability: 10, risk: "low" },
      ],
      aiDiagnosticInsight: "Electric heat strips sitting idle for 9 months accumulate dust and oxidation. During cold snaps, sequencer failure spikes 3.8x as systems call for stage-2 auxiliary heat.",
      modelConfidence: 93.9,
      lastUpdatedMinutesAgo: 4,
    },
    assignedTechnicians: [
      MASTER_TECHNICIANS["marcus-vance"],
      MASTER_TECHNICIANS["carlos-mendez"],
      MASTER_TECHNICIANS["elena-rivera"],
    ],
  },

  "thermostat-install": {
    slug: "thermostat-install",
    title: "Smart Thermostat Installation & WiFi Calibration",
    shortTitle: "Smart Thermostat",
    category: "cooling",
    categoryLabel: "Smart Automation",
    speedTier: "regular",
    speedBadge: "Regular Service · Smart Home Certified",
    price: "$149 Flat Rate",
    duration: "~60 min visit",
    headlinePrefix: "Professional Smart Thermostat Installation for",
    highlightWord: "Nest, Ecobee & Honeywell",
    headlineSuffix: "",
    description: "Upgrade to effortless climate automation. We pull proper 24V common wires (C-wire), configure heat pump multi-stage wiring, balance temperature schedules, and connect your mobile smartphone app on-site.",
    image: "/images/svc-thermostat-install.jpg",
    valueProps: {
      warranty: "1-Year Workmanship Warranty",
      arrivalWindow: "Same-Day & Scheduled Slots",
      pricingNote: "$149 Flat Rate (No Hidden Fees)",
    },
    bookHref: "/book?serviceId=svc-thermostat-install",
    diagnosticPhases: [
      {
        phase: "Phase 01",
        title: "24V C-Wire Power Voltage Testing",
        desc: "Checking transformer secondary voltage to prevent low-power Wi-Fi disconnects and battery drain.",
        iconName: "Zap",
      },
      {
        phase: "Phase 02",
        title: "Precision Backplate Mounting",
        desc: "Patching existing wall screw holes, level mounting, and installing trim cosmetic trim plates.",
        iconName: "Wrench",
      },
      {
        phase: "Phase 03",
        title: "HVAC Multi-Stage Configuration",
        desc: "Programming auxiliary heat lockouts, compressor minimum run timers, and humidity deadbands.",
        iconName: "Sliders",
      },
      {
        phase: "Phase 04",
        title: "Smartphone App Sync & Homeowner Demo",
        desc: "Pairing iOS / Android app, setting geo-fencing home/away modes, and verifying remote control.",
        iconName: "CheckCircle2",
      },
    ],
    commonIssues: [
      { symptom: "Smart Thermostat Keeps Shutting Off or Losing WiFi", cause: "Missing dedicated 24V C-wire forcing thermostat to pulse-charge battery." },
      { symptom: "AC Blows Heat Instead of Cold After Self-Installing", cause: "Reversing valve (O/B terminal) misconfigured between Rheem vs other brands." },
      { symptom: "Auxiliary Electric Heat Turning On During 78°F Weather", cause: "Second-stage heat differential set too narrow in advanced installer menu." },
      { symptom: "Thermostat Screen Flashing Low Battery Warning", cause: "Transformer power drop or incompatible 4-wire power sharing dongle." },
      { symptom: "Indoor Humidity Levels Creeping Up While Temp Stays Set", cause: "Thermostat overcooling without proper variable-speed fan dehumidification." },
      { symptom: "System Short-Cycling Every 4 Minutes", cause: "Compressor cycle rate per hour (CPH) set too high in digital configuration." },
    ],
    truckStockParts: [
      { name: "C-Wire Power Transformers", spec: "120V to 24V AC 40VA Heavy Duty Step-Down" },
      { name: "Fast-Stat Common Makers", spec: "Universal 2-Wire to 4-Wire Multiplexer Modules" },
      { name: "Thermostat Wall Trim Plates", spec: "Universal Color-Matched Cosmetic Wall Covers" },
      { name: "Multi-Zone Damper Actuators", spec: "Belimo 24V Power-Open Spring-Return Actuators" },
      { name: "Indoor Remote Temp Sensors", spec: "Bluetooth Ecobee & Nest Smart Room Sensors" },
      { name: "High-Grade Thermostat Wire", spec: "18/8 Solid Copper Shielded Control Cable" },
    ],
    aiTelemetry: {
      ambientTemp: 87,
      humidity: 72,
      powerGridStability: "100% Stable",
      failureProbabilities: [
        { component: "Missing C-Wire Voltage Siphon Instability", probability: 47, risk: "high" },
        { component: "Reversing Valve O/B Logic Misconfiguration", probability: 36, risk: "medium" },
        { component: "Multi-Stage Auxiliary Heat Lockout Drift", probability: 21, risk: "low" },
        { component: "Wall Cavity Air Draft False Temperature Reading", probability: 14, risk: "low" },
      ],
      aiDiagnosticInsight: "Over 68% of DIY smart thermostat installations fail due to lack of a continuous 24V common wire, which can burn out control boards on modern inverter systems.",
      modelConfidence: 96.5,
      lastUpdatedMinutesAgo: 5,
    },
    assignedTechnicians: [
      MASTER_TECHNICIANS["david-kim"],
      MASTER_TECHNICIANS["carlos-mendez"],
      MASTER_TECHNICIANS["marcus-vance"],
    ],
  },

  "commercial-hvac": {
    slug: "commercial-hvac",
    title: "Commercial Rooftop RTU & Facility Maintenance",
    shortTitle: "Commercial HVAC",
    category: "commercial",
    categoryLabel: "Commercial & RTU",
    speedTier: "regular",
    speedBadge: "Commercial Regular · Net 30 Terms Available",
    price: "Custom Estimate",
    duration: "Scheduled Dispatch",
    headlinePrefix: "Turnkey Commercial HVAC, Rooftop RTU &",
    highlightWord: "Facility Preventative Care",
    headlineSuffix: "",
    description: "Keep your business comfortable, code-compliant, and energy efficient. We service 3-phase commercial rooftop units (RTUs), chillers, economizers, and multi-zone VRF systems with dedicated account managers.",
    image: "/images/svc-commercial-hvac.jpg",
    valueProps: {
      warranty: "1-Year Commercial Warranty",
      arrivalWindow: "Dedicated Corporate SLA",
      pricingNote: "Net 30 Invoicing for Qualified Accounts",
    },
    bookHref: "/contact?commercial=true",
    diagnosticPhases: [
      {
        phase: "Phase 01",
        title: "3-Phase Voltage & Phase Imbalance Audit",
        desc: "Checking 480V / 208V power quality to prevent catastrophic 3-phase motor single-phasing burnouts.",
        iconName: "Zap",
      },
      {
        phase: "Phase 02",
        title: "Enthalpy Economizer & Damper Check",
        desc: "Testing motorized outdoor air dampers and differential dry-bulb sensors for free cooling mode.",
        iconName: "Sliders",
      },
      {
        phase: "Phase 03",
        title: "Belt Tensioning & Blower Alignment",
        desc: "Laser aligning cast-iron sheaves and adjusting Browning cogged V-belt deflection.",
        iconName: "Wrench",
      },
      {
        phase: "Phase 04",
        title: "Asset Digital Logbook & Quarterly PM",
        desc: "Uploading serial numbers, megohmmeter compressor logs, and EPA refrigerant balance to facility portal.",
        iconName: "CheckCircle2",
      },
    ],
    commonIssues: [
      { symptom: "Commercial RTU Tripping High Pressure Switch on Hot Days", cause: "Severely clogged outdoor condenser coils or failed condenser fan cycling control." },
      { symptom: "Squealing Noise Echoing Through Office Ceiling Plenums", cause: "Worn or loose V-belt slipping on the blower motor sheave." },
      { symptom: "Excessive Humidity & Stuffy Air in Conference Rooms", cause: "Outside air economizer damper stuck open during humid 90°F weather." },
      { symptom: "Tenants Complaining of Hot and Cold Spots Across Building", cause: "VAV box actuator motor failure or zone thermostat communication drop." },
      { symptom: "Water Stains Appearing on Commercial Ceiling Tiles", cause: "Rooftop RTU primary drain clogged with roof debris or rusted secondary pan." },
      { symptom: "3-Phase Compressor Motor Drawing Unequal Amperage", cause: "Pitted 3-pole commercial contactor or electrical supply voltage imbalance." },
    ],
    truckStockParts: [
      { name: "3-Pole Commercial Contactors", spec: "Siemens 40A, 50A & 60A 24V / 120V Coils" },
      { name: "Heavy-Duty Cogged V-Belts", spec: "Gates & Browning AX, BX & 4L Series Belts" },
      { name: "Honeywell Economizer Modules", spec: "W7220 Jade Multi-Sensor Digital Controllers" },
      { name: "Phase Monitor Protection Relays", spec: "SymCom MotorSaver 3-Phase Loss Detectors" },
      { name: "Commercial Crankcase Heaters", spec: "Self-Regulating Belly-Band Compressor Heaters" },
      { name: "Heavy Refrigerant Recovery Rigs", spec: "High-Volume Dual Piston Commercial Extractors" },
    ],
    aiTelemetry: {
      ambientTemp: 91,
      humidity: 81,
      powerGridStability: "99.2% (Industrial Park Peak Demand Fluctuation)",
      failureProbabilities: [
        { component: "3-Phase Contactor Contact Erosion", probability: 43, risk: "high" },
        { component: "Economizer Damper Actuator Binding", probability: 33, risk: "medium" },
        { component: "Blower Motor V-Belt Slippage", probability: 21, risk: "low" },
        { component: "Crankcase Heater Open Circuit", probability: 12, risk: "low" },
      ],
      aiDiagnosticInsight: "Commercial RTUs operating past 500 runtime hours without belt retensioning lose ~14% CFM airflow, increasing tenant hot/cold comfort complaints by 3.2x.",
      modelConfidence: 95.8,
      lastUpdatedMinutesAgo: 2,
    },
    assignedTechnicians: [
      MASTER_TECHNICIANS["elena-rivera"],
      MASTER_TECHNICIANS["carlos-mendez"],
      MASTER_TECHNICIANS["marcus-vance"],
    ],
  },
};
