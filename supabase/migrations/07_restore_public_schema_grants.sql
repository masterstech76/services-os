-- =============================================================================
-- Migration 07: Restore Standard Supabase `public` Schema Grants
-- =============================================================================
-- Restores schema, sequence, and RLS-gated table privileges on `public` for
-- `postgres`, `service_role`, `authenticated`, and `anon` while strictly
-- preserving `REVOKE ALL` on sensitive security/MFA/auth/webhook tables and
-- sensitive SECURITY DEFINER functions.
-- =============================================================================

-- 1. Schema usage
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Full table & sequence access for postgres and service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 3. Standard RLS-gated DML privileges for anon and authenticated on public tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- 4. Re-assert strict isolation on sensitive security/MFA/auth/webhook tables
REVOKE ALL ON TABLE
  public.user_mfa_credentials,
  public.user_mfa_sessions,
  public.auth_rate_limits,
  public.password_reset_tokens,
  public.auth_otps,
  public.stripe_webhook_events
FROM PUBLIC, anon, authenticated;

REVOKE ALL ON TABLE private.mfa_encryption_keys FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE private.mfa_encryption_keys TO postgres, service_role;

-- 5. Default privileges for future migrations created by postgres
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT ALL ON TABLES TO postgres, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
