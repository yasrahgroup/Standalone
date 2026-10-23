// src/services/cmsService.ts
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  preset?: string;
}

export interface WebsiteModuleSetting {
  id: string;
  name: string;
  slug: string;
  path: string;
  isEnabled: boolean;
  order: number;
  description: string;
}

export interface ChatbotConfig {
  isEnabled: boolean;
  botName: string;
  botRole: string;
  welcomeMessage: string;
  primaryColor?: string;
  secondaryColor?: string;
  quickPrompts?: string[];
  supportEmail?: string;
  supportPhone?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export interface WebsiteSettings {
  id: string;
  companyName: string;
  tagline: string;
  supportEmail: string;
  phone: string;
  headquarters: string;
  linkedinUrl: string;
  twitterUrl: string;
  githubUrl: string;
  metaTitle: string;
  metaDescription: string;
  logoUrl?: string;
  themeConfig?: ThemeConfig;
  modulesConfig?: WebsiteModuleSetting[];
  chatbotConfig?: ChatbotConfig;
  emailConfig?: {
    fromEmail?: string;
    provider?: string;
  };
  // Compatibility aliases
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  text_color?: string;
  border_color?: string;
  headquarters_address?: string;
  primary_phone?: string;
  primary_email?: string;
  whatsapp_number?: string;
  linkedin_url?: string;
  copyright_text?: string;
  footerLayout?: 'standard' | 'reversed';
  footerConfig?: any;
  bannerConfig?: any;
  cursorConfig?: any;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  order: number;
  isVisible: boolean;
  isExternal?: boolean;
}

export interface CmsProduct {
  id: string;
  name: string;
  title?: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  isFeatured: boolean;
  status: 'Live' | 'Under Development' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'INACTIVE';
  order: number;
  technologies: string[];
  benefits: string[];
  badge?: string;
  ctaText: string;
  ctaLink: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsService {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  short_description?: string;
  iconName: string;
  icon_name?: string;
  badge?: string;
  capabilities?: string[];
  processSteps: { step: string; title: string; desc: string }[];
  metrics: Record<string, string>;
  status: 'PUBLISHED' | 'DRAFT';
  order: number;
  technologies: string[];
  industries: string[];
  ctaText: string;
  ctaLink: string;
}

export interface CmsPortfolio {
  id: string;
  name: string;
  title?: string;
  slug: string;
  clientName: string;
  client?: string;
  clientType: string;
  industry: string;
  category: string;
  summary: string;
  description?: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  metrics?: any;
  technologies: string[];
  techStack?: any;
  coverImage: string;
  isFeatured: boolean;
  order: number;
}

export interface CmsInsight {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  authorRole: string;
  author?: { name: string; role: string; avatar?: string };
  category: string;
  tags: string[];
  readTime: string;
  isFeatured: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  publishedAt?: string;
  publishedDate?: string;
}

export interface CmsTestimonial {
  id: string;
  clientName: string;
  role: string;
  organization: string;
  avatarUrl: string;
  rating: number;
  quote: string;
  isFeatured: boolean;
  order: number;
}

export interface CmsEnquiry {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  message: string;
  productSlug?: string;
  productName?: string;
  status: string;
  assignedTo?: string;
  followUpNote?: string;
  nextFollowUpAt?: string;
  createdAt: string;
}

export interface CmsRfq {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  projectType: string;
  projectDescription: string;
  expectedTimeline: string;
  estimatedBudget: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
}

export interface CmsMedia {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  altText: string;
  category: string;
  createdAt: string;
}

export interface CmsAuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  createdAt: string;
}

export interface CmsBundle {
  settings: WebsiteSettings;
  navigation: NavigationItem[];
  products: CmsProduct[];
  services: CmsService[];
  portfolio: CmsPortfolio[];
  insights: CmsInsight[];
  testimonials: CmsTestimonial[];
  pages: Record<string, any>;
  lastUpdated: string;
}

class CmsApiService {
  private getHeaders(isJson = true): HeadersInit {
    const headers: Record<string, string> = {};
    if (isJson) headers['Content-Type'] = 'application/json';
    const token = authService.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async fetchBundle(): Promise<CmsBundle> {
    const res = await fetch(`${API_BASE_URL}/api/cms/all`, {
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch CMS content bundle');
    return json.data;
  }

  async fetchStats(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/cms/stats`, {
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch stats');
    return json;
  }

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/settings`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update settings');
  }

  async fetchPage(slug: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/cms/pages/${slug}`, {
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch page');
    return json.page;
  }

  async updatePage(slug: string, data: any, title?: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/pages/${slug}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ slug, title, data }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update page content');
  }

  // Products CRUD
  async createProduct(product: Partial<CmsProduct>): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/api/cms/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create product');
    return json.id;
  }

  async updateProduct(id: string, product: Partial<CmsProduct>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update product');
  }

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete product');
  }

  // Services CRUD
  async createService(service: Partial<CmsService>): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/api/cms/services`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(service),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create service');
    return json.id;
  }

  async updateService(id: string, service: Partial<CmsService>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/services/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(service),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update service');
  }

  async deleteService(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/services/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete service');
  }

  // Portfolio CRUD
  async createPortfolio(project: Partial<CmsPortfolio>): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/api/cms/portfolio`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(project),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create case study');
    return json.id;
  }

  async updatePortfolio(id: string, project: Partial<CmsPortfolio>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/portfolio/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(project),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update case study');
  }

  async deletePortfolio(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/portfolio/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete case study');
  }

  // Insights CRUD
  async createInsight(insight: Partial<CmsInsight>): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/api/cms/insights`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(insight),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create insight');
    return json.id;
  }

  async updateInsight(id: string, insight: Partial<CmsInsight>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/insights/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(insight),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update insight');
  }

  async deleteInsight(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/insights/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete insight');
  }

  // Testimonials CRUD
  async createTestimonial(testimonial: Partial<CmsTestimonial>): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/api/cms/testimonials`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(testimonial),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create testimonial');
    return json.id;
  }

  async updateTestimonial(id: string, testimonial: Partial<CmsTestimonial>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/testimonials/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(testimonial),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update testimonial');
  }

  async deleteTestimonial(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/testimonials/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete testimonial');
  }

  // Navigation Items
  async createNavItem(item: Partial<NavigationItem>): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/api/cms/navigation`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(item),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to add navigation item');
    return json.id;
  }

  async updateNavItem(id: string, item: Partial<NavigationItem>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/navigation/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(item),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update navigation item');
  }

  async deleteNavItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/navigation/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete navigation item');
  }

