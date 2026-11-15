# DEPLOYMENT GUIDE — Web, Database & Mobile Production Deployment

**Document No.**: `23 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Step 1 — Deploy the PostgreSQL 16 + PostGIS Database (Supabase Cloud)

1. Create a production project at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. In **SQL Editor**, run the three migration files (`843` lines total) in exact order:
   1. [`supabase/migrations/01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql) (`326` lines — creates 14 tables)
   2. [`supabase/migrations/02_postgis_functions.sql`](../supabase/migrations/02_postgis_functions.sql) (`217` lines — creates 5 PL/pgSQL functions)
   3. [`supabase/migrations/03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql) (`300` lines — creates 5 security tables, 1 view, 7 functions, and 18 RLS policies)
3. Seed your initial active organization row in `public.tenants`:
   ```sql
   INSERT INTO public.tenants (slug, business_name, default_currency, platform_take_rate_basis_points, is_active)
   VALUES ('primary-org', 'Your Company Name', 'USD', 1500, TRUE)
   ON CONFLICT (slug) DO NOTHING;
   ```
4. Enable Realtime replication on `bookings`, `users`, and `provider_profiles` under **Database → Publications (`supabase_realtime`)** (matching [`supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts#L536-L546)).
5. Complete the RLS & schema-alignment checklist documented in [`KNOWN_ISSUES_AND_LIMITATIONS.md`](KNOWN_ISSUES_AND_LIMITATIONS.md) and [`AUTHENTICATION_AND_RBAC.md`](AUTHENTICATION_AND_RBAC.md).
6. Copy your **Project URL** (`https://<project-ref>.supabase.co`) and **anon `public` key** from **Project Settings → API**.

---

## 2. Step 2 — Deploy the Admin & Staff Web Application (`admin_web`)

### Building the Static Production Bundle
```bash
npm install
cd admin_web && npm install && cd ..
npm run build
```
This compiles TypeScript (`tsc -b`) and bundles the application into `admin_web/dist/` (`index.html` + code-split JS/CSS chunks).

### Hosting on Vercel / Netlify / Cloudflare Pages / Nginx
- **Publish Directory**: `admin_web/dist`
- **Build Command**: `npm run build`
- **Environment Variables**:
  ```env
  VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
  VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
  ```
- **HTTPS Requirement**: Must be served over `https://` so the browser Web Crypto API (`crypto.subtle` used by [`passwordPolicy.ts`](../admin_web/src/security/passwordPolicy.ts) for PBKDF2 hashing) is enabled.

---

## 3. Step 3 — Compile & Deploy the Mobile Applications

> **Reminder**: Native mobile compilation was **`BLOCKED` / `NOT VERIFIED`** on the audit workstation because Flutter/Android/Xcode SDKs were not installed locally. Execute these steps on a workstation or CI runner with the mobile SDKs installed.

### Option A: Cross-Platform Flutter App (`serviceos/` — Recommended for Cloud Sync)
```bash
cd serviceos
flutter pub get
flutter analyze

# Android Play Store App Bundle (.aab)
flutter build appbundle --release \
  --dart-define=SUPABASE_URL=https://<your-project-ref>.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=<your-anon-public-key>

# iOS App Store Archive (.ipa — macOS + Xcode required)
flutter build ipa --release \
  --dart-define=SUPABASE_URL=https://<your-project-ref>.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=<your-anon-public-key>
```

### Option B: Native Android App (`serviceos_android/` — Standalone In-Memory UI Only Unless Extended)
```bash
cd serviceos_android
./gradlew assembleRelease
```
