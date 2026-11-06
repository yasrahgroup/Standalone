# Azaroth Tech-Hive Staging Deployment Guide

## Overview

This document describes the dual-deployment architecture for staging environments, designed to work within Vercel's Hobby plan 12-serverless-function limit.

## Deployment Architecture

### Two Separate Vercel Projects

**Public Website**
- Project Name: `azaroth-tech-hive-test`
- URL: https://azaroth-tech-hive-test.vercel.app
- Configuration: `vercel.public.json`
- Build Command: `npm run build:public`
- Output Directory: `dist`
- Serverless Functions: 5 (contact, content, health, rfq)

**CMS / Admin Website**
- Project Name: `azaroth-tech-hive-cms-testing`
- URL: https://azaroth-tech-hive-cms-testing.vercel.app
- Configuration: `vercel.cms.json`
- Build Command: `npm run build:cms`
- Output Directory: `dist-cms`
- Serverless Functions: 9 (auth, cms, contact, content, health, internal, media, rfq)

## Function Isolation Strategy

### Problem
Vercel's default Git integration deploys the entire `api/` directory regardless of which vercel.json file is used. The original codebase had 22 API functions, exceeding the Hobby plan's 12-function limit.

### Solution
Created separate API directories that are copied to `api/` during build:

- `api-public/` - Contains only public-facing functions (5 functions)
- `api-cms/` - Contains CMS and admin functions (9 functions)

### Build Preparation Scripts

**scripts/prepare-public-api.mjs**
- Runs before `npm run build:public`
- Copies `api-public/*` to `api/`
- Ensures only public functions are deployed

**scripts/prepare-cms-api.mjs**
- Runs before `npm run build:cms`
- Copies `api-cms/*` to `api/`
- Ensures only CMS functions are deployed

## API Function Inventory

### Public Deployment (api-public/)
```
api-public/
├── contact.ts          - Contact form submissions
├── content.ts          - Public content API (read-only)
├── health.ts           - Health check endpoint
├── health/ready.ts     - Readiness health check
└── rfq.ts              - Request for Quote submissions
```
**Total: 5 functions**

### CMS Deployment (api-cms/)
```
api-cms/
├── auth/[...path].ts   - Authentication catch-all (login, logout, me, change-password)
├── cms/[...path].ts    - CMS catch-all (all, audit-logs, media, navigation, settings, stats)
├── contact.ts          - Contact form submissions
├── content.ts          - Public content API (for CORS to public site)
├── health.ts           - Health check endpoint
├── health/ready.ts     - Readiness health check
├── internal/reconcile.ts- Scheduled reconciliation job
├── media/upload.ts     - Media upload endpoint
└── rfq.ts              - Request for Quote submissions
```
**Total: 9 functions**

## Environment Variables

### CMS Environment (.env.cms.example)

```bash
# Node Environment
NODE_ENV=production

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

# Email (Optional - for notifications)
RESEND_API_KEY=re_<your-resend-api-key>
NOTIFY_EMAIL=admin@azaroth.tech

# Error Tracking (Optional)
SENTRY_DSN=https://<your-sentry-dsn>@sentry.io/<project-id>
```

### Public Environment (.env.public.example)

```bash
# Node Environment
NODE_ENV=production

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

## Deployment Steps

### 1. Create Staging Database

Create a separate Neon database for staging:
- Database name: `azaroth_staging`
- Create separate roles for read/write and read-only access
- Do NOT use production database credentials

### 2. Deploy CMS First

The CMS must be deployed first since the public site depends on it for content.

#### Via Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy CMS using vercel.cms.json
vercel --name azaroth-tech-hive-cms-testing --local-config vercel.cms.json

# Deploy to production
vercel --prod --name azaroth-tech-hive-cms-testing --local-config vercel.cms.json
```

#### Via Vercel Dashboard

1. Create new project: `azaroth-tech-hive-cms-testing`
2. Import from Git repository (select `staging` branch)
3. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build:cms`
   - Output Directory: `dist-cms`
4. Add CMS environment variables from `.env.cms.example`
5. Deploy

### 3. Run Database Migrations on CMS

After CMS deployment, run migrations:

```bash
# Via Vercel CLI
vercel env pull .env.local --scope azaroth-tech-hive-cms-testing
npm run db:migrate
```

### 4. Deploy Public Site

After CMS is deployed and running, deploy the public site.

#### Via Vercel CLI

```bash
# Deploy public site using vercel.public.json
vercel --name azaroth-tech-hive-test --local-config vercel.public.json

# Deploy to production
vercel --prod --name azaroth-tech-hive-test --local-config vercel.public.json
```

#### Via Vercel Dashboard

1. Create new project: `azaroth-tech-hive-test`
2. Import from Git repository (select `staging` branch)
3. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build:public`
   - Output Directory: `dist`
