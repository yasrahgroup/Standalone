# Azaroth Tech-Hive Staging Security Remediation Report

**Date**: November 6, 2026  
**Auditor**: Devin (Senior Application Security Engineer review)  
**Scope**: Security remediation for staging dual-deployment architecture  
**Branch**: staging  
**Status**: BLOCKED — code remediation verified, provider-side permissions and rate-limit table unverified

---

## Executive Summary

All P0 (critical) code-level security vulnerabilities identified in the initial audit have been remediated: CORS wildcard vulnerabilities are fixed and authentication now uses a database-backed rate limiting service. However, the final code-level verification pass (November 6, 2026) identified **material gaps that must be resolved before staging deployment**:

1. **`auth_rate_limits` table has no migration** — the table does not exist in `db/migrations/001–008`, and the DDL in `DATABASE_PERMISSION_VERIFICATION.sql` is commented out and incompatible with the `ON CONFLICT` clause used by the rate limiter. Until the table is created with the correct constraints, every rate-limit database call fails and the service **fails open** — meaning login rate limiting is effectively non-functional.
2. **Rate limiter is not atomic and can be bypassed** — counter updates use a non-atomic SELECT-then-INSERT pattern, the `ON CONFLICT` target can never match (`created_at` is `NOW()` per call), the client IP is taken from the spoofable leftmost `X-Forwarded-For` value, and a successful login does not actually reset failed-attempt tracking.
3. **Provider-side permissions remain UNVERIFIED** — Neon read-only role enforcement and Cloudflare R2 token/bucket isolation cannot be confirmed from code. Automated tests verify code paths only; they do not prove provider enforcement.

**Overall Staging Readiness**: **NOT READY — BLOCKED**

**Critical Blockers**: 3
- B-NEW-1: `auth_rate_limits` migration missing / incompatible DDL (rate limiting non-functional)
- B-NEW-2: Rate limiter concurrency + IP-spoofing bypasses (brute-force exposure)
- B-NEW-3: Provider permission evidence absent (Neon DB roles, Cloudflare R2)

**High-Priority Issues**: 1 (development-mode localhost CORS substring match — not exploitable in production builds, but violates the exact-hostname requirement)

**Remaining Risks**: 4 (documented below)

All automated tests pass (80/80), lint and typecheck are clean, and both builds succeed — but automated tests do not cover the database rate limiter (no `auth_rate_limits` table in test scope) and cannot verify provider-side permissions.

---

## Issues from Original Audit

### Issue B1: Authentication CORS Allows Wildcard Vercel.app Origins

**Severity**: HIGH  
**Status**: FIXED  
**Affected File**: `api-cms/auth/[...path].ts`

**Root Cause**:
The authentication CORS configuration used substring matching with `origin.includes('vercel.app')` which allowed ANY Vercel deployment to access authentication endpoints.

**Remediation Implemented**:
- Removed wildcard `vercel.app` substring matching
- Removed `origin === '*'` fallback
- Implemented exact origin comparison against CMS staging URL: `https://azaroth-tech-hive-cms-testing.vercel.app`
- Added development environment check to allow localhost/127.0.0.1 only when `NODE_ENV === 'development'`
- Ensured credentialed requests never receive wildcard `Access-Control-Allow-Origin`

**Before**:
```typescript
const isAllowedOrigin =
  origin === '*' ||
  origin.includes('localhost') ||
  origin.includes('127.0.0.1') ||
  origin.includes('azaroth-techhive.com') ||
  origin.includes('vercel.app'); // ⚠️ WILDCARD
```

**After**:
```typescript
const cmsStagingOrigin = 'https://azaroth-tech-hive-cms-testing.vercel.app';
const isDevelopment = process.env.NODE_ENV === 'development';

const isAllowedOrigin =
  origin === cmsStagingOrigin ||
  (isDevelopment && (origin?.includes('localhost') || origin?.includes('127.0.0.1')));
```

**Test Results**: ✅ PASS - Updated test to verify staging origin is accepted

**Residual finding**: the development-mode localhost check still uses substring matching (`origin?.includes('localhost')`), verified bypassable by origins such as `https://localhost.evil.com` when `NODE_ENV=development`. Not exploitable on Vercel (`NODE_ENV=production`) — see CORS-DEV-1 in the Final Verification section.

---

### Issue B2: Content API CORS Allows Wildcard Vercel.app Origins

**Severity**: MEDIUM  
**Status**: FIXED  
**Affected Files**: `api-public/content.ts`, `api-cms/content.ts`

**Root Cause**:
Both content API implementations used substring matching with `origin.includes('vercel.app')` which could enable unauthorized data scraping from any Vercel deployment.

**Remediation Implemented**:
- Removed wildcard `vercel.app` substring matching from both files
- Implemented exact origin comparison against public staging URL: `https://azaroth-tech-hive-test.vercel.app`
- Added development environment check for localhost
- Ensured only authorized staging origin receives permissive CORS headers

**Before**:
```typescript
if (origin === publicSiteUrl || 
    origin?.includes('localhost') || 
    origin?.includes('127.0.0.1') ||
    origin?.includes('vercel.app')) { // ⚠️ WILDCARD
```

