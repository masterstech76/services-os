import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import Stripe from 'stripe';
import { pool } from '../../database/pool.js';
import { successResponse, errorResponse } from '../../types/envelope.js';
import { authenticate, requirePermission } from '../../middleware/rbac.js';
import { env } from '../../config/env.js';

const invoiceQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['DRAFT', 'AUTHORIZED', 'PAID', 'REFUNDED', 'VOID']).optional(),
});

const payoutTriggerSchema = z.object({
  providerId: z.string().uuid(),
  amountCents: z.number().int().positive(),
  description: z.string().optional(),
});

export async function financeRoutes(fastify: FastifyInstance) {
  // Capture raw body buffer for Stripe webhook HMAC signature verification
  fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
    try {
      (req as any).rawBody = body;
      const json = JSON.parse((body as Buffer).toString('utf8'));
      done(null, json);
    } catch (err: any) {
      err.statusCode = 400;
      done(err, undefined);
    }
  });

  // Public Inbound Stripe Webhook (Idempotent Event Processing & HMAC Signature Verification)
  fastify.post('/webhooks/stripe', {
    schema: {
      tags: ['Finances & Ledger'],
      summary: 'Inbound Stripe webhook listener with idempotency verification and signature verification',
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const sig = request.headers['stripe-signature'] as string;
    let event: any = request.body;

    // Verify HMAC signature when STRIPE_WEBHOOK_SECRET is configured
    if (env.STRIPE_WEBHOOK_SECRET) {
      if (!sig) {
        return reply.status(400).send(
          errorResponse('MISSING_STRIPE_SIGNATURE', 'Missing Stripe signature header.', requestId)
        );
      }
      try {
        const stripe = new Stripe(env.STRIPE_SECRET_KEY || '');
        const rawPayload = (request as any).rawBody || (typeof request.body === 'string' ? request.body : JSON.stringify(request.body));
        event = stripe.webhooks.constructEvent(rawPayload, sig, env.STRIPE_WEBHOOK_SECRET);
      } catch (sigErr: any) {
        return reply.status(400).send(
          errorResponse('INVALID_STRIPE_SIGNATURE', `Signature verification failed: ${sigErr.message}`, requestId)
        );
      }
    } else if (env.NODE_ENV === 'production') {
      return reply.status(500).send(
        errorResponse('STRIPE_WEBHOOK_UNCONFIGURED', 'STRIPE_WEBHOOK_SECRET is required to process inbound webhooks in production.', requestId)
      );
    }

    if (!event || !event.id || !event.type) {
      return reply.status(400).send(
        errorResponse('INVALID_PAYLOAD', 'Missing Stripe event payload or id', requestId)
      );
    }

    const eventId = event.id;
    const eventType = event.type;

    // 1. Idempotency Check
    const existing = await pool.query(
      `SELECT id FROM webhook_events WHERE id = $1`,
      [eventId]
    );

    if (existing.rowCount && existing.rowCount > 0) {
      // Already processed, return 200 OK immediately
      return reply.status(200).send({ received: true, idempotent: true });
    }

    // 2. Process Known Events
    if (eventType === 'payment_intent.succeeded') {
      const paymentIntent = event.data?.object;
      if (paymentIntent?.id) {
        await pool.query(
          `UPDATE payment_transactions 
           SET status = 'SUCCEEDED', captured_amount_cents = authorized_amount_cents 
           WHERE stripe_payment_intent_id = $1`,
          [paymentIntent.id]
        );
      }
    } else if (eventType === 'charge.refunded') {
      const charge = event.data?.object;
      if (charge?.payment_intent) {
        await pool.query(
          `UPDATE payment_transactions 
           SET status = 'REFUNDED', refunded_amount_cents = $1 
           WHERE stripe_payment_intent_id = $2`,
          [charge.amount_refunded || 0, charge.payment_intent]
        );
      }
    }

    // 3. Record event in webhook_events
    await pool.query(
      `INSERT INTO webhook_events (id, provider, event_type, processed_at, payload)
       VALUES ($1, 'stripe', $2, NOW(), $3)`,
      [eventId, eventType, JSON.stringify(event)]
    );

    return reply.status(200).send({ received: true });
  });

  // Protected Routes Group
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    protectedRoutes.addHook('preHandler', requirePermission('finance:dashboard:view'));

    // 1. Executive Financial Metrics Overview
    protectedRoutes.get('/overview', {
      schema: {
        tags: ['Finances & Ledger'],
        summary: 'Executive financial metrics, gross turnover, commissions, and escrow balance',
        security: [{ bearerAuth: [] }]
      }
    }, async (request, reply) => {
      const requestId = request.id || `req_${Date.now()}`;
      const tenantId = request.tenantId;

      const [grossRes, accountsRes, recentTxRes] = await Promise.all([
        pool.query(
          `SELECT 
            COALESCE(SUM(total_amount_cents), 0)::bigint as "grossVolumeCents",
            COALESCE(SUM(CASE WHEN status = 'PAID' THEN total_amount_cents ELSE 0 END), 0)::bigint as "settledVolumeCents",
            COUNT(id)::int as "totalInvoicesCount",
            COUNT(CASE WHEN status = 'PAID' THEN 1 END)::int as "paidInvoicesCount"
           FROM invoices 
           WHERE tenant_id = $1`,
          [tenantId]
        ),
        pool.query(
          `SELECT account_number as "accountNumber", account_name as "accountName", account_type as "accountType"
           FROM ledger_accounts
           WHERE tenant_id = $1
           ORDER BY account_number ASC`,
          [tenantId]
        ),
        pool.query(
          `SELECT pt.id, pt.stripe_payment_intent_id as "paymentIntentId", pt.authorized_amount_cents as "authorizedAmountCents",
                  pt.captured_amount_cents as "capturedAmountCents", pt.transaction_type as "transactionType",
                  pt.status, pt.created_at as "createdAt", inv.invoice_number as "invoiceNumber"
           FROM payment_transactions pt
           JOIN invoices inv ON inv.id = pt.invoice_id
           WHERE pt.tenant_id = $1
           ORDER BY pt.created_at DESC LIMIT 10`,
          [tenantId]
        )
      ]);

      const metrics = grossRes.rows[0];

      return reply.status(200).send(
        successResponse({
          grossVolumeCents: metrics.grossVolumeCents,
          settledVolumeCents: metrics.settledVolumeCents,
          totalInvoicesCount: metrics.totalInvoicesCount,
          paidInvoicesCount: metrics.paidInvoicesCount,
          accounts: accountsRes.rows,
          recentTransactions: recentTxRes.rows,
        }, requestId)
      );
    });

    // 2. List Invoices with Filter and Pagination
    protectedRoutes.get('/invoices', {
      schema: {
        tags: ['Finances & Ledger'],
        summary: 'List itemized invoices',
        security: [{ bearerAuth: [] }]
      }
    }, async (request, reply) => {
      const requestId = request.id || `req_${Date.now()}`;
      const tenantId = request.tenantId;

      const parsed = invoiceQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return reply.status(400).send(
          errorResponse('VALIDATION_ERROR', 'Invalid invoice query parameters', requestId)
        );
      }

      const { page, limit, status } = parsed.data;
      const offset = (page - 1) * limit;

      let countQuery = `SELECT COUNT(id)::int as total FROM invoices WHERE tenant_id = $1`;
      let dataQuery = `
        SELECT 
          inv.id,
          inv.invoice_number as "invoiceNumber",
          inv.booking_id as "bookingId",
          b.booking_reference as "bookingReference",
          cp.full_name as "customerName",
          pp.full_name as "providerName",
          s.name as "serviceName",
          inv.labor_subtotal_cents as "laborSubtotalCents",
          inv.parts_subtotal_cents as "partsSubtotalCents",
          inv.tax_total_cents as "taxTotalCents",
          inv.total_amount_cents as "totalAmountCents",
          inv.status,
          inv.issued_at as "issuedAt",
          inv.paid_at as "paidAt"
        FROM invoices inv
        JOIN bookings b ON b.id = inv.booking_id
        JOIN customer_profiles cp ON cp.user_id = b.customer_id
        LEFT JOIN provider_profiles pp ON pp.user_id = b.assigned_provider_id
        JOIN services s ON s.id = b.service_id
        WHERE inv.tenant_id = $1
      `;

      const params: any[] = [tenantId];
      if (status) {
        params.push(status);
        countQuery += ` AND status = $2`;
        dataQuery += ` AND inv.status = $2`;
      }

      dataQuery += ` ORDER BY inv.issued_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

      const [countRes, dataRes] = await Promise.all([
        pool.query(countQuery, params),
        pool.query(dataQuery, [...params, limit, offset])
      ]);

      const total = countRes.rows[0]?.total || 0;

      return reply.status(200).send(
        successResponse(dataRes.rows, requestId, {
          page,
          limit,
          totalRecords: total,
          totalPages: Math.ceil(total / limit)
        })
      );
    });

    // 3. Single Invoice Detail with Line Items
    protectedRoutes.get('/invoices/:id', {
      schema: {
        tags: ['Finances & Ledger'],
        summary: 'Get single itemized invoice with line items and payment transactions',
        security: [{ bearerAuth: [] }]
      }
    }, async (request, reply) => {
      const requestId = request.id || `req_${Date.now()}`;
      const tenantId = request.tenantId;
      const { id: invoiceId } = request.params as { id: string };

      const invRes = await pool.query(
        `SELECT 
          inv.id,
          inv.invoice_number as "invoiceNumber",
          inv.booking_id as "bookingId",
          b.booking_reference as "bookingReference",
          cp.full_name as "customerName",
          u_cust.email as "customerEmail",
          pp.full_name as "providerName",
          inv.labor_subtotal_cents as "laborSubtotalCents",
          inv.parts_subtotal_cents as "partsSubtotalCents",
          inv.diagnostic_fee_cents as "diagnosticFeeCents",
          inv.tax_rate_bps as "taxRateBps",
          inv.tax_total_cents as "taxTotalCents",
          inv.discount_cents as "discountCents",
          inv.total_amount_cents as "totalAmountCents",
          inv.status,
          inv.issued_at as "issuedAt",
          inv.paid_at as "paidAt"
        FROM invoices inv
        JOIN bookings b ON b.id = inv.booking_id
        JOIN customer_profiles cp ON cp.user_id = b.customer_id
        JOIN users u_cust ON u_cust.id = cp.user_id
        LEFT JOIN provider_profiles pp ON pp.user_id = b.assigned_provider_id
        WHERE inv.id = $1 AND inv.tenant_id = $2`,
        [invoiceId, tenantId]
      );

      if (invRes.rowCount === 0) {
        return reply.status(404).send(
          errorResponse('NOT_FOUND', 'Invoice not found', requestId)
        );
      }

      const [itemsRes, txRes] = await Promise.all([
        pool.query(
          `SELECT id, description, item_type as "itemType", quantity, unit_price_cents as "unitPriceCents", total_cents as "totalCents"
           FROM invoice_items WHERE invoice_id = $1 ORDER BY id ASC`,
          [invoiceId]
        ),
        pool.query(
          `SELECT id, stripe_payment_intent_id as "paymentIntentId", idempotency_key as "idempotencyKey",
                  authorized_amount_cents as "authorizedAmountCents", captured_amount_cents as "capturedAmountCents",
                  transaction_type as "transactionType", status, created_at as "createdAt"
           FROM payment_transactions WHERE invoice_id = $1 ORDER BY created_at DESC`,
          [invoiceId]
        )
      ]);

      return reply.status(200).send(
        successResponse({
          ...invRes.rows[0],
          items: itemsRes.rows,
          transactions: txRes.rows
        }, requestId)
      );
    });

    // 4. Double-Entry General Ledger Journal Entries
    protectedRoutes.get('/ledger', {
      schema: {
        tags: ['Finances & Ledger'],
        summary: 'Audit view of double-entry ledger journal entries',
        security: [{ bearerAuth: [] }]
      }
    }, async (request, reply) => {
      const requestId = request.id || `req_${Date.now()}`;
      const tenantId = request.tenantId;

      const result = await pool.query(
        `SELECT 
          le.id,
          le.amount_cents as "amountCents",
          le.description,
          le.posted_at as "postedAt",
          da.account_number as "debitAccountNumber",
          da.account_name as "debitAccountName",
          da.account_type as "debitAccountType",
          ca.account_number as "creditAccountNumber",
          ca.account_name as "creditAccountName",
          ca.account_type as "creditAccountType"
        FROM ledger_entries le
        JOIN ledger_accounts da ON da.id = le.debit_account_id
        JOIN ledger_accounts ca ON ca.id = le.credit_account_id
        WHERE le.tenant_id = $1
        ORDER BY le.posted_at DESC
        LIMIT 100`,
        [tenantId]
      );

      return reply.status(200).send(
        successResponse(result.rows, requestId)
      );
    });

    // 5. Trigger Provider Payout (Stripe Connect Express Transfer)
    protectedRoutes.post('/payouts', {
      preHandler: [requirePermission('finance:payout:execute')],
      schema: {
        tags: ['Finances & Ledger'],
        summary: 'Initiate provider payout transfer with double-entry ledger posting',
        security: [{ bearerAuth: [] }]
      }
    }, async (request, reply) => {
      const requestId = request.id || `req_${Date.now()}`;
      const tenantId = request.tenantId;

      const parsed = payoutTriggerSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send(
          errorResponse('VALIDATION_ERROR', 'Invalid payout parameters', requestId)
        );
      }

      const { providerId, amountCents, description } = parsed.data;

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Check provider exists and has payout enabled with exclusive lock to prevent double-payout races
        const provRes = await client.query(
          `SELECT user_id, full_name, stripe_connect_account_id, stripe_payouts_enabled
           FROM provider_profiles
           WHERE user_id = $1 AND tenant_id = $2
           FOR UPDATE`,
          [providerId, tenantId]
        );

        if (provRes.rowCount === 0) {
          await client.query('ROLLBACK');
          return reply.status(404).send(
            errorResponse('NOT_FOUND', 'Provider not found', requestId)
          );
        }

        const provider = provRes.rows[0];

        // Verify standard ledger accounts exist before proceeding:
        // Debit: 2020 (Technician Payable)
        // Credit: 1010 (Operating Bank Account)
        const accRes = await client.query(
          `SELECT id, account_number FROM ledger_accounts 
           WHERE tenant_id = $1 AND account_number IN ('1010', '2020')`,
          [tenantId]
        );

        const techPayable = accRes.rows.find(a => a.account_number === '2020');
        const bankAsset = accRes.rows.find(a => a.account_number === '1010');

        if (!techPayable || !bankAsset) {
          await client.query('ROLLBACK');
          return reply.status(422).send(
            errorResponse('LEDGER_ACCOUNTS_MISSING', 'Standard ledger accounts (1010 Operating Bank / 2020 Technician Payable) are not provisioned for this tenant.', requestId)
          );
        }

        // Check provider's settled earnings balance (joining tenants for platform commission terms)
        const balanceRes = await client.query(
          `SELECT 
            COALESCE(SUM(CASE WHEN b.assigned_provider_id = $1 AND b.status = 'COMPLETED' THEN (i.total_amount_cents * (10000 - COALESCE(t.default_platform_commission_bps, 1500)) / 10000) ELSE 0 END), 0)::bigint as total_earned_cents,
            COALESCE((SELECT SUM(amount_cents) FROM provider_payouts WHERE provider_id = $1 AND tenant_id = $2 AND status IN ('PAID', 'PROCESSING')), 0)::bigint as total_paid_cents
           FROM bookings b
           JOIN tenants t ON t.id = b.tenant_id
           JOIN invoices i ON i.booking_id = b.id AND i.status = 'PAID'
           WHERE b.assigned_provider_id = $1 AND b.tenant_id = $2`,
          [providerId, tenantId]
        );
        const totalEarned = Number(balanceRes.rows[0]?.total_earned_cents || 0);
        const totalPaid = Number(balanceRes.rows[0]?.total_paid_cents || 0);
        const unpaidBalanceCents = Math.max(0, totalEarned - totalPaid);

        // Universal invariant: Payout must never exceed settled unpaid earnings in any environment
        if (amountCents > unpaidBalanceCents) {
          await client.query('ROLLBACK');
          return reply.status(400).send(
            errorResponse('INSUFFICIENT_PAYOUT_BALANCE', `Payout amount (${amountCents} cents) exceeds provider settled unpaid balance (${unpaidBalanceCents} cents).`, requestId)
          );
        }

        // Fail closed in production if Stripe is not configured
        if (!env.STRIPE_SECRET_KEY) {
          if (process.env.NODE_ENV === 'production') {
            await client.query('ROLLBACK');
            return reply.status(422).send(
              errorResponse('PAYMENT_GATEWAY_NOT_CONFIGURED', 'Live Stripe payout gateway is not configured on this server.', requestId)
            );
          }
        }

        // Derive deterministic idempotency key for external transfer
        const clientKey = request.headers['idempotency-key'] as string | undefined;
        const stableOpId = clientKey ? `payout_${clientKey}` : `payout_op_${providerId}_${Date.now()}`;

        // Real Stripe Connect Transfer when gateway configured
        let transferRef: string;
        if (env.STRIPE_SECRET_KEY) {
          if (!provider.stripe_connect_account_id) {
            await client.query('ROLLBACK');
            return reply.status(422).send(
              errorResponse('PROVIDER_PAYOUT_NOT_CONFIGURED', 'Technician does not have a linked Stripe Connect payout account.', requestId)
            );
          }

          try {
            const stripe = new Stripe(env.STRIPE_SECRET_KEY);
            const transfer = await stripe.transfers.create({
              amount: amountCents,
              currency: 'usd',
              destination: provider.stripe_connect_account_id,
              description: description || `Provider payout to ${provider.full_name}`
            }, {
              idempotencyKey: stableOpId
            });
            transferRef = transfer.id;
          } catch (stripeErr: any) {
            await client.query('ROLLBACK');
            return reply.status(502).send(
              errorResponse('STRIPE_TRANSFER_FAILED', `Stripe Connect payout transfer failed: ${stripeErr.message}`, requestId)
            );
          }
        } else {
          // Dev sandbox reference only when keys omitted in test mode
          transferRef = `tr_sandbox_unsettled_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        }

        // Create provider payout record with PROCESSING status (reconciled upon settlement)
        const payoutRes = await client.query(
          `INSERT INTO provider_payouts (
            tenant_id, provider_id, stripe_transfer_id, amount_cents, currency, status, processed_at
          ) VALUES ($1, $2, $3, $4, 'USD', 'PROCESSING', NOW())
          RETURNING id, stripe_transfer_id, amount_cents, status, created_at`,
          [tenantId, providerId, transferRef, amountCents]
        );

        // Post double-entry ledger entry:
        // Debit: 2020 (Technician Payable)
        // Credit: 1010 (Operating Bank Account)
        await client.query(
          `INSERT INTO ledger_entries (
            tenant_id, debit_account_id, credit_account_id, amount_cents, description
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
              tenantId,
              techPayable.id,
              bankAsset.id,
              amountCents,
              description || `Payout to ${provider.full_name} (${transferRef})`
            ]
          );

        // Audit log
        await client.query(
          `INSERT INTO audit_logs (tenant_id, actor_id, actor_role, action, resource_type, resource_id, diff_payload)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            tenantId,
            request.user!.id,
            request.user!.role,
            'PAYOUT_PROCESSED',
            'provider_payout',
            payoutRes.rows[0].id,
            JSON.stringify({ providerId, amountCents, transferRef })
          ]
        );

        await client.query('COMMIT');

        return reply.status(200).send(
          successResponse({
            payoutId: payoutRes.rows[0].id,
            transferId: transferRef,
            amountCents,
            providerName: provider.full_name,
            status: 'PAID',
            message: 'Provider payout initiated and posted to ledger.'
          }, requestId)
        );
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    });
  });
}
