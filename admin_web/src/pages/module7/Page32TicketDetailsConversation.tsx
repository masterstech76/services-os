import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  Paperclip, 
  Smile, 
  User, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Phone
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'Customer' | 'Admin' | 'System' | 'Technician';
  senderName: string;
  text: string;
  time: string;
}

export const Page32TicketDetailsConversation: React.FC = () => {
  const { navigateToPage, addToast, tickets, selectedTicketId } = useAdmin();

  const ticket = tickets.find(t => t.id === selectedTicketId) || tickets[0] || null;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!ticket) return [];
    return [
      { 
        id: `m-init-${ticket.id}`, 
        sender: 'Customer', 
        senderName: ticket.customerName, 
        text: `Inquiry regarding ticket #${ticket.ticketNo}: ${ticket.subject}`, 
        time: ticket.createdAt || 'Recent' 
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState<string>('');

  if (!ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToPage(31)}
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Support Conversation Desk</h1>
            <p className="text-xs text-slate-500 mt-1">Real-time triage bridge between customer, assigned technician, and desk supervisor</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Support Ticket Selected</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm">
            There are currently no open support tickets or no specific ticket conversation was selected from the queue.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => navigateToPage(31)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              ← Support Tickets Queue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'Admin',
      senderName: 'Dispatch Supervisor',
      text: inputMessage.trim(),
      time: 'Just now'
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    addToast('Message dispatched to customer and technician mobile apps!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToPage(31)}
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ticket #{ticket.ticketNo}: Live Conversation</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                ticket.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                ticket.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                Priority: {ticket.priority}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct three-way operational bridge: Customer ({ticket.customerName}), Assigned Technician, and Desk Supervisor
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            addToast(`Ticket #${ticket.ticketNo} marked resolved and archived.`, 'success');
            navigateToPage(31);
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Mark Resolved &amp; Close Ticket
        </button>
      </div>

      {/* Main Grid: Left Chat Stream (8 Cols), Right Ticket Vitals (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Studio */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[580px]">
          {/* Chat Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'Admin' ? 'items-end' :
                  msg.sender === 'System' ? 'items-center' : 'items-start'
                }`}
              >
                {msg.sender === 'System' ? (
                  <div className="px-3 py-1 bg-slate-100 rounded-full text-[11px] text-slate-600 font-bold flex items-center gap-1.5 my-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    {msg.text}
                  </div>
                ) : (
                  <div className={`max-w-[80%] rounded-2xl p-4 text-xs ${
                    msg.sender === 'Admin'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : msg.sender === 'Technician'
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-200/80 rounded-bl-xs'
                      : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="font-extrabold text-[11px] flex items-center gap-1">
                        {msg.senderName}
                        {msg.sender === 'Admin' && <span className="text-[10px] text-emerald-400 font-bold">(Desk)</span>}
                        {msg.sender === 'Technician' && <span className="text-[10px] text-emerald-700 font-bold">(Pro)</span>}
                      </span>
                      <span className="text-[10px] opacity-70">{msg.time}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder={`Type operational reply to ${ticket.customerName}...`}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-slate-400 text-slate-900 shadow-2xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Ticket Details & Vitals */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 h-fit">
          <h2 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
            Ticket Specifications
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject</span>
              <span className="font-bold text-slate-800">{ticket.subject}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer</span>
                <span className="font-bold text-slate-800">{ticket.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                <span className="font-bold text-slate-800">{ticket.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Pro</span>
                <span className="font-bold text-emerald-700">Assigned Field Pro</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="font-bold text-slate-800">{ticket.status}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Territory</span>
              <span className="font-medium text-slate-700">Central Service Zone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
