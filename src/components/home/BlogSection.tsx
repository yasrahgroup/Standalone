import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { insightsArticles } from '../../data/insightsData';
import { useCMS } from '../../context/CMSContext';
import {
  insightSystemArchImg,
  insightEnterpriseAiImg,
  insightCloudModImg,
} from '../../assets/images';

export const BlogSection: React.FC = () => {
  const { insights: cmsInsights } = useCMS();
  const fallbackImages = [insightSystemArchImg, insightEnterpriseAiImg, insightCloudModImg];

  const displayArticles = (cmsInsights && cmsInsights.length > 0)
    ? cmsInsights.slice(0, 3).map((ins, idx) => {
        const match = insightsArticles.find(ia => ia.slug === ins.slug || ia.id === ins.id);
        return {
          id: ins.slug || ins.id || `art-${idx}`,
          title: ins.title,
          slug: ins.slug || `insight-${idx}`,
          category: ins.category || match?.category || 'System Architecture',
          readTime: ins.readTime || (ins as any).read_time || match?.readTime || '6 min read',
          excerpt: ins.excerpt || match?.excerpt || '',
          publishedDate: ins.publishedDate || (ins as any).published_date || match?.publishedDate || 'October 2026',
          imageUrl: (ins as any).imageUrl || match?.imageUrl || fallbackImages[idx % fallbackImages.length],
        };
      })
    : insightsArticles.slice(0, 3).map((art, idx) => ({
        ...art,
        imageUrl: art.imageUrl || fallbackImages[idx % fallbackImages.length],
      }));

  return (
    <section style={{
      backgroundColor: 'var(--color-canvas-bg)',
      padding: '5rem 0',
    }}>
      <div className="container">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'left', maxWidth: '1100px', margin: '0 0 3.5rem 0' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.2vw, 2.25rem)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: '1rem',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}>
            Practical Engineering Insight{' '}
            <span
              style={{
                background: 'var(--gradient-heading)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              for Enterprise Teams
            </span>
          </h2>
          <p style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
            textAlign: 'justify',
            textJustify: 'inter-word',
          }}>
            The Resource Hub collects what our engineers publish on system architecture, enterprise AI, and cloud modernization — the same material we work through when a technical decision needs grounding.
          </p>
        </motion.div>

        {/* Insights Cards */}
        <div
          className="blog-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          {displayArticles.map((article: any, index: number) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(73, 36, 63, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 240ms ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(73, 36, 63, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(73, 36, 63, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(73, 36, 63, 0.12)';
              }}
            >
              <Link
                to={`/technology-insights/${article.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                className="blog-card-link"
              >
                {/* Visual Header with Image & Category Badge */}
                <div
                  style={{
                    position: 'relative',
                    height: '210px',
                    overflow: 'hidden',
                    backgroundColor: '#0a0f1d',
                  }}
                >
                  <img
                    src={article.imageUrl || fallbackImages[index % fallbackImages.length]}
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                    className="blog-thumb-img"
                  />
                  {/* Subtle Gradient Shadow */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.2) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Category Pill Badge */}
                  {/* <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      color: '#49243F',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(73, 36, 63, 0.18)',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#49243F' }} />
                    {article.category}
                  </div> */}
                </div>

                {/* Content */}
                <div style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                }}>
                  {/* Metadata Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '0.875rem',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} aria-hidden="true" style={{ color: '#49243F' }} />
                      {article.publishedDate}
                    </span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} aria-hidden="true" style={{ color: '#49243F' }} />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.0625rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.4,
                  }}>
                    {article.title}
                  </h3>

                  {/* Excerpt with justified text */}
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.65,
                    marginBottom: '1.5rem',
                    textAlign: 'justify',
                    textJustify: 'inter-word',
                    flexGrow: 1,
                  }}>
                    {article.excerpt}
                  </p>

                  {/* Read Article link */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      color: '#49243F',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      marginTop: 'auto',
                    }}
                    className="read-article-link"
                  >
                    <span>Read article</span>
                    <ArrowRight size={16} aria-hidden="true" className="arrow-icon" style={{ transition: 'transform 0.2s ease' }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center' }}
        >
          <Button
            to="/technology-insights"
            variant="outline"
            size="md"
            icon={<ArrowRight size={18} aria-hidden="true" />}
            style={{
              background: 'var(--gradient-button)',
              borderColor: 'transparent',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            View All Articles
          </Button>
        </motion.div>
      </div>

      <style>{`
        .blog-card-link:hover .blog-thumb-img {
          transform: scale(1.06);
        }
        .blog-card-link:hover .arrow-icon {
          transform: translateX(5px);
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .blog-cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1.5rem !important;
          }
        }
        @media (max-width: 640px) {
          .blog-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
};
