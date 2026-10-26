/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Wrench,
  ChevronDown,
  Plus,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Zap,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface CustomerOption {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: "Residential" | "Commercial";
}

interface ServiceOption {
  id: string;
  name: string;
  serviceType: string;
  duration: string;
  priceDollars: number;
  partsDollars: number;
  skills: string[];
}

interface TechOption {
  id: string;
  name: string;
  role: string;
  avatar: string;
  available: boolean;
}

const CUSTOMERS: CustomerOption[] = [
  {
    id: "cust-1",
    name: "Robert Caldwell",
    phone: "+1 (305) 555-0180",
    address: "Miami, FL 33145",
    type: "Residential",
  },
  {
    id: "cust-2",
    name: "Elena Rostova",
    phone: "+1 (305) 555-0199",
    address: "1220 SW 8th St, Miami, FL 33130",
    type: "Residential",
  },
  {
    id: "cust-3",
    name: "Marcus Vance",
    phone: "+1 (305) 555-0182",
    address: "2100 Biscayne Blvd, Miami, FL 33137",
    type: "Commercial",
  },
  {
    id: "cust-4",
    name: "Sophia Lorenzi",
    phone: "+1 (305) 555-0144",
    address: "305 Lincoln Rd, Miami Beach, FL 33139",
    type: "Residential",
  },
];

const SERVICES: ServiceOption[] = [
  {
    id: "ac-repair",
    name: "AC Repair",
    serviceType: "AC Repair & Maintenance",
    duration: "2 Hours",
    priceDollars: 120,
    partsDollars: 35,
    skills: ["HVAC", "Electrical", "Diagnostics"],
  },
  {
    id: "thermostat-install",
    name: "Thermostat Install",
    serviceType: "Smart Thermostat Integration",
    duration: "1.5 Hours",
    priceDollars: 149,
    partsDollars: 45,
    skills: ["Electrical", "Controls", "Diagnostics"],
  },
  {
    id: "water-heater",
    name: "Water Heater Service",
    serviceType: "Diagnostic & Repair",
    duration: "1.5 Hours",
    priceDollars: 95,
    partsDollars: 30,
    skills: ["Plumbing", "Electrical"],
  },
  {
    id: "duct-cleaning",
    name: "Duct Cleaning",
    serviceType: "Full IAQ Sanitization",
    duration: "3 Hours",
    priceDollars: 180,
    partsDollars: 20,
    skills: ["IAQ", "Sanitization", "Safety"],
  },
];

const TECHNICIANS: TechOption[] = [
  {
    id: "tech-carlos",
    name: "Carlos Mendez",
    role: "HVAC Specialist",
    avatar: "/images/avatar-david.jpg",
    available: true,
  },
  {
    id: "tech-maria",
    name: "Maria Alvarez",
    role: "Heat Pump & Controls Specialist",
    avatar: "/images/avatar-sarah.jpg",
    available: true,
  },
  {
    id: "tech-danny",
    name: "Danny Reyes",
    role: "Plumbing & IAQ Lead",
    avatar: "/images/avatar-mike.jpg",
    available: true,
  },
  {
    id: "tech-tony",
    name: "Tony Brooks",
    role: "Master Commercial HVAC",
    avatar: "/images/avatar-1.jpg",
    available: false,
  },
];