**After**:
```typescript
const publicSiteUrl = process.env.PUBLIC_SITE_URL || 'https://azaroth-tech-hive-test.vercel.app';
const isDevelopment = process.env.NODE_ENV === 'development';

const isAllowedOrigin =
  origin === publicSiteUrl ||
  (isDevelopment && (origin?.includes('localhost') || origin?.includes('127.0.0.1')));
```

**Test Results**: ✅ PASS - Content API remains read-only and accessible only from authorized origin. Note: disallowed origins still receive `Access-Control-Allow-Origin: <publicSiteUrl>` (fallback value, no credentials) — low risk for a public read-only endpoint; see Final Verification for the full matrix.

---

### Issue B3: Database Read-Only Permissions Not Verified

**Severity**: HIGH  
**Status**: UNVERIFIED (requires manual action)  
**Affected File**: `.env.public.example`

**Root Cause**:
Cannot verify Neon database role permissions without provider access. The role is named `readonly` but actual permissions cannot be confirmed.

**Remediation Implemented**:
Created comprehensive SQL verification guide in `DATABASE_PERMISSION_VERIFICATION.sql` with:
- Step-by-step queries to verify staging database isolation
- Queries to list and verify role permissions
- Specific checks for read-only role (SELECT only, no INSERT/UPDATE/DELETE)
- Security checklist for manual verification
- Test queries to attempt write operations (should fail)

**Manual Action Required**:
1. Open Neon SQL Editor
2. Run queries from `DATABASE_PERMISSION_VERIFICATION.sql`
3. Verify all checklist items pass
4. Document verified permissions

**Verification Status**: BLOCKED - Requires project owner to execute SQL verification

---

### Issue B4: R2 Read-Only Permissions Not Verified

**Severity**: HIGH  
**Status**: UNVERIFIED (requires manual action)  
**Affected File**: `.env.public.example`

**Root Cause**:
Cannot verify Cloudflare R2 bucket policies and API token permissions without provider access.

**Remediation Implemented**:
Created comprehensive verification guide in `R2_PERMISSION_VERIFICATION.md` with:
- Step-by-step Cloudflare dashboard navigation
- Bucket configuration verification steps
- API token permission verification
- Instructions to test write access from public deployment (should fail)
- Security checklist for manual verification
- Troubleshooting guide for common issues
- Instructions for creating new restricted tokens if needed

**Manual Action Required**:
1. Log into Cloudflare dashboard
2. Follow steps in `R2_PERMISSION_VERIFICATION.md`
3. Verify all checklist items pass
4. Document verified permissions

**Verification Status**: BLOCKED - Requires project owner to execute verification

---

### Issue B5: TypeScript Compilation Errors

**Severity**: CRITICAL  
**Status**: FIXED  
**Affected Files**: `server.ts`, `src/server/worker.ts`

**Root Cause**:
References to deleted `api/media/file/[id].ts` file remained in development server and Cloudflare Worker entry points.

**Remediation Implemented**:
- Removed import from `server.ts` line 15
- Removed route handler from `server.ts` line 141
- Removed import from `src/server/worker.ts` line 15
- Removed route handler from `src/server/worker.ts` line 127

**Test Results**: ✅ PASS - TypeScript compilation succeeds

---

### Issue B6: Bundle Size Warning

**Severity**: LOW  
**Status**: NOT APPLICABLE (optimization for production)  
**Affected File**: Build output

**Root Cause**:
Main bundle exceeds 500 kB after minification (2,237.74 kB, 600.93 kB gzipped).

**Remediation**:
No action taken for staging. This is a performance optimization for production deployment and does not affect functionality or security.

**Recommendation**: Implement code splitting for admin routes before production deployment.

---

## Additional Remediation: Rate Limiting Implementation

### P1 - Authentication Rate Limiting

**Severity**: HIGH  
**Status**: IMPLEMENTED — VERIFICATION FAILED (see findings below)  
**New Files Created**: `src/server/services/rateLimiter.ts`

**Root Cause**:
Original implementation used in-memory rate limiting which does not work reliably across Vercel serverless instances.

**Remediation Implemented**:
Created database-backed rate limiting service with:
- Login rate limit: 5 attempts per 15 minutes per IP
- Password change rate limit: 3 attempts per hour per user
- Failed login tracking: 10 failures per hour triggers 30-minute lockout
- Automatic cleanup of old records (24 hours)
- Fail-open behavior on database errors to prevent denial of service

**Implementation Details**:
- Uses Neon PostgreSQL for persistent tracking across serverless instances
- Stores rate limit data in `auth_rate_limits` table
- Tracks IP address, email, user ID, attempt type, count, timestamps
- Supports lockout mechanism for brute-force protection
- Includes cleanup function for cron job integration

**Files Modified**:
- `src/server/services/authService.ts`: Integrated rate limiting into login and password change flows
- Removed in-memory rate limiting map
- Added rate limit checks before authentication operations
- Added attempt recording for successful and failed operations

