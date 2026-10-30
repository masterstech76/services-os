"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Wrench,
  Building,
  CreditCard,
  Calendar,
  FileText,
  MapPin,
  Settings,
  Star,
  CheckCircle2,
  LockOpen,
  ArrowRight,
  Filter,
} from "lucide-react";

interface RouteItem {
  title: string;
  path: string;
  category: "Public" | "Services" | "Areas" | "Booking" | "Customer" | "Tech" | "Admin Ops" | "Admin Mgmt" | "Auth & Legal";
  role: "Public" | "Customer" | "Technician" | "Owner / Admin";
  description: string;
  badge?: string;
  icon?: string;
}

const ALL_ROUTES: RouteItem[] = [
  // 1. Core Public Marketing
  {
    title: "Landing Page (Master)",
    path: "/",
    category: "Public",
    role: "Public",
    description: "The pixel-perfect locked flagship landing page with hero, trades, workflow, and footer.",
    badge: "Master Baseline",
  },
  {
    title: "About Us",
    path: "/about",
    category: "Public",
    role: "Public",
    description: "Company mission, verified trade standards, leadership, and operational scale.",
  },
  {
    title: "Services Overview",
    path: "/services",
    category: "Public",
    role: "Public",
    description: "Complete HVAC trade catalog with flat-rate pricing and service guarantees.",
  },
  {
    title: "How It Works",
    path: "/how-it-works",
    category: "Public",
    role: "Public",
    description: "Step-by-step breakdown of instant dispatch, real-time tracking, and certified repairs.",
  },
  {
    title: "Pricing & Plans",
    path: "/pricing",
    category: "Public",
    role: "Public",
    description: "Transparent residential & commercial service tiers, maintenance plans, and cost calculator.",
  },
  {
    title: "SaaS Plans & Subscription",
    path: "/subscribe",
    category: "Public",
    role: "Public",
    description: "Contractor subscription tiers with 1-click Pro and Fleet tier direct signup.",
    badge: "Direct Subscribe",
  },
  {
    title: "Careers & Fleet Hiring",
    path: "/careers",
    category: "Public",
    role: "Public",
    description: "Fleet technician recruitment pipeline, competitive pay rates, and 2-minute application intake.",
    badge: "Careers Funnel",
  },
  {
    title: "Online Trade Application",
    path: "/apply",
    category: "Public",
    role: "Public",
    description: "Direct candidate application intake form for trade mechanics, apprentices, and specialists.",
  },
  {
    title: "Contact & Dispatch",
    path: "/contact",
    category: "Public",
    role: "Public",
    description: "24/7 emergency dispatch hotline, live map, and urgent service request intake.",
  },
  {
    title: "Frequently Asked Questions",
    path: "/faq",
    category: "Public",
    role: "Public",
    description: "Searchable knowledge base answering common scheduling, pricing, and warranty questions.",
  },
  {
    title: "Service Coverage Areas",
    path: "/areas",
    category: "Public",
    role: "Public",
    description: "Interactive regional coverage map covering all 16 South Florida service territories.",
  },
  {
    title: "Seasonal Specials & Rebates",
    path: "/specials",
    category: "Public",
    role: "Public",
    description: "Active promotions, federal energy rebates, and seasonal tuneup coupon codes.",
  },
  {
    title: "Project Work Gallery",
    path: "/gallery",
    category: "Public",
    role: "Public",
    description: "High-resolution before/after verified installation photos and quality badges.",
  },
  {
    title: "Customer Reviews",
    path: "/reviews",
    category: "Public",
    role: "Public",
    description: "Verified homeowner testimonials, 4.9-star ratings, and service feedback ledger.",
  },

  // 2. Individual Public Services
  {
    title: "Emergency HVAC Repair",
    path: "/services/emergency-hvac",
    category: "Services",
    role: "Public",
    description: "Rapid 60-minute emergency diagnostic and immediate restore protocols.",
    badge: "24/7 Priority",
  },
  {
    title: "AC Diagnostic & Repair",
    path: "/services/ac-repair",
    category: "Services",
    role: "Public",
    description: "Compressor, capacitor, blower motor, and refrigerant line troubleshooting.",
  },
  {
    title: "AC Tuneup & Maintenance",
    path: "/services/ac-tuneup",
    category: "Services",
    role: "Public",
    description: "24-point comprehensive seasonal tuneup and efficiency calibration checklist.",
  },
  {
    title: "Furnace & Heating Repair",
    path: "/services/furnace-repair",
    category: "Services",
    role: "Public",
    description: "Heat pump, gas furnace, and electrical heating system repairs.",
  },
  {
    title: "Refrigerant Recovery & Recharge",
    path: "/services/refrigerant-recharge",
    category: "Services",
    role: "Public",
    description: "EPA Section 608 certified R-410A / R-32 leak detection and recharge.",
  },
  {
    title: "Air Duct Cleaning & Sanitization",
    path: "/services/duct-cleaning",
    category: "Services",
    role: "Public",
    description: "Rotary HEPA vacuum duct sanitization and anti-microbial treatment.",
  },
  {
    title: "Smart Thermostat Installation",
    path: "/services/thermostat-install",
    category: "Services",
    role: "Public",
    description: "Ecobee, Nest, and Honeywell smart thermostat wiring and zoning integration.",
  },
  {
    title: "Commercial HVAC Systems",
    path: "/services/commercial-hvac",
    category: "Services",
    role: "Public",
    description: "Rooftop package units, chillers, and commercial preventative service contracts.",
  },

  // 3. Service Territories
  {
    title: "All Service Areas Index",
    path: "/service-areas",
    category: "Areas",
    role: "Public",
    description: "Territory hub listing all regional zones, response times, and technician distribution.",
  },
  {
    title: "Miami Downtown & Midtown",
    path: "/service-areas/miami",
    category: "Areas",
    role: "Public",
    description: "30-min response dispatch hub for Miami urban core and high-rises.",
  },
  {
    title: "Miami Beach & South Beach",
    path: "/service-areas/miami-beach",
    category: "Areas",
    role: "Public",
    description: "Coastal anti-corrosion HVAC service and historic district dispatch.",
  },
  {
    title: "Coral Gables",
    path: "/service-areas/coral-gables",
    category: "Areas",
    role: "Public",
    description: "Historic residence preservation and high-efficiency heat pump service.",
  },
  {
    title: "Brickell Financial District",
    path: "/service-areas/brickell",
    category: "Areas",
    role: "Public",
    description: "Luxury high-rise condo HVAC systems, water-source heat pumps, and chillers.",
  },
  {
    title: "Fort Lauderdale Metro",
    path: "/service-areas/fort-lauderdale",
    category: "Areas",
    role: "Public",
    description: "Broward county commercial and residential fast-dispatch operations.",
  },
  {
    title: "Hollywood & Dania Beach",
    path: "/service-areas/hollywood",
    category: "Areas",
    role: "Public",
    description: "Full service HVAC maintenance and emergency repair coverage.",
  },
  {
    title: "Pembroke Pines",
    path: "/service-areas/pembroke-pines",
    category: "Areas",
    role: "Public",
    description: "Suburban single-family whole-home HVAC replacement and duct service.",
  },
  {
    title: "Miramar Communities",
    path: "/service-areas/miramar",
    category: "Areas",
    role: "Public",
    description: "High SEER2 system installations and indoor air quality upgrades.",
  },
  {
    title: "Hialeah Operations",
    path: "/service-areas/hialeah",
    category: "Areas",
    role: "Public",
    description: "Industrial warehouse and residential cooling repair dispatch center.",
  },
  {
    title: "Doral Commerce & Residences",
    path: "/service-areas/doral",
    category: "Areas",
    role: "Public",
    description: "Commercial rooftop and residential split system certified services.",
  },
  {
    title: "Kendall & Pinecrest",
    path: "/service-areas/kendall",
    category: "Areas",
    role: "Public",
    description: "Expansive residential zoning and preventative maintenance subscriptions.",
  },
  {
    title: "Aventura & Waterways",
    path: "/service-areas/aventura",
    category: "Areas",
    role: "Public",
    description: "Intracoastal condo cooling units and smart thermostat upgrades.",
  },
  {
    title: "Sunny Isles Beach",
    path: "/service-areas/sunny-isles",
    category: "Areas",
    role: "Public",
    description: "Salt-air coastal unit coil protection and multi-zone climate systems.",
  },
  {
    title: "Boca Raton Coastal",
    path: "/service-areas/boca-raton",
    category: "Areas",
    role: "Public",
    description: "Palm Beach county premier residential HVAC replacement and repair.",
  },
  {
    title: "Delray Beach Downtown",
    path: "/service-areas/delray-beach",
    category: "Areas",
    role: "Public",
    description: "Historic downtown commercial and suburban home climate diagnostics.",
  },
  {
    title: "West Palm Beach Regional",
    path: "/service-areas/west-palm-beach",
    category: "Areas",
    role: "Public",
    description: "Northern territory emergency response and multi-unit installation hub.",
  },

  // 4. Booking & Direct Experiences
  {
    title: "Interactive Booking Wizard",
    path: "/book",
    category: "Booking",
    role: "Public",
    description: "4-step self-service booking flow: trade select, address, time slot, and instant confirmation.",
    badge: "Interactive Wizard",
  },
  {
    title: "Admin Fleet & Operations Console",
    path: "/admin",
    category: "Booking",
    role: "Owner / Admin",
    description: "Executive control center for dispatch board, jobs, technicians, billing, and system settings.",
    badge: "Admin Console",
  },
  {
    title: "Customer Pay-by-Link Checkout",
    path: "/pay/pay_tok_demo_1004",
    category: "Booking",
    role: "Public",
    description: "Customer-facing one-click Stripe payment page with invoice line items and card tokenization.",
    badge: "Stripe Checkout",
  },
  {
    title: "Customer Post-Job Review Intake",
    path: "/reviews/carlos-mendez",
    category: "Booking",
    role: "Customer",
    description: "Public/customer feedback submission form with 5-star rating and technician commendations.",
  },

  // 5. Customer Self-Service Portal
  {
    title: "Customer Dashboard",
    path: "/account",
    category: "Customer",
    role: "Customer",
    description: "Homeowner dashboard showing upcoming visits, active service tickets, and quick actions.",
    badge: "Portal Hub",
  },
  {
    title: "Customer Appointments",
    path: "/account/appointments",
    category: "Customer",
    role: "Customer",
    description: "Scheduled, in-progress, and past appointment history with one-click rescheduling.",
  },
  {
    title: "Appointment Details Dossier",
    path: "/account/appointments/job-1004",
    category: "Customer",
    role: "Customer",
    description: "Full service report, technician assignment, diagnostic findings, and parts billed.",
  },
  {
    title: "Live Technician GPS Tracker",
    path: "/account/appointments/job-1004/track",
    category: "Customer",
    role: "Customer",
    description: "Real-time en route live GPS map showing technician location, vehicle speed, and ETA.",
    badge: "Live GPS",
  },
  {
    title: "Customer Invoices & Receipts",
    path: "/account/invoices",
    category: "Customer",
    role: "Customer",
    description: "Accounts statement, PDF receipts download, and instant one-click balance payment.",
  },
  {
    title: "Saved Payment Methods",
    path: "/account/payments",
    category: "Customer",
    role: "Customer",
    description: "PCI-compliant card on file management with Stripe Elements and default card toggle.",
  },
  {
    title: "Property Addresses",
    path: "/account/addresses",
    category: "Customer",
    role: "Customer",
    description: "Service addresses, condo gate codes, building access notes, and primary location badge.",
  },
  {
    title: "Customer Profile & Contact",
    path: "/account/profile",
    category: "Customer",
    role: "Customer",
    description: "Homeowner contact info, SMS arrival notifications preference, and security credentials.",
  },
  {
    title: "Customer Reviews History",
    path: "/account/reviews",
    category: "Customer",
    role: "Customer",
    description: "History of all reviews and ratings submitted for past completed service visits.",
  },
  {
    title: "Preferred Technicians",
    path: "/account/favorites",
    category: "Customer",
    role: "Customer",
    description: "Save top-rated technicians for automatic preferred dispatch on future bookings.",
  },
  {
    title: "Support & Warranty Tickets",
    path: "/account/support",
    category: "Customer",
    role: "Customer",
    description: "24/7 priority customer support ticket submission and warranty claim tracker.",
  },
  {
    title: "Customer Notifications",
    path: "/account/notifications",
    category: "Customer",
    role: "Customer",
    description: "Real-time feed of booking confirmations, dispatch updates, and arrival alerts.",
  },

  // 6. Field Technician Mobile PWA
  {
    title: "Technician Dashboard",
    path: "/tech",
    category: "Tech",
    role: "Technician",
    description: "Technician command dashboard: executive short notes, shift overview, van status, and priority actions.",
    badge: "Tech Core",
  },
  {
    title: "Today's Route & Jobs",
    path: "/tech/jobs",
    category: "Tech",
    role: "Technician",
    description: "Assigned field work orders, route optimization, customer contacts, and live GPS travel.",
  },
  {
    title: "Weekly Shift Calendar",
    path: "/tech/schedule",
    category: "Tech",
    role: "Technician",
    description: "Full week schedule, standby on-call rotations, and PTO request submissions.",
  },
  {
    title: "Worker Leave & Emergency Form",
    path: "/tech/leave",
    category: "Tech",
    role: "Technician",
    description: "Interactive leave request with emergency breakdown alert protocol and instant ticket tracking.",
    badge: "New Dual-Mode",
  },
  {
    title: "Job Active Work Order",
    path: "/tech/jobs/job-1004",
    category: "Tech",
    role: "Technician",
    description: "Field job interface: start travel, tap-to-call homeowner, navigate via Waze/Google Maps.",
    badge: "Field Ops",
  },
  {
    title: "Safety & Diagnostic Checklist",
    path: "/tech/jobs/job-1004/checklist",
    category: "Tech",
    role: "Technician",
    description: "Digital safety checklist, pressure readings, voltage verification, and photo uploads.",
  },
  {
    title: "Truck Parts Requisition",
    path: "/tech/jobs/job-1004/parts",
    category: "Tech",
    role: "Technician",
    description: "Search truck inventory, log parts consumed on job, and bill directly to work order.",
  },
  {
    title: "In-Field Estimate Builder",
    path: "/tech/jobs/job-1004/estimate",
    category: "Tech",
    role: "Technician",
    description: "Create tiered estimates (Good / Better / Best) and capture homeowner digital signature.",
  },
  {
    title: "Technician Earnings & Payouts",
    path: "/tech/earnings",
    category: "Tech",
    role: "Technician",
    description: "Daily wages, commission calculations, hourly labor logged, and upcoming direct deposit.",
  },
  {
    title: "Technician Mobile Notifications",
    path: "/tech/notifications",
    category: "Tech",
    role: "Technician",
    description: "Instant push notifications for urgent dispatches, schedule swaps, and customer cancellations.",
  },
  {
    title: "Technician Profile & Bio",
    path: "/tech/profile",
    category: "Tech",
    role: "Technician",
    description: "Technician certifications, EPA license numbers, assigned van ID, and duty status toggle.",
  },
  {
    title: "Edit Technician Profile",
    path: "/tech/profile/edit",
    category: "Tech",
    role: "Technician",
    description: "Full edit profile form: direct dispatch phone, customer bio, van tags, trade certifications, and overtime preferences.",
    badge: "New Edit Profile",
  },

  // 7. Admin & Dispatch Operations
  {
    title: "Operations Executive Dashboard",
    path: "/admin",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Real-time command center: today's revenue, active dispatch count, customer CSAT, and quick links.",
    badge: "Admin Core",
  },
  {
    title: "Dispatch Command Center",
    path: "/admin/dispatch",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Unified dispatch hub with technician live fleet cards, pending unassigned queue, and quick assign.",
  },
  {
    title: "Dispatch Gantt Timeline Board",
    path: "/admin/dispatch/board",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Drag-and-drop schedule timeline organized by technician lanes with route conflict detection.",
    badge: "Drag & Drop",
  },
  {
    title: "Dispatch Master Calendar",
    path: "/admin/dispatch/calendar",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Month, week, and day grid views with color-coded job categories and capacity forecasting.",
  },
  {
    title: "All Work Orders & Jobs",
    path: "/admin/jobs",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Comprehensive job ledger with live filtering by status, trade, technician, and priority.",
  },
  {
    title: "Create New Work Order",
    path: "/admin/jobs/create",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Rapid intake modal for phone bookings, automated customer lookup, and instant scheduling.",
  },
  {
    title: "Job Detailed Dossier",
    path: "/admin/jobs/job-1004",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Complete job lifecycle view: customer details, technician notes, invoice status, and GPS route history.",
  },
  {
    title: "Technicians Fleet Roster",
    path: "/admin/technicians",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Manage technician crew, track certifications, view live GPS location, and assign service zones.",
  },
  {
    title: "Technician Profile (Lead Field Specialist)",
    path: "/admin/technicians/tech-carlos",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Performance stats, completed jobs, customer ratings, and van inventory allocation for Lead Field Specialist.",
  },
  {
    title: "Technician Working Hours & Shifts",
    path: "/admin/technicians/tech-carlos/schedule",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Configure working hours, lunch windows, recurring off-days, and on-call rotations.",
  },
  {
    title: "CRM Customer Directory",
    path: "/admin/customers",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Complete homeowner & commercial client roster with total spend and job frequency stats.",
  },
  {
    title: "Customer CRM Dossier (Client Account)",
    path: "/admin/customers/cust_demo_1",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Client Account CRM file: property locations, service history, lifetime revenue, and open estimates.",
  },
  {
    title: "Invoices & Billing Ledger",
    path: "/admin/invoices",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Full accounts receivable ledger showing paid, pending, and overdue invoices with Stripe status.",
  },
  {
    title: "Invoice Detail View",
    path: "/admin/invoices/inv-1004",
    category: "Admin Ops",
    role: "Owner / Admin",
    description: "Itemized invoice view: labor breakdown, parts billed, tax calculation, and payment link generator.",
  },

  // 8. Admin Management, Inventory & Analytics
  {
    title: "Merchant Payments & Settlements",
    path: "/admin/payments",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Stripe payout schedule, card transaction logs, net processing fees, and chargeback protections.",
  },
  {
    title: "Inventory Stock Levels",
    path: "/admin/inventory",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Central warehouse & truck stock tracker with low-stock alerts and automatic reorder thresholds.",
  },
  {
    title: "Parts Catalog & Pricing",
    path: "/admin/inventory/parts",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "SKU database, supplier part numbers, wholesale cost, and customer retail markup pricing.",
  },
  {
    title: "Inventory Transfer Logs",
    path: "/admin/inventory/transactions",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Detailed stock movement ledger tracking parts loaded into vans and parts consumed on job sites.",
  },
  {
    title: "Service Catalog & Pricing Matrix",
    path: "/admin/services",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Standard rate cards, flat rate diagnostic fees, and trade service definitions.",
  },
  {
    title: "Service Geofences & Travel Fees",
    path: "/admin/service-areas",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Zip code coverage manager, travel surcharges, and territory boundary configurations.",
  },
  {
    title: "Coupons & Promotional Codes",
    path: "/admin/coupons",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Active discount campaigns, seasonal promotional codes, and redemption usage metrics.",
  },
  {
    title: "Customer Review Moderation",
    path: "/admin/reviews",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Review feed moderation, public display toggles, and technician commendation tracking.",
  },
  {
    title: "Analytics & Executive Reports",
    path: "/admin/reports",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Business intelligence suite: monthly gross margin, customer acquisition cost, and revenue trends.",
  },
  {
    title: "Revenue & Financial Analytics",
    path: "/admin/reports/revenue",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Granular revenue breakdown by trade category, average ticket size, and profit margins.",
  },
  {
    title: "Technician Productivity Reports",
    path: "/admin/reports/technicians",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "First-time fix rate, billable hours efficiency, customer CSAT scores, and revenue generated.",
  },
  {
    title: "Job Completion & SLA Reports",
    path: "/admin/reports/jobs",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "SLA compliance, average response time, callback frequency, and trade volume analysis.",
  },
  {
    title: "Operational Alerts Center",
    path: "/admin/notifications",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Central notification dispatch: urgent stock shortages, delayed technicians, and overdue invoices.",
  },
  {
    title: "System Audit Logs (Immutable)",
    path: "/admin/audit-logs",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Append-only security audit trail recording all staff actions, price adjustments, and logins.",
  },
  {
    title: "Business Settings & Integrations",
    path: "/admin/settings",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Company profile, logo upload, Stripe API keys, Supabase credentials, and email/SMS triggers.",
  },
  {
    title: "Admin Infrastructure & .env Locker",
    path: "/admin/demo-data",
    category: "Admin Mgmt",
    role: "Owner / Admin",
    description: "Zero-code cloud credentials manager: auto-writes .env.local, encrypts AES-256-GCM vault, and hot-reloads process.env for Supabase, AWS SES, AWS SNS, Twilio, Stripe, and Mapbox.",
    badge: "Zero-Code .env Locker",
  },

  // 9. Auth & Legal Pages
  {
    title: "User Sign In",
    path: "/login",
    category: "Auth & Legal",
    role: "Public",
    description: "Unified credentials login supporting owner, admin, technician, and customer authentication.",
  },
  {
    title: "Business / Customer Registration",
    path: "/register",
    category: "Auth & Legal",
    role: "Public",
    description: "Self-service business onboarding and customer account creation.",
  },
  {
    title: "Password Recovery Request",
    path: "/forgot-password",
    category: "Auth & Legal",
    role: "Public",
    description: "Automated password recovery email dispatch with secure reset link token.",
  },
  {
    title: "Password Reset Confirmation",
    path: "/reset-password",
    category: "Auth & Legal",
    role: "Public",
    description: "Secure new password entry form with password complexity meter.",
  },
  {
    title: "Email Address Verification",
    path: "/verify-email",
    category: "Auth & Legal",
    role: "Public",
    description: "Confirmation screen verifying email ownership with auto-redirect to dashboard.",
  },
  {
    title: "Phone SMS OTP Verification",
    path: "/verify-phone",
    category: "Auth & Legal",
    role: "Public",
    description: "6-digit SMS verification code intake for 2FA and mobile phone confirmation.",
  },
  {
    title: "Role Security Boundary Notice",
    path: "/unauthorized",
    category: "Auth & Legal",
    role: "Public",
    description: "Access denied landing with role explanation and clear links back to authorized portals.",
  },
  {
    title: "Privacy Policy",
    path: "/privacy",
    category: "Auth & Legal",
    role: "Public",
    description: "Full privacy disclosures, data retention rules, and customer contact rights.",
  },
  {
    title: "Terms of Service",
    path: "/terms",
    category: "Auth & Legal",
    role: "Public",
    description: "Service contract terms, cancellation policies, and workmanship warranties.",
  },
  {
    title: "Accessibility Statement",
    path: "/accessibility",
    category: "Auth & Legal",
    role: "Public",
    description: "WCAG 2.1 AA accessibility conformance and keyboard navigation standards.",
  },
];

