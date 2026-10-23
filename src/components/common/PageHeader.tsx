import React from 'react';

interface PageHeaderProps {
  kicker: string;
  title: string;
  subtitle?: string;
  gradientWords?: string[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  kicker,
  title,
  subtitle,
  gradientWords = [],
  actions
}) => {
  // Split title to apply gradient to specific words
  const renderTitle = () => {
    if (gradientWords.length === 0) {
      return title;
    }

    const parts = title.split(/(\s+)/);
    return parts.map((part, index) => {
      const trimmedPart = part.trim();
      if (trimmedPart && gradientWords.includes(trimmedPart)) {
        return (
          <span
            key={index}
            style={{
              background: 'var(--gradient-heading)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section
      style={{
        backgroundColor: 'var(--color-canvas-bg, #FFFFFF)',
        paddingTop: '5rem',
        paddingBottom: actions ? '4rem' : '5rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border, #E2E8F0)',
      }}
      className="page-header-section"
    >
      {/* Decorative architectural background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(24, 24, 27, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(73, 36, 63, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 40% 80%, rgba(24, 24, 27, 0.02) 0%, transparent 50%),
            linear-gradient(135deg, rgba(24, 24, 27, 0.01) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />
      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(24, 24, 27, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(24, 24, 27, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />
      {/* Floating brand ambient glows */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.05) 0%, rgba(73, 36, 63, 0.03) 100%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(73, 36, 63, 0.05) 0%, rgba(24, 24, 27, 0.02) 100%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container"
        style={{
          textAlign: 'center',
          maxWidth: '840px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Kicker text */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            color: '#49243F',
            animation: 'fadeInUp 1s ease-out 0.3s forwards',
            opacity: 0,
          }}
          className="page-header-kicker"
        >
          {kicker}
        </div>

        {/* Main title */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.2,
            marginBottom: '1.25rem',
            animation: 'fadeInUp 1s ease-out 0.5s forwards',
            opacity: 0,
          }}
          className="page-header-title"
        >
          {renderTitle()}
        </h1>

        {/* Subtitle if provided */}
        {subtitle && (
          <p
            style={{
              fontSize: '1.1875rem',
              color: '#334155',
              lineHeight: 1.7,
              maxWidth: '720px',
              margin: '0 auto',
              animation: 'fadeInUp 1s ease-out 0.7s forwards',
              opacity: 0,
            }}
            className="page-header-subtitle"
          >
            {subtitle}
          </p>
        )}

        {/* Actions if provided */}
        {actions && (
          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              animation: 'fadeInUp 1s ease-out 0.9s forwards',
              opacity: 0,
            }}
            className="page-header-actions"
          >
            {actions}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
