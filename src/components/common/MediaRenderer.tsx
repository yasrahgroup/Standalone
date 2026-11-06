import React, { useState, useRef, useEffect } from 'react';

interface MediaRendererProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  decorative?: boolean;
  onError?: () => void;
  fallbackSrc?: string;
}

/**
 * MediaRenderer
 * Renders images or videos while stripping URL query strings/hashes before extension detection,
 * supporting extensionless image CDN URLs (e.g. Unsplash) and ALT-3 decorative slots (alt="").
 */
export const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  alt,
  className = '',
  style = {},
  objectFit = 'cover',
  loading = 'lazy',
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  playsInline = true,
  decorative = false,
  onError,
  fallbackSrc,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'unknown'>('image');
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const activeSrc = currentSrc;
    if (!activeSrc) {
      setMediaType('unknown');
      return;
    }
    if (activeSrc.startsWith('data:image/')) {
      setMediaType('image');
      return;
    }
    if (activeSrc.startsWith('data:video/')) {
      setMediaType('video');
      return;
    }
    const cleanPath = activeSrc.split('?')[0].split('#')[0];
    const lastSegment = cleanPath.split('/').pop() || '';
    const extension = lastSegment.includes('.')
      ? lastSegment.split('.').pop()?.toLowerCase() || ''
      : '';

    if (['mp4', 'webm', 'ogg', 'mov', 'm4v', 'avi'].includes(extension)) {
      setMediaType('video');
    } else if (
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'].includes(extension) ||
      activeSrc.includes('images.unsplash.com') ||
      activeSrc.startsWith('/api/admin/media/preview/')
    ) {
      setMediaType('image');
    } else {
      setMediaType('image');
    }
  }, [currentSrc]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setHasError(true);
    if (onError) onError();
  };

  if (hasError || mediaType === 'unknown') {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F1F5F9',
          color: '#64748B',
          fontSize: '0.875rem',
          ...style,
        }}
        role={decorative ? 'presentation' : 'img'}
        aria-hidden={decorative ? 'true' : undefined}
        aria-label={decorative ? undefined : alt}
      >
        Media unavailable
      </div>
    );
  }

  if (mediaType === 'image') {
    return (
      <img
        src={currentSrc}
        alt={decorative ? '' : alt}
        aria-hidden={decorative ? 'true' : undefined}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          ...style,
        }}
        loading={loading}
        decoding="async"
        onError={handleError}
      />
    );
  }

  if (mediaType === 'video') {
    return (
      <video
        ref={videoRef}
        src={currentSrc}
        poster={poster}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          ...style,
        }}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline={playsInline}
        onError={handleError}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
};

export default MediaRenderer;
