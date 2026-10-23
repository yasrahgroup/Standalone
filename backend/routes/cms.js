// backend/routes/cms.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

module.exports = function (pool, upload) {
  // Audit logger helper
  async function logAudit(userId, userName, action, module, entityType, entityId, details, req) {
    try {
      const ip = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') : '127.0.0.1';
      await pool.query(`
        INSERT INTO "AuditLog" (id, "userId", "userName", action, module, "entityType", "entityId", details, "ipAddress", "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      `, [
        `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId || 'system',
        userName || 'System',
        action,
        module,
        entityType,
        entityId,
        JSON.stringify(details || {}),
        ip
      ]);
    } catch (e) {
      console.error('Audit log error:', e.message);
    }
  }

  // ==========================================
  // 1. PUBLIC AGGREGATED BUNDLE: /api/cms/all
  // ==========================================
  router.get('/all', async (req, res) => {
    try {
      const [
        settingsRes,
        navRes,
        productsRes,
        servicesRes,
        portfolioRes,
        insightsRes,
        testimonialsRes,
        pagesRes
      ] = await Promise.all([
        pool.query('SELECT * FROM "WebsiteSetting" WHERE id = $1', ['global']),
        pool.query('SELECT * FROM "NavigationItem" ORDER BY "order" ASC'),
        pool.query('SELECT * FROM "Product" WHERE status = $1 AND "deletedAt" IS NULL ORDER BY "order" ASC', ['PUBLISHED']),
        pool.query('SELECT * FROM "Service" WHERE status = $1 ORDER BY "order" ASC', ['PUBLISHED']),
        pool.query('SELECT * FROM "PortfolioProject" WHERE status = $1 AND "deletedAt" IS NULL ORDER BY "order" ASC', ['PUBLISHED']),
        pool.query('SELECT * FROM "TechnologyInsight" WHERE status = $1 AND "deletedAt" IS NULL ORDER BY "publishedAt" DESC', ['PUBLISHED']),
        pool.query('SELECT * FROM "Testimonial" ORDER BY "order" ASC'),
        pool.query('SELECT slug, title, data, "updatedAt" FROM "PageContent"')
      ]);

      const pagesMap = {};
      pagesRes.rows.forEach(p => {
        pagesMap[p.slug] = p.data;
      });

      res.json({
        success: true,
        data: {
          settings: settingsRes.rows[0] || null,
          navigation: navRes.rows,
          products: productsRes.rows,
          services: servicesRes.rows,
          portfolio: portfolioRes.rows,
          insights: insightsRes.rows,
          testimonials: testimonialsRes.rows,
          pages: pagesMap,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching CMS bundle:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch CMS content', error: error.message });
    }
  });

  // ==========================================
  // 2. DASHBOARD STATS: /api/cms/stats
  // ==========================================
  router.get('/stats', authenticateToken, async (req, res) => {
    try {
      const [
        prodCount,
        servCount,
        insCount,
        portCount,
        enqCount,
        rfqCount,
        mediaCount,
        recentAudits,
        recentEnquiries
      ] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM "Product" WHERE "deletedAt" IS NULL'),
        pool.query('SELECT COUNT(*) FROM "Service"'),
        pool.query('SELECT COUNT(*) FROM "TechnologyInsight" WHERE "deletedAt" IS NULL'),
        pool.query('SELECT COUNT(*) FROM "PortfolioProject" WHERE "deletedAt" IS NULL'),
        pool.query('SELECT COUNT(*) FROM "ContactEnquiry"'),
        pool.query('SELECT COUNT(*) FROM "RFQRequest"'),
        pool.query('SELECT COUNT(*) FROM "MediaItem" WHERE "deletedAt" IS NULL'),
        pool.query('SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 8'),
        pool.query('SELECT * FROM "ContactEnquiry" ORDER BY "createdAt" DESC LIMIT 5')
      ]);

      res.json({
        success: true,
        stats: {
          products: parseInt(prodCount.rows[0].count),
          services: parseInt(servCount.rows[0].count),
          insights: parseInt(insCount.rows[0].count),
          portfolio: parseInt(portCount.rows[0].count),
          enquiries: parseInt(enqCount.rows[0].count),
          rfqs: parseInt(rfqCount.rows[0].count),
          media: parseInt(mediaCount.rows[0].count)
        },
        recentAudits: recentAudits.rows,
        recentEnquiries: recentEnquiries.rows
      });
    } catch (error) {
      console.error('Error fetching CMS stats:', error);
      res.status(500).json({ success: false, message: 'Failed to load stats' });
    }
  });

  // ==========================================
  // 3. SETTINGS & BRANDING
  // ==========================================
  router.get('/settings', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "WebsiteSetting" WHERE id = $1', ['global']);
      res.json({ success: true, settings: result.rows[0] || null });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.put('/settings', authenticateToken, async (req, res) => {
    const {
      companyName, tagline, supportEmail, phone, headquarters,
      linkedinUrl, twitterUrl, githubUrl, metaTitle, metaDescription,
      themeConfig, emailConfig, logoUrl, modulesConfig
    } = req.body;

    try {
      // Merge logoUrl and modulesConfig into themeConfig for unified persistent storage
      const mergedThemeConfig = {
        ...(themeConfig || {}),
        ...(logoUrl !== undefined ? { logoUrl } : {}),
        ...(modulesConfig !== undefined ? { modulesConfig } : {})
      };

      await pool.query(`
        UPDATE "WebsiteSetting" SET
          "companyName" = COALESCE($1, "companyName"),
          tagline = COALESCE($2, tagline),
          "supportEmail" = COALESCE($3, "supportEmail"),
          phone = COALESCE($4, phone),
          headquarters = COALESCE($5, headquarters),
          "linkedinUrl" = COALESCE($6, "linkedinUrl"),
          "twitterUrl" = COALESCE($7, "twitterUrl"),
          "githubUrl" = COALESCE($8, "githubUrl"),
          "metaTitle" = COALESCE($9, "metaTitle"),
          "metaDescription" = COALESCE($10, "metaDescription"),
          "themeConfig" = $11,
          "emailConfig" = COALESCE($12, "emailConfig"),
          "updatedAt" = NOW()
        WHERE id = 'global'
      `, [
        companyName, tagline, supportEmail, phone, headquarters,
        linkedinUrl, twitterUrl, githubUrl, metaTitle, metaDescription,
        JSON.stringify(mergedThemeConfig),
        emailConfig ? JSON.stringify(emailConfig) : null
      ]);

      await logAudit(req.user.id, req.user.name, 'UPDATE', 'SETTINGS', 'WebsiteSetting', 'global', req.body, req);

      res.json({ success: true, message: 'Website settings updated successfully' });
    } catch (error) {
      console.error('Settings update error:', error);
      res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
  });

  // ==========================================
  // 4. PAGES CONTENT (Home, About, Values, etc.)
  // ==========================================
  router.get('/pages', async (req, res) => {
    try {
      const result = await pool.query('SELECT slug, title, "updatedAt" FROM "PageContent" ORDER BY slug ASC');
      res.json({ success: true, pages: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/pages/:slug', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "PageContent" WHERE slug = $1', [req.params.slug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Page not found' });
      }
      res.json({ success: true, page: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.put('/pages/:slug', authenticateToken, async (req, res) => {
    const { title, data } = req.body;
    const { slug } = req.params;

    if (!data) {
      return res.status(400).json({ success: false, message: 'Page content data is required' });
    }

    try {
      await pool.query(`
        INSERT INTO "PageContent" (id, slug, title, data, "updatedAt")
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (slug) DO UPDATE
        SET title = COALESCE(EXCLUDED.title, "PageContent".title),
            data = EXCLUDED.data,
            "updatedAt" = NOW()
      `, [`page-${slug}`, slug, title || slug.toUpperCase(), JSON.stringify(data)]);

      await logAudit(req.user.id, req.user.name, 'UPDATE_PAGE', 'PAGES', 'PageContent', slug, { title }, req);

      res.json({ success: true, message: `Page '${slug}' updated successfully` });
    } catch (error) {
      console.error('Page update error:', error);
      res.status(500).json({ success: false, message: 'Failed to update page' });
    }
  });

  // ==========================================
  // 5. PRODUCTS
  // ==========================================
  router.get('/products', async (req, res) => {
    try {
      const includeAll = req.headers.authorization ? true : false;
      const query = includeAll 
        ? 'SELECT * FROM "Product" WHERE "deletedAt" IS NULL ORDER BY "order" ASC'
        : 'SELECT * FROM "Product" WHERE status = \'PUBLISHED\' AND "deletedAt" IS NULL ORDER BY "order" ASC';
      const result = await pool.query(query);
      res.json({ success: true, products: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/products/:slug', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "Product" WHERE slug = $1 AND "deletedAt" IS NULL', [req.params.slug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json({ success: true, product: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/products', authenticateToken, async (req, res) => {
    const {
      name, slug, tagline, shortDescription, fullDescription,
      coverImage, isFeatured, status, order, technologies, benefits,
      badge, ctaText, ctaLink
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required' });
    }

    try {
      const id = `prod-${Date.now()}`;
      await pool.query(`
        INSERT INTO "Product" (
          id, name, slug, tagline, "shortDescription", "fullDescription",
          "coverImage", "isFeatured", status, "order", technologies, benefits,
          badge, "ctaText", "ctaLink", version, "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 1, NOW(), NOW()
        )
      `, [
        id, name.trim(), slug.trim().toLowerCase(), tagline || '',
        shortDescription || '', fullDescription || '', coverImage || '',
        isFeatured ?? true, status || 'PUBLISHED', order || 1,
        technologies || [], benefits || [], badge || 'Enterprise Ready',
        ctaText || 'Learn More', ctaLink || '/request-for-quote'
      ]);

      await logAudit(req.user.id, req.user.name, 'CREATE', 'PRODUCTS', 'Product', id, { name, slug }, req);

      res.json({ success: true, message: 'Product created successfully', id });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ success: false, message: 'Failed to create product' });
    }
  });

  router.put('/products/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
      name, slug, tagline, shortDescription, fullDescription,
      coverImage, isFeatured, status, order, technologies, benefits,
      badge, ctaText, ctaLink
    } = req.body;

    try {
      await pool.query(`
        UPDATE "Product" SET
          name = COALESCE($2, name),
          slug = COALESCE($3, slug),
          tagline = COALESCE($4, tagline),
          "shortDescription" = COALESCE($5, "shortDescription"),
          "fullDescription" = COALESCE($6, "fullDescription"),
          "coverImage" = COALESCE($7, "coverImage"),
          "isFeatured" = COALESCE($8, "isFeatured"),
          status = COALESCE($9, status),
          "order" = COALESCE($10, "order"),
          technologies = COALESCE($11, technologies),
          benefits = COALESCE($12, benefits),
          badge = COALESCE($13, badge),
          "ctaText" = COALESCE($14, "ctaText"),
          "ctaLink" = COALESCE($15, "ctaLink"),
          version = version + 1,
          "updatedAt" = NOW()
        WHERE id = $1
      `, [
        id, name, slug, tagline, shortDescription, fullDescription,
        coverImage, isFeatured, status, order, technologies, benefits,
        badge, ctaText, ctaLink
      ]);

      await logAudit(req.user.id, req.user.name, 'UPDATE', 'PRODUCTS', 'Product', id, { name, slug }, req);

      res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ success: false, message: 'Failed to update product' });
    }
  });

  router.delete('/products/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('UPDATE "Product" SET "deletedAt" = NOW() WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE', 'PRODUCTS', 'Product', id, {}, req);
      res.json({ success: true, message: 'Product archived successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
  });

  // ==========================================
  // 6. SERVICES
  // ==========================================
  router.get('/services', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "Service" ORDER BY "order" ASC');
      res.json({ success: true, services: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/services/:slug', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "Service" WHERE slug = $1', [req.params.slug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      res.json({ success: true, service: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/services', authenticateToken, async (req, res) => {
    const {
      title, slug, summary, description, iconName, badge,
      capabilities, processSteps, metrics, technologies, industries, order, ctaText, ctaLink
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ success: false, message: 'Title and slug are required' });
    }

    try {
      const id = `serv-${Date.now()}`;
      await pool.query(`
        INSERT INTO "Service" (
          id, title, slug, summary, description, "iconName", badge,
          capabilities, "processSteps", metrics, status, "order",
          "isFeatured", technologies, industries, "displayOrder",
          "ctaText", "ctaLink", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PUBLISHED', $11, true, $12, $13, $11, $14, $15, NOW(), NOW()
        )
      `, [
        id, title.trim(), slug.trim().toLowerCase(), summary || '', description || '',
        iconName || 'Cpu', badge || 'Enterprise', capabilities || [],
        JSON.stringify(processSteps || []), JSON.stringify(metrics || {}),
        order || 1, technologies || [], industries || [],
        ctaText || 'Consult Architecture Team', ctaLink || '/connect-with-us'
      ]);

      await logAudit(req.user.id, req.user.name, 'CREATE', 'SERVICES', 'Service', id, { title, slug }, req);

      res.json({ success: true, message: 'Service created successfully', id });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({ success: false, message: 'Failed to create service' });
    }
  });

  router.put('/services/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
      title, slug, summary, description, iconName, badge,
      capabilities, processSteps, metrics, technologies, industries, order, ctaText, ctaLink
    } = req.body;

    try {
      await pool.query(`
        UPDATE "Service" SET
          title = COALESCE($2, title),
          slug = COALESCE($3, slug),
          summary = COALESCE($4, summary),
          description = COALESCE($5, description),
          "iconName" = COALESCE($6, "iconName"),
          badge = COALESCE($7, badge),
          capabilities = COALESCE($8, capabilities),
          "processSteps" = COALESCE($9, "processSteps"),
          metrics = COALESCE($10, metrics),
          technologies = COALESCE($11, technologies),
          industries = COALESCE($12, industries),
          "order" = COALESCE($13, "order"),
          "ctaText" = COALESCE($14, "ctaText"),
          "ctaLink" = COALESCE($15, "ctaLink"),
          "updatedAt" = NOW()
        WHERE id = $1
      `, [
        id, title, slug, summary, description, iconName, badge,
        capabilities, processSteps ? JSON.stringify(processSteps) : null,
        metrics ? JSON.stringify(metrics) : null, technologies, industries,
        order, ctaText, ctaLink
      ]);

      await logAudit(req.user.id, req.user.name, 'UPDATE', 'SERVICES', 'Service', id, { title, slug }, req);

      res.json({ success: true, message: 'Service updated successfully' });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({ success: false, message: 'Failed to update service' });
    }
  });

  router.delete('/services/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "Service" WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE', 'SERVICES', 'Service', id, {}, req);
      res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete service' });
    }
  });

  // ==========================================
  // 7. PORTFOLIO & CASE STUDIES
  // ==========================================
  router.get('/portfolio', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "PortfolioProject" WHERE "deletedAt" IS NULL ORDER BY "order" ASC');
      res.json({ success: true, portfolio: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/portfolio', authenticateToken, async (req, res) => {
    const {
      name, slug, clientName, clientType, industry, category,
      summary, challenge, solution, outcomes, technologies, coverImage, order
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Project name and slug are required' });
    }

    try {
      const id = `port-${Date.now()}`;
      await pool.query(`
        INSERT INTO "PortfolioProject" (
          id, name, slug, "clientName", "clientType", industry, category,
          summary, challenge, solution, outcomes, technologies, "coverImage",
          "isFeatured", status, "order", version, "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, 'PUBLISHED', $14, 1, NOW(), NOW()
        )
      `, [
        id, name, slug, clientName || '', clientType || 'Enterprise', industry || 'Technology',
        category || 'Cloud Engineering', summary || '', challenge || '', solution || '',
        outcomes || [], technologies || [], coverImage || '', order || 1
      ]);

      await logAudit(req.user.id, req.user.name, 'CREATE', 'PORTFOLIO', 'PortfolioProject', id, { name, slug }, req);

      res.json({ success: true, message: 'Case study created successfully', id });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create case study' });
    }
  });

  router.put('/portfolio/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
      name, slug, clientName, clientType, industry, category,
      summary, challenge, solution, outcomes, technologies, coverImage, order, isFeatured, status
    } = req.body;

    try {
      await pool.query(`
        UPDATE "PortfolioProject" SET
          name = COALESCE($2, name),
          slug = COALESCE($3, slug),
          "clientName" = COALESCE($4, "clientName"),
          "clientType" = COALESCE($5, "clientType"),
          industry = COALESCE($6, industry),
          category = COALESCE($7, category),
          summary = COALESCE($8, summary),
          challenge = COALESCE($9, challenge),
          solution = COALESCE($10, solution),
          outcomes = COALESCE($11, outcomes),
          technologies = COALESCE($12, technologies),
          "coverImage" = COALESCE($13, "coverImage"),
          "order" = COALESCE($14, "order"),
          "isFeatured" = COALESCE($15, "isFeatured"),
          status = COALESCE($16, status),
          "updatedAt" = NOW()
        WHERE id = $1
      `, [
        id, name, slug, clientName, clientType, industry, category,
        summary, challenge, solution, outcomes, technologies, coverImage,
        order, isFeatured, status
      ]);

      await logAudit(req.user.id, req.user.name, 'UPDATE', 'PORTFOLIO', 'PortfolioProject', id, { name, slug }, req);

      res.json({ success: true, message: 'Case study updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update case study' });
    }
  });

  router.delete('/portfolio/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('UPDATE "PortfolioProject" SET "deletedAt" = NOW() WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE', 'PORTFOLIO', 'PortfolioProject', id, {}, req);
      res.json({ success: true, message: 'Case study archived successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete case study' });
    }
  });

  // ==========================================
  // 8. TECHNOLOGY INSIGHTS (Articles & Blogs)
  // ==========================================
  router.get('/insights', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "TechnologyInsight" WHERE "deletedAt" IS NULL ORDER BY "publishedAt" DESC');
      res.json({ success: true, insights: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/insights/:slug', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "TechnologyInsight" WHERE slug = $1 AND "deletedAt" IS NULL', [req.params.slug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Insight not found' });
      }
      res.json({ success: true, insight: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/insights', authenticateToken, async (req, res) => {
    const {
      title, slug, excerpt, content, coverImage, authorName, authorRole,
      category, tags, readTime, isFeatured, status
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ success: false, message: 'Title and slug are required' });
    }

    try {
      const id = `art-${Date.now()}`;
      await pool.query(`
        INSERT INTO "TechnologyInsight" (
          id, title, slug, excerpt, content, "coverImage", "authorName", "authorRole",
          category, tags, "readTime", "isFeatured", status, "publishedAt", version, "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), 1, NOW(), NOW()
        )
      `, [
        id, title.trim(), slug.trim().toLowerCase(), excerpt || '', content || '',
        coverImage || '/images/insights/cover-default.jpg',
        authorName || req.user.name, authorRole || 'Principal Architect',
        category || 'System Architecture', tags || [], readTime || '5 min read',
        isFeatured ?? false, status || 'PUBLISHED'
      ]);

      await logAudit(req.user.id, req.user.name, 'CREATE', 'INSIGHTS', 'TechnologyInsight', id, { title, slug }, req);

      res.json({ success: true, message: 'Insight article created successfully', id });
    } catch (error) {
      console.error('Create insight error:', error);
      res.status(500).json({ success: false, message: 'Failed to create insight' });
    }
  });

  router.put('/insights/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
      title, slug, excerpt, content, coverImage, authorName, authorRole,
      category, tags, readTime, isFeatured, status
    } = req.body;

    try {
      await pool.query(`
        UPDATE "TechnologyInsight" SET
          title = COALESCE($2, title),
          slug = COALESCE($3, slug),
          excerpt = COALESCE($4, excerpt),
          content = COALESCE($5, content),
          "coverImage" = COALESCE($6, "coverImage"),
          "authorName" = COALESCE($7, "authorName"),
          "authorRole" = COALESCE($8, "authorRole"),
          category = COALESCE($9, category),
          tags = COALESCE($10, tags),
          "readTime" = COALESCE($11, "readTime"),
          "isFeatured" = COALESCE($12, "isFeatured"),
          status = COALESCE($13, status),
          version = version + 1,
          "updatedAt" = NOW()
        WHERE id = $1
      `, [
        id, title, slug, excerpt, content, coverImage, authorName, authorRole,
        category, tags, readTime, isFeatured, status
      ]);

      await logAudit(req.user.id, req.user.name, 'UPDATE', 'INSIGHTS', 'TechnologyInsight', id, { title, slug }, req);

      res.json({ success: true, message: 'Insight article updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update insight' });
    }
  });

  router.delete('/insights/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('UPDATE "TechnologyInsight" SET "deletedAt" = NOW() WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE', 'INSIGHTS', 'TechnologyInsight', id, {}, req);
      res.json({ success: true, message: 'Insight article archived successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete insight' });
    }
  });

  // ==========================================
  // 9. TESTIMONIALS
  // ==========================================
  router.get('/testimonials', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "Testimonial" ORDER BY "order" ASC');
      res.json({ success: true, testimonials: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/testimonials', authenticateToken, async (req, res) => {
    const { clientName, role, organization, avatarUrl, rating, quote, isFeatured, order } = req.body;

    if (!clientName || !quote) {
      return res.status(400).json({ success: false, message: 'Client name and quote are required' });
    }

    try {
      const id = `test-${Date.now()}`;
      await pool.query(`
        INSERT INTO "Testimonial" (
          id, "clientName", role, organization, "avatarUrl", rating, quote, "isFeatured", "order", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
        )
      `, [
        id, clientName.trim(), role || '', organization || '',
        avatarUrl || '/images/testimonials/avatar-default.jpg',
        rating || 5, quote.trim(), isFeatured ?? true, order || 1
      ]);

      await logAudit(req.user.id, req.user.name, 'CREATE', 'TESTIMONIALS', 'Testimonial', id, { clientName }, req);

      res.json({ success: true, message: 'Testimonial created successfully', id });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create testimonial' });
    }
  });

  router.put('/testimonials/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { clientName, role, organization, avatarUrl, rating, quote, isFeatured, order } = req.body;

    try {
      await pool.query(`
        UPDATE "Testimonial" SET
          "clientName" = COALESCE($2, "clientName"),
          role = COALESCE($3, role),
          organization = COALESCE($4, organization),
          "avatarUrl" = COALESCE($5, "avatarUrl"),
          rating = COALESCE($6, rating),
          quote = COALESCE($7, quote),
          "isFeatured" = COALESCE($8, "isFeatured"),
          "order" = COALESCE($9, "order"),
          "updatedAt" = NOW()
        WHERE id = $1
      `, [id, clientName, role, organization, avatarUrl, rating, quote, isFeatured, order]);

      await logAudit(req.user.id, req.user.name, 'UPDATE', 'TESTIMONIALS', 'Testimonial', id, { clientName }, req);

      res.json({ success: true, message: 'Testimonial updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update testimonial' });
    }
  });

  router.delete('/testimonials/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "Testimonial" WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE', 'TESTIMONIALS', 'Testimonial', id, {}, req);
      res.json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
    }
  });

  // ==========================================
  // 10. NAVIGATION MENU ITEMS
  // ==========================================
  router.get('/navigation', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "NavigationItem" ORDER BY "order" ASC');
      res.json({ success: true, navigation: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/navigation', authenticateToken, async (req, res) => {
    const { label, path: navPath, order, isVisible, isExternal } = req.body;
    if (!label || !navPath) {
      return res.status(400).json({ success: false, message: 'Label and path are required' });
    }

    try {
      const id = `nav-${Date.now()}`;
      await pool.query(`
        INSERT INTO "NavigationItem" (id, label, path, "order", "isVisible", "isExternal", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [id, label.trim(), navPath.trim(), order || 1, isVisible ?? true, isExternal ?? false]);

      await logAudit(req.user.id, req.user.name, 'CREATE', 'NAVIGATION', 'NavigationItem', id, { label, path: navPath }, req);

      res.json({ success: true, message: 'Navigation item added', id });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to add navigation item' });
    }
  });

  router.put('/navigation/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { label, path: navPath, order, isVisible, isExternal } = req.body;

    try {
      await pool.query(`
        UPDATE "NavigationItem" SET
          label = COALESCE($2, label),
          path = COALESCE($3, path),
          "order" = COALESCE($4, "order"),
          "isVisible" = COALESCE($5, "isVisible"),
          "isExternal" = COALESCE($6, "isExternal"),
          "updatedAt" = NOW()
        WHERE id = $1
      `, [id, label, navPath, order, isVisible, isExternal]);

      await logAudit(req.user.id, req.user.name, 'UPDATE', 'NAVIGATION', 'NavigationItem', id, { label }, req);

      res.json({ success: true, message: 'Navigation item updated' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update navigation item' });
    }
  });

  router.delete('/navigation/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "NavigationItem" WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE', 'NAVIGATION', 'NavigationItem', id, {}, req);
      res.json({ success: true, message: 'Navigation item removed' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete navigation item' });
    }
  });

  // ==========================================
  // 11. CRM: CONTACT ENQUIRIES
  // ==========================================
  router.get('/enquiries', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "ContactEnquiry" ORDER BY "createdAt" DESC LIMIT 200');
      res.json({ success: true, enquiries: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.patch('/enquiries/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status, assignedTo, followUpNote, nextFollowUpAt } = req.body;

    try {
      await pool.query(`
        UPDATE "ContactEnquiry" SET
          status = COALESCE($2, status),
          "assignedTo" = COALESCE($3, "assignedTo"),
          "followUpNote" = COALESCE($4, "followUpNote"),
          "nextFollowUpAt" = COALESCE($5, "nextFollowUpAt"),
          "updatedAt" = NOW()
        WHERE id = $1
      `, [id, status, assignedTo, followUpNote, nextFollowUpAt]);

      await logAudit(req.user.id, req.user.name, 'UPDATE_ENQUIRY', 'CRM', 'ContactEnquiry', id, { status }, req);

      res.json({ success: true, message: 'Enquiry updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update enquiry' });
    }
  });

  router.delete('/enquiries/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "ContactEnquiry" WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE_ENQUIRY', 'CRM', 'ContactEnquiry', id, {}, req);
      res.json({ success: true, message: 'Enquiry deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete enquiry' });
    }
  });

  // ==========================================
  // 12. CRM: RFQ REQUESTS
  // ==========================================
  router.get('/rfqs', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "RFQRequest" ORDER BY "createdAt" DESC LIMIT 200');
      res.json({ success: true, rfqs: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.patch('/rfqs/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    try {
      await pool.query(`
        UPDATE "RFQRequest" SET
          status = COALESCE($2, status),
          "assignedTo" = COALESCE($3, "assignedTo"),
          "updatedAt" = NOW()
        WHERE id = $1
      `, [id, status, assignedTo]);

      await logAudit(req.user.id, req.user.name, 'UPDATE_RFQ', 'CRM', 'RFQRequest', id, { status }, req);

      res.json({ success: true, message: 'RFQ updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update RFQ' });
    }
  });

  router.delete('/rfqs/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "RFQRequest" WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE_RFQ', 'CRM', 'RFQRequest', id, {}, req);
      res.json({ success: true, message: 'RFQ deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete RFQ' });
    }
  });

  // ==========================================
  // 13. MEDIA LIBRARY & UPLOADS
  // ==========================================
  router.get('/media', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "MediaItem" WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC LIMIT 100');
      res.json({ success: true, media: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/media/upload', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
      const file = req.file;
      const id = `media-${Date.now()}`;
      const url = `/uploads/${file.filename}`;
      const altText = req.body.altText || file.originalname;
      const category = req.body.category || 'general';

      await pool.query(`
        INSERT INTO "MediaItem" (
          id, filename, "originalName", "mimeType", "sizeBytes", url, "altText", category, "createdAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, NOW()
        )
      `, [
        id, file.filename, file.originalname, file.mimetype, file.size, url, altText, category
      ]);

      await logAudit(req.user.id, req.user.name, 'UPLOAD_MEDIA', 'MEDIA', 'MediaItem', id, { filename: file.filename, size: file.size }, req);

      res.json({
        success: true,
        message: 'File uploaded successfully',
        media: {
          id,
          filename: file.filename,
          originalName: file.originalname,
          url,
          altText,
          sizeBytes: file.size,
          mimeType: file.mimetype
        }
      });
    } catch (error) {
      console.error('Media upload error:', error);
      res.status(500).json({ success: false, message: 'Failed to process media upload' });
    }
  });

  router.delete('/media/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const itemRes = await pool.query('SELECT filename FROM "MediaItem" WHERE id = $1', [id]);
      if (itemRes.rows.length > 0) {
        const filePath = path.join(__dirname, '../uploads', itemRes.rows[0].filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await pool.query('UPDATE "MediaItem" SET "deletedAt" = NOW() WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE_MEDIA', 'MEDIA', 'MediaItem', id, {}, req);

      res.json({ success: true, message: 'Media item deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete media' });
    }
  });

  // ==========================================
  // 14. AUDIT LOGS
  // ==========================================
  router.get('/audit-logs', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 100');
      res.json({ success: true, logs: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};
