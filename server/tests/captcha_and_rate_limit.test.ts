import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { verifyCaptcha } from '../src/middleware/captcha.js';
import { errorResponse } from '../src/types/envelope.js';

describe('Anti-Bot CAPTCHA & Tiered Rate Limiting Suite', () => {
  it('verifyCaptcha allows pass-through in non-production with test token', async () => {
    let statusSent = 0;
    let bodySent: any = null;

    const mockRequest: any = {
      headers: {
        'cf-turnstile-response': 'test-captcha-bypass-token',
      },
      body: {},
      ip: '127.0.0.1',
      id: 'req_test_123',
      log: { warn: () => {}, error: () => {} },
    };

    const mockReply: any = {
      status(code: number) {
        statusSent = code;
        return this;
      },
      send(body: any) {
        bodySent = body;
        return this;
      },
    };

    await verifyCaptcha(mockRequest, mockReply);

    assert.equal(statusSent, 0, 'Should not return error status on valid test token');
    assert.equal(bodySent, null);
  });

  it('Standard error envelope formats RATE_LIMIT_EXCEEDED with context retry period', () => {
    const requestId = 'req_rate_limit_1';
    const err = errorResponse(
      'RATE_LIMIT_EXCEEDED',
      'Rate limit exceeded: Too many requests. Please try again after 60 seconds.',
      requestId
    );

    assert.equal(err.success, false);
    assert.equal(err.error.code, 'RATE_LIMIT_EXCEEDED');
    assert.ok(err.error.message.includes('60 seconds'));
    assert.equal(err.meta.requestId, requestId);
    assert.ok(err.meta.timestamp);
  });
});