export default function AdminCreateJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  // Form State matching screenshot
  const [selectedCustomerId, setSelectedCustomerId] = React.useState("cust-1");
  const [customerType, setCustomerType] = React.useState<"Residential" | "Commercial">("Residential");

  const [selectedServiceId, setSelectedServiceId] = React.useState("ac-repair");
  const [serviceType, setServiceType] = React.useState("AC Repair & Maintenance");
  const [duration, setDuration] = React.useState("2 Hours");

  const [preferredDate, setPreferredDate] = React.useState("May 14, 2025");
  const [timeSlot, setTimeSlot] = React.useState("9:00 AM - 11:00 AM");
  const [selectedTechId, setSelectedTechId] = React.useState("tech-carlos");

  const [servicePrice, setServicePrice] = React.useState("120.00");
  const [partsCost, setPartsCost] = React.useState("35.00");
  const [notes, setNotes] = React.useState("");

  // Quick new customer modal state
  const [showAddCustomerModal, setShowAddCustomerModal] = React.useState(false);
  const [newCustName, setNewCustName] = React.useState("");
  const [newCustPhone, setNewCustPhone] = React.useState("");
  const [newCustAddress, setNewCustAddress] = React.useState("");

  // Derived selected objects
  const currentCustomer = CUSTOMERS.find((c) => c.id === selectedCustomerId) ?? CUSTOMERS[0];
  const currentService = SERVICES.find((s) => s.id === selectedServiceId) ?? SERVICES[0];
  const currentTech = TECHNICIANS.find((t) => t.id === selectedTechId) ?? TECHNICIANS[0];

  // Auto-fill service details on service change
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const svc = SERVICES.find((s) => s.id === serviceId);
    if (svc) {
      setServiceType(svc.serviceType);
      setDuration(svc.duration);
      setServicePrice(svc.priceDollars.toFixed(2));
      setPartsCost(svc.partsDollars.toFixed(2));
    }
  };

  // Calculate Total Estimated Cost
  const totalCost = React.useMemo(() => {
    const s = parseFloat(servicePrice) || 0;
    const p = parseFloat(partsCost) || 0;
    return (s + p).toFixed(2);
  }, [servicePrice, partsCost]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    toast.info("Creating Work Order WO-8427...", {
      description: `Scheduling ${currentService.name} with ${currentTech.name}.`,
    });

    setTimeout(() => {
      setSubmitting(false);
      toast.success("Job Created Successfully!", {
        description: "Work Order WO-8427 has been assigned and dispatched.",
      });
      router.push("/admin/jobs/job-1047");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Job</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Create a work order with customer, service, schedule, technician and pricing details.
        </p>
      </div>

      {/* Main Form Container Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-[#0F172A]/90 border border-white/10 p-5 sm:p-6 shadow-xl space-y-6"
      >
        {/* SECTION 1: 1. Customer Details */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-300 tracking-wide uppercase flex items-center gap-2">
            <span>1. Customer Details</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Select Customer <span className="text-orange-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(true)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add New Customer</span>
                </button>
              </div>

              <div className="relative">
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    const cust = CUSTOMERS.find((c) => c.id === e.target.value);
                    if (cust) setCustomerType(cust.type);
                  }}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  {CUSTOMERS.map((cust) => (
                    <option key={cust.id} value={cust.id} className="bg-slate-900 text-white">
                      {cust.name} — {cust.phone} | {cust.address}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Customer Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Customer Type</label>
              <div className="relative">
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as any)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  <option value="Residential" className="bg-slate-900 text-white">Residential</option>
                  <option value="Commercial" className="bg-slate-900 text-white">Commercial</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: 2. Service Details */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h2 className="text-xs font-bold text-slate-300 tracking-wide uppercase">
            2. Service Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {/* Select Service */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Select Service <span className="text-orange-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  {SERVICES.map((svc) => (
                    <option key={svc.id} value={svc.id} className="bg-slate-900 text-white">
                      {svc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Service Type</label>
              <div className="relative">
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  <option value="AC Repair & Maintenance" className="bg-slate-900 text-white">AC Repair & Maintenance</option>
                  <option value="Smart Thermostat Integration" className="bg-slate-900 text-white">Smart Thermostat Integration</option>
                  <option value="Full IAQ Sanitization" className="bg-slate-900 text-white">Full IAQ Sanitization</option>
                  <option value="Diagnostic & Repair" className="bg-slate-900 text-white">Diagnostic & Repair</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Estimated Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Estimated Duration</label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  <option value="1 Hour" className="bg-slate-900 text-white">1 Hour</option>
                  <option value="1.5 Hours" className="bg-slate-900 text-white">1.5 Hours</option>
                  <option value="2 Hours" className="bg-slate-900 text-white">2 Hours</option>
                  <option value="3 Hours" className="bg-slate-900 text-white">3 Hours</option>
                  <option value="4 Hours" className="bg-slate-900 text-white">4 Hours</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Required Skills</label>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {currentService.skills.map((skill) => (
                  <span
                    key={skill}
                    className="border border-blue-500/30 bg-blue-500/15 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: 3. Schedule & Technician */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h2 className="text-xs font-bold text-slate-300 tracking-wide uppercase">
            3. Schedule &amp; Technician
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Preferred Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Preferred Date <span className="text-orange-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                  placeholder="May 14, 2025"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Time Slot */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Time Slot <span className="text-orange-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-orange-500 transition cursor-pointer"
                >
                  <option value="9:00 AM - 11:00 AM" className="bg-slate-900 text-white">9:00 AM - 11:00 AM</option>
                  <option value="11:30 AM - 1:30 PM" className="bg-slate-900 text-white">11:30 AM - 1:30 PM</option>
                  <option value="2:00 PM - 4:00 PM" className="bg-slate-900 text-white">2:00 PM - 4:00 PM</option>
                  <option value="4:30 PM - 6:30 PM" className="bg-slate-900 text-white">4:30 PM - 6:30 PM</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Assign Technician */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Assign Technician</label>
                <button
                  type="button"
                  onClick={() => router.push("/admin/dispatch")}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                >
                  View Availability
                </button>
              </div>

              <div className="relative">
                <div className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20 shrink-0">
                      <img
                        src={currentTech.avatar}
                        alt={currentTech.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {currentTech.name}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-none">
                        {currentTech.role}
                      </div>
                    </div>
                  </div>

                  <select
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    className="opacity-0 absolute inset-0 cursor-pointer"
                    title="Select Technician"
                  >
                    {TECHNICIANS.map((tech) => (
                      <option key={tech.id} value={tech.id} className="bg-slate-900 text-white">
                        {tech.name} ({tech.role})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 mr-2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: 4. Pricing & Additional Notes */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h2 className="text-xs font-bold text-slate-300 tracking-wide uppercase">
            4. Pricing &amp; Additional Notes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            {/* Service Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Service Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input
                  type="text"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 pl-6 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                  placeholder="120.00"
                />
              </div>
            </div>

            {/* Parts Cost */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Parts Cost (if any)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input
                  type="text"
                  value={partsCost}
                  onChange={(e) => setPartsCost(e.target.value)}
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 pl-6 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                  placeholder="35.00"
                />
              </div>
            </div>

            {/* Total Estimated Cost Display */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Total Estimated Cost</label>
              <div className="rounded-lg bg-[#080D1A] border border-white/10 px-3 py-2 text-sm font-bold text-white">
                ${totalCost}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-slate-300">Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions..."
              className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition resize-none"
            />
          </div>
        </div>

        {/* Footer Buttons (Cancel & Create Job) */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/jobs")}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2 text-xs font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Job"}
          </button>
        </div>
      </form>

      {/* Modal: Quick Add Customer */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#0F172A] border border-white/10 p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Add New Customer</h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Phone</label>
                <input
                  type="text"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="+1 (305) 555-0100"
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Service Address</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="100 Biscayne Blvd, Miami, FL 33132"
                  className="w-full rounded-lg bg-[#080D1A] border border-white/10 p-2 text-xs text-white mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
                className="rounded px-3 py-1.5 text-xs text-slate-300 bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Customer added!");
                  setShowAddCustomerModal(false);
                }}
                className="rounded px-3 py-1.5 text-xs font-bold text-white bg-[#F97316]"
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
