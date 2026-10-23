import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  Cpu, 
  Server, 
  Cloud, 
  Sparkles, 
  FileCheck,
  AlertCircle 
} from 'lucide-react';
import { RfqFormData } from '../../types';
import { StepIndicator } from './StepIndicator';
import { RfqSuccessModal } from './RfqSuccessModal';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { apiService, RfqSubmission } from '../../services/api';

const STORAGE_KEY = 'azr_rfq_draft_v1';
const DRAFT_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

const budgetOptions = [
  '$25,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000 – $250,000',
  '$250,000+ Enterprise',
];

const createDraft = (): RfqFormData => ({
  solutionCategories: ['Dedicated Engineering Pods'],
  projectScope: 'Full Scale Platform Engineering',
  targetTimeline: '1 - 3 Months',
  budgetRange: budgetOptions[1],
  requirementsDescription: '',
  ndaRequired: true,
  contact: {
    fullName: '',
    workEmail: '',
    phone: '',
    companyName: '',
    country: '',
  },
});

const isUsableDraft = (value: unknown): value is RfqFormData => {
  if (typeof value !== 'object' || value === null) return false;
  const draft = value as Record<string, unknown>;
  const contact = draft.contact as Record<string, unknown> | null | undefined;
  
  // Check draft timestamp for expiry
  if (draft.timestamp && typeof draft.timestamp === 'number') {
    const age = Date.now() - draft.timestamp;
    if (age > DRAFT_EXPIRY_MS) return false;
  }
  
  return (
    (draft.step === undefined || typeof draft.step === 'number') &&
    Array.isArray(draft.solutionCategories) &&
    draft.solutionCategories.every((c) => typeof c === 'string') &&
    typeof draft.budgetRange === 'string' &&
    typeof draft.projectScope === 'string' &&
    typeof draft.targetTimeline === 'string' &&
    typeof draft.requirementsDescription === 'string' &&
    typeof draft.ndaRequired === 'boolean' &&
    typeof contact === 'object' &&
    contact !== null &&
    typeof contact.fullName === 'string' &&
    typeof contact.workEmail === 'string' &&
    typeof contact.phone === 'string' &&
    typeof contact.companyName === 'string' &&
    typeof contact.country === 'string'
  );
};

const loadDraft = (): RfqFormData | null => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const draft: unknown = JSON.parse(saved);
    if (isUsableDraft(draft)) {
      // Remove timestamp before returning
      const { timestamp, ...draftData } = draft as RfqFormData & { timestamp?: number };
      return draftData as RfqFormData;
    }
  } catch (e) {
    // Discard invalid drafts silently
  }
  return null;
};

