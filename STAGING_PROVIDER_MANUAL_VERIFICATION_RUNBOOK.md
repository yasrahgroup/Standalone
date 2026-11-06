# Staging Provider Manual Verification Runbook

**Purpose**: This runbook provides step-by-step instructions for a human operator to manually verify provider-side security controls for the Azaroth Tech Hive staging environment.

**Scope**: Staging environment provider-side security verification
**Staging URLs**: 
- Public: `azaroth-tech-hive-test.vercel.app`
- CMS: `azaroth-tech-hive-cms-testing.vercel.app`

**Verification Controls**: 20 total (11 Neon database controls, 9 R2 storage controls)

**Prerequisites**:
- Access to Neon console with staging project credentials
- Access to Cloudflare dashboard with account credentials
- Access to Vercel dashboard with project credentials
- Read-only access to all provider resources (no write operations required)

**Strict Execution Boundaries**:
- ✅ Execute only read-only queries and inspections
- ✅ Do not modify any provider configurations
- ✅ Do not create, rotate, or revoke credentials
- ✅ Do not upload or delete any objects
- ✅ Do not deploy or trigger any builds
- ✅ Do not access production resources beyond authorized metadata comparison

---

## Part 1: Neon Database Security Verification

### Control NEON-01: Staging Neon Project and Branch Identity

**Objective**: Verify the actual staging Neon project and branch identity, and confirm separation from production.

#### Step 1: Access Neon Console

1. Navigate to https://console.neon.tech
2. Log in with your Neon account credentials
3. Locate the staging project (check project names for "staging", "test", or similar indicators)

#### Step 2: Identify Staging Project

1. Click on the project identified as staging
2. Record the following information (for evidence collection):
   - Project ID (will be redacted later)
   - Project name
   - Region
3. Navigate to the **Branches** section
4. Identify the staging branch (typically named `main`, `staging`, or similar)
5. Record the branch ID (will be redacted later)

#### Step 3: Verify Endpoint Identity

1. Navigate to the **Branches** section
2. Click on the staging branch
3. Locate the **Connection Details** panel
4. Record the endpoint hostname (e.g., `ep-xxx.aws.neon.tech`)
5. Verify the endpoint matches the staging environment configuration

#### Step 4: Compare with Production (Metadata Only)

1. Identify the production Neon project (if accessible)
2. Record production project ID and branch ID (for comparison only)
3. Verify that staging and production have different project IDs or branch IDs
4. **Do not access production database data**

#### Evidence Collection Template

| Attribute | Staging Value | Production Value | Isolation Result | Status |
|---|---|---|---|---|
| Neon project ID | [REDACTED] | [REDACTED] | Different/Same | PASS/FAIL |
| Branch ID | [REDACTED] | [REDACTED] | Different/Same | PASS/FAIL |
| Endpoint hostname | [REDACTED] | [REDACTED] | Different/Same | PASS/FAIL |
| Database name | [REDACTED] | [REDACTED] | Different/Same | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Staging project/branch is different from production
- FAIL: Staging and production share the same project or branch
- UNVERIFIED: Unable to determine due to access limitations

---

### Control NEON-02: Staging Database Isolation from Production

**Objective**: Verify that the staging database is isolated from production at the database level.

#### Step 1: Identify Staging Database

1. In Neon console, navigate to the staging project
2. Navigate to the **SQL Editor** tab
3. Execute the following read-only query:

```sql
-- List all databases in the current project
SELECT datname 
FROM pg_database 
WHERE datistemplate = false
ORDER BY datname;
```

4. Record the database names (will be redacted later)
5. Identify the staging database (expected: `azaroth_staging` or similar)

#### Step 2: Verify Database Separation

1. If production project is accessible, execute the same query in production
2. Compare the database lists
3. Verify that staging database does not exist in production
4. Verify that production database does not exist in staging

#### Step 3: Verify Connection String Separation

1. Check the staging environment configuration files (`.env.cms.example`, `.env.public.example`)
2. Verify that the connection string specifies the staging database name
3. Confirm that staging connection strings do not reference production database names

#### Evidence Collection Template

| Check | Expected Result | Actual Result | Status |
|---|---|---|---|
| Staging database exists | Yes | Yes/No | PASS/FAIL |
| Staging database name matches config | `azaroth_staging` | [REDACTED] | PASS/FAIL |
| Production database not in staging | Yes | Yes/No | PASS/FAIL |
| Staging database not in production | Yes | Yes/No | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Staging database is separate from production
- FAIL: Staging and production share the same database
- UNVERIFIED: Unable to verify due to access limitations

---

### Control NEON-03: Public Role Identification

