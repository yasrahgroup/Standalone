# ENVIRONMENT CONFIGURATION MATRIX
## Azaroth Tech-Hive — Multi-Environment Deployment Specification

**Document Version:** 1.0.0  
**Status:** PRODUCTION READY  
**Date:** November 2026  
**Environments Covered:** Development, Staging, Production  

---

## 1. Environment Topology Overview

The application utilizes three cleanly separated environments:
1. **Development (`local`):** Local Vite development server + local Express/Node server with direct developer loop.
2. **Staging (`test`):** Hosted on Vercel preview projects (`azaroth-tech-hive-test` and `azaroth-tech-hive-cms-testing`) targeting the isolated `staging` schema in Neon PostgreSQL and staging Cloudflare R2 bucket.
3. **Production (`prod`):** Hosted on primary Vercel production projects (`azaroth-tech-hive` and `azaroth-tech-hive-cms`, vanity domain `www.azaroth-techhive.com`) targeting the production schema in Neon PostgreSQL and production Cloudflare R2 bucket.

---

## 2. Comprehensive Configuration Matrix

| Dimension | Development (Local) | Staging (Test) | Production (Live) |
|---|---|---|---|
| **Public Frontend URL** | `http://localhost:5173` | `https://azaroth-tech-hive-test.vercel.app` | `https://www.azaroth-techhive.com` / `https://azaroth-tech-hive.vercel.app` |
| **CMS Frontend URL** | `http://localhost:5173/admin` | `https://azaroth-tech-hive-cms-testing.vercel.app` | `https://azaroth-tech-hive-cms.vercel.app` |
| **Backend API Gateway** | `http://localhost:3000/api` | Direct relative `/api` on Vercel deployment | Direct relative `/api` on Vercel deployment |
| **Vercel Project (Public)**| N/A | `azaroth-tech-hive-test` | `azaroth-tech-hive` |
| **Vercel Project (CMS)** | N/A | `azaroth-tech-hive-cms-testing` | `azaroth-tech-hive-cms` |
| **Vercel Config File (Public)**| `vercel.public.json` | `vercel.public.json` | `vercel.public.json` |
| **Vercel Config File (CMS)** | `vercel.cms.json` | `vercel.cms.json` | `vercel.cms.json` |
| **Serverless Functions (Public)**| Express simulated | 5 functions (`contact`, `content`, `health`, `ready`, `rfq`) | 5 functions (`contact`, `content`, `health`, `ready`, `rfq`) |
| **Serverless Functions (CMS)**| Express simulated | 9 functions (`auth/[...path]`, `cms/[...path]`, `contact`, `content`, `health`, `ready`, `reconcile`, `upload`, `rfq`) | 9 functions (`auth/[...path]`, `cms/[...path]`, `contact`, `content`, `health`, `ready`, `reconcile`, `upload`, `rfq`) |
| **Serverless Runtime** | Node.js 24.x/26.x local | Node.js 26.x via `package.json` engines (15s timeout, 30s for upload) | Node.js 26.x via `package.json` engines (15s timeout, 30s for upload) |
| **PostgreSQL Host** | Neon AWS Pooler (`ep-lingering-salad-b5imxpwy.c-7.us-east-2.aws.neon.tech`) | Same host, AWS Pooler endpoint | Same host, AWS Pooler endpoint |
| **PostgreSQL Database** | `neondb` | `neondb` | `neondb` |
| **Database Schema** | `staging` (or local test schema) | `staging` | `public` (or dedicated `production` schema) |
| **DB Migrator Role** | `azaroth_migrator` | `azaroth_migrator` | `azaroth_migrator` |
| **DB App Role** | `azaroth_app` | `azaroth_app` | `azaroth_app` |
| **DB Public RO Role** | `azaroth_public_ro` | `azaroth_public_ro` | `azaroth_public_ro` |
| **PostgreSQL SSL** | `require` | `require` (`rejectUnauthorized: true`) | `require` (`rejectUnauthorized: true`) |
| **Cloudflare R2 Account** | `3f8d31a20291a94c1a642f8e5495f3f0` | `3f8d31a20291a94c1a642f8e5495f3f0` | `3f8d31a20291a94c1a642f8e5495f3f0` |
| **R2 Bucket Name** | `azaroth-cms-media` (staging prefix) | `azaroth-cms-media` | `azaroth-cms-media-prod` (or dedicated production bucket) |
| **R2 Public CDN Domain** | `https://media.azaroth-techhive.com` | `https://pub-staging.azaroth-techhive.com` | `https://media.azaroth-techhive.com` |
| **Email SMTP Host** | `smtp-relay.mailin.fr` | `smtp-relay.mailin.fr` | `smtp-relay.mailin.fr` |
| **Email SMTP Port** | 587 (STARTTLS) | 587 (STARTTLS) | 587 (STARTTLS) |
| **Email Sender Identity** | `noreply@azaroth-techhive.com` | `noreply@azaroth-techhive.com` | `noreply@azaroth-techhive.com` |
| **Email Admin Recipient**| `contact@azaroth-techhive.com` | `contact@azaroth-techhive.com` | `contact@azaroth-techhive.com` |
| **Session Lifetime** | 8 hours (28,800 sec) | 8 hours (28,800 sec) | 8 hours (28,800 sec) |
| **IP Login Rate Limit** | 5 attempts / 15 min | 5 attempts / 15 min | 5 attempts / 15 min |
| **Account Lockout Policy** | 10 failed logins / 1 hr → 30 min lock | 10 failed logins / 1 hr → 30 min lock | 10 failed logins / 1 hr → 30 min lock |
| **Password Change Limit**| 3 attempts / 1 hr per user | 3 attempts / 1 hr per user | 3 attempts / 1 hr per user |
| **Cron Reconciliation** | Manual script invocation | Every 24 hours (Vercel Cron / Worker) | Every 24 hours (Vercel Cron / Worker) |

