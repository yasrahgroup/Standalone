import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, ShoppingBag, GraduationCap, HeartPulse } from 'lucide-react';
import { productsCatalog } from '../../data/productsData';
import { AnimatedImage } from '../common/AnimatedImage';
import { ProductStatusBadge } from '../common/ProductStatusBadge';
import { useCMS } from '../../context/CMSContext';

export const ProductsSection: React.FC = () => {
  const { products: cmsProducts } = useCMS();
  const displayProducts = productsCatalog.map((catalogProd) => {
    const cmsMatch = (cmsProducts || []).find((cp: any) => cp.slug === catalogProd.slug || cp.id === catalogProd.id);
    return {
      ...catalogProd,
      title: cmsMatch?.title || cmsMatch?.name || catalogProd.name,
      status: catalogProd.status,
      statusColor: catalogProd.statusColor,
      badge: catalogProd.badge,
      shortDescription: cmsMatch?.shortDescription || (cmsMatch as any)?.short_description || catalogProd.shortDescription,
    };
  });
  const getProductIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity size={24} aria-hidden="true" />;
      case 'ShoppingBag':
        return <ShoppingBag size={24} aria-hidden="true" />;
      case 'GraduationCap':
        return <GraduationCap size={24} aria-hidden="true" />;
      case 'HeartPulse':
        return <HeartPulse size={24} aria-hidden="true" />;
      default:
        return <ShoppingBag size={24} aria-hidden="true" />;
    }
  };

  return (
    <section
      id="software-solutions"
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: '5.5rem',
        paddingBottom: '5.5rem',
        position: 'relative',
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
      }}
      aria-label="Enterprise Software Solutions"
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'left', maxWidth: '780px', margin: '0 0 3.5rem 0', position: 'relative' }}>
          <AnimatedImage
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
            alt="Technology platform"
            style={{
              position: 'absolute',
              top: -50,
              right: -100,
              width: '200px',
              height: '200px',
              opacity: 0.1,
              zIndex: -1,
            }}
            animationType="float"
            duration={2000}
          />
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--color-text-primary, #1F2937)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            Enterprise Software{' '}
            <span
              style={{
                background: 'var(--gradient-heading)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Solutions
            </span>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'var(--color-text-secondary, #4B5563)', lineHeight: 1.65 }}>
            Purpose-engineered software platforms designed for scalable multi-location operations, omnichannel digital commerce, healthcare informatics, and enterprise workforce learning.
          </p>
        </div>

        {/* Product Cards: One row on desktop where viewport allows, reflowing responsively */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
            alignItems: 'stretch',
          }}
        >
          {displayProducts.map((product: any) => {
            const productName = product.title || product.name;
            const productDesc = product.shortDescription || product.short_description || product.description;
            const productIconName = product.iconName || product.icon_name;

            return (
              <div
                key={product.id || product.slug}
                style={{
                  backgroundColor: 'var(--color-canvas-card, #FFFFFF)',
                  borderRadius: '1.25rem',
                  border: '1px solid var(--color-border, #E0E7FF)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 200ms ease-out',
                  position: 'relative',
                }}
                className="hover:shadow-lg hover:border-indigo-300"
              >
                <div>
                  {/* Header with icon and status badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div
                      style={{
                        width: '3.25rem',
                        height: '3.25rem',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(24, 24, 27, 0.06)',
                        color: 'var(--color-primary, #18181B)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getProductIcon(productIconName)}
                    </div>
                    <ProductStatusBadge
                      status={product.status || 'Under Development'}
                      colorScheme={product.statusColor}
                      size="sm"
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary, #1F2937)',
                      marginBottom: '0.625rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {productName}
                  </h3>

                  <p
                    style={{
                      color: 'var(--color-text-secondary, #4B5563)',
                      fontSize: '0.9375rem',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                    }}
                  >
                    {productDesc}
                  </p>
                </div>

                {/* Action Button: "Explore Platform" linking to /products */}
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border, #E0E7FF)' }}>
                  <Link
                    to="/products"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#49243F',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      transition: 'all 150ms ease-out',
                    }}
                    className="hover:gap-3"
                    aria-label={`Explore ${productName} in platform catalog`}
                  >
                    <span>Explore</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Products CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.85rem 2rem',
              borderRadius: '9999px',
              background: 'var(--gradient-button)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(73, 36, 63, 0.35)',
              transition: 'all 180ms ease-out',
            }}
            className="hover:opacity-95 hover:scale-[1.02]"
          >
            <span>View Complete Platform Catalog</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
