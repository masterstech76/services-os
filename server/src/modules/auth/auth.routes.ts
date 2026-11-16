import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../../database/pool.js';
import { AuthService } from './auth.service.js';
import { successResponse, errorResponse } from '../../types/envelope.js';
import { authenticate } from '../../middleware/rbac.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'STAFF', 'TECHNICIAN', 'CUSTOMER']).optional(),
});

const mfaVerifySchema = z.object({
  mfaSessionToken: z.string().min(10),
  totpCode: z.string().length(6),
});

export async function authRoutes(fastify: FastifyInstance) {
  // 1. User Login Route
  fastify.post('/login', {
    schema: {
      tags: ['Authentication'],
      summary: 'Authenticate with email and password',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          role: { type: 'string', enum: ['ADMIN', 'STAFF', 'TECHNICIAN', 'CUSTOMER'] }
        }
      }
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Invalid credentials format', requestId)
      );
    }

    const { email, password, role } = parsed.data;
    const tenantId = request.tenantId;

    // Query user in current tenant
    let queryText = 'SELECT * FROM users WHERE tenant_id = $1 AND email = $2';
    const params: any[] = [tenantId, email.toLowerCase().trim()];

    if (role) {
      queryText += ' AND role = $3';
      params.push(role);
    }

    const userRes = await pool.query(queryText, params);

    if (userRes.rows.length === 0) {
      return reply.status(401).send(
        errorResponse('INVALID_CREDENTIALS', 'Invalid email or password.', requestId)
      );
    }

    const user = userRes.rows[0];

    // Check account lockout
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return reply.status(423).send(
        errorResponse('ACCOUNT_LOCKED', 'Account temporarily locked due to multiple failed attempts. Try again later.', requestId)
      );
    }

    // Verify password
    const valid = await AuthService.verifyPassword(password, user.password_hash);

    if (!valid) {
      const failed = user.failed_login_attempts + 1;
      let lockUpdate = 'failed_login_attempts = $1';
      const lockParams: any[] = [failed, user.id];

      // Lock after 5 consecutive failures for 15 minutes
      if (failed >= 5) {
        lockUpdate += ', locked_until = NOW() + INTERVAL \'15 minutes\'';
      }

      await pool.query(`UPDATE users SET ${lockUpdate} WHERE id = $2`, lockParams);

      return reply.status(401).send(
        errorResponse('INVALID_CREDENTIALS', 'Invalid email or password.', requestId)
      );
    }

    // Reset failed login attempts
    await pool.query('UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1', [user.id]);

    // Check if MFA enabled for user
    const mfaRes = await pool.query(
      'SELECT is_enabled FROM user_mfa_credentials WHERE user_id = $1 AND is_enabled = TRUE',
      [user.id]
    );

    if (mfaRes.rows.length > 0) {
      // Return MFA required challenge
      const mfaSessionToken = AuthService.generateAccessToken({
        id: user.id,
        role: user.role,
        tenantId: user.tenant_id,
        email: user.email
      });

      return reply.status(200).send(
        successResponse({
          status: 'MFA_REQUIRED',
          mfaSessionToken,
          userId: user.id,
        }, requestId)
      );
    }

    // Issue tokens
    const accessToken = AuthService.generateAccessToken({
      id: user.id,
      role: user.role,
      tenantId: user.tenant_id,
      email: user.email,
    });

    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];
    const refreshToken = await AuthService.createSession(user.id, user.tenant_id, ipAddress, userAgent);

    // Set refresh token in HTTP-only cookie
    reply.setCookie('refresh_token', refreshToken, {
      path: '/api/v1/auth',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    const permissions = await AuthService.getUserPermissions(user.role);

    return reply.status(200).send(
      successResponse({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenant_id,
        },
        permissions
      }, requestId)
    );
  });

  // 2. MFA Verification Route
  fastify.post('/mfa/verify', {
    schema: {
      tags: ['Authentication'],
      summary: 'Verify two-factor TOTP authentication code',
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const parsed = mfaVerifySchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Invalid MFA verification payload', requestId)
      );
    }

    const { mfaSessionToken, totpCode } = parsed.data;

    try {
      const payload = AuthService.verifyAccessToken(mfaSessionToken);
      const valid = await AuthService.verifyTotpCode(payload.sub, totpCode);

      if (!valid) {
        return reply.status(401).send(
          errorResponse('INVALID_TOTP_CODE', 'The 6-digit verification code is invalid or expired.', requestId)
        );
      }

      const accessToken = AuthService.generateAccessToken({
        id: payload.sub,
        role: payload.role,
        tenantId: payload.tenantId,
        email: payload.email,
      });

      const refreshToken = await AuthService.createSession(payload.sub, payload.tenantId, request.ip, request.headers['user-agent']);

      reply.setCookie('refresh_token', refreshToken, {
        path: '/api/v1/auth',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
      });

      const permissions = await AuthService.getUserPermissions(payload.role);

      return reply.status(200).send(
        successResponse({
          accessToken,
          user: {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            tenantId: payload.tenantId,
          },
          permissions
        }, requestId)
      );
    } catch {
      return reply.status(401).send(
        errorResponse('MFA_SESSION_EXPIRED', 'MFA session token expired. Please log in again.', requestId)
      );
    }
  });

  // 3. Refresh Token Session Rotation Route
  fastify.post('/refresh', {
    schema: {
      tags: ['Authentication'],
      summary: 'Rotate session tokens',
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const rawRefreshToken = request.cookies.refresh_token || (request.body as any)?.refreshToken;

    if (!rawRefreshToken) {
      return reply.status(401).send(
        errorResponse('MISSING_REFRESH_TOKEN', 'Valid refresh token session cookie required.', requestId)
      );
    }

    const rotated = await AuthService.rotateSession(rawRefreshToken, request.ip, request.headers['user-agent']);

    if (!rotated) {
      return reply.status(401).send(
        errorResponse('SESSION_EXPIRED', 'Session expired or revoked. Please log in again.', requestId)
      );
    }

    reply.setCookie('refresh_token', rotated.newRefreshToken, {
      path: '/api/v1/auth',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    const permissions = await AuthService.getUserPermissions(rotated.user.role);

    return reply.status(200).send(
      successResponse({
        accessToken: rotated.accessToken,
        user: rotated.user,
        permissions
      }, requestId)
    );
  });

  // 4. Logout Route
  fastify.post('/logout', {
    schema: {
      tags: ['Authentication'],
      summary: 'Log out and invalidate session',
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const rawRefreshToken = request.cookies.refresh_token || (request.body as any)?.refreshToken;

    if (rawRefreshToken) {
      await AuthService.revokeSession(rawRefreshToken);
    }

    reply.clearCookie('refresh_token', { path: '/api/v1/auth' });

    return reply.status(200).send(
      successResponse({ loggedOut: true }, requestId)
    );
  });

  // 5. Current Authenticated User & Permissions
  fastify.get('/me', {
    preHandler: [authenticate],
    schema: {
      tags: ['Authentication'],
      summary: 'Get current authenticated user profile and permissions',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const userId = request.user!.id;

    const userRes = await pool.query(
      `SELECT u.id, u.email, u.phone, u.role, u.tenant_id, u.created_at,
              COALESCE(ap.full_name, sp.full_name, cp.full_name, pp.full_name, 'User') as full_name
       FROM users u
       LEFT JOIN admin_profiles ap ON ap.user_id = u.id
       LEFT JOIN staff_profiles sp ON sp.user_id = u.id
       LEFT JOIN customer_profiles cp ON cp.user_id = u.id
       LEFT JOIN provider_profiles pp ON pp.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return reply.status(404).send(
        errorResponse('USER_NOT_FOUND', 'User record not found.', requestId)
      );
    }

    const user = userRes.rows[0];
    const permissions = await AuthService.getUserPermissions(user.role);

    return reply.status(200).send(
      successResponse({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId: user.tenant_id,
          createdAt: user.created_at
        },
        tenant: request.tenant,
        permissions
      }, requestId)
    );
  });
}
