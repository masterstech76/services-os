import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Mobile Client Authentication & Cryptographic Storage Security Suite (MOB-01, MOB-02)', () => {
  const repoRoot = path.resolve(__dirname, '../..');

  it('Android LoginScreen has zero local-only SMS bypasses and strictly uses ApiClient (MOB-01)', () => {
    const androidLoginPath = path.join(
      repoRoot,
      'serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/LoginScreen.kt'
    );
    assert.ok(fs.existsSync(androidLoginPath), 'Android LoginScreen.kt must exist');

    const content = fs.readFileSync(androidLoginPath, 'utf-8');

    // Verify zero mock/simulated bypass paths
    assert.equal(
      content.includes('Send Code'),
      false,
      'Android LoginScreen must not contain local "Send Code" bypass'
    );
    assert.equal(
      content.includes('4-digit'),
      false,
      'Android LoginScreen must not accept unverified 4-digit codes'
    );

    // Verify authoritative API calls
    assert.ok(
      content.includes('ApiClient.login('),
      'Android LoginScreen must invoke ApiClient.login'
    );
    assert.ok(
      content.includes('ApiClient.verifyMfa('),
      'Android LoginScreen must verify 6-digit TOTP with ApiClient.verifyMfa'
    );
    assert.ok(
      content.includes('ApiClient.refreshToken()'),
      'Android LoginScreen quick sign-in must verify session via ApiClient.refreshToken'
    );
  });

  it('Android ApiClient & BookingRepository enforce AES-256 EncryptedSharedPreferences fail-closed (MOB-02)', () => {
    const apiClientPath = path.join(
      repoRoot,
      'serviceos_android/app/src/main/kotlin/com/serviceos/app/data/network/ApiClient.kt'
    );
    const bookingRepoPath = path.join(
      repoRoot,
      'serviceos_android/app/src/main/kotlin/com/serviceos/app/data/repository/BookingRepository.kt'
    );

    assert.ok(fs.existsSync(apiClientPath), 'ApiClient.kt must exist');
    assert.ok(fs.existsSync(bookingRepoPath), 'BookingRepository.kt must exist');

    const clientContent = fs.readFileSync(apiClientPath, 'utf-8');
    const repoContent = fs.readFileSync(bookingRepoPath, 'utf-8');

    // Verify EncryptedSharedPreferences usage
    assert.ok(
      clientContent.includes('EncryptedSharedPreferences.create'),
      'ApiClient must use EncryptedSharedPreferences'
    );
    assert.ok(
      repoContent.includes('EncryptedSharedPreferences.create'),
      'BookingRepository must use EncryptedSharedPreferences'
    );

    // Verify no fallback to unencrypted getSharedPreferences
    assert.equal(
      clientContent.includes('getSharedPreferences('),
      false,
      'ApiClient must never fall back to plaintext getSharedPreferences'
    );
    assert.equal(
      repoContent.includes('getSharedPreferences('),
      false,
      'BookingRepository must never fall back to plaintext getSharedPreferences'
    );
  });

  it('Flutter auth provider strictly requires mfaSessionToken and forbids local bypass', () => {
    const flutterAuthPath = path.join(
      repoRoot,
      'serviceos/lib/data/providers/auth_provider.dart'
    );
    assert.ok(fs.existsSync(flutterAuthPath), 'Flutter auth_provider.dart must exist');

    const content = fs.readFileSync(flutterAuthPath, 'utf-8');

    assert.ok(
      content.includes('required String mfaSessionToken'),
      'Flutter verifyOtp must strictly require mfaSessionToken'
    );
    assert.ok(
      content.includes('if (mfaSessionToken.trim().isEmpty)'),
      'Flutter verifyOtp must fail closed on missing token'
    );
    assert.ok(
      content.includes('ApiClient.instance.verifyMfa'),
      'Flutter verifyOtp must call backend server'
    );
  });
});
