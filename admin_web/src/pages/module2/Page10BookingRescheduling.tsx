import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Calendar, 
  Clock, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  MessageSquare, 
  BellRing,
  User
} from 'lucide-react';

export const Page10BookingRescheduling: React.FC = () => {
  const { bookings, navigateToPage, addToast, rescheduleBooking } = useAdmin();
  const [selectedBookingId, setSelectedBookingId] = useState<string>(() => bookings[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow, Oct 25');
  const [selectedSlot, setSelectedSlot] = useState<string>('02:00 PM - 04:00 PM');
  const [reason, setReason] = useState<string>('Customer requested afternoon slot due to office hours');

  const selectedBooking = bookings.find(b => b.id === selectedBookingId) || bookings[0] || null;

  const handleReschedule = () => {
    if (selectedBooking) {
      rescheduleBooking(selectedBooking.id, selectedDate, selectedSlot, reason);
      navigateToPage(6); // Return to All Bookings
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking Rescheduling</h1>
          <p className="text-xs text-slate-500 mt-1">Adjust service time slots, resolve scheduling conflicts, and notify customers and technicians</p>
        </div>

        <button
          onClick={handleReschedule}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Confirm &amp; Notify All Parties
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Reschedule Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Booking Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900">1. Select Booking to Reschedule</h2>
            <select
              value={selectedBookingId}
              onChange={e => setSelectedBookingId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {bookings.length === 0 ? (
                <option value="">No bookings available to reschedule</option>
              ) : (
                bookings.map(b => (
                  <option key={b.id} value={b.id}>
                    #{b.jobNo} — {b.customerName} ({b.serviceName}) • Currently {b.scheduleDate} at {b.scheduleTime}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* New Slot Picker */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900">2. Choose New Date &amp; Available Slot</h2>
            
            {/* Date Pills */}
            <div>
              <div className="text-xs font-bold text-slate-600 mb-2">Select Target Date:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Today, Oct 24', 'Tomorrow, Oct 25', 'Sat, Oct 26', 'Sun, Oct 27'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      selectedDate === d
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mx-auto mb-1 opacity-80" />
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Matrix */}
            <div>
              <div className="text-xs font-bold text-slate-600 mb-2">Select Time Slot:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { slot: '08:00 AM - 10:00 AM', available: true },
                  { slot: '10:00 AM - 12:00 PM', available: false },
                  { slot: '12:00 PM - 02:00 PM', available: true },
                  { slot: '02:00 PM - 04:00 PM', available: true },
                  { slot: '04:00 PM - 06:00 PM', available: true },
                  { slot: '06:00 PM - 08:00 PM', available: false }
                ].map(({ slot, available }) => (
                  <button
                    key={slot}
                    disabled={!available}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      !available
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                        : selectedSlot === slot
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>{slot}</div>
                    <div className="text-[10px] mt-0.5">
                      {available ? 'Pro Available' : 'Slot Full'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reason Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900">3. Reason for Reschedule (Recorded in Audit Trail)</h2>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              placeholder="Explain reason for schedule modification..."
            />
          </div>
        </div>

        {/* Right Column: Notification Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Automated SMS Preview</h3>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs space-y-2">
              <div className="font-bold text-emerald-900">
                To: {selectedBooking ? `${selectedBooking.customerName} (${selectedBooking.customerPhone})` : 'Customer Notification'}
              </div>
              <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
                {selectedBooking
                  ? `"Hi ${selectedBooking.customerName}, your ${selectedBooking.serviceName} (Job #${selectedBooking.jobNo}) has been successfully rescheduled to ${selectedDate} at ${selectedSlot}. Your technician will arrive on time. Track live in ServiceOS App."`
                  : 'Select an active booking to preview the automated customer SMS reschedule notification.'}
              </p>
              <div className="text-[10px] text-emerald-700 font-bold">✓ SMS Gateway: Ready to fire via Twilio</div>
            </div>

            <div className="p-4 bg-purple-50/70 border border-purple-200/60 rounded-xl text-xs space-y-2">
              <div className="font-bold text-purple-900">
                To: {selectedBooking ? `${selectedBooking.technicianName} (Assigned Pro)` : 'Technician Dispatch Alert'}
              </div>
              <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
                {selectedBooking
                  ? `"Dispatch Alert: Job #${selectedBooking.jobNo} shifted to ${selectedDate} at ${selectedSlot}. Check your updated schedule calendar."`
                  : 'Select an active booking to preview the technician dispatch update alert.'}
              </p>
              <div className="text-[10px] text-purple-700 font-bold">✓ Firebase Cloud Messaging: Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
