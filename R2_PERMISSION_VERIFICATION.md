# Cloudflare R2 Permission Verification Steps

This document provides step-by-step instructions to verify Cloudflare R2 bucket permissions for the Azaroth Tech-Hive staging deployment.

## Prerequisites

- Cloudflare account with access to the project
- R2 buckets already created:
  - `azaroth-private-media` (for CMS uploads)
  - `azaroth-public-media` (for published assets)
- R2 API tokens already created

---

## Step 1: Access Cloudflare Dashboard

1. Log in to https://dash.cloudflare.com
2. Select your account/organization
3. Navigate to **R2** (under **Storage** in the left sidebar)

---

## Step 2: Verify Bucket Configuration

### 2.1 List All Buckets

1. In the R2 dashboard, you should see a list of buckets
2. Verify the following buckets exist:
   - `azaroth-private-media`
   - `azaroth-public-media`

**Expected**: Both buckets should be visible
**Action if missing**: Create the missing bucket

### 2.2 Verify Bucket Settings

For each bucket, click on the bucket name and verify:

**Private Bucket (`azaroth-private-media`)**:
- Bucket should NOT have public access enabled
- No custom domain should be configured (or should be restricted)
- No lifecycle rules that auto-delete content (unless intentional)

**Public Bucket (`azaroth-public-media`)**:
- Bucket may have public access enabled via custom domain
- Custom domain (e.g., `pub-xxx.r2.dev`) should be configured
- Lifecycle rules may be configured for optimization

---

## Step 3: Verify API Token Permissions

### 3.1 Navigate to API Tokens

1. In Cloudflare dashboard, go to **Manage Account** → **API Tokens**
2. Click **Create Token**

### 3.2 Review Existing Tokens

Look for existing R2 API tokens. You should have at least two:

1. **CMS Token** (full access)
2. **Public Token** (read-only access)

### 3.3 Verify CMS Token Permissions

For the CMS deployment token:

**Required Permissions**:
- Account → R2 → Edit (for upload, delete, and management)
- Account → R2 → Read (for retrieval)

**Verification Steps**:
1. Click on the token to view details
2. Check the **Permissions** section
3. Verify it includes:
   - `Account → R2 → Edit`
   - `Account → R2 → Read`

**Expected**: Both Read and Edit permissions
**Security Risk**: If token has broader permissions (e.g., Account → All), create a new restricted token

### 3.4 Verify Public Token Permissions

For the public deployment token:

**Required Permissions**:
- Account → R2 → Read (for retrieval only)
- NO Edit permissions
- NO Delete permissions

**Verification Steps**:
1. Click on the token to view details
2. Check the **Permissions** section
3. Verify it includes:
   - `Account → R2 → Read` ONLY
   - NO `Account → R2 → Edit`
   - NO other account-wide permissions

**Expected**: Read permission only
**Security Risk**: If token has Edit or Delete permissions, create a new restricted token

---

## Step 4: Verify Token Access to Specific Buckets

### 4.1 Using Cloudflare CLI (Optional)

If you have `wrangler` installed:

```bash
# Install wrangler if not installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Test CMS token access to private bucket
wrangler r2 bucket list --config ~/.wrangler/cms-token.toml

# Test public token access to public bucket
wrangler r2 bucket list --config ~/.wrangler/public-token.toml
```

### 4.2 Manual Verification via Dashboard

1. In the R2 dashboard, click on a bucket
2. Try to upload a test file using the CMS credentials
3. Verify upload succeeds for CMS token
4. Try to upload a file using the public credentials
5. Verify upload FAILS for public token (expected behavior)

---

## Step 5: Verify Public Bucket Access

### 5.1 Test Public Access

1. Navigate to the public bucket (`azaroth-public-media`)
2. Upload a test image (e.g., `test.jpg`)
3. Access the file via the public URL:
   ```
   https://pub-<bucket-id>.r2.dev/test.jpg
   ```
4. Verify the file is accessible

**Expected**: File loads in browser
**Action if fails**: Check bucket public access settings

### 5.2 Verify Private Bucket Is Not Publicly Accessible

1. Navigate to the private bucket (`azaroth-private-media`)
2. Upload a test file
3. Try to access via the public URL pattern
4. Verify access is denied (403 or 404 error)

**Expected**: Access denied
**Security Risk**: If file is publicly accessible, the bucket is misconfigured

---

## Step 6: Verify Environment Variables

### 6.1 CMS Environment Variables

Verify the CMS deployment has the following R2 variables:

```bash
R2_ACCOUNT_ID=<your-cloudflare-account-id>
R2_S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<cms-access-key-id>
R2_SECRET_ACCESS_KEY=<cms-secret-access-key>
R2_PRIVATE_BUCKET=azaroth-private-media
R2_PUBLIC_BUCKET=azaroth-public-media
R2_PUBLIC_BASE_URL=https://pub-<bucket-id>.r2.dev
```

