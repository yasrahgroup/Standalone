// import React, { useState } from 'react';
// import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
// import { ContactFormData } from '../../types';
// import { Button } from '../common/Button';
// import { apiService, ContactSubmission } from '../../services/api';
// import { companyInfo } from '../../data/companyData';

// const WHATSAPP_URL = `https://wa.me/${companyInfo.headquarters.whatsapp.replace(/[^0-9]/g, '')}`;
// const FALLBACK_EMAIL = 'hello@azaroth-techhive.com';
// const FALLBACK_PHONE = '+916379480931';

// export const ContactForm: React.FC = () => {
//   const [formData, setFormData] = useState<ContactFormData>({
//     fullName: '',
//     workEmail: '',
//     phone: '',
//     companyName: '',
//     enquiryAbout: 'General',
//     message: '',
//     consent: false,
//     website_url: '', // Honeypot field
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [submissionError, setSubmissionError] = useState<string | null>(null);

//   const validate = () => {
//     const errs: Record<string, string> = {};
//     if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
//     if (!formData.workEmail.trim()) {
//       errs.workEmail = 'Work Email is required.';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
//       errs.workEmail = 'Please provide a valid email address.';
//     }
//     if (!formData.companyName.trim()) errs.companyName = 'Company name is required.';
//     if (!formData.enquiryAbout || formData.enquiryAbout.trim() === '') {
//       errs.enquiryAbout = 'Please select an enquiry type.';
//     }
//     if (!formData.message.trim() || formData.message.length < 10) {
//       errs.message = 'Please provide at least a brief summary of your requirements (min 10 characters).';
//     }
//     if (!formData.consent) {
//       errs.consent = 'Please confirm you agree to be contacted about your enquiry.';
//     }
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // Bot check
//     if (formData.website_url) {
//       return;
//     }

//     if (!validate()) return;

//     setIsSubmitting(true);
//     setSubmissionError(null);

//     try {
//       const submissionData: ContactSubmission = {
//         fullName: formData.fullName,
//         workEmail: formData.workEmail,
//         phone: formData.phone,
//         companyName: formData.companyName,
//         enquiryAbout: formData.enquiryAbout,
//         message: formData.message,
//         consent: formData.consent,
//       };

//       const response = await apiService.submitContactForm(submissionData);

//       if (response.success) {
//         setSubmitted(true);
//       } else {
//         setSubmissionError(response.error || 'Failed to submit form. Please try again.');
//       }
//     } catch (error) {
//       setSubmissionError('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div aria-live="polite" style={{
//         padding: '3rem 2rem',
//         borderRadius: 'var(--radius-xl)',
//         backgroundColor: '#ffffff',
//         border: '1px solid var(--color-success-border, #A7F3D0)',
//         textAlign: 'center',
//         boxShadow: '0 20px 40px -15px rgba(4, 120, 87, 0.12)',
//       }}>
//         <div style={{
//           width: '4rem',
//           height: '4rem',
//           borderRadius: '50%',
//           backgroundColor: 'var(--color-success-light, #ECFDF5)',
//           color: 'var(--color-success, #047857)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           margin: '0 auto 1.5rem auto',
//         }}>
//           <CheckCircle2 size={36} />
//         </div>

//         <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary, #1F2937)', marginBottom: '0.75rem' }}>
//           Message Received
//         </h3>

//         <p style={{ maxWidth: '480px', margin: '0 auto 2rem auto', color: 'var(--color-text-secondary, #4B5563)', lineHeight: 1.6 }}>
//           Thank you, <strong>{formData.fullName}</strong>. We have received your enquiry and will respond soon.
//         </p>

//         <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
//           <Button
//             onClick={() => {
//               setSubmitted(false);
//               setFormData({
//                 fullName: '',
//                 workEmail: '',
//                 phone: '',
//                 companyName: '',
//                 enquiryAbout: 'General',
//                 message: '',
//                 consent: false,
//                 website_url: '',
//               });
//               setErrors({});
//             }}
//             variant="outline"
//             size="sm"
//           >
//             Send Another Enquiry
//           </Button>

