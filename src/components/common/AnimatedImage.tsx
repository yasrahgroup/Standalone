import React, { useEffect, useRef, useState } from 'react';
import { MediaRenderer } from './MediaRenderer';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  animationType?: 'fade-in' | 'zoom' | 'parallax' | 'float' | 'slide-up';
  duration?: number;
  delay?: number;
  overlay?: boolean;
  overlayColor?: string;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  className = '',
  style = {},
  animationType = 'fade-in',
  duration = 1000,
  delay = 0,
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.3)',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animationType === 'parallax' && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    }
  };

  const getAnimationStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    };

    if (!isVisible) {
      switch (animationType) {
        case 'fade-in':
          return { ...baseStyle, opacity: 0 };
        case 'zoom':
          return { ...baseStyle, opacity: 0, transform: 'scale(0.9)' };
        case 'slide-up':
          return { ...baseStyle, opacity: 0, transform: 'translateY(30px)' };
        case 'float':
          return { ...baseStyle, opacity: 0, transform: 'translateY(20px)' };
        default:
          return { ...baseStyle, opacity: 0 };
      }
    }

    switch (animationType) {
      case 'fade-in':
        return { ...baseStyle, opacity: 1 };
      case 'zoom':
        return { ...baseStyle, opacity: 1, transform: 'scale(1)' };
      case 'slide-up':
        return { ...baseStyle, opacity: 1, transform: 'translateY(0)' };
      case 'float':
        return {
          ...baseStyle,
          opacity: 1,
          transform: 'translateY(0)',
          animation: 'float 3s ease-in-out infinite',
        };
      case 'parallax':
        return {
          ...baseStyle,
          opacity: 1,
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        };
      default:
        return { ...baseStyle, opacity: 1 };
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
      <div
        ref={containerRef}
        className={className}
        style={{ position: 'relative', overflow: 'hidden', ...style }}
        onMouseMove={handleMouseMove}
      >
        <MediaRenderer
          src={src}
          alt={alt}
          objectFit="cover"
          style={{
            width: '100%',
            height: '100%',
            ...getAnimationStyle(),
          }}
          loading="lazy"
        />
        {overlay && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: overlayColor,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </>
  );
};

export default AnimatedImage;
