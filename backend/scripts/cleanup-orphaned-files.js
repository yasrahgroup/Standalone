// backend/scripts/cleanup-orphaned-files.js
// Script to clean up orphaned uploaded files
// Run periodically (e.g., via cron) to remove files not referenced in the database
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const UPLOAD_DIR = path.join(__dirname, '../uploads');

async function cleanupOrphanedFiles() {
  try {
    console.log('🧹 Starting orphaned file cleanup...');

    // Get all files from the uploads directory
    if (!fs.existsSync(UPLOAD_DIR)) {
      console.log('Uploads directory does not exist. Nothing to clean.');
      return;
    }

    const uploadedFiles = fs.readdirSync(UPLOAD_DIR);
    console.log(`Found ${uploadedFiles.length} files in uploads directory`);

    if (uploadedFiles.length === 0) {
      console.log('No files to clean up.');
      return;
    }

    // Get all referenced files from the database
    const result = await pool.query(`
      SELECT document_paths
      FROM rfq_submissions
      WHERE document_paths IS NOT NULL
    `);

    // Build a set of all referenced filenames
    const referencedFiles = new Set();
    result.rows.forEach(row => {
      try {
        const docs = typeof row.document_paths === 'string'
          ? JSON.parse(row.document_paths)
          : row.document_paths;
        if (Array.isArray(docs)) {
          docs.forEach(doc => {
            if (doc.filename) {
              referencedFiles.add(doc.filename);
            }
          });
        }
      } catch (error) {
        console.error('Error parsing document_paths:', error);
      }
    });

    console.log(`Found ${referencedFiles.size} referenced files in database`);

    // Identify and remove orphaned files
    let deletedCount = 0;
    for (const file of uploadedFiles) {
      if (!referencedFiles.has(file)) {
        const filePath = path.join(UPLOAD_DIR, file);
        try {
          const stats = fs.statSync(filePath);
          const fileAge = Date.now() - stats.mtimeMs;
          const fileAgeHours = fileAge / (1000 * 60 * 60);

          // Only delete files older than 24 hours to avoid race conditions
          if (fileAgeHours > 24) {
            fs.unlinkSync(filePath);
            console.log(`Deleted orphaned file: ${file} (${fileAgeHours.toFixed(1)}h old)`);
            deletedCount++;
          } else {
            console.log(`Skipping recent file: ${file} (${fileAgeHours.toFixed(1)}h old)`);
          }
        } catch (error) {
          console.error(`Failed to delete file ${file}:`, error.message);
        }
      }
    }

    console.log(`✅ Cleanup complete. Deleted ${deletedCount} orphaned files.`);

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  cleanupOrphanedFiles();
}

module.exports = { cleanupOrphanedFiles };