**Objective**: Verify that the `azaroth_public_ro` role exists and is correctly configured.

#### Step 1: Verify Role Exists

1. In Neon SQL Editor, connect to the staging database
2. Execute the following read-only query:

```sql
-- Check if the public read-only role exists
SELECT rolname, 
       rolcanlogin, 
       rolsuper, 
       rolcreaterole, 
       rolcreatedb, 
       rolbypassrls
FROM pg_roles 
WHERE rolname = 'azaroth_public_ro';
```

3. Record the role attributes (will be redacted if sensitive)

#### Step 2: Verify Role Attributes

**Expected Results**:
- `rolcanlogin`: should be `false` (NOLOGIN role)
- `rolsuper`: should be `false`
- `rolcreaterole`: should be `false`
- `rolcreatedb`: should be `false`
- `rolbypassrls`: should be `false`

#### Evidence Collection Template

| Attribute | Expected Value | Actual Value | Status |
|---|---|---|---|
| Role exists | Yes | Yes/No | PASS/FAIL |
| rolcanlogin | false | [REDACTED] | PASS/FAIL |
| rolsuper | false | [REDACTED] | PASS/FAIL |
| rolcreaterole | false | [REDACTED] | PASS/FAIL |
| rolcreatedb | false | [REDACTED] | PASS/FAIL |
| rolbypassrls | false | [REDACTED] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Role exists with correct NOLOGIN and non-elevated attributes
- FAIL: Role does not exist or has elevated privileges
- UNVERIFIED: Unable to verify due to access limitations

---

### Control NEON-04: Public Role SELECT Permissions

**Objective**: Verify that the `azaroth_public_ro` role has only the required SELECT permissions.

#### Step 1: Check Schema-Level Privileges

1. In Neon SQL Editor, execute:

```sql
-- Check schema-level privileges for public role
SELECT grantee, 
       privilege_type, 
       table_schema
FROM information_schema.role_schema_grants 
WHERE grantee = 'azaroth_public_ro';
```

2. Verify that only `USAGE` privilege is granted on the `public` schema

#### Step 2: Check Table-Level Privileges

```sql
-- Check table-level privileges for public role
SELECT grantee, 
       table_name, 
       privilege_type, 
       column_name
FROM information_schema.role_table_grants 
WHERE grantee = 'azaroth_public_ro'
ORDER BY table_name, privilege_type;
```

3. Verify the following expected grants:
   - `SELECT` on `v_published_content` (view)
   - `SELECT` on specific columns of `content_documents`
   - `SELECT` on specific columns of `media_versions`
   - `SELECT` on specific columns of `media_slot_definitions`
   - `SELECT` on specific columns of `media_slot_usages`

#### Step 3: Verify No Write Privileges

```sql
-- Check for any write privileges (should return empty)
SELECT grantee, 
       table_name, 
       privilege_type
FROM information_schema.role_table_grants 
WHERE grantee = 'azaroth_public_ro'
  AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER');
```

4. Expected result: 0 rows

#### Evidence Collection Template

| Privilege Type | Expected | Actual Count | Status |
|---|---|---|---|
| Schema USAGE | 1 | [COUNT] | PASS/FAIL |
| Table SELECT | 5+ | [COUNT] | PASS/FAIL |
| Table INSERT | 0 | [COUNT] | PASS/FAIL |
| Table UPDATE | 0 | [COUNT] | PASS/FAIL |
| Table DELETE | 0 | [COUNT] | PASS/FAIL |
| Table TRUNCATE | 0 | [COUNT] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Only SELECT privileges granted, no write privileges
- FAIL: Write privileges detected or missing required SELECT privileges
- UNVERIFIED: Unable to verify due to access limitations

---

### Control NEON-05: Public Role INSERT Denied

**Objective**: Verify that the `azaroth_public_ro` role cannot execute INSERT operations.

#### Step 1: Check Effective INSERT Privilege

```sql
-- Check effective INSERT privilege on key tables
SELECT has_table_privilege('azaroth_public_ro', 'content_documents', 'INSERT') as can_insert_content;
SELECT has_table_privilege('azaroth_public_ro', 'media_versions', 'INSERT') as can_insert_media;
SELECT has_table_privilege('azaroth_public_ro', 'media_slot_usages', 'INSERT') as can_insert_slots;
```

2. Expected result: All should return `false`

#### Step 2: Verify Explicit Revocation

```sql
-- Check if INSERT was explicitly revoked
SELECT grantee, 
       table_name, 
       privilege_type
FROM information_schema.role_table_grants 
WHERE grantee = 'azaroth_public_ro'
  AND privilege_type = 'INSERT';
```

3. Expected result: 0 rows

#### Evidence Collection Template

