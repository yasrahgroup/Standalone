import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Home } from '../pages/Home';
import { Products } from '../pages/Products';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ContactForm } from '../components/contact/ContactForm';
import { RfqWizard } from '../components/rfq/RfqWizard';
import { apiService } from '../services/api';

describe('Azaroth Tech-Hive E2E Acceptance Criteria & User Journeys', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
    // Mock API service for form submission tests
    vi.spyOn(apiService, 'submitContactForm').mockResolvedValue({
      success: true,
      data: { referenceId: '12345' },
      message: 'Contact form submitted successfully'
    });
  });

  // AT-01 / E2E-01: Discover company & Home CTAs
  it('AT-01: renders approved Hero headline and working Request for Quote & Portfolio CTAs', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/']}>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Approved headline
    expect(screen.getByText(/Intelligence, Engineered/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Innovation/i).length).toBeGreaterThan(0);

    // Approved CTAs
    const rfqLinks = screen.getAllByRole('link', { name: /Request for Quote/i });
    expect(rfqLinks.length).toBeGreaterThan(0);
    expect(rfqLinks[0]).toHaveAttribute('href', '/request-for-quote');

    const portfolioLinks = screen.getAllByRole('link', { name: /Our Portfolio/i });
    expect(portfolioLinks.length).toBeGreaterThan(0);
    expect(portfolioLinks[0]).toHaveAttribute('href', '/portfolio');
  });

  // AT-02 / E2E-04: Flat Direct Navigation without dropdowns (Matching UI Reference)
  it('AT-02: exposes flat direct navigation links for Home, About, Our Services, Our Products, Technology Insights, and Connect with Us', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/about']}>
          <Header />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Direct navigation links without dropdowns
    expect(screen.getByRole('link', { name: /^Home$/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /^About$/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /^Our Services$/i })).toHaveAttribute('href', '/services');
    expect(screen.getByRole('link', { name: /^Our Products$/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /^Technology Insights$/i })).toHaveAttribute('href', '/technology-insights');
    expect(screen.getByRole('link', { name: /^Connect with Us$/i })).toHaveAttribute('href', '/connect-with-us');

    // Active item has aria-current="page"
    expect(screen.getByRole('link', { name: /^About$/i })).toHaveAttribute('aria-current', 'page');
  });

  // AT-03: Product Status Verification
  it('AT-03: product cards display "Under Development" status and do NOT contain unapproved badges', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/products']}>
          <Products />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Catalog should have under development badges
    const badges = screen.getAllByText(/Under Development/i);
    expect(badges.length).toBeGreaterThan(0);

    // Unapproved labels must be absent
    expect(screen.queryByText(/Most Popular/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Foundational Platform/i)).not.toBeInTheDocument();
  });

  // AT-04 / AT-05 / AT-06 / E2E-06 / E2E-08: Contact Form Validation & Submission
  it('AT-04 to AT-06: validates required fields, invalid email, and mandatory consent on Contact Form', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ContactForm />
        </MemoryRouter>
      </HelmetProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /Submit/i });

    // Submit empty form -> validation errors
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Full Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Work Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Company name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Please confirm you agree to be contacted/i)).toBeInTheDocument();

    // Fill invalid email (has @ but missing domain TLD)
    const emailInput = screen.getByLabelText(/Work Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email@nodot' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please provide a valid email address/i)).toBeInTheDocument();

    // Fill valid data and check consent enforcement
    const nameInput = screen.getByLabelText(/Full Name/i);
    const companyInput = screen.getByLabelText(/Company \/ Organization/i);
    const messageInput = screen.getByLabelText(/How Can We Help\?/i);
    const consentCheckbox = screen.getByRole('checkbox');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@enterprise.com' } });
    fireEvent.change(companyInput, { target: { value: 'Acme Corp' } });
    fireEvent.change(messageInput, { target: { value: 'We need enterprise architecture and distributed systems consulting.' } });

    // Without consent -> blocked
    fireEvent.click(submitBtn);
    expect(screen.getByText(/Please confirm you agree to be contacted/i)).toBeInTheDocument();

    // Check consent -> submitted successfully
    fireEvent.click(consentCheckbox);
    fireEvent.click(submitBtn);

    // Expect success message
    expect(await screen.findByText(/Message Received/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
  });

  // AT-07 / E2E-07: RFQ Wizard Multi-Step Flow
  it('AT-07: guides user through RFQ steps with approved solution options and validation', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <RfqWizard />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Step 1: Solution Options
    expect(screen.getByText(/Select Architecture & Engineering Focus/i)).toBeInTheDocument();
    expect(screen.getByText(/Cloud and Distributed Systems/i)).toBeInTheDocument();
    expect(screen.getByText(/Legacy Modernization/i)).toBeInTheDocument();
    expect(screen.getByText(/Fitness Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Multi-Store Commerce/i)).toBeInTheDocument();
    expect(screen.getByText(/Dedicated Engineering Pods/i)).toBeInTheDocument();

    // Advance to Step 2: Scope & Urgency
    const nextBtn = screen.getByRole('button', { name: /Continue to Step 2/i });
    fireEvent.click(nextBtn);

    expect(await screen.findByText(/Project Scope & Target Timeline/i)).toBeInTheDocument();

    // Advance to Step 3: Budget & Specs
    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 3/i }));
    expect(await screen.findByText(/Budget Allocation & Architectural Requirements/i)).toBeInTheDocument();

    // Step 3 requires at least 15 chars description
    const specTextarea = screen.getByLabelText(/Project Scope & Technical Requirements/i);
    fireEvent.change(specTextarea, { target: { value: 'End-to-end cloud modernization and multi-store commerce implementation.' } });

    // Advance to Step 4: Documents
    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 4/i }));
    expect(await screen.findByText(/Share Your Project Documents/i)).toBeInTheDocument();

    // Advance to Step 5: Contact & Verification
    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 5/i }));
    expect(await screen.findByText(/Contact & Verification Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Person Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Organization Name/i)).toBeInTheDocument();
  });

  // AT-12 / E2E-13: Removed Content Verification
  it('AT-12: explicitly verifies that removed metrics banners and obsolete labels are absent', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/']}>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Old unverified metrics block from homepage must be absent
    expect(screen.queryByText(/99\.99% Uptime SLA Guarantee/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Admin Portal/i)).not.toBeInTheDocument();
  });

  // AT-14 / E2E-14: Footer and Legal Links
  it('AT-14: footer renders verified Chennai address, phone, email, and legal links', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/']}>
          <Footer />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Address verification
    expect(screen.getByText(/24, Malaviya Avenue, Thiruvanmiyur, Chennai, India/i)).toBeInTheDocument();
    expect(screen.getByText(/\+91 6379480931/i)).toBeInTheDocument();
    expect(screen.getByText(/hello@azaroth-techhive\.com/i)).toBeInTheDocument();

    // Legal links
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toHaveAttribute('href', '/privacy-policy');
    expect(screen.getByRole('link', { name: /Terms of Service/i })).toHaveAttribute('href', '/terms-of-service');
  });
});
