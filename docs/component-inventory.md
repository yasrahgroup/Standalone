# Component Inventory & Design Tokens Catalog

**Project:** Azaroth UI  
**Phase:** Phase 1 — Requirements and Reference Audit  
**Date:** 2026-10-11  

---

## 1. Overview

This component inventory categorizes every user interface component required for the Azaroth UI application. All components are designed according to strict design standards: Vanilla CSS tokens, glassmorphism surfaces, high-contrast accessible typography, micro-interactions, and mobile responsiveness.

---

## 2. Common & Global Layout Components

### 2.1 `Header` (`src/components/common/Header.tsx`)
* **Category:** Global Layout
* **Description:** Top sticky navigational bar with backdrop blur, brand logo, desktop dropdown menus, action CTAs, and mobile drawer trigger.
* **States:** Normal, Scrolled (`hasScrolled ? 'bg-[#fafaf7]/85 backdrop-blur-md shadow-sm border-b' : 'bg-transparent'`), Mobile Open.
* **Tokens Used:** `--color-canvas-bg`, `--color-primary-green`, `--color-gold-from`, `--color-gold-to`, `--font-sans`.
* **Sub-components:**
  * `NavDropdown`: Dropdown card with category groups and preview icons.
  * `MobileMenu`: Slide-over overlay with staggered link entrance animations.

### 2.2 `Footer` (`src/components/common/Footer.tsx`)
* **Category:** Global Layout
* **Description:** Enterprise 4-column footer containing brand mission, solutions directory, Chennai head office credentials, newsletter signup, and legal links.
* **Tokens Used:** `--color-canvas-dark`, `--color-text-slate`, `--color-border-subtle`, `--color-gold-from`.
* **Interactive Elements:** Newsletter email input with instant validation, external social links opening in `_blank` with `rel="noreferrer"`.

### 2.3 `Button` (`src/components/common/Button.tsx`)
* **Category:** Core UI Primitive
* **Variants:**
  * `primary-gold`: Gradient from `#D4AF37` to `#BF9129`, text `#012411`, font-bold, shadow-sm, hover lift `-1px`.
  * `brand-green`: Background `#006C35`, text `#ffffff`, hover background `#00562a`.
  * `outline-glass`: Translucent background, border `1px solid rgba(0,0,0,0.12)`, hover border `#006C35`.
  * `ghost`: Transparent background, hover background `rgba(0, 108, 53, 0.08)`.
* **States:** Default, Hover, Active, Focus-Visible (`ring-2 ring-[#006C35] ring-offset-2`), Disabled (`opacity-50 pointer-events-none`).

### 2.4 `Card` (`src/components/common/Card.tsx`)
* **Category:** Core UI Primitive
* **Variants:** `glass` (translucent backdrop blur), `solid` (clean surface card with border), `elevated` (subtle shadow with hover lift).
* **Props:** `variant`, `padding`, `interactive`, `className`, `children`.

### 2.5 `Badge` (`src/components/common/Badge.tsx`)
* **Category:** Core UI Primitive
* **Variants:** `emerald` (green tint), `gold` (subtle amber), `slate` (neutral gray), `outline`.
* **Usage:** Category tags, status pills, SLA markers, reading time tags.

---

## 3. Page-Specific Component Directory

### 3.1 Homepage Components
| Component Name | File Path | Responsibilities & Behavior |
| :--- | :--- | :--- |
| `Hero` | `src/components/home/Hero.tsx` | Main value proposition, dynamic ambient glow canvas, trust badges, dual CTAs ("Explore Products", "Request for Quote"). |
| `MetricsBanner` | `src/components/home/MetricsBanner.tsx` | 4-column metric counter bar with intersection observer animation (99.99% uptime, 50+ enterprise architectures, 10M+ daily events). |
| `Pillars` | `src/components/home/Pillars.tsx` | 3 architectural pillars (Velocity, Zero-Trust Security, Infinite Scale) with icon glyphs and hover card transitions. |
| `FeaturedSolutions` | `src/components/home/FeaturedSolutions.tsx` | Interactive product and platform showcase with tabbed category toggling and direct RFQ triggers. |
| `DeliveryTeaser` | `src/components/home/DeliveryTeaser.tsx` | Compact 6-stage delivery pipeline teaser linking to `/delivery-framework`. |
| `InsightsTeaser` | `src/components/home/InsightsTeaser.tsx` | 3 latest enterprise technical articles with reading time and author metadata. |
| `CtaBanner` | `src/components/home/CtaBanner.tsx` | High-impact full-width call-to-action driving inquiries to `/request-for-quote`. |