  // CRM Enquiries & RFQs
  async fetchEnquiries(): Promise<CmsEnquiry[]> {
    const res = await fetch(`${API_BASE_URL}/api/cms/enquiries`, {
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch enquiries');
    return json.enquiries;
  }

  async updateEnquiryStatus(id: string, status: string, followUpNote?: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/enquiries/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, followUpNote }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update enquiry');
  }

  async deleteEnquiry(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/enquiries/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete enquiry');
  }

  async fetchRfqs(): Promise<CmsRfq[]> {
    const res = await fetch(`${API_BASE_URL}/api/cms/rfqs`, {
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch RFQs');
    return json.rfqs;
  }

  async updateRfqStatus(id: string, status: string, assignedTo?: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/rfqs/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, assignedTo }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update RFQ');
  }

  async deleteRfq(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/rfqs/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete RFQ');
  }

  // Media Library
  async fetchMedia(): Promise<CmsMedia[]> {
    let serverMedia: CmsMedia[] = [];
    try {
      const res = await fetch(`${API_BASE_URL}/api/cms/media`, {
        headers: this.getHeaders(false),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.media)) {
        serverMedia = json.media;
      }
    } catch {
      // Backend unavailable
    }

    try {
      const stored = localStorage.getItem('azaroth_cms_local_media');
      const localMedia: CmsMedia[] = stored ? JSON.parse(stored) : [];
      // Combine without duplicates
      const seen = new Set(serverMedia.map((m) => m.url));
      const filteredLocal = localMedia.filter((m) => !seen.has(m.url));
      return [...filteredLocal, ...serverMedia];
    } catch {
      return serverMedia;
    }
  }

  async uploadMedia(file: File, category = 'general', altText?: string): Promise<CmsMedia> {
    // 1. Build instant base64 representation for reliable client-side rendering & persistence
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });

    const fallbackMedia: CmsMedia = {
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      filename: file.name,
      originalName: file.name,
      mimeType: file.type || 'image/png',
      sizeBytes: file.size,
      url: base64Data || URL.createObjectURL(file),
      altText: altText || file.name,
      category,
      createdAt: new Date().toISOString()
    };

    // Save to local storage cache so it persists across refreshes
    try {
      const stored = localStorage.getItem('azaroth_cms_local_media');
      const list: CmsMedia[] = stored ? JSON.parse(stored) : [];
      list.unshift(fallbackMedia);
      localStorage.setItem('azaroth_cms_local_media', JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn('LocalStorage media cache note:', e);
    }

    // 2. If backend is running, upload to server
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (altText) formData.append('altText', altText);

      const token = authService.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/api/cms/media/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.media) {
        return json.media;
      }
    } catch (err) {
      console.info('Backend upload deferred, using local media asset.', err);
    }

    return fallbackMedia;
  }

  async deleteMedia(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cms/media/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete media');
  }

  // Audit Logs
  async fetchAuditLogs(): Promise<CmsAuditLog[]> {
    const res = await fetch(`${API_BASE_URL}/api/cms/audit-logs`, {
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch audit logs');
    return json.logs;
  }
}

export const cmsService = new CmsApiService();
