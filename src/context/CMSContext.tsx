// src/context/CMSContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  cmsService,
  WebsiteSettings,
  ThemeConfig,
  WebsiteModuleSetting,
  NavigationItem,
  CmsProduct,
  CmsService,
  CmsPortfolio,
  CmsInsight,
  CmsTestimonial,
  CmsEnquiry,
  CmsRfq,
  ChatbotConfig,
} from "../services/cmsService";

// Default static fallbacks for high-availability offline resiliency
import {
  companyInfo,
  companyVisionMission,
  ourValuesPrinciples,
} from "../data/companyData";
import { productsCatalog } from "../data/productsData";
import { serviceOfferings } from "../data/servicesData";
import { insightsArticles } from "../data/insightsData";
import { getPresetByKey } from "../data/themePresets";

export const defaultChatbot: ChatbotConfig = {
  isEnabled: true,
  botName: "Azaroth AI Guide",
  botRole: "Automated engineering assistant",
  welcomeMessage:
    "Hello! I'm the automated Azaroth site guide. Ask me about our platforms, engineering services or how to reach the team.",
  quickPrompts: [
    "Explore Products",
    "Explore Services",
    "Request a Quote",
    "Connect With Us",
  ],
  supportEmail: companyInfo.headquarters.email,
  supportPhone: companyInfo.headquarters.phone,
  position: "bottom-right",
  primaryColor: "#49243F",
  secondaryColor: "#35182E",
};

export const defaultModules: WebsiteModuleSetting[] = [
  {
    id: "mod-products",
    name: "Software Products & Platforms",
    slug: "products",
    path: "/products",
    isEnabled: true,
    order: 1,
    description:
      "Software platforms catalog, specifications, and architecture details.",
  },
  {
    id: "mod-services",
    name: "Enterprise Services & Engineering",
    slug: "services",
    path: "/services",
    isEnabled: true,
    order: 2,
    description:
      "Dedicated engineering pods, architecture modernization, and enterprise SLAs.",
  },
  {
    id: "mod-insights",
    name: "Technology Insights & Publications",
    slug: "insights",
    path: "/technology-insights",
    isEnabled: true,
    order: 3,
    description:
      "Technical whitepapers, architecture articles, and engineering blogs.",
  },
  {
    id: "mod-portfolio",
    name: "Case Studies & Client Portfolio",
    slug: "portfolio",
    path: "/portfolio",
    isEnabled: true,
    order: 4,
    description:
      "Enterprise client project showcases, technical outcomes, and metrics.",
  },
  {
    id: "mod-testimonials",
    name: "Client Testimonials & Endorsements",
    slug: "testimonials",
    path: "/testimonials",
    isEnabled: true,
    order: 5,
    description: "Executive reviews and verified client endorsements.",
  },
  {
    id: "mod-about",
    name: "About Azaroth & Leadership",
    slug: "about",
    path: "/about",
    isEnabled: true,
    order: 6,
    description: "Corporate history, vision, mission, and leadership pillars.",
  },
  {
    id: "mod-methodology",
    name: "Delivery Framework & Methodology",
    slug: "delivery-framework",
    path: "/delivery-framework",
    isEnabled: true,
    order: 7,
    description: "Four-phase zero-downtime engineering delivery lifecycle.",
  },
  {
    id: "mod-values",
    name: "Core Principles & Values",
    slug: "values",
    path: "/values",
    isEnabled: true,
    order: 8,
    description:
      "Engineering discipline and architectural transparency principles.",
  },
  {
    id: "mod-connect",
    name: "Connect & Consultation Form",
    slug: "connect",
    path: "/connect-with-us",
    isEnabled: true,
    order: 9,
    description: "Direct contact portal and consultation scheduling.",
  },
];

export const defaultTheme: ThemeConfig = {
  primaryColor: "#49243F", // Brand Plum
  secondaryColor: "#C99B52", // Antique Gold
  accentColor: "#8A315D", // Vibrant Berry
  backgroundColor: "#FAF8F4", // Warm Cream Canvas
  textColor: "#2B232D", // Ink Plum Text
  borderColor: "#E3DACF", // Warm Sand Border
  preset: "plum-heritage",
};

const defaultSettings: WebsiteSettings = {
  id: "global",
  companyName: companyInfo.name,
  tagline: companyInfo.tagline,
  supportEmail: companyInfo.headquarters.email,
  phone: companyInfo.headquarters.phone,
  headquarters: companyInfo.headquarters.address,
  linkedinUrl: "https://linkedin.com/company/azaroth-tech-hive",
  twitterUrl: "https://twitter.com/azarothtech",
  githubUrl: "https://github.com/azaroth-tech",
  metaTitle:
    "Azaroth Tech-Hive — Enterprise Technology Solutions & Engineering",
  metaDescription: companyInfo.description,
  logoUrl: "",
  themeConfig: defaultTheme,
  modulesConfig: defaultModules,
  chatbotConfig: defaultChatbot,
  primary_color: defaultTheme.primaryColor,
  secondary_color: defaultTheme.secondaryColor,
  accent_color: defaultTheme.accentColor,
  background_color: defaultTheme.backgroundColor,
  headquarters_address: companyInfo.headquarters.address,
  primary_phone: companyInfo.headquarters.phone,
  primary_email: companyInfo.headquarters.email,
  whatsapp_number: companyInfo.headquarters.whatsapp,
  linkedin_url: "https://linkedin.com/company/azaroth-tech-hive",
  copyright_text: "All rights reserved © 2026 Azaroth Tech-Hive ",
  footerLayout: "reversed",
};

