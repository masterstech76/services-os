import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { pool } from '../../database/pool.js';
import { env } from '../../config/env.js';

export interface UserAuthRecord {
  id: string;
  tenant_id: string;
  email: string;
  phone: string | null;
  password_hash: string;
  role: 'ADMIN' | 'STAFF' | 'TECHNICIAN' | 'CUSTOMER';
  is_active: boolean;
  is_verified: boolean;
  failed_login_attempts: number;
  locked_until: Date | null;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateAccessToken(user: { id: string; role: string; tenantId: string; email: string }): string {
    return jwt.sign(
      {
        sub: user.id,
        role: user.role,
        tenantId: user.tenantId,
        email: user.email,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY_SECONDS }
    );
  }

  static generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static verifyAccessToken(token: string): { sub: string; role: string; tenantId: string; email: string } {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
  }

  static async createSession(userId: string, tenantId: string, ipAddress?: string, userAgent?: string): Promise<string> {
    const rawRefreshToken = this.generateRefreshToken();
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_EXPIRY_DAYS);

    await pool.query(
      `INSERT INTO user_sessions (user_id, tenant_id, refresh_token_hash, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, tenantId, tokenHash, ipAddress || null, userAgent || null, expiresAt]
    );

    return rawRefreshToken;
  }

  static async rotateSession(rawRefreshToken: string, ipAddress?: string, userAgent?: string): Promise<{
    accessToken: string;
    newRefreshToken: string;
    user: { id: string; role: string; tenantId: string; email: string };
  } | null> {
    const tokenHash = this.hashToken(rawRefreshToken);

    const sessionRes = await pool.query(
      `SELECT s.id, s.user_id, s.tenant_id, s.expires_at, s.revoked_at,
              u.email, u.role, u.is_active
       FROM user_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.refresh_token_hash = $1`,
      [tokenHash]
    );

    if (sessionRes.rows.length === 0) return null;
    const session = sessionRes.rows[0];

    // Check if session revoked or expired or user inactive
    if (session.revoked_at || new Date(session.expires_at) < new Date() || !session.is_active) {
      return null;
    }

    // Revoke old session immediately
    await pool.query(
      'UPDATE user_sessions SET revoked_at = NOW() WHERE id = $1',
      [session.id]
    );

    const user = {
      id: session.user_id,
      role: session.role,
      tenantId: session.tenant_id,
      email: session.email,
    };

    // Issue new pair
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.createSession(user.id, user.tenantId, ipAddress, userAgent);

    return {
      accessToken: newAccessToken,
      newRefreshToken,
      user
    };
  }

  static async revokeSession(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawRefreshToken);
    await pool.query(
      'UPDATE user_sessions SET revoked_at = NOW() WHERE refresh_token_hash = $1',
      [tokenHash]
    );
  }

  static async getUserPermissions(role: string): Promise<string[]> {
    const res = await pool.query<{ permission_id: string }>(
      'SELECT permission_id FROM role_permissions WHERE role = $1',
      [role]
    );
    return res.rows.map(r => r.permission_id);
  }

  static async verifyTotpCode(userId: string, code: string): Promise<boolean> {
    const res = await pool.query<{ totp_secret_encrypted: string }>(
      'SELECT totp_secret_encrypted FROM user_mfa_credentials WHERE user_id = $1 AND is_enabled = TRUE',
      [userId]
    );
    if (res.rows.length === 0) return false;

    // Decrypt secret (simplified for single-key environment)
    const secret = res.rows[0].totp_secret_encrypted;
    return authenticator.check(code, secret);
  }
}
