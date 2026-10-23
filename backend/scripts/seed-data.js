// backend/scripts/seed-data.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedData() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Seed contact submissions
    const contactSubmissions = [
      {
        full_name: 'John Smith',
        work_email: 'john@techstartup.com',
        phone: '+1-234-567-8900',
        company_name: 'Tech Startup Inc',
        enquiry_about: 'General',
        message: 'I would like to discuss enterprise software solutions for our growing company. Please provide more information about your services.',
        consent: true,
      },
      {
        full_name: 'Sarah Johnson',
        work_email: 'sarah@enterprise-solutions.com',
        phone: '+44-20-7946-0958',
        company_name: 'Enterprise Solutions Ltd',
        enquiry_about: 'Products',
        message: 'We are interested in your Fitness Management System for our chain of health clubs. Can you provide pricing and implementation details?',
        consent: true,
      },
      {
        full_name: 'Michael Chen',
        work_email: 'michael@digital-transform.com',
        phone: null,
        company_name: 'Digital Transform Corp',
        enquiry_about: 'Services',
        message: 'We need help modernizing our legacy systems. Please provide a comprehensive consultation and transformation plan.',
        consent: true,
      },
      {
        full_name: 'Emily Rodriguez',
        work_email: 'emily@healthtech.com',
        phone: '+1-305-123-4567',
        company_name: 'HealthTech Solutions',
        enquiry_about: 'Product Demo',
        message: 'Looking for a comprehensive healthcare management system for our clinics. We need features for patient records, appointment scheduling, and billing.',
        consent: true,
      },
      {
        full_name: 'Robert Wilson',
        work_email: 'robert@manufacturing.com',
        phone: '+1-312-555-0123',
        company_name: 'Manufacturing Co',
        enquiry_about: 'Services',
        message: 'We want to implement an omnichannel commerce platform to unify our online and offline sales channels. Please provide details on your solution.',
        consent: true,
      },
    ];

    for (const submission of contactSubmissions) {
      const query = `
        INSERT INTO contact_submissions 
        (full_name, work_email, phone, company_name, enquiry_about, message, consent)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `;

      const values = [
        submission.full_name,
        submission.work_email,
        submission.phone,
        submission.company_name,
        submission.enquiry_about,
        submission.message,
        submission.consent,
      ];

      await pool.query(query, values);
    }

    console.log(`✅ Seeded ${contactSubmissions.length} contact submissions`);

    // SECURITY NOTE: Admin user creation removed for production security.
    // Use the bootstrap-admin.js script to create an admin account with a secure password.
    // This script should only be run once in a controlled environment.
    console.log('⚠️  Admin user not created by seed script. Run bootstrap-admin.js to create an admin account.');

    console.log('🎉 Database seeding complete!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seedData();
}

module.exports = { seedData };