const defaultNavigation: NavigationItem[] = [
  { id: "nav-1", label: "Home", path: "/", order: 1, isVisible: true },
  {
    id: "nav-2",
    label: "Who we are",
    path: "/about",
    order: 2,
    isVisible: true,
  },
  {
    id: "nav-3",
    label: "Our Portfolio",
    path: "/portfolio",
    order: 3,
    isVisible: true,
  },
  {
    id: "nav-4",
    label: "Resource Hub",
    path: "/resource-hub",
    order: 4,
    isVisible: true,
  },
  {
    id: "nav-5",
    label: "Testimonials",
    path: "/testimonials",
    order: 5,
    isVisible: true,
  },
  {
    id: "nav-6",
    label: "Connect With Us",
    path: "/connect-with-us",
    order: 6,
    isVisible: true,
  },
];

const defaultPages: Record<string, any> = {
  home: {
    hero: {
      // badge: 'Engineering Tomorrow’s Autonomous Enterprise',
      title: "Enterprise Software Engineering for Complex Systems",
      subtitle:
        "We engineer mission-critical digital systems, resilient microservice ecosystems, high-availability software platforms, and dedicated engineering pods for global enterprises.",
      primaryCtaText: "Explore Our Portfolio",
      primaryCtaLink: "/products",
      secondaryCtaText: "Connect With Us",
      secondaryCtaLink: "/connect-with-us",
      stats: [
        { label: "Uptime Commitment", value: "99.99%" },
        { label: "Engineering Principles", value: "Clean Code" },
        { label: "Architecture Model", value: "Zero-Lockin" },
        { label: "Client Collaboration", value: "Dedicated Pods" },
      ],
    },
    productsSection: {
      badge: "Our Software Platforms",
      title: "Scalable Platforms Built for Enterprise Demands",
      subtitle:
        "Pre-architected, enterprise-ready software engines designed for rapid customization and modular integration.",
    },
    servicesSection: {
      badge: "Enterprise Services",
      title: "Disciplined Engineering Solutions Across the Lifecycle",
      subtitle:
        "From legacy modernization to high-velocity pod scaling, our engineering practices deliver dependability.",
    },
    aboutSection: {
      badge: "Engineering Philosophy",
      title: "Turning Complex Challenges Into Reliable Software",
      description: companyInfo.description,
    },
    faqSection: {
      badge: "Frequently Asked Questions",
      title: "Clear Answers to Technical & Engagement Questions",
      faqs: [
        {
          question: "What engagement models does Azaroth Tech-Hive support?",
          answer:
            "We provide flexible engagement structures including Dedicated Engineering Pods, Fixed-Scope Project Milestones, and Strategic Architecture Retainers, all backed by strict IP protection and clear SLAs.",
        },
        {
          question:
            "How do you ensure zero business disruption during modernization?",
          answer:
            "We employ the Strangler Fig pattern with intelligent edge API gateways and automated dual-write synchronization to migrate legacy monoliths domain by domain without interrupting live operations.",
        },
        {
          question:
            "Can your products be deployed on our private enterprise cloud?",
          answer:
            "Yes. All Azaroth software platforms are cloud-agnostic and containerized via Docker and Kubernetes, deployable to AWS, Google Cloud, Azure, or air-gapped on-premise clusters.",
        },
      ],
    },
    finalCta: {
      title: "Ready to Engineer Your Next-Generation Architecture?",
      subtitle:
        "Connect with our principal architects to evaluate your technical roadmap and build systems that scale.",
      primaryCtaText: "Schedule Technical Consultation",
      primaryCtaLink: "/connect-with-us",
      secondaryCtaText: "Explore Products",
      secondaryCtaLink: "/products",
    },
  },
  values: {
    badge: "Our Principles",
    heroTitle: "Principles That Shape Every Solution",
    heroDescription:
      "The foundational values that guide our engineering decisions, client partnerships, and continuous pursuit of excellence in every solution we build.",
    values: ourValuesPrinciples,
  },
  about: {
    badge: "Who We Are",
    heroTitle: "Engineering Practical Software That Drives Sustainable Growth",
    heroDescription:
      "Azaroth Tech-Hive is a forward-thinking software engineering firm partnering with enterprises to simplify complexity, modernize critical infrastructure, and build dependable digital systems.",
    vision: companyVisionMission.vision,
    mission: companyVisionMission.mission,
    pillars: [
      {
        title: "Architectural Discipline",
        description:
          "Sound foundations, modular boundaries, and resilient fault isolation.",
      },
      {
        title: "Predictable Delivery",
        description:
          "Transparent sprint rhythms, automated testing, and clear delivery milestones.",
      },
      {
        title: "Client Centricity",
        description:
          "Direct access to senior engineering leads and dedicated accountability.",
      },
    ],
  },
  "delivery-framework": {
    badge: "Engineering Methodology",
    heroTitle:
      "Disciplined Execution From Architecture to Zero-Downtime Deployment",
    heroDescription:
      "Our four-phase delivery methodology ensures transparent governance, strict quality gates, and predictable milestones for every enterprise project.",
    phases: [
      {
        phase: "01",
        title: "Discovery & Blueprinting",
        description:
          "Domain modeling, architectural evaluation, technical debt inventory, and API contract design.",
      },
      {
        phase: "02",
        title: "Iterative Pod Engineering",
        description:
          "Sprint-based microservices development with automated linting, test suites, and peer reviews.",
      },
      {
        phase: "03",
        title: "Verification & Quality Gates",
        description:
          "Performance load testing, penetration testing, and compliance checklist sign-offs.",
      },
      {
        phase: "04",
        title: "Deployment & Telemetry",
        description:
          "Zero-downtime release pipelines, distributed tracing, and 24/7 observability monitoring.",
      },
    ],
  },
  "privacy-policy": {
    effectiveDate: "October 16, 2026",
    contactEmail: "support@azaroth-techhive.com",
    introduction:
      "Azaroth Tech-Hive is dedicated to protecting the privacy and personal data of our website visitors, clients, and partners. This policy outlines how we collect, process, and safeguard information.",
    sections: [
      {
        heading: "1. Information We Collect",
        body: "We collect information you directly provide to us through contact forms, RFQ submissions, and newsletter signups, including your full name, work email address, telephone number, company name, and project requirements.",
      },
      {
        heading: "2. How We Use Your Information",
        body: "We use the collected information solely to respond to your technical inquiries, prepare proposals, deliver contracted software services, and fulfill our contractual obligations. We never sell your personal data.",
      },
      {
        heading: "3. Data Retention & Security Controls",
        body: "All data is stored in encrypted PostgreSQL databases utilizing industry-standard TLS encryption in transit and AES-256 at rest. Access is strictly limited to authorized administrative personnel.",
      },
      {
        heading: "4. Your Rights (GDPR & International Laws)",
        body: "You retain the right to request access to, rectification of, or erasure of your personal data stored within our systems. Contact our privacy team at support@azaroth-techhive.com for all requests.",
      },
    ],
  },
  "terms-of-service": {
    effectiveDate: "October 16, 2026",
    governingLaw: "Chennai, India",
    introduction:
      "These Terms of Service govern your use of the Azaroth Tech-Hive website, platforms, and software engineering consulting services.",
    sections: [
      {
        heading: "1. Intellectual Property & Ownership",
        body: "All client deliverables and custom software developed under formal Statement of Work (SOW) agreements are transferred entirely to the client upon full payment. Azaroth proprietary framework tools remain property of Azaroth Tech-Hive under non-exclusive licenses.",
      },
      {
        heading: "2. Confidentiality & Non-Disclosure",
        body: "Both parties agree to hold all proprietary trade secrets, architecture designs, business requirements, and client data in strict confidence under binding non-disclosure commitments.",
      },
      {
        heading: "3. Limitation of Liability",
        body: "In no event shall Azaroth Tech-Hive be liable for indirect, incidental, or consequential damages exceeding the fees actually paid for the specific engineering phase in dispute.",
      },
      {
        heading: "4. Dispute Resolution & Jurisdiction",
        body: "These Terms are governed by the laws of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in Chennai, India.",
      },
    ],
  },
};

