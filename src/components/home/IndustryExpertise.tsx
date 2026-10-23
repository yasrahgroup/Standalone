import React from 'react';
import { motion } from 'framer-motion';
import { industryExpertiseData } from '../../data/industryData';
import { Card } from '../common/Card';
import { ShoppingBag, GraduationCap, HeartPulse, Truck, Layers } from 'lucide-react';

export const IndustryExpertise: React.FC = () => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      ShoppingBag: <ShoppingBag size={28} aria-hidden="true" />,
      GraduationCap: <GraduationCap size={28} aria-hidden="true" />,
      HeartPulse: <HeartPulse size={28} aria-hidden="true" />,
      Truck: <Truck size={28} aria-hidden="true" />,
      Layers: <Layers size={28} aria-hidden="true" />,
    };
    return icons[iconName] || <Layers size={28} aria-hidden="true" />;
  };

  return (
    <section className="section" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'left', maxWidth: '780px', margin: '0 0 3.5rem 0' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Our Specialised Engineering Across{' '}
            <span
              style={{
                background: 'var(--gradient-heading)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Diverse Industries
            </span>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            We engineer for the operating realities of each industry: we learn the business and operational challenge first, then shape architecture, integrations, and automation around it.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {industryExpertiseData.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card
                variant="glass"
                padding="lg"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  border: '1px solid var(--color-border)',
                  transition: 'all 180ms ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = 'var(--color-brand-violet)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = '';
                }}
              >
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-surface-rose)',
                  color: 'var(--color-brand-magenta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  {getIcon(industry.iconName)}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                  {industry.industry}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-brand-magenta)', fontWeight: 600, marginBottom: '1.25rem' }}>
                  {industry.subtitle}
                </p>

                <div style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  marginBottom: '0.75rem',
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-brand-violet)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.5rem',
                  }}>
                    Operational & Business Challenge
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {industry.challenge}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--color-brand-gold-light)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-brand-gold-border)',
                  marginBottom: '0.75rem',
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-brand-gold-text)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.5rem',
                  }}>
                    Implemented Architecture
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {industry.architecture}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  marginTop: 'auto',
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-brand-emerald)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.5rem',
                  }}>
                    Final Outcome
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {industry.outcome}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
