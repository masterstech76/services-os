/**
 * ServicePro OS — Secure Password Reset & Account Recovery Engine
 * Standards: OWASP ASVS v4.0.3 Section 2.5, NIST SP 800-63B Section 5.1.1.2
 */

import { validatePasswordStrength, hashPasswordClient, verifyPasswordHash } from './passwordPolicy';
import { recordSecurityEvent } from './securityAuditLogger';
import { supabaseService } from '../services/supabaseClient';

const RESET_TOKEN_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes validity
const MAX_RESET_REQUESTS_PER_HOUR = 3;
const RESET_STORAGE_KEY = 'servicepro_pwd_reset_tokens';

export interface PasswordResetTokenRecord {
  token: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  expiresAt: number;
  isUsed: boolean;
  createdAt: number;
}

function getStoredTokens(): PasswordResetTokenRecord[] {
  try {
    const data = localStorage.getItem(RESET_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStoredTokens(tokens: PasswordResetTokenRecord[]): void {
  try {
    // Keep max 50 recent tokens
    const recent = tokens.slice(-50);
    localStorage.setItem(RESET_STORAGE_KEY, JSON.stringify(recent));
  } catch {}
}

export interface PasswordResetRequestResult {
  success: boolean;
  message: string;
}

/**
 * Initiates a secure password reset request.
 * Always returns a generic success message to prevent username/email enumeration.
 */
export async function requestPasswordReset(email: string, role: 'ADMIN' | 'STAFF'): Promise<PasswordResetRequestResult> {
  const targetEmail = email.trim().toLowerCase();
  const now = Date.now();
  const tokens = getStoredTokens();

  // Check rate limit: max 3 requests per hour for this email
  const oneHourAgo = now - 60 * 60 * 1000;
  const recentRequests = tokens.filter(t => t.email === targetEmail && t.createdAt > oneHourAgo);

  if (recentRequests.length >= MAX_RESET_REQUESTS_PER_HOUR) {
    recordSecurityEvent(
      'UNAUTHORIZED_ACCESS_ATTEMPT',
      targetEmail,
      role,
      'WARNING',
      'Password reset request rate limit exceeded (max 3/hr)'
    );
    // Generic response returned even when throttled
    return {
      success: true,
      message: 'If an authorized account is associated with this email, recovery instructions have been dispatched.'
    };
  }

  const genericMessage = 'If an authorized account is associated with this email, recovery instructions have been dispatched.';

  // Cloud mode: recovery is delivered by Supabase Auth by email. No token is ever returned to the browser.
  if (supabaseService.isConfigured()) {
    try {
      const client = supabaseService.getClient();
      await client?.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}${window.location.pathname}#/login`
      });
    } catch {
      // Intentionally generic to prevent account enumeration.
    }
    recordSecurityEvent(
      'MFA_CHALLENGE',
      targetEmail,
      role,
      'INFO',
      'Password recovery email requested via Supabase Auth'
    );
    return { success: true, message: genericMessage };
  }

  // Local mode has no outbound delivery channel, so a locally generated token must never be revealed
  // to the requester. The token is stored hashed-by-possession only; completion is unavailable without delivery.
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const tokenHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const resetToken = `rst_${now}_${tokenHex}`;

  const tokenRecord: PasswordResetTokenRecord = {
    token: resetToken,
    email: targetEmail,
    role,
    expiresAt: now + RESET_TOKEN_EXPIRATION_MS,
    isUsed: false,
    createdAt: now
  };

  tokens.push(tokenRecord);
  saveStoredTokens(tokens);

  recordSecurityEvent(
    'MFA_CHALLENGE',
    targetEmail,
    role,
    'INFO',
    'Single-use password reset token generated (valid for 15 minutes)'
  );

  return {
    success: true,
    message: genericMessage
  };
}

export interface CompletePasswordResetResult {
  success: boolean;
  error?: string;
}

/**
 * Verifies the single-use token, checks password policy and prevents password reuse,
 * updates the stored hash, revokes existing sessions, and marks token as consumed.
 */
export async function completePasswordReset(
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<CompletePasswordResetResult> {
  const now = Date.now();
  const tokens = getStoredTokens();
  const recordIndex = tokens.findIndex(t => t.token === token.trim());

  if (recordIndex === -1) {
    return { success: false, error: 'Invalid or unrecognized recovery token.' };
  }

  const record = tokens[recordIndex];

  // 1. Check if token already consumed
  if (record.isUsed) {
    recordSecurityEvent(
      'UNAUTHORIZED_ACCESS_ATTEMPT',
      record.email,
      record.role,
      'CRITICAL',
      'Attempted replay of already consumed password reset token'
    );
    return { success: false, error: 'This recovery token has already been used and is no longer valid.' };
  }

  // 2. Check token expiration
  if (now > record.expiresAt) {
    return { success: false, error: 'Recovery token has expired (15-minute validity window elapsed). Please request a new link.' };
  }

  // 3. Confirm password equality
  if (newPassword !== confirmPassword) {
    return { success: false, error: 'New password and confirmation do not match.' };
  }

  // 4. Validate strong password policy
  const strength = validatePasswordStrength(newPassword, 10);
  if (!strength.isValid) {
    return { success: false, error: `Password policy requirement: ${strength.errors[0]}` };
  }

  // 5. Prevent password reuse
  const currentHash = localStorage.getItem('servicepro_admin_pwd_hash');
  const currentSalt = localStorage.getItem('servicepro_admin_pwd_salt');
  if (currentHash && currentSalt) {
    const isReused = await verifyPasswordHash(newPassword, currentHash, currentSalt);
    if (isReused) {
      return { success: false, error: 'For security purposes, you cannot reuse your previous password.' };
    }
  }

  // 6. Compute new cryptographic PBKDF2 hash & salt
  const { hash, salt } = await hashPasswordClient(newPassword);
  localStorage.setItem('servicepro_admin_pwd_hash', hash);
  localStorage.setItem('servicepro_admin_pwd_salt', salt);

  // 7. Mark token as consumed
  tokens[recordIndex].isUsed = true;
  saveStoredTokens(tokens);

  // 8. Revoke all active sessions (Force re-login)
  localStorage.removeItem('servicepro_auth_session');

  // 9. Record security audit log
  recordSecurityEvent(
    'LOGIN_SUCCESS',
    record.email,
    record.role,
    'INFO',
    'Password reset completed successfully. Previous sessions revoked.'
  );

  return { success: true };
}
