-- backend/scripts/schema.sql

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT chk_user_role CHECK (role IN ('admin', 'super_admin'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  work_email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255) NOT NULL,
  enquiry_about VARCHAR(100) DEFAULT 'General',
  message TEXT NOT NULL,
  consent BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT,

  CONSTRAINT chk_email_format CHECK (work_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_phone_format CHECK (phone IS NULL OR phone ~* '^[0-9\s\-\(\)\+]+$')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(work_email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_consent ON contact_submissions(consent);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON contact_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO contact_submissions 
(full_name, work_email, phone, company_name, enquiry_about, message, consent) 
VALUES 
('John Smith', 'john@techstartup.com', '+1-234-567-8900', 'Tech Startup Inc', 'General', 
 'I would like to discuss enterprise software solutions for our growing company. Please provide more information about your services.', true),
('Sarah Johnson', 'sarah@enterprise-solutions.com', '+44-20-7946-0958', 'Enterprise Solutions Ltd', 'Products', 
 'We are interested in your Fitness Management System for our chain of health clubs. Can you provide pricing and implementation details?', true),
('Michael Chen', 'michael@digital-transform.com', NULL, 'Digital Transform Corp', 'Services', 
 'We need help modernizing our legacy systems. Please provide a comprehensive consultation and transformation plan.', true)
ON CONFLICT (id) DO NOTHING;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_id INTEGER NOT NULL,
  action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  user_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_action CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- RFQ submissions table
CREATE TABLE IF NOT EXISTS rfq_submissions (
  id SERIAL PRIMARY KEY,
  reference_id VARCHAR(50) UNIQUE NOT NULL,
  solution_categories JSONB NOT NULL,
  project_scope VARCHAR(255) NOT NULL,
  target_timeline VARCHAR(255) NOT NULL,
  budget_range VARCHAR(255) NOT NULL,
  requirements_description TEXT NOT NULL,
  nda_required BOOLEAN NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  work_email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  document_paths JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_rfq_email_format CHECK (work_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_rfq_status CHECK (status IN ('pending', 'reviewed', 'in_progress', 'completed', 'rejected'))
);

-- Create indexes for RFQ table
CREATE INDEX IF NOT EXISTS idx_rfq_submissions_reference_id ON rfq_submissions(reference_id);
CREATE INDEX IF NOT EXISTS idx_rfq_submissions_email ON rfq_submissions(work_email);
CREATE INDEX IF NOT EXISTS idx_rfq_submissions_status ON rfq_submissions(status);
CREATE INDEX IF NOT EXISTS idx_rfq_submissions_created_at ON rfq_submissions(created_at);

-- Create trigger for updated_at on RFQ table
CREATE TRIGGER trigger_update_rfq_updated_at
BEFORE UPDATE ON rfq_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
