# AUTHENTICATION AND RBAC — Identity, Roles & RLS Verification Status

**Document No.**: `14 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Architectural Distinction: Client-Side Guards vs. Server-Side RLS

In a commercial security evaluation, **client-side route guards alone are not security** because browser state (`localStorage`) can be modified by a local user. ServicePro OS therefore contains two distinct layers:

| Layer | Implementation Files | What It Protects | Verification State |
| :--- | :--- | :--- | :--- |
| **Layer 1: Client-Side Web Auth, Session & Route Guards** | [`LoginPage.tsx`](../admin_web/src/pages/auth/LoginPage.tsx), [`AdminContext.tsx`](../admin_web/src/context/AdminContext.tsx), [`PageRouter.tsx`](../admin_web/src/pages/PageRouter.tsx), [`passwordPolicy.ts`](../admin_web/src/security/passwordPolicy.ts), [`rateLimiter.ts`](../admin_web/src/security/rateLimiter.ts), [`sessionManager.ts`](../admin_web/src/security/sessionManager.ts), [`rbac.ts`](../admin_web/src/security/rbac.ts) | UI navigation separation (`ADMIN` `#/page/1..38` vs. `STAFF` `#/staff/101..114`), local PBKDF2 password hashing (`hashPasswordClient`), 5-attempt login lockout, 15m idle PIN lock, and 12h session expiry. | **`VERIFIED`** in local Playwright browser tests |
| **Layer 2: Server-Side Supabase Auth & PostgreSQL Row-Level Security (RLS)** | [`supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts), [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql) | Database-level read/write isolation using signed Supabase JWTs (`auth.uid()`, `auth.current_user_role()`). | **Static SQL `VERIFIED` / Live Multi-Account RLS Testing `NOT VERIFIED` (Requires Live Supabase Instance & Schema Alignment)** |

---

## 2. Role & Permission Matrix ([`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql) & [`rbac.ts`](../admin_web/src/security/rbac.ts))

| Resource / Action | `ADMIN` | `STAFF` | `TECHNICIAN` | `CUSTOMER` | Exact Policy Name in `03_security_rbac_and_rls.sql` |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Web Routes `#/page/1`–`38`** | ✅ | ❌ | ❌ | ❌ | Client UI Route Guard (`PageRouter.tsx` line 66 & `AdminContext.tsx` line 1206) |
| **Web Routes `#/staff/101`–`114`** | ✅ (via Staff login) | ✅ | ❌ | ❌ | Client UI Route Guard (`AdminContext.tsx` line 1232) |
| **`users` Table** | ✅ (`FOR ALL`) | ✅ (`FOR SELECT`) | ✅ (Own `id = auth.uid()`) | ✅ (Own `id = auth.uid()`) | `"Admins full management on users"`, `"Staff can view all users"`, `"Users can view and edit own profile"` |
| **`services` & `categories`** | ✅ (`FOR ALL`) | ✅ (Public Read) | ✅ (Public Read) | ✅ (Public Read) | `"Public can browse services"`, `"Admin manage services"`, `"Public can browse categories"`, `"Admin manage categories"` |
| **`bookings` Select** | ✅ (`FOR ALL`) | ✅ (`FOR SELECT`) | ✅ (`provider_id = auth.uid()` or unassigned `REQUESTED`) | ✅ (`customer_id = auth.uid()`) | `"Admins full access on bookings"`, `"Staff dispatch access on bookings"`, `"Customers can view own bookings"`, `"Technicians view assigned or dispatchable bookings"` |
| **`bookings` Insert** | ✅ | ❌ (Needs Policy if Staff inserts via RLS) | ❌ | ✅ (`customer_id = auth.uid()`) | `"Admins full access on bookings"`, `"Customers can create new bookings"` |
| **`bookings` Update** | ✅ | ✅ (`FOR UPDATE`) | ✅ (`provider_id = auth.uid()`) | ❌ | `"Staff can update booking status & dispatch"`, `"Technicians update assigned bookings"` |
| **`payments` Table** | ✅ (`FOR ALL`) | ❌ | ❌ | ✅ (`customer_id = auth.uid()`) | `"Admins manage payments"`, `"Customers view own payments"` |
| **`audit_logs` & `security_audit_logs`** | ✅ (`FOR SELECT`) | ❌ (Append only) | ❌ (Append only) | ❌ (Append only) | `"Admins read audit logs"`, `"Admins read security audit logs"`, `"System can append security audit logs"` |

---

## 3. Important Pre-Deployment RLS Checklist for the Buyer

Before exposing a live Supabase project to untrusted public traffic, the Buyer must verify and address the following items in [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql):

1. **JWT Metadata Claim Path (`app_metadata` vs `user_metadata`)**:
   - Line 124 of `03_security_rbac_and_rls.sql` defines `auth.current_user_role()` using `current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role'`, whereas `supabaseClient.ts` (`signUp`, line 114) passes `role` in `options.data` (`user_metadata`). Ensure either `auth.current_user_role()` checks ` coalesce(jwt->'app_metadata'->>'role', jwt->'user_metadata'->>'role')` (or better, queries `public.users.role WHERE id = auth.uid()`) so users cannot self-assign `ADMIN` in client `signUp` metadata.
2. **Tables Without `ENABLE ROW LEVEL SECURITY` in Migration `03`**:
   - Migration `03` (lines 157–166) enables RLS on 10 of the 19 tables. Enable RLS and add policies on the remaining 9 tables (`tenants`, `customer_addresses`, `job_evidence`, `inventory_items`, `booking_parts`, `user_mfa_credentials`, `auth_rate_limits`, `password_reset_tokens`, `auth_otps`) and add `CREATE POLICY` rules for `customer_profiles`, `provider_profiles`, and `reviews`.
3. **Live Multi-Role Verification Query**:
   ```sql
   BEGIN;
   SET LOCAL ROLE authenticated;
   SET LOCAL "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated", "app_metadata": {"role": "CUSTOMER"}}';
   SELECT count(*) FROM public.security_audit_logs; -- Must return 0 rows
   ROLLBACK;
   ```
