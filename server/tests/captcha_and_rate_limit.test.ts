import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { verifyCaptcha } from '../src/middleware/captcha.js';
import { errorResponse } from '../src/types/envelope.js';

describe('Anti-Bot CAPTCHA & Tiered Rate Limiting Suite', () => {
  it('verifyCaptcha allows pass-through in test environment with test token', async () => {
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

  it('verifyCaptcha strictly forbids test bypass tokens outside NODE_ENV === test (SEC-01)', () => {
    const captchaFile = fs.readFileSync(
      fileURLToPath(new URL('../src/middleware/captcha.ts', import.meta.url)),
      'utf8'
    );
    assert.match(
      captchaFile,
      /process\.env\.NODE_ENV\s*===\s*'test'/,
      'CAPTCHA middleware must restrict bypass tokens strictly to NODE_ENV === test'
    );
    assert.doesNotMatch(
      captchaFile,
      /process\.env\.NODE_ENV\s*!==\s*'production'/,
      'CAPTCHA middleware must not accept test bypass tokens in staging or general non-production'
    );
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
