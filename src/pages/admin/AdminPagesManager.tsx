// src/pages/admin/AdminPagesManager.tsx
import React, { useState } from 'react';
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  HeartHandshake,
  Compass,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { adminColors, adminStyles } from '../../styles/adminTheme';

type TabKey = 'home' | 'about' | 'values' | 'delivery' | 'privacy' | 'terms';

export const AdminPagesManager: React.FC = () => {
  const { pages, updatePage } = useCMS();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Local state initialized from CMS context
  const [homeData, setHomeData] = useState<any>(pages.home || {});
  const [aboutData, setAboutData] = useState<any>(pages.about || {});
  const [valuesData, setValuesData] = useState<any>(pages.values || {});
  const [deliveryData, setDeliveryData] = useState<any>(pages['delivery-framework'] || {});
  const [privacyData, setPrivacyData] = useState<any>(pages['privacy-policy'] || {});
  const [termsData, setTermsData] = useState<any>(pages['terms-of-service'] || {});

  // Update local states if pages context changes
  React.useEffect(() => {
    if (pages.home) setHomeData(pages.home);
    if (pages.about) setAboutData(pages.about);
    if (pages.values) setValuesData(pages.values);
    if (pages['delivery-framework']) setDeliveryData(pages['delivery-framework']);
    if (pages['privacy-policy']) setPrivacyData(pages['privacy-policy']);
    if (pages['terms-of-service']) setTermsData(pages['terms-of-service']);
  }, [pages]);

  const handleSave = async (slug: string, data: any, title: string) => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updatePage(slug, data, title);
      setSaveStatus(`Changes to '${title}' published successfully!`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus(`Error saving: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: 'home', label: 'Home Page', icon: Sparkles },
    { key: 'about', label: 'About Company', icon: Compass },
    { key: 'values', label: 'Core Values & Principles', icon: HeartHandshake },
    { key: 'delivery', label: 'Delivery Framework', icon: Layers },
    { key: 'privacy', label: 'Privacy Policy', icon: ShieldAlert },
    { key: 'terms', label: 'Terms of Service', icon: FileText },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: adminColors.slate.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: adminColors.indigo.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} color={adminColors.indigo.text} />
            </div>
            Website Pages & Module Content
          </h1>
          <p style={{ fontSize: '0.875rem', color: adminColors.slate.textMuted, marginTop: '0.5rem', marginLeft: '3.25rem' }}>
            Modify copy, headlines, FAQs, methodology phases, and legal policies. Every change updates the live site instantly.
          </p>
        </div>
      </div>

      {/* Save Notification */}
      {saveStatus && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            backgroundColor: saveStatus.startsWith('Error') ? adminColors.rose.light : adminColors.emerald.light,
            border: `1px solid ${saveStatus.startsWith('Error') ? adminColors.rose.border : adminColors.emerald.border}`,
            color: saveStatus.startsWith('Error') ? adminColors.rose.text : adminColors.emerald.text,
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          {saveStatus.startsWith('Error') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: `1px solid ${adminColors.slate.border}`,
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                backgroundColor: isActive ? adminColors.indigo.light : 'transparent',
                borderBottom: isActive ? `2px solid ${adminColors.indigo.base}` : '2px solid transparent',
                color: isActive ? adminColors.indigo.text : adminColors.slate.textMuted,
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} color={isActive ? adminColors.indigo.base : adminColors.slate.textMuted} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. HOME PAGE EDITOR */}
      {/* ========================================================= */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Hero Section */}
          <section style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: adminColors.indigo.text, margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              1. Hero Banner Module
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div>
                <label style={adminStyles.label}>Hero Badge / Eyebrow</label>
                <input
                  type="text"
                  value={homeData.hero?.badge || ''}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, badge: e.target.value } })}
                  style={adminStyles.input}
                />
              </div>

              <div>
                <label style={adminStyles.label}>Main Headline (H1)</label>
                <input
                  type="text"
                  value={homeData.hero?.title || ''}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, title: e.target.value } })}
                  style={{ ...adminStyles.input, fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={adminStyles.label}>Subheading Paragraph</label>
                <textarea
                  rows={3}
                  value={homeData.hero?.subtitle || ''}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, subtitle: e.target.value } })}
                  style={adminStyles.textarea}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={adminStyles.label}>Primary CTA Button Label</label>
                  <input
                    type="text"
                    value={homeData.hero?.primaryCtaText || ''}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, primaryCtaText: e.target.value } })}
                    style={adminStyles.input}
                  />
                </div>
                <div>
                  <label style={adminStyles.label}>Primary CTA Destination Link</label>
                  <input
                    type="text"
                    value={homeData.hero?.primaryCtaLink || ''}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, primaryCtaLink: e.target.value } })}
                    style={adminStyles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={adminStyles.label}>Secondary CTA Button Label</label>
                  <input
                    type="text"
                    value={homeData.hero?.secondaryCtaText || ''}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, secondaryCtaText: e.target.value } })}
                    style={adminStyles.input}
                  />
                </div>
                <div>
                  <label style={adminStyles.label}>Secondary CTA Destination Link</label>
                  <input
                    type="text"
                    value={homeData.hero?.secondaryCtaLink || ''}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, secondaryCtaLink: e.target.value } })}
                    style={adminStyles.input}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section Headings */}
          <section style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: adminColors.indigo.text, margin: '0 0 1.25rem' }}>
              2. Products & Services Section Intros
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: adminColors.slate.cardMuted, borderRadius: '10px', border: `1px solid ${adminColors.slate.borderLight}` }}>
                <h4 style={{ margin: '0 0 0.75rem', color: adminColors.indigo.text, fontWeight: 700 }}>Products Catalog Section</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Badge"
                    value={homeData.productsSection?.badge || ''}
                    onChange={(e) => setHomeData({ ...homeData, productsSection: { ...homeData.productsSection, badge: e.target.value } })}
                    style={adminStyles.input}
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={homeData.productsSection?.title || ''}
                    onChange={(e) => setHomeData({ ...homeData, productsSection: { ...homeData.productsSection, title: e.target.value } })}
                    style={adminStyles.input}
                  />
                  <textarea
                    rows={2}
                    placeholder="Subtitle"
                    value={homeData.productsSection?.subtitle || ''}
                    onChange={(e) => setHomeData({ ...homeData, productsSection: { ...homeData.productsSection, subtitle: e.target.value } })}
                    style={adminStyles.textarea}
                  />
                </div>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: adminColors.slate.cardMuted, borderRadius: '10px', border: `1px solid ${adminColors.slate.borderLight}` }}>
                <h4 style={{ margin: '0 0 0.75rem', color: adminColors.emerald.text, fontWeight: 700 }}>Services Section</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Badge"
                    value={homeData.servicesSection?.badge || ''}
                    onChange={(e) => setHomeData({ ...homeData, servicesSection: { ...homeData.servicesSection, badge: e.target.value } })}
                    style={adminStyles.input}
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={homeData.servicesSection?.title || ''}
                    onChange={(e) => setHomeData({ ...homeData, servicesSection: { ...homeData.servicesSection, title: e.target.value } })}
                    style={adminStyles.input}
                  />
                  <textarea
                    rows={2}
                    placeholder="Subtitle"
                    value={homeData.servicesSection?.subtitle || ''}
                    onChange={(e) => setHomeData({ ...homeData, servicesSection: { ...homeData.servicesSection, subtitle: e.target.value } })}
                    style={adminStyles.textarea}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FAQs Manager */}
          <section style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: adminColors.indigo.text, margin: 0 }}>
                3. Frequently Asked Questions (FAQ) Module
              </h2>
              <button
                type="button"
                onClick={() => {
                  const currentFaqs = homeData.faqSection?.faqs || [];
                  setHomeData({
                    ...homeData,
                    faqSection: {
                      ...homeData.faqSection,
                      faqs: [...currentFaqs, { question: 'New Question', answer: 'Provide the answer here.' }]
                    }
                  });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.875rem',
                  backgroundColor: adminColors.indigo.light,
                  border: `1px solid ${adminColors.indigo.border}`,
                  borderRadius: '6px',
                  color: adminColors.indigo.text,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <Plus size={15} /> Add FAQ
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(homeData.faqSection?.faqs || []).map((faq: any, idx: number) => (
                <div key={idx} style={{ padding: '1rem', backgroundColor: adminColors.slate.cardMuted, borderRadius: '8px', border: `1px solid ${adminColors.slate.borderLight}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: adminColors.amber.text }}>Question #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newFaqs = (homeData.faqSection?.faqs || []).filter((_: any, i: number) => i !== idx);
                        setHomeData({ ...homeData, faqSection: { ...homeData.faqSection, faqs: newFaqs } });
                      }}
                      style={{
                        ...adminStyles.dangerButton,
                        padding: '0.25rem 0.5rem',
                      }}
                      title="Delete question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const newFaqs = [...(homeData.faqSection?.faqs || [])];
                      newFaqs[idx].question = e.target.value;
                      setHomeData({ ...homeData, faqSection: { ...homeData.faqSection, faqs: newFaqs } });
                    }}
                    style={{ ...adminStyles.input, marginBottom: '0.5rem' }}
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...(homeData.faqSection?.faqs || [])];
                      newFaqs[idx].answer = e.target.value;
                      setHomeData({ ...homeData, faqSection: { ...homeData.faqSection, faqs: newFaqs } });
                    }}
                    style={adminStyles.textarea}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA Banner */}
          <section style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: adminColors.indigo.text, margin: '0 0 1.25rem' }}>
              4. Bottom Conversion Banner
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div>
                <label style={adminStyles.label}>Banner Headline</label>
                <input
                  type="text"
                  value={homeData.finalCta?.title || ''}
                  onChange={(e) => setHomeData({ ...homeData, finalCta: { ...homeData.finalCta, title: e.target.value } })}
                  style={adminStyles.input}
                />
              </div>
              <div>
                <label style={adminStyles.label}>Banner Subtitle</label>
                <textarea
                  rows={2}
                  value={homeData.finalCta?.subtitle || ''}
                  onChange={(e) => setHomeData({ ...homeData, finalCta: { ...homeData.finalCta, subtitle: e.target.value } })}
                  style={adminStyles.textarea}
                />
              </div>
            </div>
          </section>

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '1rem', zIndex: 10 }}>
            <button
              onClick={() => handleSave('home', homeData, 'Home Page')}
              disabled={isSaving}
              style={{
                ...adminStyles.primaryButton,
                padding: '0.875rem 2.25rem',
                fontSize: '0.9375rem',
              }}
            >
              <Save size={18} />
              {isSaving ? 'Publishing...' : 'Save & Publish Home Page'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ABOUT COMPANY EDITOR */}
      {/* ========================================================= */}
      {activeTab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: adminColors.indigo.text, margin: '0 0 1.25rem' }}>
              About Page Header & Mission / Vision
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div>
                <label style={adminStyles.label}>Badge</label>
                <input
                  type="text"
                  value={aboutData.badge || ''}
                  onChange={(e) => setAboutData({ ...aboutData, badge: e.target.value })}
                  style={adminStyles.input}
                />
              </div>

              <div>
                <label style={adminStyles.label}>Hero Headline</label>
                <input
                  type="text"
                  value={aboutData.heroTitle || ''}
                  onChange={(e) => setAboutData({ ...aboutData, heroTitle: e.target.value })}
                  style={{ ...adminStyles.input, fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={adminStyles.label}>Hero Narrative Description</label>
                <textarea
                  rows={4}
                  value={aboutData.heroDescription || ''}
                  onChange={(e) => setAboutData({ ...aboutData, heroDescription: e.target.value })}
                  style={adminStyles.textarea}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: adminColors.slate.cardMuted, borderRadius: '8px', border: `1px solid ${adminColors.slate.borderLight}` }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: adminColors.amber.text, fontWeight: 700 }}>Vision Statement</h4>
                  <textarea
                    rows={4}
                    value={aboutData.vision?.statement || ''}
                    onChange={(e) => setAboutData({ ...aboutData, vision: { ...aboutData.vision, statement: e.target.value } })}
                    style={adminStyles.textarea}
                  />
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: adminColors.slate.cardMuted, borderRadius: '8px', border: `1px solid ${adminColors.slate.borderLight}` }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: adminColors.emerald.text, fontWeight: 700 }}>Mission Statement</h4>
                  <textarea
                    rows={4}
                    value={aboutData.mission?.statement || ''}
                    onChange={(e) => setAboutData({ ...aboutData, mission: { ...aboutData.mission, statement: e.target.value } })}
                    style={adminStyles.textarea}
                  />
                </div>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '1rem', zIndex: 10 }}>
            <button
              onClick={() => handleSave('about', aboutData, 'About Page')}
              disabled={isSaving}
              style={{
                ...adminStyles.primaryButton,
                padding: '0.875rem 2.25rem',
                fontSize: '0.9375rem',
              }}
            >
              <Save size={18} />
              {isSaving ? 'Publishing...' : 'Save & Publish About Page'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CORE VALUES & PRINCIPLES EDITOR */}
      {/* ========================================================= */}
      {activeTab === 'values' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: adminColors.indigo.text, margin: 0 }}>
                  Core Values & Engineering Principles
                </h2>
                <p style={{ fontSize: '0.8125rem', color: adminColors.slate.textMuted, marginTop: '0.25rem' }}>
                  Manage the numbered principles that appear across the Values page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentVals = valuesData.values || [];
                  const nextNum = (currentVals.length + 1).toString().padStart(2, '0');
                  setValuesData({
                    ...valuesData,
                    values: [
                      ...currentVals,
                      { number: nextNum, title: 'New Principle', description: 'Describe principle here.', iconName: 'Lightbulb' }
                    ]
                  });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: adminColors.amber.light,
                  border: `1px solid ${adminColors.amber.border}`,
                  borderRadius: '6px',
                  color: adminColors.amber.text,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} /> Add Principle
              </button>
            </div>

            {/* List of principles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(valuesData.values || []).map((val: any, idx: number) => (
                <div key={idx} style={{ padding: '1.25rem', backgroundColor: adminColors.slate.cardMuted, borderRadius: '8px', border: `1px solid ${adminColors.slate.borderLight}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={val.number}
                        onChange={(e) => {
                          const newV = [...(valuesData.values || [])];
                          newV[idx].number = e.target.value;
                          setValuesData({ ...valuesData, values: newV });
                        }}
                        style={{ width: '48px', textAlign: 'center', backgroundColor: adminColors.amber.light, border: `1px solid ${adminColors.amber.border}`, color: adminColors.amber.text, fontWeight: 700, borderRadius: '4px', padding: '0.25rem' }}
                      />
                      <input
                        type="text"
                        value={val.title}
                        onChange={(e) => {
                          const newV = [...(valuesData.values || [])];
                          newV[idx].title = e.target.value;
                          setValuesData({ ...valuesData, values: newV });
                        }}
                        style={{ ...adminStyles.input, width: '320px', fontWeight: 600 }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <select
                        value={val.iconName || 'Lightbulb'}
                        onChange={(e) => {
                          const newV = [...(valuesData.values || [])];
                          newV[idx].iconName = e.target.value;
                          setValuesData({ ...valuesData, values: newV });
                        }}
                        style={adminStyles.select}
                      >
                        <option value="Lightbulb">Lightbulb</option>
                        <option value="ShieldCheck">ShieldCheck</option>
                        <option value="Maximize2">Maximize2</option>
                        <option value="CheckCircle">CheckCircle</option>
                        <option value="Users">Users</option>
                        <option value="TrendingUp">TrendingUp</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const newV = (valuesData.values || []).filter((_: any, i: number) => i !== idx);
                          setValuesData({ ...valuesData, values: newV });
                        }}
                        style={{
                          ...adminStyles.dangerButton,
                          padding: '0.25rem 0.5rem',
                        }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={val.description}
                    onChange={(e) => {
                      const newV = [...(valuesData.values || [])];
                      newV[idx].description = e.target.value;
                      setValuesData({ ...valuesData, values: newV });
                    }}
                    style={adminStyles.textarea}
                  />
                </div>
              ))}
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '1rem', zIndex: 10 }}>
            <button
              onClick={() => handleSave('values', valuesData, 'Values Page')}
              disabled={isSaving}
              style={{
                ...adminStyles.warningButton,
                padding: '0.875rem 2.25rem',
                fontSize: '0.9375rem',
              }}
            >
              <Save size={18} />
              {isSaving ? 'Publishing...' : 'Save & Publish Values'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. DELIVERY FRAMEWORK EDITOR */}
      {/* ========================================================= */}
      {activeTab === 'delivery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: adminColors.emerald.text, margin: '0 0 1.25rem' }}>
              Delivery Methodology Phases
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(deliveryData.phases || []).map((phase: any, idx: number) => (
                <div key={idx} style={{ padding: '1rem', backgroundColor: adminColors.slate.cardMuted, borderRadius: '8px', border: `1px solid ${adminColors.slate.borderLight}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ padding: '0.25rem 0.6rem', backgroundColor: adminColors.emerald.light, border: `1px solid ${adminColors.emerald.border}`, borderRadius: '4px', color: adminColors.emerald.text, fontWeight: 700, fontSize: '0.75rem' }}>
                      Phase {phase.phase}
                    </span>
                    <input
                      type="text"
                      value={phase.title}
                      onChange={(e) => {
                        const newP = [...(deliveryData.phases || [])];
                        newP[idx].title = e.target.value;
                        setDeliveryData({ ...deliveryData, phases: newP });
                      }}
                      style={{ flex: 1, ...adminStyles.input, fontWeight: 600 }}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={phase.description}
                    onChange={(e) => {
                      const newP = [...(deliveryData.phases || [])];
                      newP[idx].description = e.target.value;
                      setDeliveryData({ ...deliveryData, phases: newP });
                    }}
                    style={adminStyles.textarea}
                  />
                </div>
              ))}
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: '1rem', zIndex: 10 }}>
            <button
              onClick={() => handleSave('delivery-framework', deliveryData, 'Delivery Framework')}
              disabled={isSaving}
              style={{
                ...adminStyles.successButton,
                padding: '0.875rem 2.25rem',
                fontSize: '0.9375rem',
              }}
            >
              <Save size={18} />
              {isSaving ? 'Publishing...' : 'Save & Publish Delivery Framework'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PRIVACY POLICY & TERMS OF SERVICE */}
      {/* ========================================================= */}
      {(activeTab === 'privacy' || activeTab === 'terms') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {activeTab === 'privacy' && (
            <section style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: adminColors.indigo.text, margin: 0 }}>
                  Privacy Policy Document
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const secs = privacyData.sections || [];
                    setPrivacyData({
                      ...privacyData,
                      sections: [...secs, { heading: `${secs.length + 1}. New Clause`, body: 'Legal text...' }]
                    });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.4rem 0.85rem',
                    backgroundColor: adminColors.indigo.light,
                    border: `1px solid ${adminColors.indigo.border}`,
                    borderRadius: '6px',
                    color: adminColors.indigo.text,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} /> Add Clause
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={adminStyles.label}>Effective Date</label>
                  <input
                    type="text"
                    value={privacyData.effectiveDate || ''}
                    onChange={(e) => setPrivacyData({ ...privacyData, effectiveDate: e.target.value })}
                    style={adminStyles.input}
                  />
                </div>
                <div>
                  <label style={adminStyles.label}>Contact Email for Inquiries</label>
                  <input
                    type="text"
                    value={privacyData.contactEmail || ''}
                    onChange={(e) => setPrivacyData({ ...privacyData, contactEmail: e.target.value })}
                    style={adminStyles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(privacyData.sections || []).map((sec: any, idx: number) => (
                  <div key={idx} style={{ padding: '1rem', backgroundColor: adminColors.slate.cardMuted, borderRadius: '8px', border: `1px solid ${adminColors.slate.borderLight}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => {
                          const newSecs = [...(privacyData.sections || [])];
                          newSecs[idx].heading = e.target.value;
                          setPrivacyData({ ...privacyData, sections: newSecs });
                        }}
                        style={{ ...adminStyles.input, width: '80%', fontWeight: 600 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSecs = (privacyData.sections || []).filter((_: any, i: number) => i !== idx);
                          setPrivacyData({ ...privacyData, sections: newSecs });
                        }}
                        style={{
                          ...adminStyles.dangerButton,
                          padding: '0.25rem 0.5rem',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={sec.body}
                      onChange={(e) => {
                        const newSecs = [...(privacyData.sections || [])];
                        newSecs[idx].body = e.target.value;
                        setPrivacyData({ ...privacyData, sections: newSecs });
                      }}
                      style={adminStyles.textarea}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  onClick={() => handleSave('privacy-policy', privacyData, 'Privacy Policy')}
                  disabled={isSaving}
                  style={adminStyles.primaryButton}
                >
                  <Save size={18} />
                  {isSaving ? 'Publishing...' : 'Save & Publish Privacy Policy'}
                </button>
              </div>
            </section>
          )}

          {activeTab === 'terms' && (
            <section style={{ backgroundColor: adminColors.slate.card, border: `1px solid ${adminColors.slate.border}`, borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: adminColors.indigo.text, margin: 0 }}>
                  Terms of Service Document
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const secs = termsData.sections || [];
                    setTermsData({
                      ...termsData,
                      sections: [...secs, { heading: `${secs.length + 1}. New Clause`, body: 'Legal text...' }]
                    });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.4rem 0.85rem',
                    backgroundColor: adminColors.indigo.light,
                    border: `1px solid ${adminColors.indigo.border}`,
                    borderRadius: '6px',
                    color: adminColors.indigo.text,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} /> Add Clause
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={adminStyles.label}>Effective Date</label>
                  <input
                    type="text"
                    value={termsData.effectiveDate || ''}
                    onChange={(e) => setTermsData({ ...termsData, effectiveDate: e.target.value })}
                    style={adminStyles.input}
                  />
                </div>
                <div>
                  <label style={adminStyles.label}>Governing Law Jurisdiction</label>
                  <input
                    type="text"
                    value={termsData.governingLaw || ''}
                    onChange={(e) => setTermsData({ ...termsData, governingLaw: e.target.value })}
                    style={adminStyles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(termsData.sections || []).map((sec: any, idx: number) => (
                  <div key={idx} style={{ padding: '1rem', backgroundColor: adminColors.slate.cardMuted, borderRadius: '8px', border: `1px solid ${adminColors.slate.borderLight}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => {
                          const newSecs = [...(termsData.sections || [])];
                          newSecs[idx].heading = e.target.value;
                          setTermsData({ ...termsData, sections: newSecs });
                        }}
                        style={{ ...adminStyles.input, width: '80%', fontWeight: 600 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSecs = (termsData.sections || []).filter((_: any, i: number) => i !== idx);
                          setTermsData({ ...termsData, sections: newSecs });
                        }}
                        style={{
                          ...adminStyles.dangerButton,
                          padding: '0.25rem 0.5rem',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={sec.body}
                      onChange={(e) => {
                        const newSecs = [...(termsData.sections || [])];
                        newSecs[idx].body = e.target.value;
                        setTermsData({ ...termsData, sections: newSecs });
                      }}
                      style={adminStyles.textarea}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  onClick={() => handleSave('terms-of-service', termsData, 'Terms of Service')}
                  disabled={isSaving}
                  style={adminStyles.primaryButton}
                >
                  <Save size={18} />
                  {isSaving ? 'Publishing...' : 'Save & Publish Terms of Service'}
                </button>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
