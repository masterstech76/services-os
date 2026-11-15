import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  X, 
  FileText, 
  DollarSign, 
  User, 
  Calendar, 
  Save, 
  CheckCircle2,
  Receipt
} from 'lucide-react';

export const CreateInvoiceModal: React.FC = () => {
  const { 
    isCreateInvoiceModalOpen, 
    setIsCreateInvoiceModalOpen, 
    addInvoice,
    customers,
    services
  } = useAdmin();

  const [customerName, setCustomerName] = useState(customers[0]?.name || 'Eleanor Vance');
  const [serviceName, setServiceName] = useState(services[0]?.name || 'Central Heat Pump Seasonal Maintenance');
  const [amount, setAmount] = useState<number>(350);
  const [dueDate, setDueDate] = useState('Nov 28, 2026');
  const [status, setStatus] = useState<'Pending' | 'Paid' | 'Overdue'>('Pending');

  if (!isCreateInvoiceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      customerName,
      serviceName,
      amount: Number(amount),
      status
    });
    setIsCreateInvoiceModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Generate Custom Invoice</h2>
              <p className="text-xs text-slate-500">Create itemized invoice with auto-tax &amp; Stripe reconciliation</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCreateInvoiceModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Customer</label>
            <select 
              value={customerName} 
              onChange={e => setCustomerName(e.target.value)} 
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
            >
              {customers.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.address})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Order / Service Rendered</label>
            <select 
              value={serviceName} 
              onChange={e => setServiceName(e.target.value)} 
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
            >
              {services.map(s => (
                <option key={s.id} value={s.name}>{s.name} (${s.basePrice})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Amount ($ USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                <input 
                  type="number" 
                  required 
                  value={amount} 
                  onChange={e => setAmount(Number(e.target.value))} 
                  className="w-full text-xs pl-7 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as any)} 
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Pending">Pending Payment</option>
                <option value="Paid">Paid in Full</option>
                <option value="Overdue">Overdue Notice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Due Date</label>
            <input 
              type="text" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              placeholder="Nov 28, 2026"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Calculated Sales Tax (8.25%):</span>
              <span className="font-extrabold text-slate-900 ml-1.5">${(amount * 0.0825).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500">Gross Total:</span>
              <span className="font-black text-emerald-700 ml-1.5">${(amount * 1.0825).toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateInvoiceModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Issue Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
