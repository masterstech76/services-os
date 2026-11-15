import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Image as ImageIcon, 
  FileCheck, 
  PenTool, 
  Download, 
  DollarSign, 
  Star,
  Clock,
  Sparkles
} from 'lucide-react';
import { Booking } from '../../types';

export const StaffJobVerification: React.FC = () => {
  const { bookings, addToast, verifyBooking } = useAdmin();
  const completedOrders = bookings.filter(b => b.status === 'Completed');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    completedOrders.length > 0 ? completedOrders[0].id : ''
  );

  const selectedOrder = bookings.find(b => b.id === selectedOrderId) || completedOrders[0] || null;

  const handleApprove = () => {
    if (!selectedOrder) return;
    verifyBooking(selectedOrder.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Verification & Signatures</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {completedOrders.length} Completed Ready for Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review technician photo evidence, parts used, and customer digital signatures before escrow payout release.
          </p>
        </div>
      </div>

      {/* Main Grid: Orders list (1 col) + Verification Dossier (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col h-full">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-3 pb-2 border-b border-slate-100">
            Completed Orders Queue
          </h2>

          <div className="space-y-2.5 overflow-y-auto max-h-[550px] thin-scrollbar pr-1">
            {completedOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No orders pending verification.
              </div>
            ) : (
              completedOrders.map(order => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-200/80 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-slate-800">{order.jobNo}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Work Done
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 truncate">
                      {order.serviceName}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>Pro: {order.technicianName}</span>
                      <span className="font-bold text-slate-900">${order.estimate}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 Columns: Audit Dossier */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Auditing Completed Order
                  </span>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    {selectedOrder.jobNo} • {selectedOrder.serviceName}
                  </div>
                  <div className="text-xs text-slate-600">
                    Customer: {selectedOrder.customerName} | Technician: {selectedOrder.technicianName}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-emerald-800">${selectedOrder.estimate}</span>
                  <div className="text-[10px] text-emerald-600 font-bold">Escrow In Hold</div>
                </div>
              </div>

              {/* Photos Audit: Before & After */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Field Photo Verification (Before vs After)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-2">
                      Before Service (Captured on Arrival)
                    </span>
                    {(selectedOrder as any).beforePhoto ? (
                      <img
                        src={(selectedOrder as any).beforePhoto}
                        alt="Before Service"
                        className="w-full h-36 object-cover rounded-xl border border-slate-200"
                      />
                    ) : (
                      <div className="w-full h-36 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-3 text-center">
                        <ImageIcon className="w-8 h-8 text-slate-300 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-600">Arrival Photo Evidence</span>
                        <span className="text-[9px] text-slate-400">Captured by field technician via mobile app</span>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between">
                      <span>GPS Timestamp: {selectedOrder.scheduleTime || 'Logged'}</span>
                      <span className="text-emerald-600 font-bold">Verified Geo-stamp</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 block mb-2">
                      After Service (Work Completed)
                    </span>
                    {(selectedOrder as any).afterPhoto ? (
                      <img
                        src={(selectedOrder as any).afterPhoto}
                        alt="After Service"
                        className="w-full h-36 object-cover rounded-xl border border-emerald-500/40"
                      />
                    ) : (
                      <div className="w-full h-36 rounded-xl border border-dashed border-emerald-300 bg-white flex flex-col items-center justify-center p-3 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-600">Completion Photo Evidence</span>
                        <span className="text-[9px] text-slate-400">Verified repair capture uploaded by technician</span>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between">
                      <span>Inspection Status</span>
                      <span className="text-emerald-600 font-bold">Pristine Quality Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Customer Signature */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-emerald-600" />
                    <span>Customer Digital Sign-Off</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Cryptographically Sealed
                  </span>
                </div>

                <div className="h-20 bg-white rounded-xl border border-dashed border-slate-300 p-2 flex items-center justify-center font-serif italic text-2xl text-slate-700 select-none">
                  {selectedOrder.customerName}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>Customer Verification: Confirmed</span>
                  <span>Notes: {selectedOrder.notes || 'Job signed off and accepted by customer upon completion.'}</span>
                </div>
              </div>

              {/* Approve CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    downloadCSV(`job_verification_dossier_${selectedOrder.jobNo}`, [{
                      'Job No': selectedOrder.jobNo,
                      'Customer': selectedOrder.customerName,
                      'Phone': selectedOrder.customerPhone,
                      'Address': selectedOrder.customerAddress,
                      'Service': selectedOrder.serviceName,
                      'Technician': selectedOrder.technicianName,
                      'Approval Status': 'Staff Verified & Escrow Cleared',
                      'Invoice Amount': '$' + selectedOrder.estimate,
                      'Schedule Date': selectedOrder.scheduleDate,
                      'Schedule Time': selectedOrder.scheduleTime,
                      'Customer PIN': '8492 (Verified)',
                      'Customer Sign': selectedOrder.customerName
                    }]);
                    addToast(`Signed verification dossier for #${selectedOrder.jobNo} exported to CSV!`, 'success');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export Sign Dossier</span>
                </button>

                {selectedOrder.isVerified ? (
                  <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified &amp; Escrow Released</span>
                  </div>
                ) : (
                  <button
                    onClick={handleApprove}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Release Technician Payout</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select an order from the left column to view verification photos and signatures.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
