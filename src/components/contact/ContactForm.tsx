import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { ContactFormData } from '../../types';
import { Button } from '../common/Button';
import { apiService, ContactSubmission } from '../../services/api';
import { companyInfo } from '../../data/companyData';

const WHATSAPP_URL = `https://wa.me/${companyInfo.headquarters.whatsapp.replace(/[^0-9]/g, '')}`;
const FALLBACK_EMAIL = 'hello@azaroth-techhive.com';
const FALLBACK_PHONE = '+916379480931';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    workEmail: '',
    phone: '',
    companyName: '',
    enquiryAbout: 'General',
    message: '',
    consent: false,
    website_url: '', // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.workEmail.trim()) {
      errs.workEmail = 'Work Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
      errs.workEmail = 'Please provide a valid email address.';
    }
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required.';
    if (!formData.enquiryAbout || formData.enquiryAbout.trim() === '') {
      errs.enquiryAbout = 'Please select an enquiry type.';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Please provide at least a brief summary of your requirements (min 10 characters).';
    }
    if (!formData.consent) {
      errs.consent = 'Please confirm you agree to be contacted about your enquiry.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Bot check
    if (formData.website_url) {
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const submissionData: ContactSubmission = {
        fullName: formData.fullName,
        workEmail: formData.workEmail,
        phone: formData.phone,
        companyName: formData.companyName,
        enquiryAbout: formData.enquiryAbout,
        message: formData.message,
        consent: formData.consent,
      };

      const response = await apiService.submitContactForm(submissionData);
      
      if (response.success) {
        setSubmitted(true);
      } else {
        setSubmissionError(response.error || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      setSubmissionError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div aria-live="polite" style={{
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-success-border, #A7F3D0)',
        textAlign: 'center',
        boxShadow: '0 20px 40px -15px rgba(4, 120, 87, 0.12)',
      }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          backgroundColor: 'var(--color-success-light, #ECFDF5)',
          color: 'var(--color-success, #047857)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary, #1F2937)', marginBottom: '0.75rem' }}>
          Message Received
        </h3>

        <p style={{ maxWidth: '480px', margin: '0 auto 2rem auto', color: 'var(--color-text-secondary, #4B5563)', lineHeight: 1.6 }}>
          Thank you, <strong>{formData.fullName}</strong>. We have received your enquiry and will respond soon.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                fullName: '',
                workEmail: '',
                phone: '',
                companyName: '',
                enquiryAbout: 'General',
                message: '',
                consent: false,
                website_url: '',
              });
              setErrors({});
            }}
            variant="outline"
            size="sm"
          >
            Send Another Enquiry
          </Button>

          <Button
            href={WHATSAPP_URL}
            variant="primary"
            size="sm"
          >
            Instant WhatsApp Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--color-border-subtle)',
      boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.06)',
    }}>
      {/* Honeypot Input */}
      <input
        type="text"
        name="website_url"
        value={formData.website_url}
        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
      }}>
        
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            type="text"
            className="form-input"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'contact-fullName-error' : undefined}
          />
          {errors.fullName && <span id="contact-fullName-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.fullName}</span>}
        </div>

        {/* Work Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="workEmail">Work Email *</label>
          <input
            id="workEmail"
            type="email"
            className="form-input"
            placeholder="Enter your business email"
            value={formData.workEmail}
            onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
            aria-invalid={Boolean(errors.workEmail)}
            aria-describedby={errors.workEmail ? 'contact-workEmail-error' : undefined}
          />
          {errors.workEmail && <span id="contact-workEmail-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.workEmail}</span>}
        </div>

        {/* Company Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="companyName">Company / Organization *</label>
          <input
            id="companyName"
            type="text"
            className="form-input"
            placeholder="Enter your company name"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            aria-invalid={Boolean(errors.companyName)}
            aria-describedby={errors.companyName ? 'contact-companyName-error' : undefined}
          />
          {errors.companyName && <span id="contact-companyName-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.companyName}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone / WhatsApp Number</label>
          <input
            id="phone"
            type="tel"
            className="form-input"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
          />
          {errors.phone && <span id="contact-phone-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.phone}</span>}
        </div>

      </div>

      {/* Enquiry About */}
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label" htmlFor="enquiryAbout">Enquiry About *</label>
          <select
            id="enquiryAbout"
            className="form-select"
            value={formData.enquiryAbout}
            onChange={(e) => setFormData({ ...formData, enquiryAbout: e.target.value })}
            aria-invalid={Boolean(errors.enquiryAbout)}
            aria-describedby={errors.enquiryAbout ? 'contact-enquiryAbout-error' : undefined}
          >
            <option value="" disabled>Select an option</option>
            <option value="General">General</option>
            <option value="Products">Products</option>
            <option value="Services">Services</option>
            <option value="Enquiries">Enquiries</option>
            <option value="Request for Quote">Request for Quote</option>
          </select>
          {errors.enquiryAbout && <span id="contact-enquiryAbout-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.enquiryAbout}</span>}
        </div>

      {/* How Can We Help */}
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label className="form-label" htmlFor="message">How Can We Help? *</label>
        <textarea
          id="message"
          rows={4}
          className="form-textarea"
          placeholder="Describe your requirements or questions in detail..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && <span id="contact-message-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.message}</span>}
      </div>

      {/* Consent Checkbox */}
      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            style={{ marginTop: '0.2rem' }}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
          />
          <span>
            I agree that Azaroth Tech-Hive may contact me about this enquiry in accordance with the{' '}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-link-main, #4338CA)', textDecoration: 'underline' }}>
              Privacy Policy
            </a>.
          </span>
        </label>
        {errors.consent && <span id="contact-consent-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.consent}</span>}
      </div>

      {/* Submission Error */}
      {submissionError && (
        <div role="alert" style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: 'var(--color-alert-light, #FFE4E6)',
          border: '1px solid var(--color-alert-border, #FECDD3)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-alert, #E11D48)',
          fontSize: '0.875rem',
        }}>
          <div>
            <AlertCircle size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
            {submissionError}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
            <a href={`mailto:${FALLBACK_EMAIL}`} style={{ color: 'var(--color-alert, #E11D48)', fontWeight: 600 }}>
              Email us directly
            </a>
            <a href={`tel:${FALLBACK_PHONE}`} style={{ color: 'var(--color-alert, #E11D48)', fontWeight: 600 }}>
              Call +91 6379480931
            </a>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          icon={<Send size={16} />}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};
