import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Cloud,
  PenTool,
  BarChart3,
  Users,
  GitBranch,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { heroWorkspaceImg } from "../../assets/images";
import { useCMS } from "../../context/CMSContext";
import { MediaRenderer } from "../common/MediaRenderer";
import { Reveal } from "../common/Reveal";
import { DynamicIcon } from "../common/DynamicIcon";
import { useAnimationConfig } from "../../hooks/useAnimationConfig";
import { useColorConfig } from "../../hooks/useColorConfig";
import { useCMSAnimation } from "../../hooks/useCMSAnimation";

export const Hero: React.FC = () => {
  const { pages } = useCMS();
  const animationConfig = useAnimationConfig('hero');
  const colorConfig = useColorConfig('hero');
  
  const pageData = pages["home"];
  const heroContent = pageData?.hero || {};

  const heroTitleLine1 = heroContent.title || "Intelligence Engineered";
  const heroTitleHighlight =
    heroContent.titleHighlight || "Innovation Unleashed.";
  const heroSubtitle =
    heroContent.subtitle ||
    "Azaroth Tech-Hive engineers, evolves, and sustains intelligent software solutions, delivering end-to-end engineering excellence that empowers businesses to innovate, adapt, and scale with confidence.";
  const ctaServicesText = heroContent.primaryCtaText || "Explore Services";
  const ctaServicesLink = heroContent.primaryCtaLink || "/portfolio#services";
  const heroImage = heroContent.imageUrl || heroWorkspaceImg;
  const heroImageAlt =
    heroContent.imageAlt ||
    "Azaroth Tech-Hive Enterprise Engineering Workspace";
  const heroImageFit =
    (heroContent.imageFit as "cover" | "contain" | "fill") || "cover";

  const cmsStats = Array.isArray(heroContent.stats) ? heroContent.stats : [];
  
  const fallbackTraces = [
    {
      id: "trace-1",
      path: "M 120 10 Q 150 70 240 160",
      gradientId: "trace1",
      gradientStops: [
        { offset: "0%", color: "#7C3AED", opacity: 0.7 },
        { offset: "100%", color: "#7C3AED", opacity: 0.1 },
      ],
      strokeWidth: 1.5,
      strokeDashArray: "4 4",
      isVisible: true,
    },
    {
      id: "trace-2",
      path: "M 280 15 Q 280 80 320 160",
      gradientId: "trace2",
      gradientStops: [
        { offset: "0%", color: "#0D9488", opacity: 0.7 },
        { offset: "100%", color: "#0D9488", opacity: 0.1 },
      ],
      strokeWidth: 1.5,
      strokeDashArray: "4 4",
      isVisible: true,
    },
    {
      id: "trace-3",
      path: "M 440 20 Q 400 80 360 160",
      gradientId: "trace3",
      gradientStops: [
        { offset: "0%", color: "#0284C7", opacity: 0.7 },
        { offset: "100%", color: "#0284C7", opacity: 0.1 },
      ],
      strokeWidth: 1.5,
      strokeDashArray: "4 4",
      isVisible: true,
    },
    {
      id: "trace-4",
      path: "M 500 120 Q 450 150 380 180",
      gradientId: "trace4",
      gradientStops: [
        { offset: "0%", color: "#49243F", opacity: 0.7 },
        { offset: "100%", color: "#49243F", opacity: 0.1 },
      ],
      strokeWidth: 1.5,
      strokeDashArray: "4 4",
      isVisible: true,
    },
    {
      id: "trace-5",
      path: "M 510 265 Q 460 250 390 230",
      gradientId: "trace5",
      gradientStops: [
        { offset: "0%", color: "#06B6D4", opacity: 0.7 },
        { offset: "100%", color: "#06B6D4", opacity: 0.1 },
      ],
      strokeWidth: 1.5,
      strokeDashArray: "4 4",
      isVisible: true,
    },
  ];

  // Use CMS badges if available, otherwise fallback to empty array (will use hardcoded badges)
  const cmsBadges = Array.isArray(heroContent.floatingBadges) ? heroContent.floatingBadges : [];
  const cmsTraces = (() => {
    const raw = Array.isArray(heroContent.traces) ? heroContent.traces : [];
    if (raw.length === 0) return fallbackTraces;
    const existingIds = new Set(raw.map((t: any) => t.id));
    const missing = fallbackTraces.filter((t) => !existingIds.has(t.id));
    return missing.length > 0 ? [...raw, ...missing] : raw;
  })();
  
  // Check if we should use CMS data or fallback to hardcoded
  // Force use of CMS badges since they're in defaults
  const useCmsBadges = true; // Always use CMS badges now that they're in defaults
  const useCmsTraces = true; // Always use CMS traces now that they're in defaults
  
  const metrics = [
    {
      value: cmsStats[0]?.value || "95%",
      label: cmsStats[0]?.label || "Client Satisfaction",
      icon: <Users size={19} />,
      backgroundColor: "#EDE9FE",
      iconColor: "#7C3AED",
    },
    {
      value: cmsStats[1]?.value || "100%",
      label: cmsStats[1]?.label || "Commitment to Quality",
      icon: <GitBranch size={19} />,
      backgroundColor: "#D1FAE5",
      iconColor: "#059669",
    },
    {
      value: cmsStats[2]?.value || "90%",
      label: cmsStats[2]?.label || "On-Time Delivery",
      icon: <Cpu size={19} />,
      backgroundColor: "#FFF1F2",
      iconColor: "#49243F",
    },
    {
      value: cmsStats[3]?.value || "98%",
      label: cmsStats[3]?.label || "System Reliability",
      icon: <ShieldCheck size={19} />,
      backgroundColor: "#E0F2FE",
      iconColor: "#0878E8",
    },
  ];
  
  // Check for reduced motion preference
  const shouldRespectReducedMotion = animationConfig.respectReducedMotion && 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: "clamp(2.5rem, 4.5vw, 3.75rem)",
        paddingBottom: "clamp(2.5rem, 4vw, 3.5rem)",
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
        <Reveal>
          <div
            className="hero-grid-layout"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "clamp(2rem, 4vw, 3.5rem)",
              alignItems: "center",
            }}
          >
            {/* Left Column: Typography & CTAs */}
            <div
              className="hero-content-col"
              style={{
                maxWidth: "580px",
                paddingBottom: "clamp(0rem, 2vw, 1rem)",
              }}
            >
              {/* Main Headline */}
              <h1
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.15rem)",
                  fontWeight: 600,
                  color: "var(--color-text-primary, #1F2937)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  marginBottom: "clamp(0.875rem, 2vw, 1.15rem)",
                }}
              >
                <span
                  style={{
                    background: "var(--gradient-heading)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                  }}
                >
                  {heroTitleLine1}{" "}
                </span>
                <span
                  style={{
                    color: " #C18B40",
                    display: "inline-block",
                  }}
                >
                  {heroTitleHighlight}
                </span>{" "}
              </h1>

              {/* Subtitle */}
              <p
                className="hero-subtitle"
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--color-text-secondary, #475569)",
                  lineHeight: 1.6,
                  marginBottom: "1.75rem",
                  maxWidth: "520px",
                  textAlign: "justify",
                }}
              >
                {heroSubtitle}
              </p>

              {/* CTA Buttons Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(0.75rem, 2vw, 1rem)",
                  flexWrap: "wrap",
                }}
              >
                {/* Primary Action Button (Brand Berry-Plum Gradient) */}
                <Link
                  to={ctaServicesLink}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding:
                      "clamp(0.6rem, 1.5vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)",
                    borderRadius: "9999px",
                    background: "var(--gradient-button)",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "clamp(0.8125rem, 1.5vw, 0.9rem)",
                    textDecoration: "none",
                    boxShadow: "0 4px 16px -2px rgba(73, 36, 63, 0.4)",
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
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Visual with Desk Laptop & Connected Badges */}
            <div
              className="hero-visual-col"
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              {/* Main Laptop Desk Showcase Image */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 20px 45px -10px rgba(15, 23, 42, 0.12)",
                  border:
                    "1px solid var(--color-border, rgba(226, 232, 240, 0.9))",
                  maxWidth: "520px",
                  width: "100%",
                  maxHeight: "380px",
                  aspectRatio: "16 / 10",
                  backgroundColor: "#F8FAFC",
                }}
              >
                <MediaRenderer
                  src={heroImage}
                  fallbackSrc={heroWorkspaceImg}
                  alt={heroImageAlt}
                  objectFit={heroImageFit}
                  loading="eager"
                />
              </div>

              {/* SVG Connecting Paths to the Laptop Mockup */}
              <svg
                className="hero-badge-traces"
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
                  {useCmsTraces ? (
                    // CMS-driven gradients
                    cmsTraces.map((trace: any) => (
                      <linearGradient
                        key={trace.id}
                        id={trace.gradientId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        {trace.gradientStops && trace.gradientStops.length > 0 ? (
                          trace.gradientStops.map((stop: any, idx: number) => (
                            <stop
                              key={idx}
                              offset={stop.offset}
                              stopColor={stop.color}
                              stopOpacity={stop.opacity}
                            />
                          ))
                        ) : (
                          <>
                            <stop
                              offset="0%"
                              stopColor={trace.gradientStart || "#7C3AED"}
                              stopOpacity={trace.startOpacity ?? 0.7}
                            />
                            <stop
                              offset="100%"
                              stopColor={trace.gradientEnd || trace.gradientStart || "#7C3AED"}
                              stopOpacity={trace.endOpacity ?? 0.1}
                            />
                          </>
                        )}
                      </linearGradient>
                    ))
                  ) : (
                    // Fallback hardcoded gradients
                    <>
                      <linearGradient
                        id="trace1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient
                        id="trace2"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#0D9488" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#0D9488" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient
                        id="trace3"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient
                        id="trace4"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#49243F" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#49243F" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient
                        id="trace5"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
                      </linearGradient>
                    </>
                  )}
                </defs>
                {useCmsTraces ? (
                  // CMS-driven traces
                  cmsTraces.filter((t: any) => t.isVisible).map((trace: any) => (
                    <path
                      key={trace.id}
                      d={trace.path}
                      fill="none"
                      stroke={`url(#${trace.gradientId})`}
                      strokeWidth={trace.strokeWidth}
                      strokeDasharray={trace.strokeDashArray}
                    />
                  ))
                ) : (
                  // Fallback hardcoded traces
                  <>
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
                    <path
                      d="M 500 120 Q 450 150 380 180"
                      fill="none"
                      stroke="url(#trace4)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 510 265 Q 460 250 390 230"
                      fill="none"
                      stroke="url(#trace5)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  </>
                )}
              </svg>

              {/* Floating Tech Squircle Badges - CMS-driven with fallback */}
              {useCmsBadges ? (
                // CMS-driven badges
                cmsBadges.filter((b: any) => b.isVisible).map((badge: any, index: number) => {
                  const globalColors = badge.colors?.useGlobal 
                    ? colorConfig.getBadgeColors(badge.id) 
                    : null;
                  const colors = globalColors || badge.colors;
                  
                  // Use CMS animation configuration for badges
                  const badgeAnimation = useCMSAnimation({
                    componentId: 'hero',
                    elementId: 'badges',
                    presetId: index === 0 ? 'hero-badge-float-1' : 
                              index === 1 ? 'hero-badge-float-2' : 
                              'hero-badge-float-3',
                    customProperties: badge.animation?.enabled === false ? { enabled: false } : undefined,
                  });
                  
                  const animationEnabled = badgeAnimation.enabled && 
                    badge.animation?.enabled !== false && 
                    !shouldRespectReducedMotion;
                  
                  return (
                    <div
                      key={badge.id}
                      style={{
                        position: "absolute",
                        top: badge.position?.top,
                        left: badge.position?.left,
                        right: badge.position?.right,
                        bottom: badge.position?.bottom,
                        zIndex: badge.zIndex,
                        maxWidth: badge.maxWidth,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        backgroundColor: colors?.backgroundColor || "rgba(255, 255, 255, 0.96)",
                        backdropFilter: "blur(8px)",
                        padding: "0.5rem 0.85rem",
                        borderRadius: "12px",
                        border: `1px solid ${colors?.borderColor || "rgba(226, 232, 240, 0.9)"}`,
                        boxShadow: `0 10px 25px -4px ${colors?.iconColor ? colors.iconColor + "30" : "rgba(124, 58, 237, 0.18)"}`,
                        animation: animationEnabled 
                          ? `${badgeAnimation.properties.type === 'float-up-down' ? 'floatUpDown' : 
                              badgeAnimation.properties.type === 'float-left-right' ? 'floatLeftRight' : 'float'} 
                             ${badgeAnimation.properties.duration}s ease-in-out infinite`
                          : 'none',
                        overflow: "hidden",
                        transition: badge.hoverAnimation?.enabled 
                          ? `transform ${badge.hoverAnimation?.duration}s ${badge.hoverAnimation?.easing}, box-shadow ${badge.hoverAnimation?.duration}s ease-out`
                          : 'none',
                      }}
                      className={`hero-badge-interactive hero-${badge.id} hero-badge-${index + 1}`}
                      onMouseEnter={(e) => {
                        if (badge.hoverAnimation?.enabled) {
                          e.currentTarget.style.transform = `scale(${badge.hoverAnimation?.scale || 1}) translateY(${badge.hoverAnimation?.translateY || 0}px)`;
                          e.currentTarget.style.boxShadow = badge.hoverAnimation?.shadow || `0 16px 32px -4px ${colors?.iconColor + "40"}`;
                          e.currentTarget.style.borderColor = badge.hoverAnimation?.borderColor || colors?.iconColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (badge.hoverAnimation?.enabled) {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = `0 10px 25px -4px ${colors?.iconColor ? colors.iconColor + "30" : "rgba(124, 58, 237, 0.18)"}`;
                          e.currentTarget.style.borderColor = colors?.borderColor || "rgba(226, 232, 240, 0.9)";
                        }
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          backgroundColor: colors?.iconColor || "#7C3AED",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <DynamicIcon name={badge.iconName} size={16} />
                      </div>
                      <span
                        style={{
                          fontSize: "0.775rem",
                          fontWeight: 600,
                          color: colors?.textColor || "#1E293B",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {badge.text}
                      </span>
                    </div>
                  );
                })
              ) : (
                // Fallback hardcoded badges
                <>
                  {/* 1. Web Development */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-0.75rem",
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
                        fontWeight: 600,
                        color: "#1E293B",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Web Development
                    </span>
                  </div>

                  {/* 2. Mobile Apps */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-1.25rem",
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
                        fontWeight: 600,
                        color: "#1E293B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Mobile Apps
                    </span>
                  </div>

                  {/* 3. Cloud Solutions */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-0.75rem",
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
                        fontWeight: 600,
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
                      top: "30%",
                      right: "-0.5rem",
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
                        fontWeight: 600,
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
                      top: "66%",
                      right: "0rem",
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
                        fontWeight: 600,
                        color: "#1E293B",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Analytics
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className="hero-metrics-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(1.5rem, 4vw, 4rem)",
              marginTop: "clamp(2rem, 3.5vw, 3rem)",
              paddingTop: "1.5rem",
              borderTop: "1px solid #E2E8F0",
              flexWrap: "wrap",
            }}
          >
            {metrics.map((metric, index) => (
              <div
                key={`${metric.label}-${index}`}
                className="hero-metric-item"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.75rem",
                  minWidth: 0,
                }}
              >
                {/* Metric Icon */}
                <div
                  style={{
                    flex: "0 0 42px",
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: metric.backgroundColor,
                    color: metric.iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {metric.icon}
                </div>

                {/* Metric Text */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                      fontWeight: 600,
                      color: "#1E293B",
                      lineHeight: 1.2,
                      marginBottom: "2px",
                    }}
                  >
                    {metric.value}
                  </div>

                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748B",
                      fontWeight: 500,
                      lineHeight: 1.35,
                    }}
                  >
                    {metric.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
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

        @media (max-width: 960px) {
          .hero-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 2.25rem !important;
          }
          .hero-content-col {
            max-width: 100% !important;
          }
          .hero-visual-col {
            max-width: 500px !important;
            margin: 0 auto !important;
          }
        }

        .hero-badge-1 { top: -0.75rem !important; left: 2% !important; }
        .hero-badge-2 { top: -1.25rem !important; left: 34% !important; }
        .hero-badge-3 { top: -0.75rem !important; right: 2% !important; }
        .hero-badge-4 { top: 30% !important; right: -0.5rem !important; }
        .hero-badge-5 { top: 66% !important; right: 0rem !important; }

        /* Responsive badge placement for tablet viewports */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-badge-1 { top: -0.5rem !important; left: 2% !important; }
          .hero-badge-2 { top: -1rem !important; left: 32% !important; }
          .hero-badge-3 { top: -0.5rem !important; right: 2% !important; }
          .hero-badge-4 { top: 28% !important; right: 0rem !important; }
          .hero-badge-5 { top: 64% !important; right: 0rem !important; }
          .hero-badge-interactive {
            padding: 0.35rem 0.65rem !important;
          }
          .hero-badge-interactive span {
            font-size: 0.725rem !important;
          }
        }

        @media (max-width: 768px) {
          .hero-badge-interactive,
          .hero-badge-traces {
            display: none !important;
          }
        }

        /* Responsive metrics row for mobile */
        @media (max-width: 640px) {
          .hero-subtitle {
            text-align: left !important;
          }

          .hero-metrics-row {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1.25rem 0.75rem !important;
            justify-items: start !important;
          }

          .hero-metric-item {
            width: 100%;
          }
        }

        @media (max-width: 380px) {
          .hero-metrics-row {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
