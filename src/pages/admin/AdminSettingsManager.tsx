// src/pages/admin/AdminSettingsManager.tsx
import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Building,
  MapPin,
  Globe,
  Share2,
  Palette,
  Layers,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Plus,
  Bot,
  MessageSquare,
  Trash2,
  X,
  Sparkles,
  RefreshCw,
  MousePointer,
  Layout,
  AlignLeft,
  AlignRight,
} from 'lucide-react';
import { useCMS, defaultTheme, defaultModules } from '../../context/CMSContext';
import { WebsiteSettings, ThemeConfig, WebsiteModuleSetting, ChatbotConfig } from '../../services/cmsService';
import { adminColors, adminStyles } from '../../styles/adminTheme';
import { ImageUpload } from '../../components/common/ImageUpload';
import logoImg from '../../assets/Logo.png';
import { THEME_PRESETS } from '../../data/themePresets';

const defaultChatbotConfig: ChatbotConfig = {
  isEnabled: true,
  botName: 'Azaroth AI Guide',
  botRole: 'Automated engineering assistant',
  welcomeMessage: "Hello! I'm the automated Azaroth site guide. Ask me about our platforms, engineering services or how to reach the team.",
  quickPrompts: ['Our Platforms', 'Engineering Services', 'Request a Quote', 'Connect With Us'],
  supportEmail: 'hello@azaroth-techhive.com',
  supportPhone: '+91 6379480931',
  position: 'bottom-right',
  primaryColor: '#7A0C16',
  secondaryColor: '#B80F2E',
};

