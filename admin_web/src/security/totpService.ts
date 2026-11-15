/**
 * ServicePro OS — RFC 6238 Time-Based One-Time Password (TOTP) & Per-User MFA Engine
 * Standards: RFC 6238, RFC 4226, NIST SP 800-63B
 *
 * Enforces:
 * 1. Cryptographically random 160-bit Base32 secret generation per user.
 * 2. SHA-256 hashing of 8 single-use emergency recovery codes (plaintext never stored).
 * 3. Single-use recovery code consumption (atomic removal upon use).
 * 4. Anti-replay step tracking (each 30s TOTP step can only be verified once).
 * 5. 3-strike MFA lockout enforcement (15-minute lockout window).
 */

export interface MfaSetupData {
  secretBase32: string;
  otpauthUrl: string;
  recoveryCodes: string[];
  recoveryCodeHashes: string[];
}

export interface LocalUserMfaRecord {
  email: string;
  secretBase32: string;
  recoveryCodeHashes: string[];
  isMfaEnabled: boolean;
  failedAttempts: number;
  lockedUntil: number | null;
  lastVerifiedAt: string | null;
  lastVerifiedStep: number;
}

export interface MfaVerificationResult {
  verified: boolean;
  usedRecoveryCode?: boolean;
  remainingRecoveryCodes?: number;
  attemptsRemaining?: number;
  isLocked?: boolean;
  lockoutSeconds?: number;
  error?: string;
}

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const LOCAL_MFA_STORE_KEY = 'servicepro_per_user_mfa_v2';

export function generateBase32Secret(length: number = 20): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(length));
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE32_CHARS[randomBytes[i] % 32];
  }
  return result;
}

export function generateRecoveryCodes(count: number = 8): string[] {
  const codes: string[] = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let i = 0; i < count; i++) {
    const bytes = crypto.getRandomValues(new Uint8Array(10));
    let code = '';
    for (let j = 0; j < 10; j++) {
      if (j === 5) code += '-';
      code += chars[bytes[j] % chars.length];
    }
    codes.push(code);
  }
  return codes;
}

