# DEPLOYMENT AND ROLLBACK REPORT
## Azaroth Tech-Hive — Production Release Runbook & Disaster Recovery Plan

**Document Version:** 1.0.0  
**Status:** PRODUCTION READY  
**Date:** November 2026  
**Hosting Platforms:** Vercel (Public & CMS SPAs + Serverless Functions), Neon (Serverless PostgreSQL), Cloudflare (R2 Media Storage & DNS), Brevo (Transactional Email)  

---

## 1. Pre-Deployment Readiness Checklist (Pre-Flight)

Before executing any deployment to Staging or Production, complete this pre-flight verification:

- [x] **Git Cleanliness:** Working branch is clean and up to date with `main` or `staging`.
- [x] **Test Verification:** `npm test` passes with 100% success (84 / 84 tests).
- [x] **Boundary Linting:** `npm run lint:boundaries` completes with 0 cross-boundary violations.
- [x] **TypeScript Typecheck:** `npm run typecheck` (`tsc --noEmit`) passes with 0 type errors.
- [x] **Function Count Budget:**
  - Public API contains exactly 5 serverless functions (limit ≤ 12).
  - CMS API contains exactly 9 serverless functions (limit ≤ 12).
- [x] **Database Baseline:** Neon branch created or verified for instant Point-In-Time Restore (PITR).
- [x] **Secrets Verification:** Vercel Environment Variables configured in Project Settings (zero secrets in Git).

---

## 2. Deployment Procedures

The deployment separates the **Public Website** and the **CMS Administration Application** into two distinct Vercel projects.

```
                    +------------------------------------+
                    |       GIT WORKSPACE REPOSITORY     |
                    +-----------------+------------------+
                                      |
                     +----------------+----------------+
                     |                                 |
                     v                                 v
        [ PUBLIC BUILD PIPELINE ]             [ CMS BUILD PIPELINE ]
        npm run build:public                  npm run build:cms
        (scripts/prepare-public-api.mjs)      (scripts/prepare-cms-api.mjs)
                     |                                 |
                     v                                 v
        Target: dist/ + api/ (5 funcs)        Target: dist-cms/ + api/ (9 funcs)
        Config: vercel.public.json            Config: vercel.cms.json
                     |                                 |
                     v                                 v
        [ Vercel: Public Project ]            [ Vercel: CMS Project ]
        azaroth-tech-hive-test (Staging)      azaroth-tech-hive-cms-testing (Staging)
        azaroth-tech-hive (Production)        azaroth-tech-hive-cms (Production)
```

### 2.1 Database Migration Procedure (Step 1)
Database migrations must be applied prior to deploying code that references new columns or tables.

```bash
# 1. Connect using the migrator role with SSL required
DATABASE_URL_MIGRATOR="postgres://azaroth_migrator:[PASSWORD]@ep-lingering-salad-b5imxpwy.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 2. Run the migration script against target schema
DB_SCHEMA=public node scripts/db-migrate.mjs
```
*Note: Staging migrations target `DB_SCHEMA=staging`; production migrations target `DB_SCHEMA=public`.*

### 2.2 Public Website Deployment (Step 2)

#### Local Build & Test:
```bash
npm run build:public
```
This executes:
1. `node scripts/prepare-public-api.mjs`: Purges `api/` and copies only the 5 public endpoints (`contact.ts`, `content.ts`, `health.ts`, `health/ready.ts`, `rfq.ts`).
2. `vite build`: Compiles the public client bundle into `dist/`.

#### Deployment via Vercel CLI:
```bash
# Staging Deployment (Public) - Explicitly target public project
vercel --project azaroth-tech-hive-test --local-config vercel.public.json --prod

# Production Deployment (Public)
vercel --project azaroth-tech-hive --local-config vercel.public.json --prod
```

### 2.3 CMS Application Deployment (Step 3)

#### Local Build & Test:
```bash
npm run build:cms
```
This executes:
1. `node scripts/prepare-cms-api.mjs`: Purges `api/` and copies the 9 CMS endpoints (`auth/[...path].ts`, `cms/[...path].ts`, `contact.ts`, `content.ts`, `health.ts`, `health/ready.ts`, `internal/reconcile.ts`, `media/upload.ts`, `rfq.ts`).
2. `vite build --outDir dist-cms`: Compiles the administrative client bundle into `dist-cms/`.

#### Deployment via Vercel CLI:
```bash
# Staging Deployment (CMS) - Explicitly target CMS project
vercel --project azaroth-tech-hive-cms-testing --local-config vercel.cms.json --prod

# Production Deployment (CMS)
vercel --project azaroth-tech-hive-cms --local-config vercel.cms.json --prod
```

