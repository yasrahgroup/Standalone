import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section style={{
      backgroundColor: 'var(--color-surface-muted)',
      padding: '5rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        right: '20%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(216, 173, 89, 0.12) 0%, rgba(216, 173, 89, 0) 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', maxWidth: '1100px', margin: '0 auto' }}
        >
      
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.25rem)',
              fontWeight: 600,
              color: 'var(--color-text-primary, #0F172A)',
              marginBottom: '1rem',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
            }}
          >
            Let's Build the {' '}
            <span
              style={{
                background: 'var(--gradient-heading)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Right Digital Solution.
            </span>
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary, #4B5563)',
              lineHeight: 1.65,
              margin: '20px 0',
            }}
          >
            Whether you need to engineer a mission-critical platform, modernize legacy systems, or deploy a dedicated engineering pod, we partner with you to turn ambitious roadmaps into resilient digital reality.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <Button to="/connect-with-us" variant="primary" size="lg" icon={<ArrowRight size={18} aria-hidden="true" />}>
              Plan Your Next Move
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
