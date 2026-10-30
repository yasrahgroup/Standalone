// import React, { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   ShieldCheck,
//   Zap,
//   Target,
//   Compass,
//   Lightbulb,
//   Maximize2,
//   CheckCircle,
//   Users,
//   TrendingUp,
// } from "lucide-react";
// import { companyVisionMission, ourValuesPrinciples } from "../data/companyData";
// import { Button } from "../components/common/Button";
// import { Card } from "../components/common/Card";
// import { SEOHead } from "../components/common/SEOHead";
// import { PageHeader } from "../components/common/PageHeader";
// import { ProcessTimeline } from "../components/framework/ProcessTimeline";
// import { FinalCTA } from "../components/home/FinalCTA";
// import { heroWorkspaceImg } from "../assets/images";
// import { useCMS } from "../context/CMSContext";
// import { MediaRenderer } from "../components/common/MediaRenderer";

// export const About: React.FC = () => {
//   const { pages } = useCMS();
//   const location = useLocation();

//   const pageData = pages["about"];
//   const content = pageData?.content || {};

//   const valuesData = pages["values"];
//   const valuesContent = valuesData?.content || {};

//   const valuesPrinciples =
//     valuesContent.principles &&
//     Array.isArray(valuesContent.principles) &&
//     valuesContent.principles.length > 0
//       ? valuesContent.principles
//       : ourValuesPrinciples;

//   const kicker = content.kicker || "- WHO WE ARE -";
//   const heroTitle =
//     content.heroTitle ||
//     pageData?.title ||
//     "Engineering Meaningful Solutions Building Lasting Value";
//   const heroSubtitle =
//     content.heroSubtitle ||
//     pageData?.meta_description ||
//     "At Azaroth Techhive, we are passionate about technology and driven by a simple goal — to help businesses build smarter, stronger and more innovative digital solutions with a client-first approach.";
//   const storyBadge = content.storyBadge || "— OUR STORY —";
//   // const storyTitle = content.storyTitle || 'Turning Ideas into Digital Reality';
//   const storyParagraph1 =
//     content.storyParagraph1 ||
//     "Azaroth Techhive delivers practical software engineering solutions that help businesses overcome complex technical bottlenecks, modernise legacy operations, and turn high-stakes ideas into dependable digital products.";
//   const storyParagraph2 =
//     content.storyParagraph2 ||
//     "With dedicated engineering pods, cloud modernisation, and custom application development, we bring your vision to life, one line of clean, tested code at a time.";
//   const visionText = content.vision || companyVisionMission.vision.statement;
//   const missionText = content.mission || companyVisionMission.mission.statement;

//   const getIcon = (name: string) => {
//     switch (name) {
//       case "Lightbulb":
//         return <Lightbulb size={26} />;
//       case "ShieldCheck":
//         return <ShieldCheck size={26} />;
//       case "Maximize2":
//         return <Maximize2 size={26} />;
//       case "CheckCircle":
//         return <CheckCircle size={26} />;
//       case "Users":
//         return <Users size={26} />;
//       case "TrendingUp":
//         return <TrendingUp size={26} />;
//       default:
//         return <Lightbulb size={26} />;
//     }
//   };

//   const scrollToAnchor = (id: string) => {
//     const elem = document.getElementById(id);
//     if (elem) {
//       elem.scrollIntoView({ behavior: "smooth", block: "start" });
//       window.history.pushState(null, "", `#${id}`);
//     }
//   };

//   // Smooth scroll to anchor on initial load or location hash updates
//   useEffect(() => {
//     const rawHash = location.hash ? location.hash.replace("#", "") : "";
//     if (
//       [
//         "about-us",
//         "our-values",
//         "values",
//         "delivery-framework",
//         "framework",
//       ].includes(rawHash)
//     ) {
//       const targetId =
//         rawHash === "values"
//           ? "our-values"
//           : rawHash === "framework"
//             ? "delivery-framework"
//             : rawHash;
//       const timer = setTimeout(() => {
//         const elem = document.getElementById(targetId);
//         if (elem) elem.scrollIntoView({ behavior: "smooth", block: "start" });
//       }, 120);
//       return () => clearTimeout(timer);
//     }
//   }, [location.hash]);

