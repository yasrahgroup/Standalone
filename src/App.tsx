// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';

// Context Providers
import { AdminAuthProvider, ProtectedAdminRoute } from './context/AdminAuthContext';
import { CMSProvider } from './context/CMSContext';

// Public Page Views
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Values } from './pages/Values';
import { DeliveryFramework } from './pages/DeliveryFramework';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Services } from './pages/Services';
import { Portfolio } from './pages/Portfolio';
import { Insights } from './pages/Insights';
import { InsightDetail } from './pages/InsightDetail';
import { Connect } from './pages/Connect';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { NotFound } from './pages/NotFound';

// CMS Admin Views
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPagesManager } from './pages/admin/AdminPagesManager';
import { AdminProductsManager } from './pages/admin/AdminProductsManager';
import { AdminServicesManager } from './pages/admin/AdminServicesManager';
import { AdminPortfolioManager } from './pages/admin/AdminPortfolioManager';
import { AdminInsightsManager } from './pages/admin/AdminInsightsManager';
import { AdminTestimonialsManager } from './pages/admin/AdminTestimonialsManager';
import { AdminNavigationManager } from './pages/admin/AdminNavigationManager';
import { AdminCRMInquiries } from './pages/admin/AdminCRMInquiries';
import { AdminCRMRfqs } from './pages/admin/AdminCRMRfqs';
import { AdminMediaManager } from './pages/admin/AdminMediaManager';
import { AdminSettingsManager } from './pages/admin/AdminSettingsManager';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminUsersManager } from './pages/admin/AdminUsersManager';

export const App: React.FC = () => {
  return (
    <AdminAuthProvider>
      <CMSProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. CMS Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 2. CMS Admin Portal (Protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="pages" element={<AdminPagesManager />} />
              <Route path="products" element={<AdminProductsManager />} />
              <Route path="services" element={<AdminServicesManager />} />
              <Route path="portfolio" element={<AdminPortfolioManager />} />
              <Route path="insights" element={<AdminInsightsManager />} />
              <Route path="testimonials" element={<AdminTestimonialsManager />} />
              <Route path="navigation" element={<AdminNavigationManager />} />
              <Route path="inquiries" element={<AdminCRMInquiries />} />
              <Route path="rfqs" element={<AdminCRMRfqs />} />
              <Route path="media" element={<AdminMediaManager />} />
              <Route path="settings" element={<AdminSettingsManager />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="users" element={<AdminUsersManager />} />
            </Route>

            {/* 3. Public Web Application */}
            <Route element={<PublicLayout />}>
              {/* Canonical Homepage */}
              <Route path="/" element={<Home />} />

              {/* Company & Values */}
              <Route path="/about" element={<About />} />
              <Route path="/who-we-are" element={<Navigate to="/about" replace />} />
              <Route path="/values" element={<Values />} />

              {/* Methodology & Delivery */}
              <Route path="/delivery-framework" element={<DeliveryFramework />} />
              <Route path="/how-we-work" element={<Navigate to="/delivery-framework" replace />} />

              {/* Software Platforms & Catalogs */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />

              {/* Enterprise Services & SLAs */}
              <Route path="/services" element={<Services />} />
              <Route path="/service" element={<Services />} />

              {/* Portfolio & Case Studies */}
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<NotFound />} />
              <Route path="/projects" element={<Navigate to="/portfolio" replace />} />

              {/* Resource Hub & Technology Insights */}
              <Route path="/technology-insights" element={<Insights />} />
              <Route path="/technology-insights/:slug" element={<InsightDetail />} />
              <Route path="/resource-hub" element={<Insights />} />
              <Route path="/resource-hub/:slug" element={<InsightDetail />} />
              <Route path="/insights" element={<Navigate to="/technology-insights" replace />} />

              {/* Direct Communication & Conversion Portals */}
              <Route path="/connect-with-us" element={<Connect />} />
              <Route path="/contact" element={<Navigate to="/connect-with-us" replace />} />
              <Route path="/connect" element={<Navigate to="/connect-with-us" replace />} />

              {/* RFQ routes redirected to Connect */}
              <Route path="/request-for-quote" element={<Navigate to="/connect-with-us" replace />} />
              <Route path="/rfq" element={<Navigate to="/connect-with-us" replace />} />
              <Route path="/quote" element={<Navigate to="/connect-with-us" replace />} />

              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CMSProvider>
    </AdminAuthProvider>
  );
};

export default App;
