# Asset Inventory & Media Architecture

**Project:** Azaroth UI  
**Phase:** Phase 1 — Requirements and Reference Audit  
**Date:** 2026-10-11  

---

## 1. Overview

This document catalogs all static, vector, and typography assets required for the Azaroth UI application. It specifies sources, dimensions, file formats, accessibility alternatives, and optimization guidelines.

---

## 2. Brand Identity Assets

| Asset Name | Target Path | Format | Source / Reference | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Azaroth Brand Logo (Full)** | `public/assets/brand/azaroth-logo-full.svg` | SVG | Vector markup (`Azaroth-Tech-Hive-Logo.svg`) | Primary desktop header, footer brand column |
| **Azaroth Brand Emblem (Icon)** | `public/assets/brand/azaroth-emblem.svg` | SVG | Clean geometric tech-hive hex emblem | Mobile header, favicon base, watermark stamps |
| **Favicon SVG** | `public/favicon.svg` | SVG | Scalable vector icon | Modern browser tabs |
| **Favicon Multi-size** | `public/favicon-32x32.png`, `48x48.png`, `96x96.png`, `192x192.png` | PNG | Raster icons | Legacy browser tabs, Android home screen |
| **Apple Touch Icon** | `public/apple-touch-icon.png` | PNG (180x180) | Pre-rendered icon | iOS Safari home screen bookmark |
| **Web Manifest** | `public/site.webmanifest` | JSON | PWA manifest declaration | Web app installation metadata |

---

## 3. Typography Assets & Web Fonts

| Font Family | Weights Loaded | Source URL / Format | Fallback Stack | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Plus Jakarta Sans** | 300, 400, 500, 600, 700, 800 (normal & italic) | Google Fonts CDN via preconnected Google Fonts API (`fonts.googleapis.com`) | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Global headings, body copy, button labels, UI cards |
| **JetBrains Mono / Monospace** | 400, 600 | Local System Font Stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`) | `Courier New, monospace` | Technical specs, JSON payloads, API signatures in code blocks |

---

## 4. UI Icons & Vector Glyphs

The application utilizes the **Lucide** vector icon library. All icons are rendered as accessible inline SVGs with appropriate stroke widths (`1.75px` to `2px`) and consistent bounding boxes (`16px`, `20px`, `24px`).

| Icon Name | Category | Primary Usage Locations |
| :--- | :--- | :--- |
| `ShieldCheck` / `Lock` | Security & Trust | Enterprise Security pillar, compliance certifications, NDA badges |
| `Award` / `FileCheck` | Certifications | Uptime guarantees, SLA tables, verified partnership badges |
| `Cpu` / `Server` / `Database` | Infrastructure | Products catalog, Cloud Core specs, architecture diagrams |
| `ArrowRight` / `ChevronRight` | Navigation & CTAs | Conversion buttons ("Request for Quote", "Learn More"), breadcrumbs |
| `ChevronDown` | Interactive Controls | Nav dropdown triggers, accordion expand/collapse toggles |
| `CheckCircle2` | Feedback & Status | RFQ multi-step completion, SLA feature checkmarks, form success toasts |
| `Mail` / `Phone` / `MapPin` | Contact Details | Chennai Head Office card, footer contact column |
| `Linkedin` / `Twitter` / `Github` | Social Channels | Global footer social links, author bio profile links |
| `Menu` / `X` | Responsive Navigation | Mobile slide-over drawer toggle and close actions |
| `Copy` / `Check` | Code Blocks | Technical documentation code snippet copy interaction |

---

## 5. Architectural Graphics & Diagrams

| Asset Name | Target File | Format | Description / Subject |
| :--- | :--- | :--- | :--- |
| **Delivery Framework Pipeline** | Rendered via SVG Component | SVG | Interactive 6-stage pipeline infographic illustrating Discovery through 24/7 Operations. |
| **Zero-Trust Cloud Topology** | `public/assets/diagrams/cloud-topology.svg` | SVG | Architectural diagram showcasing microservices mesh, API gateway, and distributed storage. |
| **Enterprise AI Data Flow** | `public/assets/diagrams/ai-data-flow.svg` | SVG | Technical diagram detailing ingestion, vector embedding, LLM orchestration, and telemetry. |

---

## 6. Asset Optimization & Performance Guidelines

1. **Vector First:** All branding, glyphs, and diagrams are provided in SVG format to guarantee zero pixelation on high-DPI Retina displays and near-zero file sizes (< 5KB per icon).
2. **Font Preconnecting:** High-priority `<link rel="preconnect">` tags for `fonts.googleapis.com` and `fonts.gstatic.com` eliminate render-blocking font latency.
3. **Lazy Loading:** Any non-critical raster imagery or media files carry `loading="lazy"` and `decoding="async"` attributes with explicit `width` and `height` properties to prevent cumulative layout shift (CLS).
4. **No Third-Party Tracker Assets:** Only trusted production analytics/monitoring tokens are permitted.