**Rate Limiting Strategy**:
- Storage: Neon PostgreSQL database (persistent across serverless instances)
- Fail-safe: Fail-open on database errors to prevent denial of service
- Lockout: Temporary IP-based lockout after excessive failed attempts
- Cleanup: Automated cleanup of old records via cron

---

## Final Code-Level Verification — Rate Limiter (November 6, 2026)

The following findings were verified by direct code inspection and live request simulation. They supersede the earlier "FIXED / PASS" assessment for rate limiting.

### Finding RL-1: `auth_rate_limits` migration does not exist — BLOCKER

- `db/migrations/001_roles_and_schema.sql` through `008_enquiry_status_workflow.sql` contain **no** `CREATE TABLE` for `auth_rate_limits`.
- `DATABASE_PERMISSION_VERIFICATION.sql` (Step 6) contains only a **commented-out** `CREATE TABLE` — it is not part of the migration sequence and has never been executed as a migration.
- The documented DDL also **lacks the unique constraint** required by the application's `ON CONFLICT (ip_address, attempt_type, created_at)` clause (see RL-3). Even if executed verbatim, every `recordLoginAttempt` call would raise PostgreSQL error `42P10` (no unique/exclusion constraint matching `ON CONFLICT`).
- **Impact**: Until a correct migration is created and applied, `checkLoginRateLimit` throws on every login, is caught, and returns `allowed: true` (fail-open). **Login rate limiting is non-functional.** The same applies to password-change rate limiting.
- **Required action**: Create migration `009_auth_rate_limits.sql` (or amend the verification SQL into a real migration) with a proper unique constraint, e.g. `UNIQUE (ip_address, attempt_type, window_bucket)` or a fixed-window bucket column — not `created_at`, which changes every call.

### Finding RL-2: Counter updates are not atomic — HIGH

`recordLoginAttempt` performs `SELECT attempt_count ... LIMIT 1` followed by `INSERT ... ON CONFLICT DO UPDATE`. Two concurrent login attempts can both read the same count and both write `count+1`, under-counting attempts — parallel brute-force requests defeat the limit.

Additionally, the `ON CONFLICT` target includes `created_at`, which is set to `NOW()` on every call. Timestamps differ per call, so genuine conflicts essentially never occur; each attempt inserts a new row. Combined with RL-1's missing constraint, the upsert is broken in both directions.

**Required fix**: Use an atomic upsert keyed on a deterministic window bucket, e.g.:

```sql
INSERT INTO auth_rate_limits (ip_address, attempt_type, window_start, attempt_count, last_attempt_at, locked_until)
VALUES ($1, 'failed_login', date_trunc('hour', now()), 1, now(), NULL)
ON CONFLICT (ip_address, attempt_type, window_start)
DO UPDATE SET attempt_count = auth_rate_limits.attempt_count + 1,
              last_attempt_at = now(),
              locked_until = CASE WHEN auth_rate_limits.attempt_count + 1 >= 10
                                  THEN now() + interval '30 minutes' ELSE auth_rate_limits.locked_until END
RETURNING attempt_count, locked_until;
```

### Finding RL-3: IP extraction trusts spoofable `X-Forwarded-For` — HIGH

`api*/auth/[...path].ts` extracts the client IP as:

```typescript
request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
request.headers.get('cf-connecting-ip') || '127.0.0.1'
```

- `split(',')[0]` returns the **leftmost** XFF entry — the value supplied by the client. An attacker can send a rotating `X-Forwarded-For` header and each request appears to originate from a different IP, bypassing the per-IP limit entirely.
- On Vercel, the edge appends the real client IP to XFF, so the **rightmost** entry (or `x-real-ip` / `x-vercel-forwarded-for`) is the trustworthy value — provided exactly one trusted proxy hop is assumed.
- `cf-connecting-ip` is a Cloudflare header; on Vercel it is client-spoofable and must not be trusted as a fallback.
- The Express router copy (`src/server/node/authAndCmsRouter.ts` line 272) uses the raw `x-forwarded-for` header verbatim as the rate-limit key — same spoofing issue, plus the whole comma-joined string becomes the key.
- **Required fix**: Derive IP from `x-vercel-forwarded-for`/`x-real-ip` first, then the **rightmost** XFF entry, and normalize (trim, IPv6 canonicalization). Never trust leftmost XFF or `cf-connecting-ip` on Vercel.

### Finding RL-4: Successful login does not reset failed-attempt tracking — MEDIUM

`recordLoginAttempt(ip, email, true)` writes a row with `attempt_type='login'` and `attempt_count=0`, but the failed-attempt query filters `attempt_type='failed_login'`. Prior `failed_login` rows remain in the 1-hour window, so the next failure resumes the old count (e.g., 9 failures → success → 1 failure = count 10 → lockout). The intended "successful login resets tracking" behavior is not achieved.

### Finding RL-5: Lockout window mismatch and unfiltered attempt type — MEDIUM