//   return (
//     <div>
//       <SEOHead
//         title={
//           pageData?.title
//             ? `${pageData.title} | Azaroth Techhive`
//             : "About Us — Values & Delivery Framework | Azaroth Techhive"
//         }
//         description={
//           pageData?.meta_description ||
//           "Learn about Azaroth Techhive: our vision, core values, and 4-phase zero-downtime delivery framework."
//         }
//         canonicalPath="/about"
//       />

//       {/* Page Hero Banner */}
//       <PageHeader
//         kicker={kicker}
//         title={heroTitle}
//         gradientWords={[
//           "Building",
//           "Lasting",
//           "Value",
//           "Meaningful",
//           "Solutions",
//         ]}
//         subtitle={heroSubtitle}
//       />

//       {/* SECTION 1: ABOUT US (Narrative with Visual Workspace Image) */}
//       <section
//         id="about-us"
//         style={{
//           backgroundColor: "#F8FAFC",
//           padding: "5.5rem 0",
//           scrollMarginTop: "5rem",
//         }}
//       >
//         <div className="container">
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//               gap: "4rem",
//               alignItems: "center",
//             }}
//           >
//             {/* Right: Narrative Story Content */}
//             <div>
//               <div
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: "0.5rem",
//                   fontSize: "0.8125rem",
//                   fontWeight: 700,
//                   color: "#49243F",
//                   letterSpacing: "0.18em",
//                   textTransform: "uppercase",
//                   marginBottom: "1rem",
//                 }}
//               >
//                 {storyBadge}
//               </div>

//               <h2
//                 style={{
//                   fontSize: "clamp(2.125rem, 4vw, 2.875rem)",
//                   fontWeight: 800,
//                   color: "#1E293B",
//                   letterSpacing: "-0.02em",
//                   lineHeight: 1.2,
//                   marginBottom: "1.5rem",
//                 }}
//               >
//                 {/* {storyTitle} */}
//               </h2>

//               <p
//                 style={{
//                   fontSize: "1.0625rem",
//                   color: "#475569",
//                   lineHeight: 1.7,
//                   marginBottom: "1.25rem",
//                 }}
//               >
//                 {storyParagraph1}
//               </p>

//               <p
//                 style={{
//                   fontSize: "1.0625rem",
//                   color: "#475569",
//                   lineHeight: 1.7,
//                   marginBottom: "2rem",
//                 }}
//               >
//                 {storyParagraph2}
//               </p>

//               {/* Highlights Row */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
//                   gap: "1.25rem",
//                   padding: "1.5rem",
//                   backgroundColor: "#FFFFFF",
//                   borderRadius: "16px",
//                   border: "1px solid rgba(226, 232, 240, 0.8)",
//                   marginBottom: "2rem",
//                 }}
//               >
//                 <div>
//                   <div
//                     style={{
//                       fontSize: "1rem",
//                       fontWeight: 800,
//                       color: "#49243F",
//                       lineHeight: 1.2,
//                     }}
//                   >
//                     Disciplined
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "0.8125rem",
//                       color: "var(--color-text-secondary, #4B5563)",
//                     }}
//                   >
//                     Principled Design
//                   </div>
//                 </div>
//                 <div>
//                   <div
//                     style={{
//                       fontSize: "1rem",
//                       fontWeight: 800,
//                       color: "var(--color-success, #047857)",
//                       lineHeight: 1.2,
//                     }}
//                   >
//                     Tested Quality
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "0.8125rem",
//                       color: "var(--color-text-secondary, #4B5563)",
//                     }}
//                   >
//                     Rigorous Verification
//                   </div>
//                 </div>
//                 <div>
//                   <div
//                     style={{
//                       fontSize: "1rem",
//                       fontWeight: 800,
//                       color: "var(--color-warning, #D97706)",
//                       lineHeight: 1.2,
//                     }}
//                   >
//                     True Partnership
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "0.8125rem",
//                       color: "var(--color-text-secondary, #4B5563)",
//                     }}
//                   >
//                     Transparent Delivery
//                   </div>
//                 </div>
//               </div>

