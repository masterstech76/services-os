'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function assertCheck(name, condition, detail) {
  if (condition) {
    passed++;
    console.log(`PASS: ${name}`);
  } else {
    failed++;
    console.error(`FAIL: ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

// Phase 3: Migration 05 + Stripe Payment Intent + Stripe Webhook
const m05 = read('supabase/migrations/05_phase3_payments_and_webhook_idempotency.sql');
assertCheck('M05 defines stripe_webhook_events table', /CREATE TABLE IF NOT EXISTS public\.stripe_webhook_events/i.test(m05));
assertCheck('M05 enables FORCE ROW LEVEL SECURITY on stripe_webhook_events', /ALTER TABLE public\.stripe_webhook_events FORCE ROW LEVEL SECURITY/i.test(m05));
assertCheck('M05 aligns protect_booking_sensitive_fields with 01_initial_schema columns', /labor_cost_cents/.test(m05) && /total_authorized_cents/.test(m05));

const piFn = read('supabase/functions/stripe-payment-intent/index.ts');
assertCheck('stripe-payment-intent verifies active public.users caller', /is_active/.test(piFn) && /public\.users|from\('users'\)/.test(piFn));
assertCheck('stripe-payment-intent computes total via calculate_booking_financials RPC', /calculate_booking_financials/.test(piFn));
assertCheck('stripe-payment-intent reads stripe_connect_id from provider_profiles', /provider_profiles/.test(piFn) && /stripe_connect_id/.test(piFn));
assertCheck('stripe-payment-intent passes Idempotency-Key to Stripe', /Idempotency-Key/.test(piFn));
assertCheck('stripe-payment-intent does not accept client amountCents', !/body\.amountCents/.test(piFn) && !/const\s*\{\s*[^}]*amountCents/.test(piFn));

const whFn = read('supabase/functions/stripe-webhook/index.ts');
assertCheck('stripe-webhook verifies all v1 HMAC signatures', /v1Signatures/.test(whFn) || /signatures\.filter/.test(whFn));
assertCheck('stripe-webhook deduplicates event.id via stripe_webhook_events', /stripe_webhook_events/.test(whFn) && /23505/.test(whFn));
assertCheck('stripe-webhook keeps HELD_IN_ESCROW on payment_intent.succeeded', /HELD_IN_ESCROW/.test(whFn));
assertCheck('stripe-webhook handles payment_intent.payment_failed and canceled', /payment_intent\.payment_failed/.test(whFn) && /payment_intent\.canceled/.test(whFn));

// Phase 4: Twilio SMS + Push Notification + .env.example
const smsFn = read('supabase/functions/twilio-sms/index.ts');
assertCheck('twilio-sms restricts callers to active ADMIN/STAFF', /ADMIN/.test(smsFn) && /STAFF/.test(smsFn) && /is_active/.test(smsFn));
assertCheck('twilio-sms validates strict E.164 phone numbers', /\\\+\[1-9\]\\d\{7,14\}/.test(smsFn));
assertCheck('twilio-sms enforces rate limit via security_audit_logs', /security_audit_logs/.test(smsFn));

const pushFn = read('supabase/functions/push-notification/index.ts');
assertCheck('push-notification verifies JWT via auth.getUser', /auth\.getUser/.test(pushFn));
assertCheck('push-notification uses FCM HTTP v1 OAuth2 instead of legacy /fcm/send', /v1\/projects\//.test(pushFn) && !/fcm\.googleapis\.com\/fcm\/send/.test(pushFn));
assertCheck('push-notification returns 502 on upstream failure', /502/.test(pushFn));

const envEx = read('.env.example');
assertCheck('.env.example documents FCM_PROJECT_ID, FCM_CLIENT_EMAIL, FCM_PRIVATE_KEY, RESEND_API_KEY',
  /FCM_PROJECT_ID/.test(envEx) && /FCM_CLIENT_EMAIL/.test(envEx) && /FCM_PRIVATE_KEY/.test(envEx) && /RESEND_API_KEY/.test(envEx));

// Phase 5 & 6: Web, Flutter, Android Data Integrity & Zero Hardcoded Demo Data
const supaWeb = read('admin_web/src/services/supabaseClient.ts');
assertCheck('Web supabaseClient uses deterministic UUIDs for non-UUID IDs', /toDeterministicUuid/.test(supaWeb));
assertCheck('Web supabaseClient verifyBookingEscrow supports release_escrow_to_technician', /release_escrow_to_technician/.test(supaWeb));

const dartRepo = read('serviceos/lib/data/repositories/booking_repository.dart');
assertCheck('Flutter BookingRepository removes hardcoded 4892 PIN fallback', !/'4892'/.test(dartRepo));
assertCheck('Flutter BookingRepository does not fallback to COMPLETED on escrow failure', !/if \(!released\)[\s\S]{0,120}updateBookingStatus\(bookingId, 'COMPLETED'\)/.test(dartRepo));

const ktRepo = read('serviceos_android/app/src/main/kotlin/com/serviceos/app/data/repository/BookingRepository.kt');
assertCheck('Android BookingRepository removes hardcoded 4892 PIN fallback', !/"4892"/.test(ktRepo));
assertCheck('Android BookingRepository uses bearerToken & Synchronized state updates', /bearerToken/.test(ktRepo) && /@Synchronized/.test(ktRepo));

const page25 = read('admin_web/src/pages/module5/Page25TechnicianPerformance.tsx');
assertCheck('Page25 removes hardcoded Vikram Singh / Amit Sharma / Suresh Patel', !/Vikram Singh|Amit Sharma|Suresh Patel/.test(page25));

const page36 = read('admin_web/src/pages/module8/Page36PaymentNotificationConfig.tsx');
assertCheck('Page36 does not persist secret keys to localStorage',
  !/localStorage\.setItem\('cfg_stripeSecretKey'/.test(page36) &&
  !/localStorage\.setItem\('cfg_sesSecretAccessKey'/.test(page36) &&
  !/localStorage\.setItem\('cfg_sendgridApiKey'/.test(page36));

const installer = read('admin_web/src/pages/commercial/SystemInstallerPage.tsx');
assertCheck('SystemInstallerPage removes fake setInterval migration runner and lists 5 migrations',
  !/setInterval/.test(installer) && /05_phase3_payments_and_webhook_idempotency\.sql/.test(installer));

const ktServices = read('serviceos_android/app/src/main/kotlin/com/serviceos/app/data/repository/ServiceRepository.kt');
assertCheck('Android ServiceRepository starts with emptyList instead of hardcoded catalog', /emptyList/.test(ktServices) && !/Emergency Pipe Leak Repair/.test(ktServices));

const dartFixture = read('serviceos/lib/data/datasources/local_fixture_datasource.dart');
assertCheck('Flutter LocalFixtureDataSource returns empty categories', /loadCategories\(\) async => \[\]/.test(dartFixture));

const page29 = read('admin_web/src/pages/module6/Page29TechnicianPayouts.tsx');
assertCheck('Page29 removes hardcoded $148,420.00 disbursed figure', !/148,420\.00/.test(page29));

const page30 = read('admin_web/src/pages/module6/Page30RefundManagement.tsx');
assertCheck('Page30 removes hardcoded 14.2% approval rate', !/14\.2%/.test(page30));

const custProfile = read('serviceos/lib/features/profile/presentation/screens/customer_profile_screen.dart');
assertCheck('CustomerProfileScreen removes hardcoded Unsplash avatar', !/photo-1544005313-94ddf0286df2/.test(custProfile));

assertCheck('M05 enforces tenant_id scoping on stripe_webhook_events without booking_id IS NULL bypass',
  /tenant_id = public\.current_tenant_id\(\)/.test(m05) && !/booking_id IS NULL\s+OR EXISTS/.test(m05));
assertCheck('M05 defines server-side approve_booking_extra_parts RPC', /CREATE OR REPLACE FUNCTION public\.approve_booking_extra_parts/.test(m05));
assertCheck('Flutter BookingRepository routes approveExtraParts through approve_booking_extra_parts RPC', /approve_booking_extra_parts/.test(dartRepo));
assertCheck('SystemInstallerPage uses verify_schema_migrations_status per-migration RPC', /verify_schema_migrations_status/.test(installer));
assertCheck('No hardcoded 4892 PIN remains in Flutter/Android dispatch & Booking model',
  !/'4892'/.test(read('serviceos/lib/features/dispatch/presentation/screens/live_dispatch_radar_screen.dart')) &&
  !/"4892"/.test(read('serviceos_android/app/src/main/kotlin/com/serviceos/app/data/model/Booking.kt')) &&
  !/4892/.test(read('serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/LiveDispatchRadarScreen.kt')));

console.log(`\nPhase 3-6 Security & Integrity Summary: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
