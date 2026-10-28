
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Cpu,
  Compass,
  Users,
  Workflow,
  ArrowRight,
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  link: string;
}

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
  return (
    <section
      id="services"
      aria-label="Our Services"
      style={{
        backgroundColor: "#F8FAFC",
        paddingTop: "5rem",
        paddingBottom: "2.5rem",
        position: "relative",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            textAlign: "left",
            maxWidth: "1300px",
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
              marginBottom: "3rem",
            }}
          >
            Engineering for{" "}
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
            integrating systems to modernizing existing solutions and
            supporting ongoing development, we combine practical expertise
            with thoughtful engineering to deliver software that works
            reliably, adapts to changing needs, and creates lasting value.
            Our focus is on simplifying complexity, improving performance,
            and building maintainable solutions that support real-world goals
            and future opportunities.
          </p>
        </motion.div>

        {/* Services Grid */}

        <div
          className="featured-services-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "1.25rem",
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {services.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="featured-service-card"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "1rem",
                padding: "1.25rem",
                border: "1px solid #E2E8F0",
                boxShadow: "0 3px 12px rgba(15, 23, 42, 0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                minWidth: 0,
                height: "100%",
                boxSizing: "border-box",
              }}
            >
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
                aria-hidden="true"
              >
                {item.icon}
              </div>

              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#1E293B",
                  lineHeight: 1.4,
                  margin: "0 0 0.625rem",
                  overflowWrap: "anywhere",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "#64748B",
                  lineHeight: 1.65,
                  margin: 0,
                  overflowWrap: "break-word",
                  textAlign: "justify",
                  flexGrow: 1,
                }}
              >
                {item.description}
              </p>

              <Link
                to={item.link}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "1.25rem",
                  color: "#0878E8",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
                aria-label={`Learn more about ${item.title}`}
              >
                Learn more
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>


        {/* Explore All Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            textAlign: "center",
            marginTop: "3.5rem",
          }}
        >
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
              boxShadow: "0 6px 20px -2px rgba(73, 36, 63, 0.25)",
              transition: "transform 200ms ease, opacity 200ms ease",
            }}
            className="hover:scale-105 hover:opacity-95"
          >
            <span>Explore All Services</span>
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSolutions;
