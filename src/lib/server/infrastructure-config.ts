import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const MANAGED_KEYS = [
  // Module 1: Database Architecture (3 Plug-and-Play Providers with Enable/Disable Switches)
  "DB_ENABLE_SUPABASE",
  "DB_ENABLE_LOCAL_POSTGRES",
  "DB_ENABLE_AWS_DB",
  "PRIMARY_DB_DRIVER",
  "NEXT_PUBLIC_API_MODE",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "SUPABASE_STORAGE_BUCKET",
  "LOCAL_PG_HOST",
  "LOCAL_PG_PORT",
  "LOCAL_PG_DATABASE",
  "LOCAL_PG_USER",
  "LOCAL_PG_PASSWORD",
  "LOCAL_PG_POOL_SIZE",
  "AWS_DB_TYPE",
  "AWS_RDS_ENDPOINT",
  "AWS_RDS_PORT",
  "AWS_RDS_DATABASE",
  "AWS_RDS_USER",
  "AWS_RDS_PASSWORD",
  "AWS_DYNAMODB_TABLE_PREFIX",

  // Module 2: Email Delivery Engine (3 Options with 1-Active Switch)
  "EMAIL_DRIVER",
  "AWS_SES_REGION",
  "AWS_SES_ACCESS_KEY_ID",
  "AWS_SES_SECRET_ACCESS_KEY",
  "EMAIL_FROM_ADDRESS",
  "EMAIL_FROM_NAME",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_SECURE",
  "EMAIL_API_PROVIDER",
  "EMAIL_API_KEY",

  // Module 3: Push Notifications & Event Pub/Sub (AWS SNS)
  "AWS_SNS_REGION",
  "AWS_SNS_ACCESS_KEY_ID",
  "AWS_SNS_SECRET_ACCESS_KEY",
  "AWS_SNS_DISPATCH_TOPIC_ARN",
  "AWS_SNS_ALERTS_TOPIC_ARN",
  "AWS_SNS_SENDER_ID",

  // Module 4: SMS & Phone OTP Gateway (3 Options with 1-Active Switch)
  "SMS_DRIVER",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_FROM_NUMBER",
  "TWILIO_MESSAGING_SERVICE_SID",
  "TWILIO_VOICE_WEBHOOK_URL",
  "SMS_CUSTOM_WEBHOOK_URL",
  "SMS_CUSTOM_API_KEY",

  // Module 5: Payment Gateway & Webhooks (Stripe)
  "STRIPE_MODE",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",

  // Module 6: Live GPS Fleet Maps & Geocoding
  "NEXT_PUBLIC_MAPBOX_TOKEN",
  "MAPBOX_SERVER_TOKEN",
  "NEXT_PUBLIC_GOOGLE_MAPS_KEY",

  // Module 7: Security, Bot Protection, Redis Rate-Limiting & Cron
  "NEXT_PUBLIC_APP_URL",
  "CRON_SECRET",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "ALLOW_DEMO_AUTH",

  // Module 8: Initial Owner Bootstrap & White-Label Sync
  "INITIAL_OWNER_EMAIL",
  "INITIAL_OWNER_PASSWORD",
  "BUSINESS_NAME",
  "DISPATCH_PHONE",
] as const;

export type ManagedEnvKey = (typeof MANAGED_KEYS)[number];

export const SECRET_KEYS = new Set<string>([
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "LOCAL_PG_PASSWORD",
  "AWS_RDS_PASSWORD",
  "AWS_SES_SECRET_ACCESS_KEY",
  "AWS_SNS_SECRET_ACCESS_KEY",
  "TWILIO_AUTH_TOKEN",
  "SMS_CUSTOM_API_KEY",
  "SMTP_PASSWORD",
  "EMAIL_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "MAPBOX_SERVER_TOKEN",
  "CRON_SECRET",
  "TURNSTILE_SECRET_KEY",
  "UPSTASH_REDIS_REST_TOKEN",
  "INITIAL_OWNER_PASSWORD",
]);

export const SECRET_MASK = "••••••••";