- The lockout check filters `last_attempt_at > now() - 15 minutes` (login window), while failed attempts accumulate over 1 hour and `locked_until` lasts 30 minutes. A lockout is only observable for ~15 minutes after the last attempt — effective lockout is roughly half the documented duration.
- The lockout `SELECT` does not filter `attempt_type`, so the newest row of any type for the IP can mask an older active `failed_login` lockout (low practical risk because blocked attempts write no rows, but the query should be type-scoped for correctness).

### Finding RL-6: Cleanup is safe but never scheduled — LOW

`cleanupOldRateLimitRecords` deletes rows older than 24 hours — safely beyond all windows (15 min / 1 h / 30 min), so it cannot delete active lockouts. However, **no caller exists**: it is not wired into `api-cms/internal/reconcile.ts`, any cron, or startup path. The table will grow unbounded.

### Finding RL-7: Email parameter accepted but unused — LOW

`checkLoginRateLimit(ip, email)` never uses `email` in any query — limiting is IP-only despite the documented "per IP/email" policy. Per-email limiting would additionally protect against distributed (multi-IP) credential stuffing against one account.

### Finding RL-8: Fail-open trade-off — ACCEPTABLE FOR STAGING, NOT FOR PRODUCTION

Both check functions return `allowed: true` on any database error. During a Neon outage or misconfiguration, **all brute-force protection is silently disabled** while logins may also fail downstream — the failure mode is invisible except for `console.error` output.

**Assessment**: Fail-open preserves availability but converts a database incident into an unbounded brute-force window. For a short-lived staging environment behind exact-origin CORS and non-public auth endpoints, the residual risk is moderate and acceptable **only if** staging is not exposed to untrusted networks and the window is short. For production, recommend fail-closed on `/api/auth/*` (return 503) or an edge/WAF rate limit (e.g., Vercel Firewall rules) as a compensating control, plus alerting on rate-limiter errors.

**Recommendation**: Keep fail-open for staging; add a `RATE_LIMIT_FAIL_MODE` env switch before production and alert on `Rate limit check failed` log events.

### Finding RL-9: Dead duplicate login path — LOW

`src/server/node/authAndCmsRouter.ts` contains a second, independent login implementation with an in-memory `Map` limiter (15/min/IP) that bypasses the database rate limiter entirely. `createAuthAndCmsRouter` has **no importers** — it is dead code. The live path for Vercel, `server.ts`, and `src/server/worker.ts` is `api*/auth/[...path].ts` → `authService.handleLogin` → `rateLimiter.ts`. The dead router should be removed or clearly marked deprecated to prevent future re-wiring of an unprotected path.

### Finding RL-10: Log hygiene — PASS

Reviewed all rate-limiter and auth logging: no passwords, session tokens, TOTP secrets, or backup codes are logged. `auth_service.rate_limit_exceeded` logs `ip`, `email`, and `reason` — PII in warn logs is acceptable for security auditing but should be retained under the project's log-retention policy.

### Rate Limiter Verification Summary

| Check | Result |
|---|---|
| `auth_rate_limits` migration exists | ❌ FAIL — no migration; DDL commented out and incompatible |
| Table readiness verifiable | ❌ UNVERIFIED — requires Neon evidence (Step 6 of verification SQL) |
| Atomic counter increments | ❌ FAIL — SELECT-then-INSERT race + broken ON CONFLICT key |
| Parallel-attempt bypass resistance | ❌ FAIL — non-atomic + spoofable IP key |
| Proxy-header handling | ❌ FAIL — trusts leftmost XFF / cf-connecting-ip |
| Email/IP normalization | ⚠️ PARTIAL — email normalized (`trim().toLowerCase()`); IP not normalized; email unused in queries |
| Lockout expiration | ⚠️ PARTIAL — works but effective duration ~15 min, not 30 min; unfiltered attempt_type |
| Success resets failed tracking | ❌ FAIL — failed_login rows persist (RL-4) |
| Cleanup safety | ✅ PASS — 24 h retention > all windows; but never scheduled (RL-6) |
| Fail-open behavior | ⚠️ DOCUMENTED — acceptable staging, not production (RL-8) |
| Log sensitivity | ✅ PASS — no secrets logged |

**Rate limiting verdict: NOT DEPLOY-READY.** The service is correctly architected (database-backed, serverless-safe) but is non-functional until RL-1 is fixed, and bypassable until RL-2/RL-3 are fixed.

---

## Files Modified

### Modified Files

1. **`api-cms/auth/[...path].ts`**
   - Fixed CORS to use exact origin comparison
   - Removed wildcard `vercel.app` matching
   - Added development environment check

2. **`api-public/content.ts`**
   - Fixed CORS to use exact origin comparison
   - Removed wildcard `vercel.app` matching
   - Added development environment check

3. **`api-cms/content.ts`**
   - Fixed CORS to use exact origin comparison
   - Removed wildcard `vercel.app` matching
   - Added development environment check

4. **`src/server/services/authService.ts`**
   - Removed in-memory rate limiting
   - Integrated database-backed rate limiting
   - Added rate limit checks for login and password change
   - Added attempt recording

5. **`tests/login-auth-flow.test.ts`**
   - Updated CORS tests to use staging URLs
   - Changed origin from `https://azaroth-techhive.com` to `https://azaroth-tech-hive-cms-testing.vercel.app`