const defaultProducts: CmsProduct[] = productsCatalog.map((p, idx) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  tagline: p.tagline,
  shortDescription: p.shortDescription,
  fullDescription: p.description,
  coverImage: p.coverImage,
  isFeatured: true,
  status: "PUBLISHED",
  order: idx + 1,
  technologies: ["React", "Node.js", "PostgreSQL", "Cloud Native"],
  benefits: p.benefits,
  badge: p.badge,
  ctaText: "Explore Platform",
  ctaLink: `/products/${p.slug}`,
}));

const defaultServices: CmsService[] = serviceOfferings.map((s, idx) => ({
  id: s.id,
  title: s.title,
  slug: s.slug,
  summary: s.category,
  description: s.description,
  iconName: s.iconName,
  badge: s.badge,
  capabilities: s.capabilities,
  processSteps: [
    {
      step: "01",
      title: "Architecture Assessment",
      desc: "Holistic audit of legacy code and debt.",
    },
    {
      step: "02",
      title: "Target State Blueprints",
      desc: "Design microservices topology.",
    },
    {
      step: "03",
      title: "Incremental Migration",
      desc: "Zero-downtime cutover utilizing gateways.",
    },
  ],
  metrics: {
    deliveryFocus: "Architecture",
    typicalScope: "Platform modernization",
  },
  status: "PUBLISHED",
  order: idx + 1,
  technologies: ["Kubernetes", "TypeScript", "Event Streaming"],
  industries: ["Financial Services", "Healthcare", "Enterprise SaaS"],
  ctaText: "Request Consultation",
  ctaLink: "/connect-with-us",
}));

const defaultInsights: CmsInsight[] = insightsArticles.map((a) => ({
  id: a.id,
  title: a.title,
  slug: a.slug,
  excerpt: a.excerpt,
  content: a.content.join("\n\n"),
  coverImage: "/images/insights/cover-default.jpg",
  authorName: a.author.name,
  authorRole: a.author.role,
  category: a.category,
  tags: a.tags,
  readTime: a.readTime,
  isFeatured: true,
  status: "PUBLISHED",
  publishedAt: a.publishedDate,
}));

const defaultTestimonials: CmsTestimonial[] = [
  {
    id: "test-1",
    clientName: "Ahmed Rahman",
    role: "Chief Executive Officer",
    organization: "NextGen Solutions",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    rating: 5,
    quote:
      "Azaroth Tech-Hive delivered exactly what we needed — a modern, resilient, high-availability architecture with zero business disruption.",
    isFeatured: true,
    order: 1,
  },
  {
    id: "test-2",
    clientName: "Sarah Al-Mansoor",
    role: "Chief Technology Officer",
    organization: "Finova Global",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
    rating: 5,
    quote:
      "The engineering pod Azaroth provided integrated seamlessly into our architecture workflow. Their ability to deliver resilient microservices exceeded all expectations.",
    isFeatured: true,
    order: 2,
  },
  {
    id: "test-3",
    clientName: "Marcus Vance",
    role: "VP of Product Architecture",
    organization: "Aetherius Brands",
    avatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80",
    rating: 5,
    quote:
      "From UX discovery to high-load deployment, the technical rigor Azaroth brought transformed our commerce conversion by 42%.",
    isFeatured: true,
    order: 3,
  },
];

