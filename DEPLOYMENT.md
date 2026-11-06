# Azaroth Tech-Hive Deployment Guide

## Staging Deployment Architecture

This project uses a dual-deployment architecture for staging environments to work within Vercel's Hobby plan 12-serverless-function limit:

- **Public Site Staging** (`azaroth-tech-hive-test.vercel.app`): Public-facing marketing website with 5 functions
- **CMS Staging** (`azaroth-tech-hive-cms-testing.vercel.app`): Admin dashboard with 9 functions

Both deployments use a separate staging Neon PostgreSQL database and share Cloudflare R2 buckets for data consistency.

**IMPORTANT**: This guide is for STAGING deployment only. Production deployment is documented separately and must not be performed during staging setup.

## Prerequisites

Before deploying, ensure you have:

1. **Vercel Account** - Free Hobby tier (two projects)
2. **Neon PostgreSQL** - Database hosting (shared between deployments)
3. **Cloudflare R2** - Object storage (shared between deployments)
4. **Git Repository** - Vercel connected to your Git provider

## Environment Variables

### CMS Staging Variables (azaroth-tech-hive-cms-testing.vercel.app)

See `.env.cms.example` for the complete template. Key variables:

```bash
# Database (Neon PostgreSQL) - Full Access (STAGING)
DATABASE_URL_MIGRATOR=postgres://user:password@ep-xxx.aws.neon.tech/azaroth_staging?sslmode=require
DATABASE_URL_APP=postgres://user:password@ep-xxx.aws.neon.tech/azaroth_staging?sslmode=require
DATABASE_URL_PUBLIC_RO=postgres://readonly:password@ep-xxx.aws.neon.tech/azaroth_staging?sslmode=require

# Authentication
BETTER_AUTH_SECRET=<random-32-char-string>
BETTER_AUTH_URL=https://azaroth-tech-hive-cms-testing.vercel.app
INITIAL_ADMIN_EMAIL=admin@azaroth.tech
INITIAL_ADMIN_PASSWORD=<strong-password>
MFA_ENCRYPTION_KEY=<random-32-char-string>

# Cloudflare R2 Storage - Full Access
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_PRIVATE_BUCKET=azaroth-private-media
R2_PUBLIC_BUCKET=azaroth-public-media
R2_PUBLIC_BASE_URL=https://pub-<bucket-id>.r2.dev

# Health & Monitoring
HEALTH_READY_SECRET=<random-secret-for-health-checks>
CRON_SECRET=<random-secret-for-cron-jobs>

# Site Configuration
SITE_URL=https://azaroth-tech-hive-cms-testing.vercel.app
PUBLIC_SITE_URL=https://azaroth-tech-hive-test.vercel.app
```

### Public Site Staging Variables (azaroth-tech-hive-test.vercel.app)

See `.env.public.example` for the complete template. Key variables:

```bash
# Database (Neon PostgreSQL) - Read-Only Access (STAGING)
DATABASE_URL_PUBLIC_RO=postgres://readonly:password@ep-xxx.aws.neon.tech/azaroth_staging?sslmode=require

# Cloudflare R2 Storage - Read-Only Access
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_PUBLIC_BUCKET=azaroth-public-media
R2_PUBLIC_BASE_URL=https://pub-<bucket-id>.r2.dev

# CMS API URL (for fetching content)
CMS_API_URL=https://azaroth-tech-hive-cms-testing.vercel.app

# Site Configuration
SITE_URL=https://azaroth-tech-hive-test.vercel.app

# Health & Monitoring
HEALTH_READY_SECRET=<random-secret-for-health-checks>
```

## Staging Deployment Steps

### 1. Prepare Staging Neon Database

1. Create a Neon project at https://console.neon.tech
2. Create a separate staging database:
   - `azaroth_staging` (staging database - DO NOT use production)
   - Ensure migration role has CREATE/DROP privileges
3. Create separate roles for read/write and read-only access
4. Copy connection strings for each role
5. Add to both Vercel projects' environment variables
6. **DO NOT** use production database credentials

### 2. Configure Cloudflare R2

1. Go to Cloudflare Dashboard → R2
2. Create two buckets:
   - `azaroth-private-media` (for original uploads)
   - `azaroth-public-media` (for published assets)
3. Create R2 API Token with S3-compatible access
4. Copy Account ID, Access Key ID, Secret Access Key
5. Add to both Vercel projects' environment variables

### 3. Deploy CMS Staging to Vercel (First)

The CMS must be deployed first since the public site depends on it for content.

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy CMS staging using vercel.cms.json (PREVIEW ONLY)
vercel deploy --local-config=vercel.cms.json --project=azaroth-tech-hive-cms-testing

# DO NOT use --prod for staging deployment
```

#### Via Vercel Dashboard

1. Create new project: `azaroth-tech-hive-cms-testing`
2. Import from Git repository (select `staging` branch)
3. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build:cms`
   - Output Directory: `dist-cms`
