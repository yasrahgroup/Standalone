import React from "react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { productsCatalog } from "../../data/productsData";
import { AnimatedImage } from "../common/AnimatedImage";
import { ProductStatusBadge } from "../common/ProductStatusBadge";
import { useCMS } from "../../context/CMSContext";

export const ProductsSection: React.FC = () => {
  const { products: cmsProducts } = useCMS();
  const displayProducts = productsCatalog.map((catalogProd) => {
    const cmsMatch = (cmsProducts || []).find(
      (cp: any) => cp.slug === catalogProd.slug || cp.id === catalogProd.id,
    );
    return {
      ...catalogProd,
      title: cmsMatch?.title || cmsMatch?.name || catalogProd.name,
      status: catalogProd.status,
      statusColor: catalogProd.statusColor,
      badge: catalogProd.badge,
      shortDescription:
        cmsMatch?.shortDescription ||
        (cmsMatch as any)?.short_description ||
        catalogProd.shortDescription,
    };
  });

  // Fade in cards
  const productsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = productsGridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll(".featured-product-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.2,
      },
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="software-solutions"
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: "5.5rem",
        paddingBottom: "5.5rem",
        position: "relative",
        borderTop: "1px solid rgba(226, 232, 240, 0.8)",
      }}
      aria-label="Enterprise Software Solutions"
    >
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            textAlign: "left",
            maxWidth: "780px",
            margin: "0 0 3.5rem 0",
            position: "relative",
          }}
        >
          <AnimatedImage
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
            alt="Technology platform"
            style={{
              position: "absolute",
              top: -50,
              right: -100,
              width: "200px",
              height: "200px",
              opacity: 0.1,
              zIndex: -1,
            }}
            animationType="float"
            duration={2000}
          />
          <h2
            style={{
              fontSize: "clamp(2rem, 3.8vw, 2.75rem)",
              fontWeight: 800,
              color: "var(--color-text-primary, #1F2937)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Enterprise Software{" "}
            <span
              style={{
                background: "var(--gradient-heading)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Solutions
            </span>
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-secondary, #4B5563)",
              lineHeight: 1.65,
            }}
          >
            Purpose-engineered software platforms designed for scalable
            multi-location operations, omnichannel digital commerce, healthcare
            informatics, and enterprise workforce learning.
          </p>
        </div>

        <div ref={productsGridRef} className="featured-products-grid">
          {displayProducts.slice(0, 4).map((product: any) => {
            const productName = product.title || product.name;
            const productDesc =
              product.shortDescription ||
              product.short_description ||
              product.description;

            const productImage =
              product.coverImage ||
              product.cover_image ||
              product.image ||
              product.imageUrl ||
              product.image_url ||
              product.thumbnail ||
              product.featuredImage ||
              product.featured_image;

            const features =
              product.features ||
              product.highlights ||
              product.keyFeatures ||
              product.key_features ||
              [];

            return (
              <article
                key={product.id || product.slug}
                className="featured-product-card"
                style={{
                  border: "1px solid #E2E8F0",
                  // border: "2px solid #C99B52",
                }}
              >
                <div className="featured-product-image">
                  {productImage ? (
                    <img src={productImage} alt={productName} loading="lazy" />
                  ) : (
                    <div className="featured-product-image-placeholder">
                      <span>{productName}</span>
                    </div>
                  )}

                  <div className="featured-product-status">
                    <ProductStatusBadge
                      status={product.status || "Under Development"}
                      colorScheme={product.statusColor}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="featured-product-content">
                  <h3>{productName}</h3>

                  <p className="featured-product-description">{productDesc}</p>

                  {Array.isArray(features) && features.length > 0 && (
                    <ul className="featured-product-features">
                      {features
                        .slice(0, 3)
                        .map((feature: any, index: number) => (
                          <li key={index}>
                            <span aria-hidden="true">⊙</span>
                            {typeof feature === "string"
                              ? feature
                              : feature.title || feature.name || feature.label}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <div className="featured-product-actions">
                  <Link to="/products" className="featured-product-learn">
                    LEARN MORE <ArrowRight size={13} />
                  </Link>

                  <Link
                    to={`/connect-with-us?product=${encodeURIComponent(product.slug)}`}
                    className="featured-product-demo"
                  >
                    DEMO
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Products CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.85rem 2rem",
              borderRadius: "9999px",
              background: "var(--gradient-button)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "0.9375rem",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(73, 36, 63, 0.35)",
              transition: "all 180ms ease-out",
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
