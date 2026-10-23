// src/data/themePresets.ts
import { ThemeConfig } from '../services/cmsService';

export interface ThemePresetDefinition {
  key: string;
  name: string;
  category: 'Core Themes' | 'Corporate Palettes' | 'Executive Modern';
  desc: string;
  tagline: string;
  colors: ThemeConfig;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    border: string;
    text: string;
  };
}

export const THEME_PRESETS: ThemePresetDefinition[] = [
  // --- EXECUTIVE MODERN (Default) ---
  {
    key: 'crimson-red',
    name: 'Crimson Red (Default)',
    category: 'Executive Modern',
    tagline: 'Deep Crimson & Rose Ruby',
    desc: 'Executive crimson-red palette featuring rich burgundy (#7A0C16), dynamic crimson (#99152B), and bright ruby (#D3163C).',
    colors: {
      primaryColor: '#7A0C16',
      secondaryColor: '#B80F2E',
      accentColor: '#D3163C',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#FFE4E6',
      preset: 'crimson-red',
    },
    preview: {
      primary: '#7A0C16',
      secondary: '#B80F2E',
      accent: '#D3163C',
      background: '#FFFFFF',
      border: '#FFE4E6',
      text: '#0F172A',
    },
  },

  // --- 1. CORE ENTERPRISE THEMES ---
  {
    key: 'indigo-primary',
    name: 'Primary — Indigo',
    category: 'Core Themes',
    tagline: 'Professional, trustworthy, and modern',
    desc: 'High-contrast enterprise indigo paired with energetic emerald accents and crisp borders.',
    colors: {
      primaryColor: '#4F46E5',
      secondaryColor: '#10B981',
      accentColor: '#7C3AED',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#E0E7FF',
      preset: 'indigo-primary',
    },
    preview: {
      primary: '#4F46E5',
      secondary: '#10B981',
      accent: '#7C3AED',
      background: '#FFFFFF',
      border: '#E0E7FF',
      text: '#0F172A',
    },
  },
  {
    key: 'emerald-secondary',
    name: 'Secondary — Emerald Green',
    category: 'Core Themes',
    tagline: 'Fresh, balanced, and growth-oriented',
    desc: 'Dynamic cyber-emerald with balanced deep forest green and golden highlights.',
    colors: {
      primaryColor: '#10B981',
      secondaryColor: '#047857',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#D1FAE5',
      preset: 'emerald-secondary',
    },
    preview: {
      primary: '#10B981',
      secondary: '#047857',
      accent: '#F59E0B',
      background: '#FFFFFF',
      border: '#D1FAE5',
      text: '#0F172A',
    },
  },
  {
    key: 'royal-violet',
    name: 'Accent — Royal Violet',
    category: 'Core Themes',
    tagline: 'Premium, creative, and sophisticated',
    desc: 'Distinguished violet palette ideal for high-impact innovation platforms and creative cloud software.',
    colors: {
      primaryColor: '#7C3AED',
      secondaryColor: '#4F46E5',
      accentColor: '#EC4899',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#EDE9FE',
      preset: 'royal-violet',
    },
    preview: {
      primary: '#7C3AED',
      secondary: '#4F46E5',
      accent: '#EC4899',
      background: '#FFFFFF',
      border: '#EDE9FE',
      text: '#0F172A',
    },
  },
  {
    key: 'coral-rose',
    name: 'Warm — Coral Rose',
    category: 'Core Themes',
    tagline: 'Vibrant, friendly, and energetic',
    desc: 'Energetic coral rose with warm terracotta accents and soft zinc surfaces.',
    colors: {
      primaryColor: '#F43F5E',
      secondaryColor: '#EA580C',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#FFE4E6',
      preset: 'coral-rose',
    },
    preview: {
      primary: '#F43F5E',
      secondary: '#EA580C',
      accent: '#F59E0B',
      background: '#FFFFFF',
      border: '#FFE4E6',
      text: '#0F172A',
    },
  },

  // --- 2. COMPLEMENTARY CORPORATE THEME PRESETS ---
  {
    key: 'ocean-blue',
    name: 'Ocean Blue',
    category: 'Corporate Palettes',
    tagline: 'Clean, reliable, and enterprise-focused',
    desc: 'Crisp azure ocean blue with light sky highlights and subtle slate borders for high-trust software.',
    colors: {
      primaryColor: '#0284C7',
      secondaryColor: '#0EA5E9',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#E0F2FE',
      preset: 'ocean-blue',
    },
    preview: {
      primary: '#0284C7',
      secondary: '#0EA5E9',
      accent: '#F59E0B',
      background: '#FFFFFF',
      border: '#E0F2FE',
      text: '#0F172A',
    },
  },
  {
    key: 'teal',
    name: 'Teal',
    category: 'Corporate Palettes',
    tagline: 'Calm, modern, and balanced',
    desc: 'Harmonious deep teal with cyan undertones and amber alert accents.',
    colors: {
      primaryColor: '#0D9488',
      secondaryColor: '#14B8A6',
      accentColor: '#F97316',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#CCFBF1',
      preset: 'teal',
    },
    preview: {
      primary: '#0D9488',
      secondary: '#14B8A6',
      accent: '#F97316',
      background: '#FFFFFF',
      border: '#CCFBF1',
      text: '#0F172A',
    },
  },
  {
    key: 'slate-professional',
    name: 'Slate Professional',
    category: 'Corporate Palettes',
    tagline: 'Minimal, neutral, and corporate',
    desc: 'Subtle slate neutral architecture featuring cool industrial tones and bright electric blue CTAs.',
    colors: {
      primaryColor: '#475569',
      secondaryColor: '#64748B',
      accentColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#E2E8F0',
      preset: 'slate-professional',
    },
    preview: {
      primary: '#475569',
      secondary: '#64748B',
      accent: '#3B82F6',
      background: '#FFFFFF',
      border: '#E2E8F0',
      text: '#0F172A',
    },
  },
  {
    key: 'royal-blue',
    name: 'Royal Blue',
    category: 'Corporate Palettes',
    tagline: 'Confident, polished, and business-oriented',
    desc: 'Deep financial enterprise royal blue with gold status pills and platinum divider lines.',
    colors: {
      primaryColor: '#2563EB',
      secondaryColor: '#1D4ED8',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#DBEAFE',
      preset: 'royal-blue',
    },
    preview: {
      primary: '#2563EB',
      secondary: '#1D4ED8',
      accent: '#F59E0B',
      background: '#FFFFFF',
      border: '#DBEAFE',
      text: '#0F172A',
    },
  },
  {
    key: 'amber-gold',
    name: 'Amber Gold',
    category: 'Corporate Palettes',
    tagline: 'Warm, optimistic, and attention-grabbing',
    desc: 'Rich amber gold with deep bronze secondary actions and warm terracotta highlights.',
    colors: {
      primaryColor: '#D97706',
      secondaryColor: '#B45309',
      accentColor: '#EA580C',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#FEF3C7',
      preset: 'amber-gold',
    },
    preview: {
      primary: '#D97706',
      secondary: '#B45309',
      accent: '#EA580C',
      background: '#FFFFFF',
      border: '#FEF3C7',
      text: '#0F172A',
    },
  },
  {
    key: 'forest-green',
    name: 'Forest Green',
    category: 'Corporate Palettes',
    tagline: 'Natural, stable, and trustworthy',
    desc: 'Deep timberland green with alpine emerald accents and warm champagne gold accents.',
    colors: {
      primaryColor: '#15803D',
      secondaryColor: '#166534',
      accentColor: '#CA8A04',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#DCFCE7',
      preset: 'forest-green',
    },
    preview: {
      primary: '#15803D',
      secondary: '#166534',
      accent: '#CA8A04',
      background: '#FFFFFF',
      border: '#DCFCE7',
      text: '#0F172A',
    },
  },
  {
    key: 'midnight-navy',
    name: 'Midnight Navy',
    category: 'Corporate Palettes',
    tagline: 'Premium, elegant, and executive-focused',
    desc: 'Dark navy blue executive console palette with cyan laser accents and crisp white surfaces.',
    colors: {
      primaryColor: '#1E293B',
      secondaryColor: '#334155',
      accentColor: '#38BDF8',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#E2E8F0',
      preset: 'midnight-navy',
    },
    preview: {
      primary: '#1E293B',
      secondary: '#334155',
      accent: '#38BDF8',
      background: '#FFFFFF',
      border: '#E2E8F0',
      text: '#0F172A',
    },
  },
  {
    key: 'sunset-orange',
    name: 'Sunset Orange',
    category: 'Corporate Palettes',
    tagline: 'Bold, energetic, and engaging',
    desc: 'High-energy sunset orange with burnt amber contrasts and vibrant ruby red CTAs.',
    colors: {
      primaryColor: '#EA580C',
      secondaryColor: '#C2410C',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      borderColor: '#FFEDD5',
      preset: 'sunset-orange',
    },
    preview: {
      primary: '#EA580C',
      secondary: '#C2410C',
      accent: '#F59E0B',
      background: '#FFFFFF',
      border: '#FFEDD5',
      text: '#0F172A',
    },
  },
];

export const getPresetByKey = (key: string): ThemePresetDefinition | undefined => {
  return THEME_PRESETS.find((p) => p.key === key);
};