interface CMSContextType {
  settings: WebsiteSettings;
  navigation: NavigationItem[];
  products: CmsProduct[];
  services: CmsService[];
  portfolio: CmsPortfolio[];
  insights: CmsInsight[];
  testimonials: CmsTestimonial[];
  pages: Record<string, any>;
  enquiries: CmsEnquiry[];
  rfqs: CmsRfq[];
  isLoading: boolean;
  isLive: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
  updateSettings: (settings: Partial<WebsiteSettings>) => Promise<void>;
  toggleModule: (slug: string, isEnabled?: boolean) => Promise<void>;
  resetThemeToDefault: () => Promise<void>;
  applyThemePreset: (presetName: string) => Promise<void>;
  reorderNavItems: (fromIndex: number, toIndex: number) => Promise<void>;
  updatePage: (slug: string, data: any, title?: string) => Promise<void>;
  saveProduct: (prod: Partial<CmsProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveService: (serv: Partial<CmsService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  savePortfolio: (port: Partial<CmsPortfolio>) => Promise<void>;
  deletePortfolio: (id: string) => Promise<void>;
  saveInsight: (ins: Partial<CmsInsight>) => Promise<void>;
  deleteInsight: (id: string) => Promise<void>;
  saveTestimonial: (test: Partial<CmsTestimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  saveNavItem: (item: Partial<NavigationItem>) => Promise<void>;
  deleteNavItem: (id: string) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Helper to safely read from localStorage
const getStoredData = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Load initially from localStorage for instantaneous offline/dev resiliency
  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const stored = getStoredData("azaroth_cms_settings", defaultSettings);
    // Seamlessly upgrade from previous emerald-gold or indigo defaults to obsidian-amber
    if (
      stored?.themeConfig?.primaryColor === "#4F46E5" ||
      stored?.themeConfig?.primaryColor === "#006C35" ||
      stored?.themeConfig?.preset === "indigo-gold" ||
      stored?.themeConfig?.preset === "emerald-gold"
    ) {
      stored.themeConfig = defaultTheme;
      stored.primary_color = defaultTheme.primaryColor;
      stored.secondary_color = defaultTheme.secondaryColor;
      stored.accent_color = defaultTheme.accentColor;
      stored.border_color = defaultTheme.borderColor;
      stored.text_color = defaultTheme.textColor;
      localStorage.setItem("azaroth_cms_settings", JSON.stringify(stored));
    }
    return stored;
  });
  const [navigation, setNavigation] = useState<NavigationItem[]>(() =>
    getStoredData("azaroth_cms_navigation", defaultNavigation),
  );
  const [products, setProducts] = useState<CmsProduct[]>(() =>
    getStoredData("azaroth_cms_products", defaultProducts),
  );
  const [services, setServices] = useState<CmsService[]>(() =>
    getStoredData("azaroth_cms_services", defaultServices),
  );
  const [portfolio, setPortfolio] = useState<CmsPortfolio[]>(() =>
    getStoredData("azaroth_cms_portfolio", []),
  );
  const [insights, setInsights] = useState<CmsInsight[]>(() =>
    getStoredData("azaroth_cms_insights", defaultInsights),
  );
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>(() =>
    getStoredData("azaroth_cms_testimonials", defaultTestimonials),
  );
  const [pages, setPages] = useState<Record<string, any>>(() =>
    getStoredData("azaroth_cms_pages", defaultPages),
  );
  const [enquiries, setEnquiries] = useState<CmsEnquiry[]>([]);
  const [rfqs, setRfqs] = useState<CmsRfq[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Apply dynamic branding theme colors to documentElement CSS variables
  const applyThemeVariables = useCallback(
    (theme?: ThemeConfig, currentSettings?: WebsiteSettings) => {
      const root = document.documentElement;
      const primary =
        theme?.primaryColor ||
        currentSettings?.primary_color ||
        defaultTheme.primaryColor!;
      const secondary =
        theme?.secondaryColor ||
        currentSettings?.secondary_color ||
        defaultTheme.secondaryColor!;
      const accent =
        theme?.accentColor ||
        currentSettings?.accent_color ||
        defaultTheme.accentColor!;
      const bg =
        theme?.backgroundColor ||
        currentSettings?.background_color ||
        defaultTheme.backgroundColor!;
      const text =
        theme?.textColor ||
        currentSettings?.text_color ||
        defaultTheme.textColor!;
      const border =
        theme?.borderColor ||
        currentSettings?.border_color ||
        defaultTheme.borderColor!;

      // Helper for contrast determination
      const getContrastText = (hexColor: string) => {
        try {
          const hex = hexColor.replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16) || 0;
          const g = parseInt(hex.substring(2, 4), 16) || 0;
          const b = parseInt(hex.substring(4, 6), 16) || 0;
          const yiq = (r * 299 + g * 587 + b * 114) / 1000;
          return yiq >= 160 ? "#0F172A" : "#FFFFFF";
        } catch {
          return "#FFFFFF";
        }
      };

      const primaryButtonText = getContrastText(primary);
      const goldButtonText = getContrastText(secondary);

      // 1. Primary Colors & Action Buttons
      root.style.setProperty("--color-primary", primary);
      root.style.setProperty("--color-primary-hover", primary);
      root.style.setProperty("--color-primary-button", primary);
      root.style.setProperty("--color-primary-button-hover", primary);
      root.style.setProperty("--color-primary-button-active", primary);
      root.style.setProperty("--color-primary-button-text", primaryButtonText);
      root.style.setProperty("--color-primary-glow", `${primary}35`);
      root.style.setProperty("--color-primary-light", `${primary}14`);
      root.style.setProperty("--color-primary-border", `${primary}35`);
      root.style.setProperty(
        "--shadow-primary-button",
        `0 4px 14px 0 ${primary}35`,
      );
      root.style.setProperty(
        "--shadow-primary-button-lg",
        `0 10px 25px -4px ${primary}45`,
      );
      root.style.setProperty("--color-link-main", primary);
      root.style.setProperty("--color-link-hover", secondary);
      root.style.setProperty("--color-nav-active", primary);
      root.style.setProperty("--color-nav-indicator", secondary);
      root.style.setProperty("--color-brand-primary", primary);
      root.style.setProperty("--color-primary-green", primary);
      root.style.setProperty("--color-brand-emerald", primary);
      root.style.setProperty("--color-brand-violet", primary);
      root.style.setProperty("--color-primary-text", primary);

      // 2. Secondary & Warm Highlights (Kickers, Outline Buttons, Nav Indicator)
      root.style.setProperty("--color-secondary", secondary);
      root.style.setProperty("--color-secondary-hover", secondary);
      root.style.setProperty("--color-brand-gold", secondary);
      root.style.setProperty("--color-brand-gold-text", secondary);
      root.style.setProperty("--color-brand-gold-light", `${secondary}18`);
      root.style.setProperty("--color-brand-gold-border", `${secondary}45`);
      root.style.setProperty("--color-brand-gold-shadow", `${secondary}30`);
      root.style.setProperty("--color-brand-gold-glow", `${secondary}35`);
      root.style.setProperty("--color-brand-gold-hover", secondary);
      root.style.setProperty("--color-gold-button-text", goldButtonText);
      root.style.setProperty("--color-gold-from", secondary);
      root.style.setProperty("--color-premium", secondary);
      root.style.setProperty("--color-kicker", secondary);

      // 3. Accent & Alerts
      root.style.setProperty("--color-accent", accent);
      root.style.setProperty("--color-accent-hover", accent);
      root.style.setProperty("--color-accent-light", `${accent}18`);
      root.style.setProperty("--color-accent-border", `${accent}45`);
      root.style.setProperty("--color-primary-maroon", accent);
      root.style.setProperty("--color-brand-magenta", accent);
      root.style.setProperty("--color-alert", "#A3332B");
      root.style.setProperty("--color-danger", "#A3332B");

      // 4. Background Canvas & Surfaces
      root.style.setProperty("--color-canvas-bg", bg);
      root.style.setProperty("--color-canvas-card", "#FFFFFF");
      root.style.setProperty("--color-canvas-subtle", "#F8FAFC");
      root.style.setProperty(
        "--color-white",
        bg === "#FFFFFF" ? "#FFFFFF" : bg,
      );

      // 5. Typography
      root.style.setProperty("--color-text-primary", text);
      root.style.setProperty("--color-text-secondary", "#475569");
      root.style.setProperty("--color-text-muted", "#64748B");

      // 6. Borders
      root.style.setProperty("--color-border", border);
      root.style.setProperty("--color-border-subtle", border);

      // 7. Dynamic Gradients & Hero Highlights
      root.style.setProperty(
        "--gradient-primary",
        "linear-gradient(110deg, #49243F 0%, #8A315D 55%, #C04472 100%)",
      );
      root.style.setProperty(
        "--gradient-brand",
        "linear-gradient(110deg, #49243F 0%, #8A315D 55%, #C04472 100%)",
      );
      root.style.setProperty(
        "--gradient-hero",
        `linear-gradient(135deg, ${primary} 0%, ${accent || secondary} 100%)`,
      );
      root.style.setProperty(
        "--gradient-focal",
        `linear-gradient(135deg, ${primary} 0%, ${accent} 50%, ${secondary} 100%)`,
      );
    },
    [],
  );

  useEffect(() => {
    applyThemeVariables(settings.themeConfig, settings);
  }, [settings, applyThemeVariables]);

  const refreshContent = useCallback(async () => {
    try {
      const bundle = await cmsService.fetchBundle();
      if (bundle) {
        if (bundle.settings) {
          const mergedSettings: WebsiteSettings = {
            ...defaultSettings,
            ...bundle.settings,
            // Ensure logoUrl, themeConfig, modulesConfig exist
            logoUrl:
              bundle.settings.logoUrl ||
              (bundle.settings.themeConfig as any)?.logoUrl ||
              settings.logoUrl ||
              "",
            themeConfig: {
              ...defaultTheme,
              ...(bundle.settings.themeConfig || {}),
              ...(settings.themeConfig || {}),
            },
            modulesConfig:
              bundle.settings.modulesConfig ||
              (bundle.settings.themeConfig as any)?.modulesConfig ||
              settings.modulesConfig ||
              defaultModules,
            chatbotConfig: {
              ...defaultChatbot,
              ...(settings.chatbotConfig || {}),
              ...(bundle.settings.chatbotConfig || {}),
            },
            headquarters_address:
              bundle.settings.headquarters ||
              bundle.settings.headquarters_address ||
              companyInfo.headquarters.address,
            primary_phone:
              bundle.settings.phone ||
              bundle.settings.primary_phone ||
              companyInfo.headquarters.phone,
            primary_email:
              bundle.settings.supportEmail ||
              bundle.settings.primary_email ||
              companyInfo.headquarters.email,
            whatsapp_number:
              bundle.settings.whatsapp_number ||
              companyInfo.headquarters.whatsapp,
            linkedin_url:
              bundle.settings.linkedinUrl ||
              bundle.settings.linkedin_url ||
              "https://linkedin.com/company/azaroth-tech-hive",
          };
          setSettings(mergedSettings);
          localStorage.setItem(
            "azaroth_cms_settings",
            JSON.stringify(mergedSettings),
          );
        }

        if (bundle.navigation && bundle.navigation.length > 0) {
          setNavigation(bundle.navigation);
          localStorage.setItem(
            "azaroth_cms_navigation",
            JSON.stringify(bundle.navigation),
          );
        }
        if (bundle.products && bundle.products.length > 0) {
          setProducts(bundle.products);
          localStorage.setItem(
            "azaroth_cms_products",
            JSON.stringify(bundle.products),
          );
        }
        if (bundle.services && bundle.services.length > 0) {
          setServices(bundle.services);
          localStorage.setItem(
            "azaroth_cms_services",
            JSON.stringify(bundle.services),
          );
        }
        if (bundle.portfolio && bundle.portfolio.length > 0) {
          setPortfolio(bundle.portfolio);
          localStorage.setItem(
            "azaroth_cms_portfolio",
            JSON.stringify(bundle.portfolio),
          );
        }
        if (bundle.insights && bundle.insights.length > 0) {
          setInsights(bundle.insights);
          localStorage.setItem(
            "azaroth_cms_insights",
            JSON.stringify(bundle.insights),
          );
        }
        if (bundle.testimonials && bundle.testimonials.length > 0) {
          setTestimonials(bundle.testimonials);
          localStorage.setItem(
            "azaroth_cms_testimonials",
            JSON.stringify(bundle.testimonials),
          );
        }
        if (bundle.pages && Object.keys(bundle.pages).length > 0) {
          setPages((prev) => {
            const next = { ...prev, ...bundle.pages };
            localStorage.setItem("azaroth_cms_pages", JSON.stringify(next));
            return next;
          });
        }
        setIsLive(true);
        setError(null);
      }
    } catch (err: any) {
      console.warn(
        "CMS Live sync notice: using resilient cached/fallback data.",
        err.message,
      );
      setIsLive(false);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }

    // Merge inquiries and RFQs from backend and localStorage
    try {
      const [serverEnq, serverRfq] = await Promise.all([
        cmsService.fetchEnquiries().catch(() => []),
        cmsService.fetchRfqs().catch(() => []),
      ]);

      const localEnq: CmsEnquiry[] = getStoredData(
        "azaroth_cms_local_enquiries",
        [],
      );
      const localRfq: CmsRfq[] = getStoredData("azaroth_cms_local_rfqs", []);

      const combinedEnq = [...localEnq, ...(serverEnq || [])];
      const combinedRfq = [...localRfq, ...(serverRfq || [])];

      setEnquiries(combinedEnq);
      setRfqs(combinedRfq);
    } catch {
      // Ignore
    }
  }, [settings.logoUrl, settings.modulesConfig, settings.themeConfig]);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  // Persist updated settings to state, localStorage, and backend
  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    const updated: WebsiteSettings = {
      ...settings,
      ...newSettings,
      themeConfig: {
        ...(settings.themeConfig || defaultTheme),
        ...(newSettings.themeConfig || {}),
      },
      // Keep aliases in sync
      headquarters_address:
        newSettings.headquarters ||
        newSettings.headquarters_address ||
        settings.headquarters_address,
      primary_phone:
        newSettings.phone ||
        newSettings.primary_phone ||
        settings.primary_phone,
      primary_email:
        newSettings.supportEmail ||
        newSettings.primary_email ||
        settings.primary_email,
      linkedin_url:
        newSettings.linkedinUrl ||
        newSettings.linkedin_url ||
        settings.linkedin_url,
      primary_color:
        newSettings.themeConfig?.primaryColor ||
        newSettings.primary_color ||
        settings.primary_color,
      secondary_color:
        newSettings.themeConfig?.secondaryColor ||
        newSettings.secondary_color ||
        settings.secondary_color,
      accent_color:
        newSettings.themeConfig?.accentColor ||
        newSettings.accent_color ||
        settings.accent_color,
      background_color:
        newSettings.themeConfig?.backgroundColor ||
        newSettings.background_color ||
        settings.background_color,
    };

    setSettings(updated);
    localStorage.setItem("azaroth_cms_settings", JSON.stringify(updated));
    applyThemeVariables(updated.themeConfig, updated);

    try {
      await cmsService.updateSettings(updated);
    } catch (err: any) {
      console.warn(
        "Backend settings update notice (saved locally):",
        err.message,
      );
    }
  };