---

## 3. Strict CORS Allowed Origin Whitelists

CORS headers are evaluated per request by `isAllowedOrigin()` in `src/server/core/security.ts`. Generic wildcards (`*`) and loose regex matches (`.*\.vercel\.app`) are forbidden.

### Development Origins:
- `http://localhost:5173`
- `http://localhost:3000`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

### Staging Origins:
- `https://azaroth-tech-hive-test.vercel.app`
- `https://azaroth-tech-hive-cms-testing.vercel.app`

### Production Origins:
- `https://azaroth-tech-hive.vercel.app`
- `https://azaroth-tech-hive-cms.vercel.app`
- `https://www.azaroth-techhive.com`
- `https://azaroth-techhive.com`

---

## 4. Environment Variables Reference & Secrets Mapping

All secrets must be configured directly within the Vercel Project Settings or local `.env` files. Secrets must NEVER be checked into Git.

### 4.1 Public Application Variables (`.env.public.example`)

| Variable Name | Required | Description | Example (Staging / Production) |
|---|---|---|---|
| `NODE_ENV` | Yes | Application environment | `production` |
| `APP_ENV` | Yes | Deployment environment tier | `staging` / `production` |
| `DATABASE_URL_RO` | Yes | Read-only connection string for public queries (`azaroth_public_ro`) | `postgres://azaroth_public_ro:[REDACTED]@ep-lingering-salad-b5imxpwy.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `DATABASE_URL_APP` | Yes | Application connection string for Contact/RFQ persistence (`azaroth_app`) | `postgres://azaroth_app:[REDACTED]@ep-lingering-salad-b5imxpwy.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `DB_SCHEMA` | Yes | Active PostgreSQL schema | `staging` / `public` |
| `BREVO_SMTP_USER` | Yes | Brevo API key identifier | `87293b001@smtp-brevo.com` |
| `BREVO_SMTP_KEY` | Yes | Brevo SMTP password / Master key | `xsmtpsib-[REDACTED]` |
| `NOTIFICATION_EMAIL_TO`| Yes | Administrative recipient for enquiries/RFQs | `contact@azaroth-techhive.com` |
| `NOTIFICATION_EMAIL_FROM`| Yes| Verified sender address | `noreply@azaroth-techhive.com` |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of exact allowed CORS origins | `https://azaroth-tech-hive-test.vercel.app,https://azaroth-tech-hive-cms-testing.vercel.app` |