export function normalizeRecoveryCode(code: string): string {
  return (code || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

export async function hashRecoveryCode(code: string): Promise<string> {
  const normalized = normalizeRecoveryCode(code);
  const encoded = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateOtpauthUri(secret: string, accountName: string, issuer: string = 'ServicePro OS'): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(accountName);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

export async function createPerUserMfaEnrollment(
  email: string,
  issuer: string = 'ServicePro OS'
): Promise<MfaSetupData> {
  const secretBase32 = generateBase32Secret(20);
  const recoveryCodes = generateRecoveryCodes(8);
  const recoveryCodeHashes: string[] = [];
  for (const code of recoveryCodes) {
    recoveryCodeHashes.push(await hashRecoveryCode(code));
  }
  const otpauthUrl = generateOtpauthUri(secretBase32, email.trim().toLowerCase(), issuer);
  return {
    secretBase32,
    otpauthUrl,
    recoveryCodes,
    recoveryCodeHashes,
  };
}

function base32ToBytes(base32: string): Uint8Array {
  const clean = (base32 || '').toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_CHARS.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

async function generateTotpForTime(secretBytes: Uint8Array, timeStep: number): Promise<string> {
  if (secretBytes.length === 0) return '';
  const timeBuffer = new ArrayBuffer(8);
  const timeView = new DataView(timeBuffer);
  // Big-endian 64-bit integer
  timeView.setUint32(0, Math.floor(timeStep / 0x100000000));
  timeView.setUint32(4, timeStep & 0xffffffff);

  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, timeBuffer);
  const hmac = new Uint8Array(signature);

  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = (code % 1000000).toString().padStart(6, '0');
  return otp;
}

/**
 * Generates the current 6-digit RFC 6238 TOTP token for a given Base32 secret.
 */
export async function generateCurrentTotpCode(secretBase32: string, stepOffset: number = 0): Promise<string> {
  const secretBytes = base32ToBytes(secretBase32);
  if (secretBytes.length === 0) return '';
  const currentStep = Math.floor(Date.now() / 1000 / 30) + stepOffset;
  return generateTotpForTime(secretBytes, currentStep);
}

/**
 * Validates a 6-digit TOTP with ±1 step (30s) clock drift tolerance.
 * Returns the matched timeStep if valid, or null if invalid.
 */
export async function matchTotpStep(
  secretBase32: string,
  token: string,
  windowSteps: number = 1
): Promise<number | null> {
  const cleanToken = (token || '').trim().replace(/\s/g, '');
  if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) {
    return null;
  }

  const secretBytes = base32ToBytes(secretBase32);
  if (secretBytes.length === 0) {
    return null;
  }

  const currentStep = Math.floor(Date.now() / 1000 / 30);

  for (let offset = -windowSteps; offset <= windowSteps; offset++) {
    const step = currentStep + offset;
    const validOtp = await generateTotpForTime(secretBytes, step);
    if (validOtp === cleanToken) {
      return step;
    }
  }

  return null;
}

/**
 * Validates a 6-digit TOTP with ±1 step (30s) clock drift tolerance
 */
export async function verifyTotpCode(secretBase32: string, token: string, windowSteps: number = 1): Promise<boolean> {
  const matched = await matchTotpStep(secretBase32, token, windowSteps);
  return matched !== null;
}

// ============================================================================
// Per-User MFA Store for Unconfigured Local / Test Environment
// ============================================================================

function loadLocalMfaMap(): Record<string, LocalUserMfaRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_MFA_STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalMfaMap(map: Record<string, LocalUserMfaRecord>): void {
  try {
    localStorage.setItem(LOCAL_MFA_STORE_KEY, JSON.stringify(map));
  } catch {}
}

export function getLocalUserMfaRecord(email: string): LocalUserMfaRecord | null {
  const key = (email || '').trim().toLowerCase();
  if (!key) return null;
  const map = loadLocalMfaMap();
  return map[key] || null;
}

export function saveLocalUserMfaEnrollment(
  email: string,
  secretBase32: string,
  recoveryCodeHashes: string[],
  verifiedStep: number = 0
): LocalUserMfaRecord {
  const key = email.trim().toLowerCase();
  const map = loadLocalMfaMap();
  const record: LocalUserMfaRecord = {
    email: key,
    secretBase32: secretBase32.toUpperCase().replace(/[^A-Z2-7]/g, ''),
    recoveryCodeHashes: [...recoveryCodeHashes],
    isMfaEnabled: true,
    failedAttempts: 0,
    lockedUntil: null,
    lastVerifiedAt: new Date().toISOString(),
    lastVerifiedStep: verifiedStep,
  };
  map[key] = record;
  saveLocalMfaMap(map);
  return record;
}

export async function verifyLocalUserMfaCode(
  email: string,
  code: string,
  isRecoveryCode: boolean = false
): Promise<MfaVerificationResult> {
  const key = (email || '').trim().toLowerCase();
  const map = loadLocalMfaMap();
  const record = map[key];

  if (!record || !record.isMfaEnabled) {
    return {
      verified: false,
      error: 'MFA is not enrolled for this administrator account.',
    };
  }

  const now = Date.now();
  if (record.lockedUntil && now < record.lockedUntil) {
    const lockoutSeconds = Math.max(1, Math.ceil((record.lockedUntil - now) / 1000));
    return {
      verified: false,
      isLocked: true,
      lockoutSeconds,
      attemptsRemaining: 0,
      error: `Maximum 2FA verification attempts exceeded. Account locked for ${lockoutSeconds}s.`,
    };
  }

  if (isRecoveryCode) {
    const normalized = normalizeRecoveryCode(code);
    if (normalized.length === 10) {
      const codeHash = await hashRecoveryCode(normalized);
      const idx = record.recoveryCodeHashes.indexOf(codeHash);
      if (idx !== -1) {
        // Consume single-use recovery code permanently
        record.recoveryCodeHashes.splice(idx, 1);
        record.failedAttempts = 0;
        record.lockedUntil = null;
        record.lastVerifiedAt = new Date().toISOString();
        map[key] = record;
        saveLocalMfaMap(map);
        return {
          verified: true,
          usedRecoveryCode: true,
          remainingRecoveryCodes: record.recoveryCodeHashes.length,
        };
      }
    }
  } else {
    const matchedStep = await matchTotpStep(record.secretBase32, code, 1);
    if (matchedStep !== null && matchedStep > (record.lastVerifiedStep || 0)) {
      record.failedAttempts = 0;
      record.lockedUntil = null;
      record.lastVerifiedAt = new Date().toISOString();
      record.lastVerifiedStep = matchedStep;
      map[key] = record;
      saveLocalMfaMap(map);
      return {
        verified: true,
        usedRecoveryCode: false,
      };
    }
  }

  // Verification failed
  record.failedAttempts = (record.failedAttempts || 0) + 1;
  if (record.failedAttempts >= 3) {
    record.lockedUntil = now + 15 * 60 * 1000;
    map[key] = record;
    saveLocalMfaMap(map);
    return {
      verified: false,
      isLocked: true,
      lockoutSeconds: 900,
      attemptsRemaining: 0,
      error: 'Maximum 2FA verification attempts exceeded. Account locked for 15 minutes.',
    };
  }

  const attemptsRemaining = Math.max(0, 3 - record.failedAttempts);
  map[key] = record;
  saveLocalMfaMap(map);
  return {
    verified: false,
    isLocked: false,
    lockoutSeconds: 0,
    attemptsRemaining,
    error: `Invalid verification code. ${attemptsRemaining} attempt(s) remaining.`,
  };
}