| Table | Expected INSERT | Actual INSERT | Status |
|---|---|---|---|
| content_documents | false | [true/false] | PASS/FAIL |
| media_versions | false | [true/false] | PASS/FAIL |
| media_slot_usages | false | [true/false] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: INSERT privilege is denied on all tables
- FAIL: INSERT privilege is granted on any table
- UNVERIFIED: Unable to verify due to access limitations

---

### Control NEON-06: Public Role UPDATE Denied

**Objective**: Verify that the `azaroth_public_ro` role cannot execute UPDATE operations.

#### Step 1: Check Effective UPDATE Privilege

```sql
-- Check effective UPDATE privilege on key tables
SELECT has_table_privilege('azaroth_public_ro', 'content_documents', 'UPDATE') as can_update_content;
SELECT has_table_privilege('azaroth_public_ro', 'media_versions', 'UPDATE') as can_update_media;
SELECT has_table_privilege('azaroth_public_ro', 'media_slot_usages', 'UPDATE') as can_update_slots;
```

2. Expected result: All should return `false`

#### Evidence Collection Template

| Table | Expected UPDATE | Actual UPDATE | Status |
|---|---|---|---|
| content_documents | false | [true/false] | PASS/FAIL |
| media_versions | false | [true/false] | PASS/FAIL |
| media_slot_usages | false | [true/false] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: UPDATE privilege is denied on all tables
- FAIL: UPDATE privilege is granted on any table
- UNVERIFIED: Unable to verify due to access limitations

---

### Control NEON-07: Public Role DELETE Denied

**Objective**: Verify that the `azaroth_public_ro` role cannot execute DELETE operations.

#### Step 1: Check Effective DELETE Privilege

```sql
-- Check effective DELETE privilege on key tables
SELECT has_table_privilege('azaroth_public_ro', 'content_documents', 'DELETE') as can_delete_content;
SELECT has_table_privilege('azaroth_public_ro', 'media_versions', 'DELETE') as can_delete_media;
SELECT has_table_privilege('azaroth_public_ro', 'media_slot_usages', 'DELETE') as can_delete_slots;
```

2. Expected result: All should return `false`

#### Evidence Collection Template

| Table | Expected DELETE | Actual DELETE | Status |
|---|---|---|---|
| content_documents | false | [true/false] | PASS/FAIL |
| media_versions | false | [true/false] | PASS/FAIL |
| media_slot_usages | false | [true/false] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: DELETE privilege is denied on all tables
- FAIL: DELETE privilege is granted on any table
- UNVERIFIED: Unable to verify due to access limitations

---

### Control NEON-08: Public Role TRUNCATE Denied

**Objective**: Verify that the `azaroth_public_ro` role cannot execute TRUNCATE operations.

#### Step 1: Check Effective TRUNCATE Privilege

```sql
-- Check effective TRUNCATE privilege on key tables
SELECT has_table_privilege('azaroth_public_ro', 'content_documents', 'TRUNCATE') as can_truncate_content;
SELECT has_table_privilege('azaroth_public_ro', 'media_versions', 'TRUNCATE') as can_truncate_media;
SELECT has_table_privilege('azaroth_public_ro', 'media_slot_usages', 'TRUNCATE') as can_truncate_slots;
```

2. Expected result: All should return `false`

#### Evidence Collection Template

| Table | Expected TRUNCATE | Actual TRUNCATE | Status |
|---|---|---|---|
| content_documents | false | [true/false] | PASS/FAIL |
| media_versions | false | [true/false] | PASS/FAIL |
| media_slot_usages | false | [true/false] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: TRUNCATE privilege is denied on all tables
- FAIL: TRUNCATE privilege is granted on any table
- UNVERIFIED: Unable to verify due to access limitations

---

### Control NEON-09: Public Role CREATE Denied

**Objective**: Verify that the `azaroth_public_ro` role cannot execute CREATE operations (tables, schemas, databases).

#### Step 1: Check Database-Level CREATE Privilege

```sql
-- Check database-level CREATE privilege
SELECT has_database_privilege('azaroth_public_ro', current_database(), 'CREATE') as can_create_db;
SELECT has_database_privilege('azaroth_public_ro', current_database(), 'TEMP') as can_create_temp;
```

2. Expected result: Both should return `false`

#### Step 2: Check Schema-Level CREATE Privilege

```sql
-- Check schema-level CREATE privilege
SELECT has_schema_privilege('azaroth_public_ro', 'public', 'CREATE') as can_create_schema;
```

3. Expected result: Should return `false`

#### Evidence Collection Template

