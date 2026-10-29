import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  X,
  FileText,

} from "lucide-react";
import PhoneInput, { getCountryCallingCode, type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ContactFormData } from "../../types";
import { Button } from "../common/Button";
import { apiService, ContactSubmission } from "../../services/api";
import { companyInfo } from "../../data/companyData";

const WHATSAPP_URL = `https://wa.me/${companyInfo.headquarters.whatsapp.replace(/[^0-9]/g, "")}`;
const FALLBACK_EMAIL = "hello@azaroth-techhive.com";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = /\.(pdf|docx|xlsx|png|jpe?g|zip)$/i;

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

type ProjectContactFormData = ContactFormData & {
  country: string;
};

const initialFormData: ProjectContactFormData = {
  fullName: "",
  workEmail: "",
  phone: "",
  companyName: "",
  enquiryAbout: "Cloud Architecture",
  message: "",
  consent: false,
  website_url: "",
  country: "",
};

interface CountryOption {
  value?: string;
  label: string;
  divider?: boolean;
}

interface CountrySelectProps {
  value?: string;
  options: CountryOption[];
  onChange: (value?: string) => void;
  iconComponent: React.ComponentType<{
    country?: string;
    label: string;
    "aria-hidden"?: React.AriaAttributes["aria-hidden"];
  }>;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  onFocus?: React.FocusEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  "aria-label"?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  options,
  onChange,
  iconComponent: CountryIcon,
  className = "",
  ...selectProps
}) => {
  const selectedOption = options.find(
    (option) => !option.divider && option.value === value,
  );

  return (
    <div className={`PhoneInputCountry ${className}`.trim()}>
      <select
        {...selectProps}
        className="PhoneInputCountrySelect"
        value={value ?? "ZZ"}
        onChange={(event) =>
          onChange(event.target.value === "ZZ" ? undefined : event.target.value)
        }
      >
        {options.map((option) => {
          const optionValue = option.divider ? "|" : option.value ?? "ZZ";
          return (
            <option
              key={optionValue}
              value={optionValue}
              disabled={option.divider}
            >
              {option.label}
            </option>
          );
        })}
      </select>

      <CountryIcon
        aria-hidden="true"
        country={value}
        label={selectedOption?.label ?? "Country"}
      />

      {value && (
        <span className="PhoneInputCountryCode" aria-hidden="true">
          +{getCountryCallingCode(value as Country)}
        </span>
      )}

      <div className="PhoneInputCountrySelectArrow" />
    </div>
  );
};

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ProjectContactFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [projectDocuments, setProjectDocuments] = useState<File[]>([]);
  const [documentError, setDocumentError] = useState("");

  const [countryOpen, setCountryOpen] = useState(false);
  const [activeCountryIndex, setActiveCountryIndex] = useState(-1);
  const countryFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryFieldRef.current &&
        !countryFieldRef.current.contains(event.target as Node)
      ) {
        setCountryOpen(false);
        setActiveCountryIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateField = <K extends keyof ProjectContactFormData>(
    field: K,
    value: ProjectContactFormData[K],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const countryQuery = formData.country.trim().toLowerCase();
  const hasExactCountryMatch = countryOptions.some(
    (country) => country.toLowerCase() === countryQuery,
  );
  const filteredCountries =
    !countryQuery || hasExactCountryMatch
      ? countryOptions
      : countryOptions.filter((country) =>
          country.toLowerCase().includes(countryQuery),
        );

  const selectCountry = (country: string) => {
    updateField("country", country);
    setCountryOpen(false);
    setActiveCountryIndex(-1);
  };

  const handleCountryKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCountryOpen(true);
      setActiveCountryIndex((current) =>
        Math.min(current + 1, filteredCountries.length - 1),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveCountryIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && countryOpen && activeCountryIndex >= 0) {
      event.preventDefault();
      selectCountry(filteredCountries[activeCountryIndex]);
    } else if (event.key === "Escape") {
      setCountryOpen(false);
      setActiveCountryIndex(-1);
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full Name is required.";
    }

    if (!formData.workEmail.trim()) {
      nextErrors.workEmail = "Work Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail.trim())) {
      nextErrors.workEmail = "Please provide a valid email address.";
    }

    if (!formData.companyName.trim()) {
      nextErrors.companyName = "Company name is required.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Contact number is required.";
    } else if (!/^\+?[0-9\s().-]{7,20}$/.test(formData.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!formData.country.trim()) {
      nextErrors.country = "Country / Region is required.";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Please describe your project or requirements.";
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = "Please provide at least 10 characters.";
    }

    if (!formData.consent) {
      nextErrors.consent = "Please confirm you agree to be contacted.";
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
          ? `${invalidFile.name} exceeds the 15 MB limit.`
          : `${invalidFile.name} has an unsupported file type.`,
      );
      event.target.value = "";
      return;
    }

    setDocumentError("");
    setProjectDocuments((prev) => [...prev, ...files]);
  };

  const removeFile = (fileIndex: number) => {
    setProjectDocuments((current) =>
      current.filter((_, index) => index !== fileIndex),
    );
    setDocumentError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.website_url) return;
    if (!validate() || documentError) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const detailedMessage = [
        `Focus: ${formData.enquiryAbout}`,
        `Country: ${formData.country.trim()}`,
        "",
        "Project Scope & Requirements:",
        formData.message.trim(),
        "",
        projectDocuments.length
          ? `Attached files: ${projectDocuments.map((f) => f.name).join(", ")}`
          : "Attachments: None",
      ].join("\n");

      const submissionData: ContactSubmission = {
        fullName: formData.fullName.trim(),
        workEmail: formData.workEmail.trim(),
        phone: formData.phone.trim(),
        companyName: formData.companyName.trim(),
        enquiryAbout: formData.enquiryAbout,
        message: detailedMessage,
        consent: formData.consent,
      };

      const response = await apiService.submitContactForm(submissionData);

      if (response.success) {
        setSubmitted(true);
      } else {
        setSubmissionError(
          response.error || "Failed to submit enquiry. Please try again.",
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
      <div aria-live="polite" className="contact-form-card contact-form-success">
        <div className="contact-form-success-icon">
          <CheckCircle2 size={36} aria-hidden="true" />
        </div>

        <h3 className="contact-form-success-title">Message Received</h3>

        <p className="contact-form-success-text">
          Thank you, <strong>{formData.fullName}</strong>. A solution architect
          will review your brief and reply within one business day.
        </p>

        <div className="contact-form-success-actions">
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
            Send Another Message
          </Button>

          <Button href={WHATSAPP_URL} variant="primary" size="sm">
            Instant WhatsApp Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="contact-form-card">
      <style>{`
        /* Contact Form Container */
        .contact-form-card {
          position: relative;
          background: #ffffff;
          border: 1px solid #ece5ef;
          border-radius: var(--radius-xl, 20px);
          box-shadow: 0 20px 44px -24px rgba(48, 32, 57, 0.16);
          overflow: hidden;
        }

        /* Compact Header Band */
        .contact-form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 1.25rem 1.75rem;
          background: linear-gradient(135deg, #fdfbfd 0%, #faf6f9 100%);
          border-bottom: 1px solid #f1eaf3;
        }

        .contact-form-title {
          margin: 0;
          color: #302039;
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: -0.015em;
        }

        .contact-form-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.65rem;
          border-radius: 9999px;
          background: rgba(201, 155, 82, 0.12);
          color: #8a6a3f;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* Form Body */
        .contact-form-body {
          padding: 1.5rem 1.75rem 2rem;
        }

        /* 2-Column Split Grid */
        .contact-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem 1.25rem;
        }

        .contact-form-grid .col-span-full {
          grid-column: 1 / -1;
        }

        @media (max-width: 600px) {
          .contact-form-header {
            padding: 1.15rem 1.25rem;
          }
          .contact-form-body {
            padding: 1.25rem;
          }
          .contact-form-grid {
            grid-template-columns: 1fr;
            gap: 0.9rem;
          }
        }

        /* Form Controls */
        .contact-form-grid .form-group {
          margin: 0;
          min-width: 0;
        }

        .contact-form-grid .form-label {
          display: block;
          margin-bottom: 0.35rem;
          color: #334155;
          font-size: 0.8125rem;
          font-weight: 500;
          line-height: 1.3;
        }

        .required-mark {
          color: #e11d48;
          font-weight: 500;
          margin-left: 2px;
        }

        .contact-form-grid .form-input,
        .contact-form-grid .form-select,
        .contact-form-grid .form-textarea {
          display: block;
          width: 100%;
          min-height: 42px;
          padding: 0.55rem 0.85rem;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: #ffffff;
          color: #1e293b;
          font-family: inherit;
          font-size: 0.875rem;
          line-height: 1.4;
          box-sizing: border-box;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .contact-form-grid .form-input:focus,
        .contact-form-grid .form-select:focus,
        .contact-form-grid .form-textarea:focus {
          outline: none;
          border-color: #c99b52;
          box-shadow: 0 0 0 3px rgba(201, 155, 82, 0.15);
        }

        .contact-form-grid .form-input::placeholder,
        .contact-form-grid .form-textarea::placeholder {
          color: #94a3b8;
          font-size: 0.8125rem;
        }

        /* Custom Country Select */
        .country-select-wrapper {
          position: relative;
        }

        .country-input {
          padding-right: 2.2rem;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 0.95rem;
        }

        .country-options {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          z-index: 50;
          max-height: 200px;
          margin: 0;
          padding: 0.3rem;
          overflow-y: auto;
          list-style: none;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          box-shadow: 0 12px 28px -10px rgba(15, 23, 42, 0.22);
        }

        .country-options li {
          margin: 0;
        }

        .country-option {
          display: block;
          width: 100%;
          padding: 0.45rem 0.65rem;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #334155;
          font-family: inherit;
          font-size: 0.8125rem;
          text-align: left;
          cursor: pointer;
        }

        .country-option:hover,
        .country-option.is-active {
          background: rgba(73, 36, 63, 0.08);
          color: #49243f;
        }

        .country-option[aria-selected="true"] {
          color: #49243f;
          font-weight: 700;
        }

        .country-empty {
          padding: 0.6rem;
          color: #64748b;
          font-size: 0.8125rem;
        }

        /* Phone Input Component */
        .phone-input {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          min-height: 42px;
          padding: 0 10px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: #ffffff;
          box-sizing: border-box;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .phone-input:focus-within {
          border-color: #c99b52;
          box-shadow: 0 0 0 3px rgba(201, 155, 82, 0.15);
        }

        .phone-input .PhoneInputCountry {
          gap: 4px;
        }

        .phone-input .PhoneInputCountryCode {
          color: #475569;
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1;
        }

        .phone-input input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: #1e293b;
          font-size: 0.875rem;
          font-family: inherit;
        }

        .phone-input input::placeholder {
          color: #94a3b8;
          font-size: 0.8125rem;
        }

        /* Interactive Focus Chips */
        .topic-chips-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .topic-chips-header {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .topic-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .topic-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.7rem;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          background: #f8fafc;
          color: #475569;
          font-family: inherit;
          font-size: 0.78125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 140ms ease;
          user-select: none;
        }

        .topic-chip:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
          color: #1e293b;
        }

        .topic-chip.is-selected {
          border-color: #49243f;
          background: #49243f;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(73, 36, 63, 0.2);
        }

        /* Compact Attachment Row */
        .compact-attachment-zone {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.6rem;
          padding: 0.6rem 0.85rem;
          border: 1px dashed #cbd5e1;
          border-radius: 9px;
          background: #fafafc;
          transition: border-color 150ms ease, background-color 150ms ease;
        }

        .compact-attachment-zone:hover,
        .compact-attachment-zone:focus-within {
          border-color: #c99b52;
          background: #fcfbf9;
        }

        .compact-attachment-trigger {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #49243f;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
        }

        .compact-attachment-hint {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .file-chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.4rem;
        }

        .file-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: #ffffff;
          color: #334155;
          font-size: 0.75rem;
        }

        .file-chip-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          color: #94a3b8;
          padding: 1px;
          cursor: pointer;
          border-radius: 3px;
        }

        .file-chip-remove:hover {
          color: #e11d48;
          background: #fee2e2;
        }

        /* Inline Error */
        .form-error {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.25rem;
          color: #dc2626;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Consent Checkbox */
        .consent-row {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          cursor: pointer;
          color: #475569;
          font-size: 0.8125rem;
          line-height: 1.45;
        }

        .consent-row input {
          margin-top: 0.15rem;
          accent-color: #49243f;
        }

        .consent-row a {
          color: #49243f;
          text-decoration: underline;
        }

        /* Submit Button */
        .contact-submit-btn {
          width: 100%;
          justify-content: center;
        }

        /* Success Card */
        .contact-form-success {
          padding: 3rem 2rem;
          text-align: center;
        }

        .contact-form-success-icon {
          width: 3.5rem;
          height: 3.5rem;
          margin: 0 auto 1.25rem;
          border-radius: 50%;
          background: #ecfdf5;
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-form-success-title {
          margin: 0 0 0.5rem;
          color: #1e293b;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .contact-form-success-text {
          max-width: 420px;
          margin: 0 auto 1.5rem;
          color: #475569;
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        .contact-form-success-actions {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
      `}</style>

      {/* Header */}


      <div className="contact-form-body">
        {/* Anti-spam Honeypot */}
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
          <label htmlFor="website_url">Leave empty</label>
          <input
            id="website_url"
            type="text"
            name="website_url"
            value={formData.website_url}
            onChange={(e) => updateField("website_url", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Form Inputs Grid in Split Columns */}
        <div className="contact-form-grid">
          {/* Col 1: Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              autoComplete="name"
              aria-required="true"
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {errors.fullName && (
              <span id="fullName-error" role="alert" className="form-error">
                <AlertCircle size={12} /> {errors.fullName}
              </span>
            )}
          </div>

          {/* Col 2: Work Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="workEmail">
              Email <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <input
              id="workEmail"
              type="email"
              className="form-input"
              placeholder="Enter your Email"
              autoComplete="email"
              aria-required="true"
              value={formData.workEmail}
              onChange={(e) => updateField("workEmail", e.target.value)}
              aria-invalid={Boolean(errors.workEmail)}
              aria-describedby={errors.workEmail ? "workEmail-error" : undefined}
            />
            {errors.workEmail && (
              <span id="workEmail-error" role="alert" className="form-error">
                <AlertCircle size={12} /> {errors.workEmail}
              </span>
            )}
          </div>

          {/* Col 1: Company / Organization */}
          <div className="form-group">
            <label className="form-label" htmlFor="companyName">
              Company / Organization <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <input
              id="companyName"
              type="text"
              className="form-input"
              placeholder="Enter your organization name"
              autoComplete="organization"
              aria-required="true"
              value={formData.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              aria-invalid={Boolean(errors.companyName)}
              aria-describedby={errors.companyName ? "companyName-error" : undefined}
            />
            {errors.companyName && (
              <span id="companyName-error" role="alert" className="form-error">
                <AlertCircle size={12} /> {errors.companyName}
              </span>
            )}
          </div>

          {/* Col 2: Contact Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Contact Number <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <PhoneInput
              id="phone"
              defaultCountry="IN"
              countrySelectComponent={CountrySelect}
              placeholder="Mobile number"
              value={formData.phone}
              onChange={(value) => updateField("phone", value || "")}
              className="phone-input"
              aria-required="true"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <span id="phone-error" role="alert" className="form-error">
                <AlertCircle size={12} /> {errors.phone}
              </span>
            )}
          </div>

          {/* Full Width: Country / Region */}
          <div className="form-group country-select-wrapper col-span-full" ref={countryFieldRef}>
            <label className="form-label" htmlFor="country">
              Country / Region <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <input
              id="country"
              type="text"
              className="form-input country-input"
              placeholder="Search country..."
              autoComplete="off"
              role="combobox"
              aria-required="true"
              aria-expanded={countryOpen}
              aria-controls="country-listbox"
              aria-autocomplete="list"
              value={formData.country}
              onChange={(e) => {
                updateField("country", e.target.value);
                setCountryOpen(true);
                setActiveCountryIndex(-1);
              }}
              onFocus={() => setCountryOpen(true)}
              onKeyDown={handleCountryKeyDown}
              aria-invalid={Boolean(errors.country)}
              aria-describedby={errors.country ? "country-error" : undefined}
            />
            {countryOpen && (
              <ul id="country-listbox" role="listbox" className="country-options">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country, index) => (
                    <li key={country}>
                      <button
                        type="button"
                        role="option"
                        id={`country-opt-${index}`}
                        aria-selected={formData.country === country}
                        className={`country-option ${
                          index === activeCountryIndex ? "is-active" : ""
                        }`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectCountry(country)}
                      >
                        {country}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="country-empty">No matching country</li>
                )}
              </ul>
            )}
            {errors.country && (
              <span id="country-error" role="alert" className="form-error">
                <AlertCircle size={12} /> {errors.country}
              </span>
            )}
          </div>

          {/* Full Width: How Can We Help? / Scope */}
          <div className="form-group col-span-full">
            <label className="form-label" htmlFor="message">
              How Can We Help? <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              className="form-textarea"
              rows={3}
              placeholder="Brief summary of objectives, systems, or target timeline..."
              aria-required="true"
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <span id="message-error" role="alert" className="form-error">
                <AlertCircle size={12} /> {errors.message}
              </span>
            )}
          </div>

          {/* Full Width: Compact Document Attachment Bar */}
          <div className="form-group col-span-full">
            <div className="compact-attachment-zone">
              <label
                htmlFor="projectDocuments"
                className="compact-attachment-trigger"
              >
                <Paperclip size={14} aria-hidden="true" />
                <span>Attachments</span>
                <input
                  id="projectDocuments"
                  type="file"
                  multiple
                  accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip"
                  onChange={handleFilesChange}
                  style={{ display: "none" }}
                />
              </label>
              <span className="compact-attachment-hint">
                PDF, DOCX, XLSX, ZIP · max 15MB
              </span>
            </div>

            {projectDocuments.length > 0 && (
              <div className="file-chips-list">
                {projectDocuments.map((file, idx) => (
                  <span key={`${file.name}-${idx}`} className="file-chip">
                    <FileText size={12} />
                    <span>
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(1)}MB)
                    </span>
                    <button
                      type="button"
                      className="file-chip-remove"
                      onClick={() => removeFile(idx)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {documentError && (
              <span role="alert" className="form-error">
                <AlertCircle size={12} /> {documentError}
              </span>
            )}
          </div>

          {/* Full Width: Consent Checkbox */}
          <div className="form-group col-span-full">
            <label className="consent-row">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => updateField("consent", e.target.checked)}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />
              <span>
                I agree to the{" "}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{" "}
                and confirm you may contact me regarding this enquiry.
              </span>
            </label>
            {errors.consent && (
              <span id="consent-error" role="alert" className="form-error">
                <AlertCircle size={12} /> {errors.consent}
              </span>
            )}
          </div>

          {/* Submission Error Banner */}
          {submissionError && (
            <div
              role="alert"
              className="col-span-full form-error"
              style={{
                padding: "0.65rem 0.85rem",
                borderRadius: "8px",
                background: "#fef2f2",
                border: "1px solid #fecdd3",
              }}
            >
              <AlertCircle size={14} />
              <span>
                {submissionError}{" "}
                <a
                  href={`mailto:${FALLBACK_EMAIL}`}
                  style={{ textDecoration: "underline", fontWeight: 700 }}
                >
                  Email us directly
                </a>
              </span>
            </div>
          )}

          {/* Full Width: Submit Button */}
          <div className="form-group col-span-full" style={{ marginTop: "0.25rem" }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="contact-submit-btn"
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Send size={16} aria-hidden="true" />
                <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
