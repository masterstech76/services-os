# INSTALLATION GUIDE — Developer & Buyer Setup Instructions

**Document No.**: `09 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Prerequisites Breakdown

### 1.1 Required for Web Portal (`admin_web`) & Static Validators
- **Node.js**: `v20.0.0+` (verified on `v24.12.0`)
- **npm**: `v10.0.0+` (verified on `v11.6.2`)
- **Browser**: Microsoft Edge or Google Chrome (required if running `npm test` Playwright/Puppeteer E2E checks)

### 1.2 Required for Native Mobile Compilation (Not Installed on Audit Host)
- **For `serviceos/` (Flutter)**: Flutter SDK `>=3.19.0`, Dart SDK `>=3.0.0`, Android Studio / Xcode.
- **For `serviceos_android/` (Native Android)**: JDK `17`, Android SDK Platform `34`, Gradle `8.x`.

### 1.3 Required for Live Cloud Backend
- A **Supabase** project ([https://supabase.com](https://supabase.com)) or a self-hosted **PostgreSQL 16 + PostGIS** server with Supabase Auth (`GoTrue`).

---

## 2. Installing & Running the Web Portal (`VERIFIED`)

```bash
# 1. Install root and admin_web dependencies
npm install
cd admin_web
npm install
cd ..

# 2. (Optional for Local Mode / Required for Cloud Mode) Configure Supabase credentials
cp admin_web/.env.example admin_web/.env.local
# Edit admin_web/.env.local and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Start Vite development server
npm run dev
```

### First-Boot Master Administrator Setup
1. Open `http://localhost:5173/#/login`.
2. Complete the **Master Administrator Setup Wizard** (Full Name, Email, Company Name, and a strong password meeting the 10-character complexity policy in [`passwordPolicy.ts`](../admin_web/src/security/passwordPolicy.ts)).
3. In local mode, your credentials are hashed via Web Crypto PBKDF2-HMAC-SHA256 (`100,000` iterations) and stored in `localStorage`. When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured, `setupMasterAdmin` also invokes `supabase.auth.signUp`.

---

## 3. Provisioning the Database (`NOT VERIFIED` Live on Audit Host — Buyer Action Required)

1. Open your Supabase project's **SQL Editor**.
2. Execute the three migration scripts in [`supabase/migrations/`](../supabase/migrations/) in numerical order:
   - [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql) (`326` lines — 14 tables)
   - [`02_postgis_functions.sql`](../supabase/migrations/02_postgis_functions.sql) (`217` lines — 5 PL/pgSQL functions)
   - [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql) (`300` lines — 5 security tables, 1 view, RLS policies)
3. Insert your initial active tenant record into `public.tenants`:
   ```sql
   INSERT INTO public.tenants (slug, business_name, default_currency, platform_take_rate_basis_points, is_active)
   VALUES ('primary-org', 'Your Company Name', 'USD', 1500, TRUE)
   ON CONFLICT (slug) DO NOTHING;
   ```
4. Enable Realtime replication on `bookings`, `users`, and `provider_profiles` under **Database → Publications (`supabase_realtime`)** (matching [`supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts#L536-L546)).

---

## 4. Installing & Compiling the Mobile Apps (`BLOCKED` / `NOT VERIFIED` on Audit Host)

### 4.1 Flutter Mobile App (`serviceos/`)
On a workstation with the Flutter SDK installed:
```bash
cd serviceos
flutter pub get
flutter analyze
flutter test
flutter build apk --release \
  --dart-define=SUPABASE_URL=https://your-project-ref.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4.2 Native Android App (`serviceos_android/`)
On a workstation with JDK 17 and Android SDK 34 installed:
```bash
cd serviceos_android
./gradlew assembleDebug
```
> **Note**: `serviceos_android/` is an independent native Kotlin/Jetpack Compose UI implementation with static in-memory repositories (`BookingRepository.kt`, `ServiceRepository.kt`) and does not connect to Supabase out of the box.
