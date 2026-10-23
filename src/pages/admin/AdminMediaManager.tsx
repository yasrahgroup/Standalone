// src/pages/admin/AdminMediaManager.tsx
import React, { useState, useEffect } from 'react';
import { Image, Upload, Trash2, Copy, CheckCircle2, FileText } from 'lucide-react';
import { cmsService, CmsMedia } from '../../services/cmsService';
import { adminColors, adminStyles } from '../../styles/adminTheme';

export const AdminMediaManager: React.FC = () => {
  const [mediaList, setMediaList] = useState<CmsMedia[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadMedia = async () => {
    try {
      const data = await cmsService.fetchMedia();
      setMediaList(data || []);
    } catch {
      setMediaList([]);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await cmsService.uploadMedia(file, 'general', file.name);
      setNotification(`File "${file.name}" uploaded successfully!`);
      setTimeout(() => setNotification(null), 3000);
      loadMedia();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"?`)) {
      try {
        await cmsService.deleteMedia(id);
        loadMedia();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: adminColors.slate.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: adminColors.indigo.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image size={22} color={adminColors.indigo.text} />
            </div>
            Media Library & Assets
          </h1>
          <p style={{ fontSize: '0.875rem', color: adminColors.slate.textMuted, marginTop: '0.5rem', marginLeft: '3.25rem' }}>
            Upload and host product screenshots, team avatars, architecture diagrams, and PDF whitepapers.
          </p>
        </div>

        <div>
          <label
            style={{
              ...adminStyles.successButton,
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.7 : 1,
            }}
          >
            <Upload size={18} />
            <span>{isUploading ? 'Uploading...' : 'Upload File / Image'}</span>
            <input type="file" onChange={handleFileUpload} disabled={isUploading} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {notification && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.25rem', backgroundColor: adminColors.emerald.light, border: `1px solid ${adminColors.emerald.border}`, borderRadius: '10px', color: adminColors.emerald.text, marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} color={adminColors.emerald.base} /> {notification}
        </div>
      )}

      {/* Media Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {mediaList.length === 0 ? (
          <div style={{ gridColumn: 'span 4', padding: '4rem', textAlign: 'center', backgroundColor: adminColors.slate.card, borderRadius: '12px', border: `1px dashed ${adminColors.slate.borderStrong}`, color: adminColors.slate.textMuted }}>
            <Upload size={36} color={adminColors.indigo.base} style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
            <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 500, color: adminColors.slate.textSecondary }}>No files uploaded yet. Click "Upload File / Image" above to populate the media library.</p>
          </div>
        ) : (
          mediaList.map((item) => {
            const isImage = item.mimeType?.startsWith('image/');
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: adminColors.slate.card,
                  border: `1px solid ${adminColors.slate.border}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {/* Preview */}
                <div style={{ height: '150px', backgroundColor: adminColors.slate.cardMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: `1px solid ${adminColors.slate.borderLight}` }}>
                  {isImage ? (
                    <img src={item.url} alt={item.altText || item.originalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FileText size={48} color={adminColors.slate.textLight} />
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: adminColors.slate.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
                    {item.originalName || item.filename}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: adminColors.slate.textMuted }}>
                    {(item.sizeBytes / 1024).toFixed(1)} KB • {item.mimeType}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', borderTop: `1px solid ${adminColors.slate.borderLight}`, paddingTop: '0.75rem' }}>
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: isCopied ? adminColors.emerald.light : adminColors.indigo.light,
                        border: `1px solid ${isCopied ? adminColors.emerald.border : adminColors.indigo.border}`,
                        color: isCopied ? adminColors.emerald.text : adminColors.indigo.text,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Copy size={13} /> {isCopied ? 'Copied URL!' : 'Copy URL'}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.originalName)}
                      style={{
                        ...adminStyles.dangerButton,
                        padding: '0.35rem 0.5rem',
                      }}
                      title="Delete file"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