export const AdminSettingsManager: React.FC = () => {
  const {
    settings,
    updateSettings,
    toggleModule,
    resetThemeToDefault,
    applyThemePreset,
  } = useCMS();

  const [formData, setFormData] = useState<Partial<WebsiteSettings>>({ ...settings });
  const [themeForm, setThemeForm] = useState<ThemeConfig>({
    ...defaultTheme,
    ...(settings.themeConfig || {}),
  });
  const [modulesList, setModulesList] = useState<WebsiteModuleSetting[]>(
    settings.modulesConfig && settings.modulesConfig.length > 0
      ? settings.modulesConfig
      : defaultModules
  );
  const [chatbotForm, setChatbotForm] = useState<ChatbotConfig>({
    ...defaultChatbotConfig,
    ...(settings.chatbotConfig || {}),
  });
  const [newPromptInput, setNewPromptInput] = useState('');

  // Custom Theme Creator Modal & Saved Themes State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customThemeName, setCustomThemeName] = useState('');
  const [customColors, setCustomColors] = useState<ThemeConfig>({
    primaryColor: '#7A0C16',
    secondaryColor: '#B80F2E',
    accentColor: '#D3163C',
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
    borderColor: '#FFE4E6',
  });
  const [savedCustomThemes, setSavedCustomThemes] = useState<Array<{ name: string; key: string; colors: ThemeConfig }>>(() => {
    try {
      const raw = localStorage.getItem('azaroth_custom_user_themes');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [themeCategoryFilter, setThemeCategoryFilter] = useState<'ALL' | 'Core Themes' | 'Corporate Palettes' | 'Executive Modern'>('ALL');

  useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
      setThemeForm({
        ...defaultTheme,
        ...(settings.themeConfig || {}),
      });
      if (settings.chatbotConfig) {
        setChatbotForm({
          ...defaultChatbotConfig,
          ...settings.chatbotConfig,
        });
      }
      if (settings.modulesConfig && settings.modulesConfig.length > 0) {
        setModulesList(settings.modulesConfig);
      }
    }
  }, [settings]);

  const applyLiveThemeVariables = (colors: ThemeConfig) => {
    const root = document.documentElement;
    const primary = colors.primaryColor || '#18181B';
    const secondary = colors.secondaryColor || '#F59E0B';
    const accent = colors.accentColor || '#E11D48';
    const bg = colors.backgroundColor || '#FFFFFF';
    const text = colors.textColor || '#0F172A';
    const border = colors.borderColor || '#E4E4E7';

    // Helper for contrast determination
    const getContrastText = (hexColor: string) => {
      try {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 160 ? '#0F172A' : '#FFFFFF';
      } catch {
        return '#FFFFFF';
      }
    };

    const primaryButtonText = getContrastText(primary);
    const goldButtonText = getContrastText(secondary);

    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-primary-hover', primary);
    root.style.setProperty('--color-primary-button', primary);
    root.style.setProperty('--color-primary-button-hover', primary);
    root.style.setProperty('--color-primary-button-active', primary);
    root.style.setProperty('--color-primary-button-text', primaryButtonText);
    root.style.setProperty('--color-primary-glow', `${primary}35`);
    root.style.setProperty('--color-primary-light', `${primary}14`);
    root.style.setProperty('--color-primary-border', `${primary}35`);
    root.style.setProperty('--shadow-primary-button', `0 4px 14px 0 ${primary}35`);
    root.style.setProperty('--shadow-primary-button-lg', `0 10px 25px -4px ${primary}45`);
    root.style.setProperty('--color-link-main', primary);
    root.style.setProperty('--color-link-hover', secondary);
    root.style.setProperty('--color-nav-active', primary);
    root.style.setProperty('--color-nav-indicator', secondary);
    root.style.setProperty('--color-brand-primary', primary);
    root.style.setProperty('--color-primary-green', primary);
    root.style.setProperty('--color-brand-emerald', primary);
    root.style.setProperty('--color-brand-violet', primary);
    root.style.setProperty('--color-primary-text', primary);

    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--color-secondary-hover', secondary);
    root.style.setProperty('--color-brand-gold', secondary);
    root.style.setProperty('--color-brand-gold-text', secondary);
    root.style.setProperty('--color-brand-gold-light', `${secondary}18`);
    root.style.setProperty('--color-brand-gold-border', `${secondary}45`);
    root.style.setProperty('--color-brand-gold-shadow', `${secondary}30`);
    root.style.setProperty('--color-brand-gold-glow', `${secondary}35`);
    root.style.setProperty('--color-brand-gold-hover', secondary);
    root.style.setProperty('--color-gold-button-text', goldButtonText);
    root.style.setProperty('--color-gold-from', secondary);
    root.style.setProperty('--color-premium', secondary);
    root.style.setProperty('--color-kicker', secondary);

    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-accent-hover', accent);
    root.style.setProperty('--color-accent-light', `${accent}18`);
    root.style.setProperty('--color-accent-border', `${accent}45`);
    root.style.setProperty('--color-primary-maroon', accent);
    root.style.setProperty('--color-brand-magenta', accent);
    root.style.setProperty('--color-alert', accent);
    root.style.setProperty('--color-danger', accent);

    root.style.setProperty('--color-canvas-bg', bg);
    root.style.setProperty('--color-canvas-card', '#FFFFFF');
    root.style.setProperty('--color-canvas-subtle', '#F8FAFC');
    root.style.setProperty('--color-white', bg === '#FFFFFF' ? '#FFFFFF' : bg);
    root.style.setProperty('--color-text-primary', text);
    root.style.setProperty('--color-text-secondary', '#475569');
    root.style.setProperty('--color-text-muted', '#64748B');
    root.style.setProperty('--color-border', border);
    root.style.setProperty('--color-border-subtle', border);

    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`);
    root.style.setProperty('--gradient-brand', `linear-gradient(135deg, ${primary} 0%, ${accent} 50%, ${secondary} 100%)`);
    root.style.setProperty('--gradient-hero', `linear-gradient(135deg, ${primary} 0%, ${accent || secondary} 100%)`);
    root.style.setProperty('--gradient-focal', `linear-gradient(135deg, ${primary} 0%, ${accent} 50%, ${secondary} 100%)`);
  };

  // Handle color change with live hex update
  const handleColorChange = (key: keyof ThemeConfig, val: string) => {
    const updated = { ...themeForm, [key]: val, preset: 'custom' };
    setThemeForm(updated);
    applyLiveThemeVariables(updated);
  };

  const handlePresetSelect = async (presetKey: string) => {
    const chosen = THEME_PRESETS.find((p) => p.key === presetKey);
    if (chosen) {
      setThemeForm(chosen.colors);
      applyLiveThemeVariables(chosen.colors);
    }
    await applyThemePreset(presetKey);
    setNotification(`Applied theme preset: ${chosen?.name}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetTheme = async () => {
    setThemeForm(defaultTheme);
    applyLiveThemeVariables(defaultTheme);
    await resetThemeToDefault();
    setNotification('Restored default corporate branding palette.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle module on/off
  const handleToggleModuleItem = async (slug: string) => {
    try {
      await toggleModule(slug);
      setNotification(`Updated module configuration.`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(`Error toggling module: ${err.message}`);
    }
  };

  // Custom Theme Creation & Application
  const handleSaveCustomTheme = async () => {
    const themeName = customThemeName.trim() || 'Custom Palette';
    const themeKey = `custom-${Date.now()}`;
    const newEntry = {
      name: themeName,
      key: themeKey,
      colors: { ...customColors, preset: themeKey },
    };

    const updated = [...savedCustomThemes, newEntry];
    setSavedCustomThemes(updated);
    localStorage.setItem('azaroth_custom_user_themes', JSON.stringify(updated));

    setThemeForm(newEntry.colors);
    applyLiveThemeVariables(newEntry.colors);
    await updateSettings({
      themeConfig: newEntry.colors,
      primary_color: customColors.primaryColor,
      secondary_color: customColors.secondaryColor,
      accent_color: customColors.accentColor,
      background_color: customColors.backgroundColor,
    });

    setIsCustomModalOpen(false);
    setNotification(`Custom theme "${themeName}" created & applied successfully!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteCustomTheme = (keyToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedCustomThemes.filter((t) => t.key !== keyToDelete);
    setSavedCustomThemes(updated);
    localStorage.setItem('azaroth_custom_user_themes', JSON.stringify(updated));
    setNotification('Removed custom theme preset.');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleSelectCustomTheme = async (themeEntry: { name: string; key: string; colors: ThemeConfig }) => {
    setThemeForm(themeEntry.colors);
    applyLiveThemeVariables(themeEntry.colors);
    await updateSettings({
      themeConfig: themeEntry.colors,
      primary_color: themeEntry.colors.primaryColor,
      secondary_color: themeEntry.colors.secondaryColor,
      accent_color: themeEntry.colors.accentColor,
      background_color: themeEntry.colors.backgroundColor,
    });
    setNotification(`Applied custom theme: ${themeEntry.name}`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Chatbot Handlers
  const handleToggleChatbot = () => {
    setChatbotForm((prev) => ({
      ...prev,
      isEnabled: !prev.isEnabled,
    }));
  };

  const handleAddQuickPrompt = () => {
    const trimmed = newPromptInput.trim();
    if (!trimmed) return;
    const current = chatbotForm.quickPrompts || [];
    if (!current.includes(trimmed)) {
      setChatbotForm((prev) => ({
        ...prev,
        quickPrompts: [...current, trimmed],
      }));
    }
    setNewPromptInput('');
  };

  const handleRemoveQuickPrompt = (promptToRemove: string) => {
    setChatbotForm((prev) => ({
      ...prev,
      quickPrompts: (prev.quickPrompts || []).filter((p) => p !== promptToRemove),
    }));
  };

  const handleSaveChatbotSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        chatbotConfig: chatbotForm,
      });
      setNotification('Virtual Assistant & Chatbot settings saved successfully!');
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      alert(`Failed to save chatbot settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      const payload: Partial<WebsiteSettings> = {
        ...formData,
        themeConfig: themeForm,
        modulesConfig: modulesList,
        chatbotConfig: chatbotForm,
        primary_color: themeForm.primaryColor,
        secondary_color: themeForm.secondaryColor,
        accent_color: themeForm.accentColor,
        background_color: themeForm.backgroundColor,
      };

      await updateSettings(payload);
      setNotification('All branding, module configurations, chatbot and website settings saved successfully!');
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: adminColors.slate.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: adminColors.amber.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={22} color={adminColors.amber.text} />
          </div>
          Global Website Branding & Module Settings
        </h1>
        <p style={{ fontSize: '0.875rem', color: adminColors.slate.textMuted, marginTop: '0.5rem', marginLeft: '3.5rem' }}>
          Configure enterprise corporate identity, upload brand logos, customize full dynamic color palettes, and toggle website modules.
        </p>
      </div>

      {notification && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.25rem', backgroundColor: adminColors.emerald.light, border: `1px solid ${adminColors.emerald.border}`, borderRadius: '10px', color: adminColors.emerald.text, marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} color={adminColors.emerald.base} /> {notification}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* ========================================================
            1. CORPORATE IDENTITY & LOGO UPLOAD (Indigo Accent)
        ======================================================== */}
        <div style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', borderBottom: `1px solid ${adminColors.slate.borderLight}`, paddingBottom: '0.875rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: adminColors.indigo.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={17} color={adminColors.indigo.text} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: adminColors.indigo.text, margin: 0 }}>
                1. Corporate Identity & Brand Logo
              </h2>
              <span style={{ fontSize: '0.75rem', color: adminColors.slate.textMuted }}>
                The official logo and brand names displayed across website header, footer, and admin console.
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Logo Upload Card */}
            <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>Official Brand Logo</span>
                {formData.logoUrl && (
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#047857', backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Custom Active
                  </span>
                )}
              </div>

              <ImageUpload
                value={formData.logoUrl || ''}
                onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                label=""
                description="Upload brand logo (PNG, SVG, WebP, JPG). Max 10MB."
                isLogo={true}
                aspectRatioHint="Recommended: 4:1 or 1:1 SVG/PNG"
              />

              {!formData.logoUrl && (
                <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.75rem', backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={logoImg} alt="Default Logo" style={{ height: '24px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Currently using default bundled logo</span>
                </div>
              )}
            </div>

            {/* Corporate Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={adminStyles.label}>Legal Brand Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  style={adminStyles.input}
                />
              </div>

              <div>
                <label style={adminStyles.label}>Corporate Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  style={adminStyles.input}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={adminStyles.label}>Company Description & Meta Overview</label>
                <textarea
                  rows={3}
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  style={adminStyles.textarea}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. DYNAMIC COLOR PALETTE & THEME CUSTOMIZER (Palette)
        ======================================================== */}
        <div style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', borderBottom: `1px solid ${adminColors.slate.borderLight}`, paddingBottom: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: adminColors.indigo.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Palette size={17} color={adminColors.indigo.text} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: adminColors.slate.textPrimary, margin: 0 }}>
                  2. Dynamic Color Palette & Theme Engine
                </h2>
                <span style={{ fontSize: '0.75rem', color: adminColors.slate.textMuted }}>
                  Customize primary, secondary, accent, background, text, and border colors with real-time site injection.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleResetTheme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={13} /> Reset to Default
              </button>
            </div>
          </div>

          {/* Theme Presets Selector */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>
                  Predefined Corporate Theme Presets
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Enterprise-grade palettes designed for modern dashboards, platforms, and client portals. Click any preset to preview and apply instantly.
                </span>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {(['ALL', 'Core Themes', 'Corporate Palettes', 'Executive Modern'] as const).map((cat) => {
                  const count = cat === 'ALL'
                    ? THEME_PRESETS.length
                    : THEME_PRESETS.filter((p) => p.category === cat).length;
                  const isSelected = themeCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setThemeCategoryFilter(cat)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: isSelected ? '1px solid #18181B' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#18181B' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cat === 'ALL' ? 'All Presets' : cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
              {/* 1. Predefined Corporate Presets (Explored first) */}
              {THEME_PRESETS.filter((p) => themeCategoryFilter === 'ALL' || p.category === themeCategoryFilter).map((preset) => {
                const isSelected = themeForm.preset === preset.key;
                const primaryHex = preset.colors.primaryColor || '#18181B';
                return (
                  <div
                    key={preset.key}
                    onClick={() => handlePresetSelect(preset.key)}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${primaryHex}` : '1px solid #E2E8F0',
                      backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                      boxShadow: isSelected ? `0 4px 14px ${primaryHex}25` : '0 1px 3px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease-in-out',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      {/* Top Bar: Name & Primary Hex Badge */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A' }}>
                              {preset.name}
                            </span>
                            {isSelected && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  backgroundColor: primaryHex,
                                  color: '#FFFFFF',
                                  flexShrink: 0,
                                }}
                                title="Active preset"
                              >
                                <Check size={11} strokeWidth={3} />
                              </span>
                            )}
                          </div>
                          <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748B', fontWeight: 500, marginTop: '0.125rem' }}>
                            {preset.tagline}
                          </span>
                        </div>

                        {/* Hex Code Badge */}
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            backgroundColor: `${primaryHex}15`,
                            color: primaryHex,
                            border: `1px solid ${primaryHex}35`,
                            flexShrink: 0,
                          }}
                        >
                          {primaryHex}
                        </span>
                      </div>

                      {/* Swatches Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.75rem 0' }}>
                        <span
                          style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', borderRadius: '6px', backgroundColor: preset.preview.primary, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                          title={`Primary: ${preset.preview.primary}`}
                        />
                        <span
                          style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', borderRadius: '6px', backgroundColor: preset.preview.secondary, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                          title={`Secondary: ${preset.preview.secondary}`}
                        />
                        <span
                          style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', borderRadius: '6px', backgroundColor: preset.preview.accent, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                          title={`Accent: ${preset.preview.accent}`}
                        />
                        <span
                          style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', borderRadius: '6px', backgroundColor: preset.preview.background, border: '1px solid #CBD5E1', display: 'inline-block', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                          title={`Background: ${preset.preview.background}`}
                        />
                        <span
                          style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', borderRadius: '6px', backgroundColor: preset.preview.border, border: '1px solid #CBD5E1', display: 'inline-block', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                          title={`Border: ${preset.preview.border}`}
                        />
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: '0.6875rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                        {preset.desc}
                      </p>
                    </div>

                    {/* Bottom Status / Selection prompt */}
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: isSelected ? primaryHex : '#94A3B8' }}>
                        {isSelected ? '✓ Currently Applied' : 'Click to preview & apply'}
                      </span>
                      <span style={{ fontSize: '0.625rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {preset.category}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* 2. User Saved Custom Themes (if any) */}
              {savedCustomThemes.map((saved) => {
                const isSelected = themeForm.preset === saved.key || themeForm.primaryColor === saved.colors.primaryColor;
                const pColor = saved.colors.primaryColor || '#18181B';
                return (
                  <div
                    key={saved.key}
                    onClick={() => handleSelectCustomTheme(saved)}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${pColor}` : '1px solid #CBD5E1',
                      backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                      boxShadow: isSelected ? `0 4px 14px ${pColor}25` : '0 1px 3px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A' }}>
                              {saved.name}
                            </span>
                            {isSelected && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  backgroundColor: pColor,
                                  color: '#FFFFFF',
                                  flexShrink: 0,
                                }}
                              >
                                <Check size={11} strokeWidth={3} />
                              </span>
                            )}
                          </div>
                          <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748B', fontWeight: 500, marginTop: '0.125rem' }}>
                            Custom User Preset
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomTheme(saved.key, e)}
                          title="Delete this custom preset"
                          style={{
                            padding: '0.25rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#94A3B8',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.75rem 0' }}>
                        <span style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: saved.colors.primaryColor, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block' }} />
                        <span style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: saved.colors.secondaryColor, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block' }} />
                        <span style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: saved.colors.accentColor, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block' }} />
                        <span style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: saved.colors.backgroundColor, border: '1px solid #CBD5E1', display: 'inline-block' }} />
                      </div>
                    </div>
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: isSelected ? pColor : '#94A3B8' }}>
                        {isSelected ? '✓ Currently Applied' : 'Click to apply'}
                      </span>
                      <span style={{ fontSize: '0.625rem', color: '#94A3B8', textTransform: 'uppercase' }}>Custom</span>
                    </div>
                  </div>
                );
              })}

              {/* 3. Custom Theme Creator Card with Plus (+) Button (Placed at the very end after all presets) */}
              <div
                onClick={() => {
                  setCustomColors({
                    primaryColor: themeForm.primaryColor || '#2563EB',
                    secondaryColor: themeForm.secondaryColor || '#F59E0B',
                    accentColor: themeForm.accentColor || '#EC4899',
                    backgroundColor: themeForm.backgroundColor || '#FFFFFF',
                    textColor: themeForm.textColor || '#0F172A',
                    borderColor: themeForm.borderColor || '#E2E8F0',
                  });
                  setCustomThemeName('');
                  setIsCustomModalOpen(true);
                }}
                style={{
                  padding: '1.25rem 1rem',
                  borderRadius: '10px',
                  border: '2px dashed #94A3B8',
                  backgroundColor: '#F8FAFC',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: '190px',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-button, #18181B)';
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#94A3B8';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-button, #18181B)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                    marginBottom: '0.75rem',
                  }}
                >
                  <Plus size={24} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                  + Customize Your Theme
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '210px', lineHeight: 1.4 }}>
                  Build and apply a bespoke corporate color palette
                </span>
                <span
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '9999px',
                    backgroundColor: '#E2E8F0',
                    color: '#334155',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  Custom Palette Builder
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Color Pickers & Hex Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            {/* 1. Primary Color */}
            <div style={{ padding: '0.875rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Primary Brand
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', minWidth: 0 }}>
                <label
                  title="Click to select Primary Color"
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    minWidth: '38px',
                    minHeight: '38px',
                    borderRadius: '8px',
                    backgroundColor: themeForm.primaryColor || '#18181B',
                    border: '2px solid rgba(0, 0, 0, 0.15)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <input
                    type="color"
                    value={themeForm.primaryColor || '#18181B'}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                  />
                </label>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    type="text"
                    value={themeForm.primaryColor || ''}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    placeholder="#18181B"
                    style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '0.45rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF', textTransform: 'uppercase', outline: 'none' }}
                  />
                </div>
              </div>
              <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748B', marginTop: '0.45rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Buttons, active nav, primary links</span>
            </div>

            {/* 2. Secondary Color */}
            <div style={{ padding: '0.875rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Secondary / Gold
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', minWidth: 0 }}>
                <label
                  title="Click to select Secondary Color"
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    minWidth: '38px',
                    minHeight: '38px',
                    borderRadius: '8px',
                    backgroundColor: themeForm.secondaryColor || '#F59E0B',
                    border: '2px solid rgba(0, 0, 0, 0.15)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <input
                    type="color"
                    value={themeForm.secondaryColor || '#F59E0B'}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                  />
                </label>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    type="text"
                    value={themeForm.secondaryColor || ''}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    placeholder="#F59E0B"
                    style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '0.45rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF', textTransform: 'uppercase', outline: 'none' }}
                  />
                </div>
              </div>
              <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748B', marginTop: '0.45rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Badges, gold headers, accents</span>
            </div>

            {/* 3. Accent Color */}
            <div style={{ padding: '0.875rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Accent / Alert
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', minWidth: 0 }}>
                <label
                  title="Click to select Accent Color"
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    minWidth: '38px',
                    minHeight: '38px',
                    borderRadius: '8px',
                    backgroundColor: themeForm.accentColor || '#E11D48',
                    border: '2px solid rgba(0, 0, 0, 0.15)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <input
                    type="color"
                    value={themeForm.accentColor || '#E11D48'}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                  />
                </label>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    type="text"
                    value={themeForm.accentColor || ''}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    placeholder="#E11D48"
                    style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '0.45rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF', textTransform: 'uppercase', outline: 'none' }}
                  />
                </div>
              </div>
              <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748B', marginTop: '0.45rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Highlights, errors, alerts</span>
            </div>

            {/* 4. Canvas Background */}
            <div style={{ padding: '0.875rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Canvas Background
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', minWidth: 0 }}>
                <label
                  title="Click to select Canvas Background"
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    minWidth: '38px',
                    minHeight: '38px',
                    borderRadius: '8px',
                    backgroundColor: themeForm.backgroundColor || '#FFFFFF',
                    border: '2px solid rgba(0, 0, 0, 0.2)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <input
                    type="color"
                    value={themeForm.backgroundColor || '#FFFFFF'}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                  />
                </label>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    type="text"
                    value={themeForm.backgroundColor || ''}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    placeholder="#FFFFFF"
                    style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '0.45rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF', textTransform: 'uppercase', outline: 'none' }}
                  />
                </div>
              </div>
              <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748B', marginTop: '0.45rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Page body & surfaces</span>
            </div>

            {/* 5. Typography Text */}
            <div style={{ padding: '0.875rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Main Typography
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', minWidth: 0 }}>
                <label
                  title="Click to select Typography Color"
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    minWidth: '38px',
                    minHeight: '38px',
                    borderRadius: '8px',
                    backgroundColor: themeForm.textColor || '#0F172A',
                    border: '2px solid rgba(0, 0, 0, 0.15)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <input
                    type="color"
                    value={themeForm.textColor || '#0F172A'}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                  />
                </label>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    type="text"
                    value={themeForm.textColor || ''}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    placeholder="#0F172A"
                    style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '0.45rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF', textTransform: 'uppercase', outline: 'none' }}
                  />
                </div>
              </div>
              <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748B', marginTop: '0.45rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Headings & body copy</span>
            </div>

            {/* 6. Border Color */}
            <div style={{ padding: '0.875rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Border & Dividers
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', minWidth: 0 }}>
                <label
                  title="Click to select Border Color"
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    minWidth: '38px',
                    minHeight: '38px',
                    borderRadius: '8px',
                    backgroundColor: themeForm.borderColor || '#E4E4E7',
                    border: '2px solid rgba(0, 0, 0, 0.15)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <input
                    type="color"
                    value={themeForm.borderColor || '#E4E4E7'}
                    onChange={(e) => handleColorChange('borderColor', e.target.value)}
                    style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                  />
                </label>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    type="text"
                    value={themeForm.borderColor || ''}
                    onChange={(e) => handleColorChange('borderColor', e.target.value)}
                    placeholder="#E4E4E7"
                    style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '0.45rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF', textTransform: 'uppercase', outline: 'none' }}
                  />
                </div>
              </div>
              <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748B', marginTop: '0.45rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cards, tabs, input borders</span>
            </div>
          </div>

          {/* ========================================================
              CURSOR ANIMATION PREVIEW & LIVE THEME SYNCHRONIZER
          ======================================================== */}
          <div
            style={{
              backgroundColor: '#09090B',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: `1px solid ${themeForm.secondaryColor || '#F59E0B'}40`,
              boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: themeForm.secondaryColor || '#F59E0B',
                  }}
                >
                  <MousePointer size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Live Cursor Animation Preview & Theme Synchronizer
                    <span
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        backgroundColor: `${themeForm.secondaryColor || '#F59E0B'}25`,
                        color: themeForm.secondaryColor || '#F59E0B',
                        border: `1px solid ${themeForm.secondaryColor || '#F59E0B'}50`,
                      }}
                    >
                      Real-time Dynamic
                    </span>
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    The custom animated cursor synchronizes automatically with your chosen global corporate theme colors.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.6875rem', color: '#CBD5E1', fontFamily: 'monospace' }}>
                  Dot: <strong style={{ color: themeForm.primaryColor || '#18181B' }}>{themeForm.primaryColor || '#18181B'}</strong> | Ring: <strong style={{ color: themeForm.secondaryColor || '#F59E0B' }}>{themeForm.secondaryColor || '#F59E0B'}</strong>
                </span>
              </div>
            </div>

            {/* Visual State Breakdown Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* 1. Normal State Visualizer */}
              <div
                style={{
                  backgroundColor: '#18181B',
                  border: '1px solid #27272A',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Normal State (Move Mode)
                </span>
                <div
                  style={{
                    position: 'relative',
                    width: '70px',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  {/* Rotating dashed ring */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: `2px dashed ${themeForm.secondaryColor || '#F59E0B'}`,
                      animation: 'cursorSpin 6s linear infinite',
                      boxShadow: `0 0 10px ${themeForm.secondaryColor || '#F59E0B'}40`,
                    }}
                  />
                  {/* Glowing central dot */}
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: themeForm.primaryColor || '#18181B',
                      boxShadow: `0 0 10px ${themeForm.primaryColor || '#18181B'}, 0 0 5px ${themeForm.secondaryColor || '#F59E0B'}`,
                      zIndex: 2,
                      animation: 'cursorPulseGlow 3s ease-in-out infinite alternate',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F1F5F9' }}>
                  Pulsing Core & Spinning Ring
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Dot in Primary Brand, Ring in Gold Accent
                </span>
              </div>

              {/* 2. Hover State Visualizer */}
              <div
                style={{
                  backgroundColor: '#18181B',
                  border: '1px solid #27272A',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Interactive Hover State
                </span>
                <div
                  style={{
                    position: 'relative',
                    width: '70px',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  {/* Expanded ring on hover */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      border: `2px solid ${themeForm.primaryColor || '#18181B'}`,
                      animation: 'cursorSpin 2.5s linear infinite',
                      boxShadow: `0 0 16px ${themeForm.secondaryColor || '#F59E0B'}70`,
                    }}
                  />
                  {/* Scaled dot */}
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: themeForm.secondaryColor || '#F59E0B',
                      boxShadow: `0 0 16px ${themeForm.secondaryColor || '#F59E0B'}`,
                      zIndex: 2,
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F1F5F9' }}>
                  High-Intensity Expansion
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Expands to 44px with gold glow on buttons/links
                </span>
              </div>

              {/* 3. Theme-Adaptive Gradient Visualizer */}
              <div
                style={{
                  backgroundColor: '#18181B',
                  border: '1px solid #27272A',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Animated Theme Gradients
                </span>
                <div
                  className="cursor-gradient-theme-primary"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    marginBottom: '0.4rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Azaroth Tech-Hive
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  Multi-stop linear gradient shifts smoothly across your theme: Primary, Gold & Accent
                </span>
              </div>
            </div>

            {/* Interactive Testing Sandbox Canvas */}
            <div
              style={{
                backgroundColor: '#111113',
                border: '1px dashed #3F3F46',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} color={themeForm.secondaryColor || '#F59E0B'} /> Interactive Sandbox (Move cursor here)
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#71717A' }}>
                  Hover over these interactive triggers to test real cursor scale, rotation speed, and glow reactivity:
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: themeForm.primaryColor || '#18181B',
                    color: '#FFFFFF',
                    border: `1px solid ${themeForm.secondaryColor || '#F59E0B'}50`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: `0 4px 12px ${themeForm.primaryColor || '#18181B'}60`,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                    e.currentTarget.style.boxShadow = `0 6px 16px ${themeForm.secondaryColor || '#F59E0B'}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${themeForm.primaryColor || '#18181B'}60`;
                  }}
                >
                  Hover Button (Expands Ring)
                </button>

                <button
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: themeForm.secondaryColor || '#F59E0B',
                    border: `1px solid ${themeForm.secondaryColor || '#F59E0B'}`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = themeForm.secondaryColor || '#F59E0B';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = themeForm.secondaryColor || '#F59E0B';
                  }}
                >
                  Gold Accent Trigger
                </button>

                <a
                  href="#sandbox"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    color: '#38BDF8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                  }}
                >
                  Interactive Link Test
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================
              ACTIVE CORPORATE COLOR PALETTE ARCHITECTURE & SWATCH BAR
          ======================================================== */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={16} color="#4F46E5" />
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                  Active Corporate Color Palette Architecture
                </span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                6 Core Tokens Active
              </span>
            </div>

            {/* 6 Palette Pillars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              {[
                { label: 'Primary Brand', hex: themeForm.primaryColor || '#18181B', role: 'Buttons, active nav, cursor dot' },
                { label: 'Secondary / Gold', hex: themeForm.secondaryColor || '#F59E0B', role: 'Badges, rotating cursor ring' },
                { label: 'Accent / Alert', hex: themeForm.accentColor || '#E11D48', role: 'Gradients, alert tags, pulses' },
                { label: 'Canvas Surface', hex: themeForm.backgroundColor || '#FFFFFF', role: 'Page background & card canvas' },
                { label: 'Main Typography', hex: themeForm.textColor || '#0F172A', role: 'Headings, hero titles, paragraphs' },
                { label: 'Border Dividers', hex: themeForm.borderColor || '#E4E4E7', role: 'Grid lines, cards & inputs' },
              ].map((token, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: token.hex,
                        border: '1px solid rgba(0,0,0,0.15)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                        {token.label}
                      </div>
                      <div style={{ fontSize: '0.6875rem', fontFamily: 'monospace', fontWeight: 700, color: '#4F46E5' }}>
                        {token.hex}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.625rem', color: '#64748B', lineHeight: 1.3, marginTop: '0.2rem' }}>
                    {token.role}
                  </span>
                </div>
              ))}
            </div>

            {/* Dynamic Brand Gradient Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748B' }}>
                  Dynamic Brand Multi-Stop Gradient (--gradient-brand):
                </span>
                <span style={{ fontSize: '0.625rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                  {themeForm.primaryColor} → {themeForm.accentColor} → {themeForm.secondaryColor}
                </span>
              </div>
              <div
                style={{
                  height: '14px',
                  borderRadius: '9999px',
                  background: `linear-gradient(90deg, ${themeForm.primaryColor || '#18181B'} 0%, ${themeForm.accentColor || '#E11D48'} 50%, ${themeForm.secondaryColor || '#F59E0B'} 100%)`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              />
            </div>
          </div>

          {/* Live Preview Swatch Box */}
          <div style={{ backgroundColor: themeForm.backgroundColor || '#FFFFFF', border: `1px solid ${themeForm.borderColor || '#E4E4E7'}`, borderRadius: '10px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Theme Preview Render
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: themeForm.textColor || '#0F172A' }}>
                  Enterprise Engineering Pods
                </h4>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: themeForm.textColor || '#0F172A', opacity: 0.8 }}>
                  Zero-lockin microservice ecosystems backed by high-availability SLAs.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '9999px',
                    backgroundColor: themeForm.secondaryColor || '#F59E0B',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Active Platform
                </span>

                <button
                  type="button"
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    backgroundColor: themeForm.primaryColor || '#18181B',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  Explore Solutions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. VIRTUAL ASSISTANT & CHATBOT ENGINE (Bot & AI Guide)
        ======================================================== */}
        <div style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', borderBottom: `1px solid ${adminColors.slate.borderLight}`, paddingBottom: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={17} color="#4F46E5" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                  3. Virtual Assistant & Chatbot Engine
                </h2>
                <span style={{ fontSize: '0.75rem', color: adminColors.slate.textMuted }}>
                  Configure automated site guide, welcome greetings, quick interactive suggestion chips, and corporate fallbacks.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleSaveChatbotSettings}
                disabled={isSaving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '6px',
                  backgroundColor: '#4F46E5',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
                }}
              >
                <Save size={13} /> Save Chatbot Settings
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(280px, 0.9fr)', gap: '1.5rem', alignItems: 'start' }}>
            {/* Left: Chatbot Controls & Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Status & Enable Switch */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.15rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                      Assistant Status
                    </span>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '9999px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: chatbotForm.isEnabled ? '#ECFDF5' : '#FEF3C7',
                        color: chatbotForm.isEnabled ? '#047857' : '#B45309',
                        border: `1px solid ${chatbotForm.isEnabled ? '#A7F3D0' : '#FDE68A'}`,
                      }}
                    >
                      {chatbotForm.isEnabled ? 'Live on Site' : 'Under Development / Disabled'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Show or hide the floating conversational guide for website visitors
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleChatbot}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    border: `1px solid ${chatbotForm.isEnabled ? '#A7F3D0' : '#FDE68A'}`,
                    backgroundColor: chatbotForm.isEnabled ? '#ECFDF5' : '#FEF3C7',
                    color: chatbotForm.isEnabled ? '#047857' : '#B45309',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {chatbotForm.isEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>{chatbotForm.isEnabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {/* Bot Identity Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={adminStyles.label}>Assistant Display Name</label>
                  <input
                    type="text"
                    value={chatbotForm.botName || ''}
                    onChange={(e) => setChatbotForm({ ...chatbotForm, botName: e.target.value })}
                    placeholder="e.g. Azaroth AI Guide"
                    style={adminStyles.input}
                  />
                </div>

                <div>
                  <label style={adminStyles.label}>Assistant Subtitle / Role</label>
                  <input
                    type="text"
                    value={chatbotForm.botRole || ''}
                    onChange={(e) => setChatbotForm({ ...chatbotForm, botRole: e.target.value })}
                    placeholder="e.g. Automated engineering assistant"
                    style={adminStyles.input}
                  />
                </div>
              </div>

              {/* Chatbot Dedicated Color Palette & Styling */}
              <div
                style={{
                  padding: '1.1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Palette size={15} color="#7C3AED" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A' }}>
                        Chatbot Color Palette & Visual Theme
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                        Floating launcher button, header gradient, message bubbles, and action highlights
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setChatbotForm({
                        ...chatbotForm,
                        primaryColor: themeForm.primaryColor || '#18181B',
                        secondaryColor: themeForm.secondaryColor || '#F59E0B',
                      });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#475569',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                    title="Copy active global theme colors to chatbot"
                  >
                    <RefreshCw size={12} /> Sync with Global Theme
                  </button>
                </div>

                {/* Quick Presets for Chatbot */}
                <div style={{ marginBottom: '0.9rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.4rem' }}>
                    Quick Preset Color Schemes:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {[
                      { name: 'Obsidian & Gold', primary: '#18181B', secondary: '#F59E0B' },
                      { name: 'Royal Azure', primary: '#1E40AF', secondary: '#60A5FA' },
                      { name: 'Emerald Tech', primary: '#065F46', secondary: '#34D399' },
                      { name: 'Sunset Coral', primary: '#BE123C', secondary: '#FB923C' },
                      { name: 'Midnight Violet', primary: '#581C87', secondary: '#C084FC' },
                      { name: 'Deep Slate', primary: '#0F172A', secondary: '#38BDF8' },
                    ].map((pal, idx) => {
                      const isSelected = chatbotForm.primaryColor === pal.primary && chatbotForm.secondaryColor === pal.secondary;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setChatbotForm({ ...chatbotForm, primaryColor: pal.primary, secondaryColor: pal.secondary })}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.28rem 0.55rem',
                            borderRadius: '6px',
                            border: isSelected ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                            backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF',
                            fontSize: '0.6875rem',
                            fontWeight: isSelected ? 700 : 600,
                            color: isSelected ? '#4338CA' : '#334155',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ display: 'inline-flex', width: '16px', height: '16px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <span style={{ width: '50%', height: '100%', backgroundColor: pal.primary }} />
                            <span style={{ width: '50%', height: '100%', backgroundColor: pal.secondary }} />
                          </span>
                          {pal.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Pickers Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  {/* Chatbot Primary Color */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.4rem' }}>
                      Launcher & Header Primary
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label
                        title="Click to select Chatbot Primary Color"
                        style={{
                          position: 'relative',
                          width: '34px',
                          height: '34px',
                          minWidth: '34px',
                          borderRadius: '6px',
                          backgroundColor: chatbotForm.primaryColor || '#18181B',
                          border: '2px solid rgba(0,0,0,0.15)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="color"
                          value={chatbotForm.primaryColor || '#18181B'}
                          onChange={(e) => setChatbotForm({ ...chatbotForm, primaryColor: e.target.value })}
                          style={{ position: 'absolute', top: '-20px', left: '-20px', width: '80px', height: '80px', opacity: 0, cursor: 'pointer' }}
                        />
                      </label>
                      <input
                        type="text"
                        value={chatbotForm.primaryColor || ''}
                        onChange={(e) => setChatbotForm({ ...chatbotForm, primaryColor: e.target.value })}
                        placeholder="#18181B"
                        style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', outline: 'none' }}
                      />
                    </div>
                    <span style={{ display: 'block', fontSize: '0.625rem', color: '#64748B', marginTop: '0.35rem' }}>
                      Floating button, header banner, bubbles & send button
                    </span>
                  </div>

                  {/* Chatbot Secondary / Accent Color */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.4rem' }}>
                      Chatbot Accent / Border
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label
                        title="Click to select Chatbot Accent Color"
                        style={{
                          position: 'relative',
                          width: '34px',
                          height: '34px',
                          minWidth: '34px',
                          borderRadius: '6px',
                          backgroundColor: chatbotForm.secondaryColor || '#F59E0B',
                          border: '2px solid rgba(0,0,0,0.15)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="color"
                          value={chatbotForm.secondaryColor || '#F59E0B'}
                          onChange={(e) => setChatbotForm({ ...chatbotForm, secondaryColor: e.target.value })}
                          style={{ position: 'absolute', top: '-20px', left: '-20px', width: '80px', height: '80px', opacity: 0, cursor: 'pointer' }}
                        />
                      </label>
                      <input
                        type="text"
                        value={chatbotForm.secondaryColor || ''}
                        onChange={(e) => setChatbotForm({ ...chatbotForm, secondaryColor: e.target.value })}
                        placeholder="#F59E0B"
                        style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', outline: 'none' }}
                      />
                    </div>
                    <span style={{ display: 'block', fontSize: '0.625rem', color: '#64748B', marginTop: '0.35rem' }}>
                      Assistant role, header border, launcher ring & icon accent
                    </span>
                  </div>
                </div>
              </div>

              {/* Welcome Greeting */}
              <div>
                <label style={adminStyles.label}>Welcome Greeting Message</label>
                <textarea
                  rows={3}
                  value={chatbotForm.welcomeMessage || ''}
                  onChange={(e) => setChatbotForm({ ...chatbotForm, welcomeMessage: e.target.value })}
                  placeholder="Greeting shown when visitors open the assistant..."
                  style={adminStyles.textarea}
                />
              </div>

              {/* Support Contacts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={adminStyles.label}>Support Fallback Email</label>
                  <input
                    type="email"
                    value={chatbotForm.supportEmail || ''}
                    onChange={(e) => setChatbotForm({ ...chatbotForm, supportEmail: e.target.value })}
                    placeholder="hello@azaroth-techhive.com"
                    style={adminStyles.input}
                  />
                </div>

                <div>
                  <label style={adminStyles.label}>Support Fallback Phone</label>
                  <input
                    type="text"
                    value={chatbotForm.supportPhone || ''}
                    onChange={(e) => setChatbotForm({ ...chatbotForm, supportPhone: e.target.value })}
                    placeholder="+91 6379480931"
                    style={adminStyles.input}
                  />
                </div>
              </div>

              {/* Quick Prompt Chips Manager */}
              <div>
                <label style={adminStyles.label}>Interactive Suggestion Chips (Quick Prompts)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.625rem', minHeight: '32px' }}>
                  {(chatbotForm.quickPrompts || []).map((prompt, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '9999px',
                        backgroundColor: '#EEF2FF',
                        color: '#4338CA',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid #C7D2FE',
                      }}
                    >
                      {prompt}
                      <button
                        type="button"
                        onClick={() => handleRemoveQuickPrompt(prompt)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#6366F1', display: 'flex' }}
                        title="Remove chip"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                  {(!chatbotForm.quickPrompts || chatbotForm.quickPrompts.length === 0) && (
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>No suggestion chips configured.</span>
                  )}
                </div>

                {/* Add Chip Input */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={newPromptInput}
                    onChange={(e) => setNewPromptInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddQuickPrompt(); } }}
                    placeholder="Enter prompt (e.g. 'Software Architecture', 'Pricing')"
                    style={{ ...adminStyles.input, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddQuickPrompt}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#1E293B',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Plus size={14} /> Add Chip
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Chatbot Preview Widget */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Assistant Preview
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#4F46E5', fontWeight: 700 }}>
                  Theme Synchronized
                </span>
              </div>

              {/* Chatbot Window Preview Card */}
              {(() => {
                const previewBotPrimary = chatbotForm.primaryColor || themeForm.primaryColor || '#18181B';
                const previewBotSecondary = chatbotForm.secondaryColor || themeForm.secondaryColor || '#F59E0B';
                return (
                  <>
                    <div
                      style={{
                        borderRadius: '12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Header */}
                      <div
                        style={{
                          background: `linear-gradient(135deg, ${previewBotPrimary} 0%, #09090B 100%)`,
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: `2px solid ${previewBotSecondary}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255,255,255,0.15)',
                              color: previewBotSecondary,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Bot size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#FFFFFF' }}>
                              {chatbotForm.botName || 'Azaroth AI Guide'}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: previewBotSecondary, fontWeight: 600 }}>
                              {chatbotForm.botRole || 'Automated engineering assistant'}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} title="Online" />
                        </div>
                      </div>

                      {/* Messages Body */}
                      <div style={{ padding: '0.875rem', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {/* Greeting Bubble */}
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              backgroundColor: previewBotPrimary,
                              color: previewBotSecondary,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Bot size={12} />
                          </div>
                          <div
                            style={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              borderRadius: '10px',
                              padding: '0.6rem 0.75rem',
                              fontSize: '0.75rem',
                              lineHeight: 1.45,
                              color: '#1E293B',
                            }}
                          >
                            {chatbotForm.welcomeMessage || 'Welcome! How can I assist you?'}
                          </div>
                        </div>

                        {/* Chips Preview */}
                        {chatbotForm.quickPrompts && chatbotForm.quickPrompts.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.25rem' }}>
                            {chatbotForm.quickPrompts.slice(0, 3).map((prompt, idx) => (
                              <span
                                key={idx}
                                style={{
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '9999px',
                                  backgroundColor: '#FFFFFF',
                                  border: `1px solid ${previewBotPrimary}40`,
                                  color: previewBotPrimary,
                                  fontSize: '0.625rem',
                                  fontWeight: 600,
                                }}
                              >
                                {prompt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Fake Input */}
                      <div style={{ padding: '0.625rem 0.75rem', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, padding: '0.35rem 0.6rem', borderRadius: '6px', backgroundColor: '#F1F5F9', fontSize: '0.6875rem', color: '#94A3B8' }}>
                          Type your message...
                        </div>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            backgroundColor: previewBotPrimary,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MessageSquare size={13} />
                        </div>
                      </div>
                    </div>

                    {/* Floating Button Mockup */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>Floating Launcher:</span>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: previewBotPrimary,
                          border: `2px solid ${previewBotSecondary}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          boxShadow: `0 4px 12px ${previewBotPrimary}45, 0 0 8px ${previewBotSecondary}35`,
                        }}
                      >
                        <MessageSquare size={16} />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* ========================================================
            4. DYNAMIC MODULES & SECTIONS MANAGEMENT (Layers)
        ======================================================== */}
        <div style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', borderBottom: `1px solid ${adminColors.slate.borderLight}`, paddingBottom: '0.875rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: adminColors.emerald.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={17} color={adminColors.emerald.text} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: adminColors.emerald.text, margin: 0 }}>
                4. Website Modules & Navigation Sections Management
              </h2>
              <span style={{ fontSize: '0.75rem', color: adminColors.slate.textMuted }}>
                Enable or disable services and website modules. Disabled items remain manageable here and can be re-enabled at any time.
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {modulesList.map((mod) => {
              const isEnabled = mod.isEnabled;
              return (
                <div
                  key={mod.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: `1px solid ${isEnabled ? '#E2E8F0' : '#FED7AA'}`,
                    backgroundColor: isEnabled ? '#FFFFFF' : '#FFFBEB',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease-in-out',
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isEnabled ? '#18181B' : '#D97706' }}>
                        #{mod.order}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>
                        {mod.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.3 }}>
                      {mod.description}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#94A3B8', fontFamily: 'monospace', marginTop: '0.25rem' }}>
                      Route: {mod.path}
                    </div>
                  </div>

                  {/* Enable / Disable Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleModuleItem(mod.slug)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: `1px solid ${isEnabled ? '#A7F3D0' : '#FDE68A'}`,
                      backgroundColor: isEnabled ? '#ECFDF5' : '#FEF3C7',
                      color: isEnabled ? '#047857' : '#B45309',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                    title={isEnabled ? 'Click to disable module' : 'Click to enable module'}
                  >
                    {isEnabled ? <Eye size={15} /> : <EyeOff size={15} />}
                    <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            5. HEADQUARTERS & CONTACT CHANNELS (Emerald Accent)
        ======================================================== */}
        <div style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', borderBottom: `1px solid ${adminColors.slate.borderLight}`, paddingBottom: '0.875rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: adminColors.emerald.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={17} color={adminColors.emerald.text} />
            </div>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: adminColors.emerald.text, margin: 0 }}>
              5. Headquarters & Contact Channels
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={adminStyles.label}>Head Office Physical Address</label>
              <input
                type="text"
                value={formData.headquarters || ''}
                onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                style={adminStyles.input}
              />
            </div>

            <div>
              <label style={adminStyles.label}>General / Support Email</label>
              <input
                type="email"
                value={formData.supportEmail || ''}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                style={adminStyles.input}
              />
            </div>

            <div>
              <label style={adminStyles.label}>Official Phone Number</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={adminStyles.input}
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            6. SOCIAL MEDIA & PROFILES (Amber Accent)
        ======================================================== */}
        <div style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', borderBottom: `1px solid ${adminColors.slate.borderLight}`, paddingBottom: '0.875rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: adminColors.amber.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={17} color={adminColors.amber.text} />
            </div>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: adminColors.amber.text, margin: 0 }}>
              6. Social Profiles & Developer Links
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={adminStyles.label}>LinkedIn URL</label>
              <input
                type="text"
                value={formData.linkedinUrl || ''}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                style={adminStyles.input}
              />
            </div>

            <div>
              <label style={adminStyles.label}>Twitter / X URL</label>
              <input
                type="text"
                value={formData.twitterUrl || ''}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                style={adminStyles.input}
              />
            </div>

            <div>
              <label style={adminStyles.label}>GitHub URL</label>
              <input
                type="text"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                style={adminStyles.input}
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            7. GLOBAL SEO METADATA (Rose Accent)
        ======================================================== */}
        <div style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', borderBottom: `1px solid ${adminColors.slate.borderLight}`, paddingBottom: '0.875rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: adminColors.rose.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={17} color={adminColors.rose.text} />
            </div>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: adminColors.rose.text, margin: 0 }}>
              7. Global Search & SEO Metadata
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
            <div>
              <label style={adminStyles.label}>Global HTML Title Tag</label>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                style={adminStyles.input}
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            8. FOOTER ARCHITECTURE, ALIGNMENT & LEGAL PORTAL
        ======================================================== */}
        <div style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', borderBottom: `1px solid ${adminColors.slate.borderLight}`, paddingBottom: '0.875rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: adminColors.amber.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layout size={17} color={adminColors.amber.text} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: adminColors.amber.text, margin: 0 }}>
                8. Footer Architecture &amp; Column Orientation
              </h2>
              <span style={{ fontSize: '0.75rem', color: adminColors.slate.textMuted }}>
                Configure whether footer content is aligned standard (left-to-right) or reversed (right-to-left), and customize copyright text and policy links.
              </span>
            </div>
          </div>

          {/* Footer Alignment Selector Cards */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ ...adminStyles.label, marginBottom: '0.75rem' }}>
              Footer Column Alignment &amp; Flow
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {/* Option A: Reversed Layout */}
              <div
                onClick={() => setFormData({ ...formData, footerLayout: 'reversed' })}
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: (formData.footerLayout || 'reversed') === 'reversed'
                    ? '2px solid var(--color-primary-button, #18181B)'
                    : '1px solid #E2E8F0',
                  backgroundColor: (formData.footerLayout || 'reversed') === 'reversed' ? '#F8FAFC' : '#FFFFFF',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlignRight size={18} color="var(--color-brand-gold, #F59E0B)" />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>
                      Reversed Alignment (Left ⇄ Right)
                    </span>
                  </div>
                  {(formData.footerLayout || 'reversed') === 'reversed' && (
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 700, backgroundColor: 'var(--color-primary-button, #18181B)', color: '#FFFFFF' }}>
                      Active
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                  <strong>Contact details &amp; social channels on the Left</strong>, Services and Quick Links in the center, and <strong>Brand Logo &amp; Tagline on the Right</strong>.
                </p>
                <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.6875rem', color: '#94A3B8' }}>
                  <span style={{ padding: '0.2rem 0.4rem', backgroundColor: '#EDE9FE', color: '#7C3AED', borderRadius: '4px' }}>[1] Contact &amp; Social</span>
                  <span>&rarr;</span>
                  <span style={{ padding: '0.2rem 0.4rem', backgroundColor: '#F1F5F9', borderRadius: '4px' }}>[2] Services</span>
                  <span>&rarr;</span>
                  <span style={{ padding: '0.2rem 0.4rem', backgroundColor: '#F1F5F9', borderRadius: '4px' }}>[3] Links</span>
                  <span>&rarr;</span>
                  <span style={{ padding: '0.2rem 0.4rem', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '4px' }}>[4] Logo &amp; Tagline</span>
                </div>
              </div>

              {/* Option B: Standard Layout */}
              <div
                onClick={() => setFormData({ ...formData, footerLayout: 'standard' })}
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: formData.footerLayout === 'standard'
                    ? '2px solid var(--color-primary-button, #18181B)'
                    : '1px solid #E2E8F0',
                  backgroundColor: formData.footerLayout === 'standard' ? '#F8FAFC' : '#FFFFFF',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlignLeft size={18} color="#64748B" />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>
                      Standard Alignment (Left ➔ Right)
                    </span>
                  </div>
                  {formData.footerLayout === 'standard' && (
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 700, backgroundColor: 'var(--color-primary-button, #18181B)', color: '#FFFFFF' }}>
                      Active
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                  <strong>Brand Logo &amp; Tagline on the Left</strong>, Quick Links and Services in the center, and <strong>Contact details &amp; social channels on the Right</strong>.
                </p>
                <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.6875rem', color: '#94A3B8' }}>
                  <span style={{ padding: '0.2rem 0.4rem', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '4px' }}>[1] Logo &amp; Tagline</span>
                  <span>&rarr;</span>
                  <span style={{ padding: '0.2rem 0.4rem', backgroundColor: '#F1F5F9', borderRadius: '4px' }}>[2] Links</span>
                  <span>&rarr;</span>
                  <span style={{ padding: '0.2rem 0.4rem', backgroundColor: '#F1F5F9', borderRadius: '4px' }}>[3] Services</span>
                  <span>&rarr;</span>
                  <span style={{ padding: '0.2rem 0.4rem', backgroundColor: '#EDE9FE', color: '#7C3AED', borderRadius: '4px' }}>[4] Contact &amp; Social</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Notice Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={adminStyles.label}>
              Copyright Notice Text
            </label>
            <input
              type="text"
              value={formData.copyright_text || ''}
              onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
              placeholder="All rights reserved © 2026 Azaroth Tech-Hive Inc"
              style={adminStyles.input}
            />
          </div>

          {/* Policy & Admin Access Notice */}
          <div style={{ padding: '0.875rem 1rem', backgroundColor: '#F1F5F9', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8125rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontSize: '1rem' }}>🛡️</span>
            <span>
              <strong>Built-in Footer Links:</strong> The footer bottom bar automatically provides quick links for <strong>Privacy Policy</strong>, <strong>Cookies</strong>, and a discrete <strong>Admin Portal</strong> access link (`/admin/login`).
            </span>
          </div>
        </div>

        {/* Sticky Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '1rem', zIndex: 30, backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              ...adminStyles.primaryButton,
              padding: '0.875rem 2.5rem',
              fontSize: '0.9375rem',
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            <Save size={18} /> {isSaving ? 'Saving Configurations...' : 'Save Settings & Theme'}
          </button>
        </div>
      </form>

      {/* ========================================================
          CUSTOM THEME CREATOR & PALETTE CUSTOMIZER MODAL
      ======================================================== */}
      {isCustomModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setIsCustomModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
              border: '1px solid #E2E8F0',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} color="#4F46E5" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Customize Your Required Theme
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                    Fine-tune bespoke corporate palette values and apply immediately.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.25rem', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Theme Name */}
            <div>
              <label style={adminStyles.label}>Custom Theme / Organization Palette Name</label>
              <input
                type="text"
                value={customThemeName}
                onChange={(e) => setCustomThemeName(e.target.value)}
                placeholder="e.g. Azaroth Azure & Amber, TechHive Purple"
                style={adminStyles.input}
              />
            </div>

            {/* Color Swatch & Hex Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {/* Primary Color */}
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                  Primary Brand
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ position: 'relative', width: '36px', height: '36px', minWidth: '36px', borderRadius: '6px', backgroundColor: customColors.primaryColor || '#18181B', border: '1px solid #CBD5E1', cursor: 'pointer', overflow: 'hidden' }}>
                    <input
                      type="color"
                      value={customColors.primaryColor || '#18181B'}
                      onChange={(e) => setCustomColors({ ...customColors, primaryColor: e.target.value })}
                      style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                    />
                  </label>
                  <input
                    type="text"
                    value={customColors.primaryColor || ''}
                    onChange={(e) => setCustomColors({ ...customColors, primaryColor: e.target.value })}
                    style={{ ...adminStyles.input, padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                  Secondary / Gold
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ position: 'relative', width: '36px', height: '36px', minWidth: '36px', borderRadius: '6px', backgroundColor: customColors.secondaryColor || '#F59E0B', border: '1px solid #CBD5E1', cursor: 'pointer', overflow: 'hidden' }}>
                    <input
                      type="color"
                      value={customColors.secondaryColor || '#F59E0B'}
                      onChange={(e) => setCustomColors({ ...customColors, secondaryColor: e.target.value })}
                      style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                    />
                  </label>
                  <input
                    type="text"
                    value={customColors.secondaryColor || ''}
                    onChange={(e) => setCustomColors({ ...customColors, secondaryColor: e.target.value })}
                    style={{ ...adminStyles.input, padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                  Accent / Highlights
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ position: 'relative', width: '36px', height: '36px', minWidth: '36px', borderRadius: '6px', backgroundColor: customColors.accentColor || '#7C3AED', border: '1px solid #CBD5E1', cursor: 'pointer', overflow: 'hidden' }}>
                    <input
                      type="color"
                      value={customColors.accentColor || '#7C3AED'}
                      onChange={(e) => setCustomColors({ ...customColors, accentColor: e.target.value })}
                      style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                    />
                  </label>
                  <input
                    type="text"
                    value={customColors.accentColor || ''}
                    onChange={(e) => setCustomColors({ ...customColors, accentColor: e.target.value })}
                    style={{ ...adminStyles.input, padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* Background Color */}
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                  Canvas Background
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ position: 'relative', width: '36px', height: '36px', minWidth: '36px', borderRadius: '6px', backgroundColor: customColors.backgroundColor || '#FFFFFF', border: '1px solid #CBD5E1', cursor: 'pointer', overflow: 'hidden' }}>
                    <input
                      type="color"
                      value={customColors.backgroundColor || '#FFFFFF'}
                      onChange={(e) => setCustomColors({ ...customColors, backgroundColor: e.target.value })}
                      style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                    />
                  </label>
                  <input
                    type="text"
                    value={customColors.backgroundColor || ''}
                    onChange={(e) => setCustomColors({ ...customColors, backgroundColor: e.target.value })}
                    style={{ ...adminStyles.input, padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* Typography Color */}
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                  Main Text
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ position: 'relative', width: '36px', height: '36px', minWidth: '36px', borderRadius: '6px', backgroundColor: customColors.textColor || '#0F172A', border: '1px solid #CBD5E1', cursor: 'pointer', overflow: 'hidden' }}>
                    <input
                      type="color"
                      value={customColors.textColor || '#0F172A'}
                      onChange={(e) => setCustomColors({ ...customColors, textColor: e.target.value })}
                      style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                    />
                  </label>
                  <input
                    type="text"
                    value={customColors.textColor || ''}
                    onChange={(e) => setCustomColors({ ...customColors, textColor: e.target.value })}
                    style={{ ...adminStyles.input, padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* Border Color */}
              <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                  Border / Dividers
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ position: 'relative', width: '36px', height: '36px', minWidth: '36px', borderRadius: '6px', backgroundColor: customColors.borderColor || '#E2E8F0', border: '1px solid #CBD5E1', cursor: 'pointer', overflow: 'hidden' }}>
                    <input
                      type="color"
                      value={customColors.borderColor || '#E2E8F0'}
                      onChange={(e) => setCustomColors({ ...customColors, borderColor: e.target.value })}
                      style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}
                    />
                  </label>
                  <input
                    type="text"
                    value={customColors.borderColor || ''}
                    onChange={(e) => setCustomColors({ ...customColors, borderColor: e.target.value })}
                    style={{ ...adminStyles.input, padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Render within Modal */}
            <div style={{ backgroundColor: customColors.backgroundColor || '#FFFFFF', border: `1px solid ${customColors.borderColor || '#E2E8F0'}`, borderRadius: '12px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Custom Theme Preview
                </span>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: customColors.secondaryColor || '#F59E0B', color: '#FFFFFF', fontSize: '0.6875rem', fontWeight: 700 }}>
                  Active Tag
                </span>
              </div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.125rem', fontWeight: 800, color: customColors.textColor || '#0F172A' }}>
                Empowering Enterprise Digital Systems
              </h4>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem', color: customColors.textColor || '#0F172A', opacity: 0.8, lineHeight: 1.5 }}>
                High-availability cloud engineering and autonomous architecture built for resilient operations.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    backgroundColor: customColors.primaryColor || '#18181B',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    boxShadow: `0 4px 14px ${customColors.primaryColor || '#18181B'}35`,
                  }}
                >
                  Explore Services &rarr;
                </button>
                <button
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    backgroundColor: 'transparent',
                    color: customColors.textColor || '#0F172A',
                    border: `1px solid ${customColors.borderColor || '#E2E8F0'}`,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomTheme}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary-button, #18181B)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                Save &amp; Apply Custom Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
