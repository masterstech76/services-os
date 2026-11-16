import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../src/modules/auth/auth.service.js';

describe('Hardening & Security Remediation Suite', () => {
  const dummyUser = {
    id: '12345678-1234-1234-1234-123456789abc',
    role: 'ADMIN',
    tenantId: '00000000-0000-0000-0000-000000000001',
    email: 'test.admin@servicepro.local'
  };

  it('MFA challenge token cannot be used as general access token', () => {
    // Generate an MFA challenge token
    const challengeToken = AuthService.generateMfaChallengeToken(dummyUser);
    assert.ok(challengeToken);

    // Attempting to verify challenge token as a standard access token must throw
    assert.throws(
      () => AuthService.verifyAccessToken(challengeToken),
      (err: Error) => err.message === 'MFA_CHALLENGE_TOKEN_NOT_AUTHORIZED',
      'Should reject MFA challenge token on normal API routes'
    );
  });

  it('Standard access token is rejected by MFA challenge verifier', () => {
    // Generate a normal access token
    const accessToken = AuthService.generateAccessToken(dummyUser);
    assert.ok(accessToken);

    // Verifying standard token as an MFA challenge token must throw
    assert.throws(
      () => AuthService.verifyMfaChallengeToken(accessToken),
      (err: Error) => err.message === 'INVALID_MFA_CHALLENGE_TOKEN',
      'Should reject normal access token on MFA challenge verification'
    );
  });

  it('Valid MFA challenge token verifies correctly with verifyMfaChallengeToken', () => {
    const challengeToken = AuthService.generateMfaChallengeToken(dummyUser);
    const payload = AuthService.verifyMfaChallengeToken(challengeToken);

    assert.equal(payload.sub, dummyUser.id);
    assert.equal(payload.role, dummyUser.role);
    assert.equal(payload.tenantId, dummyUser.tenantId);
    assert.equal(payload.email, dummyUser.email);
  });

  it('AES-256-GCM TOTP secret encryption and decryption preserves confidentiality and integrity', () => {
    const rawSecret = 'JBSWY3DPEHPK3PXP'; // Standard Base32 TOTP secret

    // Encrypt
    const encrypted = AuthService.encryptTotpSecret(rawSecret);
    assert.notEqual(encrypted, rawSecret);
    const parts = encrypted.split(':');
    assert.equal(parts.length, 3, 'Encrypted secret must contain iv:authTag:ciphertext');

    // Decrypt
    const decrypted = AuthService.decryptTotpSecret(encrypted);
    assert.equal(decrypted, rawSecret, 'Decrypted secret must match original secret exactly');
  });

  it('Tampered AES-256-GCM ciphertext fails authentication tag check', () => {
    const rawSecret = 'JBSWY3DPEHPK3PXP';
    const encrypted = AuthService.encryptTotpSecret(rawSecret);
    const parts = encrypted.split(':');

    // Tamper with ciphertext preserving even hex length
    const tamperedCiphertext = (parts[2][0] === 'a' ? 'b' : 'a') + parts[2].slice(1);
    const tamperedPayload = `${parts[0]}:${parts[1]}:${tamperedCiphertext}`;

    assert.throws(
      () => AuthService.decryptTotpSecret(tamperedPayload),
      /Unsupported state or unable to authenticate data/,
      'Tampered payload must fail GCM auth tag verification'
    );
  });

  it('Refresh token hash is deterministic SHA-256', () => {
    const token = 'sample_refresh_token_string_12345';
    const hash1 = AuthService.hashToken(token);
    const hash2 = AuthService.hashToken(token);

    assert.equal(hash1, hash2);
    assert.equal(hash1.length, 64); // 256 bits = 64 hex chars
    assert.notEqual(hash1, token);
  });
});
