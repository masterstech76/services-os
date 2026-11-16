import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../../database/pool.js';
import { successResponse, errorResponse } from '../../types/envelope.js';
import { authenticate, requirePermission } from '../../middleware/rbac.js';

const ticketQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
});

const createTicketSchema = z.object({
  subject: z.string().min(3).max(255),
  category: z.string().default('General Support'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  bookingId: z.string().uuid().optional(),
  initialMessage: z.string().min(5),
});

const postMessageSchema = z.object({
  messageBody: z.string().min(1),
  attachmentsUrls: z.array(z.string()).default([]),
});

const updateTicketStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  assignedStaffId: z.string().uuid().nullable().optional(),
});

const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const moderateReviewSchema = z.object({
  isPublic: z.boolean(),
  moderationFlagged: z.boolean(),
});

const cmsConfigSchema = z.object({
  heroHeading: z.string().min(3).max(255),
  heroSubheading: z.string().min(5),
  searchPlaceholder: z.string().min(3).max(255),
  promoCouponCode: z.string().optional(),
  promoDiscountPercent: z.number().int().min(0).max(100).optional(),
});

export async function supportRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // ============================================================================
  // SUPPORT TICKETS & MESSAGING
  // ============================================================================

  // 1. List Support Tickets
  fastify.get('/tickets', {
    schema: {
      tags: ['Support Desk & CRM'],
      summary: 'List support tickets with filtering and pagination',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;
    const userRole = request.user!.role;
    const userId = request.user!.id;

    const parsed = ticketQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Invalid ticket query parameters', requestId)
      );
    }

    const { page, limit, status, priority } = parsed.data;
    const offset = (page - 1) * limit;

    let countQuery = `SELECT COUNT(id)::int as total FROM support_tickets WHERE tenant_id = $1`;
    let dataQuery = `
      SELECT 
        t.id,
        t.ticket_number as "ticketNumber",
        t.subject,
        t.category,
        t.priority,
        t.status,
        t.created_at as "createdAt",
        t.updated_at as "updatedAt",
        cp.full_name as "customerName",
        u.email as "customerEmail",
        sp.full_name as "assignedStaffName"
      FROM support_tickets t
      JOIN customer_profiles cp ON cp.user_id = t.customer_id
      JOIN users u ON u.id = cp.user_id
      LEFT JOIN staff_profiles sp ON sp.user_id = t.assigned_staff_id
      WHERE t.tenant_id = $1
    `;

    const params: any[] = [tenantId];

    // If customer role, only show own tickets
    if (userRole === 'CUSTOMER') {
      params.push(userId);
      countQuery += ` AND customer_id = $${params.length}`;
      dataQuery += ` AND t.customer_id = $${params.length}`;
    }

    if (status) {
      params.push(status);
      countQuery += ` AND status = $${params.length}`;
      dataQuery += ` AND t.status = $${params.length}`;
    }

    if (priority) {
      params.push(priority);
      countQuery += ` AND priority = $${params.length}`;
      dataQuery += ` AND t.priority = $${params.length}`;
    }

    dataQuery += ` ORDER BY t.updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

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

  // 2. Create Support Ticket
  fastify.post('/tickets', {
    schema: {
      tags: ['Support Desk & CRM'],
      summary: 'Open a new support ticket with initial message',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;
    const userId = request.user!.id;

    const parsed = createTicketSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Invalid ticket payload', requestId)
      );
    }

    const { subject, category, priority, bookingId, initialMessage } = parsed.data;
    const ticketNumber = `TICK-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const ticketRes = await client.query(
        `INSERT INTO support_tickets (
          tenant_id, ticket_number, customer_id, booking_id, subject, category, priority, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'OPEN')
        RETURNING id, ticket_number, subject, category, priority, status, created_at`,
        [tenantId, ticketNumber, userId, bookingId || null, subject, category, priority]
      );

      const ticket = ticketRes.rows[0];

      // Add initial message
      await client.query(
        `INSERT INTO ticket_messages (ticket_id, sender_id, message_body, attachments_urls)
         VALUES ($1, $2, $3, '[]'::jsonb)`,
        [ticket.id, userId, initialMessage]
      );

      await client.query('COMMIT');

      return reply.status(201).send(
        successResponse({
          ...ticket,
          ticketNumber: ticket.ticket_number,
          createdAt: ticket.created_at,
          message: 'Support ticket opened successfully'
        }, requestId)
      );
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  });

  // 3. Get Support Ticket Thread
  fastify.get('/tickets/:id', {
    schema: {
      tags: ['Support Desk & CRM'],
      summary: 'Get ticket details and conversation thread',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;
    const { id: ticketId } = request.params as { id: string };

    const ticketRes = await pool.query(
      `SELECT 
        t.id,
        t.ticket_number as "ticketNumber",
        t.customer_id as "customerId",
        cp.full_name as "customerName",
        u.email as "customerEmail",
        t.booking_id as "bookingId",
        b.booking_reference as "bookingReference",
        t.subject,
        t.category,
        t.priority,
        t.status,
        t.assigned_staff_id as "assignedStaffId",
        sp.full_name as "assignedStaffName",
        t.created_at as "createdAt",
        t.updated_at as "updatedAt"
      FROM support_tickets t
      JOIN customer_profiles cp ON cp.user_id = t.customer_id
      JOIN users u ON u.id = cp.user_id
      LEFT JOIN bookings b ON b.id = t.booking_id
      LEFT JOIN staff_profiles sp ON sp.user_id = t.assigned_staff_id
      WHERE t.id = $1 AND t.tenant_id = $2`,
      [ticketId, tenantId]
    );

    if (ticketRes.rowCount === 0) {
      return reply.status(404).send(
        errorResponse('NOT_FOUND', 'Support ticket not found', requestId)
      );
    }

    const messagesRes = await pool.query(
      `SELECT 
        tm.id,
        tm.sender_id as "senderId",
        u.email as "senderEmail",
        u.role as "senderRole",
        tm.message_body as "messageBody",
        tm.attachments_urls as "attachmentsUrls",
        tm.created_at as "createdAt"
      FROM ticket_messages tm
      JOIN users u ON u.id = tm.sender_id
      WHERE tm.ticket_id = $1
      ORDER BY tm.created_at ASC`,
      [ticketId]
    );

    return reply.status(200).send(
      successResponse({
        ...ticketRes.rows[0],
        messages: messagesRes.rows
      }, requestId)
    );
  });

  // 4. Post Reply Message to Ticket
  fastify.post('/tickets/:id/messages', {
    schema: {
      tags: ['Support Desk & CRM'],
      summary: 'Post reply message to support ticket thread',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;
    const userId = request.user!.id;
    const { id: ticketId } = request.params as { id: string };

    const parsed = postMessageSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Message body cannot be empty', requestId)
      );
    }

    // Verify ticket exists
    const tCheck = await pool.query(
      `SELECT id FROM support_tickets WHERE id = $1 AND tenant_id = $2`,
      [ticketId, tenantId]
    );

    if (tCheck.rowCount === 0) {
      return reply.status(404).send(
        errorResponse('NOT_FOUND', 'Support ticket not found', requestId)
      );
    }

    const msgRes = await pool.query(
      `INSERT INTO ticket_messages (ticket_id, sender_id, message_body, attachments_urls)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sender_id, message_body, created_at`,
      [ticketId, userId, parsed.data.messageBody, JSON.stringify(parsed.data.attachmentsUrls)]
    );

    // Update ticket updated_at
    await pool.query(`UPDATE support_tickets SET updated_at = NOW() WHERE id = $1`, [ticketId]);

    return reply.status(201).send(
      successResponse({
        id: msgRes.rows[0].id,
        senderId: msgRes.rows[0].sender_id,
        messageBody: msgRes.rows[0].message_body,
        createdAt: msgRes.rows[0].created_at
      }, requestId)
    );
  });

  // 5. Update Ticket Status & Assignment (Admin/Staff)
  fastify.patch('/tickets/:id/status', {
    preHandler: [requirePermission('manage:support')],
    schema: {
      tags: ['Support Desk & CRM'],
      summary: 'Update ticket resolution status or assigned agent',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;
    const { id: ticketId } = request.params as { id: string };

    const parsed = updateTicketStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Invalid status update parameters', requestId)
      );
    }

    const { status, assignedStaffId } = parsed.data;

    let updateQuery = `UPDATE support_tickets SET updated_at = NOW()`;
    const params: any[] = [ticketId, tenantId];

    if (status) {
      params.push(status);
      updateQuery += `, status = $${params.length}`;
    }
    if (assignedStaffId !== undefined) {
      params.push(assignedStaffId);
      updateQuery += `, assigned_staff_id = $${params.length}`;
    }

    updateQuery += ` WHERE id = $1 AND tenant_id = $2 RETURNING id, ticket_number, status, assigned_staff_id, updated_at`;

    const res = await pool.query(updateQuery, params);
    if (res.rowCount === 0) {
      return reply.status(404).send(
        errorResponse('NOT_FOUND', 'Ticket not found', requestId)
      );
    }

    return reply.status(200).send(
      successResponse(res.rows[0], requestId)
    );
  });

  // ============================================================================
  // CUSTOMER REVIEWS & RATINGS
  // ============================================================================

  // 6. List Reviews
  fastify.get('/reviews', {
    schema: {
      tags: ['Support Desk & CRM'],
      summary: 'List verified customer reviews with provider filters',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;
    const { providerId } = request.query as { providerId?: string };

    let query = `
      SELECT 
        r.id,
        r.booking_id as "bookingId",
        r.rating,
        r.comment,
        r.is_public as "isPublic",
        r.moderation_flagged as "moderationFlagged",
        r.provider_response as "providerResponse",
        r.created_at as "createdAt",
        cp.full_name as "customerName",
        pp.full_name as "providerName",
        s.name as "serviceName"
      FROM customer_reviews r
      JOIN bookings b ON b.id = r.booking_id
      JOIN services s ON s.id = b.service_id
      JOIN customer_profiles cp ON cp.user_id = r.customer_id
      JOIN provider_profiles pp ON pp.user_id = r.provider_id
      WHERE r.tenant_id = $1
    `;
    const params: any[] = [tenantId];

    if (providerId) {
      params.push(providerId);
      query += ` AND r.provider_id = $${params.length}`;
    }

    // Unless admin, only show public and unflagged reviews
    if (request.user?.role !== 'ADMIN' && request.user?.role !== 'STAFF') {
      query += ` AND r.is_public = TRUE AND r.moderation_flagged = FALSE`;
    }

    query += ` ORDER BY r.created_at DESC LIMIT 50`;

    const result = await pool.query(query, params);

    return reply.status(200).send(
      successResponse(result.rows, requestId)
    );
  });

  // 7. Post Customer Review for Completed Booking
  fastify.post('/reviews', {
    schema: {
      tags: ['Support Desk & CRM'],
      summary: 'Post rating and review for completed booking (Customer role)',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;
    const userId = request.user!.id;

    const parsed = createReviewSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Rating must be between 1 and 5', requestId)
      );
    }

    const { bookingId, rating, comment } = parsed.data;

    // Verify booking is completed and belongs to user
    const bookRes = await pool.query(
      `SELECT id, customer_id, assigned_provider_id, status
       FROM bookings WHERE id = $1 AND tenant_id = $2`,
      [bookingId, tenantId]
    );

    if (bookRes.rowCount === 0) {
      return reply.status(404).send(
        errorResponse('NOT_FOUND', 'Booking not found', requestId)
      );
    }

    const booking = bookRes.rows[0];
    if (booking.customer_id !== userId) {
      return reply.status(403).send(
        errorResponse('FORBIDDEN', 'Only the booking customer can submit a review', requestId)
      );
    }

    if (booking.status !== 'COMPLETED' || !booking.assigned_provider_id) {
      return reply.status(400).send(
        errorResponse('INVALID_STATE', 'Reviews can only be submitted for completed bookings with an assigned provider', requestId)
      );
    }

    const reviewRes = await pool.query(
      `INSERT INTO customer_reviews (
        tenant_id, booking_id, customer_id, provider_id, rating, comment
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (booking_id) DO UPDATE SET
        rating = $5, comment = $6, updated_at = NOW()
      RETURNING id, rating, comment, created_at`,
      [tenantId, bookingId, userId, booking.assigned_provider_id, rating, comment || null]
    );

    return reply.status(201).send(
      successResponse(reviewRes.rows[0], requestId)
    );
  });

  // 8. Moderate Review (Admin)
  fastify.patch('/reviews/:id/moderate', {
    preHandler: [requirePermission('manage:support')],
    schema: {
      tags: ['Support Desk & CRM'],
      summary: 'Admin review moderation toggle',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;
    const { id: reviewId } = request.params as { id: string };

    const parsed = moderateReviewSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Invalid moderation parameters', requestId)
      );
    }

    const { isPublic, moderationFlagged } = parsed.data;

    const res = await pool.query(
      `UPDATE customer_reviews
       SET is_public = $1, moderation_flagged = $2, updated_at = NOW()
       WHERE id = $3 AND tenant_id = $4
       RETURNING id, is_public as "isPublic", moderation_flagged as "moderationFlagged"`,
      [isPublic, moderationFlagged, reviewId, tenantId]
    );

    if (res.rowCount === 0) {
      return reply.status(404).send(
        errorResponse('NOT_FOUND', 'Review not found', requestId)
      );
    }

    return reply.status(200).send(
      successResponse(res.rows[0], requestId)
    );
  });

  // ============================================================================
  // TENANT CMS & BRANDING CONFIGS
  // ============================================================================

  // 9. Get Tenant CMS Configs
  fastify.get('/settings/cms', {
    schema: {
      tags: ['Tenant CMS & Config'],
      summary: 'Get white-label CMS header and promotional banner config',
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;

    const res = await pool.query(
      `SELECT 
        hero_heading as "heroHeading",
        hero_subheading as "heroSubheading",
        search_placeholder as "searchPlaceholder",
        promo_coupon_code as "promoCouponCode",
        promo_discount_percent as "promoDiscountPercent"
       FROM tenant_cms_configs
       WHERE tenant_id = $1`,
      [tenantId]
    );

    const config = res.rows[0] || {
      heroHeading: 'Your Service, Our Priority',
      heroSubheading: 'Book top-rated verified home service professionals on demand with upfront pricing and escrow guarantee.',
      searchPlaceholder: 'Search 340+ certified home services...',
      promoCouponCode: null,
      promoDiscountPercent: null
    };

    return reply.status(200).send(
      successResponse(config, requestId)
    );
  });

  // 10. Update Tenant CMS Configs (Admin)
  fastify.put('/settings/cms', {
    preHandler: [requirePermission('manage:settings')],
    schema: {
      tags: ['Tenant CMS & Config'],
      summary: 'Update tenant white-label CMS marketing text and promos',
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const requestId = request.id || `req_${Date.now()}`;
    const tenantId = request.tenantId;

    const parsed = cmsConfigSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Invalid CMS parameters', requestId)
      );
    }

    const { heroHeading, heroSubheading, searchPlaceholder, promoCouponCode, promoDiscountPercent } = parsed.data;

    await pool.query(
      `INSERT INTO tenant_cms_configs (
        tenant_id, hero_heading, hero_subheading, search_placeholder, promo_coupon_code, promo_discount_percent
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (tenant_id) DO UPDATE SET
        hero_heading = $2,
        hero_subheading = $3,
        search_placeholder = $4,
        promo_coupon_code = $5,
        promo_discount_percent = $6,
        updated_at = NOW()`,
      [tenantId, heroHeading, heroSubheading, searchPlaceholder, promoCouponCode || null, promoDiscountPercent || null]
    );

    return reply.status(200).send(
      successResponse({ updated: true, heroHeading, heroSubheading }, requestId)
    );
  });
}
