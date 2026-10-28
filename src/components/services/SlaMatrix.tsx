import React from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { slaMatrixData } from '../../data/servicesData';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const SlaMatrix: React.FC = () => {
  return (
    <section className="section" style={{ backgroundColor: '#F8FAFC', padding: '5.5rem 0' }}>
      <style>{`
        @media (max-width: 560px) {
          .sla-highlight-badge {
            whiteSpace: normal !important;
            padding: 0.5rem 0.75rem !important;
            font-size: 0.7rem !important;
            lineHeight: 1.25 !important;
            textAlign: center !important;
          }
          .sla-highlight-badge span:last-child {
            display: block !important;
          }
        }
      `}</style>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#49243F',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.875rem',
            }}
          >
            &mdash; SERVICE LEVEL AGREEMENTS &mdash;
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 800, color: '#1E293B', marginBottom: '1rem', lineHeight: 1.25 }}>
            Enterprise{' '}
            <span
              style={{
                background: 'var(--gradient-heading)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SLA Tier Comparison
            </span>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#64748B', lineHeight: 1.7 }}>
            Transparent engagement models, clear delivery checkpoints, and architecture support shaped around your operating model and risk profile.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
            maxWidth: '1160px',
            margin: '0 auto',
          }}
        >
          {slaMatrixData.map((tier) => (
            <Card
              key={tier.tierName}
              padding="lg"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '1.5rem',
                border: tier.highlight ? '2px solid #49243F' : '1px solid rgba(226, 232, 240, 0.9)',
                backgroundColor: '#FFFFFF',
                boxShadow: tier.highlight
                  ? '0 20px 45px -10px rgba(73, 36, 63, 0.16)'
                  : '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
                transform: tier.highlight ? 'scale(1.02)' : 'none',
                zIndex: tier.highlight ? 2 : 1,
                padding: '2.5rem 2rem',
              }}
            >
              {tier.highlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                  }}
                >
<span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: '#49243F',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 14px rgba(73, 36, 63, 0.35)',
                        letterSpacing: '0.02em',
                      }}
                      className="sla-highlight-badge"
                    >
                      <Sparkles size={13} />
                      <span>Recommended for Global Enterprises</span>
                    </span>
                </div>
              )}

              <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#1E293B',
                    marginBottom: '0.5rem',
                  }}
                >
                  {tier.tierName}
                </h3>
                <div
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: tier.highlight ? '#49243F' : '#059669',
                  }}
                >
                  {tier.availabilityTarget}
                </div>
              </div>

              {/* Attributes List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.35rem',
                  marginBottom: '2.5rem',
                  flexGrow: 1,
                  paddingTop: '1rem',
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                {/* 1. Response Incident SLA */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.1rem',
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
                      Response Incident SLA
                    </span>
                    <strong style={{ color: '#0F172A', fontSize: '0.9375rem', fontWeight: 700 }}>
                      {tier.responseTime}
                    </strong>
                  </div>
                </div>

                {/* 2. Architect Support */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.1rem',
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
                      Architect Support
                    </span>
                    <strong style={{ color: '#0F172A', fontSize: '0.9375rem', fontWeight: 700 }}>
                      {tier.leadArchitectSupport}
                    </strong>
                  </div>
                </div>

                {/* 3. Engineering Pod Allocation */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.1rem',
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
                      Engineering Pod Allocation
                    </span>
                    <strong style={{ color: '#0F172A', fontSize: '0.9375rem', fontWeight: 700 }}>
                      {tier.dedicatedEngineeringPod}
                    </strong>
                  </div>
                </div>

                {/* 4. Security & Pentest Audit */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.1rem',
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
                      Security &amp; Pentest Audit
                    </span>
                    <strong style={{ color: '#0F172A', fontSize: '0.9375rem', fontWeight: 700 }}>
                      {tier.securityAuditsIncluded}
                    </strong>
                  </div>
                </div>

                {/* 5. Release & Deployment Cadence */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.1rem',
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
                      Release &amp; Deployment Cadence
                    </span>
                    <strong style={{ color: '#0F172A', fontSize: '0.9375rem', fontWeight: 700 }}>
                      {tier.deploymentCadence}
                    </strong>
                  </div>
                </div>
              </div>

              <Button
                to="/connect-with-us"
                variant="primary"
                size="md"
                className="w-full"
                icon={<ArrowRight size={16} />}
              >
                Discuss this model
              </Button>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
