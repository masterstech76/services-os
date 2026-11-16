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
        tokenType: 'ACCESS_TOKEN',
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY_SECONDS }
    );
  }

  static generateMfaChallengeToken(user: { id: string; role: string; tenantId: string; email: string }): string {
    return jwt.sign(
      {
        sub: user.id,
        role: user.role,
        tenantId: user.tenantId,
        email: user.email,
        tokenType: 'MFA_CHALLENGE',
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: 300 } // 5 minutes validity for challenge completion
    );
  }

  static generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static verifyAccessToken(token: string): { sub: string; role: string; tenantId: string; email: string; tokenType?: string } {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
    if (payload.tokenType === 'MFA_CHALLENGE') {
      throw new Error('MFA_CHALLENGE_TOKEN_NOT_AUTHORIZED');
    }
    return payload;
  }

  static verifyMfaChallengeToken(token: string): { sub: string; role: string; tenantId: string; email: string } {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
    if (payload.tokenType !== 'MFA_CHALLENGE') {
      throw new Error('INVALID_MFA_CHALLENGE_TOKEN');
    }
    return payload;
  }

  static encryptTotpSecret(secret: string): string {
    const key = Buffer.from(env.APP_ENCRYPTION_KEY.padEnd(64, '0').slice(0, 64), 'hex');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  static decryptTotpSecret(encryptedPayload: string): string {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 3) {
      return encryptedPayload; // Fallback for raw unencrypted secrets in test fixtures
    }
    const [ivHex, authTagHex, encryptedText] = parts;
    const key = Buffer.from(env.APP_ENCRYPTION_KEY.padEnd(64, '0').slice(0, 64), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
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
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const sessionRes = await client.query(
        `SELECT s.id, s.user_id, s.tenant_id, s.expires_at, s.revoked_at,
                u.email, u.role, u.is_active
         FROM user_sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.refresh_token_hash = $1
         FOR UPDATE OF s`,
        [tokenHash]
      );

      if (sessionRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const session = sessionRes.rows[0];

      // Replay Detection: Revoke entire token family if already revoked
      if (session.revoked_at) {
        await client.query(
          'UPDATE user_sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
          [session.user_id]
        );
        await client.query('COMMIT');
        return null;
      }

      // Check expiry or inactive user
      if (new Date(session.expires_at) < new Date() || !session.is_active) {
        await client.query('UPDATE user_sessions SET revoked_at = NOW() WHERE id = $1', [session.id]);
        await client.query('COMMIT');
        return null;
      }

      // Revoke old session immediately
      await client.query(
        'UPDATE user_sessions SET revoked_at = NOW() WHERE id = $1',
        [session.id]
      );

      const user = {
        id: session.user_id,
        role: session.role,
        tenantId: session.tenant_id,
        email: session.email,
      };

      // Generate new pair within the locked transaction
      const newAccessToken = this.generateAccessToken(user);
      const rawNewRefreshToken = this.generateRefreshToken();
      const newTokenHash = this.hashToken(rawNewRefreshToken);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_EXPIRY_DAYS);

      await client.query(
        `INSERT INTO user_sessions (user_id, tenant_id, refresh_token_hash, ip_address, user_agent, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.id, user.tenantId, newTokenHash, ipAddress || null, userAgent || null, expiresAt]
      );

      await client.query('COMMIT');

      return {
        accessToken: newAccessToken,
        newRefreshToken: rawNewRefreshToken,
        user
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
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

    const rawOrEncrypted = res.rows[0].totp_secret_encrypted;
    const secret = this.decryptTotpSecret(rawOrEncrypted);
    return authenticator.check(code, secret);
  }
}
