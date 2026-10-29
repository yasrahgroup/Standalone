import React from 'react';
import { CheckCircle2, Copy, Check, ArrowRight, Phone } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface RfqSuccessModalProps {
  referenceId: string;
  issuedByServer: boolean;
  clientName: string;
  onReset: () => void;
}

export const RfqSuccessModal: React.FC<RfqSuccessModalProps> = ({
  referenceId,
  issuedByServer,
  clientName,
  onReset,
}) => {
  const [copied, setCopied] = React.useState(false);
  const copyResetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceId).catch(() => {});
    setCopied(true);
    if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
    copyResetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      variant="glass"
      padding="lg"
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(0, 108, 53, 0.2)',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 108, 53, 0.15)',
      }}
    >
      <div style={{
        width: '4.5rem',
        height: '4.5rem',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 108, 53, 0.1)',
        color: 'var(--color-primary-green)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem auto',
      }}>
        <CheckCircle2 size={42} />
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-dark-forest)', marginBottom: '0.5rem' }}>
        Request for Quote Confirmed
      </h2>

      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        Thank you, <strong>{clientName}</strong>. Your enterprise requirements have been registered into our queue. A Lead Solutions Architect has been assigned to your scope.
      </p>

      {/* Reference Tracking ID Banner */}
      <div style={{
        backgroundColor: 'var(--color-canvas-bg)',
        border: '1px solid var(--color-border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {issuedByServer ? 'Official Tracking Reference ID' : 'Session reference (quote this when you follow up)'}
          </span>
          <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-primary-green)', fontFamily: 'var(--font-mono)' }}>
            {referenceId}
          </span>
          {!issuedByServer && (
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Our server did not issue a tracking ID for this submission; this value was generated in your browser session only.
            </span>
          )}
        </div>

        <button
          onClick={copyToClipboard}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-medium)',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-dark-forest)',
            transition: 'all 150ms',
          }}
        >
          {copied ? <Check size={14} style={{ color: 'var(--color-primary-green)' }} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy ID'}</span>
        </button>
      </div>

      {/* Next Steps */}
      <div style={{
        textAlign: 'left',
        backgroundColor: 'rgba(232, 245, 233, 0.4)',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(0, 108, 53, 0.15)',
        marginBottom: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: 'var(--color-dark-forest)', display: 'block', marginBottom: '0.5rem' }}>
          Next Steps:
        </strong>
        <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', color: 'var(--color-text-secondary)' }}>
          <li>Our Principal Architect reviews your technical specifications within 4 hours.</li>
          <li>We prepare a preliminary C4 architectural scope and commercial estimate.</li>
          <li>We invite your team to a 45-minute confidential technical alignment session.</li>
        </ol>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        <Button onClick={onReset} variant="outline" size="md">
          Submit Another Request
        </Button>
        <Button to="/" variant="gold" size="md" icon={<ArrowRight size={16} />}>
          Return to Homepage
        </Button>
        <Button href="tel:+916379480931" variant="ghost" size="md" icon={<Phone size={16} />}>
          Call Chennai HQ
        </Button>
      </div>
    </Card>
  );
};
