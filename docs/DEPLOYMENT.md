# ServicePro OS — Production Deployment & Operations Guide

## 1. Hosting Platforms Supported
ServicePro OS is designed for deployment across modern cloud platforms:
- **Vercel** (Recommended for Serverless Edge execution and instant Next.js App Router optimization)
- **Render** (`render.yaml` blueprint included in repository)
- **Railway / Fly.io** (Containerized execution with persistent storage)
- **Self-Hosted VPS** (Node.js 18.18+ / 20+ with PM2 or Docker)

---

## 2. Environment Variables Configuration

Copy `.env.production.example` to `.env.local` or input these directly into your cloud deployment dashboard:

```ini
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_MODE=real

# Supabase (Managed Cloud DB & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Stripe Payment Gateway
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Communications & Security
CRON_SECRET=generate_a_secure_random_64_char_hex_string
ALLOW_DEMO_AUTH=false

# Optional Integrations
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=auth_token_...
TWILIO_FROM_NUMBER=+15551234567
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

---

## 3. Deployment Walkthroughs

### Option A: Vercel Deployment (Recommended)
1. Push your code to your private GitHub or GitLab repository.
2. Sign in to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your `servicepro-os` repository.
4. Framework Preset: **Next.js**.
5. Build Command: `pnpm build`
6. Output Directory: `.next`
7. Add all required Environment Variables in the project settings.
8. Click **Deploy**.

### Option B: Render Deployment
A pre-configured `render.yaml` file is provided:
1. Connect your repository in Render Dashboard.
2. Select **New Blueprint Instance**.
3. Render automatically provisions the web service, attaches environment variables, and configures health checks (`/api/health`).

### Option C: Docker Self-Hosted Deployment
To containerize and run on an Ubuntu/Debian VPS:
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["pnpm", "start"]
```

---

## 4. Webhook & Cron Configuration

### 1. Stripe Webhook Setup
1. In the Stripe Dashboard, navigate to **Developers > Webhooks**.
2. Click **Add Endpoint** and enter:
   `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the Signing Secret and set it as `STRIPE_WEBHOOK_SECRET`.

### 2. Automated Daily Housekeeping Cron
A maintenance cron task purges expired slot holds and archives stale records:
- Endpoint: `GET /api/cron/housekeeping`
- Authorization: `Bearer <CRON_SECRET>`
- In Vercel, this is automatically configured via `vercel.json`:
  ```json
  {
    "crons": [
      {
        "path": "/api/cron/housekeeping",
        "schedule": "0 7 * * *"
      }
    ]
  }
  ```

---

## 5. Post-Deployment Verification & Smoke Test
Run this quick smoke test once your deployment goes live:
1. **Health Check:** `curl -f https://your-domain.com/api/health` should return `{"status":"ok"}`.
2. **Public Routing:** Navigate to `/`, `/services`, `/about`, `/faq`, `/pricing`, `/reviews`, `/contact`. Confirm all pages render cleanly.
3. **Admin MFA Locker:** Sign in to `/admin` and navigate to `/admin/infrastructure`. Confirm credentials display masked values (`••••••••`).
