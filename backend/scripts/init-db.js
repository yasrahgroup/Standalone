// backend/scripts/init-db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Read and execute schema file
    const fs = require('fs');
    const schemaSQL = fs.readFileSync('./scripts/schema.sql', 'utf8');

    await pool.query(schemaSQL);
    console.log('✅ Database schema created successfully');

    // Create indexes
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(work_email);
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at ON contact_submissions(submitted_at);
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
    `;

    await pool.query(indexSQL);
    console.log('✅ Indexes created successfully');

    // Create audit trigger
    const triggerSQL = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_update_updated_at
      BEFORE UPDATE ON contact_submissions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    await pool.query(triggerSQL);
    console.log('✅ Audit trigger created successfully');

    console.log('🎉 Database initialization complete!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
