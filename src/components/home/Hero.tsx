import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Cloud,
  PenTool,
  BarChart3,
} from "lucide-react";
import { heroWorkspaceImg } from "../../assets/images";
import { useCMS } from "../../context/CMSContext";
import { MediaRenderer } from "../common/MediaRenderer";

export const Hero: React.FC = () => {
  const { pages } = useCMS();
  const pageData = pages["home"];
  const heroContent = pageData?.hero || {};

  // const kicker = heroContent.badge || '- DRIVING DIGITAL EXCELLENCE -';
  const ctaServicesText = heroContent.primaryCtaText || "Explore Services";

  return (
    <section
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: "4.5rem",
        paddingBottom: "4rem",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Introduction & Primary Value Proposition"
    >
      {/* Subtle Brand Gradient Ambient Backlight */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "5%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle at center, rgba(73, 36, 63, 0.05) 0%, rgba(201, 155, 82, 0.02) 40%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3.5rem",
            alignItems: "center",
          }}
        >
          {/* Left Column: Typography & CTAs */}
          <div style={{ maxWidth: "580px" }}>
            {/* Kicker Pill */}
            {/* <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#49243F',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              {kicker}
            </div> */}

            {/* Main Headline */}
            <h1
              style={{
                fontSize: "clamp(2.75rem, 5.2vw, 1rem)",
                fontWeight: 800,
                color: "var(--color-text-primary, #0F172A)",
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                marginBottom: "1.5rem",
              }}
            >
              Intelligence Engineered{" "}
              <span
                style={{
                  background: "var(--gradient-heading)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                Innovation Unleashed.
              </span>{" "}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "1.125rem",
                color: "var(--color-text-secondary, #475569)",
                lineHeight: 1.7,
                marginBottom: "2.5rem",
                maxWidth: "520px",
                textAlign: "justify",
              }}
            >
              Azaroth Tech-Hive engineers, evolves, and sustains intelligent
              software solutions, delivering end-to-end engineering excellence
              that empowers businesses to innovate, adapt, and scale with
              confidence.
            </p>

            {/* CTA Buttons Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {/* Primary Action Button (Brand Berry-Plum Gradient) */}
              <Link
                to="/services"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.9rem 1.85rem",
                  borderRadius: "9999px",
                  background: "var(--gradient-button)",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "0.975rem",
                  textDecoration: "none",
                  boxShadow: "0 6px 20px -2px rgba(73, 36, 63, 0.4)",
                  transition: "all 200ms ease-out",
                }}
                className="hover:scale-105 hover:opacity-95"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--gradient-button-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--gradient-button)";
                }}
              >
                <span>{ctaServicesText}</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual with Desk Laptop & Connected Badges */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Main Laptop Desk Showcase Image */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 24px 50px -12px rgba(15, 23, 42, 0.15)",
                border:
                  "1px solid var(--color-border, rgba(226, 232, 240, 0.9))",
                maxWidth: "560px",
                width: "100%",
                maxHeight: "410px",
              }}
            >
              <MediaRenderer
                src={heroWorkspaceImg}
                alt="Azaroth Tech-Hive Enterprise Engineering Workspace"
                objectFit="cover"
                loading="eager"
              />
            </div>

            {/* SVG Connecting Paths to the Laptop Mockup */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 3,
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              <defs>
                <linearGradient id="trace1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="trace2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0D9488" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="trace3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M 120 10 Q 150 70 240 160"
                fill="none"
                stroke="url(#trace1)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 280 15 Q 280 80 320 160"
                fill="none"
                stroke="url(#trace2)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 440 20 Q 400 80 360 160"
                fill="none"
                stroke="url(#trace3)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Floating Tech Squircle Badges with zero overlap and organic float animations */}
            {/* 1. Web Development */}
            <div
              style={{
                position: "absolute",
                top: "-1.5rem",
                left: "2%",
                zIndex: 4,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(8px)",
                padding: "0.5rem 0.85rem",
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.9)",
                boxShadow: "0 10px 25px -4px rgba(124, 58, 237, 0.18)",
                animation: "heroBadgeFloat1 4.5s ease-in-out infinite",
                maxWidth: "45vw",
                overflow: "hidden",
              }}
              className="hero-badge-interactive hero-badge-1"
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#7C3AED",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Code2 size={16} />
              </div>
              <span
                style={{
                  fontSize: "0.775rem",
                  fontWeight: 700,
                  color: "#1E293B",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Web Development
              </span>
            </div>

            {/* 2. Mobile Apps - Raised up to -3.25rem and positioned at 34% with zero overlap */}
            <div
              style={{
                position: "absolute",
                top: "-3.25rem",
                left: "34%",
                zIndex: 4,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(8px)",
                padding: "0.5rem 0.85rem",
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.9)",
                boxShadow: "0 10px 25px -4px rgba(13, 148, 136, 0.18)",
                animation: "heroBadgeFloat2 5s ease-in-out infinite 0.6s",
                maxWidth: "40vw",
                overflow: "hidden",
              }}
              className="hero-badge-interactive hero-badge-2"
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#0D9488",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Smartphone size={16} />
              </div>
              <span
                style={{
                  fontSize: "0.775rem",
                  fontWeight: 700,
                  color: "#1E293B",
                  whiteSpace: "nowrap",
                }}
              >
                Mobile Apps
              </span>
            </div>

            {/* 3. Cloud Solutions - Placed at right: 2% */}
            <div
              style={{
                position: "absolute",
                top: "-1.5rem",
                right: "2%",
                zIndex: 4,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(8px)",
                padding: "0.5rem 0.85rem",
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.9)",
                boxShadow: "0 10px 25px -4px rgba(2, 132, 199, 0.18)",
                animation: "heroBadgeFloat3 4.2s ease-in-out infinite 1.2s",
                maxWidth: "40vw",
                overflow: "hidden",
              }}
              className="hero-badge-interactive hero-badge-3"
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#0284C7",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Cloud size={16} />
              </div>
              <span
                style={{
                  fontSize: "0.775rem",
                  fontWeight: 700,
                  color: "#1E293B",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Cloud Solutions
              </span>
            </div>

            {/* 4. UI/UX Design */}
            <div
              style={{
                position: "absolute",
                top: "28%",
                right: "-1.25rem",
                zIndex: 4,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(8px)",
                padding: "0.5rem 0.85rem",
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.9)",
                boxShadow: "0 10px 25px -4px rgba(73, 36, 63, 0.18)",
                animation: "heroBadgeFloat1 4.8s ease-in-out infinite 1.8s",
                maxWidth: "45vw",
                overflow: "hidden",
              }}
              className="hero-badge-interactive hero-badge-4"
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#49243F",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PenTool size={16} />
              </div>
              <span
                style={{
                  fontSize: "0.775rem",
                  fontWeight: 700,
                  color: "#1E293B",
                  whiteSpace: "nowrap",
                }}
              >
                UI/UX Design
              </span>
            </div>

            {/* 5. Analytics Mini Card */}
            <div
              style={{
                position: "absolute",
                top: "65%",
                right: "-0.75rem",
                zIndex: 4,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(8px)",
                padding: "0.5rem 0.85rem",
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.9)",
                boxShadow: "0 10px 25px -4px rgba(6, 182, 212, 0.18)",
                animation: "heroBadgeFloat2 4.4s ease-in-out infinite 2.2s",
                maxWidth: "45vw",
                overflow: "hidden",
              }}
              className="hero-badge-interactive hero-badge-5"
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#06B6D4",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BarChart3 size={16} />
              </div>
              <span
                style={{
                  fontSize: "0.775rem",
                  fontWeight: 700,
                  color: "#1E293B",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Analytics
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroBadgeFloat1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes heroBadgeFloat2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
        }
        @keyframes heroBadgeFloat3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
        }
        .hero-badge-interactive {
          transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms ease-out;
        }
        .hero-badge-interactive:hover {
          transform: scale(1.06) translateY(-4px) !important;
          box-shadow: 0 16px 32px -4px rgba(0, 0, 0, 0.15) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-badge-interactive {
            animation: none !important;
          }
        }

        /* Responsive badge placement for small viewports */
        @media (max-width: 768px) {
          .hero-badge-1 { top: -0.5rem !important; left: 1% !important; }
          .hero-badge-2 { top: -0.25rem !important; left: 30% !important; }
          .hero-badge-3 { top: -0.5rem !important; right: 1% !important; }
          .hero-badge-4 { top: 20% !important; right: -0.5rem !important; }
          .hero-badge-5 { top: 58% !important; right: -0.25rem !important; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
