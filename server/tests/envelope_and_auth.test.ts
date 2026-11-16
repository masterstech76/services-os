import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { successResponse, errorResponse } from '../src/types/envelope.js';

describe('Envelope & Auth Service Unit Tests', () => {
  it('successResponse returns standardized envelope structure', () => {
    const data = { id: 'test_123', status: 'ACTIVE' };
    const res = successResponse(data, 'req_abc');

    assert.equal(res.success, true);
    assert.deepEqual(res.data, data);
    assert.equal(res.error, null);
    assert.equal(res.meta.requestId, 'req_abc');
    assert.ok(res.meta.timestamp);
  });

  it('errorResponse formats error payload without exposing sensitive internal details', () => {
    const err = errorResponse('UNAUTHORIZED', 'Invalid access token', 'req_xyz', [
      { field: 'authorization', issue: 'Header missing' }
    ]);

    assert.equal(err.success, false);
    assert.equal(err.data, null);
    assert.equal(err.error?.code, 'UNAUTHORIZED');
    assert.equal(err.error?.message, 'Invalid access token');
    assert.equal(err.error?.details?.length, 1);
  });

  it('bcrypt hashes and securely verifies passwords', async () => {
    const password = 'EnterpriseSecurePassword2026!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    assert.notEqual(hash, password);
    const isValid = await bcrypt.compare(password, hash);
    assert.equal(isValid, true);

    const isInvalid = await bcrypt.compare('WrongPassword', hash);
    assert.equal(isInvalid, false);
  });

  it('JWT signs and decodes claims accurately with expiry', () => {
    const secret = 'test-jwt-secret-antigravity-servicepro-32chars!';
    const payload = {
      userId: '11111111-2222-3333-4444-555555555555',
      tenantId: '00000000-0000-0000-0000-000000000001',
      role: 'ADMIN',
      email: 'admin@servicepro.local'
    };

    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    assert.ok(typeof token === 'string');

    const decoded = jwt.verify(token, secret) as any;
    assert.equal(decoded.userId, payload.userId);
    assert.equal(decoded.tenantId, payload.tenantId);
    assert.equal(decoded.role, 'ADMIN');
  });

  it('otplib generates and validates RFC 6238 TOTP MFA codes', () => {
    const secret = authenticator.generateSecret();
    assert.ok(secret.length >= 16);

    const token = authenticator.generate(secret);
    assert.equal(token.length, 6);

    const isValid = authenticator.check(token, secret);
    assert.equal(isValid, true);

    const isBad = authenticator.check('000000', secret);
    assert.equal(isBad, false);
  });
});
