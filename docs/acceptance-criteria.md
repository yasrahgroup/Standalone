# Acceptance Criteria & Quality Assurance Specifications

**Project:** Azaroth UI  
**Phase:** Phase 1 — Requirements and Reference Audit  
**Date:** 2026-10-11  

---

## 1. Overview

This document specifies the definitive acceptance criteria for the Azaroth UI web application. Acceptance criteria are defined using structured Given-When-Then test cases and rigorous quality thresholds across visual design, responsiveness, performance, accessibility, and functional workflows.

---

## 2. Global Quality Standards

### 2.1 Visual Design & Aesthetic Standards
* **Aesthetic Threshold:** Must present a bespoke, state-of-the-art enterprise aesthetic matching the Azaroth Tech-Hive brand identity (`#006C35` emerald, `#012411` dark forest, `#D4AF37` imperial gold gradient, `#fafaf7` warm ivory canvas). Plain or generic MVP styles are strictly unacceptable.
* **Micro-interactions:** Interactive elements (buttons, cards, navigation items) must feature smooth transitions (150ms-250ms ease-out) with subtle elevation, border glow, or scale micro-interactions.
* **Glassmorphism:** Navigation bar and elevated modals must feature translucent backdrops with `backdrop-filter: blur(12px)` and subtle dividing borders (`1px solid rgba(0,0,0,0.08)` or `rgba(255,255,255,0.1)`).

### 2.2 Responsive Viewport Standards
* **Breakpoints:**
  * Desktop: `1440px` and `1280px` (Clean multi-column layout, full horizontal navigation)
  * Tablet: `768px` to `1024px` (Adapted 2-column grids, collapsible drawer navigation)
  * Mobile: `375px` to `640px` (Stacked single-column layout, touch targets >= 44x44px, full slide-over menu)
* **Zero Horizontal Overflow:** No page or modal may produce unintended horizontal scrollbars at any viewport width down to 320px.

### 2.3 Accessibility & Performance Benchmarks
* **WCAG 2.1 AA Compliance:** Minimum 4.5:1 text-to-background contrast ratio for all body typography; 3.0:1 for large display headers and icons.
* **Keyboard Navigability:** All interactive components must be reachable via `Tab` key and display an explicit `:focus-visible` outline.
* **Performance:** Lighthouse Performance score >= 90; First Contentful Paint (FCP) < 1.2s; Largest Contentful Paint (LCP) < 2.5s; Cumulative Layout Shift (CLS) < 0.05.

---

## 3. Page & Flow Acceptance Criteria

### 3.1 Global Header & Navigation
```gherkin
Scenario: Desktop Navigation & Sticky Behavior
  Given a user on a desktop viewport (1440px)
  When the user scrolls down the page beyond 20px
  Then the Header remains fixed at the top with a translucent backdrop blur and bottom border
  And clicking "Our Products" or "Our Services" opens an interactive dropdown menu with sub-links

Scenario: Mobile Navigation Slide-Over Drawer
  Given a user on a mobile viewport (375px)
  When the user taps the hamburger menu button
  Then a full-height slide-over drawer animates smoothly into view from the right
  And body scrolling is locked while the drawer is open
  And pressing the Escape key or tapping the close button dismisses the drawer
```

### 3.2 Homepage (`/`)
```gherkin
Scenario: Hero Section Conversion Triggers
  Given a user landing on the Homepage
  When the user views the Hero section
  Then the primary headline, subtext, and trust metrics are immediately legible
  And clicking "Request for Quote" navigates to "/request-for-quote"
  And clicking "Explore Products" navigates to "/products"

Scenario: Metrics Counter Animation
  Given a user scrolling down the Homepage
  When the Metrics Banner enters the viewport
  Then the metrics (e.g. 99.99% uptime, 50+ enterprise architectures) animate smoothly to their target values
```

### 3.3 Delivery Framework (`/delivery-framework`)
```gherkin
Scenario: 6-Stage Timeline Interaction
  Given a user on the Delivery Framework page
  When the user views the Process Timeline
  Then all 6 delivery stages (Discovery, Architecture, Agile Pods, QA, Launch, 24/7 Operations) are displayed in sequential order
  And clicking an individual stage expands its milestone checklist and verification criteria
```

### 3.4 Explore Products & Detail Pages (`/products`, `/products/:slug`)
```gherkin
Scenario: Product Catalog Category Filtering
  Given a user on the Products catalog page
  When the user selects the "Enterprise AI" category filter
  Then only products matching that category are visible in the grid
  And the URL updates to reflect the active filter state

Scenario: Product Technical Overview
  Given a user on a specific product detail page (`/products/:slug`)
  When the user inspects the specifications section
  Then the technical specs table displays latency, throughput, and compatibility protocols
  And clicking "Request Quote for this Product" navigates to RFQ with the product pre-selected
```

### 3.5 Resource Hub & Insights Reader (`/technology-insights`, `/technology-insights/:slug`)
```gherkin
Scenario: Instant Keyword Search with Debounce
  Given a user on the Resource Hub page
  When the user types a query into the search input
  Then the list of insights filters in real time with a 300ms debounce
  And an empty state message is shown if no resources match the query

Scenario: Sticky Table of Contents & Reading Progress
  Given a user reading an Insight article
  When the user scrolls through article headings
  Then the sticky Table of Contents highlights the currently visible section in the viewport
  And clicking a TOC link smoothly scrolls to the corresponding anchor heading
```

### 3.6 Connect With Us (`/connect-with-us`)
```gherkin
Scenario: Contact Form Validation & Submission
  Given a user on the Connect With Us page
  When the user submits the form with an invalid email syntax or empty required fields
  Then inline validation error messages highlight each problematic field
  And the submit button remains disabled or indicates correction is needed
  When all valid fields are supplied and submitted
  Then a confirmation toast is rendered and the form fields reset
```

### 3.7 Request for Quote (RFQ) Multi-Step Wizard (`/request-for-quote`)
```gherkin
Scenario: 4-Stage RFQ Wizard Flow
  Given a user starting the RFQ Wizard
  When the user selects solutions in Step 1 and clicks "Continue"
  Then the wizard progresses to Step 2 (Scope & Urgency) and updates the step progress indicator
  And when the user completes all 4 steps and submits
  Then a dedicated confirmation screen displays a generated Reference ID (e.g., `AZR-RFQ-2026-XXXX`)
  And the drafted session state is cleared
```

---

## 4. Phase Exit Checklist & Verification Sign-Off

- [x] **Requirement Traceability:** Every client requirement mapped in `docs/requirements-matrix.md`.
- [x] **Reference Audit:** Complete inspection of reference site tokens, layout, and structure in `docs/reference-audit.md`.
- [x] **Route Catalog:** All 18 public and administrative routes cataloged in `docs/route-inventory.md`.
- [x] **Component Architecture:** Every layout primitive, page component, and card specified in `docs/component-inventory.md`.
- [x] **Media & Assets:** Brand logos, Lucide icon glyphs, and typography mapped in `docs/asset-inventory.md`.
- [x] **Service Endpoints:** API routes, WhatsApp chat, and mailto triggers documented in `docs/integration-inventory.md`.
- [x] **Risk Register:** Active risks analyzed with mitigation and contingency protocols in `docs/risk-register.md`.
- [x] **Acceptance Criteria:** Given-When-Then scenarios compiled for every critical user journey in `docs/acceptance-criteria.md`.