| Privilege Type | Expected | Actual | Status |
|---|---|---|---|
| Database CREATE | false | false | PASS/FAIL |
| Database TEMP | false | false | PASS/FAIL |
| Schema CREATE | false | false | PASS/FAIL |

**Acceptance Criteria**:
- PASS: All CREATE privileges are denied
- FAIL: Any CREATE privilege is granted
- UNVERIFIED: Unable to verify due to access limitations

---

### Control NEON-10: Public Role Has No Elevated Privileges

**Objective**: Verify that the `azaroth_public_ro` role has no superuser or equivalent elevated privileges.

#### Step 1: Check Role Attributes

```sql
-- Check all role attributes
SELECT rolname,
       rolsuper,
       rolcreaterole,
       rolcreatedb,
       rolcanlogin,
       rolreplication,
       rolbypassrls,
       rolconnlimit,
       rolpassword
FROM pg_roles
WHERE rolname = 'azaroth_public_ro';
```

2. Verify all elevated are `false`:
   - `rolsuper`: false
   - `rolcreaterole`: false
   - `rolcreatedb`: false
   - `rolbypassrls`: false
   - `rolreplication`: false

#### Evidence Collection Template

| Attribute | Expected | Actual | Status |
|---|---|---|---|
| rolsuper | false | false | PASS/FAIL |
| rolcreaterole | false | false | PASS/FAIL |
| rolcreatedb | false | false | PASS/FAIL |
| rolbypassrls | false | false | PASS/FAIL |
| rolreplication | false | false | PASS/FAIL |

**Acceptance Criteria**:
- PASS: No elevated privileges detected
- FAIL: One or more elevated privileges detected
- UNVERIFIED: Unable to verify due to access limitations

---

### Control NEON-11: Role Inheritance and Default Grants

**Objective**: Verify that the `azaroth_public_ro` role does not inherit unintended privileges and has no dangerous default grants.

#### Step 1: Check Role Membership

```sql
-- Check if public role inherits from other roles
SELECT m.roleid::regrole as member_role,
       m.roleid as member_oid,
       r.rolname as role_name,
       m.member as member_of
FROM pg_auth_members m
JOIN pg_roles r ON m.roleid = r.oid
WHERE m.member = (SELECT oid FROM pg_roles WHERE rolname = 'azaroth_public_ro')
   OR m.roleid = (SELECT oid FROM pg_roles WHERE rolname = 'azaroth_public_ro');
```

2. Expected result: 0 rows (no role membership)

#### Step 2: Check PUBLIC Role Grants

```sql
-- Check if PUBLIC role has unintended grants
SELECT grantee,
       table_name,
       privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'PUBLIC'
  AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER');
```

3. Expected result: 0 rows (no dangerous grants to PUBLIC)

#### Step 3: Check Default Privileges

```sql
-- Check default privileges for future object creation
SELECT defaclrole::regrole,
       defaclnamespace::regnamespace,
       defaclobjtype,
       defaclacl
FROM pg_default_acl
WHERE defaclrole = (SELECT oid FROM pg_roles WHERE rolname = 'azaroth_public_ro')
   OR defaclrole = (SELECT oid FROM pg_roles WHERE rolname = 'public');
```

4. Review the output for any dangerous default grants

#### Evidence Collection Template

| Check | Expected Result | Actual Result | Status |
|---|---|---|---|
| Role membership count | 0 | [COUNT] | PASS/FAIL |
| PUBLIC dangerous grants | 0 | [COUNT] | PASS/FAIL |
| Default privileges for azaroth_public_ro | None | [REDACTED] | PASS/FAIL |
| Default privileges for public | None | [REDACTED] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: No unintended role inheritance or default grants
- FAIL: Dangerous role membership or default grants detected
- UNVERIFIED: Unable to verify due to access limitations

---

## Part 2: Cloudflare R2 Storage Security Verification

### Control R2-01: Public and Private Bucket Identity

**Objective**: Verify the actual Cloudflare R2 public and private bucket identities.

#### Step 1: Access Cloudflare Dashboard

1. Navigate to https://dash.cloudflare.com
2. Log in with your Cloudflare account credentials
3. Select the correct account (if multiple accounts)

#### Step 2: Navigate to R2 Section

1. In the left sidebar, click on **R2** (under **Storage**)
2. This displays all R2 buckets in the account

#### Step 3: Identify Public Bucket

1. Look for a bucket named `azaroth-public-media` or similar
2. Click on the bucket to view details
3. Record the following information (for evidence collection):
   - Bucket ID (will be redacted later)
   - Bucket name
   - Region
   - Creation date

#### Step 4: Identify Private Bucket

