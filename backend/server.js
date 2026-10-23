// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { renderContactConfirmationEmail, renderRfqConfirmationEmail } = require('./emailTemplates');

// Database connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Email transporter with retry logic
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      return;
    } catch (error) {
      console.error(`Email send attempt ${attempt}/${maxRetries} failed:`, error.message);
      if (attempt === maxRetries) {
        throw error;
      }
      // Exponential backoff: 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
    }
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const app = express();
const PORT = process.env.PORT || 3001;

// Configure uploads directory
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for file uploads with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate safe filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uniqueSuffix}-${safeName}`);
  }
});

// File signature (magic bytes) validation
const fileSignatures = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'image/jpeg': [[0xFF, 0xD8, 0xFF]], // JPEG SOI
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]], // PNG header
  'application/zip': [[0x50, 0x4B, 0x03, 0x04], [0x50, 0x4B, 0x05, 0x06], [0x50, 0x4B, 0x07, 0x08]], // ZIP signatures
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0x50, 0x4B, 0x03, 0x04]], // DOCX is ZIP-based
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [[0x50, 0x4B, 0x03, 0x04]], // XLSX is ZIP-based
  'application/x-zip-compressed': [[0x50, 0x4B, 0x03, 0x04], [0x50, 0x4B, 0x05, 0x06], [0x50, 0x4B, 0x07, 0x08]],
};

const validateFileSignature = (buffer, mimetype) => {
  const signatures = fileSignatures[mimetype];
  if (!signatures) return false;
  
  return signatures.some(signature => {
    if (buffer.length < signature.length) return false;
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) return false;
    }
    return true;
  });
};

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'application/zip',
    'application/x-zip-compressed'
  ];
  
  if (!allowedMimes.includes(file.mimetype.toLowerCase())) {
    return cb(new Error('Invalid file type. Allowed: PNG, JPG, WEBP, SVG, GIF, PDF, DOCX, XLSX, ZIP'), false);
  }
  
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB per file
    files: 10 // Max 10 files
  }
});

// Rate limiting configuration
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many contact form submissions from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

const rfqRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 RFQ submissions per hour
  message: {
    success: false,
    error: 'Too many quote requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      formAction: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(o => o.trim());
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static uploads directory
app.use('/uploads', express.static(UPLOAD_DIR));

// CMS & Authentication Routes
const authRoutes = require('./routes/auth')(pool);
const cmsRoutes = require('./routes/cms')(pool, upload);
app.use('/api/auth', authRoutes);
app.use('/api/cms', cmsRoutes);

// Database connection test
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await testDatabaseConnection();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      version: '1.0.0',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Fetch user from database
    const result = await pool.query(
      'SELECT id, email, password, first_name, last_name, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is disabled',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token with 24-hour expiration
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    // Update last login timestamp
    await pool.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Contact form submission endpoint
app.post('/api/contact', contactRateLimit, async (req, res) => {
  try {
    const { fullName, workEmail, phone, companyName, enquiryAbout, message, consent, website_url } = req.body;

    // Honeypot check - if filled, it's a bot
    if (website_url) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
      });
    }

    // Validation
    const errors = [];
    if (!fullName || fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }
    if (!workEmail || !validator.isEmail(workEmail)) {
      errors.push('Valid work email is required');
    }
    if (!companyName || companyName.trim().length < 2) {
      errors.push('Company name must be at least 2 characters');
    }
    if (!enquiryAbout || enquiryAbout.trim() === '') {
      errors.push('Enquiry type is required');
    }
    if (!message || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    if (!consent) {
      errors.push('Consent to contact is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Save to database
    const submissionId = `enq-${Date.now()}`;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    try {
      await pool.query(`
        INSERT INTO "ContactEnquiry" (id, name, "companyName", email, phone, message, status, "ipAddress", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, 'NEW', $7, NOW(), NOW())
      `, [submissionId, fullName.trim(), companyName.trim(), workEmail.trim(), phone?.trim() || null, message.trim(), ip]);
    } catch (dbErr) {
      console.warn('ContactEnquiry insert fallback:', dbErr.message);
    }

    try {
      await pool.query(`
        INSERT INTO contact_submissions 
        (full_name, work_email, phone, company_name, enquiry_about, message, consent, submitted_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `, [fullName.trim(), workEmail.trim(), phone?.trim() || null, companyName.trim(), enquiryAbout || 'General', message.trim(), consent]);
    } catch (legacyErr) {
      // Legacy table optional in Neon
    }

    // Send admin email notification with retry (non-blocking - failure doesn't affect submission)
    sendEmailWithRetry({
      from: process.env.EMAIL_USER,
      to: 'hello@azaroth-techhive.com',
      subject: `New Contact Form Submission - ${fullName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${workEmail}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Enquiry Type:</strong> ${enquiryAbout}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Consent:</strong> ${consent ? 'Yes' : 'No'}</p>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
      `,
    }).catch(emailError => {
      console.error('Admin email notification failed after retries (submission saved):', emailError);
    });

    // Send customer confirmation email with retry (non-blocking - failure doesn't affect submission)
    sendEmailWithRetry({
      from: process.env.EMAIL_USER,
      to: workEmail,
      subject: `We've Received Your Enquiry | Azaroth Tech-Hive`,
      html: renderContactConfirmationEmail({
        fullName,
        workEmail,
        companyName,
        enquiryAbout,
        phone,
        submissionId: submissionId,
        submittedAt: new Date().toISOString()
      })
    }).catch(emailError => {
      console.error('Customer confirmation email failed after retries (submission saved):', emailError);
    });

    res.json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: submissionId,
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save submission. Please try again.',
    });
  }
});

