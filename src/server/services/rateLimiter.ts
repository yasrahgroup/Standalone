/**
 * Rate Limiting Service for Authentication
 * 
 * Uses the Neon database to track authentication attempts and enforce rate limits.
 * This ensures rate limiting works reliably across Vercel serverless instances.
 * 
 * Policies:
 * - Login attempts: 5 per 15 minutes per IP
 * - Account protection: 10 failed logins per hour per email/IP
 * - Lockout: 10 failed logins triggers 30-minute lockout
 * - Password change: 3 per hour per user
 * - Successful login resets failed attempts for IP and email
 * - 24-hour retention cleanup
 */

import { executeQuery, executeQueryOne, tbl } from '../core/database';
import { logger } from '../core/logger';
import { normalizeIp } from '../core/security';

export interface RateLimitCheck {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  reason?: string;
}

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const PASSWORD_CHANGE_LIMIT = 3;
const PASSWORD_CHANGE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_FAILED_ATTEMPTS = 10;
const FAILED_ATTEMPT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const LOCKOUT_DURATION_MINUTES = 30;

function getHourlyBucket(date: Date = new Date()): Date {
  return new Date(Math.floor(date.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000));
}

function get15MinBucket(date: Date = new Date()): Date {
  return new Date(Math.floor(date.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
}

/**
 * Check if a login attempt is allowed for the given IP and email
 */
export async function checkLoginRateLimit(
  rawIpAddress: string,
  rawEmail?: string
): Promise<RateLimitCheck> {
  const ipAddress = normalizeIp(rawIpAddress);
  const email = rawEmail?.trim().toLowerCase();
  const now = new Date();

  try {
    const ipKey = `ip:${ipAddress}`;
    const emailKey = email ? `email:${email}` : null;

    // 1. Check for active lockout (from failed attempts in the last hour)
    const lockoutRow = await executeQueryOne<{ locked_until: string }>(
      `SELECT locked_until
       FROM ${tbl('auth_rate_limits')}
       WHERE rate_key = $1
         AND attempt_type = 'failed_login'
         AND locked_until IS NOT NULL
         AND locked_until > NOW()
       ORDER BY locked_until DESC
       LIMIT 1`,
      [ipKey]
    );

    if (lockoutRow?.locked_until && new Date(lockoutRow.locked_until) > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(lockoutRow.locked_until),
        reason: 'Too many failed attempts. Temporarily locked out. Please try again later.',
      };
    }

    if (emailKey) {
      const emailLockoutRow = await executeQueryOne<{ locked_until: string }>(
        `SELECT locked_until
         FROM ${tbl('auth_rate_limits')}
         WHERE rate_key = $1
           AND attempt_type = 'failed_login'
           AND locked_until IS NOT NULL
           AND locked_until > NOW()
         ORDER BY locked_until DESC
         LIMIT 1`,
        [emailKey]
      );

      if (emailLockoutRow?.locked_until && new Date(emailLockoutRow.locked_until) > now) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(emailLockoutRow.locked_until),
          reason: 'Too many failed attempts on this account. Temporarily locked. Please try again later.',
        };
      }
    }

    // 2. Check 15-minute login rate limit for the IP
    const fifteenMinAgo = new Date(now.getTime() - LOGIN_WINDOW_MS);
    const countRow = await executeQueryOne<{ total_count: string }>(
      `SELECT COALESCE(SUM(attempt_count), 0) AS total_count
       FROM ${tbl('auth_rate_limits')}
       WHERE rate_key = $1
         AND attempt_type = 'login'
         AND window_start >= $2`,
      [ipKey, fifteenMinAgo]
    );

    const count = parseInt(countRow?.total_count || '0', 10);

    if (count >= LOGIN_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(now.getTime() + LOGIN_WINDOW_MS),
        reason: 'Too many login attempts. Please try again in a few minutes.',
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, LOGIN_LIMIT - count),
      resetAt: new Date(now.getTime() + LOGIN_WINDOW_MS),
    };
  } catch (error) {
    // Fail-open on database errors with audit logging
    logger.warn('rate_limiter.check_failed_fallback_open', {
      meta: { ipAddress, email, error: error instanceof Error ? error.message : 'Unknown error' },
    });
    return {
      allowed: true,
      remaining: LOGIN_LIMIT,
      resetAt: new Date(Date.now() + LOGIN_WINDOW_MS),
    };
  }
}

/**
 * Record a login attempt (successful or failed) with atomic upsert
 */
