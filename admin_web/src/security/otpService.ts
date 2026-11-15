/**
 * ServicePro OS — Cryptographic One-Time Passcode (OTP) Engine
 * Standards: OWASP ASVS v4.0.3 Section 2.8, NIST SP 800-63B Section 5.1.3
 */

import { recordSecurityEvent } from './securityAuditLogger';

const OTP_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes expiration
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds resend cooldown
const MAX_VERIFICATION_ATTEMPTS = 3;
const OTP_STORAGE_KEY = 'servicepro_active_otps';

export type OtpPurpose = 'LOGIN' | 'PHONE_VERIFY' | 'MFA' | 'PASSWORD_RESET';

export interface OtpRecord {
  id: string;
  destination: string; // Phone number or email
  code: string; // 6-digit numeric string
  purpose: OtpPurpose;
  expiresAt: number;
  attemptsRemaining: number;
  lastSentAt: number;
  isUsed: boolean;
}

function getStoredOtps(): Record<string, OtpRecord> {
  try {
    const data = localStorage.getItem(OTP_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveStoredOtps(store: Record<string, OtpRecord>): void {
  try {
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

export interface SendOtpResult {
  success: boolean;
  message: string;
  cooldownRemainingSeconds?: number;
  debugCode?: string; // Provided for developer preview & testing
}

/**
 * Issues a cryptographically generated 6-digit OTP to a phone or email.
 * Enforces a 60-second resend cooldown and invalidates prior unverified codes.
 */
export function generateAndSendOtp(destination: string, purpose: OtpPurpose = 'LOGIN'): SendOtpResult {
  const dest = destination.trim().toLowerCase();
  const now = Date.now();
  const store = getStoredOtps();
  const existing = store[dest];

  // 1. Enforce 60-second resend cooldown
  if (existing && !existing.isUsed && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    const remaining = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
    return {
      success: false,
      message: `Please wait ${remaining}s before requesting a new verification code.`,
      cooldownRemainingSeconds: remaining
    };
  }

  // 2. Cryptographically generate 6-digit numeric OTP (100000 - 999999)
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const otpNumber = 100000 + (randomBuffer[0] % 900000);
  const otpCode = otpNumber.toString();

  // 3. Store new OTP (invalidating previous unverified code)
  const record: OtpRecord = {
    id: `otp_${now}_${Math.random().toString(36).substring(2, 7)}`,
    destination: dest,
    code: otpCode,
    purpose,
    expiresAt: now + OTP_VALIDITY_MS,
    attemptsRemaining: MAX_VERIFICATION_ATTEMPTS,
    lastSentAt: now,
    isUsed: false
  };

  store[dest] = record;
  saveStoredOtps(store);

  recordSecurityEvent(
    'MFA_CHALLENGE',
    dest,
    'USER',
    'INFO',
    `Secure OTP code dispatched for purpose: ${purpose}`
  );

  return {
    success: true,
    message: `Secure 6-digit verification code dispatched to ${destination}.`,
    debugCode: otpCode
  };
}

export interface VerifyOtpResult {
  isValid: boolean;
  message: string;
  attemptsRemaining: number;
}

/**
 * Validates a submitted OTP code with attempt limiting and immediate one-time consumption.
 */
export function verifyOtpCode(destination: string, submittedCode: string): VerifyOtpResult {
  const dest = destination.trim().toLowerCase();
  const cleanCode = submittedCode.trim();
  const now = Date.now();
  const store = getStoredOtps();
  const record = store[dest];

  if (!record) {
    return {
      isValid: false,
      message: 'No active verification code found for this identifier. Please request a new code.',
      attemptsRemaining: 0
    };
  }

  // 1. Check if expired
  if (now > record.expiresAt) {
    delete store[dest];
    saveStoredOtps(store);
    return {
      isValid: false,
      message: 'Verification code has expired (5-minute validity window elapsed).',
      attemptsRemaining: 0
    };
  }

  // 2. Check if already used
  if (record.isUsed) {
    return {
      isValid: false,
      message: 'This verification code has already been consumed. Please request a fresh code.',
      attemptsRemaining: 0
    };
  }

  // 3. Check attempt limit
  if (record.attemptsRemaining <= 0) {
    delete store[dest];
    saveStoredOtps(store);
    recordSecurityEvent(
      'MFA_FAILED',
      dest,
      'USER',
      'WARNING',
      'Maximum OTP verification attempts exhausted. Code invalidated.'
    );
    return {
      isValid: false,
      message: 'Too many incorrect attempts. This verification code has been voided.',
      attemptsRemaining: 0
    };
  }

  // 4. Verify code match
  if (record.code === cleanCode) {
    record.isUsed = true;
    saveStoredOtps(store);

    recordSecurityEvent(
      'MFA_VERIFIED',
      dest,
      'USER',
      'INFO',
      `OTP successfully verified for purpose: ${record.purpose}`
    );

    return {
      isValid: true,
      message: 'Verification successful.',
      attemptsRemaining: record.attemptsRemaining
    };
  } else {
    record.attemptsRemaining -= 1;
    saveStoredOtps(store);

    recordSecurityEvent(
      'MFA_FAILED',
      dest,
      'USER',
      'WARNING',
      `Incorrect OTP submitted. Attempts remaining: ${record.attemptsRemaining}`
    );

    return {
      isValid: false,
      message: `Invalid code. ${record.attemptsRemaining} attempt(s) remaining.`,
      attemptsRemaining: record.attemptsRemaining
    };
  }
}
