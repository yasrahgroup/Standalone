import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Users,
  ShieldCheck,
  Workflow,
  Layers,
  Cpu,
} from "lucide-react";
import logoImg from "../../assets/Logo.png";
import { useCMS } from "../../context/CMSContext";

export interface SubNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface NavItem {
  name: string;
  href: string;
  isActive: (pathname: string) => boolean;
  children?: SubNavItem[];
}

export const siteNavItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    isActive: (p) => p === "/",
  },
  {
    name: "Who we are",
    href: "/about",
    isActive: (p) =>
      p.startsWith("/about") ||
      p.startsWith("/values") ||
      p.startsWith("/delivery-framework") ||
      p.startsWith("/who-we-are"),
    children: [
      {
        name: "About Us",
        href: "/about#about-us",
        icon: <Users size={18} style={{ color: "#49243F" }} />,
      },
      {
        name: "Our Values",
        href: "/about#our-values",
        icon: <ShieldCheck size={18} style={{ color: "#49243F" }} />,
      },
      {
        name: "Delivery Framework",
        href: "/about#delivery-framework",
        icon: <Workflow size={18} style={{ color: "#49243F" }} />,
      },
    ],
  },
  {
    name: "Our Portfolio",
    href: "/portfolio",
    isActive: (p) =>
      p.startsWith("/portfolio") ||
      p.startsWith("/products") ||
      p.startsWith("/services") ||
      p.startsWith("/projects"),
    children: [
      {
        name: "Explore Products",
        href: "/products",
        icon: <Layers size={18} style={{ color: "#49243F" }} />,
      },
      {
        name: "Explore Services",
        href: "/services",
        icon: <Cpu size={18} style={{ color: "#49243F" }} />,
      },
    ],
  },
  {
    name: "Resource Hub",
    href: "/resource-hub",
    isActive: (p) =>
      p.startsWith("/resource-hub") ||
      p.startsWith("/technology-insights") ||
      p.startsWith("/insights"),
  },
  // {
  //   name: 'Connect With Us',
  //   href: '/connect-with-us',
  //   isActive: (p) =>
  //     p.startsWith('/connect-with-us') ||
  //     p === '/contact' ||
  //     p === '/connect',
  // },
];

const CRIMSON_DEEP = "#49243F";
const CRIMSON_VIBRANT = "#49243F";
const CRIMSON_ACCENT = "#49243F";

const getStartedButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  padding: "0.625rem 1.4rem",
  borderRadius: "9999px",
  background: "var(--gradient-button)",
  color: "#FFFFFF",
  fontWeight: 600,
  fontSize: "0.9375rem",
  textDecoration: "none",
  border: "none",
  boxShadow: "0 4px 14px 0 rgba(73, 36, 63, 0.35)",
  transition: "all 200ms ease-out",
};

