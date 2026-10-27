import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Cloud,
  Settings,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
  Cpu,
  Compass,
  Users,
  Workflow,
} from "lucide-react";
import { useCMS } from "../../context/CMSContext";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  link?: string;
  slug?: string;
  iconName?: string;
}

const servicePalettes = [
  { bg: "#F5F3FF", color: "#7C3AED" }, // Web Dev - Purple
  { bg: "#F0FDFA", color: "#0D9488" }, // Mobile - Teal/Emerald
  { bg: "#F0F9FF", color: "#0284C7" }, // Cloud - Sky Blue
  { bg: "#FFE4E6", color: "#49243F" }, // IT Consulting - Crimson
  { bg: "#FAF5FF", color: "#9333EA" }, // Cybersecurity - Indigo/Purple
  { bg: "#FFF1F2", color: "#E11D48" }, // UI/UX - Rose
];

const services: ServiceItem[] = [
  {
    id: "serv-digital-transformation",
    title: "Enterprise Digital Transformation & Technology Solutions",
    description:
      "Azaroth Tech-Hive empowers enterprises to build, modernize, and scale their software ecosystems through strategic engineering and architectural expertise. We transform complex applications, streamline system integrations, strengthen data management, and optimize critical business systems through disciplined engineering practices—delivering secure, resilient, and adaptable software designed for operational continuity and long-term growth.",
    icon: <Cpu size={24} />,
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
    link: "/services#digital-transformation-technology-solutions",
  },
  {
    id: "serv-strategic-partnership",
    title: "Strategic Partnership & Consulting",
    description:
      "Build a stronger technology foundation with strategic guidance and hands-on engineering collaboration. We work alongside your team to clarify technical direction, improve software architecture, strengthen development practices, and turn business priorities into actionable technology initiatives. From evaluating technology choices to evolving existing products and addressing security risks, we help you make informed decisions, improve delivery, and create lasting value from your software investments.",
    icon: <Compass size={24} />,
    iconBg: "#F0FDFA",
    iconColor: "#0D9488",
    link: "/services#strategic-partnership-consulting",
  },
  {
    id: "serv-on-demand-workforce",
    title: "On-Demand Engineering Workforce Solutions",
    description:
      "Strengthen your software development capabilities with experienced engineers, solution architects, and quality specialists across diverse technologies and platforms. Our flexible engagement models, structured onboarding, and transparent delivery practices help teams overcome technical challenges, accelerate development, improve software quality, and bring ideas to life efficiently.",
    icon: <Users size={24} />,
    iconBg: "#F0F9FF",
    iconColor: "#0284C7",
    link: "/services#on-demand-workforce-solutions",
  },
  {
    id: "serv-business-process-management",
    title: "Business Process Management & Operations",
    description:
      "Transform complex workflows into streamlined digital processes with intelligent automation, integrated applications, and actionable real-time insights. From reducing manual effort to connecting fragmented systems, we engineer practical software solutions that improve efficiency, enhance visibility, and help businesses operate smarter.",
    icon: <Workflow size={24} />,
    iconBg: "#FFF1F2",
    iconColor: "#49243F",
    link: "/services#business-process-management-operations",
  },
];

export const FeaturedSolutions: React.FC = () => {
  const { services: cmsServices } = useCMS();

  const getServiceIcon = (name?: string) => {
    switch (name?.toLowerCase()) {
      case "cpu":
        return <Cpu size={24} />;
      case "compass":
        return <Compass size={24} />;
      case "users":
        return <Users size={24} />;
      case "workflow":
        return <Workflow size={24} />;
      case "smartphone":
      case "mobile":
      case "mobile applications":
        return <Smartphone size={24} />;
      case "cloud":
      case "cloud solutions":
        return <Cloud size={24} />;
      case "settings":
      case "consulting":
      case "it consulting":
        return <Settings size={24} />;
      case "shieldcheck":
      case "security":
      case "cybersecurity":
        return <ShieldCheck size={24} />;
      case "lightbulb":
      case "design":
      case "ui/ux design":
        return <Lightbulb size={24} />;
      default:
        return <Cpu size={24} />;
    }
  };

  const displayServices =
    cmsServices && cmsServices.length > 0
      ? cmsServices.map((srv, idx) => {
          const pal = servicePalettes[idx % servicePalettes.length];
          return {
            id: srv.id || srv.slug || `srv-${idx}`,
            title: srv.title,
            description: srv.description || srv.summary || "",
            icon: getServiceIcon(srv.iconName || srv.title),
            iconBg: pal.bg,
            iconColor: pal.color,
            link: `/services#${srv.slug || "services"}`,
          };
        })
      : services;

  return (
    <section
      id="services"
      style={{
        backgroundColor: "#F8FAFC",
        paddingTop: "5rem",
        paddingBottom: "5.5rem",
        position: "relative",
      }}
      aria-label="Our Services"
    >
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            textAlign: "left",
            maxWidth: "720px",
            margin: "0 0 3.5rem 0",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 3.8vw, 2.75rem)",
              fontWeight: 800,
              color: "#1E293B",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Software Engineering for{" "}
            <span
              style={{
                background: "var(--gradient-heading)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ideas, Products & Growth
            </span>
          </h2>

          <p
            style={{
              fontSize: "1.0625rem",
              color: "#64748B",
              lineHeight: 1.6,
              textAlign: "justify",
            }}
          >
            Azaroth Tech-Hive helps businesses turn ideas into dependable
            software, overcome technical challenges, and continuously improve
            their digital capabilities. From developing new applications and
            integrating systems to modernizing existing solutions and supporting
            ongoing development, we combine practical expertise with thoughtful
            engineering to deliver software that works reliably, adapts to
            changing needs, and creates lasting value. Our focus is on
            simplifying complexity, improving performance, and building
            maintainable solutions that support real-world goals and future
            opportunities.
          </p>
        </div>

        {/* Enterprise Services 1x1 Grid */}

        <div
          className="featured-services-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "16px",
            width: "100%",
            alignItems: "stretch",
          }}
        >
          {" "}
          {displayServices.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="featured-service-card"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "1rem",
                padding: "1.25rem",
                border: "1px solid #E2E8F0",
                // border: "2px solid #C99B52",

                boxShadow: "0 3px 12px rgba(15, 23, 42, 0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                minWidth: 0,
                height: "100%",
                boxSizing: "border-box",
                transition:
                  "transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "2.75rem",
                  height: "2.75rem",
                  minWidth: "2.75rem",
                  borderRadius: "12px",
                  backgroundColor: item.iconBg,
                  color: item.iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                {item.icon}
              </div>

              {/* Service title */}
              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "#1E293B",
                  lineHeight: 1.4,
                  margin: "0 0 0.625rem",
                  overflowWrap: "anywhere",
                }}
              >
                {item.title}
              </h3>

              {/* Service description */}
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#64748B",
                  lineHeight: 1.65,
                  margin: 0,
                  overflowWrap: "break-word",
                  textAlign: "justify",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Single Learn More CTA */}
        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <Link
            to="/services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.875rem 2.25rem",
              borderRadius: "9999px",
              background: "var(--gradient-button)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "0.975rem",
              textDecoration: "none",
              boxShadow: "0 6px 20px -2px rgba(73, 36, 63, 0.35)",
              transition: "all 200ms ease-out",
            }}
            className="hover:scale-105 hover:opacity-95"
          >
            <span>Explore</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      <style>{`
        .featured-services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
          align-items: stretch;
        }
        @media (min-width: 768px) {
          .featured-services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedSolutions;
