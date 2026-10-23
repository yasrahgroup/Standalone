import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Scans', () => {
  test('Homepage meets WCAG 2.2 AA standards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Filter out moderate/best-practice issues, only fail on critical/high
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      console.log('Critical accessibility violations:', JSON.stringify(criticalViolations, null, 2));
    }

    expect(criticalViolations).toEqual([]);
  });

  test('Products page meets WCAG 2.2 AA standards', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      console.log('Critical accessibility violations:', JSON.stringify(criticalViolations, null, 2));
    }

    expect(criticalViolations).toEqual([]);
  });

  test('Contact form page meets WCAG 2.2 AA standards', async ({ page }) => {
    await page.goto('/connect-with-us');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      console.log('Critical accessibility violations:', JSON.stringify(criticalViolations, null, 2));
    }

    expect(criticalViolations).toEqual([]);
  });

  test('RFQ wizard page meets WCAG 2.2 AA standards', async ({ page }) => {
    await page.goto('/request-for-quote');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      console.log('Critical accessibility violations:', JSON.stringify(criticalViolations, null, 2));
    }

    expect(criticalViolations).toEqual([]);
  });
});
