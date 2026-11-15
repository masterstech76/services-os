/**
 * ServicePro OS — Structured Security Audit Logger & Monitoring Service
 * Standards: OWASP ASVS v4.0.3 Chapter 7, NIST SP 800-92
 */

export type SecurityEventType = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'ACCOUNT_LOCKED'
  | 'MFA_CHALLENGE'
  | 'MFA_VERIFIED'
  | 'MFA_FAILED'
  | 'SESSION_LOCKED'
  | 'SESSION_UNLOCKED'
  | 'SESSION_EXPIRED'
  | 'SESSION_REVOKED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'PRIVILEGE_ELEVATION_DENIED'
  | 'PASSWORD_POLICY_VIOLATION'
  | 'MASTER_ADMIN_INITIALIZED'
  | 'COMMISSION_RATE_ALTERED';

export type SecuritySeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  role: string;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  ipAddress: string;
  details: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'servicepro_security_logs';
const MAX_LOGS = 200;

export function recordSecurityEvent(
  eventType: SecurityEventType,
  actorEmail: string,
  role: string,
  severity: SecuritySeverity,
  details: string,
  metadata?: Record<string, any>
): SecurityEventLog {
  // Sanitize: ensure no passwords, OTPs, or session tokens enter logs
  const sanitizedMeta = metadata ? { ...metadata } : {};
  delete sanitizedMeta.password;
  delete sanitizedMeta.token;
  delete sanitizedMeta.secret;
  delete sanitizedMeta.otp;

  const event: SecurityEventLog = {
    id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    actorEmail: actorEmail || 'unauthenticated@system.local',
    role: role || 'GUEST',
    eventType,
    severity,
    ipAddress: '127.0.0.1', // Web client simulated IP / proxy
    details,
    metadata: sanitizedMeta
  };

  try {
    const existing: SecurityEventLog[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = [event, ...existing].slice(0, MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  return event;
}

export function getSecurityLogs(): SecurityEventLog[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
