import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load root and local .env files
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(v => parseInt(v, 10)).default('3000'),
  HOST: z.string().default('0.0.0.0'),
  APP_BASE_URL: z.string().url().default('http://localhost:3000'),
  
  // Database Pool
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/servicepro_os'),
  DB_POOL_MAX: z.string().transform(v => parseInt(v, 10)).default('20'),
  
  // JWT Cryptographic Secrets
  JWT_ACCESS_SECRET: z.string().min(32).default('servicepro_os_super_secure_jwt_access_secret_key_minimum_32_characters_long_for_entropy'),
  JWT_REFRESH_SECRET: z.string().min(32).default('servicepro_os_super_secure_jwt_refresh_secret_key_minimum_32_characters_long_for_entropy'),
  JWT_ACCESS_EXPIRY_SECONDS: z.string().transform(v => parseInt(v, 10)).default('900'), // 15 mins
  JWT_REFRESH_EXPIRY_DAYS: z.string().transform(v => parseInt(v, 10)).default('30'), // 30 days
  
  // Sensitive Data Encryption at Rest (AES-256-GCM - 32 bytes hex)
  APP_ENCRYPTION_KEY: z.string().default('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  
  // Turnkey Installer Setup
  INITIAL_ADMIN_BOOTSTRAP_SECRET: z.string().min(16).default('turnkey_bootstrap_setup_token_enterprise'),
  
  // External Provider Credentials (Optional during development / self-hosting)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_PHONE: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SES_FROM_EMAIL: z.string().default('support@serviceproos.com'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[Configuration Error] Invalid environment variables:');
  console.error(parsed.error.format());
  throw new Error('Environment configuration validation failed');
}

export const env = parsed.data;
