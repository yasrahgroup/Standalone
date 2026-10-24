import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight, Inbox } from 'lucide-react';
import { insightsArticles } from '../data/insightsData';
import { Card } from '../components/common/Card';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { useCMS } from '../context/CMSContext';
import { MediaRenderer } from '../components/common/MediaRenderer';
import {
  insightSystemArchImg,
  insightEnterpriseAiImg,
  insightCloudModImg,
} from '../assets/images';

export const Insights: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const { insights: cmsInsights } = useCMS();
  const fallbackImages = [insightSystemArchImg, insightEnterpriseAiImg, insightCloudModImg];

  const effectiveArticles = useMemo(() => {
    return (cmsInsights && cmsInsights.length > 0)
      ? cmsInsights.map((ins, idx) => {
          const match = insightsArticles.find(ia => ia.slug === ins.slug || ia.id === ins.id);
          return {
            id: ins.slug || ins.id || `art-${idx}`,
            title: ins.title,
            slug: ins.slug || `insight-${idx}`,
            category: ins.category || match?.category || 'System Architecture',
            readTime: ins.readTime || (ins as any).read_time || match?.readTime || '6 min read',
            excerpt: ins.excerpt || match?.excerpt || '',
            author: {
              name: ins.authorName || ins.author?.name || (ins as any).author || match?.author.name || 'Azaroth Architecture Pod',
              role: ins.authorRole || ins.author?.role || (ins as any).author_role || match?.author.role || 'Senior Solutions Architect',
            },
            publishedDate: ins.publishedAt || ins.publishedDate || (ins as any).published_date || match?.publishedDate || 'October 2026',
            tags: ins.tags || match?.tags || ['Architecture', 'Engineering'],
            content: ins.content || match?.content || '',
            imageUrl: (ins as any).imageUrl || match?.imageUrl || fallbackImages[idx % fallbackImages.length],
          };
        })
      : insightsArticles.map((art, idx) => ({
          ...art,
          imageUrl: art.imageUrl || fallbackImages[idx % fallbackImages.length],
        }));
  }, [cmsInsights]);

  const categories = useMemo(() => {
    return ['All', ...new Set(effectiveArticles.map(a => a.category))];
  }, [effectiveArticles]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    return effectiveArticles.filter((article) => {
      const matchesCat = selectedCategory === 'All' || article.category === selectedCategory;
      const normalizedQuery = debouncedQuery.toLowerCase();
      const matchesSearch = !normalizedQuery ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
      return matchesCat && matchesSearch;
    });
  }, [effectiveArticles, debouncedQuery, selectedCategory]);

  return (
    <div>
      <SEOHead
        title="Resource Hub — Engineering Insights & Publications | Azaroth Tech-Hive"
        description="Browse engineering insights on system architecture, enterprise AI, and cloud modernization, with practical technical guidance from the Azaroth Tech-Hive team."
        canonicalPath="/resource-hub"
      />
      {/* Page Hero */}
      <PageHeader
        kicker="- RESOURCE HUB -"
        title="Engineering Insights That Move Ideas Forward"
        gradientWords={['Engineering', 'Insights', 'Ideas', 'Forward']}
        subtitle="Explore software engineering insights, architecture principles, implementation strategies, and technical guidance to help you make informed technology decisions and build better systems."
      />

      {/* Resource Catalog */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          
          {/* Search & Category Filter Controls */}
          <div role="search" style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '3rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 180ms ease-out',
                    border: '1px solid',
                    backgroundColor: selectedCategory === cat ? 'var(--color-brand-gold)' : 'rgba(255, 255, 255, 0.8)',
                    borderColor: selectedCategory === cat ? 'var(--color-brand-gold)' : 'var(--color-border)',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--color-text-primary)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search articles and whitepapers..."
                aria-label="Search resources"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.875rem 0.5rem 2.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-medium)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div style={{
              padding: '3rem 1.5rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--color-border)',
              backgroundColor: 'var(--color-surface-soft)',
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'var(--color-surface-muted)', marginBottom: '1rem' }}>
                <Inbox size={20} style={{ color: 'var(--color-brand-gold)' }} />
              </div>
              <h2 style={{ margin: '0 0 0.5rem', color: 'var(--color-text-primary)' }}>No resources match your search</h2>
              <p style={{ margin: 0 }}>Try a different keyword or switch back to another category.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
            }}>
              {filteredArticles.map((article, idx) => (
                <Card
                  key={article.id}
                  variant="solid"
                  padding="none"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(73, 36, 63, 0.12)',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'all 240ms ease-out',
                  }}
                  className="insight-page-card"
                >
                  {/* Card Visual Header with Image */}
                  <div
                    style={{
                      position: 'relative',
                      height: '210px',
                      overflow: 'hidden',
                      backgroundColor: '#0a0f1d',
                    }}
                  >
                    <MediaRenderer
                      src={article.imageUrl || fallbackImages[idx % fallbackImages.length]}
                      alt={article.title}
                      objectFit="cover"
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.5s ease',
                      }}
                      className="insight-page-thumb"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.2) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
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
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        {article.publishedDate}
                      </span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        <Clock size={14} style={{ color: '#49243F' }} />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                      <Link to={`/technology-insights/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="article-title-link">
                        {article.title}
                      </Link>
                    </h2>

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

                    <div style={{
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          {article.author.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {article.author.role}
                        </div>
                      </div>

                      <Link
                        to={`/technology-insights/${article.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: '#49243F',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                        }}
                      >
                        <span>Read</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

        </div>
      </section>

      <style>{`
        .article-title-link:hover {
          color: var(--color-primary-maroon) !important;
        }
        .insight-page-card:hover {
          box-shadow: 0 12px 30px rgba(73, 36, 63, 0.15) !important;
          border-color: rgba(73, 36, 63, 0.4) !important;
          transform: translateY(-4px);
        }
        .insight-page-card:hover .insight-page-thumb {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};
