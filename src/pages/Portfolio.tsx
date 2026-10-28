import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  Compass,
  Cpu,
  Layers,
  Lightbulb,
  Maximize2,
  ShieldCheck,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "../components/common/SEOHead";
import { Button } from "../components/common/Button";
import { Reveal } from "../components/common/Reveal";
import { FinalCTA } from "../components/home/FinalCTA";
import { productsCatalog } from "../data/productsData";
import { ProductStatusBadge } from "../components/common/ProductStatusBadge";
import { serviceOfferings } from "../data/servicesData";
import { deliveryStages } from "../data/deliveryData";
import { ourValuesPrinciples } from "../data/companyData";

const featuredProduct = productsCatalog[0];
const ongoingProducts = productsCatalog.slice(1);

const serviceIcon = (name: string) => {
  switch (name) {
    case "Compass":
      return <Compass size={22} />;
    case "Users":
      return <Users size={22} />;
    case "Workflow":
      return <Workflow size={22} />;
    default:
      return <Cpu size={22} />;
  }
};

const principleIcon = (name: string) => {
  switch (name) {
    case "ShieldCheck":
      return <ShieldCheck size={22} />;
    case "Maximize2":
      return <Maximize2 size={22} />;
    case "CheckCircle":
      return <Check size={22} />;
    case "Users":
      return <Users size={22} />;
    case "TrendingUp":
      return <TrendingUp size={22} />;
    default:
      return <Lightbulb size={22} />;
  }
};

const principleOrder = [
  "Purpose-Driven Innovation",
  "Engineering Excellence",
  "Trust & Accountability",
  "Collaborative Partnership",
];