1. Look for a bucket named `azaroth-private-media` or similar
2. Click on the bucket to view details
3. Record the following information (for evidence collection):
   - Bucket ID (will be redacted later)
   - Bucket name
   - Region
   - Creation date

#### Step 5: Verify Bucket Separation

1. Verify that public and private buckets have different IDs
2. Verify that public bucket is not the same as private bucket

#### Evidence Collection Template

| Attribute | Public Bucket | Private Bucket | Separation Result | Status |
|---|---|---|---|---|
| Bucket name | [REDACTED] | [REDACTED] | Different/Same | PASS/FAIL |
| Bucket ID | [REDACTED] | [REDACTED] | Different/Same | PASS/FAIL |
| Region | [REDACTED] | [REDACTED] | N/A | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Public and private buckets are separate
- FAIL: Public and private buckets are the same
- UNVERIFIED: Unable to verify due to access limitations

---

### Control R2-02: Public Token Scope and Permissions

**Objective**: Verify that the public R2 token has the correct scope and permissions.

#### Step 1: Identify Credential Type

**CRITICAL DISTINCTION**: Determine whether the application uses:
- **S3-compatible credentials** (Access Key ID + Secret Access Key)
- **Cloudflare API Token** (Bearer token with specific permissions)

**How to identify**:
1. Check the staging environment configuration files (`.env.cms.example`, `.env.public.example`)
2. Look for variable names:
   - If variables are `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`: S3-compatible credentials
   - If variable is `CLOUDFLARE_API_TOKEN` or similar: Cloudflare API Token
3. This runbook assumes S3-compatible credentials based on the example files

#### Step 2: Navigate to R2 Token Management

**For S3-Compatible Credentials**:
1. In Cloudflare dashboard, navigate to **R2** section
2. Click on **R2 API Tokens** (or **Manage R2 API Tokens**)
3. This displays all S3-compatible API tokens

**For Cloudflare API Tokens**:
1. In Cloudflare dashboard, navigate to **My Profile** → **API Tokens**
2. This displays all Cloudflare API tokens

#### Step 3: Identify Public Token

1. Look for a token used by the public staging deployment
2. The token name may include "public", "readonly", or similar indicators
3. Click on the token to view details

#### Step 4: Inspect Token Permissions

**For S3-Compatible Credentials**:
1. Review the token's bucket permissions
2. Verify the token is restricted to the public bucket only
3. Verify the token has only read permissions (GetObject, ListBucket if needed)
4. Verify the token does not have write permissions (PutObject, DeleteObject, etc.)

**For Cloudflare API Tokens**:
1. Review the token's permission scopes
2. Verify the token has only R2 read permissions
3. Verify the token does not have R2 write permissions
4. Verify the token is restricted to specific buckets if possible

#### Evidence Collection Template (S3-Compatible)

| Permission | Expected | Actual | Status |
|---|---|---|---|
| Bucket access | Public bucket only | [REDACTED] | PASS/FAIL |
| GetObject | Allowed | Allowed/Denied | PASS/FAIL |
| PutObject | Denied | Allowed/Denied | PASS/FAIL |
| DeleteObject | Denied | Allowed/Denied | PASS/FAIL |
| ListBucket | As needed | [REDACTED] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Token has only read permissions on public bucket
- FAIL: Token has write permissions or access to private bucket
- UNVERIFIED: Unable to verify due to access limitations

---

### Control R2-03: Public Token Object Read Access

**Objective**: Verify that the public token can successfully read objects from the public bucket.

#### Step 1: Identify a Test Object

1. In Cloudflare dashboard, navigate to the public R2 bucket
2. Click on the **Browse** or **Objects** tab
3. Identify an existing public object (e.g., an image file)
4. Record the object key (path/filename)

#### Step 2: Test Read Access Using AWS CLI (Optional)

If you have AWS CLI configured with the public token credentials:

```bash
# List objects in public bucket
aws s3 ls s3://[public-bucket-name] --endpoint-url=[r2-endpoint]

# Get object metadata
aws s3api head-object --bucket=[public-bucket-name] --key=[object-key] --endpoint-url=[r2-endpoint]

# Download object (read test)
aws s3 cp s3://[public-bucket-name]/[object-key] ./test-download --endpoint-url=[r2-endpoint]
```

#### Step 3: Test Read Access Using cURL (Alternative)

If the public bucket has public delivery configured:

```bash
# Test public URL access
curl -I https://pub-[bucket-id].r2.dev/[object-key]
```

Expected HTTP status: `200 OK`

#### Evidence Collection Template

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| List objects | Success | Success/Failure | PASS/FAIL |
| Head object | 200 OK | [HTTP STATUS] | PASS/FAIL |
| Get object | 200 OK | [HTTP STATUS] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Public token can read objects from public bucket
- FAIL: Public token cannot read objects from public bucket
- UNVERIFIED: Unable to test due to access limitations

