import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  ArrowLeft, 
  Printer, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle, 
  User, 
  ShieldCheck, 
  FileText, 
  CreditCard,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const Page09BookingDetails: React.FC = () => {
  const { navigateToPage, addToast, openAssignModal, bookings, selectedBookingId, setSelectedBookingId, technicians } = useAdmin();
  const booking = bookings.find(b => b.id === selectedBookingId) || bookings[0] || null;

  if (!booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToPage(6)}
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking Dossier</h1>
            <p className="text-xs text-slate-500 mt-1">Full service dossier, verification check-ins, itemized invoice, and GPS telemetry</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Booking Selected</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm">
            There are currently no active bookings in the system or no specific order was selected from the dispatch list.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => navigateToPage(6)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              ← Back to Bookings
            </button>
            <button
              onClick={() => navigateToPage(7)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Create New Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToPage(6)} // Back to All Bookings
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking #{booking.jobNo}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {booking.status}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
                {booking.priority} Priority
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Full service dossier, verification check-ins, itemized invoice, and GPS telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              window.print();
              addToast(`Work Order #${booking.jobNo} prepared for printing/PDF export!`, 'info');
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Work Order
          </button>

          <button
            onClick={() => {
              setSelectedBookingId(booking.id);
              navigateToPage(12); // Handover
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reassign Pro
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols, Right 1 Col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Summary Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Service Specifications</h2>
            <div className="text-sm font-bold text-slate-800">{booking.serviceName}</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete dual inverter split AC maintenance including foam coil wash, condenser fan calibration, high-pressure jet wash, and freon gas pressure check. Verified eco-friendly antimicrobial sanitization.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Category</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{booking.category}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Duration</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">90 Minutes</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Scheduled Time</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{booking.scheduleTime}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Security PIN</div>
                <div className="text-xs font-mono font-bold text-emerald-700 mt-0.5">8492</div>
              </div>
            </div>
          </div>

          {/* Audit Timeline Tracker */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Job Progression Audit Trail</h2>
            <div className="space-y-4">
              {[
                { title: 'Booking Created by Customer', time: '08:30 AM', desc: 'Customer placed instant on-demand request via Mobile App.', done: true },
                { title: `Technician Assigned via AI Radar`, time: '08:32 AM', desc: `Auto-matched to ${booking.technicianName} (Score 98%, 2.1 miles away).`, done: true },
                { title: 'Technician Departed & En Route', time: '09:15 AM', desc: 'GPS tracking broadcast activated. Customer notified via SMS.', done: true },
                { title: 'Technician Arrived On-Site', time: '09:40 AM', desc: 'Customer validated 4-digit security PIN 8492 at door.', done: true },
                { title: 'Work In Progress & Diagnostics', time: '09:45 AM', desc: 'Technician started maintenance procedure & diagnostic telemetry.', done: false, active: true },
                { title: 'Job Completion & Digital Signature', time: 'Pending', desc: 'Sign-off and final escrow release pending completion.', done: false }
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="shrink-0 mt-0.5">
                    {step.done ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                    ) : step.active ? (
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs animate-pulse">
                        ●
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">
                        ○
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900">{step.title}</div>
                      <span className="text-[11px] font-mono font-bold text-slate-400">{step.time}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Billing Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">Itemized Financial Invoice</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Payment Settled (Stripe)
              </span>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty / Hrs</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 font-bold text-slate-800">HVAC Split AC Deep Chemical Sanitization</td>
                  <td className="py-2.5 text-center text-slate-600">2 Units</td>
                  <td className="py-2.5 text-right text-slate-600">$175.00</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">$350.00</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-800">Antimicrobial Filter Replacement Pack</td>
                  <td className="py-2.5 text-center text-slate-600">1 Kit</td>
                  <td className="py-2.5 text-right text-slate-600">$60.00</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">$60.00</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-800">Platform Booking &amp; Safety Escrow Guarantee</td>
                  <td className="py-2.5 text-center text-slate-600">1</td>
                  <td className="py-2.5 text-right text-slate-600">$40.00</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">$40.00</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td colSpan={3} className="py-3 text-right font-extrabold text-slate-900 text-sm">Total Paid:</td>
                  <td className="py-3 text-right font-extrabold text-emerald-700 text-base">$450.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Dossier</h3>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Verified VIP</span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-base">
                {booking.customerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm">{booking.customerName}</div>
                <div className="text-xs text-slate-500">{booking.customerPhone}</div>
                <div className="text-[11px] text-amber-600 font-bold">★ 4.9 (18 Bookings)</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Service Address:
              </div>
              <p className="text-slate-600 pl-4">{booking.customerAddress}</p>
            </div>
          </div>

          {/* Assigned Technician Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Pro</h3>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Active On-Site</span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-base shadow-xs">
                {booking.technicianName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm">{booking.technicianName}</div>
                <div className="text-xs text-slate-500">Certified Field Specialist</div>
                <div className="text-[11px] text-emerald-700 font-bold">★ 4.9 • 312 Completed</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400">Order Status</div>
                <div className="font-extrabold text-slate-800">{booking.status}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400">Technician Phone</div>
                <div className="font-extrabold text-emerald-700 truncate">
                  {(booking as any).technicianPhone || (technicians.find(t => t.name === booking.technicianName)?.phone) || 'Not Provided'}
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview Simulation */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Geofence Boundary</h3>
            <div className="w-full h-36 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]"></div>
              <div className="relative text-center text-white space-y-1">
                <div className="w-4 h-4 rounded-full bg-emerald-500 animate-ping mx-auto"></div>
                <div className="text-xs font-bold">Technician Inside Customer Geofence</div>
                <div className="text-[10px] text-slate-400">GPS Signal: High Accuracy (±2m)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