**Verification**:
- `R2_ACCESS_KEY_ID` should match the CMS token
- `R2_SECRET_ACCESS_KEY` should match the CMS token secret
- Bucket names should match exactly

### 6.2 Public Environment Variables

Verify the public deployment has the following R2 variables:

```bash
R2_ACCOUNT_ID=<your-cloudflare-account-id>
R2_S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<public-read-only-access-key-id>
R2_SECRET_ACCESS_KEY=<public-read-only-secret-access-key>
R2_PUBLIC_BUCKET=azaroth-public-media
R2_PUBLIC_BASE_URL=https://pub-<bucket-id>.r2.dev
```

**Verification**:
- `R2_ACCESS_KEY_ID` should match the public read-only token
- `R2_SECRET_ACCESS_KEY` should match the public read-only token secret
- `R2_PRIVATE_BUCKET` should NOT be present (public deployment should not know about private bucket)
- Only `R2_PUBLIC_BUCKET` should be present

**Security Risk**: If public deployment has access to private bucket credentials, this is a critical security issue

---

## Step 7: Test Write Access from Public Deployment

### 7.1 Attempt Upload via Public API

1. Deploy the public site to staging
2. Attempt to upload a file via the public API (if such an endpoint exists)
3. Verify the upload fails with permission error

**Expected**: Upload fails with 403 Forbidden or similar permission error
**Security Risk**: If upload succeeds, the public credentials have write access

### 7.2 Attempt Delete from Public Deployment

1. Attempt to delete a file from the public bucket using public credentials
2. Verify the delete fails with permission error

**Expected**: Delete fails with 403 Forbidden
**Security Risk**: If delete succeeds, the public credentials have delete access

---

## Step 8: Verify CORS Configuration (if applicable)

If you have CORS rules configured on R2 buckets:

1. In the R2 dashboard, click on a bucket
2. Go to **Settings** → **CORS**
3. Verify CORS rules are appropriate:
   - Public bucket: May allow GET from your domains
   - Private bucket: Should restrict to CMS origin only or no CORS (server-side only)

**Expected**: CORS rules match your security requirements
**Action if misconfigured**: Update CORS rules to restrict access

---

## Security Checklist

After completing the above steps, verify:

- [ ] Both buckets (`azaroth-private-media`, `azaroth-public-media`) exist
- [ ] Private bucket is NOT publicly accessible
- [ ] Public bucket is publicly accessible via custom domain
- [ ] CMS token has Read and Edit permissions
- [ ] Public token has Read permission ONLY
- [ ] Public token does NOT have Edit or Delete permissions
- [ ] Public deployment does NOT have private bucket credentials
- [ ] Public deployment cannot upload to R2
- [ ] Public deployment cannot delete from R2
- [ ] CMS deployment can upload to both buckets
- [ ] CMS deployment can delete from both buckets
- [ ] Environment variables use correct tokens
- [ ] No production credentials are used in staging

---

## Creating New Restricted Tokens (If Needed)

If the existing tokens have excessive permissions, create new ones:

### Create CMS Token

1. Go to **Manage Account** → **API Tokens**
2. Click **Create Token**
3. Use template: **Custom Token**
4. Permissions:
   - Account → R2 → Edit
   - Account → R2 → Read
5. Account Resources: Include specific account
6. Account Resource Details: Include specific R2 buckets (optional, for additional security)
7. Set TTL (recommended: 90 days or less)
8. Click **Continue to summary** → **Create Token**
9. Copy the token (you won't see it again)

### Create Public Read-Only Token

1. Go to **Manage Account** → **API Tokens**
2. Click **Create Token**
3. Use template: **Custom Token**
4. Permissions:
   - Account → R2 → Read
5. Account Resources: Include specific account
6. Account Resource Details: Include ONLY `azaroth-public-media` bucket
7. Set TTL (recommended: 90 days or less)
8. Click **Continue to summary** → **Create Token**
9. Copy the token (you won't see it again)

---

## Troubleshooting

### Issue: Public deployment can upload files

**Cause**: Public token has Edit permissions

**Solution**:
1. Revoke the current public token
2. Create a new token with Read permission only
3. Update environment variables in Vercel
4. Redeploy

### Issue: Private bucket is publicly accessible

**Cause**: Bucket has public access enabled

**Solution**:
1. Go to bucket settings
2. Disable public access
3. Remove any custom domain pointing to private bucket
4. Verify access is now denied

### Issue: Cannot access public bucket via custom domain

**Cause**: Custom domain not configured or DNS not propagated

**Solution**:
1. Configure custom domain in R2 bucket settings
2. Wait for DNS propagation (up to 24 hours)
3. Verify DNS records are correct

---

## Conclusion

After completing all verification steps, if all checklist items are confirmed, the R2 permissions are correctly configured for staging deployment. If any items fail, address the issues before proceeding with staging deployment.

**Status**: UNVERIFIED until manual verification is completed by the project owner.
