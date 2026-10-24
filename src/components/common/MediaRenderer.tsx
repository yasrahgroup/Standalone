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
  onError?: () => void;
}

/**
 * MediaRenderer
 * A unified component that renders either images or videos based on file extension.
 * Supports common image formats (jpg, jpeg, png, gif, webp, svg) and video formats (mp4, webm, ogg).
 * Preserves existing image rendering behavior while adding video support with appropriate attributes.
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
  onError,
}) => {
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'unknown'>('unknown');
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Detect media type from file extension
    const extension = src.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(extension)) {
      setMediaType('image');
    } else if (['mp4', 'webm', 'ogg', 'mov', 'm4v', 'avi'].includes(extension)) {
      setMediaType('video');
    } else {
      setMediaType('unknown');
    }
  }, [src]);

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Fallback for unknown or failed media
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
        role="img"
        aria-label={alt}
      >
        Media unavailable
      </div>
    );
  }

  // Render image
  if (mediaType === 'image') {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          ...style,
        }}
        loading={loading}
        onError={handleError}
      />
    );
  }

  // Render video
  if (mediaType === 'video') {
    return (
      <video
        ref={videoRef}
        src={src}
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
