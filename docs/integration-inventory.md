# Integration Inventory & Service Endpoints

**Project:** Azaroth UI  
**Phase:** Phase 1 — Requirements and Reference Audit  
**Date:** 2026-10-11  

---

## 1. Overview

This document catalogs all external integrations, communication channels, API endpoints, third-party services, and client-side storage mechanisms utilized by the Azaroth UI application. In strict accordance with security policies, all environment variables and secrets are abstracted and zero credentials are exposed.

---

## 2. API Services & Form Integrations

| Integration ID | Service / Feature | Target Endpoint / Method | Payload Schema | Error Handling / Fallback |
| :--- | :--- | :--- | :--- | :--- |
| **INT-01** | Contact & Enquiry Form (`/connect-with-us`) | `POST /api/enquiries` | `{ name: string, email: string, phone?: string, company?: string, service: string, message: string }` | Client-side validation; optimistic offline submission queue with user success toast; local fallback confirmation. |
| **INT-02** | Request for Quote Wizard (`/request-for-quote`) | `POST /api/rfq` | `{ solutionType: string[], scope: string, timeline: string, budgetRange: string, contact: { name, email, phone, company }, ndaRequired: boolean }` | Multi-step validation; state preserved across refresh; reference ID generated on client or server response. |
| **INT-03** | Newsletter Subscription (Footer) | `POST /api/newsletter` | `{ email: string }` | Inline email format validation; duplicate detection; non-blocking success toast. |
| **INT-04** | Admin Authentication Portal (`/admin/login`) | `POST /api/auth/login` | `{ email: string, password: string }` | Rate limiting; secure HTTP-only cookie session handling; clear error messaging without user enumeration. |
| **INT-05** | Resource / Whitepaper Download | Client trigger / `GET /api/resources/:id` | `{ resourceId: string, userEmail?: string }` | Direct PDF / document download link with optional lead capture prompt. |

---

## 3. Communication & Direct Channel Integrations

| Channel | Target Destination | Integration Type | Fallback / Behavior |
| :--- | :--- | :--- | :--- |
| **WhatsApp Direct Chat** | `https://wa.me/916379480931` (Phone: `+91 6379480931`) | Direct URI link with pre-filled greeting (`"Hello Azaroth Tech-Hive, I would like to inquire about enterprise software services."`) | Opens WhatsApp Web on desktop or native app on mobile. |
| **Direct Sales Telephone** | `tel:+916379480931` | Native telephony URI | Triggers device dialer on mobile / VoIP on desktop. |
| **Sales Email Inquiries** | `mailto:hello@azaroth-techhive.com` | Standard mailto protocol with subject pre-filled | Launches default email client. |
| **Google Maps Location** | `https://www.google.com/maps/search/?api=1&query=Thiruvanmiyur+Chennai+India` | HTTPS link opening in new tab | Displays pinned location of Chennai Head Office in Google Maps. |

---

## 4. Social & Ecosystem Integrations

| Platform | Profile URL | Purpose |
| :--- | :--- | :--- |
| **LinkedIn** | `https://www.linkedin.com/company/azaroth-tech-hive` | Enterprise corporate profile, leadership updates, career postings |
| **Twitter / X** | `https://twitter.com/azarothtech` | Technical insights, platform announcements, engineering threads |
| **GitHub** | `https://github.com/azaroth-tech` | Open source accelerators, developer SDKs, enterprise reference architectures |

---

## 5. Web Standards, Telemetry & Analytics

| Tool / Provider | Configuration / Tag | Purpose | Privacy Compliance |
| :--- | :--- | :--- | :--- |
| **Schema.org Structured Data** | JSON-LD `<script type="application/ld+json">` | Organization schema defining name, logo, contact points, and social profiles | Zero user tracking; purely for semantic search engine optimization. |
| **Cloudflare Insights / Beacon** | Script tag in production HTML | Anonymous web performance metrics (Core Web Vitals, page load duration) | Privacy-friendly; no PII collected; respects cookie consent preferences. |
| **Robots & Canonical** | `<meta name="robots" content="index, follow" />`, `<link rel="canonical" href="..." />` | Search engine crawl instructions and duplicate URL prevention | Standard web protocol. |

---

## 6. Client-Side State & Storage Architecture

| Key | Storage Engine | Lifespan | Stored Information | Security Guardrails |
| :--- | :--- | :--- | :--- | :--- |
| `azr_rfq_draft` | `sessionStorage` | Active browser session | In-progress multi-step RFQ inputs | Excludes payment or credential info; wiped upon final submission. |
| `azr_theme_preference` | `localStorage` | Persistent | User UI theme preference (`light` / `dark` / `system`) | Strictly non-sensitive boolean/string token. |
| `azr_cookie_consent` | `localStorage` | Persistent (1 year) | User acknowledgment of privacy notice | Non-sensitive status flag. |

---

## 7. Environment Variable Definitions

All dynamic endpoints are configured through standardized Vite environment variables defined in `.env.example`:

| Environment Variable | Description | Sample / Default |
| :--- | :--- | :--- |
| `VITE_SITE_URL` | Canonical public application base URL | `https://www.azaroth-techhive.com` |
| `VITE_API_BASE_URL` | Base endpoint for API handlers and form submissions | `/api` |
| `VITE_SUPPORT_PHONE` | Primary corporate telephone number | `+91 6379480931` |
| `VITE_SUPPORT_EMAIL` | Primary corporate inquiries email | `hello@azaroth-techhive.com` |
| `VITE_ENABLE_ADMIN_CONSOLE` | Feature flag toggling admin console routes | `true` |
| `VITE_ENABLE_ANALYTICS` | Feature flag for production telemetry | `false` |
