# ENVIRONMENT CONFIGURATION — Variables & Runtime Settings

**Document No.**: `10 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Template Files Included in Repository

Zero `.env` files containing real credentials exist in the repository. Only placeholder templates are tracked:
- [`.env.example`](../.env.example) — Workspace environment reference
- [`.env.production.example`](../.env.production.example) — Production environment reference
- [`admin_web/.env.example`](../admin_web/.env.example) — Vite web application template
- [`serviceos/.env.example`](../serviceos/.env.example) — Flutter `--dart-define` reference

---

## 2. Variables Actually Read by Application Source Code

Only the following four environment variables are read directly by the client codebases:

| Variable Name | Consuming File | Read Mechanism | Status & Behavior |
| :--- | :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | [`admin_web/src/services/supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts#L40) | `import.meta.env.VITE_SUPABASE_URL` (or `localStorage.getItem('servicepro_supabase_url')`) | **`VERIFIED`** — Initializes `@supabase/supabase-js` if valid `http/https` URL; otherwise stays in local browser mode. |
| `VITE_SUPABASE_ANON_KEY` | [`admin_web/src/services/supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts#L41) | `import.meta.env.VITE_SUPABASE_ANON_KEY` (or `localStorage.getItem('servicepro_supabase_anon_key')`) | **`VERIFIED`** — Public anon key paired with `VITE_SUPABASE_URL`. |
| `SUPABASE_URL` | [`serviceos/lib/core/network/supabase_service.dart`](../serviceos/lib/core/network/supabase_service.dart#L14) | `String.fromEnvironment('SUPABASE_URL', defaultValue: '')` | **Source Wired (`NOT VERIFIED` Live)** — Passed via `--dart-define=SUPABASE_URL=...`. If empty, Flutter runs in local fixture mode. |
| `SUPABASE_ANON_KEY` | [`serviceos/lib/core/network/supabase_service.dart`](../serviceos/lib/core/network/supabase_service.dart#L18) | `String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: '')` | **Source Wired (`NOT VERIFIED` Live)** — Passed via `--dart-define=SUPABASE_ANON_KEY=...`. |

---

## 3. Reserved Server-Side Variables (`NOT IMPLEMENTED` in Client Code)

The following variables listed in [`.env.example`](../.env.example) are **not read by any client file** and are reserved for future server-side Supabase Edge Functions that the Buyer must implement to enable live payment charging, SMS, or email:

- `SUPABASE_SERVICE_ROLE_KEY` — Server-only admin key (never expose in `VITE_*` or `--dart-define`).
- `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Reserved for Stripe Connect integration (**`NOT IMPLEMENTED`**).
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — Reserved for Twilio SMS integration (**`NOT IMPLEMENTED`**).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — Configure directly in Supabase Dashboard (**Authentication → SMTP Settings**).
