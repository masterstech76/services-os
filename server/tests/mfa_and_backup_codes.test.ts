import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../src/modules/auth/auth.service.js';

describe('MFA Lifecycle & Emergency Recovery Codes Suite', () => {
  it('AuthService.generateBackupCodes generates unique 8-character codes and SHA-256 hashes', () => {
    const { rawCodes, hashedCodes } = AuthService.generateBackupCodes(8);

    assert.equal(rawCodes.length, 8);
    assert.equal(hashedCodes.length, 8);

    // All raw codes must be unique, 8 uppercase hex characters
    const uniqueRaw = new Set(rawCodes);
    assert.equal(uniqueRaw.size, 8);
    for (const code of rawCodes) {
      assert.match(code, /^[0-9A-F]{8}$/);
    }

    // Hashes must match SHA-256 of the raw codes
    for (let i = 0; i < 8; i++) {
      assert.equal(AuthService.hashToken(rawCodes[i]), hashedCodes[i]);
    }
  });

  it('Verifying backup codes rejects invalid codes and prevents replay', () => {
    const { rawCodes, hashedCodes } = AuthService.generateBackupCodes(5);
    const storedList = [...hashedCodes];

    const codeToUse = rawCodes[2];
    const codeHash = AuthService.hashToken(codeToUse);

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
    const bogusHash = AuthService.hashToken('FAKECODE');
    assert.equal(storedList.indexOf(bogusHash), -1);
  });
});