  // Toggle a module on/off from Settings or Nav, synchronizing navigation visibility
  const toggleModule = async (slug: string, isEnabled?: boolean) => {
    const currentModules = settings.modulesConfig || defaultModules;
    const target = currentModules.find((m) => m.slug === slug);
    if (!target) return;

    const nextState = isEnabled !== undefined ? isEnabled : !target.isEnabled;
    const updatedModules = currentModules.map((m) =>
      m.slug === slug ? { ...m, isEnabled: nextState } : m,
    );

    // Synchronize navigation visibility
    const updatedNav = navigation.map((navItem) => {
      if (
        navItem.path === target.path ||
        (target.path !== "/" && navItem.path.startsWith(target.path))
      ) {
        return { ...navItem, isVisible: nextState };
      }
      return navItem;
    });

    setNavigation(updatedNav);
    localStorage.setItem("azaroth_cms_navigation", JSON.stringify(updatedNav));

    await updateSettings({ modulesConfig: updatedModules });

    // Sync individual navigation item to backend
    const matchingNavItem = updatedNav.find((n) => n.path === target.path);
    if (matchingNavItem) {
      try {
        await cmsService.updateNavItem(matchingNavItem.id, matchingNavItem);
      } catch (err) {
        console.warn("Backend nav update deferred:", err);
      }
    }
  };

