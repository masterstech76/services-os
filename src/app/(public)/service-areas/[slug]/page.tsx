import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Calendar,
  Wrench,
  ThermometerSnowflake,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface AreaData {
  slug: string;
  name: string;
  city: string;
  state: string;
  zipCodes: string[];
  etaMinutes: number;
  description: string;
  landmarks: string[];
  popularServices: string[];
  highlight: string;
}

const SERVICE_AREAS: Record<string, AreaData> = {
  brickell: {
    slug: "brickell",
    name: "Brickell",
    city: "Miami",
    state: "FL",
    zipCodes: ["33129", "33130", "33131"],
    etaMinutes: 25,
    description:
      "High-rise condominium and commercial HVAC specialists providing whisper-quiet heat pumps, PTAC units, and chilled water fan coil maintenance across Brickell Avenue and Financial District.",
    landmarks: ["Brickell City Centre", "Brickell Key", "Mary Brickell Village", "South Miami Ave"],
    popularServices: [
      "Condo AC Diagnostic & Coil Cleaning",
      "High-Rise Chilled Water Unit Repair",
      "Smart Thermostat Integration",
      "Emergency Leak & Drain Pan Clearing",
    ],
    highlight: "Dedicated high-rise certified technicians equipped for tight condo utility closets.",
  },
  "downtown-miami": {
    slug: "downtown-miami",
    name: "Downtown Miami",
    city: "Miami",
    state: "FL",
    zipCodes: ["33128", "33132", "33136"],
    etaMinutes: 30,
    description:
      "24/7 rapid HVAC dispatch for Downtown Miami lofts, office towers, retail storefronts, and residences along Biscayne Boulevard.",
    landmarks: ["Bayside Marketplace", "Bayfront Park", "FTX Arena District", "Government Center"],
    popularServices: [
      "Commercial Rooftop Unit Maintenance",
      "Emergency Blower Motor Replacement",
      "Ductwork Sanitization & Air Quality",
      "Refrigerant Leak Detection",
    ],
    highlight: "Rapid 30-minute arrival guaranteed with dedicated downtown parking clearance.",
  },
  "coral-gables": {
    slug: "coral-gables",
    name: "Coral Gables",
    city: "Miami",
    state: "FL",
    zipCodes: ["33134", "33146"],
    etaMinutes: 35,
    description:
      "Historic Mediterranean home HVAC retrofit experts, dual-zone inverter heat pumps, and aesthetic low-profile exterior condenser installations in The City Beautiful.",
    landmarks: ["Miracle Mile", "Biltmore Hotel", "Venetian Pool", "University of Miami"],
    popularServices: [
      "Historic Home Ductless Mini-Split Installation",
      "Full System Energy-Efficiency Replacement",
      "Whole-Home Dehumidifier Integration",
      "Annual Preventative Maintenance Club",
    ],
    highlight: "Strict architectural code compliance and respectful historic home care.",
  },
  "coconut-grove": {
    slug: "coconut-grove",
    name: "Coconut Grove",
    city: "Miami",
    state: "FL",
    zipCodes: ["33133"],
    etaMinutes: 30,
    description:
      "Coastal humidity control, salt-air corrosion resistant condenser upgrades, and high-efficiency central air tune-ups in Coconut Grove.",
    landmarks: ["CocoWalk", "The Barnacle", "Dinner Key Marina", "Main Highway"],
    popularServices: [
      "Marine/Coastal Corrosion Protection",
      "High-SEER2 Heat Pump Replacement",
      "UV Germicidal Air Purifiers",
      "Emergency Capacitor & Contactor Repair",
    ],
    highlight: "Salt-resistant coastal coating and humidity regulation experts.",
  },
  "miami-beach": {
    slug: "miami-beach",
    name: "Miami Beach",
    city: "Miami Beach",
    state: "FL",
    zipCodes: ["33139", "33140"],
    etaMinutes: 40,
    description:
      "Art Deco district and oceanfront condominium climate control specialists. Fast barrier island dispatch for residential homes and hospitality venues.",
    landmarks: ["Ocean Drive", "Lincoln Road", "South of Fifth", "Mid Beach"],
    popularServices: [
      "Salt Air Condenser Coil Rinse & Protection",
      "Condo Fan Coil Valve Actuator Replacement",
      "Rapid Refrigerant Recharge",
      "Quiet Inverter Compressor Upgrades",
    ],
    highlight: "Causeway-ready dispatched vans stocked with multi-brand replacement parts.",
  },
  kendall: {
    slug: "kendall",
    name: "Kendall",
    city: "Miami",
    state: "FL",
    zipCodes: ["33143", "33144"],
    etaMinutes: 40,
    description:
      "Suburban residential split-system replacements, air duct sealing, attic insulation checks, and same-day AC repair for Kendall families.",
    landmarks: ["Dadeland Mall", "Baptist Hospital Area", "The Falls", "Kendall Town Center"],
    popularServices: [
      "Same-Day AC Breakdown Repair",
      "Full System Replacement with 10-Yr Warranty",
      "Air Duct Deep Cleaning & Sanitizing",
      "Wi-Fi Smart Thermostat Setup",
    ],
    highlight: "Family-friendly flat-rate pricing with zero overtime weekend surcharges.",
  },
  doral: {
    slug: "doral",
    name: "Doral",
    city: "Doral",
    state: "FL",
    zipCodes: ["33126", "33125"],
    etaMinutes: 35,
    description:
      "Commercial warehouse climate regulation, corporate headquarters rooftop HVAC maintenance, and modern townhome system tune-ups in Doral.",
    landmarks: ["CityPlace Doral", "Downtown Doral", "Doral Central Park", "Trump National"],
    popularServices: [
      "Light Commercial Packaged Units",
      "Smart Multi-Zone Thermostat Controls",
      "Capacitor, Fan Motor & Coil Servicing",
      "Commercial Preventative Maintenance Contracts",
    ],
    highlight: "Commercial and residential dispatch teams on standby 24 hours a day.",
  },
  pinecrest: {
    slug: "pinecrest",
    name: "Pinecrest",
    city: "Pinecrest",
    state: "FL",
    zipCodes: ["33156"],
    etaMinutes: 45,
    description:
      "Luxury estate multi-stage inverter cooling, wine room refrigeration, and ultra-high efficiency variable-speed HVAC systems in Pinecrest.",
    landmarks: ["Pinecrest Gardens", "Evelyn Greer Park", "SW 104th St Corridor"],
    popularServices: [
      "Variable-Capacity Inverter HVAC Systems",
      "Wine Cellar Climate Maintenance",
      "HEPA & Electronic Air Cleaners",
      "VIP Priority Membership Inspections",
    ],
    highlight: "White-glove service standard for high-tonnage multi-system estates.",
  },
  "key-biscayne": {
    slug: "key-biscayne",
    name: "Key Biscayne",
    city: "Key Biscayne",
    state: "FL",
    zipCodes: ["33149"],
    etaMinutes: 45,
    description:
      "Island-ready emergency air conditioning repairs, coastal anti-corrosion coil protection, and luxury apartment heat pump replacements.",
    landmarks: ["Crandon Park", "Bill Baggs Cape Florida", "Crandon Boulevard"],
    popularServices: [
      "Island Emergency Breakdown Response",
      "Severe Salt Fog Anti-Corrosion Defense",
      "Water-Source Heat Pump Servicing",
      "Seasonal Turn-On Inspection",
    ],
    highlight: "Dedicated island dispatch team carrying all standard marine-grade components.",
  },
  wynwood: {
    slug: "wynwood",
    name: "Wynwood",
    city: "Miami",
    state: "FL",
    zipCodes: ["33127"],
    etaMinutes: 25,
    description:
      "Creative arts district lofts, converted warehouse studios, and boutique retail commercial VRF and mini-split heat pump service.",
    landmarks: ["Wynwood Walls", "NW 2nd Ave", "Wynwood Marketplace", "Mana Wynwood"],
    popularServices: [
      "Ductless Mini-Split Zoned Cooling",
      "Warehouse High-Ceiling Fan Coils",
      "Boutique Retail Fast Diagnostics",
      "Emergency Capacitor Replacement",
    ],
    highlight: "Specialized in industrial-chic exposed ductwork and aesthetic mini-split configurations.",
  },
  aventura: {
    slug: "aventura",
    name: "Aventura",
    city: "Aventura",
    state: "FL",
    zipCodes: ["33180"],
    etaMinutes: 35,
    description:
      "Waterfront residential towers, condominium chilled water loops, and single-family central AC maintenance in northeast Miami-Dade.",
    landmarks: ["Aventura Mall", "Turnberry Isle", "Williams Island", "Country Club Drive"],
    popularServices: [
      "Condominium Fan Coil Servicing",
      "High-Efficiency Inverter Systems",
      "Whole-Home Dehumidification",
      "Smart Ecobee & Nest Calibration",
    ],
    highlight: "Security gate and condominium HOA protocol compliant technicians.",
  },
  "sunny-isles": {
    slug: "sunny-isles",
    name: "Sunny Isles Beach",
    city: "Sunny Isles Beach",
    state: "FL",
    zipCodes: ["33160"],
    etaMinutes: 40,
    description:
      "Oceanfront luxury high-rise condominium climate control, marine salt spray coil coating, and precision humidity regulation.",
    landmarks: ["Collins Avenue Oceanfront", "Pier Park", "Samson Oceanfront Park", "Heritage Park"],
    popularServices: [
      "Marine Anti-Corrosion Coil Rinse",
      "Condo Fan Coil Actuator Valves",
      "UV Germicidal Air Sterilization",
      "Emergency Cooling Restoration",
    ],
    highlight: "Equipped for oceanfront high-rises with direct freight elevator access protocols.",
  },
  "south-miami": {
    slug: "south-miami",
    name: "South Miami",
    city: "South Miami",
    state: "FL",
    zipCodes: ["33143"],
    etaMinutes: 30,
    description:
      "Established single-family homes, charming retail corridors, high-efficiency SEER2 replacements, and same-day AC diagnostics.",
    landmarks: ["Sunset Place", "South Miami Hospital Area", "Sunset Drive Corridor", "Dante Fascell Park"],
    popularServices: [
      "Split-System Compressor Diagnostics",
      "Air Duct Sanitization & Sealing",
      "Seasonal Preventative Tune-Ups",
      "Wi-Fi Smart Thermostat Installs",
    ],
    highlight: "Family-first neighborhood pricing with comprehensive 1-year parts and labor warranty.",
  },
  miami: {
    slug: "miami",
    name: "Miami Downtown & Midtown",
    city: "Miami",
    state: "FL",
    zipCodes: ["33127", "33128", "33130", "33131", "33132", "33137"],
    etaMinutes: 25,
    description:
      "30-minute rapid dispatch hub for the Miami urban core, Midtown residential towers, Edgewater condominiums, and commercial districts.",
    landmarks: ["Midtown Miami", "Design District", "Edgewater", "Bayside & Bayfront Park"],
    popularServices: [
      "24/7 Emergency AC Breakdown Repair",
      "High-Rise Chilled Water & Fan Coil Service",
      "OEM Dual Run Capacitor & Contactor Swaps",
      "Smart Thermostat & Zoning Integration",
    ],
    highlight: "Central Miami fleet depot offering the fastest 25-minute response times in Dade County.",
  },
  "fort-lauderdale": {
    slug: "fort-lauderdale",
    name: "Fort Lauderdale Metro",
    city: "Fort Lauderdale",
    state: "FL",
    zipCodes: ["33301", "33304", "33308", "33316"],
    etaMinutes: 35,
    description:
      "Broward County commercial and residential fast-dispatch operations covering Las Olas Isles, Victoria Park, and waterfront estates.",
    landmarks: ["Las Olas Boulevard", "Victoria Park", "Rio Vista", "Fort Lauderdale Beach"],
    popularServices: [
      "Marine-Grade Anti-Corrosion Condenser Upgrades",
      "Whole-Home High-SEER2 Heat Pump Replacements",
      "Emergency Refrigerant Leak Detection & Recharge",
      "HEPA Air Duct Cleaning & Antimicrobial Fogging",
    ],
    highlight: "Dedicated Broward County fleet stationed along I-95 and US-1 for rapid dispatch.",
  },
  hollywood: {
    slug: "hollywood",
    name: "Hollywood & Dania Beach",
    city: "Hollywood",
    state: "FL",
    zipCodes: ["33019", "33020", "33021", "33004"],
    etaMinutes: 35,
    description:
      "Full-service HVAC maintenance, coastal salt-air condenser protection, and 24/7 emergency cooling restoration across Hollywood Hills and Dania Beach.",
    landmarks: ["Hollywood Beach Broadwalk", "Young Circle", "Emerald Hills", "Dania Pointe"],
    popularServices: [
      "Same-Day AC Compressor & Fan Motor Repair",
      "21-Point Seasonal Precision Tune-Up",
      "Coastal Coil Anti-Corrosion Treatment",
      "Condensate Drain Line Hydro-Flushing",
    ],
    highlight: "Upfront flat-rate pricing with zero weekend or evening overtime surcharges.",
  },
  "pembroke-pines": {
    slug: "pembroke-pines",
    name: "Pembroke Pines",
    city: "Pembroke Pines",
    state: "FL",
    zipCodes: ["33024", "33026", "33028", "33029"],
    etaMinutes: 40,
    description:
      "Suburban single-family whole-home HVAC replacement, multi-zone smart cooling, and attic ductwork sanitization for Pembroke Pines communities.",
    landmarks: ["Shops at Pembroke Gardens", "Chapel Trail", "SilverLakes", "C.B. Smith Park"],
    popularServices: [
      "Complete Central AC System Replacement",
      "Attic Air Duct Sealing & HEPA Cleaning",
      "Smart Ecobee & Honeywell Zoning Setup",
      "Emergency Capacitor & Blower Motor Overhaul",
    ],
    highlight: "HOA-approved exterior installations backed by a 10-year manufacturer warranty.",
  },
  miramar: {
    slug: "miramar",
    name: "Miramar Communities",
    city: "Miramar",
    state: "FL",
    zipCodes: ["33023", "33025", "33027"],
    etaMinutes: 35,
    description:
      "High-SEER2 variable-speed system installations, indoor air quality UV upgrades, and rapid residential AC repair across Miramar.",
    landmarks: ["Miramar Regional Park", "Miramar Town Center", "Sunset Lakes", "Monarch Lakes"],
    popularServices: [
      "High-Efficiency Inverter Heat Pump Installs",
      "UV-C Germicidal Coil Sterilization",
      "Same-Day Diagnostic & Cooling Restoration",
      "Annual VIP Preventative Maintenance Plans",
    ],
    highlight: "Stationed West Broward technicians ready for sub-40 minute arrival windows.",
  },
  hialeah: {
    slug: "hialeah",
    name: "Hialeah Operations",
    city: "Hialeah",
    state: "FL",
    zipCodes: ["33010", "33012", "33014", "33016", "33018"],
    etaMinutes: 30,
    description:
      "Industrial warehouse packaged rooftop units and residential split-system cooling repair dispatch center serving Greater Hialeah and Miami Lakes.",
    landmarks: ["Hialeah Park", "Westland Mall Corridor", "Palm Springs Mile", "Amelia Earhart Park"],
    popularServices: [
      "Commercial Rooftop RTU Diagnostics & Repair",
      "Residential Central AC Capacitor & Fan Replacement",
      "EPA-Certified R-410A & R-32 Refrigerant Recharge",
      "Bilingual 24/7 Dispatch & Customer Support",
    ],
    highlight: "Fully stocked commercial and residential vans staged in Northwest Miami-Dade.",
  },
  "boca-raton": {
    slug: "boca-raton",
    name: "Boca Raton Coastal",
    city: "Boca Raton",
    state: "FL",
    zipCodes: ["33431", "33432", "33433", "33434", "33487"],
    etaMinutes: 40,
    description:
      "Palm Beach County premier residential estate HVAC replacement, country club villa climate control, and whisper-quiet inverter systems.",
    landmarks: ["Mizner Park", "Royal Palm Yacht & Country Club", "Town Center at Boca Raton", "Red Reef Park"],
    popularServices: [
      "Luxury Estate Multi-Zone Inverter HVAC",
      "Wine Cellar & Humidity Precision Control",
      "Marine Coastal Condenser Protection",
      "24/7 Priority Emergency Dispatch",
    ],
    highlight: "White-glove certified master technicians with shoe-cover property protection.",
  },
  "delray-beach": {
    slug: "delray-beach",
    name: "Delray Beach Downtown",
    city: "Delray Beach",
    state: "FL",
    zipCodes: ["33444", "33445", "33446", "33483"],
    etaMinutes: 45,
    description:
      "Historic downtown commercial hospitality cooling and suburban home climate diagnostics across Atlantic Avenue and coastal Delray Beach.",
    landmarks: ["Atlantic Avenue", "Pineapple Grove Arts District", "Wakodahatchee Wetlands", "Delray Municipal Beach"],
    popularServices: [
      "Boutique Commercial & Restaurant HVAC Repair",
      "Residential Split-System Tune-Ups & Diagnostics",
      "Ductless Mini-Split Installations",
      "Indoor Air Quality & Dehumidification",
    ],
    highlight: "Rapid Palm Beach corridor response with transparent flat-rate quotes.",
  },
  "west-palm-beach": {
    slug: "west-palm-beach",
    name: "West Palm Beach Regional",
    city: "West Palm Beach",
    state: "FL",
    zipCodes: ["33401", "33405", "33407", "33409"],
    etaMinutes: 45,
    description:
      "Northern territory emergency HVAC response, downtown commercial tower maintenance, and historic neighborhood cooling upgrades.",
    landmarks: ["The Square (CityPlace)", "Clematis Street", "El Cid Historic District", "Flagler Drive Waterfront"],
    popularServices: [
      "24/7 Emergency AC Repair & Diagnostics",
      "Historic Home High-Efficiency Retrofits",
      "Commercial Packaged Unit Maintenance",
      "Complete Air Duct Cleaning & Sanitization",
    ],
    highlight: "Regional Palm Beach dispatch hub covering residential and commercial accounts.",
  },
};

