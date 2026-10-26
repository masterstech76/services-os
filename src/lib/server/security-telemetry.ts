/**
 * ServicePro OS — Centralized Security Telemetry & SIEM Dispatcher
 * Dispatches real-time structured security alert events to webhooks (Slack, PagerDuty,
 * Datadog, Sentry) and immutable audit ledgers upon detecting attacks or lockouts.
 */

export type SecurityAlertSeverity = "CRITICAL" | "HIGH" | "WARNING" | "INFO";

export type SecurityAlertCode =
  | "SECURITY_LOCKOUT"
  | "BRUTE_FORCE_ATTEMPT"
  | "CSRF_ORIGIN_MISMATCH"
  | "ROLE_SPOOFING_ATTEMPT"
  | "UNAUTHORIZED_ADMIN_MUTATION"
  | "WEBHOOK_SIGNATURE_FAILURE"
  | "RECOVERY_KEY_FAILURE"
  | "CONSENSUS_QUORUM_BREACH";

export interface SecurityAlertEvent {
  code: SecurityAlertCode;
  severity: SecurityAlertSeverity;
  message: string;
  ip: string;
  endpoint?: string;
  method?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

// In-memory ring buffer for the most recent 100 security telemetry events
const recentSecurityEvents: SecurityAlertEvent[] = [];

/**
 * Emits a structured security alert event.
 * Dispatches to external SIEM / webhook if configured, and logs to security console.
 */
export async function emitSecurityAlert(event: SecurityAlertEvent): Promise<void> {
  const enrichedEvent: SecurityAlertEvent = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  };

  // 1. Maintain in-memory ring buffer
  recentSecurityEvents.unshift(enrichedEvent);
  if (recentSecurityEvents.length > 100) {
    recentSecurityEvents.pop();
  }

  // 2. Structured JSON log to stdout/stderr for log drains (Datadog, CloudWatch, LogDNA)
  const logPrefix = `[SIEM-ALERT:${enrichedEvent.severity}]`;
  if (enrichedEvent.severity === "CRITICAL" || enrichedEvent.severity === "HIGH") {
    console.error(logPrefix, JSON.stringify(enrichedEvent));
  } else {
    console.warn(logPrefix, JSON.stringify(enrichedEvent));
  }

  // 3. Dispatch to external webhook (Slack / PagerDuty / Sentry / Datadog) if configured
  const webhookUrl = process.env.SECURITY_ALERT_WEBHOOK_URL;
  if (webhookUrl && typeof fetch !== "undefined") {
    try {
      // Fire-and-forget asynchronous alert delivery with 3s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "ServicePro-Security-Monitor/1.0",
        },
        body: JSON.stringify({
          text: `🚨 [${enrichedEvent.severity}] ${enrichedEvent.code}: ${enrichedEvent.message} from IP: ${enrichedEvent.ip}`,
          event: enrichedEvent,
        }),
        signal: controller.signal,
      })
        .catch(() => {
          // Fail silent so alert dispatch failure never interrupts request execution
        })
        .finally(() => clearTimeout(timeoutId));
    } catch {
      // Ignore network errors in fire-and-forget notification
    }
  }
}

/**
 * Retrieves the recent security events buffer (used by admin audit dashboard)
 */
export function getRecentSecurityAlerts(limit = 50): SecurityAlertEvent[] {
  return recentSecurityEvents.slice(0, limit);
}
