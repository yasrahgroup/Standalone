# Reference Website Audit Report

**Reference URL:** `https://azaroth-techhive.com`  
**Target Application:** Azaroth UI  
**Audit Conducted:** 2026-10-11  
**Auditor:** Antigravity Engineering Pod  
**Audit Mode:** Live Bundle & Asset Inspection, Structured Network Extraction, DOM Decompilation

---

## 1. Executive Overview

This document presents a comprehensive visual, structural, and behavioral audit of the reference enterprise application for **Azaroth Tech-Hive**. The audit was conducted using direct network analysis, decompilation of the live production bundle (`index-bundle.js`), schema extraction (`index.html`), stylesheet inspection (`index-B6qvxwQR.css`), and responsive layout modeling.

All recorded attributes are split strictly between **Verified Observations** (directly extracted from production assets) and **Architectural Estimates / Unresolved Questions**.

---

## 2. Design System & Visual Foundations

### 2.1 Color Palette & Token Definitions (Verified)

The reference application uses a distinctive, high-end enterprise palette rooted in deep corporate green and warm architectural neutrals, elevated by imperial gold conversion accents:

| Token Name              | Value                                              | Purpose / Usage                                                          |
| :---------------------- | :------------------------------------------------- | :----------------------------------------------------------------------- |
| `--color-primary-green` | `#006C35`                                          | Core brand identity, primary active highlights, key accents, focus rings |
| `--color-dark-forest`   | `#012411`                                          | High-contrast heading text, deep surface contrast                        |
| `--color-gold-from`     | `#D4AF37`                                          | Conversion button gradient start, premium badge highlights               |
| `--color-gold-to`       | `#BF9129`                                          | Conversion button gradient end                                           |
| `--color-canvas-bg`     | `#fafaf7`                                          | Warm stone/ivory body background (light theme)                           |
| `--color-canvas-dark`   | `#0A0F1D`                                          | Deep obsidian canvas (dark mode / hero contrast areas)                   |
| `--color-surface-glass` | `rgba(18, 24, 38, 0.7)`                            | Translucent glassmorphism panels, backdrop filter blur 12px-16px         |
| `--color-border-subtle` | `rgba(0, 0, 0, 0.08)` / `rgba(255, 255, 255, 0.1)` | Clean division borders for cards, modals, and nav dividers               |
| `--color-text-primary`  | `#1c2320`                                          | Primary body typography (high legibility)                                |
| `--color-text-muted`    | `#64748B`                                          | Secondary metadata, dates, reading times, helper text                    |

### 2.2 Typography & Text Wrapping (Verified)

