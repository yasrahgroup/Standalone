import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Target,
  Compass,
  Lightbulb,
  Maximize2,
  CheckCircle,
  Users,
  TrendingUp,
} from 'lucide-react';
import { companyVisionMission, ourValuesPrinciples } from '../data/companyData';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { ProcessTimeline } from '../components/framework/ProcessTimeline';
import { FinalCTA } from '../components/home/FinalCTA';
import { heroWorkspaceImg } from '../assets/images';
import { useCMS } from '../context/CMSContext';

export const About: React.FC = () => {
  const { pages } = useCMS();
  const location = useLocation();

  const pageData = pages['about'];
  const content = pageData?.content || {};

  const valuesData = pages['values'];
  const valuesContent = valuesData?.content || {};

  const valuesPrinciples = (valuesContent.principles && Array.isArray(valuesContent.principles) && valuesContent.principles.length > 0)
    ? valuesContent.principles
    : ourValuesPrinciples;

  const kicker = content.kicker || '- WHO WE ARE -';
  const heroTitle = content.heroTitle || pageData?.title || 'Engineering Meaningful Solutions Building Lasting Value';
  const heroSubtitle = content.heroSubtitle || pageData?.meta_description || 'At Azaroth Techhive, we are passionate about technology and driven by a simple goal — to help businesses build smarter, stronger and more innovative digital solutions with a client-first approach.';
  const storyBadge = content.storyBadge || '— OUR STORY —';
  const storyTitle = content.storyTitle || 'Turning Ideas into Digital Reality';
  const storyParagraph1 = content.storyParagraph1 || 'Azaroth Techhive delivers practical software engineering solutions that help businesses overcome complex technical bottlenecks, modernise legacy operations, and turn high-stakes ideas into dependable digital products.';
  const storyParagraph2 = content.storyParagraph2 || 'With dedicated engineering pods, cloud modernisation, and custom application development, we bring your vision to life, one line of clean, tested code at a time.';
  const visionText = content.vision || companyVisionMission.vision.statement;
  const missionText = content.mission || companyVisionMission.mission.statement;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Lightbulb': return <Lightbulb size={26} />;
      case 'ShieldCheck': return <ShieldCheck size={26} />;
      case 'Maximize2': return <Maximize2 size={26} />;
      case 'CheckCircle': return <CheckCircle size={26} />;
      case 'Users': return <Users size={26} />;
      case 'TrendingUp': return <TrendingUp size={26} />;
      default: return <Lightbulb size={26} />;
    }
  };

  const scrollToAnchor = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  // Smooth scroll to anchor on initial load or location hash updates
  useEffect(() => {
    const rawHash = location.hash ? location.hash.replace('#', '') : '';
    if (['about-us', 'our-values', 'values', 'delivery-framework', 'framework'].includes(rawHash)) {
      const targetId = rawHash === 'values' ? 'our-values' : rawHash === 'framework' ? 'delivery-framework' : rawHash;
      const timer = setTimeout(() => {
        const elem = document.getElementById(targetId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div>
      <SEOHead
        title={pageData?.title ? `${pageData.title} | Azaroth Techhive` : "About Us — Values & Delivery Framework | Azaroth Techhive"}
        description={pageData?.meta_description || "Learn about Azaroth Techhive: our vision, core values, and 4-phase zero-downtime delivery framework."}
        canonicalPath="/about"
      />

      {/* Page Hero Banner */}
      <PageHeader
        kicker={kicker}
        title={heroTitle}
        gradientWords={['Building', 'Lasting', 'Value', 'Meaningful', 'Solutions']}
        subtitle={heroSubtitle}
      />

      {/* SECTION 1: ABOUT US (Narrative with Visual Workspace Image) */}
      <section
        id="about-us"
        style={{
          backgroundColor: '#F8FAFC',
          padding: '5.5rem 0',
          scrollMarginTop: '5rem',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Left: Professional Workspace Photography */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px -15px rgba(73, 36, 63, 0.25)',
                  border: '1px solid rgba(73, 36, 63, 0.2)',
                  position: 'relative',
                }}
              >
                <img
                  src={heroWorkspaceImg}
                  alt="Azaroth Techhive engineering team collaborating on modern systems architecture"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Verified SLA & Delivery badge overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1.5rem',
                  right: '1.5rem',
                  backgroundColor: '#FFFFFF',
                  padding: '1rem 1.5rem',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #FFE4E6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(73, 36, 63, 0.1)',
                    color: '#49243F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>
                    99.9% Uptime
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                    Enterprise Engineering SLA
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Narrative Story Content */}
            <div>
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
                  marginBottom: '1rem',
                }}
              >
                {storyBadge}
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.125rem, 4vw, 2.875rem)',
                  fontWeight: 800,
                  color: '#1E293B',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: '1.5rem',
                }}
              >
                {storyTitle}
              </h2>

              <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {storyParagraph1}
              </p>

              <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>
                {storyParagraph2}
              </p>

              {/* Highlights Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.25rem',
                  padding: '1.5rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  marginBottom: '2rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#49243F', lineHeight: 1.2 }}>Disciplined</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary, #4B5563)' }}>Principled Design</div>
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-success, #047857)', lineHeight: 1.2 }}>Tested Quality</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary, #4B5563)' }}>Rigorous Verification</div>
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-warning, #D97706)', lineHeight: 1.2 }}>True Partnership</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary, #4B5563)' }}>Transparent Delivery</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button onClick={() => scrollToAnchor('delivery-framework')} variant="primary">
                  Explore Delivery Framework
                </Button>
                <Button onClick={() => scrollToAnchor('our-values')} variant="outline">
                  Our Engineering Values
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2x2 Grid Layout for Vision, Mission & Core Pillars */}
      <section style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(73, 36, 63, 0.05) 0%, transparent 70%), #FFFFFF', padding: '5.5rem 0' }}>
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
              &mdash; STRATEGIC FOUNDATIONS &mdash;
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                fontWeight: 800,
                color: '#1E293B',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              How We Architect{' '}
              <span
                style={{
                  background: 'var(--gradient-heading)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Sustainable Value
              </span>
            </h2>

            <p style={{ fontSize: '1.0625rem', color: '#64748B', lineHeight: 1.6 }}>
              Our 4 foundational pillars ensure every client engagement is transparent, technically sound, and engineered for long-term scalability.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Card 1: Vision */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '1.25rem',
                padding: '2.25rem 2rem',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 200ms ease-out',
              }}
              className="hover:shadow-lg hover:border-rose-200"
            >
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(73, 36, 63, 0.08)',
                  color: '#49243F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
                Long-Horizon Vision
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.65, margin: 0 }}>
                {visionText}
              </p>
            </div>

            {/* Card 2: Mission */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '1.25rem',
                padding: '2.25rem 2rem',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 200ms ease-out',
              }}
              className="hover:shadow-lg hover:border-rose-200"
            >
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(73, 36, 63, 0.08)',
                  color: '#49243F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
                Engineering Mission
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.65, margin: 0 }}>
                {missionText}
              </p>
            </div>

            {/* Card 3: Tested Quality */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '1.25rem',
                padding: '2.25rem 2rem',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 200ms ease-out',
              }}
              className="hover:shadow-lg hover:border-slate-300"
            >
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(73, 36, 63, 0.08)',
                  color: '#49243F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
                Enterprise Quality &amp; Security
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.65, margin: 0 }}>
                Rigorous automated testing, zero-trust cloud infrastructure, continuous vulnerability scanning, and strict 99.9% uptime SLA commitments for high-load platforms.
              </p>
            </div>

            {/* Card 4: Rapid Execution */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '1.25rem',
                padding: '2.25rem 2rem',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 200ms ease-out',
              }}
              className="hover:shadow-lg hover:border-slate-300"
            >
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(73, 36, 63, 0.08)',
                  color: '#49243F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
                Agile Pod Execution
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', lineHeight: 1.65, margin: 0 }}>
                Dedicated 100% focused engineering pods that embed with your stakeholder teams to design, iterate, and deploy release candidates every two weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR VALUES */}
      <section
        id="our-values"
        style={{
          backgroundColor: '#FFFFFF',
          paddingTop: '5.5rem',
          paddingBottom: '5.5rem',
          scrollMarginTop: '5rem',
          position: 'relative',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <div className="container">
          {/* Values Section Header */}
          <div style={{ textAlign: 'left', maxWidth: '780px', margin: '0 0 3.5rem 0' }}>
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
              &mdash; CORE ENGINEERING VALUES &mdash;
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                fontWeight: 800,
                color: '#1E293B',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              Principles That Shape{' '}
              <span
                style={{
                  background: 'var(--gradient-heading)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Every Solution
              </span>
            </h2>
            <p style={{ fontSize: '1.0625rem', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
              The foundational values that guide our engineering decisions, client partnerships, and continuous pursuit of excellence in every solution we build.
            </p>
          </div>

          {/* Values Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.25rem',
            }}
          >
            {valuesPrinciples.map((val: any, index: number) => (
              <motion.div
                key={val.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card
                  variant="glass"
                  padding="lg"
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'all 180ms ease-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(73, 36, 63, 0.12)';
                    e.currentTarget.style.borderColor = '#49243F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '14px',
                        background: 'rgba(73, 36, 63, 0.10)',
                        color: '#49243F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(73, 36, 63, 0.2)',
                      }}
                    >
                      {getIcon(val.iconName)}
                    </div>

                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor: '#FFF1F2',
                        color: '#49243F',
                        border: '1px solid #FFE4E6',
                      }}
                    >
                      {val.number}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                    {val.title}
                  </h3>

                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, flexGrow: 1, margin: 0 }}>
                    {val.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: DELIVERY FRAMEWORK */}
      <section
        id="delivery-framework"
        style={{
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          paddingTop: '5.5rem',
          paddingBottom: '5.5rem',
          scrollMarginTop: '5rem',
          position: 'relative',
        }}
      >
        <div className="container">
          {/* Framework Section Header */}
          <div style={{ textAlign: 'left', maxWidth: '780px', margin: '0 0 3.5rem 0' }}>
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
              &mdash; DISCIPLINED METHODOLOGY &mdash;
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                fontWeight: 800,
                color: '#1E293B',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              Our Delivery Framework &mdash;{' '}
              <span
                style={{
                  background: 'var(--gradient-heading)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                A Clear Path from Idea to Impact
              </span>
            </h2>
            <p style={{ fontSize: '1.0625rem', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
              A structured, collaborative approach that brings clarity to every stage of software development, ensuring solutions remain aligned with project goals, built on sound engineering practices, and adaptable to evolving needs.
            </p>
          </div>

          {/* Interactive Process Stepper */}
          <ProcessTimeline />
        </div>
      </section>

      {/* Global Conversion Portal */}
      <FinalCTA />
    </div>
  );
};

export default About;