export async function generateStaticParams() {
  return Object.keys(SERVICE_AREAS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = SERVICE_AREAS[slug];
  if (!area) {
    return { title: `Service Area Not Found | ${businessConfig.businessName}` };
  }
  return {
    title: `${area.name}, ${area.state} HVAC Repair & Emergency AC Service | ${businessConfig.businessName}`,
    description: `Fast ${area.etaMinutes}-minute HVAC response in ${area.name}, ${area.state}. Serving ZIP codes ${area.zipCodes.join(", ")}. Licensed, insured, 100% satisfaction guaranteed.`,
  };
}

export default async function ServiceAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = SERVICE_AREAS[slug];

  if (!area) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0C1523] text-white selection:bg-[#F97316] selection:text-white pb-20">
      <Breadcrumbs
        items={[
          { label: "Service Areas", href: "/areas" },
          { label: area.name },
        ]}
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:py-20 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/25 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {area.city}, {area.state}
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {area.etaMinutes}-Min Average Dispatch
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            HVAC &amp; Air Conditioning Services in {area.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            {area.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Button
              asChild
              className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-6 py-6 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Link href="/book" className="flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                Book {area.name} Technician
              </Link>
            </Button>
            <a
              href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-200 hover:text-white px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all"
            >
              <Phone className="h-4 w-4 text-[#F97316]" />
              Call {businessConfig.phone} (24/7)
            </a>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative z-20">
        {/* Coverage Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 p-6 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl space-y-2 hover:border-orange-500/30 transition-all">
            <div className="flex items-center gap-2 text-[#F97316] font-bold text-xs uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              Dispatch Window
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              ~{area.etaMinutes} Minutes
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Stationed vans near {area.name} ready for immediate emergency roll-out.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl space-y-2 hover:border-orange-500/30 transition-all">
            <div className="flex items-center gap-2 text-[#F97316] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              Warranty &amp; Guarantee
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">100% Fixed Right</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your cooling issue recurs within 30 days, we return free of charge.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl space-y-2 hover:border-orange-500/30 transition-all">
            <div className="flex items-center gap-2 text-[#F97316] font-bold text-xs uppercase tracking-wider">
              <Star className="h-4 w-4" />
              Local Rating
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">4.9 / 5.0 Stars</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Over 450+ verified homeowner &amp; property manager reviews in {area.name}.
            </p>
          </div>
        </div>

        {/* Local Services & Landmarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/10 p-6 sm:p-8 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl space-y-5">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 tracking-tight">
              <Wrench className="h-5 w-5 text-[#F97316]" />
              Popular Services in {area.name}
            </h2>
            <ul className="space-y-3.5">
              {area.popularServices.map((svc) => (
                <li key={svc} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{svc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 p-6 sm:p-8 bg-[#0F172A]/85 backdrop-blur-xl shadow-xl space-y-5">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 tracking-tight">
              <MapPin className="h-5 w-5 text-[#F97316]" />
              Key Neighborhoods &amp; Landmarks
            </h2>
            <div className="flex flex-wrap gap-2">
              {area.landmarks.map((landmark) => (
                <span
                  key={landmark}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-xs font-semibold text-slate-300 border border-white/10"
                >
                  {landmark}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Covered Postal ZIP Codes
              </p>
              <div className="flex flex-wrap gap-2">
                {area.zipCodes.map((zip) => (
                  <span
                    key={zip}
                    className="px-3 py-1 rounded-lg bg-orange-500/10 text-[#F97316] text-xs font-mono font-bold border border-orange-500/25"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer Card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0F172A] via-[#1E293B]/70 to-[#0F172A] p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl text-center md:text-left relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Need Fast AC Service in {area.name}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Book online in 60 seconds with upfront pricing and live technician GPS tracking.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 relative z-10 w-full sm:w-auto">
            <Button
              asChild
              className="w-full sm:w-auto rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 py-6 shadow-lg shadow-orange-500/20"
            >
              <Link href="/book" className="flex items-center justify-center gap-2">
                Schedule Service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
