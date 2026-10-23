import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Cookie
} from 'lucide-react';
import logoImg from '../../assets/Logo.png';
import { useCMS } from '../../context/CMSContext';

export const Footer: React.FC = () => {
  const { settings } = useCMS();

  const phone = settings?.phone || settings?.primary_phone || '+974 1234 5678';
  const email = settings?.supportEmail || settings?.primary_email || 'hello@azaroth-techhive.com';
  const address = settings?.headquarters || settings?.headquarters_address || 'Doha, Qatar';
  const copyright = settings?.copyright_text || 'All rights reserved © 2026 Azaroth Tech-Hive Inc';
  const isReversed = (settings?.footerLayout || 'reversed') === 'reversed';

  // Social Icons Component
  const socialIcons = (
    <div style={{ marginTop: '1.25rem' }}>
      <div style={{ fontSize: '0.8125rem', color: '#CBD5E1', fontWeight: 600, marginBottom: '0.75rem' }}>
        Follow Us
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <a
          href={settings?.linkedinUrl || "https://linkedin.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 160ms',
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Linkedin size={15} />
        </a>
{/* 
        <a
          href={settings?.twitterUrl || "https://x.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="X (formerly Twitter)"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 160ms',
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Twitter size={15} />
        </a>

        <a
          href={(settings as any)?.facebookUrl || "https://facebook.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 160ms',
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Facebook size={15} />
        </a>

        <a
          href={(settings as any)?.instagramUrl || "https://instagram.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 160ms',
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Instagram size={15} />
        </a>

        <a
          href={(settings as any)?.youtubeUrl || "https://youtube.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="YouTube"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 160ms',
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Youtube size={15} />
        </a> */}
      </div>
    </div>
  );

  // 1. Brand Logo, Tagline & Follow Us Column
  const brandColumn = (
    <div key="col-brand" style={{ maxWidth: '300px' }}>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          marginBottom: '1rem',
        }}
      >
        <img
          src={settings?.logoUrl || logoImg}
          alt={settings?.companyName || "Azaroth Techhive Logo"}
          style={{
            maxHeight: '2.5rem',
            maxWidth: '8rem',
            objectFit: 'contain',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: 'serif',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
            }}
          >
            AZAROTH
          </span>
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              color: '#49243F',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            TECHHIVE
          </span>
        </div>
      </Link>

      <div
        style={{
          fontSize: '0.875rem',
          color: '#94A3B8',
          letterSpacing: '0.08em',
          fontWeight: 500,
          marginTop: '0.5rem',
        }}
      >
        Build &middot; Innovate &middot; Grow
      </div>

      {socialIcons}
    </div>
  );

  // 2. Quick Links Column (Updated with Explore Products & Explore Services per diagram)
  const quickLinksColumn = (
    <div key="col-quicklinks">
      <h4
        style={{
          color: '#FFFFFF',
          fontSize: '0.9375rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}
      >
        Quick Links
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <li>
          <Link to="/products" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 160ms' }} className="hover:text-rose-400">
            Explore Products
          </Link>
        </li>
        <li>
          <Link to="/services" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 160ms' }} className="hover:text-rose-400">
            Explore Services
          </Link>
        </li>
        <li>
          <Link to="/resource-hub" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 160ms' }} className="hover:text-rose-400">
            Resource Hub
          </Link>
        </li>
      </ul>
    </div>
  );

  // 3. Contact Us Column
  const contactColumn = (
    <div key="col-contact">
      <h4
        style={{
          color: '#FFFFFF',
          fontSize: '0.9375rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}
      >
        Contact Us
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Phone size={15} style={{ color: '#49243F', flexShrink: 0 }} />
          <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: '#94A3B8', textDecoration: 'none' }} className="hover:text-white">
            {phone}
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Mail size={15} style={{ color: '#49243F', flexShrink: 0 }} />
          <a href={`mailto:${email}`} style={{ color: '#94A3B8', textDecoration: 'none' }} className="hover:text-white">
            {email}
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
          <MapPin size={15} style={{ color: '#49243F', flexShrink: 0, marginTop: '0.2rem' }} />
          <span style={{ color: '#94A3B8', lineHeight: 1.5 }}>{address}</span>
        </div>
      </div>
    </div>
  );

  // 3-Column Distribution matching user diagram: [Contact Us, Quick Links, Brand with Follow Us]
  const footerColumns = isReversed
    ? [contactColumn, quickLinksColumn, brandColumn]
    : [brandColumn, quickLinksColumn, contactColumn];

  return (
    <footer
      style={{
        backgroundColor: '#0A1118',
        color: '#94A3B8',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
      id="site-footer"
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          width: '500px',
          height: '250px',
          background: 'radial-gradient(ellipse at center, rgba(73, 36, 63, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: '20%',
          width: '450px',
          height: '220px',
          background: 'radial-gradient(ellipse at center, rgba(201, 155, 82, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ paddingTop: '4.5rem', paddingBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
        {/* 3 Columns matching user markup */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {footerColumns}
        </div>

        {/* Bottom Bar: Copyright, Legal & Cookies (Admin Portal pill removed per diagram) */}
        <div
          style={{
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#64748B',
          }}
        >
          <div>
            {copyright}
          </div>

          {/* Privacy Policy & Cookies */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/privacy-policy"
              style={{
                color: '#94A3B8',
                textDecoration: 'none',
                transition: 'color 160ms ease',
              }}
              className="hover:text-rose-400"
            >
              Privacy Policy
            </Link>

            <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>&bull;</span>

            <Link
              to="/privacy-policy#cookies"
              style={{
                color: '#94A3B8',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 160ms ease',
              }}
              className="hover:text-rose-400"
            >
              <Cookie size={13} style={{ opacity: 0.7 }} />
              <span>Cookies</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
