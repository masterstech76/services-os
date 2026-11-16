import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../../database/pool.js';
import { migrateUp } from '../../database/migrate.js';
import { AuthService } from '../auth/auth.service.js';
import { successResponse, errorResponse } from '../../types/envelope.js';
import { env } from '../../config/env.js';

const testDbSchema = z.object({
  databaseUrl: z.string().optional(),
});

const provisionSchema = z.object({
  provisioningToken: z.string().min(8),
  companyName: z.string().min(2).max(255),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8).max(100),
  adminFullName: z.string().min(2).max(255),
  currencyCode: z.string().length(3).default('USD'),
  currencySymbol: z.string().min(1).max(5).default('$'),
  timezone: z.string().default('UTC'),
  platformCommissionPercent: z.number().min(0).max(100).default(15),
  primaryBrandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#6366F1'),
});

export async function installerRoutes(fastify: FastifyInstance) {
  // 1. Test Database Connectivity
  fastify.post('/test-db', {
    schema: {
      tags: ['Turnkey Installer'],
      summary: 'Test PostgreSQL and PostGIS connectivity during setup',
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    
    try {
      const res = await pool.query('SELECT version(), NOW() as now');
      return reply.status(200).send(
        successResponse({
          connected: true,
          databaseVersion: res.rows[0].version,
          serverTime: res.rows[0].now
        }, requestId)
      );
    } catch (err: any) {
      return reply.status(500).send(
        errorResponse('DATABASE_CONNECTION_ERROR', err.message || 'Could not connect to PostgreSQL', requestId)
      );
    }
  });

  // 2. Turnkey Setup Wizard & First Administrator Provisioning
  fastify.post('/provision', {
    schema: {
      tags: ['Turnkey Installer'],
      summary: 'One-time initial system provisioning and master admin setup',
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const parsed = provisionSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Invalid provisioning payload parameters.', requestId)
      );
    }

    const data = parsed.data;

    // A. Verify Provisioning Token
    const providedToken = request.headers['x-bootstrap-token'] as string || data.provisioningToken;
    if (providedToken !== env.INITIAL_ADMIN_BOOTSTRAP_SECRET) {
      return reply.status(401).send(
        errorResponse('INVALID_BOOTSTRAP_TOKEN', 'The provided setup authorization token is invalid.', requestId)
      );
    }

    // B. Security Guard: Prevent Re-provisioning if already completed
    const existingInstalled = await pool.query(
      'SELECT id FROM tenants WHERE installer_completed_at IS NOT NULL LIMIT 1'
    );
    if (existingInstalled.rows.length > 0) {
      return reply.status(403).send(
        errorResponse('INSTALLER_LOCKED', 'This system has already been provisioned and is permanently locked.', requestId)
      );
    }

    // C. Execute Database Migrations
    await migrateUp();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const slug = data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 50);
      const commissionBps = Math.round(data.platformCommissionPercent * 100);

      // D. Create Buyer Organization / Tenant
      const tenantRes = await client.query(
        `INSERT INTO tenants (
          name, slug, primary_color, currency_code, currency_symbol, timezone, 
          default_platform_commission_bps, is_active, installer_completed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING id`,
        [
          data.companyName,
          slug,
          data.primaryBrandColor,
          data.currencyCode.toUpperCase(),
          data.currencySymbol,
          data.timezone,
          commissionBps,
          true
        ]
      );
      const tenantId = tenantRes.rows[0].id;

      // E. Create First Master Administrator
      const passwordHash = await AuthService.hashPassword(data.adminPassword);
      const userRes = await client.query(
        `INSERT INTO users (
          tenant_id, email, password_hash, role, is_active, is_verified
        ) VALUES ($1, $2, $3, 'ADMIN', TRUE, TRUE)
        RETURNING id`,
        [tenantId, data.adminEmail.toLowerCase().trim(), passwordHash]
      );
      const adminUserId = userRes.rows[0].id;

      // F. Create Admin Profile
      await client.query(
        `INSERT INTO admin_profiles (user_id, tenant_id, full_name)
         VALUES ($1, $2, $3)`,
        [adminUserId, tenantId, data.adminFullName]
      );

      // G. Initialize Chart of Accounts for Tenant
      const defaultAccounts = [
        { no: '1010', name: 'Operating Cash Clearing', type: 'ASSET' },
        { no: '1020', name: 'Stripe Holding Escrow Clearing', type: 'ASSET' },
        { no: '2010', name: 'Customer Escrow Deposits Liability', type: 'LIABILITY' },
        { no: '2020', name: 'Technician Unpaid Payables', type: 'LIABILITY' },
        { no: '4010', name: 'Platform Commission Revenue', type: 'REVENUE' },
        { no: '5010', name: 'Stripe Merchant Processing Expense', type: 'EXPENSE' },
      ];

      for (const acc of defaultAccounts) {
        await client.query(
          `INSERT INTO ledger_accounts (tenant_id, account_number, account_name, account_type, currency_code)
           VALUES ($1, $2, $3, $4, $5)`,
          [tenantId, acc.no, acc.name, acc.type, data.currencyCode.toUpperCase()]
        );
      }

      // H. Initialize Dynamic CMS Config
      await client.query(
        `INSERT INTO tenant_cms_configs (tenant_id, hero_heading, hero_subheading, search_placeholder)
         VALUES ($1, $2, $3, $4)`,
        [
          tenantId,
          `${data.companyName} — Your Service, Our Priority`,
          `Book certified, on-demand home service professionals with upfront pricing and escrow guarantee.`,
          `Search services from ${data.companyName}...`
        ]
      );

      // I. Record Permanent Provisioning Audit Log
      await client.query(
        `INSERT INTO installer_provision_logs (tenant_id, provisioned_admin_email, client_ip, environment_signature)
         VALUES ($1, $2, $3, $4)`,
        [tenantId, data.adminEmail, request.ip, process.platform]
      );

      await client.query('COMMIT');

      // J. Issue Administrator Tokens
      const accessToken = AuthService.generateAccessToken({
        id: adminUserId,
        role: 'ADMIN',
        tenantId,
        email: data.adminEmail,
      });

      const refreshToken = await AuthService.createSession(adminUserId, tenantId, request.ip, request.headers['user-agent']);

      reply.setCookie('refresh_token', refreshToken, {
        path: '/api/v1/auth',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
      });

      return reply.status(201).send(
        successResponse({
          provisioned: true,
          tenant: {
            id: tenantId,
            name: data.companyName,
            slug,
            currencyCode: data.currencyCode,
            currencySymbol: data.currencySymbol
          },
          admin: {
            id: adminUserId,
            email: data.adminEmail,
            fullName: data.adminFullName,
            role: 'ADMIN'
          },
          accessToken
        }, requestId)
      );
    } catch (err: any) {
      await client.query('ROLLBACK');
      request.log.error(err);
      return reply.status(500).send(
        errorResponse('PROVISIONING_FAILED', err.message || 'Provisioning workflow failed', requestId)
      );
    } finally {
      client.release();
    }
  });
}
