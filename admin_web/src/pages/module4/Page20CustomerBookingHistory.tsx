import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  FileText, 
  Download, 
  Star, 
  Eye, 
  MapPin, 
  DollarSign
} from 'lucide-react';

export const Page20CustomerBookingHistory: React.FC = () => {
  const { customers, bookings, navigateToPage, addToast } = useAdmin();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || 'c-1');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const customerBookings = bookings.filter(b => b.customerName === selectedCustomer.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Booking History</h1>
          <p className="text-xs text-slate-500 mt-1">Audit log of all past service appointments, invoices, ratings, and job completions</p>
        </div>

        {/* Customer switcher */}
        <select
          value={selectedCustomerId}
          onChange={e => setSelectedCustomerId(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none cursor-pointer"
        >
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.totalBookings} past jobs)</option>
          ))}
        </select>
      </div>

      {/* History Feed */}
      <div className="space-y-4">
        {customerBookings.map((job) => (
          <div key={job.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:shadow-sm transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    #{job.jobNo}
                  </span>
                  <span className="text-xs font-bold text-slate-400">• {job.scheduleDate} at {job.scheduleTime}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {job.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">{job.serviceName}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Category: <strong>{job.category}</strong></span>
                  <span>•</span>
                  <span>Servicing Pro: <strong className="text-slate-800">{job.technicianName}</strong></span>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900">${job.estimate}.00</div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Paid via Stripe Escrow
                  </span>
                </div>

                <button
                  onClick={() => {
                    downloadCSV(`tax_invoice_${job.jobNo}`, [{
                      'Invoice No': `INV-${job.jobNo}`,
                      'Customer': job.customerName,
                      'Service': job.serviceName,
                      'Date': job.scheduleDate,
                      'Technician': job.technicianName,
                      'Amount ($)': job.estimate,
                      'Tax (8.25%)': (job.estimate * 0.0825).toFixed(2),
                      'Total Settled ($)': (job.estimate * 1.0825).toFixed(2),
                      'Payment Method': 'Stripe Escrow Verified',
                      'Status': 'Paid'
                    }]);
                    addToast(`Tax invoice for #${job.jobNo} downloaded as CSV!`, 'success');
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Download Invoice CSV"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateToPage(9)} // View Details
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Dossier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
