import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';
import { AuthService } from '../src/modules/auth/auth.service.js';
import { pool } from '../src/database/pool.js';

describe('Fastify Route Injection & End-to-End Contract Integration Suite (TEST-01)', () => {
  let app: FastifyInstance;
  let originalPoolQuery: any;

  before(async () => {
    // Mock pool query for tenant resolution and health check in test runner
    originalPoolQuery = pool.query;
    (pool as any).query = async (text: any, params?: any[]) => {
      const q = typeof text === 'string' ? text : text?.text || '';
      if (q.includes('SELECT 1')) {
        return { rows: [{ '?column?': 1 }], rowCount: 1 };
      }
      if (q.includes('FROM tenants')) {
        return {
          rows: [{
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Test Tenant',
            slug: 'test',
            currency_code: 'USD',
            currency_symbol: '$',
            timezone: 'America/New_York',
            default_platform_commission_bps: 1500,
          }],
          rowCount: 1,
        };
      }
      return { rows: [], rowCount: 0 };
    };

    app = await buildApp();
    await app.ready();
  });

  after(async () => {
    (pool as any).query = originalPoolQuery;
    await app.close();
  });

  it('GET /health returns HTTP 200 with standardized envelope', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/health',
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, true);
    assert.equal(body.data.status, 'pass');
    assert.equal(body.data.database, 'healthy');
    assert.ok(body.meta.requestId);
  });

  it('POST /api/v1/bookings/:id/confirm-payment rejects unauthenticated requests with HTTP 401 (PAY-01)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/bookings/00000000-0000-0000-0000-000000000001/confirm-payment',
      headers: {
        'x-tenant-id': '00000000-0000-0000-0000-000000000001',
      },
    });

    assert.equal(res.statusCode, 401);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  });

  it('POST /api/v1/finances/payouts rejects unauthenticated requests with HTTP 401', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/finances/payouts',
      headers: {
        'x-tenant-id': '00000000-0000-0000-0000-000000000001',
        'idempotency-key': 'test-preauth-key-1',
      },
      payload: {
        providerId: '00000000-0000-0000-0000-000000000001',
        amountCents: 5000,
      },
    });

    assert.equal(res.statusCode, 401);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  });

  it('POST /api/v1/finances/payouts rejects unauthorized customer/technician roles with HTTP 403', async () => {
    // Generate valid access token for CUSTOMER role
    const customerToken = AuthService.generateAccessToken({
      sub: '00000000-0000-0000-0000-000000000099',
      tenantId: '00000000-0000-0000-0000-000000000001',
      role: 'CUSTOMER',
      email: 'customer@test.com',
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/finances/payouts',
      headers: {
        authorization: `Bearer ${customerToken}`,
        'x-tenant-id': '00000000-0000-0000-0000-000000000001',
        'idempotency-key': 'test-payout-key-1',
      },
      payload: {
        providerId: '00000000-0000-0000-0000-000000000001',
        amountCents: 5000,
      },
    });

    assert.equal(res.statusCode, 403);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'FORBIDDEN');
  });

  it('POST /api/v1/finances/payouts rejects missing Idempotency-Key header with HTTP 400 (PAY-02)', async () => {
    // Generate valid access token for canonical ADMIN role
    const adminToken = AuthService.generateAccessToken({
      sub: '00000000-0000-0000-0000-000000000001',
      tenantId: '00000000-0000-0000-0000-000000000001',
      role: 'ADMIN',
      email: 'admin@test.com',
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/finances/payouts',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'x-tenant-id': '00000000-0000-0000-0000-000000000001',
        // Omitting idempotency-key header
      },
      payload: {
        providerId: '00000000-0000-0000-0000-000000000001',
        amountCents: 5000,
      },
    });

    assert.equal(res.statusCode, 400);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'SCHEMA_VALIDATION_ERROR');
  });

  it('GET /api/v1/finances/overview and /api/v1/finances/metrics require authentication (WEB-01)', async () => {
    const resOverview = await app.inject({
      method: 'GET',
      url: '/api/v1/finances/overview',
      headers: {
        'x-tenant-id': '00000000-0000-0000-0000-000000000001',
      },
    });
    assert.equal(resOverview.statusCode, 401);

    const resMetrics = await app.inject({
      method: 'GET',
      url: '/api/v1/finances/metrics',
      headers: {
        'x-tenant-id': '00000000-0000-0000-0000-000000000001',
      },
    });
    assert.equal(resMetrics.statusCode, 401);
  });

  it('POST /api/v1/auth/login validates required request schema', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      headers: {
        'x-tenant-id': '00000000-0000-0000-0000-000000000001',
      },
      payload: {
        email: 'invalid-email',
        // Missing password
      },
    });

    assert.equal(res.statusCode, 400);
    const body = JSON.parse(res.payload);
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'SCHEMA_VALIDATION_ERROR');
  });
});
