import { render, screen, cleanup } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { App } from '../App';

const routes: Array<{ path: string }> = [
  { path: '/' },
  { path: '/about' },
  { path: '/values' },
  { path: '/delivery-framework' },
  { path: '/products' },
  { path: '/products/fitness-management-platform' },
  { path: '/products/not-a-real-product' },
  { path: '/services' },
  { path: '/service' },
  { path: '/portfolio' },
  { path: '/technology-insights' },
  { path: '/technology-insights/scaling-event-streaming-zero-data-loss' },
  { path: '/connect-with-us' },
  { path: '/request-for-quote' },
  { path: '/privacy-policy' },
  { path: '/terms-of-service' },
  { path: '/route-that-does-not-exist' },
  { path: '/how-we-work' },
  { path: '/insights' },
  { path: '/connect' },
  { path: '/rfq' },
];

const renderAt = (path: string) => {
  window.history.pushState({}, '', path);
  return render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
};

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

afterEach(() => {
  cleanup();
});

describe('route smoke tests', () => {
  for (const route of routes) {
    it(`renders ${route.path} without crashing and exposes landmarks`, () => {
      const { container } = renderAt(route.path);

      expect(container.querySelector('#main-content')).toBeTruthy();
      expect(container.querySelector('h1, h2')).toBeTruthy();
      expect(screen.getAllByRole('banner').length).toBeGreaterThan(0);
      expect(container.textContent).not.toMatch(/undefined|\[object Object\]/);
      expect(container.textContent).not.toMatch(/Lorem ipsum/i);
    });
  }

  it('renders the 404 page for unknown routes', () => {
    const { container } = renderAt('/definitely-not-a-page');
    expect(container.textContent).toMatch(/404|Page Not Found/i);
  });

  it('keeps legacy paths reachable through redirects', () => {
    const { container } = renderAt('/rfq');
    expect(container.querySelector('#main-content')).toBeTruthy();
    expect(container.textContent).toMatch(/quote|scope|solution/i);
  });
});