4. Add CMS environment variables from `.env.cms.example`
5. Deploy as preview deployment

### 4. Run Database Migrations on CMS Staging

After CMS deployment, run migrations on the staging database:

```bash
# Via Vercel CLI
vercel env pull .env.local --scope azaroth-tech-hive-cms-testing
npm run db:migrate
```

**IMPORTANT**: This will run migrations on the `azaroth_staging` database only. Do not run against production.

### 5. Create Initial Admin Account

The first admin account is created automatically on first CMS startup if it doesn't exist, using:
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`

Set these in CMS environment variables before first deployment.

### 6. Configure MFA

After first login to CMS staging:
1. Navigate to `https://azaroth-tech-hive-cms-testing.vercel.app/admin/login`
2. Login with initial admin credentials
3. Complete MFA setup (TOTP app + backup codes)
4. MFA is enforced for all admin operations

### 7. Deploy Public Site Staging to Vercel (Second)

After CMS is deployed and running, deploy the public site.

#### Via Vercel CLI

```bash
# Deploy public site staging using vercel.public.json (PREVIEW ONLY)
vercel deploy --local-config=vercel.public.json --project=azaroth-tech-hive-test

# DO NOT use --prod for staging deployment
```

#### Via Vercel Dashboard

1. Create new project: `azaroth-tech-hive-test`
2. Import from Git repository (select `staging` branch)
3. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build:public`
   - Output Directory: `dist`
4. Add public site environment variables from `.env.public.example`
5. Deploy as preview deployment

## Staging Post-Deployment Verification

### 1. CMS Staging Health Check

```bash
curl https://azaroth-tech-hive-cms-testing.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-11-06T...",
  "uptime": 123.45,
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection successful"
    },
    "r2": {
      "status": "configured",
      "message": "R2 storage configured"
    }
  }
}
```

### 2. Public Site Staging Health Check

```bash
curl https://azaroth-tech-hive-test.vercel.app/api/health
```

### 3. Test Content API

Test that the public site can fetch content from the CMS:

```bash
# Fetch all published content
curl https://azaroth-tech-hive-cms-testing.vercel.app/api/content?type=all

# Fetch specific page
curl https://azaroth-tech-hive-cms-testing.vercel.app/api/content?type=page&slug=about

# Fetch products
curl https://azaroth-tech-hive-cms-testing.vercel.app/api/content?type=products
```

### 4. Test Admin Login

1. Navigate to `https://azaroth-tech-hive-cms-testing.vercel.app/admin/login`
2. Login with initial admin credentials
3. Complete MFA verification
4. Verify dashboard loads

### 5. Test Contact Form (Public Site Staging)

1. Navigate to `https://azaroth-tech-hive-test.vercel.app/connect-with-us`
2. Submit test form
3. Verify submission succeeds (check staging database or logs)

### 6. Test Media Upload (CMS Staging)

1. Login to CMS admin
2. Navigate to Media Manager
3. Upload test image
4. Verify upload succeeds and appears in list

### 7. Test Admin Redirect

Navigate to `https://azaroth-tech-hive-test.vercel.app/admin` - should redirect to CMS at `https://azaroth-tech-hive-cms-testing.vercel.app/admin`

## Staging Monitoring

### Logs

- **CMS Staging**: Vercel Dashboard → azaroth-tech-hive-cms-testing → Logs
- **Public Site Staging**: Vercel Dashboard → azaroth-tech-hive-test → Logs
- Filter by API routes: `/api/*`
- Monitor for errors in authentication, database, R2

### Alerts

Configure Vercel alerts for both projects:
- HTTP 5xx errors
- Response time > 500ms
- Edge function errors

### Backup Strategy

**Database (Neon):**
- Neon provides automatic point-in-time recovery
- Enable branch creation for staging snapshots
- Export dumps regularly

**R2 Storage:**
- R2 provides 99.999999999% durability
- Enable lifecycle policies for old media versions
- Use backup R2 bucket for critical assets

## Security Checklist

- [ ] All environment variables set in Vercel
- [ ] `BETTER_AUTH_SECRET` is cryptographically random
- [ ] `HEALTH_READY_SECRET` is not public
- [ ] `MFA_ENCRYPTION_KEY` is cryptographically random
- [ ] Initial admin password changed from default
- [ ] MFA enabled for all admin accounts
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Security headers configured (in vercel.json)
- [ ] CSP headers configured for R2 domains
- [ ] Database uses SSL (sslmode=require)
- [ ] R2 bucket access restricted by IP (optional)

## Staging Rollback Procedure

If staging deployment fails:

1. **Vercel Dashboard**:
   - Go to Deployments for the staging project
   - Find previous successful staging deployment
   - Redeploy that version

2. **Database Rollback**:
   - Use Neon's Time Travel feature on `azaroth_staging` database
   - Or restore from manual backup
   - **DO NOT** touch production database