  const resetThemeToDefault = async () => {
    await updateSettings({
      themeConfig: defaultTheme,
      primary_color: defaultTheme.primaryColor,
      secondary_color: defaultTheme.secondaryColor,
      accent_color: defaultTheme.accentColor,
      background_color: defaultTheme.backgroundColor,
    });
  };

  const applyThemePreset = async (presetKey: string) => {
    const found = getPresetByKey(presetKey);
    const preset: ThemeConfig = found ? found.colors : defaultTheme;

    await updateSettings({
      themeConfig: preset,
      primary_color: preset.primaryColor,
      secondary_color: preset.secondaryColor,
      accent_color: preset.accentColor,
      background_color: preset.backgroundColor,
    });
  };

  const reorderNavItems = async (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= navigation.length ||
      toIndex < 0 ||
      toIndex >= navigation.length
    )
      return;
    const reordered = [...navigation];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavigation(updated);
    localStorage.setItem("azaroth_cms_navigation", JSON.stringify(updated));

    // Save orders asynchronously
    for (const item of updated) {
      try {
        await cmsService.updateNavItem(item.id, item);
      } catch (err) {
        console.warn("Backend nav reorder notice:", err);
      }
    }
  };

  const updatePage = async (slug: string, data: any, title?: string) => {
    setPages((prev) => {
      const next = { ...prev, [slug]: data };
      localStorage.setItem("azaroth_cms_pages", JSON.stringify(next));
      return next;
    });
    try {
      await cmsService.updatePage(slug, data, title);
    } catch (err) {
      console.warn("Backend page update note (saved locally):", err);
    }
  };

  const saveProduct = async (prod: Partial<CmsProduct>) => {
    let nextList: CmsProduct[];
    if (prod.id && products.some((p) => p.id === prod.id)) {
      nextList = products.map((p) =>
        p.id === prod.id ? ({ ...p, ...prod } as CmsProduct) : p,
      );
    } else {
      const newProd: CmsProduct = {
        id: prod.id || `prod-${Date.now()}`,
        name: prod.name || "New Product",
        slug: prod.slug || "new-product",
        tagline: prod.tagline || "",
        shortDescription: prod.shortDescription || "",
        fullDescription: prod.fullDescription || "",
        coverImage: prod.coverImage || "/images/products/fms-cover.jpg",
        isFeatured: prod.isFeatured ?? true,
        status: prod.status || "PUBLISHED",
        order: products.length + 1,
        technologies: prod.technologies || ["React", "Node.js", "PostgreSQL"],
        benefits: prod.benefits || [],
        badge: prod.badge || "Platform",
        ctaText: prod.ctaText || "Explore Solution",
        ctaLink: prod.ctaLink || `/products/${prod.slug || "new-product"}`,
      };
      nextList = [...products, newProd];
    }
    setProducts(nextList);
    localStorage.setItem("azaroth_cms_products", JSON.stringify(nextList));

    try {
      if (prod.id && products.some((p) => p.id === prod.id)) {
        await cmsService.updateProduct(prod.id, prod);
      } else {
        await cmsService.createProduct(prod);
      }
    } catch (err) {
      console.warn("Backend saveProduct note:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    const nextList = products.filter((p) => p.id !== id);
    setProducts(nextList);
    localStorage.setItem("azaroth_cms_products", JSON.stringify(nextList));
    try {
      await cmsService.deleteProduct(id);
    } catch (err) {
      console.warn("Backend deleteProduct note:", err);
    }
  };

  const saveService = async (serv: Partial<CmsService>) => {
    let nextList: CmsService[];
    if (serv.id && services.some((s) => s.id === serv.id)) {
      nextList = services.map((s) =>
        s.id === serv.id ? ({ ...s, ...serv } as CmsService) : s,
      );
    } else {
      const newServ: CmsService = {
        id: serv.id || `serv-${Date.now()}`,
        title: serv.title || "New Service",
        slug: serv.slug || "new-service",
        summary: serv.summary || "Architecture",
        description: serv.description || "",
        iconName: serv.iconName || "Cpu",
        badge: serv.badge || "Enterprise",
        capabilities: serv.capabilities || [],
        processSteps: serv.processSteps || [],
        metrics: serv.metrics || {},
        status: serv.status || "PUBLISHED",
        order: services.length + 1,
        technologies: serv.technologies || [],
        industries: serv.industries || [],
        ctaText: serv.ctaText || "Request Consultation",
        ctaLink: serv.ctaLink || "/connect-with-us",
      };
      nextList = [...services, newServ];
    }
    setServices(nextList);
    localStorage.setItem("azaroth_cms_services", JSON.stringify(nextList));

    try {
      if (serv.id && services.some((s) => s.id === serv.id)) {
        await cmsService.updateService(serv.id, serv);
      } else {
        await cmsService.createService(serv);
      }
    } catch (err) {
      console.warn("Backend saveService note:", err);
    }
  };

  const deleteService = async (id: string) => {
    const nextList = services.filter((s) => s.id !== id);
    setServices(nextList);
    localStorage.setItem("azaroth_cms_services", JSON.stringify(nextList));
    try {
      await cmsService.deleteService(id);
    } catch (err) {
      console.warn("Backend deleteService note:", err);
    }
  };

  const savePortfolio = async (port: Partial<CmsPortfolio>) => {
    let nextList: CmsPortfolio[];
    if (port.id && portfolio.some((p) => p.id === port.id)) {
      nextList = portfolio.map((p) =>
        p.id === port.id ? ({ ...p, ...port } as CmsPortfolio) : p,
      );
    } else {
      const newPort: CmsPortfolio = {
        id: port.id || `port-${Date.now()}`,
        name: port.name || "New Project",
        slug: port.slug || "new-project",
        clientName: port.clientName || "",
        clientType: port.clientType || "Enterprise",
        industry: port.industry || "Technology",
        category: port.category || "Cloud Engineering",
        summary: port.summary || "",
        challenge: port.challenge || "",
        solution: port.solution || "",
        outcomes: port.outcomes || [],
        technologies: port.technologies || [],
        coverImage: port.coverImage || "/images/portfolio/project-1.jpg",
        isFeatured: port.isFeatured ?? true,
        order: portfolio.length + 1,
      };
      nextList = [...portfolio, newPort];
    }
    setPortfolio(nextList);
    localStorage.setItem("azaroth_cms_portfolio", JSON.stringify(nextList));

    try {
      if (port.id && portfolio.some((p) => p.id === port.id)) {
        await cmsService.updatePortfolio(port.id, port);
      } else {
        await cmsService.createPortfolio(port);
      }
    } catch (err) {
      console.warn("Backend savePortfolio note:", err);
    }
  };

  const deletePortfolio = async (id: string) => {
    const nextList = portfolio.filter((p) => p.id !== id);
    setPortfolio(nextList);
    localStorage.setItem("azaroth_cms_portfolio", JSON.stringify(nextList));
    try {
      await cmsService.deletePortfolio(id);
    } catch (err) {
      console.warn("Backend deletePortfolio note:", err);
    }
  };

  const saveInsight = async (ins: Partial<CmsInsight>) => {
    let nextList: CmsInsight[];
    if (ins.id && insights.some((i) => i.id === ins.id)) {
      nextList = insights.map((i) =>
        i.id === ins.id ? ({ ...i, ...ins } as CmsInsight) : i,
      );
    } else {
      const newIns: CmsInsight = {
        id: ins.id || `ins-${Date.now()}`,
        title: ins.title || "New Insight",
        slug: ins.slug || "new-insight",
        excerpt: ins.excerpt || "",
        content: ins.content || "",
        coverImage: ins.coverImage || "/images/insights/cover-default.jpg",
        authorName: ins.authorName || "Principal Architect",
        authorRole: ins.authorRole || "Architecture Lead",
        category: ins.category || "System Architecture",
        tags: ins.tags || ["Technology"],
        readTime: ins.readTime || "5 min read",
        isFeatured: ins.isFeatured ?? true,
        status: ins.status || "PUBLISHED",
        publishedAt: ins.publishedAt || new Date().toISOString(),
      };
      nextList = [newIns, ...insights];
    }
    setInsights(nextList);
    localStorage.setItem("azaroth_cms_insights", JSON.stringify(nextList));

    try {
      if (ins.id && insights.some((i) => i.id === ins.id)) {
        await cmsService.updateInsight(ins.id, ins);
      } else {
        await cmsService.createInsight(ins);
      }
    } catch (err) {
      console.warn("Backend saveInsight note:", err);
    }
  };

  const deleteInsight = async (id: string) => {
    const nextList = insights.filter((i) => i.id !== id);
    setInsights(nextList);
    localStorage.setItem("azaroth_cms_insights", JSON.stringify(nextList));
    try {
      await cmsService.deleteInsight(id);
    } catch (err) {
      console.warn("Backend deleteInsight note:", err);
    }
  };

  const saveTestimonial = async (test: Partial<CmsTestimonial>) => {
    let nextList: CmsTestimonial[];
    if (test.id && testimonials.some((t) => t.id === test.id)) {
      nextList = testimonials.map((t) =>
        t.id === test.id ? ({ ...t, ...test } as CmsTestimonial) : t,
      );
    } else {
      const newTest: CmsTestimonial = {
        id: test.id || `test-${Date.now()}`,
        clientName: test.clientName || "Client Name",
        role: test.role || "Executive",
        organization: test.organization || "Enterprise",
        avatarUrl:
          test.avatarUrl ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
        rating: test.rating || 5,
        quote: test.quote || "",
        isFeatured: test.isFeatured ?? true,
        order: testimonials.length + 1,
      };
      nextList = [...testimonials, newTest];
    }
    setTestimonials(nextList);
    localStorage.setItem("azaroth_cms_testimonials", JSON.stringify(nextList));

    try {
      if (test.id && testimonials.some((t) => t.id === test.id)) {
        await cmsService.updateTestimonial(test.id, test);
      } else {
        await cmsService.createTestimonial(test);
      }
    } catch (err) {
      console.warn("Backend saveTestimonial note:", err);
    }
  };

  const deleteTestimonial = async (id: string) => {
    const nextList = testimonials.filter((t) => t.id !== id);
    setTestimonials(nextList);
    localStorage.setItem("azaroth_cms_testimonials", JSON.stringify(nextList));
    try {
      await cmsService.deleteTestimonial(id);
    } catch (err) {
      console.warn("Backend deleteTestimonial note:", err);
    }
  };

  const saveNavItem = async (item: Partial<NavigationItem>) => {
    let nextList: NavigationItem[];
    if (item.id && navigation.some((n) => n.id === item.id)) {
      nextList = navigation.map((n) =>
        n.id === item.id ? ({ ...n, ...item } as NavigationItem) : n,
      );
    } else {
      const newNav: NavigationItem = {
        id: item.id || `nav-${Date.now()}`,
        label: item.label || "New Link",
        path: item.path || "/",
        order: item.order || navigation.length + 1,
        isVisible: item.isVisible ?? true,
        isExternal: item.isExternal ?? false,
      };
      nextList = [...navigation, newNav];
    }
    setNavigation(nextList);
    localStorage.setItem("azaroth_cms_navigation", JSON.stringify(nextList));

    try {
      if (item.id && navigation.some((n) => n.id === item.id)) {
        await cmsService.updateNavItem(item.id, item);
      } else {
        await cmsService.createNavItem(item);
      }
    } catch (err) {
      console.warn("Backend saveNavItem note:", err);
    }
  };

  const deleteNavItem = async (id: string) => {
    const nextList = navigation.filter((n) => n.id !== id);
    setNavigation(nextList);
    localStorage.setItem("azaroth_cms_navigation", JSON.stringify(nextList));
    try {
      await cmsService.deleteNavItem(id);
    } catch (err) {
      console.warn("Backend deleteNavItem note:", err);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        settings,
        navigation,
        products,
        services,
        portfolio,
        insights,
        testimonials,
        pages,
        enquiries,
        rfqs,
        isLoading,
        isLive,
        error,
        refreshContent,
        updateSettings,
        toggleModule,
        resetThemeToDefault,
        applyThemePreset,
        reorderNavItems,
        updatePage,
        saveProduct,
        deleteProduct,
        saveService,
        deleteService,
        savePortfolio,
        deletePortfolio,
        saveInsight,
        deleteInsight,
        saveTestimonial,
        deleteTestimonial,
        saveNavItem,
        deleteNavItem,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const ctx = useContext(CMSContext);
  if (!ctx) {
    return {
      settings: defaultSettings,
      navigation: defaultNavigation,
      products: defaultProducts,
      services: defaultServices,
      portfolio: [],
      insights: defaultInsights,
      testimonials: defaultTestimonials,
      pages: defaultPages,
      enquiries: [],
      rfqs: [],
      isLoading: false,
      isLive: false,
      error: null,
      refreshContent: async () => {},
      updateSettings: async () => {},
      toggleModule: async () => {},
      resetThemeToDefault: async () => {},
      applyThemePreset: async () => {},
      reorderNavItems: async () => {},
      updatePage: async () => {},
      saveProduct: async () => {},
      deleteProduct: async () => {},
      saveService: async () => {},
      deleteService: async () => {},
      savePortfolio: async () => {},
      deletePortfolio: async () => {},
      saveInsight: async () => {},
      deleteInsight: async () => {},
      saveTestimonial: async () => {},
      deleteTestimonial: async () => {},
      saveNavItem: async () => {},
      deleteNavItem: async () => {},
    };
  }
  return ctx;
};
