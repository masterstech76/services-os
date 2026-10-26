import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { GET, POST } from "@/app/api/admin/infrastructure/route";
import {
  SECRET_KEYS,
  SECRET_MASK,
  maskCredentialsForClient,
  mergeSubmittedCredentials,
  type ManagedEnvKey,
} from "@/lib/server/infrastructure-config";

describe("Infrastructure Locker Security, Secret Masking & Owner Authorization", () => {
  const ROOT_DIR = process.cwd();
  const ENV_LOCAL_PATH = path.join(ROOT_DIR, ".env.local");
  const ENV_BACKUP_PATH = path.join(ROOT_DIR, ".env.backup");
  let originalEnvLocal: string | null = null;

  beforeEach(() => {
    if (fs.existsSync(ENV_LOCAL_PATH)) {
      originalEnvLocal = fs.readFileSync(ENV_LOCAL_PATH, "utf8");
    } else {
      originalEnvLocal = null;
    }
  });

  afterEach(() => {
    if (originalEnvLocal !== null) {
      fs.writeFileSync(ENV_LOCAL_PATH, originalEnvLocal, "utf8");
    }
    const tmp = `${ENV_LOCAL_PATH}.tmp`;
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  });

  describe("1. Strict Server-Side Authentication & Role Gatekeeping", () => {
    it("strictly rejects unauthenticated GET requests with 401 Unauthorized", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/infrastructure", {
        headers: { "x-servicepro-role": "anon" },
      });
      const res = await GET(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error?.code).toBe("UNAUTHORIZED");
      expect(data.credentials).toBeUndefined();
    });

    it("strictly rejects unauthenticated POST requests with 401 Unauthorized", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/infrastructure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "anon",
        },
        body: JSON.stringify({ action: "save", credentials: {} }),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error?.code).toBe("UNAUTHORIZED");
    });

    it("strictly rejects non-owner roles (technician) with 403 Forbidden", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/infrastructure", {
        headers: { "x-servicepro-role": "technician", "x-servicepro-tech-id": "tech-carlos" },
      });
      const res = await GET(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error?.code).toBe("FORBIDDEN");
      expect(data.credentials).toBeUndefined();
    });

    it("strictly rejects ordinary admin role with 403 Forbidden (owner-only operational separation)", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/infrastructure", {
        headers: { "x-servicepro-role": "admin" },
      });
      const res = await GET(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error?.code).toBe("FORBIDDEN");
      expect(data.error?.message).toContain("Required: owner");
      expect(data.credentials).toBeUndefined();
    });

    it("strictly rejects customer role with 403 Forbidden", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/infrastructure", {
        headers: { "x-servicepro-role": "customer" },
      });
      const res = await GET(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error?.code).toBe("FORBIDDEN");
      expect(data.credentials).toBeUndefined();
    });
  });

  describe("2. Secret Masking & Confidentiality on GET", () => {
    it("allows authorized owner to read configuration, but masks ALL raw secrets", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/infrastructure", {
        headers: { "x-servicepro-role": "owner" },
      });
      const res = await GET(req);
      expect(res.status).toBe(200);

      const cacheControl = res.headers.get("cache-control");
      expect(cacheControl).toContain("no-store");

      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.credentials).toBeDefined();

      // Check all known secret keys: none may be raw plain-text
      for (const secretKey of SECRET_KEYS) {
        const val = data.credentials[secretKey];
        if (val) {
          expect(val).toBe(SECRET_MASK);
          expect(val).not.toContain("eyJ"); // No raw JWT tokens
          expect(val).not.toContain("sk_"); // No raw Stripe keys
          expect(val).not.toContain("AKIA"); // No raw AWS keys
          expect(val).not.toContain("postgres://"); // No database credentials with passwords
        }
      }

      // Non-secret fields remain visible for management
      expect(typeof data.credentials.NEXT_PUBLIC_API_MODE).toBe("string");
      expect(typeof data.credentials.SMS_DRIVER).toBe("string");
    });

    it("unit test maskCredentialsForClient correctly masks only sensitive keys", () => {
      const sampleCreds = {
        NEXT_PUBLIC_API_MODE: "local",
        NEXT_PUBLIC_SUPABASE_URL: "https://my-project.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOi...",
        SUPABASE_SERVICE_ROLE_KEY: "super_secret_service_key_9999",
        DATABASE_URL: "postgresql://postgres:mySecretPass123@db.supabase.co:5432/postgres",
        STRIPE_SECRET_KEY: "sk_live_verySecretKey12345",
        BUSINESS_NAME: "Cool Air Miami LLC",
      } as Record<ManagedEnvKey, string>;

      const { credentials, secretStatus } = maskCredentialsForClient(sampleCreds);

      // Secrets must be masked
      expect(credentials.SUPABASE_SERVICE_ROLE_KEY).toBe(SECRET_MASK);
      expect(credentials.DATABASE_URL).toBe(SECRET_MASK);
      expect(credentials.STRIPE_SECRET_KEY).toBe(SECRET_MASK);

      // Non-secrets must be intact
      expect(credentials.BUSINESS_NAME).toBe("Cool Air Miami LLC");
      expect(credentials.NEXT_PUBLIC_SUPABASE_URL).toBe("https://my-project.supabase.co");

      // Metadata correctly reports configuration
      expect(secretStatus.STRIPE_SECRET_KEY.configured).toBe(true);
      expect(secretStatus.STRIPE_SECRET_KEY.isSecret).toBe(true);
      expect(secretStatus.BUSINESS_NAME.isSecret).toBe(false);
    });
  });

  describe("3. Secret Preservation on POST (Never Save Mask as Credential)", () => {
    it("preserves existing real secret when client submits SECRET_MASK or empty string", () => {
      const current = {
        STRIPE_SECRET_KEY: "sk_live_realProductionKey9999",
        SUPABASE_SERVICE_ROLE_KEY: "real_service_role_secret_abc",
        BUSINESS_NAME: "Initial Business Name",
      } as Record<ManagedEnvKey, string>;

      const submitted = {
        STRIPE_SECRET_KEY: SECRET_MASK, // Client didn't change it
        SUPABASE_SERVICE_ROLE_KEY: "", // Client left empty
        BUSINESS_NAME: "Updated Business Name", // Non-secret updated
      };

      const merged = mergeSubmittedCredentials(current, submitted);

      // Secrets are preserved exactly
      expect(merged.STRIPE_SECRET_KEY).toBe("sk_live_realProductionKey9999");
      expect(merged.SUPABASE_SERVICE_ROLE_KEY).toBe("real_service_role_secret_abc");

      // Non-secret field is updated
      expect(merged.BUSINESS_NAME).toBe("Updated Business Name");
    });

    it("correctly updates secret when user provides a new, non-masked string", () => {
      const current = {
        STRIPE_SECRET_KEY: "sk_test_oldKey123",
      } as Record<ManagedEnvKey, string>;

      const submitted = {
        STRIPE_SECRET_KEY: "sk_live_brandNewKey456",
      };

      const merged = mergeSubmittedCredentials(current, submitted);
      expect(merged.STRIPE_SECRET_KEY).toBe("sk_live_brandNewKey456");
    });

    it("clears a secret if __CLEAR__ is explicitly submitted", () => {
      const current = {
        CRON_SECRET: "old_cron_secret_123",
      } as Record<ManagedEnvKey, string>;

      const submitted = {
        CRON_SECRET: "__CLEAR__",
      };

      const merged = mergeSubmittedCredentials(current, submitted);
      expect(merged.CRON_SECRET).toBe("");
    });
  });

  describe("4. Payload Validation & CSRF Protection", () => {
    it("rejects malformed payloads with 400 Bad Request", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/infrastructure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "owner",
        },
        body: JSON.stringify({
          action: "invalid_action_name", // Invalid action
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.message).toContain("Validation error");
    });

    it("rejects unauthorized cross-origin requests via CSRF protection", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/infrastructure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "owner",
          origin: "https://malicious-attacker-site.com",
        },
        body: JSON.stringify({ action: "save", credentials: {} }),
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error?.code).toBe("CSRF_FORBIDDEN");
    });
  });

  describe("5. Safe Connection Tests (Zero Leaks, No Financial PII)", () => {
    it("performs safe read-only tests and never exposes financial balances or credentials", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/infrastructure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "owner",
        },
        body: JSON.stringify({ action: "test", module: "all" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.results).toBeDefined();

      // Verify results do not leak financial data or credentials
      const serialized = JSON.stringify(data.results);
      expect(serialized).not.toContain("sk_");
      expect(serialized).not.toContain("balance");
      expect(serialized).not.toContain("available_balance");
      expect(serialized).not.toContain("bank_account");

      // Verify each module reports a clean, safe status
      expect(data.results.database?.status).toBeDefined();
      expect(data.results.stripe?.status).toBeDefined();
      expect(data.results.twilio?.status).toBeDefined();
      expect(data.results.maps?.status).toBe("Active");
    });
  });
});