export const DEFAULT_VALUES: Record<ManagedEnvKey, string> = {
  DB_ENABLE_SUPABASE: "true",
  DB_ENABLE_LOCAL_POSTGRES: "false",
  DB_ENABLE_AWS_DB: "false",
  PRIMARY_DB_DRIVER: "supabase",
  NEXT_PUBLIC_API_MODE: "local",
  NEXT_PUBLIC_SUPABASE_URL: "https://servicepro-prod.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.servicepro_anon_public_key",
  SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.servicepro_service_role_secret",
  DATABASE_URL: "postgresql://postgres:servicepro_pass@db.servicepro-prod.supabase.co:5432/postgres",
  SUPABASE_STORAGE_BUCKET: "job-media",
  LOCAL_PG_HOST: "localhost",
  LOCAL_PG_PORT: "5432",
  LOCAL_PG_DATABASE: "servicepro_db",
  LOCAL_PG_USER: "postgres",
  LOCAL_PG_PASSWORD: "",
  LOCAL_PG_POOL_SIZE: "20",
  AWS_DB_TYPE: "rds_postgres",
  AWS_RDS_ENDPOINT: "servicepro-db.cluster-xyz.us-east-1.rds.amazonaws.com",
  AWS_RDS_PORT: "5432",
  AWS_RDS_DATABASE: "servicepro_enterprise",
  AWS_RDS_USER: "awsadmin",
  AWS_RDS_PASSWORD: "",
  AWS_DYNAMODB_TABLE_PREFIX: "servicepro_",

  EMAIL_DRIVER: "aws-ses",
  AWS_SES_REGION: "us-east-1",
  AWS_SES_ACCESS_KEY_ID: "AKIAIOSFODNN7EXAMPLE",
  AWS_SES_SECRET_ACCESS_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  EMAIL_FROM_ADDRESS: "dispatch@servicepro-os.com",
  EMAIL_FROM_NAME: "ServicePro OS Dispatch",
  SMTP_HOST: "email-smtp.us-east-1.amazonaws.com",
  SMTP_PORT: "587",
  SMTP_USER: "dispatch@servicepro-os.com",
  SMTP_PASSWORD: "",
  SMTP_SECURE: "false",
  EMAIL_API_PROVIDER: "resend",
  EMAIL_API_KEY: "",

  AWS_SNS_REGION: "us-east-1",
  AWS_SNS_ACCESS_KEY_ID: "AKIAIOSFODNN7EXAMPLE",
  AWS_SNS_SECRET_ACCESS_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  AWS_SNS_DISPATCH_TOPIC_ARN: "arn:aws:sns:us-east-1:123456789012:emergency-dispatch",
  AWS_SNS_ALERTS_TOPIC_ARN: "arn:aws:sns:us-east-1:123456789012:customer-alerts",
  AWS_SNS_SENDER_ID: "ServicePro",

  SMS_DRIVER: "twilio",
  TWILIO_ACCOUNT_SID: "AC89217491827491827491827491827491",
  TWILIO_AUTH_TOKEN: "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d",
  TWILIO_FROM_NUMBER: "+13055550100",
  TWILIO_MESSAGING_SERVICE_SID: "MG48192048192048192048192048192048",
  TWILIO_VOICE_WEBHOOK_URL: "https://servicepro-os.com/api/twilio/voice",
  SMS_CUSTOM_WEBHOOK_URL: "https://api.sms-aggregator.com/v1/send",
  SMS_CUSTOM_API_KEY: "",

  STRIPE_MODE: "TEST",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_51PServiceProOS2026LiveReadyKey99",
  STRIPE_SECRET_KEY: "sk_test_51PServiceProOS2026SecretVaultKey49aB",
  STRIPE_WEBHOOK_SECRET: "whsec_8f9e7d6c5b4a3f2e1d0c9b8a7f6e5d4c",

  NEXT_PUBLIC_MAPBOX_TOKEN: "pk.eyJ1Ijoic2VydmljZXByby1vcyIsImEiOiJjbTdsb2NrZXIifQ.publicMapToken99",
  MAPBOX_SERVER_TOKEN: "sk.eyJ1Ijoic2VydmljZXByby1vcyIsImEiOiJjbTdsb2NrZXIifQ.serverMatrixToken88",
  NEXT_PUBLIC_GOOGLE_MAPS_KEY: "AIzaSyServiceProOSMapsGeocodeKey2026",

  NEXT_PUBLIC_APP_URL: "https://servicepro-os.com",
  CRON_SECRET: "9f8e7d6c5b4a392817263544536271809f8e7d6c5b4a39281726354453627180",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAAServiceProTurnstileSiteKey",
  TURNSTILE_SECRET_KEY: "0x4AAAAAAAServiceProTurnstileSecretKey",
  UPSTASH_REDIS_REST_URL: "https://us1-servicepro-limiter.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "AX8gASQgServiceProUpstashRedisToken2026",
  ALLOW_DEMO_AUTH: "true",

  INITIAL_OWNER_EMAIL: "owner@servicepro-os.com",
  INITIAL_OWNER_PASSWORD: "ServicePro!Owner2026",
  BUSINESS_NAME: "ServicePro OS Miami",
  DISPATCH_PHONE: "(305) 555-0100",
};

