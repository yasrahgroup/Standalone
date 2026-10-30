import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Linkedin, Cookie } from "lucide-react";
import logoImg from "../../assets/logo-footer-transparent.png";
import { useCMS } from "../../context/CMSContext";

export const Footer: React.FC = () => {
  const { settings } = useCMS();

  // Ignore the legacy "/Logo.png" override so the bundled brand logo is used.
  const cmsLogo = settings?.logoUrl;
  const brandIcon = cmsLogo && cmsLogo !== "/logo-footer.png" ? cmsLogo : logoImg;

  const phone = settings?.phone || settings?.primary_phone || "+974 1234 5678";
  const email =
    settings?.supportEmail ||
    settings?.primary_email ||
    "hello@azaroth-techhive.com";
  const address =
    settings?.headquarters || settings?.headquarters_address || "Doha, Qatar";
  const copyright =
    settings?.copyright_text || "All rights reserved © 2026 Azaroth Tech-Hive ";
  const isReversed = (settings?.footerLayout || "standard") === "reversed";

  // Social Icons Component
  const socialIcons = (
    <div style={{ marginTop: "1.25rem" }}>
      <div
        style={{
          fontSize: "0.8125rem",
          color: "#CBD5E1",
          fontWeight: 600,
          marginBottom: "0.75rem",
        }}
      >
        Follow Us On:
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <a
          href={settings?.linkedinUrl || "https://linkedin.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#CBD5E1",
            transition: "all 160ms",
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Linkedin size={15} />
        </a>
        {/* 
        <a
          href={settings?.twitterUrl || "https://x.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="X (formerly Twitter)"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 160ms',
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Twitter size={15} />
        </a>

        <a
          href={(settings as any)?.facebookUrl || "https://facebook.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 160ms',
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Facebook size={15} />
        </a>

        <a
          href={(settings as any)?.instagramUrl || "https://instagram.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 160ms',
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Instagram size={15} />
        </a>

        <a
          href={(settings as any)?.youtubeUrl || "https://youtube.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="YouTube"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 160ms',
          }}
          className="hover:border-rose-400 hover:text-rose-400"
        >
          <Youtube size={15} />
        </a> */}
      </div>
    </div>
  );

  // 1. Brand Logo, Tagline & Follow Us Column
  const brandColumn = (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
          marginBottom: "clamp(1rem, 2.5vw, 1.25rem)",
        }}
      >
        <img
          src={brandIcon}
          alt="Azaroth Tech-Hive Logo"
          style={{
            maxHeight: "clamp(3.5rem, 6vw, 2.5rem)",
            maxWidth: "clamp(6rem, 15vw, 8rem)",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 4px rgba(73, 36, 63, 0.15))",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              fontWeight: 700,
             color: "#ffffff",
              fontFamily: "serif",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}
          >
            AZAROTH
          </span>
          <span
            style={{
              fontSize: "clamp(0.5rem, 1.2vw, 0.625rem)",
              fontWeight: 600,
              color: "var(--color-brand-gold, #C99B52)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            TECH-HIVE
          </span>
        </div>
      </div>  
      {socialIcons}
    </div>
  );

  // 2. Quick Links Column (Updated with Explore Products & Explore Services per diagram)
  const quickLinksColumn = (
    <div key="col-quicklinks" style={{ minWidth: 0 }}>
      <h4
        style={{
          fontSize: "clamp(0.9375rem, 2vw, 1rem)",
          fontWeight: 600,
          color: "#FFFFFF",
          marginBottom: "clamp(0.75rem, 2vw, 1rem)",
          letterSpacing: "0.02em",
        }}
      >
        Quick Links
      </h4>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.5rem, 1.2vw, 0.625rem)",
        }}
      >
        <li>
          <Link
            to="/portfolio#products"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "clamp(0.8125rem, 1.8vw, 0.875rem)",
              transition: "color 160ms",
            }}
            className="hover:text-rose-400"
          >
            Explore Products
          </Link>
        </li>
        <li>
          <Link
            to="/portfolio#services"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "clamp(0.8125rem, 1.8vw, 0.875rem)",
              transition: "color 160ms",
            }}
            className="hover:text-rose-400"
          >
            Explore Services
          </Link>
        </li>
        <li>
          <Link
            to="/resource-hub"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "clamp(0.8125rem, 1.8vw, 0.875rem)",
              transition: "color 160ms",
            }}
            className="hover:text-rose-400"
          >
            Resource Hub
          </Link>
        </li>
      
      </ul>
    </div>
  );

  // 3. Contact Us Column
  const contactColumn = (
    <div key="col-contact" style={{ minWidth: 0 }}>
      <h4
        style={{
          color: "#FFFFFF",
          fontSize: "clamp(0.875rem, 2vw, 0.9375rem)",
          fontWeight: 600,
          marginBottom: "clamp(0.875rem, 2.5vw, 1.25rem)",
        }}
      >
        Contact Us
      </h4>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.625rem, 1.5vw, 0.875rem)",
          fontSize: "clamp(0.8125rem, 1.8vw, 0.875rem)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <Phone size={15} style={{ color: "#ffffff", flexShrink: 0 }} />
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            style={{ color: "#FFFFFF", textDecoration: "none" }}
            className="hover:text-white"
          >
            {phone}
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <Mail size={15} style={{ color: "#ffffff", flexShrink: 0 }} />
          <a
            href={`mailto:${email}`}
            style={{ color: "#FFFFFF", textDecoration: "none" }}
            className="hover:text-white"
          >
            {email}
          </a>
        </div>

        <div
          style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}
        >
          <MapPin
            size={15}
            style={{ color: "#ffffff", flexShrink: 0, marginTop: "0.2rem" }}
          />
          <span style={{ color: "#FFFFFF", lineHeight: 1.5 }}>{address}</span>
        </div>
      </div>
    </div>
  );

  // 3-Column Distribution matching user diagram: [Contact Us, Quick Links, Brand with Follow Us]
  const footerColumns = isReversed
    ? [contactColumn, quickLinksColumn, brandColumn]
    : [brandColumn, quickLinksColumn, contactColumn];

  return (
    <footer
      style={{
        backgroundColor: "#0A1118",
        color: "#FFFFFF",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        position: "relative",
        overflow: "hidden",
      }}
      id="site-footer"
    >

      <div
        className="container"
        style={{
          paddingTop: "4.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            marginBottom: "clamp(2rem, 5vw, 3rem)",
          }}
        >
          {footerColumns}
        </div>

        {/* Bottom Bar: Copyright, Legal & Cookies (Admin Portal pill removed per diagram) */}
        <div
          style={{
            paddingTop: "clamp(1.25rem, 3vw, 1.75rem)",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "clamp(0.75rem, 2vw, 1rem)",
            fontSize: "clamp(0.75rem, 1.8vw, 0.8125rem)",
            color: "#64748B",
          }}
        >
          <div style={{ minWidth: 0 }}>{copyright}</div>

          {/* Privacy Policy & Cookies */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(0.5rem, 1.5vw, 1rem)",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/privacy-policy"
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
                transition: "color 160ms ease",
              }}
              className="hover:text-rose-400"
            >
              Privacy Policy
            </Link>

            <span style={{ color: "rgba(255, 255, 255, 0.15)" }}>&bull;</span>

            <Link
              to="/privacy-policy#cookies"
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: "clamp(0.875rem, 1.8vw, 0.9375rem)",
                transition: "color 160ms ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                overflowWrap: "anywhere",
              }}
              className="hover:text-rose-400"
            >
              <Cookie size={13} style={{ opacity: 0.7 }} />
              <span>Cookies</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
