import { FastifyRequest, FastifyReply } from 'fastify';
import { pool } from '../database/pool.js';
import { errorResponse } from '../types/envelope.js';

declare module 'fastify' {
  interface FastifyRequest {
    tenantId: string;
    user?: {
      id: string;
      role: string;
      tenantId: string;
      email: string;
    };
    tenant?: {
      id: string;
      name: string;
      slug: string;
      currencyCode: string;
      currencySymbol: string;
      timezone: string;
      commissionBps: number;
    };
  }
}

export async function tenantResolver(request: FastifyRequest, reply: FastifyReply) {
  // Allow health and installer routes without tenant resolution
  if (
    request.url.startsWith('/health') ||
    request.url.startsWith('/docs') ||
    request.url.startsWith('/api/v1/installer')
  ) {
    return;
  }

  const requestId = request.id || `req_${Date.now()}`;
  
  // 1. Resolve tenant ID from header or user claim
  const headerTenantId = request.headers['x-tenant-id'] as string;
  const tokenTenantId = (request.user as any)?.tenantId;
  const candidateId = headerTenantId || tokenTenantId;

  try {
    let queryText = 'SELECT id, name, slug, currency_code, currency_symbol, timezone, default_platform_commission_bps FROM tenants WHERE is_active = TRUE';
    const params: any[] = [];

    if (candidateId) {
      queryText += ' AND id = $1';
      params.push(candidateId);
    } else {
      // Default to the first active tenant in the installation
      queryText += ' ORDER BY created_at ASC LIMIT 1';
    }

    const res = await pool.query(queryText, params);

    if (res.rows.length === 0) {
      return reply.status(404).send(
        errorResponse('TENANT_NOT_FOUND', 'Active organization/tenant profile not found.', requestId)
      );
    }

    const row = res.rows[0];
    request.tenantId = row.id;
    request.tenant = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      currencyCode: row.currency_code,
      currencySymbol: row.currency_symbol,
      timezone: row.timezone,
      commissionBps: row.default_platform_commission_bps,
    };
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send(
      errorResponse('TENANT_RESOLUTION_ERROR', 'Failed to resolve tenant organization.', requestId)
    );
  }
}