export const Portfolio: React.FC = () => {
  const principles = principleOrder
    .map((title) => ourValuesPrinciples.find((item) => item.title === title))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div>
      <SEOHead
        title="Our Portfolio — Platforms & Engineering Capabilities | Azaroth Tech-Hive"
        description="Explore Azaroth Tech-Hive's software platforms and engineering capabilities across digital transformation, strategic consulting, on-demand engineering, and process automation."
        canonicalPath="/portfolio"
      />

      {/* HERO */}
      <section className="portfolio-hero">
        <div className="portfolio-hero-grid-bg" aria-hidden="true" />
        <div className="portfolio-hero-glow" aria-hidden="true" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="portfolio-hero-grid">
            <Reveal>
              <div className="portfolio-kicker">
                <Layers size={16} />
                <span>Our Portfolio</span>
              </div>

              <h1 className="portfolio-hero-title">
                Software Solutions &amp; Engineering Services{" "}
                <span
                  style={{
                    background: "var(--gradient-heading)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Built for Growth.
                </span>
              </h1>

              <p className="portfolio-hero-copy">
                Explore the software platforms we are building and the
                engineering practices we use to modernise systems, extend teams,
                and improve operations. Every engagement starts with a clear
                scope and a practical plan.
              </p>

              <div className="portfolio-actions">
                <Button
                  to="/connect-with-us"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={18} />}
                >
                  Discuss Your Project
                </Button>
                <Button to="/products" variant="outline" size="lg">
                  Explore Platforms
                </Button>
              </div>

              <div className="portfolio-hero-note">
                <ShieldCheck size={15} />
                <span>
                  Platforms are at different stages of readiness. Scope,
                  deployment, and licensing are agreed per engagement.
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="portfolio-snapshot">
                <div className="portfolio-snapshot-title">
                  <Building2 size={18} />
                  <span>Portfolio at a glance</span>
                </div>
                {[
                  {
                    icon: <Layers size={18} />,
                    label: "Software platforms",
                    value: `${productsCatalog.length} in development`,
                  },
                  {
                    icon: <Compass size={18} />,
                    label: "Engineering practices",
                    value: `${serviceOfferings.length} core services`,
                  },
                  {
                    icon: <Building2 size={18} />,
                    label: "Delivery framework",
                    value: `${deliveryStages.length} defined stages`,
                  },
                  // {
                  //   icon: <MapPin size={18} />,
                  //   label: 'Head office',
                  //   value: 'Chennai, India',
                  // },
                ].map((item) => (
                  <div key={item.label} className="portfolio-snapshot-row">
                    <span className="portfolio-snapshot-icon">{item.icon}</span>
                    <span className="portfolio-snapshot-label">
                      {item.label}
                    </span>
                    <strong className="portfolio-snapshot-value">
                      {item.value}
                    </strong>
                  </div>
                ))}
                <div className="portfolio-snapshot-foot">
                  Reflecting our current platform and service catalog.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURED & ONGOING PROJECTS */}
      <section
        id="platforms"
        className="portfolio-section portfolio-section--muted"
      >
        <div className="container">
          <Reveal className="portfolio-section-head">
            <div className="portfolio-section-heading">
              <div className="portfolio-kicker">
                {/* <Sparkles size={16} /> */}
                <span>Featured &amp; Ongoing Projects</span>
              </div>
              <h2 className="portfolio-section-title">
                Featured work and what is in progress
              </h2>
            </div>
            <div className="portfolio-section-aside">
              <p className="portfolio-section-copy">
                One platform is closest to deployment, while the others are in
                active development. Status labels reflect the current stage
                shown in our published catalog, not a marketing timeline.
              </p>
            </div>
          </Reveal>

          {featuredProduct && (
            <Reveal className="portfolio-featured-card">
              <div className="portfolio-featured-media">
                <img
                  src={featuredProduct.coverImage}
                  alt={featuredProduct.coverAlt}
                />
                <div
                  className="portfolio-featured-overlay"
                  aria-hidden="true"
                />
                <div className="portfolio-featured-badges">
                  <ProductStatusBadge
                    status={featuredProduct.status || "Under Development"}
                    colorScheme={featuredProduct.statusColor}
                    size="sm"
                  />
                </div>
              </div>

              <div className="portfolio-featured-body">
                <h3>{featuredProduct.name}</h3>
                <div className="portfolio-featured-tagline">
                  {featuredProduct.tagline}
                </div>
                <p>{featuredProduct.shortDescription}</p>

                <div className="portfolio-capability-list">
                  {featuredProduct.keyCapabilities
                    .slice(0, 4)
                    .map((capability) => (
                      <div key={capability}>
                        <Check size={14} />
                        <span>{capability}</span>
                      </div>
                    ))}
                </div>

                <div className="portfolio-card-footer">
                  <Link
                    to={`/products?product=${featuredProduct.slug}`}
                    className="portfolio-inline-link"
                  >
                    <span>View Platform</span>
                    <ArrowUpRight size={15} />
                  </Link>
                  <Button to="/connect-with-us" variant="primary" size="sm">
                    Request a Walkthrough
                  </Button>
                </div>
              </div>
            </Reveal>
          )}

          <div className="portfolio-ongoing-head">
            <div>
              <h3>Ongoing projects</h3>
              <p>Platforms currently in staging and active development.</p>
            </div>
            <span className="portfolio-ongoing-count">
              {ongoingProducts.length}{" "}
              {ongoingProducts.length === 1 ? "project" : "projects"} in
              progress
            </span>
          </div>

          <div className="portfolio-ongoing-grid">
            {ongoingProducts.map((product, index) => (
              <Reveal
                key={product.id}
                delay={index * 0.06}
                className="portfolio-platform-card"
              >
                <div className="portfolio-platform-media">
                  <img
                    src={product.coverImage}
                    alt={product.coverAlt}
                    loading="lazy"
                  />
                  <div
                    className="portfolio-platform-overlay"
                    aria-hidden="true"
                  />
                  <div className="portfolio-platform-status">
                    <ProductStatusBadge
                      status={product.status || "Under Development"}
                      colorScheme={product.statusColor}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="portfolio-platform-body">
                  <h3>{product.name}</h3>
                  <div className="portfolio-platform-tagline">
                    {product.tagline}
                  </div>
                  <p>{product.shortDescription}</p>

                  <div className="portfolio-capability-list">
                    {product.keyCapabilities.slice(0, 2).map((capability) => (
                      <div key={capability}>
                        <Check size={14} />
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>

                  <div className="portfolio-card-footer">
                    <Link
                      to={`/products?product=${product.slug}`}
                      className="portfolio-inline-link"
                    >
                      <span>View Platform</span>
                      <ArrowUpRight size={15} />
                    </Link>
                    <Button to="/connect-with-us" variant="primary" size="sm">
                      Request a Walkthrough
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="portfolio-section">
        <div className="container">
          <Reveal className="portfolio-section-head">
            <div className="portfolio-section-heading">
              <div className="portfolio-kicker">
                <Workflow size={16} />
                <span>Engineering Capabilities</span>
              </div>
              <h2 className="portfolio-section-title">
                How we support delivery
              </h2>
            </div>
            <div className="portfolio-section-aside">
              <p className="portfolio-section-copy">
                Our practices cover the work that sits around a platform:
                modernisation, technical direction, engineering capacity, and
                process automation.
              </p>
            </div>
          </Reveal>

          <div className="portfolio-cap-grid">
            {serviceOfferings.map((service, index) => (
              <Reveal
                key={service.id}
                delay={index * 0.06}
                className="portfolio-cap-card"
              >
                <div className="portfolio-cap-top">
                  <span className="portfolio-icon-tile">
                    {serviceIcon(service.iconName)}
                  </span>

                  <h3>{service.title}</h3>
                </div>

                <div className="portfolio-best-for">
                  <span>Best for</span>
                  <p>{service.bestFor}</p>
                </div>

                <div className="portfolio-capability-list">
                  {(service.capabilities || [])
                    .slice(0, 3)
                    .map((capability) => (
                      <div key={capability}>
                        <Check size={14} />
                        <span>{capability}</span>
                      </div>
                    ))}
                </div>

                <div className="portfolio-card-footer">
                  <Link
                    to={`/services#${service.slug}`}
                    className="portfolio-inline-link"
                  >
                    <span>Explore This Service</span>
                    <ArrowRight size={15} />
                  </Link>
                  <Button to="/connect-with-us" variant="outline" size="sm">
                    Discuss This Service
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section
        id="approach"
        className="portfolio-section portfolio-section--muted"
      >
        <div className="container">
          <Reveal className="portfolio-section-head">
            <div className="portfolio-section-heading">
              <div className="portfolio-kicker">
                <Building2 size={16} />
                <span>Our Approach</span>
              </div>
              <h2 className="portfolio-section-title">
                A structured path from discovery to support
              </h2>
            </div>
            <div className="portfolio-section-aside">
              <p className="portfolio-section-copy">
                Every project follows the same six-stage delivery framework. The
                depth of each stage is agreed up front, so you always know what
                is happening and what comes next.
              </p>
            </div>
          </Reveal>

          <div className="portfolio-approach-grid">
            {deliveryStages.map((stage, index) => (
              <Reveal
                key={stage.stageNumber}
                delay={index * 0.05}
                className="portfolio-approach-card"
              >
                <div className="portfolio-approach-number">
                  {String(stage.stageNumber).padStart(2, "0")}
                </div>
                <h3>{stage.title}</h3>
                <div className="portfolio-approach-tagline">
                  {stage.tagline}
                </div>
                <p>{stage.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section id="principles" className="portfolio-section">
        <div className="container">
          <Reveal className="portfolio-section-head">
            <div className="portfolio-section-heading">
              <div className="portfolio-kicker">
                <ShieldCheck size={16} />
                <span>How We Work</span>
              </div>
              <h2 className="portfolio-section-title">
                Principles behind every engagement
              </h2>
            </div>
            <div className="portfolio-section-aside">
              <p className="portfolio-section-copy">
                These are the working principles that shape how we scope, build,
                communicate, and hand over software.
              </p>
            </div>
          </Reveal>

          <div className="portfolio-principles-grid">
            {principles.map((principle, index) => (
              <Reveal
                key={principle.number}
                delay={index * 0.06}
                className="portfolio-principle-card"
              >
                <span className="portfolio-icon-tile">
                  {principleIcon(principle.iconName)}
                </span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />

      <style>{`
        .portfolio-hero {
          background-color: #FFFFFF;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          padding-top: clamp(3.25rem, 7vw, 5.5rem);
          padding-bottom: clamp(3rem, 6vw, 4.75rem);
          position: relative;
          overflow: hidden;
        }

        .portfolio-hero-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(73, 36, 63, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(73, 36, 63, 0.035) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 85%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 85%);
          pointer-events: none;
        }

        .portfolio-hero-glow {
          position: absolute;
          top: -20%;
          right: 5%;
          width: 620px;
          height: 520px;
          background: radial-gradient(circle at center, rgba(73, 36, 63, 0.10) 0%, rgba(201, 155, 82, 0.05) 45%, transparent 72%);
          pointer-events: none;
        }

        .portfolio-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }

        .portfolio-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 700;
          color: #49243F;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 0.9rem;
        }

        .portfolio-hero-title {
          font-size: clamp(2.35rem, 4.6vw, 3.5rem);
          font-weight: 800;
          color: #1E293B;
          line-height: 1.14;
          letter-spacing: -0.025em;
          margin-bottom: 1.25rem;
        }

        .portfolio-hero-copy {
          font-size: 1.125rem;
          color: #475569;
          line-height: 1.72;
          max-width: 620px;
          margin-bottom: 1.75rem;
        }

        .portfolio-actions {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .portfolio-text-link,
        .portfolio-inline-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #49243F;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
          transition: gap 160ms ease, color 160ms ease;
        }

        .portfolio-text-link:hover,
        .portfolio-inline-link:hover {
          gap: 0.6rem;
          color: #8A315D;
        }

        .portfolio-hero-note {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: #64748B;
          font-size: 0.8125rem;
          line-height: 1.55;
          max-width: 560px;
        }

        .portfolio-hero-note svg {
          color: #49243F;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .portfolio-snapshot {
          background: linear-gradient(180deg, #FFFFFF 0%, #FBF7F2 100%);
          border: 1px solid rgba(227, 218, 207, 0.95);
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 24px 55px -28px rgba(73, 36, 63, 0.35);
        }

        .portfolio-snapshot-title {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.8125rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #49243F;
          padding-bottom: 1rem;
          margin-bottom: 0.35rem;
          border-bottom: 1px solid rgba(227, 218, 207, 0.9);
        }

        .portfolio-snapshot-row {
          display: grid;
          grid-template-columns: 2rem minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 0;
          border-bottom: 1px solid rgba(227, 218, 207, 0.65);
        }

        .portfolio-snapshot-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.6rem;
          background: rgba(73, 36, 63, 0.08);
          color: #49243F;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .portfolio-snapshot-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }

        .portfolio-snapshot-value {
          font-size: 0.875rem;
          font-weight: 800;
          color: #1E293B;
          text-align: right;
        }

        .portfolio-snapshot-foot {
          padding-top: 0.9rem;
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.5;
        }

        .portfolio-section {
          padding: clamp(3rem, 7vw, 5rem) 0;
          background-color: #FFFFFF;
        }

        .portfolio-section--muted {
          background-color: #F8FAFC;
        }

        .portfolio-section-head {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 2.75rem;
        }

        .portfolio-section-heading {
          width: 100%;
          max-width: 1100px;
        }

        .portfolio-section-aside {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          width: 100%;
        }

        .portfolio-section-title {
          font-size: clamp(1.9rem, 3.4vw, 2.6rem);
          font-weight: 800;
          color: #1E293B;
          line-height: 1.18;
          letter-spacing: -0.02em;
          margin-bottom: 0;
        }

        .portfolio-section-copy {
          color: #64748B;
          font-size: 1.0625rem;
          line-height: 1.7;
          max-width: 100%;
        }

        .portfolio-featured-card {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          background-color: #FFFFFF;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 24px 55px -26px rgba(73, 36, 63, 0.28);
          margin-bottom: 2.25rem;
        }

        .portfolio-featured-media {
          position: relative;
          min-height: 390px;
          background-color: #0F172A;
          overflow: hidden;
        }

        .portfolio-featured-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .portfolio-featured-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.66) 0%, rgba(15, 23, 42, 0.12) 55%, transparent 100%);
          pointer-events: none;
        }

        .portfolio-featured-badges {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .portfolio-featured-label {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background-color: rgba(255, 255, 255, 0.94);
          color: #49243F;
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.35rem 0.6rem;
          border-radius: 9999px;
          backdrop-filter: blur(6px);
        }

        .portfolio-featured-category {
          position: absolute;
          left: 1.15rem;
          bottom: 1rem;
          z-index: 1;
          color: #FFFFFF;
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-shadow: 0 1px 8px rgba(15, 23, 42, 0.5);
        }

        .portfolio-featured-body {
          padding: clamp(1.5rem, 3vw, 2.25rem);
          display: flex;
          flex-direction: column;
        }

        .portfolio-featured-eyebrow {
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7A5422;
          margin-bottom: 0.5rem;
        }

        .portfolio-featured-body h3 {
          font-size: clamp(1.5rem, 2.6vw, 2rem);
          font-weight: 800;
          color: #1E293B;
          line-height: 1.22;
          letter-spacing: -0.015em;
          margin-bottom: 0.45rem;
        }

        .portfolio-featured-tagline {
          font-size: 0.875rem;
          font-weight: 700;
          color: #49243F;
          line-height: 1.45;
          margin-bottom: 0.9rem;
        }

        .portfolio-featured-body > p {
          font-size: 0.9375rem;
          color: #64748B;
          line-height: 1.68;
          margin-bottom: 1.35rem;
        }

        .portfolio-ongoing-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .portfolio-ongoing-head h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1E293B;
          margin-bottom: 0.2rem;
        }

        .portfolio-ongoing-head p {
          font-size: 0.8125rem;
          color: #64748B;
        }

        .portfolio-ongoing-count {
          display: inline-flex;
          align-items: center;
          background-color: #FFFFFF;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
        }

        .portfolio-ongoing-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }

        .portfolio-ongoing-grid .portfolio-platform-media {
          height: 180px;
        }

        .portfolio-ongoing-grid .portfolio-platform-body {
          padding: 1.35rem 1.25rem 1.2rem;
        }

        .portfolio-ongoing-grid .portfolio-platform-body h3 {
          font-size: 1.1rem;
        }

        .portfolio-ongoing-grid .portfolio-platform-body > p {
          font-size: 0.8125rem;
        }

        .portfolio-ongoing-label {
          font-size: 0.625rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7A5422;
          margin-bottom: 0.35rem;
        }

        .portfolio-platform-grid,
        .portfolio-cap-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.75rem;
        }

        .portfolio-platform-card,
        .portfolio-cap-card,
        .portfolio-approach-card,
        .portfolio-principle-card {
          background-color: #FFFFFF;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 1.35rem;
          box-shadow: 0 6px 22px -8px rgba(15, 23, 42, 0.08);
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
          height: 100%;
        }

        .portfolio-platform-card:hover,
        .portfolio-cap-card:hover,
        .portfolio-approach-card:hover,
        .portfolio-principle-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -18px rgba(73, 36, 63, 0.2);
          border-color: rgba(73, 36, 63, 0.22);
        }

        .portfolio-platform-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .portfolio-platform-media {
          position: relative;
          height: 215px;
          background-color: #0F172A;
          overflow: hidden;
        }

        .portfolio-platform-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 400ms ease;
        }

        .portfolio-platform-card:hover .portfolio-platform-media img {
          transform: scale(1.04);
        }

        .portfolio-platform-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.05) 55%, transparent 100%);
          pointer-events: none;
        }

        .portfolio-platform-status {
          position: absolute;
          top: 0.9rem;
          right: 0.9rem;
          z-index: 1;
        }

        .portfolio-platform-category {
          position: absolute;
          left: 1rem;
          bottom: 0.9rem;
          z-index: 1;
          color: #FFFFFF;
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-shadow: 0 1px 8px rgba(15, 23, 42, 0.5);
        }

        .portfolio-platform-body {
          padding: 1.6rem 1.6rem 1.4rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .portfolio-platform-body h3,
        .portfolio-cap-card h3 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #1E293B;
          line-height: 1.3;
          margin-bottom: 0.4rem;
        }

        .portfolio-platform-tagline {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #49243F;
          line-height: 1.45;
          margin-bottom: 0.85rem;
        }

        .portfolio-platform-body > p,
        .portfolio-approach-card > p,
        .portfolio-principle-card > p {
          font-size: 0.9rem;
          color: #64748B;
          line-height: 1.65;
        }

        .portfolio-platform-body > p {
          margin-bottom: 1.1rem;
        }

        .portfolio-capability-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          margin-bottom: 1.35rem;
        }

        .portfolio-capability-list > div {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.8125rem;
          color: #475569;
          line-height: 1.45;
        }

        .portfolio-capability-list svg {
          color: #1F5132;
          flex-shrink: 0;
          margin-top: 0.14rem;
        }

        .portfolio-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding-top: 1.1rem;
          margin-top: auto;
          border-top: 1px solid #E2E8F0;
        }

        .portfolio-cap-card {
          padding: 1.75rem 1.6rem 1.4rem;
          display: flex;
          flex-direction: column;
        }

        .portfolio-cap-top {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.85rem;
          margin-bottom: 1rem;
        }

        .portfolio-cap-top h3 {
          flex: 1;
          min-width: 0;
          margin-bottom: 0;
        }

        .portfolio-icon-tile {
          width: 2.85rem;
          height: 2.85rem;
          border-radius: 0.8rem;
          background: rgba(73, 36, 63, 0.08);
          color: #49243F;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .portfolio-cap-category {
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748B;
          text-align: right;
          line-height: 1.4;
        }

        .portfolio-best-for {
          padding: 0.75rem 0.85rem;
          border-radius: 0.7rem;
          background: rgba(201, 155, 82, 0.10);
          border: 1px solid rgba(201, 155, 82, 0.24);
          margin: 0.9rem 0 1rem;
        }

        .portfolio-best-for span {
          display: block;
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7A5422;
          margin-bottom: 0.25rem;
        }

        .portfolio-best-for p {
          font-size: 0.8125rem;
          color: #475569;
          line-height: 1.5;
        }

        .portfolio-approach-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.25rem;
        }

        .portfolio-approach-card {
          padding: 1.5rem 1.4rem;
          position: relative;
          background: linear-gradient(180deg, #FFFFFF 0%, #FBFBFD 100%);
        }

        .portfolio-approach-number {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
          color: rgba(73, 36, 63, 0.16);
          margin-bottom: 0.6rem;
          letter-spacing: -0.03em;
        }

        .portfolio-approach-card h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #1E293B;
          margin-bottom: 0.25rem;
        }

        .portfolio-approach-tagline {
          font-size: 0.75rem;
          font-weight: 700;
          color: #49243F;
          line-height: 1.4;
          margin-bottom: 0.7rem;
        }

        .portfolio-principles-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.25rem;
        }

        .portfolio-principle-card {
          padding: 1.6rem 1.4rem;
        }

        .portfolio-principle-card h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #1E293B;
          margin: 1rem 0 0.5rem;
        }

        .portfolio-principle-card > p {
          font-size: 0.84375rem;
        }

        .portfolio-section-title,
        .portfolio-featured-body h3,
        .portfolio-platform-body h3,
        .portfolio-ongoing-head h3,
        .portfolio-cap-card h3,
        .portfolio-approach-card h3,
        .portfolio-principle-card h3 {
          background-image: var(--gradient-heading);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        @media (max-width: 1080px) {
          .portfolio-principles-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .portfolio-ongoing-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 960px) {
          .portfolio-hero-grid {
            grid-template-columns: 1fr;
          }

          .portfolio-snapshot {
            max-width: 560px;
          }

          .portfolio-featured-card {
            grid-template-columns: 1fr;
          }

          .portfolio-featured-media {
            min-height: 300px;
            aspect-ratio: 16 / 9;
          }
        }

        @media (max-width: 860px) {
          .portfolio-platform-grid,
          .portfolio-cap-grid {
            grid-template-columns: 1fr;
          }

          .portfolio-approach-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .portfolio-ongoing-grid {
            grid-template-columns: 1fr;
          }

          .portfolio-ongoing-grid .portfolio-platform-media {
            height: 200px;
          }
        }

        @media (max-width: 620px) {
          .portfolio-approach-grid,
          .portfolio-principles-grid {
            grid-template-columns: 1fr;
          }

          .portfolio-actions {
            align-items: stretch;
          }

          .portfolio-actions .btn {
            width: 100%;
            justify-content: center;
          }

          .portfolio-hero-title {
            font-size: clamp(2rem, 9vw, 2.6rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .portfolio-platform-media img,
          .portfolio-platform-card,
          .portfolio-cap-card,
          .portfolio-approach-card,
          .portfolio-principle-card {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
