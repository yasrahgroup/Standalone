import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { adminStyles } from '../../styles/adminTheme';

interface HeroImageControlProps {
  label?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageFit?: 'cover' | 'contain' | 'fill';
  onImageChange: (url: string) => void;
  onAltChange: (alt: string) => void;
  onFitChange?: (fit: 'cover' | 'contain' | 'fill') => void;
  onRemove: () => void;
  pageName: string;
}

export const HeroImageControl: React.FC<HeroImageControlProps> = ({
  label = 'Hero Banner Image',
  imageUrl,
  imageAlt = '',
  imageFit = 'cover',
  onImageChange,
  onAltChange,
  onFitChange,
  onRemove,
  pageName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image exceeds 5MB limit. Please select an image under 5MB or enter a remote URL.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const hasImage = Boolean(imageUrl && imageUrl.trim().length > 0);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '1.25rem',
        marginTop: '0.75rem',
        marginBottom: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <label style={{ ...adminStyles.label, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={16} color="#D97706" />
            <span>{label}</span>
          </label>
          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
            Hero banner visual representation for the {pageName}. Displayed on desktop and mobile viewports.
          </p>
        </div>

        {hasImage && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: '#ECFDF5',
              color: '#047857',
            }}
          >
            <CheckCircle2 size={13} />
            Banner Active
          </span>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Preview or Empty Placeholder */}
      {hasImage ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#0F172A',
              border: '1.5px solid #E2E8F0',
              maxHeight: '260px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={imageUrl}
              alt={imageAlt || `${pageName} Hero Banner`}
              style={{
                width: '100%',
                maxHeight: '260px',
                objectFit: imageFit,
                display: 'block',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Upload size={13} />
                Replace
              </button>

              <button
                type="button"
                onClick={onRemove}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(225, 29, 72, 0.9)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={13} />
                Remove
              </button>
            </div>
          </div>

          {/* Controls: Fit Mode, Alt Text, and URL direct input */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={adminStyles.label}>Image Alt Text (Accessibility & SEO)</label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder={`Describe the ${pageName} banner image...`}
                style={adminStyles.input}
              />
            </div>

            <div>
              <label style={adminStyles.label}>Direct Image URL / Source</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => onImageChange(e.target.value)}
                placeholder="https://... or data:image/..."
                style={adminStyles.input}
              />
            </div>

            {onFitChange && (
              <div>
                <label style={adminStyles.label}>Banner Scaling / Fit Mode</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['cover', 'contain', 'fill'] as const).map((fit) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => onFitChange(fit)}
                      style={{
                        flex: 1,
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: `1.5px solid ${imageFit === fit ? '#D97706' : '#CBD5E1'}`,
                        backgroundColor: imageFit === fit ? '#FEF3C7' : '#FFFFFF',
                        color: imageFit === fit ? '#B45309' : '#475569',
                        fontWeight: imageFit === fit ? 700 : 500,
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty-Image Placeholder */
        <div
          style={{
            border: '2px dashed #CBD5E1',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(217, 119, 6, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <ImageIcon size={26} />
          </div>

          <div>
            <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>
              No Hero Banner Image Uploaded
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: '#64748B', maxWidth: '480px' }}>
              The live {pageName} currently renders the standard clean architectural background. Upload an image or specify an image URL below to display a hero banner.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: '#18181B',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(73, 36, 63, 0.25)',
              }}
            >
              <Upload size={16} />
              Upload Hero Image
            </button>
          </div>

          <div style={{ width: '100%', maxWidth: '480px', marginTop: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Or paste an image URL (https://...)"
                value={imageUrl || ''}
                onChange={(e) => onImageChange(e.target.value)}
                style={{
                  ...adminStyles.input,
                  fontSize: '0.8125rem',
                  paddingRight: '2rem',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