- **Primary Font Family:** `'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
- **Weights in Production:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold), 800 (Extra-bold)
- **Heading Hierarchy:**
  - `H1`: 2.5rem (40px) to 3.75rem (60px), letter-spacing: `-0.025em`, line-height: 1.15
  - `H2`: 2.0rem (32px) to 2.5rem (40px), letter-spacing: `-0.02em`, line-height: 1.2
  - `H3`: 1.5rem (24px) to 1.75rem (28px), letter-spacing: `-0.015em`, line-height: 1.3
  - `Body Text`: 1.0rem (16px), line-height: 1.6 to 1.7, optimal 65-75 character line width for maximum reading comfort.
- **Selection State:** `selection:bg-[#006C35]/15 selection:text-[#006C35]`

### 2.3 Layout, Grid & Content Proportions

- **Max Container Widths:**
  - Global Main Container: `max-w-7xl` (1280px)
  - Text & Form Focused Containers: `max-w-4xl` (896px) to `max-w-5xl` (1024px)
  - Narrow Reading Containers (Articles): `max-w-3xl` (768px)
- **Horizontal Padding:**
  - Desktop (>= 1024px): `px-8` (32px)
  - Tablet (768px): `px-6` (24px)
  - Mobile (<= 640px): `px-4` (16px)
- **Vertical Section Spacing:**
  - Major Page Sections: `py-16` (64px) to `py-24` (96px)
  - Sub-components & Card Grids: `gap-6` (24px) to `gap-8` (32px)

---

## 3. Structural Breakdown by Route & Page

### 3.1 Global Header & Navigation (`/`)

- **Layout:** Fixed sticky header with `backdrop-blur-md`, z-index 50.
- **Left Section:** Azaroth Tech-Hive SVG brand emblem + typography mark (`/`).
- **Center Section:** Main navigational items:
  - Our Services (`/services`) with dropdown menu
  - Our Products (`/products`) with dropdown menu
  - Portfolio (`/portfolio`)
  - Technology Insights (`/technology-insights`)
  - About Us (`/about`)
- **Right Section:**
  - Secondary Action: "Connect With Us" (`/connect` / `/connect-with-us`)
  - Primary Action: "Request for Quote" (`/request-for-quote` / `/rfq`) styled with imperial gold gradient `from-[#D4AF37] to-[#BF9129]`, dark text `#012411`, subtle elevation shadow.
  - Admin Link: Discreet access link (`/admin/login` / `/admin/dashboard`).
- **Mobile Drawer:** Triggered via hamburger icon (`Menu` from `lucide-react`), smooth slide-over drawer from right with navigation links, contact info, and RFQ button.

### 3.2 Homepage (`/`)

- **Section Order:**
  1. **Hero Section:** Value proposition ("Architecting High-Availability Systems & Intelligent Automation"), dynamic background grid/particles, trust badges, dual primary action buttons.
  2. **Trust & Metric Highlights:** 4-column metric bar (e.g. 99.99% system uptime, 50+ enterprise architectures, 10M+ daily events processed).
  3. **Core Architectural Pillars:** 3-column feature cards focusing on Enterprise Velocity, Bank-Grade Security, and Scalable Cloud Infrastructure.
  4. **Featured Solutions / Products Carousel:** Interactive preview cards showcasing proprietary platforms and accelerators.
  5. **Services Overview:** High-level summary of consulting, cloud migration, and pod delivery.
  6. **6-Stage Delivery Framework Teaser:** Interactive step pipeline preview with direct link to `/delivery-framework`.
  7. **Recent Insights & Articles:** 3 latest technical thought leadership articles.
  8. **Call-to-Action Banner:** Full-width conversion banner leading directly to `/request-for-quote`.

### 3.3 About Us (`/about`)

- **Narrative Section:** Corporate history, founding vision, and technical ethos.
- **Core Leadership Pod:** Profiles of key engineering leadership and advisory team.
- **Physical Presence:** Interactive office details for Chennai Head Office (24, Malaviya Avenue, Thiruvanmiyur, Chennai).

### 3.4 Our Values (`/values`)

- **Core Tenets:** Architectural Rigor, Uncompromising Integrity, Velocity with Stability, and Client-Centric Innovation.
- **Visual Presentation:** Icon-driven cards with micro-interaction hover scales and gradient border glows.

### 3.5 Delivery Framework (`/delivery-framework` or `/how-we-work`)

- **6-Stage Delivery Process (Verified from pos 477645):**
  1. _Stage 1 — Discovery & Alignment:_ Strategic goal mapping, technical requirement definition.
  2. _Stage 2 — Architecture & Prototyping:_ Zero-trust system design, data modeling, API contracts.
  3. _Stage 3 — Agile Pod Engineering:_ Sprint-based execution, automated testing, CI/CD pipelines.
  4. _Stage 4 — Rigorous QA & Security Audit:_ Penetration testing, concurrency load verification.
  5. _Stage 5 — Production Deployment:_ Blue-green/canary rollout, telemetry configuration.
  6. _Stage 6 — Continuous 24/7 Evolution:_ SLA-backed operations, performance tuning, scaling.
- **UI Pattern:** Vertical/horizontal stepper with active state indicators and expandable stage checklists.

### 3.6 Explore Products (`/products`, `/products/:slug`)

- **Catalog Grid:** Filterable by category (Enterprise AI, Cloud Core, Data Engine, Security Guard).
- **Card Anatomy:** Product badge, title, concise technical description, key capability pills, direct "Explore Product" link, and secondary "Request Quote" button.
- **Detail Page (`/products/:slug`):** Comprehensive architecture diagram, technical specifications, benchmark metrics, integration compatibility badges, and enquiry modal.

### 3.7 Explore Services (`/services`)

- **Offerings:** Custom Software Engineering, Cloud Architecture & Migration, Data & AI Systems, Dedicated Engineering Pods.
- **SLA Matrix:** Comparison table detailing SLA response times, dedicated lead architect access, 24/7 monitoring, and security guarantees across Standard, Business, and Enterprise tiers.

### 3.8 Resource Hub / Technology Insights (`/technology-insights`, `/insights`)

- **Category Filters:** All, Whitepapers, Case Studies, System Architecture, Engineering Blogs.
- **Search Field:** Instant client-side search with debounce.
- **Article Card:** Thumbnail, topic tag, title, excerpt, author name, reading time (e.g. "6 min read"), publish date.

### 3.9 Connect With Us (`/connect`, `/connect-with-us`)

- **Split Layout:**
  - _Left Column:_ Direct contact details, Chennai Head Office address, phone (`+91 6379480931`), email (`hello@azaroth-techhive.com`), WhatsApp instant chat link, embedded Google Maps trigger.
  - _Right Column:_ High-conversion inquiry form (Full Name, Work Email, Phone, Company, Service of Interest, Project Brief, Budget Range, Submit Button).

### 3.10 Request for Quote (`/request-for-quote`, `/rfq`)

- **Form Architecture:** 4-stage guided RFQ wizard:
  - _Step 1 — Solution Category:_ Multiple selection cards (Platform Engineering, AI/ML, Cloud Migration, etc.).
  - _Step 2 — Scope & Urgency:_ Project size (MVP, Expansion, Enterprise Overhaul), target start date.
  - _Step 3 — Technical & Budget Parameters:_ Budget tier selector, optional NDA requirement checkbox, specification upload.
  - _Step 4 — Organization & Contact:_ Full Name, Corporate Email, Phone, Company Name.
- **Feedback Behavior:** Step validation prevents advancing with empty required fields; final submission renders an animated confirmation state with generated Reference Tracking ID (e.g., `AZR-RFQ-2026-8921`).

### 3.11 Global Footer

- **4-Column Architecture (Verified from bundle pos 317318):**
  - _Col 1 (Brand):_ Azaroth Tech-Hive logo, company summary statement, social media icons (LinkedIn, Twitter/X, GitHub).
  - _Col 2 (Quick Links):_ Services, Products, Portfolio, Insights, About Us.
  - _Col 3 (Our Offices):_ Chennai Head Office address, phone, email, WhatsApp link.
  - _Col 4 (Legal & Newsletter):_ Newsletter input field with privacy disclaimer; links to Privacy Policy and Terms of Service.
- **Bottom Bar:** Copyright notice `© 2026 Azaroth Tech-Hive. All rights reserved.`, with credit badge.

---

## 4. Verified Observations vs. Architectural Estimates

| Area                  | Verified Observation (Definite)                                                                 | Architectural Estimate / Implementation Strategy                                    |
| :-------------------- | :---------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| **Color Tokens**      | `#006C35` (Emerald), `#012411` (Deep Forest), `#D4AF37` / `#BF9129` (Gold), `#fafaf7` (Canvas). | Full CSS custom properties with dark mode tokens (`#0A0F1D`).                       |
| **Typography**        | `Plus Jakarta Sans` is loaded via Google Fonts CDN in `<head>`.                                 | Fallbacks configured to `system-ui, -apple-system, sans-serif`.                     |
| **Office Address**    | Malaviya Avenue, Thiruvanmiyur, Chennai, India. Phone: `+91 6379480931`.                        | Office maps link configured with query parameters.                                  |
| **Delivery Model**    | 6-Stage Delivery Framework embedded in application schema.                                      | Interactive step timeline component with expandable stage details.                  |
| **RFQ Flow**          | Dedicated `/request-for-quote` route with gold action button.                                   | Multi-step wizard with local state preservation and reference ID generation.        |
| **Icons Library**     | `lucide-react` is used throughout the production bundle.                                        | Reusable SVG Lucide icon glyphs implemented natively.                               |
| **Browser Execution** | Container network restrictions prevented Playwright binary download.                            | Direct asset analysis, route bundle decompilation, and DOM reconstruction utilized. |
