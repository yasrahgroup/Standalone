import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { BackToTop } from '../components/common/BackToTop';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Chatbot } from '../components/common/Chatbot';
import { CustomCursor } from '../components/common/CustomCursor';
import { AdminFloatingBadge } from '../components/common/AdminFloatingBadge';

const RouteEffects: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      window.requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
          if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1');
          }
          target.focus({ preventScroll: true });
        }
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export const PublicLayout: React.FC = () => {
  const mainRef = useRef<HTMLElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    mainRef.current?.setAttribute('tabindex', '-1');
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 0,
            zIndex: 200,
            padding: '0.75rem 1.25rem',
            backgroundColor: 'var(--color-primary-button, #18181B)',
            color: '#ffffff',
            fontWeight: 600,
            textDecoration: 'none',
            borderRadius: '0 0 var(--radius-md, 8px) 0',
          }}
          onFocus={(event) => {
            event.currentTarget.style.left = '0';
          }}
          onBlur={(event) => {
            event.currentTarget.style.left = '-9999px';
          }}
        >
          Skip to main content
        </a>
        <RouteEffects />
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <main id="main-content" ref={mainRef} style={{ flex: '1 0 auto' }}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
        <BackToTop />
        <Chatbot />
        <CustomCursor />
        <AdminFloatingBadge />
      </div>
    </MotionConfig>
  );
};
