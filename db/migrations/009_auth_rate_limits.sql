-- =============================================================================
-- Migration 009: Authentication Rate Limiting Table
-- Purpose: Track authentication attempts for rate limiting and brute-force protection
-- Fixes: Missing table for rateLimiter.ts service, deterministic window buckets,
--        atomic upserts, account-level and IP-level isolation, least-privilege grants
-- =============================================================================

-- 1. Create table in public schema
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id SERIAL PRIMARY KEY,
  rate_key VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  email VARCHAR(255),
  user_id VARCHAR(255),
  attempt_type VARCHAR(50) NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique constraint on rate_key + attempt_type + deterministic window bucket for atomic upserts
  CONSTRAINT uniq_auth_rate_limits_key_window UNIQUE (rate_key, attempt_type, window_start)
);

-- Indexes for public.auth_rate_limits
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_key_type_time
  ON auth_rate_limits(rate_key, attempt_type, last_attempt_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_ip_type_time
  ON auth_rate_limits(ip_address, attempt_type, last_attempt_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_user_type_time
  ON auth_rate_limits(user_id, attempt_type, last_attempt_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_email_type_time
  ON auth_rate_limits(email, attempt_type, last_attempt_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_created_at
  ON auth_rate_limits(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_locked_until
  ON auth_rate_limits(locked_until) WHERE locked_until IS NOT NULL;

-- 2. Create in staging schema if staging schema exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'staging') THEN
    CREATE TABLE IF NOT EXISTS staging.auth_rate_limits (
      id SERIAL PRIMARY KEY,
      rate_key VARCHAR(255) NOT NULL,
      ip_address VARCHAR(45),
      email VARCHAR(255),
      user_id VARCHAR(255),
      attempt_type VARCHAR(50) NOT NULL,
      window_start TIMESTAMPTZ NOT NULL,
      attempt_count INTEGER NOT NULL DEFAULT 1,
      last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      locked_until TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT uniq_staging_auth_rate_limits_key_window UNIQUE (rate_key, attempt_type, window_start)
    );

    CREATE INDEX IF NOT EXISTS idx_staging_auth_rate_limits_key_type_time
      ON staging.auth_rate_limits(rate_key, attempt_type, last_attempt_at DESC);
    CREATE INDEX IF NOT EXISTS idx_staging_auth_rate_limits_ip_type_time
      ON staging.auth_rate_limits(ip_address, attempt_type, last_attempt_at DESC);
    CREATE INDEX IF NOT EXISTS idx_staging_auth_rate_limits_user_type_time
      ON staging.auth_rate_limits(user_id, attempt_type, last_attempt_at DESC);
    CREATE INDEX IF NOT EXISTS idx_staging_auth_rate_limits_email_type_time
      ON staging.auth_rate_limits(email, attempt_type, last_attempt_at DESC);
    CREATE INDEX IF NOT EXISTS idx_staging_auth_rate_limits_created_at
      ON staging.auth_rate_limits(created_at);
    CREATE INDEX IF NOT EXISTS idx_staging_auth_rate_limits_locked_until
      ON staging.auth_rate_limits(locked_until) WHERE locked_until IS NOT NULL;
  END IF;
END $$;

-- 3. Least-privilege role permissions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'azaroth_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON auth_rate_limits TO azaroth_app;
    IF to_regclass('auth_rate_limits_id_seq') IS NOT NULL THEN
      GRANT USAGE, SELECT ON SEQUENCE auth_rate_limits_id_seq TO azaroth_app;
    END IF;
    IF to_regclass('staging.auth_rate_limits') IS NOT NULL THEN
      GRANT SELECT, INSERT, UPDATE, DELETE ON staging.auth_rate_limits TO azaroth_app;
      IF to_regclass('staging.auth_rate_limits_id_seq') IS NOT NULL THEN
        GRANT USAGE, SELECT ON SEQUENCE staging.auth_rate_limits_id_seq TO azaroth_app;
      END IF;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'azaroth_public_ro') THEN
    REVOKE ALL ON auth_rate_limits FROM azaroth_public_ro;
    IF to_regclass('staging.auth_rate_limits') IS NOT NULL THEN
      REVOKE ALL ON staging.auth_rate_limits FROM azaroth_public_ro;
    END IF;
  END IF;
END $$;