### New Files Created

1. **`src/server/services/rateLimiter.ts`**
   - Database-backed rate limiting service
   - Login rate limiting with IP tracking
   - Password change rate limiting with user tracking
   - Failed attempt lockout mechanism
   - Automatic cleanup function

2. **`DATABASE_PERMISSION_VERIFICATION.sql`**
   - Comprehensive SQL queries for verifying database permissions
   - Staging database isolation checks
   - Role permission verification
   - Security checklist

3. **`R2_PERMISSION_VERIFICATION.md`**
   - Step-by-step Cloudflare dashboard verification
   - Bucket configuration verification
   - API token permission verification
   - Security checklist
   - Troubleshooting guide

---

## Test Results

### Automated Tests — Re-run November 6, 2026 (actual results)

| Command | Result | Details |
|------|--------|---------|
| `npm run lint` | ✅ PASS | `lint:boundaries` + `tsc --noEmit` clean, exit 0 |
| `npm run typecheck` | ✅ PASS | No TypeScript errors, exit 0 |
| `npm run build:public` | ✅ PASS | `vite build` succeeded (2.52s); >500 kB chunk warning only (known Issue B6) |
| `npm run build:cms` | ✅ PASS | `vite build --outDir dist-cms` succeeded (2.59s); same chunk warning |
| `npm test` | ✅ PASS | 80/80 tests, 29 suites, 0 failures (6.6s) |

**Scope limitation**: the test suite exercises route handlers, CORS preflight, session/token logic, and form validation — it does **not** exercise `rateLimiter.ts` (no `auth_rate_limits` table in test scope, no concurrency or XFF-spoof tests) and cannot verify Neon or Cloudflare provider-side enforcement. Automated passes must not be read as verification of those controls.

### Test Suite Breakdown

- Phase 3 Verification: ✅ PASS (all checks)
- Security & Password Cryptography: ✅ PASS
- Public Form Workflows: ✅ PASS
- Public CMS Bundle & API Integrity: ✅ PASS
- Authentication, Session & MFA Route Security: ✅ PASS
- Health Endpoint Checks: ✅ PASS
- Dual-Export Pattern: ✅ PASS
- Cloudflare R2 Storage Configuration: ✅ PASS
- Brand Palette & Transactional Email: ✅ PASS

### CORS Behavior Verification — Live Test Results (November 6, 2026)

The following results were produced by executing `handleAuthRequest` (auth endpoints) and the content `GET` handler directly against crafted `Request` objects — these are **automated code-level tests**, not provider-side verification.

**Auth endpoints (`api-cms/auth/[...path].ts`, production mode — `NODE_ENV` unset/production):**

| Test Case | Origin header | ACAO returned | ACAC | Result |
|---|---|---|---|---|
| Authorized CMS staging origin | `https://azaroth-tech-hive-cms-testing.vercel.app` | echoes origin | `true` | ✅ Allowed |
| Untrusted Vercel preview | `https://azaroth-tech-hive-git-feature-x.vercel.app` | none | none | ✅ Blocked |
| Arbitrary external origin | `https://evil.example.com` | none | none | ✅ Blocked |
| Malformed origin | `not-a-valid-origin` | none | none | ✅ Blocked |
| `null` origin | `null` | none | none | ✅ Blocked |
| Missing Origin header | (absent) | none | none | ✅ No ACAO emitted |
| Credentialed request | authorized origin only | echoes origin | `true` | ✅ Credentials only for allowlisted origin |
| OPTIONS preflight | authorized origin | echoes origin | `true` | ✅ 204 + correct methods/headers |

**Content endpoints (`api-cms/content.ts`, `api-public/content.ts`, `api/content.ts`):**

| Test Case | ACAO returned | Result |
|---|---|---|
| Authorized public staging origin (`PUBLIC_SITE_URL`) | echoes origin | ✅ Allowed |
| Any other / missing / malformed origin | falls back to `publicSiteUrl` value | ⚠See note |

**Note on content API fallback**: for non-allowlisted origins the handler still emits `Access-Control-Allow-Origin: <publicSiteUrl>` rather than omitting the header. Because the endpoint is unauthenticated, read-only, serves only published content, and never sets `Access-Control-Allow-Credentials`, browsers will refuse to expose responses to disallowed origins and there is no credentialed-read exposure. Risk is LOW, but emitting no ACAO for disallowed origins would be cleaner.

**Development-mode finding (CORS-DEV-1) — MEDIUM, not production-exploitable:**

The localhost allowance uses substring matching: `origin?.includes('localhost') || origin?.includes('127.0.0.1')`. Verified live with `NODE_ENV=development`:

| Origin | ACAO | ACAC |
|---|---|---|
| `http://localhost:5173` | echoed | `true` ✅ intended |
| `http://127.0.0.1:3000` | echoed | `true` ✅ intended |
| `https://localhost.evil.com` | echoed | `true` ❌ bypass |
| `https://evil-localhost.attacker.io` | echoed | `true` ❌ bypass |
| `https://notlocalhost.com` | echoed | `true` ❌ bypass |

