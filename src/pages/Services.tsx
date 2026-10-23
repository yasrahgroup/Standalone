import React from 'react';
import {
  Cpu,
  Compass,
  Users,
  Workflow,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { SlaMatrix } from '../components/services/SlaMatrix';
import { Button } from '../components/common/Button';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { Link } from 'react-router-dom';

interface ServiceDetail {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  description: string;
  deliverables: string[];
  sla: string;
}

const detailedServices: ServiceDetail[] = [
  {
    id: 'digital-transformation-technology-solutions',
    title: 'Enterprise Digital Transformation & Technology Solutions',
    category: 'Enterprise Engineering',
    sla: 'Standard Enterprise SLA',
    icon: <Cpu size={24} />,
    iconBg: 'rgba(73, 36, 63, 0.08)',
    iconColor: '#49243F',
    description:
      'Azaroth Tech-Hive empowers enterprises to build, modernize, and scale their software ecosystems through strategic engineering and architectural expertise. We transform complex applications, streamline system integrations, strengthen data management, and optimize critical business systems through disciplined engineering practices—delivering secure, resilient, and adaptable software designed for operational continuity and long-term growth.',
    deliverables: [
      'Technology Strategy & Solution Architecture',
      'Application Modernization & Software Evolution',
      'End-to-End Software Engineering & Modernization',
      'Enterprise Applications & Systems Integration',
      'Intelligent Automation & Data Solutions',
    ],
  },
  {
    id: 'strategic-partnership-consulting',
    title: 'Strategic Partnership & Consulting',
    category: 'Enterprise Engineering',
    sla: 'Standard Enterprise SLA',
    icon: <Compass size={24} />,
    iconBg: 'rgba(73, 36, 63, 0.08)',
    iconColor: '#49243F',
    description:
      'Build a stronger technology foundation with strategic guidance and hands-on engineering collaboration. We work alongside your team to clarify technical direction, improve software architecture, strengthen development practices, and turn business priorities into actionable technology initiatives. From evaluating technology choices to evolving existing products and addressing security risks, we help you make informed decisions, improve delivery, and create lasting value from your software investments.',
    deliverables: [
      'Strategic Technology Advisory & Roadmap Planning',
      'Software Architecture & Engineering Guidance',
      'Collaborative Engineering Partnership',
      'Application Modernisation & Continuous Improvement',
      'Product Innovation, Prototyping & R&D Support',
      'Software Security & Risk Management',
    ],
  },
  {
    id: 'on-demand-workforce-solutions',
    title: 'On-Demand Engineering Workforce Solutions',
    category: 'Enterprise Engineering',
    sla: 'Standard Enterprise SLA',
    icon: <Users size={24} />,
    iconBg: 'rgba(73, 36, 63, 0.08)',
    iconColor: '#49243F',
    description:
      'Strengthen your software development capabilities with experienced engineers, solution architects, and quality specialists across diverse technologies and platforms. Our flexible engagement models, structured onboarding, and transparent delivery practices help teams overcome technical challenges, accelerate development, improve software quality, and bring ideas to life efficiently.',
    deliverables: [
      'Dedicated Specialist Teams',
      'Flexible Team Scaling & Staff Augmentation',
      'Precision Skills & Expertise Matching',
      'Rapid Team Mobilisation & Onboarding',
    ],
  },
  {
    id: 'business-process-management-operations',
    title: 'Business Process Management & Operations',
    category: 'Enterprise Engineering',
    sla: 'Standard Enterprise SLA',
    icon: <Workflow size={24} />,
    iconBg: 'rgba(201, 155, 82, 0.08)',
    iconColor: '#49243F',
    description:
      'Transform complex workflows into streamlined digital processes with intelligent automation, integrated applications, and actionable real-time insights. From reducing manual effort to connecting fragmented systems, we engineer practical software solutions that improve efficiency, enhance visibility, and help businesses operate smarter.',
    deliverables: [
      'Workflow Optimisation & Process Re-engineering',
      'Intelligent Automation & API Integration',
      'Application Monitoring, Reliability & Operational Support',
      'Document Digitisation & Approval Workflow Automation',
      'Operational Analytics, Performance Insights & Continuous Improvement',
    ],
  },
];

export const Services: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Enterprise Engineering Services &amp; Practices — Azaroth Tech-Hive"
        description="Explore Azaroth Tech-Hive's 4 core enterprise engineering practices: Digital Transformation, Strategic Consulting, On-Demand Workforce, and Business Process Management."
        canonicalPath="/services"
      />

      {/* Page Hero Banner */}
      <PageHeader
        kicker="- OUR SERVICES -"
        title="Comprehensive Digital Solutions"
        gradientWords={['Digital', 'Solutions']}
        subtitle="We offer end-to-end technology services to help you build, optimize and scale your digital presence with enterprise performance guarantees."
        actions={
          <>
            <Button to="/connect-with-us" variant="primary" size="lg" icon={<ArrowRight size={16} />}>
              Schedule Technical Discovery
            </Button>
            <Button to="/connect-with-us" variant="outline" size="lg">
              Book Architecture Discovery
            </Button>
          </>
        }
      />

      {/* Services Grid (Organized in 2x2 Grid with Justified Content) */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '5.5rem 0' }} id="services-catalog">
        <style>{`
          .services-grid-2x2 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2.25rem;
            max-width: 1240px;
            margin: 0 auto;
          }
          @media (min-width: 900px) {
            .services-grid-2x2 {
              grid-template-columns: repeat(2, 1fr);
              gap: 2.5rem;
            }
          }
        `}</style>

        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 800, color: '#1E293B', marginBottom: '1rem' }}>
              Specialized Engineering Practices
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.0625rem', lineHeight: 1.6 }}>
              Each practice is staffed with senior domain specialists, modern toolchains, and verifiable deliverables.
            </p>
          </div>

          {/* 2x2 Responsive Grid */}
          <div className="services-grid-2x2">
            {detailedServices.map((service) => (
              <div
                key={service.id}
                id={service.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1.5rem',
                  padding: '2.5rem 2.25rem',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                  scrollMarginTop: '7rem',
                }}
                className="hover:-translate-y-1.5 hover:shadow-xl hover:border-rose-200"
              >
                {/* Top Section: Icon, SLA Badge, Category, Title, Description */}
                <div>
                  {/* Header Icon & Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '14px',
                        backgroundColor: service.iconBg,
                        color: service.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(73, 36, 63, 0.15)',
                      }}
                    >
                      {service.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#059669',
                        backgroundColor: '#ECFDF5',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        border: '1px solid #A7F3D0',
                      }}
                    >
                      {service.sla}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#49243F',
                      marginBottom: '0.45rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {service.category}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.375rem',
                      fontWeight: 800,
                      color: '#1E293B',
                      marginBottom: '1rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Justified Description */}
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: '#475569',
                      lineHeight: 1.7,
                      textAlign: 'justify',
                      textJustify: 'inter-word',
                      marginBottom: '2rem',
                    }}
                  >
                    {service.description}
                  </p>
                </div>

                {/* Bottom Section: Key Deliverables & Action Links */}
                <div>
                  {/* Deliverables Checklist */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: '#334155',
                        marginBottom: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Key Deliverables:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {service.deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.625rem',
                            fontSize: '0.84375rem',
                            color: '#334155',
                            lineHeight: 1.5,
                          }}
                        >
                          <CheckCircle2
                            size={16}
                            style={{ color: '#059669', flexShrink: 0, marginTop: '0.15rem' }}
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deploy Practice CTA */}
                  <div
                    style={{
                      paddingTop: '1.25rem',
                      borderTop: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Link
                      to="/connect-with-us"
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#49243F',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 160ms ease',
                      }}
                      className="hover:gap-2.5"
                    >
                      <span>Deploy Practice</span>
                      <ArrowRight size={15} />
                    </Link>

                    <Button to="/connect-with-us" variant="outline" size="sm">
                      Inquire
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA Tier Matrix Section */}
      <SlaMatrix />

      {/* Bottom CTA */}
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
            Ready to Accelerate Your Digital Transformation?
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary, #64748B)',
              lineHeight: 1.6,
              marginBottom: '2.25rem',
            }}
          >
            Talk to an Azaroth Techhive engineering architect today. We provide fixed-scope estimates, technology audits, and rapid pod kickoffs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button to="/connect-with-us" variant="primary" size="lg" icon={<ArrowRight size={16} />}>
              Schedule Consultation
            </Button>
            <Button to="/connect-with-us" variant="outline" size="lg">
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
