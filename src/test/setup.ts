import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Unconditionally mock window.scrollTo for jsdom compatibility
window.scrollTo = () => {};

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!window.ResizeObserver) {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: ResizeObserverMock,
  });
}

if (!window.IntersectionObserver) {
  class IntersectionObserverMock {
    root = null;
    rootMargin = '';
    thresholds = [];
    disconnect() {}
    observe() {}
    takeRecords() { return []; }
    unobserve() {}
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: IntersectionObserverMock,
  });
}

// Mock AbortController and AbortSignal for jsdom compatibility
class AbortSignalMock {
  aborted = false;
  reason: any = null;
  onabort: ((event: Event) => void) | null = null;

  addEventListener(type: string, listener: (event: Event) => void) {
    if (type === 'abort') {
      this.onabort = listener;
    }
  }

  removeEventListener(type: string, listener: (event: Event) => void) {
    if (type === 'abort' && this.onabort === listener) {
      this.onabort = null;
    }
  }

  dispatchEvent(event: Event): boolean {
    if (event.type === 'abort' && this.onabort) {
      this.onabort(event);
    }
    return true;
  }
}

class AbortControllerMock {
  signal = new AbortSignalMock();

  abort(reason?: any) {
    this.signal.aborted = true;
    this.signal.reason = reason;
    const event = new Event('abort');
    this.signal.dispatchEvent(event);
  }
}

if (!window.AbortController) {
  Object.defineProperty(window, 'AbortController', {
    writable: true,
    value: AbortControllerMock,
  });
}

if (!window.AbortSignal) {
  Object.defineProperty(window, 'AbortSignal', {
    writable: true,
    value: AbortSignalMock,
  });
}

// Mock fetch for API tests
globalThis.fetch = vi.fn();