Any origin containing the substring `localhost` or `127.0.0.1` is accepted **with credentials** in development mode. On Vercel, `NODE_ENV=production`, so this branch is dead in staging/production — but it violates the requirement for URL parsing + exact hostname checks and would expose credentialed CORS to arbitrary origins for anyone running the dev server. **Recommended fix**: parse with `new URL(origin)` and compare `url.hostname === 'localhost' || url.hostname === '127.0.0.1'`.

**Other CORS confirmations:**

- ✅ Authentication and authorization do **not** depend on CORS — session cookies (`azaroth_session`, HttpOnly, SameSite=Lax) and Bearer tokens are validated server-side on every request regardless of Origin.
- ✅ `vercel.cms.json` applies a static `Access-Control-Allow-Origin: https://azaroth-tech-hive-test.vercel.app` header to `/api/content(.*)` — consistent with the function-level allowlist for the public staging origin; monitor for duplicate ACAO headers in deployed responses.
- ✅ CMS upload and content-management functionality remain operational (build + tests pass)
- ✅ Cron authorization and idempotency remain intact

**Provider-side permission claims — CORRECTED STATUS:**

| Claim | Previous status | Corrected status |
|---|---|---|
| Public API cannot perform database writes | ✅ implied verified | ❌ **UNVERIFIED** — code uses the read-only role *if* `DATABASE_URL_PUBLIC` is configured correctly, but Neon role grants require provider evidence (`DATABASE_PERMISSION_VERIFICATION.sql`) |
| Public API cannot write to private R2 storage | ✅ implied verified | ❌ **UNVERIFIED** — code omits R2 credentials for public paths *if* env vars are unset, but bucket policies and token scopes require Cloudflare evidence (`R2_PERMISSION_VERIFICATION.md`) |
| Private bucket isolation | ✅ implied verified | ❌ **UNVERIFIED** — requires Cloudflare dashboard/bucket-policy evidence |  

### Function Inventory

**Public Deployment (api-public/)**:
- Expected: 5 functions
- Actual: 5 functions
- Status: ✅ CORRECT - Within Hobby plan limit

**CMS Deployment (api-cms/)**:
- Expected: 9 functions
- Actual: 9 functions
- Status: ✅ CORRECT - Within Hobby plan limit

---

## Security Configuration Review

### Authentication Cookies

| Check | Status | Details |
|-------|--------|---------|
| HttpOnly flag | ✅ VERIFIED | Set on all session cookies |
| Secure flag | ✅ VERIFIED | Set when HTTPS is detected |
| SameSite attribute | ✅ VERIFIED | Set to Lax for CSRF protection |
| Cookie name | ✅ VERIFIED | Uses `azaroth_session` |

### Session Management

| Check | Status | Details |
|-------|--------|---------|
| Session expiration | ✅ VERIFIED | 7 days max age |
| Session invalidation | ✅ VERIFIED | Logout deletes session from database |
| Session storage | ✅ VERIFIED | Database-backed (not in-memory) |

### Server-Side RBAC

| Check | Status | Details |
|-------|--------|---------|
| Role-based access | ✅ VERIFIED | Uses role-based access control |
| Admin-only endpoints | ✅ VERIFIED | Protected by authentication checks |
| Permission checks | ✅ VERIFIED | Server-side verification on all mutations |
| Anonymous user protection | ✅ VERIFIED | All write operations require authentication |

### CSRF Protection

| Check | Status | Details |
|-------|--------|---------|
| SameSite cookies | ✅ VERIFIED | Set to Lax for CSRF protection |
| State-changing methods | ✅ VERIFIED | Require authentication |

### Content Security Policy

| Check | Status | Details |
|-------|--------|---------|
| Public site CSP | ✅ VERIFIED | Includes CMS staging origin in connect-src |
| CMS CSP | ✅ VERIFIED | Does not include external origins (except fonts) |
| Script restrictions | ✅ VERIFIED | Only allows 'self' for scripts |
| Style restrictions | ✅ VERIFIED | Allows 'self' and Google Fonts |
| Image restrictions | ✅ VERIFIED | Allows 'self', data:, blob:, and R2 domains |
| Frame restrictions | ✅ VERIFIED | Sets frame-src to 'none' |

### CORS Configuration

| Check | Status | Details |
|-------|--------|---------|
| Public site to CMS | ✅ FIXED | Allows specific staging origin only |
| CMS content API | ✅ FIXED | Allows specific staging origin only |
| Auth endpoints | ✅ FIXED | Allows specific staging origin only |
| OPTIONS preflight | ✅ VERIFIED | Correctly handled |
| Method restrictions | ✅ VERIFIED | Only GET, OPTIONS for content API |

### Secret Handling

| Check | Status | Details |
|-------|--------|---------|
| Environment variable usage | ✅ VERIFIED | All secrets use environment variables |
| No VITE_ secrets | ✅ VERIFIED | No secrets exposed to frontend |
| .gitignore configuration | ✅ VERIFIED | .env* files ignored, examples allowed |
| Example file safety | ✅ VERIFIED | Example files use placeholder values |

### Cron Authorization

