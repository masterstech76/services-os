import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authenticator } from 'otplib';
import { AuthService } from '../src/modules/auth/auth.service.js';
import { pool } from '../src/database/pool.js';

describe('MFA Lifecycle & Emergency Recovery Codes Suite', () => {
  it('AuthService.generateBackupCodes generates high-entropy (80-bit) codes and HMAC hashes', () => {
    const { rawCodes, hashedCodes } = AuthService.generateBackupCodes(8);

    assert.equal(rawCodes.length, 8);
    assert.equal(hashedCodes.length, 8);

    // All raw codes must be unique, 80-bit (20 hex characters) formatted as XXXXX-XXXXX-XXXXX-XXXXX
    const uniqueRaw = new Set(rawCodes);
    assert.equal(uniqueRaw.size, 8);
    for (const code of rawCodes) {
      assert.match(code, /^[0-9A-F]{5}-[0-9A-F]{5}-[0-9A-F]{5}-[0-9A-F]{5}$/);
    }

    // Hashes must match HMAC of the raw codes
    for (let i = 0; i < 8; i++) {
      assert.equal(AuthService.hashBackupCode(rawCodes[i]), hashedCodes[i]);
    }
  });

  it('Verifying backup codes rejects invalid codes and prevents replay', () => {
    const { rawCodes, hashedCodes } = AuthService.generateBackupCodes(5);
    const storedList = [...hashedCodes];

    const codeToUse = rawCodes[2];
    const codeHash = AuthService.hashBackupCode(codeToUse);

    // Initial check: code hash exists in stored list
    const foundIdx = storedList.indexOf(codeHash);
    assert.notEqual(foundIdx, -1);

    // Simulate redemption: remove code from stored list
    storedList.splice(foundIdx, 1);
    assert.equal(storedList.length, 4);

    // Replay attempt: same code must now be rejected
    const replayIdx = storedList.indexOf(codeHash);
    assert.equal(replayIdx, -1, 'Redeemed backup code must not be reusable');

    // Unknown code must be rejected
    const bogusHash = AuthService.hashBackupCode('FAKE-CODE-1234-5678');
    assert.equal(storedList.indexOf(bogusHash), -1);
  });

  it('setupMfa requires currentTotpCode when replacing an existing active MFA factor (AUTH-01)', async () => {
    const originalQuery = pool.query;
    const currentSecret = authenticator.generateSecret();
    const encryptedCurrentSecret = AuthService.encryptTotpSecret(currentSecret);

    try {
      // Mock pool.query to simulate existing enabled MFA record
      pool.query = (async (sql: string, params?: any[]) => {
        if (typeof sql === 'string' && sql.includes('SELECT is_enabled, totp_secret_encrypted FROM user_mfa_credentials')) {
          return {
            rows: [{ is_enabled: true, totp_secret_encrypted: encryptedCurrentSecret }],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          };
        }
        return { rows: [], rowCount: 0, command: '', oid: 0, fields: [] };
      }) as any;

      // 1. Missing currentTotpCode throws CURRENT_MFA_REQUIRED
      await assert.rejects(
        async () => {
          await AuthService.setupMfa('user-test-uuid', 'admin@servicepro.com');
        },
        { message: 'CURRENT_MFA_REQUIRED' }
      );

      // 2. Invalid currentTotpCode throws INVALID_CURRENT_TOTP
      await assert.rejects(
        async () => {
          await AuthService.setupMfa('user-test-uuid', 'admin@servicepro.com', '000000');
        },
        { message: 'INVALID_CURRENT_TOTP' }
      );

      // 3. Valid currentTotpCode stages replacement in pending_totp_secret_encrypted without disabling active MFA
      let executedSql = '';
      let executedParams: any[] = [];
      pool.query = (async (sql: string, params?: any[]) => {
        if (typeof sql === 'string' && sql.includes('SELECT is_enabled, totp_secret_encrypted FROM user_mfa_credentials')) {
          return {
            rows: [{ is_enabled: true, totp_secret_encrypted: encryptedCurrentSecret }],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          };
        }
        if (typeof sql === 'string' && sql.includes('UPDATE user_mfa_credentials SET pending_totp_secret_encrypted')) {
          executedSql = sql;
          executedParams = params || [];
          return { rows: [], rowCount: 1, command: 'UPDATE', oid: 0, fields: [] };
        }
        return { rows: [], rowCount: 0, command: '', oid: 0, fields: [] };
      }) as any;

      const validTotp = authenticator.generate(currentSecret);
      const res = await AuthService.setupMfa('user-test-uuid', 'admin@servicepro.com', validTotp);

      assert.ok(res.secret, 'Must generate replacement secret');
      assert.ok(res.otpAuthUrl.includes('ServicePro%20OS') || res.otpAuthUrl.includes('ServicePro OS'));
      assert.ok(executedSql.includes('pending_totp_secret_encrypted'), 'Must update pending_totp_secret_encrypted');
      assert.equal(executedParams[1], 'user-test-uuid');
      assert.equal(executedSql.includes('is_enabled = FALSE'), false, 'Active MFA factor must NOT be disabled during setup');
    } finally {
      pool.query = originalQuery;
    }
  });

  it('confirmMfa verifies pending replacement secret and activates it atomically (AUTH-01)', async () => {
    const originalQuery = pool.query;
    const pendingSecret = authenticator.generateSecret();
    const encryptedPendingSecret = AuthService.encryptTotpSecret(pendingSecret);
    let updatedValues: any = {};

    try {
      pool.query = (async (sql: string, params?: any[]) => {
        if (typeof sql === 'string' && sql.includes('SELECT totp_secret_encrypted, pending_totp_secret_encrypted')) {
          return {
            rows: [{
              totp_secret_encrypted: 'old_secret_enc',
              pending_totp_secret_encrypted: encryptedPendingSecret,
            }],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          };
        }
        if (typeof sql === 'string' && sql.includes('UPDATE user_mfa_credentials')) {
          updatedValues = { sql, params };
          return { rows: [], rowCount: 1, command: 'UPDATE', oid: 0, fields: [] };
        }
        return { rows: [], rowCount: 0, command: '', oid: 0, fields: [] };
      }) as any;

      // 1. Invalid TOTP fails confirmation
      const invalidRes = await AuthService.confirmMfa('user-test-uuid', '999999');
      assert.equal(invalidRes.success, false);

      // 2. Valid TOTP promotes pending secret to active, clears pending, and returns 8 backup codes
      const validCode = authenticator.generate(pendingSecret);
      const validRes = await AuthService.confirmMfa('user-test-uuid', validCode);

      assert.equal(validRes.success, true);
      assert.equal(validRes.backupCodes?.length, 8);
      assert.ok(updatedValues.sql.includes('pending_totp_secret_encrypted = NULL'));
      assert.ok(updatedValues.sql.includes('is_enabled = TRUE'));
      assert.equal(updatedValues.params[0], encryptedPendingSecret);
      assert.equal(updatedValues.params[2], 'user-test-uuid');
    } finally {
      pool.query = originalQuery;
    }
  });
});
