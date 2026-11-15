import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  KeyRound, 
  Delete, 
  Clock, 
  UserCheck, 
  ArrowRightLeft, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const SessionLockModal: React.FC = () => {
  const { 
    isSessionLocked, 
    unlockSession, 
    userProfile, 
    currentRole, 
    logout,
    addToast 
  } = useAdmin();

  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isSessionLocked) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMessage('');
      if (nextPin.length === 4) {
        setTimeout(() => {
          if (!unlockSession(nextPin)) {
            setErrorMessage('Invalid PIN. Use default 1234 or Quick Resume.');
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage('');
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleQuickUnlock = () => {
    unlockSession('1234');
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300"
      tabIndex={-1}
    >
      <div 
        className="w-full max-w-md bg-[#0C1523] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow ambient background elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Security Header Banner */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ServiceOS Security Guard</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentTime || 'Active'}</span>
          </div>
        </div>

        {/* Lock Icon & Status */}
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0C3832] to-[#145a50] ring-4 ring-emerald-500/30 flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-emerald-300 animate-pulse" />
          </div>
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">
            Secured
          </span>
        </div>

        <h2 className="text-xl font-black text-white tracking-tight text-center">
          Console Session Locked
        </h2>
        <p className="text-xs text-slate-400 text-center mt-1 mb-5">
          Station node TX-01 suspended. Re-enter your enterprise 4-digit PIN.
        </p>

        {/* Current Active Operator Profile Chip */}
        <div className="w-full p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {userProfile.avatar ? (
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name || 'User'} 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center ring-2 ring-emerald-500/50">
                {(userProfile.name || (currentRole === 'ADMIN' ? 'A' : 'S')).charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{userProfile.name || (currentRole === 'ADMIN' ? 'Administrator' : 'Operations Staff')}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {currentRole === 'ADMIN' ? 'Administrator' : 'Operations Desk'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {userProfile.email || 'Authorized Session'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              unlockSession('1234');
              logout();
            }}
            className="px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-950/40 border border-rose-900/40 transition-colors cursor-pointer"
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>

        {/* PIN Dots Display */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {[0, 1, 2, 3].map(idx => (
            <div 
              key={idx} 
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                idx < pin.length 
                  ? 'bg-emerald-400 ring-4 ring-emerald-500/30 scale-110' 
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-3 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px] mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-base font-bold text-white transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-12 rounded-2xl bg-slate-900/40 hover:bg-slate-800/80 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-base font-bold text-white transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-slate-900/40 hover:bg-slate-800/80 text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="w-full flex items-center gap-3">
          <button
            onClick={handleQuickUnlock}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Unlock className="w-4 h-4" />
            <span>Quick Resume (Default PIN: 1234)</span>
          </button>
        </div>

        <div className="mt-4 text-[10px] text-slate-500 text-center font-mono">
          Station Terminal #01 • Secure Connection Active
        </div>
      </div>
    </div>
  );
};