| Check | Status | Details |
|-------|--------|---------|
| CRON_SECRET validation | ✅ VERIFIED | Secret validated before execution |
| Unauthorized rejection | ✅ VERIFIED | Returns 401 for invalid secret |
| Secret configuration check | ✅ VERIFIED | Returns 503 if not configured |
| Staging data isolation | ✅ VERIFIED | Uses staging database via environment variables |
| Idempotency | ✅ VERIFIED | Safe for repeated executions |
| Duplicate safety | ✅ VERIFIED | Uses database constraints to prevent corruption |
| Error handling | ✅ VERIFIED | Errors logged and caught gracefully |
| Public exclusion | ✅ VERIFIED | Cron job only in CMS deployment, not public |

### Production Isolation

| Check | Status | Details |
|-------|--------|---------|
| Separate staging database | ✅ VERIFIED | Uses `azaroth_staging` database |
| Staging-specific URLs | ✅ VERIFIED | All URLs use staging domains |
| No production credentials | ✅ VERIFIED | No production URLs in environment templates |
| Branch protection | ✅ VERIFIED | Work on staging branch only |
| No --prod flag | ✅ VERIFIED | Deployment commands use preview only |

---

## Database Permission Verification Status

**Status**: UNVERIFIED — Requires manual action (provider-side evidence required)

**Verification Guide**: `DATABASE_PERMISSION_VERIFICATION.sql`

**Code-level status of `auth_rate_limits`**: the table has **no migration** in `db/migrations/` and the DDL in the verification SQL is commented out and missing the unique constraint required by the application's `ON CONFLICT` clause. Even after permissions are verified, the table must be created via a real migration before rate limiting functions.

**Required Manual Actions**:
1. Log into Neon SQL Editor
2. Connect to staging database (`azaroth_staging`)
3. Execute queries from verification guide
4. Verify the following:
   - Current database is staging (not production)
   - readonly role exists
   - readonly role has only SELECT privileges on tables
   - readonly role cannot INSERT, UPDATE, DELETE, or TRUNCATE
   - readonly role cannot CREATE in schemas
   - app role has SELECT, INSERT, UPDATE, DELETE on CMS tables
   - migrator role can CREATE in schemas
   - auth_rate_limits table exists (after migration is created and applied)
   - auth_rate_limits has appropriate indexes and unique constraint

**Verification Status**: BLOCKED until manual verification completed

---

## R2 Permission Verification Status

**Status**: UNVERIFIED - Requires manual action

**Verification Guide**: `R2_PERMISSION_VERIFICATION.md`

**Required Manual Actions**:
1. Log into Cloudflare dashboard
2. Navigate to R2
3. Verify both buckets exist (`azaroth-private-media`, `azaroth-public-media`)
4. Verify CMS token has Read and Edit permissions
5. Verify public token has Read permission ONLY
6. Verify public token does NOT have Edit or Delete permissions
7. Verify public deployment does NOT have private bucket credentials
8. Test that public deployment cannot upload to R2
9. Test that public deployment cannot delete from R2
10. Verify private bucket is NOT publicly accessible

**Verification Status**: BLOCKED until manual verification completed

---

## Remaining Risks

### Risk 1: Database Permissions Unverified

**Severity**: HIGH  
**Status**: BLOCKED  
**Impact**: If read-only role has write permissions, public deployment could modify database

**Mitigation**: Manual verification required before staging deployment

**Action Required**: Execute `DATABASE_PERMISSION_VERIFICATION.sql` and document results

---

### Risk 2: R2 Permissions Unverified

**Severity**: HIGH  
**Status**: BLOCKED  
**Impact**: If public token has write permissions, public deployment could upload/delete files; if the private bucket is publicly readable, private media is exposed

**Mitigation**: Manual verification required before staging deployment

**Action Required**: Follow `R2_PERMISSION_VERIFICATION.md` and document results

---

### Risk 3: Rate Limiting Non-Functional Until Migration + Fixes (NEW)

**Severity**: HIGH  
**Status**: BLOCKED  
**Impact**: `auth_rate_limits` has no migration; every rate-limit DB call fails and fails open — login brute-force protection is effectively absent. Even after the table exists, non-atomic counters, spoofable IP extraction, and the broken `ON CONFLICT` key permit bypass.

**Mitigation**: Create `009_auth_rate_limits.sql` migration with a deterministic window-bucket unique constraint; rewrite `recordLoginAttempt` as an atomic `INSERT ... ON CONFLICT ... RETURNING`; fix IP extraction to use `x-vercel-forwarded-for`/`x-real-ip`/rightmost XFF; reset failed-attempt rows on successful login; wire `cleanupOldRateLimitRecords` into the reconcile cron.

**Action Required**: Code fixes + migration approval before staging deployment (see RL-1 through RL-9)

---

### Risk 4: Development-Mode CORS Substring Match (NEW)

**Severity**: MEDIUM  
**Status**: OPEN — not production-exploitable  
**Impact**: With `NODE_ENV=development`, any Origin containing `localhost` or `127.0.0.1` as a substring (e.g., `https://localhost.evil.com`, `https://notlocalhost.com`) receives credentialed CORS headers. Vercel deployments run `NODE_ENV=production`, so staging is not exposed.

