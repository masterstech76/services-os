import React, { useEffect, useRef, useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: (errorCode: string) => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  resetTrigger?: number;
}

// Cloudflare official test sitekey (always passes in non-production/testing)
const CLOUDFLARE_TEST_SITEKEY = '1x00000000000000000000AA';

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  onExpire,
  resetTrigger = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<'LOADING' | 'READY' | 'VERIFIED' | 'ERROR'>('LOADING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const siteKey =
    (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() ||
    CLOUDFLARE_TEST_SITEKEY;

  useEffect(() => {
    let isMounted = true;

    function renderWidget() {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      // Clean up previous widget instance if exists
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (_) {}
        widgetIdRef.current = null;
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          size: 'normal',
          callback: (token: string) => {
            if (!isMounted) return;
            setStatus('VERIFIED');
            setErrorMessage(null);
            onVerify(token);
          },
          'expired-callback': () => {
            if (!isMounted) return;
            setStatus('READY');
            if (onExpire) onExpire();
          },
          'error-callback': (code: string) => {
            if (!isMounted) return;
            setStatus('ERROR');
            setErrorMessage(`Turnstile challenge error (${code}). Please retry.`);
            if (onExpire) onExpire();
          },
        });
        widgetIdRef.current = id;
        setStatus('READY');
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('ERROR');
        setErrorMessage('Failed to initialize verification challenge.');
      }
    }

    // Check if Turnstile script is already loaded
    if (window.turnstile) {
      renderWidget();
    } else {
      // Load script dynamically
      const existingScript = document.getElementById('cf-turnstile-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'cf-turnstile-script';
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) renderWidget();
        };
        script.onerror = () => {
          if (isMounted) {
            setStatus('ERROR');
            setErrorMessage('Unable to load Cloudflare Turnstile challenge.');
          }
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', renderWidget);
      }
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (_) {}
      }
    };
  }, [siteKey]);

  // Reset widget when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0 && widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
        setStatus('READY');
      } catch (_) {}
    }
  }, [resetTrigger]);

  return (
    <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {status === 'VERIFIED' ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          ) : status === 'ERROR' ? (
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          ) : (
            <Shield className="w-4 h-4 text-slate-500" />
          )}
          <span className="text-xs font-bold text-slate-800">Human Verification</span>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          Cloudflare Turnstile
        </span>
      </div>

      {/* Turnstile Container */}
      <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />

      {status === 'LOADING' && (
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Loading security challenge...</span>
        </div>
      )}

      {status === 'ERROR' && errorMessage && (
        <div className="text-[11px] font-semibold text-rose-600 mt-1 text-center">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