//               {/* <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//                 <Button
//                   onClick={() => scrollToAnchor("delivery-framework")}
//                   variant="primary"
//                 >
//                   Explore Delivery Framework
//                 </Button>
//                 <Button
//                   onClick={() => scrollToAnchor("our-values")}
//                   variant="outline"
//                 >
//                   Our Engineering Values
//                 </Button>
//               </div> */}
//             </div>
//                {/* Left: Professional Workspace Photography */}
//             <div style={{ position: "relative" }}>
//               <div
//                 style={{
//                   borderRadius: "24px",
//                   overflow: "hidden",
//                   boxShadow: "0 20px 40px -15px rgba(73, 36, 63, 0.25)",
//                   border: "1px solid rgba(73, 36, 63, 0.2)",
//                   position: "relative",
//                 }}
//               >
//                 <MediaRenderer
//                   src={heroWorkspaceImg}
//                   alt="Azaroth Techhive engineering team collaborating on modern systems architecture"
//                   objectFit="cover"
//                   loading="lazy"
//                 />
//               </div>

//               {/* Verified SLA & Delivery badge overlay */}
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: "-1.5rem",
//                   right: "1.5rem",
//                   backgroundColor: "#FFFFFF",
//                   padding: "1rem 1.5rem",
//                   borderRadius: "16px",
//                   boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
//                   border: "1px solid #FFE4E6",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "0.875rem",
//                   maxWidth: "85%",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "42px",
//                     height: "42px",
//                     borderRadius: "50%",
//                     backgroundColor: "rgba(73, 36, 63, 0.1)",
//                     color: "#49243F",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                   }}
//                 >
//                   <ShieldCheck size={22} />
//                 </div>
//                 <div>
//                   <div
//                     style={{
//                       fontSize: "0.9375rem",
//                       fontWeight: 800,
//                       color: "#1E293B",
//                       lineHeight: 1.2,
//                     }}
//                   >
//                     99.9% Uptime
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "0.75rem",
//                       color: "#64748B",
//                       fontWeight: 500,
//                     }}
//                   >
//                     Enterprise Engineering SLA
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* SECTION 2: OUR VALUES */}
//       <section
//         id="our-values"
//         style={{
//           backgroundColor: "#FFFFFF",
//           paddingTop: "5.5rem",
//           paddingBottom: "5.5rem",
//           scrollMarginTop: "5rem",
//           position: "relative",
//           borderTop: "1px solid #E2E8F0",
//         }}
//       >
//         <div className="container">
//           {/* Values Section Header */}
//           <div
//             style={{
//               textAlign: "left",
//               maxWidth: "780px",
//               margin: "0 0 3.5rem 0",
//             }}
//           >
//             <div
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.8125rem",
//                 fontWeight: 700,
//                 color: "#49243F",
//                 letterSpacing: "0.18em",
//                 textTransform: "uppercase",
//                 marginBottom: "0.75rem",
//               }}
//             >
//               &mdash; CORE ENGINEERING VALUES &mdash;
//             </div>
//             <h2
//               style={{
//                 fontSize: "clamp(2rem, 3.8vw, 2.75rem)",
//                 fontWeight: 800,
//                 color: "#1E293B",
//                 letterSpacing: "-0.02em",
//                 lineHeight: 1.2,
//                 marginBottom: "1rem",
//               }}
//             >
//               Principles That Shape{" "}
//               <span
//                 style={{
//                   background: "var(--gradient-heading)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 Every Solution
//               </span>
//             </h2>
//             <p
//               style={{
//                 fontSize: "1.0625rem",
//                 color: "#64748B",
//                 lineHeight: 1.7,
//                 margin: 0,
//               }}
//             >
//               At Azaroth Tech-Hive, our values guide how we think, engineer,
//               collaborate, and deliver. We believe great software comes from
//               understanding real problems, making thoughtful decisions,
//               maintaining high standards, and continuously improving the way
//               technology works.{" "}
//             </p>
//           </div>

