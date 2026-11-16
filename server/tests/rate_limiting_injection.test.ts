import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { errorResponse } from '../src/types/envelope.js';

describe('Fastify Route Rate Limiting Injection Suite', () => {
  it('Route-level rate limit returns 429 and standardized error envelope on excessive requests', async () => {
    const app = Fastify();

    // Register rate limit plugin with production errorResponseBuilder configuration
    await app.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
      errorResponseBuilder: (request, context) => {
        const err = errorResponse(
          'RATE_LIMIT_EXCEEDED',
          `Rate limit exceeded: Too many requests. Please try again after ${context.after}.`,
          request.id || `req_${Date.now()}`
        );
        return {
          statusCode: 429,
          ...err
        };
      }
    });

    // Sensitive route configured with route-level 5 req/min threshold
    app.post('/api/v1/auth/login', {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute'
        }
      }
    }, async () => ({ success: true }));

    try {
      const testIp = '198.51.100.42';
      let lastResponse: any = null;

      // Send 6 requests within the 1-minute window
      for (let i = 0; i < 6; i++) {
        lastResponse = await app.inject({
          method: 'POST',
          url: '/api/v1/auth/login',
          remoteAddress: testIp,
        });
      }

      // The 6th request must be intercepted with HTTP 429
      assert.equal(lastResponse.statusCode, 429, '6th request must exceed route rate limit of 5 req/min');

      const body = JSON.parse(lastResponse.body);
      assert.equal(body.success, false);
      assert.equal(body.error.code, 'RATE_LIMIT_EXCEEDED');
      assert.ok(body.error.message.includes('Rate limit exceeded'));
    } finally {
      await app.close();
    }
  });
});