//           <Button
//             href={WHATSAPP_URL}
//             variant="primary"
//             size="sm"
//           >
//             Instant WhatsApp Chat
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} style={{
//       backgroundColor: '#ffffff',
//       padding: '2.5rem',
//       borderRadius: 'var(--radius-xl)',
//       border: '1px solid var(--color-border-subtle)',
//       boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.06)',
//     }}>
//       {/* Honeypot Input */}
//       <input
//         type="text"
//         name="website_url"
//         value={formData.website_url}
//         onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
//         style={{ display: 'none' }}
//         tabIndex={-1}
//         autoComplete="off"
//       />

//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
//         gap: '1.25rem',
//       }}>

//         {/* Full Name */}
//         <div className="form-group">
//           <label className="form-label" htmlFor="fullName">Full Name *</label>
//           <input
//             id="fullName"
//             type="text"
//             className="form-input"
//             placeholder="Enter your full name"
//             value={formData.fullName}
//             onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//             aria-invalid={Boolean(errors.fullName)}
//             aria-describedby={errors.fullName ? 'contact-fullName-error' : undefined}
//           />
//           {errors.fullName && <span id="contact-fullName-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.fullName}</span>}
//         </div>

//         {/* Work Email */}
//         <div className="form-group">
//           <label className="form-label" htmlFor="workEmail">Work Email *</label>
//           <input
//             id="workEmail"
//             type="email"
//             className="form-input"
//             placeholder="Enter your business email"
//             value={formData.workEmail}
//             onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
//             aria-invalid={Boolean(errors.workEmail)}
//             aria-describedby={errors.workEmail ? 'contact-workEmail-error' : undefined}
//           />
//           {errors.workEmail && <span id="contact-workEmail-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.workEmail}</span>}
//         </div>

//         {/* Company Name */}
//         <div className="form-group">
//           <label className="form-label" htmlFor="companyName">Company / Organization *</label>
//           <input
//             id="companyName"
//             type="text"
//             className="form-input"
//             placeholder="Enter your company name"
//             value={formData.companyName}
//             onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//             aria-invalid={Boolean(errors.companyName)}
//             aria-describedby={errors.companyName ? 'contact-companyName-error' : undefined}
//           />
//           {errors.companyName && <span id="contact-companyName-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.companyName}</span>}
//         </div>

//         {/* Phone */}
//         <div className="form-group">
//           <label className="form-label" htmlFor="phone">Phone / WhatsApp Number</label>
//           <input
//             id="phone"
//             type="tel"
//             className="form-input"
//             placeholder="Enter your phone number"
//             value={formData.phone}
//             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//             aria-invalid={Boolean(errors.phone)}
//             aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
//           />
//           {errors.phone && <span id="contact-phone-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.phone}</span>}
//         </div>

//       </div>

//       {/* Enquiry About */}
//       <div className="form-group" style={{ marginTop: '0.5rem' }}>
//           <label className="form-label" htmlFor="enquiryAbout">Enquiry About *</label>
//           <select
//             id="enquiryAbout"
//             className="form-select"
//             value={formData.enquiryAbout}
//             onChange={(e) => setFormData({ ...formData, enquiryAbout: e.target.value })}
//             aria-invalid={Boolean(errors.enquiryAbout)}
//             aria-describedby={errors.enquiryAbout ? 'contact-enquiryAbout-error' : undefined}
//           >
//             <option value="" disabled>Select an option</option>
//             <option value="General">General</option>
//             <option value="Products">Products</option>
//             <option value="Services">Services</option>
//             <option value="Enquiries">Enquiries</option>
//             <option value="Request for Quote">Request for Quote</option>
//           </select>
//           {errors.enquiryAbout && <span id="contact-enquiryAbout-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.enquiryAbout}</span>}
//         </div>

//       {/* How Can We Help */}
//       <div className="form-group" style={{ marginTop: '0.5rem' }}>
//         <label className="form-label" htmlFor="message">How Can We Help? *</label>
//         <textarea
//           id="message"
//           rows={4}
//           className="form-textarea"
//           placeholder="Describe your requirements or questions in detail..."
//           value={formData.message}
//           onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//           aria-invalid={Boolean(errors.message)}
//           aria-describedby={errors.message ? 'contact-message-error' : undefined}
//         />
//         {errors.message && <span id="contact-message-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.message}</span>}
//       </div>

//       {/* Consent Checkbox */}
//       <div className="form-group" style={{ marginTop: '1rem' }}>
//         <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
//           <input
//             type="checkbox"
//             checked={formData.consent}
//             onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
//             style={{ marginTop: '0.2rem' }}
//             aria-invalid={Boolean(errors.consent)}
//             aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
//           />
//           <span>
//             I agree that Azaroth Tech-Hive may contact me about this enquiry in accordance with the{' '}
//             <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-link-main, #4338CA)', textDecoration: 'underline' }}>
//               Privacy Policy
//             </a>.
//           </span>
//         </label>
//         {errors.consent && <span id="contact-consent-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.consent}</span>}
//       </div>

//       {/* Submission Error */}
//       {submissionError && (
//         <div role="alert" style={{
//           marginTop: '1rem',
//           padding: '0.75rem',
//           backgroundColor: 'var(--color-alert-light, #FFE4E6)',
//           border: '1px solid var(--color-alert-border, #FECDD3)',
//           borderRadius: 'var(--radius-md)',
//           color: 'var(--color-alert, #E11D48)',
//           fontSize: '0.875rem',
//         }}>
//           <div>
//             <AlertCircle size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
//             {submissionError}
//           </div>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
//             <a href={`mailto:${FALLBACK_EMAIL}`} style={{ color: 'var(--color-alert, #E11D48)', fontWeight: 600 }}>
//               Email us directly
//             </a>
//             <a href={`tel:${FALLBACK_PHONE}`} style={{ color: 'var(--color-alert, #E11D48)', fontWeight: 600 }}>
//               Call +91 6379480931
//             </a>
//           </div>
//         </div>
//       )}

//       <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
//         <Button
//           type="submit"
//           variant="primary"
//           size="lg"
//           disabled={isSubmitting}
//           icon={<Send size={16} />}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit'}
//         </Button>
//       </div>
//     </form>
//   );
// };

import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  X,
} from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ContactFormData } from "../../types";
import { Button } from "../common/Button";
import { apiService, ContactSubmission } from "../../services/api";
import { companyInfo } from "../../data/companyData";