---

### Control R2-04: Public Token Object Write Denied

**Objective**: Verify that the public token cannot write objects to the public bucket.

#### Step 1: Test Write Access Using AWS CLI (Optional)

```bash
# Attempt to upload a test file
echo "test" > test-upload.txt
aws s3 cp test-upload.txt s3://[public-bucket-name]/test-upload.txt --endpoint-url=[r2-endpoint]
```

Expected result: `Access Denied` error

#### Step 2: Test Write Access Using cURL (Alternative)

```bash
# Attempt to upload via public URL (should fail)
curl -X PUT -d "test" https://pub-[bucket-id].r2.dev/test-upload.txt
```

Expected HTTP status: `403 Forbidden` or `405 Method Not Allowed`

#### Evidence Collection Template

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| PutObject | Access Denied | [ERROR MESSAGE] | PASS/FAIL |
| HTTP PUT | 403/405 | [HTTP STATUS] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Public token cannot write to public bucket
- FAIL: Public token can write to public bucket
- UNVERIFIED: Unable to test due to access limitations

---

### Control R2-05: Public Token Object Delete Denied

**Objective**: Verify that the public token cannot delete objects from the public bucket.

#### Step 1: Test Delete Access Using AWS CLI (Optional)

```bash
# Attempt to delete an object
aws s3 rm s3://[public-bucket-name]/[existing-object-key] --endpoint-url=[r2-endpoint]
```

Expected result: `Access Denied` error

#### Step 2: Test Delete Access Using cURL (Alternative)

```bash
# Attempt to delete via public URL (should fail)
curl -X DELETE https://pub-[bucket-id].r2.dev/[object-key]
```

Expected HTTP status: `403 Forbidden` or `405 Method Not Allowed`

#### Evidence Collection Template

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| DeleteObject | Access Denied | [ERROR MESSAGE] | PASS/FAIL |
| HTTP DELETE | 403/405 | [HTTP STATUS] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Public token cannot delete from public bucket
- FAIL: Public token can delete from public bucket
- UNVERIFIED: Unable to test due to access limitations

---

### Control R2-06: Public Token Private Bucket Listing Denied

**Objective**: Verify that the public token cannot list objects in the private bucket.

#### Step 1: Test Private Bucket Listing Using AWS CLI

```bash
# Attempt to list private bucket
aws s3 ls s3://[private-bucket-name] --endpoint-url=[r2-endpoint]
```

Expected result: `Access Denied` error

#### Evidence Collection Template

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| List private bucket | Access Denied | [ERROR MESSAGE] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Public token cannot list private bucket
- FAIL: Public token can list private bucket
- UNVERIFIED: Unable to test due to access limitations

---

### Control R2-07: Public Token Private Object Access Denied

**Objective**: Verify that the public token cannot access objects in the private bucket.

#### Step 1: Identify a Private Test Object

1. In Cloudflare dashboard, navigate to the private R2 bucket
2. Click on the **Browse** or **Objects** tab
3. Identify an existing private object
4. Record the object key (path/filename)

#### Step 2: Test Private Object Access Using AWS CLI

```bash
# Attempt to get private object metadata
aws s3api head-object --bucket=[private-bucket-name] --key=[object-key] --endpoint-url=[r2-endpoint]

# Attempt to download private object
aws s3 cp s3://[private-bucket-name]/[object-key] ./test-download --endpoint-url=[r2-endpoint]
```

Expected result: `Access Denied` error

#### Evidence Collection Template

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Head private object | Access Denied | [ERROR MESSAGE] | PASS/FAIL |
| Get private object | Access Denied | [ERROR MESSAGE] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Public token cannot access private bucket objects
- FAIL: Public token can access private bucket objects
- UNVERIFIED: Unable to test due to access limitations

---

### Control R2-08: Private Bucket Delivery Exposure

**Objective**: Verify that the private bucket has no unintended public delivery configuration.

#### Step 1: Check Bucket Public Access Settings

1. In Cloudflare dashboard, navigate to the private R2 bucket
2. Click on **Settings** or **Properties**
3. Look for **Public Access** or **Public URL** settings
4. Verify that public access is **disabled**

#### Step 2: Check for Custom Domains

1. In the bucket settings, check for **Custom Domains**
2. Verify that no custom domains are configured for the private bucket
3. If custom domains exist, verify they have proper authentication

#### Step 3: Check for Workers or APIs

1. In Cloudflare dashboard, navigate to **Workers**
2. Review any Workers that might access R2
3. Verify that no Worker exposes private bucket objects publicly