//           {/* Values Grid */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//               gap: "2.25rem",
//             }}
//           >
//             {valuesPrinciples.map((val: any, index: number) => (
//               <motion.div
//                 key={val.number}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-100px" }}
//                 transition={{
//                   duration: 0.5,
//                   delay: index * 0.08,
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//               >
//                 <Card
//                   variant="glass"
//                   padding="lg"
//                   style={{
//                     border: "1px solid var(--color-border)",
//                     borderRadius: "var(--radius-xl)",
//                     display: "flex",
//                     flexDirection: "column",
//                     height: "100%",
//                     transition: "all 180ms ease-out",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.boxShadow =
//                       "0 12px 30px -4px rgba(73, 36, 63, 0.12)";
//                     e.currentTarget.style.borderColor = "#49243F";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.boxShadow = "";
//                     e.currentTarget.style.borderColor = "var(--color-border)";
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       marginBottom: "1.5rem",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "3.5rem",
//                         height: "3.5rem",
//                         borderRadius: "14px",
//                         background: "rgba(73, 36, 63, 0.10)",
//                         color: "#49243F",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         border: "1px solid rgba(73, 36, 63, 0.2)",
//                       }}
//                     >
//                       {getIcon(val.iconName)}
//                     </div>

//                     <span
//                       style={{
//                         padding: "0.25rem 0.75rem",
//                         borderRadius: "9999px",
//                         fontSize: "0.75rem",
//                         fontWeight: 800,
//                         backgroundColor: "#FFF1F2",
//                         color: "#49243F",
//                         border: "1px solid #FFE4E6",
//                       }}
//                     >
//                       {val.number}
//                     </span>
//                   </div>

//                   <h3
//                     style={{
//                       fontSize: "1.35rem",
//                       fontWeight: 800,
//                       color: "var(--color-text-primary)",
//                       marginBottom: "0.5rem",
//                     }}
//                   >
//                     {val.title}
//                   </h3>

//                   <p
//                     style={{
//                       fontSize: "0.9375rem",
//                       color: "var(--color-text-secondary)",
//                       lineHeight: 1.65,
//                       flexGrow: 1,
//                       margin: 0,
//                     }}
//                   >
//                     {val.description}
//                   </p>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* SECTION 3: DELIVERY FRAMEWORK */}
//       <section
//         id="delivery-framework"
//         style={{
//           backgroundColor: "#F8FAFC",
//           borderTop: "1px solid #E2E8F0",
//           paddingTop: "5.5rem",
//           paddingBottom: "5.5rem",
//           scrollMarginTop: "5rem",
//           position: "relative",
//         }}
//       >
//         <div className="container">
//           {/* Framework Section Header */}
//           <div
//             style={{
//               textAlign: "left",
//               maxWidth: "780px",
//               margin: "0 0 3.5rem 0",
//             }}
//           >
//             <div
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.8125rem",
//                 fontWeight: 700,
//                 color: "#49243F",
//                 letterSpacing: "0.18em",
//                 textTransform: "uppercase",
//                 marginBottom: "0.75rem",
//               }}
//             >
//               &mdash; DISCIPLINED METHODOLOGY &mdash;
//             </div>
//             <h2
//               style={{
//                 fontSize: "clamp(2rem, 3.8vw, 2.75rem)",
//                 fontWeight: 800,
//                 color: "#1E293B",
//                 letterSpacing: "-0.02em",
//                 lineHeight: 1.2,
//                 marginBottom: "1rem",
//               }}
//             >
//               Our Delivery Framework &mdash;{" "}
//               <span
//                 style={{
//                   background: "var(--gradient-heading)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 A Clear Path from Idea to Impact
//               </span>
//             </h2>
//             <p
//               style={{
//                 fontSize: "1.0625rem",
//                 color: "#64748B",
//                 lineHeight: 1.7,
//                 margin: 0,
//                 textAlign: "justify",
//               }}
//             >
//               A structured, collaborative approach that brings clarity to every
//               stage of software development, ensuring solutions remain aligned
//               with project goals, built on sound engineering practices, and
//               adaptable to evolving needs.
//             </p>
//           </div>

//           {/* Interactive Process Stepper */}
//           <ProcessTimeline />
//         </div>
//       </section>

//       {/* Global Conversion Portal */}
//       <FinalCTA />
//     </div>
//   );
// };

// export default About;

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lightbulb,
  Maximize2,
  CheckCircle,
  Users,
  TrendingUp,
} from "lucide-react";
import { ourValuesPrinciples } from "../data/companyData";
import { Card } from "../components/common/Card";
import { SEOHead } from "../components/common/SEOHead";
import { PageHeader } from "../components/common/PageHeader";
import { ProcessTimeline } from "../components/framework/ProcessTimeline";
import { FinalCTA } from "../components/home/FinalCTA";
import { heroWorkspaceImg } from "../assets/images";
import { useCMS } from "../context/CMSContext";
import { MediaRenderer } from "../components/common/MediaRenderer";

