// Shared Type Definitions for Azaroth UI

export type ProductCategory = string;

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  badge?: string;
  status?: 'Live' | 'Under Development' | 'PUBLISHED' | 'DRAFT' | string;
  statusColor?: 'green' | 'blue' | 'amber';
  tagline: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  coverAlt: string;
  isEnabled?: boolean;
  keyCapabilities: string[];
  benefits: string[];
  techSpecs: {
    latency: string;
    concurrency: string;
    compliancePosture: string;
    protocols: string[];
  };
  features: string[];
  iconName: string;
}

export interface ServiceOffering {
  id: string;
  slug: string;
  title: string;
  category: string;
  badge?: string;
  description: string;
  outcomes: string[];
  deliverables: string[];
  capabilities?: string[];
  metrics?: { label: string; value: string }[];
  iconName: string;
}

export interface SlaTier {
  tierName: 'Standard' | 'Business' | 'Mission-Critical Enterprise';
  highlight?: boolean;
  responseTime: string;
  availabilityTarget: string;
  leadArchitectSupport: string;
  dedicatedEngineeringPod: string;
  securityAuditsIncluded: string;
  deploymentCadence: string;
}

export interface DeliveryStage {
  stageNumber: number;
  title: string;
  tagline: string;
  duration: string;
  description: string;
  keyActivities: string[];
  deliverables: string[];
  qualityGates: string[];
}

export interface ValueItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  metrics: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  linkedInUrl?: string;
}

export interface InsightSection {
  id: string;
  title: string;
}

export interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  category: 'System Architecture' | 'Case Study' | 'Enterprise AI' | 'Cloud Modernization';
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
  };
  excerpt: string;
  content: string[];
  sections: InsightSection[];
  tags: string[];
  imageUrl?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  clientIndustry: string;
  title: string;
  summary: string;
  metrics: {
    label: string;
    value: string;
  }[];
  challenge: string;
  solution: string;
  architectureHighlights: string[];
}

export interface RfqFormData {
  solutionCategories: string[];
  projectScope: string;
  targetTimeline: string;
  budgetRange: string;
  requirementsDescription: string;
  ndaRequired: boolean;
  contact: {
    fullName: string;
    workEmail: string;
    phone: string;
    companyName: string;
    country: string;
  };
}

export interface ContactFormData {
  fullName: string;
  workEmail: string;
  phone: string;
  companyName: string;
  enquiryAbout: string;
  message: string;
  consent: boolean;
  website_url?: string; // honeypot
}