### 4.2 CMS Application Variables (`.env.cms.example`)

| Variable Name | Required | Description | Example (Staging / Production) |
|---|---|---|---|
| `NODE_ENV` | Yes | Application environment | `production` |
| `APP_ENV` | Yes | Deployment environment tier | `staging` / `production` |
| `DATABASE_URL_APP` | Yes | Read/write application connection string (`azaroth_app`) | `postgres://azaroth_app:[REDACTED]@ep-lingering-salad-b5imxpwy.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `DATABASE_URL_RO` | Optional| Read-only connection fallback | `postgres://azaroth_public_ro:[REDACTED]@...` |
| `DB_SCHEMA` | Yes | Active PostgreSQL schema | `staging` / `public` |
| `SESSION_SECRET` | Yes | High-entropy random secret for session signature | `[64-character random hex string]` |
| `R2_ACCOUNT_ID` | Yes | Cloudflare Account ID | `3f8d31a20291a94c1a642f8e5495f3f0` |
| `R2_ACCESS_KEY_ID` | Yes | Cloudflare R2 S3 API Key ID | `[Cloudflare R2 Access Key]` |
| `R2_SECRET_ACCESS_KEY`| Yes | Cloudflare R2 S3 API Secret Key | `[Cloudflare R2 Secret Key]` |
| `R2_BUCKET_NAME` | Yes | Target R2 Bucket for media storage | `azaroth-cms-media` |
| `R2_PUBLIC_URL` | Yes | Public CDN URL prefix for media assets | `https://media.azaroth-techhive.com` |
| `BREVO_SMTP_USER` | Yes | Brevo SMTP login | `87293b001@smtp-brevo.com` |
| `BREVO_SMTP_KEY` | Yes | Brevo SMTP password | `xsmtpsib-[REDACTED]` |
| `NOTIFICATION_EMAIL_TO`| Yes | Destination for administrative alerts | `contact@azaroth-techhive.com` |
| `NOTIFICATION_EMAIL_FROM`| Yes| Sender email address | `noreply@azaroth-techhive.com` |
| `CRON_SECRET` | Yes | Secret header for `/api/internal/reconcile` | `[32-character random hex string]` |
| `ALLOWED_ORIGINS` | Yes | Exact allowed origins for CMS API | `https://azaroth-tech-hive-cms-testing.vercel.app,https://azaroth-tech-hive-test.vercel.app` |

---

## 5. Security & Isolation Guidelines

1. **Database Isolation:**
   - Staging serverless functions MUST configure `DB_SCHEMA=staging`.
   - Production serverless functions MUST configure `DB_SCHEMA=public` (or `production`).
   - The application connects via connection-pooled URLs with SSL enforcement enabled.
2. **Least Privilege Principle:**
   - Public read operations only use `DATABASE_URL_RO` (`azaroth_public_ro`).
   - Mutation and administrative operations use `DATABASE_URL_APP` (`azaroth_app`).
   - Migrations are exclusively executed via `DATABASE_URL_MIGRATOR` (`azaroth_migrator`).
3. **Storage Security:**
   - Public media assets are served strictly via read-only CDN caching.
   - Private media objects (such as uploaded RFQ attachments or internal documents) are stored with private ACLs and accessible only via signed URLs or authenticated proxy.
4. **Header Trust Chain:**
   - When running behind Vercel edge proxies, `extractClientIp` trusts `x-vercel-forwarded-for` and the rightmost hop of `x-forwarded-for`, strictly rejecting client-injected spoofed headers.

