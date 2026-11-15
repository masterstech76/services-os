import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { downloadCSV } from '../../utils/exportUtils';
import { 
  FileText, 
  Download, 
  Search, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { Invoice } from '../../types';

export const Page28CustomerInvoices: React.FC = () => {
  const { invoices, addToast, setIsCreateInvoiceModalOpen } = useAdmin();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header matching Screenshot 07 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Invoices</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {invoices.length} Invoices Generated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tax-compliant billing statements, itemized repair receipts, and escrow payouts</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              downloadCSV('customer_invoices', ['Invoice #', 'Customer Name', 'Service', 'Date', 'Status', 'Total Amount ($)'], invoices.map(i => [i.invoiceNo, i.customerName, i.serviceName, i.date, i.status, i.amount]));
              addToast('Invoices ledger downloaded as CSV spreadsheet!', 'success');
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={() => setIsCreateInvoiceModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Tabs */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice #, customer name, service..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['All', 'Paid', 'Pending', 'Overdue'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Service Rendered</th>
                <th className="py-3 px-4">Billed Amount</th>
                <th className="py-3 px-4">Date Issued</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    {inv.invoiceNo}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {inv.customerName}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {inv.serviceName}
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                    ${inv.amount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {inv.date}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        downloadCSV(`invoice_${inv.invoiceNo}`, [{
                          'Invoice No': inv.invoiceNo,
                          'Customer': inv.customerName,
                          'Service': inv.serviceName,
                          'Issue Date': inv.date,
                          'Amount ($)': inv.amount,
                          'Tax (8.25%)': (inv.amount * 0.0825).toFixed(2),
                          'Total Payable ($)': (inv.amount * 1.0825).toFixed(2),
                          'Payment Status': inv.status
                        }]);
                        addToast(`Invoice ${inv.invoiceNo} downloaded as CSV spreadsheet!`, 'success');
                      }}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Download Invoice CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
