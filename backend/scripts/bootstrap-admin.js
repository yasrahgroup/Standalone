// backend/scripts/bootstrap-admin.js
// Secure admin account bootstrap script
// Run this ONCE in a controlled environment to create the initial admin account
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const readline = require('readline');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function bootstrapAdmin() {
  try {
    console.log('🔐 Admin Account Bootstrap');
    console.log('⚠️  This script should only be run once in a controlled environment\n');

    const email = await question('Enter admin email: ');
    const firstName = await question('Enter first name: ');
    const lastName = await question('Enter last name: ');
    const password = await question('Enter password (min 12 characters): ');
    const confirmPassword = await question('Confirm password: ');

    // Validation
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (!firstName || !lastName) {
      throw new Error('First and last name are required');
    }
    if (password.length < 12) {
      throw new Error('Password must be at least 12 characters');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Check if admin already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Admin account with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert admin user
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, role`,
      [email, hashedPassword, firstName, lastName, 'admin', true]
    );

    console.log('\n✅ Admin account created successfully');
    console.log(`   Email: ${result.rows[0].email}`);
    console.log(`   Role: ${result.rows[0].role}`);
    console.log(`   User ID: ${result.rows[0].id}`);
    console.log('\n⚠️  Store these credentials securely. Do not share them.\n');

  } catch (error) {
    console.error('\n❌ Bootstrap failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    rl.close();
  }
}

if (require.main === module) {
  bootstrapAdmin();
}

module.exports = { bootstrapAdmin };