**Mitigation**: Replace substring checks with `new URL(origin)` hostname comparison (`localhost`, `127.0.0.1`, `::1`) before the next production release.

**Action Required**: Code fix recommended; not a staging blocker

---

## Manual Actions Required from Project Owner

### Before Staging Deployment

1. **Verify Database Permissions**
   - Open Neon SQL Editor
   - Execute `DATABASE_PERMISSION_VERIFICATION.sql`
   - Confirm all checklist items pass
   - Document verified permissions

2. **Verify R2 Permissions**
   - Log into Cloudflare dashboard
   - Follow `R2_PERMISSION_VERIFICATION.md`
   - Confirm all checklist items pass
   - Document verified permissions

3. **Create `auth_rate_limits` Migration** (BLOCKER — does not exist yet)
   - No migration in `db/migrations/` creates this table; the DDL in `DATABASE_PERMISSION_VERIFICATION.sql` is commented out and lacks the unique constraint required by `ON CONFLICT (ip_address, attempt_type, created_at)`
   - Author `009_auth_rate_limits.sql` with a deterministic window-bucket unique key and required indexes, apply via the migrator role on `azaroth_staging` only
   - Until applied, all rate-limit checks fail open and login protection is absent

4. **Configure Environment Variables**
   - Add CMS environment variables to Vercel CMS project
   - Add public environment variables to Vercel public project
   - Use staging-specific credentials only
   - Do NOT use production credentials

5. **Deploy CMS Staging Preview**
   - Run: `vercel deploy --local-config=vercel.cms.json --project=azaroth-tech-hive-cms-testing`
   - Do NOT use `--prod`

6. **Run Database Migrations on CMS Staging**
   - Execute migrations on `azaroth_staging` database
   - Do NOT run against production database

7. **Deploy Public Site Staging Preview**
   - Run: `vercel deploy --local-config=vercel.public.json --project=azaroth-tech-hive-test`
   - Do NOT use `--prod`

8. **Post-Deployment Verification**
   - Test health endpoints
   - Test content API
   - Test admin login
   - Test contact form
   - Test media upload
   - Verify CORS behavior

---

## Deployment Recommendation

**Final Classification**: **BLOCKED — DO NOT DEPLOY**

**Rationale**:
- ✅ All P0 CORS vulnerabilities have been fixed and validated by live request simulation
- ✅ All automated tests pass (80/80); lint, typecheck, and both builds are clean
- ❌ `auth_rate_limits` has no migration — login rate limiting fails open and is non-functional (RL-1)
- ❌ Rate limiter has concurrency, proxy-header spoofing, and success-reset defects that permit brute-force bypass even after the table exists (RL-2, RL-3, RL-4)
- ❌ Neon read-only role enforcement is UNVERIFIED — no provider evidence (B3)
- ❌ Cloudflare R2 token scopes and private-bucket isolation are UNVERIFIED — no provider evidence (B4)
- ⚠️ Development-mode localhost CORS substring match violates the exact-hostname requirement (CORS-DEV-1) — not exploitable on Vercel, fix before production

**Warnings**:
- Database read-only permissions require manual verification
- R2 read-only permissions and private bucket isolation require manual verification
- Rate limiting requires a new migration plus code fixes before it provides any protection
- Fail-open rate limiting means a Neon outage silently disables brute-force protection

**Next Steps**:
1. Author and approve `009_auth_rate_limits.sql` migration (unique window-bucket constraint + indexes)
2. Fix rate limiter: atomic upsert, trustworthy IP extraction, failed-attempt reset on success, schedule cleanup
3. Complete manual database permission verification (Neon evidence)
4. Complete manual R2 permission verification (Cloudflare evidence)
5. Fix development-mode localhost CORS check to use URL hostname parsing
6. Re-run `npm run lint && npm run typecheck && npm run build:public && npm run build:cms && npm test`
7. Proceed with staging deployment once all blockers are resolved and evidence is documented
8. Monitor staging deployment for any issues

**Do NOT Deploy Until**:
- `auth_rate_limits` migration exists, is applied to `azaroth_staging`, and rate-limit queries succeed (verified via Neon)
- Rate limiter concurrency and IP-spoofing defects are remediated
- Database permissions are verified and documented with Neon evidence
- R2 permissions and private bucket isolation are verified and documented with Cloudflare evidence
- Both verifications confirm read-only access for public deployment

---

## Appendix: Configuration Files

### Staging URLs

- **Public Site**: `https://azaroth-tech-hive-test.vercel.app`
- **CMS**: `https://azaroth-tech-hive-cms-testing.vercel.app`

### Vercel Projects

- **Public**: `azaroth-tech-hive-test`
- **CMS**: `azaroth-tech-hive-cms-testing`

### Database

- **Staging Database**: `azaroth_staging`
- **Connection**: SSL required

### R2 Buckets

- **Private**: `azaroth-private-media`
- **Public**: `azaroth-public-media`

---

**End of Remediation Report**
