
import React, { useEffect, useRef, useState } from "react";
import { GitBranch, Cpu, Users } from "lucide-react";
import { heroWorkspaceImg } from "../../assets/images";

export const AboutSection: React.FC = () => {
 
const imageRef = useRef<HTMLDivElement>(null);
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const element = imageRef.current;

  if (!element) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      // Show the animation whenever 20% of the image is visible.
      setIsVisible(entry.isIntersecting);
    },
    {
      threshold: 0.2,
    }
  );

  observer.observe(element);

  return () => observer.disconnect();
}, []);

  return (
    <section
      id="who-we-are"
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: "5.5rem",
        paddingBottom: "5.5rem",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Who We Are"
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "4rem",
            alignItems: "center",
            marginBottom: "4.5rem",
          }}
        >
          {/* Workspace image */}
          <div style={{ position: "relative" }}>
            <div
              ref={imageRef}
              className={`hero-workspace-frame ${
                isVisible ? "is-visible" : ""
              }`}
              style={{
                position: "relative",
                zIndex: 1,
                borderRadius: "24px 100px 24px 100px",
                overflow: "hidden",
                boxShadow: "0 20px 45px -10px rgba(15, 23, 42, 0.12)",
                border: "2px solid #C99B52",
                boxSizing: "border-box",
              }}
            >
              <img
                src={heroWorkspaceImg}
                alt="Azaroth Tech-Hive Engineering Team"
                style={{
                  width: "100%",
                  height: "460px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* About content */}
          <div style={{ maxWidth: "620px" }}>
            <h2
              style={{
                fontSize: "clamp(2.25rem, 4.2vw, 3.25rem)",
                fontWeight: 800,
                color: "var(--color-text-primary, #1F2937)",
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                marginBottom: "1.5rem",
              }}
            >
              Turning Ideas into{" "}
              <span
                style={{
                  background: "var(--gradient-heading)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Digital Reality
              </span>
            </h2>

            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--color-text-secondary, #4B5563)",
                lineHeight: 1.75,
                marginBottom: "1.5rem",
                  textAlign: "justify",
              }}
            >
              Azaroth Tech-Hive delivers practical software engineering solutions that help businesses solve technical challenges and build dependable digital products. From application development and system integration to software modernisation and ongoing support, we focus on reliability, security, performance, and maintainability. Our approach combines thoughtful problem-solving with sound engineering practices to create scalable solutions aligned with business goals.
            </p>

            {/* Metrics */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "1.5rem",
                margin: "2rem 0",
                paddingTop: "1.25rem",
                borderTop: "1px solid #E2E8F0",
              }}
            >
              {/* Client Satisfaction */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: "#EDE9FE",
                    color: "#7C3AED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Users size={19} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#1E293B",
                      lineHeight: 1.1,
                    }}
                  >
                    95%
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748B",
                      fontWeight: 500,
                    }}
                  >
                    Client Satisfaction
                  </div>
                </div>
              </div>

              {/* Commitment to Quality */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: "#D1FAE5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GitBranch size={19} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#1E293B",
                      lineHeight: 1.1,
                    }}
                  >
                    100%
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748B",
                      fontWeight: 500,
                    }}
                  >
                    Commitment to Quality
                  </div>
                </div>
              </div>

              {/* On-Time Delivery */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: "#FFF1F2",
                    color: "#49243F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Cpu size={19} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "var(--color-text-primary, #1E293B)",
                      lineHeight: 1.1,
                    }}
                  >
                    90%
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted, #64748B)",
                      fontWeight: 500,
                    }}
                  >
                    On-Time Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