#### Evidence Collection Template

| Check | Expected Result | Actual Result | Status |
|---|---|---|---|
| Public access disabled | Yes | Yes/No | PASS/FAIL |
| Custom domains | None | [COUNT] | PASS/FAIL |
| Exposing Workers | None | [COUNT] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Private bucket has no public delivery configuration
- FAIL: Private bucket has unintended public delivery
- UNVERIFIED: Unable to verify due to access limitations

---

### Control R2-09: Public Delivery Configuration

**Objective**: Verify that the public bucket delivery is configured correctly for public-only exposure.

#### Step 1: Check Public Bucket Delivery Settings

1. In Cloudflare dashboard, navigate to the public R2 bucket
2. Click on **Settings** or **Properties**
3. Look for **Public Access** or **Public URL** settings
4. Verify that public access is **enabled** (if intended)
5. Record the public URL (will be redacted later)

#### Step 2: Verify Public URL Structure

1. The public URL should follow the pattern: `https://pub-[bucket-id].r2.dev`
2. Verify that the URL is accessible
3. Test accessing a known public object via the public URL

#### Evidence Collection Template

| Check | Expected Result | Actual Result | Status |
|---|---|---|---|
| Public access enabled | Yes | Yes/No | PASS/FAIL |
| Public URL accessible | Yes | Yes/No | PASS/FAIL |
| Public URL structure | Correct | [REDACTED] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Public bucket delivery is configured correctly
- FAIL: Public bucket delivery is misconfigured
- UNVERIFIED: Unable to verify due to access limitations

---

## Part 3: Vercel Environment Configuration Verification

### Objective: Verify Staging Environment Variables

#### Step 1: Access Vercel Dashboard

1. Navigate to https://vercel.com/dashboard
2. Log in with your Vercel account credentials

#### Step 2: Access Public Staging Project

1. Locate the project `azaroth-tech-hive-test`
2. Click on the project
3. Navigate to **Settings** → **Environment Variables**

#### Step 3: Verify Public Environment Variables

1. Review the environment variables for the staging environment
2. Verify that:
   - `DATABASE_URL_PUBLIC_RO` points to the staging Neon database
   - `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` are the public read-only credentials
   - `R2_PUBLIC_BUCKET` matches the public bucket name
   - No production credentials are present

#### Step 4: Access CMS Staging Project

1. Locate the project `azaroth-tech-hive-cms-testing`
2. Click on the project
3. Navigate to **Settings** → **Environment Variables**

#### Step 5: Verify CMS Environment Variables

1. Review the environment variables for the staging environment
2. Verify that:
   - `DATABASE_URL_MIGRATOR` and `DATABASE_URL_APP` point to the staging Neon database
   - `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` are the CMS credentials (may have broader access)
   - `R2_PRIVATE_BUCKET` matches the private bucket name
   - No production credentials are present

#### Evidence Collection Template

| Project | Variable | Expected Pattern | Actual Value (Redacted) | Status |
|---|---|---|---|---|
| Public | DATABASE_URL_PUBLIC_RO | Staging endpoint | [REDACTED] | PASS/FAIL |
| Public | R2_PUBLIC_BUCKET | Public bucket name | [REDACTED] | PASS/FAIL |
| CMS | DATABASE_URL_APP | Staging endpoint | [REDACTED] | PASS/FAIL |
| CMS | R2_PRIVATE_BUCKET | Private bucket name | [REDACTED] | PASS/FAIL |

**Acceptance Criteria**:
- PASS: Staging environment variables point to staging resources only
- FAIL: Staging environment variables reference production resources
- UNVERIFIED: Unable to verify due to access limitations

---

## Part 4: Evidence Collection and Redaction

### Evidence Redaction Procedures

**Before sharing any evidence, redact the following sensitive information**:

#### Neon Database Redactions
- Neon project IDs (e.g., `neon-db-xxx`)
- Branch IDs (e.g., `br-xxx`)
- Endpoint hostnames (e.g., `ep-xxx.aws.neon.tech`)
- Database passwords
- Connection strings (full URLs)
- Role passwords (if any)

