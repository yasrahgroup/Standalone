# Risk Register & Technical Risk Management

**Project:** Azaroth UI  
**Phase:** Phase 1 — Requirements and Reference Audit  
**Date:** 2026-10-11  

---

## 1. Overview

This Risk Register identifies, analyzes, and establishes mitigation and contingency protocols for technical, architectural, operational, and client-requirement risks associated with the Azaroth UI web platform implementation.

---

## 2. Risk Matrix & Scoring Model

* **Severity / Impact:** High (3), Medium (2), Low (1)
* **Probability / Likelihood:** High (3), Medium (2), Low (1)
* **Risk Score:** Severity × Probability (1-9 scale: 1-2 Low, 3-4 Medium, 6-9 High)

---

## 3. Comprehensive Risk Register

| Risk ID | Category | Risk Description | Sev | Prob | Score | Mitigation Strategy | Contingency Plan | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Tooling / Runtime | Node.js `v24.13.0` bleeding-edge version causing bundler/plugin incompatibility. | 2 | 2 | 4 (Med) | Lock dependencies to verified LTS-compatible packages (Vite 5+, modern ESNext). | Fallback to standard Node LTS compatible configurations without bleeding-edge experimental flags. | **Mitigated** |
| **RSK-02** | Testing / Automation | Playwright driver 404 download error due to container network restrictions. | 2 | 3 | 6 (High) | Perform static bundle decompilation, DOM inspection, and local preview validation; inform user per protocol. | Utilize headless unit and DOM component tests; prompt user for browser subagent approval. | **Active / Documented** |
| **RSK-03** | Requirements | Ambiguity in client change-request document regarding red-line deletions. | 3 | 2 | 6 (High) | Formally map all requirements in matrix; flag red-marked items as unconfirmed until explicitly approved. | Retain modular feature flags so flagged content can be toggled without code refactoring. | **Flagged / Active** |
| **RSK-04** | Design & UX | Subpar or generic MVP styling failing to achieve rich enterprise aesthetic. | 3 | 1 | 3 (Med) | Implement custom Vanilla CSS design tokens, glassmorphism (`backdrop-blur-md`), deep emerald + gold accents, and micro-interactions. | Conduct automated visual audits and contrast checks against WCAG AA standards. | **Mitigated** |
| **RSK-05** | Responsiveness | Multi-step RFQ wizard and complex SLA matrix breaking on small mobile viewports (<= 375px). | 2 | 2 | 4 (Med) | Mobile-first CSS layout with flexible stacked cards, touch-friendly tap targets (min 44px), and horizontal table scroll guards. | Render simplified mobile card views instead of wide multi-column tables below 640px. | **Mitigated** |
| **RSK-06** | State Management | User input loss in RFQ wizard upon accidental page refresh or backward navigation. | 2 | 2 | 4 (Med) | Implement lightweight `sessionStorage` draft persistence for wizard step state. | Automatically detect draft in session storage on wizard mount and offer "Resume Quote" prompt. | **Mitigated** |
| **RSK-07** | Performance / SEO | Heavy animations or unoptimized asset loading degrading Core Web Vitals (LCP > 2.5s). | 2 | 2 | 4 (Med) | Preload critical web fonts (`Plus Jakarta Sans`), use SVG vector graphics for all logos/icons, lazy load below-the-fold components. | Enforce Lighthouse CI checks targeting >= 90 score across Performance, SEO, and Accessibility. | **Mitigated** |
| **RSK-08** | Security & Privacy | Form endpoint abuse or exposure of client-side secrets. | 3 | 1 | 3 (Med) | Client-side rate limiting, email syntax verification, honeypot spam protection, and zero secret values committed to repo. | Server-side IP rate limiting and CAPTCHA fallback trigger if spam threshold exceeded. | **Mitigated** |

---

## 4. Continuous Monitoring & Review Plan

1. **Pre-Commit Checkpoint:** All commits verified against Git clean working tree and linter rules.
2. **Weekly Risk Triage:** Review client change-request clarifications with stakeholders to retire **RSK-03**.
3. **Automated Audits:** Run performance, responsive viewport, and contrast audits prior to Phase 4 handoff.
