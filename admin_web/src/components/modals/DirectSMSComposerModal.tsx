import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { supabaseService } from '../../services/supabaseClient';
import { 
  X, 
  Send, 
  MessageSquare, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const QUICK_TEMPLATES = [
  "Technician is currently en route to your property (ETA ~12 mins).",
  "Service visit completed. Your digital signed receipt has been emailed.",
  "Operations Notice: Please reply with your gate access code or arrival instructions.",
  "Emergency Dispatch Notice: A licensed technician has been assigned to your ticket."
];

export const DirectSMSComposerModal: React.FC = () => {
  const { isSMSModalOpen, closeSMSModal, smsRecipient, addToast } = useAdmin();
  const [message, setMessage] = useState(QUICK_TEMPLATES[0]);
  const [isSending, setIsSending] = useState(false);

  if (!isSMSModalOpen || !smsRecipient) return null;

  const twilioSid = typeof localStorage !== 'undefined' ? localStorage.getItem('cfg_twilioSid') : null;
  const isTwilioConfigured = Boolean(
    supabaseService.isConfigured() ||
    (twilioSid && twilioSid.trim() && !twilioSid.includes('placeholder') && !twilioSid.includes('AC_LIVE'))
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      addToast('Please enter an SMS message body', 'warning');
      return;
    }

    setIsSending(true);
    try {
      if (supabaseService.isConfigured()) {
        const result = await supabaseService.sendSms(smsRecipient.phone, message.trim());
        setIsSending(false);
        if (result.success) {
          addToast(`SMS delivered via Twilio Edge Function to ${smsRecipient.name} (${smsRecipient.phone}).`, 'success');
        } else {
          addToast(`SMS delivery failed: ${result.error || 'Twilio Edge Function not configured'}`, 'warning');
        }
        closeSMSModal();
        return;
      }

      setIsSending(false);
      addToast('SMS Gateway Unconfigured: Connect Supabase & deploy the twilio-sms Edge Function to send live cellular SMS.', 'warning');
      closeSMSModal();
    } catch {
      setIsSending(false);
      addToast('SMS transmission failed: Gateway unreachable.', 'warning');
      closeSMSModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">Direct SMS Dispatch</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${isTwilioConfigured ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  {isTwilioConfigured ? 'Gateway Active' : 'Setup Required'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                To: <strong className="text-slate-800">{smsRecipient.name}</strong> • {smsRecipient.phone}
              </p>
            </div>
          </div>
          <button 
            onClick={closeSMSModal}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          {/* Quick Preset Template Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>One-Click Dispatch Templates</span>
            </label>
            <div className="space-y-1.5">
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(tmpl)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border cursor-pointer ${message === tmpl ? 'bg-blue-50/80 border-blue-400 text-blue-900 font-bold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium'}`}
                >
                  {tmpl}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Message Text Body</label>
              <span className="text-[10px] text-slate-400">{message.length}/160 chars (1 SMS segment)</span>
            </div>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type custom text alert..."
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-center gap-2 text-[11px] text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direct cellular delivery via configured SMS dispatch gateway.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeSMSModal}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Transmitting...' : 'Send Instant SMS'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
