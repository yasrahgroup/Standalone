import React from 'react';
import { Home, BookOpen } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SEOHead } from '../components/common/SEOHead';

export const NotFound: React.FC = () => {
  return (
    <div className="section" style={{ padding: '6rem 1.5rem', textAlign: 'center', minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <SEOHead
        title="Page Not Found — Azaroth Tech-Hive"
        description="The page you are looking for does not exist or has been moved. Browse our homepage, products, services, and engineering insights instead."
        robots="noindex, follow"
      />
      <Badge variant="emerald" style={{ marginBottom: '1.25rem' }}>
        Status 404
      </Badge>

      <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, color: 'var(--color-brand-emerald)', marginBottom: '0.75rem', lineHeight: 1 }}>
        Route Not Found
      </h1>

      <p style={{ maxWidth: '520px', color: 'var(--color-text-secondary)', fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        The path you navigated to does not exist or has been relocated within our enterprise architecture.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        <Button to="/" variant="primary" icon={<Home size={16} />} iconPosition="left">
          Return to Homepage
        </Button>
        <Button to="/technology-insights" variant="outline" icon={<BookOpen size={16} />} iconPosition="left">
          Browse Resource Hub
        </Button>
      </div>
    </div>
  );
};
