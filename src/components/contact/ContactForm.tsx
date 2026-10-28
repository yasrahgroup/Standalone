import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  X,
} from "lucide-react";
import PhoneInput, { getCountryCallingCode, type Country } from "react-phone-number-input";
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

/**
 * Compact country selector: flag, country code, and code share one control.
 * The native <select> stays invisible on top so keyboard and screen-reader
 * behaviour is unchanged.
 */
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
  const [formData, setFormData] =
    useState<ProjectContactFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [projectDocuments, setProjectDocuments] = useState<File[]>([]);
  const [documentError, setDocumentError] = useState("");

  // Custom country dropdown state (native datalist cannot be themed).
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
      <div aria-live="polite" className="project-enquiry-success">
        <div className="project-enquiry-success-icon">
          <CheckCircle2 size={36} aria-hidden="true" />
        </div>

        <h3>Project Enquiry Received</h3>

        <p>
          Thank you, <strong>{formData.fullName}</strong>. A solution architect
          will review your brief and reply within one business day.
        </p>

        <div className="project-enquiry-success-actions">
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
    <form onSubmit={handleSubmit} noValidate className="project-enquiry-form">
      <style>{`
/* Project enquiry form */
.project-enquiry-form {
  position: relative;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #ece5ef;
  border-radius: var(--radius-xl, 20px);
  box-shadow: 0 24px 48px -28px rgba(48, 32, 57, 0.22);
}

/* Header band: sets the "solution architect" context before the fields. */
.project-form-intro {
  padding: 2rem 2.5rem 1.75rem;
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(201, 155, 82, 0.14) 0%, rgba(201, 155, 82, 0) 55%),
    linear-gradient(135deg, #fbf8fc 0%, #fdfbf7 60%, #ffffff 100%);
  border-bottom: 1px solid #f1eaf3;
}

.project-form-eyebrow {
  display: inline-block;
  margin-bottom: 0.5rem;
  color: #8a6a3f;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.project-form-title {
  margin: 0;
  color: #302039;
  font-size: clamp(1.375rem, 2.4vw, 1.75rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.015em;
}

.project-enquiry-body {
  padding: 2rem 2.5rem 2.5rem;
}

.project-enquiry-section {
  margin-top: 2rem;
}

.project-enquiry-section:first-of-type {
  margin-top: 0;
}

.project-enquiry-heading {
  margin: 0 0 1rem;
  color: #302039;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.project-enquiry-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.project-enquiry-section .form-group {
  min-width: 0;
}

.project-country-field {
  grid-column: 1 / -1;
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

/* Country / Region uses the shared input styles plus a full-width slot. */
.country-input {
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.85rem center;
  background-size: 1rem;
}

.country-select {
  position: relative;
}

.country-options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 40;
  max-height: 240px;
  margin: 0;
  padding: 0.35rem;
  overflow-y: auto;
  list-style: none;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 14px 32px -12px rgba(15, 23, 42, 0.25);
}

.country-options li {
  margin: 0;
}

.country-option {
  display: block;
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #334155;
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.4;
  text-align: left;
  cursor: pointer;
}

.country-option:hover,
.country-option.is-active {
  background: rgba(73, 36, 63, 0.07);
  color: #49243f;
}

.country-option[aria-selected="true"] {
  color: #49243f;
  font-weight: 700;
}

.country-empty {
  padding: 0.75rem 0.7rem;
  color: #64748b;
  font-size: 0.85rem;
}

.project-enquiry-body .form-error {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
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
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-top: 1.75rem;
}

.project-form-submit .btn {
  width: 100%;
  max-width: 320px;
  justify-content: center;
}

/* Success state shown after a successful submission. */
.project-enquiry-success {
  padding: 3rem 2rem;
  border-radius: var(--radius-xl, 20px);
  background: #ffffff;
  border: 1px solid var(--color-success-border, #a7f3d0);
  text-align: center;
  box-shadow: 0 20px 40px -15px rgba(4, 120, 87, 0.12);
}

.project-enquiry-success-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: var(--color-success-light, #ecfdf5);
  color: var(--color-success, #047857);
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-enquiry-success h3 {
  margin: 0 0 0.75rem;
  color: var(--color-text-primary, #1f2937);
  font-size: 1.75rem;
  font-weight: 800;
}

.project-enquiry-success p {
  max-width: 460px;
  margin: 0 auto 2rem;
  color: var(--color-text-secondary, #4b5563);
  line-height: 1.6;
}

.project-enquiry-success-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .project-form-intro {
    padding: 1.75rem 1.25rem 1.5rem;
  }

  .project-enquiry-body {
    padding: 1.5rem 1.25rem 2rem;
  }

  .project-enquiry-grid {
    grid-template-columns: 1fr;
  }

  .project-enquiry-heading {
    font-size: 1rem;
  }

  .project-enquiry-success {
    padding: 2.5rem 1.25rem;
  }

  .project-enquiry-success h3 {
    font-size: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-upload-zone {
    transition: none;
  }
}

/* Required field marker */
.required-mark {
  color: #dc2626;
  font-weight: 700;
}

/* Phone input with compact country selector */
.phone-input {
  --PhoneInput-color--focus: #c99b52;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 46px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;
  font-family: var(--font-body);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.phone-input:hover {
  border-color: #cbd5e1;
}

.phone-input:focus-within {
  border-color: #c99b52;
  box-shadow: 0 0 0 3px rgba(201, 155, 82, 0.14);
}

/* Keep flag, country code, and arrow tight together. */
.phone-input .PhoneInputCountry {
  gap: 4px;
  margin-right: 2px;
}

.phone-input .PhoneInputCountryCode {
  color: #475569;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.phone-input .PhoneInputCountrySelectArrow {
  margin-left: 2px;
}

.phone-input select {
  font-family: var(--font-body);
}

.phone-input input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #1e293b;
  font-size: 16px;
  font-family: var(--font-body);
}

.phone-input input:focus {
  outline: none;
}

.phone-input input::placeholder {
  color: #94a3b8;
}

@media (max-width: 480px) {
  .phone-input {
    padding: 0 10px;
  }
}
      `}</style>

      <header className="project-form-intro">
        {/* <span className="project-form-eyebrow">Solution Architect Review</span> */}
        <h3 className="project-form-title">Tell us what you are building</h3>
      </header>

      <div className="project-enquiry-body">
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

        {/* 1. Contact details */}
        <section className="project-enquiry-section">
          <h4 className="project-enquiry-heading">1. Your contact details</h4>

          <div className="project-enquiry-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">
                Contact Person Name{" "}
                <span className="required-mark" aria-hidden="true">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                autoComplete="name"
                aria-required="true"
                value={formData.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
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
                Business Email{" "}
                <span className="required-mark" aria-hidden="true">*</span>
              </label>
              <input
                id="workEmail"
                type="email"
                className="form-input"
                placeholder="name@company.com"
                autoComplete="email"
                aria-required="true"
                value={formData.workEmail}
                onChange={(event) =>
                  updateField("workEmail", event.target.value)
                }
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
                Contact Number{" "}
                <span className="required-mark" aria-hidden="true">*</span>
              </label>
              <PhoneInput
                id="phone"
                defaultCountry="IN"
                countrySelectComponent={CountrySelect}
                placeholder="Enter mobile number"
                value={formData.phone}
                onChange={(value) => updateField("phone", value || "")}
                className="phone-input"
                aria-required="true"
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

            <div className="form-group project-country-field" ref={countryFieldRef}>
              <label className="form-label" htmlFor="country">
                Country / Region{" "}
                <span className="required-mark" aria-hidden="true">*</span>
              </label>

              <div className="country-select">
                <input
                  id="country"
                  type="text"
                  className="form-input country-input"
                  placeholder="Search or enter your country"
                  autoComplete="off"
                  role="combobox"
                  aria-required="true"
                  aria-expanded={countryOpen}
                  aria-controls="country-region-listbox"
                  aria-autocomplete="list"
                  aria-activedescendant={
                    countryOpen && activeCountryIndex >= 0
                      ? `country-option-${activeCountryIndex}`
                      : undefined
                  }
                  value={formData.country}
                  onChange={(event) => {
                    updateField("country", event.target.value);
                    setCountryOpen(true);
                    setActiveCountryIndex(-1);
                  }}
                  onFocus={() => setCountryOpen(true)}
                  onKeyDown={handleCountryKeyDown}
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={
                    errors.country ? "contact-country-error" : undefined
                  }
                />

                {countryOpen && (
                  <ul
                    id="country-region-listbox"
                    role="listbox"
                    className="country-options"
                  >
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country, index) => (
                        <li key={country}>
                          <button
                            type="button"
                            role="option"
                            id={`country-option-${index}`}
                            aria-selected={formData.country === country}
                            className={`country-option ${
                              index === activeCountryIndex ? "is-active" : ""
                            }`}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => selectCountry(country)}
                          >
                            {country}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="country-empty">No matching country found</li>
                    )}
                  </ul>
                )}
              </div>

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

        {/* 2. Project requirements */}
        <section className="project-enquiry-section">
          <h4 className="project-enquiry-heading">
            2. Project requirements
          </h4>

          <div className="form-group">
            <label className="form-label" htmlFor="projectScope">
              Project Scope &amp; Technical Requirements{" "}
              <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <textarea
              id="projectScope"
              className="form-textarea"
              rows={6}
              placeholder="Describe your objectives, existing systems, technical requirements, integrations, expected outcomes, and performance needs..."
              aria-required="true"
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
        </section>

        {/* 3. Supporting documents */}
        <section className="project-enquiry-section">
          <h4 className="project-enquiry-heading">
            3. Supporting documents{" "}
            {/* <span className="optional-label">(Optional)</span> */}
          </h4>

          <label className="project-upload-zone" htmlFor="projectDocuments">
            <Upload size={25} aria-hidden="true" />
            <strong>Choose files to upload</strong>
            <span>PDF, DOCX, XLSX, PNG, JPG, ZIP &middot; 15 MB max each</span>
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
        </section>

        {/* Consent */}
        <div className="form-group" style={{ marginTop: "1.5rem" }}>
          <label className="project-consent-label">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(event) =>
                updateField("consent", event.target.checked)
              }
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

        <div className="project-form-submit">
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
      </div>
    </form>
  );
};