3. **Asset Rollback**:
   - R2 has versioning (if enabled)
   - Or restore from backup bucket
   - **DO NOT** modify production assets

## Troubleshooting

### Database Connection Failed

- Verify `DATABASE_URL_APP` is correct
- Check Neon database is active
- Ensure SSL mode is enabled
- Check IP whitelist (if configured)

### R2 Upload Failed

- Verify R2 credentials are correct
- Check bucket names match environment variables
- Ensure bucket permissions allow writes
- Check file size limits (max 5MB enforced)

### MFA Not Working

- Verify `MFA_ENCRYPTION_KEY` is set
- Check TOTP time sync (device time)
- Use backup codes if TOTP fails
- Re-enroll MFA for user

### Health Check Returns 503

- Database not configured or unreachable
- R2 credentials missing
- Check Vercel function logs
- Verify environment variables are set

## Performance Optimization

### Bundle Size

Current bundle is ~1.3MB. To optimize:

1. Enable code splitting in `vite.config.ts`
2. Lazy load admin routes (already done in `App.tsx`)
3. Consider moving admin to separate deployment
4. Use dynamic imports for heavy libraries

### Caching

- Vercel Edge Caching for static assets
- Vercel KV for session storage (optional)
- CDN for R2 public assets

### Database

- Use connection pooling
- Enable query caching
- Optimize frequently accessed queries
- Add indexes as needed

## Cloudflare Workers & Wrangler Deployment (Production Grade)

The platform supports deployment to Cloudflare Workers using the native **Workers with Static Assets** architecture (`wrangler.toml` / `wrangler.jsonc`), delivering ultra-low edge latency, automated 301 redirects, hardened security headers (CSP), R2 object storage bindings, and scheduled cron triggers.

### 1. Architecture Overview

```
                      Client Request
                            │
                            ▼
              ┌───────────────────────────┐
              │ Cloudflare Global Network │
              └─────────────┬─────────────┘
                            │
               ┌────────────┴────────────┐
               │  Edge Security & CSP    │
               │  Redirect Engine (301)  │
               └────────────┬────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
  API Endpoints                           Static Assets / SPA
  (/api/health, /api/contact,             (Cloudflare ASSETS binding:
   /api/rfq, /api/auth, /api/cms)          ./dist with SPA routing)
        │
  ┌─────┴─────────────────────┐
  │                           │
  ▼                           ▼
Neon PostgreSQL         Cloudflare R2 Bucket
(Serverless pooled)     (azaroth-cms-media)
```

### 2. Wrangler Setup & Authentication

Install Wrangler and authenticate:

```bash
# Log in to Cloudflare
npx wrangler login

# Verify active account
npx wrangler whoami
```

### 3. Production Environment Secrets Checklist

Set all sensitive credentials securely via Wrangler Secrets (these are encrypted at rest and never checked into source control):

```bash
# Database Connections (Neon Serverless PostgreSQL)
npx wrangler secret put DATABASE_URL
npx wrangler secret put DATABASE_URL_APP
npx wrangler secret put DATABASE_URL_MIGRATOR
npx wrangler secret put DATABASE_URL_PUBLIC_RO

# Email Delivery (Brevo Transactional API)
npx wrangler secret put BREVO_API_KEY

# Cloudflare R2 Media Storage Credentials
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
npx wrangler secret put R2_ACCOUNT_ID

# Security, Cron & MFA
npx wrangler secret put CRON_SECRET
npx wrangler secret put MFA_ENCRYPTION_KEY
npx wrangler secret put TOTP_ENCRYPTION_KEY
npx wrangler secret put HEALTH_READY_SECRET
```

### 4. Build & Local Edge Simulation

Build the production client distribution and test with local Wrangler runtime:

```bash
# 1. Build client bundle into ./dist
npm run build:cf

# 2. Preview locally using Wrangler edge runtime
npm run preview:cf
```

### 5. Production Zero-Downtime Deployment

To deploy to Cloudflare Workers:

```bash
# Safe, non-destructive deployment command:
npx wrangler deploy
```

> [!NOTE]
> When `npx wrangler deploy` runs:
> 1. Static assets from `./dist` are uploaded directly to Cloudflare's global edge network.
> 2. `src/server/worker.ts` is compiled with `nodejs_compat` runtime flags.
> 3. Cloudflare R2 bucket binding `R2_BUCKET` is linked.
> 4. Scheduled trigger `0 3 * * *` is registered for automated nightly reconciliation.

---

## Support

For issues with:
- **Vercel**: https://vercel.com/support
- **Neon**: https://neon.tech/support
- **Cloudflare R2**: https://developers.cloudflare.com/r2/

## Appendix: Environment Variable Generator

Generate secure secrets:

```bash
# Generate random 32-char string for secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use:
openssl rand -hex 32
```
