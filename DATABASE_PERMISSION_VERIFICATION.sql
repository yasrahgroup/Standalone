-- Database Permission Verification SQL
-- Run these queries in the Neon SQL Editor to verify database role permissions
-- for the Azaroth Tech-Hive staging deployment.

-- ============================================
-- STEP 1: Verify Staging Database Isolation
-- ============================================

-- Check that you are connected to the staging database
SELECT current_database();

-- Expected output: azarstaging (or your staging database name)
-- If this shows a different database (e.g., azaroth_prod), you are connected to production.

-- ============================================
-- STEP 2: List All Database Roles
-- ============================================

-- List all roles in the database
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin
FROM pg_roles
WHERE rolname IN ('azaroth_public_ro', 'azaroth_app', 'azaroth_migrator')
ORDER BY rolname;

-- Expected roles:
-- - azaroth_public_ro (read-only role for public site)
-- - azaroth_app (application role for CMS)
-- - azaroth_migrator (migration role for schema changes)

-- ============================================
-- STEP 3: Verify Public Read-Only Role Permissions
-- ============================================

-- Check if azaroth_public_ro role exists
DO $$
DECLARE
    role_name TEXT := 'azaroth_public_ro';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
        RAISE NOTICE 'Role % does not exist', role_name;
    ELSE
        RAISE NOTICE 'Role % exists', role_name;
    END IF;
END $$;

-- Check role privileges on database
SELECT
    datname as database_name,
    has_database_privilege('azaroth_public_ro', datname, 'CONNECT') as can_connect,
    has_database_privilege('azaroth_public_ro', datname, 'TEMPORARY') as can_create_temp
FROM pg_database
WHERE datname = current_database();

-- Expected: can_connect = true, can_create_temp = false

-- Check role privileges on schema
SELECT
    nspname as schema_name,
    has_schema_privilege('azaroth_public_ro', nspname, 'USAGE') as can_use_schema,
    has_schema_privilege('azaroth_public_ro', nspname, 'CREATE') as can_create_in_schema
FROM pg_namespace
WHERE nspname NOT LIKE 'pg_%' AND nspname NOT LIKE 'information_schema'
ORDER BY nspname;

-- Expected: can_use_schema = true for staging schema, can_create_in_schema = false

-- Check table-level privileges for read-only role
SELECT
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'azaroth_public_ro'
ORDER BY table_schema, table_name, privilege_type;

-- Expected: Only SELECT privileges should be present
-- WARNING: If INSERT, UPDATE, DELETE, or TRUNCATE appear, the role has write access

-- ============================================
-- STEP 4: Verify CMS App Role Permissions
-- ============================================

-- Check if azaroth_app role exists
DO $$
DECLARE
    role_name TEXT := 'azaroth_app';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
        RAISE NOTICE 'Role % does not exist', role_name;
    ELSE
        RAISE NOTICE 'Role % exists', role_name;
    END IF;
END $$;

-- Check role privileges on database
SELECT
    datname as database_name,
    has_database_privilege('azaroth_app', datname, 'CONNECT') as can_connect,
    has_database_privilege('azaroth_app', datname, 'TEMPORARY') as can_create_temp
FROM pg_database
WHERE datname = current_database();

-- Expected: can_connect = true, can_create_temp = true

-- Check table-level privileges for app role
SELECT
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'azaroth_app'
ORDER BY table_schema, table_name, privilege_type;

-- Expected: SELECT, INSERT, UPDATE, DELETE should be present for CMS tables
-- WARNING: If privileges are missing, CMS may not function correctly

-- ============================================
-- STEP 5: Verify Migrator Role Permissions
-- ============================================

-- Check if azaroth_migrator role exists
DO $$
DECLARE
    role_name TEXT := 'azaroth_migrator';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
        RAISE NOTICE 'Role % does not exist', role_name;
    ELSE
        RAISE NOTICE 'Role % exists', role_name;
    END IF;
END $$;

-- Check if migrator role has CREATE privilege on schema
SELECT
    nspname as schema_name,
    has_schema_privilege('azaroth_migrator', nspname, 'USAGE') as can_use_schema,
    has_schema_privilege('azaroth_migrator', nspname, 'CREATE') as can_create_in_schema
FROM pg_namespace
WHERE nspname NOT LIKE 'pg_%' AND nspname NOT LIKE 'information_schema'
ORDER BY nspname;

-- Expected: can_use_schema = true, can_create_in_schema = true (for running migrations)

-- ============================================
-- STEP 6: Verify Rate Limiting Table Exists
-- ============================================

-- Check if auth_rate_limits table exists
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_name = 'auth_rate_limits';

-- Expected: One row showing the table exists in the staging schema

-- If table does not exist, run this to create it:
-- CREATE TABLE IF NOT EXISTS auth_rate_limits (
--     id SERIAL PRIMARY KEY,
--     ip_address VARCHAR(45) NOT NULL,
--     email VARCHAR(255),
--     user_id VARCHAR(255),
--     attempt_type VARCHAR(50) NOT NULL,
--     attempt_count INTEGER DEFAULT 1,
--     last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL,
--     locked_until TIMESTAMP WITH TIME ZONE,
--     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
-- );

-- Create index for performance
-- CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_ip_type 
--     ON auth_rate_limits(ip_address, attempt_type, created_at);
-- CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_user_type 
--     ON auth_rate_limits(user_id, attempt_type, created_at);

-- ============================================
-- STEP 7: Test Read-Only Role Cannot Write
-- ============================================

-- This test should be run as the azaroth_public_ro role
-- SET ROLE azaroth_public_ro;

-- Try to insert into a table (should fail)
-- INSERT INTO auth_rate_limits (ip_address, attempt_type, last_attempt_at, created_at)
-- VALUES ('127.0.0.1', 'test', NOW(), NOW());

-- If this succeeds, the azaroth_public_ro role has write permissions (SECURITY ISSUE)
-- Expected: ERROR: permission denied for table auth_rate_limits

-- Reset role
-- RESET ROLE;

-- ============================================
-- STEP 8: Verify Connection Strings
-- ============================================

-- Check which role is currently connected
SELECT current_user, session_user;

-- Expected: Should be your admin role, not azaroth_public_ro or azaroth_app
-- The application will connect using the roles specified in connection strings

-- ============================================
-- SECURITY CHECKLIST
-- ============================================

-- After running the above queries, verify:

-- [ ] Current database is staging (not production)
-- [ ] azaroth_public_ro role exists
-- [ ] azaroth_public_ro role has only SELECT privileges on tables
-- [ ] azaroth_public_ro role cannot INSERT, UPDATE, DELETE, or TRUNCATE
-- [ ] azaroth_public_ro role cannot CREATE in schemas
-- [ ] azaroth_app role exists
-- [ ] azaroth_app role has SELECT, INSERT, UPDATE, DELETE on CMS tables
-- [ ] azaroth_migrator role exists
-- [ ] azaroth_migrator role can CREATE in schemas
-- [ ] auth_rate_limits table exists
-- [ ] auth_rate_limits has appropriate indexes

-- If any check fails, the database permissions are not correctly configured
-- and must be fixed before staging deployment.