// Get all contact submissions (admin endpoint)
app.get('/api/admin/contact-submissions', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
      if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'super_admin')) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Admin access required',
        });
      }
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const result = await pool.query(
      `SELECT id, full_name, work_email, phone, company_name, enquiry_about, message, consent, submitted_at
       FROM contact_submissions
       ORDER BY submitted_at DESC
       LIMIT 100`
    );

    res.json({
      success: true,
      submissions: result.rows,
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// RFQ submission endpoint with file upload support
app.post('/api/rfq', rfqRateLimit, upload.array('documents', 10), async (req, res) => {
  const client = await pool.connect();
  let uploadedFiles = [];

  try {
    await client.query('BEGIN');

    const {
      solutionCategories,
      projectScope,
      targetTimeline,
      budgetRange,
      requirementsDescription,
      ndaRequired,
      fullName,
      workEmail,
      phone,
      companyName,
      country
    } = req.body;

    // Validation
    const errors = [];
    if (!solutionCategories) errors.push('Solution categories are required');
    if (!projectScope || projectScope.trim().length < 2) errors.push('Project scope is required');
    if (!targetTimeline) errors.push('Target timeline is required');
    if (!budgetRange) errors.push('Budget range is required');
    if (!requirementsDescription || requirementsDescription.trim().length < 15) {
      errors.push('Requirements description must be at least 15 characters');
    }
    if (!fullName || fullName.trim().length < 2) errors.push('Full name is required');
    if (!workEmail || !validator.isEmail(workEmail)) errors.push('Valid work email is required');
    if (!companyName || companyName.trim().length < 2) errors.push('Company name is required');
    if (!country || country.trim().length < 2) errors.push('Country is required');

    if (errors.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Parse solution categories from JSON string
    let categories;
    try {
      categories = typeof solutionCategories === 'string' 
        ? JSON.parse(solutionCategories) 
        : solutionCategories;
    } catch {
      categories = [];
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'At least one solution category is required'
      });
    }

    // Generate unique reference ID
    const referenceId = `AZR-RFQ-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      }));
    }

    // Insert RFQ submission into CRM
    try {
      await client.query(`
        INSERT INTO "RFQRequest" (
          id, name, "companyName", email, phone, country,
          "projectType", "projectDescription", "expectedTimeline", "estimatedBudget",
          status, "ipAddress", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'NEW', $11, NOW(), NOW()
        )
      `, [
        referenceId, fullName.trim(), companyName.trim(), workEmail.trim(), phone?.trim() || null,
        country.trim(), Array.isArray(categories) ? categories.join(', ') : 'Solutions',
        requirementsDescription.trim(), targetTimeline, budgetRange, req.ip || '127.0.0.1'
      ]);
    } catch (crmErr) {
      console.warn('RFQRequest insert fallback:', crmErr.message);
    }

    try {
      const query = `
        INSERT INTO rfq_submissions 
        (reference_id, solution_categories, project_scope, target_timeline, budget_range, 
         requirements_description, nda_required, full_name, work_email, phone, 
         company_name, country, document_paths)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id
      `;

      const values = [
        referenceId,
        JSON.stringify(categories),
        projectScope.trim(),
        targetTimeline,
        budgetRange,
        requirementsDescription.trim(),
        ndaRequired === 'true' || ndaRequired === true,
        fullName.trim(),
        workEmail.trim(),
        phone?.trim() || null,
        companyName.trim(),
        country.trim(),
        JSON.stringify(uploadedFiles)
      ];

      await client.query(query, values);
    } catch (legacyRfqErr) {
      // Legacy table optional
    }

    await client.query('COMMIT');

    // Send admin email notification with retry (non-blocking - failure doesn't affect submission)
    sendEmailWithRetry({
      from: process.env.EMAIL_USER,
      to: 'hello@azaroth-techhive.com',
      subject: `New RFQ Submission - ${referenceId}`,
      html: `
        <h2>New Request for Quote</h2>
        <p><strong>Reference ID:</strong> ${referenceId}</p>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${workEmail}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Project Scope:</strong> ${projectScope}</p>
        <p><strong>Timeline:</strong> ${targetTimeline}</p>
        <p><strong>Budget:</strong> ${budgetRange}</p>
        <p><strong>Solutions:</strong> ${categories.join(', ')}</p>
        <p><strong>NDA Required:</strong> ${ndaRequired ? 'Yes' : 'No'}</p>
        <p><strong>Requirements:</strong></p>
        <p>${requirementsDescription}</p>
        <p><strong>Documents:</strong> ${uploadedFiles.length > 0 ? uploadedFiles.length + ' file(s) uploaded' : 'None'}</p>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
      `,
    }).catch(emailError => {
      console.error('Admin email notification failed after retries (RFQ saved):', emailError);
    });

    // Send customer confirmation email with retry (non-blocking - failure doesn't affect submission)
    sendEmailWithRetry({
      from: process.env.EMAIL_USER,
      to: workEmail,
      subject: `RFQ Received | Reference ${referenceId} | Azaroth Tech-Hive`,
      html: renderRfqConfirmationEmail({
        fullName,
        workEmail,
        companyName,
        referenceId,
        projectScope,
        targetTimeline,
        solutionCategories: categories,
        phone,
        country,
        submittedAt: new Date().toISOString(),
        uploadedFiles: uploadedFiles.map(f => f.originalName)
      })
    }).catch(emailError => {
      console.error('Customer confirmation email failed after retries (RFQ saved):', emailError);
    });

    res.json({
      success: true,
      message: 'RFQ submitted successfully',
      data: { referenceId }
    });

  } catch (error) {
    await client.query('ROLLBACK');

    // Clean up uploaded files on error
    uploadedFiles.forEach(file => {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (cleanupError) {
        console.error('Failed to clean up file:', cleanupError);
      }
    });

    console.error('RFQ submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save RFQ submission. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Start server
async function startServer() {
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.log('⚠️  Warning: Database connection failed. Server started without database.');
    console.log('   Run "npm run db:init" to initialize the database.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
