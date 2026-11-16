import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../config/env.js';
import { errorResponse } from '../types/envelope.js';

export interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export async function verifyCaptcha(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const requestId = request.id || `req_${Date.now()}`;
  const isEnforced = env.CAPTCHA_ENFORCED === 'true';
  const secretKey = env.CAPTCHA_SECRET_KEY;

  // Extract CAPTCHA token from headers or body
  const body = (request.body as Record<string, any>) || {};
  const captchaToken = (
    (request.headers['cf-turnstile-response'] as string) ||
    (request.headers['x-captcha-token'] as string) ||
    body.captchaToken ||
    body['cf-turnstile-response']
  )?.trim();

  // In non-production or test mode, permit designated test tokens
  if (process.env.NODE_ENV !== 'production') {
    if (captchaToken === 'test-captcha-bypass-token' || captchaToken === 'test-captcha-valid') {
      return;
    }
  }

  // If enforcement is disabled and no token supplied, allow pass-through
  if (!isEnforced && !captchaToken) {
    return;
  }

  // If enforced and no token supplied, fail closed
  if (isEnforced && !captchaToken) {
    return reply.status(400).send(
      errorResponse(
        'CAPTCHA_REQUIRED',
        'Bot detection challenge required. Please provide a valid CAPTCHA verification token.',
        requestId
      )
    );
  }

  // If token is provided but secret key is not configured
  if (!secretKey) {
    if (isEnforced) {
      request.log.error('CAPTCHA verification enforced but CAPTCHA_SECRET_KEY is not configured');
      return reply.status(500).send(
        errorResponse(
          'CAPTCHA_CONFIG_ERROR',
          'Security verification service temporarily unavailable.',
          requestId
        )
      );
    }
    return;
  }

  // Verify against Cloudflare Turnstile API
  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', captchaToken);
    formData.append('remoteip', request.ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!res.ok) {
      request.log.warn({ status: res.status }, 'Turnstile verification server error');
      return reply.status(400).send(
        errorResponse(
          'CAPTCHA_VERIFICATION_FAILED',
          'Anti-bot challenge verification failed. Please try again.',
          requestId
        )
      );
    }

    const data = (await res.json()) as TurnstileVerifyResponse;

    if (!data.success) {
      request.log.warn({ errors: data['error-codes'] }, 'Turnstile verification rejected token');
      return reply.status(400).send(
        errorResponse(
          'CAPTCHA_VERIFICATION_FAILED',
          'Anti-bot verification challenge failed or expired. Please refresh and try again.',
          requestId
        )
      );
    }
  } catch (err: any) {
    request.log.error({ err }, 'Turnstile verification network request failed');
    if (isEnforced) {
      return reply.status(502).send(
        errorResponse(
          'CAPTCHA_SERVICE_UNAVAILABLE',
          'Failed to reach verification gateway. Please try again shortly.',
          requestId
        )
      );
    }
  }
}
