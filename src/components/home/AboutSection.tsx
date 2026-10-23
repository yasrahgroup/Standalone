import React from 'react';
import { 
  GitBranch, 
  Cpu, 
  Users 
} from 'lucide-react';
import { heroWorkspaceImg } from '../../assets/images';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="who-we-are"
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: '5.5rem',
        paddingBottom: '5.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Who We Are"
    >
      <div className="container">
        {/* Main Split: One Side Description, One Side Image */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
            marginBottom: '4.5rem',
          }}
        >
          {/* Left Column: Image with stylish framing */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
              }}
            >
              <img
                src={heroWorkspaceImg}
                alt="Azaroth Tech-Hive Engineering Team"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Right Column: Copy matching user reference image */}
          <div style={{ maxWidth: '620px' }}>

            <h2
              style={{
                fontSize: 'clamp(2.25rem, 4.2vw, 3.25rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary, #1F2937)',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                marginBottom: '1.5rem',
              }}
            >
              Turning Ideas into{' '}
              <span
                style={{
                  background: 'var(--gradient-heading)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Digital Reality
              </span>
            </h2>

            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--color-text-secondary, #4B5563)',
                lineHeight: 1.75,
                marginBottom: '1.5rem',
              }}
            >
              At Azaroth Techhive, we are passionate about technology and driven by a simple goal &mdash; to help businesses build smarter, stronger and more innovative digital solutions. With a team of skilled professionals and a client-first approach, we bring your vision to life, one line of code at a time.
            </p>

            {/* 3 Metric Pills from reference image */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1.5rem',
                margin: '2rem 0',
                paddingTop: '1.25rem',
                borderTop: '1px solid #E2E8F0',
              }}
            >
              {/* Metric 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#EDE9FE',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  <Users size={19} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', lineHeight: 1.1 }}>5+</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Years of Experience</div>
                </div>
              </div>

              {/* Metric 2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#D1FAE5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  <GitBranch size={19} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', lineHeight: 1.1 }}>50+</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Projects Delivered</div>
                </div>
              </div>

              {/* Metric 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#FFF1F2',
                    color: '#49243F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  <Cpu size={19} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary, #1E293B)', lineHeight: 1.1 }}>30+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #64748B)', fontWeight: 500 }}>Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
