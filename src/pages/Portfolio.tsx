import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Cpu 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';
import { 
  ecommercePlatformImg, 
  mobileBankingAppImg, 
  analyticsDashboardImg, 
  creativePortfolioImg 
} from '../assets/images';
import { productsCatalog } from '../data/productsData';
import { ProductStatusBadge } from '../components/common/ProductStatusBadge';
import { useCMS } from '../context/CMSContext';

interface CaseStudy {
  id: string;
  title: string;
  categories: string;
  image: string;
  description: string;
  metrics: string[];
  client: string;
  techStack: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: 'e-commerce-platform',
    title: 'E-Commerce Platform',
    categories: 'Web Development \u00B7 E-Commerce',
    image: ecommercePlatformImg,
    description: 'High-concurrency headless digital commerce ecosystem designed for global retail brands with sub-second page transitions, dynamic pricing, and omnichannel inventory.',
    metrics: ['Sub-second Page Transitions', 'Synchronized Omnichannel Inventory', 'Headless Multi-Store Architecture'],
    client: 'Global Lifestyle Retailer',
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Tailwind CSS'],
  },
  {
    id: 'mobile-banking-app',
    title: 'Mobile Banking App',
    categories: 'Mobile Apps \u00B7 Fintech',
    image: mobileBankingAppImg,
    description: 'Biometric-secured iOS and Android consumer banking application featuring real-time peer-to-peer transfers, spending insights, and zero-knowledge ledger verification.',
    metrics: ['Biometric Authentication', 'Real-time Peer-to-Peer Transfers', 'Zero-Knowledge Security Hardening'],
    client: 'Finova Banking Group',
    techStack: ['React Native', 'TypeScript', 'Go', 'GraphQL', 'AWS ECS'],
  },
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    categories: 'Web App \u00B7 Business Intelligence',
    image: analyticsDashboardImg,
    description: 'Real-time telemetry and executive data warehouse dashboard processing operational data points with predictive cohort analytics.',
    metrics: ['High-Throughput Ingestion', 'Interactive Cohort Analytics', 'Scalable Warehouse Aggregation'],
    client: 'Aetherius Intelligence',
    techStack: ['React', 'D3.js', 'ClickHouse', 'Python', 'Kafka'],
  },
  {
    id: 'creative-portfolio',
    title: 'Creative Portfolio',
    categories: 'UI/UX Design \u00B7 Branding',
    image: creativePortfolioImg,
    description: 'Interactive brand flagship and digital showroom engineered with fluid micro-interactions, responsive asset rendering, and accessible typography.',
    metrics: ['Fluid Micro-Interactions', 'Accessible Responsive Layouts', 'Optimized Core Web Vitals'],
    client: 'Luma Creative Agency',
    techStack: ['React', 'Framer Motion', 'WebGL', 'Tailwind CSS'],
  },
];

