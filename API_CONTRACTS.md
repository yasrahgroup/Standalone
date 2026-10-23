# Azaroth Tech-Hive API Contracts

## Overview

This document defines the actual API contracts between the frontend and backend services.

---

## Contact Form API

### Endpoint
`POST /api/contact`

### Request

**Content-Type:** `application/json`

**Body:**
```json
{
  "fullName": "string (required, min 2 chars)",
  "workEmail": "string (required, valid email)",
  "phone": "string (optional)",
  "companyName": "string (required, min 2 chars)",
  "enquiryAbout": "string (optional, default: 'General')",
  "message": "string (required, min 10 chars)",
  "consent": "boolean (required)"
}
```

### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "submissionId": 123
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Full name must be at least 2 characters",
    "Valid work email is required"
  ]
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message (development only)"
}
```

### Frontend Mapping

The frontend maps the backend `submissionId` to `data.referenceId`:
```typescript
{
  success: true,
  data: { referenceId: submissionId.toString() },
  message: backend.message
}
```

---

## RFQ Form API

### Endpoint
`POST /api/rfq`

### Request

**Content-Type:** `multipart/form-data` (browser sets boundary)

**Fields:**
- `solutionCategories`: JSON string array of selected solution categories
- `projectScope`: String (required, min 2 chars)
- `targetTimeline`: String (required)
- `budgetRange`: String (required)
- `requirementsDescription`: String (required, min 15 chars)
- `ndaRequired`: String "true" or "false" (required)
- `fullName`: String (required, min 2 chars)
- `workEmail`: String (required, valid email)
- `phone`: String (optional)
- `companyName`: String (required, min 2 chars)
- `country`: String (required, min 2 chars)
- `documents`: File array (optional, max 10 files, max 15MB each)

**Allowed File Types:**
- PDF: `application/pdf`
- DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- XLSX: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- PNG: `image/png`
- JPEG: `image/jpeg`
- ZIP: `application/zip`, `application/x-zip-compressed`

### Response

**Success (200):**
```json
{
  "success": true,
  "message": "RFQ submitted successfully",
  "data": {
    "referenceId": "AZR-RFQ-1728901234-5678"
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Solution categories are required",
    "Project scope is required"
  ]
}
```

**File Upload Error (400):**
```json
{
  "success": false,
  "message": "Invalid file type. Allowed: PDF, DOCX, XLSX, PNG, JPG, ZIP"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message (development only)"
}
```

### Backend Processing

1. **Validation:** Server-side validation of all required fields
2. **File Storage:** Files stored in `backend/uploads/` with safe filenames
3. **Database:** RFQ data inserted into `rfq_submissions` table
4. **Email:** Notification sent to `hello@azaroth-techhive.com`
5. **Transaction:** Database transaction with rollback on failure
6. **Cleanup:** Uploaded files deleted on error

---

## Configuration

### Environment Variables

**Frontend (.env):**
- `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:3001`)
- `VITE_API_TIMEOUT`: Request timeout in milliseconds (default: `5000`)

**Backend (.env):**
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: `3001`)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed frontend origin (default: `http://localhost:5173`)
- `EMAIL_USER`: SMTP email username
- `EMAIL_PASS`: SMTP email password

### CORS Configuration

**Development:** Allows `http://localhost:5173` (Vite dev server)
**Production:** Must be set to production frontend URL

---

## Error Handling

### Timeout Behavior

- Frontend aborts requests after `VITE_API_TIMEOUT` milliseconds
- Timeout returns error: `"Request timeout"`
- User data preserved on timeout for retry

### Network Errors

- Network failures return descriptive error messages
- Frontend displays error with fallback contact options
- Form data preserved for retry

### Database Failures

- Backend returns 500 error on database failure
- RFQ transactions rolled back on partial failure
- Uploaded files cleaned up on error

---

## Security

### File Upload Security

- File size limit: 15MB per file
- File count limit: 10 files per submission
- MIME type validation
- Safe filename generation (timestamp-random-sanitized)
- Files stored in non-public directory
- No file execution permissions

### Input Validation

- Server-side validation on all endpoints
- Email format validation using validator library
- SQL injection prevention via parameterized queries
- XSS prevention via input sanitization

### CORS

- Credentials allowed for cookie-based auth
- Origin restricted to configured frontend URL
- Helmet security headers configured

---

## Database Schema

### contact_submissions

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| full_name | VARCHAR(255) | NOT NULL |
| work_email | VARCHAR(255) | NOT NULL, email format check |
| phone | VARCHAR(50) | Nullable, phone format check |
| company_name | VARCHAR(255) | NOT NULL |
| enquiry_about | VARCHAR(100) | DEFAULT 'General' |
| message | TEXT | NOT NULL |
| consent | BOOLEAN | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### rfq_submissions

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| reference_id | VARCHAR(50) | UNIQUE, NOT NULL |
| solution_categories | JSONB | NOT NULL |
| project_scope | VARCHAR(255) | NOT NULL |
| target_timeline | VARCHAR(255) | NOT NULL |
| budget_range | VARCHAR(255) | NOT NULL |
| requirements_description | TEXT | NOT NULL |
| nda_required | BOOLEAN | NOT NULL |
| full_name | VARCHAR(255) | NOT NULL |
| work_email | VARCHAR(255) | NOT NULL, email format check |
| phone | VARCHAR(50) | Nullable |
| company_name | VARCHAR(255) | NOT NULL |
| country | VARCHAR(100) | NOT NULL |
| document_paths | JSONB | DEFAULT '[]' |
| status | VARCHAR(50) | DEFAULT 'pending' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

---

## Migration Instructions

To add the RFQ table to an existing database:

```bash
cd backend
npm run db:init
```

This will execute `scripts/schema.sql` which includes:
- RFQ submissions table
- Indexes for performance
- Trigger for updated_at timestamp

---

## Testing

### Manual Testing

**Contact Form:**
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "workEmail": "test@example.com",
    "phone": "+1234567890",
    "companyName": "Test Company",
    "enquiryAbout": "General",
    "message": "This is a test message",
    "consent": true
  }'
```

**RFQ Form:**
```bash
curl -X POST http://localhost:3001/api/rfq \
  -F "solutionCategories=[\"Cloud and Distributed Systems\"]" \
  -F "projectScope=Full Scale Platform Engineering" \
  -F "targetTimeline=1 - 3 Months" \
  -F "budgetRange=$50,000 – $100,000" \
  -F "requirementsDescription=Test requirements description" \
  -F "ndaRequired=true" \
  -F "fullName=Test User" \
  -F "workEmail=test@example.com" \
  -F "phone=+1234567890" \
  -F "companyName=Test Company" \
  -F "country=United States"
```

---

## Version History

- **v1.0** (2026-10-13): Initial API contracts documentation
  - Contact endpoint: POST /api/contact
  - RFQ endpoint: POST /api/rfq
  - File upload support with validation
  - Database schema defined
