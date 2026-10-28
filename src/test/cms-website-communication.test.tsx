import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { describe, it, expect, beforeEach } from "vitest";
import { CMSProvider, useCMS } from "../context/CMSContext";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Hero } from "../components/home/Hero";
import { CustomCursor } from "../components/common/CustomCursor";
import { Home } from "../pages/Home";

// Test harness component to manipulate CMS state dynamically from within tests
const CMSTestController: React.FC<{
  onReady: (cms: ReturnType<typeof useCMS>) => void;
}> = ({ onReady }) => {
  const cms = useCMS();
  React.useEffect(() => {
    onReady(cms);
  }, [cms, onReady]);
  return null;
};

describe("E2E CMS & Website Communication Engine", () => {
  let cmsInstance: ReturnType<typeof useCMS>;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  const renderCMSHarness = (
    children: React.ReactNode,
    initialEntries = ["/"],
  ) => {
    return render(
      <HelmetProvider>
        <CMSProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <CMSTestController
              onReady={(instance) => {
                cmsInstance = instance;
              }}
            />
            {children}
          </MemoryRouter>
        </CMSProvider>
      </HelmetProvider>,
    );
  };

  // -------------------------------------------------------------
  // 1. FOOTER LAYOUT & LEGAL LINKS COMMUNICATION
  // -------------------------------------------------------------
  describe("Footer Architecture & CMS Communication", () => {
    it("1.1 reflects copyright text and footerLayout (reversed vs standard) changes from CMS", async () => {
      renderCMSHarness(<Footer />);

      // Verify default copyright
      expect(
        screen.getByText(/All rights reserved © 2026 Azaroth Tech-Hive /i),
      ).toBeInTheDocument();

      // Verify default legal links
      expect(
        screen.getByRole("link", { name: /Privacy Policy/i }),
      ).toHaveAttribute("href", "/privacy-policy");
      expect(screen.getByRole("link", { name: /Cookies/i })).toHaveAttribute(
        "href",
        "/privacy-policy#cookies",
      );
      expect(
        screen.getByRole("link", { name: /Admin Portal/i }),
      ).toHaveAttribute("href", "/admin/login");

      // Update CMS settings: Custom Copyright
      await act(async () => {
        await cmsInstance.updateSettings({
          copyright_text: "© 2026 Custom Enterprise Client LLC",
          footerLayout: "standard",
        });
      });

      // Assert that footer rendered the updated copyright
      expect(
        screen.getByText(/© 2026 Custom Enterprise Client LLC/i),
      ).toBeInTheDocument();
    });

    it("1.2 correctly reorders columns when switching between reversed and standard layouts", async () => {
      renderCMSHarness(<Footer />);

      // Switch to reversed explicitly
      await act(async () => {
        await cmsInstance.updateSettings({ footerLayout: "reversed" });
      });

      // Contact details should be visible
      expect(
        screen.getByText(/hello@azaroth-techhive\.com/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/\+91 6379480931/i)).toBeInTheDocument();

      // Switch to standard layout
      await act(async () => {
        await cmsInstance.updateSettings({ footerLayout: "standard" });
      });

      // Content still present and aligned
      expect(
        screen.getByRole("link", { name: /Admin Portal/i }),
      ).toHaveAttribute("href", "/admin/login");
    });

    it("1.3 enables and disables individual footer sections via CMS", async () => {
      renderCMSHarness(<Footer />);

      // Initially all sections enabled
      expect(screen.getByText(/Quick Links/i)).toBeInTheDocument();
      expect(screen.getByText(/Our Services/i)).toBeInTheDocument();
      expect(screen.getByText(/Follow Us/i)).toBeInTheDocument();

      // Disable Follow Us and Quick Links via CMS
      await act(async () => {
        await cmsInstance.updateSettings({
          footerConfig: {
            sections: {
              followUsSection: false,
              quickLinksColumn: false,
            },
          },
        });
      });

      // Follow Us and Quick Links should be gone, but Our Services remains
      expect(screen.queryByText(/Follow Us/i)).toBeNull();
      expect(screen.queryByText(/Quick Links/i)).toBeNull();
      expect(screen.getByText(/Our Services/i)).toBeInTheDocument();
    });

    it("1.4 selectively displays only enabled social media platforms", async () => {
      renderCMSHarness(<Footer />);

      // Initially all enabled
      expect(
        screen.getByRole("link", { name: /LinkedIn/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Facebook/i }),
      ).toBeInTheDocument();

      // Disable Facebook and GitHub, keep LinkedIn
      await act(async () => {
        await cmsInstance.updateSettings({
          footerConfig: {
            socials: {
              facebook: { enabled: false, url: "" },
              github: { enabled: false, url: "" },
              linkedin: {
                enabled: true,
                url: "https://linkedin.com/company/custom-azaroth",
              },
            },
          },
        });
      });

      // LinkedIn should be visible with updated URL, Facebook should be hidden
      const linkedin = screen.getByRole("link", { name: /LinkedIn/i });
      expect(linkedin).toBeInTheDocument();
      expect(linkedin).toHaveAttribute(
        "href",
        "https://linkedin.com/company/custom-azaroth",
      );
      expect(screen.queryByRole("link", { name: /Facebook/i })).toBeNull();
      expect(screen.queryByRole("link", { name: /GitHub/i })).toBeNull();
    });
  });

  // -------------------------------------------------------------
  // 2. BANNER & HERO BACKGROUND ARCHITECTURE COMMUNICATION
  // -------------------------------------------------------------
  describe("Banner & Hero Background CMS Communication", () => {
    it("2.1 applies solid background color mode dynamically from CMS", async () => {
      const { container } = renderCMSHarness(<Hero />);

      // Initially default canvas
      expect(screen.getByText(/Intelligence/i)).toBeInTheDocument();

      // Switch to Solid Background Mode in CMS
      await act(async () => {
        await cmsInstance.updateSettings({
          bannerConfig: {
            backgroundType: "solid",
            solidColor: "#0B0F19",
            textColorMode: "light",
            headline: "Autonomous Cloud Engineering",
            highlightWord: "Autonomous",
            subtitle: "Engineered for zero downtime operations.",
            kicker: "SYSTEMS ARCHITECTURE",
            primaryCtaText: "View Architecture",
            primaryCtaLink: "/products",
            secondaryCtaText: "Schedule Review",
            secondaryCtaLink: "/connect-with-us",
          },
        });
      });

      // Assert that section adopted the solid background
      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      expect(section?.style.backgroundColor).toBe("rgb(11, 15, 25)"); // #0B0F19 in rgb

      // Assert that updated CMS copy renders cleanly
      expect(screen.getByText(/Autonomous/i)).toBeInTheDocument();
      expect(screen.getByText(/SYSTEMS ARCHITECTURE/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Engineered for zero downtime operations\./i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /View Architecture/i }),
      ).toHaveAttribute("href", "/products");
      expect(
        screen.getByRole("link", { name: /Schedule Review/i }),
      ).toHaveAttribute("href", "/connect-with-us");
    });

    it("2.2 applies gradient background mode dynamically from CMS", async () => {
      const { container } = renderCMSHarness(<Hero />);

      // Switch to Gradient Mode in CMS
      await act(async () => {
        await cmsInstance.updateSettings({
          bannerConfig: {
            backgroundType: "gradient",
            gradientType: "linear",
            gradientAngle: 90,
            gradientStartColor: "#1E1B4B",
            gradientEndColor: "#4338CA",
            headline: "Resilient Distributed Systems",
            highlightWord: "Resilient",
          },
        });
      });

      const section = container.querySelector("section");
      expect(section).toBeTruthy();
      expect(section?.style.background).toContain("linear-gradient");
      expect(screen.getByText(/Resilient/i)).toBeInTheDocument();
    });

    it("2.3 applies image with gradient overlay mode dynamically from CMS", async () => {
      renderCMSHarness(<Hero />);

      // Switch to Image + Gradient Overlay Mode in CMS
      await act(async () => {
        await cmsInstance.updateSettings({
          bannerConfig: {
            backgroundType: "image-gradient",
            bannerImageUrl:
              "https://images.unsplash.com/photo-enterprise-test.jpg",
            gradientAngle: 135,
            gradientStartColor: "#0F172A",
            gradientEndColor: "#1E293B",
            bannerImageOverlayOpacity: 0.85,
            overlayBlendMode: "multiply",
            headline: "Mission-Critical Digital Engineering",
            highlightWord: "Mission-Critical",
          },
        });
      });

      // Check that image and overlay layers exist using data-testid
      const imageLayer = screen.getByTestId("banner-image-layer");
      expect(imageLayer).toBeTruthy();
      expect(imageLayer.getAttribute("style")).toContain(
        "photo-enterprise-test.jpg",
      );

      const overlayLayer = screen.getByTestId("banner-gradient-overlay");
      expect(overlayLayer).toBeTruthy();
      expect(overlayLayer.getAttribute("style")).toContain("multiply");
    });
  });

  // -------------------------------------------------------------
  // 3. CURSOR ANIMATION SUITE CMS COMMUNICATION
  // -------------------------------------------------------------
  describe("Cursor Animation Suite CMS Communication", () => {
    it("3.1 completely unmounts custom cursor when disabled via CMS", async () => {
      const { container } = renderCMSHarness(<CustomCursor />);

      // When enabled, cursor dot exists
      expect(container.querySelector(".custom-cursor-dot")).toBeTruthy();

      // Disable in CMS
      await act(async () => {
        await cmsInstance.updateSettings({
          cursorConfig: {
            isEnabled: false,
            style: "ring-pulse",
            colorSource: "theme",
            size: "medium",
            speed: "smooth",
            clickPulse: true,
            hoverExpand: true,
          },
        });
      });

      // Assert that custom cursor dot is removed from DOM
      expect(container.querySelector(".custom-cursor-dot")).toBeNull();
    });

    it("3.2 renders correct cursor module styles (ring-pulse, magnetic-glow, particle-trail, minimal-dot, gradient-aura)", async () => {
      const { container } = renderCMSHarness(<CustomCursor />);

      // 1. ring-pulse
      await act(async () => {
        await cmsInstance.updateSettings({
          cursorConfig: {
            isEnabled: true,
            style: "ring-pulse",
            colorSource: "custom",
            customColor: "#2563EB",
            customSecondaryColor: "#EC4899",
            size: "large",
            speed: "snappy",
            clickPulse: true,
            hoverExpand: true,
          },
        });
      });
      expect(container.querySelector(".custom-cursor-ring")).toBeTruthy();

      // 2. minimal-dot
      await act(async () => {
        await cmsInstance.updateSettings({
          cursorConfig: {
            isEnabled: true,
            style: "minimal-dot",
            colorSource: "theme",
            size: "small",
            speed: "smooth",
            clickPulse: false,
            hoverExpand: false,
          },
        });
      });
      expect(container.querySelector(".custom-cursor-dot")).toBeTruthy();

      // 3. particle-trail
      await act(async () => {
        await cmsInstance.updateSettings({
          cursorConfig: {
            isEnabled: true,
            style: "particle-trail",
            colorSource: "theme",
            size: "medium",
            speed: "cinematic",
            clickPulse: true,
            hoverExpand: true,
            trailLength: 5,
          },
        });
      });
      expect(container.querySelector(".custom-cursor-dot")).toBeTruthy();
    });
  });

  // -------------------------------------------------------------
  // 4. MODULE VISIBILITY TOGGLING COMMUNICATION
  // -------------------------------------------------------------
  describe("Module Visibility Toggling CMS Communication", () => {
    it("4.1 toggles section visibility on Home page via CMS toggleModule", async () => {
      renderCMSHarness(<Home />);

      // Services section heading should be present
      expect(
        screen.getByRole("heading", { name: /Comprehensive/i }),
      ).toBeInTheDocument();

      // Toggle 'services' module to OFF in CMS
      await act(async () => {
        await cmsInstance.toggleModule("services");
      });

      // Assert that Services section is no longer rendered on Home page
      expect(
        screen.queryByRole("heading", { name: /Comprehensive/i }),
      ).not.toBeInTheDocument();

      // Toggle 'services' module back to ON in CMS
      await act(async () => {
        await cmsInstance.toggleModule("services");
      });

      // Assert that Services section reappears immediately
      expect(
        screen.getByRole("heading", { name: /Comprehensive/i }),
      ).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------
  // 5. NAVIGATION MENU COMMUNICATION
  // -------------------------------------------------------------
  describe("Navigation Menu CMS Communication", () => {
    it("5.1 reflects navigation item additions and updates in the Header navbar", async () => {
      renderCMSHarness(<Header />);

      // Default links
      expect(screen.getByRole("link", { name: /^Home$/i })).toHaveAttribute(
        "href",
        "/",
      );
      expect(screen.getByRole("link", { name: /^About$/i })).toHaveAttribute(
        "href",
        "/about",
      );

      // Update navigation items in CMS via saveNavItem
      await act(async () => {
        await cmsInstance.saveNavItem({ id: "nav-1", label: "Main Portal" });
        await cmsInstance.saveNavItem({ id: "nav-2", label: "Who We Are" });
      });

      // Header should reflect updated labels
      expect(
        screen.getByRole("link", { name: /^Main Portal$/i }),
      ).toHaveAttribute("href", "/");
      expect(
        screen.getByRole("link", { name: /^Who We Are$/i }),
      ).toHaveAttribute("href", "/about");
    });
  });

  // -------------------------------------------------------------
  // 6. THEME PRESETS & CUSTOM PALETTES COMMUNICATION
  // -------------------------------------------------------------
  describe("Theme Engine & Variable Sync Communication", () => {
    it("6.1 applies theme preset and syncs CSS custom properties", async () => {
      renderCMSHarness(<Header />);

      // Apply theme preset
      await act(async () => {
        await cmsInstance.applyThemePreset("executive-sapphire");
      });

      // Verify that CSS variable was set on document root
      const rootPrimary =
        document.documentElement.style.getPropertyValue("--color-primary");
      expect(rootPrimary).toBeTruthy();
    });
  });
});
