import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect } from 'vitest';
import { Home } from '../../pages/Home';
import { SlaMatrix } from './SlaMatrix';

describe('SlaMatrix', () => {
  it('uses scope-based delivery language instead of unsupported SLA guarantees', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SlaMatrix />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(/Transparent engagement models/i)).toBeInTheDocument();
    expect(screen.queryByText(/24\/7 war room response/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/99\.99%/i)).not.toBeInTheDocument();
  });
});

describe('Home page', () => {
  it('promotes enterprise-ready homepage messaging that matches temp.jpeg reference', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(/Intelligence, Engineered/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Innovation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Comprehensive/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Digital Solutions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Turning Ideas into/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Learn More/i).length).toBeGreaterThan(0);
  });
});