#### Cloudflare R2 Redactions
- Cloudflare account IDs (e.g., `0b77626fc26857e4e11e0388e404bfbc`)
- Bucket IDs (e.g., `2b99371e721647a4abcefc599b4ff7ec`)
- R2 access key IDs (e.g., `AKIAIOSFODNN7EXAMPLE`)
- R2 secret access keys (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
- Public URLs containing bucket IDs (e.g., `pub-2b99371e721647a4abcefc599b4ff7ec.r2.dev`)
- API tokens (full token strings)

#### Vercel Redactions
- Project IDs
- Environment variable values (except non-sensitive patterns)
- API tokens
- Webhook URLs

#### Redaction Format

Use the following format for redacted values:
- Replace with: `[REDACTED]`
- For partial identification: `[REDACTED: PROJECT_ID]`, `[REDACTED: BUCKET_NAME]`

**Example**:
```
Before: DATABASE_URL=postgres://user:password@ep-abc123.aws.neon.tech/azaroth_staging
After:  DATABASE_URL=postgres://user:[REDACTED]@[REDACTED: ENDPOINT]/azaroth_staging
```

---

## Part 5: Final Acceptance Matrix

### Complete Verification Results

| ID | Security Requirement | Expected Result | Status | Evidence Reference |
|---|---|---|---|---|
| NEON-01 | Staging Neon project/branch identity established | Actual provider identity confirmed | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-02 | Staging database isolated from production | Separate staging resource established | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-03 | Public role identified | Actual connected role confirmed | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-04 | Public role SELECT permissions | Only required read access | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-05 | Public role INSERT denied | No effective INSERT privilege | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-06 | Public role UPDATE denied | No effective UPDATE privilege | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-07 | Public role DELETE denied | No effective DELETE privilege | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-08 | Public role TRUNCATE denied | No effective TRUNCATE privilege | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-09 | Public role CREATE denied | No effective CREATE privilege | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-10 | Public role has no elevated privileges | No superuser or equivalent privilege | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| NEON-11 | Role inheritance and default grants reviewed | No unintended inherited/future write access | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| R2-01 | Public token identity established | Actual provider token identified | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| R2-02 | Public token scope | Restricted to public bucket | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| R2-03 | Public token object read | Allowed | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| R2-04 | Public token object write | Denied by policy | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| R2-05 | Public token object delete | Denied by policy | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| R2-06 | Public token private bucket listing | Denied | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| R2-07 | Public token private object access | Denied | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| R2-08 | Private bucket delivery exposure | No unintended public access | PASS/FAIL/UNVERIFIED | [Evidence file/section] |
| R2-09 | Public delivery configuration | Public-only exposure confirmed | PASS/FAIL/UNVERIFIED | [Evidence file/section] |

---

## Part 6: Final Approval Checklist

### Pre-Approval Requirements

Before approving the staging environment for deployment, verify the following:

- [ ] All 20 security controls have been manually verified
- [ ] All verification evidence has been collected and documented
- [ ] All sensitive identifiers and credentials have been redacted
- [ ] No FAILED controls remain (all must be PASS or UNVERIFIED with justification)
- [ ] All UNVERIFIED controls have documented justification for the unverified status
- [ ] Evidence has been reviewed by a second qualified operator (if required by policy)
- [ ] The verification report has been updated with actual provider evidence
- [ ] The final security classification has been determined based on evidence

### Approval Decision

**If all critical controls are PASS**:
- Classification: VERIFIED
- Staging deployment: APPROVED
- Sign-off: [Operator Name], [Date]

**If any critical control is FAIL**:
- Classification: BLOCKED
- Staging deployment: NOT APPROVED
- Required action: Remediate failed controls and re-verify

**If any critical control is UNVERIFIED**:
- Classification: PARTIALLY VERIFIED — ADDITIONAL EVIDENCE REQUIRED
- Staging deployment: CONDITIONALLY APPROVED (if risk accepted) or NOT APPROVED
- Required action: Complete verification of unverified controls

### Sign-Off

**Operator Name**: __________________________

**Date**: __________________________

**Verification Classification**: VERIFIED / PARTIALLY VERIFIED / BLOCKED

**Deployment Decision**: APPROVED / CONDITIONALLY APPROVED / NOT APPROVED

**Comments**: __________________________

---

## Appendix: Credential Type Distinction

### S3-Compatible Credentials vs Cloudflare API Tokens

**S3-Compatible Credentials**:
- Format: Access Key ID + Secret Access Key
- Used with AWS CLI or S3-compatible SDKs
- Managed in Cloudflare R2 → R2 API Tokens
- Permission scope: Bucket-level operations (GetObject, PutObject, etc.)
- Example variable names: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

**Cloudflare API Tokens**:
- Format: Bearer token string
- Used with Cloudflare API
- Managed in Cloudflare Dashboard → My Profile → API Tokens
- Permission scope: Account-level or zone-level permissions
- Example variable names: `CLOUDFLARE_API_TOKEN`, `CF_API_TOKEN`

**Important**: These are not interchangeable. The application code determines which credential type is used. This runbook assumes S3-compatible credentials based on the example environment files, but you must verify the actual credential type used by the deployed application.

---

**End of Runbook**