export const About: React.FC = () => {
  const { pages } = useCMS();
  const location = useLocation();

  const pageData = pages["about"];
  const content = pageData?.content || {};

  const valuesData = pages["values"];
  const valuesContent = valuesData?.content || {};

  const valuesPrinciples =
    valuesContent.principles &&
    Array.isArray(valuesContent.principles) &&
    valuesContent.principles.length > 0
      ? valuesContent.principles
      : ourValuesPrinciples;

  const kicker = content.kicker || "- WHO WE ARE -";
  const heroTitle =
    content.heroTitle ||
    pageData?.title ||
    "Engineering Meaningful Solutions Building Lasting Value";
  const heroSubtitle =
    content.heroSubtitle ||
    pageData?.meta_description ||
    "At Azaroth Techhive, we are passionate about technology and driven by a simple goal to help businesses build smarter, stronger and more innovative digital solutions with a client-first approach.";
  const storyBadge = content.storyBadge || "— OUR STORY —";
  const storyTitle = content.storyTitle || "Turning Ideas into Digital Reality";
  const storyParagraph1 =
    content.storyParagraph1 ||
    "Azaroth Techhive delivers practical software engineering solutions that help businesses overcome complex technical bottlenecks, modernise legacy operations, and turn high-stakes ideas into dependable digital products.";
  const storyParagraph2 =
    content.storyParagraph2 ||
    "With dedicated engineering pods, cloud modernisation, and custom application development, we bring your vision to life, one line of clean, tested code at a time.";
  // Use CMS text when available; otherwise use the default company statements.
  // const visionText = content.vision || companyVisionMission.vision.statement;
  // const missionText = content.mission || companyVisionMission.mission.statement;

  const getIcon = (name: string) => {
    switch (name) {
      case "Lightbulb":
        return <Lightbulb size={26} />;
      case "ShieldCheck":
        return <ShieldCheck size={26} />;
      case "Maximize2":
        return <Maximize2 size={26} />;
      case "CheckCircle":
        return <CheckCircle size={26} />;
      case "Users":
        return <Users size={26} />;
      case "TrendingUp":
        return <TrendingUp size={26} />;
      default:
        return <Lightbulb size={26} />;
    }
  };

  // const scrollToAnchor = (id: string) => {
  //   const elem = document.getElementById(id);
  //   if (elem) {
  //     elem.scrollIntoView({ behavior: "smooth", block: "start" });
  //     window.history.pushState(null, "", `#${id}`);
  //   }
  // };

  // Smooth scroll to anchor on initial load or location hash updates
  useEffect(() => {
    const rawHash = location.hash ? location.hash.replace("#", "") : "";
    if (
      [
        "about-us",
        "our-values",
        "values",
        "delivery-framework",
        "framework",
      ].includes(rawHash)
    ) {
      const targetId =
        rawHash === "values"
          ? "our-values"
          : rawHash === "framework"
            ? "delivery-framework"
            : rawHash;
      const timer = setTimeout(() => {
        const elem = document.getElementById(targetId);
        if (elem) elem.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div key={location.pathname}>
      <SEOHead
        title={
          pageData?.title
            ? `${pageData.title} | Azaroth Techhive`
            : "About Us — Values & Delivery Framework | Azaroth Techhive"
        }
        description={
          pageData?.meta_description ||
          "Learn about Azaroth Techhive: our vision, core values, and 4-phase zero-downtime delivery framework."
        }
        canonicalPath="/about"
      />

      {/* Page Hero Banner */}
      <PageHeader
        kicker={kicker}
        title={heroTitle}
        gradientWords={["Building", "Lasting", "Value", "Solutions"]}
        subtitle={heroSubtitle}
      />

      {/* SECTION 1: ABOUT US (Narrative with Visual Workspace Image) */}

      <section
        id="about-us"
        style={{
          backgroundColor: "#F8FAFC",
          padding: "5rem 0",
          scrollMarginTop: "5rem",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "3rem",
              alignItems: "center",
              width: "100%",
            }}
            className="about-story-grid"
          >
            {/* LEFT: Company story and highlights */}
            <div style={{ minWidth: 0, width: "100%" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-primary, #49243F)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                {storyBadge}
              </div>

              
<h2
  style={{
    fontSize: "clamp(1.75rem, 3.2vw, 2.25rem)",
    fontWeight: 600,
    color: "#000000",
    letterSpacing: "-0.02em",
    lineHeight: 1.25,
    margin: "0 0 1.25rem",
    maxWidth: "600px",
    fontFamily: "var(--font-heading)",
  }}
>
  <span>{storyTitle.split(" ").slice(0, 2).join(" ")}</span>{" "}
  <span
    style={{
      background: "linear-gradient(90deg, #49243F 0%, #8A315D 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {storyTitle.split(" ").slice(2).join(" ")}
  </span>
</h2>


              <p
                style={{
                  fontSize: "1.0625rem",
                  color: "var(--color-text-secondary, #475569)",
                  lineHeight: 1.8,
                  margin: "0 0 1.25rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                {storyParagraph1}
              </p>

              <p
                style={{
                  fontSize: "1.0625rem",
                  color: "var(--color-text-secondary, #475569)",
                  lineHeight: 1.8,
                  margin: "0 0 2rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                {storyParagraph2}
              </p>

              {/* Company highlights */}

              <div
                className="about-highlights"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "clamp(1.5rem, 5vw, 4rem)",
                  padding: "1.5rem 2rem",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "18px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 8px 24px rgba(30, 41, 59, 0.04)",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {[
                  {
                    title: "Disciplined",
                    subtitle: "Principled Design",
                    color: "#49243F",
                  },
                  {
                    title: "Tested Quality",
                    subtitle: "Rigorous Verification",
                    color: "#047857",
                  },
                  {
                    title: "True Partnership",
                    subtitle: "Transparent Delivery",
                    color: "#B45309",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      flex: "0 1 auto",
                      minWidth: 0,
                    }}
                  >
                    <div
                      className="about-highlight-title"
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: item.color,
                        lineHeight: 1.4,
                        marginBottom: "0.25rem",
                        whiteSpace: "nowrap",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      className="about-highlight-subtitle"
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--color-text-secondary, #64748B)",
                        lineHeight: 1.5,
                        whiteSpace: "nowrap",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Workspace image and uptime badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
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
              <div
                className="about-story-image"
                style={{
                  width: "100%",
                  height: "clamp(320px, 35vw, 480px)",
                  overflow: "hidden",
                  borderRadius: "24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 20px 45px rgba(30, 41, 59, 0.12)",
                  backgroundColor: "#EEF8FF",
                }}
              >
                <MediaRenderer
                  src={heroWorkspaceImg}
                  alt="Azaroth Tech-Hive workspace"
                  objectFit="cover"
                  loading="lazy"
                />
              </div>

              {/* Uptime information badge */}
              {/* <div
                style={{
                  position: "absolute",
                  right: "1rem",
                  bottom: "0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  maxWidth: "calc(100% - 2rem)",
                  padding: "1rem 1.25rem",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #FFE4E6",
                  borderRadius: "16px",
                  boxShadow: "0 12px 30px rgba(30, 41, 59, 0.12)",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: "#F5EDF3",
                    color: "#49243F",
                  }}
                >
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "#1E293B",
                      lineHeight: 1.4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    99.9% Uptime
                  </div>

                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748B",
                      lineHeight: 1.5,
                    }}
                  >
                    Enterprise Engineering SLA
                  </div>
                </div>
              </div> */}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: OUR VALUES */}
      <section
        id="our-values"
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: "5rem",
          paddingBottom: "5rem",
          scrollMarginTop: "5rem",
          position: "relative",
          borderTop: "1px solid #E2E8F0",
        }}
      >
        <div className="container">
          {/* Values Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: "left",
              maxWidth: "780px",
              margin: "0 0 3rem 0",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-primary, #49243F)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
                fontFamily: "var(--font-body)",
              }}
            >
              &mdash; CORE VALUES &mdash;
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.25rem)",
                fontWeight: 600,
                color: "var(--color-text-primary, #1E293B)",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              Our Core Values
            </h2>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--color-text-secondary, #64748B)",
                lineHeight: 1.7,
                margin: 0,
                textAlign: "justify",
                fontFamily: "var(--font-body)",
              }}
            >
              The principles that guide how we think, engineer, collaborate, and deliver.
            </p>
          </motion.div>

          {/* Values Grid */}
          <div
            className="our-values-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "1.5rem",
            }}
          >
            {valuesPrinciples.map((val: any, index: number) => (
              <motion.div
                key={val.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Card
                  variant="solid"
                  padding="lg"
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.03)",
                    transition: "transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out",
                  }}
                  onMouseEnter={(e) => {
                    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
                    if (!prefersReduced) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 24px -4px rgba(73, 36, 63, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(73, 36, 63, 0.25)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(15, 23, 42, 0.03)";
                    e.currentTarget.style.borderColor = "#E2E8F0";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(73, 36, 63, 0.08)",
                        color: "#49243F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(73, 36, 63, 0.12)",
                        transition: "transform 200ms ease-out",
                      }}
                      onMouseEnter={(e) => {
                        const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
                        if (!prefersReduced) {
                          e.currentTarget.style.transform = "scale(1.06)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "";
                      }}
                    >
                      {getIcon(val.iconName)}
                    </div>

                      {/* <span
                        style={{
                          padding: "0.125rem 0.5rem",
                          borderRadius: "9999px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: "#49243F",
                          backgroundColor: "rgba(73, 36, 63, 0.06)",
                          border: "1px solid rgba(73, 36, 63, 0.1)",
                        }}
                      >
                        {val.number}
                      </span> */}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "var(--color-text-primary, #1E293B)",
                      marginBottom: "0.5rem",
                      lineHeight: 1.3,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {val.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--color-text-secondary, #64748B)",
                      lineHeight: 1.65,
                      flexGrow: 1,
                      margin: 0,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {val.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            #our-values div[style*="grid-template-columns"],
            #our-values div[style*="gridTemplateColumns"] {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 1.25rem !important;
            }
          }

          @media (max-width: 640px) {
            #our-values div[style*="grid-template-columns"],
            #our-values div[style*="gridTemplateColumns"] {
              grid-template-columns: minmax(0, 1fr) !important;
              gap: 1rem !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            #our-values [style*="transition"] {
              transition: none !important;
            }
            #our-values motion.div {
              animation: none !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 3: DELIVERY FRAMEWORK */}
      <section
        id="delivery-framework"
        style={{
          backgroundColor: "#F8FAFC",
          borderTop: "1px solid #E2E8F0",
          paddingTop: "5.5rem",
          paddingBottom: "5.5rem",
          scrollMarginTop: "5rem",
          position: "relative",
        }}
      >
        <div className="container">
          {/* Framework Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: "left",
              maxWidth: "1300px",
              margin: "0 0 3.5rem 0",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-primary, #49243F)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
                fontFamily: "var(--font-body)",
              }}
            >
              &mdash; DISCIPLINED METHODOLOGY &mdash;
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.25rem)",
                fontWeight: 600,
                color: "var(--color-text-primary, #1E293B)",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)",
              }}
            >
              {/* Our Delivery Framework &mdash;{" "} */}
              <span
                style={{
                  background: "var(--gradient-heading)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                A Clear Path from Idea to Impact
              </span>
            </h2>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--color-text-secondary, #64748B)",
                lineHeight: 1.7,
                margin: 0,
                textAlign: "justify",
                fontFamily: "var(--font-body)",
              }}
            >
              A structured, collaborative approach that brings clarity to every
              stage of software development, ensuring solutions remain aligned
              with project goals, built on sound engineering practices, and
              adaptable to evolving needs.
            </p>
          </motion.div>

          {/* Interactive Process Stepper */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProcessTimeline />
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .about-story-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 2.5rem !important;
          }

          .about-highlights {
            flex-wrap: wrap !important;
            gap: 1.25rem !important;
            padding: 1.25rem !important;
          }

          .about-highlight-title,
          .about-highlight-subtitle {
            white-space: normal !important;
          }

          .about-story-image {
            height: clamp(300px, 45vw, 420px) !important;
          }
        }

        @media (max-width: 640px) {
          .about-highlights {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem !important;
            padding: 1.25rem !important;
          }

          .about-story-image {
            height: 260px !important;
          }
        }
      `}</style>

      {/* Global Conversion Portal */}
      <FinalCTA />
    </div>
  );
};

export default About;
