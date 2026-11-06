import React, { useState } from 'react';
import { Eye, ArrowLeft, ExternalLink, CheckCircle, UploadCloud, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const PreviewBanner: React.FC = () => {
  const { publishAll } = useCMS();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const publicSiteUrl = (
    (typeof process !== 'undefined' && (process.env as any)?.VITE_PUBLIC_SITE_URL) ||
    'https://azaroth-tech-hive-test.vercel.app'
  );

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish all CMS draft changes to the live public site?')) {
      return;
    }

    setIsPublishing(true);
    setPublishStatus(null);
    try {
      const res = await publishAll();
      setPublishStatus(`✓ Published ${res.count || 0} document(s) to live!`);
      setTimeout(() => setPublishStatus(null), 5000);
    } catch (err) {
      setPublishStatus(`Error: ${err instanceof Error ? err.message : 'Failed to publish'}`);
      setTimeout(() => setPublishStatus(null), 5000);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 0.85rem',
          borderRadius: '9999px',
          backgroundColor: '#3B0B2E',
          color: '#FDFBF7',
          border: '1.5px solid #C5A880',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        title="Expand CMS Preview Toolbar"
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 6px #10B981',
          }}
        />
        <Eye size={13} color="#C5A880" />
        <span>Preview Mode</span>
        <ChevronUp size={13} color="#C5A880" />
      </button>
    );
  }

  return (
    <aside
      aria-label="CMS Draft Preview Toolbar"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        maxWidth: 'calc(100vw - 2rem)',
        width: 'max-content',
        backgroundColor: 'rgba(43, 7, 33, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(197, 168, 128, 0.5)',
        borderRadius: '9999px',
        color: '#FDFBF7',
        padding: '0.35rem 0.65rem 0.35rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 16px 40px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(197, 168, 128, 0.2)',
        boxSizing: 'border-box',
        fontSize: '0.8125rem',
        animation: 'slideUp 0.25s ease-out',
      }}
    >
      {/* Status & Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.6875rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <Eye size={12} /> Preview
        </span>
        <span style={{ color: '#E2E8F0', fontSize: '0.75rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 5px #10B981',
              display: 'inline-block',
            }}
          />
          Drafts Active
        </span>
      </div>

      {/* Dynamic Feedback Message */}
      {publishStatus && (
        <span
          style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            backgroundColor: publishStatus.startsWith('✓') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: publishStatus.startsWith('✓') ? '#34D399' : '#F87171',
            border: `1px solid ${publishStatus.startsWith('✓') ? '#059669' : '#DC2626'}`,
            fontWeight: 600,
            fontSize: '0.725rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            whiteSpace: 'nowrap',
          }}
        >
          {publishStatus.startsWith('✓') ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {publishStatus}
        </span>
      )}

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap' }}>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#059669',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.75rem',
            cursor: isPublishing ? 'wait' : 'pointer',
            opacity: isPublishing ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.35)',
            transition: 'all 0.15s ease',
          }}
          title="Publish all pending CMS drafts to the live public production website"
        >
          <UploadCloud size={13} />
          {isPublishing ? 'Publishing...' : 'Publish to Live'}
        </button>

        <a
          href={publicSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#C5A880',
            border: '1px solid rgba(197, 168, 128, 0.35)',
            fontWeight: 500,
            fontSize: '0.75rem',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
          title="Open live production website in a new tab"
        >
          <ExternalLink size={12} /> Live Site
        </a>

        <a
          href="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: '#FFFFFF',
            color: '#3B0B2E',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.75rem',
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
          title="Return to CMS Control Center"
        >
          <ArrowLeft size={12} /> CMS
        </a>

        <button
          onClick={() => setIsMinimized(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#94A3B8',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '0.2rem',
            transition: 'all 0.15s ease',
          }}
          title="Minimize toolbar"
          aria-label="Minimize preview toolbar"
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </aside>
  );
};
