import { test, expect } from '@playwright/test';

const mobileWidths = [360, 390, 414, 600, 768, 820, 1023];
const desktopWidths = [1024, 1180, 1280, 1440];

for (const width of mobileWidths) {
  test(`mobile navigation is visible and usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Open navigation' });
    await expect(toggle).toBeVisible();
    await toggle.click();

    const nav = page.locator('#mobile-navigation');
    await expect(nav).toBeVisible();

    const box = await nav.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThan(120);
    expect(box!.width).toBeGreaterThan(width * 0.9);

    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await nav.getByRole('button', { name: 'Toggle Our Portfolio submenu' }).click();
    await expect(nav.getByRole('link', { name: 'Explore Services' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Connect With Us' })).toBeVisible();
  });
}

for (const width of desktopWidths) {
  test(`desktop navigation is visible without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    await expect(page.getByRole('navigation', { name: 'Primary Navigation' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open navigation' })).toBeHidden();

    const headerFits = await page.locator('header').evaluate(
      (header) => header.scrollWidth <= window.innerWidth + 1,
    );
    expect(headerFits).toBe(true);
  });
}
