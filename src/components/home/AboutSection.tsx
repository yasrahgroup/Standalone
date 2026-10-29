// import React, { useEffect, useRef, useState } from "react";
// import { GitBranch, Cpu, Users } from "lucide-react";
// import { heroWorkspaceImg } from "../../assets/images";

// export const AboutSection: React.FC = () => {
//   const imageRef = useRef<HTMLDivElement>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const element = imageRef.current;

//     if (!element) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         // Show the animation whenever 20% of the image is visible.
//         setIsVisible(entry.isIntersecting);
//       },
//       {
//         threshold: 0.2,
//       },
//     );

//     observer.observe(element);

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <section
//       id="who-we-are"
//       style={{
//         backgroundColor: "#FFFFFF",
//         paddingTop: "5.5rem",
//         paddingBottom: "5.5rem",
//         position: "relative",
//         overflow: "hidden",
//       }}
//       aria-label="Who We Are"
//     >
//       <div className="container">
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//             gap: "4rem",
//             alignItems: "center",
//             marginBottom: "4.5rem",
//           }}
//         >
//           {/* Workspace image */}
//           <div style={{ position: "relative" }}>
//             <div
//               ref={imageRef}
//               className={`hero-workspace-frame ${
//                 isVisible ? "is-visible" : ""
//               }`}
//               style={{
//                 position: "relative",
//                 zIndex: 1,
//                 borderRadius: "24px 100px 24px 100px",
//                 overflow: "hidden",
//                 boxShadow: "0 20px 45px -10px rgba(15, 23, 42, 0.12)",
//                 border: "2px solid #C99B52",
//                 boxSizing: "border-box",
//               }}
//             >
//               <img
//                 src={heroWorkspaceImg}
//                 alt="Azaroth Tech-Hive Engineering Team"
//                 style={{
//                   width: "100%",
//                   height: "auto",
//                   aspectRatio: "4 / 3",
//                   objectFit: "cover",
//                   display: "block",
//                 }}
//               />
//             </div>
//           </div>

//           {/* About content */}
//           <div style={{ maxWidth: "620px" }}>
//             <h2
//               style={{
//                 fontSize: "clamp(2.25rem, 4.2vw, 3.25rem)",
//                 fontWeight: 800,
//                 color: "var(--color-text-primary, #1F2937)",
//                 letterSpacing: "-0.025em",
//                 lineHeight: 1.15,
//                 marginBottom: "1.5rem",
//               }}
//             >
//               Turning Ideas into{" "}
//               <span
//                 style={{
//                   background: "var(--gradient-heading)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 Digital Reality
//               </span>
//             </h2>

//             <p
//               style={{
//                 fontSize: "1.0625rem",
//                 color: "var(--color-text-secondary, #4B5563)",
//                 lineHeight: 1.75,
//                 marginBottom: "1.5rem",
//                 textAlign: "justify",
//               }}
//             >
//               Azaroth Tech-Hive delivers practical software engineering
//               solutions that help businesses solve technical challenges and
//               build dependable digital products. From application development
//               and system integration to software modernisation and ongoing
//               support, we focus on reliability, security, performance, and
//               maintainability. Our approach combines thoughtful problem-solving
//               with sound engineering practices to create scalable solutions
//               aligned with business goals.
//             </p>
//           </div>
//         </div>
//         {/* Metrics */}
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             gap: "1.5rem",
//             margin: "2rem 0",
//             paddingTop: "1.25rem",
//             borderTop: "1px solid #E2E8F0",
//           }}
//         >
//           {/* Client Satisfaction */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//             }}
//           >
//             <div
//               style={{
//                 width: "42px",
//                 height: "42px",
//                 borderRadius: "50%",
//                 backgroundColor: "#EDE9FE",
//                 color: "#7C3AED",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Users size={19} />
//             </div>

//             <div>
//               <div
//                 style={{
//                   fontSize: "1.25rem",
//                   fontWeight: 800,
//                   color: "#1E293B",
//                   lineHeight: 1.1,
//                 }}
//               >
//                 95%
//               </div>
//               <div
//                 style={{
//                   fontSize: "0.75rem",
//                   color: "#64748B",
//                   fontWeight: 500,
//                 }}
//               >
//                 Client Satisfaction
//               </div>
//             </div>
//           </div>