const CATEGORIES = [
  "All",
  "Public",
  "Services",
  "Areas",
  "Booking",
  "Customer",
  "Tech",
  "Admin Ops",
  "Admin Mgmt",
  "Auth & Legal",
] as const;

export default function PagesDirectoryPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const filteredRoutes = React.useMemo(() => {
    return ALL_ROUTES.filter((route) => {
      const matchesCategory =
        selectedCategory === "All" || route.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        route.title.toLowerCase().includes(q) ||
        route.path.toLowerCase().includes(q) ||
        route.description.toLowerCase().includes(q) ||
        route.role.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const countsByCategory = React.useMemo(() => {
    const counts: Record<string, number> = { All: ALL_ROUTES.length };
    ALL_ROUTES.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-[#0C1523] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Notice Banner */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-orange-950/40 p-6 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <LockOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Active Preview Mode
                  </span>
                  <span className="text-xs text-slate-400">Auth Lock Paused</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                  ServicePro OS — Complete Master Directory
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  Authentication guards and redirects are temporarily stopped. You can click on any page below to inspect its layout, responsive design, and functionality without being blocked.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="px-4 py-2.5 rounded-xl bg-[#0F1E36] border border-slate-700/60 text-right">
                <div className="text-2xl font-black text-orange-400">
                  {ALL_ROUTES.length}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Pages Cataloged
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-[#0F1E36] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by page name, route, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#09101C] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 self-end sm:self-auto">
              <Filter className="w-3.5 h-3.5" />
              <span>Showing {filteredRoutes.length} of {ALL_ROUTES.length} routes</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              const count = countsByCategory[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    active
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "bg-[#09101C] text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active ? "bg-black/20 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoutes.map((route) => {
            const isOwnerRole = route.role === "Owner / Admin";
            const isTechRole = route.role === "Technician";
            const isCustomerRole = route.role === "Customer";

            return (
              <div
                key={`${route.category}-${route.path}-${route.title}`}
                className="group relative bg-[#0F1E36] hover:bg-[#132544] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isOwnerRole
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : isTechRole
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : isCustomerRole
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-slate-700/40 text-slate-300 border-slate-600/40"
                      }`}
                    >
                      {route.role}
                    </span>

                    {route.badge && (
                      <span className="text-[10px] font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                        {route.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                    {route.title}
                  </h3>

                  <p className="font-mono text-xs text-orange-400/90 mt-1 break-all">
                    {route.path}
                  </p>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {route.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Category: <span className="text-slate-300">{route.category}</span>
                  </span>
                  <Link
                    href={route.path}
                    onClick={async (e) => {
                      if (route.role !== "Public") {
                        e.preventDefault();
                        const roleMap: Record<string, string> = {
                          "Owner / Admin": "owner",
                          Technician: "technician",
                          Customer: "customer",
                        };
                        const targetRole = roleMap[route.role] || "owner";
                        try {
                          await fetch("/api/auth/demo-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ role: targetRole }),
                          });
                        } catch {
                          // ignore
                        }
                        window.location.href = route.path;
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white rounded-lg text-xs font-semibold transition border border-orange-500/30 hover:border-orange-500 shadow-sm"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-16 bg-[#0F1E36] rounded-2xl border border-slate-800">
            <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No pages match your search</h3>
            <p className="text-sm text-slate-400 mt-1">
              Try searching with another keyword or select &quot;All&quot; categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