### 3.2 About Us & Values Components
| Component Name | File Path | Responsibilities & Behavior |
| :--- | :--- | :--- |
| `AboutHero` | `src/components/about/AboutHero.tsx` | Company narrative headline and Chennai engineering hub highlight. |
| `LeadershipGrid` | `src/components/about/LeadershipGrid.tsx` | Leadership cards with profile portraits, role titles, and bio modal triggers. |
| `LocationCard` | `src/components/about/LocationCard.tsx` | Physical office credentials for Chennai (24, Malaviya Ave) with Google Maps button. |
| `ValueCard` | `src/components/values/ValueCard.tsx` | Value cards showcasing core engineering tenets with micro-interaction hover scaling. |

### 3.3 Delivery Framework Components
| Component Name | File Path | Responsibilities & Behavior |
| :--- | :--- | :--- |
| `ProcessTimeline` | `src/components/framework/ProcessTimeline.tsx` | Interactive 6-stage stepper showing Discovery, Architecture, Agile Pods, QA, Launch, and Continuous Operations. |
| `MilestoneAccordion`| `src/components/framework/MilestoneAccordion.tsx` | Expandable detail panels listing verifiable deliverables and SLAs per stage. |

### 3.4 Products & Services Components
| Component Name | File Path | Responsibilities & Behavior |
| :--- | :--- | :--- |
| `ProductCatalog` | `src/components/products/ProductCatalog.tsx` | Grid listing of products with instant category filter (AI, Cloud, Security, Data). |
| `ProductCard` | `src/components/products/ProductCard.tsx` | Product teaser card with key technical pills, description, and "Learn More" link. |
| `TechSpecsTable` | `src/components/products/TechSpecsTable.tsx` | Detailed technical specifications table (throughput, latency, compliance, protocols). |
| `ServicesCatalog` | `src/components/services/ServicesCatalog.tsx` | Directory of service offerings (Engineering Pods, Cloud Modernization, AI Systems). |
| `SlaMatrix` | `src/components/services/SlaMatrix.tsx` | Responsive tiered comparison table of SLAs, response times, and dedicated architect support. |

### 3.5 Resource Hub & Insights Components
| Component Name | File Path | Responsibilities & Behavior |
| :--- | :--- | :--- |
| `ResourceSearch` | `src/components/insights/ResourceSearch.tsx` | Search bar with 300ms debounce and active filter tags. |
| `InsightCard` | `src/components/insights/InsightCard.tsx` | Article preview with category badge, reading time, author, and date. |
| `TableOfContents` | `src/components/insights/TableOfContents.tsx` | Sticky sidebar parsing article headings with active scroll-spy highlight. |
| `CodeBlock` | `src/components/insights/CodeBlock.tsx` | Syntax-highlighted code container with one-click copy button. |

### 3.6 Contact & RFQ Components
| Component Name | File Path | Responsibilities & Behavior |
| :--- | :--- | :--- |
| `ContactForm` | `src/components/contact/ContactForm.tsx` | Real-time validated contact form with business email check, company size selector, and success state. |
| `RfqWizard` | `src/components/rfq/RfqWizard.tsx` | 4-step wizard container handling state transition, form validations, and progress calculation. |
| `StepIndicator` | `src/components/rfq/StepIndicator.tsx` | Stepper visualizing Step 1 (Solutions), Step 2 (Scope), Step 3 (Budget), Step 4 (Contact). |
| `RfqSuccessModal`| `src/components/rfq/RfqSuccessModal.tsx` | Modal displaying generated reference ID (e.g. `AZR-RFQ-2026-8921`) and next steps. |

---

## 4. Accessibility & Micro-interaction Standards

1. **Keyboard Navigation:** All interactive elements (`Button`, `NavDropdown`, `Accordion`, `Input`, `Select`) include visible `:focus-visible` styling (`outline: 2px solid #006C35; outline-offset: 2px;`).
2. **Screen Reader Attributes:** ARIA labels on all icon-only buttons (`aria-label="Open navigation menu"`), `aria-expanded` on accordion and dropdown triggers.
3. **Contrast Ratios:** Text colors adhere to WCAG 2.1 AA standards (minimum 4.5:1 for body copy and 3.0:1 for large headers).
4. **Motion Preference:** Media query `@media (prefers-reduced-motion: reduce)` disables all non-essential transitions and particles.
