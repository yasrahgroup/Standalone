import React from 'react';
import { Badge } from '../components/common/Badge';
import { RfqWizard } from '../components/rfq/RfqWizard';
import { SEOHead } from '../components/common/SEOHead';

export const RequestQuote: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Request a Quote — Azaroth Tech-Hive"
        description="Share your project requirements, timeline, and goals through our RFQ wizard. Our team reviews each submission and responds with a tailored engineering proposal."
        canonicalPath="/request-for-quote"
      />
      {/* Page Hero */}
      <section className="section" style={{ backgroundColor: 'var(--color-canvas-bg)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '3.5rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <Badge variant="gold" style={{ marginBottom: '1rem' }}>
            Request for Quote (RFQ)
          </Badge>
          <h1 style={{ marginBottom: '1.25rem', fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Request for Quote
          </h1>
          <p style={{ fontSize: '1.1875rem', lineHeight: 1.6 }}>
            Share your project requirements, timeline, goals, and objectives. Our team will review your needs and provide a tailored proposal with suitable solutions.
          </p>
        </div>
      </section>

      {/* RFQ Wizard Container */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <RfqWizard />
        </div>
      </section>
    </div>
  );
};