4. Add public site environment variables from `.env.public.example`
5. Deploy

## CORS Configuration

### CMS Content API

The CMS exposes a read-only content API at `/api/content` for the public site.

**vercel.cms.json** CORS headers:
```json
{
  "source": "/api/content(.*)",
  "headers": [
    {
      "key": "Access-Control-Allow-Origin",
      "value": "https://azaroth-tech-hive-test.vercel.app"
    },
    {
      "key": "Access-Control-Allow-Methods",
      "value": "GET, OPTIONS"
    }
  ]
}
```

### Public Site CSP

**vercel.public.json** CSP includes CMS origin:
```json
{
  "key": "Content-Security-Policy",
  "value": "connect-src 'self' https://*.r2.dev https://*.r2.cloudflarestorage.com https://azaroth-tech-hive-cms-testing.vercel.app"
}
```

## Admin Redirect

The public site redirects `/admin` routes to the CMS:

**vercel.public.json** redirects:
```json
{
  "source": "/admin",
  "destination": "https://azaroth-tech-hive-cms-testing.vercel.app/admin",
  "permanent": true
},
{
  "source": "/admin/:path*",
  "destination": "https://azaroth-tech-hive-cms-testing.vercel.app/admin/:path*",
  "permanent": true
}
```

## Verification Steps

### 1. CMS Health Check

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

### 2. Public Site Health Check

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

### 5. Test Contact Form (Public Site)

1. Navigate to `https://azaroth-tech-hive-test.vercel.app/connect-with-us`
2. Submit test form
3. Verify submission succeeds

### 6. Test Admin Redirect

Navigate to `https://azaroth-tech-hive-test.vercel.app/admin` - should redirect to CMS at `https://azaroth-tech-hive-cms-testing.vercel.app/admin`

## Security Considerations

### Database Isolation
- Staging uses separate `azaroth_staging` database
- Never use production credentials in staging
- Read-only access for public deployment

### CORS Restrictions
- CMS content API only allows GET requests from public site origin
- No wildcard CORS for authenticated endpoints
- Strict CSP headers configured

### Authentication
- CMS requires MFA for all admin operations
- Session handling with secure cookies
- Rate limiting on login endpoints

### Environment Variables
- All secrets stored in Vercel encrypted environment variables
- Never commit actual `.env` files
- Use cryptographically random secrets

## Rollback Procedure

If deployment fails:

### Vercel Rollback
1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "Promote to Production"

### Database Rollback
- Use Neon's Time Travel feature
- Or restore from manual backup

### Asset Rollback
- R2 has versioning (if enabled)
- Or restore from backup bucket

## Troubleshooting

### Function Count Exceeded
If you see "No more than 12 Serverless Functions can be added":
1. Verify build preparation script ran correctly
2. Check `api/` directory contains only intended functions
3. Ensure stub files were removed from `api-cms/` and `api-public/`

### CORS Errors
1. Verify `PUBLIC_SITE_URL` environment variable is set correctly
2. Check vercel.cms.json CORS headers match public site URL
3. Ensure content API returns proper CORS headers

### Database Connection Failed
1. Verify `DATABASE_URL_APP` is correct
2. Check Neon database is active
3. Ensure SSL mode is enabled
4. Verify staging database exists

## Production Migration

When ready to migrate to production:

1. Update URLs in:
   - `vercel.public.json`
   - `vercel.cms.json`
   - `.env.cms.example`
   - `.env.public.example`
   - `api-public/content.ts`
   - `api-cms/content.ts`

2. Create production database in Neon

3. Deploy to production Vercel projects

4. Run migrations on production database

5. Update Cloudflare DNS to point custom domains to Vercel

6. Run full regression testing

## Modified Files Summary

### New Files Created
- `api-public/` - Public API functions directory
- `api-cms/` - CMS API functions directory
- `scripts/prepare-public-api.mjs` - Public build preparation script
- `scripts/prepare-cms-api.mjs` - CMS build preparation script
- `vercel.public.json` - Public deployment configuration
- `vercel.cms.json` - CMS deployment configuration
- `.env.cms.example` - CMS environment variable template
- `.env.public.example` - Public environment variable template
- `api/content.ts` - Public content API endpoint

### Modified Files
- `package.json` - Updated build scripts to include preparation steps
- `DEPLOYMENT.md` - Updated with dual-deployment information
- `.gitignore` - Updated to ignore build artifacts

### Deleted Files
- `api/auth.ts` - Stub file (functionality moved to api-cms/auth/[...path].ts)
- `api/cms.ts` - Stub file (functionality moved to api-cms/cms/[...path].ts)
- `api/media/file/[id].ts` - Functionality consolidated

## Branch Strategy

- `main` - Production code (unchanged)
- `staging` - Integration and testing (current branch)
- Feature branches - Individual changes

**Important**: Never merge staging into main without explicit approval.