export const ROOT_DIR = process.cwd();
export const ENV_LOCAL_PATH = path.join(ROOT_DIR, ".env.local");
export const ENV_BACKUP_PATH = path.join(ROOT_DIR, ".env.backup");
export const LOCKER_DIR = path.join(ROOT_DIR, ".locker");
export const LOCKER_FILE_PATH = path.join(LOCKER_DIR, "credentials.locker.enc");

export function getVaultKey(): Buffer {
  const machineSeed =
    process.env.LOCKER_MASTER_KEY ||
    "servicepro-os-enterprise-aes-256-gcm-locker-key-2026";
  return crypto.createHash("sha256").update(machineSeed).digest();
}

export function encryptVault(data: Record<string, string>): string {
  const iv = crypto.randomBytes(12);
  const key = getVaultKey();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = JSON.stringify({
    updatedAt: new Date().toISOString(),
    credentials: data,
  });
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return JSON.stringify({
    alg: "AES-256-GCM",
    iv: iv.toString("hex"),
    tag: authTag.toString("hex"),
    payload: encrypted.toString("hex"),
  });
}

export function decryptVault(): Record<string, string> | null {
  try {
    if (!fs.existsSync(LOCKER_FILE_PATH)) return null;
    const raw = JSON.parse(fs.readFileSync(LOCKER_FILE_PATH, "utf8")) as {
      iv: string;
      tag: string;
      payload: string;
    };
    const key = getVaultKey();
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(raw.iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(raw.tag, "hex"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(raw.payload, "hex")),
      decipher.final(),
    ]);
    const parsed = JSON.parse(decrypted.toString("utf8")) as {
      credentials?: Record<string, string>;
    };
    return parsed.credentials ?? null;
  } catch {
    return null;
  }
}

