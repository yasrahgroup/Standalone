import React from "react";
import { Badge } from "../components/common/Badge";
import { Card } from "../components/common/Card";
import { SEOHead } from "../components/common/SEOHead";
import { useCMS } from "../context/CMSContext";

export const PrivacyPolicy: React.FC = () => {
  const { pages } = useCMS();
  const pageData = pages["privacy-policy"];
  const content = pageData?.content || {};

  const title = pageData?.title || "Enterprise Privacy Policy";
  const effectiveDate =
    content.effectiveDate ||
    "Effective Date: October 2026 • Azaroth Tech-Hive Inc.";
  const bodyMarkdown = content.bodyMarkdown;

  return (
    <div>
      <SEOHead
        title={`${title} — Azaroth Tech-Hive`}
        description={
          pageData?.meta_description ||
          "Read the Azaroth Tech-Hive privacy policy covering data collection, usage, protection measures, and your rights regarding personal and corporate information."
        }
        canonicalPath="/privacy-policy"
      />
      <section
        className="section"
        style={{
          backgroundColor: "var(--color-canvas-bg)",
          borderBottom: "1px solid var(--color-border-subtle)",
          paddingBottom: "3.5rem",
        }}
      >
        <div className="container-prose" style={{ textAlign: "center" }}>
          <Badge variant="emerald" style={{ marginBottom: "1rem" }}>
            Statutory Compliance
          </Badge>
          <h1
            style={{
              marginBottom: "1rem",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "var(--color-text-primary)",
            }}
          >
            {title}
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {effectiveDate}
          </p>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-prose">
          <Card
            variant="solid"
            padding="lg"
            style={{
              backgroundColor: "rgba(250, 250, 247, 0.5)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            {bodyMarkdown ? (
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  fontSize: "0.975rem",
                  color: "#334155",
                }}
              >
                {bodyMarkdown}
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  1. Commitment to Data Governance
                </h2>
                <p style={{ marginBottom: "1.5rem", lineHeight: 1.7 }}>
                  Azaroth Tech-Hive ("we", "our", or "us") adheres strictly to
                  enterprise-grade data governance principles, including GDPR
                  (General Data Protection Regulation), SOC 2 Type II, and
                  applicable data localization statutes. We do not sell,
                  license, or monetize proprietary client information or
                  architectural specifications.
                </p>

                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  2. Information Collection & Usage
                </h2>
                <p style={{ marginBottom: "1.5rem", lineHeight: 1.7 }}>
                  Information submitted via our Contact and Engagement
                  portals—including technical architecture notes, work emails,
                  telephone numbers, and corporate affiliations—is utilized
                  solely to formulate architectural scope proposals and
                  facilitate secure communications.
                </p>

                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  3. Zero-Knowledge & AI Safeguards
                </h2>
                <p style={{ marginBottom: "1.5rem", lineHeight: 1.7 }}>
                  Under no circumstances are client specifications, code
                  repositories, or proprietary documents ingested into public
                  artificial intelligence models for training. All AI
                  demonstrations and client evaluation environments operate
                  under zero-data-retention parameters.
                </p>

                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  4. Data Inquiries & Contact
                </h2>
                <p style={{ lineHeight: 1.7 }}>
                  For data protection officer (DPO) inquiries, contact:
                  <br />
                  <strong>Azaroth Tech-Hive Data Governance Office</strong>
                  <br />
                  24, Malaviya Avenue, Thiruvanmiyur, Chennai, India
                  <br />
                  Email: <code>support@azaroth-techhive.com</code>
                </p>
              </>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
};