//           {/* Commitment to Quality */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//             }}
//           >
//             <div
//               style={{
//                 width: "42px",
//                 height: "42px",
//                 borderRadius: "50%",
//                 backgroundColor: "#D1FAE5",
//                 color: "#059669",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <GitBranch size={19} />
//             </div>

//             <div>
//               <div
//                 style={{
//                   fontSize: "1.25rem",
//                   fontWeight: 800,
//                   color: "#1E293B",
//                   lineHeight: 1.1,
//                 }}
//               >
//                 100%
//               </div>
//               <div
//                 style={{
//                   fontSize: "0.75rem",
//                   color: "#64748B",
//                   fontWeight: 500,
//                 }}
//               >
//                 Commitment to Quality
//               </div>
//             </div>
//           </div>

//           {/* On-Time Delivery */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//             }}
//           >
//             <div
//               style={{
//                 width: "42px",
//                 height: "42px",
//                 borderRadius: "50%",
//                 backgroundColor: "#FFF1F2",
//                 color: "#49243F",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Cpu size={19} />
//             </div>

//             <div>
//               <div
//                 style={{
//                   fontSize: "1.25rem",
//                   fontWeight: 800,
//                   color: "var(--color-text-primary, #1E293B)",
//                   lineHeight: 1.1,
//                 }}
//               >
//                 90%
//               </div>
//               <div
//                 style={{
//                   fontSize: "0.75rem",
//                   color: "var(--color-text-muted, #64748B)",
//                   fontWeight: 500,
//                 }}
//               >
//                 On-Time Delivery
//               </div>
//             </div>
//           </div>

//           {/* On-Time Delivery */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//             }}
//           >
//             <div
//               style={{
//                 width: "42px",
//                 height: "42px",
//                 borderRadius: "50%",
//                 backgroundColor: "#FFF1F2",
//                 color: "#49243F",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Cpu size={19} />
//             </div>

//             <div>
//               <div
//                 style={{
//                   fontSize: "1.25rem",
//                   fontWeight: 800,
//                   color: "var(--color-text-primary, #1E293B)",
//                   lineHeight: 1.1,
//                 }}
//               >
//                 90%
//               </div>
//               <div
//                 style={{
//                   fontSize: "0.75rem",
//                   color: "var(--color-text-muted, #64748B)",
//                   fontWeight: 500,
//                 }}
//               >
//                 On-Time Delivery
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { heroWorkspaceImg } from "../../assets/images";

export const AboutSection: React.FC = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = imageRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      },
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
        paddingBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Who We Are"
    >
      <div className="container">
        {/* Main About Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "center",
            marginBottom: "4.5rem",
          }}
        >
          {/* Workspace Image */}
          <div style={{ position: "relative", minWidth: 0 }}>
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
                  height: "auto",
                  aspectRatio: "4 / 3",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: "620px", minWidth: 0 }}
          >
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.25rem)",
                fontWeight: 600,
                color: "var(--color-text-primary, #1F2937)",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                marginBottom: "1.25rem",
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
                fontSize: "1rem",
                color: "var(--color-text-secondary, #4B5563)",
                lineHeight: 1.65,
                marginBottom: "1.5rem",
                textAlign: "justify",
              }}
            >
              <div className="service-description">
                <p>
                  Azaroth Tech-Hive delivers practical software engineering
                  solutions that help businesses overcome technical challenges,
                  improve operations, and transform ideas into dependable
                  digital products. We support the software lifecycle, from
                  requirements analysis and solution design to application
                  development, system integration, and modernization.
                </p>
                <br />
                <p>
                  Our structured approach follows six stages: Discovery and
                  Planning → Solution Design → Development and Integration →
                  Testing and Quality Assurance → Deployment → Ongoing Support
                  and Enhancement. Each stage focuses on business objectives,
                  engineering quality, and practical outcomes.
                </p>
                <br />
                <p>
                  We prioritize reliability, security, performance, usability,
                  and maintainability, building solutions that deliver lasting
                  value without unnecessary complexity. Whether developing new
                  applications or enhancing existing systems, we help businesses
                  leverage technology effectively and prepare for future growth.
                </p>
              </div>
            </p>
          </motion.div>
        </div>

        {/* Metrics Section */}
      </div>
    </section>
  );
};

export default AboutSection;
