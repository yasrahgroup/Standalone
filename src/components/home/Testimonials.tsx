import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { testimonialAhmedImg } from '../../assets/images';

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

const testimonials: TestimonialItem[] = [
  {
    id: 't-1',
    quote:
      'Azaroth Techhive delivered exactly what we needed \u2014 a modern, scalable and easy-to-manage website. Their team is professional, responsive and truly understands our goals.',
    author: 'Ahmed Rahman',
    role: 'CEO',
    company: 'NextGen Solutions',
    avatar: testimonialAhmedImg,
    rating: 5,
  },
  {
    id: 't-2',
    quote:
      'The engineering pod Azaroth provided integrated seamlessly into our architecture workflow. Their ability to deliver resilient microservices on Kubernetes exceeded all expectations.',
    author: 'Sarah Al-Mansoor',
    role: 'CTO',
    company: 'Finova Global',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    rating: 5,
  },
  {
    id: 't-3',
    quote:
      'From UX discovery to high-load deployment, the technical rigor Azaroth brought transformed our commerce conversion by 42%. They are our long-term engineering partners.',
    author: 'Marcus Vance',
    role: 'VP of Product',
    company: 'Aetherius Brands',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => {
    setActiveIndex((prevIdx) => (prevIdx === 0 ? testimonials.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setActiveIndex((prevIdx) => (prevIdx + 1) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: '5rem',
        paddingBottom: '5.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Client Testimonials"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: '420px' }}
          >
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
              CLIENT TESTIMONIALS &mdash;
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                fontWeight: 800,
                color: '#1E293B',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              What Our Clients{' '}
              <span
                style={{
                  background: 'var(--gradient-heading)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Say
              </span>
            </h2>

            <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6 }}>
              Real feedback from enterprise leaders, founders, and CTOs who trust Azaroth Techhive to architect and build their software platforms.
            </p>
          </motion.div>

          {/* Right Column: Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              backgroundColor: '#F8FAFC',
              borderRadius: '24px',
              padding: '2.5rem',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
            }}
          >
            {/* Top Row: Quote Icon & Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  color: '#059669',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  fontFamily: 'serif',
                }}
              >
                <Quote size={36} style={{ color: '#059669', opacity: 0.8 }} />
              </div>

              {/* Slider Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={prev}
                  aria-label="Previous Testimonial"
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 150ms ease-out',
                  }}
                  className="hover:border-slate-400 hover:bg-slate-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next Testimonial"
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 150ms ease-out',
                  }}
                  className="hover:border-slate-400 hover:bg-slate-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Quote Body */}
            <blockquote
              style={{
                fontSize: '1.1875rem',
                color: '#334155',
                lineHeight: 1.7,
                fontStyle: 'italic',
                margin: 0,
                marginBottom: '2rem',
              }}
            >
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            {/* Author Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={current.avatar}
                  alt={current.author}
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B' }}>
                      {current.author}
                    </span>
                    <div style={{ display: 'flex', gap: '2px', color: '#C99B52' }}>
                      {Array.from({ length: current.rating }).map((_, i) => (
                        <Star key={i} size={13} fill="#C99B52" />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
                    {current.role}, {current.company}
                  </div>
                </div>
              </div>

              {/* Indicator Dots */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    style={{
                      width: idx === activeIndex ? '1.5rem' : '0.5rem',
                      height: '0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: idx === activeIndex ? 'var(--color-primary, #18181B)' : '#CBD5E1',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 200ms ease-out',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
