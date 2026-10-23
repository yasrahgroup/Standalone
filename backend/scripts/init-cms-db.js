// backend/scripts/init-cms-db.js
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Ql5db3fxCeop@ep-lingering-salad-b5imxpwy-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function initCmsDatabase() {
  console.log('🚀 Initializing CMS Database Structure & Content Seeding...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Create PageContent table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS "PageContent" (
        "id" TEXT PRIMARY KEY,
        "slug" TEXT UNIQUE NOT NULL,
        "title" TEXT NOT NULL,
        "data" JSONB NOT NULL,
        "updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS "idx_pagecontent_slug" ON "PageContent"("slug");
    `);
    console.log('✅ PageContent table verified');

    // 2. Ensure ContactEnquiry and RFQRequest tables exist with appropriate columns
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ContactEnquiry" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "companyName" TEXT,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "message" TEXT NOT NULL,
        "productSlug" TEXT,
        "productName" TEXT,
        "status" TEXT DEFAULT 'NEW',
        "assignedTo" TEXT,
        "assignedToUserId" TEXT,
        "nextFollowUpAt" TIMESTAMP WITHOUT TIME ZONE,
        "followUpNote" TEXT,
        "ipAddress" TEXT,
        "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Seed WebsiteSetting if needed
    const existingSettings = await client.query('SELECT * FROM "WebsiteSetting" WHERE id = $1', ['global']);
    if (existingSettings.rows.length === 0) {
      await client.query(`
        INSERT INTO "WebsiteSetting" (
          id, "companyName", tagline, "supportEmail", phone, headquarters, 
          "linkedinUrl", "twitterUrl", "githubUrl", "metaTitle", "metaDescription",
          "themeConfig", "emailConfig", "updatedAt"
        ) VALUES (
          'global',
          'Azaroth Tech-Hive',
          'Enterprise software engineering for complex systems.',
          'hello@azaroth-techhive.com',
          '+91 6379480931',
          '24, Malaviya Avenue, Thiruvanmiyur, Chennai, India',
          'https://linkedin.com/company/azaroth-tech-hive',
          'https://twitter.com/azarothtech',
          'https://github.com/azaroth-tech',
          'Azaroth Tech-Hive — Enterprise Technology Solutions & Engineering',
          'Azaroth Tech-Hive architects mission-critical digital systems, resilient microservice ecosystems, high-availability software platforms, and dedicated engineering pods for global enterprises.',
          '{"primaryColor": "#006C35", "accentColor": "#D4AF37", "preset": "emerald-gold"}',
          '{"fromEmail": "hello@azaroth-techhive.com", "provider": "BREVO"}',
          NOW()
        )
      `);
      console.log('✅ Default WebsiteSetting inserted');
    } else {
      console.log('ℹ️ WebsiteSetting already exists');
    }

    // 4. Seed NavigationItems
    const navCount = await client.query('SELECT COUNT(*) FROM "NavigationItem"');
    if (parseInt(navCount.rows[0].count) === 0) {
      const navItems = [
        { label: 'Home', path: '/', order: 1, isVisible: true },
        { label: 'About', path: '/about', order: 2, isVisible: true },
        { label: 'Our Services', path: '/services', order: 3, isVisible: true },
        { label: 'Our Products', path: '/products', order: 4, isVisible: true },
        { label: 'Technology Insights', path: '/technology-insights', order: 5, isVisible: true },
        { label: 'Connect with Us', path: '/connect-with-us', order: 6, isVisible: true },
      ];
      for (const item of navItems) {
        await client.query(`
          INSERT INTO "NavigationItem" (id, label, path, "order", "isVisible", "isExternal", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())
        `, [`nav-${item.order}`, item.label, item.path, item.order, item.isVisible]);
      }
      console.log(`✅ ${navItems.length} Navigation items seeded`);
    }

    // 5. Seed Products
    const prodCount = await client.query('SELECT COUNT(*) FROM "Product"');
    if (parseInt(prodCount.rows[0].count) === 0) {
      const products = [
        {
          id: 'prod-fms',
          slug: 'fitness-management-platform',
          name: 'Fitness Management System',
          badge: 'Under Development',
          tagline: 'Multi-Location Health Club & Fitness Operations System',
          shortDescription: 'End-to-end fitness operations management for multi-location gyms and national fitness chains.',
          fullDescription: 'Comprehensive fitness management software designed for health clubs and multi-location fitness businesses, streamlining membership operations, subscription management, payment processing, facility access, class scheduling, and centralized branch administration through a unified platform.',
          coverImage: '/images/products/fms-cover.jpg',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Biometrics API', 'Redis'],
          benefits: [
            'Complete member lifecycle management from sign-up to renewal',
            'Automated billing and payment processing with integrated gateways',
            'Real-time class scheduling and trainer availability management',
            'Centralized administration across all franchise locations'
          ],
          ctaText: 'Request Platform Demo',
          ctaLink: '/request-for-quote?product=fitness-management-platform',
          order: 1
        },
        {
          id: 'prod-commerce',
          slug: 'omnichannel-commerce-platform',
          name: 'Omnichannel Commerce Platform',
          badge: 'Under Development',
          tagline: 'Multi-Store Catalog, Inventory & Order Fulfillment Engine',
          shortDescription: 'Multi-brand and international online retail management with centralized inventory.',
          fullDescription: 'A scalable e-commerce platform enabling businesses to manage multiple stores, centralize product and inventory operations, streamline order processing, and deliver consistent shopping experiences across sales channels.',
          coverImage: '/images/products/commerce-cover.jpg',
          technologies: ['GraphQL', 'Next.js', 'Microservices', 'Elasticsearch', 'Kafka', 'PostgreSQL'],
          benefits: [
            'Manage multiple brands and stores from a single dashboard',
            'Real-time inventory synchronization across all sales channels',
            'Automated order routing to the optimal fulfillment location',
            'Support for multiple currencies and localized checkout experiences'
          ],
          ctaText: 'Explore Commerce Architecture',
          ctaLink: '/request-for-quote?product=omnichannel-commerce-platform',
          order: 2
        },
        {
          id: 'prod-lmp',
          slug: 'learning-management-platform',
          name: 'Learning Management Platform',
          badge: 'Under Development',
          tagline: 'Centralized Corporate Training & Knowledge Pathways Platform',
          shortDescription: 'Corporate training and enterprise academy management with structured learning pathways.',
          fullDescription: 'A flexible, scalable learning platform that centralizes course management, learner enrollment, training delivery, assessments, and progress tracking. It streamlines training administration, supports structured learning pathways, and provides actionable insights to improve learning outcomes.',
          coverImage: '/images/products/lmp-cover.jpg',
          technologies: ['SCORM / xAPI', 'Video Streaming', 'PostgreSQL', 'WebSockets', 'React'],
          benefits: [
            'Centralized course management and content authoring',
            'Automated learner enrollment and role-based access control',
            'Interactive assessments with digital credential generation',
            'Comprehensive learning analytics and compliance reporting'
          ],
          ctaText: 'Schedule Architecture Walkthrough',
          ctaLink: '/request-for-quote?product=learning-management-platform',
          order: 3
        },
        {
          id: 'prod-hms',
          slug: 'healthcare-management-system',
          name: 'Healthcare Management System',
          badge: 'Under Development',
          tagline: 'Hospital & Multi-Clinic Network Operations Platform',
          shortDescription: 'End-to-end healthcare operations management for hospitals and multi-clinic networks.',
          fullDescription: 'A comprehensive healthcare management platform designed for hospitals and multi-clinic networks, streamlining patient records, appointment scheduling, lab results, imaging systems, and video consultations through a unified system.',
          coverImage: '/images/products/hms-cover.jpg',
          technologies: ['HL7 FHIR API', 'REST OpenAPI', 'DICOM', 'WebRTC', 'PostgreSQL'],
          benefits: [
            'Complete patient lifecycle management from registration to discharge',
            'Real-time access to patient records across all network locations',
            'Automated lab result integration and notification workflows',
            'Strong data security and patient privacy protection controls'
          ],
          ctaText: 'Request Healthcare Briefing',
          ctaLink: '/request-for-quote?product=healthcare-management-system',
          order: 4
        }
      ];

      for (const p of products) {
        await client.query(`
          INSERT INTO "Product" (
            id, name, slug, tagline, "shortDescription", "fullDescription",
            "coverImage", "isFeatured", status, "order", technologies, benefits,
            "badge", "ctaText", "ctaLink", "version", "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, true, 'PUBLISHED', $8, $9, $10, $11, $12, $13, 1, NOW(), NOW()
          )
        `, [
          p.id, p.name, p.slug, p.tagline, p.shortDescription, p.fullDescription,
          p.coverImage, p.order, p.technologies, p.benefits, p.badge, p.ctaText, p.ctaLink
        ]);
      }
      console.log(`✅ ${products.length} Products seeded`);
    }

    // 6. Seed Services
    const servCount = await client.query('SELECT COUNT(*) FROM "Service"');
    if (parseInt(servCount.rows[0].count) === 0) {
      const services = [
        {
          id: 'serv-digital-transformation',
          slug: 'digital-transformation-technology-solutions',
          title: 'Enterprise Digital Transformation & Technology Solutions',
          badge: 'Enterprise Core',
          iconName: 'Cpu',
          summary: 'Modernize and scale enterprise software ecosystems with strategic engineering and architectural excellence.',
          description: 'Azaroth Tech-Hive empowers enterprises to build, modernize, and scale their software ecosystems through strategic engineering and architectural expertise. We transform complex applications, streamline system integrations, strengthen data management, and optimize critical business systems through disciplined engineering practices—delivering secure, resilient, and adaptable software designed for operational continuity and long-term growth.',
          capabilities: [
            'Technology Strategy & Solution Architecture',
            'Application Modernization & Software Evolution',
            'End-to-End Software Engineering & Modernization',
            'Enterprise Applications & Systems Integration',
            'Intelligent Automation & Data Solutions'
          ],
          processSteps: [
            { step: '01', title: 'Architecture Assessment', desc: 'Holistic audit of legacy code, security perimeter, and technical debt.' },
            { step: '02', title: 'Target State Blueprints', desc: 'Design bounded contexts, microservices topology, and API contracts.' },
            { step: '03', title: 'Incremental Strangler Migration', desc: 'Zero-downtime cutover utilizing dual-write gateways.' }
          ],
          metrics: { deliveryFocus: 'Architecture + execution', typicalScope: 'Platform modernization', outcome: 'Clearer roadmap' },
          technologies: ['Kubernetes', 'Go', 'TypeScript', 'Event Streaming', 'Cloud Native'],
          industries: ['Financial Services', 'Supply Chain', 'Healthcare', 'Enterprise SaaS'],
          order: 1
        },
        {
          id: 'serv-strategic-partnership',
          slug: 'strategic-partnership-consulting',
          title: 'Strategic Partnership & Consulting',
          badge: 'Executive Advisory',
          iconName: 'Compass',
          summary: 'Strategic guidance and hands-on engineering collaboration to clarify technical direction and reduce architectural debt.',
          description: 'Build a stronger technology foundation with strategic guidance and hands-on engineering collaboration. We work alongside your team to clarify technical direction, improve software architecture, strengthen development practices, and turn business priorities into actionable technology initiatives.',
          capabilities: [
            'Strategic Technology Advisory & Roadmap Planning',
            'Software Architecture & Engineering Guidance',
            'Collaborative Engineering Partnership',
            'Application Modernisation & Continuous Improvement',
            'Product Innovation, Prototyping & R&D Support',
            'Software Security & Risk Management'
          ],
          processSteps: [
            { step: '01', title: 'Executive Alignment', desc: 'Align engineering initiatives with board-level KPIs.' },
            { step: '02', title: 'Architecture Reviews', desc: 'Evaluate trade-offs across security, cost, and resilience.' },
            { step: '03', title: 'Quarterly Governance', desc: 'Measure velocity, code hygiene, and SLA compliance.' }
          ],
          metrics: { deliveryFocus: 'Advisory + governance', typicalScope: 'Technical roadmap', outcome: 'Risk reduction' },
          technologies: ['Architecture Governance', 'Threat Modeling', 'DevOps Audit', 'Cloud Economics'],
          industries: ['Fintech', 'Healthtech', 'Logistics', 'Retail'],
          order: 2
        },
        {
          id: 'serv-on-demand-workforce',
          slug: 'on-demand-workforce-solutions',
          title: 'On-Demand Engineering Workforce Solutions',
          badge: 'Rapid Mobilization',
          iconName: 'Users',
          summary: 'Dedicated specialist pods and team scaling with experienced engineers, architects, and quality specialists.',
          description: 'Strengthen your software development capabilities with experienced engineers, solution architects, and quality specialists across diverse technologies and platforms. Our flexible engagement models, structured onboarding, and transparent delivery practices help teams overcome technical challenges and accelerate delivery.',
          capabilities: [
            'Dedicated Specialist Teams',
            'Flexible Team Scaling & Staff Augmentation',
            'Precision Skills & Expertise Matching',
            'Rapid Team Mobilisation & Onboarding'
          ],
          processSteps: [
            { step: '01', title: 'Skill Profile Matching', desc: 'Match senior architects and engineers to domain requirements.' },
            { step: '02', title: 'Structured Onboarding', desc: 'Repository access, coding standard sync, and CI/CD walkthrough.' },
            { step: '03', title: 'Sprint Velocity Delivery', desc: 'Immediate sprint participation with commit transparency.' }
          ],
          metrics: { deliveryFocus: 'Dedicated pod', typicalScope: 'Team scaling', outcome: 'Velocity increase' },
          technologies: ['React', 'Node.js', 'Python', 'Go', 'AWS/GCP/Azure', 'PostgreSQL'],
          industries: ['All Enterprise Sectors'],
          order: 3
        },
        {
          id: 'serv-business-process-management',
          slug: 'business-process-management-operations',
          title: 'Business Process Management & Operations',
          badge: 'Efficiency Engine',
          iconName: 'Workflow',
          summary: 'Transform complex workflows into streamlined digital processes with intelligent automation and real-time observability.',
          description: 'Transform complex workflows into streamlined digital processes with intelligent automation, integrated applications, and actionable real-time insights. From reducing manual effort to connecting fragmented systems, we engineer practical software solutions that improve efficiency, enhance visibility, and help businesses operate smarter.',
          capabilities: [
            'Workflow Optimisation & Process Re-engineering',
            'Intelligent Automation & API Integration',
            'Application Monitoring, Reliability & Operational Support',
            'Document Digitisation & Approval Workflow Automation',
            'Operational Analytics, Performance Insights & Continuous Improvement'
          ],
          processSteps: [
            { step: '01', title: 'Workflow Mapping', desc: 'Identify bottlenecks, manual friction, and data isolation.' },
            { step: '02', title: 'Automation Pipelines', desc: 'Build webhook-driven event handlers and validation checks.' },
            { step: '03', title: 'Observability & Dashboards', desc: 'Live alerts, queue depths, and executive analytics.' }
          ],
          metrics: { deliveryFocus: 'Automation + analytics', typicalScope: 'Process orchestration', outcome: 'Friction elimination' },
          technologies: ['BPMN', 'Temporal', 'Apache Airflow', 'Kafka', 'FastAPI'],
          industries: ['Logistics', 'Operations', 'Finance', 'Manufacturing'],
          order: 4
        }
      ];

      for (const s of services) {
        await client.query(`
          INSERT INTO "Service" (
            id, title, slug, summary, description, "iconName", badge,
            capabilities, "processSteps", metrics, status, "order",
            "isFeatured", technologies, industries, "displayOrder",
            "ctaText", "ctaLink", "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PUBLISHED', $11, true, $12, $13, $11, 'Request Consultation', '/connect-with-us', NOW(), NOW()
          )
        `, [
          s.id, s.title, s.slug, s.summary, s.description, s.iconName, s.badge,
          s.capabilities, JSON.stringify(s.processSteps), JSON.stringify(s.metrics), s.order,
          s.technologies, s.industries
        ]);
      }
      console.log(`✅ ${services.length} Services seeded`);
    }

    // 7. Seed Insights
    const insCount = await client.query('SELECT COUNT(*) FROM "TechnologyInsight"');
    if (parseInt(insCount.rows[0].count) === 0) {
      const insights = [
        {
          id: 'art-1',
          slug: 'scaling-event-streaming-zero-data-loss',
          title: 'Architecting Event-Driven Streaming Pipelines with Zero Data Loss at 10M Events/Sec',
          category: 'System Architecture',
          readTime: '6 min read',
          authorName: 'Faizur Rahman',
          authorRole: 'Principal Solutions Architect',
          excerpt: 'How we engineered a fault-tolerant event processing architecture using partitioned streaming buffers, exactly-once deduplication keys, and distributed cold-storage syncing.',
          content: 'In high-concurrency transactional architectures, even a 0.001% data packet drop rate translates to thousands of lost financial records or broken downstream microservices. Building systems that pursue exactly-once delivery at massive volume requires abandoning simplistic queues in favor of distributed partitioned log structures.\n\nOur approach leverages distributed append-only journals combined with client-side idempotency hashing. When upstream clients push transactional payloads, an idempotent SHA-256 fingerprint is immediately assigned and stored in an ultra-fast in-memory Bloom filter before persisting into partitioned write-ahead logs.\n\nBy decoupling ingestion buffers from analytical consumers, the architecture can pursue illustrative targets such as low-double-digit millisecond P99 latency while remaining resilient through regional node outages without dropping in-flight events.\n\nWhen designing for enterprise scale, remember: simplicity in contract boundaries yields predictability in distributed fault domains.',
          tags: ['Architecture', 'Kafka', 'Streaming', 'Microservices', 'Zero-Loss'],
          isFeatured: true
        },
        {
          id: 'art-2',
          slug: 'private-enterprise-ai-rag-architectures',
          title: 'Building Air-Gapped Enterprise AI: Zero Data Leakage RAG Systems in Regulated Environments',
          category: 'Enterprise AI',
          readTime: '8 min read',
          authorName: 'V. Sundar',
          authorRole: 'Director of Cloud & AI Systems',
          excerpt: 'A blueprint for deploying private large language models with real-time vector search inside strict SOC 2 and HIPAA security boundaries without public API exposure.',
          content: 'Enterprise adoption of generative AI has frequently stalled at the security boundary. Corporate legal and compliance teams rightfully reject sending proprietary intellectual property and customer records across multi-tenant commercial LLM endpoints.\n\nThe modern enterprise solution is private RAG (Retrieval-Augmented Generation) hosted entirely within dedicated VPC or on-premise Kubernetes clusters using quantized open-weights models and hardware-accelerated inference engines.\n\nIn this architecture, document ingestion pipelines automatically tokenize, redact PII via local transformer models, and index vector embeddings into dedicated Qdrant or Milvus clusters with granular row-level access permissions.\n\nThe result is enterprise-grade contextual intelligence that operates under strict data-retention controls, supporting both regulatory standards and executive velocity goals.',
          tags: ['AI', 'RAG', 'VectorDB', 'Zero-Trust', 'HIPAA'],
          isFeatured: true
        },
        {
          id: 'art-3',
          slug: 'zero-downtime-monolith-to-microservice-migration',
          title: 'The Strangler Fig Pattern: Migrating Core Monoliths to Microservices with Zero Downtime',
          category: 'Cloud Modernization',
          readTime: '7 min read',
          authorName: 'A. K. Sharma',
          authorRole: 'Head of Pod Engineering',
          excerpt: 'Step-by-step strategies for deconstructing multi-gigabyte monolithic databases and application cores using dynamic reverse proxy routing and dual-write synchronizations.',
          content: 'The most dangerous decision an enterprise can make is a "Big Bang" rewrite of an active production monolith. Systems that took a decade to build contain countless undocumented domain edge cases that cannot be cleanly replicated in a single simultaneous cutover.\n\nThe Strangler Fig design pattern provides an incremental, zero-risk pathway. By placing an intelligent API gateway at the edge, individual functional domains (e.g., Auth, Inventory, Billing) are systematically intercepted and directed to modern microservices while the legacy core continues operating seamlessly.\n\nDual-write data synchronization with automated reconciliation background workers maintains parity between legacy relational tables and new distributed event streams during the multi-month transition period.\n\nOnly once the new services meet agreed high-availability reliability targets under production load is the legacy module permanently retired.',
          tags: ['Modernization', 'Microservices', 'DevOps', 'Cloud', 'Kubernetes'],
          isFeatured: true
        }
      ];

      for (const ins of insights) {
        await client.query(`
          INSERT INTO "TechnologyInsight" (
            id, title, slug, excerpt, content, "coverImage", "authorName", "authorRole",
            category, tags, "readTime", "isFeatured", status, "publishedAt", version, "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, $5, '/images/insights/cover-default.jpg', $6, $7, $8, $9, $10, $11, 'PUBLISHED', NOW(), 1, NOW(), NOW()
          )
        `, [
          ins.id, ins.title, ins.slug, ins.excerpt, ins.content, ins.authorName, ins.authorRole,
          ins.category, ins.tags, ins.readTime, ins.isFeatured
        ]);
      }
      console.log(`✅ ${insights.length} Insights seeded`);
    }

    // 8. Seed PageContent (Home, About, Values, Delivery, Privacy, Terms, Header, Footer)
    const pagesToSeed = [
      {
        slug: 'home',
        title: 'Home Page Content',
        data: {
          hero: {
            badge: 'Engineering Tomorrow’s Autonomous Enterprise',
            title: 'Enterprise Software Engineering for Complex Systems',
            subtitle: 'We engineer mission-critical digital systems, resilient microservice ecosystems, high-availability software platforms, and dedicated engineering pods for global enterprises.',
            primaryCtaText: 'Explore Our Portfolio',
            primaryCtaLink: '/products',
            secondaryCtaText: 'Request a Quote',
            secondaryCtaLink: '/request-for-quote',
            stats: [
              { label: 'Uptime Commitment', value: '99.99%' },
              { label: 'Engineering Principles', value: 'Clean Code' },
              { label: 'Architecture Model', value: 'Zero-Lockin' },
              { label: 'Client Collaboration', value: 'Dedicated Pods' }
            ]
          },
          productsSection: {
            badge: 'Our Software Platforms',
            title: 'Scalable Platforms Built for Enterprise Demands',
            subtitle: 'Pre-architected, enterprise-ready software engines designed for rapid customization and modular integration.'
          },
          servicesSection: {
            badge: 'Enterprise Services',
            title: 'Disciplined Engineering Solutions Across the Lifecycle',
            subtitle: 'From legacy modernization to high-velocity pod scaling, our engineering practices deliver dependability.'
          },
          aboutSection: {
            badge: 'Engineering Philosophy',
            title: 'Turning Complex Challenges Into Reliable Software',
            description: 'Azaroth Tech-Hive delivers practical software engineering solutions that help enterprises overcome technical challenges, improve operations, and turn ideas into dependable digital products.'
          },
          faqSection: {
            badge: 'Frequently Asked Questions',
            title: 'Clear Answers to Technical & Engagement Questions',
            faqs: [
              {
                question: 'What engagement models does Azaroth Tech-Hive support?',
                answer: 'We provide flexible engagement structures including Dedicated Engineering Pods, Fixed-Scope Project Milestones, and Strategic Architecture Retainers, all backed by strict IP protection and clear SLAs.'
              },
              {
                question: 'How do you ensure zero business disruption during modernization?',
                answer: 'We employ the Strangler Fig pattern with intelligent edge API gateways and automated dual-write synchronization to migrate legacy monoliths domain by domain without interrupting live operations.'
              },
              {
                question: 'Can your products be deployed on our private enterprise cloud?',
                answer: 'Yes. All Azaroth software platforms are cloud-agnostic and containerized via Docker and Kubernetes, deployable to AWS, Google Cloud, Azure, or air-gapped on-premise clusters.'
              }
            ]
          },
          finalCta: {
            title: 'Ready to Engineer Your Next-Generation Architecture?',
            subtitle: 'Connect with our principal architects to evaluate your technical roadmap and build systems that scale.',
            primaryCtaText: 'Schedule Technical Consultation',
            primaryCtaLink: '/connect-with-us',
            secondaryCtaText: 'Submit Request for Quote',
            secondaryCtaLink: '/request-for-quote'
          }
        }
      },
      {
        slug: 'values',
        title: 'Core Values & Principles',
        data: {
          badge: 'Our Principles',
          heroTitle: 'Principles That Shape Every Solution',
          heroDescription: 'The foundational values that guide our engineering decisions, client partnerships, and continuous pursuit of excellence in every solution we build.',
          values: [
            {
              number: '01',
              title: 'Purpose-Driven Innovation',
              description: 'We embrace innovation with intention, creating solutions that address real business challenges, deliver practical value, and make technology more useful.',
              iconName: 'Lightbulb'
            },
            {
              number: '02',
              title: 'Engineering Excellence',
              description: 'We prioritise clean code, sound architecture, rigorous testing, and dependable implementation to build software that performs reliably and stands the test of time.',
              iconName: 'ShieldCheck'
            },
            {
              number: '03',
              title: 'Simplicity by Design',
              description: 'We turn complexity into clarity, designing intuitive solutions that are easier to use, maintain, integrate, and evolve.',
              iconName: 'Maximize2'
            },
            {
              number: '04',
              title: 'Trust & Accountability',
              description: 'We value transparency, responsible engineering, and clear communication. We take ownership of our work and remain committed to delivering on our promises.',
              iconName: 'CheckCircle'
            },
            {
              number: '05',
              title: 'Collaborative Partnership',
              description: 'We work closely with clients and teams to understand their goals, exchange ideas, solve challenges, and create solutions that reflect real needs.',
              iconName: 'Users'
            },
            {
              number: '06',
              title: 'Continuous Evolution',
              description: 'We keep learning, adapting, and refining our approach to help software remain relevant, resilient, and ready for what comes next.',
              iconName: 'TrendingUp'
            }
          ]
        }
      },
      {
        slug: 'about',
        title: 'About Company & Culture',
        data: {
          badge: 'Who We Are',
          heroTitle: 'Engineering Practical Software That Drives Sustainable Growth',
          heroDescription: 'Azaroth Tech-Hive is a forward-thinking software engineering firm partnering with enterprises to simplify complexity, modernize critical infrastructure, and build dependable digital systems.',
          vision: {
            title: 'Our Vision',
            statement: 'To shape a future where thoughtful software engineering and continuous innovation enable businesses of every size to solve complex challenges, embrace new opportunities, and achieve sustainable growth.'
          },
          mission: {
            title: 'Our Mission',
            statement: 'To engineer practical, reliable, and adaptable software solutions that simplify complex challenges, improve everyday operations, and empower businesses to innovate, evolve, and grow with confidence.'
          },
          pillars: [
            { title: 'Architectural Discipline', description: 'Sound foundations, modular boundaries, and resilient fault isolation.' },
            { title: 'Predictable Delivery', description: 'Transparent sprint rhythms, automated testing, and clear delivery milestones.' },
            { title: 'Client Centricity', description: 'Direct access to senior engineering leads and dedicated accountability.' }
          ]
        }
      },
      {
        slug: 'delivery-framework',
        title: 'Delivery Framework & Methodology',
        data: {
          badge: 'Engineering Methodology',
          heroTitle: 'Disciplined Execution From Architecture to Zero-Downtime Deployment',
          heroDescription: 'Our four-phase delivery methodology ensures transparent governance, strict quality gates, and predictable milestones for every enterprise project.',
          phases: [
            { phase: '01', title: 'Discovery & Blueprinting', description: 'Domain modeling, architectural evaluation, technical debt inventory, and API contract design.' },
            { phase: '02', title: 'Iterative Pod Engineering', description: 'Sprint-based microservices development with automated linting, test suites, and peer reviews.' },
            { phase: '03', title: 'Verification & Quality Gates', description: 'Performance load testing, penetration testing, and compliance checklist sign-offs.' },
            { phase: '04', title: 'Deployment & Telemetry', description: 'Zero-downtime release pipelines, distributed tracing, and 24/7 observability monitoring.' }
          ]
        }
      },
      {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        data: {
          effectiveDate: 'October 16, 2026',
          contactEmail: 'privacy@azaroth-techhive.com',
          introduction: 'Azaroth Tech-Hive is dedicated to protecting the privacy and personal data of our website visitors, clients, and partners. This policy outlines how we collect, process, and safeguard information.',
          sections: [
            {
              heading: '1. Information We Collect',
              body: 'We collect information you directly provide to us through contact forms, RFQ submissions, and newsletter signups, including your full name, work email address, telephone number, company name, and project requirements.'
            },
            {
              heading: '2. How We Use Your Information',
              body: 'We use the collected information solely to respond to your technical inquiries, prepare proposals, deliver contracted software services, and fulfill our contractual obligations. We never sell your personal data.'
            },
            {
              heading: '3. Data Retention & Security Controls',
              body: 'All data is stored in encrypted PostgreSQL databases utilizing industry-standard TLS encryption in transit and AES-256 at rest. Access is strictly limited to authorized administrative personnel.'
            },
            {
              heading: '4. Your Rights (GDPR & International Laws)',
              body: 'You retain the right to request access to, rectification of, or erasure of your personal data stored within our systems. Contact our privacy team at privacy@azaroth-techhive.com for all requests.'
            }
          ]
        }
      },
      {
        slug: 'terms-of-service',
        title: 'Terms of Service',
        data: {
          effectiveDate: 'October 16, 2026',
          governingLaw: 'Chennai, India',
          introduction: 'These Terms of Service govern your use of the Azaroth Tech-Hive website, platforms, and software engineering consulting services.',
          sections: [
            {
              heading: '1. Intellectual Property & Ownership',
              body: 'All client deliverables and custom software developed under formal Statement of Work (SOW) agreements are transferred entirely to the client upon full payment. Azaroth proprietary framework tools remain property of Azaroth Tech-Hive under non-exclusive licenses.'
            },
            {
              heading: '2. Confidentiality & Non-Disclosure',
              body: 'Both parties agree to hold all proprietary trade secrets, architecture designs, business requirements, and client data in strict confidence under binding non-disclosure commitments.'
            },
            {
              heading: '3. Limitation of Liability',
              body: 'In no event shall Azaroth Tech-Hive be liable for indirect, incidental, or consequential damages exceeding the fees actually paid for the specific engineering phase in dispute.'
            },
            {
              heading: '4. Dispute Resolution & Jurisdiction',
              body: 'These Terms are governed by the laws of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in Chennai, India.'
            }
          ]
        }
      }
    ];

    for (const page of pagesToSeed) {
      await client.query(`
        INSERT INTO "PageContent" (id, slug, title, data, "updatedAt")
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (slug) DO UPDATE
        SET title = EXCLUDED.title, data = EXCLUDED.data, "updatedAt" = NOW()
      `, [`page-${page.slug}`, page.slug, page.title, JSON.stringify(page.data)]);
    }
    console.log(`✅ ${pagesToSeed.length} PageContent documents seeded`);

    // 9. Seed Testimonials
    const testCount = await client.query('SELECT COUNT(*) FROM "Testimonial"');
    if (parseInt(testCount.rows[0].count) === 0) {
      const testimonials = [
        {
          id: 'test-1',
          clientName: 'Rajesh Subramanian',
          role: 'Chief Technology Officer',
          organization: 'Apex Logistics International',
          quote: 'Azaroth Tech-Hive modernized our legacy dispatch and tracking monolith into an event-driven architecture with zero downtime during peak season. Their architectural rigor is unmatched.',
          rating: 5,
          isFeatured: true,
          order: 1
        },
        {
          id: 'test-2',
          clientName: 'Elena Rostova',
          role: 'VP of Product Engineering',
          organization: 'Nordic Health Systems',
          quote: 'The dedicated engineering pod from Azaroth integrated seamlessly into our sprint ceremonies. They delivered our clinical scheduling module ahead of schedule with 98% test coverage.',
          rating: 5,
          isFeatured: true,
          order: 2
        }
      ];

      for (const t of testimonials) {
        await client.query(`
          INSERT INTO "Testimonial" (
            id, "clientName", role, organization, "avatarUrl", rating, quote, "isFeatured", "order", "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, '/images/testimonials/avatar-default.jpg', $5, $6, $7, $8, NOW(), NOW()
          )
        `, [t.id, t.clientName, t.role, t.organization, t.rating, t.quote, t.isFeatured, t.order]);
      }
      console.log(`✅ ${testimonials.length} Testimonials seeded`);
    }

    await client.query('COMMIT');
    console.log('🎉 CMS Database initialization and seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing CMS database:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initCmsDatabase();
