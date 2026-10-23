import React from 'react';
import { Hero } from '../components/home/Hero';
import { ProductsSection } from '../components/home/ProductsSection';
import { FeaturedSolutions } from '../components/home/FeaturedSolutions';
import { AboutSection } from '../components/home/AboutSection';
import { IndustryExpertise } from '../components/home/IndustryExpertise';
import { StrategicSolutions } from '../components/home/StrategicSolutions';
import { BlogSection } from '../components/home/BlogSection';
import { FAQSection } from '../components/home/FAQSection';
import { FinalCTA } from '../components/home/FinalCTA';
import { SEOHead } from '../components/common/SEOHead';
import { useCMS } from '../context/CMSContext';

export const Home: React.FC = () => {
  const { settings } = useCMS();

  const isModuleEnabled = (slug: string): boolean => {
    if (!settings.modulesConfig) return true;
    const mod = settings.modulesConfig.find((m) => m.slug === slug);
    return mod ? mod.isEnabled : true;
  };

  return (
    <div>
      <SEOHead
        title={settings.metaTitle || "Azaroth Tech-Hive — Enterprise Technology Solutions & Engineering"}
        description={settings.metaDescription || "Azaroth Tech-Hive architects mission-critical digital systems, resilient microservice ecosystems, high-availability software platforms, and dedicated engineering pods for global enterprises."}
        canonicalPath="/"
      />
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. About Us */}
      {isModuleEnabled('about') && <AboutSection />}

      {/* 3. Our Services */}
      {isModuleEnabled('services') && <FeaturedSolutions />}

      {/* 4. Software Platforms */}
      {isModuleEnabled('products') && <ProductsSection />}

      {/* 5. Featured Product Slider */}
      {isModuleEnabled('portfolio') && <StrategicSolutions />}

      {/* 6. Industrial Expertise */}
      <IndustryExpertise />

      {/* 7. Resource Hub */}
      {isModuleEnabled('insights') && <BlogSection />}

      {/* 8. FAQ */}
      <FAQSection />

      {/* Final CTA Portal */}
      {isModuleEnabled('connect') && <FinalCTA />}
    </div>
  );
};

export default Home;