export function parseDotEnvFile(filePath: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return out;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx <= 0) continue;
    const k = trimmed.slice(0, eqIdx).trim();
    let v = trimmed.slice(eqIdx + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

export function loadCurrentCredentials(): Record<ManagedEnvKey, string> {
  const fromVault = decryptVault() ?? {};
  const fromFile = parseDotEnvFile(ENV_LOCAL_PATH);

  const merged = {} as Record<ManagedEnvKey, string>;
  for (const key of MANAGED_KEYS) {
    const val =
      fromFile[key] ??
      fromVault[key] ??
      process.env[key] ??
      DEFAULT_VALUES[key] ??
      "";
    merged[key] = val;
  }
  return merged;
}

export function maskCredentialsForClient(creds: Record<ManagedEnvKey, string>): {
  credentials: Record<ManagedEnvKey, string>;
  secretStatus: Record<string, { configured: boolean; isSecret: boolean }>;
} {
  const masked: Record<ManagedEnvKey, string> = {} as any;
  const status: Record<string, { configured: boolean; isSecret: boolean }> = {};

  for (const key of MANAGED_KEYS) {
    const isSecret = SECRET_KEYS.has(key);
    const rawVal = creds[key] ?? "";
    const hasRealValue =
      rawVal.length > 0 &&
      !rawVal.includes("placeholder") &&
      !rawVal.includes("EXAMPLE");

    status[key] = {
      configured: hasRealValue,
      isSecret,
    };

    if (isSecret) {
      masked[key] = hasRealValue ? SECRET_MASK : "";
    } else {
      masked[key] = rawVal;
    }
  }

  return { credentials: masked, secretStatus: status };
}

export function mergeSubmittedCredentials(
  current: Record<ManagedEnvKey, string>,
  submitted: Partial<Record<string, string>>
): Record<ManagedEnvKey, string> {
  const next = { ...current };

  for (const key of MANAGED_KEYS) {
    const subVal = submitted[key];
    if (subVal === undefined) continue;

    if (SECRET_KEYS.has(key)) {
      if (subVal === SECRET_MASK || subVal.trim() === "") {
        continue;
      }
      if (subVal === "__CLEAR__") {
        next[key] = "";
        continue;
      }
      next[key] = subVal.trim();
    } else {
      next[key] = subVal.trim();
    }
  }

  return next;
}

export function formatEnvFileContent(values: Record<string, string>): string {
  const timestamp = new Date().toISOString();
  return [
    "# ============================================================================",
    "# SERVICEPRO OS — PRODUCTION CONFIGURATION (.ENV LOCKER)",
    `# Last Synchronized: ${timestamp}`,
    "# Managed via Admin Portal -> Cloud Keys & .env Locker (/admin/infrastructure)",
    "# ============================================================================",
    "",
    "# --- 1. DATABASE ARCHITECTURE (3 PLUG-AND-PLAY PROVIDERS) ---",
    `DB_ENABLE_SUPABASE="${values.DB_ENABLE_SUPABASE ?? "true"}"`,
    `DB_ENABLE_LOCAL_POSTGRES="${values.DB_ENABLE_LOCAL_POSTGRES ?? "false"}"`,
    `DB_ENABLE_AWS_DB="${values.DB_ENABLE_AWS_DB ?? "false"}"`,
    `PRIMARY_DB_DRIVER="${values.PRIMARY_DB_DRIVER ?? "supabase"}"`,
    `NEXT_PUBLIC_API_MODE="${values.NEXT_PUBLIC_API_MODE ?? "local"}"`,
    `NEXT_PUBLIC_SUPABASE_URL="${values.NEXT_PUBLIC_SUPABASE_URL ?? ""}"`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY="${values.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""}"`,
    `SUPABASE_SERVICE_ROLE_KEY="${values.SUPABASE_SERVICE_ROLE_KEY ?? ""}"`,
    `DATABASE_URL="${values.DATABASE_URL ?? ""}"`,
    `SUPABASE_STORAGE_BUCKET="${values.SUPABASE_STORAGE_BUCKET ?? "job-media"}"`,
    `LOCAL_PG_HOST="${values.LOCAL_PG_HOST ?? "localhost"}"`,
    `LOCAL_PG_PORT="${values.LOCAL_PG_PORT ?? "5432"}"`,
    `LOCAL_PG_DATABASE="${values.LOCAL_PG_DATABASE ?? "servicepro_db"}"`,
    `LOCAL_PG_USER="${values.LOCAL_PG_USER ?? "postgres"}"`,
    `LOCAL_PG_PASSWORD="${values.LOCAL_PG_PASSWORD ?? ""}"`,
    `LOCAL_PG_POOL_SIZE="${values.LOCAL_PG_POOL_SIZE ?? "20"}"`,
    `AWS_DB_TYPE="${values.AWS_DB_TYPE ?? "rds_postgres"}"`,
    `AWS_RDS_ENDPOINT="${values.AWS_RDS_ENDPOINT ?? ""}"`,
    `AWS_RDS_PORT="${values.AWS_RDS_PORT ?? "5432"}"`,
    `AWS_RDS_DATABASE="${values.AWS_RDS_DATABASE ?? "servicepro_enterprise"}"`,
    `AWS_RDS_USER="${values.AWS_RDS_USER ?? "awsadmin"}"`,
    `AWS_RDS_PASSWORD="${values.AWS_RDS_PASSWORD ?? ""}"`,
    `AWS_DYNAMODB_TABLE_PREFIX="${values.AWS_DYNAMODB_TABLE_PREFIX ?? "servicepro_"}"`,
    "",
    "# --- 2. EMAIL DELIVERY ENGINE (3 OPTIONS: SES / SMTP / CLOUD API) ---",
    `EMAIL_DRIVER="${values.EMAIL_DRIVER ?? "aws-ses"}"`,
    `AWS_SES_REGION="${values.AWS_SES_REGION ?? "us-east-1"}"`,
    `AWS_SES_ACCESS_KEY_ID="${values.AWS_SES_ACCESS_KEY_ID ?? ""}"`,
    `AWS_SES_SECRET_ACCESS_KEY="${values.AWS_SES_SECRET_ACCESS_KEY ?? ""}"`,
    `EMAIL_FROM_ADDRESS="${values.EMAIL_FROM_ADDRESS ?? ""}"`,
    `EMAIL_FROM_NAME="${values.EMAIL_FROM_NAME ?? ""}"`,
    `SMTP_HOST="${values.SMTP_HOST ?? ""}"`,
    `SMTP_PORT="${values.SMTP_PORT ?? "587"}"`,
    `SMTP_USER="${values.SMTP_USER ?? ""}"`,
    `SMTP_PASSWORD="${values.SMTP_PASSWORD ?? ""}"`,
    `SMTP_SECURE="${values.SMTP_SECURE ?? "false"}"`,
    `EMAIL_API_PROVIDER="${values.EMAIL_API_PROVIDER ?? "resend"}"`,
    `EMAIL_API_KEY="${values.EMAIL_API_KEY ?? ""}"`,
    "",
    "# --- 3. PUSH NOTIFICATIONS & EVENT PUB/SUB (AWS SNS) ---",
    `AWS_SNS_REGION="${values.AWS_SNS_REGION ?? "us-east-1"}"`,
    `AWS_SNS_ACCESS_KEY_ID="${values.AWS_SNS_ACCESS_KEY_ID ?? ""}"`,
    `AWS_SNS_SECRET_ACCESS_KEY="${values.AWS_SNS_SECRET_ACCESS_KEY ?? ""}"`,
    `AWS_SNS_DISPATCH_TOPIC_ARN="${values.AWS_SNS_DISPATCH_TOPIC_ARN ?? ""}"`,
    `AWS_SNS_ALERTS_TOPIC_ARN="${values.AWS_SNS_ALERTS_TOPIC_ARN ?? ""}"`,
    `AWS_SNS_SENDER_ID="${values.AWS_SNS_SENDER_ID ?? "ServicePro"}"`,
    "",
    "# --- 4. SMS & VOICE DISPATCH GATEWAY (TWILIO) ---",
    `SMS_DRIVER="${values.SMS_DRIVER ?? "twilio"}"`,
    `TWILIO_ACCOUNT_SID="${values.TWILIO_ACCOUNT_SID ?? ""}"`,
    `TWILIO_AUTH_TOKEN="${values.TWILIO_AUTH_TOKEN ?? ""}"`,
    `TWILIO_FROM_NUMBER="${values.TWILIO_FROM_NUMBER ?? ""}"`,
    `TWILIO_MESSAGING_SERVICE_SID="${values.TWILIO_MESSAGING_SERVICE_SID ?? ""}"`,
    `TWILIO_VOICE_WEBHOOK_URL="${values.TWILIO_VOICE_WEBHOOK_URL ?? ""}"`,
    "",
    "# --- 5. PAYMENT GATEWAY & WEBHOOKS (STRIPE) ---",
    `STRIPE_MODE="${values.STRIPE_SECRET_KEY?.startsWith("sk_live_") ? "LIVE" : "TEST"}"`,
    `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${values.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""}"`,
    `STRIPE_SECRET_KEY="${values.STRIPE_SECRET_KEY ?? ""}"`,
    `STRIPE_WEBHOOK_SECRET="${values.STRIPE_WEBHOOK_SECRET ?? ""}"`,
    "",
    "# --- 6. LIVE GPS FLEET MAPS & GEOCODING (MAPBOX / GOOGLE MAPS) ---",
    `NEXT_PUBLIC_MAPBOX_TOKEN="${values.NEXT_PUBLIC_MAPBOX_TOKEN ?? ""}"`,
    `MAPBOX_SERVER_TOKEN="${values.MAPBOX_SERVER_TOKEN ?? ""}"`,
    `NEXT_PUBLIC_GOOGLE_MAPS_KEY="${values.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ""}"`,
    "",
    "# --- 7. SECURITY, BOT PROTECTION, REDIS RATE-LIMITING & CRON ---",
    `NEXT_PUBLIC_APP_URL="${values.NEXT_PUBLIC_APP_URL ?? "https://servicepro-os.com"}"`,
    `CRON_SECRET="${values.CRON_SECRET ?? ""}"`,
    `NEXT_PUBLIC_TURNSTILE_SITE_KEY="${values.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}"`,
    `TURNSTILE_SECRET_KEY="${values.TURNSTILE_SECRET_KEY ?? ""}"`,
    `UPSTASH_REDIS_REST_URL="${values.UPSTASH_REDIS_REST_URL ?? ""}"`,
    `UPSTASH_REDIS_REST_TOKEN="${values.UPSTASH_REDIS_REST_TOKEN ?? ""}"`,
    `ALLOW_DEMO_AUTH="${values.ALLOW_DEMO_AUTH ?? "false"}"`,
    "",
    "# --- 8. INITIAL OWNER BOOTSTRAP & WHITE-LABEL SYNC ---",
    `INITIAL_OWNER_EMAIL="${values.INITIAL_OWNER_EMAIL ?? ""}"`,
    `INITIAL_OWNER_PASSWORD="${values.INITIAL_OWNER_PASSWORD ?? ""}"`,
    `BUSINESS_NAME="${values.BUSINESS_NAME ?? "ServicePro OS Miami"}"`,
    `DISPATCH_PHONE="${values.DISPATCH_PHONE ?? "(305) 555-0100"}"`,
    "",
  ].join("\n");
}
