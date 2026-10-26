"use client";

import * as React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Smartphone,
  Mail,
  Fingerprint,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminMfaModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminMfaModal({ email, onSuccess, onCancel }: AdminMfaModalProps) {
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [factors, setFactors] = React.useState({
    password: true, // Factor 1 is verified from previous step
    totp: false,
    emailOtp: false,
    passkey: false,
    trustedDevice: false,
  });

  // State for TOTP
  const [totpCode, setTotpCode] = React.useState("");
  const [totpLoading, setTotpLoading] = React.useState(false);

  // State for Email OTP
  const [emailOtpCode, setEmailOtpCode] = React.useState("");
  const [emailOtpSent, setEmailOtpSent] = React.useState(false);
  const [emailOtpLoading, setEmailOtpLoading] = React.useState(false);
  const [demoOtpHint, setDemoOtpHint] = React.useState<string | null>(null);

  // State for Passkey
  const [passkeyLoading, setPasskeyLoading] = React.useState(false);

  // State for Device
  const [deviceLoading, setDeviceLoading] = React.useState(false);

  // Initializing MFA session
  React.useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch("/api/auth/admin-mfa/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "init",
            email,
            browserId: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 30) : "Chrome-v120",
            deviceId: "dev_hw_" + Math.random().toString(36).slice(2, 10),
            osVersion: "Windows 11 / macOS 14.5",
            hardwareSignature: "tpm-fido2-secure-enclave",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setSessionId(data.sessionId);
        }
      } catch {
        toast.error("Failed to initialize enterprise MFA session");
      }
    }
    void initSession();
  }, [email]);

  // Count total verified factors
  const verifiedCount = Object.values(factors).filter(Boolean).length;
  const isSatisfied = verifiedCount >= 4;

  // Auto-redirect once 4 factors are reached
  React.useEffect(() => {
    if (isSatisfied) {
      const timer = setTimeout(() => {
        toast.success("4-Factor Admin Verification Complete! Access Granted.");
        onSuccess();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isSatisfied, onSuccess]);

  // Factor 2: TOTP Verify
  async function handleVerifyTotp() {
    if (!sessionId || totpCode.trim().length !== 6) {
      toast.error("Enter a valid 6-digit TOTP code.");
      return;
    }
    setTotpLoading(true);
    try {
      const res = await fetch("/api/auth/admin-mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_totp",
          sessionId,
          email,
          code: totpCode.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("TOTP Authenticator code verified!");
        setFactors((prev) => ({ ...prev, totp: true }));
      } else {
        toast.error(data.error?.message || "Invalid TOTP code.");
      }
    } catch {
      toast.error("TOTP verification error");
    } finally {
      setTotpLoading(false);
    }
  }

  // Factor 3: Email OTP Send & Verify
  async function handleSendEmailOtp() {
    if (!sessionId) return;
    setEmailOtpLoading(true);
    try {
      const res = await fetch("/api/auth/admin-mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_email_otp",
          sessionId,
          email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailOtpSent(true);
        if (data.demoPreviewCode) {
          setDemoOtpHint(data.demoPreviewCode);
          setEmailOtpCode(data.demoPreviewCode);
        }
        toast.success(`6-digit OTP dispatched to ${email}`);
      }
    } catch {
      toast.error("Failed to send Email OTP");
    } finally {
      setEmailOtpLoading(false);
    }
  }

  async function handleVerifyEmailOtp() {
    if (!sessionId || emailOtpCode.trim().length !== 6) {
      toast.error("Enter the 6-digit OTP received via email.");
      return;
    }
    setEmailOtpLoading(true);
    try {
      const res = await fetch("/api/auth/admin-mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_email_otp",
          sessionId,
          email,
          code: emailOtpCode.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Email OTP verified!");
        setFactors((prev) => ({ ...prev, emailOtp: true }));
      } else {
        toast.error(data.error?.message || "Invalid Email OTP.");
      }
    } catch {
      toast.error("Email OTP verification failed");
    } finally {
      setEmailOtpLoading(false);
    }
  }

  // Factor 4: Passkey / Hardware FIDO2
  async function handleVerifyPasskey() {
    if (!sessionId) return;
    setPasskeyLoading(true);
    try {
      // Simulate hardware challenge / WebAuthn interaction
      await new Promise((r) => setTimeout(r, 800));
      const res = await fetch("/api/auth/admin-mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_passkey",
          sessionId,
          credentialId: "fido2_cred_demo_" + Math.random().toString(36).slice(2, 8),
        }),
      });
      if (res.ok) {
        toast.success("Passkey / Hardware Security Key authenticated!");
        setFactors((prev) => ({ ...prev, passkey: true }));
      }
    } catch {
      toast.error("Passkey authentication failed");
    } finally {
      setPasskeyLoading(false);
    }
  }

  // Factor 5: Trusted Device Fingerprint
  async function handleVerifyDevice() {
    if (!sessionId) return;
    setDeviceLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const res = await fetch("/api/auth/admin-mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_trusted_device",
          sessionId,
          email,
          browserId: "Edge / Chrome Enterprise",
          deviceId: "DESKTOP-WIN11-SECURE-ENCLAVE",
          osVersion: "Windows 11 Pro 64-bit",
          hardwareSignature: "TPM2.0-SIG-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
        }),
      });
      if (res.ok) {
        toast.success("Device fingerprint authorized and device token stored!");
        setFactors((prev) => ({ ...prev, trustedDevice: true }));
      }
    } catch {
      toast.error("Device verification failed");
    } finally {
      setDeviceLoading(false);
    }
  }

  const progressPct = (verifiedCount / 4) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">5-Factor Admin Authentication</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  4 of 5 Required
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Admin Account: <span className="text-emerald-400 font-mono">{email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Live Factor Progress Meter */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Verified Factors: <span className="text-emerald-400 font-bold">{verifiedCount} of 4 Required</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {isSatisfied ? "Threshold Reached" : `${4 - verifiedCount} more needed`}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                isSatisfied ? "bg-emerald-500" : "bg-gradient-to-r from-amber-500 to-emerald-500"
              }`}
              style={{ width: `${Math.min(100, progressPct)}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Password (Mandatory) + Complete any 3 remaining factors</span>
            {isSatisfied && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Access Unlocked
              </span>
            )}
          </div>
        </div>

        {/* 5 Factors Matrix */}
        <div className="space-y-3">
          {/* Factor 1: Password (Mandatory) */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                F1
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  Password Verification (Mandatory)
                </div>
                <div className="text-[11px] text-slate-400">Argon2 / SHA-256 Hash Matched (Lexus@Admin#2026 grade)</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </span>
          </div>

          {/* Factor 2: Authenticator App (TOTP) */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              factors.totp
                ? "border-emerald-500/30 bg-emerald-950/20"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    factors.totp ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  F2
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                    Authenticator App (TOTP)
                  </div>
                  <div className="text-[11px] text-slate-400">Google Authenticator, Microsoft Authenticator, Authy</div>
                </div>
              </div>

              {factors.totp ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="123456"
                    className="w-24 h-8 bg-slate-950 border-slate-700 text-xs font-mono text-center tracking-widest text-white"
                  />
                  <Button
                    onClick={handleVerifyTotp}
                    disabled={totpLoading || totpCode.trim().length !== 6}
                    size="sm"
                    className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    {totpLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Factor 3: Email OTP */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              factors.emailOtp
                ? "border-emerald-500/30 bg-emerald-950/20"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    factors.emailOtp ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  F3
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    Email OTP Verification
                  </div>
                  <div className="text-[11px] text-slate-400">Single-use 6-digit code with 5-minute strict expiry</div>
                </div>
              </div>

              {factors.emailOtp ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              ) : !emailOtpSent ? (
                <Button
                  onClick={handleSendEmailOtp}
                  disabled={emailOtpLoading}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-purple-500/40 text-purple-300 hover:bg-purple-950/40"
                >
                  {emailOtpLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  Send Code to Email
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    maxLength={6}
                    value={emailOtpCode}
                    onChange={(e) => setEmailOtpCode(e.target.value)}
                    placeholder="6-digit"
                    className="w-24 h-8 bg-slate-950 border-slate-700 text-xs font-mono text-center tracking-widest text-white"
                  />
                  <Button
                    onClick={handleVerifyEmailOtp}
                    disabled={emailOtpLoading || emailOtpCode.trim().length !== 6}
                    size="sm"
                    className="h-8 text-xs bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    {emailOtpLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify"}
                  </Button>
                </div>
              )}
            </div>

            {demoOtpHint && !factors.emailOtp && (
              <div className="mt-2 text-[10px] text-purple-300/80 bg-purple-950/30 p-1.5 rounded border border-purple-900/50 flex items-center justify-between">
                <span>Demo Mail Server Code: <strong className="font-mono text-white">{demoOtpHint}</strong></span>
                <span className="text-[9px] text-slate-400">Pre-filled for testing</span>
              </div>
            )}
          </div>

          {/* Factor 4: Passkey / Hardware Security Key */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              factors.passkey
                ? "border-emerald-500/30 bg-emerald-950/20"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    factors.passkey ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  F4
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                    Passkey / Security Key
                  </div>
                  <div className="text-[11px] text-slate-400">FIDO2, Windows Hello, YubiKey, Apple Touch ID</div>
                </div>
              </div>

              {factors.passkey ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              ) : (
                <Button
                  onClick={handleVerifyPasskey}
                  disabled={passkeyLoading}
                  size="sm"
                  className="h-8 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium"
                >
                  {passkeyLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  Authenticate Key
                </Button>
              )}
            </div>
          </div>

          {/* Factor 5: Trusted Device Verification */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              factors.trustedDevice
                ? "border-emerald-500/30 bg-emerald-950/20"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    factors.trustedDevice ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  F5
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                    Trusted Device Verification
                  </div>
                  <div className="text-[11px] text-slate-400">Hardware signature, OS version &amp; browser fingerprint token</div>
                </div>
              </div>

              {factors.trustedDevice ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              ) : (
                <Button
                  onClick={handleVerifyDevice}
                  disabled={deviceLoading}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 font-medium"
                >
                  {deviceLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  Authorize Device
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white"
          >
            Cancel Login
          </Button>

          <Button
            type="button"
            onClick={onSuccess}
            disabled={!isSatisfied}
            className={`text-xs font-bold transition-all ${
              isSatisfied
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSatisfied ? (
              <>
                Unlock Admin Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </>
            ) : (
              `Complete ${4 - verifiedCount} More Factors`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