export const Header: React.FC = () => {
  const { settings } = useCMS();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>(
    {
      "Who we are": true,
      "Our Portfolio": true,
    },
  );

  const location = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleMobileAccordion = (name: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        backgroundColor: isScrolled
          ? "rgba(255, 255, 255, 0.98)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid var(--color-border, #E4E4E7)`,
        boxShadow: isScrolled
          ? "0 4px 20px -2px rgba(73, 36, 63, 0.08)"
          : "none",
        transition: "all 200ms ease-out",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          height: "4.75rem",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          id="nav-brand-logo"
          aria-label="Azaroth Tech-Hive home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src={settings?.logoUrl || logoImg}
            alt={settings?.companyName || "Azaroth Tech-Hive Logo"}
            style={{
              maxHeight: "2.5rem",
              maxWidth: "8rem",
              objectFit: "contain",
              flexShrink: 0,
              filter: "drop-shadow(0 2px 4px rgba(73, 36, 63, 0.15))",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: CRIMSON_DEEP,
                fontFamily: "serif",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
              }}
            >
              AZAROTH
            </span>

            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: 700,
                color: "#000000",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              TECH-HIVE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex flex-1 items-center justify-end gap-4 lg:gap-6"
        >
          {siteNavItems.map((item) => {
            const active = item.isActive(location.pathname);
            const isDropdownOpen = activeDropdown === item.name;

            if (item.children && item.children.length > 0) {
              return (
                <div
                  key={item.name}
                  style={{ position: "relative" }}
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <Link
                      to={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-haspopup="true"
                      aria-expanded={isDropdownOpen}
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: active ? 700 : 600,
                        color: active ? CRIMSON_DEEP : "#374151",
                        padding: "0.65rem 0.25rem",
                        textDecoration: "none",
                        position: "relative",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        transition: "color 160ms ease-out",
                      }}
                      className="azaroth-nav-link"
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        size={15}
                        style={{
                          transition: "transform 200ms ease-out",
                          transform: isDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          color: active ? CRIMSON_VIBRANT : "#64748B",
                        }}
                      />

                      {/* Active indicator bar */}
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          bottom: "-2px",
                          left: 0,
                          right: 0,
                          height: "2.5px",
                          background: "#C99B52",
                          borderRadius: "2px",
                          transform: active ? "scaleX(1)" : "scaleX(0)",
                          transformOrigin: "left",
                          transition: "transform 200ms ease-out",
                        }}
                        className="azaroth-nav-indicator"
                      />
                    </Link>
                  </div>

                  {/* Dropdown Menu Overlay */}
                  {isDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: item.name === "Our Portfolio" ? "-1.5rem" : "0",
                        paddingTop: "0.65rem",
                        zIndex: 110,
                        minWidth: "22rem",
                      }}
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "1rem",
                          border: "1px solid #E4E4E7",
                          boxShadow:
                            "0 20px 40px -15px rgba(73, 36, 63, 0.15), 0 0 0 1px rgba(0,0,0,0.03)",
                          padding: "0.65rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                          backdropFilter: "blur(20px)",
                        }}
                        className="azaroth-dropdown-menu"
                      >
                        {item.children.map((sub) => {
                          const isSubActive =
                            location.pathname === sub.href ||
                            (sub.href.includes("#") &&
                              location.pathname === sub.href.split("#")[0] &&
                              (location.hash === `#${sub.href.split("#")[1]}` ||
                                (!location.hash &&
                                  sub.href.endsWith("#about-us"))));
                          return (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              onClick={() => {
                                setActiveDropdown(null);
                                if (sub.href.includes("#")) {
                                  const [targetPath, hash] =
                                    sub.href.split("#");
                                  if (location.pathname === targetPath) {
                                    const elem = document.getElementById(hash);
                                    if (elem) {
                                      elem.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                      });
                                      window.history.pushState(
                                        null,
                                        "",
                                        `#${hash}`,
                                      );
                                    }
                                  }
                                }
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.8rem 0.85rem",
                                minHeight: "3.25rem",
                                boxSizing: "border-box",
                                borderRadius: "0.625rem",
                                textDecoration: "none",
                                backgroundColor: isSubActive
                                  ? "rgba(73, 36, 63, 0.08)"
                                  : "transparent",
                                transition: "background-color 160ms ease-out",
                              }}
                              className="azaroth-dropdown-item"
                            >
                              <div
                                style={{
                                  width: "2.25rem",
                                  height: "2.25rem",
                                  borderRadius: "8px",
                                  backgroundColor: isSubActive
                                    ? "rgba(73, 36, 63, 0.16)"
                                    : "#FDF2F4",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                {sub.icon}
                              </div>
                              <span
                                style={{
                                  fontSize: "0.9rem",
                                  fontWeight: 700,
                                  color: isSubActive ? CRIMSON_DEEP : "#18181B",
                                  lineHeight: 1.4,
                                }}
                                className="dropdown-item-title"
                              >
                                {sub.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                aria-current={active ? "page" : undefined}
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: active ? 700 : 600,
                  color: active ? CRIMSON_DEEP : "#374151",
                  padding: "0.65rem 0.25rem",
                  textDecoration: "none",
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "color 160ms ease-out",
                }}
                className="azaroth-nav-link"
              >
                <span>{item.name}</span>

                {/* Gold navigation indicator */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    left: 0,
                    right: 0,
                    height: "2.5px",
                    background: "#C99B52",
                    borderRadius: "2px",
                    transform: active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 200ms ease-out",
                  }}
                  className="azaroth-nav-indicator"
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            flexShrink: 0,
          }}
        >
          <Link
            to="/connect-with-us"
            style={getStartedButtonStyle}
            className="hover:opacity-95 hover:shadow-lg hover:scale-105"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--gradient-button-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--gradient-button)";
            }}
          >
            <span>Connect With Us</span>
            <ArrowRight size={15} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-rose-200 bg-white text-rose-950"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            top: "4.75rem",
            backgroundColor: "rgba(31, 41, 55, 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav
            id="mobile-navigation"
            aria-label="Mobile Navigation"
            style={{
              backgroundColor: "#FFFFFF",
              padding: "1.25rem",
              borderBottom: `2px solid ${CRIMSON_VIBRANT}`,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.12)",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              maxHeight: "calc(100vh - 4.75rem)",
              overflowY: "auto",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {siteNavItems.map((item) => {
              const active = item.isActive(location.pathname);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = mobileExpanded[item.name];

              if (hasChildren) {
                return (
                  <div
                    key={item.name}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        backgroundColor: active
                          ? "rgba(73, 36, 63, 0.06)"
                          : "transparent",
                        borderLeft: active
                          ? `3px solid ${CRIMSON_ACCENT}`
                          : "3px solid transparent",
                      }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          fontWeight: active ? 700 : 600,
                          fontSize: "1rem",
                          color: active ? CRIMSON_DEEP : "#1F2937",
                          textDecoration: "none",
                          flex: 1,
                        }}
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleMobileAccordion(item.name)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "0.25rem 0.5rem",
                          cursor: "pointer",
                          color: "#64748B",
                          display: "flex",
                          alignItems: "center",
                        }}
                        aria-label={`Toggle ${item.name} submenu`}
                      >
                        <ChevronDown
                          size={18}
                          style={{
                            transition: "transform 200ms ease-out",
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </button>
                    </div>

                    {/* Accordion Sub-items */}
                    {isExpanded && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem",
                          paddingLeft: "1.25rem",
                          paddingTop: "0.35rem",
                          paddingBottom: "0.35rem",
                          borderLeft: "2px dashed #FECDD3",
                          marginLeft: "1.25rem",
                        }}
                      >
                        {item.children?.map((sub) => {
                          const isSubActive =
                            location.pathname === sub.href ||
                            (sub.href.includes("#") &&
                              location.pathname === sub.href.split("#")[0] &&
                              (location.hash === `#${sub.href.split("#")[1]}` ||
                                (!location.hash &&
                                  sub.href.endsWith("#about-us"))));
                          return (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                if (sub.href.includes("#")) {
                                  const [targetPath, hash] =
                                    sub.href.split("#");
                                  if (location.pathname === targetPath) {
                                    const elem = document.getElementById(hash);
                                    if (elem) {
                                      elem.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                      });
                                      window.history.pushState(
                                        null,
                                        "",
                                        `#${hash}`,
                                      );
                                    }
                                  }
                                }
                              }}
                              style={{
                                padding: "0.55rem 0.75rem",
                                borderRadius: "6px",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.625rem",
                                backgroundColor: isSubActive
                                  ? "rgba(73, 36, 63, 0.1)"
                                  : "transparent",
                                color: isSubActive
                                  ? CRIMSON_VIBRANT
                                  : "#4B5563",
                                fontWeight: isSubActive ? 700 : 500,
                                fontSize: "0.90rem",
                              }}
                            >
                              {sub.icon}
                              <span>{sub.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    fontWeight: active ? 700 : 600,
                    fontSize: "1rem",
                    color: active ? CRIMSON_DEEP : "#374151",
                    backgroundColor: active
                      ? "rgba(73, 36, 63, 0.06)"
                      : "transparent",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderLeft: active
                      ? `3px solid ${CRIMSON_ACCENT}`
                      : "3px solid transparent",
                  }}
                >
                  <span>{item.name}</span>

                  {active && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        backgroundColor: CRIMSON_DEEP,
                      }}
                    />
                  )}
                </Link>
              );
            })}

            <div
              style={{
                height: "1px",
                backgroundColor: "var(--color-border, #E4E4E7)",
                margin: "0.75rem 0",
              }}
            />

            <Link
              to="/connect-with-us"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                ...getStartedButtonStyle,
                width: "100%",
                boxSizing: "border-box",
              }}
              className="hover:opacity-90"
            >
              <span>Connect With Us</span>
              <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}

      {/* Theme-matched hover and keyboard focus styles */}
      <style>{`
        .azaroth-nav-link:hover {
          color: ${CRIMSON_DEEP} !important;
        }

        .azaroth-nav-link:hover .azaroth-nav-indicator {
          transform: scaleX(1) !important;
        }

        .azaroth-dropdown-item:hover {
          background-color: rgba(73, 36, 63, 0.08) !important;
        }

        .azaroth-dropdown-item:hover .dropdown-item-title {
          color: ${CRIMSON_ACCENT} !important;
        }

        .azaroth-nav-link:focus-visible,
        .azaroth-rfq-button:focus-visible {
          outline: 3px solid ${CRIMSON_DEEP};
          outline-offset: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .azaroth-nav-link,
          .azaroth-nav-indicator,
          .azaroth-dropdown-menu {
            transition: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
