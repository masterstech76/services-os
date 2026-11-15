import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  RotateCcw, 
  CheckCircle, 
  X, 
  AlertOctagon, 
  ShieldAlert, 
  DollarSign, 
  MessageSquare,
  FileText,
  Download,
  ShieldCheck
} from 'lucide-react';

interface RefundCase {
  id: string;
  caseNo: string;
  jobNo: string;
  customerName: string;
  technicianName: string;
  serviceName: string;
  amount: number;
  reason: string;
  date: string;
  status: 'Pending Review' | 'Approved' | 'Declined';
}

export const Page30RefundManagement: React.FC = () => {
  const { addToast, bookings, updateBookingStatus } = useAdmin();
  const [cases, setCases] = useState<RefundCase[]>([]);

  const pendingCount = cases.filter(c => c.status === 'Pending Review').length;
  const totalDisputedAmount = cases.reduce((acc, c) => acc + c.amount, 0);

  const handleApprove = (id: string, full: boolean) => {
    const targetCase = cases.find(c => c.id === id);
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    if (targetCase) {
      const matchBooking = bookings.find(b => b.jobNo.includes(targetCase.jobNo.replace('SP-', '')));
      if (matchBooking) {
        updateBookingStatus(matchBooking.id, 'Cancelled');
      }
    }
    addToast(full 
      ? `Full refund of $${targetCase?.amount.toFixed(2)} approved & returned via Stripe.` 
      : `Partial 50% refund issued for #${targetCase?.caseNo}.`, 
      'success'
    );
  };

  const handleDecline = (id: string) => {
    const targetCase = cases.find(c => c.id === id);
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Declined' } : c));
    addToast(`Refund dispute #${targetCase?.caseNo} dismissed. Escrow funds released to technician.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Refund &amp; Escrow Disputes</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              {pendingCount} Pending Resolution
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Review customer refund requests, examine job evidence, and authorize Stripe escrow returns</p>
        </div>

        <button
          onClick={() => {
            downloadCSV('refund_disputes_audit', cases.map(c => ({
              'Case No': c.caseNo,
              'Job No': c.jobNo,
              'Customer': c.customerName,
              'Technician': c.technicianName,
              'Service': c.serviceName,
              'Amount ($)': c.amount.toFixed(2),
              'Reason': c.reason,
              'Date': c.date,
              'Status': c.status
            })));
            addToast('Refund cases exported as CSV!', 'success');
          }}
          className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export Disputes
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Claims</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-0.5">{pendingCount} Cases</div>
          <div className="text-[10px] text-rose-500 font-bold mt-0.5">Under dispatch supervisor review</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disputed Escrow Capital</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">${totalDisputedAmount.toFixed(2)}</div>
          <div className="text-[10px] text-slate-400 font-bold mt-0.5">Frozen in Stripe reserve vault</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Historical Approval Rate</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">14.2%</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">85.8% resolved via pro return-visit</div>
        </div>
      </div>

      {/* Disputes Feed */}
      <div className="space-y-4">
        {cases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center flex flex-col items-center justify-center">
            <RotateCcw className="w-10 h-10 text-slate-300 mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No Refund Dispute Claims Active</h3>
            <p className="text-slate-400 text-xs max-w-sm mt-1">
              Escrow dispute claims, technician arrival SLA violations, and customer chargeback inquiries will appear here for administrative adjudication.
            </p>
          </div>
        ) : (
          cases.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:shadow-sm transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                    {c.caseNo}
                  </span>
                  <span className="font-mono text-xs text-slate-500 font-bold">• Job #{c.jobNo}</span>
                  <span className="text-xs text-slate-400 font-medium">• {c.date}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    c.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    c.status === 'Declined' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="text-sm font-extrabold text-slate-900">{c.serviceName}</div>
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{c.reason}"
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div>Customer: <strong className="text-slate-800 font-bold">{c.customerName}</strong></div>
                  <div>Technician: <strong className="text-slate-800 font-bold">{c.technicianName}</strong></div>
                  <div>Dispute Amount: <strong className="text-rose-700 font-extrabold">${c.amount.toFixed(2)}</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                {c.status === 'Pending Review' ? (
                  <>
                    <button
                      onClick={() => handleApprove(c.id, true)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve Full Refund
                    </button>
                    <button
                      onClick={() => handleApprove(c.id, false)}
                      className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Issue 50% Goodwill
                    </button>
                    <button
                      onClick={() => handleDecline(c.id)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Dismiss Claim
                    </button>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Case Closed
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
};
