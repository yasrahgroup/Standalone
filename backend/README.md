# Azaroth Backend API

## Overview
This is the Node.js/Express backend for the Azaroth Tech-Hive enterprise application. It provides APIs for contact form submissions, content management, and application functionality.

## Features

### Core APIs
- **Health Check** (`GET /api/health`) - Server status and database connectivity
- **Contact Form Submission** (`POST /api/contact`) - Process contact form submissions
- **Admin Contact Submissions** (`GET /api/admin/contact-submissions`) - Retrieve all contact submissions

### Security
- CORS middleware for cross-origin requests
- Helmet for security headers
- Request validation and sanitization
- Error handling middleware

### Database
- PostgreSQL integration with connection pooling
- Automated database schema initialization
- Data validation and constraints
- Audit logging

### Email Integration
- Nodemailer for contact form notifications
- Professional email templates
- Error handling for email delivery

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
# Copy .env.example to .env
# Edit .env with your database credentials and email settings
```

4. Initialize database:
```bash
npm run db:init
```

5. Seed data (optional):
```bash
npm run db:seed
```

6. Start the server:
```bash
npm start
# or
npm run dev
```

## API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-10-12T10:35:42Z",
  "database": "connected",
  "version": "1.0.0"
}
```

### Contact Form Submission
```http
POST /api/contact
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "workEmail": "john@techstartup.com",
  "phone": "+1-234-567-8900",
  "companyName": "Tech Startup Inc",
  "enquiryAbout": "General",
  "message": "I would like to discuss enterprise software solutions...",
  "consent": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "submissionId": 1
}
```

### Admin - Get Contact Submissions
```http
GET /api/admin/contact-submissions
```

**Response:**
```json
{
  "success": true,
  "submissions": [
    {
      "id": 1,
      "fullName": "John Smith",
      "workEmail": "john@techstartup.com",
      "phone": "+1-234-567-8900",
      "companyName": "Tech Startup Inc",
      "enquiryAbout": "General",
      "message": "I would like to discuss enterprise software solutions...",
      "consent": true,
      "submittedAt": "2026-10-12T10:35:42Z"
    }
  ]
}
```

## Error Handling

### Validation Errors
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

### Server Errors
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Database Schema

### Contact Submissions Table
```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  work_email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255) NOT NULL,
  enquiry_about VARCHAR(100) DEFAULT 'General',
  message TEXT NOT NULL,
  consent BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Node environment (development, production)

### Optional
- `JWT_SECRET`: JWT secret key
- `EMAIL_USER`: Email sender address
- `EMAIL_PASS`: Email sender password
- `CORS_ORIGIN`: CORS origin URL

## Deployment

### Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t azaroth-backend .
docker run -p 3001:3001 --env-file .env azaroth-backend
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3001:3001"
    env_file:
      - .env
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: azaroth_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## Monitoring & Logging

### Health Checks
- Server health endpoint at `/api/health`
- Database connectivity monitoring
- Error tracking and alerting

### Logging
- Morgan for request logging
- Custom logging for database operations
- Error stack traces for debugging

## Security Considerations

### Rate Limiting
- Implement rate limiting for contact form submissions
- Block malicious IP addresses
- Monitor for abuse patterns

### Input Validation
- Email format validation
- Name length requirements
- Message content validation
- Bot detection (honeypot fields)

### Data Protection
- HTTPS enforcement in production
- Secure headers configuration
- Email address validation
- Consent tracking

## Future Enhancements

### Additional Features
- User authentication and authorization
- Admin dashboard
- Email newsletter subscription
- Content management system
- Analytics and reporting
- File uploads

### Performance Optimizations
- Database connection pooling
- Query optimization
- Caching strategies
- Load balancing

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if PostgreSQL is running
psql -h localhost -U postgres -d postgres

# Verify connection string in .env file
# Ensure network connectivity
```

#### Contact Form Not Working
```bash
# Check server logs
# Verify email configuration
# Test with curl:
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","workEmail":"test@example.com","phone":"1234567890","companyName":"Test Company","enquiryAbout":"General","message":"Test message","consent":true}'
```

#### Server Not Starting
```bash
# Check for syntax errors
node server.js

# Check dependencies
npm install

# Start with nodemon for development
npm run dev
```

## License

This project is licensed under the MIT License.

## Contact

For questions, issues, or feature requests:
- GitHub: [repository-url]
- Email: hello@azaroth-techhive.com