---

## 3. Post-Deployment Verification Gates (Smoke Test Runbook)

Immediately following deployment, run the following automated health checks:

### Gate 1: Stateless Liveness Probe
```bash
curl -f -s -i "https://azaroth-tech-hive-test.vercel.app/api/health"
```
**Expected Response:** HTTP 200 OK  
```json
{"status":"ok","timestamp":"2026-11-06T...","service":"azaroth-public-api","env":"staging"}
```

### Gate 2: Database Connectivity & Readiness Probe
```bash
curl -f -s -i "https://azaroth-tech-hive-test.vercel.app/api/health/ready"
```
**Expected Response:** HTTP 200 OK  
```json
{"status":"ready","database":"connected","timestamp":"2026-11-06T..."}
```

### Gate 3: Public Content Delivery Verification
```bash
curl -f -s "https://azaroth-tech-hive-test.vercel.app/api/content" | grep -q '"brand"'
echo $? # Must return 0
```

### Gate 4: Synthetic Form Submission (Contact Form)
```bash
curl -f -s -X POST "https://azaroth-tech-hive-test.vercel.app/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Synthetic Monitor","email":"monitor@azaroth-techhive.com","subject":"Release Smoke Test","message":"Verifying production health post-release.","source":"smoke-test"}'
```
**Expected Response:** HTTP 200 OK with `referenceId: "INQ-..."`.

### Gate 5: CMS Authentication & Rate Limit Probe
1. Submit valid credentials to `/api/auth/login`: verifies session issuance and HTTP 200.
2. Submit invalid credentials 10 times: verifies HTTP 429 lockout response.
3. Validate session via `/api/auth/me` with session cookie: verifies HTTP 200.

---

## 4. Rollback and Disaster Recovery Runbooks

In the event of an unrecoverable failure during or after release, follow these granular rollback protocols:

### Runbook A: Instant Frontend / API Rollback (Vercel)
If a software bug or regression is detected in production code:
1. Navigate to the Vercel Dashboard for `azaroth-tech-hive` or `azaroth-tech-hive-cms`.
2. Select the **Deployments** tab.
3. Locate the previous known healthy deployment.
4. Click the three dots `...` and select **Instant Rollback (Promote to Production)**.
5. Traffic shifts to the previous build within < 10 seconds.
6. Alternatively, via Vercel CLI:
   ```bash
   vercel rollback [PREVIOUS_DEPLOYMENT_URL]
   ```

### Runbook B: Database Rollback (Neon PostgreSQL)
If a migration causes schema corruption or data regression:
1. **Option 1: Point-In-Time Restore (Recommended):**
   - In the Neon Console, navigate to the target branch.
   - Select **Restore to point in time**.
   - Pick the exact minute prior to migration execution.
   - Switch application connection string to the restored branch.
2. **Option 2: Reverse Migration Script:**
   - Execute the corresponding rollback script using `azaroth_migrator`:
     ```bash
     psql "$DATABASE_URL_MIGRATOR" -f db/rollbacks/009_rollback_auth_rate_limits.sql
     ```
   - Delete the corresponding record from `schema_migrations`.

### Runbook C: Storage Disaster Recovery (Cloudflare R2)
If media assets are corrupted or inadvertently deleted:
1. Cloudflare R2 bucket versioning preserves previous object versions.
2. Restore previous version using AWS S3 CLI with Cloudflare endpoint:
   ```bash
   aws s3api list-object-versions --bucket azaroth-cms-media --endpoint-url https://3f8d31a20291a94c1a642f8e5495f3f0.r2.cloudflarestorage.com
   ```

### Runbook D: DNS & Edge Failover (Cloudflare)
If the Vercel deployment becomes unavailable:
1. Cloudflare DNS proxied records (`CNAME @` and `CNAME www`) can be repointed to a standby static maintenance bucket or fallback edge worker within seconds.
2. Set Cloudflare Under Attack mode or enable WAF rate-limiting rules if unexpected high-volume attacks occur.

---

## 5. Automated Daily Reconciliation & Health Maintenance

The `/api/internal/reconcile` endpoint is triggered daily via cron or Cloudflare Scheduled Worker:
```bash
curl -X POST "https://azaroth-tech-hive-cms-testing.vercel.app/api/internal/reconcile" \
  -H "Authorization: Bearer $CRON_SECRET"
```
**Reconciliation Actions:**
1. Deletes expired sessions (`expires_at < NOW()`).
2. Purges rate limit counters older than 24 hours while preserving active lockouts.
3. Cleans orphaned media upload staging files.
4. Records health heartbeat in system telemetry logs.

