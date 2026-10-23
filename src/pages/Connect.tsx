import React from 'react';
import { MapPin, Phone, Mail, MessageSquare, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { companyInfo } from '../data/companyData';
import { ContactForm } from '../components/contact/ContactForm';
import { Badge } from '../components/common/Badge';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { AnimatedImage } from '../components/common/AnimatedImage';
import { useCMS } from '../context/CMSContext';

export const Connect: React.FC = () => {
  const { settings } = useCMS();
  const address = settings.headquarters || settings.headquarters_address || companyInfo.headquarters.address;
  const phone = settings.phone || settings.primary_phone || companyInfo.headquarters.phone;
  const email = settings.supportEmail || settings.primary_email || companyInfo.headquarters.email;
  const whatsapp = settings.whatsapp_number || companyInfo.headquarters.whatsapp;

  return (
    <div>
      <SEOHead
        title="Connect With Us — Azaroth Tech-Hive"
        description="Contact Azaroth Tech-Hive by phone, WhatsApp, or email from our Chennai office, or submit project inquiries through the online contact form."
        canonicalPath="/connect-with-us"
      />
      {/* Page Hero */}
      <div style={{ position: 'relative' }}>
        <AnimatedImage
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
          alt="Communication background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            height: '100vh',
          }}
          animationType="fade-in"
          duration={1200}
          overlay={true}
          overlayColor="rgba(79, 70, 229, 0.1)"
        />
        <PageHeader
          kicker="- CONNECT WITH US -"
          title="Connect With Us"
          gradientWords={['Connect', 'Us']}
          subtitle="Every great solution starts with a conversation. Whether you have a question, want to discuss a project, or explore how we can help, we're ready to listen and respond."
        />
      </div>

      {/* Main Split Section: Office Info + Contact Form */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'flex-start',
          }}>
            
            {/* Left Column: Office Credentials & Direct Channels */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#49243F',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                &mdash; GLOBAL HEADQUARTERS &mdash;
              </div>
              <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.35rem)', fontWeight: 800, color: '#1E293B', marginBottom: '1rem', lineHeight: 1.25 }}>
                Connect With Our Engineering Team
              </h2>

              <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.65, marginBottom: '2rem' }}>
                Our primary delivery hub and solutions lab operates out of Chennai, coordinating enterprise architectures and dedicated pods for global clients worldwide.
              </p>

              {/* Master Contact Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1.25rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.06)',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                }}
              >
                {/* 1. Address Channel */}
                <div
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(73, 36, 63, 0.08)',
                      color: '#49243F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                      Primary Delivery Center
                    </div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B', lineHeight: 1.5, marginBottom: '0.6rem' }}>
                      {address}
                    </div>
                    <a
                      href={companyInfo.headquarters.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: '#49243F',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                      className="hover:underline"
                    >
                      <span>Locate on Google Maps</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* 2. Direct Phone & WhatsApp Channel (No Repetition!) */}
                <div
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(5, 150, 105, 0.08)',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                      Direct Phone &amp; WhatsApp
                    </div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.75rem', letterSpacing: '0.01em' }}>
                      {phone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                      <a
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#334155',
                          backgroundColor: '#F1F5F9',
                          padding: '0.4rem 0.9rem',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 160ms ease',
                        }}
                        className="hover:bg-slate-200"
                      >
                        <Phone size={13} style={{ color: '#059669' }} />
                        <span>Direct Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#047857',
                          backgroundColor: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          padding: '0.4rem 0.9rem',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 160ms ease',
                        }}
                        className="hover:bg-emerald-100"
                      >
                        <MessageSquare size={13} style={{ color: '#059669' }} />
                        <span>Open WhatsApp Chat</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. Email Channel */}
                <div
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      color: '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                      General &amp; Project Inquiries
                    </div>
                    <a
                      href={`mailto:${email}`}
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: '#1E293B',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginBottom: '0.35rem',
                      }}
                      className="hover:text-rose-700"
                    >
                      <span>{email}</span>
                      <ExternalLink size={13} style={{ color: '#49243F' }} />
                    </a>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Executive scoping review within 24 business hours
                    </div>
                  </div>
                </div>

                {/* Trust Footer inside Master Card */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.8125rem',
                    color: '#64748B',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
                    <span>Operating Hours: Mon &ndash; Fri, 9:00 AM &ndash; 7:00 PM IST</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={14} style={{ color: '#059669', flexShrink: 0 }} />
                    <span>Strict confidentiality &amp; enterprise NDA protection on all inquiries</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Conversion Form */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <Badge variant="gold" style={{ marginBottom: '0.5rem' }}>
                  Online Inquiry Portal
                </Badge>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-forest, #012411)' }}>
                  Submit Project Inquiries
                </h3>
              </div>

              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