export const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'projects' | 'platforms'>('all');
  const { portfolio: cmsPortfolio } = useCMS();

  const effectiveCaseStudies = (cmsPortfolio && cmsPortfolio.length > 0)
    ? cmsPortfolio.map((p, idx) => {
        const match = caseStudies.find(cs => cs.id === p.slug || cs.id === p.id);
        return {
          id: p.slug || p.id || `proj-${idx}`,
          title: p.title || p.name || match?.title || 'Enterprise Case Study',
          categories: (p as any).categories || p.category || match?.categories || 'Engineering Case Study',
          image: p.coverImage || (p as any).cover_image || match?.image || ecommercePlatformImg,
          description: p.description || p.summary || match?.description || '',
          metrics: p.metrics && Array.isArray(p.metrics) && p.metrics.length > 0
            ? p.metrics
            : (match?.metrics || ['Sub-second Page Transitions', 'Synchronized Omnichannel Inventory']),
          client: p.client || p.clientName || match?.client || 'Enterprise Partner',
          techStack: p.techStack && Array.isArray(p.techStack) && p.techStack.length > 0
            ? p.techStack
            : (p.technologies && Array.isArray(p.technologies) && p.technologies.length > 0
              ? p.technologies
              : (match?.techStack || ['React', 'TypeScript', 'PostgreSQL'])),
        };
      })
    : caseStudies;

  return (
    <div>
      <SEOHead
        title="Our Portfolio &amp; Projects — Azaroth Techhive"
        description="Explore Azaroth Techhive's portfolio of recent projects and enterprise software platforms spanning Web Development, Mobile Apps, Cloud Solutions, and UI/UX Design."
        canonicalPath="/portfolio"
      />

      {/* Page Hero Banner */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          paddingTop: '4.5rem',
          paddingBottom: '4.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: '20%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle at center, rgba(73, 36, 63, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#49243F',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            &mdash; OUR PORTFOLIO &mdash;
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 800,
              color: '#1E293B',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
            }}
          >
            Software Solutions &amp;{' '}
            <span
              style={{
                background: 'var(--gradient-heading)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Recent Work
            </span>
          </h1>
          <p style={{ fontSize: '1.1875rem', color: '#64748B', lineHeight: 1.7, maxWidth: '700px', margin: '0 auto 2rem auto' }}>
            Explore our curated work across consumer web platforms, fintech applications, data intelligence dashboards, and enterprise platforms.
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: activeTab === 'all' ? '1.5px solid #49243F' : '1px solid #E2E8F0',
                backgroundColor: activeTab === 'all' ? '#49243F' : '#FFFFFF',
                color: activeTab === 'all' ? '#FFFFFF' : '#475569',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 150ms ease-out',
              }}
            >
              All Work
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: activeTab === 'projects' ? '1.5px solid #49243F' : '1px solid #E2E8F0',
                backgroundColor: activeTab === 'projects' ? '#49243F' : '#FFFFFF',
                color: activeTab === 'projects' ? '#FFFFFF' : '#475569',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 150ms ease-out',
              }}
            >
              Recent Client Projects
            </button>
            <button
              onClick={() => setActiveTab('platforms')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: activeTab === 'platforms' ? '1.5px solid #49243F' : '1px solid #E2E8F0',
                backgroundColor: activeTab === 'platforms' ? '#49243F' : '#FFFFFF',
                color: activeTab === 'platforms' ? '#FFFFFF' : '#475569',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 150ms ease-out',
              }}
            >
              Proprietary Platforms
            </button>
          </div>
        </div>
      </section>


      {/* 2x2 Grid of Featured Client Projects (Matching temp.jpeg) */}
      {(activeTab === 'all' || activeTab === 'projects') && (
        <section style={{ backgroundColor: '#F8FAFC', padding: '5.5rem 0' }} id="featured-client-projects">
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#49243F',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                &mdash; CLIENT SPOTLIGHTS &mdash;
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 800, color: '#1E293B', marginBottom: '1rem' }}>
                Featured Engineering Deliverables
              </h2>
              <p style={{ color: '#64748B', fontSize: '1.0625rem', lineHeight: 1.6 }}>
                2&times;2 arrangement of our primary production projects deployed for client enterprises.
              </p>
            </div>

            {/* 2x2 Card Grid */}
            <div className="grid-layout-2x2">
              {effectiveCaseStudies.slice(0, 4).map((study: any) => (
                <div
                  key={study.id}
                  id={study.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 240ms ease-out',
                  }}
                  className="hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300"
                >
                  {/* Aspect-Ratio Visual Image */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '220px',
                      overflow: 'hidden',
                      backgroundColor: '#0F172A',
                    }}
                  >
                    <img
                      src={study.image}
                      alt={study.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(6px)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#FFFFFF',
                      }}
                    >
                      {study.client}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#49243F', marginBottom: '0.5rem' }}>
                      {study.categories}
                    </div>

                    <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.75rem' }}>
                      {study.title}
                    </h3>

                    <p style={{ fontSize: '0.9375rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                      {study.description}
                    </p>

                    {/* Key Metrics */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        padding: '0.75rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                      }}
                    >
                      {study.metrics.map((metric: string, i: number) => (
                        <div
                          key={i}
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Check size={13} />
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}>
                      {study.techStack.map((tech: string, i: number) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: '#475569',
                            backgroundColor: '#F1F5F9',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Link
                        to="/connect-with-us"
                        style={{
                          fontSize: '0.90rem',
                          fontWeight: 700,
                          color: '#49243F',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          transition: 'all 160ms ease',
                        }}
                        className="hover:gap-2.5 hover:text-rose-700"
                      >
                        <span>Inquire About Solution</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2x2 Grid of Proprietary Software Platforms */}
      {(activeTab === 'all' || activeTab === 'platforms') && (
        <section style={{ backgroundColor: '#FFFFFF', padding: '5.5rem 0' }} id="proprietary-platforms">
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#49243F',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                &mdash; PLATFORM CATALOG &mdash;
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 800, color: '#1E293B', marginBottom: '1rem' }}>
                Enterprise Platform Software
              </h2>
              <p style={{ color: '#64748B', fontSize: '1.0625rem', lineHeight: 1.6 }}>
                Turnkey architectures available for enterprise licensing and bespoke expansion.
              </p>
            </div>

            {/* 2x2 Grid of Platforms */}
            <div className="grid-layout-2x2">
              {productsCatalog.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '1.5rem',
                    padding: '2.25rem 2rem',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 200ms ease-out',
                  }}
                  className="hover:shadow-lg hover:border-slate-300"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(73, 36, 63, 0.08)',
                        color: '#49243F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Cpu size={22} />
                    </div>
                    <ProductStatusBadge
                      status={product.status || 'Under Development'}
                      colorScheme={product.statusColor}
                      size="sm"
                    />
                  </div>

                  <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.35rem' }}>
                    {product.name}
                  </h3>

                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#49243F', marginBottom: '1rem' }}>
                    {product.tagline}
                  </div>

                  <p style={{ fontSize: '0.9375rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                    {product.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
                    {product.keyCapabilities.slice(0, 3).map((cap, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#475569' }}>
                        <Check size={14} style={{ color: '#059669', flexShrink: 0 }} />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      to={`/products?product=${product.slug}`}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1E293B',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span>Platform Specs</span>
                      <ArrowRight size={14} />
                    </Link>

                    <Button to="/connect-with-us" variant="primary" size="sm">
                      Schedule Demo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        style={{
          backgroundColor: 'var(--color-surface-muted, #FAFAFA)',
          padding: '5rem 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '20%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(73, 36, 63, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--color-text-primary, #1E293B)',
              marginBottom: '1.25rem',
              lineHeight: 1.2,
            }}
          >
            Have a Complex Engineering Challenge?
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary, #64748B)',
              lineHeight: 1.6,
              marginBottom: '2.25rem',
            }}
          >
            Our dedicated pods can be deployed in 2 to 4 weeks. Let&apos;s discuss architecture, scope, and technical roadmap.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button to="/connect-with-us" variant="primary" size="lg" icon={<ArrowRight size={16} />}>
              Start Project Consultation
            </Button>
            <Button to="/connect-with-us" variant="outline" size="lg">
              Book Architecture Discovery
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