const WHATSAPP_URL = `https://wa.me/${companyInfo.headquarters.whatsapp.replace(/[^0-9]/g, "")}`;
const FALLBACK_EMAIL = "hello@azaroth-techhive.com";
const FALLBACK_PHONE = "+916379480931";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = /\.(pdf|docx|xlsx|png|jpe?g|zip)$/i;

type ProjectContactFormData = ContactFormData & {
  country: string;
  projectScope: string;
  projectTimeline: string;
  estimatedBudget: string;
};

const initialFormData: ProjectContactFormData = {
  fullName: "",
  workEmail: "",
  phone: "",
  companyName: "",
  enquiryAbout: "Project Enquiry",
  message: "",
  consent: false,
  website_url: "",
  country: "",
  projectScope: "",
  projectTimeline: "",
  estimatedBudget: "",
};

const countryOptions = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bahrain",
  "Bangladesh",
  "Belgium",
  "Bhutan",
  "Brazil",
  "Brunei",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Denmark",
  "Egypt",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "Hong Kong",
  "India",
  "Indonesia",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kenya",
  "Kuwait",
  "Malaysia",
  "Maldives",
  "Mexico",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Other",
];

export const ContactForm: React.FC = () => {
  const [formData, setFormData] =
    useState<ProjectContactFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [projectDocuments, setProjectDocuments] = useState<File[]>([]);
  const [documentError, setDocumentError] = useState("");

  const updateField = <K extends keyof ProjectContactFormData>(
    field: K,
    value: ProjectContactFormData[K],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Contact person name is required.";
    }

    if (!formData.workEmail.trim()) {
      nextErrors.workEmail = "Business email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail.trim())) {
      nextErrors.workEmail = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone =
        "Contact number is required. Include your country code.";
    } else if (!/^\+?[0-9\s().-]{7,20}$/.test(formData.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number, including country code.";
    }

    if (!formData.country.trim()) {
      nextErrors.country = "Country / Region is required.";
    }

    if (!formData.projectScope.trim()) {
      nextErrors.projectScope =
        "Project scope and technical requirements are required.";
    } else if (formData.projectScope.trim().length < 10) {
      nextErrors.projectScope = "Please provide at least 10 characters.";
    }

    if (!formData.projectTimeline) {
      nextErrors.projectTimeline =
        "Please select an expected project timeline.";
    }

    if (!formData.estimatedBudget) {
      nextErrors.estimatedBudget = "Please select an estimated budget range.";
    }

    if (!formData.consent) {
      nextErrors.consent =
        "Please confirm that we may contact you about this project.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const invalidFile = files.find(
      (file) =>
        file.size > MAX_FILE_SIZE || !ALLOWED_FILE_EXTENSIONS.test(file.name),
    );

    if (invalidFile) {
      setDocumentError(
        invalidFile.size > MAX_FILE_SIZE
          ? `${invalidFile.name} exceeds the 15 MB per-file limit.`
          : `${invalidFile.name} has an unsupported file type.`,
      );
      event.target.value = "";
      return;
    }

    setDocumentError("");
    setProjectDocuments(files);
  };

  const removeFile = (fileIndex: number) => {
    setProjectDocuments((current) =>
      current.filter((_, index) => index !== fileIndex),
    );
    setDocumentError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Honeypot anti-spam check.
    if (formData.website_url) return;

    if (!validate() || documentError) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      /*
       * Compatibility note:
       * The current apiService accepts the existing ContactSubmission shape.
       * Until the API/backend supports dedicated project fields and multipart
       * uploads, project details and filenames are included in the existing
       * message field. This does NOT upload the file contents.
       */
      const projectMessage = [
        "PROJECT ENQUIRY",
        "",
        `Country / Region: ${formData.country.trim()}`,
        `Expected Project Timeline: ${formData.projectTimeline}`,
        `Estimated Budget Range: ${formData.estimatedBudget}`,
        "",
        "Project Scope & Technical Requirements:",
        formData.projectScope.trim(),
        "",
        projectDocuments.length
          ? `Supporting document filenames (files not uploaded by the current API): ${projectDocuments.map((file) => file.name).join(", ")}`
          : "Supporting documents: None attached",
      ].join("\n");

      const submissionData: ContactSubmission = {
        fullName: formData.fullName.trim(),
        workEmail: formData.workEmail.trim(),
        phone: formData.phone.trim(),
        companyName: formData.companyName.trim(),
        enquiryAbout: "Project Enquiry",
        message: projectMessage,
        consent: formData.consent,
      };

      const response = await apiService.submitContactForm(submissionData);

      if (response.success) {
        setSubmitted(true);
      } else {
        setSubmissionError(
          response.error || "Failed to submit the form. Please try again.",
        );
      }
    } catch {
      setSubmissionError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        aria-live="polite"
        style={{
          padding: "3rem 2rem",
          borderRadius: "var(--radius-xl)",
          backgroundColor: "#ffffff",
          border: "1px solid var(--color-success-border, #A7F3D0)",
          textAlign: "center",
          boxShadow: "0 20px 40px -15px rgba(4, 120, 87, 0.12)",
        }}
      >
        <div
          style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            backgroundColor: "var(--color-success-light, #ECFDF5)",
            color: "var(--color-success, #047857)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <h3
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--color-text-primary, #1F2937)",
            marginBottom: "0.75rem",
          }}
        >
          Project Enquiry Received
        </h3>

        <p
          style={{
            maxWidth: "480px",
            margin: "0 auto 2rem",
            color: "var(--color-text-secondary, #4B5563)",
            lineHeight: 1.6,
          }}
        >
          Thank you, <strong>{formData.fullName}</strong>. We have received your
          project enquiry and will respond soon.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({ ...initialFormData });
              setErrors({});
              setSubmissionError(null);
              setProjectDocuments([]);
              setDocumentError("");
            }}
            variant="outline"
            size="sm"
          >
            Send Another Enquiry
          </Button>

          <Button href={WHATSAPP_URL} variant="primary" size="sm">
            Instant WhatsApp Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        backgroundColor: "#ffffff",
        padding: "2.5rem",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-subtle)",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.06)",
      }}
    >
      <style>{`
/* Project enquiry form */
.project-enquiry-section {
  margin-top: 2rem;
}

.project-enquiry-heading {
  margin: 0 0 0.5rem;
  color: #302039;
  font-size: 1.25rem;
  font-weight: 700;
}

.project-enquiry-subtitle {
  margin: 0 0 1.25rem;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
}

.project-enquiry-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .project-enquiry-grid {
    grid-template-columns: 1fr;
  }
}

.project-enquiry-section .form-group {
  min-width: 0;
}

.project-enquiry-section .form-input,
.project-enquiry-section .form-select,
.project-enquiry-section .form-textarea {
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

/* Keep Country / Region aligned with the other fields. */
.country-input {
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.optional-label {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 400;
}

.project-upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  border: 1.5px dashed #cbd5e1;
  border-radius: 12px;
  background: #faf9fc;
  color: #64748b;
  text-align: center;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 180ms ease, background-color 180ms ease;
}

.project-upload-zone:hover,
.project-upload-zone:focus-within {
  border-color: #c99b52;
  background: #fcfaf7;
}

.project-upload-zone strong {
  color: #49243f;
  font-size: 0.95rem;
}

.project-upload-zone input[type="file"] {
  max-width: 100%;
  margin-top: 0.5rem;
}

.project-upload-file-list {
  display: grid;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}

.project-upload-file-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.65rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
  font-size: 0.85rem;
}

.project-upload-file-list li span {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}

.project-upload-file-list li button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.project-upload-file-list li button:hover {
  background: #f1f5f9;
  color: #9f1239;
}

.project-upload-note {
  margin: 0.75rem 0 0;
  color: #92400e;
  font-size: 0.8rem;
  line-height: 1.5;
}

.project-consent-label {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  color: var(--color-text-secondary, #4b5563);
  font-size: 0.875rem;
  line-height: 1.6;
  cursor: pointer;
}

.project-consent-label input {
  flex: 0 0 auto;
  margin-top: 0.25rem;
}

.project-consent-label a {
  color: var(--color-link-main, #49243f);
  text-decoration: underline;
}

.project-submission-error {
  margin-top: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--color-alert-border, #fecdd3);
  border-radius: var(--radius-md, 8px);
  background: var(--color-alert-light, #ffe4e6);
  color: var(--color-alert, #e11d48);
  font-size: 0.875rem;
}

.project-submission-error > div:first-child {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.project-submission-fallbacks {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem;
}

.project-submission-fallbacks a {
  color: var(--color-alert, #e11d48);
  font-weight: 600;
}

.project-form-submit {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 640px) {
  .project-enquiry-grid {
    grid-template-columns: 1fr;
  }

  .project-enquiry-heading {
    font-size: 1.125rem;
  }

  .project-form-submit {
    justify-content: stretch;
  }

  .project-form-submit > * {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-upload-zone {
    transition: none;
  }
}

/* Phone input with country selector */
.phone-input {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 46px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;
  font-family: var(--font-body);
}

.phone-input:focus-within {
  border-color: var(--color-primary, #4338ca);
  outline: 2px solid rgba(67, 56, 202, 0.2);
}

.phone-input select {
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
  max-width: 120px;
  font-family: var(--font-body);
}

.phone-input input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  font-family: var(--font-body);
}

.phone-input input:focus {
  outline: none;
}

@media (max-width: 480px) {
  .phone-input {
    flex-wrap: wrap;
    height: auto;
    padding: 8px;
  }
  .phone-input select {
    max-width: 100%;
  }
  .phone-input input {
    width: 100%;
  }
}

      `}</style>
      {/* Honeypot field: hidden from genuine users. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
        }}
      >
        <label htmlFor="website_url">Leave this field empty</label>
        <input
          id="website_url"
          type="text"
          name="website_url"
          value={formData.website_url}
          onChange={(event) => updateField("website_url", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Contact Information */}
      <section className="project-enquiry-section">
        <h3 className="project-enquiry-heading">Contact Information</h3>
        <p className="project-enquiry-subtitle">
          Tell us how to reach you about your project.
        </p>

        <div className="project-enquiry-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Contact Person Name *
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              autoComplete="name"
              value={formData.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={
                errors.fullName ? "contact-fullName-error" : undefined
              }
            />
            {errors.fullName && (
              <span
                id="contact-fullName-error"
                role="alert"
                className="form-error"
              >
                <AlertCircle size={13} /> {errors.fullName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="companyName">
              Organization Name
            </label>
            <input
              id="companyName"
              type="text"
              className="form-input"
              placeholder="Enter your company or organization"
              autoComplete="organization"
              value={formData.companyName}
              onChange={(event) =>
                updateField("companyName", event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="workEmail">
              Business Email *
            </label>
            <input
              id="workEmail"
              type="email"
              className="form-input"
              placeholder="name@company.com"
              autoComplete="email"
              value={formData.workEmail}
              onChange={(event) => updateField("workEmail", event.target.value)}
              aria-invalid={Boolean(errors.workEmail)}
              aria-describedby={
                errors.workEmail ? "contact-workEmail-error" : undefined
              }
            />
            {errors.workEmail && (
              <span
                id="contact-workEmail-error"
                role="alert"
                className="form-error"
              >
                <AlertCircle size={13} /> {errors.workEmail}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Contact Number *
            </label>
            <PhoneInput
              id="phone"
              international
              defaultCountry="IN"
              countryCallingCodeEditable={false}
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(value) => updateField("phone", value || "")}
              className="phone-input"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone ? "contact-phone-error" : undefined
              }
            />
            {errors.phone && (
              <span
                id="contact-phone-error"
                role="alert"
                className="form-error"
              >
                <AlertCircle size={13} /> {errors.phone}
              </span>
            )}
          </div>

          <div
            className="form-group"
            style={{
              gridColumn: "1 / -1",
              width: "100%",
              minWidth: 0,
              justifySelf: "stretch",
              alignSelf: "stretch",
            }}
          >
            <label className="form-label" htmlFor="country">
              Country / Region *
            </label>

            <input
              id="country"
              type="text"
              className="form-input"
              style={{
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                display: "block",
                boxSizing: "border-box",
                justifySelf: "stretch",
              }}
              list="country-region-options"
              placeholder="Search or enter your country"
              autoComplete="country-name"
              value={formData.country}
              onChange={(event) => updateField("country", event.target.value)}
              aria-invalid={Boolean(errors.country)}
              aria-describedby={
                errors.country ? "contact-country-error" : undefined
              }
            />

            <datalist id="country-region-options">
              {countryOptions.map((country) => (
                <option value={country} key={country} />
              ))}
            </datalist>

            {errors.country && (
              <span
                id="contact-country-error"
                role="alert"
                className="form-error"
              >
                <AlertCircle size={13} /> {errors.country}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Project Overview & Requirements */}
      <section className="project-enquiry-section">
        <h3 className="project-enquiry-heading">
          Project Overview &amp; Requirements
        </h3>
        <p className="project-enquiry-subtitle">
          Share your objectives, technical requirements, and expectations.
        </p>

        <div className="form-group">
          <label className="form-label" htmlFor="projectScope">
            Project Scope &amp; Technical Requirements *
          </label>
          <textarea
            id="projectScope"
            className="form-textarea"
            rows={6}
            placeholder="Describe your objectives, existing systems, technical requirements, integrations, expected outcomes, and performance needs..."
            value={formData.projectScope}
            onChange={(event) =>
              updateField("projectScope", event.target.value)
            }
            aria-invalid={Boolean(errors.projectScope)}
            aria-describedby={
              errors.projectScope ? "contact-projectScope-error" : undefined
            }
          />
          {errors.projectScope && (
            <span
              id="contact-projectScope-error"
              role="alert"
              className="form-error"
            >
              <AlertCircle size={13} /> {errors.projectScope}
            </span>
          )}
        </div>

        <div className="project-enquiry-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="projectTimeline">
              Expected Project Timeline *
            </label>
            <select
              id="projectTimeline"
              className="form-select"
              value={formData.projectTimeline}
              onChange={(event) =>
                updateField("projectTimeline", event.target.value)
              }
              aria-invalid={Boolean(errors.projectTimeline)}
              aria-describedby={
                errors.projectTimeline
                  ? "contact-projectTimeline-error"
                  : undefined
              }
            >
              <option value="">Select expected timeline</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="1–3 months">1–3 months</option>
              <option value="3–6 months">3–6 months</option>
              <option value="6–12 months">6–12 months</option>
              <option value="More than 12 months">More than 12 months</option>
              <option value="Flexible / To be discussed">
                Flexible / To be discussed
              </option>
            </select>
            {errors.projectTimeline && (
              <span
                id="contact-projectTimeline-error"
                role="alert"
                className="form-error"
              >
                <AlertCircle size={13} /> {errors.projectTimeline}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="estimatedBudget">
              Estimated Budget Range *
            </label>
            <select
              id="estimatedBudget"
              className="form-select"
              value={formData.estimatedBudget}
              onChange={(event) =>
                updateField("estimatedBudget", event.target.value)
              }
              aria-invalid={Boolean(errors.estimatedBudget)}
              aria-describedby={
                errors.estimatedBudget
                  ? "contact-estimatedBudget-error"
                  : undefined
              }
            >
              <option value="">Select estimated budget</option>
              <option value="Under $1,000">Under $1,000</option>
              <option value="$1,000–$5,000">$1,000–$5,000</option>
              <option value="$5,000–$10,000">$5,000–$10,000</option>
              <option value="$10,000–$25,000">$10,000–$25,000</option>
              <option value="$25,000+">$25,000+</option>
              <option value="To be discussed">To be discussed</option>
            </select>
            {errors.estimatedBudget && (
              <span
                id="contact-estimatedBudget-error"
                role="alert"
                className="form-error"
              >
                <AlertCircle size={13} /> {errors.estimatedBudget}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Supporting Documents */}
      <section className="project-enquiry-section">
        <h3 className="project-enquiry-heading">
          Supporting Documents{" "}
          <span className="optional-label">(Optional)</span>
        </h3>
        <p className="project-enquiry-subtitle">
          Share your RFP, RFQ, technical specifications, architecture diagrams,
          or supporting files.
        </p>

        <label className="project-upload-zone" htmlFor="projectDocuments">
          <Upload size={25} aria-hidden="true" />
          <strong>Choose files to upload</strong>
          <span>PDF, DOCX, XLSX, PNG, JPG, ZIP</span>
          <span>Maximum file size: 15 MB per file</span>
          <input
            id="projectDocuments"
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip"
            onChange={handleFilesChange}
          />
        </label>

        {projectDocuments.length > 0 && (
          <ul className="project-upload-file-list">
            {projectDocuments.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                <FileText size={15} aria-hidden="true" />
                <span>
                  {file.name} — {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {documentError && (
          <span className="form-error" role="alert">
            {documentError}
          </span>
        )}
        {projectDocuments.length > 0 && (
          <p className="project-upload-note">
            Note: your current contact API does not upload file contents. The
            selected filenames will be included with the enquiry, but the files
            themselves require backend upload support.
          </p>
        )}
      </section>

      {/* Consent */}
      <div className="form-group" style={{ marginTop: "1.5rem" }}>
        <label className="project-consent-label">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(event) => updateField("consent", event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={
              errors.consent ? "contact-consent-error" : undefined
            }
          />
          <span>
            I agree that Azaroth Tech-Hive may contact me about this project
            enquiry in accordance with the{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <span id="contact-consent-error" role="alert" className="form-error">
            <AlertCircle size={13} /> {errors.consent}
          </span>
        )}
      </div>

      {/* Submission error */}
      {submissionError && (
        <div role="alert" className="project-submission-error">
          <div>
            <AlertCircle size={14} aria-hidden="true" /> {submissionError}
          </div>
          <div className="project-submission-fallbacks">
            <a href={`mailto:${FALLBACK_EMAIL}`}>Email us directly</a>
            <a href={`tel:${FALLBACK_PHONE}`}>Call +91 6379480931</a>
          </div>
        </div>
      )}

      <div
        className="project-form-submit"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "1.5rem",
        }}
      >
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              lineHeight: 1.2,
            }}
          >
            <Send size={18} aria-hidden="true" />
            <span>
              {isSubmitting ? "Submitting..." : "Submit Project Enquiry"}
            </span>
          </span>
        </Button>
      </div>
    </form>
  );
};