export const RfqWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [refIdFromServer, setRefIdFromServer] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepAnnouncement, setStepAnnouncement] = useState<string>('');
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusStepRef = useRef(false);

  const [formData, setFormData] = useState<RfqFormData>(() => loadDraft() ?? createDraft());
  const [hasRestoredDraft, setHasRestoredDraft] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved !== null;
    } catch {
      return false;
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  // Persist draft to sessionStorage on changes
  useEffect(() => {
    try {
      const draftWithTimestamp = { ...formData, timestamp: Date.now() };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draftWithTimestamp));
    } catch (e) {
      // Silently fail if sessionStorage is unavailable
    }
  }, [formData]);

  useEffect(() => {
    if (shouldFocusStepRef.current) {
      shouldFocusStepRef.current = false;
      stepHeadingRef.current?.focus();
    }
  }, [currentStep]);

  const stepTitles = [
    'Solutions',
    'Scope & Urgency',
    'Budget & Specs',
    'Documents',
    'Contact & Verification',
  ];

  const solutionOptions = [
    { title: 'Cloud and Distributed Systems', icon: <Cloud size={20} />, desc: 'Resilient cloud infrastructure, microservices, and distributed architecture' },
    { title: 'Legacy Modernization', icon: <Server size={20} />, desc: 'Deconstruct monoliths, upgrade tech stacks, and modernize legacy platforms' },
    { title: 'Fitness Management', icon: <Cpu size={20} />, desc: 'Multi-location gym operations, membership lifecycle, and facility access' },
    { title: 'Multi-Store Commerce', icon: <Sparkles size={20} />, desc: 'Headless omnichannel digital storefronts, synchronized inventory, and fulfillment' },
    { title: 'Healthcare Management', icon: <FileCheck size={20} />, desc: 'Secure clinical workflows, patient record management, and health informatics' },
    { title: 'Learning Platforms', icon: <Sparkles size={20} />, desc: 'Enterprise training academies, structured learning pathways, and certifications' },
    { title: 'Dedicated Engineering Pods', icon: <Cpu size={20} />, desc: 'Dedicated cross-functional engineering teams for your technology roadmap' },
    { title: 'Business Process Automation', icon: <Server size={20} />, desc: 'Targeted system integration, workflow design, and operational automation' },
  ];

  const scopeOptions = [
    'Prototype / Architectural Spike',
    'Full Scale Platform Engineering',
    'Enterprise Migration & Modernization',
    'Dedicated Pod Augmentation (Ongoing)',
  ];

  const timelineOptions = [
    'Immediate (< 1 month)',
    '1 - 3 Months',
    '3 - 6 Months',
    'Flexible / Planning Horizon',
  ];

  const toggleCategory = (cat: string) => {
    setFormData((prev) => {
      const exists = prev.solutionCategories.includes(cat);
      const updated = exists 
        ? prev.solutionCategories.filter(c => c !== cat)
        : [...prev.solutionCategories, cat];
      return { ...prev, solutionCategories: updated.length ? updated : [cat] };
    });
  };

  const validateStep = (step: number) => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (formData.solutionCategories.length === 0) {
        errs.solutions = 'Please select at least one solution category.';
      }
    } else if (step === 3) {
      if (!formData.requirementsDescription.trim() || formData.requirementsDescription.length < 15) {
        errs.requirements = 'Please describe your system requirements or goals (min 15 characters).';
      }
    } else if (step === 5) {
      if (!formData.contact.fullName.trim()) errs.fullName = 'Contact Person Name is required.';
      if (!formData.contact.workEmail.trim()) {
        errs.workEmail = 'Business Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.workEmail)) {
        errs.workEmail = 'Valid business email is required.';
      }
      if (!formData.contact.companyName.trim()) errs.companyName = 'Organization Name is required.';
      if (!formData.contact.country || formData.contact.country.trim() === '') {
        errs.country = 'Country / Region is required.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToStep = (step: number) => {
    shouldFocusStepRef.current = true;
    setCurrentStep(step);
    setStepAnnouncement(`Step ${step} of ${stepTitles.length}: ${stepTitles[step - 1]}`);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      goToStep(Math.min(currentStep + 1, 5));
    }
  };

  const handleBack = () => {
    goToStep(Math.max(currentStep - 1, 1));
  };

  const handleFileUpload = (files: FileList) => {
    const fileList = Array.from(files);
    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    const ALLOWED_FORMATS = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg', 'application/zip', 'application/x-zip-compressed'];

    const validFiles: File[] = [];
    const errs: Record<string, string> = {};

    fileList.forEach((file) => {
      if (file.size > MAX_SIZE) {
        errs[file.name] = 'File size exceeds 15MB limit.';
      } else if (!ALLOWED_FORMATS.includes(file.type)) {
        errs[file.name] = 'Unsupported file format. Allowed: PDF, DOCX, XLSX, PNG, JPG, ZIP.';
      } else {
        validFiles.push(file);
      }
    });

    setFileErrors(errs);
    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFileUpload(e.target.files);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const submissionData: RfqSubmission = {
        solutionCategories: formData.solutionCategories,
        projectScope: formData.projectScope,
        targetTimeline: formData.targetTimeline,
        budgetRange: formData.budgetRange,
        requirementsDescription: formData.requirementsDescription,
        ndaRequired: formData.ndaRequired,
        contact: formData.contact,
        documents: uploadedFiles,
      };

      const response = await apiService.submitRfq(submissionData);
      
      if (response.success) {
        sessionStorage.removeItem(STORAGE_KEY);
        const serverReferenceId = response.data?.referenceId;
        setRefIdFromServer(Boolean(serverReferenceId));
        setSubmittedRefId(serverReferenceId || `AZR-RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      } else {
        setSubmissionError(response.error || 'Failed to submit RFQ. Please try again.');
      }
    } catch (error) {
      setSubmissionError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedRefId(null);
    setRefIdFromServer(false);
    setCurrentStep(1);
    setStepAnnouncement('');
    setUploadedFiles([]);
    setFileErrors({});
    setErrors({});
    setFormData(createDraft());
    setHasRestoredDraft(false);
  };

  if (submittedRefId) {
    return (
      <RfqSuccessModal
        referenceId={submittedRefId}
        issuedByServer={refIdFromServer}
        clientName={formData.contact.fullName}
        onReset={resetForm}
      />
    );
  }

  return (
    <Card
      variant="glass"
      padding="lg"
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Visual Stepper */}
      <div
        aria-live="polite"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {stepAnnouncement}
      </div>
      <StepIndicator
        currentStep={currentStep}
        totalSteps={5}
        stepTitles={stepTitles}
      />

      <form onSubmit={handleSubmit}>
        
        {/* Step 1: Solution Categories */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 ref={stepHeadingRef} tabIndex={-1} style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-maroon)', marginBottom: '0.375rem' }}>
                Select Architecture & Engineering Focus
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                Select one or more capabilities your organization is seeking to deploy or augment.
              </p>
              {hasRestoredDraft && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'rgba(198, 138, 61, 0.1)',
                  border: '1px solid rgba(198, 138, 61, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  color: '#C68A3D',
                }}>
                  Your draft has been restored. It will expire after 24 hours of inactivity.
                </div>
              )}
            </div>

            <div
              role="group"
              aria-label="Solution categories"
              aria-invalid={Boolean(errors.solutions)}
              aria-describedby={errors.solutions ? 'rfq-solutions-error' : undefined}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}
            >
              {solutionOptions.map((opt) => {
                const isSelected = formData.solutionCategories.includes(opt.title);
                return (
                  <button
                    type="button"
                    key={opt.title}
                    onClick={() => toggleCategory(opt.title)}
                    aria-pressed={isSelected}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected ? '2px solid var(--color-primary, #18181B)' : '1px solid var(--color-border-medium)',
                      backgroundColor: isSelected ? 'rgba(24, 24, 27, 0.04)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      transition: 'all 180ms ease-out',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'var(--color-primary-maroon)' : 'rgba(28, 35, 32, 0.06)',
                        color: isSelected ? '#ffffff' : 'var(--color-dark-forest)',
                      }}>
                        {opt.icon}
                      </div>

                      <div style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '4px',
                        border: isSelected ? '1px solid var(--color-primary-maroon)' : '1px solid var(--color-border-medium)',
                        backgroundColor: isSelected ? 'var(--color-primary-maroon)' : 'transparent',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>

                    <div>
                      <strong style={{ fontSize: '0.9375rem', color: 'var(--color-dark-forest)', display: 'block', marginBottom: '0.25rem' }}>
                        {opt.title}
                      </strong>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.4, display: 'block' }}>
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.solutions && <div id="rfq-solutions-error" role="alert" className="form-error" style={{ marginBottom: '1.5rem' }}><AlertCircle size={14} /> {errors.solutions}</div>}
          </div>
        )}

        {/* Step 2: Scope & Urgency */}
        {currentStep === 2 && (
          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 ref={stepHeadingRef} tabIndex={-1} style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-maroon)', marginBottom: '0.375rem' }}>
                Project Scope & Target Timeline
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                Help us size the engineering pod capacity and sprint horizon.
              </p>
            </div>

            {/* Scope Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                Anticipated Engagement Scope:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {scopeOptions.map((scope) => {
                  const isSelected = formData.projectScope === scope;
                  return (
                    <button
                      type="button"
                      key={scope}
                      onClick={() => setFormData({ ...formData, projectScope: scope })}
                      aria-pressed={isSelected}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-primary, #18181B)' : '1px solid var(--color-border-medium)',
                        backgroundColor: isSelected ? 'rgba(24, 24, 27, 0.04)' : '#ffffff',
                        cursor: 'pointer',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.875rem',
                        color: isSelected ? 'var(--color-primary, #18181B)' : 'var(--color-text-primary)',
                        textAlign: 'left',
                      }}
                    >
                      {scope}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Selection */}
            <div>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                Target Deployment / Start Horizon:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {timelineOptions.map((time) => {
                  const isSelected = formData.targetTimeline === time;
                  return (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setFormData({ ...formData, targetTimeline: time })}
                      aria-pressed={isSelected}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-primary, #18181B)' : '1px solid var(--color-border-medium)',
                        backgroundColor: isSelected ? 'rgba(24, 24, 27, 0.04)' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.875rem',
                        color: isSelected ? 'var(--color-primary, #18181B)' : 'var(--color-text-primary)',
                      }}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget Range & Requirements */}
        {currentStep === 3 && (
          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 ref={stepHeadingRef} tabIndex={-1} style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-maroon)', marginBottom: '0.375rem' }}>
                Budget Allocation & Architectural Requirements
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                Specifying preliminary budget ranges accelerates accurate architectural staffing.
              </p>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                Target Engagement Budget:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {budgetOptions.map((b) => {
                  const isSelected = formData.budgetRange === b;
                  return (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setFormData({ ...formData, budgetRange: b })}
                      aria-pressed={isSelected}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-primary, #18181B)' : '1px solid var(--color-border-medium)',
                        backgroundColor: isSelected ? 'rgba(24, 24, 27, 0.04)' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.875rem',
                        color: isSelected ? 'var(--color-primary, #18181B)' : 'var(--color-text-primary)',
                      }}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="requirementsDescription">
                Project Scope & Technical Requirements *
              </label>
              <textarea
                id="requirementsDescription"
                rows={5}
                className="form-textarea"
                placeholder="Describe your project requirements and objectives..."
                value={formData.requirementsDescription}
                onChange={(e) => setFormData({ ...formData, requirementsDescription: e.target.value })}
                aria-invalid={Boolean(errors.requirements)}
                aria-describedby={errors.requirements ? 'rfq-requirements-error' : undefined}
              />
              {errors.requirements && <span id="rfq-requirements-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.requirements}</span>}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(232, 245, 233, 0.4)',
              border: '1px solid rgba(0, 108, 53, 0.15)',
              marginTop: '1rem',
            }}>
              <input
                type="checkbox"
                id="ndaRequired"
                checked={formData.ndaRequired}
                onChange={(e) => setFormData({ ...formData, ndaRequired: e.target.checked })}
                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary-maroon)', cursor: 'pointer' }}
              />
              <label htmlFor="ndaRequired" style={{ fontSize: '0.875rem', color: 'var(--color-dark-forest)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-primary-maroon)' }} />
                <span>Execute Mutual Non-Disclosure Agreement (NDA) prior to technical review</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Supporting Documents */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 ref={stepHeadingRef} tabIndex={-1} style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-maroon)', marginBottom: '0.375rem' }}>
                Share Your Project Documents
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                Upload supporting documents to help us better understand your requirements. Accepted formats: PDF, DOCX, XLSX, PNG, JPG, ZIP. Maximum file size: 15MB.
              </p>
            </div>

            <div
              style={{
                border: '2px dashed var(--color-border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                textAlign: 'center',
                backgroundColor: 'rgba(250, 250, 247, 0.5)',
                cursor: 'pointer',
                transition: 'all 180ms ease-out',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--color-primary-green, #006C35)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 108, 53, 0.06)';
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--color-border-medium)';
                e.currentTarget.style.backgroundColor = 'rgba(250, 250, 247, 0.5)';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--color-border-medium)';
                e.currentTarget.style.backgroundColor = 'rgba(250, 250, 247, 0.5)';
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById('fileUpload')?.click()}
            >
              <input
                id="fileUpload"
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 108, 53, 0.1)',
                color: 'var(--color-primary-green, #006C35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}>
                <FileCheck size={32} />
              </div>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-dark-maroon)', marginBottom: '0.5rem' }}>
                Click to upload or drag and drop
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                PDF, DOCX, XLSX, PNG, JPG, ZIP (max 15MB)
              </p>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-maroon)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileCheck size={18} style={{ color: 'var(--color-primary-maroon)' }} />
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-dark-maroon)' }}>
                            {file.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        style={{
                          padding: '0.375rem',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload Errors */}
            {Object.keys(fileErrors).length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                {Object.entries(fileErrors).map(([fileName, error]) => (
                  <div key={fileName} role="alert" className="form-error" style={{ marginBottom: '0.5rem' }}>
                    <AlertCircle size={13} /> {fileName}: {error}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Contact & Verification */}
        {currentStep === 5 && (
          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 ref={stepHeadingRef} tabIndex={-1} style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-maroon)', marginBottom: '0.375rem' }}>
                Contact & Verification Details
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                Where should our Principal Solutions Architect transmit your preliminary scope report?
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="rfqFullName">Contact Person Name *</label>
                <input
                  id="rfqFullName"
                  type="text"
                  className="form-input"
                  placeholder="Enter contact person name"
                  value={formData.contact.fullName}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, fullName: e.target.value }
                  })}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'rfq-fullName-error' : undefined}
                />
                {errors.fullName && <span id="rfq-fullName-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rfqWorkEmail">Business Email *</label>
                <input
                  id="rfqWorkEmail"
                  type="email"
                  className="form-input"
                  placeholder="Enter your business email"
                  value={formData.contact.workEmail}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, workEmail: e.target.value }
                  })}
                  aria-invalid={Boolean(errors.workEmail)}
                  aria-describedby={errors.workEmail ? 'rfq-workEmail-error' : undefined}
                />
                {errors.workEmail && <span id="rfq-workEmail-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.workEmail}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rfqCompanyName">Organization Name *</label>
                <input
                  id="rfqCompanyName"
                  type="text"
                  className="form-input"
                  placeholder="Enter your organization name"
                  value={formData.contact.companyName}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, companyName: e.target.value }
                  })}
                  aria-invalid={Boolean(errors.companyName)}
                  aria-describedby={errors.companyName ? 'rfq-companyName-error' : undefined}
                />
                {errors.companyName && <span id="rfq-companyName-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.companyName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rfqPhone">Contact Number</label>
                <input
                  id="rfqPhone"
                  type="tel"
                  className="form-input"
                  placeholder="Enter your contact number"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rfqCountry">Country / Region *</label>
                <select
                  id="rfqCountry"
                  className="form-select"
                  value={formData.contact.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, country: e.target.value }
                  })}
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={errors.country ? 'rfq-country-error' : undefined}
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
                {errors.country && <span id="rfq-country-error" role="alert" className="form-error"><AlertCircle size={13} /> {errors.country}</span>}
              </div>

            </div>

            {/* Scope Summary Preview */}
            <div style={{
              backgroundColor: 'rgba(250, 250, 247, 0.8)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(0, 108, 53, 0.15)',
              marginTop: '1.25rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}>
              <strong>Selected Scope Summary:</strong> {formData.solutionCategories.join(', ')} • {formData.projectScope} • {formData.budgetRange}
            </div>
          </div>
        )}

        {/* Submission Error */}
        {submissionError && (
          <div style={{
            marginTop: '1.5rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#ef4444',
            fontSize: '0.875rem',
          }}>
            <AlertCircle size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
            {submissionError}
          </div>
        )}

        {/* Wizard Navigation Controls */}
        <div style={{
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {currentStep > 1 ? (
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              size="md"
              icon={<ArrowLeft size={16} />}
              iconPosition="left"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              variant="primary"
              size="md"
              icon={<ArrowRight size={16} />}
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={<Check size={18} strokeWidth={2.5} />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm & Submit RFQ'}
            </Button>
          )}
        </div>

      </form>
    </Card>
  );
};
