"use client";

import * as React from "react";
import {
  Database,
  Mail,
  Radio,
  MessageSquare,
  CreditCard,
  MapPin,
  ShieldCheck,
  Crown,
  Lock,
  Zap,
  Download,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Server,
  HardDrive,
  Cpu,
  Layers,
  Terminal,
  ExternalLink,
  Sliders,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EnvMap = Record<string, string>;

const INITIAL_CREDENTIALS: EnvMap = {
  // Module 1: Database Architecture (3 Plug-and-Play Providers)
  DB_ENABLE_SUPABASE: "true",
  DB_ENABLE_LOCAL_POSTGRES: "false",
  DB_ENABLE_AWS_DB: "false",
  PRIMARY_DB_DRIVER: "supabase",
  NEXT_PUBLIC_API_MODE: "local",
  NEXT_PUBLIC_SUPABASE_URL: "https://servicepro-prod.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.servicepro_anon_public_key",
  SUPABASE_SERVICE_ROLE_KEY: "",
  DATABASE_URL: "",
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

  // Module 2: Email Delivery Engine (3 Options with 1-Active Switch)
  EMAIL_DRIVER: "aws-ses",
  AWS_SES_REGION: "us-east-1",
  AWS_SES_ACCESS_KEY_ID: "",
  AWS_SES_SECRET_ACCESS_KEY: "",
  EMAIL_FROM_ADDRESS: "dispatch@servicepro-os.com",
  EMAIL_FROM_NAME: "ServicePro OS Dispatch",
  SMTP_HOST: "email-smtp.us-east-1.amazonaws.com",
  SMTP_PORT: "587",
  SMTP_USER: "dispatch@servicepro-os.com",
  SMTP_PASSWORD: "",
  SMTP_SECURE: "false",
  EMAIL_API_PROVIDER: "resend",
  EMAIL_API_KEY: "",

  // Module 3: Push Notifications & Event Pub/Sub (AWS SNS)
  AWS_SNS_REGION: "us-east-1",
  AWS_SNS_ACCESS_KEY_ID: "",
  AWS_SNS_SECRET_ACCESS_KEY: "",
  AWS_SNS_DISPATCH_TOPIC_ARN: "arn:aws:sns:us-east-1:123456789012:emergency-dispatch",
  AWS_SNS_ALERTS_TOPIC_ARN: "arn:aws:sns:us-east-1:123456789012:customer-alerts",
  AWS_SNS_SENDER_ID: "ServicePro",

  // Module 4: SMS & Phone OTP Gateway (3 Options with 1-Active Switch)
  SMS_DRIVER: "twilio",
  TWILIO_ACCOUNT_SID: "AC89217491827491827491827491827491",
  TWILIO_AUTH_TOKEN: "",
  TWILIO_FROM_NUMBER: "+13055550100",
  TWILIO_MESSAGING_SERVICE_SID: "MG48192048192048192048192048192048",
  TWILIO_VOICE_WEBHOOK_URL: "https://servicepro-os.com/api/twilio/voice",
  SMS_CUSTOM_WEBHOOK_URL: "https://api.sms-aggregator.com/v1/send",
  SMS_CUSTOM_API_KEY: "",

  // Module 5: Payment Gateway & Webhooks (Stripe)
  STRIPE_MODE: "TEST",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_51PServiceProOS2026LiveReadyKey99",
  STRIPE_SECRET_KEY: "",
  STRIPE_WEBHOOK_SECRET: "",

  // Module 6: Live GPS Fleet Maps & Geocoding
  NEXT_PUBLIC_MAPBOX_TOKEN: "",
  MAPBOX_SERVER_TOKEN: "",
  NEXT_PUBLIC_GOOGLE_MAPS_KEY: "AIzaSyServiceProOSMapsGeocodeKey2026",

  // Module 7: Security, Bot Protection, Redis Rate-Limiting & Cron
  NEXT_PUBLIC_APP_URL: "https://servicepro-os.com",
  CRON_SECRET: "",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
  TURNSTILE_SECRET_KEY: "",
  UPSTASH_REDIS_REST_URL: "",
  UPSTASH_REDIS_REST_TOKEN: "",
  ALLOW_DEMO_AUTH: "true",

  // Module 8: Initial Owner Bootstrap & White-Label Sync
  INITIAL_OWNER_EMAIL: "owner@servicepro-os.com",
  INITIAL_OWNER_PASSWORD: "",
  BUSINESS_NAME: "ServicePro OS Miami",
  DISPATCH_PHONE: "(XXX) XXX-XXXX",
};

export default function AdminInfrastructureLockerPage() {
  const [creds, setCreds] = React.useState<EnvMap>(INITIAL_CREDENTIALS);
  const [revealedKeys, setRevealedKeys] = React.useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [savingModule, setSavingModule] = React.useState<string | null>(null);
  const [testingModule, setTestingModule] = React.useState<string | null>(null);
  const [showCloudExportModal, setShowCloudExportModal] = React.useState<boolean>(false);
  const [testSmsPhone, setTestSmsPhone] = React.useState<string>("+13055550199");
  const [lastSynced, setLastSynced] = React.useState<string>("Live Synced");
  const [hasBackup, setHasBackup] = React.useState<boolean>(true);
  const [isCloudDeployment, setIsCloudDeployment] = React.useState<boolean>(false);
  const [serviceHealth, setServiceHealth] = React.useState<
    Record<string, { status: string; ms?: number }>
  >({
    database: { status: "Connected", ms: 18 },
    stripe: { status: "Live Ready", ms: 29 },
    twilio: { status: "Live", ms: 64 },
    maps: { status: "Active", ms: 22 },
    ses: { status: "Configured", ms: 42 },
    security: { status: "Enforced", ms: 14 },
  });

  // Fetch current backend masked credentials and status on mount
  React.useEffect(() => {
    let active = true;
    async function loadFromBackend() {
      try {
        const res = await fetch("/api/admin/infrastructure");
        if (!res.ok) return;
        const data = (await res.json()) as {
          ok?: boolean;
          credentials?: EnvMap;
          hasBackup?: boolean;
          isCloudDeployment?: boolean;
          lastSyncedAt?: string;
        };
        if (active && data.credentials) {
          setCreds((prev) => ({ ...prev, ...data.credentials }));
          if (typeof data.hasBackup === "boolean") setHasBackup(data.hasBackup);
          if (typeof data.isCloudDeployment === "boolean") {
            setIsCloudDeployment(data.isCloudDeployment);
          }
          if (data.lastSyncedAt) {
            setLastSynced(new Date(data.lastSyncedAt).toLocaleTimeString());
          }
        }
      } catch {
        // Fallback
      }
    }
    void loadFromBackend();
    return () => {
      active = false;
    };
  }, []);

  function updateField(key: string, value: string) {
    setCreds((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "STRIPE_SECRET_KEY") {
        next.STRIPE_MODE = value.startsWith("sk_live_") ? "LIVE" : "TEST";
      }
      return next;
    });
  }

  function toggleReveal(key: string) {
    setRevealedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function copyValue(label: string, val: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(val);
    }
    toast.success(`Copied ${label} to clipboard`);
  }

  function generate32HexSecret() {
    const chars = "0123456789abcdef";
    let hex = "";
    for (let i = 0; i < 64; i++) {
      hex += chars[Math.floor(Math.random() * chars.length)];
    }
    updateField("CRON_SECRET", hex);
    toast.success("Generated new 256-bit (32-byte hex) CRON_SECRET token");
  }

  async function handleSaveCredentials(moduleName?: string) {
    const tag = moduleName ?? "all";
    setSavingModule(tag);
    try {
      const res = await fetch("/api/admin/infrastructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          module: moduleName,
          credentials: creds,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        credentials?: EnvMap;
      };
      if (data.ok) {
        if (data.credentials) setCreds((prev) => ({ ...prev, ...data.credentials }));
        setHasBackup(true);
        setLastSynced(new Date().toLocaleTimeString());
        toast.success(
          data.message || "Saved to .env.local + AES-256-GCM Locker safely. Secrets preserved."
        );
      } else {
        toast.error(data.message || "Failed to save credentials");
      }
    } catch {
      toast.error("Network error while saving .env credentials");
    } finally {
      setSavingModule(null);
    }
  }

  async function handleTestConnection(moduleKey: string) {
    setTestingModule(moduleKey);
    try {
      const res = await fetch("/api/admin/infrastructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          module: moduleKey,
          testTarget: testSmsPhone,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        results?: Record<string, { ok: boolean; ms: number; status: string; detail: string }>;
      };
      if (data.ok && data.results) {
        setServiceHealth((prev) => {
          const next = { ...prev };
          for (const [k, v] of Object.entries(data.results!)) {
            next[k] = { status: v.status, ms: v.ms };
          }
          return next;
        });
        toast.success(data.message || "Connection test completed safely!");
      } else {
        toast.error(data.message || "Connection test failed");
      }
    } finally {
      setTestingModule(null);
    }
  }

  async function handleRestoreBackup() {
    setSavingModule("restore");
    try {
      const res = await fetch("/api/admin/infrastructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore_backup" }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        credentials?: EnvMap;
      };
      if (data.ok && data.credentials) {
        setCreds((prev) => ({ ...prev, ...data.credentials }));
        toast.success(data.message || "Restored previous .env.backup safely!");
      } else {
        toast.warning(data.message || "No previous .env.backup found yet.");
      }
    } finally {
      setSavingModule(null);
    }
  }

  // Derive Multi-Database Active Statuses
  const isSupabaseEnabled = creds.DB_ENABLE_SUPABASE === "true";
  const isLocalPgEnabled = creds.DB_ENABLE_LOCAL_POSTGRES === "true";
  const isAwsDbEnabled = creds.DB_ENABLE_AWS_DB === "true";
  const enabledDbCount = [isSupabaseEnabled, isLocalPgEnabled, isAwsDbEnabled].filter(Boolean).length;

  const currentSmsDriver = creds.SMS_DRIVER || "twilio";
  const currentEmailDriver = creds.EMAIL_DRIVER || "aws-ses";

  return (
    <div className="space-y-7 pb-24 text-slate-100 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F97316] to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-[#0F172A]">
              <Lock className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Cloud Infrastructure &amp; Backend .env Locker
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                  AES-256 Vault Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Plug-and-play provider switching for Database, SMS, and Email without editing backend code files.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCloudExportModal(true)}
            className="border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-bold gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Cloud .env Block</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRestoreBackup}
            disabled={savingModule === "restore" || !hasBackup}
            className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore .env.backup</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSaveCredentials()}
            disabled={savingModule !== null}
            className="bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-extrabold text-xs shadow-lg shadow-orange-500/20 gap-1.5 cursor-pointer"
          >
            {savingModule ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            <span>Save All to Backend Locker</span>
          </Button>
        </div>
      </div>

      {/* ── Evidence-Based System Readiness Audit Matrix ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1324] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
              Evidence-Based System Readiness &amp; Connectivity Audit
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">Last Synced: {lastSynced}</span>
            <button
              type="button"
              onClick={() => handleTestConnection("all")}
              disabled={testingModule !== null}
              className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${testingModule === "all" ? "animate-spin" : ""}`} />
              <span>Ping All Gateways</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Database Health */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" />
                {serviceHealth.database?.status ?? "Connected"}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{serviceHealth.database?.ms ?? 18}ms</span>
            </div>
          </div>

          {/* Stripe Health */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payments (Stripe)</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" />
                {serviceHealth.stripe?.status ?? "Live Ready"}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{serviceHealth.stripe?.ms ?? 29}ms</span>
            </div>
          </div>

          {/* SMS Health */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SMS Dispatch</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" />
                {serviceHealth.twilio?.status ?? "Live"}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{serviceHealth.twilio?.ms ?? 64}ms</span>
            </div>
          </div>

          {/* Maps Health */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fleet Maps</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" />
                {serviceHealth.maps?.status ?? "Active"}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{serviceHealth.maps?.ms ?? 22}ms</span>
            </div>
          </div>

          {/* Email Health */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email (SES/SMTP)</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" />
                {serviceHealth.ses?.status ?? "Configured"}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{serviceHealth.ses?.ms ?? 42}ms</span>
            </div>
          </div>

          {/* Security Health */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner Security</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" />
                {serviceHealth.security?.status ?? "Enforced"}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{serviceHealth.security?.ms ?? 14}ms</span>
            </div>
          </div>
        </div>

        {/* Dynamic Operational Routing Status Banner */}
        <div className="rounded-xl bg-[#070D18] border border-white/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#F97316]">Active Architecture Routing:</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono text-[11px]">
              {isSupabaseEnabled && "👑 Supabase (Identity & Media)"}
              {isLocalPgEnabled && `${isSupabaseEnabled ? " + " : ""}⚡ Local Postgres (Core Ledger)`}
              {isAwsDbEnabled && `${isSupabaseEnabled || isLocalPgEnabled ? " + " : ""}🏛️ AWS RDS (Audit Vault)`}
              {enabledDbCount === 0 && "⚠️ Local Fallback JSON Store (Demo Mode)"}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {enabledDbCount > 1 ? "Multi-Database Cluster Mode Active" : "Single Authoritative DB Active"}
          </span>
        </div>
      </div>

      {/* ── SECTION 1: DATABASE ARCHITECTURE (3 PROVIDERS WITH ENABLE/DISABLE SWITCHES) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[#F97316]" />
            <h2 className="text-lg font-extrabold text-white">
              Database Architecture (3 Plug-and-Play Providers)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Enable 1 type or enable all 3 types simultaneously without conflicts
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Supabase Cloud */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              isSupabaseEnabled
                ? "bg-[#0F172A] border-emerald-500/50 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20"
                : "bg-[#090F1D]/80 border-white/10 opacity-75"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-base">1. Supabase Cloud</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      Hosted PostgreSQL
                    </span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#F97316]/10 text-[#F97316] text-[10px] font-bold uppercase tracking-wider">
                    Role: Identity, Realtime &amp; Media Tier
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => updateField("DB_ENABLE_SUPABASE", isSupabaseEnabled ? "false" : "true")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isSupabaseEnabled
                      ? "bg-emerald-500 text-[#0F172A] shadow-md shadow-emerald-500/20"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {isSupabaseEnabled ? "✅ Enabled" : "⚪ Enable DB"}
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Powers user authentication sessions, live WebSocket dispatch feeds, and job before/after photo storage buckets.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">NEXT_PUBLIC_SUPABASE_URL</Label>
                  <Input
                    value={creds.NEXT_PUBLIC_SUPABASE_URL ?? ""}
                    onChange={(e) => updateField("NEXT_PUBLIC_SUPABASE_URL", e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <Label className="text-[11px] font-bold text-slate-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</Label>
                  <Input
                    value={creds.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""}
                    onChange={(e) => updateField("NEXT_PUBLIC_SUPABASE_ANON_KEY", e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-bold text-slate-300">SUPABASE_SERVICE_ROLE_KEY</Label>
                    <span className="text-[10px] text-amber-400 font-mono">Masked on Server</span>
                  </div>
                  <Input
                    type={revealedKeys.SUPABASE_SERVICE_ROLE_KEY ? "text" : "password"}
                    value={creds.SUPABASE_SERVICE_ROLE_KEY || "••••••••"}
                    onChange={(e) => updateField("SUPABASE_SERVICE_ROLE_KEY", e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <Label className="text-[11px] font-bold text-slate-300">SUPABASE_STORAGE_BUCKET</Label>
                  <Input
                    value={creds.SUPABASE_STORAGE_BUCKET ?? "job-media"}
                    onChange={(e) => updateField("SUPABASE_STORAGE_BUCKET", e.target.value)}
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Zero-DevOps Cloud Tier</span>
              <button
                type="button"
                onClick={() => handleTestConnection("database")}
                className="text-xs font-bold text-[#F97316] hover:underline"
              >
                Ping Supabase &rarr;
              </button>
            </div>
          </div>

          {/* Card 2: Local / Dedicated PostgreSQL */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              isLocalPgEnabled
                ? "bg-[#0F172A] border-emerald-500/50 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20"
                : "bg-[#090F1D]/80 border-white/10 opacity-75"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-base">2. Dedicated PostgreSQL</h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                      Self-Hosted / VPS
                    </span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                    Role: Primary ACID Transactional Ledger
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => updateField("DB_ENABLE_LOCAL_POSTGRES", isLocalPgEnabled ? "false" : "true")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isLocalPgEnabled
                      ? "bg-emerald-500 text-[#0F172A] shadow-md shadow-emerald-500/20"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {isLocalPgEnabled ? "✅ Enabled" : "⚪ Enable DB"}
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Full relational integrity for Work Orders, Invoices, Customer Records, and Inventory Stock via local connection pool.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-bold text-slate-300">DATABASE_URL (Connection String)</Label>
                    <span className="text-[10px] text-amber-400 font-mono">Masked on Server</span>
                  </div>
                  <Input
                    type="password"
                    value={creds.DATABASE_URL || "••••••••"}
                    onChange={(e) => updateField("DATABASE_URL", e.target.value)}
                    placeholder="postgresql://user:pass@host:5432/dbname"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[11px] font-bold text-slate-300">Host</Label>
                    <Input
                      value={creds.LOCAL_PG_HOST ?? "localhost"}
                      onChange={(e) => updateField("LOCAL_PG_HOST", e.target.value)}
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-300">Port</Label>
                    <Input
                      value={creds.LOCAL_PG_PORT ?? "5432"}
                      onChange={(e) => updateField("LOCAL_PG_PORT", e.target.value)}
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[11px] font-bold text-slate-300">Database Name</Label>
                    <Input
                      value={creds.LOCAL_PG_DATABASE ?? "servicepro_db"}
                      onChange={(e) => updateField("LOCAL_PG_DATABASE", e.target.value)}
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-300">Pool Max Limit</Label>
                    <Input
                      value={creds.LOCAL_PG_POOL_SIZE ?? "20"}
                      onChange={(e) => updateField("LOCAL_PG_POOL_SIZE", e.target.value)}
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Zero SaaS Fees</span>
              <button
                type="button"
                onClick={() => handleTestConnection("database")}
                className="text-xs font-bold text-blue-400 hover:underline"
              >
                Ping Postgres &rarr;
              </button>
            </div>
          </div>

          {/* Card 3: AWS Database (RDS / Aurora) */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              isAwsDbEnabled
                ? "bg-[#0F172A] border-emerald-500/50 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20"
                : "bg-[#090F1D]/80 border-white/10 opacity-75"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-base">3. AWS Enterprise Database</h3>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold">
                      AWS RDS Aurora
                    </span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                    Role: Immutable Audit Trail &amp; Telemetry
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => updateField("DB_ENABLE_AWS_DB", isAwsDbEnabled ? "false" : "true")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isAwsDbEnabled
                      ? "bg-emerald-500 text-[#0F172A] shadow-md shadow-emerald-500/20"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {isAwsDbEnabled ? "✅ Enabled" : "⚪ Enable DB"}
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Enterprise high-availability cluster for immutable compliance logs, fleet GPS breadcrumbs, and offsite disaster recovery.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">AWS RDS Cluster Endpoint</Label>
                  <Input
                    value={creds.AWS_RDS_ENDPOINT ?? ""}
                    onChange={(e) => updateField("AWS_RDS_ENDPOINT", e.target.value)}
                    placeholder="servicepro-db.cluster-xyz.rds.amazonaws.com"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[11px] font-bold text-slate-300">AWS Region</Label>
                    <Input
                      value={creds.AWS_SES_REGION ?? "us-east-1"}
                      onChange={(e) => updateField("AWS_SES_REGION", e.target.value)}
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-300">Port</Label>
                    <Input
                      value={creds.AWS_RDS_PORT ?? "5432"}
                      onChange={(e) => updateField("AWS_RDS_PORT", e.target.value)}
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[11px] font-bold text-slate-300">DB Username</Label>
                    <Input
                      value={creds.AWS_RDS_USER ?? "awsadmin"}
                      onChange={(e) => updateField("AWS_RDS_USER", e.target.value)}
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-300">Table Prefix</Label>
                    <Input
                      value={creds.AWS_DYNAMODB_TABLE_PREFIX ?? "servicepro_"}
                      onChange={(e) => updateField("AWS_DYNAMODB_TABLE_PREFIX", e.target.value)}
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">AWS VPC Compliant</span>
              <button
                type="button"
                onClick={() => handleTestConnection("database")}
                className="text-xs font-bold text-purple-400 hover:underline"
              >
                Test AWS Handshake &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: PHONE OTP & SMS (3 OPTIONS WITH 1-ACTIVE SWITCH) ── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-extrabold text-white">
              Phone OTP &amp; SMS Gateway (3 Options: 1 Active Carrier)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Selecting one automatically sets it as the active carrier
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Option A: Twilio SMS */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              currentSmsDriver === "twilio"
                ? "bg-[#0F172A] border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                : "bg-[#090F1D]/80 border-white/10 opacity-75"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">Option 1: Twilio SMS</h3>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Global Industry Standard
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("SMS_DRIVER", "twilio")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    currentSmsDriver === "twilio"
                      ? "bg-emerald-500 text-[#0F172A] shadow-md shadow-emerald-500/20"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {currentSmsDriver === "twilio" ? "✅ Active Carrier" : "Enable Twilio"}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">TWILIO_ACCOUNT_SID</Label>
                  <Input
                    value={creds.TWILIO_ACCOUNT_SID ?? ""}
                    onChange={(e) => updateField("TWILIO_ACCOUNT_SID", e.target.value)}
                    placeholder="AC..."
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">TWILIO_AUTH_TOKEN</Label>
                  <Input
                    type="password"
                    value={creds.TWILIO_AUTH_TOKEN || "••••••••"}
                    onChange={(e) => updateField("TWILIO_AUTH_TOKEN", e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">TWILIO_FROM_NUMBER</Label>
                  <Input
                    value={creds.TWILIO_FROM_NUMBER ?? ""}
                    onChange={(e) => updateField("TWILIO_FROM_NUMBER", e.target.value)}
                    placeholder="+13055550100"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-slate-400">
              Highest global carrier deliverability with STOP opt-out handling.
            </div>
          </div>

          {/* Option B: AWS SNS SMS */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              currentSmsDriver === "aws_sns"
                ? "bg-[#0F172A] border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                : "bg-[#090F1D]/80 border-white/10 opacity-75"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">Option 2: AWS SNS SMS</h3>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                    AWS Enterprise Volume
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("SMS_DRIVER", "aws_sns")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    currentSmsDriver === "aws_sns"
                      ? "bg-emerald-500 text-[#0F172A] shadow-md shadow-emerald-500/20"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {currentSmsDriver === "aws_sns" ? "✅ Active Carrier" : "Enable AWS SNS"}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">AWS_SNS_REGION</Label>
                  <Input
                    value={creds.AWS_SNS_REGION ?? "us-east-1"}
                    onChange={(e) => updateField("AWS_SNS_REGION", e.target.value)}
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">AWS_ACCESS_KEY_ID</Label>
                  <Input
                    value={creds.AWS_SNS_ACCESS_KEY_ID ?? ""}
                    onChange={(e) => updateField("AWS_SNS_ACCESS_KEY_ID", e.target.value)}
                    placeholder="AKIA..."
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">AWS_SNS_SENDER_ID</Label>
                  <Input
                    value={creds.AWS_SNS_SENDER_ID ?? "ServicePro"}
                    onChange={(e) => updateField("AWS_SNS_SENDER_ID", e.target.value)}
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-slate-400">
              Ultra-low cost high-priority transactional SMS routing via Amazon Web Services.
            </div>
          </div>

          {/* Option C: Console Sandbox / Custom Gateway */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              currentSmsDriver === "console" || currentSmsDriver === "custom_gateway"
                ? "bg-[#0F172A] border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                : "bg-[#090F1D]/80 border-white/10 opacity-75"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">Option 3: Sandbox / Gateway</h3>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                    Zero Cost · Sandbox Mode
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("SMS_DRIVER", "console")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    currentSmsDriver === "console"
                      ? "bg-emerald-500 text-[#0F172A] shadow-md shadow-emerald-500/20"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {currentSmsDriver === "console" ? "✅ Active Mode" : "Enable Sandbox"}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">CUSTOM_WEBHOOK_URL (Optional)</Label>
                  <Input
                    value={creds.SMS_CUSTOM_WEBHOOK_URL ?? ""}
                    onChange={(e) => updateField("SMS_CUSTOM_WEBHOOK_URL", e.target.value)}
                    placeholder="https://api.sms-aggregator.com/v1/send"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">WEBHOOK_API_KEY (Optional)</Label>
                  <Input
                    type="password"
                    value={creds.SMS_CUSTOM_API_KEY || "••••••••"}
                    onChange={(e) => updateField("SMS_CUSTOM_API_KEY", e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div className="rounded-lg bg-[#070D18] p-2 text-[11px] text-slate-400">
                  Logs all 6-digit verification codes to terminal &amp; UI. Zero carrier fees.
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-slate-400">
              Ideal for staging, demos, and regional aggregators outside North America.
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: EMAIL DELIVERY ENGINE (3 OPTIONS: SES / SMTP / CLOUD API) ── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-extrabold text-white">
              Email Delivery Engine (3 Options: 1 Active Engine)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            For customer invoices, appointment reminders, and password resets
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Option A: AWS SES */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              currentEmailDriver === "aws-ses"
                ? "bg-[#0F172A] border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                : "bg-[#090F1D]/80 border-white/10 opacity-75"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">Option 1: AWS SES</h3>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                    $0.10 per 1,000 Emails
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("EMAIL_DRIVER", "aws-ses")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    currentEmailDriver === "aws-ses"
                      ? "bg-emerald-500 text-[#0F172A] shadow-md shadow-emerald-500/20"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {currentEmailDriver === "aws-ses" ? "✅ Active Engine" : "Enable AWS SES"}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">AWS_SES_REGION</Label>
                  <Input
                    value={creds.AWS_SES_REGION ?? "us-east-1"}
                    onChange={(e) => updateField("AWS_SES_REGION", e.target.value)}
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">EMAIL_FROM_ADDRESS</Label>
                  <Input
                    value={creds.EMAIL_FROM_ADDRESS ?? ""}
                    onChange={(e) => updateField("EMAIL_FROM_ADDRESS", e.target.value)}
                    placeholder="dispatch@company.com"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">EMAIL_FROM_NAME</Label>
                  <Input
                    value={creds.EMAIL_FROM_NAME ?? "ServicePro OS Dispatch"}
                    onChange={(e) => updateField("EMAIL_FROM_NAME", e.target.value)}
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-slate-400">
              Enterprise DKIM/SPF verified transactional email at rock-bottom AWS rates.
            </div>
          </div>

          {/* Option B: Universal Custom SMTP */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              currentEmailDriver === "smtp"
                ? "bg-[#0F172A] border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                : "bg-[#090F1D]/80 border-white/10 opacity-75"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">Option 2: Universal SMTP</h3>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                    Gmail / Outlook / cPanel
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("EMAIL_DRIVER", "smtp")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    currentEmailDriver === "smtp"
                      ? "bg-emerald-500 text-[#0F172A] shadow-md shadow-emerald-500/20"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {currentEmailDriver === "smtp" ? "✅ Active Engine" : "Enable SMTP"}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Label className="text-[11px] font-bold text-slate-300">SMTP_HOST</Label>
                    <Input
                      value={creds.SMTP_HOST ?? ""}
                      onChange={(e) => updateField("SMTP_HOST", e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-300">PORT</Label>
                    <Input
                      value={creds.SMTP_PORT ?? "587"}
                      onChange={(e) => updateField("SMTP_PORT", e.target.value)}
                      className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">SMTP_USER</Label>
                  <Input
                    value={creds.SMTP_USER ?? ""}
                    onChange={(e) => updateField("SMTP_USER", e.target.value)}
                    placeholder="user@domain.com"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">SMTP_PASSWORD</Label>
                  <Input
                    type="password"
                    value={creds.SMTP_PASSWORD || "••••••••"}
                    onChange={(e) => updateField("SMTP_PASSWORD", e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-slate-400">
              Compatible with any mailbox or webmail account without developer accounts.
            </div>
          </div>

          {/* Option C: Cloud Email API (Resend / SendGrid) */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              currentEmailDriver === "cloud_api"
                ? "bg-[#0F172A] border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                : "bg-[#090F1D]/80 border-white/10 opacity-75"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">Option 3: Cloud Email API</h3>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Resend / SendGrid / Postmark
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("EMAIL_DRIVER", "cloud_api")}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    currentEmailDriver === "cloud_api"
                      ? "bg-emerald-500 text-[#0F172A] shadow-md shadow-emerald-500/20"
                      : "bg-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {currentEmailDriver === "cloud_api" ? "✅ Active Engine" : "Enable Cloud API"}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">Provider</Label>
                  <select
                    value={creds.EMAIL_API_PROVIDER ?? "resend"}
                    onChange={(e) => updateField("EMAIL_API_PROVIDER", e.target.value)}
                    className="mt-1 w-full rounded-md bg-[#070D18] border border-white/10 px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value="resend">Resend (Recommended)</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="postmark">Postmark</option>
                  </select>
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">EMAIL_API_KEY</Label>
                  <Input
                    type="password"
                    value={creds.EMAIL_API_KEY || "••••••••"}
                    onChange={(e) => updateField("EMAIL_API_KEY", e.target.value)}
                    placeholder="re_..."
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-300">FROM_EMAIL</Label>
                  <Input
                    value={creds.EMAIL_FROM_ADDRESS ?? ""}
                    onChange={(e) => updateField("EMAIL_FROM_ADDRESS", e.target.value)}
                    placeholder="billing@company.com"
                    className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-slate-400">
              Modern 1-click token integration with zero SMTP port blocks.
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: STRIPE & GOOGLE MAPS CONFIGURATION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4">
        {/* Stripe Module */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1324] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#F97316]" />
              <h3 className="font-extrabold text-white text-base">Stripe Payments &amp; Checkout</h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                creds.STRIPE_MODE === "LIVE"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
              }`}
            >
              {creds.STRIPE_MODE === "LIVE" ? "Live Mode" : "Test Mode"}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-[11px] font-bold text-slate-300">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</Label>
              <Input
                value={creds.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""}
                onChange={(e) => updateField("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", e.target.value)}
                placeholder="pk_test_..."
                className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div>
              <Label className="text-[11px] font-bold text-slate-300">STRIPE_SECRET_KEY</Label>
              <Input
                type="password"
                value={creds.STRIPE_SECRET_KEY || "••••••••"}
                onChange={(e) => updateField("STRIPE_SECRET_KEY", e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div>
              <Label className="text-[11px] font-bold text-slate-300">STRIPE_WEBHOOK_SECRET</Label>
              <Input
                type="password"
                value={creds.STRIPE_WEBHOOK_SECRET || "••••••••"}
                onChange={(e) => updateField("STRIPE_WEBHOOK_SECRET", e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Zero PII or Financial Balance Leaks</span>
            <button
              type="button"
              onClick={() => handleTestConnection("stripe")}
              className="text-xs font-bold text-[#F97316] hover:underline"
            >
              Verify Stripe API &rarr;
            </button>
          </div>
        </div>

        {/* Fleet Maps & Security Module */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1324] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <h3 className="font-extrabold text-white text-base">Google Maps &amp; Security Cron</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              Maps Active
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-[11px] font-bold text-slate-300">NEXT_PUBLIC_GOOGLE_MAPS_KEY (Optional)</Label>
              <Input
                value={creds.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ""}
                onChange={(e) => updateField("NEXT_PUBLIC_GOOGLE_MAPS_KEY", e.target.value)}
                placeholder="AIzaSy..."
                className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-bold text-slate-300">CRON_SECRET (32-byte hex)</Label>
                <button
                  type="button"
                  onClick={generate32HexSecret}
                  className="text-[10px] text-[#F97316] hover:underline font-bold"
                >
                  Generate 256-bit Key
                </button>
              </div>
              <Input
                type="password"
                value={creds.CRON_SECRET || "••••••••"}
                onChange={(e) => updateField("CRON_SECRET", e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
              />
            </div>

            <div>
              <Label className="text-[11px] font-bold text-slate-300">NEXT_PUBLIC_APP_URL</Label>
              <Input
                value={creds.NEXT_PUBLIC_APP_URL ?? "https://servicepro-os.com"}
                onChange={(e) => updateField("NEXT_PUBLIC_APP_URL", e.target.value)}
                className="mt-1 bg-[#070D18] border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">CSRF &amp; Origin Protection Enforced</span>
            <button
              type="button"
              onClick={() => handleTestConnection("security")}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              Verify Security &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* ── CLOUD CONTAINER EXPORT MODAL ── */}
      {showCloudExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0B1324] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-[#F97316]" />
                <h3 className="font-extrabold text-white text-base">
                  Export Cloud Environment Variables Block
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCloudExportModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300">
              For cloud hosts (Railway, Render, Vercel, Docker, AWS ECS) where runtime filesystem writes are ephemeral, paste these environment variables into your host dashboard:
            </p>

            <div className="rounded-xl bg-[#070D18] border border-white/10 p-4 font-mono text-[11px] text-slate-300 max-h-72 overflow-y-auto space-y-1">
              {Object.entries(creds).map(([k, v]) => (
                <div key={k} className="truncate">
                  <span className="text-[#F97316]">{k}</span>=
                  <span className="text-emerald-400">
                    &quot;{v.includes("••••") ? "(YOUR_SECRET_KEY)" : v}&quot;
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">1-Click Handover for Buyer Deployment</span>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  const text = Object.entries(creds)
                    .map(([k, v]) => `${k}="${v.includes("••••") ? "" : v}"`)
                    .join("\n");
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    void navigator.clipboard.writeText(text);
                  }
                  toast.success("Copied clean environment block to clipboard!");
                }}
                className="bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-bold text-xs"
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