export async function recordLoginAttempt(
  rawIpAddress: string,
  rawEmail: string | undefined,
  success: boolean
): Promise<void> {
  const ipAddress = normalizeIp(rawIpAddress);
  const email = rawEmail?.trim().toLowerCase();
  const ipKey = `ip:${ipAddress}`;
  const emailKey = email ? `email:${email}` : null;

  try {
    if (success) {
      // Successful login resets failed attempts, active lockouts, and recent login counters for this IP & email
      await executeQuery(
        `UPDATE ${tbl('auth_rate_limits')}
         SET attempt_count = 0, locked_until = NULL, updated_at = NOW()
         WHERE (rate_key = $1 ${emailKey ? 'OR rate_key = $2' : ''})
           AND (attempt_type = 'failed_login' OR attempt_type = 'login')`,
        emailKey ? [ipKey, emailKey] : [ipKey]
      );
    } else {
      // Failed login: atomic increment for IP in current 1-hour window bucket
      const windowStart = getHourlyBucket();

      // IP failed attempt atomic upsert
      await executeQuery(
        `INSERT INTO ${tbl('auth_rate_limits')}
           (rate_key, ip_address, email, attempt_type, window_start, attempt_count, last_attempt_at, locked_until, updated_at)
         VALUES ($1, $2, $3, 'failed_login', $4, 1, NOW(), NULL, NOW())
         ON CONFLICT (rate_key, attempt_type, window_start)
         DO UPDATE SET
           attempt_count = ${tbl('auth_rate_limits')}.attempt_count + 1,
           last_attempt_at = NOW(),
           updated_at = NOW(),
           locked_until = CASE
             WHEN ${tbl('auth_rate_limits')}.attempt_count + 1 >= $5
             THEN NOW() + ($6 || ' minutes')::interval
             ELSE ${tbl('auth_rate_limits')}.locked_until
           END`,
        [ipKey, ipAddress, email || null, windowStart, MAX_FAILED_ATTEMPTS, LOCKOUT_DURATION_MINUTES]
      );

      // Account/email failed attempt atomic upsert if email is provided
      if (emailKey) {
        await executeQuery(
          `INSERT INTO ${tbl('auth_rate_limits')}
             (rate_key, ip_address, email, attempt_type, window_start, attempt_count, last_attempt_at, locked_until, updated_at)
           VALUES ($1, $2, $3, 'failed_login', $4, 1, NOW(), NULL, NOW())
           ON CONFLICT (rate_key, attempt_type, window_start)
           DO UPDATE SET
             attempt_count = ${tbl('auth_rate_limits')}.attempt_count + 1,
             last_attempt_at = NOW(),
             updated_at = NOW(),
             locked_until = CASE
               WHEN ${tbl('auth_rate_limits')}.attempt_count + 1 >= $5
               THEN NOW() + ($6 || ' minutes')::interval
               ELSE ${tbl('auth_rate_limits')}.locked_until
             END`,
          [emailKey, ipAddress, email, windowStart, MAX_FAILED_ATTEMPTS, LOCKOUT_DURATION_MINUTES]
        );
      }

      // Also record in 15-minute login bucket to enforce the 5/15min login limit
      const loginWindowStart = get15MinBucket();
      await executeQuery(
        `INSERT INTO ${tbl('auth_rate_limits')}
           (rate_key, ip_address, email, attempt_type, window_start, attempt_count, last_attempt_at, updated_at)
         VALUES ($1, $2, $3, 'login', $4, 1, NOW(), NOW())
         ON CONFLICT (rate_key, attempt_type, window_start)
         DO UPDATE SET
           attempt_count = ${tbl('auth_rate_limits')}.attempt_count + 1,
           last_attempt_at = NOW(),
           updated_at = NOW()`,
        [ipKey, ipAddress, email || null, loginWindowStart]
      );
    }
  } catch (error) {
    logger.warn('rate_limiter.record_attempt_failed', {
      meta: { ipAddress, email, success, error: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
}

/**
 * Check if a password change is allowed for the given user (3 per hour)
 */
export async function checkPasswordChangeRateLimit(userId: string): Promise<RateLimitCheck> {
  try {
    const userKey = `user:${userId}`;
    const oneHourAgo = new Date(Date.now() - PASSWORD_CHANGE_WINDOW_MS);

    const countRow = await executeQueryOne<{ total_count: string }>(
      `SELECT COALESCE(SUM(attempt_count), 0) AS total_count
       FROM ${tbl('auth_rate_limits')}
       WHERE rate_key = $1
         AND attempt_type = 'password_change'
         AND window_start >= $2`,
      [userKey, oneHourAgo]
    );

    const count = parseInt(countRow?.total_count || '0', 10);

    if (count >= PASSWORD_CHANGE_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + PASSWORD_CHANGE_WINDOW_MS),
        reason: 'Too many password change attempts. Please try again later.',
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, PASSWORD_CHANGE_LIMIT - count),
      resetAt: new Date(Date.now() + PASSWORD_CHANGE_WINDOW_MS),
    };
  } catch (error) {
    logger.warn('rate_limiter.password_check_failed', {
      meta: { userId, error: error instanceof Error ? error.message : 'Unknown error' },
    });
    return {
      allowed: true,
      remaining: PASSWORD_CHANGE_LIMIT,
      resetAt: new Date(Date.now() + PASSWORD_CHANGE_WINDOW_MS),
    };
  }
}

/**
 * Record a password change attempt with atomic upsert
 */
export async function recordPasswordChangeAttempt(userId: string): Promise<void> {
  try {
    const userKey = `user:${userId}`;
    const windowStart = getHourlyBucket();

    await executeQuery(
      `INSERT INTO ${tbl('auth_rate_limits')}
         (rate_key, user_id, attempt_type, window_start, attempt_count, last_attempt_at, updated_at)
       VALUES ($1, $2, 'password_change', $3, 1, NOW(), NOW())
       ON CONFLICT (rate_key, attempt_type, window_start)
       DO UPDATE SET
         attempt_count = ${tbl('auth_rate_limits')}.attempt_count + 1,
         last_attempt_at = NOW(),
         updated_at = NOW()`,
      [userKey, userId, windowStart]
    );
  } catch (error) {
    logger.warn('rate_limiter.record_password_change_failed', {
      meta: { userId, error: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
}

/**
 * Clean up old rate limit records older than 24 hours (periodic cron/reconcile)
 */
export async function cleanupOldRateLimitRecords(): Promise<number> {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const rows = await executeQuery<{ id: number }>(
      `DELETE FROM ${tbl('auth_rate_limits')}
       WHERE created_at < $1
       RETURNING id`,
      [cutoff]
    );
    return rows.length;
  } catch (error) {
    logger.warn('rate_limiter.cleanup_failed', {
      meta: { error: error instanceof Error ? error.message : 'Unknown error' },
    });
    return 0;
  }
}
