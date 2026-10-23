import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  return (
    <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
      {/* Progress connecting line */}
      <div
        role="progressbar"
        aria-label="Request for quote progress"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        aria-valuetext={`Step ${currentStep} of ${totalSteps}`}
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.5rem',
          right: '1.5rem',
          height: '2px',
          backgroundColor: 'var(--color-border-subtle)',
          zIndex: 0,
        }}
      >
        <div style={{
          height: '100%',
          backgroundColor: 'var(--color-primary-green)',
          width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          transition: 'width 300ms ease-in-out',
        }} />
      </div>

      <ol style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        listStyle: 'none',
        margin: 0,
        padding: 0,
      }}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNumber) => {
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li
              key={stepNumber}
              aria-current={isCurrent ? 'step' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: isCompleted 
                  ? 'var(--color-link-main, #18181B)' 
                  : isCurrent 
                  ? 'var(--color-primary-button, #18181B)' 
                  : '#ffffff',
                border: isCurrent 
                  ? '2px solid var(--color-brand-gold, #C99B52)' 
                  : isCompleted 
                  ? '2px solid var(--color-link-main, #18181B)' 
                  : '2px solid var(--color-border, #E4E4E7)',
                color: (isCompleted || isCurrent)
                  ? '#ffffff' 
                  : 'var(--color-text-muted, #6B7280)',
                fontWeight: 800,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCurrent 
                  ? 'linear-gradient(135deg, #18181B 0%, #27272A 100%)' 
                  : isCompleted 
                  ? 'var(--color-link-main, #18181B)' 
                  : '#ffffff',
                boxShadow: isCurrent 
                  ? '0 0 14px rgba(24, 24, 27, 0.35)' 
                  : 'var(--shadow-xs)',
                transition: 'all 240ms ease-out',
              }}>
                {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNumber}
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: isCurrent ? 700 : 600,
                color: isCurrent 
                  ? 'var(--color-dark-forest)' 
                  : isCompleted 
                  ? 'var(--color-primary-green)' 
                  : 'var(--color-text-muted)',
                textAlign: 'center',
                maxWidth: '90px',
              }}>
                {stepTitles[stepNumber - 1]}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
